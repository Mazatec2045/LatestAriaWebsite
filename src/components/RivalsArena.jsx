import React, { useState } from "react";

const RivalsArena = () => {
  const [activeWeapon, setActiveWeapon] = useState("sniper");
  const [reticleType, setReticleType] = useState("spark");

  const weapons = [
    {
      id: "sniper",
      name: "🦖 Dino Sparkle Blaster",
      stat: "99% STAR AIM",
      desc: "Shoots golden sunbeam bolts that burst into bright yellow comic stars on every tag!",
      tags: "8,429 TAGS",
      speed: "SUPER FAST",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA8zNh6q_NxH1uaNZ_cOkouHW2JlRW-mYYqSCo8-djMFc7rgN1DM_rSFiXp5q3r4Kv6J7eBmlprrIWyW2W3S54b7OWzXVbEPLSrAxV83gcpe3ZoFFGSkRAIxreXy3x0fp-y16lsIKFQPwwo2vvVCmiwRSjLD99l-KhxMmVCrBwUtGiXBTtJ_cM98SCEiXSYadNBTna_aNyxoxB_H2mR5xKrKhjeTHNYHfElCAvw5c-qcdT12K9wKY5F",
    },
    {
      id: "smg",
      name: "🍪 Cocoa & Cream Twin Poppers",
      stat: "DOUBLE POP!",
      desc: "Twin milk-tea & cocoa blasters with aviator goggle sights and fun pop sound effects!",
      tags: "14,102 TAGS",
      speed: "TURBO POP",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDheSYvOE0-S_vLQYfH0LCiNsXqOXMIcNQENKQ3wBIRwJMPMdqF5HwniUXdcaCNrA0342HmSW9hxc0dL-A6-Wy0O5jEib6X-5U2fRTFU05iYmlnq4u8uYhWq5Zzrbs9Xivp3O3buwtV-KKkFfO-dmiXZlztnY3QkZkmoA5N4v09RQMoNS-rDCKc8CdEkMbChkZ1I_BDMz85-QglysPPO1ZhTdHji1XDsk21ifdooVbUdiCMEAni40LW",
    },
    {
      id: "katana",
      name: "🎀 Berry-Red Ribbon Dash Wand",
      stat: "+25% ZOOM BOOST",
      desc: "Gives Aria a golden trail boost to super-jump and dash across the entire Rivals map!",
      tags: "3,890 TAGS",
      speed: "MEGA DASH",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB4vbv33Xpj_JnBNTpsRgNIXgmKUDhTlx342H_4iIUHn8aciSvKZHfXn-vRhg5qRFurqLbgfN0MrfOVpS5RSddJxEvGnNx3w2rSzTlfMMnVK3KGFeiOgAcLTb-s-87X2z-uXiwGPBKcS4n1P2RIQPJovoIDsWx6dltnnHty3EkriQjfniyjcDzJXY8nKWxFWw6Ah3c44-gsClVTK6F1GH00C4Oa1VGLrZgRZNK0mEnK3eina1Ma0nA7",
    },
  ];

  return (
    <section id="rivals-arena" className="relative z-10 w-full py-4">
      {/* Rich Espresso-Cocoa Glass Card */}
      <div className="bg-gradient-to-br from-[#2d1e14]/95 via-[#3d291b]/95 to-[#24170f]/95 backdrop-blur-2xl border border-[#c7b097]/35 rounded-3xl p-6 sm:p-12 shadow-2xl text-[#faf7f2]">
        <div className="flex flex-col gap-10">
          {/* Title & Rank - Centered */}
          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <span className="px-4 py-1 bg-[#a6413d] text-white text-xs uppercase tracking-wider rounded-full font-extrabold">
                🎮 GAME ZONE // RIVALS
              </span>
              <span className="px-4 py-1 bg-[#fff01f] text-[#2d1e14] text-xs uppercase rounded-full font-extrabold">
                🏆 EXPLORER CHAMPION
              </span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase text-[#faf7f2] font-bold tracking-tight">
              RIVALS ARENA PRO 🎯
            </h2>

            <p className="font-body text-base sm:text-lg text-[#e6d7c3] max-w-xl text-center leading-relaxed font-medium">
              Pilot goggles locked on target! Super-fast reflexes, golden spark blasters, and undefeated teamwork with my besties!
            </p>

            {/* Fun Game Stats - Centered */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 bg-white/8 px-8 py-4 rounded-3xl border border-[#c7b097]/25 mt-2 shadow-inner">
              <div className="flex flex-col items-center">
                <span className="text-xs text-[#e6d7c3] uppercase font-bold">
                  🏆 1v1 Victories
                </span>
                <span className="font-display text-2xl sm:text-3xl text-[#fff01f] font-bold">
                  1,420
                </span>
              </div>
              <div className="hidden sm:block h-10 w-[1px] bg-white/15"></div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-[#e6d7c3] uppercase font-bold">
                  🌟 Win Streak
                </span>
                <span className="font-display text-2xl sm:text-3xl text-[#faf7f2] font-bold">
                  98.4%
                </span>
              </div>
              <div className="hidden sm:block h-10 w-[1px] bg-white/15"></div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-[#e6d7c3] uppercase font-bold">
                  🦖 MVP Trophies
                </span>
                <span className="font-display text-2xl sm:text-3xl text-[#f29b7e] font-bold">
                  482
                </span>
              </div>
            </div>
          </div>

          {/* Loadout & Cute Aim Picker */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Loadout list */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <span className="text-xs sm:text-sm uppercase tracking-wider text-[#e6d7c3] font-extrabold">
                ✨ CLICK TO PICK ARIA&apos;S EXPLORER GEAR:
              </span>

              {weapons.map((w) => {
                const isSelected = activeWeapon === w.id;
                return (
                  <div
                    key={w.id}
                    onClick={() => setActiveWeapon(w.id)}
                    className={`cursor-pointer p-4 rounded-2xl transition-all flex flex-col sm:flex-row items-center gap-4 border ${
                      isSelected
                        ? "bg-white/14 border-[#fff01f] shadow-lg scale-[1.01]"
                        : "bg-white/[0.05] border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="w-full sm:w-32 h-24 rounded-xl bg-black/40 overflow-hidden shrink-0 border border-white/15">
                      <img src={w.image} alt={w.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-display text-base sm:text-lg font-bold text-white">
                          {w.name}
                        </h4>
                        <span className="text-[#fff01f] text-xs sm:text-sm font-extrabold shrink-0">
                          {w.stat}
                        </span>
                      </div>
                      <p className="font-body text-xs sm:text-sm text-[#e6d7c3] mt-1 leading-relaxed">
                        {w.desc}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="text-[#f29b7e] font-extrabold">⭐ {w.tags}</span>
                        <span className="text-[#ebd08e] font-bold">⚡ {w.speed}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Goggle Aim Tester & Match Highlights */}
            <div className="lg:col-span-5 flex flex-col gap-3.5 bg-white/[0.06] p-5 rounded-3xl border border-[#c7b097]/25">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase text-white font-extrabold">
                  🥽 PILOT GOGGLE SIGHT
                </span>
                <span className="text-xs text-[#fff01f] font-extrabold">
                  SPARK LOCK: ON !
                </span>
              </div>

              {/* Target Area */}
              <div className="w-full h-40 bg-[#1a110b]/85 rounded-2xl relative flex items-center justify-center overflow-hidden border border-[#c7b097]/30">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
                  <div className="w-full h-[1px] bg-[#ebd08e]"></div>
                  <div className="h-full w-[1px] bg-[#ebd08e] absolute"></div>
                </div>

                <div className="relative z-10">
                  {reticleType === "spark" && (
                    <div className="flex flex-col items-center justify-center animate-bounce">
                      <span className="px-3 py-1 bg-[#fff01f] text-[#2d1e14] font-display text-2xl font-bold rounded-xl shadow-md">
                        !
                      </span>
                      <span className="text-[10px] text-[#fff01f] font-extrabold mt-1">
                        SPARK LOCK!
                      </span>
                    </div>
                  )}
                  {reticleType === "star" && (
                    <div className="flex flex-col items-center justify-center animate-pulse">
                      <span className="text-4xl">🌟</span>
                      <span className="text-[10px] text-[#fde68a] font-extrabold mt-1">
                        STAR POWER!
                      </span>
                    </div>
                  )}
                  {reticleType === "dino" && (
                    <div className="flex flex-col items-center justify-center animate-bounce">
                      <span className="text-4xl">🦖</span>
                      <span className="text-[10px] text-[#ebd08e] font-extrabold mt-1">
                        DINO ROAR!
                      </span>
                    </div>
                  )}
                </div>

                <div className="absolute top-2.5 left-3 text-[10px] text-[#e6d7c3] font-bold">
                  MODE: FUN ARENA
                </div>
                <div className="absolute bottom-2.5 right-3 text-[10px] text-[#fff01f] font-extrabold">
                  100% SHIELD 🛡️
                </div>
              </div>

              {/* Reticle Buttons */}
              <div className="flex items-center gap-2">
                {[
                  { id: "spark", label: "⚡ SPARK !" },
                  { id: "star", label: "🌟 STAR" },
                  { id: "dino", label: "🦖 DINO" },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setReticleType(r.id)}
                    className={`flex-1 py-2 text-xs uppercase rounded-xl transition-colors font-extrabold cursor-pointer ${
                      reticleType === r.id
                        ? "bg-[#a6413d] text-white shadow-sm"
                        : "bg-white/10 hover:bg-white/20 text-[#e6d7c3]"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              {/* Friendly Match Highlights */}
              <div className="flex flex-col gap-1.5 pt-1 text-xs">
                <div className="flex items-center justify-between p-2 bg-white/[0.06] rounded-xl">
                  <span className="text-[#ebd08e] font-extrabold">ARIA 🦖</span>
                  <span className="text-[#fff01f] font-bold">🏆 WON 1ST PLACE!</span>
                  <span className="text-white font-semibold">MVP Star</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white/[0.06] rounded-xl">
                  <span className="text-[#ebd08e] font-extrabold">ARIA 🦖</span>
                  <span className="text-[#f29b7e] font-bold">🎀 DINO TAIL DASH!</span>
                  <span className="text-white font-semibold">+500 XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RivalsArena;
