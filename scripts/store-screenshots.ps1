# Capture App Store / Play screenshot sizes from the live site.
# Requires Google Chrome. Output: qa/store/
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$out = "C:\Users\felix\showup\qa\store"
New-Item -ItemType Directory -Force -Path $out | Out-Null
$profile = Join-Path $out "chrome-profile"
New-Item -ItemType Directory -Force -Path $profile | Out-Null

$pages = @(
  @{ n = "01-home"; u = "https://showup-wheat.vercel.app/" },
  @{ n = "02-city"; u = "https://showup-wheat.vercel.app/c/columbia-sc" },
  @{ n = "03-lawn"; u = "https://showup-wheat.vercel.app/book?service=lawn" },
  @{ n = "04-crew"; u = "https://showup-wheat.vercel.app/dash/apply" },
  @{ n = "05-offers"; u = "https://showup-wheat.vercel.app/dash/offers" }
)

$sizes = @(
  @{ n = "6.7"; w = 1290; h = 2796 },
  @{ n = "6.5"; w = 1242; h = 2688 },
  @{ n = "5.5"; w = 1242; h = 2208 }
)

foreach ($s in $sizes) {
  foreach ($p in $pages) {
    $png = Join-Path $out "$($p.n)-$($s.n).png"
    & $chrome --headless=new --disable-gpu --hide-scrollbars --allow-insecure-localhost `
      --user-data-dir=$profile --window-size=$($s.w),$($s.h) --screenshot=$png $p.u
    Write-Host $png
  }
}
