const express = require("express");
const {
    upsertPrayerLog,
    getPrayerLogByDate,
    getPrayerConsistency,
    getPrayerLogsByUser,
} = require("../controllers/PrayerLogController");

const router = express.Router();

router.post("/", upsertPrayerLog);

router.get("/consistency/:email", getPrayerConsistency);
router.get("/all/:email", getPrayerLogsByUser);
router.get("/:email/:date", getPrayerLogByDate);

module.exports = router;