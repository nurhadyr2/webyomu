param(
  [string]$InputFile = "teks revisi.docx",
  [string]$OutputFile = "src/data/stories/imported-texts.json",
  [string]$GlossaryOutputFile = "src/data/glossaries.json"
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Add-Type -AssemblyName System.IO.Compression.FileSystem

$storySpecs = @(
  @{ slug = "legenda-surabaya"; slides = 4 },
  @{ slug = "kebo-iwa"; slides = 4 },
  @{ slug = "raja-ampat"; slides = 4 },
  @{ slug = "danau-toba"; slides = 4 },
  @{ slug = "rawa-pening"; slides = 4 },
  @{ slug = "roro-jonggrang"; slides = 4 },
  @{ slug = "tangkuban-perahu"; slides = 4 },
  @{ slug = "banyuwangi"; slides = 4 },
  @{ slug = "manik-angkeran"; slides = 4 },
  @{ slug = "semarang"; slides = 4 },
  @{ slug = "malin-kundang"; slides = 4 },
  @{ slug = "timun-mas"; slides = 4 },
  @{ slug = "ande-ande-lumut"; slides = 5 },
  @{ slug = "bawang-merah-bawang-putih"; slides = 7 },
  @{ slug = "batu-badaong"; slides = 4 },
  @{ slug = "putri-mambang-limau"; slides = 4 },
  @{ slug = "lutung-kasarung"; slides = 4 },
  @{ slug = "putri-junjung-buih"; slides = 4 },
  @{ slug = "ratu-ular"; slides = 4 },
  @{ slug = "batu-menangis"; slides = 3 }
)

function Get-DocumentLines([string]$Path) {
  $resolved = (Resolve-Path $Path).Path
  $zip = [System.IO.Compression.ZipFile]::OpenRead($resolved)
  try {
    $entry = $zip.GetEntry("word/document.xml")
    if (-not $entry) { throw "word/document.xml tidak ditemukan di $Path" }
    $reader = [System.IO.StreamReader]::new($entry.Open(), [System.Text.Encoding]::UTF8)
    try { [xml]$document = $reader.ReadToEnd() } finally { $reader.Dispose() }
  } finally {
    $zip.Dispose()
  }

  $namespaces = [System.Xml.XmlNamespaceManager]::new($document.NameTable)
  $namespaces.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")

  foreach ($paragraph in $document.SelectNodes("//w:body/w:p", $namespaces)) {
    $parts = foreach ($node in $paragraph.SelectNodes(".//w:t | .//w:tab | .//w:br", $namespaces)) {
      if ($node.LocalName -eq "t") { $node.InnerText } else { " " }
    }
    $line = (($parts -join "") -replace "[\s\u00A0]+", " ").Trim()
    if ($line) { $line }
  }
}

function Get-DocumentXml([string]$Path) {
  $resolved = (Resolve-Path $Path).Path
  $zip = [System.IO.Compression.ZipFile]::OpenRead($resolved)
  try {
    $entry = $zip.GetEntry("word/document.xml")
    if (-not $entry) { throw "word/document.xml tidak ditemukan di $Path" }
    $reader = [System.IO.StreamReader]::new($entry.Open(), [System.Text.Encoding]::UTF8)
    try { return [xml]$reader.ReadToEnd() } finally { $reader.Dispose() }
  } finally {
    $zip.Dispose()
  }
}

function Get-NodeText($Node, $Namespaces) {
  $parts = foreach ($textNode in $Node.SelectNodes(".//w:t | .//w:tab | .//w:br", $Namespaces)) {
    if ($textNode.LocalName -eq "t") { $textNode.InnerText } else { " " }
  }
  return (($parts -join "") -replace "[\s\u00A0]+", " ").Trim()
}

function Convert-ToRubySource([string]$Text) {
  $normalized = (($Text -replace "[\s\u00A0]+", " ").Trim()).Normalize([Text.NormalizationForm]::FormC)
  return [regex]::Replace(
    $normalized,
    "([\p{IsCJKUnifiedIdeographs}\u3005\u30F6]+)\s*[\uFF08(]([\u3041-\u3096\u30A1-\u30FA\u30FC]+)[\uFF09)]",
    '$1[$2]'
  )
}

$lines = @(Get-DocumentLines $InputFile)
$started = $false
$storyIndex = 0
$slides = @()
$currentSlide = -1
$result = [ordered]@{}

foreach ($line in $lines) {
  if (-not $started) {
    if ($line -eq "N5") { $started = $true }
    continue
  }

  if ($line -match "^slide\s+(\d+)\s*(.*)$") {
    $slideNumber = [int]$Matches[1]
    while ($slides.Count -lt $slideNumber) { $slides += ,@() }
    $currentSlide = $slideNumber - 1
    if ($Matches[2].Trim()) { $slides[$currentSlide] += $Matches[2].Trim() }
    continue
  }

  if ($line -eq "Glosarium") {
    if ($slides.Count -eq 0) { continue }
    if ($storyIndex -ge $storySpecs.Count) { throw "DOCX berisi lebih dari $($storySpecs.Count) cerita." }

    $spec = $storySpecs[$storyIndex]
    if ($slides.Count -ne $spec.slides) {
      throw "$($spec.slug): ditemukan $($slides.Count) slide, seharusnya $($spec.slides)."
    }

    $result[$spec.slug] = @($slides | ForEach-Object { Convert-ToRubySource ($_ -join " ") })
    Write-Host "OK $($spec.slug): $($slides.Count) slide"
    $storyIndex++
    $slides = @()
    $currentSlide = -1
    continue
  }

  if ($currentSlide -ge 0 -and $storyIndex -lt $storySpecs.Count) {
    $slides[$currentSlide] += $line
  }
}

if ($storyIndex -ne $storySpecs.Count) {
  throw "Hanya ditemukan $storyIndex dari $($storySpecs.Count) cerita."
}

$json = $result | ConvertTo-Json -Depth 5
$target = Join-Path (Get-Location) $OutputFile
[System.IO.File]::WriteAllText($target, "$json`n", [System.Text.UTF8Encoding]::new($false))
Write-Host "Materi revisi ditulis ke $OutputFile"

$document = Get-DocumentXml $InputFile
$namespaces = [System.Xml.XmlNamespaceManager]::new($document.NameTable)
$namespaces.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
$tables = @($document.SelectNodes("//w:body/w:tbl", $namespaces))

if ($tables.Count -ne $storySpecs.Count) {
  throw "Ditemukan $($tables.Count) tabel glosarium, seharusnya $($storySpecs.Count)."
}

$glossaries = [ordered]@{}
for ($tableIndex = 0; $tableIndex -lt $tables.Count; $tableIndex++) {
  $groups = @()
  $currentGroup = $null
  $rows = @($tables[$tableIndex].SelectNodes("./w:tr", $namespaces))

  foreach ($row in $rows | Select-Object -Skip 1) {
    $cells = @($row.SelectNodes("./w:tc", $namespaces))
    if ($cells.Count -eq 0) { continue }
    $term = Get-NodeText $cells[0] $namespaces
    if (-not $term) { continue }

    if ($term -in @("Verba", "Adjektiva", "Nomina", "Adverbia")) {
      $currentGroup = [ordered]@{ category = $term; items = @() }
      $groups += $currentGroup
      continue
    }

    if ($cells.Count -lt 2) { continue }
    $meaning = Get-NodeText $cells[1] $namespaces

    if ($null -eq $currentGroup) {
      throw "$($storySpecs[$tableIndex].slug): kata '$term' belum memiliki kelas kata."
    }

    $currentGroup.items += [ordered]@{
      term = Convert-ToRubySource $term
      meaning = $meaning
    }
  }

  $glossaries[$storySpecs[$tableIndex].slug] = $groups
}

$glossaryJson = $glossaries | ConvertTo-Json -Depth 8
$glossaryTarget = Join-Path (Get-Location) $GlossaryOutputFile
[System.IO.File]::WriteAllText($glossaryTarget, "$glossaryJson`n", [System.Text.UTF8Encoding]::new($false))
Write-Host "Glosarium per kelas kata ditulis ke $GlossaryOutputFile"
