import * as fabric from "fabric"
import type { Slide } from "../types"
import { nodeToFabricObject, nodeToFabricImageAsync } from "./fabric-utils"

/**
 * Export a slide to JPEG format
 * Uses Fabric.js native export (no html2canvas needed)
 */
export async function exportSlideToJPEG(slide: Slide, filename: string): Promise<void> {
  // Create temporary canvas
  const canvas = new fabric.Canvas(null, {
    width: 1080,
    height: 1080,
    backgroundColor: slide.theme === "dark" ? "#0B0B0E" : "#FFFFFF",
  })

  try {
    // Load template background
    await loadTemplateBackground(canvas, slide.templateImage)

    // Render all nodes
    for (const node of slide.nodes) {
      try {
        let fabricObj: fabric.Object

        if (node.type === "image") {
          fabricObj = await nodeToFabricImageAsync(node)
        } else {
          fabricObj = nodeToFabricObject(node)
        }

        canvas.add(fabricObj)
      } catch (error) {
        console.error("[Export] Failed to render node:", node.id, error)
      }
    }

    canvas.renderAll()

    // Export to JPEG
    const dataURL = canvas.toDataURL({
      format: "jpeg",
      quality: 0.95,
      multiplier: 1, // Already 1080x1080
    })

    // Download
    downloadImage(dataURL, filename)

    // Cleanup
    canvas.dispose()
  } catch (error) {
    console.error("[Export] Failed to export slide:", error)
    canvas.dispose()
    throw error
  }
}

/**
 * Export all slides in sequence
 */
export async function exportAllSlides(
  slides: Slide[],
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i]
    const filename = `slide-${String(i + 1).padStart(2, "0")}.jpg`

    try {
      await exportSlideToJPEG(slide, filename)
      onProgress?.(i + 1, slides.length)

      // Delay between downloads to prevent overwhelming browser
      if (i < slides.length - 1) {
        await delay(500)
      }
    } catch (error) {
      console.error(`[Export] Failed to export slide ${i + 1}:`, error)
      // Continue with next slide
    }
  }
}

/**
 * Load template as background image
 */
async function loadTemplateBackground(canvas: fabric.Canvas, templatePath: string): Promise<void> {
  try {
    const img = await fabric.Image.fromURL(templatePath)
    if (img) {
      canvas.setBackgroundImage(
        img,
        () => {
          canvas.renderAll()
        },
        {
          scaleX: canvas.width! / (img.width || 1),
          scaleY: canvas.height! / (img.height || 1),
        }
      )
    }
  } catch (error) {
    console.warn("[Export] Failed to load template, continuing without:", error)
  }
}

/**
 * Download image from data URL
 */
function downloadImage(dataURL: string, filename: string): void {
  const link = document.createElement("a")
  link.href = dataURL
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Delay utility
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Get export preview (smaller version for preview)
 */
export async function getSlidePreview(slide: Slide): Promise<string> {
  const canvas = new fabric.Canvas(null, {
    width: 1080,
    height: 1080,
    backgroundColor: slide.theme === "dark" ? "#0B0B0E" : "#FFFFFF",
  })

  try {
    await loadTemplateBackground(canvas, slide.templateImage)

    for (const node of slide.nodes) {
      try {
        let fabricObj: fabric.Object

        if (node.type === "image") {
          fabricObj = await nodeToFabricImageAsync(node)
        } else {
          fabricObj = nodeToFabricObject(node)
        }

        canvas.add(fabricObj)
      } catch (error) {
        console.error("[Preview] Failed to render node:", node.id, error)
      }
    }

    canvas.renderAll()

    // Export smaller version for preview (quarter size)
    const dataURL = canvas.toDataURL({
      format: "jpeg",
      quality: 0.8,
      multiplier: 0.25, // 270x270px
    })

    canvas.dispose()
    return dataURL
  } catch (error) {
    console.error("[Preview] Failed to generate preview:", error)
    canvas.dispose()
    return ""
  }
}
