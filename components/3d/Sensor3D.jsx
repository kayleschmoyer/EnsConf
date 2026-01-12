import { useRef, useState, memo } from 'react'
import { DragControls } from '@react-three/drei'
import * as THREE from 'three'

// Memoized sensor component for better performance
const Sensor3D = memo(function Sensor3D({ item, position, onClick, isSelected, onDrag }) {
  const meshRef = useRef()
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Get sensor type from item data
  const sensorType = item.type || 'normal'

  // Define colors based on sensor type
  const sensorColors = {
    EV: { base: '#22c55e', emissive: '#16a34a', icon: '⚡' }, // Green for EV
    handicap: { base: '#3b82f6', emissive: '#2563eb', icon: '♿' }, // Blue for handicap
    normal: { base: '#7b2cbf', emissive: '#6a1b9a', icon: 'P' }, // Purple for normal
  }

  const colors = sensorColors[sensorType] || sensorColors.normal

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDrag = () => {
    if (groupRef.current) {
      const worldPosition = new THREE.Vector3()
      groupRef.current.getWorldPosition(worldPosition)
      onDrag(item.id, [worldPosition.x, worldPosition.y, worldPosition.z])
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    if (groupRef.current) {
      const worldPosition = new THREE.Vector3()
      groupRef.current.getWorldPosition(worldPosition)
      onDrag(item.id, [worldPosition.x, worldPosition.y, worldPosition.z])
    }
  }

  return (
    <DragControls
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    >
      <group
        ref={groupRef}
        position={position}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
      >
        {/* Sensor Sphere - More realistic design */}
        <mesh
          ref={meshRef}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
            document.body.style.cursor = 'grab'
          }}
          onPointerOut={(e) => {
            e.stopPropagation()
            setHovered(false)
            document.body.style.cursor = 'default'
          }}
        >
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial
            color={isSelected ? '#00ff88' : hovered ? colors.base : '#34495e'}
          />
        </mesh>

        {/* Sensor Core - glowing center */}
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial
            color={isSelected ? '#00ff88' : colors.base}
            opacity={0.9}
            transparent
          />
        </mesh>

        {/* Sensor Rings - only show when selected or hovered */}
        {(isSelected || hovered) &&
          [1.2, 1.6, 2.0].map((scale, idx) => (
            <mesh key={idx} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[scale * 0.3, scale * 0.35, 32]} />
              <meshBasicMaterial
                color={isSelected ? '#00ff88' : colors.base}
                opacity={0.4 - idx * 0.1}
                transparent
              />
            </mesh>
          ))}

        {/* Type indicator label */}
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color={colors.base} />
        </mesh>

        {/* Selection Indicator */}
        {isSelected && (
          <>
            <mesh position={[0, 0.9, 0]}>
              <coneGeometry args={[0.15, 0.4, 8]} />
              <meshBasicMaterial color="#00ff88" opacity={0.8} transparent />
            </mesh>
            {/* Selection ring at base */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
              <ringGeometry args={[0.5, 0.65, 32]} />
              <meshBasicMaterial color="#00ff88" opacity={0.6} transparent />
            </mesh>
          </>
        )}

        {/* Coverage area indicator */}
        {isSelected && (
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1.5, 16, 16]} />
            <meshBasicMaterial
              color="#00ff88"
              opacity={0.08}
              transparent
              wireframe
            />
          </mesh>
        )}
      </group>
    </DragControls>
  )
})

export default Sensor3D
