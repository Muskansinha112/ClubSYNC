const express = require("express");
const router = express.Router();
const Club = require("../models/Club");

// GET all clubs
router.get("/", async (req, res) => {
    try {
        let clubs = await Club.find();
        
        // Seed default clubs if empty
        if (clubs.length === 0) {
            const defaultClubs = [
                {
                    name: "Coding Club",
                    category: "Technical",
                    foundedDate: new Date("2021-08-15"),
                    createdByHost: "Prof. Alan Turing",
                    hostRole: "Faculty Mentor",
                    description: "Hub for competitive programming, web development, and open-source contributions.",
                    memberCount: 45
                },
                {
                    name: "Robotics Society",
                    category: "Technical",
                    foundedDate: new Date("2020-03-10"),
                    createdByHost: "Dr. Eleanor Vance",
                    hostRole: "Head of Mechatronics",
                    description: "Designing autonomous robots, IoT hardware, and drone tech.",
                    memberCount: 30
                },
                {
                    name: "Cultural Society",
                    category: "Arts & Culture",
                    foundedDate: new Date("2019-11-01"),
                    createdByHost: "Sarah Jenkins",
                    hostRole: "Student Body Vice President",
                    description: "Organizing music, dance, theater, and campus cultural festivals.",
                    memberCount: 60
                }
            ];
            clubs = await Club.insertMany(defaultClubs);
        }

        res.json(clubs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create club
router.post("/", async (req, res) => {
    try {
        const newClub = new Club(req.body);
        const savedClub = await newClub.save();
        res.status(201).json(savedClub);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE club
router.delete("/:id", async (req, res) => {
    try {
        await Club.findByIdAndDelete(req.params.id);
        res.json({ message: "Club deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
