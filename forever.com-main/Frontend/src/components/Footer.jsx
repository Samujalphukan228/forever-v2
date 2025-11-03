import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Footer = () => {
    const footerRef = useRef(null)
    const contentRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(contentRef.current?.children || [], {
                opacity: 0,
                y: 20,
            })

            gsap.to(contentRef.current?.children || [], {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 90%",
                    toggleActions: "play none none none",
                }
            })

        }, footerRef)

        return () => ctx.revert()
    }, [])

    return (
        <footer ref={footerRef} className='border-t border-gray-200'>
            <div className='max-w-[1800px] mx-auto px-6 lg:px-16 xl:px-24 py-16 lg:py-20'>
                <div ref={contentRef} className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16'>
                    {/* Brand */}
                    <div>
                        <h3 className='text-2xl font-extralight tracking-wide text-black mb-4'>
                            forEver
                        </h3>
                        <p className='text-xs text-gray-500 font-light leading-relaxed tracking-wide'>
                            Timeless jewelry crafted with elegance and passion. Every piece tells a story.
                        </p>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className='text-xs uppercase tracking-[0.2em] font-medium text-black mb-4'>
                            Company
                        </h4>
                        <ul className='space-y-2'>
                            <li>
                                <Link to='/' className='text-sm text-gray-600 hover:text-black transition-colors font-light'>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to='/about' className='text-sm text-gray-600 hover:text-black transition-colors font-light'>
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to='/collection' className='text-sm text-gray-600 hover:text-black transition-colors font-light'>
                                    Collection
                                </Link>
                            </li>
                            <li>
                                <Link to='/contact' className='text-sm text-gray-600 hover:text-black transition-colors font-light'>
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className='text-xs uppercase tracking-[0.2em] font-medium text-black mb-4'>
                            Support
                        </h4>
                        <ul className='space-y-2'>
                            <li>
                                <a href='#' className='text-sm text-gray-600 hover:text-black transition-colors font-light'>
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href='#' className='text-sm text-gray-600 hover:text-black transition-colors font-light'>
                                    Terms & Conditions
                                </a>
                            </li>
                            <li>
                                <a href='#' className='text-sm text-gray-600 hover:text-black transition-colors font-light'>
                                    Shipping Info
                                </a>
                            </li>
                            <li>
                                <a href='#' className='text-sm text-gray-600 hover:text-black transition-colors font-light'>
                                    Returns
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className='text-xs uppercase tracking-[0.2em] font-medium text-black mb-4'>
                            Get In Touch
                        </h4>
                        <ul className='space-y-2'>
                            <li className='text-sm text-gray-600 font-light'>
                                +1 (555) 123-4567
                            </li>
                            <li className='text-sm text-gray-600 font-light'>
                                hello@forever.com
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className='mt-12 pt-8 border-t [#fafafa]'>
                    <p className='text-center text-xs text-gray-400 tracking-wide'>
                        © {new Date().getFullYear()} forEver. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer