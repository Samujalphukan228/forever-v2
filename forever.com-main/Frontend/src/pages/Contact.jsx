import { useState } from 'react';
import { motion } from 'framer-motion';
import Title from '../components/Title';
import NewaLetterBox from '../components/NewaLetterBox';
import { toast } from 'react-toastify';
import { FiMail, FiExternalLink, FiCheck } from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const [copiedEmail, setCopiedEmail] = useState(null);

  const contactCards = [
    { role: 'Owner', name: 'Nilutal Chetia', email: 'nilutalchetia@example.com' },
  ];

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email)
      .then(() => {
        setCopiedEmail(email);
        toast.success(`Email copied!`, {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          style: {
            background: '#111',
            color: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
            fontSize: '14px',
            fontWeight: '500',
          },
        });
        setTimeout(() => setCopiedEmail(null), 2000);
      })
      .catch(err => console.error('Failed to copy email:', err));
  };

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

  return (
    <motion.div 
      className="px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-14 space-y-12 sm:space-y-14 max-w-6xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Page Title */}
      <motion.div className="text-center" variants={itemVariants}>
        <Title text1="CONTACT" text2="US" />
        <p className="mt-2 sm:mt-3 max-w-xl mx-auto text-xs sm:text-sm md:text-base text-gray-600 font-light">
          We'd love to hear from you. Reach out with any questions about our products or orders.
        </p>
      </motion.div>

      {/* Contact Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
        variants={containerVariants}
      >
        {contactCards.map((card, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="bg-white border border-gray-200 rounded-xl p-6 sm:p-7 text-center hover:border-gray-900 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mx-auto mb-3">
              <FiMail className="w-6 h-6 text-gray-700" />
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              {card.role}
            </p>
            <p className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              {card.name}
            </p>
            <p className="text-sm text-gray-600 mb-4 break-all">
              {card.email}
            </p>
            <motion.button
              onClick={() => handleCopyEmail(card.email)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                copiedEmail === card.email
                  ? 'bg-green-500 text-white'
                  : 'bg-black text-white hover:bg-gray-900'
              }`}
            >
              {copiedEmail === card.email ? (
                <>
                  <FiCheck className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <FiMail className="w-4 h-4" />
                  Copy Email
                </>
              )}
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      {/* Info Section */}
      <motion.section 
        className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 sm:p-8 md:p-10"
        variants={itemVariants}
      >
        <div className="space-y-4">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-gray-900">
            Get in Touch with Forever
          </h3>
          <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
            Have questions about our collections, shipping, or returns? You can reach out directly to our owner at the email above.
          </p>
          <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
            For technical support or website-related queries, visit{" "}
            <a
              href="https://nexxupp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gray-900 hover:text-black inline-flex items-center gap-1"
            >
              NexxUpp.com
              <FiExternalLink className="w-3 h-3" />
            </a>
          </p>
          <motion.a 
            href="https://nexxupp.com" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block mt-4"
          >
            <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-black text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-900 transition-all">
              Visit NexxUpp →
            </button>
          </motion.a>
        </div>
      </motion.section>

      {/* Newsletter */}
      <motion.div variants={itemVariants}>
        <NewaLetterBox />
      </motion.div>

      {/* Footer Credit */}
      <motion.div 
        className="text-center py-6 sm:py-8 border-t border-gray-200"
        variants={itemVariants}
      >
        <p className="text-xs sm:text-sm text-gray-600 font-light">
          Website developed by{" "}
          <a
            href="https://nexxupp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-900 hover:text-black"
          >
            NexxUpp.com
          </a>
        </p>
        <p className="text-xs text-gray-500 mt-1">contact@nexxupp.com</p>
      </motion.div>
    </motion.div>
  );
};

export default Contact;