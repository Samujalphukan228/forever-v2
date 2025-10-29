import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import NewaLetterBox from '../components/NewaLetterBox';

const workSteps = [
  { title: "Curated Designs", desc: "Handpicked earring collections that suit every style.", number: "01" },
  { title: "Premium Quality", desc: "Crafted with care and high-quality materials.", number: "02" },
  { title: "Affordable Luxury", desc: "Stylish earrings without breaking the bank.", number: "03" },
  { title: "Customer Happiness", desc: "Dedicated support to make your shopping seamless.", number: "04" },
];

const solutions = [
  { title: "Elegant Collections", desc: "Timeless earrings for everyday and special occasions." },
  { title: "Gifting Made Easy", desc: "Beautifully packaged earrings perfect for gifts." },
  { title: "Exclusive Offers", desc: "Regular discounts and bundles for our loyal customers." },
  { title: "Hassle-Free Returns", desc: "Easy returns and exchanges to keep you happy." },
];

const About = () => {
  return (
    <div className="px-6 md:px-16 lg:px-32 py-12 space-y-20 text-gray-800">

      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <Title text1="ABOUT" text2="FOREVER" />
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            At <b>Forever</b>, we craft and curate premium earrings that embody elegance, confidence, and timeless beauty. 
            Every design tells a story — made for those who love subtle sophistication and effortless charm.
          </p>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            We believe luxury should be accessible. That's why we offer high-quality craftsmanship at prices that 
            make you feel good — inside and out.
          </p>
        </div>

        <div className="relative">
          <img
            src={assets.about_img}
            alt="About Forever"
            className="w-full md:h-[420px] object-cover rounded-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-2xl"></div>
        </div>
      </section>

      {/* How We Work / Steps */}
      <section className="space-y-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-light text-gray-900">Our Process</h2>
          <div className="w-14 h-[1px] bg-gray-300 mt-2"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {workSteps.map(({ title, desc, number }) => (
            <div
              key={number}
              className="border border-gray-100 bg-white rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-gray-400 font-light text-sm">{number}</div>
              <h3 className="text-lg md:text-xl text-gray-900 font-semibold mt-2">{title}</h3>
              <p className="text-gray-600 mt-2 text-sm md:text-base">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Solutions / Features */}
      <section className="space-y-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-light text-gray-900">Why Choose Us</h2>
          <div className="w-14 h-[1px] bg-gray-300 mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutions.map(({ title, desc }, idx) => (
            <div
              key={idx}
              className="relative border border-gray-100 bg-white p-6 rounded-xl hover:shadow-md transition-shadow duration-300 overflow-hidden group"
            >
              <div className="absolute top-3 right-4 text-[3.5rem] font-extralight text-gray-100 select-none">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div className="relative z-10 space-y-2">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 group-hover:translate-x-1 transition-transform duration-300">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base">{desc}</p>
              </div>
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gray-300 group-hover:w-full transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <NewaLetterBox />

      {/* CTA Section */}
      <section className="border-t border-gray-100 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <h3 className="text-2xl md:text-3xl font-light text-gray-900">Ready to find your perfect pair?</h3>
          <p className="text-gray-600 text-sm md:text-base">
            Explore our collections and treat yourself or your loved ones.
          </p>
        </div>
        <Link to="/collection">
          <button className="bg-gray-900 text-white px-8 py-3 md:px-10 md:py-4 rounded-full hover:bg-black transition-all duration-300">
            Shop Now
          </button>
        </Link>
      </section>

      {/* Developer Credit */}
      <div className="text-center text-sm text-gray-500 py-10">
        <p>
          Website developed by{' '}
          <b>
            <a
              href="https://nexxupp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2600ff] hover:underline"
            >
              Nexxupp.com
            </a>
          </b>
        </p>
        <p>Contact: contact@nexxupp.com</p>
      </div>
    </div>
  );
};

export default About;
