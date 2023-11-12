import express from "express"
import AdminController from "./admin.controller.js";

const adminRouter = express.Router();

/**
 * Populate the database with fake data users
 * @param { params: { adminkey, number } }
 */
adminRouter.get(
	"/admin/populate/:adminkey/:number",
	AdminController.populate
);

/**
 * Truncate all generated fake users
 * @param { params: { adminkey } }
 */
adminRouter.get(
	"/admin/truncate/:adminkey",
	AdminController.truncate
);

export default adminRouter;