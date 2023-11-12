import Config from "../Config.js";

class ViewSchema {
	static schema = {
		viewed : { type : 'INT', ref: "USER", required: true },
		viewer : { type : 'INT', ref: "USER", required: true },
	};
};

export default ViewSchema;
