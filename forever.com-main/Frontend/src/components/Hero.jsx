"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
        duration: 0.7,
        delay: custom * 0.15,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <>
      {/* Mobile Layout */}
      <section className="md:hidden relative flex flex-col items-center justify-center px-4 py-5 bg-white">
        <motion.div
          className="w-full overflow-hidden rounded-xl mb-5 shadow-sm"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={loaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80"
            alt="Luxury Earrings Collection"
            className="w-full h-72 object-cover"
          />
        </motion.div>

        <motion.div
          className="w-full text-center"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate={loaded ? "visible" : "hidden"}
        >
          <h1 className="text-2xl font-light text-gray-950 mb-1">
            Timeless <span className="italic font-normal">Earrings</span>
          </h1>
        </motion.div>

        <motion.p
          className="text-sm text-gray-600 text-center mb-6 leading-relaxed font-light"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate={loaded ? "visible" : "hidden"}
        >
          Handcrafted pieces that capture elegance and sophistication
        </motion.p>

        <motion.div
          className="flex flex-col gap-2.5 w-full"
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate={loaded ? "visible" : "hidden"}
        >
          <a
            href="/Collection"
            className="px-6 py-3 bg-black text-white text-xs uppercase tracking-wider font-semibold text-center rounded-lg hover:bg-gray-900 active:scale-95 transition-all duration-200"
          >
            Explore Collection
          </a>
          <a
            href="/About"
            className="px-6 py-3 border-2 border-gray-900 text-gray-900 text-xs uppercase tracking-wider font-semibold text-center rounded-lg hover:bg-gray-900 hover:text-white active:scale-95 transition-all duration-200"
          >
            Learn More
          </a>
        </motion.div>
      </section>

      {/* Desktop Layout */}
      <section className="hidden md:flex relative flex-col items-center justify-center px-6 py-14 lg:py-16 text-center bg-white">
        <div className="max-w-5xl mx-auto w-full">
          <motion.div
            className="mb-10"
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate={loaded ? "visible" : "hidden"}
          >
            <h1 className="text-5xl lg:text-6xl font-light text-gray-950 tracking-tight leading-tight">
              Timeless <span className="italic font-normal">Earrings</span>
            </h1>
          </motion.div>

          <motion.div
            className="w-16 h-1 bg-gray-950 mx-auto mb-8"
            variants={fadeUp}
            custom={0.5}
            initial="hidden"
            animate={loaded ? "visible" : "hidden"}
          />

          <motion.p
            className="text-base lg:text-lg text-gray-700 font-light leading-relaxed max-w-2xl mx-auto mb-10"
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate={loaded ? "visible" : "hidden"}
          >
            Handcrafted pieces that capture elegance and sophistication — made for those who value simplicity and beauty in every detail.
          </motion.p>

          <motion.div
            className="flex justify-center gap-5 mb-14"
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate={loaded ? "visible" : "hidden"}
          >
            <a
              href="/Collection"
              className="px-10 py-3.5 bg-gray-950 text-white text-xs uppercase tracking-wider font-semibold rounded-lg hover:bg-gray-800 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Explore Collection
            </a>
            <a
              href="/About"
              className="px-10 py-3.5 border-2 border-gray-950 text-gray-950 text-xs uppercase tracking-wider font-semibold rounded-lg hover:bg-gray-950 hover:text-white active:scale-95 transition-all duration-200"
            >
              Discover More
            </a>
          </motion.div>
        </div>

        <motion.div
          className="w-full overflow-hidden rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="group relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1800&q=90"
              alt="Luxury Earrings Collection"
              className="w-full h-[480px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-black/0 group-hover:from-black/5 transition-all duration-500" />
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Hero;