const mongoose = require("mongoose");

const ibaadatScoreSchema = new mongoose.Schema(
    {
        userEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        date: {
            type: String,
            required: true,
        },
        prayerScore: {
            type: Number,
            default: 0,
        },
        fastingScore: {
            type: Number,
            default: 0,
        },
        goalScore: {
            type: Number,
            default: 0,
        },
        totalScore: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

ibaadatScoreSchema.index({ userEmail: 1, date: 1 }, { unique: true });

const IbaadatScore = mongoose.model("IbaadatScore", ibaadatScoreSchema);

module.exports = IbaadatScore;