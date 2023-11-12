import express from "express"
import AuthController from "./auth.controller.js";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";

const authRouter = express.Router();

/**
 * /auth/sign-up
 * @param { body: { firstname, lastname, email, username, password, confirmPassword }}
 * @param {*} req
 * @param {*} res
 */
authRouter.post("/auth/sign-up", AuthController.signUp);

/**
 ** /auth/sign-in
 * @param { body: { username, password }}
 * @returns { accessToken: jwt }
 */
authRouter.post("/auth/sign-in", AuthController.signIn);

/**
 * /auth/send-confirm-email
 * @returns { message: "Email sent" }
 */
authRouter.post("/auth/send-confirm-email", AuthMiddleware, AuthController.sendConfirmEmail);

/**
 * /auth/confirm-email
 * @param { body: { emailValidationCode }}
 * @returns { accessToken: jwt }
 */
authRouter.post("/auth/confirm-email", AuthMiddleware, AuthController.confirmEmail);

/**
 * /auth/forgot-password
 * @param { body: { email } }
 * @returns { message: "We sent you an email to reset your password" }
 */
authRouter.post("/auth/forgot-password", AuthController.forgotPassword);

/**
 * /auth/reset-password
 * @param { body: { email, resetPasswordCode, password, confirmPassword } }
 * @returns { message: "Password reset" }
 */
authRouter.post("/auth/reset-password", AuthController.resetPassword);

authRouter.get("/auth/verify-token", AuthMiddleware, AuthController.verifyToken);

authRouter.get("/auth/preferences-set", AuthMiddleware, AuthController.preferencesSet);

export default authRouter;