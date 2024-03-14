import { useCallback, useEffect, useRef, useState } from "react"
import { IMediaRecorder, MediaRecorder, register } from "extendable-media-recorder"
import { connect } from 'extendable-media-recorder-wav-encoder'
type Props = {

}

const silenceThreshold = 0.01
const silenceDetectionTime = 4
const Recorder = (props: Props) => {
    const [recording, setRecording] = useState(false)
    const mediaStream = useRef<MediaStream | null>(null)
    const mediaRecorder = useRef<IMediaRecorder | null>(null)
    const chunks = useRef<Blob[]>([]);
    const audioContext = useRef<AudioContext | null>(null)
    const audioAnalyser = useRef<AnalyserNode | null>(null)
    const [silenceDuration, setSilenceDuration] = useState(0)
    const [isSilent, setIsSilent] = useState(false)
    const audioStreamSource = useRef<MediaStreamAudioSourceNode | null>(null)
    const [userTranscription, setTranscription] = useState<string[]>([])
    // const [otherTranscription, setOtherTranscription] = useState<string[]>([])
    const [isRegistered, setIsRegistered] = useState(false)
    const frameNum = useRef(0)

    const connectReg = async () => {
        if (isRegistered) return
        await register(await connect())
    }

    useEffect(() => {
        setIsRegistered(true)
        connectReg()
    }, [])

    useEffect(() => {
        console.log("silenceDuration", silenceDuration)
        console.log("chunks", chunks.current)
        if (isSilent && silenceDuration === silenceDetectionTime) {
            sendAudioData()
        }
    }, [silenceDuration])


    const sendAudioData = async () => {
        mediaRecorder.current?.stop()
        if (chunks.current.length === 0) {
            console.log("No audio data to send")
            return
        }
        const blob = new Blob(chunks.current, { type: "audio/wav" });
        chunks.current = []
        const formData = new FormData()
        formData.append('file', blob)
        const res = await fetch('https://eed4-136-233-9-98.ngrok-free.app/call/transcribe', {
            method: 'POST',
            body: formData
        })
        const data = await res.json()
        setTranscription(t => [...t, data.transcript])
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
            await sendAudioData()
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
        <>
            <div>
                <button className="record-btn" onClick={() => {
                    if (recording) {
                        stopRecording()
                    } else {
                        startRecording()
                    }
                }}>{recording ? "Stop" : "Start"} Recording</button>
                <ul>
                    {userTranscription.map(msg => <li>{msg}</li>)}
                </ul>
            </div>
        </>
    )

}


export default Recorder