'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Building2, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function LevelSwitcher({ levels, selectedLevel, onLevelChange }) {
  const getElementCount = (level) => {
    const cameras = level.cameras?.length || 0
    const sensors = level.sensors?.length || 0
    const entrances = level.entrances?.length || 0
    const exits = level.exits?.length || 0
    const ramps = level.ramps?.length || 0
    return cameras + sensors + entrances + exits + ramps
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Building2 className="w-5 h-5" />
        Select Level
      </h3>

      <div className="space-y-2">
        {levels.map((level, index) => {
          const elementCount = getElementCount(level)
          const isSelected = selectedLevel === index

          return (
            <Button
              key={index}
              variant={isSelected ? 'default' : 'outline'}
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={() => onLevelChange(index)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isSelected
                        ? 'bg-primary-foreground text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="text-left">
                    <div className="font-semibold">
                      {level.name || `Level ${index + 1}`}
                    </div>
                    <div className="text-xs opacity-75">
                      {level.spotsPerLevel} spots
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {elementCount > 0 && (
                    <Badge variant={isSelected ? 'secondary' : 'outline'} className="text-xs">
                      {elementCount} {elementCount === 1 ? 'item' : 'items'}
                    </Badge>
                  )}
                  {isSelected && <Check className="w-4 h-4" />}
                </div>
              </div>
            </Button>
          )
        })}
      </div>

      {levels.length === 0 && (
        <div className="text-center text-sm text-muted-foreground py-4">
          No levels configured
        </div>
      )}
    </Card>
  )
}
