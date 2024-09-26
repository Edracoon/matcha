import express from "express"
import SearchController from "./search.controller.js";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";

const searchRouter = express.Router();

searchRouter.get("/getAccordingUser", AuthMiddleware, SearchController.getAccordingUser);

export default searchRouter;