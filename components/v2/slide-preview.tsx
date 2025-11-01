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
      <div className="text-center py-16 sm:py-20 rounded-xl bg-muted/30 border-2 border-dashed border-border">
        <p className="text-muted-foreground text-sm sm:text-base">
          No slides generated yet.
          <br className="sm:hidden" />
          <span className="hidden sm:inline"> </span>
          Fill in the form and click Generate.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-3">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className="group relative rounded-xl overflow-hidden glass glass-hover cursor-pointer animate-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted relative">
            {/* Thumbnail preview of slide */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl sm:text-5xl font-bold text-muted-foreground/40">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            {/* Overlay with action buttons */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center gap-2 p-3">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onView(index)}
                className="h-9 text-xs sm:text-sm"
              >
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1" />
                <span className="hidden sm:inline">View</span>
              </Button>
              <Button
                size="sm"
                onClick={() => onEdit(index)}
                className="h-9 text-xs sm:text-sm"
              >
                <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            </div>
          </div>
          <div className="p-3 sm:p-4 bg-card/50">
            <p className="text-xs sm:text-sm font-semibold truncate mb-1">
              Slide {index + 1}
            </p>
            <p className="text-xs text-muted-foreground">{slide.nodes.length} elements</p>
          </div>
        </div>
      ))}
    </div>
  )
}
