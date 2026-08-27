require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const app = express();

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

// Middleware
app.use(express.json());

// Product routes
app.use("/products", productRoutes);

// auth routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("SmartFridge Backend is running!");
});

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 3000;
  return app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Server startup error:", error.message);
    process.exit(1);
  });
}

module.exports = { app, startServer };
