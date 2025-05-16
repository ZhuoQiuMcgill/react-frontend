import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    // Include .js files with JSX
    include: "**/*.{jsx,js}"
  })],
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  }
})