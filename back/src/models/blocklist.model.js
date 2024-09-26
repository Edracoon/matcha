import Config from "../Config.js";

class BlockSchema {
	static schema = {
		didBlockId: { type : 'INT', ref: "USER", required: true, onDeleteCascade: true },
		gotBlockId: { type : 'INT', ref: "USER", required: true, onDeleteCascade: true },
	}
}

export default BlockSchema;