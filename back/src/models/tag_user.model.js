import Config from "../Config.js";

class TagUserSchema {
	static schema = {
		userId : { type : 'INT', ref: "USER", required: true },
		tagId : { type: "INT", ref: "TAG", required: true }
	};
};

export default TagUserSchema;
