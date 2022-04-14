import express from "express";
import * as userWrapper from "../wrapper/user_wrapper.js";
import bcrypt from "bcrypt";
import { pool } from "../../app.js";
import jwt from "jsonwebtoken";

export const router = express.Router();

const saltRounds = 10;

router.post("/login", async (req, res) => {
  // Read username and password from request body
  const { username, password } = req.body;
  console.log(username, password);

  // get the user from database
  const user = await userWrapper.getUserByUsername(username);
  console.log(user);
  if (!user) {
    res.send("Username or password incorrect");
    return;
  }

  // Verify password with encrypted password
  let match = false;
  try {
    match = await bcrypt.compare(password, user.password);
  } catch (err) {
    console.log(err);
    res.send({ response: "Username or password incorrect" });
    return;
  }

  if (user && match === true) {
    // Generate an access token
    const accessToken = jwt.sign(
      { username: user.username, role: "member" },
      process.env.MATCHA_SECRET
    );

    res.json({
      accessToken,
    });
  } else {
    res.send({ response: "Username or password incorrect" });
    return;
  }
});

router.post("/register", async (req, res) => {
  console.log(req.body);

  let password = req.body.password1;
  let encryptedPassword;

  // Encrypt password
  try {
    encryptedPassword = await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.log(error);
  }

  // Insert user in db
  const ret = await userWrapper.insertUser({
    username: req.body.username,
    password: encryptedPassword,
    firstname: req.body.firstname,
    familyname: req.body.lastname,
    email: req.body.email,
  });

  // Check if success and send appropriate response
  switch (ret) {
    case "success":
      res.json({ response: "success" });
      return;
    case "email taken":
      res.json({ response: "email taken" });
      return;
    case "username taken":
      res.json({ response: "username taken" });
      return;
    case "register content error":
      res.json({ response: "register content error" });
      return;
  }
});

router.get("/id/:id", async (req, res) => {
  let id = parseInt(req.params.id);
  if (id != id) {
    res.send("error id is NaN");
  } else {
    userWrapper.getUserById(id).then((value, reason) => {
      res.json(value[0]);
    });
  }
});

router.get("/email/:email", async (req, res) => {
  let email = req.params.email;
  userWrapper.getUserByEmail(email).then((value) => {
    res.json(value[0][0]);
  });
});
