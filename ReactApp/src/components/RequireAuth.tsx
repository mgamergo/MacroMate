import {useAuth} from "@clerk/clerk-react";
import {Navigate} from "react-router-dom";
import type {JSX} from "react";

interface RequireAuthProps {
    children: JSX.Element
}

export default function RequireAuth({ children }: RequireAuthProps) {
    const {isSignedIn} = useAuth();

    if (!isSignedIn) {
        return <Navigate to="/login" replace/>
    }

    return children;
}