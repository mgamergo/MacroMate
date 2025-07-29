import { useQuery } from "@tanstack/react-query";
import { getMealData } from "@/lib/api-calling-methods/mealBackendMethods.ts";
import { type DailyMacroData } from "@/lib/types/meal.type.ts";
import { useAuth } from "@clerk/clerk-react";

export default function useGetTodaysMacros() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const {
    data,
    error,
    isLoading,
  } = useQuery<DailyMacroData[], Error>({
    queryKey: ["todayMacros"],
    queryFn: async () => {
      const token = await getToken();

      if (!token) {
        throw new Error("Authentication token not available.");
      }
      return getMealData(token);
    },
    enabled: isLoaded && isSignedIn,
    staleTime: 5 * 60 * 1000,
  });

  if (error) {
    console.error("error occurred while fetching", error);
  }

  const macrosData = data ?? ([] as DailyMacroData[]);

  return { macrosData, isLoading };
}