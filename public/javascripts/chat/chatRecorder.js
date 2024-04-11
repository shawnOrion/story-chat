import EventEmitter from "../utils/eventEmitter.js";
import AudioRecorder from "../utils/audioRecorder.js";
// extends eventEmitter too
class ChatRecorder extends AudioRecorder {
  constructor(stream, options = {}) {
    super(stream, options);
    this.eventEmitter = new EventEmitter();
  }

  startRecording(timeslice = undefined) {
    super.startRecording(timeslice);
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      super.stopRecording();
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/mp3" });
        this.processRecording(audioBlob);
        this.audioChunks = []; // Reset the chunks for the next recording
      };
    }
  }

  processRecording(audioBlob) {
    this.eventEmitter.emit("audioReady", audioBlob);
  }

  isRecording() {
    return this.mediaRecorder && this.mediaRecorder.state !== "inactive.js";
  }
}

export default ChatRecorder;
