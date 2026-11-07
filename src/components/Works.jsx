import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const ProjectCard = ({
    index,
    name,
    description,
    tags,
    source_code_link,
}) => {
    return (
        <motion.div variants={fadeIn("up", "spring", index * 0.2, 0.75)} className="flex-1 w-full sm:w-[360px]">
            <Tilt
                tiltMaxAngleX={10}
                tiltMaxAngleY={10}
                scale={1.02}
                transitionSpeed={450}
                className="glass-panel p-5 sm:p-6 h-full flex flex-col group hover:border-white/20 transition-colors"
            >
                <div className="relative w-full h-[230px] rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
                    <div className="text-6xl text-white/50 group-hover:text-white group-hover:scale-110 transition-all duration-500">
                        {index === 0 ? "🎨" : "☁️"}
                    </div>
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-center backdrop-blur-sm">
                        <button
                            onClick={() => window.open(source_code_link, "_blank")}
                            className="px-6 py-2 rounded-full border border-white/50 text-white font-body text-sm hover:bg-white hover:text-black transition-colors"
                        >
                            Explore
                        </button>
                    </div>
                </div>

                <div className="mt-6 flex flex-col flex-grow">
                    <h3 className="text-white font-display font-medium text-2xl">{name}</h3>
                    <p className="mt-3 text-secondary font-body font-light text-sm leading-relaxed flex-grow">{description}</p>
                    
                    <div className="mt-6 flex flex-wrap gap-3">
                        {tags.map((tag) => (
                            <span
                                key={`${name}-${tag.name}`}
                                className="text-xs font-body tracking-wider uppercase text-white/40 border border-white/10 px-3 py-1 rounded-full"
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </div>
            </Tilt>
        </motion.div>
    );
};

const Works = () => {
    return (
        <div className="max-w-5xl mx-auto">
            <motion.div variants={textVariant()}>
                <p className={`${styles.sectionSubText}`}>The Portfolio</p>
                <h2 className={`${styles.sectionHeadText}`}>Creations.</h2>
            </motion.div>

            <div className="w-full flex">
                <motion.p
                    variants={fadeIn("", "", 0.1, 1)}
                    className="mt-6 text-secondary text-lg md:text-xl font-body font-light max-w-3xl leading-relaxed"
                >
                    The following projects showcase our capabilities through real-world applications. 
                    Each represents a unique challenge solved through a blend of intuitive design and robust engineering, 
                    pushing the boundaries of what is possible on the web.
                </motion.p>
            </div>

            <div className="mt-20 flex flex-wrap justify-center gap-8">
                {projects.map((project, index) => (
                    <ProjectCard key={`project-${index}`} index={index} {...project} />
                ))}
            </div>
        </div>
    );
};

const WorksSection = SectionWrapper(Works, "");
export default WorksSection;
