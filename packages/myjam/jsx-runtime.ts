export type JSXComponent = (props: JSXProps) => JSXChild;

export type JSXNode = {
  type: string | JSXComponent | typeof Fragment;
  props: JSXProps;
};

export type JSXProps = {
  children?: JSXChild | JSXChild[];
  [key: string]: any;
};

export type JSXChild =
  | JSXNode
  | string
  | number
  | boolean
  | null
  | undefined
  | JSXChild[];

export function jsx(type: string | JSXComponent, props: JSXProps): JSXNode {
  return {
    type,
    props,
  };
}

export function jsxs(type: string | JSXComponent, props: JSXProps): JSXNode {
  return {
    type,
    props,
  };
}

export const Fragment = Symbol.for("JSX.Fragment");
