import {} from "dotenv/config";
import { pool } from "../../app.js";

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
