import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Chating_UI already owns 5173 — keep the admin panel on its old port
  // so existing bookmarks / muscle memory still work.
  server: { port: 3000 },
})
