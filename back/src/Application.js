/* Modules */
import express from "express";
import bodyparser from "body-parser";
import fileUpload from "express-fileupload";
import Config from "./Config.js";
import http from 'http';
import { Server } from 'socket.io';

/* Models */
import SQLib from "./SQLib.js";
import UserSchema from "./models/user.model.js";
import LikeSchema from "./models/like.model.js";
import TagSchema, { TagList } from "./models/tag.model.js";
import TagUserSchema from "./models/tag_user.model.js";
import MessageSchema from "./models/message.model.js";
import NotifSchema from "./models/notif.model.js";
import BlocklistSchema from "./models/blocklist.model.js";
import ViewSchema from "./models/view.model.js";
import PictureSchema from "./models/picture.model.js";
import ReportSchema from "./models/report.model.js";
/* Routes */
import authRouter from "./routes/auth/auth.router.js";
import countryRouter from "./routes/country/country.router.js";
import accountRouter from "./routes/account/account.router.js";
import fileRouter from "./routes/files/file.router.js";
import adminRouter from "./routes/admin/admin.router.js";
import searchRouter from "./routes/search/search.router.js";
import interactionsRouter from "./routes/interactions/interactions.router.js";
/* Services */
import FakerService from "./services/faker.service.js";
import SocketService from "./services/socket.service.js"
import { log } from "console";

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
		await this.db.defineModel("MESSAGE", MessageSchema.schema);
		await this.db.defineModel("LIKES", LikeSchema.schema);
		await this.db.defineModel("VIEW", ViewSchema.schema);
		await this.db.defineModel("PICTURE", PictureSchema.schema);
        await this.db.defineModel("REPORT", ReportSchema.schema);
		// Insert static tags in db if not already there
		for (const tag of TagList) {
			const tagInDb = await this.db.findOne("TAG", { content: tag });
			if (!tagInDb)
				await this.db.insert("TAG", { content: tag });
		}
        // for (let i = 0; i < 1000; i++)
        //     FakerService.generatefakeUser();
        console.log("Database initialized");
        
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
        this.app.use(searchRouter);
        this.app.use(interactionsRouter);
		this.app.use("*", (req, res) => res.status(404).send());
	}

	async start() {
		return new Promise(resolve => {
            const httpserver = http.createServer(this.app);

            // Initialiser Socket.IO sur ce serveur HTTP
            const io = new Server(httpserver, {
                cors: {
                    origin: "*",  // Permettre les connexions depuis toutes les origines
                    methods: ["GET", "POST"]
                }
            });

            
            // Gérer les connexions WebSocket
            io.on('connection', async (socket) => {
                console.log('Nouvelle connexion WebSocket :', socket.id);
                // Utiliser ton service SocketService pour les événements WebSocket
                await SocketService.Handler(socket, io);
            });

            // this.server = this.app.listen(Config.port, () => {
            //     console.info(`Matcha server listening on port ${Config.port}`);
            //     resolve();
            // });
            this.server = httpserver;

            this.server.listen(Config.port, () => {
                console.log(`Serveur WebSocket démarré sur le port ${Config.port}`);
                resolve();
            });

            
		});
	}

	async stop() {
        console.log("Stopping server ...");
        
		return new Promise(resolve => {
			this.server.close(() => resolve());
		});
	}
}

export default new Application();
