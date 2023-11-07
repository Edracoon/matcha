import mysql from "mysql2/promise";
import Config from "./Config.js";

export default class SQLib {
	constructor() {
		// Singleton implementation for SQLib
		if (typeof SQLib.instance === 'object')
			return SQLib.instance;
		SQLib.instance = this;

		// Keep track of defined models
		this.models = {};
	}

	connectDB() {
		/* Init pool connection */
		this.db = mysql.createPool({
			connectionLimit: 100,
			host: Config.db.HOST,
			user: Config.db.USER,
			password: Config.db.PASSWORD,
			database: Config.db.NAME,
			port: Config.db.PORT,
		});
		/* Handle pool potential errors */
		this.db.getConnection((err, connection) => {
			if (err)
				console.log("pool.getConnection Error =>". err);
			if (connection)
				connection.release();
			return ;
		});
		console.log("[SQLib] : Connected to database");
	}

	/*
	 * Define a new model
	 */
	async defineModel(modelName, schema, version = 1) {
		// Create a new model object
		const model = {
			tableName: modelName,
			columns: schema,
			version: version,
		};

		// Save the model in the models object
		this.models[modelName] = model;

		// Generate the SQL query to create the table
		const columns = [];
		columns.push(`id INT NOT NULL AUTO_INCREMENT PRIMARY KEY`);
		for (let columnName in model.columns) {
			const column = model.columns[columnName];
			if (column.ref)
				columns.push(`FOREIGN KEY (${columnName}) REFERENCES ${column.ref}(id)`);
			const type = column.type;
			const unique = column.unique ? 'UNIQUE' : '';
			const required = column.required ? 'NOT NULL' : '';
			const defaultVal = column.defaultValue ? `DEFAULT ${column.defaultValue}` : '';
			const comment = column.comment ? `COMMENT '${column.comment}'` : '';
			columns.push(`${columnName} ${type} ${unique} ${required} ${defaultVal} ${comment}`);
		}
		// Example of a create table query:
		// CREATE TABLE IF NOT EXISTS users (
		// 	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
		// 	username VARCHAR(255) UNIQUE NOT NULL,
		// 	password VARCHAR(255) NOT NULL,
		// 	FOREIGN KEY (profileId) REFERENCES profiles(id)
		// )
		const sql = `CREATE TABLE IF NOT EXISTS ${modelName} (${columns.join(',')})`;

		// Execute the query to create the table
		let result = null;
		try { result = await this.db.query(sql) }
		catch (err) { result = `SQL_ERROR ${err.code}:\n${err.sqlMessage}`; }
		return result;
	}

	/*
	 * Inserts a new row of the ${modelName} table using the ${values} params
	 * Will return the values passed as params with the id of the new row
	 */
	async insert(modelName, values) {
		// Get the model object
		const model = this.models[modelName];
		if (!model)
			throw `Model ${modelName} does not exist`;

		// Generate the SQL query
		const columns = [];
		const placeholders = [];
		const queryValues = [];
		for (let columnName in values) {
			columns.push(columnName);
			placeholders.push('?');
			queryValues.push(values[columnName]);
		}
		// Example of an insert query:
		// INSERT INTO users (id, username, password) VALUES (?, ?, ?)
		// queryValues = [1, 'John', '1234']
		const sql = `INSERT INTO ${model.tableName} (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;

		// Execute the query
		let result;
		try { result = await this.db.query(sql, queryValues) }
		catch (err) {
			if (err.code === 'ER_DUP_ENTRY')
				throw `This ${err.sqlMessage.match(/'([^']+)'\s+for\s+key\s+'(?:[^.']+\.)([^']+)'/)[2]} is already taken`;
			else throw err.sqlMessage;
		}
		return { id: result[0].insertId, ...values };
	}

	/*
	 * Find rows of the ${modelName} table using the ${query} params
	 */
	async find(modelName, query) {
		// Get the model object
		const model = this.models[modelName];
		if (!model)
			throw `Model ${modelName} does not exist`;

		// Generate the SQL query
		const conditions = [];
		const queryValues = [];
		for (let columnName in query) {
			conditions.push(`${columnName} = ?`);
			queryValues.push(query[columnName]);
		}
		// Example of a select query:
		// SELECT * FROM users WHERE id = ? AND username = ?
		// queryValues = [1, 'John']
		const sql = `SELECT * FROM ${model.tableName} WHERE ${conditions.join(' AND ')}`;

		// Execute the query
		let result = null;
		try { result = await this.db.query(sql, queryValues); }
		catch (err) { throw err.sqlMessage; }
		return result;
	}

	/*
	 * Find one row using the ${query} params
	 */
	async findOne(modelName, query) {
		const result = await this.find(modelName, query);
		return result[0][0];
	}

	/*
	 * Find one row by id
	 */
	findById(modelName, id) {
		return this.findOne(modelName, { id: id });
	}

	/*
	 * Find all rows of a table (without any condition)
	 */
	findAll(modelName) {
		return this.find(modelName, {});
	}

	/*
	 * Update rows of the ${modelName} table using the ${query} and ${values} params
	 */
	async update(modelName, query, values) {
		// Get the model object
		const model = this.models[modelName];
		if (!model)
			throw `Model ${modelName} does not exist`;

		// Generate the SQL query
		const conditions = [];
		const setValues = [];
		const queryValues = [];

		for (let columnName in values) {
			setValues.push(`${columnName} = ?`);
			queryValues.push(values[columnName]);
		}

		for (let columnName in query) {
			conditions.push(`${columnName} = ?`);
			queryValues.push(query[columnName]);
		}
		// Example of an update query:
		// UPDATE users SET username = ?, password = ? WHERE id = ?
		// queryValues = ['newUsername', 'newPassword', 1]
		const sql = `UPDATE ${model.tableName} SET ${setValues.join(', ')} WHERE ${conditions.join(' AND ')}`;

		// Execute the query
		let result = null;
		try { result = await this.db.query(sql, queryValues) }
		catch (err) {
			if (err.code === 'ER_DUP_ENTRY')
				throw `This ${err.sqlMessage.match(/'([^']+)'\s+for\s+key\s+'(?:[^.']+\.)([^']+)'/)[2]} is already taken`;
			else throw err.sqlMessage;
		}
		return result;
	}

	/*
	 * Delete rows in the ${modelName} table using the ${query} params
	 */
	delete(modelName, query) {
		// Get the model object
		const model = this.models[modelName];
		if (!model)
			throw `Model ${modelName} does not exist`;

		// Generate the SQL query
		const conditions = [];
		const queryValues = [];
		for (let columnName in query) {
			conditions.push(`${columnName} = ?`);
			queryValues.push(query[columnName]);
		}
		// Example of a delete query:
		// DELETE FROM users WHERE id = ?
		// queryValues = [1]
		const sql = `DELETE FROM ${model.tableName} WHERE ${conditions.join(' AND ')}`;

		// Execute the query
		return this.db.query(sql, queryValues);
	}
}