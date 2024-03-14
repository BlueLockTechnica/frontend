import { useEffect, useRef, useState } from 'react'
import './App.css'
import { MediaRecorder, IMediaRecorder, register } from "extendable-media-recorder"
import { connect } from 'extendable-media-recorder-wav-encoder'
import Recorder from './components/Recorder'

function App() {
  return <>
    <Recorder />
  </>
}

export default App
