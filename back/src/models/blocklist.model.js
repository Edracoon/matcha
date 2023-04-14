import Config from "../Config.js";

class NotifSchema {
	static schema = {
		didBlockId: { type : 'INT', ref: "USER", required: true },
		gotBlockId: { type : 'INT', ref: "USER", required: true },
	}
}

export default NotifSchema;