import Config from "../Config.js";

class PictureSchema {
	static schema = {
		userId: { type : 'INT', ref: "USER", required: true },
		url: { type: "VARCHAR(300)", required: true },
		uid: { type: "VARCHAR(10)"},
		data: { type: "LONGBLOB" },
	};
}

export default PictureSchema;