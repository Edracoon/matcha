import express from "express"
import AuthController from "./auth.controller.js";

const AuthRouter = express.Router();

AuthRouter.post("auth/sign-up", AuthController.signUp);
AuthRouter.post("auth/sign-in", AuthController.signIn);

AuthRouter.post("auth/send-confirm-email", AuthController.sendConfirmEmail);
AuthRouter.post("auth/confirm-email", AuthController.confirmEmail);

AuthRouter.post("auth/forgot-password", AuthController.forgotPassword);
AuthRouter.post("auth/reset-password", AuthController.resetPassword);

export default AuthRouter;