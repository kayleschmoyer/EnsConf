'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Building2, Camera, FileCode, Trash2, Move } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'

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
  const [garageData, setGarageData] = useState({
    name: '',
    levels: 3,
    spotsPerLevel: 50,
    entrances: 1,
    exits: 1,
  })
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedLevel, setSelectedLevel] = useState(0)
  const [placementMode, setPlacementMode] = useState(false)
  const [itemForm, setItemForm] = useState({
    type: 'camera',
    ip: '',
    direction: 'inbound',
    position: [0, 0, 0],
  })

  const steps = [
    { num: 1, title: 'Garage Basics', icon: Building2 },
    { num: 2, title: '3D Builder', icon: Camera },
    { num: 3, title: 'Review & Save', icon: FileCode },
  ]

  // Optimized handlers with useCallback to prevent unnecessary re-renders
  const handleAddItem = useCallback(() => {
    if (placementMode) {
      toast({
        title: 'Click on floor',
        description: 'Click anywhere on the selected level to place the item',
      })
      return
    }

    // Place at center of selected level
    const levelY = selectedLevel * 3
    const newItem = {
      id: Date.now().toString(),
      type: itemForm.type,
      ip: itemForm.ip,
      direction: itemForm.direction,
      position: [0, levelY + 0.5, 0],
      rotation: [0, 0, 0],
      level: selectedLevel,
    }

    setItems(prev => [...prev, newItem])
    setSelectedItem(newItem)
    toast({
      title: 'Item Added',
      description: `${itemForm.type === 'camera' ? 'Camera' : 'Sensor'} added to level ${selectedLevel + 1}`,
    })
  }, [itemForm, selectedLevel, placementMode, toast])

  const handleFloorClick = useCallback((position) => {
    if (!placementMode) return

    const levelY = selectedLevel * 3
    const newItem = {
      id: Date.now().toString(),
      type: itemForm.type,
      ip: itemForm.ip,
      direction: itemForm.direction,
      position: [position[0], levelY + 0.5, position[2]],
      rotation: [0, 0, 0],
      level: selectedLevel,
    }

    setItems(prev => [...prev, newItem])
    setSelectedItem(newItem)
    setPlacementMode(false)
    toast({
      title: 'Item Placed',
      description: `${itemForm.type === 'camera' ? 'Camera' : 'Sensor'} placed at (${position[0].toFixed(1)}, ${position[2].toFixed(1)})`,
    })
  }, [itemForm, selectedLevel, placementMode, toast])

  const handleItemDrag = useCallback((itemId, newPosition) => {
    setItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, position: newPosition }
        : item
    ))
  }, [])

  const handleDeleteItem = useCallback(() => {
    if (!selectedItem) return

    setItems(prev => prev.filter(item => item.id !== selectedItem.id))
    toast({
      title: 'Item Deleted',
      description: `${selectedItem.type === 'camera' ? 'Camera' : 'Sensor'} removed`,
    })
    setSelectedItem(null)
  }, [selectedItem, toast])

  const handleUpdatePosition = useCallback((axis, value) => {
    if (!selectedItem) return

    setItems(prev => prev.map(item => {
      if (item.id === selectedItem.id) {
        const newPosition = [...item.position]
        const axisIndex = { x: 0, y: 1, z: 2 }[axis]
        newPosition[axisIndex] = parseFloat(value) || 0
        return { ...item, position: newPosition }
      }
      return item
    }))

    setSelectedItem(prev => {
      if (!prev) return prev
      const newPosition = [...prev.position]
      const axisIndex = { x: 0, y: 1, z: 2 }[axis]
      newPosition[axisIndex] = parseFloat(value) || 0
      return { ...prev, position: newPosition }
    })
  }, [selectedItem])

  const handleUpdateRotation = useCallback((value) => {
    if (!selectedItem) return

    const radians = (parseFloat(value) || 0) * (Math.PI / 180)
    setItems(prev => prev.map(item => {
      if (item.id === selectedItem.id) {
        return { ...item, rotation: [0, radians, 0] }
      }
      return item
    }))

    setSelectedItem(prev => {
      if (!prev) return prev
      return { ...prev, rotation: [0, radians, 0] }
    })
  }, [selectedItem])

  // Memoize camera and sensor counts to prevent recalculation
  const itemCounts = useMemo(() => ({
    cameras: items.filter(i => i.type === 'camera').length,
    sensors: items.filter(i => i.type === 'sensor').length,
  }), [items])

  const handleSave = async () => {
    try {
      const config = {
        ...garageData,
        cameras: items.filter(i => i.type === 'camera').map((cam, idx) => ({
          id: `cam${idx + 1}`,
          ip: cam.ip || `192.168.1.${100 + idx}`,
          direction: cam.direction,
          roi: [[100, 200], [300, 400]], // Simplified ROI
          position: cam.position,
        })),
        sensors: items.filter(i => i.type === 'sensor').map((sen, idx) => ({
          id: `sensor${idx + 1}`,
          position: sen.position,
        })),
        status: 'active',
        occupancy: 0,
        totalSpaces: garageData.levels * garageData.spotsPerLevel,
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/garages`, config)

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
      localGarages.push({ ...garageData, _id: Date.now().toString(), items })
      localStorage.setItem('garages', JSON.stringify(localGarages))
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-4xl font-bold neon-text">Create New Garage</h1>
        <p className="text-gray-400 mt-2">Build your garage configuration in 3D</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8 gap-4">
        {steps.map((s, idx) => (
          <div key={s.num} className="flex items-center">
            <motion.div
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
            </motion.div>
            {idx < steps.length - 1 && (
              <div className="w-12 h-0.5 bg-white/20 mx-2" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="max-w-2xl mx-auto p-8">
              <h2 className="text-2xl font-bold mb-6">Garage Information</h2>
              <div className="space-y-6">
                <div>
                  <Label>Garage Name</Label>
                  <Input
                    value={garageData.name}
                    onChange={(e) =>
                      setGarageData({ ...garageData, name: e.target.value })
                    }
                    placeholder="e.g., Downtown Parking"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Number of Levels: {garageData.levels}</Label>
                  <Slider
                    value={[garageData.levels]}
                    onValueChange={(v) =>
                      setGarageData({ ...garageData, levels: v[0] })
                    }
                    min={1}
                    max={10}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Spots per Level</Label>
                  <Input
                    type="number"
                    value={garageData.spotsPerLevel}
                    onChange={(e) =>
                      setGarageData({
                        ...garageData,
                        spotsPerLevel: parseInt(e.target.value) || 0,
                      })
                    }
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Entrances</Label>
                    <Input
                      type="number"
                      value={garageData.entrances}
                      onChange={(e) =>
                        setGarageData({
                          ...garageData,
                          entrances: parseInt(e.target.value) || 0,
                        })
                      }
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Exits</Label>
                    <Input
                      type="number"
                      value={garageData.exits}
                      onChange={(e) =>
                        setGarageData({
                          ...garageData,
                          exits: parseInt(e.target.value) || 0,
                        })
                      }
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* 3D Scene */}
            <div className="lg:col-span-2 h-[700px]">
              <Card className="h-full p-4">
                {/* Level Selector */}
                <div className="mb-3 flex items-center gap-2 flex-wrap">
                  <Label className="text-sm font-semibold">Select Level:</Label>
                  {Array.from({ length: garageData.levels }).map((_, idx) => (
                    <Button
                      key={idx}
                      size="sm"
                      variant={selectedLevel === idx ? 'neon' : 'outline'}
                      onClick={() => setSelectedLevel(idx)}
                      className="h-8 px-3"
                    >
                      Level {idx + 1}
                    </Button>
                  ))}
                </div>

                <GarageScene
                  levels={garageData.levels}
                  spotsPerLevel={garageData.spotsPerLevel}
                  items={items}
                  entrances={garageData.entrances}
                  exits={garageData.exits}
                  selectedLevel={selectedLevel}
                  onItemClick={setSelectedItem}
                  selectedItem={selectedItem}
                  onItemDrag={handleItemDrag}
                  onFloorClick={handleFloorClick}
                  placementMode={placementMode}
                />
              </Card>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Add Items</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Type</Label>
                    <select
                      value={itemForm.type}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, type: e.target.value })
                      }
                      className="w-full mt-2 p-2 rounded-md bg-background border border-input"
                    >
                      <option value="camera">Camera</option>
                      <option value="sensor">Sensor</option>
                    </select>
                  </div>

                  {itemForm.type === 'camera' && (
                    <>
                      <div>
                        <Label>IP Address</Label>
                        <Input
                          value={itemForm.ip}
                          onChange={(e) =>
                            setItemForm({ ...itemForm, ip: e.target.value })
                          }
                          placeholder="192.168.1.100"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Direction</Label>
                        <select
                          value={itemForm.direction}
                          onChange={(e) =>
                            setItemForm({
                              ...itemForm,
                              direction: e.target.value,
                            })
                          }
                          className="w-full mt-2 p-2 rounded-md bg-background border border-input"
                        >
                          <option value="inbound">Inbound</option>
                          <option value="outbound">Outbound</option>
                          <option value="overview">Overview</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant={placementMode ? 'neon' : 'outline'}
                      onClick={() => setPlacementMode(!placementMode)}
                      className="flex-1"
                    >
                      <Move className="w-4 h-4 mr-2" />
                      {placementMode ? 'Placing...' : 'Click to Place'}
                    </Button>
                    <Button variant="neon" onClick={handleAddItem} className="flex-1">
                      Add at Center
                    </Button>
                  </div>
                </div>
              </Card>

              {selectedItem && (
                <Card className="p-6 border-2 border-neon-blue">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">
                      {selectedItem.type === 'camera' ? 'Camera' : 'Sensor'} Settings
                    </h3>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleDeleteItem}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Position X</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={selectedItem.position[0].toFixed(2)}
                        onChange={(e) => handleUpdatePosition('x', e.target.value)}
                        className="mt-1 h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Position Y (Height)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={selectedItem.position[1].toFixed(2)}
                        onChange={(e) => handleUpdatePosition('y', e.target.value)}
                        className="mt-1 h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Position Z</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={selectedItem.position[2].toFixed(2)}
                        onChange={(e) => handleUpdatePosition('z', e.target.value)}
                        className="mt-1 h-8"
                      />
                    </div>
                    {selectedItem.type === 'camera' && (
                      <div>
                        <Label className="text-xs">Rotation (degrees)</Label>
                        <Input
                          type="number"
                          step="5"
                          value={Math.round(selectedItem.rotation[1] * (180 / Math.PI))}
                          onChange={(e) => handleUpdateRotation(e.target.value)}
                          className="mt-1 h-8"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              )}

              <Card className="p-6">
                <h3 className="text-lg font-bold mb-2">Items Added</h3>
                <p className="text-sm text-gray-400">
                  Cameras: {itemCounts.cameras}
                  <br />
                  Sensors: {itemCounts.sensors}
                </p>
              </Card>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="max-w-2xl mx-auto p-8">
              <h2 className="text-2xl font-bold mb-6">Review Configuration</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">Garage Name</span>
                  <span className="font-semibold">{garageData.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">Levels</span>
                  <span className="font-semibold">{garageData.levels}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">Total Spaces</span>
                  <span className="font-semibold">
                    {garageData.levels * garageData.spotsPerLevel}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">Cameras</span>
                  <span className="font-semibold">
                    {items.filter((i) => i.type === 'camera').length}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">Sensors</span>
                  <span className="font-semibold">
                    {items.filter((i) => i.type === 'sensor').length}
                  </span>
                </div>
              </div>
              <Button variant="neon" onClick={handleSave} className="w-full">
                Create Garage
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-center gap-4 mt-8">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
        )}
        {step < 3 && (
          <Button variant="neon" onClick={() => setStep(step + 1)}>
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
