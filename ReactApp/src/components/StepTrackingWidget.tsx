import { Progress } from "@/components/ui/progress";
import { FaWalking } from "react-icons/fa";
import { PiPersonSimpleWalk } from "react-icons/pi";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { StepType } from "@/lib/types/steps.type.ts";
import { postStepsData } from "@/lib/api-calling-methods/stepsBackendMethods.ts"; // Removed getStepsData as it's not used directly here
import { Skeleton } from "@/components/ui/skeleton.tsx";
import toast from "react-hot-toast";
import useGetUserTargets from "@/hooks/useGetUserTargets.tsx";
import { useAuth } from "@clerk/clerk-react";

export default function StepTrackingWidget() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [inputData, setInputData] = useState("");
  const queryClient = useQueryClient(); // Moved here for better scope

  const {
    data,
    error: fetchError,
    isLoading: isStepsLoading,
  } = useQuery<StepType, Error>({
    queryKey: ["todaysSteps"],
    queryFn: async () => {
      const token = await getToken();

      if (!token) {
        throw new Error("Authentication token not available.");
      }

      const response = await fetch(`${BACKEND_URL}/api/steps/today`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const stepsDataArray: StepType[] = await response.json();
      const consolidatedSteps: StepType = {
        id: "",
        steps: 0,
        date: new Date(),
        userId: "", 
      };

      if (stepsDataArray && stepsDataArray.length > 0) {
        consolidatedSteps.steps = stepsDataArray.reduce(
          (sum, item) => sum + (item.steps ?? 0),
          0,
        );
        consolidatedSteps.id = stepsDataArray[0].id;
        consolidatedSteps.date = new Date(stepsDataArray[0].date); 
        consolidatedSteps.userId = stepsDataArray[0].userId;
      } else {
        consolidatedSteps.steps = 0;
        consolidatedSteps.date = new Date();
      }

      return consolidatedSteps;
    },
    enabled: isLoaded && isSignedIn,
    staleTime: 5 * 60 * 1000,
  });

  // Progress Bar Calculation
  const { targetData, isLoading: isTargetsLoading } = useGetUserTargets();

  // Safely calculate progress ensuring targetData is available
  const progress =
    data && targetData && targetData.steps > 0
      ? (data.steps / targetData.steps) * 100
      : 0;
  const progressPercent = progress > 100 ? 100 : progress;

  const { mutate: logSteps, isPending } = useMutation({
    mutationFn: postStepsData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todaysSteps"] });
      setInputData("");
      toast.success("Steps logged successfully!");
    },
    onError: (err) => {
      console.error("Failed to log steps:", err);
      toast.error(`Failed to log steps: ${err.message || "Unknown error"}`);
    },
  });

  const handleLogSteps = async () => {
    const stepsToLog = parseInt(inputData, 10);
    const token = await getToken();

    if (isNaN(stepsToLog) || stepsToLog <= 0) {
      toast.error("Please enter a valid positive number of steps.");
      return;
    }

    if (!token) {
      // getToken() can return null/undefined. Handle it explicitly.
      toast.error("Authentication required to log steps.");
      return;
    }

    logSteps({ steps: stepsToLog, token });
  };

  // Combine loading states
  if (isStepsLoading || isTargetsLoading) {
    return (
      <div className="relative md:p-8 border border-border rounded-lg w-full max-w-md bg-card overflow-hidden p-5 flex flex-col justify-center items-start h-fit">
        <div className="w-full flex flex-row justify-between items-center mb-5">
          <div className="flex flex-col justify-center items-start gap-3">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-6 w-28 ml-1" />{" "}
          </div>
          <Skeleton className="h-[50px] w-[50px] rounded-full" />{" "}
        </div>

        <Skeleton className="h-3 w-full" />

        <div className="w-full flex gap-3 my-5">
          <Skeleton className="h-10 flex-2" />
          <Skeleton className="h-10 flex-1" />{" "}
        </div>
      </div>
    );
  }

  const stepValue = fetchError
    ? "Error fetching data"
    : data?.steps.toLocaleString();

  return (
    <div className="relative md:p-8 border border-border rounded-lg w-full max-w-md bg-card overflow-hidden p-5 flex flex-col justify-center items-start h-fit">
      <div className="w-full flex flex-row justify-between items-center mb-5">
        <div className="flex flex-col justify-center items-start gap-3">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance text-left">
            {stepValue}
          </h1>
          <h4 className="scroll-m-20 text-md font-semibold tracking-tight ml-1">
            Steps today
          </h4>
        </div>

        <FaWalking size={50} />
      </div>
      <Progress value={progressPercent} />
      <div className="w-full flex gap-3 my-5">
        <Input
          className="flex-2"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          type="number" // Add type="number" for better input experience
          placeholder="Enter steps" // Add a placeholder
        />
        <Button
          variant="default"
          className="flex-1"
          disabled={!inputData || isPending}
          onClick={() => handleLogSteps()}
        >
          {isPending ? (
            "Logging..."
          ) : (
            <>
              <PiPersonSimpleWalk className="mr-2" /> {/* Added margin */}
              Log Steps
            </>
          )}
        </Button>
      </div>
    </div>
  );
}