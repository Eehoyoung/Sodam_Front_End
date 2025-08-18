param(
  [string]$Device = 'auto',
  [int]$TimeoutSec = 12,
  [string]$OutDir = 'logs'
)

# Purpose: Automate a typical iteration: clear logs, optional clean, install, capture boot logs, run native verify, and print a quick gate decision.
# Usage: powershell -ExecutionPolicy Bypass -File .\scripts\run-iter-suite.ps1 -Device auto -TimeoutSec 15

$ErrorActionPreference = 'Continue'

if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Force -Path $OutDir | Out-Null }

$ts = (Get-Date -Format 'yyyyMMdd-HHmmss')
$bootLog = Join-Path $OutDir "iter-suite-boot-$ts.log"
$verifyLog = Join-Path $OutDir "iter-suite-verify-$ts.log"

Write-Host "[ITER] Clearing logcat..."
& powershell -ExecutionPolicy Bypass -File .\scripts\logcat-clear.ps1 | Out-Null

Write-Host "[ITER] Building & installing (npm run android)..."
try { npm run android } catch {}

Write-Host "[ITER] Capturing boot logs to $bootLog"
$tags = 'ReactNative|ReactNativeJS|AndroidRuntime|ReactNativeJNI|\[RECOVERY\]'
& powershell -ExecutionPolicy Bypass -File .\scripts\logcat-monitor.ps1 -Device $Device -Out $bootLog -TimeoutSec $TimeoutSec -Tags $tags | Out-Null

Write-Host "[ITER] Verifying native modules to $verifyLog"
$exit = 0
try {
  & powershell -ExecutionPolicy Bypass -File .\scripts\verify-native-modules.ps1 -Device $Device -Out $verifyLog
  $exit = $LASTEXITCODE
} catch { $exit = 1 }

if ($exit -eq 0) {
  Write-Host "[ITER] Gate 07 OK — native modules present" -ForegroundColor Green
} else {
  Write-Host "[ITER] Gate 07 FAIL — native modules missing. See $verifyLog" -ForegroundColor Yellow
}

Write-Host "[ITER] Suite complete. Logs: `n  - $bootLog `n  - $verifyLog"
