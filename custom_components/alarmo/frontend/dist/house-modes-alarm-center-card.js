function e(e,t){var a={};for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&t.indexOf(s)<0&&(a[s]=e[s]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(s=Object.getOwnPropertySymbols(e);o<s.length;o++)t.indexOf(s[o])<0&&Object.prototype.propertyIsEnumerable.call(e,s[o])&&(a[s[o]]=e[s[o]])}return a}function t(e,t,a,s){var o,i=arguments.length,r=i<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,a):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,a,s);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(r=(i<3?o(r):i>3?o(t,a,r):o(t,a))||r);return i>3&&r&&Object.defineProperty(t,a,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const a=globalThis,s=a.ShadowRoot&&(void 0===a.ShadyCSS||a.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),i=new WeakMap;let r=class{constructor(e,t,a){if(this._$cssResult$=!0,a!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const a=void 0!==t&&1===t.length;a&&(e=i.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),a&&i.set(t,e))}return e}toString(){return this.cssText}};const n=(e,...t)=>{const a=1===e.length?e[0]:t.reduce((t,a,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[s+1],e[0]);return new r(a,e,o)},l=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const a of e.cssRules)t+=a.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,o))(t)})(e):e,{is:c,defineProperty:d,getOwnPropertyDescriptor:h,getOwnPropertyNames:p,getOwnPropertySymbols:u,getPrototypeOf:m}=Object,g=globalThis,b=g.trustedTypes,v=b?b.emptyScript:"",_=g.reactiveElementPolyfillSupport,f=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?v:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let a=e;switch(t){case Boolean:a=null!==e;break;case Number:a=null===e?null:Number(e);break;case Object:case Array:try{a=JSON.parse(e)}catch(e){a=null}}return a}},w=(e,t)=>!c(e,t),x={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:w};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let k=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=x){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const a=Symbol(),s=this.getPropertyDescriptor(e,a,t);void 0!==s&&d(this.prototype,e,s)}}static getPropertyDescriptor(e,t,a){const{get:s,set:o}=h(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const i=s?.call(this);o?.call(this,t),this.requestUpdate(e,i,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??x}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const e=m(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const e=this.properties,t=[...p(e),...u(e)];for(const a of t)this.createProperty(a,e[a])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,a]of t)this.elementProperties.set(e,a)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const a=this._$Eu(e,t);void 0!==a&&this._$Eh.set(a,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const a=new Set(e.flat(1/0).reverse());for(const e of a)t.unshift(l(e))}else void 0!==e&&t.push(l(e));return t}static _$Eu(e,t){const a=t.attribute;return!1===a?void 0:"string"==typeof a?a:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const a of t.keys())this.hasOwnProperty(a)&&(e.set(a,this[a]),delete this[a]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{if(s)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const s of t){const t=document.createElement("style"),o=a.litNonce;void 0!==o&&t.setAttribute("nonce",o),t.textContent=s.cssText,e.appendChild(t)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,a){this._$AK(e,a)}_$ET(e,t){const a=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,a);if(void 0!==s&&!0===a.reflect){const o=(void 0!==a.converter?.toAttribute?a.converter:y).toAttribute(t,a.type);this._$Em=e,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){const a=this.constructor,s=a._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=a.getPropertyOptions(s),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=s;const i=o.fromAttribute(t,e.type);this[s]=i??this._$Ej?.get(s)??i,this._$Em=null}}requestUpdate(e,t,a,s=!1,o){if(void 0!==e){const i=this.constructor;if(!1===s&&(o=this[e]),a??=i.getPropertyOptions(e),!((a.hasChanged??w)(o,t)||a.useDefault&&a.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(i._$Eu(e,a))))return;this.C(e,t,a)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:a,reflect:s,wrapped:o},i){a&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,i??t??this[e]),!0!==o||void 0!==i)||(this._$AL.has(e)||(this.hasUpdated||a||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,a]of e){const{wrapped:e}=a,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,a,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[f("elementProperties")]=new Map,k[f("finalized")]=new Map,_?.({ReactiveElement:k}),(g.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $=globalThis,A=e=>e,S=$.trustedTypes,z=S?S.createPolicy("lit-html",{createHTML:e=>e}):void 0,O="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,j="?"+C,M=`<${j}>`,E=document,T=()=>E.createComment(""),P=e=>null===e||"object"!=typeof e&&"function"!=typeof e,R=Array.isArray,N="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,B=/>/g,I=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,F=/"/g,U=/^(?:script|style|textarea|title)$/i,q=(e=>(t,...a)=>({_$litType$:e,strings:t,values:a}))(1),W=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),K=new WeakMap,G=E.createTreeWalker(E,129);function Z(e,t){if(!R(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==z?z.createHTML(t):t}const Y=(e,t)=>{const a=e.length-1,s=[];let o,i=2===t?"<svg>":3===t?"<math>":"",r=H;for(let t=0;t<a;t++){const a=e[t];let n,l,c=-1,d=0;for(;d<a.length&&(r.lastIndex=d,l=r.exec(a),null!==l);)d=r.lastIndex,r===H?"!--"===l[1]?r=D:void 0!==l[1]?r=B:void 0!==l[2]?(U.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=I):void 0!==l[3]&&(r=I):r===I?">"===l[0]?(r=o??H,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,n=l[1],r=void 0===l[3]?I:'"'===l[3]?F:L):r===F||r===L?r=I:r===D||r===B?r=H:(r=I,o=void 0);const h=r===I&&e[t+1].startsWith("/>")?" ":"";i+=r===H?a+M:c>=0?(s.push(n),a.slice(0,c)+O+a.slice(c)+C+h):a+C+(-2===c?t:h)}return[Z(e,i+(e[a]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class J{constructor({strings:e,_$litType$:t},a){let s;this.parts=[];let o=0,i=0;const r=e.length-1,n=this.parts,[l,c]=Y(e,t);if(this.el=J.createElement(l,a),G.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=G.nextNode())&&n.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(O)){const t=c[i++],a=s.getAttribute(e).split(C),r=/([.?@])?(.*)/.exec(t);n.push({type:1,index:o,name:r[2],strings:a,ctor:"."===r[1]?ae:"?"===r[1]?se:"@"===r[1]?oe:te}),s.removeAttribute(e)}else e.startsWith(C)&&(n.push({type:6,index:o}),s.removeAttribute(e));if(U.test(s.tagName)){const e=s.textContent.split(C),t=e.length-1;if(t>0){s.textContent=S?S.emptyScript:"";for(let a=0;a<t;a++)s.append(e[a],T()),G.nextNode(),n.push({type:2,index:++o});s.append(e[t],T())}}}else if(8===s.nodeType)if(s.data===j)n.push({type:2,index:o});else{let e=-1;for(;-1!==(e=s.data.indexOf(C,e+1));)n.push({type:7,index:o}),e+=C.length-1}o++}}static createElement(e,t){const a=E.createElement("template");return a.innerHTML=e,a}}function X(e,t,a=e,s){if(t===W)return t;let o=void 0!==s?a._$Co?.[s]:a._$Cl;const i=P(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),void 0===i?o=void 0:(o=new i(e),o._$AT(e,a,s)),void 0!==s?(a._$Co??=[])[s]=o:a._$Cl=o),void 0!==o&&(t=X(e,o._$AS(e,t.values),o,s)),t}class Q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:a}=this._$AD,s=(e?.creationScope??E).importNode(t,!0);G.currentNode=s;let o=G.nextNode(),i=0,r=0,n=a[0];for(;void 0!==n;){if(i===n.index){let t;2===n.type?t=new ee(o,o.nextSibling,this,e):1===n.type?t=new n.ctor(o,n.name,n.strings,this,e):6===n.type&&(t=new ie(o,this,e)),this._$AV.push(t),n=a[++r]}i!==n?.index&&(o=G.nextNode(),i++)}return G.currentNode=E,s}p(e){let t=0;for(const a of this._$AV)void 0!==a&&(void 0!==a.strings?(a._$AI(e,a,t),t+=a.strings.length-2):a._$AI(e[t])),t++}}class ee{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,a,s){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=a,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),P(e)?e===V||null==e||""===e?(this._$AH!==V&&this._$AR(),this._$AH=V):e!==this._$AH&&e!==W&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>R(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==V&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(E.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:a}=e,s="number"==typeof a?this._$AC(e):(void 0===a.el&&(a.el=J.createElement(Z(a.h,a.h[0]),this.options)),a);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new Q(s,this),a=e.u(this.options);e.p(t),this.T(a),this._$AH=e}}_$AC(e){let t=K.get(e.strings);return void 0===t&&K.set(e.strings,t=new J(e)),t}k(e){R(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let a,s=0;for(const o of e)s===t.length?t.push(a=new ee(this.O(T()),this.O(T()),this,this.options)):a=t[s],a._$AI(o),s++;s<t.length&&(this._$AR(a&&a._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=A(e).nextSibling;A(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class te{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,a,s,o){this.type=1,this._$AH=V,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=o,a.length>2||""!==a[0]||""!==a[1]?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=V}_$AI(e,t=this,a,s){const o=this.strings;let i=!1;if(void 0===o)e=X(this,e,t,0),i=!P(e)||e!==this._$AH&&e!==W,i&&(this._$AH=e);else{const s=e;let r,n;for(e=o[0],r=0;r<o.length-1;r++)n=X(this,s[a+r],t,r),n===W&&(n=this._$AH[r]),i||=!P(n)||n!==this._$AH[r],n===V?e=V:e!==V&&(e+=(n??"")+o[r+1]),this._$AH[r]=n}i&&!s&&this.j(e)}j(e){e===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ae extends te{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===V?void 0:e}}class se extends te{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==V)}}class oe extends te{constructor(e,t,a,s,o){super(e,t,a,s,o),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??V)===W)return;const a=this._$AH,s=e===V&&a!==V||e.capture!==a.capture||e.once!==a.once||e.passive!==a.passive,o=e!==V&&(a===V||s);s&&this.element.removeEventListener(this.name,this,a),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ie{constructor(e,t,a){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const re=$.litHtmlPolyfillSupport;re?.(J,ee),($.litHtmlVersions??=[]).push("3.3.3");const ne=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class le extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,a)=>{const s=a?.renderBefore??t;let o=s._$litPart$;if(void 0===o){const e=a?.renderBefore??null;s._$litPart$=o=new ee(t.insertBefore(T(),e),e,void 0,a??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}}le._$litElement$=!0,le.finalized=!0,ne.litElementHydrateSupport?.({LitElement:le});const ce=ne.litElementPolyfillSupport;ce?.({LitElement:le}),(ne.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const de=e=>(t,a)=>{void 0!==a?a.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},he={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:w},pe=(e=he,t,a)=>{const{kind:s,metadata:o}=a;let i=globalThis.litPropertyMetadata.get(o);if(void 0===i&&globalThis.litPropertyMetadata.set(o,i=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),i.set(a.name,e),"accessor"===s){const{name:s}=a;return{set(a){const o=t.get.call(this);t.set.call(this,a),this.requestUpdate(s,o,e,!0,a)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=a;return function(a){const o=this[s];t.call(this,a),this.requestUpdate(s,o,e,!0,a)}}throw Error("Unsupported decorator location: "+s)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ue(e){return(t,a)=>"object"==typeof a?pe(e,t,a):((e,t,a)=>{const s=t.hasOwnProperty(a);return t.constructor.createProperty(a,e),s?Object.getOwnPropertyDescriptor(t,a):void 0})(e,t,a)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function me(e){return ue({...e,state:!0,attribute:!1})}const ge=(e,t)=>{if(void 0!==e&&""!==e)return"mode"===e?t:"none"===e?"transparent":String(e).replace(/[;{}<>]/g,"")},be={mode_name:{label:"House Mode name",size:22,weight:400,font:"monospace",caps:!0},changing:{label:"Changing to …",size:13,weight:500,font:"sans",caps:!1},since:{label:"Since (last change)",size:12,weight:400,font:"sans",caps:!1},line1:{label:"Panel display, line 1",size:14,weight:400,font:"monospace",caps:!1},line2:{label:"Panel display, line 2",size:14,weight:400,font:"monospace",caps:!1},mode_label:{label:"House Mode button text",size:10,weight:400,font:"sans",caps:!1},alarm_bar:{label:"Section bars (collapsible sections)",size:14,weight:500,font:"sans",caps:!1},alarm_name:{label:"Alarm name",size:18,weight:400,font:"sans",caps:!1},alarm_state:{label:"Alarm state",size:14,weight:400,font:"sans",caps:!1},alarm_button:{label:"Arm button text",size:14,weight:400,font:"sans",caps:!1},chip:{label:"Option chips",size:12,weight:500,font:"sans",caps:!1},key_digit:{label:"Keypad digit",size:16,weight:400,font:"sans",caps:!1},key_label:{label:"Keypad function",size:10,weight:400,font:"sans",caps:!1}},ve={header_icon:{label:"House Mode icon (header)",size:48},mode_icon:{label:"House Mode button icons",size:36},alarm_icon:{label:"Arm button icons",size:22}},_e={header_section:"House Mode Status",modes_section:"House Mode buttons",alarm_status_section:"Alarm Panel Status",alarm_section:"Alarm Panel buttons",keypad_section:"Physical panel keypad"},fe={show_header:!0,show_house_modes:!0,show_alarm:!0,show_panel_keypad:!1,collapsible:!1,start_collapsed:!0,show_chevron:!1,columns:5,modes_align:"grid",show_mode_labels:!0,show_mode_name:!0,show_line1:!0,show_line2:!0,alarm_collapsible:!1,alarm_start_collapsed:!0,show_alarm_name:!0,show_alarm_state:!0,show_arm_options:!0,alarm_colors:"modes",modes_collapsible:!1,modes_start_collapsed:!0,keypad_collapsible:!1,keypad_start_collapsed:!0,show_header_icon:!0,show_mode_icons:!0,show_alarm_icon:!0,show_arm_icons:!0,show_arm_labels:!0,show_key_labels:!0,modes_shape:"rounded",arm_shape:"rounded",keypad_shape:"rounded",modes_width:"fill",arm_width:"fill",header_countdown:!1,border_color:"mode",show_alarm_status:!0,house_status_collapsible:!1,house_status_start_collapsed:!0,alarm_status_collapsible:!1,alarm_status_start_collapsed:!0,show_alarm_line1:!1,show_alarm_line2:!1},ye=["house_mode","alarm_name","alarm_state","panel_line1","panel_line2","changing","since"],we={house_mode:{label:"House Mode name",style:"mode_name"},alarm_name:{label:"Alarm name",style:"alarm_name"},alarm_state:{label:"Alarm state",style:"alarm_state"},panel_line1:{label:"Panel display, line 1",style:"line1"},panel_line2:{label:"Panel display, line 2",style:"line2"},changing:{label:"Changing to … (while a House Mode change is under way)",style:"changing"},since:{label:"Since (when the House Mode last changed)",style:"since"}},xe=["house_modes","alarm","keypad"],ke=e=>{var t,a,s,o;if(Array.isArray(e.status_sections)){const t=e.status_sections.filter(e=>e&&e.id),a=t.map(e=>`status:${e.id}`),s=[...a,...xe],o=(e.section_order||[]).filter(e=>s.includes(e)),i=o.filter((e,t)=>o.indexOf(e)===t);return{sections:t,order:[...i,...s.filter(e=>!i.includes(e))]}}const i=Object.assign(Object.assign({},fe),e),r={id:"house",name:"House Mode Status",show:!1!==i.show_header,icon:!1===i.show_header_icon?"none":"house",countdown:!!i.header_countdown,lines:[...!1!==i.show_mode_name?["house_mode"]:[],...!1!==i.show_line1?["panel_line1"]:[],...!1!==i.show_line2?["panel_line2"]:[]],collapsible:!!i.house_status_collapsible,start_collapsed:!1!==i.house_status_start_collapsed,background:null===(a=null===(t=i.styles)||void 0===t?void 0:t.header_section)||void 0===a?void 0:a.background},n={id:"alarm",name:"Alarm Panel Status",show:!1!==i.show_alarm_status&&!(!1===e.show_alarm&&void 0===e.show_alarm_status),icon:!1===i.show_alarm_icon?"none":"alarm",countdown:!1!==i.show_alarm_icon,lines:[...!1!==i.show_alarm_name?["alarm_name"]:[],...!1!==i.show_alarm_state?["alarm_state"]:[],...i.show_alarm_line1?["panel_line1"]:[],...i.show_alarm_line2?["panel_line2"]:[]],collapsible:!!i.alarm_status_collapsible,start_collapsed:!1!==i.alarm_status_start_collapsed,background:null===(o=null===(s=i.styles)||void 0===s?void 0:s.alarm_status_section)||void 0===o?void 0:o.background};for(const e of[r,n])e.background||delete e.background;const l={house_status:"status:house",alarm_status:"status:alarm",house_modes:"house_modes",alarm:"alarm",keypad:"keypad"},c=ze(e.section_order).map(e=>l[e]);return{sections:[r,n],order:c}},$e=["show_header","show_header_icon","header_countdown","show_mode_name","show_line1","show_line2","house_status_collapsible","house_status_start_collapsed","show_alarm_status","show_alarm_icon","show_alarm_name","show_alarm_state","show_alarm_line1","show_alarm_line2","alarm_status_collapsible","alarm_status_start_collapsed"],Ae=["house_status","house_modes","alarm_status","alarm","keypad"],Se={house_status:{title:"House Mode Status",hint:"icon, name, panel display",show:"show_header",collapse:"house_status_collapsible",start:"house_status_start_collapsed"},house_modes:{title:"House Mode buttons",hint:"",show:"show_house_modes",collapse:"modes_collapsible",start:"modes_start_collapsed"},alarm_status:{title:"Alarm Panel Status",hint:"state, countdown",show:"show_alarm_status",collapse:"alarm_status_collapsible",start:"alarm_status_start_collapsed"},alarm:{title:"Alarm Panel buttons",hint:"arm / disarm, code, messages",show:"show_alarm",collapse:"alarm_collapsible",start:"alarm_start_collapsed"},keypad:{title:"Physical panel keypad",hint:"",show:"show_panel_keypad",collapse:"keypad_collapsible",start:"keypad_start_collapsed"}},ze=e=>{const t=(e||[]).filter(e=>Ae.includes(e)),a=t.filter((e,a)=>t.indexOf(e)===a);return[...a,...Ae.filter(e=>!a.includes(e))]},Oe={disarmed:"Disarmed",armed_away:"Armed away",armed_home:"Armed home",armed_night:"Armed night",armed_vacation:"Armed vacation",armed_custom_bypass:"Armed custom bypass"},Ce={disarmed:"mdi:lock-open-variant",armed_away:"mdi:shield-lock",armed_home:"mdi:shield-home",armed_night:"mdi:shield-moon",armed_vacation:"mdi:shield-airplane",armed_custom_bypass:"mdi:lock-percent-open",arming:"mdi:shield-sync-outline",pending:"mdi:shield-alert-outline",triggered:"mdi:bell-ring"},je={monospace:"var(--code-font-family, monospace)",sans:'var(--ha-font-family-body, Roboto, "Noto Sans", sans-serif)',serif:'Georgia, "Times New Roman", serif'},Me=e=>{const t={};for(const[a,s]of e)t[a]=s;return t},Ee=e=>{var t;const a=[],s=(e,t)=>null!=t&&""!==t&&a.push(`--hmac-${e}:${(e=>String(e).replace(/[;{}<>]/g,""))(t)}`);for(const t of Object.keys(be)){const a=(e||{})[t];if(!a)continue;const o=t.replace(/_/g,"-");a.size&&s(`${o}-size`,`${Number(a.size)}px`),a.weight&&s(`${o}-weight`,Number(a.weight)),s(`${o}-color`,a.color),a.font&&je[a.font]&&s(`${o}-font`,je[a.font]),void 0!==a.italic&&s(`${o}-style`,a.italic?"italic":"normal"),void 0!==a.caps&&s(`${o}-transform`,a.caps?"uppercase":"none")}for(const t of Object.keys(ve)){const a=(e||{})[t];if(!a)continue;const o=t.replace(/_/g,"-");a.size&&s(`${o}-size`,`${Number(a.size)}px`)}const o=(e||{}).card;void 0!==(null==o?void 0:o.border_width)&&s("border-width",`${Number(o.border_width)}px`),void 0!==(null==o?void 0:o.radius)&&s("radius",`${Number(o.radius)}px`),s("card-bg",null==o?void 0:o.background);for(const a of Object.keys(_e))s(`${a.replace("_section","")}-bg`,null===(t=(e||{})[a])||void 0===t?void 0:t.background);return a.join(";")},Te=e=>{if(!e)return;const t={};for(const[a,s]of Object.entries(e)){if(!s||"object"!=typeof s)continue;const e=Me(Object.entries(s).filter(([,e])=>void 0!==e&&""!==e&&null!==e&&("card"===a||0!==e)));Object.keys(e).length&&(t[a]=e)}return Object.keys(t).length?t:void 0},Pe={disarmed:"#008000",armed_away:"#ff0000",armed_home:"#ffa500",armed_night:"#5d5df4",armed_vacation:"#dc143c",armed_custom_bypass:"#00a8a8"},Re=(e,t,a="modes")=>{var s,o;if("standard"===a)return Object.assign({},Pe);if("theme"===a)return{};const i=null===(s=e.alarms.find(e=>e.entity_id===t))||void 0===s?void 0:s.key,r={};for(const t of Object.keys(Pe)){const a=e.house.modes.find(e=>{var a;return i&&(null===(a=e.targets)||void 0===a?void 0:a[i])===t}),s=e.house.modes.find(e=>Object.values(e.targets||{}).includes(t));r[t]=(null===(o=a||s)||void 0===o?void 0:o.color)||Pe[t]}return r},Ne=[["1","OFF"],["2","AWAY"],["3","STAY"],["4","MAX"],["5","TEST"],["6","BYPASS"],["7","INSTANT"],["8","CODE"],["9","CHIME"],["*","READY"],["0",""],["#",""]],He=(e,t,a)=>{var s;let o=e.trim();if(t){const e=new Set([...t," "]);let a=0,s=o.length;for(;a<s&&e.has(o[a]);)a++;for(;s>a&&e.has(o[s-1]);)s--;o=o.slice(a,s)}for(const e of a||[])e&&e.from&&(o=o.split(e.from).join(null!==(s=e.to)&&void 0!==s?s:""));return o.trim()},De=(e,t,a)=>{const s=String(e||"");return[He(s.slice(0,16),t,a),He(s.slice(16,32),t,a)]},Be=["background","border","icon"],Ie={card:{label:"Card",parts:["background","border"]},status_icon:{label:"Status icons",parts:["icon"]},mode_button:{label:"House Mode buttons (the mode being changed to)",parts:["background","border","icon"]},arm_button:{label:"Arm buttons (the arm mode being set)",parts:["background","border","icon"]}},Le=["arming","entry","changing","triggered"],Fe={arming:"Arming (exit delay: the alarm or the physical panel)",entry:"Entry delay (pending)",changing:"House Mode changing (being applied, delayed or, in Shadow, watched)",triggered:"Alarm triggered"},Ue={size:16,speed:1.6,when:["arming","changing"]},qe=e=>{if(!e||"object"!=typeof e)return e;const t=Object.assign({},e);if("string"==typeof e.border&&(t.card=Object.assign(Object.assign({},e.card||{}),{border:e.border}),delete t.border),"string"==typeof e.status_icon&&(t.status_icon={icon:e.status_icon}),"string"==typeof e.mode_button){const a=e.mode_button;t.mode_button=Object.assign(Object.assign({},"glow"===a||"both"===a?{border:"glow"}:{}),"pulse"===a||"both"===a?{icon:"pulse"}:{})}return t},We=(e,t)=>{if(!e)return!1;const a=e.when||Ue.when;return t.some(e=>a.includes(e))},Ve=(e,t,a="fx")=>{if(!t||!e)return[];const s=[];for(const t of Be){const o=e[t];"glow"!==o&&"both"!==o||s.push(`${a}-${t}-glow`),"pulse"!==o&&"both"!==o||s.push(`${a}-${t}-pulse`)}return s},Ke={on:!1,listeners:new Set,timer:0,set(e){this.on=e,clearTimeout(this.timer),e&&(this.timer=setTimeout(()=>this.set(!1),2e4)),this.listeners.forEach(e=>e())}};globalThis.__hmacFxPreview=Ke;const Ge=(e,t)=>e.links.find(e=>e.alarm_entity===t)||e.links[0],Ze=t=>{if(t.effects&&(t=Object.assign(Object.assign({},t),{effects:qe(t.effects)})),t.display_strip){const{display_strip:a}=t,s=e(t,["display_strip"]),o=[...new Set([...a])].filter(e=>e.trim()).map(e=>({from:e}));t=Object.assign(Object.assign({},s),{display_replace:[...o,...t.display_replace||[]]})}if(!1===t.show_alarm&&void 0===t.show_alarm_status&&(t=Object.assign(Object.assign({},t),{show_alarm_status:!1})),void 0===t.alarm_colors_from_modes)return t;const{alarm_colors_from_modes:a}=t,s=e(t,["alarm_colors_from_modes"]);return Object.assign(Object.assign({},s),t.alarm_colors?{}:!1===a?{alarm_colors:"standard"}:{})},Ye={filled:{label:"Filled (selected button in its color)",button:{},icon:{}},outline_selected:{label:"Outline when selected",button:{background:"transparent",active_background:"transparent",border:"none",active_border:"mode",text_follows_icon:!0},icon:{color:"var(--secondary-text-color)",active_color:"mode"}},outline:{label:"Outline, all in color",button:{background:"transparent",active_background:"transparent",border:"mode",active_border:"mode",text_follows_icon:!0},icon:{color:"mode",active_color:"mode"}},icon_only:{label:"Colored icon when selected",button:{background:"transparent",active_background:"transparent",border:"none",active_border:"none",text_follows_icon:!0},icon:{color:"var(--secondary-text-color)",active_color:"mode"}}},Je=["armed_away","armed_home","armed_night","armed_vacation","armed_custom_bypass"],Xe="number";var Qe;!function(e){e.Disarmed="disarmed",e.Arming="arming",e.Pending="pending",e.Triggered="triggered",e.ArmedAway="armed_away",e.ArmedHome="armed_home",e.ArmedNight="armed_night",e.ArmedVacation="armed_vacation",e.ArmedCustomBypass="armed_custom_bypass"}(Qe||(Qe={}));const et={[Qe.ArmedAway]:"hass:shield-lock",[Qe.ArmedHome]:"hass:shield-home",[Qe.ArmedNight]:"hass:shield-moon",[Qe.ArmedVacation]:"hass:shield-airplane",[Qe.ArmedCustomBypass]:"mdi:lock-percent-open",[Qe.Disarmed]:"mdi:lock-open-variant",[Qe.Arming]:"hass:shield-outline",[Qe.Pending]:"hass:shield-outline",[Qe.Triggered]:"hass:bell-ring"};var tt;!function(e){e.ArmAway="arm_away",e.ArmHome="arm_home",e.ArmNight="arm_night",e.ArmVacation="arm_vacation",e.ArmCustomBypass="arm_custom_bypass",e.Disarm="disarm"}(tt||(tt={}));const at={[tt.ArmAway]:"mdi:lock",[tt.ArmHome]:"mdi:home",[tt.ArmNight]:"mdi:moon-waning-crescent",[tt.ArmVacation]:"mdi:airplane",[tt.ArmCustomBypass]:"mdi:lock-percent-open",[tt.Disarm]:"mdi:lock-open-variant"},st={[tt.ArmAway]:Qe.ArmedAway,[tt.ArmHome]:Qe.ArmedHome,[tt.ArmNight]:Qe.ArmedNight,[tt.ArmVacation]:Qe.ArmedVacation,[tt.ArmCustomBypass]:Qe.ArmedCustomBypass,[tt.Disarm]:Qe.Disarmed};var ot;!function(e){e.Disarm="disarm",e.Arm="arm",e.Trigger="trigger",e.FailedToArm="failed_to_arm",e.CommandNotAllowed="command_not_allowed",e.NoCodeProvided="no_code_provided",e.InvalidCodeProvided="invalid_code_provided",e.TriggerTimeExpired="trigger_time_expired",e.ReadyToArmModesChanged="ready_to_arm_modes_changed"}(ot||(ot={}));const it="alarmo_updated",rt=["arming","pending"],nt={type:"",entity:"",name:"",keep_keypad_visible:!1,button_scale_actions:1,button_scale_keypad:1,states:{},show_messages:!0,show_ready_indicator:!0,show_bypassed_sensors:!0,use_code_dialog:!1,hide_keypad:!1},lt={skip_delay:!1,force:!1};var ct;!function(e){e.Red="red",e.Pink="pink",e.Purple="purple",e.DeepPurple="deep-purple",e.Indigo="indigo",e.Blue="blue",e.LightBlue="light-blue",e.Cyan="cyan",e.Teal="teal",e.Green="green",e.LightGreen="light-green",e.Lime="lime",e.Yellow="yellow",e.Amber="amber",e.Orange="orange",e.DeepOrange="deep-orange",e.Brown="brown",e.LightGrey="light-grey",e.Grey="grey",e.DarkGrey="dark-grey",e.BlueGrey="blue-grey",e.Black="black",e.White="white"}(ct||(ct={}));const dt=(e,t,a,s)=>{s=s||{},a=null==a?{}:a;const o=new Event(t,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return o.detail=a,e.dispatchEvent(o),o};class ht extends le{constructor(){super(...arguments),this.duration=0,this.datetime=null,this.timer=0,this._touchStarted=!1,this._hover=!1}shouldUpdate(e){if(!e.size)return!0;const t=e.get("hass");if(!t||t.themes!==this.hass.themes||t.language!==this.hass.language)return!0;if(t.states[this.entity].state!==this.hass.states[this.entity].state||t.states[this.entity].attributes.delay!==this.hass.states[this.entity].attributes.delay){const e=t.states[this.entity].state,a=this.hass.states[this.entity].state;return rt.includes(a)?this.startTimer():rt.includes(e)&&this.stopTimer(),!0}return!1}firstUpdated(){const e=this.hass.states[this.entity].state;rt.includes(e)&&this.startTimer(),this.addEventListener("click",this.handleClick),this.addEventListener("touchstart",()=>{this._touchStarted=!0}),this.addEventListener("touchend",()=>{setTimeout(()=>{this._touchStarted=!1},10)}),this.addEventListener("mouseenter",()=>{this._touchStarted||(this._hover=!0)}),this.addEventListener("mouseleave",()=>{this._hover=!1})}async startTimer(){var e,t;clearInterval(this.timer),(e=this.hass,t=this.entity,e.callWS({type:"alarmo/countdown",entity_id:t})).then(e=>{this.duration=e.delay,this.datetime=new Date((new Date).getTime()+1e3*e.remaining)}).catch(e=>{}),this.timer=window.setInterval(()=>{this.requestUpdate()},1e3)}stopTimer(){clearInterval(this.timer),this.datetime=null,this.duration=0}getRemaining(){if(!this.datetime)return 0;const e=(this.datetime.getTime()-(new Date).getTime())/1e3;return e<0?(clearInterval(this.timer),0):e}getFraction(){return this.duration?(Math.round(this.getRemaining())-1)/this.duration:1}_stateValue(e){return this._hover&&rt.includes(e)&&this.timer?q` <ha-icon icon="mdi:skip-forward"></ha-icon> `:this.datetime&&this.duration?q` ${Math.max(Math.round(this.getRemaining()),0)} `:q` <ha-icon .icon=${et[e]}></ha-icon> `}handleClick(){const e=this.hass.states[this.entity].state;rt.includes(e)&&this.timer?this.hass.callService("alarmo","skip_delay",{entity_id:this.entity}):dt(this,"hass-more-info",{entityId:this.entity})}render(){let e=45,t=2*Math.PI*e;const a=this.hass.states[this.entity],s=this.datetime&&this.duration;return q`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="track ${a.state.split("_").shift()} ${s?"timer":""}">
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
      <div class="overlay ${a.state.split("_").shift()} ${s?"timer":""}">
        <div class="value">${this._stateValue(a.state)}</div>
      </div>
    `}static get styles(){return n`
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
    `}}function pt(e){return null!=e}function ut(e){switch(typeof e){case"object":return 0==Object.keys(e).length;case"string":return 0==String(e).length;default:return!pt(e)}}function mt(e){return e.substring(0,e.indexOf("."))}t([ue()],ht.prototype,"hass",void 0),t([ue()],ht.prototype,"entity",void 0),t([me()],ht.prototype,"_hover",void 0),customElements.define("hmac-state-badge",ht);const gt=(e,t)=>{let a={hide:!1};return(t.states||{}).hasOwnProperty(e)&&(a=Object.assign(Object.assign({},a),t.states[e])),a},bt=e=>{if(!e)return[];const t=e.attributes.supported_features||0;let a=[];return 2&t&&a.push(tt.ArmAway),1&t&&a.push(tt.ArmHome),4&t&&a.push(tt.ArmNight),32&t&&a.push(tt.ArmVacation),16&t&&a.push(tt.ArmCustomBypass),a},vt=(e,t,a)=>{const s=mt(e.entity_id),o=e.attributes.device_class,i=e.state;if(Object.values(Qe).includes(i)&&a){const e=gt(i,a);if(!ut(e.state_label))return e.state_label}let r="";return o&&(r=t(`component.${s}.entity_component.${o}.state.${e.state}`)),r||(r=t(`component.${s}.entity_component._.state.${e.state}`)),r},_t=e=>null!==e.attributes.code_format,ft=(e,t,a=!1)=>{if(!e||!e.state)return"var(--state-unavailable-color)";let s=e.state;if(a){const a=Object.values(tt).map(e=>st[e]);if(!a.includes(s)){const t=e.attributes.arm_mode;t&&(s=t)}const o=[tt.Disarm,...bt(e)].filter(e=>!gt(st[e],t).hide);1==o.length&&(s=st[o[0]])}if(Object.keys(t.states||{}).includes(s)&&pt((t.states[s]||{}).color)){const e=t.states[s].color;return Object.values(ct).includes(e)?`var(--${e}-color)`:e}return s==Qe.Disarmed?"var(--state-alarm_control_panel-disarmed-color, var(--state-alarm_control_panel-inactive-color, var(--state-inactive-color)))":Object.values(Qe).includes(s)?`var(--state-alarm_control_panel-${s}-color, var(--state-alarm_control_panel-active-color, var(--state-active-color)))`:"var(--disabled-color, var(--state-inactive-color))"};var yt,wt;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(yt||(yt={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(wt||(wt={}));class xt extends le{shouldUpdate(e){const t=e.get("hass");return!t||!(!this.entity||t.states[this.entity]===this.hass.states[this.entity])}render(){if(!this.hass||!this.entity)return q``;const e=this.entity in this.hass.states;let t=Object.assign({},this.hass.states[this.entity]);void 0!==this.state&&(t=Object.assign(Object.assign({},t),{state:this.state}));const a=e?vt(t,this.hass.localize):this.hass.localize("state.default.unavailable",this.hass.locale||{language:this.hass.language,number_format:yt.language}),s=e?t.attributes.friendly_name||(o=t.entity_id).substring(o.indexOf(".")+1):this.entity;var o;let i=!!this.state||"on"==t.state;return q`
      <div class="badge-container" @click=${()=>dt(this,"hass-more-info",{entityId:this.entity})}>
        <div class="label-badge ${i?"active":""}" id="badge">
          <div class="value">
            <ha-state-icon
              .hass=${this.hass}
              .stateObj=${t}
            ></ha-state-icon>
            <div class="label">
              <span>${a}</span>
            </div>
          </div>
        </div>
        <div class="title">${s}</div>
      </div>
    `}static get styles(){return n`
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
    `}}t([ue()],xt.prototype,"hass",void 0),t([ue()],xt.prototype,"entity",void 0),t([ue()],xt.prototype,"state",void 0),customElements.define("hmac-sensor-badge",xt);class kt extends le{constructor(){super(...arguments),this.disabled=!1,this.scaled=!1}render(){return q`
      <button ?disabled=${this.disabled}>
        <slot></slot>
      </button>
    `}handleFocus(e){e.target.blur()}static get styles(){return n`
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
    `}}t([ue({type:Boolean})],kt.prototype,"disabled",void 0),t([ue({type:Boolean})],kt.prototype,"scaled",void 0),customElements.define("hmac-button",kt);const $t=e=>{class a extends e{connectedCallback(){super.connectedCallback(),this.__checkSubscribed()}disconnectedCallback(){if(super.disconnectedCallback(),this.__unsubs){for(;this.__unsubs.length;){const e=this.__unsubs.pop();e instanceof Promise?e.then(e=>e()):e()}this.__unsubs=void 0}}updated(e){super.updated(e),e.has("hass")&&this.__checkSubscribed()}hassSubscribe(){return[]}__checkSubscribed(){void 0===this.__unsubs&&this.isConnected&&void 0!==this.hass&&(this.__unsubs=this.hassSubscribe())}}return t([ue({attribute:!1})],a.prototype,"hass",void 0),a};var At={heading:"Možnosti aktivace",skip_delay:"Přeskočit čas pro vystup",force:"Bypass otevřených senzorů"},St={keep_keypad_visible:"Zachovat klávesnici vždy viditelnou, i když není vyžadován žádný kód.",button_scale_actions:"Měřítko použité pro změnu velikosti tlačítek akcí.",button_scale_keypad:"Měřítko použité pro změnu velikosti tlačítek klávesnice.",show_messages:"Zobrazit diagnostické zprávy při spuštění alarmu nebo nemožnosti aktivace.",show_ready_indicator:"Zobrazit indikátor připraveno/nepřipraveno na tlačítkách režimu aktivace.",show_bypassed_sensors:"Zobrazit varování při aktivaci alarmu s přemostěnými senzory.",use_code_dialog:"Zobrazte klávesnici pro zadání kódu jako vyskakovací dialog.",hide_keypad:"Skrýt tlačítka klávesnice pro zadávání kódu.",available_actions:"Dostupné akce:",action_dialog:{title:"Upravit zobrazení akce '{action}'",show_button:{title:"Viditelnost akčního tlačítka",options:{always:"Vždy zobrazeno",never:"Nikdy zobrazeno",disarmed:"Zobrazit pouze při odzbrojení",armed:"Zobrazit pouze při zapnutí"}},button_label:"Přepsat popisek tlačítka",button_icon:"Ikona zobrazeného tlačítka",state_label:"Přepsat popisek stavu",color:"Přepsat barvu použitou pro akci"}},zt={invalid_pin:"Neplatný",blocking_sensors:"Nelze aktivovat kvůli následujícím senzorům",triggered_sensors:"Alarm byl spuštěn následujícími senzory",bypassed_sensors:"Jsou tam přemostěné senzory"},Ot={arm_options:At,editor:St,errors:zt},Ct={heading:"Scharfschaltungsoptionen",skip_delay:"Ausgangsverzögerung überspringen",force:"Offene Sensoren ignorieren"},jt={keep_keypad_visible:"Zeige das Pin-Eingabefeld immer an, auch wenn kein Code erfordert ist.",button_scale_actions:"Skalierungsfaktor für Buttongröße der Aktionen.",button_scale_keypad:"Skalierungsfaktor für Buttongröße der Pin-Eingabefeld.",show_messages:"Anzeige von Diagnosemeldungen, wenn der Alarm ausgelöst wird oder nicht scharf geschaltet werden kann.",show_ready_indicator:"Zeigt die Bereitschafts-/Nicht-Bereitschaftsanzeige auf den Scharfschaltmodus-Tasten an.",show_bypassed_sensors:"Warnung anzeigen, wenn der Alarm mit umgangenen Sensoren aktiviert wird.",use_code_dialog:"Zeigen Sie die Tastatur zur Codeeingabe als Popup-Dialog an.",hide_keypad:"Blenden Sie die Tasten der Tastatur zur Codeeingabe aus.",available_actions:"Verfügbare Aktionen:",action_dialog:{title:"Anzeige der Aktion '{action}' anpassen",show_button:{title:"Sichtbarkeit der Aktionsschaltfläche",options:{always:"Immer angezeigt",never:"Nie angezeigt",disarmed:"Nur im deaktivierten Zustand anzeigen",armed:"Nur im aktivierten Zustand anzeigen"}},button_label:"Überschreibung der Tastenbeschriftung",button_icon:"Angezeigtes Schaltflächensymbol",state_label:"Überschreibung der Statusbezeichnung",color:"Die für die Aktion verwendete Farbe überschreiben"}},Mt={invalid_pin:"Ungültig",blocking_sensors:"Konnte nicht scharf geschaltet werden, da folgende Sensoren geöffnet sind",triggered_sensors:"Alarm wurde durch folgende Sensoren ausgelöst",bypassed_sensors:"Es gibt umgangene Sensoren"},Et={arm_options:Ct,editor:jt,errors:Mt},Tt={heading:"Επιλογές για όπλισμα",skip_delay:"Παράλειψη καθυστέρησης εξόδου",force:"Παράκαμψη ανοιχτών αισθητήρων"},Pt={keep_keypad_visible:"Κράτησε το πληκτρολόγιο πάντα ορατό, ακόμη και όταν δεν απαιτείται εισαγωγή κωδικού.",button_scale_actions:"Συντελεστής κλίμακας για αλλαγή μεγέθους των κουμπιών ενεργειών.",button_scale_keypad:"Συντελεστής κλίμακας για αλλαγή μεγέθους των κουμπιών του πληκτρολογίου.",show_messages:"Εμφάνιση διαγνωστικών μηνυμάτων όταν ενεργοποιείται ο συναγερμός ή δεν μπορεί να οπλιστεί.",show_ready_indicator:"Εμφάνιση ένδειξης έτοιμο/μη έτοιμο στα κουμπιά λειτουργίας όπλισης.",show_bypassed_sensors:"Εμφάνιση προειδοποιητικού μηνύματος όταν ο συναγερμός οπλίζεται με παρακαμφθέντες αισθητήρες.",use_code_dialog:"Εμφανίστε το πληκτρολόγιο για την εισαγωγή του κωδικού ως αναδυόμενο παράθυρο διαλόγου.",hide_keypad:"Απόκρυψη των κουμπιών του πληκτρολογίου για την εισαγωγή του κωδικού.",available_actions:"Διαθέσιμες ενέργειες:",action_dialog:{title:"Προσαρμογή εμφάνισης της ενέργειας '{action}'",show_button:{title:"Ορατότητα κουμπιού ενέργειας",options:{always:"Εμφανίζεται πάντα",never:"Ποτέ δεν εμφανίζεται",disarmed:"Εμφάνιση μόνο όταν είναι αφοπλισμένο",armed:"Εμφάνιση μόνο όταν είναι οπλισμένο"}},button_icon:"Εμφανιζόμενο εικονίδιο κουμπιού",state_label:"Αντικατάσταση ετικέτας κατάστασης",color:"Παράκαμψη χρώματος που χρησιμοποιείται για την ενέργεια"}},Rt={invalid_pin:"Ακυρος",blocking_sensors:"Δεν ήταν δυνατή η όπλιση λόγω των ακόλουθων αισθητήρων",triggered_sensors:"Ο συναγερμός ενεργοποιήθηκε από τους ακόλουθους αισθητήρες",bypassed_sensors:"Υπάρχουν παρακαμφθέντες αισθητήρες"},Nt={arm_options:Tt,editor:Pt,errors:Rt},Ht={heading:"Options for arming",skip_delay:"Skip exit delay",force:"Bypass open sensors"},Dt={keep_keypad_visible:"Keep the keypad always visible, also when no code input is required.",button_scale_actions:"Scaling factor to apply for resizing the action buttons.",button_scale_keypad:"Scaling factor to apply for resizing the keypad buttons.",show_messages:"Display diagnostic messages when alarm is triggered or cannot be armed.",show_ready_indicator:"Show ready/not ready indicator on arm mode buttons.",show_bypassed_sensors:"Show warning message when alarm is armed with bypassed sensors.",use_code_dialog:"Display the keypad for entering the code as a popup dialog.",hide_keypad:"Hide the keypad buttons for entering the code.",available_actions:"Available actions:",action_dialog:{title:"Customize display of action '{action}'",show_button:{title:"Button visibility",options:{always:"Always shown",never:"Never shown",disarmed:"Show only when disarmed",armed:"Hide only when disarmed"}},button_label:"Override displayed action label",button_icon:"Override displayed icon",state_label:"Override displayed state label",color:"Override color used for the action"}},Bt={invalid_pin:"Invalid",blocking_sensors:"Could not arm due to the following sensors",triggered_sensors:"Alarm was triggered by the following sensors",bypassed_sensors:"There are bypassed sensors"},It={arm_options:Ht,editor:Dt,errors:Bt},Lt={heading:"Opciones de armado",skip_delay:"Omitir el retardo de salida",force:"Pasar por alto los sensores abiertos"},Ft={keep_keypad_visible:"Mantener el teclado siempre visible, también cuando no se requiere ninguna entrada de código.",button_scale_actions:"Factor de escalado para cambiar el tamaño de los botones de acción.",button_scale_keypad:"Factor de escalado para cambiar el tamaño de los botones del teclado.",show_messages:"Mostrar mensajes de diagnóstico cuando se activa la alarma o no se puede activar.",show_ready_indicator:"Mostrar indicador listo/no listo en los botones de modo armado.",show_bypassed_sensors:"Mostrar advertencia cuando la alarma está activada con sensores omitidos.",use_code_dialog:"Muestra el teclado para ingresar el código como un cuadro de diálogo emergente.",hide_keypad:"Ocultar los botones del teclado para ingresar el código.",available_actions:"Acciones disponibles:",action_dialog:{title:"Personalizar la visualización de la acción '{action}'",show_button:{title:"Visibilidad del botón de acción",options:{always:"Mostrar siempre",never:"Ocultar siempre",disarmed:"Mostrar solo si desarmada",armed:"Ocultar solo si desarmada"}},button_label:"Sobrescribir el texto del botón",button_icon:"Icono de botón mostrado",state_label:"Sobrescribir el texto de estado",color:"Anular el color utilizado para la acción"}},Ut={invalid_pin:"Inválido",blocking_sensors:"No se pudo armar debido a los siguientes sensores",triggered_sensors:"La alarma fue disparada por los siguientes sensores",bypassed_sensors:"Hay sensores omitidos"},qt={arm_options:Lt,editor:Ft,errors:Ut},Wt={heading:"Options pour l'armement",skip_delay:"Ignorer le délai de sortie",force:"Bypasser les capteurs ouverts"},Vt={keep_keypad_visible:"Gardez le clavier toujours visible, même lorsqu'aucune saisie de code n'est requise.",button_scale_actions:"Facteur d'échelle à appliquer pour le redimensionnement des boutons des actions.",button_scale_keypad:"Facteur d'échelle à appliquer pour le redimensionnement des boutons du clavier.",show_messages:"Afficher les messages de diagnostic lorsque l'alarme est déclenchée ou ne peut pas être armée.",show_ready_indicator:"Afficher l'indicateur prêt/pas prêt sur les boutons de mode d'armement.",show_bypassed_sensors:"Afficher un avertissement lorsque l'alarme est armée avec des capteurs ignorés.",use_code_dialog:"Affichez le clavier pour saisir le code sous forme de boîte de dialogue contextuelle.",hide_keypad:"Masquer les boutons du clavier pour saisir le code.",available_actions:"Actions disponibles:",action_dialog:{title:"Personnaliser l'affichage de l'action '{action}'",show_button:{title:"Visibilité du bouton d'action",options:{always:"Toujours affiché",never:"Jamais affiché",disarmed:"Afficher uniquement si désarmé",armed:"Afficher uniquement si armé"}},button_label:"Remplacer le libellé du bouton",button_icon:"Icône de bouton affichée",state_label:"Remplacer l'étiquette d'état",color:"Remplacer la couleur utilisée pour l'action"}},Kt={invalid_pin:"Invalide",blocking_sensors:"Impossible d'armer en raison du(es) capteur(s) suivant(s)",triggered_sensors:"L'alarme a été déclenchée par le(s) capteur(s) suivant(s)",bypassed_sensors:"Il y a des capteurs ignorés"},Gt={arm_options:Wt,editor:Vt,errors:Kt},Zt={heading:"Opzioni di inserimento",skip_delay:"Ignorare il ritardo di uscita",force:"Ignorare i sensori aperti"},Yt={keep_keypad_visible:"Mantenere la tastiera sempre visibile, anche quando nessun codice è richiesto.",button_scale_actions:"Fattore di scala da applicare per ridimensionare i pulsanti di azione.",button_scale_keypad:"Fattore di scala da applicare per ridimensionare i pulsanti della tastiera.",show_messages:"Mostrare messaggi diagnostici quando l'allarme viene attivato o non può essere inserito.",show_ready_indicator:"Mostra l'indicatore pronto/non pronto sui pulsanti della modalità di inserimento.",show_bypassed_sensors:"Mostra avviso quando l'allarme è armato con sensori esclusi.",use_code_dialog:"Visualizza la tastiera per l'immissione del codice come finestra di dialogo popup.",hide_keypad:"Nascondi i pulsanti della tastiera per l'inserimento del codice.",available_actions:"Azioni disponibili:",action_dialog:{title:"Personalizzare la visualizzazione dell'azione '{action}'",show_button:{title:"Visibilità del pulsante di azione",options:{always:"Sempre visualizzato",never:"Mai visualizzato",disarmed:"Mostra solo quando disarmato",armed:"Mostra solo quando disarmato"}},button_label:"Sovrascrivere l'etichetta del pulsante",button_icon:"Icona del pulsante visualizzato",state_label:"Sovrascrivere l'etichetta di stato",color:"Sostituisci il colore utilizzato per l'azione"}},Jt={invalid_pin:"Non valido",blocking_sensors:"Impossibile inserire l'allarme a causa dei seguenti sensori",triggered_sensors:"L'allarme è stato attivato dai seguenti sensori",bypassed_sensors:"Sono presenti sensori esclusi"},Xt={arm_options:Zt,editor:Yt,errors:Jt},Qt={heading:"Opties voor inschakelen",skip_delay:"Sla vertraging over",force:"Negeer open sensoren"},ea={keep_keypad_visible:"Houd het keypad altijd zichtbaar, ook wanneer er geen code vereist is.",button_scale_actions:"Schaalfactor actieknoppen",button_scale_keypad:"Schaalfactor keypadknoppen",show_messages:"Toon diagnostische berichten wanneer het alarm wordt geactiveerd of niet kan worden ingeschakeld.",show_ready_indicator:"Toon gereed/niet gereed-indicator op inschakelmodusknoppen.",show_bypassed_sensors:"Toon melding wanneer het alarm is ingeschakeld met omzeilde sensoren.",use_code_dialog:"Geef het toetsenbord voor het invoeren van de code weer als een pop-upvenster.",hide_keypad:"Verberg het toetsenbord voor het invoeren van de code.",available_actions:"Beschikbare acties:",action_dialog:{title:"Weergave van actie '{action}' aanpassen",show_button:{title:"Actieknop weergave",options:{always:"Altijd zichtbaar",never:"Nooit zichtbaar",disarmed:"Toon alleen bij uitgeschakeld",armed:"Zichtbaar tenzij uitgeschakeld"}},button_label:"Weergegeven naam voor actie",button_icon:"Weergegeven icoon voor actie",state_label:"Weergegeven status",color:"Weergegeven kleur voor action"}},ta={invalid_pin:"Ongeldig",blocking_sensors:"Kon niet inschakelen vanwege de volgende sensoren",triggered_sensors:"Alarm werd geactiveerd door de volgende sensoren",bypassed_sensors:"Er zijn omzeilde sensoren"},aa={arm_options:Qt,editor:ea,errors:ta},sa={heading:"Opções para armar",skip_delay:"Omitir tempo para sair",force:"Ignorar os sensores abertos"},oa={keep_keypad_visible:"Mantenha o teclado sempre visível, mesmo quando não for necessária nenhuma entrada de código.",button_scale_actions:"Fator de escala para redimensionar botões de ação.",button_scale_keypad:"Fator de escala para redimensionar os botões do teclado.",show_messages:"Mostrar mensagens de diagnóstico quando o alarme estiver disparado ou não puder ser armado.",show_ready_indicator:"Mostrar indicador de disponível/não disponível nos botões do modo de armar.",show_bypassed_sensors:"Mostrar aviso quando o alarme for ativado com sensores ignorados.",use_code_dialog:"Exiba o teclado para inserir o código como uma caixa de diálogo pop-up.",hide_keypad:"Oculte os botões do teclado para inserir o código.",available_actions:"Ações disponíveis:",action_dialog:{title:"Personalize a exibição da ação '{action}'",show_button:{title:"Visibilidade do botão de ação",options:{always:"Sempre visível",never:"Sempre visível",disarmed:"Mostrar somente quando desarmado",armed:"Mostrar somente quando armado"}},button_label:"Substituir texto do botão",button_icon:"Ícone de botão exibido",state_label:"Substituir texto de status",color:"Substituir a cor usada para a ação"}},ia={invalid_pin:"Inválido",blocking_sensors:"Não foi possível armar devido aos seguintes sensores",triggered_sensors:"O alarme foi disparado pelos seguintes sensores",bypassed_sensors:"Existem sensores ignorados"},ra={arm_options:sa,editor:oa,errors:ia},na={heading:"Варианты постановки на охрану",skip_delay:"Задержка перед выходом",force:"Обход датчиков открытия"},la={keep_keypad_visible:"Клавиатура всегда видима, даже если ввод кода не требуется.",button_scale_actions:"Коэффициент масштабирования для изменения размера кнопок действий.",button_scale_keypad:"Коэффициент масштабирования для изменения размера кнопок клавиатуры.",show_messages:"Вывод диагностических сообщений, когда срабатывает сигнализация или ее невозможно включить.",show_ready_indicator:"Отображать индикатор готовности/неготовности на кнопках режима охраны.",show_bypassed_sensors:"Вывод предупреждающего сообщения, когда сигнализация включена с помощью обходных датчиков.",use_code_dialog:"Отобразить клавиатуру для ввода кода в виде всплывающего диалогового окна.",hide_keypad:"Скрыть кнопки клавиатуры для ввода кода.",available_actions:"Доступные действия:",action_dialog:{title:"Настройка отображения действия '{action}'",show_button:{title:"Видимость кнопки действия",options:{always:"Показывать всегда",never:"Показывать никогда",disarmed:"Показывать только при снятии с охраны",armed:"Показывать только при поддержании под охраной"}},button_label:"Измененение названия кнопки",button_icon:"Отображаемый значок кнопки",state_label:"Изменение названия состояния",color:"Переопределить цвет, используемый для действия"}},ca={invalid_pin:"Неверный",blocking_sensors:"Не удалось включить охрану из-за следующих датчиков",triggered_sensors:"Сигнал тревоги был вызван следующими датчиками",bypassed_sensors:"Есть обходные датчики"},da={arm_options:na,editor:la,errors:ca},ha={heading:"Alternativ vid aktivering",skip_delay:"Hoppa över lämna fördröjning",force:"Förbikoppla öppna sensorer"},pa={keep_keypad_visible:"Håll knappsatsen alltid synlig, även när ingen kodinmatning krävs.",button_scale_actions:"Ändra storlek på åtgärdsknapparna.",button_scale_keypad:"Ändra storlek på knapparna på knappsatsen.",show_messages:"Visa diagnostiska meddelanden när larmet utlöses eller inte kan aktiveras.",show_ready_indicator:"Visa redo/ej redo-indikator på lägesknapparna.",show_bypassed_sensors:"Visa varningsmeddelande när larmet är aktiverat med förbikopplade sensorer.",use_code_dialog:"Visa knappsatsen för att ange koden som en popup-dialogruta.",hide_keypad:"Dölj knapparna på tangentbordet för att ange koden.",available_actions:"Tillgängliga åtgärder:",action_dialog:{title:"Anpassa visningen av åtgärden '{action}'",show_button:{title:"Synlighet för åtgärdsknapp",options:{always:"Visas alltid",never:"Visas aldrig",disarmed:"Visa endast vid avaktivering",armed:"Visa endast vid aktivering"}},button_label:"Anpassad knappetikett",button_icon:"Visad knappikon",state_label:"Anpassad tillståndsetikett",color:"Åsidosättningsfärg som används för åtgärden"}},ua={invalid_pin:"Ogiltig",blocking_sensors:"Kunde inte aktivera på grund av följande sensorer",triggered_sensors:"Larmet utlöstes av följande sensorer",bypassed_sensors:"Det finns förbikopplade sensorer"},ma={arm_options:ha,editor:pa,errors:ua},ga={heading:"警戒选项",skip_delay:"跳过离开延迟",force:"绕过开放的传感器"},ba={keep_keypad_visible:"保持小键盘总是可见，即使不需要输入密码",button_scale_actions:"调整动作按键大小的缩放系数",button_scale_keypad:"调整小键盘按键大小的缩放系数",show_messages:"当警报被触发或无法警戒时，显示诊断信息。",show_ready_indicator:"在手臂模式按钮上显示就绪/未就绪指示器。",show_bypassed_sensors:"当警报配备旁路传感器时显示警告消息。",use_code_dialog:"以弹出对话框的形式显示用于输入代码的键盘。",hide_keypad:"隐藏用于输入代码的键盘按钮。",available_actions:"可用动作：",action_dialog:{title:"自定义动作'{action}'的显示",show_button:{title:"操作按钮可见性",options:{always:"始终显示",never:"从不显示",disarmed:"仅在解除武装时显示",armed:"仅在武装时显示"}},button_label:"覆盖按钮标签",button_icon:"显示的按钮图标",state_label:"覆盖状态标签",color:"覆盖操作使用的颜色"}},va={invalid_pin:"无效的",blocking_sensors:"由于以下传感器而无法警戒",triggered_sensors:"警报是由以下传感器触发的",bypassed_sensors:"有绕过的传感器"},_a={arm_options:ga,editor:ba,errors:va},fa={cs:Object.freeze({__proto__:null,arm_options:At,default:Ot,editor:St,errors:zt}),de:Object.freeze({__proto__:null,arm_options:Ct,default:Et,editor:jt,errors:Mt}),el:Object.freeze({__proto__:null,arm_options:Tt,default:Nt,editor:Pt,errors:Rt}),en:Object.freeze({__proto__:null,arm_options:Ht,default:It,editor:Dt,errors:Bt}),es:Object.freeze({__proto__:null,arm_options:Lt,default:qt,editor:Ft,errors:Ut}),fr:Object.freeze({__proto__:null,arm_options:Wt,default:Gt,editor:Vt,errors:Kt}),it:Object.freeze({__proto__:null,arm_options:Zt,default:Xt,editor:Yt,errors:Jt}),nl:Object.freeze({__proto__:null,arm_options:Qt,default:aa,editor:ea,errors:ta}),"pt-BR":Object.freeze({__proto__:null,arm_options:sa,default:ra,editor:oa,errors:ia}),ru:Object.freeze({__proto__:null,arm_options:na,default:da,editor:la,errors:ca}),sv:Object.freeze({__proto__:null,arm_options:ha,default:ma,editor:pa,errors:ua}),"zh-Hans":Object.freeze({__proto__:null,arm_options:ga,default:_a,editor:ba,errors:va})};function ya(e,t,a="",s=""){const o=t.replace(/['"]+/g,"");var i;try{i=e.split(".").reduce((e,t)=>e[t],fa[o])}catch(t){i=e.split(".").reduce((e,t)=>e[t],fa.en)}if(void 0===i&&(i=e.split(".").reduce((e,t)=>e[t],fa.en)),""!==a&&""!==s){Array.isArray(a)||(a=[a]),Array.isArray(s)||(s=[s]);for(let e=0;e<a.length;e++)i=i.replace(a[e],s[e])}return i}const wa=["1","2","3","4","5","6","7","8","9","0","clear","submit"];let xa=class extends($t(le)){constructor(){super(...arguments),this._input="",this._showClearButton=!1,this._narrow=!1,this._codeClearTimer=0}hassSubscribe(){return[this.hass.connection.subscribeMessage(e=>this._fetchData(e),{type:it})]}async _fetchData(e){var t;if(e.data.area_id===(null===(t=this._params)||void 0===t?void 0:t.area_id))switch(e.data.event){case ot.Disarm:case ot.Arm:case ot.Trigger:this._confirm(e.data.event);break;case ot.InvalidCodeProvided:case ot.NoCodeProvided:this._showCodeError();break;case ot.FailedToArm:case ot.CommandNotAllowed:this._confirm(e.data.event);case ot.TriggerTimeExpired:case ot.ReadyToArmModesChanged:}}shouldUpdate(e){const t=e.get("hass");return!(!e.has("_params")&&this._params)||(!!e.has("_input")||(!t||t.states[this._params.entity_id]!==this.hass.states[this._params.entity_id]&&(t.states[this._params.entity_id],this.hass.states[this._params.entity_id],!0)))}firstUpdated(e){super.firstUpdated(e),this.addEventListener("keypress",e=>{"Enter"===e.key&&this._input.length&&this._submit()})}async showDialog(e){this._params=e,this._input="",this._narrow=matchMedia("all and (max-width: 450px), all and (max-height: 500px)").matches,await this.updateComplete}closeDialog(){return this._params=void 0,this._showClearButton=!1,!0}_showCodeError(){var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#code");t&&(t.classList.remove("error"),t.classList.add("error"),t.hint=ya("errors.invalid_pin",this.hass.language))}_clearCodeError(){var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#code");t&&t.classList.contains("error")&&(t.classList.remove("error"),t.hint="",this._input="",this._cancelCodeClearTimer())}_clearCode(){this._input="",this._clearCodeError(),this._cancelCodeClearTimer()}_setCodeClearTimer(){this._cancelCodeClearTimer(),this._input.length&&(this._codeClearTimer=window.setTimeout(()=>{this._clearCode()},12e4))}_cancelCodeClearTimer(){this._codeClearTimer&&clearTimeout(this._codeClearTimer)}_submit(){var e;const t=null!==(e=this._input)&&void 0!==e?e:"";this._clearCodeError(),this._params.action==tt.Disarm?this.hass.callService("alarmo","disarm",{entity_id:this._params.entity_id,code:t}):this.hass.callService("alarmo","arm",Object.assign(Object.assign({},this._params.armOptions),{entity_id:this._params.entity_id,mode:st[this._params.action],code:t}))}_confirm(e){var t,a;null===(a=null===(t=this._params)||void 0===t?void 0:t.confirm)||void 0===a||a.call(t,e),this.closeDialog()}_cancel(){var e,t;null===(t=null===(e=this._params)||void 0===e?void 0:e.cancel)||void 0===t||t.call(e),this.closeDialog()}_numberClick(e){const t=e.currentTarget.value;this._clearCodeError(),this._setCodeClearTimer(),this._input=this._input+t,this._showClearButton=!0}_clear(){this._input="",this._showClearButton=!1}render(){if(!this._params||!this.hass)return V;return"text"===this._params.code_format?q`
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
      `:q`
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
            ${wa.map(e=>""===e?q`<span></span>`:"clear"===e?q`
                      <ha-control-button
                        @click=${this._clear}
                        class="clear"
                        .disabled=${!this._showClearButton}
                        .label=${this.hass.localize("ui.common.clear")}
                      >
                        <ha-svg-icon path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}></ha-svg-icon>
                      </ha-control-button>
                    `:"submit"===e?q`
                        <ha-control-button
                          @click=${this._submit}
                          class="submit"
                          .label=${this.hass.localize("ui.common.submit")}
                        >
                          <ha-svg-icon path=${"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"}></ha-svg-icon>
                        </ha-control-button>
                      `:q`
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
    `}};xa.styles=n`
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
  `,t([ue({attribute:!1})],xa.prototype,"hass",void 0),t([me()],xa.prototype,"_params",void 0),t([me()],xa.prototype,"_input",void 0),t([me()],xa.prototype,"_showClearButton",void 0),t([me()],xa.prototype,"_narrow",void 0),xa=t([de("hmac-code-dialog")],xa);var ka=Object.freeze({__proto__:null,get AlarmoCodeDialog(){return xa}});let $a=class extends le{render(){if(!this.hass||!this.config)return V;const e=this.hass.states[this.config.entity];let t=e.state;const a=Object.values(tt).map(e=>st[e]);if(!a.includes(t)){const a=e.attributes.arm_mode;a&&(t=a)}const s=this.config.button_style||{};return q`
      <div class="container ${s.text_follows_icon?"follow":""} ${"round"===this.config.shape?"round":""} ${this.config.fit?"fit":""}"
        style=${[s.track?`--b-track:${String("none"===s.track?"transparent":s.track).replace(/[;{}<>]/g,"")};--b-track-opacity:1`:"",void 0!==this.config.gap?`--b-gap:${Number(this.config.gap)}px`:"",void 0!==this.config.padding?`--b-pad:${Number(this.config.padding)}px`:""].filter(Boolean).join(";")}>
        ${this._renderOptions(t)}
      </div>
    `}_renderOptions(e){const t=this.hass.states[this.config.entity],a=[tt.Disarm,...bt(t)].filter(e=>{const a=gt(st[e],this.config).hide;if("boolean"==typeof a||!pt(a))return!a;switch(a){case"always":return!1;case"never":return!0;case"armed":return"disarmed"==t.state;case"disarmed":return"disarmed"!==t.state}}),s=a.map(e=>gt(st[e],this.config)).some(e=>!pt(e.button_label)||e.button_label.length);return a.sort((e,t)=>{const a=gt(st[e],this.config).button_order,s=gt(st[t],this.config).button_order;return pt(a)||pt(s)?pt(a)&&!pt(s)?-1:!pt(a)&&pt(s)?1:a-s:0}),a.map(a=>{const o=pt(this.readyForArmModes)&&!this.readyForArmModes.includes(st[a])&&a!=tt.Disarm,i=gt(st[a],this.config);return q`
        <div class="button ${st[a]==e?`selected ${(this.config.fx_classes||[]).join(" ")}`:""}"
          style="${this._buttonStyle(ft(Object.assign(Object.assign({},t),{state:st[a]}),this.config))}"
          @click=${e=>this._handleClick(e,a)}>
          <div class="content ${s&&!1!==this.config.show_labels?"has-text":""}">
            ${!1===this.config.show_icons?V:q`<ha-icon icon="${ut(i.button_icon)?at[a]:i.button_icon}"></ha-icon>`}
            ${st[a]!=e&&pt(this.readyForArmModes)&&o?q`
              <ha-icon
                icon="${"mdi:circle-medium"}"
                class="badge ${o?"error":"success"}"
              ></ha-icon>
            `:V}
            ${!1===this.config.show_labels?V:q`<span>
              ${pt(i.button_label)?i.button_label:a==tt.Disarm&&t.state!==Qe.Disarmed?this.hass.localize(`ui.card.alarm_control_panel.${a}`):this.hass.localize(`ui.card.alarm_control_panel.modes.${st[a]}`)}
            </span>`}
          </div>
        </div>
      `})}_buttonStyle(e){const t=this.config.button_style||{},a=this.config.icon_style||{},s=t=>void 0===t||""===t?void 0:"mode"===t?e:"none"===t?"transparent":String(t).replace(/[;{}<>]/g,"");return[["--btn-color",e],["--b-bg",s(t.background)],["--b-abg",s(t.active_background)],["--b-bd",s(t.border)],["--b-abd",s(t.active_border)],["--b-ic",s(a.color)],["--b-aic",s(a.active_color)]].filter(([,e])=>e).map(([e,t])=>`${e}:${t}`).join(";")}_handleClick(e,t){dt(this,"button-clicked",{ev:e,action:t})}static get styles(){return n`
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
    `}};t([ue({attribute:!1})],$a.prototype,"hass",void 0),t([ue({attribute:!1})],$a.prototype,"config",void 0),t([ue({attribute:!1})],$a.prototype,"readyForArmModes",void 0),$a=t([de("hmac-actions-bar")],$a);const Aa=["1","2","3","4","5","6","7","8","9","","0","clear"],Sa=new Map;let za=class extends($t(le)){constructor(){super(...arguments),this._input="",this.warning="",this.area_id=void 0,this.armOptions=Object.assign({},lt),this.readyForArmModes=null,this.backendConnection=null,this.showBypassedSensors=!1,this.subscribedEntities=[],this._codeClearTimer=0}async getCardSize(){var e;if(!this._config||!this.hass)return 9;const t=this.hass.states[this._config.entity];return t&&(null===(e=this._alarmoConfig)||void 0===e?void 0:e.code_format)===Xe?!_t(t)&&!this._config.keep_keypad_visible||this._config.use_code_dialog?4:9:4}set cardConfig(e){e&&JSON.stringify(e)!==JSON.stringify(this._cardConfigRaw)&&(this._cardConfigRaw=e,this.setConfig(e))}setConfig(e){!(null==e?void 0:e.button_scale_actions)&&(null==e?void 0:e.button_scale)&&(e=Object.assign(Object.assign({},e),{button_scale_actions:null==e?void 0:e.button_scale})),!(null==e?void 0:e.button_scale_keypad)&&(null==e?void 0:e.button_scale)&&(e=Object.assign(Object.assign({},e),{button_scale_keypad:null==e?void 0:e.button_scale})),(e=>{if(!e||!e.entity||"alarm_control_panel"!==mt(e.entity))throw new Error("Invalid configuration provided for entity");if(pt(e.button_scale_keypad)&&("number"!=typeof e.button_scale_keypad||e.button_scale_keypad<1||e.button_scale_keypad>2.5))throw new Error("Invalid configuration provided for button_scale_keypad");if(pt(e.button_scale_actions)&&("number"!=typeof e.button_scale_actions||e.button_scale_actions<1||e.button_scale_actions>2.5))throw new Error("Invalid configuration provided for button_scale_actions")})(e),this._config=Object.assign(Object.assign({},nt),e),this.restoreBackend()}hassSubscribe(){return[this.hass.connection.subscribeMessage(e=>this._fetchData(e),{type:it})]}restoreBackend(){const e=this._config?Sa.get(this._config.entity):void 0;e&&!this.backendConnection&&(this.area_id=e.area_id,this._alarmoConfig=e.alarmoConfig,this.readyForArmModes=e.ready,this.backendConnection=!0)}async firstUpdated(){this.restoreBackend();const e=await window.loadCardHelpers(),t=await e.createCardElement({type:"entities",entities:[]});await t.constructor.getConfigElement(),await this.loadBackendConfig()}async loadBackendConfig(){var e;this.backendConnection&&!Sa.has(this._config.entity)||(e=this.hass,e.callWS({type:"alarmo/entities"})).then(e=>{const t=e.find(e=>e.entity_id==this._config.entity);t&&(this.area_id=t.area_id?t.area_id:null)}).then(()=>(e=>e.callWS({type:"alarmo/config"}))(this.hass)).then(e=>{this._alarmoConfig=e,this.backendConnection=!0}).then(()=>((e,t)=>e.callWS({type:"alarmo/ready_to_arm_modes",entity_id:t}))(this.hass,this._config.entity)).then(e=>{this.readyForArmModes=e.modes,Sa.set(this._config.entity,{area_id:this.area_id,alarmoConfig:this._alarmoConfig,ready:e.modes})}).catch(e=>{this.backendConnection=!1})}async _fetchData(e){if(e.data.area_id===this.area_id)switch(e.data.event){case ot.Arm:this._clearCode();break;case ot.Trigger:break;case ot.InvalidCodeProvided:case ot.NoCodeProvided:this._showCodeError(),this.subscribedEntities=[];break;case ot.FailedToArm:this.warning="blocking_sensors",this._last_command=e.data.command,this._last_code=this._input,this._clearCode();break;case ot.CommandNotAllowed:this._clearCode();break;case ot.TriggerTimeExpired:break;case ot.ReadyToArmModesChanged:this.readyForArmModes=e.data.modes}}shouldUpdate(e){if(e.has("_config"))return!0;const t=e.get("hass");if(!t||t.themes!==this.hass.themes||t.language!==this.hass.language||t.config.state!==this.hass.config.state)return!0;if(t.states[this._config.entity]!==this.hass.states[this._config.entity]){const e=t.states[this._config.entity],a=this.hass.states[this._config.entity];return!1===this.backendConnection&&(async()=>{await this.loadBackendConfig()})(),this.processStateUpdate(e,a),!0}return!(!this.subscribedEntities.length||!this.subscribedEntities.some(e=>t.states[e]!==this.hass.states[e]))}processStateUpdate(e,t){t.state!=e.state&&(this.subscribedEntities=[]),(t.state==Qe.Disarmed||t.last_changed!==e.last_changed)&&this._clearCode()}render(){var e,t;if(!this._config||!this.hass||null===this.backendConnection)return q``;const a=this.hass.states[this._config.entity];return a?!1===this.backendConnection?q`
        <hui-warning>
          Could not establish a connection with the alarmo integration. Please check if it is installed and the correct
          entity is selected in the card settings.
        </hui-warning>
      `:q`
      <ha-card>
        ${"controls"===this._config.part?"":q`
        <div class="header">
${!1===this._config.show_icon?"":q`<div class="icon">
            <hmac-state-badge
              .hass=${this.hass}
              .entity=${this._config.entity}
              style="--alarm-state-color: ${ft(a,this._config)}"
            >
            </hmac-state-badge>
          </div>`}
          <div class="summary">
            ${!1===this._config.show_name?"":q`<div class="name">
              ${((e,t)=>ut(t.name)?e.attributes.friendly_name:t.name)(a,this._config)}
            </div>`}
            ${!1===this._config.show_state?"":q`<div class="state">
              ${vt(a,this.hass.localize,this._config)}
            </div>`}
          </div>
        </div>
        `}
        ${"status"===this._config.part?"":q`
        ${this._renderWarning()}

        <div id="actions" class="actions">
          ${this._renderActions()}
        </div>

        ${a.state===Qe.Disarmed&&!1!==this._config.show_arm_options?q`
          <div class="chips" role="group" aria-label=${ya("arm_options.heading",this.hass.language)}>
            ${["skip_delay","force"].map(e=>q`
              <button class="chip ${this.armOptions[e]?"on":""}" aria-pressed=${this.armOptions[e]?"true":"false"}
                @click=${t=>this._toggleArmOptions(t,e)}>
                <ha-icon icon=${this.armOptions[e]?"mdi:check":"skip_delay"===e?"mdi:timer-off-outline":"mdi:shield-alert-outline"}></ha-icon>
                ${ya(`arm_options.${e}`,this.hass.language)}
              </button>`)}
          </div>`:""}

        ${!_t(a)&&!this._config.keep_keypad_visible||this._config.use_code_dialog?q``:q`
              <ha-input
                .value=${this._input}
                .label=${this.hass.localize("ui.card.alarm_control_panel.code")}
                ?disabled=${!_t(a)}
                @input=${e=>{this._clearCodeError(),this._input=e.target.value,this._setCodeClearTimer()}}
                @focus=${this._clearCodeError}
                type="password"
                id="code_input"
                .inputmode=${(null===(e=this._alarmoConfig)||void 0===e?void 0:e.code_format)===Xe?"numeric":"text"}
              ></ha-input>
            `}
        ${!_t(a)&&!this._config.keep_keypad_visible||(null===(t=this._alarmoConfig)||void 0===t?void 0:t.code_format)!==Xe||this._config.use_code_dialog||this._config.hide_keypad?q``:q`
          <div id="keypad" class="keypad" style="max-width: ${300*this._config.button_scale_keypad}px">
            ${Aa.map(e=>""===e?q`
              <hmac-button
                disabled
                style="--content-scale: ${this._config.button_scale_keypad}"
                ?scaled=${1!=this._config.button_scale_keypad}
                class="placeholder"
              ></hmac-button>
            `:q`
              <hmac-button
                .value="${e}"
                @click=${this._handlePadClick}
                ?disabled=${!_t(a)||"clear"===e&&!this._input.length}
                class="${"clear"!==e?"numberKey":"clear"}"
                style="--content-scale: ${this._config.button_scale_keypad}"
                ?scaled=${1!=this._config.button_scale_keypad}
              >
                ${"clear"===e?q`<ha-icon icon="mdi:close" style="--mdc-icon-size: calc(${this._config.button_scale_keypad} * 24px)"></ha-icon>`:q` <span>${e}</span>`}
              </hmac-button>
            `)}
          </div>
        `}
        `}
      </ha-card>
    `:q`
        <hui-warning>
          ${"NOT_RUNNING"!==this.hass.config.state?this.hass.localize("ui.panel.lovelace.warning.entity_not_found","entity",this._config.entity||"[empty]"):this.hass.localize("ui.panel.lovelace.warning.starting")}
        </hui-warning>
      `}_renderActions(){if(!this.hass||!this._config)return q``;const e=this.hass.states[this._config.entity],t=this._config.show_ready_indicator;return q`
      <hmac-actions-bar
        @button-clicked=${e=>this._handleActionClick(e,e.detail.action)}
        .hass=${this.hass}
        .config=${this._config}
        .readyForArmModes=${t?this.readyForArmModes:void 0}
        style="--alarm-state-color: ${ft(e,this._config,!0)}; --content-scale: ${this._config.button_scale_actions}"
      ></hmac-actions-bar>
    `}_renderWarning(){var e;if(!this.hass||!this._config||!this._config.show_messages)return q``;const t=this.hass.states[this._config.entity];return t.attributes.open_sensors&&t.state==Qe.Triggered||"blocking_sensors"==this.warning&&t.attributes.open_sensors?q`
        <div class="messagebox">
          <div class="messagebox-left"></div>
          <div class="messagebox-inner">
            <div class="description">
              <div class="description-filler"></div>
              <span>
                <ha-icon icon="hass:alert"></ha-icon>
                ${"blocking_sensors"==this.warning?ya("errors.blocking_sensors",this.hass.language):ya("errors.triggered_sensors",this.hass.language)}
              </span>
              <div class="description-filler"></div>
            </div>
            <div class="content">
              ${Object.entries(t.attributes.open_sensors).map(([e])=>(this.subscribedEntities.includes(e)||this.subscribedEntities.push(e),q`
                  <div class="badge">
                    <hmac-sensor-badge .hass=${this.hass} .entity=${e}> </hmac-sensor-badge>
                  </div>
                `))}
            </div>
          ${"blocking_sensors"==this.warning&&t.attributes.open_sensors?q`
            <hmac-button
              @click=${this._forceRetryClick}
              style="--content-scale: ${this._config.button_scale_actions}"
              ?scaled=${1!=this._config.button_scale_actions}
            >
              <span>${ya("arm_options.force",this.hass.language)}</span>
            </hmac-button>
          `:""}
          </div>
          <div class="messagebox-right"></div>
        </div>
      `:t.state.startsWith("armed_")&&(null===(e=t.attributes.bypassed_sensors)||void 0===e?void 0:e.length)&&this._config.show_bypassed_sensors?q`
        <div class="messagebox warning">
          <div class="messagebox-left"></div>
          <div class="messagebox-inner">
            <div class="description">
              <div class="description-filler"></div>
              <span>
                <ha-icon icon="hass:alert"></ha-icon>
                ${ya("errors.bypassed_sensors",this.hass.language)}
              </span>
              <div class="description-filler"></div>
            </div>
            <div class="content">
              ${t.attributes.bypassed_sensors.map(e=>(this.subscribedEntities.includes(e)||this.subscribedEntities.push(e),q`
                  <div class="badge">
                    <hmac-sensor-badge .hass=${this.hass} .entity=${e}> </hmac-sensor-badge>
                  </div>
                `))}
            </div>
          </div>
          <div class="messagebox-right"></div>
        </div>
      `:q``}_handlePadClick(e){const t=e.currentTarget.value;this._clearCodeError(),this._input="clear"===t?"":this._input+t}async _handleActionClick(e,t){var a;e.target.blur(),this._clearCodeError();const s=this.hass.states[this._config.entity];if((null===(a=this._config)||void 0===a?void 0:a.use_code_dialog)&&!this._config.hide_keypad&&_t(s)){const a=await new Promise(a=>{const s=e.target,o={code_format:this._alarmoConfig.code_format,area_id:this.area_id,entity_id:this._config.entity,action:t,armOptions:this.armOptions,cancel:()=>{a(null)},confirm:e=>{a(e)}};dt(s,"show-dialog",{dialogTag:"hmac-code-dialog",dialogImport:()=>Promise.resolve().then(function(){return ka}),dialogParams:o})});a!=ot.Arm&&a!=ot.Disarm||(this.warning="",this.armOptions=Object.assign({},lt))}else t==tt.Disarm?this.hass.callService("alarmo","disarm",{entity_id:this._config.entity,code:this._input}):this.hass.callService("alarmo","arm",Object.assign(Object.assign({},this.armOptions),{entity_id:this._config.entity,mode:st[t],code:this._input})),this.warning="",this.armOptions=Object.assign({},lt)}_showCodeError(){var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#code_input");t&&(t.classList.remove("error"),t.classList.add("error"),t.hint=ya("errors.invalid_pin",this.hass.language))}_clearCodeError(){var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#code_input");t&&t.classList.contains("error")&&(t.classList.remove("error"),t.hint="",this._input="",this._cancelCodeClearTimer())}_clearCode(){this._input="",this._clearCodeError(),this._cancelCodeClearTimer()}_setCodeClearTimer(){this._cancelCodeClearTimer(),this._input.length&&(this._codeClearTimer=window.setTimeout(()=>{this._clearCode()},12e4))}_cancelCodeClearTimer(){this._codeClearTimer&&clearTimeout(this._codeClearTimer)}_toggleArmOptions(e,t){e.stopImmediatePropagation(),e.target.blur(),"skip_delay"==t?this.armOptions=Object.assign(Object.assign({},this.armOptions),{skip_delay:!this.armOptions.skip_delay}):"force"==t&&(this.armOptions=Object.assign(Object.assign({},this.armOptions),{force:!this.armOptions.force}))}_forceRetryClick(){if(!this.hass||!this._config||!this._last_command)return;let e=this._last_command;this.hass.callService("alarmo","arm",{entity_id:this._config.entity,mode:st[e],code:this._last_code,force:!0}),this._last_command=void 0,this._last_code=void 0}static get styles(){return n`
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
    `}};t([ue({attribute:!1})],za.prototype,"hass",void 0),t([me()],za.prototype,"_config",void 0),t([me()],za.prototype,"_alarmoConfig",void 0),t([me()],za.prototype,"_input",void 0),t([me()],za.prototype,"warning",void 0),t([me()],za.prototype,"area_id",void 0),t([me()],za.prototype,"armOptions",void 0),t([me()],za.prototype,"readyForArmModes",void 0),t([me()],za.prototype,"backendConnection",void 0),t([me()],za.prototype,"showBypassedSensors",void 0),t([ue({attribute:!1})],za.prototype,"cardConfig",null),za=t([de("hmac-alarm")],za);const Oa="2026.11.06.67";var Ca,ja,Ma,Ea;!function(e){e.STATE_ALARM_DISARMED="disarmed",e.STATE_ALARM_ARMED_HOME="armed_home",e.STATE_ALARM_ARMED_AWAY="armed_away",e.STATE_ALARM_ARMED_NIGHT="armed_night",e.STATE_ALARM_ARMED_CUSTOM_BYPASS="armed_custom_bypass",e.STATE_ALARM_ARMED_VACATION="armed_vacation",e.STATE_ALARM_PENDING="pending",e.STATE_ALARM_ARMING="arming",e.STATE_ALARM_TRIGGERED="triggered"}(Ca||(Ca={})),function(e){e.COMMAND_ALARM_DISARM="disarm",e.COMMAND_ALARM_ARM_HOME="arm_home",e.COMMAND_ALARM_ARM_AWAY="arm_away",e.COMMAND_ALARM_ARM_NIGHT="arm_night",e.COMMAND_ALARM_ARM_CUSTOM_BYPASS="arm_custom_bypass",e.COMMAND_ALARM_ARM_VACATION="arm_vacation"}(ja||(ja={})),function(e){e.Door="door",e.Window="window",e.Motion="motion",e.Tamper="tamper",e.Environmental="environmental",e.Other="other"}(Ma||(Ma={})),function(e){e.Notification="notification",e.Action="action"}(Ea||(Ea={}));const Ta=[["var(--primary-color)","Primary"],["var(--accent-color)","Accent"],["var(--primary-text-color)","Primary text"],["var(--secondary-text-color)","Secondary text"],["var(--disabled-text-color)","Disabled text"],["var(--state-active-color)","State active"],["var(--error-color)","Error"],["var(--warning-color)","Warning"],["var(--success-color)","Success"],["var(--info-color)","Info"]],Pa=["keep_keypad_visible","use_code_dialog","hide_keypad","show_messages","show_ready_indicator","show_bypassed_sensors"],Ra={keep_keypad_visible:!1,use_code_dialog:!1,hide_keypad:!1,show_messages:!0,show_ready_indicator:!0,show_bypassed_sensors:!0},Na={keep_keypad_visible:"Always show the code keypad",use_code_dialog:"Ask for the code in a dialog",hide_keypad:"Hide the code keypad",show_messages:"Messages (not ready, triggered)",show_ready_indicator:"Ready dot on the arm buttons",show_bypassed_sensors:"Warn about bypassed zones"},Ha=[300,400,500,600,700,800],Da=[["monospace","Monospace (panel display)"],["sans","Sans-serif (theme)"],["serif","Serif"]],Ba={monospace:"monospace",sans:"sans-serif",serif:"serif"},Ia=e=>JSON.parse(JSON.stringify(null!=e?e:null));let La=class extends le{constructor(){super(...arguments),this.onlyOne=e=>{var t;const a=e.currentTarget;if(!a.open)return;const s=a.classList.contains("panel")?"panel":"sub";for(const e of Array.from((null===(t=a.parentElement)||void 0===t?void 0:t.children)||[]))e!==a&&e instanceof HTMLDetailsElement&&e.classList.contains(s)&&e.open&&(e.open=!1)}}setConfig(e){this.config=Ze(e)}disconnectedCallback(){super.disconnectedCallback(),Ke.on&&Ke.set(!1)}setFxPart(e,t,a){const s=Object.assign({},(this.config||{}).effects||{}),o=Object.assign({},s[e]||{});a&&"none"!==a?o[t]=a:delete o[t],Object.keys(o).length?s[e]=o:delete s[e],this.emit(Object.assign(Object.assign({},this.config),{effects:s}))}setFx(e,t){const a=Object.assign({},(this.config||{}).effects||{});void 0===t||""===t||"none"===t?delete a[e]:a[e]=t,this.emit(Object.assign(Object.assign({},this.config),{effects:a}))}setMap(e,t,a){var s;const o=Object.assign({},(null===(s=this.config)||void 0===s?void 0:s[e])||{});void 0===a||""===a?delete o[t]:o[t]=a,this.set(e,Object.keys(o).length?o:void 0)}sectionBg(e){return q`${this.group("Background")}
      ${this.color("Section background",this.styleOf(e).background,"Card background","#262626",t=>this.setStyle(e,"background",t))}`}effectsBody(){var e;const t=(null===(e=this.config)||void 0===e?void 0:e.effects)||{},a=t.when||Ue.when,s=[["none","Off"],["glow","Glow"],["pulse","Pulse"],["both","Glow + pulse"]],o={background:"Background",border:"Border",icon:"Icon"};return q`
      ${Object.keys(Ie).map(e=>q`
        ${this.group(Ie[e].label)}
        ${Be.filter(t=>Ie[e].parts.includes(t)).map(a=>{var i;return this.select(o[a],(null===(i=t[e])||void 0===i?void 0:i[a])||"none",s,t=>this.setFxPart(e,a,t))})}`)}
      ${t.mode_button||t.arm_button?q`<p class="hint">Buttons glow and pulse in their own House Mode / arm mode color.</p>`:V}
      ${this.group("When")}
      ${Le.map(e=>this.toggle(Fe[e],a.includes(e),t=>{const s=t?[...new Set([...a,e])]:a.filter(t=>t!==e);this.setFx("when",Le.every(e=>s.includes(e))?void 0:s)}))}
      ${this.group("Look")}
      ${this.slider("Glow size",t.size||0,2,60,1," px",Ue.size,e=>this.setFx("size",e||void 0))}
      ${this.slider("Pulse speed",t.speed||0,.4,6,.1," s",Ue.speed,e=>this.setFx("speed",e?Math.round(10*e)/10:void 0))}
      ${this.color("Effect color",t.color,"State color (the border color)","#ff9800",e=>this.setFx("color",e))}
      ${this.group("Try it")}
      ${this.toggle("Preview the effects now",Ke.on,e=>{Ke.set(e),this.requestUpdate()},"for 20 s; not saved")}
    `}displayBody(){const e=this.cfg.display_replace||[],t=e=>this.set("display_replace",e.length?e:void 0);return q`
      ${this.group("Panel display text")}
      <div class="row"><span class="lab">Replace</span>
        <button class="add" @click=${()=>t([...e,{from:"",to:""}])}>+ Replacement</button></div>
      ${e.map((a,s)=>q`<div class="row rep">
        <input type="text" aria-label="Find" placeholder="find" .value=${a.from||""}
          @change=${a=>t(e.map((e,t)=>t===s?Object.assign(Object.assign({},e),{from:a.target.value}):e))} />
        <span class="lab">→</span>
        <input type="text" aria-label="Replace with" placeholder="replace with (empty = remove)" .value=${a.to||""}
          @change=${a=>t(e.map((e,t)=>t===s?Object.assign(Object.assign({},e),{to:a.target.value||void 0}):e))} />
        <button class="icon-btn del" title="Remove" aria-label="Remove" @click=${()=>t(e.filter((e,t)=>t!==s))}>
          <ha-icon icon="mdi:trash-can-outline"></ha-icon></button>
      </div>`)}
      <p class="hint">Applied in order, to each line; exact text, case sensitive. Replace "*" with nothing to turn
        ****DISARMED**** into DISARMED.</p>
    `}firstUpdated(){var e;null===(e=this.hass)||void 0===e||e.callWS({type:"alarmo/ext/card/get"}).then(e=>this.data=e).catch(()=>{})}get cfg(){return Object.assign(Object.assign({},fe),this.config||{})}emit(e){const t=Object.assign({},e);for(const[e,a]of Object.entries(fe))t[e]===a&&delete t[e];Array.isArray(t.hidden_modes)&&!t.hidden_modes.length&&delete t.hidden_modes;const a=Te(t.styles);if(a?t.styles=a:delete t.styles,t.alarm){for(const[e,a]of Object.entries(Ra))t.alarm[e]===a&&delete t.alarm[e];for(const e of["button_scale_actions","button_scale_keypad"])1===t.alarm[e]&&delete t.alarm[e];Object.keys(t.alarm).length||delete t.alarm}t.name||delete t.name,delete t.alarm_colors_from_modes;const s=ke(t);t.status_sections=s.sections.map(e=>{const t=Object.assign({},e);return!0===t.show&&delete t.show,t.countdown||delete t.countdown,t.collapsible||delete t.collapsible,!0===t.start_collapsed&&delete t.start_collapsed,"house"===t.icon&&delete t.icon,t.background||delete t.background,t.styles&&!Object.keys(Te(t.styles)||{}).length?delete t.styles:t.styles&&(t.styles=Te(t.styles)),t}),t.section_order=s.order;for(const e of $e)delete t[e];t.styles&&(delete t.styles.header_section,delete t.styles.alarm_status_section,Object.keys(t.styles).length||delete t.styles);for(const e of["effects","mode_colors","arm_colors","key_flash"])t[e]&&!Object.keys(t[e]).length&&delete t[e];t.entity||delete t.entity,this.config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}set(e,t){this.emit(Object.assign(Object.assign({},this.config),{[e]:t}))}setAlarm(e,t){const a=Object.assign(Object.assign({},(this.config||{}).alarm||{}),{[e]:t});this.emit(Object.assign(Object.assign({},this.config),{alarm:a}))}setStyle(e,t,a){const s=Ia((this.config||{}).styles||{});s[e]=Object.assign({},s[e]||{}),void 0===a||""===a||null===a?delete s[e][t]:s[e][t]=a,this.emit(Object.assign(Object.assign({},this.config),{styles:s}))}styleOf(e){return((this.config||{}).styles||{})[e]||{}}toggle(e,t,a,s){return q`<label class="row check">
      <input type="checkbox" .checked=${t} @change=${e=>a(e.target.checked)} />
      <span>${e}</span>${s?q`<span class="hint inline">${s}</span>`:V}
    </label>`}slider(e,t,a,s,o,i,r,n,l=!0){return q`<div class="row slider">
      <span class="lab">${e}</span>
      <div class="ctl nowrap">
        <input type="range" .min=${String(l?0:a)} .max=${String(s)} .step=${String(o)}
          .value=${String(t||(l?0:a))}
          @input=${e=>{const t=Number(e.target.value);n(l&&t>0&&t<a?a:t)}} />
        <span class="val">${l&&!t?q`<span class="muted">${r}${i}</span>`:q`${t}${i}`}</span>
      </div>
    </div>`}select(e,t,a,s){return q`<div class="row">
      <span class="lab">${e}</span>
      <select class="ctl" @change=${e=>s(e.target.value)}>
        ${a.map(([e,a])=>q`<option value=${e} ?selected=${e===t}>${a}</option>`)}
      </select>
    </div>`}triState(e,t,a,s){const o=void 0===t?"":t?"on":"off";return this.select(e,o,[["",a],["off","Off"],["on","On"]],e=>s(""===e?void 0:"on"===e))}color(e,t,a,s,o,i=[]){const r=i.find(([e])=>e===t),n=r?`preset:${r[0]}`:(e=>{const t=null==e?"":String(e);return""===t?"default":/^#[0-9a-fA-F]{3,8}$/.test(t)?"custom":/^var\(/.test(t)&&Ta.some(([e])=>e===t)?"theme":"css"})(t),l=/^#[0-9a-fA-F]{6}$/.test(t||"")?t:s;return q`<div class="row">
      <span class="lab">${e}</span>
      <div class="ctl color">
        <select aria-label=${`${e}: kind`} @change=${e=>{const a=e.target.value;a.startsWith("preset:")?o(a.slice(7)):o("default"===a?void 0:"theme"===a?Ta[0][0]:"custom"===a?l:!t||"theme"!==n&&"custom"!==n&&"css"!==n?s:t)}}>
          <option value="default" ?selected=${"default"===n}>${a}</option>
          ${i.map(([e,t])=>q`<option value=${`preset:${e}`} ?selected=${n===`preset:${e}`}>${t}</option>`)}
          <option value="theme" ?selected=${"theme"===n}>Theme color</option>
          <option value="custom" ?selected=${"custom"===n}>Custom color</option>
          <option value="css" ?selected=${"css"===n}>CSS value</option>
        </select>
        ${"theme"===n?q`<select aria-label=${`${e}: theme color`} @change=${e=>o(e.target.value)}>
              ${Ta.map(([e,a])=>q`<option value=${e} ?selected=${e===t}>${a}</option>`)}
            </select>`:"custom"===n?q`<input type="color" aria-label=${e} .value=${l} @input=${e=>o(e.target.value)} />`:"css"===n?q`<input type="text" aria-label=${e} placeholder="tomato, rgba(…), var(--…)" .value=${t||""}
                  @change=${e=>o(e.target.value||void 0)} />`:V}
      </div>
    </div>`}panel(e,t,a,s,o,i=!1){return q`<details class="panel" ?open=${i} data-id=${e} @toggle=${this.onlyOne}>
      <summary><ha-icon icon=${t}></ha-icon><span>${a}</span><ha-icon class="chev" icon="mdi:chevron-down"></ha-icon></summary>
      <div class="body"><p class="hint">${s}</p>${o}</div>
    </details>`}sub(e,t){return q`<details class="sub" @toggle=${this.onlyOne}>
      <summary><span>${e}</span><ha-icon class="chev" icon="mdi:chevron-down"></ha-icon></summary>
      <div class="sub-body">${t}</div>
    </details>`}group(e){return q`<div class="group">${e}</div>`}textStyle(e,t,a){const s=be[e],o=t?t.get():this.styleOf(e),i=(a,s,o)=>t?t.set(s,o):i(e,s,o);return this.sub((null==t?void 0:t.label)||s.label,q`
      ${a||V}
      ${this.group("Size and weight")}
      ${this.slider("Size",o.size||0,6,48,1," px",s.size,t=>i(e,"size",t||void 0))}
      ${this.select("Weight",o.weight?String(o.weight):"",[["",`Card default (${s.weight})`],...Ha.map(e=>[String(e),String(e)])],t=>i(e,"weight",t?Number(t):void 0))}
      ${this.group("Font and case")}
      ${this.select("Font",o.font||"",[["",`Card default (${Ba[s.font]})`],...Da],t=>i(e,"font",t||void 0))}
      ${this.triState("Italic",o.italic,"Card default (off)",t=>i(e,"italic",t))}
      ${this.triState("Capitals",o.caps,`Card default (${s.caps?"on":"off"})`,t=>i(e,"caps",t))}
      ${this.group("Color")}
      ${this.color("Text color",o.color,"Card default","#e1e1e1",t=>i(e,"color",t))}
    `)}iconStyle(e,t){const a=ve[e],s=this.styleOf(e);return this.sub(a.label,q`
      ${this.group("Size")}
      ${this.slider("Size",s.size||0,12,96,1," px",a.size,t=>this.setStyle(e,"size",t||void 0))}
      ${t?q`${this.group("Color")}
            ${this.color("Icon color",s.color,t.defaultLabel,"#9e9e9e",t=>this.setStyle(e,"color",t),t.presets)}`:V}
    `)}applyPreset(e,t,a){const s=Ye[a];if(!s)return;const o=Ia((this.config||{}).styles||{});o[e]=Object.assign({},s.button);const i=(o[t]||{}).size;o[t]=Object.assign(Object.assign({},s.icon),i?{size:i}:{}),this.emit(Object.assign(Object.assign({},this.config),{styles:o}))}keyPreset(){const e=this.styleOf("key_button");return e.background||e.border?"transparent"!==e.background||e.border?"transparent"===e.background&&"none"===e.border?"plain":"":"outline":"filled"}setKeyPreset(e){const t=Ia((this.config||{}).styles||{});if("filled"===e)delete t.key_button;else if("outline"===e)t.key_button={background:"transparent"};else{if("plain"!==e)return;t.key_button={background:"transparent",border:"none"}}this.emit(Object.assign(Object.assign({},this.config),{styles:t}))}buttonColors(e,t,a,s){const o=this.styleOf(e),i=this.styleOf(t),r=[["transparent","Transparent"],["mode",a]],n=[["none","None"],["mode",a]],l=[["mode",a]],c=((e,t)=>{const a=e=>JSON.stringify(Object.keys(e||{}).filter(e=>"size"!==e).sort().map(t=>[t,e[t]]));return Object.keys(Ye).find(s=>a(Ye[s].button)===a(e)&&a(Ye[s].icon)===a(t))||""})(o,i);return this.sub("Button colors",q`
      ${this.group("Style")}
      ${this.select("Style",c,[...Object.entries(Ye).map(([e,t])=>[e,t.label]),...c?[]:[["","Custom (the settings below)"]]],a=>this.applyPreset(e,t,a))}
      <p class="hint">${a} = each button's own color${"arm_button"===e?" (see Arm mode colors above)":""}. Pick a style, then
        fine-tune it below.</p>
      ${this.group("Background")}
      ${this.color("Background",o.background,s.bg,"#2a2a2a",t=>this.setStyle(e,"background",t),r)}
      ${this.color("Background (selected)",o.active_background,s.abg,"#3a3a3a",t=>this.setStyle(e,"active_background",t),r)}
      ${"arm_button"===e?this.color("Bar behind the buttons",o.track,"Card default (faint)","#202020",t=>this.setStyle(e,"track",t),[["transparent","Transparent"]]):V}
      ${this.group("Border")}
      ${this.color("Border",o.border,"Card default (none)","#444444",t=>this.setStyle(e,"border",t),n)}
      ${this.color("Border (selected)",o.active_border,"Same as not selected","#ffffff",t=>this.setStyle(e,"active_border",t),n)}
      ${this.group("Icon and text")}
      ${this.color("Icon color",i.color,s.ic,"#9e9e9e",e=>this.setStyle(t,"color",e),l)}
      ${this.color("Icon color (selected)",i.active_color,s.aic,"#ffffff",e=>this.setStyle(t,"active_color",e),l)}
      ${this.toggle("Text color follows the icon",!!o.text_follows_icon,t=>this.setStyle(e,"text_follows_icon",t||void 0))}
    `)}get layout(){return ke(this.cfg)}setStatus(e,t){this.emit(Object.assign(Object.assign({},this.config),{status_sections:e,section_order:t||this.layout.order}))}updStatus(e,t){const a=Ia(this.layout.sections),s=a.find(t=>t.id===e);s&&(t(s),this.setStatus(a))}addStatus(){const{sections:e,order:t}=this.layout,a=(e=>{let t=1;for(;e.some(e=>e.id===`s${t}`);)t++;return`s${t}`})(e),s={id:a,name:`Status ${e.length+1}`,icon:"house",countdown:!0,lines:["house_mode"]};this.setStatus([...Ia(e),s],[`status:${a}`,...t])}removeStatus(e){const{sections:t,order:a}=this.layout,s=t.find(t=>t.id===e);window.confirm(`Delete the Status section "${(null==s?void 0:s.name)||e}"?`)&&this.setStatus(t.filter(t=>t.id!==e),a.filter(t=>t!==`status:${e}`))}statusPanel(e){var t;const a=e.lines||[],s=t=>({get:()=>(e.styles||{})[t]||{},set:(a,s)=>this.updStatus(e.id,e=>{const o=Object.assign({},e.styles||{}),i=Object.assign({},o[t]||{});void 0===s||""===s||null===s?delete i[a]:i[a]=s,Object.keys(i).length?o[t]=i:delete o[t],e.styles=Object.keys(o).length?o:void 0}),label:`${be[t].label} (this section)`}),o=(t,a)=>this.updStatus(e.id,e=>{const s=[...e.lines||[]];[s[t],s[t+a]]=[s[t+a],s[t]],e.lines=s}),i=ye.filter(e=>!a.includes(e)),r=(null===(t=e.styles)||void 0===t?void 0:t.header_icon)||{};return this.panel(`status:${e.id}`,"mdi:information-outline",e.name||"Status","A status block: an icon (or the countdown during a delay) and the lines you choose, in order.",q`
      ${this.group("Name")}
      <div class="row"><span class="lab">Name</span>
        <input class="ctl" type="text" .value=${e.name||""} @change=${t=>this.updStatus(e.id,e=>e.name=t.target.value||void 0)} /></div>
      ${this.group("Icon")}
      ${this.select("Icon",e.icon||"house",[["house","House Mode's icon (the alarm's when House Modes are off)"],["alarm","The alarm state's icon"],["none","No icon"]],t=>this.updStatus(e.id,e=>e.icon=t))}
      ${"none"!==e.icon?this.toggle("Countdown circle in its place during an exit or entry delay",!!e.countdown,t=>this.updStatus(e.id,e=>e.countdown=t||void 0)):V}
      ${this.group("Lines")}
      <div class="row">
        <select class="add-sel" aria-label="Add a line" @change=${t=>{const a=t.target.value;t.target.value="",a&&this.updStatus(e.id,e=>e.lines=[...e.lines||[],a])}}>
          <option value="">+ Line…</option>
          ${i.map(e=>q`<option value=${e}>${we[e].label}</option>`)}
        </select>
      </div>
      ${a.map((t,s)=>{var i;return q`<div class="line-row">
        <span>${(null===(i=we[t])||void 0===i?void 0:i.label)||t}</span>
        <span class="order">
          <button class="icon-btn" title="Move up" aria-label="Move up" ?disabled=${0===s} @click=${()=>o(s,-1)}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
          <button class="icon-btn" title="Move down" aria-label="Move down" ?disabled=${s===a.length-1} @click=${()=>o(s,1)}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
          <button class="icon-btn del" title="Remove" aria-label="Remove" @click=${()=>this.updStatus(e.id,e=>e.lines=(e.lines||[]).filter(e=>e!==t))}><ha-icon icon="mdi:trash-can-outline"></ha-icon></button>
        </span>
      </div>`})}
      ${a.length?V:q`<p class="hint">No lines: only the icon is shown.</p>`}
      ${a.some(e=>e.startsWith("panel_"))?this.displayBody():V}
      ${this.group("Background")}
      ${this.color("Section background",e.background,"Card background","#262626",t=>this.updStatus(e.id,e=>e.background=t))}
      ${this.group("Styles")}
      ${"none"!==e.icon?this.sub("Icon (this section)",q`
            ${this.slider("Size",r.size||0,12,96,1," px",ve.header_icon.size,t=>this.updStatus(e.id,e=>{var a;const s=Object.assign(Object.assign({},(null===(a=e.styles)||void 0===a?void 0:a.header_icon)||{}),{size:t||void 0});e.styles=Object.assign(Object.assign({},e.styles||{}),{header_icon:s})}))}
            ${this.color("Icon color",r.color,"alarm"===e.icon?"Arm mode color":"House Mode color","#9e9e9e",t=>this.updStatus(e.id,e=>{var a;const s=Object.assign(Object.assign({},(null===(a=e.styles)||void 0===a?void 0:a.header_icon)||{}),{color:t});e.styles=Object.assign(Object.assign({},e.styles||{}),{header_icon:s})}),[["mode","alarm"===e.icon?"Arm mode color":"House Mode color"]])}`):V}
      ${a.map(e=>this.textStyle(we[e].style,s(we[e].style)))}
      <p class="hint">A style left at "Card default" uses the one under Card → Status text (all Status sections).</p>
    `)}sectionRow(e,t,a){const s=this.cfg,o=e=>{const s=[...a];[s[t],s[t+e]]=[s[t+e],s[t]],this.setStatus(Ia(this.layout.sections),s)},i=e.startsWith("status:")?this.layout.sections.find(t=>`status:${t.id}`===e):void 0,r=i?void 0:Se[e];if(!i&&!r)return V;const n=i?i.name||"Status":r.title,l=i?(i.lines||[]).map(e=>{var t;return null===(t=we[e])||void 0===t?void 0:t.label.split(" (")[0]}).join(", ")||"icon only":r.hint,c=i?!1!==i.show:!!s[r.show],d=i?!!i.collapsible:!!s[r.collapse],h=i?!1!==i.start_collapsed:!!s[r.start],p=e=>i?this.updStatus(i.id,t=>t.show=!!e&&void 0):this.set(r.show,e),u=e=>i?this.updStatus(i.id,t=>t.collapsible=e||void 0):this.set(r.collapse,e),m=e=>i?this.updStatus(i.id,t=>t.start_collapsed=!!e&&void 0):this.set(r.start,e);return q`<div class="sec-row ${c?"":"hidden"}">
      <ha-icon class="sec-ic" icon=${i?"mdi:information-outline":{house_modes:"mdi:home-switch-outline",alarm:"mdi:shield-lock-outline",keypad:"mdi:dialpad"}[e]}></ha-icon>
      <div class="sec-text">
        <span class="sec-name">${n}</span>
        ${l?q`<span class="hint inline">${l}</span>`:V}
        ${c?q`<span class="sec-chips">
              <button class="chip ${d?"on":""}" aria-pressed=${d?"true":"false"}
                title="A bar expands and collapses this section" @click=${()=>u(!d)}>
                <ha-icon icon="mdi:unfold-less-horizontal"></ha-icon>Collapsible</button>
              ${d?q`<button class="chip ${h?"on":""}" aria-pressed=${h?"true":"false"}
                    title="Collapsed when the card first appears" @click=${()=>m(!h)}>
                    <ha-icon icon="mdi:arrow-collapse-vertical"></ha-icon>Starts collapsed</button>`:V}
            </span>`:V}
      </div>
      <span class="order">
        <button class="icon-btn" title=${c?"Hide":"Show"} aria-label=${`${c?"Hide":"Show"} ${n}`} @click=${()=>p(!c)}>
          <ha-icon icon=${c?"mdi:eye-outline":"mdi:eye-off-outline"}></ha-icon></button>
        <button class="icon-btn" title="Move up" aria-label=${`Move ${n} up`} ?disabled=${0===t} @click=${()=>o(-1)}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
        <button class="icon-btn" title="Move down" aria-label=${`Move ${n} down`} ?disabled=${t===a.length-1} @click=${()=>o(1)}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
        ${i?q`<button class="icon-btn del" title="Delete" aria-label=${`Delete ${n}`} @click=${()=>this.removeStatus(i.id)}><ha-icon icon="mdi:trash-can-outline"></ha-icon></button>`:q`<span class="spacer"></span>`}
      </span>
    </div>`}render(){var e,t,a,s,o,i,r,n;if(!this.hass||!this.config)return V;const l=this.cfg,c=Object.assign(Object.assign(Object.assign({},Ra),{button_scale_actions:1,button_scale_keypad:1}),this.config.alarm||{}),d=(null===(e=this.data)||void 0===e?void 0:e.alarms)||[],h=(null===(t=this.data)||void 0===t?void 0:t.house.modes)||[],p=this.styleOf("card");return q`<div class="ed">
      <div class="ed-header">
        <ha-icon icon="mdi:shield-home"></ha-icon>
        <span class="ed-header-title">House Modes &amp; Alarm Center Card</span>
        <span class="ed-header-build">v${Oa}</span>
      </div>
      ${this.panel("card","mdi:card-outline","Card","Which alarm the card controls, and the frame around it.",q`
        ${this.group("Alarm")}
        ${this.select("Alarm",l.entity||"",[["","First linked alarm"],...d.map(e=>[e.entity_id,`${e.name} (${e.entity_id})`])],e=>this.set("entity",e||void 0))}
        <div class="row"><span class="lab">Name</span>
          <input class="ctl" type="text" placeholder="Shown when House Modes are off" .value=${l.name||""}
            @change=${e=>this.set("name",e.target.value||void 0)} /></div>
        ${this.group("Frame")}
        ${this.slider("Border width",null!==(a=p.border_width)&&void 0!==a?a:2,0,8,1," px",2,e=>this.setStyle("card","border_width",2===e?void 0:e),!1)}
        ${this.slider("Corner radius",null!==(s=p.radius)&&void 0!==s?s:12,0,32,1," px",12,e=>this.setStyle("card","radius",12===e?void 0:e),!1)}
        ${this.color("Card background",p.background,"Theme card background","#1c1c1c",e=>this.setStyle("card","background",e),[["transparent","Transparent"]])}
        <p class="hint">The card background is the default for every section; a section can set its own below (Header,
          House Mode buttons, Alarm, Physical panel keypad).</p>
        ${this.group("Status text (all Status sections)")}
        ${this.iconStyle("header_icon")}
        ${["mode_name","alarm_name","alarm_state","line1","line2","changing","since"].map(e=>this.textStyle(e))}
        ${this.group("Collapse")}
        ${this.toggle("Collapse the card to its first section (tap it to expand)",l.collapsible,e=>this.set("collapsible",e))}
        ${l.collapsible?this.toggle("Start collapsed",l.start_collapsed,e=>this.set("start_collapsed",e)):V}
        ${this.group("Border")}
        ${this.select("Border color",l.border_color,[["mode","The House Mode's color"],["state","The alarm state (red alarm, orange arming / not ready, mode color armed, green ready)"]],e=>this.set("border_color",e))}
      `,!0)}

      ${this.panel("sections","mdi:view-agenda-outline","Sections","The parts of the card, in order: show or hide each one, make it collapsible, move it up or down.",q`
        <div class="row"><button class="add" @click=${()=>this.addStatus()}>+ Status</button></div>
        <div class="sec-list">${this.layout.order.map((e,t,a)=>this.sectionRow(e,t,a))}</div>
        <p class="hint">Tap a chip to switch it: <em>Collapsible</em> puts the section behind a bar that expands and
          collapses it; <em>Starts collapsed</em> is how it first appears. The eye shows or hides the section.</p>
        ${l.collapsible||Object.values(Se).some(e=>l[e.collapse])||this.layout.sections.some(e=>e.collapsible)?this.textStyle("alarm_bar",void 0,q`
              ${this.group("Arrow")}
              ${this.toggle("Show the expand / collapse arrow",l.show_chevron,e=>this.set("show_chevron",e))}`):V}
      `)}

      ${this.layout.sections.map(e=>this.statusPanel(e))}

      ${this.panel("modes","mdi:home-switch-outline","House Mode buttons","One button per House Mode; icons and colors come from the House Modes tab.",l.show_house_modes?q`
          ${this.group("Show")}
          ${this.toggle("Icons",l.show_mode_icons,e=>this.set("show_mode_icons",e))}
          ${this.toggle("Text",l.show_mode_labels,e=>this.set("show_mode_labels",e))}
          ${this.group("Layout")}
          ${this.select("Alignment",l.modes_align,[["grid","Standard (fixed columns, wrap left)"],["center","Center on width"]],e=>this.set("modes_align",e))}
          ${this.slider("Buttons per row",l.columns,2,9,1,"",5,e=>this.set("columns",e),!1)}
          ${this.select("Shape",l.modes_shape,[["rounded","Rounded rectangles"],["round","Round (circle around the icon)"]],e=>this.set("modes_shape",e))}
          ${this.select("Button width",l.modes_width,[["fill","Fill the width (share it equally)"],["fit","Fit the content (centered)"]],e=>this.set("modes_width",e))}
          ${this.slider("Space between buttons",null!==(o=l.modes_gap)&&void 0!==o?o:4,0,24,1," px",4,e=>this.set("modes_gap",4===e?void 0:e),!1)}
          ${this.slider("Button padding",null!==(i=l.modes_padding)&&void 0!==i?i:6,0,20,1," px",6,e=>this.set("modes_padding",6===e?void 0:e),!1)}
          ${h.length?q`${this.group("Buttons shown")}
                <div class="chips">${h.map(e=>{const t=(l.hidden_modes||[]).includes(e.id)||(l.hidden_modes||[]).includes(e.name);return q`<button class="chip ${t?"":"on"}" aria-pressed=${t?"false":"true"}
                    @click=${()=>this.set("hidden_modes",t?(l.hidden_modes||[]).filter(t=>t!==e.id&&t!==e.name):[...l.hidden_modes||[],e.id])}>
                    <ha-icon icon=${e.icon} style=${`color:${e.color}`}></ha-icon>${e.name}</button>`})}</div>`:V}
          ${h.length?this.sub("House Mode colors",q`
                <p class="hint">Each House Mode's color comes from the House Modes tab. Set one here to use a different color
                  on this card only.</p>
                ${h.map(e=>this.color(e.name,(l.mode_colors||{})[e.id],`House Modes tab (${e.color})`,(e=>/^#[0-9a-fA-F]{6}$/.test(e||"")?e:"#9e9e9e")(e.color),t=>this.setMap("mode_colors",e.id,t)))}`):V}
          ${this.sectionBg("modes_section")}
          ${this.group("Styles")}
          ${this.buttonColors("mode_button","mode_icon","House Mode color",{bg:"Card default (transparent)",abg:"Card default (faint gray)",ic:"Card default (secondary text)",aic:"House Mode color"})}
          ${l.show_mode_icons?this.iconStyle("mode_icon"):V}
          ${l.show_mode_labels?this.textStyle("mode_label"):V}`:q`<p class="hint">Turned off under Sections.</p>`)}

      ${this.panel("alarm","mdi:shield-lock-outline","Alarm Panel buttons","Arm and disarm the alarm, enter the code, see why it will not arm.",l.show_alarm?q`
          ${this.group("Show")}
          ${this.toggle("Arm button icons",l.show_arm_icons,e=>this.set("show_arm_icons",e))}
          ${this.toggle("Arm button text",l.show_arm_labels,e=>this.set("show_arm_labels",e))}
          ${this.toggle("Option chips: Skip exit delay, Bypass open sensors",l.show_arm_options,e=>this.set("show_arm_options",e))}
          ${this.group("Arm buttons")}
          ${this.select("Arm mode colors",l.alarm_colors,[["modes","From the House Modes (the mode that sets each arm mode)"],["standard","Standard (green disarmed, red away, orange home, …)"],["theme","Home Assistant theme (alarm state colors)"]],e=>this.set("alarm_colors",e))}
          ${this.sub("Arm mode colors",q`
            <p class="hint">Change one arm mode, or match it to a House Mode's color.</p>
            ${Object.keys(Oe).map(e=>this.color(Oe[e],(l.arm_colors||{})[e],"From the choice above",Pe[e],t=>this.setMap("arm_colors",e,t),h.map(e=>[`house:${e.id}`,`House Mode: ${e.name}`])))}`)}
          ${this.select("Shape",l.arm_shape,[["rounded","Rounded rectangles"],["round","Round (circle around the icon)"]],e=>this.set("arm_shape",e))}
          ${this.select("Button width",l.arm_width,[["fill","Fill the width (share it equally)"],["fit","Fit the content (centered)"]],e=>this.set("arm_width",e))}
          ${this.slider("Space between buttons",null!==(r=l.arm_gap)&&void 0!==r?r:0,0,24,1," px",0,e=>this.set("arm_gap",0===e?void 0:e),!1)}
          ${this.slider("Button padding",null!==(n=l.arm_padding)&&void 0!==n?n:8,0,20,1," px",8,e=>this.set("arm_padding",8===e?void 0:e),!1)}
          ${this.slider("Arm button scale",Math.round(10*c.button_scale_actions)/10,1,2.5,.1,"×",1,e=>this.setAlarm("button_scale_actions",e),!1)}
          ${this.group("Code entry and messages")}
          ${Pa.map(e=>this.toggle(Na[e],!!c[e],t=>this.setAlarm(e,t)))}
          ${this.slider("Code keypad scale",Math.round(10*c.button_scale_keypad)/10,1,2.5,.1,"×",1,e=>this.setAlarm("button_scale_keypad",e),!1)}
          ${this.sectionBg("alarm_section")}
          ${this.group("Styles")}
          ${this.buttonColors("arm_button","alarm_icon","Arm mode color",{bg:"Card default (transparent)",abg:"Arm mode color",ic:"Arm mode color",aic:"Card default (white)"})}
          ${l.show_arm_icons?this.iconStyle("alarm_icon"):V}
          ${l.show_arm_labels?this.textStyle("alarm_button"):V}
          ${l.show_arm_options?this.textStyle("chip"):V}`:q`<p class="hint">Turned off under Sections.</p>`)}

      ${this.panel("effects","mdi:shimmer","Effects","Make parts of the card glow or pulse while something is under way: arming, an entry delay, a House Mode change, an alarm.",this.effectsBody())}

      ${this.panel("keypad","mdi:dialpad","Physical panel keypad","The panel's 12 keys with their functions, sent through the integration.",l.show_panel_keypad?q`
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
          ${l.show_key_labels?this.textStyle("key_label"):V}`:q`<p class="hint">Turned off under Sections.</p>`)}
    </div>`}};La.styles=n`
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
    .chip:not(.on) ha-icon {
      opacity: 0.5;
    }
  `,t([ue({attribute:!1})],La.prototype,"hass",void 0),t([me()],La.prototype,"config",void 0),t([me()],La.prototype,"data",void 0),La=t([de("house-modes-alarm-center-card-editor")],La);const Fa=Oa,Ua="house-modes-alarm-center-card",qa=new Map;let Wa,Va=class extends le{constructor(){super(...arguments),this.error="",this.collapsed=!1,this.message="",this.busyKey="",this.closed={},this.fetchedFor="",this.requestedAt=0,this.messageTimer=0,this.onFxPreview=()=>this.requestUpdate(),this.changeTimer=0,this.fxRun=!1,this.flashKey="",this.flashTimer=0}static getConfigElement(){return document.createElement(`${Ua}-editor`)}static getStubConfig(e){const t=Object.keys(e.states).find(t=>t.startsWith("alarm_control_panel.")&&void 0!==e.states[t].attributes.arm_mode);return{entity:t}}setConfig(e){if(!e)throw new Error("Invalid configuration");if(e.entity&&!e.entity.startsWith("alarm_control_panel."))throw new Error("entity must be an alarm_control_panel of this integration");const t=!this.config;if(this.config=Object.assign(Object.assign({},fe),Ze(e)),t){Wa&&!this.data&&(this.data=Wa);const e=qa.get(this.viewKey);if(e)this.collapsed=e.collapsed,this.closed=Object.assign({},e.closed);else{this.collapsed=!(!this.config.collapsible||!this.config.start_collapsed);const e=this.config;this.closed={};for(const t of["house_modes","alarm","keypad"]){const a=Se[t];this.closed["house_modes"===t?"modes":t]=!(!e[a.collapse]||!e[a.start])}for(const t of ke(e).sections)this.closed[`status:${t.id}`]=!(!t.collapsible||!1===t.start_collapsed);this.saveView()}}this.config.collapsible||(this.collapsed=!1)}get viewKey(){const e=this.config||{},t=ke(e),a=`${t.order.join(",")}|${t.sections.map(e=>e.collapsible?1:0).join("")}|${[e.collapsible,e.modes_collapsible,e.alarm_collapsible,e.keypad_collapsible].map(e=>e?1:0).join("")}`;return`${e.entity||"(first alarm)"}|${a}`}saveView(){qa.set(this.viewKey,{collapsed:this.collapsed,closed:Object.assign({},this.closed)})}freshChange(e){var t;return e?((null===(t=this.changeSeen)||void 0===t?void 0:t.name)!==e&&(this.changeSeen={name:e,at:Date.now()}),Date.now()-this.changeSeen.at>18e4?null:(window.clearTimeout(this.changeTimer),this.changeTimer=window.setTimeout(()=>this.requestUpdate(),18e4-(Date.now()-this.changeSeen.at)+50),e)):(this.changeSeen=void 0,null)}connectedCallback(){super.connectedCallback(),Ke.listeners.add(this.onFxPreview)}disconnectedCallback(){super.disconnectedCallback(),Ke.listeners.delete(this.onFxPreview)}getCardSize(){var e,t,a,s;if(this.collapsed)return 2;let o=0;return(null===(e=this.config)||void 0===e?void 0:e.show_header)&&(o+=2),(null===(t=this.config)||void 0===t?void 0:t.show_house_modes)&&(o+=2),(null===(a=this.config)||void 0===a?void 0:a.show_alarm)&&(o+=4),(null===(s=this.config)||void 0===s?void 0:s.show_panel_keypad)&&(o+=4),o||2}updated(e){if(!e.has("hass")||!this.hass)return;const t=this.hass.states["select.alarmo_house_mode"],a=this.data?this.hass.states[this.data.house.select_entity]:void 0,s=`${null==t?void 0:t.last_updated}|${null==a?void 0:a.last_updated}`;s!==this.fetchedFor&&(this.fetchedFor=s,this.fetch())}async fetch(){try{const e=await this.hass.callWS({type:"alarmo/ext/card/get"});JSON.stringify(e)!==JSON.stringify(this.data)&&(this.data=e),Wa=e,this.error="";const t=e.house.last_result,a=e.house.shadow&&"select.alarmo_house_mode"!==e.house.select_entity;if(this.requestedAt&&(null==t?void 0:t.at)&&Date.parse(t.at)>=this.requestedAt-2e3&&(!a||"shadow"!==t.result)){this.requestedAt=0;const e=((e,t)=>{if(!e)return null;const a=e.requested||"House Mode";switch(e.result){case"blocked":return`${a} not set: ${e.reason||"not allowed now"}`;case"not_ready":return`${a} not set: open ${(e.open||[]).map(t).join(", ")||"zones"}`;case"delayed":return`${a} in ${e.minutes} min`;case"failed":return`${a} failed: ${(e.failed||[]).join(", ")} did not arm`;case"error":return`${a}: ${e.reason||"error"}`;case"shadow":return e.would&&"changed"!==e.would?`Shadow: ${a} would be ${e.would.replace("_"," ")}`:`Shadow: House Modes would set ${a}; nothing was changed`;default:return null}})(t,e=>this.name(e));e&&this.flash(e)}}catch(e){this.error="House Modes & Alarm Center is not installed or not up to date: "+((null==e?void 0:e.message)||e)}}name(e){var t,a,s;return(null===(s=null===(a=null===(t=this.hass)||void 0===t?void 0:t.states[e])||void 0===a?void 0:a.attributes)||void 0===s?void 0:s.friendly_name)||e}flash(e){this.message=e,window.clearTimeout(this.messageTimer),this.messageTimer=window.setTimeout(()=>this.message="",8e3)}get dv(){var e,t,a,s;const o=this.data,i=null===(e=this.config)||void 0===e?void 0:e.mode_colors,r=o.house.display_entity?null===(a=null===(t=this.hass)||void 0===t?void 0:t.states[o.house.display_entity])||void 0===a?void 0:a.state:void 0;if((null===(s=this._dvFor)||void 0===s?void 0:s.d)===o&&this._dvFor.o===i&&this._dvFor.own===r)return this._dvFor.v;let n=(l=o,(c=i)&&Object.keys(c).length?Object.assign(Object.assign({},l),{house:Object.assign(Object.assign({},l.house),{modes:l.house.modes.map(e=>c[e.id]?Object.assign(Object.assign({},e),{color:c[e.id]}):e)})}):l);var l,c;if(r){const e=n.house.modes.find(e=>e.name.toLowerCase()===r.toLowerCase());n=Object.assign(Object.assign({},n),{house:Object.assign(Object.assign({},n.house),{current:e?e.id:null})})}return this._dvFor={d:o,o:i,own:r,v:n},n}arm(e){return((e,t,a,s)=>{const o=Object.assign({},Re(e,t,a));for(const[t,a]of Object.entries(s||{}))if(a)if(a.startsWith("house:")){const s=e.house.modes.find(e=>e.id===a.slice(6));s&&(o[t]=s.color)}else o[t]=String(a).replace(/[;{}<>]/g,"");return o})(this.dv,e,this.config.alarm_colors,this.config.arm_colors)}get alarmEntity(){var e,t,a,s;return(null===(e=this.config)||void 0===e?void 0:e.entity)||(null===(t=Ge(this.data,void 0))||void 0===t?void 0:t.alarm_entity)||(null===(s=null===(a=this.data)||void 0===a?void 0:a.alarms[0])||void 0===s?void 0:s.entity_id)}async chooseMode(e){const t=this.data.house.select_entity,a=t.split(".")[0];this.requestedAt=Date.now();try{await this.hass.callService(a,"select_option",{entity_id:t,option:e})}catch(e){this.requestedAt=0,this.flash((null==e?void 0:e.message)||String(e))}}async press(e){this.flashKey="",window.clearTimeout(this.flashTimer),requestAnimationFrame(()=>{this.flashKey=e,this.flashTimer=window.setTimeout(()=>this.flashKey="",500)});const t=Ge(this.data,this.alarmEntity);if(t){this.busyKey=e;try{await this.hass.callService("alarmo","panel_keypress",{keys:e,entity_id:t.panel_entity})}catch(e){this.flash((null==e?void 0:e.message)||String(e))}finally{this.busyKey=""}}}toggle(){var e;(null===(e=this.config)||void 0===e?void 0:e.collapsible)&&(this.collapsed=!this.collapsed,this.saveView())}moreInfo(e){e&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}render(){var e,t,a;if(!this.config||!this.hass)return V;if(this.error)return q`<ha-card><div class="warn">${this.error}</div></ha-card>`;if(!this.data)return q`<ha-card><div class="loading">…</div></ha-card>`;const s=this.config,o=this.dv.house,i=o.modes.find(e=>e.id===o.current),r=this.alarmEntity,n=Ge(this.dv,r),l=r?null===(e=this.hass.states[r])||void 0===e?void 0:e.state:void 0,c=n?null===(t=this.hass.states[n.panel_entity])||void 0===t?void 0:t.state:void 0,d=(null==n?void 0:n.ready_entity)?null===(a=this.hass.states[n.ready_entity])||void 0===a?void 0:a.state:void 0,h="state"!==s.border_color&&o.enabled&&i?i.color:((e,t,a,s)=>"triggered"===e||"triggered"===t?"#ff0000":"arming"===e||"pending"===e||"arming"===t||"pending"===t?"#ffa500":e&&Je.includes(e)||t&&Je.includes(t)?s||"#ff0000":"on"===a?"#008000":"off"===a?"#ffa500":"var(--divider-color)")(l,c,d,null==i?void 0:i.color),p=Ke.on?[...Le]:((e,t,a)=>{const s=[];return"arming"!==e&&"arming"!==t||s.push("arming"),"pending"!==e&&"pending"!==t||s.push("entry"),a&&s.push("changing"),"triggered"!==e&&"triggered"!==t||s.push("triggered"),s})(l,c,this.freshChange(o.changing_to)),u=((e,t)=>{const a=We(e,t),s=[...Ve(null==e?void 0:e.card,a,"fx-card"),...Ve(null==e?void 0:e.status_icon,a,"fx-status")];return s.length?["fx-on",...s]:[]})(s.effects,p);this.fxRun=We(s.effects,p);const m=ke(s),g=new Map(m.sections.map(e=>[`status:${e.id}`,e])),b=m.order.filter(e=>{const t=s,a=g.get(e);return a?!1!==a.show:"house_modes"===e?!!t.show_house_modes&&o.enabled:"alarm"===e?!!t.show_alarm&&!!r:"keypad"===e&&(!!t.show_panel_keypad&&"envisalink"===(null==n?void 0:n.panel_type))}),v=this.collapsed&&s.collapsible?b.slice(0,1):b;return q`
      <ha-card class=${u.join(" ")} style=${`--hmac-border:${h};${Ee(s.styles)};${(e=>{const t=[];return(null==e?void 0:e.size)&&t.push(`--fx-size:${Number(e.size)}px`),(null==e?void 0:e.speed)&&t.push(`--fx-speed:${Number(e.speed)}s`),(null==e?void 0:e.color)&&t.push(`--fx-color:${String(e.color).replace(/[;{}<>]/g,"")}`),t.join(";")})(s.effects)}`}>
        ${v.map((e,t)=>{const a=this.renderSectionById(e,0===t,{mode:i,alarmEnt:r,alarmState:l,link:n,status:g.get(e)});return 0===t&&s.collapsible?q`<div class="first clickable" @click=${this.toggle}>${a}
                ${s.show_chevron?q`<ha-icon class="first-chev" icon=${this.collapsed?"mdi:chevron-down":"mdi:chevron-up"}></ha-icon>`:V}</div>`:a})}
        ${this.message?q`<div class="message" role="status">${this.message}</div>`:V}
      </ha-card>
    `}renderSectionById(e,t,a){var s,o,i,r,n;const l=this.config,c=l,d=e=>(!t||!l.collapsible)&&e;if(a.status){const t=a.status;return q`<div class="sec sec-status" style=${[t.background?`--hmac-status-bg:${String(t.background).replace(/[;{}<>]/g,"")}`:"",Ee(t.styles)].filter(Boolean).join(";")}>
        ${this.sectionInner(e,d(!!t.collapsible),(null===(s=a.mode)||void 0===s?void 0:s.icon)||Ce[a.alarmState||""]||"mdi:information-outline",null===(o=a.mode)||void 0===o?void 0:o.color,t.name||"Status",()=>this.renderStatus(t,a.mode,a.alarmState,a.link))}</div>`}switch(e){case"house_modes":return this.section("modes",d(!!c.modes_collapsible),(null===(i=a.mode)||void 0===i?void 0:i.icon)||"mdi:home-switch",null===(r=a.mode)||void 0===r?void 0:r.color,`House Mode buttons · ${(null===(n=a.mode)||void 0===n?void 0:n.name)||"unknown"}`,()=>this.renderModes());case"alarm":return this.renderAlarm(a.alarmEnt,a.alarmState,d(!!c.alarm_collapsible));case"keypad":return this.section("keypad",d(!!c.keypad_collapsible),"mdi:dialpad",void 0,"Panel keypad",()=>this.renderKeypad(a.link));default:return V}}renderStatus(e,t,a,s){var o,i,r,n,l;const c=this.config,d=this.dv.house,h=this.alarmEntity,p=h?this.hass.states[h]:void 0,u=null===(o=null==p?void 0:p.attributes)||void 0===o?void 0:o.arm_mode,m=(null==s?void 0:s.keypad_entity)?this.hass.states[s.keypad_entity]:void 0,[g,b]=De(null!==(r=null===(i=null==m?void 0:m.attributes)||void 0===i?void 0:i.alpha)&&void 0!==r?r:null==m?void 0:m.state,c.display_strip,c.display_replace),v=a?this.hass.localize(`component.alarm_control_panel.entity_component._.state.${a}`)||a.replace(/_/g," "):"",_="alarm"===e.icon||!d.enabled,f=_?Ce[a||""]||"mdi:shield-home":(null==t?void 0:t.icon)||"mdi:shield-home",y=_?this.arm(h)["arming"===a||"pending"===a?u||"":a||""]||"var(--secondary-text-color)":(null==t?void 0:t.color)||"var(--secondary-text-color)",w=Object.assign(Object.assign({},(null===(n=c.styles)||void 0===n?void 0:n.header_icon)||{}),(null===(l=e.styles)||void 0===l?void 0:l.header_icon)||{}),x="arming"===a||"pending"===a,k="none"===e.icon?V:e.countdown&&x&&h?q`<hmac-state-badge class="mode-icon countdown" .hass=${this.hass} .entity=${h}
              style=${`--alarm-state-color:${this.arm(h)[u||""]||"var(--warning-color)"}`}></hmac-state-badge>`:q`<ha-icon class="mode-icon" icon=${f} style=${`color:${ge(w.color,y)||y}`}></ha-icon>`,$=d.changed_at?new Date(d.changed_at):null,A=e=>{var a,s;switch(e){case"house_mode":return d.enabled?t?t.name:"unknown":c.name||v;case"alarm_name":return c.name||(null===(a=null==p?void 0:p.attributes)||void 0===a?void 0:a.friendly_name)||h||"";case"alarm_state":return x&&u?`${v} · ${this.hass.localize(`component.alarm_control_panel.entity_component._.state.${u}`)||u}`:v;case"panel_line1":return m&&g||null;case"panel_line2":return m&&b||null;case"changing":return d.changing_to?`Changing to ${d.changing_to}…`:null;case"since":return $?`since ${$.toLocaleString((null===(s=this.hass.locale)||void 0===s?void 0:s.language)||void 0,{weekday:"short",hour:"2-digit",minute:"2-digit"})}`:null;default:return null}},S=(e.lines||[]).map(e=>[e,A(e)]).filter(([,e])=>null!==e&&""!==e),z=d.shadow&&(e.lines||[]).includes("house_mode");return q`
      <div class="head" @contextmenu=${e=>{e.preventDefault(),this.moreInfo((null==s?void 0:s.keypad_entity)||h)}}>
        ${k}
        ${S.length?q`<div class="head-text">${S.map(([e,t])=>q`<div class="st-line st-${e} ${e.startsWith("panel_")?"lcd-line":""}">${t}</div>`)}</div>`:V}
        ${z?q`<span class="tag" title="House Modes run in Shadow: your automations are in charge">shadow</span>`:V}
      </div>
    `}alarmConfig(e){var t,a,s;const o=this.config,i=o.alarm||{};let r=i.states||{};if("theme"!==o.alarm_colors){const t=this.arm(e);r=Me([...new Set([...Object.keys(t),...Object.keys(r)])].map(e=>[e,Object.assign({color:t[e]},r[e]||{})]))}return Object.assign(Object.assign(Object.assign(Object.assign({type:"hmac-alarm"},i),{states:r,entity:e}),o.name?{name:o.name}:{}),{show_name:o.show_alarm_name,show_state:o.show_alarm_state,show_icon:o.show_alarm_icon,show_arm_options:o.show_arm_options,show_icons:o.show_arm_icons,show_labels:o.show_arm_labels,shape:o.arm_shape,fit:"fit"===o.arm_width,gap:o.arm_gap,padding:o.arm_padding,button_style:null===(t=o.styles)||void 0===t?void 0:t.arm_button,fx_classes:Ve(null===(a=o.effects)||void 0===a?void 0:a.arm_button,this.fxRun),icon_style:null===(s=o.styles)||void 0===s?void 0:s.alarm_icon})}section(e,t,a,s,o,i){return q`<div class="sec sec-${e}">${this.sectionInner(e,t,a,s,o,i)}</div>`}sectionInner(e,t,a,s,o,i){if(!t)return i();const r=t&&!!this.closed[e];return q`
      <button class="bar" aria-expanded=${String(!r)} @click=${()=>{this.closed=Object.assign(Object.assign({},this.closed),{[e]:!r}),this.saveView()}}>
        <ha-icon icon=${a} style=${s?`color:${s}`:""}></ha-icon>
        <span class="bar-text">${o}</span>
        ${this.config.show_chevron?q`<ha-icon class="bar-chev" icon=${r?"mdi:chevron-down":"mdi:chevron-up"}></ha-icon>`:V}
      </button>
      ${r?V:i()}
    `}renderAlarm(e,t,a){var s;const o=this.hass.states[e],i=this.arm(e)[("arming"===t||"pending"===t?null===(s=null==o?void 0:o.attributes)||void 0===s?void 0:s.arm_mode:t)||""];return this.section("alarm",a,"mdi:shield-lock-outline",i,"Arm / disarm",()=>q`<hmac-alarm class="alarm-controls" piece="controls" embedded .hass=${this.hass} .cardConfig=${Object.assign(Object.assign({},this.alarmConfig(e)),{part:"controls"})}></hmac-alarm>`)}renderModes(){var e,t,a,s;const o=this.dv.house,i=(r=this.dv,n=this.config.hidden_modes,r.house.modes.filter(e=>!(n||[]).includes(e.id)&&!(n||[]).includes(e.name)));var r,n;const l=o.changing_to?null===(e=o.modes.find(e=>e.name===o.changing_to))||void 0===e?void 0:e.id:o.current,c=Ve(null===(t=this.config.effects)||void 0===t?void 0:t.mode_button,this.fxRun||Ke.on).join(" ");return q`
      <div class="modes ${"fit"===this.config.modes_width?"fit":""} ${"center"===this.config.modes_align?"center":""} ${(null===(s=null===(a=this.config.styles)||void 0===a?void 0:a.mode_button)||void 0===s?void 0:s.text_follows_icon)?"follow":""} ${"round"===this.config.modes_shape?"round":""}"
        style=${`--cols:${Math.max(1,Math.min(9,this.config.columns||5))}${void 0!==this.config.modes_gap?`;--hmac-modes-gap:${Number(this.config.modes_gap)}px`:""}${void 0!==this.config.modes_padding?`;--hmac-modes-pad:${Number(this.config.modes_padding)}px`:""}`}>
        ${i.map(e=>{const t=e.id===o.current,a=this.config.styles||{},s=e.id===l;return q`<button class="mode fxe ${t?"on":""} ${s?c:""}" aria-pressed=${t?"true":"false"} title=${e.name}
              style=${`--mode-color:${e.color};${((e,t,a)=>[["--b-bg",ge(null==e?void 0:e.background,a)],["--b-abg",ge(null==e?void 0:e.active_background,a)],["--b-bd",ge(null==e?void 0:e.border,a)],["--b-abd",ge(null==e?void 0:e.active_border,a)],["--b-ic",ge(null==t?void 0:t.color,a)],["--b-aic",ge(null==t?void 0:t.active_color,a)]].filter(([,e])=>e).map(([e,t])=>`${e}:${t}`).join(";"))(a.mode_button,a.mode_icon,e.color)}`}
              @click=${()=>this.chooseMode(e.name)}>
              ${this.config.show_mode_icons?q`<span class="disc"><ha-icon icon=${e.icon}></ha-icon></span>`:V}
              ${this.config.show_mode_labels?q`<span>${e.name}</span>`:V}
            </button>`})}
      </div>
    `}renderKeypad(e){var t;const a=this.dv.keypad,s=this.config.key_flash||{},o=(null===(t=this.config.styles)||void 0===t?void 0:t.key_button)||{},i=[s.border?`--kf-bd:${ge(s.border,"")}`:"",s.background?`--kf-bg:${ge(s.background,"")}`:"",o.background?`--k-bg:${ge(o.background,"")}`:"",o.border?`--k-bd:${ge(o.border,"")}`:""].filter(Boolean).join(";"),r=a.blocked_keys||"";return q`
      <div class="keypad-wrap">
        ${!this.config.show_header&&e.keypad_entity?(()=>{var t,a;const s=this.hass.states[e.keypad_entity],[o,i]=De(null!==(a=null===(t=null==s?void 0:s.attributes)||void 0===t?void 0:t.alpha)&&void 0!==a?a:null==s?void 0:s.state,this.config.display_strip,this.config.display_replace);return q`<div class="lcd big"><div>${o||" "}</div><div>${i||" "}</div></div>`})():V}
        ${a.allowed?V:q`<div class="note">Panel keypad: ${a.reason}</div>`}
        <div class="keys ${"round"===this.config.keypad_shape?"round":""} ${s.border?"fl-bd":""} ${s.background?"fl-bg":""}" style=${i}>
          ${(n=this.config.keypad_labels,Ne.map(([e,t])=>[e,n&&e in n?n[e]:t])).map(([e,t])=>q`
            <button class="key ${this.flashKey===e?"flash":""}" ?disabled=${!a.allowed||r.includes(e)||this.busyKey===e}
              aria-label=${t?`${e} ${t}`:e} @click=${()=>this.press(e)}>
              <span class="k">${e}</span>${t&&this.config.show_key_labels?q`<span class="l">${t}</span>`:V}
            </button>`)}
        </div>
      </div>
    `;var n}};Va.styles=n`
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
      padding: 10px 20px 10px 0;
      min-height: 70px;
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
    .key:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
    .warn,
    .loading {
      padding: 16px;
    }
  `,t([ue({attribute:!1})],Va.prototype,"hass",void 0),t([me()],Va.prototype,"config",void 0),t([me()],Va.prototype,"data",void 0),t([me()],Va.prototype,"error",void 0),t([me()],Va.prototype,"collapsed",void 0),t([me()],Va.prototype,"message",void 0),t([me()],Va.prototype,"busyKey",void 0),t([me()],Va.prototype,"closed",void 0),t([me()],Va.prototype,"flashKey",void 0),Va=t([de(Ua)],Va),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===Ua)||window.customCards.push({type:Ua,name:"House Modes & Alarm Center Card",description:"House Mode, alarm and physical panel keypad in one card.",preview:!0}),console.info(`%c HOUSE MODES & ALARM CENTER CARD %c ${Fa} `,"background:#03a9f4;color:#fff","background:#333;color:#fff");export{Fa as CARD_VERSION,Va as HouseModesAlarmCenterCard};
