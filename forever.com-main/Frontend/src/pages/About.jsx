import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import NewsletterBox from '../components/NewaLetterBox';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleSections, setVisibleSections] = useState({
    hero: false,
    process: false,
    why: false,
    cta: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer for sections
  useEffect(() => {
    const observerOptions = { threshold: 0.1 };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setVisibleSections((prev) => ({ ...prev, [sectionId]: true }));
        }
      });
    }, observerOptions);

    const sections = ['hero', 'process', 'why', 'cta'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const workSteps = [
    { title: "Curated Designs", desc: "Handpicked collections for every style.", number: "01" },
    { title: "Premium Quality", desc: "Crafted with care and quality materials.", number: "02" },
    { title: "Affordable Luxury", desc: "Stylish pieces without breaking the bank.", number: "03" },
    { title: "Customer Happiness", desc: "Dedicated support for seamless shopping.", number: "04" },
  ];

  const solutions = [
    { title: "Elegant Collections", desc: "Timeless jewelry for everyday and special occasions." },
    { title: "Gifting Made Easy", desc: "Beautifully packaged pieces perfect for gifts." },
    { title: "Exclusive Offers", desc: "Regular discounts and bundles for loyal customers." },
    { title: "Hassle-Free Returns", desc: "Easy returns and exchanges to keep you happy." },
  ];

  return (
    <div className="pt-24 lg:pt-28">
      <div className="px-4 sm:px-6 lg:px-12 py-12 lg:py-16 max-w-[1400px] mx-auto">
        
        {/* Hero Section */}
        <section
          id="hero"
          className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20 lg:mb-28 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Text Content */}
          <div className="space-y-6 order-2 lg:order-1">
            <div>
              <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">
                Our Story
              </span>
              <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extralight text-black leading-tight">
                About
                <span className="block font-light italic">forEver</span>
              </h1>
            </div>

            <div className="space-y-4">
              <p className="text-sm lg:text-base text-gray-600 font-light leading-relaxed">
                At <span className="font-medium text-black">forEver</span>, we craft and curate 
                premium jewelry that embodies elegance and timeless beauty. Every design tells a story.
              </p>
              <p className="text-sm text-gray-500 font-light leading-relaxed">
                We believe luxury should be accessible. That's why we offer high-quality 
                craftsmanship at prices that make you feel good — inside and out.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              {[
                { number: "10K+", label: "Happy Customers" },
                { number: "500+", label: "Unique Designs" },
                { number: "15+", label: "Years Experience" },
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-2xl font-extralight text-black">{stat.number}</div>
                  <div className="text-[10px] tracking-wider text-gray-400 uppercase mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative order-1 lg:order-2 group">
            <div className="overflow-hidden bg-gray-100 aspect-[4/5] lg:aspect-[3/4]">
              <img
                src={assets.about_img}
                alt="About forEver"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-gray-200 hidden lg:block" />
            <div className="absolute -top-4 -right-4 w-16 h-16 border border-gray-200 hidden lg:block" />
          </div>
        </section>

        {/* Process Section */}
        <section
          id="process"
          className={`mb-20 lg:mb-28 transition-all duration-1000 ${
            visibleSections.process ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="mb-10">
            <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">
              How We Work
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extralight text-black">
              Our Process
            </h2>
            <div className="w-12 h-px bg-black/20 mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workSteps.map(({ title, desc, number }, index) => (
              <div
                key={number}
                className={`group bg-white border border-gray-100 p-6 hover:border-black transition-all duration-500 ${
                  visibleSections.process ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: visibleSections.process ? `${index * 100}ms` : '0ms'
                }}
              >
                <span className="text-[10px] font-medium text-gray-300 uppercase tracking-[0.2em]">
                  Step {number}
                </span>
                <h3 className="text-base font-medium text-black mt-4 mb-2 group-hover:translate-x-1 transition-transform duration-300">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section
          id="why"
          className={`mb-20 lg:mb-28 transition-all duration-1000 ${
            visibleSections.why ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="mb-10">
            <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">
              Our Promise
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extralight text-black">
              Why Choose Us
            </h2>
            <div className="w-12 h-px bg-black/20 mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solutions.map(({ title, desc }, index) => (
              <div
                key={index}
                className={`group relative bg-white border border-gray-100 p-6 hover:border-black transition-all duration-500 overflow-hidden ${
                  visibleSections.why ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: visibleSections.why ? `${index * 100}ms` : '0ms'
                }}
              >
                {/* Background number */}
                <div className="absolute top-2 right-4 text-6xl font-extralight text-gray-100 select-none pointer-events-none">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="relative z-10 space-y-2">
                  <h3 className="text-base font-medium text-black group-hover:translate-x-1 transition-transform duration-300">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 font-light leading-relaxed">
                    {desc}
                  </p>
                </div>

                {/* Animated underline */}
                <div className="absolute bottom-0 left-0 h-px w-0 bg-black group-hover:w-full transition-all duration-500" />
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <div className="mb-20 lg:mb-28">
          <NewsletterBox />
        </div>

        {/* CTA Section */}
        <section
          id="cta"
          className={`border-t border-gray-100 pt-12 transition-all duration-1000 ${
            visibleSections.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-2xl lg:text-3xl font-extralight text-black">
                Ready to find your perfect piece?
              </h3>
              <p className="text-sm text-gray-500 font-light">
                Explore our collections and treat yourself.
              </p>
            </div>

            <Link
              to="/collection"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-black text-white text-xs uppercase tracking-[0.15em] font-medium hover:bg-gray-800 transition-colors"
            >
              <span>Shop Now</span>
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
            </Link>
          </div>
        </section>

        {/* Footer Credit */}
        <div className="text-center py-12 mt-12 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-light">
            Website developed by{' '}
            <a
              href="https://nexxupp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-black hover:underline underline-offset-2"
            >
              Nexxupp.com
            </a>
          </p>
          <p className="text-[10px] text-gray-400 mt-1">contact@nexxupp.com</p>
        </div>
      </div>
    </div>
  );
};

export default About;