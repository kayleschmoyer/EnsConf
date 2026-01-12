'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Building2, Cpu, Zap, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function Home() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard')
    }
  }, [isSignedIn, isLoaded, router])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_55%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-28">
          {/* Hero Section */}
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg shadow-black/40">
                <Building2 className="w-16 h-16 text-sky-300" />
              </div>
            </div>

            <p className="uppercase tracking-[0.35em] text-xs text-slate-400 mb-4">
              EnSight Technologies
            </p>
            <h1 className="text-5xl md:text-7xl font-semibold mb-5">
              Configure parking intelligence
              <span className="block neon-text">faster and clearer.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Design garages, deploy sensors, and manage real-time insights with a
              modern, low-latency dashboard inspired by EnSight’s signature blue.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="neon" size="lg" asChild>
                <Link href="/sign-in">Launch Dashboard</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/sign-up">Request Access</Link>
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid gap-6 mt-14 md:grid-cols-3">
            {[
              { icon: Cpu, title: '3D Builder', desc: 'Interact with a responsive garage canvas.' },
              { icon: Zap, title: 'Real-time', desc: 'Stay in sync with live configuration updates.' },
              { icon: ShieldCheck, title: 'Reliable', desc: 'Ship production-ready configurations fast.' },
            ].map((feature, idx) => (
              <Card
                key={idx}
                className="bg-slate-900/70 border border-slate-800/70 p-6 text-left"
              >
                <feature.icon className="w-10 h-10 text-sky-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </Card>
            ))}
          </div>

          {/* Highlights */}
          <div className="mt-14 grid gap-4 md:grid-cols-2">
            <div className="glass-panel p-6 flex items-start gap-4">
              <Sparkles className="w-8 h-8 text-sky-300" />
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">User friendly</p>
                <p className="text-lg font-semibold text-white">
                  Clear layouts, quick actions, and modern visuals for every role.
                </p>
              </div>
            </div>
            <div className="glass-panel p-6 flex items-start gap-4">
              <Building2 className="w-8 h-8 text-sky-300" />
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Fast by design</p>
                <p className="text-lg font-semibold text-white">
                  Lightweight styles keep interactions snappy on every button press.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
