export interface GenerationInput {
  sourceText: string
  sourceUrls: string[]
  templateId: "template-a" | "template-b" | "template-c"
  audienceModes: ("finance" | "tech" | "exec")[]
  slideCount: number
  language: "es" | "en"
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
