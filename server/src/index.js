require("dotenv").config();

const app = require("./app");
const { connectDatabase } = require("./models");

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

async function startServer() {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not set");
    }

    await connectDatabase();

    const server = app.listen(PORT, HOST, () => {
      console.log(`Server started on http://${HOST}:${PORT}`);
    });

    server.on("error", (error) => {
      console.error("Failed to start server:", error.message);
      process.exit(1);
    });
  } catch (error) {
    console.error("Startup error:", error.message);
    process.exit(1);
  }
}

startServer();
