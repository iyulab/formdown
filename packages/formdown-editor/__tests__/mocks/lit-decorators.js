// Decorators that register nothing: a test makes the class with `new`.
const pass = () => () => {};
module.exports = { customElement: () => (constructor) => constructor, property: pass, state: pass };
