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
import { buildCarouselPrompt } from "@/lib/prompts/carousel-prompts"
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
  {
    id: "problem-solution",
    label: "Problem-Solution",
    subtitle: "PAS Framework",
    description: "Mejor para: Venta directa, generación de leads",
    structure: "Problema → Agitar → Solución → CTA",
  },
  {
    id: "transformation",
    label: "Transformation",
    subtitle: "BAB Framework",
    description: "Mejor para: Casos de éxito, testimonios, ROI",
    structure: "Antes → Después → Cómo lograrlo",
  },
  {
    id: "educational",
    label: "Educational",
    subtitle: "AIDA Framework",
    description: "Mejor para: Thought leadership, educar audiencia",
    structure: "Hook → Insights → Valor → CTA suave",
  },
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
  { id: "basic", label: "Básico", description: "Cero jerga - Analogías simples para todos" },
  { id: "intermediate", label: "Intermedio", description: "Algunos términos técnicos con explicaciones" },
  { id: "advanced", label: "Avanzado", description: "Jerga de industria - Sin explicaciones básicas" },
]

const TONES = [
  { id: "formal", label: "Formal", description: "Corporativo ejecutivo - Tercera persona" },
  { id: "conversational", label: "Conversacional", description: "Cercano y amigable - Como hablar con un amigo" },
  { id: "inspirational", label: "Inspiracional", description: "Visionario y motivador - Pinta el futuro ideal" },
  { id: "educational", label: "Educativo", description: "Profesor experto - Paso a paso detallado" },
]

const COPY_LENGTHS = [
  { id: "short", label: "Corto", description: "Ultra conciso (máx 40 caracteres por bullet)" },
  { id: "long", label: "Largo", description: "Explicaciones completas (máx 100 caracteres por bullet)" },
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
    templateId: "problem-solution",
    audienceMode: "tech",
    slideCount: 7,
    language: "es",
    technicalDepth: "intermediate",
    tone: "conversational",
    copyLength: "short",
    objective: "leads",
    requiredKeywords: [],
    theme: "dark",
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
      const brandColor = localStorage.getItem("brandColor") || "#BB2649"
      const brandName = localStorage.getItem("brandName") || "h14z.io"
      const html = renderCarouselHTML(slidesData, input.templateId, fontScale, input.theme, brandColor, brandName)
      setGeneration((prev) => ({ ...prev, htmlPreview: html }))
    }
  }, [fontScale, input.theme, slidesData, input.templateId])

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
    const brandColor = localStorage.getItem("brandColor") || "#BB2649"
    const brandName = localStorage.getItem("brandName") || "h14z.io"
    const html = renderCarouselHTML(slidesData, newTemplateId, fontScale, input.theme, brandColor, brandName)
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

    // Start at 1.0 (normal) since we now design at real 1080x1080 size
    // Only make minor adjustments within 0.8-1.2 range
    let scale = 1.0

    // Slight increase if titles are short (<30 chars)
    if (avgTitleLength < 30) {
      scale += (30 - avgTitleLength) * 0.003 // +0.3% per char under 30
    }

    // Slight decrease if titles are long (>55 chars)
    if (avgTitleLength > 55) {
      scale -= (avgTitleLength - 55) * 0.003 // -0.3% per char over 55
    }

    // Slight increase if few bullets (<=2)
    if (avgBulletsPerSlide <= 2) {
      scale += 0.05 // +5% bonus for fewer bullets
    }

    // Slight decrease if many bullets (>4)
    if (avgBulletsPerSlide > 4) {
      scale -= (avgBulletsPerSlide - 4) * 0.04 // -4% per extra bullet
    }

    // Slight increase if bullets are short (<40 chars)
    if (avgBulletLength < 40) {
      scale += (40 - avgBulletLength) * 0.002 // +0.2% per char under 40
    }

    // Slight decrease if bullets are long (>70 chars)
    if (avgBulletLength > 70) {
      scale -= (avgBulletLength - 70) * 0.003 // -0.3% per char over 70
    }

    // Clamp between 0.8 and 1.2 (new minor adjustment range)
    return Math.max(0.8, Math.min(1.2, scale))
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
- ${input.language === "en" ? "Maintain slide structure (title + 4-5 bullets)" : "Mantén la estructura del slide (título + 4-5 bullets)"}
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
      const brandColor = localStorage.getItem("brandColor") || "#BB2649"
      const brandName = localStorage.getItem("brandName") || "h14z.io"
      const html = renderCarouselHTML(newSlidesData, input.templateId, fontScale, input.theme, brandColor, brandName)
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
      console.log("[v0] Audiencia:", input.audienceMode)
      console.log("[v0] Idioma:", input.language)
      console.log("[v0] Tema:", input.theme)

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
      console.log("[v0] Template:", input.templateId)
      console.log("[v0] Audience:", input.audienceMode)

      const ai = new GoogleGenAI({ apiKey })

      // Use the new prompt builder system
      const prompt = buildCarouselPrompt(input, corpus)

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
      const brandColor = localStorage.getItem("brandColor") || "#BB2649"
      const brandName = localStorage.getItem("brandName") || "h14z.io"
      const html = renderCarouselHTML(payload.slides, input.templateId, fontScale, input.theme, brandColor, brandName)

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

  // FASE 1.2: Font Loading API - Pre-cargar Inter fonts
  const preloadFonts = async () => {
    try {
      console.log("[v0] Pre-loading Inter fonts...")

      const fontWeights = [
        { weight: "400", url: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2" },
        { weight: "500", url: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfAZ9hjp-Ek-_EeA.woff2" },
        { weight: "600", url: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff2" },
        { weight: "700", url: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff2" },
        { weight: "800", url: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyYAZ9hjp-Ek-_EeA.woff2" },
        { weight: "900", url: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuBWYAZ9hjp-Ek-_EeA.woff2" },
      ]

      const fontPromises = fontWeights.map(async ({ weight, url }) => {
        const font = new FontFace("Inter", `url(${url})`, {
          weight,
          style: "normal",
        })
        await font.load()
        document.fonts.add(font)
        return font
      })

      await Promise.all(fontPromises)
      console.log("[v0] All Inter fonts loaded successfully")
    } catch (error) {
      console.error("[v0] Error pre-loading fonts:", error)
      // No lanzar error, continuar con export aunque fonts no carguen
    }
  }

  // FASE 3.1: Validación pre-export
  const validateExportReadiness = (iframeDoc: Document): { valid: boolean; warnings: string[] } => {
    const warnings: string[] = []

    // Verificar que fonts estén cargadas
    const interFontLoaded = Array.from(document.fonts).some(
      font => font.family.includes('Inter') && font.status === 'loaded'
    )
    if (!interFontLoaded) {
      warnings.push("⚠️ Fuentes Inter no detectadas - puede haber fallback fonts")
    }

    // Verificar que slides existan
    const slides = iframeDoc.querySelectorAll(".slide")
    if (slides.length === 0) {
      warnings.push("❌ No se encontraron slides para exportar")
      return { valid: false, warnings }
    }

    // Verificar dimensiones de slides
    slides.forEach((slide, index) => {
      const rect = (slide as HTMLElement).getBoundingClientRect()
      if (rect.width !== 1080 || rect.height !== 1080) {
        warnings.push(`⚠️ Slide ${index + 1}: Dimensiones incorrectas (${Math.round(rect.width)}x${Math.round(rect.height)}px, esperado: 1080x1080px)`)
      }
    })

    // Verificar que contenido no se salga de bounds
    slides.forEach((slide, index) => {
      const slideRect = (slide as HTMLElement).getBoundingClientRect()
      const children = slide.querySelectorAll('*')
      children.forEach((child) => {
        const childRect = (child as HTMLElement).getBoundingClientRect()
        if (
          childRect.right > slideRect.right + 10 ||
          childRect.bottom > slideRect.bottom + 10 ||
          childRect.left < slideRect.left - 10 ||
          childRect.top < slideRect.top - 10
        ) {
          warnings.push(`⚠️ Slide ${index + 1}: Contenido puede estar fuera de límites (revisar overflow)`)
        }
      })
    })

    console.log(`[v0] FASE 3.1: Validación completada - ${warnings.length} warnings`)
    warnings.forEach(w => console.log(`[v0] ${w}`))

    return { valid: slides.length > 0, warnings }
  }

  const downloadImagesWithHTMLToImage = async () => {
    if (!generation.htmlPreview) return

    try {
      console.log("[v0] Starting PNG export (html2canvas)...")

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
      console.log("[v0] FASE 1.2: Pre-loading fonts before export...")
      await preloadFonts()
      await document.fonts.ready
      console.log("[v0] Fonts ready in main document")

      console.log("[v0] Starting HIGH-QUALITY JPEG export (html2canvas - optimized)...")

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

      // FASE 2.2: Esperar fonts en iframe con Font Loading API
      if (iframe.contentWindow?.document.fonts) {
        await iframe.contentWindow.document.fonts.ready
        console.log("[v0] Fonts loaded in iframe successfully")
      }

      // FASE 2.2: Esperar frames adicionales para rendering completo
      await new Promise(resolve => requestAnimationFrame(resolve))
      await new Promise(resolve => requestAnimationFrame(resolve))
      console.log("[v0] Rendering complete, starting capture...")

      const iframeDoc = iframe.contentDocument
      if (!iframeDoc) {
        throw new Error("No se pudo acceder al contenido del iframe")
      }

      const slides = iframeDoc.querySelectorAll(".slide")
      console.log("[v0] Found", slides.length, "slides")

      if (slides.length === 0) {
        throw new Error("No se encontraron slides para descargar")
      }

      // FASE 3.1: Validar antes de exportar
      const validation = validateExportReadiness(iframeDoc)
      if (!validation.valid) {
        throw new Error("Validación falló: " + validation.warnings.join(", "))
      }
      if (validation.warnings.length > 0) {
        console.warn(`[v0] FASE 3.1: ${validation.warnings.length} advertencias detectadas (continuando con export)`)
      }

      // FASE 1.3: Reducir scale de 3/4 a 2 (suficiente para 2160x2160, menos artifacts)
      const optimalScale = 2

      console.log(`[v0] FASE 1.3: Using optimized scale: ${optimalScale}x (output: ${1080 * optimalScale}x${1080 * optimalScale}px)`)

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i] as HTMLElement
        console.log(`[v0] Rendering slide ${i + 1}/${slides.length} to HIGH-QUALITY JPEG...`)

        const canvas = await html2canvas(slide, {
          width: 1080,
          height: 1080,
          scale: optimalScale,
          backgroundColor: input.theme === "dark" ? "#0B0B0E" : "#FFFFFF",
          logging: false,
          useCORS: true,
          allowTaint: true,
          windowHeight: 1080,
          windowWidth: 1080,
          imageTimeout: 0,
          removeContainer: true,
        })

        // Export as PNG for maximum text sharpness and quality
        await new Promise<void>((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.download = `carousel-slide-${String(i + 1).padStart(2, "0")}.png`
                link.href = url
                link.click()
                URL.revokeObjectURL(url)
                console.log(`[v0] Slide ${i + 1} exported: ${(blob.size / 1024).toFixed(2)}KB (PNG ${optimalScale}x)`)
                resolve()
              } else {
                reject(new Error(`Failed to export slide ${i + 1}`))
              }
            },
            "image/png",
          )
        })

        await new Promise((resolve) => setTimeout(resolve, 800))
      }

      document.body.removeChild(iframe)
      console.log(`[v0] All slides exported successfully as HIGH-QUALITY PNG (${optimalScale}x scale)`)
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
                            <div className="py-1">
                              <div className="font-medium">{tone.label}</div>
                              <div className="text-xs text-muted-foreground">{tone.description}</div>
                            </div>
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
                  <h3 className="text-lg font-semibold text-foreground">Audiencia</h3>
                  <p className="text-sm text-muted-foreground">
                    Selecciona la audiencia principal para el contenido
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {AUDIENCES.map((audience) => (
                    <button
                      key={audience.id}
                      onClick={() => setInput((prev) => ({ ...prev, audienceMode: audience.id as any }))}
                      className={`flex items-start gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                        input.audienceMode === audience.id
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/50 bg-secondary/30"
                      }`}
                    >
                      <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                        input.audienceMode === audience.id
                          ? "border-primary"
                          : "border-muted-foreground/40"
                      }`}>
                        {input.audienceMode === audience.id && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium leading-none text-foreground">
                          {audience.label}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">{audience.description}</p>
                      </div>
                    </button>
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
                    min={5}
                    max={10}
                    step={1}
                    className="w-full [&_[role=slider]]:border-primary [&_[role=slider]]:bg-primary"
                  />
                  <p className="text-xs text-muted-foreground">
                    LinkedIn recomienda 5-10 slides para máximo engagement (24.42% vs 6.67%)
                  </p>
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
                  <div className="space-y-3">
                    <div>
                      <CardTitle>Vista Previa</CardTitle>
                      <CardDescription>Preview interactivo del carrusel generado</CardDescription>
                    </div>

                    {/* Template & Theme Selectors */}
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Template Selector with thumbnails */}
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">Plantilla:</Label>
                        <div className="flex gap-1">
                          {TEMPLATES.map((t) => (
                            <button
                              key={t.id}
                              onClick={() => changeTemplate(t.id)}
                              className={`group relative px-3 py-1.5 rounded-md border-2 transition-all text-xs font-medium ${
                                input.templateId === t.id
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border hover:border-primary/50 text-muted-foreground"
                              }`}
                              title={t.description}
                            >
                              <span className="hidden sm:inline">{t.label}</span>
                              <span className="sm:hidden">{t.label.split(" ")[1]}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Theme Selector */}
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">Tema:</Label>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setInput((prev) => ({ ...prev, theme: "dark" }))}
                            className={`px-3 py-1.5 rounded-md border-2 transition-all flex items-center gap-1.5 ${
                              input.theme === "dark"
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="h-3 w-3 rounded bg-gradient-to-br from-[#0B0B0E] to-[#15151A] border border-border" />
                            <span className="text-xs font-medium text-foreground">Dark</span>
                          </button>
                          <button
                            onClick={() => setInput((prev) => ({ ...prev, theme: "light" }))}
                            className={`px-3 py-1.5 rounded-md border-2 transition-all flex items-center gap-1.5 ${
                              input.theme === "light"
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="h-3 w-3 rounded bg-gradient-to-br from-white to-[#F5F5F7] border border-border" />
                            <span className="text-xs font-medium text-foreground">Light</span>
                          </button>
                        </div>
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
                        min={0.8}
                        max={1.2}
                        step={0.02}
                        className="w-full"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>0.8x - Pequeño</span>
                        <span>1.0x - Normal</span>
                        <span>1.2x - Grande</span>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="border-2 border-border bg-background shadow-xl overflow-hidden" style={{ aspectRatio: "1/1", maxWidth: "550px", width: "100%", position: "relative" }}>
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
                      Preview (escalado) • Descarga: 1080×1080px PNG (Cuadrado)
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 bg-transparent" size="sm" onClick={downloadImages}>
                        <Download className="mr-2 h-4 w-4" />
                        Descargar Imágenes (1080x1080 PNG)
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
