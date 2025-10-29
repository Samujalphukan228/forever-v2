import express from "express";
import {
  listProducts,
  addProducts,
  removeProducts,
  singleProducts,
  addReview,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const productRouter = express.Router();

// 🟢 Add product (Admin only)
productRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProducts
);

// 🟢 Remove product (Admin only)
productRouter.post("/remove", adminAuth, removeProducts);

// ✅ FIXED: Changed from POST to GET with URL parameter
productRouter.get("/single/:id", singleProducts);

// 🟢 List all products
productRouter.get("/list", listProducts);

// ✅ FIXED: Changed route from /add-review to /review to match frontend
productRouter.post("/review", authUser, addReview);

export default productRouter;