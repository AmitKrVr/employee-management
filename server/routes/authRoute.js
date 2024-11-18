import express from "express";
import {
  register,
  login,
  userStatus,
  logout,
} from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/status", userStatus);
router.post("/logout", logout);

export default router;
