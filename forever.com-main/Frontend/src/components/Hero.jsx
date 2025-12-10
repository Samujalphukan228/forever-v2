"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);
  const ctaRef = useRef(null);
  const imageRef = useRef(null);
  const curtainRef = useRef(null);
  const overlayRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set([curtainRef.current], { scaleY: 0 });
        gsap.set(
          [headingRef.current, subheadingRef.current, ctaRef.current],
          { opacity: 1, y: 0 }
        );
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.1,
      });

      // Initial states
      gsap.set(curtainRef.current, { scaleY: 1 });
      gsap.set(headingRef.current, { opacity: 0, y: 60 });
      gsap.set(subheadingRef.current, { opacity: 0, y: 30 });
      gsap.set(ctaRef.current, { opacity: 0, y: 20 });
      gsap.set(imageRef.current, { scale: 1.1 });
      gsap.set(overlayRef.current, { opacity: 0 });

      // Animation sequence
      tl
        .to(curtainRef.current, {
          scaleY: 0,
          duration: 1,
          ease: "power2.inOut",
        })
        .to(
          imageRef.current,
          {
            scale: 1,
            duration: 1.5,
            ease: "power2.out",
          },
          "-=0.8"
        )
        .to(
          overlayRef.current,
          {
            opacity: 1,
            duration: 0.8,
          },
          "-=1.2"
        )
        .to(
          headingRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.6"
        )
        .to(
          subheadingRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.4"
        )
        .to(
          ctaRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          "-=0.3"
        );

      // Scroll parallax
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          if (imageRef.current) {
            imageRef.current.style.transform = `scale(${1 + progress * 0.1}) translateY(${progress * 15}%)`;
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative bg-black">
      <div className="relative h-screen min-h-[600px] max-h-[1200px] overflow-hidden">
        {/* Image */}
        <div className="absolute inset-0">
          <img
            ref={imageRef}
            src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1600&q=80"
            alt="Luxury Jewelry Collection"
            className="w-full h-full object-cover will-change-transform"
            loading="eager"
            onLoad={() => setIsLoaded(true)}
          />
        </div>

        {/* Gradient overlay */}
        <div
          ref={overlayRef}
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30"
        />

        {/* Curtain */}
        <div
          ref={curtainRef}
          className="absolute inset-0 bg-black z-20 origin-top"
        />

        {/* Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full px-6 sm:px-10 lg:px-16 pb-16 sm:pb-20 lg:pb-24">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-16">
                {/* Left side - minimal tag */}
                <div className="hidden lg:block">
                  <div className="flex items-center gap-3 text-white/50">
                    <span className="w-8 h-px bg-current" />
                    <span className="text-[10px] tracking-[0.3em] uppercase">
                      Est. 2024
                    </span>
                  </div>
                </div>

                {/* Right side - main content */}
                <div className="lg:text-right">
                  <div ref={headingRef}>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extralight leading-[0.9] tracking-[-0.02em] text-white">
                      <span className="block">Pure</span>
                      <span className="block font-light italic mt-1">
                        Elegance
                      </span>
                    </h1>
                  </div>

                  <p
                    ref={subheadingRef}
                    className="mt-6 text-[10px] sm:text-xs text-white/60 uppercase tracking-[0.3em]"
                  >
                    Handcrafted Luxury Jewelry
                  </p>

                  <div ref={ctaRef} className="mt-8">
                    <a
                      href="/collection"
                      className="group inline-flex items-center gap-4 text-sm uppercase tracking-[0.15em] text-white"
                    >
                      <span className="relative">
                        Discover Collection
                        <span className="absolute left-0 bottom-0 w-full h-px bg-white/40 group-hover:bg-white transition-colors duration-300" />
                      </span>

                      <span className="flex items-center justify-center w-10 h-10 rounded-full border border-white/30 group-hover:border-white/60 group-hover:bg-white/10 transition-all duration-300">
                        <svg
                          className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;