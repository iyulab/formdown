/**
 * FormdownFieldHelper - Utility class for interacting with Formdown form fields
 * 
 * Provides a consistent, predictable API for getting and setting values in Formdown forms,
 * with automatic support for "other" options across all field types.
 */

export interface FieldHelperOptions {
    /**
     * Whether to suppress console warnings
     */
    silent?: boolean;
    
    /**
     * Whether to dispatch events after value changes
     */
    dispatchEvents?: boolean;
}

export type FormFieldType = 'radio' | 'checkbox' | 'select' | 'text' | 'textarea' | 'unknown';
export type FieldValue = string | string[] | null;

export class FormdownFieldHelper {
    private static defaultOptions: FieldHelperOptions = {
        silent: false,
        dispatchEvents: true
    };

    /**
     * Get the current value(s) of a field
     * @param fieldName - Name of the field
     * @param form - Form element (optional, will find automatically)
     * @returns Field value (string for single-value fields, string[] for checkboxes)
     */
    static get(fieldName: string, form?: HTMLFormElement): FieldValue {
        const resolvedForm = this.resolveForm(form);
        if (!resolvedForm) return null;

        const fieldType = this.getFieldType(fieldName, resolvedForm);
        
        switch (fieldType) {
            case 'checkbox':
                return this.getCheckboxValues(fieldName, resolvedForm);
            case 'radio':
            case 'select':
                return this.getSingleValue(fieldName, resolvedForm);
            case 'text':
            case 'textarea':
                return this.getTextValue(fieldName, resolvedForm);
            default:
                this.warn(`Unknown field type for field: ${fieldName}`);
                return null;
        }
    }

    /**
     * Set the value(s) of a field
     * @param fieldName - Name of the field
     * @param value - Value to set (string for single-value, string[] for checkboxes)
     * @param options - Additional options
     * @returns Success status
     */
    static set(fieldName: string, value: FieldValue, options?: FieldHelperOptions): boolean {
        const opts = { ...this.defaultOptions, ...options };
        const form = this.resolveForm();
        if (!form) return false;

        const fieldType = this.getFieldType(fieldName, form);
        
        try {
            switch (fieldType) {
                case 'checkbox':
                    return this.setCheckboxValues(fieldName, Array.isArray(value) ? value : (value ? [value] : []), form, opts);
                case 'radio':
                    return this.setRadioValue(fieldName, value as string, form, opts);
                case 'select':
                    return this.setSelectValue(fieldName, value as string, form, opts);
                case 'text':
                case 'textarea':
                    return this.setTextValue(fieldName, value as string, form, opts);
                default:
                    this.warn(`Cannot set value for unknown field type: ${fieldName}`, opts);
                    return false;
            }
        } catch (error) {
            this.warn(`Error setting field value: ${error}`, opts);
            return false;
        }
    }

    /**
     * Add a value to a checkbox field (checkbox only)
     * @param fieldName - Name of the checkbox field
     * @param value - Value to add
     * @param options - Additional options
     * @returns Success status
     */
    static add(fieldName: string, value: string, options?: FieldHelperOptions): boolean {
        const opts = { ...this.defaultOptions, ...options };
        const form = this.resolveForm();
        if (!form) return false;

        const fieldType = this.getFieldType(fieldName, form);
        if (fieldType !== 'checkbox') {
            this.warn(`add() can only be used with checkbox fields. Field '${fieldName}' is type: ${fieldType}`, opts);
            return false;
        }

        return this.addCheckboxValue(fieldName, value, form, opts);
    }

    /**
     * Remove a value from a checkbox field (checkbox only)
     * @param fieldName - Name of the checkbox field
     * @param value - Value to remove
     * @param options - Additional options
     * @returns Success status
     */
    static remove(fieldName: string, value: string, options?: FieldHelperOptions): boolean {
        const opts = { ...this.defaultOptions, ...options };
        const form = this.resolveForm();
        if (!form) return false;

        const fieldType = this.getFieldType(fieldName, form);
        if (fieldType !== 'checkbox') {
            this.warn(`remove() can only be used with checkbox fields. Field '${fieldName}' is type: ${fieldType}`, opts);
            return false;
        }

        return this.removeCheckboxValue(fieldName, value, form, opts);
    }

    /**
     * Toggle a value in a checkbox field (checkbox only)
     * @param fieldName - Name of the checkbox field
     * @param value - Value to toggle
     * @param options - Additional options
     * @returns Success status
     */
    static toggle(fieldName: string, value: string, options?: FieldHelperOptions): boolean {
        const opts = { ...this.defaultOptions, ...options };
        const form = this.resolveForm();
        if (!form) return false;

        const fieldType = this.getFieldType(fieldName, form);
        if (fieldType !== 'checkbox') {
            this.warn(`toggle() can only be used with checkbox fields. Field '${fieldName}' is type: ${fieldType}`, opts);
            return false;
        }

        const currentValues = this.getCheckboxValues(fieldName, form) as string[];
        if (currentValues.includes(value)) {
            return this.removeCheckboxValue(fieldName, value, form, opts);
        } else {
            return this.addCheckboxValue(fieldName, value, form, opts);
        }
    }

    /**
     * Clear all values from a field
     * @param fieldName - Name of the field
     * @param options - Additional options
     * @returns Success status
     */
    static clear(fieldName: string, options?: FieldHelperOptions): boolean {
        const opts = { ...this.defaultOptions, ...options };
        const form = this.resolveForm();
        if (!form) return false;

        const fieldType = this.getFieldType(fieldName, form);
        
        try {
            switch (fieldType) {
                case 'checkbox':
                    return this.clearCheckboxValues(fieldName, form, opts);
                case 'radio':
                    return this.clearRadioValues(fieldName, form, opts);
                case 'select':
                    return this.clearSelectValue(fieldName, form, opts);
                case 'text':
                case 'textarea':
                    return this.clearTextValue(fieldName, form, opts);
                default:
                    this.warn(`Cannot clear unknown field type: ${fieldName}`, opts);
                    return false;
            }
        } catch (error) {
            this.warn(`Error clearing field: ${error}`, opts);
            return false;
        }
    }

    /**
     * Check if a field has a specific value
     * @param fieldName - Name of the field
     * @param value - Value to check for
     * @param form - Form element (optional)
     * @returns Whether the field has the value
     */
    static has(fieldName: string, value: string, form?: HTMLFormElement): boolean {
        const currentValue = this.get(fieldName, form);
        
        if (Array.isArray(currentValue)) {
            return currentValue.includes(value);
        } else {
            return currentValue === value;
        }
    }

    /**
     * Get the type of a field
     * @param fieldName - Name of the field
     * @param form - Form element (optional)
     * @returns Field type
     */
    static getFieldType(fieldName: string, form?: HTMLFormElement): FormFieldType {
        const resolvedForm = this.resolveForm(form);
        if (!resolvedForm) return 'unknown';

        // Check for radio
        const radio = resolvedForm.querySelector(`input[type="radio"][name="${fieldName}"]`);
        if (radio) return 'radio';

        // Check for checkbox
        const checkbox = resolvedForm.querySelector(`input[type="checkbox"][name="${fieldName}"]`);
        if (checkbox) return 'checkbox';

        // Check for select
        const select = resolvedForm.querySelector(`select[name="${fieldName}"]`);
        if (select) return 'select';

        // Check for textarea
        const textarea = resolvedForm.querySelector(`textarea[name="${fieldName}"]`);
        if (textarea) return 'textarea';

        // Check for text input
        const textInput = resolvedForm.querySelector(`input[name="${fieldName}"]`);
        if (textInput) return 'text';

        return 'unknown';
    }

    /**
     * Check if a value would be treated as an "other" option
     * @param fieldName - Name of the field
     * @param value - Value to check
     * @param form - Form element (optional)
     * @returns Whether the value would use the "other" option
     */
    static isOtherValue(fieldName: string, value: string, form?: HTMLFormElement): boolean {
        const resolvedForm = this.resolveForm(form);
        if (!resolvedForm) return false;

        const fieldType = this.getFieldType(fieldName, resolvedForm);
        
        switch (fieldType) {
            case 'radio':
            case 'checkbox':
                // Check if there's a predefined option with this value
                const existingInput = resolvedForm.querySelector(`input[name="${fieldName}"][value="${value}"]`);
                return !existingInput;
                
            case 'select':
                const select = resolvedForm.querySelector(`select[name="${fieldName}"]`) as HTMLSelectElement;
                if (!select) return false;
                const existingOption = select.querySelector(`option[value="${value}"]`);
                return !existingOption;
                
            default:
                return false;
        }
    }

    // ========================================
    // Private Helper Methods
    // ========================================

    private static resolveForm(form?: HTMLFormElement): HTMLFormElement | null {
        if (form) return form;
        
        const forms = document.querySelectorAll('form');
        if (forms.length === 1) {
            return forms[0];
        } else if (forms.length === 0) {
            this.warn('No forms found in document');
            return null;
        } else {
            this.warn('Multiple forms found. Please specify which form to use.');
            return null;
        }
    }

    private static warn(message: string, options?: FieldHelperOptions): void {
        if (!options?.silent) {
            console.warn(`[FormdownFieldHelper] ${message}`);
        }
    }

    private static dispatchChangeEvent(element: HTMLElement, options: FieldHelperOptions): void {
        if (options.dispatchEvents) {
            element.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    private static dispatchInputEvent(element: HTMLElement, options: FieldHelperOptions): void {
        if (options.dispatchEvents) {
            element.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    // Radio field methods
    private static setRadioValue(fieldName: string, value: string, form: HTMLFormElement, options: FieldHelperOptions): boolean {
        // Clear all selections first
        const allRadios = form.querySelectorAll(`input[type="radio"][name="${fieldName}"]`) as NodeListOf<HTMLInputElement>;
        allRadios.forEach(radio => {
            radio.checked = false;
        });

        if (!value) {
            return true; // Successfully cleared
        }

        // Try to find existing option
        const existingRadio = form.querySelector(`input[type="radio"][name="${fieldName}"][value="${value}"]`) as HTMLInputElement;
        
        if (existingRadio) {
            // Use existing option
            existingRadio.checked = true;
            this.dispatchChangeEvent(existingRadio, options);
            
            // Hide other input if visible
            const otherInput = form.querySelector('.formdown-other-input') as HTMLInputElement;
            if (otherInput) {
                otherInput.style.display = 'none';
            }
            
            return true;
        } else {
            // Use other option
            const otherRadio = form.querySelector(`#${fieldName}_other_radio`) as HTMLInputElement;
            const otherInput = form.querySelector('.formdown-other-input') as HTMLInputElement;
            
            if (otherRadio && otherInput) {
                otherRadio.checked = true;
                otherRadio.value = value;
                otherInput.value = value;
                otherInput.style.display = 'inline-block';
                
                this.dispatchChangeEvent(otherRadio, options);
                this.dispatchInputEvent(otherInput, options);
                return true;
            } else {
                this.warn(`Other option not available for radio field: ${fieldName}`, options);
                return false;
            }
        }
    }

    private static getSingleValue(fieldName: string, form: HTMLFormElement): string | null {
        const selectedInput = form.querySelector(`input[name="${fieldName}"]:checked, select[name="${fieldName}"]`) as HTMLInputElement | HTMLSelectElement;
        return selectedInput ? selectedInput.value || null : null;
    }

    private static clearRadioValues(fieldName: string, form: HTMLFormElement, options: FieldHelperOptions): boolean {
        const allRadios = form.querySelectorAll(`input[type="radio"][name="${fieldName}"]`) as NodeListOf<HTMLInputElement>;
        allRadios.forEach(radio => {
            radio.checked = false;
            if (radio.id && radio.id.includes('_other_')) {
                radio.value = '';
            }
        });

        const otherInput = form.querySelector('.formdown-other-input') as HTMLInputElement;
        if (otherInput) {
            otherInput.value = '';
            otherInput.style.display = 'none';
        }

        return true;
    }

    // Checkbox field methods
    private static setCheckboxValues(fieldName: string, values: string[], form: HTMLFormElement, options: FieldHelperOptions): boolean {
        // Clear all checkboxes first
        this.clearCheckboxValues(fieldName, form, { ...options, dispatchEvents: false });

        // Set each value
        let allSuccess = true;
        for (const value of values) {
            if (!this.addCheckboxValue(fieldName, value, form, { ...options, dispatchEvents: false })) {
                allSuccess = false;
            }
        }

        // Dispatch events once at the end
        if (options.dispatchEvents && values.length > 0) {
            const anyChecked = form.querySelector(`input[type="checkbox"][name="${fieldName}"]:checked`);
            if (anyChecked) {
                this.dispatchChangeEvent(anyChecked as HTMLElement, options);
            }
        }

        return allSuccess;
    }

    private static addCheckboxValue(fieldName: string, value: string, form: HTMLFormElement, options: FieldHelperOptions): boolean {
        if (!value) return false;

        // Check if already selected
        const existingChecked = form.querySelector(`input[type="checkbox"][name="${fieldName}"][value="${value}"]:checked`);
        if (existingChecked) {
            return true; // Already selected
        }

        // Try to find existing option
        const existingCheckbox = form.querySelector(`input[type="checkbox"][name="${fieldName}"][value="${value}"]`) as HTMLInputElement;
        
        if (existingCheckbox) {
            // Use existing option
            existingCheckbox.checked = true;
            this.dispatchChangeEvent(existingCheckbox, options);
            return true;
        } else {
            // Use other option
            const otherCheckbox = form.querySelector(`#${fieldName}_other_checkbox`) as HTMLInputElement;
            const otherInput = form.querySelector('.formdown-other-input') as HTMLInputElement;
            
            if (otherCheckbox && otherInput) {
                otherCheckbox.checked = true;
                otherCheckbox.value = value;
                otherInput.value = value;
                otherInput.style.display = 'inline-block';
                
                this.dispatchChangeEvent(otherCheckbox, options);
                this.dispatchInputEvent(otherInput, options);
                return true;
            } else {
                this.warn(`Other option not available for checkbox field: ${fieldName}`, options);
                return false;
            }
        }
    }

    private static removeCheckboxValue(fieldName: string, value: string, form: HTMLFormElement, options: FieldHelperOptions): boolean {
        const checkbox = form.querySelector(`input[type="checkbox"][name="${fieldName}"][value="${value}"]:checked`) as HTMLInputElement;
        
        if (checkbox) {
            checkbox.checked = false;
            
            // If it's the other checkbox, clear the text input
            if (checkbox.id && checkbox.id.includes('_other_')) {
                const otherInput = form.querySelector('.formdown-other-input') as HTMLInputElement;
                if (otherInput) {
                    otherInput.value = '';
                    otherInput.style.display = 'none';
                    checkbox.value = '';
                }
            }
            
            this.dispatchChangeEvent(checkbox, options);
            return true;
        }
        
        return false; // Value not found or not checked
    }

    private static getCheckboxValues(fieldName: string, form: HTMLFormElement): string[] {
        const checkedBoxes = form.querySelectorAll(`input[type="checkbox"][name="${fieldName}"]:checked`) as NodeListOf<HTMLInputElement>;
        return Array.from(checkedBoxes).map(cb => cb.value).filter(v => v);
    }

    private static clearCheckboxValues(fieldName: string, form: HTMLFormElement, options: FieldHelperOptions): boolean {
        const allCheckboxes = form.querySelectorAll(`input[type="checkbox"][name="${fieldName}"]`) as NodeListOf<HTMLInputElement>;
        allCheckboxes.forEach(cb => {
            cb.checked = false;
            if (cb.id && cb.id.includes('_other_')) {
                cb.value = '';
            }
        });

        const otherInput = form.querySelector('.formdown-other-input') as HTMLInputElement;
        if (otherInput) {
            otherInput.value = '';
            otherInput.style.display = 'none';
        }

        return true;
    }

    // Select field methods
    private static setSelectValue(fieldName: string, value: string, form: HTMLFormElement, options: FieldHelperOptions): boolean {
        const select = form.querySelector(`select[name="${fieldName}"]`) as HTMLSelectElement;
        if (!select) {
            this.warn(`Select element not found: ${fieldName}`, options);
            return false;
        }

        if (!value) {
            select.value = '';
            const otherInput = form.querySelector(`#${fieldName}_other`) as HTMLInputElement;
            if (otherInput) {
                otherInput.style.display = 'none';
                otherInput.value = '';
            }
            this.dispatchChangeEvent(select, options);
            return true;
        }

        // Check if value exists in options
        const existingOption = select.querySelector(`option[value="${value}"]`);
        
        if (existingOption) {
            // Use existing option
            select.value = value;
            
            // Hide other input
            const otherInput = form.querySelector(`#${fieldName}_other`) as HTMLInputElement;
            if (otherInput) {
                otherInput.style.display = 'none';
            }
            
            this.dispatchChangeEvent(select, options);
            return true;
        } else {
            // Use other option
            const otherInput = form.querySelector(`#${fieldName}_other`) as HTMLInputElement;
            if (otherInput) {
                select.value = '';
                otherInput.value = value;
                otherInput.style.display = 'block';
                
                // Update select value with the custom input
                select.value = value;
                
                this.dispatchChangeEvent(select, options);
                this.dispatchInputEvent(otherInput, options);
                return true;
            } else {
                this.warn(`Other option not available for select field: ${fieldName}`, options);
                return false;
            }
        }
    }

    private static clearSelectValue(fieldName: string, form: HTMLFormElement, options: FieldHelperOptions): boolean {
        const select = form.querySelector(`select[name="${fieldName}"]`) as HTMLSelectElement;
        if (!select) return false;

        select.value = '';
        
        const otherInput = form.querySelector(`#${fieldName}_other`) as HTMLInputElement;
        if (otherInput) {
            otherInput.value = '';
            otherInput.style.display = 'none';
        }

        this.dispatchChangeEvent(select, options);
        return true;
    }

    // Text field methods
    private static setTextValue(fieldName: string, value: string, form: HTMLFormElement, options: FieldHelperOptions): boolean {
        const textInput = form.querySelector(`input[name="${fieldName}"], textarea[name="${fieldName}"]`) as HTMLInputElement | HTMLTextAreaElement;
        if (!textInput) {
            this.warn(`Text input not found: ${fieldName}`, options);
            return false;
        }

        textInput.value = value || '';
        this.dispatchInputEvent(textInput, options);
        this.dispatchChangeEvent(textInput, options);
        return true;
    }

    private static getTextValue(fieldName: string, form: HTMLFormElement): string | null {
        const textInput = form.querySelector(`input[name="${fieldName}"], textarea[name="${fieldName}"]`) as HTMLInputElement | HTMLTextAreaElement;
        return textInput ? textInput.value : null;
    }

    private static clearTextValue(fieldName: string, form: HTMLFormElement, options: FieldHelperOptions): boolean {
        return this.setTextValue(fieldName, '', form, options);
    }
}