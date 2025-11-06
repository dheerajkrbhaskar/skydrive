import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import App from './App.js'
import { BrowserRouter } from 'react-router-dom'
import { QueryProvider } from './lib/react-query/QueryProvider.tsx'
import AuthContextProvider from './context/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>,
)
