import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const BrandStory = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [counts, setCounts] = useState([0, 0, 0, 0]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        const element = document.getElementById('brand-story');
        if (element) observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, []);

    // Animated counter effect
    useEffect(() => {
        if (!isVisible) return;

        const targets = [15, 10, 500, 99];
        const duration = 2000;
        const steps = 60;
        
        const intervals = targets.map((target, index) => {
            const increment = target / steps;
            let current = 0;

            return setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(intervals[index]);
                }
                
                setCounts(prev => {
                    const newCounts = [...prev];
                    newCounts[index] = Math.floor(current);
                    return newCounts;
                });
            }, duration / steps);
        });

        return () => intervals.forEach(clearInterval);
    }, [isVisible]);

    const stats = [
        { number: counts[0], suffix: "+", label: "Years" },
        { number: counts[1], suffix: "K+", label: "Clients" },
        { number: counts[2], suffix: "+", label: "Designs" },
        { number: counts[3], suffix: "%", label: "Satisfied" }
    ];

    return (
        <section
            id="brand-story"
            className="py-16 sm:py-20 lg:py-28"
        >
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
                <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
                    
                    {/* Content Side - Mobile First */}
                    <div
                        className={`transition-all duration-1000 ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                    >
                        {/* Mobile-optimized header */}
                        <div className="mb-6 sm:mb-8">
                            <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">
                                Heritage
                            </span>
                            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extralight text-black leading-tight">
                                Crafting Excellence
                                <span className="block text-xl sm:text-2xl lg:text-3xl font-light text-gray-600 mt-1">
                                    Since 2009
                                </span>
                            </h2>
                        </div>

                        {/* Simplified description */}
                        <div className="prose prose-sm sm:prose-base text-gray-600 font-light">
                            <p className="leading-relaxed">
                                forEver represents the pinnacle of jewelry craftsmanship, where traditional 
                                techniques meet contemporary design to create timeless pieces.
                            </p>
                            <p className="mt-4 text-sm text-gray-500 hidden sm:block">
                                Each creation is meticulously crafted by master artisans, transforming precious 
                                materials into wearable art that tells your unique story.
                            </p>
                        </div>

                        {/* Minimal stats - horizontal on mobile */}
                        <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-8 sm:mt-10">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className={`text-center sm:text-left transition-all duration-700 ${
                                        isVisible ? 'opacity-100' : 'opacity-0'
                                    }`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <div className="text-xl sm:text-2xl lg:text-3xl font-extralight text-black">
                                        {stat.number}
                                        <span className="text-sm sm:text-base text-gray-500">{stat.suffix}</span>
                                    </div>
                                    <div className="text-[9px] sm:text-[10px] tracking-wider text-gray-400 uppercase mt-1">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Simplified CTA */}
                        <div className="mt-8 sm:mt-12">
                            <Link
                                to="/about"
                                className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.15em] text-black group"
                            >
                                <span className="relative">
                                    Discover More
                                    <span className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
                                </span>
                                <svg
                                    className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Image Side - Hidden on small mobile, simplified on larger screens */}
                    <div
                        className={`relative hidden sm:block transition-all duration-1000 delay-300 ${
                            isVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] overflow-hidden bg-gray-100">
                            <img
                                src="https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80"
                                alt="Craftsmanship"
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            
                            {/* Single elegant badge - desktop only */}
                            <div className="hidden lg:block absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm px-6 py-4">
                                <div className="text-lg font-extralight text-black">100%</div>
                                <div className="text-[9px] tracking-[0.2em] text-gray-600 uppercase">
                                    Handcrafted
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BrandStory;