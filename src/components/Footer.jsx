import React from "react";

const Footer = () => {
  return (
    <>
      {/* Floating Bottom Quick-Jump Dock */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-[#2d1e14]/92 backdrop-blur-2xl text-[#faf7f2] px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3 sm:gap-4 border border-[#c7b097]/35">
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-1.5 py-0.5 bg-[#fff01f] text-[#2d1e14] font-display text-xs font-bold rounded-md">
            !
          </span>
          <span className="font-display text-xs sm:text-sm uppercase tracking-wider text-white font-bold">
            Aria
          </span>
        </div>
        <div className="h-4 w-[1px] bg-white/20"></div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-extrabold">
          <a href="#runway" className="px-2 py-1 hover:text-[#fff01f] transition-colors">
            TOP
          </a>
          <a
            href="#wardrobe-deconstruct"
            className="px-2 py-1 hover:text-[#fff01f] transition-colors"
          >
            OUTFIT
          </a>
          <a href="#rivals-arena" className="px-2 py-1 hover:text-[#fff01f] transition-colors">
            RIVALS
          </a>
          <a href="#1-speedway" className="px-2 py-1 hover:text-[#fff01f] transition-colors">
            SPEED
          </a>
          <a href="#robux-vault" className="px-2 py-1 hover:text-[#fff01f] transition-colors">
            VAULT
          </a>
        </div>
      </div>

      {/* Main Centered Footer */}
      <footer className="relative z-10 w-full pt-12 pb-28 border-t border-[#dfd3c2] bg-[#faf7f2]/65 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col gap-1">
            <span className="font-display text-sm sm:text-base uppercase tracking-wide text-[#2d1e14] font-bold">
              🦖 ARIA&apos;S COZY DINO EXPLORER WORLD ✨
            </span>
            <span className="text-xs text-[#6e5540] font-semibold">
              Made with love, sparkles &amp; 3D magic for Aria and her Roblox besties! 🎀
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {[
              { label: "🎮 Play Roblox", href: "https://www.roblox.com" },
              { label: "👗 Dress To Impress", href: "https://www.roblox.com" },
              { label: "🛍️ Avatar Shop", href: "https://www.roblox.com/catalog" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#fffdf9] hover:bg-[#f3ece1] text-xs uppercase text-[#4a331f] hover:text-[#a6413d] transition-colors rounded-2xl border border-[#dfd3c2] font-extrabold shadow-xs"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
