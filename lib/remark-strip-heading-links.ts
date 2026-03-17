import { visit } from 'unist-util-visit';

export function remarkStripHeadingLinks() {
  return function (tree: any) {
    visit(tree, 'heading', (headingNode: any) => {
      visit(headingNode, 'link', (linkNode: any, index: any, parent: any) => {
        if (parent && index !== undefined) {
          parent.children.splice(index, 1, ...linkNode.children);
          return index; // continue at the same index
        }
      });
    });
  };
}
