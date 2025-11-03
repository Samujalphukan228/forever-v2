import React from 'react'

const Title = ({ text1, text2 }) => {
    return (
        <div className='inline-flex items-center gap-3 mb-3'>
            <p className='text-gray-500 font-light tracking-[0.2em] text-sm uppercase'>
                {text1}
                <span className='text-black font-medium ml-2'>{text2}</span>
            </p>
            <div className='w-12 h-[1px] bg-black'></div>
        </div>
    )
}

export default Title