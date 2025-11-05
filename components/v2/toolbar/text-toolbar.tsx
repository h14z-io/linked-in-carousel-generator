"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import * as fabric from "fabric"
import { FONT_FAMILIES } from "@/lib/v2/types"
import { getActiveCanvas, getSelectedObject } from "../canvas-editor"

export function TextToolbar() {
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null)
  const [fontSize, setFontSize] = useState(24)
  const [fontFamily, setFontFamily] = useState("Inter")
  const [fontWeight, setFontWeight] = useState("400")
  const [color, setColor] = useState("#FFFFFF")

  useEffect(() => {
    const canvas = getActiveCanvas()
    if (!canvas) return

    const updateSelection = () => {
      const obj = getSelectedObject()
      setSelectedObject(obj)

      if (obj && obj instanceof fabric.Text) {
        setFontSize(obj.fontSize || 24)
        setFontFamily(obj.fontFamily || "Inter")
        setFontWeight(String(obj.fontWeight || "400"))
        setColor((obj.fill as string) || "#FFFFFF")
      }
    }

    canvas.on("selection:created", updateSelection)
    canvas.on("selection:updated", updateSelection)
    canvas.on("selection:cleared", () => setSelectedObject(null))

    return () => {
      canvas.off("selection:created", updateSelection)
      canvas.off("selection:updated", updateSelection)
      canvas.off("selection:cleared")
    }
  }, [])

  const updateTextProperty = (property: string, value: any) => {
    const canvas = getActiveCanvas()
    const obj = getSelectedObject()

    if (!canvas || !obj || !(obj instanceof fabric.Text)) return

    obj.set(property as any, value)
    canvas.renderAll()
  }

  if (!selectedObject || !(selectedObject instanceof fabric.Text)) {
    return (
      <div className="text-sm text-muted-foreground p-4 text-center">
        Select a text element to edit
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Label>Font Family</Label>
        <Select
          value={fontFamily}
          onValueChange={(v) => {
            setFontFamily(v)
            updateTextProperty("fontFamily", v)
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map((font) => (
              <SelectItem key={font} value={font}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Font Size</Label>
          <Input
            type="number"
            value={fontSize}
            onChange={(e) => {
              const val = Number(e.target.value)
              setFontSize(val)
              updateTextProperty("fontSize", val)
            }}
            min={12}
            max={200}
          />
        </div>

        <div className="space-y-2">
          <Label>Font Weight</Label>
          <Select
            value={fontWeight}
            onValueChange={(v) => {
              setFontWeight(v)
              updateTextProperty("fontWeight", Number(v))
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="300">Light</SelectItem>
              <SelectItem value="400">Regular</SelectItem>
              <SelectItem value="500">Medium</SelectItem>
              <SelectItem value="600">Semibold</SelectItem>
              <SelectItem value="700">Bold</SelectItem>
              <SelectItem value="900">Black</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Text Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value)
              updateTextProperty("fill", e.target.value)
            }}
            className="h-10 w-20"
          />
          <Input
            type="text"
            value={color}
            onChange={(e) => {
              setColor(e.target.value)
              updateTextProperty("fill", e.target.value)
            }}
            placeholder="#FFFFFF"
            className="flex-1"
          />
        </div>
      </div>

      <div className="pt-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            const canvas = getActiveCanvas()
            const obj = getSelectedObject()
            if (!canvas || !obj) return

            canvas.remove(obj)
            canvas.renderAll()
          }}
        >
          Delete Element
        </Button>
      </div>
    </div>
  )
}
