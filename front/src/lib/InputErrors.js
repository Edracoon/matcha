export default class InputErrors {

	static firstname(firstname) {
		if (!firstname || firstname === "")
			return "Please provide your first name !";
		else if (firstname.length > 15)
			return "Must be 15 characters or less";
		return "";
	}

	static lastname(lastname) {
		if (!lastname || lastname === "")
			return "Please provide your last name !";
		else if (lastname.length > 20)
			return "Must be 20 characters or less";
		return ""
	}

	static email(email) {
		if (!email || email === "")
			return "Please provide your email address !";
		else if (!String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
			return "Invalid email address";
		return ""
	}

	static username(username) {
		if (!username || username === "")
			return "Please provide an username !";
		else if (username.length > 20)
			return "Must be 20 characters or less";
		return "";
	}

	static password(password) {
		if (!password || password === "")
			return "Please provide a password !";
		else if (password.length < 7)
			return "Must be 7 characters or more !";
		else if (password.length > 72)
			return "Must be less than 72 characters !";
		return "";
	}
}