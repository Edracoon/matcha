import { faker } from '@faker-js/faker';

class FakerService {
	constructor() {
	}

	static userSkeleton() {
		const username = faker.internet.userName();
		return {
			username: username,
			password: faker.internet.password(),
			firstname: faker.name.firstName(),
			lastname: faker.name.lastName(),
			email: faker.internet.email(),
			profilePicture: "https://api.dicebear.com/5.x/initials/svg?backgroundColor=45CCB7,8BF2C5,209FA6&seed=" + username,
			birthGender: ['male', 'female'][Math.floor(Math.random() * 2)],
			currGender: ['cisgender', 'transgender', 'non binary', 'fluid'][Math.floor(Math.random() * 4)],
			sexualOrient: ['heterosexual', 'homosexual', 'bisexual', 'pansexual', 'asexual'][Math.floor(Math.random() * 5)],
			bio: faker.lorem.paragraph(),
			ip: faker.internet.ip(),
			emailValidationCode: faker.random.numeric(6),
			// city: faker.address.city(),
			// country: faker.address.country(),
		};
	}
}

export default FakerService;