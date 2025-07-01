import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite' // Import the Tailwind CSS Vite plugin
import vueDevtools from 'vite-plugin-vue-devtools' // Import the Vue Devtools plugin for development

// If you're using TypeScript for path aliases (optional)
import path from 'path'

export default defineConfig({
  plugins: [vue(), vueDevtools(), tailwindcss()],
  base: '/fck-slime-rancher/',
  resolve: {
    // Optional: Configure path aliases for easier imports (e.g., @/components)
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
