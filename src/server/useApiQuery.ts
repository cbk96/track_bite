import { QueryFunction, useQuery } from "@tanstack/react-query";

import { get, post, put, del } from "./";

export const queryFnGet = async <T>(
  url: string,
  jwt?: string | null | undefined
): Promise<T> => {
  const res = await get(url, jwt);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error || "서버 통신 중 문제가 발생했습니다.");
  }

  return json as T;
};

export const queryFnPost = async <T>(
  url: string,
  variables: Object,
  jwtKey?: string | null | undefined
): Promise<T> => {
  const res = await post(url, variables, jwtKey);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error || "서버 통신 중 문제가 발생했습니다.");
  }

  return json as T;
};

export const queryFnPut = async <T>(
  url: string,
  variables: Object,
  jwtKey?: string | null | undefined
): Promise<T> => {
  const res = await put(url, variables, jwtKey);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error || "요청 실패");
  }

  return json as T;
};

export const useFetchQuery = <T>(
  queryKey: (string | number | Object)[],
  queryFn: QueryFunction<T, readonly unknown[]>,
  enabled: boolean = true,
  staleTime?: number
) => {
  staleTime = 6;
  return useQuery<T>({
    queryKey: queryKey,
    queryFn: queryFn,
    enabled,
    retry: 1,
    staleTime: 1000 * staleTime,
  });
};
