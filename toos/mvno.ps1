param(
  [Parameter(Position=0,Mandatory=$true)]
  [ValidateSet("backup","restore")]
  [string]$cmd,

  # путь к бэкап-папке или архиву для restore
  [string]$BackupPath
)

$ErrorActionPreference = "Stop"

function Ensure-Dir([string]$p) {
  if (!(Test-Path $p)) { New-Item -ItemType Directory -Force -Path $p | Out-Null }
}

function Node-Close {
  taskkill /F /IM node.exe 2>$null | Out-Null
  taskkill /F /IM Code.exe 2>$null | Out-Null
  taskkill /F /IM expo.exe 2>$null | Out-Null
}

function Get-PgBin {
  $candidates = @(
    "C:\Program Files\PostgreSQL\16\bin",
    "C:\Program Files\PostgreSQL\15\bin",
    "C:\Program Files\PostgreSQL\14\bin"
  )
  foreach ($c in $candidates) { if (Test-Path $c) { return $c } }
  throw "Не найдено pg_dump/pg_restore. Установи PostgreSQL и поправь путь в скрипте."
}

function Backup {
  $root   = "D:\APP\MVNO10"
  $stamp  = Get-Date -Format "yyyyMMdd_HHmmss"
  $outdir = "D:\BACKUPS\MVNO10_$stamp"
  Ensure-Dir $outdir

  Write-Host "== Закрываю процессы Node/VSCode/Expo..."
  Node-Close

  Write-Host "== Делаю ZIP проекта (без node_modules)…"
  $temp = Join-Path $outdir "project"
  robocopy $root $temp /E /XD node_modules .expo .next dist build .turbo 1>$null
  Compress-Archive -Path "$temp\*" -DestinationPath (Join-Path $outdir "MVNO10_project_$stamp.zip")
  Remove-Item -Recurse -Force $temp

  Write-Host "== Делаю дампы БД mvno_db…"
  $pg = Get-PgBin
  & "$pg\pg_dump.exe" -U postgres -h localhost -d mvno_db -F c -f (Join-Path $outdir "mvno_db_$stamp.backup")
  & "$pg\pg_dump.exe" -U postgres -h localhost -d mvno_db -F p -f (Join-Path $outdir "mvno_db_$stamp.sql")

  Write-Host "== Копирую .env файлы…"
  if (Test-Path "$root\backend\.env") { Copy-Item "$root\backend\.env" (Join-Path $outdir "backend.env") }
  if (Test-Path "$root\web\.env")     { Copy-Item "$root\web\.env"     (Join-Path $outdir "web.env") -ErrorAction SilentlyContinue }
  if (Test-Path "$root\mobile\.env")  { Copy-Item "$root\mobile\.env"  (Join-Path $outdir "mobile.env") -ErrorAction SilentlyContinue }

  Write-Host "== Сохраняю статус миграций…"
  Push-Location "$root\backend"
  try {
    npx prisma migrate status | Out-File (Join-Path $outdir "prisma_status_$stamp.txt") -Encoding utf8
  } catch { }
  Pop-Location

  Write-Host "✅ Готово. Папка бэкапа: $outdir"
}

function Restore {
  if (-not $BackupPath) { throw "Укажи -BackupPath (папка с бэкапом или ZIP проекта)." }

  $root = "D:\APP\MVNO10"
  Ensure-Dir "D:\APP"

  # 1) Разворачиваем проект
  if (Test-Path $BackupPath -PathType Leaf -and $BackupPath.ToLower().EndsWith(".zip")) {
    Write-Host "== Распаковываю ZIP проекта в $root …"
    if (Test-Path $root) { Remove-Item -Recurse -Force $root }
    Expand-Archive -Path $BackupPath -DestinationPath "D:\APP\MVNO10_tmp"
    robocopy "D:\APP\MVNO10_tmp" $root /E 1>$null
    Remove-Item -Recurse -Force "D:\APP\MVNO10_tmp"
  } elseif (Test-Path $BackupPath -PathType Container) {
    $zip = Get-ChildItem $BackupPath -Filter "MVNO10_project_*.zip" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if (-not $zip) { throw "В папке не найден проектный ZIP." }
    if (Test-Path $root) { Remove-Item -Recurse -Force $root }
    Expand-Archive -Path $zip.FullName -DestinationPath "D:\APP\MVNO10_tmp"
    robocopy "D:\APP\MVNO10_tmp" $root /E 1>$null
    Remove-Item -Recurse -Force "D:\APP\MVNO10_tmp"
  } else {
    throw "BackupPath не найден: $BackupPath"
  }

  # 2) Возвращаем .env
  if (Test-Path (Join-Path $BackupPath "backend.env")) { Copy-Item (Join-Path $BackupPath "backend.env") "$root\backend\.env" -Force }
  if (Test-Path (Join-Path $BackupPath "web.env"))     { Copy-Item (Join-Path $BackupPath "web.env")     "$root\web\.env" -Force -ErrorAction SilentlyContinue }
  if (Test-Path (Join-Path $BackupPath "mobile.env"))  { Copy-Item (Join-Path $BackupPath "mobile.env")  "$root\mobile\.env" -Force -ErrorAction SilentlyContinue }

  # 3) Восстанавливаем БД (из .backup, если есть, иначе из .sql)
  $pg = Get-PgBin
  $bak = Get-ChildItem $BackupPath -Filter "mvno_db_*.backup" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  $sql = Get-ChildItem $BackupPath -Filter "mvno_db_*.sql"    | Sort-Object LastWriteTime -Descending | Select-Object -First 1

  Write-Host "== Создаю пустую БД mvno_db…"
  & "$pg\psql.exe" -U postgres -h localhost -c "DROP DATABASE IF EXISTS mvno_db;"
  & "$pg\psql.exe" -U postgres -h localhost -c "CREATE DATABASE mvno_db;"

  if ($bak) {
    Write-Host "== Восстанавливаю из .backup…"
    & "$pg\pg_restore.exe" -U postgres -h localhost -d mvno_db -c $bak.FullName
  } elseif ($sql) {
    Write-Host "== Восстанавливаю из .sql…"
    & "$pg\psql.exe" -U postgres -h localhost -d mvno_db -f $sql.FullName
  } else {
    Write-Host "⚠️ Не найден дамп БД в $BackupPath — пропускаю."
  }

  # 4) Установка зависимостей (чисто)
  Write-Host "== Устанавливаю зависимости…"
  Push-Location "$root\backend";  npm ci 2>$null; if ($LASTEXITCODE -ne 0) { npm i }; Pop-Location
  Push-Location "$root\web";      npm ci 2>$null; if ($LASTEXITCODE -ne 0) { npm i }; Pop-Location
  if (Test-Path "$root\mobile\package.json") {
    Push-Location "$root\mobile"; npm ci 2>$null; if ($LASTEXITCODE -ne 0) { npm i }; Pop-Location
  }

  Write-Host "✅ Восстановление завершено. Проект: $root"
}

switch ($cmd) {
  "backup"  { Backup }
  "restore" { Restore }
}
