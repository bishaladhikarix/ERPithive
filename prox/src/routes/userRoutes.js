import express from "express";
import login from "../contorllers/authController/login.js";
import signup from "../contorllers/authController/signup.js";
import getModules from "../contorllers/subscriptionController/getModules.js";
import updateModule from "../contorllers/subscriptionController/updateModule.js";
import getUsername from "../contorllers/userController/getUsername.js";

const userRoutes = express.Router();

userRoutes.post("/login", async (req, res) => {
    login(req, res);
});

userRoutes.post("/signup", async (req, res) => {
    signup(req, res);
});

userRoutes.get("/getUsername", async (req, res) => {
    getUsername(req, res);
}); 

userRoutes.get("/getModules", async (req, res) => {
    getModules(req, res);
});

userRoutes.put("/update-module", async (req, res) => {
    updateModule(req, res);
});

userRoutes.get("/getUsername", async (req, res) => {
    getUsername(req, res);
});

export default userRoutes;