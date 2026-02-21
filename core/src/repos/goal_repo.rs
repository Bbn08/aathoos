use chrono::Utc;
use rusqlite::params;
use uuid::Uuid;

use crate::{
    db::Database,
    error::{CoreError, Result},
    models::goal::Goal,
};

pub struct GoalRepo<'a> {
    db: &'a Database,
}

impl<'a> GoalRepo<'a> {
    pub fn new(db: &'a Database) -> Self {
        Self { db }
    }

    pub fn create(
        &self,
        title: &str,
        description: Option<&str>,
        target_date: Option<i64>,
    ) -> Result<Goal> {
        let now = Utc::now().timestamp();
        let goal = Goal {
            id: Uuid::new_v4().to_string(),
            title: title.to_owned(),
            description: description.map(str::to_owned),
            target_date,
            progress: 0.0,
            is_completed: false,
            created_at: now,
            updated_at: now,
        };

        self.db.conn.execute(
            "INSERT INTO goals
            (id, title, description, target_date, progress, is_completed, created_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            params![
                goal.id,
                goal.title,
                goal.description,
                goal.target_date,
                goal.progress,
                goal.is_completed as i64,
                goal.created_at,
                goal.updated_at,
            ],
        )?;

        Ok(goal)
    }

    pub fn get_by_id(&self, id: &str) -> Result<Goal> {
        let mut stmt = self.db.conn.prepare(
            "SELECT id, title, description, target_date, progress, is_completed, created_at, updated_at
            FROM goals WHERE id = ?1",
        )?;

        stmt.query_row(params![id], row_to_goal)
            .map_err(|_| CoreError::NotFound(id.to_owned()))
    }

    pub fn list_all(&self) -> Result<Vec<Goal>> {
        let mut stmt = self.db.conn.prepare(
            "SELECT id, title, description, target_date, progress, is_completed, created_at, updated_at
            FROM goals ORDER BY created_at DESC",
        )?;

        let rows = stmt.query_map([], row_to_goal)?;
        rows.collect::<std::result::Result<Vec<_>, _>>()
            .map_err(CoreError::Database)
    }

    /// Set progress (0.0–1.0). Automatically marks completed when progress reaches 1.0.
    pub fn set_progress(&self, id: &str, progress: f64) -> Result<()> {
        let progress = progress.clamp(0.0, 1.0);
        let is_completed = progress >= 1.0;
        let updated_at = Utc::now().timestamp();

        let rows = self.db.conn.execute(
            "UPDATE goals SET progress = ?1, is_completed = ?2, updated_at = ?3 WHERE id = ?4",
            params![progress, is_completed as i64, updated_at, id],
        )?;

        if rows == 0 {
            return Err(CoreError::NotFound(id.to_owned()));
        }
        Ok(())
    }

    pub fn delete(&self, id: &str) -> Result<()> {
        let rows = self.db.conn.execute("DELETE FROM goals WHERE id = ?1", params![id])?;

        if rows == 0 {
            return Err(CoreError::NotFound(id.to_owned()));
        }
        Ok(())
    }
}

fn row_to_goal(row: &rusqlite::Row<'_>) -> rusqlite::Result<Goal> {
    Ok(Goal {
        id:           row.get(0)?,
        title:        row.get(1)?,
        description:  row.get(2)?,
        target_date:  row.get(3)?,
        progress:     row.get(4)?,
        is_completed: row.get::<_, i64>(5)? != 0,
        created_at:   row.get(6)?,
        updated_at:   row.get(7)?,
    })
}
