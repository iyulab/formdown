// A stand-in for lit: the component's own logic runs, nothing is rendered.
class LitElement {
    constructor() {
        this.shadowRoot = null;
        this.updateComplete = Promise.resolve(true);
    }
    connectedCallback() { }
    disconnectedCallback() { }
    requestUpdate() { }
    scheduleUpdate() { }
    willUpdate() { }
    dispatchEvent() { return true; }
}
const template = (strings) => strings.join('');
module.exports = { LitElement, html: template, css: template, unsafeCSS: (s) => s };
