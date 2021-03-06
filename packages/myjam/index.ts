import nodeFetch from "node-fetch";

export type GetPropsFunction<T> = (fetch: typeof nodeFetch) => T | Promise<T>;

export {
  useState,
  useReducer,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "./runtime/hooks";
