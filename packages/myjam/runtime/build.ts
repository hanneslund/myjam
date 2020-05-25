import type { JSXProps, JSXComponent } from "../jsx-runtime";
import type { TreeNode, RootNode } from "./types";
import { getClasses, getStyles, isNotChildren, createTree } from "./shared";

// github.com/preactjs/preact-render-to-string/blob/master/src/index.js#L9
const VOID_ELEMENTS = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/;

export const renderHtml = (
  pageComponent: JSXComponent,
  props: JSXProps = {}
): string => renderTreeToString(createTree(pageComponent, props, false));

function renderTreeToString(node: TreeNode | RootNode): string {
  if (node.type === "NullNode") return "";
  if (node.type === "RootNode") return renderTreeToString(node.child);
  if (node.type === "ComponentNode" || node.type === "FragmentNode") {
    return `${node.children.map(renderTreeToString).join("")}`;
  }
  if (node.type === "TextNode") return `${String(node.value)}<!-- -->`; // Add comment node to seperate text nodes

  const isVoidElement = node.tag.match(VOID_ELEMENTS);
  const closingTag = isVoidElement ? "" : `</${node.tag}>`;
  if (isVoidElement && node.children.length !== 0) {
    console.error(
      `❌ ${node.tag} is a void element tag and can't have children.`
    );
    throw new Error();
  }

  if (node.tag === "textarea") {
    const { value, ...rest } = node.props;
    return `<textarea${renderPropsToString(rest)}>${value}</textarea>`;
  }

  return `<${node.tag}${renderPropsToString(node.props)}>${node.children
    .map(renderTreeToString)
    .join("")}${closingTag}`;
}

function renderPropsToString(props: JSXProps) {
  return Object.entries<any>(props).reduce((acc, [name, val]) => {
    if (isNotChildren(name) && !name.startsWith("on")) {
      if (typeof val === "boolean") {
        return val ? `${acc} ${name}` : acc;
      }

      if (name === "className") {
        name = "class";
      }
      if (name === "class") {
        val = getClasses(val);
      }
      if (name === "style") val = getStyles(val);
      return `${acc} ${name}="${val}"`;
    }

    return acc;
  }, "");
}
