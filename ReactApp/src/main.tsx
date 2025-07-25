import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider,} from '@tanstack/react-query'

const queryClient = new QueryClient();

const PUBLISHABLE_KEY:string = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error('Add your Clerk Publishable Key to the .env file')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
              <QueryClientProvider client={queryClient}>
                <App />
              </QueryClientProvider>
          </ClerkProvider>
      </BrowserRouter>
  </StrictMode>,
)
