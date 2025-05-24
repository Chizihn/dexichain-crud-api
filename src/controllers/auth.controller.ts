import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { IUserLogin, IUserRegister } from "../interfaces/user.interface";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../utils/validation";
import { config } from "../config/app.config";

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password }: IUserRegister = req.body;

      // Validation
      if (!username || !email || !password) {
        res
          .status(400)
          .json({ message: "Username, email, and password are required" });
        return;
      }

      if (!validateUsername(username)) {
        res
          .status(400)
          .json({ message: "Username must be between 3 and 30 characters" });
        return;
      }

      if (!validateEmail(email)) {
        res.status(400).json({ message: "Please enter a valid email address" });
        return;
      }

      if (!validatePassword(password)) {
        res
          .status(400)
          .json({ message: "Password must be at least 6 characters long" });
        return;
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        res
          .status(409)
          .json({ message: "User with this email or username already exists" });
        return;
      }

      // Create new user
      const user = new User({ username, email, password });
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        config.jwtSecret,
        { expiresIn: "7d" }
      );

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: IUserLogin = req.body;

      // Validation
      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        config.jwtSecret,
        { expiresIn: "7d" }
      );

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
