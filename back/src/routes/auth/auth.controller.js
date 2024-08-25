import bcrypt from "bcrypt";
// import { User } from "../../models/user.model.js";
import InputErrors from "./InputErrors.js";
import Config from "../../Config.js";
import SQLib from "../../SQLib.js";
import MailService from "../../services/mail.service.js";
import jwt from "jsonwebtoken";
import UserSchema from "../../models/user.model.js";

const saltRounds = 10;

const sql = new SQLib(); // Singleton

class AuthController {

	/**
	 * /auth/sign-up
	 * @param { body: { firstname, lastname, email, username, password, confirmPassword }}
	 * @param {*} req
	 * @param {*} res
	 * Tested on Postman
	 */
	static async signUp(req, res) {

		let errors = [];
		const keys = ["firstname", "lastname", "email", "username", "password", "confirmPassword"];
		for (let key of keys)
			if (!req.body[key] && req.body[key] !== "")
				errors.push({ [key]: "This field is required." });
		errors = [...errors, ...InputErrors.checkMultipleInput(req.body, true)];
		if (errors.length > 0)
			return res.status(400).json({ error: "All fields are required", errors});

		let encryptedPass = await bcrypt.hash(req.body.password, saltRounds);

		let user = null;
		try {
			user = await sql.insert("USER", {
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				email: req.body.email,
				username: req.body.username,
				password: encryptedPass,
				emailValidationCode: Math.floor(Math.random() * 1000000),
				emailValidated: false
			});
		} catch (e) {
			const trace = new Error().stack?.match(/at\s+(.+):(\d+):\d+/);
			console.log(`${trace[1]}:${trace[2]} -> ${e}`);
			return res.status(400).json({ error: e });
		}

		await MailService.sendMail(user.email, "Confirm your registration to Matcha !", `Click this link ${Config.frontUrl + "/verify-account/?validationCode=" + user.emailValidationCode} or use your code: ${user.emailValidationCode}`);

		return res.status(200).json({ accessToken: jwt.sign({ user }, Config.jwtSecret, { expiresIn: "7d" }), user: UserSchema.methods.formatSafeUser(user) });
	}

	/**
	 ** /auth/sign-in
	* @param { body: { username, password }}
	* @returns { accessToken: jwt }
	* Tested on Postman
	*/
	static async signIn(req, res) {
		if (!req.body.username)
			return res.status(400).json({ error: "Invalid username" });
		if (!req.body.password)
			return res.status(400).json({ error: "Invalid password" });

		let user = await sql.findOne("USER", { username: req.body.username });
		if (!user)
			return res.status(400).json({ error: "Username or password is invalid" });
		let same = await bcrypt.compare(req.body.password, user.password);
		if (!same)
			return res.status(400).json({ error: "Username or password is invalid" });

		return res.status(200).json({ accessToken: jwt.sign({ user }, Config.jwtSecret, { expiresIn: "7d" }), user: UserSchema.methods.formatSafeUser(user) });
	}

	/**
	 * /auth/send-confirm-email
	 * @returns { message: "Email sent" }
	 * Tested on Postman
	 */
	static async sendConfirmEmail(req, res) {
		const newValidationCode = Math.floor(Math.random() * 1000000);

		// Update the user validationCode
		sql.update("USER", { id: req.user.id }, { emailValidationCode: newValidationCode });

		await MailService.sendMail(req.user.email, "Confirm your registration to Matcha !", `Click this link ${Config.frontUrl + "/verify-account/?validationCode=" + newValidationCode} or use your code: ${newValidationCode}`);
		return res.status(200).json({ message: "Email sent" });
	}

	/**
	 * /auth/confirm-email
	 * @param { body: { emailValidationCode }}
	 * @returns { accessToken: jwt }
	 * Tested on Postman
	 */
	static async confirmEmail(req, res) {
		if (req.body.emailValidationCode === req.user.emailValidationCode) {
			await sql.update("USER", { id: req.user.id }, { emailValidated: true });
			return res.status(200).json({ accessToken: jwt.sign({ user: req.user }, Config.jwtSecret, { expiresIn: "7d" }) });
		}
		return res.status(400).json({ error: "Wrong email validation code" });
	}

	/**
	 * /auth/forgot-password
	 * @param { body: { email } }
	 * @returns { message: "We sent you an email to reset your password" }
	 * Tested on Postman
	 */
	static async forgotPassword(req, res) {
		const email = req.body.email;

		if (!email)
			return res.status(400).json({ error: "Invalid email" });

		const user = await sql.findOne("USER", { email });
		if (!user)
			return res.status(400).json({ error: "No user is registered with this email." });

		const resetPasswordCode = Math.floor(Math.random() * 1000000);

		// Update user with resetPasswordCode
		try { await sql.update("USER", { id: user.id }, { resetPasswordCode }); }
		catch (e) { return res.status(400).json({ error: e }); }

		try {
			await MailService.sendMail(email, "Reset your password", `This is your reset password code ${resetPasswordCode}. Click here to reset your password: " http://localhost:80/reset-password/${resetPasswordCode} "`);
		}
		catch (e) {
			console.log(e);
			// Unregister the user
			try { await sql.delete("USER", { id: user.id }); }
			catch (e) { }
			return res.status(400).json({ error: e });
		}

		return res.status(200).json({ message: `We sent an email to ${email} to reset your password` });
	}

	/**
	 * /auth/reset-password
	 * @param { body: { email, resetPasswordCode, password, confirmPassword } }
	 * @returns { message: "Password reset" }
	 * Tested on Postman
	 */
	static async resetPassword(req, res) {
		const { email, resetPasswordCode, password, confirmPassword } = req.body;

		if (!email)
			return res.status(400).json({ error: "Invalid email" });
		if (!resetPasswordCode)
			return res.status(400).json({ error: "Invalid reset password code" });
		if (!password)
			return res.status(400).json({ error: "Invalid password" });
		if (!confirmPassword)
			return res.status(400).json({ error: "Invalid confirm password" });
		if (password !== confirmPassword)
			return res.status(400).json({ error: "Passwords are not the same" });

		let user = await sql.findOne("USER", { email, resetPasswordCode });
		if (!user)
			return res.status(400).json({ error: "Invalid reset password code or email" });

		const encryptedPass = await bcrypt.hash(password, saltRounds);
		try {
			await sql.update("USER", { id: user.id }, { password: encryptedPass, resetPasswordCode: null });
		}
		catch (e) { return res.status(400).json({ error: e }); }
		return res.status(200).json({ message: "Password changed" });
	}

	static async verifyToken(req, res) {
		return res.status(200).json({ user: UserSchema.methods.formatSafeUser(req.user) });
	}

	static async profileComplete(req, res) {
		let user = req.user;

		if (!user.city)
			return res.status(400).json({ key: "1", error: "You must complete your profile before continuing" });

		if (!user.currGender || !user.sexualOrient)
			return res.status(400).json({ key: "2", error: "You must complete your profile before continuing" });

		if (!user.bio)
			return res.status(400).json({ key: "3", error: "You must complete your profile before continuing" });

		let tags = await sql.findAll("TAG", {id : user.id});
		if (tags.length === 0)
			return res.status(400).json({ key: "4", error: "You must complete your profile before continuing" });

		// Do not forget to check profile picture
		let pictures = await sql.findAll("PICTURE", {userId : user.id});
		if (pictures.length === 0)
			return res.status(400).json({ key: "5", error: "You must complete your profile before continuing" });

		return res.status(200).json();
	}
}

export default AuthController;