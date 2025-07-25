import {Request, Response} from "express";
import prisma from "../db";
import {getAuth} from "@clerk/express";
import {RequestStats} from "../types/dto.type";

export const getUserStats = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            res.status(401).json({ error: "Unauthenticated" });
            return;
        }

        const stats = await prisma.userStats.findUnique({
            where: {
                userId
            }
        })

        res.status(200).json(stats);

    } catch(e) {
        console.error("Unexpected error in getUserStats controller:", e);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const postUserStats = async (req: Request<{}, {}, RequestStats>, res: Response) => {
    try {
        const {height, weight, activity, maintainance} = req.body;
        const { userId } = getAuth(req);

        if (!userId) {
            res.status(401).json({ error: "Unauthenticated" });
            return;
        }

        const addedStats = await prisma.userStats.create({
            data: {
                height,
                weight,
                activity,
                maintainance,
                user: {connect: {id: userId}}
            }
        })
        res.status(201).json(addedStats);
    } catch (e) {
        console.error("Unexpected error in postUserStats controller:", e);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const editUserStats = async (req: Request<{id: string}, {}, RequestStats>, res: Response) => {
    try {
        const {id} = req.params;
        const {height, weight, activity, maintainance} = req.body;
        const { userId } = getAuth(req);

        if (!userId) {
            res.status(401).json({ error: "Unauthenticated" });
            return;
        }

        const updatedStats = await prisma.userStats.update({
            where: {
                id, userId
            },
            data: {
                height,
                weight,
                activity,
                maintainance,
            }
        })
        res.status(200).json(updatedStats);
    } catch (e: any) {
        if (e.code === "P2025") {
            res.status(404).json({ error: "Record not found" });
        } else {
            console.error("Unexpected error in editWeight controller:", e);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

export const deleteUserStats = async (req: Request<{id: string}>, res: Response) => {
    try {
        const {id} = req.params;
        const { userId } = getAuth(req);

        if (!userId) {
            res.status(401).json({ error: "Unauthenticated" });
            return;
        }

        const deletedStats = await prisma.userStats.delete({
            where: {
                id, userId
            },
        })
        res.status(204).json(deletedStats);
    } catch (e: any) {
        if (e.code === "P2025") {
            res.status(404).json({ error: "Record not found" });
        } else {
            console.error("Unexpected error in editWeight controller:", e);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}