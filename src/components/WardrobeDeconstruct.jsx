import React, { useState } from "react";

const WardrobeDeconstruct = ({ isExploded, setIsExploded, setCameraAngle }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const wardrobeItems = [
    {
      id: "01",
      category: "🥽 HEADGEAR",
      badge: "EXPLORER PICK",
      slot: "HAT & HAIR",
      title: "Pilot Goggles & Milk-Tea Hair",
      desc: "Leather aviator goggles with shiny silver lenses resting on soft milk-tea feathered hair—plus a bright yellow comic burst!",
      price: "4,800 R$",
      priceLabel: "Catalog Gem",
      emoji: "⚡",
      image: "/aria-front.jpg",
      cropPosition: "50% 18%",
      cropScale: "scale-125",
      viewAngle: "front",
    },
    {
      id: "02",
      category: "🦖 PLUSH TAIL",
      badge: "ULTRA CUTE!",
      slot: "BACK TAIL",
      title: "Spotted Dino Tail & Big Red Bow",
      desc: "A giant curled buttery-yellow dino plush tail with terracotta spots, 3 red spikes, and a puffy berry-red lace ribbon bow!",
      price: "14,500 R$",
      priceLabel: "Dream Item",
      emoji: "🎀",
      image: "/aria-back.jpg",
      cropPosition: "50% 58%",
      cropScale: "scale-125",
      viewAngle: "wing",
    },
    {
      id: "03",
      category: "🧥 OVERALLS",
      badge: "5-STAR FIT",
      slot: "SHIRT & BIB",
      title: "Cocoa Explorer Overalls & Pin",
      desc: "Warm cocoa-brown dungaree shorts over an oat-khaki collared shirt, finished with a cute flower rosette badge and stitched wrist cuffs!",
      price: "3,600 R$",
      priceLabel: "Runway Fit",
      emoji: "🌼",
      image: "/aria-left.jpg",
      cropPosition: "50% 48%",
      cropScale: "scale-110",
      viewAngle: "wing",
    },
    {
      id: "04",
      category: "👢 COZY BOOTS",
      badge: "WINTER CUTE",
      slot: "BOOTS",
      title: "Sherpa Fur & Pom-Pom Boots",
      desc: "Rich cocoa-brown winter boots topped with fluffy snowy-white sherpa fur cuffs and two dangling white pom-pom balls!",
      price: "3,200 R$",
      priceLabel: "Closet Fav",
      emoji: "❄️",
      image: "/aria-right.jpg",
      cropPosition: "50% 82%",
      cropScale: "scale-125",
      viewAngle: "front",
    },
  ];

  return (
    <section id="wardrobe-deconstruct" className="relative z-10 w-full py-4">
      {/* Warm Oat & Cream Frosted Container */}
      <div className="bg-[#faf7f2]/88 backdrop-blur-xl border border-[#dfd3c2] rounded-3xl p-6 sm:p-10 shadow-[0_12px_40px_rgba(74,51,31,0.08)]">
        {/* Header Block - Centered */}
        <div className="flex flex-col items-center text-center gap-4 mb-10">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="px-4 py-1 bg-[#4a331f] text-[#faf7f2] text-xs uppercase tracking-wider rounded-full font-extrabold">
              🦖 ARIA&apos;S CLOSET
            </span>
            <span className="px-3 py-1 bg-[#fff9db] text-[#4a331f] border border-[#e6cc65] text-xs rounded-full font-extrabold">
              ✨ 360° OUTFIT SHOWCASE
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase text-[#2d1e14] font-bold tracking-tight">
            COZY DINO OUTFIT CHECK 🎀
          </h2>

          <p className="font-body text-base sm:text-lg text-[#5c4430] leading-relaxed max-w-xl text-center font-medium">
            Click any card to see Aria&apos;s real outfit from every angle—front, back, left, and right—or pop the 3D outfit apart!
          </p>

          {/* Total Value & Interactive 3D Toggle */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-1">
            <div className="flex items-center gap-3 bg-[#f3ece1] px-6 py-2.5 rounded-2xl border border-[#dfd3c2] shadow-xs">
              <span className="text-xs sm:text-sm uppercase text-[#6e5540] font-extrabold">
                ⭐ TOTAL OUTFIT VALUE:
              </span>
              <span className="font-display text-2xl sm:text-3xl text-[#a6413d] font-bold">
                26,100 R$
              </span>
            </div>

            {setIsExploded && (
              <button
                type="button"
                onClick={() => setIsExploded(!isExploded)}
                className="px-5 py-3 bg-[#a6413d] hover:bg-[#4a331f] text-white text-xs sm:text-sm uppercase tracking-wide rounded-2xl font-extrabold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
                <span>{isExploded ? "🎀 Put 3D Outfit Together" : "✨ Pop 3D Outfit Apart"}</span>
              </button>
            )}
          </div>
        </div>

        {/* 4-Card Outfit Grid featuring Front, Back, Left & Right Views */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wardrobeItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedItem(item);
                if (setCameraAngle && item.viewAngle) {
                  setCameraAngle(item.viewAngle);
                }
              }}
              className="group flex flex-col bg-[#fffdf9] p-5 rounded-3xl border border-[#dfd3c2] shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-[#a6413d] transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 bg-[#f3ece1] text-[#4a331f] text-xs rounded-xl font-extrabold">
                  {item.category}
                </span>
                <span className="text-xs text-[#a6413d] font-extrabold">{item.badge}</span>
              </div>

              <div className="h-48 w-full rounded-2xl overflow-hidden relative mb-4 bg-[#f3ece1] border border-[#e3d7c6] flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ objectPosition: item.cropPosition }}
                  className={`w-full h-full object-cover ${item.cropScale} group-hover:scale-[1.35] transition-transform duration-500`}
                />
                <span className="absolute top-2.5 left-2.5 w-8 h-8 rounded-xl bg-[#fffdf9]/90 backdrop-blur-sm flex items-center justify-center text-base shadow-xs border border-[#dfd3c2]">
                  {item.emoji}
                </span>
                <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-[#2d1e14]/85 text-[#faf7f2] text-[10px] rounded-lg font-extrabold tracking-wider">
                  {item.slot}
                </span>
              </div>

              <h3 className="font-display text-base sm:text-lg font-bold text-[#2d1e14] mb-1.5 group-hover:text-[#a6413d] transition-colors leading-snug">
                {item.title}
              </h3>
              <p className="font-body text-xs sm:text-sm text-[#6e5540] mb-4 leading-relaxed">
                {item.desc}
              </p>

              <div className="mt-auto pt-2 flex items-center justify-between bg-[#f3ece1] p-3 rounded-2xl border border-[#e3d7c6]">
                <span className="text-xs text-[#6e5540] uppercase font-bold">
                  {item.priceLabel}
                </span>
                <span className="text-sm sm:text-base text-[#a6413d] font-extrabold">
                  {item.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cute Item Inspector Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-[#2d1e14]/55 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-[#fffdf9] rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-[#c7b097] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 px-3 py-1 bg-[#f3ece1] hover:bg-[#e5dac9] text-[#4a331f] rounded-xl font-extrabold text-xs cursor-pointer"
            >
              ✕ CLOSE
            </button>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-[#f3ece1] text-[#4a331f] text-xs rounded-xl font-extrabold">
                {selectedItem.category}
              </span>
              <span className="text-xs text-[#a6413d] font-extrabold">
                {selectedItem.badge}
              </span>
            </div>
            <div className="w-full h-64 rounded-2xl overflow-hidden mb-4 bg-[#f3ece1] border border-[#dfd3c2]">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="font-display text-2xl font-bold text-[#2d1e14] mb-1.5">
              {selectedItem.emoji} {selectedItem.title}
            </h3>
            <p className="font-body text-sm text-[#5c4430] mb-4 leading-relaxed font-medium">
              {selectedItem.desc}
            </p>
            <div className="flex items-center justify-between p-3.5 bg-[#f3ece1] rounded-2xl mb-4 border border-[#dfd3c2]">
              <span className="text-xs uppercase text-[#6e5540] font-extrabold">
                Robux Value
              </span>
              <span className="text-lg font-extrabold text-[#a6413d]">
                {selectedItem.price}
              </span>
            </div>
            <a
              href="https://www.roblox.com/catalog"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#4a331f] hover:bg-[#a6413d] text-white text-xs sm:text-sm uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 font-extrabold shadow-sm"
            >
              <span>🛍️ FIND ON ROBLOX CATALOG</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </a>
          </div>
        </div>
      )}
    </section>
  );
};

export default WardrobeDeconstruct;
