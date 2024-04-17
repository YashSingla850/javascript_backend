import mongoose from "mongoose";
import { DB_NAME } from "../constansts.js";


const connectDB = async () => {
    try {
        console.log("getting into connectionsStage")
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n mongoDB Connected. DB host: ${connectionInstance.connection.host}`);
    } catch (err) {
        console.log("mongoDb connection err", err);
        process.exit(1);
    }
}

export default connectDB;