// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://genuinegeekmedia.com',
  vite: {
    plugins: [tailwindcss()]
  }
});
