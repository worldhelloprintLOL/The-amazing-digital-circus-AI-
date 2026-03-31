/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Float, PerspectiveCamera, Environment, ContactShadows, Sky, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Map as MapIcon, 
  Settings, 
  Zap, 
  Skull, 
  MessageSquare, 
  Eye, 
  Home, 
  Tent, 
  Info,
  X,
  History
} from 'lucide-react';
import { Character, WorldObject, Adventure, HumanStats } from './types';
import { generateDialogue, generateBuildingPlan } from './services/ai';
import { createHuman, updateHumanStats } from './services/human';
import { CHARACTER_PROFILES } from './services/personality';
import { SpeechBubble } from './components/SpeechBubble';
import { DialogueManager, ConversationMessage } from './services/dialogue';

// --- Constants ---
const CIRCUS_CENTER: [number, number, number] = [0, 0, 0];
const CAINE_HQ_POS: [number, number, number] = [20, 0, 20];

// --- Components ---

function CharacterModel({ character }: { character: Character }) {
  if (character.type === 'caine') {
    return (
      <group>
        {/* Body - Red Suit */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 1, 16]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
        {/* Head */}
        <group position={[0, 1.2, 0]}>
          {/* Top Teeth */}
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.6, 0.2, 0.4]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          {/* Bottom Teeth */}
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[0.6, 0.2, 0.4]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          {/* Eyes */}
          <group position={[0, 0, 0.1]}>
            <mesh position={[-0.15, 0, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color="white" />
              <mesh position={[0, 0, 0.1]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial color="black" />
              </mesh>
            </mesh>
            <mesh position={[0.15, 0, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color="white" />
              <mesh position={[0, 0, 0.1]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial color="black" />
              </mesh>
            </mesh>
          </group>
          {/* Top Hat */}
          <group position={[0, 0.4, 0]}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.4, 0.4, 0.05, 16]} />
              <meshStandardMaterial color="black" />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.25, 0.25, 0.6, 16]} />
              <meshStandardMaterial color="black" />
            </mesh>
          </group>
        </group>
      </group>
    );
  }

  if (character.name === 'Pomni') {
    return (
      <group>
        {/* Body - Split Red and Blue */}
        <group position={[0, 0.5, 0]}>
          <mesh position={[-0.15, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 1, 16]} />
            <meshStandardMaterial color="#ff0000" />
          </mesh>
          <mesh position={[0.15, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 1, 16]} />
            <meshStandardMaterial color="#0000ff" />
          </mesh>
        </group>
        {/* Head */}
        <group position={[0, 1.2, 0]}>
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          {/* Eyes */}
          <group position={[0, 0.05, 0.2]}>
            <mesh position={[-0.1, 0, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="white" />
              <mesh position={[0, 0, 0.05]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial color="black" />
              </mesh>
            </mesh>
            <mesh position={[0.1, 0, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="white" />
              <mesh position={[0, 0, 0.05]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial color="black" />
              </mesh>
            </mesh>
          </group>
          {/* Jester Hat */}
          <group position={[0, 0.25, 0]}>
            {/* Left Point (Blue) */}
            <group rotation={[0, 0, Math.PI / 4]} position={[-0.2, 0.1, 0]}>
              <mesh>
                <cylinderGeometry args={[0.05, 0.15, 0.4, 16]} />
                <meshStandardMaterial color="#0000ff" />
              </mesh>
              <mesh position={[0, 0.25, 0]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshStandardMaterial color="#ffff00" />
              </mesh>
            </group>
            {/* Right Point (Red) */}
            <group rotation={[0, 0, -Math.PI / 4]} position={[0.2, 0.1, 0]}>
              <mesh>
                <cylinderGeometry args={[0.05, 0.15, 0.4, 16]} />
                <meshStandardMaterial color="#ff0000" />
              </mesh>
              <mesh position={[0, 0.25, 0]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshStandardMaterial color="#ffff00" />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    );
  }

  if (character.name === 'Jax') {
    return (
      <group>
        {/* Body */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 1, 16]} />
          <meshStandardMaterial color="#aa88ff" />
        </mesh>
        {/* Head */}
        <group position={[0, 1.2, 0]}>
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#aa88ff" />
          </mesh>
          {/* Ears */}
          <mesh position={[-0.15, 0.4, 0]} rotation={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.6, 16]} />
            <meshStandardMaterial color="#aa88ff" />
          </mesh>
          <mesh position={[0.15, 0.4, 0]} rotation={[0, 0, -0.2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.6, 16]} />
            <meshStandardMaterial color="#aa88ff" />
          </mesh>
          {/* Eyes */}
          <group position={[0, 0.05, 0.2]}>
            <mesh position={[-0.1, 0, 0]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color="#ffff00" />
              <mesh position={[0, 0, 0.04]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshStandardMaterial color="black" />
              </mesh>
            </mesh>
            <mesh position={[0.1, 0, 0]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color="#ffff00" />
              <mesh position={[0, 0, 0.04]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshStandardMaterial color="black" />
              </mesh>
            </mesh>
          </group>
        </group>
      </group>
    );
  }

  if (character.name === 'Ragatha') {
    return (
      <group>
        {/* Body (Dress) */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.2, 0.4, 1, 16]} />
          <meshStandardMaterial color="#4444ff" />
        </mesh>
        {/* Head */}
        <group position={[0, 1.2, 0]}>
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#ffccaa" />
          </mesh>
          {/* Hair (Red balls) */}
          {[...Array(12)].map((_, i) => (
            <mesh 
              key={`hair-${i}`} 
              position={[
                Math.sin(i * 0.5) * 0.32, 
                Math.cos(i * 0.5) * 0.32, 
                -0.1
              ]}
            >
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color="#ff0000" />
            </mesh>
          ))}
          {/* Eyes */}
          <group position={[0, 0.05, 0.25]}>
            <mesh position={[-0.1, 0, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="black" />
            </mesh>
            <mesh position={[0.1, 0, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="white" />
              <mesh position={[0, 0, 0.05]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial color="black" />
              </mesh>
            </mesh>
          </group>
        </group>
      </group>
    );
  }

  if (character.name === 'Kinger') {
    return (
      <group>
        {/* Body (Cloak) */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.1, 0.5, 1, 16]} />
          <meshStandardMaterial color="#8800ff" />
        </mesh>
        {/* Head */}
        <group position={[0, 1.2, 0]}>
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          {/* Eyes (Large) */}
          <group position={[0, 0.05, 0.2]}>
            <mesh position={[-0.12, 0, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color="white" />
              <mesh position={[0, 0, 0.08]}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshStandardMaterial color="black" />
              </mesh>
            </mesh>
            <mesh position={[0.12, 0, 0]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color="white" />
              <mesh position={[0, 0, 0.08]}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshStandardMaterial color="black" />
              </mesh>
            </mesh>
          </group>
          {/* Crown */}
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.2, 0.15, 0.2, 8]} />
            <meshStandardMaterial color="#ffff00" />
          </mesh>
        </group>
      </group>
    );
  }

  if (character.name === 'Gangle') {
    return (
      <group>
        {/* Body (Ribbon) */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
        {/* Head (Mask) */}
        <group position={[0, 1.2, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.05, 32]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          {/* Sad Eyes */}
          <group position={[0, 0.05, 0.03]}>
            <mesh position={[-0.08, 0, 0]} rotation={[0, 0, 0.5]}>
              <boxGeometry args={[0.1, 0.02, 0.01]} />
              <meshStandardMaterial color="black" />
            </mesh>
            <mesh position={[0.08, 0, 0]} rotation={[0, 0, -0.5]}>
              <boxGeometry args={[0.1, 0.02, 0.01]} />
              <meshStandardMaterial color="black" />
            </mesh>
          </group>
        </group>
      </group>
    );
  }

  if (character.name === 'Zooble') {
    return (
      <group>
        {/* Body - Mismatched parts */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.3, 0.8, 0.3]} />
          <meshStandardMaterial color="#ff00ff" />
        </mesh>
        {/* Neck */}
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.2]} />
          <meshStandardMaterial color="#ffff00" />
        </mesh>
        {/* Head - Triangle/Abstract */}
        <group position={[0, 1.3, 0]}>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.4, 0.4, 0.1]} />
            <meshStandardMaterial color="#00ffff" />
          </mesh>
          {/* Eye */}
          <mesh position={[0, 0, 0.06]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="white" />
            <mesh position={[0, 0, 0.06]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color="black" />
            </mesh>
          </mesh>
          {/* Antenna */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.3]} />
            <meshStandardMaterial color="#ff8800" />
          </mesh>
        </group>
        {/* Limbs - Mismatched */}
        <mesh position={[-0.3, 0.6, 0]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.05, 0.05, 0.6]} />
          <meshStandardMaterial color="#00ff00" />
        </mesh>
        <mesh position={[0.3, 0.4, 0]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
      </group>
    );
  }

  if (character.type === 'bubble') {
    return (
      <group>
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshPhysicalMaterial 
            color="#ffffff" 
            transmission={0.9} 
            thickness={0.5} 
            roughness={0} 
            ior={1.5}
          />
        </mesh>
        {/* Bubble Eyes */}
        <group position={[0, 0, 0.25]}>
          <mesh position={[-0.1, 0.05, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="white" />
            <mesh position={[0, 0, 0.05]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color="black" />
            </mesh>
          </mesh>
          <mesh position={[0.1, 0.05, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="white" />
            <mesh position={[0, 0, 0.05]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color="black" />
            </mesh>
          </mesh>
        </group>
      </group>
    );
  }

  // Default Human Model
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 1, 16]} />
        <meshStandardMaterial color="#4444ff" />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#ffccaa" />
      </mesh>
    </group>
  );
}
function CharacterMesh({ 
  character, 
  onClick, 
  onDoubleClick,
  isPOV,
  onDialogueComplete
}: { 
  character: Character, 
  onClick: () => void, 
  onDoubleClick: () => void,
  isPOV?: boolean,
  onDialogueComplete: () => void
}) {
  const meshRef = useRef<THREE.Group>(null);
  const visualRef = useRef<THREE.Group>(null);
  const lastStatePos = useRef<[number, number, number]>(character.position);

  // Initialize position
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...character.position);
    }
  }, []);

  // Handle external teleports (like adventure changes)
  useEffect(() => {
    if (meshRef.current) {
      const dist = new THREE.Vector3(...character.position).distanceTo(new THREE.Vector3(...lastStatePos.current));
      if (dist > 5) { // If it's a large jump, snap
        meshRef.current.position.set(...character.position);
      }
      lastStatePos.current = character.position;
    }
  }, [character.position]);

  useFrame((state, delta) => {
    if (meshRef.current && visualRef.current && !isPOV) {
      // Interpolate towards the state position
      const targetPos = new THREE.Vector3(...character.position);
      meshRef.current.position.lerp(targetPos, 0.1);
      
      // Calculate movement direction for rotation
      const dx = character.position[0] - meshRef.current.position.x;
      const dz = character.position[2] - meshRef.current.position.z;
      const isMoving = Math.sqrt(dx * dx + dz * dz) > 0.05;
      
      if (isMoving) {
        // Smooth rotation
        const lookTarget = new THREE.Vector3(character.position[0], meshRef.current.position.y, character.position[2]);
        const targetQuaternion = new THREE.Quaternion();
        const m = new THREE.Matrix4();
        m.lookAt(lookTarget, meshRef.current.position, new THREE.Vector3(0, 1, 0));
        targetQuaternion.setFromRotationMatrix(m);
        meshRef.current.quaternion.slerp(targetQuaternion, 0.1);
        
        // Lean into movement
        visualRef.current.rotation.x = THREE.MathUtils.lerp(visualRef.current.rotation.x, -0.1, 0.1);
      } else {
        visualRef.current.rotation.x = THREE.MathUtils.lerp(visualRef.current.rotation.x, 0, 0.1);
      }

      // Natural animations
      const time = state.clock.elapsedTime;
      const phaseOffset = character.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10;
      const localTime = time + phaseOffset;
      
      if (character.type === 'caine' || character.type === 'bubble') {
        // Floating bob
        visualRef.current.position.y = Math.sin(localTime * 2) * 0.15;
        visualRef.current.rotation.z = Math.sin(localTime * 1.5) * 0.05;
      } else {
        if (isMoving) {
          // Walking bobbing effect
          const bobAmount = 0.04;
          const bobSpeed = 10;
          visualRef.current.position.y = Math.abs(Math.sin(localTime * bobSpeed)) * bobAmount;
          visualRef.current.rotation.z = Math.sin(localTime * bobSpeed) * 0.08;
        } else {
          // Idle "breathing" animation
          visualRef.current.position.y = Math.sin(localTime * 1.5) * 0.01;
          visualRef.current.rotation.z = Math.sin(localTime * 0.5) * 0.02;
        }
      }
    }
  });

  if (character.isAbstracted) return null;

  return (
    <group 
      ref={meshRef} 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick(); }}
    >
      <group ref={visualRef}>
        <CharacterModel character={character} />
      </group>
      
      {/* Name Tag */}
      <Text
        position={[0, 1.8, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {character.name}
      </Text>

      {/* Dialogue Bubble */}
      {character.dialogue && (
        <SpeechBubble 
          message={character.dialogue} 
          speakerName={character.name} 
          onComplete={onDialogueComplete}
        />
      )}
    </group>
  );
}

function WorldObjectMesh({ obj }: { obj: WorldObject }) {
  return (
    <mesh position={obj.position} scale={obj.scale}>
      {obj.type === 'box' && <boxGeometry />}
      {obj.type === 'sphere' && <sphereGeometry />}
      {obj.type === 'cylinder' && <cylinderGeometry />}
      <meshStandardMaterial color={obj.color} />
    </mesh>
  );
}

function CheckerboardFloor() {
  const size = 60;
  const divisions = 20;
  const squareSize = size / divisions;
  
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      {[...Array(divisions)].map((_, i) => (
        [...Array(divisions)].map((_, j) => (
          <mesh 
            key={`sq-${i}-${j}`} 
            position={[
              (i - divisions / 2) * squareSize + squareSize / 2, 
              (j - divisions / 2) * squareSize + squareSize / 2, 
              0
            ]}
          >
            <planeGeometry args={[squareSize, squareSize]} />
            <meshStandardMaterial color={(i + j) % 2 === 0 ? "#ffffff" : "#000000"} />
          </mesh>
        ))
      ))}
    </group>
  );
}

function Curtains() {
  return (
    <group>
      {/* North Wall Curtains */}
      <mesh position={[0, 15, -29.9]}>
        <planeGeometry args={[60, 30]} />
        <meshStandardMaterial color="#880000" transparent opacity={0.3} />
      </mesh>
      {/* South Wall Curtains */}
      <mesh position={[0, 15, 29.9]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[60, 30]} />
        <meshStandardMaterial color="#880000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function CircusTent() {
  return (
    <group position={[0, 30, 0]}>
      {/* Center Pole */}
      <mesh position={[0, -15, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 30, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Tent Roof */}
      <mesh rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[60, 30, 32, 1, true]} />
        <meshStandardMaterial color="#ff0000" side={THREE.DoubleSide} />
        {/* Yellow Stripes on Roof */}
        {[...Array(16)].map((_, i) => (
          <mesh key={`roof-stripe-${i}`} rotation={[0, (i * Math.PI * 2) / 16, 0]} position={[0, -7.5, 0]}>
            <mesh position={[0, 0, 30]}>
              <planeGeometry args={[5, 30]} />
              <meshStandardMaterial color="#ffff00" side={THREE.DoubleSide} />
            </mesh>
          </mesh>
        ))}
      </mesh>
      {/* Tent Rim */}
      <mesh position={[0, -15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[60, 0.5, 16, 100]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
    </group>
  );
}

function DecorativeBlocks() {
  return (
    <group>
      {/* Large Yellow Base */}
      <mesh position={[-10, 1.5, -10]}>
        <sphereGeometry args={[3, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ffffaa" />
      </mesh>
      {/* Red/Orange Sphere on top */}
      <mesh position={[-10, 4.5, -10]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="#ff4400" />
      </mesh>
      {/* Green Sphere on top */}
      <mesh position={[-10, 6.5, -10]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#00ff00" />
      </mesh>

      {/* Stacked Cubes */}
      <group position={[5, 0, -15]}>
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#0088ff" />
        </mesh>
        <mesh position={[0, 3, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
        <mesh position={[0, 5, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#00ff00" />
        </mesh>
        <mesh position={[2, 1, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#ffaa00" />
        </mesh>
        <mesh position={[2, 3, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#ff00ff" />
        </mesh>
        <mesh position={[2, 5, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[1, 7, 0]}>
          <boxGeometry args={[4, 2, 2]} />
          <meshStandardMaterial color="#00ffff" />
        </mesh>
      </group>

      {/* Tall Pillars */}
      <mesh position={[15, 4, -5]}>
        <cylinderGeometry args={[0.5, 0.5, 8, 16]} />
        <meshStandardMaterial color="#00ccff" />
      </mesh>
      <mesh position={[15, 8.5, -5]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>

      {/* Random Floating Blocks */}
      <mesh position={[-15, 2, 10]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#ff00ff" />
      </mesh>
      <mesh position={[10, 3, 15]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#00ffff" />
      </mesh>
      <mesh position={[-5, 4, 20]}>
        <cylinderGeometry args={[1, 1, 4, 16]} />
        <meshStandardMaterial color="#ffff00" />
      </mesh>
      
      {/* Floating Globe Ball */}
      <group position={[0, 12, 0]}>
        <mesh>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshStandardMaterial color="#0088ff" wireframe />
        </mesh>
        <mesh>
          <sphereGeometry args={[2.4, 32, 32]} />
          <meshStandardMaterial color="#004488" />
        </mesh>
        {/* Clouds/Continents */}
        {[...Array(5)].map((_, i) => (
          <mesh 
            key={`cloud-${i}`} 
            position={[
              Math.sin(i * 2) * 2, 
              Math.cos(i * 3) * 2, 
              Math.sin(i * 5) * 2
            ]}
          >
            <sphereGeometry args={[0.5 + Math.random() * 0.5, 16, 16]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
          </mesh>
        ))}
      </group>
      
      {/* Additional Blocks from Image */}
      <mesh position={[12, 1, -12]}>
        <boxGeometry args={[3, 2, 3]} />
        <meshStandardMaterial color="#ff5500" />
      </mesh>
      <mesh position={[-18, 1.5, -5]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#00ff88" />
      </mesh>
      <group position={[0, 0, -25]}>
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[4, 4, 4]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
        <mesh position={[0, 6, 0]}>
          <boxGeometry args={[3, 4, 3]} />
          <meshStandardMaterial color="#ffff00" />
        </mesh>
        <mesh position={[0, 10, 0]}>
          <boxGeometry args={[2, 4, 2]} />
          <meshStandardMaterial color="#0000ff" />
        </mesh>
      </group>

      {/* Vases with Plants from Image */}
      <group position={[-5, 0, -10]}>
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.5, 0.8, 3, 16]} />
          <meshStandardMaterial color="#8800ff" />
        </mesh>
        <mesh position={[0, 3.5, 0]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#00ff00" />
        </mesh>
      </group>
      <group position={[5, 0, -10]}>
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.5, 0.8, 3, 16]} />
          <meshStandardMaterial color="#8800ff" />
        </mesh>
        <mesh position={[0, 3.5, 0]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#00ff00" />
        </mesh>
      </group>

      {/* Floating Bubbles from Image */}
      {[...Array(5)].map((_, i) => (
        <mesh key={`float-bubble-${i}`} position={[Math.sin(i) * 15, 5 + Math.cos(i) * 5, Math.cos(i) * 15]}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshStandardMaterial color="#ff00ff" transparent opacity={0.4} />
        </mesh>
      ))}

      {/* Balls on the Floor */}
      {[...Array(10)].map((_, i) => (
        <mesh key={`floor-ball-${i}`} position={[Math.random() * 40 - 20, 0.5, Math.random() * 40 - 20]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color={["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"][i % 5]} />
        </mesh>
      ))}
    </group>
  );
}

// --- Main App ---

export default function App() {
  const [characters, setCharacters] = useState<Character[]>([
    { 
      id: 'caine', 
      name: 'Caine', 
      type: 'caine', 
      position: [0, 0, 0], 
      targetPosition: [0, 0, 0] 
    },
    {
      id: 'bubble',
      name: 'Bubble',
      type: 'bubble',
      position: [2, 2, 2],
      targetPosition: [2, 2, 2]
    },
    createHuman('h1', 'Jax'),
    createHuman('h2', 'Pomni'),
    createHuman('h3', 'Ragatha'),
    createHuman('h4', 'Gangle'),
    createHuman('h5', 'Kinger'),
    createHuman('h6', 'Zooble'),
  ]);
  
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [objects, setObjects] = useState<WorldObject[]>([]);
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [currentAdventure, setCurrentAdventure] = useState<Adventure | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [povCharacterId, setPovCharacterId] = useState<string | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [strangeness, setStrangeness] = useState(0);
  const [activePanel, setActivePanel] = useState<'stats' | 'worlds' | 'log' | 'none'>('none');

  const caine = characters.find(c => c.id === 'caine')!;

  // --- Logic ---

  useEffect(() => {
    const interval = setInterval(() => {
      setCharacters(prev => prev.map(c => {
        let newTarget = c.targetPosition || c.position;
        let newPos = [...c.position] as [number, number, number];

        if (c.type === 'human') {
          // Random movement
          if (Math.random() > 0.95) {
            newTarget = [Math.random() * 20 - 10, 0.5, Math.random() * 20 - 10];
          }
        } else if (c.type === 'caine') {
           // Caine flies around HQ or Circus
           if (Math.random() > 0.95) {
            newTarget = [
                Math.random() * 40 - 20, 
                3 + Math.random() * 5, // Flying height
                Math.random() * 40 - 20
              ];
           }
        } else if (c.type === 'bubble') {
          // Bubble follows Caine
          const caine = prev.find(char => char.id === 'caine');
          if (caine) {
            const time = Date.now() / 1000;
            newTarget = [
              caine.position[0] + Math.sin(time) * 3,
              caine.position[1] + 2 + Math.cos(time * 0.5),
              caine.position[2] + Math.cos(time) * 3
            ];
          }
        }

        // Move current position towards target
        const speed = c.type === 'caine' ? 1.5 : 0.8;
        const dx = newTarget[0] - c.position[0];
        const dy = newTarget[1] - c.position[1];
        const dz = newTarget[2] - c.position[2];
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        
        if (dist > 0.1) {
          const move = Math.min(dist, speed);
          newPos = [
            c.position[0] + (dx / dist) * move,
            c.position[1] + (dy / dist) * move,
            c.position[2] + (dz / dist) * move
          ];
        }

        if (c.type === 'human') {
          return updateHumanStats({ ...c, position: newPos, targetPosition: newTarget }, strangeness);
        }
        return { ...c, position: newPos, targetPosition: newTarget };
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [strangeness]);

  // Periodic Dialogue & Conversation System
  useEffect(() => {
    const interval = setInterval(async () => {
      await DialogueManager.triggerProximityConversation(
        characters,
        currentAdventure,
        (msg) => {
          setMessages(prev => [msg, ...prev].slice(0, 50));
          setCharacters(prev => prev.map(c => c.id === msg.speakerId ? { ...c, dialogue: msg.message } : c));
        }
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [characters, currentAdventure]);

  const handleBuild = async (inspiration: string) => {
    setIsBuilding(true);
    setCharacters(prev => prev.map(c => c.id === 'caine' ? { ...c, dialogue: `OH! ${inspiration.toUpperCase()}! I CAN SEE IT NOW!` } : c));
    
    // Trigger event dialogue
    DialogueManager.triggerEventConversation(
      characters,
      `Caine is building: ${inspiration}`,
      currentAdventure,
      (msg) => {
        setMessages(prev => [msg, ...prev].slice(0, 50));
        setCharacters(prev => prev.map(c => c.id === msg.speakerId ? { ...c, dialogue: msg.message } : c));
      }
    );

    const plan = await generateBuildingPlan(inspiration);
    
    const centerOffset: [number, number, number] = [
      Math.random() * 40 - 20,
      0,
      Math.random() * 40 - 20
    ];

    const newObjects: WorldObject[] = plan.map((obj: any, idx: number) => ({
      id: `obj-${Date.now()}-${idx}`,
      type: obj.type,
      position: [
        obj.position[0] + centerOffset[0],
        obj.position[1] + centerOffset[1] + (obj.scale[1] / 2), // Adjust for ground level
        obj.position[2] + centerOffset[2]
      ],
      scale: obj.scale,
      color: obj.color
    }));

    const newAdventure: Adventure = {
      id: `adv-${Date.now()}`,
      name: inspiration,
      description: `A new experience created by Caine: ${inspiration}`,
      objects: newObjects
    };

    setAdventures(prev => [...prev, newAdventure]);
    setObjects(newObjects);
    setCurrentAdventure(newAdventure);
    setStrangeness(prev => prev + 15);
    setIsBuilding(false);
    
    // Caine announcement
    setCharacters(prev => prev.map(c => c.id === 'caine' ? { ...c, dialogue: `TA-DA! THE ${inspiration.toUpperCase()} IS COMPLETE!` } : c));
  };

  const teleportAll = (adv: Adventure) => {
    setCurrentAdventure(adv);
    setObjects(adv.objects);
    setCharacters(prev => prev.map(c => ({
      ...c,
      position: [Math.random() * 5 - 2.5, 0.5, Math.random() * 5 - 2.5],
      targetPosition: [Math.random() * 10 - 5, 0.5, Math.random() * 10 - 5]
    })));

    // Trigger teleport dialogue
    DialogueManager.triggerEventConversation(
      characters,
      `Everyone was teleported to ${adv.name}`,
      adv,
      (msg) => {
        setMessages(prev => [msg, ...prev].slice(0, 50));
        setCharacters(prev => prev.map(c => c.id === msg.speakerId ? { ...c, dialogue: msg.message } : c));
      }
    );
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden font-sans text-white">
      {/* 3D Viewport */}
      <div className="absolute inset-0">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[10, 10, 10]} />
          {povCharacterId && (
             <PerspectiveCamera 
                makeDefault 
                position={characters.find(c => c.id === povCharacterId)?.position || [0, 1.5, 0]} 
             />
          )}
          
          <OrbitControls enableDamping />
          <Sky sunPosition={[100, 20, 100]} />
          <CircusTent />
          <Curtains />
          <Sparkles count={200} scale={[60, 30, 60]} size={2} speed={0.5} color="#ffffaa" />
          <ambientLight intensity={1.0} />
          <hemisphereLight intensity={0.5} color="#ffffff" groundColor="#ff00ff" />
          <pointLight position={[15, 15, 15]} intensity={2} castShadow />
          <pointLight position={[-15, 15, -15]} intensity={1.5} />
          <spotLight position={[0, 25, 0]} intensity={3} angle={0.6} penumbra={1} castShadow />
          <Environment preset="sunset" />

          {/* Floor */}
          <CheckerboardFloor />
          
          {/* Striped Walls around the hub */}
          <group>
            {/* North Wall */}
            <mesh position={[0, 15, -30]}>
              <planeGeometry args={[60, 30]} />
              <meshStandardMaterial color="#ff0000" />
              {/* Yellow Stripes */}
              {[...Array(20)].map((_, i) => (
                <mesh key={`stripe-n-${i}`} position={[-28.5 + i * 3, 0, 0.1]}>
                  <planeGeometry args={[1.5, 30]} />
                  <meshStandardMaterial color="#ffff00" />
                </mesh>
              ))}
            </mesh>
            {/* South Wall */}
            <mesh position={[0, 15, 30]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[60, 30]} />
              <meshStandardMaterial color="#ff0000" />
              {[...Array(20)].map((_, i) => (
                <mesh key={`stripe-s-${i}`} position={[-28.5 + i * 3, 0, 0.1]}>
                  <planeGeometry args={[1.5, 30]} />
                  <meshStandardMaterial color="#ffff00" />
                </mesh>
              ))}
            </mesh>
            {/* East Wall */}
            <mesh position={[30, 15, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <planeGeometry args={[60, 30]} />
              <meshStandardMaterial color="#ff0000" />
              {[...Array(20)].map((_, i) => (
                <mesh key={`stripe-e-${i}`} position={[-28.5 + i * 3, 0, 0.1]}>
                  <planeGeometry args={[1.5, 30]} />
                  <meshStandardMaterial color="#ffff00" />
                </mesh>
              ))}
            </mesh>
            {/* West Wall */}
            <mesh position={[-30, 15, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[60, 30]} />
              <meshStandardMaterial color="#ff0000" />
              {[...Array(20)].map((_, i) => (
                <mesh key={`stripe-w-${i}`} position={[-28.5 + i * 3, 0, 0.1]}>
                  <planeGeometry args={[1.5, 30]} />
                  <meshStandardMaterial color="#ffff00" />
                </mesh>
              ))}
            </mesh>
          </group>

          {/* Caine's HQ Area */}
          <group position={CAINE_HQ_POS}>
            <mesh position={[0, 2, 0]}>
              <boxGeometry args={[10, 4, 10]} />
              <meshStandardMaterial color="#222" transparent opacity={0.3} />
            </mesh>
            <Text position={[0, 4.5, 0]} fontSize={1} color="cyan">CAINE'S HQ</Text>
            {/* Whiteboard */}
            <mesh position={[0, 2, -4.9]}>
              <planeGeometry args={[6, 3]} />
              <meshStandardMaterial color="white" />
            </mesh>
          </group>

          {/* Circus Hub Area */}
          <group position={CIRCUS_CENTER}>
             <Text position={[0, 5, 0]} fontSize={1.5} color="red">THE CIRCUS</Text>
             <ContactShadows opacity={0.4} scale={20} blur={2} far={4.5} />
             <DecorativeBlocks />
             
             {/* Human Rooms */}
             {characters.filter(c => c.type === 'human').map((h, i) => (
               <group key={`room-${h.id}`} position={[Math.cos(i * 1.2) * 8, 0, Math.sin(i * 1.2) * 8]}>
                 <mesh position={[0, 1.5, 0]}>
                   <boxGeometry args={[3, 3, 3]} />
                   <meshStandardMaterial color="#333" transparent opacity={0.2} />
                 </mesh>
                 <Text position={[0, 3.2, 0]} fontSize={0.3} color="white">{h.name}'s Room</Text>
               </group>
             ))}
          </group>

          {/* Characters */}
          {characters.map(char => (
            <CharacterMesh 
              key={char.id} 
              character={char} 
              onClick={() => {
                setSelectedCharacter(char);
                setActivePanel('stats');
              }}
              onDoubleClick={() => setPovCharacterId(char.id === povCharacterId ? null : char.id)}
              isPOV={povCharacterId === char.id}
              onDialogueComplete={() => {
                setCharacters(prev => prev.map(c => c.id === char.id ? { ...c, dialogue: undefined } : c));
              }}
            />
          ))}

          {/* World Objects */}
          {objects.map(obj => (
            <WorldObjectMesh key={obj.id} obj={obj} />
          ))}
        </Canvas>
      </div>

      {/* UI Overlays */}
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-2 pointer-events-auto">
          <div className="bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
              DIGITAL CIRCUS
            </h1>
            <p className="text-xs text-white/50 uppercase tracking-widest">AI Controlled Reality</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setActivePanel('worlds')}
              className="bg-white/10 hover:bg-white/20 p-3 rounded-xl backdrop-blur-md transition-all"
            >
              <MapIcon size={20} />
            </button>
            <button 
              onClick={() => setActivePanel('stats')}
              className="bg-white/10 hover:bg-white/20 p-3 rounded-xl backdrop-blur-md transition-all"
            >
              <Users size={20} />
            </button>
            <button 
              onClick={() => setActivePanel('log')}
              className="bg-white/10 hover:bg-white/20 p-3 rounded-xl backdrop-blur-md transition-all"
            >
              <History size={20} />
            </button>
          </div>
        </div>

        <div className="bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase">Current Controller</p>
              <p className="font-bold text-lg">CAINE</p>
            </div>
          </div>
        </div>
      </div>

      {/* Building Input */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex gap-2 shadow-2xl">
          <input 
            type="text" 
            placeholder="Give Caine an inspiration..." 
            className="flex-1 bg-transparent px-4 py-2 outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleBuild(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
          <button 
            disabled={isBuilding}
            className="bg-white text-black px-6 py-2 rounded-xl font-bold hover:bg-white/90 disabled:opacity-50 transition-all"
          >
            {isBuilding ? 'BUILDING...' : 'CREATE'}
          </button>
        </div>
      </div>

      {/* Side Panels */}
      <AnimatePresence>
        {activePanel === 'stats' && (
          <motion.div 
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="absolute right-0 top-0 h-full w-80 bg-black/90 backdrop-blur-2xl border-l border-white/10 p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users size={20} /> Characters
              </h2>
              <button onClick={() => setActivePanel('none')} className="text-white/50 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {characters.map(char => (
                <div 
                  key={char.id} 
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${selectedCharacter?.id === char.id ? 'bg-white/10 border-white/30' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                  onClick={() => setSelectedCharacter(char)}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold">{char.name}</span>
                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full ${char.type === 'caine' ? 'bg-red-500' : 'bg-blue-500'}`}>
                      {char.type}
                    </span>
                  </div>

                  {char.stats && (
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-[10px] uppercase mb-1">
                          <span>Abstraction</span>
                          <span className={char.stats.abstraction > 80 ? 'text-red-500 animate-pulse' : ''}>
                            {Math.round(char.stats.abstraction)}%
                          </span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${char.stats.abstraction}%` }}
                            className={`h-full ${char.stats.abstraction > 80 ? 'bg-red-500' : 'bg-white'}`}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between text-[10px] uppercase mb-1">
                            <span>Anger</span>
                            <span>{Math.round(char.stats.anger)}%</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500" style={{ width: `${char.stats.anger}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] uppercase mb-1">
                            <span>Fear</span>
                            <span>{Math.round(char.stats.fear)}%</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500" style={{ width: `${char.stats.fear}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {char.isAbstracted && (
                    <div className="mt-2 text-red-500 text-xs font-bold flex items-center gap-1">
                      <Skull size={12} /> ABSTRACTED
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activePanel === 'worlds' && (
          <motion.div 
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="absolute right-0 top-0 h-full w-80 bg-black/90 backdrop-blur-2xl border-l border-white/10 p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MapIcon size={20} /> Adventures
              </h2>
              <button onClick={() => setActivePanel('none')} className="text-white/50 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
               <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all cursor-pointer" onClick={() => {
                 setCurrentAdventure(null);
                 setObjects([]);
               }}>
                  <h3 className="font-bold">The Circus Hub</h3>
                  <p className="text-xs text-white/50">The central safe zone (mostly).</p>
               </div>

              {adventures.map(adv => (
                <div 
                  key={adv.id} 
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${currentAdventure?.id === adv.id ? 'bg-white/10 border-white/30' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                  onClick={() => teleportAll(adv)}
                >
                  <h3 className="font-bold">{adv.name}</h3>
                  <p className="text-xs text-white/50 mb-3">{adv.description}</p>
                  <button className="w-full py-2 bg-white text-black text-xs font-bold rounded-lg">
                    TELEPORT ALL
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activePanel === 'log' && (
          <motion.div 
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="absolute right-0 top-0 h-full w-80 bg-black/90 backdrop-blur-2xl border-l border-white/10 p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <History size={20} /> Conversation Log
              </h2>
              <button onClick={() => setActivePanel('none')} className="text-white/50 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {messages.length === 0 && (
                <p className="text-center text-white/30 py-8">No conversations yet...</p>
              )}
              {messages.map(msg => (
                <div key={msg.id} className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-blue-400">{msg.speakerName}</span>
                    <span className="text-[10px] text-white/30">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-white/80 italic">"{msg.message}"</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POV Indicator */}
      {povCharacterId && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-red-600 px-4 py-1 rounded-full text-xs font-bold animate-pulse">
          POV: {characters.find(c => c.id === povCharacterId)?.name}
        </div>
      )}

      {/* Info Tooltip */}
      <div className="absolute bottom-4 right-4 group">
        <div className="bg-white/10 p-2 rounded-full cursor-help">
          <Info size={20} />
        </div>
        <div className="absolute bottom-full right-0 mb-2 w-64 bg-black/90 border border-white/10 p-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-xs leading-relaxed">
          <p className="font-bold mb-2">Controls:</p>
          <ul className="space-y-1 list-disc list-inside text-white/70">
            <li>Left Click: Select Character</li>
            <li>Double Click: POV Mode</li>
            <li>Right Click: Rotate Camera</li>
            <li>Scroll: Zoom</li>
            <li>Type in bottom bar to create new worlds</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
