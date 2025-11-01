/**
 * Fetches and extracts clean content from URLs using Jina AI Reader via API route
 * @param url - The URL to fetch content from
 * @returns Clean text content in markdown format
 */
export async function fetchUrlContent(url: string): Promise<string> {
  try {
    // Use our API route to proxy the request to Jina AI (avoids CORS issues)
    const response = await fetch("/api/fetch-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Failed to fetch ${url}`)
    }

    const data = await response.json()

    if (!data.success || !data.content) {
      throw new Error(`Invalid response from server`)
    }

    // Return the clean content
    return data.content.trim()
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
