import { Link } from 'react-router-dom';

export const Navbar = () => {
    return (
        <nav className='bg-[#1D3557]'>
            <div className="max-w-screen-xl px-4 py-3 mx-auto">
                <div className="flex items-center">
                    <div className="flex flex-row font-[600] mt-0 space-x-8 rtl:space-x-reverse text-lg">
                        <p className='text-[#F1FAEE] pr-10'>Atlas Radiográfico</p>
                        <Link className='text-[#F1FAEE] hover:underline' to='/'>Home</Link>
                        <Link className='text-[#F1FAEE] hover:underline' to='/edit'>Editor</Link>
                        <Link className='text-[#F1FAEE] hover:underline'>Canino</Link>
                        <Link className='text-[#F1FAEE] hover:underline'>Felino</Link>
                        <Link className='text-[#F1FAEE] hover:underline'>Silvestre</Link>
                        <Link className='text-[#F1FAEE] hover:underline' to='/about'>About</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}