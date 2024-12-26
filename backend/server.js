require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const pickerRoutes = require("./routes/pickerRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const port = process.env.APP_PORT || 5000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/picker", pickerRoutes);
app.use("/api/user", userRoutes);

// connect to DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, function () {
      console.log(`Connected to DB and Server listening on port ${port}`);
    });
  })
  .catch((err) => console.log(err));

console.log("This is the backend server");
