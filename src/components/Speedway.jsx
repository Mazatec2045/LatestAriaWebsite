import React, { useState } from "react";

const Speedway = () => {
  const [trail, setTrail] = useState("spark");

  const trailOptions = [
    { id: "spark", label: "⚡ YELLOW SPARK", speed: "842,500", color: "#e5b800" },
    { id: "berry", label: "🎀 BERRY RIBBON", speed: "990,200", color: "#a6413d" },
    { id: "cocoa", label: "🦖 DINO TURBO", speed: "1,250,000", color: "#4a331f" },
  ];

  const currentOption = trailOptions.find((t) => t.id === trail) || trailOptions[0];

  return (
    <section id="1-speedway" className="relative z-10 w-full py-4">
      {/* Warm Oat & Cream Frosted Container */}
      <div className="bg-[#faf7f2]/88 backdrop-blur-xl border border-[#dfd3c2] rounded-3xl p-6 sm:p-12 shadow-[0_12px_40px_rgba(74,51,31,0.08)] flex flex-col gap-10">
        {/* Header & Speedometer - Centered */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="px-4 py-1 bg-[#a6413d] text-white text-xs uppercase tracking-wider rounded-full font-extrabold">
              ⚡ ZONE B // SUPER SPEED
            </span>
            <span className="px-3 py-1 bg-[#fff9db] text-[#4a331f] border border-[#e6cc65] text-xs rounded-full font-extrabold">
              🏃‍♀️ OBBY &amp; PARKOUR PRO
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase text-[#2d1e14] font-bold tracking-tight">
            +1 SUPER SPEEDWAY ⚡
          </h2>

          <p className="font-body text-base sm:text-lg text-[#5c4430] leading-relaxed max-w-xl text-center font-medium">
            Pilot goggles down and dino tail wagging! Watch Aria zoom across giant bridges and beat the hardest Roblox obbies without falling once!
          </p>

          {/* Cute Speedometer - Centered */}
          <div className="flex items-center gap-4 bg-[#f3ece1] px-6 py-4 rounded-3xl border border-[#dfd3c2] mt-1 shadow-xs">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#dfd3c2]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.8"
                />
                <path
                  style={{ stroke: currentOption.color }}
                  className="transition-all duration-500"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeDasharray="94, 100"
                  strokeWidth="3.8"
                />
              </svg>
              <span className="material-symbols-outlined text-[#a6413d] text-[24px] absolute">
                bolt
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] text-[#6e5540] uppercase font-extrabold tracking-wider">
                ARIA&apos;S TOP RUNNING SPEED
              </span>
              <span className="font-display text-2xl sm:text-3xl text-[#2d1e14] font-bold leading-none">
                {currentOption.speed}
              </span>
              <span className="text-xs text-[#a6413d] font-extrabold mt-0.5">
                🚀 SUPER SONIC BOOST (x128)
              </span>
            </div>
          </div>
        </div>

        {/* 3 Favorite Game Records */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#fffdf9] p-6 rounded-3xl border border-[#dfd3c2] shadow-xs hover:shadow-md transition-all flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs px-3 py-1 bg-[#f3ece1] text-[#4a331f] rounded-xl font-extrabold">
                🏦 RECORD 01
              </span>
              <span className="text-xs sm:text-sm text-[#a6413d] font-extrabold">
                ⏱️ 18.2s
              </span>
            </div>
            <h3 className="font-display text-lg sm:text-xl text-[#2d1e14] font-bold mb-1.5">
              Brookhaven Secret Vault
            </h3>
            <p className="font-body text-xs sm:text-sm text-[#6e5540] mb-4 leading-relaxed font-medium">
              Found every hidden secret button and zoomed into the VIP town vault in record time!
            </p>
            <div className="w-full bg-[#f3ece1] h-2 rounded-full overflow-hidden mt-auto">
              <div className="bg-[#4a331f] h-full w-full rounded-full"></div>
            </div>
          </div>

          <div className="bg-[#fffdf9] p-6 rounded-3xl border border-[#dfd3c2] shadow-xs hover:shadow-md transition-all flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs px-3 py-1 bg-[#f3ece1] text-[#4a331f] rounded-xl font-extrabold">
                🗼 RECORD 02
              </span>
              <span className="text-xs sm:text-sm text-[#a6413d] font-extrabold">
                🏆 2m 48s
              </span>
            </div>
            <h3 className="font-display text-lg sm:text-xl text-[#2d1e14] font-bold mb-1.5">
              Tower of Hell Speed Climb
            </h3>
            <p className="font-body text-xs sm:text-sm text-[#6e5540] mb-4 leading-relaxed font-medium">
              Bounced all the way to the very top of the hardest tower in cozy pom-pom boots without falling!
            </p>
            <div className="w-full bg-[#f3ece1] h-2 rounded-full overflow-hidden mt-auto">
              <div className="bg-[#a6413d] h-full w-[96%] rounded-full"></div>
            </div>
          </div>

          <div className="bg-[#fffdf9] p-6 rounded-3xl border border-[#dfd3c2] shadow-xs hover:shadow-md transition-all flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs px-3 py-1 bg-[#f3ece1] text-[#4a331f] rounded-xl font-extrabold">
                ☁️ RECORD 03
              </span>
              <span className="text-xs sm:text-sm text-[#a6413d] font-extrabold">
                🌟 TOP 1%
              </span>
            </div>
            <h3 className="font-display text-lg sm:text-xl text-[#2d1e14] font-bold mb-1.5">
              Mega Cloud Island Jump
            </h3>
            <p className="font-body text-xs sm:text-sm text-[#6e5540] mb-4 leading-relaxed font-medium">
              Leaped across a giant 12,000-block sky gap between floating cloud islands with super speed!
            </p>
            <div className="w-full bg-[#f3ece1] h-2 rounded-full overflow-hidden mt-auto">
              <div className="bg-[#e5b800] h-full w-full rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Trail Selector Bar */}
        <div className="w-full bg-gradient-to-r from-[#2d1e14] via-[#4a331f] to-[#2d1e14] p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-[#faf7f2] shadow-md">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-[#fff01f] text-[#2d1e14] font-display text-lg font-bold rounded-xl">
              !
            </span>
            <div className="flex flex-col text-center sm:text-left">
              <span className="font-display text-base sm:text-lg font-bold">
                PICK ARIA&apos;S SPEED TRAIL!
              </span>
              <span className="text-xs text-[#e6d7c3]">
                Click a button to power up the speedometer!
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 bg-white/10 p-1.5 rounded-2xl">
            {trailOptions.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTrail(t.id)}
                className={`px-4 py-2 text-xs uppercase rounded-xl transition-all font-extrabold cursor-pointer ${
                  trail === t.id
                    ? "bg-[#a6413d] text-white shadow-sm"
                    : "text-[#e6d7c3] hover:bg-white/10"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Speedway;
