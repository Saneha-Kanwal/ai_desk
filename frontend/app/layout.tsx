import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import BackendStatus from '@/components/BackendStatus'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Desk - Latest AI News & Explainers',
  description: 'Stay updated with the latest AI news, insights, and explanations',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Header />
        {children}
        <BackendStatus />
      </body>
    </html>
  )
}
