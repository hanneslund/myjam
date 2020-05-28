import {
  ComponentNode,
  SideEffectFunction,
  State,
  RefObj,
  DependencyList,
} from "./types";
import { defer } from "./shared";

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
export function useState<S>(
  initialState: (() => S) | S
): [S, (newState: S | ((currentState: S) => S)) => void] {
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

export function useCallback<T extends Function>(
  fn: T,
  deps: DependencyList
): T {
  const memoedFn = useMemo(() => fn, deps);
  return memoedFn;
}
