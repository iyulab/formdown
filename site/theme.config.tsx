import React from 'react'

const config = {
    logo: <span><strong>Formdown</strong></span>,
    project: {
        link: 'https://github.com/iyulab/formdown',
    },
    docsRepositoryBase: 'https://github.com/iyulab/formdown/tree/main/site',
    footer: {
        text: 'Formdown Documentation - Create interactive forms with markdown syntax',
    },
    useNextSeoProps() {
        return {
            titleTemplate: '%s | Formdown',
            description: 'Create beautiful, interactive HTML forms using a simple markdown-like syntax. Build forms quickly with real-time preview, validation, and seamless integration.',
            openGraph: {
                type: 'website',
                locale: 'en_US',
                url: 'https://formdown.dev',
                siteName: 'Formdown',
                images: [
                    {
                        url: '/logo.png',
                        width: 1200,
                        height: 630,
                        alt: 'Formdown - Markdown-based Form Builder',
                    },
                ],
            },
            twitter: {
                handle: '@iyulab',
                site: '@iyulab',
                cardType: 'summary_large_image',
            },
        }
    },
    head: (
        <>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="theme-color" content="#2563eb" />
            <meta property="og:title" content="Formdown - Markdown-based Form Builder" />
            <meta property="og:description" content="Create beautiful, interactive HTML forms using a simple markdown-like syntax. Build forms quickly with real-time preview, validation, and seamless integration." />
            <meta property="og:image" content="/logo.png" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Formdown - Markdown-based Form Builder" />
            <meta name="twitter:description" content="Create beautiful, interactive HTML forms using a simple markdown-like syntax." />
            <meta name="twitter:image" content="/logo.png" />
            <link rel="canonical" href="https://formdown.dev" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </>
    ),
    editLink: {
        text: 'Edit this page on GitHub →'
    },
    feedback: {
        content: 'Question? Give us feedback →',
        labels: 'feedback'
    },
    sidebar: {
        titleComponent({ title, type }) {
            if (type === 'separator') {
                return <span className="cursor-default">{title}</span>
            }
            return <>{title}</>
        },
        defaultMenuCollapseLevel: 1,
        toggleButton: true,
    },
    toc: {
        backToTop: true
    }
}

export default config
