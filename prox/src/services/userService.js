import Customer from "../models/Customer.js";

export const createUser = async (userData) => {
    const newUser = new Customer(userData);
    return await newUser.save();
};

export const getUserByUsername = async (username) => {
    return await Customer.findOne({ username });
};

export const getUserByEmail = async (email) => {
    return await Customer.findOne({ email });
};

export const getAllUsers = async () => {
    return await Customer.find({});
};

export const updateUser = async (email, updateData) => {
    return await Customer.findOneAndUpdate({ email }, updateData, { new: true });
};

export const deleteUser = async (username) => {
    return await Customer.findOneAndDelete({ username });
};  

export const getCustomerFeaturesByEmail = async (email) => {
    try {
        const customer = await Customer.findOne({ email: email }, 'hr inventory');

        if (!customer) {
            return null; 
        }
        return {
            hr: customer.hr,
            inventory: customer.inventory
        };
    } catch (error) {
        console.error("Error fetching customer features:", error);
        throw error;
    }
}