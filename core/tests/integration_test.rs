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

// ── Tasks ──────────────────────────────────────────────────────────────────

#[test]
fn task_create_and_list() {
    let db = Database::open_in_memory().unwrap();
    let repo = TaskRepo::new(&db);

    let task = repo.create("Write essay", None, None, Priority::High).unwrap();
    assert_eq!(task.title, "Write essay");
    assert_eq!(task.priority, Priority::High);
    assert!(!task.is_completed);

    let all = repo.list_all().unwrap();
    assert_eq!(all.len(), 1);
    assert_eq!(all[0].id, task.id);
}

#[test]
fn task_complete_and_fetch() {
    let db = Database::open_in_memory().unwrap();
    let repo = TaskRepo::new(&db);

    let task = repo.create("Submit assignment", None, None, Priority::Medium).unwrap();
    repo.set_completed(&task.id, true).unwrap();

    let fetched = repo.get_by_id(&task.id).unwrap();
    assert!(fetched.is_completed);
}

#[test]
fn task_incomplete_list_excludes_done() {
    let db = Database::open_in_memory().unwrap();
    let repo = TaskRepo::new(&db);

    let t1 = repo.create("Pending task", None, None, Priority::Low).unwrap();
    let t2 = repo.create("Done task",    None, None, Priority::Low).unwrap();
    repo.set_completed(&t2.id, true).unwrap();

    let incomplete = repo.list_incomplete().unwrap();
    assert_eq!(incomplete.len(), 1);
    assert_eq!(incomplete[0].id, t1.id);
}

#[test]
fn task_delete() {
    let db = Database::open_in_memory().unwrap();
    let repo = TaskRepo::new(&db);

    let task = repo.create("To delete", None, None, Priority::Low).unwrap();
    repo.delete(&task.id).unwrap();

    assert_eq!(repo.list_all().unwrap().len(), 0);
}

#[test]
fn task_not_found_returns_error() {
    let db = Database::open_in_memory().unwrap();
    let repo = TaskRepo::new(&db);

    let result = repo.get_by_id("nonexistent-id");
    assert!(result.is_err());
}

// ── Notes ──────────────────────────────────────────────────────────────────

#[test]
fn note_create_and_list() {
    let db = Database::open_in_memory().unwrap();
    let repo = NoteRepo::new(&db);

    let note = repo.create("Lecture 1", "Key concepts...", Some("Physics")).unwrap();
    assert_eq!(note.title, "Lecture 1");
    assert_eq!(note.subject, Some("Physics".to_owned()));

    let all = repo.list_all().unwrap();
    assert_eq!(all.len(), 1);
}

#[test]
fn note_filter_by_subject() {
    let db = Database::open_in_memory().unwrap();
    let repo = NoteRepo::new(&db);

    repo.create("Lecture 1", "", Some("Physics")).unwrap();
    repo.create("Lecture 2", "", Some("Physics")).unwrap();
    repo.create("Lecture A", "", Some("Maths")).unwrap();

    let physics = repo.list_by_subject("Physics").unwrap();
    assert_eq!(physics.len(), 2);
}

#[test]
fn note_update_body() {
    let db = Database::open_in_memory().unwrap();
    let repo = NoteRepo::new(&db);

    let note = repo.create("Draft", "old body", None).unwrap();
    repo.update_body(&note.id, "new body").unwrap();

    let fetched = repo.get_by_id(&note.id).unwrap();
    assert_eq!(fetched.body, "new body");
}

// ── Goals ──────────────────────────────────────────────────────────────────

#[test]
fn goal_create_and_progress() {
    let db = Database::open_in_memory().unwrap();
    let repo = GoalRepo::new(&db);

    let goal = repo.create("Read 12 books", None, None).unwrap();
    assert_eq!(goal.progress, 0.0);
    assert!(!goal.is_completed);

    repo.set_progress(&goal.id, 0.5).unwrap();
    let updated = repo.get_by_id(&goal.id).unwrap();
    assert_eq!(updated.progress, 0.5);
    assert!(!updated.is_completed);
}

#[test]
fn goal_auto_completes_at_full_progress() {
    let db = Database::open_in_memory().unwrap();
    let repo = GoalRepo::new(&db);

    let goal = repo.create("Finish semester", None, None).unwrap();
    repo.set_progress(&goal.id, 1.0).unwrap();

    let updated = repo.get_by_id(&goal.id).unwrap();
    assert!(updated.is_completed);
}

// ── Study sessions ─────────────────────────────────────────────────────────

#[test]
fn study_session_create_and_total() {
    let db = Database::open_in_memory().unwrap();
    let repo = StudySessionRepo::new(&db);

    repo.create("Physics", 3600, None).unwrap();
    repo.create("Physics", 1800, Some("Revision")).unwrap();
    repo.create("Maths",   2400, None).unwrap();

    let total = repo.total_duration_for_subject("Physics").unwrap();
    assert_eq!(total, 5400);

    let sessions = repo.list_by_subject("Physics").unwrap();
    assert_eq!(sessions.len(), 2);
}
