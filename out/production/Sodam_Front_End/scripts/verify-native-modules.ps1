param(
  [string]$Device = 'auto',
  [string]$Out = 'logs\\verify-native-modules.log'
)

# Purpose: Verify presence of key native modules and capture indicative logs
# Usage: powershell -ExecutionPolicy Bypass -File .\scripts\verify-native-modules.ps1 -Device auto -Out logs\verify-native-modules.log

$ErrorActionPreference = 'Continue'

Write-Host "[VERIFY] Starting native modules verification..." -ForegroundColor Cyan

# 1) Package presence
Write-Host "[VERIFY] npm ls react-native-gesture-handler"
try { npm ls react-native-gesture-handler | Out-File -FilePath $Out -Append -Encoding UTF8 } catch {}

Write-Host "[VERIFY] npm ls react-native-screens"
try { npm ls react-native-screens | Out-File -FilePath $Out -Append -Encoding UTF8 } catch {}

# 2) Check generated autolinking files existence
$autoLinkDir = "android\\app\\build\\generated\\autolinking"
Write-Host "[VERIFY] Checking autolinking dir: $autoLinkDir"
if (Test-Path $autoLinkDir) {
  (Get-ChildItem -Recurse $autoLinkDir | Select-Object FullName) | Out-File -FilePath $Out -Append -Encoding UTF8
} else {
  "[VERIFY][WARN] Autolinking dir missing: $autoLinkDir" | Out-File -FilePath $Out -Append -Encoding UTF8
}

# 3) Capture short Logcat window for missing-module signatures
$tags = 'ReactNative|ReactNativeJS|AndroidRuntime|ReactNativeJNI|\[RECOVERY\]'
$logCmd = "powershell -ExecutionPolicy Bypass -File .\\scripts\\logcat-monitor.ps1 -Device $Device -Out $Out -TimeoutSec 10 -Tags \"$tags\""
Write-Host "[VERIFY] Capturing Logcat: $logCmd"
Invoke-Expression $logCmd | Out-Null

# 4) Post-scan signatures
$logContent = Get-Content $Out -Raw
$errors = @()
if ($logContent -match 'RNGestureHandlerModule could not be found') { $errors += 'RNGestureHandler missing' }
if ($logContent -match "Screen native module hasn't been linked") { $errors += 'react-native-screens missing' }

if ($errors.Count -eq 0) {
  Write-Host "[VERIFY] OK — No missing native module messages found." -ForegroundColor Green
  "[VERIFY] OK — No missing native module messages found." | Out-File -FilePath $Out -Append -Encoding UTF8
  exit 0
} else {
  $msg = "[VERIFY] FAIL — Detected: {0}" -f ($errors -join ', ')
  Write-Host $msg -ForegroundColor Yellow
  $msg | Out-File -FilePath $Out -Append -Encoding UTF8
  exit 1
}
