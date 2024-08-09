import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Config from "../Config.js";

class UserSchema {
	static schema = {
		username: { type: "VARCHAR(30)", unique: true, required: true },
		password: { type: "TEXT", required: true },
		firstname: { type: "VARCHAR(30)", required: true },
		lastname: { type: "VARCHAR(50)", required: true },
		email: { type: "VARCHAR(100)", unique: true, required: true },
		birthGender: {
			type: "ENUM('male', 'female')",
			default: "NULL",
			required: false
		},
		currGender: {
			type: "ENUM('cisgender', 'transgender', 'non binary', 'fluid')",
			default: "cisgender",
			required: true
		},
		sexualOrient: {
			type: "ENUM('heterosexual', 'homosexual', 'bisexual', 'pansexual', 'asexual')",
			default: "bisexual",
			required: true,
		},
		bio: { type: "VARCHAR(300)", required: false },
		interestTagAdded: { type: "BOOLEAN", default: false },
		city: { type: "TEXT" },
		country: { type: "TEXT" },
		ip: { type: "VARCHAR(15)" }, // IP updated whenever the user sign-in ex: "204.132. 40.155"
		fakeCounter: { type: "INT", default: 0 },
		emailValidationCode: { type: "VARCHAR(6)", required: true },
		emailValidated: { type: "BOOLEAN", default: false },
		resetPasswordCode: { type: "VARCHAR(6)" },
		isFake: { type: "BOOLEAN", default: false },
	}

	// Not inserted in the db and can be usefull just like mongoose methods schema
	static methods = {
		getAuthToken(id) {
			return jwt.sign(
				{ id },
				Config.jwtSecret,
				{ expiresIn: "24h" }
			);
		},

		formatSafeUser(user) {
			// Delete properties that should not be sent to the client
			delete user.password;
			delete user.emailValidationCode;
			delete user.resetPasswordCode;
			delete user.fakeCounter;
			delete user.ip;
			return user;
		}
	}
};

Object.defineProperty(UserSchema.prototype, 'password', {
    set: async function(realPassword) {
		this.password = await bcrypt.hash(realPassword, 10);
    }
});

export default UserSchema;