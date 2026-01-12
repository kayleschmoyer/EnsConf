'use client'

import { useState, useCallback } from 'react'
import { ArrowLeft, Check, Building2, Layers, FileCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'
import LevelConfiguration from '@/components/garage/LevelConfiguration'
import ElementToolbox from '@/components/garage/ElementToolbox'
import LevelSwitcher from '@/components/garage/LevelSwitcher'
import ElementProperties from '@/components/garage/ElementProperties'

// Dynamically import 3D scene to avoid SSR issues
const GarageScene = dynamic(() => import('@/components/3d/GarageScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black/50 rounded-lg">
      <p className="text-neon-blue">Loading 3D Scene...</p>
    </div>
  ),
})

export default function NewGaragePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [garageName, setGarageName] = useState('')
  const [levelsData, setLevelsData] = useState([])
  const [totalSpaces, setTotalSpaces] = useState(0)
  const [selectedLevel, setSelectedLevel] = useState(0)
  const [selectedElement, setSelectedElement] = useState(null)
  const [placementMode, setPlacementMode] = useState(null) // null or element type to place

  const steps = [
    { num: 1, title: 'Garage Basics', icon: Building2 },
    { num: 2, title: 'Configure Levels', icon: Layers },
    { num: 3, title: '3D Builder', icon: Layers },
    { num: 4, title: 'Review & Save', icon: FileCode },
  ]

  // Step 1: Garage name
  // Step 2: Level configuration
  const handleLevelConfigComplete = (config) => {
    setLevelsData(config.levels)
    setTotalSpaces(config.totalSpaces)
    setStep(3)
  }

  // Step 3: 3D Builder - Add element
  const handleAddElement = (elementType) => {
    setPlacementMode(elementType)
    toast({
      title: 'Placement Mode',
      description: 'Click on the 3D canvas to place the element',
    })
  }

  // Handle floor click for placement
  const handleFloorClick = useCallback((position) => {
    if (!placementMode) return

    const levelY = selectedLevel * 3
    const newElement = {
      id: `${placementMode}-${Date.now()}`,
      position: [position[0], levelY + 0.5, position[2]],
    }

    // Add type-specific properties
    if (placementMode === 'camera') {
      newElement.ip = ''
      newElement.direction = 'overview'
      newElement.rotation = [0, 0, 0]
    } else if (placementMode === 'sensor') {
      newElement.type = 'normal'
    } else if (placementMode === 'ramp-up' || placementMode === 'ramp-down') {
      newElement.direction = placementMode.split('-')[1]
    }

    // Add element to the appropriate level array
    setLevelsData((prev) => {
      const updated = [...prev]
      const level = { ...updated[selectedLevel] }

      if (placementMode === 'camera') {
        level.cameras = [...(level.cameras || []), newElement]
      } else if (placementMode === 'sensor') {
        level.sensors = [...(level.sensors || []), newElement]
      } else if (placementMode === 'entrance') {
        level.entrances = [...(level.entrances || []), newElement]
      } else if (placementMode === 'exit') {
        level.exits = [...(level.exits || []), newElement]
      } else if (placementMode === 'ramp-up' || placementMode === 'ramp-down') {
        level.ramps = [...(level.ramps || []), newElement]
      }

      updated[selectedLevel] = level
      return updated
    })

    setSelectedElement({ type: placementMode, data: newElement })
    setPlacementMode(null)

    toast({
      title: 'Element Placed',
      description: `${placementMode} added to ${levelsData[selectedLevel]?.name || `Level ${selectedLevel + 1}`}`,
    })
  }, [placementMode, selectedLevel, levelsData, toast])

  // Handle element click
  const handleElementClick = (element) => {
    setSelectedElement(element)
    setPlacementMode(null)
  }

  // Handle element update
  const handleUpdateElement = (updatedElement) => {
    setLevelsData((prev) => {
      const updated = [...prev]
      const level = { ...updated[selectedLevel] }
      const { type, data } = updatedElement

      // Determine which array to update
      let arrayKey = ''
      if (type === 'camera') arrayKey = 'cameras'
      else if (type === 'sensor') arrayKey = 'sensors'
      else if (type === 'entrance') arrayKey = 'entrances'
      else if (type === 'exit') arrayKey = 'exits'
      else if (type.startsWith('ramp')) arrayKey = 'ramps'

      if (arrayKey) {
        level[arrayKey] = level[arrayKey]?.map((item) =>
          item.id === data.id ? data : item
        ) || []
      }

      updated[selectedLevel] = level
      return updated
    })

    setSelectedElement(updatedElement)
  }

  // Handle element delete
  const handleDeleteElement = () => {
    if (!selectedElement) return

    setLevelsData((prev) => {
      const updated = [...prev]
      const level = { ...updated[selectedLevel] }
      const { type, data } = selectedElement

      // Determine which array to update
      let arrayKey = ''
      if (type === 'camera') arrayKey = 'cameras'
      else if (type === 'sensor') arrayKey = 'sensors'
      else if (type === 'entrance') arrayKey = 'entrances'
      else if (type === 'exit') arrayKey = 'exits'
      else if (type.startsWith('ramp')) arrayKey = 'ramps'

      if (arrayKey) {
        level[arrayKey] = level[arrayKey]?.filter((item) => item.id !== data.id) || []
      }

      updated[selectedLevel] = level
      return updated
    })

    toast({
      title: 'Element Deleted',
      description: `${selectedElement.type} removed`,
    })

    setSelectedElement(null)
  }

  // Handle element drag
  const handleItemDrag = useCallback((itemId, newPosition) => {
    setLevelsData((prev) => {
      const updated = [...prev]
      const level = { ...updated[selectedLevel] }

      // Update position in all arrays
      ;['cameras', 'sensors', 'entrances', 'exits', 'ramps'].forEach((key) => {
        if (level[key]) {
          level[key] = level[key].map((item) =>
            item.id === itemId ? { ...item, position: newPosition } : item
          )
        }
      })

      updated[selectedLevel] = level
      return updated
    })

    // Update selected element if it's the one being dragged
    if (selectedElement?.data?.id === itemId) {
      setSelectedElement((prev) => ({
        ...prev,
        data: { ...prev.data, position: newPosition },
      }))
    }
  }, [selectedLevel, selectedElement])

  // Handle save
  const handleSave = async () => {
    try {
      const config = {
        name: garageName,
        totalSpaces,
        levels: levelsData,
        status: 'active',
        occupancy: 0,
        version: '2.0.0',
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/garages`,
        config
      )

      toast({
        title: 'Success!',
        description: 'Garage created successfully',
      })

      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to save:', error)
      toast({
        title: 'Error',
        description: 'Failed to save garage. Using local mode.',
        variant: 'destructive',
      })
      // Fallback: save to localStorage
      const localGarages = JSON.parse(localStorage.getItem('garages') || '[]')
      localGarages.push({
        _id: Date.now().toString(),
        name: garageName,
        totalSpaces,
        levels: levelsData,
      })
      localStorage.setItem('garages', JSON.stringify(localGarages))
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-4xl font-bold neon-text">Create New Garage</h1>
        <p className="text-gray-400 mt-2">Configure your garage level by level</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8 gap-4 overflow-x-auto">
        {steps.map((s, idx) => (
          <div key={s.num} className="flex items-center flex-shrink-0">
            <div
              animate={{
                scale: step === s.num ? 1.1 : 1,
              }}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                step >= s.num
                  ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 neon-border'
                  : 'bg-white/5'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step > s.num
                    ? 'bg-neon-green text-black'
                    : step === s.num
                    ? 'bg-neon-blue text-black'
                    : 'bg-white/10'
                }`}
              >
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <div>
                <p className="text-sm font-semibold">{s.title}</p>
              </div>
            </div>
            {idx < steps.length - 1 && <div className="w-12 h-0.5 bg-white/20 mx-2" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Garage Name */}
        {step === 1 && (
          <div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="max-w-2xl mx-auto p-8">
              <h2 className="text-2xl font-bold mb-6">Garage Name</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="garage-name">Name</Label>
                  <Input
                    id="garage-name"
                    value={garageName}
                    onChange={(e) => setGarageName(e.target.value)}
                    placeholder="e.g., Downtown Parking Garage"
                    className="mt-2"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!garageName.trim()}
                    className="gap-2"
                  >
                    Continue
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Step 2: Level Configuration */}
        {step === 2 && (
          <div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="max-w-5xl mx-auto">
              <LevelConfiguration
                onComplete={handleLevelConfigComplete}
                initialData={{ levels: levelsData }}
              />
            </div>
          </div>
        )}

        {/* Step 3: 3D Builder */}
        {step === 3 && (
          <div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Sidebar - Level Switcher */}
              <div className="space-y-6">
                <LevelSwitcher
                  levels={levelsData}
                  selectedLevel={selectedLevel}
                  onLevelChange={setSelectedLevel}
                />

                <ElementToolbox
                  onAddElement={handleAddElement}
                  selectedElement={placementMode}
                />
              </div>

              {/* Center - 3D Scene */}
              <div className="lg:col-span-2">
                <Card className="p-0 overflow-hidden">
                  <div className="h-[600px]">
                    <GarageScene
                      levelsData={levelsData}
                      selectedLevel={selectedLevel}
                      onItemClick={handleElementClick}
                      selectedItem={selectedElement?.data}
                      onItemDrag={handleItemDrag}
                      onFloorClick={handleFloorClick}
                      placementMode={!!placementMode}
                    />
                  </div>
                </Card>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={() => setStep(4)} className="gap-2">
                    Continue
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Button>
                </div>
              </div>

              {/* Right Sidebar - Element Properties */}
              <div>
                <ElementProperties
                  selectedElement={selectedElement}
                  onUpdateElement={handleUpdateElement}
                  onDeleteElement={handleDeleteElement}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Save */}
        {step === 4 && (
          <div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="max-w-4xl mx-auto p-8">
              <h2 className="text-2xl font-bold mb-6">Review Configuration</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Garage Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>{' '}
                      <span className="font-medium">{garageName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Spaces:</span>{' '}
                      <span className="font-medium">{totalSpaces}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Levels:</span>{' '}
                      <span className="font-medium">{levelsData.length}</span>
                    </div>
                  </div>
                </div>

                {/* Level Summary */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Level Summary</h3>
                  <div className="space-y-3">
                    {levelsData.map((level, idx) => (
                      <Card key={idx} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">
                              {level.name || `Level ${idx + 1}`}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {level.spotsPerLevel} parking spots
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Cameras:</span>{' '}
                              <span className="font-medium">
                                {level.cameras?.length || 0}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Sensors:</span>{' '}
                              <span className="font-medium">
                                {level.sensors?.length || 0}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Entrances:</span>{' '}
                              <span className="font-medium">
                                {level.entrances?.length || 0}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Exits:</span>{' '}
                              <span className="font-medium">
                                {level.exits?.length || 0}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Ramps:</span>{' '}
                              <span className="font-medium">
                                {level.ramps?.length || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={() => setStep(3)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Builder
                  </Button>
                  <Button onClick={handleSave} size="lg" className="gap-2">
                    <Check className="w-5 h-5" />
                    Create Garage
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
