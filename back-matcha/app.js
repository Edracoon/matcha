import {} from "dotenv/config";
import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import { populateDatabase, truncateDatabase } from "./src/database_manager.js";
import { user } from "./src/user/user_manager.js";
import { auth, authenticateJWT } from "./src/auth/auth_manager.js";
import fetch, {Headers} from "node-fetch";

const port = 3000;

export const app = express();

app.use(express.json());
app.use(cors());
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


const API_COUNTRY_KEY= process.env.API_COUNTRY_KEY;

app.get("/all-countries", (req, res) => {
  var headers = new Headers();
  headers.append("X-CSCAPI-KEY", API_COUNTRY_KEY);
  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };
  fetch("https://api.countrystatecity.in/v1/countries", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      result = result.map((value) => {
        return { value: value.iso2, label: value.name };
      });
      res.send(result);
    })
    .catch((error) => console.log("error", error));
});

app.get("/all-cities/:country", (req, res) => {
  const country = req.params.country;
  var headers = new Headers();
    headers.append("X-CSCAPI-KEY", API_COUNTRY_KEY);
    var requestOptions = {
    method: 'GET',
    headers: headers,
    redirect: 'follow'
    };
    fetch(`https://api.countrystatecity.in/v1/countries/${country}/cities`, requestOptions)
      .then(response => response.json())
      .then(result => {
        result = result.map((value) => {
          return { value: value.id, label: value.name };
        });
        res.send(result);
      });
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

// Middlewares
app.use("/api/user", authenticateJWT, user);
app.use("/api/auth", auth);

// Default route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/populate/:nb", (req, res) => {
  populateDatabase(parseInt(req.params.nb));
  res.send(`Populate/${parseInt(req.params.nb)}`);
});

app.get("/truncate", (req, res) => {
  truncateDatabase();
  res.send("Truncate");
});

app.listen(port, () => {
  console.log(`Matcha listening on port ${port}`);
});
