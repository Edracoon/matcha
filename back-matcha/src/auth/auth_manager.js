import express from "express";
import * as userWrapper from "../wrapper/user_wrapper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const auth = express.Router();

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Bearer format = split(' ');
    console.log("authenticateJWT -> ", token);
    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const saltRounds = 10;

auth.post("/login", async (req, res) => {
  // Read username and password from request body
  const { username, password } = req.body;
  console.log(username, password);

  // get the user from database
  const user = await userWrapper.getUserByUsername(username);
  console.log(user);
  if (!user) {
    res.send({ response: "Username or password incorrect" });
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
      process.env.MATCHA_SECRET,
      { expiresIn: "20m" }
    );
    const refreshToken = jwt.sign(
      { username: user.username, role: "member" },
      process.env.MATCHA_REFRESH_SECRET
    );

    userWrapper.UserUpdateRefreshToken(username, refreshToken);

    res.json({
      accessToken,
    });
  } else {
    res.send({ response: "Username or password incorrect" });
    return;
  }
});

auth.post("/register", async (req, res) => {
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

auth.post("/jwt", async (req, res) => {
  console.log(req.body);
  const { token } = req.body;
  try {
    const ret = jwt.verify(token, process.env.MATCHA_SECRET);
    console.log(ret);
    res.json({ response: true });
  } catch (e) {
    console.log("Error in jwt.verify");
    res.json({ response: false });
  }
});
