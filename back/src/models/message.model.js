import Config from "../Config.js";

class MessageSchema {
	static schema = {
		receiverId: { type : 'INT', ref: "USER", required: true, onDeleteCascade: true},
		senderId: { type : 'INT', ref: "USER", required: true, onDeleteCascade: true },
		content: { type: "TEXT", required: true },
		date: { type: "TIMESTAMP", default: "CURRENT_TIMESTAMP", required: true },
	};
};

export default MessageSchema;