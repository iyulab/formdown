'use client';

import { useEffect, useRef } from 'react';

const FormdownDemo = () => {
    const viewerRef = useRef<HTMLDivElement>(null);

    const formdownContent = `@name: [text required placeholder="Enter your name"]
@email: [email required]
@age: [number min=18 max=100]
@bio: [textarea rows=4]
@gender: [radio] Male, Female, Other
@interests: [checkbox] Development, Design, Music`;

    useEffect(() => {
        const showFallbackForm = () => {
            if (viewerRef.current) {
                viewerRef.current.innerHTML = `
                    <form class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Age</label>
                            <input
                                type="number"
                                min="18"
                                max="100"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <textarea
                                rows="4"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                        </div>
                        <fieldset class="border border-gray-300 rounded-md p-4">
                            <legend class="text-sm font-medium text-gray-700 px-2">Gender</legend>
                            <div class="space-y-2">
                                <label class="flex items-center">
                                    <input type="radio" name="gender" value="Male" class="mr-2" />
                                    Male
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="gender" value="Female" class="mr-2" />
                                    Female
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="gender" value="Other" class="mr-2" />
                                    Other
                                </label>
                            </div>
                        </fieldset>
                        <fieldset class="border border-gray-300 rounded-md p-4">
                            <legend class="text-sm font-medium text-gray-700 px-2">Interests</legend>
                            <div class="space-y-2">
                                <label class="flex items-center">
                                    <input type="checkbox" name="interests" value="Development" class="mr-2" />
                                    Development
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" name="interests" value="Design" class="mr-2" />
                                    Design
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" name="interests" value="Music" class="mr-2" />
                                    Music
                                </label>
                            </div>
                        </fieldset>
                    </form>
                `;
            }
        };

        showFallbackForm();
    }, [formdownContent]);

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Form</h3>
            <div ref={viewerRef} className="space-y-4">
                {/* Fallback content while loading */}
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded mb-4"></div>
                </div>
            </div>
        </div>
    );
};

export default FormdownDemo;
