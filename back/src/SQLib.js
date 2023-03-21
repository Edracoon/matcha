import mysql from "mysql2/promise";
import Config from "./Config.js";

export default class SQLib {
	constructor() {
		// Singleton implementation for SQLib
		if (typeof SQLib.instance === 'object')
			return SQLib.instance;
		SQLib.instance = this;

		// Connect to the db
		initDatabase();
		
		// Keep track of defined models
		this.models = {};
		return this;
	}

	initDatabase() {
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

	// Define a new model
	defineModel(modelName, schema, version = 1) {
		// Create a new model object
		const model = {
			tableName: modelName,
			columns: {},
			version: version,
		};

		// Define the columns of the model
		for (let columnName in schema) {
			const columnDefinition = schema[columnName];
			model.columns[columnName] = {
				type: columnDefinition.type,
				required: columnDefinition.required,
				defaultValue: columnDefinition.defaultValue,
			};
		}

		// Save the model in the models object
		this.models[modelName] = model;

		// Generate the SQL query to create the table
		const columns = [];
		for (let columnName in model.columns) {
			if (columnName === "methods")
				continue ;
			const column = model.columns[columnName];
			const type = column.type;
			const unique = column.unique ? 'UNIQUE' : '';
			const required = column.required ? 'NOT NULL' : '';
			const defaultVal = column.defaultValue ? `DEFAULT ${column.defaultValue}` : '';
			const comment = column.comment ? `COMMENT '${column.comment}'` : '';
			columns.push(`${columnName} ${type} ${unique} ${required} ${defaultVal} ${comment}`);
		}
		const sql = `CREATE TABLE IF NOT EXISTS ${modelName} (${columns.join(', ')})`;

		// Execute the query to create the table
		return this.query(sql);
	}

	/*
	 * Inserts a new row of the ${modelName} table using the ${values} params
	 */
	create(modelName, values) {
		// Get the model object
		const model = this.models[modelName];

		// Generate the SQL query
		const columns = [];
		const placeholders = [];
		const queryValues = [];
		for (let columnName in values) {
			columns.push(columnName);
			placeholders.push('?');
			queryValues.push(values[columnName]);
		}
		const sql = `INSERT INTO ${model.tableName} (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;

		// Execute the query
		return this.query(sql, queryValues);
	}

	/*
	 * Find rows of the ${modelName} table using the ${query} params
	 */
	find(modelName, query) {
		// Get the model object
		const model = this.models[modelName];

		// Generate the SQL query
		const conditions = [];
		const queryValues = [];
		for (let columnName in query) {
			conditions.push(`${columnName} = ?`);
			queryValues.push(query[columnName]);
		}
		const sql = `SELECT * FROM ${model.tableName} WHERE ${conditions.join(' AND ')}`;

		// Execute the query
		return this.query(sql, queryValues);
	}

	/*
	 * Update rows of the ${modelName} table using the ${query} and ${values} params
	 */
	update(modelName, query, values) {
	
		// Get the model object
		const model = this.models[modelName];

		// Generate the SQL query
		const conditions = [];
		const setValues = [];
		const queryValues = [];
		for (let columnName in query) {
			conditions.push(`${columnName} = ?`);
			queryValues.push(query[columnName]);
		}
		for (let columnName in values) {
			setValues.push(`${columnName} = ?`);
			queryValues.push(values[columnName]);
		}
		const sql = `UPDATE ${model.tableName} SET ${setValues.join(', ')} WHERE ${conditions.join(' AND ')}`;

		// Execute the query
		return this.query(sql, queryValues);
	}

	/*
	 * Delete rows in the ${modelName} table using the ${query} params
	 */
	delete(modelName, query) {
		// Get the model object
		const model = this.models[modelName];

		// Generate the SQL query
		const conditions = [];
		const queryValues = [];
		for (let columnName in query) {
			conditions.push(`${columnName} = ?`);
			queryValues.push(query[columnName]);
		}
		const sql = `DELETE FROM ${model.tableName} WHERE ${conditions.join(' AND ')}`;

		// Execute the query
		return this.query(sql, queryValues);
	}
}