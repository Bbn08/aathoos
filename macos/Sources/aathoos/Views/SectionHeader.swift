import SwiftUI

/// Shared header used by every section view.
struct SectionHeader: View {
  let section: AppSection

  var body: some View {
    VStack(alignment: .leading, spacing: 4) {
      Text(section.rawValue)
        .font(.largeTitle.weight(.bold))
        .foregroundStyle(Color.appForeground)
      Text(section.subtitle)
        .font(.subheadline)
        .foregroundStyle(Color.appForeground.opacity(0.5))
    }
    .frame(maxWidth: .infinity, alignment: .leading)
    .padding(.horizontal, 32)
    .padding(.top, 32)
    .padding(.bottom, 20)
  }
}

/// Reusable "coming soon" body for sections that have no content yet.
struct SectionPlaceholderView: View {
  let section: AppSection

  var body: some View {
    VStack(spacing: 0) {
      SectionHeader(section: section)
      Divider().overlay(Color.appBorder)
      Spacer()
      VStack(spacing: 12) {
        Image(systemName: section.icon)
          .font(.system(size: 40))
          .foregroundStyle(Color.appAccent.opacity(0.8))
        Text("Coming soon")
          .font(.title3.weight(.semibold))
          .foregroundStyle(Color.appForeground)
        Text(section.subtitle)
          .font(.subheadline)
          .foregroundStyle(Color.appForeground.opacity(0.4))
      }
      Spacer()
    }
  }
}
