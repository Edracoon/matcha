export default class InputErrors {

	static firstname(firstname) {
		if (!firstname || firstname === "")
			return "Provide a valid first name";
		else if (firstname.length > 50)
			return "Can't be longer that 50 characteres";
		return undefined;
	}

	static lastname(lastname) {
		if (!lastname || lastname === "")
			return "Provide a valid last name";
		else if (lastname.length > 50)
			return "Can't be longer that 50 characteres ";
		return undefined;
	}

	static email(email) {
		if (!String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
			return "Invalid email address";
		return undefined;
	}

	static username(username) {
		if (!username || username === "")
			return "Provide an username";
		else if (username.length > 50)
			return "Can't be longer that 50 characteres";
		return undefined;
	}

	static password(password) {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;


		if (!password || password === "")
			return "Provide a valid password";
		else if (password.length < 7)
			return "Password must at least be 7 characters long";
		else if (password.length > 72)
			return "Password must be less than 72 characters";
        else if (!regex.test(password))
            return "Password must contain at least one uppercase letter, one number and one special character";
		return undefined;
	}

	/**
	 * Check for errors in inputs
	 * This function only accepts keys that
	 * is a defined function in this class
	 */
	static checkMultipleInput(inputs, checkConfirm) {
		let errors = [];
		for (let key in inputs) {
			if (!this[key]) continue ;
			if (this[key](inputs[key]))
				errors.push(this[key](inputs[key]));
		}
		if (checkConfirm && inputs.password !== inputs.confirmPassword)
			errors.push({ confirmPassword: "Passwords are not the same."});
		return errors;
	}
}