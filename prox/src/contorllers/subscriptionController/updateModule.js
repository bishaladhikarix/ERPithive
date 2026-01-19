import { updateUser } from "../../services/userService.js";

const updateModule = async(req, res) => {
    // Placeholder for future implementation
    const email = req.body.email;
    const modules = req.body.moduleData;
    console.log(req.body);
    if(!email || !modules){
        return res.status(400).json({ message: "Email and modules are required in the request body." });
    }
    const updateData = {
        inventory: modules.inventory || false,
        hr: modules.hr || false,
    };
    try{
        const updatedUser = await updateUser(email, updateData);
        if(updatedUser){
            return res.status(200).json({ message: "Modules updated successfully.", user: updatedUser });
        }else{
            return res.status(404).json({ message: "User not found." });
        }
    }catch(error){
        console.error("Error updating modules:", error);
        return res.status(500).json({ message: "Internal server error." });
    }

    
};
export default updateModule;