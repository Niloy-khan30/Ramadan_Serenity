const express = require("express");
const { askAiAssistant } = require("../controllers/AiAssistantController");

const router = express.Router();

router.post("/ask", askAiAssistant);

module.exports = router;