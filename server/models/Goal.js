const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
    {
        userEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        category: {
            type: String,
            default: "general",
            trim: true,
        },
        targetType: {
            type: String,
            enum: ["daily", "weekly", "monthly"],
            default: "daily",
        },
        goalMode: {
            type: String,
            enum: ["progress", "streak"],
            default: "progress",
        },
        targetValue: {
            type: Number,
            required: true,
            min: 1,
        },
        currentValue: {
            type: Number,
            default: 0,
            min: 0,
        },
        status: {
            type: String,
            enum: ["active", "completed"],
            default: "active",
        },
        lastUpdatedDate: {
            type: String,
            default: () => new Date().toISOString().split("T")[0],
        },
        streakCount: {
            type: Number,
            default: 0,
        },
        bestStreak: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Goal = mongoose.model("Goal", goalSchema);

module.exports = Goal;