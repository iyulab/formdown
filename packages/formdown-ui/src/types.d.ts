import { LitElement } from 'lit';

declare global {
    interface HTMLElementTagNameMap {
        'formdown-viewer': FormdownViewer;
    }
}

export declare class FormdownViewer extends LitElement {
    content: string;
    submitText: string;
}
