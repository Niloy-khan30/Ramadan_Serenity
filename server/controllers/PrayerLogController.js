const PrayerLog = require("../models/PrayerLog");
const Goal = require("../models/Goal");

const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
};

const upsertPrayerLog = async (req, res) => {
    try {
        const { userEmail, date, prayers } = req.body;

        if (!userEmail || !prayers) {
            return res.status(400).json({
                success: false,
                message: "userEmail and prayers are required",
            });
        }

        const logDate = date || getTodayDate();

        const updatedLog = await PrayerLog.findOneAndUpdate(
            { userEmail, date: logDate },
            {
                userEmail,
                date: logDate,
                prayers: {
                    fajr: prayers.fajr || false,
                    dhuhr: prayers.dhuhr || false,
                    asr: prayers.asr || false,
                    maghrib: prayers.maghrib || false,
                    isha: prayers.isha || false,
                },
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        );

        const completedPrayerCount = Object.values(updatedLog.prayers).filter(Boolean).length;

        // Update normal progress-based prayer goals
        await Goal.updateMany(
            {
                userEmail,
                category: "prayer",
                targetType: "daily",
                goalMode: "progress",
            },
            {
                currentValue: completedPrayerCount,
                status: completedPrayerCount >= 5 ? "completed" : "active",
                lastUpdatedDate: logDate,
            }
        );

        // Update streak-based prayer goals
        const streakGoals = await Goal.find({
            userEmail,
            category: "prayer",
            targetType: "daily",
            goalMode: "streak",
        });

        for (const goal of streakGoals) {
            if (completedPrayerCount === 5) {
                goal.streakCount += 1;
                if (goal.streakCount > goal.bestStreak) {
                    goal.bestStreak = goal.streakCount;
                }
            } else {
                goal.streakCount = 0;
            }

            goal.currentValue = goal.streakCount;
            goal.status = goal.streakCount >= goal.targetValue ? "completed" : "active";
            goal.lastUpdatedDate = logDate;

            await goal.save();
        }


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

        const prayerLog = await PrayerLog.findOne({
            userEmail: email,
            date,
        });

        return res.status(200).json({
            success: true,
            log: prayerLog || null,
        });
    } catch (error) {
        console.error("Get prayer log by date error:", error.message);

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

        let totalCompletedPrayers = 0;
        let perfectDays = 0;
        let currentStreak = 0;
        let maxStreak = 0;

        logs.forEach((log) => {
            const completedCount = Object.values(log.prayers).filter(Boolean).length;

            totalCompletedPrayers += completedCount;

            if (completedCount === 5) {
                perfectDays += 1;
                currentStreak += 1;
                if (currentStreak > maxStreak) {
                    maxStreak = currentStreak;
                }
            } else {
                currentStreak = 0;
            }
        });

        const averagePrayersPerDay =
            totalDays > 0 ? (totalCompletedPrayers / totalDays).toFixed(2) : 0;

        return res.status(200).json({
            success: true,
            consistency: {
                totalDays,
                totalCompletedPrayers,
                perfectDays,
                currentStreak,
                maxStreak,
                averagePrayersPerDay,
            },
        });
    } catch (error) {
        console.error("Get prayer consistency error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch prayer consistency",
            error: error.message,
        });
    }
};

module.exports = {
    upsertPrayerLog,
    getPrayerLogByDate,
    getPrayerConsistency,
};