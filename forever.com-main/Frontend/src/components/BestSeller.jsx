import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const BestSeller = () => {
    const { products } = useContext(ShopContext)
    const [bestSeller, setBestSeller] = useState([])
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const bestProduct = products.filter((item) => item.bestseller)
        setBestSeller(bestProduct.slice(0, 5))
    }, [products])

    // Intersection Observer for entrance animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 }
        )

        const element = document.getElementById('best-seller')
        if (element) observer.observe(element)

        return () => {
            if (element) observer.unobserve(element)
        }
    }, [])

    return (
        <section 
            id="best-seller"
            className='py-16 lg:py-24 px-4 sm:px-6 lg:px-12'
        >
            <div className='max-w-[1600px] mx-auto'>
                {/* Header */}
                <div className={`text-center mb-12 lg:mb-16 transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}>
                    <Title text1={'BEST'} text2={'SELLERS'} />
                    <p className='max-w-2xl mx-auto mt-4 text-sm lg:text-base text-gray-500 font-light tracking-wide'>
                        Our most loved pieces, handpicked by customers worldwide.
                    </p>
                </div>

                {/* Products Grid */}
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8'>
                    {bestSeller.map((item, index) => (
                        <div 
                            key={item._id}
                            className={`transition-all duration-700 ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            }`}
                            style={{
                                transitionDelay: isVisible ? `${index * 75}ms` : '0ms'
                            }}
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
            </div>
        </section>
    )
}

export default BestSeller