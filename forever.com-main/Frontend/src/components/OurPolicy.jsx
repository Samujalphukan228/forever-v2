import { motion } from "framer-motion";
import { assets } from "../assets/assets";

const OurPolicy = () => {
  const policies = [
    {
      icon: assets.exchange_icon,
      title: "Easy Exchange",
      desc: "Hassle-free exchanges for all your purchases.",
    },
    {
      icon: assets.quality_icon,
      title: "7 Days Returns",
      desc: "Enjoy 7 days of free returns with ease.",
    },
    {
      icon: assets.support_img,
      title: "24/7 Support",
      desc: "Our team is available round the clock to help.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="py-10 sm:py-12 md:py-14 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          className="text-center mb-10 sm:mb-12"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-2">
            Our Commitment to You
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-light">
            We stand behind our products with quality and care
          </p>
        </motion.div>

        {/* Policy Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {policies.map((policy, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="bg-white rounded-xl p-6 sm:p-7 border border-gray-200 hover:border-gray-900 transition-all duration-300 h-full flex flex-col items-center text-center hover:shadow-lg">
                {/* Icon Container */}
                <motion.div
                  className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-100 mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src={policy.icon}
                    alt={policy.title}
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                  />
                </motion.div>

                {/* Text Content */}
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">
                  {policy.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-light">
                  {policy.desc}
                </p>

                {/* Bottom Accent Line */}
                <motion.div
                  className="h-0.5 w-0 bg-black mt-4 group-hover:w-8 transition-all duration-300"
                  initial={{ width: 0 }}
                  whileHover={{ width: 32 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default OurPolicy;