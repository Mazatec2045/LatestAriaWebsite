import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";

const ServiceCard = ({ index, title, subtitle, icon }) => (
  <motion.div
    variants={fadeIn("up", "spring", index * 0.1, 0.75)}
    className="w-full"
  >
    <div className="flex items-center justify-between glass-panel p-4 xs:p-6 hover:bg-white/5 transition-all cursor-pointer group">
      <div className="flex items-center gap-4 xs:gap-6">
        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white group-hover:border-white/30 transition-all shrink-0">
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        <div>
          <h3 className="font-display font-medium text-lg xs:text-xl text-white">{title}</h3>
          <p className="font-body text-secondary text-xs xs:text-sm mt-1">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <span className="material-symbols-outlined text-white text-sm">arrow_forward</span>
      </div>
    </div>
  </motion.div>
);

const About = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>The Philosophy</p>
        <h2 className={styles.sectionHeadText}>Crafting the <br/><span className="text-gradient">Extraordinary.</span></h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-8 text-secondary text-lg md:text-xl font-body font-light max-w-3xl leading-relaxed"
      >
        We believe that even the smallest idea can feel extraordinary when crafted with precision and care. 
        By blending cutting-edge technology with minimalist design, we elevate everyday concepts into immersive digital experiences. 
        This is where art meets innovation.
      </motion.p>

      <div className="mt-20 flex flex-col gap-4 max-w-3xl">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </div>
  );
};

const AboutSection = SectionWrapper(About, "about");
export default AboutSection;
