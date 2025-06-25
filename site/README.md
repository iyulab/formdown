# Formdown Documentation Site

This is the official documentation website for Formdown, built with [Next.js](https://nextjs.org) and optimized for SEO and performance.

## About Formdown

Formdown is a powerful form generation tool that transforms Markdown documents into interactive web forms. Create beautiful, functional forms using a simple markdown-like syntax with real-time preview and validation.

## Getting Started

### Development

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

To build the static site for production:

```bash
npm run build
```

This will generate a static export in the `publish/` directory.

## Project Structure

- `src/app/` - Next.js app router pages and layouts
- `content/docs/` - Documentation content in Markdown
- `public/` - Static assets (images, icons, etc.)
- `src/components/` - Reusable React components
- `src/lib/` - Utility functions and configurations

## SEO Optimizations

This site includes comprehensive SEO optimizations:

- ✅ Structured data (JSON-LD)
- ✅ Open Graph meta tags
- ✅ Twitter Card meta tags
- ✅ Semantic HTML structure
- ✅ Sitemap generation
- ✅ Robots.txt
- ✅ Manifest for PWA
- ✅ Performance headers
- ✅ Accessibility features

## Features

- **Interactive Demos**: Live formdown editor with sample forms
- **Documentation**: Comprehensive guides and API references
- **Responsive Design**: Mobile-first responsive layout
- **Performance**: Optimized for Core Web Vitals
- **Accessibility**: WCAG compliant with proper ARIA labels

## Learn More

- [Formdown GitHub Repository](https://github.com/iyulab/formdown)
- [Next.js Documentation](https://nextjs.org/docs)
- [Nextra Documentation](https://nextra.site/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
