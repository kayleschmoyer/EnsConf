'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Rocket, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DeploymentsPage() {
  const [deployments] = useState([
    {
      id: 1,
      garage: 'Downtown Parking',
      status: 'success',
      version: '1.2.0',
      deployedAt: new Date().toISOString(),
    },
    {
      id: 2,
      garage: 'Airport Terminal A',
      status: 'pending',
      version: '1.1.0',
      deployedAt: new Date().toISOString(),
    },
    {
      id: 3,
      garage: 'Shopping Mall West',
      status: 'failed',
      version: '1.0.5',
      deployedAt: new Date().toISOString(),
    },
  ])

  const statusConfig = {
    success: {
      icon: CheckCircle,
      color: 'text-green-400',
      bg: 'bg-green-500/20',
      border: 'border-green-500/50',
    },
    pending: {
      icon: Clock,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/50',
    },
    failed: {
      icon: XCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/20',
      border: 'border-red-500/50',
    },
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold neon-text mb-2">Deployments</h1>
        <p className="text-gray-400">Monitor your deployment status</p>
      </div>

      <div className="space-y-4">
        {deployments.map((deployment, idx) => {
          const status = statusConfig[deployment.status]
          const StatusIcon = status.icon

          return (
            <motion.div
              key={deployment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="hologram">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-lg ${status.bg} border ${status.border}`}
                      >
                        <StatusIcon className={`w-6 h-6 ${status.color}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">
                          {deployment.garage}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Version {deployment.version} •{' '}
                          {new Date(deployment.deployedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Logs
                      </Button>
                      {deployment.status === 'failed' && (
                        <Button variant="neon" size="sm">
                          <Rocket className="w-4 h-4 mr-2" />
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
