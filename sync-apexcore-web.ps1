param(
    [string]$SourceDir = "ApexCore_3.0.3_stable",
    [string]$TargetDir = "dist-web"
)

$ErrorActionPreference = 'Stop'

$sourceRoot = Join-Path $PSScriptRoot $SourceDir
$targetRoot = Join-Path $PSScriptRoot $TargetDir
$sourceHtml = Join-Path $sourceRoot 'ApexCore_3.0.3_FinalFix.html'
$sourceAssets = Join-Path $sourceRoot 'assets'
$sourcePackage = Join-Path $sourceRoot 'package.json'
$siteDataFile = Join-Path $PSScriptRoot 'app.js'
$resolvedSourceRoot = [System.IO.Path]::GetFullPath($sourceRoot)
$resolvedTargetRoot = [System.IO.Path]::GetFullPath($targetRoot)

if (-not (Test-Path $sourceHtml)) {
    throw "Source HTML not found: $sourceHtml"
}

if (-not (Test-Path $sourceAssets)) {
    throw "Source assets folder not found: $sourceAssets"
}

if (-not (Test-Path $sourcePackage)) {
    throw "Source package.json not found: $sourcePackage"
}

if ($resolvedSourceRoot -eq $resolvedTargetRoot) {
    throw "Source and target directories must be different."
}

if (Test-Path $targetRoot) {
    Remove-Item -Path $targetRoot -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $targetRoot | Out-Null

$sourcePackageJson = Get-Content -Path $sourcePackage -Raw | ConvertFrom-Json
$apexVersion = "v$($sourcePackageJson.version)"
$buildStamp = Get-Date -Format 'yyyyMMddHHmmss'

$targetAssets = Join-Path $targetRoot 'assets'

Copy-Item -Path $sourceHtml -Destination (Join-Path $targetRoot 'index.html') -Force
Copy-Item -Path $sourceAssets -Destination $targetAssets -Recurse -Force
Copy-Item -Path $sourcePackage -Destination (Join-Path $targetRoot 'package.json') -Force

$targetIndexPath = Join-Path $targetRoot 'index.html'
$targetIndexContent = [System.IO.File]::ReadAllText($targetIndexPath)
$targetIndexContent = [regex]::Replace($targetIndexContent, '(href|src)="([^"]+)"', {
    param($match)

    $attr = $match.Groups[1].Value
    $value = $match.Groups[2].Value

    if ($value -match '^(https?:|#|mailto:|tel:)') {
        return $match.Value
    }

    if ($value -match '\?v=') {
        return $match.Value
    }

    if ($value -like 'assets/*' -or $value -like 'app.js' -or $value -like 'detail.js' -or $value -like 'styles.css') {
        return [string]::Format('{0}="{1}?v={2}"', $attr, $value, $buildStamp)
    }

    return $match.Value
})

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($targetIndexPath, $targetIndexContent, $utf8NoBom)

if (Test-Path $siteDataFile) {
    $siteData = Get-Content -Path $siteDataFile -Raw
    $pattern = '(?s)(id:\s*[''\"]apexcore[''\"].*?version:\s*[''\"])([^''\"]+)([''\"])'

    if (-not [regex]::IsMatch($siteData, $pattern)) {
        throw "Could not find ApexCore version field in $siteDataFile"
    }

    $updatedSiteData = [regex]::Replace(
        $siteData,
        $pattern,
        { param($match) $match.Groups[1].Value + $apexVersion + $match.Groups[3].Value },
        1
    )

    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($siteDataFile, $updatedSiteData, $utf8NoBom)
}

Write-Host "Synced ApexCore web from $sourceRoot to $targetRoot"