import type { Metadata } from 'next'
import { Inter, Poppins, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import BackendStatus from '@/components/BackendStatus'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'AI Desk - Latest AI News & Explainers | Stay Updated with AI',
    template: '%s | AI Desk'
  },
  description: 'Stay updated with the latest AI news, insights, and explanations. Get AI-generated summaries, detailed explanations, and video recommendations for the most important AI developments.',
  keywords: ['AI news', 'artificial intelligence', 'machine learning', 'AI explainers', 'tech news', 'AI updates', 'AI insights'],
  authors: [{ name: 'AI Desk' }],
  creator: 'AI Desk',
  publisher: 'AI Desk',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'http://localhost:3000',
    siteName: 'AI Desk',
    title: 'AI Desk - Latest AI News & Explainers',
    description: 'Stay updated with the latest AI news, insights, and explanations',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Desk - AI News Aggregator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Desk - Latest AI News & Explainers',
    description: 'Stay updated with the latest AI news, insights, and explanations',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    // Add your verification codes here when deploying
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable} ${playfair.variable}`}>
      <body className={`${inter.className} font-sans antialiased`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'AI Desk',
              description: 'Latest AI News & Explainers',
              url: 'http://localhost:3000',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'http://localhost:3000?search={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <div className="relative min-h-screen">
          <Header />
          {children}
          <BackendStatus />
        </div>
      </body>
    </html>
  )
}
