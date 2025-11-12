"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Key, Palette, Zap, Save, CheckCircle2, ExternalLink, Download } from "lucide-react"

// Default theme colors matching template-renderer.tsx
const DEFAULT_DARK_COLORS = {
  bg: "#0B0B0E",
  surf: "#15151A",
  txt: "#EAEAF0",
  mut: "#B9B9C6",
  pri: "#BB2649",
  border: "#2A2A33",
}

const DEFAULT_LIGHT_COLORS = {
  bg: "#FFFFFF",
  surf: "#F5F5F7",
  txt: "#1A1A1A",
  mut: "#666666",
  pri: "#BB2649",
  border: "#E0E0E0",
}

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("")
  const [brandName, setBrandName] = useState("h14z.io")
  const [brandColor, setBrandColor] = useState("#BB2649")
  const [geminiModel, setGeminiModel] = useState("gemini-2.5-flash")
  const [exportEngine, setExportEngine] = useState("dom-to-image")
  const [darkColors, setDarkColors] = useState(DEFAULT_DARK_COLORS)
  const [lightColors, setLightColors] = useState(DEFAULT_LIGHT_COLORS)
  const [saved, setSaved] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load saved settings from localStorage
    const savedApiKey = localStorage.getItem("geminiApiKey") || ""
    const savedBrandName = localStorage.getItem("brandName") || "h14z.io"
    const savedBrandColor = localStorage.getItem("brandColor") || "#BB2649"
    const savedGeminiModel = localStorage.getItem("geminiModel") || "gemini-2.5-flash"
    const savedExportEngine = localStorage.getItem("exportEngine") || "html2canvas"

    // Load theme colors
    const savedDarkColors = localStorage.getItem("darkColors")
    const savedLightColors = localStorage.getItem("lightColors")

    setApiKey(savedApiKey)
    setBrandName(savedBrandName)
    setBrandColor(savedBrandColor)
    setGeminiModel(savedGeminiModel)
    setExportEngine(savedExportEngine)

    if (savedDarkColors) {
      try {
        setDarkColors(JSON.parse(savedDarkColors))
      } catch (e) {
        console.error("Error parsing dark colors:", e)
      }
    }

    if (savedLightColors) {
      try {
        setLightColors(JSON.parse(savedLightColors))
      } catch (e) {
        console.error("Error parsing light colors:", e)
      }
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("geminiApiKey", apiKey)
    localStorage.setItem("brandName", brandName)
    localStorage.setItem("brandColor", brandColor)
    localStorage.setItem("geminiModel", geminiModel)
    localStorage.setItem("exportEngine", exportEngine)
    localStorage.setItem("darkColors", JSON.stringify(darkColors))
    localStorage.setItem("lightColors", JSON.stringify(lightColors))

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground">
            <Settings className="h-8 w-8" />
            Configuración
          </h1>
          <p className="mt-2 text-muted-foreground">Configura tu API key y personaliza la identidad de tu marca</p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Tabs defaultValue="api" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="api" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                API Key
              </TabsTrigger>
              <TabsTrigger value="model" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Modelo IA
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </TabsTrigger>
              <TabsTrigger value="themes" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Temas
              </TabsTrigger>
              <TabsTrigger value="brand" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Marca
              </TabsTrigger>
            </TabsList>

            <TabsContent value="api" className="space-y-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Google Gemini API Key</CardTitle>
                  <CardDescription>
                    Necesitas una API key de Google Gemini para generar carruseles con IA
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="AIzaSy..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="bg-secondary font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Tu API key se guarda localmente en tu navegador y nunca se comparte
                    </p>
                  </div>

                  <Alert className="border-primary/20 bg-primary/5">
                    <Key className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-sm">
                      <p className="mb-2 font-medium text-foreground">¿Cómo obtener tu API key?</p>
                      <ol className="ml-4 list-decimal space-y-1 text-muted-foreground">
                        <li>
                          Visita{" "}
                          <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            Google AI Studio
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </li>
                        <li>Inicia sesión con tu cuenta de Google</li>
                        <li>Haz clic en "Create API Key"</li>
                        <li>Copia la key y pégala arriba</li>
                      </ol>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="model" className="space-y-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Modelo de IA Gemini</CardTitle>
                  <CardDescription>
                    Elige entre los modelos disponibles de Google Gemini para generar tus carruseles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="gemini-model">Seleccionar Modelo</Label>
                    <Select value={geminiModel} onValueChange={setGeminiModel}>
                      <SelectTrigger id="gemini-model" className="bg-secondary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-border bg-card">
                        <SelectItem value="gemini-2.5-flash">
                          <div className="flex flex-col">
                            <span className="font-medium">Gemini 2.5 Flash</span>
                            <span className="text-xs text-muted-foreground">(Recomendado) - Rápido y económico</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="gemini-2.5-pro">
                          <div className="flex flex-col">
                            <span className="font-medium">Gemini 2.5 Pro</span>
                            <span className="text-xs text-muted-foreground">Más potente, 15x más caro</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Cambiar el modelo afectará las generaciones futuras</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-border bg-secondary/50 p-4">
                      <h4 className="mb-2 font-semibold text-foreground">Gemini 2.5 Flash</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>✓ Rápido y económico</li>
                        <li>✓ 15x más barato que Pro</li>
                        <li>✓ Ideal para carruseles</li>
                        <li>✓ Respuestas en segundos</li>
                        <li className="pt-2">Modelo por defecto recomendado</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-border bg-secondary/50 p-4">
                      <h4 className="mb-2 font-semibold text-foreground">Gemini 2.5 Pro</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>✓ Razonamiento más profundo</li>
                        <li>✓ Mayor precisión</li>
                        <li>✓ Mejor para tareas complejas</li>
                        <li>✓ Mejor contexto</li>
                        <li className="pt-2">Para casos especiales</li>
                      </ul>
                    </div>
                  </div>

                  <Alert className="border-primary/20 bg-primary/5">
                    <Zap className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-sm">
                      <p className="font-medium text-foreground">Modelo Actual: {geminiModel === "gemini-2.5-flash" ? "Gemini 2.5 Flash" : "Gemini 2.5 Pro"}</p>
                      <p className="mt-1 text-muted-foreground">
                        {geminiModel === "gemini-2.5-flash"
                          ? "Usando Flash: Excelente para carruseles, rápido y económico."
                          : "Usando Pro: Máxima calidad y razonamiento profundo."}
                      </p>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="export" className="space-y-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Motor de Exportación</CardTitle>
                  <CardDescription>
                    Elige el motor para exportar tus carruseles como imágenes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="export-engine">Seleccionar Motor</Label>
                    <Select value={exportEngine} onValueChange={setExportEngine}>
                      <SelectTrigger id="export-engine" className="bg-secondary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-border bg-card">
                        <SelectItem value="html2canvas">
                          <div className="flex flex-col">
                            <span className="font-medium">html2canvas (PNG)</span>
                            <span className="text-xs text-muted-foreground">(Recomendado) - Alta calidad, texto sharp</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="html-to-image">
                          <div className="flex flex-col">
                            <span className="font-medium">html-to-image</span>
                            <span className="text-xs text-muted-foreground">Mayor control, múltiples formatos</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Cambiar el motor afectará las futuras descargas</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-border bg-secondary/50 p-4">
                      <h4 className="mb-2 font-semibold text-foreground">html2canvas (PNG)</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>✓ Máxima calidad de texto</li>
                        <li>✓ PNG sin compresión</li>
                        <li>✓ Escala 4-5x para retina</li>
                        <li>✓ Auto-ajuste DPI</li>
                        <li className="pt-2">Recomendado para LinkedIn</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-border bg-secondary/50 p-4">
                      <h4 className="mb-2 font-semibold text-foreground">html-to-image</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>✓ Mayor flexibilidad</li>
                        <li>✓ PNG, JPEG, SVG</li>
                        <li>✓ Control fino</li>
                        <li>✓ Mejor manejo de CSS</li>
                        <li className="pt-2">Para usuarios avanzados</li>
                      </ul>
                    </div>
                  </div>

                  <Alert className="border-primary/20 bg-primary/5">
                    <Download className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-sm">
                      <p className="font-medium text-foreground">Motor Actual: {exportEngine === "html2canvas" ? "html2canvas (PNG)" : "html-to-image"}</p>
                      <p className="mt-1 text-muted-foreground">
                        {exportEngine === "html2canvas"
                          ? "Exportando con html2canvas en formato PNG (escala 4-5x retina, auto-DPI, máxima calidad de texto)."
                          : "Exportando con html-to-image (máxima flexibilidad)."}
                      </p>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="themes" className="space-y-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Colores de Tema Oscuro</CardTitle>
                  <CardDescription>
                    Personaliza la paleta de colores para el tema oscuro
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dark-bg">Fondo (bg)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="dark-bg"
                          type="color"
                          value={darkColors.bg}
                          onChange={(e) => setDarkColors({ ...darkColors, bg: e.target.value })}
                          className="h-10 w-16 cursor-pointer bg-secondary p-1"
                        />
                        <Input
                          type="text"
                          value={darkColors.bg}
                          onChange={(e) => setDarkColors({ ...darkColors, bg: e.target.value })}
                          className="flex-1 bg-secondary font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dark-surf">Superficie (surf)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="dark-surf"
                          type="color"
                          value={darkColors.surf}
                          onChange={(e) => setDarkColors({ ...darkColors, surf: e.target.value })}
                          className="h-10 w-16 cursor-pointer bg-secondary p-1"
                        />
                        <Input
                          type="text"
                          value={darkColors.surf}
                          onChange={(e) => setDarkColors({ ...darkColors, surf: e.target.value })}
                          className="flex-1 bg-secondary font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dark-txt">Texto (txt)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="dark-txt"
                          type="color"
                          value={darkColors.txt}
                          onChange={(e) => setDarkColors({ ...darkColors, txt: e.target.value })}
                          className="h-10 w-16 cursor-pointer bg-secondary p-1"
                        />
                        <Input
                          type="text"
                          value={darkColors.txt}
                          onChange={(e) => setDarkColors({ ...darkColors, txt: e.target.value })}
                          className="flex-1 bg-secondary font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dark-mut">Texto Muted (mut)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="dark-mut"
                          type="color"
                          value={darkColors.mut}
                          onChange={(e) => setDarkColors({ ...darkColors, mut: e.target.value })}
                          className="h-10 w-16 cursor-pointer bg-secondary p-1"
                        />
                        <Input
                          type="text"
                          value={darkColors.mut}
                          onChange={(e) => setDarkColors({ ...darkColors, mut: e.target.value })}
                          className="flex-1 bg-secondary font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dark-pri">Primario (pri)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="dark-pri"
                          type="color"
                          value={darkColors.pri}
                          onChange={(e) => setDarkColors({ ...darkColors, pri: e.target.value })}
                          className="h-10 w-16 cursor-pointer bg-secondary p-1"
                        />
                        <Input
                          type="text"
                          value={darkColors.pri}
                          onChange={(e) => setDarkColors({ ...darkColors, pri: e.target.value })}
                          className="flex-1 bg-secondary font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dark-border">Borde (border)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="dark-border"
                          type="color"
                          value={darkColors.border}
                          onChange={(e) => setDarkColors({ ...darkColors, border: e.target.value })}
                          className="h-10 w-16 cursor-pointer bg-secondary p-1"
                        />
                        <Input
                          type="text"
                          value={darkColors.border}
                          onChange={(e) => setDarkColors({ ...darkColors, border: e.target.value })}
                          className="flex-1 bg-secondary font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setDarkColors(DEFAULT_DARK_COLORS)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Restaurar Valores por Defecto
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Colores de Tema Claro</CardTitle>
                  <CardDescription>
                    Personaliza la paleta de colores para el tema claro
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="light-bg">Fondo (bg)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="light-bg"
                          type="color"
                          value={lightColors.bg}
                          onChange={(e) => setLightColors({ ...lightColors, bg: e.target.value })}
                          className="h-10 w-16 cursor-pointer bg-secondary p-1"
                        />
                        <Input
                          type="text"
                          value={lightColors.bg}
                          onChange={(e) => setLightColors({ ...lightColors, bg: e.target.value })}
                          className="flex-1 bg-secondary font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="light-surf">Superficie (surf)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="light-surf"
                          type="color"
                          value={lightColors.surf}
                          onChange={(e) => setLightColors({ ...lightColors, surf: e.target.value })}
                          className="h-10 w-16 cursor-pointer bg-secondary p-1"
                        />
                        <Input
                          type="text"
                          value={lightColors.surf}
                          onChange={(e) => setLightColors({ ...lightColors, surf: e.target.value })}
                          className="flex-1 bg-secondary font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="light-txt">Texto (txt)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="light-txt"
                          type="color"
                          value={lightColors.txt}
                          onChange={(e) => setLightColors({ ...lightColors, txt: e.target.value })}
                          className="h-10 w-16 cursor-pointer bg-secondary p-1"
                        />
                        <Input
                          type="text"
                          value={lightColors.txt}
                          onChange={(e) => setLightColors({ ...lightColors, txt: e.target.value })}
                          className="flex-1 bg-secondary font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="light-mut">Texto Muted (mut)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="light-mut"
                          type="color"
                          value={lightColors.mut}
                          onChange={(e) => setLightColors({ ...lightColors, mut: e.target.value })}
                          className="h-10 w-16 cursor-pointer bg-secondary p-1"
                        />
                        <Input
                          type="text"
                          value={lightColors.mut}
                          onChange={(e) => setLightColors({ ...lightColors, mut: e.target.value })}
                          className="flex-1 bg-secondary font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="light-pri">Primario (pri)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="light-pri"
                          type="color"
                          value={lightColors.pri}
                          onChange={(e) => setLightColors({ ...lightColors, pri: e.target.value })}
                          className="h-10 w-16 cursor-pointer bg-secondary p-1"
                        />
                        <Input
                          type="text"
                          value={lightColors.pri}
                          onChange={(e) => setLightColors({ ...lightColors, pri: e.target.value })}
                          className="flex-1 bg-secondary font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="light-border">Borde (border)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="light-border"
                          type="color"
                          value={lightColors.border}
                          onChange={(e) => setLightColors({ ...lightColors, border: e.target.value })}
                          className="h-10 w-16 cursor-pointer bg-secondary p-1"
                        />
                        <Input
                          type="text"
                          value={lightColors.border}
                          onChange={(e) => setLightColors({ ...lightColors, border: e.target.value })}
                          className="flex-1 bg-secondary font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setLightColors(DEFAULT_LIGHT_COLORS)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Restaurar Valores por Defecto
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="brand" className="space-y-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Identidad de Marca</CardTitle>
                  <CardDescription>
                    Personaliza el nombre y color de tu marca para los carruseles generados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="brandName">Nombre de Marca</Label>
                    <Input
                      id="brandName"
                      placeholder="h14z.io"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="bg-secondary"
                    />
                    <p className="text-xs text-muted-foreground">Este nombre aparecerá en los carruseles generados</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brandColor">Color de Marca</Label>
                    <div className="flex gap-3">
                      <Input
                        id="brandColor"
                        type="color"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="h-12 w-20 cursor-pointer bg-secondary p-1"
                      />
                      <Input
                        type="text"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        placeholder="#BB2649"
                        className="flex-1 bg-secondary font-mono"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Color principal que se usará en los elementos de acento
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-secondary p-4">
                    <p className="mb-3 text-sm font-medium text-foreground">Vista Previa</p>
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-16 rounded-lg" style={{ backgroundColor: brandColor }} />
                      <div>
                        <p className="text-lg font-bold text-foreground">{brandName || "Tu Marca"}</p>
                        <p className="text-sm text-muted-foreground">Color: {brandColor}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {saved && (
            <Alert className="border-success/20 bg-success/10">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">Configuración guardada exitosamente</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end">
            <Button onClick={handleSave} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Save className="mr-2 h-4 w-4" />
              Guardar Configuración
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
