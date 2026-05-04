const mongoose = require("mongoose");

const fastingLogSchema = new mongoose.Schema(
    {
        userEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        day: {
            type: Number,
            required: true,
            min: 1,
            max: 31,
        },
        date: {
            type: String,
            required: true,
        },
        monthKey: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["completed", "missed", "excused", ""],
            default: "",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("FastingLog", fastingLogSchema);