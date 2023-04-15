import express from "express"
import AuthController from "./auth.controller.js";

const authRouter = express.Router();

const exempleMiddleware = (req, res, next) => {
    // console.log("authRouter -> exempleMiddleware");
    return next();
}

authRouter.post("/auth/sign-up", exempleMiddleware, AuthController.signUp);
authRouter.post("/auth/sign-in", exempleMiddleware, AuthController.signIn);

authRouter.post("/auth/send-confirm-email", exempleMiddleware, AuthController.sendConfirmEmail);
authRouter.post("/auth/confirm-email", exempleMiddleware, AuthController.confirmEmail);

authRouter.post("/auth/forgot-password", exempleMiddleware, AuthController.forgotPassword);
authRouter.post("/auth/reset-password", exempleMiddleware, AuthController.resetPassword);

export default authRouter;