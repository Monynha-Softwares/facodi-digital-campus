
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: () => ({ order: () => Promise.resolve({ data: [], error: null }) })
    }))
  }
}));

import { useCursos } from '../hooks/useCursos';
import { supabase } from '../integrations/supabase/client';

const queryClient = new QueryClient();

// Mock supabase
interface SupabaseFromMock {
  select: () => {
    order: () => Promise<{ data: unknown[]; error: null }>;
  };
}

vi.spyOn(supabase, 'from').mockReturnValue({
  select: () => ({ order: () => Promise.resolve({ data: [], error: null }) })
} as unknown as SupabaseFromMock);

describe('useCursos', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('fetches cursos', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useCursos(), { wrapper });
    
    // Wait for the query to complete
    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    
    expect(result.current.data).toEqual([]);
  });
});
