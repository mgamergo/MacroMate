import type { TargetData } from "@/lib/types/targets.type";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function useGetUserTargets() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const {
    data: targetData,
    error,
    isLoading,
  } = useQuery<TargetData, Error>({
    queryKey: ["userTargets"],
    queryFn: async () => {
      const token = await getToken();

      if (!token) {
        throw new Error("Authentication token not available.");
      }

      const response = await axios.get<TargetData>(`${BACKEND_URL}/api/targets/`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: isLoaded && isSignedIn,
    staleTime: 5 * 60 * 1000,
  });

  if (error) {
    console.error("error occurred while fetching user targets:", error);
  }

  return { targetData, isLoading };
}