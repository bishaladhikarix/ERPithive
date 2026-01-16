import fetch from "node-fetch";

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
        const backendResponse = await fetch(
          `${process.env.FRAPPE_SERVICE?? "http://sabin.localhost:8000"}/api/method/login`,
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