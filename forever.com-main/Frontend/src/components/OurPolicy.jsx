import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const OurPolicy = () => {
    const sectionRef = useRef(null)
    const itemsRef = useRef([])

    const policies = [
        {
            icon: (
                <svg className="w-8 h-8 policy-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
            ),
            title: 'Easy Exchange',
            description: 'Hassle-free exchange policy',
        },
        {
            icon: (
                <svg className="w-8 h-8 policy-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: '7 Days Return',
            description: 'Worry-free return within 7 days',
        },
        {
            icon: (
                <svg className="w-8 h-8 policy-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            title: 'Best Support',
            description: '24/7 customer support',
        },
    ]

    useEffect(() => {
        const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

        const ctx = gsap.context(() => {
            // Initial states
            gsap.set(itemsRef.current, { opacity: 0, y: 30 })
            gsap.set('.policy-underline', { scaleX: 0, transformOrigin: 'left' })

            // Stroke setup for icons
            const setupStroke = (el) => {
                const paths = el.querySelectorAll('path, line, polyline, polygon, circle, rect')
                paths.forEach((p) => {
                    const length = p.getTotalLength ? p.getTotalLength() : 120
                    p.style.strokeDasharray = length
                    p.style.strokeDashoffset = length
                })
            }
            itemsRef.current.forEach((item) => {
                const icon = item.querySelector('.policy-icon')
                if (icon) setupStroke(icon)
            })

            // Reveal on scroll
            gsap.to(itemsRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power3.out',
                stagger: 0.15,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    once: true,
                },
                onStart: () => {
                    // draw icons + underline sweep
                    itemsRef.current.forEach((item, i) => {
                        const icon = item.querySelector('.policy-icon')
                        const underline = item.querySelector('.policy-underline')
                        if (icon) {
                            const paths = icon.querySelectorAll('path, line, polyline, polygon, circle, rect')
                            gsap.to(paths, {
                                strokeDashoffset: 0,
                                duration: prefersReduced ? 0 : 0.9,
                                ease: 'power2.out',
                                stagger: 0.05,
                                delay: i * 0.12,
                            })
                        }
                        if (underline) {
                            gsap.to(underline, {
                                scaleX: 1,
                                duration: prefersReduced ? 0 : 0.6,
                                ease: 'power3.out',
                                delay: i * 0.15 + 0.1,
                            })
                        }
                    })
                },
            })

            // Hover micro-interactions
            itemsRef.current.forEach((card) => {
                const icon = card.querySelector('.policy-icon')
                const onEnter = () => {
                    gsap.to(card, { y: -4, duration: 0.25, ease: 'power2.out' })
                    if (!prefersReduced && icon) {
                        gsap.to(icon, { y: -2, rotate: -2, duration: 0.25, ease: 'power2.out' })
                    }
                }
                const onLeave = () => {
                    gsap.to(card, { y: 0, duration: 0.25, ease: 'power2.out' })
                    if (!prefersReduced && icon) {
                        gsap.to(icon, { y: 0, rotate: 0, duration: 0.25, ease: 'power2.out' })
                    }
                }
                card.addEventListener('mouseenter', onEnter)
                card.addEventListener('mouseleave', onLeave)
                card.addEventListener('focusin', onEnter)
                card.addEventListener('focusout', onLeave)
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            className="py-16 lg:py-20 px-6 lg:px-16 xl:px-24 max-w-[1800px] mx-auto"
            aria-label="Our policy highlights"
        >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
                {policies.map((policy, index) => (
                    <div
                        key={policy.title}
                        ref={(el) => (itemsRef.current[index] = el)}
                        className="text-center group outline-none focus:ring-2 focus:ring-black/30"
                        tabIndex={0}
                        role="article"
                        aria-label={policy.title}
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 text-black">
                            {policy.icon}
                        </div>

                        <h3 className="text-sm font-medium uppercase tracking-[0.15em] text-black">
                            {policy.title}
                        </h3>
                        <div className="mx-auto mt-2 mb-3 h-[1px] w-10 bg-black policy-underline" />

                        <p className="text-xs text-gray-500 font-light tracking-wide">
                            {policy.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default OurPolicy