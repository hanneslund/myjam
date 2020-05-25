import type { JSXComponent, JSXProps } from "../jsx-runtime";

export type State = {
  parent: ComponentNode;
  state: any;
  setState: (newState: any) => void;
};

export type SideEffectFunction = (() => () => void) | (() => void);

export type ComponentNode = {
  type: "ComponentNode";
  component: JSXComponent;
  props: JSXProps;
  parent: NodeParent;
  children: TreeNode[];
  onMount?: SideEffectFunction[];
  onDismount?: (() => void)[];
  state?: State[];
  stateChanged?: boolean;
};

export type FragmentNode = {
  type: "FragmentNode";
  props: JSXProps;
  children: TreeNode[];
  parent: NodeParent;
};

export type DomNode = {
  type: "DomNode";
  tag: string;
  props: JSXProps;
  children: TreeNode[];
  dom: HTMLElement;
  parent: NodeParent;
};

export type TextNode = {
  type: "TextNode";
  dom: Text;
  parent: NodeParent;
  value: string | number;
};

export type RootNode = {
  type: "RootNode";
  child: ComponentNode;
  dom: HTMLElement;
};

export type NullNode = {
  type: "NullNode";
  parent: NodeParent;
};

export type TreeNode =
  | NullNode
  | FragmentNode
  | DomNode
  | ComponentNode
  | TextNode;
export type NodeParent = ComponentNode | DomNode | RootNode | FragmentNode;
