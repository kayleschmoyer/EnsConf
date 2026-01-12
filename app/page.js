'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Building2, Cpu, Zap } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard')
    }
  }, [isSignedIn, isLoaded, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-full bg-gray-800">
              <Building2 className="w-20 h-20 text-blue-400" />
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white">
            GARAGE CONFIG
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Next-Gen ML-Based Car Counting System
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Cpu, title: '3D Builder', desc: 'Interactive garage design' },
            { icon: Zap, title: 'Real-time', desc: 'Live configuration updates' },
            { icon: Building2, title: 'Smart Config', desc: 'Auto-generate YAML' },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-6"
            >
              <feature.icon className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div>
          <button
            onClick={() => router.push('/sign-in')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg transition-colors"
          >
            Launch Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
