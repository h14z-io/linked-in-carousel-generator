"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Type, Smile, Image as ImageIcon } from "lucide-react"
import { getActiveCanvas } from "../canvas-editor"
import * as fabric from "fabric"

export function AddToolbar() {
  const [newText, setNewText] = useState("")
  const [newEmoji, setNewEmoji] = useState("✨")
  const [imageUrl, setImageUrl] = useState("")

  const addText = () => {
    const canvas = getActiveCanvas()
    if (!canvas || !newText.trim()) return

    const text = new fabric.Text(newText, {
      left: 100,
      top: 100,
      fontSize: 36,
      fontFamily: "Inter",
      fill: "#FFFFFF",
    })

    canvas.add(text)
    canvas.setActiveObject(text)
    canvas.renderAll()

    setNewText("")
  }

  const addEmoji = () => {
    const canvas = getActiveCanvas()
    if (!canvas || !newEmoji.trim()) return

    const emoji = new fabric.Text(newEmoji, {
      left: 150,
      top: 150,
      fontSize: 64,
    })

    canvas.add(emoji)
    canvas.setActiveObject(emoji)
    canvas.renderAll()

    setNewEmoji("✨")
  }

  const addImage = async () => {
    const canvas = getActiveCanvas()
    if (!canvas || !imageUrl.trim()) return

    try {
      const img = await fabric.Image.fromURL(imageUrl, undefined, { crossOrigin: "anonymous" })
      if (img) {
        img.set({
          left: 200,
          top: 200,
          scaleX: 0.5,
          scaleY: 0.5,
        })

        canvas.add(img)
        canvas.setActiveObject(img)
        canvas.renderAll()
      }
      setImageUrl("")
    } catch (error) {
      console.error("[AddToolbar] Failed to load image:", error)
      alert("Failed to load image. Check URL and try again.")
    }
  }

  const uploadImage = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string
        if (!dataUrl) return

        const canvas = getActiveCanvas()
        if (!canvas) return

        try {
          const img = await fabric.Image.fromURL(dataUrl)
          if (img) {
            // Scale to fit within 500px max dimension
            const maxDim = 500
            const scale = Math.min(maxDim / (img.width || 1), maxDim / (img.height || 1))

            img.set({
              left: 200,
              top: 200,
              scaleX: scale,
              scaleY: scale,
            })

            canvas.add(img)
            canvas.setActiveObject(img)
            canvas.renderAll()
          }
        } catch (error) {
          console.error("[AddToolbar] Failed to load uploaded image:", error)
          alert("Failed to load image.")
        }
      }
      reader.readAsDataURL(file)
    }

    input.click()
  }

  return (
    <div className="p-4 space-y-6">
      {/* Add Text */}
      <div className="space-y-2">
        <Label>Add Text</Label>
        <Textarea
          placeholder="Type your text..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          rows={3}
        />
        <Button onClick={addText} size="sm" className="w-full">
          <Type className="w-4 h-4 mr-2" />
          Add Text
        </Button>
      </div>

      {/* Add Emoji */}
      <div className="space-y-2">
        <Label>Add Emoji</Label>
        <Input
          placeholder="🚀"
          value={newEmoji}
          onChange={(e) => setNewEmoji(e.target.value)}
          maxLength={2}
        />
        <Button onClick={addEmoji} size="sm" className="w-full" variant="outline">
          <Smile className="w-4 h-4 mr-2" />
          Add Emoji
        </Button>
      </div>

      {/* Add Image */}
      <div className="space-y-2">
        <Label>Add Image</Label>
        <Input
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={addImage} size="sm" className="flex-1" variant="outline">
            <ImageIcon className="w-4 h-4 mr-2" />
            From URL
          </Button>
          <Button onClick={uploadImage} size="sm" className="flex-1" variant="outline">
            <ImageIcon className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>
    </div>
  )
}
