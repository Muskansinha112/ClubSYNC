const mongoose = require("mongoose");

const ClubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        default: "Technical"
    },
    foundedDate: {
        type: Date,
        default: Date.now
    },
    createdByHost: {
        type: String,
        required: true
    },
    hostRole: {
        type: String,
        default: "Faculty Advisor"
    },
    description: String,
    memberCount: {
        type: Number,
        default: 15
    }
}, { timestamps: true });

module.exports = mongoose.model("Club", ClubSchema);
