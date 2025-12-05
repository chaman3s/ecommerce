import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // 🚀 This forces Vite to bundle Apollo Client fully
  optimizeDeps: {
    include: ["@apollo/client", "graphql"]
  }
})
