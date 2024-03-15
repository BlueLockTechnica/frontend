import React from 'react'

type Props = {
    onClose: () => void
}

const SuspicionModal = (props: Props) => {
    return (
        <div className='bg-white bg-opacity-[0.05] absolute top-[5%] left-[50%] -translate-x-[50%] rounded-md w-[80%] p-5 flex items-center'>
            <img src="/warning.svg" alt="" className='mr-3' />
            <div>
                <div className='flex justify-between'>
                    <h3 className='text-lg'>Suspicious Language Detected</h3>
                    <button onClick={() => {
                        props.onClose()
                    }} >
                        <img src="/cross.svg" alt="" />
                    </button>
                </div>
                <p className='text-gray-400'>The conversation might be encouraging a hasty decision. Relax, and consider all the possibilities before responding</p>
            </div>
        </div>
    )
}

export default SuspicionModal