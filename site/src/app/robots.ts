import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/private/', '/_next/'],
        },
        sitemap: 'https://formdown.dev/sitemap.xml',
    }
}
