"use client"

import { useEffect, useRef, useState } from "react"
import * as fabric from "fabric"
import type { Slide, Node } from "@/lib/v2/types"
import {
  nodeToFabricObject,
  nodeToFabricImageAsync,
  fabricCanvasToNodes,
  setupGridSnapping,
} from "@/lib/v2/canvas/fabric-utils"

interface CanvasEditorProps {
  slide: Slide
  onNodesUpdate: (nodes: Node[]) => void
  gridEnabled?: boolean
  snapEnabled?: boolean
}

export function CanvasEditor({
  slide,
  onNodesUpdate,
  gridEnabled = true,
  snapEnabled = true,
}: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!canvasRef.current) return

    // Create Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 1080,
      height: 1080,
      backgroundColor: "#0B0B0E", // Default dark background
    })

    fabricRef.current = canvas

    // Load template as background
    loadTemplateBackground(canvas, slide.templateImage)

    // Render nodes
    renderNodes(canvas, slide.nodes)

    // Setup grid snapping if enabled
    if (snapEnabled) {
      setupGridSnapping(canvas, 20)
    }

    // Listen to modifications
    canvas.on("object:modified", () => {
      const updatedNodes = fabricCanvasToNodes(canvas)
      onNodesUpdate(updatedNodes)
    })

    // Listen to text changes
    canvas.on("text:changed", () => {
      const updatedNodes = fabricCanvasToNodes(canvas)
      onNodesUpdate(updatedNodes)
    })

    setIsLoading(false)

    // Cleanup
    return () => {
      canvas.dispose()
      fabricRef.current = null
    }
  }, [slide.id]) // Re-initialize when slide changes

  const loadTemplateBackground = async (canvas: fabric.Canvas, templatePath: string) => {
    try {
      const img = await fabric.Image.fromURL(templatePath)
      if (img) {
        img.set({
          scaleX: canvas.width! / (img.width || 1),
          scaleY: canvas.height! / (img.height || 1),
        })
        canvas.backgroundImage = img
        canvas.renderAll()
      }
    } catch (error) {
      console.error("[Canvas] Failed to load template:", error)
      // Continue without background
    }
  }

  const renderNodes = async (canvas: fabric.Canvas, nodes: Node[]) => {
    // Clear existing objects
    canvas.clear()

    // Reload background
    await loadTemplateBackground(canvas, slide.templateImage)

    // Add each node
    for (const node of nodes) {
      try {
        let fabricObj: fabric.Object

        if (node.type === "image") {
          fabricObj = await nodeToFabricImageAsync(node)
        } else {
          fabricObj = nodeToFabricObject(node)
        }

        // Store node ID for later reference
        ;(fabricObj as any).id = node.id

        canvas.add(fabricObj)
      } catch (error) {
        console.error("[Canvas] Failed to render node:", node.id, error)
      }
    }

    canvas.renderAll()
  }

  // Expose methods to parent component
  useEffect(() => {
    if (!fabricRef.current) return // Store reference to canvas for toolbar actions
    ;(window as any).__fabricCanvas = fabricRef.current
  }, [fabricRef.current])

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-white">Loading canvas...</div>
        </div>
      )}
      <div className="border border-border rounded-lg overflow-hidden bg-black inline-block">
        <canvas ref={canvasRef} />
      </div>
      {gridEnabled && (
        <div className="text-xs text-muted-foreground mt-2">
          Grid: {gridEnabled ? "On" : "Off"} | Snap: {snapEnabled ? "On" : "Off"}
        </div>
      )}
    </div>
  )
}

/**
 * Helper: Get the active Fabric.js canvas instance
 * Used by toolbar components to interact with canvas
 */
export function getActiveCanvas(): fabric.Canvas | null {
  return (window as any).__fabricCanvas || null
}

/**
 * Helper: Get selected object from canvas
 */
export function getSelectedObject(): fabric.Object | null {
  const canvas = getActiveCanvas()
  if (!canvas) return null

  const activeObject = canvas.getActiveObject()
  return activeObject || null
}
