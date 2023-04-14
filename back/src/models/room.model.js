import Config from "../Config.js";

class RoomSchema {

	static schema = {
		userId1: { type : 'INT', ref: "USER" },
		userId2: { type : 'INT', ref: "USER" }
	};
};

export default RoomSchema;