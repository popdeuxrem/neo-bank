'use client';

import * as React from 'react';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Environment,
    Float,
    MeshTransmissionMaterial,
    Text,
    useTexture,
    RoundedBox,
} from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

function CardModel({
    mousePosition,
}: {
    mousePosition: { x: number; y: number };
}) {
    const groupRef = useRef<THREE.Group>(null);
    const cardRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.15;

            groupRef.current.rotation.x = THREE.MathUtils.lerp(
                groupRef.current.rotation.x,
                mousePosition.y * 0.3,
                0.05,
            );
            groupRef.current.rotation.y = THREE.MathUtils.lerp(
                groupRef.current.rotation.y,
                groupRef.current.rotation.y + mousePosition.x * 0.2,
                0.05,
            );
        }
    });

    const goldGradient = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d')!;

        const gradient = ctx.createLinearGradient(0, 0, 256, 256);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.5, '#FFA500');
        gradient.addColorStop(1, '#DAA520');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);

        return new THREE.CanvasTexture(canvas);
    }, []);

    return (
        <group ref={groupRef}>
            <Float
                speed={2}
                rotationIntensity={0.2}
                floatIntensity={0.3}
                floatingRange={[-0.05, 0.05]}
            >
                <RoundedBox
                    ref={cardRef}
                    args={[1.7, 1.06, 0.015]}
                    radius={0.08}
                    smoothness={4}
                >
                    <meshPhysicalMaterial
                        color="#0F1115"
                        roughness={0.15}
                        metalness={0.1}
                        clearcoat={0.8}
                        clearcoatRoughness={0.1}
                        reflectivity={1}
                    />
                </RoundedBox>

                <mesh position={[0, 0, 0.008]}>
                    <planeGeometry args={[1.65, 1.01]} />
                    <meshPhysicalMaterial
                        color="#1a1a1a"
                        roughness={0.3}
                        metalness={0.05}
                        transparent
                        opacity={0.95}
                    />
                </mesh>

                <mesh position={[0, 0, 0.009]}>
                    <planeGeometry args={[1.55, 0.9]} />
                    <meshPhysicalMaterial
                        color="#0a0a0a"
                        roughness={0.2}
                        metalness={0.1}
                        transparent
                        opacity={0.4}
                    />
                </mesh>

                <mesh position={[-0.55, 0.22, 0.01]}>
                    <planeGeometry args={[0.35, 0.22]} />
                    <meshBasicMaterial map={goldGradient} />
                </mesh>

                <Text
                    position={[0.55, -0.35, 0.01]}
                    fontSize={0.06}
                    color="#8B5CF6"
                    font="/fonts/Inter-Bold.ttf"
                    anchorX="right"
                    anchorY="middle"
                >
                    MAGNETIQ
                </Text>

                <Text
                    position={[-0.6, -0.35, 0.01]}
                    fontSize={0.045}
                    color="#ffffff"
                    anchorX="left"
                    anchorY="middle"
                    letterSpacing={0.05}
                >
                    **** **** **** 4829
                </Text>

                <Text
                    position={[-0.6, -0.42, 0.01]}
                    fontSize={0.025}
                    color="#666666"
                    anchorX="left"
                    anchorY="middle"
                >
                    CARD HOLDER
                </Text>

                <Text
                    position={[-0.6, -0.45, 0.01]}
                    fontSize={0.03}
                    color="#ffffff"
                    anchorX="left"
                    anchorY="middle"
                >
                    JOHN DOE
                </Text>

                <Text
                    position={[0.5, -0.42, 0.01]}
                    fontSize={0.025}
                    color="#666666"
                    anchorX="right"
                    anchorY="middle"
                >
                    EXPIRES
                </Text>

                <Text
                    position={[0.5, -0.45, 0.01]}
                    fontSize={0.03}
                    color="#ffffff"
                    anchorX="right"
                    anchorY="middle"
                >
                    12/28
                </Text>

                <mesh position={[0.55, 0.35, 0.012]}>
                    <circleGeometry args={[0.12, 32]} />
                    <meshStandardMaterial
                        color="#FFD700"
                        metalness={0.9}
                        roughness={0.1}
                    />
                </mesh>
            </Float>
        </group>
    );
}

function Scene({ mousePosition }: { mousePosition: { x: number; y: number } }) {
    return (
        <>
            <ambientLight intensity={0.3} />
            <spotLight
                position={[5, 5, 5]}
                angle={0.3}
                penumbra={1}
                intensity={1}
                castShadow
            />
            <spotLight
                position={[-5, -5, 5]}
                angle={0.3}
                penumbra={1}
                intensity={0.5}
                color="#8B5CF6"
            />
            <pointLight position={[0, 0, 3]} intensity={0.5} color="#ffffff" />

            <CardModel mousePosition={mousePosition} />

            <Environment preset="city" />
        </>
    );
}

interface MagnetiqCard3DProps {
    className?: string;
}

export const MagnetiqCard3D: React.FC<MagnetiqCard3DProps> = ({
    className,
}) => {
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                setMousePosition({ x, y: -y });
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, []);

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={className}
        >
            <div className="h-[400px] w-full cursor-pointer">
                <Canvas
                    camera={{ position: [0, 0, 2.5], fov: 45 }}
                    gl={{ antialias: true, alpha: true }}
                >
                    <Scene mousePosition={mousePosition} />
                </Canvas>
            </div>
        </motion.div>
    );
};

export default MagnetiqCard3D;
