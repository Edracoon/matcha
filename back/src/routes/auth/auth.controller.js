import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import app from "../../app.js";

class AuthController {

	signUp(req, res) {
		console.log("AuthController.signUp ->", req);
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
