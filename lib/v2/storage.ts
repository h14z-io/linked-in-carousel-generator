import type { Project, Slide } from "./types"

const STORAGE_KEYS = {
  CURRENT_PROJECT: "v2_current_project",
  PROJECTS: "v2_projects",
  SLIDES: "v2_slides",
}

/**
 * Save current project
 */
export function saveCurrentProject(project: Project): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT, JSON.stringify(project))
  } catch (error) {
    console.error("[Storage] Failed to save project:", error)
  }
}

/**
 * Load current project
 */
export function loadCurrentProject(): Project | null {
  try {
    const json = localStorage.getItem(STORAGE_KEYS.CURRENT_PROJECT)
    if (!json) return null

    return JSON.parse(json) as Project
  } catch (error) {
    console.error("[Storage] Failed to load project:", error)
    return null
  }
}

/**
 * Save slides to session storage (for editor navigation)
 */
export function saveSlides(slides: Slide[]): void {
  try {
    sessionStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(slides))
  } catch (error) {
    console.error("[Storage] Failed to save slides:", error)
  }
}

/**
 * Load slides from session storage
 */
export function loadSlides(): Slide[] {
  try {
    const json = sessionStorage.getItem(STORAGE_KEYS.SLIDES)
    if (!json) return []

    return JSON.parse(json) as Slide[]
  } catch (error) {
    console.error("[Storage] Failed to load slides:", error)
    return []
  }
}

/**
 * Update a single slide in storage
 */
export function updateSlide(slideId: string, updatedSlide: Slide): void {
  try {
    const slides = loadSlides()
    const index = slides.findIndex((s) => s.id === slideId)

    if (index !== -1) {
      slides[index] = updatedSlide
      saveSlides(slides)
    }
  } catch (error) {
    console.error("[Storage] Failed to update slide:", error)
  }
}

/**
 * Save project to projects list
 */
export function saveToProjectsList(project: Project): void {
  try {
    const projectsJson = localStorage.getItem(STORAGE_KEYS.PROJECTS)
    const projects: Project[] = projectsJson ? JSON.parse(projectsJson) : []

    // Check if project already exists
    const existingIndex = projects.findIndex((p) => p.id === project.id)

    if (existingIndex !== -1) {
      // Update existing
      projects[existingIndex] = project
    } else {
      // Add new
      projects.unshift(project) // Add to beginning
    }

    // Keep only last 10 projects
    const trimmed = projects.slice(0, 10)

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(trimmed))
  } catch (error) {
    console.error("[Storage] Failed to save to projects list:", error)
  }
}

/**
 * Load projects list
 */
export function loadProjectsList(): Project[] {
  try {
    const json = localStorage.getItem(STORAGE_KEYS.PROJECTS)
    if (!json) return []

    return JSON.parse(json) as Project[]
  } catch (error) {
    console.error("[Storage] Failed to load projects list:", error)
    return []
  }
}

/**
 * Create new project from slides
 */
export function createProject(
  name: string,
  slides: Slide[],
  narrativeStyle: string,
  language: string,
  tone: string,
  audience: string,
  postCopy: string,
  hashtags: string[]
): Project {
  return {
    id: `project-${Date.now()}`,
    name,
    slides,
    narrativeStyle,
    language,
    tone,
    audience,
    postCopy,
    hashtags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
