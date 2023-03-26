import app from "../app.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Config from "../Config.js";

class LikesSchema {
	static schema = {
		likedBy : { type : 'INT', ref: "USER", required: true },
		gotLiked : { type : 'INT', ref: "USER", required: true },
	};
};

export default LikesSchema;