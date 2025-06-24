import React from 'react'

const config = {
    logo: <span><strong>Formdown</strong></span>,
    project: {
        link: 'https://github.com/iyulab/formdown',
    },
    docsRepositoryBase: 'https://github.com/iyulab/formdown/tree/main/site',
    footer: {
        text: 'Formdown Documentation',
    },
    useNextSeoProps() {
        return {
            titleTemplate: '%s – Formdown'
        }
    },
    head: (
        <>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta property="og:title" content="Formdown" />
            <meta property="og:description" content="Markdown-based syntax for creating HTML forms" />
        </>
    ),
}

export default config
