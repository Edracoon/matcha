import {} from "dotenv/config";
import { pool } from "../../app.js";

// POST
export async function insertUser(User) {
  try {
    await pool
      .query("SELECT COUNT(*) AS cnt FROM USER WHERE email = ?", [User.email])
      .then((data) => {
        if (data[0][0].cnt > 0) {
          throw "EMAIL ALREADY EXISTS";
        }
      });
    await pool
      .query("SELECT COUNT(*) AS cnt FROM USER WHERE username = ?", [
        User.username,
      ])
      .then((data) => {
        if (data[0][0].cnt > 0) {
          throw "USERNAME ALREADY EXISTS";
        }
      });
    await pool.query(
      `INSERT INTO USER (username, password, firstname, familyname, email, genre1, genre2, bio, last_ip, ADR1, ADR2, city, is_online, tra_id, ori_id, fake_counter) VALUES (
            '${User.username}',
            '${User.password}',
            '${User.firstname}',
            '${User.familyname}',
            '${User.email}',
            '${User.genre1}',
            '${User.genre2}',
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
    return "success";
  } catch (error) {
    console.log("======== Error in InsertUser =========\n", error);
    return "failed";
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

// GET
export async function getUserById(id) {
  try {
    if (id != id) throw "ID IS NAN";
    let results = await pool.query(`SELECT * FROM USER WHERE id = ${id};`);
    return results;
  } catch (error) {
    console.log("======== Error in getUserById =========\n", error);
  }
}

export async function getUserByEmail(email) {
  try {
    let results = await pool.query(`SELECT * FROM USER WHERE email = ?;`, [
      email,
    ]);
    return results;
  } catch (error) {
    console.log("======== Error in getUserByEmail =========\n", error);
  }
}

export async function getUserByUsername(username) {
  try {
    let results = await pool.query(
      `SELECT * FROM USER WHERE username = ${username};`
    );
    return results;
  } catch (error) {
    console.log("======== Error in getUserByUsername =========\n", error);
  }
}
