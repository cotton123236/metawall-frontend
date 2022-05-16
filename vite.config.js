import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'

dotenv.config({ path: './../config.env' })
// console.log(process.env.PORT)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: './../public'
  }
  // server: {
  //   proxy: {
  //     '/api': `http://localhost:${process.env.PORT}/`,
  //   },
  // }
})
