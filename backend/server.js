require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const app = express();

const productRoutes = require("./routes/productRoutes");

// Middleware
app.use(express.json());

// Product routes
app.use("/products", productRoutes);

const PORT = 3000;

// Connect to MongoDB
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("SmartFridge Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});