import { faker } from '@faker-js/faker';
import SQLib from '../SQLib.js';
import { TagList } from '../models/tag.model.js';

const sql = new SQLib();

class FakerService {

	static async generatefakeUser(viewers = [], likers = []) {
        console.log("Generating fake user ...");
        
		const firstname = faker.name.firstName();
		const lastname = faker.name.lastName();

		// Generate a fake user
		const fakeUser = {
			username: faker.internet.userName(firstname, lastname),
			password: faker.internet.password(),
			firstname,
			lastname,
			email: faker.internet.email(firstname, lastname),
            latitude: faker.address.latitude(),
            longitude : faker.address.longitude(),
			gender: ['man', 'woman'][Math.floor(Math.random() * 2)],
			wantToMeet: ['men', 'women', 'anyone'][Math.floor(Math.random() * 3)],
			bio: faker.lorem.paragraph().slice(0, 199),
			emailValidated: true,
			emailValidationCode: faker.random.numeric(6),
			isFake: true,
            fameRating: Math.random()
		};

		// Store the user in db
		let user = null;
		try { user = await sql.insert("USER", fakeUser) }
		catch (e) { console.log(e); return null; }

		// Store a random number of random tags ids in db
		for (let i = 0; i < Math.floor(Math.random() * 4 + 1); i++) {
			const randomTagId = Math.floor((Math.random() * TagList.length) + 1);

			try { await sql.insert("TAG_USER", { userId: user.id, tagId: randomTagId }) }
			catch (e) { console.log(e); }
		}

		// Store a random number of random pictures
		const pictures = [];
		for (let i = 0; i < Math.floor(Math.random() * 5 + 1); i++) {
			try {
				pictures.push(await sql.insert("PICTURE", {
					userId: user.id,
					url: faker.image.avatar(),
				}));
			}
			catch (e) { console.log(e); }
		}

		// Store a random number of random views
		const viewersalreadyseen = [];
		const numberOfViews = Math.floor(Math.random() * viewers.length);
		for (let i = 0; i < numberOfViews; i++) {
			let randomViewer = viewers[Math.floor(Math.random() * viewers.length)];
			while (viewersalreadyseen.includes(randomViewer.id))
				randomViewer = viewers[Math.floor(Math.random() * viewers.length)];
			viewersalreadyseen.push(randomViewer.id);
			await this.fakeViewSomeone(randomViewer, user);
		}

		// Store a random number of random likes
		const likersalreadyseen = [];
		const numberOfLikes = Math.floor(Math.random() * likers.length);
		for (let i = 0; i < numberOfLikes; i++) {
			let randomLiker = likers[Math.floor(Math.random() * likers.length)];
			while (likersalreadyseen.includes(randomLiker.id))
				randomLiker = likers[Math.floor(Math.random() * likers.length)];
			likersalreadyseen.push(randomLiker.id);
			await this.fakeLikeSomeone(randomLiker, user);
		}

		return user;
	}

	static async fakeLikeSomeone(user, likedUser) {

		if (!user || !likedUser || user.id === likedUser.id)
			return null;

		const like = {
			likedBy: user.id,
			gotLiked: likedUser.id,
		};

		// Store it in db
		try { await sql.insert("LIKES", like) }
		catch (e) { console.log(e); }
	
		return like;
	}

	static async fakeViewSomeone(user, viewedUser) {

		if (!user || !viewedUser || user.id === viewedUser.id)
			return null;

		const view = {
			viewed: viewedUser.id,
			viewer: user.id,
		};

		// Store it in db
		try { await sql.insert("VIEW", view) }
		catch (e) { console.log(e); }
	
		return view;
	}
}

export default FakerService;