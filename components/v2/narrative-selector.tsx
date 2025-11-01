"use client"

import { NARRATIVE_STYLES } from "@/lib/v2/templates/narrative-definitions"
import { Check, ChevronDown } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface NarrativeSelectorProps {
  selected: string
  onSelect: (id: string) => void
}

export function NarrativeSelector({ selected, onSelect }: NarrativeSelectorProps) {
  const selectedStyle = NARRATIVE_STYLES.find((s) => s.id === selected)

  return (
    <div className="space-y-4">
      {/* Compact selector */}
      <Select value={selected} onValueChange={onSelect}>
        <SelectTrigger className="h-12 w-full text-base font-semibold">
          <SelectValue placeholder="Select a narrative framework" />
        </SelectTrigger>
        <SelectContent>
          {NARRATIVE_STYLES.map((style) => (
            <SelectItem key={style.id} value={style.id} className="py-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{style.name}</span>
                <span className="text-xs text-muted-foreground">• {style.slideCount} slides</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Details card - only shown when selected */}
      {selectedStyle && (
        <div className="glass rounded-xl p-5 border-2 border-primary/20 animate-in">
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-base mb-1">{selectedStyle.name}</h4>
              <p className="text-sm text-muted-foreground">{selectedStyle.subtitle}</p>
            </div>
          </div>
          <div className="space-y-2 pl-11">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-semibold text-foreground/80 uppercase tracking-wide">Best for:</span>
              <span className="text-sm text-muted-foreground">{selectedStyle.bestFor}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground/80">{selectedStyle.framework}</span>
              <span>•</span>
              <span>{selectedStyle.slideCount} slides</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
