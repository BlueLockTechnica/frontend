import { useCallback, useEffect, useRef, useState } from "react"
import { IMediaRecorder, MediaRecorder, register } from "extendable-media-recorder"
import { connect } from 'extendable-media-recorder-wav-encoder'
type Props = {
    channel: string
    userId: string
}

const silenceThreshold = 0.01
const silenceDetectionTime = 4
const Recorder = (props: Props) => {
    
}


export default Recorder