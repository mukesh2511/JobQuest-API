import express from "express";
import { deleteUser, getUser } from "../controllers/user.controller.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/:id", getUser);

export default router;
