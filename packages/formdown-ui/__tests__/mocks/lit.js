// Mock for lit library
class LitElement {
    constructor() {
        this.shadowRoot = null;
    }

    render() {
        return '';
    }

    connectedCallback() { }
    disconnectedCallback() { }

    requestUpdate() { }
}

function html(strings, ...values) {
    return strings.join('');
}

function css(strings, ...values) {
    return strings.join('');
}

module.exports = { LitElement, html, css };
