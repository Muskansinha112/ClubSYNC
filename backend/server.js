const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect database
mongoose.connect("mongodb://127.0.0.1:27017/taskmanager")
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

app.use("/api/tasks", (req, res, next) => {
    console.log("🔥 /api/tasks route accessed");
    next();
}, taskRoutes);
// start server
app.listen(7000, () => {
    console.log("Server running on port 7000");
});