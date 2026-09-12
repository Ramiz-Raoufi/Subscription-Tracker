import express from "express";
import path from "path";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import subscribRouter from "./routes/subscriptionRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import connectDB from "./database/mongodb.js";
import cookieParser from "cookie-parser";
import { arcjetMiddleware } from "./middleware/arcjetMiddleware.js";
import { WorkFlowrouter } from "./routes/workFlowRoutes.js";

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// ------------------------------------
// UPSTASH WORKFLOW ROUTES
// ------------------------------------
// Put this BEFORE Arcjet
app.use("/api/v1/workflows", WorkFlowrouter);


// ------------------------------------
// NORMAL APPLICATION MIDDLEWARE
// ------------------------------------
app.use(arcjetMiddleware);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscribRouter);


// ------------------------------------
// ERROR HANDLER
// ------------------------------------
app.use(errorMiddleware);


app.listen(8000, async () => {
    await connectDB();

    console.log("Your connected to the database");
    console.log(`Your server is running on port ${PORT}`);
});

export default app;