use chrono::Utc;
use rusqlite::params;
use uuid::Uuid;

use crate::{
    db::Database,
    error::{CoreError, Result},
    models::note::Note,
};

pub struct NoteRepo<'a> {
    db: &'a Database,
}

impl<'a> NoteRepo<'a> {
    pub fn new(db: &'a Database) -> Self {
        Self { db }
    }

    pub fn create(&self, title: &str, body: &str, subject: Option<&str>) -> Result<Note> {
        let now = Utc::now().timestamp();
        let note = Note {
            id: Uuid::new_v4().to_string(),
            title: title.to_owned(),
            body: body.to_owned(),
            subject: subject.map(str::to_owned),
            created_at: now,
            updated_at: now,
        };

        self.db.conn.execute(
            "INSERT INTO notes (id, title, body, subject, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            params![note.id, note.title, note.body, note.subject, note.created_at, note.updated_at],
        )?;

        Ok(note)
    }

    pub fn get_by_id(&self, id: &str) -> Result<Note> {
        let mut stmt = self.db.conn.prepare(
            "SELECT id, title, body, subject, created_at, updated_at FROM notes WHERE id = ?1",
        )?;

        stmt.query_row(params![id], row_to_note)
            .map_err(|_| CoreError::NotFound(id.to_owned()))
    }

    pub fn list_all(&self) -> Result<Vec<Note>> {
        let mut stmt = self.db.conn.prepare(
            "SELECT id, title, body, subject, created_at, updated_at
             FROM notes ORDER BY updated_at DESC",
        )?;

        let rows = stmt.query_map([], row_to_note)?;
        rows.collect::<std::result::Result<Vec<_>, _>>()
            .map_err(CoreError::Database)
    }

    pub fn list_by_subject(&self, subject: &str) -> Result<Vec<Note>> {
        let mut stmt = self.db.conn.prepare(
            "SELECT id, title, body, subject, created_at, updated_at
             FROM notes WHERE subject = ?1 ORDER BY updated_at DESC",
        )?;

        let rows = stmt.query_map(params![subject], row_to_note)?;
        rows.collect::<std::result::Result<Vec<_>, _>>()
            .map_err(CoreError::Database)
    }

    pub fn update_body(&self, id: &str, body: &str) -> Result<()> {
        let updated_at = Utc::now().timestamp();
        let rows = self.db.conn.execute(
            "UPDATE notes SET body = ?1, updated_at = ?2 WHERE id = ?3",
            params![body, updated_at, id],
        )?;

        if rows == 0 {
            return Err(CoreError::NotFound(id.to_owned()));
        }
        Ok(())
    }

    pub fn delete(&self, id: &str) -> Result<()> {
        let rows = self.db.conn.execute("DELETE FROM notes WHERE id = ?1", params![id])?;

        if rows == 0 {
            return Err(CoreError::NotFound(id.to_owned()));
        }
        Ok(())
    }
}

fn row_to_note(row: &rusqlite::Row<'_>) -> rusqlite::Result<Note> {
    Ok(Note {
        id:         row.get(0)?,
        title:      row.get(1)?,
        body:       row.get(2)?,
        subject:    row.get(3)?,
        created_at: row.get(4)?,
        updated_at: row.get(5)?,
    })
}
