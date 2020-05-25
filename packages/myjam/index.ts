import nodeFetch from "node-fetch";

export type GetPropsFunction<T> = (fetch: typeof nodeFetch) => T | Promise<T>;

export { useState, useEffect } from "./runtime/hooks";
