import app from "../app.js";

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
		app.db.query(`INSERT INTO USER SET ?`, user);
	}

	/**
	 * 
	 * @param {String} propToCheck
	 * @param {String} param
	 * @returns true of false -> param is unique or not
	 */
	async isUnique(propToCheck, param) {
		let data = await app.db.query(`SELECT COUNT(*) AS cnt FROM USER WHERE ${propToCheck} = ?`, [param]);
		console.log(`countDocument for ${param} = ${data[0][0].cnt}`);
		return data[0][0].cnt === 0 ? true : false;
	}
}