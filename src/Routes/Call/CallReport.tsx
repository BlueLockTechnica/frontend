import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Message from '../../components/Message/Message'
import TopNav from '../../components/TopNav/TopNav'

type Props = {}

const CallReport = (props: Props) => {

    const { channel } = useParams()
    const [messages, setMessages] = useState<any[]>([])
    const [summary, setSummary] = useState<string>()
    const [issues, setIssues] = useState<any[]>([])

    const getReport = async () => {
        const res = await fetch(`http://localhost:8000/${channel}/report`)
        const data = await res.json()

        console.log(data)
        setMessages(data)

    }

    useEffect(() => {
        if (messages.length === 0) return
        const issueArr = messages.map(msg => {
            if (msg.AIComments.length > 0) {
                const jsonResponse = JSON.parse(msg.AIComments)
                return jsonResponse.map((comment: any) => {
                    if (comment.suspicious || comment.Suspicious) {
                        return { type: "Suspicious", text: comment.Suspicious ?? comment.suspicious }
                    }
                    if (comment.incorrect || comment.Incorrect) {
                        return { type: "Incorrect", text: comment.Incorrect ?? comment.incorrect }
                    }
                    if (comment.correct || comment.Correct) {
                        return { type: "Correct", text: comment.Correct ?? comment.correct }
                    }
                    if (comment.consistency || comment.Consistency) {
                        return { type: "Consistency", text: comment.Consistency ?? comment.consistency }
                    }
                })
            }
        })
        console.log()
        setIssues(issueArr.reduce((a, e) => a.concat(e), []).filter((e: any) => e))
    }, [messages])


    useEffect(() => {
        getReport()
    }, [])


    return (
        <div className='flex flex-col' >
            <TopNav />
            <div className='flex h-[80vh]'>
                <div className='h-full p-5 m-5 bg-bg-grey w-[1000px] flex flex-col  relative'>
                    <h1 className='text-xl '>Call Summary</h1>

                </div>
                <div className='flex flex-col flex-1 mx-5 mt-5 max-h-[80vh]'>
                    <div className='flex flex-col flex-[0.6] max-h-[60%] w-full p-5 mb-5 rounded-md bg-bg-grey'>
                        <h2 className='pb-2 text-xl'>Call Transcript</h2>

                        <ul className='h-full py-10 overflow-scroll'>
                            {(messages ?? []).map((msg, i) =>
                                <Message msg={msg} key={i} />)}
                        </ul>
                    </div>
                    <div className='flex-[0.4] mt-5 bg-bg-grey max-h-[35%] rounded-md'>
                        <h2 className='p-5 text-xl'>Suspicion Report</h2>
                        <div className='h-[150px]'>
                            <ul className='h-full p-2 m-0 overflow-scroll'>
                                {issues.map((s, i) => <li key={i} className={`p-2 m-5 flex flex-col rounded-md ${s?.type === "Suspicious" ? "bg-[#E53A00] " :
                                    s?.type === "Incorrect" ? "bg-red-500 " :
                                        s?.type === "Correct" ? "bg-green-500 " : s?.type === "Consistency" ? "bg-blue-500 " : "bg-bg-grey"}`}>
                                    <p className='font-semibold text-white'>{s?.type ?? "Type"}</p>
                                    <p className=''>{s?.text ?? "text"}</p>
                                </li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    )
}

export default CallReport