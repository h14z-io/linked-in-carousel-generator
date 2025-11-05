import type { NarrativeStyle } from "../types"

/**
 * 7 Narrative Styles based on proven LinkedIn carousel frameworks
 * Each style defines structure, best use cases, and AI generation instructions
 */

export const NARRATIVE_STYLES: NarrativeStyle[] = [
  {
    id: "pasp",
    name: "PASP Framework",
    subtitle: "Problem-Agitation-Solution-Proof",
    framework: "PASP",
    bestFor: "Venta directa, generación de leads, marketing de urgencia",
    structure: [
      "Hook con problema específico",
      "Agitar el dolor (consecuencias)",
      "Más consecuencias del problema",
      "Introducir la solución",
      "Cómo funciona la solución",
      "Beneficios concretos",
      "Proof social + CTA",
    ],
    slideCount: 7,
    promptInstructions: `
Create urgent, action-oriented content following the PASP framework:
- Slide 1: Hook with a specific, relatable problem
- Slides 2-3: Agitate the pain by showing consequences and making it visceral
- Slides 4-6: Present the solution step-by-step with clear benefits
- Slide 7: Social proof (stats, testimonials) + strong CTA

Tone: Urgent but not alarmist. Empathetic to pain, confident in solution.
Focus: Emotional triggers → logical solution → credible proof
    `,
    templateImage: {
      dark: "/templates/pasp-dark.png",
      light: "/templates/pasp-light.png",
    },
  },
  {
    id: "bab",
    name: "BAB Framework",
    subtitle: "Before-After-Bridge",
    framework: "BAB",
    bestFor: "Casos de éxito, ROI, transformaciones, testimonios",
    structure: [
      "Estado inicial (antes)",
      "Desafíos específicos del antes",
      "Estado deseado (después)",
      "Resultados concretos",
      "El puente: primer paso",
      "El puente: pasos intermedios",
      "CTA con resultado esperado",
    ],
    slideCount: 7,
    promptInstructions: `
Create transformation narrative following the BAB framework:
- Slides 1-2: Paint vivid picture of "before" state with specific challenges
- Slides 3-4: Show compelling "after" state with concrete metrics/results
- Slides 5-6: Explain the bridge (how to get from before to after)
- Slide 7: CTA emphasizing achievable transformation

Tone: Inspirational but grounded. Use real numbers and specific examples.
Focus: Contrast (before/after) → credible methodology → achievable results
    `,
    templateImage: {
      dark: "/templates/bab-dark.png",
      light: "/templates/bab-light.png",
    },
  },
  {
    id: "step-by-step",
    name: "Step-by-Step Guide",
    subtitle: "How-to Educational",
    framework: "How-To",
    bestFor: "Educational content, tutoriales, guías prácticas",
    structure: [
      "How to [achieve X]",
      "Paso 1: [action]",
      "Paso 2: [action]",
      "Paso 3: [action]",
      "Paso 4: [action]",
      "Paso 5: [action]",
      "Recap + recursos",
    ],
    slideCount: 7,
    promptInstructions: `
Create clear, actionable step-by-step guide:
- Slide 1: Promise clear outcome "How to achieve [X]"
- Slides 2-6: Each slide = one actionable step (numbered). Include:
  * What to do (action verb)
  * Why it matters (brief context)
  * Quick tip (optional bonus)
- Slide 7: Recap key steps + link to additional resources

Tone: Educational, clear, encouraging. Like a trusted teacher.
Focus: Simplicity → actionability → progressive complexity
    `,
    templateImage: {
      dark: "/templates/step-by-step-dark.png",
      light: "/templates/step-by-step-light.png",
    },
  },
  {
    id: "data-storytelling",
    name: "Data Storytelling",
    subtitle: "Insights from Research",
    framework: "Data-Driven",
    bestFor: "Thought leadership, research insights, estadísticas",
    structure: [
      "Pregunta o hypothesis",
      "Stat visual 1 + contexto",
      "Stat visual 2 + contexto",
      "Stat visual 3 + contexto",
      "Stat visual 4 + contexto",
      "Insight principal (so what?)",
      "Implicaciones + CTA",
    ],
    slideCount: 7,
    promptInstructions: `
Create data-driven narrative that tells a story through statistics:
- Slide 1: Pose intriguing question or hypothesis
- Slides 2-5: Each slide = one key statistic with:
  * Large, prominent number (use large fontSize for numbers)
  * Brief context (what it means)
  * Source citation (small text)
- Slide 6: Synthesize insights ("So what does this mean?")
- Slide 7: Practical implications + CTA to learn more

Tone: Authoritative but accessible. Let data speak but provide interpretation.
Focus: Question → evidence → insight → action
Visual: Use LARGE numbers (80-120px fontSize) as visual anchors
    `,
    templateImage: {
      dark: "/templates/data-storytelling-dark.png",
      light: "/templates/data-storytelling-light.png",
    },
  },
  {
    id: "listicle",
    name: "Listicle/Tips",
    subtitle: "Quick Wins Format",
    framework: "List",
    bestFor: "Engagement rápido, viral content, tips prácticos",
    structure: [
      "X Tips para [achieve Y]",
      "Tip 1: [emoji + title]",
      "Tip 2: [emoji + title]",
      "Tip 3: [emoji + title]",
      "Tip 4: [emoji + title]",
      "Tip 5: [emoji + title]",
      "Bonus tip + CTA",
    ],
    slideCount: 7,
    promptInstructions: `
Create scannable, high-value tips list:
- Slide 1: Promise specific number of tips (e.g., "5 Tips to 10x Your Productivity")
- Slides 2-6: Each tip should have:
  * Relevant emoji as visual anchor (suggest emoji in content)
  * Catchy title (max 6 words)
  * 1-2 bullet points with actionable advice (max 12 words each)
- Slide 7: Bonus tip + CTA to follow for more

Tone: Energetic, friendly, punchy. Like a helpful colleague sharing hacks.
Focus: Scannability → memorability → shareability
Visual: Use emojis as EmojiNode type for visual interest
    `,
    templateImage: {
      dark: "/templates/listicle-dark.png",
      light: "/templates/listicle-light.png",
    },
  },
  {
    id: "behind-the-scenes",
    name: "Behind-the-Scenes",
    subtitle: "Personal Insights",
    framework: "BTS",
    bestFor: "Personal branding, humanización, autenticidad",
    structure: [
      "What nobody tells you about [X]",
      "Insight 1: [surprising truth]",
      "Insight 2: [lesson learned]",
      "Insight 3: [common misconception]",
      "Insight 4: [hidden challenge]",
      "Insight 5: [unexpected benefit]",
      "Takeaway + invitation",
    ],
    slideCount: 7,
    promptInstructions: `
Create authentic, vulnerable content sharing insider knowledge:
- Slide 1: Promise contrarian or surprising insights "What nobody tells you about..."
- Slides 2-6: Each insight should:
  * Challenge common assumptions
  * Share personal lesson or experience
  * Be specific (not generic advice)
  * Feel candid and honest
- Slide 7: Key takeaway + warm invitation to connect/discuss

Tone: Conversational, authentic, slightly vulnerable. Like talking to a friend.
Focus: Contrarian insights → personal stories → genuine connection
    `,
    templateImage: {
      dark: "/templates/behind-the-scenes-dark.png",
      light: "/templates/behind-the-scenes-light.png",
    },
  },
  {
    id: "case-study",
    name: "Case Study",
    subtitle: "Client Success Story",
    framework: "Case Study",
    bestFor: "B2B, servicios profesionales, demostración de autoridad",
    structure: [
      "Cliente + desafío principal",
      "Situación inicial (numbers)",
      "Estrategia: paso 1",
      "Estrategia: paso 2",
      "Estrategia: paso 3",
      "Resultados (numbers + timeframe)",
      "Lecciones + CTA",
    ],
    slideCount: 7,
    promptInstructions: `
Create compelling client case study with specificity:
- Slide 1: Introduce client (anonymized OK) and their main challenge
- Slide 2: Baseline metrics (specific numbers before starting)
- Slides 3-5: Your methodology broken down into 3 key strategies:
  * What you did (specific action)
  * Why this approach (brief rationale)
  * Implementation detail (1-2 bullets)
- Slide 6: Results with specific metrics, timeframe, and ROI
- Slide 7: Key lessons learned + CTA to discuss their situation

Tone: Professional, confident, outcome-focused. Balance humility with expertise.
Focus: Challenge → methodology → results → transferable lessons
Visual: Use numbers prominently in slides 2 and 6
    `,
    templateImage: {
      dark: "/templates/case-study-dark.png",
      light: "/templates/case-study-light.png",
    },
  },
]

export function getNarrativeStyle(id: string): NarrativeStyle | undefined {
  return NARRATIVE_STYLES.find((style) => style.id === id)
}

export function getNarrativeInstructions(id: string): string {
  const style = getNarrativeStyle(id)
  return style?.promptInstructions || ""
}
