import type { Slide, ThemeMode } from "./types"

// Lucide icon SVGs as strings (without width/height to allow CSS sizing)
const ICONS = {
  alert: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  trendingUp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  lightbulb: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
  sparkles: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
}

// Theme color presets
const THEME_COLORS = {
  dark: {
    bg: "#0B0B0E",
    surf: "#15151A",
    txt: "#EAEAF0",
    mut: "#B9B9C6",
    pri: "#BB2649",
    border: "#2A2A33",
  },
  light: {
    bg: "#FFFFFF",
    surf: "#F5F5F7",
    txt: "#1A1A1A",
    mut: "#666666",
    pri: "#BB2649",
    border: "#E0E0E0",
  },
}

function getIconForSlide(templateId: string, slideIndex: number): string {
  if (templateId === "problem-solution") {
    return slideIndex === 0 ? ICONS.alert : ICONS.checkCircle
  } else if (templateId === "transformation") {
    return ICONS.trendingUp
  } else {
    return slideIndex === 0 ? ICONS.sparkles : ICONS.lightbulb
  }
}

export function renderCarouselHTML(
  slides: Slide[],
  templateId: string,
  fontScale: number = 1.0,
  theme: ThemeMode = "dark",
  brandColor?: string,
  brandName?: string,
): string {
  const colors = { ...THEME_COLORS[theme] }

  // FASE 1: Sobrescribir color primario con brandColor de settings
  if (brandColor) {
    colors.pri = brandColor
  }

  // Usar brandName para footer (por defecto h14z.io)
  const finalBrandName = brandName || "h14z.io"

  const templateStyles = {
    "problem-solution": `
      /* MINIMAL TECH - Brutalist, espacios amplios, tipografía protagonista */
      .slide {
        border-left: 2px solid ${colors.pri};
        box-shadow: none;
        background: ${colors.surf};
        overflow: visible;
        padding: 60px 80px;
      }
      .slide-header {
        margin-bottom: 60px;
      }
      .slide-number {
        color: ${colors.mut};
        font-size: ${48 * fontScale}px;
        font-weight: 300;
        line-height: 1;
        display: block;
        opacity: 0.5;
      }
      .slide-icon {
        display: none;
      }
      .title {
        font-size: ${72 * fontScale}px;
        font-weight: 900;
        color: ${colors.txt};
        line-height: 1.05;
        margin-bottom: 60px;
        letter-spacing: -0.03em;
        text-transform: uppercase;
      }
      .bullets {
        gap: 50px;
      }
      .bullets div {
        font-size: ${28 * fontScale}px;
        font-weight: 500;
        color: ${colors.txt};
        line-height: 1.6;
        padding-left: 40px;
        position: relative;
        margin-bottom: 0;
      }
      .bullets div::before {
        content: '→';
        color: ${colors.pri};
        font-size: ${32 * fontScale}px;
        font-weight: 700;
        position: absolute;
        left: 0;
        top: 0px;
      }
    `,
    transformation: `
      /* DATA DRIVEN - Dashboard style, números grandes, barra de progreso */
      .slide {
        border: 4px double ${colors.pri};
        box-shadow: 0 8px 24px rgba(0, 0, 0, ${theme === "dark" ? "0.4" : "0.15"});
        background: ${colors.surf};
        position: relative;
        overflow: visible;
        padding: 56px;
      }
      .slide::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 8px;
        background: ${colors.pri};
        opacity: 0.8;
      }
      .slide-header {
        position: relative;
        border: 2px solid ${colors.pri};
        padding: 20px 32px;
        margin-bottom: 40px;
        display: flex;
        align-items: center;
        gap: 16px;
        background: ${theme === "dark" ? "rgba(187, 38, 73, 0.08)" : "rgba(187, 38, 73, 0.03)"};
      }
      .slide-number {
        color: ${colors.pri};
        font-size: ${56 * fontScale}px;
        font-weight: 900;
        line-height: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .slide-icon {
        width: ${48 * fontScale}px;
        height: ${48 * fontScale}px;
        color: ${colors.pri};
        opacity: 1;
      }
      .title {
        font-size: ${54 * fontScale}px;
        font-weight: 800;
        color: ${colors.txt};
        line-height: 1.15;
        margin-bottom: 36px;
        letter-spacing: -0.02em;
      }
      .bullets {
        gap: 32px;
      }
      .bullets div {
        font-size: ${32 * fontScale}px;
        font-weight: 600;
        color: ${colors.txt};
        line-height: 1.5;
        padding-left: 48px;
        position: relative;
        margin-bottom: 0;
      }
      .bullets div::before {
        content: '✓';
        color: ${colors.pri};
        font-size: ${40 * fontScale}px;
        font-weight: 900;
        position: absolute;
        left: 0;
        top: -2px;
      }
    `,
    educational: `
      /* EDITORIAL PREMIUM - Magazine, serif typography, sofisticado */
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap');

      .slide {
        border: 1px solid ${colors.pri};
        box-shadow: 0 2px 8px rgba(0, 0, 0, ${theme === "dark" ? "0.25" : "0.1"});
        background: ${colors.surf};
        overflow: visible;
        padding: 64px 56px;
      }
      .slide-header {
        margin-bottom: 48px;
        text-align: center;
        border-bottom: 1px solid ${colors.pri};
        padding-bottom: 24px;
      }
      .slide-number {
        font-family: 'Playfair Display', serif;
        color: ${colors.pri};
        font-size: ${64 * fontScale}px;
        font-weight: 700;
        line-height: 1;
        display: block;
        margin-bottom: 12px;
        position: relative;
      }
      .slide-number::before,
      .slide-number::after {
        content: '────';
        font-family: 'Inter', sans-serif;
        display: block;
        font-size: ${20 * fontScale}px;
        color: ${colors.pri};
        opacity: 0.5;
        letter-spacing: 0.2em;
      }
      .slide-icon {
        display: none;
      }
      .title {
        font-family: 'Playfair Display', serif;
        font-size: ${52 * fontScale}px;
        font-weight: 700;
        color: ${colors.txt};
        line-height: 1.3;
        margin-bottom: 40px;
        letter-spacing: -0.01em;
        position: relative;
        padding-bottom: 20px;
      }
      .title::after {
        content: '══════';
        position: absolute;
        bottom: 0;
        left: 0;
        font-size: ${16 * fontScale}px;
        color: ${colors.pri};
        letter-spacing: 0.1em;
        opacity: 0.6;
      }
      .bullets {
        gap: 28px;
      }
      .bullets div {
        font-size: ${26 * fontScale}px;
        font-weight: 400;
        color: ${colors.txt};
        line-height: 1.7;
        padding-left: 40px;
        position: relative;
        margin-bottom: 0;
        text-align: left;
      }
      .bullets div::before {
        content: '•';
        color: ${colors.pri};
        font-size: ${40 * fontScale}px;
        font-weight: 400;
        position: absolute;
        left: 0;
        top: -4px;
      }
    `,
  }

  const selectedTemplateStyle =
    templateStyles[templateId as keyof typeof templateStyles] || templateStyles["problem-solution"]

  const baseStyles = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

      :root {
        --bg: ${colors.bg};
        --surf: ${colors.surf};
        --txt: ${colors.txt};
        --mut: ${colors.mut};
        --pri: ${colors.pri};
        --border: ${colors.border};
        --font-scale: ${fontScale};
      }
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html {
        width: 1080px;
        height: 1080px;
      }
      body {
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        background: var(--bg);
        color: var(--txt);
        padding: 0;
        margin: 0;
        width: 1080px;
        height: 1080px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      .deck {
        display: flex;
        flex-direction: column;
        width: 1080px;
        height: 1080px;
        margin: 0;
        padding: 0;
      }
      .slide {
        background: var(--surf);
        border-radius: 0px;
        padding: 48px;
        width: 1080px;
        height: 1080px;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        container-type: inline-size;
      }
      .slide-header {
        display: flex;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;
        margin-bottom: 32px;
      }
      .slide-number {
        flex-shrink: 0;
      }
      .slide-icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .slide-icon svg {
        width: 100%;
        height: 100%;
        display: block;
      }
      .title {
        letter-spacing: -0.02em;
      }
      .bullets {
        display: flex;
        flex-direction: column;
        gap: 28px;
      }
      .bullets div {
        margin: 0;
        padding-left: 58px;
        position: relative;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      .bullets div::before {
        position: absolute;
        left: 0;
        top: 4px;
      }
      .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
        padding-top: 32px;
        border-top: 2px solid var(--border);
        opacity: 0.8;
        font-size: 20px;
      }
      .logo {
        font-weight: 700;
        color: var(--pri);
      }
      .branding {
        font-weight: 400;
        color: var(--txt);
        opacity: 0.7;
      }
      .branding .highlight {
        color: var(--pri);
        font-weight: 700;
      }

      ${selectedTemplateStyle}
    </style>
  `

  const slidesHTML = (slides || [])
    .map(
      (s, i) => `
    <section class="slide">
      <div>
        <div class="slide-header">
          <span class="slide-number">${String(i + 1).padStart(2, "0")}</span>
          <div class="slide-icon">${getIconForSlide(templateId, i)}</div>
        </div>
        <h2 class="title">${s.title || ""}</h2>
        <div class="bullets">
          ${(s.bullets || []).map((b) => `<div>${b}</div>`).join("")}
        </div>
      </div>
      <div class="footer">
        <span class="logo">${finalBrandName}</span>
        <span class="branding"><span class="highlight">H</span>idalgo <span class="highlight">H</span>ernández | <span class="highlight">S</span>trategic <span class="highlight">A</span>dvisory</span>
      </div>
    </section>
  `,
    )
    .join("")

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>LinkedIn Carousel Preview</title>
      ${baseStyles}
    </head>
    <body>
      <div class="deck">
        ${slidesHTML}
      </div>
    </body>
    </html>
  `
}
