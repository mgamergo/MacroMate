import {Request, Response} from "express";
import prisma from "../db";
import type {Macros} from "@prisma/client";
import {RequestMacros} from "../types/dto.type";
import {getAuth} from "@clerk/express";

export const getTodaysMacros = async (req: Request, res: Response<Macros[]>) => {

    try {
        const today = new Date();
        const {userId} = getAuth(req);

        if (!userId) {
            res.status(401).json([])
            return
        }
        const todayMacros = await prisma.macros.findMany({
            where: {
                userId,
                date: {
                    gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                    lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
                }
            }
        })

        if (todayMacros.length === 0) {
            res.status(204).json([]);
            return;
        }

        res.status(200).json(Array.isArray(todayMacros) ? todayMacros : [todayMacros]);

    } catch (e) {
        console.error("Unexpected error in getTodaysMacros controller: " + e);
        res.status(500).json([]);
    }
}

export const getAllMacros = async (req: Request, res: Response<Macros[]>) => {

    try {
        const {userId} = getAuth(req);

        if (!userId) {
            res.status(401).json([])
            return
        }
        const allMacros = await prisma.macros.findMany({
            where: {
                userId,
            }
        })

        if (allMacros.length === 0) {
            res.status(204).json([]);
            return;
        }

        res.status(200).json(Array.isArray(allMacros) ? allMacros : [allMacros]);

    } catch (e) {
        console.error("Unexpected error in getAllMacros controller: " + e);
        res.status(500).json([]);
    }
}


export const postMeal = async (req: Request<{}, {}, RequestMacros>, res: Response) => {
    try {
        const {carbs, protien, fat, calories, type, name} = req.body;
        const {userId} = getAuth(req);
        console.log(userId)
        if (!userId) {
            res.status(401).json({ error: "Unauthenticated" })
            return
        }

        const newMacros = await prisma.macros.create({
            data: {
                date: new Date(),
                calories,
                protien,
                carbs,
                fat,
                type,
                name,
                user: {connect: {id: userId}}
            }
        })
        res.status(201).json(newMacros)
    } catch (e) {
        console.error("Unexpected error in postMeal controller:", e)
        res.status(500).json({error: "Internal server error"})
    }

}

export const editMeal = async (req: Request<{ id: string }, {}, Macros>, res: Response<Macros>) => {
    const {id} = req.params
    const {calories, protien, carbs, fat} = req.body
    const {userId} = getAuth(req);

    if (!userId) {
        res.status(401)
        return
    }

    try {
        const updated = await prisma.macros.update({
            where: {id, userId},
            data: {calories, protien, carbs, fat}
        })
        res.status(200).json(updated)
    } catch (e: any) {
        if (e.code === "P2025") {
            res.status(404).json({error: "Record not found"} as any)
        } else {
            console.error("Unexpected error in editMeal controller:", e)
            res.status(500).json({error: "Internal server error"} as any)
        }
    }
}

export const deleteMeal = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const id = req.params.id;
        const {userId} = getAuth(req);

        if (!userId) {
            res.status(401).json({ error: "Unauthenticated" })
            return
        }
        const deletedMacros = await prisma.macros.delete({
            where: {id, userId}
        })
        res.status(204).json(deletedMacros)

    } catch (e) {
        console.error("Unexpected error in deleteMeal controller:", e)
        res.status(500).json({error: "Internal server error"})
    }
}
