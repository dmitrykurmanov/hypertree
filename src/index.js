import { h, app } from "hyperapp";

import TreeItem from "./components/TreeItem.js";
import TreeNode from "./components/TreeNode.js";
import actions from "./actions.js";

let nodesCount = 1;

export const normalize = nodes => {
  let id, node;
  let stack = nodes;
  let normalizedTree = {};

  stack.forEach((node, index) => {
    node.parentId = "root";
    node.index = index + 1;
    node.id = "ht-node-" + nodesCount++;
    stack.forEach((siblingNode, siblingIndex) => {
      if (!Array.isArray(siblingNode.siblingsIds)) siblingNode.siblingsIds = [];

      if (siblingIndex !== index) {
        siblingNode.siblingsIds.push(node.id);
      }
    });
  });

  while (stack.length > 0) {
    node = stack.shift();
    id = node.id;

    if (Array.isArray(node.children)) {
      node.children.forEach((subnode, index) => {
        subnode.id = "ht-node-" + nodesCount++;
        subnode.parentId = id;
        subnode.index = index + 1;
        if (!Array.isArray(node.childrenIds)) node.childrenIds = [];
        node.childrenIds.push(subnode.id);

        node.children.forEach((siblingNode, siblingIndex) => {
          if (!Array.isArray(siblingNode.siblingsIds))
            siblingNode.siblingsIds = [];

          if (siblingIndex !== index) {
            siblingNode.siblingsIds.push(subnode.id);
          }
        });

        stack.push(subnode);
      });

      delete node.children;
    } else {
      node.childrenIds = [];
    }

    normalizedTree[id] = node;
  }

  return normalizedTree;
};

export const render = config => {
  const generateMarkup = normalizedTree => {
    return normalizedTree;

    // debugger;
    // let normalizedItem = null;
    // let normalizedArray = [];
    // let treeItem = null;
    // let treeArray = [];
    // let stack = null;

    // Object.keys(normalizedItems).forEach(key => {
    //   normalizedArray.push(normalizedItems[key]); //init stack array
    // });

    // while (normalizedArray.length > 0) {
    //   normalizedItem = normalizedArray.shift();

    //   if (!normalizedItem.parent) {
    //     treeArray.push(normalizedItem);
    //   } else {
    //     let isChildInserted = false;
    //     stack = treeArray;

    //     treeArray.forEach((treeItem, index) => {
    //       // need to recursiv need to get nested children
    //       if (normalizedItem.parent === treeItem.id) {
    //         treeItem.items.push(normalizedItem);
    //         isChildInserted = true;
    //       }
    //     });

    //     if (!isChildInserted) normalizedArray.push(normalizedItem);
    //   }
    // }

    // for (let i = 0; i < stack.length; i++) {
    //   item = stack[i];
    //   // arr = arr.filter(item => item !== value)

    //   if (item.parent) {
    //     //try to insert
    //     markup.forEach(() => {});
    //   } else {
    //     markup.push(item);
    //   }
    // }

    // if (item.parent) {
    //   var markup = generateTreeMarkup(item.items, actions);
    //   return (
    //     <TreeNode item={item} actions={actions}>
    //       {markup}
    //     </TreeNode>
    //   );
    // }
    // return <TreeItem text={item.text} />;

    // return treeArray;
  };

  const view = (state, actions) => {
    let markup = generateMarkup(state.nodes);

    return (
      <div>
        <h1>{state.title}</h1>
        {markup}
      </div>
    );
  };

  const state = {
    title: config.title,
    nodes: normalize(config.nodes)
  };

  const wiredActions = app(state, actions, view, document.body);

  return {
    ...wiredActions
  };
};
