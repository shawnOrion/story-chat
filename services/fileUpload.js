const multer = require("multer");
const path = require("path");

class FileUploadService {
  constructor() {
    this.uploadsDir = path.join(__dirname, "../public/uploads");
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadsDir);
      },
      filename: (req, file, cb) => {
        cb(null, `recording-${Date.now()}.mp3`);
      },
    });
  }

  getUploadMiddleware() {
    return multer({ storage: this.storage }).single("audioFile");
  }
}

module.exports = new FileUploadService();
