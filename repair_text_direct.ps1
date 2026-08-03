$root = 'd:\Projects\Website for created apps'
$files = @(
  (Join-Path $root 'app.js'),
  (Join-Path $root 'index.html'),
  (Join-Path $root 'app-detail.html'),
  (Join-Path $root 'detail.js'),
  (Join-Path $root 'dist-web/index.html'),
  (Join-Path $root 'dist-web/assets/js/app.js'),
  (Join-Path $root 'ApexCore_3.0.3_stable/ApexCore_3.0.3_FinalFix.html'),
  (Join-Path $root 'ApexCore_3.0.3_stable/assets/js/app.js'),
  (Join-Path $root 'ApexCore_3.0.3_stable/dist-web/index.html'),
  (Join-Path $root 'ApexCore_3.0.3_stable/dist-web/assets/js/app.js')
)
$replacements = @(
  @{ old = 'Ã¤'; new = 'ä' },
  @{ old = 'Ã¶'; new = 'ö' },
  @{ old = 'Ã¥'; new = 'å' },
  @{ old = 'Ã„'; new = 'Ä' },
  @{ old = 'Ã–'; new = 'Ö' },
  @{ old = 'Ã¼'; new = 'ü' },
  @{ old = 'Ã©'; new = 'é' },
  @{ old = 'Ã¸'; new = 'ø' },
  @{ old = 'Ã†'; new = 'Æ' },
  @{ old = 'Ã'; new = 'Å' },
  @{ old = 'â€™'; new = '’' },
  @{ old = 'â€“'; new = '–' },
  @{ old = 'â€¦'; new = '…' }
)
foreach ($file in $files) {
  if (Test-Path $file) {
    $content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)
    $updated = $content
    foreach ($r in $replacements) {
      $updated = $updated.Replace($r.old, $r.new)
    }
    if ($updated -ne $content) {
      [System.IO.File]::WriteAllText($file, $updated, [System.Text.UTF8Encoding]::new($false))
      Write-Host "repaired $file"
    }
  }
}
