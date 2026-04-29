import { motion } from "framer-motion";
import { styles } from "../styles";

const Hero = () => {
    return (
        <section className="relative w-full h-screen mx-auto flex flex-col items-center justify-center pointer-events-none">
            <div className="text-center z-10 max-w-5xl mx-auto px-6">
                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-7xl md:text-[12rem] font-display font-bold text-white leading-none tracking-tighter"
                >
                    ORIA.
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-8 text-xl md:text-3xl text-secondary font-body font-light max-w-2xl mx-auto"
                >
                    A digital experience, reimagined for the modern era. Proving even the smallest idea can feel extraordinary.
                </motion.p>
            </div>

            <div className="absolute bottom-10 w-full flex justify-center pointer-events-auto">
                <a href="#about">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="flex flex-col items-center gap-4 cursor-pointer"
                    >
                        <span className="text-secondary text-xs uppercase tracking-[0.3em]">Discover</span>
                        <motion.div 
                            animate={{ height: ["0%", "100%"], opacity: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-[1px] h-[60px] bg-white origin-top" 
                        />
                    </motion.div>
                </a>
            </div>
        </section>
    );
};

export default Hero;
