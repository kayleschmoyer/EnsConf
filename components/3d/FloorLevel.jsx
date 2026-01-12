import { useRef } from 'react'
import * as THREE from 'three'

export default function FloorLevel({ level, spotsPerLevel, yPosition }) {
  const floorRef = useRef()

  // Calculate floor dimensions based on spots
  const width = Math.ceil(Math.sqrt(spotsPerLevel)) * 2.5
  const depth = Math.ceil(Math.sqrt(spotsPerLevel)) * 2.5

  return (
    <group position={[0, yPosition, 0]}>
      {/* Floor */}
      <mesh ref={floorRef} receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[width, 0.2, depth]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.8}
          roughness={0.2}
          emissive="#00f0ff"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Floor outline */}
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(width, 0.2, depth)]} />
        <lineBasicMaterial attach="material" color="#00f0ff" linewidth={2} />
      </lineSegments>

      {/* Parking spots grid */}
      {Array.from({ length: Math.ceil(Math.sqrt(spotsPerLevel)) }).map((_, row) =>
        Array.from({ length: Math.ceil(Math.sqrt(spotsPerLevel)) }).map((_, col) => {
          const x = (col - Math.ceil(Math.sqrt(spotsPerLevel)) / 2) * 2.5
          const z = (row - Math.ceil(Math.sqrt(spotsPerLevel)) / 2) * 2.5

          return (
            <mesh key={`${row}-${col}`} position={[x, 0.11, z]}>
              <planeGeometry args={[2, 1.8]} />
              <meshBasicMaterial
                color="#00f0ff"
                opacity={0.1}
                transparent
                side={THREE.DoubleSide}
              />
            </mesh>
          )
        })
      )}

      {/* Level label */}
      <mesh position={[width / 2 + 1, 0.5, 0]}>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <meshStandardMaterial
          color="#b000ff"
          emissive="#b000ff"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  )
}
