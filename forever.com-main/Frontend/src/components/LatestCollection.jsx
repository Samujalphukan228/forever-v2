import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const LatestCollection = () => {
    const { products } = useContext(ShopContext)
    const [latestProducts, setLatestProducts] = useState([])
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setLatestProducts(products.slice(0, 10))
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

        const element = document.getElementById('latest-collection')
        if (element) observer.observe(element)

        return () => {
            if (element) observer.unobserve(element)
        }
    }, [])

    return (
        <section 
            id="latest-collection"
            className='py-16 lg:py-24 px-4 sm:px-6 lg:px-12'
        >
            <div className='max-w-[1600px] mx-auto'>
                {/* Header */}
                <div className={`text-center mb-12 lg:mb-16 transition-all duration-1000 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                    <Title text1={'LATEST'} text2={'COLLECTION'} />
                    <p className='max-w-2xl mx-auto mt-4 text-sm lg:text-base text-gray-500 font-light tracking-wide'>
                        Discover our newest pieces crafted with elegance and designed to elevate every look.
                    </p>
                </div>

                {/* Products Grid */}
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8'>
                    {latestProducts.map((item, index) => (
                        <div 
                            key={item._id}
                            className={`transition-all duration-700 ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                            }`}
                            style={{
                                transitionDelay: isVisible ? `${Math.min(index * 50, 400)}ms` : '0ms'
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

export default LatestCollection