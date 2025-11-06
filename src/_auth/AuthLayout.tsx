import { Outlet, Navigate } from 'react-router-dom'

import React from 'react'
import { useUserContext } from '@/context/AuthContext';

const AuthLayout = () => {
    const {isAuthenticated} = useUserContext();
    return (
        <>{
            isAuthenticated ? (<Navigate to='/' />) :
                (
                    <>
                        <section className='flex justify-center items-center flex-col py-10 w-full lg:w-1/2 mx-auto'>
                            <Outlet />
                        </section>
                        <img src="/assets/images/side-img.svg"
                            alt="logo"
                            className='hidden lg:block h-screen w-1/2 object-cover bg-no-repeat' />
                    </>
                )
        }
        </>
    )
}

export default AuthLayout