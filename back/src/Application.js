/* Modules */
import express from "express";
import bodyparser from "body-parser";
import fileUpload from "express-fileupload";

import Config from "./Config.js";
import { AuthMiddleware } from "./middlewares/auth.middleware.js";

/* Models */
import SQLib from "./SQLib.js";
import UserSchema from "./models/user.model.js";
import LikeSchema from "./models/like.model.js";
import TagSchema from "./models/tag.model.js";

/* Routes */
import authRouter from "./routes/auth/auth.router.js";
import fakerRouter from "./routes/faker/faker.router.js";
import countryRouter from "./routes/country/country.router.js";

/* Services */
import MailService from "./services/mail.service.js";

export default class Application {
	constructor() {
		this.app = express();
		this.MailService = new MailService();
		this.initDatabase();
		this.initMiddlewares();
		this.initRoutes();
	}

	async initDatabase() {
		this.db = new SQLib();
		await this.db.connectDB();
		/* Create Models */
		this.db.defineModel("USER", UserSchema.schema);
		this.db.defineModel("LIKE", LikeSchema.schema);
		this.db.defineModel("TAG", TagSchema.schema);
	}

	initMiddlewares() {
		this.app.use(bodyparser.json()); // https://github.com/expressjs/body-parser#bodyparserjsonoptions
		this.app.use(bodyparser.urlencoded({ extended: true }));
		// Authorize CORS
		this.app.use((req, res, next) => {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
			res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
			next();
		});
		this.app.use(fileUpload({
			limits: { fileSize: 50 * 1024 * 1024 },
		}));
	}

	initRoutes() {
		this.app.use(authRouter);
		this.app.use(fakerRouter);
		this.app.use(countryRouter);
		this.app.use("*", (req, res) => res.status(404).send());
	}

	start() {
		this.server = this.app.listen(Config.PORT, () => {
			console.info(`Matcha server listening on port ${Config.port}`);
		});
	}
}
