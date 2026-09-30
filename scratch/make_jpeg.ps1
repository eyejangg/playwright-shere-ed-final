Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap 1200, 800
$g = [System.Drawing.Graphics]::FromImage($bmp)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(52, 152, 219))
$g.FillRectangle($brush, 0, 0, 1200, 800)
$font = New-Object System.Drawing.Font("Arial", 36, [System.Drawing.FontStyle]::Bold)
$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.DrawString("SHARE-ED Cover Test Image", $font, $textBrush, 100, 100)
$subFont = New-Object System.Drawing.Font("Arial", 20)
$g.DrawString("Valid JPEG Format for Testing", $subFont, $textBrush, 100, 180)
$g.Dispose()

$targetPath = [System.IO.Path]::GetFullPath("test-data/images/cover.jpg")
$bmp.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmp.Dispose()

Write-Output "Successfully saved JPEG to: $targetPath"
Get-Item $targetPath | Select-Object FullName, Length
