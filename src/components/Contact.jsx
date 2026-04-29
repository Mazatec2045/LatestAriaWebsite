import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

const Contact = () => {
    const formRef = useRef();
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { target } = e;
        const { name, value } = target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert("Inquiry received. We will be in touch shortly.");
            setForm({ name: "", email: "", message: "" });
        }, 1500);
    };

    return (
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 overflow-hidden">
            <motion.div
                variants={slideIn("left", "tween", 0.2, 1)}
                className="flex-[0.6] glass-panel p-8 md:p-12"
            >
                <p className={styles.sectionSubText}>Get in touch</p>
                <h3 className={styles.sectionHeadText}>Connect.</h3>

                <form ref={formRef} onSubmit={handleSubmit} className="mt-12 flex flex-col gap-8">
                    <label className="flex flex-col">
                        <span className="text-white/60 font-body text-sm tracking-widest uppercase mb-3">Name</span>
                        <input
                            type="text" name="name" value={form.name} onChange={handleChange}
                            placeholder="John Doe"
                            className="bg-white/5 py-4 px-6 text-white font-body border border-white/10 rounded-lg outline-none focus:border-white/30 transition-colors"
                        />
                    </label>
                    <label className="flex flex-col">
                        <span className="text-white/60 font-body text-sm tracking-widest uppercase mb-3">Email</span>
                        <input
                            type="email" name="email" value={form.email} onChange={handleChange}
                            placeholder="john@example.com"
                            className="bg-white/5 py-4 px-6 text-white font-body border border-white/10 rounded-lg outline-none focus:border-white/30 transition-colors"
                        />
                    </label>
                    <label className="flex flex-col">
                        <span className="text-white/60 font-body text-sm tracking-widest uppercase mb-3">Message</span>
                        <textarea
                            rows={5} name="message" value={form.message} onChange={handleChange}
                            placeholder="How can we help?"
                            className="bg-white/5 py-4 px-6 text-white font-body border border-white/10 rounded-lg outline-none resize-none focus:border-white/30 transition-colors"
                        />
                    </label>
                    <button 
                        type="submit" 
                        className="mt-4 bg-white text-black py-4 px-8 font-body font-medium uppercase tracking-widest rounded-lg hover:bg-white/90 transition-colors flex justify-center items-center"
                    >
                        {loading ? (
                            <span className="animate-pulse">Sending...</span>
                        ) : (
                            "Submit Inquiry"
                        )}
                    </button>
                </form>
            </motion.div>

            <motion.div
                variants={slideIn("right", "tween", 0.2, 1)}
                className="flex-[0.4] flex flex-col justify-center items-start pt-10 md:pt-0"
            >
                <h4 className="text-white font-display text-3xl mb-6">Let's build something extraordinary.</h4>
                <p className="text-secondary font-body font-light leading-relaxed mb-10">
                    Whether you have a fully formed product idea or just a spark of inspiration, 
                    our team is ready to help you bring it to life. Reach out and let's start the conversation.
                </p>
                
                <div className="flex flex-col gap-4 w-full">
                    <div className="glass-panel p-6 w-full flex items-center gap-4">
                        <span className="material-symbols-outlined text-white/50">mail</span>
                        <div>
                            <p className="text-white/50 text-xs uppercase tracking-widest">Email</p>
                            <p className="text-white font-body mt-1">hello@oria.studio</p>
                        </div>
                    </div>
                    <div className="glass-panel p-6 w-full flex items-center gap-4">
                        <span className="material-symbols-outlined text-white/50">location_on</span>
                        <div>
                            <p className="text-white/50 text-xs uppercase tracking-widest">Location</p>
                            <p className="text-white font-body mt-1">Global Remote</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const ContactSection = SectionWrapper(Contact, "contact");
export default ContactSection;
