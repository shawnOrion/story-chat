import storyPages from "./data/storyData.js";
import StoryService from "./readAloud/storyService.js";
import ReadAloudManager from "./readAloud/readAloudManager.js";
import ReadAloudView from "./readAloud/readAloudView.js";
import WebSocketManager from "./readAloud/webSocketManager.js";
import ReadAloudRecorder from "./readAloud/readAloudRecorder.js";
import EventEmitter from "./utils/eventEmitter.js";
import ChatManager from "./chat/chatManager.js";
import ChatRecorder from "./chat/chatRecorder.js";

class ApplicationController extends EventEmitter {
  constructor() {
    super();
    this.wsUrl = "ws://localhost:3000";
    this.storyService = null;
    this.readAloudManager = null;
    this.readAloudView = null;
    this.webSocketManager = null;
    this.readAloudRecorder = null;
    this.chatManager = null;
    this.chatRecorder = null;
  }

  async initializeApplication() {
    try {
      await this.initializeStory();
      await this.initializeReadAloudManager();
      await this.initializeReadAloudView();
      await this.initializeWebSocketManager();
      await this.initializeReadAloudRecorder();
      // initializeChat is independent of the previous steps
    } catch (error) {
      console.error("Application initialization failed:", error);
    }
  }

  async initializeStory() {
    if (!this.storyService) {
      this.storyService = new StoryService(storyPages);
    }
  }

  async initializeReadAloudManager() {
    if (!this.storyService) {
      throw new Error("storyService is not initialized.");
    }
    const wordsOfPages = this.storyService.getWordsOfPages();
    this.readAloudManager = new ReadAloudManager(wordsOfPages);
    this.readAloudManager.on("stopReadAloud", () => this.stopReadAloud());
  }

  async initializeReadAloudView() {
    if (!this.storyService || !this.readAloudManager) {
      throw new Error("storyService or ReadAloudManager is not initialized.");
    }
    this.readAloudView = new ReadAloudView(
      this.storyService.pages,
      this.readAloudManager
    );
    this.readAloudView.loadStory();
  }

  async initializeWebSocketManager() {
    if (!this.readAloudManager) {
      throw new Error("ReadAloudManager is not initialized.");
    }
    this.webSocketManager = new WebSocketManager(
      this.wsUrl,
      this.readAloudManager
    );
    this.webSocketManager.connect();
  }

  async initializeReadAloudRecorder() {
    if (!this.webSocketManager) {
      throw new Error("WebSocketManager is not initialized.");
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.readAloudRecorder = new ReadAloudRecorder(
        stream,
        { mimeType: "audio/webm" },
        this.webSocketManager
      );
      this.readAloudRecorder.startRecording();
    } catch (error) {
      throw new Error(`Error initializing ReadAloudRecorder: ${error}`);
    }
  }

  stopReadAloud() {
    try {
      if (!this.readAloudRecorder) {
        throw new Error(
          "Cannot stop ReadAloudRecorder. ReadAloudRecorder is not initialized."
        );
      }
      if (!this.webSocketManager) {
        throw new Error(
          "Cannot stop WebSocketManager. WebSocketManager is not initialized."
        );
      }
      this.readAloudRecorder.stopRecording();
      this.webSocketManager.disconnect();
      console.log(
        "ReadAloudRecorder stopped and WebSocketManager disconnected."
      );
      this.initializeChat();
    } catch (error) {
      console.error(
        `Error stopping ReadAloudRecorder and WebSocketManager: ${error}`
      );
    }
  }

  async initializeChat() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chatRecorder = new ChatRecorder(stream, {
        mimeType: "audio/webm",
      });
      console.log("ChatRecorder initialized");
      const storyString = this.storyService.getStoryString();
      const chatManager = new ChatManager(storyString);
      chatManager.setChatRecorder(chatRecorder);
      console.log("ChatManager initialized");
    } catch (error) {
      console.error("Error initializing Chat:", error);
    }
  }
}

const appController = new ApplicationController();
appController.initializeApplication();
