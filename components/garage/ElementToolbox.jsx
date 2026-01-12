'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DoorOpen,
  DoorClosed,
  Camera,
  Radio,
  ArrowUp,
  ArrowDown,
  Plus
} from 'lucide-react'

const elementTypes = [
  {
    type: 'entrance',
    label: 'Add Entrance',
    icon: DoorOpen,
    color: 'text-green-600',
    bgColor: 'hover:bg-green-50',
  },
  {
    type: 'exit',
    label: 'Add Exit',
    icon: DoorClosed,
    color: 'text-red-600',
    bgColor: 'hover:bg-red-50',
  },
  {
    type: 'camera',
    label: 'Add Camera',
    icon: Camera,
    color: 'text-blue-600',
    bgColor: 'hover:bg-blue-50',
  },
  {
    type: 'sensor',
    label: 'Add Sensor',
    icon: Radio,
    color: 'text-purple-600',
    bgColor: 'hover:bg-purple-50',
  },
  {
    type: 'ramp-up',
    label: 'Ramp Up',
    icon: ArrowUp,
    color: 'text-orange-600',
    bgColor: 'hover:bg-orange-50',
  },
  {
    type: 'ramp-down',
    label: 'Ramp Down',
    icon: ArrowDown,
    color: 'text-orange-600',
    bgColor: 'hover:bg-orange-50',
  },
]

export default function ElementToolbox({ onAddElement, selectedElement, disabled = false }) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5" />
        Add Elements
      </h3>

      <div className="grid grid-cols-2 gap-2">
        {elementTypes.map((element) => {
          const Icon = element.icon
          return (
            <Button
              key={element.type}
              variant="outline"
              className={`flex flex-col items-center justify-center h-24 gap-2 ${element.bgColor} ${
                selectedElement === element.type ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onAddElement(element.type)}
              disabled={disabled}
            >
              <Icon className={`w-8 h-8 ${element.color}`} />
              <span className="text-xs font-medium">{element.label}</span>
            </Button>
          )
        })}
      </div>

      {selectedElement && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Click on the 3D canvas to place the{' '}
            <span className="font-semibold">
              {elementTypes.find((e) => e.type === selectedElement)?.label}
            </span>
          </p>
        </div>
      )}
    </Card>
  )
}
