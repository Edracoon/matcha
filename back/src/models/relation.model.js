import app from "../app.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default RelationSchema = {
	username: { type: "VARCHAR(30)", unique: true, required: true },
	password: { type: "TEXT", required: true },
	firstname: { type: "VARCHAR(30)", required: true },
	lastname: { type: "VARCHAR(50)", required: true },
	email: { type: "VARCHAR(100)", unique: true, required: true },
	birthGender: { type: "ENUM('male', 'female')" },
    MyLike : { array : true, array_type : 'MyLike', type : 'INTEGER' },
    LikedBy : { array : true, array_type : 'LikedBy', type : 'INTEGER' },
	// ......

	// Not inserted in the db and can be usefull just like mongoose methods schema
	methods: {
		
	}
};
