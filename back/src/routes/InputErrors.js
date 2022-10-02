export default class InputErrors {

	static firstname(firstname) {
		if (!firstname || firstname === "")
			return "Provide a valid first name.";
		else if (firstname.length > 50)
			return "Can't be longer that 50 characteres.";
		return undefined;
	}

	static lastname(lastname) {
		if (!lastname || lastname === "")
			return "Provide a valid last name.";
		else if (lastname.length > 50)
			return "Can't be longer that 50 characteres ";
		return undefined;
	}

	static email(email) {
		if (!email || email === "")
			return "Provide a valid email address.";
		else if (!String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
			return "Invalid email address";
		return undefined;
	}

	static username(username) {
		if (!username || username === "")
			return "Provide an username.";
		else if (username.length > 50)
			return "Can't be longer that 50 characteres.";
		return undefined;
	}

	static password(password) {
		if (!password || password === "")
			return "Provide a valid password.";
		else if (password.length < 7)
			return "Password must at least be 7 characters long.";
		else if (password.length > 72)
			return "Password must be less than 72 characters.";
		return undefined;
	}

	/**
	 * Check for errors in inputs
	 * This function only accepts keys that
	 * is a defined function in this class
	 * @param {*} inputs 
	 * @returns 
	 */
	static checkMultipleInput(inputs, checkConfirm) {
		let errors = {};
		for (let key in inputs) {
			if (!this[key]) continue ;
			errors[key] = this[key](inputs[key]);
		}
		if (checkConfirm && inputs.password !== inputs.confirmPassword)
			errors.confirmPassword = "Passwords are not the same.";
		for (let err in errors) if (errors[err]) return errors;
		return undefined;
	}
}