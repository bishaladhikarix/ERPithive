import fetch from "node-fetch";
import { createUser } from "../../services/userService.js";


const signup = async (req, res) => {
    console.log("Signup");
    try {
        // Convert browser cookies back to ERPNext cookie header
        // const cookieHeader = Object.entries(req.cookies)
        //   .map(([key, value]) => `${key}=${value}`)
        //   .join("; ");
    
        // console.log("Forwarding cookies to ERPNext:", cookieHeader);
        let app = ["saasapp"];
        if(req.body.modules.hr === true){
            console.log("HR module selected");
        }
        if(req.body.modules.inventory === true){
            console.log("Inventory module selected");
        }
        app.push("erpnext");
    
        console.log(req.body);
        const create = process.env.PROVISIONING_SERVICE;
        if(!create){
            throw new Error("No provisioning service URL provided in environment variables");
        }
        const backendResponse = await fetch(
          create,
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
                        first_name:req.body.username
            
                    }),
                }
            );
        const data = await backendResponse.json();
        console.log("Response from provisioning service:", data);
        if (!backendResponse.ok) {
            return res.status(backendResponse.status).json({ message: data.message || "Error during site provisioning" });
        }
    
        // Create user in local database
        const newUser = await createUser({
            username: req.body.username,
            email: req.body.email,
            site_name: req.body.site_name,
            organization: req.body.organization || "",
            inventory: req.body.modules.inventory || false,
            hr: req.body.modules.hr || false,
        });
        console.log("New user created in local DB:", newUser);
    
        return res.status(201).json({ message: "Signup successful", data });
    
    
    
        
    
      } catch (err) {
        console.error("Error :", err);
        return res.status(500).json({ message: "Server error" });
    }
}



export default signup;