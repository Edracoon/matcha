import supertest from "supertest";
import Application from "../../../src/Application";
import myqslHelper from "../../mysql-helper";

const test_server = supertest(Application.app);

const usleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("POST sign-in", () => {
	beforeAll(async () => await Application.start());
	afterEach(async () => await usleep(100));
	afterAll(async () => {
		await Application.stop();
		await myqslHelper.resetDB(Application);
	});

	it("Should return 400", async () => {
		const res = await test_server.post("/auth/sign-in");
		expect(res.status).toBe(400);
	});
});
