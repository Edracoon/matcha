import Config from "../Config.js";

class ViewSchema {
	static schema = {
		viewed : { type : 'INT', ref: "USER", required: true, onDeleteCascade: true },
		viewer : { type : 'INT', ref: "USER", required: true, onDeleteCascade: true },
	};
};

export default ViewSchema;
