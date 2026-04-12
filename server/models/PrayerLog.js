const mongoose = require("mongoose");

const prayerLogSchema = new mongoose.Schema(
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
        prayers: {
            fajr: {
                type: Boolean,
                default: false,
            },
            dhuhr: {
                type: Boolean,
                default: false,
            },
            asr: {
                type: Boolean,
                default: false,
            },
            maghrib: {
                type: Boolean,
                default: false,
            },
            isha: {
                type: Boolean,
                default: false,
            },
        },
    },
    {
        timestamps: true,
    }
);

prayerLogSchema.index({ userEmail: 1, date: 1 }, { unique: true });

const PrayerLog = mongoose.model("PrayerLog", prayerLogSchema);

module.exports = PrayerLog;