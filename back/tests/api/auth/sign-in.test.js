import supertest from "supertest";
import Application from "../../../src/Application";

const test_server = supertest(Application.app);

const usleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("POST sign-in", () => {
	beforeAll(async () => await Application.start());
	afterEach(async () => await usleep(100));
	afterAll(async () => await Application.stop());

	it("Should return 400", async () => {
		const res = await test_server.post("/auth/sign-in");
		console.log(res.body)
		expect(res.status).toBe(400);
	});
});
