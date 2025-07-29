import express, { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import dotenv from "dotenv";
import {clerkMiddleware, requireAuth} from '@clerk/express'
import macrosRouter from "./routes/macrosRouter";
import stepsRouter from "./routes/stepsRouter";
import weightRouter from "./routes/weightRouter";
import statsRouter from "./routes/statsRouter";
import targetsRouter from "./routes/targetsRouter";
import userRouter from "./routes/userRouter";
import clerkWebhooksRouter from "./routes/clerkWebhooksRouter";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Content-Type", 
        "Authorization", 
        "x-clerk-auth-reason",
        "x-clerk-auth-message"
    ],
}));

app.use(clerkMiddleware());

const port = process.env.PORT || 3000;

app.get("/api/health", (req: Request, res: Response) => {
    res.status(200).json({status: "OK Fine"});
});

app.use('/api/clerk', clerkWebhooksRouter, bodyParser.raw({type: "application/json",}));
app.use(requireAuth());
app.use("/api/macros", macrosRouter);
app.use("/api/steps", stepsRouter);
app.use("/api/weight", weightRouter);
app.use('/api/stats', statsRouter);
app.use('/api/targets', targetsRouter);
app.use('/api/user', userRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});