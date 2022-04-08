import {} from "dotenv/config";
import { pool } from "./manager.js";

export async function insertUser(User) {
  try {
    await pool.query(
      `INSERT INTO USER (login, pwd, firstname, familyname, email, genre, bio, last_ip, ADR1, ADR2, city, is_online, tra_id, ori_id, fake_counter) VALUES (
		  '${User.login}',
		  '${User.pwd}',
		  '${User.firstname}',
		  '${User.familyname}',
		  '${User.email}',
		  '${User.genre}',
		  '${User.bio}',
		  '${User.last_ip}',
		  '${User.ADR1}',
		  '${User.ADR2}',
		  '${User.city}',
		  '${User.is_online}',
		  '${User.tra_id}',
		  '${User.ori_id}',
		  '${User.fake_counter}')`
    );
  } catch (error) {
    console.log("======== Error in InsertUser =========\n", error);
  }
}

export async function insertOri(ori) {
  try {
    await pool.query(
      `INSERT INTO ORI (design, activated) VALUES ('${ori.design}', '${ori.activated}')`
    );
  } catch (error) {
    console.log("======== Error in InsertOri =========\n", error);
  }
}

export async function insertTra(tra) {
  try {
    await pool.query(
      `INSERT INTO TRA (min, max, activated) VALUES ('${tra.min}', '${tra.max}', '${tra.activated}')`
    );
  } catch (error) {
    console.log("======== Error in InsertTra =========\n", error);
  }
}

export async function insertImg(img) {
  try {
    await pool.query(
      `INSERT INTO IMG (user_id, file) VALUES ('${img.user_id}', '${img.file}')`
    );
  } catch (error) {
    console.log("======== Error in InsertImg =========\n", error);
  }
}

export async function insertTag(tag) {
  try {
    await pool.query(`INSERT INTO TAG (design) VALUES ('${tag.design}')`);
  } catch (error) {
    console.log("======== Error in InsertTag =========\n", error);
  }
}

export async function insertUsertag(usertag) {
  try {
    await pool.query(
      `INSERT INTO USER_TAG (user_id, tag_id) VALUES ('${usertag.user_id}', '${usertag.tag_id}')`
    );
  } catch (error) {
    console.log("======== Error in InsertUsertag =========\n", error);
  }
}
