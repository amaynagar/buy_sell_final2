const express = require("express");
const path = require("path");
const cors = require("cors");
const productRoutes = require("./routes/product.routes");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const frontendOrigin = "https://buy-sell-frontend-kw9k.onrender.com";

function createCorsOptions() {
  if (process.env.NODE_ENV !== "production") {
    return {
      origin: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true
    };
  }

  return {
    origin: (origin, callback) => {
      if (!origin || origin === frontendOrigin) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  };
}

function createApp() {
  const app = express();
  const corsOptions = createCorsOptions();

  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));
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
