import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve : {
    alias : {
      "@pages" : "/src/pages",
      "@components" : "/src/components",
      "@models" : "/src/models",
      "@routes" : "/src/routes",
      "@services" : "/src/services",
      "@utils" : "/src/utils"
    }
  }
})
