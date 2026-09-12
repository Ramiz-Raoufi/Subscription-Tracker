import express from "express";
import { sendReminders } from "../controllers/workflowController.js";

export const WorkFlowrouter = express.Router()

WorkFlowrouter.post("/subscription/reminders",sendReminders)