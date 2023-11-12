import SQLib from "../../SQLib.js";
import MailService from "../../services/mail.service.js";
import UserSchema from "../../models/user.model.js";

const sql = new SQLib(); // Singleton

class FileController {

	static async getFile(req, res) {
		const { uid } = req.params;

		const picture = await sql.findOne("PICTURE", { uid });
		if (!picture)
			return res.status(404).json({ error: "Picture not found" });
		
		res.writeHead(200, {
			"Content-Type": "image/png",
			"Content-Length": picture.data.length
		});

		// Send the file data as a stream to the browser
		res.end(picture.data);
	}
}

export default FileController;
