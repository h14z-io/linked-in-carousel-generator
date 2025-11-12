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
  urgent: {
    es: "URGENTE: Lenguaje de presión y escasez. Usa palabras de urgencia ('ahora', 'antes de que', 'solo quedan', 'última oportunidad'). Crea FOMO (fear of missing out). Verbos imperativos (actúa, aprovecha, no pierdas). Números específicos de tiempo ('en las próximas 48h', 'quedan 3 cupos'). Tono: directo, apremiante, action-driving. Ejemplo: 'Si no actúas hoy, tus competidores lo harán mañana.'",
    en: "URGENT: Pressure and scarcity language. Use urgency words ('now', 'before', 'only X left', 'last chance'). Create FOMO (fear of missing out). Imperative verbs (act, seize, don't miss). Specific time numbers ('in the next 48h', '3 spots left'). Tone: direct, pressing, action-driving. Example: 'If you don't act today, your competitors will tomorrow.'",
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
  // PAS Framework → Objetivo implícito: Generar Leads
  const ctas = OBJECTIVE_CTAS.leads

  const promptEs = `Eres un Senior B2B Marketing Strategist especializado en LinkedIn con 10+ años creando contenido que convierte.

CONTEXTO:
- Audiencia: ${input.audienceMode.toUpperCase()} (Pain points: ${audience.painPoints[lang]})
- Objetivo: Generar Leads (PAS Framework - venta directa)
- Template: Problem-Agitate-Solution (PAS Framework)
- Número de slides: ${input.slideCount}

ANÁLISIS DE CONTENIDO FUENTE:
El contenido base puede venir de un URL extraído o texto directo. Tu trabajo es EXTRAER lo más valioso:

1. PRIORIZA: Busca datos numéricos, estadísticas, casos concretos, métricas de impacto
2. SINTETIZA: Si el contenido es largo (>2000 palabras), extrae las 3-5 ideas MÁS relevantes para ${input.audienceMode}
3. EXPANDE: Si el contenido es corto (<200 palabras), expande con ejemplos específicos usando ${audience.vocabulary[lang]}
4. IDENTIFICA: Números concretos para el hook (%, tiempo, dinero, ROI)
5. FALLBACK: Si el contenido es insuficiente o irrelevante, genera contenido basándote en ${audience.painPoints[lang]} y ${audience.benefits[lang]} con ejemplos de industria

TAREA:
Crea un carrusel de LinkedIn de ${input.slideCount} slides siguiendo EXACTAMENTE la estructura PAS:

ESTRUCTURA NARRATIVA (Problem-Agitate-Solution):
Slide 1 (HOOK): Problema específico y doloroso de ${input.audienceMode}. Incluye stat numérico si es posible.
Slides 2-${Math.floor(input.slideCount * 0.4)} (AGITATE): Consecuencias del problema - costos, tiempo perdido, frustración
Slides ${Math.floor(input.slideCount * 0.4) + 1}-${input.slideCount - 1} (SOLUTION): Tu solución paso a paso con beneficios claros
Slide ${input.slideCount} (CTA): Call to action directo

COPYWRITING PRINCIPLES (con ejemplos):
1. Hook: Específico + Numérico + Relevante
   ✅ BUENO: "CI/CD: ¿45 minutos de pipeline matando tu productividad?"
   ❌ MALO: "Los pipelines lentos son un problema"

2. Bullets: Empieza con verbo de acción, máximo ${input.copyLength === "short" ? "40" : "100"} caracteres
   ✅ BUENO: "Reduce deployments de 1h a 6min con pipelines automatizados"
   ❌ MALO: "Los pipelines automáticos son buenos"

3. IMPORTANTE: Genera 4-5 bullets por slide para llenar el espacio visual (formato 1080x1080px)

4. Benefits > Features: Enfócate en ${audience.benefits[lang]}
   ✅ BUENO: "Ahorra 200 horas/mes de compliance manual"
   ❌ MALO: "Tiene funcionalidad de compliance"

5. Usa vocabulario de ${input.audienceMode}: ${audience.vocabulary[lang]}

6. CTA: ${ctas[lang][0]}, ${ctas[lang][1]}, o similar

LINKEDIN BEST PRACTICES:
1. HOOK (Slide 1): Usa número específico + emoji estratégico si es apropiado (🚨, 💡, 📊)
2. STATS: Incluye al menos 2-3 números concretos en el carrusel
3. CTA: Si objetivo es "engagement", termina con pregunta abierta
4. HASHTAGS: Genera 3-5 hashtags relevantes específicos para ${input.audienceMode}:
   • Tech: #DevOps #CI/CD #CloudNative #TechLeadership #SoftwareEngineering
   • Finance: #CFO #ROI #FinTech #CostOptimization #FinancialStrategy
   • Exec: #DigitalTransformation #Leadership #Innovation #Strategy #BusinessGrowth
   • Managers: #TeamManagement #Productivity #AgileManagement #Leadership #TeamBuilding
5. TIMING: Recomienda mejores días/horas según audiencia:
   • Tech: Martes-Jueves 8-10am (developers checking morning updates)
   • Finance: Lunes-Miércoles 7-9am (executives early morning review)
   • Exec: Lunes-Viernes 6-8am (C-level early risers, pre-meetings)
   • Managers: Martes-Jueves 12-2pm (lunch break browsing)

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
  "post_copies": [{"audience": "${input.audienceMode}", "text": "LinkedIn post copy aquí"}],
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
  "schedule_suggestions": ["Día y hora óptima basado en audiencia ${input.audienceMode}"]
}

IMPORTANTE: Responde SOLO con el JSON, sin explicaciones adicionales.`

  const promptEn = `You are a Senior B2B Marketing Strategist with 10+ years creating high-converting LinkedIn content.

CONTEXT:
- Audience: ${input.audienceMode.toUpperCase()} (Pain points: ${audience.painPoints[lang]})
- Objective: Generate Leads (PAS Framework - direct sales)
- Template: Problem-Agitate-Solution (PAS Framework)
- Slide count: ${input.slideCount}

SOURCE CONTENT ANALYSIS:
The source content may come from extracted URLs or direct text. Your job is to EXTRACT the most valuable insights:

1. PRIORITIZE: Look for numeric data, statistics, concrete cases, impact metrics
2. SYNTHESIZE: If content is long (>2000 words), extract the 3-5 MOST relevant ideas for ${input.audienceMode}
3. EXPAND: If content is short (<200 words), expand with specific examples using ${audience.vocabulary[lang]}
4. IDENTIFY: Concrete numbers for the hook (%, time, money, ROI)
5. FALLBACK: If content is insufficient or irrelevant, generate content based on ${audience.painPoints[lang]} and ${audience.benefits[lang]} with industry examples

TASK:
Create a LinkedIn carousel with ${input.slideCount} slides following EXACTLY the PAS structure:

NARRATIVE STRUCTURE (Problem-Agitate-Solution):
Slide 1 (HOOK): Specific, painful problem for ${input.audienceMode}. Include numeric stat if possible.
Slides 2-${Math.floor(input.slideCount * 0.4)} (AGITATE): Problem consequences - costs, wasted time, frustration
Slides ${Math.floor(input.slideCount * 0.4) + 1}-${input.slideCount - 1} (SOLUTION): Your step-by-step solution with clear benefits
Slide ${input.slideCount} (CTA): Direct call to action

COPYWRITING PRINCIPLES (with examples):
1. Hook: Specific + Numeric + Relevant
   ✅ GOOD: "CI/CD: Are 45-minute pipelines killing your productivity?"
   ❌ BAD: "Slow pipelines are a problem"

2. Bullets: Start with action verb, max ${input.copyLength === "short" ? "40" : "100"} characters
   ✅ GOOD: "Reduce deployments from 1h to 6min with automated pipelines"
   ❌ BAD: "Automated pipelines are good"

3. IMPORTANT: Generate 4-5 bullets per slide to fill visual space (1080x1080px format)

4. Benefits > Features: Focus on ${audience.benefits[lang]}
   ✅ GOOD: "Save 200 hours/month on manual compliance"
   ❌ BAD: "Has compliance functionality"

5. Use ${input.audienceMode} vocabulary: ${audience.vocabulary[lang]}

6. CTA: ${ctas[lang][0]}, ${ctas[lang][1]}, or similar

LINKEDIN BEST PRACTICES:
1. HOOK (Slide 1): Use specific number + strategic emoji if appropriate (🚨, 💡, 📊)
2. STATS: Include at least 2-3 concrete numbers in the carousel
3. CTA: If objective is "engagement", end with open question
4. HASHTAGS: Generate 3-5 relevant hashtags specific to ${input.audienceMode}:
   • Tech: #DevOps #CI/CD #CloudNative #TechLeadership #SoftwareEngineering
   • Finance: #CFO #ROI #FinTech #CostOptimization #FinancialStrategy
   • Exec: #DigitalTransformation #Leadership #Innovation #Strategy #BusinessGrowth
   • Managers: #TeamManagement #Productivity #AgileManagement #Leadership #TeamBuilding
5. TIMING: Recommend best days/times by audience:
   • Tech: Tuesday-Thursday 8-10am (developers checking morning updates)
   • Finance: Monday-Wednesday 7-9am (executives early morning review)
   • Exec: Monday-Friday 6-8am (C-level early risers, pre-meetings)
   • Managers: Tuesday-Thursday 12-2pm (lunch break browsing)

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
  "post_copies": [{"audience": "${input.audienceMode}", "text": "LinkedIn post copy here"}],
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
  "schedule_suggestions": ["Optimal day and time based on ${input.audienceMode} audience"]
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
  // BAB Framework → Objetivo implícito: Posicionamiento de Marca (casos de éxito, ROI)
  const ctas = OBJECTIVE_CTAS.brand

  const promptEs = `Eres un Senior B2B Marketing Strategist especializado en casos de éxito y storytelling de transformación.

CONTEXTO:
- Audiencia: ${input.audienceMode.toUpperCase()}
- Objetivo: Posicionamiento de Marca (BAB Framework - casos de éxito, ROI)
- Template: Before-After-Bridge (BAB Framework)
- Número de slides: ${input.slideCount}

ANÁLISIS DE CONTENIDO FUENTE:
El contenido base puede venir de un URL extraído o texto directo. Tu trabajo es EXTRAER lo más valioso:

1. PRIORIZA: Busca métricas de transformación, antes/después concretos, ROI, tiempo ahorrado
2. SINTETIZA: Si el contenido es largo (>2000 palabras), extrae el caso de transformación más impactante
3. EXPANDE: Si el contenido es corto (<200 palabras), expande con ejemplos de transformación usando ${audience.benefits[lang]}
4. IDENTIFICA: Contraste numérico claro (de X a Y, reducción de Z%, ahorro de $)
5. FALLBACK: Si el contenido es insuficiente, genera caso de transformación basándote en ${audience.painPoints[lang]} → ${audience.benefits[lang]}

TAREA:
Crea un carrusel mostrando una transformación clara usando el framework BAB:

ESTRUCTURA NARRATIVA (Before-After-Bridge):
Slide 1 (HOOK): Promesa de transformación con métrica impactante
Slides 2-${Math.floor(input.slideCount * 0.3)} (BEFORE): Situación antes - pain points específicos de ${audience.painPoints[lang]}
Slides ${Math.floor(input.slideCount * 0.3) + 1}-${Math.floor(input.slideCount * 0.6)} (AFTER): Resultados conseguidos - métricas, beneficios cuantificables
Slides ${Math.floor(input.slideCount * 0.6) + 1}-${input.slideCount - 1} (BRIDGE): Cómo se logró - proceso/metodología
Slide ${input.slideCount} (CTA): Siguiente paso

COPYWRITING PRINCIPLES (con ejemplos):
1. Hook: Promesa + Métrica
   ✅ BUENO: "De 60 minutos a 5 minutos: Cómo optimizamos deployments en 3 meses"
   ❌ MALO: "Mejoramos nuestros deployments"

2. Before: Pain points reales y específicos
   ✅ BUENO: "Deployments fallaban 40% del tiempo, equipo trabajando hasta 10pm"
   ❌ MALO: "Teníamos problemas con deployments"

3. After: Números concretos (%, horas ahorradas, $)
   ✅ BUENO: "95% success rate, equipo sale a las 6pm, ahorro $50k/año"
   ❌ MALO: "Ahora funciona mejor"

4. Bridge: Pasos accionables, no solo "contratamos X"
   ✅ BUENO: "Implementamos pipelines paralelos + tests automatizados + rollback automático"
   ❌ MALO: "Contratamos una herramienta de CI/CD"

5. Contraste visual: antes (negativo) vs después (positivo)

6. IMPORTANTE: Genera 4-5 bullets por slide para llenar el espacio visual (formato 1080x1080px)

7. Usa vocabulario de ${input.audienceMode}: ${audience.vocabulary[lang]}

LINKEDIN BEST PRACTICES:
1. HOOK (Slide 1): Usa contraste numérico extremo + emoji si apropiado (📈, ⚡, 🚀)
2. BEFORE/AFTER: Contraste dramático con números específicos
3. CTA: Si objetivo es "engagement", pregunta "¿Cuál fue tu mayor obstáculo en transformación similar?"
4. HASHTAGS: Genera 3-5 hashtags relevantes para ${input.audienceMode}:
   • Tech: #DevOps #CloudTransformation #TechOptimization #DigitalTransformation #AgileTransformation
   • Finance: #ROI #CostReduction #FinancialTransformation #OPEX #DigitalFinance
   • Exec: #BusinessTransformation #ChangeManagement #Innovation #DigitalStrategy #Leadership
   • Managers: #ProcessImprovement #TeamProductivity #Automation #ChangeLeadership #TeamTransformation
5. TIMING: Recomienda según audiencia:
   • Tech: Martes-Jueves 8-10am
   • Finance: Lunes-Miércoles 7-9am
   • Exec: Lunes-Viernes 6-8am
   • Managers: Martes-Jueves 12-2pm

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
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
  "schedule_suggestions": ["Día y hora óptima basado en audiencia ${input.audienceMode}"]
}

IMPORTANTE: Responde SOLO con el JSON.`

  const promptEn = `You are a Senior B2B Marketing Strategist specialized in success stories and transformation storytelling.

CONTEXT:
- Audience: ${input.audienceMode.toUpperCase()}
- Objective: Brand Positioning (BAB Framework - success stories, ROI)
- Template: Before-After-Bridge (BAB Framework)
- Slide count: ${input.slideCount}

SOURCE CONTENT ANALYSIS:
The source content may come from extracted URLs or direct text. Your job is to EXTRACT the most valuable insights:

1. PRIORITIZE: Look for transformation metrics, concrete before/after, ROI, time saved
2. SYNTHESIZE: If content is long (>2000 words), extract the most impactful transformation case
3. EXPAND: If content is short (<200 words), expand with transformation examples using ${audience.benefits[lang]}
4. IDENTIFY: Clear numeric contrast (from X to Y, Z% reduction, $ savings)
5. FALLBACK: If content is insufficient, generate transformation case based on ${audience.painPoints[lang]} → ${audience.benefits[lang]}

TASK:
Create a carousel showing clear transformation using the BAB framework:

NARRATIVE STRUCTURE (Before-After-Bridge):
Slide 1 (HOOK): Transformation promise with impactful metric
Slides 2-${Math.floor(input.slideCount * 0.3)} (BEFORE): Situation before - specific pain points from ${audience.painPoints[lang]}
Slides ${Math.floor(input.slideCount * 0.3) + 1}-${Math.floor(input.slideCount * 0.6)} (AFTER): Results achieved - quantifiable metrics, benefits
Slides ${Math.floor(input.slideCount * 0.6) + 1}-${input.slideCount - 1} (BRIDGE): How it was achieved - process/methodology
Slide ${input.slideCount} (CTA): Next step

COPYWRITING PRINCIPLES (with examples):
1. Hook: Promise + Metric
   ✅ GOOD: "From 60 minutes to 5 minutes: How we optimized deployments in 3 months"
   ❌ BAD: "We improved our deployments"

2. Before: Real, specific pain points
   ✅ GOOD: "Deployments failed 40% of the time, team working until 10pm"
   ❌ BAD: "We had deployment problems"

3. After: Concrete numbers (%, hours saved, $)
   ✅ GOOD: "95% success rate, team leaves at 6pm, saves $50k/year"
   ❌ BAD: "It works better now"

4. Bridge: Actionable steps, not just "we hired X"
   ✅ GOOD: "Implemented parallel pipelines + automated tests + auto-rollback"
   ❌ BAD: "Hired a CI/CD tool"

5. Visual contrast: before (negative) vs after (positive)

6. IMPORTANT: Generate 4-5 bullets per slide to fill visual space (1080x1080px format)

7. Use ${input.audienceMode} vocabulary: ${audience.vocabulary[lang]}

LINKEDIN BEST PRACTICES:
1. HOOK (Slide 1): Use extreme numeric contrast + emoji if appropriate (📈, ⚡, 🚀)
2. BEFORE/AFTER: Dramatic contrast with specific numbers
3. CTA: If objective is "engagement", ask "What was your biggest obstacle in similar transformation?"
4. HASHTAGS: Generate 3-5 relevant hashtags for ${input.audienceMode}:
   • Tech: #DevOps #CloudTransformation #TechOptimization #DigitalTransformation #AgileTransformation
   • Finance: #ROI #CostReduction #FinancialTransformation #OPEX #DigitalFinance
   • Exec: #BusinessTransformation #ChangeManagement #Innovation #DigitalStrategy #Leadership
   • Managers: #ProcessImprovement #TeamProductivity #Automation #ChangeLeadership #TeamTransformation
5. TIMING: Recommend based on audience:
   • Tech: Tuesday-Thursday 8-10am
   • Finance: Monday-Wednesday 7-9am
   • Exec: Monday-Friday 6-8am
   • Managers: Tuesday-Thursday 12-2pm

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
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
  "schedule_suggestions": ["Optimal day and time based on ${input.audienceMode} audience"]
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
  // AIDA Framework → Objetivo implícito: Thought Leadership (educar audiencia)
  const ctas = OBJECTIVE_CTAS["thought-leadership"]

  const promptEs = `Eres un Senior B2B Thought Leader y Content Strategist especializado en contenido educativo de alto valor.

CONTEXTO:
- Audiencia: ${input.audienceMode.toUpperCase()}
- Objetivo: Thought Leadership (AIDA Framework - educar y posicionar como experto)
- Template: Educational Hook (AIDA Framework)
- Número de slides: ${input.slideCount}

ANÁLISIS DE CONTENIDO FUENTE:
El contenido base puede venir de un URL extraído o texto directo. Tu trabajo es EXTRAER lo más valioso:

1. PRIORIZA: Busca insights únicos, frameworks originales, datos contraintuitivos, metodologías
2. SINTETIZA: Si el contenido es largo (>2000 palabras), extrae las 3-5 lecciones clave más valiosas
3. EXPANDE: Si el contenido es corto (<200 palabras), expande con pasos accionables usando ${audience.vocabulary[lang]}
4. IDENTIFICA: Stats sorprendentes o datos que desafíen asunciones convencionales
5. FALLBACK: Si el contenido es insuficiente, genera insights educativos basándote en ${audience.painPoints[lang]} con ejemplos prácticos

TAREA:
Crea un carrusel educativo de alto valor usando el framework AIDA:

ESTRUCTURA NARRATIVA (Attention-Interest-Desire-Action):
Slide 1 (ATTENTION): Stat sorprendente o pregunta provocativa relacionada con ${audience.painPoints[lang]}
Slides 2-${Math.floor(input.slideCount * 0.5)} (INTEREST): Insights valiosos, datos, frameworks únicos
Slides ${Math.floor(input.slideCount * 0.5) + 1}-${input.slideCount - 1} (DESIRE): Por qué esto importa para ellos - beneficios de aplicar esto
Slide ${input.slideCount} (ACTION): CTA suave tipo thought leadership

COPYWRITING PRINCIPLES (con ejemplos):
1. Hook: Stat contraintuitivo o pregunta que desafíe asunciones
   ✅ BUENO: "87% de CTOs priorizan velocidad sobre calidad. Están equivocados."
   ❌ MALO: "La calidad del código es importante"

2. Insights: Información única, no genérica. Framework propio si es posible
   ✅ BUENO: "Framework RAPID: Review-Automate-Parallelize-Integrate-Deploy"
   ❌ MALO: "Haz CI/CD mejor"

3. Educativo: Paso a paso, "Aquí te muestro cómo..."
   ✅ BUENO: "Paso 1: Audita pipelines actuales. Paso 2: Identifica bottlenecks. Paso 3:..."
   ❌ MALO: "Mejora tus procesos"

4. Valor primero: 90% educación, 10% promoción

5. CTA suave: ${ctas[lang][0]}, ${ctas[lang][1]}

6. IMPORTANTE: Genera 4-5 bullets por slide para llenar el espacio visual (formato 1080x1080px)

7. Usa vocabulario de ${input.audienceMode}: ${audience.vocabulary[lang]}

LINKEDIN BEST PRACTICES:
1. HOOK (Slide 1): Stat contraintuitivo + pregunta provocativa. Emoji opcional (🧠, 💡, 📊)
2. FRAMEWORKS: Si creas framework, usa acrónimo memorable (RAPID, SMART, etc.)
3. CTA: Pregunta abierta para generar comentarios: "¿Cuál de estos 5 pasos te parece más crítico?"
4. HASHTAGS: Genera 3-5 hashtags thought leadership para ${input.audienceMode}:
   • Tech: #TechLeadership #EngineeringExcellence #DevOps #SoftwareArchitecture #TechStrategy
   • Finance: #FinancialLeadership #CFOInsights #FinTech #StrategicFinance #FinanceTransformation
   • Exec: #ThoughtLeadership #ExecutiveInsights #BusinessStrategy #Leadership #Innovation
   • Managers: #LeadershipDevelopment #TeamManagement #ManagerTips #PeopleManagement #LeadershipSkills
5. TIMING: Recomienda según audiencia:
   • Tech: Martes-Jueves 8-10am (morning learning time)
   • Finance: Lunes-Miércoles 7-9am (strategic planning hours)
   • Exec: Lunes-Viernes 6-8am (early morning insight consumption)
   • Managers: Martes-Jueves 12-2pm (lunch learning)

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
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
  "schedule_suggestions": ["Día y hora óptima basado en audiencia ${input.audienceMode}"]
}

IMPORTANTE: Responde SOLO con el JSON.`

  const promptEn = `You are a Senior B2B Thought Leader and Content Strategist specialized in high-value educational content.

CONTEXT:
- Audience: ${input.audienceMode.toUpperCase()}
- Objective: Thought Leadership (AIDA Framework - educate and position as expert)
- Template: Educational Hook (AIDA Framework)
- Slide count: ${input.slideCount}

SOURCE CONTENT ANALYSIS:
The source content may come from extracted URLs or direct text. Your job is to EXTRACT the most valuable insights:

1. PRIORITIZE: Look for unique insights, original frameworks, counter-intuitive data, methodologies
2. SYNTHESIZE: If content is long (>2000 words), extract the 3-5 most valuable key lessons
3. EXPAND: If content is short (<200 words), expand with actionable steps using ${audience.vocabulary[lang]}
4. IDENTIFY: Surprising stats or data that challenge conventional assumptions
5. FALLBACK: If content is insufficient, generate educational insights based on ${audience.painPoints[lang]} with practical examples

TASK:
Create a high-value educational carousel using the AIDA framework:

NARRATIVE STRUCTURE (Attention-Interest-Desire-Action):
Slide 1 (ATTENTION): Surprising stat or provocative question related to ${audience.painPoints[lang]}
Slides 2-${Math.floor(input.slideCount * 0.5)} (INTEREST): Valuable insights, data, unique frameworks
Slides ${Math.floor(input.slideCount * 0.5) + 1}-${input.slideCount - 1} (DESIRE): Why this matters to them - benefits of applying this
Slide ${input.slideCount} (ACTION): Soft CTA thought leadership style

COPYWRITING PRINCIPLES (with examples):
1. Hook: Counter-intuitive stat or assumption-challenging question
   ✅ GOOD: "87% of CTOs prioritize speed over quality. They're wrong."
   ❌ BAD: "Code quality is important"

2. Insights: Unique information, not generic. Proprietary framework if possible
   ✅ GOOD: "RAPID Framework: Review-Automate-Parallelize-Integrate-Deploy"
   ❌ BAD: "Do CI/CD better"

3. Educational: Step-by-step, "Let me show you how..."
   ✅ GOOD: "Step 1: Audit current pipelines. Step 2: Identify bottlenecks. Step 3:..."
   ❌ BAD: "Improve your processes"

4. Value first: 90% education, 10% promotion

5. Soft CTA: ${ctas[lang][0]}, ${ctas[lang][1]}

6. IMPORTANT: Generate 4-5 bullets per slide to fill visual space (1080x1080px format)

7. Use ${input.audienceMode} vocabulary: ${audience.vocabulary[lang]}

LINKEDIN BEST PRACTICES:
1. HOOK (Slide 1): Counter-intuitive stat + provocative question. Optional emoji (🧠, 💡, 📊)
2. FRAMEWORKS: If creating framework, use memorable acronym (RAPID, SMART, etc.)
3. CTA: Open question to generate comments: "Which of these 5 steps seems most critical?"
4. HASHTAGS: Generate 3-5 thought leadership hashtags for ${input.audienceMode}:
   • Tech: #TechLeadership #EngineeringExcellence #DevOps #SoftwareArchitecture #TechStrategy
   • Finance: #FinancialLeadership #CFOInsights #FinTech #StrategicFinance #FinanceTransformation
   • Exec: #ThoughtLeadership #ExecutiveInsights #BusinessStrategy #Leadership #Innovation
   • Managers: #LeadershipDevelopment #TeamManagement #ManagerTips #PeopleManagement #LeadershipSkills
5. TIMING: Recommend based on audience:
   • Tech: Tuesday-Thursday 8-10am (morning learning time)
   • Finance: Monday-Wednesday 7-9am (strategic planning hours)
   • Exec: Monday-Friday 6-8am (early morning insight consumption)
   • Managers: Tuesday-Thursday 12-2pm (lunch learning)

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
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
  "schedule_suggestions": ["Optimal day and time based on ${input.audienceMode} audience"]
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

ANÁLISIS DE CONTENIDO FUENTE:
El contenido base puede venir de un URL extraído o texto directo. Tu trabajo es EXTRAER lo más valioso:

1. PRIORIZA: Busca datos numéricos, estadísticas, casos concretos, insights accionables
2. SINTETIZA: Si el contenido es largo (>2000 palabras), extrae las 3-5 ideas MÁS relevantes para ${input.audienceMode}
3. EXPANDE: Si el contenido es corto (<200 palabras), expande con ejemplos específicos usando ${audience.vocabulary[lang]}
4. IDENTIFICA: Números concretos, métricas de impacto, resultados cuantificables
5. FALLBACK: Si el contenido es insuficiente o irrelevante, genera contenido basándote en ${audience.painPoints[lang]} y ${audience.benefits[lang]} con ejemplos de industria

TAREA:
Crea un carrusel de LinkedIn de ${input.slideCount} slides optimizado para máximo engagement.

ESTRUCTURA NARRATIVA:
Slide 1 (HOOK): Apertura impactante con problema/beneficio/stat numérico que enganche a ${input.audienceMode}
Slides 2-${input.slideCount - 1}: Desarrolla el contenido con valor claro (insights, pasos, beneficios, datos)
Slide ${input.slideCount} (CTA): Call to action directo

COPYWRITING PRINCIPLES (con ejemplos):
1. Hook potente: Específico + Numérico + Relevante
   ✅ BUENO: "DevOps: ¿Tus pipelines tardan 45+ minutos? Aquí está el problema"
   ❌ MALO: "Los pipelines son importantes para DevOps"

2. Bullets: Empieza con verbo de acción, máximo ${input.copyLength === "short" ? "40" : "100"} caracteres
   ✅ BUENO: "Automatiza tests E2E - reduce tiempo de QA 70%"
   ❌ MALO: "Los tests automatizados son buenos"

3. IMPORTANTE: Genera 4-5 bullets por slide para llenar el espacio visual (formato 1080x1080px)

4. Benefits > Features: Enfócate en ${audience.benefits[lang]}
   ✅ BUENO: "Elimina 200 horas/mes de trabajo manual"
   ❌ MALO: "Tiene automatización"

5. Usa vocabulario de ${input.audienceMode}: ${audience.vocabulary[lang]}

6. CTA: ${ctas[lang][0]}, ${ctas[lang][1]}, o similar

7. Progresión lógica: Cada slide debe conectar naturalmente con el siguiente

LINKEDIN BEST PRACTICES:
1. HOOK (Slide 1): Usa número específico + emoji estratégico si apropiado (🚨, 💡, 📊)
2. STATS: Incluye al menos 2-3 números concretos en el carrusel
3. CTA: Si objetivo es "engagement", termina con pregunta abierta
4. HASHTAGS: Genera 3-5 hashtags relevantes específicos para ${input.audienceMode}:
   • Tech: #DevOps #CI/CD #CloudNative #TechLeadership #SoftwareEngineering
   • Finance: #CFO #ROI #FinTech #CostOptimization #FinancialStrategy
   • Exec: #DigitalTransformation #Leadership #Innovation #Strategy #BusinessGrowth
   • Managers: #TeamManagement #Productivity #AgileManagement #Leadership #TeamBuilding
5. TIMING: Recomienda mejores días/horas según audiencia:
   • Tech: Martes-Jueves 8-10am
   • Finance: Lunes-Miércoles 7-9am
   • Exec: Lunes-Viernes 6-8am
   • Managers: Martes-Jueves 12-2pm

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
  "post_copies": [{"audience": "${input.audienceMode}", "text": "LinkedIn post copy aquí"}],
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
  "schedule_suggestions": ["Día y hora óptima basado en audiencia ${input.audienceMode}"]
}

IMPORTANTE: Responde SOLO con el JSON, sin explicaciones adicionales.`

  const promptEn = `You are a Senior B2B Marketing Strategist with 10+ years creating high-converting LinkedIn content.

CONTEXT:
- Audience: ${input.audienceMode.toUpperCase()} (Pain points: ${audience.painPoints[lang]})
- Objective: ${input.objective}
- Slide count: ${input.slideCount}

SOURCE CONTENT ANALYSIS:
The source content may come from extracted URLs or direct text. Your job is to EXTRACT the most valuable insights:

1. PRIORITIZE: Look for numeric data, statistics, concrete cases, actionable insights
2. SYNTHESIZE: If content is long (>2000 words), extract the 3-5 MOST relevant ideas for ${input.audienceMode}
3. EXPAND: If content is short (<200 words), expand with specific examples using ${audience.vocabulary[lang]}
4. IDENTIFY: Concrete numbers, impact metrics, quantifiable results
5. FALLBACK: If content is insufficient or irrelevant, generate content based on ${audience.painPoints[lang]} and ${audience.benefits[lang]} with industry examples

TASK:
Create a LinkedIn carousel with ${input.slideCount} slides optimized for maximum engagement.

NARRATIVE STRUCTURE:
Slide 1 (HOOK): Impactful opening with problem/benefit/numeric stat that hooks ${input.audienceMode}
Slides 2-${input.slideCount - 1}: Develop content with clear value (insights, steps, benefits, data)
Slide ${input.slideCount} (CTA): Direct call to action

COPYWRITING PRINCIPLES (with examples):
1. Strong hook: Specific + Numeric + Relevant
   ✅ GOOD: "DevOps: Are your pipelines taking 45+ minutes? Here's the problem"
   ❌ BAD: "Pipelines are important for DevOps"

2. Bullets: Start with action verb, max ${input.copyLength === "short" ? "40" : "100"} characters
   ✅ GOOD: "Automate E2E tests - reduce QA time by 70%"
   ❌ BAD: "Automated tests are good"

3. IMPORTANT: Generate 4-5 bullets per slide to fill visual space (1080x1080px format)

4. Benefits > Features: Focus on ${audience.benefits[lang]}
   ✅ GOOD: "Eliminate 200 hours/month of manual work"
   ❌ BAD: "Has automation"

5. Use ${input.audienceMode} vocabulary: ${audience.vocabulary[lang]}

6. CTA: ${ctas[lang][0]}, ${ctas[lang][1]}, or similar

7. Logical progression: Each slide should flow naturally to the next

LINKEDIN BEST PRACTICES:
1. HOOK (Slide 1): Use specific number + strategic emoji if appropriate (🚨, 💡, 📊)
2. STATS: Include at least 2-3 concrete numbers in the carousel
3. CTA: If objective is "engagement", end with open question
4. HASHTAGS: Generate 3-5 relevant hashtags specific to ${input.audienceMode}:
   • Tech: #DevOps #CI/CD #CloudNative #TechLeadership #SoftwareEngineering
   • Finance: #CFO #ROI #FinTech #CostOptimization #FinancialStrategy
   • Exec: #DigitalTransformation #Leadership #Innovation #Strategy #BusinessGrowth
   • Managers: #TeamManagement #Productivity #AgileManagement #Leadership #TeamBuilding
5. TIMING: Recommend best days/times by audience:
   • Tech: Tuesday-Thursday 8-10am
   • Finance: Monday-Wednesday 7-9am
   • Exec: Monday-Friday 6-8am
   • Managers: Tuesday-Thursday 12-2pm

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
  "post_copies": [{"audience": "${input.audienceMode}", "text": "LinkedIn post copy here"}],
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
  "schedule_suggestions": ["Optimal day and time based on ${input.audienceMode} audience"]
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
