# 创建最小的PNG图标

# 16x16 PNG (蓝色背景)
$base64_16 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAIklEQVR42mNk+M9QzwAqGBkZ/jMyMvxnZPhPySBGRoYGACG2BaIXVy+rAAAAAElFTkSuQmCC'
$bytes_16 = [Convert]::FromBase64String($base64_16)
[IO.File]::WriteAllBytes('icon-16.png', $bytes_16)
Write-Host '已创建 icon-16.png'

# 48x48 PNG (蓝色背景)
$base64_48 = 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAL0lEQVR42u3TMQEAAADCoPVPbQhfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4NcUUAAY5SgfAB/t0AAAAASUVORK5CYII='
$bytes_48 = [Convert]::FromBase64String($base64_48)
[IO.File]::WriteAllBytes('icon-48.png', $bytes_48)
Write-Host '已创建 icon-48.png'

# 128x128 PNG (蓝色背景)
$base64_128 = 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADTAomsAAAAMUlEQVR42u3TMQEAAADCoPVPbQlfoAAAAAAAAAAAAAAAAAAAAAAAAAAAB4NcUUAAY5SgfAB/t0AAAAASUVORK5CYII='
$bytes_128 = [Convert]::FromBase64String($base64_128)
[IO.File]::WriteAllBytes('icon-128.png', $bytes_128)
Write-Host '已创建 icon-128.png'
