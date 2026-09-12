import mongoose from "mongoose"
import User from "../model/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRESIN = process.env.JWT_EXPIRESIN
export const signUp =async (req,res,next)=>{
const session = await mongoose.startSession()
session.startTransaction()  /// ===> atomic operation is when either all of the process's parts are completed or none
try {
const {email,password,name} =req.body   

const userExists = await User.findOne({email})
if(userExists){
    const error = new Error("This  user already exists")
    error.statusCode = 409
    throw error
}

const salt = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(password,salt)



const newUser  = await User.create([{name,email,password:hashedPassword}],{session})

const token = jwt.sign({userId: newUser[0]._id},JWT_SECRET,{expiresIn:JWT_EXPIRESIN})

res.status(201).json({success:true,message:"user created Successfully ",data:{
    token,
    user: newUser[0]
}})
    await session.commitTransaction()
} catch (error) {
    await session.abortTransaction()
    session.endSession()
    next(error)
}
}
export const signIn= async(req,res,next)=>{
try {
    const {email,password} = req.body

    const user = await User.findOne({email})
    if(!user){
        const error = new Error("Invalid email or password")
        error.statusCode=401
        throw error
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
        const error = new Error("Invalid email or password")
        error.statusCode=401
        throw error
    }


    const token = jwt.sign({userId : user._id},JWT_SECRET,{expiresIn:JWT_EXPIRESIN})
    res.status(200).json({success:true,message:"successfully loged in", data:{token,user}})
} catch (error) {

    next(error)
}
}

export const signOut =async (req,res,next)=>{
    
}