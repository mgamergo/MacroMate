import express from "express";
import {Request, Response} from "express-serve-static-core";
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

// Creating a new express Instance
const app = express();
//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}))
dotenv.config();
app.use(clerkMiddleware())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET","POST","PUT", "PATCH","3t3","OPTIONS", "DELETE"],
    allowedHeaders: ["Content-Type","Authorization"],
}))

const port = process.env.PORT || 3000;

// CRON job to prevent API deactivating
// if (process.env.NODE_ENV == "production") job.start();

// API Health check route
app.get("/api/health", (req: Request, res: Response) => {
    res.status(200).json({status: "OK Fine"});
})

// Clerk protected routes
app.use(requireAuth())

// Routers
app.use('/api/clerk', clerkWebhooksRouter)
app.use("/api/macros", macrosRouter);
app.use("/api/steps", stepsRouter);
app.use("/api/weight", weightRouter);
app.use('/api/stats', statsRouter);
app.use('/api/targets', targetsRouter);
app.use('/api/user', userRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

