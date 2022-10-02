import mysql from "mysql2/promise";
import Config from "./Config.js";

export default class Database {
	constructor() {
		/* Init pool connection */
		this.db = mysql.createPool({
			connectionLimit: 100,
			host: Config.DB.HOST,
			user: Config.DB.USER,
			password: Config.DB.PASSWORD,
			database: Config.DB.NAME,
			port: Config.DB.PORT,
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