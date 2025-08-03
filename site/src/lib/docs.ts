import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import Prism from 'prismjs';

// Import language support
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';

export interface DocMeta {
    title: string;
    slug: string;
    content: string;
}

const DOCS_DIR = path.join(process.cwd(), 'content/docs');

// Configure marked with syntax highlighting
const renderer = new marked.Renderer();

renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
    const validLang = lang && Prism.languages[lang] ? lang : 'markup';
    const highlighted = Prism.highlight(text, Prism.languages[validLang], validLang);
    return `<pre class="language-${validLang}"><code class="language-${validLang}">${highlighted}</code></pre>`;
};

marked.setOptions({
    renderer,
    gfm: true,
    breaks: false,
    pedantic: false
});

export function getDocSlugs(): string[] {
    if (!fs.existsSync(DOCS_DIR)) {
        return [];
    }

    return fs.readdirSync(DOCS_DIR)
        .filter(file => file.endsWith('.md'))
        .map(file => file.replace('.md', ''));
}

export function getDocBySlug(slug: string): DocMeta | null {
    const filePath = path.join(DOCS_DIR, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // Extract title from first h1
    const titleMatch = content.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : slug.charAt(0).toUpperCase() + slug.slice(1);

    // Remove the first h1 to avoid duplication with the title displayed in the layout
    const contentWithoutFirstH1 = content.replace(/^# .+$/m, '').trim();

    const html = marked(contentWithoutFirstH1) as string;

    return {
        title,
        slug,
        content: html
    };
}

export function getAllDocs(): DocMeta[] {
    const slugs = getDocSlugs();
    return slugs.map(slug => getDocBySlug(slug)).filter(Boolean) as DocMeta[];
}
