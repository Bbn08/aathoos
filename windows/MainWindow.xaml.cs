using System.Windows;
using System.Windows.Controls;
using aathoos.Views;

namespace aathoos;

public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();
        NavList.SelectedIndex = 0;
    }

    private void NavList_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if (NavList.SelectedItem is not ListBoxItem item) return;

        MainContent.Content = item.Tag?.ToString() switch
        {
            "Dashboard"    => (object)new DashboardPage(),
            "Tasks"        => new TasksPage(),
            "Notes"        => new NotesPage(),
            "StudyPlanner" => new StudyPlannerPage(),
            "Goals"        => new GoalsPage(),
            "FocusMode"    => new FocusModePage(),
            _              => null!,
        };
    }
}
