import React from 'react'
import Logo from '../Logo'
// import './TopNav.css'
type Props = {}

const TopNav = (props: Props) => {
    return (
        <div className='bg-bg-grey p-5 w-full rounded-md my-5'>
            <Logo />
        </div>
    )
}

export default TopNav