/* eslint-disable no-constant-condition */
import "./tailwind.css";
import Page from "__myjam_inject_page__";
import {
  connectTreeToDom,
  diffComponentChildren,
  runMountSideffects,
} from "./runtime/client";
import { createTree } from "./runtime/shared";
import { setDiffComponentChildren } from "./runtime/hooks";

let props;
const propsTag = document.getElementById("__myjam_data__") as HTMLScriptElement;
if (propsTag) {
  props = JSON.parse(propsTag.text);
}

setDiffComponentChildren(diffComponentChildren);
const tree = createTree(Page, props, false);
connectTreeToDom(tree, document.getElementById("__myjam"));
runMountSideffects(tree.child);
