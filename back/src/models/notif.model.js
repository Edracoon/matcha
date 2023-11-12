import Config from "../Config.js";

class NotifSchema {
	static schema = {
		senderId: { type : 'INT', ref: "USER", required: true, onDeleteCascade: true },
		receiverId: { type : 'INT', ref: "USER", required: true, onDeleteCascade: true },
		category: {
			type: "ENUM('liked', 'visited', 'message', 'liked_back', 'unliked')",
			required: true
		},
		date: { type: "TIMESTAMP", default: "CURRENT_TIMESTAMP", required: true }
	};
}

export default NotifSchema;