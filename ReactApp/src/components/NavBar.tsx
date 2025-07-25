import { Link } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import appLogo from "@/assets/app_logo.png";
import {Switch} from "@/components/ui/switch.tsx";
import {useStore} from "@/store/store.ts";
import { IoIosSunny, IoIosMoon } from "react-icons/io";
import { dark } from "@clerk/themes";


export default function Navbar() {
    const theme = useStore((state) => state.theme);
    const setTheme = useStore((state) => state.setTheme);
    return (
        <nav className="sticky top-0 flex items-center justify-between px-6 py-1 border border-border shadow-navbar-glow bg-[var(--navbar-bg)]">
            <div className="flex items-center">
                <Link to="/" className="mr-8">
                    <img src={appLogo} alt="App Logo" className="h-12 w-12" />
                </Link>
            </div>

            <div className="hidden flex space-x-8  font-handwritten text-lg md:block">
                <Link to="/" className="hover:underline">
                    Home
                </Link>
                <Link to="/calendar" className="hover:underline">
                    Calendar
                </Link>
                <Link to="/database" className="hover:underline">
                    Database
                </Link>
                <Link to="/check-in" className="hover:underline">
                    Check-In
                </Link>
            </div>

            <div className="flex gap-5 items-center">
                <div className="flex items-center gap-3">
                    {theme == "light" ? <IoIosSunny size={25} color="black" /> : <IoIosMoon size={25} />}
                    <Switch checked={theme == "dark"} onCheckedChange={() => setTheme(theme == "dark" ? "light" : "dark")} />
                </div>
                <UserButton appearance={theme == "dark" ? dark : undefined}/>
            </div>
        </nav>
    );
}