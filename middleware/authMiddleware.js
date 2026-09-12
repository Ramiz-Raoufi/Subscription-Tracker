import jwt from "jsonwebtoken"
import User from "../model/userModel.js"

export const authorize =async (req,res,next)=>{
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1]
        }

        if(!token){
            const error = new Error("No token was provided")
            error.statusCode = 404
            throw error
        }
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    
    const user = await User.findById(decoded.userId)
if(!user){
     const error = new Error("User was not found")
            error.statusCode = 404
            throw error
}

req.user = user

            next()
    } catch (error) {
        res.status(401).json({success:false,msg:error.message})
    }
}