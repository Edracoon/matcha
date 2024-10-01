import { faker } from '@faker-js/faker';
import SQLib from '../SQLib.js';
import { TagList } from '../models/tag.model.js';
import bcrypt from "bcrypt";

const sql = new SQLib();

class FakerService {

	static async generatefakeUser(createdAccount, nbFakerUsers = 1) {
        console.log("Generating fake users ...");

		const pos = [createdAccount.latitude, createdAccount.longitude];
		
		console.log(pos);
		for (let i = 0; i < nbFakerUsers; i++) {
			const gender = ['man', 'woman'][Math.floor(Math.random() * 2)]

			const firstname = faker.person.firstName(gender == 'man' ? 'male' : 'female');
            
			const lastname = faker.person.lastName(gender == 'man' ? 'male' : 'female');

			const nearbyPos = faker.location.nearbyGPSCoordinate({ origin: pos, radius: 100, isMetric: true }) // [ 37.9163, -179.2408 ]

			// Generate a fake user
			const fakeUser = {
				username: faker.internet.userName(firstname, lastname),
				password: await bcrypt.hash("password", 10),
				firstname,
				lastname,
				age: Math.floor(Math.random() * (52 - 18)) + 18,
				email: faker.internet.email(firstname, lastname),
				latitude:  nearbyPos[0],
				longitude : nearbyPos[1],
				gender,
				wantToMeet: ['men', 'women', 'anyone'][Math.floor(Math.random() * 3)],
				bio: faker.person.bio(),
				emailValidated: true,
				emailValidationCode: Math.floor(Math.random() * (999999 - 100000) + 100000),
				isFake: true,
				fameRating: Math.random(),
                lastConnection: faker.date.recent(),
			};

			// Store the user in db
			let user = null;
			try { user = await sql.insert("USER", fakeUser) }
			catch (e) { console.log(e); return null; }

			// Store a random number of random tags ids in db
			const nbRandomTags = Math.floor(Math.random() * 5 + 2);
			for (let i = 0; i < nbRandomTags; i++) {
				const randomTagId = Math.floor((Math.random() * TagList.length) + 1);

				try { await sql.insert("TAG_USER", { userId: user.id, tagId: randomTagId }) }
				catch (e) { console.log(e); }
			}

			// Store a random number of random pictures
			const pictures = [];
			const nbRandomPictures = Math.floor(Math.random() * 5 + 1);
			for (let i = 0; i < nbRandomPictures; i++) {
				try {
					pictures.push(await sql.insert("PICTURE", {
						userId: user.id,
						url: faker.image.urlLoremFlickr({ category: gender})
					}));
				}
				catch (e) { console.log(e); }
			}
		}

        console.log("Fake users generated !");
        
		return ;
	}

	
	static async generateViewersLikers(user, viewers = [], likers = []) {
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
	}

	static async fakeLikeSomeone(user, likedUser) {

		if (!user || !likedUser || user.id === likedUser.id)
			return null;

		const like = {
			type: "like",
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