// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chalk from "chalk";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// Load environment variables
dotenv.config({ silent: true });

const app = express();
const port = process.env.PORT || 8000;

// Connect to MongoDB and Cloudinary
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());



app.use(cors());

// Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);



// Start server
app.listen(port, () => {
  console.log(
    chalk.bgGreen.black.bold(" Server running:") +
    ` ${chalk.cyan(`http://localhost:${port}`)}`
  );
});
