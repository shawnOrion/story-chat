import EventEmitter from "../utils/eventEmitter.js";
import ChatService from "./chatService.js";
import ChatView from "./chatView.js";
import instructions from "../data/instructions.js";
import endChatPhrase from "../data/endChatPhrase.js";

class ChatManager extends EventEmitter {
  constructor(storyString) {
    super();
    this.messages = [
      // initial context for chatbot
      { role: "system", content: instructions },
      { role: "system", content: storyString },
    ];
    this.chatRecorder = null;
    this.chatService = new ChatService();
    this.chatView = new ChatView(this);
  }

  setChatRecorder(chatRecorder) {
    this.chatRecorder = chatRecorder;
    this.subscribeToEvents();
  }

  subscribeToEvents() {
    if (!this.chatRecorder) {
      console.error("ChatRecorder not set.");
      return;
    }

    this.chatRecorder.eventEmitter.on("audioReady", async (audioBlob) => {
      await this.handleCreateUserMessage(audioBlob);
      await this.handleCreateChatbotMessage();
      this.checkChatOver() && this.emit("endChat");
    });

    this.chatService.on("audioPlaybackOver", () => {
      this.emit("enableSpeakingButton");
    });

    this.chatView.on("startChat", async () => {
      await this.handleCreateChatbotMessage();
    });

    this.chatView.on("startRecording", () => {
      this.chatRecorder.startRecording();
    });

    this.chatView.on("stopRecording", () => {
      this.chatRecorder.stopRecording();
    });
  }

  async handleCreateUserMessage(audioBlob) {
    try {
      const userAudioFilename = await this.chatService.sendAudioData(audioBlob);
      if (!userAudioFilename) throw new Error("Audio upload failed");

      const transcription = await this.chatService.sendFileNameForTranscription(
        userAudioFilename
      );
      if (!transcription) throw new Error("Transcription failed");

      this.addMessage("user", transcription);
    } catch (error) {
      console.error("Error in ChatManager:", error.message);
      this.emit("error", error.message);
    }
  }

  checkChatOver() {
    let recentMessageContent = this.messages[this.messages.length - 1].content;

    return recentMessageContent
      .toLowerCase()
      .includes(endChatPhrase.toLowerCase());
  }

  async handleCreateChatbotMessage() {
    try {
      const messageContent = await this.chatService.getMessage(this.messages);
      if (!messageContent) throw new Error("No message content from chatbot");
      this.addMessage("assistant", messageContent);

      const aiAudioFilename = await this.chatService.convertTextToSpeech(
        messageContent
      );
      if (!aiAudioFilename)
        throw new Error("Failed to convert text to speech.");

      this.chatService.playAudio(aiAudioFilename);
    } catch (error) {
      console.error("Error in ChatManager:", error.message);
      this.emit("error", error.message);
    }
  }

  addMessage(role, content) {
    this.messages.push({ role, content });
    console.log("Current messages state:", this.messages);
  }

  logMessagesState() {}

  isRecording() {
    return this.chatRecorder.isRecording();
  }
}

export default ChatManager;
