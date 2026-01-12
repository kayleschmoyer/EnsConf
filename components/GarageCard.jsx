'use client'

import { Building2, Camera, Layers, Activity, Edit } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function GarageCard({ garage }) {
  const router = useRouter()

  const statusColors = {
    active: 'bg-green-500/20 text-green-400 border-green-500/50',
    maintenance: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
  }

  const getOccupancyColor = (occupancy) => {
    if (occupancy >= 90) return 'text-red-400'
    if (occupancy >= 70) return 'text-yellow-400'
    return 'text-green-400'
  }

  return (
    <Card className="overflow-hidden bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Building2 className="w-24 h-24 text-gray-700" />
        </div>
        {/* Status Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[garage.status]}`}>
          {garage.status}
        </div>
      </div>

      <CardContent className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold mb-4">
          {garage.name}
        </h3>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <div>
              <p className="text-xs text-gray-400">Levels</p>
              <p className="text-sm font-semibold">{garage.levels}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-blue-400" />
            <div>
              <p className="text-xs text-gray-400">Cameras</p>
              <p className="text-sm font-semibold">{garage.cameras?.length || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            <div>
              <p className="text-xs text-gray-400">Spaces</p>
              <p className="text-sm font-semibold">{garage.totalSpaces}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <div>
              <p className="text-xs text-gray-400">Occupancy</p>
              <p className={`text-sm font-semibold ${getOccupancyColor(garage.occupancy)}`}>
                {garage.occupancy}%
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-700">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => router.push(`/dashboard/garages/${garage._id}`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => router.push(`/dashboard/configs/${garage._id}`)}
          >
            View Config
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
