using System.Runtime.InteropServices;

namespace aathoos.Core;

/// <summary>
/// Raw P/Invoke declarations for aathoos_core.dll.
/// Use <see cref="CoreBridge"/> for typed access instead.
/// </summary>
internal static class CoreInterop
{
    private const string Lib = "aathoos_core";

    // ── Database lifecycle ────────────────────────────────────────────────────

    [DllImport(Lib)]
    public static extern IntPtr aathoos_db_open(
        [MarshalAs(UnmanagedType.LPUTF8Str)] string path);

    [DllImport(Lib)]
    public static extern void aathoos_db_close(IntPtr db);

    [DllImport(Lib)]
    public static extern void aathoos_free_string(IntPtr ptr);

    // ── Tasks ─────────────────────────────────────────────────────────────────

    [DllImport(Lib)]
    public static extern IntPtr aathoos_task_create(
        IntPtr db,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string title,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string? notes,
        long dueDate,
        int priority);

    [DllImport(Lib)]
    public static extern IntPtr aathoos_task_get(
        IntPtr db,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string id);

    [DllImport(Lib)]
    public static extern IntPtr aathoos_task_list_all(IntPtr db);

    [DllImport(Lib)]
    public static extern IntPtr aathoos_task_list_incomplete(IntPtr db);

    [DllImport(Lib)]
    [return: MarshalAs(UnmanagedType.I1)]
    public static extern bool aathoos_task_set_completed(
        IntPtr db,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string id,
        [MarshalAs(UnmanagedType.I1)] bool completed);

    [DllImport(Lib)]
    [return: MarshalAs(UnmanagedType.I1)]
    public static extern bool aathoos_task_update_title(
        IntPtr db,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string id,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string title);

    [DllImport(Lib)]
    [return: MarshalAs(UnmanagedType.I1)]
    public static extern bool aathoos_task_delete(
        IntPtr db,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string id);

    // ── Notes ─────────────────────────────────────────────────────────────────

    [DllImport(Lib)]
    public static extern IntPtr aathoos_note_create(
        IntPtr db,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string title,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string body,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string? subject);

    [DllImport(Lib)]
    public static extern IntPtr aathoos_note_get(
        IntPtr db,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string id);

    [DllImport(Lib)]
    public static extern IntPtr aathoos_note_list_all(IntPtr db);

    [DllImport(Lib)]
    public static extern IntPtr aathoos_note_list_by_subject(
        IntPtr db,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string subject);

    [DllImport(Lib)]
    [return: MarshalAs(UnmanagedType.I1)]
    public static extern bool aathoos_note_update_body(
        IntPtr db,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string id,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string body);

    [DllImport(Lib)]
    [return: MarshalAs(UnmanagedType.I1)]
    public static extern bool aathoos_note_delete(
        IntPtr db,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string id);

    // ── Goals ─────────────────────────────────────────────────────────────────

    [DllImport(Lib)]
    public static extern IntPtr aathoos_goal_create(
        IntPtr db,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string title,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string? description,
        long targetDate);

    [DllImport(Lib)]
    public static extern IntPtr aathoos_goal_get(
        IntPtr db,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string id);

    [DllImport(Lib)]
    public static extern IntPtr aathoos_goal_list_all(IntPtr db);

    [DllImport(Lib)]
    [return: MarshalAs(UnmanagedType.I1)]
    public static extern bool aathoos_goal_set_progress(
        IntPtr db,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string id,
        double progress);

    [DllImport(Lib)]
    [return: MarshalAs(UnmanagedType.I1)]
    public static extern bool aathoos_goal_delete(
        IntPtr db,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string id);

    // ── Study Sessions ────────────────────────────────────────────────────────

    [DllImport(Lib)]
    public static extern IntPtr aathoos_study_session_create(
        IntPtr db,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string subject,
        long durationSecs,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string? notes);

    [DllImport(Lib)]
    public static extern IntPtr aathoos_study_session_get(
        IntPtr db,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string id);

    [DllImport(Lib)]
    public static extern IntPtr aathoos_study_session_list_all(IntPtr db);

    [DllImport(Lib)]
    public static extern IntPtr aathoos_study_session_list_by_subject(
        IntPtr db,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string subject);

    [DllImport(Lib)]
    public static extern long aathoos_study_session_total_duration(
        IntPtr db,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string subject);

    [DllImport(Lib)]
    [return: MarshalAs(UnmanagedType.I1)]
    public static extern bool aathoos_study_session_delete(
        IntPtr db,
        [MarshalAs(UnmanagedType.LPUTF8Str)] string id);
}
