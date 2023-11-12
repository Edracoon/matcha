import Config from "../Config.js";

class RoomSchema {

	static schema = {
		userId1: { type : 'INT', ref: "USER", required: true, onDeleteCascade: true },
		userId2: { type : 'INT', ref: "USER", required: true, onDeleteCascade: true },
	};
};

export default RoomSchema;