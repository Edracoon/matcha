import express from "express"
import FileController from "./file.controller.js";

const fileRouter = express.Router();

fileRouter.get("/file/:uid", FileController.getFile);

export default fileRouter;