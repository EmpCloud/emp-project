// import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
const index = () => {
  // const recorderControls = useAudioRecorder()
  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    var theDiv = document.getElementById("audio_by_user");
    theDiv.appendChild(audio);
  };
  // const {
  //   startRecording,
  //   stopRecording,
  //   togglePauseResume,
  //   recordingBlob,
  //   isRecording,
  //   isPaused,
  //   recordingTime,
  // } = useAudioRecorder();
  return (
    <div>
      {/* <AudioRecorder
        onRecordingComplete={(blob) => addAudioElement(blob)}
        recorderControls={recorderControls}
      /> */}
      {/* <button onClick={recorderControls.stopRecording}>Stop recording</button> */}
    </div>
  )
}
export default index;