const path = require("path");
const dotenv = require("dotenv");

const envFile = process.env.ENV_FILE || path.resolve(process.cwd(), ".env");
dotenv.config({ path: envFile });

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGO_URI || ""
};

module.exports = config;
