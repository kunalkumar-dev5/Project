import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-14 my-10 mt-40 text-sm'>
                {/*---------Left Section-------- */}

                <div>
                    <img className='mb-5 w-40' src={assets.logo} alt="" />
                    <p className='w-full md:w-2/3 text-gray-600'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum, vitae.
                    </p>
                </div>

                {/*---------Center Section-------- */}
                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Contact us</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>


                {/*---------Right Section-------- */}
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>+91 8757843220</li>
                        <li>support@medcare.com</li>
                    </ul>
                </div>

            </div>
            {/*--------- Copyright Section-------- */}
            <div>
                <p className='py-5 text-sm text-center'>Copyright 2026@ MedCare. All rights Reserved.</p>
            </div>
        </div>
    )
}

export default Footer
