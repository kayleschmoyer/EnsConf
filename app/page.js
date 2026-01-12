'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
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
    <div className="min-h-screen grid-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto"
      >
        {/* Hero Section */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(0,240,255,0.5)',
                    '0 0 40px rgba(176,0,255,0.8)',
                    '0 0 20px rgba(0,240,255,0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-6 rounded-full bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 backdrop-blur-xl"
              >
                <Building2 className="w-20 h-20 text-neon-blue" />
              </motion.div>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 neon-text">
            GARAGE CONFIG
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Next-Gen ML-Based Car Counting System
          </p>
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Cpu, title: '3D Builder', desc: 'Interactive garage design' },
            { icon: Zap, title: 'Real-time', desc: 'Live configuration updates' },
            { icon: Building2, title: 'Smart Config', desc: 'Auto-generate YAML' },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
              className="glass-panel p-6 hologram"
            >
              <feature.icon className="w-12 h-12 text-neon-purple mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <button
            onClick={() => router.push('/sign-in')}
            className="glow-button text-lg"
          >
            Launch Dashboard
          </button>
        </motion.div>

        {/* Animated Rings */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neon-blue/20"
              style={{
                width: `${(i + 1) * 300}px`,
                height: `${(i + 1) * 300}px`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 4,
                delay: i * 0.5,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
