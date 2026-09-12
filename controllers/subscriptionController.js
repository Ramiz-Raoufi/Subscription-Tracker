import Subscription from "../model/subscriptionModel.js"
import User from "../model/userModel.js"
import mongoose from "mongoose"
import { Client } from "@upstash/workflow";


const client = new Client({
  baseUrl: process.env.QSTASH_URL,
  token: process.env.QSTASH_TOKEN
});

export const getAllSubscriptions = async (req,res,next) =>{
try {
    const subscriptions = await Subscription.find()
    res.status(200).json({status:"Success" , data :subscriptions})
} catch (error) {
    next(error)
}
}



export  const getSingleSubscription = async (req,res,next)=>{
    try {
        const singleSubscription = await Subscription.findById(req.params.id)
        if(!Subscription){
            const error = new error(`Task with the Id of ${req.params.id} was not found`)
            error.statusCode=404
            throw error
        }

        res.status(200).json({status:"Success",data:singleSubscription})
    } catch (error) {
        next(error)
    }
}

export const getUserSubs = async(req,res,next)=>{
    try {
        if (req.user.id !== req.params.id) {
      const error = new Error("You are not authorized to view this account's subscriptions");
      error.statusCode = 403; // Forbidden, not Unauthorized
      throw error;
    }


        const subs = await Subscription.find({user:req.params.id})
        res.status(200).json({success:true,data:{
            subs
        }})
    } catch (error) {
        next(error)
    }
}

export const createSubscription = async (req,res,next)=>{
   
    try {
         const subs = await Subscription.create({
        ...req.body,
        user : req.user._id
    })

const { workflowRunId } = await client.trigger({
            url: `${process.env.SERVER_URL}/api/v1/workflows/subscription/reminders`,
            body: { subscriptionId: subs.id },
            headers: { "content-type": "application/json" },
        });
    res.status(201).json({success:true,data:{
        subs,
        workflowRunId
    }})
    } catch (error) {
        next(error)

    }
}

export const updateSubscription = async (req,res,next)=>{
try {
    
    
    const updateSubscription = await Subscription.findByIdAndUpdate(req.params.id,{...req.body})
    res.status(200).json({msg:"success",data:updateSubscription})
     
     
} catch (error) {
    next(error)
}
}




export const deleteSubscription = async (req,res,next)=>{
try {
    
    
    const deleteSubscription = await Subscription.findByIdAndDelete(req.params.id)
    res.status(200).json({msg:"success"})
     
     
} catch (error) {
    next(error)
}
}
