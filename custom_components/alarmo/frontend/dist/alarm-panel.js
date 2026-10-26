var e=function(t,a){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t;}||function(e,t){for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);},e(t,a);};function t(t,a){if("function"!=typeof a&&null!==a)throw new TypeError("Class extends value "+String(a)+" is not a constructor or null");function i(){this.constructor=t;}e(t,a),t.prototype=null===a?Object.create(a):(i.prototype=a.prototype,new i());}var a=function(){return a=Object.assign||function(e){for(var t,a=1,i=arguments.length;a<i;a++)for(var s in t=arguments[a])Object.prototype.hasOwnProperty.call(t,s)&&(e[s]=t[s]);return e;},a.apply(this,arguments);};function i(e,t){var a={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(a[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var s=0;for(i=Object.getOwnPropertySymbols(e);s<i.length;s++)t.indexOf(i[s])<0&&Object.prototype.propertyIsEnumerable.call(e,i[s])&&(a[i[s]]=e[i[s]]);}return a;}function s(e,t,a,i){var s,n=arguments.length,r=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,a):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,a,i);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(n<3?s(r):n>3?s(t,a,r):s(t,a))||r);return n>3&&r&&Object.defineProperty(t,a,r),r;}function n(e,t,a){if(a||2===arguments.length)for(var i,s=0,n=t.length;s<n;s++)!i&&s in t||(i||(i=Array.prototype.slice.call(t,0,s)),i[s]=t[s]);return e.concat(i||Array.prototype.slice.call(t));}"function"==typeof SuppressedError&&SuppressedError;/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const r=globalThis,o=r.ShadowRoot&&(void 0===r.ShadyCSS||r.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,d=Symbol(),l=new WeakMap();let c=class{constructor(e,t,a){if(this._$cssResult$=!0,a!==d)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t;}get styleSheet(){let e=this.o;const t=this.t;if(o&&void 0===e){const a=void 0!==t&&1===t.length;a&&(e=l.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet()).replaceSync(this.cssText),a&&l.set(t,e));}return e;}toString(){return this.cssText;}};const h=(e,...t)=>{const a=1===e.length?e[0]:t.reduce((t,a,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");})(a)+e[i+1],e[0]);return new c(a,e,d);},p=o?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const a of e.cssRules)t+=a.cssText;return(e=>new c("string"==typeof e?e:e+"",void 0,d))(t);})(e):e,{is:m,defineProperty:u,getOwnPropertyDescriptor:g,getOwnPropertyNames:v,getOwnPropertySymbols:y,getPrototypeOf:b}=Object,_=globalThis,f=_.trustedTypes,k=f?f.emptyScript:"",w=_.reactiveElementPolyfillSupport,$=(e,t)=>e,z={toAttribute(e,t){switch(t){case Boolean:e=e?k:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e);}return e;},fromAttribute(e,t){let a=e;switch(t){case Boolean:a=null!==e;break;case Number:a=null===e?null:Number(e);break;case Object:case Array:try{a=JSON.parse(e);}catch(e){a=null;}}return a;}},A=(e,t)=>!m(e,t),x={attribute:!0,type:String,converter:z,reflect:!1,useDefault:!1,hasChanged:A};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap();let j=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()];}static createProperty(e,t=x){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const a=Symbol(),i=this.getPropertyDescriptor(e,a,t);void 0!==i&&u(this.prototype,e,i);}}static getPropertyDescriptor(e,t,a){const{get:i,set:s}=g(this.prototype,e)??{get(){return this[t];},set(e){this[t]=e;}};return{get:i,set(t){const n=i?.call(this);s?.call(this,t),this.requestUpdate(e,n,a);},configurable:!0,enumerable:!0};}static getPropertyOptions(e){return this.elementProperties.get(e)??x;}static _$Ei(){if(this.hasOwnProperty($("elementProperties")))return;const e=b(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties);}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($("properties"))){const e=this.properties,t=[...v(e),...y(e)];for(const a of t)this.createProperty(a,e[a]);}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,a]of t)this.elementProperties.set(e,a);}this._$Eh=new Map();for(const[e,t]of this.elementProperties){const a=this._$Eu(e,t);void 0!==a&&this._$Eh.set(a,e);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const a=new Set(e.flat(1/0).reverse());for(const e of a)t.unshift(p(e));}else void 0!==e&&t.push(p(e));return t;}static _$Eu(e,t){const a=t.attribute;return!1===a?void 0:"string"==typeof a?a:"string"==typeof e?e.toLowerCase():void 0;}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map(),this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this));}addController(e){(this._$EO??=new Set()).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.();}removeController(e){this._$EO?.delete(e);}_$E_(){const e=new Map(),t=this.constructor.elementProperties;for(const a of t.keys())this.hasOwnProperty(a)&&(e.set(a,this[a]),delete this[a]);e.size>0&&(this._$Ep=e);}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{if(o)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const a of t){const t=document.createElement("style"),i=r.litNonce;void 0!==i&&t.setAttribute("nonce",i),t.textContent=a.cssText,e.appendChild(t);}})(e,this.constructor.elementStyles),e;}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.());}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.());}attributeChangedCallback(e,t,a){this._$AK(e,a);}_$ET(e,t){const a=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,a);if(void 0!==i&&!0===a.reflect){const s=(void 0!==a.converter?.toAttribute?a.converter:z).toAttribute(t,a.type);this._$Em=e,null==s?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null;}}_$AK(e,t){const a=this.constructor,i=a._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=a.getPropertyOptions(i),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:z;this._$Em=i;const n=s.fromAttribute(t,e.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null;}}requestUpdate(e,t,a,i=!1,s){if(void 0!==e){const n=this.constructor;if(!1===i&&(s=this[e]),a??=n.getPropertyOptions(e),!((a.hasChanged??A)(s,t)||a.useDefault&&a.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,a))))return;this.C(e,t,a);}!1===this.isUpdatePending&&(this._$ES=this._$EP());}C(e,t,{useDefault:a,reflect:i,wrapped:s},n){a&&!(this._$Ej??=new Map()).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==s||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||a||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set()).add(e));}async _$EP(){this.isUpdatePending=!0;try{await this._$ES;}catch(e){Promise.reject(e);}const e=this.scheduleUpdate();return null!=e&&(await e),!this.isUpdatePending;}scheduleUpdate(){return this.performUpdate();}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0;}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,a]of e){const{wrapped:e}=a,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,a,i);}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM();}catch(t){throw e=!1,this._$EM(),t;}e&&this._$AE(t);}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e);}_$EM(){this._$AL=new Map(),this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete();}getUpdateComplete(){return this._$ES;}shouldUpdate(e){return!0;}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM();}updated(e){}firstUpdated(e){}};j.elementStyles=[],j.shadowRootOptions={mode:"open"},j[$("elementProperties")]=new Map(),j[$("finalized")]=new Map(),w?.({ReactiveElement:j}),(_.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const S=globalThis,O=e=>e,C=S.trustedTypes,T=C?C.createPolicy("lit-html",{createHTML:e=>e}):void 0,E="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,L="?"+M,N=`<${L}>`,H=document,D=()=>H.createComment(""),P=e=>null===e||"object"!=typeof e&&"function"!=typeof e,q=Array.isArray,B="[ \t\n\f\r]",I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,V=/-->/g,R=/>/g,U=RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),G=/'/g,F=/"/g,K=/^(?:script|style|textarea|title)$/i,Z=(e=>(t,...a)=>({_$litType$:e,strings:t,values:a}))(1),W=Symbol.for("lit-noChange"),Y=Symbol.for("lit-nothing"),Q=new WeakMap(),J=H.createTreeWalker(H,129);function X(e,t){if(!q(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==T?T.createHTML(t):t;}const ee=(e,t)=>{const a=e.length-1,i=[];let s,n=2===t?"<svg>":3===t?"<math>":"",r=I;for(let t=0;t<a;t++){const a=e[t];let o,d,l=-1,c=0;for(;c<a.length&&(r.lastIndex=c,d=r.exec(a),null!==d);)c=r.lastIndex,r===I?"!--"===d[1]?r=V:void 0!==d[1]?r=R:void 0!==d[2]?(K.test(d[2])&&(s=RegExp("</"+d[2],"g")),r=U):void 0!==d[3]&&(r=U):r===U?">"===d[0]?(r=s??I,l=-1):void 0===d[1]?l=-2:(l=r.lastIndex-d[2].length,o=d[1],r=void 0===d[3]?U:'"'===d[3]?F:G):r===F||r===G?r=U:r===V||r===R?r=I:(r=U,s=void 0);const h=r===U&&e[t+1].startsWith("/>")?" ":"";n+=r===I?a+N:l>=0?(i.push(o),a.slice(0,l)+E+a.slice(l)+M+h):a+M+(-2===l?t:h);}return[X(e,n+(e[a]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i];};class te{constructor({strings:e,_$litType$:t},a){let i;this.parts=[];let s=0,n=0;const r=e.length-1,o=this.parts,[d,l]=ee(e,t);if(this.el=te.createElement(d,a),J.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes);}for(;null!==(i=J.nextNode())&&o.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(E)){const t=l[n++],a=i.getAttribute(e).split(M),r=/([.?@])?(.*)/.exec(t);o.push({type:1,index:s,name:r[2],strings:a,ctor:"."===r[1]?re:"?"===r[1]?oe:"@"===r[1]?de:ne}),i.removeAttribute(e);}else e.startsWith(M)&&(o.push({type:6,index:s}),i.removeAttribute(e));if(K.test(i.tagName)){const e=i.textContent.split(M),t=e.length-1;if(t>0){i.textContent=C?C.emptyScript:"";for(let a=0;a<t;a++)i.append(e[a],D()),J.nextNode(),o.push({type:2,index:++s});i.append(e[t],D());}}}else if(8===i.nodeType)if(i.data===L)o.push({type:2,index:s});else{let e=-1;for(;-1!==(e=i.data.indexOf(M,e+1));)o.push({type:7,index:s}),e+=M.length-1;}s++;}}static createElement(e,t){const a=H.createElement("template");return a.innerHTML=e,a;}}function ae(e,t,a=e,i){if(t===W)return t;let s=void 0!==i?a._$Co?.[i]:a._$Cl;const n=P(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),void 0===n?s=void 0:(s=new n(e),s._$AT(e,a,i)),void 0!==i?(a._$Co??=[])[i]=s:a._$Cl=s),void 0!==s&&(t=ae(e,s._$AS(e,t.values),s,i)),t;}class ie{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t;}get parentNode(){return this._$AM.parentNode;}get _$AU(){return this._$AM._$AU;}u(e){const{el:{content:t},parts:a}=this._$AD,i=(e?.creationScope??H).importNode(t,!0);J.currentNode=i;let s=J.nextNode(),n=0,r=0,o=a[0];for(;void 0!==o;){if(n===o.index){let t;2===o.type?t=new se(s,s.nextSibling,this,e):1===o.type?t=new o.ctor(s,o.name,o.strings,this,e):6===o.type&&(t=new le(s,this,e)),this._$AV.push(t),o=a[++r];}n!==o?.index&&(s=J.nextNode(),n++);}return J.currentNode=H,i;}p(e){let t=0;for(const a of this._$AV)void 0!==a&&(void 0!==a.strings?(a._$AI(e,a,t),t+=a.strings.length-2):a._$AI(e[t])),t++;}}class se{get _$AU(){return this._$AM?._$AU??this._$Cv;}constructor(e,t,a,i){this.type=2,this._$AH=Y,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=a,this.options=i,this._$Cv=i?.isConnected??!0;}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e;}get startNode(){return this._$AA;}get endNode(){return this._$AB;}_$AI(e,t=this){e=ae(this,e,t),P(e)?e===Y||null==e||""===e?(this._$AH!==Y&&this._$AR(),this._$AH=Y):e!==this._$AH&&e!==W&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>q(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e);}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB);}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e));}_(e){this._$AH!==Y&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(H.createTextNode(e)),this._$AH=e;}$(e){const{values:t,_$litType$:a}=e,i="number"==typeof a?this._$AC(e):(void 0===a.el&&(a.el=te.createElement(X(a.h,a.h[0]),this.options)),a);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new ie(i,this),a=e.u(this.options);e.p(t),this.T(a),this._$AH=e;}}_$AC(e){let t=Q.get(e.strings);return void 0===t&&Q.set(e.strings,t=new te(e)),t;}k(e){q(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let a,i=0;for(const s of e)i===t.length?t.push(a=new se(this.O(D()),this.O(D()),this,this.options)):a=t[i],a._$AI(s),i++;i<t.length&&(this._$AR(a&&a._$AB.nextSibling,i),t.length=i);}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=O(e).nextSibling;O(e).remove(),e=t;}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e));}}class ne{get tagName(){return this.element.tagName;}get _$AU(){return this._$AM._$AU;}constructor(e,t,a,i,s){this.type=1,this._$AH=Y,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=s,a.length>2||""!==a[0]||""!==a[1]?(this._$AH=Array(a.length-1).fill(new String()),this.strings=a):this._$AH=Y;}_$AI(e,t=this,a,i){const s=this.strings;let n=!1;if(void 0===s)e=ae(this,e,t,0),n=!P(e)||e!==this._$AH&&e!==W,n&&(this._$AH=e);else{const i=e;let r,o;for(e=s[0],r=0;r<s.length-1;r++)o=ae(this,i[a+r],t,r),o===W&&(o=this._$AH[r]),n||=!P(o)||o!==this._$AH[r],o===Y?e=Y:e!==Y&&(e+=(o??"")+s[r+1]),this._$AH[r]=o;}n&&!i&&this.j(e);}j(e){e===Y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"");}}class re extends ne{constructor(){super(...arguments),this.type=3;}j(e){this.element[this.name]=e===Y?void 0:e;}}class oe extends ne{constructor(){super(...arguments),this.type=4;}j(e){this.element.toggleAttribute(this.name,!!e&&e!==Y);}}class de extends ne{constructor(e,t,a,i,s){super(e,t,a,i,s),this.type=5;}_$AI(e,t=this){if((e=ae(this,e,t,0)??Y)===W)return;const a=this._$AH,i=e===Y&&a!==Y||e.capture!==a.capture||e.once!==a.once||e.passive!==a.passive,s=e!==Y&&(a===Y||i);i&&this.element.removeEventListener(this.name,this,a),s&&this.element.addEventListener(this.name,this,e),this._$AH=e;}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e);}}class le{constructor(e,t,a){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=a;}get _$AU(){return this._$AM._$AU;}_$AI(e){ae(this,e);}}const ce=S.litHtmlPolyfillSupport;ce?.(te,se),(S.litHtmlVersions??=[]).push("3.3.3");const he=globalThis;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let pe=class extends j{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e;}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,a)=>{const i=a?.renderBefore??t;let s=i._$litPart$;if(void 0===s){const e=a?.renderBefore??null;i._$litPart$=s=new se(t.insertBefore(D(),e),e,void 0,a??{});}return s._$AI(e),s;})(t,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1);}render(){return W;}};pe._$litElement$=!0,pe.finalized=!0,he.litElementHydrateSupport?.({LitElement:pe});const me=he.litElementPolyfillSupport;me?.({LitElement:pe}),(he.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ue=e=>(t,a)=>{void 0!==a?a.addInitializer(()=>{customElements.define(e,t);}):customElements.define(e,t);},ge={attribute:!0,type:String,converter:z,reflect:!1,hasChanged:A},ve=(e=ge,t,a)=>{const{kind:i,metadata:s}=a;let n=globalThis.litPropertyMetadata.get(s);if(void 0===n&&globalThis.litPropertyMetadata.set(s,n=new Map()),"setter"===i&&((e=Object.create(e)).wrapped=!0),n.set(a.name,e),"accessor"===i){const{name:i}=a;return{set(a){const s=t.get.call(this);t.set.call(this,a),this.requestUpdate(i,s,e,!0,a);},init(t){return void 0!==t&&this.C(i,void 0,e,t),t;}};}if("setter"===i){const{name:i}=a;return function(a){const s=this[i];t.call(this,a),this.requestUpdate(i,s,e,!0,a);};}throw Error("Unsupported decorator location: "+i);};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ye(e){return(t,a)=>"object"==typeof a?ve(e,t,a):((e,t,a)=>{const i=t.hasOwnProperty(a);return t.constructor.createProperty(a,e),i?Object.getOwnPropertyDescriptor(t,a):void 0;})(e,t,a);}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function be(e){return ye({...e,state:!0,attribute:!1});}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 *//**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function _e(e,t){return(t,a,i)=>{const s=t=>t.renderRoot?.querySelector(e)??null;{const{get:e,set:n}="object"==typeof a?t:i??(()=>{const e=Symbol();return{get(){return this[e];},set(t){this[e]=t;}};})();return((e,t,a)=>(a.configurable=!0,a.enumerable=!0,Reflect.decorate&&"object"!=typeof t&&Object.defineProperty(e,t,a),a))(t,a,{get(){let t=e.call(this);return void 0===t&&(t=s(this),(null!==t||this.hasUpdated)&&n.call(this,t)),t;}});}};}const fe=async()=>{if(customElements.get("ha-checkbox")&&customElements.get("ha-slider")&&customElements.get("ha-panel-config"))return;await customElements.whenDefined("partial-panel-resolver");const e=document.createElement("partial-panel-resolver");e.hass={panels:[{url_path:"tmp",component_name:"config"}]},e._updateRoutes(),await e.routerOptions.routes.tmp.load(),await customElements.whenDefined("ha-panel-config");const t=document.createElement("ha-panel-config");await t.routerOptions.routes.automation.load();},ke=async()=>{var e,t,a,i,s,n,r;if(customElements.get("ha-yaml-editor"))return;const o=document.createElement("partial-panel-resolver").getRoutes([{component_name:"developer-tools",url_path:"a"}]);await(null===(a=null===(t=null===(e=null==o?void 0:o.routes)||void 0===e?void 0:e.a)||void 0===t?void 0:t.load)||void 0===a?void 0:a.call(t));const d=document.createElement("developer-tools-router");await(null===(r=null===(n=null===(s=null===(i=null==d?void 0:d.routerOptions)||void 0===i?void 0:i.routes)||void 0===s?void 0:s.service)||void 0===n?void 0:n.load)||void 0===r?void 0:r.call(n));},we=e=>e.callWS({type:"alarmo/config"}),$e=e=>e.callWS({type:"alarmo/sensors"}),ze=e=>e.callWS({type:"alarmo/users"}),Ae=e=>e.callWS({type:"alarmo/automations"}),xe=e=>e.callWS({type:"alarmo/sensor_groups"}),je=(e,t)=>e.callApi("POST","alarmo/config",t),Se=(e,t)=>e.callApi("POST","alarmo/sensors",t),Oe=(e,t)=>e.callApi("POST","alarmo/users",t),Ce=(e,t)=>e.callApi("POST","alarmo/automations",t),Te=(e,t)=>e.callApi("POST","alarmo/automations",{automation_id:t,remove:!0}),Ee=e=>e.callWS({type:"alarmo/areas"}),Me=(e,t)=>e.callApi("POST","alarmo/area",t),Le=e=>{class t extends e{connectedCallback(){super.connectedCallback(),this.__checkSubscribed();}disconnectedCallback(){if(super.disconnectedCallback(),this.__unsubs){for(;this.__unsubs.length;){const e=this.__unsubs.pop();e instanceof Promise?e.then(e=>e()):e();}this.__unsubs=void 0;}}updated(e){super.updated(e),e.has("hass")&&this.__checkSubscribed();}hassSubscribe(){return[];}__checkSubscribed(){void 0===this.__unsubs&&this.isConnected&&void 0!==this.hass&&(this.__unsubs=this.hassSubscribe());}}return s([ye({attribute:!1})],t.prototype,"hass",void 0),t;};var Ne={modes_short:{armed_away:"Weg",armed_home:"Tuis",armed_night:"Nag",armed_custom_bypass:"Pasgemaak",armed_vacation:"Vakansie"},enabled:"Gestel",disabled:"Afgesit"},He={time_picker:{seconds:"sekondes",minutes:"minute"},editor:{ui_mode:"Na UI",yaml_mode:"Na YAML",edit_in_yaml:"Werk by in YAML"},table:{filter:{label:"Filter items",item:"Filter volgens {name}",hidden_items:"{number} {number, plural,\n  one {item is}\n  other {items is}\n} versteek"}}},De="Alarm-paneel",Pe={general:{title:"Algemeen",cards:{general:{description:"Hierdie paneel definieer globale verstellings vir die alarm.",fields:{disarm_after_trigger:{heading:"Sit af na voorval",description:"Sit die alarm outomaties af na 'n voorval, eerder as om terug te gaan na die geaktiveerde status."},ignore_blocking_sensors_after_trigger:{heading:"Ignoreer aktiewe sensors voor aktivering",description:"Aktiveer weer die alarm sonder om seker te maak dat daar nog aktiewe sensors is."},enable_mqtt:{heading:"Aktiveer MQTT",description:"Laat toe dat die alarm-paneel deur MQTT beheer kan word."},enable_master:{heading:"Aktiveer meester alarm",description:"Skep 'n entiteit om alle areas gelyk te beheer."}},actions:{setup_mqtt:"MQTT-opstelling",setup_master:"Meester-opstelling"}},modes:{title:"Modusse",description:"Hierdie paneel kan gebruik word om verskeie modusse te aktiveer.",modes:{armed_away:"Gestel | Weg sal gebruik word wanneer niemand tuis is nie. Alle deure en vensters wat toegang tot die huis toelaat sal aktief wees, asook enige bewegingsensors binne die huis.",armed_home:"Gestel | Tuis sal gebruik word as die alarm geaktiveer word terwyl daar mense in die huis is. Alle deure en vensters wat toegang tot die huis toelaat sal aktief wees, maar geen bewegingsensors binne die huis nie.",armed_night:"Gestel | Nag sal gebruik word wanneer die alarm geaktiveer word voor slapenstyd. Al die deure en vensters wat toegang tot die huis toelaat sal aktief wees, asook sekere bewegingsensors in die huis.",armed_vacation:"Gestel | Vakansie sal gebruik word as uitbreiding van Gestel | Weg-modus in die geval dat die huis vir langer tye leeg is. Die wagperiodes en sneller-responses kan daarvolgens aangepas word.",armed_custom_bypass:"An extra mode for defining your own security perimeter."},number_sensors_active:"{number} {number, plural,\n  one {sensor}\n  other {sensors}\n} aktief",fields:{status:{heading:"Status",description:"Bevestig of die alarm geaktiveer kan word in die betrokke modus."},exit_delay:{heading:"Aktiveer-wagperiode",description:"Wanneer die alarm geaktiveer word, sal die sensors binne hierdie periode nie aktief wees nie."},entry_delay:{heading:"Afsit-wagpeiode",description:"Wagperiode voordat die alarm 'n voorval registreer nadat 'n sensor aktief is."},trigger_time:{heading:"Voorval-tydperk",description:"Periode waartydens die alarm in voorval-modues sal bly nadat 'n voorval geregistreer is."}}},mqtt:{title:"MQTT-opstelling",description:"Hierdie paneel kan gebruik word om MQTT op te stel.",fields:{state_topic:{heading:"State topic",description:"Topic waarop statusse gepubliseer word"},event_topic:{heading:"Event topic",description:"Topic waarop events gepubliseer word"},command_topic:{heading:"Command topic",description:"Topic waarop commands gepubliseer word"},require_code:{heading:"Vereis kode",description:"Vereis die kode om saam met die command gestuur te word"},state_payload:{heading:"Stel payload per status op",item:"Definieer 'n payload vir status ''{state}''"},command_payload:{heading:"Stel payload op per command",item:"Definieer 'n payload vir command ''{command}''"}}},areas:{title:"Areas",description:"Areas kan gebruik word om jou huis is afdelings op te deel.",no_items:"Daar is nog geen areas gedefinieer nie.",table:{remarks:"Opmerkings",summary:"Hierdie area bevat {summary_sensors} en {summary_automations}.",summary_sensors:"{number} {number, plural,\n  one {sensor}\n  other {sensors}\n}",summary_automations:"{number} {number, plural,\n  one {outomatisasie}\n  other {outomatisasies}\n}"},actions:{add:"Voeg by"}}},dialogs:{create_area:{title:"Nuwe area",fields:{copy_from:"Dupliseer verstellings vanaf"}},edit_area:{title:"Bywerk van area ''{area}''",name_warning:"Let wel! Deur die naam te verander gaan die enditeit-id ook verander"},remove_area:{title:"Verwyder area?",description:"Is jy seker jy wil die area verwyder? Hierdie area bevat {sensors} sensors en {automations} automations, wat ook verwyder gaan word."},edit_master:{title:"Meester-opstelling"},disable_master:{title:"Sit meester af?",description:"Is jy seker jy wil meester verwyder? Hierdie area bevat {automations} automations, wat ook verwyder gaan word."}}},sensors:{title:"Sensors",cards:{sensors:{description:"Huidig-opgestelde sensors. Kies 'n item om veranderinge te maak.",table:{no_items:"Daar is geen sensors wat hier gewys kan word nie.",no_area_warning:"Sensor is aan geen area gekoppel nie.",arm_modes:"Aktiveer-modusse",always_on:"(Altyd)"}},add_sensors:{title:"Boeg sensors by",description:"Voeg nog sensors by. Maak seker dat jou sensors se name gepas is sodat jy hulle kan identifiseer.",no_items:"Daar is geen HA-entiteite war vir die alarm opgestel kan word nie. Maak seker om entiteit-tipe, binary_sensor in te sluit.",table:{type:"Tipe opgetel"},actions:{add_to_alarm:"Voeg by die alarm",filter_supported:"Versteek items van onbekende tipes."}},editor:{title:"Verstel Sensor",description:"Stel die sensor-verstellings op vir ''{entity}''.",fields:{entity:{heading:"Entiteit",description:"Entiteit geassosieer met die sensor"},area:{heading:"Area",description:"Kies die area waar die sensor is."},group:{heading:"Groep",description:"Groepeer saam met ander sensors vir gekombineerde voorvalregistrasie."},device_type:{heading:"Toestel-tipe",description:"Kies die tipe toestel om die opstelling van beste gepas aan te wend.",choose:{door:{name:"Deur",description:"'n Deur, hek of ander toegangspunt vir die huis."},window:{name:"Venster",description:"'n Venster of deur wat nie vir toegang gebruik word nie, soos balkon skuifdeure"},motion:{name:"Beweging",description:"Bewegingsensor of soortgelyk, wat 'n wagperiode het tussen voorvalle."},tamper:{name:"Peuter",description:"Sensor om die verwyder van bedekking, breek van glas ens. op te tel."},environmental:{name:"Omgewing",description:"Rook/gas-sensor, optel van waterlekke ens."},other:{name:"Generies"}}},always_on:{heading:"Altyd aan",description:"Sensor should always trigger the alarm."},modes:{heading:"Aktiewe modusse",description:"Alarm modes in which this sensor is active."},arm_on_close:{heading:"Aktiveer na toemaak",description:"After deactivation of this sensor, the remaining exit delay will automatically be skipped."},use_exit_delay:{heading:"Gebruik aktivering-wagperiode",description:"Sensor is allowed to be active when the exit delay starts."},use_entry_delay:{heading:"Gebruik afsit-wagperiode",description:"Sensor activation triggers the alarm after the entry delay rather than directly."},entry_delay:{heading:"Afsit-wagperiode",description:"Vervang die vertraging (soos ingestel vir die sekuriteitsmodus) met 'n spesifieke waarde."},delay_on:{heading:"Delay on",description:"Sensor must remain active for this duration before triggering. Resets if sensor deactivates."},allow_open:{heading:"Laat toe om aanvanklik oop te wees",description:"Open state while arming is ignored (subsequent sensor activation will trigger alarm)."},auto_bypass:{heading:"Ignoreer outomaties",description:"Exclude this sensor from the alarm if it is open while arming.",modes:"Modusse waarin die sensor geïgnoreer moet word."},trigger_unavailable:{heading:"Registreer voorvan wanneer nie beskikbaar",description:"When the sensor state becomes 'unavailable', this will activate the sensor."}},actions:{toggle_advanced:"Gevorderde verstellings",remove:"Verwyder",setup_groups:"Stel groepe op"},errors:{description:"Stel die volgende foute reg:",no_area:"Geen area is gekies nie",no_modes:"Geen modusse is gekies waarvoor die sensor aktief moet wees nie.",no_auto_bypass_modes:"Geen modusse is gekies vir die sensor om outomaties geïgnoreer te word nie."}}},dialogs:{manage_groups:{title:"Vestuur sensor-groepe",description:"In 'n sensor-groep, moet verskeie sensors geaktiveer word binne 'n gegewe tydperk vir die alarm om 'n voorval te registreer.",no_items:"Nog geen groepe nie",actions:{new_group:"Nuwe groep"}},create_group:{title:"Nuwe sensor-groep",fields:{name:{heading:"Name",description:"Naam van die sensor-groep"},timeout:{heading:"Tyd op",description:"Tydperiode waatydens opeenvolgende sensoraktiverings 'n voorval registreer."},event_count:{heading:"Telling",description:"Hoeveelheid verskillende sensors wat aktief moet wees om 'n voorval te registreer."},sensors:{heading:"Sensors",description:"Kies die sensors vir die groep."}},errors:{invalid_name:"Ongeldige naam",insufficient_sensors:"Ten minste 2 sensors moet gekies word."}},edit_group:{title:"Werk sensorgroep by ''{name}''"}}},codes:{title:"Kodes",cards:{codes:{description:"Verander die kode-verstellings.",fields:{code_arm_required:{heading:"Vereis 'n kode om te aktiveer",description:"'n Geldige kode word vereis om die alarm te aktiveer."},code_disarm_required:{heading:"Vereis 'n kode om af te sit",description:"'n Geldige kode word vereis om die alarm af te sit."},code_mode_change_required:{heading:"Require code for switching mode",description:"'n Geldige kode word vereis om die alarm se aktiewe modus te verander."},code_format:{heading:"Kode-formaat",description:"Sets the input type for Lovelace alarm card.",code_format_number:"Pinkode",code_format_text:"Wagwoord"}}},user_management:{title:"Bestuur gebruikers",description:"Elke gebruik het hulle eie kode om die alarm aan en af te skakel.",no_items:"Daar is nog geen gebruikers nie",actions:{new_user:"Nuwe gebruiker"}},new_user:{title:"Skep nuwe wagwoord",description:"Users can be created for providing access to operating the alarm.",fields:{name:{heading:"Naam",description:"Naam van die gebruiker."},code:{heading:"Kode",description:"Kode vir die gebruiker."},confirm_code:{heading:"Bevestig kode",description:"Bevestig die kode."},can_arm:{heading:"Laat kode toe om die alarm aan te sit",description:"Deur die kode in te tik sal die alarm geaktiveer word"},can_disarm:{heading:"Laat die kode toe om die alarm af te sit",description:"Deur die kode in te voeg sal die alarm afgesit word."},is_override_code:{heading:"Oorheers die kode",description:"Deur die kode in te tik sal die alarm geforseer wees om aan te sit"},area_limit:{heading:"Beperkte areas",description:"Beperk die gebruiker tot sekere areas"}},errors:{no_name:"Die naam is nie voorsien nie.",no_code:"Die kode moet ten minste 4 karakters bevat.",code_mismatch:"Die kodes verskil."}},edit_user:{title:"Werk gebruiker by",description:"Verander verstelling vir gebruiker, ''{name}''.",fields:{old_code:{heading:"Huidige kode",description:"Huidige kode, los leeg om die kode dieselfde te hou."}}}}},actions:{title:"Aksies",cards:{notifications:{title:"Kennisgewings",description:"Deur die paneel te gebruik, kan jy die kennisgewings bestuur wat gestuur word na sekere aksies.",table:{no_items:"Daar is nog geen kennisgewings nie.",no_area_warning:"Aksie is nie aan enige area toegeken nie."},actions:{new_notification:"Nuwe kennisgewing"}},actions:{description:"Hierdie paneel kan gebruik word om 'n toestel te skakel wanneer die alarm-modus verander.",table:{no_items:"Daar is nog geen nuwe aksies nie."},actions:{new_action:"Nuwe aksie"}},new_notification:{title:"Stel kennisgewing",description:"Ontvang 'n kennisgewing wanneer die alarm aan- of afgesit word.",trigger:"Voorvereiste",action:"Taak",options:"Opsies",fields:{event:{heading:"Voorval",description:"Wanneer moet die kennisgewing gestuur word.",choose:{armed:{name:"Alarm is gestel",description:"Die alarm is uksesvol gestel."},disarmed:{name:"Alarm is af",description:"Die alarm is afgesit."},triggered:{name:"'n Voorval vind plaas'",description:"Die alarm het 'n voorval geregistreer."},untriggered:{name:"Voorval het gestop",description:"Die voorval vind nie meer plaas nie."},arm_failure:{name:"Die alarm is nie gestel nie",description:"Die alarm kan nie gestel word nie, as gevolg van een of meer oop sensors."},arming:{name:"Uitgang-wagperiode het begin",description:"Die uitgang-wagperiode het begin. Maak reg om uit te gaan."},pending:{name:"Die inkom-wagperiode het begin",description:"Die inkom-wagperiode het begin en die alarm gaan binnekort afgaan."}}},mode:{heading:"Modus",description:"Beperk die aksie tot sekere modusse (opsioneel)"},title:{heading:"Titel",description:"Titel vir die kennisgewing-boodskap"},message:{heading:"Boodskap",description:"Inhou dvan die kennisgewing-boodskap",insert_wildcard:"Voeg wildcard in",placeholders:{armed:"Die alarm is gestel op {{arm_mode}}",disarmed:"Die alarm is nou af",triggered:"'n Voorval het plaasgevind, as gevolg van {{open_sensors}}.",untriggered:"Die voorval is gestop.",arm_failure:"Die alarm kan nie aangesit word nie, as gevolg van {{open_sensors}}.",arming:"Die alarm gaan binnekort aangesit word, gaan uit.",pending:"'n Voorval gaan binnekort registreer, sit vinnig die alarm af!"}},open_sensors_format:{heading:"Formaat vir die open_sensors wildcard",description:"Kies watter sensor-inligting in die boodskap gevoeg moet word",options:{default:"Name en statusse",short:"Slegs name"}},arm_mode_format:{heading:"Vertaling van arm_mode wildcard",description:"Kies die taal waarin die modus in die boodskap gevoeg moet word"},target:{heading:"Teiken",description:"Toestel om die kennisgewing heen te stuur"},media_player_entity:{heading:"Media-speler entiteit",description:"Media-speler om die kennisgewing op te speel"},name:{heading:"Naam",description:"Beskrywing vir die kennisgewing",placeholders:{armed:"Stel {target} in kennis wanneer die alarm aangesit word",disarmed:"Stel {target} in kennis wanneer die alarm afgesit word",triggered:"Stel {target} in kennis wanneer 'n voorval plaasvind",untriggered:"Stel {target} in kennis wanneer die voorval stop",arm_failure:"Stel {target} in kennis wanneer die alarm nie geaktiveer kan word nie",arming:"Stel {target} in kennis wanneer uitgaan",pending:"Stel {target} in kennis wanneer terugkom"}},delete:{heading:"Skrap automation",description:"Skrap die automation permanent"}},actions:{test:"Probeer dit nou"}},new_action:{title:"Stel aksie",description:"Skakel ligte of toestelle, soos sirenes, wanneer die alarm aan- of afgesit word, met aktivering ens.",fields:{event:{heading:"Voorval",description:"Wanneer moet die aksie plaasvind?"},area:{heading:"Area",description:"Area waar die voorval plaasvind"},mode:{heading:"Modus",description:"Beperk die aksie tot spesifieke alarm-modusse (opsioneel)"},entity:{heading:"Entiteit",description:"Entiteit waarop die aksie plaasvind"},action:{heading:"Aksie",description:"Aksie om op die entiteit uit te voer",no_common_actions:"Aksies vir die gesellekteerde entiteite kan slegs deur YAML bygewerk word."},name:{heading:"Naam",description:"Beskrywing vir die aksie",placeholders:{armed:"Stel {entity} na {state} wanneer die alarm aangesit word",disarmed:"Stel {entity} na {state} wanneer die alarm afgesit word",triggered:"Stel {entity} na {state} wanneer 'n voorval plaasvind",untriggered:"Stel {entity} na {state} wanneer die voorval stop",arm_failure:"Stel {entity} na {state} as die alarm nie aangesit kan word nie",arming:"Stel {entity} na {state} wanneer uitgaan",pending:"Stel {entity} na {state} wanneer terugkom"}}}}}}},qe={common:Ne,components:He,title:De,panels:Pe},Be=Object.freeze({__proto__:null,common:Ne,components:He,default:qe,panels:Pe,title:De}),Ie={modes_short:{armed_away:"Fora",armed_home:"Casa",armed_night:"Nit",armed_custom_bypass:"Personalitzat",armed_vacation:"Vacation"},enabled:"Activat",disabled:"Desactivat"},Ve={time_picker:{seconds:"segons",minutes:"minuts"},editor:{ui_mode:"Canvia a UI",yaml_mode:"Canvia a YAML",edit_in_yaml:"Edit in YAML"},table:{filter:{label:"Filter items",item:"Filter by {name}",hidden_items:"{number} {number, plural,\n  one {item is}\n  other {items are}\n} hidden"}}},Re="Tauler alarma",Ue={general:{title:"General",cards:{general:{description:"Aquest tauler defineix alguns paràmetres globals de l'alarma.",fields:{disarm_after_trigger:{heading:"Desactivar després del disparador",description:"Quan hagi transcorregut el temps d’activació, desactiveu l’alarma en lloc de tornar a l’estat armat."},ignore_blocking_sensors_after_trigger:{heading:"Ignora els sensors de bloqueig en rearmar",description:"Torna a l'estat armat sense comprovar si hi ha sensors que encara puguin estar actius."},enable_mqtt:{heading:"Activa MQTT",description:"Permet controlar el tauler d'alarma mitjançant MQTT."},enable_master:{heading:"Activa l'alarma mestra",description:"Crea una entitat per controlar totes les àrees simultàniament."}},actions:{setup_mqtt:"Configuració MQTT",setup_master:"Configuració mestra"}},modes:{title:"Modes",description:"Aquest tauler es pot utilitzar per configurar els modes d'activació de l'alarma.",modes:{armed_away:"El mode fora de casa s'utilitzarà quan totes les persones surtin de casa. Es controlen totes les portes i finestres que permeten l'accés a la casa, així com els sensors de moviment dins de la casa.",armed_home:"El mode a casa (també conegut com mode casa) s'utilitzarà quan configureu l'alarma mentre hi hagi persones a la casa. Es controlen totes les portes i finestres que permetin l'accés a la casa, però no els sensors de moviment a l'interior de la casa.",armed_night:"El mode nit s'utilitzarà quan configureu l'alarma abans d'anar a dormir. Es controlaran totes les portes i finestres que permetin l'accés a la casa i es seleccionaran els sensors de moviment (per exemple, a la planta baixa) de la casa.",armed_vacation:"Armed vacation can be used as an extension to the armed away mode in case of absence for longer duration. The delay times and trigger responses can be adapted (as desired) to being distant from home.",armed_custom_bypass:"Un mode addicional per definir el vostre propi perímetre de seguretat."},number_sensors_active:"{number} {number, plural,\n  one {sensor}\n  other {sensors}\n} activa",fields:{status:{heading:"Status",description:"Controls whether the alarm can be armed in this mode."},exit_delay:{heading:"Retard de sortida",description:"Quan activeu l'alarma, en aquest període de temps els sensors encara no activaran l'alarma."},entry_delay:{heading:"Retard d'entrada",description:"Temps de retard fins que s'activi l'alarma després que s'activi un dels sensors."},trigger_time:{heading:"Temps d'activació",description:"Temps durant el qual sonarà la sirena"}}},mqtt:{title:"Configuració MQTT",description:"Aquest tauler es pot utilitzar per configurar la interfície MQTT.",fields:{state_topic:{heading:"Tema d'estat",description:"Tema sobre el qual es publiquen les actualitzacions d'estat"},event_topic:{heading:"Tema d'esdeveniment",description:"Tema sobre el qual es publiquen els esdeveniments d'alarma"},command_topic:{heading:"Tama d'ordre",description:"Tema sobre el qual s'envien les ordres d'activació/desactivació."},require_code:{heading:"Requereix codi",description:"Requereix l'enviament d'un codi amb l'ordre."},state_payload:{heading:"Configura la càrrega útil per estat",item:"Definiu una càrrega útil per a l'estat ''{state}''"},command_payload:{heading:"Configura la càrrega útil per ordre",item:"Definiu una càrrega útil per a l'ordre ''{command}''"}}},areas:{title:"Àrees",description:"Les àrees es poden utilitzar per dividir el sistema d'alarma en diversos compartiments.",no_items:"Encara no hi ha àrees definides.",table:{remarks:"Observacions",summary:"Aquesta àrea conté {summary_sensors} i {summary_automations}.",summary_sensors:"{number} {number, plural,\n  one {sensor}\n  other {sensors}\n}",summary_automations:"{number} {number, plural,\n  one {automatisme}\n  other {automatismes}\n}"},actions:{add:"Afegeix"}}},dialogs:{create_area:{title:"Àrea nova",fields:{copy_from:"Copia la configuració de"}},edit_area:{title:"Edita l'àrea ''{area}''",name_warning:"Nota: si canvieu el nom, es canviarà l'identificador d'entitat"},remove_area:{title:"Voleu eliminar l'àrea?",description:"Confirmeu que voleu eliminar aquesta àrea? Aquesta àrea conté {sensors} sensors i {automatismes} automatismes, que també s'eliminaran."},edit_master:{title:"Configuració mestra"},disable_master:{title:"Voleu desactivar l'alarma mestra?",description:"Confirmeu que voleu eliminar l'alarma mestra? Aquesta àrea conté automatismes {automatismes}, que s'eliminaran amb aquesta acció."}}},sensors:{title:"Sensors",cards:{sensors:{description:"Sensors configurats actualment. Feu clic a una entitat per fer canvis.",table:{no_items:"No hi ha cap sensor per mostrar",arm_modes:"Modes d'armat",always_on:"(Sempre)",no_area_warning:"Sensor is not assigned to any area."}},add_sensors:{title:"Afegeix sensors",description:"Afegiu més sensors. Assegureu-vos que els vostres sensors tinguin un friendly_name perquè pugueu identificar-los.",no_items:"No hi ha entitats HA disponibles que es puguin configurar per a l'alarma. Assegureu-vos d'incloure entitats del tipus binary_sensor.",table:{type:"Detected type"},actions:{add_to_alarm:"Afegeix a l'alarma",show_all:"Mostra-ho tot"}},editor:{title:"Edita el sensor",description:"Edita la configuració del sensor de ''{entity}''.",fields:{entity:{heading:"Entidad",description:"Entidad asociada a este sensor"},area:{heading:"Àrea",description:"Seleccioneu una àrea que contingui aquest sensor."},group:{heading:"Group",description:"Group with other sensors for combined triggering."},device_type:{heading:"Tipus de dispositiu",description:"Trieu un tipus de dispositiu per aplicar automàticament la configuració adequada.",choose:{door:{name:"Porta",description:"Porta, porta de garatge o altra entrada que s'utilitzi per entrar/sortir de casa."},window:{name:"Finestra",description:"Finestra o una porta que no s'utilitza per entrar a la casa, com ara un balcó."},motion:{name:"Moviment",description:"Sensor de presència o dispositiu similar que té un retard entre les activacions."},tamper:{name:"Antisabotatge",description:"Detector de retirada de la coberta del sensor, sensor de trencament de vidre, etc."},environmental:{name:"Ambiental",description:"Sensor de fum o gas, detector de fuites, etc. (no relacionat amb la protecció antirobatori)."},other:{name:"Genèric"}}},always_on:{heading:"Sempre activat",description:"El sensor sempre ha de disparar l'alarma."},modes:{heading:"Modes habilitats",description:"Modes d'alarma en què aquest sensor està actiu."},arm_on_close:{heading:"Arma després de tancar",description:"Després de la desactivació d'aquest sensor, s'omet automàticament el temps de retard de sortida restant."},use_exit_delay:{heading:"Use exit delay",description:"Sensor is allowed to be active when the exit delay starts."},use_entry_delay:{heading:"Use entry delay",description:"Sensor activation triggers the alarm after the entry delay rather than directly."},entry_delay:{heading:"Entry delay",description:"Override the entry delay (as configured for the arm mode) with a delay specific to the sensor."},delay_on:{heading:"Delay on",description:"Sensor must remain active for this duration before triggering. Resets if sensor deactivates."},allow_open:{heading:"Permet obrir mentre s'arma l'alarma",description:"Permeteu que aquest sensor estigui actiu poc després de configurar-lo de manera que no bloquegi l'activació de l'alarma."},auto_bypass:{heading:"Omet automàticament",description:"Excloeu aquest sensor de l'alarma si està obert mentre s'arma l'alarma.",modes:"Modes in which sensor may be bypassed"},trigger_unavailable:{heading:"Activador quan no estigui disponible",description:"Quan l'estat del sensor no estigui disponible, això activarà el sensor."}},actions:{toggle_advanced:"Configuració avançada",remove:"Elimina",setup_groups:"Setup groups"},errors:{description:"Corregiu els errors següents:",no_area:"No s'ha seleccionat cap àrea",no_modes:"No s'han seleccionat modes per als quals el sensor hauria d'estar actiu",no_auto_bypass_modes:"No modes are selected for the sensor may be automatically bypassed"}}},dialogs:{manage_groups:{title:"Manage sensor groups",description:"In a sensor group multiple sensors must be activated within a time period before the alarm is triggered.",no_items:"No groups yet",actions:{new_group:"New group"}},create_group:{title:"New sensor group",fields:{name:{heading:"Name",description:"Name for sensor group"},timeout:{heading:"Time-out",description:"Time period during which consecutive sensor activations triggers the alarm."},event_count:{heading:"Nombre",description:"Quantitat de sensors diferents que cal activar per activar l'alarma."},sensors:{heading:"Sensors",description:"Select the sensors which are contained by this group."}},errors:{invalid_name:"Invalid name provided.",insufficient_sensors:"At least 2 sensors need to be selected."}},edit_group:{title:"Edit sensor group ''{name}''"}}},codes:{title:"Codis",cards:{codes:{description:"Canvieu la configuració del codi.",fields:{code_arm_required:{heading:"Utilitzeu un codi d'activació",description:"Requereix un codi per activar l'alarma."},code_disarm_required:{heading:"Utilitzeu un codi de desactivació",description:"Requereix un codi per desactivar l'alarma."},code_mode_change_required:{heading:"Requerir un codi para cambiar de modo",description:"Se necesita un codi válido para cambiar el modo de armado que está activo."},code_format:{heading:"Format del codi",description:"Estableix el tipus de codi per a la targeta d'alarma Lovelace.",code_format_number:"Codi PIN",code_format_text:"Contrasenya"}}},user_management:{title:"Gestió d'usuaris",description:"Cada usuari té el seu propi codi per activar/desactivar l'alarma.",no_items:"Encara no hi ha usuaris",actions:{new_user:"Usuari nou"}},new_user:{title:"Crea un usuari nou",description:"Es poden crear usuaris per proporcionar accés al funcionament de l'alarma.",fields:{name:{heading:"Nom",description:"Nom de l'usuari."},code:{heading:"Codi",description:"Codi d'aquest usuari."},confirm_code:{heading:"Confirmeu el codi",description:"Repetiu el codi."},can_arm:{heading:"Permetre que el codi active l'alarma",description:"Entering this code activates the alarm"},can_disarm:{heading:"Permetre que el codi desactive l'alarma",description:"Entering this code deactivates the alarm"},is_override_code:{heading:"És un codi de sobreescriptura",description:"Si introduïu aquest codi, es forçarà l'estat d'activació de l'alarma"},area_limit:{heading:"Restricted areas",description:"Limit user to control only the selected areas"}},errors:{no_name:"No s'ha proporcionat cap nom.",no_code:"El codi ha de tenir 4 caràcters o números com a mínim.",code_mismatch:"Els codis no coincideixen."}},edit_user:{title:"Edita l'usuari",description:"Canvia la configuració de l'usuari ''{name}''.",fields:{old_code:{heading:"Codi actual",description:"Codi actual, deixeu-lo en blanc per deixar-lo sense canvis."}}}}},actions:{title:"Accions",cards:{notifications:{title:"Notificacions",description:"Utilitzant aquest tauler, podeu gestionar les notificacions que s'envien quan es produeix un determinat esdeveniment d'alarma.",table:{no_items:"Encara no s'han creat notificacions.",no_area_warning:"Action is not assigned to any area."},actions:{new_notification:"Nova notificació"}},actions:{description:"Aquest tauler es pot utilitzar per canviar un dispositiu quan l'estat d'alarma canvia.",table:{no_items:"Encara no s'han creat accions."},actions:{new_action:"Nova acció"}},new_notification:{title:"Crea una notificació",description:"Crea una nova notificació.",trigger:"Condition",action:"Task",options:"Options",fields:{event:{heading:"Esdeveniment",description:"Quan s'ha d'enviar la notificació",choose:{armed:{name:"L'alarma està activada",description:"L'alarma s'ha activat correctament"},disarmed:{name:"L'alarma està desactivada",description:"L'alarma està desactivada"},triggered:{name:"L'alarma s'activat per esdeveniment",description:"L'alarma s'activat per esdeveniment"},untriggered:{name:"Alarm not longer triggered",description:"The triggered state of the alarm has ended"},arm_failure:{name:"No s'ha pogut activar l'alarma",description:"L'activació de l'alarma ha fallat a causa d'un o més sensors estan oberts"},arming:{name:"S'ha iniciat el retard de sortida",description:"S'ha iniciat el retard de sortida, a punt per sortir de casa."},pending:{name:"S'ha iniciat el retard d'entrada",description:"El retard d'entrada s'ha iniciat, l'alarma s'activarà aviat."}}},mode:{heading:"Mode",description:"Limita l'acció a modes específics d'activació (opcional)"},title:{heading:"Títol",description:"Títol del missatge de notificació"},message:{heading:"Missatge",description:"Contingut del missatge de notificació",insert_wildcard:"Insert wildcard",placeholders:{armed:"The alarm is set to {{arm_mode}}",disarmed:"The alarm is now OFF",triggered:"The alarm is triggered! Cause: {{open_sensors}}.",untriggered:"The alarm is not longer triggered.",arm_failure:"The alarm could not be armed right now, due to: {{open_sensors}}.",arming:"The alarm will be armed soon, please leave the house.",pending:"The alarm is about to trigger, disarm it quickly!"}},open_sensors_format:{heading:"Format for open_sensors wildcard",description:"Choose which sensor information in inserted in the message",options:{default:"Names and states",short:"Names only"}},arm_mode_format:{heading:"Translation for arm_mode wildcard",description:"Choose in which language the arm mode is inserted in the message"},target:{heading:"Destinatari",description:"Dispositiu al qual enviar el missatge"},media_player_entity:{heading:"Entitat de reproductor multimèdia",description:"Reproductor multimèdia a reproduir el missatge."},name:{heading:"Nom",description:"Descripció d'aquesta notificació",placeholders:{armed:"Notify {target} upon arming",disarmed:"Notify {target} upon disarming",triggered:"Notify {target} when triggered",untriggered:"Notify {target} when triggering stops",arm_failure:"Notify {target} on failure",arming:"Notify {target} when leaving",pending:"Notify {target} when arriving"}},delete:{heading:"Delete automation",description:"Permanently remove this automation"}},actions:{test:"Prova-ho"}},new_action:{title:"Crea una acció",description:"Aquest tauler es pot utilitzar per canviar un dispositiu quan l'estat d'alarma canvia.",fields:{event:{heading:"Esdeveniment",description:"Quan s'ha d'executar l'acció"},area:{heading:"Àrea",description:"Àrea per a la qual s'aplica l'esdeveniment."},mode:{heading:"Mode",description:"Limita l'acció a modes específics d'activació (opcional)"},entity:{heading:"Entitat",description:"Entitat en què es realitzarà l'acció"},action:{heading:"Acció",description:"Acció a realitzar a l'entitat",no_common_actions:"Actions can only be assigned in YAML mode for the selected entities."},name:{heading:"Nom",description:"Descripció d'aquesta acció",placeholders:{armed:"Set {entity} to {state} upon arming",disarmed:"Set {entity} to {state} upon disarming",triggered:"Set {entity} to {state} when triggered",untriggered:"Set {entity} to {state} when triggering stops",arm_failure:"Set {entity} to {state} on failure",arming:"Set {entity} to {state} when leaving",pending:"Set {entity} to {state} when arriving"}}}}}}},Ge={common:Ie,components:Ve,title:Re,panels:Ue},Fe=Object.freeze({__proto__:null,common:Ie,components:Ve,default:Ge,panels:Ue,title:Re}),Ke={modes_short:{armed_away:"Pryč",armed_home:"Doma",armed_night:"Noc",armed_custom_bypass:"Vlastní",armed_vacation:"Dovolená"},enabled:"Povoleno",disabled:"Zakázáno"},Ze={time_picker:{seconds:"sekundy",minutes:"minuty"},editor:{ui_mode:"Do UI",yaml_mode:"Do YAML",edit_in_yaml:"Upravit v YAML"},table:{filter:{label:"Filtrovat položky",item:"Filtrovat podle {name}",hidden_items:"{number} {number, plural,\n  one {položka je}\n  other {položky jsou}\n} skryté"}}},We="Alarm panel",Ye={general:{title:"Obecné",cards:{general:{description:"Tento panel definuje obecné nastavení alarmu.",fields:{disarm_after_trigger:{heading:"Deaktivovat alarm po spuštění",description:"Po vypršení času spuštěného alarmu, deatkivovat alarm místo návratu do zajištěného stavu."},ignore_blocking_sensors_after_trigger:{heading:"Ignorovat blokující senzory při opětovném zapnutí",description:"Návrat do zapnutého stavu bez kontroly senzorů, které by mohly být stále aktivní."},enable_mqtt:{heading:"Povolit MQTT",description:"Povolení kontroly alarmu přes MQTT."},enable_master:{heading:"Povolit centrální alarm",description:"Vytvoří entitu pro kontrolu alarmu pro všechny zóny."}},actions:{setup_mqtt:"Nastavení MQTT",setup_master:"Nastavení centrálního alarmu"}},modes:{title:"Režimy",description:"Tento panel slouží k nastavení režimů alarmu.",modes:{armed_away:"Zajištěno Pryč se používá v případě, že nikdo není doma. Veškeré dveře a okna jsou hlídaná proti otevření a pohybové senzory kontrolují uvnitř",armed_home:"Zajištěno Doma se používá v případě, že se někdo v domě pohybuje. Veškeré dveře a okna jsou hlídaná proti otevření, ale pohybové senzory hlídané nejsou.",armed_night:"Zajištěno Noc se používá v případe, že chceme zajistit při spánku. Můžete vybrat které dveře a pohybové senzory spustí alarm a které ne. (například v přízemí domu)",armed_vacation:"Zajištěno Dovolená se používá jako rošíření Zajištěno Pryč, pro nastavení různého chování alarmu. Například delší doba sirény, odeslání notifikace ...",armed_custom_bypass:"Speciální režim pro kompletní kontrolu nad nastavením alarmu."},number_sensors_active:"{number} {number, plural,\n  one {senzor}\n  other {senzorů}\n} aktivní",fields:{status:{heading:"Stav",description:"Určuje, zda v tomto režimu je možné alarm zajistit."},exit_delay:{heading:"Čekání na odchod",description:"V případě zajištění alarmu, po tuto dobu nebudou vyhodnoceny změny seznorů (například otevření hlavních dveří)"},entry_delay:{heading:"Čekání při příchodu",description:"Zpoždění spuštění alarmu pro možnost zadání kódu při příchodu domů."},trigger_time:{heading:"Délka spuštění alarmu",description:"Doba po kterou alarm zůstane ve spuštěném stavu."}}},mqtt:{title:"Nastavení MQTT",description:"Tento panel slouží pro nastavení MQTT komunikace.",fields:{state_topic:{heading:"State topic",description:"Topic on which state updates are published"},event_topic:{heading:"Event topic",description:"Topic on which alarm events are published"},command_topic:{heading:"Command topic",description:"Topic which Alarmo listens to for arm/disarm commands."},require_code:{heading:"Require code",description:"Require the code to be sent with the command."},state_payload:{heading:"Configure payload per state",item:"Define a payload for state ''{state}''"},command_payload:{heading:"Configure payload per command",item:"Define a payload for command ''{command}''"}}},areas:{title:"Zóny",description:"Zóny mohou být použity pro rozdělení alarmu do více oblastí.",no_items:"Zatím nejsou definované žádné zóny.",table:{remarks:"Poznámka",summary:"Tato zóna obsahuje {summary_sensors} a {summary_automations}.",summary_sensors:"{number} {number, plural,\n  one {senzor}\n  other {senzorů}\n}",summary_automations:"{number} {number, plural,\n  one {automatizace}\n  other {automatiací}\n}"},actions:{add:"Přidat"}}},dialogs:{create_area:{title:"Nové zóna",fields:{copy_from:"Zkopírovat nastavení z"}},edit_area:{title:"Úprava zóny ''{area}''",name_warning:"Poznámka: změna jména zárověň změní i ID entity"},remove_area:{title:"Odebrat zónu?",description:"Jste si jistí? Tato zóna obsahuje {sensors} senzory a {automations} automatizace, které budou odstraněny také."},edit_master:{title:"Centrální nastavení"},disable_master:{title:"Zakázat centrální ovládání?",description:"Jste si jistí?  Tato zóna obsahuje {sensors} senzory a {automations} automatizace, které budou odstraněny také."}}},sensors:{title:"Senzory",cards:{sensors:{description:"Aktuálně nastavené senzory. Pro změnu klikněte na položku.",table:{no_items:"Žádné senzory k zobrazení.",no_area_warning:"Senzor není přiřazen k žádné zóně",arm_modes:"Režimy alarmu",always_on:"(Vždy)"}},add_sensors:{title:"Přidat Senzor",description:"Přidat další senzory. Ujistěte se, že vaše senzory jsou správně pojmenovány.",no_items:"Nejsou žádné dostupné HA entity, které mohou být nastaveny pro alarm. Přidejte prosím pouze entity typu binary_sensor.",table:{type:"Zjištěný typ"},actions:{add_to_alarm:"Přidat do alarmu",filter_supported:"Skrýt položky neznámého typu"}},editor:{title:"Upravit Senzor",description:"Nastavení senzoru entity ''{entity}''.",fields:{entity:{heading:"Entita",description:"Entidad asociada a este sensor"},area:{heading:"Zóna",description:"Vyberte zónu do které má senzor patřit."},group:{heading:"Skupina",description:"Seskupit senzory pro kombinované spuštění alarmu."},device_type:{heading:"Typ zařízení",description:"Vyberte typ zařízení pro automatické předvyplnění parametrů.",choose:{door:{name:"Dveře",description:"Dveře, brána nebo jiný prostředek pro vstup/opuštění domu."},window:{name:"Okno",description:"Okno nebo balkonové dveře, které neslouží pro vstup do domu."},motion:{name:"Pohyb",description:"Pohybový senzor nebo podobné zařízeni pro zjištění přítomnosti osob."},tamper:{name:"Manipulace",description:"Detektor manipulace se senzorem, senzor rozbitého okna, atd."},environmental:{name:"Prostředí",description:"Senzor kouře/plynu, detektor úniku vody, atd. (neslouží k ochraně před zloději)."},other:{name:"Obecné"}}},always_on:{heading:"Vždy zapnuto",description:"Senzor vždy spustí alarm."},modes:{heading:"Povolené režimy",description:"Režimy alarmu, pro které se má senzor vyhodnocovat."},arm_on_close:{heading:"Zajistit po zavření",description:"Po deaktivaci tohoto senzoru, přeskočit čekání na odchod."},use_exit_delay:{heading:"Použít při čekání na odchod",description:"Senzor může být aktivní když začne čekání na odchod."},use_entry_delay:{heading:"Použíy čekání na vstup",description:"Aktivace senzoru spustí alarm až uplyne doba čekání na vstup."},entry_delay:{heading:"Zpoždění při příjezdu",description:"Přepsat vstupní zpoždění (nakonfigurované pro režim zapnutí) zpožděním specifickým pro daný senzor."},delay_on:{heading:"Delay on",description:"Sensor must remain active for this duration before triggering. Resets if sensor deactivates."},allow_open:{heading:"Povolit aktivní senzor po zajištění",description:"Pokud je senzor stále aktivní i po čekání na odchod, nezpůsobí chybu zajištění."},auto_bypass:{heading:"Automaticky vyřadit senzor",description:"Pokud je senzor v době zajištění aktivní, bude automaticky vyřazen z alarmu.",modes:"Režimy, ve kterých může být senzor automaticky vyřazen"},trigger_unavailable:{heading:"Spustit alarm při nedostupnosti",description:"Pokud stav senzoru není dostupný, spustí alarm."}},actions:{toggle_advanced:"Rozšířené nastavení",remove:"Odebrat",setup_groups:"Nastavit skupiny"},errors:{description:"Prosím opravte následující chyby:",no_area:"Není vybrána žádná zóna",no_modes:"Není vybrán žádný režim, ve kterém má být seznor aktivní",no_auto_bypass_modes:"Není vybrán žádný režim, ve kterém má být senzor automaticky vyřazen"}}},dialogs:{manage_groups:{title:"Spravovat skupiny senzorů",description:"Ve skupině senzorů musí byt aktivováno více senzorů v určitém časovém úseku pro spuštění alarmu.",no_items:"Nejsou žádné skupiny",actions:{new_group:"Nová skupina"}},create_group:{title:"Nová skupina senzorů",fields:{name:{heading:"Název",description:"Název skupiny senzorů"},timeout:{heading:"Časový úsek",description:"Časový úsek ve kterém musí být aktivovány senzory aby byl alarm spuštěn."},event_count:{heading:"Počet",description:"Množství různých senzorů, které je třeba aktivovat ke spuštění poplachu."},sensors:{heading:"Senzory",description:"Vyberte senzory, které mají být v této skupině."}},errors:{invalid_name:"Neplatné jméno.",insufficient_sensors:"Musí být vybrány alespoň 2 senzory."}},edit_group:{title:"Upravit skupinu senzorů ''{name}''"}}},codes:{title:"Kódy",cards:{codes:{description:"Změnit nastavení kódu.",fields:{code_arm_required:{heading:"Použít kód k zajištění",description:"Vyžadovat kód při zajištění alarmu"},code_disarm_required:{heading:"Použít kód k deaktivaci alarmu",description:"Vyžadovat kód pro deaktivaci alarmu"},code_mode_change_required:{heading:"Vyžadovat kód pro přepínání režimu",description:"Pro změnu aktivního režimu aktivace je nutné zadat platný kód."},code_format:{heading:"Formát kódu",description:"Nastaví typ klávesnice pro kartu alarmu v Lovelace.",code_format_number:"Pin",code_format_text:"Heslo"}}},user_management:{title:"Správa uživatelů",description:"Každý uživatel má svůj vlastní kód pro zajištění/deaktivaci alarmu.",no_items:"Neexistují žádní uživatelé",actions:{new_user:"Nový uživatel"}},new_user:{title:"Vytvořit nového uživatele",description:"Uživatelé mohou být vytvořeni pro práci s alarmem.",fields:{name:{heading:"Jméno",description:"Jméno uživatele."},code:{heading:"Kód",description:"Kód uživatele."},confirm_code:{heading:"Ověření kódu",description:"Zopakujte kód."},can_arm:{heading:"Povolit kód pro zajištění",description:"Zadání tohoto kódu zajistí alarm"},can_disarm:{heading:"Povolit kód pro deaktivaci",description:"Zadání tohoto kódu deaktivuje alarm"},is_override_code:{heading:"Je to override kód",description:"Zadání tohoto kódu zajistí alarm i přes otevřené senzory"},area_limit:{heading:"Povolené zóny",description:"Omezení uživatele ovládat pouze vybrané zóny alarmu"}},errors:{no_name:"Není zadáno jméno.",no_code:"Kód by měl mít minimálně 4 znaky.",code_mismatch:"Kódy se neshodují."}},edit_user:{title:"Upravit uživatele",description:"ZMěnit nastavení uživatele ''{name}''.",fields:{old_code:{heading:"Aktuální kód",description:"Aktuální kód, nechte prázdné pokud nechcete měnit."}}}}},actions:{title:"Akce",cards:{notifications:{title:"Notifikace",description:"Tento panel slouží k nastavení notifikací, které mají být odeslány v případě určitých událostí alarmu.",table:{no_items:"Nejsou žádné vytvořené notifikace.",no_area_warning:"Akce není přiřazena k žádné zóně."},actions:{new_notification:"Nová notifikace"}},actions:{description:"Tento panel slouží k nastavení změny zařízení v případě změny stavu alarmu.",table:{no_items:"Nejsou žádné vytvořené akce."},actions:{new_action:"Nová akce"}},new_notification:{title:"Nastavení notifikací",description:"Odeslání notifikace při zajištění/deaktivaci alarmu, při spuštění alarmu, atd.",trigger:"Podmínka",action:"Akce",options:"Možnosti",fields:{event:{heading:"Událost",description:"Kdy by měla být notifikace odeslána",choose:{armed:{name:"Alarm je zajištěný",description:"Zajištění alarmu proběhlo úspěšně"},disarmed:{name:"Alarm je deaktivovaný",description:"Deaktivace alarmu proběhla úspěšně"},triggered:{name:"Alarm je spuštěný",description:"Byl spustěný alarm"},untriggered:{name:"Spuštěný alarm skončil",description:"Skončilo spustění alarmu (například vypršením nastavené doby nebo deaktivací)"},arm_failure:{name:"Zajištění se nepodařilo",description:"Zajištění alarmu se nepodařilo díky jendomu nebo více aktivním senzorům"},arming:{name:"Čas na odchod začal",description:"Začal odpočet času pro odchod."},pending:{name:"Čas na příchod",description:"Začal odpočet času na příchod."}}},mode:{heading:"Režim",description:"Omezit notifikaci na specifický režim alarmu (nepovinné)"},title:{heading:"Nadpis",description:"Nadpis notifikace"},message:{heading:"Zpráva",description:"Obsah zprávy v notifikaci",insert_wildcard:"Vložit proměnnou",placeholders:{armed:"Alarm je nastaven na {{arm_mode}}",disarmed:"Alarm je deaktovovaný",triggered:"Alarm je spuštěný! Příčina: {{open_sensors}}.",untriggered:"Alarm byl ukončen.",arm_failure:"Alarm nemohl být zajištěný v tuto chvíli, kvůli: {{open_sensors}}.",arming:"Probíhá zajištění alarmu, můžete opustit dům.",pending:"Alarm bude brzy spuštěný, rychle ho deaktivujte!"}},open_sensors_format:{heading:"Formát pro open_sensors proměnnou",description:"Vyberte, které informace o senzoru budou do zprávy přidány",options:{default:"Jména a stavy",short:"Pouze jména"}},arm_mode_format:{heading:"Překlad pro arm_mode proměnnou",description:"Vyberte ve kterém jazyce se má do zprávy přidat režim alarmu"},target:{heading:"Přijemce",description:"Na které zařízení má být notifikace odeslána"},media_player_entity:{heading:"Entita přehrávače médií",description:"Přehrávače médií pro přehrání zprávy."},name:{heading:"Jméno",description:"Popis této notifikace",placeholders:{armed:"Upozornit {target} při zajištění",disarmed:"Upozornit {target} při deaktivaci",triggered:"Upozornit {target} při spuštění",untriggered:"Upozornit {target} když se alarm ukončí",arm_failure:"Upozornit {target} při chybě v zajištění",arming:"Upozornit {target} při odchodu",pending:"Upozornit {target} při příchodu"}},delete:{heading:"Odstranit automatizaci",description:"Trvale odstranit tuto automatizaci"}},actions:{test:"Vyzkoušet"}},new_action:{title:"Nastavení akce",description:"Rozsvítit světla, spustit sirénu například při spuštění alarmu.",fields:{event:{heading:"Událost",description:"Kdy by měla být akce provedena"},area:{heading:"Zóna",description:"Pro kterou zónu se má akce provést."},mode:{heading:"Režim",description:"Omezit akci na specifický režim alarmu (nepovinné)"},entity:{heading:"Entita",description:"Na které entitě má být akce provedena"},action:{heading:"Akce",description:"Akce, která má být provedena na entitě",no_common_actions:"Pro vybrané entity může být akce nastavena pouze v YAML."},name:{heading:"Název",description:"Popis této akce",placeholders:{armed:"Nastav {entity} na {state} při zajištění",disarmed:"Nastav {entity} na {state} při deaktivaci",triggered:"Nastav {entity} na {state} při spuštění",untriggered:"Nastav {entity} na {state} když se alarm ukončí",arm_failure:"Nastav {entity} na {state} při chybě v zajištění",arming:"Nastav {entity} na {state} při odchod",pending:"Nastav {entity} na {state} při příchodu"}}}}}}},Qe={common:Ke,components:Ze,title:We,panels:Ye},Je=Object.freeze({__proto__:null,common:Ke,components:Ze,default:Qe,panels:Ye,title:We}),Xe={modes_short:{armed_away:"Ude",armed_home:"Hjemme",armed_night:"Nat",armed_custom_bypass:"Tilpasset",armed_vacation:"Ferie"},enabled:"Aktiveret",disabled:"deaktiveret"},et={time_picker:{seconds:"sekunder",minutes:"minutter"},editor:{ui_mode:"Til UI",yaml_mode:"Til YAML",edit_in_yaml:"Ret i YAML"},table:{filter:{label:"Filtrer genstande",item:"Filtrer efter {name}",hidden_items:"{number} {number, plural,\n one {enhed er}\n  other {enheder er}\n} skjult"}}},tt="Alarm panel",at={general:{title:"Generelt",cards:{general:{description:"Dette panel definerer nogle globale indstillinger for alarmen.",fields:{disarm_after_trigger:{heading:"Frakobling efter alarm",description:"Efter udløsningstid er udløbet, deaktiver alarmen i stedet for at vende tilbage til aktiveret tilstand."},ignore_blocking_sensors_after_trigger:{heading:"Ignorer blokeringssensorer ved genaktivering",description:"Gå tilbage til aktiveret tilstand uden at kontrollere for sensorer, der stadig kan være aktive."},enable_mqtt:{heading:"Aktiver MQTT",description:"Tillad at alarmpanelet blive styret igennem MQTT."},enable_master:{heading:"Aktiver alarmmaster",description:"Opretter en enhed til at kontrollere alle områder samtidigt."}},actions:{setup_mqtt:"MQTT indstillinger",setup_master:"Master indstillinger"}},modes:{title:"Tilstande",description:"Dette panel kan bruges til at indstille alarmens tilkoblingstilstande.",modes:{armed_away:"Tilkobling ude bliver brugt når alle mennesker forlader huset. Alle døre og vinduer der giver adgang til huset vil blive overvåget, samt bevægelsessensorer inde i huset.",armed_home:"Tilkobling hjemme (også kendt som tilkoblet ophold), bliver brugt når alarmen aktiveret når der er mennesker i huset. Alle døre og vinduer der giver adgang til huset vil være overvåget, men ikke bevægelsessensorer inde i huset.",armed_night:"Tilkobling nat vil blive brugt når du aktiveret alarmen før du går i seng. Alle døre og vinduer der giver adgang til huset vil være overvåget og udvalgte bevægelsessensorer i huset.",armed_vacation:"Tilkobling ferie kan bruges som en forlængelse af tilkobet udetilstand i tilfælde af længerevarende fravær. Forsinkelsestider og udløsningstider kan tilpasses (efter ønske) til at være lang tid hjemmefra.",armed_custom_bypass:"En ekstra tilstand til at definere din egen sikkerhedsperimeter."},number_sensors_active:"{number} {number, plural,\n  one {sensor}\n  other {sensorer}\n} aktive",fields:{status:{heading:"Status",description:"Styrer om alarmen kan aktiveres i denne tilstand."},exit_delay:{heading:"Udgangstid",description:"Når alarmen aktiveres, vil sensorerne ikke udløse alarmen inden for denne tidsperiode."},entry_delay:{heading:"Indgangstid",description:"Forsinkelsestid indtil alarmen udløses, efter at en af sensorerne er aktiveret."},trigger_time:{heading:"Sirenetid",description:"Tid hvor sirenen er aktiv efter udløsning."}}},mqtt:{title:"MQTT indstillinger",description:"Dette panel kan bruges til indstilling af MQTT-grænsefladen.",fields:{state_topic:{heading:"Status topic",description:"Topic hvor status sendes til."},event_topic:{heading:"Event topic",description:"Topic hvor alarm events sendes til."},command_topic:{heading:"Kommando topic",description:"Topic som alarmo lytter efter tilkobling/frakobling kommandoer."},require_code:{heading:"Kræv kode",description:"Kræv at koden bliver sendt med kommandoen."},state_payload:{heading:"Indstil last pr tilstand",item:"Definerer en last for tilstanden ''{state}''"},command_payload:{heading:"Indstil last pr kommando",item:"Definerer en last for kommando ''{command}''"}}},areas:{title:"Områder",description:"Områder kan bruges til at opdele dit alarmsystem i flere rum.",no_items:"Der er ikke defineret områder endnu.",table:{remarks:"Kommentarer",summary:"Dette område indeholder {summary_sensors} og {summary_automations}.",summary_sensors:"{number} {number, plural,\n  one {sensor}\n  other {sensorer}\n}",summary_automations:"{number} {number, plural,\n  one {automation}\n  other {automationer}\n}"},actions:{add:"Tilføj"}}},dialogs:{create_area:{title:"Nyt område",fields:{copy_from:"Kopier indstillinger fra"}},edit_area:{title:"Redigerer område ''{area}''",name_warning:"Note: ændring af navnet ændrer også enheds id"},remove_area:{title:"Fjern område?",description:"Er du sikker på at du ønsker at fjerne området? Dette område indeholder {sensors} sensorer og {automations} automationer, hvilket også vil blive fjernet."},edit_master:{title:"Master indstillinger"},disable_master:{title:"Deaktiver master?",description:"Er du sikker på du ønsker at fjerne alarm master? Dette område indeholder {automations} automationer, hvilket vil blive fjernet."}}},sensors:{title:"Sensorer",cards:{sensors:{description:"Aktuelt konfigurerede sensorer. Klik på et element for at foretage ændringer.",table:{no_items:"Der er ingen sensorer der kan vises her.",no_area_warning:"Sensoren er ikke tildelt noget område.",arm_modes:"Tilkoblings tilstande",always_on:"(Altid)"}},add_sensors:{title:"Tilføj Sensorer",description:"Tilføj flere sensorer. Sørg for din sensor har en passende navn, så du senere kan identificere dem.",no_items:"Der er ingen tilgængelige HA-enheder, der kan konfigureres til alarmen. Sørg for at inkludere enheder af typen binary_sensor.",table:{type:"Registreret type"},actions:{add_to_alarm:"Tilføj til alarm",filter_supported:"Gem enheder af ukendt type"}},editor:{title:"Rediger Sensor",description:"Konfigurer sensor indstillinger for ''{entity}''.",fields:{entity:{heading:"Entitet",description:"Entitet tilknyttet denne sensor"},area:{heading:"Område",description:"Vælg det område som indeholder denne sensor."},group:{heading:"Gruppe",description:"Gruppe med andre sensorer for kombineret udløsning."},device_type:{heading:"enheds type",description:"Vælg enheds typen for automatisk at tilføje de korrekte indstillinger.",choose:{door:{name:"Dør",description:"En dør, åbning eller anden indgang der bruges til at komme ind/ud af huset."},window:{name:"Vindue",description:"Et vindue, eller en dør som ikke bruges til at komme ind/ud af huset (f.eks. en balkon/altan)."},motion:{name:"Bevægelsessensor",description:"Tilstedeværelses sensorer eller lignende enheder som har en forsinkelse imellem aktiveringer."},tamper:{name:"Tamper",description:"Detektor for fjernelse af sensordæksel, glasbrudssensor mv."},environmental:{name:"Miljømæssige",description:"Røg-/gassensor, lækagedetektor osv. (ikke relateret til tyverisikring)."},other:{name:"Generisk"}}},always_on:{heading:"Altid til",description:"Sensor skal altid udløse alarmen."},modes:{heading:"Aktiveret tilstande",description:"Alarmtilstande hvor denne sensor er aktiv."},arm_on_close:{heading:"Tilkoble efter lukning",description:"Efter deaktivering af denne sensor, springes den resterende udgangstid automatisk over."},use_exit_delay:{heading:"Brug udgangstid",description:"Sensorer må være aktiv når udgangstid starter."},use_entry_delay:{heading:"Brug indgangstid",description:"Sensor aktivering udløser alarmen efter indgangstiden i stedet for med det samme."},entry_delay:{heading:"Indgangstid",description:"Tilsidesæt forsinkelsen (som konfigureret for aktiveringstilstand) med en specifik værdi."},delay_on:{heading:"Delay on",description:"Sensor must remain active for this duration before triggering. Resets if sensor deactivates."},allow_open:{heading:"Tillad åbning efter tilkobling",description:"Oprindelige tilstand på sensoren ignoreres ved tilkobling."},auto_bypass:{heading:"Omgå automatisk",description:"Udeluk denne sensor fra alarmen, hvis den er åben under aktivering.",modes:"Tilstande hvor sensoren kan omgås"},trigger_unavailable:{heading:"Udløs når den ikke er tilgængelig",description:"Når sensortilstanden bliver 'utilgængelig', vil dette aktivere sensoren."}},actions:{toggle_advanced:"Avancerede indstillinger",remove:"Fjern",setup_groups:"Opsæt grupper"},errors:{description:"Ret venligst følgende fejl:",no_area:"Intet område er valgt",no_modes:"Der er ikke valgt tilstande, som sensoren skal være aktiv for",no_auto_bypass_modes:"Ingen tilstande er valgt for sensoren som automatisk kan omgås"}}},dialogs:{manage_groups:{title:"Administrer sensorgrupper",description:"I en sensorgruppe skal flere sensorer aktiveres inden for et tidsrum, før alarmen udløses.",no_items:"Ingen gruppe endnu",actions:{new_group:"Ny gruppe"}},create_group:{title:"Ny sensorgruppe",fields:{name:{heading:"Navn",description:"Sensorgruppe navn"},timeout:{heading:"Tiden er gået",description:"Tidsperioden i hvilken på hinanden følgende sensoraktiveringer udløser alarmen."},event_count:{heading:"Tælle",description:"Antal forskellige sensorer, der skal aktiveres for at udløse alarmen."},sensors:{heading:"Sensorer",description:"Vælg de sensorer, som denne gruppe indeholder."}},errors:{invalid_name:"Ugyldigt navn angivet.",insufficient_sensors:"Der skal vælges mindst 2 sensorer."}},edit_group:{title:"Rediger sensorgruppe ''{name}''"}}},codes:{title:"Koder",cards:{codes:{description:"Skift indstillinger for koden.",fields:{code_arm_required:{heading:"Brug kode ved tilkobling",description:"Kræv kode for at tilkoble alarmen"},code_disarm_required:{heading:"Brug kode ved frakobling",description:"Kræv kode for at frakoble alarmen"},code_mode_change_required:{heading:"Kræv kode for at skifte tilstand",description:"En gyldig kode skal angives for at ændre aktiveringstilstanden."},code_format:{heading:"Kode format",description:"Indstil input typen for lovelace alarm kortet.",code_format_number:"Pinkode",code_format_text:"Kodeord"}}},user_management:{title:"Brugeradministration",description:"Hver bruger har sin egen kode til at til/fra-koble alarmen.",no_items:"Der er ingen brugere endnu",actions:{new_user:"Ny bruger"}},new_user:{title:"Opret ny bruger",description:"Brugere kan oprettes for at give adgang til at styre alarmen.",fields:{name:{heading:"Navn",description:"Brugeren navn."},code:{heading:"Kode",description:"Kode til denne bruger."},confirm_code:{heading:"Bekræft kode",description:"Gentag koden."},can_arm:{heading:"Tillad at bruge til tilkobling",description:"Indtastning af koden tilkobler alarmen"},can_disarm:{heading:"Tillad kode for frakobling",description:"Indtastning af koden frakobler alarmen"},is_override_code:{heading:"Overstyringskode",description:"Indtastning af denne kode vil tilkoble alarmen uanset tilstande"},area_limit:{heading:"Begrænset område",description:"Begræns brugeren til kun at styre det valgte område"}},errors:{no_name:"Ingen navn givet.",no_code:"Koden skal være på mindst 4 karakterer/numre.",code_mismatch:"Koderne er ikke ens."}},edit_user:{title:"Rediger bruger",description:"Ændre indstillinger for brugeren ''{name}''.",fields:{old_code:{heading:"Nuværende kode",description:"Nuværende kode, lad være tomt hvis uændret."}}}}},actions:{title:"Handlinger",cards:{notifications:{title:"Meddelelser",description:"Ved hjælp af dette panel kan du administrere meddelelser, der skal sendes når en bestemt alarmhændelse opstår.",table:{no_items:"Der er ingen meddelelser oprettet endnu.",no_area_warning:"Handlingen er ikke tildelt noget område."},actions:{new_notification:"Ny meddelelse"}},actions:{description:"Dette panel kan bruges til at ændre en enhed, når alarmtilstanden ændres.",table:{no_items:"Der er ingen handlinger oprettet endnu."},actions:{new_action:"Ny handling"}},new_notification:{title:"Konfigurer meddelelse",description:"Modtag en besked ved til-/frakobling af alarmen, ved aktivering osv.",trigger:"Betingelse",action:"Opgave",options:"Valgmuligheder",fields:{event:{heading:"Event",description:"Hvornår skal meddelelsen sendes",choose:{armed:{name:"Alarm aktiveret",description:"Alarmen er aktiveret med succes"},disarmed:{name:"Alarm frakoblet",description:"Alarmen er frakoblet"},triggered:{name:"Alarm udløst",description:"Alarmen er blevet udløst"},untriggered:{name:"Alarm ikke længere udløst",description:"Udløst tilstanden på alarmen er slut"},arm_failure:{name:"Kunne ikke tilkoble",description:"Alarmen kunne ikke tilkobles pga en eller flere åbne sensorer"},arming:{name:"Udgangstid startet",description:"Udgangstiden tæller ned, klar til at forlade huset."},pending:{name:"Indgangstid startet",description:"Indgangstiden tæller ned, alarmen udløses snart."}}},mode:{heading:"Tilstand",description:"Begræns handlingen til specifikke til/fra-koblings tilstande (valgfrit)"},title:{heading:"Titel",description:"Titel for en meddelelse"},message:{heading:"Meddelelse",description:"Indhold på meddelelse",insert_wildcard:"Indsæt wildcard",placeholders:{armed:"Alarmen er nu {{arm_mode}}",disarmed:"Alarmen er nu frakoblet",triggered:"Alarmen er udløst! Årsag: {{open_sensors}}.",untriggered:"Alarmen er ikke længere udløst.",arm_failure:"Alarmen kan ikke tilkobles lige nu pga: {{open_sensors}}.",arming:"Alarmen til blive tilkoblet snart, venligst forlad huset.",pending:"Alarmen udløses snart, vær hurtig til at frakoble!"}},open_sensors_format:{heading:"Format for open_sensors wildcard",description:"Vælg hvilken sensorinformation der skal indsættes i meddelelsen",options:{default:"Navne og tilstande",short:"Kun navne"}},arm_mode_format:{heading:"Oversættelse for arm_mode wildcard",description:"Vælg på hvilket sprog tilkoblingstilstanden indsættes i beskeden"},target:{heading:"Target",description:"Enhed meddelelsen sendes til"},media_player_entity:{heading:"Medieafspillerenhed",description:"Medieafspiller til at afspille beskeden på"},name:{heading:"Navn",description:"Beskrivelse af denne meddelelse",placeholders:{armed:"Underret {target} ved tilkobling",disarmed:"Underret {target} ved frakobling",triggered:"Underret {target} når udløst",untriggered:"Underret {target} når udløst tilstant stoppes",arm_failure:"Underret {target} ved fejl",arming:"Underret {target} når tilkobling er i gang",pending:"Underret {target} når frakobling er i gang"}},delete:{heading:"Slet automatisering",description:"Fjern automatiseringen permanent"}},actions:{test:"Prøv det"}},new_action:{title:"Konfigurer handling",description:"Skift lys eller anden enhed (såsom sirener) ved til-/frakobling af alarmen, ved aktivering osv.",fields:{event:{heading:"Event",description:"Hvornår skal handlingen udføres"},area:{heading:"Område",description:"Område som hændelsen gælder for."},mode:{heading:"Tilstand",description:"Begræns handlingen til specifikke tilkonlingstilstande (valgfrit)"},entity:{heading:"Enhed",description:"Enhed handlingen udføres på"},action:{heading:"Handling",description:"Handling som skal udføres på enhed",no_common_actions:"Handlinger kan kun tildeles i YAML-tilstand for de valgte enheder."},name:{heading:"Navn",description:"Beskrivelse for denne handling",placeholders:{armed:"Sæt {entity} til {state} ved tilkobling",disarmed:"Sæt {entity} til {state} ved frakobling",triggered:"Sæt {entity} til {state} når alarm udløses",untriggered:"Sæt {entity} til {state} når udløst alarm stopper",arm_failure:"Sæt {entity} til {state} ved fejl",arming:"Sæt {entity} til {state} når tilkobling er i gang",pending:"Sæt {entity} til {state} når frakobling er i gang"}}}}}}},it={common:Xe,components:et,title:tt,panels:at},st=Object.freeze({__proto__:null,common:Xe,components:et,default:it,panels:at,title:tt}),nt={modes_short:{armed_away:"Abwesend",armed_home:"Zuhause",armed_night:"Nacht",armed_custom_bypass:"Benutzerdefiniert",armed_vacation:"Urlaub"},enabled:"Aktiviert",disabled:"Deaktiviert"},rt={time_picker:{seconds:"Sekunden",minutes:"Minuten"},editor:{ui_mode:"Zu UI",yaml_mode:"Zu YAML",edit_in_yaml:"In YAML bearbeiten"},table:{filter:{label:"Elemente filtern",item:"Filtern nach {name}",hidden_items:"{number} {number, plural,\n  one {item is}\n other {items are}\n} versteckt"}}},ot="Alarm Panel",dt={general:{title:"Allgemein",cards:{general:{description:"Dieses Panel legt globale Einstellungen für den Alarm fest.",fields:{disarm_after_trigger:{heading:"Entschärfen nach Auslösung",description:"Nach Ablauf der Auslösezeit wird der Alarm entschärft, anstatt in den scharfen Zustand zurückzukehren."},ignore_blocking_sensors_after_trigger:{heading:"Blockierende Sensoren beim erneuten Scharfschalten ignorieren",description:"Kehren Sie in den scharfgeschalteten Zustand zurück, ohne zu prüfen, ob die Sensoren noch aktiv sind."},enable_mqtt:{heading:"MQTT aktivieren",description:"Erlaubt die Steuerung der Alarmzentrale über MQTT."},enable_master:{heading:"Alarm-Master aktivieren",description:"Erzeugt eine Entität zur gleichzeitigen Kontrolle aller Bereiche."}},actions:{setup_mqtt:"MQTT Konfiguration",setup_master:"Master Konfiguration"}},modes:{title:"Modi",description:"Mit diesem Panel können die Scharfschaltmodi des Alarms eingestellt werden.",modes:{armed_away:"Abwesend wird verwendet, wenn alle Personen das Haus verlassen haben. Alle Türen und Fenster, die den Zugang zum Haus ermöglichen, werden bewacht, ebenso wie die Bewegungsmelder im Haus.",armed_home:"Zuhause wird verwendet, wenn der Alarm ausgelöst wird, während sich Personen im Haus befinden. Alle Türen und Fenster, die den Zugang zum Haus ermöglichen, werden bewacht, aber nicht die Bewegungsmelder im Haus.",armed_night:"Nacht wird verwendet, wenn der Alarm vor dem Schlafengehen eingestellt wird. Alle Türen und Fenster, die den Zugang zum Haus ermöglichen, werden überwacht, und ausgewählte Bewegungssensoren (im Erdgeschoss) im Haus.",armed_vacation:"Urlaub kann als Erweiterung von Abwesend bei längerer Abwesenheit verwendet werden. Die Verzögerungszeiten und Auslösereaktionen können (wie gewünscht) an die Abwesenheit angepasst werden.",armed_custom_bypass:"Individuell: ein zusätzlicher Modus, um Ihren eigenen Sicherheitsbereich zu definieren."},number_sensors_active:"{number} {number, plural,\n one {Sensor}\n other {Sensoren}\n} aktiv",fields:{status:{heading:"Status",description:"Steuert, ob der Alarm in diesem Modus aktiviert werden kann."},exit_delay:{heading:"Aktivierungsverzögerung",description:"Beim Scharfschalten des Alarms lösen die Sensoren innerhalb dieser Zeitspanne noch nicht den Alarm aus."},entry_delay:{heading:"Auslöseverzögerung",description:"Verzögerungszeit bis zur Auslösung des Alarms, nachdem einer der Sensoren aktiviert wurde."},trigger_time:{heading:"Auslösezeit",description:"Zeit, in der der Alarm nach der Aktivierung im ausgelösten Zustand bleibt."}}},mqtt:{title:"MQTT Konfiguration",description:"Dieses Panel kann für die Konfiguration der MQTT-Schnittstelle verwendet werden.",fields:{state_topic:{heading:"Status-Topic",description:"Topic, unter dem Statusaktualisierungen veröffentlicht werden"},event_topic:{heading:"Ereignis-Topic",description:"Topic, unter dem Alarmereignisse veröffentlicht werden"},command_topic:{heading:"Kommando-Topic",description:"Topic, auf das Alarmo bei Scharf-/Unscharfschaltbefehlen hört"},require_code:{heading:"Code notwendig",description:"Code muss mit dem Befehl gesendet werden"},state_payload:{heading:"Konfiguriere Payload pro Zustand",item:"Definiere Payload für den Zustand ''{state}''"},command_payload:{heading:"Konfiguriere Payload pro Kommando",item:"Definiere Payload für das Kommando ''{command}''"}}},areas:{title:"Bereiche",description:"Bereiche können verwendet werden, um Ihr Alarmsystem zu unterteilen.",no_items:"Es sind noch keine Bereiche definiert.",table:{remarks:"Bemerkungen",summary:"Dieser Bereich enthält {summary_sensors} und {summary_automations}.",summary_sensors:"{number} {number, plural,\n  one {Sensor}\n  other {Sensoren}\n}",summary_automations:"{number} {number, plural,\n  one {Aktion}\n  other {Aktionen}\n}"},actions:{add:"Hinzufügen"}}},dialogs:{create_area:{title:"Neuer Bereich",fields:{copy_from:"Einstellungen kopieren von"}},edit_area:{title:"Bereich  ''{area}'' bearbeiten",name_warning:"Hinweis: Das Ändern des Namens ändert die Entity-ID!"},remove_area:{title:"Bereich entfernen?",description:"Sind Sie sicher, dass Sie diesen Bereich entfernen möchten? Dieser Bereich enthält {sensors} Sensoren und {automations} Aktionen, die ebenfalls entfernt werden."},edit_master:{title:"Master-Konfiguration"},disable_master:{title:"Master deaktivieren?",description:"Sind Sie sicher, dass Sie den Alarmmaster entfernen möchten? Dieser Bereich enthält {automations} Aktionen, die ebenfalls entfernt werden."}}},sensors:{title:"Sensoren",cards:{sensors:{description:"Derzeit konfigurierte Sensoren. Klicken Sie auf ein Element, um Änderungen vorzunehmen.",table:{no_items:"Hier gibt es keine Sensoren, die angezeigt werden sollen.",no_area_warning:"Der Sensor ist keinem Bereich zugeordnet.",arm_modes:"Aktivierungsmodi",always_on:"(Immer)"}},add_sensors:{title:"Sensoren hinzufügen",description:"Fügen Sie weitere Sensoren hinzu. Achten Sie darauf, dass Ihre Sensoren einen passenden Namen haben, damit Sie sie identifizieren können.",no_items:"Es gibt keine verfügbaren HA-Entitäten, die für den Alarm konfiguriert werden können. Stellen Sie sicher, dass Sie Entitäten des Typs binary_sensor einschließen.",table:{type:"Erkannter Typ"},actions:{add_to_alarm:"Zum Alarm hinzufügen",filter_supported:"Elemente mit unbekanntem Typ ausblenden"}},editor:{title:"Sensor bearbeiten",description:"Konfigurieren der Sensoreinstellungen von ''{entity}''.",fields:{entity:{heading:"Entität",description:"Entität, die diesem Sensor zugeordnet ist"},area:{heading:"Bereich",description:"Wählen Sie einen Bereich, der diesen Sensor enthält."},group:{heading:"Gruppieren",description:"Mit anderen Sensoren gruppieren für kombinierte Auslösung."},device_type:{heading:"Gerätetyp",description:"Wählen Sie einen Gerätetyp, um die entsprechenden Einstellungen automatisch anzuwenden.",choose:{door:{name:"Tür",description:"Eine Tür, ein Tor oder ein anderer Eingang, die/das/der zum Betreten/Verlassen der Wohnung verwendet wird."},window:{name:"Fenster",description:"Ein Fenster oder eine Tür, das/die nicht zum Betreten des Hauses verwendet wird, z. B. ein Balkon."},motion:{name:"Bewegung",description:"Anwesenheitssensor oder ähnliches Gerät mit einer Verzögerung zwischen den Aktivierungen."},tamper:{name:"Sabotagekontakt",description:"Detektor für das Entfernen der Sensorabdeckung, Glasbruchsensor usw."},environmental:{name:"Umwelt",description:"Rauch-/Gassensor, Leckdetektor usw. (nicht im Zusammenhang mit Einbruchschutz)."},other:{name:"Allgemein"}}},always_on:{heading:"Immer aktiv",description:"Der Sensor soll immer den Alarm auslösen."},modes:{heading:"Aktivierte Modi",description:"Alarmmodi, in denen dieser Sensor aktiv ist."},arm_on_close:{heading:"Scharfschalten nach Schließen",description:"Nach der Deaktivierung dieses Sensors wird die verbleibende Ausgangsverzögerung automatisch übersprungen."},use_exit_delay:{heading:"Aktivierungsverzögerung verwenden",description:"Der Sensor darf aktiv sein, wenn die Aktivierungsverzögerung beginnt."},use_entry_delay:{heading:"Auslöseverzögerung verwenden",description:"Die Sensoraktivierung löst den Alarm nach der Auslöseverzögerung aus und nicht direkt."},entry_delay:{heading:"Auslöseverzögerung",description:"Ersetzt die Verzögerung (wie für den Scharfschaltmodus konfiguriert) durch einen spezifischer Wert."},delay_on:{heading:"Delay on",description:"Sensor must remain active for this duration before triggering. Resets if sensor deactivates."},allow_open:{heading:"Offen bei Scharfschaltung zulassen",description:"Der Zustand OFFEN während der Scharfschaltung wird ignoriert (eine nachfolgende Sensoraktivierung löst den Alarm aus)."},auto_bypass:{heading:"Automatische Umgehung",description:"Diesen Sensor vom Alarm ausschließen, wenn er während des Scharfschaltens offen ist.",modes:"Modi, in denen der Sensor umgangen werden kann"},trigger_unavailable:{heading:"Auslösen, wenn nicht verfügbar",description:"Wenn der Sensorstatus 'nicht verfügbar' wird, wird der Sensor aktiviert."}},actions:{toggle_advanced:"Erweiterte Einstellungen",remove:"Entfernen",setup_groups:"Gruppen einrichten"},errors:{description:"Bitte korrigieren Sie die folgenden Fehler:",no_area:"Es ist kein Bereich ausgewählt",no_modes:"Es sind keine Modi ausgewählt, für die der Sensor aktiv sein sollte",no_auto_bypass_modes:"Es sind keine Modi ausgewählt, für die der Sensor automatisch umgangen werden kann"}}},dialogs:{manage_groups:{title:"Sensorgruppen verwalten",description:"In einer Sensorgruppe müssen mehrere Sensoren innerhalb eines Zeitraums aktiviert werden, bevor der Alarm ausgelöst wird.",no_items:"Noch keine Gruppen",actions:{new_group:"Neue Gruppe"}},create_group:{title:"Neue Sensorgruppe",fields:{name:{heading:"Name",description:"Name der Sensorgruppe"},timeout:{heading:"Time-out",description:"Zeitspanne, in der aufeinanderfolgende Sensoraktivierungen den Alarm auslösen."},event_count:{heading:"Menge",description:"Anzahl verschiedener Sensoren, die aktiviert werden müssen, um den Alarm auszulösen."},sensors:{heading:"Sensoren",description:"Wählen Sie die Sensoren aus, die in dieser Gruppe enthalten sind."}},errors:{invalid_name:"Ungültiger Name angegeben.",insufficient_sensors:"Es müssen mindestens 2 Sensoren ausgewählt werden."}},edit_group:{title:"Sensorgruppe ''{name}'' bearbeiten"}}},codes:{title:"Codes",cards:{codes:{description:"Einstellungen für den Code ändern.",fields:{code_arm_required:{heading:"Scharfschalt-Code verwenden",description:"Scharfschaltung erfordert einen Code"},code_disarm_required:{heading:"Entschärfungscode verwenden",description:"Unscharfschaltung erfordert einen Code"},code_mode_change_required:{heading:"Code verwenden zum Umschalten des Modus",description:"Um den aktiven Scharfschaltmodus zu ändern, ist ein gültiger Code erforderlich."},code_format:{heading:"Code-Format",description:"Legt den Eingabetyp für die Lovelace-Alarmkarte fest.",code_format_number:"Pincode",code_format_text:"Passwort"}}},user_management:{title:"Benutzerverwaltung",description:"Jeder Benutzer hat seinen eigenen Code zum Scharf-/Unscharfschalten des Alarms.",no_items:"Es sind noch keine Benutzer vorhanden",actions:{new_user:"Neuer Benutzer"}},new_user:{title:"Neuen Benutzer anlegen",description:"Es können Benutzer angelegt werden, die Zugriff auf die Bedienung des Alarms haben.",fields:{name:{heading:"Name",description:"Name des Benutzers."},code:{heading:"Code",description:"Code für diesen Benutzer."},confirm_code:{heading:"Code wiederholen",description:"Geben Sie den Code erneut ein."},can_arm:{heading:"Code für Scharfschaltung zulassen",description:"Durch Eingabe dieses Codes wird der Alarm aktiviert"},can_disarm:{heading:"Code zur Entschärfung zulassen",description:"Durch Eingabe dieses Codes wird der Alarm deaktiviert"},is_override_code:{heading:"Ist Übersteuerungs-Code",description:"Die Eingabe dieses Codes schaltet den Alarm zwangsweise scharf"},area_limit:{heading:"Eingeschränkte Bereiche",description:"Beschränkung der Kontrolle des Benutzers auf die ausgewählten Bereiche"}},errors:{no_name:"Kein Name angegeben.",no_code:"Der Code sollte mindestens 4 Zeichen/Zahlen enthalten.",code_mismatch:"Die Codes stimmen nicht überein."}},edit_user:{title:"Nutzer bearbeiten",description:"Ändere die Konfiguration für den Nutzer ''{name}''.",fields:{old_code:{heading:"Aktueller Code",description:"Aktueller Code (leer lassen, um Code nicht zu ändern)."}}}}},actions:{title:"Aktionen",cards:{notifications:{title:"Benachrichtigungen",description:"Mit diesem Panel können Sie Benachrichtigungen verwalten, die beim Auftreten eines bestimmten Alarmereignisses gesendet werden.",table:{no_items:"Es sind noch keine Benachrichtigungen erstellt worden.",no_area_warning:"Die Aktion ist keinem Bereich zugeordnet."},actions:{new_notification:"Neue Benachrichtigung"}},actions:{description:"Dieses Panel kann verwendet werden, um ein Gerät zu schalten, wenn sich der Alarmzustand ändert.",table:{no_items:"Es sind noch keine Aktionen erstellt worden."},actions:{new_action:"Neue Aktion"}},new_notification:{title:"Benachrichtigung konfigurieren",description:"Erhalten Sie eine Benachrichtigung beim Scharf-/Unscharfschalten des Alarms, bei Aktivierung usw.",trigger:"Bedingung",action:"Aktion",options:"Optionen",fields:{event:{heading:"Ereignis",description:"Wann soll die Benachrichtigung gesendet werden",choose:{armed:{name:"Alarm ist scharf",description:"Der Alarm wurde erfolgreich scharfgeschaltet"},disarmed:{name:"Alarm ist unscharf",description:"Der Alarm wurde unscharf"},triggered:{name:"Alarm ist ausgelöst",description:"Der Alarm wurde ausgelöst"},untriggered:{name:"Alarm ist nicht mehr ausgelöst",description:"Der ausgelöste Zustand des Alarms ist beendet"},arm_failure:{name:"Scharfschaltung fehlgeschlagen",description:"Die Scharfschaltung des Alarms ist aufgrund eines oder mehrerer offener Sensoren fehlgeschlagen"},arming:{name:"Aktivierungsverzögerung gestartet",description:"Aktivierungsverzögerung ist gestartet, bereit, das Haus zu verlassen."},pending:{name:"Auslöseverzögerung gestartet",description:"Auslöseverzögerung ist gestartet, der Alarm wird bald ausgelöst."}}},mode:{heading:"Modus",description:"Beschränkung der Aktion auf bestimmte Alarm-Modi (optional)"},title:{heading:"Titel",description:"Titel für die Benachrichtigungsmeldung"},message:{heading:"Nachricht",description:"Inhalt der Benachrichtigungsmeldung",insert_wildcard:"Platzhalter einfügen",placeholders:{armed:"Der Alarm ist auf {{arm_mode}} eingestellt",disarmed:"Der Alarm ist jetzt AUS",triggered:"Der Alarm wurde ausgelöst! Ursache: {{open_sensors}}.",untriggered:"Der Alarm ist nicht mehr ausgelöst.",arm_failure:"Der Alarm konnte im Moment nicht scharfgeschaltet werden, aufgrund von: {{open_sensors}}.",arming:"Der Alarm wird bald scharf geschaltet, bitte verlassen Sie das Haus.",pending:"Der Alarm wird in Kürze ausgelöst, bitte entschärfen Sie ihn schnell!"}},open_sensors_format:{heading:"Format für open_sensors Platzhalter",description:"Wählen Sie, welche Sensorinformationen in die Nachricht eingefügt werden",options:{default:"Namen und Zustände",short:"Nur Namen"}},arm_mode_format:{heading:"Übersetzung für arm_mode Platzhalter",description:"Wählen Sie, in welcher Sprache der Scharfschaltungsmodus in die Nachricht eingefügt wird"},target:{heading:"Ziel",description:"Gerät, an das die Benachrichtigung gesendet werden soll"},media_player_entity:{heading:"Mediaplayer-Entität",description:"Mediaplayer zum Abspielen der Nachricht."},name:{heading:"Name",description:"Beschreibung für diese Meldung",placeholders:{armed:"Benachrichtigt {target} beim Scharfschalten",disarmed:"Benachrichtigt {target} beim Entschärfen",triggered:"Benachrichtigt {target} bei Auslösung",untriggered:"Benachrichtigt {target}, wenn Auslösung beendet",arm_failure:"Benachrichtigt {target}, wenn Scharfschaltung nicht möglich",arming:"Benachrichtigt {target} bei Beginn Aktivierungsverzögerung",pending:"Benachrichtigt {target} bei Beginn Auslöseverzögerung"}},delete:{heading:"Automatisierung löschen",description:"Diese Automatisierung dauerhaft entfernen"}},actions:{test:"Testen"}},new_action:{title:"Aktion konfigurieren",description:"Schaltet Lichter oder Geräte (z. B. Sirenen) beim Scharf-/Unscharfschalten des Alarms, bei Aktivierung usw.",fields:{event:{heading:"Ereignis",description:"Wann soll die Aktion ausgeführt werden"},area:{heading:"Bereich",description:"Bereich, für den das Ereignis gilt."},mode:{heading:"Modus",description:"Beschränkung der Aktion auf bestimmte Alarm-Modi (optional)"},entity:{heading:"Entität",description:"Entität, für die eine Aktion durchgeführt werden soll"},action:{heading:"Aktion",description:"Aktion, die mit der Entität durchgeführt werden soll",no_common_actions:"Aktionen können nur im YAML-Modus für die ausgewählten Entitäten zugewiesen werden."},name:{heading:"Name",description:"Beschreibung für diese Aktion",placeholders:{armed:"Setzt {entity} beim Scharfschalten auf {state}",disarmed:"Setzt {entity} bei Entschärfung auf {state}",triggered:"Setzt {entity} bei Auslösung auf {state}",untriggered:"Setzt {entity} auf {state}, wenn die Auslösung endet",arm_failure:"Setzt {entity} im Fehlerfall auf {state}",arming:"Setzt {entity} bei Beginn Aktivierungsverzögerung auf {state}",pending:"Setzt {entity} bei Beginn Auslöseverzögerung auf {state}"}}}}}}},lt={common:nt,components:rt,title:ot,panels:dt},ct=Object.freeze({__proto__:null,common:nt,components:rt,default:lt,panels:dt,title:ot}),ht={modes_short:{armed_away:"Away",armed_home:"Home",armed_night:"Night",armed_custom_bypass:"Custom",armed_vacation:"Vacation"},enabled:"Enabled",disabled:"Disabled"},pt={time_picker:{seconds:"seconds",minutes:"minutes"},editor:{ui_mode:"To UI",yaml_mode:"To YAML",edit_in_yaml:"Edit in YAML"},table:{filter:{label:"Filter items",item:"Filter by {name}",hidden_items:"{number} {number, plural,\n  one {item is}\n  other {items are}\n} hidden"}}},mt="Alarm panel",ut={general:{title:"General",cards:{general:{description:"This panel defines some global settings for the alarm.",fields:{disarm_after_trigger:{heading:"Disarm after triggering",description:"Automatically disarm the alarm rather than returning to the armed state."},ignore_blocking_sensors_after_trigger:{heading:"Ignore blocking zones when re-arming",description:"Return to armed state without checking for zones that may still be active."},enable_mqtt:{heading:"Enable MQTT",description:"Allow the alarm panel to be controlled through MQTT."},enable_master:{heading:"Enable 'All partitions' panel",description:"Creates an alarm entity for controlling all partitions simultaneously."}},actions:{setup_mqtt:"MQTT Configuration",setup_master:"'All partitions' configuration"}},modes:{title:"Alarmo Arm Modes",description:"Alarmo's arm modes (Away, Home/Stay, Night, Vacation, Custom): which ones each Alarmo partition offers, and Alarmo's exit and entry delays for each. With a physical panel, its own delays still apply to its own zones.",modes:{armed_away:"Armed away will be used when all people left the house. All doors and windows allowing access to the house will be guarded, as well as motion zones inside the house.",armed_home:"Armed home (also known as armed stay) will be used when setting the alarm while people are in the house. All doors and windows allowing access to the house will be guarded, but not motion zones inside the house.",armed_night:"Armed night will be used when setting the alarm before going to sleep. All doors and windows allowing access to the house will be guarded, and selected motion zones (downstairs) in the house.",armed_vacation:"Armed vacation can be used as an extension to the armed away mode in case of absence for longer duration. The delay times and trigger responses can be adapted (as desired) to being distant from home.",armed_custom_bypass:"An extra mode for defining your own security perimeter."},number_sensors_active:"{number} {number, plural,\n  one {zone}\n  other {zones}\n} active",fields:{status:{heading:"Status",description:"Controls whether the alarm can be armed in this mode."},exit_delay:{heading:"Exit delay",description:"When arming the alarm, within this time period the zones will not trigger the alarm yet."},entry_delay:{heading:"Entry delay",description:"Delay time until the alarm is triggered after one of the zones is activated."},trigger_time:{heading:"Trigger time",description:"Time during which the alarm will remain in the triggered state after activation."}}},mqtt:{title:"MQTT configuration",description:"This panel can be used for configuration of the MQTT interface.",fields:{state_topic:{heading:"State topic",description:"Topic on which state updates are published"},event_topic:{heading:"Event topic",description:"Topic on which alarm events are published"},command_topic:{heading:"Command topic",description:"Topic which Alarmo listens to for arm/disarm commands."},require_code:{heading:"Require code",description:"Require the code to be sent with the command."},state_payload:{heading:"Configure payload per state",item:"Define a payload for state ''{state}''"},command_payload:{heading:"Configure payload per command",item:"Define a payload for command ''{command}''"}}},areas:{title:"Partitions",description:"Partitions divide the alarm system into parts that are armed separately (for example a detached garage). Each has its own alarm entity, alarm_control_panel.<partition name>; most homes need one.",no_items:"There are no partitions defined yet.",table:{remarks:"Remarks",summary:"This partition contains {summary_sensors}, {summary_automations}.",summary_sensors:"{number} {number, plural,\n  one {zone}\n  other {zones}\n}",summary_automations:"{number} {number, plural,\n  one {automation}\n  other {automations}\n}"},actions:{add:"Add"}}},dialogs:{create_area:{title:"New partition",fields:{copy_from:"Copy settings from"}},edit_area:{title:"Editing partition ''{area}''",name_warning:"Note: changing the name will change the entity ID"},remove_area:{title:"Remove partition?",description:"Are you sure you want to remove this partition? This partition contains {sensors} zones and {automations} automations, which will be removed as well."},edit_master:{title:"'All partitions' configuration"},disable_master:{title:"Disable 'All partitions'?",description:"Are you sure you want to remove the 'All partitions' alarm entity? It has {automations} automations, which will be removed with this action."}}},sensors:{title:"Zones",cards:{sensors:{description:"Currently configured zones. Click on an item to make changes.",table:{no_items:"There are no zones to be displayed here.",no_area_warning:"Zone is not assigned to any partition.",arm_modes:"Arm Modes",always_on:"(Always)"}},add_sensors:{title:"Add Zones",description:"Add more zones. Make sure that your zones have a suitable name, so you can identify them.",no_items:"There are no available HA entities that can be configured for the alarm. Make sure to include entities of the type binary_sensor.",table:{type:"Detected type"},actions:{add_to_alarm:"Add to alarm",filter_supported:"Hide items with unknown type"}},editor:{title:"Edit Zone",description:"Configuring the zone settings of ''{entity}''.",fields:{entity:{heading:"Entity",description:"Entity associated with this zone"},area:{heading:"Partition",description:"Select the partition which contains this zone."},group:{heading:"Cross-zone group",description:"Cross-zone with other zones: several must trigger before the alarm does."},device_type:{heading:"Zone type",description:"Choose a zone type to automatically apply appropriate settings.",choose:{door:{name:"Door",description:"A door, gate or other entrance that is used for entering/leaving the home."},window:{name:"Window",description:"A window, or a door not used for entering the house such as balcony."},motion:{name:"Motion",description:"Presence sensor or similar device having a delay between activations."},tamper:{name:"Tamper",description:"Detector of sensor cover removal, glass break sensor, etc."},environmental:{name:"Environmental",description:"Smoke/gas sensor, leak detector, etc. (not related to burglar protection)."},other:{name:"Generic"}}},always_on:{heading:"Always on",description:"Zone should always trigger the alarm."},modes:{heading:"Arm Modes",description:"Arm modes in which this zone is active."},arm_on_close:{heading:"Arm after closing",description:"After deactivation of this zone, the remaining exit delay will automatically be skipped."},use_exit_delay:{heading:"Use exit delay",description:"Zone is allowed to be active when the exit delay starts."},use_entry_delay:{heading:"Use entry delay",description:"Zone activation triggers the alarm after the entry delay rather than directly."},entry_delay:{heading:"Entry delay",description:"Override the entry delay (as configured for the arm mode) with a delay specific to the zone."},delay_on:{heading:"Delay on",description:"Zone must remain active for this duration before triggering. Resets if zone deactivates."},allow_open:{heading:"Allow open initially",description:"Open state while arming is ignored (subsequent zone activation will trigger alarm)."},auto_bypass:{heading:"Bypass automatically",description:"Exclude this zone from the alarm if it is open while arming.",modes:"Modes in which the zone may be bypassed"},trigger_unavailable:{heading:"Trigger when unavailable",description:"When the zone state becomes 'unavailable', this will activate the zone."}},actions:{toggle_advanced:"Advanced settings",remove:"Remove",setup_groups:"Set up cross-zone groups"},errors:{description:"Please correct the following errors:",no_area:"No partition is selected",no_modes:"No arm modes are selected in which the zone should be active",no_auto_bypass_modes:"No modes are selected in which the zone may be automatically bypassed"}}},dialogs:{manage_groups:{title:"Manage cross-zone groups",description:"In a cross-zone group several zones must trigger within a time period before the alarm is triggered.",no_items:"No cross-zone groups yet",actions:{new_group:"New cross-zone group"}},create_group:{title:"New cross-zone group",fields:{name:{heading:"Name",description:"Name for the cross-zone group"},timeout:{heading:"Time-out",description:"Time period during which consecutive zone activations triggers the alarm."},event_count:{heading:"Count",description:"Amount of different zones that need to be activated to trigger the alarm."},sensors:{heading:"Zones",description:"Select the zones which are contained by this group."}},errors:{invalid_name:"Invalid name provided.",insufficient_sensors:"At least 2 zones need to be selected."}},edit_group:{title:"Edit cross-zone group ''{name}''"}}},codes:{title:"Codes",cards:{codes:{description:"Change settings for the code.",fields:{code_arm_required:{heading:"Require code for arming",description:"A valid code must be provided to arm the alarm."},code_disarm_required:{heading:"Require code for disarming",description:"A valid code must be provided to disarm the alarm."},code_mode_change_required:{heading:"Require code for switching mode",description:"A valid code must be provided to change the arm mode which is active."},code_format:{heading:"Code format",description:"Sets the input type for Lovelace alarm card.",code_format_number:"Pincode",code_format_text:"Password"}}},user_management:{title:"User management",description:"Each user has its own code to arm/disarm the alarm.",no_items:"There are no users yet",actions:{new_user:"New user"}},new_user:{title:"Create new user",description:"Users can be created for providing access to operating the alarm.",fields:{name:{heading:"Name",description:"Name of the user."},code:{heading:"Code",description:"Code for this user."},confirm_code:{heading:"Confirm code",description:"Repeat the code."},can_arm:{heading:"Allow code for arming",description:"Entering this code activates the alarm"},can_disarm:{heading:"Allow code for disarming",description:"Entering this code deactivates the alarm"},is_override_code:{heading:"Is override code",description:"Entering this code will arm the alarm in force"},area_limit:{heading:"Restricted partitions",description:"Limit user to control only the selected partitions"}},errors:{no_name:"No name provided.",no_code:"Code should have 4 characters/numbers minimum.",code_mismatch:"The codes don't match."}},edit_user:{title:"Edit User",description:"Change configuration for user ''{name}''.",fields:{old_code:{heading:"Current code",description:"Current code, leave empty to leave unchanged."}}}}},actions:{title:"Actions",cards:{notifications:{title:"Notifications",description:"Using this panel, you can manage notifications to be sent when a certain alarm event occurs.",table:{no_items:"There are no notifications created yet.",no_area_warning:"Action is not assigned to any partition."},actions:{new_notification:"New notification"}},actions:{description:"This panel can be used to switch a device when the alarm state changes.",table:{no_items:"There are no actions created yet."},actions:{new_action:"New action"}},new_notification:{title:"Configure notification",description:"Receive a notification when arming/disarming the alarm, on activation, etc.",trigger:"Condition",action:"Task",options:"Options",fields:{event:{heading:"Event",description:"When should the notification be sent",choose:{armed:{name:"Alarm is armed",description:"The alarm is succesfully armed"},disarmed:{name:"Alarm is disarmed",description:"The alarm is disarmed"},triggered:{name:"Alarm is triggered",description:"The alarm is triggered"},untriggered:{name:"Alarm no longer triggered",description:"The triggered state of the alarm has ended"},arm_failure:{name:"Failed to arm",description:"The arming of the alarm failed due to one or more open zones"},arming:{name:"Exit delay started",description:"Exit delay started, ready to leave the house."},pending:{name:"Entry delay started",description:"Entry delay started, the alarm will trigger soon."}}},mode:{heading:"Arm Mode",description:"Limit the action to specific arm modes (optional)"},title:{heading:"Title",description:"Title for the notification message"},message:{heading:"Message",description:"Content of the notification message",insert_wildcard:"Insert wildcard",placeholders:{armed:"The alarm is set to {{arm_mode}}",disarmed:"The alarm is now OFF",triggered:"The alarm is triggered! Cause: {{open_sensors}}.",untriggered:"The alarm is no longer triggered.",arm_failure:"The alarm could not be armed right now, due to: {{open_sensors}}.",arming:"The alarm will be armed soon, please leave the house.",pending:"The alarm is about to trigger, disarm it quickly!"}},open_sensors_format:{heading:"Format for open_sensors wildcard",description:"Choose which zone information is inserted in the message",options:{default:"Names and states",short:"Names only"}},arm_mode_format:{heading:"Translation for arm_mode wildcard",description:"Choose in which language the arm mode is inserted in the message"},target:{heading:"Target",description:"Device to send the notification to"},media_player_entity:{heading:"Media player entity",description:"Media player to play the message on"},name:{heading:"Name",description:"Description for this notification",placeholders:{armed:"Notify {target} upon arming",disarmed:"Notify {target} upon disarming",triggered:"Notify {target} when triggered",untriggered:"Notify {target} when triggering stops",arm_failure:"Notify {target} on failure",arming:"Notify {target} when leaving",pending:"Notify {target} when arriving"}},delete:{heading:"Delete automation",description:"Permanently remove this automation"}},actions:{test:"Try it"}},new_action:{title:"Configure action",description:"Switch lights or devices (such as sirens) when arming/disarming the alarm, on activation, etc.",fields:{event:{heading:"Event",description:"When should the action be executed"},area:{heading:"Partition",description:"Alarm partition for which the event applies."},mode:{heading:"Arm Mode",description:"Limit the action to specific arm modes (optional)"},entity:{heading:"Entity",description:"Entity to perform action on"},action:{heading:"Action",description:"Action to perform on the entity",no_common_actions:"Actions can only be assigned in YAML mode for the selected entities."},name:{heading:"Name",description:"Description for this action",placeholders:{armed:"Set {entity} to {state} upon arming",disarmed:"Set {entity} to {state} upon disarming",triggered:"Set {entity} to {state} when triggered",untriggered:"Set {entity} to {state} when triggering stops",arm_failure:"Set {entity} to {state} on failure",arming:"Set {entity} to {state} when leaving",pending:"Set {entity} to {state} when arriving"}}}}}},sensor_table:{title:"Zone Assignments"},backup:{title:"Backup"},partitions:{title:"Partitions & Arm Modes"},modes:{title:"Alarmo Arm Modes"},notifications:{title:"Notifications"},zones:{title:"Zone Assignments"},zones_legacy:{title:"Zones (legacy)"},panel:{title:"Physical Panel"},house:{title:"House Modes"},why:{title:"Arm Check"},activity:{title:"Activity"},users_codes:{title:"Users, Codes, Keypads"},mirrors:{title:"Zone Mirrors"},ha_zones:{title:"Zone Actions"},connections:{title:"Keypads"}},gt={common:ht,components:pt,title:mt,panels:ut},vt=Object.freeze({__proto__:null,common:ht,components:pt,default:gt,panels:ut,title:mt}),yt={modes_short:{armed_away:"Ausente",armed_home:"En casa",armed_night:"Nocturno",armed_custom_bypass:"Personalizado",armed_vacation:"Vacaciones"},enabled:"Habilitar",disabled:"Deshabilitar"},bt={time_picker:{seconds:"segundos",minutes:"minutos"},editor:{ui_mode:"Editar en la UI",yaml_mode:"Editar en YAML",edit_in_yaml:"Editar en YAML"},table:{filter:{label:"Filtrar entidades",item:"Filtrar por {name}",hidden_items:"{number} {number, plural,\n  one {entidas está}\n  other {entidades están}\n} oculta"}}},_t="Panel de alarma",ft={general:{title:"General",cards:{general:{description:"Este panel define algunos ajustes globales para la alarma.",fields:{disarm_after_trigger:{heading:"Desarmar después de disparar",description:"Una vez transcurrido el tiempo de activación, desactivar la alarma en lugar de volver al estado de armada."},ignore_blocking_sensors_after_trigger:{heading:"Ignorar los sensores de bloqueo al rearmar",description:"Regresar al estado armado sin verificar si hay sensores que aún puedan estar activos."},enable_mqtt:{heading:"Habilitar MQTT",description:"Permitir que el panel de alarma se controle a través de MQTT."},enable_master:{heading:"Habilitar alarma maestra",description:"Crea una entidad para controlar todas las áreas simultáneamente."}},actions:{setup_mqtt:"Configuración MQTT",setup_master:"Configuración maestra"}},modes:{title:"Modos",description:"Este panel se puede utilizar para configurar los modos de armado de la alarma.",modes:{armed_away:"Armado ausente se utilizará cuando todas las personas salgan de la casa. Todas las puertas y ventanas que permitan el acceso a la casa estarán vigiladas, así como los sensores de movimiento dentro de la casa.",armed_home:"Armado en casa (también conocido como estancia armada) se utilizará cuando se active la alarma mientras haya personas en la casa. Todas las puertas y ventanas que permitan el acceso a la casa estarán protegidas, pero no los sensores de movimiento dentro de la casa.",armed_night:"Armado nocturno se usará al configurar la alarma antes de irse a dormir. Todas las puertas y ventanas que permitan el acceso a la casa estarán resguardadas y se seleccionarán sensores de movimiento en la casa.",armed_vacation:"Armado en vacaciones se puede usar como una extensión del modo armado ausente en caso de ausencia de mayor duración. Los tiempos de retardo y las respuestas de activación se pueden adaptar (como se desee) a estar lejos de casa.",armed_custom_bypass:"Un modo adicional para definir su propio perímetro de seguridad."},number_sensors_active:"{number} {number, plural,\n  one {sensor}\n  other {sensores}\n} activo",fields:{status:{heading:"Estado",description:"Controla si la alarma se puede armar en este modo."},exit_delay:{heading:"Retardo de salida",description:"Al armar la alarma, dentro de este período de tiempo, los sensores aún no dispararán la alarma."},entry_delay:{heading:"Retardo de entrada",description:"Tiempo de retardo hasta que se activa la alarma después de que se active alguno de los sensores."},trigger_time:{heading:"Tiempo de activación",description:"Tiempo durante el cual sonará la sirena."}}},mqtt:{title:"Configuración MQTT",description:"Este panel se puede utilizar para configurar la interfaz MQTT.",fields:{state_topic:{heading:"Tema del estado",description:"Tema sobre el que se publican las actualizaciones de estado."},event_topic:{heading:"Tema del evento",description:"Tema sobre el que se publican los eventos de alarma."},command_topic:{heading:"Tema del comando",description:"Tema sobre el que se envían los comandos de armado / desarmado."},require_code:{heading:"Requerir código",description:"Requiere que el código se envíe con el comando."},state_payload:{heading:"Configurar la carga útil por estado",item:"Defina una carga útil para el estado ''{state}''"},command_payload:{heading:"Configurar la carga útil por comando",item:"Defina una carga útil para el comando ''{command}''"}}},areas:{title:"Áreas",description:"Las áreas se pueden utilizar para dividir su sistema de alarma en varios compartimentos.",no_items:"Aún no hay áreas definidas.",table:{remarks:"Comentarios",summary:"Esta área contiene {summary_sensors} y {summary_automations}.",summary_sensors:"{number} {number, plural,\n  one {sensor}\n  other {sensores}\n}",summary_automations:"{number} {number, plural,\n  one {automatizacion}\n  other {automatizaciones}\n}"},actions:{add:"Agregar"}}},dialogs:{create_area:{title:"Nueva área",fields:{copy_from:"Copiar la configuración de"}},edit_area:{title:"Editando área ''{area}''",name_warning:"Nota: cambiar el nombre cambiará el ID de la entidad."},remove_area:{title:"¿Eliminar área?",description:"¿Está seguro de que desea eliminar esta área? Esta área contiene {sensors} sensores y {automations} automatizaciones que también se eliminarán."},edit_master:{title:"Configuración maestra"},disable_master:{title:"¿Deshabilitar maestro?",description:"¿Está seguro de que desea eliminar la alarma maestra? Esta área contiene {sensors} sensores y {automations} automatizaciones que también se eliminarán."}}},sensors:{title:"Sensores",cards:{sensors:{description:"Sensores configurados actualmente. Haga clic en una entidad para realizar cambios.",table:{no_items:"No hay sensores para mostrar aquí.",no_area_warning:"El sensor no está asignado a ningún área.",arm_modes:"Modos de armado",always_on:"(Siempre)"}},add_sensors:{title:"Agregar sensores",description:"Agrega más sensores. Asegúrate de que tus sensores tengan un nombre amigable, para que puedas identificarlos.",no_items:"No hay entidades HA disponibles que se puedan configurar para la alarma. Asegúrese de incluir entidades del tipo sensor binario.",table:{type:"Tipo detectado"},actions:{add_to_alarm:"Agregar a la alarma",filter_supported:"Ocultar elementos con tipo desconocido"}},editor:{title:"Editar sensor",description:"Configurando los ajustes del sensor de ''{entity}''.",fields:{entity:{heading:"Entidad",description:"Entidad asociada a este sensor"},area:{heading:"Área",description:"Seleccione un área que contenga este sensor."},group:{heading:"Grupo",description:"Agrupar con otros sensores para un disparado combinado."},device_type:{heading:"Tipo de dispositivo",description:"Elija un tipo de dispositivo para aplicar automáticamente la configuración adecuada.",choose:{door:{name:"Puerta",description:"Una puerta, portón u otra entrada que se utilice para entrar / salir de la casa."},window:{name:"Ventana",description:"Una ventana o una puerta que no se use para entrar a la casa, como un balcón."},motion:{name:"Movimiento",description:"Sensor de presencia o dispositivo similar que tiene un retardo entre activaciones."},tamper:{name:"Sabotaje",description:"Detector de extracción de la cubierta del sensor, sensor de rotura de vidrio, etc."},environmental:{name:"Medioambiental",description:"Sensor de humo / gas, detector de fugas, etc. (no relacionado con la protección antirrobo)."},other:{name:"Genérico"}}},always_on:{heading:"Siempre encendido",description:"El sensor siempre debe activar la alarma."},modes:{heading:"Modos habilitados",description:"Modos de alarma en los que este sensor está activo."},arm_on_close:{heading:"Armar después de cerrar",description:"Después de la desactivación de este sensor, se saltará automáticamente el retardo de salida restante."},use_exit_delay:{heading:"Usar retardo de salida",description:"Se permite que el sensor esté activo cuando comienza el retardo de salida."},use_entry_delay:{heading:"Usar retardo de entrada",description:"La activación del sensor activa la alarma después del retardo de entrada en lugar de directamente."},entry_delay:{heading:"Retardo de entrada",description:"Reemplace el retraso (como se establece para el modo de seguridad) con un valor específico."},delay_on:{heading:"Delay on",description:"Sensor must remain active for this duration before triggering. Resets if sensor deactivates."},allow_open:{heading:"Permitir abrir mientras se arma",description:"Si el sensor aún está activo después del retardo de salida, esto no hará que falle el armado."},auto_bypass:{heading:"Omitir automáticamente",description:"Excluya este sensor de la alarma si está abierto mientras se arma.",modes:"Modos en los que se puede omitir el sensor"},trigger_unavailable:{heading:"Activar cuando no esté disponible",description:"Cuando el estado del sensor se vuelve 'no disponible', esto activará el sensor."}},actions:{toggle_advanced:"Configuración avanzada",remove:"Eliminar",setup_groups:"Configurar grupos"},errors:{description:"Por favor, corrija los siguientes errores:",no_area:"No se ha seleccionado ninguna área",no_modes:"No se han seleccionados modos para los que el sensor deba estar activo",no_auto_bypass_modes:"No se han seleccionados modos para los que el sensor pueda ser omitido"}}},dialogs:{manage_groups:{title:"Administrar grupos de sensores",description:"En un grupo de sensores, se deben activar varios sensores dentro de un período de tiempo antes de que se dispare la alarma.",no_items:"Todavía no hay grupos",actions:{new_group:"Nuevo grupo"}},create_group:{title:"Nuevo grupo de sensores",fields:{name:{heading:"Nombre",description:"Nombre del grupo de sensores"},timeout:{heading:"Tiempo muerto",description:"Período de tiempo durante el cual las activaciones consecutivas del sensor activan la alarma."},event_count:{heading:"Nombre",description:"Cantidad de sensores diferentes que deben activarse para activar la alarma."},sensors:{heading:"Sensores",description:"Seleccione los sensores que están contenidos en este grupo."}},errors:{invalid_name:"Nombre proporcionado no válido.",insufficient_sensors:"Se deben seleccionar al menos 2 sensores."}},edit_group:{title:"Editar grupo de sensores '{name}'"}}},codes:{title:"Códigos",cards:{codes:{description:"Cambiar la configuración del código.",fields:{code_arm_required:{heading:"Usar código de armado",description:"Requiere un código para armar la alarma."},code_disarm_required:{heading:"Usar código de desarmado",description:"Requiere un código para desarmar la alarma."},code_mode_change_required:{heading:"Requerir código para cambiar de modo",description:"Se necesita un código válido para cambiar el modo de armado que está activo."},code_format:{heading:"Formato del código",description:"Establece el tipo de entrada para la tarjeta de la alarma.",code_format_number:"Código PIN",code_format_text:"Contraseña"}}},user_management:{title:"Gestión de usuarios",description:"Cada usuario tiene su propio código para armar / desarmar la alarma.",no_items:"Aún no hay usuarios",actions:{new_user:"Nuevo usuario"}},new_user:{title:"Crear nuevo usuario",description:"Se pueden crear usuarios para proporcionar acceso a la operación de la alarma.",fields:{name:{heading:"Nombre",description:"Nombre del usuario."},code:{heading:"Código",description:"Código para este usuario."},confirm_code:{heading:"Confirmar código",description:"Repite el código."},can_arm:{heading:"Permitir código para armar",description:"Al ingresar este código se activa la alarma."},can_disarm:{heading:"Permitir código para desarmar",description:"Al ingresar este código se desactiva la alarma."},is_override_code:{heading:"Es un código de anulación",description:"Al ingresar este código se forzará el armado de la alarma."},area_limit:{heading:"Áreas restringidas",description:"Limitar al usuario a controlar solo las áreas seleccionadas"}},errors:{no_name:"No se proporcionó ningún nombre.",no_code:"El código debe tener 4 caracteres / números como mínimo.",code_mismatch:"Los códigos no coinciden."}},edit_user:{title:"Editar usuario",description:"Cambiar la configuración del usuario ''{name}''.",fields:{old_code:{heading:"Código actual",description:"Código actual, déjelo en blanco para no modificarlo."}}}}},actions:{title:"Acciones",cards:{notifications:{title:"Notificaciones",description:"Usando este panel, puede administrar las notificaciones que se enviarán durante un evento de alarma determinado.",table:{no_items:"Aún no se han creado notificaciones.",no_area_warning:"La acción no está asignada a ningún área."},actions:{new_notification:"Nueva notificación"}},actions:{description:"Este panel se puede utilizar para cambiar un dispositivo cuando cambia el estado de alarma.",table:{no_items:"Aún no se han creado acciones."},actions:{new_action:"Nueva acción"}},new_notification:{title:"Crear notificación",description:"Crear una nueva notificación.",trigger:"Condición",action:"Tarea",options:"Opciones",fields:{event:{heading:"Evento",description:"Cuándo debe enviarse la notificación.",choose:{armed:{name:"La alarma está armada",description:"La alarma está correctamente armada."},disarmed:{name:"La alarma está desarmada",description:"La alarma está desarmada."},triggered:{name:"Se ha disparado la alarma",description:"La alarma se ha disparado."},untriggered:{name:"Alarm not longer triggered",description:"The triggered state of the alarm has ended"},arm_failure:{name:"No se pudo armar",description:"El armado de la alarma falló debido a uno o más sensores abiertos."},arming:{name:"Se ha iniciado el retardo de salida",description:"Se ha iniciado el retardo de salida, listo para salir de la casa."},pending:{name:"Se ha iniciado el retardo de entrada",description:"Se ha iniciado el retardo de entrada, la alarma se disparará pronto."}}},mode:{heading:"Modo",description:"Limita la acción a modos de armado específicos (opcional)."},title:{heading:"Título",description:"Título del mensaje de notificación."},message:{heading:"Mensaje",description:"Contenido del mensaje de notificación.",insert_wildcard:"Insertar comodín",placeholders:{armed:"La alarma está configurada en {{arm_mode}}",disarmed:"Ahora la alarma está APAGADA",triggered:"¡Se ha disparado la alarma! Causa: {{open_sensors}}.",untriggered:"The alarm is not longer triggered.",arm_failure:"No se pudo armar la alarma en este momento debido a: {{open_sensors}}.",arming:"Se armará pronto la alarma, por favor, salga de la casa.",pending:"¡La alarma está a punto de dispararse, desarme rápidamente!"}},open_sensors_format:{heading:"Formato para el comodín open_sensors",description:"Elija qué información del sensor se inserta en el mensaje",options:{default:"Nombres y estados",short:"Solo nombres"}},arm_mode_format:{heading:"Traducción del comodín arm_mode",description:"Elija en qué idioma se inserta el modo de armado en el mensaje"},target:{heading:"Objetivo",description:"Dispositivo al que enviar el mensaje push."},media_player_entity:{heading:"Entidad de reproductor multimedia",description:"Reproductores multimedia para reproducir el mensaje."},name:{heading:"Nombre",description:"Descripción de esta notificación.",placeholders:{armed:"Notificar a {target} al armar",disarmed:"Notificar a {target} al desarmar",triggered:"Notificar a {target} cuando se dispare",untriggered:"Notify {target} when triggering stops",arm_failure:"Notificar a {target} si falla",arming:"Notificar a {target} cuando se vaya",pending:"Notificar a {target} cuando llegue"}},delete:{heading:"Eliminar automatización",description:"Eliminar esta automatización de forma permanente"}},actions:{test:"Pruébelo"}},new_action:{title:"Crear acción",description:"Este panel se puede utilizar para cambiar un dispositivo cuando cambia el estado de la alarma.",fields:{event:{heading:"Evento",description:"¿Cuándo debe ejecutarse la acción?"},area:{heading:"Área",description:"Área para la que se aplica el evento."},mode:{heading:"Modo",description:"Limita la acción a modos de armado específicos (opcional)"},entity:{heading:"Entidad",description:"Entidad sobre la que realizar la acción."},action:{heading:"Acción",description:"Acción a realizar en la entidad.",no_common_actions:"Las acciones solo se pueden asignar en modo YAML para las entidades seleccionadas."},name:{heading:"Nombre",description:"Descripción de esta acción.",placeholders:{armed:"Establecer {entity} en {state} al armar",disarmed:"Establecer {entity} en {state} al desarmar",triggered:"Establecer {entity} en {state} cuando se dispare",untriggered:"Set {entity} to {state} when triggering stops",arm_failure:"Establecer {entity} en {state} si falla",arming:"Establecer {entity} en {state} cuando se vaya",pending:"Establecer {entity} en {state} cuando llegue"}}}}}}},kt={common:yt,components:bt,title:_t,panels:ft},wt=Object.freeze({__proto__:null,common:yt,components:bt,default:kt,panels:ft,title:_t}),$t={modes_short:{armed_away:"Eemal",armed_home:"Kodus",armed_night:"Ööseks",armed_custom_bypass:"Valikuline",armed_vacation:"Vacation"},enabled:"Lubatud",disabled:"Keelatud"},zt={time_picker:{seconds:"sekundid",minutes:"minutid"},editor:{ui_mode:"Kasutajaliides",yaml_mode:"Koodiredaktor",edit_in_yaml:"Edit in YAML"},table:{filter:{label:"Filter items",item:"Filter by {name}",hidden_items:"{number} {number, plural,\n  one {item is}\n  other {items are}\n} hidden"}}},At="Alarm panel",xt={general:{title:"Üldsätted",cards:{general:{description:"Need seaded kehtivad kõikides valve olekutes.",fields:{disarm_after_trigger:{heading:"Häire summutamine",description:"Peale häire lõppu võta valvest maha miite ära valvesta uuesti."},ignore_blocking_sensors_after_trigger:{heading:"Ignoreeri blokeerivaid andureid uuesti valve alla panemisel",description:"Naaske valvestatud olekusse ilma kontrollimata andureid, mis võivad endiselt aktiivsed olla."},enable_mqtt:{heading:"Luba MQTT juhtimine",description:"Luba nupustiku juhtimist MQTT abil."},enable_master:{heading:"Luba põhivalvestus",description:"Loob olemi mis haldab kõiki valvestamise alasid korraga."}},actions:{setup_mqtt:"MQTT seadistamine",setup_master:"Põhivalvestuse sätted"}},modes:{title:"Režiimid",description:"Selles vaates seadistatakse valvestamise režiime.",modes:{armed_away:"Täielik valvestamine kui kedagi pole kodus. Kasutusel on kõik andurid.",armed_home:"Valvestatud kodus ei kasuta liikumisandureid kuid väisuksed ja aknad on valve all.",armed_night:"Valvestatud ööseks ei kasuta määratud liikumisandureid, välisperimeeter on valve all.",armed_vacation:"Armed vacation can be used as an extension to the armed away mode in case of absence for longer duration. The delay times and trigger responses can be adapted (as desired) to being distant from home.",armed_custom_bypass:"Valikulise valvestuse puhul saab määrata kasutatavad andurid."},number_sensors_active:"{number} {number, plural,\n  one {andur}\n  other {andurit}\n} aktiiv",fields:{status:{heading:"Status",description:"Controls whether the alarm can be armed in this mode."},exit_delay:{heading:"Ooteaeg valvestamisel",description:"Viivitus enne valvestamise rakendumist."},entry_delay:{heading:"Sisenemise viivitus",description:"Viivitus sisenemisel enne häire rakendumist."},trigger_time:{heading:"Häire kestus",description:"Sireeni jne. aktiveerimise kestus."}}},mqtt:{title:"MQTT sätted",description:"MQTT parameetrite seadistamine.",fields:{state_topic:{heading:"Oleku teema (topic)",description:"Teema milles avaldatakse oleku muutused."},event_topic:{heading:"Event topic",description:"Topic on which alarm events are published"},command_topic:{heading:"Käskude teema (topic)",description:"Teema milles avaldatakse valvestamise käsud."},require_code:{heading:"Nõua PIN koodi",description:"Käskude edastamiseks on vajalik PIN kood."},state_payload:{heading:"Määra olekute toimeandmed",item:"Määra oleku ''{state}'' toimeandmed"},command_payload:{heading:"Määra käskude toimeandmed",item:"Määra käsu ''{command}'' toimeandmed"}}},areas:{title:"Alad",description:"Alasid kasutatakse elamise jagamiseks valvetsoonideks.",no_items:"Valvestamise alad on loomata.",table:{remarks:"Ala teave",summary:"See ala sisaldab {summary_sensors} ja {summary_automations}.",summary_sensors:"{number} {number, plural,\n  one {andur}\n  other {andurit}\n}",summary_automations:"{number} {number, plural,\n  one {automatiseering}\n  other {automatiseeringut}\n}"},actions:{add:"Lisa"}}},dialogs:{create_area:{title:"Uus ala",fields:{copy_from:"Kopeeri sätted allikast:"}},edit_area:{title:"Ala ''{area}'' muutmine",name_warning:"NB! Nime muutmisel muutub ka olemi ID"},remove_area:{title:"Kas kustutada ala?",description:"Kas kustutada see ala? Ala kaasab andurid {sensors} ja automatiseeringud {automations} mis samuti eemaldatakse."},edit_master:{title:"Põhiala seaded"},disable_master:{title:"Kas keelata põhiala?",description:"Kas keelata põhiala? Ala kaasab andurid {sensors} ja automatiseeringud {automations} mis samuti eemaldatakse.."}}},sensors:{title:"Andurid",cards:{sensors:{description:"Kasutusel olevad andurid. Klõpsa olemil, et seadistada.",table:{no_items:"Andureid pole lisatud. Alustuseks lisa mõni andur.",no_area_warning:"Sensor is not assigned to any area.",arm_modes:"Valvestamise olek",always_on:"(alati)"}},add_sensors:{title:"Andurite lisamine",description:"Lisa veel andureid. Mõistlik on panna neile arusaadav nimi (friendly_name).",no_items:"Puuduvad valvestamiseks sobivad Home Assistanti olemid. Lisatavad olemid peavad olema olekuandurid (binary_sensor).",table:{type:"Detected type"},actions:{add_to_alarm:"Lisa valvesüsteemile",filter_supported:"Hide items with unknown type"}},editor:{title:"Andurite sätted",description:"Muuda olemi ''{entity}'' sätteid.",fields:{entity:{heading:"Olem",description:"Selle anduriga seotud olem"},area:{heading:"Ala",description:"Vali ala kus see andur asub."},group:{heading:"Group",description:"Group with other sensors for combined triggering."},device_type:{heading:"Seadme tüüp",description:"Vali anduri tüüp, et automaatselt rakendada sobivad sätted.",choose:{door:{name:"Uks",description:"Uks, värav või muu piire mida kasutatakse sisenemiseks või väljumiseks."},window:{name:"Aken",description:"Aken või uks mida ei kasutata sisenemiseks nagu rõduuks."},motion:{name:"Liikumisandur",description:"Kohaloleku andurid mille rakendumiste vahel on viide."},tamper:{name:"Terviklikkus",description:"Anduri muukimine või klaasipurustusandur jms."},environmental:{name:"Ohu andurid",description:"Suitsu või gaasilekke andur, veeleke jne. (ei ole seotud sissetungimisega)."},other:{name:"Tavaandur"}}},always_on:{heading:"Alati kasutusel",description:"Andur käivitab häire igas valve olekus."},modes:{heading:"Valve olekute valik",description:"Valve olekud kus seda andurit kasutatakse."},arm_on_close:{heading:"Valvesta sulgemisel",description:"Selle anduri rakendumisel valvestatakse kohe ilma viiveta."},use_exit_delay:{heading:"Use exit delay",description:"Sensor is allowed to be active when the exit delay starts."},use_entry_delay:{heading:"Use entry delay",description:"Sensor activation triggers the alarm after the entry delay rather than directly."},entry_delay:{heading:"Entry delay",description:"Override the entry delay (as configured for the arm mode) with a delay specific to the sensor."},delay_on:{heading:"Delay on",description:"Sensor must remain active for this duration before triggering. Resets if sensor deactivates."},allow_open:{heading:"Lahkumisviivitus",description:"See andur ei aktiveeru enne lahkumisviivituse lõppu."},auto_bypass:{heading:"Bypass automatically",description:"Exclude this sensor from the alarm if it is open while arming.",modes:"Modes in which sensor may be bypassed"},trigger_unavailable:{heading:"Andurite saadavus",description:"Käivita häire kui andur muutub kättesaamatuks."}},actions:{toggle_advanced:"Täpsemad sätted",remove:"Eemalda",setup_groups:"Setup groups"},errors:{description:"Palun paranda jägmised vead:",no_area:"Ala pole määratud",no_modes:"Anduri tüüp on määramata, ei tea kuida kasutada",no_auto_bypass_modes:"No modes are selected for the sensor may be automatically bypassed"}}},dialogs:{manage_groups:{title:"Manage sensor groups",description:"In a sensor group multiple sensors must be activated within a time period before the alarm is triggered.",no_items:"No groups yet",actions:{new_group:"New group"}},create_group:{title:"New sensor group",fields:{name:{heading:"Name",description:"Name for sensor group"},timeout:{heading:"Time-out",description:"Time period during which consecutive sensor activations triggers the alarm."},event_count:{heading:"Kogus",description:"Erinevate andurite arv, mis tuleb häire käivitamiseks aktiveerida."},sensors:{heading:"Sensors",description:"Select the sensors which are contained by this group."}},errors:{invalid_name:"Invalid name provided.",insufficient_sensors:"At least 2 sensors need to be selected."}},edit_group:{title:"Edit sensor group ''{name}''"}}},codes:{title:"Koodid",cards:{codes:{description:"Valvestuskoodide muutmine.",fields:{code_arm_required:{heading:"Valvestamine koodiga",description:"Valvestamiseks tuleb sisestada kood"},code_disarm_required:{heading:"Valvest vabastamise kood",description:"Valvest vabastamiseks tulem sisestada kood"},code_mode_change_required:{heading:"Nõua režiimi vahetamiseks koodi",description:"Aktiivse valverežiimi muutmiseks tuleb esitada kehtiv kood."},code_format:{heading:"Koodi vorming",description:"Kasutajaliidese koodi tüübid.",code_format_number:"PIN kood",code_format_text:"Salasõna"}}},user_management:{title:"Kasutajate haldus",description:"Igal kasutajal on oma juhtkood.",no_items:"Kasutajaid pole määratud",actions:{new_user:"Uus kasutaja"}},new_user:{title:"Lisa uus kasutaja",description:"Valvesüsteemi kasutaja lisamine.",fields:{name:{heading:"Nimi",description:"Kasutaja nimi."},code:{heading:"Valvestuskood",description:"Selle kasutaja kood."},confirm_code:{heading:"Koodi kinnitamine",description:"Sisesta sama kood uuesti."},can_arm:{heading:"Tohib valvestada",description:"Koodi sisestamine valvestab."},can_disarm:{heading:"Tohib valvest maha võtta",description:"Koodi sisestamine võtab valvest maha."},is_override_code:{heading:"Alistuskood",description:"Koodi sisestamine käivitab kohese häire"},area_limit:{heading:"Restricted areas",description:"Limit user to control only the selected areas"}},errors:{no_name:"Nimi puudub.",no_code:"Kood peab olema vhemalt 4 tärki.",code_mismatch:"Sisestatud koodid ei klapi."}},edit_user:{title:"Muuda kasutaja sätteid",description:"Muuda kasutaja ''{name}'' sätteid.",fields:{old_code:{heading:"Kehtiv kood",description:"Kehtiv kood, jäta tühjaks kui ei taha muuta."}}}}},actions:{title:"Toimingud",cards:{notifications:{title:"Teavitused",description:"Halda saadetavaid teavitusi",table:{no_items:"Teavitusi pole veel loodud.",no_area_warning:"Action is not assigned to any area."},actions:{new_notification:"Uus teavitus"}},actions:{description:"Arenduses, mõeldud seadmete lülitamiseks.",table:{no_items:"Toiminguid pole veel määratud."},actions:{new_action:"Uus toiming"}},new_notification:{title:"Loo teavitus",description:"Uue teavituse loomine.",trigger:"Condition",action:"Task",options:"Options",fields:{event:{heading:"Sündmus",description:"Mille puhul teavitada",choose:{armed:{name:"Valvestatud",description:"Valvestamine oli edukas"},disarmed:{name:"Valvest maas",description:"Valve mahavõtmine õnnestus"},triggered:{name:"Häire",description:"Valvesüsteem andis häire"},untriggered:{name:"Alarm not longer triggered",description:"The triggered state of the alarm has ended"},arm_failure:{name:"Valvestamine nurjus",description:"Valvestamine ei õnnestunud mõne anduri oleku või vea tõttu"},arming:{name:"Valvestamise eelne viivitus algas",description:"Algas valvestamise eelviide, majast võib lahkuda."},pending:{name:"Sisenemise viide rakendus",description:"Märgati sisenemist, häire rakendub peale viidet."}}},mode:{heading:"Olek",description:"Millises valve olekus teavitada (valikuline)"},title:{heading:"Päis",description:"Teavitussõnumi päis"},message:{heading:"Sisu",description:"Teavitussõnumi tekst",insert_wildcard:"Insert wildcard",placeholders:{armed:"The alarm is set to {{arm_mode}}",disarmed:"The alarm is now OFF",triggered:"The alarm is triggered! Cause: {{open_sensors}}.",untriggered:"The alarm is not longer triggered.",arm_failure:"The alarm could not be armed right now, due to: {{open_sensors}}.",arming:"The alarm will be armed soon, please leave the house.",pending:"The alarm is about to trigger, disarm it quickly!"}},open_sensors_format:{heading:"Format for open_sensors wildcard",description:"Choose which sensor information in inserted in the message",options:{default:"Names and states",short:"Names only"}},arm_mode_format:{heading:"Translation for arm_mode wildcard",description:"Choose in which language the arm mode is inserted in the message"},target:{heading:"Saaja",description:"Seade millele edastada teavitus"},media_player_entity:{heading:"Meediamängija olem",description:"Meediamängijad sõnumi esitamiseks."},name:{heading:"Nimi",description:"Teavituse kirjeldus",placeholders:{armed:"Notify {target} upon arming",disarmed:"Notify {target} upon disarming",triggered:"Notify {target} when triggered",untriggered:"Notify {target} when triggering stops",arm_failure:"Notify {target} on failure",arming:"Notify {target} when leaving",pending:"Notify {target} when arriving"}},delete:{heading:"Delete automation",description:"Permanently remove this automation"}},actions:{test:"Try it"}},new_action:{title:"Loo toiming",description:"Seadme oleku muutmine valve oleku muutmisel.",fields:{event:{heading:"Sündmus",description:"Millisel juhul käivitada toiming"},area:{heading:"Ala",description:"Ala millele sündmus rakendub."},mode:{heading:"Olek",description:"Millises valve olekus toiming käivitada (valikuline)"},entity:{heading:"Olem",description:"Toimingu olem"},action:{heading:"Toiming",description:"Olemi toiming",no_common_actions:"Actions can only be assigned in YAML mode for the selected entities."},name:{heading:"Nimi",description:"Toimingu kirjeldus",placeholders:{armed:"Set {entity} to {state} upon arming",disarmed:"Set {entity} to {state} upon disarming",triggered:"Set {entity} to {state} when triggered",untriggered:"Set {entity} to {state} when triggering stops",arm_failure:"Set {entity} to {state} on failure",arming:"Set {entity} to {state} when leaving",pending:"Set {entity} to {state} when arriving"}}}}}}},jt={common:$t,components:zt,title:At,panels:xt},St=Object.freeze({__proto__:null,common:$t,components:zt,default:jt,panels:xt,title:At}),Ot={modes_short:{armed_away:"Absence",armed_home:"Présence",armed_night:"Nuit",armed_custom_bypass:"Personnalisé",armed_vacation:"Vacances"},enabled:"Actif",disabled:"Inactif"},Ct={time_picker:{seconds:"secondes",minutes:"minutes"},editor:{ui_mode:"Afficher l'éditeur visuel",yaml_mode:"Afficher l'éditeur de code",edit_in_yaml:"Editer en YAML"},table:{filter:{label:"Filtrer par items",item:"Filtrer par {name}",hidden_items:"{number} {number, plural,\n  one { item est caché}\n  other { items sont cachés}\n} "}}},Tt="Configuration de l'alarme",Et={general:{title:"Généraux",cards:{general:{description:"Ce panneau définit les paramètres globaux de l'alarme.",fields:{disarm_after_trigger:{heading:"Désactivation après déclenchement",description:"Lorsque le temps de fonctionnement de la sirène est écoulé, désactive l'alarme au lieu de la réactiver."},ignore_blocking_sensors_after_trigger:{heading:"Ignorer les capteurs de blocage lors du réarmement",description:"Revenez à l'état armé sans vérifier les capteurs qui peuvent encore être actifs."},enable_mqtt:{heading:"Utilisation avec MQTT",description:"Permet au panneau d'alarme d'être contrôlé via MQTT."},enable_master:{heading:"Activation de commande centralisée",description:"Créer une entité pour piloter toutes les zones en même temps."}},actions:{setup_mqtt:"Configuration MQTT",setup_master:"Configuration pricipale"}},modes:{title:"Modes",description:"Ce panneau définit le mode de gestion pour chaque type d'activation.",modes:{armed_away:"Ce mode sera utilisé lorsque toutes les personnes auront quitté la maison. Toutes les portes et fenêtres permettant l'accès à la maison seront surveillées, les détecteurs de mouvement à l'intérieur de la maison seront opérationnels.",armed_home:"Ce mode sera utilisée lorsque des personnes sont dans la maison. Toutes les portes et fenêtres permettant l'accès à la maison seront surveillées (périmétrie), les détecteurs de mouvement à l'intérieur de la maison seront inopérants.",armed_night:"Ce mode sera utilisé lors du réglage de l'alarme avant de s'endormir. Toutes les portes et fenêtres permettant l'accès à la maison seront surveillées, et les capteurs de mouvement sélectionnés (ex : rez de chaussée) dans la maison seront opérationnels.",armed_vacation:"Ce mode peut être utilisé comme une extension du mode armé absent en cas d'absence pour une durée plus longue. Les temps de retard et les réponses de déclenchement peuvent être adaptés (au choix) à l'éloignement du domicile.",armed_custom_bypass:"Ce mode supplémentaire permet de définir votre propre périmètre de sécurité."},number_sensors_active:"{number} {number, plural,\n  one {capteur actif}\n  other {capteurs actifs}\n} ",fields:{status:{heading:"Statut",description:"Active l'alarme dans ce mode."},exit_delay:{heading:"Délai pour sortir",description:"Lors de l'activation, pendant cette période, les capteurs ne déclencheront pas l'alarme."},entry_delay:{heading:"Délai pour entrer",description:"Temps d'attente avant que l'alarme ne se déclenche après détection d'un des capteurs."},trigger_time:{heading:"Temps de fonctionnement avant réarmement",description:"Temps pendant lequel l'alarme restera dans l'état déclenché après intrusion."}}},mqtt:{title:"Configuration MQTT",description:"Ce panneau peut être utilisé pour la configuration de l'interface MQTT.",fields:{state_topic:{heading:"Etat des données",description:"Topic sur lequel les mises à jour d'état sont publiées."},event_topic:{heading:"Evènement de données",description:"Topic sur lequel les évènements d'état sont publiés."},command_topic:{heading:"Commande de données",description:"Topic sur lequel les commandes d'armement / désarmement sont envoyées."},require_code:{heading:"Code requis",description:"Exige que le code soit envoyé avec la commande."},state_payload:{heading:"Configurer une valeur par état",item:"Définir une valeur pour l'état ''{state}''."},command_payload:{heading:"Configurer une valeur par commande",item:"Définir une valeur pour la commande ''{command}''."}}},areas:{title:"Zones",description:"Les zones peuvent être utilisées pour diviser votre système d'alarme en plusieurs secteurs.",no_items:"Il n'y a pas encore de zone définie.",table:{remarks:"Remarque",summary:"Cette zone contient {summary_sensors} et {summary_automations}.",summary_sensors:"{number} {number, plural,\n  one {capteur}\n  other {capteurs}\n}",summary_automations:"{number} {number, plural,\n  one {automatisation}\n  other {automatisations}\n}"},actions:{add:"Ajouter"}}},dialogs:{create_area:{title:"Nouvelle zone",fields:{copy_from:"Copier les paramètres"}},edit_area:{title:"Editer la zone ''{area}''",name_warning:"Note : Changer le nom, changera l'entity ID"},remove_area:{title:"Suppression de zone ?",description:"Êtes-vous sur de vouloir supprimer cette zone ? Cette zone contient {sensors} capteur(s) et {automations} automatisation(s), qui seront également supprimés."},edit_master:{title:"Configuration principale"},disable_master:{title:"Désactiver la configuration principale ?",description:"Êtes-vous sur de vouloir supprimer la configuration principale ? Cette zone contient {automations} automatisation(s), qui seront également supprimées."}}},sensors:{title:"Capteurs",cards:{sensors:{description:"Capteurs actuellement configurés. Cliquez sur une entité pour apporter des modifications.",table:{no_items:"Il n'y a pas encore de capteur ajouté à l'alarme. Assurez-vous de les ajouter d'abord.",no_area_warning:"Le capteur n'est affecté à aucune zone.",arm_modes:"Type d'activation",always_on:"(Toujours)"}},add_sensors:{title:"Ajouter un capteur",description:"Ajoutez plus de capteurs. Assurez-vous que vos capteurs ont un nom personnalisé afin de pouvoir les identifier.",no_items:"Aucune entité HA disponible ne peut être configurée pour l'alarme. Assurez-vous d'inclure les entités de type binary_sensor.",table:{type:"Type de détection"},actions:{add_to_alarm:"Ajouter à l'alarme",filter_supported:"Masquer les éléments de type inconnu"}},editor:{title:"Editer un capteur",description:"Configurer les paramètres du capteur ''{entity}''.",fields:{entity:{heading:"Entité",description:"Entité associée à ce capteur"},area:{heading:"Zone",description:"Sélectionner une zone contenant ce capteur."},group:{heading:"Groupe",description:"Grouper avec d'autres capteurs pour un déclenchement combiné."},device_type:{heading:"Type de détection",description:"Choisissez un type de détection pour appliquer automatiquement les paramètres appropriés.",choose:{door:{name:"Porte",description:"Une porte, un portail ou une autre entrée utilisée pour entrer / sortir de la maison."},window:{name:"Fenêtre",description:"Une fenêtre, ou une porte non utilisée pour entrer dans la maison comme un balcon."},motion:{name:"Mouvement",description:"Capteur de présence ou appareil similaire présentant un délai entre les activations."},tamper:{name:"Effraction",description:"Détection d'arrachage du capteur, capteur de bris de verre, etc."},environmental:{name:"Détecteur Environmental",description:"Détecteur de fumée / gaz, détecteur de fuite, etc. (non lié à la protection anti-effraction)."},other:{name:"Générique"}}},always_on:{heading:"Toujours en service",description:"Le capteur doit toujours déclencher l'alarme."},modes:{heading:"Mode possible",description:"Modes d'alarme dans lesquels ce capteur est actif."},arm_on_close:{heading:"Activer après fermeture",description:"Après la désactivation de ce capteur, le délai de sortie restant sera automatiquement ignoré."},use_exit_delay:{heading:"Utiliser le délai de sortie",description:"Le capteur sera actif à la fin du délai de sortie."},use_entry_delay:{heading:"Utiliser le délai d'entrée",description:"L'activation du capteur déclenche l'alarme après le délai d'entrée plutôt qu'instantanément."},entry_delay:{heading:"Délai pour entrer",description:"Remplacez le délai (tel que défini pour le mode de sécurité) par une valeur spécifique."},delay_on:{heading:"Delay on",description:"Sensor must remain active for this duration before triggering. Resets if sensor deactivates."},allow_open:{heading:"Autoriser l'ouverture lors de l'activation",description:"Permet à ce capteur d'être actif, peu de temps après votre départ afin qu'il ne bloque pas l'armement."},auto_bypass:{heading:"Bypass automatique",description:"Exclut ce capteur de l'alarme s'il est ouvert lors de l'armement.",modes:"Modes dans lesquels le capteur peut être ignoré"},trigger_unavailable:{heading:"Déclenchement lorsqu'il n'est pas disponible",description:"Lorsque l'état du capteur devient `` indisponible '', cela activera l'alarme."}},actions:{toggle_advanced:"Paramètres avancées",remove:"Supprimer",setup_groups:"Configuration de Groupe"},errors:{description:"Veuillez corriger les erreurs suivantes :",no_area:"Aucune zone n'est sélectionnée",no_modes:"Aucun mode sélectionné pour lequel le capteur doit être actif",no_auto_bypass_modes:"Aucun mode n'est sélectionné car le capteur peut être automatiquement ignoré"}}},dialogs:{manage_groups:{title:"Gérer les groupes de capteurs",description:"Dans un groupe de capteurs, plusieurs capteurs doivent être activés dans un laps de temps avant que l'alarme ne se déclenche.",no_items:"Aucun groupe",actions:{new_group:"Nouveau groupe"}},create_group:{title:"Nouveau groupe de capteurs",fields:{name:{heading:"Nom",description:"Nom du nouveau groupe de capteurs"},timeout:{heading:"Laps de temps",description:"Période de temps pendant laquelle les activations consécutives du capteur déclenchent l'alarme."},event_count:{heading:"nombre d'événements",description:"Nombre de capteurs différents qui doivent être activés pour déclencher l'alarme."},sensors:{heading:"Capteurs",description:"Sélectionnez les capteurs qui sont contenus dans ce groupe."}},errors:{invalid_name:"Nom fourni non valide.",insufficient_sensors:"Au moins 2 capteurs doivent être sélectionnés."}},edit_group:{title:"Editer le groupe de capteurs ''{name}''"}}},codes:{title:"Codes",cards:{codes:{description:"Gestion des paramètres des codes.",fields:{code_arm_required:{heading:"Utiliser un code pour l'activation",description:"Code requis pour l'activation de l'alarme"},code_disarm_required:{heading:"Utiliser un code pour la désactivation",description:"Code requis pour la désactivation de l'alarme"},code_mode_change_required:{heading:"Exiger un code pour changer de mode",description:"Un code valide doit être fourni pour changer le mode d'armement en cours."},code_format:{heading:"Format du code",description:"Définit le type d'entrée pour la carte d'alarme Lovelace.",code_format_number:"Pincode",code_format_text:"Password"}}},user_management:{title:"Gestion des utilisateurs",description:"Chaque utilisateur a son propre code pour activer / désactiver l'alarme.",no_items:"Il n'y a aucun utilisateur de défini",actions:{new_user:"Nouvel utilisateur"}},new_user:{title:"Créer un nouvel utilisateur",description:"Des utilisateurs peuvent être créés pour donner accès au fonctionnement de l'alarme.",fields:{name:{heading:"Nom",description:"Nom de l'utilisateur."},code:{heading:"Code",description:"Code personnel de l'utilisateur."},confirm_code:{heading:"Confirmation du code",description:"Répèter le code."},can_arm:{heading:"Demande de code pour l'activation",description:"Entrer ce code pour activer l'alarme."},can_disarm:{heading:"Demande de code pour désactivation",description:"Entrer ce code pour désactiver l'alarme."},is_override_code:{heading:"Code de sécurité",description:"La saisie de ce code forcera l'activation l'alarme."},area_limit:{heading:"Zones Restreintes",description:"L'utilisateur ne peut contrôler uniquement les zones sélectionnées."}},errors:{no_name:"Aucun nom saisi.",no_code:"Le code doit contenir 4 caractères/chiffres minimum.",code_mismatch:"Les codes sont différents."}},edit_user:{title:"Editer l'utilisateur",description:"Changer la configuration pour l'utilisateur ''{name}''.",fields:{old_code:{heading:"Code utilisé",description:"Code actuel, laissez vide pour ne rien changer."}}}}},actions:{title:"Actions",cards:{notifications:{title:"Notifications",description:"À l'aide de ce panneau, vous pouvez gérer les notifications à envoyer lors d'un évènement d'alarme.",table:{no_items:"Il n'y a aucune notification de créée.",no_area_warning:"L'action n'est affectée à aucune zone."},actions:{new_notification:"Nouvelle notification"}},actions:{description:"Ce panneau est utilisé pour changer d'état les appareils de votre choix.",table:{no_items:"Il n'y a aucune action de créée."},actions:{new_action:"Nouvelle action"}},new_notification:{title:"Créer une notification",description:"Créer une nouvelle notification.",trigger:"Condition",action:"Action",options:"Options",fields:{event:{heading:"Évènement",description:"Détermine quand la notification doit être envoyée.",choose:{armed:{name:"Alarme activée",description:"L'alarme s'est correctement activée."},disarmed:{name:"Alarme désactivée",description:"L'alarme est désactivée."},triggered:{name:"Alarme déclenchée",description:"L'alarme est déclenchée."},untriggered:{name:"L'alarme n'est plus déclenchée",description:"Le temps de déclenchement de l'alarme est terminé."},arm_failure:{name:"Armement impossible",description:"L'armement est impossible dû à un ou plusieurs capteurs."},arming:{name:"Délai de sortie activé",description:"Le délai de sortie est activé, vous devez quitter la maison."},pending:{name:"Délai d'entrée activé",description:"Le délai d'entrée est activé, sans action de désarmement, l'alarme va se déclencher."}}},mode:{heading:"Mode",description:"Limite la notification à un mode spécifique (optionnel)"},title:{heading:"Titre",description:"Titre du message de la notification"},message:{heading:"Message",description:"Contenu du message de la notification",insert_wildcard:"Inserer la wildcard",placeholders:{armed:"L'alarme est réglée sur {{arm_mode}}",disarmed:"L'alarme est maintenant désactivée",triggered:"L'alarme s'est déclenchée ! Cause : {{open_sensors}}.",untriggered:"L'alarme n'est plus déclenchée.",arm_failure:"L'alarme n'a pas pu être armée pour le moment, à cause de : {{open_sensors}}.",arming:"L'alarme sera bientôt armée, veuillez quitter la maison.",pending:"L'alarme est sur le point de se déclencher, désarmez-la rapidement !"}},open_sensors_format:{heading:"Format pour les 'open_sensors wildcard'",description:"Choisissez les informations du capteur à insérer dans le message",options:{default:"Noms et états",short:"Noms seulement"}},arm_mode_format:{heading:"Traduction pour 'arm_mode wildcard'",description:"Choisissez dans quelle langue le mode d'armement est inséré dans le message"},target:{heading:"Cible",description:"Appareil recevant le message"},media_player_entity:{heading:"Entité du lecteur multimédia",description:"Lecteurs multimédias pour lire le message."},name:{heading:"Nom",description:"Description de la notification",placeholders:{armed:"Notifie {target} à l'armement",disarmed:"Notifie {target} au désarmement",triggered:"Notifie {target} au déclenchement",untriggered:"Notifie {target} quand le temps de déclenchement est terminé",arm_failure:"Notifie {target} en cas d'échec de l'armement",arming:"Notifie {target} lors du départ de la maison",pending:"Notifie {target} lors du retour à la maison"}},delete:{heading:"Supprimer l'automatisme",description:"Supprimer définitivement cet automatisme"}},actions:{test:"Essai"}},new_action:{title:"Créer une action",description:"Ce panneau peut être utilisé pour commuter un appareil lorsque l'état de l'alarme change.",fields:{event:{heading:"Evènement",description:"Détermine quand l'action doit être exécutée."},area:{heading:"Zone",description:"Zone pour laquelle l'évènement s'applique."},mode:{heading:"Mode",description:"Limite l'action à un mode spécifique (optionnel)."},entity:{heading:"Entité",description:"Entité sur laquelle effectuer une action."},action:{heading:"Action",description:"Action à exécuter sur l'entité",no_common_actions:"Les actions ne peuvent être affectées qu'en mode YAML pour les entités sélectionnées."},name:{heading:"Nom",description:"Description de l'action",placeholders:{armed:"Mettre {entity} à {state} lors de l'armement",disarmed:"Mettre {entity} à {state} lors du désarmement",triggered:"Mettre {entity} à {state} lors du déclenchement de l'alarme",untriggered:"Mettre {entity} à {state} quand le temps de déclenchement s'arrête",arm_failure:"Mettre {entity} à {state} en cas d'échec de l'armement",arming:"Mettre {entity} à {state} lors du départ de la maison",pending:"Mettre {entity} à {state} lors du retour à la maison"}}}}}}},Mt={common:Ot,components:Ct,title:Tt,panels:Et},Lt=Object.freeze({__proto__:null,common:Ot,components:Ct,default:Mt,panels:Et,title:Tt}),Nt={modes_short:{armed_away:"Teljes élesítés",armed_home:"Otthoni élesítés",armed_night:"Éjszakai élesítés",armed_custom_bypass:"Egyedi élesítés",armed_vacation:"Nyaralás mód"},enabled:"Engedélyezve",disabled:"Letiltva"},Ht={time_picker:{seconds:"másodperc",minutes:"perc"},editor:{ui_mode:"UI mód",yaml_mode:"YAML mód",edit_in_yaml:"Szerkesztés YAML-ben"},table:{filter:{label:"Elemek szűrése",item:"Szűrés: {name}",hidden_items:"{number} {number, plural,\n  one {item is}\n  other {items are}\n} rejtve"}}},Dt="Riasztópanel",Pt={general:{title:"Általános",cards:{general:{description:"Ez a panel a riasztó néhány globális beállítását tartalmazza.",fields:{disarm_after_trigger:{heading:"Hatástalanítás riasztás után",description:"A riasztási idő lejárta után a rendszer hatástalanítódik ahelyett, hogy visszatérne élesített állapotba."},ignore_blocking_sensors_after_trigger:{heading:"Újraélesítéskor figyelmen kívül hagyja a blokkoló érzékelőket",description:"Térjen vissza élesített állapotba anélkül, hogy ellenőrizné az esetleg még aktív érzékelőket."},enable_mqtt:{heading:"MQTT engedélyezése",description:"Engedélyezi a riasztópanel MQTT-n keresztüli vezérlését."},enable_master:{heading:"Főriasztó engedélyezése",description:"Létrehoz egy entitást az összes zóna egyidejű vezérléséhez."}},actions:{setup_mqtt:"MQTT Beállítások",setup_master:"Főriasztó beállítások"}},modes:{title:"Módok",description:"Ez a panel használható a riasztó élesítési módjainak beállítására.",modes:{armed_away:"A 'Teljes élesítés' akkor használatos, amikor mindenki elhagyta az otthont. Minden ajtó és ablak, valamint a belső mozgásérzékelők is aktívak lesznek.",armed_home:"Az 'Otthoni élesítés' (más néven 'maradás mód') akkor használatos, amikor valaki otthon tartózkodik. Az ajtók és ablakok védettek, de a belső mozgásérzékelők nem aktívak.",armed_night:"Az 'Éjszakai élesítés' alvás előtt ajánlott. Védi a külső nyílászárókat, valamint kiválasztott (pl. földszinti) mozgásérzékelőket.",armed_vacation:"A 'Nyaralás mód' a teljes élesítés kiterjesztése hosszabb távollét esetére. A késleltetési idők és a riasztási válaszok ehhez igazíthatók.",armed_custom_bypass:"Egy extra mód, amelyben saját védelmi zónák határozhatók meg (például kivételek, kizárt érzékelők)."},number_sensors_active:"{number} {number, plural,\n  one {sensor}\n  other {sensors}\n} active",fields:{status:{heading:"Állapot",description:"Szabályozza, hogy a riasztó élesíthető-e ebben a módban."},exit_delay:{heading:"Kilépési késleltetés",description:"A riasztó élesítése után ennyi ideig nem vált ki riasztást az érzékelő, lehetőséget adva az elhagyásra."},entry_delay:{heading:"Belépési késleltetés",description:"Az az idő, ami alatt a rendszer még nem riaszt, miután egy érzékelő aktiválódik (pl. bejárat használatakor)."},trigger_time:{heading:"Riasztási idő",description:"Az az időtartam, ameddig a riasztás aktív marad, miután kiváltódott."}}},mqtt:{title:"MQTT beállítások",description:"Ez a panel az MQTT interfész konfigurálására szolgál.",fields:{state_topic:{heading:"Állapot topic",description:"Az a témakör, amelyre az állapotfrissítések kerülnek publikálásra."},event_topic:{heading:"Esemény topic",description:"Az a témakör, amelyre a riasztási események kerülnek publikálásra."},command_topic:{heading:"Parancs topic",description:"Az a témakör, amelyen keresztül az Alarmo az élesítési/hatástalanítási parancsokat fogadja."},require_code:{heading:"Kód megkövetelése",description:"A parancs elküldésekor kötelező a kód megadása."},state_payload:{heading:"Állapotonkénti payload beállítása",item:"Payload definiálása a(z) ''{state}'' állapothoz"},command_payload:{heading:"Parancsonkénti payload beállítása",item:"Payload definiálása a(z) ''{command}'' parancshoz"}}},areas:{title:"Zónák",description:"A zónák segítségével a riasztórendszer több, külön vezérelhető részre bontható.",no_items:"Még nincs definiálva egyetlen zóna sem.",table:{remarks:"Megjegyzések",summary:"Ez a zóna {summary_sensors} és {summary_automations} elemet tartalmaz.",summary_sensors:"{number} {number, plural,\n  one {sensor}\n  other {sensors}\n}",summary_automations:"{number} {number, plural,\n  one {automation}\n  other {automations}\n}"},actions:{add:"Hozzáadás"}}},dialogs:{create_area:{title:"Új zóna",fields:{copy_from:"Beállítások másolása innen"}},edit_area:{title:"Zóna szerkesztése: ''{area}''",name_warning:"Figyelem: a név megváltoztatása az entitás azonosítót is megváltoztatja."},remove_area:{title:"Zóna törlése?",description:"Biztosan törölni szeretnéd ezt a zónát? Ez a zóna {sensors} érzékelőt és {automations} automatizálást tartalmaz, amelyek szintén törölve lesznek."},edit_master:{title:"Főriasztó konfiguráció"},disable_master:{title:"Főriasztó letiltása?",description:"Biztosan le szeretnéd tiltani a főriasztót? Ez a zóna {automations} automatizálást tartalmaz, amelyek szintén törlésre kerülnek ezzel a művelettel."}}},sensors:{title:"Érzékelők",cards:{sensors:{description:"Jelenleg konfigurált érzékelők. Kattints egy elemre a szerkesztéshez.",table:{no_items:"Nincsenek megjeleníthető érzékelők.",no_area_warning:"Az érzékelő nincs hozzárendelve egyetlen zónához sem.",arm_modes:"Élesítési módok",always_on:"(Mindig aktív)"}},add_sensors:{title:"Érzékelők hozzáadása",description:"További érzékelők hozzáadása. Ügyelj arra, hogy az érzékelők neve jól azonosítható legyen.",no_items:"Nincs elérhető Home Assistant entitás, amely konfigurálható lenne a riasztóhoz. Győződj meg róla, hogy `binary_sensor` típusú entitások szerepelnek a rendszerben.",table:{type:"Észlelt típus"},actions:{add_to_alarm:"Hozzáadás a riasztóhoz",filter_supported:"Ismeretlen típusú elemek elrejtése"}},editor:{title:"Érzékelő szerkesztése",description:"A(z) ''{entity}'' érzékelő beállításainak konfigurálása.",fields:{entity:{heading:"Entitás",description:"Az érzékelőhöz tartozó entitás."},area:{heading:"Zóna",description:"Válaszd ki, melyik zónához tartozzon az érzékelő."},group:{heading:"Csoport",description:"Csoportosítsd más érzékelőkkel közös riasztási logikához."},device_type:{heading:"Eszköztípus",description:"Válassz eszköztípust az automatikus beállításokhoz.",choose:{door:{name:"Ajtó",description:"Bejárati ajtó, kapu vagy más nyílászáró, amelyen keresztül ki vagy be lehet jutni."},window:{name:"Ablak",description:"Ablak vagy olyan ajtó, amely nem szolgál fő bejáratként (pl. erkélyajtó)."},motion:{name:"Mozgásérzékelő",description:"Mozgás- vagy jelenlétérzékelő, amely aktiválás között késleltetéssel működik."},tamper:{name:"Szabotázsérzékelő",description:"Fedéllevétel-, üvegtörés- vagy más szabotázst jelző szenzor."},environmental:{name:"Környezeti érzékelő",description:"Füst-, gáz-, vízszivárgás-érzékelő (nem betörésvédelmi célra)."},other:{name:"Egyéb"}}},always_on:{heading:"Mindig aktív",description:"Az érzékelő minden esetben riasztást vált ki, függetlenül az élesítési módtól."},modes:{heading:"Aktív módok",description:"Azok az élesítési módok, amelyekben ez az érzékelő működésben van."},arm_on_close:{heading:"Élesítés zárás után",description:"Az érzékelő inaktiválódása (pl. ajtó becsukása) után a hátralévő kilépési késleltetés automatikusan átugrásra kerül."},use_exit_delay:{heading:"Kilépési késleltetés használata",description:"Az érzékelő akkor is aktív lehet, amikor a kilépési késleltetés elindul."},use_entry_delay:{heading:"Belépési késleltetés használata",description:"Az érzékelő aktiválása nem azonnali riasztást indít, hanem csak a belépési késleltetés lejárta után."},entry_delay:{heading:"Belépési késleltetés",description:"Cserélje le a késleltetést (a biztonsági módhoz beállított érték szerint) egy adott értékre."},delay_on:{heading:"Delay on",description:"Sensor must remain active for this duration before triggering. Resets if sensor deactivates."},allow_open:{heading:"Nyitott állapot engedélyezése induláskor",description:"Az érzékelő nyitott állapota élesítéskor figyelmen kívül marad – a későbbi aktiválása viszont riasztást vált ki."},auto_bypass:{heading:"Automatikus kizárás",description:"Ha az érzékelő nyitva van élesítéskor, automatikusan kizárásra kerül a riasztásból.",modes:"Módok, amelyekben az érzékelő kizárható"},trigger_unavailable:{heading:"Riasztás elérhetetlenség esetén",description:"Ha az érzékelő állapota 'nem elérhetővé' válik, az riasztást vált ki."}},actions:{toggle_advanced:"Speciális beállítások",remove:"Eltávolítás",setup_groups:"Csoportok beállítása"},errors:{description:"Kérlek javítsd az alábbi hibákat:",no_area:"Nincs kiválasztva zóna",no_modes:"Nincs beállítva élesítési mód, amelyben az érzékelő aktív lenne",no_auto_bypass_modes:"Nincs megadva, hogy mely módokban lehet az érzékelő automatikusan kizárva"}}},dialogs:{manage_groups:{title:"Érzékelőcsoportok kezelése",description:"Egy érzékelőcsoportban több érzékelő aktiválódásának kell bekövetkeznie egy meghatározott időn belül a riasztás kiváltásához.",no_items:"Még nincs létrehozott csoport.",actions:{new_group:"Új csoport létrehozása"}},create_group:{title:"Új érzékelőcsoport",fields:{name:{heading:"Név",description:"Az érzékelőcsoport megnevezése."},timeout:{heading:"Időkorlát",description:"Az az időintervallum (másodpercben), amelyen belül több érzékelőnek kell aktiválódnia a riasztás kiváltásához."},event_count:{heading:"Aktiválások száma",description:"Hány különböző érzékelő aktiválódása szükséges a riasztás elindításához."},sensors:{heading:"Érzékelők",description:"Válaszd ki azokat az érzékelőket, amelyek ehhez a csoporthoz tartoznak."}},errors:{invalid_name:"Érvénytelen csoportnév.",insufficient_sensors:"Legalább 2 érzékelőt ki kell választani a csoport létrehozásához."}},edit_group:{title:"Érzékelőcsoport szerkesztése: ''{name}''"}}},codes:{title:"Kódok",cards:{codes:{description:"A kódhasználat beállításai.",fields:{code_arm_required:{heading:"Kód megadása kötelező élesítéshez",description:"A riasztó élesítéséhez érvényes kód megadása szükséges."},code_disarm_required:{heading:"Kód megadása kötelező hatástalanításhoz",description:"A riasztó hatástalanításához érvényes kód megadása szükséges."},code_mode_change_required:{heading:"Kód szükséges módváltáshoz",description:"Az aktív élesítési mód módosításához érvényes kód megadása szükséges."},code_format:{heading:"Kód formátuma",description:"A Lovelace riasztókártyán használt bevitel típusa.",code_format_number:"Pin-kód",code_format_text:"Jelszó"}}},user_management:{title:"Felhasználók kezelése",description:"Minden felhasználó saját kóddal rendelkezik a riasztó élesítéséhez és hatástalanításához.",no_items:"Még nincs létrehozott felhasználó",actions:{new_user:"Új felhasználó"}},new_user:{title:"Új felhasználó létrehozása",description:"Hozz létre felhasználókat a riasztórendszer eléréséhez és vezérléséhez.",fields:{name:{heading:"Név",description:"A felhasználó neve."},code:{heading:"Kód",description:"A felhasználóhoz tartozó kód."},confirm_code:{heading:"Kód megerősítése",description:"A kód ismételt megadása a megerősítéshez."},can_arm:{heading:"Élesítés engedélyezése ezzel a kóddal",description:"Entering this code activates the alarm"},can_disarm:{heading:"Hatástalanítás engedélyezése ezzel a kóddal",description:"A kód beírásával a riasztó hatástalanítható"},is_override_code:{heading:"Kényszerített élesítési kód",description:"Ezzel a kóddal akkor is élesíthető a rendszer, ha nyitott érzékelők vannak (kényszerített élesítés)"},area_limit:{heading:"Zónakorlátozás",description:"A felhasználó csak a kiválasztott zónákhoz férhet hozzá."}},errors:{no_name:"Nincs megadva név.",no_code:"A kódnak legalább 4 karakter hosszúnak kell lennie.",code_mismatch:"A megadott kódok nem egyeznek."}},edit_user:{title:"Felhasználó szerkesztése",description:"A(z) ''{name}'' felhasználó beállításainak módosítása.",fields:{old_code:{heading:"Jelenlegi kód",description:"A jelenleg érvényes kód. Hagyd üresen, ha nem szeretnéd módosítani."}}}}},actions:{title:"Műveletek",cards:{notifications:{title:"Értesítések",description:"Ebben a panelben beállíthatod, hogy milyen riasztási eseményeknél küldjön a rendszer értesítést.",table:{no_items:"Még nincs létrehozva értesítés.",no_area_warning:"Ez a művelet nincs zónához rendelve."},actions:{new_notification:"Új értesítés"}},actions:{description:"Ez a panel lehetőséget ad eszközök (pl. lámpák, szirénák) vezérlésére a riasztórendszer állapotának változásakor.",table:{no_items:"Még nincs létrehozott művelet."},actions:{new_action:"Új művelet"}},new_notification:{title:"Értesítés beállítása",description:"Értesítés küldése a riasztó élesítése, hatástalanítása, riasztás aktiválása stb. esetén.",trigger:"Feltétel",action:"Művelet",options:"Lehetőségek",fields:{event:{heading:"Esemény",description:"Mely eseménykor küldjön a rendszer értesítést",choose:{armed:{name:"Riasztó élesítve",description:"A riasztó élesítve lett"},disarmed:{name:"Riasztó hatástalanítva",description:"A riasztó hatástalanítva lett"},triggered:{name:"A riasztó megszólalt",description:"A rendszer behatolást jelez"},untriggered:{name:"Riasztás megszűnt",description:"A riasztási állapot véget ért"},arm_failure:{name:"Élesítés sikertelen",description:"A riasztó nem tudott élesedni, mert egy vagy több érzékelő nyitva maradt"},arming:{name:"Kilépési késleltetés elindult",description:"A kilépési időzítő elindult, ideje elhagyni az otthont."},pending:{name:"Belépési késleltetés elindult",description:"A belépési időzítő elindult, hamarosan bekapcsol a riasztás."}}},mode:{heading:"Mód",description:"Korlátozza a műveletet meghatározott élesítési módokra (opcionális)"},title:{heading:"Cím",description:"Az értesítési üzenet címe"},message:{heading:"Üzenet",description:"Az értesítési üzenet szövege",insert_wildcard:"Változó beillesztése",placeholders:{armed:"A riasztó beállítva: {{arm_mode}} módba.",disarmed:"A riasztó kikapcsolt.",triggered:"Riasztáa! Ok: {{open_sensors}}.",untriggered:"A riasztási állapot megszűnt.",arm_failure:"A riasztó nem tudott élesedni. Ok: {{open_sensors}}.",arming:"A riasztó hamarosan élesítésre kerül, kérjük hagyd el az épületet.",pending:"A riasztás hamarosan aktiválódik, hatástalanítsd gyorsan!"}},open_sensors_format:{heading:"Az open_sensors változó formátuma",description:"Válaszd ki, milyen érzékelő-információ jelenjen meg az üzenetben",options:{default:"Nevek és állapotok",short:"Csak nevek"}},arm_mode_format:{heading:"arm_mode változó nyelve",description:"Válaszd ki, milyen nyelven jelenjen meg az élesítési mód az üzenetben"},target:{heading:"Cél",description:"Az eszköz, amelyre az értesítés érkezik"},media_player_entity:{heading:"Médialejátszó entitás",description:"Az a médialejátszó, amelyen az üzenet lejátszásra kerül"},name:{heading:"Név",description:"Leírás ehhez az értesítéshez",placeholders:{armed:"{target} értesítése élesítéskor",disarmed:"{target} értesítése hatástalanításkor",triggered:"{target} értesítése riasztás esetén",untriggered:"{target} értesítése amikor megszűnik a riasztás",arm_failure:"{target} értesítése élesítési hiba esetén",arming:"{target} értesítése kilépéskor",pending:"{target} értesítése érkezéskor"}},delete:{heading:"Automatizálás törlése",description:"Ez az automatizálás véglegesen törlésre kerül"}},actions:{test:"Próba"}},new_action:{title:"Művelet konfigurálása",description:"Világítás vagy eszköz (pl. sziréna) vezérlése a riasztó élesítése, hatástalanítása, vagy riasztás során.",fields:{event:{heading:"Esemény",description:"Melyik eseménykor hajtódjon végre a művelet"},area:{heading:"Zóna",description:"Az a zóna, amelyre az esemény és a művelet vonatkozik."},mode:{heading:"Mód",description:"Korlátozza a műveletet meghatározott élesítési módokra (opcionális)"},entity:{heading:"Entitás",description:"Az a Home Assistant entitás, amelyen a művelet végrehajtásra kerül"},action:{heading:"Név",description:"Leírás ehhez a művelethez",no_common_actions:"A kiválasztott entitásokhoz csak YAML módban rendelhetők műveletek."},name:{heading:"Név",description:"Leírás ehhez a művelethez",placeholders:{armed:"{entity} beállítása {state} állapotra élesítéskor",disarmed:"{entity} beállítása {state} állapotra hatástalanításkor",triggered:"{entity} beállítása {state} állapotra riasztás esetén",untriggered:"{entity} beállítása {state} állapotra riasztás megszűnésekor",arm_failure:"{entity} beállítása {state} állapotra élesítési hiba esetén",arming:"{entity} beállítása {state} állapotra távozáskor",pending:"{entity} beállítása {state} állapotra érkezéskor"}}}}}}},qt={common:Nt,components:Ht,title:Dt,panels:Pt},Bt=Object.freeze({__proto__:null,common:Nt,components:Ht,default:qt,panels:Pt,title:Dt}),It={modes_short:{armed_away:"Fuori casa",armed_home:"In casa",armed_night:"Notte",armed_custom_bypass:"Personalizzato",armed_vacation:"Vacanza"},enabled:"Abilitato",disabled:"Disabilitato"},Vt={time_picker:{seconds:"secondi",minutes:"minuti"},editor:{ui_mode:"Passa a UI",yaml_mode:"Passa a YAML",edit_in_yaml:"Modifica in YAML"},table:{filter:{label:"Filtra elementi",item:"Filtra per {name}",hidden_items:"{number} {number, plural,\n  one {item is}\n  other {items are}\n} hidden"}}},Rt="Pannello Allarme",Ut={general:{title:"Generale",cards:{general:{description:"Questo pannello definisce alcune impostazioni da applicare alle modalità di allarme.",fields:{disarm_after_trigger:{heading:"Disattiva allarme dopo l'attivazione",description:"Dopo che il tempo di attivazione è scaduto, disattivare l'allarme invece di tornare allo stato inserito."},ignore_blocking_sensors_after_trigger:{heading:"Ignora i sensori di blocco durante il riarmo",description:"Ritornare allo stato armato senza controllare i sensori che potrebbero essere ancora attivi."},enable_mqtt:{heading:"Abilita MQTT",description:"Permetti al pannello allarme di essere controllato attraverso MQTT."},enable_master:{heading:"Abilita Allarme Master",description:"Crea una entità per controllare tutte le aree simultaneamente."}},actions:{setup_mqtt:"Configurazione MQTT",setup_master:"Configurazione Master"}},modes:{title:"Modalità",description:"Questo pannello può essere usato per impostare le modalità dell'allarme.",modes:{armed_away:"Modalità 'fuori casa': da utilizzare quando tutte le persone lasciano la casa. Tutti i sensori di porte e finestre che consentono l'accesso alla casa saranno attivi, così come i sensori di movimento all'interno della casa.",armed_home:"Modalità 'in casa': da utilizzare quando si attiva l'allarme mentre le persone sono in casa. Tutti i sensori di porte e finestre che consentono l'accesso alla casa saranno attivi, ma non i sensori di movimento all'interno della casa.",armed_night:"Modalità 'notte': da utilizzare quando si imposta la sveglia prima di andare a dormire. Tutti i sensori di porte e finestre che consentono l'accesso alla casa saranno attivi e sensori di movimento selezionati (ad esempio al piano di sotto) nella casa.",armed_vacation:"Modalità 'vacanza': da utlizzare come estensione della modalità 'fuori casa' in caso di assenza prolungata. I ritardi e i tempi di attivazione possono essere adattati per essere distanti da casa.",armed_custom_bypass:"Modalità 'personalizzato': da utilizzare per definire una modalità di allarme specifica per le esigenze dell'utilizzatore."},number_sensors_active:"{number} {number, plural,\n  one {sensor}\n  other {sensors}\n} active",fields:{status:{heading:"Stato",description:"Definisce quando l'allarme può essere armato in questa modalità."},exit_delay:{heading:"Tempo di preattivazione",description:"Quando si attiva l'allarme, entro questo periodo di tempo i sensori non attiveranno ancora l'allarme."},entry_delay:{heading:"Ritardo di attivazione",description:"Tempo di ritardo fino allo scatto dell'allarme dopo l'attivazione di uno dei sensori."},trigger_time:{heading:"Tempo di attivazione",description:"Tempo durante il quale suonerà la sirena."}}},mqtt:{title:"Configurazione MQTT",description:"Questo pannello può essere usato per le impostazioni MQTT.",fields:{state_topic:{heading:"Topic di stato",description:"Topic su cui vengono pubblicati gli aggiornamenti di stato"},event_topic:{heading:"Event topic",description:"opic su cui vengono pubblicati gli eventi"},command_topic:{heading:"Topic di comando",description:"Topic su cui vengono inviati i comandi di inserimento / disinserimento."},require_code:{heading:"Richiedi Codice",description:"Richiedi il codice da inviare con il comando."},state_payload:{heading:"Configura payload per stato",item:"Definisci un payload per lo stato ''{state}''"},command_payload:{heading:"Configura payload per comando",item:"Definisci un payload per il comando ''{command}''"}}},areas:{title:"Aree",description:"Le aree possono essere utilizzate per dividere il tuo allarme in più sezioni.",no_items:"Non ci sono ancora aree definite.",table:{remarks:"Commenti",summary:"Questa area contiene {summary_sensors} e {summary_automations}.",summary_sensors:"{number} {number, plural,\n  one {sensor}\n  other {sensors}\n}",summary_automations:"{number} {number, plural,\n  one {automation}\n  other {automations}\n}"},actions:{add:"Aggiungi"}}},dialogs:{create_area:{title:"Nuova area",fields:{copy_from:"Copia impostazioni da"}},edit_area:{title:"Modifica Area ''{area}''",name_warning:"Nota: cambiare il nome modificherà l'entity ID"},remove_area:{title:"Rimuovi Area?",description:"Sei sicuro che vuoi rimuovere questa area? Questa area contiene {sensors} sensori e {automations} automazioni, che verranno anch'esse rimossi."},edit_master:{title:"Configura Master"},disable_master:{title:"Disabilita Master?",description:"Sei sicuro che vuoi rimuovere l'allarme master? Questa area contiene {automations} automazioni, che verranno eliminate con questa azione."}}},sensors:{title:"Sensori",cards:{sensors:{description:"Sensori attualmente configurati. Clicca sull'entità per modificare.",table:{no_items:"Non ci sono ancora sensori aggiunti a questo allarme. Assicurati di aggiungerli prima.",no_area_warning:"Sensore non assegnato a nessuna area.",arm_modes:"Modalità di attivazione",always_on:"(Sempre)"}},add_sensors:{title:"Aggiungi Sensori",description:"Aggiungi più sensori. Assicurati che i sensori abbiano un friendly_name (nome amichevole), in modo da identificarli più facilmente.",no_items:"Non ci sono entità disponibili che possono essere configurate con l'allarme. Assicurati di includere entità del tipo binary_sensor (sensore binario).",table:{type:"Tipologia Innesco"},actions:{add_to_alarm:"Aggiungi all'allarme",filter_supported:"Nascondi elementi con tipologia sconosciuta"}},editor:{title:"Modifica Sensore",description:"Configura le impostazioni del sensore ''{entity}''.",fields:{entity:{heading:"Entità",description:"Entità associata a questo sensore"},area:{heading:"Area",description:"Seleziona una area che contiene questo sensore."},group:{heading:"Gruppo",description:"Raggruppa con altri sensori per inneschi combinati."},device_type:{heading:"Tipologia Dispositivo",description:"Scegli la tipologia del dispositivo per applicare le impostazioni appropriate.",choose:{door:{name:"Porta",description:"Una porta, cancello o altro ingresso che è usato per entrare/lasciare casa."},window:{name:"Finestra",description:"Una finestra, o una porta-finestra non usata per accedere alla casa."},motion:{name:"Movimento",description:"Sensore di presenza o simile che ha un ritardo tra le attivazioni."},tamper:{name:"Vibrazione",description:"Rilaveamento di vibrazione, rottura vetri, ecc."},environmental:{name:"Ambientale",description:"Rilevatori fumo/gas, ecc. (non correlati alla protezione intrusi)."},other:{name:"Generico"}}},always_on:{heading:"Sempre attivo",description:"Il sensore attiverà sempre l'allarme."},modes:{heading:"Modalità attive",description:"Modalità di allarme in cui il sensore risulta collegato."},arm_on_close:{heading:"Attiva dopo chisura",description:"Dopo la disattivazione di questo sensore il ritardo rimanente verrà automaticamente ignorato."},use_exit_delay:{heading:"Usa ritardo d'uscita",description:"Sensore che può rimanre attivo mentre il ritardo di uscita è in corso."},use_entry_delay:{heading:"Usa ritardo in ingresso",description:"Sensore che innesca l'allarme dopo il ritardo in ingresso anzichè direttamente."},entry_delay:{heading:"Ritardo di ingresso",description:"Sostituire il ritardo (impostato per la modalità di sicurezza) con un valore specifico."},delay_on:{heading:"Delay on",description:"Sensor must remain active for this duration before triggering. Resets if sensor deactivates."},allow_open:{heading:"Permetti apertura",description:"Consentire a questo sensore di rimanere attivo poco dopo essere usciti."},auto_bypass:{heading:"Esclusione automatica",description:"Escludi questo sensore dall'allarme se è aperto durante l'attivazione.",modes:"Modalità in cui il sensore può essere escluso"},trigger_unavailable:{heading:"Fai scattare l'allarme quando non disponibile",description:"L'allarme scatterà quando lo stato del sensore diverrà 'non disponibile'."}},actions:{toggle_advanced:"Impostazione avanzate",remove:"Rimuovi",setup_groups:"Configurazione gruppi"},errors:{description:"Per favore correggi i seguenti errori:",no_area:"Nessuna area è selezionata",no_modes:"Nessuna modalità è selezionata per la quale il sensore dovrebbe essere attivo",no_auto_bypass_modes:"Nessuna modalità è selezionata per il sensore che può essere automaticamente escluso"}}},dialogs:{manage_groups:{title:"Gestisci gruppi sensori",description:"In un gruppo sensori più sensori devono essere attivi in un intevallo di tempo prima che l'allarme sia innescato.",no_items:"Nessun gruppo",actions:{new_group:"Nuovo gruppo"}},create_group:{title:"Nuovo gruppo sensori",fields:{name:{heading:"Nome",description:"Nome del gruppo sensori"},timeout:{heading:"Time-out",description:"Periodo di tempo durante il quale l'attivazione consecutiva innesca l'allarme."},event_count:{heading:"Numero",description:"Quantità di sensori diversi che devono essere attivati per attivare l'allarme."},sensors:{heading:"Sensori",description:"Seleziona i sensori che fanno parte di questo gruppo."}},errors:{invalid_name:"Nome non valido.",insufficient_sensors:"Almeno 2 sensori devono essere selezionati."}},edit_group:{title:"Modifica gruppo sensori ''{name}''"}}},codes:{title:"Codici",cards:{codes:{description:"Modifica le impostazioni dei codici.",fields:{code_arm_required:{heading:"Usa codice d'attivazione",description:"Richiedi un codice per attivare l'allarme"},code_disarm_required:{heading:"Usa codice di disattivazione",description:"Richiedi un codice per disattivare l'allarme"},code_mode_change_required:{heading:"Richiede il codice per cambiare modalità",description:"È necessario fornire un codice valido per modificare la modalità di inserimento attiva."},code_format:{heading:"Formato del codice",description:"Imposta il tipo di codice da digitare nella card di Lovelace.",code_format_number:"Codice numerico",code_format_text:"Password"}}},user_management:{title:"Gestione utente",description:"Ogni utente ha il suo codice per attivare/disattivare l'allarme.",no_items:"Non è stato ancora creato nessun utente.",actions:{new_user:"Nuovo utente"}},new_user:{title:"Crea nuovo utente",description:"Gli utenti potranno operare con l'allarme.",fields:{name:{heading:"Nome",description:"Nome dell'utente."},code:{heading:"Codice operativo",description:"Codice che utilizzerà quest'utente."},confirm_code:{heading:"Ripeti codice operativo",description:"Ripeti il codice operativo scelto."},can_arm:{heading:"Utilizza codice per attivare l'allarme",description:"Utilizza codice per attivare l'allarme"},can_disarm:{heading:"Utilizza codice per disattivare l'allarme",description:"Utilizza codice per disattivare l'allarme"},is_override_code:{heading:"E' un codice di forzatura",description:"Inserendo questo codice forzerai lo stato di attivazione dell'allarme"},area_limit:{heading:"Aree riservate areas",description:"Limita l'utente a controllare solo le aree selezionate"}},errors:{no_name:"Non hai inserito il nome.",no_code:"Il codice deve avere almeno 4 numeri o caratteri.",code_mismatch:"Il codice scelto non combacia, verifica il codice inserito."}},edit_user:{title:"Modifica Utente",description:"Cambia impostazioni per l'utente ''{name}''.",fields:{old_code:{heading:"Modifica Codice",description:"Codice attuale, lascia vuoto per non modificare."}}}}},actions:{title:"Azioni",cards:{notifications:{title:"Notifiche",description:"Con questo pannello puoi gestire le notifiche da inviare quanto accade un determinato evento",table:{no_items:"Non è stata ancora creata nessuna notifica.",no_area_warning:"Azione non assegnata a nessuna."},actions:{new_notification:"Nuova notifica"}},actions:{description:"Questo pannello può essere usato per cambiare lo stato di una o più entità.",table:{no_items:"Non è stata ancora creata nessuna azione."},actions:{new_action:"Nuova azione"}},new_notification:{title:"Crea notifica",description:"Crea una nuova notifica.",trigger:"Condizione",action:"Azione",options:"Opzioni",fields:{event:{heading:"Evento",description:"Quando questa notifica deve essere inviata",choose:{armed:{name:"Allarme attivato",description:"L'allarme è attivo"},disarmed:{name:"Allarme disattivato",description:"L'allarme è disattivato"},triggered:{name:"Allarme innescato",description:"L'allarme è innescato"},untriggered:{name:"Allarme non innescato",description:"L'allarme non è più innescato"},arm_failure:{name:"Impossibile attivare",description:"L'attivazione dell'allarme non è riuscita a casa di uno o più sensori aperti"},arming:{name:"Ritardo d'uscita partito",description:"Ritardo d'uscita partito, preparati a lasciare la casa."},pending:{name:"Ritardo in ingresso partito",description:"Ritardo in ingresso partito, l'allarme verrà innescato a breve."}}},mode:{heading:"Modalità",description:"Limita ad una specifica modalità di allarme (opzionale)"},title:{heading:"Titolo",description:"Titolo per il messaggio di notifica"},message:{heading:"Messaggio",description:"Contenuto del messaggio di notifica",insert_wildcard:"Inserisci wildcard",placeholders:{armed:"L'allarme è impostato in {{arm_mode}}",disarmed:"L'allarme è disattivatoF",triggered:"L'allarme è stato innescato! Causa: {{open_sensors}}.",untriggered:"The alarm is not longer triggered.",arm_failure:"L'allarme non può essere attivato adesso. Causa: {{open_sensors}}.",arming:"L'allarme verrà attivato a breve, per favore lascia la casa.",pending:"L'allarme sta per essere innescato, disattivalo velocemente!"}},open_sensors_format:{heading:"Formato per la wildcard open_sensors",description:"Scegli quale informazione è inserita nel messaggio",options:{default:"Nomi e stati",short:"Nomi soltanto"}},arm_mode_format:{heading:"Traduzione per le wildcard per arm_mode",description:"Scegli la lingua in cui è scritto il messaggio"},target:{heading:"Destinatario",description:"Dispositivo a cui inviare il messaggio di notifica"},media_player_entity:{heading:"Entità lettore multimediale",description:"Lettori multimediali per riprodurre il messaggio."},name:{heading:"Nome",description:"Descrizione della notifica",placeholders:{armed:"Notifica {target} in attivazione",disarmed:"Notifica {target} in disattivazione",triggered:"Notifica {target} quando innescato",untriggered:"Notifica {target} quando l'innesco termina",arm_failure:"Notifica {target} quando impossibile attivare",arming:"Notifica {target} in uscita",pending:"Notifica {target} in ingresso"}},delete:{heading:"Elimina automazione",description:"Elimina l'automazione permanentemente"}},actions:{test:"Prova"}},new_action:{title:"Crea azione",description:"Questo pannello può essere usato per cambiare lo stato di un entità quando lo stato dell'allarme cambia.",fields:{event:{heading:"Evento",description:"Quando questa azione deve essere eseguita"},area:{heading:"Area",description:"Area nella quale l'evento avviene."},mode:{heading:"Modalità",description:"Limita ad una specifica modalità di allarme (opzionale)"},entity:{heading:"Entità",description:"Entità su cui eseguire l'azione"},action:{heading:"Azione",description:"Azione che deve eseguire l'entità",no_common_actions:"Le azioni possono essere definite solo in YAML mode per le entità selezionate."},name:{heading:"Nome",description:"Descrizione dell'azione",placeholders:{armed:"Imposta {entity} su {state} in attivazione",disarmed:"Imposta {entity} su {state} in disattivazione",triggered:"Imposta {entity} su {state} in innesco",untriggered:"Imposta {entity} su {state} quando l'innesco termina",arm_failure:"Imposta {entity} su {state} quando è impossibile attivare",arming:"Imposta {entity} su {state} in uscita",pending:"Imposta {entity} su {state} in entrata"}}}}}}},Gt={common:It,components:Vt,title:Rt,panels:Ut},Ft=Object.freeze({__proto__:null,common:It,components:Vt,default:Gt,panels:Ut,title:Rt}),Kt={modes_short:{armed_away:"Afwezig",armed_home:"Thuis",armed_night:"Nacht",armed_custom_bypass:"Aangepast",armed_vacation:"Vakantie"},enabled:"Actief",disabled:"Inactief"},Zt={time_picker:{seconds:"seconden",minutes:"minuten"},editor:{ui_mode:"Naar UI",yaml_mode:"Naar YAML",edit_in_yaml:"In YAML bewerken"},table:{filter:{label:"Items filteren",item:"Filter op {name}",hidden_items:"{number} {number, plural,\n  one {item is}\n  other {items zijn}\n} verborgen"}}},Wt="Alarmpaneel",Yt={general:{title:"Algemeen",cards:{general:{description:"Dit paneel definieert enkele instellingen die van toepassing zijn op alle inschakelmodi.",fields:{disarm_after_trigger:{heading:"Uitschakelen na activatie",description:"Nadat de triggertijd is verstreken, schakelt u het alarm uit in plaats van terug te keren naar de ingeschakelde toestand."},ignore_blocking_sensors_after_trigger:{heading:"Negeer blokkerende sensoren bij het opnieuw inschakelen",description:"Alarm wordt teruggezet naar ingeschakelde status zonder te controleren of er nog sensoren actief zijn."},enable_mqtt:{heading:"MQTT inschakelen",description:"Toestaan het alarmpaneel via MQTT aan te sturen."},enable_master:{heading:"Master alarm inschakelen",description:"Creëert een entiteit om alle gebieden tegelijkertijd te besturen."}},actions:{setup_mqtt:"MQTT Configuratie",setup_master:"Master configuratie"}},modes:{title:"Beveiligingsmodi",description:"Dit paneel kan worden gebruikt om de beveiligingsmodi van het alarm in te stellen.",modes:{armed_away:"De afwezigheidsmodus wordt gebruikt als alle mensen het huis hebben verlaten. Alle deuren en ramen die toegang geven tot het huis worden bewaakt, evenals bewegingssensoren in het huis.",armed_home:"De thuismodus wordt gebruikt bij het instellen van het alarm terwijl er mensen in huis zijn. Alle deuren en ramen die toegang geven tot het huis worden bewaakt, maar bewegingssensoren in het huis worden niet gebruikt.",armed_night:"De nachtmodus wordt gebruikt bij het instellen van het alarm voordat u gaat slapen. Alle deuren en ramen die toegang geven tot het huis worden bewaakt, en geselecteerde bewegingssensoren (beneden) in het huis.",armed_vacation:"De vakantiemodus dient voor afwezigheid voor langere duur. Er kunnen desgewenst andere vertragingstijden en acties worden ingesteld die beter passen bij de situatie.",armed_custom_bypass:"Een extra modus om uw eigen beveiligingsperimeter te definiëren."},number_sensors_active:"{number} {number, plural,\n  one {sensor}\n  other {sensoren}\n} ingesteld",fields:{status:{heading:"Status",description:"Stel in of het alarm op deze modus kan worden ingesteld."},exit_delay:{heading:"Vertrek vertraging",description:"Bij het inschakelen van het alarm zullen de sensoren binnen deze tijdsperiode het alarm nog niet activeren."},entry_delay:{heading:"Binnenkomst vertraging",description:"Vertragingstijd totdat het alarm afgaat nadat een van de sensoren is geactiveerd."},trigger_time:{heading:"Activatie tijd",description:"Tijd waarin het alarm in de geactiveerde toestand blijft na activatie."}}},mqtt:{title:"MQTT configuratie",description:"Dit paneel kan worden gebruikt voor configuratie van de MQTT-interface.",fields:{state_topic:{heading:"Toestand topic",description:"Topic waarop statusupdates worden gepubliceerd"},event_topic:{heading:"Gebeurtenis topic",description:"Topic waarop gebeurtenissen worden gepubliceerd"},command_topic:{heading:"Commando topic",description:"Topic waarop commando's voor in- / uitschakelen worden verzonden."},require_code:{heading:"Vereis code",description:"Vereis dat de code wordt verzonden met de opdracht."},state_payload:{heading:"Configureer de payload per toestand",item:"Definieer een payload voor toestand ''{state}''"},command_payload:{heading:"Configureer een payload per commando",item:"Definieer een payload voor commando ''{command}''"}}},areas:{title:"Gebieden",description:"Gebieden kunnen worden gebruikt om uw alarmsysteem in meerdere compartimenten op te delen.",no_items:"Er zijn nog geen gebieden gedefinieerd.",table:{remarks:"Opmerkingen",summary:"Dit gebied bevat {summary_sensors} en {summary_automations}.",summary_sensors:"{number} {number, plural,\n  one {sensor}\n  other {sensoren}\n}",summary_automations:"{number} {number, plural,\n  one {automatisering}\n  other {automatiseringen}\n}"},actions:{add:"Toevoegen"}}},dialogs:{create_area:{title:"Nieuw gebied",fields:{copy_from:"Kopieer instellingen van"}},edit_area:{title:"Bewerken van gebied ''{area}''",name_warning:"Opmerking: als u de naam wijzigt, wordt de entiteits-ID gewijzigd"},remove_area:{title:"Gebied verwijderen?",description:"Weet u zeker dat u dit gebied wilt verwijderen? Dit gebied bevat {sensors} sensoren en {automations} automatiseringen, die ook zullen worden verwijderd."},edit_master:{title:"Master configuratie"},disable_master:{title:"Master uitschakelen?",description:"Weet u zeker dat u het master alarm wilt verwijderen? Dit gebied bevat {automations} automatiseringen, die met deze actie worden verwijderd."}}},sensors:{title:"Sensoren",cards:{sensors:{description:"Momenteel geconfigureerde sensoren. Klik op een entiteit om wijzigingen aan te brengen.",table:{no_items:"Er zijn nog geen sensoren aan het alarm toegevoegd. Zorg ervoor dat u ze eerst toevoegt.",no_area_warning:"Sensor is niet aan een gebied toegewezen.",arm_modes:"Inschakelmodi",always_on:"(Altijd)"}},add_sensors:{title:"Voeg sensoren toe",description:"Voeg meer sensoren toe. Zorg ervoor dat uw sensoren een duidelijke naam hebben, zodat u ze kunt identificeren.",no_items:"Er zijn geen beschikbare HA-entiteiten die voor het alarm kunnen worden geconfigureerd. Zorg ervoor dat u entiteiten van het type binary_sensor opneemt.",table:{type:"Gedetecteerd type"},actions:{add_to_alarm:"Voeg aan alarm toe",filter_supported:"Verberg items met onbekend type"}},editor:{title:"Wijzig Sensor",description:"Configureren van de sensorinstellingen van ''{entity}''.",fields:{entity:{heading:"Entiteit",description:"Entiteit die verwant is aan deze sensor"},area:{heading:"Gebied",description:"Selecteer een gebied dat deze sensor bevat."},group:{heading:"Groep",description:"Groepeer met andere sensors voor gecombineerde triggers."},device_type:{heading:"Apparaat Type",description:"Kies een apparaattype om automatisch de juiste instellingen toe te passen.",choose:{door:{name:"Deur",description:"Een deur, poort of andere ingang die wordt gebruikt voor het betreden/verlaten van de woning."},window:{name:"Raam",description:"Een raam of een deur die niet wordt gebruikt om het huis binnen te komen, zoals een balkon."},motion:{name:"Beweging",description:"Aanwezigheidssensor of soortgelijk apparaat met een vertraging tussen activeringen."},tamper:{name:"Sabotage",description:"Detector van verwijdering van sensorkap, glasbreuksensor, enz."},environmental:{name:"Klimaat",description:"Rook/gassensor, lekkage detector, etc. (niet gerelateerd aan inbraakbeveiliging)."},other:{name:"Algemeen"}}},always_on:{heading:"Altijd aan",description:"Een sensor moet altijd het alarm activeren."},modes:{heading:"Ingeschakelde modi",description:"Alarmmodi waarin deze sensor actief is."},arm_on_close:{heading:"Inschakelen na sluiten",description:"Na deactivering van deze sensor wordt de resterende vertrek vertraging automatisch overgeslagen."},use_exit_delay:{heading:"Gebruik vertrek vertraging",description:"De sensor mag actief zijn wanneer de vertrekperiode wordt gestart."},use_entry_delay:{heading:"Gebruik binnenkomst vertraging",description:"Als de sensor actief wordt, activeert deze het alarm pas na de vertragingstijd voor binnenkomst."},entry_delay:{heading:"Binnenkomst vertraging",description:"Vervang de vertraging (zoals ingesteld voor de beveiligingsmodus) door een specifieke waarde."},delay_on:{heading:"Filtertijd",description:"Minimale tijdsduur dat de sensor actief moet zijn om het alarm te activeren."},allow_open:{heading:"Actieve toestand toestaan bij inschakelen",description:"Initiële toestand bij inschakelen van het alarm wordt genegeerd."},auto_bypass:{heading:"Automatisch omzeilen",description:"Elimineer de sensor als deze actief is tijdens het inschakelen van het alarm.",modes:"Modi waarin de sensor automatisch omzeild mag worden"},trigger_unavailable:{heading:"Activeren indien niet beschikbaar",description:"Wanneer de sensorstatus 'niet beschikbaar' wordt, wordt de sensor geactiveerd."}},actions:{toggle_advanced:"Geavanceerde instellingen",remove:"Verwijder",setup_groups:"Configureer groepen"},errors:{description:"Corrigeer de volgende fouten:",no_area:"Er is geen gebied geselecteerd",no_modes:"Er zijn geen modi geselecteerd waarvoor de sensor actief zou moeten zijn",no_auto_bypass_modes:"Er zijn geen modi geselecteerd waarin de sensor automatisch omzeild mag worden"}}},dialogs:{manage_groups:{title:"Beheer sensorgroepen",description:"In een sensorgroep moeten twee of meer sensoren worden geactiveerd binnen een tijdsperiode voordat het alarm wordt geactiveerd.",no_items:"Nog geen groepen ingesteld.",actions:{new_group:"Nieuwe groep"}},create_group:{title:"Nieuwe sensorgroep",fields:{name:{heading:"Naam",description:"Naam voor sensorgroep."},timeout:{heading:"Time-out",description:"Tijdsperiode waarin meerdere sensoren moeten worden geactiveerd om het alarm te activeren."},event_count:{heading:"Aantal",description:"Aantal verschillende sensoren dat moet worden geactiveerd om het alarm te activeren."},sensors:{heading:"Sensoren",description:"Selecteer de sensoren die deel moeten uitmaken van deze groep."}},errors:{invalid_name:"Verkeerde naam opgegeven.",insufficient_sensors:"Tenminste 2 sensoren moeten worden geselecteerd."}},edit_group:{title:"Bewerk sensorgroep ''{name}''"}}},codes:{title:"Codes",cards:{codes:{description:"Wijzig de instellingen voor de code.",fields:{code_arm_required:{heading:"Vereis code voor inschakelen",description:"Een correcte code moet worden ingevoerd om het alarm te kunnen inschakelen."},code_disarm_required:{heading:"Vereis code voor uitschakelen",description:"Een correcte code moet worden ingevoerd om het alarm te kunnen uitschakelen."},code_mode_change_required:{heading:"Vereis code voor mode omschakeling",description:"Een correcte code moet worden ingevoerd om de actieve beveiligingsmodus te veranderen."},code_format:{heading:"Code opmaak",description:"Stelt het invoertype in voor de Lovelace alarmkaart.",code_format_number:"Pincode",code_format_text:"Wachtwoord"}}},user_management:{title:"Gebruikersbeheer",description:"Elke gebruiker heeft zijn eigen code om het alarm in/uit te schakelen.",no_items:"Er zijn nog geen gebruikers",actions:{new_user:"Nieuwe gebruiker"}},new_user:{title:"Maak een nieuwe gebruiker aan",description:"Gebruikers kunnen worden aangemaakt om toegang te verlenen tot het bedienen van het alarm.",fields:{name:{heading:"Naam",description:"Naam van de gebruiker."},code:{heading:"Code",description:"Code voor deze gebruiker."},confirm_code:{heading:"Bevestig de code",description:"Herhaal de code."},can_arm:{heading:"Code toestaan voor inschakeling",description:"Door deze code in te voeren, wordt het alarm geactiveerd"},can_disarm:{heading:"Code toestaan voor uitschakelen",description:"Door deze code in te voeren, wordt het alarm gedeactiveerd"},is_override_code:{heading:"Is een forceer code",description:"Als u deze code invoert, wordt het alarm geforceerd geactiveerd"},area_limit:{heading:"Beperk gebieden",description:"Beperk de gebruiker tot controle over alleen de gelesecteerde gebieden"}},errors:{no_name:"Geen naam opgegeven.",no_code:"Code moet minimaal 4 tekens/cijfers bevatten.",code_mismatch:"De codes komen niet overeen."}},edit_user:{title:"Wijzig Gebruiker",description:"Wijzig de configuratie voor gebruiker ''{name}''.",fields:{old_code:{heading:"Huidige code",description:"Huidige code, laat leeg om ongewijzigd te laten."}}}}},actions:{title:"Acties",cards:{notifications:{title:"Notificaties",description:"Met dit paneel kunt u meldingen beheren die moeten worden verzonden tijdens een bepaalde alarmgebeurtenis",table:{no_items:"Er zijn nog geen notificaties aangemaakt.",no_area_warning:"Actie is niet toegewezen aan een gebied."},actions:{new_notification:"Nieuwe notificatie"}},actions:{description:"Dit paneel kan worden gebruikt om een apparaat te schakelen wanneer de status van het alarm veranderd.",table:{no_items:"Er zijn nog geen acties gemaakt."},actions:{new_action:"Nieuwe actie"}},new_notification:{title:"Notificatie instellen",description:"Ontvang een notificatie wanneer het alarm wordt in- of uitgeschakeld, wordt geactiveerd etc.",trigger:"Conditie",action:"Taak",options:"Opties",fields:{event:{heading:"Gebeurtenis",description:"Wanneer moet de notificatie worden verzonden",choose:{armed:{name:"Alarm is ingeschakeld",description:"Het alarm is succesvol ingeschakeld"},disarmed:{name:"Alarm is uitgeschakeld",description:"Het alarm is uitgeschakeld"},triggered:{name:"Alarm is afgegaan",description:"Het alarm gaat af"},untriggered:{name:"Gestopt na afgaan",description:"Het alarm gaat niet meer af"},arm_failure:{name:"Kan niet inschakelen",description:"Het inschakelen van het alarm is mislukt vanwege een of meerdere blokkerende sensoren"},arming:{name:"Vertrek",description:"Vertrekvertraging ingegaan, tijd om het huis te verlaten."},pending:{name:"Binnenkomst",description:"Binnenkomstvertraging ingegaan, het alarm dient te worden uitgeschakeld."}}},mode:{heading:"Modi",description:"Beperk de actie tot specifieke inschakel modi."},title:{heading:"Titel",description:"Titel voor de notificatie"},message:{heading:"Bericht",description:"Tekst voor de notificatie",insert_wildcard:"Wildcard invoegen",placeholders:{armed:"Het alarm is ingeschakeld op {{arm_mode}}",disarmed:"Het alarm is nu uit",triggered:"Het alarm is geactiveerd! Oorzaak: {{open_sensors}}.",untriggered:"The alarm gaat niet langer af.",arm_failure:"Het alarm kon niet worden ingeschakeld. Oorzaak: {{open_sensors}}.",arming:"Het alarm wordt ingeschakeld, verlaat het huis.",pending:"Het alarm moet nu worden uitgeschakeld, anders wordt deze geactiveerd."}},open_sensors_format:{heading:"Opmaak voor open_sensors wildcard",description:"Kies welke sensor informatie wordt weergegeven in het bericht",options:{default:"Naam en status",short:"Alleen naam"}},arm_mode_format:{heading:"Vertaling voor arm_mode wildcard",description:"Kies in welke taal de inschakelmodus wordt weergegeven in het bericht"},target:{heading:"Doel",description:"Apparaat om het push-bericht naar te sturen"},media_player_entity:{heading:"Mediaspeler entiteit",description:"Mediaspeler om het bericht af te spelen."},name:{heading:"Naam",description:"Beschrijving voor deze notificatie",placeholders:{armed:"Stuur notificatie naar {target} bij inschakelen",disarmed:"Stuur notificatie naar {target} bij uitschakelen",triggered:"Stuur notificatie naar {target} bij alarm",untriggered:"Stuur notificatie naar {target} als het alarm stopt met afgaan",arm_failure:"Stuur notificatie naar {target} bij fout",arming:"Stuur notificatie naar {target} bij vertrek",pending:"Stuur notificatie naar {target} bij binnenkomst"}},delete:{heading:"Automatisering verwijderen",description:"Verwijder deze automatisering permanent"}},actions:{test:"Testen"}},new_action:{title:"Actie instellen",description:"Schakel verlichting of apparaatuur (bijv. sirene) wanneer het alarm wordt in- of uitgeschakeld of wordt geactiveerd etc.",fields:{event:{heading:"Gebeurtenis",description:"Wanneer moet de actie worden uitgevoerd"},area:{heading:"Gebied",description:"Het gebied waarop de gebeurtenis van toepassing is."},mode:{heading:"Mode",description:"Beperk de actie tot specifieke inschakel modi (optioneel)"},entity:{heading:"Entiteit",description:"Entiteit om actie op uit te voeren"},action:{heading:"Actie",description:"Actie die op de entiteit moet worden uitgevoerd",no_common_actions:"Acties kunnen alleen worden toegewezen in de YAML modus voor de geselecteerde entiteiten."},name:{heading:"Naam",description:"Beschrijving voor deze actie",placeholders:{armed:"Schakel {entity} naar {state} bij inschakelen",disarmed:"Schakel {entity} naar {state} bij uitschakelen",triggered:"Schakel {entity} naar {state} bij alarm",untriggered:"Set {entity} to {state} when triggering stops",arm_failure:"Schakel {entity} naar {state} bij fout",arming:"Schakel {entity} naar {state} bij vertrek",pending:"Schakel {entity} naar {state} bij binnenkomst"}}}}}}},Qt={common:Kt,components:Zt,title:Wt,panels:Yt},Jt=Object.freeze({__proto__:null,common:Kt,components:Zt,default:Qt,panels:Yt,title:Wt}),Xt={modes_short:{armed_away:"Preč",armed_home:"Doma",armed_night:"Noc",armed_custom_bypass:"Vlastné",armed_vacation:"Dovolenka"},enabled:"Aktivovaný",disabled:"Deaktivovaný"},ea={time_picker:{seconds:"sekundy",minutes:"minúty"},editor:{ui_mode:"Do UI",yaml_mode:"Do YAML",edit_in_yaml:"Upraviť v YAML"},table:{filter:{label:"Filtrovať položky",item:"Filter podľa {name}",hidden_items:"{number} {number, plural,\n  jeden {item is}\n  other {items are}\n} skriť"}}},ta="Alarový panel",aa={general:{title:"Hlavný",cards:{general:{description:"Tento panel definuje niektoré globálne nastavenia pre alarm.",fields:{disarm_after_trigger:{heading:"Deaktivujte po spustení",description:"Po uplynutí času spustenia alarm namiesto návratu do stráženého stavu deaktivujte."},ignore_blocking_sensors_after_trigger:{heading:"Ignorovať blokujúce senzory počas opätovného zapínania stráženia",description:"Návrat do zapnutého stavu bez kontroly senzorov, ktoré môžu byť stále aktívne."},enable_mqtt:{heading:"Povoliť MQTT",description:"Umožnite, aby bol panel alarmu ovládaný cez MQTT."},enable_master:{heading:"Povoliť hlavný alarm",description:"Vytvorí entitu na kontrolu všetkých oblastí súčasne."}},actions:{setup_mqtt:"MQTT Konfigurácia",setup_master:"Hlavná konfigurácia"}},modes:{title:"Režimy",description:"Tento panel možno použiť na nastavenie režimov stráženia alarmu.",modes:{armed_away:"Aktivovaný preč sa použije, keď všetci ľudia opustia dom. Všetky dvere a okná umožňujúce vstup do domu budú strážené, ako aj pohybové senzory vo vnútri domu.",armed_home:"Aktivovaný doma (známy aj ako zabezpečený pobyt) sa použije pri nastavovaní alarmu, keď sú ľudia v dome. Strážené budú všetky dvere a okná umožňujúce vstup do domu, nie však pohybové senzory vo vnútri domu.",armed_night:"Aktivovaný noc sa použije pri nastavovaní alarmu pred spaním. Všetky dvere a okná umožňujúce vstup do domu budú strážené a vybrané pohybové senzory (na prízemí) v dome.",armed_vacation:"Aktivovaný dovolenku možno použiť ako rozšírenie režimu stráženia v prípade dlhšej neprítomnosti. Časy oneskorenia a odozvy spúšťača je možné prispôsobiť podľa potreby.",armed_custom_bypass:"Extra režim na definovanie vlastného bezpečnostného obvodu."},number_sensors_active:"{number} {number, plural,\n  jeden {sensor}\n  other {sensors}\n} aktívny",fields:{status:{heading:"Stav",description:"Ovláda, či je možné v tomto režime zapnúť alarm."},exit_delay:{heading:"Oneskorenie odchodu",description:"Pri aktivácii alarmu v tomto časovom období senzory ešte nespustia alarm."},entry_delay:{heading:"Oneskorenie pri vstupe",description:"Čas oneskorenia, kým sa spustí alarm po aktivácii jedného zo senzorov."},trigger_time:{heading:"Spúšťací čas",description:"Čas, počas ktorého zostane alarm po aktivácii v spustenom stave."}}},mqtt:{title:"MQTT konfigurácia",description:"Tento panel je možné použiť na konfiguráciu rozhrania MQTT.",fields:{state_topic:{heading:"Stav topic",description:"Topic o ktorom zverejňuje aktualizácia stavu"},event_topic:{heading:"Udalosť topic",description:"Topicna na ktorý sa zverejňujú poplachové udalosti"},command_topic:{heading:"Príkazový topic",description:"Topic na ktorý Alarmo počúva príkazy na zapnutie/vypnutie."},require_code:{heading:"Vyžadovať kód",description:"Vyžadovať kódu ktorý sa má odoslať s príkazom."},state_payload:{heading:"Konfiguračný payload pre stav",item:"Definuje payload pre stav ''{state}''"},command_payload:{heading:"Konfiguračný payload pre príkaz",item:"Definuje payload pre príkaz ''{command}''"}}},areas:{title:"Oblasti",description:"Oblasti môžu byť použité na rozdelenie vášho poplašného systému do viacerých oddelení.",no_items:"Zatiaľ nie sú definované žiadne oblasti.",table:{remarks:"Poznámky",summary:"Táto oblasť obsahuje {summary_sensors} a {summary_automations}.",summary_sensors:"{number} {number, plural,\n  jeden {sensor}\n  other {sensors}\n}",summary_automations:"{number} {number, plural,\n  jeden {automation}\n  other {automations}\n}"},actions:{add:"Pridať"}}},dialogs:{create_area:{title:"Nová oblasť",fields:{copy_from:"Kopírovať nastavenia z"}},edit_area:{title:"Úprava oblasti ''{area}''",name_warning:"Poznámka: Zmena názvu zmení ID entity"},remove_area:{title:"Odstrániť oblasť?",description:"Naozaj chcete odstrániť túto oblasť? Táto oblasť obsahuje {sensors} senzory a {automations} automatizácie, ktoré budú tiež odstránené."},edit_master:{title:"Hlavná konfigurácia"},disable_master:{title:"Zakázať hlavnú?",description:"Naozaj chcete odstrániť hlavný alarm? Táto oblasť obsahuje {automations} automatizácie, ktoré budú touto akciou odstránené."}}},sensors:{title:"Senzory",cards:{sensors:{description:"Aktuálne nakonfigurované senzory. Kliknutím na položku vykonáte zmeny.",table:{no_items:"Nie sú tu žiadne senzory na zobrazenie.",no_area_warning:"Senzor nie je priradený k žiadnej oblasti.",arm_modes:"Režim alarmu",always_on:"(Vždy zapnutý)"}},add_sensors:{title:"pridať senzor",description:"Pridajte ďalšie senzory. Uistite sa, že vaše senzory majú vhodný názov, aby ste ich mohli identifikovať.",no_items:"Neexistujú žiadne dostupné entity HA, ktoré je možné nakonfigurovať pre alarm. Nezabudnite zahrnúť entity typu binárny_senzor.",table:{type:"Zistený typ"},actions:{add_to_alarm:"Pridať k alarmu",filter_supported:"Skryť položky s neznámym typom"}},editor:{title:"Upraviť senzor",description:"Konfigurácia nastavení senzorov ''{entity}''.",fields:{entity:{heading:"Entita",description:"Entita spojená s týmto senzorom"},area:{heading:"Oblasť",description:"Vyberte oblasť, ktorá obsahuje tento senzor."},group:{heading:"Skupina",description:"Zoskupenie s ďalšími snímačmi pre kombinované spúšťanie."},device_type:{heading:"Typ zariadenia",description:"Vyberte typ zariadenia, aby sa automaticky použili príslušné nastavenia.",choose:{door:{name:"Dvere",description:"Dvere, brána alebo iný vchod, ktorý sa používa na vstup/výstup z domu."},window:{name:"Okno",description:"Okno alebo dvere, ktoré sa nepoužívajú na vstup do domu, ako je balkón."},motion:{name:"Senzor pohybu",description:"Snímač prítomnosti alebo podobné zariadenie s oneskorením medzi aktiváciami."},tamper:{name:"Tamper",description:"Detektor odstránenia krytu snímača, snímač rozbitia skla atď."},environmental:{name:"Environmentálne",description:"Snímač dymu/plynu, detektor úniku atď. (nesúvisí s ochranou proti vlámaniu)."},other:{name:"Generic"}}},always_on:{heading:"Vždy zapnutý",description:"Senzor by mal vždy spustiť alarm."},modes:{heading:"Povolené režimy",description:"Alarmové režimy, v ktorých je tento snímač aktívny."},arm_on_close:{heading:"Zabezpečiť po zatvorní",description:"Po deaktivácii tohto senzora sa zostávajúce odchodové oneskorenie automaticky preskočí."},use_exit_delay:{heading:"Použite odchodové oneskoreniey",description:"Snímač môže byť aktívny, keď sa spustí odchodové oneskorenie."},use_entry_delay:{heading:"Použite oneskorenie vstupu",description:"Aktivácia senzora spustí alarm po vstupnom oneskorení, nie priamo."},entry_delay:{heading:"Vstupné oneskorenie",description:"Nahraďte oneskorenie (nastavené pre bezpečnostný režim) konkrétnou hodnotou."},delay_on:{heading:"Delay on",description:"Sensor must remain active for this duration before triggering. Resets if sensor deactivates."},allow_open:{heading:"Po aktivácii povoliť otvorené",description:"Ak je senzor aktívny aj po odchodovom oneskorení, nespôsobí to zlyhanie stráženia."},auto_bypass:{heading:"Obísť automaticky",description:"Vylúčte tento senzor z alarmu, ak je otvorený počas zapnutia stráženia.",modes:"Režimy, v ktorých môže byť senzor obídený"},trigger_unavailable:{heading:"Spustiť, keď nie je k dispozícii",description:"Keď sa stav senzora stane „nedostupným“, senzor sa aktivuje."}},actions:{toggle_advanced:"Pokročilé nastavenia",remove:"Odstrániť",setup_groups:"Nastavte skupiny"},errors:{description:"Opravte nasledujúce chyby:",no_area:"Nie je vybratá žiadna oblasť",no_modes:"Nie sú zvolené žiadne režimy, pre ktoré by mal byť snímač aktívny",no_auto_bypass_modes:"Nie sú zvolené žiadne režimy, aby sa senzor mohol automaticky obísť"}}},dialogs:{manage_groups:{title:"Spravujte skupiny senzorov",description:"V skupine senzorov musí byť aktivovaných viacero senzorov v časovom úseku pred spustením alarmu.",no_items:"Zatiaľ žiadne skupiny",actions:{new_group:"Nová skupina"}},create_group:{title:"Nová skupina senzorov",fields:{name:{heading:"Názov",description:"Názov skupiny senzorov"},timeout:{heading:"Čas vypršal",description:"Časové obdobie, počas ktorého po sebe idúce aktivácie senzora spustia alarm."},event_count:{heading:"Číslo",description:"Množstvo rôznych senzorov, ktoré je potrebné aktivovať na spustenie alarmu."},sensors:{heading:"Senzory",description:"Vyberte snímače, ktoré sú obsiahnuté v tejto skupine."}},errors:{invalid_name:"Zadané neplatné meno.",insufficient_sensors:"Je potrebné vybrať aspoň 2 senzory."}},edit_group:{title:"Upravte skupinu senzorov ''{name}''"}}},codes:{title:"Kódy",cards:{codes:{description:"Zmeňte nastavenia kódu.",fields:{code_arm_required:{heading:"Použite kód zabezpečenia",description:"Vyžaduje sa kód na aktiváciu alarmu"},code_disarm_required:{heading:"Použite deaktivačný kód",description:"Vyžaduje sa kód na vypnutie alarmu"},code_mode_change_required:{heading:"Vyžadovať kód pre režim prepínania",description:"Ak chcete zmeniť aktívny režim stráženia, musíte zadať platný kód."},code_format:{heading:"Formát kódu",description:"Nastaví typ vstupu pre kartu alarmu Lovelace.",code_format_number:"PIN",code_format_text:"Heslo"}}},user_management:{title:"Správa užívateľov",description:"Každý užívateľ má svoj vlastný kód na zapnutie/vypnutie alarmu.",no_items:"Zatiaľ nie sú žiadni používatelia",actions:{new_user:"Nový užívateľ"}},new_user:{title:"Vytvoriť nového používateľa",description:"Je možné vytvoriť používateľov na poskytovanie prístupu k ovládaniu alarmu.",fields:{name:{heading:"Meno",description:"Meno používateľa."},code:{heading:"Kód",description:"Kód pre tohto používateľa."},confirm_code:{heading:"Potvrďte kód",description:"Opakujte kód."},can_arm:{heading:"Povoliť kód na zapnutie stráženia",description:"Zadaním tohto kódu sa aktivuje alarm"},can_disarm:{heading:"Povoliť kód na vypnutie stráženia",description:"Zadaním tohto kódu sa alarm deaktivuje"},is_override_code:{heading:"Povinný kód",description:"Zadaním tohto kódu aktivujete alarm"},area_limit:{heading:"Zakázané oblasti",description:"Obmedzte používateľa na ovládanie iba vybraných oblastí"}},errors:{no_name:"Nebolo zadané žiadne meno.",no_code:"Kód by mal mať minimálne 4 znaky/čísla.",code_mismatch:"Kódy sa nezhodujú."}},edit_user:{title:"Upraviť používateľa",description:"Zmena konfigurácie pre používateľa ''{name}''.",fields:{old_code:{heading:"Aktuálny kód",description:"Aktuálny kód, ponechajte pole prázdne, ak chcete ponechať nezmenené."}}}}},actions:{title:"Akcie",cards:{notifications:{title:"Upozornenia",description:"Pomocou tohto panela môžete spravovať upozornenia, ktoré sa majú odoslať, keď nastane určitá poplachová udalosť.",table:{no_items:"Zatiaľ nie sú vytvorené žiadne upozornenia.",no_area_warning:"Akcia nie je priradená žiadnej oblasti."},actions:{new_notification:"Nová notifikácia"}},actions:{description:"Tento panel je možné použiť na prepnutie zariadenia pri zmene stavu alarmu.",table:{no_items:"Zatiaľ nie sú vytvorené žiadne akcie."},actions:{new_action:"Nová akcia"}},new_notification:{title:"Konfigurácia upozornenia",description:"Dostávať upozornenie pri zapnutí/vypnutí alarmu, aktivácii atď.",trigger:"Podmienka",action:"Úloha",options:"Možnosti",fields:{event:{heading:"Udalosť",description:"Kedy treba poslať oznámenie",choose:{armed:{name:"Alarm je aktivovaný",description:"Alarm je úspešne aktivovaný"},disarmed:{name:"Alarm je deaktivovaný",description:"Alarm je deaktivovaný"},triggered:{name:"Alarm je spustený",description:"Alarm sa spustí"},untriggered:{name:"Alarm už nie je spustený",description:"Spustený stav poplachu skončil"},arm_failure:{name:"Nepodarilo sa zapnúť",description:"Zapnutie alarmu zlyhalo kvôli jednému alebo viacerým otvoreným senzorom"},arming:{name:"Oneskorenie odchodu začalo",description:"Spustilo sa oneskorenie odchodu, pripravený opustiť dom."},pending:{name:"Začalo sa oneskorenie vstupu",description:"Vstupné oneskorenie začalo, alarm sa spustí čoskoro."}}},mode:{heading:"Režim",description:"Obmedzte akciu na konkrétne režimy spustenia (voliteľné)"},title:{heading:"Názov",description:"Názov správy s upozornením"},message:{heading:"Správa",description:"Obsah správy s upozornením",insert_wildcard:"Vložte zástupný znak",placeholders:{armed:"Alarm je nastavený na {{arm_mode}}",disarmed:"Alarm je teraz VYPNUTÝ",triggered:"Spustil sa alarm! dôvod: {{open_sensors}}.",untriggered:"Alarm už nie je spustený.",arm_failure:"Alarm teraz nebolo možné aktivovať z nasledujúcich dôvodov: {{open_sensors}}.",arming:"Alarm bude čoskoro aktivovaný, prosím opustite dom.",pending:"Alarm sa spustí, rýchlo ho deaktivujte!"}},open_sensors_format:{heading:"Formát pre zástupný znak open_sensors",description:"Vyberte, ktoré informácie o senzore sa vložia do správy",options:{default:"Meno a stav",short:"Iba mená"}},arm_mode_format:{heading:"Preklad pre zástupný znak režimu alarmu",description:"Vyberte, v akom jazyku sa do správy vloží režim stráženia"},target:{heading:"Cieľ",description:"Zariadenie, do ktorého sa má odoslať upozornenie"},media_player_entity:{heading:"Entita prehrávača médií",description:"Prehrávače médií na prehrávanie správy."},name:{heading:"Názov",description:"Popis tohto upozornenia",placeholders:{armed:"Upozorniť {target} pri aktivácii",disarmed:"Upozorniť {target} pri deaktivácii",triggered:"Upozorniť {target} pri spustení",untriggered:"Upozorniť {target}, keď sa spúšťanie zastaví",arm_failure:"Upozorniť {target} na zlyhanie",arming:"Upozorniť {target} pri odchode",pending:"Upozorniť {target} pri príchode"}},delete:{heading:"Odstrániť automatizáciu",description:"Natrvalo odstráňte túto automatizáciu"}},actions:{test:"Skús to"}},new_action:{title:"Konfigurovať akciu",description:"Zapnite svetlá alebo zariadenia (napríklad sirény) pri zapínaní/vypínaní stráženia, pri aktivácii atď.",fields:{event:{heading:"Udalosť",description:"Kedy sa má akcia vykonať"},area:{heading:"Oblasť",description:"Oblasť, pre ktorú sa udalosť vzťahuje."},mode:{heading:"Režim",description:"Obmedzte akciu na konkrétne režimy stráženia (voliteľné)"},entity:{heading:"Entity",description:"Entita, na ktorej sa má vykonať akcia"},action:{heading:"Akcia",description:"Akcia, ktorá sa má vykonať na entite",no_common_actions:"Akcie môžu byť priradené iba v režime YAML pre vybrané entity."},name:{heading:"Názov",description:"Popis tejto akcie",placeholders:{armed:"Nastavte {entity} na {state} pri aktivácii",disarmed:"Nastavte {entity} na {state} pri deaktivácii",triggered:"Nastavte {entity} na {state} pri spustení",untriggered:"Nastavte {entity} na {state}, keď sa spúšťanie zastaví",arm_failure:"Nastavte {entity} na {state} pri zlyhani",arming:"Nastavte {entity} na {state} pri odchode",pending:"Nastavte {entity} na {state} pri príchode"}}}}}}},ia={common:Xt,components:ea,title:ta,panels:aa},sa=Object.freeze({__proto__:null,common:Xt,components:ea,default:ia,panels:aa,title:ta}),na={modes_short:{armed_away:"Borta",armed_home:"Hemma",armed_night:"Natt",armed_custom_bypass:"Anpassad",armed_vacation:"Semester"},enabled:"Aktiverat",disabled:"Inaktiverat"},ra={time_picker:{seconds:"sekunder",minutes:"minuter"},editor:{ui_mode:"Till UI",yaml_mode:"Till YAML",edit_in_yaml:"Redigera i YAML"},table:{filter:{label:"Filtrera sensorer",item:"Filtrera med {name}",hidden_items:"{number} {number, plural,\n  en {item is}\n  other {items are}\n} dolda"}}},oa="Alarm panel",da={general:{title:"Generellt",cards:{general:{description:"Denna panel definierar några globala inställningar för larmet.",fields:{disarm_after_trigger:{heading:"Larma av efter utlös",description:"Efter utlös tiden har gått ut, larma av larmet istället för att återgå till larmat läge."},ignore_blocking_sensors_after_trigger:{heading:"Ignorera blockeringssensorer vid återaktivering",description:"Återgå till tillkopplat läge utan att kontrollera om det finns sensorer som fortfarande kan vara aktiva."},enable_mqtt:{heading:"Aktivera MQTT",description:"Tillåt alarm panelen att kontrolleras via MQTT."},enable_master:{heading:"Aktivera alarm master",description:"Skapar en entity för att kontrollera alla områden samtidigt."}},actions:{setup_mqtt:"MQTT konfiguration",setup_master:"Master konfiguration"}},modes:{title:"Lägen",description:"Denna panel kan användas för att konfigurera larmets olika larmlägen.",modes:{armed_away:"Larmat borta används när alla personer lämnat huset. Alla dörrar och fönster som tillåter tillgång till huset kommer att larmas, det samma gäller rörelsesensorer inne i huset.",armed_home:"Larmat hemma används när det finns personer kvar i huset. Alla dörrar och fönster som tillåter tillgång till huset kommer att larmas, dock inga rörelsesensorer inne i huset.",armed_night:"Larmat natt används när du aktiverar larmen innan du lägger dig. Alla dörrar och fönster som tillåter tillgång till huset kommer att larmas, det samma gäller utvalda rörelsesensorer inne i huset.",armed_vacation:"Larmat semester kan användas som en förlängning av läget för larmat borta vid längre frånvaro. Fördröjningstiderna och utlössvaren kan anpassas (efter önskemål) för att vara borta längre tid från hemmet.",armed_custom_bypass:"Ett extra läge för för att definiera sin egen säkerhetsperimeter."},number_sensors_active:"{number} {number, plural,\n  en {sensor}\n  other {sensorer}\n} aktiv",fields:{status:{heading:"Status",description:"Styr om larmet kan aktiveras i detta läge."},exit_delay:{heading:"Lämna fördröjning",description:"Efter att du har aktiverat larmet kommer dina sensorer inte utlösa ditt larm inom denna tid."},entry_delay:{heading:"Ankomst fördröjning",description:"Fördröjning i tid tills att ditt larm triggas efter att en av dina sensorer har aktiverats."},trigger_time:{heading:"Utlös tid",description:"Tid som ditt larm kommer vara i utlöst läge efter att ett larm har utlösts."}}},mqtt:{title:"MQTT konfiguration",description:"Denna panel kan användas för att anpassa konfigurationen av MQTT.",fields:{state_topic:{heading:"Status topic",description:"Topic på vilket status uppdateringar publiceras till."},event_topic:{heading:"Event topic",description:"Topic på vilket alarm events publiceras till."},command_topic:{heading:"Kommando topic",description:"Topic på vilket Alarmo lyssnar på för larma/larma av kommandon."},require_code:{heading:"Kräv kod",description:"Kräv att koden ska skickas med kommandot."},state_payload:{heading:"Konfigurera payload per state",item:"Definiera en payload för state ''{state}''"},command_payload:{heading:"Konfigurera payload per kommando",item:"Definiera en payload för kommando ''{command}''"}}},areas:{title:"Områden",description:"Områden kan användas för att dela upp ditt larm till flera områden.",no_items:"Det är inga områden definierade än.",table:{remarks:"Anmärkningar",summary:"Detta område innehåller {summary_sensors} och {summary_automations}.",summary_sensors:"{number} {number, plural,\n  en {sensor}\n  other {sensorer}\n}",summary_automations:"{number} {number, plural,\n  en {automation}\n  other {automationer}\n}"},actions:{add:"Lägg till"}}},dialogs:{create_area:{title:"Nytt område",fields:{copy_from:"Kopiera inställningarna från"}},edit_area:{title:"Redigera område ''{area}''",name_warning:"OBS: Ändrar du namn kommer entitetens ID att ändras"},remove_area:{title:"Ta bort område?",description:"Är du säker att du vill ta bort detta område? Detta område innehåller {sensors} sensorer och {automations} automationer, som också kommer att tas bort."},edit_master:{title:"Master konfiguration"},disable_master:{title:"Inaktivera master?",description:"Är du säker att du vill ta bort master alarm? Detta område innehåller {automations} automationer, som kommer att tas bort med detta val."}}},sensors:{title:"Sensorer",cards:{sensors:{description:"Nuvarande konfigurerade sensorer. Klicka på ett entity för att göra förändringar.",table:{no_items:"Det finns inga sensorer att visa här.",no_area_warning:"Sensor är inte tilldelat till något område.",arm_modes:"Larmläge",always_on:"(Alltid)"}},add_sensors:{title:"Lägg till sensorer",description:"Lägg till mer sensorer. Säkerställ att dina sensorer har ett friendly_name, så du kan identifiera dem.",no_items:"Det finns inga tillgängliga HA entities som kan konfigureras för larmet. Säkerställ att inkludera entiteter av typen binary_sensor.",table:{type:"Detekteringstyp"},actions:{add_to_alarm:"Addera till larmet",filter_supported:"Dölj sensorer av typen unknown"}},editor:{title:"Justera Sensor",description:"Justera inställningarna för sensor ''{entity}''.",fields:{entity:{heading:"Entitet",description:"Entitet associerad med denna sensor"},area:{heading:"Område",description:"Välj ett område som innehåller denna sensor."},group:{heading:"Grupp",description:"Gruppera med andra sensorer för kombinerad trigger."},device_type:{heading:"Enhetstyp",description:"Välj en enhetstyp att automatiskt applicera rekommenderade inställningar på.",choose:{door:{name:"Dörr",description:"En dörr, grind eller annan entre som används för att gå in/lämna hemmet."},window:{name:"Fönster",description:"Ett fönster eller en dörr som inte används för att gå in/lämna huset, t.ex. en balkongdörr."},motion:{name:"Rörelse",description:"Närvarosensor eller liknande som har fördröjning mellan sina aktiveringar."},tamper:{name:"Manipulering",description:"Detektor av sensorskydd, glaskross sensor etc."},environmental:{name:"Miljö",description:"Rök/gas sensor eller läckage sensor etc. (Inte relaterat till inbrottsskydd)."},other:{name:"Generell"}}},always_on:{heading:"Larma alltid",description:"Sensorn ska alltid utlösa larmet."},modes:{heading:"Aktiverat läge",description:"Larmläge när sensorn ska vara aktiv."},arm_on_close:{heading:"Larma efter stängning",description:"Resterande lämna fördröjning skippas automatiskt när denna sensor inaktiveras."},use_exit_delay:{heading:"Använd lämna fördröjning",description:"Sensorn är tillåten att vara aktiv när lämna fördröjningen startar."},use_entry_delay:{heading:"Använd ankomst fördröjning",description:"Sensor aktivering utlöser larmet efter ankomst fördröjningen istället för direkt."},entry_delay:{heading:"Ankomst fördröjning",description:"Ersätt fördröjningen (som inställd för säkerhetsläget) med ett specifikt värde."},delay_on:{heading:"Delay on",description:"Sensor must remain active for this duration before triggering. Resets if sensor deactivates."},allow_open:{heading:"Tillåt öppnad efter larmning.",description:"Om sensorn fortfarande är aktiv efter lämna fördröjningen kommer det inte misslyckas att larma."},auto_bypass:{heading:"Exkludera automatiskt",description:"Exkludera denna sensor från larmet om den är öppen vid pålarmning.",modes:"Lägen där sensor kan bli exkluderad"},trigger_unavailable:{heading:"Trigga vid otillgänglig",description:"Detta kommer aktiveras när sensorns status blir 'unavailable'."}},actions:{toggle_advanced:"Avancerade inställningar",remove:"Ta bort",setup_groups:"Hantera grupper"},errors:{description:"Var vänlig att justera följande fel:",no_area:"Inget område är vald",no_modes:"Inga lägen är valda när sensorn ska vara aktiv",no_auto_bypass_modes:"Inga lägen är valda när sensorn eventuellt automatiskt ska förbikopplas"}}},dialogs:{manage_groups:{title:"Hantera sensor grupper",description:"I en sensor grupp måste flera sensorer bli aktiverade inom en tidsperiod för att larmet ska triggas.",no_items:"Inga grupper ännu",actions:{new_group:"Ny grupp"}},create_group:{title:"Ny sensor grupp",fields:{name:{heading:"Namn",description:"Namn för sensor gruppen"},timeout:{heading:"Time-out",description:"Tidsperiod för de sammankopplade sensorernas aktivitet ska utlösa larmet."},event_count:{heading:"Siffra",description:"Mängd olika sensorer som behöver aktiveras för att utlösa larmet."},sensors:{heading:"Sensorer",description:"Välj sensorer som tillhöra gruppen."}},errors:{invalid_name:"Ogiltigt namn specificerat.",insufficient_sensors:"Minst två sensorer behöver väljas."}},edit_group:{title:"Justera sensor grupp ''{name}''"}}},codes:{title:"Koder",cards:{codes:{description:"Ändra inställningar för kod.",fields:{code_arm_required:{heading:"Använd pålarmningskod",description:"Kräv en kod för att aktivera larmet"},code_disarm_required:{heading:"Använd avlarmningskod",description:"Kräv en kod för att inaktivera larmet"},code_mode_change_required:{heading:"Kräv kod för att byta läge",description:"En giltig kod måste tillhandahållas för att ändra aktiveringsläget."},code_format:{heading:"Kodformat",description:"Ändra inmatningstyp för Lovelace alarm kortet.",code_format_number:"Pinkod",code_format_text:"Lösenord"}}},user_management:{title:"Användarhantering",description:"Varje användare har sin egen kod för aktivera/inaktivera larmet.",no_items:"Det finns inga användare än",actions:{new_user:"Ny användare"}},new_user:{title:"Skapa en ny användare",description:"Användare kan skapas för att ge tillgång att styra larmet.",fields:{name:{heading:"Namn",description:"Namn på användaren"},code:{heading:"Kod",description:"Koden för användaren."},confirm_code:{heading:"Repetera koden",description:"Repetera koden."},can_arm:{heading:"Tillåt kod för pålarmning",description:"Denna kod aktiverar larmet"},can_disarm:{heading:"Tillåt kod för avlarmning",description:"Denna kod inaktiverar larmet"},is_override_code:{heading:"Tvingande kod",description:"Denna kod tvingar aktivering av larmet"},area_limit:{heading:"Begränsade områden",description:"Begränsa användare att hantera utvalda områden"}},errors:{no_name:"Inget namn angivet.",no_code:"Koden ska vara minst 4 tecken eller siffror.",code_mismatch:"Koderna matchar inte."}},edit_user:{title:"Justera användare",description:"Ändra inställningar för användare ''{name}''.",fields:{old_code:{heading:"Nuvarande kod",description:"Nuvarande kod, lämna tomt för att inte ändra."}}}}},actions:{title:"Åtgärder",cards:{notifications:{title:"Notifikationer",description:"Du använder denna panel för att hantera notifikationer som ska skickas vid utvalda larmevents.",table:{no_items:"Det är inga notifikationer skapade än.",no_area_warning:"Åtgärd är inte tilldelad till något område."},actions:{new_notification:"Ny notifikation"}},actions:{description:"I denna panel kan du trigga olika beteende på enheter baserat på olika events från ditt larm.",table:{no_items:"Det finns inga åtgärder skapade ännu."},actions:{new_action:"Ny åtgärd"}},new_notification:{title:"Konfigurera notifikationer",description:"Ta emot en notifikation när ditt larm aktivera/inaktiveras eller om en sensor aktiveras eller liknande.",trigger:"Villkor",action:"Åtgärd",options:"Inställningar",fields:{event:{heading:"Event",description:"När ska notifikationen skickas",choose:{armed:{name:"Larmet är aktiverat",description:"Larmet aktiveras framgångsrikt"},disarmed:{name:"Larmet är inaktiverat",description:"Larmet är inaktiverat"},triggered:{name:"Larmet har utlösts",description:"Larmet har utlösts"},untriggered:{name:"Larmet inte längre utlöst",description:"Larmet inte längre utlöst"},arm_failure:{name:"Misslyckas att aktivera larm",description:"Larmet misslyckas att aktiveras på grund av någon sensor"},arming:{name:"Lämna fördröjning startas",description:"Lämna fördröjning startas, redo att lämna huset."},pending:{name:"Ankomst fördröjning startas",description:"Ankomst fördröjning startas, larmet kommer triggas snart."}}},mode:{heading:"Läge",description:"Begränsa åtgärd till specifikt larmläge (valfritt)"},title:{heading:"Titel",description:"Titel för notifikationsmeddelandet"},message:{heading:"Meddelande",description:"Innehåll av notifikationsmeddelandet",insert_wildcard:"Lägg in wildcard",placeholders:{armed:"Larmet har bytt status till {{arm_mode}}",disarmed:"Larmet är nu AVSTÄNGT",triggered:"Larmet har utlösts! Anledning: {{open_sensors}}.",untriggered:"Larmet inte längre utlöst.",arm_failure:"Larmet kunde inte aktiveras nu, detta på grund av: {{open_sensors}}.",arming:"Larmet kommer aktiveras snart, lämna huset.",pending:"Larmet kommer snart utlösas, inaktivera larmet snarast!"}},open_sensors_format:{heading:"Format för open_sensors wildcard",description:"Välj vilken sensorinformation som ska infogas i meddelandet",options:{default:"Namn och tillstånd",short:"Endast namn"}},arm_mode_format:{heading:"Översättning för larmläge wildcard",description:"Välj vilket språk som larmläge ska infogas i meddelandet"},target:{heading:"Mål",description:"Enhet att skicka push-meddelandet till"},media_player_entity:{heading:"Mediasoitinkohde",description:"Mediasoittimet viestin toistamiseen."},name:{heading:"Namn",description:"Beskrivning av notifikationen",placeholders:{armed:"Notifiera {target} vid aktivering av larm",disarmed:"Notifiera {target} vid inaktivering av larm",triggered:"Notifiera {target} vid utlöst larm",untriggered:"Notifiera {target} när larm inte längre utlöst",arm_failure:"Notifiera {target} vid fel av larm",arming:"Notifiera {target} vid utpassering",pending:"Notifiera {target} vid ankomst"}},delete:{heading:"Ta bort automation",description:"Ta bort automation permanent"}},actions:{test:"Testa"}},new_action:{title:"Konfigurera action",description:"Aktivera lampor eller andra enheter som sirener eller högtalare vid aktivering/inaktivering av larmet, triggning av larmet osv.",fields:{event:{heading:"Event",description:"När ska denna action aktiveras"},area:{heading:"Område",description:"Område som detta event ska appliceras på."},mode:{heading:"Läge",description:"Begränsa åtgärd till specifika larmlägen (frivilligt)"},entity:{heading:"Entitet",description:"Entitet att utföra åtgärd på"},action:{heading:"Åtgärd",description:"Åtgärd att utföra på entitet",no_common_actions:"Åtgärder kan enbart bli applicerade i YAML läge för utvalda entiteter."},name:{heading:"Namn",description:"Beskrivning av denna åtgärd",placeholders:{armed:"Sätt {entity} till {state} vid aktivering av larmet",disarmed:"Sätt {entity} till {state} vid inaktivering av larmet",triggered:"Sätt {entity} till {state} när larmet utlöses",untriggered:"Sätt {entity} till {state} när larmet inte längre utlöst",arm_failure:"Sätt {entity} till {state} vid fel av larmet",arming:"Sätt {entity} till {state} vid utpassering",pending:"Sätt {entity} till {state} vid ankomst"}}}}}}},la={common:na,components:ra,title:oa,panels:da},ca=Object.freeze({__proto__:null,common:na,components:ra,default:la,panels:da,title:oa}),ha={modes_short:{armed_away:"Đi vắng",armed_home:"Ở nhà",armed_night:"Ban đêm",armed_custom_bypass:"Tùy chỉnh",armed_vacation:"Đi nghỉ"},enabled:"Đang bật",disabled:"Đang tắt"},pa={time_picker:{seconds:"giây",minutes:"phút"},editor:{ui_mode:"Chế độ giao diện",yaml_mode:"Chế độ YAML",edit_in_yaml:"Soạn bằng YAML"},table:{filter:{label:"Lọc mục",item:"Lọc theo {name}",hidden_items:"{number} {number, plural,\n  one {mục}\n  other {mục}\n} bị ẩn"}}},ma="Bảng điều khiển báo động",ua={general:{title:"Tổng quan",cards:{general:{description:"Bảng điều khiển này đặt một số thiết lập toàn cục cho hệ thống báo động.",fields:{disarm_after_trigger:{heading:"Tắt bảo vệ sau khi báo động",description:"Sau khi đã hết thời gian kích hoạt báo động, tắt bảo vệ thay vì trở lại trạng thái bảo vệ trước đó."},ignore_blocking_sensors_after_trigger:{heading:"Bỏ qua các cảm biến chặn khi kích hoạt lại",description:"Trở lại trạng thái bật chế độ cảnh báo mà không cần kiểm tra các cảm biến có thể vẫn đang hoạt động."},enable_mqtt:{heading:"Bật MQTT",description:"Cho phép quản lý bảng điều khiển báo động qua MQTT."},enable_master:{heading:"Bật báo động tổng",description:"Tạo một thực thể để quản lý đồng thời mọi khu vực."}},actions:{setup_mqtt:"Cấu hình MQTT",setup_master:"Cấu hình báo động tổng"}},modes:{title:"Chế độ",description:"Bảng điều khiển này dùng để cài đặt các chế độ bảo vệ của hệ thống.",modes:{armed_away:"Bảo vệ khi đi vắng được dùng khi mọi người đã rời khỏi nhà. Tất cả cửa lớn và cửa sổ dẫn vào nhà, cũng như các cảm biến chuyển động trong nhà, sẽ được theo dõi.",armed_home:"Bảo vệ khi ở nhà được dùng để thiết lập báo động khi có người ở nhà. Tất cả cửa lớn và cửa sổ dẫn vào nhà, nhưng không theo dõi cảm biến chuyển động trong nhà, sẽ được theo dõi.",armed_night:"Bảo vệ vào ban đêm được dùng để thiết lập báo động trước khi đi ngủ. Tất cả cửa lớn và cửa sổ dẫn vào nhà, và một số cảm biến chuyển động (tầng dưới) trong nhà, sẽ được theo dõi.",armed_vacation:"Bảo vệ khi đi nghỉ có thể được coi là mở rộng của chế độ bảo vệ khi đi vắng khi bạn vắng nhà trong thời gian dài. Thời gian đếm giờ và phản ứng khi có kích hoạt sẽ được thay đổi (nếu muốn) khi ở xa nhà.",armed_custom_bypass:"Chế độ bổ sung để xác định phạm vi an ninh riêng của bạn."},number_sensors_active:"{number} {number, plural,\n  one {cảm biến}\n  other {cảm biến}\n} đang hoạt động",fields:{status:{heading:"Tình trạng",description:"Quyết định xem hệ thống có bảo vệ trong chế độ này không."},exit_delay:{heading:"Đếm giờ đi ra",description:"Khi đang bật bảo vệ, trong khoảng thời gian này các cảm biến sẽ chưa kích hoạt báo động."},entry_delay:{heading:"Đếm giờ đi vào",description:"Thời gian đếm lùi từ khi cảm biến bị kích hoạt cho đến khi báo động."},trigger_time:{heading:"Thời gian kích hoạt báo động",description:"Thời gian duy trì trạng thái báo động sau khi bị kích hoạt."}}},mqtt:{title:"Cấu hình MQTT",description:"Bảng điều khiển này dùng để cấu hình giao diện MQTT.",fields:{state_topic:{heading:"Chủ đề trạng thái",description:"Chủ đề đăng tải cập nhật trạng thái"},event_topic:{heading:"Chủ đề sự kiện",description:"Chủ đề đăng tải sự kiện báo động"},command_topic:{heading:"Chủ đề câu lệnh",description:"Chủ đề để Alarmo lắng nghe lệnh bật/tắt bảo vệ."},require_code:{heading:"Yêu cầu mã",description:"Yêu cầu phải gửi mã cùng với câu lệnh."},state_payload:{heading:"Cấu hình phụ tải trong mỗi trạng thái",item:"Định nghĩa phụ tải cho trạng thái ''{state}''"},command_payload:{heading:"Cấu hình phụ tải trong mỗi câu lệnh",item:"Định nghĩa phụ tải cho câu lệnh ''{command}''"}}},areas:{title:"Khu vực",description:"Khu vực có thể dùng để chia hệ thống báo động làm nhiều phần.",no_items:"Hiện chưa xác định khu vực.",table:{remarks:"Lưu ý",summary:"Khu vực này có {summary_sensors} và {summary_automations}.",summary_sensors:"{number} {number, plural,\n  one {cảm biến}\n  other {cảm biến}\n}",summary_automations:"{number} {number, plural,\n  one {tự động hóa}\n  other {tự động hóa}\n}"},actions:{add:"Thêm"}}},dialogs:{create_area:{title:"Khu vực mới",fields:{copy_from:"Chép thiết lập từ"}},edit_area:{title:"Sửa khu vực ''{area}''",name_warning:"Ghi chú: đổi tên sẽ làm đổi mã thực thể"},remove_area:{title:"Xóa khu vực?",description:"Bạn có chắc chắn muốn xóa khu vực này? Khu vực này có {sensors} cảm biến và {automations} tự động hóa, sẽ đều bị xóa theo."},edit_master:{title:"Cấu hình báo động tổng"},disable_master:{title:"Tắt báo động tổng?",description:"Bạn có chắc chắn muốn xóa báo động tổng không? Khu vực này có {sensors} cảm biến và {automations} tự động hóa, sẽ đều bị xóa theo."}}},sensors:{title:"Cảm biến",cards:{sensors:{description:"Cảm biến đã được cấu hình. Nhấn vào mục để thay đổi.",table:{no_items:"Không có cảm biến nào.",no_area_warning:"Chưa gán cảm biến vào bất kỳ khu vực nào.",arm_modes:"Chế độ bảo vệ",always_on:"(Luôn luôn)"}},add_sensors:{title:"Thêm cảm biến",description:"Bổ sung cảm biến. Hãy đảm bảo cảm biến của bạn có tên phù hợp để dễ nhận ra.",no_items:"Không có thực thể HA sẵn có nào có thể cấu hình cho hệ thống báo động. Hãy đảm bảo đưa vào thực thể thuộc kiểu binary_sensor.",table:{type:"Kiểu được phát hiện"},actions:{add_to_alarm:"Thêm vào hệ thống",filter_supported:"Ẩn mục không rõ kiểu"}},editor:{title:"Sửa cảm biến",description:"Cấu hình thiết lập cảm biến ''{entity}''.",fields:{entity:{heading:"Thực thể",description:"Thực thể được liên kết với cảm biến này"},area:{heading:"Khu vực",description:"Chọn một khu vực để đưa cảm biến này vào."},group:{heading:"Nhóm",description:"Gom chung với các cảm biến khác để kích hoạt chung."},device_type:{heading:"Kiểu thiết bị",description:"Chọn một kiểu thiết bị để tự động áp dụng thiết lập phù hợp.",choose:{door:{name:"Cửa lớn",description:"Cửa ra vào, cổng hoặc nơi khác dùng để ra vào nhà."},window:{name:"Cửa sổ",description:"Cửa sổ, hoặc cửa lớn nhưng không dùng để ra vào nhà, như ban công chẳng hạn."},motion:{name:"Chuyển động",description:"Cảm biến hiện diện hoặc thiết bị tương tự có thời gian nghỉ giữa các lần kích hoạt."},tamper:{name:"Phá hoại",description:"Bộ phát hiện mở nắp cảm biến, cảm biến vỡ kính, v.v."},environmental:{name:"Môi trường",description:"Cảm biến khói/khí đốt, phát hiện rò rỉ, v.v. (không liên quan đến chống trộm)."},other:{name:"Chung chung"}}},always_on:{heading:"Luôn bật",description:"Cảm biến luôn kích hoạt báo động."},modes:{heading:"Chế độ được bật",description:"Các chế độ báo động có kích hoạt cảm biến này."},arm_on_close:{heading:"Bảo vệ sau khi đóng",description:"Sau khi tắt kích hoạt cảm biến này, đếm giờ đi ra sẽ được tự động bỏ qua."},use_exit_delay:{heading:"Dùng đếm giờ đi ra",description:"Cảm biến được phép hoạt động khi bắt đầu đếm giờ đi ra."},use_entry_delay:{heading:"Dùng đếm giờ đi vào",description:"Kích hoạt cảm biến sẽ kích hoạt báo động sau khi đã hết thời gian đếm giờ đi vào, chứ không kích hoạt ngay."},entry_delay:{heading:"Đếm giờ đi vào",description:"Ghi đè độ trễ nhập cảnh (được cấu hình cho chế độ kích hoạt) bằng độ trễ cụ thể cho cảm biến."},delay_on:{heading:"Delay on",description:"Sensor must remain active for this duration before triggering. Resets if sensor deactivates."},allow_open:{heading:"Cho phép mở lúc đầu",description:"Trạng thái mở lúc bật bảo vệ sẽ được bỏ qua (những lần kích hoạt cảm biến sau đó sẽ kích hoạt báo động)."},auto_bypass:{heading:"Tự động bỏ qua",description:"Bỏ qua cảm biến này không kích hoạt báo động nếu nó đang mở khi bắt đầu bảo vệ.",modes:"Các chế độ mà cảm biến này có thể được bỏ qua"},trigger_unavailable:{heading:"Báo động khi không khả dụng",description:"Khi trạng thái của cảm biến trở thành 'không khả dụng', nó sẽ kích hoạt cảm biến."}},actions:{toggle_advanced:"Thiết lập nâng cao",remove:"Xóa",setup_groups:"Cài đặt nhóm"},errors:{description:"Vui lòng sửa các lỗi sau:",no_area:"Chưa chọn khu vực",no_modes:"Chưa chọn chế độ để bật cảm biến",no_auto_bypass_modes:"Chưa chọn chế độ để cảm biến được tự động bỏ qua"}}},dialogs:{manage_groups:{title:"Quản lý nhóm cảm biến",description:"Trong một nhóm cảm biến, các cảm biến này phải được kích hoạt trong cùng khoảng thời gian thì mới kích hoạt báo động.",no_items:"Chưa có nhóm",actions:{new_group:"Nhóm mới"}},create_group:{title:"Nhóm cảm biến mới",fields:{name:{heading:"Tên",description:"Tên của nhóm cảm biến"},timeout:{heading:"Thời hạn",description:"Khoảng thời gian các cảm biến phải lần lượt được kích hoạt thì mới kích hoạt báo động."},event_count:{heading:"Số lượng",description:"Số lượng cảm biến khác nhau cần được kích hoạt để kích hoạt báo động."},sensors:{heading:"Cảm biến",description:"Chọn cảm biến để đưa vào nhóm này."}},errors:{invalid_name:"Đã cung cấp tên không hợp lệ.",insufficient_sensors:"Phải chọn ít nhất 2 cảm biến."}},edit_group:{title:"Sửa nhóm cảm biến ''{name}''"}}},codes:{title:"Mã",cards:{codes:{description:"Thay đổi thiết lập mã.",fields:{code_arm_required:{heading:"Yêu cầu nhập mã để bật",description:"Phải nhập mã đúng để bật hệ thống báo động."},code_disarm_required:{heading:"Yêu cầu nhập mã để tắt",description:"Phải nhập mã đúng để tắt hệ thống báo động."},code_mode_change_required:{heading:"Yêu cầu nhập mã để chuyển chế độ",description:"Phải nhập mã đúng để thay đổi chế độ bảo vệ đang hoạt động."},code_format:{heading:"Định dạng mã",description:"Thiết lập kiểu nhập liệu cho thẻ bảo vệ Lovelace.",code_format_number:"Mã số",code_format_text:"Mật khẩu"}}},user_management:{title:"Quản lý người dùng",description:"Mỗi người dùng sẽ có một mã riêng để bật/tắt hệ thống báo động.",no_items:"Chưa có người dùng nào",actions:{new_user:"Người dùng mới"}},new_user:{title:"Tạo người dùng mới",description:"Người dùng phải được tạo để cấp quyền vận hành hệ thống báo động.",fields:{name:{heading:"Tên",description:"Tên người dùng."},code:{heading:"Mã",description:"Mã dành cho người dùng này."},confirm_code:{heading:"Xác nhận mã",description:"Lặp lại mã."},can_arm:{heading:"Cho phép nhập mã để bật",description:"Nhập mã này để bật bảo vệ"},can_disarm:{heading:"Cho phép nhập mã để tắt",description:"Nhập mã này để tắt bảo vệ"},is_override_code:{heading:"Có phải mã vượt quyền không",description:"Nhập mã này sẽ buộc hệ thống phải bật bảo vệ ngay"},area_limit:{heading:"Khu vực giới hạn",description:"Giới hạn chỉ cho phép người dùng điều khiển các khu vực cụ thể"}},errors:{no_name:"Chưa cung cấp tên.",no_code:"Mã cần có ít nhất 4 ký tự/ký số.",code_mismatch:"Mã không trùng khớp."}},edit_user:{title:"Sửa người dùng",description:"Thay đổi cấu hình cho người dùng ''{name}''.",fields:{old_code:{heading:"Mã hiện tại",description:"Mã hiện tại, để trống khi không thay đổi."}}}}},actions:{title:"Hành động",cards:{notifications:{title:"Thông báo",description:"Khi dùng bảng điều khiển này, bạn có thể quản lý thông báo gửi đi khi có một sự kiện báo động xảy ra.",table:{no_items:"Chưa tạo thông báo nào.",no_area_warning:"Chưa gán hành động vào khu vực nào cả."},actions:{new_notification:"Thông báo mới"}},actions:{description:"Bảng điều khiển này có thể dùng để bật tắt thiết bị khi trạng thái báo động thay đổi.",table:{no_items:"Chưa tạo hành động nào."},actions:{new_action:"Hành động mới"}},new_notification:{title:"Cấu hình thông báo",description:"Nhận thông báo khi bật/tắt hệ thống báo động, khi bị kích hoạt, v.v.",trigger:"Điều kiện",action:"Nhiệm vụ",options:"Tùy chọn",fields:{event:{heading:"Sự kiện",description:"Khi nào thì gửi thông báo",choose:{armed:{name:"Hệ thống báo động được bật",description:"Hệ thống báo động đã được bật thành công"},disarmed:{name:"Hệ thống báo động được tắt",description:"Hệ thống báo động đã được tắt"},triggered:{name:"Hệ thống báo động bị kích hoạt",description:"Hệ thống báo động bị kích hoạt"},untriggered:{name:"Hệ thống báo động không còn bị kích hoạt",description:"Trạng thái kích hoạt của hệ thống đã kết thúc"},arm_failure:{name:"Bật bảo vệ thất bại",description:"Bật hệ thống báo động thất bại do một hay nhiều cảm biến đang mở"},arming:{name:"Bắt đầu đếm giờ đi ra",description:"Bắt đầu đếm giờ đi ra, hãy sẵn sàng rời khỏi nhà."},pending:{name:"Bắt đầu đếm giờ đi vào",description:"Bắt đầu đếm giờ đi vào, báo động sẽ sớm bị kích hoạt."}}},mode:{heading:"Chế độ",description:"Giới hạn hành động chỉ trong một số chế độ bảo vệ (tùy chọn)"},title:{heading:"Tiêu đề",description:"Tiêu đề của tin nhắn thông báo"},message:{heading:"Thông báo",description:"Nội dung tin nhắn thông báo",insert_wildcard:"Nhập mẫu",placeholders:{armed:"Hệ thống báo động chuyển sang {{arm_mode}}",disarmed:"Hệ thống báo động giờ đã TẮT",triggered:"Hệ thống báo động bị kích hoạt! {{open_sensors}}.",untriggered:"Hệ thống báo động không còn bị kích hoạt.",arm_failure:"Hệ thống báo động không bật bảo vệ được, lý do: {{open_sensors}}.",arming:"Hệ thống báo động sẽ sớm được bật, vui lòng rời khởi nhà.",pending:"Hệ thống báo động sắp bị kích hoạt, hãy tắt nó nhanh!"}},open_sensors_format:{heading:"Định dạng cho mẫu open_sensors",description:"Chọn thông tin cảm biến nào để chèn vào thông báo",options:{default:"Tên và trạng thái",short:"Chỉ tên"}},arm_mode_format:{heading:"Bản dịch cho mẫu arm_mode",description:"Chọn ngôn ngữ chế độ bảo vệ sẽ chèn vào thông báo"},target:{heading:"Mục tiêu",description:"Thiết bị để gửi thông báo tới"},media_player_entity:{heading:"Media Player Entity",description:"Trình phát đa phương tiện để phát tin nhắn trên"},name:{heading:"Tên",description:"Miêu tả của thông báo này",placeholders:{armed:"Thông báo đến {target} khi bật bảo vệ",disarmed:"Thông báo đến {target} khi tắt bảo vệ",triggered:"Thông báo đến {target} khi kích hoạt báo động",untriggered:"Thông báo đến {target} khi dừng báo động",arm_failure:"Thông báo đến {target} khi thất bại",arming:"Thông báo đến {target} khi đi ra",pending:"Thông báo đến {target} khi đi vào"}},delete:{heading:"Xóa tự động hóa",description:"Xóa vĩnh viễn tự động hóa này"}},actions:{test:"Chạy thử"}},new_action:{title:"Cấu hình hành động",description:"Bật đèn hoặc thiết bị (như chuông báo động) khi bật/tắt hệ thống báo động, khi bị kích hoạt, v.v.",fields:{event:{heading:"Sự kiện",description:"Khi nào nên thực hiện hành động"},area:{heading:"Khu vực",description:"Khu vực áp dụng sự kiện."},mode:{heading:"Chế độ",description:"Giới hạn hành động chỉ cho những chế độ bảo vệ cụ thể (tùy chọn)"},entity:{heading:"Thực thể",description:"Thực thể bị hành động tác động"},action:{heading:"Hành động",description:"Hành động tác động lên thực thể",no_common_actions:"Hành động chỉ có thể được gán trong chế độ YAML đối với thực thể đã chọn."},name:{heading:"Tên",description:"Miêu tả hành động này",placeholders:{armed:"Đặt {entity} thành {state} khi bật bảo vệ",disarmed:"Đặt {entity} thành {state} khi tắt bảo vệ",triggered:"Đặt {entity} thành {state} khi kích hoạt báo động",untriggered:"Đặt {entity} thành {state} khi dừng báo động",arm_failure:"Đặt {entity} thành {state} khi thất bại",arming:"Đặt {entity} thành {state} khi đi ra",pending:"Đặt {entity} thành {state} khi đi vào"}}}}}}},ga={common:ha,components:pa,title:ma,panels:ua},va=Object.freeze({__proto__:null,common:ha,components:pa,default:ga,panels:ua,title:ma}),ya={modes_short:{armed_away:"离家警戒",armed_home:"在家警戒",armed_night:"夜间警戒",armed_custom_bypass:"自定义警戒",armed_vacation:"度假警戒"},enabled:"已启用",disabled:"已禁用"},ba={time_picker:{seconds:"秒",minutes:"分",infinite:"无限",none:"无"},editor:{ui_mode:"UI模式",yaml_mode:"YAML模式",edit_in_yaml:"在YAML中编辑"},table:{filter:{label:"过滤项目",item:"通过{name}过滤",hidden_items:"{number} {number, plural,\n  one {项目}\n  other {项目}\n} 已隐藏"}}},_a="警戒面板",fa={general:{title:"通用",cards:{general:{description:"该面板定义了警戒的一些全局设置。",fields:{disarm_after_trigger:{heading:"触发后解除警戒",description:"触发超时后解除警报，而不是返回到警戒状态。"},ignore_blocking_sensors_after_trigger:{heading:"重新布防期间忽略阻挡传感器",description:"返回到武装状态，而不检查可能仍处于活动状态的传感器。"},enable_mqtt:{heading:"启用MQTT",description:"允许通过MQTT控制警戒面板。"},enable_master:{heading:"启用警戒主控",description:"创建一个实体，用于同时控制所有区域。"}},actions:{setup_mqtt:"MQTT配置",setup_master:"主控配置"}},modes:{title:"模式",description:"该面板可用于设置报警器的警戒模式。",modes:{armed_away:"当所有的人离开房子时，将使用离家警戒。所有接入房屋的门窗传感器都将被监听状态，包括有动作传感器。",armed_home:"当有人在家时，设置警戒时将使用在家警戒（也称为停留警戒）。所有接入房屋的门窗传感器都将被监听状态，但房屋的动作传感器不受监听。",armed_night:"在睡觉前设置警报时，将使用夜间警报。所有接入房屋的门窗传感器都将被监听状态，并且指定的动作传感器（例如：楼梯）也将被监听。",armed_vacation:"度假警戒可以作为离家警戒模式的拓展，以应对长时间的离家情况。延迟时间和触发反应可以根据离家的时间按需调整。",armed_custom_bypass:"一个额外的模式，用于定义你自己的警戒模式。"},number_sensors_active:"{number} {number, plural,\n  one {传感器}\n  other {传感器}\n} 激活",fields:{status:{heading:"状态",description:"控制警报器是否可以在此模式下警戒。"},exit_delay:{heading:"离开延迟",description:"当开启警戒时，在这个时间段内，传感器还不会触发警报。"},entry_delay:{heading:"进入延迟",description:"在其中一个传感器被触发后，直到触发警报的延迟时间。"},trigger_time:{heading:"触发时间",description:"警戒在激活后保持在触发状态的时间。"}}},mqtt:{title:"MQTT配置",description:"该面板可用于配置MQTT接口。",fields:{state_topic:{heading:"状态主题（Topic）",description:"更新状态发布的主题"},event_topic:{heading:"事件主题（Topic）",description:"警戒事件发布的主题"},command_topic:{heading:"指令主题（Topic）",description:"Alarmo 监听警戒或者解除警戒的主题"},require_code:{heading:"需要密码",description:"需要密码和指令一起发送"},state_payload:{heading:"配置每个状态的有效载荷",item:"定义状态的有效载荷 ''{state}''"},command_payload:{heading:"配置每个指令的有效载荷",item:"定义指令的有效载荷 ''{command}''"}}},areas:{title:"区域",description:"区域可用于将您的报警系统划分为多个区间。",no_items:"目前还没有定义任何区域。",table:{remarks:"备注",summary:"当前区域包含 {summary_sensors} 和 {summary_automations}.",summary_sensors:"{number} {number, plural,\n  one {传感器}\n  other {传感器}\n}",summary_automations:"{number} {number, plural,\n  one {自动化}\n  other {自动化}\n}"},actions:{add:"添加"}}},dialogs:{create_area:{title:"新区域",fields:{copy_from:"复制设置，从"}},edit_area:{title:"编辑区域 ''{area}''",name_warning:"注意：改变名称将改变实体ID。"},remove_area:{title:"删除区域?",description:"你确定要删除区域吗? 当前区域包含 {sensors} 传感器和 {automations} 自动化, 也会一起删除。"},edit_master:{title:"主控配置"},disable_master:{title:"禁用主控?",description:"你确定你要删除警报器主控吗? 当前区域包含 {automations} 自动化, 也会一起删除。"}}},sensors:{title:"传感器",cards:{sensors:{description:"目前配置的传感器。点击一个项目来进行修改。",table:{no_items:"这里没有要显示的传感器。",no_area_warning:"传感器没有被分配到任何区域。",arm_modes:"警戒模式",always_on:"(一直开启)"}},add_sensors:{title:"添加传感器",description:"添加更多的传感器。确保你的传感器有一个合适的名字，这样你就可以识别它们。",no_items:"没有可用的HA实体可以被配置为报警器。请确保包含 binary_sensor 类型的实体。",table:{type:"检测到的类型"},actions:{add_to_alarm:"添加到报警器",filter_supported:"隐藏未知类型的项目"}},editor:{title:"编辑传感器",description:"配置传感器 ''{entity}'' 的设置。",fields:{entity:{heading:"实体",description:"与该传感器关联的实体"},area:{heading:"区域",description:"选择一个包含该传感器的区域。"},group:{heading:"群组",description:"与其他传感器分组进行联合触发。"},device_type:{heading:"设备类型",description:"选择一个设备类型来自动应用适当的设置。",choose:{door:{name:"门",description:"用于进入/离开房屋的门或其他入口。"},window:{name:"窗",description:"窗户或不用于进入房屋的门，如阳台。"},motion:{name:"动作",description:"存在传感器或类似装置，在激活之间有一个延迟。"},tamper:{name:"篡改",description:"移除传感器盖的探测器，玻璃破碎传感器等。"},environmental:{name:"环境",description:"烟雾/气体传感器、泄漏探测器等（与防盗不相关）。"},other:{name:"通用"}}},always_on:{heading:"总是开启",description:"传感器应始终触发警报。"},modes:{heading:"启用的模式",description:"该传感器处于活动状态的警戒模式。"},arm_on_close:{heading:"关闭后警戒",description:"该传感器停用后，剩余的离开延迟将被自动跳过。"},use_exit_delay:{heading:"使用离开延迟",description:"当离开延迟开始时，传感器被允许处于活动状态。"},use_entry_delay:{heading:"使用进入延迟",description:"传感器的激活会在进入延迟后触发警报，而不是直接触发。"},entry_delay:{heading:"进入延迟",description:"使用特定于传感器的延迟覆盖进入延迟（如为布防模式配置的）。"},delay_on:{heading:"Delay on",description:"Sensor must remain active for this duration before triggering. Resets if sensor deactivates."},allow_open:{heading:"允许在警戒后打开",description:"在警戒时，传感器的初始状态将被忽略。"},auto_bypass:{heading:"自动旁路",description:"如果该传感器在警戒时被触发，则将其排除在报警之外。",modes:"可绕过传感器的模式"},trigger_unavailable:{heading:"不可用时触发",description:'当传感器状态变成"不可用"时，将激活传感器。'}},actions:{toggle_advanced:"高级设定",remove:"删除",setup_groups:"配置群组"},errors:{description:"请修正以下错误：",no_area:"没有选择任何区域",no_modes:"没有选择传感器应处于活动状态的模式",no_auto_bypass_modes:"没有选择任何模式的传感器可能会被自动绕过。"}}},dialogs:{manage_groups:{title:"管理传感器群组",description:"在一个传感器群组中，多个传感器必须在一个时间段内被触发，才能触发警报。",no_items:"无群组",actions:{new_group:"新群组"}},create_group:{title:"新传感器群组",fields:{name:{heading:"名称",description:"传感器群组的名称"},timeout:{heading:"超时",description:"连续的传感器激活触发报警的时间段。"},event_count:{heading:"数字",description:"需要激活才能触发警报的不同传感器的数量。"},sensors:{heading:"传感器",description:"选择该群组所包含的传感器。"}},errors:{invalid_name:"提供的名称无效。",insufficient_sensors:"至少需要选择2个传感器。"}},edit_group:{title:"编辑传感器群组''{name}''"}}},codes:{title:"密码",cards:{codes:{description:"更改密码的设置。",fields:{code_arm_required:{heading:"使用警戒密码",description:"需要密码才能启用警报器"},code_disarm_required:{heading:"使用解除警戒密码",description:"需要密码才能解除警报器"},code_mode_change_required:{heading:"切换模式需要代码",description:"必须提供有效的代码才能更改处于活动状态的手臂模式。"},code_format:{heading:"密码格式",description:"设置 Lovelace Alarm Card 的输入类型。",code_format_number:"PIN码",code_format_text:"密码"}}},user_management:{title:"用户管理",description:"每个用户都有自己的密码来启用/解除警报。",no_items:"无用户",actions:{new_user:"新用户"}},new_user:{title:"创建新用户",description:"可以创建用户以提供操作警报器的权限。",fields:{name:{heading:"名称",description:"该用户的名称。"},code:{heading:"密码",description:"该用户的密码"},confirm_code:{heading:"确认密码",description:"重复输入密码。"},can_arm:{heading:"允许密码用于警戒",description:"输入此密码可激活警戒"},can_disarm:{heading:"允许密码用于解除警戒",description:"输入此密码可解除警戒"},is_override_code:{heading:"是覆盖密码",description:"输入此密码将强制激活警戒。"},area_limit:{heading:"限制区域",description:"限制用户只控制选定的区域"}},errors:{no_name:"没有提供名称。",no_code:"密码应至少有4个字符/数字。",code_mismatch:"密码不匹配。"}},edit_user:{title:"编辑用户",description:"为用户 ''{name}'' 变更配置。",fields:{old_code:{heading:"当前密码",description:"当前密码，留空表示保持不变。"}}}}},actions:{title:"动作",cards:{notifications:{title:"提醒",description:"使用此面板，你可以管理当某个报警事件发生时要发送的通知。",table:{no_items:"目前还没有创建任何通知。",no_area_warning:"动作没有被分配到任何领域。"},actions:{new_notification:"新通知"}},actions:{description:"当报警状态改变时，这个面板可以用来切换设备。",table:{no_items:"目前还没有创建任何动作。"},actions:{new_action:"新动作"}},new_notification:{title:"配置通知",description:"在启动/解除警报时、激活时等收到通知。",trigger:"条件",action:"任务",options:"选项",fields:{event:{heading:"事件",description:"应在何时发送通知",choose:{armed:{name:"警报器已警戒",description:"警报器已成功警戒"},disarmed:{name:"警报器已解除警戒",description:"警报器已解除警戒"},triggered:{name:"警报器已触发",description:"警报器已触发"},untriggered:{name:"警报器不再被触发",description:"警报器的触发状态已经结束"},arm_failure:{name:"警戒失败",description:"由于一个或多个传感器打开，警报器的警戒失败。"},arming:{name:"离开延迟开始",description:"离开延迟开始，准备离开房屋。"},pending:{name:"进入延迟开始",description:"进入延迟开始，警报将很快触发。"}}},mode:{heading:"模式",description:"将动作限制在特定的警戒模式（可选）。"},title:{heading:"标题",description:"通知信息的标题"},message:{heading:"信息",description:"通知信息的内容",insert_wildcard:"插入通配符",placeholders:{armed:"报警器被设置为 {{arm_mode}}",disarmed:"警报器现在是关闭的。",triggered:"警报被触发了! 因为：{{open_sensors}}.",untriggered:"警报器不再被触发。",arm_failure:"警报器现在无法启动，因为： {{open_sensors}}.",arming:"警报器很快就会警戒，请离开房屋。",pending:"警报器即将触发，请迅速解除警报!"}},open_sensors_format:{heading:"open_sensors通配符的格式",description:"选择在信息中插入哪些传感器信息",options:{default:"名称和状态",short:"仅名称"}},arm_mode_format:{heading:"警戒模式通配符的翻译",description:"选择在信息中插入警戒模式的语言"},target:{heading:"目标",description:"要发送通知的设备"},media_player_entity:{heading:"媒体播放器实体",description:"用于播放消息的媒体播放器。"},name:{heading:"名称",description:"该通知的描述",placeholders:{armed:"警戒时通知 {target}",disarmed:"解除警戒时通知 {target}",triggered:"触发警报时通知 {target}",untriggered:"警报解除时通知 {target}",arm_failure:"警戒失败时通知 {target}",arming:"警戒延迟开始时通知 {target}",pending:"警报即将触发时通知 {target}"}},delete:{heading:"删除自动化",description:"永久性地删除这个自动化"}},actions:{test:"测试"}},new_action:{title:"配置动作",description:"在启动/解除警报时，在激活时，切换灯光或设备（如警笛）。",fields:{event:{heading:"事件",description:"什么时候应该执行该动作"},area:{heading:"区域",description:"事件适用的区域。"},mode:{heading:"模式",description:"将动作限制在特定的警戒模式（可选）。"},entity:{heading:"实体",description:"要执行动作的实体"},action:{heading:"动作",description:"对实体执行的动作",no_common_actions:"动作只能在YAML模式下为选定的实体分配。"},name:{heading:"名称",description:"该动作的描述",placeholders:{armed:"警戒时将 {entity} 设置为 {state}。",disarmed:"解除警戒时将 {entity} 设置为 {state}。",triggered:"触发警报时将 {entity} 设置为 {state}。",untriggered:"警报解除时将 {entity} 设置为 {state}。",arm_failure:"警戒失败时将 {entity} 设置为 {state}。",arming:"警戒延迟开始时将 {entity} 设置为 {state}。",pending:"警报即将触发时将 {entity} 设置为 {state}。"}}}}}}},ka={common:ya,components:ba,title:_a,panels:fa},wa=Object.freeze({__proto__:null,common:ya,components:ba,default:ka,panels:fa,title:_a}),$a={modes_short:{armed_away:"離家警戒",armed_home:"在家警戒",armed_night:"夜間警戒",armed_custom_bypass:"自定義警戒",armed_vacation:"度假警戒"},enabled:"已啟用",disabled:"已禁用"},za={time_picker:{seconds:"秒",minutes:"分"},editor:{ui_mode:"UI模式",yaml_mode:"YAML模式",edit_in_yaml:"在YAML中編輯"},table:{filter:{label:"過濾項目",item:"通過{name}過濾",hidden_items:"{number} {number, plural,\n  one {項目}\n  other {項目}\n} 已隱藏"}}},Aa="警戒面板",xa={general:{title:"通用",cards:{general:{description:"該面板定義了警戒的一些全局設置。",fields:{disarm_after_trigger:{heading:"觸發後解除警戒",description:"觸發超時後解除警報，而不是返回到警戒狀態。"},ignore_blocking_sensors_after_trigger:{heading:"重新布防期間忽略阻擋感應器",description:"返回武裝狀態，而不檢查可能仍處於活動狀態的感測器。"},enable_mqtt:{heading:"啟用MQTT",description:"允許通過MQTT控制警戒面板。"},enable_master:{heading:"啟用警戒主控",description:"創建一個實體，用於同時控制所有區域。"}},actions:{setup_mqtt:"MQTT配置",setup_master:"主控配置"}},modes:{title:"模式",description:"該面板可用於設置報警器的警戒模式。",modes:{armed_away:"當所有的人離開房子時，將使用離家警戒。所有接入房屋的門窗傳感器都將被監聽狀態，包括有動作傳感器。",armed_home:"當有人在家時，設置警戒時將使用在家警戒（也稱為停留警戒）。所有接入房屋的門窗傳感器都將被監聽狀態，但房屋的動作傳感器不受監聽。",armed_night:"在睡覺前設置警報時，將使用夜間警報。所有接入房屋的門窗傳感器都將被監聽狀態，並且指定的動作傳感器（例如：樓梯）也將被監聽。",armed_vacation:"度假警戒可以作為離家警戒模式的拓展，以應對長時間的離家情況。延遲時間和觸發反應可以根據離家的時間按需調整。",armed_custom_bypass:"一個額外的模式，用於定義你自己的警戒模式。"},number_sensors_active:"{number} {number, plural,\n  one {傳感器}\n  other {傳感器}\n} 激活",fields:{status:{heading:"狀態",description:"控制警報器是否可以在此模式下警戒。"},exit_delay:{heading:"離開延遲",description:"當開啟警戒時，在這個時間段內，傳感器還不會觸發警報。"},entry_delay:{heading:"進入延遲",description:"在其中一個傳感器被觸發後，直到觸發警報的延遲時間。"},trigger_time:{heading:"觸發時間",description:"警戒在激活後保持在觸發狀態的時間。"}}},mqtt:{title:"MQTT配置",description:"該面板可用於配置MQTT接口。",fields:{state_topic:{heading:"狀態主題（Topic）",description:"更新狀態發布的主題"},event_topic:{heading:"事件主題（Topic）",description:"警戒事件發布的主題"},command_topic:{heading:"指令主題（Topic）",description:"Alarmo 監聽警戒或者解除警戒的主題"},require_code:{heading:"需要密碼",description:"需要密碼和指令一起發送"},state_payload:{heading:"配置每個狀態的有效載荷",item:"定義狀態的有效載荷 ''{state}''"},command_payload:{heading:"配置每個指令的有效載荷",item:"定義指令的有效載荷 ''{command}''"}}},areas:{title:"區域",description:"區域可用於將您的報警系統劃分為多個區間。",no_items:"目前還沒有定義任何區域。",table:{remarks:"備註",summary:"當前區域包含 {summary_sensors} 和 {summary_automations}.",summary_sensors:"{number} {number, plural,\n  one {傳感器}\n  other {傳感器}\n}",summary_automations:"{number} {number, plural,\n  one {自動化}\n  other {自動化}\n}"},actions:{add:"添加"}}},dialogs:{create_area:{title:"新區域",fields:{copy_from:"覆制設置，從"}},edit_area:{title:"編輯區域 ''{area}''",name_warning:"註意：改變名稱將改變實體ID。"},remove_area:{title:"刪除區域?",description:"你確定要刪除區域嗎? 當前區域包含 {sensors} 傳感器和 {automations} 自動化, 也會一起刪除。"},edit_master:{title:"主控配置"},disable_master:{title:"禁用主控?",description:"你確定你要刪除警報器主控嗎? 當前區域包含 {automations} 自動化, 也會一起刪除。"}}},sensors:{title:"傳感器",cards:{sensors:{description:"目前配置的傳感器。點擊一個項目來進行修改。",table:{no_items:"這裏沒有要顯示的傳感器。",no_area_warning:"傳感器沒有被分配到任何區域。",arm_modes:"警戒模式",always_on:"(一直開啟)"}},add_sensors:{title:"添加傳感器",description:"添加更多的傳感器。確保你的傳感器有一個合適的名字，這樣你就可以識別它們。",no_items:"沒有可用的HA實體可以被配置為報警器。請確保包含 binary_sensor 類型的實體。",table:{type:"檢測到的類型"},actions:{add_to_alarm:"添加到報警器",filter_supported:"隱藏未知類型的項目"}},editor:{title:"編輯傳感器",description:"配置傳感器 ''{entity}'' 的設置。",fields:{entity:{heading:"實體",description:"與該感測器關聯的實體"},area:{heading:"區域",description:"選擇一個包含該傳感器的區域。"},group:{heading:"群組",description:"與其他傳感器分組進行聯合觸發。"},device_type:{heading:"設備類型",description:"選擇一個設備類型來自動應用適當的設置。",choose:{door:{name:"門",description:"用於進入/離開房屋的門或其他入口。"},window:{name:"窗",description:"窗戶或不用於進入房屋的門，如陽台。"},motion:{name:"動作",description:"存在傳感器或類似裝置，在激活之間有一個延遲。"},tamper:{name:"篡改",description:"移除傳感器蓋的探測器，玻璃破碎傳感器等。"},environmental:{name:"環境",description:"煙霧/氣體傳感器、泄漏探測器等（與防盜不相關）。"},other:{name:"通用"}}},always_on:{heading:"總是開啟",description:"傳感器應始終觸發警報。"},modes:{heading:"啟用的模式",description:"該傳感器處於活動狀態的警戒模式。"},arm_on_close:{heading:"關閉後警戒",description:"該傳感器停用後，剩余的離開延遲將被自動跳過。"},use_exit_delay:{heading:"使用離開延遲",description:"當離開延遲開始時，傳感器被允許處於活動狀態。"},use_entry_delay:{heading:"使用進入延遲",description:"傳感器的激活會在進入延遲後觸發警報，而不是直接觸發。"},entry_delay:{heading:"進入延遲",description:"使用特定於感測器的延遲覆蓋進入延遲（如為布防模式配置的）。"},delay_on:{heading:"Delay on",description:"Sensor must remain active for this duration before triggering. Resets if sensor deactivates."},allow_open:{heading:"允許在警戒後打開",description:"在警戒時，傳感器的初始狀態將被忽略。"},auto_bypass:{heading:"自動旁路",description:"如果該傳感器在警戒時被觸發，則將其排除在報警之外。",modes:"可繞過傳感器的模式"},trigger_unavailable:{heading:"不可用時觸發",description:'當傳感器狀態變成"不可用"時，將激活傳感器。'}},actions:{toggle_advanced:"高級設定",remove:"刪除",setup_groups:"配置群組"},errors:{description:"請修正以下錯誤：",no_area:"沒有選擇任何區域",no_modes:"沒有選擇傳感器應處於活動狀態的模式",no_auto_bypass_modes:"沒有選擇任何模式的傳感器可能會被自動繞過。"}}},dialogs:{manage_groups:{title:"管理傳感器群組",description:"在一個傳感器群組中，多個傳感器必須在一個時間段內被觸發，才能觸發警報。",no_items:"無群組",actions:{new_group:"新群組"}},create_group:{title:"新傳感器群組",fields:{name:{heading:"名稱",description:"傳感器群組的名稱"},timeout:{heading:"超時",description:"連續的傳感器激活觸發報警的時間段。"},event_count:{heading:"數位",description:"需要啟動才能觸發警報的不同感測器的數量。"},sensors:{heading:"傳感器",description:"選擇該群組所包含的傳感器。"}},errors:{invalid_name:"提供的名稱無效。",insufficient_sensors:"至少需要選擇2個傳感器。"}},edit_group:{title:"編輯傳感器群組''{name}''"}}},codes:{title:"密碼",cards:{codes:{description:"更改密碼的設置。",fields:{code_arm_required:{heading:"使用警戒密碼",description:"需要密碼才能啟用警報器"},code_disarm_required:{heading:"使用解除警戒密碼",description:"需要密碼才能解除警報器"},code_mode_change_required:{heading:"切換模式需要代碼",description:"必須提供有效的代碼才能更改處於活動狀態的手臂模式。"},code_format:{heading:"密碼格式",description:"設置 Lovelace Alarm Card 的輸入類型。",code_format_number:"PIN碼",code_format_text:"密碼"}}},user_management:{title:"用戶管理",description:"每個用戶都有自己的密碼來啟用/解除警報。",no_items:"無用戶",actions:{new_user:"新用戶"}},new_user:{title:"創建新用戶",description:"可以創建用戶以提供操作警報器的權限。",fields:{name:{heading:"名稱",description:"該用戶的名稱。"},code:{heading:"密碼",description:"該用戶的密碼"},confirm_code:{heading:"確認密碼",description:"重覆輸入密碼。"},can_arm:{heading:"允許密碼用於警戒",description:"輸入此密碼可激活警戒"},can_disarm:{heading:"允許密碼用於解除警戒",description:"輸入此密碼可解除警戒"},is_override_code:{heading:"是覆蓋密碼",description:"輸入此密碼將強制激活警戒。"},area_limit:{heading:"限制區域",description:"限制用戶只控制選定的區域"}},errors:{no_name:"沒有提供名稱。",no_code:"密碼應至少有4個字符/數字。",code_mismatch:"密碼不匹配。"}},edit_user:{title:"編輯用戶",description:"為用戶 ''{name}'' 變更配置。",fields:{old_code:{heading:"當前密碼",description:"當前密碼，留空表示保持不變。"}}}}},actions:{title:"動作",cards:{notifications:{title:"提醒",description:"使用此面板，你可以管理當某個報警事件發生時要發送的通知。",table:{no_items:"目前還沒有創建任何通知。",no_area_warning:"動作沒有被分配到任何領域。"},actions:{new_notification:"新通知"}},actions:{description:"當報警狀態改變時，這個面板可以用來切換設備。",table:{no_items:"目前還沒有創建任何動作。"},actions:{new_action:"新動作"}},new_notification:{title:"配置通知",description:"在啟動/解除警報時、激活時等收到通知。",trigger:"條件",action:"任務",options:"選項",fields:{event:{heading:"事件",description:"應在何時發送通知",choose:{armed:{name:"警報器已警戒",description:"警報器已成功警戒"},disarmed:{name:"警報器已解除警戒",description:"警報器已解除警戒"},triggered:{name:"警報器已觸發",description:"警報器已觸發"},untriggered:{name:"警報器不再被觸發",description:"警報器的觸發狀態已經結束"},arm_failure:{name:"警戒失敗",description:"由於一個或多個傳感器打開，警報器的警戒失敗。"},arming:{name:"離開延遲開始",description:"離開延遲開始，準備離開房屋。"},pending:{name:"進入延遲開始",description:"進入延遲開始，警報將很快觸發。"}}},mode:{heading:"模式",description:"將動作限制在特定的警戒模式（可選）。"},title:{heading:"標題",description:"通知信息的標題"},message:{heading:"信息",description:"通知信息的內容",insert_wildcard:"插入通配符",placeholders:{armed:"報警器被設置為 {{arm_mode}}",disarmed:"警報器現在是關閉的。",triggered:"警報被觸發了! 因為：{{open_sensors}}.",untriggered:"警報器不再被觸發。",arm_failure:"警報器現在無法啟動，因為： {{open_sensors}}.",arming:"警報器很快就會警戒，請離開房屋。",pending:"警報器即將觸發，請迅速解除警報!"}},open_sensors_format:{heading:"open_sensors通配符的格式",description:"選擇在信息中插入哪些傳感器信息",options:{default:"名稱和狀態",short:"僅名稱"}},arm_mode_format:{heading:"警戒模式通配符的翻譯",description:"選擇在信息中插入警戒模式的語言"},target:{heading:"目標",description:"要發送通知的設備"},media_player_entity:{heading:"媒體播放器實體",description:"用於播放訊息的媒體播放器。"},name:{heading:"名稱",description:"該通知的描述",placeholders:{armed:"警戒時通知 {target}",disarmed:"解除警戒時通知 {target}",triggered:"觸發警報時通知 {target}",untriggered:"警報解除時通知 {target}",arm_failure:"警戒失敗時通知 {target}",arming:"警戒延遲開始時通知 {target}",pending:"警報即將觸發時通知 {target}"}},delete:{heading:"刪除自動化",description:"永久性地刪除這個自動化"}},actions:{test:"測試"}},new_action:{title:"配置動作",description:"在啟動/解除警報時，在激活時，切換燈光或設備（如警笛）。",fields:{event:{heading:"事件",description:"什麽時候應該執行該動作"},area:{heading:"區域",description:"事件適用的區域。"},mode:{heading:"模式",description:"將動作限制在特定的警戒模式（可選）。"},entity:{heading:"實體",description:"要執行動作的實體"},action:{heading:"動作",description:"對實體執行的動作",no_common_actions:"動作只能在YAML模式下為選定的實體分配。"},name:{heading:"名稱",description:"該動作的描述",placeholders:{armed:"警戒時將 {entity} 設置為 {state}。",disarmed:"解除警戒時將 {entity} 設置為 {state}。",triggered:"觸發警報時將 {entity} 設置為 {state}。",untriggered:"警報解除時將 {entity} 設置為 {state}。",arm_failure:"警戒失敗時將 {entity} 設置為 {state}。",arming:"警戒延遲開始時將 {entity} 設置為 {state}。",pending:"警報即將觸發時將 {entity} 設置為 {state}。"}}}}}}},ja={common:$a,components:za,title:Aa,panels:xa},Sa=Object.freeze({__proto__:null,common:$a,components:za,default:ja,panels:xa,title:Aa}),Oa={modes_short:{armed_away:"Полная охрана",armed_home:"Охрана дома",armed_night:"Охрана ночью",armed_custom_bypass:"Своя",armed_vacation:"Охрана отпуск"},enabled:"Включено",disabled:"Выключено"},Ca={time_picker:{seconds:"секунды",minutes:"минуты"},editor:{ui_mode:"В пользовательский интерфейс",yaml_mode:"В YAML",edit_in_yaml:"Редактировать в YAML"},table:{filter:{label:"Фильтр элементов",item:"Фильтровать по {name}",hidden_items:"{number} {number, plural,\n  one {item is}\n  other {items are}\n} скрыты"}}},Ta="Панель сигнализации",Ea={general:{title:"Общие",cards:{general:{description:"Эта панель содержит общие настройки для сигнализации.",fields:{disarm_after_trigger:{heading:"Снять с охраны после срабатывания",description:"По истечении времени срабатывания отключит сигнализацию вместо возврата в состояние охраны."},ignore_blocking_sensors_after_trigger:{heading:"Игнорировать блокирующие датчики при повторной постановке на охрану",description:"Возврат в состояние готовности без проверки датчиков, которые могут быть еще активны."},enable_mqtt:{heading:"Включить MQTT",description:"Разрешить управление панелью сигнализации через MQTT."},enable_master:{heading:"Включить мастер сигнализации",description:"Создает объект для одновременного управления всеми областями."}},actions:{setup_mqtt:"Конфигурация MQTT",setup_master:"Мастер конфигурации"}},modes:{title:"Режимы",description:"Эту панель можно использовать для настройки режимов включения сигнализации.",modes:{armed_away:"Полная охрана будет использоваться, когда все люди покинут дом. Все двери и окна, позволяющие получить доступ в дом, будут охраняться, так же как и датчики движения внутри дома.",armed_home:"Охрана дома будет использоваться при установке сигнализации, пока люди находятся в доме. Все двери и окна, позволяющие получить доступ в дом, будут охраняться, но не датчики движения внутри дома.",armed_night:"Охрана ночью будет использоваться при установке сигнализации перед сном. Все двери и окна, позволяющие получить доступ в дом, будут охраняться, а в доме будут установлены датчики движения (внизу).",armed_vacation:"Охрана отпуск может использоваться в качестве дополнения к режиму Охрана не дома в случае более длительного отсутствия. Время задержки и срабатывания триггера могут быть адаптированы (по желанию) к удаленности от дома.",armed_custom_bypass:"Дополнительный режим для определения вашего собственного периметра безопасности."},number_sensors_active:"{number} {number, plural,\n  one {sensor}\n other {sensors}\n} активны",fields:{status:{heading:"Статус",description:"Определяет, может ли сигнализация быть включена в этом режиме."},exit_delay:{heading:"Время для выхода",description:"При включении сигнализации в течение этого периода времени датчики еще не активируют сигнал тревоги."},entry_delay:{heading:"Время для входа",description:"Время задержки до срабатывания сигнализации после активации одного из датчиков."},trigger_time:{heading:"Время срабатывания",description:"Время, в течение которого сигнализация будет оставаться в срабатывающем состоянии после активации."}}},mqtt:{title:"Конфигурация MQTT",description:"Эта панель может быть использована для настройки интерфейса MQTT.",fields:{state_topic:{heading:"Состояние темы",description:"Тема, по которой публикуются обновления состояния"},event_topic:{heading:"Тема мероприятия",description:"Тема, по которой публикуются тревожные события"},command_topic:{heading:"Команда темы",description:"Тема, которую Аламо прослушивает для команд включения / выключения."},require_code:{heading:"Требовать код",description:"Требовать отправки кода вместе с командой."},state_payload:{heading:"Настройка полезной нагрузки для каждого состояния",item:"Определите полезную нагрузку для состояния ''{state}''"},command_payload:{heading:"Настройка полезной нагрузки для каждой команды",item:"Определите полезную нагрузку для команды ''{command}''"}}},areas:{title:"Зоны",description:"Зоны можно использовать для разделения вашей системы сигнализации на несколько отсеков.",no_items:"Пока еще не определены зоны.",table:{remarks:"Замечания",summary:"Эта зона содержит {summary_sensors} и {summary_automations}.",summary_sensors:"{number} {number, plural,\n  one {sensor}\n  other {sensors}\n}",summary_automations:"{number} {number, plural,\n  one {automation}\n  other {automations}\n}"},actions:{add:"Добавить"}}},dialogs:{create_area:{title:"Новая зона",fields:{copy_from:"Копировать настройки из"}},edit_area:{title:"Редактирование зоны ''{area}''",name_warning:"Примечание: изменение имени приведет к изменению идентификатора объекта"},remove_area:{title:"Удалить зону?",description:"Вы уверены, что хотите удалить эту зону? Эта зона содержит {sensors} датчики и {automations} автоматизации, которые также будут удалены."},edit_master:{title:"Мастер конфигурации"},disable_master:{title:"Отключить мастер?",description:"Вы уверены, что хотите удалить мастер сигнализации? Эта область содержит {automations} автоматизации, которые будут удалены с помощью этого действия."}}},sensors:{title:"Датчики",cards:{sensors:{description:"Настроенные в данный момент датчики. Нажмите на элемент, чтобы внести изменения.",table:{no_items:"Здесь нет датчиков, которые будут отображаться.",no_area_warning:"Датчик не привязан ни к какой зоне.",arm_modes:"Режимы охраны",always_on:"(Always)"}},add_sensors:{title:"Добавить датчики",description:"Добавьте больше датчиков. Убедитесь, что у ваших датчиков есть подходящее название, чтобы вы могли их идентифицировать.",no_items:"Нет доступных объектов HA, которые можно было бы настроить для сигнализации. Обязательно включите объекты типа binary_sensor.",table:{type:"Тип обнаружения"},actions:{add_to_alarm:"Добавить в сигнализацию",filter_supported:"Скрыть элементы с неизвестным типом"}},editor:{title:"Редактировать датчик",description:"Настройка параметров датчика ''{entity}''.",fields:{entity:{heading:"Объект",description:"Объект, связанный с этим датчиком"},area:{heading:"Зона",description:"Выберите зону, содержащую этот датчик."},group:{heading:"Группа",description:"Объедините с другими датчиками для комбинированного срабатывания."},device_type:{heading:"Тип устройства",description:"Выберите тип устройства, чтобы автоматически применить соответствующие настройки.",choose:{door:{name:"Дверь",description:"Дверь, ворота или другой вход, который используется для входа / выхода из дома."},window:{name:"Окно",description:"Окно или дверь, не используемые для входа в дом, такие как балкон."},motion:{name:"Движение",description:"Датчик присутствия или аналогичное устройство, имеющее задержку между активациями."},tamper:{name:"Тампер",description:"Датчик снятия крышки датчика, датчик разбитого стекла и т.д."},environmental:{name:"Экологический",description:"Датчик дыма / газа, течеискатель и т.д. (не связано с защитой от взлома)."},other:{name:"Общий"}}},always_on:{heading:"Всегда включен",description:"Датчик всегда должен подавать сигнал тревоги."},modes:{heading:"Включенные режимы",description:"Режимы сигнализации, в которых активен этот датчик."},arm_on_close:{heading:"Рычаг после закрытия",description:"После деактивации этого датчика оставшаяся задержка выхода будет автоматически пропущена."},use_exit_delay:{heading:"Используйте задержку для выхода",description:"Датчику разрешается быть активным, когда начинается задержка выхода."},use_entry_delay:{heading:"Используйте задержку для входа",description:"Активация датчика запускает сигнал тревоги после задержки входа, а не непосредственно."},entry_delay:{heading:"Задержка входа",description:"Переопределите задержку на вход (настроенную для режима охраны) на задержку, специфичную для датчика."},delay_on:{heading:"Delay on",description:"Sensor must remain active for this duration before triggering. Resets if sensor deactivates."},allow_open:{heading:"Разрешить открытие после постановки на охрану",description:"Начальное состояние датчика игнорируется при постановке на охрану."},auto_bypass:{heading:"Автоматический исключение",description:"Исключите этот датчик из системы сигнализации, если он открыт во время постановки на охрану.",modes:"Режимы, в которых датчик может быть исключен"},trigger_unavailable:{heading:"Срабатывает, когда недоступен",description:"Когда состояние датчика становится недоступным, это активирует датчик."}},actions:{toggle_advanced:"Дополнительные настройки",remove:"Удалить",setup_groups:"Настройки групп"},errors:{description:"Пожалуйста, исправьте следующие ошибки:",no_area:"Зона не выбрана",no_modes:"Не выбраны режимы, для которых датчик должен быть активен",no_auto_bypass_modes:"Никакие режимы не выбраны для датчика, который может быть автоматически исключен"}}},dialogs:{manage_groups:{title:"Управление группами датчиков",description:"В группе датчиков несколько датчиков должны быть активированы в течение определенного периода времени до срабатывания сигнализации.",no_items:"Групп пока нет",actions:{new_group:"Новая группа"}},create_group:{title:"Новая группа датчиков",fields:{name:{heading:"Название",description:"Название для группы датчиков"},timeout:{heading:"Тайм-аут",description:"Период времени, в течение которого последовательные срабатывания датчика вызывают сигнал тревоги."},event_count:{heading:"Число",description:"Количество различных датчиков, которые необходимо активировать для срабатывания сигнализации."},sensors:{heading:"Датчики",description:"Выберите датчики, входящие в эту группу."}},errors:{invalid_name:"Неверное название.",insufficient_sensors:"Необходимо выбрать по крайней мере 2 датчика."}},edit_group:{title:"Редактировать группу датчиков ''{name}''"}}},codes:{title:"Коды",cards:{codes:{description:"Измените настройки для кода.",fields:{code_arm_required:{heading:"Используйте код включения сигнализации",description:"Требуется код для включения сигнализации"},code_disarm_required:{heading:"Используйте код снятия с охраны",description:"Требуется код для снятия сигнализации с охраны"},code_mode_change_required:{heading:"Требовать код для переключения режима",description:"Для изменения активного режима охраны необходимо предоставить действительный код."},code_format:{heading:"Формат кода",description:"Задает тип ввода для карты сигнализации Lovelace.",code_format_number:"Пинкод",code_format_text:"Пароль"}}},user_management:{title:"Управление пользователями",description:"У каждого пользователя есть свой собственный код для включения / выключения сигнализации.",no_items:"Пользователей пока нет",actions:{new_user:"Hовый пользователь"}},new_user:{title:"Создать нового пользователя",description:"Пользователи могут быть созданы для предоставления доступа к управлению сигнализацией.",fields:{name:{heading:"Имя",description:"Имя пользователя."},code:{heading:"Код",description:"Код для этого пользователя."},confirm_code:{heading:"Подтвердите код",description:"Повторите код."},can_arm:{heading:"Разрешить код для постановки на охрану",description:"Ввод этого кода активирует сигнализацию"},can_disarm:{heading:"Разрешающить код для снятия с охраны",description:"Ввод этого кода отключает сигнализацию"},is_override_code:{heading:"Является переопределяющим кодом",description:"Ввод этого кода приведет к включению сигнализации в действие"},area_limit:{heading:"Запретные зоны",description:"Ограничить пользователя контролем только над выбранными зонами"}},errors:{no_name:"Имя не указано.",no_code:"Код должен содержать минимум 4 символа/ цифры.",code_mismatch:"Коды не совпадают."}},edit_user:{title:"Редактировать пользователя",description:"Изменить конфигурацию для пользователя ''{name}''.",fields:{old_code:{heading:"Текущий код",description:"Текущий код, оставьте пустым, чтобы оставить без изменений."}}}}},actions:{title:"Действия",cards:{notifications:{title:"Уведомления",description:"Используя эту панель, вы можете управлять уведомлениями, которые будут отправляться при возникновении определенного тревожного события.",table:{no_items:"Уведомления еще не созданы.",no_area_warning:"Действие не назначено ни для какой зоны."},actions:{new_notification:"Hовое уведомление"}},actions:{description:"Эта панель может использоваться для переключения устройства при изменении состояния тревоги.",table:{no_items:"Еще не создано никаких действий."},actions:{new_action:"Hoвое действие"}},new_notification:{title:"Настройка уведомления",description:"Получать уведомление при постановке на охрану / снятии с охраны сигнализации, при активации и т.д.",trigger:"Состояние",action:"Задача",options:"Опции",fields:{event:{heading:"Событие",description:"Когда должно быть отправлено уведомление",choose:{armed:{name:"Сигнализация включена",description:"Сигнализация успешно включена"},disarmed:{name:"Сигнализация отключена",description:"Сигнализация отключена"},triggered:{name:"Срабатывает сигнализация",description:"Срабатывает сигнализация"},untriggered:{name:"Тревога больше не срабатывает",description:"Состояние срабатывания сигнализации завершилось"},arm_failure:{name:"Включение сигнализации не удалось",description:"Включение сигнализации не удалось из-за одного или нескольких открытых датчиков"},arming:{name:"Началась задержка для выхода",description:"Началась задержка для выхода, выйдите из дома."},pending:{name:"Началась задержка для входа",description:"Началась задержка для входа, скоро сработает сигнализация."}}},mode:{heading:"Режим",description:"Ограничьте действие определенными режимами  (необязательно)"},title:{heading:"Заголовок",description:"Заголовок для сообщения с уведомлением"},message:{heading:"Сообщение",description:"Содержание сообщения-уведомления",insert_wildcard:"Вставить подстановочный знак",placeholders:{armed:"Сигнализация включена на {{arm_mode}}",disarmed:"Сигнализация включена",triggered:"Сработала сигнализация! Причина: {{open_sensors}}.",untriggered:"Сигнал тревоги больше не срабатывает.",arm_failure:"Сигнализация не могла быть включена прямо сейчас из-за: {{open_sensors}}.",arming:"Сигнализация скоро включится, пожалуйста, покиньте дом.",pending:"Сигнализация вот-вот сработает, быстро отключите ее!"}},open_sensors_format:{heading:"Формат для подстановочного знака open_sensors",description:"Выберите, информация о каком датчике будет вставлена в сообщение",options:{default:"Названия и состояния",short:"Только имена"}},arm_mode_format:{heading:"Перевод для подстановочного знака arm_mode",description:"Выберите, на каком языке режим arm будет вставлен в сообщение"},target:{heading:"Цель",description:"Устройство для отправки уведомления на"},media_player_entity:{heading:"Объект медиаплеера",description:"Медиаплееры для воспроизведения сообщения."},name:{heading:"название",description:"Описание для этого уведомления",placeholders:{armed:"Уведомлять {target} при постановке на охрану",disarmed:"Уведомлять {target} после снятия с охраны",triggered:"Уведомлять {target} при срабатывании",untriggered:"Уведомлять {target} когда срабатывание прекращается",arm_failure:"Уведомлять {target} при неудаче",arming:"Уведомлять {target} при выходе",pending:"Уведомлять {target} при входе"}},delete:{heading:"Удалить автоматизацию",description:"Навсегда удалите эту автоматизацию"}},actions:{test:"Попробовать это"}},new_action:{title:"Настройки Действия",description:"Включайте освещение или устройства (например, сирены) при постановке на охрану/снятии с охраны сигнализации, при активации и т.д.",fields:{event:{heading:"Событие",description:"Когда должно быть выполнено действие"},area:{heading:"Зона",description:"Зона, для которой применяется событие."},mode:{heading:"Режим",description:"Ограничьте действие определенными режимами arm (необязательно)"},entity:{heading:"Объект",description:"Объект для выполнения действия над"},action:{heading:"Действие",description:"Действие, которое необходимо выполнить над объектом",no_common_actions:"Действия могут быть назначены только в режиме YAML для выбранных объектов."},name:{heading:"Название",description:"Описание для этого действия",placeholders:{armed:"Установите  {entity} в {state} при постановке на охрану",disarmed:"Установите  {entity} в {state} после снятия с охраны",triggered:"Установите  {entity} в {state} при срабатывании",untriggered:"Установите  {entity} в {state} когда срабатывание прекращается",arm_failure:"Установите  {entity} в {state} при неудаче",arming:"Установите  {entity} в {state} при выходе",pending:"Установите  {entity} в {state} при входе"}}}}}}},Ma={common:Oa,components:Ca,title:Ta,panels:Ea},La=Object.freeze({__proto__:null,common:Oa,components:Ca,default:Ma,panels:Ea,title:Ta}),Na={modes_short:{armed_away:"Uzakta",armed_home:"Ev",armed_night:"Gece",armed_custom_bypass:"Özel",armed_vacation:"Tatil"},enabled:"Aktif",disabled:"Deaktif"},Ha={time_picker:{seconds:"saniye",minutes:"dakika"},editor:{ui_mode:"Kullanıcı Arayüzüne",yaml_mode:"YAML'e",edit_in_yaml:"YAML olarak düzenleme"},table:{filter:{label:"Öğeleri filtrele",item:"{name}'e göre filtrele",hidden_items:"{number} {number, plural,\n  one {bir madde}\n  other {iki madde}\n} gizli"}}},Da="Alarm paneli",Pa={general:{title:"Genel",cards:{general:{description:"Bu panel alarm için bazı genel ayarları tanımlar.",fields:{disarm_after_trigger:{heading:"Tetiklemeden sonra devre dışı bırakma",description:"Tetikleme süresi zaman aşımına uğradıktan sonra, etkin duruma dönmek yerine alarmı devre dışı bırakın."},ignore_blocking_sensors_after_trigger:{heading:"Yeniden silahlandırırken bloke eden sensörleri yok sayın",description:"Hala aktif olabilecek sensörleri kontrol etmeden silahlı duruma geri dönün."},enable_mqtt:{heading:"MQTT'yi Etkinleştir",description:"Alarm panelinin MQTT aracılığıyla kontrol edilmesine izin verin."},enable_master:{heading:"Alarm yöneticisini etkinleştir",description:"Tüm alanları aynı anda kontrol etmek için bir varlık oluşturur."}},actions:{setup_mqtt:"MQTT Yapılandırması",setup_master:"Ana Yapılandırma"}},modes:{title:"Modlar",description:"Bu panel alarmın modlarını ayarlamak için kullanılabilir.",modes:{armed_away:"Tüm insanlar evi terk ettiğinde uzakta modu kullanılacaktır. Eve erişim sağlayan tüm kapı ve pencerelerin yanı sıra evin içindeki hareket sensörleri de korunacaktır.",armed_home:"Evdeyken aktif(evde iken alarm devrede olarak da bilinir), insanlar evdeyken ve alarm aktifken kullanılacaktır. Eve erişim sağlayan tüm kapı ve pencereler korunacak, ancak evin içindeki hareket sensörleri korunmayacaktır.",armed_night:"Uyumadan önce alarm kurulurken gece aktif modu kullanılacaktır. Eve erişim sağlayan tüm kapı ve pencereler ve evdeki seçilmiş hareket sensörleri (mesela alt kat) korunacak.",armed_vacation:"Aktif tatil, daha uzun süreli uzakta kalma durumunda aktif uzakta modunun bir eki olarak kullanılabilir. Gecikme süreleri ve tetikleme tepkileri (istenildiği gibi) evden uzakta olmaya göre uyarlanabilir.",armed_custom_bypass:"Kendi güvenlik çevrenizi tanımlamak için ekstra bir mod."},number_sensors_active:"{number} {number, plural,\n  one {sensör}\n  other {sensörler}\n} aktif",fields:{status:{heading:"Durum",description:"Alarmın bu modda devreye alınıp alınamayacağını kontrol eder."},exit_delay:{heading:"Çıkış gecikmesi",description:"Alarmı kurarken geçen bu süre içinde sensörler henüz alarmı tetiklemeyecektir."},entry_delay:{heading:"Giriş gecikmesi",description:"Sensörlerden biri etkinleştirildikten sonra alarmın tetiklenmesine kadar geçen gecikme süresi."},trigger_time:{heading:"Tetikleme süresi",description:"Etkinleştirmeden sonra alarmın tetiklenmiş durumda kalacağı süre."}}},mqtt:{title:"MQTT yapılandırması",description:"Bu panel MQTT arayüzünün yapılandırılması için kullanılabilir.",fields:{state_topic:{heading:"Durum konusu",description:"Durum güncellemelerinin yayınlandığı konu"},event_topic:{heading:"Etkinlik konusu",description:"Alarm olaylarının yayınlandığı konu başlığı"},command_topic:{heading:"Komut konusu",description:"Alarmo'nun devreye alma/devreden çıkarma komutları için dinlediği konu."},require_code:{heading:"Kod gerektir",description:"Komutla birlikte gönderilecek kodu gerektirir."},state_payload:{heading:"Durum başına veri yükü yapılandırma",item:"''{state}'' durumu için bir veri yükü tanımlayın"},command_payload:{heading:"Komut başına veri yükü yapılandırma",item:"''{command}'' komutu için bir veri yükü tanımlayın"}}},areas:{title:"Alanlar",description:"Alanlar, alarm sisteminizi birden fazla bölüme ayırmak için kullanılabilir.",no_items:"Henüz tanımlanmış bir alan bulunmamaktadır.",table:{remarks:"Özet",summary:"Bu alan {summary_sensors} ve {summary_automations} öğelerini içerir.",summary_sensors:"{number} {number, plural,\n  one {sensör}\n  other {sensörler}\n}",summary_automations:"{number} {number, plural,\n  one {otomasyon}\n  other {otomasyonlar}\n}"},actions:{add:"Ekle"}}},dialogs:{create_area:{title:"Yeni alan",fields:{copy_from:"Ayarları şuradan kopyala"}},edit_area:{title:"Alanı düzenle ''{area}''",name_warning:"Not: adın değiştirilmesi varlık kimliğini(entity ID) de değiştirecektir"},remove_area:{title:"Alan kaldırılsın mı?",description:"Bu alanı kaldırmak istediğinizden emin misiniz? Bu alan {sensors} sensörlerini ve {automations} otomasyonlarını içerir, bunlar da kaldırılacaktır."},edit_master:{title:"Ana yapılandırma"},disable_master:{title:"Ana yapılandırma'yı devre dışı bırakalım mı?",description:"Alarm yöneticisini kaldırmak istediğinizden emin misiniz? Bu alan, bu eylemle kaldırılacak olan {otomasyonlar} otomasyonlarını içerir."}}},sensors:{title:"Sensörler",cards:{sensors:{description:"Şu anda yapılandırılmış sensörler. Değişiklik yapmak için bir öğeye tıklayın.",table:{no_items:"Görüntülenecek herhangi bir sensör yok.",no_area_warning:"Sensör herhangi bir alana atanmamıştır.",arm_modes:"Alarm Modları",always_on:"(Her zaman)"}},add_sensors:{title:"Sensör Ekleme",description:"Daha fazla sensör ekleyin. Sensörlerinizin uygun bir ada sahip olduğundan emin olun, böylece onları tanımlayabilirsiniz.",no_items:"Alarm için yapılandırılabilecek mevcut herhangi HA varlığı yok. binary_sensor türündeki varlıkları eklediğinizden emin olun.",table:{type:"Tespit edilen tip"},actions:{add_to_alarm:"Alarma ekle",filter_supported:"Türü bilinmeyen öğeleri gizle"}},editor:{title:"Sensörü Düzenle",description:"''{entity}'' sensör ayarlarının yapılandırılması.",fields:{entity:{heading:"Varlık",description:"Bu sensörle ilişkili varlık"},area:{heading:"Alan",description:"Bu sensörü içeren bir alan seçin."},group:{heading:"Grup",description:"Kombine tetikleme için diğer sensörlerle gruplayın."},device_type:{heading:"Cihaz Tipi",description:"Uygun ayarları otomatik olarak uygulamak için bir cihaz türü seçin.",choose:{door:{name:"Kapı",description:"Eve giriş/çıkış için kullanılan bir kapı, geçit veya başka bir giriş."},window:{name:"Pencere",description:"Bir pencere veya balkon gibi eve girmek için kullanılmayan bir kapı."},motion:{name:"Hareket",description:"Aktivasyonlar arasında geri sayımı olan varlık sensörü veya benzer bir cihaz."},tamper:{name:"Titreşim",description:"Sensör kapağının çıkarılma müşiri, cam kırılma sensörü vb."},environmental:{name:"Çevresel",description:"Duman/gaz sensörü, sızıntı detektörü, vb. (hırsıza karşı korumayla ilgili değildir)."},other:{name:"Genel"}}},always_on:{heading:"Her zaman açık",description:"Sensör her zaman alarmı tetiklemelidir."},modes:{heading:"Etkin modlar",description:"Bu sensörün aktif olduğu alarm modları."},arm_on_close:{heading:"Kapattıktan sonra aktif et",description:"Bu sensörün devre dışı bırakılmasından sonra, kalan evden ayrılma geri sayımı otomatik olarak atlanacaktır."},use_exit_delay:{heading:"Evden çıkış ertelemesini kullanın",description:"Evden ayrılma geri sayımı başladığında sensörün aktif olmasına izin verilir."},use_entry_delay:{heading:"Eve giriş ertelemesini kullanın",description:"Sensör aktivasyonu alarmı doğrudan değil giriş geri sayımından sonra tetikler."},entry_delay:{heading:"Giriş gecikmesi",description:"Giriş gecikmesini (kol modu için yapılandırıldığı gibi) sensöre özgü bir gecikmeyle geçersiz kılın."},delay_on:{heading:"Delay on",description:"Sensor must remain active for this duration before triggering. Resets if sensor deactivates."},allow_open:{heading:"Başlangıçta açık olmasına izin verin",description:"Devreye alma sırasında açık durum göz ardı edilir (sonraki sensör aktivasyonu alarmı tetikleyecektir)."},auto_bypass:{heading:"Otomatik olarak bypass",description:"Devreye alma sırasında açıksa bu sensörü alarmın etkileşiminden hariç tutun.",modes:"Sensörün bypass edilebileceği modlar"},trigger_unavailable:{heading:"Kullanılamadığında tetikle",description:"Sensör durumu 'kullanılamaz' olduğunda, bu sensörü etkinleştirecektir."}},actions:{toggle_advanced:"Gelişmiş ayarlar",remove:"Kaldır",setup_groups:"Grupları ayarlayın"},errors:{description:"Lütfen aşağıdaki hataları düzeltin:",no_area:"Hiçbir alan seçilmedi",no_modes:"Sensörün aktif olması gereken hiçbir mod seçilmedi",no_auto_bypass_modes:"Sensör için hiçbir mod seçilmezse, otomatik olarak bypass edilebilir"}}},dialogs:{manage_groups:{title:"Sensör gruplarını yönet",description:"Bir sensör grubunda, alarm tetiklenmeden önce birden fazla sensörün belirli bir süre içinde etkinleştirilmesi gerekir.",no_items:"Henüz grup yok",actions:{new_group:"Yeni grup"}},create_group:{title:"Yeni sensör grubu",fields:{name:{heading:"İsim",description:"Sensör grubu için ad"},timeout:{heading:"Zaman aşımı",description:"Ardışık sensör aktivasyonlarının alarmı tetiklediği süre."},event_count:{heading:"Sayı",description:"Alarmı tetiklemek için etkinleştirilmesi gereken farklı sensörlerin miktarı."},sensors:{heading:"Sensörler",description:"Bu grubun içerdiği sensörleri seçin."}},errors:{invalid_name:"Geçersiz ad sağlandı.",insufficient_sensors:"En az 2 sensörün seçilmesi gerekir."}},edit_group:{title:"Sensör ''{name}'' grubunu düzenleyin"}}},codes:{title:"Kodlar",cards:{codes:{description:"Kod için ayarları değiştirin.",fields:{code_arm_required:{heading:"Etkinleştirmek için kod gerektir",description:"Alarmı aktifleştirmek için geçerli bir kod sunulmalıdır."},code_disarm_required:{heading:"Devre dışı bırakmak için kod gereksin",description:"Alarmı devre dışı bırakmak için geçerli bir kod sağlanmalıdır."},code_mode_change_required:{heading:"Anahtarlama modu için kod gerektir",description:"Aktif modu değiştirmek için geçerli bir kod sağlanmalıdır."},code_format:{heading:"Kod formatı",description:"Lovelace alarm kartı için giriş türünü ayarlar.",code_format_number:"Pin kodu",code_format_text:"Şifre"}}},user_management:{title:"Kullanıcı yönetimi",description:"Her kullanıcının alarmı kurmak/devre dışı bırakmak için kendi kodu vardır.",no_items:"Henüz kullanıcı yok",actions:{new_user:"Yeni kullanıcı"}},new_user:{title:"Yeni kullanıcı oluştur",description:"Alarmın çalıştırılmasına erişim sağlamak için kullanıcılar oluşturulabilir.",fields:{name:{heading:"İsim",description:"Kullanıcının adı."},code:{heading:"Kod",description:"Bu kullanıcı için kod."},confirm_code:{heading:"Kodu onayla",description:"Kodu tekrarlayın."},can_arm:{heading:"Etkinleştirmek için koda izin ver",description:"Bu kodun girilmesi alarmı etkinleştirir"},can_disarm:{heading:"Etkisizleştirmek için koda izin ver",description:"Bu kod girilince alarm devre dışı kalır"},is_override_code:{heading:"Geçersiz kılma kodu",description:"Bu kodun girilmesi alarmı zor kullanarak aktif tutacaktır."},area_limit:{heading:"Kısıtlı alanlar",description:"Kullanıcıyı yalnızca seçilen alanları kontrol etmekle sınırlandırın"}},errors:{no_name:"İsim verilmemiş.",no_code:"Kod en az 4 karakter/rakam içermelidir.",code_mismatch:"Kodlar uyuşmuyor."}},edit_user:{title:"Kullanıcıyı Düzenle",description:"''{name}'' kullanıcısı için yapılandırmayı değiştirin.",fields:{old_code:{heading:"Şu anki kod",description:"Geçerli kodu değiştirmek istemiyorsanız boş bırakın."}}}}},actions:{title:"Eylemler",cards:{notifications:{title:"Bildirimler",description:"Bu paneli kullanarak, belirli bir alarm olayı gerçekleştiğinde gönderilecek bildirimleri yönetebilirsiniz.",table:{no_items:"Henüz oluşturulmuş bir bildirim yok.",no_area_warning:"Eylem herhangi bir alana atanmamıştır."},actions:{new_notification:"Yeni bildirim"}},actions:{description:"Bu panel, alarm durumu değiştiğinde bir cihazı değiştirmek için kullanılabilir.",table:{no_items:"Henüz oluşturulmuş bir eylem yok."},actions:{new_action:"Yeni eylem"}},new_notification:{title:"Bildirimi yapılandırın",description:"Alarmı kurarken/devre dışı bırakırken, aktivasyonda bırakırken vb. durumlarda bir bildirim alın.",trigger:"Durum",action:"Görev",options:"Seçenekler",fields:{event:{heading:"Etkinlik",description:"Bildirim ne zaman gönderilmeli?",choose:{armed:{name:"Alarm devrede",description:"Alarm başarıyla devreye alındı"},disarmed:{name:"Alarm devre dışı bırakıldı",description:"Alarm devre dışı bırakıldı"},triggered:{name:"Alarm tetiklendi",description:"Alarm tetiklenir"},untriggered:{name:"Alarm artık tetiklenmiyor",description:"Alarmın tetiklenme durumu sona erdi"},arm_failure:{name:"Etkinleştirilemedi",description:"Bir veya daha fazla açık sensör nedeniyle alarmın devreye alınması başarısızlıkla sonuçlandı"},arming:{name:"Çıkış gecikmesi başladı",description:"Çıkış geri sayımı başladı, evden çıkmaya hazır."},pending:{name:"Giriş gecikmesi başladı",description:"Giriş geri sayımı başladı, alarm yakında tetiklenecek."}}},mode:{heading:"Mod",description:"Eylemi belirli modlarla sınırlayın (isteğe bağlı)"},title:{heading:"Başlık",description:"Bildirim mesajı için başlık"},message:{heading:"Mesaj",description:"Bildirim mesajının içeriği",insert_wildcard:"Joker karakter ekle",placeholders:{armed:"Alarm {{arm_mode}} olarak ayarlanmıştır",disarmed:"Alarm şimdi KAPALI",triggered:"Alarm tetiklendi! Nedeni: {{open_sensors}}.",untriggered:"Alarm artık tetiklenmez.",arm_failure:"Alarm şu anda etkinleştirilemedi, çünkü: {{open_sensors}}.",arming:"Alarm birazdan devreye girecek, lütfen evi terk edin.",pending:"Alarm tetiklenmek üzere, hızlıca etkisiz hale getirin!"}},open_sensors_format:{heading:"open_sensors joker karakteri için biçim",description:"Mesaja hangi sensör bilgilerinin ekleneceğini seçin",options:{default:"İsimler ve durumlar",short:"Sadece isimler"}},arm_mode_format:{heading:"arm_mode joker karakteri için çeviri",description:"Alarm modunun mesaja hangi dilde ekleneceğini seçin"},target:{heading:"Hedef",description:"Bildirimin gönderileceği cihaz"},media_player_entity:{heading:"Medya oynatıcı varlığı",description:"Mesajı oynatmak için medya oynatıcı"},name:{heading:"İsim",description:"Bu bildirim için açıklama",placeholders:{armed:"Etkinleştirildiğinde {target} bilgilendir",disarmed:"Etkisizleştirildiğinde {target} bildir",triggered:"Tetiklendiğinde {target}'e bildir",untriggered:"Tetikleme durduğunda {hedef}'e bildir",arm_failure:"Başarısızlık durumunda {target}'e bildir",arming:"Ayrılırken {target}'e bildir",pending:"Geldiğinde {target}'e bildir"}},delete:{heading:"Otomasyonu sil",description:"Bu otomasyonu kalıcı olarak kaldırın"}},actions:{test:"Dene"}},new_action:{title:"Eylemi yapılandırın",description:"Alarmı devreye sokarken/devreden çıkarırken, etkinleştirme sırasında vb. ışıkları veya cihazları (sirenler gibi) yönetin.",fields:{event:{heading:"Etkinlik",description:"Eylem ne zaman gerçekleştirilmelidir"},area:{heading:"Alan",description:"Olayın geçerli olduğu alarm alanı."},mode:{heading:"Mod",description:"Eylemi belirli modlarla sınırlayın (isteğe bağlı)"},entity:{heading:"Varlık",description:"Üzerinde eylem gerçekleştirilecek varlık"},action:{heading:"Eylem",description:"Varlık üzerinde gerçekleştirilecek eylem",no_common_actions:"Eylemler seçilen varlıklar için yalnızca YAML modunda atanabilir."},name:{heading:"İsim",description:"Bu eylem için açıklama",placeholders:{armed:"Etkinleştirildiğinde {entity} öğesini {state} olarak ayarla",disarmed:"Etkisizleştirmenin ardından {entity} öğesini {state} olarak ayarlayın",triggered:"Tetiklendiğinde {entity} öğesini {state} olarak ayarla",untriggered:"Tetikleme durduğunda, {entity} öğesini {state} olarak ayarlayın",arm_failure:"Başarısızlık durumunda {entity} öğesini {state} olarak ayarla",arming:"Ayrılırken {entity} öğesini {state} olarak ayarlayın",pending:"Vardığımda {entity} öğesini {state} olarak ayarla"}}}}}}},qa={common:Na,components:Ha,title:Da,panels:Pa},Ba=Object.freeze({__proto__:null,common:Na,components:Ha,default:qa,panels:Pa,title:Da}),Ia={modes_short:{armed_away:"Poza domem",armed_home:"W domu",armed_night:"Noc",armed_custom_bypass:"Custom",armed_vacation:"Wakacje"},enabled:"Włączone",disabled:"Wyłączone"},Va={time_picker:{seconds:"sekundy",minutes:"minuty"},editor:{ui_mode:"Tryb UI",yaml_mode:"Tryb YAML",edit_in_yaml:"Edytuj w YAML"},table:{filter:{label:"Filtruj elementy",item:"Filtruj po {name}",hidden_items:"{number} {number, plural,\n  one { element jest}\n  other { elementy są}\n} ukryte"}}},Ra="Panel alarmu",Ua={general:{title:"Główne",cards:{general:{description:"Ten panel definiuje globalne ustawienia alarmu.",fields:{disarm_after_trigger:{heading:"Rozbrojenie po wywołaniu alarmu",description:"Po upływie zdefiniowanego czasu od wywołania alarmu zostanie on rozbrojony."},enable_mqtt:{heading:"Włącz MQTT",description:"Pozwala na sterowanie panelem alarmu za pomocą protokołu MQTT."},enable_master:{heading:"Włącz master alarm",description:"Tworzy encję do sterowania wszystkimi obszarami jednocześnie."}},actions:{setup_mqtt:"Konfiguracja MQTT",setup_master:"Konfiguracja master"}},modes:{title:"Tryby",description:"Ten panel służy do konfiguracji trybów uzbrojenia alarmu.",modes:{armed_away:"Tryb  'Poza domem' może być użyty, gdy wszyscy opuszczają dom. Wszystkie czujniki drzwi i okien oraz detektory ruchu wewnątrz domu będą aktywne.",armed_home:"Tryb 'W domu' może być użyty, gdy mieszkańcy są w domu. Wszystkie czujniki drzwi i okien będą aktywne, poza detektorami ruchu wewnątrz domu.",armed_night:"Tryb 'Noc' może być użyty, gdy domownicy idą spać. Wszystkie czujniki drzwi i okien będą aktywne, a wybrane detektory ruchu (np. na dole) będą aktywne.",armed_vacation:"Tryb 'Wakacje' może być użyty w przypadku dłuższej nieobecności w domu. Czasy opóźnienia i reakcje na wyzwolenie czujnikow i detektorów mogą być dowolnie definiowane, aby nie wszczynać fałszywego alarmu",armed_custom_bypass:"Dodatkowa opcja do definiowania własnego trybu działania alarmu."},number_sensors_active:"{number} {number, plural,\n  one {czujnik}\n  other {czujniki}\n} aktywne",fields:{status:{heading:"Stan",description:"Sprawdza, czy alarm może być uzbrojony w tym trybie."},exit_delay:{heading:"Opóźnienie uzbrojenia alarmu",description:"Alarm zostanie uzbrojony po ustawionym czasie, aby wszyscy mogli opuścić dom nie wywołując alarmu."},entry_delay:{heading:"Opóźnienie wywołania alarmu",description:"Zdefiniowany czas, aby domownicy mogli wejść do domu i rozbroić alarm."},trigger_time:{heading:"Czas działania alarmu",description:"Długość czasu aktywności alarmu po jego wyzwoleniu."}}},mqtt:{title:"Konfiguracja MQTT",description:"Ten panel służy do konfiguracji interfejsu MQTT.",fields:{state_topic:{heading:"Temat aktualizacji",description:"Temat, na którym publikowane są aktualizacje stanu alarmu"},event_topic:{heading:"Temat zdarzeń",description:"Temat, na którym publikowane są zdarzenia alarmowe"},command_topic:{heading:"Temat poleceń",description:"Temat, na którym są nasłuchiwane polecenia uzbrojenia/rozbrojenia alarmu."},require_code:{heading:"Wymagaj kodu",description:"Wymagaj przesłania kodu wraz z poleceniem."},state_payload:{heading:"Konfiguruj pakiet danych dla każdego stanu",item:"Zdefiniuj pakiet danych dla stanu ''{state}''"},command_payload:{heading:"Konfiguruj pakiet danych dla każdego polecenia",item:"Zdefiniuj pakiet danych dla polecenia ''{command}''"}}},areas:{title:"Strefy",description:"Strefy służą do podziału domu na kilka części, każda z nich działa niezależnie od siebie.",no_items:"Nie zdefiniowano jeszcze żadnych stref.",table:{remarks:"Uwagi",summary:"Ten obszar zawiera {summary_sensors} oraz {summary_automations}.",summary_sensors:"{number} {number, plural,\n  one {czujnik}\n  other {czujniki}\n}",summary_automations:"{number} {number, plural,\n  one {automatyzacja}\n  other {automatyzacje}\n}"},actions:{add:"Dodaj"}}},dialogs:{create_area:{title:"Nowa strefa",fields:{copy_from:"Skopiuj ustawienia z"}},edit_area:{title:"Edytowanie strefy ''{area}''",name_warning:"Uwaga: zmiana nazwy strefy spowoduje zmianę nazwy encji"},remove_area:{title:"Usunąć strefę?",description:"Czy na pewno chcesz usunąć tą strefę? Ta strefa zawiera {sensors} czujników i {automations} automatyzacji, które również zostaną usunięte."},edit_master:{title:"Konfiguracja nadrzędna"},disable_master:{title:"Wyłączyć konfigurację nadrzędną?",description:"Czy na pewno chcesz usunąć alarm nadrzędny? Ten obszar zawiera {automations} automatyzacje, które zostaną usunięte wraz z tą akcją."}}},sensors:{title:"Czujniki",cards:{sensors:{description:"Obecnie skonfigurowane czujniki. Kliknij, aby wprowadzić zmiany.",table:{no_items:"Brak czujników do wyświetlenia.",no_area_warning:"Czujnik nie jest przypisany do żadnej strefy.",arm_modes:"Tryby uzbrojenia",always_on:"(Zawsze)"}},add_sensors:{title:"Dodaj czujniki",description:"Dodaj więcej czujników. Upewnij się, że Twoje czujniki mają odpowiednią nazwę, aby można je było rozpoznać.",no_items:"Nie ma dostępnych encji HA, które można skonfigurować dla alarmu. Upewnij się, że uwzględniasz encje typu binary_sensor.",table:{type:"Wykryty rodzaj"},actions:{add_to_alarm:"Dodaj do alarmu",filter_supported:"Ukryj nieznane elementy"}},editor:{title:"Edytuj czujnik",description:"Konfigurowanie ustawień czujnika ''{entity}''.",fields:{entity:{heading:"Encja",description:"Encja powiązana z tym czujnikiem"},area:{heading:"Obszar",description:"Wybierz obszar, który zawiera ten czujnik."},group:{heading:"Grupa",description:"Grupuj z innymi czujnikami, aby używać ich łącznie."},device_type:{heading:"Typ urządzenia",description:"Wybierz typ urządzenia, odpowiednie ustawienia będą dobrane automatycznie.",choose:{door:{name:"Drzwi",description:"Drzwi, brama itp., którędy wchodzi się do domu."},window:{name:"Okno",description:"Okno lub drzwi nieużywane do wchodzenia do domu, takie jak balkon."},motion:{name:"Ruch",description:"Czujnik obecności lub podobne urządzenie mające opóźnienie między aktywacjami."},tamper:{name:"Sabotaż",description:"Detektor usunięcia pokrywy czujnika, czujnik stłuczenia szkła itp."},environmental:{name:"Środowisko",description:"Czujnik dymu/gazu, zalania itp. (nie związany z ochroną przed włamaniem)."},other:{name:"Ogólny"}}},always_on:{heading:"Zawsze włączony",description:"Czujnik powinien zawsze wywołać alarm."},modes:{heading:"Włączone tryby",description:"Tryby alarmu, w których ten czujnik jest aktywny."},arm_on_close:{heading:"Uzbrojenie po zamknięciu",description:"Po wykryciu zamknięcia, alarm się uzbroi."},use_exit_delay:{heading:"Użyj opóźnienia wyjścia",description:"Czujnik może być aktywny, w trakcie uzbrajania alarmu."},use_entry_delay:{heading:"Użyj opóźnienia wejścia",description:"Aktywacja czujnika wywoła alarm dopiero po uzbrojeniu się alarmu."},entry_delay:{heading:"Opóźnienie wejścia",description:"Zastąp opóźnienie (ustawione dla trybu bezpieczeństwa) konkretną wartością."},delay_on:{heading:"Delay on",description:"Sensor must remain active for this duration before triggering. Resets if sensor deactivates."},allow_open:{heading:"Pozwól na otwarcie",description:"Stan otwarty czujnika podczas uzbrajania jest ignorowany (kolejna aktywacja czujnika wyzwoli alarm)."},auto_bypass:{heading:"Automatyczne pomijanie",description:"Wyklucz ten czujnik z alarmu, jeśli jest otwarty podczas uzbrajania.",modes:"Tryby, w których czujnik może być pominięty"},trigger_unavailable:{heading:"Wyzwalaj, gdy niedostępny",description:"Gdy stan czujnika staje się 'niedostępny', czujnik jest wyzwalany."}},actions:{toggle_advanced:"Zaawansowane",remove:"Usuń",setup_groups:"Konfiguruj grupy"},errors:{description:"Proszę poprawić następujące błędy:",no_area:"Nie wybrano obszaru",no_modes:"Nie wybrano trybów, w których czujnik powinien być aktywny",no_auto_bypass_modes:"Nie wybrano trybów, w których czujnik może być automatycznie pominięty"}}},dialogs:{manage_groups:{title:"Zarządzaj grupami czujników",description:"W grupie czujników kilka czujników musi zostać aktywowanych w określonym czasie, aby alarm został uruchomiony.",no_items:"Brak grup",actions:{new_group:"Nowa grupa"}},create_group:{title:"Nowa grupa czujników",fields:{name:{heading:"Nazwa",description:"Nazwa grupy czujników"},timeout:{heading:"Limit czasu",description:"Okres czasu, w którym kolejne aktywacje czujników uruchamiają alarm."},event_count:{heading:"Liczba",description:"Liczba różnych czujników, które muszą zostać aktywowane, aby uruchomić alarm."},sensors:{heading:"Czujniki",description:"Wybierz czujniki, które są zawarte w tej grupie."}},errors:{invalid_name:"Podano nieprawidłową nazwę.",insufficient_sensors:"Należy wybrać przynajmniej 2 czujniki."}},edit_group:{title:"Edytuj grupę czujników ''{name}''"}}},codes:{title:"Kody",cards:{codes:{description:"Zmień ustawienia kodu.",fields:{code_arm_required:{heading:"Wymagaj kodu do uzbrojenia",description:"Aby uzbroić alarm, należy podać prawidłowy kod."},code_disarm_required:{heading:"Wymagaj kodu do rozbrojenia",description:"Aby rozbroić alarm, należy podać prawidłowy kod."},code_mode_change_required:{heading:"Wymagaj kodu do zmiany trybu",description:"Aby zmienić aktywny tryb uzbrojenia, należy podać prawidłowy kod."},code_format:{heading:"Format kodu",description:"Ustawia sposób wprowadzania kodu/hasła dla karty alarmu Lovelace.",code_format_number:"Kod PIN",code_format_text:"Hasło"}}},user_management:{title:"Zarządzanie użytkownikami",description:"Każdy użytkownik ma własny kod do uzbrojenia/rozbrojenia alarmu.",no_items:"Nie ma jeszcze użytkowników",actions:{new_user:"Nowy użytkownik"}},new_user:{title:"Utwórz nowego użytkownika",description:"Użytkownicy, którzy mają dostęp do obsługi alarmu.",fields:{name:{heading:"Nazwa",description:"Nazwa użytkownika."},code:{heading:"Kod",description:"Kod użytkownika."},confirm_code:{heading:"Potwierdź kod",description:"Powtórz kod."},can_arm:{heading:"Zezwól na kod do uzbrojenia",description:"Wprowadzenie tego kodu uzbroi alarm"},can_disarm:{heading:"Zezwól na kod do rozbrojenia",description:"Wprowadzenie tego kodu rozbroi alarm"},is_override_code:{heading:"Jest kodem nadrzędnym",description:"Wprowadzenie tego kodu uzbroi alarm siłowo"},area_limit:{heading:"Ograniczone obszary",description:"Ogranicz użytkownika do kontrolowania tylko wybranych obszarów"}},errors:{no_name:"Nie podano nazwy.",no_code:"Kod powinien mieć co najmniej 4 znaki/liczby.",code_mismatch:"Kody nie pasują do siebie."}},edit_user:{title:"Edytuj użytkownika",description:"Zmień konfigurację dla użytkownika ''{name}''.",fields:{old_code:{heading:"Obecny kod",description:"Obecny kod, pozostaw pusty, aby go nie zmieniać."}}}}},actions:{title:"Akcje",cards:{notifications:{title:"Powiadomienia",description:"Za pomocą tego panelu możesz zarządzać wysyłanymi powiadomieniami.",table:{no_items:"Nie utworzono jeszcze żadnych powiadomień.",no_area_warning:"Akcja nie jest przypisana do żadnego obszaru."},actions:{new_notification:"Nowe powiadomienie"}},actions:{description:"Ten panel może być użyty do przełączania urządzenia, gdy zmienia się stan alarmu.",table:{no_items:"Nie utworzono jeszcze żadnych akcji."},actions:{new_action:"Nowa akcja"}},new_notification:{title:"Konfiguruj powiadomienie",description:"Otrzymuj powiadomienie podczas uzbrajania/rozbrajania alarmu, aktywacji itp.",trigger:"Warunek",action:"Zadanie",options:"Opcje",fields:{event:{heading:"Zdarzenie",description:"Zdecyduj, kiedy powiadomienie powinno być wysłane",choose:{armed:{name:"Alarm jest uzbrojony",description:"Alarm został uzbrojony"},disarmed:{name:"Alarm jest rozbrojony",description:"Alarm został rozbrojony"},triggered:{name:"Wywołano alarm",description:"Alarm został wywołany"},untriggered:{name:"Zakończono alarm",description:"Alarm został zakończony"},arm_failure:{name:"Nie udało się uzbroić alarmu",description:"Uzbrojenie alarmu nie powiodło się z powodu co najmniej jednego otwartego czujnika"},arming:{name:"Rozpoczęto opóźnienie wyjścia",description:"Rozpoczęto opóźnienie wyjścia, wyjdź z domu."},pending:{name:"Rozpoczęto opóźnienie wejścia",description:"Rozpoczęto opóźnienie wejścia, alarm wkrótce będzie wywołany."}}},mode:{heading:"Tryb",description:"Ogranicz akcję do określonych trybów uzbrojenia (opcjonalnie)"},title:{heading:"Tytuł",description:"Tytuł powiadomienia"},message:{heading:"Wiadomość",description:"Treść powiadomienia",insert_wildcard:"Wstaw wildcard",placeholders:{armed:"Alarm jest ustawiony w trybie {{arm_mode}}",disarmed:"Alarm jest teraz wyłączony.",triggered:"Alarm został wyzwolony! Przyczyna: {{open_sensors}}.",untriggered:"Alarm nie jest już wyzwolony.",arm_failure:"Alarm nie mógł zostać uzbrojony w tej chwili z powodu: {{open_sensors}}.",arming:"Alarm wkrótce zostanie uzbrojony, wyjdż z domu.",pending:"Alarm wkrótce zostanie wywołany, rozbrój go!"}},open_sensors_format:{heading:"Format wildcard dla open_sensors",description:"Wybierz, które informacje o czujnikach są dodawane do wiadomości",options:{default:"Nazwy i stany",short:"Tylko nazwy"}},arm_mode_format:{heading:"Język dla wildcard arm_mode",description:"Wybierz, w jakim języku tryb uzbrojenia jest wstawiany do wiadomości"},target:{heading:"Urządzenie",description:"Urządzenie, do którego wysyłane będzie powiadomienie"},media_player_entity:{heading:"Encja odtwarzacza multimedialnego",description:"Wybierz głosnik, na którym będą odtwarzane wiadomości"},name:{heading:"Nazwa",description:"Opis dla tego powiadomienia",placeholders:{armed:"Powiadom {target} o uzbrojeniu",disarmed:"Powiadom {target} o rozbrojeniu",triggered:"Powiadom {target} o wywołaniu alarmu",untriggered:"Powiadom {target} o zakończeniu alarmu",arm_failure:"Powiadom {target} o niepowodzeniu",arming:"Powiadom {target} o opuszczeniu domu",pending:"Powiadom {target} o przybyciu do domu"}},delete:{heading:"Usuń automatyzację",description:"Trwale usuń tę automatyzację"}},actions:{test:"Wypróbuj"}},new_action:{title:"Konfiguruj akcję",description:"Przełącz światła lub urządzenia (takie jak syreny) podczas uzbrajania/rozbrajania alarmu, aktywacji itp.",fields:{event:{heading:"Zdarzenie",description:"Kiedy akcja powinna być wykonana"},area:{heading:"Strefa",description:"Strefa alarmu, dla którego zdarzenie ma zastosowanie."},mode:{heading:"Tryb",description:"Ogranicz akcję do określonych trybów uzbrojenia (opcjonalnie)"},entity:{heading:"Encja",description:"Encja, na której ma być wykonana akcja"},action:{heading:"Akcja",description:"Akcja do wykonania na encji",no_common_actions:"Akcje mogą być przypisane tylko w trybie YAML dla wybranych encji."},name:{heading:"Nazwa",description:"Opis dla tej akcji",placeholders:{armed:"Ustaw {entity} na {state} podczas uzbrajania alarmu",disarmed:"Ustaw {entity} na {state} podczas rozbrajania alarmu",triggered:"Ustaw {entity} na {state} gdy wywołano alarm",untriggered:"Ustaw {entity} na {state} gdy rozbroisz alarm",arm_failure:"Ustaw {entity} na {state} nie uda się rozbroić alarmu",arming:"Ustaw {entity} na {state} gdy opuszczasz dom",pending:"Ustaw {entity} na {state} gdy wchodzisz do domu"}}}}}}},Ga={common:Ia,components:Va,title:Ra,panels:Ua},Fa=Object.freeze({__proto__:null,common:Ia,components:Va,default:Ga,panels:Ua,title:Ra}),Ka={modes_short:{armed_away:"Ausente",armed_home:"Em casa",armed_night:"Noturno",armed_custom_bypass:"Personalizado",armed_vacation:"Férias"},enabled:"Ativado",disabled:"Desativado"},Za={time_picker:{seconds:"segundos",minutes:"minutos"},editor:{ui_mode:"Para UI",yaml_mode:"Para YAML",edit_in_yaml:"Editar em YAML"},table:{filter:{label:"Filtrar itens",item:"Filtrar por {name}",hidden_items:"{number} {number, plural,\n  one {item está}\n  other {itens estão}\n} oculto"}}},Wa="Painel de alarme",Ya={general:{title:"Geral",cards:{general:{description:"Este painel define algumas configurações globais para o alarme.",fields:{disarm_after_trigger:{heading:"Desarmar após o disparo",description:"Desarmar o alarme automaticamente em vez de retornar ao estado armado."},ignore_blocking_sensors_after_trigger:{heading:"Ignorar sensores de bloqueio ao rearmar",description:"Retornar ao estado armado sem verificar se há sensores que ainda podem estar ativos."},enable_mqtt:{heading:"Ativar MQTT",description:"Permitir que o painel de alarme seja controlado via MQTT."},enable_master:{heading:"Ativar alarme mestre",description:"Cria uma entidade para controlar todas as áreas simultaneamente."}},actions:{setup_mqtt:"Configuração MQTT",setup_master:"Configuração mestre"}},modes:{title:"Modos",description:"Este painel pode ser usado para configurar os modos de armamento do alarme.",modes:{armed_away:"Armado ausente será usado quando todas as pessoas saírem de casa. Todas as portas e janelas que permitem acesso à casa serão monitorizadas, assim como os sensores de movimento dentro da casa.",armed_home:"Armado em casa (também conhecido como estadia armada) será usado ao ativar o alarme enquanto há pessoas em casa. Todas as portas e janelas que permitem acesso à casa serão monitorizadas, mas não os sensores de movimento dentro da casa.",armed_night:"Armado noturno será usado ao configurar o alarme antes de dormir. Todas as portas e janelas que permitem acesso à casa serão monitorizadas, além de sensores de movimento selecionados dentro da casa.",armed_vacation:"Armado férias pode ser usado como extensão do modo armado ausente em caso de ausência prolongada. Os tempos de atraso e as respostas ao disparo podem ser adaptados conforme desejado.",armed_custom_bypass:"Um modo extra para definir o seu próprio perímetro de segurança."},number_sensors_active:"{number} {number, plural,\n  one {sensor}\n  other {sensores}\n} ativo",fields:{status:{heading:"Estado",description:"Controla se o alarme pode ser armado neste modo."},exit_delay:{heading:"Atraso de saída",description:"Ao armar o alarme, dentro deste período os sensores ainda não dispararão o alarme."},entry_delay:{heading:"Atraso de entrada",description:"Tempo de atraso até que o alarme seja disparado após um dos sensores ser ativado."},trigger_time:{heading:"Tempo de disparo",description:"Tempo durante o qual o alarme permanecerá no estado disparado após a ativação."}}},mqtt:{title:"Configuração MQTT",description:"Este painel pode ser usado para configurar a interface MQTT.",fields:{state_topic:{heading:"Tópico de estado",description:"Tópico no qual as atualizações de estado são publicadas."},event_topic:{heading:"Tópico de evento",description:"Tópico no qual os eventos de alarme são publicados."},command_topic:{heading:"Tópico de comando",description:"Tópico que o Alarmo monitoriza para comandos de armar/desarmar."},require_code:{heading:"Exigir código",description:"Exige que o código seja enviado junto com o comando."},state_payload:{heading:"Configurar payload por estado",item:"Definir um payload para o estado ''{state}''"},command_payload:{heading:"Configurar payload por comando",item:"Definir um payload para o comando ''{command}''"}}},areas:{title:"Áreas",description:"As áreas podem ser usadas para dividir o sistema de alarme em múltiplos compartimentos.",no_items:"Não há áreas definidas ainda.",table:{remarks:"Observações",summary:"Esta área contém {summary_sensors} e {summary_automations}.",summary_sensors:"{number} {number, plural,\n  one {sensor}\n  other {sensores}\n}",summary_automations:"{number} {number, plural,\n  one {automação}\n  other {automações}\n}"},actions:{add:"Adicionar"}}},dialogs:{create_area:{title:"Nova área",fields:{copy_from:"Copiar configurações de"}},edit_area:{title:"Editando área ''{area}''",name_warning:"Nota: alterar o nome irá alterar o ID da entidade."},remove_area:{title:"Remover área?",description:"Tem a certeza que pretende remover esta área? Esta área contém {sensors} sensores e {automations} automações, que também serão removidos."},edit_master:{title:"Configuração mestre"},disable_master:{title:"Desativar mestre?",description:"Tem a certeza que pretende remover o alarme mestre? Esta área contém {automations} automações, que serão removidas com esta ação."}}},sensors:{title:"Sensores",cards:{sensors:{description:"Sensores configurados atualmente. Clique num item para fazer alterações.",table:{no_items:"Não há sensores para exibir aqui.",no_area_warning:"O sensor não está atribuído a nenhuma área.",arm_modes:"Modos de armamento",always_on:"(Sempre)"}},add_sensors:{title:"Adicionar sensores",description:"Adicione mais sensores. Certifique-se de que os seus sensores tenham um nome adequado para que possa identificá-los.",no_items:"Não há entidades do HA disponíveis para configurar no alarme. Certifique-se de incluir entidades do tipo binary_sensor.",table:{type:"Tipo detectado"},actions:{add_to_alarm:"Adicionar ao alarme",filter_supported:"Ocultar itens com tipo desconhecido"}},editor:{title:"Editar sensor",description:"Configurando os ajustes do sensor ''{entity}''.",fields:{entity:{heading:"Entidade",description:"Entidade associada a este sensor."},area:{heading:"Área",description:"Selecione uma área que contenha este sensor."},group:{heading:"Grupo",description:"Agrupar com outros sensores para disparo combinado."},device_type:{heading:"Tipo de dispositivo",description:"Escolha um tipo de dispositivo para aplicar automaticamente as configurações adequadas.",choose:{door:{name:"Porta",description:"Uma porta, portão ou outra entrada usada para entrar/sair de casa."},window:{name:"Janela",description:"Uma janela ou porta não usada para entrar em casa, como uma varanda."},motion:{name:"Movimento",description:"Sensor de presença ou dispositivo similar com atraso entre ativações."},tamper:{name:"Adulteração",description:"Detector de remoção da tampa do sensor, sensor de quebra de vidro, etc."},environmental:{name:"Ambiental",description:"Sensor de fumo/gás, detector de fuga, etc. (não relacionado à proteção contra invasão)."},other:{name:"Genérico"}}},always_on:{heading:"Sempre ativo",description:"O sensor deve sempre disparar o alarme."},modes:{heading:"Modos ativados",description:"Modos de alarme nos quais este sensor está ativo."},arm_on_close:{heading:"Armar ao fechar",description:"Após a desativação deste sensor, o atraso de saída restante será ignorado automaticamente."},use_exit_delay:{heading:"Usar atraso de saída",description:"O sensor pode estar ativo quando o atraso de saída começar."},use_entry_delay:{heading:"Usar atraso de entrada",description:"A ativação do sensor dispara o alarme após o atraso de entrada, e não imediatamente."},entry_delay:{heading:"Atraso de entrada",description:"Substituir o atraso de entrada (configurado para o modo de armamento) por um atraso específico para o sensor."},delay_on:{heading:"Atraso de ativação",description:"O sensor deve permanecer ativo por esta duração antes de disparar. Reinicia se o sensor desativar."},allow_open:{heading:"Permitir aberto inicialmente",description:"O estado aberto durante o armamento é ignorado (ativação subsequente do sensor disparará o alarme)."},auto_bypass:{heading:"Ignorar automaticamente",description:"Excluir este sensor do alarme se estiver aberto durante o armamento.",modes:"Modos nos quais o sensor pode ser ignorado"},trigger_unavailable:{heading:"Disparar quando indisponível",description:"Quando o estado do sensor se torna 'indisponível', isso ativará o sensor."}},actions:{toggle_advanced:"Configurações avançadas",remove:"Remover",setup_groups:"Configurar grupos"},errors:{description:"Por favor, corrija os seguintes erros:",no_area:"Nenhuma área selecionada",no_modes:"Nenhum modo selecionado para o qual o sensor deve estar ativo",no_auto_bypass_modes:"Nenhum modo selecionado para o qual o sensor pode ser ignorado automaticamente"}}},dialogs:{manage_groups:{title:"Gerir grupos de sensores",description:"Num grupo de sensores, múltiplos sensores devem ser ativados dentro de um período de tempo antes que o alarme seja disparado.",no_items:"Nenhum grupo ainda",actions:{new_group:"Novo grupo"}},create_group:{title:"Novo grupo de sensores",fields:{name:{heading:"Nome",description:"Nome para o grupo de sensores."},timeout:{heading:"Tempo limite",description:"Período de tempo durante o qual ativações consecutivas de sensores disparam o alarme."},event_count:{heading:"Contagem",description:"Quantidade de sensores diferentes que precisam ser ativados para disparar o alarme."},sensors:{heading:"Sensores",description:"Selecione os sensores que fazem parte deste grupo."}},errors:{invalid_name:"Nome fornecido inválido.",insufficient_sensors:"Pelo menos 2 sensores precisam ser selecionados."}},edit_group:{title:"Editar grupo de sensores ''{name}''"}}},codes:{title:"Códigos",cards:{codes:{description:"Alterar as configurações do código.",fields:{code_arm_required:{heading:"Exigir código para armar",description:"Um código válido deve ser fornecido para armar o alarme."},code_disarm_required:{heading:"Exigir código para desarmar",description:"Um código válido deve ser fornecido para desarmar o alarme."},code_mode_change_required:{heading:"Exigir código para trocar de modo",description:"Um código válido deve ser fornecido para alterar o modo de armamento ativo."},code_format:{heading:"Formato do código",description:"Define o tipo de entrada para o card de alarme do Lovelace.",code_format_number:"PIN",code_format_text:"Senha"}}},user_management:{title:"Gestão de utilizadores",description:"Cada utilizador tem o seu próprio código para armar/desarmar o alarme.",no_items:"Não há utilizadores ainda",actions:{new_user:"Novo utilizador"}},new_user:{title:"Criar novo utilizador",description:"Utilizadores podem ser criados para fornecer acesso à operação do alarme.",fields:{name:{heading:"Nome",description:"Nome do utilizador."},code:{heading:"Código",description:"Código para este utilizador."},confirm_code:{heading:"Confirmar código",description:"Repita o código."},can_arm:{heading:"Permitir código para armar",description:"Inserir este código ativa o alarme."},can_disarm:{heading:"Permitir código para desarmar",description:"Inserir este código desativa o alarme."},is_override_code:{heading:"É código de substituição",description:"Inserir este código irá forçar o armamento do alarme."},area_limit:{heading:"Áreas restritas",description:"Limitar o utilizador a controlar apenas as áreas selecionadas."}},errors:{no_name:"Nenhum nome fornecido.",no_code:"O código deve ter no mínimo 4 caracteres/números.",code_mismatch:"Os códigos não coincidem."}},edit_user:{title:"Editar utilizador",description:"Alterar configurações do utilizador ''{name}''.",fields:{old_code:{heading:"Código atual",description:"Código atual, deixe em branco para não alterar."}}}}},actions:{title:"Ações",cards:{notifications:{title:"Notificações",description:"Neste painel pode gerir notificações a serem enviadas quando um determinado evento de alarme ocorrer.",table:{no_items:"Não há notificações criadas ainda.",no_area_warning:"A ação não está atribuída a nenhuma área."},actions:{new_notification:"Nova notificação"}},actions:{description:"Este painel pode ser usado para acionar um dispositivo quando o estado do alarme mudar.",table:{no_items:"Não há ações criadas ainda."},actions:{new_action:"Nova ação"}},new_notification:{title:"Configurar notificação",description:"Receba uma notificação ao armar/desarmar o alarme, na ativação, etc.",trigger:"Condição",action:"Tarefa",options:"Opções",fields:{event:{heading:"Evento",description:"Quando a notificação deve ser enviada.",choose:{armed:{name:"Alarme está armado",description:"O alarme foi armado com sucesso."},disarmed:{name:"Alarme está desarmado",description:"O alarme está desarmado."},triggered:{name:"Alarme foi disparado",description:"O alarme foi disparado."},untriggered:{name:"Alarme não está mais disparado",description:"O estado de disparo do alarme terminou."},arm_failure:{name:"Falha ao armar",description:"O armamento do alarme falhou devido a um ou mais sensores abertos."},arming:{name:"Atraso de saída iniciado",description:"Atraso de saída iniciado, pronto para sair de casa."},pending:{name:"Atraso de entrada iniciado",description:"Atraso de entrada iniciado, o alarme será disparado em breve."}}},mode:{heading:"Modo",description:"Limitar a ação a modos de armamento específicos (opcional)."},title:{heading:"Título",description:"Título da mensagem de notificação."},message:{heading:"Mensagem",description:"Conteúdo da mensagem de notificação.",insert_wildcard:"Inserir marcador",placeholders:{armed:"O alarme está configurado para {{arm_mode}}",disarmed:"O alarme está DESLIGADO",triggered:"O alarme foi disparado! Causa: {{open_sensors}}.",untriggered:"O alarme não está mais disparado.",arm_failure:"O alarme não pôde ser armado agora, devido a: {{open_sensors}}.",arming:"O alarme será armado em breve, por favor saia de casa.",pending:"O alarme está prestes a disparar, desarme rapidamente!"}},open_sensors_format:{heading:"Formato para o marcador open_sensors",description:"Escolha quais informações do sensor são inseridas na mensagem.",options:{default:"Nomes e estados",short:"Apenas nomes"}},arm_mode_format:{heading:"Tradução para o marcador arm_mode",description:"Escolha em qual idioma o modo de armamento é inserido na mensagem."},target:{heading:"Destino",description:"Dispositivo para enviar a notificação."},media_player_entity:{heading:"Entidade de media player",description:"Media player para reproduzir a mensagem."},name:{heading:"Nome",description:"Descrição para esta notificação.",placeholders:{armed:"Notificar {target} ao armar",disarmed:"Notificar {target} ao desarmar",triggered:"Notificar {target} quando disparado",untriggered:"Notificar {target} quando o disparo parar",arm_failure:"Notificar {target} em caso de falha",arming:"Notificar {target} ao sair",pending:"Notificar {target} ao chegar"}},delete:{heading:"Eliminar automação",description:"Remover permanentemente esta automação."}},actions:{test:"Testar"}},new_action:{title:"Configurar ação",description:"Acionar luzes ou dispositivos (como sirenes) ao armar/desarmar o alarme, na ativação, etc.",fields:{event:{heading:"Evento",description:"Quando a ação deve ser executada."},area:{heading:"Área",description:"Área do alarme para a qual o evento se aplica."},mode:{heading:"Modo",description:"Limitar a ação a modos de armamento específicos (opcional)."},entity:{heading:"Entidade",description:"Entidade na qual realizar a ação."},action:{heading:"Ação",description:"Ação a realizar na entidade.",no_common_actions:"As ações só podem ser atribuídas em modo YAML para as entidades selecionadas."},name:{heading:"Nome",description:"Descrição para esta ação.",placeholders:{armed:"Definir {entity} para {state} ao armar",disarmed:"Definir {entity} para {state} ao desarmar",triggered:"Definir {entity} para {state} quando disparado",untriggered:"Definir {entity} para {state} quando o disparo parar",arm_failure:"Definir {entity} para {state} em caso de falha",arming:"Definir {entity} para {state} ao sair",pending:"Definir {entity} para {state} ao chegar"}}}}}}},Qa={common:Ka,components:Za,title:Wa,panels:Ya},Ja=Object.freeze({__proto__:null,common:Ka,components:Za,default:Qa,panels:Ya,title:Wa}),Xa={modes_short:{armed_away:"Ausente",armed_home:"Em casa",armed_night:"Noturno",armed_custom_bypass:"Personalizado",armed_vacation:"Férias"},enabled:"Ativado",disabled:"Desativado"},ei={time_picker:{seconds:"segundos",minutes:"minutos"},editor:{ui_mode:"Para UI",yaml_mode:"Para YAML",edit_in_yaml:"Editar em YAML"},table:{filter:{label:"Filtrar itens",item:"Filtrar por {name}",hidden_items:"{number} {number, plural,\n  one {item está}\n  other {itens estão}\n} oculto"}}},ti="Painel de alarme",ai={general:{title:"Geral",cards:{general:{description:"Este painel define algumas configurações globais para o alarme.",fields:{disarm_after_trigger:{heading:"Desarmar após o disparo",description:"Desarmar o alarme automaticamente em vez de retornar ao estado armado."},ignore_blocking_sensors_after_trigger:{heading:"Ignorar sensores de bloqueio ao rearmar",description:"Retornar ao estado armado sem verificar se há sensores que ainda podem estar ativos."},enable_mqtt:{heading:"Ativar MQTT",description:"Permitir que o painel de alarme seja controlado via MQTT."},enable_master:{heading:"Ativar alarme mestre",description:"Cria uma entidade para controlar todas as áreas simultaneamente."}},actions:{setup_mqtt:"Configuração MQTT",setup_master:"Configuração mestre"}},modes:{title:"Modos",description:"Este painel pode ser usado para configurar os modos de armamento do alarme.",modes:{armed_away:"Armado ausente será usado quando todas as pessoas saírem de casa. Todas as portas e janelas que permitem acesso à casa serão monitoradas, assim como os sensores de movimento dentro da casa.",armed_home:"Armado em casa (também conhecido como estadia armada) será usado ao ativar o alarme enquanto há pessoas em casa. Todas as portas e janelas que permitem acesso à casa serão monitoradas, mas não os sensores de movimento dentro da casa.",armed_night:"Armado noturno será usado ao configurar o alarme antes de dormir. Todas as portas e janelas que permitem acesso à casa serão monitoradas, além de sensores de movimento selecionados dentro da casa.",armed_vacation:"Armado férias pode ser usado como extensão do modo armado ausente em caso de ausência prolongada. Os tempos de atraso e as respostas ao disparo podem ser adaptados conforme desejado.",armed_custom_bypass:"Um modo extra para definir seu próprio perímetro de segurança."},number_sensors_active:"{number} {number, plural,\n  one {sensor}\n  other {sensores}\n} ativo",fields:{status:{heading:"Estado",description:"Controla se o alarme pode ser armado neste modo."},exit_delay:{heading:"Atraso de saída",description:"Ao armar o alarme, dentro deste período os sensores ainda não dispararão o alarme."},entry_delay:{heading:"Atraso de entrada",description:"Tempo de atraso até que o alarme seja disparado após um dos sensores ser ativado."},trigger_time:{heading:"Tempo de disparo",description:"Tempo durante o qual o alarme permanecerá no estado disparado após a ativação."}}},mqtt:{title:"Configuração MQTT",description:"Este painel pode ser usado para configurar a interface MQTT.",fields:{state_topic:{heading:"Tópico de estado",description:"Tópico no qual as atualizações de estado são publicadas."},event_topic:{heading:"Tópico de evento",description:"Tópico no qual os eventos de alarme são publicados."},command_topic:{heading:"Tópico de comando",description:"Tópico que o Alarmo monitora para comandos de armar/desarmar."},require_code:{heading:"Exigir código",description:"Exige que o código seja enviado junto com o comando."},state_payload:{heading:"Configurar payload por estado",item:"Definir um payload para o estado ''{state}''"},command_payload:{heading:"Configurar payload por comando",item:"Definir um payload para o comando ''{command}''"}}},areas:{title:"Áreas",description:"As áreas podem ser usadas para dividir o sistema de alarme em múltiplos compartimentos.",no_items:"Não há áreas definidas ainda.",table:{remarks:"Observações",summary:"Esta área contém {summary_sensors} e {summary_automations}.",summary_sensors:"{number} {number, plural,\n  one {sensor}\n  other {sensores}\n}",summary_automations:"{number} {number, plural,\n  one {automação}\n  other {automações}\n}"},actions:{add:"Adicionar"}}},dialogs:{create_area:{title:"Nova área",fields:{copy_from:"Copiar configurações de"}},edit_area:{title:"Editando área ''{area}''",name_warning:"Nota: alterar o nome irá alterar o ID da entidade."},remove_area:{title:"Remover área?",description:"Tem certeza que deseja remover esta área? Esta área contém {sensors} sensores e {automations} automações, que também serão removidos."},edit_master:{title:"Configuração mestre"},disable_master:{title:"Desativar mestre?",description:"Tem certeza que deseja remover o alarme mestre? Esta área contém {automations} automações, que serão removidas com esta ação."}}},sensors:{title:"Sensores",cards:{sensors:{description:"Sensores configurados atualmente. Clique em um item para fazer alterações.",table:{no_items:"Não há sensores para exibir aqui.",no_area_warning:"O sensor não está atribuído a nenhuma área.",arm_modes:"Modos de armamento",always_on:"(Sempre)"}},add_sensors:{title:"Adicionar sensores",description:"Adicione mais sensores. Certifique-se de que seus sensores tenham um nome adequado para que você possa identificá-los.",no_items:"Não há entidades do HA disponíveis para configurar no alarme. Certifique-se de incluir entidades do tipo binary_sensor.",table:{type:"Tipo detectado"},actions:{add_to_alarm:"Adicionar ao alarme",filter_supported:"Ocultar itens com tipo desconhecido"}},editor:{title:"Editar sensor",description:"Configurando os ajustes do sensor ''{entity}''.",fields:{entity:{heading:"Entidade",description:"Entidade associada a este sensor."},area:{heading:"Área",description:"Selecione uma área que contenha este sensor."},group:{heading:"Grupo",description:"Agrupar com outros sensores para disparo combinado."},device_type:{heading:"Tipo de dispositivo",description:"Escolha um tipo de dispositivo para aplicar automaticamente as configurações adequadas.",choose:{door:{name:"Porta",description:"Uma porta, portão ou outra entrada usada para entrar/sair de casa."},window:{name:"Janela",description:"Uma janela ou porta não usada para entrar em casa, como uma varanda."},motion:{name:"Movimento",description:"Sensor de presença ou dispositivo similar com atraso entre ativações."},tamper:{name:"Adulteração",description:"Detector de remoção da tampa do sensor, sensor de quebra de vidro, etc."},environmental:{name:"Ambiental",description:"Sensor de fumaça/gás, detector de vazamento, etc. (não relacionado à proteção contra invasão)."},other:{name:"Genérico"}}},always_on:{heading:"Sempre ativo",description:"O sensor deve sempre disparar o alarme."},modes:{heading:"Modos ativados",description:"Modos de alarme nos quais este sensor está ativo."},arm_on_close:{heading:"Armar ao fechar",description:"Após a desativação deste sensor, o atraso de saída restante será ignorado automaticamente."},use_exit_delay:{heading:"Usar atraso de saída",description:"O sensor pode estar ativo quando o atraso de saída começar."},use_entry_delay:{heading:"Usar atraso de entrada",description:"A ativação do sensor dispara o alarme após o atraso de entrada, e não imediatamente."},entry_delay:{heading:"Atraso de entrada",description:"Substituir o atraso de entrada (configurado para o modo de armamento) por um atraso específico para o sensor."},delay_on:{heading:"Atraso de ativação",description:"O sensor deve permanecer ativo por esta duração antes de disparar. Reinicia se o sensor desativar."},allow_open:{heading:"Permitir aberto inicialmente",description:"O estado aberto durante o armamento é ignorado (ativação subsequente do sensor disparará o alarme)."},auto_bypass:{heading:"Ignorar automaticamente",description:"Excluir este sensor do alarme se estiver aberto durante o armamento.",modes:"Modos nos quais o sensor pode ser ignorado"},trigger_unavailable:{heading:"Disparar quando indisponível",description:"Quando o estado do sensor se torna 'indisponível', isso ativará o sensor."}},actions:{toggle_advanced:"Configurações avançadas",remove:"Remover",setup_groups:"Configurar grupos"},errors:{description:"Por favor, corrija os seguintes erros:",no_area:"Nenhuma área selecionada",no_modes:"Nenhum modo selecionado para o qual o sensor deve estar ativo",no_auto_bypass_modes:"Nenhum modo selecionado para o qual o sensor pode ser ignorado automaticamente"}}},dialogs:{manage_groups:{title:"Gerenciar grupos de sensores",description:"Em um grupo de sensores, múltiplos sensores devem ser ativados dentro de um período de tempo antes que o alarme seja disparado.",no_items:"Nenhum grupo ainda",actions:{new_group:"Novo grupo"}},create_group:{title:"Novo grupo de sensores",fields:{name:{heading:"Nome",description:"Nome para o grupo de sensores."},timeout:{heading:"Tempo limite",description:"Período de tempo durante o qual ativações consecutivas de sensores disparam o alarme."},event_count:{heading:"Contagem",description:"Quantidade de sensores diferentes que precisam ser ativados para disparar o alarme."},sensors:{heading:"Sensores",description:"Selecione os sensores que fazem parte deste grupo."}},errors:{invalid_name:"Nome fornecido inválido.",insufficient_sensors:"Pelo menos 2 sensores precisam ser selecionados."}},edit_group:{title:"Editar grupo de sensores ''{name}''"}}},codes:{title:"Códigos",cards:{codes:{description:"Alterar as configurações do código.",fields:{code_arm_required:{heading:"Exigir código para armar",description:"Um código válido deve ser fornecido para armar o alarme."},code_disarm_required:{heading:"Exigir código para desarmar",description:"Um código válido deve ser fornecido para desarmar o alarme."},code_mode_change_required:{heading:"Exigir código para trocar de modo",description:"Um código válido deve ser fornecido para alterar o modo de armamento ativo."},code_format:{heading:"Formato do código",description:"Define o tipo de entrada para o card de alarme do Lovelace.",code_format_number:"PIN",code_format_text:"Senha"}}},user_management:{title:"Gerenciamento de usuários",description:"Cada usuário tem seu próprio código para armar/desarmar o alarme.",no_items:"Não há usuários ainda",actions:{new_user:"Novo usuário"}},new_user:{title:"Criar novo usuário",description:"Usuários podem ser criados para fornecer acesso à operação do alarme.",fields:{name:{heading:"Nome",description:"Nome do usuário."},code:{heading:"Código",description:"Código para este usuário."},confirm_code:{heading:"Confirmar código",description:"Repita o código."},can_arm:{heading:"Permitir código para armar",description:"Inserir este código ativa o alarme."},can_disarm:{heading:"Permitir código para desarmar",description:"Inserir este código desativa o alarme."},is_override_code:{heading:"É código de substituição",description:"Inserir este código irá forçar o armamento do alarme."},area_limit:{heading:"Áreas restritas",description:"Limitar o usuário a controlar apenas as áreas selecionadas."}},errors:{no_name:"Nenhum nome fornecido.",no_code:"O código deve ter no mínimo 4 caracteres/números.",code_mismatch:"Os códigos não coincidem."}},edit_user:{title:"Editar usuário",description:"Alterar configurações do usuário ''{name}''.",fields:{old_code:{heading:"Código atual",description:"Código atual, deixe em branco para não alterar."}}}}},actions:{title:"Ações",cards:{notifications:{title:"Notificações",description:"Neste painel você pode gerenciar notificações a serem enviadas quando um determinado evento de alarme ocorrer.",table:{no_items:"Não há notificações criadas ainda.",no_area_warning:"A ação não está atribuída a nenhuma área."},actions:{new_notification:"Nova notificação"}},actions:{description:"Este painel pode ser usado para acionar um dispositivo quando o estado do alarme mudar.",table:{no_items:"Não há ações criadas ainda."},actions:{new_action:"Nova ação"}},new_notification:{title:"Configurar notificação",description:"Receba uma notificação ao armar/desarmar o alarme, na ativação, etc.",trigger:"Condição",action:"Tarefa",options:"Opções",fields:{event:{heading:"Evento",description:"Quando a notificação deve ser enviada.",choose:{armed:{name:"Alarme está armado",description:"O alarme foi armado com sucesso."},disarmed:{name:"Alarme está desarmado",description:"O alarme está desarmado."},triggered:{name:"Alarme foi disparado",description:"O alarme foi disparado."},untriggered:{name:"Alarme não está mais disparado",description:"O estado de disparo do alarme terminou."},arm_failure:{name:"Falha ao armar",description:"O armamento do alarme falhou devido a um ou mais sensores abertos."},arming:{name:"Atraso de saída iniciado",description:"Atraso de saída iniciado, pronto para sair de casa."},pending:{name:"Atraso de entrada iniciado",description:"Atraso de entrada iniciado, o alarme será disparado em breve."}}},mode:{heading:"Modo",description:"Limitar a ação a modos de armamento específicos (opcional)."},title:{heading:"Título",description:"Título da mensagem de notificação."},message:{heading:"Mensagem",description:"Conteúdo da mensagem de notificação.",insert_wildcard:"Inserir curinga",placeholders:{armed:"O alarme está configurado para {{arm_mode}}",disarmed:"O alarme está DESLIGADO",triggered:"O alarme foi disparado! Causa: {{open_sensors}}.",untriggered:"O alarme não está mais disparado.",arm_failure:"O alarme não pôde ser armado agora, devido a: {{open_sensors}}.",arming:"O alarme será armado em breve, por favor saia de casa.",pending:"O alarme está prestes a disparar, desarme rapidamente!"}},open_sensors_format:{heading:"Formato para o curinga open_sensors",description:"Escolha quais informações do sensor são inseridas na mensagem.",options:{default:"Nomes e estados",short:"Apenas nomes"}},arm_mode_format:{heading:"Tradução para o curinga arm_mode",description:"Escolha em qual idioma o modo de armamento é inserido na mensagem."},target:{heading:"Destino",description:"Dispositivo para enviar a notificação."},media_player_entity:{heading:"Entidade de media player",description:"Media player para reproduzir a mensagem."},name:{heading:"Nome",description:"Descrição para esta notificação.",placeholders:{armed:"Notificar {target} ao armar",disarmed:"Notificar {target} ao desarmar",triggered:"Notificar {target} quando disparado",untriggered:"Notificar {target} quando o disparo parar",arm_failure:"Notificar {target} em caso de falha",arming:"Notificar {target} ao sair",pending:"Notificar {target} ao chegar"}},delete:{heading:"Excluir automação",description:"Remover permanentemente esta automação."}},actions:{test:"Testar"}},new_action:{title:"Configurar ação",description:"Acionar luzes ou dispositivos (como sirenes) ao armar/desarmar o alarme, na ativação, etc.",fields:{event:{heading:"Evento",description:"Quando a ação deve ser executada."},area:{heading:"Área",description:"Área do alarme para a qual o evento se aplica."},mode:{heading:"Modo",description:"Limitar a ação a modos de armamento específicos (opcional)."},entity:{heading:"Entidade",description:"Entidade na qual realizar a ação."},action:{heading:"Ação",description:"Ação a realizar na entidade.",no_common_actions:"As ações só podem ser atribuídas em modo YAML para as entidades selecionadas."},name:{heading:"Nome",description:"Descrição para esta ação.",placeholders:{armed:"Definir {entity} para {state} ao armar",disarmed:"Definir {entity} para {state} ao desarmar",triggered:"Definir {entity} para {state} quando disparado",untriggered:"Definir {entity} para {state} quando o disparo parar",arm_failure:"Definir {entity} para {state} em caso de falha",arming:"Definir {entity} para {state} ao sair",pending:"Definir {entity} para {state} ao chegar"}}}}}}},ii={common:Xa,components:ei,title:ti,panels:ai},si=Object.freeze({__proto__:null,common:Xa,components:ei,default:ii,panels:ai,title:ti});function ni(e,t){var a=t&&t.cache?t.cache:gi,i=t&&t.serializer?t.serializer:mi;return(t&&t.strategy?t.strategy:li)(e,{cache:a,serializer:i});}function ri(e,t,a,i){var s,n=null==(s=i)||"number"==typeof s||"boolean"==typeof s?i:a(i),r=t.get(n);return void 0===r&&(r=e.call(this,i),t.set(n,r)),r;}function oi(e,t,a){var i=Array.prototype.slice.call(arguments,3),s=a(i),n=t.get(s);return void 0===n&&(n=e.apply(this,i),t.set(s,n)),n;}function di(e,t,a,i,s){return a.bind(t,e,i,s);}function li(e,t){return di(e,this,1===e.length?ri:oi,t.cache.create(),t.serializer);}var ci,hi,pi,mi=function(){return JSON.stringify(arguments);},ui=function(){function e(){this.cache=Object.create(null);}return e.prototype.get=function(e){return this.cache[e];},e.prototype.set=function(e,t){this.cache[e]=t;},e;}(),gi={create:function(){return new ui();}},vi={variadic:function(e,t){return di(e,this,oi,t.cache.create(),t.serializer);}};function yi(e){return e.type===hi.literal;}function bi(e){return e.type===hi.argument;}function _i(e){return e.type===hi.number;}function fi(e){return e.type===hi.date;}function ki(e){return e.type===hi.time;}function wi(e){return e.type===hi.select;}function $i(e){return e.type===hi.plural;}function zi(e){return e.type===hi.pound;}function Ai(e){return e.type===hi.tag;}function xi(e){return!(!e||"object"!=typeof e||e.type!==pi.number);}function ji(e){return!(!e||"object"!=typeof e||e.type!==pi.dateTime);}!function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG";}(ci||(ci={})),function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag";}(hi||(hi={})),function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime";}(pi||(pi={}));var Si=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/,Oi=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function Ci(e){var t={};return e.replace(Oi,function(e){var a=e.length;switch(e[0]){case"G":t.era=4===a?"long":5===a?"narrow":"short";break;case"y":t.year=2===a?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][a-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][a-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=4===a?"long":5===a?"narrow":"short";break;case"e":if(a<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][a-4];break;case"c":if(a<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][a-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][a-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][a-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][a-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][a-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][a-1];break;case"s":t.second=["numeric","2-digit"][a-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=a<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead");}return"";}),t;}var Ti=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function Ei(e){return e.replace(/^(.*?)-/,"");}var Mi=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,Li=/^(@+)?(\+|#+)?[rs]?$/g,Ni=/(\*)(0+)|(#+)(0+)|(0+)/g,Hi=/^(0+)$/;function Di(e){var t={};return"r"===e[e.length-1]?t.roundingPriority="morePrecision":"s"===e[e.length-1]&&(t.roundingPriority="lessPrecision"),e.replace(Li,function(e,a,i){return"string"!=typeof i?(t.minimumSignificantDigits=a.length,t.maximumSignificantDigits=a.length):"+"===i?t.minimumSignificantDigits=a.length:"#"===a[0]?t.maximumSignificantDigits=a.length:(t.minimumSignificantDigits=a.length,t.maximumSignificantDigits=a.length+("string"==typeof i?i.length:0)),"";}),t;}function Pi(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"};}}function qi(e){var t;if("E"===e[0]&&"E"===e[1]?(t={notation:"engineering"},e=e.slice(2)):"E"===e[0]&&(t={notation:"scientific"},e=e.slice(1)),t){var a=e.slice(0,2);if("+!"===a?(t.signDisplay="always",e=e.slice(2)):"+?"===a&&(t.signDisplay="exceptZero",e=e.slice(2)),!Hi.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length;}return t;}function Bi(e){var t=Pi(e);return t||{};}function Ii(e){for(var t={},i=0,s=e;i<s.length;i++){var n=s[i];switch(n.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=n.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=Ei(n.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=a(a(a({},t),{notation:"scientific"}),n.options.reduce(function(e,t){return a(a({},e),Bi(t));},{}));continue;case"engineering":t=a(a(a({},t),{notation:"engineering"}),n.options.reduce(function(e,t){return a(a({},e),Bi(t));},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(n.options[0]);continue;case"rounding-mode-floor":t.roundingMode="floor";continue;case"rounding-mode-ceiling":t.roundingMode="ceil";continue;case"rounding-mode-down":t.roundingMode="trunc";continue;case"rounding-mode-up":t.roundingMode="expand";continue;case"rounding-mode-half-even":t.roundingMode="halfEven";continue;case"rounding-mode-half-down":t.roundingMode="halfTrunc";continue;case"rounding-mode-half-up":t.roundingMode="halfExpand";continue;case"integer-width":if(n.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");n.options[0].replace(Ni,function(e,a,i,s,n,r){if(a)t.minimumIntegerDigits=i.length;else{if(s&&n)throw new Error("We currently do not support maximum integer digits");if(r)throw new Error("We currently do not support exact integer digits");}return"";});continue;}if(Hi.test(n.stem))t.minimumIntegerDigits=n.stem.length;else if(Mi.test(n.stem)){if(n.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");n.stem.replace(Mi,function(e,a,i,s,n,r){return"*"===i?t.minimumFractionDigits=a.length:s&&"#"===s[0]?t.maximumFractionDigits=s.length:n&&r?(t.minimumFractionDigits=n.length,t.maximumFractionDigits=n.length+r.length):(t.minimumFractionDigits=a.length,t.maximumFractionDigits=a.length),"";});var r=n.options[0];"w"===r?t=a(a({},t),{trailingZeroDisplay:"stripIfInteger"}):r&&(t=a(a({},t),Di(r)));}else if(Li.test(n.stem))t=a(a({},t),Di(n.stem));else{var o=Pi(n.stem);o&&(t=a(a({},t),o));var d=qi(n.stem);d&&(t=a(a({},t),d));}}return t;}var Vi,Ri={"001":["H","h"],419:["h","H","hB","hb"],AC:["H","h","hb","hB"],AD:["H","hB"],AE:["h","hB","hb","H"],AF:["H","hb","hB","h"],AG:["h","hb","H","hB"],AI:["H","h","hb","hB"],AL:["h","H","hB"],AM:["H","hB"],AO:["H","hB"],AR:["h","H","hB","hb"],AS:["h","H"],AT:["H","hB"],AU:["h","hb","H","hB"],AW:["H","hB"],AX:["H"],AZ:["H","hB","h"],BA:["H","hB","h"],BB:["h","hb","H","hB"],BD:["h","hB","H"],BE:["H","hB"],BF:["H","hB"],BG:["H","hB","h"],BH:["h","hB","hb","H"],BI:["H","h"],BJ:["H","hB"],BL:["H","hB"],BM:["h","hb","H","hB"],BN:["hb","hB","h","H"],BO:["h","H","hB","hb"],BQ:["H"],BR:["H","hB"],BS:["h","hb","H","hB"],BT:["h","H"],BW:["H","h","hb","hB"],BY:["H","h"],BZ:["H","h","hb","hB"],CA:["h","hb","H","hB"],CC:["H","h","hb","hB"],CD:["hB","H"],CF:["H","h","hB"],CG:["H","hB"],CH:["H","hB","h"],CI:["H","hB"],CK:["H","h","hb","hB"],CL:["h","H","hB","hb"],CM:["H","h","hB"],CN:["H","hB","hb","h"],CO:["h","H","hB","hb"],CP:["H"],CR:["h","H","hB","hb"],CU:["h","H","hB","hb"],CV:["H","hB"],CW:["H","hB"],CX:["H","h","hb","hB"],CY:["h","H","hb","hB"],CZ:["H"],DE:["H","hB"],DG:["H","h","hb","hB"],DJ:["h","H"],DK:["H"],DM:["h","hb","H","hB"],DO:["h","H","hB","hb"],DZ:["h","hB","hb","H"],EA:["H","h","hB","hb"],EC:["h","H","hB","hb"],EE:["H","hB"],EG:["h","hB","hb","H"],EH:["h","hB","hb","H"],ER:["h","H"],ES:["H","hB","h","hb"],ET:["hB","hb","h","H"],FI:["H"],FJ:["h","hb","H","hB"],FK:["H","h","hb","hB"],FM:["h","hb","H","hB"],FO:["H","h"],FR:["H","hB"],GA:["H","hB"],GB:["H","h","hb","hB"],GD:["h","hb","H","hB"],GE:["H","hB","h"],GF:["H","hB"],GG:["H","h","hb","hB"],GH:["h","H"],GI:["H","h","hb","hB"],GL:["H","h"],GM:["h","hb","H","hB"],GN:["H","hB"],GP:["H","hB"],GQ:["H","hB","h","hb"],GR:["h","H","hb","hB"],GT:["h","H","hB","hb"],GU:["h","hb","H","hB"],GW:["H","hB"],GY:["h","hb","H","hB"],HK:["h","hB","hb","H"],HN:["h","H","hB","hb"],HR:["H","hB"],HU:["H","h"],IC:["H","h","hB","hb"],ID:["H"],IE:["H","h","hb","hB"],IL:["H","hB"],IM:["H","h","hb","hB"],IN:["h","H"],IO:["H","h","hb","hB"],IQ:["h","hB","hb","H"],IR:["hB","H"],IS:["H"],IT:["H","hB"],JE:["H","h","hb","hB"],JM:["h","hb","H","hB"],JO:["h","hB","hb","H"],JP:["H","K","h"],KE:["hB","hb","H","h"],KG:["H","h","hB","hb"],KH:["hB","h","H","hb"],KI:["h","hb","H","hB"],KM:["H","h","hB","hb"],KN:["h","hb","H","hB"],KP:["h","H","hB","hb"],KR:["h","H","hB","hb"],KW:["h","hB","hb","H"],KY:["h","hb","H","hB"],KZ:["H","hB"],LA:["H","hb","hB","h"],LB:["h","hB","hb","H"],LC:["h","hb","H","hB"],LI:["H","hB","h"],LK:["H","h","hB","hb"],LR:["h","hb","H","hB"],LS:["h","H"],LT:["H","h","hb","hB"],LU:["H","h","hB"],LV:["H","hB","hb","h"],LY:["h","hB","hb","H"],MA:["H","h","hB","hb"],MC:["H","hB"],MD:["H","hB"],ME:["H","hB","h"],MF:["H","hB"],MG:["H","h"],MH:["h","hb","H","hB"],MK:["H","h","hb","hB"],ML:["H"],MM:["hB","hb","H","h"],MN:["H","h","hb","hB"],MO:["h","hB","hb","H"],MP:["h","hb","H","hB"],MQ:["H","hB"],MR:["h","hB","hb","H"],MS:["H","h","hb","hB"],MT:["H","h"],MU:["H","h"],MV:["H","h"],MW:["h","hb","H","hB"],MX:["h","H","hB","hb"],MY:["hb","hB","h","H"],MZ:["H","hB"],NA:["h","H","hB","hb"],NC:["H","hB"],NE:["H"],NF:["H","h","hb","hB"],NG:["H","h","hb","hB"],NI:["h","H","hB","hb"],NL:["H","hB"],NO:["H","h"],NP:["H","h","hB"],NR:["H","h","hb","hB"],NU:["H","h","hb","hB"],NZ:["h","hb","H","hB"],OM:["h","hB","hb","H"],PA:["h","H","hB","hb"],PE:["h","H","hB","hb"],PF:["H","h","hB"],PG:["h","H"],PH:["h","hB","hb","H"],PK:["h","hB","H"],PL:["H","h"],PM:["H","hB"],PN:["H","h","hb","hB"],PR:["h","H","hB","hb"],PS:["h","hB","hb","H"],PT:["H","hB"],PW:["h","H"],PY:["h","H","hB","hb"],QA:["h","hB","hb","H"],RE:["H","hB"],RO:["H","hB"],RS:["H","hB","h"],RU:["H"],RW:["H","h"],SA:["h","hB","hb","H"],SB:["h","hb","H","hB"],SC:["H","h","hB"],SD:["h","hB","hb","H"],SE:["H"],SG:["h","hb","H","hB"],SH:["H","h","hb","hB"],SI:["H","hB"],SJ:["H"],SK:["H"],SL:["h","hb","H","hB"],SM:["H","h","hB"],SN:["H","h","hB"],SO:["h","H"],SR:["H","hB"],SS:["h","hb","H","hB"],ST:["H","hB"],SV:["h","H","hB","hb"],SX:["H","h","hb","hB"],SY:["h","hB","hb","H"],SZ:["h","hb","H","hB"],TA:["H","h","hb","hB"],TC:["h","hb","H","hB"],TD:["h","H","hB"],TF:["H","h","hB"],TG:["H","hB"],TH:["H","h"],TJ:["H","h"],TL:["H","hB","hb","h"],TM:["H","h"],TN:["h","hB","hb","H"],TO:["h","H"],TR:["H","hB"],TT:["h","hb","H","hB"],TW:["hB","hb","h","H"],TZ:["hB","hb","H","h"],UA:["H","hB","h"],UG:["hB","hb","H","h"],UM:["h","hb","H","hB"],US:["h","hb","H","hB"],UY:["h","H","hB","hb"],UZ:["H","hB","h"],VA:["H","h","hB"],VC:["h","hb","H","hB"],VE:["h","H","hB","hb"],VG:["h","hb","H","hB"],VI:["h","hb","H","hB"],VN:["H","h"],VU:["h","H"],WF:["H","hB"],WS:["h","H"],XK:["H","hB","h"],YE:["h","hB","hb","H"],YT:["H","hB"],ZA:["H","h","hb","hB"],ZM:["h","hb","H","hB"],ZW:["H","h"],"af-ZA":["H","h","hB","hb"],"ar-001":["h","hB","hb","H"],"ca-ES":["H","h","hB"],"en-001":["h","hb","H","hB"],"en-HK":["h","hb","H","hB"],"en-IL":["H","h","hb","hB"],"en-MY":["h","hb","H","hB"],"es-BR":["H","h","hB","hb"],"es-ES":["H","h","hB","hb"],"es-GQ":["H","h","hB","hb"],"fr-CA":["H","h","hB"],"gl-ES":["H","h","hB"],"gu-IN":["hB","hb","h","H"],"hi-IN":["hB","h","H"],"it-CH":["H","h","hB"],"it-IT":["H","h","hB"],"kn-IN":["hB","h","H"],"ml-IN":["hB","h","H"],"mr-IN":["hB","hb","h","H"],"pa-IN":["hB","hb","h","H"],"ta-IN":["hB","h","hb","H"],"te-IN":["hB","h","H"],"zu-ZA":["H","hB","hb","h"]};function Ui(e){var t=e.hourCycle;if(void 0===t&&e.hourCycles&&e.hourCycles.length&&(t=e.hourCycles[0]),t)switch(t){case"h24":return"k";case"h23":return"H";case"h12":return"h";case"h11":return"K";default:throw new Error("Invalid hourCycle");}var a,i=e.language;return"root"!==i&&(a=e.maximize().region),(Ri[a||""]||Ri[i||""]||Ri["".concat(i,"-001")]||Ri["001"])[0];}var Gi=new RegExp("^".concat(Si.source,"*")),Fi=new RegExp("".concat(Si.source,"*$"));function Ki(e,t){return{start:e,end:t};}var Zi=!!String.prototype.startsWith&&"_a".startsWith("a",1),Wi=!!String.fromCodePoint,Yi=!!Object.fromEntries,Qi=!!String.prototype.codePointAt,Ji=!!String.prototype.trimStart,Xi=!!String.prototype.trimEnd,es=!!Number.isSafeInteger?Number.isSafeInteger:function(e){return"number"==typeof e&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991;},ts=!0;try{ts="a"===(null===(Vi=ls("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu").exec("a"))||void 0===Vi?void 0:Vi[0]);}catch(V){ts=!1;}var as,is=Zi?function(e,t,a){return e.startsWith(t,a);}:function(e,t,a){return e.slice(a,a+t.length)===t;},ss=Wi?String.fromCodePoint:function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];for(var a,i="",s=e.length,n=0;s>n;){if((a=e[n++])>1114111)throw RangeError(a+" is not a valid code point");i+=a<65536?String.fromCharCode(a):String.fromCharCode(55296+((a-=65536)>>10),a%1024+56320);}return i;},ns=Yi?Object.fromEntries:function(e){for(var t={},a=0,i=e;a<i.length;a++){var s=i[a],n=s[0],r=s[1];t[n]=r;}return t;},rs=Qi?function(e,t){return e.codePointAt(t);}:function(e,t){var a=e.length;if(!(t<0||t>=a)){var i,s=e.charCodeAt(t);return s<55296||s>56319||t+1===a||(i=e.charCodeAt(t+1))<56320||i>57343?s:i-56320+(s-55296<<10)+65536;}},os=Ji?function(e){return e.trimStart();}:function(e){return e.replace(Gi,"");},ds=Xi?function(e){return e.trimEnd();}:function(e){return e.replace(Fi,"");};function ls(e,t){return new RegExp(e,t);}if(ts){var cs=ls("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu");as=function(e,t){var a;return cs.lastIndex=t,null!==(a=cs.exec(e)[1])&&void 0!==a?a:"";};}else as=function(e,t){for(var a=[];;){var i=rs(e,t);if(void 0===i||gs(i)||vs(i))break;a.push(i),t+=i>=65536?2:1;}return ss.apply(void 0,a);};var hs,ps=function(){function e(e,t){void 0===t&&(t={}),this.message=e,this.position={offset:0,line:1,column:1},this.ignoreTag=!!t.ignoreTag,this.locale=t.locale,this.requiresOtherClause=!!t.requiresOtherClause,this.shouldParseSkeletons=!!t.shouldParseSkeletons;}return e.prototype.parse=function(){if(0!==this.offset())throw Error("parser can only be used once");return this.parseMessage(0,"",!1);},e.prototype.parseMessage=function(e,t,a){for(var i=[];!this.isEOF();){var s=this.char();if(123===s){if((n=this.parseArgument(e,a)).err)return n;i.push(n.val);}else{if(125===s&&e>0)break;if(35!==s||"plural"!==t&&"selectordinal"!==t){if(60===s&&!this.ignoreTag&&47===this.peek()){if(a)break;return this.error(ci.UNMATCHED_CLOSING_TAG,Ki(this.clonePosition(),this.clonePosition()));}if(60===s&&!this.ignoreTag&&ms(this.peek()||0)){if((n=this.parseTag(e,t)).err)return n;i.push(n.val);}else{var n;if((n=this.parseLiteral(e,t)).err)return n;i.push(n.val);}}else{var r=this.clonePosition();this.bump(),i.push({type:hi.pound,location:Ki(r,this.clonePosition())});}}}return{val:i,err:null};},e.prototype.parseTag=function(e,t){var a=this.clonePosition();this.bump();var i=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:hi.literal,value:"<".concat(i,"/>"),location:Ki(a,this.clonePosition())},err:null};if(this.bumpIf(">")){var s=this.parseMessage(e+1,t,!0);if(s.err)return s;var n=s.val,r=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!ms(this.char()))return this.error(ci.INVALID_TAG,Ki(r,this.clonePosition()));var o=this.clonePosition();return i!==this.parseTagName()?this.error(ci.UNMATCHED_CLOSING_TAG,Ki(o,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:hi.tag,value:i,children:n,location:Ki(a,this.clonePosition())},err:null}:this.error(ci.INVALID_TAG,Ki(r,this.clonePosition())));}return this.error(ci.UNCLOSED_TAG,Ki(a,this.clonePosition()));}return this.error(ci.INVALID_TAG,Ki(a,this.clonePosition()));},e.prototype.parseTagName=function(){var e=this.offset();for(this.bump();!this.isEOF()&&us(this.char());)this.bump();return this.message.slice(e,this.offset());},e.prototype.parseLiteral=function(e,t){for(var a=this.clonePosition(),i="";;){var s=this.tryParseQuote(t);if(s)i+=s;else{var n=this.tryParseUnquoted(e,t);if(n)i+=n;else{var r=this.tryParseLeftAngleBracket();if(!r)break;i+=r;}}}var o=Ki(a,this.clonePosition());return{val:{type:hi.literal,value:i,location:o},err:null};},e.prototype.tryParseLeftAngleBracket=function(){return this.isEOF()||60!==this.char()||!this.ignoreTag&&(ms(e=this.peek()||0)||47===e)?null:(this.bump(),"<");var e;},e.prototype.tryParseQuote=function(e){if(this.isEOF()||39!==this.char())return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if("plural"===e||"selectordinal"===e)break;return null;default:return null;}this.bump();var t=[this.char()];for(this.bump();!this.isEOF();){var a=this.char();if(39===a){if(39!==this.peek()){this.bump();break;}t.push(39),this.bump();}else t.push(a);this.bump();}return ss.apply(void 0,t);},e.prototype.tryParseUnquoted=function(e,t){if(this.isEOF())return null;var a=this.char();return 60===a||123===a||35===a&&("plural"===t||"selectordinal"===t)||125===a&&e>0?null:(this.bump(),ss(a));},e.prototype.parseArgument=function(e,t){var a=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(ci.EXPECT_ARGUMENT_CLOSING_BRACE,Ki(a,this.clonePosition()));if(125===this.char())return this.bump(),this.error(ci.EMPTY_ARGUMENT,Ki(a,this.clonePosition()));var i=this.parseIdentifierIfPossible().value;if(!i)return this.error(ci.MALFORMED_ARGUMENT,Ki(a,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(ci.EXPECT_ARGUMENT_CLOSING_BRACE,Ki(a,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:hi.argument,value:i,location:Ki(a,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(ci.EXPECT_ARGUMENT_CLOSING_BRACE,Ki(a,this.clonePosition())):this.parseArgumentOptions(e,t,i,a);default:return this.error(ci.MALFORMED_ARGUMENT,Ki(a,this.clonePosition()));}},e.prototype.parseIdentifierIfPossible=function(){var e=this.clonePosition(),t=this.offset(),a=as(this.message,t),i=t+a.length;return this.bumpTo(i),{value:a,location:Ki(e,this.clonePosition())};},e.prototype.parseArgumentOptions=function(e,t,i,s){var n,r=this.clonePosition(),o=this.parseIdentifierIfPossible().value,d=this.clonePosition();switch(o){case"":return this.error(ci.EXPECT_ARGUMENT_TYPE,Ki(r,d));case"number":case"date":case"time":this.bumpSpace();var l=null;if(this.bumpIf(",")){this.bumpSpace();var c=this.clonePosition();if((b=this.parseSimpleArgStyleIfPossible()).err)return b;if(0===(u=ds(b.val)).length)return this.error(ci.EXPECT_ARGUMENT_STYLE,Ki(this.clonePosition(),this.clonePosition()));l={style:u,styleLocation:Ki(c,this.clonePosition())};}if((_=this.tryParseArgumentClose(s)).err)return _;var h=Ki(s,this.clonePosition());if(l&&is(null==l?void 0:l.style,"::",0)){var p=os(l.style.slice(2));if("number"===o)return(b=this.parseNumberSkeletonFromString(p,l.styleLocation)).err?b:{val:{type:hi.number,value:i,location:h,style:b.val},err:null};if(0===p.length)return this.error(ci.EXPECT_DATE_TIME_SKELETON,h);var m=p;this.locale&&(m=function(e,t){for(var a="",i=0;i<e.length;i++){var s=e.charAt(i);if("j"===s){for(var n=0;i+1<e.length&&e.charAt(i+1)===s;)n++,i++;var r=1+(1&n),o=n<2?1:3+(n>>1),d=Ui(t);for("H"!=d&&"k"!=d||(o=0);o-->0;)a+="a";for(;r-->0;)a=d+a;}else a+="J"===s?"H":s;}return a;}(p,this.locale));var u={type:pi.dateTime,pattern:m,location:l.styleLocation,parsedOptions:this.shouldParseSkeletons?Ci(m):{}};return{val:{type:"date"===o?hi.date:hi.time,value:i,location:h,style:u},err:null};}return{val:{type:"number"===o?hi.number:"date"===o?hi.date:hi.time,value:i,location:h,style:null!==(n=null==l?void 0:l.style)&&void 0!==n?n:null},err:null};case"plural":case"selectordinal":case"select":var g=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(ci.EXPECT_SELECT_ARGUMENT_OPTIONS,Ki(g,a({},g)));this.bumpSpace();var v=this.parseIdentifierIfPossible(),y=0;if("select"!==o&&"offset"===v.value){if(!this.bumpIf(":"))return this.error(ci.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,Ki(this.clonePosition(),this.clonePosition()));var b;if(this.bumpSpace(),(b=this.tryParseDecimalInteger(ci.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,ci.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE)).err)return b;this.bumpSpace(),v=this.parseIdentifierIfPossible(),y=b.val;}var _,f=this.tryParsePluralOrSelectOptions(e,o,t,v);if(f.err)return f;if((_=this.tryParseArgumentClose(s)).err)return _;var k=Ki(s,this.clonePosition());return"select"===o?{val:{type:hi.select,value:i,options:ns(f.val),location:k},err:null}:{val:{type:hi.plural,value:i,options:ns(f.val),offset:y,pluralType:"plural"===o?"cardinal":"ordinal",location:k},err:null};default:return this.error(ci.INVALID_ARGUMENT_TYPE,Ki(r,d));}},e.prototype.tryParseArgumentClose=function(e){return this.isEOF()||125!==this.char()?this.error(ci.EXPECT_ARGUMENT_CLOSING_BRACE,Ki(e,this.clonePosition())):(this.bump(),{val:!0,err:null});},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var e=0,t=this.clonePosition();!this.isEOF();){switch(this.char()){case 39:this.bump();var a=this.clonePosition();if(!this.bumpUntil("'"))return this.error(ci.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,Ki(a,this.clonePosition()));this.bump();break;case 123:e+=1,this.bump();break;case 125:if(!(e>0))return{val:this.message.slice(t.offset,this.offset()),err:null};e-=1;break;default:this.bump();}}return{val:this.message.slice(t.offset,this.offset()),err:null};},e.prototype.parseNumberSkeletonFromString=function(e,t){var a=[];try{a=function(e){if(0===e.length)throw new Error("Number skeleton cannot be empty");for(var t=e.split(Ti).filter(function(e){return e.length>0;}),a=[],i=0,s=t;i<s.length;i++){var n=s[i].split("/");if(0===n.length)throw new Error("Invalid number skeleton");for(var r=n[0],o=n.slice(1),d=0,l=o;d<l.length;d++)if(0===l[d].length)throw new Error("Invalid number skeleton");a.push({stem:r,options:o});}return a;}(e);}catch(e){return this.error(ci.INVALID_NUMBER_SKELETON,t);}return{val:{type:pi.number,tokens:a,location:t,parsedOptions:this.shouldParseSkeletons?Ii(a):{}},err:null};},e.prototype.tryParsePluralOrSelectOptions=function(e,t,a,i){for(var s,n=!1,r=[],o=new Set(),d=i.value,l=i.location;;){if(0===d.length){var c=this.clonePosition();if("select"===t||!this.bumpIf("="))break;var h=this.tryParseDecimalInteger(ci.EXPECT_PLURAL_ARGUMENT_SELECTOR,ci.INVALID_PLURAL_ARGUMENT_SELECTOR);if(h.err)return h;l=Ki(c,this.clonePosition()),d=this.message.slice(c.offset,this.offset());}if(o.has(d))return this.error("select"===t?ci.DUPLICATE_SELECT_ARGUMENT_SELECTOR:ci.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,l);"other"===d&&(n=!0),this.bumpSpace();var p=this.clonePosition();if(!this.bumpIf("{"))return this.error("select"===t?ci.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:ci.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,Ki(this.clonePosition(),this.clonePosition()));var m=this.parseMessage(e+1,t,a);if(m.err)return m;var u=this.tryParseArgumentClose(p);if(u.err)return u;r.push([d,{value:m.val,location:Ki(p,this.clonePosition())}]),o.add(d),this.bumpSpace(),d=(s=this.parseIdentifierIfPossible()).value,l=s.location;}return 0===r.length?this.error("select"===t?ci.EXPECT_SELECT_ARGUMENT_SELECTOR:ci.EXPECT_PLURAL_ARGUMENT_SELECTOR,Ki(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!n?this.error(ci.MISSING_OTHER_CLAUSE,Ki(this.clonePosition(),this.clonePosition())):{val:r,err:null};},e.prototype.tryParseDecimalInteger=function(e,t){var a=1,i=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(a=-1);for(var s=!1,n=0;!this.isEOF();){var r=this.char();if(!(r>=48&&r<=57))break;s=!0,n=10*n+(r-48),this.bump();}var o=Ki(i,this.clonePosition());return s?es(n*=a)?{val:n,err:null}:this.error(t,o):this.error(e,o);},e.prototype.offset=function(){return this.position.offset;},e.prototype.isEOF=function(){return this.offset()===this.message.length;},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column};},e.prototype.char=function(){var e=this.position.offset;if(e>=this.message.length)throw Error("out of bound");var t=rs(this.message,e);if(void 0===t)throw Error("Offset ".concat(e," is at invalid UTF-16 code unit boundary"));return t;},e.prototype.error=function(e,t){return{val:null,err:{kind:e,message:this.message,location:t}};},e.prototype.bump=function(){if(!this.isEOF()){var e=this.char();10===e?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=e<65536?1:2);}},e.prototype.bumpIf=function(e){if(is(this.message,e,this.offset())){for(var t=0;t<e.length;t++)this.bump();return!0;}return!1;},e.prototype.bumpUntil=function(e){var t=this.offset(),a=this.message.indexOf(e,t);return a>=0?(this.bumpTo(a),!0):(this.bumpTo(this.message.length),!1);},e.prototype.bumpTo=function(e){if(this.offset()>e)throw Error("targetOffset ".concat(e," must be greater than or equal to the current offset ").concat(this.offset()));for(e=Math.min(e,this.message.length);;){var t=this.offset();if(t===e)break;if(t>e)throw Error("targetOffset ".concat(e," is at invalid UTF-16 code unit boundary"));if(this.bump(),this.isEOF())break;}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&gs(this.char());)this.bump();},e.prototype.peek=function(){if(this.isEOF())return null;var e=this.char(),t=this.offset(),a=this.message.charCodeAt(t+(e>=65536?2:1));return null!=a?a:null;},e;}();function ms(e){return e>=97&&e<=122||e>=65&&e<=90;}function us(e){return 45===e||46===e||e>=48&&e<=57||95===e||e>=97&&e<=122||e>=65&&e<=90||183==e||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039;}function gs(e){return e>=9&&e<=13||32===e||133===e||e>=8206&&e<=8207||8232===e||8233===e;}function vs(e){return e>=33&&e<=35||36===e||e>=37&&e<=39||40===e||41===e||42===e||43===e||44===e||45===e||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||91===e||92===e||93===e||94===e||96===e||123===e||124===e||125===e||126===e||161===e||e>=162&&e<=165||166===e||167===e||169===e||171===e||172===e||174===e||176===e||177===e||182===e||187===e||191===e||215===e||247===e||e>=8208&&e<=8213||e>=8214&&e<=8215||8216===e||8217===e||8218===e||e>=8219&&e<=8220||8221===e||8222===e||8223===e||e>=8224&&e<=8231||e>=8240&&e<=8248||8249===e||8250===e||e>=8251&&e<=8254||e>=8257&&e<=8259||8260===e||8261===e||8262===e||e>=8263&&e<=8273||8274===e||8275===e||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||8608===e||e>=8609&&e<=8610||8611===e||e>=8612&&e<=8613||8614===e||e>=8615&&e<=8621||8622===e||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||8658===e||8659===e||8660===e||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||8968===e||8969===e||8970===e||8971===e||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||9001===e||9002===e||e>=9003&&e<=9083||9084===e||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||9655===e||e>=9656&&e<=9664||9665===e||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||9839===e||e>=9840&&e<=10087||10088===e||10089===e||10090===e||10091===e||10092===e||10093===e||10094===e||10095===e||10096===e||10097===e||10098===e||10099===e||10100===e||10101===e||e>=10132&&e<=10175||e>=10176&&e<=10180||10181===e||10182===e||e>=10183&&e<=10213||10214===e||10215===e||10216===e||10217===e||10218===e||10219===e||10220===e||10221===e||10222===e||10223===e||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||10627===e||10628===e||10629===e||10630===e||10631===e||10632===e||10633===e||10634===e||10635===e||10636===e||10637===e||10638===e||10639===e||10640===e||10641===e||10642===e||10643===e||10644===e||10645===e||10646===e||10647===e||10648===e||e>=10649&&e<=10711||10712===e||10713===e||10714===e||10715===e||e>=10716&&e<=10747||10748===e||10749===e||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||11158===e||e>=11159&&e<=11263||e>=11776&&e<=11777||11778===e||11779===e||11780===e||11781===e||e>=11782&&e<=11784||11785===e||11786===e||11787===e||11788===e||11789===e||e>=11790&&e<=11798||11799===e||e>=11800&&e<=11801||11802===e||11803===e||11804===e||11805===e||e>=11806&&e<=11807||11808===e||11809===e||11810===e||11811===e||11812===e||11813===e||11814===e||11815===e||11816===e||11817===e||e>=11818&&e<=11822||11823===e||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||11840===e||11841===e||11842===e||e>=11843&&e<=11855||e>=11856&&e<=11857||11858===e||e>=11859&&e<=11903||e>=12289&&e<=12291||12296===e||12297===e||12298===e||12299===e||12300===e||12301===e||12302===e||12303===e||12304===e||12305===e||e>=12306&&e<=12307||12308===e||12309===e||12310===e||12311===e||12312===e||12313===e||12314===e||12315===e||12316===e||12317===e||e>=12318&&e<=12319||12320===e||12336===e||64830===e||64831===e||e>=65093&&e<=65094;}function ys(e){e.forEach(function(e){if(delete e.location,wi(e)||$i(e))for(var t in e.options)delete e.options[t].location,ys(e.options[t].value);else _i(e)&&xi(e.style)||(fi(e)||ki(e))&&ji(e.style)?delete e.style.location:Ai(e)&&ys(e.children);});}function bs(e,t){void 0===t&&(t={}),t=a({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var i=new ps(e,t).parse();if(i.err){var s=SyntaxError(ci[i.err.kind]);throw s.location=i.err.location,s.originalMessage=i.err.message,s;}return(null==t?void 0:t.captureLocation)||ys(i.val),i.val;}!function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API";}(hs||(hs={}));var _s,fs=function(e){function a(t,a,i){var s=e.call(this,t)||this;return s.code=a,s.originalMessage=i,s;}return t(a,e),a.prototype.toString=function(){return"[formatjs Error: ".concat(this.code,"] ").concat(this.message);},a;}(Error),ks=function(e){function a(t,a,i,s){return e.call(this,'Invalid values for "'.concat(t,'": "').concat(a,'". Options are "').concat(Object.keys(i).join('", "'),'"'),hs.INVALID_VALUE,s)||this;}return t(a,e),a;}(fs),ws=function(e){function a(t,a,i){return e.call(this,'Value for "'.concat(t,'" must be of type ').concat(a),hs.INVALID_VALUE,i)||this;}return t(a,e),a;}(fs),$s=function(e){function a(t,a){return e.call(this,'The intl string context variable "'.concat(t,'" was not provided to the string "').concat(a,'"'),hs.MISSING_VALUE,a)||this;}return t(a,e),a;}(fs);function zs(e){return"function"==typeof e;}function As(e,t,a,i,s,n,r){if(1===e.length&&yi(e[0]))return[{type:_s.literal,value:e[0].value}];for(var o=[],d=0,l=e;d<l.length;d++){var c=l[d];if(yi(c))o.push({type:_s.literal,value:c.value});else if(zi(c))"number"==typeof n&&o.push({type:_s.literal,value:a.getNumberFormat(t).format(n)});else{var h=c.value;if(!s||!(h in s))throw new $s(h,r);var p=s[h];if(bi(c))p&&"string"!=typeof p&&"number"!=typeof p||(p="string"==typeof p||"number"==typeof p?String(p):""),o.push({type:"string"==typeof p?_s.literal:_s.object,value:p});else if(fi(c)){var m="string"==typeof c.style?i.date[c.style]:ji(c.style)?c.style.parsedOptions:void 0;o.push({type:_s.literal,value:a.getDateTimeFormat(t,m).format(p)});}else if(ki(c)){m="string"==typeof c.style?i.time[c.style]:ji(c.style)?c.style.parsedOptions:i.time.medium;o.push({type:_s.literal,value:a.getDateTimeFormat(t,m).format(p)});}else if(_i(c)){(m="string"==typeof c.style?i.number[c.style]:xi(c.style)?c.style.parsedOptions:void 0)&&m.scale&&(p*=m.scale||1),o.push({type:_s.literal,value:a.getNumberFormat(t,m).format(p)});}else{if(Ai(c)){var u=c.children,g=c.value,v=s[g];if(!zs(v))throw new ws(g,"function",r);var y=v(As(u,t,a,i,s,n).map(function(e){return e.value;}));Array.isArray(y)||(y=[y]),o.push.apply(o,y.map(function(e){return{type:"string"==typeof e?_s.literal:_s.object,value:e};}));}if(wi(c)){if(!(b=c.options[p]||c.options.other))throw new ks(c.value,p,Object.keys(c.options),r);o.push.apply(o,As(b.value,t,a,i,s));}else if($i(c)){var b;if(!(b=c.options["=".concat(p)])){if(!Intl.PluralRules)throw new fs('Intl.PluralRules is not available in this environment.\nTry polyfilling it using "@formatjs/intl-pluralrules"\n',hs.MISSING_INTL_API,r);var _=a.getPluralRules(t,{type:c.pluralType}).select(p-(c.offset||0));b=c.options[_]||c.options.other;}if(!b)throw new ks(c.value,p,Object.keys(c.options),r);o.push.apply(o,As(b.value,t,a,i,s,p-(c.offset||0)));}else;}}}return function(e){return e.length<2?e:e.reduce(function(e,t){var a=e[e.length-1];return a&&a.type===_s.literal&&t.type===_s.literal?a.value+=t.value:e.push(t),e;},[]);}(o);}function xs(e,t){return t?Object.keys(e).reduce(function(i,s){var n,r;return i[s]=(n=e[s],(r=t[s])?a(a(a({},n||{}),r||{}),Object.keys(n).reduce(function(e,t){return e[t]=a(a({},n[t]),r[t]||{}),e;},{})):n),i;},a({},e)):e;}function js(e){return{create:function(){return{get:function(t){return e[t];},set:function(t,a){e[t]=a;}};}};}!function(e){e[e.literal=0]="literal",e[e.object=1]="object";}(_s||(_s={}));var Ss=function(){function e(t,s,r,o){void 0===s&&(s=e.defaultLocale);var d,l=this;if(this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(e){var t=l.formatToParts(e);if(1===t.length)return t[0].value;var a=t.reduce(function(e,t){return e.length&&t.type===_s.literal&&"string"==typeof e[e.length-1]?e[e.length-1]+=t.value:e.push(t.value),e;},[]);return a.length<=1?a[0]||"":a;},this.formatToParts=function(e){return As(l.ast,l.locales,l.formatters,l.formats,e,void 0,l.message);},this.resolvedOptions=function(){var e;return{locale:(null===(e=l.resolvedLocale)||void 0===e?void 0:e.toString())||Intl.NumberFormat.supportedLocalesOf(l.locales)[0]};},this.getAst=function(){return l.ast;},this.locales=s,this.resolvedLocale=e.resolveLocale(s),"string"==typeof t){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");var c=o||{};c.formatters;var h=i(c,["formatters"]);this.ast=e.__parse(t,a(a({},h),{locale:this.resolvedLocale}));}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=xs(e.formats,r),this.formatters=o&&o.formatters||(void 0===(d=this.formatterCache)&&(d={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:ni(function(){for(var e,t=[],a=0;a<arguments.length;a++)t[a]=arguments[a];return new((e=Intl.NumberFormat).bind.apply(e,n([void 0],t,!1)))();},{cache:js(d.number),strategy:vi.variadic}),getDateTimeFormat:ni(function(){for(var e,t=[],a=0;a<arguments.length;a++)t[a]=arguments[a];return new((e=Intl.DateTimeFormat).bind.apply(e,n([void 0],t,!1)))();},{cache:js(d.dateTime),strategy:vi.variadic}),getPluralRules:ni(function(){for(var e,t=[],a=0;a<arguments.length;a++)t[a]=arguments[a];return new((e=Intl.PluralRules).bind.apply(e,n([void 0],t,!1)))();},{cache:js(d.pluralRules),strategy:vi.variadic})});}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale;},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.resolveLocale=function(e){if(void 0!==Intl.Locale){var t=Intl.NumberFormat.supportedLocalesOf(e);return t.length>0?new Intl.Locale(t[0]):new Intl.Locale("string"==typeof e?e:e[0]);}},e.__parse=bs,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e;}(),Os={af:Be,ca:Fe,cs:Je,da:st,de:ct,en:vt,et:St,es:wt,fr:Lt,hu:Bt,it:Ft,nl:Jt,sk:sa,sv:ca,tr:Ba,vi:va,"zh-Hans":wa,"zh-Hant":Sa,ru:La,pl:Fa,pt:Ja,"pt-BR":si};function Cs(e,t,...a){const i=t.replace(/['"]+/g,"");var s;try{s=e.split(".").reduce((e,t)=>e[t],Os[i]);}catch(t){s=e.split(".").reduce((e,t)=>e[t],Os.en);}if(void 0===s&&(s=e.split(".").reduce((e,t)=>e[t],Os.en)),!a.length)return s;const n={};for(let e=0;e<a.length;e+=2){let t=a[e];t=t.replace(/^{([^}]+)?}$/,"$1"),n[t]=a[e+1];}try{return new Ss(s,t).format(n);}catch(e){return"Translation "+e;}}var Ts="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",Es="M7.5,5.6L5,7L6.4,4.5L5,2L7.5,3.4L10,2L8.6,4.5L10,7L7.5,5.6M19.5,15.4L22,14L20.6,16.5L22,19L19.5,17.6L17,19L18.4,16.5L17,14L19.5,15.4M22,2L20.6,4.5L22,7L19.5,5.6L17,7L18.4,4.5L17,2L19.5,3.4L22,2M13.34,12.78L15.78,10.34L13.66,8.22L11.22,10.66L13.34,12.78M14.37,7.29L16.71,9.63C17.1,10 17.1,10.65 16.71,11.04L5.04,22.71C4.65,23.1 4,23.1 3.63,22.71L1.29,20.37C0.9,20 0.9,19.35 1.29,18.96L12.96,7.29C13.35,6.9 14,6.9 14.37,7.29Z",Ms="M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",Ls="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z",Ns="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",Hs="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z",Ds="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",Ps="M17,19H7V5H17M17,3H7A2,2 0 0,0 5,5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V5C19,3.89 18.1,3 17,3Z",qs="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z",Bs="M16,11H18V13H16V11M12,3H19C20.11,3 21,3.89 21,5V19H22V21H2V19H10V5C10,3.89 10.89,3 12,3M12,5V19H19V5H12Z",Is="M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z",Vs="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z",Rs="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z",Us="M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69M12 3L2 12H5V20H11V14H13V20H19V12H22",Gs="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",Fs="M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10A2,2 0 0,1 6,8H15V6A3,3 0 0,0 12,3A3,3 0 0,0 9,6H7A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,17A2,2 0 0,0 14,15A2,2 0 0,0 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17Z",Ks="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z",Zs="M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M15.1,7.07C15.24,7.07 15.38,7.12 15.5,7.23L16.77,8.5C17,8.72 17,9.07 16.77,9.28L15.77,10.28L13.72,8.23L14.72,7.23C14.82,7.12 14.96,7.07 15.1,7.07M13.13,8.81L15.19,10.87L9.13,16.93H7.07V14.87L13.13,8.81Z",Ws="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",Ys="M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z",Qs="M20.84 22.73L15.31 17.2L14.5 18V21H9.5V18L6 14.5V9C6 8.7 6.1 8.41 6.25 8.14L1.11 3L2.39 1.73L22.11 21.46L20.84 22.73M18 14.5V9C18 8 17 7 16 7V3H14V7H10.2L17.85 14.65L18 14.5M10 3H8V4.8L10 6.8V3Z",Js="M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z",Xs="M16,19H8V5H16M16.5,3H7.5A1.5,1.5 0 0,0 6,4.5V19.5A1.5,1.5 0 0,0 7.5,21H16.5A1.5,1.5 0 0,0 18,19.5V4.5A1.5,1.5 0 0,0 16.5,3M19,17H21V7H19M22,9V15H24V9M3,17H5V7H3M0,15H2V9H0V15Z",en="M6,11H10V9H14V11H18V4H6V11M18,13H6V20H18V13M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2Z",tn="M6,8H10V6H14V8H18V4H6V8M18,10H6V15H18V10M6,20H18V17H6V20M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2Z";const an={ArmedAway:Gs,ArmedHome:Rs,ArmedNight:"M2 12A10 10 0 0 0 15 21.54A10 10 0 0 1 15 2.46A10 10 0 0 0 2 12Z",ArmedCustom:"M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z",ArmedVacation:"M20.56 3.91C21.15 4.5 21.15 5.45 20.56 6.03L16.67 9.92L18.79 19.11L17.38 20.53L13.5 13.1L9.6 17L9.96 19.47L8.89 20.53L7.13 17.35L3.94 15.58L5 14.5L7.5 14.87L11.37 11L3.94 7.09L5.36 5.68L14.55 7.8L18.44 3.91C19 3.33 20 3.33 20.56 3.91Z"};var sn,nn,rn;!function(e){e.STATE_ALARM_DISARMED="disarmed",e.STATE_ALARM_ARMED_HOME="armed_home",e.STATE_ALARM_ARMED_AWAY="armed_away",e.STATE_ALARM_ARMED_NIGHT="armed_night",e.STATE_ALARM_ARMED_CUSTOM_BYPASS="armed_custom_bypass",e.STATE_ALARM_ARMED_VACATION="armed_vacation",e.STATE_ALARM_PENDING="pending",e.STATE_ALARM_ARMING="arming",e.STATE_ALARM_TRIGGERED="triggered";}(sn||(sn={})),function(e){e.COMMAND_ALARM_DISARM="disarm",e.COMMAND_ALARM_ARM_HOME="arm_home",e.COMMAND_ALARM_ARM_AWAY="arm_away",e.COMMAND_ALARM_ARM_NIGHT="arm_night",e.COMMAND_ALARM_ARM_CUSTOM_BYPASS="arm_custom_bypass",e.COMMAND_ALARM_ARM_VACATION="arm_vacation";}(nn||(nn={})),function(e){e.Door="door",e.Window="window",e.Motion="motion",e.Tamper="tamper",e.Environmental="environmental",e.Other="other";}(rn||(rn={}));const on={Door:Bs,Window:en,Motion:"M11.4 8.2H15V10H13.2L11.4 8.2M19.67 1H18.33C18.33 3.58 20.42 5.67 23 5.67V4.33C21.16 4.33 19.67 2.84 19.67 1M21 1C21 2.11 21.9 3 23 3V1H21M17 1H15.67C15.67 5.05 18.95 8.33 23 8.33V7C19.69 7 17 4.31 17 1M10 3.8C11 3.8 11.8 3 11.8 2S11 .2 10 .2 8.2 1 8.2 2 9 3.8 10 3.8M2.39 1.73L1.11 3L3.46 5.35L2 5.8V11H3.8V7.33L5.05 6.94L5.68 7.57L2 22H3.8L6.67 13.89L9 17V22H10.8V15.59L8.31 11.05L8.5 10.37L20.84 22.73L22.11 21.46L2.39 1.73M9.38 4.87C9.08 4.37 8.54 4.03 7.92 4.03C7.75 4.03 7.58 4.06 7.42 4.11L7.34 4.14L11.35 8.15L9.38 4.87Z",Tamper:Ps,Environmental:Vs,Other:Ls},dn={Door:Is,Window:tn,Motion:"M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z",Tamper:Xs,Environmental:"M15.66 11.2C15.43 10.9 15.15 10.64 14.89 10.38C14.22 9.78 13.46 9.35 12.82 8.72C11.33 7.26 11 4.85 11.95 3C11 3.23 10.17 3.75 9.46 4.32C6.87 6.4 5.85 10.07 7.07 13.22C7.11 13.32 7.15 13.42 7.15 13.55C7.15 13.77 7 13.97 6.8 14.05C6.57 14.15 6.33 14.09 6.14 13.93C6.08 13.88 6.04 13.83 6 13.76C4.87 12.33 4.69 10.28 5.45 8.64C3.78 10 2.87 12.3 3 14.47C3.06 14.97 3.12 15.47 3.29 15.97C3.43 16.57 3.7 17.17 4 17.7C5.08 19.43 6.95 20.67 8.96 20.92C11.1 21.19 13.39 20.8 15.03 19.32C16.86 17.66 17.5 15 16.56 12.72L16.43 12.46C16.22 12 15.66 11.2 15.66 11.2M12.5 17.5C12.22 17.74 11.76 18 11.4 18.1C10.28 18.5 9.16 17.94 8.5 17.28C9.69 17 10.4 16.12 10.61 15.23C10.78 14.43 10.46 13.77 10.33 13C10.21 12.26 10.23 11.63 10.5 10.94C10.69 11.32 10.89 11.7 11.13 12C11.9 13 13.11 13.44 13.37 14.8C13.41 14.94 13.43 15.08 13.43 15.23C13.46 16.05 13.1 16.95 12.5 17.5H12.5M21 13H19V7H21V13M21 17H19V15H21V17Z",Other:Ts};var ln,cn,hn;!function(e){e.Notification="notification",e.Action="action";}(ln||(ln={})),function(e){e.ArmedAway="armed_away",e.ArmedHome="armed_home",e.ArmedNight="armed_night",e.ArmedVacation="armed_vacation",e.ArmedCustom="armed_custom_bypass";}(cn||(cn={})),function(e){e.Armed="armed",e.Disarmed="disarmed",e.Triggered="triggered",e.Untriggered="untriggered",e.ArmFailure="arm_failure",e.Arming="arming",e.Pending="pending";}(hn||(hn={}));const pn=(e,t,a,i)=>{i=i||{},a=null==a?{}:a;const s=new Event(t,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});return s.detail=a,e.dispatchEvent(s),s;};function mn(e){return(e=e.replace("_"," ")).charAt(0).toUpperCase()+e.slice(1);}function un(e){return e?e.attributes&&e.attributes.friendly_name?e.attributes.friendly_name:String(e.entity_id.split(".").pop()):"(unrecognized entity)";}function gn(e){let t=[];return e.forEach(e=>{t.find(t=>"object"==typeof e?function(...e){return e.every(t=>JSON.stringify(t)===JSON.stringify(e[0]));}(t,e):t===e)||t.push(e);}),t;}function vn(e,t){return e.filter(e=>e!==t);}function yn(e,t){return e?Object.entries(e).filter(([e])=>t.includes(e)).reduce((e,[t,a])=>Object.assign(e,{[t]:a}),{}):{};}const bn=(e,...t)=>{const a={};let i;for(i in e)t.includes(i)||(a[i]=e[i]);return a;};function _n(e){return null!=e;}function fn(e,t){if(null===e||null===t)return e===t;const a=Object.keys(e),i=Object.keys(t);if(a.length!==i.length)return!1;for(const i of a)if("object"==typeof e[i]&&"object"==typeof t[i]){if(!fn(e[i],t[i]))return!1;}else if(e[i]!==t[i])return!1;return!0;}function kn(e,t){const a=e instanceof HTMLElement?e:e.target;pn(a,"show-dialog",{dialogTag:"error-dialog",dialogImport:()=>Promise.resolve().then(function(){return jr;}),dialogParams:{error:t}});}function wn(e,t){kn(t,Z`
    <b>Something went wrong!</b>
    <br />
    ${e.body.message?Z`
          ${e.body.message}
          <br />
          <br />
        `:""}
    ${e.error}
    <br />
    <br />
    Please
    <a href="https://github.com/nielsfaber/alarmo/issues">report</a>
    the bug.
  `);}const $n=(e,t)=>{var a,i,s,n,r;if(!e)return!1;switch(e){case sn.STATE_ALARM_ARMED_AWAY:return null===(a=t[cn.ArmedAway])||void 0===a?void 0:a.enabled;case sn.STATE_ALARM_ARMED_HOME:return null===(i=t[cn.ArmedHome])||void 0===i?void 0:i.enabled;case sn.STATE_ALARM_ARMED_NIGHT:return null===(s=t[cn.ArmedNight])||void 0===s?void 0:s.enabled;case sn.STATE_ALARM_ARMED_CUSTOM_BYPASS:return null===(n=t[cn.ArmedCustom])||void 0===n?void 0:n.enabled;case sn.STATE_ALARM_ARMED_VACATION:return null===(r=t[cn.ArmedVacation])||void 0===r?void 0:r.enabled;default:return!0;}};function zn(e,t){return Object.entries(t).forEach(([t,a])=>{e=t in e&&"object"==typeof e[t]&&null!==e[t]?Object.assign(Object.assign({},e),{[t]:zn(e[t],a)}):Object.assign(Object.assign({},e),{[t]:a});}),e;}function An(e,t){const a=e=>"object"==typeof e?a(e.name):e.trim().toLowerCase();return a(e)<a(t)?-1:1;}const xn=(e,t,a=!1)=>{a?history.replaceState(null,"",t):history.pushState(null,"",t),pn(window,"location-changed",{replace:a});};function jn(e){return e.substr(0,e.indexOf("."));}function Sn(e){return e.substr(e.indexOf(".")+1);}function On(e,t){const a={alert:"mdi:alert",automation:"mdi:playlist-play",calendar:"mdi:calendar",camera:"mdi:video",climate:"mdi:thermostat",configurator:"mdi:settings",conversation:"mdi:text-to-speech",device_tracker:"mdi:account",fan:"mdi:fan",group:"mdi:google-circles-communities",history_graph:"mdi:chart-line",homeassistant:"mdi:home-assistant",homekit:"mdi:home-automation",image_processing:"mdi:image-filter-frames",input_boolean:"mdi:drawing",input_datetime:"mdi:calendar-clock",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:textbox",light:"mdi:lightbulb",mailbox:"mdi:mailbox",notify:"mdi:comment-alert",person:"mdi:account",plant:"mdi:flower",proximity:"mdi:apple-safari",remote:"mdi:remote",scene:"mdi:google-pages",script:"mdi:file-document",sensor:"mdi:eye",simple_alarm:"mdi:bell",sun:"mdi:white-balance-sunny",switch:"mdi:flash",timer:"mdi:timer",updater:"mdi:cloud-upload",vacuum:"mdi:robot-vacuum",water_heater:"mdi:thermometer",weblink:"mdi:open-in-new"};if(e in a)return a[e];switch(e){case"alarm_control_panel":switch(t){case"armed_home":return"mdi:bell-plus";case"armed_night":return"mdi:bell-sleep";case"disarmed":return"mdi:bell-outline";case"triggered":return"mdi:bell-ring";default:return"mdi:bell";}case"binary_sensor":return t&&"off"===t?"mdi:radiobox-blank":"mdi:checkbox-marked-circle";case"cover":return"closed"===t?"mdi:window-closed":"mdi:window-open";case"lock":return t&&"unlocked"===t?"mdi:lock-open":"mdi:lock";case"media_player":return t&&"off"!==t&&"idle"!==t?"mdi:cast-connected":"mdi:cast";case"zwave":switch(t){case"dead":return"mdi:emoticon-dead";case"sleeping":return"mdi:sleep";case"initializing":return"mdi:timer-sand";default:return"mdi:z-wave";}default:return"mdi:bookmark";}}const Cn=h`
  ha-card {
    display: flex;
    flex-direction: column;
    margin: 5px;
    max-width: calc(100vw - 10px);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
  }
  /* ext: role chip on every section title */
  .sec-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 16px 8px;
  }
  .sec-head h2 {
    margin: 0;
    font-size: var(--ha-card-header-font-size, 24px);
    font-weight: 400;
    line-height: 32px;
    color: var(--ha-card-header-color, var(--primary-text-color));
  }
  .sec-side {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .role {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 10px 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    --mdc-icon-size: 14px;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    white-space: nowrap;
  }
  .card-header .role {
    margin-left: auto;
  }
  .card-header .name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  div.warning {
    color: var(--error-color);
    margin-top: 20px;
  }

  div.checkbox-row {
    min-height: 40px;
    display: flex;
    align-items: center;
  }

  div.checkbox-row ha-switch {
    margin-right: 20px;
  }

  div.checkbox-row.right ha-switch {
    margin-left: 20px;
    position: absolute;
    right: 0px;
  }

  div.entity-row {
    display: flex;
    align-items: center;
    flex-direction: row;
    margin: 10px 0px;
  }
  div.entity-row .info {
    margin-left: 16px;
    flex: 1 0 60px;
  }
  div.entity-row .info,
  div.entity-row .info > * {
    color: var(--primary-text-color);
    transition: color 0.2s ease-in-out;
  }
  div.entity-row .secondary {
    display: block;
    color: var(--secondary-text-color);
    transition: color 0.2s ease-in-out;
  }
  div.entity-row state-badge {
    flex: 0 0 40px;
  }

  ha-dialog div.wrapper {
    margin-bottom: -20px;
  }

  ha-input {
    min-width: 220px;
  }

  a,
  a:visited {
    color: var(--primary-color);
  }
  mwc-tab {
    --mdc-tab-color-default: var(--secondary-text-color);
    --mdc-tab-text-label-color-default: var(--secondary-text-color);
  }
  mwc-tab ha-icon {
    --mdc-icon-size: 20px;
  }
  mwc-tab.disabled {
    --mdc-theme-primary: var(--disabled-text-color);
    --mdc-tab-color-default: var(--disabled-text-color);
    --mdc-tab-text-label-color-default: var(--disabled-text-color);
  }

  ha-card alarmo-settings-row:first-child,
  ha-card alarmo-settings-row:first-of-type {
    border-top: 0px;
  }

  ha-card > ha-card {
    margin: 10px;
  }
`,Tn=h`
  /* mwc-dialog (ha-dialog) styles */
  ha-dialog {
    --mdc-dialog-min-width: 400px;
    --mdc-dialog-max-width: 600px;
    --mdc-dialog-heading-ink-color: var(--primary-text-color);
    --mdc-dialog-content-ink-color: var(--primary-text-color);
    --justify-action-buttons: space-between;
  }
  /* make dialog fullscreen on small screens */
  @media all and (max-width: 450px), all and (max-height: 500px) {
    ha-dialog {
      --mdc-dialog-min-width: calc(100vw - env(safe-area-inset-right) - env(safe-area-inset-left));
      --mdc-dialog-max-width: calc(100vw - env(safe-area-inset-right) - env(safe-area-inset-left));
      --mdc-dialog-min-height: 100%;
      --mdc-dialog-max-height: 100%;
      --vertial-align-dialog: flex-end;
      --ha-dialog-border-radius: 0px;
    }
  }
  ha-dialog div.description {
    margin-bottom: 10px;
  }
`,En=()=>{const e=e=>{let t={};for(var a=0;a<e.length;a+=2){const i=e[a],s=a<e.length?e[a+1]:void 0;t=Object.assign(Object.assign({},t),{[i]:s});}return t;},t=window.location.pathname.split("/");let a={page:t[2]||"general",params:{}};if(t.length>3){let i=t.slice(3);if(t.includes("filter")){const t=i.findIndex(e=>"filter"==e),s=i.slice(t+1);i=i.slice(0,t),a=Object.assign(Object.assign({},a),{filter:e(s)});}i.length&&(i.length%2&&(a=Object.assign(Object.assign({},a),{subpage:i.shift()})),i.length&&(a=Object.assign(Object.assign({},a),{params:e(i)})));}return a;},Mn=(e,...t)=>{let a={page:e,params:{}};t.forEach(e=>{"string"==typeof e?a=Object.assign(Object.assign({},a),{subpage:e}):"params"in e?a=Object.assign(Object.assign({},a),{params:e.params}):"filter"in e&&(a=Object.assign(Object.assign({},a),{filter:e.filter}));});const i=e=>{let t=Object.keys(e);t=t.filter(t=>e[t]),t.sort();let a="";return t.forEach(t=>{let i=e[t];a=a.length?`${a}/${t}/${i}`:`${t}/${i}`;}),a;};let s=`/alarmo/${a.page}`;return a.subpage&&(s=`${s}/${a.subpage}`),i(a.params).length&&(s=`${s}/${i(a.params)}`),a.filter&&(s=`${s}/filter/${i(a.filter)}`),s;},Ln=e=>e.callWS({type:"alarmo/ext/info"}),Nn=e=>e&&(e.message||e.body&&e.body.message||e.error||e.code)||String(e),Hn=(e,t,a="text/yaml")=>{const i=new Blob([t],{type:`${a};charset=utf-8`}),s=URL.createObjectURL(i),n=document.createElement("a");n.href=s,n.download=e,document.body.appendChild(n),n.click(),setTimeout(()=>{URL.revokeObjectURL(s),n.remove();},0);},Dn=(e,t)=>{if(!e)return"";try{return new Date(e).toLocaleString(t,{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"});}catch(t){return e;}},Pn=(e,t)=>{e.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:t},bubbles:!0,composed:!0}));},qn=60;let Bn=class extends pe{constructor(){super(...arguments),this.min=0,this.max=300,this.value=0,this.step=15,this.disabled=!1,this.showArrows=!0,this.required=!1;}render(){return Z`
      <div class="wrapper">
        ${this.required?Y:Z`
        <div class="column">
          <ha-checkbox
            @change=${this._toggleEnableClick}
            ?checked=${!this.disabled}
          >
          </ha-checkbox>`}
        </div>
        <div class="column">
          <div class="row">
          <ha-input
            id="minutes"
            inputmode="numeric"
            .value=${this.disabled?this.placeholder:this._getMinutes()}
            label=""
            @input=${this._minutesChanged}
            @focusin=${this._onFocus}
            no-spinner
            .autoValidate=${!0}
            maxlength="1"
            min="0"
            .max=${Math.floor(this.max/qn)}
            .disabled=${this.disabled}
            .validityTransform=${this._validateMinutesInput}
          >
          </ha-input>
          <div class="time-separator">:</div>
          </div>
          <span class="label">${Cs("components.time_picker.minutes",this.hass.language)}</span>
        </div>
        <div class="column">
          <ha-input
            id="seconds"
            inputmode="numeric"
            .value=${this.disabled?this.placeholder:this._getSeconds()}
            label=""
            @input=${this._secondsChanged}
            @focusin=${this._onFocus}
            no-spinner
            .autoValidate=${!0}
            maxlength="2"
            min="0"
            max="59"
            .disabled=${this.disabled}
            .validityTransform=${this._validateSecondsInput}
          >
          </ha-input>
          <span class="label">${Cs("components.time_picker.seconds",this.hass.language)}</span>
        </div>
        ${this.showArrows?Z`
        <div class="column">
          <wa-button
            appearance="plain"
            variant="brand"
            size="medium"
            ?disabled=${this.disabled}
            @click=${this._secondsUpClick}
          >
            <ha-icon icon="mdi:chevron-up"></ha-icon>
          </wa-button>
          <wa-button
            appearance="plain"
            variant="brand"
            size="medium"
            ?disabled=${this.disabled}
            @click=${this._secondsDownClick}
          >
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </wa-button>`:Y}
        </div>
      </div>
    `;}_getMinutes(){return Math.floor(this.value/qn);}_getSeconds(){return this.value%qn;}_minutesChanged(e){let t=Number(e.target.value),a=t*qn+this._getSeconds();a<this.min&&(a=this.min,t=Math.floor(a/qn),e.target.value=String(t)),a>this.max&&(a=this.max,t=Math.floor(a/qn),e.target.value=String(t)),this.value=a,this._valueChanged();}_secondsChanged(e){let t=Number(e.target.value);t>=qn&&(t=59,e.target.value=String(t));let a=this._getMinutes()*qn+t;a<this.min&&(a=this.min,t=this.value%qn,e.target.value=String(t)),a>this.max&&(a=this.max,t=this.value%qn,e.target.value=String(t)),this.value=a,this._valueChanged();}_validateMinutesInput(e,t){let a=null!==e.match(/^[0-9]+$/);return{valid:a,customError:!a};}_validateSecondsInput(e,t){let a=null!==e.match(/^[0-9]+$/);return{valid:a,customError:!a};}_secondsUpClick(){let e=Math.round(this.value/this.step)*this.step;e+=this.step,e>this.max&&(e=this.max),this.value=e,this._valueChanged();}_secondsDownClick(){let e=Math.round(this.value/this.step)*this.step;e-=this.step,e<this.min&&(e=this.min),this.value=e,this._valueChanged();}_toggleEnableClick(e){const t=e.target.checked;this.disabled=!t,e.target.blur(),this._valueChanged();}_onFocus(e){e.currentTarget.select();}_valueChanged(){let e=this.disabled?null:this.value;pn(this,"value-changed",{value:e});}};Bn.styles=h`
    :host {
      display: flex;
      padding: 8px 0px;
    }
    div.wrapper {
      display: flex;
      flex-direction: row;
      gap: 0px;
    }
    :host([required]) div.wrapper {
      margin-left: 10px;
    }
    ha-checkbox {
      margin-top: 18px;
    }
    ha-input {
      width: 70px;
      height: 56px;
      --ha-input-padding-top: 0px;
      --ha-input-padding-bottom: 0px;
      --ha-input-text-align: center;
      --wa-form-control-value-font-size: 16px;
    }
    ha-input::part(wa-input) {
      text-align: center;
    }
    ha-input#minutes::part(wa-base) {
      border-top-right-radius: 0px;
    }
    ha-input#seconds::part(wa-base) {
      border-top-left-radius: 0px;
    }
    .time-separator {
      background-color: var(--ha-color-form-background);
      color: var(--ha-color-text-secondary);
      border-bottom: 1px solid var(--ha-color-border-neutral-loud);
      box-sizing: border-box;
      height: 56px;
      width: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 600;
      transition: background 0.15s ease-in-out;
    }
    :host([disabled]) .time-separator {
      background-color: var(--ha-color-form-background-disabled);
      opacity: 0.5;
    }
    div.column {
      display: flex;
      flex-direction: column;
    }
    div.column > * {
      display: flex;
    }
    div.row {
      display: flex;
      flex-direction: row;
    }
    wa-button {
      width: 30px;
      height: 30px;
      --wa-form-control-border-radius: 8px;
      margin-left: 4px;
    }
    wa-button ha-icon {
      color: var(--wa-color-on-normal);
    }
    span.label {
      display: flex;
      padding: 2px 0px 0px 0px;
      justify-content: center;
      color: rgba(var(--rgb-primary-text-color), 0.6);
      font-size: 0.9rem;
    }
  `,s([ye({attribute:!1})],Bn.prototype,"hass",void 0),s([ye({type:Number})],Bn.prototype,"min",void 0),s([ye({type:Number})],Bn.prototype,"max",void 0),s([ye({type:Number})],Bn.prototype,"value",void 0),s([ye({type:Number})],Bn.prototype,"step",void 0),s([ye({type:Boolean})],Bn.prototype,"disabled",void 0),s([ye({type:Boolean})],Bn.prototype,"showArrows",void 0),s([ye({type:String})],Bn.prototype,"placeholder",void 0),s([ye({type:Boolean})],Bn.prototype,"required",void 0),Bn=s([ue("alarmo-duration-picker")],Bn);const In=[{name:"primary",weight:10},{name:"secondary",weight:8}];let Vn=class extends pe{constructor(){super(...arguments),this.label="",this.items=[],this.disabled=!1,this.showSearch=!1,this.clearable=!1,this.invalid=!1,this._valueRenderer=e=>{const t=this.items.find(t=>t.value===e);return Z`
      ${(null==t?void 0:t.icon)?Z`<ha-icon slot="start" .icon=${t.icon}></ha-icon>`:Y}
      <span slot="headline">
        ${t?t.name:e}
      </span>
    `;},this._getItems=()=>this.items.map(e=>Object({id:e.value,primary:e.name,secondary:e.description,icon:e.icon}));}render(){if(this.showSearch)return Z`
      <ha-generic-picker
        .hass=${this.hass}
        .autofocus=${this.autofocus}
        .notFoundLabel=${this.hass.localize("ui.components.combo-box.no_match")}
        .label=${this.label}
        .value=${this.value}
        .valueRenderer=${this._valueRenderer}
        .disabled=${this.disabled}
        .helper=${this.helper}
        .getItems=${this._getItems}
        .searchKeys=${In}
        @value-changed=${this._pickerChanged}
        hide-clear-icon
      >
      </ha-generic-picker>
      ${this.invalid?Z`<span class="invalid">Invalid</span>`:Y}
   `;{const e=this.items.map(e=>({value:e.value,label:e.name,secondary:e.description,iconPath:e.icon}));return Z`
        <ha-select
          .label=${this.label}
          .value=${this.value}
          .disabled=${this.disabled}
          .helper=${this.helper}
          ?clearable=${this.clearable}
          ?invalid=${this.invalid}
          .options=${e}
          @selected=${this._selectChanged}
          @closed=${e=>{e.stopPropagation();}}
          fixedMenuPosition
          naturalMenuWidth
        >
        </ha-select>
        ${this.invalid?Z`<span class="invalid">Invalid</span>`:Y}
      `;}}_renderOptions(){const e=this.items.some(e=>e.icon);return this.items.map(t=>Z`
      <ha-dropdown-item
        .graphic=${e?"icon":""}
        .value=${t.value}
        ?selected=${this.value===t.value}
      >
        ${t.icon?Z`<ha-icon slot="graphic" .icon=${t.icon}></ha-icon>`:Y}
        <span>${t.name}</span>
      </ha-dropdown-item>
    `);}_selectChanged(e){e.stopPropagation(),this.value=e.detail.value,pn(this,"value-changed",{value:this.value});}_pickerChanged(e){e.stopPropagation(),this.value=e.detail.value,pn(this,"value-changed",{value:this.value});}clearValue(){if(this.showSearch){const e=this.shadowRoot.querySelector("ha-generic-picker");this.value="",e.blur();}else{const e=this.shadowRoot.querySelector("ha-select");this.value=void 0,setTimeout(()=>{e.blur();},50);}}};Vn.styles=h`
    ha-select {
      width: 100%;
    }
    .mdc-floating-label {
      inset-inline-start: var(--ha-space-4);
      inset-inline-end: initial;
      color: red;
      direction: var(--direction);
    }
    :host([invalid]) {
      --mdc-select-label-ink-color: var(--mdc-theme-error, red);
      --mdc-select-idle-line-color: var(--mdc-theme-error, red);
      --mdc-text-field-idle-line-color: var(--mdc-theme-error, red);
    }
    span.invalid {
      display: flex;
      font-size: 0.75rem;
      color: var(--mdc-theme-error, red);
      margin: 6px 16px 0px 16px;
    }
    ha-select {
      --ha-space-10: var(--ha-space-13);
    }
    :host([icons]) ha-select {
      --ha-space-10: var(--ha-space-15);
    }
  `,s([ye()],Vn.prototype,"hass",void 0),s([ye()],Vn.prototype,"label",void 0),s([ye()],Vn.prototype,"items",void 0),s([ye({type:String,reflect:!0})],Vn.prototype,"value",void 0),s([ye({type:Boolean,reflect:!0})],Vn.prototype,"disabled",void 0),s([ye()],Vn.prototype,"helper",void 0),s([ye({type:Boolean})],Vn.prototype,"showSearch",void 0),s([ye({type:Boolean})],Vn.prototype,"clearable",void 0),s([ye({type:Boolean})],Vn.prototype,"invalid",void 0),s([_e("ha-input")],Vn.prototype,"_menu",void 0),Vn=s([ue("alarmo-select")],Vn);let Rn=class extends pe{static get styles(){return h`
      :host {
        display: block;
      }
    `;}render(){return Z`
      <slot></slot>
    `;}constructor(){super(),this.addEventListener("clickHeader",this.manageSpoilers);}manageSpoilers(e){const t=e.target;t.getAttribute("active")?t.removeAttribute("active"):t.setAttribute("active","true"),this.querySelectorAll("alarmo-collapsible-header[active]").forEach(function(e){e!==t&&e.removeAttribute("active");});}};Rn=s([ue("alarmo-collapsible-group")],Rn);let Un=class extends pe{static get styles(){return h`
      :host {
        display: block;
      }
    `;}render(){return Z`
      <slot></slot>
    `;}};Un=s([ue("alarmo-collapsible-item")],Un);let Gn=class extends pe{constructor(){super(),this.clickHeader=new CustomEvent("clickHeader",{detail:{message:"clickHeader happened."},bubbles:!0,composed:!0}),this.active=!1,this.addEventListener("click",this.handleClick);}handleClick(){this.dispatchEvent(this.clickHeader);}render(){return Z`
      <mwc-list-item graphic="avatar" twoline hasMeta>
        <slot name="icon" slot="graphic"></slot>
        <span><slot name="title"></slot></span>
        <span slot="secondary"><slot name="description"></slot></span>
        <ha-icon slot="meta" icon="hass:chevron-down" class="chevron"></ha-icon>
      </mwc-list-item>
    `;}static get styles(){return h`
      :host {
        display: block;
        cursor: pointer;
      }
      :host mwc-list-item::before {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        pointer-events: none;
        content: '';
        transition: opacity 15ms linear;
        will-change: opacity;
        background-color: black;
        opacity: 0;
      }
      :host mwc-list-item:hover::before {
        opacity: 0.04;
      }
      :host([active]) mwc-list-item::before {
        opacity: 0.1;
      }
      :host([active]) mwc-list-item:hover::before {
        opacity: 0.12;
      }
      :host mwc-list-item:active::before,
      :host([active]) mwc-list-item:active::before {
        opacity: 0.14;
      }
      ::slotted(ha-icon), ::slotted(ha-svg-icon) {
        width: 24px;
        height: 24px;
        padding: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
      }
      :host mwc-list-item {
        font-size: 15px;
        --mdc-typography-body2-font-size: 14px;
      }
      :host .chevron {
        display: block;
        transition: 0.4s;
      }
      :host([active]) .chevron {
        transform: rotate(180deg);
      }
    `;}attributeChangedCallback(e,t,a){this.hasAttribute("active")&&this.nextElementSibling?this.nextElementSibling.style.maxHeight=this.nextElementSibling.scrollHeight+"px":this.nextElementSibling&&(this.nextElementSibling.style.maxHeight="0px"),super.attributeChangedCallback(e,t,a);}};s([ye({type:CustomEvent})],Gn.prototype,"clickHeader",void 0),s([ye({type:Boolean,attribute:!0,reflect:!0})],Gn.prototype,"active",void 0),Gn=s([ue("alarmo-collapsible-header")],Gn);let Fn=class extends pe{static get styles(){return h`
      :host {
        display: block;
        background-color: var(--card-background-color);
        max-height: 0px;
        overflow: hidden;
        transition: max-height 0.2s ease-out;
      }
      .wrapper {
      }
    `;}render(){return Z`
      <div class="wrapper">
        <slot>Default details</slot>
      </div>
    `;}};Fn=s([ue("alarmo-collapsible-body")],Fn);const Kn=h`
  :host {
    display: block;
    min-width: 0;
    max-width: 100%;
    padding: 8px 12px 0;
    box-sizing: border-box;
    --ext-changed-bg: rgba(255, 152, 0, 0.18);
    --ext-changed-color: var(--warning-color, #ff9800);
    --ext-new-bg: rgba(76, 175, 80, 0.14);
    --ext-new-color: var(--success-color, #4caf50);
    --ext-removed-bg: rgba(244, 67, 54, 0.1);
    --ext-removed-color: var(--error-color, #f44336);
  }
  :host([embedded]) {
    padding: 0;
  }
  ha-card {
    margin-bottom: 12px;
    max-width: 100%;
    min-width: 0;
    overflow: hidden; /* the table inside scrolls, not the card */
  }
  .toolbar,
  .detail-grid {
    min-width: 0;
  }
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    padding: 12px 16px;
  }
  .toolbar .grow {
    flex: 1 1 auto;
  }
  select,
  input[type='text'],
  input[type='number'],
  input[type='search'] {
    font: inherit;
    color: var(--primary-text-color);
    background: var(--card-background-color, var(--primary-background-color));
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    padding: 6px 8px;
    min-height: 34px;
    box-sizing: border-box;
  }
  input[type='number'] {
    width: 80px;
  }
  input[type='search'] {
    min-width: 200px;
  }
  .table-wrap {
    overflow-x: auto;
    max-width: 100%;
    padding: 0 8px 8px;
    -webkit-overflow-scrolling: touch;
  }
  /* tables hug their content (columns stay close together); wide ones scroll in .table-wrap.
     Activity/history logs and tables with expandable rows use class="full". */
  table {
    border-collapse: collapse;
    width: auto;
    font-size: 14px;
  }
  table.full {
    width: 100%;
  }
  th,
  td {
    padding: 8px 10px;
    border-bottom: 1px solid var(--divider-color);
    text-align: left;
    vertical-align: middle;
    white-space: nowrap;
  }
  th {
    position: sticky;
    top: 0;
    background: var(--card-background-color, var(--primary-background-color));
    font-weight: 500;
    color: var(--secondary-text-color);
    z-index: 1;
  }
  th.c,
  td.c {
    text-align: center;
  }
  td.name {
    white-space: normal;
    min-width: 180px;
    max-width: 420px;
  }
  /* spacer column: other columns hug their content, the rest of the width goes here */
  th.fill,
  td.fill {
    width: 100%;
    padding: 0;
  }
  .secondary {
    display: block;
    color: var(--secondary-text-color);
    font-size: 12px;
  }
  td.changed,
  .changed-inline {
    background: var(--ext-changed-bg);
  }
  .mark {
    --mdc-icon-size: 14px;
    width: 14px;
    height: 14px;
    color: var(--ext-changed-color);
    vertical-align: middle;
  }
  tr.status-new td {
    background: var(--ext-new-bg);
  }
  tr.status-new td:first-child {
    box-shadow: inset 4px 0 0 var(--ext-new-color);
  }
  tr.status-changed td:first-child {
    box-shadow: inset 4px 0 0 var(--ext-changed-color);
  }
  tr.status-removed td {
    background: var(--ext-removed-bg);
    color: var(--secondary-text-color);
  }
  tr.status-removed td:first-child {
    box-shadow: inset 4px 0 0 var(--ext-removed-color);
  }
  tr.status-removed td.name {
    text-decoration: line-through;
  }
  .badge {
    display: inline-block;
    min-width: 18px;
    padding: 0 5px;
    border-radius: 9px;
    font-size: 11px;
    line-height: 18px;
    text-align: center;
    color: #fff;
    background: var(--ext-changed-color);
  }
  .badge.new {
    background: var(--ext-new-color);
  }
  .badge.removed {
    background: var(--ext-removed-color);
  }
  .status-icon.new {
    color: var(--ext-new-color);
  }
  .status-icon.changed {
    color: var(--ext-changed-color);
  }
  .status-icon.removed {
    color: var(--ext-removed-color);
  }
  tr.detail td {
    background: var(--secondary-background-color);
    white-space: normal;
  }
  .detail-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 24px;
    padding: 8px 4px;
  }
  .detail-grid label {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    padding: 2px 4px;
    border-radius: 4px;
  }
  .savebar {
    position: sticky;
    bottom: 0;
    z-index: 3;
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 10px 16px;
    margin: 0 -12px;
    background: var(--card-background-color, var(--primary-background-color));
    border-top: 3px solid var(--ext-changed-color);
    box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.15);
  }
  .savebar .count {
    flex: 1 1 auto;
    font-weight: 500;
  }
  .bulkbar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    padding: 8px 16px;
    background: var(--secondary-background-color);
  }
  .notice {
    padding: 8px 16px;
    border-left: 4px solid var(--info-color, #039be5);
    background: var(--secondary-background-color);
    margin: 0 16px 12px;
  }
  .notice.warn {
    border-color: var(--warning-color, #ff9800);
  }
  .notice.error {
    border-color: var(--error-color, #f44336);
  }
  .empty {
    padding: 24px;
    text-align: center;
    color: var(--secondary-text-color);
  }
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 10;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal {
    background: var(--card-background-color, var(--primary-background-color));
    color: var(--primary-text-color);
    border-radius: 12px;
    width: min(900px, calc(100vw - 24px));
    max-height: calc(100vh - 48px);
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
  }
  .modal h2 {
    margin: 0;
    padding: 16px 20px 8px;
    font-size: 20px;
    font-weight: 400;
  }
  .modal .body {
    padding: 0 20px 12px;
    overflow: auto;
  }
  .modal .footer {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    padding: 12px 20px;
    border-top: 1px solid var(--divider-color);
  }
  .src {
    --mdc-icon-size: 14px;
    width: 14px;
    height: 14px;
    vertical-align: middle;
    margin-left: 2px;
    color: var(--secondary-text-color);
  }
  .src.rule {
    color: var(--info-color, #039be5);
  }
  .src.override {
    color: var(--accent-color, #ff9800);
    cursor: pointer;
  }
  .modes-src {
    font-size: 11px;
    color: var(--secondary-text-color);
    margin-left: 6px;
  }
  td.conflict {
    outline: 2px solid var(--ext-removed-color);
    outline-offset: -2px;
  }
  td.override-cell {
    box-shadow: inset 0 -2px 0 var(--accent-color, #ff9800);
  }
  th.help,
  span.help,
  label.help {
    cursor: help;
  }
  th.help {
    text-decoration: underline dotted;
    text-underline-offset: 3px;
  }
  .help-panel {
    margin: 0 16px 12px;
  }
  .help-panel dl {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 4px 16px;
    margin: 0;
  }
  .help-panel dt {
    font-weight: 500;
  }
  .help-panel dd {
    margin: 0;
  }
  .sec-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 16px 8px;
  }
  .sec-head h2 {
    margin: 0;
    font-size: var(--ha-card-header-font-size, 24px);
    font-weight: 400;
    line-height: 32px;
    color: var(--ha-card-header-color, var(--primary-text-color));
  }
  .sec-side {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .role {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 10px 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    --mdc-icon-size: 14px;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    white-space: nowrap;
  }
  .card-content.desc,
  .desc {
    padding: 0 16px 8px;
    line-height: 1.5;
  }
  .desc p {
    margin: 0 0 10px;
  }
  .desc ul {
    margin: 0 0 10px;
    padding-left: 22px;
  }
  .desc li {
    margin: 2px 0;
  }
  .badge-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: inherit;
    display: inline-flex;
    align-items: center;
  }
  td.icon,
  th.icon {
    width: 44px;
    text-align: center;
    padding-left: 8px;
    padding-right: 0;
  }
  .locked-note {
    color: var(--secondary-text-color);
    font-size: 13px;
  }
  .icon-stack {
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }
  .eye {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: var(--secondary-text-color);
    --mdc-icon-size: 16px;
  }
  .eye.off {
    color: var(--error-color, #f44336);
  }
  .eye:disabled {
    cursor: default;
  }
  tr.zone-disabled td:not(.icon) {
    opacity: 0.5;
  }
  th.mode,
  td.mode {
    width: 34px;
    padding-left: 2px;
    padding-right: 2px;
    --mdc-icon-size: 18px;
  }
  .mode-dot {
    color: var(--disabled-text-color, #9e9e9e);
  }
  .mode-dot.on {
    color: var(--primary-color);
  }
  .chip-cell {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    color: var(--chip);
    border: 1px solid var(--chip);
  }
  .chip-cell.changed {
    background: var(--ext-changed-bg);
  }
  td.opts {
    --mdc-icon-size: 18px;
    color: var(--secondary-text-color);
    white-space: nowrap;
  }
  td.opts ha-icon {
    margin-right: 2px;
  }
  .opt-num {
    font-size: 12px;
    margin-left: 2px;
  }
  td.row-actions {
    white-space: nowrap;
    width: 1%;
  }
  .zone-editor {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 8px 32px;
    padding: 8px 8px 12px;
  }
  .zone-editor h4,
  .subhead {
    margin: 4px 0 8px;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--accent-color, var(--primary-color));
  }
  /* canonical field row: label content-width, control right beside it (CARD_DESIGN_SYSTEM §2) */
  .zone-editor .field,
  .field-row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 10px;
    min-height: 40px;
    padding: 0 6px;
    border-radius: 6px;
  }
  .mode-picks {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 2px 10px;
    align-items: center;
  }
  .copy {
    margin-top: 8px;
  }
  button.link {
    background: none;
    border: none;
    color: var(--primary-color);
    cursor: pointer;
    font: inherit;
    padding: 2px 4px;
  }
  /* collapsible section (CARD_DESIGN_SYSTEM §2: accent border when open, rotating chevron, uppercase head) */
  details.collapse {
    border: 1px solid var(--divider-color);
    border-radius: 10px;
    margin: 0 16px 12px;
  }
  details.collapse[open] {
    border-color: var(--primary-color);
  }
  details.collapse > summary {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 10px 12px;
    cursor: pointer;
    list-style: none;
  }
  details.collapse > summary::-webkit-details-marker {
    display: none;
  }
  details.collapse > summary .chev {
    --mdc-icon-size: 20px;
    color: var(--primary-color);
    transition: transform 0.2s;
  }
  details.collapse[open] > summary .chev {
    transform: rotate(90deg);
  }
  .collapse-title {
    color: var(--primary-color);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-weight: 600;
    font-size: 13px;
  }
  .collapse-body {
    padding: 0 12px 12px;
  }
  .blk {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    padding: 2px 0;
  }
  tr.passed td {
    background: var(--ext-new-bg);
  }
  .live-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    --mdc-icon-size: 14px;
    white-space: nowrap;
  }
  /* live state: icon with the text under it */
  .state-cell {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    min-width: 44px;
    font-size: 11px;
    line-height: 13px;
    --mdc-icon-size: 20px;
    white-space: nowrap;
  }
  .state-cell.muted {
    color: var(--disabled-text-color, #9e9e9e);
  }
  .state-cell .blocks {
    font-weight: 600;
  }
  .state-pair {
    display: inline-flex;
    gap: 10px;
    align-items: flex-start;
  }
  .state-pair .sep {
    color: var(--divider-color);
    align-self: center;
  }
  /* help: one row per entry, zebra striped */
  .help-panel .help-rows {
    display: grid;
    grid-template-columns: max-content 1fr;
    margin: 0;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid var(--divider-color);
  }
  .help-panel .help-rows > div {
    display: contents;
  }
  .help-panel .help-rows dt,
  .help-panel .help-rows dd {
    padding: 8px 12px;
    margin: 0;
    color: var(--primary-text-color);
    line-height: 1.45;
  }
  .help-panel .help-rows dt {
    font-weight: 600;
    white-space: nowrap;
  }
  .help-panel .help-rows > div:nth-child(odd) dt,
  .help-panel .help-rows > div:nth-child(odd) dd {
    background: rgba(var(--rgb-primary-text-color, 255, 255, 255), 0.05);
  }
  .kind-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    background: none;
    font: inherit;
    font-size: 12px;
    opacity: 0.6;
    --mdc-icon-size: 14px;
  }
  .kind-chip.on {
    opacity: 1;
    background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.12);
  }
  .seq-time {
    font-variant-numeric: tabular-nums;
    font-weight: 600;
  }
  .seq-title {
    font-weight: 500;
  }
  .seq-kinds {
    margin-left: auto;
    color: var(--secondary-text-color);
    --mdc-icon-size: 16px;
  }
`,Zn={general:{role:"settings",text:'Alarmo-wide options: what happens after an alarm, MQTT, and the "All partitions" alarm entity.\n\nThe "All partitions" entity only exists when there are two or more partitions.'},partitions:{role:"settings",text:"Alarmo partitions are parts of the building that are armed separately. Each has its own alarm entity: alarm_control_panel.<partition name>.\n\nMost homes need one partition. The zone, notification and action counts link to those pages."},modes:{role:"settings",text:"Alarmo's arm modes per partition: which ones the partition offers, and Alarmo's exit delay, entry delay and trigger time for each.\n\nWith a physical panel, the physical panel's own delays still apply to its own zones."},zones_legacy:{role:"legacy",text:"Upstream Alarmo's original zone page, kept for reference.\n\nZone Assignments does the same and more. Changes made here are not backed up first."},codes:{role:"settings",text:"Who may arm and disarm Alarmo with a code, and when a code is needed."},notifications:{role:"settings",text:"Messages Alarmo sends on alarm events — armed, disarmed, triggered, failed to arm … — per partition."},actions:{role:"settings",text:"Home Assistant actions Alarmo runs on alarm events, per partition."}},Wn={settings:{icon:"mdi:cog",label:"Settings"},picker:{icon:"mdi:playlist-plus",label:"Picker"},readonly:{icon:"mdi:eye",label:"Read only"},legacy:{icon:"mdi:history",label:"Legacy"}},Yn=e=>Z`<span class="role"><ha-icon icon=${Wn[e].icon}></ha-icon>${Wn[e].label}</span>`,Qn=(e,t,a=Y)=>Z`<div class="sec-head"><h2>${e}</h2><span class="sec-side">${a}${t?Yn(t):Y}</span></div>`,Jn=(e,t)=>Z`<ha-button appearance=${e?"plain":"filled"} @click=${t}
    title=${e?"Unlock to change the settings in this table":"Lock the table again"}>
    <ha-icon slot="start" icon=${e?"mdi:lock":"mdi:lock-open-variant"}></ha-icon>${e?"Unlock to edit":"Editing — lock"}
  </ha-button>`,Xn=(e,t,a="unchanged")=>{const i=e.states[t],s="changed"===a?"var(--warning-color, #ffc107)":"new"===a?"var(--success-color, #4caf50)":"removed"===a?"var(--error-color, #f44336)":"";return Z`<button class="badge-btn" title=${("changed"===a?"Unsaved changes · ":"new"===a?"New, not saved · ":"removed"===a?"Will be removed · ":"")+"Show details"} aria-label=${`Show details of ${t}`}
    @click=${e=>e.target.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0}))}>
    ${i?Z`<state-badge .hass=${e} .stateObj=${i} .stateColor=${!s}
          style=${s?`--state-icon-color:${s};--state-icon-active-color:${s};color:${s}`:""}></state-badge>`:Z`<ha-icon icon="mdi:help-circle-outline" style=${s?`color:${s}`:""}></ha-icon>`}
  </button>`;};let er=class extends pe{constructor(){super(...arguments),this.page="",this.heading="";}render(){const e=Zn[this.page];return e?Z`
      <div class="notice warn" style="margin:0 0 12px;display:flex;gap:8px;align-items:flex-start">
        ${Yn(e.role)}
        <div class="desc" style="padding:0">${e.text.split("\n\n").map(e=>Z`<p style="margin:0 0 4px">${e}</p>`)}</div>
      </div>
    `:Z``;}};er.styles=Kn,s([ye()],er.prototype,"page",void 0),s([ye()],er.prototype,"heading",void 0),er=s([ue("alarmo-ext-page-intro")],er);let tr=class extends Le(pe){hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"alarmo_config_updated"})];}async _fetchData(){this.hass&&(this.areas=await Ee(this.hass),this.sensors=await $e(this.hass));}async firstUpdated(){await this._fetchData(),this.selectedArea=Object.keys(this.areas)[0],this.data=Object.assign({},this.areas[this.selectedArea].modes);}render(){return this.data?Z`
      <ha-card>
        <div class="card-header">
          <div class="name">
            ${Cs("panels.general.cards.modes.title",this.hass.language)}
          </div>
          ${Yn("settings")}

          ${Object.keys(this.areas).length>1?Z`
          <alarmo-select
            .hass=${this.hass}
            .items=${Object.values(this.areas).map(e=>Object({value:e.area_id,name:e.name}))}
            value=${this.selectedArea}
            label=${this.hass.localize("ui.components.area-picker.area")}
            @value-changed=${e=>this.selectArea(e.target.value)}
          ></alarmo-select>
        `:""}
        </div>
        <div class="card-content">
          ${Cs("panels.general.cards.modes.description",this.hass.language)}
        </div>

        <alarmo-collapsible-group>
          ${Object.entries(cn).map(([e,t])=>{var a;return Z`
                <alarmo-collapsible-item>
                  <alarmo-collapsible-header>
                    <ha-svg-icon slot="icon" .path=${an[e]}></ha-svg-icon>
                    <span slot="title">
                      ${this.hass.localize(`component.alarm_control_panel.entity_component._.state.${t}`)}
                    </span>
                    <span slot="description">
                      ${(null===(a=this.data[t])||void 0===a?void 0:a.enabled)?Z`
                            ${Cs("common.enabled",this.hass.language)},
                            <a href="${Mn("zones",{filter:{area:this.selectedArea,mode:t}})}">
                              ${Cs("panels.general.cards.modes.number_sensors_active",this.hass.language,"number",this.getSensorsByMode(t))}
                            </a>
                          `:Cs("common.disabled",this.hass.language)}
                    </span>
                  </alarmo-collapsible-header>
                  <alarmo-collapsible-body>
                    ${this.renderModeConfig(t)}
                  </alarmo-collapsible-body>
                </alarmo-collapsible-item>
              `;})}
        </alarmo-collapsible-group>
      </ha-card>
    `:Z``;}getSensorsByMode(e){return Object.values(this.sensors).filter(t=>t.area==this.selectedArea&&(t.modes.includes(e)||t.always_on)).length;}renderModeConfig(e){const t=e in this.data?this.data[e]:void 0;return Z`
      <div class="description">
        <ha-icon icon="mdi:information-outline"></ha-icon>
        ${Cs(`panels.general.cards.modes.modes.${e}`,this.hass.language)}
      </div>
      <alarmo-settings-row .narrow=${this.narrow}>
        <span slot="heading">
          ${Cs("panels.general.cards.modes.fields.status.heading",this.hass.language)}
        </span>
        <span slot="description">
          ${Cs("panels.general.cards.modes.fields.status.description",this.hass.language)}
        </span>
        <div>
          <ha-button
            appearance="${(null==t?void 0:t.enabled)?"filled":"plain"}"
            variant="${(null==t?void 0:t.enabled)?"brand":"neutral"}"
            @click=${t=>this.saveData(t,e,{enabled:!0})}
          >
            <ha-icon slot="start" icon="mdi:check"></ha-icon>
            ${Cs("common.enabled",this.hass.language)}
          </ha-button>
          <ha-button
            appearance="${(null==t?void 0:t.enabled)?"plain":"filled"}"
            variant="${(null==t?void 0:t.enabled)?"neutral":"brand"}"
            @click=${t=>this.saveData(t,e,{enabled:!1})}
          >
            <ha-icon slot="start" icon="mdi:close"></ha-icon>
            ${Cs("common.disabled",this.hass.language)}
          </ha-button>
        </div>
      </alarmo-settings-row>
      <alarmo-settings-row .narrow=${this.narrow}>
        <span slot="heading">
          ${Cs("panels.general.cards.modes.fields.exit_delay.heading",this.hass.language)}
        </span>
        <span slot="description">
          ${Cs("panels.general.cards.modes.fields.exit_delay.description",this.hass.language)}
        </span>
        <alarmo-duration-picker
          .hass=${this.hass}
          max="300"
          placeholder="-"
          value=${(null==t?void 0:t.exit_time)||0}
          @value-changed=${t=>{this.saveData(t,e,{exit_time:t.detail.value});}}
          ?disabled=${!(null==t?void 0:t.enabled)||!_n(null==t?void 0:t.exit_time)}
        ></alarmo-duration-picker>
      </alarmo-settings-row>
      <alarmo-settings-row .narrow=${this.narrow}>
        <span slot="heading">
          ${Cs("panels.general.cards.modes.fields.entry_delay.heading",this.hass.language)}
        </span>
        <span slot="description">
          ${Cs("panels.general.cards.modes.fields.entry_delay.description",this.hass.language)}
        </span>
        <alarmo-duration-picker
          .hass=${this.hass}
          max="300"
          placeholder="-"
          value=${(null==t?void 0:t.entry_time)||0}
          @value-changed=${t=>this.saveData(t,e,{entry_time:t.detail.value})}
          ?disabled=${!(null==t?void 0:t.enabled)||!_n(null==t?void 0:t.entry_time)}
        ></alarmo-duration-picker>
      </alarmo-settings-row>
      <alarmo-settings-row .narrow=${this.narrow}>
        <span slot="heading">
          ${Cs("panels.general.cards.modes.fields.trigger_time.heading",this.hass.language)}
        </span>
        <span slot="description">
          ${Cs("panels.general.cards.modes.fields.trigger_time.description",this.hass.language)}
        </span>
        <alarmo-duration-picker
          .hass=${this.hass}
          max="3600"
          step="60"
          placeholder="&#8734;"
          value=${(null==t?void 0:t.trigger_time)||0}
          @value-changed=${t=>this.saveData(t,e,{trigger_time:t.detail.value})}
          ?disabled=${!(null==t?void 0:t.enabled)||!_n(null==t?void 0:t.trigger_time)}
        ></alarmo-duration-picker>
      </alarmo-settings-row>
    `;}selectArea(e){e!=this.selectedArea&&(this.selectedArea=e,this.data=Object.assign({},this.areas[e].modes));}saveClick(e){Me(this.hass,{area_id:this.selectedArea,modes:this.data}).catch(t=>wn(t,e)).then();}saveData(e,t,a){this.data=Object.assign(Object.assign({},this.data),{[t]:Object.assign(Object.assign({},this.data[t]||{enabled:!1,exit_time:0,entry_time:0,trigger_time:0}),a)}),Me(this.hass,{area_id:this.selectedArea,modes:this.data}).catch(t=>wn(t,e.target)).then();}static get styles(){return h`
      ${Cn}
      alarmo-collapsible-header:first-of-type {
        border-top: 1px solid var(--divider-color);
      }
      .description {
        margin: 8px;
        padding: 12px;
        color: var(--primary-color);
        filter: brightness(0.85);
        font-size: 14px;
        line-height: 1.5em;
        min-height: 36px;
        display: flex;
        align-items: center;
        position: relative;
      }
      .description::before {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        pointer-events: none;
        content: '';
        background: rgba(var(--rgb-primary-color), 0.12);
        border-radius: 5px;
      }
      .description ha-icon {
        --mdc-icon-size: 36px;
        display: inline;
        float: left;
        margin-right: 12px;
        align-self: flex-start;
      }
      alarmo-select {
        display: flex;
        min-width: 180px;
      }
    `;}};s([ye()],tr.prototype,"hass",void 0),s([ye({type:Boolean})],tr.prototype,"narrow",void 0),s([ye()],tr.prototype,"config",void 0),s([ye()],tr.prototype,"areas",void 0),s([ye()],tr.prototype,"sensors",void 0),s([ye()],tr.prototype,"data",void 0),s([ye()],tr.prototype,"selectedArea",void 0),tr=s([ue("alarm-mode-card")],tr);let ar=class extends pe{constructor(){super(...arguments),this.threeLine=!1;}render(){return Z`
      <div class="info">
        <slot name="heading"></slot>
        <div class="secondary"><slot name="description"></slot></div>
      </div>
      <slot></slot>
    `;}static get styles(){return h`
      :host {
        display: flex;
        flex-direction: row;
        padding: 0px 16px;
        align-items: center;
        min-height: 72px;
        /* ext: control right beside its label (CARD_DESIGN_SYSTEM §2), not pushed to the far right */
        justify-content: flex-start;
        gap: 24px;
      }
      :host([large]) {
        align-items: normal;
        flex-direction: column;
        border-top: 1px solid var(--divider-color);
        border-bottom: 1px solid var(--divider-color);
        padding: 16px 16px;
      }
      :host([narrow]) {
        align-items: normal;
        flex-direction: column;
        border-bottom: none;
        border-top: 1px solid var(--divider-color);
        padding: 16px 16px;
      }
      :host([nested]) {
        border: none;
        padding: 8px 16px 0px 16px;
        margin-top: -16px;
        min-height: 40px;
      }
      :host([nested]:not([narrow])) {
        padding: 16px 16px 0px 32px;
      }
      :host([first]) {
        border-top: none;
      }
      :host([last]) {
        border-bottom: none;
      }
      :host([dialog]) {
        border: none;
        padding: 12px 0px;
      }
      ::slotted(ha-switch) {
        padding: 16px 0;
      }
      .info {
        flex: 0 1 auto;
        min-width: 60px;
        max-width: 640px;
        margin-bottom: 4px;
      }
      :host([large]) .info,
      :host([narrow]) .info {
        flex: 1 0 40px;
      }
      :host([nested]) .info {
        flex: 1 0 26px;
      }
      :host([dialog]) .info {
        flex: 1 0 40px;
        padding-bottom: 8px;
      }
      .secondary {
        color: var(--secondary-text-color);
        margin-top: 4px;
      }
      :host(:not([large]):not([narrow])):not([dialog])) ::slotted(*) {
        max-width: 66%;
      }
    `;}};s([ye({type:Boolean,reflect:!0})],ar.prototype,"narrow",void 0),s([ye({type:Boolean,reflect:!0})],ar.prototype,"large",void 0),s([ye({type:Boolean,attribute:"three-line"})],ar.prototype,"threeLine",void 0),s([ye({type:Boolean})],ar.prototype,"nested",void 0),s([ye({type:Boolean})],ar.prototype,"dialog",void 0),ar=s([ue("alarmo-settings-row")],ar);let ir=class extends pe{constructor(){super(...arguments),this.header="",this.open=!1;}render(){return Z`
      ${this.open?Z`
            <div class="header open">
              <span @click=${()=>{this.open=!1;}}>${this.header}</span>
              <ha-icon-button .path=${Ns} @click=${()=>{this.open=!1;}}>
              </ha-icon-button>
            </div>
            <slot></slot>
            <div class="header open">
              <span @click=${()=>{this.open=!1;}}>${this.header}</span>
              <ha-icon-button .path=${"M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"} @click=${()=>{this.open=!1;}}>
              </ha-icon-button>
            </div>
          `:Z`
            <div class="header">
              <span @click=${()=>{this.open=!0;}}>${this.header}</span>
              <ha-icon-button .path=${Hs} @click=${()=>{this.open=!0;}}>
              </ha-icon-button>
            </div>
          `}
    `;}static get styles(){return h`
      :host {
      }

      div.header {
        display: flex;
        align-items: center;
        padding: 0px 16px;
        cursor: pointer;
      }
      div.header.open:first-of-type {
        border-bottom: 1px solid var(--divider-color);
      }
      div.header.open:last-of-type {
        border-top: 1px solid var(--divider-color);
      }

      :host([narrow]) div.header {
        border-top: 1px solid var(--divider-color);
        border-bottom: none;
      }

      div.header span {
        display: flex;
        flex-grow: 1;
      }

      div.seperator {
        height: 1px;
        background: var(--divider-color);
      }
    `;}};s([ye({type:Boolean,reflect:!0})],ir.prototype,"narrow",void 0),s([ye()],ir.prototype,"header",void 0),s([ye()],ir.prototype,"open",void 0),ir=s([ue("alarmo-collapsible-section")],ir);let sr=class extends Le(pe){constructor(){super(...arguments),this.areas={};}hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"alarmo_config_updated"})];}async _fetchData(){if(!this.hass)return;const e=await we(this.hass);this.config=e,this.areas=await Ee(this.hass),this.selection=e.mqtt;}firstUpdated(){(async()=>{await fe();})();}render(){return this.hass&&this.selection?Z`
      <ha-card>
        <div class="card-header">
          <div class="name">${Cs("panels.general.cards.mqtt.title",this.hass.language)}</div>
          ${Yn("settings")}
          <ha-icon-button .path=${Ds} @click=${this.cancelClick}></ha-icon-button>
        </div>
        <div class="card-content">${Cs("panels.general.cards.mqtt.description",this.hass.language)}</div>

        <alarmo-settings-row .narrow=${this.narrow}>
          <span slot="heading">
            ${Cs("panels.general.cards.mqtt.fields.state_topic.heading",this.hass.language)}
          </span>
          <span slot="description">
            ${Cs("panels.general.cards.mqtt.fields.state_topic.description",this.hass.language)}
          </span>
          <ha-input
            label="${Cs("panels.general.cards.mqtt.fields.state_topic.heading",this.hass.language)}"
            value=${this.selection.state_topic}
            @change=${e=>{this.selection=Object.assign(Object.assign({},this.selection),{state_topic:e.target.value});}}
          ></ha-input>
        </alarmo-settings-row>

        <alarmo-collapsible-section
          .narrow=${this.narrow}
          header=${Cs("panels.general.cards.mqtt.fields.state_payload.heading",this.hass.language)}
        >
          ${Object.values(sn).filter(e=>Object.values(this.areas).some(t=>$n(e,t.modes))).map(e=>Z`
                <alarmo-settings-row .narrow=${this.narrow}>
                  <span slot="heading">${mn(e)}</span>
                  <span slot="description">
                    ${Cs("panels.general.cards.mqtt.fields.state_payload.item",this.hass.language,"{state}",mn(e))}
                  </span>
                  <ha-input
                    label=${mn(e)}
                    placeholder=${e}
                    value=${this.selection.state_payload[e]||""}
                    @change=${t=>{this.selection=zn(this.selection,{state_payload:{[e]:t.target.value}});}}
                  ></ha-input>
                </alarmo-settings-row>
              `)}
        </alarmo-collapsible-section>

        <alarmo-settings-row .narrow=${this.narrow}>
          <span slot="heading">
            ${Cs("panels.general.cards.mqtt.fields.event_topic.heading",this.hass.language)}
          </span>
          <span slot="description">
            ${Cs("panels.general.cards.mqtt.fields.event_topic.description",this.hass.language)}
          </span>
          <ha-input
            label="${Cs("panels.general.cards.mqtt.fields.event_topic.heading",this.hass.language)}"
            value=${this.selection.event_topic}
            @change=${e=>{this.selection=Object.assign(Object.assign({},this.selection),{event_topic:e.target.value});}}
          ></ha-input>
        </alarmo-settings-row>

        <alarmo-settings-row .narrow=${this.narrow}>
          <span slot="heading">
            ${Cs("panels.general.cards.mqtt.fields.command_topic.heading",this.hass.language)}
          </span>
          <span slot="description">
            ${Cs("panels.general.cards.mqtt.fields.command_topic.description",this.hass.language)}
          </span>
          <ha-input
            label="${Cs("panels.general.cards.mqtt.fields.command_topic.heading",this.hass.language)}"
            value=${this.selection.command_topic}
            @change=${e=>{this.selection=Object.assign(Object.assign({},this.selection),{command_topic:e.target.value});}}
          ></ha-input>
        </alarmo-settings-row>

        <alarmo-collapsible-section
          .narrow=${this.narrow}
          header=${Cs("panels.general.cards.mqtt.fields.command_payload.heading",this.hass.language)}
        >
          ${Object.values(nn).filter(e=>Object.values(this.areas).some(t=>$n((e=>{switch(e){case nn.COMMAND_ALARM_DISARM:return sn.STATE_ALARM_DISARMED;case nn.COMMAND_ALARM_ARM_HOME:return sn.STATE_ALARM_ARMED_HOME;case nn.COMMAND_ALARM_ARM_AWAY:return sn.STATE_ALARM_ARMED_AWAY;case nn.COMMAND_ALARM_ARM_NIGHT:return sn.STATE_ALARM_ARMED_NIGHT;case nn.COMMAND_ALARM_ARM_CUSTOM_BYPASS:return sn.STATE_ALARM_ARMED_CUSTOM_BYPASS;case nn.COMMAND_ALARM_ARM_VACATION:return sn.STATE_ALARM_ARMED_VACATION;default:return;}})(e),t.modes))).map(e=>Z`
                <alarmo-settings-row .narrow=${this.narrow}>
                  <span slot="heading">${mn(e)}</span>
                  <span slot="description">
                    ${Cs("panels.general.cards.mqtt.fields.command_payload.item",this.hass.language,"{command}",mn(e))}
                  </span>
                  <ha-input
                    label=${mn(e)}
                    placeholder=${e}
                    value=${this.selection.command_payload[e]||""}
                    @change=${t=>{this.selection=zn(this.selection,{command_payload:{[e]:t.target.value}});}}
                  ></ha-input>
                </alarmo-settings-row>
              `)}
        </alarmo-collapsible-section>

        <alarmo-settings-row .narrow=${this.narrow}>
          <span slot="heading">
            ${Cs("panels.general.cards.mqtt.fields.require_code.heading",this.hass.language)}
          </span>
          <span slot="description">
            ${Cs("panels.general.cards.mqtt.fields.require_code.description",this.hass.language)}
          </span>
          <ha-switch
            ?checked=${this.selection.require_code}
            ?disabled=${!this.config.code_arm_required&&!this.config.code_disarm_required}
            @change=${e=>{this.selection=Object.assign(Object.assign({},this.selection),{require_code:e.target.checked});}}
          ></ha-switch>
        </alarmo-settings-row>

        <div class="card-actions">
          <ha-button appearance="plain" @click=${this.saveClick}>
            ${this.hass.localize("ui.common.save")}
          </ha-button>
        </div>
      </ha-card>
    `:Z``;}saveClick(e){this.hass&&je(this.hass,{mqtt:Object.assign(Object.assign({},this.selection),{enabled:!0})}).catch(t=>wn(t,e)).then(()=>{this.cancelClick();});}cancelClick(){xn(0,Mn("general"),!0);}};sr.styles=Cn,s([ye()],sr.prototype,"narrow",void 0),s([ye()],sr.prototype,"config",void 0),s([ye()],sr.prototype,"areas",void 0),s([ye()],sr.prototype,"selection",void 0),sr=s([ue("mqtt-config-card")],sr);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const nr=2;class rr{constructor(e){}get _$AU(){return this._$AM._$AU;}_$AT(e,t,a){this._$Ct=e,this._$AM=t,this._$Ci=a;}_$AS(e,t){return this.update(e,t);}update(e,t){return this.render(...t);}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class or extends rr{constructor(e){if(super(e),this.it=Y,e.type!==nr)throw Error(this.constructor.directiveName+"() can only be used in child bindings");}render(e){if(e===Y||null==e)return this._t=void 0,this.it=e;if(e===W)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]};}}or.directiveName="unsafeHTML",or.resultType=1;const dr=(e=>(...t)=>({_$litDirective$:e,values:t}))(or);let lr=class extends pe{constructor(){super(...arguments),this.active=!1;}render(){return Z`
      <div class="chip ${this.active?"active":""}" @click=${this._handleClick}>
        <div class="overlay"></div>
        ${this.renderIcon()}
        <span class="value"><slot></slot></span>
        ${this.renderTrailingIcon()}
      </div>
    `;}renderIcon(){var e;return this.icon||this.toggleable?this.toggleable?Z`
        <div class="icon">
          <ha-icon
            icon="mdi:check"
          ></ha-icon>
        </div>
      `:Z`
        <div class="icon filled">
          ${(null===(e=this.icon)||void 0===e?void 0:e.startsWith("mdi:"))?Z`<ha-icon .icon=${this.icon}></ha-icon>`:Z`<ha-svg-icon .path=${this.icon}></ha-svg-icon>`}
        </div>
      `:Y;}renderTrailingIcon(){if(!this.removable&&!this.badge)return Y;if(this.badge)return Z`
        <div class="badge">
          ${this.badge}
        </div>
      `;const e=Math.random().toString(36).substring(2,9);return Z`
        <div class="trailing-icon" @click=${this._iconClick}>
          <ha-icon icon="mdi:close" id="${e}"></ha-icon>
          <ha-tooltip for="${e}">${this.hass.localize("ui.common.remove")}</ha-tooltip>
        </div>
      `;}_handleClick(e){if(this.toggleable){this.active=!this.active;const e=new CustomEvent("click",{detail:{active:this.active,value:this.value}});this.dispatchEvent(e);}else{const e=new CustomEvent("click",{detail:{value:this.value}});this.dispatchEvent(e);}e.stopPropagation();}_iconClick(e){const t=new CustomEvent("icon-clicked",{detail:{value:this.value}});this.dispatchEvent(t),e.stopPropagation();}static get styles(){return h`
      :host {
        margin: 4px;
      }
      .chip {
        display: inline-flex;
        position: relative;
        height: var(--chip-height, 32px);
        background: none;
        user-select: none;
        z-index: 1;
        align-items: center;
        justify-content: center;
      }
      .chip:before {
        position: absolute;
        pointer-events: none;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        content: '';
        border: 1px solid var(--chip-color, rgb(168, 225, 251));
        border-radius: var(--chip-border-radius, 32px);
        background: rgba(0, 0, 0, 0);
        opacity: var(--background-opacity, 1);
        z-index: -2;
      }
      .chip.active:before {
        background: var(--chip-color, rgb(168, 225, 251));
      }
      .icon {
        position: relative;
        width: 32px;
        height: 32px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        --mdc-icon-size: 20px;
        margin-right: -8px;
        color: rgba(0, 0, 0, 0.54);
      }
      .icon.filled:before {
        position: absolute;
        pointer-events: none;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        content: '';
        background: var(--chip-color, rgb(168, 225, 251));
        border-radius: 32px;
        z-index: -2;
      }
      .value {
        color: var(--primary-text-color);
        font-size: var(--chip-font-size, 0.875rem);
        font-weight: 400;
        display: flex;
        align-items: center;
        padding: 0px 12px;
        opacity: 0.9;
      }
      .trailing-icon {
        position: relative;
        width: 26px;
        height: 26px;
        border-radius: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        --mdc-icon-size: 16px;
        margin: 0px 3px 0px -8px;
        color: var(--icon-color, rgba(0, 0, 0, 0.54));
        cursor: pointer;
      }
      .trailing-icon:before {
        position: absolute;
        pointer-events: none;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        content: '';
        background: var(--chip-color, var(--secondary-text-color));
        border-radius: 26px;
        z-index: -2;
        opacity: 0;
        transition: opacity 0.1s ease-in-out;
      }
      .trailing-icon:hover:before {
        opacity: 0.15;
      }
      .trailing-icon:active:before {
        opacity: 0.3;
      }
      :host([selectable]) .chip, :host([toggleable]) .chip {
        cursor: pointer;
      }
      .overlay {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: -1;
        background: rgba(0, 0, 0, 0);
        border-radius: var(--chip-border-radius, 32px);
        transition: background-color 0.1s ease-in-out, border 0.1s ease-in-out;
        border: 1px solid rgba(0, 0, 0, 0);
      }
      :host([selectable]) .chip:hover .overlay, :host([toggleable]) .chip:hover .overlay {
        border: 1px solid rgba(0, 0, 0, 0.05);
        background: rgba(0, 0, 0, 0.05);
      }
      :host([selectable]) .chip:active .overlay, :host([toggleable]) .chip:active .overlay {
        border: 1px solid rgba(0, 0, 0, 0.1);
        background: rgba(0, 0, 0, 0.1);
      }
      :host([selectable]) .chip:hover .value, :host([toggleable]) .chip:hover .value {
        opacity: 1;
      }
      :host([active]):host([selectable]) .chip:hover .overlay, :host([active]):host([toggleable]) .chip:hover .overlay {
        background: rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(0, 0, 0, 0);
      }
      :host([active]):host([selectable]) .chip:active .overlay, :host([active]):host([toggleable]) .chip:active .overlay {
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(0, 0, 0, 0);
      }
      
      :host([toggleable]) .icon {
        width: 0px;
        transition: width 0.1s ease-in-out;
        overflow: hidden;
        display: flex;
        align-items: center;
        margin-left: 12px;
      }
      :host([toggleable]) .active .icon {
        width: 20px;
      }
      .badge {
        position: relative;
        display: flex;
        height: 26px;
        min-width: 26px;
        border-radius: 13px;
        font-size: var(--chip-font-size, 0.875rem);
        align-items: center;
        justify-content: center;
        margin: 0px 3px 0px -8px;
      }
      .badge:before {
        position: absolute;
        pointer-events: none;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        content: '';
        background: var(--chip-color, var(--secondary-text-color));
        border-radius: 26px;
        z-index: -2;
        transition: opacity 0.1s ease-in-out;
        opacity: 0.1;
      }
    `;}};s([ye({attribute:!1})],lr.prototype,"hass",void 0),s([ye({type:String})],lr.prototype,"icon",void 0),s([ye({type:Boolean})],lr.prototype,"selectable",void 0),s([ye({type:Boolean})],lr.prototype,"removable",void 0),s([ye({type:Boolean})],lr.prototype,"toggleable",void 0),s([ye({type:Boolean})],lr.prototype,"active",void 0),s([ye({type:String})],lr.prototype,"badge",void 0),s([ye({type:String})],lr.prototype,"value",void 0),lr=s([ue("alarmo-chip")],lr);let cr=class extends pe{constructor(){super(...arguments),this.value=[];}render(){return this.items?Z`
      ${Object.values(this.items).map(e=>Z`
          <alarmo-chip
            .hass=${this.hass}
            .value=${e.value||e.name}
            .icon=${e.icon}
            ?active=${this.value.includes(e.value||e.name)}
            .badge=${void 0!==e.badge?String(e.badge):void 0}
            ?selectable=${this.selectable}
            ?toggleable=${this.toggleable}
            ?removable=${this.removable}
            @click=${this._handleClick}
            @icon-clicked=${this._handleClick}
          >
            ${e.name}
          </alarmo-chip>
        `)}
    `:Z``;}_handleClick(e){if(this.toggleable){const t=e.detail.value,a=e.detail.active;this.value.includes(t)&&!a?this.value=this.value.filter(e=>e!=t):!this.value.includes(t)&&t&&(this.value=[...this.value,t]);const i=new CustomEvent("value-changed",{detail:this.value});this.dispatchEvent(i);}else{const t=new CustomEvent("value-changed",{detail:e.detail.value});this.dispatchEvent(t);}}static get styles(){return h`
      :host {
        display: flex;
        flex-direction: row;
        flex: 1;
        margin: 0px -4px;
        flex-wrap: wrap;
      }
    `;}};s([ye({attribute:!1})],cr.prototype,"hass",void 0),s([ye({attribute:!1})],cr.prototype,"items",void 0),s([ye({attribute:!1})],cr.prototype,"value",void 0),s([ye({type:Boolean})],cr.prototype,"selectable",void 0),s([ye({type:Boolean})],cr.prototype,"toggleable",void 0),s([ye({type:Boolean})],cr.prototype,"removable",void 0),cr=s([ue("alarmo-chip-set")],cr);let hr=class extends pe{set filters(e){this.filterConfig||(this.filterConfig=e);}shouldUpdate(e){return e.get("filters")&&!this.filterConfig&&(this.filterConfig=e.get("filters")),!0;}render(){if(!this.columns||!this.data)return Z``;const e=this.data.filter(e=>this.filterTableData(e,this.filterConfig));return Z`
      ${this.renderFilterRow()}
      <div class="table">
        ${this.renderHeaderRow()}
        ${e.length?e.map(e=>this.renderDataRow(e)):Z`
              <div class="table-row">
                <div class="table-cell text grow">
                  <slot></slot>
                </div>
              </div>
            `}
      </div>
    `;}renderHeaderRow(){return this.columns?Z`
      <div class="table-row header">
        ${Object.values(this.columns).map(e=>e.hide?"":Z`
                <div
                  class="table-cell ${e.text?"text":""} ${e.grow?"grow":""} ${e.align?e.align:""}"
                  style="${e.grow?"":`width: ${e.width}`}"
                >
                  <span>${e.title||""}</span>
                </div>
              `)}
      </div>
    `:Z``;}renderDataRow(e){return this.columns?Z`
      <div
        class="table-row ${this.selectable?"selectable":""} ${e.warning?"warning":""}"
        @click=${()=>this.handleClick(String(e.id))}
      >
        ${Object.entries(this.columns).map(([t,a])=>a.hide?"":Z`
                <div
                  class="table-cell ${a.text?"text":""} ${a.grow?"grow":""} ${a.align?a.align:""}"
                  style="${a.grow?"":`width: ${a.width}`}"
                >
                  ${a.renderer?a.renderer(e):e[t]}
                </div>
              `)}
      </div>
    `:Z``;}filterTableData(e,t){return!t||Object.keys(t).every(a=>{if(!Object.keys(e).includes(a))return!0;const i=t[a].value;return!i||!i.length||(Array.isArray(e[a])?e[a].some(e=>i.includes(e)):i.includes(e[a]));});}_getFilteredItems(){return this.data.filter(e=>!this.filterTableData(e,this.filterConfig)).length;}handleClick(e){if(!this.selectable)return;const t=new CustomEvent("row-click",{detail:{id:e}});this.dispatchEvent(t);}renderFilterRow(){var e;return this.filterConfig?Z`
      <div class="table-filter">
        <ha-dropdown
          @wa-show=${this._showFilterMenu}
          @wa-after-hide=${this._applyFilterSelection}
          placement="bottom-start"
        >
          <ha-icon-button
            slot="trigger"
            .path=${"M6,13H18V11H6M3,6V8H21V6M10,18H14V16H10V18Z"}
            ?disabled=${!(null===(e=this.data)||void 0===e?void 0:e.length)}
            label=${Cs("components.table.filter.label",this.hass.language)}
          ></ha-icon-button>
          ${this.renderFilterMenu()}
        </ha-dropdown>

        ${this._getFilteredItems()?Z`
              <alarmo-chip
                .hass=${this.hass}
                removable
                active
                @icon-clicked=${this._clearFilters}
                style="--chip-color: var(--primary-color); --background-opacity: 0.12; --chip-border-radius: 8px; --chip-height: 40px; --chip-font-size: 1em; --icon-color: var(--dark-primary-color)"
              >
                ${Cs("components.table.filter.hidden_items",this.hass.language,"number",this._getFilteredItems())}
              </alarmo-chip>
            `:""}
      </div>
    `:Z``;}_showFilterMenu(){this.filterSelection=Object.entries(this.filterConfig).reduce((e,[t,a])=>Object.assign(Object.assign({},e),{[t]:yn(a,["value"])}),{});}renderFilterMenu(){return this.filterConfig&&this.filterSelection?Z`
      <span class="header">
        ${Cs("components.table.filter.label",this.hass.language)}
      </span>
      <ha-icon-button
        class="close"
        .path=${Ds}
        @click=${e=>{e.target.parentElement.parentElement.querySelector("ha-icon-button").click();}}
      ></ha-icon-button>
      ${Object.keys(this.filterConfig).map(e=>{if(this.filterConfig[e].binary)return Z`
            <div class="dropdown-item checkbox">
              <ha-checkbox
                @change=${t=>this._updateFilterSelection(e,t.target.checked)}
                ?checked=${this.filterSelection[e].value.length}
              ></ha-checkbox>
              <span class="name">
                ${this.filterConfig[e].name}
              </span>
            </div>
          `;let t=this.filterConfig[e].items;t=t.map(t=>{var a;return t.badge&&"function"==typeof t.badge?Object.assign(Object.assign({},t),{badge:t.badge(null===(a=this.data)||void 0===a?void 0:a.filter(t=>this.filterTableData(t,bn(this.filterSelection,e))))}):t;});const a=this.filterSelection[e].value;return Z`
          <div class="dropdown-item">
            <span class="name">
              ${this.filterConfig[e].name}
            </span>
            <alarmo-chip-set
              toggleable
              .items=${t}
              @value-changed=${t=>this._updateFilterSelection(e,t.detail)}
              .value=${a}
            ></alarmo-chip-set>
          </div>
        `;})}
    `:Z``;}_updateFilterSelection(e,t){"boolean"==typeof t&&(t=t?this.filterConfig[e].items[0].value:[],1==Object.keys(this.filterConfig).length&&(this._menu.open=!1)),this.filterSelection=Object.assign(Object.assign({},this.filterSelection),{[e]:{value:t}});}_clearFilters(){Object.keys(this.filterConfig).forEach(e=>{this.filterConfig=Object.assign(Object.assign({},this.filterConfig),{[e]:Object.assign(Object.assign({},this.filterConfig[e]),{value:[]})});});}_applyFilterSelection(){Object.keys(this.filterConfig).forEach(e=>{this.filterConfig=Object.assign(Object.assign({},this.filterConfig),{[e]:Object.assign(Object.assign({},this.filterConfig[e]),this.filterSelection[e])});});}};hr.styles=h`
    :host {
      width: 100%;
    }
    div.table {
      display: inline-flex;
      flex-direction: column;
      box-sizing: border-box;
      width: 100%;
    }
    div.table .header {
      font-weight: bold;
    }
    div.table-row {
      display: flex;
      width: 100%;
      /* ext: rows grow with their content (was a fixed 52px, which broke multi-line cells) */
      min-height: 52px;
      border-top: 1px solid var(--divider-color);
      flex-direction: row;
      position: relative;
    }
    div.table-cell {
      align-self: center;
      overflow: hidden;
      text-overflow: ellipsis;
      flex-shrink: 0;
      box-sizing: border-box;
    }
    div.table-cell.text {
      padding: 4px 16px;
    }
    div.table-cell.grow {
      flex-grow: 1;
      flex-shrink: 1;
      min-width: 160px; /* ext: never squeeze the name to "Na…" */
    }

    div.table-cell > ha-switch {
      width: 68px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    div.table-cell.center {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    div.table-cell.right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    div.table-cell > ha-icon-button {
      color: var(--secondary-text-color);
    }
    div.table-cell > ha-checkbox {
      display: flex;
      align-items: center;
    }
    div.table-cell > * {
      transition: color 0.2s ease-in-out;
    }
    div.table .header div.table-cell span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }
    div.table-row.selectable {
      cursor: pointer;
    }
    .table-row::before {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      opacity: 0.12;
      pointer-events: none;
      content: '';
      border-radius: 4px;
    }
    div.table-row.selectable:hover::before {
      background-color: rgba(var(--rgb-primary-text-color), 0.5);
    }
    div.table-row.warning::before {
      background-color: var(--error-color);
      opacity: 0.06;
    }
    div.table-row.warning:hover::before {
      background-color: var(--error-color);
      opacity: 0.12;
    }
    div.table-row.warning span {
      color: var(--error-color);
    }

    ha-icon, ha-svg-icon {
      color: var(--state-icon-color);
      padding: 8px;
    }

    .secondary {
      color: var(--secondary-text-color);
      display: flex;
      padding-top: 4px;
    }

    a,
    a:visited {
      color: var(--primary-color);
    }

    span.disabled {
      color: var(--secondary-text-color);
    }
    span.secondary.disabled {
      color: var(--disabled-text-color);
    }
    ha-icon.disabled, ha-svg-icon.disabled {
      color: var(--state-unavailable-color);
    }

    div.table-filter {
      display: flex;
      width: 100%;
      min-height: 52px;
      border-top: 1px solid var(--divider-color);
      box-sizing: border-box;
      padding: 2px 8px;
      flex: 1;
      position: relative;
      flex-direction: row;
      align-items: center;
    }
    ha-dropdown .header {
      display: flex;
      padding: 8px 16px;
      font-weight: bold;
    }
    ha-dropdown ha-icon-button.close {
      position: absolute;
      top: 8px;
      right: 8px;
    }
    div.dropdown-item {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      padding: 8px 16px;
      width: 100%;
      min-height: 52px;
      box-sizing: border-box;
    }
    div.dropdown-item .name {
      display: inline-flex;
    }
    div.dropdown-item alarmo-chips {
      display: flex;
      flex-direction: row;
    }
    div.dropdown-item.checkbox {
      flex-direction: row;
      align-items: center;
    }
  `,s([ye()],hr.prototype,"hass",void 0),s([ye()],hr.prototype,"columns",void 0),s([ye()],hr.prototype,"data",void 0),s([be()],hr.prototype,"filterConfig",void 0),s([be()],hr.prototype,"filterSelection",void 0),s([ye({type:Boolean})],hr.prototype,"selectable",void 0),s([_e("ha-dropdown")],hr.prototype,"_menu",void 0),hr=s([ue("alarmo-table")],hr);let pr=class extends pe{async showDialog(e){this._params=e,await this.updateComplete;}async closeDialog(){this._params&&this._params.cancel(),this._params=void 0;}render(){return this._params?Z`
      <ha-dialog
        open
        @closed=${this.closeDialog}
      >
        <ha-dialog-header slot="header">
          <ha-icon-button
            slot="navigationIcon"
            data-dialog="close"
            .label=${this.hass.localize("ui.common.close")}
            .path=${Ds}
          ></ha-icon-button>
          <div slot="title">${this._params.title}</div>
        </ha-dialog-header>
        <div class="wrapper">
          ${this._params.description}
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button appearance="plain" slot="primaryAction" @click=${this.cancelClick} dialogAction="close">
            ${this.hass.localize("ui.common.cancel")}
          </ha-button>
          <ha-button appearance="plain" slot="secondaryAction" style="float: left" @click=${this.confirmClick} dialogAction="close">
            ${this.hass.localize("ui.common.ok")}
          </ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `:Z``;}confirmClick(){this._params.confirm();}cancelClick(){this._params.cancel();}static get styles(){return h`
      ${Cn}
      div.wrapper {
        color: var(--primary-text-color);
      }
    `;}};s([ye({attribute:!1})],pr.prototype,"hass",void 0),s([be()],pr.prototype,"_params",void 0),pr=s([ue("confirm-delete-dialog")],pr);var mr=Object.freeze({__proto__:null,get ConfirmDeleteDialog(){return pr;}});let ur=class extends Le(pe){constructor(){super(...arguments),this.areas={},this.sensors={},this.automations={},this.name="";}hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"alarmo_config_updated"})];}async _fetchData(){this.hass&&(this.areas=await Ee(this.hass),this.sensors=await $e(this.hass),this.automations=await Ae(this.hass));}async showDialog(e){await this._fetchData(),this._params=e,e.area_id&&(this.area_id=e.area_id,this.name=this.areas[this.area_id].name),await this.updateComplete;}async closeDialog(){this._params=void 0,this.area_id=void 0,this.name="";}render(){return this._params?Z`
      <ha-dialog
        open
        @closed=${this.closeDialog}
      >
        <ha-dialog-header slot="header">
          <ha-icon-button
            slot="navigationIcon"
            data-dialog="close"
            .label=${this.hass.localize("ui.common.close")}
            .path=${Ds}
          ></ha-icon-button>
          <div slot="title">
            ${this.area_id?Cs("panels.general.dialogs.edit_area.title",this.hass.language,"{area}",this.areas[this.area_id].name):Cs("panels.general.dialogs.create_area.title",this.hass.language)}
          </div>
        </ha-dialog-header>
        <div class="wrapper">
          <ha-input
            label=${this.hass.localize("ui.common.name")}
            @input=${e=>this.name=e.target.value}
            value="${this.name}"
          ></ha-input>
          ${this.area_id?Z`
                <span class="note">
                  ${Cs("panels.general.dialogs.edit_area.name_warning",this.hass.language)}
                </span>
              `:""}
          ${this.area_id?"":Z`
          <alarmo-select
            .hass=${this.hass}
            .items=${Object.values(this.areas).map(e=>Object({value:e.area_id,name:e.name}))}
            value=${this.selectedArea}
            label="${Cs("panels.general.dialogs.create_area.fields.copy_from",this.hass.language)}"
            clearable=${!0}
            @value-changed=${e=>this.selectedArea=e.target.value}
          ></alarmo-select>
              `}
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button appearance="plain" slot="primaryAction" @click=${this.saveClick}>
            ${this.hass.localize("ui.common.save")}
          </ha-button>
          ${this.area_id?Z`
            <ha-button
              appearance="plain"
              slot="secondaryAction"
              @click=${this.deleteClick}
              variant="danger"
              ?disabled=${1==Object.keys(this.areas).length}
            >
              ${this.hass.localize("ui.common.delete")}
            </ha-button>
              `:""}
        </ha-dialog-footer>
      </ha-dialog>
    `:Z``;}saveClick(e){const t=this.name.trim();if(!t.length)return;let a={name:t};this.area_id?a=Object.assign(Object.assign({},a),{area_id:this.area_id}):this.selectedArea&&(a=Object.assign(Object.assign({},a),{modes:Object.assign({},this.areas[this.selectedArea].modes)})),Me(this.hass,a).catch(t=>wn(t,e)).then(()=>{this.closeDialog();});}async deleteClick(e){if(!this.area_id)return;const t=Object.values(this.sensors).filter(e=>e.area==this.area_id).length,a=Object.values(this.automations).filter(e=>{var t;return null===(t=e.triggers)||void 0===t?void 0:t.map(e=>e.area).includes(this.area_id);}).length;let i=!1;var s,n;i=!t&&!a||(await new Promise(i=>{pn(e.target,"show-dialog",{dialogTag:"confirm-delete-dialog",dialogImport:()=>Promise.resolve().then(function(){return mr;}),dialogParams:{title:Cs("panels.general.dialogs.remove_area.title",this.hass.language),description:Cs("panels.general.dialogs.remove_area.description",this.hass.language,"sensors",String(t),"automations",String(a)),cancel:()=>i(!1),confirm:()=>i(!0)}});})),i&&(s=this.hass,n=this.area_id,s.callApi("POST","alarmo/area",{area_id:n,remove:!0})).catch(t=>wn(t,e)).then(()=>{this.closeDialog();});}static get styles(){return h`
      ${Cn}
      div.wrapper {
        color: var(--primary-text-color);
      }
      span.note {
        color: var(--secondary-text-color);
      }
      ha-input {
        display: block;
      }
      alarmo-select {
        margin-top: 10px;
      }
    `;}};s([ye({attribute:!1})],ur.prototype,"hass",void 0),s([be()],ur.prototype,"_params",void 0),s([ye()],ur.prototype,"areas",void 0),s([ye()],ur.prototype,"sensors",void 0),s([ye()],ur.prototype,"automations",void 0),s([ye()],ur.prototype,"name",void 0),s([ye()],ur.prototype,"area_id",void 0),s([ye()],ur.prototype,"selectedArea",void 0),ur=s([ue("create-area-dialog")],ur);var gr=Object.freeze({__proto__:null,get CreateAreaDialog(){return ur;}});let vr=class extends Le(pe){constructor(){super(...arguments),this.areas={},this.sensors={},this.automations={};}hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"alarmo_config_updated"})];}async _fetchData(){this.hass&&(this.areas=await Ee(this.hass),this.sensors=await $e(this.hass),this.automations=await Ae(this.hass));}render(){if(!this.hass)return Z``;const e=Object.values(this.areas);e.sort(An);const t={actions:{width:"48px"},name:{title:this.hass.localize("ui.common.name"),width:"40%",grow:!0,text:!0},remarks:{title:Cs("panels.general.cards.areas.table.remarks",this.hass.language),width:"60%",hide:this.narrow,text:!0}},a=Object.values(e).map(t=>{const a=Object.values(this.sensors).filter(e=>e.area==t.area_id).length,i=1==Object.values(e).length?Object.values(this.automations).filter(e=>{var a,i;return(null===(a=e.triggers)||void 0===a?void 0:a.map(e=>e.area).includes(t.area_id))||!(null===(i=e.triggers)||void 0===i?void 0:i.map(e=>e.area).length);}).length:Object.values(this.automations).filter(e=>{var a;return null===(a=e.triggers)||void 0===a?void 0:a.map(e=>e.area).includes(t.area_id);}).length,s=`<a href="${Mn("zones",{filter:{area:t.area_id}})}">${Cs("panels.general.cards.areas.table.summary_sensors",this.hass.language,"number",a)}</a>`,n=a=>Object.values(this.automations).filter(i=>{var s,n;return i.type==a&&((null===(s=i.triggers)||void 0===s?void 0:s.map(e=>e.area).includes(t.area_id))||1==Object.values(e).length&&!(null===(n=i.triggers)||void 0===n?void 0:n.map(e=>e.area).length));}).length,r=(e,t)=>`${e} ${t}${1==e?"":"s"}`,o=i?`<a href="${Mn("notifications",{filter:{area:t.area_id}})}">${r(n("notification"),"notification")}</a> and <a href="${Mn("actions",{filter:{area:t.area_id}})}">${r(n("action"),"action")}</a>`:Cs("panels.general.cards.areas.table.summary_automations",this.hass.language,"number",0);return{id:t.area_id,actions:Z`
          <ha-icon-button @click=${e=>this.editClick(e,t.area_id)} .path=${Ks}></ha-icon-button>
        `,name:mn(t.name),remarks:dr(Cs("panels.general.cards.areas.table.summary",this.hass.language,"summary_sensors",s,"summary_automations",o))};});return Z`
      <ha-card>${Qn(Cs("panels.general.cards.areas.title",this.hass.language),"settings")}
        <div class="card-content">
          ${Cs("panels.general.cards.areas.description",this.hass.language)}
        </div>
        <div class="card-actions" style="border-top:none;border-bottom:1px solid var(--divider-color)">
          <ha-button appearance="plain" @click=${this.addClick}>
            ${Cs("panels.general.cards.areas.actions.add",this.hass.language)}
          </ha-button>
        </div>

        <alarmo-table .columns=${t} .data=${a}>
          ${Cs("panels.general.cards.areas.no_items",this.hass.language)}
        </alarmo-table>
      </ha-card>
    `;}addClick(e){const t=e.target;pn(t,"show-dialog",{dialogTag:"create-area-dialog",dialogImport:()=>Promise.resolve().then(function(){return gr;}),dialogParams:{}});}editClick(e,t){const a=e.target;pn(a,"show-dialog",{dialogTag:"create-area-dialog",dialogImport:()=>Promise.resolve().then(function(){return gr;}),dialogParams:{area_id:t}});}};vr.styles=Cn,s([ye()],vr.prototype,"narrow",void 0),s([ye()],vr.prototype,"path",void 0),s([ye()],vr.prototype,"config",void 0),s([ye()],vr.prototype,"areas",void 0),s([ye()],vr.prototype,"sensors",void 0),s([ye()],vr.prototype,"automations",void 0),vr=s([ue("area-config-card")],vr);let yr=class extends pe{constructor(){super(...arguments),this.name="";}async showDialog(e){this._params=e;const t=await we(this.hass);this.name=t.master.name||"",await this.updateComplete;}async closeDialog(){this._params=void 0;}render(){return this._params?Z`
      <ha-dialog
        open
        @closed=${this.closeDialog}
      >
        <ha-dialog-header slot="header">
          <ha-icon-button
            slot="navigationIcon"
            data-dialog="close"
            .label=${this.hass.localize("ui.common.close")}
            .path=${Ds}
          ></ha-icon-button>
          <div slot="title">${Cs("panels.general.dialogs.edit_master.title",this.hass.language)}</div>
        </ha-dialog-header>
        <div class="wrapper">
          <ha-input
            label=${this.hass.localize("ui.common.name")}
            @input=${e=>this.name=e.target.value}
            value="${this.name}"
          ></ha-input>
          <span class="note">${Cs("panels.general.dialogs.edit_area.name_warning",this.hass.language)}</span>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button appearance="plain" slot="primaryAction" @click=${this.saveClick}>
            ${this.hass.localize("ui.common.save")}
          </ha-button>
          <ha-button appearance="plain" slot="secondaryAction" @click=${this.closeDialog}>
            ${this.hass.localize("ui.common.cancel")}
          </ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `:Z``;}saveClick(){const e=this.name.trim();e.length&&je(this.hass,{master:{enabled:!0,name:e}}).catch().then(()=>{this.closeDialog();});}static get styles(){return h`
      div.wrapper {
        color: var(--primary-text-color);
      }
      span.note {
        color: var(--secondary-text-color);
      }
      ha-input {
        display: block;
      }
    `;}};s([ye({attribute:!1})],yr.prototype,"hass",void 0),s([be()],yr.prototype,"_params",void 0),s([ye()],yr.prototype,"name",void 0),yr=s([ue("edit-master-dialog")],yr);var br=Object.freeze({__proto__:null,get EditMasterDialog(){return yr;}});let _r=class extends Le(pe){constructor(){super(...arguments),this.areas={},this.automations={},this.showLegacy=!1;}hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"alarmo_config_updated"})];}async _fetchData(){var e;if(this.hass){this.config=await we(this.hass),this.areas=await Ee(this.hass),this.automations=await Ae(this.hass),this.data=yn(this.config,["trigger_time","disarm_after_trigger","ignore_blocking_sensors_after_trigger","mqtt","master"]);try{this.showLegacy=!!(null===(e=(await Ln(this.hass)).ui)||void 0===e?void 0:e.show_legacy_zones);}catch(e){}}}firstUpdated(){(async()=>{await fe();})();}render(){var e,t,a,i,s,n,r,o,d;if(!this.hass||!this.config||!this.data)return Z``;if("mqtt_configuration"==this.path.subpage)return Z`
        <mqtt-config-card .hass=${this.hass} .narrow=${this.narrow}></mqtt-config-card>
      `;if(this.path.params.edit_area)return Z`
        <area-editor-card
          .hass=${this.hass}
          .narrow=${this.narrow}
          item=${this.path.params.edit_area}
        ></area-editor-card>
      `;{if("modes"==this.section)return Z`<alarm-mode-card .hass=${this.hass} .narrow=${this.narrow}></alarm-mode-card>`;if("partitions"==this.section)return Z`<area-config-card .hass=${this.hass} .narrow=${this.narrow}></area-config-card>
          <alarm-mode-card .hass=${this.hass} .narrow=${this.narrow}></alarm-mode-card>`;const l=void 0===this.section;return Z`
        <ha-card>${Qn(Cs("panels.general.title",this.hass.language),"settings")}
          <div class="card-content">
            ${Cs("panels.general.cards.general.description",this.hass.language)}
          </div>

          <alarmo-settings-row .narrow=${this.narrow}>
            <span slot="heading">
              ${Cs("panels.general.cards.general.fields.disarm_after_trigger.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${Cs("panels.general.cards.general.fields.disarm_after_trigger.description",this.hass.language)}
            </span>
            <ha-switch
              ?checked=${this.data.disarm_after_trigger}
              @change=${e=>{this.saveData({disarm_after_trigger:e.target.checked});}}
            ></ha-switch>
          </alarmo-settings-row>

          ${!1===(null===(e=this.data)||void 0===e?void 0:e.disarm_after_trigger)?Z`
          <alarmo-settings-row .narrow=${this.narrow} nested>
            <span slot="heading">
              ${Cs("panels.general.cards.general.fields.ignore_blocking_sensors_after_trigger.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${Cs("panels.general.cards.general.fields.ignore_blocking_sensors_after_trigger.description",this.hass.language)}
            </span>
            <ha-switch
              ?checked=${this.data.ignore_blocking_sensors_after_trigger}
              @change=${e=>{this.saveData({ignore_blocking_sensors_after_trigger:e.target.checked});}}
            ></ha-switch>
          </alarmo-settings-row>
          `:""}

          <alarmo-settings-row .narrow=${this.narrow}>
            <span slot="heading">Show the Zones (legacy) tab</span>
            <span slot="description">
              Upstream Alarmo's original zone page. Zone Assignments does the same and more, so it is hidden unless you
              turn this on.
            </span>
            <ha-switch
              ?checked=${this.showLegacy}
              @change=${async e=>{var t,a;this.showLegacy=e.target.checked,await(t=this.hass,a={show_legacy_zones:this.showLegacy},t.callWS({type:"alarmo/ext/ui/set",ui:a})),window.dispatchEvent(new CustomEvent("alarmo-ext-ui-changed"));}}
            ></ha-switch>
          </alarmo-settings-row>

          <alarmo-settings-row .narrow=${this.narrow}>
            <span slot="heading">
              ${Cs("panels.general.cards.general.fields.enable_mqtt.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${Cs("panels.general.cards.general.fields.enable_mqtt.description",this.hass.language)}
            </span>
            <ha-switch
              ?checked=${null===(a=null===(t=this.data)||void 0===t?void 0:t.mqtt)||void 0===a?void 0:a.enabled}
              @change=${e=>{this.saveData({mqtt:Object.assign(Object.assign({},this.data.mqtt),{enabled:e.target.checked})});}}
            ></ha-switch>
          </alarmo-settings-row>

          ${(null===(s=null===(i=this.data)||void 0===i?void 0:i.mqtt)||void 0===s?void 0:s.enabled)?Z`
                <div style="padding: 0px 0px 16px 16px; margin-top: -8px">
                  <ha-button
                    appearance="filled"
                    @click=${()=>xn(0,Mn("general","mqtt_configuration"),!0)}
                  >
                    ${Cs("panels.general.cards.general.actions.setup_mqtt",this.hass.language)}
                    <ha-icon slot="end" icon="mdi:open-in-new"></ha-icon>
                  </ha-button>
                </div>
              `:""}
          ${Object.keys(this.areas).length>=2?Z`
                <alarmo-settings-row .narrow=${this.narrow}>
                  <span slot="heading">
                    ${Cs("panels.general.cards.general.fields.enable_master.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${Cs("panels.general.cards.general.fields.enable_master.description",this.hass.language)}
                  </span>
                  <ha-switch
                    ?checked=${(null===(r=null===(n=this.data)||void 0===n?void 0:n.master)||void 0===r?void 0:r.enabled)&&Object.keys(this.areas).length>=2}
                    ?disabled=${Object.keys(this.areas).length<2}
                    @change=${this.toggleEnableMaster}
                  ></ha-switch>
                </alarmo-settings-row>
              `:""}
          ${(null===(d=null===(o=this.data)||void 0===o?void 0:o.master)||void 0===d?void 0:d.enabled)&&Object.keys(this.areas).length>=2?Z`
                <div style="padding: 0px 0px 16px 16px; margin-top: -8px">
                  <ha-button
                    appearance="filled"
                    @click=${this.setupMasterClick}
                  >
                    ${Cs("panels.general.cards.general.actions.setup_master",this.hass.language)}
                    <ha-icon slot="end" icon="mdi:open-in-new"></ha-icon>
                  </ha-button>
                </div>
              `:""}
        </ha-card>

        ${l?Z`
              <alarm-mode-card .hass=${this.hass} .narrow=${this.narrow}></alarm-mode-card>

              <area-config-card .hass=${this.hass} .narrow=${this.narrow}></area-config-card>
            `:""}
      `;}}setupMasterClick(e){const t=e.target;pn(t,"show-dialog",{dialogTag:"edit-master-dialog",dialogImport:()=>Promise.resolve().then(function(){return br;}),dialogParams:{}});}async toggleEnableMaster(e){const t=e.target;let a=t.checked;if(!a){const i=Object.values(this.automations).filter(e=>e.triggers.some(e=>!e.area));if(i.length){(await new Promise(e=>{pn(t,"show-dialog",{dialogTag:"confirm-delete-dialog",dialogImport:()=>Promise.resolve().then(function(){return mr;}),dialogParams:{title:Cs("panels.general.dialogs.disable_master.title",this.hass.language),description:Cs("panels.general.dialogs.disable_master.description",this.hass.language,"automations",String(i.length)),cancel:()=>e(!1),confirm:()=>e(!0)}});}))?!a&&i.length&&i.forEach(t=>{Te(this.hass,t.automation_id).catch(t=>wn(t,e));}):(a=!0,t.checked=!0);}}this.saveData({master:Object.assign(Object.assign({},this.data.master),{enabled:a})});}saveData(e){this.hass&&this.data&&(this.data=Object.assign(Object.assign({},this.data),e),je(this.hass,this.data).catch(e=>wn(e,this.shadowRoot.querySelector("ha-card"))).then());}};_r.styles=Cn,s([ye()],_r.prototype,"narrow",void 0),s([ye()],_r.prototype,"path",void 0),s([ye()],_r.prototype,"section",void 0),s([ye()],_r.prototype,"data",void 0),s([ye()],_r.prototype,"config",void 0),s([ye()],_r.prototype,"areas",void 0),s([ye()],_r.prototype,"automations",void 0),s([ye()],_r.prototype,"showLegacy",void 0),_r=s([ue("alarm-view-general")],_r);const fr=(e,t)=>{const a=function(e){const t="string"==typeof e?e:e.entity_id;return String(t.split(".").shift());}(e.entity_id);if("binary_sensor"==a){if(t)return!0;const a=e.attributes.device_class;return!!a&&!!["carbon_monoxide","door","garage_door","gas","heat","lock","moisture","motion","moving","occupancy","opening","presence","safety","smoke","sound","tamper","vibration","window"].includes(a);}return!1;},kr=e=>{switch(e.attributes.device_class){case"door":case"garage_door":case"lock":case"opening":return rn.Door;case"window":return rn.Window;case"carbon_monoxide":case"gas":case"heat":case"moisture":case"smoke":case"safety":return rn.Environmental;case"motion":case"moving":case"occupancy":case"presence":return rn.Motion;case"sound":case"vibration":case"tamper":return rn.Tamper;default:return;}},wr=e=>{const t=t=>t.filter(t=>e.includes(t));return{[rn.Door]:{modes:t([cn.ArmedAway,cn.ArmedHome,cn.ArmedNight,cn.ArmedVacation]),always_on:!1,allow_open:!1,arm_on_close:!1,use_entry_delay:!0,use_exit_delay:!0},[rn.Window]:{modes:t([cn.ArmedAway,cn.ArmedHome,cn.ArmedNight,cn.ArmedVacation]),always_on:!1,allow_open:!1,arm_on_close:!1,use_entry_delay:!1,use_exit_delay:!1},[rn.Motion]:{modes:t([cn.ArmedAway,cn.ArmedVacation]),always_on:!1,allow_open:!0,arm_on_close:!1,use_entry_delay:!0,use_exit_delay:!0},[rn.Tamper]:{modes:t([cn.ArmedAway,cn.ArmedHome,cn.ArmedNight,cn.ArmedVacation,cn.ArmedCustom]),always_on:!1,allow_open:!1,arm_on_close:!1,use_entry_delay:!1,use_exit_delay:!1},[rn.Environmental]:{modes:t([cn.ArmedAway,cn.ArmedHome,cn.ArmedNight,cn.ArmedVacation,cn.ArmedCustom]),always_on:!0,allow_open:!1,arm_on_close:!1,use_entry_delay:!1,use_exit_delay:!1}};};function $r(e,t){if(!e)return null;const a=jn(e.entity_id);let i={entity_id:e.entity_id,modes:[],use_entry_delay:!0,use_exit_delay:!0,entry_delay:null,delay_on:null,arm_on_close:!1,allow_open:!1,always_on:!1,auto_bypass:!1,auto_bypass_modes:[],trigger_unavailable:!1,type:rn.Other,enabled:!0};if("binary_sensor"==a){const a=kr(e);a&&(i=Object.assign(Object.assign(Object.assign({},i),{type:a}),wr(t)[a]));}return i;}const zr=(e,t,a=!1)=>{const i=Object.values(e.states).filter(e=>fr(e,a)).filter(e=>!t.includes(e.entity_id)).map(e=>Object({id:e.entity_id,name:un(e),icon:Ar(e)}));return i.sort(An),i;},Ar=(e,t)=>{const a="off"===t;switch(null==e?void 0:e.attributes.device_class){case"battery":return a?Ms:"M16,20H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z";case"battery_charging":return a?Ms:"M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.66C6,21.4 6.6,22 7.33,22H16.66C17.4,22 18,21.4 18,20.67V5.33C18,4.6 17.4,4 16.67,4M11,20V14.5H9L13,7V12.5H15";case"cold":return a?Js:"M20.79,13.95L18.46,14.57L16.46,13.44V10.56L18.46,9.43L20.79,10.05L21.31,8.12L19.54,7.65L20,5.88L18.07,5.36L17.45,7.69L15.45,8.82L13,7.38V5.12L14.71,3.41L13.29,2L12,3.29L10.71,2L9.29,3.41L11,5.12V7.38L8.5,8.82L6.5,7.69L5.92,5.36L4,5.88L4.47,7.65L2.7,8.12L3.22,10.05L5.55,9.43L7.55,10.56V13.45L5.55,14.58L3.22,13.96L2.7,15.89L4.47,16.36L4,18.12L5.93,18.64L6.55,16.31L8.55,15.18L11,16.62V18.88L9.29,20.59L10.71,22L12,20.71L13.29,22L14.7,20.59L13,18.88V16.62L15.5,15.17L17.5,16.3L18.12,18.63L20,18.12L19.53,16.35L21.3,15.88L20.79,13.95M9.5,10.56L12,9.11L14.5,10.56V13.44L12,14.89L9.5,13.44V10.56Z";case"connectivity":return a?"M13,19H14A1,1 0 0,1 15,20H15.73L13,17.27V19M22,20V21.18L20.82,20H22M21,22.72L19.73,24L17.73,22H15A1,1 0 0,1 14,23H10A1,1 0 0,1 9,22H2V20H9A1,1 0 0,1 10,19H11V17H4A1,1 0 0,1 3,16V12A1,1 0 0,1 4,11H6.73L4.73,9H4A1,1 0 0,1 3,8V7.27L1,5.27L2.28,4L21,22.72M4,3H20A1,1 0 0,1 21,4V8A1,1 0 0,1 20,9H9.82L7,6.18V5H5.82L3.84,3C3.89,3 3.94,3 4,3M20,11A1,1 0 0,1 21,12V16A1,1 0 0,1 20,17H17.82L11.82,11H20M9,7H10V5H9V7M9,15H10V14.27L9,13.27V15M5,13V15H7V13H5Z":"M13,19H14A1,1 0 0,1 15,20H22V22H15A1,1 0 0,1 14,23H10A1,1 0 0,1 9,22H2V20H9A1,1 0 0,1 10,19H11V17H4A1,1 0 0,1 3,16V12A1,1 0 0,1 4,11H20A1,1 0 0,1 21,12V16A1,1 0 0,1 20,17H13V19M4,3H20A1,1 0 0,1 21,4V8A1,1 0 0,1 20,9H4A1,1 0 0,1 3,8V4A1,1 0 0,1 4,3M9,7H10V5H9V7M9,15H10V13H9V15M5,5V7H7V5H5M5,13V15H7V13H5Z";case"door":return a?Bs:Is;case"garage_door":return a?"M19,20H17V11H7V20H5V9L12,5L19,9V20M8,12H16V14H8V12M8,15H16V17H8V15M16,18V20H8V18H16Z":"M19,20H17V11H7V20H5V9L12,5L19,9V20M8,12H16V14H8V12Z";case"power":case"plug":return a?Qs:Ys;case"gas":case"problem":case"safety":case"tamper":return a?Ls:Ts;case"smoke":return a?Ls:"M17 19V22H15V19C15 17.9 14.1 17 13 17H10C7.2 17 5 14.8 5 12C5 10.8 5.4 9.8 6.1 8.9C3.8 8.5 2 6.4 2 4C2 3.3 2.2 2.6 2.4 2H4.8C4.3 2.5 4 3.2 4 4C4 5.7 5.3 7 7 7H10V9C8.3 9 7 10.3 7 12S8.3 15 10 15H13C15.2 15 17 16.8 17 19M17.9 8.9C20.2 8.5 22 6.4 22 4C22 3.3 21.8 2.6 21.6 2H19.2C19.7 2.5 20 3.2 20 4C20 5.7 18.7 7 17 7H15.8C15.9 7.3 16 7.6 16 8C16 9.7 14.7 11 13 11V13C15.8 13 18 15.2 18 18V22H20V18C20 15.3 18.5 13 16.2 11.8C17.1 11.1 17.7 10.1 17.9 8.9Z";case"heat":return a?Js:Vs;case"light":return a?"M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z":"M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z";case"lock":return a?Gs:Fs;case"moisture":return a?"M20.84 22.73L16.29 18.18C15.2 19.3 13.69 20 12 20C8.69 20 6 17.31 6 14C6 12.67 6.67 11.03 7.55 9.44L1.11 3L2.39 1.73L22.11 21.46L20.84 22.73M18 14C18 10 12 3.25 12 3.25S10.84 4.55 9.55 6.35L17.95 14.75C18 14.5 18 14.25 18 14Z":"M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z";case"motion":return a?"M14.12,10H19V8.2H15.38L13.38,4.87C13.08,4.37 12.54,4.03 11.92,4.03C11.74,4.03 11.58,4.06 11.42,4.11L6,5.8V11H7.8V7.33L9.91,6.67L6,22H7.8L10.67,13.89L13,17V22H14.8V15.59L12.31,11.05L13.04,8.18M14,3.8C15,3.8 15.8,3 15.8,2C15.8,1 15,0.2 14,0.2C13,0.2 12.2,1 12.2,2C12.2,3 13,3.8 14,3.8Z":"M13.5,5.5C14.59,5.5 15.5,4.58 15.5,3.5C15.5,2.38 14.59,1.5 13.5,1.5C12.39,1.5 11.5,2.38 11.5,3.5C11.5,4.58 12.39,5.5 13.5,5.5M9.89,19.38L10.89,15L13,17V23H15V15.5L12.89,13.5L13.5,10.5C14.79,12 16.79,13 19,13V11C17.09,11 15.5,10 14.69,8.58L13.69,7C13.29,6.38 12.69,6 12,6C11.69,6 11.5,6.08 11.19,6.08L6,8.28V13H8V9.58L9.79,8.88L8.19,17L3.29,16L2.89,18L9.89,19.38Z";case"occupancy":case"presence":return a?Us:Rs;case"opening":return a?"M3,3V21H21V3":"M3,3H21V21H3V3M5,5V19H19V5H5Z";case"running":return a?"M18,18H6V6H18V18Z":"M8,5.14V19.14L19,12.14L8,5.14Z";case"sound":return a?"M4.27 3L3 4.27L12 13.27V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17S7.79 21 10 21 14 19.21 14 17V15.27L19.73 21L21 19.73L4.27 3M14 7H18V3H12V8.18L14 10.18Z":"M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17S7.79 21 10 21 14 19.21 14 17V7H18V3H12Z";case"update":return a?"M5.12,5H18.87L17.93,4H5.93L5.12,5M20.54,5.23C20.83,5.57 21,6 21,6.5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V6.5C3,6 3.17,5.57 3.46,5.23L4.84,3.55C5.12,3.21 5.53,3 6,3H18C18.47,3 18.88,3.21 19.15,3.55L20.54,5.23M6,18H12V15H6V18Z":"M20.54,5.23C20.83,5.57 21,6 21,6.5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V6.5C3,6 3.17,5.57 3.46,5.23L4.84,3.55C5.12,3.21 5.53,3 6,3H18C18.47,3 18.88,3.21 19.15,3.55L20.54,5.23M5.12,5H18.87L17.93,4H5.93L5.12,5M12,9.5L6.5,15H10V17H14V15H17.5L12,9.5Z";case"vibration":return a?Ps:Xs;case"window":return a?en:tn;default:return a?"M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z":"M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z";}};let xr=class extends pe{async showDialog(e){this._params=e,await this.updateComplete;}async closeDialog(){this._params=void 0;}render(){return this._params?Z`
      <ha-dialog
        open
        @closed=${this.closeDialog}
      >
        <ha-dialog-header slot="header">
          <ha-icon-button
            slot="navigationIcon"
            data-dialog="close"
            .label=${this.hass.localize("ui.common.close")}
            .path=${Ds}
          ></ha-icon-button>
          <div slot="title">${this.hass.localize("state_badge.default.error")}</div>
        </ha-dialog-header>
        <div class="wrapper">
          ${this._params.error||""}
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button appearance="plain" slot="primaryAction" style="float: left" @click=${this.closeDialog} dialogAction="close">
            ${this.hass.localize("ui.common.ok")}
          </ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `:Z``;}static get styles(){return h`
      div.wrapper {
        color: var(--primary-text-color);
      }
    `;}};s([ye({attribute:!1})],xr.prototype,"hass",void 0),s([be()],xr.prototype,"_params",void 0),xr=s([ue("error-dialog")],xr);var jr=Object.freeze({__proto__:null,get ErrorDialog(){return xr;}});let Sr=class extends Le(pe){constructor(){super(...arguments),this.sensorGroups={},this.sensors={};}hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"alarmo_config_updated"})];}async _fetchData(){this.hass&&(this.sensorGroups=await xe(this.hass),this.sensors=await $e(this.hass));}async showDialog(e){await this._fetchData(),this._params=e,e.group_id&&Object.keys(this.sensorGroups).includes(e.group_id)?this.data=Object.assign({},this.sensorGroups[e.group_id]):this.data={name:"",entities:[],timeout:600,event_count:2},await this.updateComplete;}async closeDialog(){this._params=void 0;}render(){return this._params?Z`
      <ha-dialog
        open
        @closed=${this.closeDialog}
      >
        <ha-dialog-header slot="header">
          <ha-icon-button
            slot="navigationIcon"
            data-dialog="close"
            .label=${this.hass.localize("ui.common.close")}
            .path=${Ds}
          ></ha-icon-button>
          <div slot="title">
            ${this.data.group_id?Cs("panels.sensors.dialogs.edit_group.title",this.hass.language,"{name}",this.sensorGroups[this.data.group_id].name):Cs("panels.sensors.dialogs.create_group.title",this.hass.language)}
          </div>
        </ha-dialog-header>
        <div class="wrapper">
          <alarmo-settings-row dialog>
            <span slot="heading">
              ${Cs("panels.sensors.dialogs.create_group.fields.name.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${Cs("panels.sensors.dialogs.create_group.fields.name.description",this.hass.language)}
            </span>
            <ha-input
              label=${this.hass.localize("ui.common.name")}
              @input=${e=>this.data=Object.assign(Object.assign({},this.data),{name:String(e.target.value).trim()})}
              value="${this.data.name}"
            ></ha-input>
          </alarmo-settings-row>

          <alarmo-settings-row large dialog>
            <span slot="heading">
              ${Cs("panels.sensors.dialogs.create_group.fields.sensors.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${Cs("panels.sensors.dialogs.create_group.fields.sensors.description",this.hass.language)}
            </span>
            <div>
              ${this.renderSensorOptions()}
            </div>
          </alarmo-settings-row>

          <alarmo-settings-row dialog>
            <span slot="heading">
              ${Cs("panels.sensors.dialogs.create_group.fields.timeout.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${Cs("panels.sensors.dialogs.create_group.fields.timeout.description",this.hass.language)}
            </span>
            <alarmo-duration-picker
              .hass=${this.hass}
              min="10"
              max="900"
              .value=${this.data.timeout}
              ?required=${!0}
              @value-changed=${e=>this.data=Object.assign(Object.assign({},this.data),{timeout:e.detail.value})}
            ></alarmo-duration-picker>
          </alarmo-settings-row>

          ${this.data.entities.length>2?Z`
          <alarmo-settings-row dialog>
            <span slot="heading">
              ${Cs("panels.sensors.dialogs.create_group.fields.event_count.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${Cs("panels.sensors.dialogs.create_group.fields.event_count.description",this.hass.language)}
            </span>
            <alarmo-select
              .hass=${this.hass}
              .items=${this.renderSensorCountOptions()}
              ?disabled=${this.data.entities.length<=2}
              @value-changed=${e=>{this.data=Object.assign(Object.assign({},this.data),{event_count:Number(e.detail.value)});}}
              .value=${String(this.data.event_count>this.data.entities.length?this.data.entities.length:this.data.event_count)}
            ></alarmo-select>
          </alarmo-settings-row>
          `:""}
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button appearance="plain" slot="secondaryAction" @click=${this.saveClick}>
            ${this.hass.localize("ui.common.save")}
          </ha-button>
          ${this.data.group_id?Z`
                <ha-button appearance="plain" slot="secondaryAction" @click=${this.deleteClick} variant="danger">
                  ${this.hass.localize("ui.common.delete")}
                </ha-button>
              `:""}
        </ha-dialog-footer>
      </ha-dialog>
    `:Z``;}renderSensorOptions(){const e=Object.keys(this.sensors).filter(e=>!_n(this.sensors[e].group)||this.sensors[e].group===this.data.group_id).map(e=>{const t=this.hass.states[e],a=Object.entries(rn).find(([,t])=>t==this.sensors[e].type)[0];return{value:e,name:mn(un(t)),icon:on[a]};});return e.sort(An),e.length?Z`
      <alarmo-chip-set
        .hass=${this.hass}
        .items=${e}
        .value=${this.data.entities}
        toggleable
        @value-changed=${e=>this.data=Object.assign(Object.assign({},this.data),{entities:e.detail})}
      ></alarmo-chip-set>
    `:Cs("panels.sensors.cards.sensors.no_items",this.hass.language);}renderSensorCountOptions(){let e=[];for(let t=2;t<=this.data.entities.length;t++)e=[...e,{name:`${t}`,value:`${t}`}];return e;}saveClick(e){var t,a;this.data.name.length&&(this.data.group_id&&this.data.name==this.sensorGroups[this.data.group_id].name||!Object.values(this.sensorGroups).find(e=>e.name.toLowerCase()==this.data.name.toLowerCase()))?this.data.entities.length<2?kn(e,Cs("panels.sensors.dialogs.create_group.errors.insufficient_sensors",this.hass.language)):(this.data.event_count>this.data.entities.length&&(this.data=Object.assign(Object.assign({},this.data),{event_count:this.data.entities.length})),(t=this.hass,a=this.data,t.callApi("POST","alarmo/sensor_groups",a)).catch(t=>wn(t,e)).then(()=>{this.closeDialog();})):kn(e,Cs("panels.sensors.dialogs.create_group.errors.invalid_name",this.hass.language));}deleteClick(e){var t,a;this.data.group_id&&(t=this.hass,a=this.data.group_id,t.callApi("POST","alarmo/sensor_groups",{group_id:a,remove:!0})).catch(t=>wn(t,e)).then(()=>{this.closeDialog();});}static get styles(){return h`
      ${Tn}
      div.wrapper {
        color: var(--primary-text-color);
      }
    `;}};s([ye({attribute:!1})],Sr.prototype,"hass",void 0),s([be()],Sr.prototype,"_params",void 0),s([ye()],Sr.prototype,"sensorGroups",void 0),s([ye()],Sr.prototype,"sensors",void 0),s([ye()],Sr.prototype,"data",void 0),Sr=s([ue("create-sensor-group-dialog")],Sr);var Or=Object.freeze({__proto__:null,get CreateSensorGroupDialog(){return Sr;}});let Cr=class extends Le(pe){constructor(){super(...arguments),this.sensorGroups={},this.sensors={};}hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"alarmo_config_updated"})];}async _fetchData(){this.hass&&(this.sensorGroups=await xe(this.hass),this.sensors=await $e(this.hass));}async showDialog(e){await this._fetchData(),this._params=e,await this.updateComplete;}async closeDialog(){this._params=void 0;}render(){return this._params?Z`
      <ha-dialog
        open
        @closed=${this.closeDialog}
      >
        <ha-dialog-header slot="header">
          <ha-icon-button
            slot="navigationIcon"
            data-dialog="close"
            .label=${this.hass.localize("ui.common.close")}
            .path=${Ds}
          ></ha-icon-button>
          <div slot="title">${Cs("panels.sensors.dialogs.manage_groups.title",this.hass.language)}</div>
        </ha-dialog-header>
        <div class="wrapper">
          <div class="description">
            ${Cs("panels.sensors.dialogs.manage_groups.description",this.hass.language)}
          </div>
          <div class="container">
            ${Object.keys(this.sensorGroups).length?Object.values(this.sensorGroups).map(e=>this.renderGroup(e)):Cs("panels.sensors.dialogs.manage_groups.no_items",this.hass.language)}
          </div>
        </div>
        <ha-button appearance="plain" @click=${this.createGroupClick}>
          <ha-icon icon="hass:plus"></ha-icon>
          ${Cs("panels.sensors.dialogs.manage_groups.actions.new_group",this.hass.language)}
        </ha-button>
      </ha-dialog>
    `:Z``;}renderGroup(e){return Z`
    <ha-card
      outlined
      @click=${t=>this.editGroupClick(t,e.group_id)}
    >
      <ha-icon icon="hass:folder-outline"></ha-icon>
      <div>
        <span class="name">${e.name}</span>
        <span class="description">${Cs("panels.general.cards.areas.table.summary_sensors",this.hass.language,"{number}",String(e.entities.length))}
      </div>
      <ha-icon-button .path=${Hs}>
      </ha-icon-button>
    </ha-card>
    `;}createGroupClick(e){const t=e.target;pn(t,"show-dialog",{dialogTag:"create-sensor-group-dialog",dialogImport:()=>Promise.resolve().then(function(){return Or;}),dialogParams:{}});}editGroupClick(e,t){const a=e.target;pn(a,"show-dialog",{dialogTag:"create-sensor-group-dialog",dialogImport:()=>Promise.resolve().then(function(){return Or;}),dialogParams:{group_id:t}});}static get styles(){return h`
      ${Tn}

      div.wrapper {
        color: var(--primary-text-color);
      }
      div.container {
        display: flex;
        flex-wrap: wrap;
      }
      ha-card {
        width: 100%;
        text-align: center;
        margin: 4px;
        box-sizing: border-box;
        padding: 8px;
        color: var(--primary-text-color);
        font-size: 16px;
        cursor: pointer;
        display: flex;
        flex-direction: row;
      }
      ha-card:hover {
        background: rgba(var(--rgb-secondary-text-color), 0.1);
      }
      ha-card ha-icon {
        --mdc-icon-size: 24px;
        display: flex;
        flex: 0 0 40px;
        margin: 0px 10px;
        align-items: center;
        color: var(--state-icon-color);
      }
      ha-card ha-icon-button {
        --mdc-icon-size: 24px;
        display: flex;
        flex: 0 0 40px;
        margin: 0px 10px;
        align-items: center;
      }
      ha-card div {
        display: flex;
        flex-wrap: wrap;
        flex: 1;
      }
      ha-card span {
        display: flex;
        flex: 0 0 100%;
      }
      ha-card span.description {
        color: var(--secondary-text-color);
      }
      ha-button ha-icon {
        padding-right: 11px;
      }
    `;}};s([ye({attribute:!1})],Cr.prototype,"hass",void 0),s([be()],Cr.prototype,"_params",void 0),s([ye()],Cr.prototype,"sensorGroups",void 0),s([ye()],Cr.prototype,"sensors",void 0),Cr=s([ue("manage-sensor-groups-dialog")],Cr);var Tr=Object.freeze({__proto__:null,get ManageSensorGroupsDialog(){return Cr;}});let Er=class extends Le(pe){constructor(){super(...arguments),this.showBypassModes=!1,this.sensorsList=[],this.entityIdUnlocked=!1;}hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"alarmo_config_updated"})];}async _fetchData(){var e;if(!this.hass)return;const t=await Ee(this.hass);this.areas=t;const a=await xe(this.hass);this.sensorGroups=a;const i=await $e(this.hass);this.data=Object.keys(i).includes(this.item)?i[this.item]:void 0,this.data&&!(null===(e=this.data)||void 0===e?void 0:e.area)&&1==Object.keys(t).length&&(this.data=Object.assign(Object.assign({},this.data),{area:Object.keys(this.areas)[0]}));let s=zr(this.hass,Object.keys(i),!0);this.sensorsList=s.map(e=>Object(Object.assign(Object.assign({},e),{description:e.id,value:e.id}))),this.hass.states[this.item]||(this.entityIdUnlocked=!0);}render(){if(!this.data)return Z``;let e=[...this.sensorsList];return e.find(e=>e.value==this.data.entity_id)||(e=[{value:this.data.entity_id,description:this.data.entity_id,name:un(this.hass.states[this.item]),icon:Ar(this.hass.states[this.item])},...e]),this.hass.states[this.data.entity_id],Z`
      <ha-card>
        <div class="card-header">
          <div class="name">${Cs("panels.sensors.cards.editor.title",this.hass.language)}</div>
          ${Yn("legacy")}
          <ha-icon-button .path=${Ds} @click=${this.cancelClick}></ha-icon-button>
        </div>
        <div class="card-content">
          ${Cs("panels.sensors.cards.editor.description",this.hass.language,"{entity}",un(this.hass.states[this.item]))}
        </div>

        <alarmo-settings-row .narrow=${this.narrow} .large=${!0}>
          <span slot="heading">
            ${Cs("panels.sensors.cards.editor.fields.entity.heading",this.hass.language)}
          </span>
          <span slot="description">
            ${Cs("panels.sensors.cards.editor.fields.entity.description",this.hass.language)}
          </span>

          <div style="display: flex; flex-direction: row">
            <alarmo-select
              .hass=${this.hass}
              style="flex: 1"
              .items=${e}
              .value=${this.data.entity_id}
              label="${Cs("panels.sensors.cards.editor.fields.entity.heading",this.hass.language)}"
              @value-changed=${e=>{this.data=Object.assign(Object.assign({},this.data),{new_entity_id:e.target.value});}}
              ?disabled=${!this.entityIdUnlocked}
              ?icons=${!0}
              ?invalid=${void 0===this.hass.states[this.data.new_entity_id||this.data.entity_id]}
            ></alarmo-select>

            <ha-icon-button
              .path=${this.entityIdUnlocked?Gs:Fs}
              @click=${()=>{this.entityIdUnlocked=!this.entityIdUnlocked;}}
              style="--mdc-icon-size: 20px; --mdc-icon-button-size: 48px"
            >

            </ha-icon-button>
          </div>
        </alarmo-settings-row>


        ${Object.keys(this.areas).length>1?Z`
              <alarmo-settings-row .narrow=${this.narrow}>
                <span slot="heading">
                  ${Cs("panels.sensors.cards.editor.fields.area.heading",this.hass.language)}
                </span>
                <span slot="description">
                  ${Cs("panels.sensors.cards.editor.fields.area.description",this.hass.language)}
                </span>

                <alarmo-select
                  .hass=${this.hass}
                  .items=${Object.values(this.areas).map(e=>Object({value:e.area_id,name:e.name}))}
                  value=${this.data.area}
                  label=${Cs("panels.sensors.cards.editor.fields.area.heading",this.hass.language)}
                  @value-changed=${e=>this.data=Object.assign(Object.assign({},this.data),{area:e.target.value})}
                  ?invalid=${!this.data.area}
                ></alarmo-select>
              </alarmo-settings-row>
            `:""}

        <alarmo-settings-row .narrow=${this.narrow} .large=${!0}>
          <span slot="heading">
            ${Cs("panels.sensors.cards.editor.fields.device_type.heading",this.hass.language)}
          </span>
          <span slot="description">
            ${Cs("panels.sensors.cards.editor.fields.device_type.description",this.hass.language)}
          </span>

          <alarmo-select
            .hass=${this.hass}
            .items=${t=this.hass,Object.entries(rn).filter(([,e])=>e!=rn.Other).map(([e,a])=>Object({value:a,name:Cs(`panels.sensors.cards.editor.fields.device_type.choose.${a}.name`,t.language),description:Cs(`panels.sensors.cards.editor.fields.device_type.choose.${a}.description`,t.language),icon:on[e]}))}
            label=${Cs("panels.sensors.cards.editor.fields.device_type.heading",this.hass.language)}
            clearable=${!0}
            icons=${!0}
            value=${this.data.type}
            @value-changed=${e=>this.setType(e.target.value||rn.Other)}
          ></alarmo-select>
        </alarmo-settings-row>

        <alarmo-settings-row .narrow=${this.narrow} .large=${this.modesByArea(this.data.area).length>3}>
          <span slot="heading">
            ${Cs("panels.sensors.cards.editor.fields.modes.heading",this.hass.language)}
          </span>
          <span slot="description">
            ${Cs("panels.sensors.cards.editor.fields.modes.description",this.hass.language)}
          </span>

          <div>
            ${this.modesByArea(this.data.area).map(e=>Z`
                <ha-button
                  appearance="${this.data.modes.includes(e)||this.data.always_on?"filled":"plain"}"
                  variant="${this.data.modes.includes(e)||this.data.always_on?"brand":"neutral"}"
                  @click=${()=>{this.setMode(e);}}
                  ?disabled=${this.data.always_on}
                >
                  <ha-svg-icon slot="start" .path=${an[Object.entries(cn).find(([,t])=>t==e)[0]]}></ha-svg-icon>
                  ${Cs(`common.modes_short.${e}`,this.hass.language)}
                </ha-button>
              `)}
          </div>
        </alarmo-settings-row>

        <alarmo-settings-row .narrow=${this.narrow}>
          <span slot="heading">
            ${Cs("panels.sensors.cards.editor.fields.group.heading",this.hass.language)}
          </span>
          <span slot="description">
            ${Cs("panels.sensors.cards.editor.fields.group.description",this.hass.language)}
          </span>

          <div style="padding: 8px 0px; max-width: 250px">
            ${Object.keys(this.sensorGroups).length?Z`
                  <alarmo-select
                    .hass=${this.hass}
                    .clearable=${!0}
                    .items=${this.getSensorGroups()}
                    value=${this.data.group}
                    label="${Cs("panels.sensors.cards.editor.fields.group.heading",this.hass.language)}"
                    @value-changed=${e=>{this.data=Object.assign(Object.assign({},this.data),{group:e.detail.value});}}
                  ></alarmo-select>
                `:""}
            <ha-button appearance="filled" @click=${this.manageGroupsClick} style="margin-top: 4px">
              ${Cs("panels.sensors.cards.editor.actions.setup_groups",this.hass.language)}
              <ha-icon slot="end" icon="mdi:open-in-new"></ha-icon>
            </ha-button>
          </div>
        </alarmo-settings-row>

        <alarmo-collapsible-section
          .narrow=${this.narrow}
          header=${Cs("panels.sensors.cards.editor.actions.toggle_advanced",this.hass.language)}
        >
          ${!this.data.type||[rn.Environmental,rn.Tamper,rn.Other].includes(this.data.type)?Z`
                <alarmo-settings-row .narrow=${this.narrow}>
                  <span slot="heading">
                    ${Cs("panels.sensors.cards.editor.fields.always_on.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${Cs("panels.sensors.cards.editor.fields.always_on.description",this.hass.language)}
                  </span>

                  <ha-switch
                    ?checked=${this.data.always_on}
                    @change=${e=>this._SetData({always_on:e.target.checked})}
                  ></ha-switch>
                </alarmo-settings-row>
              `:""}
          ${!this.data.type||[rn.Window,rn.Door,rn.Motion,rn.Other].includes(this.data.type)?Z`
                <alarmo-settings-row .narrow=${this.narrow}>
                  <span slot="heading">
                    ${Cs("panels.sensors.cards.editor.fields.use_exit_delay.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${Cs("panels.sensors.cards.editor.fields.use_exit_delay.description",this.hass.language)}
                  </span>

                  <ha-switch
                    ?checked=${this.data.use_exit_delay}
                    ?disabled=${this.data.always_on}
                    @change=${e=>this._SetData({use_exit_delay:e.target.checked})}
                  ></ha-switch>
                </alarmo-settings-row>

                ${this.data.type==rn.Motion&&this.data.use_exit_delay?Z`
                      <alarmo-settings-row .narrow=${this.narrow} nested>
                        <span slot="heading">
                          ${Cs("panels.sensors.cards.editor.fields.allow_open.heading",this.hass.language)}
                        </span>
                        <span slot="description">
                          ${Cs("panels.sensors.cards.editor.fields.allow_open.description",this.hass.language)}
                        </span>

                        <ha-switch
                          ?checked=${this.data.allow_open}
                          ?disabled=${this.data.always_on||this.data.arm_on_close}
                          @change=${e=>this._SetData({allow_open:e.target.checked})}
                        ></ha-switch>
                      </alarmo-settings-row>
                    `:""}
              `:""}
          ${!this.data.type||[rn.Window,rn.Door,rn.Motion,rn.Other].includes(this.data.type)?Z`
                <alarmo-settings-row .narrow=${this.narrow}>
                  <span slot="heading">
                    ${Cs("panels.sensors.cards.editor.fields.use_entry_delay.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${Cs("panels.sensors.cards.editor.fields.use_entry_delay.description",this.hass.language)}
                  </span>

                  <ha-switch
                    ?checked=${this.data.use_entry_delay}
                    ?disabled=${this.data.always_on}
                    @change=${e=>this._SetData({use_entry_delay:e.target.checked})}
                  ></ha-switch>
                </alarmo-settings-row>
              `:""}


          ${this.data.type&&![rn.Window,rn.Door,rn.Motion,rn.Other].includes(this.data.type)||!this.data.use_entry_delay?"":Z`
                <alarmo-settings-row .narrow=${this.narrow} nested>
                  <span slot="heading">
                    ${Cs("panels.sensors.cards.editor.fields.entry_delay.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${Cs("panels.sensors.cards.editor.fields.entry_delay.description",this.hass.language)}
                  </span>

                  <alarmo-duration-picker
                    .hass=${this.hass}
                    max="900"
                    placeholder="-"
                    ?disabled=${!_n(this.data.entry_delay)}
                    value=${this.data.entry_delay}
                    @value-changed=${e=>this._SetData({entry_delay:e.detail.value})}
                  ></alarmo-duration-picker>
                </alarmo-settings-row>
              `}

          ${!this.data.type||[rn.Window,rn.Door,rn.Motion,rn.Other].includes(this.data.type)?Z`
                <alarmo-settings-row .narrow=${this.narrow}>
                  <span slot="heading">
                    ${Cs("panels.sensors.cards.editor.fields.delay_on.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${Cs("panels.sensors.cards.editor.fields.delay_on.description",this.hass.language)}
                  </span>

                  <alarmo-duration-picker
                    .hass=${this.hass}
                    max="300"
                    step="5"
                    placeholder="-"
                    ?disabled=${!_n(this.data.delay_on)}
                    value=${this.data.delay_on}
                    @value-changed=${e=>this._SetData({delay_on:e.detail.value})}
                  ></alarmo-duration-picker>
                </alarmo-settings-row>
              `:""}

          ${!this.data.type||[rn.Door,rn.Other].includes(this.data.type)?Z`
                <alarmo-settings-row .narrow=${this.narrow}>
                  <span slot="heading">
                    ${Cs("panels.sensors.cards.editor.fields.arm_on_close.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${Cs("panels.sensors.cards.editor.fields.arm_on_close.description",this.hass.language)}
                  </span>

                  <ha-switch
                    ?checked=${this.data.arm_on_close}
                    ?disabled=${this.data.always_on}
                    @change=${e=>this._SetData({arm_on_close:e.target.checked})}
                  ></ha-switch>
                </alarmo-settings-row>
              `:""}
          ${!this.data.type||[rn.Window,rn.Door,rn.Other].includes(this.data.type)?Z`
                <alarmo-settings-row .narrow=${this.narrow}>
                  <span slot="heading">
                    ${Cs("panels.sensors.cards.editor.fields.auto_bypass.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${Cs("panels.sensors.cards.editor.fields.auto_bypass.description",this.hass.language)}
                  </span>

                  <ha-switch
                    ?checked=${this.data.auto_bypass}
                    ?disabled=${this.data.always_on}
                    @change=${e=>this._SetData({auto_bypass:e.target.checked})}
                  ></ha-switch>
                </alarmo-settings-row>

                ${this.data.auto_bypass?Z`
                      <alarmo-settings-row .narrow=${this.narrow} .large=${this.modesByArea(this.data.area).length>2} nested>
                        <span slot="heading">
                          ${Cs("panels.sensors.cards.editor.fields.auto_bypass.modes",this.hass.language)}
                        </span>
                        <div>
                          ${this.modesByArea(this.data.area).map(e=>Z`
                              <ha-button
                                appearance="${this.data.auto_bypass_modes.includes(e)&&this.data.modes.includes(e)?"filled":"plain"}"
                                variant="${this.data.auto_bypass_modes.includes(e)&&this.data.modes.includes(e)?"brand":"neutral"}"
                                ?disabled=${!this.data.modes.includes(e)}
                                @click=${()=>{this.setBypassMode(e);}}
                              >
                                <ha-svg-icon
                                  slot="start"
                                  .path=${an[Object.entries(cn).find(([,t])=>t==e)[0]]}
                                ></ha-svg-icon>
                                ${Cs(`common.modes_short.${e}`,this.hass.language)}
                              </ha-button>
                            `)}
                        </div>
                      </alarmo-settings-row>
                    `:""}
              `:""}

        ${!this.data.type||[rn.Window,rn.Door,rn.Other].includes(this.data.type)?Z`
              <alarmo-settings-row .narrow=${this.narrow}>
                <span slot="heading">
                  ${Cs("panels.sensors.cards.editor.fields.allow_open.heading",this.hass.language)}
                </span>
                <span slot="description">
                  ${Cs("panels.sensors.cards.editor.fields.allow_open.description",this.hass.language)}
                </span>

                <ha-switch
                  ?checked=${this.data.allow_open}
                  ?disabled=${this.data.always_on||this.data.arm_on_close}
                  @change=${e=>this._SetData({allow_open:e.target.checked})}
                ></ha-switch>
              </alarmo-settings-row>
            `:""}

          <alarmo-settings-row .narrow=${this.narrow}>
            <span slot="heading">
              ${Cs("panels.sensors.cards.editor.fields.trigger_unavailable.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${Cs("panels.sensors.cards.editor.fields.trigger_unavailable.description",this.hass.language)}
            </span>

            <ha-switch
              ?checked=${this.data.trigger_unavailable}
              @change=${e=>this._SetData({trigger_unavailable:e.target.checked})}
            ></ha-switch>
          </alarmo-settings-row>
        </alarmo-collapsible-section>

        <div class="card-actions">
          <ha-button appearance="plain" @click=${this.saveClick}>
            ${this.hass.localize("ui.common.save")}
          </ha-button>

          <ha-button appearance="plain" variant="danger" @click=${this.deleteClick}>
            ${Cs("panels.sensors.cards.editor.actions.remove",this.hass.language)}
          </ha-button>
        </div>
      </ha-card>
    `;var t;}modesByArea(e){const t=Object.keys(this.areas).reduce((e,t)=>Object.assign(e,{[t]:Object.entries(this.areas[t].modes).filter(([,e])=>e.enabled).map(([e])=>e)}),{});return e?t[e]:Object.values(t).reduce((e,t)=>e.filter(e=>t.includes(e)));}_SetData(e){if(this.data)for(const[t,a]of Object.entries(e))switch(t){case"always_on":this.data=Object.assign(Object.assign({},this.data),{always_on:1==a}),a&&(this.data=Object.assign(Object.assign({},this.data),{arm_on_close:!1,use_exit_delay:!1,use_entry_delay:!1,allow_open:!1,auto_bypass:!1}));break;case"use_entry_delay":this.data=Object.assign(Object.assign({},this.data),{use_entry_delay:1==a});break;case"use_exit_delay":this.data=Object.assign(Object.assign({},this.data),{use_exit_delay:1==a}),this.data.type!==rn.Motion||a||(this.data=Object.assign(Object.assign({},this.data),{allow_open:!1}));break;case"arm_on_close":this.data=Object.assign(Object.assign({},this.data),{arm_on_close:1==a}),a&&(this.data=Object.assign(Object.assign({},this.data),{always_on:!1,allow_open:!1}));break;case"allow_open":this.data=Object.assign(Object.assign({},this.data),{allow_open:1==a}),a&&(this.data=Object.assign(Object.assign({},this.data),{arm_on_close:!1,always_on:!1}));break;case"auto_bypass":this.data=Object.assign(Object.assign({},this.data),{auto_bypass:1==a}),a&&(this.data=Object.assign(Object.assign({},this.data),{always_on:!1}));break;case"trigger_unavailable":this.data=Object.assign(Object.assign({},this.data),{trigger_unavailable:1==a});break;case"entry_delay":this.data=Object.assign(Object.assign({},this.data),{entry_delay:a});break;case"delay_on":this.data=Object.assign(Object.assign({},this.data),{delay_on:a});}}setMode(e){this.data&&(this.data=Object.assign(Object.assign({},this.data),{modes:this.data.modes.includes(e)?vn(this.data.modes,e):gn(this.data.modes.concat([e]))}));}setBypassMode(e){this.data&&(this.data=Object.assign(Object.assign({},this.data),{auto_bypass_modes:this.data.auto_bypass_modes.includes(e)?vn(this.data.auto_bypass_modes,e):gn(this.data.auto_bypass_modes.concat([e]))}));}setType(e){if(!this.data)return;const t=e!=rn.Other?wr(this.modesByArea(this.data.area))[e]:{};this.data=Object.assign(Object.assign(Object.assign({},this.data),{type:e}),t);}deleteClick(e){var t,a;(t=this.hass,a=this.item,t.callApi("POST","alarmo/sensors",{entity_id:a,remove:!0})).catch(t=>wn(t,e)).then(()=>{this.cancelClick();});}saveClick(e){if(!this.data)return;const t=[];this.data.new_entity_id&&this.data.new_entity_id==this.data.entity_id&&(this.data=bn(this.data,"new_entity_id")),this.data=Object.assign(Object.assign({},this.data),{auto_bypass_modes:this.data.auto_bypass_modes.filter(e=>this.data.modes.includes(e))}),this.data.area||t.push(Cs("panels.sensors.cards.editor.errors.no_area",this.hass.language)),this.data.modes.length||this.data.always_on||t.push(Cs("panels.sensors.cards.editor.errors.no_modes",this.hass.language)),this.data.auto_bypass&&!this.data.auto_bypass_modes.length&&t.push(Cs("panels.sensors.cards.editor.errors.no_auto_bypass_modes",this.hass.language)),t.length?kn(e,Z`
          ${Cs("panels.sensors.cards.editor.errors.description",this.hass.language)}
          <ul>
            ${t.map(e=>Z`
                  <li>${e}</li>
                `)}
          </ul>
        `):Se(this.hass,Object.assign({},this.data)).catch(t=>wn(t,e)).then(()=>{this.cancelClick();});}cancelClick(){xn(0,Mn("sensors"),!0);}manageGroupsClick(e){const t=e.target;pn(t,"show-dialog",{dialogTag:"manage-sensor-groups-dialog",dialogImport:()=>Promise.resolve().then(function(){return Tr;}),dialogParams:{}});}getSensorGroups(){return Object.keys(this.sensorGroups).map(e=>Object({value:e,name:this.sensorGroups[e].name}));}};Er.styles=Cn,s([ye()],Er.prototype,"hass",void 0),s([ye()],Er.prototype,"narrow",void 0),s([ye()],Er.prototype,"item",void 0),s([ye()],Er.prototype,"data",void 0),s([ye()],Er.prototype,"showBypassModes",void 0),s([be()],Er.prototype,"entityIdUnlocked",void 0),Er=s([ue("sensor-editor-card")],Er);const Mr=e=>Object.keys(e.modes).filter(t=>e.modes[t].enabled),Lr=e=>{let t=[];return Object.values(e).forEach(e=>{t=[...t,...Mr(e)];}),t=gn(t),t.sort((e,t)=>{const a=Object.values(cn),i=a.findIndex(t=>t==e),s=a.findIndex(e=>e==t);return i-s;}),t;},Nr="no_area";let Hr=class extends Le(pe){hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"alarmo_config_updated"})];}async _fetchData(){this.hass&&(this.areas=await Ee(this.hass),this.sensors=await $e(this.hass));}async firstUpdated(){this.path&&2==this.path.length&&"filter"==this.path[0]&&(this.selectedArea=this.path[1]);}shouldUpdate(e){const t=e.get("hass");return!t||1!=e.size||!this.sensors||Object.keys(this.sensors).some(e=>t.states[e]!==this.hass.states[e]);}render(){return this.hass&&this.areas&&this.sensors?Z`
      <ha-card>${Qn(Cs("panels.sensors.title",this.hass.language),"legacy")}
        <div class="card-content">
          ${Cs("panels.sensors.cards.sensors.description",this.hass.language)}
        </div>

        <alarmo-table
          .hass=${this.hass}
          ?selectable=${!0}
          .columns=${this.tableColumns()}
          .data=${this.getTableData()}
          .filters=${this.getTableFilterOptions()}
          @row-click=${e=>xn(0,Mn("sensors",{params:{edit:e.detail.id}}),!0)}
        >
          ${Cs("panels.sensors.cards.sensors.table.no_items",this.hass.language)}
        </alarmo-table>
      </ha-card>
    `:Z``;}tableColumns(){const e=(...e)=>e.map(e=>e.replace(".","_")).join("_");return{icon:{width:"40px",renderer:t=>{const a=this.hass.states[t.entity_id],i=Object.keys(rn).find(e=>rn[e]==t.type),s=a?"on"===a.state?dn[i]:on[i]:"M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z";return t.area==Nr?Z`
              <ha-icon icon="mdi:alert" style="color: var(--error-color)" id="${e(t.entity_id,"icon")}"></ha-icon>
              <ha-tooltip for="${e(t.entity_id,"icon")}">${Cs("panels.sensors.cards.sensors.table.no_area_warning",this.hass.language)}</ha-tooltip>
            `:Z`
              <ha-svg-icon .path=${s} class="${t.enabled?"":"disabled"}" id="${e(t.entity_id,"icon")}"></ha-svg-icon>
              <ha-tooltip for="${e(t.entity_id,"icon")}">${a?Cs(`panels.sensors.cards.editor.fields.device_type.choose.${t.type}.name`,this.hass.language):this.hass.localize("state_badge.default.entity_not_found")}</ha-tooltip>
            `;}},name:{title:this.hass.localize("ui.components.entity.entity-picker.entity"),width:"60%",grow:!0,text:!0,renderer:t=>Z`
          <span class="${t.enabled?"":"disabled"}" id="${e(t.entity_id,"name")}">
            ${t.name}
          </span>
          ${t.area==Nr?Z`<ha-tooltip for="${e(t.entity_id,"name")}">${Cs("panels.sensors.cards.sensors.table.no_area_warning",this.hass.language)}</ha-tooltip>`:Y}
          <span class="secondary ${t.enabled?"":"disabled"}" id="${e(t.entity_id,"name","secondary")}">
            ${t.entity_id}
          </span>
          ${t.area==Nr?Z`<ha-tooltip for="${e(t.entity_id,"name","secondary")}">${Cs("panels.sensors.cards.sensors.table.no_area_warning",this.hass.language)}</ha-tooltip>`:Y}
        `},modes:{title:Cs("panels.sensors.cards.sensors.table.arm_modes",this.hass.language),width:"25%",hide:this.narrow,text:!0,renderer:t=>Z`
          <span class="${t.enabled?"":"disabled"}" id="${e(t.entity_id,"modes")}">
            ${t.always_on?Cs("panels.sensors.cards.sensors.table.always_on",this.hass.language):t.modes.length?t.modes.map(e=>Cs(`common.modes_short.${e}`,this.hass.language)).join(", "):this.hass.localize("state_attributes.climate.preset_mode.none")}
          </span>
          ${t.area==Nr?Z`<ha-tooltip for="${e(t.entity_id,"modes")}">${Cs("panels.sensors.cards.sensors.table.no_area_warning",this.hass.language)}</ha-tooltip>`:Y}
        `},enabled:{title:Cs("common.enabled",this.hass.language),width:"68px",align:"center",renderer:e=>Z`
          <ha-switch
            @click=${e=>e.stopPropagation()}
            ?checked=${e.enabled}
            @change=${t=>this.toggleEnabled(t,e.entity_id)}
          ></ha-switch>
        `}};}getTableData(){const e=Object.keys(this.sensors).map(e=>{const t=this.hass.states[e],a=this.sensors[e],i=a.area?Mr(this.areas[a.area]):Lr(this.areas),s=Object.assign(Object.assign({},a),{id:e,name:un(t),modes:a.always_on?i:a.modes.filter(e=>i.includes(e)),warning:!a.area,area:a.area||Nr});return s;});return e.sort(An),e;}toggleEnabled(e,t){const a=e.target.checked;Se(this.hass,{entity_id:t,enabled:a}).catch(t=>wn(t,e)).then();}removeCustomName(e){const t={entity_id:e,name:""};Se(this.hass,t);}getTableFilterOptions(){let e=Object.values(this.areas).map(e=>Object({value:e.area_id,name:e.name,badge:t=>t.filter(t=>t.area==e.area_id).length})).sort(An);Object.values(this.sensors).filter(e=>!e.area).length&&(e=[{value:Nr,name:this.hass.localize("state_attributes.climate.preset_mode.none"),badge:e=>e.filter(e=>e.area==Nr).length},...e]);const t=Lr(this.areas).map(e=>Object({value:e,name:Cs(`common.modes_short.${e}`,this.hass.language),badge:t=>t.filter(t=>t.modes.includes(e)).length}));return{area:{name:Cs("components.table.filter.item",this.hass.language,"name",Cs("panels.actions.cards.new_action.fields.area.heading",this.hass.language)),items:e,value:this.selectedArea?[this.selectedArea]:[]},modes:{name:Cs("components.table.filter.item",this.hass.language,"name",Cs("panels.actions.cards.new_action.fields.mode.heading",this.hass.language)),items:t,value:this.selectedMode?[this.selectedMode]:[]}};}};Hr.styles=Cn,s([ye()],Hr.prototype,"hass",void 0),s([ye()],Hr.prototype,"narrow",void 0),s([ye()],Hr.prototype,"areas",void 0),s([ye()],Hr.prototype,"sensors",void 0),s([ye()],Hr.prototype,"selectedArea",void 0),s([ye()],Hr.prototype,"selectedMode",void 0),s([ye()],Hr.prototype,"path",void 0),Hr=s([ue("sensors-overview-card")],Hr);let Dr=class extends Le(pe){constructor(){super(...arguments),this.addSelection=[],this.areas={},this.sensors={};}hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"alarmo_config_updated"})];}async _fetchData(){this.hass&&(this.areas=await Ee(this.hass));}async firstUpdated(){this.areas=await Ee(this.hass),this.sensors=await $e(this.hass);}render(){const e={checkbox:{width:"48px",renderer:e=>Z`
          <ha-checkbox
            @change=${t=>this.toggleSelect(t,e.id)}
            ?checked=${this.addSelection.includes(e.id)}
          ></ha-checkbox>
        `},icon:{width:"40px",renderer:e=>Z`
          <state-badge .hass=${this.hass} .stateObj=${this.hass.states[e.id]}></state-badge>
        `},name:{title:this.hass.localize("ui.components.entity.entity-picker.entity"),width:"40%",grow:!0,text:!0,renderer:e=>Z`
          ${mn(e.name)}
          <span class="secondary">${e.id}</span>
        `},type:{title:Cs("panels.sensors.cards.add_sensors.table.type",this.hass.language),width:"40%",hide:this.narrow,text:!0,renderer:e=>e.type?Cs(`panels.sensors.cards.editor.fields.device_type.choose.${e.type}.name`,this.hass.language):this.hass.localize("state.default.unknown")}},t=zr(this.hass,Object.keys(this.sensors),!0).map(e=>Object.assign(Object.assign({},e),{type:kr(this.hass.states[e.id]),isSupportedType:void 0!==kr(this.hass.states[e.id])?"true":"false"}));return Z`
      <ha-card>${Qn(Cs("panels.sensors.cards.add_sensors.title",this.hass.language),"picker")}
        <div class="card-content">
          ${Cs("panels.sensors.cards.add_sensors.description",this.hass.language)}
        </div>

        <alarmo-table
          .hass=${this.hass}
          .columns=${e}
          .data=${t}
          .filters=${this.getTableFilterOptions()}
        >
          ${Cs("panels.sensors.cards.add_sensors.no_items",this.hass.language)}
        </alarmo-table>

        <div class="card-actions">
          <ha-button appearance="plain" @click=${this.addSelected} ?disabled=${0==this.addSelection.length}>
            ${Cs("panels.sensors.cards.add_sensors.actions.add_to_alarm",this.hass.language)}
          </ha-button>
        </div>
      </ha-card>
    `;}toggleSelect(e,t){const a=e.target.checked;this.addSelection=a&&!this.addSelection.includes(t)?[...this.addSelection,t]:a?this.addSelection:this.addSelection.filter(e=>e!=t);}addSelected(e){if(!this.hass)return;const t=Object.values(this.areas).map(e=>Object.entries(e.modes).filter(([,e])=>e.enabled).map(([e])=>e)).reduce((e,t)=>e.filter(e=>t.includes(e))),a=this.addSelection.map(e=>$r(this.hass.states[e],t)).map(e=>1==Object.keys(this.areas).length?Object.assign(e,{area:Object.keys(this.areas)[0]}):e).filter(e=>e);a.forEach(t=>{Se(this.hass,t).catch(t=>wn(t,e)).then();}),this.addSelection=[];}getTableFilterOptions(){return{isSupportedType:{name:Cs("panels.sensors.cards.add_sensors.actions.filter_supported",this.hass.language),items:[{value:"true",name:"true"}],value:["true"],binary:!0}};}};Dr.styles=Cn,s([ye()],Dr.prototype,"hass",void 0),s([ye()],Dr.prototype,"narrow",void 0),s([ye()],Dr.prototype,"addSelection",void 0),s([ye()],Dr.prototype,"areas",void 0),s([ye()],Dr.prototype,"sensors",void 0),Dr=s([ue("add-sensors-card")],Dr);let Pr=class extends pe{firstUpdated(){(async()=>{await fe();})();}render(){var e,t;if(!this.hass)return Z``;if(this.path.params.edit)return Z`
        <sensor-editor-card
          .hass=${this.hass}
          .narrow=${this.narrow}
          .item=${this.path.params.edit}
        ></sensor-editor-card>
      `;{const a=null===(e=this.path.filter)||void 0===e?void 0:e.area,i=null===(t=this.path.filter)||void 0===t?void 0:t.mode;return Z`
        <sensors-overview-card
          .hass=${this.hass}
          .narrow=${this.narrow}
          .selectedArea=${a}
          .selectedMode=${i}
        ></sensors-overview-card>
        <add-sensors-card .hass=${this.hass} .narrow=${this.narrow}></add-sensors-card>
      `;}}};s([ye()],Pr.prototype,"hass",void 0),s([ye()],Pr.prototype,"narrow",void 0),s([ye()],Pr.prototype,"path",void 0),Pr=s([ue("alarm-view-sensors")],Pr);const qr=["manual","automation","schedule","presence_away","presence_home","lock","panel_keypad","timer"],Br={manual:"Manual (dashboard / you)",automation:"Automations (other)",schedule:"Schedule",presence_away:"Presence: everyone left",presence_home:"Presence: someone home",lock:"Lock keypad",panel_keypad:"Alarm panel keypad",timer:"House Mode timers"},Ir=["armed_away","armed_home","armed_night","armed_vacation","armed_custom_bypass","disarmed"],Vr=e=>e.callWS({type:"alarmo/ext/house/get"}),Rr=e=>e.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,32)||"mode",Ur=(e,t)=>{let a=Rr(e),i=2;for(;t.some(e=>e.id===a);)a=`${Rr(e).slice(0,29)}_${i++}`;return{id:a,name:e,icon:"mdi:home",targets:{},enter_sources:[...qr],leave_sources:[...qr],delay_sources:{},readiness:{entities:[],labels:[],action:"warn"},on_failure:"undo",timers:[]};},Gr={in_sync:"Slot = User Code",different:"Slot ≠ User Code",empty:"Slot Empty",unknown:"Not readable",user_disabled:"User disabled, code still in slot",no_user:"User removed"},Fr={in_sync:"var(--success-color, #43a047)",different:"var(--warning-color, #ffa600)",empty:"var(--warning-color, #ffa600)",unknown:"var(--secondary-text-color)",user_disabled:"var(--error-color, #f44336)",no_user:"var(--error-color, #f44336)"},Kr={code_slots:"Code slots (User Code)",user_credential:"Lock users (User Credential)",unknown:"Codes not readable"},Zr=e=>e.callWS({type:"alarmo/ext/locks/get"}),Wr=(e,t)=>e.callWS({type:"alarmo/ext/locks/read",entity_id:t}),Yr=(e,t,a,i)=>e.callWS({type:"alarmo/ext/locks/link",entity_id:t,slot:a,user_id:i}),Qr=(e,t,a=!1)=>e.callWS({type:"alarmo/ext/locks/clear",user_id:t,unlink:a}),Jr=(e,t)=>e.callWS({type:"alarmo/ext/locks/user",user_id:t}),Xr=e=>!e||!e.house_mode&&!Object.keys(e.targets||{}).length,eo=e=>e.filter(e=>e.in_use&&e.readable&&!e.user_id),to=(e,t)=>{if(!e||Xr(t))return[];if(!e.enabled)return["The user is disabled: nothing will happen."];const a=[];return Object.keys(t.targets).forEach(i=>{const s=t.targets[i];e.area_limit.length&&!e.area_limit.includes(i)?a.push("Partition target: partition not allowed for this user."):"disarmed"!==s||e.can_disarm?"disarmed"===s||e.can_arm||a.push("Partition target: the user may not arm (Can arm is off)."):a.push("Partition target: the user may not disarm (Can disarm is off).");}),a.filter((e,t)=>a.indexOf(e)===t);},ao=(e,t,a)=>e.callWS(Object.assign({type:"alarmo/ext/locks/sync_user",user_id:t},a?{code:a}:{}));let io=class extends pe{constructor(){super(...arguments),this.entityId="",this.slotNo=0,this.userId="",this.code=null,this.msg="";}disconnectedCallback(){super.disconnectedCallback(),this.hide();}hide(){window.clearTimeout(this.timer),this.code=null,this.msg="";}async show(){if(this.code)return this.hide();this.msg="…";try{const a=this.userId?await(e=this.hass,t=this.userId,e.callWS({type:"alarmo/ext/user/reveal",user_id:t})):await((e,t,a)=>e.callWS({type:"alarmo/ext/locks/reveal",entity_id:t,slot:a}))(this.hass,this.entityId,this.slotNo);a.code?(this.code=a.code,this.msg="",this.timer=window.setTimeout(()=>this.hide(),3e4)):this.msg=this.userId?"only shown when a linked lock slot holds it":"not readable";}catch(e){this.msg=Nn(e);}var e,t;}render(){return Z`<button
        title=${this.code?"Hide the code":"Show the code (30 s)"}
        aria-label=${this.code?"Hide code":this.userId?"Show the user code":`Show code of slot ${this.slotNo}`}
        @click=${this.show}
      ><ha-icon icon=${this.code?"mdi:eye-off-outline":"mdi:eye-outline"}></ha-icon></button
      ><span class=${this.code?"code":"msg"}>${this.code?this.code:this.msg||"••••"}</span>`;}};io.styles=h`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
    }
    button {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      color: var(--secondary-text-color);
      --mdc-icon-size: 18px;
    }
    .code {
      font-family: var(--code-font-family, monospace);
      font-weight: 700;
      letter-spacing: 0.1em;
    }
    .msg {
      color: var(--secondary-text-color);
      font-size: 12px;
    }
  `,s([ye({attribute:!1})],io.prototype,"hass",void 0),s([ye()],io.prototype,"entityId",void 0),s([ye({type:Number})],io.prototype,"slotNo",void 0),s([ye()],io.prototype,"userId",void 0),s([be()],io.prototype,"code",void 0),s([be()],io.prototype,"msg",void 0),io=s([ue("alarmo-ext-reveal-code")],io);const so={armed_away:"Away",armed_home:"Home (Stay)",armed_night:"Night",armed_vacation:"Vacation",armed_custom_bypass:"Custom",disarmed:"Disarm"};let no=class extends pe{constructor(){super(...arguments),this.modes=[],this.houseEnabled=!1,this.partitions=[],this.label="",this.disabled=!1;}emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e}}));}render(){const e=this.action||{house_mode:null,targets:{}};return Z`
      <fieldset ?disabled=${this.disabled}>
        <legend>${this.label}</legend>
        <label
          >House Mode
          <select
            aria-label=${`${this.label}: House Mode`}
            @change=${t=>this.emit(Object.assign(Object.assign({},e),{house_mode:t.target.value||null}))}
          >
            <option value="" ?selected=${!e.house_mode}>leave unchanged</option>
            ${this.modes.map(t=>Z`<option value=${t.id} ?selected=${e.house_mode===t.id}>${t.name}</option>`)}
          </select>
        </label>
        ${e.house_mode&&!this.houseEnabled?Z`<span class="warn">House Modes are off, so this part does nothing.</span>`:Y}
        ${this.partitions.map(t=>Z`<label
            >${t.name}
            <select
              aria-label=${`${this.label}: ${t.name}`}
              @change=${a=>this.emit(((e,t,a)=>{const i=Object.assign({},e&&e.targets||{});return a?i[t]=a:delete i[t],{house_mode:e&&e.house_mode||null,targets:i};})(e,t.key,a.target.value))}
            >
              <option value="" ?selected=${!e.targets[t.key]}>${e.house_mode?"as the House Mode sets it":"leave unchanged"}</option>
              ${Ir.map(a=>Z`<option value=${a} ?selected=${e.targets[t.key]===a}>${so[a]}</option>`)}
            </select>
          </label>`)}
      </fieldset>
    `;}};no.styles=h`
    fieldset {
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 8px 12px 12px;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
    }
    legend {
      padding: 0 4px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--accent-color, var(--primary-color));
    }
    label {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }
    select {
      min-width: 160px;
      max-width: 100%;
    }
    .warn {
      color: var(--warning-color, #ffa600);
      font-size: 12px;
    }
  `,s([ye({attribute:!1})],no.prototype,"action",void 0),s([ye({attribute:!1})],no.prototype,"modes",void 0),s([ye({type:Boolean})],no.prototype,"houseEnabled",void 0),s([ye({attribute:!1})],no.prototype,"partitions",void 0),s([ye()],no.prototype,"label",void 0),s([ye({type:Boolean})],no.prototype,"disabled",void 0),no=s([ue("alarmo-ext-keypad-action")],no);let ro=class extends pe{constructor(){super(...arguments),this.pushOnSave=!0,this.embedded=!1,this.links=[],this.draft={},this.locks=[],this.reads={},this.taken={},this.users=[],this.pickLock="",this.pickSlot="",this.error="",this.loading=!0,this.writing=!1;}async writeNow(){if(this.userId){this.writing=!0,this.error="";try{const e=await ao(this.hass,this.userId);if(e.needs_code)this.error="No linked slot holds this user's code yet. Use Change code above; the new code is written to the slots on Save.";else{const t=e.results.filter(e=>"error"===e.result);t.length&&(this.error=t.map(e=>`${e.entity_id} slot ${e.slot}: ${e.error}`).join("; "));}await new Promise(e=>setTimeout(e,4e3)),await this.recheck();}catch(e){this.error=Nn(e);}finally{this.writing=!1;}}}async recheck(){if(!this.userId)return;const e=await Jr(this.hass,this.userId),t=this.links.filter(e=>e.pending);this.links=[...e.links.map(e=>({entity_id:e.entity_id,slot:e.slot,status:e.status})),...t.filter(e=>"add"===e.pending)].map(e=>t.some(t=>"remove"===t.pending&&t.entity_id===e.entity_id&&t.slot===e.slot)?Object.assign(Object.assign({},e),{pending:"remove"}):e),this.reads={},this.pickLock&&this.readSlots(this.pickLock);}get linkCount(){return this.links.filter(e=>"remove"!==e.pending).length;}firstUpdated(){this.load();}async load(){var e;this.loading=!0;try{const[t,a]=await Promise.all([Vr(this.hass),Zr(this.hass)]);if(this.house=t,this.locks=a.locks,this.users=a.users,this.taken={},a.settings.links.forEach(e=>this.taken[`${e.entity_id}:${e.slot}`]=e.user_id),this.pickLock||(this.pickLock=(null===(e=a.locks[0])||void 0===e?void 0:e.entity_id)||""),this.userId){const e=await Jr(this.hass,this.userId);this.links=e.links.map(e=>({entity_id:e.entity_id,slot:e.slot,status:e.status})),this.draft=JSON.parse(JSON.stringify(e.actions||{})),this.user=a.users.find(e=>e.user_id===this.userId);}this.pickLock&&this.readSlots(this.pickLock),this.error="";}catch(e){this.error=Nn(e);}finally{this.loading=!1;}}async readSlots(e){if(!this.reads[e])try{const t=await Wr(this.hass,e);this.reads=Object.assign(Object.assign({},this.reads),{[e]:t});}catch(e){}}userName(e){var t;return(null===(t=this.users.find(t=>t.user_id===e))||void 0===t?void 0:t.name)||"another user";}addLink(){const e=parseInt(this.pickSlot,10);if(!(this.pickLock&&e>0))return;const t=this.links.find(t=>t.entity_id===this.pickLock&&t.slot===e);this.links=t?this.links.map(e=>e===t?Object.assign(Object.assign({},e),{pending:void 0}):e):[...this.links,{entity_id:this.pickLock,slot:e,pending:"add"}],this.pickSlot="";}removeLink(e){this.links="add"===e.pending?this.links.filter(t=>t!==e):this.links.map(t=>t===e?Object.assign(Object.assign({},t),{pending:"remove"}):t);}async applyAfterSave(e,t){const a=[];try{for(const e of this.links.filter(e=>"remove"===e.pending))await Yr(this.hass,e.entity_id,e.slot,null);for(const t of this.links.filter(e=>"add"===e.pending))await Yr(this.hass,t.entity_id,t.slot,e);if(await(i=this.hass,s=e,n=this.draft,i.callWS({type:"alarmo/ext/locks/actions",user_id:s,unlock:n.unlock||null,lock:n.lock||null})),this.pushOnSave&&this.linkCount){const i=await ao(this.hass,e,t);i.needs_code&&a.push("no linked slot holds this user's code yet, so it could not be copied: use Change code (the new code is written on Save)"),i.results.filter(e=>"error"===e.result).forEach(e=>a.push(`${e.entity_id} slot ${e.slot}: ${e.error}`));}}catch(e){a.push(Nn(e));}var i,s,n;return a;}render(){var e,t,a;const i=((null===(e=this.house)||void 0===e?void 0:e.targets)||[]).filter(e=>"master"!==e.key),s=(null===(t=this.house)||void 0===t?void 0:t.settings.modes)||[],n=!!(null===(a=this.house)||void 0===a?void 0:a.settings.enabled),r=e=>{var t,a;return(null===(t=this.locks.find(t=>t.entity_id===e))||void 0===t?void 0:t.name)||(null===(a=this.hass.states[e])||void 0===a?void 0:a.attributes.friendly_name)||e;},o=this.reads[this.pickLock],d=(e,t)=>this.links.some(a=>a.entity_id===e&&a.slot===t&&"remove"!==a.pending),l=o?o.slots.filter(e=>!d(this.pickLock,e.slot)):[],c=this.permissions?Object.assign({user_id:this.userId||"",name:""},this.permissions):this.user,h=[...to(c,this.draft.unlock),...to(c,this.draft.lock)],p=Z`
        ${this.error?Z`<div class="notice error" style="margin:0 16px 12px">${this.error}</div>`:Y}
        ${this.embedded?Z`<h4 class="subhead">Locks</h4>`:Y}
        ${this.loading?Z`<div class="empty">Reading the locks…</div>`:Z`
              ${this.locks.length?Z`<div class="toolbar">
                    <label>Lock
                      <select @change=${e=>{this.pickLock=e.target.value,this.pickSlot="",this.readSlots(this.pickLock);}}>
                        ${this.locks.map(e=>Z`<option value=${e.entity_id} ?selected=${e.entity_id===this.pickLock}>${e.name}</option>`)}
                      </select>
                    </label>
                    <label>Slot
                      ${o&&o.slots.length?Z`<select @change=${e=>this.pickSlot=e.target.value}>
                            <option value="" ?selected=${!this.pickSlot}>choose…</option>
                            ${l.map(e=>{const t=this.taken[`${this.pickLock}:${e.slot}`],a=t&&t!==this.userId?`linked to ${this.userName(t)}`:e.in_use?"in use, no user":"empty";return Z`<option value=${e.slot} ?selected=${String(e.slot)===this.pickSlot}>${e.slot} (${a})</option>`;})}
                          </select>`:Z`<input type="number" min="1" max="250" style="width:80px" aria-label="Slot number" .value=${this.pickSlot}
                            @input=${e=>this.pickSlot=e.target.value} />`}
                    </label>
                    <ha-button appearance="plain" ?disabled=${!this.pickSlot} @click=${this.addLink}>
                      <ha-icon slot="start" icon="mdi:plus"></ha-icon>Add lock slot</ha-button>
                    <label><input type="checkbox" .checked=${this.pushOnSave} @change=${e=>this.pushOnSave=e.target.checked} />
                      On Save, write this user's code to the linked slots</label>
                    ${this.userId?Z`<ha-button appearance="plain" ?disabled=${this.writing} @click=${()=>this.recheck()}>
                          <ha-icon slot="start" icon="mdi:refresh"></ha-icon>Check the locks again</ha-button>`:Y}
                  </div>`:Z`<div class="empty">No Z-Wave JS locks found.</div>`}
              ${this.links.length?Z`<div class="table-wrap"><table>
                    <thead><tr><th class="icon"></th><th>Lock</th><th>Slot</th><th>Code</th><th></th></tr></thead>
                    <tbody>${this.links.map(e=>{const t=this.taken[`${e.entity_id}:${e.slot}`],a="add"===e.pending?"new":"remove"===e.pending?"removed":"unchanged";return Z`<tr class=${"remove"===e.pending?"status-removed":""}>
                        <td class="icon">${Xn(this.hass,e.entity_id,a)}</td>
                        <td>${r(e.entity_id)}<span class="secondary">${e.entity_id}</span></td>
                        <td>${e.slot}</td>
                        <td>${"add"===e.pending?Z`<span class="secondary" style="display:inline">linked on Save${t&&t!==this.userId?` (moves it from ${this.userName(t)})`:""}</span>`:"remove"===e.pending?Z`<span class="secondary" style="display:inline">unlinked on Save (the code stays on the lock)</span>`:Z`<span style=${`color:${Fr[e.status||"unknown"]}`}>${Gr[e.status||"unknown"]}</span>
                                <div><alarmo-ext-reveal-code .hass=${this.hass} .entityId=${e.entity_id} .slotNo=${e.slot}></alarmo-ext-reveal-code></div>
                                ${e.status&&"in_sync"!==e.status&&"no_user"!==e.status?Z`<button class="link" ?disabled=${this.writing} @click=${this.writeNow}>${this.writing?"Writing…":"Write the user code"}</button>`:Y}`}</td>
                        <td>${"remove"===e.pending?Z`<button class="link" @click=${()=>this.links=this.links.map(t=>t===e?Object.assign(Object.assign({},t),{pending:void 0}):t)}>undo</button>`:Z`<ha-icon-button .label=${"Unlink slot"} @click=${()=>this.removeLink(e)}><ha-icon icon="mdi:link-off"></ha-icon></ha-icon-button>`}</td>
                      </tr>`;})}</tbody>
                  </table></div>`:Y}
              <div class="action-stack">
                <alarmo-ext-keypad-action
                  .label=${"When this code unlocks a lock"}
                  .action=${this.draft.unlock}
                  .modes=${s}
                  .houseEnabled=${n}
                  .partitions=${i}
                  @value-changed=${e=>this.draft=Object.assign(Object.assign({},this.draft),{unlock:e.detail.value})}
                ></alarmo-ext-keypad-action>
                <alarmo-ext-keypad-action
                  .label=${"When this code locks a lock (keypad lock)"}
                  .action=${this.draft.lock}
                  .modes=${s}
                  .houseEnabled=${n}
                  .partitions=${i}
                  @value-changed=${e=>this.draft=Object.assign(Object.assign({},this.draft),{lock:e.detail.value})}
                ></alarmo-ext-keypad-action>
              </div>
              ${h.map(e=>{const t=(e=>e.includes("may not disarm")?{can_disarm:!0}:e.includes("may not arm")?{can_arm:!0}:null)(e);return Z`<div class="notice warn" style="margin:0 16px 8px">${e} That part will be skipped.
                  ${t&&this.permissions?Z`<button class="link" @click=${()=>this.dispatchEvent(new CustomEvent("grant",{detail:Object.assign(Object.assign({},this.permissions),t)}))}>
                        Allow it (${t.can_arm?"arm":"disarm"} in Alarmo)</button>`:Y}
                </div>`;})}
              <div class="secondary" style="padding:0 16px 12px">Saved with the user (Save below). Most locks only report the
                code for an unlock; Schlage's outside button locks without a code (set that per lock below the users).</div>
            `}
    `;return this.embedded?Z`<div class="sect">${p}</div>`:Z`<ha-card>${Qn("Lock codes and keypad actions","settings")}${p}</ha-card>`;}};ro.styles=[Kn,h`
      :host([embedded]) {
        padding: 0;
      }
      :host([embedded]) .sect {
        border-top: 1px solid var(--divider-color);
        padding: 4px 0 4px;
      }
      :host([embedded]) .subhead {
        margin: 10px 16px 4px;
      }
      :host([embedded]) .card-content.desc {
        display: none;
      }
      .action-stack {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 8px 16px 12px;
        max-width: 640px;
      }
    `],s([ye({attribute:!1})],ro.prototype,"hass",void 0),s([ye()],ro.prototype,"userId",void 0),s([ye({type:Boolean})],ro.prototype,"pushOnSave",void 0),s([ye({type:Boolean,reflect:!0})],ro.prototype,"embedded",void 0),s([ye({attribute:!1})],ro.prototype,"permissions",void 0),s([be()],ro.prototype,"links",void 0),s([be()],ro.prototype,"draft",void 0),s([be()],ro.prototype,"house",void 0),s([be()],ro.prototype,"user",void 0),s([be()],ro.prototype,"locks",void 0),s([be()],ro.prototype,"reads",void 0),s([be()],ro.prototype,"taken",void 0),s([be()],ro.prototype,"users",void 0),s([be()],ro.prototype,"pickLock",void 0),s([be()],ro.prototype,"pickSlot",void 0),s([be()],ro.prototype,"error",void 0),s([be()],ro.prototype,"loading",void 0),s([be()],ro.prototype,"writing",void 0),ro=s([ue("alarmo-ext-user-locks")],ro);const oo=[{id:"arm_disarm",label:"arm and disarm",hint:"a household member"},{id:"arm",label:"arm only",hint:"can lock up, but not turn the alarm off"},{id:"disarm",label:"disarm only",hint:"rarely needed"},{id:"none",label:"nothing (lock only)",hint:"the code works at the locks and for their keypad actions only"}];let lo=class extends pe{constructor(){super(...arguments),this.narrow=!1,this.data={enabled:!0,can_arm:!0,can_disarm:!0,is_override_code:!1,area_limit:[]},this.code="",this.repeatCode="",this.changeCode=!1,this.busy=!1,this.areas={},this.loaded=!1;}async firstUpdated(){if(this.users=await ze(this.hass),this.areas=await Ee(this.hass),this.item&&this.users[this.item]){const e=this.users[this.item];this.data=Object.assign(Object.assign({},e),{area_limit:(e.area_limit||[]).filter(e=>e in this.areas)}),delete this.data.code;}this.changeCode=!this.item,this.loaded=!0;}get areaOptions(){return Object.values(this.areas).map(e=>({value:e.area_id,name:e.name})).sort(An);}get lockCard(){var e;return null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("alarmo-ext-user-locks");}set(e){this.data=Object.assign(Object.assign({},this.data),e);}render(){var e;if(!this.loaded)return Z``;const t=(e=>e.can_arm&&e.can_disarm?"arm_disarm":e.can_arm?"arm":e.can_disarm?"disarm":"none")(this.data),a=this.areaOptions.length>=2,i=this.data.area_limit||[];return Z`
      <ha-card>
        <div class="card-header">
          <div class="name">${this.item?`Edit user '${(null===(e=this.users[this.item])||void 0===e?void 0:e.name)||""}'`:"New user"}</div>
          ${Yn("settings")}
          <ha-icon-button .path=${Ds} .label=${"Close"} @click=${this.cancelClick}></ha-icon-button>
        </div>

        <div class="sect">
          <h4 class="subhead">User</h4>
          <div class="field-row">
            <label for="name">Name</label>
            <input id="name" type="text" .value=${this.data.name||""} @input=${e=>this.set({name:e.target.value})} />
          </div>
          <div class="field-row">
            <label><input type="checkbox" .checked=${!1!==this.data.enabled} @change=${e=>this.set({enabled:e.target.checked})} />
              Enabled</label>
            <span class="secondary" style="display:inline">a disabled user's code works nowhere (Alarmo or the locks' keypad actions)</span>
          </div>
          ${this.changeCode?Z`<div class="field-row">
                  <label for="code">${this.item?"New code":"Code"}</label>
                  <input id="code" type="password" autocomplete="new-password" .value=${this.code} @input=${e=>this.code=e.target.value.trim()} />
                  <label for="code2">Repeat</label>
                  <input id="code2" type="password" autocomplete="new-password" .value=${this.repeatCode} @input=${e=>this.repeatCode=e.target.value.trim()} />
                  ${this.item?Z`<button class="link" @click=${()=>{this.changeCode=!1,this.code=this.repeatCode="";}}>keep the current code</button>`:Y}
                </div>
                <div class="secondary" style="padding:0 6px">At least 4 characters; digits only for lock keypads. Codes are stored only hashed.</div>`:Z`<div class="field-row">
                <span>Code</span>
                <alarmo-ext-reveal-code .hass=${this.hass} .userId=${this.item}></alarmo-ext-reveal-code>
                <ha-button appearance="plain" @click=${()=>this.changeCode=!0}>Change code</ha-button>
              </div>`}
          <div class="field-row">
            <label for="access">In Alarmo, this code can</label>
            <select id="access" @change=${e=>this.set((e=>({can_arm:"arm_disarm"===e||"arm"===e,can_disarm:"arm_disarm"===e||"disarm"===e}))(e.target.value))}>
              ${oo.map(e=>Z`<option value=${e.id} ?selected=${e.id===t}>${e.label}</option>`)}
            </select>
            <span class="secondary" style="display:inline">${oo.find(e=>e.id===t).hint}</span>
          </div>
          ${a&&"none"!==t?Z`<div class="field-row">
                <span>Partitions</span>
                ${this.areaOptions.map(e=>{const t=!i.length||i.includes(e.value);return Z`<label><input type="checkbox" .checked=${t} @change=${t=>this.toggleArea(e.value,t.target.checked)} />${e.name}</label>`;})}
              </div>`:Y}
          <div class="field-row">
            <label><input type="checkbox" .checked=${!!this.data.is_override_code} @change=${e=>this.set({is_override_code:e.target.checked})} />
              Override code</label>
            <span class="secondary" style="display:inline">arms even with open zones (force arm)</span>
          </div>
        </div>

        <alarmo-ext-user-locks
          embedded
          .hass=${this.hass}
          .userId=${this.item}
          .permissions=${{enabled:!1!==this.data.enabled,can_arm:!!this.data.can_arm,can_disarm:!!this.data.can_disarm,area_limit:i}}
          @grant=${e=>this.set(e.detail)}
        ></alarmo-ext-user-locks>

        <div class="card-actions">
          <ha-button ?disabled=${this.busy} @click=${this.saveClick}>${this.busy?"Saving…":"Save"}</ha-button>
          <ha-button appearance="plain" @click=${this.cancelClick}>Cancel</ha-button>
          <span style="flex:1"></span>
          ${this.item?Z`<ha-button appearance="plain" variant="danger" @click=${this.deleteClick}>Delete user</ha-button>`:Y}
        </div>
      </ha-card>
    `;}toggleArea(e,t){const a=this.areaOptions.map(e=>e.value);let i=this.data.area_limit&&this.data.area_limit.length?[...this.data.area_limit]:[...a];i=t?[...new Set([...i,e])]:i.filter(t=>t!==e),i.length&&this.set({area_limit:i.length===a.length?[]:i});}async deleteClick(e){if(!this.item)return;if(!confirm(`Delete ${this.data.name}?`))return;const t=this.lockCard;if(t&&t.linkCount&&confirm(`Also clear this user's code from ${t.linkCount} linked lock slot(s)? Cancel keeps the codes on the locks.`))try{await Qr(this.hass,this.item,!0);}catch(t){wn(t,e);}var a,i;(a=this.hass,i=this.item,a.callApi("POST","alarmo/users",{user_id:i,remove:!0})).catch(t=>wn(t,e)).then(()=>this.cancelClick());}async saveClick(e){var t,a;const i=this.data;if(!i.name||!i.name.trim())return kn(e,"Enter a name.");if(this.changeCode){if(this.code.length<4)return kn(e,"The code needs at least 4 characters.");if(this.code!==this.repeatCode)return kn(e,"The two codes are different.");}const s=!(!this.item||!this.users)&&!1!==(null===(t=this.users[this.item])||void 0===t?void 0:t.enabled),n={name:i.name.trim(),enabled:!1!==i.enabled,can_arm:!!i.can_arm,can_disarm:!!i.can_disarm,is_override_code:!!i.is_override_code,area_limit:i.area_limit||[]};this.busy=!0;try{let t=this.item;if(t){const e=await Oe(this.hass,Object.assign(Object.assign({},n),{user_id:t}));if(!e||!e.success)throw new Error(e&&e.error||"unknown error");this.changeCode&&(await(r=this.hass,o=t,d=this.code,r.callWS({type:"alarmo/ext/user/set_code",user_id:o,code:d})));}else{const e=await Oe(this.hass,Object.assign(Object.assign({},n),{code:this.code}));if(!e||!e.success)throw new Error(e&&e.error||"unknown error");const i=await ze(this.hass);t=null===(a=Object.values(i).find(e=>e.name===n.name))||void 0===a?void 0:a.user_id;}const i=this.lockCard;if(t&&i){const a=s&&!1===n.enabled;a&&i.linkCount&&confirm(`This user is now disabled. Also clear the code from ${i.linkCount} linked lock slot(s)?`)&&(await Qr(this.hass,t));const r=await i.applyAfterSave(t,!a&&this.changeCode?this.code:void 0);r.length&&kn(e,`Saved, but the locks were not all updated: ${r.join("; ")}`);}this.cancelClick();}catch(t){kn(e,Nn(t));}finally{this.busy=!1;}var r,o,d;}cancelClick(){xn(0,Mn("codes"),!0);}static get styles(){return h`
      ${Cn}
      ${Kn}
      :host {
        padding: 0;
      }
      .sect {
        padding: 4px 16px 8px;
        border-top: 1px solid var(--divider-color);
      }
      .sect .subhead {
        margin: 10px 0 4px;
      }
      .card-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      input[type='checkbox'] {
        margin-right: 6px;
      }
    `;}};s([ye({attribute:!1})],lo.prototype,"hass",void 0),s([ye({type:Boolean})],lo.prototype,"narrow",void 0),s([ye()],lo.prototype,"item",void 0),s([be()],lo.prototype,"data",void 0),s([be()],lo.prototype,"code",void 0),s([be()],lo.prototype,"repeatCode",void 0),s([be()],lo.prototype,"changeCode",void 0),s([be()],lo.prototype,"busy",void 0),s([be()],lo.prototype,"loaded",void 0),lo=s([ue("user-editor-card")],lo);let co=class extends pe{constructor(){super(...arguments),this.narrow=!1,this.locks=[],this.error="",this.busy=!1,this.users=[],this.reads={},this.names={},this.lockActionDraft={},this.openLocks={},this.legacy=[];}firstUpdated(){this.refresh(!0);}async refresh(e=!1){try{const[a,i,s]=await Promise.all([Vr(this.hass),(t=this.hass,t.callWS({type:"alarmo/ext/house/locks"})),Zr(this.hass)]);this.saved=a.settings,this.houseInfo=a,this.locks=i.locks,this.lockSettings=s.settings,this.users=s.users,e&&(this.lockActionDraft=Object.assign({},s.settings.lock_actions)),e&&i.locks.forEach(e=>this.read(e.entity_id)),this.legacy=(await(e=>e.callWS({type:"alarmo/ext/locks/legacy"}))(this.hass)).legacy,!e&&this.draft||(this.draft=(e=>JSON.parse(JSON.stringify(e)))(a.settings));}catch(e){this.error=Nn(e);}var t;}render(){return this.draft?Z`
      ${this.error?Z`<div class="notice error" style="white-space:pre-line;margin:0 0 12px">${this.error}</div>`:Y}
      ${this.renderCodes()}
    `:Z`<ha-card><div class="empty">${this.error||"Loading…"}</div></ha-card>`;}async migrate(){if(window.confirm(`Move ${this.legacy.length} old "code slot → House Mode" setting(s) to Alarmo Users? Each slot gets a lock-only user (or the user with the same code) whose unlock action is that House Mode. A backup is in Backup if you need it.`)){this.busy=!0;try{const t=await(e=this.hass,e.callWS({type:"alarmo/ext/locks/migrate"})),a=t.results.filter(e=>"moved"!==e.result);Pn(this,`${t.results.length-a.length} moved to users${a.length?`, ${a.length} failed`:""}.`),a.length&&(this.error=a.map(e=>`${e.lock_name} slot ${e.slot}: ${e.error}`).join("\n")),await this.refresh(!0);}catch(e){this.error=Nn(e);}finally{this.busy=!1;}var e;}}async read(e){this.reads=Object.assign(Object.assign({},this.reads),{[e]:"reading"});try{const t=await Wr(this.hass,e);this.reads=Object.assign(Object.assign({},this.reads),{[e]:t});}catch(t){this.reads=Object.assign(Object.assign({},this.reads),{[e]:Nn(t)});}}userName(e){const t=this.users.find(t=>t.user_id===e);return t?t.name:e?"removed user":"";}async link(e,t,a){try{this.lockSettings=(await Yr(this.hass,e,t,a)).settings,Pn(this,a?`Slot ${t} linked to ${this.userName(a)}.`:`Slot ${t} unlinked.`),await this.read(e);}catch(e){this.error=Nn(e);}}async doImport(e,t){const a=eo(t.slots);if(a.length){this.busy=!0;try{const t=await((e,t,a)=>e.callWS({type:"alarmo/ext/locks/import",entity_id:t,slots:a}))(this.hass,e,a.map(t=>({slot:t.slot,name:this.names[`${e}:${t.slot}`]||t.lock_name||void 0}))),i=t.results.filter(e=>"created"===e.result).length,s=t.results.filter(e=>"linked"===e.result).length,n=t.results.filter(e=>"error"===e.result);Pn(this,`${i} user(s) created, ${s} linked to existing users${n.length?`, ${n.length} failed`:""}.`),n.length&&(this.error=n.map(e=>`Slot ${e.slot}: ${e.error}`).join("\n")),await this.refresh(),await this.read(e);}catch(e){this.error=Nn(e);}finally{this.busy=!1;}}}async saveLockAct(e){try{this.lockSettings=(await((e,t,a)=>e.callWS({type:"alarmo/ext/locks/actions",entity_id:t,lock:a}))(this.hass,e,this.lockActionDraft[e]||null)).settings,Pn(this,"Keypad lock action saved.");}catch(e){this.error=Nn(e);}}renderCodes(){var e,t;const a=this.lockSettings,i=(null===(e=this.saved)||void 0===e?void 0:e.modes)||[],s=((null===(t=this.houseInfo)||void 0===t?void 0:t.targets)||[]).filter(e=>"master"!==e.key),n=e=>(i.find(t=>t.id===e)||{name:e}).name,r=e=>(s.find(t=>t.key===e)||{name:e}).name;return Z`
      <ha-card>${Qn("Keypads","settings")}
        <div class="card-content desc">
          <p>Each Z-Wave lock, with one row per code slot. A slot's code belongs to an Alarmo User; that user's keypad
            actions (a House Mode, Alarmo partition targets, or both) run when the code is used at the lock.</p>
          <ul>
            <li><strong>Import</strong> makes a <em>lock-only</em> user for each code that has no user yet: the code works at
              the lock and for its keypad actions, but cannot arm or disarm Alarmo until you allow it. A code that is
              already an Alarmo User's code is linked to that user instead.</li>
            <li><em>Code</em> compares the slot's code with the user's code (<em>Slot = User Code</em>). Alarmo stores codes only hashed. The eye
              shows a lock's code for 30 seconds, read from the lock right then; it is never stored.</li>
            <li>Click a user (above) to change its name, code, permissions, lock slots and keypad actions.</li>
          </ul>
        </div>
        ${this.legacy.length?Z`<div class="notice warn" style="margin:0 16px 12px">
              <strong>${this.legacy.length} old "code slot → House Mode" setting(s)</strong> (${this.legacy.map(e=>`${e.lock_name} slot ${e.slot}`).join(", ")})
              still work, but now belong on users.
              <div class="toolbar" style="padding:6px 0 0"><ha-button ?disabled=${this.busy} @click=${this.migrate}>Move them to users</ha-button></div>
            </div>`:Y}
        ${this.locks.length?Y:Z`<div class="empty">No Z-Wave JS locks found.</div>`}
        ${this.locks.map(e=>{var t,o,d;const l=this.reads[e.entity_id],c=l&&"object"==typeof l?l:void 0,h=c?eo(c.slots):[],p=this.lockActionDraft[e.entity_id],m=JSON.stringify(p||null)!==JSON.stringify(a&&a.lock_actions[e.entity_id]||null),u=a?a.links.filter(t=>t.entity_id===e.entity_id).length:0,g=`codes:${e.entity_id}`,v=null!==(t=this.openLocks[g])&&void 0!==t&&t;return Z`
            <details class="collapse" ?open=${v} @toggle=${e=>this.openLocks=Object.assign(Object.assign({},this.openLocks),{[g]:e.target.open})}>
            <summary>
              <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
              ${Xn(this.hass,e.entity_id)}
              <span class="collapse-title">${e.name}</span>
              ${u?Z`<span class="role">${u} linked</span>`:Y}
              ${h.length?Z`<span class="role" style="color:var(--warning-color,#ffa600);border-color:var(--warning-color,#ffa600)">${h.length} without user</span>`:Y}
              <span class="secondary" style="display:inline">${e.entity_id} · node ${null!==(o=e.node_id)&&void 0!==o?o:"unknown"}${c?` · ${Kr[c.api]||c.api}`:""}</span>
            </summary>
            <div class="collapse-body">
            <div class="toolbar" style="padding:4px 0 8px">
              <ha-button appearance="plain" ?disabled=${"reading"===l} @click=${()=>this.read(e.entity_id)}>
                <ha-icon slot="start" icon="mdi:refresh"></ha-icon>${"reading"===l?"Reading…":"Read the lock again"}</ha-button>
              <ha-button ?disabled=${!h.length||this.busy} @click=${()=>this.doImport(e.entity_id,c)}>
                <ha-icon slot="start" icon="mdi:account-multiple-plus"></ha-icon>Import ${h.length} code(s) as lock-only users</ha-button>
            </div>
            ${h.length?Z`<div class="notice warn" style="margin:0 0 8px">${h.length} code(s) on ${e.name} have no user: slot
                  ${h.map(e=>e.slot).join(", ")}. Type a name in the row if you like, then Import.</div>`:Y}
            ${"string"==typeof l&&"reading"!==l?Z`<div class="notice error" style="margin:0 16px 8px">${l}</div>`:Y}
            ${c&&!c.readable?Z`<div class="notice warn" style="margin:0 16px 8px">The codes could not be read from this lock. You can still link slots to users by
                  number; the code check then shows "not readable".</div>`:Y}
            ${c?Z`<div class="table-wrap"><table>
                  <thead><tr><th>Slot</th><th>On the lock</th><th>Alarmo User</th><th>Code</th><th>When this code is used</th></tr></thead>
                  <tbody>${c.slots.filter(e=>e.in_use||e.user_id).map(t=>{const i=`${e.entity_id}:${t.slot}`,s=t.user_id&&a?a.actions[t.user_id]:void 0;return Z`<tr>
                      <td>${t.slot}</td>
                      <td>${t.in_use?"in use":"empty"}${t.lock_name?Z`<span class="secondary">${t.lock_name}</span>`:Y}</td>
                      <td>
                        <select aria-label=${`Alarmo User for slot ${t.slot}`} @change=${a=>this.link(e.entity_id,t.slot,a.target.value||null)}>
                          <option value="" ?selected=${!t.user_id}>— not linked —</option>
                          ${this.users.map(e=>Z`<option value=${e.user_id} ?selected=${t.user_id===e.user_id}>${e.name}${e.enabled?"":" (disabled)"}</option>`)}
                        </select>
                        ${!t.user_id&&t.match_user_id?Z`<button class="link" @click=${()=>this.link(e.entity_id,t.slot,t.match_user_id)}>Same code as ${this.userName(t.match_user_id)} — link</button>`:Y}
                        ${!t.user_id&&!t.match_user_id&&t.readable&&t.in_use?Z`<input placeholder="Name for import" aria-label=${`Name for slot ${t.slot}`} style="width:140px" .value=${this.names[i]||t.lock_name}
                              @input=${e=>this.names=Object.assign(Object.assign({},this.names),{[i]:e.target.value})} />`:Y}
                      </td>
                      <td>${t.status?Z`<span style=${`color:${Fr[t.status]}`}>${Gr[t.status]}</span>`:Z`<span class="secondary" style="display:inline">—</span>`}
                        ${t.in_use&&t.readable?Z`<div><alarmo-ext-reveal-code .hass=${this.hass} .entityId=${e.entity_id} .slotNo=${t.slot}></alarmo-ext-reveal-code></div>`:Y}</td>
                      <td>${t.user_id?Z`${((e,t,a,i)=>{if(Xr(e))return"nothing";const s=[];return e.house_mode&&s.push(`House Mode ${t(e.house_mode)}`),Object.keys(e.targets).forEach(t=>s.push(`${a(t)}: ${i(e.targets[t])}`)),s.join(" · ");})(s&&s.unlock,n,r,e=>so[e]||e)}
                            <button class="link" @click=${()=>xn(0,Mn("codes",{params:{edit_user:t.user_id}}),!0)}>edit</button>`:Z`<span class="secondary" style="display:inline">nothing (no user)</span>`}</td>
                    </tr>`;})}</tbody>
                </table></div>`:"reading"===l?Z`<div class="empty">Reading the lock…</div>`:Y}
            <div style="padding:8px 0 4px;max-width:640px">
              <alarmo-ext-keypad-action
                .label=${"Keypad lock without a code (e.g. Schlage outside button)"}
                .action=${p}
                .modes=${i}
                .houseEnabled=${!!(null===(d=this.saved)||void 0===d?void 0:d.enabled)}
                .partitions=${s}
                @value-changed=${t=>this.lockActionDraft=Object.assign(Object.assign({},this.lockActionDraft),{[e.entity_id]:t.detail.value})}
              ></alarmo-ext-keypad-action>
              ${m?Z`<div class="toolbar" style="padding:8px 0 0"><ha-button @click=${()=>this.saveLockAct(e.entity_id)}>Save keypad lock action</ha-button></div>`:Y}
            </div>
            </div>
            </details>
          `;})}
      </ha-card>
    `;}};co.styles=Kn,s([ye({attribute:!1})],co.prototype,"hass",void 0),s([ye({type:Boolean})],co.prototype,"narrow",void 0),s([ye({attribute:!1})],co.prototype,"path",void 0),s([be()],co.prototype,"saved",void 0),s([be()],co.prototype,"draft",void 0),s([be()],co.prototype,"locks",void 0),s([be()],co.prototype,"error",void 0),s([be()],co.prototype,"busy",void 0),s([be()],co.prototype,"lockSettings",void 0),s([be()],co.prototype,"users",void 0),s([be()],co.prototype,"reads",void 0),s([be()],co.prototype,"names",void 0),s([be()],co.prototype,"lockActionDraft",void 0),s([be()],co.prototype,"houseInfo",void 0),s([be()],co.prototype,"openLocks",void 0),s([be()],co.prototype,"legacy",void 0),co=s([ue("alarm-view-connections")],co);let ho=class extends Le(pe){constructor(){super(...arguments),this.users={},this.lockLinks=[],this.lockActions={};}hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"alarmo_config_updated"})];}async _fetchData(){if(!this.hass)return;const e=await we(this.hass);this.data=yn(e,["code_arm_required","code_disarm_required","code_mode_change_required","code_format"]);const t=await ze(this.hass);try{const e=await Zr(this.hass);this.lockLinks=e.settings.links,this.lockActions=e.settings.actions;}catch(e){this.lockLinks=[];}this.users=t;}render(){if(!this.hass||!this.data)return Z``;{const e=this.data.code_arm_required||this.data.code_disarm_required||this.data.code_mode_change_required;return Z`
        <ha-card>${Qn(Cs("panels.codes.title",this.hass.language),"settings")}
          <div class="card-content">${Cs("panels.codes.cards.codes.description",this.hass.language)}</div>

          <alarmo-settings-row .narrow=${this.narrow}>
            <span slot="heading">
              ${Cs("panels.codes.cards.codes.fields.code_arm_required.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${Cs("panels.codes.cards.codes.fields.code_arm_required.description",this.hass.language)}
            </span>
            <ha-switch
              ?checked=${this.data.code_arm_required}
              @change=${e=>{this.saveData({code_arm_required:e.target.checked});}}
            ></ha-switch>
          </alarmo-settings-row>

          <alarmo-settings-row .narrow=${this.narrow}>
            <span slot="heading">
              ${Cs("panels.codes.cards.codes.fields.code_disarm_required.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${Cs("panels.codes.cards.codes.fields.code_disarm_required.description",this.hass.language)}
            </span>
            <ha-switch
              ?checked=${this.data.code_disarm_required}
              @change=${e=>{this.saveData({code_disarm_required:e.target.checked});}}
            ></ha-switch>
          </alarmo-settings-row>

          <alarmo-settings-row .narrow=${this.narrow}>
            <span slot="heading">
              ${Cs("panels.codes.cards.codes.fields.code_mode_change_required.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${Cs("panels.codes.cards.codes.fields.code_mode_change_required.description",this.hass.language)}
            </span>
            <ha-switch
              ?checked=${this.data.code_mode_change_required}
              @change=${e=>{this.saveData({code_mode_change_required:e.target.checked});}}
            ></ha-switch>
          </alarmo-settings-row>

          <alarmo-settings-row .narrow=${this.narrow}>
            <span slot="heading">
              ${Cs("panels.codes.cards.codes.fields.code_format.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${Cs("panels.codes.cards.codes.fields.code_format.description",this.hass.language)}
            </span>
            <ha-button
              appearance="${"number"==this.data.code_format?"filled":"plain"}"
              variant="${"number"==this.data.code_format?"brand":"neutral"}"
          : ''}"
              @click=${()=>{this.saveData({code_format:"number"});}}
              ?disabled=${!e}
            >
              ${Cs("panels.codes.cards.codes.fields.code_format.code_format_number",this.hass.language)}
            </ha-button>
            <ha-button
              appearance="${"text"==this.data.code_format?"filled":"plain"}"
              variant="${"text"==this.data.code_format?"brand":"neutral"}"
          : ''
        }"
              @click=${()=>{this.saveData({code_format:"text"});}}
              ?disabled=${!e}
            >
              ${Cs("panels.codes.cards.codes.fields.code_format.code_format_text",this.hass.language)}
            </ha-button>
          </alarmo-settings-row>
        </ha-card>

        ${this.usersPanel()}
        ${this.editing?Y:Z`<alarm-view-connections .hass=${this.hass} .narrow=${this.narrow} embedded></alarm-view-connections>`}
      `;}}get editing(){return"new_user"==this.path.subpage||!!this.path.params.edit_user;}renderEditor(){return"new_user"==this.path.subpage?Z`<user-editor-card .hass=${this.hass} .narrow=${this.narrow}></user-editor-card>`:Z`<user-editor-card .hass=${this.hass} .narrow=${this.narrow} item=${this.path.params.edit_user}></user-editor-card>`;}updated(){var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("user-editor-card");t&&!t.dataset.scrolled&&(t.dataset.scrolled="1",t.scrollIntoView({behavior:"smooth",block:"start"}));}usersPanel(){if(!this.hass)return Z``;const e=Object.values(this.users);e.sort(An);const t={icon:{width:"40px"},name:{title:this.hass.localize("ui.common.name"),width:"40%",grow:!0,text:!0},code_format:{title:Cs("panels.codes.cards.codes.fields.code_format.heading",this.hass.language),width:"120px",hide:this.narrow,text:!0},locks:{title:"Lock slots",width:"22%",hide:this.narrow,text:!0},keypad:{title:"At the lock",width:"28%",hide:this.narrow,text:!0},enabled:{title:Cs("common.enabled",this.hass.language),width:"68px",align:"center"}},a=e.map(e=>{const t={id:e.user_id,icon:Z`
          <ha-icon icon="mdi:account-outline" class="${e.enabled?"":"disabled"}"></ha-icon>
        `,name:Z`
          <span class="${e.enabled?"":"disabled"}">
            ${mn(e.name)}
          </span>
        `,code_format:Z`
          <span class="${e.enabled?"":"disabled"}">
          ${"number"==e.code_format?mn(Cs("panels.codes.cards.codes.fields.code_format.code_format_number",this.hass.language)):"text"==e.code_format?mn(Cs("panels.codes.cards.codes.fields.code_format.code_format_text",this.hass.language)):this.hass.localize("state.default.unknown")}
          </span>
        `,locks:Z`${this.lockLinks.filter(t=>t.user_id===e.user_id).map(e=>{var t;return`${(null===(t=this.hass.states[e.entity_id])||void 0===t?void 0:t.attributes.friendly_name)||e.entity_id} ${e.slot}`;}).join(", ")}`,keypad:Z`${(()=>{const t=this.lockActions[e.user_id]||{},a=!e.can_arm&&!e.can_disarm,i=e=>[e&&e.house_mode?`House Mode ${e.house_mode}`:"",e&&Object.keys(e.targets).length?`${Object.keys(e.targets).length} partition target(s)`:""].filter(Boolean).join(" + "),s=[Xr(t.unlock)?"":`unlock → ${i(t.unlock)}`,Xr(t.lock)?"":`lock → ${i(t.lock)}`].filter(Boolean);return`${a?"lock-only":""}${a&&s.length?" · ":""}${s.join(" · ")}`;})()}`,enabled:Z`
          <ha-switch
            @click=${e=>e.stopPropagation()}
            ?checked=${e.enabled}
            @change=${t=>this.toggleEnabled(t,e.user_id)}
          ></ha-switch>
        `};return t;});return Z`
      <ha-card>${Qn(Cs("panels.codes.cards.user_management.title",this.hass.language),"settings")}
        <div class="card-content">
          ${Cs("panels.codes.cards.user_management.description",this.hass.language)}
        </div>
        <div class="card-actions" style="border-top:none;border-bottom:1px solid var(--divider-color)">
          <ha-button appearance="plain" ?disabled=${this.editing} @click=${this.addUserClick}>
            ${Cs("panels.codes.cards.user_management.actions.new_user",this.hass.language)}
          </ha-button>
        </div>
        ${this.editing?Z`<div style="padding:0 8px 8px">${this.renderEditor()}</div>`:Y}

        <alarmo-table
          style=${this.editing?"display:none":""}
          ?selectable=${!0}
          .columns=${t}
          .data=${a}
          @row-click=${e=>{const t=String(e.detail.id);xn(0,Mn("codes",{params:{edit_user:t}}),!0);}}
        >
          ${Cs("panels.codes.cards.user_management.no_items",this.hass.language)}
        </alarmo-table>
      </ha-card>
    `;}addUserClick(){xn(0,Mn("codes","new_user"),!0);}saveData(e){this.hass&&(this.data=Object.assign(Object.assign({},this.data),e),je(this.hass,this.data).catch(e=>wn(e,this.shadowRoot.querySelector("ha-card"))).then());}toggleEnabled(e,t){const a=e.target.checked,i=this.shadowRoot.querySelector("ha-card"),s=this.lockLinks.filter(e=>e.user_id===t).length;Oe(this.hass,{user_id:t,enabled:a}).catch(e=>wn(e,i)).then(()=>{!a&&s&&confirm(`Also clear this user's code from ${s} linked lock slot(s)?`)&&Qr(this.hass,t).catch(e=>wn(e,i));});}};ho.styles=Cn,s([ye()],ho.prototype,"hass",void 0),s([ye()],ho.prototype,"narrow",void 0),s([ye()],ho.prototype,"path",void 0),s([ye()],ho.prototype,"data",void 0),s([ye()],ho.prototype,"users",void 0),ho=s([ue("alarm-view-codes")],ho);const po=(e,t)=>{switch(e){case cn.ArmedAway:return{value:cn.ArmedAway,name:Cs("common.modes_short.armed_away",t.language),icon:an.ArmedAway};case cn.ArmedHome:return{value:cn.ArmedHome,name:Cs("common.modes_short.armed_home",t.language),icon:an.ArmedHome};case cn.ArmedNight:return{value:cn.ArmedNight,name:Cs("common.modes_short.armed_night",t.language),icon:an.ArmedNight};case cn.ArmedCustom:return{value:cn.ArmedCustom,name:Cs("common.modes_short.armed_custom_bypass",t.language),icon:an.ArmedCustom};case cn.ArmedVacation:return{value:cn.ArmedVacation,name:Cs("common.modes_short.armed_vacation",t.language),icon:an.ArmedVacation};}},mo=(e,t)=>{switch(e){case hn.Armed:return{value:hn.Armed,name:Cs("panels.actions.cards.new_notification.fields.event.choose.armed.name",t.language),description:Cs("panels.actions.cards.new_notification.fields.event.choose.armed.description",t.language),icon:"hass:shield-check-outline"};case hn.Disarmed:return{value:hn.Disarmed,name:Cs("panels.actions.cards.new_notification.fields.event.choose.disarmed.name",t.language),description:Cs("panels.actions.cards.new_notification.fields.event.choose.disarmed.description",t.language),icon:"hass:shield-off-outline"};case hn.Triggered:return{value:hn.Triggered,name:Cs("panels.actions.cards.new_notification.fields.event.choose.triggered.name",t.language),description:Cs("panels.actions.cards.new_notification.fields.event.choose.triggered.description",t.language),icon:"hass:bell-alert-outline"};case hn.Untriggered:return{value:hn.Untriggered,name:Cs("panels.actions.cards.new_notification.fields.event.choose.untriggered.name",t.language),description:Cs("panels.actions.cards.new_notification.fields.event.choose.untriggered.description",t.language),icon:"hass:bell-off-outline"};case hn.ArmFailure:return{value:hn.ArmFailure,name:Cs("panels.actions.cards.new_notification.fields.event.choose.arm_failure.name",t.language),description:Cs("panels.actions.cards.new_notification.fields.event.choose.arm_failure.description",t.language),icon:"hass:alert-outline"};case hn.Arming:return{value:hn.Arming,name:Cs("panels.actions.cards.new_notification.fields.event.choose.arming.name",t.language),description:Cs("panels.actions.cards.new_notification.fields.event.choose.arming.description",t.language),icon:"hass:home-export-outline"};case hn.Pending:return{value:hn.Pending,name:Cs("panels.actions.cards.new_notification.fields.event.choose.pending.name",t.language),description:Cs("panels.actions.cards.new_notification.fields.event.choose.pending.description",t.language),icon:"hass:home-import-outline"};}},uo=(e,t,a)=>0==e?{name:a.master.name,value:"0"}:Object.keys(t).includes(String(e))?{name:t[e].name,value:String(e)}:{name:String(e),value:String(e)},go=(e,...t)=>{const a=t.map(t=>{if(t.entity_id){return bo([t.entity_id],e).pop();}if(!t||!t.service)return null;const a=jn(t.service),i=Sn(t.service);let s={value:t.service,name:i.replace(/_/g," ").split(" ").map(e=>e.substring(0,1).toUpperCase()+e.substring(1)).join(" "),icon:"hass:home",description:t.service};switch(a){case"notify":const t=e.states[`device_tracker.${i.replace("mobile_app_","")}`];s=t?Object.assign(Object.assign({},s),{name:t.attributes.friendly_name||Sn(t.entity_id),icon:t.attributes.icon||"hass:cellphone-text"}):Object.assign(Object.assign({},s),{icon:"hass:comment-alert"});break;case"tts":s=Object.assign(Object.assign({},s),{icon:"hass:microphone"});break;case"telegram_bot":s=Object.assign(Object.assign({},s),{icon:"mdi:send"});}return s;}).filter(_n);return a.sort((e,t)=>{const a=jn(e.value),i=jn(t.value);return a!=i?An(a,i):An(e,t);}),a;},vo=(e,t)=>{let a=[];const i=Object.keys(e).filter(t=>Object.values(e[t].modes).some(e=>e.enabled));return t.master.enabled&&i.length>1&&(a=[...a,0]),a=[...a,...i],a;},yo=(e,t)=>{const a=e=>Object.keys(e.modes).filter(t=>e.modes[t].enabled);if(_n(e)&&Object.keys(t).includes(String(e)))return a(t[e]);{const e=Object.keys(t).map(e=>a(t[e]));return e[0].filter(t=>e.every(e=>e.includes(t)));}},bo=(e,t)=>{const a=e.map(e=>({value:e,name:e in t.states?t.states[e].attributes.friendly_name||Sn(e):e,icon:e in t.states&&t.states[e].attributes.icon||On(jn(e)),description:e}));return a;},_o=e=>{let t=[];return"notify"in e.services&&(t=[...t,...Object.keys(e.services.notify).filter(e=>"send_message"!=e).map(e=>Object({service:`notify.${e}`}))]),"tts"in e.services&&(t=[...t,...Object.keys(e.services.tts).filter(e=>"clear_cache"!=e).map(e=>Object({service:`tts.${e}`}))]),"telegram_bot"in e.services&&(t=[...t,{service:"telegram_bot.send_message"}]),Object.keys(e.states).filter(e=>"notify"==jn(e)).map(e=>{t=[...t,{service:"notify.send_message",entity_id:e}];}),t;},fo=(...e)=>{if(!e.length||!e.every(e=>e.length))return[];if(1==e.length&&e[0].length>1&&gn(e[0].map(jn)).length>1)return fo(...e[0].map(e=>Array(e)));let t=[...e[0]];return e.forEach(e=>{t=t.map(t=>e.includes(t)?t:"script"==jn(t)&&e.map(jn).includes("script")?"script.script":e.map(Sn).includes(Sn(t))?`homeassistant.${Sn(t)}`:null).filter(_n);}),t;},ko=(e,t,a=1)=>{if(a>10)return[];if(Array.isArray(e)){const i=e.map(e=>ko(e,t,a+1));return fo(...i);}if(!_n(e))return[];const i=jn(e);switch(i){case"light":case"switch":case"input_boolean":case"siren":return[`${i}.turn_on`,`${i}.turn_off`];case"script":return[e];case"lock":return["lock.lock","lock.unlock"];case"group":const s=e in t.states?t.states[e]:void 0,n=(null==s?void 0:s.attributes.entity_id)||[];return ko(n,t,a+1);default:return[];}},wo=(e,t)=>{let a=[...Object.keys(e.states).filter(t=>"script"!=jn(t)&&ko(t,e).length)];const i=Object.keys(e.services.script||{}).filter(e=>!["turn_on","turn_off","reload","toggle"].includes(e)).map(e=>`script.${e}`);return a=[...a,...i],t&&t.length&&(a=[...a,...t.filter(e=>!a.includes(e))]),a.sort(An),a;},$o=(e,...t)=>{let a=[...Object.keys(e.states).filter(e=>t.includes(jn(e)))];return a.sort(An),a;},zo=e=>{let t=[{value:"{{arm_mode}}",name:e.translationMetadata.translations.en.nativeName}];return"en"!=e.language&&(t=[...t,{value:`{{arm_mode|lang=${e.language}}}`,name:e.translationMetadata.translations[e.language].nativeName}]),t;},Ao=e=>"string"==typeof e&&e.trim().length>0,xo=(e,t)=>Ao(e)&&t.services[jn(e)]&&t.services[jn(e)][Sn(e)],jo=(e,t)=>Ao(e)&&(t.states[e]||"script"==jn(e)&&t.services.script[Sn(e)]),So=e=>"object"==typeof e&&null!==e&&!Array.isArray(e),Oo=e=>"string"==typeof e;let Co=class extends pe{constructor(){super(...arguments),this.items=[],this.value=[],this.label="",this.invalid=!1,this.showSearch=!1;}shouldUpdate(e){return e.get("items")&&(fn(this.items,e.get("items"))||this.firstUpdated()),!0;}firstUpdated(){this.value.some(e=>!this.items.map(e=>e.value).includes(e))&&(this.value=this.value.filter(e=>this.items.map(e=>e.value).includes(e)),pn(this,"value-changed",{value:this.value}));}render(){return Z`
      <alarmo-chip-set
        .hass=${this.hass}
        .items=${this.value.map(e=>this.items.find(t=>t.value==e)).filter(_n)}
        removable
        @value-changed=${this._removeClick}
      >
      </alarmo-chip-set>
      <alarmo-select
        .hass=${this.hass}
        .items=${this.items.filter(e=>!this.value.includes(e.value))}
        ?disabled=${this.value.length==this.items.length}
        label=${this.label}
        icons=${!0}
        @value-changed=${this._addClick}
        ?invalid=${this.invalid&&this.value.length!=this.items.length}
        ?showSearch=${this.showSearch}
      ></alarmo-select>
    `;}_removeClick(e){const t=e.detail;this.value=this.value.filter(e=>e!==t),pn(this,"value-changed",{value:this.value});}_addClick(e){e.stopPropagation();const t=e.target,a=t.value;""!==a&&(this.value.includes(a)||(this.value=[...this.value,a]),pn(this,"value-changed",{value:[...this.value]}),t.clearValue());}};var To;s([ye()],Co.prototype,"hass",void 0),s([ye()],Co.prototype,"items",void 0),s([ye({type:Array})],Co.prototype,"value",void 0),s([ye()],Co.prototype,"label",void 0),s([ye({type:Boolean})],Co.prototype,"invalid",void 0),s([ye({type:Boolean})],Co.prototype,"showSearch",void 0),Co=s([ue("alarmo-selector")],Co),function(e){e[e.Yaml=0]="Yaml",e[e.UI=1]="UI";}(To||(To={}));let Eo=class extends pe{constructor(){super(...arguments),this.config={type:ln.Notification,triggers:[{}],actions:[{}]},this.viewMode=To.UI,this.errors={};}async firstUpdated(){if(await ke(),this.areas=await Ee(this.hass),this.alarmoConfig=await we(this.hass),this.item){let e=[...this.item.actions];this.config=Object.assign(Object.assign({},this.item),{actions:[e[0],...e.slice(1)]}),null===this.config.actions[0].entity_id&&Object.assign(this.config.actions,{0:bn(this.config.actions[0],"entity_id")}),this.config.triggers.length>1&&(this.config=Object.assign(Object.assign({},this.config),{triggers:[this.config.triggers[0]]}));let t=this.config.triggers[0].area;_n(t)&&!vo(this.areas,this.alarmoConfig).includes(t)?t=void 0:null===t&&(t=0),this._setArea(new CustomEvent("value-changed",{detail:{value:t}}));}if(!_n(this.config.triggers[0].area)){const e=vo(this.areas,this.alarmoConfig);1==e.length?this._setArea(new CustomEvent("value-changed",{detail:{value:e[0]}})):e.includes(0)&&this._setArea(new CustomEvent("value-changed",{detail:{value:0}}));}}render(){var e,t,a,i,s,n,r;return this.hass&&this.areas&&this.alarmoConfig?Z`
      <div class="heading">
        <ha-icon-button .path=${Ds} @click=${this._cancelClick} class="icon"></ha-icon-button>
        <div class="header">${Cs("panels.actions.cards.new_notification.title",this.hass.language)}</div>
        <div class="description">
          ${Cs("panels.actions.cards.new_notification.description",this.hass.language)}
        </div>
      </div>
      <div class="section-header">${Cs("panels.actions.cards.new_notification.trigger",this.hass.language)}</div>
      <ha-card>
        <div class="card-content">
          <alarmo-settings-row .narrow=${this.narrow} .large=${!0} first>
            <span slot="heading">
              ${Cs("panels.actions.cards.new_notification.fields.event.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${Cs("panels.actions.cards.new_notification.fields.event.description",this.hass.language)}
            </span>

            <alarmo-select
              .hass=${this.hass}
              .items=${Object.values(hn).map(e=>mo(e,this.hass))}
              label=${Cs("panels.actions.cards.new_action.fields.event.heading",this.hass.language)}
              icons=${!0}
              .value=${this.config.triggers[0].event}
              @value-changed=${this._setEvent}
              ?invalid=${this.errors.event}
              showSearch
            ></alarmo-select>
          </alarmo-settings-row>

          ${Object.keys(this.areas).length>1?Z`
                <alarmo-settings-row .narrow=${this.narrow} .large=${!0}>
                  <span slot="heading">
                    ${Cs("panels.actions.cards.new_action.fields.area.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${Cs("panels.actions.cards.new_action.fields.area.description",this.hass.language)}
                  </span>

                  <alarmo-select
                    .hass=${this.hass}
                    .items=${vo(this.areas,this.alarmoConfig).map(e=>uo(e,this.areas,this.alarmoConfig))}
                    label=${Cs("panels.actions.cards.new_action.fields.area.heading",this.hass.language)}
                    .value=${String(this.config.triggers[0].area)}
                    @value-changed=${this._setArea}
                    ?invalid=${this.errors.area||!this.config.triggers[0].area&&!this.alarmoConfig.master.enabled}
                  ></alarmo-select>
                </alarmo-settings-row>
              `:""}

          <alarmo-settings-row .narrow=${this.narrow} .large=${!0} last>
            <span slot="heading">
              ${Cs("panels.actions.cards.new_notification.fields.mode.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${Cs("panels.actions.cards.new_notification.fields.mode.description",this.hass.language)}
            </span>

            <alarmo-selector
              .hass=${this.hass}
              .items=${yo(this.config.triggers[0].area,this.areas).map(e=>po(e,this.hass))}
              label=${Cs("panels.actions.cards.new_action.fields.mode.heading",this.hass.language)}
              .value=${this.config.triggers[0].modes||[]}
              @value-changed=${this._setModes}
              ?invalid=${this.errors.modes}
            ></alarmo-selector>
          </alarmo-settings-row>
        </div>
      </ha-card>

      <div class="section-header">${Cs("panels.actions.cards.new_notification.action",this.hass.language)}</div>
      <ha-card>
        <div class="card-content">
          ${this.viewMode==To.UI?Z`
                <alarmo-settings-row .narrow=${this.narrow} .large=${!0} first>
                  <span slot="heading">
                    ${Cs("panels.actions.cards.new_notification.fields.target.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${Cs("panels.actions.cards.new_notification.fields.target.description",this.hass.language)}
                  </span>

                  <alarmo-select
                    .hass=${this.hass}
                    .items=${go(this.hass,..._o(this.hass))}
                    ?disabled=${!_o(this.hass).length}
                    label=${Cs("panels.actions.cards.new_notification.fields.target.heading",this.hass.language)}
                    .value=${(null===(e=_o(this.hass).find(e=>e.entity_id==this.config.actions[0].entity_id&&e.service==this.config.actions[0].service))||void 0===e?void 0:e.entity_id)||(null===(t=_o(this.hass).find(e=>e.service==this.config.actions[0].service))||void 0===t?void 0:t.service)||void 0}
                    @value-changed=${this._setService}
                    ?invalid=${this.errors.service}
                    showSearch
                  ></alarmo-select>
                </alarmo-settings-row>

                ${this.config.actions[0].service&&"notify"!=jn(this.config.actions[0].service)?"":Z`
                      <alarmo-settings-row .narrow=${this.narrow}>
                        <span slot="heading">
                          ${Cs("panels.actions.cards.new_notification.fields.title.heading",this.hass.language)}
                        </span>
                        <span slot="description">
                          ${Cs("panels.actions.cards.new_notification.fields.title.description",this.hass.language)}
                        </span>

                        <ha-input
                          label="${Cs("panels.actions.cards.new_notification.fields.title.heading",this.hass.language)}"
                          .value=${(null===(a=this.config.actions[0].data)||void 0===a?void 0:a.title)||""}
                          @input=${this._setTitle}
                          ?invalid=${this.errors.title}
                        ></ha-input>
                      </alarmo-settings-row>
                    `}
                ${this.config.actions[0].service&&"tts"==jn(this.config.actions[0].service)?Z`
                      <alarmo-settings-row .narrow=${this.narrow} .large=${!0} first>
                        <span slot="heading">
                          ${Cs("panels.actions.cards.new_action.fields.entity.heading",this.hass.language)}
                        </span>
                        <span slot="description">
                          ${Cs("panels.actions.cards.new_action.fields.entity.description",this.hass.language)}
                        </span>

                        <alarmo-select
                          .hass=${this.hass}
                          .items=${bo("tts.speak"==this.config.actions[0].service?$o(this.hass,"tts"):$o(this.hass,"media_player","tts"),this.hass)}
                          label=${Cs("panels.actions.cards.new_action.fields.entity.heading",this.hass.language)}
                          .value=${(null===(i=this.config.actions[0].data)||void 0===i?void 0:i.entity_id)||""}
                          @value-changed=${this._setEntity}
                          ?invalid=${this.errors.entity}
                          showSearch
                        ></alarmo-select>
                      </alarmo-settings-row>
                    `:""}

                  
                ${this.config.actions[0].service&&"tts.speak"==this.config.actions[0].service?Z`
                      <alarmo-settings-row .narrow=${this.narrow} .large=${!0}>
                        <span slot="heading">
                          ${Cs("panels.actions.cards.new_notification.fields.media_player_entity.heading",this.hass.language)}
                        </span>
                        <span slot="description">
                          ${Cs("panels.actions.cards.new_notification.fields.media_player_entity.description",this.hass.language)}
                        </span>

                        <alarmo-select
                          .hass=${this.hass}
                          .items=${bo($o(this.hass,"media_player"),this.hass)}
                          label=${Cs("panels.actions.cards.new_notification.fields.media_player_entity.heading",this.hass.language)}
                          .value=${(null===(s=this.config.actions[0].data)||void 0===s?void 0:s.media_player_entity_id)||""}
                          @value-changed=${this._setMediaPlayerEntity}
                          .icons=${!0}
                          ?invalid=${this.errors.media_player_entity}
                        ></alarmo-select>
                      </alarmo-settings-row>
                    `:""}

                <alarmo-settings-row .narrow=${this.narrow} .large=${!0} last>
                  <span slot="heading">
                    ${Cs("panels.actions.cards.new_notification.fields.message.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${Cs("panels.actions.cards.new_notification.fields.message.description",this.hass.language)}
                  </span>

                  <ha-selector
                    .hass=${this.hass}
                    .selector=${Object({text:{multiline:!0,type:"text"}})}
                    id="message"
                    label="${Cs("panels.actions.cards.new_notification.fields.message.heading",this.hass.language)}"
                    placeholder=${this._messagePlaceholder()}
                    .value=${(null===(n=this.config.actions[0].data)||void 0===n?void 0:n.message)||""}
                    @value-changed=${e=>{this._setMessage(e.detail.value);}}
                    ?invalid=${this.errors.message}
                  ></ha-selector>
                  ${this.errors.message?Z`
                   <span class="error-message">
                      ${this.hass.localize("ui.common.error_required")}
                    </span>
                  `:Y}
                  ${this.config.triggers[0].event?Z`
                        <div style="margin-top: 10px">
                          <span style="padding-right: 10px">
                            ${Cs("panels.actions.cards.new_notification.fields.message.insert_wildcard",this.hass.language)}:
                          </span>
                          <alarmo-chip-set
                            selectable
                            .items=${((e,t)=>{let a=[];return a=[],e&&![hn.Pending,hn.Triggered,hn.ArmFailure].includes(e)||(a=[...a,{name:"Open Sensors",value:"{{open_sensors}}"}]),e&&![hn.Armed].includes(e)||(a=[...a,{name:"Bypassed Sensors",value:"{{bypassed_sensors}}"}]),(!e||(null==t?void 0:t.code_arm_required)&&[hn.Armed,hn.Arming,hn.ArmFailure].includes(e)||(null==t?void 0:t.code_disarm_required)&&[hn.Disarmed,hn.Untriggered].includes(e))&&(a=[...a,{name:"Changed By",value:"{{changed_by}}"}]),e&&![hn.Armed,hn.Arming,hn.Pending,hn.Triggered,hn.ArmFailure].includes(e)||(a=[...a,{name:"Arm Mode",value:"{{arm_mode}}"}]),e&&![hn.Arming,hn.Pending].includes(e)||(a=[...a,{name:"Delay",value:"{{delay}}"}]),a;})(this.config.triggers[0].event,this.alarmoConfig)}
                            @value-changed=${e=>this._insertWildCard(e.detail)}
                          ></alarmo-chip-set>
                        </div>
                      `:""}
                </alarmo-settings-row>

                ${null!==this._getOpenSensorsFormat()?Z`
                      <alarmo-settings-row .narrow=${this.narrow} .large=${!0}>
                        <span slot="heading">
                          ${Cs("panels.actions.cards.new_notification.fields.open_sensors_format.heading",this.hass.language)}
                        </span>

                        <span slot="description">
                          ${Cs("panels.actions.cards.new_notification.fields.open_sensors_format.description",this.hass.language)}
                        </span>

                        <alarmo-select
                          .hass=${this.hass}
                          .items=${(e=>{let t=[];return t="en"!=e.language?[...t,{value:"{{open_sensors}}",name:`${Cs("panels.actions.cards.new_notification.fields.open_sensors_format.options.default",e.language)} (${e.translationMetadata.translations.en.nativeName})`},{value:`{{open_sensors|lang=${e.language}}}`,name:`${Cs("panels.actions.cards.new_notification.fields.open_sensors_format.options.default",e.language)} (${e.translationMetadata.translations[e.language].nativeName})`}]:[...t,{value:"{{open_sensors}}",name:Cs("panels.actions.cards.new_notification.fields.open_sensors_format.options.default",e.language)}],t=[...t,{value:"{{open_sensors|format=short}}",name:Cs("panels.actions.cards.new_notification.fields.open_sensors_format.options.short",e.language)}],t;})(this.hass)}
                          .value=${this._getOpenSensorsFormat(!0)}
                          @value-changed=${this._setOpenSensorsFormat}
                        ></alarmo-select>
                      </alarmo-settings-row>
                    `:""}
                ${null!==this._getArmModeFormat()&&(zo(this.hass).length>1||1==zo(this.hass).length&&zo(this.hass)[0].value!=this._getArmModeFormat())?Z`
                      <alarmo-settings-row .narrow=${this.narrow} .large=${!0}>
                        <span slot="heading">
                          ${Cs("panels.actions.cards.new_notification.fields.arm_mode_format.heading",this.hass.language)}
                        </span>

                        <span slot="description">
                          ${Cs("panels.actions.cards.new_notification.fields.arm_mode_format.description",this.hass.language)}
                        </span>

                        <alarmo-select
                          .hass=${this.hass}
                          .items=${zo(this.hass)}
                          .value=${this._getArmModeFormat(!0)}
                          @value-changed=${this._setArmModeFormat}
                        ></alarmo-select>
                      </alarmo-settings-row>
                    `:""}
              `:Z`
                <h2>${Cs("components.editor.edit_in_yaml",this.hass.language)}</h2>

                <ha-yaml-editor
                  .defaultValue=${this.config.actions[0]||""}
                  @value-changed=${this._setYaml}
                ></ha-yaml-editor>

                ${this.errors.service||this.errors.title||this.errors.message||this.errors.entity||this.errors.media_player_entity?Z`
                      <span class="error-message">
                        ${this.hass.localize("ui.errors.config.key_missing","key",Object.entries(this.errors).find(([e,t])=>t&&["service","title","message","entity","media_player_entity"].includes(e))[0])}
                      </span>
                    `:""}
              `}
        </div>

        <div class="toggle-button">
          <ha-button appearance="filled" @click=${this._toggleYamlMode}>
            <ha-icon slot="start" icon="hass:shuffle-variant"></ha-icon>
            ${this.viewMode==To.Yaml?Cs("components.editor.ui_mode",this.hass.language):Cs("components.editor.yaml_mode",this.hass.language)}
          </ha-button>
        </div>

        <div class="card-actions">
          <ha-button appearance="plain" ?disabled=${!this._validAction()} @click=${this._testClick}>
            ${Cs("panels.actions.cards.new_notification.actions.test",this.hass.language)}
            <ha-icon slot="end" icon="hass:arrow-right"></ha-icon>
          </ha-button>
        </div>
      </ha-card>

      <div class="section-header">${Cs("panels.actions.cards.new_notification.options",this.hass.language)}</div>
      <ha-card>
        <div class="card-content">
          <alarmo-settings-row .narrow=${this.narrow} .large=${!0} first>
            <span slot="heading">
              ${Cs("panels.actions.cards.new_notification.fields.name.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${Cs("panels.actions.cards.new_notification.fields.name.description",this.hass.language)}
            </span>

            <ha-input
              label="${Cs("panels.actions.cards.new_notification.fields.name.heading",this.hass.language)}"
              .placeholder=${this._namePlaceholder()}
              .value=${this.config.name||""}
              @input=${this._setName}
              ?invalid=${this.errors.name}
            ></ha-input>
          </alarmo-settings-row>

          ${(null===(r=this.item)||void 0===r?void 0:r.automation_id)?Z`
                <alarmo-settings-row .narrow=${this.narrow}>
                  <span slot="heading">
                    ${Cs("panels.actions.cards.new_notification.fields.delete.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${Cs("panels.actions.cards.new_notification.fields.delete.description",this.hass.language)}
                  </span>
                  <div>
                    <ha-button appearance="filled" variant="danger" @click=${this._deleteClick}>
                      <ha-icon slot="start" icon="hass:trash-can-outline"></ha-icon>
                      ${this.hass.localize("ui.common.delete")}
                    </ha-button>
                  </div>
                </alarmo-settings-row>
              `:""}
        </div>
      </ha-card>

      <div class="actions">
        <ha-button appearance="filled" @click=${this._saveClick} style="width: 100%">
          <ha-icon slot="start" icon="hass:content-save-outline"></ha-icon>
          ${this.hass.localize("ui.common.save")}
        </ha-button>
      </div>
    `:Z``;}_setEvent(e){e.stopPropagation();const t=e.target.value;let a=this.config.triggers;Object.assign(a,{0:Object.assign(Object.assign({},a[0]),{event:t})}),this.config=Object.assign(Object.assign({},this.config),{triggers:a}),Object.keys(this.errors).includes("event")&&this._validateConfig();}_setArea(e){var t;e.stopPropagation();let a=e.detail.value;"0"===a&&(a=0);let i=this.config.triggers;Object.assign(i,{0:Object.assign(Object.assign({},i[0]),{area:a})});const s=yo(a,this.areas);(null===(t=i[0].modes)||void 0===t?void 0:t.length)&&this._setModes(new CustomEvent("value-changed",{detail:{value:i[0].modes.filter(e=>s.includes(e))}})),this.config=Object.assign(Object.assign({},this.config),{triggers:i}),Object.keys(this.errors).includes("area")&&this._validateConfig();}_setModes(e){e.stopPropagation();const t=e.detail.value;let a=this.config.triggers;Object.assign(a,{0:Object.assign(Object.assign({},a[0]),{modes:t})}),this.config=Object.assign(Object.assign({},this.config),{triggers:a}),Object.keys(this.errors).includes("modes")&&this._validateConfig();}_setService(e){e.stopPropagation();const t=String(e.detail.value);let a=_o(this.hass).find(e=>e.entity_id==t||e.service==t),i=this.config.actions;Object.assign(i,{0:Object.assign(Object.assign({},a),bn(i[0],"service","entity_id"))}),this.config=Object.assign(Object.assign({},this.config),{actions:i}),(Object.keys(this.errors).includes("service")||Object.keys(this.errors).includes("entity"))&&this._validateConfig();}_setTitle(e){e.stopPropagation();const t=e.target.value;let a=this.config.actions;Object.assign(a,{0:Object.assign(Object.assign({},a[0]),{service:a[0].service||"",data:Object.assign(Object.assign({},a[0].data||{}),{title:t})})}),this.config=Object.assign(Object.assign({},this.config),{actions:a}),Object.keys(this.errors).includes("title")&&this._validateConfig();}_setEntity(e){e.stopPropagation();const t=e.target.value;let a=this.config.actions;Object.assign(a,{0:Object.assign(Object.assign({},a[0]),{service:a[0].service||"",data:Object.assign(Object.assign({},a[0].data||{}),{entity_id:t})})}),this.config=Object.assign(Object.assign({},this.config),{actions:a}),Object.keys(this.errors).includes("entity")&&this._validateConfig();}_setMediaPlayerEntity(e){e.stopPropagation();const t=e.target.value;let a=this.config.actions;Object.assign(a,{0:Object.assign(Object.assign({},a[0]),{service:a[0].service||"",data:Object.assign(Object.assign({},a[0].data||{}),{media_player_entity_id:t})})}),this.config=Object.assign(Object.assign({},this.config),{actions:a}),Object.keys(this.errors).includes("media_player_entity")&&this._validateConfig();}_setMessage(e){let t=this.config.actions;Object.assign(t,{0:Object.assign(Object.assign({},t[0]),{service:t[0].service||"",data:Object.assign(Object.assign({},t[0].data||{}),{message:e})})}),this.config=Object.assign(Object.assign({},this.config),{actions:t}),Object.keys(this.errors).includes("message")&&this._validateConfig();}_setName(e){e.stopPropagation();const t=e.target.value;this.config=Object.assign(Object.assign({},this.config),{name:t});}_setYaml(e){const t=e.detail.value;let a={};Oo(null==t?void 0:t.service)&&(a=Object.assign(Object.assign({},a),{service:String(t.service)})),So(null==t?void 0:t.data)&&(a=Object.assign(Object.assign({},a),{data:t.data})),Object.keys(a).length&&(this.config=Object.assign(Object.assign({},this.config),{actions:Object.assign(this.config.actions,{0:Object.assign(Object.assign({},this.config.actions[0]),a)})})),Object.keys(this.errors).some(e=>["service","message","title"].includes(e))&&this._validateConfig();}_validateConfig(){var e;this.errors={};const t=this._parseAutomation(),a=t.triggers[0];a.event&&Object.values(hn).includes(a.event)||(this.errors=Object.assign(Object.assign({},this.errors),{event:!0})),_n(a.area)&&vo(this.areas,this.alarmoConfig).includes(a.area)||(this.errors=Object.assign(Object.assign({},this.errors),{area:!0})),(a.modes||[]).every(e=>yo(a.area,this.areas).includes(e))||(this.errors=Object.assign(Object.assign({},this.errors),{modes:!0}));const i=t.actions[0];return!i.service||!_o(this.hass).find(e=>e.service==i.service&&e.entity_id==i.entity_id)&&"script"!=jn(i.service)?this.errors=Object.assign(Object.assign({},this.errors),{service:!0}):!i.service||"tts"!=jn(i.service)||Object.keys(i.data||{}).includes("entity_id")&&$o(this.hass,"media_player","tts").includes(i.data.entity_id)||(this.errors=Object.assign(Object.assign({},this.errors),{entity:!0})),i.service&&"tts.speak"==i.service&&(this.errors.entity||$o(this.hass,"tts").includes(i.data.entity_id)||(this.errors=Object.assign(Object.assign({},this.errors),{entity:!0})),Object.keys(i.data||{}).includes("media_player_entity_id")&&$o(this.hass,"media_player").includes(i.data.media_player_entity_id)||(this.errors=Object.assign(Object.assign({},this.errors),{media_player_entity:!0}))),Ao(null===(e=i.data)||void 0===e?void 0:e.message)||(this.errors=Object.assign(Object.assign({},this.errors),{message:!0})),Ao(t.name)||(this.errors=Object.assign(Object.assign({},this.errors),{name:!0})),!Object.values(this.errors).length;}_validAction(){var e;const t=this._parseAutomation().actions[0];return t.service&&("script"==jn(t.service)||_o(this.hass).find(e=>e.service==t.service&&e.entity_id==t.entity_id))&&Ao(null===(e=t.data)||void 0===e?void 0:e.message);}_insertWildCard(e){var t,a,i;let s=this.shadowRoot.querySelector("#message"),n=(null===(t=this.config.actions[0].data)||void 0===t?void 0:t.message)||"";if(s){let e=null===(a=s.shadowRoot)||void 0===a?void 0:a.querySelector("ha-selector-text");e&&(s=e),e=null===(i=s.shadowRoot)||void 0===i?void 0:i.querySelector("ha-textarea"),e&&(s=e),s.focus();}n=s&&_n(s.selectionStart)&&_n(s.selectionEnd)?n.substring(0,s.selectionStart)+e+n.substring(s.selectionEnd,n.length):n+e,this._setMessage(n);}_toggleYamlMode(){if(this.viewMode=this.viewMode==To.UI?To.Yaml:To.UI,this.viewMode==To.Yaml){let e=Object.assign({},this.config.actions[0]),t="object"==typeof e.data&&_n(e.data)?e.data:{};e=Object.assign(Object.assign({},e),{service:e.service||""}),t.message||(t=Object.assign(Object.assign({},t),{message:""})),_o(this.hass).find(t=>t.service==e.service&&t.entity_id==e.entity_id)&&("notify"!=jn(e.service)||t.title||(t=Object.assign(Object.assign({},t),{title:""})),"tts"!=jn(e.service)||t.entity_id||(t=Object.assign(Object.assign({},t),{entity_id:""}))),e=Object.assign(Object.assign({},e),{data:t}),this.config=Object.assign(Object.assign({},this.config),{actions:Object.assign(this.config.actions,{0:e})});}}_namePlaceholder(){const e=this.config.triggers[0].event,t=this.config.actions[0].service?jn(this.config.actions[0].service):null;if(!e)return"";if("notify"==t){const t=go(this.hass,this.config.actions[0]);return t.length?Cs(`panels.actions.cards.new_notification.fields.name.placeholders.${e}`,this.hass.language,"{target}",t[0].name):"";}if("tts"==t){const t="object"==typeof this.config.actions[0].data&&_n(this.config.actions[0].data)?this.config.actions[0].data.entity_id:null;if(!t||!this.hass.states[t])return"";const a=un(this.hass.states[t]);return Cs(`panels.actions.cards.new_notification.fields.name.placeholders.${e}`,this.hass.language,"{target}",a);}if("telegram_bot"==t){const a=mn(t);return Cs(`panels.actions.cards.new_notification.fields.name.placeholders.${e}`,this.hass.language,"{target}",a);}return"";}_messagePlaceholder(){const e=this.config.triggers[0].event;return e?Cs(`panels.actions.cards.new_notification.fields.message.placeholders.${e}`,this.hass.language):"";}_parseAutomation(){var e;let t=Object.assign({},this.config),a=t.actions[0];return!Ao(null===(e=a.data)||void 0===e?void 0:e.message)&&this.viewMode==To.UI&&this._messagePlaceholder()&&(a=Object.assign(Object.assign({},a),{data:Object.assign(Object.assign({},a.data),{message:this._messagePlaceholder()})}),Object.assign(t,{actions:Object.assign(t.actions,{0:a})})),!Ao(t.name)&&this._namePlaceholder()&&(t=Object.assign(Object.assign({},t),{name:this._namePlaceholder()})),t;}_getOpenSensorsFormat(e=!1){var t;const a=((null===(t=this.config.actions[0].data)||void 0===t?void 0:t.message)||"").match(/{{open_sensors(\|[^}]+)?}}/);return null!==a?a[0]:e?"{{open_sensors}}":null;}_setOpenSensorsFormat(e){var t;e.stopPropagation();const a=String(e.detail.value);let i=(null===(t=this.config.actions[0].data)||void 0===t?void 0:t.message)||"";i=i.replace(/{{open_sensors(\|[^}]+)?}}/,a);let s=this.config.actions;Object.assign(s,{0:Object.assign(Object.assign({},s[0]),{service:s[0].service||"",data:Object.assign(Object.assign({},s[0].data||{}),{message:i})})}),this.config=Object.assign(Object.assign({},this.config),{actions:s});}_getArmModeFormat(e=!1){var t;const a=((null===(t=this.config.actions[0].data)||void 0===t?void 0:t.message)||"").match(/{{arm_mode(\|[^}]+)?}}/);return null!==a?a[0]:e?"{{arm_mode}}":null;}_setArmModeFormat(e){var t;e.stopPropagation();const a=String(e.detail.value);let i=(null===(t=this.config.actions[0].data)||void 0===t?void 0:t.message)||"";i=i.replace(/{{arm_mode(\|[^}]+)?}}/,a);let s=this.config.actions;Object.assign(s,{0:Object.assign(Object.assign({},s[0]),{service:s[0].service||"",data:Object.assign(Object.assign({},s[0].data||{}),{message:i})})}),this.config=Object.assign(Object.assign({},this.config),{actions:s});}_saveClick(e){if(!this._validateConfig())return;let t=this._parseAutomation();yo(t.triggers[0].area,this.areas).every(e=>{var a;return null===(a=t.triggers[0].modes)||void 0===a?void 0:a.includes(e);})&&(t=Object.assign(Object.assign({},t),{triggers:Object.assign(t.triggers,{0:Object.assign(Object.assign({},t.triggers[0]),{modes:[]})})})),this.item&&(t=Object.assign(Object.assign({},t),{automation_id:this.item.automation_id})),Ce(this.hass,t).catch(t=>wn(t,e)).then(()=>this._cancelClick());}_deleteClick(e){var t;(null===(t=this.item)||void 0===t?void 0:t.automation_id)&&Te(this.hass,this.item.automation_id).catch(t=>wn(t,e)).then(()=>this._cancelClick());}async _testClick(e){const t=this._parseAutomation();let a=Object.assign({},t.actions[0]),i=a.data.message;i=i.replace("{{open_sensors|format=short}}","Some Example Sensor"),i=i.replace(/{{open_sensors(\|[^}]+)?}}/,"Some Example Sensor is open"),i=i.replace("{{bypassed_sensors}}","Some Bypassed Sensor"),i=i.replace(/{{arm_mode(\|[^}]+)?}}/,"Armed away"),i=i.replace("{{changed_by}}","Some Example User"),i=i.replace("{{delay}}","30"),a=Object.assign(Object.assign({},a),{data:Object.assign(Object.assign({},a.data),{message:i})});let s=Object.assign(Object.assign({},bn(a,"service")),{action:a.service});this.hass.callWS({type:"execute_script",sequence:s}).then().catch(t=>{kn(e,t.message);});}_cancelClick(){xn(0,Mn("actions"),!0);}static get styles(){return h`
      div.content {
        padding: 28px 20px 0;
        max-width: 1040px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
      }
      div.header {
        font-size: 24px;
        font-weight: 400;
        letter-spacing: -0.012em;
        line-height: 32px;
        opacity: var(--dark-primary-opacity);
      }
      div.section-header {
        font-size: 18px;
        font-weight: 400;
        letter-spacing: -0.012em;
        line-height: 32px;
        opacity: var(--dark-primary-opacity);
        margin: 20px 0px 5px 10px;
      }
      div.actions {
        padding: 20px 0px 30px 0px;
      }
      .toggle-button {
        position: absolute;
        right: 20px;
        top: 20px;
      }
      h2 {
        margin-top: 10px;
        font-size: 24px;
        font-weight: 400;
        letter-spacing: -0.012em;
      }
      span.error-message {
        color: var(--error-color);
      }
      div.heading {
        display: grid;
        grid-template-areas:
          'header icon'
          'description icon';
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr 48px;
        margin: 20px 0px 10px 10px;
      }
      div.heading .icon {
        grid-area: icon;
      }
      div.heading .header {
        grid-area: header;
      }
      div.heading .description {
        grid-area: description;
      }
      ha-textarea[invalid] {
        --mdc-text-field-idle-line-color: var(--mdc-theme-error);
        --mdc-text-field-label-ink-color: var(--mdc-theme-error);
      }
    `;}};var Mo;s([ye({attribute:!1})],Eo.prototype,"hass",void 0),s([ye()],Eo.prototype,"narrow",void 0),s([ye()],Eo.prototype,"config",void 0),s([ye()],Eo.prototype,"item",void 0),s([ye()],Eo.prototype,"areas",void 0),s([ye()],Eo.prototype,"alarmoConfig",void 0),s([ye()],Eo.prototype,"viewMode",void 0),s([ye()],Eo.prototype,"errors",void 0),Eo=s([ue("notification-editor-card")],Eo),function(e){e[e.Yaml=0]="Yaml",e[e.UI=1]="UI";}(Mo||(Mo={}));let Lo=class extends pe{constructor(){super(...arguments),this.config={type:ln.Action,triggers:[{}],actions:[{}]},this.viewMode=Mo.UI,this.errors={};}async firstUpdated(){if(await ke(),this.areas=await Ee(this.hass),this.alarmoConfig=await we(this.hass),this.item){let e=this.item.actions.map(e=>e.entity_id?e:bn(e,"entity_id"));this.config=Object.assign(Object.assign({},this.item),{actions:[e[0],...e.slice(1)]}),this.config.triggers.length>1&&(this.config=Object.assign(Object.assign({},this.config),{triggers:[this.config.triggers[0]]}));let t=this.config.triggers[0].area;_n(t)&&!vo(this.areas,this.alarmoConfig).includes(t)?t=void 0:null===t&&(t=0),this._setArea(new CustomEvent("value-changed",{detail:{value:t}})),this._hasCustomEntities()&&(this.viewMode=Mo.Yaml);}if(!_n(this.config.triggers[0].area)){const e=vo(this.areas,this.alarmoConfig);1==e.length?this._setArea(new CustomEvent("value-changed",{detail:{value:e[0]}})):e.includes(0)&&this._setArea(new CustomEvent("value-changed",{detail:{value:0}}));}!this.item||this.config.triggers[0].area||this.alarmoConfig.master.enabled||(this.errors=Object.assign(Object.assign({},this.errors),{area:!0}));}render(){var e;return this.hass&&this.areas&&this.alarmoConfig?Z`
      <div class="heading">
        <ha-icon-button .path=${Ds} @click=${this._cancelClick} class="icon"></ha-icon-button>
        <div class="header">${Cs("panels.actions.cards.new_action.title",this.hass.language)}</div>
        <div class="description">${Cs("panels.actions.cards.new_action.description",this.hass.language)}</div>
      </div>
      <div class="section-header">${Cs("panels.actions.cards.new_notification.trigger",this.hass.language)}</div>
      <ha-card>
        <div class="card-content">
          <alarmo-settings-row .narrow=${this.narrow} .large=${!0} first>
            <span slot="heading">
              ${Cs("panels.actions.cards.new_action.fields.event.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${Cs("panels.actions.cards.new_action.fields.event.description",this.hass.language)}
            </span>

            <alarmo-select
              .hass=${this.hass}
              .items=${Object.values(hn).map(e=>mo(e,this.hass))}
              label=${Cs("panels.actions.cards.new_action.fields.event.heading",this.hass.language)}
              icons=${!0}
              .value=${this.config.triggers[0].event}
              @value-changed=${this._setEvent}
              ?invalid=${this.errors.event}
              showSearch
            ></alarmo-select>
          </alarmo-settings-row>

          ${Object.keys(this.areas).length>1?Z`
                <alarmo-settings-row .narrow=${this.narrow} .large=${!0}>
                  <span slot="heading">
                    ${Cs("panels.actions.cards.new_action.fields.area.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${Cs("panels.actions.cards.new_action.fields.area.description",this.hass.language)}
                  </span>

                  <alarmo-select
                    .hass=${this.hass}
                    .items=${vo(this.areas,this.alarmoConfig).map(e=>uo(e,this.areas,this.alarmoConfig))}
                    label=${Cs("panels.actions.cards.new_action.fields.area.heading",this.hass.language)}
                    .value=${String(this.config.triggers[0].area)}
                    @value-changed=${this._setArea}
                    ?invalid=${this.errors.area}
                  ></alarmo-select>
                </alarmo-settings-row>
              `:""}

          <alarmo-settings-row .narrow=${this.narrow} .large=${!0} last>
            <span slot="heading">
              ${Cs("panels.actions.cards.new_notification.fields.mode.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${Cs("panels.actions.cards.new_notification.fields.mode.description",this.hass.language)}
            </span>

            <alarmo-selector
              .hass=${this.hass}
              .items=${yo(this.config.triggers[0].area,this.areas).map(e=>po(e,this.hass))}
              label=${Cs("panels.actions.cards.new_action.fields.mode.heading",this.hass.language)}
              .value=${this.config.triggers[0].modes||[]}
              @value-changed=${this._setModes}
              ?invalid=${this.errors.modes}
            ></alarmo-selector>
          </alarmo-settings-row>
        </div>
      </ha-card>

      <div class="section-header">${Cs("panels.actions.cards.new_notification.action",this.hass.language)}</div>
      <ha-card>
        <div class="card-content">
          ${this.viewMode==Mo.UI?Z`
                <alarmo-settings-row .narrow=${this.narrow} .large=${!0} first>
                  <span slot="heading">
                    ${Cs("panels.actions.cards.new_action.fields.entity.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${Cs("panels.actions.cards.new_action.fields.entity.description",this.hass.language)}
                  </span>

                  <alarmo-selector
                    .hass=${this.hass}
                    .items=${bo(wo(this.hass,this._getEntities()),this.hass)}
                    ?disabled=${!wo(this.hass,this._getEntities()).length}
                    label=${Cs("panels.actions.cards.new_action.fields.entity.heading",this.hass.language)}
                    .value=${this._getEntities()}
                    @value-changed=${this._setEntity}
                    ?invalid=${this.errors.entity_id}
                    showSearch
                  ></alarmo-selector>
                </alarmo-settings-row>

                ${this._getEntities().length?Z`
                      <alarmo-settings-row .narrow=${this.narrow} .large=${!0}>
                        <span slot="heading">
                          ${Cs("panels.actions.cards.new_action.fields.action.heading",this.hass.language)}
                        </span>
                        <span slot="description">
                          ${Cs("panels.actions.cards.new_action.fields.action.description",this.hass.language)}
                        </span>

                        <div>
                          ${this.renderActions()||Cs("panels.actions.cards.new_action.fields.action.no_common_actions",this.hass.language)}
                        </div>
                        ${this.errors.service?Z`
                              <span class="error-message">
                                ${this.hass.localize("ui.common.error_required",this.hass.language)}
                              </span>
                            `:""}
                      </alarmo-settings-row>
                    `:""}
              `:Z`
                <h2>${Cs("components.editor.edit_in_yaml",this.hass.language)}</h2>

                <ha-yaml-editor
                  .defaultValue=${this.config.actions||""}
                  @value-changed=${this._setYaml}
                ></ha-yaml-editor>

                ${this.errors.service||this.errors.entity_id?Z`
                      <span class="error-message">
                        ${this.hass.localize("ui.errors.config.key_missing","key",Object.entries(this.errors).find(([e,t])=>t&&["service","entity_id"].includes(e))[0])}
                      </span>
                    `:""}
              `}
        </div>

        <div class="toggle-button">
          <ha-button appearance="plain" @click=${this._toggleYamlMode}>
            <ha-icon slot="start" icon="hass:shuffle-variant"></ha-icon>
            ${this.viewMode==Mo.Yaml?Cs("components.editor.ui_mode",this.hass.language):Cs("components.editor.yaml_mode",this.hass.language)}
          </ha-button>
        </div>

        <div class="card-actions">
          <ha-button appearance="plain" ?disabled=${!this._validAction()} @click=${this._testClick}>
            ${Cs("panels.actions.cards.new_notification.actions.test",this.hass.language)}
            <ha-icon slot="end" icon="hass:arrow-right"></ha-icon>
          </ha-button>
        </div>
      </ha-card>

      <div class="section-header">${Cs("panels.actions.cards.new_notification.options",this.hass.language)}</div>
      <ha-card>
        <div class="card-content">
          <alarmo-settings-row .narrow=${this.narrow} .large=${!0} first>
            <span slot="heading">
              ${Cs("panels.actions.cards.new_action.fields.name.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${Cs("panels.actions.cards.new_action.fields.name.description",this.hass.language)}
            </span>

            <ha-input
              label="${Cs("panels.actions.cards.new_action.fields.name.heading",this.hass.language)}"
              .placeholder=${this._namePlaceholder()}
              .value=${this.config.name||""}
              @input=${this._setName}
              ?invalid=${this.errors.name}
            ></ha-input>
          </alarmo-settings-row>

          ${(null===(e=this.item)||void 0===e?void 0:e.automation_id)?Z`
                <alarmo-settings-row .narrow=${this.narrow}>
                  <span slot="heading">
                    ${Cs("panels.actions.cards.new_notification.fields.delete.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${Cs("panels.actions.cards.new_notification.fields.delete.description",this.hass.language)}
                  </span>
                  <div>
                    <ha-button appearance="filled" variant="danger" @click=${this._deleteClick}>
                      <ha-icon slot="start" icon="hass:trash-can-outline"></ha-icon>
                      ${this.hass.localize("ui.common.delete")}
                    </ha-button>
                  </div>
                </alarmo-settings-row>
              `:""}
        </div>
      </ha-card>

      <div class="actions">
        <ha-button appearance="filled" @click=${this._saveClick} style="width: 100%">
          <ha-icon slot="start" icon="hass:content-save-outline"></ha-icon>
          ${this.hass.localize("ui.common.save")}
        </ha-button>
      </div>
    `:Z``;}renderActions(){let e=this.config.actions.map(e=>e.entity_id),t=ko(e,this.hass);if(!t.length)return;const a=(...e)=>!!e.every(_n)&&1==gn(fo(e.filter(_n))).length;return t.map(e=>Z`
        <ha-button
          appearance="${a(this._selectedAction(),e)?"filled":"plain"}"
          variant="${a(this._selectedAction(),e)?"brand":"neutral"}"
          @click=${()=>this._setAction(e)}
        >
          ${((e,t)=>{let a=Sn(e);switch("script"==jn(e)&&(a="run"),a){case"turn_on":return t.localize("ui.card.media_player.turn_on");case"turn_off":return t.localize("ui.card.media_player.turn_off");case"lock":return t.localize("ui.card.lock.lock");case"unlock":return t.localize("ui.card.lock.unlock");case"run":return t.localize("ui.card.script.run");default:return a;}})(e,this.hass)}
        </ha-button>
      `);}_selectedAction(){let e=this.config.actions.map(e=>e.service);return e.every(_n)?(e=gn(fo(e.filter(_n))),1==e.length?e[0]:null):null;}_setEvent(e){e.stopPropagation();const t=e.detail.value;let a=this.config.triggers;Object.assign(a,{0:Object.assign(Object.assign({},a[0]),{event:t})}),this.config=Object.assign(Object.assign({},this.config),{triggers:a}),Object.keys(this.errors).includes("event")&&this._validateConfig();}_setArea(e){var t;e.stopPropagation();let a=e.detail.value;"0"===a&&(a=0);let i=this.config.triggers;Object.assign(i,{0:Object.assign(Object.assign({},i[0]),{area:a})});const s=yo(a,this.areas);(null===(t=i[0].modes)||void 0===t?void 0:t.length)&&this._setModes(new CustomEvent("value-changed",{detail:{value:i[0].modes.filter(e=>s.includes(e))}})),this.config=Object.assign(Object.assign({},this.config),{triggers:i}),Object.keys(this.errors).includes("area")&&this._validateConfig();}_setModes(e){e.stopPropagation();const t=e.detail.value,a=this.config.triggers;Object.assign(a,{0:Object.assign(Object.assign({},a[0]),{modes:t})}),this.config=Object.assign(Object.assign({},this.config),{triggers:a}),Object.keys(this.errors).includes("service")&&this._validateConfig();}_setEntity(e){e.stopPropagation();const t=e.detail.value;let a=this.config.actions,i=null;if(t.length>a.length&&this._selectedAction()&&(i=this._selectedAction()),a.length>t.length){let e=a.findIndex(e=>!t.includes(e.entity_id||""));e<0&&(e=a.length-1),a.splice(e,1);}t.length||Object.assign(a,{0:bn(a[0],"entity_id")}),t.forEach((e,t)=>{let i=a.length>t?Object.assign({},a[t]):{};i=i.entity_id==e?Object.assign({},i):{entity_id:e},Object.assign(a,{[t]:i});}),this.config=Object.assign(Object.assign({},this.config),{actions:a}),i&&this._setAction(i),Object.keys(this.errors).includes("entity_id")&&this._validateConfig();}_setAction(e){let t=this.config.actions,a=this.config.actions.map(e=>e.entity_id);ko(a,this.hass).length&&(t.forEach((a,i)=>{let s=ko(a.entity_id,this.hass),n=(r=e,s.find(e=>e==r||"turn_on"==Sn(r)&&"turn_on"==Sn(e)||"turn_off"==Sn(r)&&"turn_off"==Sn(e)||"script"==jn(r)&&"script"==jn(e)));var r;Object.assign(t,{[i]:Object.assign({service:n},bn(a,"service"))});}),this.config=Object.assign(Object.assign({},this.config),{actions:t}),Object.keys(this.errors).includes("service")&&this._validateConfig());}_setName(e){e.stopPropagation();const t=e.target.value;this.config=Object.assign(Object.assign({},this.config),{name:t});}_setYaml(e){let t=e.detail.value,a=[{}];var i;So(t)&&(t=[t]),"object"==typeof(i=t)&&null!==i&&Array.isArray(i)&&(t.forEach((e,t)=>{let i={};So(e)&&Oo(e.service)&&(i=Object.assign(Object.assign({},i),{service:e.service})),So(e)&&Oo(e.entity_id)&&(i=Object.assign(Object.assign({},i),{entity_id:e.entity_id})),So(e)&&So(e.data)&&(i=Object.assign(Object.assign({},i),{data:e.data})),Object.assign(a,{[t]:i});}),this.config=Object.assign(Object.assign({},this.config),{actions:a}));}_validateConfig(){this.errors={};const e=this._parseAutomation(),t=e.triggers[0];t.event&&Object.values(hn).includes(t.event)||(this.errors=Object.assign(Object.assign({},this.errors),{event:!0})),_n(t.area)&&vo(this.areas,this.alarmoConfig).includes(t.area)||(this.errors=Object.assign(Object.assign({},this.errors),{area:!0})),(t.modes||[]).every(e=>yo(t.area,this.areas).includes(e))||(this.errors=Object.assign(Object.assign({},this.errors),{modes:!0}));let a=e.actions.map(e=>e.entity_id);this.viewMode==Mo.Yaml&&(a=a.filter(_n)),e.actions.length&&a.every(e=>jo(e,this.hass))||(this.errors=Object.assign(Object.assign({},this.errors),{entity_id:!0}));const i=e.actions.map(e=>e.service).filter(_n);if(!i.length||!i.every(e=>xo(e,this.hass))){this.errors=Object.assign(Object.assign({},this.errors),{service:!0}),!ko(a,this.hass).length&&i.length&&(this.viewMode=Mo.Yaml);}return Ao(e.name)||(this.errors=Object.assign(Object.assign({},this.errors),{name:!0})),!Object.values(this.errors).length;}_validAction(){const e=this._parseAutomation(),t=e.actions.map(e=>e.service);let a=e.actions.map(e=>e.entity_id);return this.viewMode==Mo.Yaml&&(a=a.filter(_n)),t.length&&t.every(e=>xo(e,this.hass))&&a.every(e=>jo(e,this.hass));}_toggleYamlMode(){this.viewMode=this.viewMode==Mo.UI?Mo.Yaml:Mo.UI,this.viewMode==Mo.Yaml&&(this.config=Object.assign(Object.assign({},this.config),{actions:Object.assign(this.config.actions,{0:Object.assign(Object.assign({},this.config.actions[0]),{service:this.config.actions[0].service||"",data:Object.assign({},this.config.actions[0].data||{})})})}));}_namePlaceholder(){var e,t,a,i;if(!this._validAction)return"";const s=this.config.triggers[0].event,n=this.config.actions.map(e=>e.entity_id).filter(_n),r=bo(n,this.hass).map(e=>e.name).join(", "),o=gn(this.config.actions.map(e=>e.service).filter(_n).map(e=>Sn(e)));let d;return 1==o.length&&(null===(e=o[0])||void 0===e?void 0:e.includes("turn_on"))&&(d=this.hass.localize("state.default.on")),1==o.length&&(null===(t=o[0])||void 0===t?void 0:t.includes("turn_off"))&&(d=this.hass.localize("state.default.off")),1==o.length&&(null===(a=o[0])||void 0===a?void 0:a.includes("lock"))&&(d=this.hass.localize("component.lock.state._.locked")),1==o.length&&(null===(i=o[0])||void 0===i?void 0:i.includes("unlock"))&&(d=this.hass.localize("component.lock.state._.unlocked")),s&&r&&d?Cs(`panels.actions.cards.new_action.fields.name.placeholders.${s}`,this.hass.language,"entity",r,"state",d):"";}_getEntities(){return gn(this.config.actions.map(e=>e.entity_id).filter(_n))||[];}_hasCustomEntities(){return this._getEntities().some(e=>!wo(this.hass).includes(e));}_parseAutomation(){let e=Object.assign({},this.config);return!Ao(e.name)&&this._namePlaceholder()&&(e=Object.assign(Object.assign({},e),{name:this._namePlaceholder()})),e;}_saveClick(e){if(!this._validateConfig())return;let t=this._parseAutomation();yo(t.triggers[0].area,this.areas).every(e=>{var a;return null===(a=t.triggers[0].modes)||void 0===a?void 0:a.includes(e);})&&(t=Object.assign(Object.assign({},t),{triggers:Object.assign(t.triggers,{0:Object.assign(Object.assign({},t.triggers[0]),{modes:[]})})})),Ce(this.hass,t).catch(t=>wn(t,e)).then(()=>this._cancelClick());}_deleteClick(e){var t;(null===(t=this.item)||void 0===t?void 0:t.automation_id)&&Te(this.hass,this.item.automation_id).catch(t=>wn(t,e)).then(()=>this._cancelClick());}_testClick(e){this._parseAutomation().actions.forEach(t=>{const[a,i]=t.service.split(".");let s=Object.assign({},t.data);t.entity_id&&(s=Object.assign(Object.assign({},s),{entity_id:t.entity_id})),this.hass.callService(a,i,s).then().catch(t=>{kn(e,t.message);});});}_cancelClick(){xn(0,Mn("actions"),!0);}static get styles(){return h`
      div.content {
        padding: 28px 20px 0;
        max-width: 1040px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
      }
      div.header {
        font-size: 24px;
        font-weight: 400;
        letter-spacing: -0.012em;
        line-height: 32px;
        opacity: var(--dark-primary-opacity);
      }
      div.section-header {
        font-size: 18px;
        font-weight: 400;
        letter-spacing: -0.012em;
        line-height: 32px;
        opacity: var(--dark-primary-opacity);
        margin: 20px 0px 5px 10px;
      }
      div.actions {
        padding: 20px 0px 30px 0px;
      }
      .toggle-button {
        position: absolute;
        right: 20px;
        top: 20px;
      }
      h2 {
        margin-top: 10px;
        font-size: 24px;
        font-weight: 400;
        letter-spacing: -0.012em;
      }
      span.error-message {
        color: var(--error-color);
        font-size: 0.875rem;
        display: flex;
        margin-top: 10px;
      }
      div.heading {
        display: grid;
        grid-template-areas:
          'header icon'
          'description icon';
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr 48px;
        margin: 20px 0px 10px 10px;
      }
      div.heading .icon {
        grid-area: icon;
      }
      div.heading .header {
        grid-area: header;
      }
      div.heading .description {
        grid-area: description;
      }
    `;}};s([ye({attribute:!1})],Lo.prototype,"hass",void 0),s([ye()],Lo.prototype,"narrow",void 0),s([ye()],Lo.prototype,"config",void 0),s([ye()],Lo.prototype,"item",void 0),s([ye()],Lo.prototype,"areas",void 0),s([ye()],Lo.prototype,"alarmoConfig",void 0),s([ye()],Lo.prototype,"viewMode",void 0),s([ye()],Lo.prototype,"errors",void 0),Lo=s([ue("automation-editor-card")],Lo);const No="no_area";let Ho=class extends Le(pe){constructor(){super(...arguments),this.areas={},this.getAreaForAutomation=e=>{if(!this.config)return;const t=vo(this.areas,this.config);let a=e.triggers[0].area;return _n(a)&&t.includes(a)?a:void 0;};}hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"alarmo_config_updated"})];}async _fetchData(){if(!this.hass)return;const e=await Ae(this.hass);this.automations=Object.values(e),this.areas=await Ee(this.hass),this.config=await we(this.hass);}firstUpdated(){var e;this.path.filter&&(this.selectedArea=null===(e=this.path.filter)||void 0===e?void 0:e.area),(async()=>{await fe();})();}render(){if(!this.hass||!this.automations||!this.config)return Z``;const e=(()=>{if("new_notification"==this.path.subpage)return Z`<notification-editor-card .hass=${this.hass} .narrow=${this.narrow}></notification-editor-card>`;if(this.path.params.edit_notification){const e=this.automations.find(e=>e.automation_id==this.path.params.edit_notification&&e.type==ln.Notification);return Z`<notification-editor-card .hass=${this.hass} .narrow=${this.narrow} .item=${e}></notification-editor-card>`;}if("new_action"==this.path.subpage)return Z`<automation-editor-card .hass=${this.hass} .narrow=${this.narrow}></automation-editor-card>`;if(this.path.params.edit_action){const e=this.automations.find(e=>e.automation_id==this.path.params.edit_action&&e.type==ln.Action);return Z`<automation-editor-card .hass=${this.hass} .narrow=${this.narrow} .item=${e}></automation-editor-card>`;}return null;})();{const t=()=>Z`
        <paper-tooltip animation-delay="0">
          ${Cs("panels.actions.cards.notifications.table.no_area_warning",this.hass.language)}
        </paper-tooltip>
      `,a={type:{width:"40px",renderer:e=>e.area!=No||this.config.master.enabled?e.type==ln.Notification?Z`
                  <ha-icon icon="hass:message-text-outline"  class="${e.enabled?"":"disabled"}"></ha-icon>
                `:Z`
                  <ha-icon icon="hass:flash"  class="${e.enabled?"":"disabled"}"></ha-icon>
                `:Z`
                  ${t()}
                  <ha-icon icon="mdi:alert" style="color: var(--error-color)"></ha-icon>
                `},name:{title:this.hass.localize("ui.common.name"),renderer:e=>Z`
            ${e.area!=No||this.config.master.enabled?"":t()}
            <span class="${e.enabled?"":"disabled"}">${e.name}</span>
          `,width:"40%",grow:!0,text:!0},enabled:{title:Cs("common.enabled",this.hass.language),width:"68px",align:"center",renderer:e=>Z`
            <ha-switch
              ?checked=${e.enabled}
              @click=${e=>e.stopPropagation()}
              @change=${t=>this.toggleEnable(t,e.automation_id)}
            ></ha-switch>
          `}},i=this.automations.filter(e=>e.type==ln.Notification).map(e=>Object(Object.assign(Object.assign({},e),{id:e.automation_id,warning:!this.config.master.enabled&&!this.getAreaForAutomation(e),area:this.getAreaForAutomation(e)||No}))),s=this.automations.filter(e=>e.type==ln.Action).map(e=>Object(Object.assign(Object.assign({},e),{id:e.automation_id,warning:!this.config.master.enabled&&!this.getAreaForAutomation(e),area:this.getAreaForAutomation(e)||No}))),n="actions"!==this.section,r="notifications"!==this.section;return Z`
        ${n?Z`
        <ha-card>${Qn(Cs("panels.actions.cards.notifications.title",this.hass.language),"settings")}
          <div class="card-content">
            ${Cs("panels.actions.cards.notifications.description",this.hass.language)}
          </div>
          <div class="card-actions" style="border-top:none;border-bottom:1px solid var(--divider-color)">
            <ha-button appearance="plain" ?disabled=${!!e} @click=${this.addNotificationClick}>
              ${Cs("panels.actions.cards.notifications.actions.new_notification",this.hass.language)}
            </ha-button>
          </div>
          ${e?Z`<div style="padding:0 8px 8px">${e}</div>`:""}

          <alarmo-table
            style=${e?"display:none":""}
            .hass=${this.hass}
            ?selectable=${!0}
            .columns=${a}
            .data=${i}
            .filters=${this.getTableFilterOptions()}
            @row-click=${e=>xn(0,Mn("actions",{params:{edit_notification:e.detail.id}}),!0)}
          >
            ${Cs("panels.actions.cards.notifications.table.no_items",this.hass.language)}
          </alarmo-table>

        </ha-card>
        `:""}

        ${r?Z`
        <ha-card>${Qn(Cs("panels.actions.title",this.hass.language),"settings")}
          <div class="card-content">${Cs("panels.actions.cards.actions.description",this.hass.language)}</div>
          <div class="card-actions" style="border-top:none;border-bottom:1px solid var(--divider-color)">
            <ha-button appearance="plain" ?disabled=${!!e} @click=${this.addActionClick}>
              ${Cs("panels.actions.cards.actions.actions.new_action",this.hass.language)}
            </ha-button>
          </div>
          ${e?Z`<div style="padding:0 8px 8px">${e}</div>`:""}

          <alarmo-table
            style=${e?"display:none":""}
            .hass=${this.hass}
            ?selectable=${!0}
            .columns=${a}
            .data=${s}
            .filters=${this.getTableFilterOptions()}
            @row-click=${e=>xn(0,Mn("actions",{params:{edit_action:e.detail.id}}),!0)}
          >
            ${Cs("panels.actions.cards.actions.table.no_items",this.hass.language)}
          </alarmo-table>

        </ha-card>
        `:""}
      `;}}toggleEnable(e,t){Ce(this.hass,{automation_id:t,enabled:e.target.checked}).catch(t=>wn(t,e)).then();}getTableFilterOptions(){if(!this.hass)return;let e=Object.values(this.areas).map(e=>Object({value:e.area_id,name:e.name,badge:t=>t.filter(t=>t.area==e.area_id).length})).sort(An);Object.values(this.automations||[]).filter(e=>!this.getAreaForAutomation(e)).length&&(e=[{value:No,name:this.config.master.enabled?this.config.master.name:this.hass.localize("state_attributes.climate.preset_mode.none"),badge:e=>e.filter(e=>e.area==No).length},...e]);return{area:{name:Cs("components.table.filter.item",this.hass.language,"name",Cs("panels.actions.cards.new_action.fields.area.heading",this.hass.language)),items:e,value:this.selectedArea?[this.selectedArea]:[]}};}addNotificationClick(){xn(0,Mn("actions","new_notification"),!0);}addActionClick(){xn(0,Mn("actions","new_action"),!0);}};Ho.styles=Cn,s([ye()],Ho.prototype,"hass",void 0),s([ye()],Ho.prototype,"narrow",void 0),s([ye()],Ho.prototype,"path",void 0),s([ye()],Ho.prototype,"alarmEntity",void 0),s([ye()],Ho.prototype,"automations",void 0),s([ye()],Ho.prototype,"areas",void 0),s([ye()],Ho.prototype,"config",void 0),s([ye()],Ho.prototype,"selectedArea",void 0),s([ye()],Ho.prototype,"section",void 0),Ho=s([ue("alarm-view-actions")],Ho);const Do=["type","area","modes","enabled","always_on","use_entry_delay","use_exit_delay","allow_open","arm_on_close","trigger_unavailable","auto_bypass","auto_bypass_modes","entry_delay","delay_on","group"],Po=["modes","auto_bypass_modes"],qo=e=>void 0===e?e:JSON.parse(JSON.stringify(e));function Bo(e,t,a){if(Po.includes(e)){const e=[...(t||[])].sort(),i=[...(a||[])].sort();return JSON.stringify(e)===JSON.stringify(i);}return null==t&&null==a||JSON.stringify(t)===JSON.stringify(a);}class Io{constructor(e={}){this.saved={},this.edits={},this.added={},this.removed=new Set(),this.order=[],this.setSaved(e);}setSaved(e){this.saved=qo(e)||{};for(const e of Object.keys(this.edits))if(e in this.saved){for(const t of Object.keys(this.edits[e]))Bo(t,this.edits[e][t],this.saved[e][t])&&delete this.edits[e][t];Object.keys(this.edits[e]).length||delete this.edits[e];}else delete this.edits[e];for(const e of Object.keys(this.added))e in this.saved&&delete this.added[e];for(const e of[...this.removed])e in this.saved||this.removed.delete(e);const t=new Set([...Object.keys(this.saved),...Object.keys(this.added)]);this.order=[...this.order.filter(e=>t.has(e))];for(const e of t)this.order.includes(e)||this.order.push(e);}ids(){return[...this.order];}has(e){return e in this.saved||e in this.added;}isSaved(e){return e in this.saved;}get(e){return e in this.added?qo(this.added[e]):e in this.saved?Object.assign(Object.assign({},qo(this.saved[e])),qo(this.edits[e]||{})):void 0;}savedValue(e,t){return this.saved[e]?qo(this.saved[e][t]):void 0;}setField(e,t,a){if(e in this.added)return void(this.added[e]=Object.assign(Object.assign({},this.added[e]),{[t]:qo(a)}));if(!(e in this.saved))throw new Error(`unknown sensor ${e}`);const i=Object.assign({},this.edits[e]||{});Bo(t,a,this.saved[e][t])?delete i[t]:i[t]=qo(a),Object.keys(i).length?this.edits[e]=i:delete this.edits[e];}setFieldMany(e,t,a){e.filter(e=>!this.removed.has(e)).forEach(e=>this.setField(e,t,a));}toggleMode(e,t,a,i="modes"){const s=this.get(e);if(!s)return;const n=[...(s[i]||[])].filter(e=>e!==t);a&&n.push(t),this.setField(e,i,n);}toggleModeMany(e,t,a,i="modes"){e.filter(e=>!this.removed.has(e)).forEach(e=>this.toggleMode(e,t,a,i));}isFieldChanged(e,t){return!(e in this.added)&&!!this.edits[e]&&t in this.edits[e];}isModeChanged(e,t,a="modes"){if(!this.isFieldChanged(e,a))return!1;return(this.get(e)[a]||[]).includes(t)!==(this.saved[e][a]||[]).includes(t);}rowStatus(e){return e in this.added?"new":this.removed.has(e)?"removed":this.edits[e]?"changed":"unchanged";}rowChangeCount(e){const t=this.rowStatus(e);return"new"===t||"removed"===t?1:Object.keys(this.edits[e]||{}).length;}add(e){const t=e.entity_id;t in this.saved?this.removed.delete(t):(this.added[t]=qo(e),this.order.includes(t)||this.order.push(t));}remove(e){e in this.added?(delete this.added[e],this.order=this.order.filter(t=>t!==e)):e in this.saved&&this.removed.add(e);}removeMany(e){e.forEach(e=>this.remove(e));}restore(e){this.removed.delete(e);}revertRow(e){e in this.added&&this.remove(e),delete this.edits[e],this.removed.delete(e);}discardAll(){this.edits={},this.added={},this.removed=new Set(),this.order=this.order.filter(e=>e in this.saved);}changeCount(){return this.order.reduce((e,t)=>e+this.rowChangeCount(t),0);}isDirty(){return this.changeCount()>0;}toBatch(){return{create:Object.values(this.added).map(e=>{const t={entity_id:e.entity_id};for(const a of Do)void 0!==e[a]&&("group"!==a||e[a])&&(t[a]=qo(e[a]));return t;}),update:Object.entries(this.edits).filter(([e])=>!this.removed.has(e)).map(([e,t])=>({entity_id:e,changes:qo(t)})),delete:[...this.removed]};}snapshot(){return{edits:qo(this.edits),added:qo(this.added),removed:[...this.removed]};}loadSnapshot(e){if(e){this.discardAll();for(const[t,a]of Object.entries(e.added||{}))t in this.saved||this.add(a);for(const[t,a]of Object.entries(e.edits||{}))if(t in this.saved)for(const[e,i]of Object.entries(a))this.setField(t,e,i);for(const t of e.removed||[])t in this.saved&&this.removed.add(t);}}}let Vo=class extends pe{constructor(){super(...arguments),this.label="",this.value=null,this.min=0,this.max=100,this.step=1,this.unit="",this.optional=!1,this.offText="default",this.disabled=!1,this.compact=!1;}emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!1}));}clamp(e){return Math.min(this.max,Math.max(this.min,e));}render(){var e;const t=null!==this.value&&void 0!==this.value,a=t?this.clamp(Number(this.value)):this.clamp(null!==(e=this.onValue)&&void 0!==e?e:this.min);return Z`
      <div class="row">
        ${this.optional?Z`<label class="lbl">
              <input
                type="checkbox"
                .checked=${t}
                ?disabled=${this.disabled}
                aria-label=${this.compact?this.label:Y}
                @change=${e=>this.emit(e.target.checked?a:null)}
              />${this.compact?Y:Z`<span>${this.label}</span>`}
            </label>`:this.compact?Y:Z`<span class="lbl">${this.label}</span>`}
        ${t||!this.optional?Z`<span class="grp">
              <input
                type="range"
                min=${this.min}
                max=${this.max}
                step=${this.step}
                .value=${String(a)}
                ?disabled=${this.disabled}
                aria-label=${this.label}
                @input=${e=>this.shadowRoot.querySelector(".val").textContent=`${e.target.value}${this.unit?" "+this.unit:""}`}
                @change=${e=>this.emit(this.clamp(parseInt(e.target.value,10)||0))}
              />
              <span class="val">${a}${this.unit?` ${this.unit}`:""}</span>
            </span>`:Z`<span class="off">${this.offText}</span>`}
      </div>
    `;}};Vo.styles=h`
    :host {
      display: block;
      min-width: 0;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: flex-start;
      min-height: 36px;
    }
    .lbl {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .grp {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      flex-wrap: nowrap;
      flex: 1 1 140px;
      min-width: 120px;
      max-width: 320px;
    }
    input[type='range'] {
      flex: 1 1 auto;
      min-width: 80px;
      accent-color: var(--primary-color);
    }
    .val {
      min-width: 44px;
      padding-left: 2px;
      text-align: right;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    .off {
      color: var(--secondary-text-color);
      font-size: 12px;
    }
    :host([compact]) .grp {
      flex: 0 0 auto;
      width: 170px;
    }
  `,s([ye()],Vo.prototype,"label",void 0),s([ye({attribute:!1})],Vo.prototype,"value",void 0),s([ye({type:Number})],Vo.prototype,"min",void 0),s([ye({type:Number})],Vo.prototype,"max",void 0),s([ye({type:Number})],Vo.prototype,"step",void 0),s([ye()],Vo.prototype,"unit",void 0),s([ye({type:Boolean})],Vo.prototype,"optional",void 0),s([ye()],Vo.prototype,"offText",void 0),s([ye({type:Number})],Vo.prototype,"onValue",void 0),s([ye({type:Boolean})],Vo.prototype,"disabled",void 0),s([ye({type:Boolean})],Vo.prototype,"compact",void 0),Vo=s([ue("alarmo-ext-slider")],Vo);const Ro="alarmo-ext-sensor-table-draft",Uo=["on","open","opening","closing","unlocked","tilted","true","detected"],Go=["off","closed","locked","false","clear"],Fo=e=>e&&"unavailable"!==e?Uo.includes(e)?"open":Go.includes(e)?"closed":"unknown":"unavailable",Ko=(e,t,a)=>{const i=e[t]||{opened:!1,closed:!1},s=Fo(a);if(i.last===a)return e;const n=Object.assign(Object.assign({},i),{last:a});return"open"===s&&(n.opened=!0),"closed"===s&&i.opened&&(n.closed=!0),Object.assign(Object.assign({},e),{[t]:n});},Zo=e=>!!e&&e.opened&&e.closed,Wo={open:"mdi:alert-circle-outline",closed:"mdi:check-circle-outline",unavailable:"mdi:help-circle-outline",unknown:"mdi:help-circle-outline"},Yo=(e,t={})=>null===e?Z`<span class="state-cell muted"><ha-icon icon="mdi:minus"></ha-icon><span>—</span></span>`:Z`<span class="state-cell" style=${`color:${((e,t=!1)=>t?"var(--error-color, #f44336)":"open"===e?"var(--warning-color, #ffa600)":"closed"===e?"var(--success-color, #43a047)":"var(--error-color, #f44336)")(e,t.blocks)}`} title=${t.title||e}>
        <ha-icon icon=${Wo[e]}></ha-icon><span>${t.label||e}</span>${t.blocks?Z`<span class="blocks">blocks</span>`:Y}
      </span>`,Qo=["armed_away","armed_home","armed_night","armed_vacation","armed_custom_bypass","disarmed"],Jo=e=>e.callWS({type:"alarmo/ext/panel/get"}),Xo=(e,t)=>e.callWS({type:"alarmo/ext/panel/save",settings:t}),ed=(e,t,a,i=!1)=>e.callWS({type:"alarmo/ext/panel/import",partition:t,entities:a,dry_run:i}),td=(e,t)=>e.callWS({type:"alarmo/ext/panel/repoint",pairs:t}),ad=[{id:"door",label:"Doors",classes:["door","garage_door","opening"]},{id:"window",label:"Windows",classes:["window"]},{id:"motion",label:"Motion",classes:["motion","occupancy","presence","moving"]}],id=e=>(ad.find(t=>t.classes.includes(e||""))||{id:""}).id,sd=e=>`binary_sensor.${e.replace(/^binary_sensor\./,"")}_mirror`,nd=(e,t,a=!1)=>e.callWS({type:"alarmo/ext/panel/match_exit",link:t,dry_run:a}),rd={zone:{title:"Zone",text:"A Home Assistant entity used as an alarm zone: a door or window contact, motion sensor, garage door, lock, smoke detector, etc."},type:{title:"Zone type",text:"What kind of zone this is (Door, Window, Motion, Tamper, Environmental, Generic). In the Zones tab it pre-fills sensible options; in this table changing it does not change the other options by itself."},area:{title:"Partition",text:"The partition this zone belongs to. Arming a partition only watches its own zones. Most homes have a single partition."},modes:{title:"Arm Modes",text:"Checked = this zone is watched while its partition is armed in that mode (Away, Home/Stay, Night, Vacation, Custom). A greyed-out box means the mode is turned off for the partition."},enabled:{title:"Enabled",text:"Unchecked = the zone is ignored completely, as if it were removed, but it keeps its settings so you can turn it back on later."},always_on:{title:"Always on",text:"The zone is watched all the time, even when the alarm is disarmed, and triggers immediately. Use it for smoke, CO, water leak and tamper zones."},use_entry_delay:{title:"Entry delay",text:'Checked: when this zone opens while armed, the alarm first waits for the entry delay so you can disarm (typical for the door you come in through). Unchecked: the alarm triggers immediately (an "instant" zone, typical for windows).'},use_exit_delay:{title:"Exit delay",text:"Checked: this zone may be open during the exit delay after you arm, e.g. the door you leave through. Unchecked: if it is open while arming, the arming is stopped."},auto_bypass:{title:"Auto-bypass",text:'If this zone is open when you arm, it is left out ("bypassed") for that arming instead of blocking it, e.g. a window you left open. It only happens in the modes chosen under "Bypass in" (click › at the end of the row). The zone is watched again the next time you arm.'},auto_bypass_modes:{title:"Bypass in",text:"The Arm Modes in which this zone may be bypassed automatically when it is open while arming."},allow_open:{title:"Allow open initially",text:"The zone may be open (active) when you arm. It is ignored until it closes, and triggers if it opens again after that. Typical for motion sensors that are still active when you leave."},arm_on_close:{title:"Arm after closing",text:"When this zone closes during the exit delay, the rest of the delay is skipped and the alarm arms right away, e.g. the front door shutting behind you."},trigger_unavailable:{title:"Trigger when unavailable",text:'If the entity becomes "unavailable" while armed (device offline, flat battery, cut wire), treat it as open. Safer, but a flaky device can cause false alarms.'},entry_delay:{title:"Entry delay override",text:"Seconds of entry delay for this zone only, instead of the partition's entry delay for the current mode. Leave empty to use the partition setting."},delay_on:{title:"Delay on",text:"The zone must stay open for this many seconds before it counts, which filters out short glitches. Resets if it closes again. Leave empty for no delay."},group:{title:"Cross-zone group",text:'Zones in a cross-zone group only trigger the alarm when several of them (the group setting, e.g. 2) trigger within the group\'s time window; one zone on its own is ignored. Use it to avoid false alarms, e.g. two motion sensors in the same room. Groups are created on the Zones tab ("Set up cross-zone groups").'},partition:{title:"Partition",text:"The partition the matching zones are put in."}},od=e=>{var t;return(null===(t=rd[e])||void 0===t?void 0:t.text)||"";},dd=["garage","gate","door",void 0,null,""],ld=(e,t)=>{const a=e.entity_id.split(".")[0];return"cover"===a?t||dd.includes(e.attributes.device_class):"lock"===a||fr(e,t);};let cd=class extends pe{constructor(){super(...arguments),this.areas={},this.exclude=[],this.defaultArea="",this.search="",this.deviceClass="",this.showAll=!1,this.picked=[],this.area="";}firstUpdated(){this.area=this.defaultArea||Object.keys(this.areas)[0]||"";}candidates(){const e=this.search.trim().toLowerCase();return Object.values(this.hass.states).filter(e=>ld(e,this.showAll)).filter(e=>!this.exclude.includes(e.entity_id)).filter(e=>!this.deviceClass||e.attributes.device_class===this.deviceClass).filter(t=>!e||t.entity_id.includes(e)||un(t).toLowerCase().includes(e)).sort((e,t)=>un(e).localeCompare(un(t)));}render(){const e=Object.values(this.hass.states).filter(e=>ld(e,!0)).filter(e=>!this.exclude.includes(e.entity_id)),t=[...new Set(e.map(e=>e.attributes.device_class).filter(Boolean))].sort(),a=this.candidates(),i=a.length>0&&a.every(e=>this.picked.includes(e.entity_id));return Z`
      <div class="overlay" @click=${e=>e.target===e.currentTarget&&this.close()}>
        <div class="modal" role="dialog" aria-label="Add zones">
          <h2>Add zones</h2>
          <div class="body">
            <div class="toolbar" style="padding:8px 0">
              <input
                type="search"
                placeholder="Search name or entity ID"
                aria-label="Search"
                .value=${this.search}
                @input=${e=>this.search=e.target.value}
              />
              <select aria-label="Device class" @change=${e=>this.deviceClass=e.target.value}>
                <option value="">All device classes</option>
                ${t.map(e=>Z`<option value=${e} ?selected=${e===this.deviceClass}>${e}</option>`)}
              </select>
              <label>
                <input type="checkbox" .checked=${this.showAll} @change=${e=>this.showAll=e.target.checked} />
                Show all binary sensors and covers
              </label>
            </div>
            <div class="table-wrap" style="max-height:50vh">
              <table>
                <thead>
                  <tr>
                    <th class="c">
                      <input
                        type="checkbox"
                        aria-label="Select all"
                        .checked=${i}
                        @change=${e=>this.pickAll(a.map(e=>e.entity_id),e.target.checked)}
                      />
                    </th>
                    <th class="icon"></th>
                    <th>Entity</th>
                    <th>Device class</th>
                  </tr>
                </thead>
                <tbody>
                  ${a.map(e=>Z`
                      <tr>
                        <td class="c">
                          <input
                            type="checkbox"
                            aria-label=${`Select ${un(e)}`}
                            .checked=${this.picked.includes(e.entity_id)}
                            @change=${t=>this.pickAll([e.entity_id],t.target.checked)}
                          />
                        </td>
                        <td class="icon">${Xn(this.hass,e.entity_id)}</td>
                        <td class="name">${un(e)}<span class="secondary">${e.entity_id}</span></td>
                        <td>${e.attributes.device_class||"—"}</td>
                      </tr>
                    `)}
                </tbody>
              </table>
              ${a.length?"":Z`<div class="empty">No unconfigured entities match.</div>`}
            </div>
          </div>
          <div class="footer">
            <label style="margin-right:auto">
              Add to partition
              <select aria-label="Partition" @change=${e=>this.area=e.target.value}>
                ${Object.values(this.areas).map(e=>Z`<option value=${e.area_id} ?selected=${e.area_id===this.area}>${e.name}</option>`)}
              </select>
            </label>
            <ha-button appearance="plain" @click=${this.close}>Cancel</ha-button>
            <ha-button ?disabled=${!this.picked.length||!this.area} @click=${this.confirm}>
              Add ${this.picked.length||""} zone${1===this.picked.length?"":"s"}
            </ha-button>
          </div>
        </div>
      </div>
    `;}pickAll(e,t){const a=this.picked.filter(t=>!e.includes(t));this.picked=t?[...a,...e]:a;}confirm(){this.dispatchEvent(new CustomEvent("sensors-picked",{detail:{entity_ids:this.picked,area:this.area}}));}close(){this.dispatchEvent(new CustomEvent("close"));}};cd.styles=Kn,s([ye({attribute:!1})],cd.prototype,"hass",void 0),s([ye({attribute:!1})],cd.prototype,"areas",void 0),s([ye({attribute:!1})],cd.prototype,"exclude",void 0),s([ye()],cd.prototype,"defaultArea",void 0),s([be()],cd.prototype,"search",void 0),s([be()],cd.prototype,"deviceClass",void 0),s([be()],cd.prototype,"showAll",void 0),s([be()],cd.prototype,"picked",void 0),s([be()],cd.prototype,"area",void 0),cd=s([ue("alarmo-ext-add-sensors")],cd);const hd=e=>{const t={};return e.forEach(([e,a])=>t[e]=a),t;},pd=(e,t)=>e.callWS({type:"alarmo/ext/rules/save",rule:t}),md=e=>e.callWS({type:"alarmo/ext/rules/preview"}),ud=async e=>{const[t,a,i]=await Promise.all([e.callWS({type:"config/label_registry/list"}),e.callWS({type:"config/area_registry/list"}),e.callWS({type:"config/floor_registry/list"})]),s=(e,t)=>hd(e.map(e=>[String(e[t]),String(e.name)]));return{labels:s(t,"label_id"),areas:s(a,"area_id"),floors:s(i,"floor_id")};},gd={partition:"Partition",modes:"Arm modes",type:"Zone type",enabled:"Enabled",always_on:"Always on",use_entry_delay:"Entry delay",use_exit_delay:"Exit delay",allow_open:"Allow open initially",arm_on_close:"Arm after closing",trigger_unavailable:"Trigger when unavailable",auto_bypass:"Bypass automatically",auto_bypass_modes:"Bypass in modes",entry_delay:"Entry delay override (s)",delay_on:"Delay on (s)"},vd=e=>e.match.labels.length+(e.match.areas.length?1:0)+(e.match.floors.length?1:0),yd=(e,t)=>e.map(e=>t[e]||`${e} (missing)`),bd=(e,t,a)=>a?e.includes(t)?e:[...e,t]:e.filter(e=>e!==t);let _d=class extends pe{constructor(){super(...arguments),this.options=[],this.value=[],this.label="",this.placeholder="Choose…",this.filterFrom=8,this.filter="",this.choice="";}render(){const e=e=>{var t;return(null===(t=this.options.find(t=>t.value===e))||void 0===t?void 0:t.label)||`${e} (missing)`;},t=((e,t,a)=>{const i=a.trim().toLowerCase();return e.filter(e=>!t.includes(e.value)).filter(e=>!i||e.label.toLowerCase().includes(i)||e.value.toLowerCase().includes(i)).sort((e,t)=>e.label.localeCompare(t.label));})(this.options,this.value,this.filter);return Z`
      <div class="wrap">
        ${this.label?Z`<span class="lbl">${this.label}</span>`:Y}
        <div class="row">
          ${this.options.length>this.filterFrom?Z`<input type="search" placeholder="Filter" aria-label=${`Filter ${this.label}`} .value=${this.filter}
                @input=${e=>this.filter=e.target.value} />`:Y}
          <select aria-label=${this.label||this.placeholder} @change=${e=>this.choice=e.target.value}>
            <option value="" ?selected=${!this.choice}>${t.length?this.placeholder:"nothing left to add"}</option>
            ${t.map(e=>Z`<option value=${e.value} ?selected=${e.value===this.choice}>${e.label}</option>`)}
          </select>
          <ha-icon-button .path=${Ws} .label=${`Add to ${this.label}`} ?disabled=${!this.choice} @click=${this.add}></ha-icon-button>
        </div>
        ${this.value.length?Z`<div class="chips">
              ${this.value.map(t=>Z`<span class="chip ${this.options.some(e=>e.value===t)?"":"missing"}">
                ${e(t)}
                <ha-icon-button .path=${Ds} .label=${`Remove ${e(t)}`} @click=${()=>this.emit(this.value.filter(e=>e!==t))}></ha-icon-button>
              </span>`)}
            </div>`:Y}
      </div>
    `;}add(){this.choice&&!this.value.includes(this.choice)&&(this.emit([...this.value,this.choice]),this.choice="");}emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e}}));}};_d.styles=h`
    .wrap {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin: 4px 0 8px;
    }
    .lbl {
      font-weight: 500;
    }
    .row {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
    }
    select,
    input {
      font: inherit;
      color: var(--primary-text-color);
      background: var(--card-background-color, var(--primary-background-color));
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 6px 8px;
      min-height: 34px;
      box-sizing: border-box;
      max-width: 100%;
    }
    select {
      min-width: 220px;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      padding: 0 0 0 10px;
      border-radius: 16px;
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      --mdc-icon-button-size: 28px;
      --mdc-icon-size: 16px;
    }
    .chip.missing {
      border-color: var(--error-color, #f44336);
      color: var(--error-color, #f44336);
    }
  `,s([ye({attribute:!1})],_d.prototype,"options",void 0),s([ye({attribute:!1})],_d.prototype,"value",void 0),s([ye()],_d.prototype,"label",void 0),s([ye()],_d.prototype,"placeholder",void 0),s([ye({type:Number})],_d.prototype,"filterFrom",void 0),s([be()],_d.prototype,"filter",void 0),s([be()],_d.prototype,"choice",void 0),_d=s([ue("alarmo-ext-multi-picker")],_d);const fd=[cn.ArmedAway,cn.ArmedHome,cn.ArmedNight,cn.ArmedVacation,cn.ArmedCustom],kd=["enabled","always_on","use_entry_delay","use_exit_delay","allow_open","arm_on_close","trigger_unavailable","auto_bypass"],wd=e=>JSON.parse(JSON.stringify(e));let $d=class extends pe{constructor(){super(...arguments),this.registry={labels:{},areas:{},floors:{}},this.partitions={},this.draft={name:"",enabled:!0,order:0,match:{labels:[],areas:[],floors:[]},set:{}},this.busy=!1,this.error="";}firstUpdated(){this.draft=this.rule?wd(this.rule):{name:"",enabled:!0,order:0,match:{labels:[],areas:[],floors:[]},set:{}};}modeLabel(e){const t=Cs(`common.modes_short.${e}`,this.hass.language)||e;return e===cn.ArmedHome&&"Home"===t?"Home (Stay)":t;}setMatch(e,t,a){this.draft=Object.assign(Object.assign({},this.draft),{match:Object.assign(Object.assign({},this.draft.match),{[e]:bd(this.draft.match[e],t,a)})});}useField(e,t,a){const i=Object.assign({},this.draft.set);t?i[e]=a:delete i[e],this.draft=Object.assign(Object.assign({},this.draft),{set:i});}setValue(e,t){this.draft=Object.assign(Object.assign({},this.draft),{set:Object.assign(Object.assign({},this.draft.set),{[e]:t})});}render(){const e=this.draft,t=(e=>{const t=[];return e.name.trim()||t.push("Give the rule a name."),vd(e)||t.push("Choose at least one label, area or floor to match."),Object.keys(e.set).length||t.push("Choose at least one thing for the rule to set."),t;})(e),a=Object.keys(this.partitions)[0];return Z`
      <ha-card class="editor">
          ${Qn(e.id?`Edit zone rule: ${e.name}`:"New zone rule","settings")}
          <div class="toolbar">
            <span class="grow secondary" style="display:inline">Saving a rule changes no zones; the results show as pending changes below.</span>
            <ha-button appearance="plain" ?disabled=${this.busy} @click=${this.close}>Cancel</ha-button>
            <ha-button ?disabled=${this.busy||t.length>0} @click=${this.save}>${this.busy?"Saving…":"Save rule"}</ha-button>
          </div>
          <div class="card-content">
            ${e.id?Y:Z`
                  <p>
                    Start from a template:
                    ${((e,t)=>{const a=(e,t)=>Object.keys(e).find(a=>e[a].toLowerCase()===t)||"",i=a(e.labels,"perimeter"),s=a(e.labels,"interior"),n=(e,t,a)=>({name:e,rule:Object.assign(Object.assign({},{name:"",enabled:!0,order:0,match:{labels:[],areas:[],floors:[]},set:{}}),{name:e,match:Object.assign({labels:[],areas:[],floors:[]},t),set:a})});return[n("Area → Partition",{},t?{partition:t}:{}),n("Perimeter label → Stay/Night/Away/Vacation",{labels:i?[i]:[]},{modes:["armed_away","armed_home","armed_night","armed_vacation"]}),n("Interior label → Away/Vacation",{labels:s?[s]:[]},{modes:["armed_away","armed_vacation"]})];})(this.registry,a).map(e=>Z`<button class="link" @click=${()=>this.draft=wd(e.rule)}>${e.name}</button>`)}
                  </p>
                `}
            <p>
              <label>
                Name
                <input
                  type="text"
                  maxlength="80"
                  aria-label="Rule name"
                  .value=${e.name}
                  @input=${e=>this.draft=Object.assign(Object.assign({},this.draft),{name:e.target.value})}
                />
              </label>
              <label style="margin-left:16px">
                <input
                  type="checkbox"
                  .checked=${e.enabled}
                  @change=${e=>this.draft=Object.assign(Object.assign({},this.draft),{enabled:e.target.checked})}
                />
                Enabled
              </label>
            </p>

            <h3 style="font-weight:500;margin:12px 0 4px">Match zones that have…</h3>
            <div class="desc" style="padding:0">
              <ul>
                <li>All chosen labels must be present (on the entity or on its device).</li>
                <li>Any chosen area or floor matches.</li>
                <li>More conditions = more specific; the more specific rule wins for single values.</li>
              </ul>
            </div>
            ${this.renderPicker("labels","Labels (all of)",this.registry.labels)}
            ${this.renderPicker("areas","Areas (any of)",this.registry.areas)}
            ${this.renderPicker("floors","Floors (any of)",this.registry.floors)}

            <h3 style="font-weight:500;margin:12px 0 4px">…and set</h3>
            ${this.renderSetRow("partition",a,Z`
                <select aria-label="Partition" @change=${e=>this.setValue("partition",e.target.value)}>
                  ${Object.values(this.partitions).map(t=>Z`<option value=${t.area_id} ?selected=${e.set.partition===t.area_id}>${t.name}</option>`)}
                </select>
              `)}
            ${this.renderSetRow("modes",[],Z`${fd.map(t=>Z`
                  <label style="margin-right:8px">
                    <input
                      type="checkbox"
                      .checked=${(e.set.modes||[]).includes(t)}
                      @change=${a=>this.setValue("modes",bd(e.set.modes||[],t,a.target.checked))}
                    />
                    ${this.modeLabel(t)}
                  </label>
                `)}<span class="secondary" style="display:block">Modes from all matching rules are added together.</span>`)}
            ${this.renderSetRow("type",rn.Door,Z`
                <select aria-label="Zone type" @change=${e=>this.setValue("type",e.target.value)}>
                  ${Object.values(rn).map(t=>Z`<option value=${t} ?selected=${e.set.type===t}>
                      ${Cs(`panels.sensors.cards.editor.fields.device_type.choose.${t}.name`,this.hass.language)||t}
                    </option>`)}
                </select>
              `)}
            ${kd.map(t=>this.renderSetRow(t,!0,Z`
                  <select aria-label=${gd[t]} @change=${e=>this.setValue(t,"on"===e.target.value)}>
                    <option value="on" ?selected=${!0===e.set[t]}>On</option>
                    <option value="off" ?selected=${!1===e.set[t]}>Off</option>
                  </select>
                `))}
            ${["entry_delay","delay_on"].map(t=>this.renderSetRow(t,null,Z`
                  <alarmo-ext-slider
                    compact
                    optional
                    .label=${gd[t]}
                    .min=${0}
                    .max=${"entry_delay"===t?300:600}
                    .onValue=${30}
                    unit="s"
                    offText="partition default"
                    .value=${null===e.set[t]||void 0===e.set[t]?null:e.set[t]}
                    @value-changed=${e=>this.setValue(t,e.detail.value)}
                  ></alarmo-ext-slider>
                `))}
            <p class="secondary" style="display:block">
              Specificity: ${vd(e)}. Saving a rule changes no zones — the results appear as pending rule
              changes on the Zones page, to preview and apply.
            </p>
            ${t.length&&e.name?Z`<div class="notice warn" style="margin:8px 0">${t.map(e=>Z`<div>${e}</div>`)}</div>`:Y}
            ${this.error?Z`<div class="notice error" style="margin:8px 0;white-space:pre-line">${this.error}</div>`:Y}
          </div>
          <div class="toolbar">
            <span class="grow"></span>
            <ha-button appearance="plain" ?disabled=${this.busy} @click=${this.close}>Cancel</ha-button>
            <ha-button ?disabled=${this.busy||t.length>0} @click=${this.save}>${this.busy?"Saving…":"Save rule"}</ha-button>
          </div>
      </ha-card>
    `;}renderPicker(e,t,a){return Z`
      <alarmo-ext-multi-picker
        .label=${t}
        .placeholder=${`Add a ${e.slice(0,-1)}…`}
        .options=${i=a,Object.keys(i).map(e=>({value:e,label:i[e]}))}
        .value=${this.draft.match[e]}
        @value-changed=${t=>this.draft=Object.assign(Object.assign({},this.draft),{match:Object.assign(Object.assign({},this.draft.match),{[e]:t.detail.value})})}
      ></alarmo-ext-multi-picker>
    `;var i;}renderSetRow(e,t,a){const i=e in this.draft.set;return Z`
      <div class="detail-grid" style="padding:2px 0;align-items:center">
        <label style="min-width:220px;cursor:help" title=${od(e)}>
          <input type="checkbox" .checked=${i} @change=${a=>this.useField(e,a.target.checked,t)} />
          ${gd[e]}
        </label>
        ${i?a:Y}
      </div>
    `;}async save(){this.busy=!0,this.error="";try{const e=await pd(this.hass,this.draft);this.dispatchEvent(new CustomEvent("saved",{detail:e}));}catch(e){this.error=Nn(e);}finally{this.busy=!1;}}close(){this.dispatchEvent(new CustomEvent("close"));}};$d.styles=Kn,s([ye({attribute:!1})],$d.prototype,"hass",void 0),s([ye({attribute:!1})],$d.prototype,"registry",void 0),s([ye({attribute:!1})],$d.prototype,"partitions",void 0),s([ye({attribute:!1})],$d.prototype,"rule",void 0),s([be()],$d.prototype,"draft",void 0),s([be()],$d.prototype,"busy",void 0),s([be()],$d.prototype,"error",void 0),$d=s([ue("alarmo-ext-rule-editor")],$d);let zd=class extends pe{constructor(){super(...arguments),this.rules=[],this.registry={labels:{},areas:{},floors:{}},this.partitions={},this.editing=void 0,this.open=!0,this.error="",this.modeLabel=e=>{const t=Cs(`common.modes_short.${e}`,this.hass.language)||e;return e===cn.ArmedHome&&"Home"===t?"Home (Stay)":t;};}render(){var e;const t=(e=>{const t={};if(!e)return t;for(const a of Object.values(e.zones))for(const e of a.rules)t[e]=(t[e]||0)+1;return t;})(this.preview),a=hd(Object.values(this.partitions).map(e=>[e.area_id,e.name])),i=(null===(e=this.preview)||void 0===e?void 0:e.stale)||[],s=[...this.rules].sort((e,t)=>(e.order||0)-(t.order||0)||e.name.localeCompare(t.name));return Z`
      <ha-card>
        ${Qn(Z`<button class="link" style="font-size:inherit;padding:0" aria-expanded=${this.open} @click=${()=>this.open=!this.open}>
            ${this.open?"▾":"▸"} Zone rules (${this.rules.length})</button>`,"settings")}
        <div class="card-content desc"><p>Optional: assign zones automatically from Home Assistant labels, areas and floors.</p></div>
        <div class="toolbar">
          <ha-button appearance="plain" ?disabled=${void 0!==this.editing} @click=${()=>this.editing=null}>
            <ha-svg-icon slot="start" .path=${Ws}></ha-svg-icon>
            New rule
          </ha-button>
        </div>
        ${void 0!==this.editing?Z`
            <alarmo-ext-rule-editor
              .hass=${this.hass}
              .registry=${this.registry}
              .partitions=${this.partitions}
              .rule=${this.editing||void 0}
              @close=${()=>this.editing=void 0}
              @saved=${()=>{this.editing=void 0,this.changed();}}
            ></alarmo-ext-rule-editor>
          `:Y}
        ${this.open?Z`
              <div class="card-content desc">
                <p>A rule says: <em>zones with label X (and/or in area Y, on floor Z) get partition P, these Arm Modes and
                  these options</em>.</p>
                <ul>
                  <li>Rules never change anything by themselves: the results show as pending changes in the zone
                    assignments below, and you Apply them.</li>
                  <li>A value you change by hand becomes an override that the rules leave alone.</li>
                  <li>Rules are optional — zones you set up by hand keep working.</li>
                </ul>
              </div>
              ${this.error?Z`<div class="notice error">${this.error}</div>`:Y}
              ${i.length?Z`<div class="notice warn">
                    Some rules refer to labels, areas or floors that no longer exist (those conditions are ignored):
                    ${i.map(e=>Z`<div>${e.name}: ${e.kind.slice(0,-1)} <code>${e.ref}</code></div>`)}
                  </div>`:Y}
              ${s.length?Z`
                    <div class="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th class="c">On</th>
                            <th>Rule</th>
                            <th>Matches</th>
                            <th>Sets</th>
                            <th class="c">Zones</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          ${s.map(e=>Z`
                              <tr class=${e.enabled?"":"status-removed"}>
                                <td class="c">
                                  <ha-switch
                                    aria-label=${`Enable ${e.name}`}
                                    .checked=${e.enabled}
                                    @change=${t=>this.toggleRule(e,t.target.checked)}
                                  ></ha-switch>
                                </td>
                                <td class="name">${e.name}</td>
                                <td style="white-space:normal">${((e,t)=>{const a=[];return e.labels.length&&a.push(`Label ${yd(e.labels,t.labels).join(" and ")}`),e.areas.length&&a.push(`Area ${yd(e.areas,t.areas).join(" or ")}`),e.floors.length&&a.push(`Floor ${yd(e.floors,t.floors).join(" or ")}`),a.join(" · ");})(e.match,this.registry)}</td>
                                <td style="white-space:normal">${((e,t,a=e=>e)=>Object.entries(e).map(([e,i])=>{const s=gd[e]||e;return"partition"===e?`${s} ${t[i]||i}`:Array.isArray(i)?`${s} ${i.length?i.map(a).join(", "):"none"}`:"boolean"==typeof i?`${s} ${i?"on":"off"}`:`${s} ${null===i?"default":i}`;}).join(" · "))(e.set,a,this.modeLabel)}</td>
                                <td class="c">${e.enabled?t[e.id]||0:"—"}</td>
                                <td>
                                  <ha-icon-button .path=${Ks} .label=${"Edit rule"} @click=${()=>this.editing=e}></ha-icon-button>
                                  <ha-icon-button .path=${qs} .label=${"Delete rule"} @click=${()=>this.removeRule(e)}></ha-icon-button>
                                </td>
                              </tr>
                            `)}
                        </tbody>
                      </table>
                    </div>
                  `:Z`<div class="empty">
                    No rules yet. Rules are optional: zones you set up by hand keep working as before.
                  </div>`}
            `:Y}
      </ha-card>
    `;}changed(){this.dispatchEvent(new CustomEvent("rules-changed"));}async toggleRule(e,t){this.error="";try{await pd(this.hass,Object.assign(Object.assign({},e),{enabled:t})),this.changed();}catch(e){this.error=Nn(e);}}async removeRule(e){if(window.confirm(`Delete the rule "${e.name}"? Zones keep their current settings.`)){this.error="";try{await(t=this.hass,a=e.id,t.callWS({type:"alarmo/ext/rules/delete",rule_id:a})),this.changed();}catch(e){this.error=Nn(e);}var t,a;}}};zd.styles=Kn,s([ye({attribute:!1})],zd.prototype,"hass",void 0),s([ye({attribute:!1})],zd.prototype,"rules",void 0),s([ye({attribute:!1})],zd.prototype,"preview",void 0),s([ye({attribute:!1})],zd.prototype,"registry",void 0),s([ye({attribute:!1})],zd.prototype,"partitions",void 0),s([be()],zd.prototype,"editing",void 0),s([be()],zd.prototype,"open",void 0),s([be()],zd.prototype,"error",void 0),zd=s([ue("alarmo-ext-rules-card")],zd);let Ad=class extends pe{constructor(){super(...arguments),this.current={},this.partitionNames={},this.blockedReason="",this.busy=!1,this.error="";}name(e){const t=this.hass.states[e];return t&&t.attributes.friendly_name||e;}value(e,t){return"area"===e?this.partitionNames[t]||t:(e=>null==e?"—":Array.isArray(e)?e.join(", ")||"none":String(e))(t);}render(){const e=this.preview,t=t=>t.map(t=>e.rule_names[t]||t).join(", ");return Z`
      <div class="overlay" @click=${e=>e.target===e.currentTarget&&!this.busy&&this.close()}>
        <div class="modal" role="dialog" aria-label="Pending rule changes">
          <h2>Pending rule changes (${e.total_changes})</h2>
          <div class="body">
            ${e.create.length?Z`<h3 style="font-weight:500">New zones (${e.create.length})</h3>
                  ${e.create.map(e=>Z`<div class="status-icon new">
                      + ${this.name(e.entity_id)} <span class="secondary" style="display:inline">${e.entity_id}</span>
                      — ${Object.entries(e).filter(([e])=>"entity_id"!==e).map(([e,t])=>`${e}: ${this.value(e,t)}`).join(" · ")}
                    </div>`)}`:Y}
            ${e.update.length?Z`<h3 style="font-weight:500">Changed zones (${e.update.length})</h3>
                  ${e.update.map(a=>{var i;return Z`<div style="margin:4px 0">
                      <span class="status-icon changed">✎ ${this.name(a.entity_id)}</span>
                      <span class="secondary" style="display:inline">${a.entity_id} · ${t((null===(i=e.zones[a.entity_id])||void 0===i?void 0:i.rules)||[])}</span>
                      <ul style="margin:2px 0">
                        ${Object.entries(a.changes).map(([e,t])=>Z`<li><code>${e}</code>: ${this.value(e,(this.current[a.entity_id]||{})[e])} →
                              <strong>${this.value(e,t)}</strong></li>`)}
                      </ul>
                    </div>`;})}`:Y}
            ${e.total_changes?Y:Z`<div class="notice">Zones already match the rules.</div>`}
            ${e.conflicts.length?Z`<div class="notice error" style="margin:8px 0">
                  <strong>Conflicts (not applied):</strong>
                  ${e.conflicts.map(e=>Z`<div>${this.name(e.entity_id)} — <code>${e.field}</code>:
                      ${e.reason||`rules ${t(e.rules)} disagree (${e.values.map(t=>this.value(e.field,t)).join(" vs ")})`}</div>`)}
                  <div class="secondary" style="display:block">Make one rule more specific, or set the value by hand in the table (an override).</div>
                </div>`:Y}
            ${e.needs_partition.length?Z`<div class="notice warn" style="margin:8px 0">
                  Matched but not added — no rule sets their partition:
                  ${e.needs_partition.map(e=>Z`<div>${this.name(e)} <code>${e}</code></div>`)}
                </div>`:Y}
            <p class="secondary" style="display:block">
              Rules never remove zones. ${e.unmanaged.length} configured zone(s) are not matched by any rule and are left as they are.
              Applying makes a backup first.
            </p>
            ${this.blockedReason?Z`<div class="notice warn" style="margin:8px 0">${this.blockedReason}</div>`:Y}
            ${this.error?Z`<div class="notice error" style="margin:8px 0;white-space:pre-line">${this.error}</div>`:Y}
          </div>
          <div class="footer">
            <ha-button appearance="plain" ?disabled=${this.busy} @click=${this.close}>Close</ha-button>
            <ha-button ?disabled=${this.busy||!e.total_changes||!!this.blockedReason} @click=${this.apply}>
              ${this.busy?"Applying…":`Apply ${e.total_changes} change(s)`}
            </ha-button>
          </div>
        </div>
      </div>
    `;}async apply(){this.busy=!0,this.error="";try{const a=await(e=this.hass,t=this.preview.token,e.callWS({type:"alarmo/ext/rules/apply",token:t}));this.dispatchEvent(new CustomEvent("applied",{detail:a}));}catch(e){this.error=Nn(e);}finally{this.busy=!1;}var e,t;}close(){this.dispatchEvent(new CustomEvent("close"));}};Ad.styles=Kn,s([ye({attribute:!1})],Ad.prototype,"hass",void 0),s([ye({attribute:!1})],Ad.prototype,"preview",void 0),s([ye({attribute:!1})],Ad.prototype,"current",void 0),s([ye({attribute:!1})],Ad.prototype,"partitionNames",void 0),s([ye()],Ad.prototype,"blockedReason",void 0),s([be()],Ad.prototype,"busy",void 0),s([be()],Ad.prototype,"error",void 0),Ad=s([ue("alarmo-ext-rules-preview")],Ad);const xd="alarmo-ext-sensor-table-draft",jd=[cn.ArmedAway,cn.ArmedHome,cn.ArmedNight,cn.ArmedVacation,cn.ArmedCustom],Sd=Object.values(rn),Od=[["enabled","Enabled"],["always_on","Always on"],["use_entry_delay","Use entry delay"],["use_exit_delay","Use exit delay"],["allow_open","Allow open initially"],["arm_on_close","Arm after closing"],["trigger_unavailable","Trigger when unavailable"],["auto_bypass","Auto-bypass"]],Cd=[["always_on","mdi:shield-alert","Always on"],["auto_bypass","mdi:debug-step-over","Auto-bypass"],["allow_open","mdi:door-open","Allow open initially"],["arm_on_close","mdi:door-closed-lock","Arm after closing"],["trigger_unavailable","mdi:lan-disconnect","Trigger when unavailable"]],Td={panel:"set off the alarm",notify:"notify only",none:"nothing extra"},Ed={panel:"mdi:bullhorn",notify:"mdi:bell-outline",none:"mdi:bell-off-outline"},Md=["mdi:timer-off-outline","No entry delay (instant)"],Ld={armed_away:"mdi:lock",armed_home:"mdi:home",armed_night:"mdi:weather-night",armed_vacation:"mdi:airplane",armed_custom_bypass:"mdi:shield"},Nd={door:"#1e88e5",window:"#00897b",motion:"#8e24aa",tamper:"#6d4c41",environmental:"#e53935",other:"#757575"},Hd=[{id:"modes",label:"Arm Modes",fields:["modes"]},{id:"type",label:"Zone type",fields:["type"]},{id:"area",label:"Partition",fields:["area"]},{id:"options",label:"Options and delays",fields:["always_on","use_entry_delay","use_exit_delay","allow_open","arm_on_close","trigger_unavailable","auto_bypass","auto_bypass_modes","entry_delay","delay_on"]}];let Dd=class extends Le(pe){constructor(){super(...arguments),this.narrow=!1,this.areas={},this.groups={},this.loaded=!1,this.selection=[],this.expanded=[],this.filters={search:"",area:"",mode:"",type:"",status:""},this.saving=!1,this.error="",this.restoredCount=0,this.showAdd=!1,this.copyFrom=null,this.tripDraft={},this.copyGroups=["modes","options"],this.rev=0,this.rules=[],this.registry={labels:{},areas:{},floors:{}},this.showRulesPreview=!1,this.showHelp=!1,this.locked=!0,this.draft=new Io(),this.bulkMode=cn.ArmedAway,this.beforeUnload=e=>{this.draft.isDirty()&&(e.preventDefault(),e.returnValue="");};}hasUnsavedChanges(){return this.draft.isDirty();}firstUpdated(){var e;const t=(null===(e=this.path)||void 0===e?void 0:e.filter)||{};(t.area||t.mode)&&(this.filters=Object.assign(Object.assign({},this.filters),{area:t.area||"",mode:t.mode||""}));}connectedCallback(){super.connectedCallback(),window.addEventListener("beforeunload",this.beforeUnload);}disconnectedCallback(){window.removeEventListener("beforeunload",this.beforeUnload),super.disconnectedCallback();}hassSubscribe(){return this.fetchData(),[this.hass.connection.subscribeMessage(()=>this.fetchData(),{type:"alarmo_config_updated"})];}async fetchData(){if(this.hass)try{const[e,t,a]=await Promise.all([$e(this.hass),Ee(this.hass),xe(this.hass)]);this.areas=t,this.groups=a,this.draft.setSaved(e),await this.fetchRules(),await this.fetchPanelInfo(),this.loaded||(this.loaded=!0,this.restoreDraft()),this.rev++;}catch(e){this.error=Nn(e);}}async fetchPanelInfo(){try{const e=this.panel?this.tripChanges():0;this.panel=await Jo(this.hass),e||(this.tripDraft=Object.assign({},this.panel.settings.zone_trip));}catch(e){this.panel=void 0;}}panelWatched(e){return!!this.panel&&this.panel.panels.some(t=>t.zones.some(t=>t.entity_id===e||sd(t.entity_id)===e));}tripChanges(){if(!this.panel)return 0;const e=this.panel.settings.zone_trip;return[...new Set([...Object.keys(e),...Object.keys(this.tripDraft)])].filter(t=>(e[t]||null)!==(this.tripDraft[t]||null)).length;}tripDefault(){return this.panel&&this.panel.settings.monitored?"notify":"panel";}setTrip(e,t){const a=Object.assign({},this.tripDraft);"default"===t?delete a[e]:a[e]=t,this.tripDraft=a;}async fetchRules(){try{const[t,a,i]=await Promise.all([(e=this.hass,e.callWS({type:"alarmo/ext/rules/list"})),md(this.hass),ud(this.hass)]);this.rules=t.rules,this.rulesPreview=a,this.registry=i;}catch(e){this.rulesPreview=void 0,this.error=`Zone rules unavailable: ${Nn(e)}`;}var e;}source(e,t){var a,i;return null===(i=null===(a=this.rulesPreview)||void 0===a?void 0:a.zones[e])||void 0===i?void 0:i.sources[t];}conflict(e,t){var a,i;return((null===(i=null===(a=this.rulesPreview)||void 0===a?void 0:a.zones[e])||void 0===i?void 0:i.conflicts)||[]).find(e=>e.field===t);}ruleNames(e){return e.map(e=>{var t;return(null===(t=this.rulesPreview)||void 0===t?void 0:t.rule_names[e])||e;}).join(", ");}sourceMark(e,t){const a=this.source(e,t);return a&&"new"!==this.draft.rowStatus(e)?"override"===a.kind?Z`<ha-svg-icon
        class="src override"
        role="button"
        tabindex="0"
        .path=${"M21.7,13.35L20.7,14.35L18.65,12.3L19.65,11.3C19.86,11.09 20.21,11.09 20.42,11.3L21.7,12.58C21.91,12.79 21.91,13.14 21.7,13.35M12,18.94L18.06,12.88L20.11,14.93L14.06,21H12V18.94M12,14C7.58,14 4,15.79 4,18V20H10V18.11L14,14.11C13.34,14.03 12.67,14 12,14M12,4A4,4 0 0,0 8,8A4,4 0 0,0 12,12A4,4 0 0,0 16,8A4,4 0 0,0 12,4Z"}
        title=${`Manual override${a.rules.length?` of rule ${this.ruleNames(a.rules)}`:""} — click to clear (the rule value comes back on the next Apply)`}
        @click=${()=>this.clearOverride(e,t)}
        @keydown=${a=>"Enter"===a.key&&this.clearOverride(e,t)}
      ></ha-svg-icon>`:Z`<ha-svg-icon class="src rule" .path=${Es} title=${`Set by rule: ${this.ruleNames(a.rules)}`}></ha-svg-icon>`:Y;}srcClass(e,t){return this.conflict(e,t)?"conflict":"";}async clearOverride(e,t){if(window.confirm(`Clear the manual override of "${t}" for ${this.name(e)}? The rule value is applied on the next Apply.`))try{await((e,t,a)=>e.callWS(Object.assign({type:"alarmo/ext/overrides/clear",entity_id:t},a?{field:a}:{})))(this.hass,e,t),await this.fetchRules();}catch(e){this.error=Nn(e);}}renderRulesBar(){const e=this.rulesPreview;if(!e||!e.total_changes&&!e.conflicts.length&&!e.needs_partition.length)return Y;const t=[e.total_changes?`${e.total_changes} pending rule change${1===e.total_changes?"":"s"}`:"",e.conflicts.length?`${e.conflicts.length} conflict${1===e.conflicts.length?"":"s"}`:"",e.needs_partition.length?`${e.needs_partition.length} matched without a partition`:""].filter(Boolean);return Z`
      <div class="notice ${e.conflicts.length?"error":"warn"}" role="region" aria-label="Pending rule changes">
        <ha-svg-icon .path=${Es} style="width:18px;height:18px;vertical-align:middle"></ha-svg-icon>
        Zone rules: ${t.join(" · ")}.
        <button class="link" @click=${()=>this.showRulesPreview=!0}>Preview${e.total_changes?" & apply":""}</button>
        ${e.conflicts.length?Z`<div style="margin-top:4px">
              ${e.conflicts.map(e=>Z`<div>⚠ ${this.name(e.entity_id)} — <code>${e.field}</code>: ${e.reason||`rules ${this.ruleNames(e.rules)} disagree`}</div>`)}
            </div>`:Y}
      </div>
    `;}restoreDraft(){try{const e=window.sessionStorage.getItem(xd);if(!e)return;this.draft.loadSnapshot(JSON.parse(e)),this.restoredCount=this.draft.changeCount(),this.restoredCount||window.sessionStorage.removeItem(xd);}catch(e){window.sessionStorage.removeItem(xd);}}persist(){try{this.draft.isDirty()?window.sessionStorage.setItem(xd,JSON.stringify(this.draft.snapshot())):window.sessionStorage.removeItem(xd);}catch(e){}}edit(e){e(),this.persist(),this.rev++;}visibleModes(){const e=new Set();return Object.values(this.areas).forEach(t=>Object.entries(t.modes||{}).forEach(([t,a])=>a&&a.enabled&&e.add(t))),this.draft.ids().forEach(t=>{var a;return((null===(a=this.draft.get(t))||void 0===a?void 0:a.modes)||[]).forEach(t=>e.add(t));}),jd.filter(t=>e.has(t));}modeEnabledInArea(e,t){const a=e?this.areas[e]:void 0;return!!a&&!!a.modes&&!!a.modes[t]&&a.modes[t].enabled;}name(e){const t=this.hass.states[e];return t?un(t):e;}modeLabel(e){const t=Cs(`common.modes_short.${e}`,this.hass.language)||e;return e===cn.ArmedHome&&"Home"===t?"Home (Stay)":t;}typeLabel(e){return Cs(`panels.sensors.cards.editor.fields.device_type.choose.${e}.name`,this.hass.language)||e;}rows(){const e=this.filters,t=e.search.trim().toLowerCase();return this.draft.ids().filter(a=>{const i=this.draft.get(a);if(t&&!a.toLowerCase().includes(t)&&!this.name(a).toLowerCase().includes(t))return!1;if("__none__"===e.area){if(i.area&&this.areas[i.area])return!1;}else if(e.area&&i.area!==e.area)return!1;if("__none__"===e.mode){if((i.modes||[]).length||i.always_on)return!1;}else if(e.mode&&!(i.modes||[]).includes(e.mode))return!1;return(!e.type||i.type===e.type)&&("unsaved"!==e.status||"unchanged"!==this.draft.rowStatus(a))&&("disabled"!==e.status||!1===i.enabled)&&("missing"!==e.status||!this.hass.states[a]);}).sort((e,t)=>{var a,i;const s=(null===(a=this.areas[this.draft.get(e).area])||void 0===a?void 0:a.name)||"~",n=(null===(i=this.areas[this.draft.get(t).area])||void 0===i?void 0:i.name)||"~";return s.localeCompare(n)||this.name(e).localeCompare(this.name(t));});}render(){if(!this.hass)return Y;if(!this.loaded)return Z`
        <ha-card><div class="empty">${this.error||"Loading…"}</div></ha-card>
      `;this.rev;const e=this.rows(),t=this.visibleModes(),a=this.draft.changeCount()+this.tripChanges(),i=e.length>0&&e.every(e=>this.selection.includes(e)),s=hd(Object.values(this.areas).map(e=>[e.area_id,e.name]));return Z`
      <alarmo-ext-rules-card
        .hass=${this.hass}
        .rules=${this.rules}
        .preview=${this.rulesPreview}
        .registry=${this.registry}
        .partitions=${this.areas}
        @rules-changed=${()=>this.fetchRules()}
      ></alarmo-ext-rules-card>
      ${this.showRulesPreview&&this.rulesPreview?Z`
            <alarmo-ext-rules-preview
              .hass=${this.hass}
              .preview=${this.rulesPreview}
              .current=${hd(this.draft.ids().filter(e=>this.draft.isSaved(e)).map(e=>[e,this.draft.get(e)]))}
              .partitionNames=${s}
              .blockedReason=${a?"Save or discard your unsaved changes on this page first.":""}
              @close=${()=>this.showRulesPreview=!1}
              @applied=${this.rulesApplied}
            ></alarmo-ext-rules-preview>
          `:Y}
      <ha-card>
        ${Qn("Zone Assignments","settings")}
        <div class="card-content desc">
          <p><strong>The main place for zones.</strong> Every zone Alarmo watches, with its partition, the Arm Modes it
            is active in, its zone type and its options. Hover a column title for help; click a zone's icon for its details.</p>
          <p><strong>Unlock to edit</strong> (button above the table). Changes stay drafts until you click Save — a
            backup is made first. Edited zones get a yellow icon, new ones green, removed ones red.</p>
          <ul>
            <li>Add zones with <em>Add zones</em>, or from your physical panel on the Physical Panel tab.</li>
            <li>What a zone that only Home Assistant watches does when it trips: open the zone (›) → <em>When tripped</em>; the default is on <a href="/alarmo/panel">Physical Panel</a>.</li>
            <li>Mirrors of physical panel zones: <a href="/alarmo/panel">Physical Panel → Panel zones</a>.</li>
          </ul>
        </div>
        ${this.renderRulesBar()}
        ${this.restoredCount?Z`
              <div class="notice warn">
                Restored ${this.restoredCount} unsaved change${1===this.restoredCount?"":"s"} from your last
                visit. Save or discard them below.
                <button class="link" @click=${()=>this.restoredCount=0}>Dismiss</button>
              </div>
            `:Y}
        ${this.error?Z`
              <div class="notice error" style="white-space:pre-line">
                ${this.error}
                <button class="link" @click=${()=>this.error=""}>Dismiss</button>
              </div>
            `:Y}
        <div class="toolbar">
          ${Jn(this.locked,()=>{this.locked=!this.locked,this.locked&&(this.selection=[]);})}
          <ha-button @click=${()=>this.showAdd=!0}>
            <ha-svg-icon slot="start" .path=${"M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"}></ha-svg-icon>Add zones
          </ha-button>
          <span class="grow"></span>
          <span class="secondary" style="display:inline">${e.length} of ${this.draft.ids().length} zones shown</span>
        </div>
        ${this.renderFilters()} ${this.showHelp?this.renderHelp():Y}
        ${this.selection.length&&!this.locked?this.renderBulkBar():Y}
        <div class="table-wrap">
          <table class="full">
            <thead>
              <tr>
                <th class="c">
                  <input
                    type="checkbox"
                    aria-label="Select all shown"
                    ?disabled=${this.locked}
                    .checked=${i}
                    @change=${t=>this.selectRows(e,t.target.checked)}
                  />
                </th>
                <th class="icon"></th>
                <th class="help" title=${od("zone")}>Zone</th>
                <th class="help c" title="Live state of the zone; red when it blocks arming">State</th>
                <th class="help" title=${od("type")}>Type</th>
                ${this.multiPartition?Z`<th class="help" title=${od("area")}>Partition</th>`:Y}
                ${t.map(e=>Z`<th class="c mode help" title=${`${this.modeLabel(e)} — ${od("modes")}`}><ha-icon icon=${Ld[e]}></ha-icon></th>`)}
                <th class="help" title="Options: hover an icon; edit them in the expanded row (›)">Options</th>
                <th></th>
                <th class="fill" aria-hidden="true"></th>
              </tr>
            </thead>
            <tbody>
              ${e.map(e=>this.renderRow(e,t))}
            </tbody>
          </table>
          ${e.length?Y:Z`<div class="empty">${this.draft.ids().length?"No zones match the filters.":"No zones configured yet."}</div>`}
        </div>

      </ha-card>
      ${a?this.renderSaveBar(a):Y}
      ${this.showAdd?Z`
            <alarmo-ext-add-sensors
              .hass=${this.hass}
              .areas=${this.areas}
              .exclude=${this.draft.ids()}
              .defaultArea=${this.filters.area&&this.areas[this.filters.area]?this.filters.area:""}
              @close=${()=>this.showAdd=!1}
              @sensors-picked=${this.addPicked}
            ></alarmo-ext-add-sensors>
          `:Y}
    `;}renderFilters(){const e=this.filters,t=e=>t=>this.filters=Object.assign(Object.assign({},this.filters),{[e]:t.target.value});return Z`
      <div class="toolbar">
        <input type="search" placeholder="Search zones" aria-label="Search zones" .value=${e.search} @input=${t("search")} />
        <select aria-label="Filter by partition" @change=${t("area")}>
          <option value="" ?selected=${!e.area}>All partitions</option>
          ${Object.values(this.areas).map(t=>Z`<option value=${t.area_id} ?selected=${e.area===t.area_id}>${t.name}</option>`)}
          <option value="__none__" ?selected=${"__none__"===e.area}>No / unknown partition</option>
        </select>
        <select aria-label="Filter by arm mode" @change=${t("mode")}>
          <option value="" ?selected=${!e.mode}>All arm modes</option>
          ${jd.map(t=>Z`<option value=${t} ?selected=${e.mode===t}>${this.modeLabel(t)}</option>`)}
          <option value="__none__" ?selected=${"__none__"===e.mode}>No arm mode (inactive)</option>
        </select>
        <select aria-label="Filter by zone type" @change=${t("type")}>
          <option value="" ?selected=${!e.type}>All zone types</option>
          ${Sd.map(t=>Z`<option value=${t} ?selected=${e.type===t}>${this.typeLabel(t)}</option>`)}
        </select>
        <select aria-label="Filter by status" @change=${t("status")}>
          <option value="" ?selected=${!e.status}>Any status</option>
          <option value="unsaved" ?selected=${"unsaved"===e.status}>Unsaved changes</option>
          <option value="disabled" ?selected=${"disabled"===e.status}>Disabled</option>
          <option value="missing" ?selected=${"missing"===e.status}>Entity missing in HA</option>
        </select>
        <span class="grow"></span>
        <button class="link" aria-expanded=${this.showHelp} @click=${()=>this.showHelp=!this.showHelp}>
          ⓘ ${this.showHelp?"Hide help":"What do these columns mean?"}
        </button>
        ${e.search||e.area||e.mode||e.type||e.status?Z`<button class="link" @click=${()=>this.filters={search:"",area:"",mode:"",type:"",status:""}}>Clear filters</button>`:Y}
      </div>
    `;}renderHelp(){return Z`
      <div class="notice help-panel" role="region" aria-label="Help">
        <p style="margin:0 0 6px">
          Hover over a column title, checkbox or option to see this text. Options without a column are in the
          expanded row: click › at the end of a zone's row.
        </p>
        <dl class="help-rows">
          ${["modes","area","type","enabled","always_on","use_entry_delay","use_exit_delay","auto_bypass","auto_bypass_modes","allow_open","arm_on_close","trigger_unavailable","entry_delay","delay_on","group"].map(e=>Z`<div><dt>${rd[e].title}</dt><dd>${rd[e].text}</dd></div>`)}
        </dl>
      </div>
    `;}renderBulkBar(){const e=this.selection;return Z`
      <div class="bulkbar" role="toolbar" aria-label="Bulk actions">
        <strong>${e.length} selected</strong>
        <select aria-label="Set partition for selected" @change=${e=>this.bulkSet("area",e)}>
          <option value="">Set partition…</option>
          ${Object.values(this.areas).map(e=>Z`<option value=${e.area_id}>${e.name}</option>`)}
        </select>
        <select aria-label="Set zone type for selected" @change=${e=>this.bulkSet("type",e)}>
          <option value="">Set zone type…</option>
          ${Sd.map(e=>Z`<option value=${e}>${this.typeLabel(e)}</option>`)}
        </select>
        <select aria-label="Arm mode for selected" @change=${e=>this.bulkMode=e.target.value}>
          ${jd.map(e=>Z`<option value=${e} ?selected=${this.bulkMode===e}>${this.modeLabel(e)}</option>`)}
        </select>
        <ha-button appearance="plain" @click=${()=>this.edit(()=>this.draft.toggleModeMany(e,this.bulkMode,!0))}>
          Add mode
        </ha-button>
        <ha-button appearance="plain" @click=${()=>this.edit(()=>this.draft.toggleModeMany(e,this.bulkMode,!1))}>
          Remove mode
        </ha-button>
        <ha-button appearance="plain" @click=${()=>this.edit(()=>this.draft.setFieldMany(e,"enabled",!0))}>
          Enable
        </ha-button>
        <ha-button appearance="plain" @click=${()=>this.edit(()=>this.draft.setFieldMany(e,"enabled",!1))}>
          Disable
        </ha-button>
        <ha-button appearance="plain" variant="danger" @click=${()=>this.edit(()=>this.draft.removeMany(e))}>
          Delete from Alarmo
        </ha-button>
        <button class="link" @click=${()=>this.selection=[]}>Clear selection</button>
      </div>
    `;}cellClass(e,t,a=""){return`${a} ${this.draft.isFieldChanged(e,t)?"changed":""}`;}mark(e){return e?Z`<ha-svg-icon class="mark" .path=${Zs} title="Unsaved change"></ha-svg-icon>`:Y;}get multiPartition(){return Object.keys(this.areas).length>1;}chip(e,t,a=!1){return Z`<span class="chip-cell ${a?"changed":""}" style=${`--chip:${t}`}>${e}</span>`;}liveCell(e,t){var a;const i=Fo(null===(a=this.hass.states[e])||void 0===a?void 0:a.state),s=jd.filter(e=>this.modeEnabledInArea(t.area,e)),n=((e,t,a)=>!1===e.enabled?[]:"open"===t||"unavailable"===t&&e.trigger_unavailable?"motion"===e.type?[]:a.filter(a=>((e.modes||[]).includes(a)||e.always_on)&&!(e.auto_bypass&&(e.auto_bypass_modes||[]).includes(a))&&!(e.allow_open&&"open"===t)):[])(t,i,s);return Yo(i,{blocks:n.length>0,title:n.length?`Open: blocks arming ${n.map(e=>this.modeLabel(e)).join(", ")} (see Arm Check)`:i});}renderRow(e,t){const a=this.draft.get(e),i=this.draft.rowStatus(e),s="removed"===i||this.locked,n=this.expanded.includes(e),r=a.area&&this.areas[a.area],o=!1===a.enabled,d=this.draft.isFieldChanged(e,"type"),l=this.draft.isFieldChanged(e,"area"),c=Cd.filter(([e])=>a[e]),h=!a.always_on&&!1===a.use_entry_delay,p=!!this.panel&&(this.panel.settings.zone_trip[e]||null)!==(this.tripDraft[e]||null)||[...Cd.map(e=>e[0]),"use_entry_delay","use_exit_delay","entry_delay","delay_on","auto_bypass_modes","group","enabled"].some(t=>this.draft.isFieldChanged(e,t)),m=t.length+(this.multiPartition?9:8);return Z`
      <tr class="status-${i} ${o?"zone-disabled":""}">
        <td class="c">
          <input
            type="checkbox"
            aria-label=${`Select ${this.name(e)}`}
            ?disabled=${this.locked}
            .checked=${this.selection.includes(e)}
            @change=${t=>this.selectRows([e],t.target.checked)}
          />
        </td>
        <td class="icon">
          <span class="icon-stack">
            ${Xn(this.hass,e,i)}
            ${o||!this.locked?Z`<button
                  class="eye ${o?"off":""}"
                  ?disabled=${s}
                  title=${o?"Disabled — click to enable (unlock first)":"Enabled — click to disable"}
                  aria-label=${o?`Enable ${this.name(e)}`:`Disable ${this.name(e)}`}
                  @click=${()=>this.setField(e,"enabled",o)}
                ><ha-icon icon=${o?"mdi:eye-off":"mdi:eye-outline"}></ha-icon></button>`:Y}
          </span>
        </td>
        <td class="name">
          ${this.name(e)}
          ${this.source(e,"modes")?Z`<span class="modes-src" title=${this.modesTitle(e)}>modes ${this.sourceMark(e,"modes")}</span>`:Y}
          <span class="secondary">${e}${this.hass.states[e]?"":" · not found in Home Assistant"}</span>
        </td>
        <td class="c">${this.liveCell(e,a)}</td>
        <td class="${this.srcClass(e,"type")}">
          ${this.locked?this.chip(this.typeLabel(a.type),Nd[a.type]||Nd.other,d):Z`<select aria-label="Zone type" class=${d?"changed-inline":""} ?disabled=${s} @change=${t=>this.setField(e,"type",t.target.value)}>
                ${Sd.map(e=>Z`<option value=${e} ?selected=${a.type===e}>${this.typeLabel(e)}</option>`)}
              </select>`}
          ${this.sourceMark(e,"type")}
        </td>
        ${this.multiPartition?Z`<td class="${this.srcClass(e,"area")}">
              ${this.locked?this.chip(r?this.areas[a.area].name:"— none —",r?"var(--primary-color)":"var(--error-color, #f44336)",l):Z`<select aria-label="Partition" class=${l?"changed-inline":""} ?disabled=${s} @change=${t=>this.setField(e,"area",t.target.value)}>
                    ${r?Y:Z`<option value="" selected>— choose —</option>`}
                    ${Object.values(this.areas).map(e=>Z`<option value=${e.area_id} ?selected=${a.area===e.area_id}>${e.name}</option>`)}
                  </select>`}
              ${this.sourceMark(e,"area")}
            </td>`:Y}
        ${t.map(t=>{var n;const r=(a.modes||[]).includes(t),o=this.modeEnabledInArea(a.area,t),d="changed"===i&&this.draft.isModeChanged(e,t);return Z`
            <td
              class="c mode ${d?"changed":""} ${this.srcClass(e,"modes")} ${"override"===(null===(n=this.source(e,"modes"))||void 0===n?void 0:n.kind)?"override-cell":""}"
              title=${`${this.modeLabel(t)}: ${r?"active":"not active"}${o?"":" — this arm mode is not enabled in the zone’s partition"}`}
            >
              ${this.locked?Z`<ha-icon class="mode-dot ${r?"on":""}" icon=${r?"mdi:check-circle":"mdi:circle-small"}></ha-icon>`:Z`<ha-checkbox
                    aria-label=${`${this.modeLabel(t)} mode`}
                    .checked=${r}
                    ?disabled=${s||!o&&!r}
                    @change=${a=>this.edit(()=>this.draft.toggleMode(e,t,a.target.checked))}
                  ></ha-checkbox>`}
            </td>
          `;})}
        <td class="opts ${p?"changed":""}">
          ${c.map(([e,t,a])=>Z`<ha-icon icon=${t} title=${`${a}: ${od(e)}`}></ha-icon>`)}
          ${h?Z`<ha-icon icon=${Md[0]} title=${Md[1]}></ha-icon>`:Y}
          ${null!==a.entry_delay&&void 0!==a.entry_delay?Z`<span class="opt-num" title="Entry delay override">${a.entry_delay}s</span>`:Y}
          ${this.tripDraft[e]&&!this.panelWatched(e)?Z`<ha-icon icon=${Ed[this.tripDraft[e]]} title=${`When tripped: ${Td[this.tripDraft[e]]}`}></ha-icon>`:Y}
        </td>
        <td class="row-actions">
          <ha-icon-button
            .path=${n?Ns:Hs}
            .label=${n?"Hide zone settings":"Zone settings"}
            @click=${()=>this.expanded=n?this.expanded.filter(t=>t!==e):[...this.expanded,e]}
          ></ha-icon-button>
          ${"unchanged"===i||this.locked?Y:Z`<ha-icon-button .path=${"M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z"} .label=${"new"===i?"Cancel adding":"Undo changes"} @click=${()=>this.edit(()=>this.draft.revertRow(e))}></ha-icon-button>`}
        </td>
        <td class="fill"></td>
      </tr>
      ${n?this.renderDetail(e,a,m):Y}
    `;}renderDetail(e,t,a){const i="removed"===this.draft.rowStatus(e)||this.locked,s=t=>this.draft.isFieldChanged(e,t)?"changed-inline":"",n=(a,n,r)=>Z`
      <div class="field ${s(a)}" title=${od(a)}>
        <alarmo-ext-slider
          .label=${n}
          .value=${void 0===t[a]?null:t[a]}
          .min=${0}
          .max=${r}
          .unit=${"s"}
          .onValue=${30}
          optional
          offText="partition default"
          ?disabled=${i}
          @value-changed=${t=>this.setField(e,a,t.detail.value)}
        ></alarmo-ext-slider>
      </div>
    `,r=this.copyFrom===e,o=this.selection.filter(t=>t!==e&&"removed"!==this.draft.rowStatus(t));return Z`
      <tr class="detail">
        <td colspan=${a}>
          ${this.locked?Z`<div class="locked-note">Unlock the table to change these settings.</div>`:Y}
          <div class="zone-editor">
            <div class="col">
              <h4 class="subhead">Options</h4>
              ${Od.map(([a,n])=>Z`
                  <label class="field ${s(a)}" title=${od(a)}>
                    <span>${n}</span>
                    <ha-switch .checked=${"enabled"===a?!1!==t.enabled:!!t[a]} ?disabled=${i}
                      @change=${t=>this.setField(e,a,t.target.checked)}></ha-switch>
                  </label>
                `)}
            </div>
            <div class="col">
              <h4 class="subhead">Delays and grouping</h4>
              ${n("entry_delay","Entry delay override",300)} ${n("delay_on","Delay on",600)}
              <label class="field ${s("group")}" title=${od("group")}>
                <span>Cross-zone group</span>
                <select aria-label="Cross-zone group" ?disabled=${i} @change=${t=>this.setField(e,"group",t.target.value||null)}>
                  <option value="" ?selected=${!t.group}>None</option>
                  ${Object.values(this.groups).map(e=>Z`<option value=${e.group_id} ?selected=${t.group===e.group_id}>${e.name}</option>`)}
                </select>
              </label>
              ${t.auto_bypass?Z`<div class="field ${s("auto_bypass_modes")}" title=${od("auto_bypass_modes")}>
                    <span>Bypass in</span>
                    <span class="mode-picks">
                      ${jd.filter(e=>this.modeEnabledInArea(t.area,e)||(t.auto_bypass_modes||[]).includes(e)).map(a=>Z`<label><ha-checkbox .checked=${(t.auto_bypass_modes||[]).includes(a)} ?disabled=${i}
                          @change=${t=>this.edit(()=>this.draft.toggleMode(e,a,t.target.checked,"auto_bypass_modes"))}></ha-checkbox>${this.modeLabel(a)}</label>`)}
                    </span>
                  </div>`:Y}
              ${this.renderTripField(e,i)}
              ${this.multiPartition?Y:Z`<div class="field"><span>Partition</span><span>${t.area&&this.areas[t.area]?this.areas[t.area].name:"— none —"}</span></div>`}
              <div class="copy">
                ${r?Z`<div class="notice" style="margin:0">
                      <strong>Copy settings of this zone</strong>
                      <div class="mode-picks">
                        ${Hd.map(e=>Z`<label><ha-checkbox .checked=${this.copyGroups.includes(e.id)}
                          @change=${t=>this.copyGroups=t.target.checked?[...this.copyGroups,e.id]:this.copyGroups.filter(t=>t!==e.id)}></ha-checkbox>${e.label}</label>`)}
                      </div>
                      <p style="margin:6px 0">${o.length?Z`to the <strong>${o.length}</strong> zone(s) selected with the row checkboxes.`:Z`Select the target zones with the row checkboxes.`}</p>
                      <ha-button ?disabled=${!o.length||!this.copyGroups.length} @click=${()=>this.copySettings(e,o)}>Copy</ha-button>
                      <ha-button appearance="plain" @click=${()=>this.copyFrom=null}>Cancel</ha-button>
                    </div>`:Z`<ha-button appearance="plain" ?disabled=${i} @click=${()=>this.copyFrom=e}>
                      <ha-icon slot="start" icon="mdi:content-copy"></ha-icon>Copy settings to…</ha-button>`}
              </div>
            </div>
          </div>
        </td>
      </tr>
    `;}renderTripField(e,t){if(!this.panel||!Object.keys(this.panel.settings.links).length)return Y;if(this.panelWatched(e))return Z`<div class="field"><span>When tripped</span><span class="secondary" style="display:inline">the physical panel handles this zone</span></div>`;const a=this.tripDraft[e]||"default",i=(this.panel.settings.zone_trip[e]||null)!==(this.tripDraft[e]||null);return Z`<label class="field ${i?"changed-inline":""}"
      title="This zone is watched only by Home Assistant. What happens when it triggers the alarm: the default is set on Physical Panel → How HA-only zones raise the alarm.">
      <span>When tripped</span>
      <select aria-label="When tripped" ?disabled=${t} @change=${t=>this.setTrip(e,t.target.value)}>
        <option value="default" ?selected=${"default"===a}>default (${Td[this.tripDefault()]})</option>
        <option value="panel" ?selected=${"panel"===a}>${Td.panel}</option>
        <option value="notify" ?selected=${"notify"===a}>${Td.notify}</option>
        <option value="none" ?selected=${"none"===a}>${Td.none}</option>
      </select>
    </label>`;}copySettings(e,t){const a=this.draft.get(e),i=Hd.filter(e=>this.copyGroups.includes(e.id)).reduce((e,t)=>[...e,...t.fields],[]);this.edit(()=>t.forEach(e=>i.forEach(t=>{var i;return this.draft.setField(e,t,JSON.parse(JSON.stringify(null!==(i=a[t])&&void 0!==i?i:null)));}))),this.copyFrom=null,Pn(this,`Copied to ${t.length} zone(s) as unsaved changes — review and Save.`);}renderSaveBar(e){const t=this.draft.toBatch(),a=this.tripChanges(),i=[t.create.length?`${t.create.length} new`:"",t.update.length?`${t.update.length} changed`:"",t.delete.length?`${t.delete.length} to remove`:"",a?`${a} trip action(s)`:""].filter(Boolean);return Z`
      <div class="savebar" role="region" aria-label="Unsaved changes">
        <ha-svg-icon class="mark" style="width:22px;height:22px" .path=${Zs}></ha-svg-icon>
        <span class="count">
          ${e} unsaved change${1===e?"":"s"}
          <span class="secondary" style="display:inline">(${i.join(", ")}) — a backup is made before saving</span>
        </span>
        <ha-button appearance="plain" ?disabled=${this.saving} @click=${this.discard}>Discard</ha-button>
        <ha-button ?disabled=${this.saving} @click=${this.save}>${this.saving?"Saving…":"Save"}</ha-button>
      </div>
    `;}setField(e,t,a){this.edit(()=>this.draft.setField(e,t,a));}selectRows(e,t){const a=this.selection.filter(t=>!e.includes(t));this.selection=t?[...a,...e]:a;}bulkSet(e,t){const a=t.target.value;t.target.value="",a&&this.edit(()=>this.draft.setFieldMany(this.selection,e,a));}addPicked(e){this.locked=!1;const{entity_ids:t,area:a}=e.detail,i=this.areas[a],s=jd.filter(e=>i&&i.modes&&i.modes[e]&&i.modes[e].enabled);this.edit(()=>{t.forEach(e=>{let t=$r(this.hass.states[e],s);t&&(["cover","lock"].includes(e.split(".")[0])&&(t=Object.assign(Object.assign(Object.assign({},t),{type:rn.Door}),wr(s)[rn.Door])),this.draft.add(Object.assign(Object.assign({},t),{area:a,group:null})));});}),this.showAdd=!1,Pn(this,`${t.length} zone(s) added to the draft. Click Save to apply.`);}discard(){window.confirm(`Discard ${this.draft.changeCount()+this.tripChanges()} unsaved change(s)?`)&&(this.edit(()=>this.draft.discardAll()),this.panel&&(this.tripDraft=Object.assign({},this.panel.settings.zone_trip)),this.restoredCount=0);}modesTitle(e){const t=this.source(e,"modes");return t?"override"===t.kind?"Arm modes: manual override (clear it from the Modes icon next to the zone name)":`Arm modes set by rule: ${this.ruleNames(t.rules)}`:"";}async rulesApplied(e){this.showRulesPreview=!1;const t=e.detail;Pn(this,`Rules applied: ${t.created} new, ${t.updated} changed zone(s). Backup: ${t.backup.name}`),await this.fetchData();}async save(){const e=this.draft.toBatch(),t=e.create.filter(e=>!e.area||!this.areas[e.area]).map(e=>e.entity_id);if(t.length)this.error=`Choose a partition for: ${t.join(", ")}`;else{this.saving=!0,this.error="";try{const t=!e.create.length&&!e.update.length&&!e.delete.length?null:await((e,t)=>e.callWS(Object.assign({type:"alarmo/ext/sensors/apply_changes"},t)))(this.hass,e);if(this.panel&&this.tripChanges()){const t={};Object.keys(this.tripDraft).forEach(a=>{e.delete.includes(a)||(t[a]=this.tripDraft[a]);});const a=(await Jo(this.hass)).settings;await Xo(this.hass,Object.assign(Object.assign({},a),{zone_trip:t})),this.panel=void 0;}this.edit(()=>this.draft.discardAll()),this.restoredCount=0,this.selection=[],this.locked=!0,await this.fetchData(),Pn(this,t?`Saved ${t.created+t.updated+t.deleted} zone(s). Backup: ${t.backup.name}`:"Saved.");}catch(e){this.error=`Nothing was saved:\n${Nn(e)}`;}finally{this.saving=!1;}}}};Dd.styles=Kn,s([ye({attribute:!1})],Dd.prototype,"hass",void 0),s([ye({type:Boolean})],Dd.prototype,"narrow",void 0),s([ye({attribute:!1})],Dd.prototype,"path",void 0),s([be()],Dd.prototype,"areas",void 0),s([be()],Dd.prototype,"groups",void 0),s([be()],Dd.prototype,"loaded",void 0),s([be()],Dd.prototype,"selection",void 0),s([be()],Dd.prototype,"expanded",void 0),s([be()],Dd.prototype,"filters",void 0),s([be()],Dd.prototype,"saving",void 0),s([be()],Dd.prototype,"error",void 0),s([be()],Dd.prototype,"restoredCount",void 0),s([be()],Dd.prototype,"showAdd",void 0),s([be()],Dd.prototype,"copyFrom",void 0),s([be()],Dd.prototype,"panel",void 0),s([be()],Dd.prototype,"tripDraft",void 0),s([be()],Dd.prototype,"copyGroups",void 0),s([be()],Dd.prototype,"rev",void 0),s([be()],Dd.prototype,"rules",void 0),s([be()],Dd.prototype,"rulesPreview",void 0),s([be()],Dd.prototype,"registry",void 0),s([be()],Dd.prototype,"showRulesPreview",void 0),s([be()],Dd.prototype,"showHelp",void 0),s([be()],Dd.prototype,"locked",void 0),Dd=s([ue("alarm-view-sensor-table")],Dd);const Pd={config:"General settings",areas:"Partitions",sensors:"Zones",users:"Users / codes",automations:"Actions & notifications",sensor_groups:"Cross-zone groups"},qd=e=>null==e?"—":"object"==typeof e?JSON.stringify(e):String(e);let Bd=class extends pe{constructor(){super(...arguments),this.backups=[],this.backupName="",this.initialMode="merge",this.sourceKind="file",this.fileName="",this.fileContent=null,this.selectedBackup="",this.mode="merge",this.busy=!1,this.error="",this.openSections=[];}firstUpdated(){this.mode=this.initialMode,this.backupName?(this.sourceKind="backup",this.selectedBackup=this.backupName):this.backups.length&&(this.selectedBackup=this.backups[0].name);}source(){return"backup"===this.sourceKind?this.selectedBackup?{backup_name:this.selectedBackup}:null:null!==this.fileContent?{content:this.fileContent}:null;}reset(){this.preview=void 0,this.error="";}render(){return Z`
      <div class="overlay" @click=${e=>e.target===e.currentTarget&&!this.busy&&this.close()}>
        <div class="modal" role="dialog" aria-label="Import or restore">
          <h2>Import / restore configuration</h2>
          <div class="body">${this.preview?this.renderPreview(this.preview):this.renderSource()}</div>
          <div class="footer">${this.renderFooter()}</div>
        </div>
      </div>
    `;}renderSource(){return Z`
      <p>
        <label>
          <input type="radio" name="src" .checked=${"file"===this.sourceKind} @change=${()=>(this.sourceKind="file",this.reset())} />
          Upload a file (YAML export or <code>alarmo.storage</code>)
        </label>
      </p>
      ${"file"===this.sourceKind?Z`
            <p style="margin-left:24px">
              <input type="file" accept=".yaml,.yml,.json,.storage,text/yaml,application/json" aria-label="File to import" @change=${this.pickFile} />
              ${this.fileName?Z`<span class="secondary">${this.fileName}</span>`:Y}
            </p>
          `:Y}
      <p>
        <label>
          <input
            type="radio"
            name="src"
            ?disabled=${!this.backups.length}
            .checked=${"backup"===this.sourceKind}
            @change=${()=>(this.sourceKind="backup",this.reset())}
          />
          A saved backup ${this.backups.length?`(${this.backups.length} available)`:"(none yet)"}
        </label>
      </p>
      ${"backup"===this.sourceKind?Z`
            <p style="margin-left:24px">
              <select aria-label="Backup" @change=${e=>(this.selectedBackup=e.target.value,this.reset())}>
                ${this.backups.map(e=>Z`
                    <option value=${e.name} ?selected=${e.name===this.selectedBackup}>
                      ${Dn(e.created,this.hass.language)}${e.label?` — ${e.label}`:""}
                    </option>
                  `)}
              </select>
            </p>
          `:Y}
      <h3 style="font-weight:500;margin:16px 0 4px">How to apply it</h3>
      <p>
        <label>
          <input type="radio" name="mode" .checked=${"merge"===this.mode} @change=${()=>(this.mode="merge",this.reset())} />
          <strong>Merge</strong> — add and update what is in the file; keep everything else.
        </label>
      </p>
      <p>
        <label>
          <input type="radio" name="mode" .checked=${"replace"===this.mode} @change=${()=>(this.mode="replace",this.reset())} />
          <strong>Replace</strong> — the file becomes the complete configuration; anything not in it is removed.
        </label>
      </p>
      ${this.error?Z`<div class="notice error" style="margin:8px 0;white-space:pre-line">${this.error}</div>`:Y}
    `;}renderPreview(e){if(!e.ok&&!e.sections)return Z`
        <div class="notice error" style="margin:8px 0">
          <strong>This file cannot be imported:</strong>
          <ul>${e.errors.map(e=>Z`<li>${e}</li>`)}</ul>
        </div>
      `;const t=e.sections||{};return Z`
      <p class="secondary" style="display:block">
        ${"storage"===e.format?"alarmo.storage file":"YAML export"} · storage ${e.source_version}
        ${e.exported_at?Z` · exported ${Dn(e.exported_at,this.hass.language)}`:Y}
        ${e.alarmo_version?Z` · Alarmo ${e.alarmo_version}`:Y} · mode <strong>${e.mode}</strong>
      </p>
      ${e.blocked_by&&e.blocked_by.length?Z`<div class="notice error" style="margin:8px 0">
            <strong>Disarm first.</strong> Import and restore are blocked while armed, arming, pending or triggered:
            ${e.blocked_by.join(", ")}
          </div>`:Y}
      ${e.errors.length?Z`<div class="notice error" style="margin:8px 0">
            <strong>Problems that must be fixed first:</strong>
            <ul>${e.errors.map(e=>Z`<li>${e}</li>`)}</ul>
          </div>`:Y}
      ${e.warnings&&e.warnings.length?Z`<div class="notice warn" style="margin:8px 0">
            <strong>Warnings:</strong>
            <ul>${e.warnings.map(e=>Z`<li>${e}</li>`)}</ul>
          </div>`:Y}
      ${e.extras_included?Z`<div class="notice" style="margin:8px 0">
            <strong>Also restores Alarmo ext settings:</strong>
            ${e.extras_changes&&e.extras_changes.length?Z`<ul style="margin:4px 0">${e.extras_changes.map(e=>Z`<li>${e.label}</li>`)}</ul>`:Z` unchanged.`}
            <span class="secondary" style="display:block">The current House Mode and its history stay as they are.</span>
          </div>`:Z`<div class="notice" style="margin:8px 0">This file has no Alarmo ext settings (House Modes, physical panel,
            zone rules, mirrors); those stay as they are.</div>`}
      ${e.total_changes?Y:Z`<div class="notice" style="margin:8px 0">No changes — the file matches the current configuration.</div>`}
      <table>
        <thead>
          <tr><th>Section</th><th class="c">Added</th><th class="c">Changed</th><th class="c">Removed</th><th></th></tr>
        </thead>
        <tbody>
          ${Object.entries(t).map(([e,t])=>{const a=t.added.length+t.changed.length+t.removed.length,i=this.openSections.includes(e);return Z`
              <tr>
                <td>${Pd[e]||e}</td>
                <td class="c">${t.added.length?Z`<span class="badge new">${t.added.length}</span>`:"0"}</td>
                <td class="c">${t.changed.length?Z`<span class="badge">${t.changed.length}</span>`:"0"}</td>
                <td class="c">${t.removed.length?Z`<span class="badge removed">${t.removed.length}</span>`:"0"}</td>
                <td>
                  ${a?Z`<button class="link" @click=${()=>this.openSections=i?this.openSections.filter(t=>t!==e):[...this.openSections,e]}>
                        ${i?"Hide":"Details"}
                      </button>`:Y}
                </td>
              </tr>
              ${i?Z`<tr class="detail"><td colspan="5">
                    ${t.added.map(e=>Z`<div class="status-icon new">+ ${e.label}</div>`)}
                    ${t.removed.map(e=>Z`<div class="status-icon removed">− ${e.label}</div>`)}
                    ${t.changed.map(e=>Z`<div style="margin:4px 0">
                        <span class="status-icon changed">✎ ${e.label}</span>
                        <ul style="margin:2px 0">
                          ${e.fields.map(e=>Z`<li><code>${e.field}</code>: ${qd(e.old)} → <strong>${qd(e.new)}</strong></li>`)}
                        </ul>
                      </div>`)}
                  </td></tr>`:Y}
            `;})}
        </tbody>
      </table>
      <p class="secondary" style="display:block;margin-top:12px">
        Applying makes a backup of the current configuration first, then reloads Alarmo (alarm entities are
        unavailable for a few seconds).
      </p>
      ${this.error?Z`<div class="notice error" style="margin:8px 0;white-space:pre-line">${this.error}</div>`:Y}
    `;}renderFooter(){const e=this.preview;if(!e)return Z`
        <ha-button appearance="plain" @click=${this.close}>Cancel</ha-button>
        <ha-button ?disabled=${this.busy||!this.source()} @click=${this.runPreview}>
          ${this.busy?"Checking…":"Preview changes"}
        </ha-button>
      `;const t=!(!e.blocked_by||!e.blocked_by.length),a=e.ok&&!t&&!!e.total_changes&&!this.busy;return Z`
      <ha-button appearance="plain" ?disabled=${this.busy} @click=${this.reset}>Back</ha-button>
      <ha-button appearance="plain" ?disabled=${this.busy} @click=${this.runPreview}>Check again</ha-button>
      <ha-button appearance="plain" ?disabled=${this.busy} @click=${this.close}>Cancel</ha-button>
      <ha-button ?disabled=${!a} variant=${"replace"===e.mode?"danger":"brand"} @click=${this.apply}>
        ${this.busy?"Applying…":`${"replace"===e.mode?"Replace":"Merge"} ${e.total_changes||0} change(s)`}
      </ha-button>
    `;}async pickFile(e){const t=e.target.files&&e.target.files[0];this.reset(),t&&(t.size>5242880?this.error="File is too large (over 5 MB) to be an Alarmo configuration.":(this.fileName=t.name,this.fileContent=await t.text()));}async runPreview(){const e=this.source();if(e){this.busy=!0,this.error="";try{this.preview=await(t=this.hass,a=e,i=this.mode,t.callWS(Object.assign(Object.assign({type:"alarmo/ext/import/preview"},a),{mode:i}))),this.openSections=[];}catch(e){this.error=Nn(e);}finally{this.busy=!1;}var t,a,i;}}async apply(){const e=this.source(),t=this.preview;if(!e||!t||!t.token)return;const a="replace"===t.mode?"REPLACE the whole Alarmo configuration":"merge these changes into Alarmo";if(window.confirm(`This will ${a} (${t.total_changes} change(s)). A backup is made first. Continue?`)){this.busy=!0,this.error="";try{const a=await(i=this.hass,s=e,n=t.mode,r=t.token,i.callWS(Object.assign(Object.assign({type:"alarmo/ext/import/apply"},s),{mode:n,token:r})));this.dispatchEvent(new CustomEvent("imported",{detail:a}));}catch(e){this.error=Nn(e);}finally{this.busy=!1;}var i,s,n,r;}}close(){this.dispatchEvent(new CustomEvent("close"));}};Bd.styles=Kn,s([ye({attribute:!1})],Bd.prototype,"hass",void 0),s([ye({attribute:!1})],Bd.prototype,"backups",void 0),s([ye()],Bd.prototype,"backupName",void 0),s([ye()],Bd.prototype,"initialMode",void 0),s([be()],Bd.prototype,"sourceKind",void 0),s([be()],Bd.prototype,"fileName",void 0),s([be()],Bd.prototype,"fileContent",void 0),s([be()],Bd.prototype,"selectedBackup",void 0),s([be()],Bd.prototype,"mode",void 0),s([be()],Bd.prototype,"preview",void 0),s([be()],Bd.prototype,"busy",void 0),s([be()],Bd.prototype,"error",void 0),s([be()],Bd.prototype,"openSections",void 0),Bd=s([ue("alarmo-ext-import-dialog")],Bd);let Id=class extends pe{constructor(){super(...arguments),this.narrow=!1,this.backups=[],this.settings={retention_days:30},this.retentionInput="30",this.backupDir="",this.label="",this.busy=!1,this.error="",this.loaded=!1,this.dialog=null;}firstUpdated(){this.refresh();}async refresh(){try{const[t,a]=await Promise.all([Ln(this.hass),(e=this.hass,e.callWS({type:"alarmo/ext/backup/list"}))]);this.backupDir=t.backup_dir,this.backups=a.backups,this.settings=a.settings,this.retentionInput=String(a.settings.retention_days),this.loaded=!0;}catch(e){this.error=Nn(e);}var e;}async run(e){this.busy=!0,this.error="";try{await e();}catch(e){this.error=Nn(e);}finally{this.busy=!1;}}render(){if(!this.hass)return Y;const e=this.retentionInput!==String(this.settings.retention_days);return Z`
      <ha-card>${Qn("Backup & restore","settings")}
        <div class="card-content desc">
          <p>A backup is a copy of the whole Alarmo configuration: partitions, zones, users, notifications, actions and the ext settings.</p>
          <ul>
            <li>One is made automatically before every save on these pages and before every import.</li>
            <li>You can also make one here, download the configuration as YAML, or import / restore one.</li>
            <li>It includes the House Mode, physical panel, mirror and zone rule settings (backups made before ext.11 do not).</li>
          </ul>
        </div>
        <div class="notice warn">
          Backups and exports contain the <strong>hashed user codes</strong>. Keep the files private.
        </div>
        ${this.error?Z`<div class="notice error" style="white-space:pre-line">${this.error}</div>`:Y}
        <div class="toolbar">
          <input
            type="text"
            placeholder="Optional label"
            aria-label="Backup label"
            maxlength="32"
            .value=${this.label}
            @input=${e=>this.label=e.target.value}
          />
          <ha-button ?disabled=${this.busy} @click=${this.create}>Create backup now</ha-button>
          <span class="grow"></span>
          <ha-button appearance="plain" ?disabled=${this.busy} @click=${this.exportNow}>Export (download YAML)</ha-button>
          <ha-button appearance="plain" ?disabled=${this.busy} @click=${()=>this.dialog={backupName:"",mode:"merge"}}>
            Import / restore…
          </ha-button>
        </div>
        <div class="toolbar">
          <alarmo-ext-slider
            .label=${"Delete backups older than"}
            .min=${1}
            .max=${365}
            unit="days"
            optional
            offText="keep forever"
            .onValue=${30}
            .value=${parseInt(this.retentionInput,10)>0?parseInt(this.retentionInput,10):null}
            @value-changed=${e=>this.retentionInput=String(e.detail.value||0)}
          ></alarmo-ext-slider>
          <ha-button appearance="plain" ?disabled=${this.busy||!e} @click=${this.saveRetention}>Save</ha-button>
          <span class="secondary" style="display:inline">
            Untick to keep backups forever. The newest backup is always kept.
            ${this.backupDir?Z`Folder: <code>${this.backupDir}</code>`:Y}
          </span>
        </div>
      </ha-card>

      <ha-card>${Qn(`Saved backups (${this.backups.length})`,"readonly")}
        <div class="card-content desc"><p>Newest first. <em>Restore</em> puts a backup back (Replace); a backup of the current configuration is made first.</p></div>
        ${this.loaded?this.backups.length?Z`
                <div class="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Created</th><th>Label</th><th>Files</th><th></th></tr>
                    </thead>
                    <tbody>
                      ${this.backups.map(e=>this.renderRow(e))}
                    </tbody>
                  </table>
                </div>
              `:Z`<div class="empty">No backups yet. One is made automatically before every save on the Zones page and every import.</div>`:Z`<div class="empty">Loading…</div>`}
      </ha-card>

      ${this.dialog?Z`
            <alarmo-ext-import-dialog
              .hass=${this.hass}
              .backups=${this.backups}
              .backupName=${this.dialog.backupName}
              .initialMode=${this.dialog.mode}
              @close=${()=>this.dialog=null}
              @imported=${this.imported}
            ></alarmo-ext-import-dialog>
          `:Y}
    `;}renderRow(e){const t=(t,a)=>e.files[t]?Z`
            <ha-button appearance="plain" size="small" @click=${()=>this.download(e.files[t].file)}>
              <ha-svg-icon slot="start" .path=${"M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"}></ha-svg-icon>
              ${a} (${(e=>e<1024?`${e} B`:`${(e/1024).toFixed(1)} KB`)(e.files[t].size)})
            </ha-button>
          `:Y;return Z`
      <tr>
        <td>${Dn(e.created,this.hass.language)}</td>
        <td>${e.label||"—"}</td>
        <td>${t("yaml","YAML")} ${t("storage",".storage")} ${t("extras","ext settings")}</td>
        <td>
          <ha-icon-button
            .path=${"M12,3A9,9 0 0,0 3,12H0L4,16L8,12H5A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19C10.5,19 9.09,18.5 7.94,17.7L6.5,19.14C8.04,20.3 9.94,21 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M14,12A2,2 0 0,0 12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12Z"}
            .label=${"Restore this backup"}
            @click=${()=>this.dialog={backupName:e.name,mode:"replace"}}
          ></ha-icon-button>
          <ha-icon-button .path=${qs} .label=${"Delete backup"} @click=${()=>this.removeBackup(e)}></ha-icon-button>
        </td>
      </tr>
    `;}create(){this.run(async()=>{const e=await(t=this.hass,a=this.label.trim()||void 0,t.callWS(Object.assign({type:"alarmo/ext/backup/create"},a?{label:a}:{})));var t,a;this.label="",await this.refresh(),Pn(this,`Backup created: ${e.name}`);});}exportNow(){this.run(async()=>{const e=await(t=this.hass,t.callWS({type:"alarmo/ext/export"}));var t;Hn(e.file_name,e.content);});}download(e){this.run(async()=>{const t=await((e,t)=>e.callWS({type:"alarmo/ext/backup/download",file:t}))(this.hass,e);Hn(t.file_name,t.content,e.endsWith(".json")?"application/json":"text/yaml");});}removeBackup(e){window.confirm(`Delete the backup from ${Dn(e.created,this.hass.language)}? Both files are removed.`)&&this.run(async()=>{var t,a;await(t=this.hass,a=e.name,t.callWS({type:"alarmo/ext/backup/delete",name:a})),await this.refresh();});}saveRetention(){const e=parseInt(this.retentionInput,10);isNaN(e)||e<0||e>3650?this.error="Retention must be a number of days between 0 and 3650.":this.run(async()=>{var t,a;this.settings=await(t=this.hass,a={retention_days:e},t.callWS(Object.assign({type:"alarmo/ext/backup/settings"},a))),await this.refresh(),Pn(this,e?`Backups older than ${e} days will be deleted.`:"Backups will be kept forever.");});}async imported(e){this.dialog=null;const t=e.detail;Pn(this,`Applied ${t.total_changes} change(s). Previous configuration saved as ${t.backup.name}.`),setTimeout(()=>this.refresh(),1500);}};Id.styles=Kn,s([ye({attribute:!1})],Id.prototype,"hass",void 0),s([ye({type:Boolean})],Id.prototype,"narrow",void 0),s([ye({attribute:!1})],Id.prototype,"path",void 0),s([be()],Id.prototype,"backups",void 0),s([be()],Id.prototype,"settings",void 0),s([be()],Id.prototype,"retentionInput",void 0),s([be()],Id.prototype,"backupDir",void 0),s([be()],Id.prototype,"label",void 0),s([be()],Id.prototype,"busy",void 0),s([be()],Id.prototype,"error",void 0),s([be()],Id.prototype,"loaded",void 0),s([be()],Id.prototype,"dialog",void 0),Id=s([ue("alarm-view-backup")],Id);const Vd=e=>JSON.parse(JSON.stringify(e)),Rd={enabled:!0,use_exit_delay:!0,use_entry_delay:!0,always_on:!1,arm_on_close:!1,allow_open:!1,trigger_unavailable:!1,auto_bypass:!1,auto_bypass_modes:[],entry_delay:null,delay_on:null,group:null};let Ud=class extends pe{constructor(){super(...arguments),this.narrow=!1,this.mirrors={},this.ignored=[],this.bypassEntity=null,this.sensors={},this.areas={},this.extra="",this.search="",this.error="",this.busy=!1,this.locked=!0,this.selection=[],this.addTo="",this.showIgnored=!1,this.mirrorType="",this.useMirrors=!0;}firstUpdated(){this.refresh();}async refresh(){try{const[e,t,a]=await Promise.all([Jo(this.hass),$e(this.hass),Ee(this.hass)]);this.info=e,this.sensors=t,this.areas=a,this.addTo&&a[this.addTo]||(this.addTo=Object.keys(a)[0]||""),this.mirrors=Vd(e.settings.mirrors),this.ignored=[...(e.settings.ignored_zones||[])],this.bypassEntity=e.settings.bypass_entity||null;}catch(e){this.error=Nn(e);}}get dirty(){var e;const t=null===(e=this.info)||void 0===e?void 0:e.settings;return!!t&&(JSON.stringify(t.mirrors)!==JSON.stringify(this.mirrors)||JSON.stringify([...(t.ignored_zones||[])].sort())!==JSON.stringify([...this.ignored].sort())||(t.bypass_entity||null)!==this.bypassEntity);}name(e){var t;return(null===(t=this.hass.states[e])||void 0===t?void 0:t.attributes.friendly_name)||e;}allRows(){var e;const t=[],a=new Set();for(const e of this.info.panels)for(const i of e.zones)t.push({source:i.entity_id,name:i.name,zone:i.zone,panel:e.name,panelZone:!0,dc:i.device_class}),a.add(i.entity_id);for(const i of Object.keys(this.mirrors))a.has(i)||t.push({source:i,name:this.name(i),zone:null,panel:null,panelZone:!1,dc:(null===(e=this.hass.states[i])||void 0===e?void 0:e.attributes.device_class)||null});return t;}inAlarmo(e){return this.sensors[sd(e)]?"mirror":this.sensors[e]?"zone":null;}render(){if(!this.info)return Z`<ha-card><div class="empty">${this.error||"Loading…"}</div></ha-card>`;const e=this.allRows(),t=this.search.trim().toLowerCase(),a=e.filter(e=>(this.showIgnored||!this.ignored.includes(e.source))&&(!t||e.source.includes(t)||e.name.toLowerCase().includes(t))),i=e.filter(e=>e.panelZone&&!this.inAlarmo(e.source)&&!this.ignored.includes(e.source)),s=e.filter(e=>this.info.settings.mirrors[e.source]&&this.sensors[e.source]&&this.hass.states[sd(e.source)]&&!this.sensors[sd(e.source)]),n=Object.keys(this.hass.states).filter(t=>t.startsWith("binary_sensor.")&&!t.endsWith("_mirror")&&!e.some(e=>e.source===t)).sort(),r=this.selection.filter(e=>a.some(t=>t.source===e)),o=a.length>0&&a.every(e=>r.includes(e.source)),d=this.info.panels.filter(e=>e.zones.length).length>1;return Z`
      ${this.error?Z`<div class="notice error" style="white-space:pre-line;margin:0 0 12px">${this.error}</div>`:Y}
      <ha-card>${Qn("Panel zones","settings")}
        <div class="card-content desc">
          <p>Every zone your physical panel reports to Home Assistant: its live state, its mirror, and which entity Alarmo uses.</p>
          <p><strong>Why mirrors exist — a Vista limitation.</strong> A Honeywell/Ademco Vista panel stops reporting a zone
            while it is bypassed, so the zone falsely shows "closed". A mirror (<code>binary_sensor.&lt;zone&gt;_mirror</code>)
            follows the zone live and keeps its last known state while bypassed (or shows unknown). DSC panels keep
            reporting bypassed zones, so they do not need mirrors.</p>
          <ul>
            <li>Unlock to edit, then tick <em>Mirror</em> to create a mirror, untick to remove it, and Save.</li>
            <li>Select rows to add them to Alarmo as zones or as their mirrors (a backup is made first), or to ignore them.</li>
            <li><em>Ignore</em> hides a zone that is not a real sensor (keyfob button, RF supervision, unused number) from
              "not in Alarmo".</li>
            <li>A window opened <em>after</em> it was bypassed can't be seen by any software.</li>
          </ul>
        </div>
        ${i.length?Z`<div class="notice warn" style="margin:0 16px 12px">
              <strong>${i.length} panel zone(s) are not in Alarmo:</strong> ${i.map(e=>e.name).join(", ")}.
              <div class="toolbar" style="padding:6px 0 0">
                ${Object.keys(this.areas).length>1?Z`<label>Partition
                      <select @change=${e=>this.addTo=e.target.value}>
                        ${Object.values(this.areas).map(e=>Z`<option value=${e.area_id} ?selected=${e.area_id===this.addTo}>${e.name}</option>`)}
                      </select></label>`:Y}
                <ha-button ?disabled=${this.busy||!this.addTo} @click=${()=>this.addAllAsDrafts(i.map(e=>e.source))}>
                  <ha-icon slot="start" icon="mdi:playlist-plus"></ha-icon>Add all with suggested settings…</ha-button>
                <span class="secondary" style="display:inline">They become unsaved drafts on Zone Assignments (type and Arm Modes
                  guessed from the device class) for you to review and Save. Ignore the ones you don't want first.</span>
              </div>
            </div>`:Y}
        <div class="toolbar">
          ${Jn(this.locked,()=>this.locked=!this.locked)}
          <input type="search" placeholder="Search" aria-label="Search" .value=${this.search} @input=${e=>this.search=e.target.value} />
          <label><input type="checkbox" .checked=${this.showIgnored} @change=${e=>this.showIgnored=e.target.checked} />
            Show ignored (${this.ignored.length})</label>
          ${s.length?Z`<ha-button appearance="plain" ?disabled=${this.busy||this.dirty} @click=${()=>this.repoint(s.map(e=>e.source))}>
                Use mirrors in Alarmo for ${s.length} zone(s)</ha-button>`:Y}
        </div>
        ${this.renderBypassHelper()}
        ${this.renderMirrorTools(e)}
        ${r.length&&!this.locked?Z`<div class="bulkbar" role="toolbar" aria-label="Selected zones">
              <strong>${r.length} selected</strong>
              <label>Partition
                <select @change=${e=>this.addTo=e.target.value}>
                  ${Object.values(this.areas).map(e=>Z`<option value=${e.area_id} ?selected=${e.area_id===this.addTo}>${e.name}</option>`)}
                </select>
              </label>
              <ha-button appearance="plain" ?disabled=${this.busy||this.dirty} @click=${()=>this.addNow(r,!1)}>Add as zones</ha-button>
              <ha-button appearance="plain" ?disabled=${this.busy||this.dirty} @click=${()=>this.addNow(r,!0)}>Add their mirrors</ha-button>
              <ha-button appearance="plain" @click=${()=>r.forEach(e=>this.toggle(e,!0))}>Mirror on</ha-button>
              <ha-button appearance="plain" @click=${()=>r.forEach(e=>this.toggle(e,!1))}>Mirror off</ha-button>
              <ha-button appearance="plain" @click=${()=>this.ignored=[...new Set([...this.ignored,...r])]}>Ignore</ha-button>
              <ha-button appearance="plain" @click=${()=>this.ignored=this.ignored.filter(e=>!r.includes(e))}>Stop ignoring</ha-button>
              <button class="link" @click=${()=>this.selection=[]}>Clear selection</button>
            </div>`:Y}
        <div class="table-wrap"><table>
          <thead><tr>
            <th class="c"><input type="checkbox" aria-label="Select all shown" ?disabled=${this.locked} .checked=${o}
              @change=${e=>this.selection=e.target.checked?a.map(e=>e.source):[]} /></th>
            <th class="icon"></th><th>Zone</th><th>Panel zone</th><th class="c">State: Zone / Mirror</th><th class="c">Mirror</th><th>While bypassed</th><th>Entity in use</th>
          </tr></thead>
          <tbody>${a.map(e=>{var t;const a=this.info.settings.mirrors[e.source],i=this.mirrors[e.source],s=sd(e.source),n=this.hass.states[s],o=i&&!a?"new":!i&&a?"removed":i&&a&&i.hold!==a.hold?"changed":"unchanged",l=this.ignored.includes(e.source),c=Fo(null===(t=this.hass.states[e.source])||void 0===t?void 0:t.state),h=this.inAlarmo(e.source);return Z`<tr class=${l?"zone-disabled":""}>
              <td class="c"><input type="checkbox" aria-label=${`Select ${e.name}`} ?disabled=${this.locked} .checked=${r.includes(e.source)}
                @change=${t=>this.selection=t.target.checked?[...r,e.source]:r.filter(t=>t!==e.source)} /></td>
              <td class="icon">${Xn(this.hass,e.source,o)}</td>
              <td class="name">${e.name}<span class="secondary">${e.source}${l?" · ignored":""}</span></td>
              <td>${null!==e.zone?`${e.zone}${e.panel&&d?` · ${e.panel}`:""}`:Z`<span class="secondary" style="display:inline">not a panel zone</span>`}</td>
              <td class="c"><span class="state-pair">
                ${Yo(c,{label:this.info.bypassed.includes(e.source)?"bypassed":void 0,title:`Zone: ${c}`})}
                <span class="sep">/</span>
                ${n?Yo(Fo(n.state),{label:n.attributes.bypass_held?"held":void 0,title:`Mirror: ${n.state}${n.attributes.bypass_held?" (holding the last state while bypassed)":""}`}):Yo(null)}
              </span></td>
              <td class="c"><input type="checkbox" aria-label=${`Mirror ${e.name}`} ?disabled=${this.locked} .checked=${!!i} @change=${t=>this.toggle(e.source,t.target.checked)} />
                ${!n&&i?Z`<span class="secondary">created on Save</span>`:Y}</td>
              <td>${i?Z`<select aria-label="While bypassed" ?disabled=${this.locked} @change=${t=>this.mirrors=Object.assign(Object.assign({},this.mirrors),{[e.source]:{hold:t.target.value}})}>
                    <option value="last" ?selected=${"last"===i.hold}>hold last state</option>
                    <option value="unknown" ?selected=${"unknown"===i.hold}>unknown</option>
                  </select>`:"—"}</td>
              <td>${"mirror"===h?Z`<code>${s}</code>`:"zone"===h?"same":Z`<span class="secondary" style="display:inline">not in Alarmo</span>`}</td>
            </tr>`;})}</tbody>
        </table></div>
        ${a.length?Y:Z`<div class="empty">No physical panel zones found. Add the physical panel's integration to Home Assistant, or mirror another entity below.</div>`}
      </ha-card>
      <ha-card>${Qn("Mirror another entity","settings")}
        <div class="card-content desc">
          <p>Any binary_sensor can have a mirror. Entities that are not panel zones only know they are bypassed if they report a
            <code>bypassed</code> attribute.</p>
        </div>
        <div class="toolbar">
          <label>Entity
            <input list="alarmo-mirror-candidates" placeholder="binary_sensor.…" .value=${this.extra} @input=${e=>this.extra=e.target.value} />
            <datalist id="alarmo-mirror-candidates">${n.map(e=>Z`<option value=${e}>${this.hass.states[e].attributes.friendly_name||""}</option>`)}</datalist>
          </label>
          <ha-button appearance="plain" ?disabled=${!this.extra.startsWith("binary_sensor.")||!this.hass.states[this.extra]} @click=${this.addExtra}>Add mirror</ha-button>
        </div>
      </ha-card>
      ${this.dirty?Z`<div class="savebar" role="region" aria-label="Unsaved panel zone changes">
            <span class="count">Unsaved mirror / ignore changes</span>
            <ha-button appearance="plain" ?disabled=${this.busy} @click=${()=>{this.mirrors=Vd(this.info.settings.mirrors),this.ignored=[...(this.info.settings.ignored_zones||[])];}}>Discard</ha-button>
            <ha-button ?disabled=${this.busy} @click=${this.save}>${this.busy?"Saving…":"Save"}</ha-button>
          </div>`:Y}
    `;}renderBypassHelper(){const e=Object.keys(this.hass.states).filter(e=>/^(input_boolean|switch|binary_sensor)\./.test(e)&&!e.endsWith("_mirror")&&!(e in this.sensors)).filter(e=>!this.info.panels.some(t=>t.zones.some(t=>t.entity_id===e))).sort(),t=this.bypassEntity?this.hass.states[this.bypassEntity]:void 0,a=this.info.bypass_unreported||[];return Z`
      ${a.length&&!this.bypassEntity?Z`<div class="notice warn" style="margin:0 16px 8px">
            <strong>${a.length} mirrored zone(s) can't learn about bypasses.</strong> Their panel (Honeywell/Vista via
            envisalink_new) reports bypasses only on its keypad sensor, and no keypad sensor with <code>armed_bypass</code> was
            found for them. Choose a bypass helper below, or check the envisalink_new keypad sensor.</div>`:Y}
      <div class="toolbar" style="padding-top:0">
        <label>Bypass helper
          <select ?disabled=${this.locked} @change=${e=>this.bypassEntity=e.target.value||null}>
            <option value="" ?selected=${!this.bypassEntity}>none (detect bypasses from the panel only)</option>
            ${e.map(e=>Z`<option value=${e} ?selected=${e===this.bypassEntity}>${this.name(e)} (${e})</option>`)}
          </select>
        </label>
        ${t?Z`<span class="secondary" style="display:inline">now ${t.state}${"on"===t.state?" — mirrors are holding":""}</span>`:Y}
        <span class="secondary" style="display:block;flex-basis:100%">Usually not needed: bypasses are read from the panel (on a Vista,
          its keypad sensor's BYPASS indicator and "BYPAS zz" messages; a window open when the panel was Quick-Bypassed keeps
          showing "open"). Only choose a helper that is <em>on exactly while zones are bypassed on the panel</em> — not one that
          only asks your automations to bypass when arming.</span>
      </div>
    `;}renderMirrorTools(e){const t=this.mirrorType?e.filter(e=>e.panelZone&&id(e.dc)===this.mirrorType&&!this.ignored.includes(e.source)):[],a=t.length,i=this.areas[this.addTo];return Z`
      <div class="toolbar" style="padding-top:0">
        <label>Create mirror for
          <select ?disabled=${this.locked} @change=${t=>this.chooseType(t.target.value,e)}>
            <option value="" ?selected=${!this.mirrorType}>choose a zone type…</option>
            ${ad.map(t=>{const a=e.filter(e=>e.panelZone&&id(e.dc)===t.id).length;return Z`<option value=${t.id} ?selected=${this.mirrorType===t.id}>${t.label} (${a})</option>`;})}
          </select>
        </label>
        <label><input type="checkbox" ?disabled=${this.locked} .checked=${this.useMirrors} @change=${e=>this.useMirrors=e.target.checked} />
          Use the mirrors in Alarmo, remove the panel's real zones</label>
        ${Object.keys(this.areas).length>1?Z`<label>Partition
              <select ?disabled=${this.locked} @change=${e=>this.addTo=e.target.value}>
                ${Object.values(this.areas).map(e=>Z`<option value=${e.area_id} ?selected=${e.area_id===this.addTo}>${e.name}</option>`)}
              </select></label>`:Y}
      </div>
      ${this.mirrorType?Z`<div class="toolbar" style="padding-top:0">
            <ha-button ?disabled=${this.locked||this.busy||!a} @click=${()=>this.applyMirrors(t.map(e=>e.source))}>
              <ha-icon slot="start" icon="mdi:content-duplicate"></ha-icon>${this.useMirrors?`Save ${a} mirror(s), use them in ${i?i.name:"Alarmo"} instead of the real zones`:`Save ${a} mirror(s)`}
            </ha-button>
            <button class="link" @click=${()=>{this.mirrorType="",this.mirrors=Vd(this.info.settings.mirrors);}}>Cancel</button>
            ${a?Y:Z`<span class="secondary" style="display:inline">No ${this.mirrorType} zones found.</span>`}
          </div>`:Y}
    `;}chooseType(e,t){this.mirrorType=e,e&&t.filter(t=>t.panelZone&&id(t.dc)===e&&!this.ignored.includes(t.source)).forEach(e=>this.toggle(e.source,!0));}async applyMirrors(e){var t,a;const i=e.filter(e=>this.sensors[e]&&!this.sensors[sd(e)]),s=e.filter(e=>!this.sensors[e]&&!this.sensors[sd(e)]);if(!this.useMirrors||window.confirm(`Create ${e.length} mirror(s)`+(i.length?`, switch ${i.length} Alarmo zone(s) to their mirror (settings kept, the real zone is removed from Alarmo)`:"")+(s.length?`, add ${s.length} mirror(s) to ${null===(t=this.areas[this.addTo])||void 0===t?void 0:t.name} with suggested settings`:"")+"? A backup is made first.")){this.busy=!0,this.error="";try{const t=(await Jo(this.hass)).settings;if(await Xo(this.hass,Object.assign(Object.assign({},t),{mirrors:this.mirrors,ignored_zones:this.ignored,bypass_entity:this.bypassEntity})),this.useMirrors){const t=e.map(sd);for(let e=0;e<30&&t.some(e=>!this.hass.states[e]);e++)await new Promise(e=>setTimeout(e,500));const n=t.filter(e=>!this.hass.states[e]);if(n.length)throw new Error(`Mirrors not created yet: ${n.join(", ")} — try again in a moment.`);const r=[];if(i.length){const e=await td(this.hass,i.map(e=>({from:e,to:sd(e)})));r.push(`${e.changed} zone(s) now use their mirror`);}if(s.length){const e=await ed(this.hass,this.addTo,s.map(sd));r.push(`${e.create.length} mirror(s) added to ${null===(a=this.areas[this.addTo])||void 0===a?void 0:a.name}`);}Pn(this,`Mirrors saved${r.length?`; ${r.join(", ")}`:""}.`);}else Pn(this,"Mirrors saved.");this.locked=!0,this.mirrorType="",await this.refresh();}catch(e){this.error=Nn(e),await this.refresh();}finally{this.busy=!1;}}}toggle(e,t){const a=Object.assign({},this.mirrors);t?a[e]=this.info.settings.mirrors[e]||{hold:"last"}:delete a[e],this.mirrors=a;}addExtra(){this.toggle(this.extra.trim(),!0),this.extra="";}async save(){const e=Object.keys(this.info.settings.mirrors).filter(e=>!this.mirrors[e]&&this.sensors[sd(e)]);if(!e.length||window.confirm(`These mirrors are Alarmo zones; removing them makes those zones unavailable:\n${e.map(sd).join("\n")}\n\nContinue?`)){this.busy=!0,this.error="";try{const e=(await Jo(this.hass)).settings;await Xo(this.hass,Object.assign(Object.assign({},e),{mirrors:this.mirrors,ignored_zones:this.ignored,bypass_entity:this.bypassEntity})),Pn(this,"Panel zones saved."),this.locked=!0,this.selection=[],await this.refresh();}catch(e){this.error=Nn(e);}finally{this.busy=!1;}}}async addNow(e,t){var a;const i=e.map(e=>t?sd(e):e).filter(e=>!this.sensors[e]),s=t?i.filter(e=>!this.hass.states[e]):[];if(s.length)this.error=`Turn the mirror on and Save first for: ${s.join(", ")}`;else if(i.length){this.busy=!0;try{const e=await ed(this.hass,this.addTo,i);Pn(this,`${e.create.length} zone(s) added to ${null===(a=this.areas[this.addTo])||void 0===a?void 0:a.name}. Set their Arm Modes on Zone Assignments.${e.backup?` Backup: ${e.backup.name}`:""}`),this.selection=[],await this.refresh();}catch(e){this.error=Nn(e);}finally{this.busy=!1;}}}async addAllAsDrafts(e){const t=this.areas[this.addTo];if(!t)return;const a=e.map(e=>this.mirrors[e]&&this.hass.states[sd(e)]?sd(e):e);if(window.confirm(`Add ${a.length} zone(s) to ${t.name} as drafts? Nothing is saved until you click Save on Zone Assignments.`)){this.busy=!0;try{const e=await ed(this.hass,this.addTo,a,!0);let t={edits:{},added:{},removed:[]};try{t=JSON.parse(window.sessionStorage.getItem(Ro)||"")||t;}catch(e){}e.create.forEach(e=>t.added[e.entity_id]=Object.assign(Object.assign({},Rd),e)),window.sessionStorage.setItem(Ro,JSON.stringify(t)),xn(0,"/alarmo/zones");}catch(e){this.error=Nn(e);}finally{this.busy=!1;}}}async repoint(e){if(window.confirm(`Point ${e.length} Alarmo zone(s) at their mirror? Their settings are kept. A backup is made first.`)){this.busy=!0;try{const t=await td(this.hass,e.map(e=>({from:e,to:sd(e)})));Pn(this,`${t.changed} zone(s) now use mirrors. Backup: ${t.backup.name}`),await this.refresh();}catch(e){this.error=Nn(e);}finally{this.busy=!1;}}}};Ud.styles=Kn,s([ye({attribute:!1})],Ud.prototype,"hass",void 0),s([ye({type:Boolean})],Ud.prototype,"narrow",void 0),s([ye({attribute:!1})],Ud.prototype,"path",void 0),s([be()],Ud.prototype,"info",void 0),s([be()],Ud.prototype,"mirrors",void 0),s([be()],Ud.prototype,"ignored",void 0),s([be()],Ud.prototype,"bypassEntity",void 0),s([be()],Ud.prototype,"sensors",void 0),s([be()],Ud.prototype,"areas",void 0),s([be()],Ud.prototype,"extra",void 0),s([be()],Ud.prototype,"search",void 0),s([be()],Ud.prototype,"error",void 0),s([be()],Ud.prototype,"busy",void 0),s([be()],Ud.prototype,"locked",void 0),s([be()],Ud.prototype,"selection",void 0),s([be()],Ud.prototype,"addTo",void 0),s([be()],Ud.prototype,"showIgnored",void 0),s([be()],Ud.prototype,"mirrorType",void 0),s([be()],Ud.prototype,"useMirrors",void 0),Ud=s([ue("alarm-view-mirrors")],Ud);const Gd=e=>JSON.parse(JSON.stringify(e)),Fd=e=>({monitored:e.monitored,notify_service:e.notify_service||null,trip:e.trip});let Kd=class extends pe{constructor(){super(...arguments),this.narrow=!1,this.sensors={},this.error="",this.busy=!1;}firstUpdated(){this.refresh();}async refresh(){try{const[e,t]=await Promise.all([Jo(this.hass),$e(this.hass)]);this.info=e,this.sensors=t,this.draft=Gd(Fd(e.settings));}catch(e){this.error=Nn(e);}}get dirty(){return!!this.info&&!!this.draft&&JSON.stringify(Fd(this.info.settings))!==JSON.stringify(this.draft);}set(e){const t=Gd(this.draft);e(t),this.draft=t;}haZones(){const e=new Set();return this.info.panels.forEach(t=>t.zones.forEach(t=>{e.add(t.entity_id),e.add(`binary_sensor.${t.entity_id.replace(/^binary_sensor\./,"")}_mirror`);})),Object.keys(this.sensors).filter(t=>!e.has(t)).sort();}render(){if(!this.info||!this.draft)return Z`<ha-card><div class="empty">${this.error||"Loading…"}</div></ha-card>`;const e=this.draft,t=this.haZones(),a=t.filter(e=>this.info.settings.zone_trip[e]).length,i=Object.keys(this.info.settings.links).length>0,s="panel"===((e,t)=>e.zone_trip[t]||(e.monitored?"notify":"panel"))(Object.assign(Object.assign(Object.assign({},this.info.settings),e),{zone_trip:{}}),"_")?"set off the alarm":"notify only";return Z`
      ${this.error?Z`<div class="notice error" style="white-space:pre-line;margin:0 0 12px">${this.error}</div>`:Y}
      <ha-card>${Qn("How HA-only zones raise the alarm","settings")}
        <div class="card-content desc">
          <p>Some Alarmo zones are watched only by Home Assistant — Zigbee/Z-Wave motion, garage covers, smoke detectors
            — not by your physical panel. When one of them triggers the alarm while armed, the physical panel knows
            nothing about it.</p>
          <p>Choose here what Alarmo does then, by default. Each zone can do something else: Zone Assignments → open the
            zone (›) → <em>When tripped</em>. Now: ${t.length} HA-only zone(s)${a?`, ${a} with their own choice`:""}; default
            <em>${s}</em>. Use <em>notify only</em> for zones that give false alarms, like outdoor motion.</p>
          ${i?Y:Z`<div class="notice warn" style="margin:0 0 8px">No physical panel is linked (Physical Panel tab), so these settings are not used yet — Alarmo only uses its own notifications.</div>`}
        </div>
        <div class="detail-grid" style="padding:0 16px 12px">
          <label title="If on, HA-only zones default to notify only, to avoid a false police/fire dispatch">
            <input type="checkbox" .checked=${e.monitored} @change=${e=>this.set(t=>t.monitored=e.target.checked)} />
            The physical panel is professionally monitored</label>
          <label>Set off the alarm with
            <select @change=${e=>this.set(t=>t.trip.method=e.target.value)}>
              <option value="siren" ?selected=${"siren"===e.trip.method}>a siren entity</option>
              <option value="relay" ?selected=${"relay"===e.trip.method}>a relay (switch) wired into a 24-hour zone of the physical panel</option>
              <option value="panic" ?selected=${"panic"===e.trip.method}>a programmed panic key on the physical panel</option>
              <option value="none" ?selected=${"none"===e.trip.method}>nothing (notify only)</option>
            </select>
          </label>
          ${"siren"===e.trip.method||"relay"===e.trip.method?Z`<label>Entity <input type="text" placeholder=${"siren"===e.trip.method?"siren.…":"switch.…"} .value=${e.trip.entity||""}
                @change=${e=>this.set(t=>t.trip.entity=e.target.value.trim()||null)} /></label>`:Y}
          ${"panic"===e.trip.method?Z`<label>Panic
                <select @change=${e=>this.set(t=>t.trip.panic_method=e.target.value)}>
                  <option value="service" ?selected=${"service"===e.trip.panic_method}>the physical panel's alarm trigger</option>
                  <option value="keypress" ?selected=${"keypress"===e.trip.panic_method}>keypresses</option>
                </select></label>
              ${"keypress"===e.trip.panic_method?Z`<label>Keys (e.g. A) <input type="text" style="width:70px" .value=${e.trip.panic_keys} @change=${e=>this.set(t=>t.trip.panic_keys=e.target.value)} /></label>`:Y}
              <span class="secondary" style="display:block">Only works if the key is programmed on the physical panel (Vista: field *57).</span>`:Y}
          <label>Notify service <input type="text" placeholder="notify.mobile_app_…" .value=${e.notify_service||""}
            @change=${e=>this.set(t=>t.notify_service=e.target.value.trim()||null)} /></label>
        </div>
      </ha-card>

      ${this.dirty?Z`<div class="savebar" role="region" aria-label="Unsaved settings">
            <span class="count">Unsaved settings</span>
            <ha-button appearance="plain" ?disabled=${this.busy} @click=${()=>this.draft=Gd(Fd(this.info.settings))}>Discard</ha-button>
            <ha-button ?disabled=${this.busy} @click=${this.save}>${this.busy?"Saving…":"Save"}</ha-button>
          </div>`:Y}
    `;}async save(){if("siren"!==this.draft.trip.method&&"relay"!==this.draft.trip.method||this.draft.trip.entity){this.busy=!0,this.error="";try{const e=(await Jo(this.hass)).settings;await Xo(this.hass,Object.assign(Object.assign({},e),this.draft)),Pn(this,"Saved."),await this.refresh();}catch(e){this.error=Nn(e);}finally{this.busy=!1;}}else this.error=`Choose the ${this.draft.trip.method} entity.`;}};Kd.styles=Kn,s([ye({attribute:!1})],Kd.prototype,"hass",void 0),s([ye({type:Boolean})],Kd.prototype,"narrow",void 0),s([ye({attribute:!1})],Kd.prototype,"path",void 0),s([be()],Kd.prototype,"info",void 0),s([be()],Kd.prototype,"draft",void 0),s([be()],Kd.prototype,"sensors",void 0),s([be()],Kd.prototype,"error",void 0),s([be()],Kd.prototype,"busy",void 0),Kd=s([ue("alarm-view-ha-zones")],Kd);const Zd=e=>JSON.parse(JSON.stringify(e)),Wd={armed_away:"Away",armed_home:"Home (Stay)",armed_night:"Night",armed_vacation:"Vacation",armed_custom_bypass:"Custom",disarmed:"Disarm"};let Yd=class extends pe{constructor(){super(...arguments),this.narrow=!1,this.sensors={},this.areas={},this.error="",this.busy=!1,this.openLinks={},this.newTarget="",this.newPanel="",this.exitPlan={};}firstUpdated(){this.refresh();}async refresh(){try{const[e,t,a]=await Promise.all([Jo(this.hass),$e(this.hass),Ee(this.hass)]);this.info=e,this.sensors=t,this.areas=a,this.draft||(this.draft=Zd(e.settings));}catch(e){this.error=Nn(e);}}get dirty(){return!!this.info&&!!this.draft&&JSON.stringify(this.info.settings)!==JSON.stringify(this.draft);}set(e){const t=Zd(this.draft);e(t),this.draft=t;}render(){if(!this.info||!this.draft)return Z`<ha-card><div class="empty">${this.error||"Loading…"}</div></ha-card>`;const e=((e,t)=>{const a=[];for(const[i,s]of Object.entries(e.links)){const e=t.find(e=>e.entity_id===s.panel_entity),n=Object.values(s.commands).some(e=>"keypress"===e.method&&e.keys.includes("{code}"))||"envisalink"===s.panel_type;e?n&&!e.code_set&&a.push(`${i}: set a default code on ${s.panel_entity} (entity settings) so keypresses can be sent.`):a.push(`${i}: panel ${s.panel_entity} was not found.`);}return"siren"!==e.trip.method&&"relay"!==e.trip.method||e.trip.entity||a.push(`Choose the ${e.trip.method} entity used to set off the alarm.`),a;})(this.draft,this.info.panels);return Z`
      ${this.error?Z`<div class="notice error" style="white-space:pre-line;margin:0 0 12px">${this.error}</div>`:Y}
      ${this.renderLinks()}
      <alarm-view-mirrors .hass=${this.hass} .narrow=${this.narrow} embedded></alarm-view-mirrors>
      <alarm-view-ha-zones .hass=${this.hass} .narrow=${this.narrow} embedded></alarm-view-ha-zones>
      <ha-card><div class="toolbar"><ha-icon icon="mdi:history"></ha-icon>The physical panel link's log is on the <a href="/alarmo/activity">Activity</a> tab, together with everything else that happened.</div></ha-card>
      ${this.dirty?Z`<div class="savebar" role="region" aria-label="Unsaved panel settings">
            <span class="count">
              Unsaved panel settings
              ${e.length?Z`<span class="secondary" style="display:block">${e.join(" ")}</span>`:Y}
            </span>
            <ha-button appearance="plain" ?disabled=${this.busy} @click=${()=>this.draft=Zd(this.info.settings)}>Discard</ha-button>
            <ha-button ?disabled=${this.busy} @click=${this.save}>${this.busy?"Saving…":"Save"}</ha-button>
          </div>`:Y}
    `;}renderLinks(){const e=this.draft,t=this.info.targets.filter(t=>!(t.key in e.links));return Z`
      <ha-card>${Qn("Physical panel link","settings")}
        <div class="card-content desc">
          <p>Keeps an Alarmo alarm (a partition, or All partitions) and your physical alarm panel in step:</p>
          <ul>
            <li>Alarmo arming or disarming is sent to the physical panel and checked (with retries).</li>
            <li>Arming or disarming at the physical panel's keypad is followed by Alarmo.</li>
          </ul>
          <p><strong>Shadow</strong> sends nothing and changes nothing — it only logs what would have happened, so you
            can compare it with your current automations. Switch to <strong>Live</strong> when the log matches.</p>
        </div>
        ${t.length&&this.info.panels.length?Z`<div class="toolbar">
              <select aria-label="Alarmo alarm" @change=${e=>this.newTarget=e.target.value}>
                <option value="">Link Alarmo…</option>
                ${t.map(e=>Z`<option value=${e.key}>${e.name} (${e.entity_id})</option>`)}
              </select>
              to
              <select aria-label="Panel" @change=${e=>this.newPanel=e.target.value}>
                <option value="">panel…</option>
                ${this.info.panels.map(e=>Z`<option value=${e.entity_id}>${e.name} (${e.entity_id})</option>`)}
              </select>
              <ha-button appearance="plain" ?disabled=${!this.newTarget||!this.newPanel} @click=${this.addLink}>Add link</ha-button>
            </div>`:this.info.panels.length?Y:Z`<div class="empty">No physical alarm panel integration found in Home Assistant.</div>`}
        ${Object.entries(e.links).map(([e,t])=>this.renderLink(e,t))}
      </ha-card>
    `;}renderExitMatch(e,t){const a=Object.keys(t.learned_exit_delay||{});if(!a.length)return Z`<div class="secondary" style="padding:0 6px 6px">Once the panel has armed a few times, its exit delays are learned here and
        Alarmo's exit times can be matched to them.</div>`;const i=this.exitPlan[e],s=i?Object.values(i):[];return Z`<div class="field-row">
        <span>Panel exit delays: ${a.map(e=>`${Wd[e]||e} ${t.learned_exit_delay[e]} s`).join(" · ")}</span>
        <ha-button appearance="plain" ?disabled=${this.dirty} @click=${()=>this.checkExit(e)}>Match Alarmo's exit times…</ha-button>
        ${this.dirty?Z`<span class="secondary" style="display:inline">Save first.</span>`:Y}
      </div>
      ${i?s.length?Z`<div class="notice" style="margin:0 0 8px">${s.map(e=>Z`<div><strong>${e.name}</strong>: ${Object.keys(e.changes).map(t=>`${Wd[t]} ${e.before[t]} → ${e.changes[t]} s`).join(", ")}</div>`)}
              <div class="toolbar" style="padding:6px 0 0"><ha-button @click=${()=>this.applyExit(e)}>Apply (backup first)</ha-button>
                <button class="link" @click=${()=>this.exitPlan=Object.assign(Object.assign({},this.exitPlan),{[e]:null})}>Cancel</button></div></div>`:Z`<div class="secondary" style="padding:0 6px 6px">Alarmo's exit times already match the panel.</div>`:Y}`;}async checkExit(e){try{const t=await nd(this.hass,e,!0);this.exitPlan=Object.assign(Object.assign({},this.exitPlan),{[e]:t.plan});}catch(e){this.error=Nn(e);}}async applyExit(e){try{const t=await nd(this.hass,e);Pn(this,`Alarmo exit times updated. Backup: ${t.backup?t.backup.name:"-"}`),this.exitPlan=Object.assign(Object.assign({},this.exitPlan),{[e]:null});}catch(e){this.error=Nn(e);}}addLink(){const e=this.info.panels.find(e=>e.entity_id===this.newPanel);this.set(t=>{return t.links[this.newTarget]=(a=e.entity_id,i=e.platform,{panel_entity:a,mode:"shadow",panel_type:"envisalink_new"===i?"envisalink":"generic",follow_panel:!0,retries:3,retry_delay:5,failure_policy:"disarm",bypass_keys:"{code}6{zone}",commands:{},delays:{},learned_exit_delay:{},arm_order:"panel_leads",confirm_margin:10,follow_map:{}});var a,i;}),this.newTarget=this.newPanel="";}renderLink(e,t){var a,i,s;const n=this.info.targets.find(t=>t.key===e),r=this.info.panels.find(e=>e.entity_id===t.panel_entity),o=this.info.running.includes(e),d=t=>this.set(a=>t(a.links[e])),l=(e,a,i,s)=>Z`
      <alarmo-ext-slider .label=${a} .min=${i} .max=${s} unit=${"retry_delay"===e?"s":""} .value=${t[e]}
        @value-changed=${t=>d(a=>a[e]=t.detail.value)}></alarmo-ext-slider>`,c=null!==(a=this.openLinks[e])&&void 0!==a&&a;return Z`
      <details class="collapse" ?open=${c} @toggle=${t=>this.openLinks=Object.assign(Object.assign({},this.openLinks),{[e]:t.target.open})}>
        <summary>
          <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
          <span class="collapse-title">${(null==n?void 0:n.name)||e} ⇄ ${(null==r?void 0:r.name)||t.panel_entity}</span>
          <span class="role" style=${"live"===t.mode?"color:var(--warning-color,#ffa600);border-color:var(--warning-color,#ffa600)":""}>${t.mode}</span>
          <span class="secondary" style="display:inline">${o?"running":"not running"}${r?` · panel is ${r.state}`:""}</span>
        </summary>
      <div class="collapse-body ${"live"===t.mode?"live":""}">
        <div class="toolbar" style="padding:4px 0">
          <label>Mode
            <select @change=${e=>d(t=>t.mode=e.target.value)}>
              ${["off","shadow","live"].map(e=>Z`<option value=${e} ?selected=${t.mode===e}>${e}</option>`)}
            </select>
          </label>
          <button class="link" @click=${()=>window.confirm("Remove this link?")&&this.set(t=>delete t.links[e])}>Remove link</button>
        </div>
        <h4 class="subhead" style="margin:8px 0 4px">Arming</h4>
        <div class="field-row">
          <label for=${`order-${e}`}>When Alarmo arms</label>
          <select id=${`order-${e}`} @change=${e=>d(t=>t.arm_order=e.target.value)}>
            <option value="panel_leads" ?selected=${"panel_leads"===(t.arm_order||"panel_leads")}>send to the panel at once; Alarmo is armed when the panel is (one exit delay)</option>
            <option value="after_alarmo" ?selected=${"after_alarmo"===t.arm_order}>send to the panel after Alarmo's exit delay (two exit delays)</option>
          </select>
        </div>
        ${"panel_leads"===(t.arm_order||"panel_leads")?Z`<div class="secondary" style="padding:0 6px 6px">Alarmo checks every zone first (panel zones through their mirrors, and the
              zones only Home Assistant watches); nothing is sent if one blocks. If the panel has not finished arming
              ${null!==(i=t.confirm_margin)&&void 0!==i?i:10} s after the longer of its exit delay and Alarmo's, arming counts as failed.</div>
            <alarmo-ext-slider .label=${"Extra time for the panel to confirm"} .min=${0} .max=${60} unit="s" .value=${null!==(s=t.confirm_margin)&&void 0!==s?s:10}
              @value-changed=${e=>d(t=>t.confirm_margin=e.detail.value)}></alarmo-ext-slider>
            ${this.renderExitMatch(e,t)}`:Y}
        <h4 class="subhead" style="margin:10px 0 4px">Arming at the panel (keypad, app)</h4>
        <div class="field-row">
          <label><input type="checkbox" .checked=${t.follow_panel} @change=${e=>d(t=>t.follow_panel=e.target.checked)} />
            Alarmo follows the panel</label>
          <span class="secondary" style="display:inline">Alarmo starts arming when the panel does. Open zones the panel does not watch
            are bypassed in Alarmo and you are told.</span>
        </div>
        ${t.follow_panel?Z`<div class="field-row">${["armed_away","armed_home","armed_night"].map(e=>Z`
              <label>Panel ${Wd[e]} →
                <select aria-label=${`Alarmo mode when the panel arms ${Wd[e]}`}
                  @change=${t=>d(a=>{const i=Object.assign({},a.follow_map||{});t.target.value===e?delete i[e]:i[e]=t.target.value,a.follow_map=i;})}>
                  ${Object.keys(Wd).filter(e=>"disarmed"!==e).map(a=>Z`<option value=${a} ?selected=${((t.follow_map||{})[e]||e)===a}>Alarmo ${Wd[a]}</option>`)}
                </select></label>`)}</div>`:Y}
        <h4 class="subhead" style="margin:10px 0 4px">Commands</h4>
        <div class="detail-grid">
          ${l("retries","Retries",0,10)} ${l("retry_delay","Seconds between tries",1,120)}
          <label>If the panel does not follow
            <select @change=${e=>d(t=>t.failure_policy=e.target.value)}>
              <option value="disarm" ?selected=${"disarm"===t.failure_policy}>disarm Alarmo again + notify</option>
              <option value="keep" ?selected=${"keep"===t.failure_policy}>keep Alarmo armed + notify</option>
            </select>
          </label>
          <label>Panel type
            <select @change=${e=>d(t=>t.panel_type=e.target.value)}>
              <option value="envisalink" ?selected=${"envisalink"===t.panel_type}>Envisalink (keypresses)</option>
              <option value="generic" ?selected=${"generic"===t.panel_type}>Other (HA services only)</option>
            </select>
          </label>
          ${"envisalink"===t.panel_type?Z`<label>Bypass keys <input type="text" .value=${t.bypass_keys} @change=${e=>d(t=>t.bypass_keys=e.target.value)} /></label>`:Y}
        </div>
        ${r&&!r.code_set&&"envisalink"===t.panel_type?Z`<div class="notice error" style="margin:4px 0">Set a <strong>default code</strong> on ${t.panel_entity} (its entity settings) — keypresses use it as {code}.</div>`:Y}
        <div class="table-wrap">
          <table>
            <thead><tr><th>When Alarmo becomes</th><th>Send</th><th>Keys</th><th title="Panel states that count as success">Panel must become</th><th>Wait (s)</th><th>Panel delays (entry / exit s)</th><th>Learned exit</th></tr></thead>
            <tbody>
              ${Qo.map(e=>{const a=t.commands[e];if(!a)return Y;const i=t.delays[e]||{},s=t=>d(a=>t(a.commands[e])),n=t=>Z`<alarmo-ext-slider compact optional .label=${`${Wd[e]}: ${t} delay`}
                  .min=${0} .max=${255} .onValue=${30} unit="s" offText=${"entry"===t?"entry: unknown":"exit: unknown"}
                  .value=${null===i[t]||void 0===i[t]?null:i[t]}
                  @value-changed=${a=>d(i=>i.delays[e]=Object.assign(Object.assign({},i.delays[e]||{}),{[t]:a.detail.value}))}></alarmo-ext-slider>`;return Z`<tr>
                  <td>${Wd[e]}</td>
                  <td><select @change=${e=>s(t=>t.method=e.target.value)}>
                    <option value="service" ?selected=${"service"===a.method}>HA service</option>
                    <option value="keypress" ?selected=${"keypress"===a.method} ?disabled=${"envisalink"!==t.panel_type}>keypresses</option>
                    <option value="none" ?selected=${"none"===a.method}>nothing</option>
                  </select></td>
                  <td>${"keypress"===a.method?Z`<input type="text" style="width:90px" .value=${a.keys} @change=${e=>s(t=>t.keys=e.target.value)} />`:"—"}</td>
                  <td><input type="text" style="width:220px" .value=${(e=>e.join(", "))(a.accept)} @change=${e=>s(t=>t.accept=e.target.value.split(/[\s,]+/).map(e=>e.trim()).filter(e=>e&&(Qo.includes(e)||"triggered"===e)))} /></td>
                  <td><alarmo-ext-slider compact .label=${`${Wd[e]}: timeout`} .min=${5} .max=${300} unit="s" .value=${a.timeout}
                    @value-changed=${e=>s(t=>t.timeout=e.detail.value||20)}></alarmo-ext-slider></td>
                  <td>${"disarmed"===e?"—":Z`${n("entry")}${n("exit")}`}</td>
                  <td>${void 0!==t.learned_exit_delay[e]?`${t.learned_exit_delay[e]} s`:"—"}</td>
                </tr>`;})}
            </tbody>
          </table>
        </div>
        <p class="secondary" style="display:block">
          Keys: <code>{code}</code> is the default code of the panel entity; <code>{zone}</code> the two-digit zone number.
          Vista examples: 3 = Stay, 2 = Away, 33 = Night, 7 = Instant, 4 = Max, 1 = Off. Panel delays are only for reference;
          the panel's own settings decide them.
        </p>
      </div>
      </details>
    `;}async save(){this.busy=!0,this.error="";try{const e=await Xo(this.hass,this.draft);this.draft=Zd(e),this.info=Object.assign(Object.assign({},this.info),{settings:e}),Pn(this,"Panel settings saved."),await this.refresh(),this.draft=Zd(this.info.settings);}catch(e){this.error=Nn(e);}finally{this.busy=!1;}}};Yd.styles=Kn,s([ye({attribute:!1})],Yd.prototype,"hass",void 0),s([ye({type:Boolean})],Yd.prototype,"narrow",void 0),s([ye({attribute:!1})],Yd.prototype,"path",void 0),s([be()],Yd.prototype,"info",void 0),s([be()],Yd.prototype,"draft",void 0),s([be()],Yd.prototype,"sensors",void 0),s([be()],Yd.prototype,"areas",void 0),s([be()],Yd.prototype,"error",void 0),s([be()],Yd.prototype,"busy",void 0),s([be()],Yd.prototype,"openLinks",void 0),s([be()],Yd.prototype,"newTarget",void 0),s([be()],Yd.prototype,"newPanel",void 0),s([be()],Yd.prototype,"exitPlan",void 0),Yd=s([ue("alarm-view-panel")],Yd);const Qd=e=>JSON.parse(JSON.stringify(e)),Jd={armed_away:"Away",armed_home:"Home (Stay)",armed_night:"Night",armed_vacation:"Vacation",armed_custom_bypass:"Custom",disarmed:"Disarm"},Xd=e=>e.split(/[\s,]+/).map(e=>e.trim()).filter(Boolean);let el=class extends pe{constructor(){super(...arguments),this.narrow=!1,this.open=[],this.error="",this.busy=!1,this.lastBlocked=null;}firstUpdated(){this.refresh();}async refresh(e=!1){try{if(this.info=await Vr(this.hass),!this.draft||e)this.draft=Qd(this.info.settings);else{const e=this.info.settings;this.draft=Object.assign(Object.assign({},this.draft),{current:e.current,previous:e.previous,source:e.source,changed_at:e.changed_at,history:e.history,pending:e.pending});}}catch(e){this.error=Nn(e);}}editable(e){const{current:t,previous:a,source:s,changed_at:n,history:r,pending:o}=e,d=i(e,["current","previous","source","changed_at","history","pending"]);return JSON.stringify(d);}get dirty(){return!!this.info&&!!this.draft&&this.editable(this.info.settings)!==this.editable(this.draft);}set(e){const t=Qd(this.draft);e(t),this.draft=t;}setMode(e,t){this.set(a=>t(a.modes.find(t=>t.id===e)));}render(){if(!this.info||!this.draft)return Z`<ha-card><div class="empty">${this.error||"Loading…"}</div></ha-card>`;const e=(e=>{const t=[],a=e.map(e=>e.name.trim().toLowerCase());a.some(e=>!e)&&t.push("Every House Mode needs a name."),new Set(a).size!==a.length&&t.push("House Mode names must be unique.");const i=new Set(e.map(e=>e.id));for(const a of e)for(const e of a.timers)"previous"===e.then||i.has(e.then)||t.push(`${a.name}: a timer goes to a mode that no longer exists.`);return t;})(this.draft.modes);return Z`
      ${this.error?Z`<div class="notice error" style="white-space:pre-line;margin:0 0 12px">${this.error}</div>`:Y}
      ${this.renderCurrent()} ${this.renderModes()}
      <ha-card><div class="toolbar"><ha-icon icon="mdi:history"></ha-icon>House Mode history and every sequence around it are on the <a href="/alarmo/activity">Activity</a> tab.</div></ha-card>
      ${this.dirty?Z`<div class="savebar" role="region" aria-label="Unsaved House Mode settings">
            <span class="count">Unsaved House Mode settings
              ${e.length?Z`<span class="secondary" style="display:block">${e.join(" ")}</span>`:Y}</span>
            <ha-button appearance="plain" ?disabled=${this.busy} @click=${()=>this.draft=Qd(this.info.settings)}>Discard</ha-button>
            <ha-button ?disabled=${this.busy||e.length>0} @click=${this.save}>${this.busy?"Saving…":"Save"}</ha-button>
          </div>`:Y}
    `;}renderCurrent(){const e=this.info.settings,t=e.modes.find(t=>t.id===e.current);return Z`
      <ha-card>${Qn("House Mode","settings")}
        <div class="card-content desc">
          <p>A House Mode says what is going on at home — Away, Stay, Guest, Spa, … Each mode:</p>
          <ul>
            <li>sets the partitions to an Arm Mode (or leaves them alone);</li>
            <li>decides <strong>who may change it</strong>: you, schedules, presence, a lock code, the keypad;</li>
            <li>can check that zones are closed, and can change itself back after a while.</li>
          </ul>
          <p>Lights, locks and other actions stay in your automations: trigger them on
            <code>select.alarmo_house_mode</code> or the <code>alarmo_house_mode_changed</code> event. Automations change
            the mode with <code>alarmo.set_house_mode</code> (mode + source).</p>
          <p><em>House Mode input_select entity</em> — an existing input_select kept in step both ways; its options must
            match the mode names. <em>Notifications</em> — where House Mode messages go. Lock keypads and per-user keypad
            actions are on the <a href="/alarmo/codes">Users, Codes, Keypads</a> tab.</p>
        </div>
        <div class="toolbar">
          <label><input type="checkbox" .checked=${this.draft.enabled} @change=${e=>this.set(t=>t.enabled=e.target.checked)} />
            Use House Modes</label>
          <span class="grow"></span>
          ${e.enabled?Z`<span>Now: <strong>${t?t.name:"unknown"}</strong>
                ${e.changed_at?Z`<span class="secondary" style="display:inline">since ${Dn(e.changed_at,this.hass.language)} (${e.source})</span>`:Y}</span>`:Z`<span class="secondary" style="display:inline">Off — save with "Use House Modes" ticked to start.</span>`}
        </div>
        ${e.enabled&&e.modes.length?Z`<div class="toolbar">
              ${e.modes.map(t=>Z`<ha-button appearance=${t.id===e.current?"filled":"plain"} ?disabled=${this.busy||this.dirty} @click=${()=>this.choose(t.id)}>
                <ha-icon slot="start" icon=${t.icon}></ha-icon>${t.name}</ha-button>`)}
              ${this.dirty?Z`<span class="secondary" style="display:inline">Save first.</span>`:Y}
            </div>`:Y}
        ${this.renderSettingsRow()}
        ${this.lastBlocked?Z`<div class="notice warn">${this.lastBlocked.reason}
              <button class="link" @click=${()=>this.choose(this.lastBlocked.mode,!0)}>Change anyway</button></div>`:Y}
        ${e.pending.length?Z`<div class="notice">${e.pending.map(t=>{const a=e.modes.find(e=>e.id===t.target);return Z`<div>${"delayed"===t.kind?"Delayed request":"Timer"}: ${a?a.name:t.target} at ${new Date(1e3*t.due).toLocaleTimeString()}</div>`;})}</div>`:Y}
      </ha-card>
    `;}async choose(e,t=!1){var a;this.busy=!0,this.error="",this.lastBlocked=null;try{const i=await((e,t,a=!1)=>e.callWS({type:"alarmo/ext/house/set",mode:t,force:a}))(this.hass,e,t),s=(null===(a=this.info.settings.modes.find(t=>t.id===e))||void 0===a?void 0:a.name)||e;"blocked"===i.result?this.lastBlocked={mode:e,reason:i.reason||"Not allowed now."}:"not_ready"===i.result?this.lastBlocked={mode:e,reason:`Not ready, open: ${(i.open||[]).join(", ")}`}:"failed"===i.result?this.error=`${s} failed: ${(i.failed||[]).join(", ")} did not arm.`:"delayed"===i.result?Pn(this,`${s} in ${i.minutes} min.`):Pn(this,`House Mode: ${s}`),await this.refresh();}catch(e){this.error=Nn(e);}finally{this.busy=!1;}}renderModes(){const e=this.draft,t={};return this.info.targets.forEach(e=>t[e.key]=e.name),Z`
      <ha-card>${Qn(`Modes (${e.modes.length})`,"settings")}
        <div class="card-content desc">
          <p>Open a mode (▸) to set which partitions it arms, who may switch into or out of it, readiness checks, what
            happens if arming fails, and timers. Save at the bottom of the page.</p>
        </div>
        <div class="toolbar">
          <ha-button appearance="plain" @click=${this.addMode}><ha-icon slot="start" icon="mdi:plus-circle"></ha-icon>Add House Mode</ha-button>
          ${e.modes.length?Y:Z`<ha-button appearance="plain" @click=${this.addStarter}><ha-icon slot="start" icon="mdi:auto-fix"></ha-icon>Add starter modes</ha-button>`}
        </div>
        ${e.modes.map(e=>{const a=this.open.includes(e.id);return Z`
            <div class="toolbar" style="border-top:1px solid var(--divider-color)">
              <button class="link" @click=${()=>this.open=a?this.open.filter(t=>t!==e.id):[...this.open,e.id]}>${a?"▾":"▸"}</button>
              <ha-icon icon=${e.icon}></ha-icon><strong>${e.name}</strong>
              <span class="secondary grow" style="display:inline">${((e,t,a)=>{const i=Object.entries(e.targets).map(([e,i])=>`${t[e]||e}: ${a(i)}`);return i.length?i.join(" · "):"no partition changes";})(e,t,e=>Jd[e]||e)}</span>
              <button class="link" @click=${()=>window.confirm(`Delete ${e.name}?`)&&(this.draft=((e,t)=>Object.assign(Object.assign({},e),{modes:e.modes.filter(e=>e.id!==t).map(e=>Object.assign(Object.assign({},e),{timers:e.timers.filter(e=>e.then!==t)})),lock_keypads:e.lock_keypads.map(e=>{const a={};return Object.keys(e.slots).forEach(i=>{e.slots[i]!==t&&(a[i]=e.slots[i]);}),Object.assign(Object.assign({},e),{slots:a});}),current:e.current===t?null:e.current}))(this.draft,e.id))}>Delete</button>
            </div>
            ${a?this.renderEditor(e):Y}
          `;})}
      </ha-card>
    `;}addMode(){const e=window.prompt("Name of the new House Mode");if(!e)return;const t=Ur(e.trim(),this.draft.modes);this.set(e=>e.modes.push(t)),this.open=[...this.open,t.id];}addStarter(){var e;const t=null===(e=this.info.targets.find(e=>"master"===e.key)||this.info.targets[0])||void 0===e?void 0:e.key,a=(e,a,i={})=>{const s=Object.assign(Object.assign({},Ur(e,[])),i);return t&&a&&(s.targets={[t]:a}),s;},i=[...qr];this.set(e=>{e.modes=[a("Disarmed","disarmed"),a("Stay","armed_home"),a("Sleep","armed_night"),a("Away","armed_away"),a("Vacation","armed_vacation",{leave_sources:["manual","presence_home","lock","panel_keypad"]}),a("Guest","disarmed",{leave_sources:i.filter(e=>"presence_away"!==e)}),a("Local","disarmed",{enter_sources:["manual"],leave_sources:i.filter(e=>"presence_away"!==e)}),a("Spa","armed_custom_bypass",{enter_sources:["manual"],delay_sources:{schedule:30},timers:[{after_minutes:45,then:"previous",from_modes:[],notify:!0}]})];});}renderEditor(e){const t=t=>this.setMode(e.id,t),a=this.draft.modes.filter(t=>t.id!==e.id);return Z`
      <div class="notice" style="margin:0 16px 12px">
        <div class="detail-grid">
          <label>Name <input type="text" .value=${e.name} @change=${e=>t(t=>t.name=e.target.value)} /></label>
          <label>Icon <input type="text" .value=${e.icon} @change=${e=>t(t=>t.icon=e.target.value||"mdi:home")} /></label>
          <label title="What happens when a partition does not arm">If arming fails
            <select @change=${e=>t(t=>t.on_failure=e.target.value)}>
              <option value="undo" ?selected=${"undo"===e.on_failure}>undo (back to how it was)</option>
              <option value="keep" ?selected=${"keep"===e.on_failure}>keep what armed (mode unknown)</option>
              <option value="previous" ?selected=${"previous"===e.on_failure}>go to the previous mode</option>
            </select>
          </label>
        </div>
        <h4 style="margin:8px 0 4px">Partitions</h4>
        <div class="detail-grid">
          ${this.info.targets.map(a=>Z`<label>${a.name}
            <select @change=${e=>t(t=>{""===e.target.value?delete t.targets[a.key]:t.targets[a.key]=e.target.value;})}>
              <option value="" ?selected=${!e.targets[a.key]}>leave unchanged</option>
              ${Ir.map(t=>Z`<option value=${t} ?selected=${e.targets[a.key]===t}>${Jd[t]}</option>`)}
            </select></label>`)}
        </div>
        <span class="secondary" style="display:block">Leave everything unchanged for a mode that only tells your automations what is going on.</span>
        <h4 class="subhead" style="margin:8px 0 4px">Who may change it</h4>
        <div class="table-wrap"><table>
          <thead><tr><th>Source</th><th class="c" title="May switch INTO this mode">Into this mode</th><th class="c" title="May change the mode while this mode is active">Out of this mode</th><th title="Instead of blocking, wait this many minutes">Delay out (min)</th></tr></thead>
          <tbody>${qr.map(a=>Z`<tr>
            <td>${Br[a]}</td>
            <td class="c"><input type="checkbox" .checked=${e.enter_sources.includes(a)} @change=${e=>t(t=>t.enter_sources=e.target.checked?[...t.enter_sources,a]:t.enter_sources.filter(e=>e!==a))} /></td>
            <td class="c"><input type="checkbox" .checked=${e.leave_sources.includes(a)} @change=${e=>t(t=>t.leave_sources=e.target.checked?[...t.leave_sources,a]:t.leave_sources.filter(e=>e!==a))} /></td>
            <td><alarmo-ext-slider compact optional .label=${`${Br[a]}: delay out`} .min=${1} .max=${120} .onValue=${10}
              unit="min" offText="no delay" .value=${e.delay_sources[a]||null}
              @value-changed=${e=>t(t=>{e.detail.value?t.delay_sources[a]=e.detail.value:delete t.delay_sources[a];})}></alarmo-ext-slider></td>
          </tr>`)}</tbody>
        </table></div>
        <h4 style="margin:8px 0 4px">Readiness</h4>
        <div class="detail-grid">
          <label>Entities that should be closed <input type="text" style="width:320px" placeholder="binary_sensor.patio_door, …" .value=${e.readiness.entities.join(", ")}
            @change=${e=>t(t=>t.readiness.entities=Xd(e.target.value))} /></label>
          <label>…or with label (ids) <input type="text" placeholder="windows" .value=${e.readiness.labels.join(", ")}
            @change=${e=>t(t=>t.readiness.labels=Xd(e.target.value))} /></label>
          <label>If open
            <select @change=${e=>t(t=>t.readiness.action=e.target.value)}>
              <option value="warn" ?selected=${"warn"===e.readiness.action}>warn and continue</option>
              <option value="block" ?selected=${"block"===e.readiness.action}>do not change the mode</option>
            </select></label>
        </div>
        <h4 class="subhead" style="margin:8px 0 4px">Timers</h4>
        <button class="link" @click=${()=>t(e=>e.timers.push({after_minutes:10,then:"previous",from_modes:[],window_start:null,window_end:null,notify:!0}))}>+ Add timer</button>
        ${e.timers.map((e,i)=>Z`<div class="detail-grid">
          <alarmo-ext-slider .label=${"After"} .min=${1} .max=${720} unit="min" .value=${e.after_minutes}
            @value-changed=${e=>t(t=>t.timers[i].after_minutes=Math.max(1,e.detail.value||1))}></alarmo-ext-slider>
          <label>go to <select @change=${e=>t(t=>t.timers[i].then=e.target.value)}>
            <option value="previous" ?selected=${"previous"===e.then}>the previous mode</option>
            ${a.map(t=>Z`<option value=${t.id} ?selected=${e.then===t.id}>${t.name}</option>`)}
          </select></label>
          <label>only when coming from <input type="text" placeholder="any mode (ids)" .value=${e.from_modes.join(", ")} @change=${e=>t(t=>t.timers[i].from_modes=Xd(e.target.value))} /></label>
          <label>between <input type="time" .value=${e.window_start||""} @change=${e=>t(t=>t.timers[i].window_start=e.target.value||null)} />
            and <input type="time" .value=${e.window_end||""} @change=${e=>t(t=>t.timers[i].window_end=e.target.value||null)} /></label>
          <label><input type="checkbox" .checked=${e.notify} @change=${e=>t(t=>t.timers[i].notify=e.target.checked)} /> notify</label>
          <button class="link" @click=${()=>t(e=>e.timers.splice(i,1))}>Remove</button>
        </div>`)}
        <span class="secondary" style="display:block">Timers start when this mode begins, survive restarts, and are cancelled when the mode changes. A timer only switches if the target mode allows the "House Mode timers" source.</span>
      </div>
    `;}renderSettingsRow(){const e=this.draft,t=Object.keys(this.hass.states).filter(e=>e.startsWith("input_select.")).sort(),a=Object.keys(this.hass.services.notify||{}).map(e=>({value:`notify.${e}`,label:`notify.${e}`}));return Z`
      <div class="detail-grid" style="padding:4px 16px 12px;align-items:flex-start">
        <label>House Mode input_select entity
          <select @change=${e=>this.set(t=>t.input_select=e.target.value||null)}>
            <option value="" ?selected=${!e.input_select}>none</option>
            ${t.map(t=>Z`<option value=${t} ?selected=${e.input_select===t}>${this.hass.states[t].attributes.friendly_name||t} (${t})</option>`)}
          </select>
        </label>
        <alarmo-ext-multi-picker
          .label=${"Notifications"}
          .placeholder=${"Add a notify service…"}
          .options=${a}
          .value=${e.notify_services||[]}
          @value-changed=${e=>this.set(t=>t.notify_services=e.detail.value)}
        ></alarmo-ext-multi-picker>
      </div>
      ${e.input_select&&e.modes.length?Z`<div class="notice" style="margin:0 16px 12px">Options needed on ${e.input_select}: ${e.modes.map(e=>e.name).join(", ")}.</div>`:Y}
    `;}async save(){this.busy=!0,this.error="";try{await(e=this.hass,t=this.draft,e.callWS({type:"alarmo/ext/house/save",settings:t})),Pn(this,"House Modes saved."),await this.refresh(!0);}catch(e){this.error=Nn(e);}finally{this.busy=!1;}var e,t;}};el.styles=Kn,s([ye({attribute:!1})],el.prototype,"hass",void 0),s([ye({type:Boolean})],el.prototype,"narrow",void 0),s([ye({attribute:!1})],el.prototype,"path",void 0),s([be()],el.prototype,"info",void 0),s([be()],el.prototype,"draft",void 0),s([be()],el.prototype,"open",void 0),s([be()],el.prototype,"error",void 0),s([be()],el.prototype,"busy",void 0),s([be()],el.prototype,"lastBlocked",void 0),el=s([ue("alarm-view-house")],el);const tl=[{id:"general",view:"general",section:"general",titleKey:"panels.general.title"},{id:"house",view:"house",titleKey:"panels.house.title"},{id:"why",view:"why",titleKey:"panels.why.title"},{id:"partitions",view:"general",section:"partitions",titleKey:"panels.partitions.title"},{id:"zones",view:"sensor_table",titleKey:"panels.zones.title"},{id:"zones_legacy",view:"sensors",titleKey:"panels.zones_legacy.title"},{id:"codes",view:"codes",titleKey:"panels.users_codes.title"},{id:"notifications",view:"actions",section:"notifications",titleKey:"panels.notifications.title"},{id:"actions",view:"actions",section:"actions",titleKey:"panels.actions.title"},{id:"panel",view:"panel",titleKey:"panels.panel.title"},{id:"activity",view:"activity",titleKey:"panels.activity.title"},{id:"backup",view:"backup",titleKey:"panels.backup.title"}],al={sensors:"zones_legacy",sensor_table:"zones",mirrors:"panel",connections:"codes",ha_zones:"panel",modes:"partitions"},il=(e,t,a={})=>{const i=e||"general";return i in al?tl.find(e=>e.id===al[i]):"general"===i&&a.edit_area?tl.find(e=>"partitions"===e.id):"actions"===i?"new_notification"===t||a.edit_notification?tl.find(e=>"notifications"===e.id):tl.find(e=>"actions"===e.id):tl.find(e=>e.id===i);},sl=(e,t={})=>!!e||Object.values(t).some(e=>void 0!==e),nl={disarmed:"mdi:shield-off-outline",armed_away:"mdi:shield-lock",armed_home:"mdi:shield-home",armed_night:"mdi:shield-moon",armed_vacation:"mdi:shield-airplane",armed_custom_bypass:"mdi:shield-half-full",arming:"mdi:shield-sync",pending:"mdi:shield-alert-outline",triggered:"mdi:bell-ring"},rl=e=>(e||"unknown").replace(/_/g," ");let ol=class extends pe{constructor(){super(...arguments),this.load=async()=>{try{this.info=await(e=this.hass,e.callWS({type:"alarmo/ext/status"}));}catch(e){}var e;};}connectedCallback(){super.connectedCallback(),this.load(),this.timer=window.setInterval(()=>this.load(),15e3),window.addEventListener("alarmo-ext-ui-changed",this.load);}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this.timer),window.removeEventListener("alarmo-ext-ui-changed",this.load);}go(e){xn(0,e),window.setTimeout(this.load,1500);}chip(e,t,a,i,s=""){return Z`<button class="chip ${s}" title=${a} @click=${()=>this.go(i)}>
      <ha-icon icon=${e}></ha-icon><span>${t}</span>
    </button>`;}render(){const e=this.info;if(!e)return Y;const t=e=>e?this.hass.states[e]:void 0,a=(()=>{try{return!!window.sessionStorage.getItem(Ro);}catch(e){return!1;}})();return Z`
      <div class="strip" role="status" aria-label="Alarmo status">
        ${e.house.enabled?this.chip(e.house.icon||"mdi:home",`House Mode: ${e.house.name||"unknown"}`,`Changed by ${e.house.source||"—"}`,"/alarmo/house"):Y}
        ${e.alarms.map(e=>{var a;const i=null===(a=t(e.entity_id))||void 0===a?void 0:a.state,s="triggered"===i?"bad":"pending"===i||"arming"===i?"warn":i&&"disarmed"!==i?"on":"";return this.chip(nl[i||""]||"mdi:shield-outline",`${e.name}: ${rl(i)}`,e.entity_id,"/alarmo/why",s);})}
        ${e.links.map(e=>{const a=t(e.panel_entity),i=t(e.ready_entity),s=(null==a?void 0:a.attributes.friendly_name)||e.panel_entity,n=i?"on"===i.state?" · ready":" · not ready":"",r=e.running||"off"===e.mode?"live"===e.mode?"on":"":"bad";return this.chip("mdi:alarm-panel-outline",`${s}: ${rl(null==a?void 0:a.state)}${n} · ${e.mode}`,`Physical panel link (${e.running?"running":"not running"})`,"/alarmo/panel",r);})}
        ${e.rules_pending?this.chip("mdi:auto-fix",`${e.rules_pending} zone rule change(s) pending`,"Review on Zone Assignments","/alarmo/zones","warn"):Y}
        ${a?this.chip("mdi:pencil-circle","Unsaved zone edits","Zone Assignments has unsaved changes","/alarmo/zones","warn"):Y}
        <span class="grow"></span>
        ${this.chip("mdi:help-circle-outline","Why won't it arm?","What blocks arming right now","/alarmo/why")}
      </div>
    `;}};ol.styles=h`
    :host {
      display: block;
    }
    .strip {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px 8px;
      padding: 8px 12px 0;
    }
    .grow {
      flex: 1 1 auto;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 10px 3px 8px;
      border-radius: 14px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 13px;
      cursor: pointer;
      --mdc-icon-size: 16px;
      white-space: nowrap;
    }
    .chip:hover {
      border-color: var(--primary-color);
    }
    .chip.on {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .chip.warn {
      border-color: var(--warning-color, #ffa600);
      color: var(--warning-color, #ffa600);
    }
    .chip.bad {
      border-color: var(--error-color, #f44336);
      color: var(--error-color, #f44336);
    }
  `,s([ye({attribute:!1})],ol.prototype,"hass",void 0),s([be()],ol.prototype,"info",void 0),ol=s([ue("alarmo-ext-status-strip")],ol);const dl={armed_away:"Away",armed_home:"Home (Stay)",armed_night:"Night",armed_vacation:"Vacation",armed_custom_bypass:"Custom"},ll={open:"var(--warning-color, #ffa600)",closed:"var(--success-color, #43a047)",unavailable:"var(--error-color, #f44336)",unknown:"var(--secondary-text-color)"};let cl=class extends pe{constructor(){super(...arguments),this.narrow=!1,this.error="",this.sensors={},this.areas={},this.walkArea="",this.walking=!1,this.walk={},this.walkOpen=!1,this.lastStates={};}firstUpdated(){this.load();}disconnectedCallback(){super.disconnectedCallback(),window.clearTimeout(this.refreshTimer);}async load(){try{const[t,a,i]=await Promise.all([(e=this.hass,e.callWS({type:"alarmo/ext/why"})),$e(this.hass),Ee(this.hass)]);this.why=t,this.sensors=a,this.areas=i,this.walkArea||(this.walkArea=Object.keys(i)[0]||""),this.error="";}catch(e){this.error=Nn(e);}var e;}name(e){var t;return(null===(t=this.hass.states[e])||void 0===t?void 0:t.attributes.friendly_name)||e;}updated(e){var t,a,i;if(!e.has("hass")||!this.hass)return;const s=[...Object.keys(this.sensors),...((null===(t=this.why)||void 0===t?void 0:t.areas.map(e=>e.entity_id))||[]),...((null===(a=this.why)||void 0===a?void 0:a.panels.map(e=>e.ready_entity||""))||[])];let n=!1;for(const e of s){const t=null===(i=this.hass.states[e])||void 0===i?void 0:i.state;t!==this.lastStates[e]&&(this.walking&&e in this.sensors&&(this.walk=Ko(this.walk,e,t)),this.lastStates[e]=t,n=!0);}n&&this.why&&(window.clearTimeout(this.refreshTimer),this.refreshTimer=window.setTimeout(()=>this.load(),800));}render(){return Z`
      ${this.error?Z`<div class="notice error" style="margin:0 0 12px">${this.error}</div>`:Y}
      ${this.renderWhy()} ${this.renderWalk()}
    `;}renderWhy(){const e=this.why;return Z`
      <ha-card>${Qn("Why won't it arm?","readonly")}
        <div class="card-content desc">
          <p>Alarmo's own check, live: for each partition and Arm Mode, the zones that would stop it from arming now.</p>
          <ul>
            <li>Zones with <em>Use exit delay</em> may be open when you start arming, but must be closed when the exit delay
              ends.</li>
            <li>Open motion zones do not count while disarmed (Alarmo ignores them for "ready").</li>
            <li>Auto-bypassed zones are listed separately: they are skipped, not blocking.</li>
          </ul>
        </div>
        <div class="toolbar"><ha-button appearance="plain" @click=${()=>this.load()}><ha-icon slot="start" icon="mdi:refresh"></ha-icon>Check again</ha-button></div>
        ${e?Z`
              ${e.panels.map(e=>Z`<div class="notice ${!1===e.ready?"warn":""}" style="margin:0 16px 12px">
                  <strong>Physical panel</strong> ${this.name(e.panel_entity)} (${e.mode}):
                  ${null===e.ready?Z`no "Ready" sensor found, so its readiness is unknown.`:e.ready?Z`ready to arm.`:Z`<strong>not ready</strong>. A zone is faulted on the panel itself (${this.name(e.ready_entity)}); check its keypad.`}
                </div>`)}
              ${e.areas.map(e=>Z`
                  <h4 class="subhead" style="margin:8px 16px 4px">${e.name} — ${(e.state||"unknown").replace(/_/g," ")}</h4>
                  <div class="table-wrap"><table>
                    <thead><tr><th>Arm Mode</th><th>Ready</th><th>What blocks it</th><th>Auto-bypassed</th></tr></thead>
                    <tbody>${e.modes.map(e=>Z`<tr>
                        <td>${dl[e.mode]||e.mode}</td>
                        <td>${e.ready?Z`<ha-icon icon="mdi:check-circle" style="color:var(--success-color,#43a047)" title="Ready"></ha-icon>`:Z`<ha-icon icon="mdi:close-circle" style="color:var(--error-color,#f44336)" title="Not ready"></ha-icon>`}</td>
                        <td style="white-space:normal">${e.blocking.length?e.blocking.map(t=>Z`<div class="blk">${Xn(this.hass,t.entity_id)} ${this.name(t.entity_id)}
                                <span class="secondary" style="display:inline">— ${t.reason}${t.motion?" (motion: ignored while disarmed)":""}${t.exit_delay&&e.exit_time?` · may be open for the ${e.exit_time} s exit delay`:""}</span></div>`):Z`<span class="secondary" style="display:inline">nothing</span>`}</td>
                        <td style="white-space:normal">${e.bypassed.length?e.bypassed.map(e=>Z`<div>${this.name(e)}</div>`):"—"}</td>
                      </tr>`)}</tbody>
                  </table></div>
                `)}
              ${e.house_modes.length?Z`<h4 class="subhead" style="margin:8px 16px 4px">House Mode readiness</h4>
                    <div class="table-wrap"><table>
                      <thead><tr><th>House Mode</th><th>Open now</th><th>If open</th></tr></thead>
                      <tbody>${e.house_modes.map(e=>Z`<tr>
                        <td>${e.name}</td>
                        <td style="white-space:normal">${e.open.length?e.open.map(e=>Z`<div>${this.name(e)}</div>`):Z`<span class="secondary" style="display:inline">nothing</span>`}</td>
                        <td>${"block"===e.action?"blocks the change":"warns only"}</td>
                      </tr>`)}</tbody>
                    </table></div>`:Y}
            `:Z`<div class="empty">Checking…</div>`}
      </ha-card>
    `;}walkZones(){return Object.values(this.sensors).filter(e=>e.area===this.walkArea&&e.enabled).map(e=>e.entity_id).sort((e,t)=>this.name(e).localeCompare(this.name(t)));}startWalk(){this.walk={},this.walkZones().forEach(e=>{var t;return this.walk=Object.assign(Object.assign({},this.walk),{[e]:{opened:!1,closed:!1,last:null===(t=this.hass.states[e])||void 0===t?void 0:t.state}});}),this.walking=!0;}renderWalk(){var e;const t=this.walkZones(),a=t.filter(e=>!this.sensors[e].always_on),i=t.filter(e=>this.sensors[e].always_on),s=null===(e=this.why)||void 0===e?void 0:e.areas.find(e=>e.area_id===this.walkArea),n=!s||"disarmed"===s.state,r=((e,t)=>{const a=t.filter(t=>Zo(e[t])).length,i=t.filter(t=>e[t]&&e[t].opened&&!e[t].closed).length;return{passed:a,open:i,left:t.length-a,total:t.length};})(this.walk,a);return Z`
      <ha-card>${Qn("Walk test","readonly")}
        <details class="collapse" ?open=${this.walking||this.walkOpen} @toggle=${e=>this.walkOpen=e.target.open}>
          <summary>
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <span class="collapse-title">Run a walk test</span>
            ${this.walking||r.passed?Z`<span class="role">${r.passed} of ${r.total} passed</span>`:Y}
            <span class="secondary" style="display:inline">open and close each zone to check it reports</span>
          </summary>
          <div class="collapse-body">
        <div class="card-content desc">
          <p>Checks that every zone reports to Home Assistant: open and close each one (walk past each motion zone), and
            it ticks off. Nothing is armed and nothing is changed.</p>
          <ul>
            <li>Run it with the partition <strong>disarmed</strong>. <em>Always on</em> zones (fire, 24-hour) would raise the
              Alarmo alarm even then, so they are left out.</li>
            <li>The physical panel still reacts to its own zones. If it would sound, put it in its own test mode first
              (Vista: usually code + 5 at the keypad — check your panel's manual).</li>
          </ul>
        </div>
        <div class="toolbar">
          ${this.walking?Z`<ha-button @click=${()=>this.walking=!1}><ha-icon slot="start" icon="mdi:stop"></ha-icon>Stop</ha-button>
                <ha-button appearance="plain" @click=${this.startWalk}>Start over</ha-button>`:Z`<ha-button ?disabled=${!a.length||!n} @click=${this.startWalk}><ha-icon slot="start" icon="mdi:walk"></ha-icon>Start walk test</ha-button>`}
          <label>Partition
            <select ?disabled=${this.walking} @change=${e=>this.walkArea=e.target.value}>
              ${Object.values(this.areas).map(e=>Z`<option value=${e.area_id} ?selected=${e.area_id===this.walkArea}>${e.name}</option>`)}
            </select>
          </label>
          ${n?Y:Z`<span class="secondary" style="display:inline;color:var(--warning-color,#ffa600)">Disarm the partition first.</span>`}
          ${this.walking||r.passed?Z`<strong>${r.passed} of ${r.total} passed</strong>${r.open?Z`<span class="secondary" style="display:inline">· ${r.open} open now</span>`:Y}`:Y}
        </div>
        ${a.length?Z`<div class="table-wrap"><table>
              <thead><tr><th class="icon"></th><th>Zone</th><th>Now</th><th class="c">Opened</th><th class="c">Closed again</th></tr></thead>
              <tbody>${a.map(e=>{var t;const a=this.walk[e],i=Fo(null===(t=this.hass.states[e])||void 0===t?void 0:t.state),s=e=>e?Z`<ha-icon icon="mdi:check-circle" style="color:var(--success-color,#43a047)"></ha-icon>`:Z`<ha-icon icon="mdi:circle-outline" style="color:var(--disabled-text-color,#9e9e9e)"></ha-icon>`;return Z`<tr class=${Zo(a)?"passed":""}>
                  <td class="icon">${Xn(this.hass,e)}</td>
                  <td class="name">${this.name(e)}<span class="secondary">${e}</span></td>
                  <td><span style=${`color:${ll[i]}`}>${i}</span></td>
                  <td class="c">${s(null==a?void 0:a.opened)}</td>
                  <td class="c">${s(null==a?void 0:a.closed)}</td>
                </tr>`;})}</tbody>
            </table></div>`:Z`<div class="empty">No enabled zones in this partition.</div>`}
        ${i.length?Z`<div class="secondary" style="padding:0 16px 12px">Left out (always on): ${i.map(e=>this.name(e)).join(", ")}.</div>`:Y}
          </div>
        </details>
      </ha-card>
    `;}};cl.styles=Kn,s([ye({attribute:!1})],cl.prototype,"hass",void 0),s([ye({type:Boolean})],cl.prototype,"narrow",void 0),s([ye({attribute:!1})],cl.prototype,"path",void 0),s([be()],cl.prototype,"why",void 0),s([be()],cl.prototype,"error",void 0),s([be()],cl.prototype,"sensors",void 0),s([be()],cl.prototype,"areas",void 0),s([be()],cl.prototype,"walkArea",void 0),s([be()],cl.prototype,"walking",void 0),s([be()],cl.prototype,"walk",void 0),s([be()],cl.prototype,"walkOpen",void 0),cl=s([ue("alarm-view-why")],cl);const hl=e=>e.callWS({type:"alarmo/ext/activity/get"}),pl=(e,t)=>e.callWS({type:"alarmo/ext/activity/day",day:t}),ml=/fail|error|not allowed|differ|could not/i,ul={house:"mdi:home-switch",alarmo:"mdi:shield-home",panel:"mdi:alarm-panel-outline",keypad:"mdi:dialpad",lock:"mdi:lock-smart",bypass:"mdi:debug-step-over",zone:"mdi:door",helper:"mdi:toggle-switch-outline",automation:"mdi:robot",command:"mdi:send",notify:"mdi:bell-ring-outline",link:"mdi:link-variant",event:"mdi:flash-outline"},gl=e=>new Date(1e3*e).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"});let vl=class extends pe{constructor(){super(...arguments),this.narrow=!1,this.day="",this.seqs=[],this.kinds=[],this.onlyProblems=!1,this.search="",this.error="",this.panelLog=[],this.downloadAll=async()=>{const e=[];for(const t of[...this.info.days].reverse()){[...(await pl(this.hass,t)).sequences].reverse().forEach(t=>e.push(JSON.stringify(t)));}Hn(`alarmo_activity_${this.info.days[this.info.days.length-1]}_to_${this.info.days[0]}.jsonl`,e.join("\n")+"\n","application/x-ndjson"),Pn(this,`${e.length} sequence(s) downloaded.`);};}connectedCallback(){super.connectedCallback(),this.timer=window.setInterval(()=>this.loadOpen(),5e3);}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this.timer);}firstUpdated(){this.load();}async load(){try{this.info=await hl(this.hass),this.draft=JSON.parse(JSON.stringify(this.info.settings));const t=new Date(),a=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;this.day||(this.day=this.info.days[0]||a),await this.loadDay();const[i,s]=await Promise.all([(e=this.hass,e.callWS({type:"alarmo/ext/panel/log"})).catch(()=>({log:[]})),Vr(this.hass).catch(()=>{})]);this.panelLog=[...i.log].reverse(),this.house=s,this.error="";}catch(e){this.error=Nn(e);}var e;}async loadOpen(){if(this.info)try{const e=await hl(this.hass),t=this.info.open&&(!e.open||e.open.id!==this.info.open.id);this.info=Object.assign(Object.assign({},e),{settings:this.info.settings}),t&&(await this.loadDay());}catch(e){}}async loadDay(){const e=await pl(this.hass,this.day);this.seqs=e.sequences,this.summary=e.summary;}get dirty(){return!!this.info&&JSON.stringify(this.info.settings)!==JSON.stringify(this.draft);}async save(){try{await(e=this.hass,t=this.draft,e.callWS({type:"alarmo/ext/activity/settings",settings:t})),Pn(this,"Activity settings saved."),await this.load();}catch(e){this.error=Nn(e);}var e,t;}render(){return this.info?Z`
      ${this.error?Z`<div class="notice error" style="margin:0 0 12px">${this.error}</div>`:Y}
      ${this.renderSequences()} ${this.renderSettings()} ${this.renderPanelLog()} ${this.renderHouseHistory()}
    `:Z`<ha-card><div class="empty">${this.error||"Loading…"}</div></ha-card>`;}renderSequences(){const e=this.info,t=e=>((e,t,a,i)=>{if(t.length&&!e.kinds.some(e=>t.includes(e)))return!1;if(a&&!e.entries.some(e=>ml.test(e.text)||"error"===e.level))return!1;const s=i.trim().toLowerCase();return!(s&&!e.title.toLowerCase().includes(s)&&!e.entries.some(e=>e.text.toLowerCase().includes(s)||(e.cause||"").toLowerCase().includes(s)));})(e,this.kinds,this.onlyProblems,this.search),a=this.seqs.filter(t),i=Object.keys(e.kinds);return Z`
      <ha-card>${Qn("Activity","readonly")}
        <div class="card-content desc">
          <p>Everything around House Modes, Alarmo, the physical panel, locks and bypasses, grouped into <em>sequences</em>:
            a sequence starts with a House Mode helper change, a lock keypad use, an Alarmo or panel change, the BYPASS
            indicator or an alarm, and collects everything that follows until nothing happens for
            ${e.settings.window_s} s. Each entry shows the time since the start and, where known, what caused it.</p>
          <p>It only records — it never changes anything. Codes are never recorded.</p>
        </div>
        <div class=${"notice "+(e.last_error||e.settings.enabled&&!e.running?"error":"")} style="margin:0 16px 8px">
          ${e.settings.enabled?e.running?Z`Recording · ${Object.keys(e.watched||{}).length} entities watched ·
                  ${e.open?Z`a sequence is open now (started ${gl(e.open.start)})`:"waiting for the next sequence"} ·
                  ${e.last_write?Z`last saved ${new Date(1e3*e.last_write).toLocaleString()}`:"nothing saved since Home Assistant started"}`:Z`<strong>The recorder is not running.</strong> Check Settings → System → Logs for "Alarmo ext" or "Activity recorder".`:Z`Recording is off (Recording settings below).`}
          ${e.last_error?Z`<div><strong>Error:</strong> ${e.last_error}</div>`:Y}
        </div>
        <div class="toolbar">
          <label>Day
            <select @change=${async e=>{this.day=e.target.value,await this.loadDay();}}>
              ${(e.days.length?e.days:[this.day]).map(e=>Z`<option value=${e} ?selected=${e===this.day}>${e}</option>`)}
            </select>
          </label>
          <input type="search" placeholder="Search" aria-label="Search" .value=${this.search} @input=${e=>this.search=e.target.value} />
          <label><input type="checkbox" .checked=${this.onlyProblems} @change=${e=>this.onlyProblems=e.target.checked} /> Only problems</label>
          <ha-button appearance="plain" @click=${()=>this.load()}><ha-icon slot="start" icon="mdi:refresh"></ha-icon>Refresh</ha-button>
          <ha-button appearance="plain" ?disabled=${!e.days.length} @click=${this.downloadAll}><ha-icon slot="start" icon="mdi:download"></ha-icon>Download all days</ha-button>
        </div>
        <div class="toolbar" style="padding-top:0">
          ${i.map(t=>{const a=this.kinds.includes(t);return Z`<button class="chip-cell kind-chip ${a?"on":""}" style="--chip:var(--primary-color)"
              @click=${()=>this.kinds=a?this.kinds.filter(e=>e!==t):[...this.kinds,t]}>
              <ha-icon icon=${ul[t]||"mdi:circle-small"}></ha-icon>${e.kinds[t]}</button>`;})}
          ${this.kinds.length?Z`<button class="link" @click=${()=>this.kinds=[]}>all</button>`:Y}
        </div>
        ${this.summary&&this.summary.sequences?Z`<div class="secondary" style="padding:0 16px 8px">
              ${this.summary.sequences} sequence(s) · started by ${Object.keys(this.summary.starters).map(t=>`${e.kinds[t]||t} ${this.summary.starters[t]}`).join(", ")}
              ${this.summary.failures?Z` · <span style="color:var(--error-color,#f44336)">${this.summary.failures} problem(s)</span>`:Y}
              ${Object.keys(this.summary.panel_latency).length?Z`<br />Panel after Alarmo: ${Object.keys(this.summary.panel_latency).map(e=>{const t=this.summary.panel_latency[e];return`${e.replace("armed_","")} avg ${t.avg} s (max ${t.max} s, ${t.n}×)`;}).join(" · ")}`:Y}
            </div>`:Y}
        ${e.open&&t(e.open)?this.renderSequence(e.open,!0):Y}
        ${a.map(e=>this.renderSequence(e,!1))}
        ${a.length||e.open?Y:Z`<div class="empty">Nothing recorded${this.seqs.length?" that matches the filters":" this day yet"}.</div>`}
      </ha-card>
    `;}renderSequence(e,t){var a;const i=e.entries.some(e=>/fail|error|not allowed|differ/i.test(e.text)||"error"===e.level);return Z`
      <details class="collapse" ?open=${t}>
        <summary>
          <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
          <span class="seq-time">${gl(e.start)}</span>
          <span class="seq-title">${e.title}</span>
          ${t?Z`<span class="role">recording…</span>`:Z`<span class="secondary" style="display:inline">${null!==(a=e.duration)&&void 0!==a?a:0} s · ${e.entries.length} entries</span>`}
          ${i?Z`<ha-icon icon="mdi:alert-circle" style="color:var(--error-color,#f44336)" title="Something failed or differs"></ha-icon>`:Y}
          <span class="seq-kinds">${e.kinds.map(e=>Z`<ha-icon icon=${ul[e]||"mdi:circle-small"} title=${this.info.kinds[e]||e}></ha-icon>`)}</span>
        </summary>
        <div class="collapse-body">
          <div class="table-wrap"><table class="full"><tbody>
            ${e.entries.map(e=>Z`<tr class=${"error"===e.level?"status-removed":"warning"===e.level?"status-changed":""}>
              <td class="c" style="width:1%">+${e.dt.toFixed(1)} s</td>
              <td class="icon"><ha-icon icon=${ul[e.kind]||"mdi:circle-small"} title=${this.info.kinds[e.kind]||e.kind}></ha-icon></td>
              <td style="white-space:normal">${e.text}${e.cause?Z`<span class="secondary">${e.cause}</span>`:Y}</td>
            </tr>`)}
          </tbody></table></div>
        </div>
      </details>
    `;}renderSettings(){const e=this.draft,t=this.info.watched||{},a=Object.keys(this.hass.states).filter(e=>!(e in t)).sort().map(e=>({value:e,label:`${this.hass.states[e].attributes.friendly_name||e} (${e})`}));return Z`
      <ha-card>
        <details class="collapse" style="margin:12px 16px">
          <summary>
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <span class="collapse-title">Recording settings</span>
            <span class="secondary" style="display:inline">${e.enabled?`on · ${e.window_s} s window · ${e.retention_days} days`:"off"}</span>
          </summary>
          <div class="collapse-body">
            <div class="field-row"><label><input type="checkbox" .checked=${e.enabled} @change=${t=>this.draft=Object.assign(Object.assign({},e),{enabled:t.target.checked})} /> Record activity</label></div>
            <alarmo-ext-slider .label=${"Sequence window (quiet time before a sequence ends)"} .min=${15} .max=${1800} .step=${15} unit="s" .value=${e.window_s}
              @value-changed=${t=>this.draft=Object.assign(Object.assign({},e),{window_s:t.detail.value})}></alarmo-ext-slider>
            <div class="secondary" style="padding:0 6px 6px">A sequence also stays open while an alarm is arming or in its entry delay.</div>
            <alarmo-ext-slider .label=${"Keep logs for"} .min=${1} .max=${365} unit="days" .value=${e.retention_days}
              @value-changed=${t=>this.draft=Object.assign(Object.assign({},e),{retention_days:t.detail.value})}></alarmo-ext-slider>
            <alarmo-ext-multi-picker .label=${"Also record"} .placeholder=${"Add an entity…"} .options=${a} .value=${e.entities}
              @value-changed=${t=>this.draft=Object.assign(Object.assign({},e),{entities:t.detail.value})}></alarmo-ext-multi-picker>
            <div class="secondary" style="padding:6px">
              Recorded automatically (${Object.keys(t).length}): ${Object.keys(t).sort().join(", ")}. Alarmo zones and mirrors
              are recorded inside a sequence; automations that ran, commands to the panel/Alarmo/locks and notifications too.
              Files: <code>${this.info.directory}</code>.
            </div>
            ${this.dirty?Z`<div class="toolbar" style="padding:8px 0 0">
              <ha-button @click=${this.save}>Save</ha-button>
              <ha-button appearance="plain" @click=${()=>this.draft=JSON.parse(JSON.stringify(this.info.settings))}>Discard</ha-button></div>`:Y}
          </div>
        </details>
      </ha-card>
    `;}renderPanelLog(){return Z`
      <ha-card>
        <details class="collapse" style="margin:12px 16px">
          <summary>
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <span class="collapse-title">Physical panel link log</span>
            <span class="secondary" style="display:inline">${this.panelLog.length} entries since Home Assistant started (these are also in the sequences)</span>
          </summary>
          <div class="collapse-body">
            ${this.panelLog.length?Z`<div class="table-wrap" style="max-height:360px"><table class="full"><tbody>
                  ${this.panelLog.map(e=>Z`<tr class=${"error"===e.level?"status-removed":"warning"===e.level?"status-changed":""}>
                    <td>${(e=>{const t=new Date(1e3*e),a=e=>String(e).padStart(2,"0");return`${a(t.getHours())}:${a(t.getMinutes())}:${a(t.getSeconds())}`;})(e.ts)}</td><td>${e.link||""}</td><td style="white-space:normal">${e.msg}</td></tr>`)}
                </tbody></table></div>`:Z`<div class="empty">Nothing yet.</div>`}
          </div>
        </details>
      </ha-card>
    `;}renderHouseHistory(){const e=this.house;if(!e||!e.settings.history.length)return Y;const t=t=>{var a;return t?(null===(a=e.settings.modes.find(e=>e.id===t))||void 0===a?void 0:a.name)||t:"unknown";},a=[...e.settings.history].reverse();return Z`
      <ha-card>
        <details class="collapse" style="margin:12px 16px">
          <summary>
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <span class="collapse-title">House Mode history</span>
            <span class="secondary" style="display:inline">last ${a.length} changes made by the integration's House Modes</span>
          </summary>
          <div class="collapse-body">
            <div class="table-wrap" style="max-height:300px"><table class="full"><tbody>
              ${a.map(e=>Z`<tr class=${"failed"===e.result?"status-removed":""}><td>${new Date(e.at).toLocaleString()}</td>
                <td>${t(e.from)} → <strong>${t(e.to)}</strong></td><td>${e.source}</td><td>${e.result}</td></tr>`)}
            </tbody></table></div>
          </div>
        </details>
      </ha-card>
    `;}};vl.styles=Kn,s([ye({attribute:!1})],vl.prototype,"hass",void 0),s([ye({type:Boolean})],vl.prototype,"narrow",void 0),s([ye({attribute:!1})],vl.prototype,"path",void 0),s([be()],vl.prototype,"info",void 0),s([be()],vl.prototype,"day",void 0),s([be()],vl.prototype,"seqs",void 0),s([be()],vl.prototype,"summary",void 0),s([be()],vl.prototype,"kinds",void 0),s([be()],vl.prototype,"onlyProblems",void 0),s([be()],vl.prototype,"search",void 0),s([be()],vl.prototype,"error",void 0),s([be()],vl.prototype,"draft",void 0),s([be()],vl.prototype,"panelLog",void 0),s([be()],vl.prototype,"house",void 0),vl=s([ue("alarm-view-activity")],vl);const yl="alarmo-ext-actions-tab";let bl=class extends pe{constructor(){super(...arguments),this.showLegacy=!1;}async loadUi(){var e;try{this.showLegacy=!!(null===(e=(await Ln(this.hass)).ui)||void 0===e?void 0:e.show_legacy_zones);}catch(e){this.showLegacy=!1;}}async firstUpdated(){window.addEventListener("location-changed",()=>{window.location.pathname.includes("alarmo")&&this.requestUpdate();}),window.addEventListener("alarmo-ext-ui-changed",()=>this.loadUi()),await fe(),await this.loadUi(),this.userConfig=await ze(this.hass),this.requestUpdate();}render(){if(!customElements.get("ha-panel-config")||!this.userConfig)return Z`
        loading...
      `;const e=En(),t=il(e.page,e.subpage,e.params);return Z`
      <div class="header">
        <div class="toolbar">
          <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
          <div class="main-title">
            ${Cs("title",this.hass.language)}
          </div>
          <div class="version">
            v${"1.10.19+ext.28"}
          </div>
        </div>

        <ha-tab-group
          @wa-tab-show=${this.handlePageSelected}
        >
          ${tl.filter(e=>"zones_legacy"!==e.id||this.showLegacy||"zones_legacy"===(null==t?void 0:t.id)).map(e=>Z`
            <ha-tab-group-tab slot="nav" panel="${e.id}" .active=${(null==t?void 0:t.id)===e.id}>
              ${Cs(e.titleKey,this.hass.language)}
            </ha-tab-group-tab>
          `)}
        </ha-tab-group>
      </div>
      <alarmo-ext-status-strip .hass=${this.hass}></alarmo-ext-status-strip>
      <div class="view">
        ${this.withIntro(e,t,this.getView(e,t))}
      </div>
    `;}withIntro(e,t,a){return!t||"zones_legacy"!==t.id||sl(e.subpage,e.params)?a:Z`
      <div class="page">
        <alarmo-ext-page-intro .page=${t.id} .heading=${Cs(t.titleKey,this.hass.language)}></alarmo-ext-page-intro>
        ${a}
      </div>
    `;}getView(e,t){switch(null==t?void 0:t.view){case"general":return Z`
          <alarm-view-general
            .hass=${this.hass}
            .narrow=${this.narrow}
            .path=${e}
            .section=${t.section}
          ></alarm-view-general>
        `;case"sensors":{const t="zones_legacy"===e.page?Object.assign(Object.assign({},e),{page:"sensors"}):e;return Z`
          <alarm-view-sensors .hass=${this.hass} .narrow=${this.narrow} .path=${t}></alarm-view-sensors>
        `;}case"codes":return Z`
          <alarm-view-codes .hass=${this.hass} .narrow=${this.narrow} .path=${e}></alarm-view-codes>
        `;case"sensor_table":return Z`
          <alarm-view-sensor-table .hass=${this.hass} .narrow=${this.narrow} .path=${e}></alarm-view-sensor-table>
        `;case"activity":return Z`
          <alarm-view-activity .hass=${this.hass} .narrow=${this.narrow} .path=${e}></alarm-view-activity>
        `;case"why":return Z`
          <alarm-view-why .hass=${this.hass} .narrow=${this.narrow} .path=${e}></alarm-view-why>
        `;case"house":return Z`
          <alarm-view-house .hass=${this.hass} .narrow=${this.narrow} .path=${e}></alarm-view-house>
        `;case"ha_zones":return Z`
          <alarm-view-ha-zones .hass=${this.hass} .narrow=${this.narrow} .path=${e}></alarm-view-ha-zones>
        `;case"mirrors":return Z`
          <alarm-view-mirrors .hass=${this.hass} .narrow=${this.narrow} .path=${e}></alarm-view-mirrors>
        `;case"connections":return Z`
          <alarm-view-connections .hass=${this.hass} .narrow=${this.narrow} .path=${e}></alarm-view-connections>
        `;case"panel":return Z`
          <alarm-view-panel .hass=${this.hass} .narrow=${this.narrow} .path=${e}></alarm-view-panel>
        `;case"backup":return Z`
          <alarm-view-backup .hass=${this.hass} .narrow=${this.narrow} .path=${e}></alarm-view-backup>
        `;case"actions":{const a=sl(e.subpage,e.params);"notifications"===e.page?window.sessionStorage.setItem(yl,"notifications"):a||e.filter||"actions"!==e.page?a&&"actions"===t.id&&window.sessionStorage.removeItem(yl):"notifications"===window.sessionStorage.getItem(yl)&&(window.sessionStorage.removeItem(yl),setTimeout(()=>xn(0,Mn("notifications"),!0),0));const i="notifications"===e.page?Object.assign(Object.assign({},e),{page:"actions"}):e,s=a?void 0:t.section;return Z`
          <alarm-view-actions
            .hass=${this.hass}
            .narrow=${this.narrow}
            .path=${i}
            .section=${s}
          ></alarm-view-actions>
        `;}default:return Z`
          <ha-card header="Page not found">
            <div class="card-content">
              The page you are trying to reach cannot be found. Please select a page from the menu above to continue.
            </div>
          </ha-card>
        `;}}handlePageSelected(e){var t,a;const i=e.detail.name,s=En();if(i!==(null===(t=il(s.page,s.subpage,s.params))||void 0===t?void 0:t.id)){window.sessionStorage.removeItem(yl);const e=null===(a=this.shadowRoot)||void 0===a?void 0:a.querySelector("alarm-view-sensor-table");if(e&&e.hasUnsavedChanges&&e.hasUnsavedChanges()){if(!window.confirm("The Zones page has unsaved changes. They are kept as a draft until you return, but are not saved yet. Leave the page?"))return void this.requestUpdate();}xn(0,Mn(i)),this.requestUpdate();}else scrollTo(0,0);}static get styles(){return h`
      ${Cn} :host {
        color: var(--primary-text-color);
        --paper-card-header-color: var(--primary-text-color);
      }
      .header {
        background-color: var(--app-header-background-color);
        color: var(--app-header-text-color, white);
        border-bottom: var(--app-header-border-bottom, none);
      }
      .toolbar {
        height: var(--header-height);
        display: flex;
        align-items: center;
        font-size: 20px;
        padding: 0 16px;
        font-weight: 400;
        box-sizing: border-box;
      }
      .main-title {
        margin: 0 0 0 24px;
        line-height: 20px;
        flex-grow: 1;
      }
      ha-tab-group {
        margin-left: max(env(safe-area-inset-left), 24px);
        margin-right: max(env(safe-area-inset-right), 24px);
        --ha-tab-active-text-color: var(--app-header-text-color, white);
        --ha-tab-indicator-color: var(--app-header-text-color, white);
        --ha-tab-track-color: transparent;
      }
      .view {
        height: calc(100vh - 112px);
        display: flex;
        justify-content: center;
      }
      /* ext: pages use the full width and may shrink, so wide tables scroll inside their card */
      .view {
        padding: 0 8px;
        box-sizing: border-box;
      }
      .view > * {
        width: 100%;
        min-width: 0;
        max-width: 100%;
        box-sizing: border-box;
      }
      .page > * {
        display: block;
      }
      .view > *:last-child {
        margin-bottom: 20px;
      }
      .version {
        font-size: 14px;
        color: var(--primary-text-color);
      }
    `;}};s([ye({attribute:!1})],bl.prototype,"hass",void 0),s([ye({type:Boolean,reflect:!0})],bl.prototype,"narrow",void 0),s([ye({attribute:!1})],bl.prototype,"userConfig",void 0),s([ye({attribute:!1})],bl.prototype,"showLegacy",void 0),bl=s([ue("alarm-panel")],bl);export{bl as MyAlarmPanel};
