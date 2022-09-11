import express from "express"
import AuthController from "./auth.controller.js";

const AuthRouter = express.Router();
let exempleMiddleware = (req, res, next) => next();

AuthRouter.post("/auth/sign-up", exempleMiddleware, AuthController.signUp);
AuthRouter.post("/auth/sign-in", exempleMiddleware, AuthController.signIn);

AuthRouter.post("/auth/send-confirm-email", exempleMiddleware, AuthController.sendConfirmEmail);
AuthRouter.post("/auth/confirm-email", exempleMiddleware, AuthController.confirmEmail);

AuthRouter.post("/auth/forgot-password", exempleMiddleware, AuthController.forgotPassword);
AuthRouter.post("/auth/reset-password", exempleMiddleware, AuthController.resetPassword);

export default AuthRouter;