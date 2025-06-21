import { LitElement } from 'lit';

declare global {
    interface HTMLElementTagNameMap {
        'formdown-editor': FormdownEditor;
    }
}

export declare class FormdownEditor extends LitElement {
    content: string;
    showPreview: boolean;
}
