// audioFile.js
const FileManagementService = require("../services/fileManagement");
const FileUploadService = require("../services/fileUpload");
const upload = FileUploadService.getUploadMiddleware();

async function uploadAudio(req, res) {
  upload(req, res, function (err) {
    if (err instanceof FileUploadService.MulterError) {
      return res.status(500).send({
        status: "error",
        message: `Multer error: ${err.message}`,
        data: null,
      });
    } else if (err) {
      return res.status(500).send({
        status: "error",
        message: `Unknown upload error: ${err.message}`,
        data: null,
      });
    }

    if (!req.file) {
      return res
        .status(400)
        .send({ status: "error", message: "No file uploaded.", data: null });
    }

    res.send({
      status: "success",
      message: "File uploaded successfully.",
      data: {
        fileName: req.file.filename,
      },
    });
  });
}

async function streamAudio(req, res) {
  const { filename } = req.params;
  res.set("Content-Type", "audio/mp3");
  if (!FileManagementService.fileExists(filename)) {
    return res.status(404).send("Could not find the audio file");
  }
  const readStream = FileManagementService.createReadStream(filename);

  readStream.on("open", () => {
    readStream.pipe(res);
  });

  readStream.on("error", (err) => {
    console.error("Error streaming the audio file:", err);
    res.status(404).send("Could not find the audio file");
  });
}

module.exports = {
  uploadAudio,
  streamAudio,
};
