import { NextResponse } from 'next/server'
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

export async function GET() {
    try {
        const samplesDir = join(process.cwd(), 'public', 'samples')
        const files = await readdir(samplesDir)

        const samples = await Promise.all(
            files
                .filter(file => file.endsWith('.fd')).sort((a, b) => {
                    // Define preferred order for main samples
                    const preferredOrder = [
                        'complete-fields.fd',
                        'contact.fd',
                        'registration.fd',
                        'survey.fd',
                        'ecommerce.fd',
                        'event.fd',
                        'markdown-demo.fd',
                        'minimal.fd'
                    ]

                    const aIndex = preferredOrder.indexOf(a)
                    const bIndex = preferredOrder.indexOf(b)

                    // If both are in preferred list, use that order
                    if (aIndex !== -1 && bIndex !== -1) {
                        return aIndex - bIndex
                    }

                    // Preferred files come first
                    if (aIndex !== -1) return -1
                    if (bIndex !== -1) return 1

                    // Regular alphabetical order for other files
                    return a.localeCompare(b)
                })
                .map(async (file) => {
                    const filePath = join(samplesDir, file)
                    const content = await readFile(filePath, 'utf-8')

                    // Extract title from first line if it's a heading
                    const lines = content.split('\n')
                    const firstLine = lines[0].trim()
                    const title = firstLine.startsWith('#')
                        ? firstLine.replace(/^#+\s*/, '')
                        : file.replace('.fd', '')

                    // Extract description from content
                    const description = lines
                        .find(line => line.trim() && !line.startsWith('#') && !line.startsWith('@'))
                        ?.trim() || 'No description available'

                    return {
                        filename: file,
                        name: title,
                        description: description.length > 100
                            ? description.substring(0, 100) + '...'
                            : description
                    }
                })
        )

        return NextResponse.json(samples)
    } catch (error) {
        console.error('Error reading samples:', error)
        return NextResponse.json(
            { error: 'Failed to load samples' },
            { status: 500 }
        )
    }
}
