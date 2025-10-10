import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/react"
import { AuthProvider } from "@/lib/auth-context"
import { DataProvider } from "@/lib/data-context"
import { Toaster } from "@/components/ui/sonner"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "不動産管理システム",
  description: "不動産物件・契約後タスク管理システム",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <DataProvider>
              {children}
              <Toaster />
            </DataProvider>
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
