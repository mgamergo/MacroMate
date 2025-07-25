import axios from "axios";
import type {StepType} from "@/lib/types/steps.type.ts";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getStepsData = async (): Promise<StepType> => {
    const response = await axios.get<StepType[]>(`${BACKEND_URL}/api/steps/today`, {
        withCredentials: true
    });
    const stepsData = response.data;
    const consolidatedSteps: StepType = {
        id: "",
        steps: 0,
        date: new Date(),
        userId: "",
    };

    if (stepsData.length === 0) {
        consolidatedSteps.id = "";
        consolidatedSteps.date = new Date();
        consolidatedSteps.userId = "";
        consolidatedSteps.steps = 0;

        return consolidatedSteps;
    }
    stepsData.map((item, index) => {
        if (index === 0) {
            consolidatedSteps.id = item.id;
            consolidatedSteps.date = item.date;
            consolidatedSteps.userId = item.userId
        }
        consolidatedSteps.steps += item.steps ?? 0;
    })
    return consolidatedSteps;
};

export const postStepsData = async (data : { steps: number }) => {
    const response = await axios.post(`${BACKEND_URL}/api/steps/`, data, {
        withCredentials: true
    });
    return response.data;
}