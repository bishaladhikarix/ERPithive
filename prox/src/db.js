import mongoose from "mongoose";

const connectToDatabase = async () => {
    try{
        const uri = process.env.CONNECTION_STRING;
        if(!uri){
            throw new Error("No connection string provided in environment variables");
        }
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to the database successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

export default connectToDatabase;   