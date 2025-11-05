// v2 Type Definitions for Canvas-based Carousel Editor

export type NodeType = "text" | "image" | "shape" | "emoji"

export type TextAlign = "left" | "center" | "right"

export type ThemeMode = "dark" | "light"

export interface BaseNode {
  id: string
  type: NodeType
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  zIndex: number
  locked: boolean
}

export interface TextNode extends BaseNode {
  type: "text"
  content: string
  fontSize: number
  fontFamily: string
  fontWeight: number
  color: string
  align: TextAlign
  lineHeight: number
  letterSpacing: number
}

export interface ImageNode extends BaseNode {
  type: "image"
  src: string // URL or base64
  filters?: string[] // optional: brightness, contrast, etc.
}

export interface EmojiNode extends BaseNode {
  type: "emoji"
  emoji: string
  fontSize: number
}

export interface ShapeNode extends BaseNode {
  type: "shape"
  shapeType: "rect" | "circle" | "line"
  fill: string
  stroke: string
  strokeWidth: number
}

export type Node = TextNode | ImageNode | EmojiNode | ShapeNode

export interface Slide {
  id: string
  narrativeStyle: string
  templateImage: string // path to template PNG
  theme: ThemeMode
  nodes: Node[]
  fabricJSON?: string // Serialized Fabric.js canvas (for restoration)
}

export interface Project {
  id: string
  name: string
  narrativeStyle: string
  language: string
  tone: string
  audience: string
  slides: Slide[]
  postCopy: string
  hashtags: string[]
  createdAt: string
  updatedAt: string
}

export interface NarrativeStyle {
  id: string
  name: string
  subtitle: string
  framework: string // "PASP", "BAB", etc.
  bestFor: string
  structure: string[]
  slideCount: number
  promptInstructions: string
  templateImage: {
    dark: string
    light: string
  }
}

export interface AIGenerationRequest {
  corpus: string // combined text + URLs
  narrativeStyle: string
  language: string
  technicalDepth: string
  tone: string
  audience: string
  objective: string
  requiredKeywords: string[]
  theme: ThemeMode
  templateImage: string // base64 encoded
  slideCount?: number // Optional override for slide count (default: 7)
}

export interface AIGenerationResponse {
  slides: {
    nodes: Node[]
  }[]
  postCopy: string
  hashtags: string[]
  reasoning?: string // Optional: AI's thought process
}

// Canvas editor state
export interface EditorState {
  selectedNodeId: string | null
  zoom: number
  gridEnabled: boolean
  snapEnabled: boolean
  history: HistoryItem[]
  historyIndex: number
}

export interface HistoryItem {
  timestamp: number
  nodes: Node[]
}

// Font options (5 max as requested)
export const FONT_FAMILIES = [
  "Inter",
  "Montserrat",
  "Roboto",
  "Playfair Display",
  "Space Grotesk",
] as const

export type FontFamily = (typeof FONT_FAMILIES)[number]
