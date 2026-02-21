import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  define: {
    'process.env.VITE_OPENCODE_API_URL': JSON.stringify('https://proxy.hoainho.info'),
    'process.env.VITE_OPENCODE_API_KEY': JSON.stringify('hoainho'),
    'process.env.API_KEY': JSON.stringify(''),
    'process.env.GEMINI_API_KEY': JSON.stringify(''),
  },
});
