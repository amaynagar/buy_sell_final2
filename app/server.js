const config = require("../config/env");
const { connectDatabase, closeDatabase } = require("../config/database");
const createApp = require("./app");

const app = createApp();

async function startServer() {
  try {
    await connectDatabase(config.mongoUri);

    const server = app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });

    const shutdown = async () => {
      console.log("Shutting down server...");
      server.close(async () => {
        await closeDatabase();
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = {
  app,
  startServer
};
