/* eslint-disable no-constant-condition */
import "./tailwind.css";
import Page from "__myjam_inject_page__";
import { connectTreeToDom } from "./runtime/client";
import { createTree } from "./runtime/shared";

let props;
const propsTag = document.getElementById("__myjam_data__") as HTMLScriptElement;
if (propsTag) {
  props = JSON.parse(propsTag.text);
}

const tree = createTree(Page, props, false);
connectTreeToDom(tree, document.getElementById("__myjam"));
