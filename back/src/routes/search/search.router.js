import express from "express"
import SearchController from "./search.controller.js";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";

const searchRouter = express.Router();

searchRouter.get("/getAccordingUser", AuthMiddleware, SearchController.getAccordingUser);


/**
 * /auth/sign-up
 * @param { body: { ageGap : {min: number, max: number}, fameGap : {min: number, max: number}, distanceGap : {min: number, max: number}, tags: [string] }}
 * @param {*} req
 * @param {*} res
 * Tested on Postman
 */
searchRouter.post("/search", AuthMiddleware, SearchController.GetUserWithFilter);

export default searchRouter;