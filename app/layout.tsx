import type { Metadata, Viewport } from 'next'
import { Source_Sans_3, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Smart Community Health Monitor - SIH25001',
  description:
    'AI-powered Smart Community Health Monitoring & Early Warning System for Water-Borne Diseases in India. SIH 2025 - Team 25RBU214.',
  keywords: [
    'water-borne diseases',
    'health monitoring',
    'AI prediction',
    'Smart India Hackathon',
    'SIH25001',
  ],
}

export const viewport: Viewport = {
  themeColor: '#1B5E20',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${sourceSans.variable} ${playfair.variable} font-sans antialiased`}
      >
        {children}
        <Toaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}
