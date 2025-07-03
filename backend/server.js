const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

require("dotenv").config({ path: "../.env" });   // loads .env file

const app = express();
app.use(cors());
app.use(bodyParser.json());

// import routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000; // use port 5000 if not specified
const MONGO_URI = process.env.MONGO_URI; // read the Mongo URI from .env

// connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});