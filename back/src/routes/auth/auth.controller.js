import bcrypt from "bcrypt";
// import { User } from "../../models/user.model.js";
import InputErrors from "./InputErrors.js";
import Config from "../../Config.js";
import SQLib from "../../SQLib.js";
import MailService from "../../services/mail.service.js";

const saltRounds = 10;

const sql = new SQLib();

class AuthController {

	/**
	 * /auth/sign-up
	 * @param {*} req
	 * @param {*} res
	 */
	async signUp(req, res) {
		
		let errors = [];
		const keys = ["firstname", "lastname", "email", "username", "password", "confirmPassword"];
		for (let key of keys)
			if (!req.body[key] && req.body[key] !== "")
				errors.push({ [key]: "This field is required." });
		errors = [...errors, ...InputErrors.checkMultipleInput(req.body, true)]
		if (errors.length > 0)
			return res.status(400).json({ error: "form.invalid", errors});

		console.log("AuthController.signUp ->", req.body, errors);
		// // Check if the form is unique friendly
		// if (await User.isUnique("email", b.email) === false)
		// 	return res.status(400).json({ error: "form.invalid", errors: {email: "This email is already taken."} });
		// if (await User.isUnique("username", b.username) === false)
		// 	return res.status(400).json({ error: "form.invalid", errors: {username: "This username is already taken."} });

		let encryptedPass = await bcrypt.hash(req.body.password, saltRounds);

		let user;
		try {
			user = await sql.insert("USER", {
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				email: req.body.email,
				username: req.body.username,
				profilePicture: "https://api.dicebear.com/5.x/initials/svg?backgroundColor=FF6D7F&seed=" + req.body.firstname + " " + req.body.lastname,
				password: encryptedPass,
				emailValidationCode: Math.floor(Math.random() * 1000000),
				emailValidated: false
			});
		} catch (e) {
			return res.status(400).json({ error: "" });
		}

		console.log(user);

		await MailService.sendMail(user.email, "Confirm your registration to Matcha !", `This is your verification code ${user.emailValidationCode}`);
		return res.status(200).json({ user: user });
	}

	async signIn(req, res) {
		console.log("AuthController.signIn ->", req.body);
		if (!req.body.username || !req.body.password)
			return res.status(400).json({error: "form.invalid"});

		let user = User.getUser('username', req.body.username);
		console.log(user);
		if (!user)
			return res.status(400).json({error: "form.invalid"});

		let same = await bcrypt.compare(req.body.password, user.password);
		if (!same) return res.status(400).json({error: "form.invalid"});

		// If this is the case, we're gonna need to re-inform the user that he need to confirm
		if (!user.confirmEmail) return res.status(400).json({error: "email.notconfirmed"});

		const accessToken = jwt.sign({ user, role: "member" }, Config.JWT_SECRET, { expiresIn: "1d" });
		return res.status(200).json({ accessToken });
	}

	async sendConfirmEmail(req, res) {
		console.log("AuthController.sendConfirmEmail ->", req);
		
		await app.MailService.sendMail(req.user.email, "Confirm your registration to Matcha !", `This is your verification code ${req.user.emailValidationCode}`);
	}

	confirmEmail(req, res) {
		console.log("AuthController.confirmEmail ->", req);
	}

	forgotPassword(req, res) {
		console.log("AuthController.forgotPassword ->", req);
	}

	resetPassword(req, res) {
		console.log("AuthController.resetPassword ->", req);
	}

}

export default new AuthController();
