# Build the aathoos-core Rust library as a Windows DLL.
#
# Output: windows\Native\aathoos_core.dll
#
# Usage (from repo root):
#   .\scripts\build-core-windows.ps1           # defaults to x64
#   .\scripts\build-core-windows.ps1 -Arch x86
#   .\scripts\build-core-windows.ps1 -Arch arm64
param(
  [ValidateSet("x64", "x86", "arm64")]
  [string]$Arch = "x64"
)

$ErrorActionPreference = "Stop"

$Target = switch ($Arch) {
  "x64"   { "x86_64-pc-windows-msvc" }
  "x86"   { "i686-pc-windows-msvc" }
  "arm64" { "aarch64-pc-windows-msvc" }
}

$RepoRoot = Split-Path -Parent $PSScriptRoot
$CoreDir  = Join-Path $RepoRoot "core"
$OutDir   = Join-Path $RepoRoot "windows\Native"

Write-Host "==> Building aathoos-core for Windows ($Arch / $Target)"

Push-Location $CoreDir
try {
  rustup target add $Target
  cargo build --release --lib --target $Target
} finally {
  Pop-Location
}

$Src = Join-Path $CoreDir "target\$Target\release\aathoos_core.dll"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
Copy-Item -Force $Src (Join-Path $OutDir "aathoos_core.dll")

Write-Host "==> Output: $OutDir\aathoos_core.dll"
