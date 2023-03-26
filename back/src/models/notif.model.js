import app from "../app.js";
import Config from "../Config.js";

class NotifSchema {
	static schema = {
		senderId: { type : 'INT', ref: "USER", required: true },
		receiverId: { type : 'INT', ref: "USER", required: true },
		category: {
			type: "ENUM('liked', 'visited', 'message', 'liked_back', 'unliked')",
			required: true
		},
		date: { type: "TIMESTAMP", default: "CURRENT_TIMESTAMP", required: true }
	};
}

export default NotifSchema;