'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Building2,
  FileCode,
  Rocket,
  Menu,
  X,
  Home,
  Settings
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 border border-gray-700 rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 z-40 flex flex-col transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-800">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg">GARAGE</h1>
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
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600/20 border border-blue-500/50'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-blue-400' : 'text-gray-400'
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      isActive ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-4 py-3">
            <UserButton afterSignOutUrl="/" />
            <div className="flex-1">
              <p className="text-sm font-medium">Profile</p>
              <p className="text-xs text-gray-400">Manage account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Spacer for main content */}
      <div className={`${isOpen ? 'lg:ml-64' : ''} transition-all`} />
    </>
  )
}
