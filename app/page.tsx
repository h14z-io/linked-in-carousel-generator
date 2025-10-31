"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Download, Copy, AlertCircle, Loader2 } from "lucide-react"
import type { GenerationInput, GenerationState, GenerationResult } from "@/lib/types"
import { safeExtractJSON } from "@/lib/safe-extract-json"
import { renderCarouselHTML } from "@/lib/template-renderer"
import { GoogleGenAI } from "@google/genai"
import html2canvas from "html2canvas"

const TEMPLATES = [
  { id: "template-a", label: "Template A", subtitle: "Minimal Tech" },
  { id: "template-b", label: "Template B", subtitle: "Bold Magenta" },
  { id: "template-c", label: "Template C", subtitle: "Editorial Grid" },
]

const AUDIENCES = [
  { id: "finance", label: "Finanzas", description: "ROI y métricas financieras" },
  { id: "tech", label: "Técnica", description: "Arquitectura y tecnología" },
  { id: "exec", label: "Decisores", description: "Impacto en negocio" },
]

const LANGUAGES = [
  { id: "es", label: "Español" },
  { id: "en", label: "English" },
]

export default function HomePage() {
  const [input, setInput] = useState<GenerationInput>({
    sourceText: "",
    sourceUrls: [],
    templateId: "template-a",
    audienceModes: ["finance", "tech", "exec"],
    slideCount: 4,
    language: "es",
  })

  const [generation, setGeneration] = useState<GenerationState>({
    htmlPreview: "",
    images: [],
    postCopies: [],
    hashtags: [],
    scheduleSuggestions: [],
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")

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

  const handleAudienceToggle = (audienceId: string) => {
    setInput((prev) => {
      const current = prev.audienceModes
      const updated = current.includes(audienceId as any)
        ? current.filter((a) => a !== audienceId)
        : [...current, audienceId as any]
      return { ...prev, audienceModes: updated }
    })
  }

  const generateCarousel = async () => {
    const apiKey = localStorage.getItem("geminiApiKey")
    if (!apiKey) {
      setError("Por favor configura tu API key de Gemini en la página de configuración")
      return
    }

    if (!input.sourceText && input.sourceUrls.length === 0) {
      setError("Por favor ingresa contenido base o URLs")
      return
    }

    setIsGenerating(true)
    setError("")

    try {
      console.log("[v0] Iniciando generación con Gemini 2.5 Pro...")
      console.log("[v0] Template:", input.templateId)
      console.log("[v0] Slides:", input.slideCount)
      console.log("[v0] Audiencias:", input.audienceModes)
      console.log("[v0] Idioma:", input.language)

      const ai = new GoogleGenAI({ apiKey })

      const languageInstruction =
        input.language === "en"
          ? "Generate the carousel in ENGLISH. All content must be in English."
          : "Genera el carrusel en ESPAÑOL. Todo el contenido debe estar en español."

      const prompt = `${languageInstruction}

${input.language === "en" ? "Generate" : "Genera"} ${input.language === "en" ? "a LinkedIn carousel in valid JSON format. Respond ONLY with the JSON, no additional text." : "un carrusel de LinkedIn en formato JSON válido. Responde SOLO con el JSON, sin texto adicional."}

${input.language === "en" ? "INPUT:" : "ENTRADA:"}
${input.sourceText}
${input.sourceUrls.length > 0 ? `\nURLs: ${input.sourceUrls.join(", ")}` : ""}

${input.language === "en" ? "CONFIGURATION:" : "CONFIGURACIÓN:"}
- Template: ${input.templateId}
- Slides: ${input.slideCount}
- ${input.language === "en" ? "Audiences:" : "Audiencias:"} ${input.audienceModes.join(", ")}
- ${input.language === "en" ? "Language:" : "Idioma:"} ${input.language === "en" ? "English" : "Español"}

${input.language === "en" ? "REQUIRED JSON FORMAT:" : "FORMATO JSON REQUERIDO:"}
{
  "slides": [
    {
      "title": "${input.language === "en" ? "Slide title" : "Título del slide"}",
      "bullets": ["${input.language === "en" ? "Point 1" : "Punto 1"}", "${input.language === "en" ? "Point 2" : "Punto 2"}", "${input.language === "en" ? "Point 3" : "Punto 3"}"],
      "visual_direction": "${input.language === "en" ? "Visual description" : "Descripción visual"}"
    }
  ],
  "post_copies": [
    {"audience": "finance", "text": "${input.language === "en" ? "Copy for finance" : "Copy para finanzas"}"},
    {"audience": "tech", "text": "${input.language === "en" ? "Technical copy" : "Copy técnico"}"},
    {"audience": "exec", "text": "${input.language === "en" ? "Copy for executives" : "Copy para decisores"}"}
  ],
  "hashtags": ["#Tag1", "#Tag2", "#Tag3"],
  "schedule_suggestions": ["${input.language === "en" ? "Tuesday 10:00 AM EST" : "Martes 10:00 -06:00"}", "${input.language === "en" ? "Thursday 2:00 PM EST" : "Jueves 14:00 -06:00"}"]
}

${input.language === "en" ? "CRITERIA:" : "CRITERIOS:"}
- ${input.language === "en" ? "Each slide: clear title + 3-5 concise bullets" : "Cada slide: título claro + 3-5 bullets concisos"}
- ${input.language === "en" ? "Adapt post_copies by audience (ROI for finance, architecture for tech, impact for exec)" : "Adapta post_copies según audiencia (ROI para finance, arquitectura para tech, impacto para exec)"}
- ${input.language === "en" ? "6-10 relevant hashtags" : "6-10 hashtags relevantes"}
- ${input.language === "en" ? "Schedule times in EST timezone" : "Horarios LATAM (-06:00)"}
- ${input.language === "en" ? "Dark h14z.io palette with Viva Magenta accent (#BB2649)" : "Paleta oscura h14z.io con acento Viva Magenta (#BB2649)"}

${input.language === "en" ? "Respond ONLY with valid JSON:" : "Responde SOLO con el JSON válido:"}`

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 8000,
        },
      })

      console.log("[v0] Response received from Gemini 2.5 Pro")

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

      console.log("[v0] Rendering carousel HTML...")
      const html = renderCarouselHTML(payload.slides, input.templateId)

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

  // Function to download carousel images as 1080x1080 PNG
  const downloadImages = async () => {
    if (!generation.htmlPreview) return

    try {
      console.log("[v0] Starting image download process...")

      // Create a temporary container to render slides
      const container = document.createElement("div")
      container.style.position = "fixed"
      container.style.left = "-9999px"
      container.style.top = "0"
      container.style.width = "1080px"
      container.style.height = "1080px"
      document.body.appendChild(container)

      // Parse the HTML and extract individual slides
      const parser = new DOMParser()
      const doc = parser.parseFromString(generation.htmlPreview, "text/html")
      const slides = doc.querySelectorAll(".slide")

      console.log("[v0] Found", slides.length, "slides to download")

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i] as HTMLElement

        // Clone the slide and add it to the container
        const slideClone = slide.cloneNode(true) as HTMLElement
        slideClone.style.width = "1080px"
        slideClone.style.height = "1080px"
        container.innerHTML = ""
        container.appendChild(slideClone)

        // Wait a bit for styles to apply
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Capture the slide using html2canvas
        const canvas = await html2canvas(slideClone, {
          width: 1080,
          height: 1080,
          scale: 1,
          backgroundColor: "#0B0B0E",
          logging: false,
        })

        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.download = `carousel-slide-${i + 1}.png`
            link.href = url
            link.click()
            URL.revokeObjectURL(url)
          }
        }, "image/png")

        // Wait between downloads
        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      document.body.removeChild(container)
      console.log("[v0] Image download complete!")
    } catch (error) {
      console.error("[v0] Error downloading images:", error)
      setError("Error al descargar las imágenes. Intenta de nuevo.")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Generar Carrusel</h1>
          <p className="mt-2 text-muted-foreground">Crea carruseles profesionales para LinkedIn con IA en segundos</p>
        </div>

        <div className="space-y-6">
          {/* Input Form - Full Width */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Contenido Base</CardTitle>
              <CardDescription>Pega tu texto o URLs (una por línea) para generar el carrusel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="source">Texto o URLs</Label>
                <Textarea
                  id="source"
                  placeholder="Pega tu texto o URLs (una por línea)..."
                  rows={8}
                  className="resize-none bg-secondary"
                  onChange={(e) => handleSourceChange(e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Plantilla</Label>
                  <Tabs
                    value={input.templateId}
                    onValueChange={(v) => setInput((prev) => ({ ...prev, templateId: v as any }))}
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      {TEMPLATES.map((t) => (
                        <TabsTrigger key={t.id} value={t.id} className="text-xs">
                          <div className="flex flex-col items-center">
                            <span className="font-semibold">{t.label}</span>
                            <span className="text-[10px] text-muted-foreground">{t.subtitle}</span>
                          </div>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                <div className="space-y-2">
                  <Label>Idioma (inglés | español)</Label>
                  <Tabs
                    value={input.language}
                    onValueChange={(v) => setInput((prev) => ({ ...prev, language: v as "es" | "en" }))}
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      {LANGUAGES.map((lang) => (
                        <TabsTrigger key={lang.id} value={lang.id}>
                          {lang.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Audiencias</Label>
                <div className="grid gap-3 md:grid-cols-3">
                  {AUDIENCES.map((audience) => (
                    <div key={audience.id} className="flex items-start gap-3">
                      <Checkbox
                        id={audience.id}
                        checked={input.audienceModes.includes(audience.id as any)}
                        onCheckedChange={() => handleAudienceToggle(audience.id)}
                      />
                      <div className="flex flex-col">
                        <label
                          htmlFor={audience.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {audience.label}
                        </label>
                        <p className="text-xs text-muted-foreground">{audience.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Número de slides: {input.slideCount}</Label>
                <Slider
                  value={[input.slideCount]}
                  onValueChange={([v]) => setInput((prev) => ({ ...prev, slideCount: v }))}
                  min={3}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Selecciona entre 3 y 5 slides para tu carrusel</p>
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
              {/* Preview Card - Full Width */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Vista Previa</CardTitle>
                  <CardDescription>Preview interactivo del carrusel generado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="aspect-square overflow-hidden rounded-lg border border-border bg-background">
                      <iframe srcDoc={generation.htmlPreview} className="h-full w-full" title="Carousel Preview" />
                    </div>
                    <Button variant="outline" className="w-full bg-transparent" size="sm" onClick={downloadImages}>
                      <Download className="mr-2 h-4 w-4" />
                      Descargar Imágenes (1080x1080 PNG)
                    </Button>
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
      </main>
    </div>
  )
}
