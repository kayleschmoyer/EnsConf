import { useRef, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Memoized entrance/exit component
const EntranceExit = memo(function EntranceExit({ type, position, rotation }) {
  const arrowRef = useRef()
  const isEntrance = type === 'entrance'

  // Subtle pulsing animation
  useFrame((state) => {
    if (arrowRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      arrowRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group position={position} rotation={rotation}>
      {/* Base platform */}
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <boxGeometry args={[2, 0.2, 4]} />
        <meshStandardMaterial
          color={isEntrance ? '#27ae60' : '#e74c3c'}
          metalness={0.4}
          roughness={0.6}
          emissive={isEntrance ? '#27ae60' : '#e74c3c'}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Arrow indicator */}
      <mesh ref={arrowRef} position={[0, 0.2, 0]} castShadow>
        <coneGeometry args={[0.6, 1.2, 4]} />
        <meshStandardMaterial
          color={isEntrance ? '#2ecc71' : '#ff6b6b'}
          emissive={isEntrance ? '#2ecc71' : '#ff6b6b'}
          emissiveIntensity={0.7}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Directional lines */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.05, -1.5 - i * 0.8]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.5, 0.3]} />
          <meshBasicMaterial
            color={isEntrance ? '#2ecc71' : '#ff6b6b'}
            opacity={0.6 - i * 0.15}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Side markers */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 1.2, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 1.5, 8]} />
          <meshStandardMaterial
            color={isEntrance ? '#27ae60' : '#e74c3c'}
            emissive={isEntrance ? '#27ae60' : '#e74c3c'}
            emissiveIntensity={0.5}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Overhead sign */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[2.5, 0.5, 0.1]} />
        <meshStandardMaterial
          color={isEntrance ? '#1e8449' : '#c0392b'}
          metalness={0.8}
          roughness={0.2}
          emissive={isEntrance ? '#2ecc71' : '#ff6b6b'}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Light beams */}
      <pointLight
        position={[0, 1.8, 0]}
        intensity={0.8}
        distance={8}
        color={isEntrance ? '#2ecc71' : '#ff6b6b'}
        decay={2}
      />
    </group>
  )
})

export default EntranceExit
