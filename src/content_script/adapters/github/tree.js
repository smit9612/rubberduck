import { buildTree, fillPaths } from "../base/tree";

export const getTreeChildren = (reponame, response) => {
  const { tree } = response || { tree: [] };
  const filenames = tree.map(element => {
    return element.path;
  });
  return {
    name: reponame,
    path: "",
    children: fillPaths(buildTree(filenames), "")
  };
};

export { getPRChildren, flattenChildren } from "../base/tree";
