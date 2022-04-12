import express from "express";
import * as userWrapper from "../wrapper/user_wrapper.js";

export const router = express.Router();

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

router.post("/register", async (req, res) => {
  console.log(req.body);
  res.json({ hey: "hello" });
});
