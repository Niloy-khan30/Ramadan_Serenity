const IbaadatScore = require("../models/IbaadatScore");
const PrayerLog = require("../models/PrayerLog");
const Goal = require("../models/Goal");

const calculateIbaadatScore = async (req, res) => {
    try {
        const { userEmail, date, fastingStatus } = req.body;

        if (!userEmail || !date) {
            return res.status(400).json({
                success: false,
                message: "userEmail and date are required",
            });
        }

        const prayerLog = await PrayerLog.findOne({ userEmail, date });
        const goals = await Goal.find({ userEmail });

        const completedPrayers = prayerLog
            ? Object.values(prayerLog.prayers).filter(Boolean).length
            : 0;

        const prayerScore = completedPrayers * 10;

        const fastingScore = fastingStatus === "completed" ? 30 : 0;

        const completedGoals = goals.filter(
            (goal) => goal.status === "completed"
        ).length;

        const goalScore = Math.min(completedGoals * 10, 20);

        const totalScore = prayerScore + fastingScore + goalScore;

        const savedScore = await IbaadatScore.findOneAndUpdate(
            { userEmail, date },
            {
                userEmail,
                date,
                prayerScore,
                fastingScore,
                goalScore,
                totalScore,
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Ibaadat score calculated successfully",
            score: savedScore,
        });
    } catch (error) {
        console.error("Calculate ibaadat score error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to calculate ibaadat score",
            error: error.message,
        });
    }
};

const getIbaadatScoreByDate = async (req, res) => {
    try {
        const { email, date } = req.params;

        const score = await IbaadatScore.findOne({
            userEmail: email,
            date,
        });

        return res.status(200).json({
            success: true,
            score: score || null,
        });
    } catch (error) {
        console.error("Get ibaadat score error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch ibaadat score",
            error: error.message,
        });
    }
};

module.exports = {
    calculateIbaadatScore,
    getIbaadatScoreByDate,
};