import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import app from "../../app.js";
import InputErrors from "../InputErrors.js";
import { User } from "../../models/user.model.js";

class AuthController {

	signUp(req, res) {
		console.log("AuthController.signUp ->", req);
		let user = new User(req.body.firstname, req.body.lastname,
								req.body.email, req.body.username, req.body.password);
		// if (/* Test is their is users that have this email */true) {
		// 	return res.status(400).json({ error: "form.invalid", errors: "email.unique" });
		// }
		// if (/* Test is their is users that have this username */true) {
		// 	return res.status(400).json({ error: "form.invalid", errors: "username.unique" });
		// }

		let errors = {};
		errors.firstname = InputErrors.firstname(user.firstname);
		errors.lastname = InputErrors.lastname(user.lastname);
		errors.email = InputErrors.email(user.email);
		errors.username = InputErrors.username(user.username);
		errors.password = InputErrors.password(user.password);
		user.password === user.password2 ? undefined : errors.password2 = "Passwords are not the same !";
		for (let prop in errors) {
			if (errors[prop] !== undefined){
				res.status(400).json({ error: "", errors: ""});
			}
		}
	}

	signIn(req, res) {
		console.log("AuthController.signIn ->", req);
	}

	sendConfirmEmail(req, res) {
		console.log("AuthController.sendConfirmEmail ->", req);
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
