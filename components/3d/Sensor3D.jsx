import { useRef, useState, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import { DragControls } from '@react-three/drei'
import * as THREE from 'three'

// Memoized sensor component for better performance
const Sensor3D = memo(function Sensor3D({ item, position, onClick, isSelected, onDrag }) {
  const meshRef = useRef()
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Only animate when selected or hovered - significant performance improvement
  useFrame((state) => {
    if (meshRef.current && !isDragging) {
      // Slow rotation only when visible
      if (isSelected || hovered) {
        meshRef.current.rotation.y += 0.02
      }
      // Pulsing animation when selected
      if (isSelected) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.12
        meshRef.current.scale.setScalar(scale)
      } else {
        meshRef.current.scale.setScalar(1)
      }
    }
  })

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
          <sphereGeometry args={[0.35, 20, 20]} />
          <meshStandardMaterial
            color={isSelected ? '#00ff88' : hovered ? '#7b2cbf' : '#34495e'}
            emissive={isSelected ? '#00ff88' : '#7b2cbf'}
            emissiveIntensity={isSelected ? 0.9 : hovered ? 0.7 : 0.4}
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>

        {/* Sensor Core - glowing center */}
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial
            color={isSelected ? '#00ff88' : '#7b2cbf'}
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
                color={isSelected ? '#00ff88' : '#7b2cbf'}
                opacity={0.4 - idx * 0.1}
                transparent
              />
            </mesh>
          ))}

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
