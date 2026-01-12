import { useRef, memo } from 'react'
import * as THREE from 'three'

// Memoized floor component for better performance
const FloorLevel = memo(function FloorLevel({
  level,
  spotsPerLevel,
  yPosition,
  isSelected = false,
  onFloorClick,
  placementMode = false,
}) {
  const floorRef = useRef()

  // Calculate floor dimensions based on spots
  const width = Math.ceil(Math.sqrt(spotsPerLevel)) * 2.5
  const depth = Math.ceil(Math.sqrt(spotsPerLevel)) * 2.5
  const rows = Math.ceil(Math.sqrt(spotsPerLevel))
  const cols = Math.ceil(Math.sqrt(spotsPerLevel))

  const handleFloorClick = (event) => {
    if (placementMode && isSelected) {
      event.stopPropagation()
      const point = event.point
      onFloorClick([point.x, yPosition + 0.5, point.z])
    }
  }

  return (
    <group position={[0, yPosition, 0]}>
      {/* Main Floor - Modern concrete appearance */}
      <mesh
        ref={floorRef}
        receiveShadow
        position={[0, 0, 0]}
        onClick={handleFloorClick}
        onPointerOver={(e) => {
          if (placementMode && isSelected) {
            e.stopPropagation()
            document.body.style.cursor = 'crosshair'
          }
        }}
        onPointerOut={(e) => {
          if (placementMode && isSelected) {
            e.stopPropagation()
            document.body.style.cursor = 'default'
          }
        }}
      >
        <boxGeometry args={[width, 0.3, depth]} />
        <meshStandardMaterial
          color={isSelected ? '#2c3e50' : '#1a252f'}
          metalness={0.3}
          roughness={0.8}
          emissive={isSelected ? '#00d4ff' : '#001a1f'}
          emissiveIntensity={isSelected ? 0.15 : 0.03}
        />
      </mesh>

      {/* Floor outline - Highlighted when selected */}
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(width, 0.3, depth)]} />
        <lineBasicMaterial
          attach="material"
          color={isSelected ? '#00d4ff' : '#34495e'}
          linewidth={isSelected ? 3 : 2}
          opacity={isSelected ? 1 : 0.6}
          transparent
        />
      </lineSegments>

      {/* Parking spots grid - More realistic */}
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: cols }).map((_, col) => {
          const x = (col - cols / 2) * 2.5
          const z = (row - rows / 2) * 2.5

          return (
            <group key={`${row}-${col}`} position={[x, 0.16, z]}>
              {/* Parking spot marking */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2.2, 1.9]} />
                <meshBasicMaterial
                  color={isSelected ? '#00d4ff' : '#34495e'}
                  opacity={isSelected ? 0.2 : 0.12}
                  transparent
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Parking spot border lines */}
              <lineSegments position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <edgesGeometry
                  attach="geometry"
                  args={[new THREE.PlaneGeometry(2.2, 1.9)]}
                />
                <lineBasicMaterial
                  color={isSelected ? '#00d4ff' : '#556b2f'}
                  opacity={isSelected ? 0.5 : 0.3}
                  transparent
                />
              </lineSegments>
            </group>
          )
        })
      )}

      {/* Level number indicator - Improved visibility */}
      <mesh position={[width / 2 + 1.5, 1, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 1.5, 8]} />
        <meshStandardMaterial
          color={isSelected ? '#00d4ff' : '#7b2cbf'}
          emissive={isSelected ? '#00d4ff' : '#7b2cbf'}
          emissiveIntensity={isSelected ? 0.8 : 0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Level number top indicator */}
      <mesh position={[width / 2 + 1.5, 1.9, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial
          color={isSelected ? '#00d4ff' : '#7b2cbf'}
          emissive={isSelected ? '#00d4ff' : '#7b2cbf'}
          emissiveIntensity={isSelected ? 1 : 0.6}
        />
      </mesh>

      {/* Support columns for realism - only show on upper levels */}
      {level > 0 && (
        <>
          {[-width / 3, 0, width / 3].map((x, i) =>
            [-depth / 3, depth / 3].map((z, j) => (
              <mesh
                key={`column-${i}-${j}`}
                position={[x, -1.35, z]}
                castShadow
                receiveShadow
              >
                <cylinderGeometry args={[0.3, 0.3, 2.7, 8]} />
                <meshStandardMaterial
                  color="#2c3e50"
                  metalness={0.5}
                  roughness={0.7}
                />
              </mesh>
            ))
          )}
        </>
      )}

      {/* Ramps indicator at edges - for visual realism */}
      {level < 9 && (
        <>
          <mesh position={[0, 0.2, depth / 2 + 0.5]} castShadow>
            <boxGeometry args={[3, 0.1, 1]} />
            <meshStandardMaterial
              color="#34495e"
              metalness={0.4}
              roughness={0.6}
              emissive="#7b2cbf"
              emissiveIntensity={0.2}
            />
          </mesh>
        </>
      )}

      {/* Placement cursor - shows where item will be placed */}
      {placementMode && isSelected && (
        <mesh position={[0, 0.5, 0]}>
          <ringGeometry args={[0.8, 1, 32]} />
          <meshBasicMaterial color="#00ff88" opacity={0.6} transparent side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
})

export default FloorLevel
