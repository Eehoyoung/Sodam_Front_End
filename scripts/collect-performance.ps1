param(
    [int]$DurationSec = 30,
    [int]$IntervalMs = 1000,
    [string]$Package = 'com.sodam_front_end',
    [string]$Out = 'logs\\perf-collect.log'
)

# Purpose: Collect CPU and memory metrics from the target app over a short time window.
# Requires: adb available in PATH, device connected.
# Usage: powershell -ExecutionPolicy Bypass -File .\scripts\collect-performance.ps1 -DurationSec 60 -IntervalMs 500 -Out logs\perf-60s.log

$ErrorActionPreference = 'Continue'

function Get-AppPid($pkg)
{
    $ps = & adb shell pidof $pkg 2> $null
    if (-not $ps)
    {
        return $null
    }
    return $ps.Trim()
}

"[PERF] Collecting performance for package=$Package duration=${DurationSec}s interval=${IntervalMs}ms" | Out-File -FilePath $Out -Encoding UTF8

$pid = Get-AppPid $Package
if (-not $pid)
{
    "[PERF][WARN] PID not found for $Package. Is the app running?" | Out-File -FilePath $Out -Append -Encoding UTF8
    exit 1
}

$iterations = [Math]::Ceiling($DurationSec * 1000.0 / $IntervalMs)
for ($i = 0; $i -lt $iterations; $i++) {
    $ts = Get-Date -Format o
    $top = & adb shell top -b -n 1 -p $pid 2> $null
    $mem = & adb shell dumpsys meminfo $pid 2> $null
    "[TS]=$ts" | Out-File -FilePath $Out -Append -Encoding UTF8
    "[TOP]`n$top" | Out-File -FilePath $Out -Append -Encoding UTF8
    "[MEMINFO]`n$mem" | Out-File -FilePath $Out -Append -Encoding UTF8
    Start-Sleep -Milliseconds $IntervalMs
}

"[PERF] Done." | Out-File -FilePath $Out -Append -Encoding UTF8
