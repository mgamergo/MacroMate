import {MealType, ActivityType} from "@prisma/client";

export interface RequestMacros {
    date: Date
    name: string
    calories: number
    protien: number
    carbs: number
    fat: number
    type: MealType
}

export interface RequestSteps {
    date: Date
    steps: number
}

export interface RequestWeight {
    date: Date
    weight: number
}

export interface RequestStats {
    height: number
    weight: number
    maintainance: number
    activity: ActivityType
}

export interface  RequestTargets {
    calories: number
    protien: number
    carbs: number
    fat: number
    steps: number
    weight: number
}

export interface RequestOnboardUSer {
    height: number
    weight: number
    activity: ActivityType
    maintainance: number
    calories: number
    protien: number
    carbs: number
    fat: number
    steps: number
    targetWeight: number
}