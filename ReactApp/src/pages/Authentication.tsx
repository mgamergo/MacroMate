import { SignIn, useAuth } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'

export default function AuthPage() {
    const { isSignedIn } = useAuth()
    if (isSignedIn) {
        return <Navigate to="/" replace />
    }
    return <SignIn />
}