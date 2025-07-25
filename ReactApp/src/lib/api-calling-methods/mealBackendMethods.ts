import axios from "axios";
import type {DailyMacroData, MealData} from "@/lib/types/meal.type.ts";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getMealData = async (): Promise<DailyMacroData[]> => {
    const response = await axios.get<DailyMacroData[]>(`${BACKEND_URL}/api/macros/`, {
        withCredentials: true
    });
    return response.data;
};

export const postMeal = async (meal: MealData) => {
    try {
        return await axios.post(`${BACKEND_URL}/api/macros/`, meal, { withCredentials: true });
    } catch (e) {
        console.error("Error logging meal:", e);
        throw e;
    }
};

export const editMeal = async ( meal: MealData) => {
    if (!meal.id) {
        throw new Error("Meal ID is required for updating a meal.");
    }
    try {
        return await axios.patch(`${BACKEND_URL}/api/macros/edit/${meal.id}`, meal, { withCredentials: true });
    } catch (e) {
        console.error("Error editing meal:", e);
        throw e;
    }
};

export const deleteMeal = async (id: string) => {
    if (!id) {
        throw new Error("Meal ID is required for deleting a meal.");
    }
    try {
        return await axios.delete(`${BACKEND_URL}/api/macros/delete/${id}`, { withCredentials: true });
    } catch (e) {
        console.error("Error deleting meal:", e);
        throw e;
    }
};