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
      /* URGENCY ALERT - Alarmante, directo, enfocado en el problema */
      .slide {
        border-left: 10px solid ${colors.pri};
        border-top: 3px solid ${colors.pri};
        box-shadow: inset 0 0 0 1px ${colors.pri}40;
        background: ${theme === "dark" ? `linear-gradient(135deg, ${colors.surf} 0%, rgba(187, 38, 73, 0.05) 100%)` : `linear-gradient(135deg, ${colors.surf} 0%, rgba(187, 38, 73, 0.03) 100%)`};
        overflow: visible;
        padding: 50px 70px;
        position: relative;
      }
      .watermark {
        position: absolute;
        top: 20px;
        right: 30px;
        font-size: ${80 * fontScale}px;
        opacity: 0.08;
        line-height: 1;
        pointer-events: none;
      }
      .slide-header {
        margin-bottom: 40px;
        display: flex;
        align-items: center;
        gap: 20px;
      }
      .slide-number {
        color: ${colors.pri};
        font-size: ${68 * fontScale}px;
        font-weight: 900;
        line-height: 0.9;
        display: inline-block;
        background: ${theme === "dark" ? "rgba(187, 38, 73, 0.15)" : "rgba(187, 38, 73, 0.1)"};
        padding: 12px 24px;
        border-radius: 8px;
        border: 2px solid ${colors.pri};
      }
      .slide-icon {
        display: none;
      }
      .title {
        font-size: ${62 * fontScale}px;
        font-weight: 900;
        color: ${colors.txt};
        line-height: 1.1;
        margin-bottom: 50px;
        letter-spacing: -0.02em;
        text-transform: none;
        position: relative;
        padding-left: 24px;
        border-left: 4px solid ${colors.pri};
      }
      .title-bar {
        display: none;
      }
      .bullets {
        gap: 32px;
      }
      .bullets div {
        font-size: ${26 * fontScale}px;
        font-weight: 600;
        color: ${colors.txt};
        line-height: 1.5;
        padding-left: 50px;
        position: relative;
        margin-bottom: 0;
        border-left: 3px solid ${theme === "dark" ? "rgba(187, 38, 73, 0.2)" : "rgba(187, 38, 73, 0.15)"};
        padding-top: 8px;
        padding-bottom: 8px;
      }
      .bullet-icon {
        color: ${colors.pri};
        font-size: ${36 * fontScale}px;
        font-weight: 900;
        position: absolute;
        left: 12px;
        top: 4px;
      }
    `,
    transformation: `
      /* METRICS DASHBOARD - Progreso, crecimiento, antes/después */
      .slide {
        border: none;
        box-shadow: 0 4px 20px rgba(0, 0, 0, ${theme === "dark" ? "0.3" : "0.1"});
        background: ${colors.surf};
        position: relative;
        overflow: visible;
        padding: 60px 70px 60px 80px;
      }
      .vertical-gradient-bar {
        position: absolute;
        left: 0;
        top: 60px;
        bottom: 60px;
        width: 12px;
        background: linear-gradient(180deg, rgba(187, 38, 73, 0) 0%, ${colors.pri} 50%, rgba(187, 38, 73, 0) 100%);
        border-radius: 0 6px 6px 0;
      }
      .top-gradient-bar {
        position: absolute;
        top: 35px;
        left: 0;
        right: 0;
        height: 6px;
        background: linear-gradient(90deg, ${colors.pri} 0%, rgba(187, 38, 73, 0.6) 100%);
      }
      .slide-header {
        position: relative;
        margin-bottom: 50px;
        display: inline-flex;
        align-items: center;
        gap: 20px;
      }
      .slide-number {
        color: ${colors.surf};
        background: ${colors.pri};
        font-size: ${56 * fontScale}px;
        font-weight: 900;
        line-height: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 16px 28px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(187, 38, 73, 0.4);
        position: relative;
      }
      .slide-icon {
        display: none;
      }
      .title {
        font-size: ${58 * fontScale}px;
        font-weight: 800;
        color: ${colors.txt};
        line-height: 1.15;
        margin-bottom: 45px;
        letter-spacing: -0.02em;
        background: ${theme === "dark" ? "rgba(187, 38, 73, 0.05)" : "rgba(187, 38, 73, 0.02)"};
        padding: 20px 25px;
        border-left: 5px solid ${colors.pri};
        border-radius: 0 8px 8px 0;
      }
      .bullets {
        gap: 24px;
      }
      .bullets div {
        font-size: ${28 * fontScale}px;
        font-weight: 600;
        color: ${colors.txt};
        line-height: 1.6;
        padding: 18px 24px 18px 60px;
        position: relative;
        margin-bottom: 0;
        background: ${theme === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)"};
        border-radius: 10px;
        border: 1px solid ${theme === "dark" ? "rgba(187, 38, 73, 0.15)" : "rgba(187, 38, 73, 0.1)"};
      }
      .bullet-icon {
        color: ${colors.surf};
        background: ${colors.pri};
        font-size: ${28 * fontScale}px;
        font-weight: 900;
        position: absolute;
        left: 18px;
        top: 50%;
        transform: translateY(-50%);
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
      }
    `,
    educational: `
      /* MINIMAL ACADEMIC - Limpio, espacioso, educativo profesional */
      .slide {
        border: none;
        box-shadow: none;
        background: ${colors.surf};
        overflow: visible;
        padding: 80px 90px;
        position: relative;
      }
      .slide::before {
        content: '';
        position: absolute;
        top: 30px;
        left: 30px;
        right: 30px;
        bottom: 30px;
        border: 1px solid ${theme === "dark" ? "rgba(187, 38, 73, 0.15)" : "rgba(187, 38, 73, 0.12)"};
        border-radius: 4px;
        pointer-events: none;
      }
      .slide-header {
        margin-bottom: 55px;
        display: flex;
        align-items: baseline;
        gap: 20px;
        position: relative;
      }
      .slide-number {
        font-family: 'Inter', sans-serif;
        color: ${colors.pri};
        font-size: ${42 * fontScale}px;
        font-weight: 300;
        line-height: 1.2;
        display: inline-block;
        position: relative;
        opacity: 0.9;
        padding-bottom: 8px;
        border-bottom: 2px solid ${colors.pri};
      }
      .step-label {
        display: block;
        font-size: ${12 * fontScale}px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        opacity: 0.5;
        color: ${colors.pri};
        margin-bottom: 8px;
      }
      .step-underline {
        display: none;
      }
      .slide-icon {
        display: none;
      }
      .title {
        font-family: 'Inter', sans-serif;
        font-size: ${52 * fontScale}px;
        font-weight: 600;
        color: ${colors.txt};
        line-height: 1.3;
        margin-bottom: 50px;
        letter-spacing: -0.015em;
        position: relative;
      }
      .bullets {
        gap: 30px;
      }
      .bullets div {
        font-size: ${24 * fontScale}px;
        font-weight: 400;
        color: ${colors.txt};
        line-height: 1.75;
        padding-left: 55px;
        position: relative;
        margin-bottom: 0;
        text-align: left;
      }
      .bullet-number {
        color: ${colors.surf};
        background: ${colors.pri};
        font-size: ${18 * fontScale}px;
        font-weight: 700;
        position: absolute;
        left: 0;
        top: 2px;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-family: 'Inter', sans-serif;
      }
      .step-connector {
        position: absolute;
        left: 17px;
        top: 42px;
        bottom: -32px;
        width: 2px;
        background: ${theme === "dark" ? "rgba(187, 38, 73, 0.2)" : "rgba(187, 38, 73, 0.15)"};
      }
      .bullets div:last-child .step-connector {
        display: none;
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
      (s, i) => {
        // Template-specific decorative elements as real HTML
        let decorativeElements = ''
        let headerExtras = ''
        let titleExtras = ''

        if (templateId === 'problem-solution') {
          decorativeElements = `<div class="watermark">⚠</div>`
        } else if (templateId === 'transformation') {
          decorativeElements = `<div class="vertical-gradient-bar"></div><div class="top-gradient-bar"></div>`
        } else if (templateId === 'educational') {
          // Para educational, agregamos el label dentro del número
        }

        // Bullet markers as real HTML based on template
        const getBulletMarker = (index: number) => {
          if (templateId === 'problem-solution') return `<span class="bullet-icon">✗</span>`
          if (templateId === 'transformation') return `<span class="bullet-icon">→</span>`
          if (templateId === 'educational') return `<span class="bullet-number">${index + 1}</span><div class="step-connector"></div>`
          return ''
        }

        const slideNumberContent = templateId === 'educational'
          ? `<span class="slide-number"><span class="step-label">Paso</span>${String(i + 1).padStart(2, "0")}</span>`
          : `<span class="slide-number">${String(i + 1).padStart(2, "0")}</span>`

        return `
    <section class="slide">
      ${decorativeElements}
      <div>
        <div class="slide-header">
          ${slideNumberContent}
          <div class="slide-icon">${getIconForSlide(templateId, i)}</div>
        </div>
        <h2 class="title">${s.title || ""}</h2>
        <div class="bullets">
          ${(s.bullets || []).map((b, idx) => `<div>${getBulletMarker(idx)}${b}</div>`).join("")}
        </div>
      </div>
      <div class="footer">
        <span class="logo">${finalBrandName}</span>
        <span class="branding"><span class="highlight">H</span>idalgo <span class="highlight">H</span>ernández | <span class="highlight">S</span>trategic <span class="highlight">A</span>dvisory</span>
      </div>
    </section>
  `
      },
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
