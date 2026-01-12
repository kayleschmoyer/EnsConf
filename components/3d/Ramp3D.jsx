'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Ramp3D({
  position = [0, 0, 0],
  direction = 'up', // 'up' or 'down'
  isSelected = false,
  onClick,
  onDrag,
}) {
  const groupRef = useRef()
  const rampRef = useRef()

  // Animation for selected state
  useFrame((state) => {
    if (groupRef.current && isSelected) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
    } else if (groupRef.current) {
      groupRef.current.position.y = position[1]
    }
  })

  // Color based on direction
  const rampColor = direction === 'up' ? '#ff8c42' : '#ff6b35'
  const arrowColor = direction === 'up' ? '#ffb347' : '#ff8c42'

  // Create arrow geometry
  const arrowGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0.5)
    shape.lineTo(0.3, 0)
    shape.lineTo(0.1, 0)
    shape.lineTo(0.1, -0.5)
    shape.lineTo(-0.1, -0.5)
    shape.lineTo(-0.1, 0)
    shape.lineTo(-0.3, 0)
    shape.closePath()

    return new THREE.ShapeGeometry(shape)
  }, [])

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
      onClick={onClick}
    >
      {/* Ramp base */}
      <mesh ref={rampRef} rotation={[0, 0, direction === 'up' ? -Math.PI / 6 : Math.PI / 6]}>
        <boxGeometry args={[3, 0.2, 5]} />
        <meshStandardMaterial
          color={rampColor}
          emissive={isSelected ? rampColor : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Side rails */}
      <mesh position={[1.6, 0.3, 0]}>
        <boxGeometry args={[0.1, 0.5, 5]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      <mesh position={[-1.6, 0.3, 0]}>
        <boxGeometry args={[0.1, 0.5, 5]} />
        <meshStandardMaterial color="#555555" />
      </mesh>

      {/* Direction arrow */}
      <mesh
        position={[0, 0.2, 0]}
        rotation={[
          -Math.PI / 2,
          0,
          direction === 'up' ? 0 : Math.PI,
        ]}
        geometry={arrowGeometry}
      >
        <meshStandardMaterial
          color={arrowColor}
          emissive={arrowColor}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Stripes for texture */}
      {[-1.5, -0.5, 0.5, 1.5].map((z, i) => (
        <mesh
          key={i}
          position={[0, 0.11, z]}
          rotation={[0, 0, direction === 'up' ? -Math.PI / 6 : Math.PI / 6]}
        >
          <boxGeometry args={[2.8, 0.01, 0.2]} />
          <meshStandardMaterial color="#ffffff" opacity={0.7} transparent />
        </mesh>
      ))}

      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2, 2.2, 32]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.6} />
        </mesh>
      )}

      {/* Label */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial
          color={direction === 'up' ? '#ff8c42' : '#ff6b35'}
          opacity={isSelected ? 1 : 0.7}
          transparent
        />
      </mesh>

      {/* Hover indicator */}
      <mesh position={[0, -0.3, 0]} visible={false}>
        <cylinderGeometry args={[2.5, 2.5, 0.1, 32]} />
        <meshBasicMaterial color={rampColor} transparent opacity={0.3} />
      </mesh>
    </group>
  )
}
