import type { Root, Text, Link } from 'mdast';
import type { Transformer } from 'unified';
import { visit } from 'unist-util-visit';

export function remarkWikilinks(): Transformer<Root, Root> {
  const wikilinkPattern = /(?<!!)\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;

  return (tree) => {
    visit(tree, 'text', (textNode: Text, nodeIndex, parentNode) => {
      if (!parentNode || nodeIndex === undefined) return;

      const textContent = textNode.value;
      if (!textContent.includes('[[')) return;

      const replacementNodes: (Text | Link)[] = [];
      let lastProcessedIndex = 0;

      for (const match of textContent.matchAll(wikilinkPattern)) {
        const entireMatch = match[0];
        const linkTarget = match[1].trim();
        const displayAlias = match[2]?.trim();
        const matchStartIndex = match.index!;

        if (matchStartIndex > lastProcessedIndex) {
          replacementNodes.push({
            type: 'text',
            value: textContent.slice(lastProcessedIndex, matchStartIndex),
          });
        }

        const slugifiedTarget = linkTarget
          .toLowerCase()
          .replace(/[`'"!?()[\]{},.:;@#$%^&*~<>]/g, '')
          .replace(/[\s_]+/g, '-')
          .replace(/-{2,}/g, '-')
          .replace(/^-|-$/g, '');

        replacementNodes.push({
          type: 'link',
          url: slugifiedTarget,
          children: [{ type: 'text', value: displayAlias || linkTarget }],
        });

        lastProcessedIndex = matchStartIndex + entireMatch.length;
      }

      if (replacementNodes.length === 0) return;

      if (lastProcessedIndex < textContent.length) {
        replacementNodes.push({
          type: 'text',
          value: textContent.slice(lastProcessedIndex),
        });
      }

      parentNode.children.splice(nodeIndex, 1, ...replacementNodes);
    });
  };
}
