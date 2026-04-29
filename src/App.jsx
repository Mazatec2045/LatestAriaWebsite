import React, { Suspense, lazy } from "react";
import { BrowserRouter } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

import About from "./components/About";
import Experience from "./components/Experience";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Tech from "./components/Tech";
import Works from "./components/Works";
import Contact from "./components/Contact";
import CanvasLoader from "./components/Loader";

const CentralModel = lazy(() => import("./components/canvas/CentralModel"));

const App = () => {
  return (
    <BrowserRouter>
      {/* 3D Canvas Background Layer */}
      <div className="fixed inset-0 z-0 bg-black pointer-events-none">
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
          <Suspense fallback={<CanvasLoader />}>
            <color attach="background" args={['#000000']} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Environment preset="city" />
            
            <CentralModel />
          </Suspense>
        </Canvas>
      </div>

      {/* HTML Foreground Layer */}
      <div className="relative z-10 w-full selection:bg-white/30">
        <Navbar />
        
        <div className="min-h-screen">
          <Hero />
        </div>
        
        <div className="bg-transparent pb-32">
          <About />
        </div>
        
        <div className="bg-transparent pb-32">
          <Experience />
        </div>
        
        <div className="bg-transparent pb-32">
          <Tech />
        </div>
        
        <div className="bg-transparent pb-32">
          <Works />
        </div>
        
        <div className="bg-transparent pb-10">
          <Contact />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
