'use client'

import { memo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import Camera3D from './Camera3D'
import Sensor3D from './Sensor3D'
import FloorLevel from './FloorLevel'
import EntranceExit from './EntranceExit'
import Ramp3D from './Ramp3D'

// Memoized scene component for better performance
const GarageScene = memo(function GarageScene({
  levelsData = [], // New per-level data structure
  selectedLevel = 0,
  onItemClick,
  selectedItem,
  onItemDrag,
  onFloorClick,
  placementMode = false,
}) {
  // Get current level data
  const currentLevelData = levelsData[selectedLevel] || {
    cameras: [],
    sensors: [],
    entrances: [],
    exits: [],
    ramps: [],
    spotsPerLevel: 50,
  }
  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black rounded-lg overflow-hidden">
      <Canvas dpr={[1, 1]}>
        <PerspectiveCamera makeDefault position={[25, 20, 25]} fov={50} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={15}
          maxDistance={60}
        />

        {/* Simple Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[15, 20, 10]} intensity={0.8} />

        {/* Garage Floors with highlighting for selected level */}
        {levelsData.map((levelData, idx) => (
          <FloorLevel
            key={idx}
            level={idx}
            spotsPerLevel={levelData.spotsPerLevel || 50}
            yPosition={idx * 3}
            isSelected={selectedLevel === idx}
            onFloorClick={onFloorClick}
            placementMode={placementMode}
          />
        ))}

        {/* Entrances for current level */}
        {currentLevelData.entrances?.map((entrance, idx) => (
          <EntranceExit
            key={`entrance-${entrance.id || idx}`}
            type="entrance"
            position={entrance.position || [-10, selectedLevel * 3 + 0.5, 0]}
            rotation={[0, Math.PI / 2, 0]}
            onClick={() => onItemClick({ ...entrance, type: 'entrance' })}
            isSelected={selectedItem?.id === entrance.id && selectedItem?.type === 'entrance'}
          />
        ))}

        {/* Exits for current level */}
        {currentLevelData.exits?.map((exit, idx) => (
          <EntranceExit
            key={`exit-${exit.id || idx}`}
            type="exit"
            position={exit.position || [10, selectedLevel * 3 + 0.5, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            onClick={() => onItemClick({ ...exit, type: 'exit' })}
            isSelected={selectedItem?.id === exit.id && selectedItem?.type === 'exit'}
          />
        ))}

        {/* Simple Grid */}
        <Grid
          args={[60, 60]}
          cellSize={1}
          cellColor="#333333"
          sectionSize={5}
          sectionColor="#555555"
          position={[0, -0.01, 0]}
        />

        {/* Cameras for current level */}
        {currentLevelData.cameras?.map((camera) => (
          <Camera3D
            key={camera.id}
            item={camera}
            position={camera.position || [0, selectedLevel * 3 + 1, 0]}
            rotation={camera.rotation || [0, 0, 0]}
            onClick={() => onItemClick({ ...camera, type: 'camera' })}
            isSelected={selectedItem?.id === camera.id && selectedItem?.type === 'camera'}
            onDrag={onItemDrag}
          />
        ))}

        {/* Sensors for current level */}
        {currentLevelData.sensors?.map((sensor) => (
          <Sensor3D
            key={sensor.id}
            item={sensor}
            position={sensor.position || [0, selectedLevel * 3 + 0.5, 0]}
            onClick={() => onItemClick({ ...sensor, type: 'sensor' })}
            isSelected={selectedItem?.id === sensor.id && selectedItem?.type === 'sensor'}
            onDrag={onItemDrag}
          />
        ))}

        {/* Ramps for current level */}
        {currentLevelData.ramps?.map((ramp) => (
          <Ramp3D
            key={ramp.id}
            position={ramp.position || [0, selectedLevel * 3, 0]}
            direction={ramp.direction}
            onClick={() => onItemClick({ ...ramp, type: `ramp-${ramp.direction}` })}
            isSelected={selectedItem?.id === ramp.id}
            onDrag={onItemDrag}
          />
        ))}

        {/* Axes Helper - smaller and less intrusive */}
        <axesHelper args={[3]} />
      </Canvas>
    </div>
  )
})

export default GarageScene
