import e from "express";
import { authorize } from "../middleware/authMiddleware.js";
import { getUsers,getUser } from "../controllers/userControllers.js";
const userRouter = e.Router()


userRouter.get("/",getUsers)
userRouter.get("/:id",authorize,getUser)
userRouter.post("/",()=>{})
userRouter.put("/:id",()=>{})
userRouter.delete("/:id  ",()=>{})


export default userRouter