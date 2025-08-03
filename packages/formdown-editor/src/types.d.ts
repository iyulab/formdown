import { LitElement } from 'lit';

declare global {
    interface HTMLElementTagNameMap {
        'formdown-editor': FormdownEditor;
    }
}

export declare class FormdownEditor extends LitElement {
    content: string;
    mode: 'edit' | 'split' | 'view';
    placeholder: string;
    header: boolean;
    toolbar: boolean;
    data: Record<string, any>;
}
