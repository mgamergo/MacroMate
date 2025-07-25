import {Button} from "@/components/ui/button.tsx";
import LogMealForm from "@/components/LogMealForm.tsx";
import {useState} from "react";

export default function LogMealButton() {
    const [open, setOpen] = useState(false);
    const rotation = open ? "rotate-45" : ""

    return (
        <>
            <div className="absolute right-8 bottom-8 hover:cursor-pointer">
                <Button className="h-12 w-12 rounded-full" variant="default" onClick={() => setOpen(true)} >
                    <span className={`text-4xl font-light transition-transform ${rotation}`}>+</span>
                </Button>
            </div>

            {
                open && (
                    <LogMealForm setOpen = {setOpen} />
                )

            }
        </>
    )
}