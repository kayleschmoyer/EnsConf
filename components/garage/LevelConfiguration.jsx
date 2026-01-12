'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Building2, ArrowRight, Plus, Minus } from 'lucide-react'

export default function LevelConfiguration({ onComplete, initialData = null }) {
  const [numLevels, setNumLevels] = useState(initialData?.levels?.length || 3)
  const [levelConfigs, setLevelConfigs] = useState(
    initialData?.levels || Array.from({ length: 3 }, (_, i) => ({
      levelNumber: i,
      name: `Level ${i + 1}`,
      spotsPerLevel: 50,
      entrances: 1,
      exits: 1,
    }))
  )

  const handleNumLevelsChange = (newNum) => {
    const num = parseInt(newNum) || 1
    setNumLevels(num)

    // Adjust level configs array
    if (num > levelConfigs.length) {
      // Add new levels
      const newLevels = Array.from(
        { length: num - levelConfigs.length },
        (_, i) => ({
          levelNumber: levelConfigs.length + i,
          name: `Level ${levelConfigs.length + i + 1}`,
          spotsPerLevel: 50,
          entrances: 1,
          exits: 1,
        })
      )
      setLevelConfigs([...levelConfigs, ...newLevels])
    } else if (num < levelConfigs.length) {
      // Remove excess levels
      setLevelConfigs(levelConfigs.slice(0, num))
    }
  }

  const updateLevelConfig = (index, field, value) => {
    const updated = [...levelConfigs]
    updated[index] = {
      ...updated[index],
      [field]: value,
    }
    setLevelConfigs(updated)
  }

  const handleSubmit = () => {
    // Calculate total spaces
    const totalSpaces = levelConfigs.reduce((sum, level) => sum + level.spotsPerLevel, 0)

    onComplete({
      totalSpaces,
      levels: levelConfigs.map((level, index) => ({
        ...level,
        levelNumber: index,
        cameras: [],
        sensors: [],
        entrances: [],
        exits: [],
        ramps: [],
      })),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Configure Garage Levels</h2>
          <p className="text-muted-foreground">
            Set up the number of levels and basic configuration for each
          </p>
        </div>
      </div>

      {/* Number of Levels */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="numLevels">Number of Levels</Label>
            <div className="flex items-center gap-3 mt-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleNumLevelsChange(Math.max(1, numLevels - 1))}
                disabled={numLevels <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="numLevels"
                type="number"
                min="1"
                max="20"
                value={numLevels}
                onChange={(e) => handleNumLevelsChange(e.target.value)}
                className="w-24 text-center"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleNumLevelsChange(numLevels + 1)}
                disabled={numLevels >= 20}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Level Configuration Cards */}
      <div className="space-y-4">
        {levelConfigs.map((level, index) => (
          <Card key={index} className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">
                {index + 1}
              </span>
              Level {index + 1}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Level Name */}
              <div className="space-y-2">
                <Label htmlFor={`level-${index}-name`}>Level Name</Label>
                <Input
                  id={`level-${index}-name`}
                  type="text"
                  placeholder="e.g., Ground Floor"
                  value={level.name}
                  onChange={(e) => updateLevelConfig(index, 'name', e.target.value)}
                />
              </div>

              {/* Parking Spots */}
              <div className="space-y-2">
                <Label htmlFor={`level-${index}-spots`}>Parking Spots</Label>
                <Input
                  id={`level-${index}-spots`}
                  type="number"
                  min="1"
                  value={level.spotsPerLevel}
                  onChange={(e) =>
                    updateLevelConfig(index, 'spotsPerLevel', parseInt(e.target.value) || 0)
                  }
                />
              </div>

              {/* Entrances */}
              <div className="space-y-2">
                <Label htmlFor={`level-${index}-entrances`}>Entrances</Label>
                <Input
                  id={`level-${index}-entrances`}
                  type="number"
                  min="0"
                  value={level.entrances}
                  onChange={(e) =>
                    updateLevelConfig(index, 'entrances', parseInt(e.target.value) || 0)
                  }
                />
              </div>

              {/* Exits */}
              <div className="space-y-2">
                <Label htmlFor={`level-${index}-exits`}>Exits</Label>
                <Input
                  id={`level-${index}-exits`}
                  type="number"
                  min="0"
                  value={level.exits}
                  onChange={(e) =>
                    updateLevelConfig(index, 'exits', parseInt(e.target.value) || 0)
                  }
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          size="lg"
          className="gap-2"
        >
          Continue to Builder
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
