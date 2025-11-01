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
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit Slide</h1>
              <p className="text-sm text-muted-foreground">Slide ID: {slideId}</p>
            </div>
          </div>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Canvas Area */}
          <div>
            <Card className="p-6">
              <div className="flex items-center justify-center">
                <CanvasEditor
                  slide={slide}
                  onNodesUpdate={handleNodesUpdate}
                  gridEnabled={true}
                  snapEnabled={true}
                />
              </div>
            </Card>
          </div>

          {/* Toolbar Area */}
          <div>
            <Card>
              <Tabs defaultValue="text">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="text">Text</TabsTrigger>
                  <TabsTrigger value="align">Align</TabsTrigger>
                  <TabsTrigger value="add">Add</TabsTrigger>
                </TabsList>
                <TabsContent value="text">
                  <TextToolbar />
                </TabsContent>
                <TabsContent value="align">
                  <AlignToolbar />
                </TabsContent>
                <TabsContent value="add">
                  <AddToolbar />
                </TabsContent>
              </Tabs>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-4 p-4">
              <div className="text-sm font-medium mb-3">Quick Actions</div>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Undo (Ctrl+Z)
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Redo (Ctrl+Shift+Z)
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Reset to Original
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
