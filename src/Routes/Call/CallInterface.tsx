import { useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from "react"
import { IMediaRecorder, MediaRecorder, register } from "extendable-media-recorder"
import { connect } from 'extendable-media-recorder-wav-encoder'
import TopNav from '../../components/TopNav/TopNav'
import Message from '../../components/Message/Message'
import SuspicionModal from '../../components/SuspicionModal'
type Props = {}

const silenceThreshold = 0.01
const silenceDetectionTime = 3
const CallInterface = (props: Props) => {
    const { channel, userId } = useParams()
    const socket = useRef<WebSocket | null>()


    const [suspicionModalOpen, setSuspicionModalOpen] = useState(false)
    const [recording, setRecording] = useState(false)
    const mediaStream = useRef<MediaStream | null>(null)
    const mediaRecorder = useRef<IMediaRecorder | null>(null)
    const chunks = useRef<Blob[]>([]);
    const audioContext = useRef<AudioContext | null>(null)
    const audioAnalyser = useRef<AnalyserNode | null>(null)
    const [silenceDuration, setSilenceDuration] = useState(0)
    const [isSilent, setIsSilent] = useState(false)
    const audioStreamSource = useRef<MediaStreamAudioSourceNode | null>(null)
    const [messages, setMessages] = useState<any[]>([])
    const [issues, setIssues] = useState<any[]>([])
    const isRegistered = useRef<boolean>(false)
    const frameNum = useRef(0)

    const connectReg = async () => {
        await register(await connect())

    }

    useEffect(() => {
        if (issues.length === 0) return
        setSuspicionModalOpen(true)
    }, [issues.length])

    useEffect(() => {
        connectReg()
        isRegistered.current = true
        if (socket.current) return
        socket.current = new WebSocket(`ws://localhost:8000/ws/${channel}/${userId}`)
        socket.current.addEventListener('open', () => {
            console.log("Connected to scoket")
        })
        socket.current.addEventListener('message', (msg) => {
            const data = JSON.parse(msg.data)
            console.log(data)
            console.log(data.body)
            setMessages(prev => {
                const index = prev.findIndex(m => m.id === data.id)
                if (index !== -1) {
                    const comments = JSON.parse(data.AIComments)
                    const hasSuspicion = comments.find((c: any) => !!c.suspicion)

                    prev[index].suspicion = hasSuspicion
                    console.log(comments)

                    const issueArr: any[] = []
                    comments.forEach((c: any) => {
                        if (!c.task) {
                            issueArr.push(c)
                        }
                    })

                    setIssues(iss => [...iss, ...issueArr])

                    return prev
                }
                return [...prev, { id: data.id, body: data.body, username: data.username }]
            })
            console.log(typeof data.id)
            console.log(messages)

        })
    }, [])

    useEffect(() => {
        console.log("silenceDuration", silenceDuration)
        console.log("chunks", chunks.current)
        if (isSilent && silenceDuration === silenceDetectionTime) {
            sendAudioData([...chunks.current])
        }
    }, [silenceDuration])


    const sendAudioData = async (arr: Blob[]) => {
        chunks.current = []
        mediaRecorder.current?.stop()
        if (arr.length === 0) {
            console.log("No audio data to send")
            return
        }
        const blob = new Blob(arr, { type: "audio/wav" });

        const formData = new FormData()
        formData.append('file', blob)
        const res = await fetch(`http://localhost:8000/post/${channel}/${userId}`, {
            method: 'POST',
            body: formData
        })
        const data = await res.json()
        mediaRecorder.current?.start()
    }


    const startRecording = async () => {
        setSilenceDuration(0)
        setRecording(true)
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaStream.current = stream
        mediaRecorder.current = new MediaRecorder(stream, { mimeType: "audio/wav" })
        mediaRecorder.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                console.log("data available", event.data)
                chunks.current.push(event.data);
            }
        }
        audioContext.current = new AudioContext();
        audioStreamSource.current = audioContext.current.createMediaStreamSource(stream);
        audioAnalyser.current = audioContext.current.createAnalyser();
        audioAnalyser.current.maxDecibels = -3;
        audioAnalyser.current.minDecibels = -50;
        audioStreamSource.current.connect(audioAnalyser.current);

        const bufferLength = audioAnalyser.current.frequencyBinCount;
        const frequencyData = new Uint8Array(bufferLength);


        let elapsedTime = 0;
        mediaRecorder.current.onstop = async () => {
            await sendAudioData([...chunks.current])
        }
        mediaRecorder.current.start()

        const detectSilence = () => {
            audioAnalyser.current?.getByteFrequencyData(frequencyData);

            // Check if all frequency bins are below the silence threshold
            const isAllSilent = frequencyData.every(value => (value / 255) < silenceThreshold);

            if (isAllSilent) {
                elapsedTime++
                if (elapsedTime >= 100) {
                    setSilenceDuration(duration => duration + 1);
                    elapsedTime = 0
                }
                setIsSilent(true)
            } else {
                setSilenceDuration(0)
                setIsSilent(false)
            }

            // Send request to backend if silence is detected for a certain duration
            frameNum.current = requestAnimationFrame(detectSilence);
        };

        frameNum.current = window.requestAnimationFrame(detectSilence);


    }

    const stopRecording = () => {
        chunks.current = []
        setRecording(false)
        cancelAnimationFrame(frameNum.current)
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
            mediaRecorder.current.stop();
        }
        if (mediaStream.current) {
            mediaStream.current.getTracks().forEach((track) => {
                track.stop();
            });
        }
    }


    return (
        <div className='flex flex-col'>
            <TopNav />
            <div className='flex h-[80vh]'>
                <div className='h-full m-5 bg-bg-grey w-[1000px] flex flex-col items-center justify-center relative'>
                    {suspicionModalOpen && <SuspicionModal onClose={() => {
                        setSuspicionModalOpen(false)
                    }} />}
                    <img src={`/avatar_1.png`} alt="" />
                    <h1>{userId == "1" ? "Sayar VIT" : "Deepam"}</h1>

                    <button className='p-2 text-white bg-red-600 rounded-md' onClick={() => {


                        if (recording) {
                            stopRecording()
                        } else {
                            startRecording()
                        }
                    }}>{recording ? "Stop" : "Start"} Recording</button>
                </div>
                <div className='flex flex-col flex-1 mx-5 mt-5'>
                    <div className='flex flex-col flex-[0.6] w-full p-5 mb-5 rounded-md bg-bg-grey'>
                        <h2 className='text-xl'>Call Transcript</h2>

                        <ul className='max-h-full py-10 overflow-scroll'>
                            {messages.map((msg, i) =>
                                <Message msg={msg} key={i} />)}
                        </ul>
                    </div>
                    <div className='flex-[0.4] mt-5 bg-bg-grey'>

                    </div>
                </div>
            </div>
        </div >
    )

}

export default CallInterface