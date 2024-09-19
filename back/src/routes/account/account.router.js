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
 * @param { body: { lng, lat } }
 */
accountRouter.post(
	"/account/location",
	AuthMiddleware,
	AccountController.upsertLocation
);

/**
 * Get the preferences of the user
 * @returns { body: { gender, wantToMeet } }
 */
accountRouter.get(
	"/account/preferences",
	AuthMiddleware,
	AccountController.getPreferences
);

/**
 * Update the preferences of the user
 * @param { body: { gender, wantToMeet } }
 */
accountRouter.post(
	"/account/upsert-preferences",
	AuthMiddleware,
	AccountController.upsertPreferences
);

/**
 * Get the bio of the user
 * @returns { body: { bio } }
 */
accountRouter.get(
	"/account/biography",
	AuthMiddleware,
	AccountController.getBio
);

/**
 * Update the bio of the user
 * @param { body: { bio } }
 */
accountRouter.post(
	"/account/upsert-biography",
	AuthMiddleware,
	AccountController.upsertBio
);

/**
 * Get all tags in the db
 * @returns { body: { tags: [] } } 
 */
accountRouter.get(
	"/account/all-tags",
	AuthMiddleware,
	AccountController.getAllTags
);

/**
 * Get the interests tags of the user
 * @param { body: { tags: ["tag1", ...] } } 
 */
accountRouter.get(
	"/account/interest-tags",
	AuthMiddleware,
	AccountController.getInterestTags
);

/**
 * Update the interests tags of the user
 * @param { body: { tags: ["tag1", ...] } } 
 */
accountRouter.post(
	"/account/upsert-interest-tags",
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