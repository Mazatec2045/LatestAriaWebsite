import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { styles } from "../styles";
import { navLinks } from "../constants";

const Navbar = () => {
    const [active, setActive] = useState("");
    const [toggle, setToggle] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            if (scrollTop > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`${styles.paddingX} w-full flex items-center py-6 fixed top-0 z-50 transition-all duration-300 ${scrolled ? "bg-black/50 backdrop-blur-md border-b border-white/5" : "bg-transparent"}`}
        >
            <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
                <Link
                    to="/"
                    className="flex items-center gap-4 group"
                    onClick={() => {
                        setActive("");
                        window.scrollTo(0, 0);
                    }}
                >
                    <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center group-hover:border-white transition-colors">
                        <span className="text-white text-xl font-display font-medium">O</span>
                    </div>
                    <h1 className="text-white text-xl font-display font-medium tracking-widest uppercase">
                        ORIA
                    </h1>
                </Link>

                <div className="flex items-center gap-8">
                    <ul className="list-none hidden sm:flex flex-row gap-8">
                        {navLinks.map((nav) => (
                            <li
                                key={nav.id}
                                className={`${active === nav.title ? "text-white" : "text-white/50"
                                    } hover:text-white text-xs font-body uppercase tracking-widest transition-colors cursor-pointer`}
                                onClick={() => setActive(nav.title)}
                            >
                                <a href={`#${nav.id}`}>{nav.title}</a>
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Menu Toggle */}
                    <div className="sm:hidden flex items-center">
                        <div
                            className="w-10 h-10 cursor-pointer flex items-center justify-center text-white/80 hover:text-white transition-colors"
                            onClick={() => setToggle(!toggle)}
                        >
                            <span className="material-symbols-outlined text-2xl">{toggle ? "close" : "menu"}</span>
                        </div>

                        <div
                            className={`${!toggle ? "hidden" : "flex"
                                } p-6 bg-black/90 backdrop-blur-xl absolute top-20 right-0 mx-4 my-2 min-w-[200px] z-10 rounded-2xl border border-white/10 shadow-2xl`}
                        >
                            <ul className="list-none flex justify-end items-start flex-1 flex-col gap-6">
                                {navLinks.map((nav) => (
                                    <li
                                        key={nav.id}
                                        className={`font-body font-light cursor-pointer text-sm uppercase tracking-widest ${active === nav.title ? "text-white" : "text-white/50"
                                            }`}
                                        onClick={() => {
                                            setToggle(!toggle);
                                            setActive(nav.title);
                                        }}
                                    >
                                        <a href={`#${nav.id}`}>{nav.title}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
