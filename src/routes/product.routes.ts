import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// Apply authentication middleware to all product routes
router.use(authenticateToken);

// GET /products - Get all products
router.get("/", ProductController.getAllProducts);

// GET /products/:id - Get product by ID
router.get("/:id", ProductController.getProductById);

// POST /products - Create new product
router.post("/", ProductController.createProduct);

// PUT /products/:id - Update product
router.put("/:id", ProductController.updateProduct);

// DELETE /products/:id - Delete product
router.delete("/:id", ProductController.deleteProduct);

export default router;
