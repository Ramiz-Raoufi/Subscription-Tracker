import e from "express";
import { authorize } from "../middleware/authMiddleware.js";
import { createSubscription,deleteSubscription,getUserSubs,getAllSubscriptions,getSingleSubscription,updateSubscription } from "../controllers/subscriptionController.js";
const subscribRouter = e.Router()


subscribRouter.get("/",getAllSubscriptions)
subscribRouter.get("/:id",getSingleSubscription)
subscribRouter.post("/",authorize,createSubscription)
subscribRouter.put("/:id",updateSubscription)
subscribRouter.delete("/:id",deleteSubscription)
subscribRouter.get("/user/:id",authorize,getUserSubs)
subscribRouter.post("/:id/cancel",()=>{})
subscribRouter.get("/upcoming-renewals",()=>{})
export default subscribRouter