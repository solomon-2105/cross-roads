// Dev: "/api" is proxied to the backend by vite.config.js.
// Production: set VITE_API_BASE_URL (e.g. https://your-backend.com/api) at build time.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api"
