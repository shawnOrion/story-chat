const fs = require("fs");
const path = require("path");

class FileManagementService {
  constructor() {
    this.baseDirectory = path.join(__dirname, "../public/uploads");
  }

  createReadStream(fileName) {
    const filePath = this.getFilePath(fileName);
    return fs.createReadStream(filePath);
  }

  async writeFile(fileName, data) {
    const filePath = this.getFilePath(fileName);
    await fs.promises.writeFile(filePath, data);
    return filePath;
  }

  async readFile(fileName) {
    const filePath = this.getFilePath(fileName);
    return await fs.promises.readFile(filePath, "utf-8");
  }

  async fileExists(fileName) {
    const filePath = this.getFilePath(fileName);
    try {
      await fs.promises.access(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Helper method to get the full file path
  getFilePath(fileName) {
    return path.join(this.baseDirectory, fileName);
  }
}

module.exports = new FileManagementService();
