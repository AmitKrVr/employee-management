import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  toggleEmployeeStatus,
} from "../controllers/employeeController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route("/")
  .post(upload.single("image"), createEmployee)
  .get(getAllEmployees);

router
  .route("/:id")
  .get(getEmployee)
  .put(upload.single("image"), updateEmployee)
  .delete(deleteEmployee);

router.patch("/:id/toggle-status", toggleEmployeeStatus);

export default router;
