import {Request, Response} from "express";
import prisma from "../db";
import {getAuth} from "@clerk/express";
import {RequestSteps} from "../types/dto.type";

export const getStepsData = async (req: Request, res: Response) => {
    try {
        const {userId} = getAuth(req);

        if (!userId) {
            res.status(401).json([])
            return
        }

        const steps = await prisma.steps.findMany({
            where: {
                userId,
            }
        })

        if (steps.length === 0) {
            res.status(404).json({message: "No data found"});
            return;
        }

        res.status(200).json(steps)
    } catch (e) {
        console.error("Unexpected error in getStepsData controller: " + e);
        res.status(500).json([]);
    }
}

export const todaysStepsData = async (req: Request, res: Response) => {
    try {
        const today = new Date();
        const {userId} = getAuth(req);

        if (!userId) {
            res.status(401).json([])
            return
        }

        const steps = await prisma.steps.findMany({
            where: {
                userId,
                date: {
                    gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                    lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
                }
            }
        })

        if (steps.length === 0) {
            res.status(204).json({message: "No data found"});
            return;
        }

        res.status(200).json(Array.isArray(steps) ? steps : [steps]);
    } catch (e) {
        console.error("Unexpected error in todaysStepsData controller: " + e);
        res.status(500).json([]);
    }
}

export const postStepsData = async (req: Request<{}, {}, RequestSteps>, res: Response) => {
    try {
        const {steps} = req.body;
        const today = new Date();
        const {userId} = getAuth(req);

        if (!userId) {
            res.status(401).json({error: "Unauthenticated"})
            return
        }

        const todaySteps = await prisma.steps.create({
            data: {
                steps,
                date: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                user: {connect: {id: userId}}
            }
        })

        res.status(201).json(todaySteps)
    } catch (e) {
        console.error("Unexpected error in postStepsData controller:", e)
        res.status(500).json({error: "Internal server error"})
    }
}

export const editStepsData = async (req: Request<{ id: string }, {}, RequestSteps>, res: Response) => {
    try {
        const {id} = req.params
        const {steps} = req.body;

        const {userId} = getAuth(req);

        if (!userId) {
            res.status(401)
            return
        }

        const updated = await prisma.steps.update({
            where: {id, userId},
            data: {steps}
        })

        res.status(200).json(updated);
    } catch (e: any) {
        if (e.code === "P2025") {
            res.status(404).json({error: "Record not found"} as any)
        } else {
            console.error("Unexpected error in editStepsData controller:", e)
            res.status(500).json({error: "Internal server error"} as any)
        }
    }

}

export const deleteStepsData = async (req: Request<{id: string}>, res: Response)=> {
    try {
        const {id} = req.params;
        const {userId} = getAuth(req);

        if (!userId) {
            res.status(401).json({ error: "Unauthenticated" })
            return
        }

        const deletedSteps = await prisma.steps.delete({
            where: {id, userId}
        })
        res.status(204).json(deletedSteps)
    } catch (e) {
        console.error("Unexpected error in deleteStepsData controller:", e)
        res.status(500).json({error: "Internal server error"})
    }
}