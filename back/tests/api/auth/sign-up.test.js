import supertest from "supertest";
import Application from "../../../src/Application";
import myqslHelper from "../../mysql-helper";

const test_server = supertest(Application.app);

const usleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("POST sign-up", () => {
	beforeAll(async () => await Application.start());
	afterEach(async () => await usleep(100));
	afterAll(async () => {
		await Application.stop();
		await myqslHelper.resetDB(Application);
	});

	describe("Error", () => {
		it("Should return all the missing fields", async () => {
			const res = await test_server.post("/auth/sign-up");
			expect(res.status).toBe(400);
			expect(res.body).toStrictEqual({
				error: 'form.invalid',
				errors: [
				  { firstname: 'This field is required.' },
				  { lastname: 'This field is required.' },
				  { email: 'This field is required.' },
				  { username: 'This field is required.' },
				  { password: 'This field is required.' },
				  { confirmPassword: 'This field is required.' }
				]
			});
		});

		it("should give emails errors", async () => {
			let res = await test_server.post("/auth/sign-up")
				.send({
					firstname: "John",
					lastname: "Doe",
					username: "johndoe",
					password: "1234567",
					confirmPassword: "1234567"
				});;
			expect(res.status).toBe(400);
			expect(res.body).toStrictEqual({
				error: 'form.invalid',
				errors: [
					{ email: 'This field is required.' },
				],
			});

			res = await test_server.post("/auth/sign-up")
				.send({
					firstname: "John",
					lastname: "Doe",
					email: "johndoe",
					username: "johndoe",
					password: "1234567",
					confirmPassword: "1234567"
				});;
			expect(res.status).toBe(400);
			expect(res.body).toStrictEqual({
				error: 'form.invalid',
				errors: [
					{ email: 'Invalid email address' },
				],
			});

			res = await test_server.post("/auth/sign-up")
				.send({
					firstname: "John",
					lastname: "Doe",
					email: "",
					username: "johndoe",
					password: "1234567",
					confirmPassword: "1234567"
				});;
			expect(res.status).toBe(400);
			expect(res.body).toStrictEqual({
				error: 'form.invalid',
				errors: [
					{ email: 'Invalid email address' },
				],
			});
		});

		it("should give passwords errors", async () => {
			let res = await test_server.post("/auth/sign-up")
				.send({
					firstname: "John",
					lastname: "Doe",
					email: "johndoe@gmail.com",
					username: "johndoe",
					password: "1234567",
					confirmPassword: "12345"
				});;
			expect(res.status).toBe(400);
			expect(res.body).toStrictEqual({
				error: 'form.invalid',
				errors: [
					{ confirmPassword: 'Passwords are not the same.' },
				],
			});

			res = await test_server.post("/auth/sign-up")
				.send({
					firstname: "John",
					lastname: "Doe",
					email: "johndoe@gmail.com",
					username: "johndoe",
					password: "Password must be less than 72 charactersPassword must be less than 72 charactersPassword must be less than 72 charactersPassword must be less than 72 charactersPassword must be less than 72 characters",
					confirmPassword: "Password must be less than 72 charactersPassword must be less than 72 charactersPassword must be less than 72 charactersPassword must be less than 72 charactersPassword must be less than 72 characters"
				});;
			expect(res.status).toBe(400);
			expect(res.body).toStrictEqual({
				error: 'form.invalid',
				errors: [
					{ password: 'Password must be less than 72 characters' },
				],
			});
		});
	});

	describe("Success", () => {
		it("Should successfully sign-up", async () => {
			const res = await test_server.post("/auth/sign-up")
				.send({
					firstname: "John",
					lastname: "Doe",
					email: "johndoe@gmail.com",
					username: "johndoe69",
					password: "1234567",
					confirmPassword: "1234567"
				});
			expect(res.status).toBe(200);
		});
	});
});