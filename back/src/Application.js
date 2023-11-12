/* Modules */
import express from "express";
import bodyparser from "body-parser";
import fileUpload from "express-fileupload";

import Config from "./Config.js";

/* Models */
import SQLib from "./SQLib.js";
import UserSchema from "./models/user.model.js";
import LikeSchema from "./models/like.model.js";
import TagSchema, { TagList } from "./models/tag.model.js";
import TagUserSchema from "./models/tag_user.model.js";
import MessageSchema from "./models/message.model.js";
import NotifSchema from "./models/notif.model.js";
import BlocklistSchema from "./models/blocklist.model.js";
import RoomSchema from "./models/room.model.js";
import ViewSchema from "./models/view.model.js";
import PictureSchema from "./models/picture.model.js";

/* Routes */
import authRouter from "./routes/auth/auth.router.js";
import countryRouter from "./routes/country/country.router.js";
import accountRouter from "./routes/account/account.router.js";
import fileRouter from "./routes/files/file.router.js";
import adminRouter from "./routes/admin/admin.router.js";

/* Services */
import FakerService from "./services/faker.service.js";

class Application {
	constructor() {
		this.app = express();
		this.initDatabase();
		this.initMiddlewares();
		this.initRoutes();
	}

	async initDatabase() {
		this.db = new SQLib();
		await this.db.connectDB();
		/* Create Models */
		await this.db.defineModel("USER", UserSchema.schema);
		await this.db.defineModel("TAG", TagSchema.schema);
		await this.db.defineModel("TAG_USER", TagUserSchema.schema);
		await this.db.defineModel("NOTIF", NotifSchema.schema);
		await this.db.defineModel("BLOCKLIST", BlocklistSchema.schema);
		await this.db.defineModel("ROOM", RoomSchema.schema);
		await this.db.defineModel("MESSAGE", MessageSchema.schema);
		await this.db.defineModel("LIKES", LikeSchema.schema);
		await this.db.defineModel("VIEW", ViewSchema.schema);
		await this.db.defineModel("PICTURE", PictureSchema.schema);

		// Insert static tags in db if not already there
		for (const tag of TagList) {
			const tagInDb = await this.db.findOne("TAG", { content: tag });
			if (!tagInDb)
				await this.db.insert("TAG", { content: tag });
		}
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
		this.app.use(countryRouter);
		this.app.use(accountRouter);
		this.app.use(fileRouter);
		this.app.use(adminRouter);
		this.app.use("*", (req, res) => res.status(404).send());
	}

	async start() {
		return new Promise(resolve => {
			this.server = this.app.listen(Config.port, () => {
				console.info(`Matcha server listening on port ${Config.port}`);
				resolve();
			});
		});
	}

	async stop() {
		return new Promise(resolve => {
			this.server.close(() => resolve());
		});
	}
}

export default new Application();
