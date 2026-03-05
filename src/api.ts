import { invoke } from "@tauri-apps/api/core";
import type { Task, Note, Goal, StudySession } from "./types";

// ── Tasks ────────────────────────────────────────────────────────────────────

export const taskCreate = (title: string, notes: string | null, priority: number) =>
  invoke<Task>("task_create", { title, notes, priority });

export const taskListAll = () =>
  invoke<Task[]>("task_list_all");

export const taskSetCompleted = (id: string, completed: boolean) =>
  invoke<void>("task_set_completed", { id, completed });

export const taskDelete = (id: string) =>
  invoke<void>("task_delete", { id });

// ── Notes ────────────────────────────────────────────────────────────────────

export const noteCreate = (title: string, body: string, subject: string | null) =>
  invoke<Note>("note_create", { title, body, subject });

export const noteListAll = () =>
  invoke<Note[]>("note_list_all");

export const noteUpdateBody = (id: string, body: string) =>
  invoke<void>("note_update_body", { id, body });

export const noteDelete = (id: string) =>
  invoke<void>("note_delete", { id });

// ── Goals ────────────────────────────────────────────────────────────────────

export const goalCreate = (title: string, description: string | null) =>
  invoke<Goal>("goal_create", { title, description });

export const goalListAll = () =>
  invoke<Goal[]>("goal_list_all");

export const goalSetProgress = (id: string, progress: number) =>
  invoke<void>("goal_set_progress", { id, progress });

export const goalDelete = (id: string) =>
  invoke<void>("goal_delete", { id });

// ── Study Sessions ───────────────────────────────────────────────────────────

export const studyCreate = (subject: string, durationSecs: number, notes: string | null) =>
  invoke<StudySession>("study_session_create", {
    subject,
    duration_secs: durationSecs,
    notes,
  });

export const studyListAll = () =>
  invoke<StudySession[]>("study_session_list_all");

export const studyDelete = (id: string) =>
  invoke<void>("study_session_delete", { id });
