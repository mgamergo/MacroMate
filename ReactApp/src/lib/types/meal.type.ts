export interface MealData {
    id: string;
    name: string;
    calories: number;
    carbs: number;
    fat: number;
    protien: number;
    type: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
}

export interface DailyMacroData {
    id: string;
    name: string
    date: string;
    calories: number;
    protien: number;
    carbs: number;
    fat: number;
    type: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
    userId: string;
}

export interface ConsolidatedMacro {
    macro: "calories" | "carbs" | "fat" | "protien";
    value: number;
    actualValue: number
    fill: string;
}