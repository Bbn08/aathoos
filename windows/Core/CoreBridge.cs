using System.Runtime.InteropServices;
using System.Text.Json;

namespace aathoos.Core;

/// <summary>
/// Typed Swift-style wrapper over <see cref="CoreInterop"/>.
/// All methods run synchronously on the calling thread.
/// </summary>
public sealed class CoreBridge
{
    private readonly IntPtr _db;

    public CoreBridge(IntPtr db) => _db = db;

    // ── Helpers ───────────────────────────────────────────────────────────────

    private static T? Decode<T>(IntPtr ptr)
    {
        if (ptr == IntPtr.Zero) return default;
        try
        {
            var json = Marshal.PtrToStringUTF8(ptr);
            if (json is null) return default;
            return JsonSerializer.Deserialize<T>(json);
        }
        finally
        {
            CoreInterop.aathoos_free_string(ptr);
        }
    }

    // ── Tasks ─────────────────────────────────────────────────────────────────

    public ATask? TaskCreate(string title, string? notes = null, int priority = 1)
        => Decode<ATask>(CoreInterop.aathoos_task_create(_db, title, notes, 0L, priority));

    public ATask? TaskGet(string id)
        => Decode<ATask>(CoreInterop.aathoos_task_get(_db, id));

    public List<ATask> TaskListAll()
        => Decode<List<ATask>>(CoreInterop.aathoos_task_list_all(_db)) ?? [];

    public List<ATask> TaskListIncomplete()
        => Decode<List<ATask>>(CoreInterop.aathoos_task_list_incomplete(_db)) ?? [];

    public bool TaskSetCompleted(string id, bool completed)
        => CoreInterop.aathoos_task_set_completed(_db, id, completed);

    public bool TaskUpdateTitle(string id, string title)
        => CoreInterop.aathoos_task_update_title(_db, id, title);

    public bool TaskDelete(string id)
        => CoreInterop.aathoos_task_delete(_db, id);

    // ── Notes ─────────────────────────────────────────────────────────────────

    public ANote? NoteCreate(string title, string body, string? subject = null)
        => Decode<ANote>(CoreInterop.aathoos_note_create(_db, title, body, subject));

    public ANote? NoteGet(string id)
        => Decode<ANote>(CoreInterop.aathoos_note_get(_db, id));

    public List<ANote> NoteListAll()
        => Decode<List<ANote>>(CoreInterop.aathoos_note_list_all(_db)) ?? [];

    public List<ANote> NoteListBySubject(string subject)
        => Decode<List<ANote>>(CoreInterop.aathoos_note_list_by_subject(_db, subject)) ?? [];

    public bool NoteUpdateBody(string id, string body)
        => CoreInterop.aathoos_note_update_body(_db, id, body);

    public bool NoteDelete(string id)
        => CoreInterop.aathoos_note_delete(_db, id);

    // ── Goals ─────────────────────────────────────────────────────────────────

    public AGoal? GoalCreate(string title, string? description = null, long targetDate = 0)
        => Decode<AGoal>(CoreInterop.aathoos_goal_create(_db, title, description, targetDate));

    public AGoal? GoalGet(string id)
        => Decode<AGoal>(CoreInterop.aathoos_goal_get(_db, id));

    public List<AGoal> GoalListAll()
        => Decode<List<AGoal>>(CoreInterop.aathoos_goal_list_all(_db)) ?? [];

    public bool GoalSetProgress(string id, double progress)
        => CoreInterop.aathoos_goal_set_progress(_db, id, progress);

    public bool GoalDelete(string id)
        => CoreInterop.aathoos_goal_delete(_db, id);

    // ── Study Sessions ────────────────────────────────────────────────────────

    public AStudySession? StudySessionCreate(string subject, long durationSecs, string? notes = null)
        => Decode<AStudySession>(CoreInterop.aathoos_study_session_create(_db, subject, durationSecs, notes));

    public AStudySession? StudySessionGet(string id)
        => Decode<AStudySession>(CoreInterop.aathoos_study_session_get(_db, id));

    public List<AStudySession> StudySessionListAll()
        => Decode<List<AStudySession>>(CoreInterop.aathoos_study_session_list_all(_db)) ?? [];

    public List<AStudySession> StudySessionListBySubject(string subject)
        => Decode<List<AStudySession>>(CoreInterop.aathoos_study_session_list_by_subject(_db, subject)) ?? [];

    public long StudySessionTotalDuration(string subject)
        => CoreInterop.aathoos_study_session_total_duration(_db, subject);

    public bool StudySessionDelete(string id)
        => CoreInterop.aathoos_study_session_delete(_db, id);
}
