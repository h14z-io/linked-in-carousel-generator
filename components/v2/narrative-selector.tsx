"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NARRATIVE_STYLES } from "@/lib/v2/templates/narrative-definitions"
import { Check } from "lucide-react"

interface NarrativeSelectorProps {
  selected: string
  onSelect: (id: string) => void
}

export function NarrativeSelector({ selected, onSelect }: NarrativeSelectorProps) {
  return (
    <div className="grid gap-4 sm:gap-5">
      {NARRATIVE_STYLES.map((style) => (
        <div
          key={style.id}
          className={`relative cursor-pointer rounded-xl p-5 sm:p-6 border-2 transition-smooth min-h-[120px] ${
            selected === style.id
              ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
              : "border-border/50 bg-card/30 hover:border-primary/50 hover:bg-card/50"
          }`}
          onClick={() => onSelect(style.id)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base sm:text-lg font-bold truncate">{style.name}</h3>
                {selected === style.id && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-in">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{style.subtitle}</p>
              <div className="space-y-1.5">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground/90">Best for:</span> {style.bestFor}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground/90">{style.framework}</span>
                  <span>•</span>
                  <span>{style.slideCount} slides</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
