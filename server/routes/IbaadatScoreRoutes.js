const express = require("express");
const {
    calculateIbaadatScore,
    getIbaadatScoreByDate,
} = require("../controllers/IbaadatScoreController");

const router = express.Router();

router.post("/", calculateIbaadatScore);
router.get("/:email/:date", getIbaadatScoreByDate);

module.exports = router;