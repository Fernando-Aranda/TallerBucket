import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Press_Start_2P } from 'next/font/google'
import './globals.css'

const pressStart2P = Press_Start_2P({
  variable: '--font-press-start',
  subsets: ['latin'],
  weight: '400',
})

export const metadata: Metadata = {
  title: 'TamaDrive - VIRTUAL STORAGE',
  description: 'Your nostalgic 90s virtual pet file storage. Feed your Tamagotchi your files!',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#c8b89a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${pressStart2P.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
