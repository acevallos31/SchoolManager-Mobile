import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: { 'react-native': fileURLToPath(new URL('./tests/reactNative.ts', import.meta.url)) },
  },
  esbuild: { jsx: 'automatic' },
  test: { environment: 'node', include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'], clearMocks: true },
});
