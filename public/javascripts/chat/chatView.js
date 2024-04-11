import EventEmitter from "../utils/eventEmitter.js";

class ChatView extends EventEmitter {
  constructor(chatManager) {
    super();
    this.chatManager = chatManager;
    this.initializeUIElements();
    this.setupEventListeners();
    this.subscribeToEvents();
  }

  initializeUIElements() {
    this.openChatBtn = document.getElementById("openChat");
    this.chatModal = document.querySelector(".chat-modal");
    this.toggleSpeakBtn = document.getElementById("toggleSpeak");
    this.errorMessage = document.querySelector(".error-message");
    this.openChatBtn.classList.remove("hidden");
  }

  setupEventListeners() {
    this.openChatBtn.addEventListener("click", () => {
      this.chatModal.classList.remove("hidden");
      this.openChatBtn.classList.add("hidden");
      this.toggleSpeakBtn.disabled = true;
      this.emit("startChat");
    });

    this.toggleSpeakBtn.addEventListener("click", () => {
      const isRecording = this.chatManager.isRecording();
      this.emit(isRecording ? "stopRecording" : "startRecording");
      this.toggleRecordingButtonState(isRecording);
    });
  }

  subscribeToEvents() {
    this.chatManager.on("error", (errorMessage) => {
      this.displayErrorMessage(errorMessage);
    });

    this.chatManager.on("enableSpeakingButton", () => {
      this.toggleSpeakBtn.disabled = false;
    });

    this.chatManager.on("endChat", () => {
      this.openChatBtn.classList.remove("hidden");
      this.chatModal.classList.add("hidden");
      this.errorMessage.classList.add("hidden");
      this.openChatBtn.disabled = true;
      this.openChatBtn.textContent = "See you next time!";
    });
  }

  displayErrorMessage(message) {
    this.errorMessage.classList.remove("hidden");
    this.errorMessage.textContent = message;
  }

  toggleRecordingButtonState(isRecording) {
    if (!isRecording) {
      this.toggleSpeakBtn.textContent = "Stop Speaking";
      this.toggleSpeakBtn.disabled = false;
    } else {
      this.toggleSpeakBtn.textContent = "Start Speaking";
      this.toggleSpeakBtn.disabled = true;
    }
  }
}
export default ChatView;
