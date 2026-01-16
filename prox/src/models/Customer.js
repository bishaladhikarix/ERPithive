import mongoose from "mongoose";


const customerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    site_name: {
        type: String,
        required: true,
    },
    organization: {
        type: String,
        required: true,
    },
    inventory: {
        type: Boolean,
        default: false,
    },
    hr:{
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;