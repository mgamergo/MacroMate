import type { TargetData } from "@/lib/types/targets.type";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function useGetUserTargets() {
    const {getToken} = useAuth();
    const token = getToken();
    const getUserTargets = async (): Promise<TargetData> => {
        const response = await axios.get<TargetData>(`${BACKEND_URL}/api/targets/`, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    );
        return response.data;
    }
    const {data, error, isLoading} = useQuery<TargetData, Error>({
        queryKey: ["userTargets"],
        queryFn: getUserTargets
    });
    if (error) {
        console.error("error occurred while fetching", error);
    }

    const targetData = data;

    return {targetData, isLoading}

}