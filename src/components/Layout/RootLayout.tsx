import { ReactNode } from 'react'
import SideNav from '../SideNav/SideNav'
import TopNav from '../TopNav/TopNav'


type Props = {
    children: ReactNode
    page: "Dashboard" | "Contacts" | "Recordings" | "Calls"
}
function Layout({ children, page }: Props) {
    return <div className='flex flex-col h-[95vh]'>
        <TopNav />
        <div className='flex flex-1'>
            <SideNav selected={page} />
            <div className='flex-1'>
                {children}
            </div>
        </div>
    </div>
}

export default Layout
