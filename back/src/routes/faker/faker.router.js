import express from "express";
import fakerController from "faker.controller.js";

const fakerRouter = express.Router();

fakerRouter.get("faker/truncate", fakerController.truncate);
fakerRouter.get("faker/populate/:nb", fakerController.populate);

export default fakerRouter;