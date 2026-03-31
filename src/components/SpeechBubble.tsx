import React, { useRef, useState, useEffect } from 'react';
import { Text, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SpeechBubbleProps {
  message: string;
  speakerName: string;
  onComplete?: () => void;
  duration?: number;
}

export function SpeechBubble({ message, speakerName, onComplete, duration = 4000 }: SpeechBubbleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [opacity, setOpacity] = useState(0);
  const [visible, setVisible] = useState(true);
  const startTime = useRef(Date.now());

  useFrame((state) => {
    if (groupRef.current) {
      // Billboard effect: Always face the camera
      groupRef.current.quaternion.copy(state.camera.quaternion);
      
      const elapsed = Date.now() - startTime.current;
      
      // Fade in (first 500ms)
      if (elapsed < 500) {
        setOpacity(elapsed / 500);
      } 
      // Fade out (last 500ms)
      else if (elapsed > duration - 500) {
        const fadeOut = Math.max(0, 1 - (elapsed - (duration - 500)) / 500);
        setOpacity(fadeOut);
        if (fadeOut === 0 && visible) {
          setVisible(false);
          onComplete?.();
        }
      } else {
        setOpacity(1);
      }
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={[0, 2.5, 0]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[2.5, 1]} />
          <meshBasicMaterial 
            color="white" 
            transparent 
            opacity={opacity * 0.9} 
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Border */}
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[2.6, 1.1]} />
          <meshBasicMaterial 
            color="black" 
            transparent 
            opacity={opacity * 0.5} 
            side={THREE.DoubleSide}
          />
        </mesh>

        <Text
          position={[0, 0.2, 0.01]}
          fontSize={0.12}
          color="gray"
          anchorX="center"
          anchorY="middle"
          fillOpacity={opacity}
        >
          {speakerName}
        </Text>

        <Text
          position={[0, -0.1, 0.01]}
          fontSize={0.18}
          color="black"
          maxWidth={2.2}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          fillOpacity={opacity}
        >
          {message}
        </Text>
      </Float>
    </group>
  );
}
