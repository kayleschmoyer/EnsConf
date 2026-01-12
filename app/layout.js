import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import ParticleBackground from '@/components/ParticleBackground'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Garage Config Dashboard',
  description: 'Futuristic ML-based garage configuration management system',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={inter.className}>
          <ParticleBackground />
          <div className="relative z-10">
            {children}
          </div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
