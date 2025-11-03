import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const NewsletterBox = () => {
    const [email, setEmail] = useState('')
    const sectionRef = useRef(null)
    const contentRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(contentRef.current, {
                opacity: 0,
                y: 30,
            })

            gsap.to(contentRef.current, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%",
                    toggleActions: "play none none none",
                }
            })

        }, sectionRef)

        return () => ctx.revert()
    }, [])

    const onSubmitHandler = (e) => {
        e.preventDefault()
        // Handle newsletter subscription
        console.log('Newsletter:', email)
        setEmail('')
    }

    return (
        <section 
            ref={sectionRef}
            className='py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-16 xl:px-24 max-w-[1800px] mx-auto'
        >
            <div 
                ref={contentRef}
                className='text-center max-w-2xl mx-auto'
            >
                <h2 className='text-xl sm:text-2xl lg:text-3xl font-light text-black mb-2 sm:mb-3 tracking-tight px-2'>
                    Subscribe & Get 20% Off
                </h2>
                <p className='text-xs sm:text-sm text-gray-500 font-light mb-6 sm:mb-8 tracking-wide px-4'>
                    Join our newsletter for exclusive updates and special offers
                </p>

                <form 
                    onSubmit={onSubmitHandler} 
                    className='flex flex-col sm:flex-row gap-3 max-w-md mx-auto px-4 sm:px-0'
                >
                    <input 
                        type='email' 
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='flex-1 px-4 sm:px-5 py-3 border border-gray-300 outline-none text-sm focus:border-black transition-colors w-full'
                        required
                    />
                    <button 
                        type='submit'
                        className='w-full sm:w-auto px-6 sm:px-8 py-3 bg-black text-white text-xs uppercase tracking-[0.15em] font-medium hover:bg-gray-800 transition-colors whitespace-nowrap'
                    >
                        Subscribe
                    </button>
                </form>
            </div>
        </section>
    )
}

export default NewsletterBox