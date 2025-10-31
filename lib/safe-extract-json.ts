export function safeExtractJSON(resp: string): any {
  try {
    console.log("[v0] safeExtractJSON input length:", resp.length)
    console.log("[v0] safeExtractJSON first 300 chars:", resp.substring(0, 300))

    const patterns = [
      /```json\s*\n([\s\S]*?)\n```/i, // Standard: ```json\n...\n```
      /```json\s*([\s\S]*?)```/i, // Flexible: ```json...```
      /```\s*\n([\s\S]*?)\n```/i, // No language: ```\n...\n```
      /```([\s\S]*?)```/i, // Minimal: ```...```
      /\{[\s\S]*"slides"[\s\S]*\}/, // Direct JSON object search
    ]

    let extracted = null
    let patternUsed = -1

    for (let i = 0; i < patterns.length; i++) {
      const match = String(resp).match(patterns[i])
      if (match) {
        extracted = match[1] || match[0]
        patternUsed = i
        console.log("[v0] Pattern", i, "matched, extracted length:", extracted.length)
        break
      }
    }

    if (!extracted) {
      console.log("[v0] No pattern matched, using full response")
      extracted = resp
    }

    extracted = extracted.trim()

    // If it doesn't start with {, try to find the first { and last }
    if (!extracted.startsWith("{")) {
      const firstBrace = extracted.indexOf("{")
      const lastBrace = extracted.lastIndexOf("}")
      if (firstBrace !== -1 && lastBrace !== -1) {
        extracted = extracted.substring(firstBrace, lastBrace + 1)
        console.log("[v0] Extracted JSON between braces, length:", extracted.length)
      }
    }

    console.log("[v0] Attempting to parse JSON, length:", extracted.length)
    console.log("[v0] First 200 chars of extracted:", extracted.substring(0, 200))

    const parsed = JSON.parse(extracted)
    console.log("[v0] JSON parsed successfully, keys:", Object.keys(parsed))

    return parsed
  } catch (error) {
    console.error("[v0] safeExtractJSON error:", error)
    console.error("[v0] Failed to parse, returning empty object")
    return {}
  }
}
