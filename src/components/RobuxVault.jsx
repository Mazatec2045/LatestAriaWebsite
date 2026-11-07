import React, { useState } from "react";

const RobuxVault = () => {
  const [tipValue, setTipValue] = useState(1000);
  const [submitted, setSubmitted] = useState(false);
  const [guestbookList, setGuestbookList] = useState([
    {
      id: 1,
      user: "@CozyDinoBestie",
      badge: "🦖 DINO FAN",
      time: "2m ago",
      text: '"Your spotted yellow dino tail with the big red bow is SO adorable!! Instant 5 stars on Dress To Impress!"',
      offer: "⭐ 2,500 R$ CHEER // Dress To Impress",
      highlightColor: "#a6413d",
    },
    {
      id: 2,
      user: "@BloxburgBuilderMia",
      badge: "🏰 HOUSE PRO",
      time: "14m ago",
      text: '"Your cozy treehouse mansion with the secret underground bowling alley is the coolest build ever!"',
      offer: "🌟 BEST BUILDER AWARD // Bloxburg",
      highlightColor: "#4a331f",
    },
    {
      id: 3,
      user: "@PilotGoggles99",
      badge: "⚡ SPEED STAR",
      time: "1h ago",
      text: '"Those aviator goggles and pom-pom boots look awesome! Let’s team up in Rivals next!"',
      offer: "🎉 5,000 R$ CHEER // Rivals",
      highlightColor: "#a6413d",
    },
  ]);

  const vaultItems = [
    {
      id: "sshf",
      badge: "🌟 DREAM FACE",
      title: "Super Kawaii Anime Eyes",
      desc: "Big expressive obsidian anime eyes and a sweet cat-smile—guaranteed 5 stars on every runway!",
      serial: "ULTRA RARE",
      val: "280,000 R$",
      image: "/aria-front.jpg",
    },
    {
      id: "valk",
      badge: "🦖 RARE PLUSH",
      title: "Golden Spotted Dino Tail",
      desc: "Limited-edition curled plush dino tail with 3 red spikes and a giant berry-red lace bow!",
      serial: "EDITION #1",
      val: "115,000 R$",
      image: "/aria-back.jpg",
    },
    {
      id: "bloxburg",
      badge: "🏰 MEGA BUILD",
      title: "Cozy Treehouse Palace",
      desc: "14 warm wooden bedrooms, a secret slide, rooftop lookout, and an underground glowing bowling alley!",
      serial: "VIP PLOT",
      val: "4,200,000 B$",
      image: "/aria-left.jpg",
    },
    {
      id: "dominus",
      badge: "🥽 EXPLORER RELIC",
      title: "Vintage Aviator Goggles",
      desc: "Kept safe inside Aria's treasure chest—hand-crafted leather pilot goggles with silver lenses!",
      serial: "LEGENDARY",
      val: "1,850,000 R$",
      image: "/aria-right.jpg",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const user = formData.get("username") || "@SuperBestie";
    const exp = formData.get("experience") || "Dress To Impress";
    const note = formData.get("note") || "Love your dino tail and goggles Aria!! 🦖✨";

    const newEntry = {
      id: Date.now(),
      user: user.startsWith("@") ? user : `@${user}`,
      badge: "⭐ VIP BESTIE",
      time: "Just now",
      text: `"${note}"`,
      offer: `🎉 ${tipValue.toLocaleString()} R$ CHEER // ${exp}`,
      highlightColor: "#a6413d",
    };

    setGuestbookList([newEntry, ...guestbookList]);
    setSubmitted(true);
    e.target.reset();
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="robux-vault" className="relative z-10 w-full py-4">
      {/* Warm Oat & Cream Frosted Container */}
      <div className="bg-[#faf7f2]/88 backdrop-blur-xl border border-[#dfd3c2] rounded-3xl p-6 sm:p-12 shadow-[0_12px_40px_rgba(74,51,31,0.08)] flex flex-col gap-12">
        {/* Title - Centered */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="px-4 py-1 bg-[#4a331f] text-[#faf7f2] text-xs uppercase tracking-wider rounded-full font-extrabold">
              💎 ZONE C // TREASURE BOX
            </span>
            <span className="px-3 py-1 bg-[#fff9db] text-[#4a331f] border border-[#e6cc65] text-xs rounded-full font-extrabold">
              ✨ RARE COLLECTION
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase text-[#2d1e14] font-bold tracking-tight">
            DREAM VAULT &amp; BESTIE WALL 💌
          </h2>

          <p className="font-body text-base sm:text-lg text-[#5c4430] leading-relaxed max-w-xl text-center font-medium">
            Take a peek inside Aria&apos;s secret explorer chest of rare Roblox items, cozy builds, and sweet messages from friends!
          </p>

          <div className="flex items-center gap-2 mt-1">
            <span className="px-4 py-2 bg-[#f3ece1] text-[#4a331f] text-xs sm:text-sm rounded-2xl font-extrabold flex items-center gap-2 border border-[#dfd3c2] shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#a6413d] animate-pulse"></span>
              🔒 EXPLORER VAULT SAFE &amp; LOCKED
            </span>
          </div>
        </div>

        {/* 4 Cards Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vaultItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#fffdf9] p-5 rounded-3xl border border-[#dfd3c2] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs px-2.5 py-1 bg-[#f3ece1] text-[#4a331f] rounded-xl font-extrabold">
                  {item.badge}
                </span>
                <span className="text-xs text-[#a6413d] font-extrabold">{item.serial}</span>
              </div>

              <div className="h-44 w-full rounded-2xl overflow-hidden relative mb-3.5 bg-[#f3ece1] border border-[#e3d7c6]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <h3 className="font-display text-base sm:text-lg font-bold text-[#2d1e14] mb-1.5 leading-snug">
                {item.title}
              </h3>
              <p className="font-body text-xs sm:text-sm text-[#6e5540] mb-4 leading-relaxed">
                {item.desc}
              </p>

              <div className="mt-auto pt-2 flex items-center justify-between bg-[#f3ece1] p-3 rounded-2xl border border-[#e3d7c6]">
                <span className="text-xs text-[#6e5540] uppercase font-bold">Treasure Value</span>
                <span className="text-sm sm:text-base text-[#a6413d] font-extrabold">
                  {item.val}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bestie Wall Form & Live Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
          {/* Sign the Bestie Wall */}
          <div className="lg:col-span-6 bg-[#fffdf9] p-7 rounded-3xl border border-[#dfd3c2] shadow-xs flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-[#2d1e14] flex items-center gap-2">
                <span>💌</span>
                <span>SIGN ARIA&apos;S BESTIE WALL!</span>
              </h3>
              <span className="text-xs text-[#a6413d] font-extrabold">SAY HI! 👋</span>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#6e5540] uppercase font-extrabold">
                    🎮 Your Roblox Name
                  </label>
                  <input
                    name="username"
                    required
                    type="text"
                    placeholder="@YourRobloxName"
                    className="w-full px-4 py-2.5 bg-[#f3ece1] text-[#2d1e14] rounded-2xl font-body text-sm border border-[#dfd3c2] focus:outline-none focus:ring-2 focus:ring-[#a6413d]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#6e5540] uppercase font-extrabold">
                    🌟 Favorite Game
                  </label>
                  <select
                    name="experience"
                    className="w-full px-4 py-2.5 bg-[#f3ece1] text-[#2d1e14] rounded-2xl font-body text-sm border border-[#dfd3c2] focus:outline-none focus:ring-2 focus:ring-[#a6413d]"
                  >
                    <option>Dress To Impress</option>
                    <option>Brookhaven RP</option>
                    <option>RIVALS</option>
                    <option>Adopt Me!</option>
                    <option>Tower of Hell</option>
                    <option>Bloxburg</option>
                  </select>
                </div>
              </div>

              {/* Fun Cheer Slider */}
              <div className="flex flex-col gap-2 bg-[#f3ece1] p-4 rounded-2xl border border-[#dfd3c2]">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#2d1e14] font-extrabold">
                    🎉 Send Virtual Robux Cheers!
                  </span>
                  <span className="text-[#a6413d] font-extrabold text-base">
                    {tipValue.toLocaleString()} R$ ⭐
                  </span>
                </div>
                <input
                  type="range"
                  min="250"
                  max="10000"
                  step="250"
                  value={tipValue}
                  onChange={(e) => setTipValue(Number(e.target.value))}
                  className="w-full accent-[#a6413d] cursor-pointer my-1"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#6e5540] uppercase font-extrabold">
                  💬 Your Message for Aria
                </label>
                <textarea
                  name="note"
                  required
                  rows="2"
                  placeholder="Write a fun message or tell Aria what game to play next! 🦖✨"
                  className="w-full px-4 py-2.5 bg-[#f3ece1] text-[#2d1e14] rounded-2xl font-body text-sm border border-[#dfd3c2] focus:outline-none focus:ring-2 focus:ring-[#a6413d]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#4a331f] hover:bg-[#a6413d] text-white text-xs sm:text-sm uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 font-extrabold shadow-md cursor-pointer"
              >
                <span>✨ POST TO BESTIE WALL!</span>
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>

              {submitted && (
                <div className="p-3 bg-[#a6413d] text-white text-xs sm:text-sm rounded-2xl text-center font-extrabold shadow-xs">
                  YAY! YOUR MESSAGE IS ON ARIA&apos;S WALL! 🎉🦖
                </div>
              )}
            </form>
          </div>

          {/* Bestie Wall Feed */}
          <div className="lg:col-span-6 bg-[#fffdf9] p-7 rounded-3xl border border-[#dfd3c2] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-[#2d1e14]">
                🦖 BESTIE MESSAGES
              </h3>
              <span className="text-xs text-[#a6413d] font-extrabold tracking-wider">
                ● LIVE WALL
              </span>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto max-h-[360px] pr-1">
              {guestbookList.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-[#f3ece1] rounded-2xl border border-[#dfd3c2] flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[#4a331f] font-extrabold">{item.user}</span>
                      <span className="px-2 py-0.5 bg-[#fffdf9] text-[#6e5540] rounded-full text-[10px] font-bold border border-[#dfd3c2]">
                        {item.badge}
                      </span>
                    </div>
                    <span className="text-[#6e5540] font-semibold">{item.time}</span>
                  </div>
                  <p className="font-body text-sm text-[#2d1e14] font-medium leading-snug">
                    {item.text}
                  </p>
                  <span
                    style={{ color: item.highlightColor }}
                    className="text-xs font-extrabold"
                  >
                    {item.offer}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RobuxVault;
