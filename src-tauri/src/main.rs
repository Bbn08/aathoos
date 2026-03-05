#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs, path::PathBuf, sync::Mutex};
use tauri::{Manager, State};

use aathoos_core::{
    Database,
    models::task::Priority,
    repos::{
        goal_repo::GoalRepo,
        note_repo::NoteRepo,
        study_session_repo::StudySessionRepo,
        task_repo::TaskRepo,
    },
};

// Re-export model types (they all derive Serialize so Tauri can return them as JSON)
use aathoos_core::models::{
    goal::Goal,
    note::Note,
    study_session::StudySession,
    task::Task,
};

struct AppState {
    db: Mutex<Database>,
}

// ── Task commands ────────────────────────────────────────────────────────────

#[tauri::command]
fn task_create(
    state: State<'_, AppState>,
    title: String,
    notes: Option<String>,
    priority: i64,
) -> Result<Task, String> {
    let db = state.db.lock().unwrap();
    TaskRepo::new(&db)
        .create(&title, notes.as_deref(), None, Priority::from(priority))
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn task_list_all(state: State<'_, AppState>) -> Result<Vec<Task>, String> {
    let db = state.db.lock().unwrap();
    TaskRepo::new(&db).list_all().map_err(|e| e.to_string())
}

#[tauri::command]
fn task_set_completed(
    state: State<'_, AppState>,
    id: String,
    completed: bool,
) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    TaskRepo::new(&db)
        .set_completed(&id, completed)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn task_delete(state: State<'_, AppState>, id: String) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    TaskRepo::new(&db).delete(&id).map_err(|e| e.to_string())
}

// ── Note commands ────────────────────────────────────────────────────────────

#[tauri::command]
fn note_create(
    state: State<'_, AppState>,
    title: String,
    body: String,
    subject: Option<String>,
) -> Result<Note, String> {
    let db = state.db.lock().unwrap();
    NoteRepo::new(&db)
        .create(&title, &body, subject.as_deref())
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn note_list_all(state: State<'_, AppState>) -> Result<Vec<Note>, String> {
    let db = state.db.lock().unwrap();
    NoteRepo::new(&db).list_all().map_err(|e| e.to_string())
}

#[tauri::command]
fn note_update_body(
    state: State<'_, AppState>,
    id: String,
    body: String,
) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    NoteRepo::new(&db)
        .update_body(&id, &body)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn note_delete(state: State<'_, AppState>, id: String) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    NoteRepo::new(&db).delete(&id).map_err(|e| e.to_string())
}

// ── Goal commands ────────────────────────────────────────────────────────────

#[tauri::command]
fn goal_create(
    state: State<'_, AppState>,
    title: String,
    description: Option<String>,
) -> Result<Goal, String> {
    let db = state.db.lock().unwrap();
    GoalRepo::new(&db)
        .create(&title, description.as_deref(), None)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn goal_list_all(state: State<'_, AppState>) -> Result<Vec<Goal>, String> {
    let db = state.db.lock().unwrap();
    GoalRepo::new(&db).list_all().map_err(|e| e.to_string())
}

#[tauri::command]
fn goal_set_progress(
    state: State<'_, AppState>,
    id: String,
    progress: f64,
) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    GoalRepo::new(&db)
        .set_progress(&id, progress)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn goal_delete(state: State<'_, AppState>, id: String) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    GoalRepo::new(&db).delete(&id).map_err(|e| e.to_string())
}

// ── Study Session commands ───────────────────────────────────────────────────

#[tauri::command]
fn study_session_create(
    state: State<'_, AppState>,
    subject: String,
    duration_secs: i64,
    notes: Option<String>,
) -> Result<StudySession, String> {
    let db = state.db.lock().unwrap();
    StudySessionRepo::new(&db)
        .create(&subject, duration_secs, notes.as_deref())
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn study_session_list_all(state: State<'_, AppState>) -> Result<Vec<StudySession>, String> {
    let db = state.db.lock().unwrap();
    StudySessionRepo::new(&db)
        .list_all()
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn study_session_delete(state: State<'_, AppState>, id: String) -> Result<(), String> {
    let db = state.db.lock().unwrap();
    StudySessionRepo::new(&db)
        .delete(&id)
        .map_err(|e| e.to_string())
}

// ── Entry point ──────────────────────────────────────────────────────────────

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let data_dir = app
                .path()
                .app_data_dir()
                .unwrap_or_else(|_| PathBuf::from("."));
            fs::create_dir_all(&data_dir).ok();
            let db_path = data_dir.join("aathoos.db");

            let db = Database::open(db_path.to_str().unwrap())
                .expect("failed to open database");
            app.manage(AppState { db: Mutex::new(db) });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            task_create,
            task_list_all,
            task_set_completed,
            task_delete,
            note_create,
            note_list_all,
            note_update_body,
            note_delete,
            goal_create,
            goal_list_all,
            goal_set_progress,
            goal_delete,
            study_session_create,
            study_session_list_all,
            study_session_delete,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
