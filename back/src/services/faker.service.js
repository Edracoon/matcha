import { faker } from '@faker-js/faker';

class FakerService {

	static userSkeleton() {
		const username = faker.internet.userName();
		return {
			username: username,
			password: faker.internet.password(),
			firstname: faker.name.firstName(),
			lastname: faker.name.lastName(),
			email: faker.internet.email(),
			birthGender: ['male', 'female'][Math.floor(Math.random() * 2)],
			currGender: ['cisgender', 'transgender', 'non binary', 'fluid'][Math.floor(Math.random() * 4)],
			sexualOrient: ['heterosexual', 'homosexual', 'bisexual', 'pansexual', 'asexual'][Math.floor(Math.random() * 5)],
			bio: faker.lorem.paragraph().slice(0, 299),
			ip: faker.internet.ip(),
			emailValidated: true,
			emailValidationCode: faker.random.numeric(6),
			// city: faker.address.city(),
			// country: faker.address.country(),
		};
	}
}

export default FakerService;