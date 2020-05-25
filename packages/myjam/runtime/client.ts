import { JSXProps, JSXChild, Fragment } from "../jsx-runtime";
import type {
  ComponentNode,
  DomNode,
  TreeNode,
  RootNode,
  FragmentNode,
} from "./types";
import {
  isNullJSXChild,
  arrayify,
  getClasses,
  getStyles,
  isNotChildren,
  growTreeFromNodeChildren,
  createTreeNode,
  runComponent,
  createNullNode,
} from "./shared";

export const getEventName = (key: string) =>
  key.startsWith("on") ? key.slice(2).toLowerCase() : null;

function findFirstDomElement(
  node: ComponentNode | FragmentNode
): HTMLElement | Text | undefined {
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child.type === "NullNode") continue;
    if (child.type === "DomNode" || child.type === "TextNode") {
      return child.dom;
    }
    const firstDom = findFirstDomElement(child);
    if (firstDom) return firstDom;
  }
}

function findNextSiblingDom(node: TreeNode): Node | null | undefined {
  if (node.type === "TextNode" || node.type === "DomNode") {
    return node.dom.nextSibling;
  }

  const parent = node.parent;
  if (parent.type === "RootNode") return null;

  if (parent.children) {
    const nodeIndex = parent.children.indexOf(node);

    for (let i = nodeIndex + 1; i < parent.children.length; i++) {
      const childDom = parent.children[i];
      if (childDom.type === "NullNode") continue;

      if (childDom.type === "DomNode" || childDom.type === "TextNode") {
        return childDom.dom;
      }

      const firstDomElement = findFirstDomElement(childDom);
      if (firstDomElement) return firstDomElement;
    }
  }

  if (parent.type !== "DomNode") {
    return findNextSiblingDom(parent);
  }
}

function findParentDom(node: TreeNode): HTMLElement {
  const parent = node.parent;
  if (parent.type === "ComponentNode" || parent.type === "FragmentNode") {
    return findParentDom(parent);
  }

  return parent.dom;
}

export function runMountSideffects(node: TreeNode) {
  if (node.type === "NullNode" || node.type === "TextNode") return;

  node.children.forEach(runMountSideffects);

  if (node.type === "ComponentNode" && node.onMount) {
    node.onDismount = node.onMount
      .map((fn) => fn())
      .filter(Boolean) as (() => void)[];
    node.onMount = undefined;
  }
}

function runDismountSideffects(node: TreeNode) {
  if (node.type === "NullNode" || node.type === "TextNode") return;

  node.children.forEach(runDismountSideffects);

  if (node.type === "ComponentNode") {
    node.onDismount?.forEach((fn) => fn());
  }
}

function replaceNode(
  current: TreeNode,
  nextChild: JSXChild,
  parentChildren: TreeNode[],
  atIndex: number
) {
  runDismountSideffects(current);

  const newNode = createTreeNode(nextChild, current.parent, true);
  growTreeFromNodeChildren(newNode, true);
  commitTreeToDom(newNode, findNextSiblingDom(current));

  removeDomElements(current);
  parentChildren[atIndex] = newNode;
}

export function diffAndUpdateChildren(
  current: DomNode | ComponentNode | FragmentNode,
  next: JSXChild[]
) {
  const currentChildren = current.children;
  if (!currentChildren) return;

  let i = 0;
  let currentChild = currentChildren[i];
  let nextChild = next[i];
  while (currentChild || nextChild) {
    if (i === next.length) {
      // Remaining nodes can be removed
      currentChildren.splice(i).forEach((child) => {
        runDismountSideffects(child);
        removeDomElements(child);
      });
      return;
    }

    if (i === currentChildren.length) {
      // Remaining new nodes can be added
      const lastChild =
        currentChildren[currentChildren.length - 1] ?? createNullNode(current);
      const before =
        lastChild.parent.type !== "DomNode"
          ? findNextSiblingDom(lastChild)
          : undefined;
      next.slice(i).forEach((child) => {
        const node = createTreeNode(child, current, true);
        growTreeFromNodeChildren(node, true);
        if (node.parent.type === "DomNode") {
          commitTreeToDom(node);
        } else {
          commitTreeToDom(node, before);
        }
        currentChildren.push(node);
      });
      return;
    }

    if (Array.isArray(nextChild)) {
      if (currentChild.type === "FragmentNode") {
        diffAndUpdateChildren(currentChild, nextChild);
      } else {
        replaceNode(currentChild, nextChild, currentChildren, i);
      }
    } else if (nextChild instanceof Object) {
      if (nextChild.type === Fragment) {
        if (currentChild.type === "FragmentNode") {
          diffAndUpdateChildren(
            currentChild,
            arrayify(nextChild.props.children)
          );
        } else {
          replaceNode(currentChild, nextChild, currentChildren, i);
        }
      } else if (typeof nextChild.type === "string") {
        if (
          currentChild.type === "DomNode" &&
          currentChild.tag === nextChild.type
        ) {
          // Same dom type
          diffAndUpdateProps(currentChild, nextChild.props);
          diffAndUpdateChildren(
            currentChild,
            arrayify(nextChild.props.children)
          );
        } else {
          replaceNode(currentChild, nextChild, currentChildren, i);
        }
      } else {
        if (
          currentChild.type === "ComponentNode" &&
          currentChild.component === nextChild.type
        ) {
          // Same component, rerun
          currentChild.props = nextChild.props;
          diffAndUpdateChildren(currentChild, runComponent(currentChild));
        } else {
          replaceNode(currentChild, nextChild, currentChildren, i);
        }
      }
    } else if (isNullJSXChild(nextChild)) {
      if (currentChild.type !== "NullNode") {
        replaceNode(currentChild, nextChild, currentChildren, i);
      }
    } else {
      if (currentChild.type === "TextNode") {
        if (currentChild.value !== nextChild) {
          // Text changed
          currentChild.dom.nodeValue = String(nextChild);
          currentChild.value = nextChild;
        }
      } else {
        replaceNode(currentChild, nextChild, currentChildren, i);
      }
    }

    i++;
    currentChild = currentChildren[i];
    nextChild = next[i];
  }
}

function removeDomElements(node: TreeNode) {
  if (node.type === "NullNode") return;
  if (node.type === "DomNode" || node.type === "TextNode") {
    node.dom.remove();
  } else {
    node.children.forEach(removeDomElements);
  }
}

function setAttribute(dom: any, key: string, val: any) {
  if (key === "class") {
    key = "className";
  }
  if (key === "className") {
    dom[key] = getClasses(val);
  } else if (key === "style") {
    dom[key] = getStyles(val);
  } else {
    dom[key] = val;
  }
}

function diffAndUpdateProps(
  current: DomNode,
  nextProps: JSXProps,
  initial?: boolean
) {
  const currentProps = current.props;
  const allKeys = Object.keys(currentProps).concat(Object.keys(nextProps));
  const uniqueKeys = [...new Set(allKeys)];

  currentProps.children = nextProps.children;

  uniqueKeys.filter(isNotChildren).forEach((key) => {
    const currentProp = currentProps[key];
    const nextProp = nextProps[key];

    if (initial || (currentProp === undefined && nextProp !== undefined)) {
      // Added
      const eventName = getEventName(key);
      if (eventName) {
        current.dom.addEventListener(eventName, nextProp);
      } else {
        setAttribute(current.dom, key, nextProp);
      }
      currentProps[key] = nextProps[key];
    } else if (
      // Deleted
      currentProp !== undefined &&
      nextProp === undefined
    ) {
      const eventName = getEventName(key);
      if (eventName) {
        current.dom.removeEventListener(eventName, currentProp);
      } else {
        current.dom.removeAttribute(key);
      }
      delete currentProps[key];
    } else if (
      // May have changed
      currentProp !== undefined &&
      nextProp !== undefined
    ) {
      // Always set checked and value
      if (key === "checked" || key === "value") {
        (current.dom as any)[key] = nextProps[key];
        currentProps[key] = nextProps[key];
      } else if (currentProp !== nextProp) {
        // Prop changed
        const eventName = getEventName(key);
        if (eventName) {
          current.dom.removeEventListener(eventName, currentProp);
          current.dom.addEventListener(eventName, nextProp);
        } else {
          setAttribute(current.dom, key, nextProp);
        }
        currentProps[key] = nextProps[key];
      }
    }
  });
}

function commitTreeToDom(node: TreeNode, before?: Node | null) {
  if (node.type === "NullNode") return;

  if (node.type === "TextNode" || node.type === "DomNode") {
    if (before) {
      findParentDom(node).insertBefore(node.dom, before);
    } else {
      findParentDom(node).appendChild(node.dom);
    }
  }

  if (node.type === "TextNode") return;
  if (node.type === "DomNode") {
    diffAndUpdateProps(node, node.props, true);
  }

  if (node.type === "ComponentNode" || node.type === "FragmentNode") {
    node.children.forEach((node) => commitTreeToDom(node, before));
  } else {
    node.children.forEach((node) => commitTreeToDom(node));
  }
}

export function connectTreeToDom(node: TreeNode | RootNode, dom: any) {
  if (node.type === "NullNode") return dom;
  if (node.type === "RootNode") {
    node.dom = dom;
    connectTreeToDom(node.child, dom.firstChild);
  } else if (node.type === "TextNode") {
    node.dom = dom;
    // Remove comment that seperates text nodes
    dom.nextSibling.remove();
    return dom.nextSibling;
  } else {
    if (node.type === "DomNode") {
      node.dom = dom;

      // Add event listeners
      Object.entries<any>(node.props).forEach(([prop, val]) => {
        const eventName = getEventName(prop);
        if (eventName && val !== undefined) {
          node.dom.addEventListener(eventName, val);
        }
      });

      let childDom = dom.firstChild;
      node.children.forEach((child) => {
        childDom = connectTreeToDom(child, childDom);
      });

      return dom.nextSibling;
    } else {
      let currentDom = dom;
      node.children.forEach((child) => {
        currentDom = connectTreeToDom(child, currentDom);
      });
      return currentDom;
    }
  }
}

export function diffComponentChildren(node: ComponentNode) {
  // Will only diff once  even if setstate was called several times
  if (!node.stateChanged) return;

  node.stateChanged = false;
  diffAndUpdateChildren(node, runComponent(node));
  runMountSideffects(node);
}
