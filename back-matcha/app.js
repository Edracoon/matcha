require("dotenv").config();

// My exports
const pool = require("./src/db");
const initDatabase = require("./src/db");
const User = require("./src/db/entities/user.entity");

// Global exports
const express = require("express");
const app = express();
const port = 4200;

initDatabase();

// Middleware
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Get all users
app.get("/users", (req, res) => {
  res.status(200).json(Users);
  console.log("Request all users");
});

// Get a user by id
app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  res.status(200).json(Users.find((Users) => Users.id === id));
  console.log(
    "Request a user by id ",
    id,
    "user -> ",
    Users.find((Users) => Users.id === id)
  );
});

app.post("/users", (req, res) => {
  Users.push(req.body);
  res.status(200).json(Users);
});

app.listen(port, () => {
  console.log(`Matcha listening on port ${port}`);
});
