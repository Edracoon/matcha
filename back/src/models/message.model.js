import Config from "../Config.js";

class MessageSchema {
	static schema = {
		roomId: { type : 'INT', ref: "ROOM", required: true },
		senderId: { type : 'INT', ref: "USER", required: true, onDeleteCascade: true },
		content: { type: "TEXT", required: true },
		date: { type: "TIMESTAMP", default: "CURRENT_TIMESTAMP", required: true },
	};
};

export default MessageSchema;