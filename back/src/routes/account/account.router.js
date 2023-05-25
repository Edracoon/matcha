import express from "express"
import AccountController from "./account.controller.js";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";

const accountRouter = express.Router();

/**
 * POST to update the account data
 * @param {
 * 		body: { username: String, email: String(Regex.email), password: String },
 * 		files: { profilePicture: file }
 * }
 * Return the new session data info
 */
accountRouter.post("/account/edit", AuthMiddleware, AccountController.editAccount);

/**
 * Get the session data info of myself
 */
accountRouter.post("/account/myself", AuthMiddleware, AccountController.getMyself);

/**
* Get the session data info of an user by his id
*/
accountRouter.get("/account/user/:id", AuthMiddleware, AccountController.getUser);


export default accountRouter;