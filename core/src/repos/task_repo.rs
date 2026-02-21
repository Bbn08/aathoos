use chrono::Utc;
use rusqlite::params;
use uuid::Uuid;

use crate::{
    db::Database,
    error::{CoreError, Result},
    models::task::{Priority, Task},
};

pub struct TaskRepo<'a> {
    db: &'a Database,
}

impl<'a> TaskRepo<'a> {
    pub fn new(db: &'a Database) -> Self {
        Self { db }
    }

    pub fn create(
        &self,
        title: &str,
        notes: Option<&str>,
        due_date: Option<i64>,
        priority: Priority,
    ) -> Result<Task> {
        let now = Utc::now().timestamp();
        let task = Task {
            id: Uuid::new_v4().to_string(),
            title: title.to_owned(),
            notes: notes.map(str::to_owned),
            due_date,
            priority,
            is_completed: false,
            created_at: now,
            updated_at: now,
        };

        self.db.conn.execute(
            "INSERT INTO tasks
             (id, title, notes, due_date, priority, is_completed, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            params![
                task.id,
                task.title,
                task.notes,
                task.due_date,
                task.priority as i64,
                task.is_completed as i64,
                task.created_at,
                task.updated_at,
            ],
        )?;

        Ok(task)
    }

    pub fn get_by_id(&self, id: &str) -> Result<Task> {
        let mut stmt = self.db.conn.prepare(
            "SELECT id, title, notes, due_date, priority, is_completed, created_at, updated_at
             FROM tasks WHERE id = ?1",
        )?;

        stmt.query_row(params![id], row_to_task)
            .map_err(|_| CoreError::NotFound(id.to_owned()))
    }

    pub fn list_all(&self) -> Result<Vec<Task>> {
        let mut stmt = self.db.conn.prepare(
            "SELECT id, title, notes, due_date, priority, is_completed, created_at, updated_at
             FROM tasks ORDER BY created_at DESC",
        )?;

        let rows = stmt.query_map([], row_to_task)?;
        rows.collect::<std::result::Result<Vec<_>, _>>()
            .map_err(CoreError::Database)
    }

    pub fn list_incomplete(&self) -> Result<Vec<Task>> {
        let mut stmt = self.db.conn.prepare(
            "SELECT id, title, notes, due_date, priority, is_completed, created_at, updated_at
             FROM tasks WHERE is_completed = 0
             ORDER BY due_date ASC NULLS LAST, priority DESC",
        )?;

        let rows = stmt.query_map([], row_to_task)?;
        rows.collect::<std::result::Result<Vec<_>, _>>()
            .map_err(CoreError::Database)
    }

    pub fn set_completed(&self, id: &str, completed: bool) -> Result<()> {
        let updated_at = Utc::now().timestamp();
        let rows = self.db.conn.execute(
            "UPDATE tasks SET is_completed = ?1, updated_at = ?2 WHERE id = ?3",
            params![completed as i64, updated_at, id],
        )?;

        if rows == 0 {
            return Err(CoreError::NotFound(id.to_owned()));
        }
        Ok(())
    }

    pub fn update_title(&self, id: &str, title: &str) -> Result<()> {
        let updated_at = Utc::now().timestamp();
        let rows = self.db.conn.execute(
            "UPDATE tasks SET title = ?1, updated_at = ?2 WHERE id = ?3",
            params![title, updated_at, id],
        )?;

        if rows == 0 {
            return Err(CoreError::NotFound(id.to_owned()));
        }
        Ok(())
    }

    pub fn delete(&self, id: &str) -> Result<()> {
        let rows = self.db.conn.execute(
            "DELETE FROM tasks WHERE id = ?1",
            params![id],
        )?;

        if rows == 0 {
            return Err(CoreError::NotFound(id.to_owned()));
        }
        Ok(())
    }
}

fn row_to_task(row: &rusqlite::Row<'_>) -> rusqlite::Result<Task> {
    Ok(Task {
        id:           row.get(0)?,
        title:        row.get(1)?,
        notes:        row.get(2)?,
        due_date:     row.get(3)?,
        priority:     Priority::from(row.get::<_, i64>(4)?),
        is_completed: row.get::<_, i64>(5)? != 0,
        created_at:   row.get(6)?,
        updated_at:   row.get(7)?,
    })
}
