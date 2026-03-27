const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// GET all tasks
router.get("/", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// POST create task
router.post("/", async (req, res) => {
    console.log(req.body);
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.json(savedTask);
});
router.put("/:id", async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(updatedTask);
});
router.delete("/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
});
module.exports = router;