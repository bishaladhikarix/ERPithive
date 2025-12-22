import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());
app.use(cookieParser());

/* -------------------- CORS SETUP -------------------- */
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // IMPORTANT for cookies
  })
);

/* -------------------- LOGIN ROUTE -------------------- */
// frontend → express → backend
app.post("/login", async (req, res) => {
  const { usr: username, pwd: password, cmd } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  try {
    const backendResponse = await fetch(
      "http://192.168.1.94:8080/api/method/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cmd,
          usr: username,
          pwd: password,
        }),
      }
    );

    const data = await backendResponse.json();

    // Forward cookies from backend to browser
    const cookies = backendResponse.headers.raw()["set-cookie"];
    if (cookies) {
      cookies.forEach((cookie) => {
        console.log("Cookie from backend:", cookie);
        res.append("Set-Cookie", cookie);
      });
    }

    return res.status(backendResponse.status).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* -------------------- CHECK AUTH -------------------- */
app.get("/check-auth", (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.json({ loggedIn: false });
  }

  return res.json({ loggedIn: true });
});

/* -------------------- LOGOUT -------------------- */
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  return res.json({ message: "Logged out" });
});

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
app.post("/items", async (req, res) => {
  try {
    // Convert browser cookies back to ERPNext cookie header
    const cookieHeader = Object.entries(req.cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join("; ");

    console.log("Forwarding cookies to ERPNext:", cookieHeader);

    const backendResponse = await fetch(
      "http://192.168.1.94:8080/api/resource/Item",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookieHeader,  // <-- Correct cookie format
        },
        body: JSON.stringify({
          item_code: req.body.item_code,
          item_name: req.body.item_name,
          is_stock_item: 1,
          stock_uom: "Nos",
          uom: "Nos",
          item_group: "All Item Groups",
        }),
      }
    );

    const data = await backendResponse.json();

    return res
      .status(backendResponse.status)
      .json({ success: backendResponse.ok, data });

  } catch (err) {
    console.error("Error adding item:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


app.post("/signup", async (req, res) => {
  try {
    // Convert browser cookies back to ERPNext cookie header
    // const cookieHeader = Object.entries(req.cookies)
    //   .map(([key, value]) => `${key}=${value}`)
    //   .join("; ");

    // console.log("Forwarding cookies to ERPNext:", cookieHeader);
    let app = ["saasapp"];
    if(req.body.modules.hr === true){
        app.push("hr");
    }
    if(req.body.modules.inventory === true){
        app.push("inventory");
    }


    const backendResponse = await fetch(
      "http://localhost:9010/createsite",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            
        },
        body: JSON.stringify({

            site_name: req.body.site_name,
            apps: app,
            email: req.body.email,
            password: req.body.password,
            first_name:req.body.first_name

        }),
      }
    );
    try{
        const createuser = await fetch(
        `http://saas.localhost:8000/api/v2/document/saasuser`,
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            
            },
            body: JSON.stringify({

                
                username: req.body.first_name,
                email: req.body.email


            }),
        }
        );
    }catch(err){
        console.error("User creation failed:", err  
        )
    }


    try{

    const backendResponse = await fetch(
      `http://saas.localhost:8000/api/v2/document/organization`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           
        },
        body: JSON.stringify({


            username: req.body.first_name,
            organizationname: req.body.organization,
            sitename: req.body.site_name,
            hr: req.body.modules.hr ? 1 : 0,
            inventory: req.body.modules.inventory ? 1 : 0

        }),
      }
    );

    // {
    // "username": "someone",
    // "organizationname": "ithive",
    // "sitename":"something.localhost",
    // "hr": 0,
    // "inventory": 1
    // }

    }catch(err){
        console.error("Configaration of organization failed:", err);
        return res.status(500).json({ message: "Server error" });
    }

    const data = await backendResponse.json();

    return res
      .status(backendResponse.status)
      .json({ success: backendResponse.ok, data });

  } catch (err) {
    console.error("Error :", err);
    return res.status(500).json({ message: "Server error" });
  }



});


app.patch("/update-module", async (req, res) => {
  try {
    const backendResponse = await fetch(
      `http://saas.localhost:8000/api/v2/document/organization/${req.body.organization}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
           
        },
        body: JSON.stringify({

            hr: req.body.modules.hr ? 1 : 0,
            inventory: req.body.modules.inventory ? 1 : 0

        }),
      }
    );

    const data = await backendResponse.json();

    return res
      .status(backendResponse.status)
      .json({ success: backendResponse.ok, data });

  } catch (err) {
    console.error("Error updating module:", err);
    return res.status(500).json({ message: "Server error" });
  }
});



app.listen(5000, () => {
  console.log("Express BFF running on port 5000");
});
