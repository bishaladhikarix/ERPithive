import { getCustomerFeaturesByEmail } from "../../services/userService.js";



const getModules = async (req, res) => {
    // Placeholder for future implementation
    console.log(req.body);
    const email = req.body.email;
    if(!email){
        return res.status(400).json({ message: "Email query parameter is required." });
    }
    const response = await getCustomerFeaturesByEmail(email);
    if(response != null){
        return res.status(200).json({ modules: response });
    }else{
        return res.status(404).json({ message: "No modules found for the given email." });
    }
    
};

export default getModules;