import * as fabric from "fabric"
import type { Node, TextNode, EmojiNode, ImageNode, ShapeNode } from "../types"

/**
 * Convert a Node to a Fabric.js object
 */
export function nodeToFabricObject(node: Node): fabric.Object {
  if (node.type === "text") {
    const textNode = node as TextNode
    return new fabric.Text(textNode.content, {
      left: textNode.x,
      top: textNode.y,
      width: textNode.width,
      fontSize: textNode.fontSize,
      fontFamily: textNode.fontFamily,
      fontWeight: textNode.fontWeight,
      fill: textNode.color,
      textAlign: textNode.align,
      lineHeight: textNode.lineHeight,
      angle: textNode.rotation,
      opacity: textNode.opacity,
      selectable: !textNode.locked,
      hasControls: !textNode.locked,
    })
  }

  if (node.type === "emoji") {
    const emojiNode = node as EmojiNode
    return new fabric.Text(emojiNode.emoji, {
      left: emojiNode.x,
      top: emojiNode.y,
      fontSize: emojiNode.fontSize,
      angle: emojiNode.rotation,
      opacity: emojiNode.opacity,
      selectable: !emojiNode.locked,
      hasControls: !emojiNode.locked,
    })
  }

  if (node.type === "image") {
    // Image nodes require async loading, handle separately
    throw new Error("Image nodes must be loaded with nodeToFabricImageAsync")
  }

  if (node.type === "shape") {
    const shapeNode = node as ShapeNode
    if (shapeNode.shapeType === "rect") {
      return new fabric.Rect({
        left: shapeNode.x,
        top: shapeNode.y,
        width: shapeNode.width,
        height: shapeNode.height,
        fill: shapeNode.fill,
        stroke: shapeNode.stroke,
        strokeWidth: shapeNode.strokeWidth,
        angle: shapeNode.rotation,
        opacity: shapeNode.opacity,
        selectable: !shapeNode.locked,
        hasControls: !shapeNode.locked,
      })
    }
    if (shapeNode.shapeType === "circle") {
      return new fabric.Circle({
        left: shapeNode.x,
        top: shapeNode.y,
        radius: Math.min(shapeNode.width, shapeNode.height) / 2,
        fill: shapeNode.fill,
        stroke: shapeNode.stroke,
        strokeWidth: shapeNode.strokeWidth,
        angle: shapeNode.rotation,
        opacity: shapeNode.opacity,
        selectable: !shapeNode.locked,
        hasControls: !shapeNode.locked,
      })
    }
  }

  // Fallback: create a placeholder
  return new fabric.Rect({
    left: node.x,
    top: node.y,
    width: node.width,
    height: node.height,
    fill: "rgba(255,0,0,0.2)",
  })
}

/**
 * Convert an ImageNode to a Fabric.js Image (async)
 */
export async function nodeToFabricImageAsync(node: ImageNode): Promise<fabric.Image> {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(
      node.src,
      (img) => {
        if (!img) {
          reject(new Error("Failed to load image"))
          return
        }
        img.set({
          left: node.x,
          top: node.y,
          scaleX: node.width / (img.width || 1),
          scaleY: node.height / (img.height || 1),
          angle: node.rotation,
          opacity: node.opacity,
          selectable: !node.locked,
          hasControls: !node.locked,
        })
        resolve(img)
      },
      { crossOrigin: "anonymous" }
    )
  })
}

/**
 * Convert a Fabric.js object back to a Node
 */
export function fabricObjectToNode(obj: fabric.Object): Node | null {
  if (!obj) return null

  const baseProps = {
    id: (obj as any).id || `node-${Date.now()}-${Math.random()}`,
    x: obj.left || 0,
    y: obj.top || 0,
    width: (obj.width || 0) * (obj.scaleX || 1),
    height: (obj.height || 0) * (obj.scaleY || 1),
    rotation: obj.angle || 0,
    opacity: obj.opacity || 1,
    zIndex: 10,
    locked: !obj.selectable,
  }

  if (obj instanceof fabric.Text) {
    // Check if it's an emoji (single character, large size)
    const text = obj.text || ""
    const isEmoji = text.length <= 2 && obj.fontSize && obj.fontSize > 40

    if (isEmoji) {
      return {
        ...baseProps,
        type: "emoji",
        emoji: text,
        fontSize: obj.fontSize || 48,
      } as EmojiNode
    }

    return {
      ...baseProps,
      type: "text",
      content: text,
      fontSize: obj.fontSize || 24,
      fontFamily: obj.fontFamily || "Inter",
      fontWeight: (obj.fontWeight as number) || 400,
      color: (obj.fill as string) || "#FFFFFF",
      align: (obj.textAlign as "left" | "center" | "right") || "left",
      lineHeight: obj.lineHeight || 1.5,
      letterSpacing: 0,
    } as TextNode
  }

  if (obj instanceof fabric.Image) {
    return {
      ...baseProps,
      type: "image",
      src: (obj as any)._originalElement?.src || "",
      filters: [],
    } as ImageNode
  }

  if (obj instanceof fabric.Rect) {
    return {
      ...baseProps,
      type: "shape",
      shapeType: "rect",
      fill: (obj.fill as string) || "transparent",
      stroke: (obj.stroke as string) || "#000000",
      strokeWidth: obj.strokeWidth || 0,
    } as ShapeNode
  }

  if (obj instanceof fabric.Circle) {
    return {
      ...baseProps,
      type: "shape",
      shapeType: "circle",
      fill: (obj.fill as string) || "transparent",
      stroke: (obj.stroke as string) || "#000000",
      strokeWidth: obj.strokeWidth || 0,
    } as ShapeNode
  }

  return null
}

/**
 * Extract all nodes from a Fabric.js canvas
 */
export function fabricCanvasToNodes(canvas: fabric.Canvas): Node[] {
  const objects = canvas.getObjects()
  return objects.map(fabricObjectToNode).filter((node): node is Node => node !== null)
}

/**
 * Setup grid snapping on a canvas
 */
export function setupGridSnapping(canvas: fabric.Canvas, gridSize: number = 20) {
  canvas.on("object:moving", (e) => {
    const obj = e.target
    if (!obj) return

    const left = obj.left || 0
    const top = obj.top || 0

    obj.set({
      left: Math.round(left / gridSize) * gridSize,
      top: Math.round(top / gridSize) * gridSize,
    })
  })
}

/**
 * Setup alignment guides (optional enhancement)
 */
export function setupAlignmentGuides(canvas: fabric.Canvas) {
  // TODO: Implement alignment guide lines
  // This would show lines when objects are aligned with each other
  // Lower priority feature
}
