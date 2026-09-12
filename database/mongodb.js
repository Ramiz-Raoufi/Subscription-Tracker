import mongoose from "mongoose";
const NODE_ENV = process.env.node_env;
const url = process.env.MONGO_URI;


if(!url){
    throw new Error("Please add the url to your dotenv file ")
}

const connectDB = async () =>{
    try {

        await mongoose.connect(url)
        
    } catch (error) {
        console.log("Database connection faced problem :" ,error)
        process.exit(1)
    }
}


export default connectDB