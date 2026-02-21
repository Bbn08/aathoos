import SwiftUI

struct ContentView: View {
  @State private var selection: AppSection? = .dashboard

  var body: some View {
    NavigationSplitView {
      SidebarView(selection: $selection)
        .navigationSplitViewColumnWidth(min: 180, ideal: 200, max: 240)
    } detail: {
      DetailRouter(section: selection)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.appBackground)
    }
    .background(Color.appBackground)
  }
}

// MARK: Sidebar

struct SidebarView: View {
  @Binding var selection: AppSection?

  var body: some View {
    List(AppSection.allCases, selection: $selection) { section in
      Label(section.rawValue, systemImage: section.icon)
        .tag(section)
    }
    .listStyle(.sidebar)
    .background(Color.appSurface)
    .safeAreaInset(edge: .top) {
      HStack {
        Text("aathoos")
          .font(.title3.weight(.bold))
          .foregroundStyle(Color.appForeground)
        Spacer()
      }
      .padding(.horizontal, 16)
      .padding(.vertical, 12)
    }
  }
}

// MARK: Detail router

struct DetailRouter: View {
  let section: AppSection?

  @ViewBuilder
  var body: some View {
    switch section {
    case .dashboard:    DashboardView()
    case .tasks:        TasksView()
    case .notes:        NotesView()
    case .studyPlanner: StudyPlannerView()
    case .goals:        GoalsView()
    case .focusMode:    FocusModeView()
    case nil:
      Text("Select a section from the sidebar.")
        .foregroundStyle(.secondary)
    }
  }
}
