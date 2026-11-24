import express from "express";
import {
    registerUser,
    loginUser,
    getUserById,
    getUserResumes,
    forgotPassword,
    resetPassword,
    verifyResetToken
} from "../controllers/userController.js";

import protect from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/signup", registerUser);
userRouter.post("/login", loginUser);

userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);
userRouter.get("/verify-reset-token/:token", verifyResetToken);

userRouter.get("/data", protect, getUserById);
userRouter.get("/resumes", protect, getUserResumes);

export default userRouter;
