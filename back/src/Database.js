import mysql from "mysql2/promise";
import Config from "./Config.js";

export default class Database {
	constructor() {
		/* Init pool connection */
		this.db = mysql.createPool({
			connectionLimit: 100,
			host: Config.DB_HOST,
			user: Config.DB_USER,
			password: Config.DB_PASSWORD,
			database: Config.DB_NAME,
			port: Config.DB_PORT,
		});
		/* Handle pool potential errors */
		this.db.getConnection((err, connection) => {
			console.log("pool.getConnection() called.");
			if (err)
				console.log("pool.getConnection Error =>". err);
			if (connection)
				connection.release();
			return ;
		});
		console.log("Connected to database");
		this.query = this.db.query;
	}
}