export type ThemeMode = "dark" | "light"

export interface ThemeColors {
  background: string
  surface: string
  text: string
  muted: string
  primary: string
  border: string
}

export interface GenerationInput {
  sourceText: string
  sourceUrls: string[]
  templateId: "problem-solution" | "transformation" | "educational"
  audienceMode: "finance" | "tech" | "exec" | "managers"
  slideCount: number
  language: "es" | "en"
  technicalDepth: "basic" | "intermediate" | "advanced"
  tone: "formal" | "conversational" | "inspirational" | "educational"
  copyLength: "short" | "long"
  objective: string
  requiredKeywords: string[]
  theme: ThemeMode
}

export interface Slide {
  title: string
  bullets: string[]
  visual_direction: string
  html: string
}

export interface PostCopy {
  audience: string
  text: string
}

export interface GenerationResult {
  slides: Slide[]
  post_copies: PostCopy[]
  hashtags: string[]
  schedule_suggestions: string[]
  image_prompts?: string[]
}

export interface GenerationState {
  htmlPreview: string
  images: string[]
  postCopies: string[]
  hashtags: string[]
  scheduleSuggestions: string[]
}
