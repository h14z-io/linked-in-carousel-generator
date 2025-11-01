"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Sparkles, Loader2, AlertCircle, Download } from "lucide-react"
import { NarrativeSelector } from "@/components/v2/narrative-selector"
import { AIControls } from "@/components/v2/ai-controls"
import { SlidePreview } from "@/components/v2/slide-preview"
import { generateCarouselNodes } from "@/lib/v2/ai/gemini-client"
import { getNarrativeStyle } from "@/lib/v2/templates/narrative-definitions"
import { fetchMultipleUrls } from "@/lib/fetch-url-content"
import { exportAllSlides } from "@/lib/v2/canvas/export"
import { saveSlides } from "@/lib/v2/storage"
import type { Slide, ThemeMode } from "@/lib/v2/types"

export default function V2Page() {
  const router = useRouter()

  // State
  const [narrativeStyle, setNarrativeStyle] = useState("pasp")
  const [sourceText, setSourceText] = useState("")
  const [sourceUrls, setSourceUrls] = useState<string[]>([""])
  const [language, setLanguage] = useState("es")
  const [technicalDepth, setTechnicalDepth] = useState("intermediate")
  const [tone, setTone] = useState("conversational")
  const [audience, setAudience] = useState("tech")
  const [objective, setObjective] = useState("leads")
  const [requiredKeywords, setRequiredKeywords] = useState<string[]>([])
  const [theme, setTheme] = useState<ThemeMode>("dark")

  const [slides, setSlides] = useState<Slide[]>([])
  const [postCopy, setPostCopy] = useState("")
  const [hashtags, setHashtags] = useState<string[]>([])

  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [error, setError] = useState("")

  // Handlers
  const handleGenerate = async () => {
    setError("")

    // Validation
    const validUrls = sourceUrls.filter((url) => url.trim() !== "")
    if (!sourceText && validUrls.length === 0) {
      setError("Please provide source text or at least one URL")
      return
    }

    setIsGenerating(true)

    try {
      // Fetch URL content if provided
      let fetchedContent = ""
      if (validUrls.length > 0) {
        console.log("[v2] Fetching content from URLs:", validUrls)
        try {
          fetchedContent = await fetchMultipleUrls(validUrls)
          console.log("[v2] Successfully fetched content")
        } catch (error) {
          console.error("[v2] Error fetching URLs:", error)
          setError("Error fetching URL content. Please check URLs are valid and accessible.")
          setIsGenerating(false)
          return
        }
      }

      // Combine corpus
      const corpus = [fetchedContent, sourceText].filter(Boolean).join("\n\n")

      if (!corpus.trim()) {
        setError("No content obtained. Check URLs or add text.")
        setIsGenerating(false)
        return
      }

      console.log("[v2] Corpus length:", corpus.length, "characters")
      console.log("[v2] Narrative style:", narrativeStyle)
      console.log("[v2] Theme:", theme)

      // Get narrative style config
      const style = getNarrativeStyle(narrativeStyle)
      if (!style) {
        throw new Error("Invalid narrative style selected")
      }

      // Get template image path
      const templateImage = theme === "dark" ? style.templateImage.dark : style.templateImage.light

      // Generate with AI
      const response = await generateCarouselNodes({
        corpus,
        narrativeStyle,
        language,
        technicalDepth,
        tone,
        audience,
        objective,
        requiredKeywords: requiredKeywords.filter((k) => k.trim() !== ""),
        theme,
        templateImage,
      })

      console.log("[v2] Generation complete:", response.slides.length, "slides")

      // Convert response to Slide objects
      const generatedSlides: Slide[] = response.slides.map((slideData, index) => ({
        id: `slide-${Date.now()}-${index}`,
        narrativeStyle,
        templateImage,
        theme,
        nodes: slideData.nodes,
      }))

      setSlides(generatedSlides)
      setPostCopy(response.postCopy)
      setHashtags(response.hashtags)
    } catch (error) {
      console.error("[v2] Generation failed:", error)
      setError(error instanceof Error ? error.message : "Failed to generate carousel")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEditSlide = (slideIndex: number) => {
    const slide = slides[slideIndex]
    if (!slide) return

    // Store slides in sessionStorage for editor access
    saveSlides(slides)

    // Navigate to editor
    router.push(`/editor/${slide.id}`)
  }

  const handleViewSlide = (slideIndex: number) => {
    // TODO: Phase 4 - Implement preview modal
    console.log("[v2] View slide:", slideIndex)
    alert(`Full preview modal will be implemented in Phase 4. Viewing slide ${slideIndex + 1}`)
  }

  const handleExport = async () => {
    if (slides.length === 0) {
      setError("No slides to export")
      return
    }

    setIsExporting(true)
    setExportProgress(0)
    setError("")

    try {
      await exportAllSlides(slides, (current, total) => {
        setExportProgress(Math.round((current / total) * 100))
      })

      console.log("[v2] Export complete")
    } catch (error) {
      console.error("[v2] Export failed:", error)
      setError("Failed to export slides. Please try again.")
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 max-w-7xl">
        {/* Hero Section - Modern, Spacious */}
        <div className="mb-12 sm:mb-16 text-center max-w-3xl mx-auto animate-in">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            LinkedIn Carousel Studio
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            AI-powered canvas editor with multimodal generation.
            <br className="hidden sm:block" />
            Choose your narrative framework and create professional carousels in seconds.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-8 max-w-3xl mx-auto glass">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1fr_500px]">
          {/* Left Column: Configuration */}
          <div className="space-y-8">
            {/* Narrative Style Selection */}
            <div className="glass rounded-2xl p-6 sm:p-8 glass-hover transition-smooth">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-primary">1</span>
                  <h2 className="text-xl sm:text-2xl font-bold">Narrative Framework</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Choose the storytelling framework that best fits your goal
                </p>
              </div>
              <NarrativeSelector selected={narrativeStyle} onSelect={setNarrativeStyle} />
            </div>

            {/* Content & Configuration */}
            <div className="glass rounded-2xl p-6 sm:p-8 glass-hover transition-smooth">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-primary">2</span>
                  <h2 className="text-xl sm:text-2xl font-bold">Content & Settings</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Provide source material and customize generation
                </p>
              </div>
              <AIControls
                sourceText={sourceText}
                onSourceTextChange={setSourceText}
                sourceUrls={sourceUrls}
                onSourceUrlsChange={setSourceUrls}
                language={language}
                onLanguageChange={setLanguage}
                technicalDepth={technicalDepth}
                onTechnicalDepthChange={setTechnicalDepth}
                tone={tone}
                onToneChange={setTone}
                audience={audience}
                onAudienceChange={setAudience}
                objective={objective}
                onObjectiveChange={setObjective}
                requiredKeywords={requiredKeywords}
                onRequiredKeywordsChange={setRequiredKeywords}
                theme={theme}
                onThemeChange={setTheme}
              />
            </div>

            {/* Generate Button - Prominent CTA */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              size="lg"
              className="w-full h-14 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-smooth"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-6 w-6" />
                  Generate Carousel
                </>
              )}
            </Button>
          </div>

          {/* Right Column: Preview - Sticky on desktop */}
          <div className="space-y-8 lg:sticky lg:top-8 lg:self-start">
            {/* Slides Preview */}
            <div className="glass rounded-2xl p-6 sm:p-8 glass-hover transition-smooth">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-primary">3</span>
                  <h2 className="text-xl sm:text-2xl font-bold">Preview & Edit</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  {slides.length > 0
                    ? `${slides.length} slides generated. Click to edit in canvas.`
                    : "Your slides will appear here after generation"}
                </p>
              </div>
              <SlidePreview slides={slides} onEdit={handleEditSlide} onView={handleViewSlide} />
              {slides.length > 0 && (
                <div className="mt-6">
                  <Button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="w-full h-12 font-semibold shadow-md hover:shadow-lg transition-smooth"
                    size="lg"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Exporting... {exportProgress}%
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-5 w-5" />
                        Download All Slides
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    1080x1080px • JPEG • Quality 95%
                  </p>
                </div>
              )}
            </div>

            {/* Post Copy */}
            {postCopy && (
              <div className="glass rounded-2xl p-6 sm:p-8 glass-hover transition-smooth animate-in">
                <h3 className="text-lg font-bold mb-2">LinkedIn Post Copy</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  AI-generated copy to accompany your carousel
                </p>
                <div className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-xl leading-relaxed">
                  {postCopy}
                </div>
                {hashtags.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex flex-wrap gap-2">
                      {hashtags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
