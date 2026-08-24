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
    createdBy: String,
    createdByRole: String,
    status: {
        type: String,
        default: "Pending"
    },
    deadline: Date
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);
