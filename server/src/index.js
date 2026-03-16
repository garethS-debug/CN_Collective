require("dotenv").config();

const app = require("./app");
const { initDb } = require("./db");

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "127.0.0.1";

async function startServer() {
  try {
    await initDb();

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
