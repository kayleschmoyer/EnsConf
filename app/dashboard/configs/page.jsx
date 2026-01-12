'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileCode, Download, Upload, Search, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function ConfigsPage() {
  const [configs, setConfigs] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/garages`)
      setConfigs(response.data)
    } catch (error) {
      console.error('Failed to fetch configs:', error)
      // Use demo data
      setConfigs([
        {
          _id: '1',
          name: 'Downtown Parking',
          updatedAt: new Date().toISOString(),
          version: '1.0.0',
        },
      ])
    }
  }

  const filteredConfigs = configs.filter((config) =>
    config.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold neon-text mb-2">Configurations</h1>
        <p className="text-gray-400">Manage YAML/JSON config files</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Input
          placeholder="Search configs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
          icon={<Search className="w-4 h-4" />}
        />
        <Button variant="neon">
          <Plus className="w-4 h-4 mr-2" />
          New Config
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConfigs.map((config, idx) => (
          <motion.div
            key={config._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="hologram cursor-pointer hover:scale-105 transition-transform">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-neon-blue" />
                  {config.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>Version: {config.version || '1.0.0'}</p>
                  <p>
                    Updated:{' '}
                    {new Date(config.updatedAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      router.push(`/dashboard/configs/${config._id}`)
                    }
                  >
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
