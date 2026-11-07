import { useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CentralModel = () => {
  const meshRef = useRef();

  useLayoutEffect(() => {
    // We'll set up scroll-triggered animations here.
    // For now, let's just make it spin based on scroll.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    tl.to(meshRef.current.rotation, {
      y: Math.PI * 4,
      x: Math.PI * 2,
      ease: "none",
    });
    
    tl.to(meshRef.current.position, {
      z: -5,
      ease: "power2.inOut",
    }, 0);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // Continuous subtle floating
  useFrame(() => {
    if (!meshRef.current) return;
    // Add subtle continuous movement on top of scroll animation
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 0]} />
        <MeshTransmissionMaterial
          backside
          backsideThickness={1}
          thickness={0.5}
          chromaticAberration={0.1}
          anisotropicBlur={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          roughness={0.2}
          color="#38bdf8"
        />
        
        <mesh>
          <icosahedronGeometry args={[1.5, 0]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      </mesh>
    </Float>
  );
};

export default CentralModel;
