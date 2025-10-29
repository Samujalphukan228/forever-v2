import React, { useContext, useEffect, useState, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

// Constants
const MAX_BESTSELLERS = 5
const GRID_COLS = {
    default: 'grid-cols-2',
    sm: 'sm:grid-cols-3',
    md: 'md:grid-cols-4',
    lg: 'lg:grid-cols-5'
}

const BestSeller = () => {
    const { products, loading, error } = useContext(ShopContext)
    const [bestSeller, setBestSeller] = useState([])

    // Memoize filtered products to avoid unnecessary recalculations
    const filteredBestSellers = useMemo(() => {
        if (!products || !Array.isArray(products)) return []
        return products
            .filter(item => item?.bestseller)
            .slice(0, MAX_BESTSELLERS)
    }, [products])

    useEffect(() => {
        setBestSeller(filteredBestSellers)
    }, [filteredBestSellers])

    // Loading state
    if (loading) {
        return (
            <div className='my-10'>
                <div className='text-center text-3xl py-8'>
                    <Title text1={'BEST'} text2={'SELLERS'} />
                </div>
                <div className={`grid ${Object.values(GRID_COLS).join(' ')} gap-4 gap-y-6`}>
                    {[...Array(MAX_BESTSELLERS)].map((_, index) => (
                        <ProductSkeleton key={index} />
                    ))}
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className='my-10 text-center'>
                <Title text1={'BEST'} text2={'SELLERS'} />
                <p className='text-red-500 mt-4'>Unable to load best sellers. Please try again later.</p>
            </div>
        )
    }

    // Empty state
    if (!bestSeller.length) {
        return (
            <div className='my-10 text-center'>
                <Title text1={'BEST'} text2={'SELLERS'} />
                <p className='text-gray-500 mt-4'>No best sellers available at the moment.</p>
            </div>
        )
    }

    return (
        <section className='my-10' aria-labelledby='bestsellers-title'>
            <header className='text-center text-3xl py-8'>
                <h2 id='bestsellers-title'>
                    <Title text1={'BEST'} text2={'SELLERS'} />
                </h2>
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 mt-2'>
                    Explore our most loved earrings, handpicked by customers for their style, elegance, and timeless appeal.
                </p>
            </header>

            <div
                className={`grid ${Object.values(GRID_COLS).join(' ')} gap-4 gap-y-6`}
                role='list'
                aria-label='Best selling products'
            >
                {bestSeller.map((item) => (
                    <div key={item._id} role='listitem'>
                        <ProductItem
                            id={item._id}
                            name={item.name}
                            image={item.image}
                            price={item.price}
                            loading='lazy'
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}

// Skeleton loader component for better UX
const ProductSkeleton = () => (
    <div className='animate-pulse'>
        <div className='bg-gray-200 aspect-square rounded-lg mb-2'></div>
        <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
        <div className='h-4 bg-gray-200 rounded w-1/2'></div>
    </div>
)

export default BestSeller