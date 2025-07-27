import {useQuery} from "@tanstack/react-query";
import { getMealData} from "@/lib/api-calling-methods/mealBackendMethods.ts";
import {type DailyMacroData} from "@/lib/types/meal.type.ts"
import { useAuth } from "@clerk/clerk-react";

export default function useGetTodaysMacros() {
    
    const {data, error, isLoading} = useQuery<DailyMacroData[], Error>({
        queryKey: ["todayMacros"],
        queryFn: async () => {
            const {getToken} = useAuth();
            const token = await getToken();
            if (!token) {
                return [];
            }
            return getMealData(token);
        },
    })

    if (error) {
        console.error("error occurred while fetching", error);
    }

    const macrosData = data ?? ([] as DailyMacroData[]);

    return {macrosData, isLoading}
}