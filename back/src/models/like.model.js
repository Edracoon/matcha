import Config from "../Config.js";

class LikeSchema {
	static schema = {
        type: {
			type: "ENUM('like', 'reject')",
			default: "like",
			required: true
		},
		likedBy : { type : 'INT', ref: "USER", required: true, onDeleteCascade: true },
		gotLiked : { type : 'INT', ref: "USER", required: true, onDeleteCascade: true },
	};
};

export default LikeSchema;