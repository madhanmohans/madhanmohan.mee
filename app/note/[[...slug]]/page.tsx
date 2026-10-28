import { getPageImage, getTagGroups, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/editor/MDXComponents';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { CopyMarkdownButton } from '@/components/page-actions/CopyMarkdownButton';
import { OpenInAiMenu } from '@/components/page-actions/OpenInAiMenu';
import { NoteEditor } from '@/components/editor/NoteEditor';
import { NotesTour } from '@/components/tour/NotesTour';
import { LocalGraph } from '@/components/graph/local/LocalGraph';
import { ViewToggle } from '@/components/layout/ViewToggle';
import { NoteTags } from '@/components/tags/NoteTags';
import { TagGroups } from '@/components/tags/TagGroups';

export default async function Page(props: PageProps<'/note/[[...slug]]'>) {
  const params = await props.params;
  const docPage = source.getPage(params.slug);
  if (!docPage) notFound();

  const MDXContent = docPage.data.body;
  const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
  const markdownUrl = `${docPage.url}.mdx`;
  const body = (
    <DocsBody>
      <MDXContent
        components={getMDXComponents({
          a: createRelativeLink(source, docPage),
        })}
      />
    </DocsBody>
  );

  return (
    <DocsPage
      toc={docPage.data.toc}
      full={docPage.data.full}
      tableOfContent={{
        header: (
          <>
            <ViewToggle />
            <div data-tour="graph-mini">
              <LocalGraph pageUrl={docPage.url} />
            </div>
            <TagGroups
              groups={getTagGroups()}
              currentTags={docPage.data.tags}
              currentUrl={docPage.url}
            />
          </>
        ),
      }}
    >
      <DocsTitle>{docPage.data.title}</DocsTitle>
      <DocsDescription className="mb-0">
        {docPage.data.description}
      </DocsDescription>
      <NoteTags
        slug={params.slug ?? []}
        tags={docPage.data.tags}
        editable={IS_DEVELOPMENT}
      />
      <div
        data-tour="llm-actions"
        className="flex flex-row gap-2 items-center border-b pb-6"
      >
        <CopyMarkdownButton markdownUrl={markdownUrl} />
        <OpenInAiMenu markdownUrl={markdownUrl} />
      </div>
      <NotesTour />

      {IS_DEVELOPMENT ? (
        <NoteEditor slug={params.slug ?? []}>{body}</NoteEditor>
      ) : (
        body
      )}
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<'/note/[[...slug]]'>,
): Promise<Metadata> {
  const params = await props.params;
  const docPage = source.getPage(params.slug);
  if (!docPage) notFound();

  return {
    title: docPage.data.title,
    description: docPage.data.description,
    openGraph: {
      images: getPageImage(docPage).url,
    },
  };
}
