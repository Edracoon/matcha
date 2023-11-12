import Config from "../Config.js";

class LikeSchema {
	static schema = {
		likedBy : { type : 'INT', ref: "USER", required: true },
		gotLiked : { type : 'INT', ref: "USER", required: true },
	};
};

export default LikeSchema;