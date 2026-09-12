import { ObjectId } from "mongodb";

const errorMiddleware = (err,req,res,next)=>{
    try {
        let error = {...err}
        error.message = err.message;
        console.error(err)

        if(err.name === "CastError"){
            error = new Error("Resource notFound")
            error.statusCode= 404 
        }


        if(err.name === 11000){
            error = new Error("Duplicate Key enterd as value    ")
            error.statusCode= 400
        }

        if(err.name === "ValidationError"){


            error = new Error(Object.values(err.errors).map(val=>val.message))
            error.statusCode= 404 
        }

        res.status(error.statusCode || 500).json({success:false,error:error.message||"server Error"})
    } catch (error) {
        next(error)
    }
}


export default errorMiddleware