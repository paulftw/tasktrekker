import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import { config as loadDotenv } from 'dotenv';
import { fileURLToPath } from 'node:url';

loadDotenv({ path: '.env.local' });
loadDotenv({ path: '.env' });

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    react({
      plugins: [
        [
          '@swc/plugin-relay',
          {
            rootDir,
            artifactDirectory: './src/__generated__',
            language: 'typescript',
            eagerEsModules: true,
          },
        ],
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
