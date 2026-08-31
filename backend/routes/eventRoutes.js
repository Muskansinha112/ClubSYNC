const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// GET all events
router.get("/", async (req, res) => {
    try {
        let events = await Event.find();
        
        // Seed default events if empty
        if (events.length === 0) {
            const defaultEvents = [
                {
                    eventName: "Hackathon 2026",
                    clubName: "Coding Club",
                    eventDate: new Date("2026-09-15"),
                    location: "Tech Park Auditorium",
                    coordinator: "Alex Johnson",
                    description: "24-hour campus hackathon with 500+ participants."
                },
                {
                    eventName: "Bot Wars 2.0",
                    clubName: "Robotics Society",
                    eventDate: new Date("2026-10-05"),
                    location: "Sports Complex",
                    coordinator: "David Miller",
                    description: "Combat robotics championship and obstacle navigation contest."
                },
                {
                    eventName: "Annual Cultural Fest",
                    clubName: "Cultural Society",
                    eventDate: new Date("2026-11-20"),
                    location: "Main Open Amphitheater",
                    coordinator: "Sophia Reed",
                    description: "3-day mega festival with music, dance, and drama performances."
                }
            ];
            events = await Event.insertMany(defaultEvents);
        }

        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create event
router.post("/", async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE event
router.delete("/:id", async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: "Event deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
