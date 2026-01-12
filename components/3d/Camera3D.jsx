import { useRef, useState, memo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { DragControls } from '@react-three/drei'
import * as THREE from 'three'

// Memoized camera component for better performance
const Camera3D = memo(function Camera3D({ item, position, rotation, onClick, isSelected, onDrag }) {
  const meshRef = useRef()
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Only animate when selected - significant performance improvement
  useFrame((state) => {
    if (meshRef.current && isSelected && !isDragging) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.15
    }
  })

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
          castShadow
          receiveShadow
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
            color={isSelected ? '#ff3366' : hovered ? '#00d4ff' : '#2c3e50'}
            emissive={isSelected ? '#ff3366' : '#00d4ff'}
            emissiveIntensity={isSelected ? 0.9 : hovered ? 0.7 : 0.4}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>

        {/* Camera Lens */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={1}
            roughness={0.1}
            emissive="#ffffff"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* FOV Indicator - Only show when selected or hovered */}
        {(isSelected || hovered) && (
          <mesh position={[0, 0, -2]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[2, 4, 8, 1, true]} />
            <meshBasicMaterial
              color={isSelected ? '#ff3366' : '#00d4ff'}
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
