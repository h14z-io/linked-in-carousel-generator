/**
 * Fetches and extracts clean content from URLs using Jina AI Reader
 * @param url - The URL to fetch content from
 * @returns Clean text content in markdown format
 */
export async function fetchUrlContent(url: string): Promise<string> {
  try {
    // Use Jina AI Reader to get clean, readable content
    const jinaUrl = `https://r.jina.ai/${url}`

    const response = await fetch(jinaUrl, {
      headers: {
        Accept: "text/plain",
        "X-Return-Format": "markdown",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    }

    const content = await response.text()

    // Return the clean content
    return content.trim()
  } catch (error) {
    console.error(`[v0] Error fetching URL ${url}:`, error)
    throw new Error(`No se pudo obtener contenido de ${url}`)
  }
}

/**
 * Fetches content from multiple URLs and combines them
 * @param urls - Array of URLs to fetch
 * @returns Combined content from all URLs
 */
export async function fetchMultipleUrls(urls: string[]): Promise<string> {
  const contents: string[] = []

  for (const url of urls) {
    try {
      console.log(`[v0] Fetching content from: ${url}`)
      const content = await fetchUrlContent(url)
      contents.push(`\n\n--- Contenido de ${url} ---\n\n${content}`)
    } catch (error) {
      console.error(`[v0] Failed to fetch ${url}:`, error)
      // Continue with other URLs even if one fails
      contents.push(`\n\n--- Error al obtener contenido de ${url} ---\n\n`)
    }
  }

  return contents.join("\n")
}

/**
 * Validates if a string is a valid URL
 * @param str - String to validate
 * @returns true if valid URL, false otherwise
 */
export function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}
