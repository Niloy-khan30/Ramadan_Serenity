const express = require("express");
const {
    protect,
    authorizeUserEmail,
} = require("../middleware/authMiddleware");

const {
    upsertPrayerLog,
    getPrayerLogByDate,
    getPrayerConsistency,
    getPrayerLogsByUser,
} = require("../controllers/PrayerLogController");

const router = express.Router();

router.post("/", protect, authorizeUserEmail, upsertPrayerLog);

router.get(
    "/consistency/:email",
    protect,
    authorizeUserEmail,
    getPrayerConsistency
);

router.get("/all/:email", protect, authorizeUserEmail, getPrayerLogsByUser);

router.get("/:email/:date", protect, authorizeUserEmail, getPrayerLogByDate);

module.exports = router;