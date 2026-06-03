import React from 'react'
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext/AuthContext';


const Layout = () => {
    

    return (
        <>


            <div className=' relative w-full    p-4 '>
                <div className='w-full mt-10   '>
                    <Outlet />
                </div>

              
            </div>

        </>
    )
}

export default Layout
