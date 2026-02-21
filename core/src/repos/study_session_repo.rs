use chrono::Utc;
use rusqlite::params;
use uuid::Uuid;

use crate::{
    db::Database,
    error::{CoreError, Result},
    models::study_session::StudySession,
};

pub struct StudySessionRepo<'a> {
    db: &'a Database,
}

impl<'a> StudySessionRepo<'a> {
    pub fn new(db: &'a Database) -> Self {
        Self { db }
    }

    pub fn create(
        &self,
        subject: &str,
        duration_secs: i64,
        notes: Option<&str>,
    ) -> Result<StudySession> {
        let session = StudySession {
            id: Uuid::new_v4().to_string(),
            subject: subject.to_owned(),
            duration_secs,
            notes: notes.map(str::to_owned),
            started_at: Utc::now().timestamp(),
        };

        self.db.conn.execute(
            "INSERT INTO study_sessions (id, subject, duration_secs, notes, started_at)
             VALUES (?1, ?2, ?3, ?4, ?5)",
            params![
                session.id,
                session.subject,
                session.duration_secs,
                session.notes,
                session.started_at,
            ],
        )?;

        Ok(session)
    }

    pub fn get_by_id(&self, id: &str) -> Result<StudySession> {
        let mut stmt = self.db.conn.prepare(
            "SELECT id, subject, duration_secs, notes, started_at
             FROM study_sessions WHERE id = ?1",
        )?;

        stmt.query_row(params![id], row_to_session)
            .map_err(|_| CoreError::NotFound(id.to_owned()))
    }

    pub fn list_all(&self) -> Result<Vec<StudySession>> {
        let mut stmt = self.db.conn.prepare(
            "SELECT id, subject, duration_secs, notes, started_at
             FROM study_sessions ORDER BY started_at DESC",
        )?;

        let rows = stmt.query_map([], row_to_session)?;
        rows.collect::<std::result::Result<Vec<_>, _>>()
            .map_err(CoreError::Database)
    }

    pub fn list_by_subject(&self, subject: &str) -> Result<Vec<StudySession>> {
        let mut stmt = self.db.conn.prepare(
            "SELECT id, subject, duration_secs, notes, started_at
             FROM study_sessions WHERE subject = ?1 ORDER BY started_at DESC",
        )?;

        let rows = stmt.query_map(params![subject], row_to_session)?;
        rows.collect::<std::result::Result<Vec<_>, _>>()
            .map_err(CoreError::Database)
    }

    /// Total seconds studied for a given subject. Returns 0 if no sessions exist.
    pub fn total_duration_for_subject(&self, subject: &str) -> Result<i64> {
        let total: i64 = self.db.conn.query_row(
            "SELECT COALESCE(SUM(duration_secs), 0) FROM study_sessions WHERE subject = ?1",
            params![subject],
            |row| row.get(0),
        )?;
        Ok(total)
    }

    pub fn delete(&self, id: &str) -> Result<()> {
        let rows = self.db.conn.execute(
            "DELETE FROM study_sessions WHERE id = ?1",
            params![id],
        )?;

        if rows == 0 {
            return Err(CoreError::NotFound(id.to_owned()));
        }
        Ok(())
    }
}

fn row_to_session(row: &rusqlite::Row<'_>) -> rusqlite::Result<StudySession> {
    Ok(StudySession {
        id:            row.get(0)?,
        subject:       row.get(1)?,
        duration_secs: row.get(2)?,
        notes:         row.get(3)?,
        started_at:    row.get(4)?,
    })
}
