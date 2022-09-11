import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Config from "../Config.js";

export const AuthMiddleware = async (req, res, next) => {
	return next();
}
