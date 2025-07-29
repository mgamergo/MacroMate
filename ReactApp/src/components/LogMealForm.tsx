import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import type { MealData } from "@/lib/types/meal.type.ts";
import {
  postMeal,
  editMeal,
} from "@/lib/api-calling-methods/mealBackendMethods.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { useAuth } from "@clerk/clerk-react";

interface LogMealFormProps {
  meal?: MealData;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const LogMealForm = ({ setOpen, meal }: LogMealFormProps) => {
  const isEditMode = !!meal;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<MealData>({
    defaultValues: isEditMode
      ? {
          name: meal.name,
          calories: meal.calories,
          protien: meal.protien,
          carbs: meal.carbs,
          fat: meal.fat,
          type: meal.type,
        }
      : {
          name: "",
          calories: undefined,
          protien: undefined,
          carbs: undefined,
          fat: undefined,
          type: undefined,
        },
  });

  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  const mutationFunction = isEditMode ? editMeal : postMeal;

  const { mutateAsync: logMealMutation, isPending } = useMutation<
    any,
    Error,
    MealData
  >({
    mutationFn: async (mealData: MealData) => {
      const token = await getToken();
      if (!token) {
        throw new Error("Not Authenticated");
      }
      return mutationFunction(mealData, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todayMacros"] });
      toast.success("Meal logged successfully!");
      reset();
      setOpen(false);
    },
    onError: (error) => {
      console.error("Failed to log meal:", error);
      toast.error("Failed to log meal");
    },
  });

  const onSubmit = async (data: MealData) => {
    try {
      const dataToSubmit = isEditMode ? { ...data, id: meal?.id } : data;
      await logMealMutation(dataToSubmit); // Pass dataToSubmit here
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full absolute top-0 left-0 bg-black/50 min-w-full overflow-hidden">
      <div className="p-8 border border-border rounded-lg max-w-md bg-background overflow-hidden mx-5">
        <h2 className="text-foreground text-center text-2xl mb-6 font-handwritten">
          LOG MEAL
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-muted-foreground text-sm">
              Name
            </label>
            <Input
              id="name"
              placeholder="Enter Value"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name?.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="calories" className="text-muted-foreground text-sm">
                Calories
              </label>
              <Input
                id="calories"
                placeholder="Enter Value"
                type="number"
                {...register("calories", {
                  required: "Calories are required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Calories must be positive" },
                })}
              />
              {errors.calories?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.calories.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="protien" className="text-muted-foreground text-sm">
                Protein
              </label>
              <Input
                id="protien"
                placeholder="Enter Value"
                type="number"
                {...register("protien", {
                  required: "Protien is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Protien must be positive" },
                })}
              />
              {errors.protien?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.protien.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="carbs" className="text-muted-foreground text-sm">
                Carbs
              </label>
              <Input
                id="carbs"
                placeholder="Enter Value"
                type="number"
                {...register("carbs", {
                  required: "Carbs are required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Carbs must be positive" },
                })}
              />
              {errors.carbs?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.carbs.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="fat" className="text-muted-foreground text-sm">
                Fat
              </label>
              <Input
                id="fat"
                placeholder="Enter Value"
                type="number"
                {...register("fat", {
                  required: "Fat is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Fat must be positive" },
                })}
              />
              {errors.fat?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fat.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="type" className="text-muted-foreground text-sm">
              Meal Type
            </label>
            <Controller
              name="type"
              control={control}
              rules={{ required: "Meal Type is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Meal Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BREAKFAST">BREAKFAST</SelectItem>
                    <SelectItem value="LUNCH">LUNCH</SelectItem>
                    <SelectItem value="DINNER">DINNER</SelectItem>
                    <SelectItem value="SNACK">SNACK</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type?.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.type.message}
              </p>
            )}
          </div>

          <div className="max-w-full flex items-center gap-3">
            <Button
              className="flex-1 border-border hover:cursor-pointer font-handwritten"
              onClick={() => setOpen(false)}
              variant="outline"
            >
              Close
            </Button>
            <Button
              type="submit"
              className="flex-1 border-border hover:cursor-pointer font-handwritten"
              disabled={isPending}
            >
              {isPending ? "Logging..." : "Log Meal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogMealForm;