//
import { useState, useEffect, useCallback, useRef } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(
  fetchFn: () => Promise<T>,
  dependency?: unknown,
): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchRef = useRef(fetchFn);

  useEffect(() => {
    fetchRef.current = fetchFn;
  }, [fetchFn]);

  // TS LESSON: useCallback — memoizes the function
  // so it's not recreated on every render
  // only recreates when dependency changes
  const memoizedFetch = useCallback(() => {
    void dependency;
    return fetchRef.current();
  }, [dependency]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await memoizedFetch();
        if (!cancelled) setData(result);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [memoizedFetch]);
  // ← now safe to include — memoized function

  return { data, loading, error };
}

export default useFetch;
