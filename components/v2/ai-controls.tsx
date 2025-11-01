"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, X, ChevronDown } from "lucide-react"

interface AIControlsProps {
  sourceText: string
  onSourceTextChange: (value: string) => void
  sourceUrls: string[]
  onSourceUrlsChange: (urls: string[]) => void
  language: string
  onLanguageChange: (value: string) => void
  technicalDepth: string
  onTechnicalDepthChange: (value: string) => void
  tone: string
  onToneChange: (value: string) => void
  audience: string
  onAudienceChange: (value: string) => void
  objective: string
  onObjectiveChange: (value: string) => void
  requiredKeywords: string[]
  onRequiredKeywordsChange: (keywords: string[]) => void
  theme: "dark" | "light"
  onThemeChange: (theme: "dark" | "light") => void
}

const LANGUAGES = [
  { id: "es", label: "Español" },
  { id: "en", label: "English" },
]

const TECHNICAL_DEPTHS = [
  { id: "basic", label: "Básico" },
  { id: "intermediate", label: "Intermedio" },
  { id: "advanced", label: "Avanzado" },
]

const TONES = [
  { id: "formal", label: "Formal" },
  { id: "conversational", label: "Conversacional" },
  { id: "inspirational", label: "Inspiracional" },
  { id: "educational", label: "Educativo" },
]

const AUDIENCES = [
  { id: "tech", label: "Técnica - Developers, Engineers" },
  { id: "finance", label: "Finanzas - CFOs, Directors" },
  { id: "exec", label: "Ejecutivos - C-Level" },
  { id: "managers", label: "Managers - Team Leads" },
]

const OBJECTIVES = [
  { id: "leads", label: "Generar Leads" },
  { id: "educate", label: "Educar Audiencia" },
  { id: "brand", label: "Posicionamiento de Marca" },
  { id: "engagement", label: "Aumentar Engagement" },
  { id: "thought-leadership", label: "Thought Leadership" },
]

export function AIControls({
  sourceText,
  onSourceTextChange,
  sourceUrls,
  onSourceUrlsChange,
  language,
  onLanguageChange,
  technicalDepth,
  onTechnicalDepthChange,
  tone,
  onToneChange,
  audience,
  onAudienceChange,
  objective,
  onObjectiveChange,
  requiredKeywords,
  onRequiredKeywordsChange,
  theme,
  onThemeChange,
}: AIControlsProps) {
  const addUrl = () => {
    onSourceUrlsChange([...sourceUrls, ""])
  }

  const removeUrl = (index: number) => {
    onSourceUrlsChange(sourceUrls.filter((_, i) => i !== index))
  }

  const updateUrl = (index: number, value: string) => {
    const updated = [...sourceUrls]
    updated[index] = value
    onSourceUrlsChange(updated)
  }

  const addKeyword = () => {
    onRequiredKeywordsChange([...requiredKeywords, ""])
  }

  const removeKeyword = (index: number) => {
    onRequiredKeywordsChange(requiredKeywords.filter((_, i) => i !== index))
  }

  const updateKeyword = (index: number, value: string) => {
    const updated = [...requiredKeywords]
    updated[index] = value
    onRequiredKeywordsChange(updated)
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Source Content - Priority #1 */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          Source Text <span className="text-primary">*</span>
        </Label>
        <Textarea
          placeholder="Paste your article, blog post, or any content you want to turn into a carousel..."
          value={sourceText}
          onChange={(e) => onSourceTextChange(e.target.value)}
          rows={8}
          className="resize-none text-base leading-relaxed"
        />
        <p className="text-xs text-muted-foreground">
          Provide the main content that will be transformed into slides
        </p>
      </div>

      {/* Source URLs - Priority #2 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">
            Source URLs <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
          </Label>
          <Button size="sm" variant="outline" onClick={addUrl} className="h-9">
            <Plus className="w-4 h-4 mr-1.5" />
            Add
          </Button>
        </div>
        <div className="space-y-2.5">
          {sourceUrls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => updateUrl(index, e.target.value)}
                className="h-12 text-base"
              />
              <Button size="icon" variant="ghost" onClick={() => removeUrl(index)} className="h-12 w-12 flex-shrink-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Add article URLs to automatically fetch content
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-border/50 pt-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Configuration
        </h3>
      </div>

      {/* Configuration - Grouped by importance */}
      <div className="space-y-5">
        {/* Primary settings */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Language</Label>
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.id} value={lang.id}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold">Tone</Label>
            <Select value={tone} onValueChange={onToneChange}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONES.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Secondary settings */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Target Audience</Label>
            <Select value={audience} onValueChange={onAudienceChange}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AUDIENCES.map((aud) => (
                  <SelectItem key={aud.id} value={aud.id}>
                    {aud.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold">Primary Objective</Label>
            <Select value={objective} onValueChange={onObjectiveChange}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OBJECTIVES.map((obj) => (
                  <SelectItem key={obj.id} value={obj.id}>
                    {obj.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced settings - collapsed by default visually */}
        <details className="group">
          <summary className="cursor-pointer list-none flex items-center justify-between py-3 px-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth">
            <span className="text-sm font-semibold">Advanced Settings</span>
            <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
          </summary>
          <div className="mt-4 space-y-4 px-1">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Technical Depth</Label>
                <Select value={technicalDepth} onValueChange={onTechnicalDepthChange}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TECHNICAL_DEPTHS.map((depth) => (
                      <SelectItem key={depth.id} value={depth.id}>
                        {depth.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Theme</Label>
                <Select value={theme} onValueChange={(v) => onThemeChange(v as "dark" | "light")}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Required Keywords - Now in advanced */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Required Keywords</Label>
                <Button size="sm" variant="outline" onClick={addKeyword} className="h-8">
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Add
                </Button>
              </div>
              {requiredKeywords.length > 0 && (
                <div className="space-y-2.5">
                  {requiredKeywords.map((keyword, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="e.g. automation, AI, cloud"
                        value={keyword}
                        onChange={(e) => updateKeyword(index, e.target.value)}
                        className="h-11 text-base"
                      />
                      <Button size="icon" variant="ghost" onClick={() => removeKeyword(index)} className="h-11 w-11 flex-shrink-0">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </details>
      </div>
    </div>
  )
}
