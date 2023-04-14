import Config from "../Config.js";

class TagUserSchema {
	static schema = {
		tagId : { type : 'INT', ref: "TAG" },
		userId : { type : 'INT', ref: "USER" },
	};
};

export default TagUserSchema;