# LinkedIn Carousel Template Generation Guide

**Using Gemini Imagen 3 ("Nano Banana") to Generate 1080x1080px Templates**

This guide documents how to generate professional LinkedIn carousel templates using Google's Gemini Imagen 3 API. Each of the 7 narrative frameworks requires a unique visual style optimized for 1080x1080px square format.

---

## Table of Contents

1. [Setup & Configuration](#setup--configuration)
2. [API Usage Methods](#api-usage-methods)
3. [Template Design Principles](#template-design-principles)
4. [Prompts for Each Narrative Framework](#prompts-for-each-narrative-framework)
5. [Batch Generation Scripts](#batch-generation-scripts)
6. [Post-Processing Guidelines](#post-processing-guidelines)

---

## Setup & Configuration

### Prerequisites

- **Gemini API Key**: Get yours at [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Python 3.10+** (for Python SDK)
- **Node.js 18+** (for CLI tool)
- **Budget**: $0.03 per image (Imagen 3 pricing)

### Install Required Tools

#### Option 1: Python SDK

```bash
pip install google-genai pillow
```

#### Option 2: Gemini CLI (Recommended)

```bash
npm install -g @google/generative-ai-cli
```

### Environment Setup

```bash
# Set your API key
export GEMINI_API_KEY="your-api-key-here"

# Or use dotenv file
echo "GEMINI_API_KEY=your-api-key-here" > .env
```

---

## API Usage Methods

### Method 1: Python Script (Recommended for Batch)

```python
from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO

# Initialize client
client = genai.Client(api_key='YOUR_API_KEY')

# Generate image
response = client.models.generate_images(
    model='imagen-3.0-generate-002',
    prompt='your prompt here',
    config=types.GenerateImagesConfig(
        number_of_images=1,
        aspect_ratio='1:1',  # Square format for LinkedIn
        safety_filter_level='block_some',
        person_generation='allow_all'
    )
)

# Save image
for i, image in enumerate(response.generated_images):
    img = Image.open(BytesIO(image.image.image_bytes))
    img.save(f'template-{i}.png')
```

### Method 2: Gemini 2.5 Flash Image (Alternative)

```python
# Use conversational model that also generates images
client = genai.Client(api_key='YOUR_API_KEY')

response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents='Generate a professional LinkedIn carousel template...',
    config=types.GenerateContentConfig(
        temperature=0.7,
        response_modalities=['IMAGE']
    )
)
```

### Method 3: REST API (cURL)

```bash
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict" \
  -H "Content-Type: application/json" \
  -H "x-goog-api-key: ${GEMINI_API_KEY}" \
  -d '{
    "instances": [{
      "prompt": "your prompt here"
    }],
    "parameters": {
      "sampleCount": 1,
      "aspectRatio": "1:1"
    }
  }'
```

---

## Template Design Principles

### Universal Requirements (All Templates)

- **Format**: 1080x1080px (1:1 square ratio)
- **Quality**: High-resolution, professional finish
- **Color depth**: Rich, vibrant colors suitable for LinkedIn
- **Typography space**: Clear areas for text overlays
- **Branding**: Minimal, non-distracting background elements
- **Accessibility**: Sufficient contrast for readability

### Visual Hierarchy

Each template should have designated zones:

1. **Header zone** (top 200px): Slide numbers, small branding
2. **Title zone** (200-400px from top): Main headline area
3. **Content zone** (middle 400-600px): Bullets, body text, data
4. **Footer zone** (bottom 150px): Branding, CTAs

### Design Themes

**Dark Theme Templates** (`-dark.png`):
- Background: Deep navy (#0B0B0E), charcoal, or dark gradient
- Accents: Vibrant colors that pop on dark (electric blue, magenta, neon green)
- Text areas: Ensure high contrast zones (lighter sections for dark text)

**Light Theme Templates** (`-light.png`):
- Background: Clean white (#FFFFFF), soft grays, or subtle gradients
- Accents: Professional colors (corporate blues, warm oranges, modern purples)
- Text areas: Subtle texture acceptable, maintain readability

---

## Prompts for Each Narrative Framework

### 1. PASP Framework (Problem-Agitation-Solution-Proof)

**Purpose**: Direct sales, lead generation, urgency marketing
**Visual Style**: Bold, urgent, attention-grabbing

#### Dark Theme Prompt

```
Create a professional LinkedIn carousel template background, 1080x1080px square format, dark theme.

Design style:
- Deep navy blue to black gradient background (#0B0B0E to #15151A)
- Bold magenta accent line on the left edge (8px width, #BB2649 color)
- Subtle red/orange gradient glow in bottom-right corner suggesting urgency
- Clean geometric shapes (rectangles, subtle diagonals) that create visual tension
- Modern, tech-forward aesthetic with sharp edges

Layout zones:
- Top-left: Small circle for slide number (80px diameter)
- Center-left: Large clear area for headline text (600x200px)
- Middle: Space for 3-4 bullet points with breathing room
- Bottom-right: Small area for brand logo/text

Mood: Urgent but professional, action-oriented, creates FOMO
Color palette: Dark blues, electric magenta, subtle orange accents
Typography friendly: High contrast zones, no busy patterns in text areas
```

#### Light Theme Prompt

```
Create a professional LinkedIn carousel template background, 1080x1080px square format, light theme.

Design style:
- Clean white background (#FFFFFF) with soft gray gradients
- Warm orange accent bar on left edge (8px, #FF6B35)
- Subtle geometric shapes suggesting forward movement (arrows, chevrons)
- Professional, modern corporate aesthetic
- Small red warning-style accent elements (not overwhelming)

Layout zones:
- Top-left: Space for numbered badge (80px circle)
- Center: Large headline area (700x250px) with subtle background tint
- Middle: 3-4 bullet zones with clean separation
- Bottom: Branding footer area

Mood: Professional urgency, trustworthy, action-driving
Color palette: White base, warm oranges, corporate blues, accent red
Typography friendly: Clean, high-contrast, minimal noise
```

---

### 2. BAB Framework (Before-After-Bridge)

**Purpose**: Case studies, ROI, transformations, testimonials
**Visual Style**: Contrast, transformation, visual split

#### Dark Theme Prompt

```
Create a professional LinkedIn carousel template background, 1080x1080px square format, dark theme for transformation stories.

Design style:
- Split design: Left half darker (#0B0B0E), right half slightly lighter (#1A1A24)
- Diagonal split line with gradient glow effect (represents transformation bridge)
- Subtle arrow or forward-pointing elements suggesting progress
- Modern gradient overlays (dark purple to dark blue)
- Clean, inspiring aesthetic

Layout zones:
- Top-center: Slide number badge
- Left side: "Before" state text area (400x600px) with darker tone
- Right side: "After" state text area (400x600px) with hope/lighter tone
- Center diagonal: Visual bridge element
- Bottom: Small branding area

Mood: Inspirational, transformative, hopeful yet grounded
Color palette: Dark blues, purple gradients, gold/yellow accents for "after"
Typography friendly: Clear split zones, high contrast
Visual metaphor: Journey from dark (problem) to light (solution)
```

#### Light Theme Prompt

```
Create a professional LinkedIn carousel template background, 1080x1080px square format, light theme for transformation stories.

Design style:
- Soft gradient from cool gray (left) to warm beige/cream (right)
- Subtle vertical split with elegant divider line
- Upward-pointing arrow or growth chart elements in background (very subtle)
- Professional, optimistic color transitions
- Clean corporate aesthetic with warmth

Layout zones:
- Top: Centered slide number
- Left panel: Before state (cooler tones, subtle texture)
- Right panel: After state (warmer tones, cleaner feel)
- Center: Bridge/transition zone
- Bottom: Results metrics area

Mood: Professional optimism, credible transformation, measurable success
Color palette: Cool grays, warm creams, success green, corporate blue
Typography friendly: Distinct zones with smooth transitions
```

---

### 3. Step-by-Step Guide (How-To Educational)

**Purpose**: Tutorials, educational content, guides
**Visual Style**: Clear, organized, progressive

#### Dark Theme Prompt

```
Create a professional LinkedIn carousel template background, 1080x1080px square format, dark theme for educational step-by-step content.

Design style:
- Clean dark background (#0B0B0E) with subtle grid or dotted pattern
- Numbered step indicators integrated into design (1→2→3 progression)
- Horizontal progress bar or step markers across top
- Modern, tech-tutorial aesthetic
- Subtle blue accent color suggesting learning/knowledge (#4A90E2)
- Clear section divisions for organized content

Layout zones:
- Top: Progress indicator showing step X of 5 (thin bar or dots)
- Top-left: Large step number (150x150px) in accent color
- Center-right: Main instruction area (700x400px) very clean
- Bottom-left: Small tip/note callout box (300x150px)
- Bottom-right: Brand footer

Mood: Educational, clear, encouraging, trustworthy like a teacher
Color palette: Dark background, electric blue accents, white text zones
Typography friendly: Maximum clarity, organized hierarchy, breathing room
Visual language: Numbers, checkmarks, progression indicators
```

#### Light Theme Prompt

```
Create a professional LinkedIn carousel template background, 1080x1080px square format, light theme for educational how-to content.

Design style:
- Soft white/cream background (#F8F9FA)
- Subtle numbered pathway or roadmap design element
- Step badges (numbered circles) with friendly color (teal/green)
- Clean, textbook-inspired layout with helpful visual cues
- Minimal distractions, maximum focus on content
- Small iconography suggesting learning (book, lightbulb outlines)

Layout zones:
- Top: Step progress breadcrumb trail
- Left: Bold step number in circle (120x120px)
- Right: Large instruction area (750x500px)
- Bottom-left: Pro tip callout (subtle background color)
- Bottom-right: Brand/resources link area

Mood: Friendly educator, approachable, confidence-building
Color palette: Soft neutrals, teal/green success colors, navy text areas
Typography friendly: Clean sections, clear hierarchy, no clutter
```

---

### 4. Data Storytelling (Insights from Research)

**Purpose**: Thought leadership, research, statistics
**Visual Style**: Data-driven, authoritative, visual charts

#### Dark Theme Prompt

```
Create a professional LinkedIn carousel template background, 1080x1080px square format, dark theme for data storytelling and statistics.

Design style:
- Sophisticated dark gradient (#0A0E27 to #1A1F3A) suggesting analytics dashboard
- Subtle data visualization elements (line graphs, bar chart silhouettes) in background
- Grid pattern overlay (very subtle, 20px squares) like graph paper
- Modern tech/analytics aesthetic with geometric precision
- Accent color for highlighting key metrics (#00D9FF electric cyan)
- Professional, authoritative visual language

Layout zones:
- Top-center: Context/question header (800x150px)
- Center: MASSIVE number display area (600x300px) for key stat
- Bottom-left: Source citation area (400x100px)
- Bottom-right: Data point context (400x150px)
- Corners: Subtle chart/graph accent elements

Mood: Authoritative, data-driven, insightful, trustworthy analyst
Color palette: Deep blues/purples, electric cyan, chart greens/reds
Typography friendly: Giant number zone, clean supporting text areas
Visual elements: Graphs, percentage symbols, trend lines (subtle)
```

#### Light Theme Prompt

```
Create a professional LinkedIn carousel template background, 1080x1080px square format, light theme for data presentations.

Design style:
- Clean white base (#FFFFFF) with subtle gray grid (5% opacity)
- Infographic-style layout with data visualization elements
- Professional chart colors (blue bars, green growth indicators)
- Subtle shadow/depth for data callout boxes
- Modern, editorial data journalism aesthetic
- Geometric precision and alignment

Layout zones:
- Top: Research question or hypothesis area
- Center: Dominant statistic display (700x350px) with bold typography
- Left/Right: Supporting data points or trend indicators
- Bottom: Source attribution and context
- Accent areas: Small chart/icon elements

Mood: Research-backed, credible, insightful, data journalism quality
Color palette: White base, corporate blues, data viz colors (green/orange/purple)
Typography friendly: Clear hierarchy, prominent number displays
```

---

### 5. Listicle/Tips (Quick Wins)

**Purpose**: Viral content, engagement, practical tips
**Visual Style**: Energetic, scannable, emoji-friendly

#### Dark Theme Prompt

```
Create a professional LinkedIn carousel template background, 1080x1080px square format, dark theme for quick tips and listicles.

Design style:
- Vibrant dark background with energetic gradient (#1A0B2E to #0F0A1F)
- Bold accent strips or geometric shapes suggesting list items
- Fun, modern aesthetic with personality (not corporate boring)
- Colorful accent elements (pink, yellow, cyan) for visual interest
- Space designed for emoji integration (large emoji zones)
- Dynamic, scroll-stopping visual energy

Layout zones:
- Top-left: List number badge (Tip 1 of 5) in bright accent color
- Left: Large emoji area (200x200px) for visual anchor
- Right: Tip title and 2-3 bullet points (700x500px)
- Bottom: Small CTA or teaser for next tip
- Accent: Colorful geometric shapes, not overwhelming

Mood: Energetic, helpful, friendly colleague sharing hacks
Color palette: Dark purple/navy, neon accents (pink #FF006E, cyan #00F5FF, yellow #FFD60A)
Typography friendly: Clear sections, emoji-safe zones
Visual language: Lists, checkmarks, number badges, emoji placeholders
```

#### Light Theme Prompt

```
Create a professional LinkedIn carousel template background, 1080x1080px square format, light theme for viral tips content.

Design style:
- Bright, cheerful white background with playful accent colors
- List-style visual indicators (checkmarks, number badges, bullet points)
- Friendly, approachable aesthetic with subtle patterns
- Colorful accent blocks or speech-bubble style elements
- Modern, Instagram-friendly visual language
- Space for large emoji displays

Layout zones:
- Top: "Tip X of 5" banner with fun color
- Left column: Emoji showcase area (250x250px)
- Right column: Tip headline + bullets (650x500px)
- Bottom: Engagement prompt (share this!, save for later!)
- Decorative: Small doodles, stars, sparkles (subtle)

Mood: Fun, helpful, shareable, best-friend-sharing-tips vibe
Color palette: White base, rainbow accents (coral, mint, lavender, sunshine yellow)
Typography friendly: Clean, punchy, emoji-integrated
```

---

### 6. Behind-the-Scenes (Personal Insights)

**Purpose**: Personal branding, authenticity, connection
**Visual Style**: Authentic, warm, conversational

#### Dark Theme Prompt

```
Create a professional LinkedIn carousel template background, 1080x1080px square format, dark theme for personal behind-the-scenes insights.

Design style:
- Warm dark background (charcoal #1C1C1E with warm undertones)
- Subtle handwritten-style accent elements (underlines, circles, arrows)
- Personal journal or notebook aesthetic (but professional)
- Intimate, authentic visual language
- Soft spotlight or vignette effect drawing attention to center
- Human, not corporate - feels like a conversation

Layout zones:
- Top: Personal insight number or "What I learned" header
- Center: Large quote-style text area (750x400px) for main insight
- Left margin: Handwritten-style notes or callouts
- Bottom: Personal signature or authentic closer
- Accent: Subtle sketched elements, human touches

Mood: Authentic, vulnerable, trusted friend sharing wisdom
Color palette: Warm charcoals, soft gold accents, handwritten white
Typography friendly: Quote-style layouts, conversational spacing
Visual language: Notebooks, highlights, underlines, human sketches
```

#### Light Theme Prompt

```
Create a professional LinkedIn carousel template background, 1080x1080px square format, light theme for authentic personal stories.

Design style:
- Soft cream/beige background (#F5F1E8) like aged paper
- Subtle coffee stain rings or texture (very light)
- Handwritten accent marks (highlighter yellow, pen underlines)
- Personal notebook or blog post aesthetic
- Warm, inviting, authentic feel
- Polaroid-frame style accent boxes

Layout zones:
- Top: "What nobody tells you about..." headline area
- Center: Main insight in quote-box style (700x450px)
- Margins: Handwritten-style annotations or emoji reactions
- Bottom: Personal takeaway or invitation to discuss
- Decorative: Subtle coffee cup, notebook spiral, human elements

Mood: Warm, authentic, coffee-chat with a friend vibe
Color palette: Cream/beige base, warm browns, highlighter yellow, handwritten black
Typography friendly: Conversational layouts, quote-friendly
```

---

### 7. Case Study (Client Success Story)

**Purpose**: B2B, professional services, authority demonstration
**Visual Style**: Professional, results-focused, credible

#### Dark Theme Prompt

```
Create a professional LinkedIn carousel template background, 1080x1080px square format, dark theme for B2B case studies.

Design style:
- Sophisticated navy/charcoal gradient (#0D1B2A to #1B263B)
- Corporate professional aesthetic with subtle geometric patterns
- Success-indicating accent color (gold #C9A961 or growth green)
- Chart/graph elements suggesting metrics and results
- Clean, boardroom-presentation quality
- Subtle grid or measurement indicators

Layout zones:
- Top: Client name/industry badge (anonymized template)
- Left: Challenge/Situation section (400x500px)
- Right: Results metrics area (500x500px) with number displays
- Center: Strategy breakdown with step indicators
- Bottom: ROI summary or key lesson banner

Mood: Professional confidence, credible expertise, outcome-focused
Color palette: Navy/charcoal, success gold, metric green, corporate blue
Typography friendly: Executive summary layouts, metric displays
Visual elements: Growth charts, ROI indicators, success badges
```

#### Light Theme Prompt

```
Create a professional LinkedIn carousel template background, 1080x1080px square format, light theme for professional case studies.

Design style:
- Clean white background with subtle corporate gray accents (#F8F9FA)
- Professional presentation deck aesthetic
- Chart/infographic elements for metrics (bar charts, growth curves)
- Success-oriented color accents (green for growth, blue for trust)
- Boardroom-ready, shareable visual quality
- Timeline or process flow indicators

Layout zones:
- Top: Case study header with client badge
- Left column: Challenge metrics (before state)
- Right column: Results metrics (after state)
- Center: 3-step strategy breakdown
- Bottom: Key lesson or transferable insight
- Accent: Small chart/graph elements

Mood: Professional authority, results-driven, consultative expertise
Color palette: White base, corporate blues, success greens, metric charts
Typography friendly: Executive summary style, clear metric displays
```

---

## Batch Generation Scripts

### Python Script: Generate All Templates

```python
#!/usr/bin/env python3
"""
Generate all 14 LinkedIn carousel templates (7 frameworks × 2 themes)
Using Gemini Imagen 3 API
"""

import os
from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO
import time

# Configuration
API_KEY = os.getenv('GEMINI_API_KEY')
OUTPUT_DIR = './public/templates'
MODEL = 'imagen-3.0-generate-002'

# Template definitions
TEMPLATES = {
    'pasp': {
        'dark': """[Dark theme prompt for PASP from above]""",
        'light': """[Light theme prompt for PASP from above]"""
    },
    'bab': {
        'dark': """[Dark theme prompt for BAB from above]""",
        'light': """[Light theme prompt for BAB from above]"""
    },
    'step-by-step': {
        'dark': """[Dark theme prompt for Step-by-Step from above]""",
        'light': """[Light theme prompt for Step-by-Step from above]"""
    },
    'data-storytelling': {
        'dark': """[Dark theme prompt for Data Storytelling from above]""",
        'light': """[Light theme prompt for Data Storytelling from above]"""
    },
    'listicle': {
        'dark': """[Dark theme prompt for Listicle from above]""",
        'light': """[Light theme prompt for Listicle from above]"""
    },
    'behind-the-scenes': {
        'dark': """[Dark theme prompt for BTS from above]""",
        'light': """[Light theme prompt for BTS from above]"""
    },
    'case-study': {
        'dark': """[Dark theme prompt for Case Study from above]""",
        'light': """[Light theme prompt for Case Study from above]"""
    }
}

def generate_template(framework_id, theme, prompt):
    """Generate a single template using Imagen 3"""
    print(f"Generating {framework_id}-{theme}.png...")

    client = genai.Client(api_key=API_KEY)

    try:
        response = client.models.generate_images(
            model=MODEL,
            prompt=prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio='1:1',
                safety_filter_level='block_some',
                person_generation='block_all'  # No people in templates
            )
        )

        # Save image
        for image in response.generated_images:
            img = Image.open(BytesIO(image.image.image_bytes))

            # Ensure 1080x1080px
            if img.size != (1080, 1080):
                img = img.resize((1080, 1080), Image.Resampling.LANCZOS)

            filename = f"{framework_id}-{theme}.png"
            filepath = os.path.join(OUTPUT_DIR, filename)
            img.save(filepath, 'PNG', optimize=True)

            print(f"✓ Saved {filename}")
            return True

    except Exception as e:
        print(f"✗ Error generating {framework_id}-{theme}: {e}")
        return False

def main():
    """Generate all templates with rate limiting"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    total = len(TEMPLATES) * 2  # 7 frameworks × 2 themes
    completed = 0

    print(f"Starting generation of {total} templates...")
    print(f"Estimated cost: ${total * 0.03:.2f}")
    print("-" * 60)

    for framework_id, themes in TEMPLATES.items():
        for theme, prompt in themes.items():
            if generate_template(framework_id, theme, prompt):
                completed += 1

            # Rate limiting: Wait 2 seconds between requests
            time.sleep(2)

    print("-" * 60)
    print(f"Completed: {completed}/{total} templates")
    print(f"Total cost: ${completed * 0.03:.2f}")

if __name__ == '__main__':
    main()
```

### Usage

```bash
# Set API key
export GEMINI_API_KEY="your-api-key-here"

# Run generation script
python generate_templates.py

# Output: 14 PNG files in ./public/templates/
# - pasp-dark.png, pasp-light.png
# - bab-dark.png, bab-light.png
# - step-by-step-dark.png, step-by-step-light.png
# - data-storytelling-dark.png, data-storytelling-light.png
# - listicle-dark.png, listicle-light.png
# - behind-the-scenes-dark.png, behind-the-scenes-light.png
# - case-study-dark.png, case-study-light.png
```

---

## Post-Processing Guidelines

### Quality Checks

After generation, verify each template:

1. **Dimensions**: Exactly 1080×1080px
2. **File size**: < 500KB for web performance
3. **Contrast**: Text zones have sufficient contrast
4. **Branding**: No conflicting logos or elements
5. **Consistency**: Dark/light pairs feel cohesive

### Manual Adjustments (Optional)

Use Photoshop/Figma if needed:

- Add subtle texture overlays
- Fine-tune brand colors
- Add logo placeholder zones
- Adjust contrast in text areas
- Export optimized PNGs

### Optimization

```bash
# Optimize PNGs with pngquant
pngquant --quality=80-95 --ext .png --force ./public/templates/*.png

# Or use ImageOptim (macOS)
open -a ImageOptim ./public/templates/
```

---

## Additional Resources

- **Imagen 3 Docs**: https://ai.google.dev/gemini-api/docs/imagen
- **Gemini CLI**: https://github.com/google-gemini/gemini-cli
- **Pricing**: https://ai.google.dev/pricing
- **Best Practices**: https://ai.google.dev/gemini-api/docs/vision

---

## Troubleshooting

### Common Issues

**API Key Error**
```
Error: Invalid API key
Solution: Verify key at https://aistudio.google.com/app/apikey
```

**Safety Filter Blocked**
```
Error: Image generation blocked by safety filter
Solution: Adjust prompt to be more professional, avoid sensitive terms
```

**Wrong Dimensions**
```
Issue: Generated image is not 1080x1080px
Solution: Use aspect_ratio='1:1' parameter and resize with PIL if needed
```

**Quota Exceeded**
```
Error: Quota limit reached
Solution: Wait for quota reset or upgrade to paid tier
```

---

## Version History

- **v1.0** (2025-01-XX): Initial template generation guide
- Model: Imagen 3.0 (`imagen-3.0-generate-002`)
- Framework count: 7 narrative styles × 2 themes = 14 templates

---

**Happy template generating! 🎨**

For questions or issues, check the [Gemini API documentation](https://ai.google.dev/gemini-api/docs) or create an issue in this repo.
