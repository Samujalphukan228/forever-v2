import React, { useContext, useEffect, useState, useRef } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LatestCollection = () => {
    const { products } = useContext(ShopContext)
    const [latestProducts, setLatestProducts] = useState([])
    const sectionRef = useRef(null)
    const titleRef = useRef(null)
    const descRef = useRef(null)
    const gridRef = useRef(null)
    const itemsRef = useRef([])

    useEffect(() => {
        setLatestProducts(products.slice(0, 10))
    }, [products])

    useEffect(() => {
        if (latestProducts.length === 0) return

        const ctx = gsap.context(() => {
            // Set initial states
            gsap.set([titleRef.current, descRef.current], {
                opacity: 0,
                y: 30,
            })

            gsap.set(itemsRef.current, {
                opacity: 0,
                y: 40,
            })

            // Create timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    end: "top 50%",
                    toggleActions: "play none none none",
                },
                defaults: {
                    ease: "power3.out",
                }
            })

            // Animate in sequence
            tl.to(titleRef.current, {
                opacity: 1,
                y: 0,
                duration: 1,
            })
            .to(descRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
            }, "-=0.6")
            .to(itemsRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.08,
            }, "-=0.4")

        }, sectionRef)

        return () => ctx.revert()
    }, [latestProducts])

    return (
        <section 
            ref={sectionRef}
            className='py-16 lg:py-24 px-6 lg:px-16 xl:px-24 max-w-[1800px] mx-auto'
        >
            {/* Header */}
            <div className='text-center mb-12 lg:mb-16'>
                <div ref={titleRef}>
                    <Title text1={'LATEST'} text2={'COLLECTION'} />
                </div>
                <p 
                    ref={descRef}
                    className='max-w-2xl mx-auto mt-4 text-sm lg:text-base text-gray-500 font-light tracking-wide'
                >
                    Discover our newest pieces crafted with elegance and designed to elevate every look.
                </p>
            </div>

            {/* Products Grid */}
            <div 
                ref={gridRef}
                className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8'
            >
                {latestProducts.map((item, index) => (
                    <div 
                        key={item._id} 
                        ref={(el) => (itemsRef.current[index] = el)}
                    >
                        <ProductItem 
                            id={item._id} 
                            image={item.image} 
                            name={item.name} 
                            price={item.price} 
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default LatestCollection