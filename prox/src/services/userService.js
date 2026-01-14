import Customer from "../models/Customer.js";

export const createUser = async (userData) => {
    const newUser = new Customer(userData);
    return await newUser.save();
};

export const getUserByUsername = async (username) => {
    return await Customer.findOne({ username });
};

export const getAllUsers = async () => {
    return await Customer.find({});
};

export const updateUser = async (username, updateData) => {
    return await Customer.findOneAndUpdate({ username }, updateData, { new: true });
};

export const deleteUser = async (username) => {
    return await Customer.findOneAndDelete({ username });
};  