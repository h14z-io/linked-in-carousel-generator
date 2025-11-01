import type { AIGenerationRequest } from "../types"
import { getNarrativeInstructions } from "../templates/narrative-definitions"

/**
 * Build multimodal prompt for Gemini 2.5
 * Combines user requirements with narrative framework instructions
 */

export function buildMultimodalPrompt(request: AIGenerationRequest): string {
  const narrativeInstructions = getNarrativeInstructions(request.narrativeStyle)

  return `
# LinkedIn Carousel Generation Task

## CRITICAL: Template Image Analysis Required

You have been provided with a 1080x1080px square template image.

**ANALYZE THIS IMAGE CAREFULLY** to understand:
- Visual style (colors, fonts, layout patterns)
- Available space for content placement
- Decorative elements (borders, shapes, gradients) to avoid overlapping
- Suggested positioning for text elements based on visual design
- Overall aesthetic (modern, corporate, playful, etc.)

Your task is to generate content that:
1. Respects the visual design of the template
2. Places text in appropriate areas (not over decorative elements)
3. Matches the visual style with appropriate typography choices
4. Uses colors that harmonize with the template

---

## Narrative Framework: ${request.narrativeStyle.toUpperCase()}

${narrativeInstructions}

---

## Content Source Material

${request.corpus}

---

## Generation Requirements

**Language**: ${request.language}
**Technical Depth**: ${request.technicalDepth}
**Tone**: ${request.tone}
**Target Audience**: ${request.audience}
**Primary Objective**: ${request.objective}
${request.requiredKeywords.length > 0 ? `**Required Keywords**: ${request.requiredKeywords.join(", ")}` : ""}
**Theme**: ${request.theme} (adjust colors accordingly)

---

## Output Structure

Generate a JSON response with this **EXACT** structure:

\`\`\`json
{
  "slides": [
    {
      "nodes": [
        {
          "id": "unique-id-1",
          "type": "text",
          "content": "Your content here",
          "x": 120,
          "y": 200,
          "width": 840,
          "height": 150,
          "fontSize": 64,
          "fontFamily": "Inter",
          "fontWeight": 900,
          "color": "#FFFFFF",
          "align": "left",
          "lineHeight": 1.2,
          "letterSpacing": 0,
          "rotation": 0,
          "opacity": 1,
          "zIndex": 10,
          "locked": false
        }
      ]
    }
  ],
  "postCopy": "Engaging LinkedIn post copy that complements the carousel...",
  "hashtags": ["#relevant", "#hashtags", "#here"]
}
\`\`\`

---

## Node Types Available

### Text Node
\`\`\`json
{
  "id": "title-1",
  "type": "text",
  "content": "Your text content",
  "x": 120,
  "y": 200,
  "width": 840,
  "height": 100,
  "fontSize": 64,
  "fontFamily": "Inter",
  "fontWeight": 900,
  "color": "#FFFFFF",
  "align": "left",
  "lineHeight": 1.2,
  "letterSpacing": 0,
  "rotation": 0,
  "opacity": 1,
  "zIndex": 10,
  "locked": false
}
\`\`\`

### Emoji Node (for visual accents)
\`\`\`json
{
  "id": "emoji-1",
  "type": "emoji",
  "emoji": "🚀",
  "x": 100,
  "y": 300,
  "width": 80,
  "height": 80,
  "fontSize": 64,
  "rotation": 0,
  "opacity": 1,
  "zIndex": 10,
  "locked": false
}
\`\`\`

---

## Critical Typography Constraints

### Square Format (1080x1080px) Rules:
- **Titles**: 52-72px font size, MAX 2 lines (~50 characters total)
- **Subtitles**: 36-48px font size
- **Body text**: 24-36px font size
- **Bullets**: 28-40px font size, MAX 12 words EACH
- **Large numbers** (for stats): 80-120px font size
- **Footer text**: 18-24px font size

### Content Density:
- Each slide: 10-20 words MAX (excluding title)
- Whitespace is CRITICAL for visual impact
- Every word must add value
- No filler content

### Positioning Guidelines:
- Leave margins: minimum 60px from all edges
- Don't overlap decorative elements in template
- Center important elements visually
- Use alignment (left/center/right) based on template style
- Group related content with proximity (spacing: 20-40px between elements)

### Color Guidelines:
${
  request.theme === "dark"
    ? `
- Primary text: #FFFFFF or near-white (#EAEAF0)
- Secondary text: 70-80% opacity (#B9B9C6)
- Accent color: #BB2649 (or harmonize with template)
- Background: #0B0B0E (template handles this)
`
    : `
- Primary text: #1A1A1A or near-black
- Secondary text: 70-80% opacity (#666666)
- Accent color: #BB2649 (or harmonize with template)
- Background: #FFFFFF (template handles this)
`
}

### Font Families Available:
Choose from: Inter, Montserrat, Roboto, Playfair Display, Space Grotesk
- Inter: Modern, clean, versatile (DEFAULT)
- Montserrat: Bold, contemporary
- Roboto: Corporate, professional
- Playfair Display: Elegant, serif (use sparingly)
- Space Grotesk: Tech, modern, geometric

---

## LinkedIn Post Copy Requirements

Generate compelling post copy (separate from carousel content) that:
- Hooks reader in first line (critical for feed visibility)
- Complements carousel content (teases insights without repeating)
- Includes strategic line breaks for scannability
- Ends with clear CTA
- Word count: 100-200 words (concise but engaging)
- Incorporates 1-2 required keywords naturally

---

## Quality Checklist

Before finalizing your JSON, verify:

- [ ] All x, y coordinates fit within 0-1080 range
- [ ] All width, height values are positive and fit within canvas
- [ ] Text fontSize is appropriate for content type (title=64px, body=32px, etc.)
- [ ] Text content follows 12-word-per-bullet limit
- [ ] Colors provide sufficient contrast for readability
- [ ] Content follows the ${request.narrativeStyle} narrative framework progression
- [ ] Each slide has clear visual hierarchy (title → body → details)
- [ ] Post copy is engaging and includes CTA
- [ ] Hashtags are relevant and trending (3-5 total, no more)
- [ ] Language is ${request.language}
- [ ] Tone matches ${request.tone}
- [ ] Content is appropriate for ${request.audience} audience

---

## Example Slide Structure

Here's an example of a well-structured slide:

\`\`\`json
{
  "nodes": [
    {
      "id": "slide-number",
      "type": "text",
      "content": "01",
      "x": 80,
      "y": 80,
      "width": 120,
      "height": 120,
      "fontSize": 96,
      "fontFamily": "Inter",
      "fontWeight": 900,
      "color": "#BB2649",
      "align": "center",
      "lineHeight": 1,
      "rotation": 0,
      "opacity": 0.8,
      "zIndex": 5
    },
    {
      "id": "title",
      "type": "text",
      "content": "The Hidden Problem",
      "x": 80,
      "y": 240,
      "width": 920,
      "height": 160,
      "fontSize": 68,
      "fontFamily": "Inter",
      "fontWeight": 900,
      "color": "#FFFFFF",
      "align": "left",
      "lineHeight": 1.15,
      "rotation": 0,
      "opacity": 1,
      "zIndex": 10
    },
    {
      "id": "bullet-1",
      "type": "text",
      "content": "80% of companies ignore this",
      "x": 120,
      "y": 440,
      "width": 840,
      "height": 60,
      "fontSize": 36,
      "fontFamily": "Inter",
      "fontWeight": 500,
      "color": "#B9B9C6",
      "align": "left",
      "lineHeight": 1.5,
      "rotation": 0,
      "opacity": 1,
      "zIndex": 10
    },
    {
      "id": "bullet-2",
      "type": "text",
      "content": "Costs $2M annually in waste",
      "x": 120,
      "y": 540,
      "width": 840,
      "height": 60,
      "fontSize": 36,
      "fontFamily": "Inter",
      "fontWeight": 500,
      "color": "#B9B9C6",
      "align": "left",
      "lineHeight": 1.5,
      "rotation": 0,
      "opacity": 1,
      "zIndex": 10
    }
  ]
}
\`\`\`

---

## Final Instructions

1. Analyze the template image FIRST
2. Plan content structure based on template layout
3. Generate 7 slides following ${request.narrativeStyle} framework
4. Ensure all nodes have complete, valid properties
5. Write compelling post copy
6. Select 3-5 relevant hashtags
7. Return ONLY valid JSON (no markdown code blocks, no extra text)

Generate the JSON now. Be precise with coordinates and styling. Make every slide visually impactful and content-rich.
`
}
