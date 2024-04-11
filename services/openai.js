require("dotenv").config();
const { OpenAI } = require("openai");
const FileManagementService = require("./fileManagement");

class OpenAIService {
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey });
  }

  async createTranscription(fileName) {
    try {
      const transcription = await this.openai.audio.transcriptions.create({
        model: "whisper-1",
        file: FileManagementService.createReadStream(fileName),
      });

      return transcription.text;
    } catch (error) {
      console.error("Error during transcription:", error);
    }
  }

  async createSpeech(text) {
    try {
      console.log("Creating speech for text:", text);
      const mp3 = await this.openai.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        input: text,
      });
      return Buffer.from(await mp3.arrayBuffer());
    } catch (error) {
      console.error("Error during speech creation:", error);
    }
  }

  async createMessage(messages) {
    const completion = await this.openai.chat.completions.create({
      messages: messages,
      model: "gpt-4-1106-preview",
    });
    const content = completion.choices[0].message.content;
    return {
      role: "assistant",
      content: content,
    };
  }
}

module.exports = new OpenAIService(process.env.OPENAI_API_KEY);
