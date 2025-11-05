"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save } from "lucide-react"
import { CanvasEditor } from "@/components/v2/canvas-editor"
import { TextToolbar } from "@/components/v2/toolbar/text-toolbar"
import { AlignToolbar } from "@/components/v2/toolbar/align-toolbar"
import { AddToolbar } from "@/components/v2/toolbar/add-toolbar"
import type { Slide, Node } from "@/lib/v2/types"
import { loadSlides, updateSlide } from "@/lib/v2/storage"

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const slideId = params.slideId as string

  const [slide, setSlide] = useState<Slide | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load slide from storage
    try {
      const slides = loadSlides()
      if (slides.length === 0) {
        console.error("[Editor] No slides found in storage")
        setIsLoading(false)
        return
      }

      const foundSlide = slides.find((s) => s.id === slideId)

      if (!foundSlide) {
        console.error("[Editor] Slide not found:", slideId)
        setIsLoading(false)
        return
      }

      setSlide(foundSlide)
      setIsLoading(false)
    } catch (error) {
      console.error("[Editor] Failed to load slide:", error)
      setIsLoading(false)
    }
  }, [slideId])

  const handleNodesUpdate = (nodes: Node[]) => {
    if (!slide) return

    const updatedSlide = { ...slide, nodes }
    setSlide(updatedSlide)

    // Auto-save to storage
    updateSlide(slideId, updatedSlide)
    console.log("[Editor] Nodes updated:", nodes.length)
  }

  const handleSave = () => {
    if (!slide) return

    // Final save and navigate back
    updateSlide(slideId, slide)
    console.log("[Editor] Slide saved:", slide.id)
    router.push("/")
  }

  if (isLoading || !slide) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading editor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="h-9">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Canvas Editor</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Full drag-and-drop editing</p>
            </div>
          </div>
          <Button onClick={handleSave} className="h-10 sm:h-11 font-semibold shadow-md">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1fr_380px]">
          {/* Canvas Area */}
          <div className="glass rounded-2xl p-4 sm:p-8 transition-smooth">
            <div className="flex items-center justify-center">
              <CanvasEditor
                slide={slide}
                onNodesUpdate={handleNodesUpdate}
                gridEnabled={true}
                snapEnabled={true}
              />
            </div>
          </div>

          {/* Toolbar Area - Sticky on desktop */}
          <div className="lg:sticky lg:top-8 lg:self-start space-y-6">
            <div className="glass rounded-2xl overflow-hidden transition-smooth">
              <Tabs defaultValue="text">
                <TabsList className="grid w-full grid-cols-3 rounded-none h-12">
                  <TabsTrigger value="text" className="text-sm sm:text-base">Text</TabsTrigger>
                  <TabsTrigger value="align" className="text-sm sm:text-base">Align</TabsTrigger>
                  <TabsTrigger value="add" className="text-sm sm:text-base">Add</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="m-0">
                  <TextToolbar />
                </TabsContent>
                <TabsContent value="align" className="m-0">
                  <AlignToolbar />
                </TabsContent>
                <TabsContent value="add" className="m-0">
                  <AddToolbar />
                </TabsContent>
              </Tabs>
            </div>

            {/* Quick Actions */}
            <div className="glass rounded-2xl p-5 transition-smooth">
              <div className="text-sm font-semibold mb-4">Quick Actions</div>
              <div className="space-y-2.5">
                <Button variant="outline" size="sm" className="w-full justify-start h-10">
                  Undo (Ctrl+Z)
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start h-10">
                  Redo (Ctrl+Shift+Z)
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start h-10">
                  Reset to Original
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
