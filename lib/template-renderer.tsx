import type { Slide } from "./types"

export function renderCarouselHTML(slides: Slide[], templateId: string): string {
  const baseStyles = `
    <style>
      :root {
        --bg: #0B0B0E;
        --surf: #15151A;
        --txt: #EAEAF0;
        --mut: #B9B9C6;
        --pri: #BB2649;
        --border: #2A2A33;
      }
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Montserrat', 'Inter', system-ui, -apple-system, sans-serif;
        background: var(--bg);
        color: var(--txt);
        padding: 32px;
      }
      .deck {
        display: grid;
        gap: 24px;
        max-width: 1200px;
        margin: 0 auto;
      }
      .slide {
        background: var(--surf);
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 48px;
        min-height: 600px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
      }
      .slide-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 32px;
      }
      .slide-number {
        font-size: 48px;
        font-weight: 800;
        background: linear-gradient(135deg, #BB2649, #E83E8C);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: -0.02em;
      }
      .title {
        font-size: 32px;
        font-weight: 800;
        letter-spacing: -0.02em;
        line-height: 1.2;
        color: var(--txt);
      }
      .bullets {
        line-height: 1.8;
        color: var(--mut);
        font-size: 18px;
        margin-top: 24px;
      }
      .bullets div {
        margin-bottom: 16px;
        padding-left: 24px;
        position: relative;
      }
      .bullets div::before {
        content: '•';
        position: absolute;
        left: 0;
        color: var(--pri);
        font-weight: bold;
      }
      .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 48px;
        padding-top: 24px;
        border-top: 1px solid var(--border);
        opacity: 0.8;
        font-size: 14px;
      }
      .logo {
        font-weight: 700;
        color: var(--pri);
      }
      /* Updated branding text with H14Z styling */
      .branding {
        font-weight: 400;
        color: var(--txt);
      }
      .branding .highlight {
        color: var(--pri);
        font-weight: 700;
      }
    </style>
  `

  const slidesHTML = (slides || [])
    .map(
      (s, i) => `
    <section class="slide slide-${templateId}-${i + 1}">
      <div>
        <div class="slide-header">
          <span class="slide-number">${String(i + 1).padStart(2, "0")}</span>
        </div>
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
