class AudioRecorder {
  constructor(stream, options = {}) {
    this.stream = stream;
    this.options = options;
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  startRecording(timeslice = undefined) {
    this.mediaRecorder = new MediaRecorder(this.stream, this.options);
    // log the media recorder state changes
    this.mediaRecorder.ondataavailable = (event) => {
      this.audioChunks.push(event.data);
    };
    this.mediaRecorder.start(timeslice);
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }
  }
}
export default AudioRecorder;
