# Grupo Ficcus — Site

Site estático em HTML/CSS/JS único (`index.html`) para o **Grupo Ficcus**, agência de fotografia, filmagem e branding do Rio de Janeiro.

## Stack

- HTML/CSS/JS inline — arquivo único `index.html`
- Google Fonts: Sora (300–800)
- Sem frameworks, sem bundler, sem dependências externas
- Servidor local: `python3 -m http.server 8081`

## Estrutura de arquivos

```
index.html                        ← tudo aqui (HTML + CSS + JS)
img/
  logo_ficcus.jpg
  Quem somos/                     ← instagram-quemsomos-joao.jpg, instagram-quemsomos2-bernardo.jpg, etc.
  Eventos - Adoro frozen/
  Eventos - Esbórnia Carnario 2026/
  Branding - Biarritz/
  Branding - Blux/
  Branding - Guaraplus/
  Branding - Rum Parnaioca/
videos/
  video_hero1.mp4                 ← hero background (mudo, loop, autoplay)
```

## Seções do site

| # | Seção | ID | Descrição |
|---|-------|----|-----------|
| — | Hero | `#top` | Vídeo em loop, título word-by-word, cantos de visor |
| 01 | Quem Somos | `#sobre` | 2 fotos paisagem empilhadas (João + Bernardo) + texto |
| — | Marquee | — | Ticker infinito: Fotografia · Filmagem · Branding… |
| 02 | Eventos | `#eventos` | Serviço + galeria (Adoro Frozen / Esbórnia Carnario) |
| 03 | Branding | `#branding` | Serviço + galeria (Biarritz / Blux / Guaraplus / Rum Parnaioca) |
| 04 | Studio | `#studio` | Placeholder "Em breve" — aguarda fotos reais |
| — | Photo Divider | — | Banner full-width antes do contato |
| — | Contato | `#contato` | WhatsApp + Instagram + info |
| — | Footer | — | Logo + crédito "Desenvolvido por Jhonatan Lopes" |

## Decisões de design

- **Dark theme** editorial: fundo preto `#000`, tipografia branca
- **Títulos**: `clamp()` responsivo, peso 800, uppercase; itálico em linhas selecionadas
- **Nav**: transparente → sólida ao rolar (`nav.scrolled` via JS)
- **Galeria**: grid 12 colunas, células com `span` variável (c-3 a c-12)
- **Lightbox**: pool por `section.block`, swipe touch, teclado (←→ Esc), dots de paginação
- **WhatsApp flutuante**: canto inferior direito, `z-index: 100`, pulse animation
- **Film grain**: `body::before` com SVG feTurbulence, `mix-blend-mode: overlay`
- **SVG decorativos**: aperturas de câmera (diafragma) giratórias, cantos de visor no hero
- **Luz passante**: efeito sweep da esquerda para direita ao entrar em cada seção de serviço

## Animações (JavaScript)

- `IntersectionObserver` → `.fade-up.visible` (entradas com blur + translateY)
- `.stack-anim` → `.stack-active`: cada linha do título de serviço desliza da esquerda
- `.galeria-grid` → `.stagger-visible`: células entram em cascata (delay 80ms/célula)
- `.servico` → `.swept`: dispara a luz passante
- Scroll progress bar no topo da página
- Cursor glow + botões magnéticos

## Contatos a confirmar

- **WhatsApp**: `5521000000000` — substituir pelo número real
- **Email**: `contato@grupoficcus.com` — confirmar
- **Instagram**: `@grupoficcus` — já configurado

## Studio

Seção com placeholders "Em breve". Quando as fotos chegarem, adicionar em `img/Studio/` e substituir os `studio-ph` por células de galeria normais.
