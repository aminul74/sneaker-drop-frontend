/**
 * Configuration
 * Centralized app configuration from environment variables
 */

const config = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
};

export default config;
