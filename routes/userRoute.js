import express from "express";
import {createUser,loginUser, getDashboardPage, getAllUsers,getAUser} from "../controllers/userController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/dashboard").get(authMiddleware.authenticateToken, getDashboardPage);
router.route("/").get(authMiddleware.authenticateToken, getAllUsers);
router.route("/:id").get( authMiddleware.authenticateToken,getAUser);

export default router;