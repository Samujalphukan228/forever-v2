"use client";
import { useEffect, useRef } from "react";
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

  useEffect(() => {
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const ctx = gsap.context(() => {
      if (prefersReduced) return;

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      gsap.set(headingRef.current?.children || [], {
        opacity: 0,
        yPercent: 100,
        rotateX: -90,
      });
      gsap.set(subheadingRef.current, { opacity: 0, y: 20 });
      gsap.set(ctaRef.current, { opacity: 0, y: 20 });
      gsap.set(imageRef.current, { scale: 1.15 });
      gsap.set(curtainRef.current, { yPercent: 0 });

      tl.to(headingRef.current?.children || [], {
        opacity: 1,
        yPercent: 0,
        rotateX: 0,
        duration: 1.1,
        stagger: 0.08,
      })
        .to(
          subheadingRef.current,
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.7"
        )
        .to(
          ctaRef.current,
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.5"
        )
        .to(
          curtainRef.current,
          { yPercent: -100, duration: 1.1, ease: "power3.inOut" },
          "-=1.1"
        )
        .to(
          imageRef.current,
          { scale: 1, duration: 1.4, ease: "power2.out" },
          "-=1.1"
        );

      // Subtle parallax
      gsap.to(imageRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        yPercent: 20,
        ease: "none",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="  pt-13 sm:pt-19 md:pt-19 lg:pt-21">
      {/* Hero viewport (image on top) */}
      <div className="relative h-[calc(100vh-6rem)] lg:h-[calc(100vh-7rem)] overflow-hidden">
        {/* Image */}
        <div className="absolute inset-0">
          <img
            ref={imageRef}
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1800&q=90"
            alt="Luxury Jewelry"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Readability gradient (very subtle) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />

        {/* Curtain reveal */}
        <div ref={curtainRef} className="absolute inset-0 bg-white z-10" />

        {/* Text at the end (bottom-right) */}
        <div className="absolute bottom-8 sm:bottom-12 right-6 sm:right-10 text-right">
          <div ref={headingRef} className="overflow-hidden">
            <h1 className="block text-[2.75rem] sm:text-[3.75rem] lg:text-[5rem] font-extralight leading-[0.92] tracking-[-0.02em] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
              Pure
            </h1>
            <h1 className="block text-[2.75rem] sm:text-[3.75rem] lg:text-[5rem] font-extralight leading-[0.92] tracking-[-0.02em] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
              Elegance
            </h1>
          </div>

          <p
            ref={subheadingRef}
            className="mt-3 text-[10px] sm:text-xs text-white/90 uppercase tracking-[0.25em] font-medium"
          >
            Luxury Jewelry Collection
          </p>

          <div ref={ctaRef} className="mt-5">
            <a
              href="/collection"
              className="group inline-flex items-center gap-3 text-xs sm:text-sm uppercase tracking-[0.15em] font-medium text-white border-b border-white/90 pb-1 hover:pb-2 transition-all duration-300"
            >
              <span>Discover More</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
