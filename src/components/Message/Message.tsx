import React from 'react'

type Props = {
    msg: any
}

const Message = (props: Props) => {
    return (
        <div className=''>
            <div className={`w-full p-2 px-3 my-2 rounded-md ${props.msg.suspicion ? "bg-red-500 bg-opacity-10" : "bg-bg-grey"}`}>
                <p className='text-gray-400'><span className='text-white'>{props.msg.username} - </span>{props.msg.body}</p>
            </div>
        </div>
    )
}

export default Message