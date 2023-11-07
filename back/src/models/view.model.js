import Config from "../Config.js";

class ViewSchema {
	static schema = {
		viewed : { type : 'INT', ref: "TAG" },
		viewer : { type : 'INT', ref: "USER" },
	};
};

export default ViewSchema;
