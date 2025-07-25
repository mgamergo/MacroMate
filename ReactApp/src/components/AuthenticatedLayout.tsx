import { Outlet } from "react-router-dom";
import LogMealButton from "@/components/LogMealButton.tsx";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/NavBar.tsx";

export default function AuthenticatedLayout() {
    return (
        <div className="bg-background text-foreground h-screen w-full">

            <Navbar />

            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>

            <LogMealButton />
            <Toaster />
        </div>
    );
}