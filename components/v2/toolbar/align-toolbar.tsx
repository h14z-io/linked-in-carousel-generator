"use client"

import { Button } from "@/components/ui/button"
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignHorizontalJustifyCenter,
} from "lucide-react"
import { getActiveCanvas, getSelectedObject } from "../canvas-editor"
import * as fabric from "fabric"

export function AlignToolbar() {
  const alignText = (alignment: "left" | "center" | "right") => {
    const obj = getSelectedObject()
    const canvas = getActiveCanvas()

    if (!canvas || !obj || !(obj instanceof fabric.Text)) return

    obj.set("textAlign", alignment)
    canvas.renderAll()
  }

  const alignObject = (type: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
    const obj = getSelectedObject()
    const canvas = getActiveCanvas()

    if (!canvas || !obj) return

    const canvasWidth = canvas.width || 1080
    const canvasHeight = canvas.height || 1080
    const objWidth = (obj.width || 0) * (obj.scaleX || 1)
    const objHeight = (obj.height || 0) * (obj.scaleY || 1)

    switch (type) {
      case "left":
        obj.set("left", 0)
        break
      case "center":
        obj.set("left", (canvasWidth - objWidth) / 2)
        break
      case "right":
        obj.set("left", canvasWidth - objWidth)
        break
      case "top":
        obj.set("top", 0)
        break
      case "middle":
        obj.set("top", (canvasHeight - objHeight) / 2)
        break
      case "bottom":
        obj.set("top", canvasHeight - objHeight)
        break
    }

    obj.setCoords()
    canvas.renderAll()
  }

  const selectedObj = getSelectedObject()
  const isText = selectedObj instanceof fabric.Text

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <div className="text-sm font-medium">Text Alignment</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => alignText("left")} disabled={!isText}>
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alignText("center")}
            disabled={!isText}
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => alignText("right")} disabled={!isText}>
            <AlignRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">Object Position</div>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alignObject("left")}
            disabled={!selectedObj}
          >
            Left
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alignObject("center")}
            disabled={!selectedObj}
          >
            Center
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alignObject("right")}
            disabled={!selectedObj}
          >
            Right
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alignObject("top")}
            disabled={!selectedObj}
          >
            Top
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alignObject("middle")}
            disabled={!selectedObj}
          >
            <AlignVerticalJustifyCenter className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alignObject("bottom")}
            disabled={!selectedObj}
          >
            Bottom
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">Canvas Center</div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              alignObject("center")
              alignObject("middle")
            }}
            disabled={!selectedObj}
          >
            <AlignHorizontalJustifyCenter className="w-4 h-4 mr-1" />
            Center All
          </Button>
        </div>
      </div>
    </div>
  )
}
