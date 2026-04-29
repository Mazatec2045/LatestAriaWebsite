import React from "react";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { motion } from "framer-motion";
import { textVariant } from "../utils/motion";
import { styles } from "../styles";

const Tech = () => {
    return (
        <div className="max-w-5xl mx-auto">
            <motion.div variants={textVariant()}>
                <p className={`${styles.sectionSubText} text-center`}>
                    The Arsenal
                </p>
                <h2 className={`${styles.sectionHeadText} text-center mb-16`}>
                    Technology.
                </h2>
            </motion.div>

            <div className="flex flex-row flex-wrap justify-center gap-6 max-w-4xl mx-auto">
                {technologies.map((technology, index) => (
                    <div 
                        key={technology.name}
                        className="glass-panel w-24 h-24 sm:w-28 sm:h-28 flex flex-col items-center justify-center cursor-pointer group hover:bg-white/[0.05] transition-all relative overflow-hidden"
                        title={technology.name}
                    >
                        <div className="text-4xl text-white/50 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                            {index === 0 ? "🖍️" : index === 1 ? "☁️" : index === 2 ? "✨" : index === 3 ? "✏️" : index === 4 ? "🎀" : index === 5 ? "🖱️" : "✂️"}
                        </div>
                        
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 group-hover:bottom-2 transition-all duration-300">
                            <span className="text-white/80 font-body text-xs whitespace-nowrap">{technology.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TechSection = SectionWrapper(Tech, "");
export default TechSection;
