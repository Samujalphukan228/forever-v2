import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import NewaLetterBox from '../components/NewaLetterBox';
import { FiArrowRight } from 'react-icons/fi';

const workSteps = [
  { title: "Curated Designs", desc: "Handpicked collections for every style.", number: "01" },
  { title: "Premium Quality", desc: "Crafted with care and quality materials.", number: "02" },
  { title: "Affordable Luxury", desc: "Stylish earrings without breaking the bank.", number: "03" },
  { title: "Customer Happiness", desc: "Dedicated support for seamless shopping.", number: "04" },
];

const solutions = [
  { title: "Elegant Collections", desc: "Timeless earrings for everyday and special occasions." },
  { title: "Gifting Made Easy", desc: "Beautifully packaged earrings perfect for gifts." },
  { title: "Exclusive Offers", desc: "Regular discounts and bundles for loyal customers." },
  { title: "Hassle-Free Returns", desc: "Easy returns and exchanges to keep you happy." },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const About = () => {
  return (
    <motion.div 
      className="px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-14 space-y-12 sm:space-y-16 max-w-6xl mx-auto text-gray-800"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <motion.section 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-center"
        variants={itemVariants}
      >
        <div className="space-y-4 sm:space-y-5">
          <Title text1="ABOUT" text2="FOREVER" />
          <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
            At <span className="font-semibold text-gray-900">Forever</span>, we craft and curate premium earrings that embody elegance and timeless beauty. Every design tells a story.
          </p>
          <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
            We believe luxury should be accessible. That's why we offer high-quality craftsmanship at prices that make you feel good — inside and out.
          </p>
        </div>

        <motion.div 
          className="relative overflow-hidden rounded-xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={assets.about_img}
            alt="About Forever"
            className="w-full h-64 sm:h-72 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
        </motion.div>
      </motion.section>

      {/* Process Section */}
      <motion.section className="space-y-6 sm:space-y-8" variants={itemVariants}>
        <div>
          <h2 className="text-2xl sm:text-3xl font-light text-gray-900">Our Process</h2>
          <div className="w-10 h-0.5 bg-gray-900 mt-2"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {workSteps.map(({ title, desc, number }) => (
            <motion.div
              key={number}
              whileHover={{ y: -4 }}
              className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6 hover:border-gray-900 hover:shadow-lg transition-all duration-300"
            >
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Step {number}</span>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mt-3 mb-2">{title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section className="space-y-6 sm:space-y-8" variants={itemVariants}>
        <div>
          <h2 className="text-2xl sm:text-3xl font-light text-gray-900">Why Choose Us</h2>
          <div className="w-10 h-0.5 bg-gray-900 mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {solutions.map(({ title, desc }, idx) => (
            <motion.div
              key={idx}
              whileHover={{ x: 4 }}
              className="relative bg-white border border-gray-200 p-5 sm:p-6 rounded-lg hover:border-gray-900 hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              <div className="absolute top-2 right-3 text-4xl font-extralight text-gray-100 select-none pointer-events-none">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div className="relative z-10 space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">{desc}</p>
              </div>
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gray-900 group-hover:w-full transition-all duration-500"></div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Newsletter */}
      <motion.div variants={itemVariants}>
        <NewaLetterBox />
      </motion.div>

      {/* CTA Section */}
      <motion.section 
        className="border-t border-gray-200 pt-8 sm:pt-10"
        variants={itemVariants}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-gray-900">
              Ready to find your perfect pair?
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 font-light">
              Explore our collections and treat yourself.
            </p>
          </div>
          <Link to="/collection">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-black text-white rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-900 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              Shop Now <FiArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </motion.section>

      {/* Footer Credit */}
      <motion.div 
        className="text-center py-6 sm:py-8 border-t border-gray-200"
        variants={itemVariants}
      >
        <p className="text-xs sm:text-sm text-gray-600 font-light">
          Website developed by{' '}
          <a
            href="https://nexxupp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-900 hover:text-black"
          >
            Nexxupp.com
          </a>
        </p>
        <p className="text-xs text-gray-500 mt-1">contact@nexxupp.com</p>
      </motion.div>
    </motion.div>
  );
};

export default About;