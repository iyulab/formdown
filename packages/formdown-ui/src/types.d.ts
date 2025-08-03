import { LitElement } from 'lit';

declare global {
    interface HTMLElementTagNameMap {
        'formdown-ui': FormdownUI;
    }
}

export declare class FormdownUI extends LitElement {
    content: string;
    formId: string;
    showSubmitButton: boolean;
    submitText: string;
    validateOnSubmit: boolean;
    data: Record<string, any>;
}
