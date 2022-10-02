import app from "../app.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class User {
	constructor(firstname, lastname, email, username, password) {
		this.username = username;
		this.password = password;
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.birthGender = "undefined";
		this.currGender = "undefined";
		this.sexualOrient = "undefined";
		this.bio = "";
		this.lastIP = "";
		this.fakeCounter = 0; // Number of reports "fake account"
		this.validatedEmail = false;
		this.emailValidationCode = (Math.floor(Math.random() * (999999 - 100000) + 100000)).toString();
	}

	// Method to save in db the user
	save() {
		let user = {
			username: this.username,
			password: this.password,
			firstname: this.firstname,
			lastname: this.lastname,
			email: this.email,
			birthGender: this.birthGender,
			currGender: this.currGender,
			sexualOrient: this.sexualOrient,
			bio: this.bio,
			fakeCounter: this.fakeCounter,
			emailValidationCode: this.emailValidationCode,
			lastIP: this.lastIP,
		};
		app.mysql.query(`INSERT INTO USER SET ?`, user);
	}

	/**
	 * 
	 * @param {String} propToCheck
	 * @param {String} param
	 * @returns true of false -> param is unique or not
	 */
	static async isUnique(propToCheck, param) {
		let data = await app.mysql.query(`SELECT COUNT(*) AS cnt FROM USER WHERE ${propToCheck} = ?`, [param]);
		console.log(data[0][0].cnt);
		return data[0][0].cnt === 0 ? true : false;
	}

	static async getUser(propToGet, param) {
		let data = await app.mysql.query(`SELECT * FROM USER WHERE ${propToGet} = '${param}';`);
		return data[0][0];
	}
}