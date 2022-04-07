import {} from "dotenv/config";
import pkg from "express";

import { populateDatabase, pool, truncateDatabase } from "./src/manager.js";

const express = pkg;

const app = express();
const port = 4200;

// Middleware
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/populate/:nb", (req, res) => {
  populateDatabase(parseInt(req.params.nb));
  res.send("Populate");
});

app.get("/truncate", (req, res) => {
  truncateDatabase();
  res.send("Truncate");
});

app.listen(port, () => {
  console.log(`Matcha listening on port ${port}`);
});
