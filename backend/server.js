require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");


const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const consumptionRoutes = require("./routes/consumptionRoutes");
const lossRoutes = require("./routes/lossRoutes");
const {checkExpiringProducts,} = require("./jobs/expirationNotification");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SmartFridge Backend is running!");
});

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/consumptions", consumptionRoutes);
app.use("/api/losses", lossRoutes);

connectDB();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} (http://localhost:${PORT})`
  );

  // Vérifier les notifications au démarrage
  checkExpiringProducts();
});