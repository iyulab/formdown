export default function DocsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="docs-layout">
            <script
                src="https://cdn.jsdelivr.net/npm/@formdown/editor@latest/dist/standalone.js"
                async
            />
            <script
                src="https://cdn.jsdelivr.net/npm/@formdown/ui@latest/dist/standalone.js"
                async
            />
            {children}
        </div>
    )
}
