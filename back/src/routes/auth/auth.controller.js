import bcrypt from "bcrypt";
// import { User } from "../../models/user.model.js";
import InputErrors from "./InputErrors.js";
import Config from "../../Config.js";
import SQLib from "../../SQLib.js";
import MailService from "../../services/mail.service.js";
import jwt from "jsonwebtoken";

const saltRounds = 10;

const sql = new SQLib(); // Singleton

class AuthController {

	/**
	 * /auth/sign-up
	 * @param { body: { firstname, lastname, email, username, password, confirmPassword }}
	 * @param {*} req
	 * @param {*} res
	 */
	static async signUp(req, res) {

		let errors = [];
		const keys = ["firstname", "lastname", "email", "username", "password", "confirmPassword"];
		for (let key of keys)
			if (!req.body[key] && req.body[key] !== "")
				errors.push({ [key]: "This field is required." });
		errors = [...errors, ...InputErrors.checkMultipleInput(req.body, true)]
		if (errors.length > 0)
			return res.status(400).json({ error: "form.invalid", errors});

		let encryptedPass = await bcrypt.hash(req.body.password, saltRounds);

		let user = null;
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
			const trace = new Error().stack?.match(/at\s+(.+):(\d+):\d+/);
			console.log(`${trace[1]}:${trace[2]} -> ${e}`);
			return res.status(400).json({ error: e });
		}

		await MailService.sendMail(user.email, "Confirm your registration to Matcha !", `This is your verification code ${user.emailValidationCode}`);
		return res.status(200).json({ user: user, accessToken: jwt.sign({ user }, Config.jwtSecret, { expiresIn: "7d" }) });
	}

	/**
	 ** /auth/sign-in
	 * @param { body: { username, password }}
	 * @returns { accessToken: jwt }
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

		return res.status(200).json({ accessToken: jwt.sign({ user }, Config.jwtSecret, { expiresIn: "7d" }) });
	}

	/**
	 * /auth/send-confirm-email
	 * @returns { message: "Email sent" }
	 */
	static async sendConfirmEmail(req, res) {
		await MailService.sendMail(req.user.email, "Confirm your registration to Matcha !", `This is your verification code ${req.user.emailValidationCode}`);
		return res.status(200).json({ message: "Email sent" });
	}

	/**
	 * /auth/confirm-email
	 * @param { body: { emailValidationCode }}
	 * @returns { accessToken: jwt }
	 */
	static async confirmEmail(req, res) {
		if (req.body.emailValidationCode === req.user.emailValidationCode) {
			await sql.update("USER", { id: req.user.id }, { emailValidated: true });
			return res.status(200).json({ accessToken: jwt.sign({ user }, Config.jwtSecret, { expiresIn: "7d" }) });
		}
		return res.status(400).json({ error: "Wrong email validation code" });
	}

	/**
	 * /auth/forgot-password
	 * @param { body: { email } }
	 * @returns { message: "We sent you an email to reset your password" }
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

		await MailService.sendMail(user.email, "Reset your password", `This is your reset password code ${resetPasswordCode}. Click here to reset your password: " http://localhost:80/reset-password/${resetPasswordCode} "`);
		return res.status(200).json({ message: "We sent you an email to reset your password" });
	}

	/**
	 * /auth/reset-password
	 * @param { body: { email, resetPasswordCode, password, confirmPassword } }
	 * @returns { message: "Password reset" }
	 */
	static async resetPassword(req, res) {
		const email = req.body.email;
		const resetPasswordCode = req.body.resetPasswordCode;
		const password = req.body.password;
		const confirmPassword = req.body.confirmPassword;

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
			return res.status(400).json({ error: "Invalid reset password code" });

		const encryptedPass = await bcrypt.hash(password, saltRounds);
		try {
			await sql.update("USER", { id: user.id }, { password: encryptedPass, resetPasswordCode: null });
		}
		catch (e) { return res.status(400).json({ error: e }); }
		return res.status(200).json({ message: "Password changed" });
	}
}

export default AuthController;