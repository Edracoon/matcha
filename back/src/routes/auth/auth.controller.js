import express from "express";

import bcrypt from "bcrypt";
// import { User } from "../../models/user.model.js";
import InputErrors from "../InputErrors.js";
import Config from "../../Config.js";

const saltRounds = 10;

class AuthController {

	/**
	 * /auth/sign-up
	 * @param {*} req
	 * @param {*} res
	 */
	async signUp(req, res) {
		console.log("AuthController.signUp ->", req.body);
		const b = req.body;

		if (!b.firstname || !b.lastname || !b.email
			|| !b.username || !b.password || !b.confirmPassword)
			return res.status(400).json({ error: "form.invalid", errors: {form: "Missing inputs"}});

		let errors = InputErrors.checkMultipleInput(b, true);
		if (errors)
			return res.status(400).json({ error: "form.invalid", errors});
		
		// Check if the form is unique friendly
		if (await User.isUnique("email", b.email) === false)
			return res.status(400).json({ error: "form.invalid", errors: {email: "This email is already taken."} });
		if (await User.isUnique("username", b.username) === false)
			return res.status(400).json({ error: "form.invalid", errors: {username: "This username is already taken."} });

		let encryptedPass = await bcrypt.hash(b.password, saltRounds);
		let user = new User(b.firstname, b.lastname, b.email, b.username, encryptedPass);

		await user.save();
		// await app.MailService.sendMail(user.email, "Confirm your registration to Matcha !", `This is your verification code ${user.emailValidationCode}`);
		return res.status(200).json("sign-up succeeded");
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
