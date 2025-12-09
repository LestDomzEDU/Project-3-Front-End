import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../AuthContext';
import React from 'react';

// Mock fetch
global.fetch = jest.fn();

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with null user', () => {
    const wrapper = ({ children }: any) => React.createElement(AuthProvider, { children });
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.me).toBeNull();
  });

  it('should call refresh and set me data', async () => {
    const mockData = {
      authenticated: true,
      userId: 123,
      name: 'Test User',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const wrapper = ({ children }: any) => React.createElement(AuthProvider, { children });
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.refresh();
    });

    await waitFor(() => {
      expect(result.current.me).toEqual(mockData);
    });
  });

  it('should handle refresh errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const wrapper = ({ children }: any) => React.createElement(AuthProvider, { children });
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.refresh();
    });

    await waitFor(() => {
      expect(result.current.me).toEqual({ authenticated: false });
    });
  });
});
