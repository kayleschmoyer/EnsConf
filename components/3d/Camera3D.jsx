import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Camera3D({ position, rotation, onClick, isSelected }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <group position={position} rotation={rotation} onClick={onClick}>
      {/* Camera Body (Cone) */}
      <mesh
        ref={meshRef}
        castShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <coneGeometry args={[0.3, 0.8, 8]} />
        <meshStandardMaterial
          color={isSelected ? '#ff00ff' : hovered ? '#00f0ff' : '#0099cc'}
          emissive={isSelected ? '#ff00ff' : '#00f0ff'}
          emissiveIntensity={isSelected ? 0.8 : hovered ? 0.6 : 0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* FOV Indicator */}
      <mesh position={[0, 0, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[1.5, 3, 8, 1, true]} />
        <meshBasicMaterial
          color="#00f0ff"
          opacity={isSelected ? 0.3 : 0.15}
          transparent
          side={THREE.DoubleSide}
          wireframe
        />
      </mesh>

      {/* Selection Ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <ringGeometry args={[0.5, 0.7, 32]} />
          <meshBasicMaterial color="#ff00ff" opacity={0.5} transparent />
        </mesh>
      )}
    </group>
  )
}
