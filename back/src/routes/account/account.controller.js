// import { User } from "../../models/user.model.js";
import InputErrors from "./InputErrors.js";
import Config from "../../Config.js";
import SQLib from "../../SQLib.js";

const sql = new SQLib(); // Singleton

class AccountController {

	/**
	 * POST to update the account data
	 * @param {
	 * 		body: { username: String, email: String(Regex.email), password: String },
	 * 		files: { profilePicture: file }
	 * }
	 * Return the new session data info
	 */
	static async editAccount(req, res) {
		if (req.body.username && req.body.username !== req.user.username) {
			req.user.username = req.body.username;
			if (req.user.profilePicture?.startsWith("https://api.dicebear.com/"))
				req.user.profilePicture = `https://api.dicebear.com/5.x/initials/svg?backgroundColor=00D890&seed=${req.body.username?.replace(/,/g, "")}`;
		}

		if (req.body.email && req.body.email !== req.user.email) {
			req.user.email = req.body.email;
			req.user.emailValidationCode = (Math.floor(Math.random() * (999999 - 100000) + 100000)).toString();
			req.user.emailValidated = false;
			await EmailService.sendMail(req.user.email, "Email address change on Ensure", `To verify and secure your account, please enter the following verification code ${req.user.emailValidationCode}`);
		}

		if (req.body.password) {
			req.user.password = req.body.password;
		}

		if (req.files?.profilePicture) {
			if (req.user.profilePicture) {
				await FileService.removeFile(req.user.profilePicture);
			}
			req.user.profilePicture = await FileService.uploadFile(req.files.profilePicture, "profilePicture", req.user._id);
		}

		try {
			req.user = await req.user.save();
		} catch (mongoError) {
			return ErrorsService.mongooseErrorHandler(mongoError, req, res);
		}
		return res.json({ user: await req.user.getSession() });
	}

	/**
	 * Get the session data info of myself
	 */
	static async getMyself(req, res) {
		
	}

	/**
	 * Get the session data info of an user by his id
	 * @param { params: { id: Number }}
	 */
	static async getUser(req, res) {
		
	}
}

export default AccountController;