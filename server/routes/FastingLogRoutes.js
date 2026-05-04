const express = require("express");
const {
    upsertFastingLog,
    getFastingLogsByUser,
} = require("../controllers/FastingLogController");

const router = express.Router();

router.post("/", upsertFastingLog);
router.get("/:email", getFastingLogsByUser);

module.exports = router;