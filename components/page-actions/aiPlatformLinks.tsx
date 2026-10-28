import {
  ChatGptIcon,
  ClaudeIcon,
  CursorIcon,
  SciraIcon,
} from './platformIcons';

export interface AiPlatformLink {
  title: string;
  href: string;
  icon: React.ReactNode;
}

// Deep links that open an AI chat primed to read the given markdown file
export function buildAiPlatformLinks(
  absoluteMarkdownUrl: string,
): AiPlatformLink[] {
  const queryPrompt = `Read ${absoluteMarkdownUrl}, I want to ask questions about it.`;

  return [
    {
      title: 'Open in Scira AI',
      href: `https://scira.ai/?${new URLSearchParams({ q: queryPrompt })}`,
      icon: <SciraIcon />,
    },
    {
      title: 'Open in ChatGPT',
      href: `https://chatgpt.com/?${new URLSearchParams({
        hints: 'search',
        q: queryPrompt,
      })}`,
      icon: <ChatGptIcon />,
    },
    {
      title: 'Open in Claude',
      href: `https://claude.ai/new?${new URLSearchParams({ q: queryPrompt })}`,
      icon: <ClaudeIcon />,
    },
    {
      title: 'Open in Cursor',
      href: `https://cursor.com/link/prompt?${new URLSearchParams({
        text: queryPrompt,
      })}`,
      icon: <CursorIcon />,
    },
  ];
}
