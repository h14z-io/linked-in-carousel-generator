import type { Slide } from "./types"

// Lucide icon SVGs as strings
const ICONS = {
  trendingUp: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  barChart: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>`,
  target: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  zap: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  lightbulb: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
  rocket: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
  sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
}

function getIconForSlide(templateId: string, slideIndex: number, totalSlides: number): string {
  if (templateId === "template-d") {
    // Data-driven icons
    const dataIcons = [ICONS.target, ICONS.barChart, ICONS.trendingUp, ICONS.checkCircle, ICONS.zap]
    return dataIcons[slideIndex % dataIcons.length]
  } else if (templateId === "template-e") {
    // Storytelling icons
    const storyIcons = [ICONS.lightbulb, ICONS.sparkles, ICONS.rocket, ICONS.checkCircle, ICONS.arrowRight]
    return storyIcons[slideIndex % storyIcons.length]
  } else if (templateId === "template-b") {
    // Bold magenta - use accent icons
    return ICONS.zap
  } else if (templateId === "template-c") {
    // Editorial - subtle icons
    return ICONS.checkCircle
  } else {
    // Minimal - very subtle
    return ICONS.checkCircle
  }
}

export function renderCarouselHTML(slides: Slide[], templateId: string, fontScale: number = 1.0): string {
  const templateStyles = {
    "template-a": `
      /* Template A - Minimal Tech */
      .slide {
        border: 1px solid var(--border);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
      }
      .slide-number {
        background: linear-gradient(135deg, #BB2649, #D63E6E);
      }
      .slide-icon {
        opacity: 0.4;
        width: 28px;
        height: 28px;
        color: var(--pri);
      }
    `,
    "template-b": `
      /* Template B - Bold Magenta (Cuadrado Optimizado) */
      .slide {
        border: 1px solid var(--border);
        border-left: 6px solid var(--pri);
        box-shadow: 0 4px 16px rgba(187, 38, 73, 0.1), 0 0 0 1px rgba(187, 38, 73, 0.05);
      }
      .slide-number {
        color: var(--pri);
      }
      .title {
        color: var(--txt);
        position: relative;
        padding-bottom: 12px;
      }
      .title::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 60px;
        height: 3px;
        background: var(--pri);
      }
      .bullets div::before {
        font-size: 20px;
      }
      .slide-icon {
        width: 40px;
        height: 40px;
        color: var(--pri);
        opacity: 0.8;
      }
    `,
    "template-c": `
      /* Template C - Editorial Grid (Cuadrado) */
      .slide {
        border-left: 6px solid var(--pri);
        border-top: 1px solid var(--border);
        border-right: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
        box-shadow: -2px 0 12px rgba(187, 38, 73, 0.1), 0 2px 12px rgba(0, 0, 0, 0.15);
      }
      .title {
        font-family: 'Georgia', 'Times New Roman', serif;
        font-style: italic;
      }
      .slide-icon {
        width: 36px;
        height: 36px;
        color: var(--pri);
        opacity: 0.7;
      }
    `,
    "template-d": `
      /* Template D - Data-Driven (Cuadrado) */
      .slide {
        border: 1px solid var(--border);
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
        background: linear-gradient(135deg, var(--surf) 0%, rgba(187, 38, 73, 0.02) 100%);
      }
      .slide-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 32px;
      }
      .slide-number {
        background: var(--pri);
        font-size: calc(56px * var(--font-scale));
        font-weight: 700;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(187, 38, 73, 0.2);
        color: white;
        line-height: 0.85;
      }
      .slide-icon {
        width: 48px;
        height: 48px;
        color: white;
        background: var(--pri);
        padding: 8px;
        border-radius: 8px;
      }
      .title {
        font-size: calc(38px * var(--font-scale));
        font-weight: 700;
        letter-spacing: -0.02em;
        line-height: 1.15;
        margin-bottom: 32px;
      }
      .bullets div {
        font-size: calc(20px * var(--font-scale));
        font-weight: 500;
        color: var(--txt);
        line-height: 1.7;
      }
      .bullets div::before {
        content: '▸';
        color: var(--pri);
        font-size: calc(22px * var(--font-scale));
        font-weight: 700;
      }
    `,
    "template-e": `
      /* Template E - Storytelling (Cuadrado) */
      .slide {
        border: none;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        background: linear-gradient(180deg, var(--surf) 0%, rgba(11, 11, 14, 0.98) 100%);
        position: relative;
        overflow: hidden;
      }
      .slide::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--pri), #FF1744, var(--pri));
      }
      .slide-number {
        background: transparent;
        color: var(--pri);
        font-size: calc(56px * var(--font-scale));
        font-weight: 700;
        opacity: 0.6;
        line-height: 0.85;
      }
      .slide-icon {
        width: 52px;
        height: 52px;
        color: var(--pri);
        opacity: 0.8;
        margin-bottom: 12px;
      }
      .title {
        font-size: calc(38px * var(--font-scale));
        font-weight: 800;
        line-height: 1.15;
        color: var(--txt);
        margin: 12px 0 32px 0;
      }
      .bullets {
        font-size: calc(20px * var(--font-scale));
        line-height: 1.75;
        color: var(--mut);
      }
      .bullets div::before {
        content: '→';
        color: var(--pri);
        font-weight: 700;
        font-size: calc(20px * var(--font-scale));
      }
      .footer {
        border-top: 1px solid rgba(187, 38, 73, 0.15);
      }
    `,
  }

  const selectedTemplateStyle =
    templateStyles[templateId as keyof typeof templateStyles] || templateStyles["template-a"]

  const baseStyles = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');

      :root {
        --bg: #0B0B0E;
        --surf: #15151A;
        --txt: #EAEAF0;
        --mut: #B9B9C6;
        --pri: #BB2649;
        --border: #2A2A33;
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
        font-family: 'Montserrat', 'Inter', system-ui, -apple-system, sans-serif;
        background: var(--bg);
        color: var(--txt);
        padding: 0;
        margin: 0;
        width: 1080px;
        height: 1080px;
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
        align-items: flex-start;
        gap: 20px;
        flex-wrap: wrap;
        margin-bottom: 36px;
      }
      .slide-number {
        font-size: calc(64px * var(--font-scale));
        font-weight: 800;
        color: var(--pri);
        letter-spacing: -0.02em;
        line-height: 0.85;
        flex-shrink: 0;
      }
      .title {
        font-size: calc(42px * var(--font-scale));
        font-weight: 800;
        letter-spacing: -0.02em;
        line-height: 1.15;
        color: var(--txt);
        margin: 0 0 36px 0;
      }
      .bullets {
        line-height: 1.75;
        color: var(--mut);
        font-size: calc(22px * var(--font-scale));
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      .bullets div {
        margin: 0;
        padding-left: 32px;
        position: relative;
      }
      .bullets div::before {
        content: '•';
        position: absolute;
        left: 0;
        color: var(--pri);
        font-weight: bold;
        font-size: calc(24px * var(--font-scale));
      }
      .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
        padding-top: 24px;
        border-top: 1px solid var(--border);
        opacity: 0.8;
        font-size: calc(14px * var(--font-scale));
      }
      .logo {
        font-weight: 700;
        color: var(--pri);
      }
      .branding {
        font-weight: 400;
        color: var(--txt);
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
    <section class="slide slide-${templateId}-${i + 1}">
      <div>
        <div class="slide-header">
          <span class="slide-number">${String(i + 1).padStart(2, "0")}</span>
          ${templateId === "template-d" || templateId === "template-e" ? `<div class="slide-icon">${getIconForSlide(templateId, i, slides.length)}</div>` : ""}
        </div>
        ${templateId !== "template-d" && templateId !== "template-e" && (templateId === "template-b" || templateId === "template-c") ? `<div class="slide-icon" style="margin-bottom: 16px;">${getIconForSlide(templateId, i, slides.length)}</div>` : ""}
        <h2 class="title">${s.title || ""}</h2>
        <div class="bullets">
          ${(s.bullets || []).map((b) => `<div>${b}</div>`).join("")}
        </div>
      </div>
      <div class="footer">
        <span class="logo">h14z.io</span>
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
