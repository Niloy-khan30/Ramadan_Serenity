const PrayerLog = require("../models/PrayerLog");
const Goal = require("../models/Goal");
const { getPeriodKey, getDateDifference } = require("../utils/goalUtils");

const recalculatePrayerGoals = async (userEmail, date) => {
    const goals = await Goal.find({ userEmail, category: "prayer" });

    for (const goal of goals) {
        const periodKey = getPeriodKey(date, goal.targetType);

        const logs = await PrayerLog.find({ userEmail });

        const matchingLogs = logs.filter(
            (log) => getPeriodKey(log.date, goal.targetType) === periodKey
        );

        const totalCompletedPrayers = matchingLogs.reduce((sum, log) => {
            return sum + Object.values(log.prayers).filter(Boolean).length;
        }, 0);

        goal.currentValue = totalCompletedPrayers;
        goal.status =
            totalCompletedPrayers >= goal.targetValue ? "completed" : "active";
        goal.periodKey = periodKey;
        goal.lastUpdatedDate = date;

        await goal.save();
    }
};

const upsertPrayerLog = async (req, res) => {
    try {
        const { userEmail, date, prayers } = req.body;

        if (!userEmail || !date || !prayers) {
            return res.status(400).json({
                success: false,
                message: "userEmail, date, and prayers are required",
            });
        }

        const updatedLog = await PrayerLog.findOneAndUpdate(
            { userEmail, date },
            {
                userEmail,
                date,
                prayers: {
                    fajr: prayers.fajr || false,
                    dhuhr: prayers.dhuhr || false,
                    asr: prayers.asr || false,
                    maghrib: prayers.maghrib || false,
                    isha: prayers.isha || false,
                },
            },
            {
                upsert: true,
                runValidators: true,
                returnDocument: "after",
            }
        );

        await recalculatePrayerGoals(userEmail, date);

        return res.status(200).json({
            success: true,
            message: "Prayer log saved successfully",
            log: updatedLog,
        });
    } catch (error) {
        console.error("Upsert prayer log error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to save prayer log",
            error: error.message,
        });
    }
};

const getPrayerLogByDate = async (req, res) => {
    try {
        const { email, date } = req.params;

        const log = await PrayerLog.findOne({
            userEmail: email,
            date,
        });

        return res.status(200).json({
            success: true,
            log,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch prayer log",
            error: error.message,
        });
    }
};

const getPrayerConsistency = async (req, res) => {
    try {
        const { email } = req.params;

        const logs = await PrayerLog.find({ userEmail: email }).sort({ date: 1 });

        const totalDays = logs.length;

        const totalCompletedPrayers = logs.reduce((sum, log) => {
            return sum + Object.values(log.prayers).filter(Boolean).length;
        }, 0);

        const perfectDays = logs.filter(
            (log) => Object.values(log.prayers).filter(Boolean).length === 5
        ).length;

        let currentStreak = 0;
        let maxStreak = 0;
        let tempStreak = 0;
        let previousPerfectDate = null;

        logs.forEach((log) => {
            const completedCount = Object.values(log.prayers).filter(Boolean).length;

            if (completedCount === 5) {
                if (
                    !previousPerfectDate ||
                    getDateDifference(previousPerfectDate, log.date) === 1
                ) {
                    tempStreak += 1;
                } else {
                    tempStreak = 1;
                }

                previousPerfectDate = log.date;
                maxStreak = Math.max(maxStreak, tempStreak);
            } else {
                tempStreak = 0;
            }
        });

        currentStreak = tempStreak;

        return res.status(200).json({
            success: true,
            consistency: {
                totalDays,
                totalCompletedPrayers,
                perfectDays,
                currentStreak,
                maxStreak,
            },
        });
    } catch (error) {
        console.error("Prayer consistency error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to calculate prayer consistency",
            error: error.message,
        });
    }
};

module.exports = {
    upsertPrayerLog,
    getPrayerLogByDate,
    getPrayerConsistency,
};