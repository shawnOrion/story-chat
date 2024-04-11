class WebSocketManager {
  constructor(url, readAloudManager) {
    this.url = url;
    this.ws = null;
    this.readAloudManager = readAloudManager;
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () =>
      console.log("WebSocket connection established to " + this.url);
    this.ws.onmessage = (event) => this.onMessageReceived(event);
    this.ws.onclose = () =>
      console.log("WebSocket connection to " + this.url + " closed");
    this.ws.onerror = (error) =>
      console.error("WebSocket error on " + this.url + ":", error);
  }

  onMessageReceived(event) {
    let data;
    try {
      data = JSON.parse(event.data);
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
      return;
    }

    if (!data) {
      console.log("No data received from WebSocket on " + this.url);
      return;
    }

    console.log("Data received from WebSocket on " + this.url + ":", data);

    if (!data.channel || !data.channel.alternatives) {
      // No transcription data
      return;
    }

    const transcript = data.channel.alternatives[0].transcript;

    this.readAloudManager.updateCorrectWords(transcript.split(" "));
  }

  sendMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      console.log("Attempted to send message, but WebSocket is not open.");
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default WebSocketManager;
