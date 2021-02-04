// Build express server
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const CORS = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Instance of express app
const app = express();

// db connection
mongoose
  .set("debug", true)
  .connect(process.env.DATABASE_CLOUD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const linkRoutes = require("./routes/link");
const storeRoutes = require("./routes/store");
const orderRoutes = require("./routes/order");
const productCategoryRoutes = require("./routes/productCategories");

// app middlewares
app.use(morgan("dev"));
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "5mb", type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(CORS());
// Only allow certain domains to access
app.use(CORS({ origin: process.env.CLIENT_URL }));

// Middleware, code running between backend and frontend
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", linkRoutes);
app.use("/api", storeRoutes);
app.use("/api", orderRoutes);
app.use("/api", productCategoryRoutes);

// Port
const port = process.env.PORT || 8000;

// Listen to port, callback prints message to console
app.listen(port, () => console.log(`API is running on port ${port}`));
