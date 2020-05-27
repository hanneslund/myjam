import {
  ComponentNode,
  SideEffectFunction,
  State,
  RefObj,
  DependencyList,
} from "./types";
import { noop, defer } from "./shared";

let diffComponentChildren: (comp: ComponentNode) => void;
export function setDiffComponentChildren(diff: (comp: ComponentNode) => void) {
  diffComponentChildren = diff;
}

let activeComponent: ComponentNode;
export function setActiveComponent(component: ComponentNode) {
  useStateCount = 0;
  useRefCount = 0;
  useMemoCount = 0;
  activeComponent = component;
}

let useStateCount = 0;
export function useState<T>(
  initialState: T
): [T, (newState: T | ((currentState: T) => T)) => void] {
  if (!diffComponentChildren) return [initialState, noop];

  if (!activeComponent.state) {
    activeComponent.state = [];
  }

  const componentState = activeComponent.state;
  const currentState = componentState[useStateCount];

  if (!currentState) {
    const stateItem: State = {
      parent: activeComponent,
      state: initialState,
      setState: (newState: any) => {
        if (typeof newState === "function") {
          stateItem.state = newState(stateItem.state);
        } else {
          stateItem.state = newState;
        }
        stateItem.parent.stateChanged = true;
        // Defer diffing in case setstate is called more times
        defer(() => {
          diffComponentChildren(stateItem.parent);
        });
      },
    };
    componentState.push(stateItem);
    useStateCount++;
    return [stateItem.state, stateItem.setState];
  }

  useStateCount++;
  return [currentState.state, currentState.setState];
}

export function useEffect(effectFunction: SideEffectFunction): void {
  // diffComponentChildren is only set on client
  if (!diffComponentChildren || !activeComponent.onMount) {
    return;
  }
  activeComponent.onMount.push(effectFunction);
}

let useRefCount = 0;
export function useRef<T>(initialValue: T): RefObj<T> {
  if (!activeComponent.refs) {
    activeComponent.refs = [];
  }

  let currentRef = activeComponent.refs[useRefCount];

  if (!currentRef) {
    currentRef = { current: initialValue };
    activeComponent.refs.push(currentRef);
  }

  useRefCount++;
  return currentRef;
}

let useMemoCount = 0;
export function useMemo<T>(factory: () => T, deps: DependencyList): T {
  if (!activeComponent.memoized) {
    activeComponent.memoized = [];
  }

  const currentMemoized = activeComponent.memoized[useMemoCount];

  if (!currentMemoized) {
    const value = factory();
    const memoized: [any, DependencyList] = [value, deps];
    activeComponent.memoized.push(memoized);

    useMemoCount++;
    return value;
  }

  let currentValue = currentMemoized[0];
  const currentDeps = currentMemoized[1];

  if (!currentDeps.every((dep, i) => dep === deps[i])) {
    currentValue = factory();
    activeComponent.memoized[useMemoCount] = [currentValue, deps] as [
      any,
      DependencyList
    ];
  }

  useMemoCount++;
  return currentValue;
}

export function useCallback(fn: () => void, deps: DependencyList): () => void {
  const memoedFn = useMemo(() => fn, deps);
  return memoedFn;
}
