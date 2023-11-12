import Config from "../Config.js";

class LikeSchema {
	static schema = {
		likedBy : { type : 'INT', ref: "USER", required: true, onDeleteCascade: true },
		gotLiked : { type : 'INT', ref: "USER", required: true, onDeleteCascade: true },
	};
};

export default LikeSchema;