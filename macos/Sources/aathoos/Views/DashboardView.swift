import SwiftUI

struct DashboardView: View {
  var body: some View {
    VStack(spacing: 0) {
      SectionHeader(section: .dashboard)
      Divider().overlay(Color.appBorder)

      ScrollView {
        VStack(alignment: .leading, spacing: 28) {
          // Stat cards row
          LazyVGrid(
            columns: [GridItem(.adaptive(minimum: 180), spacing: 16)],
            spacing: 16
          ) {
            StatCard(label: "Tasks due today", value: "0", icon: "checkmark.circle")
            StatCard(label: "Notes",            value: "0", icon: "note.text")
            StatCard(label: "Goals in progress",value: "0", icon: "target")
            StatCard(label: "Study sessions",   value: "0", icon: "calendar")
          }

          // Up next placeholder
          VStack(alignment: .leading, spacing: 12) {
            Text("Up next")
              .font(.headline)
              .foregroundStyle(Color.appForeground)

            EmptyCard(
              icon: "tray",
              message: "Nothing scheduled yet. Add tasks to get started."
            )
          }
        }
        .padding(32)
      }
    }
  }
}

// MARK: Sub-components

struct StatCard: View {
  let label: String
  let value: String
  let icon: String

  var body: some View {
    HStack(alignment: .top) {
      VStack(alignment: .leading, spacing: 6) {
        Text(value)
          .font(.system(size: 34, weight: .bold, design: .rounded))
          .foregroundStyle(Color.appForeground)
        Text(label)
          .font(.subheadline)
          .foregroundStyle(Color.appForeground.opacity(0.5))
      }
      Spacer()
      Image(systemName: icon)
        .font(.title2)
        .foregroundStyle(Color.appAccent)
    }
    .padding(20)
    .background(Color.appSurface)
    .overlay(
      RoundedRectangle(cornerRadius: 12)
        .strokeBorder(Color.appBorder, lineWidth: 1)
    )
    .cornerRadius(12)
  }
}

struct EmptyCard: View {
  let icon: String
  let message: String

  var body: some View {
    HStack(spacing: 12) {
      Image(systemName: icon)
        .font(.title3)
        .foregroundStyle(Color.appForeground.opacity(0.3))
      Text(message)
        .font(.subheadline)
        .foregroundStyle(Color.appForeground.opacity(0.35))
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .padding(20)
    .background(Color.appSurface)
    .overlay(
      RoundedRectangle(cornerRadius: 12)
        .strokeBorder(Color.appBorder, lineWidth: 1)
    )
    .cornerRadius(12)
  }
}
