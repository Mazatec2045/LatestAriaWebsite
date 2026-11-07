import React, { useState } from "react";

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("runway");
  const [sparkCount, setSparkCount] = useState(1428);
  const [justSparked, setJustSparked] = useState(false);

  const navLinks = [
    { id: "runway", label: "✨ Home" },
    { id: "wardrobe-deconstruct", label: "🦖 My Outfit" },
    { id: "rivals-arena", label: "🎯 Rivals" },
    { id: "1-speedway", label: "⚡ Speedway" },
    { id: "robux-vault", label: "💎 Vault" },
  ];

  const handleSendSpark = () => {
    setSparkCount((prev) => prev + 1);
    setJustSparked(true);
    setTimeout(() => setJustSparked(false), 450);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 py-3.5 px-4 sm:px-8 transition-all">
      <div className="max-w-6xl mx-auto bg-[#faf7f2]/88 backdrop-blur-2xl border border-[#dfd3c2] rounded-3xl shadow-[0_8px_28px_rgba(74,51,31,0.08)] px-5 sm:px-7 py-2.5 flex items-center justify-between gap-4">
        {/* Clean Logo with Avatar Thumbnail */}
        <a
          href="#runway"
          className="font-display text-xl sm:text-2xl tracking-tight text-[#2d1e14] font-bold flex items-center gap-2.5 hover:text-[#a6413d] transition-colors shrink-0"
        >
          <div className="w-9 h-9 rounded-2xl overflow-hidden border-2 border-[#c7b097] bg-[#f3ece1] shadow-xs">
            <img
              src="/aria-front.jpg"
              alt="Aria Explorer Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <span>ARIA</span>
          <span className="px-2 py-0.5 bg-[#fff01f] text-[#2d1e14] text-xs rounded-lg font-extrabold border border-[#e5c200]">
            !
          </span>
        </a>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-[#f1ebe0] rounded-2xl border border-[#dfd3c2]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setActiveSection(link.id)}
                className={`px-4 py-1.5 text-xs sm:text-sm transition-all rounded-xl font-bold ${
                  isActive
                    ? "bg-[#4a331f] text-[#faf7f2] shadow-xs"
                    : "text-[#6e5540] hover:text-[#2d1e14] hover:bg-white/80"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right Yellow Spark Cheer & Play Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleSendSpark}
            type="button"
            title="Send Aria a Golden Cheer!"
            className={`px-3.5 py-2 bg-[#fff9db] hover:bg-[#fff0a8] border border-[#e6cc65] rounded-2xl flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#4a331f] transition-all cursor-pointer ${
              justSparked ? "scale-110 bg-[#fff01f]" : "scale-100"
            }`}
          >
            <span className="text-sm leading-none">⭐</span>
            <span>{sparkCount.toLocaleString()}</span>
          </button>

          <a
            href="https://www.roblox.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#a6413d] hover:bg-[#4a331f] text-white text-xs sm:text-sm tracking-wide uppercase rounded-2xl transition-all flex items-center gap-1.5 font-extrabold shadow-xs"
          >
            <span>ROBLOX</span>
            <span className="material-symbols-outlined text-[15px]">north_east</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
