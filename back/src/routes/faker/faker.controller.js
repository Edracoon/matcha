import { faker } from "@faker-js/faker";
import { database } from "../app.js";
import { insertOri, insertTra } from "./wrapper/ori_tra_wrapper.js";
import * as userWrapper from "./wrapper/user_wrapper.js";

// replaceAll
String.prototype.sqlizeStr = function () {
	let str = this;
	let idx = str.indexOf("'");
	for (let i = 0; idx != -1; i++) {
		str = str.slice(0, idx) + "'" + str.slice(idx, str.length);
		idx = str.indexOf("'", idx + 2);
	}
	return str;
};

function generateUser() {
	let gender = faker.name.gender(true).toLowerCase();
	let firstname = faker.name.firstName(gender.toLowerCase());
	let lastname = faker.name.lastName();
	let city = faker.address.city();
	let ADR1 = faker.address.streetAddress(false);
	let ADR2 = city + ", " + faker.address.state();
	return {
		username: faker.internet.userName(firstname).sqlizeStr(),
		password: faker.internet.password().sqlizeStr(),
		firstname: firstname.sqlizeStr(),
		lastname: lastname.sqlizeStr(),
		email: faker.internet.email(firstname, lastname).sqlizeStr(),
		genre1: gender,
		genre2: "cisgender",
		bio: faker.lorem.sentences(3).sqlizeStr(),
		last_ip: faker.internet.ip().sqlizeStr(),
		ADR1: ADR1.sqlizeStr(),
		ADR2: ADR1.sqlizeStr(),
		city: city.sqlizeStr(),
		is_online: 0,
		tra_id: 1,
		ori_id: Math.floor(Math.random() * (4 - 1 + 1) + 1),
		fake_counter: 0,
	};
}


export default class fakerController {

	async truncate(req, res) {
		await pool.query("DELETE FROM USER_TAG;");
		await pool.query("DELETE FROM TAG;");
		await pool.query("DELETE FROM IMG;");
		await pool.query("DELETE FROM USER;");
		await pool.query("DELETE FROM TRA;");
		await pool.query("ALTER TABLE USER AUTO_INCREMENT = 1");
		await pool.query("ALTER TABLE TRA AUTO_INCREMENT = 1");
		await pool.query("ALTER TABLE IMG AUTO_INCREMENT = 1");
		await pool.query("ALTER TABLE USER_TAG AUTO_INCREMENT = 1");
		await pool.query("ALTER TABLE TAG AUTO_INCREMENT = 1");
		res.send("database truncated");
	}

	async populate(req, res) {
		const nb = +req.params.nb;
		await insertTra({ min: "18", max: "99", activated: "1" });
		await insertTra({ min: "30", max: "50", activated: "1" });
		await insertTra({ min: "60", max: "90", activated: "1" });

		await insertOri({ design: "undefined", activated: "1" });
		await insertOri({ design: "heterosexual", activated: "1" });
		await insertOri({ design: "homosexual", activated: "1" });
		await insertOri({ design: "bisexual", activated: "1" });
		await userWrapper.insertTag({ design: "Voyage" });
		await userWrapper.insertTag({ design: "Photo" });
		await userWrapper.insertTag({ design: "Code" });
		await userWrapper.insertTag({ design: "Sport" });
		await userWrapper.insertTag({ design: "Video games" });
		await userWrapper.insertTag({ design: "Animals" });
		await userWrapper.insertTag({ design: "Cat" });
		await userWrapper.insertTag({ design: "Dog" });
		await userWrapper.insertTag({ design: "LGBTQ+" });
		await userWrapper.insertTag({ design: "Music" });

		for (let i = 1; i <= nb; i++) {
			await userWrapper.insertUser(generateUser());
			await userWrapper.insertImg({
			user_id: i,
			// file: faker.image.imageUrl(640, 480, "people", true, true),
			file: faker.internet.avatar(),
			});
			await userWrapper.insertUsertag({
			user_id: i,
			tag_id: Math.floor(Math.random() * 10) + 1,
			});
			await userWrapper.insertUsertag({
			user_id: i,
			tag_id: Math.floor(Math.random() * 10) + 1,
			});
		}
		res.send(`database populated ${parseInt(req.params.nb)}`);
	}
}