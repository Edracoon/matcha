import app from "../app.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Config from "../Config.js";

class LikeSchema {
	static schema = {
		likedBy : { type : 'INT', ref: "USER" },
		gotLiked : { type : 'INT', ref: "USER" },
	};
};

export default LikeSchema;