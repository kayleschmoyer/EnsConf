import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Sensor3D({ position, onClick, isSelected }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      if (isSelected) {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1)
      }
    }
  })

  return (
    <group position={position} onClick={onClick}>
      {/* Sensor Sphere */}
      <mesh
        ref={meshRef}
        castShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={isSelected ? '#00ff88' : hovered ? '#b000ff' : '#6600aa'}
          emissive={isSelected ? '#00ff88' : '#b000ff'}
          emissiveIntensity={isSelected ? 0.8 : hovered ? 0.6 : 0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Sensor Rings */}
      {[1, 1.5, 2].map((scale, idx) => (
        <mesh key={idx} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[scale * 0.3, scale * 0.35, 32]} />
          <meshBasicMaterial
            color="#b000ff"
            opacity={0.3 - idx * 0.1}
            transparent
          />
        </mesh>
      ))}

      {/* Selection Indicator */}
      {isSelected && (
        <mesh position={[0, 0.8, 0]}>
          <coneGeometry args={[0.1, 0.3, 8]} />
          <meshBasicMaterial color="#00ff88" />
        </mesh>
      )}
    </group>
  )
}
