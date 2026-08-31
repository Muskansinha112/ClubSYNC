const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require('dotenv').config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

console.log("URI:", process.env.MONGO_URI);

// connect database
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));




// test route
app.get("/", (req, res) => {
    res.send("API is running");
});
app.get("/test", (req, res) => {
    console.log("TEST ROUTE HIT");
    res.send("Test working");
});

const taskRoutes = require("./routes/taskRoutes");
const clubRoutes = require("./routes/clubRoutes");
const eventRoutes = require("./routes/eventRoutes");

app.use("/api/tasks", taskRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/events", eventRoutes);
// start server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});