import Script from 'next/script'

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="docs-layout">
            <Script
                src="https://cdn.jsdelivr.net/npm/@formdown/editor@latest/dist/standalone.js"
                strategy="beforeInteractive"
            />
            <Script
                src="https://cdn.jsdelivr.net/npm/@formdown/ui@latest/dist/standalone.js"
                strategy="beforeInteractive"
            />
            {children}
        </div>
    )
}
