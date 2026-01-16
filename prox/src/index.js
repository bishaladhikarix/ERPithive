import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import connectToDatabase from "./db.js";
dotenv.config();

const app = express();

/* -------------------- CORS SETUP -------------------- */
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // IMPORTANT for cookies
  })
);
/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());
app.use(cookieParser());
app.use('/user', userRoutes);

/* -------------------- DATABASE CONNECTION -------------------- */
connectToDatabase();



/* -------------------- LOGIN ROUTE -------------------- */
// frontend → express → backend
// app.post("/login", async (req, res) => {
//   console.log("Login request received with body:", req.body);
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({
//       message: "Email and password are required",
//     });
//   }

//   try {
//     const backendResponse = await fetch(
//       "http://sabin.localhost:8000/api/method/login",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           cmd: "login",
//           usr: email,
//           pwd: password
//         }),
//       }
//     );

//     const data = await backendResponse.json();

//     // Forward cookies from backend to browser
//     const cookies = backendResponse.headers.raw()["set-cookie"];
//     if (cookies) {
//       cookies.forEach((cookie) => {
//         console.log("Cookie from backend:", cookie);
//         res.append("Set-Cookie", cookie);
//       });
//     }

//     return res.status(backendResponse.status).json({ success: backendResponse.ok, data }); 
//   }  catch (err){
//     console.error(err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

/* -------------------- CHECK AUTH -------------------- */
// app.get("/check-auth", (req, res) => {
//   const token = req.cookies?.token;

//   if (!token) {
//     return res.json({ loggedIn: false });
//   }

//   return res.json({ loggedIn: true });
// });

/* -------------------- LOGOUT -------------------- */
// app.post("/logout", (req, res) => {
//   res.clearCookie("token", {
//     httpOnly: true,
//     sameSite: "lax",
//     secure: false,
//   });

//   return res.json({ message: "Logged out" });
// });

/*
Example Item Payload:
{
  "item_code": "ITEM-001",
  "item_name": "ITEM-001",
  "is_stock_item": 1,
  "stock_uom": "Nos",
  "uom": "Nos",
  "item_group": "All Item Groups"
}
*/

/* -------------------- CREATE ITEM -------------------- */
// app.post("/items", async (req, res) => {
//   try {
//     // Convert browser cookies back to ERPNext cookie header
//     const cookieHeader = Object.entries(req.cookies)
//       .map(([key, value]) => `${key}=${value}`)
//       .join("; ");

//     console.log("Forwarding cookies to ERPNext:", cookieHeader);

//     const backendResponse = await fetch(
//       "http://192.168.1.94:8080/api/resource/Item",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Cookie": cookieHeader,  // <-- Correct cookie format
//         },
//         body: JSON.stringify({
//           item_code: req.body.item_code,
//           item_name: req.body.item_name,
//           is_stock_item: 1,
//           stock_uom: "Nos",
//           uom: "Nos",
//           item_group: "All Item Groups",
//         }),
//       }
//     );

//     const data = await backendResponse.json();

//     return res
//       .status(backendResponse.status)
//       .json({ success: backendResponse.ok, data });

//   } catch (err) {
//     console.error("Error adding item:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });


// app.post("/signup", async (req, res) => {
//   try {
//     // Convert browser cookies back to ERPNext cookie header
//     // const cookieHeader = Object.entries(req.cookies)
//     //   .map(([key, value]) => `${key}=${value}`)
//     //   .join("; ");

//     // console.log("Forwarding cookies to ERPNext:", cookieHeader);
//     let app = ["saasapp"];
//     if(req.body.modules.hr === true){
//         app.push("hr");
//     }
//     if(req.body.modules.inventory === true){
//         app.push("inventory");
//     }

//     console.log(req.body);
//     const create = process.env.PROVISIONING_SERVICE;
//     if(!create){
//         throw new Error("No provisioning service URL provided in environment variables");
//     }
//     const backendResponse = await fetch(
//       create,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
            
//         },
//         body: JSON.stringify({

//             site_name: req.body.site_name,
//             apps: app,
//             email: req.body.email,
//             password: req.body.password,
//             first_name:req.body.username

//         }),
//       }
//     );
//     try{
//       // http://saas.localhost:8000/api/v2/document/saasuser
//         const createuser = await fetch(
//         `http://saas.localhost:8000/api/v2/document/saasuser`,
//         {
//             method: "POST",
//             headers: {
//             "Content-Type": "application/json",
            
//             },
//             body: JSON.stringify({

                
//                 username: req.body.username,
//                 email: req.body.email


//             }),
//         }
//         );
//         console.log("User created successfully");
//     }catch(err){
//         console.error("User creation failed:", err  
//         )
//     }


//     try{

//       const createOrg = await fetch(
//       // http://saas.localhost:8000/api/v2/document/organization
//       `http://saas.localhost:8000/api/v2/document/organization`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
           
//         },
//         body: JSON.stringify({


//             username: req.body.username,
//             organizationname: req.body.organization,
//             sitename: req.body.site_name,
//             hr: req.body.modules.hr ? 1 : 0,
//             inventory: req.body.modules.inventory ? 1 : 0

//         }),
//       }
//     );

//     console.log("Organization configured successfully");

//     // {
//     // "username": "someone",
//     // "organizationname": "ithive",
//     // "sitename":"something.localhost",
//     // "hr": 0,
//     // "inventory": 1
//     // }
//     const data = await createOrg.json();
//     console.log("done");
//     return res
//       .status(backendResponse.status)
//       .json({ success: backendResponse.ok, data });

//     }catch(err){
//         console.error("Configaration of organization failed:", err);
//         return res.status(500).json({ message: "Server error" });
//     }



    

//   } catch (err) {
//     console.error("Error :", err);
//     return res.status(500).json({ message: "Server error" });
//   }



// });

// app.get("/getUsername", async (req, res) => {
//   try {
//     // http://saas.localhost:8000/api/v2/document/saasuser?filters=[["email","=","${req.query.email}"]]
    
//     const backendResponse = await fetch(
//       `http://saas.localhost:8000/api/v2/document/saasuser?filters=[["email","=","${req.query.email}"]]`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
           
//         },
//       }
//     );

//     const data = await backendResponse.json();

//     return res
//       .status(backendResponse.status)
//       .json({ success: backendResponse.ok, data });

//   } catch (err) {
//     console.error("Error fetching username:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

// app.get("/getmodules", async (req, res) => {
//   try {
//     // http://saas.localhost:8000/api/v2/document/organization?filters=[["username","=","${req.query.username}
//     const backendResponse = await fetch(
//       `http://saas.localhost:8000/api/v2/document/organization?filters=[["username","=","${req.query.username}"]]`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
           
//         },
//       }
//     );

//     const data = await backendResponse.json();

//     return res
//       .status(backendResponse.status)
//       .json({ success: backendResponse.ok, data });

//   } catch (err) {
//     console.error("Error fetching modules:", err);
//     return res.status(500).json({ message: "Server error" });
//   } 
// });

// app.get("/getorganizations", async (req, res) => {
//   try {
//     const backendResponse = await fetch(
//       `http://saas.localhost:8000/api/v2/document/organization?filters=[["username","=","${req.query.username}"]]`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
           
//         },
//       }
//     );

//     const data = await backendResponse.json();

//     return res
//       .status(backendResponse.status)
//       .json({ success: backendResponse.ok, data });

//   } catch (err) {
//     console.error("Error fetching organizations:", err);
//     return res.status(500).json({ message: "Server error" });
//   } 
// });


// app.patch("/update-module", async (req, res) => {
//   try {
//     const backendResponse = await fetch(
//       `http://saas.localhost:8000/api/v2/document/organization/${req.body.organization}`,
//       {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
           
//         },
//         body: JSON.stringify({

//             hr: req.body.modules.hr ? 1 : 0,
//             inventory: req.body.modules.inventory ? 1 : 0

//         }),
//       }
//     );

//     const data = await backendResponse.json();

//     return res
//       .status(backendResponse.status)
//       .json({ success: backendResponse.ok, data });

//   } catch (err) {
//     console.error("Error updating module:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });



app.listen(process.env.PORT || 5000, () => {
  console.log(`Express BFF running on port ${process.env.PORT || 5000}`);
});
