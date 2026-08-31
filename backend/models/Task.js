const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    assignedTo: String,
    role: String,
    domain: {
        type: String,
        default: "General"
    },
    clubName: {
        type: String,
        default: "Coding Club"
    },
    eventName: {
        type: String,
        default: "General Operations"
    },
    createdBy: String,
    createdByRole: String,
    status: {
        type: String,
        default: "Pending"
    },
    deadline: Date
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);
