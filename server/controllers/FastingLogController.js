const FastingLog = require("../models/FastingLog");
const Goal = require("../models/Goal");
const { getPeriodKey, getMonthKey } = require("../utils/goalUtils");

const recalculateFastingGoals = async (userEmail, date) => {
    const goals = await Goal.find({ userEmail, category: "fasting" });

    for (const goal of goals) {
        const periodKey = getPeriodKey(date, goal.targetType);

        const completedLogs = await FastingLog.find({
            userEmail,
            status: "completed",
        });

        const completedFasts = completedLogs.filter(
            (log) => getPeriodKey(log.date, goal.targetType) === periodKey
        ).length;

        goal.currentValue = completedFasts;
        goal.status = completedFasts >= goal.targetValue ? "completed" : "active";
        goal.periodKey = periodKey;
        goal.lastUpdatedDate = date;

        await goal.save();
    }
};

const upsertFastingLog = async (req, res) => {
    try {
        const { userEmail, day, date, status } = req.body;

        if (!userEmail || !day || !date) {
            return res.status(400).json({
                success: false,
                message: "userEmail, day, and date are required",
            });
        }

        const monthKey = getMonthKey(date);

        // Uses { userEmail, day } because your MongoDB likely still has
        // the old unique index userEmail_1_day_1.
        // This avoids save failure without needing Atlas index access.
        const updatedLog = await FastingLog.findOneAndUpdate(
            { userEmail, day },
            {
                userEmail,
                day,
                date,
                monthKey,
                status,
            },
            {
                upsert: true,
                runValidators: true,
                returnDocument: "after",
            }
        );

        await recalculateFastingGoals(userEmail, date);

        return res.status(200).json({
            success: true,
            message: "Fasting log saved successfully",
            log: updatedLog,
        });
    } catch (error) {
        console.error("Upsert fasting log error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to save fasting log",
            error: error.message,
        });
    }
};

const getFastingLogsByUser = async (req, res) => {
    try {
        const { email } = req.params;
        const monthKey = req.query.monthKey || getMonthKey();

        const logs = await FastingLog.find({
            userEmail: email,
            monthKey,
        }).sort({ day: 1 });

        return res.status(200).json({
            success: true,
            monthKey,
            logs,
        });
    } catch (error) {
        console.error("Get fasting logs error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch fasting logs",
            error: error.message,
        });
    }
};

module.exports = {
    upsertFastingLog,
    getFastingLogsByUser,
};