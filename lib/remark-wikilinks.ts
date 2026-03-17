import type { Root, Text, Link } from 'mdast';
import type { Transformer } from 'unified';
import { visit } from 'unist-util-visit';

/**
 * Remark plugin that converts Obsidian-style [[wikilinks]] into standard
 * markdown link nodes so they work with fumadocs' extractLinkReferences.
 *
 * Supports:
 *   [[page-name]]           → [page-name](page-name)
 *   [[page-name|Display]]   → [Display](page-name)
 *
 * Skips image embeds like ![[image.png]]
 */
export function remarkWikilinks(): Transformer<Root, Root> {
    // Matches [[target]] or [[target|alias]] but NOT ![[...]] (image embeds)
    const wikilinkRegex = /(?<!!)\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;

    return (tree) => {
        visit(tree, 'text', (node: Text, index, parent) => {
            if (!parent || index === undefined) return;

            const value = node.value;
            if (!value.includes('[[')) return;

            const children: (Text | Link)[] = [];
            let lastIndex = 0;

            for (const match of value.matchAll(wikilinkRegex)) {
                const fullMatch = match[0];
                const target = match[1].trim();
                const alias = match[2]?.trim();
                const matchStart = match.index!;

                // Add any text before this match
                if (matchStart > lastIndex) {
                    children.push({
                        type: 'text',
                        value: value.slice(lastIndex, matchStart),
                    });
                }

                // Slugify the target: lowercase, strip special chars, collapse hyphens
                const slug = target
                    .toLowerCase()
                    .replace(/[`'"!?()[\]{},.:;@#$%^&*~<>]/g, '') // strip special chars
                    .replace(/[\s_]+/g, '-')   // spaces/underscores → hyphens
                    .replace(/-{2,}/g, '-')    // collapse consecutive hyphens
                    .replace(/^-|-$/g, '');     // trim leading/trailing hyphens

                // Create a standard link node
                children.push({
                    type: 'link',
                    url: slug,
                    children: [{ type: 'text', value: alias || target }],
                });

                lastIndex = matchStart + fullMatch.length;
            }

            // If no matches were found, leave the node unchanged
            if (children.length === 0) return;

            // Add any remaining text after the last match
            if (lastIndex < value.length) {
                children.push({
                    type: 'text',
                    value: value.slice(lastIndex),
                });
            }

            // Replace the text node with the new children
            parent.children.splice(index, 1, ...children);
        });
    };
}
