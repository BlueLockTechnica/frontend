import { useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from "react"
import { IMediaRecorder, MediaRecorder, register } from "extendable-media-recorder"
import { connect } from 'extendable-media-recorder-wav-encoder'
type Props = {}

const silenceThreshold = 0.01
const silenceDetectionTime = 4
const CallInterface = (props: Props) => {
    const { channel, userId } = useParams()
    const socket = useRef<WebSocket | null>()

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
    const isRegistered = useRef<boolean>(false)
    const frameNum = useRef(0)

    const connectReg = async () => {
        await register(await connect())

    }

    useEffect(() => {
        connectReg()
        isRegistered.current = true
        if (socket.current) return
        socket.current = new WebSocket(`wss://287f-136-233-9-98.ngrok-free.app/ws/${channel}/${userId}`)
        socket.current.addEventListener('open', () => {
            console.log("Connected to scoket")
        })
        socket.current.addEventListener('message', (msg) => {
            const data = JSON.parse(msg.data)
            if (data.body.length === 0) return
            setMessages(t => [...t, data])
            console.log("message: ", data.sender_id)
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
        const res = await fetch(`https://287f-136-233-9-98.ngrok-free.app/post/${channel}/${userId}`, {
            method: 'POST',
            body: formData
        })
        const data = await res.json()
        console.log(data.transcript)
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
        <div className='flex h-[100vh]'>
            <div className='flex-1 h-full m-2 bg-white'>
                <button className='text-black' onClick={() => {
                    if (recording) {
                        stopRecording()
                    } else {
                        startRecording()
                    }
                }}>{recording ? "Stop" : "Start"} Recording</button>
                <ul>
                    {messages.map(msg =>
                        <div className='flex w-full'>
                            <li className={`justify-end text-black text-wrap ${msg.sender_id == userId ? "justify-start text-left" : "justify-end text-right"}`}>{"Sender " + msg.sender_id} - {msg.body}</li>
                        </div>)}
                </ul>
            </div>
        </div>
    )

}

export default CallInterface