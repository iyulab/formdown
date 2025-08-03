import React from 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'formdown-editor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                content?: string;
                'show-preview'?: string | boolean;
                mode?: 'editor' | 'split' | 'preview';
                header?: string | boolean;
            };
            'formdown-ui': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                content?: string;
                'submit-text'?: string;
            };
            'formdown-form': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                content?: string;
            };
        }
    }
}

export { };
