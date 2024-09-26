import express from "express"
import interactionsController from "./interactions.controller.js";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";

const interactionsRouter = express.Router();

/**
 * /auth/sign-up
 * @param { body: { type: string, receiverId: number }}
 * @param {*} req
 * @param {*} res
 * @returns { match: boolean }
 * Tested on Postman
 */
interactionsRouter.post('/like', AuthMiddleware, interactionsController.LikeInteraction);

/**
 * /auth/sign-up
 * @param { body: { receiverId: number }}
 * @param {*} req
 * @param {*} res
 * Tested on Postman
 */
interactionsRouter.post('/unlike', AuthMiddleware, interactionsController.UnlikeInteraction);


/**
 * /auth/sign-up
 * @param { body: { receiverId: number }}
 * @param {*} req
 * @param {*} res
 * Tested on Postman
 */
interactionsRouter.post('/view', AuthMiddleware, interactionsController.ViewInteraction);

/**
 * /auth/sign-up
 * @param { body: { receiverId: number }}
 * @param {*} req
 * @param {*} res
 * Tested on Postman
 */
interactionsRouter.post('/block', AuthMiddleware, interactionsController.BlockInteraction);


interactionsRouter.get('/getNotifs', AuthMiddleware, interactionsController.GetNotifs);

interactionsRouter.post('/report', AuthMiddleware, interactionsController.ReportUser);

interactionsRouter.get('/getMatches', AuthMiddleware, interactionsController.GetMatches);

export default interactionsRouter;