import { notFound } from 'next/navigation';
import { getDocBySlug, getDocSlugs } from '@/lib/docs';
import DocsLayout from '@/components/DocsLayout';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = getDocSlugs();
    return slugs.map((slug) => ({
        slug,
    }));
}

export default async function DocPage({ params }: Props) {
    const { slug } = await params;
    const doc = getDocBySlug(slug);

    if (!doc) {
        notFound();
    }

    return (
        <DocsLayout currentSlug={slug}>
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{doc.title}</h1>

                <article
                    className="prose prose-lg max-w-none
                        prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:font-semibold
                        prose-h1:text-2xl prose-h1:border-b prose-h1:border-gray-200 dark:prose-h1:border-gray-700 prose-h1:pb-3 prose-h1:mb-6
                        prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
                        prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
                        prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                        prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                        prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-pink-50 dark:prose-code:bg-pink-900/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                        prose-pre:bg-gray-900 dark:prose-pre:bg-black prose-pre:text-gray-100 dark:prose-pre:text-gray-200 prose-pre:rounded-lg prose-pre:p-4
                        prose-blockquote:border-l-4 prose-blockquote:border-blue-200 dark:prose-blockquote:border-blue-700 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:pl-4 prose-blockquote:py-2
                        prose-ul:my-4 prose-ol:my-4
                        prose-li:text-gray-700 dark:prose-li:text-gray-300
                        prose-table:border-collapse prose-table:border prose-table:border-gray-300 dark:prose-table:border-gray-600
                        prose-th:bg-gray-50 dark:prose-th:bg-gray-800 prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-600 prose-th:px-3 prose-th:py-2 prose-th:text-left
                        prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-600 prose-td:px-3 prose-td:py-2"
                    dangerouslySetInnerHTML={{ __html: doc.content }}
                />
            </div>
        </DocsLayout>
    );
}
