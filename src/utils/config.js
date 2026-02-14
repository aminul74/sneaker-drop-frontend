/*
 * Configuration file for the application
 * Currently only contains the API URL, but can be expanded in the future
 * to include other settings as needed.
 */

const config = {
  apiUrl: import.meta.env.VITE_API_URL || "",
};

export default config;
