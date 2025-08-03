'use client'

import Link from 'next/link'

export default function Error({
    error, // eslint-disable-line @typescript-eslint/no-unused-vars
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <head>
                <title>Error - Formdown</title>
                <meta name="robots" content="noindex" />
            </head>
            <body>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                    <div className="text-center max-w-md mx-auto px-4">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
                        <h2 className="text-xl text-gray-600 mb-6">Something went wrong</h2>
                        <p className="text-gray-500 mb-8">
                            We apologize for the inconvenience. Please try again or return to the homepage.
                        </p>
                        <div className="space-x-4">
                            <button
                                onClick={() => reset()}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Try Again
                            </button>
                            <Link
                                href="/"
                                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors inline-block"
                            >
                                Go Home
                            </Link>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    )
}
