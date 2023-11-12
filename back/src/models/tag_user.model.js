import Config from "../Config.js";

class TagUserSchema {
	static schema = {
		userId : { type : 'INT', ref: "USER", required: true, onDeleteCascade: true },
		tagId : { type: "INT", ref: "TAG", required: true, onDeleteCascade: true }
	};
};

export default TagUserSchema;
