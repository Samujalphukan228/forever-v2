import { useState, useEffect } from 'react';
import Title from '../components/Title';
import NewsletterBox from '../components/NewaLetterBox';
import { toast } from 'react-toastify';

const Contact = () => {
  const [copiedEmail, setCopiedEmail] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleSections, setVisibleSections] = useState({
    info: false,
  });

  const contactCards = [
    { role: 'Owner', name: 'Nilutal Chetia', email: 'nilutalchetia@example.com' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer for sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('info');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const handleCopyEmail = (email) => {
    navigator.clipboard
      .writeText(email)
      .then(() => {
        setCopiedEmail(email);

        toast.success('Email copied!', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          style: {
            background: '#111',
            color: '#fff',
            borderRadius: '0',
            fontSize: '14px',
          },
        });

        setTimeout(() => setCopiedEmail(null), 2000);
      })
      .catch((err) => console.error('Failed to copy email:', err));
  };

  return (
    <div className="pt-24 lg:pt-28">
      <div className="px-4 sm:px-6 lg:px-12 py-12 lg:py-16 max-w-[1400px] mx-auto">
        
        {/* Page Title */}
        <div
          className={`text-center mb-12 lg:mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">
            Get In Touch
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extralight text-black">
            Contact Us
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-sm text-gray-500 font-light">
            We'd love to hear from you. Reach out with any questions about our products or orders.
          </p>
          <div className="w-12 h-px bg-black/20 mx-auto mt-6" />
        </div>

        {/* Contact Cards */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-16 lg:mb-20 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {contactCards.map((card, index) => (
            <div
              key={index}
              className="group bg-white border border-gray-100 p-8 text-center hover:border-black hover:shadow-lg transition-all duration-500"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-14 h-14 bg-gray-50 mx-auto mb-5 group-hover:bg-black transition-colors duration-300">
                <svg
                  className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              {/* Info */}
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em] mb-2">
                {card.role}
              </p>
              <p className="text-lg font-light text-black mb-1">{card.name}</p>
              <p className="text-sm text-gray-500 font-light mb-6 break-all">
                {card.email}
              </p>

              {/* Copy Button */}
              <button
                onClick={() => handleCopyEmail(card.email)}
                className={`w-full py-3.5 text-xs uppercase tracking-[0.15em] font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                  copiedEmail === card.email
                    ? 'bg-green-500 text-white'
                    : 'bg-black text-white hover:bg-gray-800 active:scale-[0.98]'
                }`}
              >
                {copiedEmail === card.email ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <section
          id="info"
          className={`bg-gray-50 border border-gray-100 p-8 lg:p-12 max-w-3xl mx-auto mb-16 lg:mb-20 transition-all duration-1000 ${
            visibleSections.info ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="space-y-5">
            <h3 className="text-2xl font-extralight text-black">
              Get in Touch with forEver
            </h3>

            <div className="space-y-4 text-sm text-gray-600 font-light leading-relaxed">
              <p>
                Have questions about our collections, shipping, or returns? You can reach out 
                directly to our owner at the email above.
              </p>
              <p>
                For technical support or website-related queries, visit{' '}
                <a
                  href="https://nexxupp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 font-medium text-black hover:underline underline-offset-2"
                >
                  NexxUpp.com
                  <svg
                    className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </p>
            </div>

            <a
              href="https://nexxupp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 mt-4 px-6 py-3 bg-black text-white text-xs uppercase tracking-[0.15em] font-medium hover:bg-gray-800 transition-colors"
            >
              <span>Visit NexxUpp</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </section>

        {/* Newsletter */}
        <div className="mb-16 lg:mb-20">
          <NewsletterBox />
        </div>

        {/* Footer Credit */}
        <div className="text-center py-8 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-light">
            Website developed by{' '}
            <a
              href="https://nexxupp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-black hover:underline underline-offset-2"
            >
              NexxUpp.com
            </a>
          </p>
          <p className="text-[10px] text-gray-400 mt-1">contact@nexxupp.com</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;