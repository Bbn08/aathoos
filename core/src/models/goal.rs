use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Goal {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
    /// Unix timestamp. None = open-ended goal.
    pub target_date: Option<i64>,
    /// 0.0 (not started) → 1.0 (complete).
    pub progress: f64,
    pub is_completed: bool,
    pub created_at: i64,
    pub updated_at: i64,
}
