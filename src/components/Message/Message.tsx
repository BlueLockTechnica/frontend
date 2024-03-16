import React, { useEffect, useState } from 'react'

type Props = {
    msg: any
}

const Message = (props: Props) => {

    const [message, setMessage] = useState<any>({ ...props.msg })


    useEffect(() => {
        if (props.msg.AIComments.length === 0 || props.msg.suspicion || props.msg.incorrect || props.msg.correct || props.msg.inconsistency) {
            console.log("No AI Comments")
        } else {
            console.log("printing aicomments", props.msg.AIComments)
            JSON.parse(props.msg.AIComments).map((msg: any) => {
                if (msg.suspicious || msg.Suspicious) {
                    setMessage((t: any) => ({ ...t, suspicion: true }))
                }
                if (msg.incorrect || msg.Incorrect) {
                    setMessage((t: any) => ({ ...t, incorrect: true }))
                }
                if (msg.correct || msg.Correct) {
                    setMessage((t: any) => ({ ...t, correct: true }))
                }
                if (msg.consistency || msg.Consistency) {
                    setMessage((t: any) => ({ ...t, inconsistency: true }))
                }
            })
        }
    }, [])

    useEffect(() => {
        console.log(message)
    }, [message])

    return (
        <div className=''>
            {message && <div className={`w-full p-2 px-3 my-2 rounded-md ${message.suspicion || props.msg.suspicion ? "bg-yellow-500 bg-opacity-10" : "bg-bg-grey"} ${message.incorrect || props.msg.incorrect ? "bg-red-500 bg-opacity-10" : "bg-bg-grey"} ${message.correct || props.msg.correct ? "bg-green-500 bg-opacity-10" : "bg-bg-grey"} ${message.inconsistency || props.msg.inconsistency ? "bg-blue-500 bg-opacity-10" : "bg-bg-grey"}`}>
                <p className='text-gray-400'><span className='text-white'>{message.username} - </span>{message.body}</p>
            </div>}
        </div>
    )
}

export default Message