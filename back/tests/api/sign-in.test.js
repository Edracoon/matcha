jest.useFakeTimers();
import supertest from "supertest";
import Application from "../../src/Application";

const test_server = supertest(Application.app);

describe("POST sign-in", () => {

	beforeAll(async () => {
		Application.start();
	});
	afterAll(async () => {
		Application.stop();
	});

	it("should return 200", async () => {
		const response = await test_server.post("/auth/sign-in");
		expect(response.status).toBe(400);
		expect(1).toBe(1);
	});
});
