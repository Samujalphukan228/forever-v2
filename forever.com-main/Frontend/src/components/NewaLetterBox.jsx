import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiAlertCircle } from "react-icons/fi";

const FeedbackBox = () => {
  const [form, setForm] = useState({ name: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name.trim() || !form.message.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (form.message.trim().length < 10) {
      setError("Message must be at least 10 characters");
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Feedback submitted:", form);
      setSubmitted(true);
      setForm({ name: "", message: "" });
      
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 }
    })
  };

  return (
    <section className="py-10 sm:py-14 md:py-16  bg-gradient-to-b ">
      <motion.div 
        className="max-w-2xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div className="text-center mb-8 sm:mb-10" custom={0} variants={itemVariants}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-2">
            Share Your Feedback
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto font-light">
            We'd love to hear from you. Your input helps us improve.
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300"
          custom={1}
          variants={itemVariants}
        >
          <div className="space-y-5">
            {/* Name Field */}
            <motion.div custom={2} variants={itemVariants}>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-200"
              />
            </motion.div>

            {/* Message Field */}
            <motion.div custom={3} variants={itemVariants}>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us your thoughts..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:border-gray-900 focus:outline-none resize-none h-28 transition-all duration-200"
              />
              <p className="text-xs text-gray-500 mt-1">
                {form.message.length} characters
              </p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              >
                <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading || submitted}
              custom={4}
              variants={itemVariants}
              whileHover={!loading && !submitted ? { scale: 1.01 } : {}}
              whileTap={!loading && !submitted ? { scale: 0.99 } : {}}
              className={`w-full py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
                submitted
                  ? "bg-green-500 text-white"
                  : loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-900 active:scale-95"
              }`}
            >
              {submitted ? (
                <>
                  <FiCheck className="w-4 h-4" />
                  Sent!
                </>
              ) : loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Feedback"
              )}
            </motion.button>
          </div>
        </motion.form>

        {/* Success Message */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center text-sm text-green-700 font-medium"
          >
            ✓ Thank you for your feedback! We appreciate your input.
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default FeedbackBox;