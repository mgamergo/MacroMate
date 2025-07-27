import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";

const useStepsData = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["test"],
    queryFn: async () => {
      const token = await getToken();

      const response = await fetch(
        "https://macromate-3yht.onrender.com/api/steps/today",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    },
    enabled: isLoaded && isSignedIn,
  });
};

export default function Test() {
  const { data, isLoading, isError, error } = useStepsData();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (isError) {
    return <h1>Error: {error.message}</h1>;
  }

  return <h1>{data?.[0]?.steps}</h1>;
}