import { normalizeTags } from '@/lib/tags';

// Any OpenAI-compatible server works: Ollama (default), LM Studio, llama.cpp
const LOCAL_LLM_BASE_URL =
  process.env.LOCAL_LLM_BASE_URL ?? 'http://localhost:11434/v1';
const LOCAL_LLM_MODEL = process.env.LOCAL_LLM_MODEL ?? 'llama3.2';

const MAX_NOTE_CHARACTERS = 6000;
const MAX_SUGGESTED_TAGS = 5;
const MAX_VOCABULARY_TAGS = 150;
const REQUEST_TIMEOUT_MS = 60_000;

export class LocalLLMError extends Error {}

function buildPrompt(
  title: string,
  content: string,
  existingTags: string[],
): string {
  const vocabulary = existingTags.slice(0, MAX_VOCABULARY_TAGS).join(', ');

  return [
    `Suggest up to ${MAX_SUGGESTED_TAGS} topic tags for the note below.`,
    'Rules:',
    '- Tags are short, lowercase, kebab-case (e.g. "machine-learning").',
    '- Prefer broad topics that group many notes over one-off details.',
    vocabulary
      ? `- Reuse these existing tags whenever they fit: ${vocabulary}`
      : '',
    '- Respond with ONLY a JSON array of strings, no explanation.',
    '',
    `Title: ${title}`,
    '',
    content.slice(0, MAX_NOTE_CHARACTERS),
  ]
    .filter((line) => line !== '')
    .join('\n');
}

// Small local models often wrap the array in prose or code fences, so
// pull out the first JSON array instead of parsing the whole reply
export function parseSuggestedTags(reply: string): string[] {
  const arrayMatch = reply.match(/\[[\s\S]*?\]/);
  if (!arrayMatch) return [];
  try {
    return normalizeTags(JSON.parse(arrayMatch[0])).slice(
      0,
      MAX_SUGGESTED_TAGS,
    );
  } catch {
    return [];
  }
}

export async function suggestTags({
  title,
  content,
  existingTags,
}: {
  title: string;
  content: string;
  existingTags: string[];
}): Promise<string[]> {
  let response: Response;
  try {
    response = await fetch(`${LOCAL_LLM_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      body: JSON.stringify({
        model: LOCAL_LLM_MODEL,
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: 'You tag notes in a personal knowledge base.',
          },
          {
            role: 'user',
            content: buildPrompt(title, content, existingTags),
          },
        ],
      }),
    });
  } catch {
    throw new LocalLLMError(
      `Could not reach the local LLM at ${LOCAL_LLM_BASE_URL}. Is it running?`,
    );
  }

  if (!response.ok) {
    throw new LocalLLMError(
      `Local LLM returned ${response.status}: ${await response.text()}`,
    );
  }

  const completion = await response.json();
  return parseSuggestedTags(completion.choices?.[0]?.message?.content ?? '');
}
