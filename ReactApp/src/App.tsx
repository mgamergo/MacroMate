import {Routes, Route} from 'react-router-dom'
import AuthPage from "@/pages/Authentication.tsx";
import RequireAuth from "@/components/RequireAuth.tsx";
import {DailyMacrosWidget} from "@/components/DailyMacrosWidget.tsx";
import AuthenticatedLayout from "@/components/AuthenticatedLayout.tsx";
import {Toaster} from "react-hot-toast";
import {useStore} from "@/store/store.ts";
import StepTrackingWidget from "@/components/StepTrackingWidget.tsx";
import Test from './components/Test';


export default function App() {
    const theme = useStore((state) => state.theme)


    return (
        <div className={`bg-background text-foreground ${theme}`}>
            <Routes>
                <Route path="/login" element={<AuthPage/>}/>
                <Route
                    path="/"
                    element={
                        <RequireAuth>
                            <AuthenticatedLayout />
                        </RequireAuth>}>
                        <Route index element={<DailyMacrosWidget/>} />
                </Route>
            </Routes>

            <Toaster />
        </div>
    )
}