import Config from "../Config.js";

class TagSchema {
	static schema = {
		content: { type: "VARCHAR(30)", unique: true, required: true },
	};
};

export default TagSchema;