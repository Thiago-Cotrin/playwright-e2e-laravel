param(
    [Parameter(Mandatory = $true)]
    [string]$OutputPath,

    [Parameter(Mandatory = $true)]
    [string]$PreviewDirectory
)

$ErrorActionPreference = 'Stop'

function Convert-HexToOfficeRgb {
    param([string]$Hex)

    $clean = $Hex.TrimStart('#')
    $red = [Convert]::ToInt32($clean.Substring(0, 2), 16)
    $green = [Convert]::ToInt32($clean.Substring(2, 2), 16)
    $blue = [Convert]::ToInt32($clean.Substring(4, 2), 16)

    return $red -bor ($green -shl 8) -bor ($blue -shl 16)
}

function Repair-Utf8Text {
    param([string]$Text)

    $windows1252 = [System.Text.Encoding]::GetEncoding(1252)
    return [System.Text.Encoding]::UTF8.GetString($windows1252.GetBytes($Text))
}

$script:Colors = @{
    Black = Convert-HexToOfficeRgb '#000000'
    White = Convert-HexToOfficeRgb '#FFFFFF'
    Panel = Convert-HexToOfficeRgb '#EDEDED'
    Muted = Convert-HexToOfficeRgb '#555555'
    Rule = Convert-HexToOfficeRgb '#B8BCC4'
    Accent = Convert-HexToOfficeRgb '#FF6B35'
}

function Add-Text {
    param(
        $Slide,
        [string]$Text,
        [double]$Left,
        [double]$Top,
        [double]$Width,
        [double]$Height,
        [double]$FontSize = 18,
        [bool]$Bold = $false,
        [int]$Color = $script:Colors.Black,
        [int]$Alignment = 1,
        [int]$VerticalAnchor = 1,
        [string]$Name = ''
    )

    $shape = $Slide.Shapes.AddTextbox(1, $Left, $Top, $Width, $Height)
    if ($Name) {
        $shape.Name = $Name
    }

    $frame = $shape.TextFrame2
    $frame.MarginLeft = 0
    $frame.MarginRight = 0
    $frame.MarginTop = 0
    $frame.MarginBottom = 0
    $frame.WordWrap = -1
    $frame.AutoSize = 0
    $frame.VerticalAnchor = $VerticalAnchor
    $frame.TextRange.Text = Repair-Utf8Text $Text
    $frame.TextRange.Font.Name = 'Arial'
    $frame.TextRange.Font.Size = $FontSize
    $frame.TextRange.Font.Bold = $(if ($Bold) { -1 } else { 0 })
    $frame.TextRange.Font.Fill.ForeColor.RGB = $Color
    $frame.TextRange.ParagraphFormat.Alignment = $Alignment
    $frame.TextRange.ParagraphFormat.SpaceAfter = 0
    $frame.TextRange.ParagraphFormat.SpaceBefore = 0

    return $shape
}

function Add-Rectangle {
    param(
        $Slide,
        [double]$Left,
        [double]$Top,
        [double]$Width,
        [double]$Height,
        [int]$Fill = $script:Colors.Panel,
        [string]$Name = ''
    )

    $shape = $Slide.Shapes.AddShape(1, $Left, $Top, $Width, $Height)
    if ($Name) {
        $shape.Name = $Name
    }
    $shape.Fill.Visible = -1
    $shape.Fill.ForeColor.RGB = $Fill
    $shape.Line.Visible = 0
    return $shape
}

function Add-Rule {
    param(
        $Slide,
        [double]$Left,
        [double]$Top,
        [double]$Width,
        [int]$Color = $script:Colors.Rule
    )

    $line = $Slide.Shapes.AddLine($Left, $Top, $Left + $Width, $Top)
    $line.Line.ForeColor.RGB = $Color
    $line.Line.Weight = 1
    return $line
}

function Add-Arrow {
    param(
        $Slide,
        [double]$StartX,
        [double]$StartY,
        [double]$EndX,
        [double]$EndY
    )

    $line = $Slide.Shapes.AddLine($StartX, $StartY, $EndX, $EndY)
    $line.Line.ForeColor.RGB = $script:Colors.Black
    $line.Line.Weight = 2
    $line.Line.EndArrowheadStyle = 3
    return $line
}

function Add-Footer {
    param($Slide, [int]$Number)

    Add-Text $Slide "$Number" 888 494 40 18 10 $false $script:Colors.Muted 3 | Out-Null
}

function Add-Title {
    param($Slide, [string]$Title, [int]$Number)

    Add-Text $Slide $Title 31 27 898 72 35 $false $script:Colors.Black 1 1 'slide-title' | Out-Null
    Add-Footer $Slide $Number
}

function Add-MetricCard {
    param(
        $Slide,
        [double]$Left,
        [string]$Metric,
        [string]$Description
    )

    Add-Rectangle $Slide $Left 160 204 210 $script:Colors.Panel | Out-Null
    Add-Text $Slide $Metric ($Left + 20) 187 164 60 44 $false | Out-Null
    Add-Text $Slide $Description ($Left + 22) 303 160 50 16 $false $script:Colors.Black | Out-Null
}

function Add-Finding {
    param(
        $Slide,
        [double]$Top,
        [string]$Label,
        [string]$Description
    )

    Add-Rectangle $Slide 353 ($Top + 3) 15 15 $script:Colors.Black | Out-Null
    Add-Text $Slide $Label 381 $Top 140 28 16 $true | Out-Null
    Add-Text $Slide $Description 548 $Top 380 40 16 $false | Out-Null
}

$outputDirectory = Split-Path -Parent $OutputPath
[System.IO.Directory]::CreateDirectory($outputDirectory) | Out-Null
[System.IO.Directory]::CreateDirectory($PreviewDirectory) | Out-Null

$powerPoint = New-Object -ComObject PowerPoint.Application
$presentation = $null

try {
    $presentation = $powerPoint.Presentations.Add()
    $presentation.PageSetup.SlideWidth = 960
    $presentation.PageSetup.SlideHeight = 540

    # Slide 1 - capa, baseada no layout Codex Grid 03.
    $slide = $presentation.Slides.Add(1, 12)
    $slide.FollowMasterBackground = 0
    $slide.Background.Fill.ForeColor.RGB = $script:Colors.White
    Add-Text $slide 'ATIVIDADE AVALIATIVA 3' 31 31 310 30 16 $true | Out-Null
    Add-Text $slide '30/06/2026' 700 31 229 30 16 $true $script:Colors.Black 3 | Out-Null
    Add-Text $slide "Testes E2E`nBiblioteca" 31 302 744 164 54 $false $script:Colors.Black 1 4 'deck-title' | Out-Null
    Add-Text $slide 'PLAYWRIGHT + DOCKER' 31 483 300 24 14 $true $script:Colors.Accent | Out-Null

    # Slide 2 - escopo e estratégia, baseada no layout 35.
    $slide = $presentation.Slides.Add(2, 12)
    Add-Title $slide 'O que precisava ser entregue' 2
    Add-Text $slide 'APLICAÇÃO ESCOLHIDA' 31 160 350 28 18 $true $script:Colors.Accent | Out-Null
    Add-Text $slide "qa-atividade-avaliativa-2`n`nCRUD direto e adequado às três etapas exigidas: listar/criar, editar e excluir." 31 203 404 165 20 | Out-Null
    Add-Text $slide 'ESTRATÉGIA' 493 160 350 28 18 $true $script:Colors.Accent | Out-Null
    Add-Text $slide "Playwright com Chromium`n`nLaravel + MySQL + testes isolados em Docker Compose.`n`nMesmo fluxo local e no GitHub Actions." 493 203 404 190 20 | Out-Null
    Add-Text $slide 'github.com/guilherme-ferraz/qa-atividade-avaliativa-2' 31 456 600 24 12 $false $script:Colors.Muted | Out-Null

    # Slide 3 - arquitetura, baseada no layout 67. As setas são criadas antes dos nós.
    $slide = $presentation.Slides.Add(3, 12)
    Add-Title $slide 'Um comando sobe todo o ambiente' 3
    Add-Arrow $slide 276 272 340 272 | Out-Null
    Add-Arrow $slide 618 272 682 272 | Out-Null
    $columns = @(
        @{ Left = 31; Number = '01'; Title = 'MySQL 8.4'; Body = "Banco isolado`nHealthcheck`nMigrations + seed" },
        @{ Left = 340; Number = '02'; Title = 'Laravel'; Body = "Aplicação sob teste`nCommit fixado`nCorreções de CRUD" },
        @{ Left = 682; Number = '03'; Title = 'Playwright'; Body = "Chromium oficial`n1 worker serial`nRelatório HTML" }
    )
    foreach ($column in $columns) {
        Add-Text $slide $column.Number $column.Left 184 80 28 17 $true $script:Colors.Accent | Out-Null
        Add-Text $slide $column.Title $column.Left 220 240 34 24 $true | Out-Null
        Add-Text $slide $column.Body $column.Left 290 240 112 18 | Out-Null
    }
    Add-Text $slide 'docker compose up --build' 31 453 898 34 20 $true $script:Colors.Black 2 | Out-Null

    # Slide 4 - cobertura, baseada no layout 62.
    $slide = $presentation.Slides.Add(4, 12)
    Add-Title $slide 'Cobertura da jornada' 4
    Add-Text $slide 'Os testes reproduzem ações reais pela interface.' 493 31 436 54 18 $false $script:Colors.Muted 3 | Out-Null
    Add-MetricCard $slide 31 '3' 'etapas exatamente como no enunciado'
    Add-MetricCard $slide 263 '5' 'cadastros cobertos no CRUD'
    Add-MetricCard $slide 494 '1' 'associação pessoa-biblioteca'
    Add-MetricCard $slide 726 '100%' 'dos dados do teste removidos'
    Add-Rectangle $slide 0 424 960 116 $script:Colors.Panel | Out-Null
    Add-Text $slide 'Cada criação e edição é confirmada na listagem; cada exclusão é verificada pela ausência do registro.' 31 451 898 50 18 $true $script:Colors.Black 2 3 | Out-Null

    # Slide 5 - etapa 1, baseada no layout 37.
    $slide = $presentation.Slides.Add(5, 12)
    Add-Title $slide 'Etapa 1 — acessar, listar e incluir' 5
    Add-Text $slide 'O teste começa no início da aplicação, visita todas as listagens e cria dados únicos para evitar conflito entre execuções.' 31 137 436 65 20 | Out-Null
    Add-Text $slide "ORDEM DO FLUXO`n`n1. Usuário responsável`n2. Biblioteca`n3. Pessoa`n4. Autor`n5. Livro`n6. Associação pessoa-biblioteca" 31 235 436 216 18 $false | Out-Null
    $phaseOne = @('Usuários', 'Bibliotecas', 'Pessoas', 'Autores', 'Livros')
    $top = 238
    foreach ($item in $phaseOne) {
        Add-Rectangle $slide 591 ($top + 3) 16 16 $script:Colors.Black | Out-Null
        Add-Text $slide $item 622 $top 300 30 18 $true | Out-Null
        $top += 48
    }

    # Slide 6 - etapa 2, baseada no layout 49.
    $slide = $presentation.Slides.Add(6, 12)
    Add-Title $slide 'Etapa 2 — editar e confirmar' 6
    Add-Text $slide 'ENTIDADE' 340 106 140 24 14 $true $script:Colors.Muted | Out-Null
    Add-Text $slide 'CAMPOS VERIFICADOS NA LISTAGEM' 495 106 430 24 14 $true $script:Colors.Muted | Out-Null
    $edits = @(
        @('Usuário', 'nome, email e role'),
        @('Biblioteca', 'nome, endereço, telefone e email'),
        @('Pessoa', 'nome, email, telefone e matrícula'),
        @('Autor', 'nome, nacionalidade e nascimento'),
        @('Livro', 'título, ISBN e publicação'),
        @('Asserção', 'a tabela exibe os novos valores')
    )
    $top = 143
    foreach ($edit in $edits) {
        Add-Rule $slide 340 ($top - 8) 588 | Out-Null
        Add-Text $slide $edit[0] 340 $top 140 35 17 $true | Out-Null
        Add-Text $slide $edit[1] 495 $top 433 35 17 | Out-Null
        $top += 61
    }

    # Slide 7 - etapa 3, baseada no layout 79.
    $slide = $presentation.Slides.Add(7, 12)
    Add-Title $slide 'Etapa 3 — excluir tudo que o teste criou' 7
    Add-Text $slide 'A ordem respeita as dependências e impede que exclusões em cascata escondam verificações.' 31 115 898 45 18 $false $script:Colors.Muted | Out-Null
    $deletions = @(
        @{ Left = 31; Marker = '01'; Text = "Livro → Autor`nPrimeiro removemos o vínculo dependente." },
        @{ Left = 340; Marker = '02'; Text = "Biblioteca`nA associação com a pessoa é removida em cascata." },
        @{ Left = 682; Marker = '03'; Text = "Pessoa → Usuário`nO teste termina sem deixar seus dados." }
    )
    foreach ($deletion in $deletions) {
        Add-Rectangle $slide $deletion.Left 270 26 26 $script:Colors.Black | Out-Null
        Add-Text $slide $deletion.Marker $deletion.Left 218 80 28 17 $true $script:Colors.Accent | Out-Null
        Add-Text $slide $deletion.Text $deletion.Left 326 247 100 20 | Out-Null
    }
    Add-Text $slide 'Cada exclusão aceita uma confirmação e verifica que a linha desapareceu.' 31 456 898 30 18 $true $script:Colors.Black 2 | Out-Null

    # Slide 8 - achados, baseada no layout 50.
    $slide = $presentation.Slides.Add(8, 12)
    Add-Title $slide 'Os testes também melhoraram o sistema' 8
    Add-Text $slide "ACHADO PRINCIPAL`n`nA versão original não permitia concluir o CRUD inteiro pela interface.`n`nAs correções ficaram isoladas na imagem Docker e documentadas." 31 184 280 236 20 | Out-Null
    Add-Finding $slide 185 'Exclusão' 'botões ausentes e métodos destroy incompletos'
    Add-Finding $slide 263 'Formulários' 'edição de autor enviava o método HTTP errado'
    Add-Finding $slide 341 'Persistência' 'telefone, email, role e nascimento eram descartados'
    Add-Finding $slide 419 'Navegação' 'ações de editar/excluir foram padronizadas'

    # Slide 9 - execução, baseada no layout 25.
    $slide = $presentation.Slides.Add(9, 12)
    Add-Title $slide 'Execução da demonstração' 9
    Add-Rectangle $slide 31 159 560 219 $script:Colors.Panel | Out-Null
    Add-Text $slide "docker compose up --build -d database app`n`ndocker compose run --rm tests" 55 192 510 130 18 $true | Out-Null
    Add-Text $slide 'RESULTADO ESPERADO' 635 159 294 25 14 $true $script:Colors.Accent | Out-Null
    Add-Text $slide '3 passed' 635 199 294 58 38 $true | Out-Null
    Add-Text $slide "Aplicação`nlocalhost:8000`n`nRelatório`nplaywright-report/" 635 286 294 126 18 | Out-Null
    Add-Text $slide 'Em falhas: trace, screenshot e vídeo ficam disponíveis para diagnóstico.' 31 429 898 45 17 $false $script:Colors.Muted | Out-Null

    # Slide 10 - fechamento, baseada no layout 31.
    $slide = $presentation.Slides.Add(10, 12)
    Add-Rectangle $slide 468 0 492 540 $script:Colors.Panel | Out-Null
    Add-Text $slide "Jornada completa`nvalidada" 31 32 405 190 39 $false | Out-Null
    Add-Text $slide "Listar.`nCriar.`nEditar.`nExcluir." 493 244 405 196 39 $false $script:Colors.Black 1 4 | Out-Null
    Add-Text $slide 'PRONTO PARA A DEMONSTRAÇÃO AO VIVO' 31 468 370 24 14 $true $script:Colors.Accent | Out-Null
    Add-Footer $slide 10

    $presentation.SaveAs($OutputPath, 24)
    $presentation.Export($PreviewDirectory, 'PNG', 1600, 900)
}
finally {
    if ($presentation) {
        $presentation.Close()
    }
    $powerPoint.Quit()
    [System.Runtime.InteropServices.Marshal]::FinalReleaseComObject($powerPoint) | Out-Null
}

Write-Output "Apresentação criada: $OutputPath"
Write-Output "Previews: $PreviewDirectory"
