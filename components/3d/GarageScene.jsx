'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import Camera3D from './Camera3D'
import Sensor3D from './Sensor3D'
import FloorLevel from './FloorLevel'

export default function GarageScene({ levels, spotsPerLevel, items, onItemClick, selectedItem }) {
  return (
    <div className="w-full h-full bg-black/50 rounded-lg overflow-hidden">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[20, 15, 20]} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={10}
          maxDistance={50}
        />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#00f0ff" />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#b000ff" />

        {/* Environment */}
        <fog attach="fog" args={['#0a0a0a', 20, 60]} />

        {/* Garage Floors */}
        {Array.from({ length: levels }).map((_, idx) => (
          <FloorLevel
            key={idx}
            level={idx}
            spotsPerLevel={spotsPerLevel}
            yPosition={idx * 3}
          />
        ))}

        {/* Grid */}
        <Grid
          args={[50, 50]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#00f0ff"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#b000ff"
          fadeDistance={40}
          fadeStrength={1}
          followCamera={false}
          position={[0, -0.01, 0]}
        />

        {/* 3D Items (Cameras & Sensors) */}
        {items.map((item) => {
          if (item.type === 'camera') {
            return (
              <Camera3D
                key={item.id}
                position={item.position}
                rotation={item.rotation}
                onClick={() => onItemClick(item)}
                isSelected={selectedItem?.id === item.id}
              />
            )
          } else if (item.type === 'sensor') {
            return (
              <Sensor3D
                key={item.id}
                position={item.position}
                onClick={() => onItemClick(item)}
                isSelected={selectedItem?.id === item.id}
              />
            )
          }
          return null
        })}

        {/* Axes Helper */}
        <axesHelper args={[5]} />
      </Canvas>
    </div>
  )
}
