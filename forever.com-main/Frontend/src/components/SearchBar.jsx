import React, { useContext, useEffect, useRef } from 'react'
import { ShopContext } from '../context/ShopContext'
import { gsap } from 'gsap'

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext)
    const overlayRef = useRef(null)
    const contentRef = useRef(null)

    useEffect(() => {
        if (showSearch) {
            gsap.set(overlayRef.current, { opacity: 0 })
            gsap.set(contentRef.current, { opacity: 0, y: -20 })

            const tl = gsap.timeline()
            tl.to(overlayRef.current, {
                opacity: 1,
                duration: 0.3,
            })
            .to(contentRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power3.out",
            }, "-=0.1")
        } else {
            gsap.to(contentRef.current, {
                opacity: 0,
                y: -20,
                duration: 0.3,
            })
            gsap.to(overlayRef.current, {
                opacity: 0,
                duration: 0.3,
                delay: 0.1,
            })
        }
    }, [showSearch])

    if (!showSearch) return null

    return (
        <div className='fixed inset-0 z-50'>
            {/* Overlay */}
            <div 
                ref={overlayRef}
                onClick={() => setShowSearch(false)}
                className='absolute inset-0 bg-black/30 backdrop-blur-sm'
            />
            
            {/* Content */}
            <div 
                ref={contentRef}
                className='relative z-10 bg-white border-b border-gray-200 py-6 px-6 lg:px-16 xl:px-24'
            >
                <div className='max-w-[1800px] mx-auto flex items-center gap-4'>
                    <input 
                        type='text'
                        placeholder='Search for products...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='flex-1 px-5 py-3 border border-gray-300 outline-none text-sm focus:border-black transition-colors'
                        autoFocus
                    />
                    <button 
                        onClick={() => setShowSearch(false)}
                        className='p-3 hover:bg-gray-100 rounded-full transition-colors'
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SearchBar