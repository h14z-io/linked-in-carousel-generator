import type { GenerationInput } from "../types"

// Audience pain points and language mappings
const AUDIENCE_PROFILES = {
  tech: {
    painPoints: {
      es: "deuda técnica, pipelines lentos, escalabilidad, bugs en producción",
      en: "technical debt, slow pipelines, scalability issues, production bugs",
    },
    benefits: {
      es: "velocidad de deployment, arquitectura escalable, reducción de incidentes",
      en: "deployment velocity, scalable architecture, incident reduction",
    },
    vocabulary: {
      es: "DevOps, CI/CD, microservicios, containers, Kubernetes",
      en: "DevOps, CI/CD, microservices, containers, Kubernetes",
    },
  },
  finance: {
    painPoints: {
      es: "costos operativos elevados, falta de visibilidad ROI, compliance complejo",
      en: "high operational costs, lack of ROI visibility, complex compliance",
    },
    benefits: {
      es: "reducción de costos, ROI medible, cumplimiento automatizado",
      en: "cost reduction, measurable ROI, automated compliance",
    },
    vocabulary: {
      es: "TCO, ROI, OPEX vs CAPEX, análisis financiero",
      en: "TCO, ROI, OPEX vs CAPEX, financial analysis",
    },
  },
  exec: {
    painPoints: {
      es: "transformación digital lenta, falta de agilidad, competencia disruptiva",
      en: "slow digital transformation, lack of agility, disruptive competition",
    },
    benefits: {
      es: "ventaja competitiva, agilidad organizacional, innovación acelerada",
      en: "competitive advantage, organizational agility, accelerated innovation",
    },
    vocabulary: {
      es: "transformación digital, estrategia, innovación, liderazgo",
      en: "digital transformation, strategy, innovation, leadership",
    },
  },
  managers: {
    painPoints: {
      es: "baja productividad del equipo, procesos manuales, burnout",
      en: "low team productivity, manual processes, burnout",
    },
    benefits: {
      es: "equipo más productivo, automatización de tareas, mejor moral",
      en: "more productive team, task automation, improved morale",
    },
    vocabulary: {
      es: "gestión de equipos, procesos, productividad, colaboración",
      en: "team management, processes, productivity, collaboration",
    },
  },
}

// Tone mappings
const TONE_STYLES = {
  formal: {
    es: "Usa lenguaje formal y profesional. Estructura con claridad. Evita contracciones.",
    en: "Use formal, professional language. Structure clearly. Avoid contractions.",
  },
  conversational: {
    es: "Usa tono conversacional y cercano. Haz preguntas retóricas. Usa contracciones cuando sea natural.",
    en: "Use conversational, approachable tone. Ask rhetorical questions. Use contractions naturally.",
  },
  inspirational: {
    es: "Usa lenguaje aspiracional e inspirador. Pinta la visión del futuro. Motiva la acción.",
    en: "Use aspirational, inspiring language. Paint vision of the future. Motivate action.",
  },
  educational: {
    es: "Enfoque didáctico. Explica paso a paso. Usa 'Aquí te muestro cómo...'",
    en: "Educational focus. Explain step-by-step. Use 'Let me show you how...'",
  },
}

// Technical depth levels
const DEPTH_LEVELS = {
  basic: {
    es: "Usa analogías simples y términos generales. Evita jerga técnica.",
    en: "Use simple analogies and general terms. Avoid technical jargon.",
  },
  intermediate: {
    es: "Usa algunos términos técnicos pero explícalos brevemente.",
    en: "Use some technical terms but explain them briefly.",
  },
  advanced: {
    es: "Usa jerga de industria, arquitecturas específicas y métricas detalladas.",
    en: "Use industry jargon, specific architectures, and detailed metrics.",
  },
}

// Objective CTA mappings
const OBJECTIVE_CTAS = {
  leads: {
    es: ["Agenda una llamada ahora", "Descarga el whitepaper", "Solicita una demo"],
    en: ["Schedule a call now", "Download the whitepaper", "Request a demo"],
  },
  educate: {
    es: ["Aprende más en nuestro blog", "Guarda esto para después", "Comparte con tu equipo"],
    en: ["Learn more on our blog", "Save this for later", "Share with your team"],
  },
  brand: {
    es: ["Síguenos para más insights", "Únete a nuestra comunidad", "Conectemos"],
    en: ["Follow us for more insights", "Join our community", "Let's connect"],
  },
  engagement: {
    es: ["¿Qué opinas tú?", "Cuéntanos tu experiencia", "Comenta abajo"],
    en: ["What do you think?", "Share your experience", "Comment below"],
  },
  "thought-leadership": {
    es: ["Descubre nuestro framework", "Lee el artículo completo", "Suscríbete al newsletter"],
    en: ["Discover our framework", "Read the full article", "Subscribe to newsletter"],
  },
}

/**
 * Build prompt for Problem-Solution (PAS) template
 */
export function buildProblemSolutionPrompt(input: GenerationInput, corpus: string): string {
  const lang = input.language
  const audience = AUDIENCE_PROFILES[input.audienceMode]
  const toneStyle = TONE_STYLES[input.tone][lang]
  const depthLevel = DEPTH_LEVELS[input.technicalDepth][lang]
  const ctas = OBJECTIVE_CTAS[input.objective] || OBJECTIVE_CTAS.leads

  const promptEs = `Eres un Senior B2B Marketing Strategist especializado en LinkedIn con 10+ años creando contenido que convierte.

CONTEXTO:
- Audiencia: ${input.audienceMode.toUpperCase()} (Pain points: ${audience.painPoints[lang]})
- Objetivo: ${input.objective}
- Template: Problem-Agitate-Solution (PAS Framework)
- Número de slides: ${input.slideCount}

TAREA:
Crea un carrusel de LinkedIn de ${input.slideCount} slides siguiendo EXACTAMENTE la estructura PAS:

ESTRUCTURA NARRATIVA (Problem-Agitate-Solution):
Slide 1 (HOOK): Problema específico y doloroso de ${input.audienceMode}. Incluye stat numérico si es posible.
Slides 2-${Math.floor(input.slideCount * 0.4)} (AGITATE): Consecuencias del problema - costos, tiempo perdido, frustración
Slides ${Math.floor(input.slideCount * 0.4) + 1}-${input.slideCount - 1} (SOLUTION): Tu solución paso a paso con beneficios claros
Slide ${input.slideCount} (CTA): Call to action directo

COPYWRITING PRINCIPLES:
1. Hook: Específico + Numérico + Relevante (ej: "${audience.painPoints[lang]}")
2. Bullets: Empieza con verbo de acción, máximo ${input.copyLength === "short" ? "60" : "90"} caracteres
3. Benefits > Features: Enfócate en ${audience.benefits[lang]}
4. Usa vocabulario de ${input.audienceMode}: ${audience.vocabulary[lang]}
5. CTA: ${ctas[lang][0]}, ${ctas[lang][1]}, o similar

TONO: ${toneStyle}
PROFUNDIDAD TÉCNICA: ${depthLevel}

CONTENIDO BASE:
${corpus}

${input.requiredKeywords.length > 0 ? `PALABRAS CLAVE OBLIGATORIAS: ${input.requiredKeywords.join(", ")}` : ""}

FORMATO DE RESPUESTA (JSON estricto):
{
  "slides": [
    {
      "title": "Título del slide (máximo 60 caracteres)",
      "bullets": ["Bullet 1 (máximo ${input.copyLength === "short" ? "60" : "90"} chars)", "Bullet 2", "..."],
      "visual_direction": "Descripción visual para este slide"
    }
  ],
  "post_copies": [{"audience": "tech", "text": "LinkedIn post copy aquí"}],
  "hashtags": ["#hashtag1", "#hashtag2"],
  "schedule_suggestions": ["Mejor día/hora para postear"]
}

IMPORTANTE: Responde SOLO con el JSON, sin explicaciones adicionales.`

  const promptEn = `You are a Senior B2B Marketing Strategist with 10+ years creating high-converting LinkedIn content.

CONTEXT:
- Audience: ${input.audienceMode.toUpperCase()} (Pain points: ${audience.painPoints[lang]})
- Objective: ${input.objective}
- Template: Problem-Agitate-Solution (PAS Framework)
- Slide count: ${input.slideCount}

TASK:
Create a LinkedIn carousel with ${input.slideCount} slides following EXACTLY the PAS structure:

NARRATIVE STRUCTURE (Problem-Agitate-Solution):
Slide 1 (HOOK): Specific, painful problem for ${input.audienceMode}. Include numeric stat if possible.
Slides 2-${Math.floor(input.slideCount * 0.4)} (AGITATE): Problem consequences - costs, wasted time, frustration
Slides ${Math.floor(input.slideCount * 0.4) + 1}-${input.slideCount - 1} (SOLUTION): Your step-by-step solution with clear benefits
Slide ${input.slideCount} (CTA): Direct call to action

COPYWRITING PRINCIPLES:
1. Hook: Specific + Numeric + Relevant (e.g., "${audience.painPoints[lang]}")
2. Bullets: Start with action verb, max ${input.copyLength === "short" ? "60" : "90"} characters
3. Benefits > Features: Focus on ${audience.benefits[lang]}
4. Use ${input.audienceMode} vocabulary: ${audience.vocabulary[lang]}
5. CTA: ${ctas[lang][0]}, ${ctas[lang][1]}, or similar

TONE: ${toneStyle}
TECHNICAL DEPTH: ${depthLevel}

SOURCE CONTENT:
${corpus}

${input.requiredKeywords.length > 0 ? `REQUIRED KEYWORDS: ${input.requiredKeywords.join(", ")}` : ""}

RESPONSE FORMAT (strict JSON):
{
  "slides": [
    {
      "title": "Slide title (max 60 characters)",
      "bullets": ["Bullet 1 (max ${input.copyLength === "short" ? "60" : "90"} chars)", "Bullet 2", "..."],
      "visual_direction": "Visual description for this slide"
    }
  ],
  "post_copies": [{"audience": "tech", "text": "LinkedIn post copy here"}],
  "hashtags": ["#hashtag1", "#hashtag2"],
  "schedule_suggestions": ["Best day/time to post"]
}

IMPORTANT: Respond ONLY with JSON, no additional explanations.`

  return lang === "es" ? promptEs : promptEn
}

/**
 * Build prompt for Transformation (BAB) template
 */
export function buildTransformationPrompt(input: GenerationInput, corpus: string): string {
  const lang = input.language
  const audience = AUDIENCE_PROFILES[input.audienceMode]
  const toneStyle = TONE_STYLES[input.tone][lang]
  const depthLevel = DEPTH_LEVELS[input.technicalDepth][lang]
  const ctas = OBJECTIVE_CTAS[input.objective] || OBJECTIVE_CTAS.leads

  const promptEs = `Eres un Senior B2B Marketing Strategist especializado en casos de éxito y storytelling de transformación.

CONTEXTO:
- Audiencia: ${input.audienceMode.toUpperCase()}
- Objetivo: Mostrar transformación/resultados (${input.objective})
- Template: Before-After-Bridge (BAB Framework)
- Número de slides: ${input.slideCount}

TAREA:
Crea un carrusel mostrando una transformación clara usando el framework BAB:

ESTRUCTURA NARRATIVA (Before-After-Bridge):
Slide 1 (HOOK): Promesa de transformación con métrica impactante
Slides 2-${Math.floor(input.slideCount * 0.3)} (BEFORE): Situación antes - pain points específicos de ${audience.painPoints[lang]}
Slides ${Math.floor(input.slideCount * 0.3) + 1}-${Math.floor(input.slideCount * 0.6)} (AFTER): Resultados conseguidos - métricas, beneficios cuantificables
Slides ${Math.floor(input.slideCount * 0.6) + 1}-${input.slideCount - 1} (BRIDGE): Cómo se logró - proceso/metodología
Slide ${input.slideCount} (CTA): Siguiente paso

COPYWRITING PRINCIPLES:
1. Hook: Promesa + Métrica (ej: "De 60 min a 5 min: Cómo optimizamos...")
2. Before: Pain points reales y específicos
3. After: Números concretos (%, horas ahorradas, $, etc.)
4. Bridge: Pasos accionables, no solo "contratamos X"
5. Contraste visual: antes (negativo) vs después (positivo)

TONO: ${toneStyle}
PROFUNDIDAD TÉCNICA: ${depthLevel}

CONTENIDO BASE:
${corpus}

${input.requiredKeywords.length > 0 ? `PALABRAS CLAVE OBLIGATORIAS: ${input.requiredKeywords.join(", ")}` : ""}

FORMATO DE RESPUESTA (JSON estricto):
{
  "slides": [
    {
      "title": "Título (máximo 60 caracteres)",
      "bullets": ["Bullet 1 (máximo ${input.copyLength === "short" ? "60" : "90"} chars)", "..."],
      "visual_direction": "before/after/bridge/cta"
    }
  ],
  "post_copies": [{"audience": "${input.audienceMode}", "text": "LinkedIn post"}],
  "hashtags": ["#transformation", "#results"],
  "schedule_suggestions": ["Mejor momento"]
}

IMPORTANTE: Responde SOLO con el JSON.`

  const promptEn = `You are a Senior B2B Marketing Strategist specialized in success stories and transformation storytelling.

CONTEXT:
- Audience: ${input.audienceMode.toUpperCase()}
- Objective: Show transformation/results (${input.objective})
- Template: Before-After-Bridge (BAB Framework)
- Slide count: ${input.slideCount}

TASK:
Create a carousel showing clear transformation using the BAB framework:

NARRATIVE STRUCTURE (Before-After-Bridge):
Slide 1 (HOOK): Transformation promise with impactful metric
Slides 2-${Math.floor(input.slideCount * 0.3)} (BEFORE): Situation before - specific pain points from ${audience.painPoints[lang]}
Slides ${Math.floor(input.slideCount * 0.3) + 1}-${Math.floor(input.slideCount * 0.6)} (AFTER): Results achieved - quantifiable metrics, benefits
Slides ${Math.floor(input.slideCount * 0.6) + 1}-${input.slideCount - 1} (BRIDGE): How it was achieved - process/methodology
Slide ${input.slideCount} (CTA): Next step

COPYWRITING PRINCIPLES:
1. Hook: Promise + Metric (e.g., "From 60 min to 5 min: How we optimized...")
2. Before: Real, specific pain points
3. After: Concrete numbers (%, hours saved, $, etc.)
4. Bridge: Actionable steps, not just "we hired X"
5. Visual contrast: before (negative) vs after (positive)

TONE: ${toneStyle}
TECHNICAL DEPTH: ${depthLevel}

SOURCE CONTENT:
${corpus}

${input.requiredKeywords.length > 0 ? `REQUIRED KEYWORDS: ${input.requiredKeywords.join(", ")}` : ""}

RESPONSE FORMAT (strict JSON):
{
  "slides": [
    {
      "title": "Title (max 60 characters)",
      "bullets": ["Bullet 1 (max ${input.copyLength === "short" ? "60" : "90"} chars)", "..."],
      "visual_direction": "before/after/bridge/cta"
    }
  ],
  "post_copies": [{"audience": "${input.audienceMode}", "text": "LinkedIn post"}],
  "hashtags": ["#transformation", "#results"],
  "schedule_suggestions": ["Best time"]
}

IMPORTANT: Respond ONLY with JSON.`

  return lang === "es" ? promptEs : promptEn
}

/**
 * Build prompt for Educational (AIDA) template
 */
export function buildEducationalPrompt(input: GenerationInput, corpus: string): string {
  const lang = input.language
  const audience = AUDIENCE_PROFILES[input.audienceMode]
  const toneStyle = TONE_STYLES[input.tone][lang]
  const depthLevel = DEPTH_LEVELS[input.technicalDepth][lang]
  const ctas = OBJECTIVE_CTAS[input.objective] || OBJECTIVE_CTAS["thought-leadership"]

  const promptEs = `Eres un Senior B2B Thought Leader y Content Strategist especializado en contenido educativo de alto valor.

CONTEXTO:
- Audiencia: ${input.audienceMode.toUpperCase()}
- Objetivo: Educar y posicionar como experto (${input.objective})
- Template: Educational Hook (AIDA Framework)
- Número de slides: ${input.slideCount}

TAREA:
Crea un carrusel educativo de alto valor usando el framework AIDA:

ESTRUCTURA NARRATIVA (Attention-Interest-Desire-Action):
Slide 1 (ATTENTION): Stat sorprendente o pregunta provocativa relacionada con ${audience.painPoints[lang]}
Slides 2-${Math.floor(input.slideCount * 0.5)} (INTEREST): Insights valiosos, datos, frameworks únicos
Slides ${Math.floor(input.slideCount * 0.5) + 1}-${input.slideCount - 1} (DESIRE): Por qué esto importa para ellos - beneficios de aplicar esto
Slide ${input.slideCount} (ACTION): CTA suave tipo thought leadership

COPYWRITING PRINCIPLES:
1. Hook: Stat contraintuitivo o pregunta que desafíe asunciones
2. Insights: Información única, no genérica. Framework propio si es posible.
3. Educativo: Paso a paso, "Aquí te muestro cómo..."
4. Valor primero: 90% educación, 10% promoción
5. CTA suave: ${ctas[lang][0]}, ${ctas[lang][1]}

TONO: ${toneStyle}
PROFUNDIDAD TÉCNICA: ${depthLevel}

CONTENIDO BASE:
${corpus}

${input.requiredKeywords.length > 0 ? `PALABRAS CLAVE OBLIGATORIAS: ${input.requiredKeywords.join(", ")}` : ""}

FORMATO DE RESPUESTA (JSON estricto):
{
  "slides": [
    {
      "title": "Título educativo (máximo 60 caracteres)",
      "bullets": ["Insight 1 (máximo ${input.copyLength === "short" ? "60" : "90"} chars)", "..."],
      "visual_direction": "educational/data/framework/cta"
    }
  ],
  "post_copies": [{"audience": "${input.audienceMode}", "text": "Thought leadership post"}],
  "hashtags": ["#thoughtleadership", "#${input.audienceMode}"],
  "schedule_suggestions": ["Mejor momento para thought leadership"]
}

IMPORTANTE: Responde SOLO con el JSON.`

  const promptEn = `You are a Senior B2B Thought Leader and Content Strategist specialized in high-value educational content.

CONTEXT:
- Audience: ${input.audienceMode.toUpperCase()}
- Objective: Educate and position as expert (${input.objective})
- Template: Educational Hook (AIDA Framework)
- Slide count: ${input.slideCount}

TASK:
Create a high-value educational carousel using the AIDA framework:

NARRATIVE STRUCTURE (Attention-Interest-Desire-Action):
Slide 1 (ATTENTION): Surprising stat or provocative question related to ${audience.painPoints[lang]}
Slides 2-${Math.floor(input.slideCount * 0.5)} (INTEREST): Valuable insights, data, unique frameworks
Slides ${Math.floor(input.slideCount * 0.5) + 1}-${input.slideCount - 1} (DESIRE): Why this matters to them - benefits of applying this
Slide ${input.slideCount} (ACTION): Soft CTA thought leadership style

COPYWRITING PRINCIPLES:
1. Hook: Counter-intuitive stat or assumption-challenging question
2. Insights: Unique information, not generic. Proprietary framework if possible.
3. Educational: Step-by-step, "Let me show you how..."
4. Value first: 90% education, 10% promotion
5. Soft CTA: ${ctas[lang][0]}, ${ctas[lang][1]}

TONE: ${toneStyle}
TECHNICAL DEPTH: ${depthLevel}

SOURCE CONTENT:
${corpus}

${input.requiredKeywords.length > 0 ? `REQUIRED KEYWORDS: ${input.requiredKeywords.join(", ")}` : ""}

RESPONSE FORMAT (strict JSON):
{
  "slides": [
    {
      "title": "Educational title (max 60 characters)",
      "bullets": ["Insight 1 (max ${input.copyLength === "short" ? "60" : "90"} chars)", "..."],
      "visual_direction": "educational/data/framework/cta"
    }
  ],
  "post_copies": [{"audience": "${input.audienceMode}", "text": "Thought leadership post"}],
  "hashtags": ["#thoughtleadership", "#${input.audienceMode}"],
  "schedule_suggestions": ["Best time for thought leadership"]
}

IMPORTANT: Respond ONLY with JSON.`

  return lang === "es" ? promptEs : promptEn
}

/**
 * Generic LinkedIn carousel prompt - template-agnostic
 * Template selection only affects visual presentation, not content generation
 */
function buildGenericPrompt(input: GenerationInput, corpus: string): string {
  const lang = input.language
  const audience = AUDIENCE_PROFILES[input.audienceMode]
  const toneStyle = TONE_STYLES[input.tone][lang]
  const depthLevel = DEPTH_LEVELS[input.technicalDepth][lang]
  const ctas = OBJECTIVE_CTAS[input.objective as keyof typeof OBJECTIVE_CTAS] || OBJECTIVE_CTAS.leads

  const promptEs = `Eres un Senior B2B Marketing Strategist especializado en LinkedIn con 10+ años creando contenido que convierte.

CONTEXTO:
- Audiencia: ${input.audienceMode.toUpperCase()} (Pain points: ${audience.painPoints[lang]})
- Objetivo: ${input.objective}
- Número de slides: ${input.slideCount}

TAREA:
Crea un carrusel de LinkedIn de ${input.slideCount} slides optimizado para máximo engagement.

ESTRUCTURA NARRATIVA:
Slide 1 (HOOK): Apertura impactante con problema/beneficio/stat numérico que enganche a ${input.audienceMode}
Slides 2-${input.slideCount - 1}: Desarrolla el contenido con valor claro (insights, pasos, beneficios, datos)
Slide ${input.slideCount} (CTA): Call to action directo

COPYWRITING PRINCIPLES:
1. Hook potente: Específico + Numérico + Relevante (ej: "${audience.painPoints[lang]}")
2. Bullets: Empieza con verbo de acción, máximo ${input.copyLength === "short" ? "60" : "90"} caracteres
3. Benefits > Features: Enfócate en ${audience.benefits[lang]}
4. Usa vocabulario de ${input.audienceMode}: ${audience.vocabulary[lang]}
5. CTA: ${ctas[lang][0]}, ${ctas[lang][1]}, o similar
6. Progresión lógica: Cada slide debe conectar naturalmente con el siguiente

TONO: ${toneStyle}
PROFUNDIDAD TÉCNICA: ${depthLevel}

CONTENIDO BASE:
${corpus}

${input.requiredKeywords.length > 0 ? `PALABRAS CLAVE OBLIGATORIAS: ${input.requiredKeywords.join(", ")}` : ""}

FORMATO DE RESPUESTA (JSON estricto):
{
  "slides": [
    {
      "title": "Título del slide (máximo 60 caracteres)",
      "bullets": ["Bullet 1 (máximo ${input.copyLength === "short" ? "60" : "90"} chars)", "Bullet 2", "Bullet 3"],
      "visual_direction": "Descripción visual para este slide"
    }
  ],
  "post_copies": [{"audience": "tech", "text": "LinkedIn post copy aquí"}],
  "hashtags": ["#hashtag1", "#hashtag2"],
  "schedule_suggestions": ["Mejor día/hora para postear"]
}

IMPORTANTE: Responde SOLO con el JSON, sin explicaciones adicionales.`

  const promptEn = `You are a Senior B2B Marketing Strategist with 10+ years creating high-converting LinkedIn content.

CONTEXT:
- Audience: ${input.audienceMode.toUpperCase()} (Pain points: ${audience.painPoints[lang]})
- Objective: ${input.objective}
- Slide count: ${input.slideCount}

TASK:
Create a LinkedIn carousel with ${input.slideCount} slides optimized for maximum engagement.

NARRATIVE STRUCTURE:
Slide 1 (HOOK): Impactful opening with problem/benefit/numeric stat that hooks ${input.audienceMode}
Slides 2-${input.slideCount - 1}: Develop content with clear value (insights, steps, benefits, data)
Slide ${input.slideCount} (CTA): Direct call to action

COPYWRITING PRINCIPLES:
1. Strong hook: Specific + Numeric + Relevant (e.g., "${audience.painPoints[lang]}")
2. Bullets: Start with action verb, max ${input.copyLength === "short" ? "60" : "90"} characters
3. Benefits > Features: Focus on ${audience.benefits[lang]}
4. Use ${input.audienceMode} vocabulary: ${audience.vocabulary[lang]}
5. CTA: ${ctas[lang][0]}, ${ctas[lang][1]}, or similar
6. Logical progression: Each slide should flow naturally to the next

TONE: ${toneStyle}
TECHNICAL DEPTH: ${depthLevel}

SOURCE CONTENT:
${corpus}

${input.requiredKeywords.length > 0 ? `REQUIRED KEYWORDS: ${input.requiredKeywords.join(", ")}` : ""}

RESPONSE FORMAT (strict JSON):
{
  "slides": [
    {
      "title": "Slide title (max 60 characters)",
      "bullets": ["Bullet 1 (max ${input.copyLength === "short" ? "60" : "90"} chars)", "Bullet 2", "Bullet 3"],
      "visual_direction": "Visual description for this slide"
    }
  ],
  "post_copies": [{"audience": "tech", "text": "LinkedIn post copy here"}],
  "hashtags": ["#hashtag1", "#hashtag2"],
  "schedule_suggestions": ["Best day/time to post"]
}

IMPORTANT: Respond ONLY with JSON, no additional explanations.`

  return lang === "es" ? promptEs : promptEn
}

/**
 * Main function - now uses generic prompt (template is visual-only)
 */
export function buildCarouselPrompt(input: GenerationInput, corpus: string): string {
  return buildGenericPrompt(input, corpus)
}
