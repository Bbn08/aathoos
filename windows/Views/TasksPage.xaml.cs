using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using aathoos.Core;

namespace aathoos.Views;

public partial class TasksPage : UserControl
{
    private readonly TaskStore _store = new(AppDatabase.Instance.Bridge);

    // Brand colours
    private static readonly SolidColorBrush FgBrush       = new(Color.FromArgb(0xFF, 0xdb, 0xdc, 0xd7));
    private static readonly SolidColorBrush MutedBrush    = new(Color.FromArgb(0x80, 0xdb, 0xdc, 0xd7));
    private static readonly SolidColorBrush AccentBrush   = new(Color.FromArgb(0xFF, 0xb8, 0x23, 0x5a));
    private static readonly SolidColorBrush SurfaceBrush  = new(Color.FromArgb(0xFF, 0x23, 0x20, 0x3a));
    private static readonly SolidColorBrush BadgeBrush    = new(Color.FromArgb(0x14, 0xdb, 0xdc, 0xd7));
    private static readonly SolidColorBrush TransparentBrush = new(Colors.Transparent);

    public TasksPage()
    {
        InitializeComponent();
        Loaded += (_, _) => Refresh();
    }

    // ── Refresh ───────────────────────────────────────────────────────────────

    private void Refresh()
    {
        _store.Refresh();
        TaskRows.Children.Clear();

        if (_store.Tasks.Count == 0)
        {
            TaskRows.Children.Add(BuildEmptyState());
            return;
        }

        foreach (var task in _store.Tasks)
            TaskRows.Children.Add(BuildTaskRow(task));
    }

    // ── Row builder ───────────────────────────────────────────────────────────

    private UIElement BuildEmptyState()
    {
        var panel = new StackPanel
        {
            HorizontalAlignment = HorizontalAlignment.Center,
            Margin = new Thickness(0, 80, 0, 0),
        };
        panel.Children.Add(new TextBlock
        {
            Text = "\uE73E",
            FontFamily = new FontFamily("Segoe MDL2 Assets"),
            FontSize = 40,
            HorizontalAlignment = HorizontalAlignment.Center,
            Foreground = new SolidColorBrush(Color.FromArgb(0x33, 0xdb, 0xdc, 0xd7)),
            Margin = new Thickness(0, 0, 0, 12),
        });
        panel.Children.Add(new TextBlock
        {
            Text = "No tasks yet",
            FontSize = 20,
            FontWeight = FontWeights.SemiBold,
            Foreground = new SolidColorBrush(Color.FromArgb(0x59, 0xdb, 0xdc, 0xd7)),
            HorizontalAlignment = HorizontalAlignment.Center,
            Margin = new Thickness(0, 0, 0, 6),
        });
        panel.Children.Add(new TextBlock
        {
            Text = "Press + to add your first task",
            FontSize = 13,
            Foreground = MutedBrush,
            HorizontalAlignment = HorizontalAlignment.Center,
        });
        return panel;
    }

    private UIElement BuildTaskRow(ATask task)
    {
        // Toggle button
        var toggleBtn = new Button
        {
            Background = TransparentBrush,
            BorderThickness = new Thickness(0),
            Padding = new Thickness(0),
            Width = 28,
            Height = 28,
            VerticalAlignment = VerticalAlignment.Center,
            Content = new TextBlock
            {
                Text = task.IsCompleted ? "\uE73E" : "\uE739",
                FontFamily = new FontFamily("Segoe MDL2 Assets"),
                FontSize = 18,
                Foreground = AccentBrush,
                Opacity = task.IsCompleted ? 1.0 : 0.4,
            },
            Tag = task,
            Cursor = System.Windows.Input.Cursors.Hand,
        };
        toggleBtn.Click += OnToggleClick;

        // Title
        var titleBlock = new TextBlock
        {
            Text = task.Title,
            FontSize = 14,
            Foreground = FgBrush,
            Opacity = task.IsCompleted ? 0.35 : 1.0,
            TextTrimming = TextTrimming.CharacterEllipsis,
            VerticalAlignment = VerticalAlignment.Center,
        };

        // Priority badge
        var priorityLabel = task.Priority switch
        {
            2 => "High",
            1 => "Medium",
            _ => "Low",
        };
        var priorityBadge = new Border
        {
            CornerRadius = new CornerRadius(4),
            Padding = new Thickness(7, 3, 7, 3),
            Background = BadgeBrush,
            VerticalAlignment = VerticalAlignment.Center,
            Child = new TextBlock
            {
                Text = priorityLabel,
                FontSize = 12,
                FontWeight = FontWeights.SemiBold,
                Foreground = AccentBrush,
            },
        };

        // Delete button
        var deleteBtn = new Button
        {
            Background = TransparentBrush,
            BorderThickness = new Thickness(0),
            Padding = new Thickness(0),
            Width = 28,
            Height = 28,
            Opacity = 0.4,
            VerticalAlignment = VerticalAlignment.Center,
            Content = new TextBlock
            {
                Text = "\uE74D",
                FontFamily = new FontFamily("Segoe MDL2 Assets"),
                FontSize = 13,
                Foreground = FgBrush,
            },
            Tag = task,
            Cursor = System.Windows.Input.Cursors.Hand,
        };
        deleteBtn.Click += OnDeleteClick;

        // Row grid (spacer columns replace ColumnSpacing)
        var grid = new Grid();
        grid.ColumnDefinitions.Add(new ColumnDefinition { Width = GridLength.Auto });
        grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(12, GridUnitType.Pixel) });
        grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });
        grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(8, GridUnitType.Pixel) });
        grid.ColumnDefinitions.Add(new ColumnDefinition { Width = GridLength.Auto });
        grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(8, GridUnitType.Pixel) });
        grid.ColumnDefinitions.Add(new ColumnDefinition { Width = GridLength.Auto });

        Grid.SetColumn(toggleBtn,    0);
        Grid.SetColumn(titleBlock,   2);
        Grid.SetColumn(priorityBadge, 4);
        Grid.SetColumn(deleteBtn,    6);

        grid.Children.Add(toggleBtn);
        grid.Children.Add(titleBlock);
        grid.Children.Add(priorityBadge);
        grid.Children.Add(deleteBtn);

        return new Border
        {
            CornerRadius = new CornerRadius(8),
            Margin = new Thickness(16, 3, 16, 3),
            Padding = new Thickness(16, 10, 16, 10),
            Background = SurfaceBrush,
            Child = grid,
        };
    }

    // ── Event handlers ────────────────────────────────────────────────────────

    private void OnToggleClick(object sender, RoutedEventArgs e)
    {
        if (sender is Button { Tag: ATask task })
        {
            _store.ToggleCompleted(task);
            Refresh();
        }
    }

    private void OnDeleteClick(object sender, RoutedEventArgs e)
    {
        if (sender is Button { Tag: ATask task })
        {
            _store.Delete(task.Id);
            Refresh();
        }
    }

    private void OnAddClick(object sender, RoutedEventArgs e)
    {
        var dialog = new AddTaskDialog { Owner = Window.GetWindow(this) };
        if (dialog.ShowDialog() != true) return;

        _store.Add(dialog.TaskTitle, dialog.TaskNotes, dialog.TaskPriority);
        Refresh();
    }
}
