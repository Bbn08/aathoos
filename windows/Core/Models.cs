using System.Text.Json.Serialization;

namespace aathoos.Core;

public sealed record ATask(
    [property: JsonPropertyName("id")]           string Id,
    [property: JsonPropertyName("title")]         string Title,
    [property: JsonPropertyName("notes")]         string? Notes,
    [property: JsonPropertyName("due_date")]      long? DueDate,
    [property: JsonPropertyName("priority")]      int Priority,
    [property: JsonPropertyName("is_completed")]  bool IsCompleted,
    [property: JsonPropertyName("created_at")]    long CreatedAt,
    [property: JsonPropertyName("updated_at")]    long UpdatedAt
);

public sealed record ANote(
    [property: JsonPropertyName("id")]         string Id,
    [property: JsonPropertyName("title")]       string Title,
    [property: JsonPropertyName("body")]        string Body,
    [property: JsonPropertyName("subject")]     string? Subject,
    [property: JsonPropertyName("created_at")] long CreatedAt,
    [property: JsonPropertyName("updated_at")] long UpdatedAt
);

public sealed record AGoal(
    [property: JsonPropertyName("id")]           string Id,
    [property: JsonPropertyName("title")]         string Title,
    [property: JsonPropertyName("description")]   string? Description,
    [property: JsonPropertyName("target_date")]   long? TargetDate,
    [property: JsonPropertyName("progress")]      double Progress,
    [property: JsonPropertyName("is_completed")]  bool IsCompleted,
    [property: JsonPropertyName("created_at")]    long CreatedAt,
    [property: JsonPropertyName("updated_at")]    long UpdatedAt
);

public sealed record AStudySession(
    [property: JsonPropertyName("id")]            string Id,
    [property: JsonPropertyName("subject")]        string Subject,
    [property: JsonPropertyName("duration_secs")] long DurationSecs,
    [property: JsonPropertyName("notes")]          string? Notes,
    [property: JsonPropertyName("started_at")]     long StartedAt
);
