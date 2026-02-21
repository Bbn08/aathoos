use rusqlite::Connection;
use crate::error::Result;

pub struct Database {
    pub conn: Connection,
}

impl Database {
    /// Open (or create) a database at the given file path.
    pub fn open(path: &str) -> Result<Self> {
        let conn = Connection::open(path)?;
        let db = Self { conn };
        db.migrate()?;
        Ok(db)
    }

    /// In-memory database — used in tests.
    pub fn open_in_memory() -> Result<Self> {
        let conn = Connection::open_in_memory()?;
        let db = Self { conn };
        db.migrate()?;
        Ok(db)
    }

    fn migrate(&self) -> Result<()> {
        self.conn.execute_batch("
            PRAGMA journal_mode = WAL;
            PRAGMA foreign_keys = ON;

            CREATE TABLE IF NOT EXISTS tasks (
                id           TEXT    PRIMARY KEY,
                title        TEXT    NOT NULL,
                notes        TEXT,
                due_date     INTEGER,
                priority     INTEGER NOT NULL DEFAULT 1,
                is_completed INTEGER NOT NULL DEFAULT 0,
                created_at   INTEGER NOT NULL,
                updated_at   INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS notes (
                id         TEXT    PRIMARY KEY,
                title      TEXT    NOT NULL,
                body       TEXT    NOT NULL DEFAULT '',
                subject    TEXT,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS goals (
                id           TEXT    PRIMARY KEY,
                title        TEXT    NOT NULL,
                description  TEXT,
                target_date  INTEGER,
                progress     REAL    NOT NULL DEFAULT 0.0,
                is_completed INTEGER NOT NULL DEFAULT 0,
                created_at   INTEGER NOT NULL,
                updated_at   INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS study_sessions (
                id            TEXT    PRIMARY KEY,
                subject       TEXT    NOT NULL,
                duration_secs INTEGER NOT NULL DEFAULT 0,
                notes         TEXT,
                started_at    INTEGER NOT NULL
            );
        ")?;
        Ok(())
    }
}
