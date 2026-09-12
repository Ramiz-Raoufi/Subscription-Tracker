import { Timestamp } from "mongodb";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {type: String,
    required:[true,"User must have a value"],
    trim : true,
    minLength:3,
    maxLength:50},
    email : {
        type : String,
       required:[true,"Email must have a value"],
        unique : true,
        match:[/\S+@\S+\.\S+/,"Please use a vaild email adrees format"],


    },
    password : {
        type:String,
        required:[true,"Password must have a value"],
        minLength:6,

    }
},{timestamps:true})


const User = mongoose.model("User",userSchema)


export default User