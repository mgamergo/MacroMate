import { Request, Response} from "express";
import prisma from "../db";
import {getAuth, clerkClient} from "@clerk/express";
import {RequestOnboardUSer} from "../types/dto.type";

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            res.status(401).json({ error: "Unauthenticated" });
            return;
        }

        const loggedInUser = await clerkClient.users.getUser(userId);

        res.json(loggedInUser);
    } catch(e) {
        console.error("Unexpected error in getCurrentUser controller:", e);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const onboardUser = async (req: Request<{}, {}, RequestOnboardUSer>, res: Response) => {
    try{
        const { height, weight, activity, calories, maintainance, protien, carbs, fat, steps, targetWeight } = req.body;
        const { userId } = getAuth(req);

        if (!userId) {
            res.status(401).json({ error: "Unauthenticated" });
            return;
        }

        const loggedInUser = await clerkClient.users.getUser(userId);

        const newUser = await prisma.user.create({
            data: {
                id: userId,
                name: loggedInUser.fullName,
                email: loggedInUser.emailAddresses[0].emailAddress,
                onboardingComplete: true,
            }
        });

        const userStats = await prisma.userStats.create({
            data: {
                height,
                weight,
                activity,
                maintainance,
                userId
            }
        });

        const userTargets = await prisma.targets.create({
            data: {
                calories,
                protien,
                carbs,
                fat,
                steps,
                weight: targetWeight,
                userId
            }
        });

        res.status(200).json([newUser, userStats, userTargets]);


    } catch (e) {
        console.error("Unexpected error in onboardUser controller:", e);
        res.status(500).json({ error: "Internal server error" });
    }
}
