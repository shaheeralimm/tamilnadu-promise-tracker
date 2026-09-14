import type { Metadata } from "next"
import { Inter, Lora, Noto_Sans_Tamil } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Analytics } from "@vercel/analytics/next"
import { siteConfig } from "@/lib/config"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const notoSansTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  variable: "--font-tamil",
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

import AuthProvider from "@/components/auth/AuthProvider"

export const metadata: Metadata = {
  title: siteConfig.siteTitle,
  description: siteConfig.siteDescription,
  openGraph: {
    title: siteConfig.siteName,
    description: siteConfig.siteDescription,
    type: "website",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ta" className={`${inter.variable} ${lora.variable} ${notoSansTamil.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground font-ui" suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow bg-slate-50/30">
            {children}
          </main>
          <Footer />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
