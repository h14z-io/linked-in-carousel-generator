import { GoogleGenAI } from "@google/genai"
import type { AIGenerationRequest, AIGenerationResponse } from "../types"
import { buildMultimodalPrompt } from "./prompt-builder"
import { safeExtractJSON } from "@/lib/safe-extract-json"

/**
 * Gemini 2.5 API client for multimodal carousel generation
 * Sends template image + prompt to generate structured node data
 */

export async function generateCarouselNodes(
  request: AIGenerationRequest
): Promise<AIGenerationResponse> {
  // Get API key and model from localStorage
  const apiKey = typeof window !== "undefined" ? localStorage.getItem("geminiApiKey") : null
  const model =
    typeof window !== "undefined"
      ? localStorage.getItem("geminiModel") || "gemini-2.5-flash"
      : "gemini-2.5-flash"

  if (!apiKey) {
    throw new Error("Gemini API key not found. Please configure in Settings.")
  }

  // Initialize Gemini client
  const ai = new GoogleGenAI({ apiKey })

  // Load template image as base64
  const imageData = await loadTemplateAsBase64(request.templateImage)

  // Build multimodal prompt
  const promptText = buildMultimodalPrompt(request)

  console.log("[Gemini] Generating carousel with multimodal input...")
  console.log("[Gemini] Model:", model)
  console.log("[Gemini] Narrative:", request.narrativeStyle)
  console.log("[Gemini] Template:", request.templateImage)

  try {
    // Generate content with image + text
    const response = await ai.models.generateContent({
      model,
      contents: [
        { text: promptText },
        {
          inlineData: {
            mimeType: "image/png",
            data: imageData,
          },
        },
      ],
      config: {
        temperature: 0.7,
        maxOutputTokens: 8000,
      },
    })

    // Extract text from response
    let text = ""
    if (typeof response === "string") {
      text = response
    } else if (response.text) {
      text = response.text
    } else if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
      text = response.candidates[0].content.parts[0].text
    } else {
      throw new Error("Could not extract text from Gemini response")
    }

    console.log("[Gemini] Response received, length:", text.length)

    // Parse JSON response
    const parsed = safeExtractJSON(text) as AIGenerationResponse

    if (!parsed || !parsed.slides || parsed.slides.length === 0) {
      throw new Error("Invalid response structure from Gemini")
    }

    // Validate and sanitize nodes
    parsed.slides = parsed.slides.map((slide) => ({
      ...slide,
      nodes: slide.nodes.map(validateNode),
    }))

    console.log("[Gemini] Successfully generated", parsed.slides.length, "slides")

    return parsed
  } catch (error) {
    console.error("[Gemini] Generation failed:", error)
    throw new Error(
      `Failed to generate carousel: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }
}

/**
 * Load template image from public folder and convert to base64
 */
async function loadTemplateAsBase64(templatePath: string): Promise<string> {
  try {
    // Fetch image from public folder
    const response = await fetch(templatePath)

    if (!response.ok) {
      throw new Error(`Failed to load template: ${response.statusText}`)
    }

    const blob = await response.blob()

    // Convert to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        // Remove data URL prefix (data:image/png;base64,)
        const base64Data = base64.split(",")[1]
        resolve(base64Data)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error("[Template] Failed to load:", error)
    throw new Error("Failed to load template image")
  }
}

/**
 * Validate and sanitize a single node
 * Ensures coordinates are within canvas bounds and required fields exist
 */
function validateNode(node: any): any {
  const CANVAS_SIZE = 1080

  // Ensure coordinates are within bounds
  const x = Math.max(0, Math.min(node.x || 0, CANVAS_SIZE))
  const y = Math.max(0, Math.min(node.y || 0, CANVAS_SIZE))
  const width = Math.max(10, Math.min(node.width || 100, CANVAS_SIZE - x))
  const height = Math.max(10, Math.min(node.height || 50, CANVAS_SIZE - y))

  // Common properties
  const baseNode = {
    id: node.id || `node-${Date.now()}-${Math.random()}`,
    type: node.type || "text",
    x,
    y,
    width,
    height,
    rotation: node.rotation || 0,
    opacity: Math.max(0, Math.min(node.opacity || 1, 1)),
    zIndex: node.zIndex || 10,
    locked: node.locked || false,
  }

  // Type-specific properties
  if (node.type === "text") {
    return {
      ...baseNode,
      content: node.content || "",
      fontSize: Math.max(12, Math.min(node.fontSize || 24, 200)),
      fontFamily: node.fontFamily || "Inter",
      fontWeight: node.fontWeight || 400,
      color: node.color || "#FFFFFF",
      align: node.align || "left",
      lineHeight: node.lineHeight || 1.5,
      letterSpacing: node.letterSpacing || 0,
    }
  }

  if (node.type === "emoji") {
    return {
      ...baseNode,
      emoji: node.emoji || "✨",
      fontSize: Math.max(20, Math.min(node.fontSize || 48, 200)),
    }
  }

  if (node.type === "image") {
    return {
      ...baseNode,
      src: node.src || "",
      filters: node.filters || [],
    }
  }

  // Default to text node if type unknown
  return {
    ...baseNode,
    type: "text",
    content: node.content || "",
    fontSize: 24,
    fontFamily: "Inter",
    fontWeight: 400,
    color: "#FFFFFF",
    align: "left",
    lineHeight: 1.5,
    letterSpacing: 0,
  }
}
