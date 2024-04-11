const OpenAIService = require("../services/openai");
const FileManagementService = require("../services/fileManagement");

async function createSpeech(req, res) {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).send({ error: "No text provided" });
    }
    const buffer = await OpenAIService.createSpeech(text);
    const fileName = `speech-${Date.now()}.mp3`;
    await FileManagementService.writeFile(fileName, buffer);

    res.send({
      status: "success",
      message: "Speech created successfully",
      data: { fileName },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message, data: null });
  }
}

async function createTranscription(req, res) {
  try {
    const { fileName } = req.body;
    if (!FileManagementService.fileExists(fileName)) {
      return res.status(404).send({
        status: "error",
        message: "Could not find the audio file",
        data: null,
      });
    }

    const transcription = await OpenAIService.createTranscription(fileName);
    res.send({
      status: "success",
      message: "Transcription successful.",
      data: {
        transcription,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error during transcription",
      data: null,
    });
  }
}

module.exports = {
  createSpeech,
  createTranscription,
};
