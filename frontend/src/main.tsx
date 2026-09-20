import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
    throw new Error('Root element "#root" not found')
}

createRoot(rootElement).render(
    <StrictMode>
        <div className="bg-background text-foreground">
            <h1 className="text-2xl font-bold">Time Off Planner</h1>
        </div>
    </StrictMode>,
)
