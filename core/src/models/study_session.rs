use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StudySession {
    pub id: String,
    pub subject: String,
    /// How long the session lasted in seconds.
    pub duration_secs: i64,
    pub notes: Option<String>,
    /// Unix timestamp when the session started.
    pub started_at: i64,
}
