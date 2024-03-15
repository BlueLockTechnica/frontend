import React from 'react'
import { Link } from 'react-router-dom'

type Props = {
    selected: "Dashboard" | "Contacts" | "Recordings" | "Calls"
}

const navLinks = [
    {
        name: "Dashboard",
        path: '/'
    },
    {
        name: "Contacts",
        path: '/contacts'
    },
    {
        name: 'Recordings',
        path: '/recordings'
    },
    {
        name: 'Calls',
        path: '/calls'
    }
]

const SideNav = ({ selected }: Props) => {
    return (
        <div className='bg-bg-grey h-full p-5 rounded-md flex-[0.15] mr-5 mb-5 flex flex-col'>
            <div>
                <p>Menu</p>
                <nav className='my-2'>
                    <ul className=''>
                        {navLinks.map((link, i) => <li key={"link" + i} className={`rounded-md p-3 my-2 text-lg  ${selected === link.name ? "bg-btn-primary" : ""} hover:bg-btn-primary`}>
                            <Link to={link.path} className={`flex text-white hover:text-white `}>
                                <img src={`${link.name.toLowerCase()}.svg`} className='mr-2' />
                                {link.name}
                            </Link>
                        </li>)

                        }
                    </ul>
                </nav>
            </div>
            <div>
                <button>Logout</button>
            </div>
        </div >
    )
}

export default SideNav