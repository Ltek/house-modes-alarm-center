// Registers the card's elements once. The card's file can run twice in one page (an old and a new URL right after an
// update, or a hand-made Dashboard resource next to the one the integration adds); the second run must not throw on
// customElements.define, which would stop the module. Only our own names are checked: the browser's registry itself
// is never changed (until v2026.11.16.103 a global wrapper did that, and showed up in other cards' errors).

/** customElements.define, unless the name is already taken. */
export const defineOnce = (name: string, ctor: CustomElementConstructor): void => {
  if (!customElements.get(name)) customElements.define(name, ctor);
};

/** Drop-in for Lit's @customElement (legacy and standard decorators), using defineOnce. */
export const safeElement =
  (name: string) =>
  (target: any, context?: { addInitializer?: (f: () => void) => void }): any => {
    if (context && typeof context.addInitializer === 'function') {
      context.addInitializer(() => defineOnce(name, target));
    } else {
      defineOnce(name, target);
    }
    return target;
  };
