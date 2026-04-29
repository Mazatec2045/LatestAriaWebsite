import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant, fadeIn } from "../utils/motion";

const ExperienceCard = ({ experience, index }) => {
    return (
        <motion.div 
            variants={fadeIn("up", "spring", index * 0.2, 0.75)}
            className="relative flex flex-col md:flex-row gap-8 mb-16 last:mb-0 group"
        >
            {/* Timeline Line & Dot */}
            <div className="hidden md:flex flex-col items-center">
                <div className="w-4 h-4 rounded-full border-2 border-white/30 bg-black-100 group-hover:border-white group-hover:scale-125 transition-all z-10" />
                <div className="w-[1px] h-full bg-gradient-to-b from-white/20 to-transparent mt-2" />
            </div>

            {/* Content Card */}
            <div className="flex-1 glass-panel p-8 md:p-10 hover:bg-white/[0.02] transition-colors">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                        <h3 className="text-white text-2xl md:text-3xl font-display font-medium">{experience.title}</h3>
                        <p className="text-secondary text-sm md:text-base font-body tracking-widest uppercase mt-2">{experience.company_name}</p>
                    </div>
                    <div className="text-white/40 font-body text-sm font-light border border-white/10 rounded-full px-4 py-1">
                        {experience.date}
                    </div>
                </div>

                <ul className="mt-8 list-none space-y-4">
                    {experience.points.map((point, idx) => (
                        <li key={`point-${idx}`} className="text-secondary font-body font-light text-base flex gap-4 items-start">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2.5 shrink-0" />
                            <span className="leading-relaxed">{point}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
};

const Experience = () => {
    return (
        <div className="max-w-5xl mx-auto">
            <motion.div variants={textVariant()}>
                <p className={`${styles.sectionSubText} text-center`}>
                    The Evolution
                </p>
                <h2 className={`${styles.sectionHeadText} text-center mb-20`}>
                    Journey.
                </h2>
            </motion.div>

            <div className="max-w-4xl mx-auto">
                {experiences.map((experience, index) => (
                    <ExperienceCard 
                        key={`experience-${index}`} 
                        index={index} 
                        experience={experience} 
                    />
                ))}
            </div>
        </div>
    );
};

const ExperienceSection = SectionWrapper(Experience, "work");
export default ExperienceSection;
