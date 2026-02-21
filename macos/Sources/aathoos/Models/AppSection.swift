import SwiftUI

enum AppSection: String, CaseIterable, Identifiable, Hashable {
  case dashboard    = "Dashboard"
  case tasks        = "Tasks"
  case notes        = "Notes"
  case studyPlanner = "Study Planner"
  case goals        = "Goals"
  case focusMode    = "Focus Mode"

  var id: String { rawValue }

  var icon: String {
    switch self {
    case .dashboard:    return "square.grid.2x2"
    case .tasks:        return "checkmark.circle"
    case .notes:        return "note.text"
    case .studyPlanner: return "calendar"
    case .goals:        return "target"
    case .focusMode:    return "moon"
    }
  }

  var subtitle: String {
    switch self {
    case .dashboard:    return "Your day at a glance"
    case .tasks:        return "Deadlines, priorities, progress"
    case .notes:        return "Linked to subjects and topics"
    case .studyPlanner: return "Schedules around your calendar"
    case .goals:        return "Set and stay accountable"
    case .focusMode:    return "Minimize distractions"
    }
  }
}
