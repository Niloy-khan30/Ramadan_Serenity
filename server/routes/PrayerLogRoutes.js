const express = require("express");
const {
    upsertPrayerLog,
    getPrayerLogByDate,
    getPrayerConsistency,
} = require("../controllers/PrayerLogController");

const router = express.Router();

router.post("/", upsertPrayerLog);

// IMPORTANT: put this BEFORE the dynamic route
router.get("/consistency/:email", getPrayerConsistency);

// dynamic route comes LAST
router.get("/:email/:date", getPrayerLogByDate);

module.exports = router;