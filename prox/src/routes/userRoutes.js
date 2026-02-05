import express from "express";
import login from "../contorllers/authController/login.js";
import signup from "../contorllers/authController/signup.js";
import getModules from "../contorllers/subscriptionController/getModules.js";
import updateModule from "../contorllers/subscriptionController/updateModule.js";
// import getUsername from "../contorllers/userController/getUsername.js";
import formatSitename from "../middlewares/formatSitename.js";

const userRoutes = express.Router();

userRoutes.post("/login", async (req, res) => {
    await login(req, res);
});

userRoutes.post("/signup", formatSitename, async (req, res) => {
    await signup(req, res);
});

// userRoutes.get("/getUsername", async (req, res) => {
//     getUsername(req, res);
// }); 

userRoutes.post("/modules", async (req, res) => {
    console.log("Modules route hit");
    await getModules(req, res);
});

userRoutes.post("/update-module", async (req, res) => {
    await updateModule(req, res);
});

// userRoutes.get("/getUsername", async (req, res) => {
//     getUsername(req, res);
// });

export default userRoutes;