import app from "../app.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default UserSchema = {
	username: { type: "VARCHAR(30)", unique: true, required: true },
	password: { type: "TEXT", required: true },
	firstname: { type: "VARCHAR(30)", required: true },
	lastname: { type: "VARCHAR(50)", required: true },
	email: { type: "VARCHAR(100)", unique: true, required: true },
	birthGender: { type: "ENUM('male', 'female')" },
	// ......

	// Not inserted in the db and can be usefull just like mongoose methods schema
	methods: {
		hello() {
			console.log("hello world!");
		},
		getAuthToken() {
			// return jwt.sign();
		}
	}
};

Object.defineProperty(UserSchema.prototype, 'password', {
    set: async function(realPassword) {
		this.password = await bcrypt.hash(realPassword, 10);
    }
});