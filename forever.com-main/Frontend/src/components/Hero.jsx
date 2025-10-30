"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const Hero = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: custom * 0.12,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <>
      {/* Mobile Layout */}
      <section className="md:hidden relative flex flex-col items-center justify-center px-4 py-10 bg-white">
        <motion.div
          className="w-full overflow-hidden rounded-lg mb-6"
          variants={imageVariants}
          initial="hidden"
          animate={loaded ? "visible" : "hidden"}
        >
          <img
            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80"
            alt="Luxury Earrings Collection"
            className="w-full h-60 object-cover"
          />
        </motion.div>

        <motion.h1
          className="text-3xl font-light text-gray-950 mb-3 text-center"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate={loaded ? "visible" : "hidden"}
        >
          Timeless <span className="italic font-normal">Earrings</span>
        </motion.h1>

        <motion.p
          className="text-sm text-gray-600 text-center mb-6 leading-relaxed font-light max-w-sm"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate={loaded ? "visible" : "hidden"}
        >
          Handcrafted pieces that capture elegance and sophistication.
        </motion.p>

        <motion.div
          className="flex flex-col gap-3 w-full"
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate={loaded ? "visible" : "hidden"}
        >
          <motion.a
            href="/Collection"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-black text-white text-xs uppercase tracking-wider font-semibold text-center rounded-md hover:bg-gray-900 transition-all"
          >
            Explore Collection
          </motion.a>
          <motion.a
            href="/About"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 border border-gray-900 text-gray-900 text-xs uppercase tracking-wider font-semibold text-center rounded-md hover:bg-gray-900 hover:text-white transition-all"
          >
            Learn More
          </motion.a>
        </motion.div>
      </section>

      {/* Desktop Layout */}
      <section className="hidden md:flex relative flex-col items-center justify-center px-6 py-20 lg:py-24 text-center bg-white">
        <div className="max-w-4xl mx-auto w-full">
          {/* Heading */}
          <motion.div
            className="mb-4"
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate={loaded ? "visible" : "hidden"}
          >
            <h1 className="text-5xl lg:text-6xl font-light text-gray-950 tracking-tight leading-tight">
              Timeless <span className="italic font-normal">Earrings</span>
            </h1>
          </motion.div>

          {/* Divider */}
          <motion.div
            className="w-10 h-[2px] bg-gray-950 mx-auto mb-6"
            variants={fadeUp}
            custom={0.4}
            initial="hidden"
            animate={loaded ? "visible" : "hidden"}
          />

          {/* Description */}
          <motion.p
            className="text-base lg:text-lg text-gray-700 font-light leading-relaxed max-w-2xl mx-auto mb-10"
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate={loaded ? "visible" : "hidden"}
          >
            Handcrafted pieces that capture elegance and sophistication — designed for those who value simplicity and beauty in every detail.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex justify-center gap-4 mb-14"
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate={loaded ? "visible" : "hidden"}
          >
            <motion.a
              href="/Collection"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gray-950 text-white text-xs uppercase tracking-wider font-semibold rounded-md hover:bg-gray-800 transition-all shadow-sm"
            >
              Explore Collection
              <FiArrowRight className="w-4 h-4" />
            </motion.a>
            <motion.a
              href="/About"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 border border-gray-950 text-gray-950 text-xs uppercase tracking-wider font-semibold rounded-md hover:bg-gray-950 hover:text-white transition-all"
            >
              Discover More
            </motion.a>
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div
          className="w-full max-w-5xl overflow-hidden rounded-lg shadow-md"
          variants={imageVariants}
          initial="hidden"
          animate={loaded ? "visible" : "hidden"}
        >
          <div className="group relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1800&q=90"
              alt="Luxury Earrings Collection"
              className="w-full h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent transition-all duration-500" />
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Hero;
