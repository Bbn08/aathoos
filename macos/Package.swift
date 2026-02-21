// swift-tools-version: 5.9
import PackageDescription

let package = Package(
  name: "aathoos",
  platforms: [.macOS(.v13)],
  targets: [
    .executableTarget(
      name: "aathoos",
      path: "Sources/aathoos"
    ),
  ]
)
