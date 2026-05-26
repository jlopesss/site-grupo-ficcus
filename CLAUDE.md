# Grupo Ficcus — Site

Site estático para o **Grupo Ficcus**, agência de fotografia, filmagem e branding do Rio de Janeiro.

## Stack

- HTML puro (`index.html`) + CSS externo (`css/style.css`) + JS externo (`js/main.js`)
- Google Fonts: Sora (300–800), carregada via `<link>` no `<head>`
- Sem frameworks, sem bundler, sem dependências externas
- Todas as imagens em formato `.webp` (originais `.jpg` mantidos como backup)
- Servidor local: `python3 -m http.server 8081`

## Estrutura de arquivos

```
index.html                        ← HTML puro (sem CSS ou JS inline)
css/
  style.css                       ← todo o CSS do site
js/
  main.js                         ← todo o JavaScript do site
img/
  logo_ficcus.webp
  Quem somos/
    instagram-quemsomos-joao.webp       ← foto João (seção Quem Somos)
    instagram-quemsomos2-bernardo.webp  ← foto Bernardo (seção Quem Somos)
    instagram-quemsomos1.webp           ← foto divider (banner antes do Contato)
    instagram-quemsomos10.webp          ← foto de fundo da seção Contato
    instagram-quemsomos8.webp           ← galeria Studio (emprestada)
    instagram-quemsomos9.webp           ← galeria Studio (emprestada)
    (+ outros arquivos não usados no HTML)
  Eventos - Adoro frozen/         ← ~15 fotos .webp + 1 vídeo .mp4
  Eventos - Esbórnia Carnario 2026/ ← ~13 fotos .webp
  Branding - Biarritz/            ← ~9 fotos .webp
  Branding - Blux/                ← ~9 fotos .webp
  Branding - Guaraplus/           ← ~8 fotos .webp
  Branding - Rum Parnaioca/       ← ~7 fotos .webp
  Studio/
    instagram-quemsomos8.webp
    instagram-quemsomos9.webp
    SaveClip.App_559191886_...webp
    SaveClip.App_587516869_...webp
videos/
  video_hero1.mp4
  video_hero2.mp4                 ← hero background atual (mudo, loop, autoplay)
  (+ 6 outros vídeos disponíveis mas não usados)
textos/                           ← rascunhos de texto (não usado no build)
Grupo ficcus-handoff              ← pasta de briefing/handoff (não usada no build)
```

## Seções do site

| # | Seção | ID | Descrição |
|---|-------|----|-----------|
| — | Hero | `#top` | Vídeo em loop (`video_hero2.mp4`), título word-by-word, cantos de visor |
| 01 | Quem Somos | `#sobre` | 2 fotos paisagem empilhadas (João + Bernardo) + texto editorial |
| — | Marquee | — | Ticker infinito: Fotografia · Filmagem · Branding · Editorial · Eventos… |
| 02 | Eventos | `#eventos` | Seção de serviço + galeria (Adoro Frozen / Esbórnia Carnario) |
| 03 | Branding | `#branding` | Seção de serviço + galeria (Biarritz / Blu-x / Guaraplus / Rum Parnaioca) |
| 04 | Studio | `#studio` | Seção de serviço + galeria com 3 fotos reais |
| — | Photo Divider | — | Banner full-width (`instagram-quemsomos1.webp`) antes do contato |
| — | Contato | `#contato` | WhatsApp + Instagram + info (fundo: `instagram-quemsomos10.webp`) |
| — | Footer | — | Logo + crédito "Desenvolvido por Jhonatan Lopes" |

## Decisões de design

- **Dark theme** editorial: fundo preto `#000`, tipografia branca, variáveis CSS em `:root`
- **Tipografia**: Sora (Google Fonts); títulos `clamp()` responsivo, peso 800, uppercase; itálico seletivo
- **Nav**: transparente → sólida + blur ao rolar (`nav.scrolled` via JS, threshold 56px)
- **Galeria**: grid 12 colunas (`repeat(12, 1fr)`), células com `span` variável (`c-3` a `c-12`)
  - Biarritz, Blu-x e Rum Parnaioca usam `grid-row` explícito para layout 2-linhas
  - `.af-col-right` e `.esb-col-right`: wrappers flex de coluna (viram `contents` no mobile)
- **Lightbox**: pool por `section.block`, swipe touch, teclado (←→ Esc), dots de paginação (máx 12)
- **Lazy load de imagens**: todas via `data-bg` + IntersectionObserver (`rootMargin: 300px`)
  - As `sf-photo` (fotos decorativas dos serviços) também usam `data-bg`
- **WhatsApp flutuante**: canto inferior direito, `z-index: 100`, pulse animation
- **Film grain**: `body::before` com SVG feTurbulence inline (data URL), `mix-blend-mode` implícito via `opacity: 0.045`
- **SVG decorativos**: aperturas de câmera (`svg-aperture` / `svg-aperture-rev`) giratórias, cantos de visor no hero, câmeras e sparkles em seções
- **Luz passante**: efeito `light-sweep` da esquerda para direita ao entrar em cada `.servico`

## Animações (JavaScript — `js/main.js`)

- `IntersectionObserver` (io) → `.fade-up.visible`: entradas com blur + translateY (threshold 10%)
- `IntersectionObserver` (ioStack) → `.stack-anim.stack-active` + `.servico-head.lbl-in`: stagger por linha do título de serviço (threshold 5%)
- `IntersectionObserver` (ioGrid) → `.galeria-grid.stagger-visible`: células entram em cascata (threshold 8%)
- `IntersectionObserver` (ioLabel) → `.gl-label.lbl-in`: labels de galeria revelados (threshold 25%)
- `IntersectionObserver` (ioBg) → lazy load de `data-bg` (rootMargin 300px)
- `IntersectionObserver` (ioContato) → `.contato.contato-in`: zoom-out do fundo da seção Contato
- `IntersectionObserver` (ioSwept) → `.servico.swept`: dispara a luz passante (threshold 15%)
- Scroll progress bar no topo da página (via `requestAnimationFrame`)
- Botões magnéticos (`mousemove` em `.btn`, `.nav-cta`, `.nav-ig`)
- Marquee: reescrita do `@keyframes` via JS após `document.fonts.ready` para loop pixel-exact

## CSS — `css/style.css`

- Variáveis CSS em `:root`: `--bg`, `--fg`, `--muted`, `--line`, `--pad` (clamp)
- Breakpoints principais: `760px` (nav mobile, galeria 2-col, sobre 1-col), `900px` (servico-fotos full-bleed + overlay)
- `.servico-stack .row` desktop: `translateX(-64px)` → `translateX(0)` ao entrar
- `.servico-stack .row` mobile (≤900px): `translateY(28px)` + `opacity:0` → visível
- Galeria mobile (≤760px): cancela `grid-column span` e `grid-row` explícitos → auto-placement

## Contatos

- **WhatsApp**: `5521000000000` — **substituir pelo número real** (aparece em 2 lugares: `href` do botão e do WAF flutuante)
- **Email**: `contato@grupoficcus.com` — exibido no info, sem link `mailto:`
- **Instagram**: `@grupoficcus` — configurado em todos os links

## Studio

Seção com 3 fotos reais em `img/Studio/`. Se novas fotos chegarem, adicionar em `img/Studio/` e inserir novas células `.cell` na `.galeria-grid` da seção Studio.
