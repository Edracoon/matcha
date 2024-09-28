import SQLib from "../../SQLib.js";
import MailService from "../../services/mail.service.js";
import FileService from "../../services/file.service.js";
import UserSchema from "../../models/user.model.js";
import FakerService from "../../services/faker.service.js";
import { Faker } from "@faker-js/faker";

const sql = new SQLib(); // Singleton

class AccountController {

	/**
	 * POST to update the account data
	 * @param {
	 * 		body: { firstname, lastname, email: String(Regex.email) },
	 * }
	 * Return the new session data info
	 */
	static async editAccount(req, res) {
		const { firstname, lastname, email } = req.body;
		const toUpdate = {};

		if (email && email !== req.user.email) {
			const user = await sql.findOne("USER", { email });
			if (user)
				return res.status(400).json({ error: `This email (${email}) is already taken.` });

			// Store the updates for later
			toUpdate.emailValidationCode = (Math.floor(Math.random() * (999999 - 100000) + 100000)).toString();
			toUpdate.emailValidated = false;
			toUpdate.email = email;

			await MailService.sendMail(email, "Email address change on Matcha", `To verify and secure your account, please enter the following email verification code ${req.user.emailValidationCode}`);
		}

		if (firstname && firstname !== req.user.firstname)
			toUpdate.firstname = firstname;

		if (lastname && lastname !== req.user.lastname)
			toUpdate.lastname = lastname;

		try {
			sql.update("USER", { id: req.user.id }, toUpdate);
		} catch (mongoError) {
			// TODO: CHANGER CECI
			return ErrorsService.mongooseErrorHandler(mongoError, req, res);
		}
		const user = await sql.findOne("USER", { id: req.user.id });
		return res.status(200).json({ user: user });
	}

	/**
	 * POST to update the user location
	 * @param {
	 * 		body: { lat, lng },
	 * }
	 * Return the new session data info
	 */
	static async upsertLocation(req, res) {
		const { lat, lng } = req.body;

		if (!lng || !lat)
			return res.status(400).json({ error: "Invalid location" });

		try {
			await sql.update("USER", { id: req.user.id }, { longitude: lng, latitude: lat });
		}
		catch (e) { return res.status(400).json({ error: e }); }

		FakerService.generatefakeUser({ ...req.user, latitude: lat, longitude: lng }, 10000);

		return res.status(200).json({ lat, lng });
	}

	/**
	 * Get the preferences of the user
	 * @returns { body: { gender, wantToMeet } }
	 */
	static async getPreferences(req, res) {
		return res.status(200).json({ gender: req.user.gender, wantToMeet: req.user.wantToMeet });
	}

	/**
	 * Update the preferences of the user
	 * @param { body: { gender, wantToMeet } }
	 */
	static async upsertPreferences(req, res) {
		const { gender, wantToMeet } = req.body;

		const gendersOptions = ['man', 'woman'];
		const wantsOptions = ['men', 'women', 'anyone'];

		if (!gender || !wantToMeet)
			return res.status(400).json({ error: "invalid preferences" });

		if (gender && !gendersOptions.includes(gender))
			return res.status(400).json({ error: "invalid gender" });

		if (wantToMeet && !wantsOptions.includes(wantToMeet))
			return res.status(400).json({ error: "invalid orientation" });

		try {
			await sql.update("USER", { id: req.user.id }, { gender, wantToMeet });
		} catch (e) {
			return res.status(400).json({ error: e });
		}
		return res.status(200).json({ gender, wantToMeet });
	}

	/**
	 * Get the bio of the user
	 * @returns { body: { bio } }
	 */
	static async getBio(req, res) {
		return res.status(200).json({ bio: req.user.bio });
	}

	/**
	 * Update the bio of the user
	 * @param { body: { bio } }
	 */
	static async upsertBio(req, res) {
		const { bio } = req.body;

		if (bio && bio.length > 200)
			return res.status(400).json({ error: "Bio must be less than 200 characteres" });

		try {
			await sql.update("USER", { id: req.user.id }, { bio });
		}
		catch (e) {
			return res.status(400).json({ error: e });
		}
		return res.status(200).json({ bio });
	}

	/**
	 * Get all tags in the db
	 * @returns { body: { tags: [] } } 
	 */
	static async getAllTags(req, res) {
		const tags = await sql.findAll("TAG");
		return res.status(200).json({ tags });
	}

	/**
	 * Get the interests tags of the user
	 * @param { body: { tags: ["tag1", ...] } } 
	 */
	static async getInterestTags(req, res) {
		const tags = await sql.find("TAG_USER", { userId: req.user.id });
		const realTags = [];
		for (const tag of tags) {
			realTags.push((await sql.findOne("TAG", { id: tag.tagId })));
		}
		return res.status(200).json({ tags: realTags });
	}

	/**
	 * Post to update the interests tags of the user
	 * @param { body: { tags: ["tag1", ...] } }
	 */
	static async upsertInterestTags(req, res) {
		const tags = req.body.tags;

		// Delete all currents tags from user
		try {
			await sql.delete("TAG_USER", { userId: req.user.id });
		} catch (e) {
			return res.status(400).json({ error: e });
		}

		// Insert the new tags
		for (const tag of tags) {
			try { await sql.insert("TAG_USER", { userId: req.user.id, tagId: tag.id }); }
			catch (e) { return res.status(400).json({ error: e }); }
		}

		return res.status(200).json({ tags });
	}

	static async getPictures(req, res) {
		const pictures = await sql.find("PICTURE", { userId: req.user.id });
		const pictureUrls = [];
		for (const picture of pictures) {
			pictureUrls.push(picture.url);
		}
		return res.status(200).json({ pictures: pictureUrls });
	}

	/**
	 * Route to add one picture to the user
	 * @param req.files.picture
	 */
	static async addPicture(req, res) {
		const { picture } = req.files;
		if (!picture)
			return res.status(400).json({ error: "Invalid picture" });

		const pictureUrl = await FileService.uploadImage(req.user, picture);
		if (!pictureUrl)
			return res.status(400).json({ error: "Invalid picture" });

		return res.status(200).json({ pictureUrl });
	}

	/**
	 * Delete the picture of the user
	 * @param { params: { id } }
	 */
	static async deletePicture(req, res) {
		const { id } = req.params;
		if (!id)
			return res.status(400).json({ error: "Invalid id" });

		try { await sql.delete("PICTURE", { uid: id, userId: req.user.id }); }
		catch (e) { return res.status(400).json({ error: e }); }

		return res.status(200).json({ id });
	}

	/**
	 * Get the session data info of myself
	 */
	static async getMyself(req, res) {
		const tags = await sql.find("TAG_USER", { userId: req.user.id });
		const pictures = await sql.find("PICTURE", { userId: req.user.id });
		const viewsCount = (await sql.find("VIEW", { viewed: req.user.id })).length;
		const likes = (await sql.find("LIKES", { gotLiked: req.user.id })).length;

		// Create an array with only pictures url
		const pictureUrls = [];
		for (const picture of pictures) {
			pictureUrls.push(picture.url);
		}

		// Collect tags content in db
		const realTags = [];
		for (const tag of tags) {
			realTags.push((await sql.findOne("TAG", { id: tag.tagId })));
		}

		const fameRating = likes * 10 + viewsCount;

		return res.status(200).json({ user: {
			...UserSchema.methods.formatSafeUser(req.user),
			tags,
			pictures: pictureUrls,
			views: viewsCount,
			fameRating,
			likes,
		}});
	}

	/**
	 * Get the session data info of an user by his id
	 * @param { params: { id: Number }}
	 */
	static async getUserById(req, res) {
		const id = req.params.id;
		if (!id)
			return res.status(400).json({ error: "Invalid id" });

		const user = await sql.findOne("USER", { id });
		if (!user)
			return res.status(400).json({ error: "Invalid id" });

		const tags = await sql.find("TAG_USER", { userId: user.id });
		const pictures = await sql.find("PICTURE", { userId: user.id });
		const viewsCount = (await sql.find("VIEW", { viewed: user.id })).length;

		// Create an array with only pictures url
		const pictureUrls = [];
		for (const picture of pictures) {
			pictureUrls.push(picture.url);
		}

		// Collect tags content in db
		const realTags = [];
		for (const tag of tags) {
			realTags.push((await sql.findOne("TAG", { id: tag.tagId })));
		}

		const likes = (await sql.find("LIKES", { gotLiked: user.id })).length;
		const views = (await sql.find("VIEW", { viewed: user.id })).length;
		const fameRating = likes * 10 + views;

		user.tags = tags;
		user.pictures = pictureUrls;
		user.views = viewsCount;
		user.fameRating = fameRating;

		return res.status(200).json({
			user: UserSchema.methods.formatSafeUser(user)
		});
	}

	/**
	 * Get the views of the user
	 */
	static async getMyViews(req, res) {
		const views = await sql.find("VIEW", { viewed: req.user.id });
		const users = [];
		for (const view of views) {
			const user = await sql.findOne("USER", { id: view.viewer });
			if (user)
				users.push(UserSchema.methods.formatSafeUser(user));
		}
		return res.status(200).json({ users });
	}

	/**
	 * Get the likes of the user
	 */
	static async getMyLikes(req, res) {
		const likes = await sql.find("LIKES", { gotLiked: req.user.id });
		const users = [];
		for (const like of likes) {
			const user = await sql.findOne("USER", { id: like.likedBy });
			if (user)
				users.push(UserSchema.methods.formatSafeUser(user));
		}
		return res.status(200).json({ users });
	}
}

export default AccountController;