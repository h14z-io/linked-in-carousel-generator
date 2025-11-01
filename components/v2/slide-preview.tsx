"use client"

import { Slide } from "@/lib/v2/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Eye } from "lucide-react"

interface SlidePreviewProps {
  slides: Slide[]
  onEdit: (slideIndex: number) => void
  onView: (slideIndex: number) => void
}

export function SlidePreview({ slides, onEdit, onView }: SlidePreviewProps) {
  if (slides.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No slides generated yet. Fill in the form and click Generate.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {slides.map((slide, index) => (
        <Card key={slide.id} className="overflow-hidden">
          <div className="aspect-square bg-muted relative">
            {/* Thumbnail preview of slide */}
            <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </div>
            {/* Overlay with action buttons */}
            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => onView(index)}>
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button size="sm" variant="secondary" onClick={() => onEdit(index)}>
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>
          <div className="p-3">
            <p className="text-sm font-medium truncate">
              Slide {index + 1}: {slide.nodes.find((n) => n.type === "text")?.content || "Untitled"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{slide.nodes.length} elements</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
