import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Title from '../components/Title';
import NewaLetterBox from '../components/NewaLetterBox';
import { toast } from 'react-toastify';
import { FiMail, FiExternalLink, FiCheck } from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [copiedEmail, setCopiedEmail] = useState(null);
  
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const infoRef = useRef(null);
  const footerRef = useRef(null);
  const buttonRefs = useRef([]);

  const contactCards = [
    { role: 'Owner', name: 'Nilutal Chetia', email: 'nilutalchetia@example.com' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial page animation
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.2
      });

      // Set initial states
      gsap.set([titleRef.current], {
        opacity: 0,
        y: 30
      });

      gsap.set(cardsRef.current, {
        opacity: 0,
        y: 40,
        scale: 0.95
      });

      // Title animation
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1
      });

      // Cards animation
      tl.to(cardsRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15
      }, "-=0.5");

      // Info section scroll trigger
      ScrollTrigger.create({
        trigger: infoRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(infoRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
          );
        },
        once: true
      });

      // Footer animation
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 90%",
        onEnter: () => {
          gsap.fromTo(footerRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
          );
        },
        once: true
      });

      // Card hover animations
      cardsRef.current.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { 
            y: -4, 
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            duration: 0.3, 
            ease: "power2.out" 
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { 
            y: 0,
            boxShadow: "none",
            duration: 0.3, 
            ease: "power2.out" 
          });
        });
      });

      // Button hover animations
      buttonRefs.current.forEach((button) => {
        if (button) {
          button.addEventListener('mouseenter', () => {
            gsap.to(button, { scale: 1.02, duration: 0.2 });
          });
          button.addEventListener('mouseleave', () => {
            gsap.to(button, { scale: 1, duration: 0.2 });
          });
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleCopyEmail = (email, buttonIndex) => {
    navigator.clipboard.writeText(email)
      .then(() => {
        setCopiedEmail(email);
        
        // Animate the button on successful copy
        const button = buttonRefs.current[buttonIndex];
        if (button) {
          gsap.to(button, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
          });
        }
        
        toast.success(`Email copied!`, {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          style: {
            background: '#111',
            color: '#fff',
            borderRadius: '0',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
            fontSize: '14px',
            fontWeight: '500',
          },
        });
        
        setTimeout(() => setCopiedEmail(null), 2000);
      })
      .catch(err => console.error('Failed to copy email:', err));
  };

  return (
    <div 
      ref={containerRef}
      className="pt-24 lg:pt-28"
    >
      <div className="px-6 lg:px-16 xl:px-24 py-12 lg:py-16 space-y-14 lg:space-y-16 max-w-[1800px] mx-auto">
        
        {/* Page Title */}
        <div ref={titleRef} className="text-center">
          <Title text1="CONTACT" text2="US" />
          <p className="mt-3 max-w-2xl mx-auto text-sm lg:text-base text-gray-500 font-light tracking-wide">
            We'd love to hear from you. Reach out with any questions about our products or orders.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {contactCards.map((card, idx) => (
            <div
              key={idx}
              ref={(el) => (cardsRef.current[idx] = el)}
              className="bg-white border border-gray-200 p-8 text-center hover:border-black transition-colors duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-center w-14 h-14 bg-gray-50 mx-auto mb-4">
                <FiMail className="w-6 h-6 text-black" />
              </div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em] mb-2">
                {card.role}
              </p>
              <p className="text-lg font-medium text-black mb-2">
                {card.name}
              </p>
              <p className="text-sm text-gray-600 mb-6 break-all font-light">
                {card.email}
              </p>
              <button
                ref={(el) => (buttonRefs.current[idx] = el)}
                onClick={() => handleCopyEmail(card.email, idx)}
                className={`w-full py-3 text-xs uppercase tracking-[0.15em] font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                  copiedEmail === card.email
                    ? 'bg-green-500 text-white'
                    : 'bg-black text-white hover:bg-gray-800'
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
              </button>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <section 
          ref={infoRef}
          className="bg-[#fafafa] border border-gray-200 p-10 lg:p-12 max-w-4xl mx-auto"
        >
          <div className="space-y-4">
            <h3 className="text-2xl lg:text-3xl font-extralight text-black tracking-tight">
              Get in Touch with Forever
            </h3>
            <p className="text-sm lg:text-base text-gray-600 font-light leading-relaxed tracking-wide">
              Have questions about our collections, shipping, or returns? You can reach out directly to our owner at the email above.
            </p>
            <p className="text-sm lg:text-base text-gray-600 font-light leading-relaxed tracking-wide">
              For technical support or website-related queries, visit{" "}
              <a
                href="https://nexxupp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-black hover:underline inline-flex items-center gap-1 transition-all"
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget.querySelector('svg'), { x: 2, y: -2, duration: 0.2 });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget.querySelector('svg'), { x: 0, y: 0, duration: 0.2 });
                }}
              >
                NexxUpp.com
                <FiExternalLink className="w-3 h-3" />
              </a>
            </p>
            <a 
              href="https://nexxupp.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-6"
            >
              <button 
                className="px-8 py-3 bg-black text-white text-xs uppercase tracking-[0.15em] font-medium hover:bg-gray-800 transition-colors"
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
                }}
              >
                Visit NexxUpp →
              </button>
            </a>
          </div>
        </section>

        {/* Newsletter */}
        <NewaLetterBox />

        {/* Footer Credit */}
        <div 
          ref={footerRef}
          className="text-center py-8 border-t border-gray-200"
        >
          <p className="text-xs lg:text-sm text-gray-600 font-light">
            Website developed by{" "}
            <a
              href="https://nexxupp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-black hover:underline transition-all"
            >
              NexxUpp.com
            </a>
          </p>
          <p className="text-xs text-gray-500 mt-1">contact@nexxupp.com</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;