import type { Metadata } from "next"
import { Inter, Lora, Noto_Sans_Tamil } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

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
  title: "Sonnaanga Senjaangala | TVK Promise Tracker",
  description: "An independent citizen-maintained ledger tracking the promises made by TVK in Tamil Nadu.",
  openGraph: {
    title: "Sonnaanga Senjaangala",
    description: "Independent citizen-maintained ledger tracking TVK election promises in Tamil Nadu.",
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
        </AuthProvider>
      </body>
    </html>
  )
}
