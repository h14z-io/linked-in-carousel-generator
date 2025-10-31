"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Settings, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[#E83E8C]">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-none text-foreground">LinkedIn Carousel</span>
                <span className="text-xs leading-none text-muted-foreground">by h14z.io</span>
              </div>
            </Link>

            <div className="flex gap-1">
              <Link
                href="/"
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === "/"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                )}
              >
                <Sparkles className="h-4 w-4" />
                Generar
              </Link>
              <Link
                href="/settings"
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === "/settings"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                )}
              >
                <Settings className="h-4 w-4" />
                Configuración
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
