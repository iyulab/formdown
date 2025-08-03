import fs from 'fs';
import path from 'path';

export interface Sample {
    name: string;
    filename: string;
    description: string;
}

const SAMPLES_DIR = path.join(process.cwd(), 'public/samples');

export function getSamplesList(): Sample[] {
    if (!fs.existsSync(SAMPLES_DIR)) {
        return [];
    }

    const files = fs.readdirSync(SAMPLES_DIR)
        .filter(file => file.endsWith('.fd'))
        .sort();

    return files.map(filename => {
        const filePath = path.join(SAMPLES_DIR, filename);
        const content = fs.readFileSync(filePath, 'utf8');

        // Extract title from first line if it's an H1, otherwise use filename
        const titleMatch = content.match(/^# (.+)$/m);
        const name = titleMatch ? titleMatch[1] : formatFilename(filename);

        // Extract description from first paragraph or use default
        const lines = content.split('\n').filter(line => line.trim());
        let description = 'Sample form demonstrating Formdown syntax';

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line && !line.startsWith('#') && !line.startsWith('@')) {
                description = line.length > 100 ? line.substring(0, 97) + '...' : line;
                break;
            }
        }

        return {
            name,
            filename,
            description
        };
    });
}

function formatFilename(filename: string): string {
    return filename
        .replace('.fd', '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export function getSampleContent(filename: string): string | null {
    const filePath = path.join(SAMPLES_DIR, filename);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    return fs.readFileSync(filePath, 'utf8');
}
