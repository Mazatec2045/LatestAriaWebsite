import React, { useState } from "react";

const RunwayHero = ({
  isExploded,
  setIsExploded,
  cameraAngle,
  setCameraAngle,
  activeEmote,
  triggerEmote,
}) => {
  const [showRefPhoto, setShowRefPhoto] = useState(false);

  const viewPresets = [
    { id: "front", label: "😊 Front", refImg: "/aria-front.jpg", refTitle: "Front Reference" },
    { id: "wing", label: "🦖 Back & Tail", refImg: "/aria-back.jpg", refTitle: "Back & Tail Reference" },
    { id: "left", label: "👈 Left", refImg: "/aria-left.jpg", refTitle: "Left Profile Reference" },
    { id: "right", label: "👉 Right", refImg: "/aria-right.jpg", refTitle: "Right Profile Reference" },
    { id: "orbit", label: "🌀 360° Spin", refImg: "/aria-front.jpg", refTitle: "360° Turntable" },
  ];

  const activePreset =
    viewPresets.find((v) => v.id === cameraAngle) || viewPresets[0];

  return (
    <section
      id="runway"
      className="relative z-10 w-full min-h-[84vh] flex flex-col lg:flex-row items-center justify-between gap-8 py-6"
    >
      {/* Left Column: Clean Big Headline & Studio Controls Next to the Avatar */}
      <div className="w-full lg:w-[46%] flex flex-col items-center lg:items-start text-center lg:text-left gap-5 z-10">
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
          <span className="px-4 py-1.5 bg-[#fff9db] text-[#4a331f] text-xs sm:text-sm uppercase tracking-wider rounded-full border border-[#e6cc65] shadow-xs font-extrabold flex items-center gap-2">
            <span>🦖</span>
            <span>Hi, I&apos;m Aria!</span>
          </span>
          <span className="px-3.5 py-1.5 bg-[#faf7f2]/90 backdrop-blur-md text-[#6e5540] text-xs rounded-full border border-[#dfd3c2] font-bold">
            🖱️ Drag 3D Avatar to Rotate
          </span>
        </div>

        <div className="flex flex-col">
          <h1 className="font-display text-5xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-[#2d1e14] leading-[1.02]">
            Cozy Dino
          </h1>
          <h1 className="font-display text-5xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-gradient-warm leading-[1.08]">
            Roblox Star ✨
          </h1>
        </div>

        <p className="font-body text-base sm:text-lg text-[#4a3525] max-w-md leading-relaxed font-medium bg-[#faf7f2]/88 backdrop-blur-md p-5 rounded-3xl border border-[#dfd3c2] shadow-[0_8px_24px_rgba(74,51,31,0.06)]">
          Welcome to my cozy adventure world! 🦖🎀 I&apos;m 7 years old and I love exploring with my pilot goggles, wagging my giant spotted dino tail, winning 5 stars on the runway, and beating fast obbies with my besties!
        </p>

        {/* Primary Action & Live 3D Emote Buttons */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
          <button
            onClick={() => triggerEmote && triggerEmote("wave")}
            type="button"
            className={`px-5 py-3 text-xs sm:text-sm uppercase tracking-wider rounded-2xl border transition-all flex items-center gap-2 font-extrabold cursor-pointer shadow-sm ${
              activeEmote === "wave"
                ? "bg-[#fff01f] text-[#2d1e14] border-[#e5b800] scale-105"
                : "bg-[#4a331f] hover:bg-[#a6413d] text-[#faf7f2] border-[#4a331f]"
            }`}
          >
            <span>👋 Wave Hi!</span>
          </button>

          <button
            onClick={() => triggerEmote && triggerEmote("jump")}
            type="button"
            className={`px-5 py-3 text-xs sm:text-sm uppercase tracking-wider rounded-2xl border transition-all flex items-center gap-2 font-extrabold cursor-pointer shadow-xs ${
              activeEmote === "jump"
                ? "bg-[#fff01f] text-[#2d1e14] border-[#e5b800] scale-105"
                : "bg-[#faf7f2]/95 hover:bg-[#f3ece1] text-[#4a331f] border-[#d6c5b0]"
            }`}
          >
            <span>✨ Happy Jump</span>
          </button>

          <button
            onClick={() => setIsExploded(!isExploded)}
            type="button"
            className={`px-5 py-3 text-xs sm:text-sm uppercase tracking-wider rounded-2xl border transition-all flex items-center gap-2 font-extrabold cursor-pointer shadow-xs ${
              isExploded
                ? "bg-[#a6413d] text-white border-[#a6413d]"
                : "bg-[#faf7f2]/95 hover:bg-[#f3ece1] text-[#a6413d] border-[#d6c5b0]"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            <span>{isExploded ? "🎀 Put Outfit Back" : "🧩 Pop Outfit Apart"}</span>
          </button>
        </div>

        {/* 5-Angle Studio Camera Switcher (Front, Back & Tail, Left, Right, 360 Spin) */}
        <div className="flex flex-col gap-2 w-full max-w-md">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] uppercase tracking-wider text-[#6e5540] font-extrabold">
              🎥 3D STUDIO CAMERA ANGLES:
            </span>
            <button
              type="button"
              onClick={() => setShowRefPhoto(!showRefPhoto)}
              className="text-[11px] text-[#a6413d] hover:underline font-extrabold cursor-pointer flex items-center gap-1"
            >
              <span>{showRefPhoto ? "🙈 Hide Reference Photo" : "🖼️ Compare Original Photo"}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 bg-[#faf7f2]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#dfd3c2] shadow-xs">
            {viewPresets.map((view) => (
              <button
                key={view.id}
                type="button"
                onClick={() => setCameraAngle(view.id)}
                className={`px-3 py-1.5 text-xs rounded-xl transition-all font-extrabold cursor-pointer ${
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
      </div>

      {/* Right Column: Open Stage for the 3D Avatar + Optional Reference Photo PiP */}
      <div className="relative w-full lg:w-[54%] min-h-[420px] sm:min-h-[540px] pointer-events-none flex items-end justify-end">
        {showRefPhoto && (
          <div className="pointer-events-auto bg-[#fffdf9]/95 backdrop-blur-xl p-3 rounded-3xl border-2 border-[#c7b097] shadow-2xl w-44 sm:w-52 flex flex-col gap-2 transition-all">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-[#4a331f] px-1">
              <span>📸 {activePreset.refTitle}</span>
              <button
                type="button"
                onClick={() => setShowRefPhoto(false)}
                className="text-[#a6413d] cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="w-full h-48 rounded-2xl overflow-hidden bg-[#f3ece1] border border-[#dfd3c2]">
              <img
                src={activePreset.refImg}
                alt={activePreset.refTitle}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RunwayHero;
