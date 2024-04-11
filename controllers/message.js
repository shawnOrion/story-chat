const OpenAIService = require("../services/openai");

async function createMessage(req, res) {
  try {
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({
        status: "error",
        message: "messages is required",
        data: null,
      });
    }
    for (let i = 0; i < messages.length; i++) {
      if (!messages[i].role || !messages[i].content) {
        return res.status(400).json({
          status: "error",
          message: "messages is not formatted correctly",
          data: null,
        });
      }
    }
    const message = await OpenAIService.createMessage(messages);
    res.json({
      status: "success",
      message: "Message created successfully",
      data: { message },
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message, data: null });
  }
}

module.exports = {
  createMessage,
};
