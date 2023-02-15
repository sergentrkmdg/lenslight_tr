import express from "express";
import {createUser,loginUser, getDashboardPage, getAllUsers,getAUser,follow,unfollow} from "../controllers/userController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/dashboard").get(authMiddleware.authenticateToken, getDashboardPage);
router.route("/").get(authMiddleware.authenticateToken, getAllUsers);
router.route("/:id").get( authMiddleware.authenticateToken,getAUser);
router.route("/:id/follow").put(authMiddleware.authenticateToken,follow);
router.route("/:id/unfollow").put(authMiddleware.authenticateToken,unfollow);

export default router;