import {useQuery} from "@tanstack/react-query";
import { getMealData} from "@/lib/api-calling-methods/mealBackendMethods.ts";
import {type DailyMacroData} from "@/lib/types/meal.type.ts"

export default function useGetTodaysMacros() {

    const {data, error, isLoading} = useQuery<DailyMacroData[], Error>({
        queryKey: ["todayMacros"],
        queryFn: getMealData,
    })

    if (error) {
        console.error("error occurred while fetching", error);
    }

    const macrosData = data ?? []

    return {macrosData, isLoading}
}