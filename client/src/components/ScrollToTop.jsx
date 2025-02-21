import React, { useState, useEffect } from 'react';
import { BiArrowBack } from 'react-icons/bi';

const ScrollToTop = () => {
    const [showButton, setShowButton] = useState(false)
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowButton(true)
            } else {
                setShowButton(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll) // dọn dẹp tránh memory leak
        }
    }, [])
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', //cuộn mượt
        })
    }

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-5 right-5 mb-[50px] rounded-full bg-black p-3 
      text-xs font-medium uppercase leading-tight text-white shadow-md transition
       duration-150 ease-in-out w-14 h-14 flex items-center
        justify-center  ${showButton ? 'block' : 'hidden'}`}
        >
            <BiArrowBack className='rotate-90 text-xl' />
        </button>
    )
}

export default ScrollToTop