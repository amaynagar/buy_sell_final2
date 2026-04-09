const express = require("express");
const path = require("path");
const cors = require("cors");
const productRoutes = require("./routes/product.routes");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

function createCorsOptions() {
  const allowedOrigin = "https://buy-sell-frontend-kw9k.onrender.com";

  return {
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, curl, mobile apps)
      if (!origin) return callback(null, true);

      // Allow in development OR if origin matches frontend
      if (
        process.env.NODE_ENV !== "production" ||
        origin === allowedOrigin
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 200
  };
}

function createApp() {
  const app = express();
  const corsOptions = createCorsOptions();

  // CORS MUST BE FIRST
  app.use(cors(corsOptions));

  // Handle preflight properly
  app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(process.cwd(), "public")));

  app.get("/", (req, res) => {
    res.send("Buy Sell API running");
  });

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api/products", productRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
