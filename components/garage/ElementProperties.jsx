'use client'

import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2, Move } from 'lucide-react'

export default function ElementProperties({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
}) {
  if (!selectedElement) {
    return (
      <Card className="p-4">
        <div className="text-center text-sm text-muted-foreground py-8">
          Select an element to view and edit its properties
        </div>
      </Card>
    )
  }

  const { type, data } = selectedElement

  const handleChange = (field, value) => {
    onUpdateElement({
      ...selectedElement,
      data: {
        ...data,
        [field]: value,
      },
    })
  }

  const renderProperties = () => {
    switch (type) {
      case 'sensor':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="sensor-id">Sensor ID</Label>
              <Input
                id="sensor-id"
                value={data.id || ''}
                onChange={(e) => handleChange('id', e.target.value)}
                placeholder="e.g., sensor-001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sensor-type">Sensor Type</Label>
              <Select
                value={data.type || 'normal'}
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger id="sensor-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal Parking</SelectItem>
                  <SelectItem value="EV">EV Charging</SelectItem>
                  <SelectItem value="handicap">Handicap Accessible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label htmlFor="sensor-x">X Position</Label>
                <Input
                  id="sensor-x"
                  type="number"
                  step="0.1"
                  value={data.position?.[0] || 0}
                  onChange={(e) =>
                    handleChange('position', [
                      parseFloat(e.target.value),
                      data.position?.[1] || 0,
                      data.position?.[2] || 0,
                    ])
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sensor-y">Y Position</Label>
                <Input
                  id="sensor-y"
                  type="number"
                  step="0.1"
                  value={data.position?.[1] || 0}
                  onChange={(e) =>
                    handleChange('position', [
                      data.position?.[0] || 0,
                      parseFloat(e.target.value),
                      data.position?.[2] || 0,
                    ])
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sensor-z">Z Position</Label>
                <Input
                  id="sensor-z"
                  type="number"
                  step="0.1"
                  value={data.position?.[2] || 0}
                  onChange={(e) =>
                    handleChange('position', [
                      data.position?.[0] || 0,
                      data.position?.[1] || 0,
                      parseFloat(e.target.value),
                    ])
                  }
                />
              </div>
            </div>
          </>
        )

      case 'camera':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="camera-id">Camera ID</Label>
              <Input
                id="camera-id"
                value={data.id || ''}
                onChange={(e) => handleChange('id', e.target.value)}
                placeholder="e.g., cam-001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="camera-ip">IP Address</Label>
              <Input
                id="camera-ip"
                value={data.ip || ''}
                onChange={(e) => handleChange('ip', e.target.value)}
                placeholder="e.g., 192.168.1.100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="camera-direction">Direction</Label>
              <Select
                value={data.direction || 'overview'}
                onValueChange={(value) => handleChange('direction', value)}
              >
                <SelectTrigger id="camera-direction">
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="inbound">Inbound</SelectItem>
                  <SelectItem value="outbound">Outbound</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="camera-rotation">Rotation (degrees)</Label>
              <Input
                id="camera-rotation"
                type="number"
                step="15"
                min="0"
                max="360"
                value={
                  data.rotation?.[1] ? Math.round((data.rotation[1] * 180) / Math.PI) : 0
                }
                onChange={(e) => {
                  const degrees = parseFloat(e.target.value)
                  const radians = (degrees * Math.PI) / 180
                  handleChange('rotation', [0, radians, 0])
                }}
              />
            </div>
          </>
        )

      case 'entrance':
      case 'exit':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="element-id">
                {type === 'entrance' ? 'Entrance' : 'Exit'} ID
              </Label>
              <Input
                id="element-id"
                value={data.id || ''}
                onChange={(e) => handleChange('id', e.target.value)}
                placeholder={`e.g., ${type}-001`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="element-name">Name (Optional)</Label>
              <Input
                id="element-name"
                value={data.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Main Entrance"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label htmlFor="element-x">X Position</Label>
                <Input
                  id="element-x"
                  type="number"
                  step="0.1"
                  value={data.position?.[0] || 0}
                  onChange={(e) =>
                    handleChange('position', [
                      parseFloat(e.target.value),
                      data.position?.[1] || 0,
                      data.position?.[2] || 0,
                    ])
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="element-y">Y Position</Label>
                <Input
                  id="element-y"
                  type="number"
                  step="0.1"
                  value={data.position?.[1] || 0}
                  onChange={(e) =>
                    handleChange('position', [
                      data.position?.[0] || 0,
                      parseFloat(e.target.value),
                      data.position?.[2] || 0,
                    ])
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="element-z">Z Position</Label>
                <Input
                  id="element-z"
                  type="number"
                  step="0.1"
                  value={data.position?.[2] || 0}
                  onChange={(e) =>
                    handleChange('position', [
                      data.position?.[0] || 0,
                      data.position?.[1] || 0,
                      parseFloat(e.target.value),
                    ])
                  }
                />
              </div>
            </div>
          </>
        )

      case 'ramp-up':
      case 'ramp-down':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="ramp-id">Ramp ID</Label>
              <Input
                id="ramp-id"
                value={data.id || ''}
                onChange={(e) => handleChange('id', e.target.value)}
                placeholder="e.g., ramp-001"
              />
            </div>

            <div className="space-y-2">
              <Label>Direction</Label>
              <div className="text-sm text-muted-foreground">
                {type === 'ramp-up' ? 'Up ↑' : 'Down ↓'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label htmlFor="ramp-x">X Position</Label>
                <Input
                  id="ramp-x"
                  type="number"
                  step="0.1"
                  value={data.position?.[0] || 0}
                  onChange={(e) =>
                    handleChange('position', [
                      parseFloat(e.target.value),
                      data.position?.[1] || 0,
                      data.position?.[2] || 0,
                    ])
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ramp-y">Y Position</Label>
                <Input
                  id="ramp-y"
                  type="number"
                  step="0.1"
                  value={data.position?.[1] || 0}
                  onChange={(e) =>
                    handleChange('position', [
                      data.position?.[0] || 0,
                      parseFloat(e.target.value),
                      data.position?.[2] || 0,
                    ])
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ramp-z">Z Position</Label>
                <Input
                  id="ramp-z"
                  type="number"
                  step="0.1"
                  value={data.position?.[2] || 0}
                  onChange={(e) =>
                    handleChange('position', [
                      data.position?.[0] || 0,
                      data.position?.[1] || 0,
                      parseFloat(e.target.value),
                    ])
                  }
                />
              </div>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Move className="w-5 h-5" />
          Element Properties
        </h3>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDeleteElement}
          className="gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>

      <div className="space-y-4">{renderProperties()}</div>
    </Card>
  )
}
