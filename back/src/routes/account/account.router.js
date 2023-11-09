import express from "express"
import AccountController from "./account.controller.js";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import FileService from "../../services/file.service.js";

const accountRouter = express.Router();

/**
 * POST to update the account data
 * @param {
 * 		body: { firstname, lastname, email: String(Regex.email) },
 * }
 * Return the new session data info
 */
accountRouter.post(
	"/account/edit-account",
	AuthMiddleware,
	AccountController.editAccount
);

/**
 * Update the genders of the user
 * @param { body: { birthGender, currGender } }
 */
accountRouter.post(
	"/account/upsert-gender",
	AuthMiddleware,
	AccountController.upsertGender
);

/**
 * Update the sexual orientation of the user
 * @param { body: { sexualOrient } }
 */
accountRouter.post(
	"/account/upsert-sexual-orient",
	AuthMiddleware,
	AccountController.upsertSexualOrient
);

/**
 * Update the bio of the user
 * @param { body: { bio } }
 */
accountRouter.post(
	"/account/upsert-bio",
	AuthMiddleware,
	AccountController.upsertBio
);

/**
 * Update the interests tags of the user
 * @param { body: { tags: ["tag1", ...] } } 
 */
accountRouter.post(
	"/account/upsert-tags",
	AuthMiddleware,
	AccountController.upsertInterestTags
);

/**
 * Delete the picture of the user
 * @param { params: { id } }
 */
accountRouter.delete(
	"/account/delete-picture/:id",
	AuthMiddleware,
	AccountController.deletePicture
);

/**
 * Route to add one picture to the user
 * @param req.files.picture
 */
accountRouter.post(
	"/account/add-picture",
	AuthMiddleware,
	// FileService.uploadFileMiddleWare.single('file'),
	AccountController.addPicture
);

/**
 * Get the session data info of myself
 */
accountRouter.get(
	"/account/myself",
	AuthMiddleware,
	AccountController.getMyself
);

/**
 * Get the session data info of an user by his id
 * @param { params: { id }}
 */
accountRouter.get(
	"/account/user/:id",
	AuthMiddleware,
	AccountController.getUserById
);

/**
 * Get the views of the user
 */
accountRouter.get(
	"/account/my-views",
	AuthMiddleware,
	AccountController.getMyViews
);

/**
 * Get the likes of the user
 */
accountRouter.get(
	"/account/my-likes",
	AuthMiddleware,
	AccountController.getMyLikes
);


export default accountRouter;