import multer from "multer"
import Config from "../Config.js";
import SQLib from "../SQLib.js";

const sql = new SQLib();

class FileService {

	static async uploadImage(user, file) {
		if (!user || !file)
			return null;

		const { data, mimetype } = file;
		if (mimetype.startsWith("image") === false)
			return null;

		const { id } = user;
		const randomUID = Math.floor(Math.random() * 10000000);

		const picture = {
			userId: id,
			url: Config.backUrl + "/file/" + randomUID,
			uid: randomUID,
			data: data
		};

		try { await sql.insert("PICTURE", picture); }
		catch (e) { return null; }
		return picture.url;
	}
}

export default FileService;
