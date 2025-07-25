import {PolarAngleAxis, RadialBar, RadialBarChart} from "recharts"
import {type DailyMacroData, type ConsolidatedMacro} from "@/lib/types/meal.type.ts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {type ChartConfig} from "@/components/ui/chart"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import useGetTodaysMacros from "@/hooks/useGetTodaysMacros.tsx";
import useGetUserTargets from "@/hooks/useGetUserTargets.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useQueryClient, useMutation} from "@tanstack/react-query";
import {deleteMeal} from "@/lib/api-calling-methods/mealBackendMethods.ts";
import {useState} from "react";
import toast from "react-hot-toast";
import LogMealForm from "@/components/LogMealForm.tsx";

export const description = "Macros Widget"

const chartConfig = {
    macros: {
        label: "Macros",
    },
    carbs: {
        label: "Carbs",
        color: "var(--chart-2)",
    },
    fat: {
        label: "Fat",
        color: "var(--chart-1)",
    },
    protien: {
        label: "Protien",
        color: "var(--chart-3)",
    },
    calories: {
        label: "Calories",
        color: "var(--chart-4)",
    },
} satisfies ChartConfig

interface MealDataProps {
    macro: DailyMacroData;
}

type MealId = string;

function MealData({macro}: MealDataProps) {
    const { id, name, calories, protien, type } = macro;
    const [showDeleteMenu, setShowDeleteMenu] = useState(false);
    const [openEditForm, setOpenEditForm] = useState(false);
    const queryClient = useQueryClient();

    const { mutateAsync } = useMutation<
        unknown,
        Error,
        string
    >({
        mutationFn: deleteMeal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todayMacros"] });
            toast.success("Meal deleted successfully!")
        },
        onError: (error) => {
            console.error("Error deleting item:", error);
            toast.error("Unable to delete meal!")
        },
    });

    const handleDelete = (id: MealId) => {
        mutateAsync(id)
    }

    return (
        <>
            <Card className="flex mx-5 mb-3 border-border">
                <CardHeader>
                    <CardTitle className="font-bold text-2xl">{name}</CardTitle>
                    <CardDescription>Meal Type: {type}</CardDescription>
                    <CardDescription>Calories: {calories} . Protien: {protien}</CardDescription>
                </CardHeader>
                <CardFooter className="gap-3">
                    <Button variant="outline" onClick={() => setOpenEditForm(true)}>Edit</Button>
                    <Button variant="destructive" onClick={() => setShowDeleteMenu(true)}>Delete</Button>
                </CardFooter>
            </Card>

            {showDeleteMenu && <div
                className="flex items-center justify-center min-h-full absolute top-0 left-0 bg-black/50 min-w-full overflow-hidden">
                <div className="p-8 border border-border rounded-lg w-full max-w-md bg-background overflow-hidden">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                        Are you sure you want to delete this meal?
                    </h4>
                    <p className="text-red-300 text-sm mt-3">
                        Note: This action can't be undone
                    </p>
                    <div className="max-w-full flex items-center gap-3 mt-8">
                        <Button
                            className="flex-1 border-border hover:cursor-pointer font-handwritten"
                            onClick={() => setShowDeleteMenu(false)}
                            variant="outline"
                        >
                            Close
                        </Button>
                        <Button
                            variant="destructive"
                            className="flex-1 border-border hover:cursor-pointer font-handwritten"
                            onClick={() => handleDelete(id)}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </div>}

            {openEditForm && <LogMealForm setOpen={setOpenEditForm} meal={macro}/>}
        </>

    )
}

export function DailyMacrosWidget() {
    const {macrosData, isLoading} = useGetTodaysMacros();
    const {targetData} = useGetUserTargets();
    const [showMealsMenu, setShowMealsMenu] = useState(false);

    const normalisedData = () => {
        const calculatePercentage = (consumed: number, target: number): number => {
            if (target === 0) {
                return consumed > 0 ? 100 : 0; // If target is 0 but consumed is > 0, make it 100%
            }
            const percentage = (consumed / target) * 100;
            // Cap at 100 and round up
            return Math.min(100, Math.ceil(percentage));
        };

        if (!targetData) {
            console.error("Target or data not found");
            return [];
        }
        const {calories: targetCalories, carbs: targetCarbs, fat: targetFat, protien: targetProtien} = targetData;

        if (!macrosData || macrosData.length === 0) {
            return [
                {macro: "fat", value: 0, actualValue: 0, fill: "var(--color-fat)"},
                {macro: "carbs", value: 0, actualValue: 0, fill: "var(--color-carbs)"},
                {macro: "protien", value: 0, actualValue: 0, fill: "var(--color-protien)"},
                {macro: "calories", value: 0, actualValue: 0, fill: "var(--color-calories)"},
            ]
        }

        let totalCalories = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        let totalProtien = 0;

        macrosData.forEach((meal) => {
            totalCalories += meal.calories;
            totalCarbs += meal.carbs;
            totalFat += meal.fat;
            totalProtien += meal.protien;
        });

        const caloriesPercent = calculatePercentage(totalCalories, targetCalories);
        const carbsPercent = calculatePercentage(totalCarbs, targetCarbs);
        const fatPercent = calculatePercentage(totalFat, targetFat);
        const protienPercent = calculatePercentage(totalProtien, targetProtien);

        const consolidated: ConsolidatedMacro[] = [
            {macro: "fat", value: fatPercent, actualValue: totalFat, fill: "var(--color-fat)"},
            {macro: "carbs", value: carbsPercent, actualValue: totalCarbs, fill: "var(--color-carbs)"},
            {macro: "protien", value: protienPercent, actualValue: totalProtien, fill: "var(--color-protien)"},
            {macro: "calories", value: caloriesPercent, actualValue: totalCalories,  fill: "var(--color-calories)"},
        ];

        return consolidated;
    }

    const chartData = normalisedData()


    return (
        <div className="flex flex-col md:flex-row justify-center border border-border bg-card rounded-xl p-6 max-h-[400px] md:max-h-full">
            <Card className="flex flex-1 flex-col bg-card border-border max-h-fit">
                <CardContent className="flex-1 pb-0">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto flex aspect-square max-h-[250px]"
                    >
                        <RadialBarChart data={chartData} innerRadius={30} outerRadius={110} startAngle={240} endAngle={-60}>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel nameKey="macro"/>}
                                formatter={(value, _name, item) => {
                                    const actualValue = item.payload?.actualValue;
                                    const label = item.payload?.macro;
                                    const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);
                                    return actualValue !== undefined
                                        ? [formattedLabel, ` ${actualValue}${item.payload?.macro === "calories" ? " kcal" : " gms"}`]
                                        : [formattedLabel, ` ${value}${item.payload?.macro === "calories" ? " kcal" : " gms"}`]
                                }}
                            />
                            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} axisLine={false}
                                            tickLine={false} tick={false}/>
                            <RadialBar dataKey="value" background/>
                        </RadialBarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                    <Button className="md:hidden" onClick={() => setShowMealsMenu(true)}>Show Meals</Button>
                </CardFooter>
            </Card>
            {showMealsMenu &&
                <div
                    className="absolute left-0 top-0 w-screen h-screen bg-black/50 md:hidden flex justify-center items-center">
                    <div
                        className="relative md:p-8 border border-border rounded-lg w-full max-w-md bg-background overflow-hidden mx-5 pt-16">
                        {isLoading ? (
                            <div className="text-white h-full w-full flex justify-center items-center">
                                <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Loading
                                    Meals...</h2>
                            </div>
                        ) : (
                            // Now, macrosData should be the up-to-date array provided by React Query
                            macrosData && macrosData.length > 0
                                ? macrosData.map((item) => (
                                    <MealData key={item.id} macro={item}/>
                                ))
                                : (
                                    <div className="text-white h-full w-full flex justify-center items-center">
                                        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">No
                                            Meals found</h2>
                                    </div>
                                )
                        )}

                        <Button variant="ghost" onClick={() => setShowMealsMenu(false)} className="absolute top-3 right-1 text-4xl rotate-45">+</Button>
                    </div>
            </div>}
            <div className="flex-1 w-full mt-4 md:mt-0 md:ml-4 overflow-y-auto">
                {isLoading ? (
                    <div className="text-white h-full w-full flex justify-center items-center">
                        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Loading Meals...</h2>
                    </div>
                ) : (
                    // Now, macrosData should be the up-to-date array provided by React Query
                    macrosData && macrosData.length > 0
                        ? macrosData.map((item) => (
                            <MealData key={item.id} macro={item}  />
                        ))
                        : (
                            <div className="text-white h-full w-full flex justify-center items-center">
                                <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">No Meals found</h2>
                            </div>
                        )
                )}
            </div>

        </div>
    )
}

// TODO: IF WE DELETE THE LAST MEAL IN THE LIST, IT IS NOT DISAPPEARING. FIx it
// TODO: MAKE IT RESPONSIVE. STOPPING HERE