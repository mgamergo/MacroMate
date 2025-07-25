import {Request, Response} from "express";
import prisma from "../db";
import {getAuth} from "@clerk/express";
import {RequestTargets} from "../types/dto.type";

export const getUserTargets = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            res.status(401).json({ error: "Unauthenticated" });
            return;
        }

        const targets = await prisma.targets.findUnique({
            where: {
                userId
            }
        })

        res.status(200).json(targets);

    } catch(e) {
        console.error("Unexpected error in getUserTargets controller:", e);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const postUserTargets = async (req: Request<{}, {}, RequestTargets>, res: Response) => {
    try {
        const {calories, carbs, fat, protien, steps, weight} = req.body;
        const { userId } = getAuth(req);

        if (!userId) {
            res.status(401).json({ error: "Unauthenticated" });
            return;
        }

        const addedTargets = await prisma.targets.create({
            data: {
                calories,
                carbs,
                fat,
                protien,
                steps,
                weight,
                user: {connect: {id: userId}}
            }
        })
        res.status(201).json(addedTargets);
    } catch (e) {
        console.error("Unexpected error in postUserTargets controller:", e);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const editUserTargets = async (req: Request<{id: string}, {}, RequestTargets>, res: Response) => {
    try {
        const {id} = req.params;
        const {calories, carbs, fat, protien, steps, weight} = req.body;
        const { userId } = getAuth(req);

        if (!userId) {
            res.status(401).json({ error: "Unauthenticated" });
            return;
        }

        const updatedTargets = await prisma.targets.update({
            where: {
                id, userId
            },
            data: {
                calories,
                carbs,
                fat,
                protien,
                steps,
                weight,
            }
        })
        res.status(200).json(updatedTargets)
    } catch (e: any) {
        if (e.code === "P2025") {
            res.status(404).json({ error: "Record not found" });
        } else {
            console.error("Unexpected error in editUserTargets controller:", e);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

export const deleteUserTargets = async (req: Request<{id: string}>, res: Response) => {
    try {
        const {id} = req.params;
        const { userId } = getAuth(req);

        if (!userId) {
            res.status(401).json({ error: "Unauthenticated" });
            return;
        }

        const deletedTargets = await prisma.targets.delete({
            where: {
                id, userId
            },
        })
        res.status(204).json(deletedTargets)
    } catch (e: any) {
        if (e.code === "P2025") {
            res.status(404).json({ error: "Record not found" });
        } else {
            console.error("Unexpected error in deleteUserTargets controller:", e);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}