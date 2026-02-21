use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Note {
    pub id: String,
    pub title: String,
    pub body: String,
    /// Optional subject / course the note belongs to.
    pub subject: Option<String>,
    pub created_at: i64,
    pub updated_at: i64,
}
