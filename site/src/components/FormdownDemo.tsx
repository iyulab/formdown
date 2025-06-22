'use client';

import { useEffect, useRef, useState } from 'react';

const FormdownDemo = () => {
    const viewerRef = useRef<HTMLDivElement>(null);
    const [componentLoaded, setComponentLoaded] = useState(false);
    const [debugInfo, setDebugInfo] = useState<string[]>([]); const formdownContent = `# Simple Inline Field Demo

안녕하세요 ___@name 님 반갑습니다.

저는 ___@age[number]세이고, ___@city에 살고 있습니다.

제 이메일은 ___@email[email]이고, 직업은 ___@job입니다.

## 선택적 브래킷 문법

- 브래킷 없음 (기본 텍스트): ___@company
- 빈 브래킷 (기본 텍스트): ___@department[]  
- 타입 지정: ___@phone[tel]
- 이메일 타입: ___@contact[email]

## 추가 정보

제가 가장 좋아하는 색깔은 ___@color이고, 취미는 ___@hobby입니다.

연락처는 ___@mobile[tel]이며, 웹사이트는 ___@website[url]입니다.

감사합니다!`;

    const addDebugInfo = (message: string) => {
        setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    useEffect(() => {
        const loadComponents = async () => {
            try {
                addDebugInfo('Starting to load formdown components...');

                // Load the formdown-ui component
                await import('@formdown/ui');
                addDebugInfo('Formdown UI component imported successfully');

                setComponentLoaded(true);
                addDebugInfo('Component loaded state set to true');

                // Wait a bit for the component to register
                setTimeout(() => {
                    if (viewerRef.current) {
                        addDebugInfo('Creating formdown-ui element...');

                        // Create the formdown-ui element
                        const formdownElement = document.createElement('formdown-ui');
                        formdownElement.setAttribute('content', formdownContent);

                        // Clear and append
                        viewerRef.current.innerHTML = '';
                        viewerRef.current.appendChild(formdownElement);

                        addDebugInfo('Formdown-ui element created and appended');
                    }
                }, 100);

            } catch (error) {
                addDebugInfo(`Error loading components: ${error}`);
                console.error('Error loading formdown components:', error);
            }
        };

        loadComponents();
    }, [formdownContent]);

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Form</h3>

            {/* Debug information */}
            <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
                <h4 className="font-semibold mb-2">Debug Info:</h4>
                {debugInfo.map((info, index) => (
                    <div key={index} className="text-gray-700">{info}</div>
                ))}
            </div>

            <div ref={viewerRef} className="space-y-4">
                {!componentLoaded && (
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded mb-4"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormdownDemo;
