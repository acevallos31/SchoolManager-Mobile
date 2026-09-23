import { vi } from 'vitest';

export const Platform = { OS: 'android' };
export const AppState = {
  currentState: 'active',
  addEventListener: vi.fn(() => ({ remove: vi.fn() })),
};
export const View = 'View';
export const Text = 'Text';
export const ActivityIndicator = 'ActivityIndicator';
