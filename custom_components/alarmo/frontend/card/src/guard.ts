// Imported first by card.ts. When this bundle is loaded twice (an old and a new URL after an update, or a manual
// Dashboard resource next to the one the integration adds), the second copy must not throw on customElements.define:
// that error stops the module and, on some browsers, leaves the card undefined. Our own tags are defined once only.
const OURS = /^(house-modes-alarm-center-card|hmac-)/;
const registry = window.customElements as CustomElementRegistry & { __hmacGuard?: boolean };
if (!registry.__hmacGuard) {
  const define = registry.define.bind(registry);
  registry.define = (name: string, ctor: CustomElementConstructor, options?: ElementDefinitionOptions) => {
    if (OURS.test(name) && registry.get(name)) return;
    define(name, ctor, options);
  };
  registry.__hmacGuard = true;
}
export {};
