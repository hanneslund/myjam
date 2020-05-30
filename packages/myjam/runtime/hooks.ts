import {
  ComponentNode,
  EffectFunction,
  State,
  RefObj,
  DependencyList,
} from "./types";
import { defer } from "./shared";
import { diffComponentChildren } from "./client";

let activeComponent: ComponentNode;
export function setActiveComponent(component: ComponentNode) {
  activeComponent = component;
  useStateCount = 0;
  useEffectCount = 0;
  useRefCount = 0;
  useMemoCount = 0;
}

let useStateCount = 0;
export function useState<S>(
  initialState: (() => S) | S
): [S, (newState: S | ((currentState: S) => S)) => void] {
  if (__BUILD__) {
    const state =
      initialState instanceof Function ? initialState() : initialState;
    return [state, () => {}];
  }
  if (!activeComponent.state) {
    activeComponent.state = [];
  }

  const componentState = activeComponent.state;
  const currentState = componentState[useStateCount];

  if (!currentState) {
    const stateItem: State = {
      parent: activeComponent,
      state: initialState instanceof Function ? initialState() : initialState,
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

type Reducer<S, A> = (prevState: S, action: A) => S;

export function useReducer<S, A>(
  reducer: Reducer<S, A>,
  initialState: S
): [S, (action: A) => void];
export function useReducer<S, A, I>(
  reducer: Reducer<S, A>,
  initialArg: I,
  init: (initialArg: I) => S
): [S, (action: A) => void];
export function useReducer(reducer: any, initialArg: any, init?: any) {
  const [reducerState, setReducerState] = useState(() =>
    init ? init(initialArg) : initialArg
  );

  const dispatch = (action: any) => {
    setReducerState(reducer(reducerState, action));
  };

  return [reducerState, dispatch];
}

let useEffectCount = 0;
export function useEffect(
  effectFunction: EffectFunction,
  deps?: DependencyList
): void {
  if (__BUILD__) {
    return;
  }

  if (!activeComponent.effects) {
    activeComponent.effects = [];
  }

  const currentEffect = activeComponent.effects[useEffectCount];

  if (!currentEffect) {
    const comp = activeComponent;
    defer(() => {
      const cleanupFn = effectFunction();
      comp.effects?.push([cleanupFn, deps]);
    });
  } else {
    const [cleanupFn, currentDeps] = currentEffect;

    if (
      !currentDeps ||
      !deps ||
      !currentDeps.every((dep, i) => dep === deps[i])
    ) {
      defer(() => {
        if (cleanupFn) cleanupFn();
        currentEffect[0] = effectFunction();
        currentEffect[1] = deps;
      });
    }
  }

  useEffectCount++;
}

let useRefCount = 0;
export function useRef<T>(initialValue: T): RefObj<T> {
  if (__BUILD__) {
    return {
      current: initialValue,
    };
  }

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
  if (__BUILD__) {
    return factory();
  }

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

export function useCallback<T extends Function>(
  fn: T,
  deps: DependencyList
): T {
  const memoedFn = useMemo(() => fn, deps);
  return memoedFn;
}
