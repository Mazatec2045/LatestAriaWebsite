import React from "react";

const RunwayHero = ({ isExploded, setIsExploded, cameraAngle, setCameraAngle }) => {
  return (
    <section
      id="runway"
      className="relative z-10 w-full min-h-[84vh] flex flex-col lg:flex-row items-center justify-between gap-8 py-6"
    >
      {/* Left Column: Clean Big Headline Next to the Avatar */}
      <div className="w-full lg:w-[45%] flex flex-col items-center lg:items-start text-center lg:text-left gap-6 z-10">
        <span className="px-4 py-1.5 bg-[#fff9db] text-[#4a331f] text-xs sm:text-sm uppercase tracking-wider rounded-full border border-[#e6cc65] shadow-xs font-extrabold flex items-center gap-2">
          <span>🦖</span>
          <span>Hi, I&apos;m Aria!</span>
        </span>

        <div className="flex flex-col">
          <h1 className="font-display text-5xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-[#2d1e14] leading-[1.02]">
            Cozy Dino
          </h1>
          <h1 className="font-display text-5xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-gradient-warm leading-[1.08]">
            Roblox Star ✨
          </h1>
        </div>

        <p className="font-body text-base sm:text-lg text-[#4a3525] max-w-md leading-relaxed font-medium bg-[#faf7f2]/85 backdrop-blur-md p-5 rounded-3xl border border-[#dfd3c2] shadow-xs">
          Welcome to my cozy adventure world! 🦖🎀 I&apos;m 7 years old and I love exploring with my pilot goggles, wagging my giant spotted dino tail, winning 5 stars on the runway, and beating fast obbies with my besties!
        </p>

        {/* Clean Action Buttons */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
          <a
            href="#wardrobe-deconstruct"
            className="px-6 py-3.5 bg-[#4a331f] hover:bg-[#a6413d] text-[#faf7f2] text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 font-extrabold"
          >
            <span>🦖 Inspect My Outfit</span>
            <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
          </a>

          <button
            onClick={() => setIsExploded(!isExploded)}
            type="button"
            className="px-5 py-3.5 bg-[#faf7f2]/95 backdrop-blur-md text-[#a6413d] text-xs sm:text-sm uppercase tracking-wider rounded-2xl border border-[#d6c5b0] shadow-xs hover:bg-[#f3ece1] transition-all flex items-center gap-2 font-extrabold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            <span>{isExploded ? "🎀 Put Outfit Back" : "✨ Pop Outfit Apart"}</span>
          </button>
        </div>

        {/* Simple Minimal View Switcher (Front, Tail View, 360 Spin) */}
        <div className="flex items-center gap-1.5 bg-[#faf7f2]/85 backdrop-blur-md p-1.5 rounded-2xl border border-[#dfd3c2] shadow-xs">
          {[
            { id: "front", label: "😊 Front" },
            { id: "wing", label: "🦖 Tail & Bow" },
            { id: "orbit", label: "🌀 360° Spin" },
          ].map((view) => (
            <button
              key={view.id}
              type="button"
              onClick={() => setCameraAngle(view.id)}
              className={`px-3.5 py-1.5 text-xs rounded-xl transition-all font-extrabold cursor-pointer ${
                cameraAngle === view.id
                  ? "bg-[#a6413d] text-white shadow-xs"
                  : "hover:bg-[#f1ebe0] text-[#6e5540]"
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right Column: Completely Clear Open Stage for the 3D Avatar */}
      <div className="w-full lg:w-[55%] min-h-[420px] sm:min-h-[540px] pointer-events-none" />
    </section>
  );
};

export default RunwayHero;
