import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), 
    tailwindcss()
  ],
  erver: {
    fs: {
      allow: ['..']
    }
  },
  // ✅ FIX JSX PARSING
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: []
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
})
