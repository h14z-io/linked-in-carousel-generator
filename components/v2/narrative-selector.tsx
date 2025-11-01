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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {NARRATIVE_STYLES.map((style) => (
        <Card
          key={style.id}
          className={`cursor-pointer transition-all hover:border-primary ${
            selected === style.id ? "border-primary border-2 bg-primary/5" : ""
          }`}
          onClick={() => onSelect(style.id)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{style.name}</CardTitle>
                <CardDescription className="text-sm mt-1">{style.subtitle}</CardDescription>
              </div>
              {selected === style.id && (
                <div className="flex-shrink-0 ml-2">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Best for:</span> {style.bestFor}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Framework:</span> {style.framework}
              </p>
              <div className="text-xs text-muted-foreground mt-2">
                <span className="font-medium">{style.slideCount} slides</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
