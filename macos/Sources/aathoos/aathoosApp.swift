import SwiftUI

@main
struct aathoosApp: App {
  var body: some Scene {
    WindowGroup {
      ContentView()
        .preferredColorScheme(.dark)
    }
    .windowStyle(.titleBar)
    .windowToolbarStyle(.unified(showsTitle: false))
    .defaultSize(width: 1100, height: 700)
    .commands {
      CommandGroup(replacing: .newItem) {}
    }
  }
}
