import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Validate URL
    try {
      new URL(url)
    } catch (e) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
    }

    // Fetch from Jina AI Reader
    const jinaUrl = `https://r.jina.ai/${url}`

    const response = await fetch(jinaUrl, {
      headers: {
        Accept: "text/plain",
        "X-Return-Format": "markdown",
      },
      // Add timeout
      signal: AbortSignal.timeout(30000), // 30 second timeout
    })

    if (!response.ok) {
      throw new Error(`Jina AI returned status ${response.status}`)
    }

    const content = await response.text()

    return NextResponse.json({
      success: true,
      content,
      url,
    })
  } catch (error: any) {
    console.error("[fetch-url] Error:", error)

    return NextResponse.json(
      {
        error: error.message || "Failed to fetch URL content",
        url: (await request.json()).url,
      },
      { status: 500 }
    )
  }
}
