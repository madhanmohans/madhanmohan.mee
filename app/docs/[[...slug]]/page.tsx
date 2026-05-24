import { getPageImage, source } from '@/lib/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { LLMCopyButton, ViewOptions } from '@/components/ai/page-actions';
import { NoteEditor } from '@/components/note-editor';
import { GraphMini } from '@/components/graph-mini-dynamic';
import { DocsTour } from '@/components/docs-tour';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const docPage = source.getPage(params.slug);
  if (!docPage) notFound();

  const MDXContent = docPage.data.body;
  const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

  return (
    <DocsPage
      toc={docPage.data.toc}
      full={docPage.data.full}
      tableOfContent={{
        footer: (
          <div data-tour="graph-mini">
            <GraphMini pageUrl={docPage.url} />
          </div>
        ),
      }}
    >
      <DocsTitle>{docPage.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{docPage.data.description}</DocsDescription>
      <div
        data-tour="llm-actions"
        className="flex flex-row gap-2 items-center border-b pb-6"
      >
        <LLMCopyButton markdownUrl={`${docPage.url}.mdx`} />
        <ViewOptions markdownUrl={`${docPage.url}.mdx`} />
      </div>
      <DocsTour />

      {IS_DEVELOPMENT ? (
        <NoteEditor slug={params.slug ?? []}>
          <DocsBody>
            <MDXContent
              components={getMDXComponents({
                a: createRelativeLink(source, docPage),
              })}
            />
          </DocsBody>
        </NoteEditor>
      ) : (
        <DocsBody>
          <MDXContent
            components={getMDXComponents({
              a: createRelativeLink(source, docPage),
            })}
          />
        </DocsBody>
      )}
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
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
