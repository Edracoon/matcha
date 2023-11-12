import Config from "../Config.js";

class TagSchema {
	static schema = {
		content: { type: "VARCHAR(30)", unique: true, required: true },
	};
};

export default TagSchema;

export const TagList = [
	"Art",
	"Music",
	"Photography",
	"Sports",
	"Travel",
	"Food",
	"Movies",
	"Games",
	"Books",
	"TV",
	"Animals",
	"Nature",
	"Science",
	"Politics",
	"Technology",
	"Fitness",
	"Health",
	"DIY"
];
