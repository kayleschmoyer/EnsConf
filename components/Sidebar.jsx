'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Building2,
  FileCode,
  Rocket,
  Menu,
  X,
  Home,
  Settings,
  LogOut
} from 'lucide-react'
import { UserButton } from '@clerk/nextjs'

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Building2, label: 'Garages', href: '/dashboard/garages' },
  { icon: FileCode, label: 'Configs', href: '/dashboard/configs' },
  { icon: Rocket, label: 'Deployments', href: '/dashboard/deployments' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass-panel neon-border rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -280,
        }}
        className="fixed left-0 top-0 h-screen w-64 glass-panel border-r border-white/10 z-40 flex flex-col"
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-purple/20">
              <Building2 className="w-6 h-6 text-neon-blue" />
            </div>
            <div>
              <h1 className="font-bold text-lg neon-text">GARAGE</h1>
              <p className="text-xs text-gray-400">Config System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 neon-border'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-neon-blue' : 'text-gray-400'
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      isActive ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3">
            <UserButton afterSignOutUrl="/" />
            <div className="flex-1">
              <p className="text-sm font-medium">Profile</p>
              <p className="text-xs text-gray-400">Manage account</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Spacer for main content */}
      <div className={`${isOpen ? 'lg:ml-64' : ''} transition-all`} />
    </>
  )
}
