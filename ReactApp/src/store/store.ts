import { create } from "zustand";

type Store = {
    theme: string;
    setTheme: (a: "light" | "dark") => void;
}

export const useStore = create<Store>((set) => ({
    theme: "dark",
    setTheme: (str) => {
        set({theme: str})
    },
}))