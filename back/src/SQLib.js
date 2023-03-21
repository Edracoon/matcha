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

	async initDatabase() {
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
			console.log("pool.getConnection() called.");
			if (err)
				console.log("pool.getConnection Error =>". err);
			if (connection)
				connection.release();
			return ;
		});
		console.log("[SQLib] : Connected to database");
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
		columns.push(`id INT NOT NULL AUTO_INCREMENT PRIMARY KEY`);
		for (let columnName in model.columns) {
			const column = model.columns[columnName];
			if (column.array == true) {
				const array_type = columnName;
				const type = column.type;
				this.db.query('CREATE TYPE ' + array_type + ' AS ' + type + '[]')
				columns.push(`${columnName} ${array_type}`);
			} else {
				const type = column.type;
				const unique = column.unique ? 'UNIQUE' : '';
				const required = column.required ? 'NOT NULL' : '';
				const defaultVal = column.defaultValue ? `DEFAULT ${column.defaultValue}` : '';
				const comment = column.comment ? `COMMENT '${column.comment}'` : '';
				columns.push(`${columnName} ${type} ${unique} ${required} ${defaultVal} ${comment}`);
			}
		}
		const sql = `CREATE TABLE IF NOT EXISTS ${modelName} (${columns.join(', ')})`;
		console.log(sql);

		// Execute the query to create the table
		return this.db.query(sql);
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
		return this.db.query(sql, queryValues);
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
		return this.db.query(sql, queryValues);
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
		return this.db.query(sql, queryValues);
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
		return this.db.query(sql, queryValues);
	}
}