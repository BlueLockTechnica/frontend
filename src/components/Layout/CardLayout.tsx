import React, { ReactNode } from 'react'

type Props = {
    title: string
    children?: ReactNode
    value?: string,
    rows?: number
}

const CardLayout = ({ title, children, value, rows }: Props) => {
    return (
        <div className={`flex flex-col w-full min-h-[50px] p-5 bg-bg-grey row-span-${rows ?? 1} rounded-md`}>
            {!children ? <><p className='mb-2 text-lg'>{title}</p>
                <p className='mb-2 text-3xl font-bold'>{value}</p>
                <p>From last one week</p></> : children}
        </div >
    )
}

export default CardLayout