const express = require("express");
const {
    createGoal,
    getGoalsByUser,
    updateGoalProgress,
    deleteGoal,
} = require("../controllers/GoalController");

const router = express.Router();

router.post("/", createGoal);
router.get("/:email", getGoalsByUser);
router.patch("/:id", updateGoalProgress);
router.delete("/:id", deleteGoal);

module.exports = router;