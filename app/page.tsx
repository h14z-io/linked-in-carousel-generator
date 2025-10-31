"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sparkles, Download, Copy, AlertCircle, Loader2, RefreshCw, Edit2, X, Plus } from "lucide-react"
import type { GenerationInput, GenerationState, GenerationResult, Slide } from "@/lib/types"
import { safeExtractJSON } from "@/lib/safe-extract-json"
import { renderCarouselHTML } from "@/lib/template-renderer"
import { fetchMultipleUrls, isValidUrl } from "@/lib/fetch-url-content"
import { GoogleGenAI } from "@google/genai"
import html2canvas from "html2canvas"
import { toJpeg } from "html-to-image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const TEMPLATES = [
  { id: "template-a", label: "Template A", subtitle: "Minimal Tech" },
  { id: "template-b", label: "Template B", subtitle: "Bold Magenta" },
  { id: "template-c", label: "Template C", subtitle: "Editorial Grid" },
  { id: "template-d", label: "Template D", subtitle: "Data-Driven" },
  { id: "template-e", label: "Template E", subtitle: "Storytelling" },
]

const AUDIENCES = [
  { id: "tech", label: "Técnica", description: "Developers, Engineers, Architects" },
  { id: "finance", label: "Finanzas", description: "CFOs, Finance Directors" },
  { id: "exec", label: "Ejecutivos", description: "CEOs, C-Level - Estrategia y transformación" },
  { id: "managers", label: "Managers", description: "Team Leads, Directors - Implementación y equipos" },
]

const LANGUAGES = [
  { id: "es", label: "Español" },
  { id: "en", label: "English" },
]

const TECHNICAL_DEPTHS = [
  { id: "basic", label: "Básico", description: "Conceptos generales" },
  { id: "intermediate", label: "Intermedio", description: "Detalles técnicos moderados" },
  { id: "advanced", label: "Avanzado", description: "Profundidad técnica completa" },
]

const TONES = [
  { id: "formal", label: "Formal" },
  { id: "conversational", label: "Conversacional" },
  { id: "inspirational", label: "Inspiracional" },
  { id: "educational", label: "Educativo" },
]

const COPY_LENGTHS = [
  { id: "short", label: "Corto", description: "LinkedIn estándar (150-200 palabras)" },
  { id: "long", label: "Largo", description: "Storytelling (300-400 palabras)" },
]

const OBJECTIVES = [
  { id: "leads", label: "Generar Leads" },
  { id: "educate", label: "Educar Audiencia" },
  { id: "brand", label: "Posicionamiento de Marca" },
  { id: "engagement", label: "Aumentar Engagement" },
  { id: "thought-leadership", label: "Thought Leadership" },
]

export default function HomePage() {
  const [input, setInput] = useState<GenerationInput>({
    sourceText: "",
    sourceUrls: [],
    templateId: "template-a",
    audienceModes: ["tech", "finance", "exec", "managers"],
    slideCount: 4,
    language: "es",
    technicalDepth: "intermediate",
    tone: "conversational",
    copyLength: "short",
    objective: "leads",
    requiredKeywords: [],
  })

  const [generation, setGeneration] = useState<GenerationState>({
    htmlPreview: "",
    images: [],
    postCopies: [],
    hashtags: [],
    scheduleSuggestions: [],
  })

  const [slidesData, setSlidesData] = useState<Slide[]>([])
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null)
  const [slideEditInstructions, setSlideEditInstructions] = useState("")
  const [isEditingSlide, setIsEditingSlide] = useState(false)

  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)

  const [fontScale, setFontScale] = useState(1.0)

  const [keywordInput, setKeywordInput] = useState("")

  const [urlInputs, setUrlInputs] = useState<string[]>([""])
  const [urlErrors, setUrlErrors] = useState<string[]>([""])

  // Fix hydration mismatch: only render after mounting on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Update preview when fontScale changes
  useEffect(() => {
    if (slidesData.length > 0) {
      const html = renderCarouselHTML(slidesData, input.templateId, fontScale)
      setGeneration((prev) => ({ ...prev, htmlPreview: html }))
    }
  }, [fontScale])

  const handleSourceChange = (value: string) => {
    const lines = value.split("\n").map((s) => s.trim())
    const urls = lines.filter((s) => s.startsWith("http"))
    const text = lines
      .filter((s) => !s.startsWith("http"))
      .join("\n")
      .trim()

    setInput((prev) => ({
      ...prev,
      sourceText: text,
      sourceUrls: urls,
    }))
  }

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urlInputs]
    newUrls[index] = value
    setUrlInputs(newUrls)

    // Validate URL
    const newErrors = [...urlErrors]
    if (value.trim() && !isValidUrl(value.trim())) {
      newErrors[index] = "URL inválida"
    } else {
      newErrors[index] = ""
    }
    setUrlErrors(newErrors)

    // Update input state with valid URLs
    const validUrls = newUrls.filter((url) => url.trim() && isValidUrl(url.trim()))
    setInput((prev) => ({ ...prev, sourceUrls: validUrls }))
  }

  const addUrlField = () => {
    if (urlInputs.length < 5) {
      setUrlInputs([...urlInputs, ""])
      setUrlErrors([...urlErrors, ""])
    }
  }

  const removeUrlField = (index: number) => {
    const newUrls = urlInputs.filter((_, i) => i !== index)
    const newErrors = urlErrors.filter((_, i) => i !== index)
    setUrlInputs(newUrls)
    setUrlErrors(newErrors)

    // Update input state
    const validUrls = newUrls.filter((url) => url.trim() && isValidUrl(url.trim()))
    setInput((prev) => ({ ...prev, sourceUrls: validUrls }))
  }

  const handleAudienceToggle = (audienceId: string) => {
    setInput((prev) => {
      const current = prev.audienceModes
      const updated = current.includes(audienceId as any)
        ? current.filter((a) => a !== audienceId)
        : [...current, audienceId as any]
      return { ...prev, audienceModes: updated }
    })
  }

  const addKeyword = () => {
    if (keywordInput.trim() && !input.requiredKeywords.includes(keywordInput.trim())) {
      setInput((prev) => ({
        ...prev,
        requiredKeywords: [...prev.requiredKeywords, keywordInput.trim()],
      }))
      setKeywordInput("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setInput((prev) => ({
      ...prev,
      requiredKeywords: prev.requiredKeywords.filter((k) => k !== keyword),
    }))
  }

  const changeTemplate = (newTemplateId: string) => {
    if (slidesData.length === 0) return

    console.log("[v0] Changing template to:", newTemplateId)
    const html = renderCarouselHTML(slidesData, newTemplateId, fontScale)
    setGeneration((prev) => ({ ...prev, htmlPreview: html }))
    setInput((prev) => ({ ...prev, templateId: newTemplateId as any }))
  }

  const calculateOptimalFontScale = () => {
    if (slidesData.length === 0) return 1.0

    let totalTitleLength = 0
    let totalBullets = 0
    let totalBulletLength = 0

    slidesData.forEach((slide) => {
      totalTitleLength += slide.title.length
      totalBullets += slide.bullets.length
      slide.bullets.forEach((bullet) => {
        totalBulletLength += bullet.length
      })
    })

    const avgTitleLength = totalTitleLength / slidesData.length
    const avgBulletsPerSlide = totalBullets / slidesData.length
    const avgBulletLength = totalBulletLength / totalBullets

    // Start with 1.0 scale
    let scale = 1.0

    // Reduce scale if titles are long (>40 chars)
    if (avgTitleLength > 40) {
      scale -= (avgTitleLength - 40) * 0.006 // -0.6% per char over 40
    }

    // Reduce scale if many bullets (>3)
    if (avgBulletsPerSlide > 3) {
      scale -= (avgBulletsPerSlide - 3) * 0.08 // -8% per extra bullet
    }

    // Reduce scale if bullets are long (>60 chars)
    if (avgBulletLength > 60) {
      scale -= (avgBulletLength - 60) * 0.004 // -0.4% per char over 60
    }

    // Clamp between 0.5 and 2.5
    return Math.max(0.5, Math.min(2.5, scale))
  }

  const applyAutoScale = () => {
    const optimal = calculateOptimalFontScale()
    setFontScale(optimal)
  }

  const editSlide = async (slideIndex: number, instructions: string) => {
    const apiKey = localStorage.getItem("geminiApiKey")
    const geminiModel = localStorage.getItem("geminiModel") || "gemini-2.5-flash"

    if (!apiKey) {
      setError("Por favor configura tu API key de Gemini en la página de configuración")
      return
    }

    if (!instructions.trim()) {
      setError("Por favor proporciona instrucciones para editar el slide")
      return
    }

    setIsEditingSlide(true)
    setError("")

    try {
      console.log("[v0] Editing slide", slideIndex + 1, "with instructions:", instructions)
      console.log("[v0] Using model:", geminiModel)

      const ai = new GoogleGenAI({ apiKey })
      const currentSlide = slidesData[slideIndex]

      const languageInstruction =
        input.language === "en"
          ? "Respond in ENGLISH. All content must be in English."
          : "Responde en ESPAÑOL. Todo el contenido debe estar en español."

      const prompt = `${languageInstruction}

${input.language === "en" ? "You are editing slide" : "Estás editiendo el slide"} ${slideIndex + 1} ${input.language === "en" ? "of a LinkedIn carousel (1080x1080 SQUARE FORMAT)." : "de un carrusel de LinkedIn (formato CUADRADO 1080x1080)."}

${input.language === "en" ? "CURRENT SLIDE:" : "SLIDE ACTUAL:"}
Title: ${currentSlide.title}
${input.language === "en" ? "Bullets:" : "Bullets:"}
${currentSlide.bullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}

${input.language === "en" ? "USER INSTRUCTIONS:" : "INSTRUCCIONES DEL USUARIO:"}
${instructions}

${input.language === "en" ? "CRITICAL FOR SQUARE FORMAT:" : "CRÍTICO PARA FORMATO CUADRADO:"}
- ${input.language === "en" ? "Title: Max 2 lines (50 characters)" : "Título: Máximo 2 líneas (50 caracteres)"}
- ${input.language === "en" ? "Bullets: Max 12 words EACH - ultra-concise, scannable" : "Bullets: Máximo 12 palabras CADA UNO - ultra-concisos, escaneables"}
- ${input.language === "en" ? "Every word must add value - no filler" : "Cada palabra debe agregar valor - sin relleno"}

${input.language === "en" ? "REQUIREMENTS:" : "REQUERIMIENTOS:"}
- ${input.language === "en" ? "Maintain slide structure (title + 3-4 bullets)" : "Mantén la estructura del slide (título + 3-4 bullets)"}
- ${input.language === "en" ? "Keep professional LinkedIn tone" : "Mantén el tono profesional de LinkedIn"}
- ${input.language === "en" ? "Action verbs, specific data, clear benefits" : "Verbos de acción, datos específicos, beneficios claros"}
- ${input.language === "en" ? "Implement user request while keeping coherence with carousel theme" : "Implementa la solicitud manteniendo coherencia con el tema del carrusel"}

${input.language === "en" ? "Respond ONLY with valid JSON:" : "Responde SOLO con JSON válido:"}
{
  "title": "${input.language === "en" ? "Updated slide title (max 2 lines)" : "Título actualizado (máx 2 líneas)"}",
  "bullets": ["${input.language === "en" ? "Bullet 1 (max 12 words)" : "Bullet 1 (máx 12 palabras)"}", "${input.language === "en" ? "Bullet 2 (max 12 words)" : "Bullet 2 (máx 12 palabras)"}", "${input.language === "en" ? "Bullet 3 (max 12 words)" : "Bullet 3 (máx 12 palabras)"}"],
  "visual_direction": "${input.language === "en" ? "Visual description for square format" : "Descripción visual para formato cuadrado"}"
}`

      const response = await ai.models.generateContent({
        model: geminiModel,
        contents: prompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
      })

      let text = ""
      if (typeof response === "string") {
        text = response
      } else if (response.text) {
        text = response.text
      } else if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
        text = response.candidates[0].content.parts[0].text
      }

      console.log("[v0] Slide edit response received from", geminiModel)

      const updatedSlide: Slide = safeExtractJSON(text)

      if (!updatedSlide.title || !updatedSlide.bullets) {
        throw new Error("La respuesta no tiene el formato esperado")
      }

      // Update the slides data
      const newSlidesData = [...slidesData]
      newSlidesData[slideIndex] = updatedSlide
      setSlidesData(newSlidesData)

      // Re-render the carousel with updated slide
      const html = renderCarouselHTML(newSlidesData, input.templateId, fontScale)
      setGeneration((prev) => ({ ...prev, htmlPreview: html }))

      console.log("[v0] Slide edited successfully!")
      setEditingSlideIndex(null)
      setSlideEditInstructions("")
    } catch (err) {
      console.error("[v0] Slide edit error:", err)
      setError(err instanceof Error ? err.message : "Error al editar el slide")
    } finally {
      setIsEditingSlide(false)
    }
  }

  const generateCarousel = async () => {
    const apiKey = localStorage.getItem("geminiApiKey")
    const geminiModel = localStorage.getItem("geminiModel") || "gemini-2.5-flash"

    if (!apiKey) {
      setError("Por favor configura tu API key de Gemini en la página de configuración")
      return
    }

    // Updated check to include valid URLs from urlInputs state
    if (!input.sourceText && input.sourceUrls.length === 0) {
      setError("Por favor ingresa contenido base o URLs")
      return
    }

    setIsGenerating(true)
    setError("")

    try {
      console.log("[v0] Iniciando generación con modelo:", geminiModel)
      console.log("[v0] Template:", input.templateId)
      console.log("[v0] Slides:", input.slideCount)
      console.log("[v0] Audiencias:", input.audienceModes)
      console.log("[v0] Idioma:", input.language)

      let fetchedContent = ""
      if (input.sourceUrls.length > 0) {
        console.log("[v0] Fetching content from URLs:", input.sourceUrls)
        try {
          fetchedContent = await fetchMultipleUrls(input.sourceUrls)
          console.log("[v0] Successfully fetched content from URLs")
        } catch (error) {
          console.error("[v0] Error fetching URLs:", error)
          setError("Error al obtener contenido de las URLs. Verifica que sean válidas y accesibles.")
          setIsGenerating(false)
          return
        }
      }

      const corpus = [fetchedContent, input.sourceText].filter(Boolean).join("\n\n")

      if (!corpus.trim()) {
        setError("No se pudo obtener contenido. Verifica las URLs o agrega texto.")
        setIsGenerating(false)
        return
      }

      console.log("[v0] Total corpus length:", corpus.length, "characters")

      const ai = new GoogleGenAI({ apiKey })

      const languageInstruction =
        input.language === "en"
          ? "Generate the carousel in ENGLISH. All content must be in English."
          : "Genera el carrusel en ESPAÑOL. Todo el contenido debe estar en español."

      const depthInstructions = {
        basic:
          input.language === "en"
            ? "Use simple, accessible language. Avoid jargon. Focus on high-level concepts and benefits."
            : "Usa lenguaje simple y accesible. Evita jerga técnica. Enfócate en conceptos de alto nivel y beneficios.",
        intermediate:
          input.language === "en"
            ? "Balance technical details with accessibility. Use some industry terminology but explain key concepts."
            : "Balancea detalles técnicos con accesibilidad. Usa terminología de la industria pero explica conceptos clave.",
        advanced:
          input.language === "en"
            ? "Use technical depth and industry-specific terminology. Assume expert-level knowledge."
            : "Usa profundidad técnica y terminología específica de la industria. Asume conocimiento experto.",
      }

      const toneInstructions = {
        formal:
          input.language === "en"
            ? "Professional, authoritative tone. Use complete sentences and formal language."
            : "Tono profesional y autoritario. Usa oraciones completas y lenguaje formal.",
        conversational:
          input.language === "en"
            ? "Friendly, approachable tone. Use contractions and direct address. Make it feel like a conversation."
            : "Tono amigable y cercano. Usa contracciones y dirección directa. Hazlo sentir como una conversación.",
        inspirational:
          input.language === "en"
            ? "Motivating, aspirational tone. Focus on possibilities and transformation. Use powerful, emotive language."
            : "Tono motivador y aspiracional. Enfócate en posibilidades y transformación. Usa lenguaje poderoso y emotivo.",
        educational:
          input.language === "en"
            ? "Clear, instructive tone. Break down complex ideas. Use examples and analogies."
            : "Tono claro e instructivo. Desglosa ideas complejas. Usa ejemplos y analogías.",
      }

      const copyLengthInstructions = {
        short:
          input.language === "en"
            ? "Keep post copies VERY concise (100-150 words). Focus on 1 key insight and clear CTA. Ultra-scannable format."
            : "Mantén los copys MUY concisos (100-150 palabras). Enfócate en 1 insight clave y CTA claro. Formato ultra-escaneable.",
        long:
          input.language === "en"
            ? "Create focused post copies (200-250 words). Tell a brief story, provide context, and include data points. Stay scannable."
            : "Crea copys enfocados (200-250 palabras). Cuenta una historia breve, proporciona contexto e incluye datos. Mantén escaneable.",
      }

      const objectiveInstructions = {
        leads:
          input.language === "en"
            ? "Focus on generating leads. Include clear value propositions and CTAs. Emphasize ROI and business impact."
            : "Enfócate en generar leads. Incluye propuestas de valor claras y CTAs. Enfatiza ROI e impacto en negocio.",
        educate:
          input.language === "en"
            ? "Focus on educating the audience. Provide actionable insights and practical knowledge. Use data and examples."
            : "Enfócate en educar a la audiencia. Proporciona insights accionables y conocimiento práctico. Usa datos y ejemplos.",
        brand:
          input.language === "en"
            ? "Focus on brand positioning. Showcase expertise and unique perspective. Build authority and trust."
            : "Enfócate en posicionamiento de marca. Muestra expertise y perspectiva única. Construye autoridad y confianza.",
        engagement:
          input.language === "en"
            ? "Focus on engagement. Ask questions, encourage discussion. Make content shareable and relatable."
            : "Enfócate en engagement. Haz preguntas, fomenta discusión. Haz el contenido compartible y relatable.",
        "thought-leadership":
          input.language === "en"
            ? "Focus on thought leadership. Share unique insights and perspectives. Challenge conventional thinking."
            : "Enfócate en thought leadership. Comparte insights y perspectivas únicas. Desafía el pensamiento convencional.",
      }

      const keywordsInstruction =
        input.requiredKeywords.length > 0
          ? input.language === "en"
            ? `\nREQUIRED KEYWORDS: You MUST naturally incorporate these keywords: ${input.requiredKeywords.join(", ")}`
            : `\nPALABRAS CLAVE OBLIGATORIAS: DEBES incorporar naturally estas palabras clave: ${input.requiredKeywords.join(", ")}`
          : ""

      const audienceDescriptions = {
        tech:
          input.language === "en"
            ? "Technical audience (Developers, Engineers, Architects) - Focus on architecture, implementation details, technical benefits, code quality, and developer experience."
            : "Audiencia técnica (Developers, Engineers, Architects) - Enfócate en arquitectura, detalles de implementación, beneficios técnicos, calidad de código y experiencia del desarrollador.",
        finance:
          input.language === "en"
            ? "Finance audience (CFOs, Finance Directors) - Focus on ROI, cost savings, budget optimization, financial metrics, and bottom-line impact."
            : "Audiencia financiera (CFOs, Finance Directors) - Enfócate en ROI, ahorro de costos, optimización de presupuesto, métricas financieras e impacto en resultados.",
        exec:
          input.language === "en"
            ? "Executive audience (CEOs, C-Level) - Focus on strategic vision, business transformation, competitive advantage, market positioning, and long-term value."
            : "Audiencia ejecutiva (CEOs, C-Level) - Enfócate en visión estratégica, transformación del negocio, ventaja competitiva, posicionamiento en el mercado y valor a largo plazo.",
        managers:
          input.language === "en"
            ? "Manager audience (Team Leads, Directors) - Focus on team productivity, implementation roadmap, change management, resource allocation, and operational efficiency."
            : "Audiencia de managers (Team Leads, Directors) - Enfócate en productividad del equipo, roadmap de implementación, gestión del cambio, asignación de recursos y eficiencia operacional.",
      }

      const selectedAudienceInstructions = input.audienceModes
        .map((mode) => audienceDescriptions[mode as keyof typeof audienceDescriptions])
        .join("\n- ")

      const prompt = `${languageInstruction}

${input.language === "en" ? "Generate" : "Genera"} ${input.language === "en" ? "a professional LinkedIn carousel in valid JSON format for 1080x1080 SQUARE format." : "un carrusel profesional de LinkedIn en formato JSON válido para formato CUADRADO 1080x1080."}

${input.language === "en" ? "⚠️ CRITICAL: This is a SQUARE format (1080x1080px). Design text to be concise and scannable:" : "⚠️ CRÍTICO: Este es formato CUADRADO (1080x1080px). Diseña el texto para ser conciso y escaneable:"}
${input.language === "en" ? "- Titles: Maximum 2 lines (50 chars) - must fit in headline space" : "- Títulos: Máximo 2 líneas (50 caracteres) - deben caber en espacio de título"}
${input.language === "en" ? "- Bullets: Maximum 12 words EACH - highly specific, every word counts" : "- Bullets: Máximo 12 palabras CADA UNO - altamente específicos, cada palabra cuenta"}
${input.language === "en" ? "- Content must be visual, high-impact, and immediately valuable" : "- El contenido debe ser visual, de alto impacto e inmediatamente valioso"}

${input.language === "en" ? "IMPORTANT: You MUST base the carousel content EXCLUSIVELY on the provided content below. Do NOT make assumptions or use external knowledge. Extract key insights, data, and information directly from the source material." : "IMPORTANTE: DEBES basar el contenido del carrusel EXCLUSIVAMENTE en el contenido proporcionado a continuación. NO hagas suposiciones ni uses conocimiento externo. Extrae insights clave, datos e información directamente del material fuente."}

${input.language === "en" ? "SOURCE CONTENT:" : "CONTENIDO FUENTE:"}
${corpus}

${input.language === "en" ? "CONTENT STRATEGY:" : "ESTRATEGIA DE CONTENIDO:"}
- ${input.language === "en" ? "Technical Depth:" : "Profundidad Técnica:"} ${input.technicalDepth.toUpperCase()} - ${depthInstructions[input.technicalDepth]}
- ${input.language === "en" ? "Tone:" : "Tono:"} ${input.tone.toUpperCase()} - ${toneInstructions[input.tone]}
- ${input.language === "en" ? "Copy Length:" : "Longitud del Copy:"} ${input.copyLength.toUpperCase()} - ${copyLengthInstructions[input.copyLength]}
- ${input.language === "en" ? "Objective:" : "Objetivo:"} ${input.objective.toUpperCase()} - ${objectiveInstructions[input.objective]}${keywordsInstruction}

${input.language === "en" ? "CONFIGURATION:" : "CONFIGURACIÓN:"}
- Template: ${input.templateId}
- Slides: ${input.slideCount}
- ${input.language === "en" ? "Audiences:" : "Audiencias:"} ${input.audienceModes.join(", ")}
- ${input.language === "en" ? "Language:" : "Idioma:"} ${input.language === "en" ? "English" : "Español"}

${input.language === "en" ? "AUDIENCE TARGETING:" : "SEGMENTACIÓN DE AUDIENCIAS:"}
${input.language === "en" ? "Create distinct post copies for each audience. Each copy should be SIGNIFICANTLY different, not just minor tweaks:" : "Crea copys distintos para cada audiencia. Cada copy debe ser SIGNIFICATIVAMENTE diferente, no solo ajustes menores:"}
- ${selectedAudienceInstructions}

${input.language === "en" ? "COPYWRITING BEST PRACTICES:" : "MEJORES PRÁCTICAS DE COPYWRITING:"}
1. ${input.language === "en" ? "Use the AIDA framework (Attention, Interest, Desire, Action)" : "Usa el framework AIDA (Atención, Interés, Deseo, Acción)"}
2. ${input.language === "en" ? "Start with a hook - address a pain point or ask a compelling question" : "Comienza con un gancho - aborda un pain point o haz una pregunta convincente"}
3. ${input.language === "en" ? "Use specific numbers and data points from the source content" : "Usa números específicos y datos del contenido fuente"}
4. ${input.language === "en" ? "Each bullet should start with an action verb" : "Cada bullet debe comenzar con un verbo de acción"}
5. ${input.language === "en" ? "Include social proof or credibility indicators from the source" : "Incluye prueba social o indicadores de credibilidad del contenido fuente"}
6. ${input.language === "en" ? "End with a clear, specific CTA" : "Termina con un CTA claro y específico"}

${input.language === "en" ? "SLIDE STRUCTURE (1080x1080 SQUARE FORMAT):" : "ESTRUCTURA DE SLIDES (FORMATO 1080x1080 CUADRADO):"}
- Slide 1: ${input.language === "en" ? "Hook - Compelling title (max 2 lines) + problem/opportunity from source" : "Gancho - Título convincente (máx 2 líneas) + problema/oportunidad del contenido fuente"}
- Slides 2-${input.slideCount - 1}: ${input.language === "en" ? "Value - Clear title + 3-4 concise bullets (max 12 words each) with data from source" : "Valor - Título claro + 3-4 bullets concisos (máx 12 palabras c/u) con datos del contenido fuente"}
- Slide ${input.slideCount}: ${input.language === "en" ? "CTA - Bold title + 2-3 action items. Ends with clear call-to-action" : "CTA - Título audaz + 2-3 items de acción. Termina con CTA claro"}

${input.language === "en" ? "REQUIRED JSON FORMAT:" : "FORMATO JSON REQUERIDO:"}
{
  "slides": [
    {
      "title": "${input.language === "en" ? "Problem or Insight Hook" : "Gancho: Problema o Insight"}",
      "bullets": ["${input.language === "en" ? "Specific stat from source (max 12 words)" : "Estadística específica del contenido (máx 12 palabras)"}", "${input.language === "en" ? "Pain point or opportunity (concise)" : "Pain point u oportunidad (conciso)"}", "${input.language === "en" ? "Why this matters now (direct, brief)" : "Por qué importa ahora (directo, breve)"}"],
      "visual_direction": "${input.language === "en" ? "Highlight the problem visually. Use contrast and emphasis." : "Destaca el problema visualmente. Usa contraste y énfasis."}"
    }
  ],
  "post_copies": [
    {"audience": "tech", "text": "${input.language === "en" ? "Technical architecture and implementation copy" : "Copy de arquitectura técnica e implementación"}"},
    {"audience": "finance", "text": "${input.language === "en" ? "ROI-focused copy with financial metrics" : "Copy enfocado en ROI con métricas financieras"}"},
    {"audience": "exec", "text": "${input.language === "en" ? "Strategic vision and transformation copy" : "Copy de visión estratégica y transformación"}"},
    {"audience": "managers", "text": "${input.language === "en" ? "Team productivity and implementation copy" : "Copy de productividad del equipo e implementación"}"}
  ],
  "hashtags": ["#RelevantTag1", "#IndustrySpecific2", "#TrendingTopic3"],
  "schedule_suggestions": ["${input.language === "en" ? "Tuesday 10:00 AM EST" : "Martes 10:00 -06:00"}", "${input.language === "en" ? "Thursday 2:00 PM EST" : "Jueves 14:00 -06:00"}"]
}

${input.language === "en" ? "QUALITY CRITERIA FOR SQUARE FORMAT (1080x1080):" : "CRITERIOS DE CALIDAD PARA FORMATO CUADRADO (1080x1080):"}
- ${input.language === "en" ? "TITLES: Max 2 lines (~50 characters). Compelling and specific, not generic" : "TÍTULOS: Máx 2 líneas (~50 caracteres). Convincentes y específicos, no genéricos"}
- ${input.language === "en" ? "BULLETS: 3-4 bullets per slide, max 12 words EACH. Every word must add value" : "BULLETS: 3-4 bullets por slide, máx 12 palabras CADA UNO. Cada palabra debe agregar valor"}
- ${input.language === "en" ? "DATA: Use concrete numbers/metrics FROM SOURCE ONLY, not invented statistics" : "DATOS: Usa números/métricas concretos SOLO DEL CONTENIDO FUENTE, no estadísticas inventadas"}
- ${input.language === "en" ? "SCANNABILITY: Text must be scannable at a glance - use action verbs and short chunks" : "ESCANIBILIDAD: El texto debe ser escaneable de un vistazo - usa verbos de acción y fragmentos cortos"}
- ${input.language === "en" ? "AUDIENCE COPIES: SIGNIFICANTLY different by audience - different angle, different CTA, different focus" : "COPYS POR AUDIENCIA: SIGNIFICATIVAMENTE diferente por audiencia - ángulo diferente, CTA diferente, enfoque diferente"}
- ${input.language === "en" ? "Hashtags: Mix niche industry terms (3) with broader topics (2) - total max 5 hashtags" : "Hashtags: Mezcla términos de nicho (3) con temas más amplios (2) - máx 5 hashtags totales"}
- ${input.language === "en" ? "Schedule: Optimal LinkedIn times based on audience timezone and engagement patterns" : "Horarios: Tiempos óptimos de LinkedIn según zona horaria de audiencia y patrones de engagement"}

${input.language === "en" ? "Respond ONLY with valid JSON. No markdown, no explanations, just the JSON object:" : "Responde SOLO con el JSON válido. Sin markdown, sin explicaciones, solo el objeto JSON:"}`

      const response = await ai.models.generateContent({
        model: geminiModel,
        contents: prompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 8000,
        },
      })

      console.log("[v0] Response received from", geminiModel)

      if (response.candidates?.[0]?.finishReason === "MAX_TOKENS") {
        throw new Error(
          "La respuesta fue truncada por límite de tokens. Intenta reducir el número de slides o audiencias.",
        )
      }

      let text = ""

      if (typeof response === "string") {
        text = response
      } else if (response.text) {
        text = response.text
      } else if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
        text = response.candidates[0].content.parts[0].text
      } else if (response.candidates?.[0]?.text) {
        text = response.candidates[0].text
      } else {
        console.error("[v0] Could not find text in response:", response)
        throw new Error("No se pudo extraer el texto de la respuesta de Gemini. Estructura de respuesta inesperada.")
      }

      console.log("[v0] Extracted text length:", text.length)
      console.log("[v0] First 200 chars:", text.substring(0, 200))

      if (!text) {
        console.error("[v0] Empty response from Gemini")
        throw new Error("Gemini no devolvió contenido. Intenta de nuevo con un prompt diferente.")
      }

      console.log("[v0] Extracting JSON from response...")
      const payload: GenerationResult = safeExtractJSON(text)

      console.log("[v0] Extracted payload:", payload)

      if (!payload.slides || payload.slides.length === 0) {
        console.error("[v0] Invalid payload structure:", payload)
        throw new Error("La respuesta de Gemini no tiene el formato esperado. Intenta de nuevo.")
      }

      // Validate that required keywords are present if specified
      if (input.requiredKeywords.length > 0) {
        const allText = JSON.stringify(payload).toLowerCase()
        const missingKeywords = input.requiredKeywords.filter((keyword) => !allText.includes(keyword.toLowerCase()))
        if (missingKeywords.length > 0) {
          console.warn("[v0] Missing required keywords:", missingKeywords)
        }
      }

      setSlidesData(payload.slides)

      console.log("[v0] Rendering carousel HTML...")
      const html = renderCarouselHTML(payload.slides, input.templateId, fontScale)

      setGeneration({
        htmlPreview: html,
        images: [],
        postCopies: payload.post_copies?.map((p) => `${p.audience.toUpperCase()}: ${p.text}`) || [],
        hashtags: payload.hashtags || [],
        scheduleSuggestions: payload.schedule_suggestions || [],
      })

      console.log("[v0] Carousel generated successfully with Gemini 2.5 Pro!")
    } catch (err) {
      console.error("[v0] Generation error:", err)
      let errorMessage = "Error desconocido al generar carrusel"

      if (err instanceof Error) {
        if (err.message.includes("API key")) {
          errorMessage = "API Key inválida. Verifica tu configuración en la página de Configuración."
        } else if (err.message.includes("quota")) {
          errorMessage = "Límite de cuota excedido. Espera unos minutos e intenta de nuevo."
        } else if (err.message.includes("not found")) {
          errorMessage = "Modelo no encontrado. Verifica que tu API key tenga acceso a Gemini 2.5 Pro."
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyHashtags = () => {
    navigator.clipboard.writeText(generation.hashtags.join(" "))
  }

  // Function to copy individual copy text
  const copyCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadImagesWithHTMLToImage = async () => {
    if (!generation.htmlPreview) return

    try {
      console.log("[v0] Starting JPEG export (html-to-image)...")

      const iframe = document.createElement("iframe")
      iframe.style.position = "fixed"
      iframe.style.left = "-9999px"
      iframe.style.top = "0"
      iframe.style.width = "1080px"
      iframe.style.height = "1080px"
      iframe.style.border = "none"
      iframe.style.visibility = "visible"
      document.body.appendChild(iframe)

      iframe.contentDocument?.open()
      iframe.contentDocument?.write(generation.htmlPreview)
      iframe.contentDocument?.close()

      await new Promise((resolve) => setTimeout(resolve, 3500))

      const iframeDoc = iframe.contentDocument
      if (!iframeDoc) {
        throw new Error("No se pudo acceder al contenido del iframe")
      }

      const slides = iframeDoc.querySelectorAll(".slide")
      console.log("[v0] Found", slides.length, "slides")

      if (slides.length === 0) {
        throw new Error("No se encontraron slides para descargar")
      }

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i] as HTMLElement
        console.log(`[v0] Rendering slide ${i + 1}/${slides.length} with html-to-image...`)

        try {
          const dataUrl = await toJpeg(slide, {
            width: 1080,
            height: 1080,
            pixelRatio: 3,
            quality: 0.95,
            backgroundColor: "#0B0B0E",
          })

          const link = document.createElement("a")
          link.download = `carousel-slide-${i + 1}.jpg`
          link.href = dataUrl
          link.click()

          console.log(`[v0] Slide ${i + 1} exported with html-to-image`)
        } catch (slideError) {
          console.error(`[v0] Error exporting slide ${i + 1}:`, slideError)
          throw new Error(`No se pudo exportar slide ${i + 1}`)
        }

        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      document.body.removeChild(iframe)
      console.log("[v0] All slides exported successfully with html-to-image (1080x1350)")
    } catch (error) {
      console.error("[v0] html-to-image export error:", error)
      setError(
        error instanceof Error
          ? `Error al descargar con html-to-image: ${error.message}`
          : "Error al descargar las imágenes. Intenta de nuevo.",
      )
    }
  }

  const downloadImagesWithHTML2Canvas = async () => {
    if (!generation.htmlPreview) return

    try {
      console.log("[v0] Starting JPEG export (html2canvas)...")

      const iframe = document.createElement("iframe")
      iframe.style.position = "fixed"
      iframe.style.left = "-9999px"
      iframe.style.top = "0"
      iframe.style.width = "1080px"
      iframe.style.height = "1080px"
      iframe.style.border = "none"
      iframe.style.visibility = "visible"
      document.body.appendChild(iframe)

      iframe.contentDocument?.open()
      iframe.contentDocument?.write(generation.htmlPreview)
      iframe.contentDocument?.close()

      await new Promise((resolve) => setTimeout(resolve, 3500))

      const iframeDoc = iframe.contentDocument
      if (!iframeDoc) {
        throw new Error("No se pudo acceder al contenido del iframe")
      }

      const slides = iframeDoc.querySelectorAll(".slide")
      console.log("[v0] Found", slides.length, "slides")

      if (slides.length === 0) {
        throw new Error("No se encontraron slides para descargar")
      }

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i] as HTMLElement
        console.log(`[v0] Rendering slide ${i + 1}/${slides.length} to JPEG...`)

        const canvas = await html2canvas(slide, {
          width: 1080,
          height: 1080,
          scale: 3,
          backgroundColor: "#0B0B0E",
          logging: false,
          useCORS: true,
          allowTaint: true,
          windowHeight: 1080,
          windowWidth: 1080,
        })

        await new Promise<void>((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.download = `carousel-slide-${i + 1}.jpg`
                link.href = url
                link.click()
                URL.revokeObjectURL(url)
                console.log(`[v0] Slide ${i + 1} exported: ${(blob.size / 1024).toFixed(2)}KB`)
                resolve()
              } else {
                reject(new Error(`Failed to export slide ${i + 1}`))
              }
            },
            "image/jpeg",
            0.95,
          )
        })

        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      document.body.removeChild(iframe)
      console.log("[v0] All slides exported successfully as JPEG (1080x1350)")
    } catch (error) {
      console.error("[v0] html2canvas export error:", error)
      setError(
        error instanceof Error
          ? `Error al descargar las imágenes: ${error.message}`
          : "Error al descargar las imágenes. Intenta de nuevo.",
      )
    }
  }

  const downloadImages = async () => {
    const exportEngine = localStorage.getItem("exportEngine") || "html2canvas"

    if (exportEngine === "html-to-image") {
      await downloadImagesWithHTMLToImage()
    } else {
      await downloadImagesWithHTML2Canvas()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">Generar Carrusel</h1>
          <p className="mt-2 text-pretty text-muted-foreground">
            Crea carruseles profesionales para LinkedIn con IA en segundos
          </p>
        </div>

        {mounted && (
        <div className="space-y-6">
          {/* Input Form - Full Width */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Configuración del Carrusel</CardTitle>
              <CardDescription className="text-muted-foreground">
                Configura todos los parámetros para generar tu carrusel personalizado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Contenido Base</h3>
                  <p className="text-sm text-muted-foreground">
                    El contenido fuente que se usará para generar el carrusel. El sistema leerá y extraerá el contenido
                    real de las URLs.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-foreground">URLs (hasta 5)</Label>
                  <p className="text-xs text-muted-foreground">
                    Agrega URLs de artículos, blogs o páginas web. El sistema extraerá automáticamente el contenido.
                  </p>
                  {urlInputs.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1 space-y-1">
                        <Input
                          placeholder={`URL ${index + 1} (ej: https://example.com/article)`}
                          value={url}
                          onChange={(e) => handleUrlChange(index, e.target.value)}
                          className={`border-input bg-secondary text-foreground placeholder:text-muted-foreground ${
                            urlErrors[index] ? "border-destructive" : ""
                          }`}
                        />
                        {urlErrors[index] && <p className="text-xs text-destructive">{urlErrors[index]}</p>}
                      </div>
                      {urlInputs.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeUrlField(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {urlInputs.length < 5 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addUrlField}
                      className="w-full border-dashed bg-transparent"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar URL
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source" className="text-foreground">
                    Texto Adicional (Opcional)
                  </Label>
                  <Textarea
                    id="source"
                    placeholder="Pega tu texto o URLs (una por línea)..."
                    rows={8}
                    value={input.sourceText}
                    onChange={(e) => setInput((prev) => ({ ...prev, sourceText: e.target.value }))}
                    className="resize-none border-input bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                  />
                  <p className="text-xs text-muted-foreground">
                    Este texto se combinará con el contenido extraído de las URLs para crear un corpus único.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Idioma</Label>
                  <Tabs
                    value={input.language}
                    onValueChange={(v) => setInput((prev) => ({ ...prev, language: v as "es" | "en" }))}
                  >
                    <TabsList className="grid w-full grid-cols-2 bg-secondary">
                      {LANGUAGES.map((lang) => (
                        <TabsTrigger
                          key={lang.id}
                          value={lang.id}
                          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          {lang.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <Separator className="bg-border" />

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Diseño Visual</h3>
                  <p className="text-sm text-muted-foreground">Selecciona la plantilla de diseño para tus slides</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Plantilla</Label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setInput((prev) => ({ ...prev, templateId: t.id as any }))}
                        className={`group relative overflow-hidden rounded-lg border-2 transition-all ${
                          input.templateId === t.id
                            ? "border-primary shadow-lg shadow-primary/20"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="h-32 bg-secondary p-3">
                          {/* Template A - Minimal */}
                          {t.id === "template-a" && (
                            <div className="flex h-full flex-col justify-between rounded border border-border/50 bg-background p-2">
                              <div className="space-y-1">
                                <div className="h-1 w-4 rounded bg-primary/60" />
                                <div className="h-1.5 w-full rounded bg-foreground/80" />
                                <div className="space-y-0.5">
                                  <div className="h-0.5 w-full rounded bg-muted-foreground/40" />
                                  <div className="h-0.5 w-full rounded bg-muted-foreground/40" />
                                  <div className="h-0.5 w-3/4 rounded bg-muted-foreground/40" />
                                </div>
                              </div>
                              <div className="h-px w-full rounded bg-border" />
                            </div>
                          )}

                          {/* Template B - Bold Magenta (Improved) */}
                          {t.id === "template-b" && (
                            <div className="flex h-full gap-1">
                              <div className="w-1 rounded bg-primary" />
                              <div className="flex flex-1 flex-col justify-between rounded border border-border/50 bg-background p-2 shadow-md shadow-primary/10">
                                <div className="space-y-1">
                                  <div className="h-1 w-4 rounded bg-primary" />
                                  <div className="relative h-1.5 w-full rounded bg-foreground/80">
                                    <div className="absolute -bottom-1 left-0 h-0.5 w-8 rounded bg-primary" />
                                  </div>
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-1">
                                      <div className="h-1 w-1 rounded-full bg-primary" />
                                      <div className="h-0.5 flex-1 rounded bg-muted-foreground/60" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <div className="h-1 w-1 rounded-full bg-primary" />
                                      <div className="h-0.5 flex-1 rounded bg-muted-foreground/60" />
                                    </div>
                                  </div>
                                </div>
                                <div className="h-px w-full rounded bg-border" />
                              </div>
                            </div>
                          )}

                          {/* Template C - Editorial */}
                          {t.id === "template-c" && (
                            <div className="flex h-full gap-1">
                              <div className="w-1 rounded bg-primary" />
                              <div className="flex flex-1 flex-col justify-between rounded bg-background p-2">
                                <div className="space-y-1">
                                  <div className="h-1 w-4 rounded bg-primary/60" />
                                  <div className="h-1.5 w-full rounded bg-foreground/80 font-serif italic" />
                                  <div className="space-y-0.5">
                                    <div className="h-0.5 w-full rounded bg-muted-foreground/40" />
                                    <div className="h-0.5 w-full rounded bg-muted-foreground/40" />
                                    <div className="h-0.5 w-2/3 rounded bg-muted-foreground/40" />
                                  </div>
                                </div>
                                <div className="h-px w-full rounded bg-border" />
                              </div>
                            </div>
                          )}

                          {/* Template D - Data-Driven preview */}
                          {t.id === "template-d" && (
                            <div className="flex h-full flex-col justify-between rounded-lg border-2 border-border/50 bg-gradient-to-br from-background to-primary/5 p-2">
                              <div className="space-y-1">
                                <div className="h-2 w-6 rounded bg-primary shadow-sm shadow-primary/30" />
                                <div className="h-2 w-full rounded bg-foreground/90 font-bold" />
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1">
                                    <div className="text-[8px] text-primary">▸</div>
                                    <div className="h-0.5 flex-1 rounded bg-foreground/70" />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="text-[8px] text-primary">▸</div>
                                    <div className="h-0.5 flex-1 rounded bg-foreground/70" />
                                  </div>
                                </div>
                              </div>
                              <div className="h-px w-full rounded bg-border" />
                            </div>
                          )}

                          {/* Template E - Storytelling preview */}
                          {t.id === "template-e" && (
                            <div className="flex h-full flex-col justify-between rounded-lg bg-gradient-to-b from-background to-background/95 p-2 shadow-lg">
                              <div className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-primary via-pink-500 to-primary" />
                              <div className="space-y-1 pt-1">
                                <div className="h-1 w-3 rounded bg-primary/60 text-[8px]" />
                                <div className="h-2 w-full rounded bg-gradient-to-r from-foreground/90 to-muted-foreground/70" />
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1">
                                    <div className="text-[8px] text-primary">→</div>
                                    <div className="h-0.5 flex-1 rounded bg-muted-foreground/60" />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="text-[8px] text-primary">→</div>
                                    <div className="h-0.5 flex-1 rounded bg-muted-foreground/60" />
                                  </div>
                                </div>
                              </div>
                              <div className="h-px w-full rounded bg-primary/20" />
                            </div>
                          )}
                        </div>
                        <div className="bg-secondary/50 px-2 py-1.5 text-center">
                          <div className="text-[11px] font-semibold text-foreground">{t.label}</div>
                          <div className="text-[9px] text-muted-foreground">{t.subtitle}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <Separator className="bg-border" />

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Configuración de Contenido</h3>
                  <p className="text-sm text-muted-foreground">
                    Controla el estilo, tono y profundidad del contenido de los slides
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="technical-depth" className="text-foreground">
                      Profundidad Técnica
                    </Label>
                    <Select
                      value={input.technicalDepth}
                      onValueChange={(v) => setInput((prev) => ({ ...prev, technicalDepth: v as any }))}
                    >
                      <SelectTrigger
                        id="technical-depth"
                        className="h-auto w-full min-h-[2.5rem] border-input bg-secondary text-foreground"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-border bg-card">
                        {TECHNICAL_DEPTHS.map((depth) => (
                          <SelectItem key={depth.id} value={depth.id} className="text-foreground">
                            <div className="py-1">
                              <div className="font-medium">{depth.label}</div>
                              <div className="text-xs text-muted-foreground">{depth.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tone" className="text-foreground">
                      Tono
                    </Label>
                    <Select value={input.tone} onValueChange={(v) => setInput((prev) => ({ ...prev, tone: v as any }))}>
                      <SelectTrigger
                        id="tone"
                        className="h-auto w-full min-h-[2.5rem] border-input bg-secondary text-foreground"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-border bg-card">
                        {TONES.map((tone) => (
                          <SelectItem key={tone.id} value={tone.id} className="text-foreground">
                            {tone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="copy-length" className="text-foreground">
                      Longitud del Copy
                    </Label>
                    <Select
                      value={input.copyLength}
                      onValueChange={(v) => setInput((prev) => ({ ...prev, copyLength: v as any }))}
                    >
                      <SelectTrigger
                        id="copy-length"
                        className="h-auto w-full min-h-[2.5rem] border-input bg-secondary text-foreground"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-border bg-card">
                        {COPY_LENGTHS.map((length) => (
                          <SelectItem key={length.id} value={length.id} className="text-foreground">
                            <div className="py-1">
                              <div className="font-medium">{length.label}</div>
                              <div className="text-xs text-muted-foreground">{length.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="objective" className="text-foreground">
                      Objetivo
                    </Label>
                    <Select
                      value={input.objective}
                      onValueChange={(v) => setInput((prev) => ({ ...prev, objective: v }))}
                    >
                      <SelectTrigger
                        id="objective"
                        className="h-auto w-full min-h-[2.5rem] border-input bg-secondary text-foreground"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-border bg-card">
                        {OBJECTIVES.map((obj) => (
                          <SelectItem key={obj.id} value={obj.id} className="text-foreground">
                            {obj.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords" className="text-foreground">
                    Palabras Clave Obligatorias
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="keywords"
                      placeholder="Agregar palabra clave..."
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addKeyword()
                        }
                      }}
                      className="border-input bg-secondary text-foreground placeholder:text-muted-foreground"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addKeyword}
                      className="border-border bg-transparent text-foreground hover:bg-secondary"
                    >
                      Agregar
                    </Button>
                  </div>
                  {input.requiredKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {input.requiredKeywords.map((keyword, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                        >
                          {keyword}
                          <button
                            onClick={() => removeKeyword(keyword)}
                            className="hover:text-primary-foreground"
                            aria-label="Remove keyword"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Separator className="bg-border" />

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Audiencias</h3>
                  <p className="text-sm text-muted-foreground">
                    Genera versiones del post copy adaptadas para diferentes audiencias
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {AUDIENCES.map((audience) => (
                    <div key={audience.id} className="flex items-start gap-3">
                      <Checkbox
                        id={audience.id}
                        checked={input.audienceModes.includes(audience.id as any)}
                        onCheckedChange={() => handleAudienceToggle(audience.id)}
                        className="border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                      <div className="flex flex-col">
                        <label
                          htmlFor={audience.id}
                          className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {audience.label}
                        </label>
                        <p className="text-xs text-muted-foreground">{audience.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-border" />

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Configuración del Carrusel</h3>
                  <p className="text-sm text-muted-foreground">Define cuántos slides tendrá tu carrusel</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Número de slides: {input.slideCount}</Label>
                  <Slider
                    value={[input.slideCount]}
                    onValueChange={([v]) => setInput((prev) => ({ ...prev, slideCount: v }))}
                    min={3}
                    max={7}
                    step={1}
                    className="w-full [&_[role=slider]]:border-primary [&_[role=slider]]:bg-primary"
                  />
                  <p className="text-xs text-muted-foreground">Selecciona entre 3 y 7 slides para tu carrusel</p>
                </div>
              </div>

              {error && (
                <Alert className="border-destructive bg-destructive/10">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-destructive">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={generateCarousel}
                disabled={isGenerating}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generar Carrusel
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {generation.htmlPreview && (
            <div className="space-y-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Vista Previa</CardTitle>
                      <CardDescription>Preview interactivo del carrusel generado</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-muted-foreground">Cambiar plantilla:</Label>
                      <div className="flex gap-1">
                        {TEMPLATES.map((t) => (
                          <Button
                            key={t.id}
                            variant={input.templateId === t.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => changeTemplate(t.id)}
                            className="h-8 px-3"
                          >
                            {t.label.split(" ")[1]}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-foreground">Escala de Fuente</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-primary">{fontScale.toFixed(2)}x</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={applyAutoScale}
                            className="h-7 px-3 text-xs"
                            disabled={slidesData.length === 0}
                          >
                            Auto
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFontScale(1.0)}
                            className="h-7 px-3 text-xs"
                          >
                            Reset
                          </Button>
                        </div>
                      </div>
                      <Slider
                        value={[fontScale]}
                        onValueChange={(v) => setFontScale(v[0])}
                        min={0.5}
                        max={2.5}
                        step={0.05}
                        className="w-full"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>0.5x - Muy pequeño</span>
                        <span>1.0x - Normal</span>
                        <span>2.5x - Muy grande</span>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="rounded-lg border-2 border-border bg-background shadow-xl overflow-hidden" style={{ aspectRatio: "1/1", maxWidth: "550px", width: "100%", position: "relative" }}>
                        <iframe
                          srcDoc={generation.htmlPreview}
                          style={{
                            width: "1080px",
                            height: "1080px",
                            transform: "scale(0.509)",
                            transformOrigin: "0 0",
                            border: "none",
                          }}
                          title="Carousel Preview"
                          frameBorder="0"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Preview (escalado) • Descarga: 1080×1080px JPEG (Cuadrado)
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 bg-transparent" size="sm" onClick={downloadImages}>
                        <Download className="mr-2 h-4 w-4" />
                        Descargar Imágenes (1080x1080 JPEG)
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Editar Slides Individuales</Label>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                        {slidesData.map((slide, index) => (
                          <Dialog key={index}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-auto flex-col gap-1 bg-secondary py-2"
                                onClick={() => setEditingSlideIndex(index)}
                              >
                                <Edit2 className="h-3 w-3" />
                                <span className="text-xs">Slide {index + 1}</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl border-border bg-card">
                              <DialogHeader>
                                <DialogTitle className="text-foreground">Editar Slide {index + 1}</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                  Proporciona instrucciones específicas para modificar este slide
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="rounded-lg bg-secondary p-4">
                                  <h4 className="mb-2 font-semibold text-foreground">{slide.title}</h4>
                                  <ul className="space-y-1 text-sm text-muted-foreground">
                                    {slide.bullets.map((bullet, i) => (
                                      <li key={i} className="flex gap-2">
                                        <span>•</span>
                                        <span>{bullet}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-instructions" className="text-foreground">
                                    Instrucciones de edición
                                  </Label>
                                  <Textarea
                                    id="edit-instructions"
                                    placeholder="Ej: Hazlo más técnico, agrega datos específicos, cambia el enfoque a ROI..."
                                    rows={4}
                                    value={slideEditInstructions}
                                    onChange={(e) => setSlideEditInstructions(e.target.value)}
                                    className="resize-none border-input bg-secondary text-foreground"
                                  />
                                </div>
                                <Button
                                  onClick={() => editSlide(index, slideEditInstructions)}
                                  disabled={isEditingSlide}
                                  className="w-full bg-primary text-primary-foreground"
                                >
                                  {isEditingSlide ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Editando...
                                    </>
                                  ) : (
                                    <>
                                      <RefreshCw className="mr-2 h-4 w-4" />
                                      Regenerar Slide
                                    </>
                                  )}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Copys Sugeridos - Left column, full height */}
                {generation.postCopies.length > 0 && (
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle>Copys Sugeridos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {generation.postCopies.map((copy, i) => (
                        <div key={i} className="space-y-2">
                          <div className="rounded-lg bg-secondary p-4 text-sm leading-relaxed">{copy}</div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-transparent"
                            onClick={() => copyCopyText(copy)}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copiar Copy
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Right column - Hashtags and Horarios stacked */}
                <div className="space-y-6">
                  {/* Hashtags */}
                  {generation.hashtags.length > 0 && (
                    <Card className="border-border bg-card">
                      <CardHeader>
                        <CardTitle>Hashtags</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {generation.hashtags.map((tag, i) => (
                            <span
                              key={i}
                              className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={copyHashtags}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copiar Hashtags
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Horarios Sugeridos */}
                  {generation.scheduleSuggestions.length > 0 && (
                    <Card className="border-border bg-card">
                      <CardHeader>
                        <CardTitle>Horarios Sugeridos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          {generation.scheduleSuggestions.map((time, i) => (
                            <li key={i} className="flex items-center gap-2 text-muted-foreground">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                              {time}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        )}
      </main>
    </div>
  )
}
