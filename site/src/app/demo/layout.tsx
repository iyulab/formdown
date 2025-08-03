import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Interactive Demo - Formdown',
    description: 'Try Formdown live! Create and test interactive forms using markdown syntax with real-time preview. Explore sample forms and see the power of formdown in action.',
    keywords: [
        'formdown demo',
        'interactive forms',
        'live demo',
        'markdown forms demo',
        'form builder demo',
        'web forms preview'
    ],
    openGraph: {
        title: 'Interactive Demo - Formdown',
        description: 'Try Formdown live! Create and test interactive forms using markdown syntax with real-time preview.',
        url: 'https://formdown.dev/demo',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Interactive Demo - Formdown',
        description: 'Try Formdown live! Create and test interactive forms using markdown syntax.',
    },
    alternates: {
        canonical: '/demo',
    },
}

export default function DemoLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
