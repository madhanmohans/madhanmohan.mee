import type { Root, Heading, Link } from 'mdast';
import { visit } from 'unist-util-visit';

export function remarkStripHeadingLinks() {
  return function (tree: Root) {
    visit(tree, 'heading', (headingNode: Heading) => {
      visit(headingNode, 'link', (linkNode: Link, linkIndex: number | undefined, linkParent: any) => {
        if (linkParent && linkIndex !== undefined) {
          linkParent.children.splice(linkIndex, 1, ...linkNode.children);
          return linkIndex;
        }
      });
    });
  };
}
