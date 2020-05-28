import { JSXComponent, JSXProps, JSXChild, Fragment } from "../jsx-runtime";
import type {
  ComponentNode,
  DomNode,
  NodeParent,
  NullNode,
  TreeNode,
  RootNode,
  TextNode,
  FragmentNode,
  SideEffectFunction,
} from "./types";
import { setActiveComponent } from "./hooks";

export function defer(fn: () => void) {
  Promise.resolve().then(fn);
}

export const arrayify = <T>(itemOrArray: T | T[]): T[] => {
  if (itemOrArray === undefined) return [];
  return Array.isArray(itemOrArray) ? itemOrArray : [itemOrArray];
};

export const isNotChildren = (key: string) => key !== "children";

export const isRef = (key: string) => key === "ref";

export const isNullJSXChild = (
  jsx: JSXChild
): jsx is null | undefined | boolean => jsx == null || typeof jsx === "boolean";

export function getStyles(classes: string | { [key: string]: string }) {
  if (typeof classes === "string") return classes;

  return Object.entries(classes)
    .reduce((acc, [name, style]) => {
      return acc + `${name}:${style};`;
    }, "")
    .trim();
}

export function getClasses(
  classes: string | { [key: string]: boolean }
): string {
  if (typeof classes === "string") return classes;

  return Object.entries(classes)
    .reduce((acc, [names, active]) => {
      if (active) return acc + ` ${names}`;
      return acc;
    }, "")
    .trim();
}

export const createNullNode = (parent: NodeParent): NullNode => ({
  type: "NullNode",
  parent,
});

const createComponentNode = (
  component: JSXComponent,
  props: JSXProps,
  parent: NodeParent
) =>
  ({
    type: "ComponentNode",
    component,
    parent,
    props,
    onMount: [] as SideEffectFunction[], // Removed when effects has been exectued
  } as ComponentNode);

export const createDomNode = (
  tag: string,
  props: JSXProps,
  parent: NodeParent,
  createDomElement: boolean
): DomNode =>
  ({
    type: "DomNode",
    tag,
    parent,
    props,
    dom: createDomElement ? document.createElement(tag) : undefined,
  } as DomNode);

export const createFragmentNode = (props: JSXProps, parent: NodeParent) =>
  ({
    type: "FragmentNode",
    parent,
    props,
  } as FragmentNode);

export function runComponent(node: ComponentNode): JSXChild[] {
  setActiveComponent(node);
  return arrayify(node.component(node.props));
}

export const createTextNode = (
  value: string | number,
  parent: NodeParent,
  createDomElement: boolean
) =>
  ({
    type: "TextNode",
    parent,
    value,
    dom: createDomElement ? document.createTextNode(String(value)) : undefined,
  } as TextNode);

export function createTreeNode(
  jsx: JSXChild,
  parent: NodeParent,
  createDomElement: boolean
): TreeNode {
  if (isNullJSXChild(jsx)) {
    return createNullNode(parent);
  }
  if (Array.isArray(jsx)) {
    // Put array child into a fragmentnode
    return createFragmentNode({ children: jsx }, parent);
  }
  if (typeof jsx !== "object") {
    return createTextNode(jsx, parent, createDomElement);
  }
  if (typeof jsx.type === "string") {
    return createDomNode(jsx.type, jsx.props, parent, createDomElement);
  }
  if (jsx.type === Fragment) {
    return createFragmentNode(jsx.props, parent);
  }
  return createComponentNode(jsx.type, jsx.props, parent);
}

export function growTreeFromNodeChildren(
  node: TreeNode,
  createDomElement: boolean
) {
  if (node.type === "NullNode" || node.type === "TextNode") return;

  let children: JSXChild[];
  if (node.type === "DomNode" || node.type === "FragmentNode") {
    children = arrayify(node.props.children);
  } else {
    children = runComponent(node);
  }

  node.children = children.map((child: JSXChild) => {
    const treeNode = createTreeNode(child, node, createDomElement);
    growTreeFromNodeChildren(treeNode, createDomElement);
    return treeNode;
  });
}

export function createTree(
  pageComponent: JSXComponent,
  props: JSXProps = {},
  createDomElement: boolean
): RootNode {
  const rootNode: any = {
    type: "RootNode",
  };
  rootNode.child = createComponentNode(pageComponent, props, rootNode);
  growTreeFromNodeChildren(rootNode.child, createDomElement);

  return rootNode;
}
