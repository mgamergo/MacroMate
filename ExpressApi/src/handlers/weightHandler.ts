import { Request, Response } from "express";
import prisma from "../db";
import { getAuth } from "@clerk/express";
import { RequestWeight } from "../types/dto.type";

export const getWeights = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            res.status(401).json([]);
            return;
        }

        const weights = await prisma.weight.findMany({
            where: { userId }
        });

        if (weights.length === 0) {
            res.status(404).json({ message: "No data found" });
            return;
        }

        res.status(200).json(Array.isArray(weights) ? weights : [weights]);
    } catch (e) {
        console.error("Unexpected error in getWeights controller: " + e);
        res.status(500).json([]);
    }
};

export const postWeight = async (req: Request<{}, {}, RequestWeight>, res: Response): Promise<void> => {
    try {
        const { weight } = req.body;
        const { userId } = getAuth(req);

        if (!userId) {
            res.status(401).json([]);
            return;
        }

        const weightData = await prisma.weight.create({
            data: {
                date: new Date(),
                weight,
                user: { connect: { id: userId } }
            }
        });

        res.status(201).json(weightData);
    } catch (e) {
        console.error("Unexpected error in postWeight controller: " + e);
        res.status(500).json([]);
    }
};

export const editWeight = async (req: Request<{ id: string }, {}, RequestWeight>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { weight } = req.body;
        const { userId } = getAuth(req);

        if (!userId) {
            res.status(401).json({ error: "Unauthenticated" });
            return;
        }

        const updated = await prisma.weight.update({
            where: { id, userId },
            data: { weight }
        });

        res.status(200).json(updated);
    } catch (e: any) {
        if (e.code === "P2025") {
            res.status(404).json({ error: "Record not found" });
        } else {
            console.error("Unexpected error in editWeight controller:", e);
            res.status(500).json({ error: "Internal server error" });
        }
    }
};

export const deleteWeight = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { userId } = getAuth(req);

        if (!userId) {
            res.status(401).json({ error: "Unauthenticated" });
            return;
        }

        const deletedWeight = await prisma.weight.delete({
            where: { id, userId }
        });

        res.status(204).json(deletedWeight);
    } catch (e) {
        console.error("Unexpected error in deleteWeight controller:", e);
        res.status(500).json({ error: "Internal server error" });
    }
};