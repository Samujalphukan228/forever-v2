import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import NewaLetterBox from '../components/NewaLetterBox';
import { FiArrowRight } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

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

const About = () => {
  const containerRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroImageRef = useRef(null);
  const processTitleRef = useRef(null);
  const processCardsRef = useRef([]);
  const whyTitleRef = useRef(null);
  const solutionCardsRef = useRef([]);
  const ctaRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial page load animation
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.2
      });

      // Hero section animation
      gsap.set([heroTextRef.current, heroImageRef.current], {
        opacity: 0,
        y: 30
      });

      tl.to(heroTextRef.current, {
        opacity: 1,
        y: 0,
        duration: 1
      })
      .to(heroImageRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        onComplete: () => {
          // Add hover effect after animation completes
          gsap.set(heroImageRef.current, { transformOrigin: "center" });
        }
      }, "-=0.6");

      // Process section animation
      ScrollTrigger.create({
        trigger: processTitleRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(processTitleRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
          );

          gsap.fromTo(processCardsRef.current,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power3.out",
              delay: 0.3
            }
          );
        },
        once: true
      });

      // Why Choose Us section animation
      ScrollTrigger.create({
        trigger: whyTitleRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(whyTitleRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
          );

          gsap.fromTo(solutionCardsRef.current,
            { opacity: 0, x: -20 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power3.out",
              delay: 0.3
            }
          );
        },
        once: true
      });

      // CTA section animation
      ScrollTrigger.create({
        trigger: ctaRef.current,
        start: "top 85%",
        onEnter: () => {
          gsap.fromTo(ctaRef.current,
            { opacity: 0, y: 20 },
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
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
          );
        },
        once: true
      });

      // Hover animations for cards
      processCardsRef.current.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { y: -4, duration: 0.3, ease: "power2.out" });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { y: 0, duration: 0.3, ease: "power2.out" });
        });
      });

      solutionCardsRef.current.forEach((card) => {
        const underline = card.querySelector('.underline');
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { x: 4, duration: 0.3, ease: "power2.out" });
          gsap.to(underline, { width: "100%", duration: 0.5, ease: "power2.out" });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { x: 0, duration: 0.3, ease: "power2.out" });
          gsap.to(underline, { width: "0%", duration: 0.5, ease: "power2.out" });
        });
      });

      // Hero image hover
      heroImageRef.current?.addEventListener('mouseenter', () => {
        gsap.to(heroImageRef.current, { scale: 1.02, duration: 0.3, ease: "power2.out" });
      });
      heroImageRef.current?.addEventListener('mouseleave', () => {
        gsap.to(heroImageRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="pt-24 lg:pt-28"
    >
      <div className="px-6 lg:px-16 xl:px-24 py-12 lg:py-16 space-y-16 lg:space-y-20 max-w-[1800px] mx-auto text-gray-800">
        
        {/* Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div ref={heroTextRef} className="space-y-5">
            <Title text1="ABOUT" text2="FOREVER" />
            <p className="text-sm lg:text-base text-gray-600 font-light leading-relaxed tracking-wide">
              At <span className="font-medium text-black">Forever</span>, we craft and curate premium earrings that embody elegance and timeless beauty. Every design tells a story.
            </p>
            <p className="text-xs lg:text-sm text-gray-500 font-light leading-relaxed tracking-wide">
              We believe luxury should be accessible. That's why we offer high-quality craftsmanship at prices that make you feel good — inside and out.
            </p>
          </div>

          <div 
            ref={heroImageRef}
            className="relative overflow-hidden"
          >
            <img
              src={assets.about_img}
              alt="About Forever"
              className="w-full h-72 lg:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
          </div>
        </section>

        {/* Process Section */}
        <section className="space-y-8">
          <div ref={processTitleRef}>
            <h2 className="text-2xl lg:text-3xl font-extralight text-black tracking-tight">Our Process</h2>
            <div className="w-12 h-[1px] bg-black mt-3"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workSteps.map(({ title, desc, number }, index) => (
              <div
                key={number}
                ref={(el) => (processCardsRef.current[index] = el)}
                className="bg-white border border-gray-200 p-6 hover:border-black hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em]">
                  Step {number}
                </span>
                <h3 className="text-base lg:text-lg font-medium text-black mt-3 mb-2">
                  {title}
                </h3>
                <p className="text-xs lg:text-sm text-gray-600 font-light leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="space-y-8">
          <div ref={whyTitleRef}>
            <h2 className="text-2xl lg:text-3xl font-extralight text-black tracking-tight">
              Why Choose Us
            </h2>
            <div className="w-12 h-[1px] bg-black mt-3"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solutions.map(({ title, desc }, idx) => (
              <div
                key={idx}
                ref={(el) => (solutionCardsRef.current[idx] = el)}
                className="relative bg-white border border-gray-200 p-6 hover:border-black hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                <div className="absolute top-3 right-4 text-5xl font-extralight text-gray-100 select-none pointer-events-none">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className="relative z-10 space-y-2">
                  <h3 className="text-base lg:text-lg font-medium text-black">
                    {title}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600 font-light leading-relaxed">
                    {desc}
                  </p>
                </div>
                <div className="underline absolute bottom-0 left-0 h-[1px] w-0 bg-black"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <NewaLetterBox />

        {/* CTA Section */}
        <section 
          ref={ctaRef}
          className="border-t border-gray-200 pt-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-2xl lg:text-3xl font-extralight text-black tracking-tight">
                Ready to find your perfect pair?
              </h3>
              <p className="text-sm lg:text-base text-gray-600 font-light">
                Explore our collections and treat yourself.
              </p>
            </div>
            <Link to="/collection">
              <button 
                className="px-8 py-3 bg-black text-white text-xs uppercase tracking-[0.15em] font-medium hover:bg-gray-800 transition-colors flex items-center gap-3 whitespace-nowrap"
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget.querySelector('svg'), { x: 3, duration: 0.2 });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget.querySelector('svg'), { x: 0, duration: 0.2 });
                }}
              >
                Shop Now <FiArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </section>

        {/* Footer Credit */}
        <div 
          ref={footerRef}
          className="text-center py-8 border-t border-gray-200"
        >
          <p className="text-xs lg:text-sm text-gray-600 font-light">
            Website developed by{' '}
            <a
              href="https://nexxupp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-black hover:underline transition-all"
            >
              Nexxupp.com
            </a>
          </p>
          <p className="text-xs text-gray-500 mt-1">contact@nexxupp.com</p>
        </div>
      </div>
    </div>
  );
};

export default About;