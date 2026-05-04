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
            enum: ["general", "prayer", "fasting", "quran", "charity"],
            default: "general",
        },
        targetType: {
            type: String,
            enum: ["daily", "weekly", "monthly"],
            default: "daily",
        },
        targetValue: {
            type: Number,
            required: true,
            min: 1,
        },
        currentValue: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["active", "completed"],
            default: "active",
        },
        periodKey: {
            type: String,
            default: "",
        },
        lastUpdatedDate: {
            type: String,
            default: () => new Date().toISOString().split("T")[0],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);