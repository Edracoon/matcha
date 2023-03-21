import app from "../app.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Config from "../Config.js";

class UserSchema {
	static schema = {
		gotLiked : { type : 'INTEGER', required: true},
        LikedBy : { type : 'INTEGER', required: true},
	}

	// Not inserted in the db and can be usefull just like mongoose methods schema
	methods = {
		getAuthToken(id) {
			return jwt.sign(
				{ id },
				Config.jwtSecret,
				{ expiresIn: "24h" }
			);
		}
	}
};

Object.defineProperty(UserSchema.prototype, 'password', {
    set: async function(realPassword) {
		this.password = await bcrypt.hash(realPassword, 10);
    }
});

export default UserSchema;