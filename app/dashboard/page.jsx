'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Camera, Activity, TrendingUp, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import GarageCard from '@/components/GarageCard'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function DashboardPage() {
  const [garages, setGarages] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState({
    totalGarages: 0,
    totalCameras: 0,
    activeDeployments: 0,
    utilization: 0,
  })
  const router = useRouter()

  useEffect(() => {
    fetchGarages()
  }, [])

  const fetchGarages = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/garages`)
      setGarages(response.data)

      // Calculate stats
      const totalCameras = response.data.reduce((sum, g) => sum + (g.cameras?.length || 0), 0)
      setStats({
        totalGarages: response.data.length,
        totalCameras,
        activeDeployments: response.data.filter(g => g.status === 'active').length,
        utilization: response.data.length > 0
          ? Math.round((response.data.reduce((sum, g) => sum + (g.occupancy || 0), 0) / response.data.length))
          : 0,
      })
    } catch (error) {
      console.error('Failed to fetch garages:', error)
      // Use demo data if API fails
      setDemoData()
    }
  }

  const setDemoData = () => {
    const demoGarages = [
      {
        _id: '1',
        name: 'Downtown Parking',
        levels: 5,
        totalSpaces: 250,
        occupancy: 75,
        status: 'active',
        cameras: Array(8).fill({}),
        thumbnail: '/api/placeholder/400/300',
      },
      {
        _id: '2',
        name: 'Airport Terminal A',
        levels: 3,
        totalSpaces: 180,
        occupancy: 45,
        status: 'active',
        cameras: Array(12).fill({}),
        thumbnail: '/api/placeholder/400/300',
      },
      {
        _id: '3',
        name: 'Shopping Mall West',
        levels: 4,
        totalSpaces: 320,
        occupancy: 88,
        status: 'maintenance',
        cameras: Array(15).fill({}),
        thumbnail: '/api/placeholder/400/300',
      },
    ]
    setGarages(demoGarages)
    setStats({
      totalGarages: 3,
      totalCameras: 35,
      activeDeployments: 2,
      utilization: 69,
    })
  }

  const filteredGarages = garages.filter(garage =>
    garage.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const statCards = [
    { icon: Building2, label: 'Total Garages', value: stats.totalGarages, color: 'neon-blue' },
    { icon: Camera, label: 'Cameras', value: stats.totalCameras, color: 'neon-purple' },
    { icon: Activity, label: 'Active', value: stats.activeDeployments, color: 'neon-green' },
    { icon: TrendingUp, label: 'Avg Utilization', value: `${stats.utilization}%`, color: 'neon-pink' },
  ]

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-2 neon-text"
        >
          Dashboard
        </motion.h1>
        <p className="text-gray-400">Manage your garage configurations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="hologram">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-br from-${stat.color}/20 to-${stat.color}/10`}>
                    <stat.icon className={`w-8 h-8 text-${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Garages Section */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-semibold">Your Garages</h2>
        <div className="flex gap-4 w-full sm:w-auto">
          <Input
            placeholder="Search garages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Button
            variant="neon"
            onClick={() => router.push('/dashboard/garages/new')}
            className="whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Garage
          </Button>
        </div>
      </div>

      {/* Garage Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGarages.map((garage, idx) => (
          <motion.div
            key={garage._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <GarageCard garage={garage} />
          </motion.div>
        ))}
      </div>

      {filteredGarages.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No garages found</p>
          <Button variant="neon" onClick={() => router.push('/dashboard/garages/new')}>
            Create Your First Garage
          </Button>
        </div>
      )}
    </div>
  )
}
