import {} from "dotenv/config";
import { faker } from "@faker-js/faker";
import mysql from "mysql2/promise";
import {
  insertImg,
  insertOri,
  insertTra,
  insertUser,
  insertTag,
  insertUsertag,
} from "./wrapperSQL.js";

/*
 ** Utils
 */
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

/*
 ** Using pool system to reuse connections previously released
 */
export const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

/*
 ** Handle pool potential errors
 */
pool.getConnection((err, connection) => {
  console.log("pool.getConnection() called.");
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    }
  }
  if (connection) connection.release();
  return;
});

export async function truncateDatabase() {
  await pool.query("DELETE FROM USER_TAG;");
  await pool.query("DELETE FROM TAG;");
  await pool.query("DELETE FROM IMG;");
  await pool.query("DELETE FROM USER;");
  await pool.query("DELETE FROM TRA;");
  await pool.query("DELETE FROM ORI;");
  await pool.query("ALTER TABLE USER AUTO_INCREMENT = 1");
  await pool.query("ALTER TABLE TRA AUTO_INCREMENT = 1");
  await pool.query("ALTER TABLE ORI AUTO_INCREMENT = 1");
  await pool.query("ALTER TABLE IMG AUTO_INCREMENT = 1");
  await pool.query("ALTER TABLE USER_TAG AUTO_INCREMENT = 1");
  await pool.query("ALTER TABLE TAG AUTO_INCREMENT = 1");
}

export async function populateDatabase(nb) {
  await insertTra({ min: "18", max: "99", activated: "1" });
  await insertTra({ min: "30", max: "50", activated: "1" });
  await insertTra({ min: "60", max: "90", activated: "1" });

  await insertOri({ design: "undefined", activated: "1" });
  await insertOri({ design: "heterosexual", activated: "1" });
  await insertOri({ design: "homosexual", activated: "1" });
  await insertOri({ design: "bisexual", activated: "1" });

  await insertTag({ design: "Voyage" });
  await insertTag({ design: "Photo" });
  await insertTag({ design: "Code" });
  await insertTag({ design: "Sport" });
  await insertTag({ design: "Video games" });
  await insertTag({ design: "Animals" });
  await insertTag({ design: "Cat" });
  await insertTag({ design: "Dog" });
  await insertTag({ design: "LGBTQ+" });
  await insertTag({ design: "Music" });

  for (let i = 1; i <= nb; i++) {
    await insertUser(generateUser());
    await insertImg({
      user_id: i,
      // file: faker.image.imageUrl(640, 480, "people", true, true),
      file: faker.internet.avatar(),
    });
    await insertUsertag({
      user_id: i,
      tag_id: Math.floor(Math.random() * 10) + 1,
    });
    await insertUsertag({
      user_id: i,
      tag_id: Math.floor(Math.random() * 10) + 1,
    });
  }
}

function generateUser() {
  let gender = faker.name.gender(true);
  let firstname = faker.name.firstName(gender.toLowerCase());
  let familyname = faker.name.lastName();
  let city = faker.address.city();
  let ADR1 = faker.address.streetAddress(false);
  let ADR2 = city + ", " + faker.address.state();
  return {
    login: faker.internet.userName(firstname).sqlizeStr(),
    pwd: faker.internet.password().sqlizeStr(),
    firstname: firstname.sqlizeStr(),
    familyname: familyname.sqlizeStr(),
    email: faker.internet.email(firstname, familyname).sqlizeStr(),
    genre: gender.sqlizeStr(),
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
