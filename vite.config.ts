
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // Vite automatically exposes variables prefixed with VITE_ to the client
    // Access them via import.meta.env.VITE_*
    define: {
      // Only expose specific variables if needed for server-side code
      // Client-side variables should use VITE_ prefix
    }
  };
});
