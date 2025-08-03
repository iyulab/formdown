// Mock for lit/decorators.js
function customElement(tagName) {
    return function (constructor) {
        return constructor;
    };
}

function property(options) {
    return function (proto, name) {
        // Mock property decorator
    };
}

module.exports = { customElement, property };
