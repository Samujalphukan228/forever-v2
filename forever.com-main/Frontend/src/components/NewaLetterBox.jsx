import React, { useState, useEffect } from 'react'

const NewsletterBox = () => {
    const [email, setEmail] = useState('')
    const [isVisible, setIsVisible] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 }
        )

        const element = document.getElementById('newsletter')
        if (element) observer.observe(element)

        return () => {
            if (element) observer.unobserve(element)
        }
    }, [])

    const onSubmitHandler = (e) => {
        e.preventDefault()
        console.log('Newsletter:', email)
        setEmail('')
        setIsSubmitted(true)
        setTimeout(() => setIsSubmitted(false), 5000)
    }

    return (
        <section 
            id="newsletter"
            className='relative py-20 lg:py-28 px-4 sm:px-6 lg:px-12 overflow-hidden'
        >
            {/* Background Image */}
            <div className='absolute inset-0'>
                <img
                    src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1600&q=80"
                    alt=""
                    className='w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-black/60' />
            </div>

            {/* Content */}
            <div 
                className={`relative text-center max-w-xl mx-auto transition-all duration-1000 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
                <span className="text-[10px] tracking-[0.3em] text-white/60 uppercase">
                    Exclusive Access
                </span>
                
                <h2 className='mt-3 text-2xl sm:text-3xl font-extralight text-white'>
                    Join the forEver Family
                </h2>
                
                <p className='mt-4 text-sm text-white/70 font-light'>
                    Subscribe and receive 20% off your first order
                </p>

                {!isSubmitted ? (
                    <form 
                        onSubmit={onSubmitHandler} 
                        className='mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto'
                    >
                        <input 
                            type='email' 
                            placeholder='Enter your email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='flex-1 px-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 outline-none text-sm text-white placeholder:text-white/50 focus:border-white/50 transition-colors'
                            required
                        />
                        <button 
                            type='submit'
                            className='px-8 py-3.5 bg-white text-black text-xs uppercase tracking-[0.15em] font-medium hover:bg-white/90 transition-colors'
                        >
                            Subscribe
                        </button>
                    </form>
                ) : (
                    <div className='mt-8 py-4 text-sm text-white'>
                        ✓ Thank you! Check your email for your discount code.
                    </div>
                )}

                <p className='mt-6 text-[10px] text-white/40'>
                    We respect your privacy. Unsubscribe anytime.
                </p>
            </div>
        </section>
    )
}

export default NewsletterBox