using aathoos.Core;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace aathoos.Views;

public sealed partial class TasksPage : Page
{
    private readonly TaskStore _store = new(AppDatabase.Instance.Bridge);

    public TasksPage()
    {
        InitializeComponent();
        Loaded += (_, _) => Refresh();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private void Refresh()
    {
        _store.Refresh();
        TaskList.ItemsSource = null;
        TaskList.ItemsSource = _store.Tasks;

        var empty = _store.Tasks.Count == 0;
        EmptyState.Visibility = empty ? Visibility.Visible : Visibility.Collapsed;
        TaskList.Visibility   = empty ? Visibility.Collapsed : Visibility.Visible;
    }

    // ── Event handlers ────────────────────────────────────────────────────────

    private void OnToggleClick(object sender, RoutedEventArgs e)
    {
        if (sender is Button { Tag: string id })
        {
            var task = _store.Tasks.FirstOrDefault(t => t.Id == id);
            if (task is not null) _store.ToggleCompleted(task);
            Refresh();
        }
    }

    private void OnDeleteClick(object sender, RoutedEventArgs e)
    {
        if (sender is Button { Tag: string id })
        {
            _store.Delete(id);
            Refresh();
        }
    }

    private async void OnAddClick(object sender, RoutedEventArgs e)
    {
        var titleBox = new TextBox { PlaceholderText = "Task title" };
        var notesBox = new TextBox { PlaceholderText = "Notes (optional)" };
        var priorityBox = new ComboBox { HorizontalAlignment = HorizontalAlignment.Stretch };
        priorityBox.Items.Add("Low");
        priorityBox.Items.Add("Medium");
        priorityBox.Items.Add("High");
        priorityBox.SelectedIndex = 1;

        var panel = new StackPanel { Spacing = 12 };
        panel.Children.Add(new TextBlock
        {
            Text  = "Title",
            Style = (Style)Application.Current.Resources["CaptionTextBlockStyle"],
        });
        panel.Children.Add(titleBox);
        panel.Children.Add(new TextBlock
        {
            Text  = "Notes",
            Style = (Style)Application.Current.Resources["CaptionTextBlockStyle"],
        });
        panel.Children.Add(notesBox);
        panel.Children.Add(new TextBlock
        {
            Text  = "Priority",
            Style = (Style)Application.Current.Resources["CaptionTextBlockStyle"],
        });
        panel.Children.Add(priorityBox);

        var dialog = new ContentDialog
        {
            Title             = "New Task",
            Content           = panel,
            PrimaryButtonText = "Add",
            CloseButtonText   = "Cancel",
            DefaultButton     = ContentDialogButton.Primary,
            XamlRoot          = XamlRoot,
        };

        var result = await dialog.ShowAsync();
        if (result != ContentDialogResult.Primary) return;

        var title = titleBox.Text.Trim();
        if (string.IsNullOrEmpty(title)) return;

        var notes    = string.IsNullOrWhiteSpace(notesBox.Text) ? null : notesBox.Text.Trim();
        var priority = priorityBox.SelectedIndex; // 0=Low 1=Medium 2=High

        _store.Add(title, notes, priority);
        Refresh();
    }
}
