using System.Windows;

namespace aathoos.Views;

public partial class AddTaskDialog : Window
{
    public string  TaskTitle    { get; private set; } = "";
    public string? TaskNotes    { get; private set; }
    public int     TaskPriority { get; private set; }

    public AddTaskDialog() => InitializeComponent();

    private void OnAdd(object sender, RoutedEventArgs e)
    {
        var title = TitleBox.Text.Trim();
        if (string.IsNullOrEmpty(title)) return;

        TaskTitle    = title;
        TaskNotes    = string.IsNullOrWhiteSpace(NotesBox.Text) ? null : NotesBox.Text.Trim();
        TaskPriority = PriorityBox.SelectedIndex;
        DialogResult = true;
    }

    private void OnCancel(object sender, RoutedEventArgs e) => DialogResult = false;
}
