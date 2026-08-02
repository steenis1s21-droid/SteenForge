param(
    [string]$SourceDir = "Sleep journal wip",
    [string]$TargetDir = "sleep-journal-web"
)

$ErrorActionPreference = 'Stop'

$sourceRoot = Join-Path $PSScriptRoot $SourceDir
$targetRoot = Join-Path $PSScriptRoot $TargetDir
$sourceHtml = Join-Path $sourceRoot 'SleepJournal_Alpha_stable.html'
$sourceCss = Join-Path $sourceRoot 'SleepJournal_Alpha_stable.css'
$sourceJs = Join-Path $sourceRoot 'SleepJournal_Alpha_stable.js'
$siteDataFile = Join-Path $PSScriptRoot 'app.js'
$resolvedSourceRoot = [System.IO.Path]::GetFullPath($sourceRoot)
$resolvedTargetRoot = [System.IO.Path]::GetFullPath($targetRoot)

if (-not (Test-Path $sourceHtml)) {
    throw "Source HTML not found: $sourceHtml"
}

if (-not (Test-Path $sourceCss)) {
    throw "Source CSS not found: $sourceCss"
}

if (-not (Test-Path $sourceJs)) {
    throw "Source JS not found: $sourceJs"
}

if ($resolvedSourceRoot -eq $resolvedTargetRoot) {
    throw "Source and target directories must be different."
}

if (Test-Path $targetRoot) {
    Remove-Item -Path $targetRoot -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $targetRoot | Out-Null

$html = Get-Content -Path $sourceHtml -Raw
$html = $html.Replace('SleepJournal_Alpha_stable.css', 'styles.css')
$html = $html.Replace('SleepJournal_Alpha_stable.js', 'app.js')

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText((Join-Path $targetRoot 'index.html'), $html, $utf8NoBom)
Copy-Item -Path $sourceCss -Destination (Join-Path $targetRoot 'styles.css') -Force
Copy-Item -Path $sourceJs -Destination (Join-Path $targetRoot 'app.js') -Force

$sourceBaseName = [System.IO.Path]::GetFileNameWithoutExtension($sourceHtml)
$versionMatch = [regex]::Match($sourceBaseName, 'SleepJournal_(.+?)_stable')
$sleepVersion = if ($versionMatch.Success) { $versionMatch.Groups[1].Value } else { 'WIP' }

if (Test-Path $siteDataFile) {
    $siteData = Get-Content -Path $siteDataFile -Raw
    $versionPattern = '(?s)(id:\s*"somndagboken",.*?version:\s*")([^"]+)(")'
    $downloadPattern = '(?s)(id:\s*"somndagboken",.*?downloads:\s*\[)(.*?)(\n\s*\],)'

    if (-not [regex]::IsMatch($siteData, $versionPattern)) {
        throw "Could not find S\u00f6mndagboken version field in $siteDataFile"
    }

    $siteData = [regex]::Replace(
        $siteData,
        $versionPattern,
        { param($match) $match.Groups[1].Value + $sleepVersion + $match.Groups[3].Value },
        1
    )

    $lineBreak = [Environment]::NewLine

    if (-not [regex]::IsMatch($siteData, $downloadPattern)) {
        throw "Could not find S\u00f6mndagboken downloads block in $siteDataFile"
    }

    $siteData = [regex]::Replace(
        $siteData,
        $downloadPattern,
        {
            param($match)
            $match.Groups[1].Value +
            $lineBreak +
            '      { platform: "Android", label: "S\u00f6mndagboken (.apk)", url: "#" },' +
            $lineBreak +
            '      { platform: "Web", label: "Sleep Journal Web", kind: "web", url: "sleep-journal-web/index.html" }' +
            $match.Groups[3].Value
        },
        1
    )

    [System.IO.File]::WriteAllText($siteDataFile, $siteData, $utf8NoBom)
}

Write-Host "Synced Sleep Journal web from $sourceRoot to $targetRoot"