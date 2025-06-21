declare global {
    namespace JSX {
        interface IntrinsicElements {
            'formdown-editor': {
                ref?: React.RefObject<HTMLElement>;
                content?: string;
                'show-preview'?: string;
                [key: string]: string | number | boolean | undefined;
            };
            'formdown-viewer': {
                ref?: React.RefObject<HTMLElement>;
                content?: string;
                'submit-text'?: string;
                [key: string]: string | number | boolean | undefined;
            };
        }
    }
}

export { };
