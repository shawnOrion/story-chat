const { createClient, LiveTranscriptionEvents } = require("@deepgram/sdk");
const dotenv = require("dotenv");
dotenv.config();

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);

const realtimeTranscriptionService = {
  keepAliveInterval: null,
  deepgram: null,

  startTranscription(ws) {
    this.deepgram = deepgramClient.listen.live({
      language: "en",
      punctuate: true,
      smart_format: true,
      model: "nova",
    });

    this.setupKeepAlive();
    this.handleDeepgramEvents(ws);

    return this.deepgram;
  },

  setupKeepAlive() {
    this.keepAliveInterval = setInterval(() => {
      if (this.deepgram.getReadyState() === 1) {
        // OPEN
        this.deepgram.keepAlive();
      } else {
        console.log("keep-alive signals stopped");
        clearInterval(this.keepAliveInterval);
      }
    }, 10 * 1000);
  },

  handleDeepgramEvents(ws) {
    this.deepgram.addListener(LiveTranscriptionEvents.Open, () =>
      console.log("Deepgram connection opened.")
    );
    this.deepgram.addListener(LiveTranscriptionEvents.Transcript, (data) => {
      if (this.deepgram.getReadyState() === 1) {
        // OPEN
        console.log("ws: transcript sent to client");
        ws.send(JSON.stringify(data));
      } else {
        console.log("ws: transcript couldn't be sent to client");
      }
    });
    this.deepgram.addListener(LiveTranscriptionEvents.Close, () => {
      console.log("Deepgram connection closed.");
      clearInterval(this.keepAliveInterval);
    });
    this.deepgram.addListener(LiveTranscriptionEvents.Error, (error) =>
      console.error("Deepgram error:", error)
    );
    this.deepgram.addListener(LiveTranscriptionEvents.Warning, (warning) =>
      console.warn("Deepgram warning:", warning)
    );
    this.deepgram.addListener(LiveTranscriptionEvents.Metadata, (data) => {
      if (this.deepgram.getReadyState() === 1) {
        // OPEN
        console.log("ws: metadata sent to client");
        ws.send(JSON.stringify(data));
      } else {
        console.log("ws: metadata couldn't be sent to client");
      }
    });
  },

  sendAudioDataForTranscription(message) {
    if (this.deepgram.getReadyState() === 1) {
      // OPEN
      console.log("ws: data sent to deepgram");
      this.deepgram.send(message);
    } else if (this.deepgram.getReadyState() >= 2) {
      // CLOSING or CLOSED
      console.log(
        "ws: deepgram connection not ready or closed. retrying connection to deepgram"
      );
      this.deepgram.finish();
      this.deepgram.removeAllListeners();
      this.deepgram = null;
    } else {
      console.log("ws: deepgram connection not ready");
    }
  },

  stopTranscription() {
    if (this.deepgram) {
      this.deepgram.finish();
      this.deepgram.removeAllListeners();
      this.deepgram = null;
    }
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  },
};

module.exports = realtimeTranscriptionService;
