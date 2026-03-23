const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const resultsRoutes = require("./routes/results.routes");

const app = express();

const rawClientUrl = process.env.CLIENT_URL || "";
const clientUrl = rawClientUrl.replace(/\/$/, "");

const allowedOrigins = [
  clientUrl,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // allow same-origin or non-browser requests
      if (!origin) return callback(null, true);

      // Normalize origin (strip trailing slash) before checking
      const normOrigin = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(normOrigin)) return callback(null, true);

      return callback(new Error("CORS error: origin not allowed"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/results", resultsRoutes);

module.exports = app;
