import Link from 'next/link';
import React from 'react'

const Header = () => {
  return (
    <header className='sticky h-16 w-full p-5 bg-amber-300 flex justify-between items-center'>
        {/* <h1>AB-Bot Site</h1> */}

        {/* <div className='h-8 aspect-square bg-black'>

        </div> */}

        <Link href={"/bot"}>
            AB Bot
        </Link>

        <button 
            className='h-8 w-fit px-5 py-1 rounded-md bg-black text-white hover:cursor-pointer'
            title='Logout'
        >
            Logout
        </button>
    </header>
  )
}

export default Header;