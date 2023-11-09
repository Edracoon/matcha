import Config from "../Config.js";

class TagUserSchema {
	static schema = {
		userId : { type : 'INT', ref: "USER" },
		tag : { type: "VARCHAR(30)", required: true }
	};
};

export default TagUserSchema;
