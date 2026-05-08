process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "ramadan_serenity_test_secret";

const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../server");
const PrayerLog = require("../models/PrayerLog");
const Goal = require("../models/Goal");

jest.setTimeout(30000);

let mongoServer;
let authToken;
let otherUserToken;

const testEmail = "samin.prayer.test@example.com";
const otherEmail = "another.user@example.com";

const allPrayersCompleted = {
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
};

describe("Feature: Prayer Tracker (ID: 23101357)", () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());

        authToken = jwt.sign(
            {
                email: testEmail,
                name: "Samin Prayer Test User",
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        otherUserToken = jwt.sign(
            {
                email: otherEmail,
                name: "Another Test User",
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
    });

    afterEach(async () => {
        await PrayerLog.deleteMany({});
        await Goal.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    it("should save a prayer log successfully with authorization token", async () => {
        const res = await request(app)
            .post("/api/prayer-log")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                userEmail: testEmail,
                date: "2026-03-01",
                prayers: allPrayersCompleted,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Prayer log saved successfully");
        expect(res.body.log).toHaveProperty("_id");
        expect(res.body.log.userEmail).toBe(testEmail);
        expect(res.body.log.date).toBe("2026-03-01");
        expect(res.body.log.prayers.fajr).toBe(true);
        expect(res.body.log.prayers.isha).toBe(true);
    });

    it("should retrieve a prayer log by email and date with authorization token", async () => {
        await request(app)
            .post("/api/prayer-log")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                userEmail: testEmail,
                date: "2026-03-02",
                prayers: {
                    fajr: true,
                    dhuhr: false,
                    asr: true,
                    maghrib: false,
                    isha: true,
                },
            });

        const res = await request(app)
            .get(`/api/prayer-log/${testEmail}/2026-03-02`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.log).toHaveProperty("_id");
        expect(res.body.log.userEmail).toBe(testEmail);
        expect(res.body.log.date).toBe("2026-03-02");
        expect(res.body.log.prayers.fajr).toBe(true);
        expect(res.body.log.prayers.dhuhr).toBe(false);
    });

    it("should return 400 when required fields are missing", async () => {
        const res = await request(app)
            .post("/api/prayer-log")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                userEmail: testEmail,
                date: "2026-03-03",
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("userEmail, date, and prayers are required");
    });

    it("should return 404 when prayer log does not exist for the selected date", async () => {
        const res = await request(app)
            .get(`/api/prayer-log/${testEmail}/2026-03-10`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Prayer log not found");
    });

    it("should calculate prayer consistency correctly", async () => {
        await request(app)
            .post("/api/prayer-log")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                userEmail: testEmail,
                date: "2026-03-01",
                prayers: allPrayersCompleted,
            });

        await request(app)
            .post("/api/prayer-log")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                userEmail: testEmail,
                date: "2026-03-02",
                prayers: allPrayersCompleted,
            });

        const res = await request(app)
            .get(`/api/prayer-log/consistency/${testEmail}`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.consistency.totalDays).toBe(2);
        expect(res.body.consistency.totalCompletedPrayers).toBe(10);
        expect(res.body.consistency.perfectDays).toBe(2);
        expect(res.body.consistency.currentStreak).toBe(2);
        expect(res.body.consistency.maxStreak).toBe(2);
    });

    it("should get all prayer logs for a user", async () => {
        await request(app)
            .post("/api/prayer-log")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                userEmail: testEmail,
                date: "2026-03-01",
                prayers: allPrayersCompleted,
            });

        await request(app)
            .post("/api/prayer-log")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                userEmail: testEmail,
                date: "2026-03-02",
                prayers: {
                    fajr: true,
                    dhuhr: false,
                    asr: true,
                    maghrib: false,
                    isha: true,
                },
            });

        const res = await request(app)
            .get(`/api/prayer-log/all/${testEmail}`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.logs.length).toBe(2);
        expect(res.body.logs[0].date).toBe("2026-03-01");
        expect(res.body.logs[1].date).toBe("2026-03-02");
    });

    it("should return 401 when saving prayer log without authorization token", async () => {
        const res = await request(app)
            .post("/api/prayer-log")
            .send({
                userEmail: testEmail,
                date: "2026-03-06",
                prayers: allPrayersCompleted,
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Unauthorized: No token provided");
    });

    it("should return 401 when authorization token is invalid", async () => {
        const res = await request(app)
            .post("/api/prayer-log")
            .set("Authorization", "Bearer invalid-token")
            .send({
                userEmail: testEmail,
                date: "2026-03-07",
                prayers: allPrayersCompleted,
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Unauthorized: Invalid token");
    });

    it("should return 403 when user tries to access another user's prayer log", async () => {
        await request(app)
            .post("/api/prayer-log")
            .set("Authorization", `Bearer ${otherUserToken}`)
            .send({
                userEmail: otherEmail,
                date: "2026-03-08",
                prayers: allPrayersCompleted,
            });

        const res = await request(app)
            .get(`/api/prayer-log/${otherEmail}/2026-03-08`)
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe(
            "Forbidden: You can only access your own prayer logs"
        );
    });
});