import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";

import Navbar from "./components/Navbar";
import AriaRunwayAvatar from "./components/canvas/AriaRunwayAvatar";
import RunwayHero from "./components/RunwayHero";
import WardrobeDeconstruct from "./components/WardrobeDeconstruct";
import RivalsArena from "./components/RivalsArena";
import Speedway from "./components/Speedway";
import RobuxVault from "./components/RobuxVault";
import Footer from "./components/Footer";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f6f2e9] text-[#2d1e14]">
          <div className="max-w-md p-6 bg-white rounded-3xl border border-[#dfd3c2] shadow-xl text-center">
            <h2 className="text-xl font-bold text-[#a6413d] mb-2">Oops! Something popped!</h2>
            <p className="text-sm text-[#6e5540] mb-4">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#4a331f] text-white rounded-xl font-bold text-xs hover:bg-[#a6413d] transition-colors"
            >
              Try Again ✨
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  const [isExploded, setIsExploded] = useState(false);
  const [cameraAngle, setCameraAngle] = useState("front");

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="relative min-h-screen w-full font-body text-[#2d1e14] selection:bg-[#a6413d] selection:text-white">
          {/* Dreamy Pastel Butter-Yellow, Soft Peach & Oat-Milk Studio Backdrop (matching reference photos!) */}
          <div
            className="fixed inset-0 z-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(circle at 18% 18%, rgba(246, 243, 178, 0.72) 0%, transparent 48%),
                radial-gradient(circle at 84% 16%, rgba(245, 218, 222, 0.65) 0%, transparent 46%),
                radial-gradient(circle at 58% 48%, #fbf9f4 0%, #f3efe6 52%, #e5e0d5 100%)
              `,
            }}
          />

          {/* Fixed 3D Avatar Scene in Background */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <AriaRunwayAvatar isExploded={isExploded} cameraAngle={cameraAngle} />
          </div>

          {/* Clean Top Navigation */}
          <Navbar />

          {/* Main Content Container */}
          <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-8 flex flex-col items-center gap-32 pt-24 pb-36">
            <RunwayHero
              isExploded={isExploded}
              setIsExploded={setIsExploded}
              cameraAngle={cameraAngle}
              setCameraAngle={setCameraAngle}
            />
            <WardrobeDeconstruct
              isExploded={isExploded}
              setIsExploded={setIsExploded}
              setCameraAngle={setCameraAngle}
            />
            <RivalsArena />
            <Speedway />
            <RobuxVault />
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
