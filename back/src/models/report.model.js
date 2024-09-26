import Config from "../Config.js";

class ReportSchema {
	static schema = {
		reported: { type : 'INT', ref: "USER", required: true, onDeleteCascade: true },
		reporter: { type : 'INT', ref: "USER", required: true, onDeleteCascade: true },
	}
}

export default ReportSchema;