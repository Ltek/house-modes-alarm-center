function e(e,t){var s={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(s[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var a=0;for(o=Object.getOwnPropertySymbols(e);a<o.length;a++)t.indexOf(o[a])<0&&Object.prototype.propertyIsEnumerable.call(e,o[a])&&(s[o[a]]=e[o[a]])}return s}function t(e,t,s,o){var a,i=arguments.length,n=i<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,s):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,s,o);else for(var r=e.length-1;r>=0;r--)(a=e[r])&&(n=(i<3?a(n):i>3?a(t,s,n):a(t,s))||n);return i>3&&n&&Object.defineProperty(t,s,n),n}"function"==typeof SuppressedError&&SuppressedError;const s=/^(house-modes-alarm-center-card|hmac-)/,o=window.customElements;if(!o.__hmacGuard){const e=o.define.bind(o);o.define=(t,a,i)=>{s.test(t)&&o.get(t)||e(t,a,i)},o.__hmacGuard=!0}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const a=globalThis,i=a.ShadowRoot&&(void 0===a.ShadyCSS||a.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),r=new WeakMap;let l=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const s=void 0!==t&&1===t.length;s&&(e=r.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&r.set(t,e))}return e}toString(){return this.cssText}};const c=(e,...t)=>{const s=1===e.length?e[0]:t.reduce((t,s,o)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[o+1],e[0]);return new l(s,e,n)},d=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>new l("string"==typeof e?e:e+"",void 0,n))(t)})(e):e,{is:h,defineProperty:p,getOwnPropertyDescriptor:u,getOwnPropertyNames:m,getOwnPropertySymbols:g,getPrototypeOf:b}=Object,f=globalThis,v=f.trustedTypes,_=v?v.emptyScript:"",y=f.reactiveElementPolyfillSupport,w=(e,t)=>e,x={toAttribute(e,t){switch(t){case Boolean:e=e?_:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},$=(e,t)=>!h(e,t),k={attribute:!0,type:String,converter:x,reflect:!1,useDefault:!1,hasChanged:$};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let A=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=k){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),o=this.getPropertyDescriptor(e,s,t);void 0!==o&&p(this.prototype,e,o)}}static getPropertyDescriptor(e,t,s){const{get:o,set:a}=u(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:o,set(t){const i=o?.call(this);a?.call(this,t),this.requestUpdate(e,i,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??k}static _$Ei(){if(this.hasOwnProperty(w("elementProperties")))return;const e=b(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(w("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(w("properties"))){const e=this.properties,t=[...m(e),...g(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(d(e))}else void 0!==e&&t.push(d(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{if(i)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const s of t){const t=document.createElement("style"),o=a.litNonce;void 0!==o&&t.setAttribute("nonce",o),t.textContent=s.cssText,e.appendChild(t)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,s);if(void 0!==o&&!0===s.reflect){const a=(void 0!==s.converter?.toAttribute?s.converter:x).toAttribute(t,s.type);this._$Em=e,null==a?this.removeAttribute(o):this.setAttribute(o,a),this._$Em=null}}_$AK(e,t){const s=this.constructor,o=s._$Eh.get(e);if(void 0!==o&&this._$Em!==o){const e=s.getPropertyOptions(o),a="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:x;this._$Em=o;const i=a.fromAttribute(t,e.type);this[o]=i??this._$Ej?.get(o)??i,this._$Em=null}}requestUpdate(e,t,s,o=!1,a){if(void 0!==e){const i=this.constructor;if(!1===o&&(a=this[e]),s??=i.getPropertyOptions(e),!((s.hasChanged??$)(a,t)||s.useDefault&&s.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(i._$Eu(e,s))))return;this.C(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:o,wrapped:a},i){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,i??t??this[e]),!0!==a||void 0!==i)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===o&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,o=this[t];!0!==e||this._$AL.has(t)||void 0===o||this.C(t,void 0,s,o)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[w("elementProperties")]=new Map,A[w("finalized")]=new Map,y?.({ReactiveElement:A}),(f.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const S=globalThis,O=e=>e,C=S.trustedTypes,M=C?C.createPolicy("lit-html",{createHTML:e=>e}):void 0,j="$lit$",z=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+z,T=`<${E}>`,H=document,P=()=>H.createComment(""),R=e=>null===e||"object"!=typeof e&&"function"!=typeof e,B=Array.isArray,D="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,L=/-->/g,I=/>/g,F=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),U=/'/g,W=/"/g,q=/^(?:script|style|textarea|title)$/i,K=(e=>(t,...s)=>({_$litType$:e,strings:t,values:s}))(1),V=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),Y=new WeakMap,J=H.createTreeWalker(H,129);function Z(e,t){if(!B(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==M?M.createHTML(t):t}const X=(e,t)=>{const s=e.length-1,o=[];let a,i=2===t?"<svg>":3===t?"<math>":"",n=N;for(let t=0;t<s;t++){const s=e[t];let r,l,c=-1,d=0;for(;d<s.length&&(n.lastIndex=d,l=n.exec(s),null!==l);)d=n.lastIndex,n===N?"!--"===l[1]?n=L:void 0!==l[1]?n=I:void 0!==l[2]?(q.test(l[2])&&(a=RegExp("</"+l[2],"g")),n=F):void 0!==l[3]&&(n=F):n===F?">"===l[0]?(n=a??N,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,r=l[1],n=void 0===l[3]?F:'"'===l[3]?W:U):n===W||n===U?n=F:n===L||n===I?n=N:(n=F,a=void 0);const h=n===F&&e[t+1].startsWith("/>")?" ":"";i+=n===N?s+T:c>=0?(o.push(r),s.slice(0,c)+j+s.slice(c)+z+h):s+z+(-2===c?t:h)}return[Z(e,i+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),o]};class Q{constructor({strings:e,_$litType$:t},s){let o;this.parts=[];let a=0,i=0;const n=e.length-1,r=this.parts,[l,c]=X(e,t);if(this.el=Q.createElement(l,s),J.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(o=J.nextNode())&&r.length<n;){if(1===o.nodeType){if(o.hasAttributes())for(const e of o.getAttributeNames())if(e.endsWith(j)){const t=c[i++],s=o.getAttribute(e).split(z),n=/([.?@])?(.*)/.exec(t);r.push({type:1,index:a,name:n[2],strings:s,ctor:"."===n[1]?ae:"?"===n[1]?ie:"@"===n[1]?ne:oe}),o.removeAttribute(e)}else e.startsWith(z)&&(r.push({type:6,index:a}),o.removeAttribute(e));if(q.test(o.tagName)){const e=o.textContent.split(z),t=e.length-1;if(t>0){o.textContent=C?C.emptyScript:"";for(let s=0;s<t;s++)o.append(e[s],P()),J.nextNode(),r.push({type:2,index:++a});o.append(e[t],P())}}}else if(8===o.nodeType)if(o.data===E)r.push({type:2,index:a});else{let e=-1;for(;-1!==(e=o.data.indexOf(z,e+1));)r.push({type:7,index:a}),e+=z.length-1}a++}}static createElement(e,t){const s=H.createElement("template");return s.innerHTML=e,s}}function ee(e,t,s=e,o){if(t===V)return t;let a=void 0!==o?s._$Co?.[o]:s._$Cl;const i=R(t)?void 0:t._$litDirective$;return a?.constructor!==i&&(a?._$AO?.(!1),void 0===i?a=void 0:(a=new i(e),a._$AT(e,s,o)),void 0!==o?(s._$Co??=[])[o]=a:s._$Cl=a),void 0!==a&&(t=ee(e,a._$AS(e,t.values),a,o)),t}class te{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,o=(e?.creationScope??H).importNode(t,!0);J.currentNode=o;let a=J.nextNode(),i=0,n=0,r=s[0];for(;void 0!==r;){if(i===r.index){let t;2===r.type?t=new se(a,a.nextSibling,this,e):1===r.type?t=new r.ctor(a,r.name,r.strings,this,e):6===r.type&&(t=new re(a,this,e)),this._$AV.push(t),r=s[++n]}i!==r?.index&&(a=J.nextNode(),i++)}return J.currentNode=H,o}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class se{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,o){this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ee(this,e,t),R(e)?e===G||null==e||""===e?(this._$AH!==G&&this._$AR(),this._$AH=G):e!==this._$AH&&e!==V&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>B(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==G&&R(this._$AH)?this._$AA.nextSibling.data=e:this.T(H.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,o="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=Q.createElement(Z(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===o)this._$AH.p(t);else{const e=new te(o,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=Y.get(e.strings);return void 0===t&&Y.set(e.strings,t=new Q(e)),t}k(e){B(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,o=0;for(const a of e)o===t.length?t.push(s=new se(this.O(P()),this.O(P()),this,this.options)):s=t[o],s._$AI(a),o++;o<t.length&&(this._$AR(s&&s._$AB.nextSibling,o),t.length=o)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=O(e).nextSibling;O(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class oe{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,o,a){this.type=1,this._$AH=G,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=a,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=G}_$AI(e,t=this,s,o){const a=this.strings;let i=!1;if(void 0===a)e=ee(this,e,t,0),i=!R(e)||e!==this._$AH&&e!==V,i&&(this._$AH=e);else{const o=e;let n,r;for(e=a[0],n=0;n<a.length-1;n++)r=ee(this,o[s+n],t,n),r===V&&(r=this._$AH[n]),i||=!R(r)||r!==this._$AH[n],r===G?e=G:e!==G&&(e+=(r??"")+a[n+1]),this._$AH[n]=r}i&&!o&&this.j(e)}j(e){e===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ae extends oe{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===G?void 0:e}}class ie extends oe{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==G)}}class ne extends oe{constructor(e,t,s,o,a){super(e,t,s,o,a),this.type=5}_$AI(e,t=this){if((e=ee(this,e,t,0)??G)===V)return;const s=this._$AH,o=e===G&&s!==G||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,a=e!==G&&(s===G||o);o&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){ee(this,e)}}const le=S.litHtmlPolyfillSupport;le?.(Q,se),(S.litHtmlVersions??=[]).push("3.3.3");const ce=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class de extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const o=s?.renderBefore??t;let a=o._$litPart$;if(void 0===a){const e=s?.renderBefore??null;o._$litPart$=a=new se(t.insertBefore(P(),e),e,void 0,s??{})}return a._$AI(e),a})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}de._$litElement$=!0,de.finalized=!0,ce.litElementHydrateSupport?.({LitElement:de});const he=ce.litElementPolyfillSupport;he?.({LitElement:de}),(ce.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pe=e=>(t,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},ue={attribute:!0,type:String,converter:x,reflect:!1,hasChanged:$},me=(e=ue,t,s)=>{const{kind:o,metadata:a}=s;let i=globalThis.litPropertyMetadata.get(a);if(void 0===i&&globalThis.litPropertyMetadata.set(a,i=new Map),"setter"===o&&((e=Object.create(e)).wrapped=!0),i.set(s.name,e),"accessor"===o){const{name:o}=s;return{set(s){const a=t.get.call(this);t.set.call(this,s),this.requestUpdate(o,a,e,!0,s)},init(t){return void 0!==t&&this.C(o,void 0,e,t),t}}}if("setter"===o){const{name:o}=s;return function(s){const a=this[o];t.call(this,s),this.requestUpdate(o,a,e,!0,s)}}throw Error("Unsupported decorator location: "+o)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ge(e){return(t,s)=>"object"==typeof s?me(e,t,s):((e,t,s)=>{const o=t.hasOwnProperty(s);return t.constructor.createProperty(s,e),o?Object.getOwnPropertyDescriptor(t,s):void 0})(e,t,s)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function be(e){return ge({...e,state:!0,attribute:!1})}const fe=(e,t)=>{if(void 0!==e&&""!==e)return"mode"===e?t:"none"===e?"transparent":String(e).replace(/[;{}<>]/g,"")},ve=(e,t,s)=>[["--b-bg",fe(null==e?void 0:e.background,s)],["--b-abg",fe(null==e?void 0:e.active_background,s)],["--b-bd",fe(null==e?void 0:e.border,s)],["--b-abd",fe(null==e?void 0:e.active_border,s)],["--b-ic",fe(null==t?void 0:t.color,s)],["--b-aic",fe(null==t?void 0:t.active_color,s)]].filter(([,e])=>e).map(([e,t])=>`${e}:${t}`).join(";"),_e={mode_name:{label:"House Mode name",size:22,weight:400,font:"monospace",caps:!0},changing:{label:"Changing to …",size:13,weight:500,font:"sans",caps:!1},since:{label:"Since (last change)",size:12,weight:400,font:"sans",caps:!1},line1:{label:"Panel display, line 1",size:14,weight:400,font:"monospace",caps:!1},line2:{label:"Panel display, line 2",size:14,weight:400,font:"monospace",caps:!1},mode_label:{label:"House Mode button text",size:10,weight:400,font:"sans",caps:!1},alarm_bar:{label:"Section bars (collapsible sections)",size:14,weight:500,font:"sans",caps:!1},alarm_name:{label:"Alarm name",size:18,weight:400,font:"sans",caps:!1},alarm_state:{label:"Alarm state",size:14,weight:400,font:"sans",caps:!1},alarm_button:{label:"Arm button text",size:14,weight:400,font:"sans",caps:!1},chip:{label:"Option chips",size:12,weight:500,font:"sans",caps:!1},key_digit:{label:"Keypad digit",size:16,weight:400,font:"sans",caps:!1},key_label:{label:"Keypad function",size:10,weight:400,font:"sans",caps:!1}},ye={header_icon:{label:"House Mode icon (header)",size:48},mode_icon:{label:"House Mode button icons",size:36},alarm_icon:{label:"Arm button icons",size:22}},we={header_section:"House Mode Status",modes_section:"House Mode buttons",alarm_status_section:"Alarm Panel Status",alarm_section:"Alarm Panel buttons",keypad_section:"Physical panel keypad"},xe={show_header:!0,show_house_modes:!0,show_alarm:!0,show_panel_keypad:!1,collapsible:!1,start_collapsed:!0,show_chevron:!1,columns:5,modes_align:"grid",show_mode_labels:!0,show_mode_name:!0,show_line1:!0,show_line2:!0,alarm_collapsible:!1,alarm_start_collapsed:!0,show_alarm_name:!0,show_alarm_state:!0,show_arm_options:!0,alarm_colors:"modes",modes_collapsible:!1,modes_start_collapsed:!0,keypad_collapsible:!1,keypad_start_collapsed:!0,show_header_icon:!0,show_mode_icons:!0,show_alarm_icon:!0,show_arm_icons:!0,show_arm_labels:!0,show_key_labels:!0,modes_shape:"rounded",arm_shape:"rounded",keypad_shape:"rounded",modes_width:"fill",arm_width:"fill",header_countdown:!1,border_color:"mode",show_alarm_status:!0,house_status_collapsible:!1,house_status_start_collapsed:!0,alarm_status_collapsible:!1,alarm_status_start_collapsed:!0,show_alarm_line1:!1,show_alarm_line2:!1},$e=["house_mode","alarm_name","alarm_state","panel_line1","panel_line2","changing","since"],ke={house_mode:{label:"House Mode name",style:"mode_name"},alarm_name:{label:"Alarm name",style:"alarm_name"},alarm_state:{label:"Alarm state",style:"alarm_state"},panel_line1:{label:"Panel display, line 1",style:"line1"},panel_line2:{label:"Panel display, line 2",style:"line2"},changing:{label:"Changing to … (while a House Mode change is under way)",style:"changing"},since:{label:"Since (when the House Mode last changed)",style:"since"}},Ae={chips:"Chips",mode:"House Mode buttons",arm:"Arm buttons",key:"Panel keypad keys"},Se={left:"Left",right:"Right",above:"Above",below:"Below"},Oe=(e,t)=>{if(e.startsWith("status:"))return{label:t||"Status",icon:"mdi:information-outline"};return{house_modes:{label:"House Modes",icon:"mdi:home-switch-outline"},alarm:{label:"Arm / disarm",icon:"mdi:shield-lock-outline"},keypad:{label:"Panel keypad",icon:"mdi:dialpad"},history:{label:"History",icon:"mdi:history"}}[e]||{label:e,icon:"mdi:square-rounded-outline"}},Ce=e=>(Array.isArray(null==e?void 0:e.button_menus)?e.button_menus:[]).filter(e=>e&&e.id),Me=e=>e.length?e.join(", "):"nobody",je=["house_modes","alarm","keypad","history"],ze=e=>{var t,s,o,a;if(Array.isArray(e.status_sections)){const t=e.status_sections.filter(e=>e&&e.id),s=[...t.map(e=>`status:${e.id}`),...Ce(e).map(e=>`menu:${e.id}`)],o=[...s,...je],a=(e.section_order||[]).filter(e=>o.includes(e)),i=a.filter((e,t)=>a.indexOf(e)===t);return{sections:t,order:[...i,...o.filter(e=>!i.includes(e))]}}const i=Object.assign(Object.assign({},xe),e),n={id:"house",name:"House Mode Status",show:!1!==i.show_header,icon:!1===i.show_header_icon?"none":"house",countdown:!!i.header_countdown,lines:[...!1!==i.show_mode_name?["house_mode"]:[],...!1!==i.show_line1?["panel_line1"]:[],...!1!==i.show_line2?["panel_line2"]:[]],collapsible:!!i.house_status_collapsible,start_collapsed:!1!==i.house_status_start_collapsed,background:null===(s=null===(t=i.styles)||void 0===t?void 0:t.header_section)||void 0===s?void 0:s.background},r={id:"alarm",name:"Alarm Panel Status",show:!1!==i.show_alarm_status&&!(!1===e.show_alarm&&void 0===e.show_alarm_status),icon:!1===i.show_alarm_icon?"none":"alarm",countdown:!1!==i.show_alarm_icon,lines:[...!1!==i.show_alarm_name?["alarm_name"]:[],...!1!==i.show_alarm_state?["alarm_state"]:[],...i.show_alarm_line1?["panel_line1"]:[],...i.show_alarm_line2?["panel_line2"]:[]],collapsible:!!i.alarm_status_collapsible,start_collapsed:!1!==i.alarm_status_start_collapsed,background:null===(a=null===(o=i.styles)||void 0===o?void 0:o.alarm_status_section)||void 0===a?void 0:a.background};for(const e of[n,r])e.background||delete e.background;const l={house_status:"status:house",alarm_status:"status:alarm",house_modes:"house_modes",alarm:"alarm",keypad:"keypad",history:"history"},c=Pe(e.section_order).map(e=>l[e]);return{sections:[n,r],order:[...Ce(e).map(e=>`menu:${e.id}`),...c]}},Ee=["show_header","show_header_icon","header_countdown","show_mode_name","show_line1","show_line2","house_status_collapsible","house_status_start_collapsed","show_alarm_status","show_alarm_icon","show_alarm_name","show_alarm_state","show_alarm_line1","show_alarm_line2","alarm_status_collapsible","alarm_status_start_collapsed"],Te=["house_status","house_modes","alarm_status","alarm","keypad","history"],He={house_status:{title:"House Mode Status",hint:"icon, name, panel display",show:"show_header",collapse:"house_status_collapsible",start:"house_status_start_collapsed"},house_modes:{title:"House Mode buttons",hint:"",show:"show_house_modes",collapse:"modes_collapsible",start:"modes_start_collapsed"},alarm_status:{title:"Alarm Panel Status",hint:"state, countdown",show:"show_alarm_status",collapse:"alarm_status_collapsible",start:"alarm_status_start_collapsed"},alarm:{title:"Alarm Panel buttons",hint:"arm / disarm, code, messages",show:"show_alarm",collapse:"alarm_collapsible",start:"alarm_start_collapsed"},keypad:{title:"Physical panel keypad",hint:"",show:"show_panel_keypad",collapse:"keypad_collapsible",start:"keypad_start_collapsed"},history:{title:"History",hint:"House Mode, alarm and panel changes",show:"show_history",collapse:"history_collapsible",start:"history_start_collapsed"}},Pe=e=>{const t=(e||[]).filter(e=>Te.includes(e)),s=t.filter((e,s)=>t.indexOf(e)===s);return[...s,...Te.filter(e=>!s.includes(e))]},Re={disarmed:"Disarmed",armed_away:"Armed away",armed_home:"Armed home",armed_night:"Armed night",armed_vacation:"Armed vacation",armed_custom_bypass:"Armed custom bypass"},Be={disarmed:"mdi:lock-open-variant",armed_away:"mdi:shield-lock",armed_home:"mdi:shield-home",armed_night:"mdi:shield-moon",armed_vacation:"mdi:shield-airplane",armed_custom_bypass:"mdi:lock-percent-open",arming:"mdi:shield-sync-outline",pending:"mdi:shield-alert-outline",triggered:"mdi:bell-ring"},De={monospace:"var(--code-font-family, monospace)",sans:'var(--ha-font-family-body, Roboto, "Noto Sans", sans-serif)',serif:'Georgia, "Times New Roman", serif'},Ne=e=>{const t={};for(const[s,o]of e)t[s]=o;return t},Le=e=>{var t;const s=[],o=(e,t)=>null!=t&&""!==t&&s.push(`--hmac-${e}:${(e=>String(e).replace(/[;{}<>]/g,""))(t)}`);for(const t of Object.keys(_e)){const s=(e||{})[t];if(!s)continue;const a=t.replace(/_/g,"-");s.size&&o(`${a}-size`,`${Number(s.size)}px`),s.weight&&o(`${a}-weight`,Number(s.weight)),o(`${a}-color`,s.color),s.font&&De[s.font]&&o(`${a}-font`,De[s.font]),void 0!==s.italic&&o(`${a}-style`,s.italic?"italic":"normal"),void 0!==s.caps&&o(`${a}-transform`,s.caps?"uppercase":"none")}for(const t of Object.keys(ye)){const s=(e||{})[t];if(!s)continue;const a=t.replace(/_/g,"-");s.size&&o(`${a}-size`,`${Number(s.size)}px`)}const a=(e||{}).card;void 0!==(null==a?void 0:a.border_width)&&o("border-width",`${Number(a.border_width)}px`),void 0!==(null==a?void 0:a.radius)&&o("radius",`${Number(a.radius)}px`),o("card-bg",null==a?void 0:a.background);for(const s of Object.keys(we))o(`${s.replace("_section","")}-bg`,null===(t=(e||{})[s])||void 0===t?void 0:t.background);return s.join(";")},Ie=e=>{if(!e)return;const t={};for(const[s,o]of Object.entries(e)){if(!o||"object"!=typeof o)continue;const e=Ne(Object.entries(o).filter(([,e])=>void 0!==e&&""!==e&&null!==e&&("card"===s||0!==e)));Object.keys(e).length&&(t[s]=e)}return Object.keys(t).length?t:void 0},Fe={disarmed:"#008000",armed_away:"#ff0000",armed_home:"#ffa500",armed_night:"#5d5df4",armed_vacation:"#dc143c",armed_custom_bypass:"#00a8a8"},Ue=(e,t,s="modes")=>{var o,a;if("standard"===s)return Object.assign({},Fe);if("theme"===s)return{};const i=null===(o=e.alarms.find(e=>e.entity_id===t))||void 0===o?void 0:o.key,n={};for(const t of Object.keys(Fe)){const s=e.house.modes.find(e=>{var s;return i&&(null===(s=e.targets)||void 0===s?void 0:s[i])===t}),o=e.house.modes.find(e=>Object.values(e.targets||{}).includes(t));n[t]=(null===(a=s||o)||void 0===a?void 0:a.color)||Fe[t]}return n},We=[["1","OFF"],["2","AWAY"],["3","STAY"],["4","MAX"],["5","TEST"],["6","BYPASS"],["7","INSTANT"],["8","CODE"],["9","CHIME"],["*","READY"],["0",""],["#",""]],qe=(e,t,s)=>{var o;let a=e.trim();if(t){const e=new Set([...t," "]);let s=0,o=a.length;for(;s<o&&e.has(a[s]);)s++;for(;o>s&&e.has(a[o-1]);)o--;a=a.slice(s,o)}for(const e of s||[])e&&e.from&&(a=a.split(e.from).join(null!==(o=e.to)&&void 0!==o?o:""));return a.trim()},Ke=(e,t,s)=>{const o=String(e||"");return[qe(o.slice(0,16),t,s),qe(o.slice(16,32),t,s)]},Ve=["background","border","icon"],Ge={card:{label:"Card",parts:["background","border"]},status_icon:{label:"Status icons",parts:["icon"]},mode_button:{label:"House Mode buttons (the mode being changed to)",parts:["background","border","icon"]},arm_button:{label:"Arm buttons (the arm mode being set)",parts:["background","border","icon"]}},Ye=["arming","entry","changing","triggered"],Je={arming:"Arming (exit delay: the alarm or the physical panel)",entry:"Entry delay (pending)",changing:"House Mode changing (being applied, delayed or, in Shadow, watched)",triggered:"Alarm triggered"},Ze={size:16,speed:1.6,when:["arming","changing"]},Xe=e=>{if(!e||"object"!=typeof e)return e;const t=Object.assign({},e);if("string"==typeof e.border&&(t.card=Object.assign(Object.assign({},e.card||{}),{border:e.border}),delete t.border),"string"==typeof e.status_icon&&(t.status_icon={icon:e.status_icon}),"string"==typeof e.mode_button){const s=e.mode_button;t.mode_button=Object.assign(Object.assign({},"glow"===s||"both"===s?{border:"glow"}:{}),"pulse"===s||"both"===s?{icon:"pulse"}:{})}return t},Qe=(e,t)=>{if(!e)return!1;const s=e.when||Ze.when;return t.some(e=>s.includes(e))},et=(e,t,s="fx")=>{if(!t||!e)return[];const o=[];for(const t of Ve){const a=e[t];"glow"!==a&&"both"!==a||o.push(`${s}-${t}-glow`),"pulse"!==a&&"both"!==a||o.push(`${s}-${t}-pulse`)}return o},tt={on:!1,listeners:new Set,timer:0,set(e){this.on=e,clearTimeout(this.timer),e&&(this.timer=setTimeout(()=>this.set(!1),2e4)),this.listeners.forEach(e=>e())}};globalThis.__hmacFxPreview=tt;const st=(e,t)=>e.links.find(e=>e.alarm_entity===t)||e.links[0],ot=t=>{if(t.effects&&(t=Object.assign(Object.assign({},t),{effects:Xe(t.effects)})),t.display_strip){const{display_strip:s}=t,o=e(t,["display_strip"]),a=[...new Set([...s])].filter(e=>e.trim()).map(e=>({from:e}));t=Object.assign(Object.assign({},o),{display_replace:[...a,...t.display_replace||[]]})}if(!1===t.show_alarm&&void 0===t.show_alarm_status&&(t=Object.assign(Object.assign({},t),{show_alarm_status:!1})),void 0===t.alarm_colors_from_modes)return t;const{alarm_colors_from_modes:s}=t,o=e(t,["alarm_colors_from_modes"]);return Object.assign(Object.assign({},o),t.alarm_colors?{}:!1===s?{alarm_colors:"standard"}:{})},at={filled:{label:"Filled (selected button in its color)",button:{},icon:{}},outline_selected:{label:"Outline when selected",button:{background:"transparent",active_background:"transparent",border:"none",active_border:"mode",text_follows_icon:!0},icon:{color:"var(--secondary-text-color)",active_color:"mode"}},outline:{label:"Outline, all in color",button:{background:"transparent",active_background:"transparent",border:"mode",active_border:"mode",text_follows_icon:!0},icon:{color:"mode",active_color:"mode"}},icon_only:{label:"Colored icon when selected",button:{background:"transparent",active_background:"transparent",border:"none",active_border:"none",text_follows_icon:!0},icon:{color:"var(--secondary-text-color)",active_color:"mode"}}},it=["armed_away","armed_home","armed_night","armed_vacation","armed_custom_bypass"],nt=["house","alarm","panel"],rt={manual:"manual",automation:"automation",schedule:"schedule",presence_away:"everyone left",presence_home:"someone home",lock:"lock code",panel_keypad:"panel keypad",timer:"timer",external:"outside House Modes"},lt={house:"House Mode",alarm:"Alarm",panel:"Physical panel"},ct={kinds:["house","alarm","panel"],shown:["house"],days:2,max_rows:20,show_filters:!0,show_source:!0,show_day:!0,show_duration:!0,hide_short:0},dt=e=>Object.assign(Object.assign({},ct),e||{}),ht=["unavailable","unknown",""],pt=(e,t=Date.now())=>{const s=new Date(t);return new Date(s.getFullYear(),s.getMonth(),s.getDate()-Math.max(0,e)).getTime()/1e3},ut="number";var mt;!function(e){e.Disarmed="disarmed",e.Arming="arming",e.Pending="pending",e.Triggered="triggered",e.ArmedAway="armed_away",e.ArmedHome="armed_home",e.ArmedNight="armed_night",e.ArmedVacation="armed_vacation",e.ArmedCustomBypass="armed_custom_bypass"}(mt||(mt={}));const gt={[mt.ArmedAway]:"hass:shield-lock",[mt.ArmedHome]:"hass:shield-home",[mt.ArmedNight]:"hass:shield-moon",[mt.ArmedVacation]:"hass:shield-airplane",[mt.ArmedCustomBypass]:"mdi:lock-percent-open",[mt.Disarmed]:"mdi:lock-open-variant",[mt.Arming]:"hass:shield-outline",[mt.Pending]:"hass:shield-outline",[mt.Triggered]:"hass:bell-ring"};var bt;!function(e){e.ArmAway="arm_away",e.ArmHome="arm_home",e.ArmNight="arm_night",e.ArmVacation="arm_vacation",e.ArmCustomBypass="arm_custom_bypass",e.Disarm="disarm"}(bt||(bt={}));const ft={[bt.ArmAway]:"mdi:lock",[bt.ArmHome]:"mdi:home",[bt.ArmNight]:"mdi:moon-waning-crescent",[bt.ArmVacation]:"mdi:airplane",[bt.ArmCustomBypass]:"mdi:lock-percent-open",[bt.Disarm]:"mdi:lock-open-variant"},vt={[bt.ArmAway]:mt.ArmedAway,[bt.ArmHome]:mt.ArmedHome,[bt.ArmNight]:mt.ArmedNight,[bt.ArmVacation]:mt.ArmedVacation,[bt.ArmCustomBypass]:mt.ArmedCustomBypass,[bt.Disarm]:mt.Disarmed};var _t;!function(e){e.Disarm="disarm",e.Arm="arm",e.Trigger="trigger",e.FailedToArm="failed_to_arm",e.CommandNotAllowed="command_not_allowed",e.NoCodeProvided="no_code_provided",e.InvalidCodeProvided="invalid_code_provided",e.TriggerTimeExpired="trigger_time_expired",e.ReadyToArmModesChanged="ready_to_arm_modes_changed"}(_t||(_t={}));const yt="house_modes_updated",wt=["arming","pending"],xt={type:"",entity:"",name:"",keep_keypad_visible:!1,button_scale_actions:1,button_scale_keypad:1,states:{},show_messages:!0,show_ready_indicator:!0,show_bypassed_sensors:!0,use_code_dialog:!1,hide_keypad:!1},$t={skip_delay:!1,force:!1};var kt;!function(e){e.Red="red",e.Pink="pink",e.Purple="purple",e.DeepPurple="deep-purple",e.Indigo="indigo",e.Blue="blue",e.LightBlue="light-blue",e.Cyan="cyan",e.Teal="teal",e.Green="green",e.LightGreen="light-green",e.Lime="lime",e.Yellow="yellow",e.Amber="amber",e.Orange="orange",e.DeepOrange="deep-orange",e.Brown="brown",e.LightGrey="light-grey",e.Grey="grey",e.DarkGrey="dark-grey",e.BlueGrey="blue-grey",e.Black="black",e.White="white"}(kt||(kt={}));const At=(e,t,s,o)=>{o=o||{},s=null==s?{}:s;const a=new Event(t,{bubbles:void 0===o.bubbles||o.bubbles,cancelable:Boolean(o.cancelable),composed:void 0===o.composed||o.composed});return a.detail=s,e.dispatchEvent(a),a};class St extends de{constructor(){super(...arguments),this.duration=0,this.datetime=null,this.timer=0,this._touchStarted=!1,this._hover=!1}shouldUpdate(e){if(!e.size)return!0;const t=e.get("hass");if(!t||t.themes!==this.hass.themes||t.language!==this.hass.language)return!0;if(t.states[this.entity].state!==this.hass.states[this.entity].state||t.states[this.entity].attributes.delay!==this.hass.states[this.entity].attributes.delay){const e=t.states[this.entity].state,s=this.hass.states[this.entity].state;return wt.includes(s)?this.startTimer():wt.includes(e)&&this.stopTimer(),!0}return!1}firstUpdated(){const e=this.hass.states[this.entity].state;wt.includes(e)&&this.startTimer(),this.addEventListener("click",this.handleClick),this.addEventListener("touchstart",()=>{this._touchStarted=!0}),this.addEventListener("touchend",()=>{setTimeout(()=>{this._touchStarted=!1},10)}),this.addEventListener("mouseenter",()=>{this._touchStarted||(this._hover=!0)}),this.addEventListener("mouseleave",()=>{this._hover=!1})}async startTimer(){var e,t;clearInterval(this.timer),(e=this.hass,t=this.entity,e.callWS({type:"house_modes/countdown",entity_id:t})).then(e=>{this.duration=e.delay,this.datetime=new Date((new Date).getTime()+1e3*e.remaining)}).catch(e=>{}),this.timer=window.setInterval(()=>{this.requestUpdate()},1e3)}stopTimer(){clearInterval(this.timer),this.datetime=null,this.duration=0}getRemaining(){if(!this.datetime)return 0;const e=(this.datetime.getTime()-(new Date).getTime())/1e3;return e<0?(clearInterval(this.timer),0):e}getFraction(){return this.duration?(Math.round(this.getRemaining())-1)/this.duration:1}_stateValue(e){return this._hover&&wt.includes(e)&&this.timer?K` <ha-icon icon="mdi:skip-forward"></ha-icon> `:this.datetime&&this.duration?K` ${Math.max(Math.round(this.getRemaining()),0)} `:K` <ha-icon .icon=${gt[e]}></ha-icon> `}handleClick(){const e=this.hass.states[this.entity].state;wt.includes(e)&&this.timer?this.hass.callService("house_modes","skip_delay",{entity_id:this.entity}):At(this,"hass-more-info",{entityId:this.entity})}render(){let e=45,t=2*Math.PI*e;const s=this.hass.states[this.entity],o=this.datetime&&this.duration;return K`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="track ${s.state.split("_").shift()} ${o?"timer":""}">
          <circle cx="${50}" cy="${50}" r="${e}"></circle>
          <path
            stroke-dasharray="${(this.getFraction()*t).toFixed(2)} ${t.toFixed(2)}"
            class="remaining"
            d="
              M ${50}, ${50}
              m -${e}, 0
              a ${e},${e} 0 1,0 90,0
              a ${e},${e} 0 1,0 -90,0
            "
          ></path>
        </g>
      </svg>
      <div class="overlay ${s.state.split("_").shift()} ${o?"timer":""}">
        <div class="value">${this._stateValue(s.state)}</div>
      </div>
    `}static get styles(){return c`
      :host {
        width: var(--hmac-badge-size, 60px);
        height: var(--hmac-badge-size, 60px);
        cursor: pointer;
        display: block;
        position: relative;
      }
      svg {
        width: 100%;
        height: 100%;
        display: block;
        transform: rotateZ(90deg) scale(1, -1);
      }
      .track {
        stroke-width: 4px;
        stroke-linecap: round;
        stroke: var(--disabled-text-color);
        fill: none;
      }
      .track .remaining {
        transition: 0.3s linear stroke;
        stroke: var(--alarm-state-color);
      }
      .track.arming .remaining,
      .track.pending .remaining {
        transition: 1s linear stroke-dasharray;
      }
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        margin: 0;
        width: var(--hmac-badge-size, 60px);
        height: var(--hmac-badge-size, 60px);
        font-size: calc(var(--hmac-badge-size, 60px) * 0.36);
        white-space: nowrap;
      }
      .value {
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
        color: var(--alarm-state-color);
        transition: 0.3s linear color;
        display: flex;
        flex: 1;
        height: 100%;
        align-items: center;
        justify-content: center;
        font-weight: 500;
      }
      .value ha-icon {
        --mdc-icon-size: 1.2em;
      }
      .disarmed,
      .armed {
        animation: none;
      }
      .triggered,
      .arming,
      .pending {
        animation: pulse 1s infinite;
      }
      .arming.timer,
      .pending.timer {
        animation: none;
      }
      @keyframes pulse {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    `}}function Ot(e){return null!=e}function Ct(e){switch(typeof e){case"object":return 0==Object.keys(e).length;case"string":return 0==String(e).length;default:return!Ot(e)}}function Mt(e){return e.substring(0,e.indexOf("."))}t([ge()],St.prototype,"hass",void 0),t([ge()],St.prototype,"entity",void 0),t([be()],St.prototype,"_hover",void 0),customElements.define("hmac-state-badge",St);const jt=(e,t)=>{let s={hide:!1};return(t.states||{}).hasOwnProperty(e)&&(s=Object.assign(Object.assign({},s),t.states[e])),s},zt=e=>{if(!e)return[];const t=e.attributes.supported_features||0;let s=[];return 2&t&&s.push(bt.ArmAway),1&t&&s.push(bt.ArmHome),4&t&&s.push(bt.ArmNight),32&t&&s.push(bt.ArmVacation),16&t&&s.push(bt.ArmCustomBypass),s},Et=(e,t,s)=>{const o=Mt(e.entity_id),a=e.attributes.device_class,i=e.state;if(Object.values(mt).includes(i)&&s){const e=jt(i,s);if(!Ct(e.state_label))return e.state_label}let n="";return a&&(n=t(`component.${o}.entity_component.${a}.state.${e.state}`)),n||(n=t(`component.${o}.entity_component._.state.${e.state}`)),n},Tt=e=>null!==e.attributes.code_format,Ht=(e,t,s=!1)=>{if(!e||!e.state)return"var(--state-unavailable-color)";let o=e.state;if(s){const s=Object.values(bt).map(e=>vt[e]);if(!s.includes(o)){const t=e.attributes.arm_mode;t&&(o=t)}const a=[bt.Disarm,...zt(e)].filter(e=>!jt(vt[e],t).hide);1==a.length&&(o=vt[a[0]])}if(Object.keys(t.states||{}).includes(o)&&Ot((t.states[o]||{}).color)){const e=t.states[o].color;return Object.values(kt).includes(e)?`var(--${e}-color)`:e}return o==mt.Disarmed?"var(--state-alarm_control_panel-disarmed-color, var(--state-alarm_control_panel-inactive-color, var(--state-inactive-color)))":Object.values(mt).includes(o)?`var(--state-alarm_control_panel-${o}-color, var(--state-alarm_control_panel-active-color, var(--state-active-color)))`:"var(--disabled-color, var(--state-inactive-color))"};var Pt,Rt;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(Pt||(Pt={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(Rt||(Rt={}));class Bt extends de{shouldUpdate(e){const t=e.get("hass");return!t||!(!this.entity||t.states[this.entity]===this.hass.states[this.entity])}render(){if(!this.hass||!this.entity)return K``;const e=this.entity in this.hass.states;let t=Object.assign({},this.hass.states[this.entity]);void 0!==this.state&&(t=Object.assign(Object.assign({},t),{state:this.state}));const s=e?Et(t,this.hass.localize):this.hass.localize("state.default.unavailable",this.hass.locale||{language:this.hass.language,number_format:Pt.language}),o=e?t.attributes.friendly_name||(a=t.entity_id).substring(a.indexOf(".")+1):this.entity;var a;let i=!!this.state||"on"==t.state;return K`
      <div class="badge-container" @click=${()=>At(this,"hass-more-info",{entityId:this.entity})}>
        <div class="label-badge ${i?"active":""}" id="badge">
          <div class="value">
            <ha-state-icon
              .hass=${this.hass}
              .stateObj=${t}
            ></ha-state-icon>
            <div class="label">
              <span>${s}</span>
            </div>
          </div>
        </div>
        <div class="title">${o}</div>
      </div>
    `}static get styles(){return c`
      .badge-container {
        display: inline-block;
        text-align: center;
        vertical-align: top;
        padding: var(--ha-label-badge-padding, 0 0 0 0);
        cursor: pointer;
      }
      .label-badge {
        position: relative;
        display: block;
        margin: 0 auto;
        width: var(--ha-label-badge-size, 2.5em);
        text-align: center;
        height: var(--ha-label-badge-size, 2.5em);
        line-height: var(--ha-label-badge-size, 2.5em);
        font-size: var(--ha-label-badge-font-size, 1.5em);
        border-radius: 50%;
        border: 0.1em solid var(--primary-color);
        color: var(--label-badge-text-color, rgb(76, 76, 76));
        white-space: nowrap;
        background-color: none;
        background-size: cover;
        transition: border 0.3s ease-in-out;
      }
      .label-badge.active {
        border: 0.1em solid var(--label-badge-red);
      }
      .label-badge .value {
        font-size: 90%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .label-badge .label {
        position: absolute;
        bottom: -1em;
        left: -0.2em;
        right: -0.2em;
        line-height: 1em;
        font-size: 0.5em;
      }
      .label-badge .label span {
        box-sizing: border-box;
        max-width: 100%;
        display: inline-block;
        background-color: var(--primary-color);
        color: var(--ha-label-badge-label-color, white);
        border-radius: 1em;
        padding: 9% 16% 8% 16%;
        font-weight: 500;
        overflow: hidden;
        text-transform: uppercase;
        text-overflow: ellipsis;
        transition: background-color 0.3s ease-in-out;
        text-transform: var(--ha-label-badge-label-text-transform, uppercase);
      }
      .label-badge.active .label span {
        background-color: var(--label-badge-red);
      }
      .badge-container .title {
        margin-top: 1em;
        font-size: var(--ha-label-badge-title-font-size, 0.9em);
        width: var(--ha-label-badge-title-width, 5em);
        font-weight: var(--ha-label-badge-title-font-weight, 400);
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: normal;
      }
    `}}t([ge()],Bt.prototype,"hass",void 0),t([ge()],Bt.prototype,"entity",void 0),t([ge()],Bt.prototype,"state",void 0),customElements.define("hmac-sensor-badge",Bt);class Dt extends de{constructor(){super(...arguments),this.disabled=!1,this.scaled=!1}render(){return K`
      <button ?disabled=${this.disabled}>
        <slot></slot>
      </button>
    `}handleFocus(e){e.target.blur()}static get styles(){return c`
      button {
        position: relative;
        width: 100%;
        height: 100%;
        border: 1px solid var(--hmac-button-border-color, var(--outline-color));
        border-radius: var(--hmac-button-border-radius, 8px);
        background: transparent;
        color: var(--hmac-button-color, var(--primary-color));
        padding: calc(var(--content-scale, 1) * 0.875rem);
        font-size: calc(var(--content-scale, 1) * var(--hmac-button-font-size));
        letter-spacing: 0.04em;
        font-weight: 500;
        -webkit-font-smoothing: antialiased;
        font-family: Roboto, sans-serif;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        z-index: 1;
        transition: border-color 0.1s ease-in-out;
      }
      button:before {
        position: absolute;
        pointer-events: none;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        content: '';
        border-radius: var(--hmac-button-border-radius, 8px);
        background: var(--hmac-button-background-color, var(--card-background-color));
        opacity: var(--hmac-button-background-opacity, 0);
        z-index: -2;
        transition: opacity 0.1s ease-in-out;
      }
      button:not(:disabled):hover:before {
        background: var(--hmac-button-background-color, var(--primary-color));
        opacity: calc(var(--hmac-button-background-opacity, 0) + 0.12);
      }
      button:not(:disabled) {
        cursor: pointer;
      }
      button:disabled {
        color: var(--disabled-text-color);
      }
      button:not(:disabled):active:before {
        opacity: calc(var(--hmac-button-background-opacity, 0) + 0.24);
      }
      button:not(:disabled):active {
        border: 1px solid var(--hmac-button-border-color, var(--outline-hover-color));
      }
      button:focus {
        outline: none;
      }
      ::slotted(ha-icon) {
        --mdc-icon-size: calc(var(--content-scale, 1) * 1.5rem);
        margin: calc(var(--content-scale, 1) * -0.25rem) 0px;
        display: flex;
      }
      ::slotted(ha-icon.leading) {
        margin-left: calc(var(--content-scale, 1) * -0.3rem);
        margin-right: calc(var(--content-scale, 1) * 0.3rem);
      }
      ::slotted span {
        display: flex;
      }
    `}}t([ge({type:Boolean})],Dt.prototype,"disabled",void 0),t([ge({type:Boolean})],Dt.prototype,"scaled",void 0),customElements.define("hmac-button",Dt);const Nt=e=>{class s extends e{connectedCallback(){super.connectedCallback(),this.__checkSubscribed()}disconnectedCallback(){if(super.disconnectedCallback(),this.__unsubs){for(;this.__unsubs.length;){const e=this.__unsubs.pop();e instanceof Promise?e.then(e=>e()):e()}this.__unsubs=void 0}}updated(e){super.updated(e),e.has("hass")&&this.__checkSubscribed()}hassSubscribe(){return[]}__checkSubscribed(){void 0===this.__unsubs&&this.isConnected&&void 0!==this.hass&&(this.__unsubs=this.hassSubscribe())}}return t([ge({attribute:!1})],s.prototype,"hass",void 0),s};var Lt={heading:"Options for arming",skip_delay:"Skip exit delay",force:"Bypass open sensors"},It={keep_keypad_visible:"Keep the keypad always visible, also when no code input is required.",button_scale_actions:"Scaling factor to apply for resizing the action buttons.",button_scale_keypad:"Scaling factor to apply for resizing the keypad buttons.",show_messages:"Display diagnostic messages when alarm is triggered or cannot be armed.",show_ready_indicator:"Show ready/not ready indicator on arm mode buttons.",show_bypassed_sensors:"Show warning message when alarm is armed with bypassed sensors.",use_code_dialog:"Display the keypad for entering the code as a popup dialog.",hide_keypad:"Hide the keypad buttons for entering the code.",available_actions:"Available actions:",action_dialog:{title:"Customize display of action '{action}'",show_button:{title:"Button visibility",options:{always:"Always shown",never:"Never shown",disarmed:"Show only when disarmed",armed:"Hide only when disarmed"}},button_label:"Override displayed action label",button_icon:"Override displayed icon",state_label:"Override displayed state label",color:"Override color used for the action"}},Ft={invalid_pin:"Invalid",blocking_sensors:"Could not arm due to the following sensors",triggered_sensors:"Alarm was triggered by the following sensors",bypassed_sensors:"There are bypassed sensors"},Ut={arm_options:Lt,editor:It,errors:Ft},Wt={en:Object.freeze({__proto__:null,arm_options:Lt,default:Ut,editor:It,errors:Ft})};function qt(e,t,s="",o=""){const a=t.replace(/['"]+/g,"");var i;try{i=e.split(".").reduce((e,t)=>e[t],Wt[a])}catch(t){i=e.split(".").reduce((e,t)=>e[t],Wt.en)}if(void 0===i&&(i=e.split(".").reduce((e,t)=>e[t],Wt.en)),""!==s&&""!==o){Array.isArray(s)||(s=[s]),Array.isArray(o)||(o=[o]);for(let e=0;e<s.length;e++)i=i.replace(s[e],o[e])}return i}const Kt=["1","2","3","4","5","6","7","8","9","0","clear","submit"];let Vt=class extends(Nt(de)){constructor(){super(...arguments),this._input="",this._showClearButton=!1,this._narrow=!1,this._codeClearTimer=0}hassSubscribe(){return[this.hass.connection.subscribeMessage(e=>this._fetchData(e),{type:yt})]}async _fetchData(e){var t;if(e.data.area_id===(null===(t=this._params)||void 0===t?void 0:t.area_id))switch(e.data.event){case _t.Disarm:case _t.Arm:case _t.Trigger:this._confirm(e.data.event);break;case _t.InvalidCodeProvided:case _t.NoCodeProvided:this._showCodeError();break;case _t.FailedToArm:case _t.CommandNotAllowed:this._confirm(e.data.event);case _t.TriggerTimeExpired:case _t.ReadyToArmModesChanged:}}shouldUpdate(e){const t=e.get("hass");return!(!e.has("_params")&&this._params)||(!!e.has("_input")||(!t||t.states[this._params.entity_id]!==this.hass.states[this._params.entity_id]&&(t.states[this._params.entity_id],this.hass.states[this._params.entity_id],!0)))}firstUpdated(e){super.firstUpdated(e),this.addEventListener("keypress",e=>{"Enter"===e.key&&this._input.length&&this._submit()})}async showDialog(e){this._params=e,this._input="",this._narrow=matchMedia("all and (max-width: 450px), all and (max-height: 500px)").matches,await this.updateComplete}closeDialog(){return this._params=void 0,this._showClearButton=!1,!0}_showCodeError(){var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#code");t&&(t.classList.remove("error"),t.classList.add("error"),t.hint=qt("errors.invalid_pin",this.hass.language))}_clearCodeError(){var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#code");t&&t.classList.contains("error")&&(t.classList.remove("error"),t.hint="",this._input="",this._cancelCodeClearTimer())}_clearCode(){this._input="",this._clearCodeError(),this._cancelCodeClearTimer()}_setCodeClearTimer(){this._cancelCodeClearTimer(),this._input.length&&(this._codeClearTimer=window.setTimeout(()=>{this._clearCode()},12e4))}_cancelCodeClearTimer(){this._codeClearTimer&&clearTimeout(this._codeClearTimer)}_submit(){var e;const t=null!==(e=this._input)&&void 0!==e?e:"";this._clearCodeError(),this._params.action==bt.Disarm?this.hass.callService("house_modes","disarm",{entity_id:this._params.entity_id,code:t}):this.hass.callService("house_modes","arm",Object.assign(Object.assign({},this._params.armOptions),{entity_id:this._params.entity_id,mode:vt[this._params.action],code:t}))}_confirm(e){var t,s;null===(s=null===(t=this._params)||void 0===t?void 0:t.confirm)||void 0===s||s.call(t,e),this.closeDialog()}_cancel(){var e,t;null===(t=null===(e=this._params)||void 0===e?void 0:e.cancel)||void 0===t||t.call(e),this.closeDialog()}_numberClick(e){const t=e.currentTarget.value;this._clearCodeError(),this._setCodeClearTimer(),this._input=this._input+t,this._showClearButton=!0}_clear(){this._input="",this._showClearButton=!1}render(){if(!this._params||!this.hass)return G;return"text"===this._params.code_format?K`
        <ha-dialog
          open
          @closed=${this._cancel}
          header-title="${this.hass.localize("ui.dialogs.enter_code.title")}"
          width="small"
        >
          <ha-input
            class="input"
            ?dialogInitialFocus=${!this._narrow}
            .value=${this._input}
            id="code"
            .label=${this.hass.localize("ui.dialogs.enter_code.input_label")}
            type="password"
            inputmode="text"
            @input=${e=>{this._clearCodeError(),this._input=e.target.value,this._setCodeClearTimer()}}
            @focus=${this._clearCodeError}
          ></ha-input>
          <ha-dialog-footer>
            <ha-button slot="secondaryAction" data-dialog="close" appearance="plain">
              ${this.hass.localize("ui.common.cancel")}
            </ha-button>
            <ha-button @click=${this._submit} slot="primaryAction">
              ${this.hass.localize("ui.common.submit")}
            </ha-button>
          </ha-dialog-footer>
        </ha-dialog>
      `:K`
      <ha-dialog
        open
        header-title="${this.hass.localize("ui.dialogs.enter_code.title")}"
        @closed=${this._cancel}
        width="small"
      >
        <div class="container">
          <ha-input
            class="input"
            ?dialogInitialFocus=${!this._narrow}
            .value=${this._input}
            id="code"
            .label=${this.hass.localize("ui.dialogs.enter_code.input_label")}
            type="password"
            inputmode="numeric"
            @input=${e=>{this._clearCodeError(),this._input=e.target.value,this._setCodeClearTimer()}}
            @focus=${this._clearCodeError}
          ></ha-input>
          <div class="keypad">
            ${Kt.map(e=>""===e?K`<span></span>`:"clear"===e?K`
                      <ha-control-button
                        @click=${this._clear}
                        class="clear"
                        .disabled=${!this._showClearButton}
                        .label=${this.hass.localize("ui.common.clear")}
                      >
                        <ha-svg-icon path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}></ha-svg-icon>
                      </ha-control-button>
                    `:"submit"===e?K`
                        <ha-control-button
                          @click=${this._submit}
                          class="submit"
                          .label=${this.hass.localize("ui.common.submit")}
                        >
                          <ha-svg-icon path=${"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"}></ha-svg-icon>
                        </ha-control-button>
                      `:K`
                        <ha-control-button
                          .value=${e}
                          @click=${this._numberClick}
                          .label=${e}
                        >
                          ${e}
                        </ha-control-button>
                      `)}
          </div>
        </div>
      </ha-dialog>
    `}};Vt.styles=c`
    ha-dialog {
      /* Place above other dialogs */
      --dialog-z-index: 104;
    }
    ha-input {
      width: 100%;
      max-width: 240px;
      margin: 0px auto;
      text-align: center;
      margin-left: calc(50% - 240px / 2);
      margin-bottom: 18.5px;
    }
    ha-input.error {
      animation: shake 0.2s ease-in-out 0s 2;
      margin-bottom: 0px;
      --ha-color-border-neutral-loud: var(--ha-color-on-danger-quiet);
    }
    ha-input.error:not([value='']) {
      --secondary-text-color: var(--ha-color-on-danger-quiet);
    }
    ha-input.error::part(wa-hint) {
      color: var(--ha-color-on-danger-quiet);
    }
    @keyframes shake {
      0% {
        margin-left: calc(50% - 240px / 2);
      }
      25% {
        margin-left: calc(50% - 240px / 2 + 10px);
      }
      75% {
        margin-left: calc(50% - 240px / 2 - 10px);
      }
      100% {
        margin-left: calc(50% - 240px / 2);
      }
    }
    .container {
      display: flex;
      align-items: center;
      flex-direction: column;
    }
    .keypad {
      --keypad-columns: 3;
      margin-top: 12px;
      padding: 12px;
      display: grid;
      grid-template-columns: repeat(var(--keypad-columns), auto);
      grid-auto-rows: auto;
      grid-gap: 24px;
      justify-items: center;
      align-items: center;
    }
    .clear {
      grid-row-start: 4;
      grid-column-start: 0;
    }
    @media all and (max-height: 450px) {
      .keypad {
        --keypad-columns: 6;
      }
      .clear {
        grid-row-start: 1;
        grid-column-start: 6;
      }
    }

    ha-control-button {
      width: 56px;
      height: 56px;
      --control-button-border-radius: 28px;
      --mdc-icon-size: 24px;
      font-size: 24px;
    }
    .submit {
      --control-button-background-color: var(--green-color);
      --control-button-icon-color: var(--green-color);
    }
    .clear {
      --control-button-background-color: var(--red-color);
      --control-button-icon-color: var(--red-color);
    }
    .hidden {
      display: none;
    }
    .buttons {
      margin-top: 12px;
    }
  `,t([ge({attribute:!1})],Vt.prototype,"hass",void 0),t([be()],Vt.prototype,"_params",void 0),t([be()],Vt.prototype,"_input",void 0),t([be()],Vt.prototype,"_showClearButton",void 0),t([be()],Vt.prototype,"_narrow",void 0),Vt=t([pe("hmac-code-dialog")],Vt);var Gt=Object.freeze({__proto__:null,get HmCodeDialog(){return Vt}});let Yt=class extends de{render(){if(!this.hass||!this.config)return G;const e=this.hass.states[this.config.entity];let t=e.state;const s=Object.values(bt).map(e=>vt[e]);if(!s.includes(t)){const s=e.attributes.arm_mode;s&&(t=s)}const o=this.config.button_style||{};return K`
      <div class="container ${o.text_follows_icon?"follow":""} ${"round"===this.config.shape?"round":""} ${this.config.fit?"fit":""}"
        style=${[o.track?`--b-track:${String("none"===o.track?"transparent":o.track).replace(/[;{}<>]/g,"")};--b-track-opacity:1`:"",void 0!==this.config.gap?`--b-gap:${Number(this.config.gap)}px`:"",void 0!==this.config.padding?`--b-pad:${Number(this.config.padding)}px`:""].filter(Boolean).join(";")}>
        ${this._renderOptions(t)}
      </div>
    `}_renderOptions(e){const t=this.hass.states[this.config.entity],s=[bt.Disarm,...zt(t)].filter(e=>{const s=jt(vt[e],this.config).hide;if("boolean"==typeof s||!Ot(s))return!s;switch(s){case"always":return!1;case"never":return!0;case"armed":return"disarmed"==t.state;case"disarmed":return"disarmed"!==t.state}}),o=s.map(e=>jt(vt[e],this.config)).some(e=>!Ot(e.button_label)||e.button_label.length);return s.sort((e,t)=>{const s=jt(vt[e],this.config).button_order,o=jt(vt[t],this.config).button_order;return Ot(s)||Ot(o)?Ot(s)&&!Ot(o)?-1:!Ot(s)&&Ot(o)?1:s-o:0}),s.map(s=>{const a=Ot(this.readyForArmModes)&&!this.readyForArmModes.includes(vt[s])&&s!=bt.Disarm,i=jt(vt[s],this.config);return K`
        <div class="button ${vt[s]==e?`selected ${(this.config.fx_classes||[]).join(" ")}`:""}"
          style="${this._buttonStyle(Ht(Object.assign(Object.assign({},t),{state:vt[s]}),this.config))}"
          @click=${e=>this._handleClick(e,s)}>
          <div class="content ${o&&!1!==this.config.show_labels?"has-text":""}">
            ${!1===this.config.show_icons?G:K`<ha-icon icon="${Ct(i.button_icon)?ft[s]:i.button_icon}"></ha-icon>`}
            ${vt[s]!=e&&Ot(this.readyForArmModes)&&a?K`
              <ha-icon
                icon="${"mdi:circle-medium"}"
                class="badge ${a?"error":"success"}"
              ></ha-icon>
            `:G}
            ${!1===this.config.show_labels?G:K`<span>
              ${Ot(i.button_label)?i.button_label:s==bt.Disarm&&t.state!==mt.Disarmed?this.hass.localize(`ui.card.alarm_control_panel.${s}`):this.hass.localize(`ui.card.alarm_control_panel.modes.${vt[s]}`)}
            </span>`}
          </div>
        </div>
      `})}_buttonStyle(e){const t=this.config.button_style||{},s=this.config.icon_style||{},o=t=>void 0===t||""===t?void 0:"mode"===t?e:"none"===t?"transparent":String(t).replace(/[;{}<>]/g,"");return[["--btn-color",e],["--b-bg",o(t.background)],["--b-abg",o(t.active_background)],["--b-bd",o(t.border)],["--b-abd",o(t.active_border)],["--b-ic",o(s.color)],["--b-aic",o(s.active_color)]].filter(([,e])=>e).map(([e,t])=>`${e}:${t}`).join(";")}_handleClick(e,t){At(this,"button-clicked",{ev:e,action:t})}static get styles(){return c`
      :host {
        width: 100%;
        display: inline-block;
        padding: 0px 10px;
        box-sizing: border-box;
      }
      div.container {
        position: relative;
        display: flex;
        width: 100%;
        gap: 0px;
        flex-wrap: wrap;
        gap: var(--b-gap, 0px);
        padding: 4px;
        box-sizing: border-box;
        --selected-color: var(--alarm-state-color);
      }
      div.container::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: var(--b-track, var(--primary-text-color));
        opacity: var(--b-track-opacity, 0.05);
        border-radius: calc(var(--content-scale, 1) * 18px);
      }
      div.button {
        cursor: pointer;
        position: relative;
        flex: 1;
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        /* For safari border-radius overflow */
        z-index: 0;
      }
      div.content {
        display: flex;
        position: relative;
        inline-size: calc(100% - 4px);
        border-radius: calc(var(--content-scale, 1) * 6px);
        height: calc(var(--content-scale, 1) * 26px);
        color: var(--primary-text-color);
        --mdc-icon-size: calc(var(--content-scale, 1) * var(--hmac-alarm-icon-size, 22px));
        align-items: center;
        justify-content: center;
        cursor: pointer;
        flex-direction: column;
        padding: var(--b-pad, 8px) 2px;
        overflow: hidden;
        flex: 1;
        gap: 4px;
        background: var(--b-bg, none);
        /* an inset outline, not a border: the buttons have a fixed height */
        box-shadow: inset 0 0 0 1px var(--b-bd, transparent);
        transition:
          color ease-in-out 180ms;
      }
      div.content.has-text {
        height: calc(var(--content-scale, 1) * 40px);
      }
      div.content::before {
        content: "";
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: var(--b-abg, var(--btn-color, var(--selected-color)));
        opacity: 0;
        border-radius: calc(var(--content-scale, 1) * 14px);
        transition:
          background-color ease-in-out 180ms,
          opacity ease-in-out 80ms;
      }
      div.content.focused::before,
      div.content:hover::before {
        opacity: 0.24;
      }
      div.button.selected .content::before {
        opacity: 1;
      }
      div.button.selected .content {
        box-shadow: inset 0 0 0 1px var(--b-abd, var(--b-bd, transparent));
      }
      div.content ha-icon {
        display: flex;
        color: var(--b-ic, var(--btn-color, inherit));
      }
      div.content span {
        display: flex;
        max-width: calc(100% - 4px);
        align-items: center;
        white-space: nowrap;
        overflow: hidden;
        overflow-wrap: break-word;
        text-overflow: clip;
        -webkit-hyphens: auto;
        -moz-hyphens: auto;
        hyphens: auto;
        word-break: break-word;
        font-weight: var(--hmac-alarm-button-weight, 400);
        font-size: calc(var(--content-scale, 1) * var(--hmac-alarm-button-size, 14px));
        font-family: var(--hmac-alarm-button-font, inherit);
        font-style: var(--hmac-alarm-button-style, normal);
        text-transform: var(--hmac-alarm-button-transform, none);
        color: var(--hmac-alarm-button-color, inherit);
      }
      div.button.selected div.content ha-icon, div.button.selected div.content,
      div.button.selected div.content span {
        color: var(--b-aic, white);
      }
      /* text follows the icon color */
      div.container.follow div.content span {
        color: var(--b-ic, var(--btn-color, inherit));
      }
      div.container.follow div.button.selected div.content span {
        color: var(--b-aic, white);
      }
      /* round: a circle around the icon (selected: filled), the text below */
      div.container.round {
        --disc: calc(var(--content-scale, 1) * var(--hmac-alarm-icon-size, 22px) * 1.8);
      }
      div.container.round div.content,
      div.container.round div.content.has-text {
        height: auto;
        background: none;
        box-shadow: none;
        padding: 4px 2px;
        justify-content: flex-start;
      }
      div.container.round div.content ha-icon {
        width: var(--disc);
        height: var(--disc);
        align-items: center;
        justify-content: center;
      }
      div.container.round div.content::before,
      div.container.round div.content::after {
        width: var(--disc);
        height: var(--disc);
        left: 50%;
        top: 4px;
        transform: translateX(-50%);
        border-radius: 50%;
      }
      div.container.round div.content::after {
        content: "";
        position: absolute;
        z-index: -2;
        background: var(--b-bg, transparent);
        box-shadow: inset 0 0 0 1px var(--b-bd, transparent);
      }
      div.container.round div.button.selected div.content::after {
        box-shadow: inset 0 0 0 1px var(--b-abd, var(--b-bd, transparent));
      }
      div.container.round div.content ha-icon.badge {
        width: auto;
        height: auto;
      }
      /* fit: as wide as their content, centered; the space between them is the gap */
      div.container.fit {
        justify-content: center;
      }
      div.container.fit div.button {
        flex: 0 0 auto;
        width: auto;
      }
      div.container.fit div.content {
        flex: 0 0 auto;
        inline-size: auto;
        padding-left: 10px;
        padding-right: 10px;
      }
      /* effects on the selected (or arming) button, in its own color */
      div.button {
        --fx-own: var(--btn-color, var(--fx-c));
      }
      div.button::after {
        content: "";
        position: absolute;
        inset: 0;
        margin: auto;
        inline-size: calc(100% - 4px);
        border-radius: calc(var(--content-scale, 1) * 14px);
        background: var(--fx-own);
        opacity: 0;
        pointer-events: none;
        z-index: 1;
      }
      div.button.fx-background-glow::after { opacity: 0.22; }
      div.button.fx-background-pulse::after { animation: hmac-ab-tint var(--fx-speed, 1.6s) ease-in-out infinite; }
      div.button.fx-background-glow.fx-background-pulse::after { animation-name: hmac-ab-tint-strong; }
      div.button.fx-border-glow div.content {
        box-shadow: 0 0 var(--fx-size, 16px) calc(var(--fx-size, 16px) / 8) color-mix(in srgb, var(--fx-own) 55%, transparent);
      }
      div.button.fx-border-pulse div.content { animation: hmac-ab-ring var(--fx-speed, 1.6s) ease-out infinite; }
      div.button.fx-border-glow.fx-border-pulse div.content { animation-name: hmac-ab-ring-glow; }
      /* the glow shows outside the button; min-width 0 keeps one row (it shrank by overflow: hidden before) */
      div.button { overflow: visible; min-width: 0; }
      div.container.fit div.button { min-width: auto; }
      div.button.fx-icon-glow div.content ha-icon:not(.badge) {
        filter: drop-shadow(0 0 calc(var(--fx-size, 16px) / 3) var(--fx-own)) drop-shadow(0 0 calc(var(--fx-size, 16px) / 6) var(--fx-own));
      }
      div.button.fx-icon-pulse div.content ha-icon:not(.badge) { animation: hmac-ab-icon var(--fx-speed, 1.6s) ease-in-out infinite; }
      @keyframes hmac-ab-tint { 0%, 100% { opacity: 0; } 50% { opacity: 0.3; } }
      @keyframes hmac-ab-tint-strong { 0%, 100% { opacity: 0.12; } 50% { opacity: 0.4; } }
      @keyframes hmac-ab-ring {
        0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--fx-own) 60%, transparent); }
        70%, 100% { box-shadow: 0 0 0 calc(var(--fx-size, 16px) / 2) color-mix(in srgb, var(--fx-own) 0%, transparent); }
      }
      @keyframes hmac-ab-ring-glow {
        0% { box-shadow: 0 0 var(--fx-size, 16px) calc(var(--fx-size, 16px) / 8) color-mix(in srgb, var(--fx-own) 55%, transparent), 0 0 0 0 color-mix(in srgb, var(--fx-own) 60%, transparent); }
        70%, 100% { box-shadow: 0 0 var(--fx-size, 16px) calc(var(--fx-size, 16px) / 8) color-mix(in srgb, var(--fx-own) 55%, transparent), 0 0 0 calc(var(--fx-size, 16px) / 2) color-mix(in srgb, var(--fx-own) 0%, transparent); }
      }
      @keyframes hmac-ab-icon { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.18); opacity: 0.75; } }
      @media (prefers-reduced-motion: reduce) {
        div.button, div.button * { animation: none !important; }
      }
      @media (max-width: 280px) {
        div.container {
          flex-direction: column;
        }
      }
      div.content ha-icon.badge {
        position: absolute;
        top: 0px;
        margin-left: calc(var(--content-scale, 1) * 28px);
      }
      div.content ha-icon.success {
        color: var(--green-color);
      }
      div.content ha-icon.error {
        color: var(--red-color);
      }
    `}};t([ge({attribute:!1})],Yt.prototype,"hass",void 0),t([ge({attribute:!1})],Yt.prototype,"config",void 0),t([ge({attribute:!1})],Yt.prototype,"readyForArmModes",void 0),Yt=t([pe("hmac-actions-bar")],Yt);const Jt=["1","2","3","4","5","6","7","8","9","","0","clear"],Zt=new Map;let Xt=class extends(Nt(de)){constructor(){super(...arguments),this._input="",this.warning="",this.area_id=void 0,this.armOptions=Object.assign({},$t),this.readyForArmModes=null,this.backendConnection=null,this.showBypassedSensors=!1,this.subscribedEntities=[],this._codeClearTimer=0}async getCardSize(){var e;if(!this._config||!this.hass)return 9;const t=this.hass.states[this._config.entity];return t&&(null===(e=this._house_modesConfig)||void 0===e?void 0:e.code_format)===ut?!Tt(t)&&!this._config.keep_keypad_visible||this._config.use_code_dialog?4:9:4}set cardConfig(e){e&&JSON.stringify(e)!==JSON.stringify(this._cardConfigRaw)&&(this._cardConfigRaw=e,this.setConfig(e))}setConfig(e){!(null==e?void 0:e.button_scale_actions)&&(null==e?void 0:e.button_scale)&&(e=Object.assign(Object.assign({},e),{button_scale_actions:null==e?void 0:e.button_scale})),!(null==e?void 0:e.button_scale_keypad)&&(null==e?void 0:e.button_scale)&&(e=Object.assign(Object.assign({},e),{button_scale_keypad:null==e?void 0:e.button_scale})),(e=>{if(!e||!e.entity||"alarm_control_panel"!==Mt(e.entity))throw new Error("Invalid configuration provided for entity");if(Ot(e.button_scale_keypad)&&("number"!=typeof e.button_scale_keypad||e.button_scale_keypad<1||e.button_scale_keypad>2.5))throw new Error("Invalid configuration provided for button_scale_keypad");if(Ot(e.button_scale_actions)&&("number"!=typeof e.button_scale_actions||e.button_scale_actions<1||e.button_scale_actions>2.5))throw new Error("Invalid configuration provided for button_scale_actions")})(e),this._config=Object.assign(Object.assign({},xt),e),this.restoreBackend()}hassSubscribe(){return[this.hass.connection.subscribeMessage(e=>this._fetchData(e),{type:yt})]}restoreBackend(){const e=this._config?Zt.get(this._config.entity):void 0;e&&!this.backendConnection&&(this.area_id=e.area_id,this._house_modesConfig=e.hmConfig,this.readyForArmModes=e.ready,this.backendConnection=!0)}async firstUpdated(){this.restoreBackend();const e=await window.loadCardHelpers(),t=await e.createCardElement({type:"entities",entities:[]});await t.constructor.getConfigElement(),await this.loadBackendConfig()}async loadBackendConfig(){var e;this.backendConnection&&!Zt.has(this._config.entity)||(e=this.hass,e.callWS({type:"house_modes/entities"})).then(e=>{const t=e.find(e=>e.entity_id==this._config.entity);t&&(this.area_id=t.area_id?t.area_id:null)}).then(()=>(e=>e.callWS({type:"house_modes/config"}))(this.hass)).then(e=>{this._house_modesConfig=e,this.backendConnection=!0}).then(()=>((e,t)=>e.callWS({type:"house_modes/ready_to_arm_modes",entity_id:t}))(this.hass,this._config.entity)).then(e=>{this.readyForArmModes=e.modes,Zt.set(this._config.entity,{area_id:this.area_id,hmConfig:this._house_modesConfig,ready:e.modes})}).catch(e=>{this.backendConnection=!1})}async _fetchData(e){if(e.data.area_id===this.area_id)switch(e.data.event){case _t.Arm:this._clearCode();break;case _t.Trigger:break;case _t.InvalidCodeProvided:case _t.NoCodeProvided:this._showCodeError(),this.subscribedEntities=[];break;case _t.FailedToArm:this.warning="blocking_sensors",this._last_command=e.data.command,this._last_code=this._input,this._clearCode();break;case _t.CommandNotAllowed:this._clearCode();break;case _t.TriggerTimeExpired:break;case _t.ReadyToArmModesChanged:this.readyForArmModes=e.data.modes}}shouldUpdate(e){if(e.has("_config"))return!0;const t=e.get("hass");if(!t||t.themes!==this.hass.themes||t.language!==this.hass.language||t.config.state!==this.hass.config.state)return!0;if(t.states[this._config.entity]!==this.hass.states[this._config.entity]){const e=t.states[this._config.entity],s=this.hass.states[this._config.entity];return!1===this.backendConnection&&(async()=>{await this.loadBackendConfig()})(),this.processStateUpdate(e,s),!0}return!(!this.subscribedEntities.length||!this.subscribedEntities.some(e=>t.states[e]!==this.hass.states[e]))}processStateUpdate(e,t){t.state!=e.state&&(this.subscribedEntities=[]),(t.state==mt.Disarmed||t.last_changed!==e.last_changed)&&this._clearCode()}render(){var e,t;if(!this._config||!this.hass||null===this.backendConnection)return K``;const s=this.hass.states[this._config.entity];return s?!1===this.backendConnection?K`
        <hui-warning>
          Could not establish a connection with the house_modes integration. Please check if it is installed and the correct
          entity is selected in the card settings.
        </hui-warning>
      `:K`
      <ha-card>
        ${"controls"===this._config.part?"":K`
        <div class="header">
${!1===this._config.show_icon?"":K`<div class="icon">
            <hmac-state-badge
              .hass=${this.hass}
              .entity=${this._config.entity}
              style="--alarm-state-color: ${Ht(s,this._config)}"
            >
            </hmac-state-badge>
          </div>`}
          <div class="summary">
            ${!1===this._config.show_name?"":K`<div class="name">
              ${((e,t)=>Ct(t.name)?e.attributes.friendly_name:t.name)(s,this._config)}
            </div>`}
            ${!1===this._config.show_state?"":K`<div class="state">
              ${Et(s,this.hass.localize,this._config)}
            </div>`}
          </div>
        </div>
        `}
        ${"status"===this._config.part?"":K`
        ${this._renderWarning()}

        <div id="actions" class="actions">
          ${this._renderActions()}
        </div>

        ${s.state===mt.Disarmed&&!1!==this._config.show_arm_options?K`
          <div class="chips" role="group" aria-label=${qt("arm_options.heading",this.hass.language)}>
            ${["skip_delay","force"].map(e=>K`
              <button class="chip ${this.armOptions[e]?"on":""}" aria-pressed=${this.armOptions[e]?"true":"false"}
                @click=${t=>this._toggleArmOptions(t,e)}>
                <ha-icon icon=${this.armOptions[e]?"mdi:check":"skip_delay"===e?"mdi:timer-off-outline":"mdi:shield-alert-outline"}></ha-icon>
                ${qt(`arm_options.${e}`,this.hass.language)}
              </button>`)}
          </div>`:""}

        ${!Tt(s)&&!this._config.keep_keypad_visible||this._config.use_code_dialog?K``:K`
              <ha-input
                .value=${this._input}
                .label=${this.hass.localize("ui.card.alarm_control_panel.code")}
                ?disabled=${!Tt(s)}
                @input=${e=>{this._clearCodeError(),this._input=e.target.value,this._setCodeClearTimer()}}
                @focus=${this._clearCodeError}
                type="password"
                id="code_input"
                .inputmode=${(null===(e=this._house_modesConfig)||void 0===e?void 0:e.code_format)===ut?"numeric":"text"}
              ></ha-input>
            `}
        ${!Tt(s)&&!this._config.keep_keypad_visible||(null===(t=this._house_modesConfig)||void 0===t?void 0:t.code_format)!==ut||this._config.use_code_dialog||this._config.hide_keypad?K``:K`
          <div id="keypad" class="keypad" style="max-width: ${300*this._config.button_scale_keypad}px">
            ${Jt.map(e=>""===e?K`
              <hmac-button
                disabled
                style="--content-scale: ${this._config.button_scale_keypad}"
                ?scaled=${1!=this._config.button_scale_keypad}
                class="placeholder"
              ></hmac-button>
            `:K`
              <hmac-button
                .value="${e}"
                @click=${this._handlePadClick}
                ?disabled=${!Tt(s)||"clear"===e&&!this._input.length}
                class="${"clear"!==e?"numberKey":"clear"}"
                style="--content-scale: ${this._config.button_scale_keypad}"
                ?scaled=${1!=this._config.button_scale_keypad}
              >
                ${"clear"===e?K`<ha-icon icon="mdi:close" style="--mdc-icon-size: calc(${this._config.button_scale_keypad} * 24px)"></ha-icon>`:K` <span>${e}</span>`}
              </hmac-button>
            `)}
          </div>
        `}
        `}
      </ha-card>
    `:K`
        <hui-warning>
          ${"NOT_RUNNING"!==this.hass.config.state?this.hass.localize("ui.panel.lovelace.warning.entity_not_found","entity",this._config.entity||"[empty]"):this.hass.localize("ui.panel.lovelace.warning.starting")}
        </hui-warning>
      `}_renderActions(){if(!this.hass||!this._config)return K``;const e=this.hass.states[this._config.entity],t=this._config.show_ready_indicator;return K`
      <hmac-actions-bar
        @button-clicked=${e=>this._handleActionClick(e,e.detail.action)}
        .hass=${this.hass}
        .config=${this._config}
        .readyForArmModes=${t?this.readyForArmModes:void 0}
        style="--alarm-state-color: ${Ht(e,this._config,!0)}; --content-scale: ${this._config.button_scale_actions}"
      ></hmac-actions-bar>
    `}_renderWarning(){var e;if(!this.hass||!this._config||!this._config.show_messages)return K``;const t=this.hass.states[this._config.entity];return t.attributes.open_sensors&&t.state==mt.Triggered||"blocking_sensors"==this.warning&&t.attributes.open_sensors?K`
        <div class="messagebox">
          <div class="messagebox-left"></div>
          <div class="messagebox-inner">
            <div class="description">
              <div class="description-filler"></div>
              <span>
                <ha-icon icon="hass:alert"></ha-icon>
                ${"blocking_sensors"==this.warning?qt("errors.blocking_sensors",this.hass.language):qt("errors.triggered_sensors",this.hass.language)}
              </span>
              <div class="description-filler"></div>
            </div>
            <div class="content">
              ${Object.entries(t.attributes.open_sensors).map(([e])=>(this.subscribedEntities.includes(e)||this.subscribedEntities.push(e),K`
                  <div class="badge">
                    <hmac-sensor-badge .hass=${this.hass} .entity=${e}> </hmac-sensor-badge>
                  </div>
                `))}
            </div>
          ${"blocking_sensors"==this.warning&&t.attributes.open_sensors?K`
            <hmac-button
              @click=${this._forceRetryClick}
              style="--content-scale: ${this._config.button_scale_actions}"
              ?scaled=${1!=this._config.button_scale_actions}
            >
              <span>${qt("arm_options.force",this.hass.language)}</span>
            </hmac-button>
          `:""}
          </div>
          <div class="messagebox-right"></div>
        </div>
      `:t.state.startsWith("armed_")&&(null===(e=t.attributes.bypassed_sensors)||void 0===e?void 0:e.length)&&this._config.show_bypassed_sensors?K`
        <div class="messagebox warning">
          <div class="messagebox-left"></div>
          <div class="messagebox-inner">
            <div class="description">
              <div class="description-filler"></div>
              <span>
                <ha-icon icon="hass:alert"></ha-icon>
                ${qt("errors.bypassed_sensors",this.hass.language)}
              </span>
              <div class="description-filler"></div>
            </div>
            <div class="content">
              ${t.attributes.bypassed_sensors.map(e=>(this.subscribedEntities.includes(e)||this.subscribedEntities.push(e),K`
                  <div class="badge">
                    <hmac-sensor-badge .hass=${this.hass} .entity=${e}> </hmac-sensor-badge>
                  </div>
                `))}
            </div>
          </div>
          <div class="messagebox-right"></div>
        </div>
      `:K``}_handlePadClick(e){const t=e.currentTarget.value;this._clearCodeError(),this._input="clear"===t?"":this._input+t}async _handleActionClick(e,t){var s;e.target.blur(),this._clearCodeError();const o=this.hass.states[this._config.entity];if((null===(s=this._config)||void 0===s?void 0:s.use_code_dialog)&&!this._config.hide_keypad&&Tt(o)){const s=await new Promise(s=>{const o=e.target,a={code_format:this._house_modesConfig.code_format,area_id:this.area_id,entity_id:this._config.entity,action:t,armOptions:this.armOptions,cancel:()=>{s(null)},confirm:e=>{s(e)}};At(o,"show-dialog",{dialogTag:"hmac-code-dialog",dialogImport:()=>Promise.resolve().then(function(){return Gt}),dialogParams:a})});s!=_t.Arm&&s!=_t.Disarm||(this.warning="",this.armOptions=Object.assign({},$t))}else t==bt.Disarm?this.hass.callService("house_modes","disarm",{entity_id:this._config.entity,code:this._input}):this.hass.callService("house_modes","arm",Object.assign(Object.assign({},this.armOptions),{entity_id:this._config.entity,mode:vt[t],code:this._input})),this.warning="",this.armOptions=Object.assign({},$t)}_showCodeError(){var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#code_input");t&&(t.classList.remove("error"),t.classList.add("error"),t.hint=qt("errors.invalid_pin",this.hass.language))}_clearCodeError(){var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#code_input");t&&t.classList.contains("error")&&(t.classList.remove("error"),t.hint="",this._input="",this._cancelCodeClearTimer())}_clearCode(){this._input="",this._clearCodeError(),this._cancelCodeClearTimer()}_setCodeClearTimer(){this._cancelCodeClearTimer(),this._input.length&&(this._codeClearTimer=window.setTimeout(()=>{this._clearCode()},12e4))}_cancelCodeClearTimer(){this._codeClearTimer&&clearTimeout(this._codeClearTimer)}_toggleArmOptions(e,t){e.stopImmediatePropagation(),e.target.blur(),"skip_delay"==t?this.armOptions=Object.assign(Object.assign({},this.armOptions),{skip_delay:!this.armOptions.skip_delay}):"force"==t&&(this.armOptions=Object.assign(Object.assign({},this.armOptions),{force:!this.armOptions.force}))}_forceRetryClick(){if(!this.hass||!this._config||!this._last_command)return;let e=this._last_command;this.hass.callService("house_modes","arm",{entity_id:this._config.entity,mode:vt[e],code:this._last_code,force:!0}),this._last_command=void 0,this._last_code=void 0}static get styles(){return c`
      ha-card {
        padding-bottom: 16px;
        position: relative;
        height: 100%;
        box-sizing: border-box;
      }
      /* inside the House Modes & Alarm Center Card: no card of its own */
      :host([embedded]) ha-card {
        box-shadow: none;
        border: none;
        background: none;
        padding-bottom: 8px;
      }
      :host([piece='status']) ha-card {
        padding-bottom: 0;
      }
      :host([embedded]) .header {
        padding: 8px 0px;
      }
      .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin: 0px auto;
        padding: 20px 0px;
        box-sizing: border-box;
        gap: 20px;
        margin: 0px 50px;
      }
      .header .icon {
        display: flex;
      }
      .header .summary {
        display: flex;
        flex-direction: column;
      }
      .header .name {
        font-size: var(--hmac-alarm-name-size, 24px);
        font-weight: var(--hmac-alarm-name-weight, 400);
        font-family: var(--hmac-alarm-name-font, inherit);
        font-style: var(--hmac-alarm-name-style, normal);
        text-transform: var(--hmac-alarm-name-transform, none);
        color: var(--hmac-alarm-name-color, inherit);
        display: flex;
      }
      .header .state {
        font-size: var(--hmac-alarm-state-size, 14px);
        font-weight: var(--hmac-alarm-state-weight, 400);
        font-family: var(--hmac-alarm-state-font, inherit);
        font-style: var(--hmac-alarm-state-style, normal);
        text-transform: var(--hmac-alarm-state-transform, none);
        color: var(--hmac-alarm-state-color, inherit);
        display: flex;
      }
      /* arming options as toggle chips (was a ⋮ menu) */
      .chips {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
        padding: 4px 10px 8px;
      }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 12px 4px 8px;
        border-radius: 16px;
        border: 1px solid var(--divider-color);
        background: none;
        cursor: pointer;
        font-family: var(--hmac-chip-font, inherit);
        font-size: var(--hmac-chip-size, 12px);
        font-weight: var(--hmac-chip-weight, 500);
        font-style: var(--hmac-chip-style, normal);
        text-transform: var(--hmac-chip-transform, none);
        color: var(--hmac-chip-color, var(--secondary-text-color));
        --mdc-icon-size: 16px;
      }
      .chip.on {
        border-color: var(--primary-color);
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.15);
        color: var(--hmac-chip-color, var(--primary-text-color));
      }
      .chip:focus-visible {
        outline: 2px solid var(--primary-color);
      }
      .actions {
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }
      .actions hmac-button {
        margin: 0 8px 8px;
      }
      ha-input {
        margin: 15px auto;
        max-width: 200px;
        text-align: center;
        margin-left: calc(50% - 200px / 2);
        margin-right: calc(50% - 200px / 2);
      }
      ha-input.error {
        animation: shake 0.2s ease-in-out 0s 2;
        --ha-color-border-neutral-loud: var(--ha-color-on-danger-quiet);
      }
      ha-input.error:not([value='']) {
        --secondary-text-color: var(--ha-color-on-danger-quiet);
      }
      ha-input.error::part(wa-hint) {
        color: var(--ha-color-on-danger-quiet);
      }
      #keypad {
        justify-content: center;
        flex-wrap: wrap;
        margin: auto;
        direction: ltr;
        display: grid;
        grid-template-columns: repeat(3, auto);
        grid-auto-rows: auto;
        grid-gap: var(--ha-space-4, 16px);
      }
      #keypad hmac-button {
        width: calc(var(--content-scale, 1) * 56px);
        height: calc(var(--content-scale, 1) * 56px);
        --hmac-button-font-size: 24px;
        --hmac-button-background-color: var(--primary-text-color);
        --hmac-button-background-opacity: 0.05;
        --hmac-button-border-radius: 50%;
        --hmac-button-border-color: none;
        --hmac-button-color: var(--primary-text-color);
        font-weight: 500;
      }
      #keypad hmac-button.clear:not([disabled]) {
        --hmac-button-background-color: var(--red-color);
        --hmac-button-color: var(--red-color);
        --hmac-button-background-opacity: 0.10;
      }
      #keypad hmac-button.placeholder {
        visibility: hidden;
      }
      @keyframes shake {
        0% {
          margin-left: calc(50% - 200px / 2);
        }
        25% {
          margin-left: calc(50% - 200px / 2 + 10px);
        }
        75% {
          margin-left: calc(50% - 200px / 2 - 10px);
        }
        100% {
          margin-left: calc(50% - 200px / 2);
        }
      }
      div.messagebox {
        width: 90%;
        margin: 0px auto 20px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: stretch;
        --border-color: var(--label-badge-red);
      }
      div.messagebox.warning {
        --border-color: var(--label-badge-yellow);
      }
      div.messagebox.warning hmac-sensor-badge {
        --label-badge-red: var(--label-badge-yellow);
      }
      div.messagebox-left {
        display: flex;
        width: 10px;
        border: 1px solid var(--border-color);
        border-width: 1px 0px 1px 1px;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      div.messagebox-right {
        display: flex;
        width: 10px;
        border: 1px solid var(--border-color);
        border-width: 1px 1px 1px 0px;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      div.messagebox-inner {
        flex-direction: column;
        border-bottom: 1px solid var(--border-color);
        flex: 1 1;
      }
      div.messagebox .description {
        display: flex;
        flex-direction: row;
      }
      div.messagebox .description span {
        color: var(--label-badge-red);
        font-weight: 500;
        display: flex;
        margin-top: -10px;
        padding: 0px 5px;
        flex-shrink: 2;
      }
      div.messagebox.warning .description span {
        color: #d0863d;
      }
      div.messagebox .description-filler {
        flex: 1;
        border-top: 1px solid var(--border-color);
        min-width: 5px;
      }
      div.messagebox .description ha-icon {
        --mdc-icon-size: 24px;
        margin: 0px 4px 0px 0px;
      }
      div.messagebox .content {
        display: flex;
        flex-basis: 100%;
        padding: 5px;
        justify-content: space-around;
        align-items: center;
        flex: 1;
        flex-direction: row;
        flex-wrap: wrap;
        color: var(--primary-text-color);
      }
      div.messagebox .content .badge {
        width: 64px;
        margin: 5px 0px;
        justify-content: center;
        align-items: center;
      }
      div.messagebox hmac-button {
        display: flex;
        justify-self: center;
        margin-bottom: 10px;
      }
    `}};t([ge({attribute:!1})],Xt.prototype,"hass",void 0),t([be()],Xt.prototype,"_config",void 0),t([be()],Xt.prototype,"_house_modesConfig",void 0),t([be()],Xt.prototype,"_input",void 0),t([be()],Xt.prototype,"warning",void 0),t([be()],Xt.prototype,"area_id",void 0),t([be()],Xt.prototype,"armOptions",void 0),t([be()],Xt.prototype,"readyForArmModes",void 0),t([be()],Xt.prototype,"backendConnection",void 0),t([be()],Xt.prototype,"showBypassedSensors",void 0),t([ge({attribute:!1})],Xt.prototype,"cardConfig",null),Xt=t([pe("hmac-alarm")],Xt);const Qt="2026.11.11.94";var es,ts,ss,os;!function(e){e.STATE_ALARM_DISARMED="disarmed",e.STATE_ALARM_ARMED_HOME="armed_home",e.STATE_ALARM_ARMED_AWAY="armed_away",e.STATE_ALARM_ARMED_NIGHT="armed_night",e.STATE_ALARM_ARMED_CUSTOM_BYPASS="armed_custom_bypass",e.STATE_ALARM_ARMED_VACATION="armed_vacation",e.STATE_ALARM_PENDING="pending",e.STATE_ALARM_ARMING="arming",e.STATE_ALARM_TRIGGERED="triggered"}(es||(es={})),function(e){e.COMMAND_ALARM_DISARM="disarm",e.COMMAND_ALARM_ARM_HOME="arm_home",e.COMMAND_ALARM_ARM_AWAY="arm_away",e.COMMAND_ALARM_ARM_NIGHT="arm_night",e.COMMAND_ALARM_ARM_CUSTOM_BYPASS="arm_custom_bypass",e.COMMAND_ALARM_ARM_VACATION="arm_vacation"}(ts||(ts={})),function(e){e.Door="door",e.Window="window",e.Motion="motion",e.Tamper="tamper",e.Environmental="environmental",e.Other="other"}(ss||(ss={})),function(e){e.Notification="notification",e.Action="action"}(os||(os={}));const as=[["var(--primary-color)","Primary"],["var(--accent-color)","Accent"],["var(--primary-text-color)","Primary text"],["var(--secondary-text-color)","Secondary text"],["var(--disabled-text-color)","Disabled text"],["var(--state-active-color)","State active"],["var(--error-color)","Error"],["var(--warning-color)","Warning"],["var(--success-color)","Success"],["var(--info-color)","Info"]],is=["keep_keypad_visible","use_code_dialog","hide_keypad","show_messages","show_ready_indicator","show_bypassed_sensors"],ns={keep_keypad_visible:!1,use_code_dialog:!1,hide_keypad:!1,show_messages:!0,show_ready_indicator:!0,show_bypassed_sensors:!0},rs={keep_keypad_visible:"Always show the code keypad",use_code_dialog:"Ask for the code in a dialog",hide_keypad:"Hide the code keypad",show_messages:"Messages (not ready, triggered)",show_ready_indicator:"Ready dot on the arm buttons",show_bypassed_sensors:"Warn about bypassed zones"},ls=[300,400,500,600,700,800],cs=[["monospace","Monospace (panel display)"],["sans","Sans-serif (theme)"],["serif","Serif"]],ds={monospace:"monospace",sans:"sans-serif",serif:"serif"},hs=e=>JSON.parse(JSON.stringify(null!=e?e:null));let ps=class extends de{constructor(){super(...arguments),this.onlyOne=e=>{var t;const s=e.currentTarget;if(!s.open)return;const o=s.classList.contains("panel")?"panel":"sub";for(const e of Array.from((null===(t=s.parentElement)||void 0===t?void 0:t.children)||[]))e!==s&&e instanceof HTMLDetailsElement&&e.classList.contains(o)&&e.open&&(e.open=!1)}}setConfig(e){this.config=ot(e)}disconnectedCallback(){super.disconnectedCallback(),tt.on&&tt.set(!1)}setFxPart(e,t,s){const o=Object.assign({},(this.config||{}).effects||{}),a=Object.assign({},o[e]||{});s&&"none"!==s?a[t]=s:delete a[t],Object.keys(a).length?o[e]=a:delete o[e],this.emit(Object.assign(Object.assign({},this.config),{effects:o}))}setFx(e,t){const s=Object.assign({},(this.config||{}).effects||{});void 0===t||""===t||"none"===t?delete s[e]:s[e]=t,this.emit(Object.assign(Object.assign({},this.config),{effects:s}))}setMap(e,t,s){var o;const a=Object.assign({},(null===(o=this.config)||void 0===o?void 0:o[e])||{});void 0===s||""===s?delete a[t]:a[t]=s,this.set(e,Object.keys(a).length?a:void 0)}sectionBg(e){return K`${this.group("Background")}
      ${this.color("Section background",this.styleOf(e).background,"Card background","#262626",t=>this.setStyle(e,"background",t))}`}effectsBody(){var e;const t=(null===(e=this.config)||void 0===e?void 0:e.effects)||{},s=t.when||Ze.when,o=[["none","Off"],["glow","Glow"],["pulse","Pulse"],["both","Glow + pulse"]],a={background:"Background",border:"Border",icon:"Icon"};return K`
      ${Object.keys(Ge).map(e=>K`
        ${this.group(Ge[e].label)}
        ${Ve.filter(t=>Ge[e].parts.includes(t)).map(s=>{var i;return this.select(a[s],(null===(i=t[e])||void 0===i?void 0:i[s])||"none",o,t=>this.setFxPart(e,s,t))})}`)}
      ${t.mode_button||t.arm_button?K`<p class="hint">Buttons glow and pulse in their own House Mode / arm mode color.</p>`:G}
      ${this.group("When")}
      ${Ye.map(e=>this.toggle(Je[e],s.includes(e),t=>{const o=t?[...new Set([...s,e])]:s.filter(t=>t!==e);this.setFx("when",Ye.every(e=>o.includes(e))?void 0:o)}))}
      ${this.group("Look")}
      ${this.slider("Glow size",t.size||0,2,60,1," px",Ze.size,e=>this.setFx("size",e||void 0))}
      ${this.slider("Pulse speed",t.speed||0,.4,6,.1," s",Ze.speed,e=>this.setFx("speed",e?Math.round(10*e)/10:void 0))}
      ${this.color("Effect color",t.color,"State color (the border color)","#ff9800",e=>this.setFx("color",e))}
      ${this.group("Try it")}
      ${this.toggle("Preview the effects now",tt.on,e=>{tt.set(e),this.requestUpdate()},"for 20 s; not saved")}
    `}displayBody(){const e=this.cfg.display_replace||[],t=e=>this.set("display_replace",e.length?e:void 0);return K`
      ${this.group("Panel display text")}
      <div class="row"><span class="lab">Replace</span>
        <button class="add" @click=${()=>t([...e,{from:"",to:""}])}>+ Replacement</button></div>
      ${e.map((s,o)=>K`<div class="row rep">
        <input type="text" aria-label="Find" placeholder="find" .value=${s.from||""}
          @change=${s=>t(e.map((e,t)=>t===o?Object.assign(Object.assign({},e),{from:s.target.value}):e))} />
        <span class="lab">→</span>
        <input type="text" aria-label="Replace with" placeholder="replace with (empty = remove)" .value=${s.to||""}
          @change=${s=>t(e.map((e,t)=>t===o?Object.assign(Object.assign({},e),{to:s.target.value||void 0}):e))} />
        <button class="icon-btn del" title="Remove" aria-label="Remove" @click=${()=>t(e.filter((e,t)=>t!==o))}>
          <ha-icon icon="mdi:trash-can-outline"></ha-icon></button>
      </div>`)}
      <p class="hint">Applied in order, to each line; exact text, case sensitive. Replace "*" with nothing to turn
        ****DISARMED**** into DISARMED.</p>
    `}firstUpdated(){var e;null===(e=this.hass)||void 0===e||e.callWS({type:"house_modes/ext/card/get"}).then(e=>this.data=e).catch(()=>{})}updated(){var e,t;if(!this.hass||!this.config)return;const s=this.config.entity||(null===(t=null===(e=this.data)||void 0===e?void 0:e.alarms[0])||void 0===t?void 0:t.entity_id)||"";this.permsFor!==s&&(this.permsFor=s,this.hass.callWS(Object.assign({type:"house_modes/ext/card/permissions"},s?{entity_id:s}:{})).then(e=>this.perms=e).catch(()=>{}))}get cfg(){return Object.assign(Object.assign({},xe),this.config||{})}emit(e){const t=Object.assign({},e);for(const[e,s]of Object.entries(xe))t[e]===s&&delete t[e];Array.isArray(t.hidden_modes)&&!t.hidden_modes.length&&delete t.hidden_modes;const s=Ie(t.styles);if(s?t.styles=s:delete t.styles,t.alarm){for(const[e,s]of Object.entries(ns))t.alarm[e]===s&&delete t.alarm[e];for(const e of["button_scale_actions","button_scale_keypad"])1===t.alarm[e]&&delete t.alarm[e];Object.keys(t.alarm).length||delete t.alarm}t.name||delete t.name,delete t.alarm_colors_from_modes;const o=Ce(t).map(e=>{const t=Object.assign({},e);return!0===t.show&&delete t.show,t.style&&"chips"!==t.style||delete t.style,!1!==t.show_icons&&delete t.show_icons,!1!==t.show_labels&&delete t.show_labels,t.columns||delete t.columns,t.collapsible||delete t.collapsible,!0===t.start_collapsed&&delete t.start_collapsed,t.popup||delete t.popup,t.name||delete t.name,t.embed_in||delete t.embed_in,t.embed_in&&"right"!==t.position||delete t.position,t.buttons=(t.buttons||[]).map(e=>{const t=Object.assign({},e);return t.action&&"toggle"!==t.action||delete t.action,t.label||delete t.label,t.icon||delete t.icon,t}),t});o.length?t.button_menus=o:delete t.button_menus;const a=ze(t);t.status_sections=a.sections.map(e=>{const t=Object.assign({},e);return!0===t.show&&delete t.show,t.countdown||delete t.countdown,t.collapsible||delete t.collapsible,!0===t.start_collapsed&&delete t.start_collapsed,"house"===t.icon&&delete t.icon,t.align&&"block"!==t.align||delete t.align,t.indent||delete t.indent,t.background||delete t.background,t.styles&&!Object.keys(Ie(t.styles)||{}).length?delete t.styles:t.styles&&(t.styles=Ie(t.styles)),t}),t.section_order=a.order;for(const e of Ee)delete t[e];t.styles&&(delete t.styles.header_section,delete t.styles.alarm_status_section,Object.keys(t.styles).length||delete t.styles);for(const e of["effects","mode_colors","arm_colors","key_flash"])t[e]&&!Object.keys(t[e]).length&&delete t[e];t.entity||delete t.entity,this.config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}set(e,t){this.emit(Object.assign(Object.assign({},this.config),{[e]:t}))}setAlarm(e,t){const s=Object.assign(Object.assign({},(this.config||{}).alarm||{}),{[e]:t});this.emit(Object.assign(Object.assign({},this.config),{alarm:s}))}setStyle(e,t,s){const o=hs((this.config||{}).styles||{});o[e]=Object.assign({},o[e]||{}),void 0===s||""===s||null===s?delete o[e][t]:o[e][t]=s,this.emit(Object.assign(Object.assign({},this.config),{styles:o}))}styleOf(e){return((this.config||{}).styles||{})[e]||{}}toggle(e,t,s,o){return K`<label class="row check">
      <input type="checkbox" .checked=${t} @change=${e=>s(e.target.checked)} />
      <span>${e}</span>${o?K`<span class="hint inline">${o}</span>`:G}
    </label>`}slider(e,t,s,o,a,i,n,r,l=!0){return K`<div class="row slider">
      <span class="lab">${e}</span>
      <div class="ctl nowrap">
        <input type="range" .min=${String(l?0:s)} .max=${String(o)} .step=${String(a)}
          .value=${String(null!=t?t:l?0:s)}
          @input=${e=>{const t=Number(e.target.value);r(l&&t>0&&t<s?s:t)}} />
        <span class="val">${l&&!t?K`<span class="muted">${n}${i}</span>`:K`${t}${i}`}</span>
      </div>
    </div>`}select(e,t,s,o){return K`<div class="row">
      <span class="lab">${e}</span>
      <select class="ctl" @change=${e=>o(e.target.value)}>
        ${s.map(([e,s])=>K`<option value=${e} ?selected=${e===t}>${s}</option>`)}
      </select>
    </div>`}triState(e,t,s,o){const a=void 0===t?"":t?"on":"off";return this.select(e,a,[["",s],["off","Off"],["on","On"]],e=>o(""===e?void 0:"on"===e))}color(e,t,s,o,a,i=[]){const n=i.find(([e])=>e===t),r=n?`preset:${n[0]}`:(e=>{const t=null==e?"":String(e);return""===t?"default":/^#[0-9a-fA-F]{3,8}$/.test(t)?"custom":/^var\(/.test(t)&&as.some(([e])=>e===t)?"theme":"css"})(t),l=/^#[0-9a-fA-F]{6}$/.test(t||"")?t:o;return K`<div class="row">
      <span class="lab">${e}</span>
      <div class="ctl color">
        <select aria-label=${`${e}: kind`} @change=${e=>{const s=e.target.value;s.startsWith("preset:")?a(s.slice(7)):a("default"===s?void 0:"theme"===s?as[0][0]:"custom"===s?l:!t||"theme"!==r&&"custom"!==r&&"css"!==r?o:t)}}>
          <option value="default" ?selected=${"default"===r}>${s}</option>
          ${i.map(([e,t])=>K`<option value=${`preset:${e}`} ?selected=${r===`preset:${e}`}>${t}</option>`)}
          <option value="theme" ?selected=${"theme"===r}>Theme color</option>
          <option value="custom" ?selected=${"custom"===r}>Custom color</option>
          <option value="css" ?selected=${"css"===r}>CSS value</option>
        </select>
        ${"theme"===r?K`<select aria-label=${`${e}: theme color`} @change=${e=>a(e.target.value)}>
              ${as.map(([e,s])=>K`<option value=${e} ?selected=${e===t}>${s}</option>`)}
            </select>`:"custom"===r?K`<input type="color" aria-label=${e} .value=${l} @input=${e=>a(e.target.value)} />`:"css"===r?K`<input type="text" aria-label=${e} placeholder="tomato, rgba(…), var(--…)" .value=${t||""}
                  @change=${e=>a(e.target.value||void 0)} />`:G}
      </div>
    </div>`}panel(e,t,s,o,a,i=!1){return K`<details class="panel" ?open=${i} data-id=${e} @toggle=${this.onlyOne}>
      <summary><ha-icon icon=${t}></ha-icon><span>${s}</span><ha-icon class="chev" icon="mdi:chevron-down"></ha-icon></summary>
      <div class="body"><p class="hint">${o}</p>${a}</div>
    </details>`}sub(e,t){return K`<details class="sub" @toggle=${this.onlyOne}>
      <summary><span>${e}</span><ha-icon class="chev" icon="mdi:chevron-down"></ha-icon></summary>
      <div class="sub-body">${t}</div>
    </details>`}setHistory(e,t){var s;const o=Object.assign({},(null===(s=this.config)||void 0===s?void 0:s.history)||{}),a=dt();void 0===t||""===t||JSON.stringify(t)===JSON.stringify(a[e])?delete o[e]:o[e]=t,this.set("history",Object.keys(o).length?o:void 0)}historyBody(){const e=this.cfg;if(!e.show_history)return K`<p class="hint">Turned off under Sections.</p>`;const t=dt(e.history),s=(e,s,o)=>this.toggle(o,t[e].includes(s),o=>{const a=o?nt.filter(o=>o===s||t[e].includes(o)):t[e].filter(e=>e!==s);this.setHistory(e,a)}),o=Object.keys(this.hass.states).filter(e=>e.startsWith("select.")||e.startsWith("input_select.")).sort();return K`
      <p class="hint">House Mode, alarm and physical panel changes in one list, newest first, from Home Assistant's history
        (as far back as your recorder keeps it, 10 days by default). The House Mode lines also say why they changed.</p>
      ${this.group("Include")}
      ${nt.map(e=>s("kinds",e,lt[e]))}
      ${this.group("Ticked when the card loads")}
      ${nt.filter(e=>t.kinds.includes(e)).map(e=>s("shown",e,lt[e]))}
      ${this.toggle("Show the checkboxes on the card",t.show_filters,e=>this.setHistory("show_filters",e))}
      ${this.group("Rows")}
      ${this.slider("Today and the days before",t.days,0,30,1," d",0,e=>this.setHistory("days",e))}
      <p class="hint">0 = today only; 2 = today, yesterday and the day before. Counted from midnight.</p>
      ${this.slider("At most",t.max_rows,5,100,5," rows",20,e=>this.setHistory("max_rows",e||20),!1)}
      ${this.slider("Hide rows shorter than",t.hide_short,0,120,5," s",0,e=>this.setHistory("hide_short",e))}
      <p class="hint">E.g. 60 s hides "Arming" before "Armed".</p>
      ${this.group("Columns")}
      ${this.toggle("Day",t.show_day,e=>this.setHistory("show_day",e))}
      ${this.toggle("Duration",t.show_duration,e=>this.setHistory("show_duration",e))}
      ${this.toggle("Why the House Mode changed (schedule, lock code, …)",t.show_source,e=>this.setHistory("show_source",e))}
      ${this.group("House Mode from")}
      ${this.select("Entity",t.house_entity||"",[["","select.house_mode (standard)"],...o.filter(e=>"select.house_mode"!==e).map(e=>[e,e])],e=>this.setHistory("house_entity",e||void 0))}
      <p class="hint">Pick your own House Mode helper to see the days before House Modes went Live.</p>`}group(e){return K`<div class="group">${e}</div>`}textStyle(e,t,s){const o=_e[e],a=t?t.get():this.styleOf(e),i=(s,o,a)=>t?t.set(o,a):i(e,o,a);return this.sub((null==t?void 0:t.label)||o.label,K`
      ${s||G}
      ${this.group("Size and weight")}
      ${this.slider("Size",a.size||0,6,48,1," px",o.size,t=>i(e,"size",t||void 0))}
      ${this.select("Weight",a.weight?String(a.weight):"",[["",`Card default (${o.weight})`],...ls.map(e=>[String(e),String(e)])],t=>i(e,"weight",t?Number(t):void 0))}
      ${this.group("Font and case")}
      ${this.select("Font",a.font||"",[["",`Card default (${ds[o.font]})`],...cs],t=>i(e,"font",t||void 0))}
      ${this.triState("Italic",a.italic,"Card default (off)",t=>i(e,"italic",t))}
      ${this.triState("Capitals",a.caps,`Card default (${o.caps?"on":"off"})`,t=>i(e,"caps",t))}
      ${this.group("Color")}
      ${this.color("Text color",a.color,"Card default","#e1e1e1",t=>i(e,"color",t))}
    `)}iconStyle(e,t){const s=ye[e],o=this.styleOf(e);return this.sub(s.label,K`
      ${this.group("Size")}
      ${this.slider("Size",o.size||0,12,96,1," px",s.size,t=>this.setStyle(e,"size",t||void 0))}
      ${t?K`${this.group("Color")}
            ${this.color("Icon color",o.color,t.defaultLabel,"#9e9e9e",t=>this.setStyle(e,"color",t),t.presets)}`:G}
    `)}applyPreset(e,t,s){const o=at[s];if(!o)return;const a=hs((this.config||{}).styles||{});a[e]=Object.assign({},o.button);const i=(a[t]||{}).size;a[t]=Object.assign(Object.assign({},o.icon),i?{size:i}:{}),this.emit(Object.assign(Object.assign({},this.config),{styles:a}))}keyPreset(){const e=this.styleOf("key_button");return e.background||e.border?"transparent"!==e.background||e.border?"transparent"===e.background&&"none"===e.border?"plain":"":"outline":"filled"}setKeyPreset(e){const t=hs((this.config||{}).styles||{});if("filled"===e)delete t.key_button;else if("outline"===e)t.key_button={background:"transparent"};else{if("plain"!==e)return;t.key_button={background:"transparent",border:"none"}}this.emit(Object.assign(Object.assign({},this.config),{styles:t}))}buttonColors(e,t,s,o){const a=this.styleOf(e),i=this.styleOf(t),n=[["transparent","Transparent"],["mode",s]],r=[["none","None"],["mode",s]],l=[["mode",s]],c=((e,t)=>{const s=e=>JSON.stringify(Object.keys(e||{}).filter(e=>"size"!==e).sort().map(t=>[t,e[t]]));return Object.keys(at).find(o=>s(at[o].button)===s(e)&&s(at[o].icon)===s(t))||""})(a,i);return this.sub("Button colors",K`
      ${this.group("Style")}
      ${this.select("Style",c,[...Object.entries(at).map(([e,t])=>[e,t.label]),...c?[]:[["","Custom (the settings below)"]]],s=>this.applyPreset(e,t,s))}
      <p class="hint">${s} = each button's own color${"arm_button"===e?" (see Arm mode colors above)":""}. Pick a style, then
        fine-tune it below.</p>
      ${this.group("Background")}
      ${this.color("Background",a.background,o.bg,"#2a2a2a",t=>this.setStyle(e,"background",t),n)}
      ${this.color("Background (selected)",a.active_background,o.abg,"#3a3a3a",t=>this.setStyle(e,"active_background",t),n)}
      ${"arm_button"===e?this.color("Bar behind the buttons",a.track,"Card default (faint)","#202020",t=>this.setStyle(e,"track",t),[["transparent","Transparent"]]):G}
      ${this.group("Border")}
      ${this.color("Border",a.border,"Card default (none)","#444444",t=>this.setStyle(e,"border",t),r)}
      ${this.color("Border (selected)",a.active_border,"Same as not selected","#ffffff",t=>this.setStyle(e,"active_border",t),r)}
      ${this.group("Icon and text")}
      ${this.color("Icon color",i.color,o.ic,"#9e9e9e",e=>this.setStyle(t,"color",e),l)}
      ${this.color("Icon color (selected)",i.active_color,o.aic,"#ffffff",e=>this.setStyle(t,"active_color",e),l)}
      ${this.toggle("Text color follows the icon",!!a.text_follows_icon,t=>this.setStyle(e,"text_follows_icon",t||void 0))}
    `)}get layout(){return ze(this.cfg)}setStatus(e,t){this.emit(Object.assign(Object.assign({},this.config),{status_sections:e,section_order:t||this.layout.order}))}updStatus(e,t){const s=hs(this.layout.sections),o=s.find(t=>t.id===e);o&&(t(o),this.setStatus(s))}addStatus(){const{sections:e,order:t}=this.layout,s=(e=>{let t=1;for(;e.some(e=>e.id===`s${t}`);)t++;return`s${t}`})(e),o={id:s,name:`Status ${e.length+1}`,icon:"house",countdown:!0,lines:["house_mode"]};this.setStatus([...hs(e),o],[`status:${s}`,...t])}removeStatus(e){const{sections:t,order:s}=this.layout,o=t.find(t=>t.id===e);window.confirm(`Delete the Status section "${(null==o?void 0:o.name)||e}"?`)&&this.setStatus(t.filter(t=>t.id!==e),s.filter(t=>t!==`status:${e}`))}get menus(){return Ce(this.config)}setMenus(e,t){this.emit(Object.assign(Object.assign({},this.config),{status_sections:hs(this.layout.sections),button_menus:e,section_order:t||this.layout.order}))}updMenu(e,t){const s=hs(this.menus),o=s.find(t=>t.id===e);o&&(t(o),this.setMenus(s))}addMenu(){const e=this.menus,t=(e=>{let t=1;for(;e.some(e=>e.id===`m${t}`);)t++;return`m${t}`})(e);this.setMenus([...hs(e),{id:t,name:`Button Menu ${e.length+1}`,buttons:[]}],[`menu:${t}`,...this.layout.order])}removeMenu(e){const t=this.menus.find(t=>t.id===e);window.confirm(`Delete the Button Menu "${(null==t?void 0:t.name)||e}"? The sections on it are shown normally again.`)&&this.setMenus(this.menus.filter(t=>t.id!==e),this.layout.order.filter(t=>t!==`menu:${e}`))}isOn(e){const t=this.layout.sections.find(t=>`status:${t.id}`===e);if(t)return!1!==t.show;const s=He[e];return!s||!!this.cfg[s.show]}turnOn(e){this.isOn(e)||(e.startsWith("status:")?this.updStatus(e.slice(7),e=>e.show=void 0):He[e]&&this.set(He[e].show,!0))}sectionTitle(e){var t;const s=this.layout.sections.find(t=>`status:${t.id}`===e);return s?s.name||"Status":(null===(t=He[e])||void 0===t?void 0:t.title)||e}iconField(e,t,s){return customElements.get("ha-icon-picker")?K`<ha-icon-picker class="ctl" .hass=${this.hass} .value=${e||""} .placeholder=${t}
          @value-changed=${e=>s(e.detail.value||void 0)}></ha-icon-picker>`:K`<input class="ctl" type="text" placeholder=${t} .value=${e||""} @change=${e=>s(e.target.value.trim()||void 0)} />`}menuPanel(e){const t=e.buttons||[],s=e.style||"chips",o=this.layout.order.filter(e=>!e.startsWith("menu:")&&!t.some(t=>t.section===e)),a=(t,s)=>this.updMenu(e.id,e=>{const o=hs(e.buttons||[]);s(o[t]),e.buttons=o}),i=(t,s)=>this.updMenu(e.id,e=>{const o=[...e.buttons||[]];[o[t],o[t+s]]=[o[t+s],o[t]],e.buttons=o}),n=s=>{window.confirm(`Remove the "${t[s].label||this.sectionTitle(t[s].section)}" button? Its section is shown normally again.`)&&this.updMenu(e.id,e=>e.buttons=(e.buttons||[]).filter((e,t)=>t!==s))};return this.panel(`menu:${e.id}`,"mdi:gesture-tap-button",e.name||"Button Menu","A row of buttons. Each one shows or hides another section in its place, or opens it in a popup. A section on a menu is hidden until its button is pressed.",K`
      ${this.group("Name")}
      <div class="row"><span class="lab">Name</span>
        <input class="ctl" type="text" .value=${e.name||""} @change=${t=>this.updMenu(e.id,e=>e.name=t.target.value||void 0)} /></div>
      ${this.group("Place")}
      ${this.select("Where",e.embed_in||"",[["","A section of its own (in the section order)"],...this.layout.sections.map(e=>[`status:${e.id}`,`Inside ${e.name||"Status"}`])],t=>this.updMenu(e.id,e=>e.embed_in=t||void 0))}
      ${e.embed_in?K`${this.select("Position",e.position||"right",Object.entries(Se),t=>this.updMenu(e.id,e=>e.position="right"===t?void 0:t))}
          <p class="hint">Left and right stack the buttons in a column beside the icon and text; above and below put them in a row.</p>`:G}
      ${this.group("Look (all the buttons on this menu)")}
      ${this.select("Button style",s,Object.entries(Ae),t=>this.updMenu(e.id,e=>e.style=t))}
      ${"mode"===s||"arm"===s||"key"===s?K`<p class="hint">Shape, colors and text follow the ${Ae[s]} settings below.</p>`:G}
      ${this.toggle("Icons",!1!==e.show_icons,t=>this.updMenu(e.id,e=>e.show_icons=!!t&&void 0))}
      ${this.toggle("Labels",!1!==e.show_labels,t=>this.updMenu(e.id,e=>e.show_labels=!!t&&void 0))}
      ${"mode"===s||"key"===s?this.slider("Buttons per row",e.columns||0,1,9,1,"",Math.min(5,Math.max(1,t.length)),t=>this.updMenu(e.id,e=>e.columns=t||void 0)):G}
      ${this.group("Buttons")}
      <div class="row">
        <select class="add-sel" aria-label="Add a button" @change=${t=>{const s=t.target.value;t.target.value="",s&&(this.updMenu(e.id,e=>e.buttons=[...e.buttons||[],{section:s}]),this.turnOn(s))}}>
          <option value="">+ Button…</option>
          ${o.map(e=>K`<option value=${e}>${this.sectionTitle(e)}</option>`)}
        </select>
      </div>
      ${t.map((e,s)=>{var o;const r=Oe(e.section,null===(o=this.layout.sections.find(t=>`status:${t.id}`===e.section))||void 0===o?void 0:o.name);return K`<div class="btn-item">
          <div class="line-row">
            <span><ha-icon class="sec-ic" icon=${e.icon||r.icon}></ha-icon>${this.sectionTitle(e.section)}
              ${this.isOn(e.section)?G:K`<button class="chip warn-chip" title="The section is turned off, so the button is not shown" @click=${()=>this.turnOn(e.section)}>
                    <ha-icon icon="mdi:eye-off-outline"></ha-icon>Turned off: turn on</button>`}</span>
            <span class="order">
              <button class="icon-btn" title="Move up" aria-label="Move up" ?disabled=${0===s} @click=${()=>i(s,-1)}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
              <button class="icon-btn" title="Move down" aria-label="Move down" ?disabled=${s===t.length-1} @click=${()=>i(s,1)}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
              <button class="icon-btn del" title="Remove" aria-label="Remove" @click=${()=>n(s)}><ha-icon icon="mdi:trash-can-outline"></ha-icon></button>
            </span>
          </div>
          <div class="row sec-chips">
            ${[["toggle","mdi:eye-outline","Show / hide in place"],["popup","mdi:open-in-new","Popup"]].map(([t,o,i])=>{const n=(e.action||"toggle")===t;return K`<button class="chip ${n?"on":""}" aria-pressed=${n?"true":"false"}
                title=${"toggle"===t?"Shows or hides the section in its place in the section order":"Opens the section in a popup"}
                @click=${()=>a(s,e=>e.action="toggle"===t?void 0:"popup")}><ha-icon icon=${o}></ha-icon>${i}</button>`})}
          </div>
          <div class="row"><span class="lab">Label</span>
            <input class="ctl" type="text" placeholder=${r.label} .value=${e.label||""} @change=${e=>a(s,t=>t.label=e.target.value||void 0)} /></div>
          <div class="row"><span class="lab">Icon</span>${this.iconField(e.icon,r.icon,e=>a(s,t=>t.icon=e))}</div>
        </div>`})}
      ${t.length?G:K`<p class="hint">No buttons yet: add the sections this menu shows.</p>`}
    `)}statusPanel(e){var t;const s=e.lines||[],o=t=>({get:()=>(e.styles||{})[t]||{},set:(s,o)=>this.updStatus(e.id,e=>{const a=Object.assign({},e.styles||{}),i=Object.assign({},a[t]||{});void 0===o||""===o||null===o?delete i[s]:i[s]=o,Object.keys(i).length?a[t]=i:delete a[t],e.styles=Object.keys(a).length?a:void 0}),label:`${_e[t].label} (this section)`}),a=(t,s)=>this.updStatus(e.id,e=>{const o=[...e.lines||[]];[o[t],o[t+s]]=[o[t+s],o[t]],e.lines=o}),i=$e.filter(e=>!s.includes(e)),n=(null===(t=e.styles)||void 0===t?void 0:t.header_icon)||{};return this.panel(`status:${e.id}`,"mdi:information-outline",e.name||"Status","A status block: an icon (or the countdown during a delay) and the lines you choose, in order.",K`
      ${this.group("Name")}
      <div class="row"><span class="lab">Name</span>
        <input class="ctl" type="text" .value=${e.name||""} @change=${t=>this.updStatus(e.id,e=>e.name=t.target.value||void 0)} /></div>
      ${this.group("Icon")}
      ${this.select("Icon",e.icon||"house",[["house","House Mode's icon (the alarm's when House Modes are off)"],["alarm","The alarm state's icon"],["none","No icon"]],t=>this.updStatus(e.id,e=>e.icon=t))}
      ${"none"!==e.icon?this.select("Centered on the card",e.align||"block",[["block","The icon and text together"],["text","The text (the icon to its left)"]],t=>this.updStatus(e.id,e=>e.align="block"===t?void 0:"text")):G}
      ${this.slider("Indent (− left, + right)",e.indent||0,-200,200,2," px",0,t=>this.updStatus(e.id,e=>e.indent=t||void 0),!1)}
      ${"none"!==e.icon?this.toggle("Countdown circle in its place during an exit or entry delay",!!e.countdown,t=>this.updStatus(e.id,e=>e.countdown=t||void 0)):G}
      ${this.group("Lines")}
      <div class="row">
        <select class="add-sel" aria-label="Add a line" @change=${t=>{const s=t.target.value;t.target.value="",s&&this.updStatus(e.id,e=>e.lines=[...e.lines||[],s])}}>
          <option value="">+ Line…</option>
          ${i.map(e=>K`<option value=${e}>${ke[e].label}</option>`)}
        </select>
      </div>
      ${s.map((t,o)=>{var i;return K`<div class="line-row">
        <span>${(null===(i=ke[t])||void 0===i?void 0:i.label)||t}</span>
        <span class="order">
          <button class="icon-btn" title="Move up" aria-label="Move up" ?disabled=${0===o} @click=${()=>a(o,-1)}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
          <button class="icon-btn" title="Move down" aria-label="Move down" ?disabled=${o===s.length-1} @click=${()=>a(o,1)}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
          <button class="icon-btn del" title="Remove" aria-label="Remove" @click=${()=>this.updStatus(e.id,e=>e.lines=(e.lines||[]).filter(e=>e!==t))}><ha-icon icon="mdi:trash-can-outline"></ha-icon></button>
        </span>
      </div>`})}
      ${s.length?G:K`<p class="hint">No lines: only the icon is shown.</p>`}
      ${s.some(e=>e.startsWith("panel_"))?this.displayBody():G}
      ${this.group("Background")}
      ${this.color("Section background",e.background,"Card background","#262626",t=>this.updStatus(e.id,e=>e.background=t))}
      ${this.group("Styles")}
      ${"none"!==e.icon?this.sub("Icon (this section)",K`
            ${this.slider("Size",n.size||0,12,96,1," px",ye.header_icon.size,t=>this.updStatus(e.id,e=>{var s;const o=Object.assign(Object.assign({},(null===(s=e.styles)||void 0===s?void 0:s.header_icon)||{}),{size:t||void 0});e.styles=Object.assign(Object.assign({},e.styles||{}),{header_icon:o})}))}
            ${this.color("Icon color",n.color,"alarm"===e.icon?"Arm mode color":"House Mode color","#9e9e9e",t=>this.updStatus(e.id,e=>{var s;const o=Object.assign(Object.assign({},(null===(s=e.styles)||void 0===s?void 0:s.header_icon)||{}),{color:t});e.styles=Object.assign(Object.assign({},e.styles||{}),{header_icon:o})}),[["mode","alarm"===e.icon?"Arm mode color":"House Mode color"]])}`):G}
      ${s.map(e=>this.textStyle(ke[e].style,o(ke[e].style)))}
      <p class="hint">A style left at "Card default" uses the one under Card → Status text (all Status sections).</p>
    `)}sectionRow(e,t,s){const o=this.cfg,a=e=>{const o=[...s];[o[t],o[t+e]]=[o[t+e],o[t]],this.setStatus(hs(this.layout.sections),o)},i=e.startsWith("menu:")?this.menus.find(t=>`menu:${t.id}`===e):void 0,n=i?void 0:e.startsWith("status:")?this.layout.sections.find(t=>`status:${t.id}`===e):void 0,r=n||i?void 0:He[e];if(!n&&!r&&!i)return G;const l=i||n,c=e=>i?this.updMenu(i.id,e):this.updStatus(n.id,e),d=i?i.name||"Button Menu":n?n.name||"Status":r.title,h=i?(i.buttons||[]).map(e=>e.label||this.sectionTitle(e.section)).join(", ")||"no buttons":n?(n.lines||[]).map(e=>{var t;return null===(t=ke[e])||void 0===t?void 0:t.label.split(" (")[0]}).join(", ")||"icon only":r.hint,p=l?!1!==l.show:!!o[r.show],u=l?!!l.collapsible:!!o[r.collapse],m=l?!1!==l.start_collapsed:!!o[r.start],g=e=>l?c(t=>t.show=!!e&&void 0):this.set(r.show,e),b=e=>l?c(t=>t.start_collapsed=!!e&&void 0):this.set(r.start,e),f=o.popup_sections||[],v=(l?!!l.popup:f.includes(e))?"popup":u?"collapsible":"normal",_=this.menus.filter(t=>!1!==t.show&&(t.buttons||[]).some(t=>t.section===e)),y=_.length?`${_.map(e=>e.name||"Button Menu").join(", ")}: ${_.some(t=>(t.buttons||[]).some(t=>t.section===e&&"toggle"===(t.action||"toggle")))?"shown in place":"popup"}`:"",w=i||n?"All":((e,t)=>{if("keypad"===e){if(!t)return"…";const e=t.keypad;return"all"===e.mode?"All":"off"===e.mode?"Nobody (keypad input is off)":"admins"===e.mode?"Administrators":`Administrators, ${Me(e.users)}`.replace(/, nobody$/,"")}if("alarm"===e){if(!t)return"…";const e=t.alarm;return e.arm_code||e.disarm_code?`Arm: ${e.arm_code?`codes of ${Me(e.arm_users)}`:"All"} · Disarm: ${e.disarm_code?`codes of ${Me(e.disarm_users)}`:"All"}`:"All"}return"All"})(e,this.perms),x=(null==i?void 0:i.embed_in)?this.layout.sections.find(e=>`status:${e.id}`===i.embed_in):void 0,$=x?`Inside ${x.name||"Status"} · ${Se[i.position||"right"]}`:"",k=t=>{if(l)return void c(e=>{e.collapsible="collapsible"===t||void 0,e.popup="popup"===t||void 0});const s="popup"===t?[...f.filter(t=>t!==e),e]:f.filter(t=>t!==e);this.emit(Object.assign(Object.assign({},this.config),{[r.collapse]:"collapsible"===t,popup_sections:s.length?s:void 0}))};return K`<div class="sec-row ${p?"":"hidden"}">
      <ha-icon class="sec-ic" icon=${i?"mdi:gesture-tap-button":n?"mdi:information-outline":{house_modes:"mdi:home-switch-outline",alarm:"mdi:shield-lock-outline",keypad:"mdi:dialpad",history:"mdi:history"}[e]}></ha-icon>
      <div class="sec-text">
        <span class="sec-name">${d}</span>
        ${h?K`<span class="hint inline">${h}</span>`:G}
        ${p&&$?K`<span class="sec-chips"><span class="chip on static" title="Drawn inside the Status section (Place, in its panel)">
              <ha-icon icon="mdi:dock-right"></ha-icon>${$}</span></span>`:p&&y?K`<span class="sec-chips"><span class="chip on static" title="Its button on the Button Menu shows it">
              <ha-icon icon="mdi:gesture-tap-button"></ha-icon>Button on ${y}</span></span>`:p?K`<span class="sec-chips">
              ${["normal","collapsible","popup"].map(e=>K`<button class="chip ${v===e?"on":""}" aria-pressed=${v===e?"true":"false"}
                title=${"normal"===e?"Always shown":"collapsible"===e?"A bar expands and collapses this section":"A bar opens this section in a popup"}
                @click=${()=>k(e)}>
                <ha-icon icon=${"normal"===e?"mdi:view-agenda-outline":"collapsible"===e?"mdi:unfold-less-horizontal":"mdi:open-in-new"}></ha-icon>${"normal"===e?"Normal":"collapsible"===e?"Collapsible":"Popup"}</button>`)}
              ${"collapsible"===v?K`<button class="chip ${m?"on":""}" aria-pressed=${m?"true":"false"}
                    title="Collapsed when the card first appears" @click=${()=>b(!m)}>
                    <ha-icon icon="mdi:arrow-collapse-vertical"></ha-icon>Starts collapsed</button>`:G}
            </span>`:G}
        <span class="perm" title="Who may use this section (all users see every section)"><ha-icon icon="mdi:account-key-outline"></ha-icon>Users: ${w}</span>
      </div>
      <span class="order">
        <button class="icon-btn" title=${p?"Hide":"Show"} aria-label=${`${p?"Hide":"Show"} ${d}`} @click=${()=>g(!p)}>
          <ha-icon icon=${p?"mdi:eye-outline":"mdi:eye-off-outline"}></ha-icon></button>
        <button class="icon-btn" title="Move up" aria-label=${`Move ${d} up`} ?disabled=${0===t} @click=${()=>a(-1)}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
        <button class="icon-btn" title="Move down" aria-label=${`Move ${d} down`} ?disabled=${t===s.length-1} @click=${()=>a(1)}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
        ${i?K`<button class="icon-btn del" title="Delete" aria-label=${`Delete ${d}`} @click=${()=>this.removeMenu(i.id)}><ha-icon icon="mdi:trash-can-outline"></ha-icon></button>`:n?K`<button class="icon-btn del" title="Delete" aria-label=${`Delete ${d}`} @click=${()=>this.removeStatus(n.id)}><ha-icon icon="mdi:trash-can-outline"></ha-icon></button>`:K`<span class="spacer"></span>`}
      </span>
    </div>`}render(){var e,t,s,o,a,i,n,r;if(!this.hass||!this.config)return G;const l=this.cfg,c=Object.assign(Object.assign(Object.assign({},ns),{button_scale_actions:1,button_scale_keypad:1}),this.config.alarm||{}),d=(null===(e=this.data)||void 0===e?void 0:e.alarms)||[],h=(null===(t=this.data)||void 0===t?void 0:t.house.modes)||[],p=this.styleOf("card");return K`<div class="ed">
      <div class="ed-header">
        <ha-icon icon="mdi:shield-home"></ha-icon>
        <span class="ed-header-title">House Modes &amp; Alarm Center Card</span>
        <span class="ed-header-build">v${Qt}</span>
      </div>
      ${this.panel("card","mdi:card-outline","Card","Which alarm the card controls, and the frame around it.",K`
        ${this.group("Alarm")}
        ${this.select("Alarm",l.entity||"",[["","First linked alarm"],...d.map(e=>[e.entity_id,`${e.name} (${e.entity_id})`])],e=>this.set("entity",e||void 0))}
        <div class="row"><span class="lab">Name</span>
          <input class="ctl" type="text" placeholder="Shown when House Modes are off" .value=${l.name||""}
            @change=${e=>this.set("name",e.target.value||void 0)} /></div>
        ${this.group("Frame")}
        ${this.slider("Border width",null!==(s=p.border_width)&&void 0!==s?s:2,0,8,1," px",2,e=>this.setStyle("card","border_width",2===e?void 0:e),!1)}
        ${this.slider("Corner radius",null!==(o=p.radius)&&void 0!==o?o:12,0,32,1," px",12,e=>this.setStyle("card","radius",12===e?void 0:e),!1)}
        ${this.color("Card background",p.background,"Theme card background","#1c1c1c",e=>this.setStyle("card","background",e),[["transparent","Transparent"]])}
        <p class="hint">The card background is the default for every section; a section can set its own below (Header,
          House Mode buttons, Alarm, Physical panel keypad).</p>
        ${this.group("Status text (all Status sections)")}
        ${this.iconStyle("header_icon")}
        ${["mode_name","alarm_name","alarm_state","line1","line2","changing","since"].map(e=>this.textStyle(e))}
        ${this.group("Collapse")}
        ${this.toggle("Collapse the card to its first section (tap it to expand)",l.collapsible,e=>this.set("collapsible",e))}
        ${l.collapsible?this.toggle("Start collapsed",l.start_collapsed,e=>this.set("start_collapsed",e)):G}
        ${this.group("Border")}
        ${this.select("Border color",l.border_color,[["mode","The House Mode's color"],["state","The alarm state (red alarm, orange arming / not ready, mode color armed, green ready)"]],e=>this.set("border_color",e))}
      `)}

      ${this.panel("sections","mdi:view-agenda-outline","Sections","The parts of the card, in order: show or hide each one, make it collapsible, move it up or down.",K`
        <div class="row"><button class="add" @click=${()=>this.addStatus()}>+ Status</button>
          <button class="add" @click=${()=>this.addMenu()}>+ Button Menu</button></div>
        <div class="sec-list">${this.layout.order.map((e,t,s)=>this.sectionRow(e,t,s))}</div>
        <p class="hint">Each section is <em>Normal</em> (always shown), <em>Collapsible</em> (a bar expands and collapses it; <em>Starts collapsed</em> is how it first appears) or a <em>Popup</em> (a bar opens it in a window above the dashboard). The eye shows or hides the section. A section that is a button on a <em>Button Menu</em> is shown by its button instead. <em>Users</em> is who may use the section.</p>
        ${l.collapsible||Object.values(He).some(e=>l[e.collapse])||this.layout.sections.some(e=>e.collapsible)?this.textStyle("alarm_bar",void 0,K`
              ${this.group("Arrow")}
              ${this.toggle("Show the expand / collapse arrow",l.show_chevron,e=>this.set("show_chevron",e))}`):G}
      `)}

      ${this.layout.sections.map(e=>this.statusPanel(e))}
      ${this.menus.map(e=>this.menuPanel(e))}

      ${this.panel("modes","mdi:home-switch-outline","House Mode buttons","One button per House Mode; icons and colors come from the House Modes tab.",l.show_house_modes?K`
          ${this.group("Show")}
          ${this.toggle("Icons",l.show_mode_icons,e=>this.set("show_mode_icons",e))}
          ${this.toggle("Text",l.show_mode_labels,e=>this.set("show_mode_labels",e))}
          ${this.group("Layout")}
          ${this.select("Alignment",l.modes_align,[["grid","Standard (fixed columns, wrap left)"],["center","Center on width"]],e=>this.set("modes_align",e))}
          ${this.slider("Buttons per row",l.columns,2,9,1,"",5,e=>this.set("columns",e),!1)}
          ${this.select("Shape",l.modes_shape,[["rounded","Rounded rectangles"],["round","Round (circle around the icon)"]],e=>this.set("modes_shape",e))}
          ${this.select("Button width",l.modes_width,[["fill","Fill the width (share it equally)"],["fit","Fit the content (centered)"]],e=>this.set("modes_width",e))}
          ${this.slider("Space between buttons",null!==(a=l.modes_gap)&&void 0!==a?a:4,0,24,1," px",4,e=>this.set("modes_gap",4===e?void 0:e),!1)}
          ${this.slider("Button padding",null!==(i=l.modes_padding)&&void 0!==i?i:6,0,20,1," px",6,e=>this.set("modes_padding",6===e?void 0:e),!1)}
          ${h.length?K`${this.group("Buttons shown")}
                <div class="chips">${h.map(e=>{const t=(l.hidden_modes||[]).includes(e.id)||(l.hidden_modes||[]).includes(e.name);return K`<button class="chip ${t?"":"on"}" aria-pressed=${t?"false":"true"}
                    @click=${()=>this.set("hidden_modes",t?(l.hidden_modes||[]).filter(t=>t!==e.id&&t!==e.name):[...l.hidden_modes||[],e.id])}>
                    <ha-icon icon=${e.icon} style=${`color:${e.color}`}></ha-icon>${e.name}</button>`})}</div>`:G}
          ${h.length?this.sub("House Mode colors",K`
                <p class="hint">Each House Mode's color comes from the House Modes tab. Set one here to use a different color
                  on this card only.</p>
                ${h.map(e=>this.color(e.name,(l.mode_colors||{})[e.id],`House Modes tab (${e.color})`,(e=>/^#[0-9a-fA-F]{6}$/.test(e||"")?e:"#9e9e9e")(e.color),t=>this.setMap("mode_colors",e.id,t)))}`):G}
          ${this.sectionBg("modes_section")}
          ${this.group("Styles")}
          ${this.buttonColors("mode_button","mode_icon","House Mode color",{bg:"Card default (transparent)",abg:"Card default (faint gray)",ic:"Card default (secondary text)",aic:"House Mode color"})}
          ${l.show_mode_icons?this.iconStyle("mode_icon"):G}
          ${l.show_mode_labels?this.textStyle("mode_label"):G}`:K`<p class="hint">Turned off under Sections.</p>`)}

      ${this.panel("alarm","mdi:shield-lock-outline","Alarm Panel buttons","Arm and disarm the alarm, enter the code, see why it will not arm.",l.show_alarm?K`
          ${this.group("Show")}
          ${this.toggle("Arm button icons",l.show_arm_icons,e=>this.set("show_arm_icons",e))}
          ${this.toggle("Arm button text",l.show_arm_labels,e=>this.set("show_arm_labels",e))}
          ${this.toggle("Option chips: Skip exit delay, Bypass open sensors",l.show_arm_options,e=>this.set("show_arm_options",e))}
          ${this.group("Arm buttons")}
          ${this.select("Arm mode colors",l.alarm_colors,[["modes","From the House Modes (the mode that sets each arm mode)"],["standard","Standard (green disarmed, red away, orange home, …)"],["theme","Home Assistant theme (alarm state colors)"]],e=>this.set("alarm_colors",e))}
          ${this.sub("Arm mode colors",K`
            <p class="hint">Change one arm mode, or match it to a House Mode's color.</p>
            ${Object.keys(Re).map(e=>this.color(Re[e],(l.arm_colors||{})[e],"From the choice above",Fe[e],t=>this.setMap("arm_colors",e,t),h.map(e=>[`house:${e.id}`,`House Mode: ${e.name}`])))}`)}
          ${this.select("Shape",l.arm_shape,[["rounded","Rounded rectangles"],["round","Round (circle around the icon)"]],e=>this.set("arm_shape",e))}
          ${this.select("Button width",l.arm_width,[["fill","Fill the width (share it equally)"],["fit","Fit the content (centered)"]],e=>this.set("arm_width",e))}
          ${this.slider("Space between buttons",null!==(n=l.arm_gap)&&void 0!==n?n:0,0,24,1," px",0,e=>this.set("arm_gap",0===e?void 0:e),!1)}
          ${this.slider("Button padding",null!==(r=l.arm_padding)&&void 0!==r?r:8,0,20,1," px",8,e=>this.set("arm_padding",8===e?void 0:e),!1)}
          ${this.slider("Arm button scale",Math.round(10*c.button_scale_actions)/10,1,2.5,.1,"×",1,e=>this.setAlarm("button_scale_actions",e),!1)}
          ${this.group("Code entry and messages")}
          ${is.map(e=>this.toggle(rs[e],!!c[e],t=>this.setAlarm(e,t)))}
          ${this.slider("Code keypad scale",Math.round(10*c.button_scale_keypad)/10,1,2.5,.1,"×",1,e=>this.setAlarm("button_scale_keypad",e),!1)}
          ${this.sectionBg("alarm_section")}
          ${this.group("Styles")}
          ${this.buttonColors("arm_button","alarm_icon","Arm mode color",{bg:"Card default (transparent)",abg:"Arm mode color",ic:"Arm mode color",aic:"Card default (white)"})}
          ${l.show_arm_icons?this.iconStyle("alarm_icon"):G}
          ${l.show_arm_labels?this.textStyle("alarm_button"):G}
          ${l.show_arm_options?this.textStyle("chip"):G}`:K`<p class="hint">Turned off under Sections.</p>`)}

      ${this.panel("effects","mdi:shimmer","Effects","Make parts of the card glow or pulse while something is under way: arming, an entry delay, a House Mode change, an alarm.",this.effectsBody())}

      ${this.panel("history","mdi:history","History","House Mode, alarm and physical panel changes, with show / hide checkboxes.",this.historyBody())}

      ${this.panel("keypad","mdi:dialpad","Physical panel keypad","The panel's 12 keys with their functions, sent through the integration.",l.show_panel_keypad?K`
          <p class="hint">Who may use the keys is set in the integration: Alarm panel → Physical Panel → <em>Panel keypad on
            dashboards</em>. Other users see the keys disabled.</p>
          ${this.group("Show")}
          ${this.toggle("Key functions (OFF, AWAY, STAY, …)",l.show_key_labels,e=>this.set("show_key_labels",e))}
          ${this.group("Keys")}
          ${this.select("Shape",l.keypad_shape,[["rounded","Rounded rectangles"],["round","Round"]],e=>this.set("keypad_shape",e))}
          ${this.select("Style",this.keyPreset(),[["filled","Filled (gray keys with a border)"],["outline","Transparent with a border"],["plain","Transparent, no border"],...this.keyPreset()?[]:[["","Custom (the colors below)"]]],e=>this.setKeyPreset(e))}
          ${this.color("Key background",this.styleOf("key_button").background,"Card default (gray)","#2a2a2a",e=>this.setStyle("key_button","background",e),[["transparent","Transparent"]])}
          ${this.color("Key border",this.styleOf("key_button").border,"Card default (divider)","#444444",e=>this.setStyle("key_button","border",e),[["none","None"]])}
          ${this.group("When a key is pressed")}
          ${this.color("Border glows",(l.key_flash||{}).border,"Off","#03a9f4",e=>this.setMap("key_flash","border",e))}
          ${this.color("Background flashes",(l.key_flash||{}).background,"Off","#03a9f4",e=>this.setMap("key_flash","background",e))}
          <p class="hint">For half a second, so you can see the key was sent.</p>
          ${this.sectionBg("keypad_section")}
          ${this.group("Styles")}
          ${this.textStyle("key_digit")}
          ${l.show_key_labels?this.textStyle("key_label"):G}`:K`<p class="hint">Turned off under Sections.</p>`)}
    </div>`}};ps.styles=c`
    .ed {
      /* Font sizes (by role, not by pixel) */
      --ltek-fs-panel-title: 16px;  /* top-level panel / section title */
      --ltek-fs-header: 15px;       /* editor header, panel summary */
      --ltek-fs-group: 14px;        /* group heading inside a panel */
      --ltek-fs-label: 13px;        /* standard field label / row */
      --ltek-fs-body: 12px;         /* body text, most controls */
      --ltek-fs-small: 11px;        /* hints, secondary text */
      --ltek-fs-tiny: 10px;         /* badges, micro-labels */
      /* Font weights */
      --ltek-fw-normal: 400;        /* control labels (recede) */
      --ltek-fw-medium: 500;
      --ltek-fw-semibold: 600;
      --ltek-fw-bold: 700;          /* titles, values (lead) */
      /* Text colors */
      --ltek-c-text: var(--primary-text-color, #e1e1e1);  /* primary */
      --ltek-c-label: #ccc;         /* control labels */
      --ltek-c-muted: #888;         /* hints / disabled */
      --ltek-c-accent: var(--primary-color, #2196F3);
      /* Accent tints — hover / active fills */
      --ltek-c-accent-fade: rgba(var(--rgb-primary-color,33,150,243),0.12);       /* active / pressed fill */
      --ltek-c-accent-fade-soft: rgba(var(--rgb-primary-color,33,150,243),0.08);  /* hover fill */
      --ltek-c-error-fade: rgba(244,67,54,0.15);         /* delete hover fill */
      /* Status colors — defer to the user's theme, fall back to Material. */
      --ltek-c-error: var(--error-color, #f44336);
      --ltek-c-success: var(--success-color, #4caf50);
      --ltek-c-warning: var(--warning-color, #ffb300);
      --ltek-c-info: var(--info-color, #2196F3);
      /* Second accent: the green "library / shared" grouping (NOT tied to --primary-color). */
      --ltek-c-accent-lib: #7fd18a;
      --ltek-c-on-accent: #fff;   /* text/icon on a solid accent fill */
      /* Action icons: neutral idle → brighten on hover; delete uses error on hover. */
      --ltek-c-icon: #aaa;        /* idle action icon */
      --ltek-c-icon-hover: #fff;  /* hovered action icon */
      /* Surfaces */
      --ltek-c-surface: rgba(255,255,255,0.015);        /* panels */
      --ltek-c-surface-raised: rgba(255,255,255,0.02);  /* cards / rows */
      /* Borders */
      --ltek-c-panel-border: #3a3a3a;   /* panels */
      --ltek-c-border: #444;            /* controls */
      --ltek-c-border-soft: #333;       /* subtle inner dividers */
      /* Radii */
      --ltek-r-panel: 12px;   /* panels */
      --ltek-r-card: 10px;    /* section cards */
      --ltek-r-md: 8px;       /* blocks */
      --ltek-r-ctrl: 6px;     /* inputs, selects, buttons */
      /* Spacing scale (4px base) */
      --ltek-sp-1: 4px;  --ltek-sp-2: 6px;  --ltek-sp-3: 8px;
      --ltek-sp-4: 10px; --ltek-sp-5: 12px; --ltek-sp-6: 16px;
      /* Control padding — uniform input/select/button height. */
      --ltek-ctrl-pad: 6px 10px;
      /* Icon sizes (two clear roles; one-off glyphs stay literal). */
      --ltek-icon-sm: 16px;   /* inline / action icons */
      --ltek-icon-lg: 20px;   /* panel-title icons */
      /* Slider row geometry */
      --ltek-slider-val-w: 44px;   /* value readout column width */

      --hmac-ed-theme-accent: var(--accent-color, var(--ltek-c-accent));
      display: flex;
      flex-direction: column;
      gap: 8px;
      color: var(--ltek-c-text);
      font-size: var(--ltek-fs-body);
    }
    /* editor header: icon + name + build, as on the other Ltek cards */
    .ed-header {
      display: flex;
      align-items: center;
      gap: var(--ltek-sp-3);
      padding: 2px 2px 10px;
      border-bottom: 1px solid var(--ltek-c-border-soft);
      margin-bottom: 4px;
    }
    .ed-header ha-icon {
      --mdc-icon-size: 22px;
      color: var(--ltek-c-accent);
    }
    .ed-header-title {
      font-size: var(--ltek-fs-header);
      font-weight: var(--ltek-fw-bold);
      color: var(--ltek-c-text);
    }
    .ed-header-build {
      margin-left: auto;
      font-size: var(--ltek-fs-small);
      color: var(--ltek-c-muted);
      font-family: var(--code-font-family, monospace);
    }
    /* top-level panels: bordered box, accent border when open */
    .panel {
      border: 1px solid var(--ltek-c-panel-border);
      border-radius: var(--ltek-r-panel);
      background: var(--ltek-c-surface);
    }
    .panel[open] {
      border-color: var(--ltek-c-accent);
    }
    summary {
      list-style: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: var(--ltek-sp-3);
    }
    summary::-webkit-details-marker {
      display: none;
    }
    .panel > summary {
      padding: var(--ltek-sp-4) var(--ltek-sp-5);
      font-size: var(--ltek-fs-panel-title);
      font-weight: var(--ltek-fw-bold);
      --mdc-icon-size: var(--ltek-icon-lg);
    }
    .panel > summary > ha-icon:first-child {
      color: var(--ltek-c-accent);
    }
    summary > span {
      flex: 1;
    }
    .chev {
      color: var(--ltek-c-accent);
      transition: transform 0.15s;
      --mdc-icon-size: var(--ltek-icon-lg);
    }
    details[open] > summary > .chev {
      transform: rotate(180deg);
    }
    .body {
      padding: 0 var(--ltek-sp-5) var(--ltek-sp-5);
      display: flex;
      flex-direction: column;
    }
    /* flat sub-panels: no fill, thin top divider; open → accent border, accent UPPERCASE title, inset content */
    .sub {
      border-top: 1px solid var(--ltek-c-border-soft);
      border-radius: 0;
    }
    .sub[open] {
      border: 1px solid var(--hmac-ed-theme-accent);
      border-radius: var(--ltek-r-ctrl);
      margin: var(--ltek-sp-1) 0;
    }
    .sub > summary {
      padding: var(--ltek-sp-3) var(--ltek-sp-2);
      color: var(--ltek-c-accent);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-size: var(--ltek-fs-label);
      font-weight: var(--ltek-fw-semibold);
    }
    .sub-body {
      padding: 0 var(--ltek-sp-4) var(--ltek-sp-4);
    }
    /* group subtitle: theme accent, mixed case, divider (none on the first) */
    .group {
      color: var(--hmac-ed-theme-accent);
      font-size: var(--ltek-fs-group);
      font-weight: var(--ltek-fw-semibold);
      padding-top: var(--ltek-sp-3);
      margin-top: var(--ltek-sp-3);
      border-top: 1px solid var(--ltek-c-border-soft);
    }
    .body > .group:first-of-type,
    .sub-body > .group:first-child,
    .hint + .group {
      border-top: none;
      margin-top: 0;
    }
    .hint {
      color: var(--ltek-c-muted);
      font-size: var(--ltek-fs-small);
      margin: var(--ltek-sp-1) 0 var(--ltek-sp-2);
    }
    .hint.inline {
      margin: 0;
    }
    /* canonical field row: label content width, control right beside it */
    .row {
      display: flex;
      align-items: center;
      gap: var(--ltek-sp-4);
      padding: var(--ltek-sp-1) 0;
      flex-wrap: wrap;
      justify-content: flex-start;
      font-size: var(--ltek-fs-label);
    }
    .lab {
      color: var(--ltek-c-label);
      font-weight: var(--ltek-fw-normal);
    }
    .ctl {
      flex: 1 1 auto;
      min-width: 0;
    }
    .row.check {
      cursor: pointer;
    }
    .row.check input {
      accent-color: var(--ltek-c-accent);
      margin: 0;
    }
    select,
    input[type='text'] {
      font: inherit;
      font-size: var(--ltek-fs-body);
      padding: var(--ltek-ctrl-pad);
      border: 1px solid var(--ltek-c-border);
      border-radius: var(--ltek-r-ctrl);
      background: var(--card-background-color, #1c1c1c);
      color: var(--ltek-c-text);
      max-width: 100%;
    }
    .ctl.color {
      display: flex;
      gap: var(--ltek-sp-3);
      flex-wrap: wrap;
      align-items: center;
    }
    input[type='color'] {
      width: 44px;
      height: 30px;
      padding: 0 2px;
      border: 1px solid var(--ltek-c-border);
      border-radius: var(--ltek-r-ctrl);
      background: none;
    }
    /* slider + readout never break across lines */
    .ctl.nowrap {
      display: flex;
      align-items: center;
      gap: var(--ltek-sp-3);
      flex-wrap: nowrap;
    }
    .ctl.nowrap input[type='range'] {
      flex: 1;
      min-width: 80px;
      accent-color: var(--ltek-c-accent);
    }
    .val {
      width: var(--ltek-slider-val-w);
      text-align: right;
      font-weight: var(--ltek-fw-bold);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    .muted {
      color: var(--ltek-c-muted);
      font-weight: var(--ltek-fw-normal);
    }
    /* Sections panel: raised rows — accent icon, name, hint and chips, then action icons (§2 section rows) */
    .sec-list {
      display: flex;
      flex-direction: column;
      gap: var(--ltek-sp-2);
      padding: var(--ltek-sp-2) 0;
    }
    .sec-row {
      display: flex;
      align-items: center;
      gap: var(--ltek-sp-3);
      padding: 6px 8px;
      border-radius: var(--ltek-r-card);
      background: var(--ltek-c-surface-raised);
      border: 1px solid var(--ltek-c-border-soft);
      font-size: var(--ltek-fs-label);
    }
    .sec-row > .sec-ic {
      --mdc-icon-size: var(--ltek-icon-lg);
      color: var(--ltek-c-accent);
      margin: 0;
    }
    .sec-text {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 2px var(--ltek-sp-3);
    }
    .sec-name {
      font-weight: var(--ltek-fw-normal);
      color: var(--ltek-c-text);
    }
    .sec-chips {
      display: inline-flex;
      gap: var(--ltek-sp-2);
      flex-basis: 100%;
    }
    .sec-chips .chip {
      padding: 1px 8px 1px 5px;
      font-size: var(--ltek-fs-small);
    }
    .sec-row.hidden .sec-name,
    .sec-row.hidden > .sec-ic {
      color: var(--ltek-c-muted);
      opacity: 0.6;
    }
    .line-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ltek-sp-3);
      padding: var(--ltek-sp-1) var(--ltek-sp-2);
      border-top: 1px solid var(--ltek-c-border-soft);
      font-size: var(--ltek-fs-label);
    }
    .add-sel {
      border-style: dashed;
      border-color: var(--ltek-c-accent);
      color: var(--ltek-c-accent);
    }
    .sec-ic {
      --mdc-icon-size: var(--ltek-icon-sm);
      color: var(--ltek-c-accent);
      margin-right: 4px;
      vertical-align: -2px;
    }
    .spacer {
      width: var(--ltek-icon-sm);
    }
    .order {
      display: flex;
      gap: 4px;
      justify-self: end;
    }
    .order .icon-btn:disabled {
      opacity: 0.25;
      cursor: default;
    }
    .sec-row input {
      accent-color: var(--ltek-c-accent);
      margin: 0;
    }
    .row.rep input[type='text'] {
      flex: 1 1 120px;
      min-width: 0;
    }
    .add {
      font: inherit;
      font-size: var(--ltek-fs-body);
      padding: var(--ltek-ctrl-pad);
      border: 1px dashed var(--ltek-c-accent);
      border-radius: var(--ltek-r-ctrl);
      background: none;
      color: var(--ltek-c-accent);
      cursor: pointer;
    }
    .icon-btn {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      color: var(--ltek-c-icon);
      --mdc-icon-size: var(--ltek-icon-sm);
    }
    .icon-btn:hover {
      color: var(--ltek-c-icon-hover);
    }
    .icon-btn.del:hover {
      color: var(--ltek-c-error);
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ltek-sp-2);
      padding: var(--ltek-sp-2) 0;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: var(--ltek-sp-1);
      padding: 3px 10px 3px 6px;
      border-radius: 14px;
      border: 1px solid var(--ltek-c-border);
      background: none;
      color: var(--ltek-c-muted);
      font: inherit;
      font-size: var(--ltek-fs-body);
      cursor: pointer;
      --mdc-icon-size: var(--ltek-icon-sm);
    }
    .chip.on {
      border-color: var(--ltek-c-accent);
      background: var(--ltek-c-accent-fade);
      color: var(--ltek-c-text);
    }
    .chip.warn-chip {
      margin-left: var(--ltek-sp-2);
      padding: 1px 8px 1px 5px;
      font-size: var(--ltek-fs-small);
      border-color: var(--ltek-c-warning, #ff9800);
      color: var(--ltek-c-warning, #ff9800);
    }
    .chip.static {
      cursor: default;
    }
    .perm {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      flex-basis: 100%;
      font-size: var(--ltek-fs-small);
      color: var(--ltek-c-muted);
      --mdc-icon-size: 14px;
    }
    .btn-item {
      border-top: 1px solid var(--ltek-c-border-soft);
      padding-bottom: var(--ltek-sp-2);
    }
    .btn-item .line-row {
      border-top: none;
    }
    .row .add + .add {
      margin-left: var(--ltek-sp-2);
    }
    .chip:not(.on) ha-icon {
      opacity: 0.5;
    }
  `,t([ge({attribute:!1})],ps.prototype,"hass",void 0),t([be()],ps.prototype,"config",void 0),t([be()],ps.prototype,"data",void 0),t([be()],ps.prototype,"perms",void 0),ps=t([pe("house-modes-alarm-center-card-editor")],ps);const us=Qt,ms="house-modes-alarm-center-card",gs=e=>void 0===e?G:e,bs=new Map,fs=new Map,vs=new Map;let _s,ys=class extends de{constructor(){super(...arguments),this.error="",this.collapsed=!1,this.message="",this.busyKey="",this.closed={},this.fetchedFor="",this.requestedAt=0,this.messageTimer=0,this.onFxPreview=()=>this.requestUpdate(),this.changeTimer=0,this.fxRun=!1,this.flashKey="",this.flashTimer=0,this.ctx={avail:[],statusById:new Map,menuById:new Map},this.popup=null,this.histKey="",this.histStamp="",this.histAt=0,this.histTimer=0}static getConfigElement(){return document.createElement(`${ms}-editor`)}static getStubConfig(e){const t=Object.keys(e.states).find(t=>t.startsWith("alarm_control_panel.")&&void 0!==e.states[t].attributes.arm_mode);return{entity:t}}setConfig(e){if(!e)throw new Error("Invalid configuration");if(e.entity&&!e.entity.startsWith("alarm_control_panel."))throw new Error("entity must be an alarm_control_panel of this integration");const t=!this.config;if(this.config=Object.assign(Object.assign({},xe),ot(e)),t){_s&&!this.data&&(this.data=_s);const e=bs.get(this.viewKey);if(e)this.collapsed=e.collapsed,this.closed=Object.assign({},e.closed);else{this.collapsed=!(!this.config.collapsible||!this.config.start_collapsed);const e=this.config;this.closed={};for(const t of["house_modes","alarm","keypad","history"]){const s=He[t];this.closed["house_modes"===t?"modes":t]=!(!e[s.collapse]||!e[s.start])}for(const t of ze(e).sections)this.closed[`status:${t.id}`]=!(!t.collapsible||!1===t.start_collapsed);for(const t of Ce(e))this.closed[`menu:${t.id}`]=!(!t.collapsible||!1===t.start_collapsed);this.saveView()}}this.config.collapsible||(this.collapsed=!1)}get viewKey(){const e=this.config||{},t=ze(e),s=`${t.order.join(",")}|${t.sections.map(e=>e.collapsible?1:0).join("")}|${[e.collapsible,e.modes_collapsible,e.alarm_collapsible,e.keypad_collapsible].map(e=>e?1:0).join("")}`;return`${e.entity||"(first alarm)"}|${s}`}saveView(){bs.set(this.viewKey,{collapsed:this.collapsed,closed:Object.assign({},this.closed)})}freshChange(e){var t;return e?((null===(t=this.changeSeen)||void 0===t?void 0:t.name)!==e&&(this.changeSeen={name:e,at:Date.now()}),Date.now()-this.changeSeen.at>18e4?null:(window.clearTimeout(this.changeTimer),this.changeTimer=window.setTimeout(()=>this.requestUpdate(),18e4-(Date.now()-this.changeSeen.at)+50),e)):(this.changeSeen=void 0,null)}connectedCallback(){super.connectedCallback(),tt.listeners.add(this.onFxPreview)}disconnectedCallback(){super.disconnectedCallback(),tt.listeners.delete(this.onFxPreview)}getCardSize(){var e,t,s,o;if(this.collapsed)return 2;let a=0;return(null===(e=this.config)||void 0===e?void 0:e.show_header)&&(a+=2),(null===(t=this.config)||void 0===t?void 0:t.show_house_modes)&&(a+=2),(null===(s=this.config)||void 0===s?void 0:s.show_alarm)&&(a+=4),(null===(o=this.config)||void 0===o?void 0:o.show_panel_keypad)&&(a+=4),a||2}updated(e){var t;const s=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("dialog.pop");if(s&&!s.open&&s.showModal(),!e.has("hass")||!this.hass)return;this.maybeFetchHistory();const o=this.hass.states["select.house_mode"],a=this.data?this.hass.states[this.data.house.select_entity]:void 0,i=`${null==o?void 0:o.last_updated}|${null==a?void 0:a.last_updated}`;i!==this.fetchedFor&&(this.fetchedFor=i,this.fetch())}async fetch(){try{const e=await this.hass.callWS({type:"house_modes/ext/card/get"});JSON.stringify(e)!==JSON.stringify(this.data)&&(this.data=e),_s=e,this.error="";const t=e.house.last_result,s=e.house.shadow&&"select.house_mode"!==e.house.select_entity;if(this.requestedAt&&(null==t?void 0:t.at)&&Date.parse(t.at)>=this.requestedAt-2e3&&(!s||"shadow"!==t.result)){this.requestedAt=0;const e=((e,t)=>{if(!e)return null;const s=e.requested||"House Mode";switch(e.result){case"blocked":return`${s} not set: ${e.reason||"not allowed now"}`;case"not_ready":return`${s} not set: open ${(e.open||[]).map(t).join(", ")||"zones"}`;case"delayed":return`${s} in ${e.minutes} min`;case"failed":return`${s} failed: ${(e.failed||[]).join(", ")} did not arm`;case"error":return`${s}: ${e.reason||"error"}`;case"shadow":return e.would&&"changed"!==e.would?`Shadow: ${s} would be ${e.would.replace("_"," ")}`:`Shadow: House Modes would set ${s}; nothing was changed`;default:return null}})(t,e=>this.name(e));e&&this.flash(e)}}catch(e){this.error="House Modes & Alarm Center is not installed or not up to date: "+((null==e?void 0:e.message)||e)}}name(e){var t,s,o;return(null===(o=null===(s=null===(t=this.hass)||void 0===t?void 0:t.states[e])||void 0===s?void 0:s.attributes)||void 0===o?void 0:o.friendly_name)||e}flash(e){this.message=e,window.clearTimeout(this.messageTimer),this.messageTimer=window.setTimeout(()=>this.message="",8e3)}get dv(){var e,t,s,o;const a=this.data,i=null===(e=this.config)||void 0===e?void 0:e.mode_colors,n=a.house.display_entity?null===(s=null===(t=this.hass)||void 0===t?void 0:t.states[a.house.display_entity])||void 0===s?void 0:s.state:void 0;if((null===(o=this._dvFor)||void 0===o?void 0:o.d)===a&&this._dvFor.o===i&&this._dvFor.own===n)return this._dvFor.v;let r=(l=a,(c=i)&&Object.keys(c).length?Object.assign(Object.assign({},l),{house:Object.assign(Object.assign({},l.house),{modes:l.house.modes.map(e=>c[e.id]?Object.assign(Object.assign({},e),{color:c[e.id]}):e)})}):l);var l,c;if(n){const e=r.house.modes.find(e=>e.name.toLowerCase()===n.toLowerCase());r=Object.assign(Object.assign({},r),{house:Object.assign(Object.assign({},r.house),{current:e?e.id:null})})}return this._dvFor={d:a,o:i,own:n,v:r},r}arm(e){return((e,t,s,o)=>{const a=Object.assign({},Ue(e,t,s));for(const[t,s]of Object.entries(o||{}))if(s)if(s.startsWith("house:")){const o=e.house.modes.find(e=>e.id===s.slice(6));o&&(a[t]=o.color)}else a[t]=String(s).replace(/[;{}<>]/g,"");return a})(this.dv,e,this.config.alarm_colors,this.config.arm_colors)}get alarmEntity(){var e,t,s,o;return(null===(e=this.config)||void 0===e?void 0:e.entity)||(null===(t=st(this.data,void 0))||void 0===t?void 0:t.alarm_entity)||(null===(o=null===(s=this.data)||void 0===s?void 0:s.alarms[0])||void 0===o?void 0:o.entity_id)}async chooseMode(e){const t=this.data.house.select_entity,s=t.split(".")[0];this.requestedAt=Date.now();try{await this.hass.callService(s,"select_option",{entity_id:t,option:e})}catch(e){this.requestedAt=0,this.flash((null==e?void 0:e.message)||String(e))}}async press(e){this.flashKey="",window.clearTimeout(this.flashTimer),requestAnimationFrame(()=>{this.flashKey=e,this.flashTimer=window.setTimeout(()=>this.flashKey="",500)});const t=st(this.data,this.alarmEntity);if(t){this.busyKey=e;try{await this.hass.callService("house_modes","panel_keypress",{keys:e,entity_id:t.panel_entity})}catch(e){this.flash((null==e?void 0:e.message)||String(e))}finally{this.busyKey=""}}}toggle(){var e;(null===(e=this.config)||void 0===e?void 0:e.collapsible)&&(this.collapsed=!this.collapsed,this.saveView())}moreInfo(e){e&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}render(){var e,t,s;if(!this.config||!this.hass)return G;if(this.error)return K`<ha-card><div class="warn">${this.error}</div></ha-card>`;if(!this.data)return K`<ha-card><div class="loading">…</div></ha-card>`;const o=this.config,a=this.dv.house,i=a.modes.find(e=>e.id===a.current),n=this.alarmEntity,r=st(this.dv,n),l=n?null===(e=this.hass.states[n])||void 0===e?void 0:e.state:void 0,c=r?null===(t=this.hass.states[r.panel_entity])||void 0===t?void 0:t.state:void 0,d=(null==r?void 0:r.ready_entity)?null===(s=this.hass.states[r.ready_entity])||void 0===s?void 0:s.state:void 0,h="state"!==o.border_color&&a.enabled&&i?i.color:((e,t,s,o)=>"triggered"===e||"triggered"===t?"#ff0000":"arming"===e||"pending"===e||"arming"===t||"pending"===t?"#ffa500":e&&it.includes(e)||t&&it.includes(t)?o||"#ff0000":"on"===s?"#008000":"off"===s?"#ffa500":"var(--divider-color)")(l,c,d,null==i?void 0:i.color),p=tt.on?[...Ye]:((e,t,s)=>{const o=[];return"arming"!==e&&"arming"!==t||o.push("arming"),"pending"!==e&&"pending"!==t||o.push("entry"),s&&o.push("changing"),"triggered"!==e&&"triggered"!==t||o.push("triggered"),o})(l,c,this.freshChange(a.changing_to)),u=((e,t)=>{const s=Qe(e,t),o=[...et(null==e?void 0:e.card,s,"fx-card"),...et(null==e?void 0:e.status_icon,s,"fx-status")];return o.length?["fx-on",...o]:[]})(o.effects,p);this.fxRun=Qe(o.effects,p);const m=ze(o),g=new Map(m.sections.map(e=>[`status:${e.id}`,e])),b=Ce(o),f=new Map(b.map(e=>[`menu:${e.id}`,e])),v=(e=>{const t={};for(const s of e)if(!1!==s.show)for(const e of s.buttons||[])e&&e.section&&!e.section.startsWith("menu:")&&("toggle"===(e.action||"toggle")?t[e.section]="toggle":t[e.section]||(t[e.section]="popup"));return t})(b),_=m.order.filter(e=>{const t=o,s=g.get(e);if(s)return!1!==s.show;const i=f.get(e);return i?!1!==i.show:"house_modes"===e?!!t.show_house_modes&&a.enabled:"alarm"===e?!!t.show_alarm&&!!n:"keypad"===e?!!t.show_panel_keypad&&"envisalink"===(null==r?void 0:r.panel_type):"history"===e&&!!t.show_history});this.ctx={avail:_,statusById:g,menuById:f};const y=((e,t)=>{const s={};for(const o of e)o.embed_in&&t.includes(o.embed_in)&&(s[o.embed_in]=s[o.embed_in]||[]).push(o);return s})(b,m.sections.map(e=>`status:${e.id}`)),w=new Set;for(const e of Object.values(y))for(const t of e)w.add(`menu:${t.id}`);this.ctx.embedded=y;const x=_.filter(e=>!w.has(e)&&(!v[e]||"toggle"===v[e]&&!!this.closed[`shown:${e}`])),$=this.collapsed&&o.collapsible?x.slice(0,1):x;return K`
      <ha-card class=${u.join(" ")} style=${`--hmac-border:${h};${Le(o.styles)};${(e=>{const t=[];return(null==e?void 0:e.size)&&t.push(`--fx-size:${Number(e.size)}px`),(null==e?void 0:e.speed)&&t.push(`--fx-speed:${Number(e.speed)}s`),(null==e?void 0:e.color)&&t.push(`--fx-color:${String(e.color).replace(/[;{}<>]/g,"")}`),t.join(";")})(o.effects)}`}>
        ${$.map((e,t)=>{const s=this.renderSectionById(e,0===t,{mode:i,alarmEnt:n,alarmState:l,link:r,status:g.get(e)},v[e]?"normal":void 0);return 0===t&&o.collapsible?K`<div class="first clickable" @click=${this.toggle}>${s}
                ${o.show_chevron?K`<ha-icon class="first-chev" icon=${this.collapsed?"mdi:chevron-down":"mdi:chevron-up"}></ha-icon>`:G}</div>`:s})}
        ${this.message?K`<div class="message" role="status">${this.message}</div>`:G}
      </ha-card>
    `}renderSectionById(e,t,s,o){var a,i,n,r,l;const c=this.config,d=c,h=d.popup_sections||[],p=(e,s)=>o||(t&&c.collapsible?"normal":s?"popup":e?"collapsible":"normal"),u=this.ctx.menuById.get(e);if(u)return K`<div class="sec sec-menu">${this.sectionInner(e,p(!!u.collapsible,!!u.popup),"mdi:gesture-tap-button",void 0,u.name||"Button Menu",()=>this.renderMenu(u,s))}</div>`;if(s.status){const t=s.status;return K`<div class="sec sec-status" style=${[t.background?`--hmac-status-bg:${String(t.background).replace(/[;{}<>]/g,"")}`:"",Le(t.styles)].filter(Boolean).join(";")}>
        ${this.sectionInner(e,p(!!t.collapsible,!!t.popup),(null===(a=s.mode)||void 0===a?void 0:a.icon)||Be[s.alarmState||""]||"mdi:information-outline",null===(i=s.mode)||void 0===i?void 0:i.color,t.name||"Status",()=>this.renderStatus(t,s.mode,s.alarmState,s.link))}</div>`}switch(e){case"house_modes":return this.section("modes",p(!!d.modes_collapsible,h.includes("house_modes")),(null===(n=s.mode)||void 0===n?void 0:n.icon)||"mdi:home-switch",null===(r=s.mode)||void 0===r?void 0:r.color,`House Mode buttons · ${(null===(l=s.mode)||void 0===l?void 0:l.name)||"unknown"}`,()=>this.renderModes());case"alarm":return this.renderAlarm(s.alarmEnt,s.alarmState,p(!!d.alarm_collapsible,h.includes("alarm")));case"keypad":return this.section("keypad",p(!!d.keypad_collapsible,h.includes("keypad")),"mdi:dialpad",void 0,"Panel keypad",()=>this.renderKeypad(s.link));case"history":return this.section("history",p(!!d.history_collapsible,h.includes("history")),"mdi:history",void 0,"History",()=>this.renderHistory());default:return G}}renderStatus(e,t,s,o){var a,i,n,r,l,c;const d=this.config,h=this.dv.house,p=this.alarmEntity,u=p?this.hass.states[p]:void 0,m=null===(a=null==u?void 0:u.attributes)||void 0===a?void 0:a.arm_mode,g=(null==o?void 0:o.keypad_entity)?this.hass.states[o.keypad_entity]:void 0,[b,f]=Ke(null!==(n=null===(i=null==g?void 0:g.attributes)||void 0===i?void 0:i.alpha)&&void 0!==n?n:null==g?void 0:g.state,d.display_strip,d.display_replace),v=s?this.hass.localize(`component.alarm_control_panel.entity_component._.state.${s}`)||s.replace(/_/g," "):"",_="alarm"===e.icon||!h.enabled,y=_?Be[s||""]||"mdi:shield-home":(null==t?void 0:t.icon)||"mdi:shield-home",w=_?this.arm(p)["arming"===s||"pending"===s?m||"":s||""]||"var(--secondary-text-color)":(null==t?void 0:t.color)||"var(--secondary-text-color)",x=Object.assign(Object.assign({},(null===(r=d.styles)||void 0===r?void 0:r.header_icon)||{}),(null===(l=e.styles)||void 0===l?void 0:l.header_icon)||{}),$="arming"===s||"pending"===s,k="none"===e.icon?G:e.countdown&&$&&p?K`<hmac-state-badge class="mode-icon countdown" .hass=${this.hass} .entity=${p}
              style=${`--alarm-state-color:${this.arm(p)[m||""]||"var(--warning-color)"}`}></hmac-state-badge>`:K`<ha-icon class="mode-icon" icon=${y} style=${`color:${fe(x.color,w)||w}`}></ha-icon>`,A=h.changed_at?new Date(h.changed_at):null,S=e=>{var s,o;switch(e){case"house_mode":return h.enabled?t?t.name:"unknown":d.name||v;case"alarm_name":return d.name||(null===(s=null==u?void 0:u.attributes)||void 0===s?void 0:s.friendly_name)||p||"";case"alarm_state":return $&&m?`${v} · ${this.hass.localize(`component.alarm_control_panel.entity_component._.state.${m}`)||m}`:v;case"panel_line1":return g&&b||null;case"panel_line2":return g&&f||null;case"changing":return h.changing_to?`Changing to ${h.changing_to}…`:null;case"since":return A?`since ${A.toLocaleString((null===(o=this.hass.locale)||void 0===o?void 0:o.language)||void 0,{weekday:"short",hour:"2-digit",minute:"2-digit"})}`:null;default:return null}},O=(e.lines||[]).map(e=>[e,S(e)]).filter(([,e])=>null!==e&&""!==e),C=h.shadow&&(e.lines||[]).includes("house_mode"),M=((null===(c=this.ctx.embedded)||void 0===c?void 0:c[`status:${e.id}`])||[]).filter(e=>!1!==e.show);if(M.length){const a=e=>M.filter(t=>(t.position||"right")===e).map(a=>K`<div class="st-menu st-menu-${e}" @click=${e=>e.stopPropagation()}>${this.renderMenu(a,{mode:t,alarmState:s,link:o,alarmEnt:p})}</div>`);return K`<div class="st-wrap">
        ${a("above")}
        <div class="st-row"><div class="st-side st-l">${a("left")}</div>${this.statusHead(o,p,k,O,C,e.align,e.indent)}<div class="st-side st-r">${a("right")}</div></div>
        ${a("below")}
      </div>`}return this.statusHead(o,p,k,O,C,e.align,e.indent)}statusHead(e,t,s,o,a,i,n){const r="text"===i&&s!==G&&o.length>0;return K`
      <div class="head ${r?"align-text":""}" style=${n?`left:${Math.max(-300,Math.min(300,Number(n)||0))}px`:""} @contextmenu=${s=>{s.preventDefault(),this.moreInfo((null==e?void 0:e.keypad_entity)||t)}}>
        ${s}
        ${o.length?K`<div class="head-text">${o.map(([e,t])=>K`<div class="st-line st-${e} ${e.startsWith("panel_")?"lcd-line":""}">${t}</div>`)}</div>`:G}
        ${a?K`<span class="tag" title="House Modes run in Shadow: your automations are in charge">shadow</span>`:G}
      </div>
    `}alarmConfig(e){var t,s,o;const a=this.config,i=a.alarm||{};let n=i.states||{};if("theme"!==a.alarm_colors){const t=this.arm(e);n=Ne([...new Set([...Object.keys(t),...Object.keys(n)])].map(e=>[e,Object.assign({color:t[e]},n[e]||{})]))}return Object.assign(Object.assign(Object.assign(Object.assign({type:"hmac-alarm"},i),{states:n,entity:e}),a.name?{name:a.name}:{}),{show_name:a.show_alarm_name,show_state:a.show_alarm_state,show_icon:a.show_alarm_icon,show_arm_options:a.show_arm_options,show_icons:a.show_arm_icons,show_labels:a.show_arm_labels,shape:a.arm_shape,fit:"fit"===a.arm_width,gap:a.arm_gap,padding:a.arm_padding,button_style:null===(t=a.styles)||void 0===t?void 0:t.arm_button,fx_classes:et(null===(s=a.effects)||void 0===s?void 0:s.arm_button,this.fxRun),icon_style:null===(o=a.styles)||void 0===o?void 0:o.alarm_icon})}section(e,t,s,o,a,i){return K`<div class="sec sec-${e}">${this.sectionInner(e,t,s,o,a,i)}</div>`}sectionInner(e,t,s,o,a,i){if("normal"===t)return i();if("popup"===t)return K`
        <button class="bar" aria-haspopup="dialog" @click=${()=>this.popup=e}>
          <ha-icon icon=${s} style=${o?`color:${o}`:""}></ha-icon>
          <span class="bar-text">${a}</span>
          ${this.config.show_chevron?K`<ha-icon class="bar-chev" icon="mdi:open-in-new"></ha-icon>`:G}
        </button>
        ${this.popup===e?this.popDialog(s,o,a,i):G}`;const n=!!this.closed[e];return K`
      <button class="bar" aria-expanded=${String(!n)} @click=${()=>{this.closed=Object.assign(Object.assign({},this.closed),{[e]:!n}),this.saveView()}}>
        <ha-icon icon=${s} style=${o?`color:${o}`:""}></ha-icon>
        <span class="bar-text">${a}</span>
        ${this.config.show_chevron?K`<ha-icon class="bar-chev" icon=${n?"mdi:chevron-down":"mdi:chevron-up"}></ha-icon>`:G}
      </button>
      ${n?G:i()}
    `}popDialog(e,t,s,o){return K`<dialog class="pop" @close=${()=>this.popup=null} @cancel=${()=>this.popup=null}
      @click=${e=>{e.target===e.currentTarget&&e.currentTarget.close()}}>
      <div class="pop-card">
        <div class="pop-head">
          <ha-icon icon=${e} style=${t?`color:${t}`:""}></ha-icon>
          <span class="pop-title">${s}</span>
          <button class="pop-close" aria-label="Close" @click=${e=>e.currentTarget.closest("dialog").close()}>
            <ha-icon icon="mdi:close"></ha-icon></button>
        </div>
        <div class="pop-body">${o()}</div>
      </div>
    </dialog>`}renderMenu(e,t){var s,o,a,i;const n=this.config,r=n.styles||{},l=(e.buttons||[]).filter(e=>!!e&&!!e.section&&!e.section.startsWith("menu:")&&this.ctx.avail.includes(e.section));if(!l.length){const t=(e.buttons||[]).filter(e=>e&&e.section&&!e.section.startsWith("menu:")).map(e=>{var t;return e.label||Oe(e.section,null===(t=this.ctx.statusById.get(e.section))||void 0===t?void 0:t.name).label});return K`<div class="note menu-empty">${e.name||"Button Menu"}: ${t.length?`${t.join(", ")} ${t.length>1?"are":"is"} turned off or not available. Turn ${t.length>1?"them":"it"} on with the eye in the card editor → Sections.`:"no buttons yet."}</div>`}const c=e.style||"chips",d=!1!==e.show_icons,h=!1!==e.show_labels,p=((e,t)=>Math.max(1,Math.min(9,e.columns||Math.min(5,Math.max(1,t)))))(e,l.length),u="var(--primary-color)",m=e=>{var t;const s=Oe(e.section,null===(t=this.ctx.statusById.get(e.section))||void 0===t?void 0:t.name),o=e.label||s.label,a=e.icon||s.icon,i="popup"===e.action,n=i?`via:${e.section}`:`shown:${e.section}`,l=i?this.popup===n:!!this.closed[n],p=()=>{i?this.popup=n:(this.closed=Object.assign(Object.assign({},this.closed),{[n]:!l}),this.saveView())},m=i?{pop:"dialog"}:{pressed:l?"true":"false"},g=d?K`<ha-icon icon=${a}></ha-icon>`:G,b=h||!d?o:"";switch(c){case"mode":return K`<button class="mode ${l?"on":""}" title=${o} aria-pressed=${gs(m.pressed)} aria-haspopup=${gs(m.pop)}
            style=${`--mode-color:${u};${ve(r.mode_button,r.mode_icon,u)}`} @click=${p}>
            ${d?K`<span class="disc">${g}</span>`:G}${b?K`<span>${b}</span>`:G}</button>`;case"arm":return K`<button class="arm-b ${l?"on":""}" title=${o} aria-pressed=${gs(m.pressed)} aria-haspopup=${gs(m.pop)}
            style=${ve(r.arm_button,r.alarm_icon,u)} @click=${p}>${g}${b?K`<span>${b}</span>`:G}</button>`;case"key":return K`<button class="key ${l?"on":""}" title=${o} aria-pressed=${gs(m.pressed)} aria-haspopup=${gs(m.pop)} @click=${p}>
            ${d?K`<span class="k">${g}</span>`:G}${b?K`<span class=${d?"l":"k"}>${b}</span>`:G}</button>`;default:return K`<button class="mchip ${l?"on":""}" title=${o} aria-pressed=${gs(m.pressed)} aria-haspopup=${gs(m.pop)} @click=${p}>
            ${g}${b?K`<span>${b}</span>`:G}</button>`}},g=r.key_button||{},b="mode"===c?K`<div class="modes ${"fit"===n.modes_width?"fit":""} ${"center"===n.modes_align?"center":""} ${(null===(s=r.mode_button)||void 0===s?void 0:s.text_follows_icon)?"follow":""} ${"round"===n.modes_shape?"round":""}"
            style=${`--cols:${p}${void 0!==n.modes_gap?`;--hmac-modes-gap:${Number(n.modes_gap)}px`:""}${void 0!==n.modes_padding?`;--hmac-modes-pad:${Number(n.modes_padding)}px`:""}`}>${l.map(m)}</div>`:"arm"===c?K`<div class="menu-arm ${"round"===n.arm_shape?"round":""} ${(null===(o=r.arm_button)||void 0===o?void 0:o.text_follows_icon)?"follow":""}"
              style=${[(null===(a=r.arm_button)||void 0===a?void 0:a.track)?`--b-track:${fe(r.arm_button.track,u)};--b-track-opacity:1`:"",void 0!==n.arm_gap?`--b-gap:${Number(n.arm_gap)}px`:""].filter(Boolean).join(";")}>${l.map(m)}</div>`:"key"===c?K`<div class="keypad-wrap"><div class="keys menu-keys ${"round"===n.keypad_shape?"round":""}"
                style=${[`grid-template-columns:repeat(${p},1fr)`,g.background?`--k-bg:${fe(g.background,"")}`:"",g.border?`--k-bd:${fe(g.border,"")}`:""].filter(Boolean).join(";")}>${l.map(m)}</div></div>`:K`<div class="menu-chips">${l.map(m)}</div>`,f=l.find(e=>"popup"===e.action&&this.popup===`via:${e.section}`),v=f?Oe(f.section,null===(i=this.ctx.statusById.get(f.section))||void 0===i?void 0:i.name):void 0;return K`${b}${f?this.popDialog(f.icon||v.icon,void 0,f.label||v.label,()=>this.renderSectionById(f.section,!1,Object.assign(Object.assign({},t),{status:this.ctx.statusById.get(f.section)}),"normal")):G}`}renderAlarm(e,t,s){var o;const a=this.hass.states[e],i=this.arm(e)[("arming"===t||"pending"===t?null===(o=null==a?void 0:a.attributes)||void 0===o?void 0:o.arm_mode:t)||""];return this.section("alarm",s,"mdi:shield-lock-outline",i,"Arm / disarm",()=>K`<hmac-alarm class="alarm-controls" piece="controls" embedded .hass=${this.hass} .cardConfig=${Object.assign(Object.assign({},this.alarmConfig(e)),{part:"controls"})}></hmac-alarm>`)}renderModes(){var e,t,s,o;const a=this.dv.house,i=(n=this.dv,r=this.config.hidden_modes,n.house.modes.filter(e=>!(r||[]).includes(e.id)&&!(r||[]).includes(e.name)));var n,r;const l=a.changing_to?null===(e=a.modes.find(e=>e.name===a.changing_to))||void 0===e?void 0:e.id:a.current,c=et(null===(t=this.config.effects)||void 0===t?void 0:t.mode_button,this.fxRun||tt.on).join(" ");return K`
      <div class="modes ${"fit"===this.config.modes_width?"fit":""} ${"center"===this.config.modes_align?"center":""} ${(null===(o=null===(s=this.config.styles)||void 0===s?void 0:s.mode_button)||void 0===o?void 0:o.text_follows_icon)?"follow":""} ${"round"===this.config.modes_shape?"round":""}"
        style=${`--cols:${Math.max(1,Math.min(9,this.config.columns||5))}${void 0!==this.config.modes_gap?`;--hmac-modes-gap:${Number(this.config.modes_gap)}px`:""}${void 0!==this.config.modes_padding?`;--hmac-modes-pad:${Number(this.config.modes_padding)}px`:""}`}>
        ${i.map(e=>{const t=e.id===a.current,s=this.config.styles||{},o=e.id===l;return K`<button class="mode fxe ${t?"on":""} ${o?c:""}" aria-pressed=${t?"true":"false"} title=${e.name}
              style=${`--mode-color:${e.color};${ve(s.mode_button,s.mode_icon,e.color)}`}
              @click=${()=>this.chooseMode(e.name)}>
              ${this.config.show_mode_icons?K`<span class="disc"><ha-icon icon=${e.icon}></ha-icon></span>`:G}
              ${this.config.show_mode_labels?K`<span>${e.name}</span>`:G}
            </button>`})}
      </div>
    `}historyEntities(){var e;const t=dt(null===(e=this.config)||void 0===e?void 0:e.history),s=this.alarmEntity,o=this.data?st(this.data,s):void 0,a={};return t.kinds.includes("house")&&(a.house=t.house_entity||"select.house_mode"),t.kinds.includes("alarm")&&s&&(a.alarm=s),t.kinds.includes("panel")&&(null==o?void 0:o.panel_entity)&&(a.panel=o.panel_entity),a}maybeFetchHistory(){var e;if(!(null===(e=this.config)||void 0===e?void 0:e.show_history)||!this.hass)return;const t=this.historyEntities(),s=dt(this.config.history),o=`${JSON.stringify(t)}|${s.days}|${pt(s.days)}`,a=Object.values(t).map(e=>{var t;return(null===(t=this.hass.states[e])||void 0===t?void 0:t.last_changed)||""}).join("|");if(o===this.histKey&&a===this.histStamp)return;o!==this.histKey&&vs.has(o)&&(this.histRows=vs.get(o)),this.histKey=o,this.histStamp=a;const i=Math.max(0,this.histAt+1e4-Date.now());window.clearTimeout(this.histTimer),this.histTimer=window.setTimeout(()=>this.fetchHistory(o,t,s.days,s.hide_short),i)}async fetchHistory(e,t,s,o){var a;const i=Object.values(t).filter(Boolean);if(!i.length)return void(this.histRows=[]);this.histAt=Date.now();const n=pt(s);try{const s=await this.hass.callWS({type:"history/history_during_period",start_time:new Date(1e3*n).toISOString(),entity_ids:i,minimal_response:!0,no_attributes:!0,significant_changes_only:!1}),r={};for(const e of nt)t[e]&&(r[e]=s[t[e]]||[]);const l=((null===(a=this.data)||void 0===a?void 0:a.house.history)||[]).filter(e=>e.at).map(e=>({at:Date.parse(e.at)/1e3,to:e.to,source:e.source})),c=((e,t)=>{const s=[];for(const o of nt){const a=(e[o]||[]).map(e=>{var t,s;return{state:e.s,t:null!==(s=null!==(t=e.lc)&&void 0!==t?t:e.lu)&&void 0!==s?s:0}}).filter(e=>!ht.includes(e.state)).sort((e,t)=>e.t-t.t),i=[];for(const e of a)i.length&&i[i.length-1].state===e.state||i.push(e);i.forEach((e,a)=>{const n=a+1<i.length?i[a+1].t:null;s.push({kind:o,state:e.state,start:Math.max(e.t,t.since),end:n})})}const o=t.hide_short||0,a=s.filter(e=>null===e.end||!o||e.end-e.start>=o);if(t.sources)for(const e of a)if("house"===e.kind){const s=t.sources.find(t=>t.to.toLowerCase()===e.state.toLowerCase()&&Math.abs(t.at-e.start)<10);s&&(e.source=s.source)}return a.sort((e,t)=>t.start-e.start||nt.indexOf(e.kind)-nt.indexOf(t.kind))})(r,{since:n,hide_short:o,sources:l});if(e!==this.histKey)return;this.histRows=c,vs.set(e,c)}catch(e){this.histRows=this.histRows||[],this.error=`History: ${(null==e?void 0:e.message)||e}`}}historyState(e,t){if("house"===e){const e=this.dv.house.modes.find(e=>e.name.toLowerCase()===t.toLowerCase());return{label:(null==e?void 0:e.name)||t,icon:(null==e?void 0:e.icon)||"mdi:home-switch",color:null==e?void 0:e.color}}const s=this.alarmEntity,o=s?this.arm(s):{},a=(Re[t]||t).replace(/^Armed\s+/i,"");return{label:a.charAt(0).toUpperCase()+a.slice(1),icon:Be[t]||"mdi:shield-outline",color:o[t]}}renderHistory(){const e=dt(this.config.history),t=this.viewKey,s=this.histShown||fs.get(t)||e.shown.filter(t=>e.kinds.includes(t)),o=this.histRows;if(!o)return K`<div class="hist-empty">Loading…</div>`;const a=this.historyEntities(),i=nt.filter(e=>a[e]),n=Ne(i.map(e=>[e,o.filter(t=>t.kind===e).length])),r=o.filter(e=>s.includes(e.kind)).slice(0,e.max_rows),l=Date.now()/1e3,c=(e,o)=>{const a=o?[...s,e]:s.filter(t=>t!==e);this.histShown=a,fs.set(t,a)},d=e=>new Date(1e3*e).toLocaleTimeString(void 0,{hour:"numeric",minute:"2-digit"}),h=s.length>1;return K`<div class="hist">
      ${e.show_filters&&i.length>1?K`<div class="hist-filters">${i.map(e=>K`<label><input type="checkbox" .checked=${s.includes(e)}
            @change=${t=>c(e,t.target.checked)} />${lt[e]} <span class="dim">(${n[e]})</span></label>`)}</div>`:G}
      ${r.length?K`<div class="hist-grid ${e.show_day?"":"no-day"} ${e.show_duration?"":"no-dur"}">
            <span></span><span></span>${e.show_day?K`<span class="hh">Day</span>`:G}<span class="hh">Start</span><span class="hh">End</span>
            ${e.show_duration?K`<span class="hh r">Duration</span>`:G}
            ${r.map((t,s)=>{var o;const a=this.historyState(t.kind,t.state),i=null===t.end,n=[h?lt[t.kind]:"",e.show_source&&t.source?rt[t.source]||t.source:""].filter(Boolean).join(" · ");return K`
                <ha-icon class="hi" icon=${a.icon} style=${a.color?`color:${a.color}`:""}></ha-icon>
                <span class="hn ${i?"cur":""}" style=${a.color?`color:${a.color}`:""}>${a.label}${n?K`<span class="hs">${n}</span>`:G}</span>
                ${e.show_day?K`<span class="hd ${i?"cur":""}">${((e,t)=>{const s=e=>{const t=new Date(1e3*e);return new Date(t.getFullYear(),t.getMonth(),t.getDate()).getTime()},o=Math.round((s(t)-s(e))/864e5);return 0===o?"Today":1===o?"Yest":new Date(1e3*e).toLocaleDateString(void 0,{month:"short",day:"numeric"})})(t.start,l)}</span>`:G}
                <span class="ht ${i?"cur":""}">${d(t.start)}</span>
                <span class="ht ${i?"cur":""}">${i?"Now":d(t.end)}</span>
                ${e.show_duration?K`<span class="ht r ${i?"cur":""}">${(e=>{const t=Math.max(0,Math.round(e)),s=Math.floor(t/86400),o=Math.floor(t%86400/3600),a=Math.floor(t%3600/60);return s?`${s}d ${o}h`:o?`${o}h ${a}m`:a?`${a}m`:`${t}s`})((null!==(o=t.end)&&void 0!==o?o:l)-t.start)}</span>`:G}
                ${s<r.length-1?K`<span class="hl"></span>`:G}`})}
          </div>`:K`<div class="hist-empty">${s.length?e.days?`Nothing today or in the ${e.days} day${1===e.days?"":"s"} before.`:"Nothing today.":"Tick what to show."}</div>`}
    </div>`}renderKeypad(e){var t;const s=this.dv.keypad,o=this.config.key_flash||{},a=(null===(t=this.config.styles)||void 0===t?void 0:t.key_button)||{},i=[o.border?`--kf-bd:${fe(o.border,"")}`:"",o.background?`--kf-bg:${fe(o.background,"")}`:"",a.background?`--k-bg:${fe(a.background,"")}`:"",a.border?`--k-bd:${fe(a.border,"")}`:""].filter(Boolean).join(";"),n=s.blocked_keys||"";return K`
      <div class="keypad-wrap">
        ${!this.config.show_header&&e.keypad_entity?(()=>{var t,s;const o=this.hass.states[e.keypad_entity],[a,i]=Ke(null!==(s=null===(t=null==o?void 0:o.attributes)||void 0===t?void 0:t.alpha)&&void 0!==s?s:null==o?void 0:o.state,this.config.display_strip,this.config.display_replace);return K`<div class="lcd big"><div>${a||" "}</div><div>${i||" "}</div></div>`})():G}
        ${s.allowed?G:K`<div class="note">Panel keypad: ${s.reason}</div>`}
        <div class="keys ${"round"===this.config.keypad_shape?"round":""} ${o.border?"fl-bd":""} ${o.background?"fl-bg":""}" style=${i}>
          ${(r=this.config.keypad_labels,We.map(([e,t])=>[e,r&&e in r?r[e]:t])).map(([e,t])=>K`
            <button class="key ${this.flashKey===e?"flash":""}" ?disabled=${!s.allowed||n.includes(e)||this.busyKey===e}
              aria-label=${t?`${e} ${t}`:e} @click=${()=>this.press(e)}>
              <span class="k">${e}</span>${t&&this.config.show_key_labels?K`<span class="l">${t}</span>`:G}
            </button>`)}
        </div>
      </div>
    `;var r}};ys.styles=c`
    dialog.pop {
      padding: 0;
      border: none;
      background: transparent;
      max-width: min(560px, 94vw);
      width: 100%;
    }
    dialog.pop::backdrop {
      background: rgba(0, 0, 0, 0.55);
    }
    .pop-card {
      background: var(--ha-card-background, var(--card-background-color, #1c1c1c));
      color: var(--primary-text-color);
      border-radius: var(--ha-card-border-radius, 12px);
      border: 1px solid var(--hmac-border, var(--divider-color));
      max-height: 85vh;
      overflow: auto;
    }
    .pop-head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 8px 6px 16px;
      position: sticky;
      top: 0;
      background: inherit;
      --mdc-icon-size: 20px;
    }
    .pop-title {
      flex: 1;
      font-weight: 500;
    }
    .pop-close {
      border: none;
      background: none;
      color: var(--secondary-text-color);
      cursor: pointer;
      padding: 4px;
    }
    .pop-body {
      padding: 0 0 8px;
    }
    .hist {
      padding: 4px 16px 12px;
    }
    .hist-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 14px;
      font-size: 13px;
      padding: 0 0 6px;
    }
    .hist-filters label {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
    }
    .hist-filters input {
      accent-color: var(--primary-color);
    }
    .hist-grid {
      display: grid;
      grid-template-columns: 28px minmax(96px, 1fr) auto auto auto auto;
      align-items: center;
      column-gap: 10px;
      row-gap: 0;
      font-size: 14px;
    }
    .hist-grid.no-day,
    .hist-grid.no-dur {
      grid-template-columns: 28px minmax(96px, 1fr) auto auto auto;
    }
    .hist-grid.no-day.no-dur {
      grid-template-columns: 28px minmax(96px, 1fr) auto auto;
    }
    .hist-grid .hh {
      color: var(--hmac-history-head, var(--success-color, #4caf50));
      font-size: 12px;
      text-align: center;
      padding-bottom: 4px;
    }
    .hist-grid .r {
      text-align: right;
    }
    .hist-grid .hi {
      --mdc-icon-size: 24px;
      padding: 6px 0;
    }
    .hist-grid .hn {
      display: flex;
      flex-direction: column;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .hist-grid .hs {
      font-size: 11px;
      color: var(--secondary-text-color);
    }
    .hist-grid .hd,
    .hist-grid .ht {
      text-align: center;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .hist-grid .ht.r {
      text-align: right;
    }
    .hist-grid .cur {
      font-weight: 700;
      color: var(--primary-text-color);
    }
    .hist-grid .hn.cur {
      font-weight: 700;
    }
    .hist-grid .hl {
      grid-column: 1 / -1;
      border-top: 1px solid var(--divider-color);
      opacity: 0.4;
    }
    .hist-empty {
      padding: 6px 16px 12px;
      color: var(--secondary-text-color);
    }
    .dim {
      color: var(--secondary-text-color);
    }
    /* Effects (from the Easy Thermostat Styler Card, without the moving backgrounds): fx-on while something is under
       way, fx-<part>-glow / -pulse per part. --fx-c is the effect color (default: the border's state color). */
    ha-card {
      --fx-size: 16px;
      --fx-speed: 1.6s;
      --fx-c: var(--fx-color, var(--hmac-border, var(--primary-color)));
    }
    /* the card: border glow / pulse (box-shadow), background glow / pulse (a tint overlay) */
    ha-card.fx-card-border-glow {
      box-shadow: 0 0 var(--fx-size) calc(var(--fx-size) / 6) color-mix(in srgb, var(--fx-c) 55%, transparent);
    }
    ha-card.fx-card-border-pulse {
      animation: hmac-fx-border var(--fx-speed) ease-in-out infinite;
    }
    ha-card.fx-card-border-glow.fx-card-border-pulse {
      animation-name: hmac-fx-border-strong;
    }
    ha-card {
      position: relative;
    }
    ha-card::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: var(--fx-c);
      opacity: 0;
      pointer-events: none;
    }
    ha-card.fx-card-background-glow::after {
      opacity: 0.12;
    }
    ha-card.fx-card-background-pulse::after {
      animation: hmac-fx-tint var(--fx-speed) ease-in-out infinite;
    }
    ha-card.fx-card-background-glow.fx-card-background-pulse::after {
      animation-name: hmac-fx-tint-strong;
    }
    /* the status icon */
    ha-card.fx-status-icon-glow .mode-icon {
      filter: drop-shadow(0 0 calc(var(--fx-size) / 3) var(--fx-c)) drop-shadow(0 0 calc(var(--fx-size) / 6) var(--fx-c));
    }
    ha-card.fx-status-icon-pulse .mode-icon {
      animation: hmac-fx-icon var(--fx-speed) ease-in-out infinite;
    }
    /* a House Mode button (.fxe) in its own color: background, border, icon */
    .mode.fxe {
      position: relative;
      --fx-own: var(--mode-color, var(--fx-c));
    }
    .mode.fxe::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: var(--fx-own);
      opacity: 0;
      pointer-events: none;
    }
    .modes.round .mode.fxe::after {
      display: none;
    }
    .mode.fx-background-glow::after,
    .modes.round .mode.fx-background-glow .disc {
      opacity: 0.22;
    }
    .modes.round .mode.fx-background-glow .disc {
      opacity: 1;
      background-color: color-mix(in srgb, var(--fx-own) 30%, transparent);
    }
    .mode.fx-background-pulse::after {
      animation: hmac-fx-tint var(--fx-speed) ease-in-out infinite;
    }
    .mode.fx-background-glow.fx-background-pulse::after {
      animation-name: hmac-fx-tint-strong;
    }
    .mode.fx-border-glow,
    .modes.round .mode.fx-border-glow .disc {
      box-shadow: 0 0 var(--fx-size) calc(var(--fx-size) / 8) color-mix(in srgb, var(--fx-own) 55%, transparent);
    }
    .modes.round .mode.fx-border-glow {
      box-shadow: none;
    }
    .mode.fx-border-pulse,
    .modes.round .mode.fx-border-pulse .disc {
      animation: hmac-fx-ring var(--fx-speed) ease-out infinite;
    }
    .modes.round .mode.fx-border-pulse {
      animation: none;
    }
    .mode.fx-border-glow.fx-border-pulse,
    .modes.round .mode.fx-border-glow.fx-border-pulse .disc {
      animation-name: hmac-fx-ring-glow;
    }
    .modes.round .mode.fx-border-glow.fx-border-pulse {
      animation: none;
    }
    .mode.fx-icon-glow ha-icon {
      filter: drop-shadow(0 0 calc(var(--fx-size) / 3) var(--fx-own)) drop-shadow(0 0 calc(var(--fx-size) / 6) var(--fx-own));
    }
    .mode.fx-icon-pulse ha-icon {
      animation: hmac-fx-icon var(--fx-speed) ease-in-out infinite;
    }
    @keyframes hmac-fx-tint {
      0%, 100% { opacity: 0; }
      50% { opacity: 0.3; }
    }
    @keyframes hmac-fx-tint-strong {
      0%, 100% { opacity: 0.12; }
      50% { opacity: 0.4; }
    }
    @keyframes hmac-fx-ring {
      0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--fx-own, var(--fx-c)) 60%, transparent); }
      70%, 100% { box-shadow: 0 0 0 calc(var(--fx-size) / 2) color-mix(in srgb, var(--fx-own, var(--fx-c)) 0%, transparent); }
    }
    @keyframes hmac-fx-ring-glow {
      0% { box-shadow: 0 0 var(--fx-size) calc(var(--fx-size) / 8) color-mix(in srgb, var(--fx-own, var(--fx-c)) 55%, transparent), 0 0 0 0 color-mix(in srgb, var(--fx-own, var(--fx-c)) 60%, transparent); }
      70%, 100% { box-shadow: 0 0 var(--fx-size) calc(var(--fx-size) / 8) color-mix(in srgb, var(--fx-own, var(--fx-c)) 55%, transparent), 0 0 0 calc(var(--fx-size) / 2) color-mix(in srgb, var(--fx-own, var(--fx-c)) 0%, transparent); }
    }
    @keyframes hmac-fx-border {
      0%, 100% { box-shadow: 0 0 0 0 transparent; }
      50% { box-shadow: 0 0 calc(var(--fx-size) * 1.2) 0 color-mix(in srgb, var(--fx-c) 60%, transparent); }
    }
    @keyframes hmac-fx-border-strong {
      0%, 100% { box-shadow: 0 0 calc(var(--fx-size) * 0.6) 0 color-mix(in srgb, var(--fx-c) 45%, transparent); }
      50% { box-shadow: 0 0 calc(var(--fx-size) * 1.8) calc(var(--fx-size) / 6) color-mix(in srgb, var(--fx-c) 80%, transparent); }
    }
    @keyframes hmac-fx-icon {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.15); opacity: 0.75; }
    }
    @media (prefers-reduced-motion: reduce) {
      ha-card,
      ha-card * {
        animation: none !important;
      }
    }
    ha-card {
      overflow: hidden;
      border: var(--hmac-border-width, 2px) solid var(--hmac-border, var(--divider-color));
      border-radius: var(--hmac-radius, var(--ha-card-border-radius, 12px));
      background: var(--hmac-card-bg, var(--ha-card-background, var(--card-background-color, #1c1c1c)));
    }
    /* section backgrounds (unset: the card background shows through) */
    .sec-modes {
      background: var(--hmac-modes-bg, transparent);
    }
    .sec-alarm {
      background: var(--hmac-alarm-bg, transparent);
    }
    .sec-alarm_status {
      background: var(--hmac-alarm_status-bg, transparent);
    }
    .sec-keypad {
      background: var(--hmac-keypad-bg, transparent);
    }
    /* icon + text centered together, as in a button-card header: 48 px icon, 12 px gap, the pair nudged 10 px left
       so the text (not the icon) sits near the middle */
    .head {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 10px 0;
      min-height: 70px;
    }
    /* Button Menus inside a Status section */
    /* the icon and text stay in the middle of the card; the buttons sit at its edges */
    .st-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
      align-items: center;
    }
    /* no width limit on the text here: in the middle column it would make the box narrower than its lines */
    .st-row > .head > .head-text {
      max-width: none;
    }
    .st-row > .head {
      padding-right: 0;
    }
    .st-side {
      display: flex;
      gap: 6px;
    }
    .st-l {
      justify-content: flex-start;
      padding-left: 10px;
    }
    .st-r {
      justify-content: flex-end;
      padding-right: 10px;
    }
    /* left / right: the menu's own buttons stacked in a column (direct children only: a popup it opens is drawn in
       here too, and its keypad, buttons and chips keep their own layout) */
    .st-menu-left > .menu-chips,
    .st-menu-right > .menu-chips {
      flex-direction: column;
      align-items: stretch;
      padding: 6px 0;
    }
    .st-menu-left > .menu-arm,
    .st-menu-right > .menu-arm {
      flex-direction: column;
      margin: 6px 0;
    }
    .st-menu-left > .modes,
    .st-menu-right > .modes,
    .st-menu-left > .keypad-wrap > .keys,
    .st-menu-right > .keypad-wrap > .keys {
      display: flex;
      flex-direction: column;
      padding: 6px 0;
    }
    .st-menu-left > .keypad-wrap,
    .st-menu-right > .keypad-wrap {
      padding: 0;
    }
    .st-menu-left > .keypad-wrap > .keys > .key,
    .st-menu-right > .keypad-wrap > .keys > .key {
      min-width: 46px;
      padding: 0 10px;
    }
    /* center the text on the card: icon · text · an empty column as wide as the icon's */
    .head.align-text {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
      column-gap: 12px;
      padding-right: 0;
    }
    .head.align-text > .mode-icon {
      justify-self: end;
    }
    .head.align-text > .head-text {
      max-width: none;
    }
    .head.clickable {
      cursor: pointer;
    }
    /* a box (ha-icon is inline in Home Assistant): its middle is the text block's middle */
    .mode-icon {
      --mdc-icon-size: var(--hmac-header-icon-size, 48px);
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--hmac-header-icon-size, 48px);
      height: var(--hmac-header-icon-size, 48px);

      flex: none;
      line-height: 0;
    }
    .head-text {
      flex: none;
      text-align: center;
      min-width: 0;
      max-width: calc(100% - 80px);
    }
    .mode-name {
      font-family: var(--hmac-mode-name-font, var(--code-font-family, monospace));
      font-size: var(--hmac-mode-name-size, 22px);
      font-weight: var(--hmac-mode-name-weight, 400);
      font-style: var(--hmac-mode-name-style, normal);
      text-transform: var(--hmac-mode-name-transform, uppercase);
      letter-spacing: 0.06em;
      line-height: 1.25;
      color: var(--hmac-mode-name-color, var(--primary-text-color));
    }
    /* top-right corner, so it never pushes the centered text */
    .tag {
      position: absolute;
      top: 8px;
      right: 12px;
      font-size: 0.7em;
      padding: 1px 6px;
      border-radius: 8px;
      border: 1px solid var(--secondary-text-color);
      color: var(--secondary-text-color);
    }
    .head.chevron .tag {
      right: 40px;
    }
    .lcd {
      line-height: 1.6;
      margin-top: 2px;
    }
    .line1,
    .line2 {
      white-space: pre;
      font-family: var(--hmac-f, var(--code-font-family, monospace));
      font-size: var(--hmac-s, 14px);
      font-weight: var(--hmac-w, 400);
      font-style: var(--hmac-i, normal);
      text-transform: var(--hmac-t, none);
      color: var(--hmac-c, var(--primary-text-color));
    }
    .line1 {
      --hmac-f: var(--hmac-line1-font); --hmac-s: var(--hmac-line1-size); --hmac-w: var(--hmac-line1-weight);
      --hmac-i: var(--hmac-line1-style); --hmac-t: var(--hmac-line1-transform); --hmac-c: var(--hmac-line1-color);
    }
    .line2 {
      --hmac-f: var(--hmac-line2-font); --hmac-s: var(--hmac-line2-size); --hmac-w: var(--hmac-line2-weight);
      --hmac-i: var(--hmac-line2-style); --hmac-t: var(--hmac-line2-transform); --hmac-c: var(--hmac-line2-color);
    }
    .lcd.big {
      font-size: 1em;
      text-align: center;
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      margin-bottom: 8px;
    }
    .chev {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--secondary-text-color);
    }
    .message {
      margin: 0 12px 8px;
      padding: 6px 10px;
      border-left: 3px solid var(--warning-color, #ff9800);
      background: rgba(255, 152, 0, 0.1);
      font-size: 0.9em;
    }
    .modes {
      display: grid;
      grid-template-columns: repeat(var(--cols, 5), 1fr);
      gap: var(--hmac-modes-gap, 4px);
      padding: 4px 8px 8px;
    }
    /* 'center': same button width, every row (the last one too) centered across the card */
    .modes.center {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    .modes.center .mode {
      flex: 0 0 calc((100% - (var(--cols, 5) - 1) * var(--hmac-modes-gap, 4px)) / var(--cols, 5));
    }
    .mode {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: var(--hmac-modes-pad, 6px) 2px;
      background: var(--b-bg, none);
      border: 1px solid var(--b-bd, transparent);
      border-radius: 10px;
      box-sizing: border-box;
      cursor: pointer;
      color: var(--secondary-text-color);
      font: inherit;
    }
    .mode ha-icon {
      --mdc-icon-size: var(--hmac-mode-icon-size, 36px);
      color: var(--b-ic, var(--secondary-text-color));
    }
    .mode.on ha-icon {
      color: var(--b-aic, var(--mode-color));
    }
    .disc {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    /* fit: buttons as wide as their content, centered, the space between them is the gap */
    .modes.fit {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    .modes.fit .mode,
    .modes.fit.center .mode {
      flex: 0 0 auto;
      padding-left: calc(var(--hmac-modes-pad, 6px) + 4px);
      padding-right: calc(var(--hmac-modes-pad, 6px) + 4px);
    }
    /* the countdown circle in place of the header icon */
    hmac-state-badge.countdown {
      --hmac-badge-size: var(--hmac-header-icon-size, 48px);
      display: block;
      position: relative;
    }
    /* round: a circle around the icon carries the background and border, the text sits below */
    .modes.round .mode,
    .modes.round .mode.on {
      background: none;
      border-color: transparent;
    }
    .modes.round .disc {
      width: calc(var(--hmac-mode-icon-size, 36px) * 1.6);
      height: calc(var(--hmac-mode-icon-size, 36px) * 1.6);
      border-radius: 50%;
      background: var(--b-bg, rgba(127, 127, 127, 0.08));
      box-shadow: inset 0 0 0 1px var(--b-bd, transparent);
      box-sizing: border-box;
    }
    .modes.round .mode.on .disc {
      background: var(--b-abg, rgba(127, 127, 127, 0.2));
      box-shadow: inset 0 0 0 1px var(--b-abd, var(--b-bd, transparent));
    }
    .modes.round .mode ha-icon {
      --mdc-icon-size: calc(var(--hmac-mode-icon-size, 36px) * 0.8);
    }
    /* text follows the icon color */
    .modes.follow .mode span {
      color: var(--b-ic, var(--secondary-text-color));
    }
    .modes.follow .mode.on span {
      color: var(--b-aic, var(--mode-color));
    }
    .mode span {
      font-family: var(--hmac-mode-label-font, inherit);
      font-size: var(--hmac-mode-label-size, 10px);
      font-weight: var(--hmac-mode-label-weight, 400);
      font-style: var(--hmac-mode-label-style, normal);
      text-transform: var(--hmac-mode-label-transform, none);
      color: var(--hmac-mode-label-color, inherit);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    .mode.on {
      color: var(--primary-text-color);
      background: var(--b-abg, rgba(127, 127, 127, 0.12));
      border-color: var(--b-abd, var(--b-bd, transparent));
    }
    .mode:focus-visible,
    .key:focus-visible {
      outline: 2px solid var(--primary-color);
    }
    .keypad-wrap {
      padding: 4px 12px 12px;
    }
    .note {
      font-size: 0.85em;
      color: var(--secondary-text-color);
      margin-bottom: 6px;
    }
    .keys {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
    }
    .key {
      height: 46px;
      border-radius: 10px;
      border: 1px solid var(--k-bd, var(--divider-color));
      background: var(--k-bg, var(--secondary-background-color, rgba(127, 127, 127, 0.08)));
      color: var(--primary-text-color);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font: inherit;
    }
    .key .k {
      font-family: var(--hmac-key-digit-font, inherit);
      font-size: var(--hmac-key-digit-size, 16px);
      font-weight: var(--hmac-key-digit-weight, 400);
      font-style: var(--hmac-key-digit-style, normal);
      color: var(--hmac-key-digit-color, inherit);
      line-height: 1;
    }
    .key .l {
      font-family: var(--hmac-key-label-font, inherit);
      font-size: var(--hmac-key-label-size, 10px);
      font-weight: var(--hmac-key-label-weight, 400);
      font-style: var(--hmac-key-label-style, normal);
      text-transform: var(--hmac-key-label-transform, none);
      color: var(--hmac-key-label-color, var(--secondary-text-color));
    }
    /* a collapsible section's divider (as on the other Ltek cards): line · icon · title · arrow · line */
    .first.clickable {
      position: relative;
      cursor: pointer;
    }
    .first-chev {
      position: absolute;
      right: 12px;
      top: 12px;
      color: var(--secondary-text-color);
    }
    .sec-status {
      background: var(--hmac-status-bg, transparent);
    }
    .st-line {
      font-family: var(--f);
      font-size: var(--s);
      font-weight: var(--w);
      font-style: var(--i, normal);
      text-transform: var(--t, none);
      color: var(--c, var(--primary-text-color));
      line-height: 1.35;
    }
    .lcd-line {
      white-space: pre;
      line-height: 1.6;
    }
    .st-house_mode {
      --f: var(--hmac-mode-name-font, var(--code-font-family, monospace)); --s: var(--hmac-mode-name-size, 22px);
      --w: var(--hmac-mode-name-weight, 400); --i: var(--hmac-mode-name-style); --t: var(--hmac-mode-name-transform, uppercase);
      --c: var(--hmac-mode-name-color, var(--primary-text-color));
      letter-spacing: 0.06em;
      line-height: 1.25;
    }
    .st-alarm_name {
      --f: var(--hmac-alarm-name-font, inherit); --s: var(--hmac-alarm-name-size, 18px); --w: var(--hmac-alarm-name-weight, 400);
      --i: var(--hmac-alarm-name-style); --t: var(--hmac-alarm-name-transform); --c: var(--hmac-alarm-name-color);
    }
    .st-alarm_state {
      --f: var(--hmac-alarm-state-font, inherit); --s: var(--hmac-alarm-state-size, 14px); --w: var(--hmac-alarm-state-weight, 400);
      --i: var(--hmac-alarm-state-style); --t: var(--hmac-alarm-state-transform); --c: var(--hmac-alarm-state-color, var(--secondary-text-color));
    }
    .st-panel_line1 {
      --f: var(--hmac-line1-font, var(--code-font-family, monospace)); --s: var(--hmac-line1-size, 14px); --w: var(--hmac-line1-weight, 400);
      --i: var(--hmac-line1-style); --t: var(--hmac-line1-transform); --c: var(--hmac-line1-color);
    }
    .st-panel_line2 {
      --f: var(--hmac-line2-font, var(--code-font-family, monospace)); --s: var(--hmac-line2-size, 14px); --w: var(--hmac-line2-weight, 400);
      --i: var(--hmac-line2-style); --t: var(--hmac-line2-transform); --c: var(--hmac-line2-color);
    }
    .st-changing {
      --f: var(--hmac-changing-font, inherit); --s: var(--hmac-changing-size, 13px); --w: var(--hmac-changing-weight, 500);
      --i: var(--hmac-changing-style); --t: var(--hmac-changing-transform); --c: var(--hmac-changing-color, var(--warning-color, #ffa500));
    }
    .st-since {
      --f: var(--hmac-since-font, inherit); --s: var(--hmac-since-size, 12px); --w: var(--hmac-since-weight, 400);
      --i: var(--hmac-since-style); --t: var(--hmac-since-transform); --c: var(--hmac-since-color, var(--secondary-text-color));
    }
    .bar {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      margin: 0;
      padding: 6px 14px;
      border: none;
      background: none;
      cursor: pointer;
      color: var(--primary-text-color);
      font: inherit;
      --mdc-icon-size: 20px;
    }
    .bar::before,
    .bar::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--hmac-divider-color, var(--divider-color));
    }
    .bar:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }
    .bar-text {
      flex: none;
      text-align: center;
      font-family: var(--hmac-alarm-bar-font, inherit);
      font-size: var(--hmac-alarm-bar-size, 14px);
      font-weight: var(--hmac-alarm-bar-weight, 500);
      font-style: var(--hmac-alarm-bar-style, normal);
      text-transform: var(--hmac-alarm-bar-transform, none);
      color: var(--hmac-alarm-bar-color, inherit);
    }
    .bar-chev {
      color: var(--secondary-text-color);
    }
    /* round keys: circles, the text inside */
    .keys.round {
      justify-items: center;
    }
    .keys.round .key {
      width: 64px;
      height: 64px;
      border-radius: 50%;
    }
    /* a pressed key flashes for 500 ms */
    .key {
      transition: box-shadow 0.15s, background-color 0.15s, border-color 0.15s;
    }
    .keys.fl-bd .key.flash {
      border-color: var(--kf-bd);
      box-shadow: 0 0 10px 1px var(--kf-bd);
    }
    .keys.fl-bg .key.flash {
      background: var(--kf-bg);
    }
    /* Button Menu looks: chips, and the arm buttons' segmented bar (House Mode buttons and keypad keys reuse theirs) */
    .menu-chips {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 6px;
      padding: 6px 12px 10px;
    }
    .mchip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 16px;
      border: 1px solid var(--divider-color);
      background: none;
      color: var(--primary-text-color);
      cursor: pointer;
      font-family: var(--hmac-chip-font, inherit);
      font-size: var(--hmac-chip-size, 12px);
      font-weight: var(--hmac-chip-weight, 500);
      font-style: var(--hmac-chip-style, normal);
      text-transform: var(--hmac-chip-transform, none);
      --mdc-icon-size: 18px;
    }
    .mchip.on {
      border-color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.18);
      color: var(--primary-color);
    }
    .menu-arm {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      gap: var(--b-gap, 0px);
      margin: 4px 10px 10px;
      padding: 4px;
    }
    .menu-arm::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--b-track, var(--primary-text-color));
      opacity: var(--b-track-opacity, 0.05);
      border-radius: 18px;
      pointer-events: none;
    }
    .arm-b {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      min-height: 40px;
      padding: 8px 2px;
      border: none;
      border-radius: 14px;
      background: var(--b-bg, none);
      box-shadow: inset 0 0 0 1px var(--b-bd, transparent);
      color: var(--primary-text-color);
      cursor: pointer;
      font-family: var(--hmac-alarm-button-font, inherit);
      font-size: var(--hmac-alarm-button-size, 14px);
      font-weight: var(--hmac-alarm-button-weight, 400);
      text-transform: var(--hmac-alarm-button-transform, none);
      --mdc-icon-size: var(--hmac-alarm-icon-size, 22px);
    }
    .arm-b ha-icon {
      color: var(--b-ic, var(--primary-color));
    }
    .arm-b.on {
      background: var(--b-abg, var(--primary-color));
      box-shadow: inset 0 0 0 1px var(--b-abd, transparent);
      color: #fff;
    }
    .arm-b.on ha-icon {
      color: var(--b-aic, #fff);
    }
    .menu-arm.follow .arm-b span {
      color: var(--b-ic, var(--primary-color));
    }
    .menu-arm.follow .arm-b.on span {
      color: var(--b-aic, #fff);
    }
    .menu-arm.round .arm-b {
      border-radius: 50px;
    }
    .menu-keys .key {
      --mdc-icon-size: 22px;
    }
    .menu-keys .key.on {
      border-color: var(--primary-color);
      color: var(--primary-color);
      box-shadow: inset 0 0 0 1px var(--primary-color);
    }
    .menu-empty {
      padding: 6px 12px;
    }
    .key:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
    .warn,
    .loading {
      padding: 16px;
    }
  `,t([ge({attribute:!1})],ys.prototype,"hass",void 0),t([be()],ys.prototype,"config",void 0),t([be()],ys.prototype,"data",void 0),t([be()],ys.prototype,"error",void 0),t([be()],ys.prototype,"collapsed",void 0),t([be()],ys.prototype,"message",void 0),t([be()],ys.prototype,"busyKey",void 0),t([be()],ys.prototype,"closed",void 0),t([be()],ys.prototype,"flashKey",void 0),t([be()],ys.prototype,"popup",void 0),t([be()],ys.prototype,"histRows",void 0),t([be()],ys.prototype,"histShown",void 0),ys=t([pe(ms)],ys),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===ms)||window.customCards.push({type:ms,name:"House Modes & Alarm Center Card",description:"House Mode, alarm and physical panel keypad in one card.",preview:!0}),console.info(`%c HOUSE MODES & ALARM CENTER CARD %c ${us} `,"background:#03a9f4;color:#fff","background:#333;color:#fff");export{us as CARD_VERSION,ys as HouseModesAlarmCenterCard};
