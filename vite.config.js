import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    base: import.meta.env.MODE === 'production' ? '/D4_SecretRoomSearch/' : '/',
    plugins: [react()],
})
