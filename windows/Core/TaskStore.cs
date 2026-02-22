using System.Collections.ObjectModel;

namespace aathoos.Core;

/// <summary>
/// Observable task list backed by the Rust core.
/// All public methods must be called from the UI thread.
/// </summary>
public sealed class TaskStore
{
    private readonly CoreBridge _bridge;

    public ObservableCollection<ATask> Tasks { get; } = [];

    public TaskStore(CoreBridge bridge)
    {
        _bridge = bridge;
        Refresh();
    }

    public void Refresh()
    {
        var tasks = _bridge.TaskListAll();
        Tasks.Clear();
        foreach (var t in tasks) Tasks.Add(t);
    }

    public void Add(string title, string? notes, int priority)
    {
        _bridge.TaskCreate(title, notes, priority);
        Refresh();
    }

    public void ToggleCompleted(ATask task)
    {
        _bridge.TaskSetCompleted(task.Id, !task.IsCompleted);
        Refresh();
    }

    public void Delete(string id)
    {
        _bridge.TaskDelete(id);
        Refresh();
    }
}
