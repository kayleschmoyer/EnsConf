'use client'

import { memo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, PerspectiveCamera, Environment } from '@react-three/drei'
import * as THREE from 'three'
import Camera3D from './Camera3D'
import Sensor3D from './Sensor3D'
import FloorLevel from './FloorLevel'
import EntranceExit from './EntranceExit'

// Memoized scene component for better performance
const GarageScene = memo(function GarageScene({
  levels,
  spotsPerLevel,
  items,
  entrances = 1,
  exits = 1,
  selectedLevel = 0,
  onItemClick,
  selectedItem,
  onItemDrag,
  onFloorClick,
  placementMode = false,
}) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black rounded-lg overflow-hidden">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[25, 20, 25]} fov={50} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={15}
          maxDistance={60}
          dampingFactor={0.05}
          enableDamping={true}
        />

        {/* Optimized Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[15, 20, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <pointLight position={[-15, 15, -15]} intensity={0.4} color="#00d4ff" />
        <pointLight position={[15, 15, 15]} intensity={0.4} color="#7b2cbf" />

        {/* Atmospheric fog */}
        <fog attach="fog" args={['#0a0a0a', 30, 70]} />

        {/* Environment for better reflections */}
        <Environment preset="night" />

        {/* Garage Floors with highlighting for selected level */}
        {Array.from({ length: levels }).map((_, idx) => (
          <FloorLevel
            key={idx}
            level={idx}
            spotsPerLevel={spotsPerLevel}
            yPosition={idx * 3}
            isSelected={selectedLevel === idx}
            onFloorClick={onFloorClick}
            placementMode={placementMode}
          />
        ))}

        {/* Entrances and Exits */}
        {Array.from({ length: entrances }).map((_, idx) => (
          <EntranceExit
            key={`entrance-${idx}`}
            type="entrance"
            position={[-Math.ceil(Math.sqrt(spotsPerLevel)) * 1.25, 0.5, idx * 3 - 3]}
            rotation={[0, Math.PI / 2, 0]}
          />
        ))}
        {Array.from({ length: exits }).map((_, idx) => (
          <EntranceExit
            key={`exit-${idx}`}
            type="exit"
            position={[Math.ceil(Math.sqrt(spotsPerLevel)) * 1.25, 0.5, idx * 3 - 3]}
            rotation={[0, -Math.PI / 2, 0]}
          />
        ))}

        {/* Enhanced Grid */}
        <Grid
          args={[60, 60]}
          cellSize={1}
          cellThickness={0.6}
          cellColor="#00d4ff"
          sectionSize={5}
          sectionThickness={1.5}
          sectionColor="#7b2cbf"
          fadeDistance={50}
          fadeStrength={1}
          followCamera={false}
          position={[0, -0.01, 0]}
        />

        {/* 3D Items (Cameras & Sensors) - Memoized for performance */}
        {items.map((item) => {
          if (item.type === 'camera') {
            return (
              <Camera3D
                key={item.id}
                item={item}
                position={item.position}
                rotation={item.rotation}
                onClick={() => onItemClick(item)}
                isSelected={selectedItem?.id === item.id}
                onDrag={onItemDrag}
              />
            )
          } else if (item.type === 'sensor') {
            return (
              <Sensor3D
                key={item.id}
                item={item}
                position={item.position}
                onClick={() => onItemClick(item)}
                isSelected={selectedItem?.id === item.id}
                onDrag={onItemDrag}
              />
            )
          }
          return null
        })}

        {/* Axes Helper - smaller and less intrusive */}
        <axesHelper args={[3]} />
      </Canvas>
    </div>
  )
})

export default GarageScene
