const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    clubName: {
        type: String,
        required: true
    },
    eventDate: Date,
    location: {
        type: String,
        default: "Main Campus Auditorium"
    },
    coordinator: String,
    description: String
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);
