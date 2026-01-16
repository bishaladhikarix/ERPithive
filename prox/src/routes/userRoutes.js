import express from "express";
import login from "../contorllers/login.js";
import signup from "../contorllers/signup.js";

const userRoutes = express.Router();

userRoutes.post("/login", async (req, res) => {
    login(req, res);
});

userRoutes.post("/signup", async (req, res) => {
    signup(req, res);
});



export default userRoutes;