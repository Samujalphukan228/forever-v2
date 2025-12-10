import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 }
        )

        const element = document.getElementById('footer')
        if (element) observer.observe(element)

        return () => {
            if (element) observer.unobserve(element)
        }
    }, [])

    const companyLinks = [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About Us' },
        { to: '/collection', label: 'Collection' },
        { to: '/contact', label: 'Contact' },
    ]

    const supportLinks = [
        { href: '#', label: 'Privacy Policy' },
        { href: '#', label: 'Terms & Conditions' },
        { href: '#', label: 'Shipping Info' },
        { href: '#', label: 'Returns' },
    ]

    const socialLinks = [
        { 
            href: '#', 
            label: 'Instagram',
            icon: (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
            )
        },
        { 
            href: '#', 
            label: 'Facebook',
            icon: (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
            )
        },
        { 
            href: '#', 
            label: 'Pinterest',
            icon: (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                </svg>
            )
        },
    ]

    return (
        <footer id="footer" >
            <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16'>
                
                {/* Main Grid */}
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 transition-all duration-1000 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                    
                    {/* Brand */}
                    <div className='col-span-2 md:col-span-1'>
                        <Link to="/" className='text-xl font-extralight tracking-wide text-black'>
                            forEver
                        </Link>
                        <p className='mt-4 text-sm text-gray-500 font-light leading-relaxed'>
                            Timeless jewelry crafted with elegance and passion.
                        </p>
                        
                        {/* Social Links */}
                        <div className='flex gap-4 mt-6'>
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className='text-gray-400 hover:text-black transition-colors'
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className='text-[10px] uppercase tracking-[0.2em] font-medium text-black mb-4'>
                            Company
                        </h4>
                        <ul className='space-y-3'>
                            {companyLinks.map((link) => (
                                <li key={link.label}>
                                    <Link 
                                        to={link.to} 
                                        className='text-sm text-gray-500 hover:text-black transition-colors font-light'
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className='text-[10px] uppercase tracking-[0.2em] font-medium text-black mb-4'>
                            Support
                        </h4>
                        <ul className='space-y-3'>
                            {supportLinks.map((link) => (
                                <li key={link.label}>
                                    <a 
                                        href={link.href} 
                                        className='text-sm text-gray-500 hover:text-black transition-colors font-light'
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className='text-[10px] uppercase tracking-[0.2em] font-medium text-black mb-4'>
                            Contact
                        </h4>
                        <ul className='space-y-3'>
                            <li>
                                <a 
                                    href='tel:+15551234567' 
                                    className='text-sm text-gray-500 hover:text-black transition-colors font-light'
                                >
                                    +1 (555) 123-4567
                                </a>
                            </li>
                            <li>
                                <a 
                                    href='mailto:hello@forever.com' 
                                    className='text-sm text-gray-500 hover:text-black transition-colors font-light'
                                >
                                    hello@forever.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={`mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 transition-all duration-1000 delay-200 ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                }`}>
                    <p className='text-xs text-gray-400'>
                        © {new Date().getFullYear()} forEver. All rights reserved.
                    </p>
                    
                    {/* Payment Methods */}
                    <div className='flex items-center gap-3'>
                        <span className='text-[10px] text-gray-400 uppercase tracking-wider'>
                            We Accept
                        </span>
                        <div className='flex gap-2'>
                            {['Visa', 'MC', 'Amex', 'PayPal'].map((method) => (
                                <div 
                                    key={method}
                                    className='px-2 py-1 bg-white border border-gray-200 text-[9px] text-gray-500'
                                >
                                    {method}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer