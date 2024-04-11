// import event emitter
import EventEmitter from "../utils/eventEmitter.js";
// chat service class
class ChatService extends EventEmitter {
  constructor() {
    super();
    this.audioPlayer = document.getElementById("audioPlayer"); // Ensure this exists in your HTML
  }

  async getMessage(messages) {
    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { data } = await response.json();
      if (data && data.message) {
        return data.message.content;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async sendAudioData(audioBlob) {
    try {
      const formData = new FormData();
      formData.append("audioFile", audioBlob, "recording.mp3");

      const response = await fetch("/api/upload-audio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const { status, message, data } = await response.json();
      console.log(message);
      return data.fileName;
    } catch (error) {
      console.error("Error:", error.message);
      return null;
    }
  }

  async sendFileNameForTranscription(fileName) {
    try {
      // log the filename
      console.log("Filename:", fileName);
      const response = await fetch("/api/transcription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const { status, message, data } = await response.json();
      console.log(message);
      return data.transcription;
    } catch (error) {
      console.error("Error during transcription:", error);
      return null;
    }
  }

  async convertTextToSpeech(text) {
    try {
      console.log("Converting text to speech:", text);
      const response = await fetch("/api/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const { status, message, data } = await response.json();
      // log the data
      console.log("Data:", data);
      console.log(message);
      return data.fileName;
    } catch (error) {
      console.error("Error:", error.message);
      return null;
    }
  }

  playAudio(filename) {
    if (!this.audioPlayer) {
      console.error("Audio player does not exist");
      return;
    }

    this.audioPlayer.controls = true;
    this.audioPlayer.src = `/api/stream-audio/${filename}`;
    this.audioPlayer.onended = () => {
      // log
      console.log("Audio playback over");
      this.emit("audioPlaybackOver");
    };
    this.audioPlayer.play();
  }
}
export default ChatService;
