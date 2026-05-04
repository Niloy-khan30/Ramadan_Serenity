const Goal = require("../models/Goal");
const { getTodayDate, getPeriodKey } = require("../utils/goalUtils");

const createGoal = async (req, res) => {
    try {
        const {
            userEmail,
            title,
            description,
            category,
            targetType,
            targetValue,
        } = req.body;

        if (!userEmail || !title || !targetValue) {
            return res.status(400).json({
                success: false,
                message: "userEmail, title, and targetValue are required",
            });
        }

        const today = getTodayDate();

        const goal = await Goal.create({
            userEmail,
            title,
            description,
            category,
            targetType,
            targetValue,
            periodKey: getPeriodKey(today, targetType || "daily"),
            lastUpdatedDate: today,
        });

        return res.status(201).json({
            success: true,
            message: "Goal created successfully",
            goal,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create goal",
            error: error.message,
        });
    }
};

const getGoalsByUser = async (req, res) => {
    try {
        const { email } = req.params;
        const today = getTodayDate();

        const goals = await Goal.find({ userEmail: email }).sort({ createdAt: -1 });

        for (const goal of goals) {
            const currentPeriodKey = getPeriodKey(today, goal.targetType);

            if (goal.periodKey !== currentPeriodKey) {
                goal.currentValue = 0;
                goal.status = "active";
                goal.periodKey = currentPeriodKey;
                goal.lastUpdatedDate = today;
                await goal.save();
            }
        }

        return res.status(200).json({
            success: true,
            goals,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch goals",
            error: error.message,
        });
    }
};

const updateGoalProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentValue } = req.body;

        const goal = await Goal.findById(id);

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: "Goal not found",
            });
        }

        if (goal.category === "prayer" || goal.category === "fasting") {
            return res.status(400).json({
                success: false,
                message: "Prayer and fasting goals update automatically from trackers",
            });
        }

        goal.currentValue = Number(currentValue);
        goal.status = goal.currentValue >= goal.targetValue ? "completed" : "active";
        goal.lastUpdatedDate = getTodayDate();

        await goal.save();

        return res.status(200).json({
            success: true,
            message: "Goal progress updated successfully",
            goal,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update goal progress",
            error: error.message,
        });
    }
};

const deleteGoal = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedGoal = await Goal.findByIdAndDelete(id);

        if (!deletedGoal) {
            return res.status(404).json({
                success: false,
                message: "Goal not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Goal deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete goal",
            error: error.message,
        });
    }
};

module.exports = {
    createGoal,
    getGoalsByUser,
    updateGoalProgress,
    deleteGoal,
};