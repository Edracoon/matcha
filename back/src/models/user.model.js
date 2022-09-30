export class User {
	constructor(firstname, lastname, email, username, password) {
		this.username = username;
		this.password = password;
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.emailValidationCode = (Math.floor(Math.random() * (999999 - 100000) + 100000)).toString();
		this.birthGender = undefined;
		this.currGender = undefined;
		this.sexualOrient = undefined;
		this.bio = "";
		this.lastIP = "";
		this.fakeCounter = 0; // Number of reports "fake account"
	}

	// Method to save in db the user
	save() {
		
	}
}