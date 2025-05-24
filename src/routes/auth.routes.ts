import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

// POST /auth/register
router.post("/register", AuthController.register);

// POST /auth/login
router.post("/login", AuthController.login);

export default router;
