import {} from "dotenv/config";
import { pool } from "../../app.js";

// POST
export async function insertUser(User) {
  try {
    if (
      !User.email ||
      !User.password ||
      !User.username ||
      !User.firstname ||
      !User.familyname
    )
      throw "register content error";
    await pool
      .query("SELECT COUNT(*) AS cnt FROM USER WHERE email = ?", [User.email])
      .then((data) => {
        if (data[0][0].cnt > 0) {
          throw "email taken";
        }
      });
    await pool
      .query("SELECT COUNT(*) AS cnt FROM USER WHERE username = ?", [
        User.username,
      ])
      .then((data) => {
        if (data[0][0].cnt > 0) {
          throw "username taken";
        }
      });
    await pool.query(`INSERT INTO USER SET ?`, User);
    return "success";
  } catch (error) {
    console.log("======== Error in InsertUser =========\n", error);
    return error;
  }
}

export async function UserUpdateRefreshToken(username, refreshToken) {
  try {
    await pool.query(
      `UPDATE USER SET refreshToken = '${refreshToken}' WHERE username = '${username}';`
    );
  } catch (error) {
    console.log("======== Error in UserUpdateRefreshToken =========\n", error);
    return error;
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
      `SELECT * FROM USER WHERE username = '${username}';`
    );
    return results[0][0];
  } catch (error) {
    console.log("======== Error in getUserByUsername =========\n", error);
    return false;
  }
}
