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
		profilePicture: { type: "VARCHAR(200)", required: true }, // https://api.dicebear.com/5.x/initials/svg?backgroundColor=45CCB7,8BF2C5,209FA6&seed=EdgarPfennig
		birthGender: {
			type: "ENUM('male', 'female')",
			required: true
		},
		currGender: {
			type: "ENUM('cisgender', 'transgender', 'non binary', 'fluid')",
			default: 'cisgender',
			required: true
		},
		sexualOrient: {
			type: "ENUM('heterosexual', 'homosexual', 'bisexual', 'pansexual', 'asexual')",
			default: 'heterosexual',
			required: true,
		},
		bio: { type: "TEXT" },
		city: { type: "TEXT" },
		country: { type: "TEXT" },
		ip: { type: "VARCHAR(15)" }, // IP updated whenever the user sign-in ex: "204.132. 40.155"
		fakeCounter: { type: "INT", default: 0 },
		emailValidationCode: { type: "VARCHAR(6)", required: true },
		emailValidated: { type: "BOOLEAN", default: false },
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