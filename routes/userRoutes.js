import express from "express";
const router = express.Router();
import UserController from "../controllers/userController.js";
import authenticateUser from "../middlewares/auth-middleware.js";

//Public Routes
router.post("/register", UserController.userRegistration);
router.post("/login", UserController.userLogin);

//Protected Routes
router.post(
  "/changepassword",
  authenticateUser,
  UserController.userChangePassword
);
router.get("/profile", authenticateUser, UserController.userProfile);

export default router;
