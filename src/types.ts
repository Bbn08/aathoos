export type Priority = "Low" | "Medium" | "High";

export interface Task {
  id: string;
  title: string;
  notes: string | null;
  due_date: number | null;
  priority: Priority;
  is_completed: boolean;
  created_at: number;
  updated_at: number;
}

export interface Note {
  id: string;
  title: string;
  body: string;
  subject: string | null;
  created_at: number;
  updated_at: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string | null;
  target_date: number | null;
  progress: number;  // 0.0 – 1.0
  is_completed: boolean;
  created_at: number;
  updated_at: number;
}

export interface StudySession {
  id: string;
  subject: string;
  duration_secs: number;
  notes: string | null;
  started_at: number;
}

export type Page =
  | "dashboard"
  | "tasks"
  | "notes"
  | "goals"
  | "study"
  | "focus";
