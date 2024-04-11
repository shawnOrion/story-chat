import AudioRecorder from "../utils/audioRecorder.js";
class ReadAloudRecorder extends AudioRecorder {
  constructor(stream, options, webSocketManager) {
    super(stream, options);
    this.dataAvailableInterval = 250; // Default interval for data available (ms)
    this.webSocketManager = webSocketManager;
  }

  startRecording() {
    super.startRecording(this.dataAvailableInterval); // Start recording (and implicitly set up the base ondataavailable handler)
    const originalHandler = this.mediaRecorder.ondataavailable;
    this.mediaRecorder.ondataavailable = (event) => {
      if (originalHandler) originalHandler(event);
      if (
        event.data.size > 0 &&
        this.webSocketManager.ws.readyState === WebSocket.OPEN
      ) {
        this.webSocketManager.sendMessage(event.data);
      }
    };
  }
}

export default ReadAloudRecorder;
