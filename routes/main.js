var express = require("express");
var router = express.Router();
const { createMessage } = require("../controllers/message");
const { createSpeech, createTranscription } = require("../controllers/voice");
const { uploadAudio, streamAudio } = require("../controllers/audioFile");

router.post("/api/transcription", createTranscription);

router.post("/api/speech", createSpeech);

router.post("/api/message", createMessage);

router.post("/api/upload-audio", uploadAudio);

router.get("/api/stream-audio/:filename", streamAudio);

router.get("/", function (req, res, next) {
  res.render("index");
});

module.exports = router;
