import React, { ReactNode } from 'react'

type Props = {
    header: ReactNode
    content: ReactNode
}

const CardLayout = ({ header, content }: Props) => {
    return (
        <div className='flex flex-col'>
            {header}
            {content}
        </div>
    )
}

export default CardLayout