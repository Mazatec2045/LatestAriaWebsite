import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload } from "@react-three/drei";

const Cloud = ({ position, size }) => {
    const ref = useRef();
    
    // Slow drift movement
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.position.x += delta * 0.2;
            // Reset position if it goes too far
            if (ref.current.position.x > 20) {
                ref.current.position.x = -20;
            }
        }
    });

    return (
        <mesh ref={ref} position={position}>
            <boxGeometry args={size} />
            <meshStandardMaterial color="white" transparent opacity={0.6} />
        </mesh>
    );
};

const CLOUD_DATA = Array.from({ length: 15 }, (_, i) => ({
    position: [
        ((i * 7) % 40) - 20, // x
        ((i * 3) % 5) + 5,   // y (high up)
        ((i * 5) % 10) - 15  // z (in background)
    ],
    size: [
        ((i * 1.3) % 2) + 1, // width
        0.5,                 // height (thin clouds)
        ((i * 0.7) % 1) + 0.5 // depth
    ]
}));

const Clouds = () => {
    const cloudData = useMemo(() => CLOUD_DATA, []);

    return (
        <group>
            <ambientLight intensity={1.5} />
            {cloudData.map((data, i) => (
                <Cloud key={i} {...data} />
            ))}
        </group>
    );
};

const CloudsCanvas = () => {
    return (
        <div className='w-full h-auto absolute inset-0 z-[-1] pointer-events-none'>
            <Canvas 
                camera={{ position: [0, 0, 10], fov: 50 }}
                gl={{ alpha: true, antialias: false }}
                onCreated={({ gl }) => {
                    gl.setClearColor(0x000000, 0);
                }}
            >
                <Clouds />
                <Preload all />
            </Canvas>
        </div>
    );
};

export default CloudsCanvas;
