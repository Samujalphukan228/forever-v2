import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({ id, image, name, price }) => {
    const { currency } = useContext(ShopContext)

    return (
        <Link 
            to={`/product/${id}`} 
            className='group block'
        >
            {/* Image */}
            <div className='overflow-hidden bg-gray-100 mb-3'>
                <img 
                    src={image[0]} 
                    alt={name}
                    className='w-full aspect-[3/4] object-cover transition-transform duration-500 ease-out group-hover:scale-105'
                    loading="lazy"
                />
            </div>
            
            {/* Name */}
            <h3 className='text-sm text-gray-800 font-light tracking-wide truncate'>
                {name}
            </h3>
            
            {/* Price */}
            <p className='mt-1 text-sm text-gray-900'>
                {currency}{price}
            </p>
        </Link>
    )
}

export default ProductItem