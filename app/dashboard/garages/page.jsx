'use client'

import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import GarageCard from '@/components/GarageCard'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function GaragesPage() {
  const [garages, setGarages] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchGarages()
  }, [])

  const fetchGarages = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/garages`)
      setGarages(response.data)
    } catch (error) {
      console.error('Failed to fetch:', error)
    }
  }

  const filteredGarages = garages.filter((garage) =>
    garage.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold neon-text mb-2">All Garages</h1>
        <p className="text-gray-400">Manage your garage configurations</p>
      </div>

      <div className="mb-6 flex gap-4">
        <Input
          placeholder="Search garages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="neon" onClick={() => router.push('/dashboard/garages/new')}>
          <Plus className="w-4 h-4 mr-2" />
          New Garage
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGarages.map((garage, idx) => (
          <div
            key={garage._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <GarageCard garage={garage} />
          </div>
        ))}
      </div>
    </div>
  )
}
