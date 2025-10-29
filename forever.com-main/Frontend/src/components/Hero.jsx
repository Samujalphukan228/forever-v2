"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        delay: custom * 0.2,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <section className="relative flex flex-col items-center justify-center px-6 py-16 sm:py-20 md:py-28 text-center bg-white overflow-hidden">
      {/* Hero Text */}
      <div className="max-w-3xl mx-auto">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 tracking-tight"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate={loaded ? "visible" : "hidden"}
        >
          Timeless <span className="italic font-normal">Earrings</span>
        </motion.h1>

        <motion.p
          className="mt-4 text-gray-600 text-base sm:text-lg md:text-xl font-light leading-relaxed"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate={loaded ? "visible" : "hidden"}
        >
          Handcrafted pieces that capture elegance and sophistication — made
          for those who value simplicity and beauty.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4 mt-8"
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate={loaded ? "visible" : "hidden"}
        >
          <Link to="/Collection">
            <motion.button
              className="px-8 py-3 sm:px-10 sm:py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800 transition-all duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Explore Collection
            </motion.button>
          </Link>

          <Link to="/About">
            <motion.button
              className="px-8 py-3 sm:px-10 sm:py-3 border border-gray-300 text-gray-800 text-xs uppercase tracking-widest hover:border-gray-900 transition-all duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Discover More
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Hero Image */}
      <motion.div
        className="w-full max-w-[1800px] mx-auto mt-14 sm:mt-16 md:mt-20 overflow-hidden rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={loaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <img
          src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1800&q=90"
          alt="Luxury Earrings Collection"
          className="w-full h-[320px] sm:h-[450px] md:h-[550px] lg:h-[620px] object-cover"
        />
      </motion.div>
    </section>
  );
};

export default Hero;
