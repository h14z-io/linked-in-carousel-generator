import type { GenerationInput } from "../types"

// Audience pain points and language mappings - ultra-specific
const AUDIENCE_PROFILES = {
  tech: {
    painPoints: {
      es: "deuda técnica acumulada (6+ meses de refactoring), pipelines que tardan 45+ min, arquitectura monolítica que no escala, bugs críticos en producción cada semana, onboarding de devs que toma 2+ semanas",
      en: "accumulated technical debt (6+ months of refactoring), pipelines taking 45+ min, monolithic architecture that doesn't scale, critical production bugs weekly, dev onboarding taking 2+ weeks",
    },
    benefits: {
      es: "deployment 10x más rápido (de 1h a 6min), arquitectura que escala a 100k usuarios sin cambios, 90% menos incidentes de producción, tiempo de desarrollo reducido 40%",
      en: "10x faster deployment (from 1h to 6min), architecture scaling to 100k users without changes, 90% fewer production incidents, 40% reduced development time",
    },
    vocabulary: {
      es: "DevOps, CI/CD, microservicios, containers, Kubernetes, Infrastructure as Code, observabilidad, latency p99, throughput",
      en: "DevOps, CI/CD, microservices, containers, Kubernetes, Infrastructure as Code, observability, latency p99, throughput",
    },
  },
  finance: {
    painPoints: {
      es: "costos operativos que suben 15% anual, falta total de visibilidad ROI por proyecto, compliance manual que consume 200+ horas/mes, presupuestos IT que se desvían 30%+",
      en: "operational costs rising 15% yearly, zero ROI visibility per project, manual compliance consuming 200+ hours/month, IT budgets deviating 30%+",
    },
    benefits: {
      es: "reducción de OPEX del 25-40%, ROI medible en tiempo real por iniciativa, compliance automatizado (de 200h a 20h/mes), presupuestos con desviación <5%",
      en: "25-40% OPEX reduction, real-time measurable ROI per initiative, automated compliance (from 200h to 20h/month), budgets with <5% deviation",
    },
    vocabulary: {
      es: "TCO, ROI, NPV, IRR, OPEX vs CAPEX, análisis costo-beneficio, depreciación, amortización, payback period",
      en: "TCO, ROI, NPV, IRR, OPEX vs CAPEX, cost-benefit analysis, depreciation, amortization, payback period",
    },
  },
  exec: {
    painPoints: {
      es: "transformación digital estancada (3+ años sin progreso real), ciclos de decisión de 6+ meses, competidores disruptivos ganando 20%+ market share, silos organizacionales bloqueando innovación",
      en: "stalled digital transformation (3+ years without real progress), 6+ month decision cycles, disruptive competitors gaining 20%+ market share, organizational silos blocking innovation",
    },
    benefits: {
      es: "time-to-market reducido 60%, decisiones basadas en datos en tiempo real, ventaja competitiva sostenible (moat defendible), cultura de innovación continua",
      en: "60% reduced time-to-market, real-time data-driven decisions, sustainable competitive advantage (defensible moat), continuous innovation culture",
    },
    vocabulary: {
      es: "transformación digital, roadmap estratégico, competitive moat, disrupción, agilidad organizacional, OKRs, North Star metrics",
      en: "digital transformation, strategic roadmap, competitive moat, disruption, organizational agility, OKRs, North Star metrics",
    },
  },
  managers: {
    painPoints: {
      es: "productividad del equipo bajando 20% trimestral, 40%+ del tiempo en tareas manuales repetitivas, burnout del 30% del equipo, rotación alta (15%+ anual)",
      en: "team productivity dropping 20% quarterly, 40%+ of time on repetitive manual tasks, 30% team burnout rate, high turnover (15%+ yearly)",
    },
    benefits: {
      es: "productividad aumentada 35%, 60% de tareas repetitivas automatizadas, engagement del equipo subiendo de 60% a 85%, retención mejorada (rotación <5%)",
      en: "35% increased productivity, 60% of repetitive tasks automated, team engagement rising from 60% to 85%, improved retention (turnover <5%)",
    },
    vocabulary: {
      es: "gestión ágil, OKRs de equipo, proceso de onboarding, automatización de workflows, colaboración asíncrona, 1-on-1s efectivos",
      en: "agile management, team OKRs, onboarding process, workflow automation, async collaboration, effective 1-on-1s",
    },
  },
}

// Tone mappings - dramatic differences
const TONE_STYLES = {
  formal: {
    es: "FORMAL: Lenguaje corporativo ejecutivo. Tercera persona. Verbos en infinitivo. Estructura: Problema → Análisis → Solución → Conclusión. Ejemplo: 'Las organizaciones enfrentan...', 'Se recomienda implementar...'. Cero emociones. Cero contracciones. Máxima autoridad.",
    en: "FORMAL: Corporate executive language. Third person. Infinitive verbs. Structure: Problem → Analysis → Solution → Conclusion. Example: 'Organizations face...', 'It is recommended to implement...'. Zero emotions. Zero contractions. Maximum authority.",
  },
  conversational: {
    es: "CONVERSACIONAL: Habla como a un amigo en un café. Primera y segunda persona. Preguntas retóricas obligatorias ('¿Te suena familiar?', '¿Sabes qué descubrí?'). Contracciones naturales. Emojis opcionales. Tono: cálido, cercano, humano. Ejemplo: 'Mira, te cuento algo...'",
    en: "CONVERSATIONAL: Talk like to a friend at a coffee shop. First and second person. Rhetorical questions required ('Sound familiar?', 'Know what I discovered?'). Natural contractions. Optional emojis. Tone: warm, close, human. Example: 'Look, let me tell you something...'",
  },
  inspirational: {
    es: "INSPIRACIONAL: Lenguaje visionario y motivador. Verbos de acción poderosos (transforma, revoluciona, impulsa). Pinta el futuro ideal. Usa metáforas épicas ('imagina un mundo donde...', 'el futuro no se predice, se construye'). Emoción alta. Call to greatness. Ejemplo: 'No se trata solo de X, se trata de transformar...'",
    en: "INSPIRATIONAL: Visionary, motivating language. Powerful action verbs (transform, revolutionize, propel). Paint the ideal future. Use epic metaphors ('imagine a world where...', 'the future isn't predicted, it's built'). High emotion. Call to greatness. Example: 'It's not just about X, it's about transforming...'",
  },
  educational: {
    es: "EDUCACIONAL: Profesor experto explicando paso a paso. Usa 'Aquí te muestro cómo...', 'Paso 1:', 'Lo que esto significa es...'. Incluye micro-ejemplos en cada punto. Anticipa preguntas ('Tal vez te preguntes...'). Tono: paciente, detallado, clarificador. Evita asumir conocimiento previo.",
    en: "EDUCATIONAL: Expert teacher explaining step-by-step. Use 'Here's how...', 'Step 1:', 'What this means is...'. Include micro-examples in each point. Anticipate questions ('You might be wondering...'). Tone: patient, detailed, clarifying. Avoid assuming prior knowledge.",
  },
}

// Technical depth levels - audience-aware
const DEPTH_LEVELS = {
  basic: {
    es: "BÁSICO: Usa analogías cotidianas (ej: 'como un semáforo'). Cero jerga técnica. Explica como si fuera para tu abuela. Lenguaje extremadamente simple.",
    en: "BASIC: Use everyday analogies (e.g., 'like a traffic light'). Zero technical jargon. Explain like it's for your grandma. Extremely simple language.",
  },
  intermediate: {
    es: "INTERMEDIO: Usa términos técnicos comunes (API, servidor, base de datos) pero define cada uno en la misma frase. Ejemplo: 'El API (punto de conexión) permite...'",
    en: "INTERMEDIATE: Use common technical terms (API, server, database) but define each in the same sentence. Example: 'The API (connection point) allows...'",
  },
  advanced: {
    es: "AVANZADO: Jerga específica de industria obligatoria. Tech: Kubernetes, microservicios, event-driven architecture, latency p99. Finance: TCO, NPV, IRR. Exec: Digital transformation roadmap, competitive moat. Sin explicaciones básicas.",
    en: "ADVANCED: Industry-specific jargon required. Tech: Kubernetes, microservices, event-driven architecture, latency p99. Finance: TCO, NPV, IRR. Exec: Digital transformation roadmap, competitive moat. No basic explanations.",
  },
}

// Objective CTA mappings - ultra-specific and action-oriented
const OBJECTIVE_CTAS = {
  leads: {
    es: ["📅 Agenda tu consultoría gratuita de 30 min", "📥 Descarga el whitepaper con 15 estrategias probadas", "🎯 Solicita demo personalizada (sin compromiso)", "💬 Reserva tu sesión estratégica gratuita"],
    en: ["📅 Book your free 30-min consultation", "📥 Download whitepaper with 15 proven strategies", "🎯 Request personalized demo (no commitment)", "💬 Reserve your free strategic session"],
  },
  educate: {
    es: ["📚 Lee el artículo completo con 12 ejemplos reales", "💾 Guarda esto - lo necesitarás después", "👥 Comparte con tu equipo de liderazgo", "🔖 Descarga la guía PDF completa (gratis)"],
    en: ["📚 Read full article with 12 real examples", "💾 Save this - you'll need it later", "👥 Share with your leadership team", "🔖 Download complete PDF guide (free)"],
  },
  brand: {
    es: ["➕ Síguenos para 3 insights semanales como este", "🌟 Únete a nuestra comunidad de 10k+ profesionales", "🤝 Conectemos - hablemos sobre tu caso específico", "🔔 Activa notificaciones para no perderte contenido"],
    en: ["➕ Follow us for 3 weekly insights like this", "🌟 Join our community of 10k+ professionals", "🤝 Let's connect - talk about your specific case", "🔔 Turn on notifications to not miss content"],
  },
  engagement: {
    es: ["💭 ¿Cuál de estos 3 puntos resuena más contigo?", "📣 Cuéntanos: ¿cómo lo resolviste en tu empresa?", "👇 Comenta abajo tu mayor desafío en esto", "🔁 Repostea si esto te pasó alguna vez"],
    en: ["💭 Which of these 3 points resonates most with you?", "📣 Tell us: how did you solve this in your company?", "👇 Comment below your biggest challenge with this", "🔁 Repost if this happened to you"],
  },
  "thought-leadership": {
    es: ["🧠 Descubre nuestro framework exclusivo (usado por 500+ empresas)", "📖 Lee el deep-dive completo de 20 min", "📬 Suscríbete al newsletter semanal (12k+ suscriptores)", "🎓 Accede a nuestro curso gratuito sobre esto"],
    en: ["🧠 Discover our exclusive framework (used by 500+ companies)", "📖 Read the full 20-min deep-dive", "📬 Subscribe to weekly newsletter (12k+ subscribers)", "🎓 Access our free course on this"],
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
2. Bullets: Empieza con verbo de acción, máximo ${input.copyLength === "short" ? "40" : "100"} caracteres
3. IMPORTANTE: Genera 4-5 bullets por slide para llenar el espacio visual (formato 1080x1080px)
4. Benefits > Features: Enfócate en ${audience.benefits[lang]}
5. Usa vocabulario de ${input.audienceMode}: ${audience.vocabulary[lang]}
6. CTA: ${ctas[lang][0]}, ${ctas[lang][1]}, o similar

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
      "bullets": ["Bullet 1 (máximo ${input.copyLength === "short" ? "40" : "100"} chars)", "Bullet 2", "Bullet 3", "Bullet 4", "Bullet 5"],
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
2. Bullets: Start with action verb, max ${input.copyLength === "short" ? "40" : "100"} characters
3. IMPORTANT: Generate 4-5 bullets per slide to fill visual space (1080x1080px format)
4. Benefits > Features: Focus on ${audience.benefits[lang]}
5. Use ${input.audienceMode} vocabulary: ${audience.vocabulary[lang]}
6. CTA: ${ctas[lang][0]}, ${ctas[lang][1]}, or similar

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
      "bullets": ["Bullet 1 (max ${input.copyLength === "short" ? "40" : "100"} chars)", "Bullet 2", "Bullet 3", "Bullet 4", "Bullet 5"],
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
6. IMPORTANTE: Genera 4-5 bullets por slide para llenar el espacio visual (formato 1080x1080px)

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
      "bullets": ["Bullet 1 (máximo ${input.copyLength === "short" ? "40" : "100"} chars)", "Bullet 2", "Bullet 3", "Bullet 4", "Bullet 5"],
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
6. IMPORTANT: Generate 4-5 bullets per slide to fill visual space (1080x1080px format)

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
      "bullets": ["Bullet 1 (max ${input.copyLength === "short" ? "40" : "100"} chars)", "Bullet 2", "Bullet 3", "Bullet 4", "Bullet 5"],
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
6. IMPORTANTE: Genera 4-5 bullets por slide para llenar el espacio visual (formato 1080x1080px)

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
      "bullets": ["Insight 1 (máximo ${input.copyLength === "short" ? "40" : "100"} chars)", "Insight 2", "Insight 3", "Insight 4", "Insight 5"],
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
6. IMPORTANT: Generate 4-5 bullets per slide to fill visual space (1080x1080px format)

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
      "bullets": ["Insight 1 (max ${input.copyLength === "short" ? "40" : "100"} chars)", "Insight 2", "Insight 3", "Insight 4", "Insight 5"],
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
2. Bullets: Empieza con verbo de acción, máximo ${input.copyLength === "short" ? "40" : "100"} caracteres
3. IMPORTANTE: Genera 4-5 bullets por slide para llenar el espacio visual (formato 1080x1080px)
4. Benefits > Features: Enfócate en ${audience.benefits[lang]}
5. Usa vocabulario de ${input.audienceMode}: ${audience.vocabulary[lang]}
6. CTA: ${ctas[lang][0]}, ${ctas[lang][1]}, o similar
7. Progresión lógica: Cada slide debe conectar naturalmente con el siguiente

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
      "bullets": ["Bullet 1 (máximo ${input.copyLength === "short" ? "40" : "100"} chars)", "Bullet 2", "Bullet 3", "Bullet 4", "Bullet 5"],
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
2. Bullets: Start with action verb, max ${input.copyLength === "short" ? "40" : "100"} characters
3. IMPORTANT: Generate 4-5 bullets per slide to fill visual space (1080x1080px format)
4. Benefits > Features: Focus on ${audience.benefits[lang]}
5. Use ${input.audienceMode} vocabulary: ${audience.vocabulary[lang]}
6. CTA: ${ctas[lang][0]}, ${ctas[lang][1]}, or similar
7. Logical progression: Each slide should flow naturally to the next

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
      "bullets": ["Bullet 1 (max ${input.copyLength === "short" ? "40" : "100"} chars)", "Bullet 2", "Bullet 3", "Bullet 4", "Bullet 5"],
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
 * Main function - FASE 2: Conecta templateId con prompt específico
 */
export function buildCarouselPrompt(input: GenerationInput, corpus: string): string {
  console.log("[v0] FASE 2: Building prompt for template:", input.templateId)

  // Mapear templateId a prompt específico
  switch (input.templateId) {
    case "problem-solution":
      console.log("[v0] Using Problem-Solution (PAS) prompt")
      return buildProblemSolutionPrompt(input, corpus)

    case "transformation":
      console.log("[v0] Using Transformation (BAB) prompt")
      return buildTransformationPrompt(input, corpus)

    case "educational":
      console.log("[v0] Using Educational (AIDA) prompt")
      return buildEducationalPrompt(input, corpus)

    default:
      console.log("[v0] Using generic prompt (fallback)")
      return buildGenericPrompt(input, corpus)
  }
}
