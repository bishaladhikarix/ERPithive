import fetch from "node-fetch";
import { getSiteNameByEmail } from "../../services/userService.js";

const login = async (req, res) => {
    console.log("Login request received with body:", req.body);
      const { email, password } = req.body;
    
      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }


      console.log(process.env.FRAPPE_SERVICE);
      if(!process.env.FRAPPE_SERVICE){
        throw new Error("No Frappe service URL provided in environment variables");
      }
      try {



        try{
          const siteName = await getSiteNameByEmail(email);
          console.log("Site name for user:", siteName);
          
          if(req.headers.host !== siteName){
            return res.status(301).json({ redirect: siteName });
          }else{
            console.log("Host matches site name, proceeding with login.");
          }
          

        }catch(err){
          return res.status(400).json({ message: err.message });
        }

        const backendResponse = await fetch(
          `${process.env.FRAPPE_SERVICE?? "http://saas.localhost:8000"}/api/method/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cmd: "login",
              usr: email,
              pwd: password
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
    
        return res.status(backendResponse.status).json({ success: backendResponse.ok, data }); 
      }  catch (err){
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }
};

export default login;