"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Key, Palette, Save, CheckCircle2, ExternalLink } from "lucide-react"

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("")
  const [brandName, setBrandName] = useState("h14z.io")
  const [brandColor, setBrandColor] = useState("#BB2649")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load saved settings from localStorage
    const savedApiKey = localStorage.getItem("geminiApiKey") || ""
    const savedBrandName = localStorage.getItem("brandName") || "h14z.io"
    const savedBrandColor = localStorage.getItem("brandColor") || "#BB2649"

    setApiKey(savedApiKey)
    setBrandName(savedBrandName)
    setBrandColor(savedBrandColor)
  }, [])

  const handleSave = () => {
    localStorage.setItem("geminiApiKey", apiKey)
    localStorage.setItem("brandName", brandName)
    localStorage.setItem("brandColor", brandColor)

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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="api" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                API Key
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
