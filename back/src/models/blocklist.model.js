import Config from "../Config.js";

class NotifSchema {
	static schema = {
		didBlockId: { type : 'INT', ref: "USER", required: true, onDeleteCascade: true },
		gotBlockId: { type : 'INT', ref: "USER", required: true, onDeleteCascade: true },
	}
}

export default NotifSchema;