/* Modules */
import express from "express";
import bodyparser from "body-parser";
import fileUpload from "express-fileupload";

import Config from "./Config.js";
import Database from "./Database.js"
import { AuthMiddleware } from "./middlewares/auth.js";

/* Routes */
import AuthRouter from "./routes/auth/auth.router.js";
import fakerRouter from "./routes/faker/faker.router.js";

class Application {
	constructor() {
		this.app = express();
		// this.db = new Database();
		this.initMiddlewares();
		this.initRoutes();
	}

	initMiddlewares() {
		this.app.use(bodyparser.urlencoded({ extended: false }));
		this.app.use(bodyparser.json());
		this.app.use(fileUpload({
			limits: { fileSize: 50 * 1024 * 1024 },
		}));
		this.app.use(AuthMiddleware);
	}

	initRoutes() {
		this.app.use(AuthRouter);
		this.app.use(fakerRouter);
		this.app.use("*", (req, res) => res.status(404).send());
	}

	start() {
		this.server = this.app.listen(Config.PORT, () => {
			console.info(`Matcha server listening on port ${Config.PORT}`);
		});
	}
}

export default new Application();
