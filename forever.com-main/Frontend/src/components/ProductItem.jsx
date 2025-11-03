import React, { useContext, useRef, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'

const ProductItem = ({ id, image, name, price }) => {
    const { currency } = useContext(ShopContext)
    const itemRef = useRef(null)
    const imageRef = useRef(null)
    const nameRef = useRef(null)
    const priceRef = useRef(null)
    const overlayRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Set initial overlay
            gsap.set(overlayRef.current, {
                scaleX: 0,
            })

            // Hover timeline
            const hoverTl = gsap.timeline({ paused: true })
            
            hoverTl
                .to(imageRef.current, {
                    scale: 1.08,
                    duration: 0.6,
                    ease: "power2.out",
                }, 0)
                .to(overlayRef.current, {
                    scaleX: 1,
                    duration: 0.4,
                    ease: "power2.inOut",
                }, 0)
                .to(nameRef.current, {
                    y: -2,
                    duration: 0.3,
                    ease: "power2.out",
                }, 0.1)
                .to(priceRef.current, {
                    color: "#000000",
                    duration: 0.3,
                }, 0.1)

            // Mouse enter/leave
            const item = itemRef.current
            
            const handleMouseEnter = () => hoverTl.play()
            const handleMouseLeave = () => hoverTl.reverse()

            item.addEventListener('mouseenter', handleMouseEnter)
            item.addEventListener('mouseleave', handleMouseLeave)

            return () => {
                item.removeEventListener('mouseenter', handleMouseEnter)
                item.removeEventListener('mouseleave', handleMouseLeave)
            }

        }, itemRef)

        return () => ctx.revert()
    }, [])

    return (
        <Link 
            ref={itemRef}
            to={`/product/${id}`} 
            className='block cursor-pointer'
        >
            <div className='overflow-hidden bg-gray-50 mb-4 relative'>
                <img 
                    ref={imageRef}
                    src={image[0]} 
                    alt={name}
                    className='w-full aspect-square object-cover' 
                />
                {/* Overlay */}
                <div 
                    ref={overlayRef}
                    className='absolute inset-0 bg-black/5 origin-left'
                />
            </div>
            
            <p 
                ref={nameRef}
                className='text-sm text-gray-600 font-light tracking-wide mb-1.5 truncate'
            >
                {name}
            </p>
            
            <p 
                ref={priceRef}
                className='text-sm font-medium text-black tracking-wide'
            >
                {currency}{price}
            </p>
        </Link>
    )
}

export default ProductItem