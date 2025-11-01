# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js application for generating LinkedIn carousel posts using Google Gemini AI optimized for 1080x1080px SQUARE format. Users provide source content (text or URLs), customize design and content settings, and the AI generates professional carousel slides with matching post copy for different audiences.

**Format**: 1080x1080px (1:1 square ratio) - LinkedIn's optimal format for professional carousels based on analysis of successful posts (Citi, AIG, Zenrows, Data Science Infinity)

## Development Commands

```bash
# Development
npm run dev          # Start development server on localhost:3000

# Build & Production
npm run build        # Create production build
npm start            # Run production server

# Code Quality
npm run lint         # Run ESLint
```

## Architecture

### Core Flow

1. **Content Input** (`app/page.tsx`): User provides source text/URLs + configuration
2. **URL Fetching** (`lib/fetch-url-content.ts`): Jina AI Reader extracts clean content from URLs
3. **AI Generation** (`app/page.tsx:generateCarousel`): Sends combined content + configuration to Gemini 2.5 Pro
4. **Response Processing** (`lib/safe-extract-json.ts`): Extracts JSON from AI response (handles markdown code blocks)
5. **HTML Rendering** (`lib/template-renderer.tsx`): Generates HTML preview based on selected template
6. **Image Export**: Uses html2canvas to convert rendered HTML to downloadable PNGs

### Key AI Integration Points

**SDK & Models**:

- Uses `GoogleGenAI` from `@google/genai` package (latest stable version)
- Two Gemini 2.5 models available:
  - **gemini-2.5-flash** (default): Fast, 15x cheaper, ideal for carousels
  - **gemini-2.5-pro**: More powerful reasoning, better for complex tasks
- Model selection stored in localStorage (`geminiModel`)

**Generation (`app/page.tsx:302-611`)**:

- Temperature: 0.7, Max tokens: 8000
- **Square Format Optimizations** (v4.0):
  - Explicit 1080x1080px square format constraints in prompt
  - Title length: Max 2 lines (50 characters)
  - Bullets: Max 12 words EACH (ultra-concise, scannable)
  - Copy length: Short (100-150 words), Long (200-250 words) - reduced from previous 150-200 / 300-400
  - Copy strategy: Ultra-scannable format with action verbs
  - All content optimized for high visual impact in compact space
- Prompt engineering includes: language, technical depth, tone, copy length, objective, audience targeting, and required keywords
- Uses selected model from localStorage
- API key stored in localStorage (`geminiApiKey`)

**Slide Editing (`app/page.tsx:202-300`)**:

- Individual slides can be edited with AI assistance with square format constraints
- Uses selected Gemini model with custom instructions
- Max tokens: 2000
- **Square Format Constraints in Edit Prompt** (v4.0):
  - Title: Max 2 lines (50 characters)
  - Bullets: Max 12 words EACH
  - Ultra-concise, scannable content
  - Every word must add value
- Updates specific slide in `slidesData` array and re-renders

### Template System (`lib/template-renderer.tsx`)

Five visual templates with distinct styles:

- **Template A**: Minimal Tech - Clean, subtle design
- **Template B**: Bold Magenta - Strong left border, accent underlines
- **Template C**: Editorial Grid - Serif fonts, editorial style
- **Template D**: Data-Driven - Large numbers, data visualization icons
- **Template E**: Storytelling - Gradient accents, narrative flow

Templates defined as CSS-in-JS. Each applies different:

- Border styles and shadows
- Typography (fonts, sizes, weights)
- Icon styling and positioning
- Color treatments and gradients

### State Management

Uses React `useState` for local state management:

- `input`: GenerationInput - user configuration
- `generation`: GenerationState - AI output and rendered preview
- `slidesData`: Slide[] - structured slide content for editing/re-rendering
- `editingSlideIndex`: number | null - tracks which slide is being edited

### Type System (`lib/types.ts`)

Key interfaces:

- `GenerationInput`: All user configuration (source, template, audiences, style settings)
- `Slide`: Individual slide structure (title, bullets, visual_direction, html)
- `GenerationResult`: Complete AI response structure
- `GenerationState`: UI state for displaying generated content

### Content Fetching (`lib/fetch-url-content.ts`)

- Uses Jina AI Reader API: `https://r.jina.ai/{url}`
- Returns markdown-formatted content
- Handles multiple URLs sequentially
- Includes error handling per URL (continues if one fails)

### Settings & Configuration (`app/settings/page.tsx`)

Stores in localStorage:

- `geminiApiKey`: Google Gemini API key (required)
- `geminiModel`: Gemini model to use (default: "gemini-2.5-flash")
  - Options: `gemini-2.5-flash` (fast, 15x cheaper) or `gemini-2.5-pro` (powerful, best reasoning)
- `exportEngine`: Image export engine (default: "html2canvas")
  - Options: `html2canvas` (JPEG, optimized for html2canvas) or `html-to-image` (flexible, multiple formats)
- `brandName`: Custom brand name for carousels (default: "h14z.io")
- `brandColor`: Brand color hex code (default: "#BB2649")

Note: Brand customization exists in UI but is NOT yet implemented in template renderer (currently hardcoded to h14z.io branding).

## Path Aliases

Uses `@/*` to reference root directory files:

```typescript
import { Component } from "@/components/component"
import { fetchUrlContent } from "@/lib/fetch-url-content"
```

## UI Framework

Built with Shadcn UI (Radix UI primitives + Tailwind CSS):

- Components in `components/ui/` (auto-generated, avoid manual edits)
- Custom theme variables defined in CSS (--bg, --surf, --txt, --mut, --pri, --border)
- Uses dark theme as default

## Important Implementation Notes

### AI Response Handling

- Gemini responses may include markdown code blocks - use `safeExtractJSON` to extract
- Check `finishReason === "MAX_TOKENS"` to detect truncated responses
- Response structure varies - check multiple paths: `response.text`, `response.candidates[0].content.parts[0].text`, etc.

### Image Export Process (v4.0 - Square Format + Dual Engine)

#### **Overview**

Two export engines available (configurable in Settings):

1. **html2canvas (Default)**: JPEG format, optimized for speed and consistency
2. **html-to-image**: Advanced engine, supports PNG/JPEG/SVG with greater flexibility

#### **Common Process**

- Creates hidden iframe with full HTML (1080x1080px fixed dimensions)
- Waits 3.5 seconds for Google Fonts and styles to fully load
- Imports Montserrat and Inter fonts via Google Fonts API
- Sets fixed dimensions on html/body/deck/slide elements (1080x1080px)
- Queries `.slide` elements and exports each slide
- Downloads sequentially with 500ms delay between slides
- **Dimensions: 1080x1080px (1:1 square ratio)** - LinkedIn's optimal format for professional carousels (v4.0 refactor)

#### **html2canvas Engine** (`downloadImagesWithHTML2Canvas()`)

- Format: **JPEG** (quality 0.95)
- Scale: 3 (3x resolution for maximum quality)
- Optimized for html2canvas's strengths
- Configuration:
  - `useCORS: true` - Handle external resources
  - `allowTaint: true` - Allow mixed content
  - `windowHeight/windowWidth: 1350x1080` - Fixed viewport
- **Pros**: Fast, reliable, optimized compression
- **Cons**: Limited to JPEG

#### **html-to-image Engine** (`downloadImagesWithHTMLToImage()`)

- Format: **JPEG** (quality 0.95, pixelRatio 3)
- Configuration:
  - Direct DOM node to image conversion
  - Better CSS support than html2canvas
  - Cleaner API
- **Pros**: More flexible, better CSS handling
- **Cons**: Slightly slower, fewer options

#### **CSS Optimizations (v4.0 - Square Format Refactor)**

- **Removed webkit properties**: Eliminated `-webkit-background-clip` and `-webkit-text-fill-color`
  - Caused rendering issues with both engines
  - Replaced with solid colors for better compatibility
- **Solid colors used**: All text uses `color` property (not gradients)
- **Preview aspect ratio**: Fixed to 1:1 (square) with CSS `aspect-ratio`, scaled to 550px max width
- **Font size optimization for square** (v4.0 - Square Format):
  - `.slide-number`: 80px → 64px (optimized for compact space)
  - `.title`: 52px → 42px (fits 2 lines in square)
  - `.bullets`: 26px → 20px (ultra-readable in compact space)
  - `.bullets div::before`: 28px → 22px (proportional to bullets)
- **Spacing optimization for square** (v4.0):
  - `.slide` padding: 56px → 48px (compact, efficient use of space)
  - `.slide-header` gap: 24px → 20px (tighter header)
  - `.slide-header` margin-bottom: 32px → 24px (efficient flow)
  - `.title` margin-bottom: 28px → 20px (better space utilization)
  - `.bullets div` margin-bottom: 22px → 16px (compact content)
  - `.footer` padding-top: 32px → 20px (reduced footer space)
  - `.footer` font-size: 16px → 14px (smaller footer)
- **Line height adjustments**:
  - `.slide-number` line-height: 0.9 → 0.85 (very tight)
  - `.title` line-height: 1.2 → 1.15 (compact)
  - `.bullets` line-height: 1.9 → 1.75 (better density)
- **Result**: Content perfectly optimized for 1080x1080px square format with visual balance

### URL Content Extraction

- Jina AI Reader is external service - no authentication required
- Returns clean markdown content
- May fail for paywalled/restricted content
- Content combined with user text as "corpus" for AI

### Template Switching

- Can switch templates after generation without re-calling AI
- Re-renders HTML with new template styles using existing `slidesData`
- Preserves all content, only changes visual presentation

## Known Limitations

1. Brand customization (name/color) in settings is not connected to template renderer
2. No test suite currently implemented
3. No backend - all processing happens client-side
4. API key stored in localStorage (browser-only, not secure for production)
5. Google Fonts API dependency - fonts may not load in offline mode
6. ~~html2canvas has limitations with some CSS properties~~ **FIXED**: Removed webkit properties, using solid colors
7. html-to-image slightly slower than html2canvas (trade-off for flexibility)

## Common Tasks

**Adding a new template**:

1. Add template ID to type in `lib/types.ts`
2. Add template config to `TEMPLATES` array in `app/page.tsx`
3. Add CSS styles to `templateStyles` in `lib/template-renderer.tsx`
4. Add preview UI in template selection grid

**Modifying AI prompt**:

- Main prompt generation is in `app/page.tsx:generateCarousel` (lines ~450-515)
- Structured with sections: language, content strategy, configuration, audience targeting, copywriting practices, slide structure, quality criteria
- Uses template literals with dynamic instructions based on user settings

**Changing slide structure**:

- Update `Slide` interface in `lib/types.ts`
- Modify prompt to request new fields
- Update `renderCarouselHTML` to render new fields
- Update edit slide UI/prompt if needed

## Recent Changes (v3.0)

### Phase 1: CSS Refactor & Preview Fix

- **Removed webkit properties** that caused rendering issues:
  - `-webkit-background-clip: text` removed from `.slide-number`
  - `-webkit-text-fill-color: transparent` removed from `.title` (Template E)
- **Replaced with solid colors** for universal compatibility
- **Fixed preview aspect ratio**: Now uses CSS `aspect-ratio: 1080/1350` instead of `aspect-square`
- **Added info text** showing export dimensions below preview

### Phase 2: PNG → JPEG Migration

- **Changed default export format from PNG to JPEG** (quality 0.95)
- **JPEG benefits for html2canvas**:
  - Better gradient/shadow rendering
  - Automatic compression optimization
  - Smaller file sizes (15-20% smaller than PNG)
  - Better quality with html2canvas's limitations
- **Files now download as `.jpg` instead of `.png`**
- **Quality setting: 0.95** (maximum visual quality without artifacts)

### Phase 3: Dual Export Engine

- **Added `html-to-image` package** as alternative to html2canvas
- **Settings tab**: New "Exportar" (Export) configuration tab
- **User choice**: Select between:
  - **html2canvas (Default)**: JPEG, fast, reliable
  - **html-to-image**: More flexible, better CSS handling
- **Implementation**:
  - `downloadImagesWithHTML2Canvas()` - html2canvas engine
  - `downloadImagesWithHTMLToImage()` - html-to-image engine
  - `downloadImages()` - Smart router based on `exportEngine` localStorage setting
- **Persisted preference**: Engine choice saved in localStorage

### Architecture Changes

- **No legacy code**: All functions refactored, not patched
- **Modular design**: Easy to switch engines without breaking code
- **Iterative**: Users can experiment with different engines
- **Documented**: All engines documented in CLAUDE.md

### Phase 4: Preview Scaling & Content Distribution (v3.1)

- **Preview size**: Now limited to 450px max width (was full width)
- **Preview display**: Centered on page, maintains 4:5 aspect ratio
- **Download quality**: Unchanged (still 1080x1350px JPEG)
- **Font sizes**: Increased across all templates for better proportion
  - Slide numbers: 72→80px
  - Titles: 48→52px
  - Bullets: 22→26px
- **Spacing optimization**: Reduced padding and margins to fill vertical space
- **Result**: Preview is visually manageable, content fills download area properly

### Phase 5: Complete Square Format Refactor (v4.0)

#### **Overview**

Comprehensive refactor from 1080x1350px (4:5 portrait) to 1080x1080px (1:1 square) format based on analysis of successful LinkedIn carousels. All 5 templates redesigned, all AI prompts optimized, and entire system recalibrated for square aspect ratio.

#### **Motivation**

Analysis of successful professional LinkedIn carousel accounts (Citi, AIG, Zenrows, Data Science Infinity) revealed that 1:1 square format significantly outperforms 4:5 portrait format for:

- Visual presence and impact on the feed
- Reduced empty white space
- Better content density
- Higher engagement rates
- Native fit with LinkedIn's feed display

#### **Phase 5.1: Dimension Refactor** (`lib/template-renderer.tsx`)

- **HTML canvas**: 1080x1350px → 1080x1080px
- **All CSS dimensions**: Updated to square aspect ratio
- **Export dimensions**: 1080x1350px → 1080x1080px (both engines)
- **Preview aspect ratio**: 1080/1350 → 1/1 (perfect square)
- **Preview max-width**: 450px → 550px (better visibility)

#### **Phase 5.2: Template Redesign** (`lib/template-renderer.tsx`)

All 5 templates redesigned with:

- **Reduced font sizes** for compact square layout:
  - Slide numbers: 80px → 64px
  - Titles: 52px → 42px
  - Bullets: 26px → 20px
  - Bullets markers: 28px → 22px
- **Optimized spacing** for visual balance:
  - Slide padding: 56px → 48px
  - Header gap: 24px → 20px
  - Title margin: 28px → 20px
  - Footer padding: reduced from 32px → 20px
- **Simplified visual elements**:
  - Removed excessive shadows and gradients
  - Streamlined decorative elements
  - Maintained visual hierarchy in compact space
  - Template B: Border-left reduced 8px → 6px
  - Template D: Simplified icon styling
  - Template E: Gradient line reduced 6px → 4px

#### **Phase 5.3: AI Prompt Optimization** (`app/page.tsx`)

**Main Carousel Generation Prompt**:

- Added explicit 1080x1080px square format constraints
- Title guidelines: Max 2 lines (~50 characters)
- Bullet guidelines: Max 12 words EACH (ultra-concise)
- Copy length REDUCED:
  - Short: 150-200 → 100-150 words
  - Long: 300-400 → 200-250 words
- New emphasis: "Ultra-scannable format" - every word must add value
- Quality criteria updated for square format
- CRITICAL warning at prompt start about format constraints

**Slide Edit Prompt**:

- Updated with same square format constraints
- Emphasizes 12-word bullet limit in edit instructions
- Maintains all quality standards while respecting space limits

**Result**: AI generates content optimized for visual impact in 1080x1080px square, with ultra-concise, high-value content that fills space appropriately.

#### **Phase 5.4: Implementation Details**

- **No breaking changes**: All existing workflows function normally
- **Backwards compatible**: System generates same structure, just optimized dimensions
- **Tested**: npm run build ✓ (successful compile)
- **Export both engines**: html2canvas and html-to-image both support 1080x1080px JPEG
- **Hydration fixed**: localStorage access moved to useEffect hooks (prevents SSR mismatch)

#### **Phase 5.5: Files Modified**

1. `lib/template-renderer.tsx`: Dimensions, font sizes, spacing, all 5 templates
2. `app/page.tsx`:
   - Main generation prompt (copyLength, slideStructure, qualityCriteria, critical format warning)
   - Edit slide prompt (square format constraints)
   - Export functions (iframe dimensions 1080x1080px)
   - Preview container (aspect ratio 1/1, maxWidth 550px)
3. `CLAUDE.md`: Documentation updated with v4.0 changes

#### **Result**

Professional LinkedIn carousel generator optimized for 1080x1080px square format:

- ✅ All templates redesigned for square
- ✅ AI prompts optimized for concise, scannable content
- ✅ Export dimensions 1080x1080px with JPEG quality 0.95
- ✅ Preview scaled to 550px for better visualization
- ✅ Content perfectly balanced in square space
- ✅ No legacy code - clean, modern implementation

---

## v2: Canvas-Based Editor Architecture (2025)

### Overview

Version 2 represents a complete architectural shift from HTML/CSS rendering to a node-based canvas editor powered by Fabric.js 6. This enables full drag-and-drop editing, real-time canvas manipulation, and multimodal AI integration.

**Key Changes:**
- HTML templates → Canvas nodes
- html2canvas export → Native Fabric.js export
- Fixed templates → 7 narrative frameworks
- Static generation → Full post-generation editing

### Architecture v2

```
┌─────────────────────────────────────────────────────────┐
│ USER INPUT                                              │
│ - Source content (text/URLs)                            │
│ - Narrative framework selection                         │
│ - AI configuration (tone, audience, language, etc.)     │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ MULTIMODAL AI GENERATION (Gemini 2.5 Flash/Pro)        │
│ - Input: Template image (1080x1080px) + text prompt    │
│ - Output: Structured nodes with coordinates             │
│   {                                                     │
│     "slides": [                                         │
│       {                                                 │
│         "nodes": [                                      │
│           {                                             │
│             "type": "text",                             │
│             "content": "...",                           │
│             "x": 120, "y": 200,                         │
│             "fontSize": 64,                             │
│             "color": "#FFFFFF"                          │
│           }                                             │
│         ]                                               │
│       }                                                 │
│     ]                                                   │
│   }                                                     │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ CANVAS RENDERING (Fabric.js 6)                         │
│ - Convert nodes → Fabric objects                        │
│ - Render on 1080x1080px canvas                          │
│ - Apply template background                             │
│ - Enable drag & drop, resize, edit                      │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ EDITING (Optional - Power Users)                        │
│ - Full canvas editor with toolbars                      │
│ - Text: font, size, weight, color                       │
│ - Alignment: 9 position options                         │
│ - Add: text, emoji, images (URL or upload)              │
│ - Auto-save to sessionStorage                           │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ EXPORT (Native Fabric.js)                              │
│ - Batch export all slides to JPEG                       │
│ - Format: 1080x1080px, quality 0.95                     │
│ - Progress tracking                                     │
│ - Sequential download (500ms delay)                     │
└─────────────────────────────────────────────────────────┘
```

### File Structure v2

```
/app
  /v2
    /page.tsx                      # Main generator page
    /editor/[slideId]/page.tsx     # Canvas editor page
    
/components
  /v2
    /canvas-editor.tsx             # Fabric.js canvas wrapper
    /narrative-selector.tsx        # 7 narrative frameworks UI
    /ai-controls.tsx               # AI generation controls
    /slide-preview.tsx             # Thumbnail grid
    /toolbar/
      /text-toolbar.tsx            # Font, size, color controls
      /align-toolbar.tsx           # Position & alignment tools
      /add-toolbar.tsx             # Add elements (text, emoji, image)
      
/lib
  /v2
    /types.ts                      # Node, Slide, Project types
    /ai/
      /gemini-client.ts            # Multimodal API client
      /prompt-builder.ts           # Dynamic prompt generation
    /canvas/
      /fabric-utils.ts             # Node ↔ Fabric converters
      /export.ts                   # JPEG export functions
    /templates/
      /narrative-definitions.ts    # 7 narrative frameworks
    /storage.ts                    # Persistence utilities
```

### Core Components

#### 1. Narrative Frameworks (`lib/v2/templates/narrative-definitions.ts`)

Seven proven storytelling frameworks for LinkedIn carousels:

1. **PASP (Problem-Agitation-Solution-Proof)**
   - Best for: Direct sales, lead generation
   - Structure: Problem → Agitate → Solution → Proof
   - 7 slides

2. **BAB (Before-After-Bridge)**
   - Best for: Case studies, testimonials, ROI
   - Structure: Before → After → How to get there
   - 7 slides

3. **Step-by-Step Guide**
   - Best for: Educational content, tutorials
   - Structure: Title → 5 steps → Recap
   - 7 slides

4. **Data Storytelling**
   - Best for: Thought leadership, research
   - Structure: Question → 4 stats → Insight → Implications
   - 7 slides

5. **Listicle/Tips**
   - Best for: Viral content, quick wins
   - Structure: Title → 5 tips (emoji + title + bullets) → Bonus
   - 7 slides

6. **Behind-the-Scenes**
   - Best for: Personal branding, authenticity
   - Structure: Hook → 5 insights → Takeaway
   - 7 slides

7. **Case Study**
   - Best for: B2B, professional services
   - Structure: Client → Challenge → 3 strategies → Results → Lessons
   - 7 slides

Each framework includes:
- `promptInstructions`: Specific AI generation instructions
- `structure`: Slide-by-slide breakdown
- `bestFor`: Use case guidance
- `templateImage`: Paths to dark/light theme images

#### 2. Node System (`lib/v2/types.ts`)

All visual elements are represented as typed nodes:

**Node Types:**
- `TextNode`: content, fontSize, fontFamily, fontWeight, color, align, lineHeight
- `EmojiNode`: emoji, fontSize
- `ImageNode`: src, filters
- `ShapeNode`: shapeType (rect/circle/line), fill, stroke, strokeWidth

**Base Properties (all nodes):**
- `id`, `type`, `x`, `y`, `width`, `height`
- `rotation`, `opacity`, `zIndex`, `locked`

#### 3. Fabric.js Integration (`lib/v2/canvas/fabric-utils.ts`)

Bidirectional converters between Node types and Fabric objects:

**Key Functions:**
- `nodeToFabricObject(node)`: Convert node → Fabric.Text/Image/Rect/Circle
- `fabricObjectToNode(obj)`: Convert Fabric object → typed node
- `nodeToFabricImageAsync(node)`: Async image loading
- `fabricCanvasToNodes(canvas)`: Extract all nodes from canvas
- `setupGridSnapping(canvas, gridSize)`: Enable snap-to-grid (20px default)

#### 4. Canvas Editor (`components/v2/canvas-editor.tsx`)

Full-featured Fabric.js canvas with:
- Template background loading
- Real-time node rendering
- Modification tracking (object:modified, text:changed events)
- Grid snapping (optional, 20px grid)
- Global canvas reference for toolbar access

**Lifecycle:**
1. Initialize Fabric.Canvas (1080x1080px)
2. Load template as background image
3. Render all nodes as Fabric objects
4. Setup event listeners for modifications
5. Auto-save to storage on changes
6. Cleanup on unmount

#### 5. Toolbars

**Text Toolbar (`components/v2/toolbar/text-toolbar.tsx`):**
- Font family: Inter, Montserrat, Roboto, Playfair Display, Space Grotesk
- Font size: 12-200px
- Font weight: 300-900 (6 options)
- Color picker + hex input
- Delete selected element

**Align Toolbar (`components/v2/toolbar/align-toolbar.tsx`):**
- Text alignment: left, center, right
- Object positioning: 9 positions (left/center/right × top/middle/bottom)
- Canvas center: center both horizontally and vertically

**Add Toolbar (`components/v2/toolbar/add-toolbar.tsx`):**
- Add text: textarea input → new text node
- Add emoji: emoji input → new emoji node (large fontSize)
- Add image: URL input or file upload → new image node
- Auto-focus new elements after creation

#### 6. Export System (`lib/v2/canvas/export.ts`)

Native Fabric.js export (no html2canvas):

**Key Functions:**
- `exportSlideToJPEG(slide, filename)`: Export single slide
  - Creates temporary canvas
  - Loads template background
  - Renders all nodes
  - Exports to JPEG (quality 0.95)
  - Downloads file
  - Cleans up canvas

- `exportAllSlides(slides, onProgress)`: Batch export
  - Sequential export with progress tracking
  - 500ms delay between downloads
  - Continues on individual failures

- `getSlidePreview(slide)`: Generate thumbnail
  - Exports at 0.25x scale (270x270px)
  - Lower quality (0.8) for faster generation

#### 7. Storage System (`lib/v2/storage.ts`)

Persistence utilities:

**Session Storage (navigation state):**
- `saveSlides(slides)`: Store slides for editor navigation
- `loadSlides()`: Load slides in editor
- `updateSlide(slideId, updatedSlide)`: Auto-save modifications

**Local Storage (projects):**
- `saveCurrentProject(project)`: Current project state
- `loadCurrentProject()`: Restore project
- `saveToProjectsList(project)`: Add to recent projects (keep last 10)
- `loadProjectsList()`: Get recent projects
- `createProject(...)`: Create new Project object

### Multimodal AI Integration

#### Prompt Structure (`lib/v2/ai/prompt-builder.ts`)

Dynamic prompt generation with narrative-specific instructions:

**Input to Gemini:**
1. Template image (base64-encoded PNG)
2. Comprehensive text prompt including:
   - Template analysis instructions
   - Narrative framework guidelines
   - Content requirements (corpus, language, tone, audience)
   - Output JSON schema with example
   - Typography constraints (fontSize ranges)
   - Quality checklist

**Output from Gemini:**
```json
{
  "slides": [
    {
      "nodes": [
        {
          "id": "title-1",
          "type": "text",
          "content": "Your Title",
          "x": 120, "y": 200,
          "width": 840, "height": 150,
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
  "postCopy": "LinkedIn post copy...",
  "hashtags": ["#relevant", "#hashtags"]
}
```

#### API Client (`lib/v2/ai/gemini-client.ts`)

**Key Features:**
- Model selection: gemini-2.5-flash (default) or gemini-2.5-pro
- Temperature: 0.7, Max tokens: 8000
- Multimodal input: image + text in single request
- Response validation: ensures nodes fit within canvas bounds
- Node sanitization: validates coordinates, fontSize, colors
- Error handling: detailed logging, graceful fallbacks

**Validation:**
- Coordinates: x,y within 0-1080
- Dimensions: width,height positive and within canvas
- Font size: 12-200px
- Opacity: 0-1
- Colors: valid hex/rgb/rgba

### User Flows

#### One-Shot Flow (80% of users)

1. Select narrative framework
2. Paste content or add URLs
3. Configure AI settings (language, tone, audience)
4. Click "Generate Carousel"
5. AI generates 7 slides with coordinates
6. Preview thumbnails appear
7. Click "Download All Slides (JPEG)"
8. Done (7 JPEGs downloaded)

**Time:** 30-60 seconds total

#### Power User Flow (20% of users)

1-6. Same as One-Shot
7. Click "Edit" on specific slide
8. Opens canvas editor with Fabric.js
9. Drag elements, resize, change text
10. Adjust fonts, colors, alignment
11. Add emojis or images
12. Click "Save Changes"
13. Back to preview, click "Download All"
14. Done (with customizations)

**Time:** 3-10 minutes total

### Technical Specifications

**Canvas:**
- Size: 1080x1080px (1:1 square ratio)
- Background: Template PNG image
- Objects: Fabric.Text, Fabric.Image, Fabric.Rect, Fabric.Circle
- Grid: 20px snap-to-grid (optional)

**Export:**
- Format: JPEG
- Quality: 0.95 (95%)
- Multiplier: 1x (full resolution)
- Method: Fabric.Canvas.toDataURL()

**Typography:**
- Fonts: Inter, Montserrat, Roboto, Playfair Display, Space Grotesk
- Sizes: Title 52-72px, Body 24-36px, Bullets 28-40px, Numbers 80-120px
- Weights: 300, 400, 500, 600, 700, 900
- Line height: 1.2-1.7 (varies by type)

**Performance:**
- Generation: 10-30 seconds (depends on Gemini API)
- Canvas rendering: <100ms per slide
- Export: ~500ms per slide
- Storage: sessionStorage (slides), localStorage (projects)

### Known Limitations v2

1. **Template images required:** Designer must create 14 PNG files (7 narratives × 2 themes)
2. **No undo/redo in canvas:** Fabric.js history not implemented yet
3. **No collaborative editing:** Single-user only
4. **Session storage only:** No database persistence (by design for internal tool)
5. **Font loading:** System fonts only (no Google Fonts integration yet)
6. **Image CORS:** External images must support CORS for canvas export
7. **Browser-only:** No server-side rendering for canvas operations

### Future Enhancements (Backlog)

1. **Undo/Redo:** Implement history tracking in canvas editor
2. **Layers panel:** Visual z-index management
3. **Alignment guides:** Show snap lines when objects align
4. **Template builder:** UI for creating custom templates without code
5. **Project management:** Full CRUD for saved projects
6. **Export formats:** PNG, SVG export options
7. **Animation:** Fade-in/slide-in effects for presentations
8. **Collaboration:** Real-time multi-user editing (Socket.io)

### Migration Path (v1 → v2)

**For users:**
- v1 and v2 are independent (no migration needed)
- v1 remains accessible at `/` (app/page.tsx)
- v2 accessible at `/v2` (app/v2/page.tsx)
- Settings page shared (app/settings/page.tsx)

**For developers:**
- v1 code unchanged in `/app/page.tsx`, `/lib/template-renderer.tsx`
- v2 code isolated in `/app/v2`, `/lib/v2`, `/components/v2`
- Shared utilities: `/lib/fetch-url-content.ts`, `/lib/safe-extract-json.ts`
- No breaking changes to existing v1 functionality

### Testing v2

**Manual Testing Checklist:**
1. Generate carousel with each narrative framework
2. Edit slide in canvas editor
3. Test all toolbar functions (text, align, add)
4. Export all slides to JPEG
5. Verify exported dimensions (1080x1080px)
6. Test navigation (v2 → editor → back to v2)
7. Test auto-save (edit → back → edit again, changes persist)
8. Test with different themes (dark/light)
9. Test with URLs fetching (Jina AI Reader)
10. Test with all 5 fonts

**Browser Compatibility:**
- Chrome/Edge: Full support (primary target)
- Safari: Full support (webkit canvas APIs)
- Firefox: Full support

### Deployment Notes

**Build:**
```bash
npm run build --webpack  # Force webpack (Fabric.js requires it)
```

**Environment:**
- No server-side dependencies
- All processing client-side
- API keys in localStorage (browser-only)
- Gemini API key required (user provides in Settings)

**Performance:**
- First load: ~500KB JS bundle (Fabric.js is large)
- Canvas operations: GPU-accelerated (smooth at 60fps)
- Export operations: Async with progress tracking (no UI freeze)

---

## Recommended Workflow for Claude Code

When working on this project:

1. **For v1 (legacy)**: Edit files in `/app/page.tsx`, `/lib/template-renderer.tsx`
2. **For v2 (canvas)**: Edit files in `/app/v2`, `/lib/v2`, `/components/v2`
3. **Shared utilities**: Edit `/lib/fetch-url-content.ts`, `/lib/safe-extract-json.ts`
4. **Always format before commit**: `npm run format`
5. **Test build before deploy**: `npm run build --webpack`
6. **Document changes**: Update this file (CLAUDE.md) for significant changes

