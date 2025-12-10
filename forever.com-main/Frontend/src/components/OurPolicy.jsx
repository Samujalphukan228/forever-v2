import React, { useState, useEffect } from 'react'

const OurPolicy = () => {
    const [isVisible, setIsVisible] = useState(false)

    const policies = [
        {
            image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&q=80",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
            ),
            title: 'Easy Exchange',
            description: 'Hassle-free exchange policy',
        },
        {
            image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&q=80",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: '7 Days Return',
            description: 'Worry-free return policy',
        },
        {
            image: "https://images.unsplash.com/photo-1560264280-88b68371db39?w=400&q=80",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            title: 'Best Support',
            description: '24/7 customer support',
        },
    ]

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 }
        )

        const element = document.getElementById('our-policy')
        if (element) observer.observe(element)

        return () => {
            if (element) observer.unobserve(element)
        }
    }, [])

    return (
        <section
            id="our-policy"
            className="py-16 lg:py-24 px-4 sm:px-6 lg:px-12 "
        >
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className={`text-center mb-12 lg:mb-16 transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}>
                    <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">
                        Our Commitment
                    </span>
                    <h2 className="mt-3 text-2xl sm:text-3xl font-extralight text-black">
                        Why Choose forEver
                    </h2>
                </div>

                {/* Policies Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
                    {policies.map((policy, index) => (
                        <div
                            key={policy.title}
                            className={`group bg-white transition-all duration-700 ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                            style={{
                                transitionDelay: isVisible ? `${index * 100}ms` : '0ms'
                            }}
                        >
                            {/* Image */}
                            <div className="relative overflow-hidden aspect-[16/10] bg-gray-100">
                                <img
                                    src={policy.image}
                                    alt={policy.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                                
                                {/* Icon overlay */}
                                <div className="absolute bottom-4 left-4 w-10 h-10 bg-white flex items-center justify-center">
                                    {policy.icon}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-black">
                                    {policy.title}
                                </h3>
                                
                                <p className="mt-2 text-sm text-gray-500 font-light">
                                    {policy.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default OurPolicy