import { Response } from "express";
import Product from "../models/product.model";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  IProductCreate,
  IProductUpdate,
} from "../interfaces/product.interface";

export class ProductController {
  // GET /products - Get all products
  static async getAllProducts(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const products = await Product.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Product.countDocuments();

      res.status(200).json({
        message: "Products retrieved successfully",
        data: products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
        },
      });
    } catch (error: any) {
      console.error("Get products error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET /products/:id - Get product by ID
  static async getProductById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const product = await Product.findById(id);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      res.status(200).json({
        message: "Product retrieved successfully",
        data: product,
      });
    } catch (error: any) {
      console.error("Get product error:", error);
      if (error.name === "CastError") {
        res.status(400).json({ message: "Invalid product ID format" });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // POST /products - Create new product
  static async createProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, description, price, category, stock }: IProductCreate =
        req.body;

      // Validation
      if (
        !name ||
        !description ||
        price === undefined ||
        !category ||
        stock === undefined
      ) {
        res.status(400).json({
          message: "Name, description, price, category, and stock are required",
        });
        return;
      }

      if (price < 0) {
        res.status(400).json({ message: "Price cannot be negative" });
        return;
      }

      if (stock < 0) {
        res.status(400).json({ message: "Stock cannot be negative" });
        return;
      }

      const product = new Product({
        name,
        description,
        price,
        category,
        stock,
      });
      await product.save();

      res.status(201).json({
        message: "Product created successfully",
        data: product,
      });
    } catch (error: any) {
      console.error("Create product error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // PUT /products/:id - Update product
  static async updateProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: IProductUpdate = req.body;

      // Validation
      if (updateData.price !== undefined && updateData.price < 0) {
        res.status(400).json({ message: "Price cannot be negative" });
        return;
      }

      if (updateData.stock !== undefined && updateData.stock < 0) {
        res.status(400).json({ message: "Stock cannot be negative" });
        return;
      }

      const product = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      res.status(200).json({
        message: "Product updated successfully",
        data: product,
      });
    } catch (error: any) {
      console.error("Update product error:", error);
      if (error.name === "CastError") {
        res.status(400).json({ message: "Invalid product ID format" });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // DELETE /products/:id - Delete product
  static async deleteProduct(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      res.status(200).json({
        message: "Product deleted successfully",
        data: product,
      });
    } catch (error: any) {
      console.error("Delete product error:", error);
      if (error.name === "CastError") {
        res.status(400).json({ message: "Invalid product ID format" });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
