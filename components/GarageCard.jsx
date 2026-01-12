'use client'

import { Building2, Camera, Layers, Activity, Edit } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function GarageCard({ garage }) {
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
    <Card className="overflow-hidden bg-slate-900/80 border border-slate-800/70 hover:border-slate-700 transition-colors">
      {/* Thumbnail */}
      <div className="relative h-48 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Building2 className="w-24 h-24 text-slate-700" />
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
            <Layers className="w-4 h-4 text-sky-300" />
            <div>
              <p className="text-xs text-slate-400">Levels</p>
              <p className="text-sm font-semibold">{garage.levels}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-sky-300" />
            <div>
              <p className="text-xs text-slate-400">Cameras</p>
              <p className="text-sm font-semibold">{garage.cameras?.length || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-sky-300" />
            <div>
              <p className="text-xs text-slate-400">Spaces</p>
              <p className="text-sm font-semibold">{garage.totalSpaces}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-300" />
            <div>
              <p className="text-xs text-slate-400">Occupancy</p>
              <p className={`text-sm font-semibold ${getOccupancyColor(garage.occupancy)}`}>
                {garage.occupancy}%
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-slate-800/70">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/dashboard/garages/${garage._id}`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/dashboard/configs/${garage._id}`}>View Config</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
