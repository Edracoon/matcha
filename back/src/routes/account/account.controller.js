import SQLib from "../../SQLib.js";
import MailService from "../../services/mail.service.js";
import FileService from "../../services/file.service.js";
import UserSchema from "../../models/user.model.js";

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
			return ErrorsService.mongooseErrorHandler(mongoError, req, res);
		}
		const user = await sql.findOne("USER", { id: req.user.id });
		return res.status(200).json({ user: user });
	}


	/**
	 * Update the genders of the user
	 * @param { body: { birthGender, currGender } }
	 */
	static async upsertGender(req, res) {
		const { birthGender, currGender } = req.body;

		const birthGenders = ["male", "female"];
		const currGenders = ['cisgender', 'transgender', 'non binary', 'fluid']

		if (!birthGender || !currGender)
			return res.status(400).json({ error: "invalid genders" });

		if (birthGender && !birthGenders.includes(birthGender))
			return res.status(400).json({ error: "invalid birth gender" });

		if (currGender && !currGenders.includes(currGender))
			return res.status(400).json({ error: "invalid current gender" });

		try {
			await sql.update("USER", { id: req.user.id }, { birthGender, currGender });
		} catch (e) {
			return res.status(400).json({ error: e });
		}
		return res.status(200).json({ birthGender, currGender });
	}

	/**
	 * Update the sexual orientation of the user
	 * @param { body: { sexualOrient } }
	 */
	static async upsertSexualOrient(req, res) {
		const { sexualOrient } = req.body;

		const orientations = ['heterosexual', 'homosexual', 'bisexual', 'pansexual', 'asexual'];

		if (!sexualOrient)
			return res.status(400).json({ error: "invalid sexual orientation" });

		if (!orientations.includes(sexualOrient))
			return res.status(400).json({ error: "invalid sexual orientation" });

		try {
			await sql.update("USER", { id: req.user.id }, { sexualOrient });
		} catch (e) {
			return res.status(400).json({ error: e });
		}

		return res.status(200).json({ sexualOrient });
	}

	/**
	 * Update the bio of the user
	 * @param { body: { bio } }
	 */
	static async upsertBio(req, res) {
		const { bio } = req.body;

		if (bio && bio.length > 300)
			return res.status(400).json({ error: "Bio must be less than 300 characteres" });

		try {
			await sql.update("USER", { id: req.user.id }, { bio });
		}
		catch (e) {
			return res.status(400).json({ error: e });
		}
		return res.status(200).json({ bio });
	}

	/**
	 * Post to update the interests tags of the user
	 * @param { body: { tags: ["tag1", ...] } } 
	 */
	static async upsertInterestTags(req, res) {
		const allConstantsTags = ["tag1", "tag2", "tag3"];
		// Get the tag list from frontend and put it backend in accordance
		// Check if the tags are valid
		// then update the user tags
		const tags = req.body.tags;

		// Delete all currents tags from user
		try {
			await sql.delete("TAG_USER", { userId: req.user.id });
		} catch (e) {
			return res.status(400).json({ error: e });
		}

		// Insert the new tags
		for (const tag of tags) {
			if (!allConstantsTags.includes(tag)) {
				console.log(`Unkown tag: '${tag}'`);
				continue;
			}
			try { await sql.insert("TAG_USER", { userId: req.user.id, tag }); }
			catch (e) { return res.status(400).json({ error: e }); }
		}

		// Update the user to say that he has added his tags
		try {
			await sql.update("USER", { id: req.user.id }, { interestTagAdded: true });
		}
		catch (e) { return res.status(400).json({ error: e }); }

		return res.status(200).json({ tags });
	}

	/**
	 * Delete the picture of the user
	 * @param { params: { id } }
	 */
	static async deletePicture(req, res) {
		const { id } = req.params;
		if (!id)
			return res.status(400).json({ error: "Invalid id" });

		try { await sql.delete("PICTURE", { id, userId: req.user.id }); }
		catch (e) { return res.status(400).json({ error: e }); }

		return res.status(200).json({ id });
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
		const pictures = await sql.find("PICTURE", { userId: req.user.id });
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