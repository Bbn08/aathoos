use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Task {
    pub id: String,
    pub title: String,
    pub notes: Option<String>,
    /// Unix timestamp (seconds). None = no due date.
    pub due_date: Option<i64>,
    pub priority: Priority,
    pub is_completed: bool,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[repr(i64)]
pub enum Priority {
    Low    = 0,
    Medium = 1,
    High   = 2,
}

impl From<i64> for Priority {
    fn from(v: i64) -> Self {
        match v {
            0 => Self::Low,
            2 => Self::High,
            _ => Self::Medium,
        }
    }
}
