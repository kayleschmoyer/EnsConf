import { useRef, useState, memo } from 'react'
import { DragControls } from '@react-three/drei'
import * as THREE from 'three'

// Memoized camera component for better performance
const Camera3D = memo(function Camera3D({ item, position, rotation, onClick, isSelected, onDrag }) {
  const meshRef = useRef()
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Get camera direction
  const direction = item.direction || 'overview'

  // Define colors based on direction
  const directionColors = {
    inbound: { base: '#22c55e', emissive: '#16a34a' }, // Green for inbound
    outbound: { base: '#ef4444', emissive: '#dc2626' }, // Red for outbound
    overview: { base: '#3b82f6', emissive: '#2563eb' }, // Blue for overview
  }

  const colors = directionColors[direction] || directionColors.overview

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDrag = (localMatrix) => {
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
        rotation={rotation}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
      >
        {/* Camera Body (Cone) - More realistic design */}
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
          <coneGeometry args={[0.35, 0.9, 8]} />
          <meshStandardMaterial
            color={isSelected ? '#ff3366' : hovered ? colors.base : '#2c3e50'}
          />
        </mesh>

        {/* Direction indicator light */}
        <mesh position={[0, 0.5, 0.3]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial
            color={colors.base}
            opacity={0.9}
            transparent
          />
        </mesh>

        {/* Camera Lens */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>

        {/* FOV Indicator - Only show when selected or hovered */}
        {(isSelected || hovered) && (
          <mesh position={[0, 0, -2]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[2, 4, 8, 1, true]} />
            <meshBasicMaterial
              color={isSelected ? '#ff3366' : colors.base}
              opacity={isSelected ? 0.25 : 0.15}
              transparent
              side={THREE.DoubleSide}
              wireframe
            />
          </mesh>
        )}

        {/* Selection Ring with pulsing animation */}
        {isSelected && (
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
            <ringGeometry args={[0.6, 0.8, 32]} />
            <meshBasicMaterial color="#ff3366" opacity={0.6} transparent />
          </mesh>
        )}

        {/* Label indicator */}
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial
            color={isSelected ? '#ff3366' : '#00d4ff'}
            opacity={0.8}
            transparent
          />
        </mesh>
      </group>
    </DragControls>
  )
})

export default Camera3D
