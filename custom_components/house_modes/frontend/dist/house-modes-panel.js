var e=function(t,s){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t;}||function(e,t){for(var s in t)Object.prototype.hasOwnProperty.call(t,s)&&(e[s]=t[s]);},e(t,s);};function t(t,s){if("function"!=typeof s&&null!==s)throw new TypeError("Class extends value "+String(s)+" is not a constructor or null");function a(){this.constructor=t;}e(t,s),t.prototype=null===s?Object.create(s):(a.prototype=s.prototype,new a());}var s=function(){return s=Object.assign||function(e){for(var t,s=1,a=arguments.length;s<a;s++)for(var i in t=arguments[s])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e;},s.apply(this,arguments);};function a(e,t){var s={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(s[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(a=Object.getOwnPropertySymbols(e);i<a.length;i++)t.indexOf(a[i])<0&&Object.prototype.propertyIsEnumerable.call(e,a[i])&&(s[a[i]]=e[a[i]]);}return s;}function i(e,t,s,a){var i,n=arguments.length,o=n<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,s):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,s,a);else for(var r=e.length-1;r>=0;r--)(i=e[r])&&(o=(n<3?i(o):n>3?i(t,s,o):i(t,s))||o);return n>3&&o&&Object.defineProperty(t,s,o),o;}function n(e,t,s){if(s||2===arguments.length)for(var a,i=0,n=t.length;i<n;i++)!a&&i in t||(a||(a=Array.prototype.slice.call(t,0,i)),a[i]=t[i]);return e.concat(a||Array.prototype.slice.call(t));}"function"==typeof SuppressedError&&SuppressedError;/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o=globalThis,r=o.ShadowRoot&&(void 0===o.ShadyCSS||o.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,l=Symbol(),c=new WeakMap();let d=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==l)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t;}get styleSheet(){let e=this.o;const t=this.t;if(r&&void 0===e){const s=void 0!==t&&1===t.length;s&&(e=c.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet()).replaceSync(this.cssText),s&&c.set(t,e));}return e;}toString(){return this.cssText;}};const h=(e,...t)=>{const s=1===e.length?e[0]:t.reduce((t,s,a)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");})(s)+e[a+1],e[0]);return new d(s,e,l);},p=r?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>new d("string"==typeof e?e:e+"",void 0,l))(t);})(e):e,{is:u,defineProperty:m,getOwnPropertyDescriptor:g,getOwnPropertyNames:v,getOwnPropertySymbols:y,getPrototypeOf:b}=Object,f=globalThis,$=f.trustedTypes,_=$?$.emptyScript:"",w=f.reactiveElementPolyfillSupport,k=(e,t)=>e,x={toAttribute(e,t){switch(t){case Boolean:e=e?_:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e);}return e;},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e);}catch(e){s=null;}}return s;}},A=(e,t)=>!u(e,t),O={attribute:!0,type:String,converter:x,reflect:!1,useDefault:!1,hasChanged:A};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap();let S=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()];}static createProperty(e,t=O){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),a=this.getPropertyDescriptor(e,s,t);void 0!==a&&m(this.prototype,e,a);}}static getPropertyDescriptor(e,t,s){const{get:a,set:i}=g(this.prototype,e)??{get(){return this[t];},set(e){this[t]=e;}};return{get:a,set(t){const n=a?.call(this);i?.call(this,t),this.requestUpdate(e,n,s);},configurable:!0,enumerable:!0};}static getPropertyOptions(e){return this.elementProperties.get(e)??O;}static _$Ei(){if(this.hasOwnProperty(k("elementProperties")))return;const e=b(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties);}static finalize(){if(this.hasOwnProperty(k("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(k("properties"))){const e=this.properties,t=[...v(e),...y(e)];for(const s of t)this.createProperty(s,e[s]);}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s);}this._$Eh=new Map();for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(p(e));}else void 0!==e&&t.push(p(e));return t;}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0;}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map(),this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this));}addController(e){(this._$EO??=new Set()).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.();}removeController(e){this._$EO?.delete(e);}_$E_(){const e=new Map(),t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e);}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{if(r)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const s of t){const t=document.createElement("style"),a=o.litNonce;void 0!==a&&t.setAttribute("nonce",a),t.textContent=s.cssText,e.appendChild(t);}})(e,this.constructor.elementStyles),e;}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.());}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.());}attributeChangedCallback(e,t,s){this._$AK(e,s);}_$ET(e,t){const s=this.constructor.elementProperties.get(e),a=this.constructor._$Eu(e,s);if(void 0!==a&&!0===s.reflect){const i=(void 0!==s.converter?.toAttribute?s.converter:x).toAttribute(t,s.type);this._$Em=e,null==i?this.removeAttribute(a):this.setAttribute(a,i),this._$Em=null;}}_$AK(e,t){const s=this.constructor,a=s._$Eh.get(e);if(void 0!==a&&this._$Em!==a){const e=s.getPropertyOptions(a),i="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:x;this._$Em=a;const n=i.fromAttribute(t,e.type);this[a]=n??this._$Ej?.get(a)??n,this._$Em=null;}}requestUpdate(e,t,s,a=!1,i){if(void 0!==e){const n=this.constructor;if(!1===a&&(i=this[e]),s??=n.getPropertyOptions(e),!((s.hasChanged??A)(i,t)||s.useDefault&&s.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s);}!1===this.isUpdatePending&&(this._$ES=this._$EP());}C(e,t,{useDefault:s,reflect:a,wrapped:i},n){s&&!(this._$Ej??=new Map()).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==i||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===a&&this._$Em!==e&&(this._$Eq??=new Set()).add(e));}async _$EP(){this.isUpdatePending=!0;try{await this._$ES;}catch(e){Promise.reject(e);}const e=this.scheduleUpdate();return null!=e&&(await e),!this.isUpdatePending;}scheduleUpdate(){return this.performUpdate();}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0;}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,a=this[t];!0!==e||this._$AL.has(t)||void 0===a||this.C(t,void 0,s,a);}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM();}catch(t){throw e=!1,this._$EM(),t;}e&&this._$AE(t);}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e);}_$EM(){this._$AL=new Map(),this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete();}getUpdateComplete(){return this._$ES;}shouldUpdate(e){return!0;}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM();}updated(e){}firstUpdated(e){}};S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[k("elementProperties")]=new Map(),S[k("finalized")]=new Map(),w?.({ReactiveElement:S}),(f.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const C=globalThis,j=e=>e,E=C.trustedTypes,M=E?E.createPolicy("lit-html",{createHTML:e=>e}):void 0,H="$lit$",L=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+L,z=`<${T}>`,P=document,N=()=>P.createComment(""),D=e=>null===e||"object"!=typeof e&&"function"!=typeof e,R=Array.isArray,B="[ \t\n\f\r]",I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,V=/-->/g,U=/>/g,F=RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),G=/'/g,W=/"/g,q=/^(?:script|style|textarea|title)$/i,Z=(e=>(t,...s)=>({_$litType$:e,strings:t,values:s}))(1),Y=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),J=new WeakMap(),X=P.createTreeWalker(P,129);function Q(e,t){if(!R(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==M?M.createHTML(t):t;}const ee=(e,t)=>{const s=e.length-1,a=[];let i,n=2===t?"<svg>":3===t?"<math>":"",o=I;for(let t=0;t<s;t++){const s=e[t];let r,l,c=-1,d=0;for(;d<s.length&&(o.lastIndex=d,l=o.exec(s),null!==l);)d=o.lastIndex,o===I?"!--"===l[1]?o=V:void 0!==l[1]?o=U:void 0!==l[2]?(q.test(l[2])&&(i=RegExp("</"+l[2],"g")),o=F):void 0!==l[3]&&(o=F):o===F?">"===l[0]?(o=i??I,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,r=l[1],o=void 0===l[3]?F:'"'===l[3]?W:G):o===W||o===G?o=F:o===V||o===U?o=I:(o=F,i=void 0);const h=o===F&&e[t+1].startsWith("/>")?" ":"";n+=o===I?s+z:c>=0?(a.push(r),s.slice(0,c)+H+s.slice(c)+L+h):s+L+(-2===c?t:h);}return[Q(e,n+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),a];};class te{constructor({strings:e,_$litType$:t},s){let a;this.parts=[];let i=0,n=0;const o=e.length-1,r=this.parts,[l,c]=ee(e,t);if(this.el=te.createElement(l,s),X.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes);}for(;null!==(a=X.nextNode())&&r.length<o;){if(1===a.nodeType){if(a.hasAttributes())for(const e of a.getAttributeNames())if(e.endsWith(H)){const t=c[n++],s=a.getAttribute(e).split(L),o=/([.?@])?(.*)/.exec(t);r.push({type:1,index:i,name:o[2],strings:s,ctor:"."===o[1]?oe:"?"===o[1]?re:"@"===o[1]?le:ne}),a.removeAttribute(e);}else e.startsWith(L)&&(r.push({type:6,index:i}),a.removeAttribute(e));if(q.test(a.tagName)){const e=a.textContent.split(L),t=e.length-1;if(t>0){a.textContent=E?E.emptyScript:"";for(let s=0;s<t;s++)a.append(e[s],N()),X.nextNode(),r.push({type:2,index:++i});a.append(e[t],N());}}}else if(8===a.nodeType)if(a.data===T)r.push({type:2,index:i});else{let e=-1;for(;-1!==(e=a.data.indexOf(L,e+1));)r.push({type:7,index:i}),e+=L.length-1;}i++;}}static createElement(e,t){const s=P.createElement("template");return s.innerHTML=e,s;}}function se(e,t,s=e,a){if(t===Y)return t;let i=void 0!==a?s._$Co?.[a]:s._$Cl;const n=D(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),void 0===n?i=void 0:(i=new n(e),i._$AT(e,s,a)),void 0!==a?(s._$Co??=[])[a]=i:s._$Cl=i),void 0!==i&&(t=se(e,i._$AS(e,t.values),i,a)),t;}class ae{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t;}get parentNode(){return this._$AM.parentNode;}get _$AU(){return this._$AM._$AU;}u(e){const{el:{content:t},parts:s}=this._$AD,a=(e?.creationScope??P).importNode(t,!0);X.currentNode=a;let i=X.nextNode(),n=0,o=0,r=s[0];for(;void 0!==r;){if(n===r.index){let t;2===r.type?t=new ie(i,i.nextSibling,this,e):1===r.type?t=new r.ctor(i,r.name,r.strings,this,e):6===r.type&&(t=new ce(i,this,e)),this._$AV.push(t),r=s[++o];}n!==r?.index&&(i=X.nextNode(),n++);}return X.currentNode=P,a;}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++;}}class ie{get _$AU(){return this._$AM?._$AU??this._$Cv;}constructor(e,t,s,a){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=a,this._$Cv=a?.isConnected??!0;}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e;}get startNode(){return this._$AA;}get endNode(){return this._$AB;}_$AI(e,t=this){e=se(this,e,t),D(e)?e===K||null==e||""===e?(this._$AH!==K&&this._$AR(),this._$AH=K):e!==this._$AH&&e!==Y&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>R(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e);}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB);}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e));}_(e){this._$AH!==K&&D(this._$AH)?this._$AA.nextSibling.data=e:this.T(P.createTextNode(e)),this._$AH=e;}$(e){const{values:t,_$litType$:s}=e,a="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=te.createElement(Q(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===a)this._$AH.p(t);else{const e=new ae(a,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e;}}_$AC(e){let t=J.get(e.strings);return void 0===t&&J.set(e.strings,t=new te(e)),t;}k(e){R(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,a=0;for(const i of e)a===t.length?t.push(s=new ie(this.O(N()),this.O(N()),this,this.options)):s=t[a],s._$AI(i),a++;a<t.length&&(this._$AR(s&&s._$AB.nextSibling,a),t.length=a);}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=j(e).nextSibling;j(e).remove(),e=t;}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e));}}class ne{get tagName(){return this.element.tagName;}get _$AU(){return this._$AM._$AU;}constructor(e,t,s,a,i){this.type=1,this._$AH=K,this._$AN=void 0,this.element=e,this.name=t,this._$AM=a,this.options=i,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String()),this.strings=s):this._$AH=K;}_$AI(e,t=this,s,a){const i=this.strings;let n=!1;if(void 0===i)e=se(this,e,t,0),n=!D(e)||e!==this._$AH&&e!==Y,n&&(this._$AH=e);else{const a=e;let o,r;for(e=i[0],o=0;o<i.length-1;o++)r=se(this,a[s+o],t,o),r===Y&&(r=this._$AH[o]),n||=!D(r)||r!==this._$AH[o],r===K?e=K:e!==K&&(e+=(r??"")+i[o+1]),this._$AH[o]=r;}n&&!a&&this.j(e);}j(e){e===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"");}}class oe extends ne{constructor(){super(...arguments),this.type=3;}j(e){this.element[this.name]=e===K?void 0:e;}}class re extends ne{constructor(){super(...arguments),this.type=4;}j(e){this.element.toggleAttribute(this.name,!!e&&e!==K);}}class le extends ne{constructor(e,t,s,a,i){super(e,t,s,a,i),this.type=5;}_$AI(e,t=this){if((e=se(this,e,t,0)??K)===Y)return;const s=this._$AH,a=e===K&&s!==K||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,i=e!==K&&(s===K||a);a&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,e),this._$AH=e;}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e);}}class ce{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s;}get _$AU(){return this._$AM._$AU;}_$AI(e){se(this,e);}}const de=C.litHtmlPolyfillSupport;de?.(te,ie),(C.litHtmlVersions??=[]).push("3.3.3");const he=globalThis;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let pe=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e;}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const a=s?.renderBefore??t;let i=a._$litPart$;if(void 0===i){const e=s?.renderBefore??null;a._$litPart$=i=new ie(t.insertBefore(N(),e),e,void 0,s??{});}return i._$AI(e),i;})(t,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1);}render(){return Y;}};pe._$litElement$=!0,pe.finalized=!0,he.litElementHydrateSupport?.({LitElement:pe});const ue=he.litElementPolyfillSupport;ue?.({LitElement:pe}),(he.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const me=e=>(t,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(e,t);}):customElements.define(e,t);},ge={attribute:!0,type:String,converter:x,reflect:!1,hasChanged:A},ve=(e=ge,t,s)=>{const{kind:a,metadata:i}=s;let n=globalThis.litPropertyMetadata.get(i);if(void 0===n&&globalThis.litPropertyMetadata.set(i,n=new Map()),"setter"===a&&((e=Object.create(e)).wrapped=!0),n.set(s.name,e),"accessor"===a){const{name:a}=s;return{set(s){const i=t.get.call(this);t.set.call(this,s),this.requestUpdate(a,i,e,!0,s);},init(t){return void 0!==t&&this.C(a,void 0,e,t),t;}};}if("setter"===a){const{name:a}=s;return function(s){const i=this[a];t.call(this,s),this.requestUpdate(a,i,e,!0,s);};}throw Error("Unsupported decorator location: "+a);};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ye(e){return(t,s)=>"object"==typeof s?ve(e,t,s):((e,t,s)=>{const a=t.hasOwnProperty(s);return t.constructor.createProperty(s,e),a?Object.getOwnPropertyDescriptor(t,s):void 0;})(e,t,s);}/**
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
 */function fe(e,t){return(t,s,a)=>{const i=t=>t.renderRoot?.querySelector(e)??null;{const{get:e,set:n}="object"==typeof s?t:a??(()=>{const e=Symbol();return{get(){return this[e];},set(t){this[e]=t;}};})();return((e,t,s)=>(s.configurable=!0,s.enumerable=!0,Reflect.decorate&&"object"!=typeof t&&Object.defineProperty(e,t,s),s))(t,s,{get(){let t=e.call(this);return void 0===t&&(t=i(this),(null!==t||this.hasUpdated)&&n.call(this,t)),t;}});}};}const $e=async()=>{if(customElements.get("ha-checkbox")&&customElements.get("ha-slider")&&customElements.get("ha-panel-config"))return;await customElements.whenDefined("partial-panel-resolver");const e=document.createElement("partial-panel-resolver");e.hass={panels:[{url_path:"tmp",component_name:"config"}]},e._updateRoutes(),await e.routerOptions.routes.tmp.load(),await customElements.whenDefined("ha-panel-config");const t=document.createElement("ha-panel-config");await t.routerOptions.routes.automation.load();},_e=async()=>{var e,t,s,a,i,n,o;if(customElements.get("ha-yaml-editor"))return;const r=document.createElement("partial-panel-resolver").getRoutes([{component_name:"developer-tools",url_path:"a"}]);await(null===(s=null===(t=null===(e=null==r?void 0:r.routes)||void 0===e?void 0:e.a)||void 0===t?void 0:t.load)||void 0===s?void 0:s.call(t));const l=document.createElement("developer-tools-router");await(null===(o=null===(n=null===(i=null===(a=null==l?void 0:l.routerOptions)||void 0===a?void 0:a.routes)||void 0===i?void 0:i.service)||void 0===n?void 0:n.load)||void 0===o?void 0:o.call(n));},we=e=>e.callWS({type:"house_modes/config"}),ke=e=>e.callWS({type:"house_modes/sensors"}),xe=e=>e.callWS({type:"house_modes/users"}),Ae=e=>e.callWS({type:"house_modes/automations"}),Oe=e=>e.callWS({type:"house_modes/sensor_groups"}),Se=(e,t)=>e.callApi("POST","house_modes/config",t),Ce=(e,t)=>e.callApi("POST","house_modes/sensors",t),je=(e,t)=>e.callApi("POST","house_modes/users",t),Ee=(e,t)=>e.callApi("POST","house_modes/users",{user_id:t,remove:!0}),Me=(e,t)=>e.callApi("POST","house_modes/automations",t),He=(e,t)=>e.callApi("POST","house_modes/automations",{automation_id:t,remove:!0}),Le=e=>e.callWS({type:"house_modes/areas"}),Te=(e,t)=>e.callApi("POST","house_modes/area",t),ze=e=>{class t extends e{connectedCallback(){super.connectedCallback(),this.__checkSubscribed();}disconnectedCallback(){if(super.disconnectedCallback(),this.__unsubs){for(;this.__unsubs.length;){const e=this.__unsubs.pop();e instanceof Promise?e.then(e=>e()):e();}this.__unsubs=void 0;}}updated(e){super.updated(e),e.has("hass")&&this.__checkSubscribed();}hassSubscribe(){return[];}__checkSubscribed(){void 0===this.__unsubs&&this.isConnected&&void 0!==this.hass&&(this.__unsubs=this.hassSubscribe());}}return i([ye({attribute:!1})],t.prototype,"hass",void 0),t;};var Pe={modes_short:{armed_away:"Away",armed_home:"Home",armed_night:"Night",armed_custom_bypass:"Custom",armed_vacation:"Vacation"},enabled:"Enabled",disabled:"Disabled"},Ne={time_picker:{seconds:"seconds",minutes:"minutes"},editor:{ui_mode:"To UI",yaml_mode:"To YAML",edit_in_yaml:"Edit in YAML"},table:{filter:{label:"Filter items",item:"Filter by {name}",hidden_items:"{number} {number, plural,\n  one {item is}\n  other {items are}\n} hidden"}}},De="House Modes & Alarm Center",Re={general:{title:"Quick Start",cards:{general:{description:"This panel defines some global settings for the alarm.",fields:{disarm_after_trigger:{heading:"Disarm after triggering",description:"Automatically disarm the alarm rather than returning to the armed state."},ignore_blocking_sensors_after_trigger:{heading:"Ignore blocking zones when re-arming",description:"Return to armed state without checking for zones that may still be active."},enable_mqtt:{heading:"Enable MQTT",description:"Allow the alarm panel to be controlled through MQTT."},enable_master:{heading:"Enable 'All partitions' panel",description:"Creates an alarm entity for controlling all partitions simultaneously."}},actions:{setup_mqtt:"MQTT Configuration",setup_master:"'All partitions' configuration"}},modes:{title:"Arm Modes",description:"The alarm's Arm Modes (Away, Home/Stay, Night, Vacation, Custom): which ones each partition offers, and the alarm's exit and entry delays for each. With a physical panel, its own delays still apply to its own zones.",modes:{armed_away:"Armed away will be used when all people left the house. All doors and windows allowing access to the house will be guarded, as well as motion zones inside the house.",armed_home:"Armed home (also known as armed stay) will be used when setting the alarm while people are in the house. All doors and windows allowing access to the house will be guarded, but not motion zones inside the house.",armed_night:"Armed night will be used when setting the alarm before going to sleep. All doors and windows allowing access to the house will be guarded, and selected motion zones (downstairs) in the house.",armed_vacation:"Armed vacation can be used as an extension to the armed away mode in case of absence for longer duration. The delay times and trigger responses can be adapted (as desired) to being distant from home.",armed_custom_bypass:"An extra mode for defining your own security perimeter."},number_sensors_active:"{number} {number, plural,\n  one {zone}\n  other {zones}\n} active",fields:{status:{heading:"Status",description:"Controls whether the alarm can be armed in this mode."},exit_delay:{heading:"Exit delay",description:"When arming the alarm, within this time period the zones will not trigger the alarm yet."},entry_delay:{heading:"Entry delay",description:"Delay time until the alarm is triggered after one of the zones is activated."},trigger_time:{heading:"Trigger time",description:"Time during which the alarm will remain in the triggered state after activation."}}},mqtt:{title:"MQTT configuration",description:"This panel can be used for configuration of the MQTT interface.",fields:{state_topic:{heading:"State topic",description:"Topic on which state updates are published"},event_topic:{heading:"Event topic",description:"Topic on which alarm events are published"},command_topic:{heading:"Command topic",description:"Topic the alarm listens to for arm/disarm commands."},require_code:{heading:"Require code",description:"Require the code to be sent with the command."},state_payload:{heading:"Configure payload per state",item:"Define a payload for state ''{state}''"},command_payload:{heading:"Configure payload per command",item:"Define a payload for command ''{command}''"}}},areas:{title:"Partitions",description:"Partitions divide the alarm system into parts that are armed separately (for example a detached garage). Each has its own alarm entity, alarm_control_panel.<partition name>; most homes need one.",no_items:"There are no partitions defined yet.",table:{remarks:"Remarks",summary:"This partition contains {summary_sensors}, {summary_automations}.",summary_sensors:"{number} {number, plural,\n  one {zone}\n  other {zones}\n}",summary_automations:"{number} {number, plural,\n  one {automation}\n  other {automations}\n}"},actions:{add:"Add"}}},dialogs:{create_area:{title:"New partition",fields:{copy_from:"Copy settings from"}},edit_area:{title:"Editing partition ''{area}''",name_warning:"Note: changing the name will change the entity ID"},remove_area:{title:"Remove partition?",description:"Are you sure you want to remove this partition? This partition contains {sensors} zones and {automations} automations, which will be removed as well."},edit_master:{title:"'All partitions' configuration"},disable_master:{title:"Disable 'All partitions'?",description:"Are you sure you want to remove the 'All partitions' alarm entity? It has {automations} automations, which will be removed with this action."}}},sensors:{title:"Zones",cards:{sensors:{description:"Currently configured zones. Click on an item to make changes.",table:{no_items:"There are no zones to be displayed here.",no_area_warning:"Zone is not assigned to any partition.",arm_modes:"Arm Modes",always_on:"(Always)"}},add_sensors:{title:"Add Zones",description:"Add more zones. Make sure that your zones have a suitable name, so you can identify them.",no_items:"There are no available HA entities that can be configured for the alarm. Make sure to include entities of the type binary_sensor.",table:{type:"Detected type"},actions:{add_to_alarm:"Add to alarm",filter_supported:"Hide items with unknown type"}},editor:{title:"Edit Zone",description:"Configuring the zone settings of ''{entity}''.",fields:{entity:{heading:"Entity",description:"Entity associated with this zone"},area:{heading:"Partition",description:"Select the partition which contains this zone."},group:{heading:"Cross-zone group",description:"Cross-zone with other zones: several must trigger before the alarm does."},device_type:{heading:"Zone type",description:"Choose a zone type to automatically apply appropriate settings.",choose:{door:{name:"Door",description:"A door, gate or other entrance that is used for entering/leaving the home."},window:{name:"Window",description:"A window, or a door not used for entering the house such as balcony."},motion:{name:"Motion",description:"Presence sensor or similar device having a delay between activations."},tamper:{name:"Tamper",description:"Detector of sensor cover removal, glass break sensor, etc."},environmental:{name:"Environmental",description:"Smoke/gas sensor, leak detector, etc. (not related to burglar protection)."},other:{name:"Generic"}}},always_on:{heading:"Always on",description:"Zone should always trigger the alarm."},modes:{heading:"Arm Modes",description:"Arm modes in which this zone is active."},arm_on_close:{heading:"Arm after closing",description:"After deactivation of this zone, the remaining exit delay will automatically be skipped."},use_exit_delay:{heading:"Use exit delay",description:"Zone is allowed to be active when the exit delay starts."},use_entry_delay:{heading:"Use entry delay",description:"Zone activation triggers the alarm after the entry delay rather than directly."},entry_delay:{heading:"Entry delay",description:"Override the entry delay (as configured for the arm mode) with a delay specific to the zone."},delay_on:{heading:"Delay on",description:"Zone must remain active for this duration before triggering. Resets if zone deactivates."},allow_open:{heading:"Allow open initially",description:"Open state while arming is ignored (subsequent zone activation will trigger alarm)."},auto_bypass:{heading:"Bypass automatically",description:"Exclude this zone from the alarm if it is open while arming.",modes:"Modes in which the zone may be bypassed"},trigger_unavailable:{heading:"Trigger when unavailable",description:"When the zone state becomes 'unavailable', this will activate the zone."}},actions:{toggle_advanced:"Advanced settings",remove:"Remove",setup_groups:"Set up cross-zone groups"},errors:{description:"Please correct the following errors:",no_area:"No partition is selected",no_modes:"No arm modes are selected in which the zone should be active",no_auto_bypass_modes:"No modes are selected in which the zone may be automatically bypassed"}}},dialogs:{manage_groups:{title:"Manage cross-zone groups",description:"In a cross-zone group several zones must trigger within a time period before the alarm is triggered.",no_items:"No cross-zone groups yet",actions:{new_group:"New cross-zone group"}},create_group:{title:"New cross-zone group",fields:{name:{heading:"Name",description:"Name for the cross-zone group"},timeout:{heading:"Time-out",description:"Time period during which consecutive zone activations triggers the alarm."},event_count:{heading:"Count",description:"Amount of different zones that need to be activated to trigger the alarm."},sensors:{heading:"Zones",description:"Select the zones which are contained by this group."}},errors:{invalid_name:"Invalid name provided.",insufficient_sensors:"At least 2 zones need to be selected."}},edit_group:{title:"Edit cross-zone group ''{name}''"}}},codes:{title:"Codes",cards:{codes:{description:"Change settings for the code.",fields:{code_arm_required:{heading:"Require code for arming",description:"A valid code must be provided to arm the alarm."},code_disarm_required:{heading:"Require code for disarming",description:"A valid code must be provided to disarm the alarm."},code_mode_change_required:{heading:"Require code for switching mode",description:"A valid code must be provided to change the arm mode which is active."},code_format:{heading:"Code format",description:"How codes are typed on the alarm card: numbers or any text.",code_format_number:"Pincode",code_format_text:"Password"}}},user_management:{title:"User management",description:"Each user has its own code to arm/disarm the alarm.",no_items:"There are no users yet",actions:{new_user:"New user"}},new_user:{title:"Create new user",description:"Users can be created for providing access to operating the alarm.",fields:{name:{heading:"Name",description:"Name of the user."},code:{heading:"Code",description:"Code for this user."},confirm_code:{heading:"Confirm code",description:"Repeat the code."},can_arm:{heading:"Allow code for arming",description:"Entering this code activates the alarm"},can_disarm:{heading:"Allow code for disarming",description:"Entering this code deactivates the alarm"},is_override_code:{heading:"Is override code",description:"Entering this code will arm the alarm in force"},area_limit:{heading:"Restricted partitions",description:"Limit user to control only the selected partitions"}},errors:{no_name:"No name provided.",no_code:"Code should have 4 characters/numbers minimum.",code_mismatch:"The codes don't match."}},edit_user:{title:"Edit User",description:"Change configuration for user ''{name}''.",fields:{old_code:{heading:"Current code",description:"Current code, leave empty to leave unchanged."}}}}},actions:{title:"Alarm Events",cards:{notifications:{title:"Notifications",description:"Using this panel, you can manage notifications to be sent when a certain alarm event occurs.",table:{no_items:"There are no notifications created yet.",no_area_warning:"Action is not assigned to any partition."},actions:{new_notification:"New notification"}},actions:{description:"Run Home Assistant scripts when the alarm state changes: armed, disarmed, triggered, failed to arm and more.",table:{no_items:"There are no Alarm Events yet."},actions:{new_action:"New Alarm Event"}},new_notification:{title:"Configure notification",description:"Receive a notification when arming/disarming the alarm, on activation, etc.",trigger:"Condition",action:"Task",options:"Options",fields:{event:{heading:"Event",description:"When should the notification be sent",choose:{armed:{name:"Alarm is armed",description:"The alarm is succesfully armed"},disarmed:{name:"Alarm is disarmed",description:"The alarm is disarmed"},triggered:{name:"Alarm is triggered",description:"The alarm is triggered"},untriggered:{name:"Alarm no longer triggered",description:"The triggered state of the alarm has ended"},arm_failure:{name:"Failed to arm",description:"The arming of the alarm failed due to one or more open zones"},arming:{name:"Exit delay started",description:"Exit delay started, ready to leave the house."},pending:{name:"Entry delay started",description:"Entry delay started, the alarm will trigger soon."}}},mode:{heading:"Arm Mode",description:"Only for these Arm Modes (optional)"},title:{heading:"Title",description:"Title for the notification message"},message:{heading:"Message",description:"Content of the notification message",insert_wildcard:"Insert wildcard",placeholders:{armed:"The alarm is set to {{arm_mode}}",disarmed:"The alarm is now OFF",triggered:"The alarm is triggered! Cause: {{open_sensors}}.",untriggered:"The alarm is no longer triggered.",arm_failure:"The alarm could not be armed right now, due to: {{open_sensors}}.",arming:"The alarm will be armed soon, please leave the house.",pending:"The alarm is about to trigger, disarm it quickly!"}},open_sensors_format:{heading:"Format for open_sensors wildcard",description:"Choose which zone information is inserted in the message",options:{default:"Names and states",short:"Names only"}},arm_mode_format:{heading:"Translation for arm_mode wildcard",description:"Choose in which language the arm mode is inserted in the message"},target:{heading:"Target",description:"Device to send the notification to"},media_player_entity:{heading:"Media player entity",description:"Media player to play the message on"},name:{heading:"Name",description:"Description for this notification",placeholders:{armed:"Notify {target} upon arming",disarmed:"Notify {target} upon disarming",triggered:"Notify {target} when triggered",untriggered:"Notify {target} when triggering stops",arm_failure:"Notify {target} on failure",arming:"Notify {target} when leaving",pending:"Notify {target} when arriving"}},delete:{heading:"Delete automation",description:"Permanently remove this automation"}},actions:{test:"Try it"}},new_action:{title:"Alarm Event",description:"Choose an alarm event, then the scripts it runs (for example lights on and a siren when triggered).",fields:{event:{heading:"Event",description:"When the Alarm Event runs"},area:{heading:"Partition",description:"Alarm partition for which the event applies."},mode:{heading:"Arm Mode",description:"Only for these Arm Modes (optional)"},entity:{heading:"Entity",description:"Entity to perform action on"},action:{heading:"Action",description:"Action to perform on the entity",no_common_actions:"Actions can only be assigned in YAML mode for the selected entities."},name:{heading:"Name",description:"A name for this Alarm Event",placeholders:{armed:"Set {entity} to {state} upon arming",disarmed:"Set {entity} to {state} upon disarming",triggered:"Set {entity} to {state} when triggered",untriggered:"Set {entity} to {state} when triggering stops",arm_failure:"Set {entity} to {state} on failure",arming:"Set {entity} to {state} when leaving",pending:"Set {entity} to {state} when arriving"}}}}}},sensor_table:{title:"Zones"},backup:{title:"Integrations & Backup"},partitions:{title:"Partitions & Arm Modes"},modes:{title:"Arm Modes"},notifications:{title:"Notifications"},zones:{title:"Zones"},zones_legacy:{title:"Zones (legacy)"},panel:{title:"Physical Panel"},house:{title:"House Modes"},why:{title:"Arm Check"},activity:{title:"Activity"},users_codes:{title:"Users, Codes, Keypads"},mirrors:{title:"Zone Mirrors"},ha_zones:{title:"Zone Actions"},connections:{title:"Keypads"},house_actions:{title:"House Mode Actions"}},Be={common:Pe,components:Ne,title:De,panels:Re},Ie=Object.freeze({__proto__:null,common:Pe,components:Ne,default:Be,panels:Re,title:De});function Ve(e,t){var s=t&&t.cache?t.cache:Xe,a=t&&t.serializer?t.serializer:Ke;return(t&&t.strategy?t.strategy:We)(e,{cache:s,serializer:a});}function Ue(e,t,s,a){var i,n=null==(i=a)||"number"==typeof i||"boolean"==typeof i?a:s(a),o=t.get(n);return void 0===o&&(o=e.call(this,a),t.set(n,o)),o;}function Fe(e,t,s){var a=Array.prototype.slice.call(arguments,3),i=s(a),n=t.get(i);return void 0===n&&(n=e.apply(this,a),t.set(i,n)),n;}function Ge(e,t,s,a,i){return s.bind(t,e,a,i);}function We(e,t){return Ge(e,this,1===e.length?Ue:Fe,t.cache.create(),t.serializer);}var qe,Ze,Ye,Ke=function(){return JSON.stringify(arguments);},Je=function(){function e(){this.cache=Object.create(null);}return e.prototype.get=function(e){return this.cache[e];},e.prototype.set=function(e,t){this.cache[e]=t;},e;}(),Xe={create:function(){return new Je();}},Qe={variadic:function(e,t){return Ge(e,this,Fe,t.cache.create(),t.serializer);}};function et(e){return e.type===Ze.literal;}function tt(e){return e.type===Ze.argument;}function st(e){return e.type===Ze.number;}function at(e){return e.type===Ze.date;}function it(e){return e.type===Ze.time;}function nt(e){return e.type===Ze.select;}function ot(e){return e.type===Ze.plural;}function rt(e){return e.type===Ze.pound;}function lt(e){return e.type===Ze.tag;}function ct(e){return!(!e||"object"!=typeof e||e.type!==Ye.number);}function dt(e){return!(!e||"object"!=typeof e||e.type!==Ye.dateTime);}!function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG";}(qe||(qe={})),function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag";}(Ze||(Ze={})),function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime";}(Ye||(Ye={}));var ht=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/,pt=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function ut(e){var t={};return e.replace(pt,function(e){var s=e.length;switch(e[0]){case"G":t.era=4===s?"long":5===s?"narrow":"short";break;case"y":t.year=2===s?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][s-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][s-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=4===s?"long":5===s?"narrow":"short";break;case"e":if(s<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][s-4];break;case"c":if(s<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][s-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][s-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][s-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][s-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][s-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][s-1];break;case"s":t.second=["numeric","2-digit"][s-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=s<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead");}return"";}),t;}var mt=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function gt(e){return e.replace(/^(.*?)-/,"");}var vt=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,yt=/^(@+)?(\+|#+)?[rs]?$/g,bt=/(\*)(0+)|(#+)(0+)|(0+)/g,ft=/^(0+)$/;function $t(e){var t={};return"r"===e[e.length-1]?t.roundingPriority="morePrecision":"s"===e[e.length-1]&&(t.roundingPriority="lessPrecision"),e.replace(yt,function(e,s,a){return"string"!=typeof a?(t.minimumSignificantDigits=s.length,t.maximumSignificantDigits=s.length):"+"===a?t.minimumSignificantDigits=s.length:"#"===s[0]?t.maximumSignificantDigits=s.length:(t.minimumSignificantDigits=s.length,t.maximumSignificantDigits=s.length+("string"==typeof a?a.length:0)),"";}),t;}function _t(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"};}}function wt(e){var t;if("E"===e[0]&&"E"===e[1]?(t={notation:"engineering"},e=e.slice(2)):"E"===e[0]&&(t={notation:"scientific"},e=e.slice(1)),t){var s=e.slice(0,2);if("+!"===s?(t.signDisplay="always",e=e.slice(2)):"+?"===s&&(t.signDisplay="exceptZero",e=e.slice(2)),!ft.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length;}return t;}function kt(e){var t=_t(e);return t||{};}function xt(e){for(var t={},a=0,i=e;a<i.length;a++){var n=i[a];switch(n.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=n.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=gt(n.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=s(s(s({},t),{notation:"scientific"}),n.options.reduce(function(e,t){return s(s({},e),kt(t));},{}));continue;case"engineering":t=s(s(s({},t),{notation:"engineering"}),n.options.reduce(function(e,t){return s(s({},e),kt(t));},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(n.options[0]);continue;case"rounding-mode-floor":t.roundingMode="floor";continue;case"rounding-mode-ceiling":t.roundingMode="ceil";continue;case"rounding-mode-down":t.roundingMode="trunc";continue;case"rounding-mode-up":t.roundingMode="expand";continue;case"rounding-mode-half-even":t.roundingMode="halfEven";continue;case"rounding-mode-half-down":t.roundingMode="halfTrunc";continue;case"rounding-mode-half-up":t.roundingMode="halfExpand";continue;case"integer-width":if(n.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");n.options[0].replace(bt,function(e,s,a,i,n,o){if(s)t.minimumIntegerDigits=a.length;else{if(i&&n)throw new Error("We currently do not support maximum integer digits");if(o)throw new Error("We currently do not support exact integer digits");}return"";});continue;}if(ft.test(n.stem))t.minimumIntegerDigits=n.stem.length;else if(vt.test(n.stem)){if(n.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");n.stem.replace(vt,function(e,s,a,i,n,o){return"*"===a?t.minimumFractionDigits=s.length:i&&"#"===i[0]?t.maximumFractionDigits=i.length:n&&o?(t.minimumFractionDigits=n.length,t.maximumFractionDigits=n.length+o.length):(t.minimumFractionDigits=s.length,t.maximumFractionDigits=s.length),"";});var o=n.options[0];"w"===o?t=s(s({},t),{trailingZeroDisplay:"stripIfInteger"}):o&&(t=s(s({},t),$t(o)));}else if(yt.test(n.stem))t=s(s({},t),$t(n.stem));else{var r=_t(n.stem);r&&(t=s(s({},t),r));var l=wt(n.stem);l&&(t=s(s({},t),l));}}return t;}var At,Ot={"001":["H","h"],419:["h","H","hB","hb"],AC:["H","h","hb","hB"],AD:["H","hB"],AE:["h","hB","hb","H"],AF:["H","hb","hB","h"],AG:["h","hb","H","hB"],AI:["H","h","hb","hB"],AL:["h","H","hB"],AM:["H","hB"],AO:["H","hB"],AR:["h","H","hB","hb"],AS:["h","H"],AT:["H","hB"],AU:["h","hb","H","hB"],AW:["H","hB"],AX:["H"],AZ:["H","hB","h"],BA:["H","hB","h"],BB:["h","hb","H","hB"],BD:["h","hB","H"],BE:["H","hB"],BF:["H","hB"],BG:["H","hB","h"],BH:["h","hB","hb","H"],BI:["H","h"],BJ:["H","hB"],BL:["H","hB"],BM:["h","hb","H","hB"],BN:["hb","hB","h","H"],BO:["h","H","hB","hb"],BQ:["H"],BR:["H","hB"],BS:["h","hb","H","hB"],BT:["h","H"],BW:["H","h","hb","hB"],BY:["H","h"],BZ:["H","h","hb","hB"],CA:["h","hb","H","hB"],CC:["H","h","hb","hB"],CD:["hB","H"],CF:["H","h","hB"],CG:["H","hB"],CH:["H","hB","h"],CI:["H","hB"],CK:["H","h","hb","hB"],CL:["h","H","hB","hb"],CM:["H","h","hB"],CN:["H","hB","hb","h"],CO:["h","H","hB","hb"],CP:["H"],CR:["h","H","hB","hb"],CU:["h","H","hB","hb"],CV:["H","hB"],CW:["H","hB"],CX:["H","h","hb","hB"],CY:["h","H","hb","hB"],CZ:["H"],DE:["H","hB"],DG:["H","h","hb","hB"],DJ:["h","H"],DK:["H"],DM:["h","hb","H","hB"],DO:["h","H","hB","hb"],DZ:["h","hB","hb","H"],EA:["H","h","hB","hb"],EC:["h","H","hB","hb"],EE:["H","hB"],EG:["h","hB","hb","H"],EH:["h","hB","hb","H"],ER:["h","H"],ES:["H","hB","h","hb"],ET:["hB","hb","h","H"],FI:["H"],FJ:["h","hb","H","hB"],FK:["H","h","hb","hB"],FM:["h","hb","H","hB"],FO:["H","h"],FR:["H","hB"],GA:["H","hB"],GB:["H","h","hb","hB"],GD:["h","hb","H","hB"],GE:["H","hB","h"],GF:["H","hB"],GG:["H","h","hb","hB"],GH:["h","H"],GI:["H","h","hb","hB"],GL:["H","h"],GM:["h","hb","H","hB"],GN:["H","hB"],GP:["H","hB"],GQ:["H","hB","h","hb"],GR:["h","H","hb","hB"],GT:["h","H","hB","hb"],GU:["h","hb","H","hB"],GW:["H","hB"],GY:["h","hb","H","hB"],HK:["h","hB","hb","H"],HN:["h","H","hB","hb"],HR:["H","hB"],HU:["H","h"],IC:["H","h","hB","hb"],ID:["H"],IE:["H","h","hb","hB"],IL:["H","hB"],IM:["H","h","hb","hB"],IN:["h","H"],IO:["H","h","hb","hB"],IQ:["h","hB","hb","H"],IR:["hB","H"],IS:["H"],IT:["H","hB"],JE:["H","h","hb","hB"],JM:["h","hb","H","hB"],JO:["h","hB","hb","H"],JP:["H","K","h"],KE:["hB","hb","H","h"],KG:["H","h","hB","hb"],KH:["hB","h","H","hb"],KI:["h","hb","H","hB"],KM:["H","h","hB","hb"],KN:["h","hb","H","hB"],KP:["h","H","hB","hb"],KR:["h","H","hB","hb"],KW:["h","hB","hb","H"],KY:["h","hb","H","hB"],KZ:["H","hB"],LA:["H","hb","hB","h"],LB:["h","hB","hb","H"],LC:["h","hb","H","hB"],LI:["H","hB","h"],LK:["H","h","hB","hb"],LR:["h","hb","H","hB"],LS:["h","H"],LT:["H","h","hb","hB"],LU:["H","h","hB"],LV:["H","hB","hb","h"],LY:["h","hB","hb","H"],MA:["H","h","hB","hb"],MC:["H","hB"],MD:["H","hB"],ME:["H","hB","h"],MF:["H","hB"],MG:["H","h"],MH:["h","hb","H","hB"],MK:["H","h","hb","hB"],ML:["H"],MM:["hB","hb","H","h"],MN:["H","h","hb","hB"],MO:["h","hB","hb","H"],MP:["h","hb","H","hB"],MQ:["H","hB"],MR:["h","hB","hb","H"],MS:["H","h","hb","hB"],MT:["H","h"],MU:["H","h"],MV:["H","h"],MW:["h","hb","H","hB"],MX:["h","H","hB","hb"],MY:["hb","hB","h","H"],MZ:["H","hB"],NA:["h","H","hB","hb"],NC:["H","hB"],NE:["H"],NF:["H","h","hb","hB"],NG:["H","h","hb","hB"],NI:["h","H","hB","hb"],NL:["H","hB"],NO:["H","h"],NP:["H","h","hB"],NR:["H","h","hb","hB"],NU:["H","h","hb","hB"],NZ:["h","hb","H","hB"],OM:["h","hB","hb","H"],PA:["h","H","hB","hb"],PE:["h","H","hB","hb"],PF:["H","h","hB"],PG:["h","H"],PH:["h","hB","hb","H"],PK:["h","hB","H"],PL:["H","h"],PM:["H","hB"],PN:["H","h","hb","hB"],PR:["h","H","hB","hb"],PS:["h","hB","hb","H"],PT:["H","hB"],PW:["h","H"],PY:["h","H","hB","hb"],QA:["h","hB","hb","H"],RE:["H","hB"],RO:["H","hB"],RS:["H","hB","h"],RU:["H"],RW:["H","h"],SA:["h","hB","hb","H"],SB:["h","hb","H","hB"],SC:["H","h","hB"],SD:["h","hB","hb","H"],SE:["H"],SG:["h","hb","H","hB"],SH:["H","h","hb","hB"],SI:["H","hB"],SJ:["H"],SK:["H"],SL:["h","hb","H","hB"],SM:["H","h","hB"],SN:["H","h","hB"],SO:["h","H"],SR:["H","hB"],SS:["h","hb","H","hB"],ST:["H","hB"],SV:["h","H","hB","hb"],SX:["H","h","hb","hB"],SY:["h","hB","hb","H"],SZ:["h","hb","H","hB"],TA:["H","h","hb","hB"],TC:["h","hb","H","hB"],TD:["h","H","hB"],TF:["H","h","hB"],TG:["H","hB"],TH:["H","h"],TJ:["H","h"],TL:["H","hB","hb","h"],TM:["H","h"],TN:["h","hB","hb","H"],TO:["h","H"],TR:["H","hB"],TT:["h","hb","H","hB"],TW:["hB","hb","h","H"],TZ:["hB","hb","H","h"],UA:["H","hB","h"],UG:["hB","hb","H","h"],UM:["h","hb","H","hB"],US:["h","hb","H","hB"],UY:["h","H","hB","hb"],UZ:["H","hB","h"],VA:["H","h","hB"],VC:["h","hb","H","hB"],VE:["h","H","hB","hb"],VG:["h","hb","H","hB"],VI:["h","hb","H","hB"],VN:["H","h"],VU:["h","H"],WF:["H","hB"],WS:["h","H"],XK:["H","hB","h"],YE:["h","hB","hb","H"],YT:["H","hB"],ZA:["H","h","hb","hB"],ZM:["h","hb","H","hB"],ZW:["H","h"],"af-ZA":["H","h","hB","hb"],"ar-001":["h","hB","hb","H"],"ca-ES":["H","h","hB"],"en-001":["h","hb","H","hB"],"en-HK":["h","hb","H","hB"],"en-IL":["H","h","hb","hB"],"en-MY":["h","hb","H","hB"],"es-BR":["H","h","hB","hb"],"es-ES":["H","h","hB","hb"],"es-GQ":["H","h","hB","hb"],"fr-CA":["H","h","hB"],"gl-ES":["H","h","hB"],"gu-IN":["hB","hb","h","H"],"hi-IN":["hB","h","H"],"it-CH":["H","h","hB"],"it-IT":["H","h","hB"],"kn-IN":["hB","h","H"],"ml-IN":["hB","h","H"],"mr-IN":["hB","hb","h","H"],"pa-IN":["hB","hb","h","H"],"ta-IN":["hB","h","hb","H"],"te-IN":["hB","h","H"],"zu-ZA":["H","hB","hb","h"]};function St(e){var t=e.hourCycle;if(void 0===t&&e.hourCycles&&e.hourCycles.length&&(t=e.hourCycles[0]),t)switch(t){case"h24":return"k";case"h23":return"H";case"h12":return"h";case"h11":return"K";default:throw new Error("Invalid hourCycle");}var s,a=e.language;return"root"!==a&&(s=e.maximize().region),(Ot[s||""]||Ot[a||""]||Ot["".concat(a,"-001")]||Ot["001"])[0];}var Ct=new RegExp("^".concat(ht.source,"*")),jt=new RegExp("".concat(ht.source,"*$"));function Et(e,t){return{start:e,end:t};}var Mt=!!String.prototype.startsWith&&"_a".startsWith("a",1),Ht=!!String.fromCodePoint,Lt=!!Object.fromEntries,Tt=!!String.prototype.codePointAt,zt=!!String.prototype.trimStart,Pt=!!String.prototype.trimEnd,Nt=!!Number.isSafeInteger?Number.isSafeInteger:function(e){return"number"==typeof e&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991;},Dt=!0;try{Dt="a"===(null===(At=Wt("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu").exec("a"))||void 0===At?void 0:At[0]);}catch(V){Dt=!1;}var Rt,Bt=Mt?function(e,t,s){return e.startsWith(t,s);}:function(e,t,s){return e.slice(s,s+t.length)===t;},It=Ht?String.fromCodePoint:function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];for(var s,a="",i=e.length,n=0;i>n;){if((s=e[n++])>1114111)throw RangeError(s+" is not a valid code point");a+=s<65536?String.fromCharCode(s):String.fromCharCode(55296+((s-=65536)>>10),s%1024+56320);}return a;},Vt=Lt?Object.fromEntries:function(e){for(var t={},s=0,a=e;s<a.length;s++){var i=a[s],n=i[0],o=i[1];t[n]=o;}return t;},Ut=Tt?function(e,t){return e.codePointAt(t);}:function(e,t){var s=e.length;if(!(t<0||t>=s)){var a,i=e.charCodeAt(t);return i<55296||i>56319||t+1===s||(a=e.charCodeAt(t+1))<56320||a>57343?i:a-56320+(i-55296<<10)+65536;}},Ft=zt?function(e){return e.trimStart();}:function(e){return e.replace(Ct,"");},Gt=Pt?function(e){return e.trimEnd();}:function(e){return e.replace(jt,"");};function Wt(e,t){return new RegExp(e,t);}if(Dt){var qt=Wt("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu");Rt=function(e,t){var s;return qt.lastIndex=t,null!==(s=qt.exec(e)[1])&&void 0!==s?s:"";};}else Rt=function(e,t){for(var s=[];;){var a=Ut(e,t);if(void 0===a||Xt(a)||Qt(a))break;s.push(a),t+=a>=65536?2:1;}return It.apply(void 0,s);};var Zt,Yt=function(){function e(e,t){void 0===t&&(t={}),this.message=e,this.position={offset:0,line:1,column:1},this.ignoreTag=!!t.ignoreTag,this.locale=t.locale,this.requiresOtherClause=!!t.requiresOtherClause,this.shouldParseSkeletons=!!t.shouldParseSkeletons;}return e.prototype.parse=function(){if(0!==this.offset())throw Error("parser can only be used once");return this.parseMessage(0,"",!1);},e.prototype.parseMessage=function(e,t,s){for(var a=[];!this.isEOF();){var i=this.char();if(123===i){if((n=this.parseArgument(e,s)).err)return n;a.push(n.val);}else{if(125===i&&e>0)break;if(35!==i||"plural"!==t&&"selectordinal"!==t){if(60===i&&!this.ignoreTag&&47===this.peek()){if(s)break;return this.error(qe.UNMATCHED_CLOSING_TAG,Et(this.clonePosition(),this.clonePosition()));}if(60===i&&!this.ignoreTag&&Kt(this.peek()||0)){if((n=this.parseTag(e,t)).err)return n;a.push(n.val);}else{var n;if((n=this.parseLiteral(e,t)).err)return n;a.push(n.val);}}else{var o=this.clonePosition();this.bump(),a.push({type:Ze.pound,location:Et(o,this.clonePosition())});}}}return{val:a,err:null};},e.prototype.parseTag=function(e,t){var s=this.clonePosition();this.bump();var a=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:Ze.literal,value:"<".concat(a,"/>"),location:Et(s,this.clonePosition())},err:null};if(this.bumpIf(">")){var i=this.parseMessage(e+1,t,!0);if(i.err)return i;var n=i.val,o=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!Kt(this.char()))return this.error(qe.INVALID_TAG,Et(o,this.clonePosition()));var r=this.clonePosition();return a!==this.parseTagName()?this.error(qe.UNMATCHED_CLOSING_TAG,Et(r,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:Ze.tag,value:a,children:n,location:Et(s,this.clonePosition())},err:null}:this.error(qe.INVALID_TAG,Et(o,this.clonePosition())));}return this.error(qe.UNCLOSED_TAG,Et(s,this.clonePosition()));}return this.error(qe.INVALID_TAG,Et(s,this.clonePosition()));},e.prototype.parseTagName=function(){var e=this.offset();for(this.bump();!this.isEOF()&&Jt(this.char());)this.bump();return this.message.slice(e,this.offset());},e.prototype.parseLiteral=function(e,t){for(var s=this.clonePosition(),a="";;){var i=this.tryParseQuote(t);if(i)a+=i;else{var n=this.tryParseUnquoted(e,t);if(n)a+=n;else{var o=this.tryParseLeftAngleBracket();if(!o)break;a+=o;}}}var r=Et(s,this.clonePosition());return{val:{type:Ze.literal,value:a,location:r},err:null};},e.prototype.tryParseLeftAngleBracket=function(){return this.isEOF()||60!==this.char()||!this.ignoreTag&&(Kt(e=this.peek()||0)||47===e)?null:(this.bump(),"<");var e;},e.prototype.tryParseQuote=function(e){if(this.isEOF()||39!==this.char())return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if("plural"===e||"selectordinal"===e)break;return null;default:return null;}this.bump();var t=[this.char()];for(this.bump();!this.isEOF();){var s=this.char();if(39===s){if(39!==this.peek()){this.bump();break;}t.push(39),this.bump();}else t.push(s);this.bump();}return It.apply(void 0,t);},e.prototype.tryParseUnquoted=function(e,t){if(this.isEOF())return null;var s=this.char();return 60===s||123===s||35===s&&("plural"===t||"selectordinal"===t)||125===s&&e>0?null:(this.bump(),It(s));},e.prototype.parseArgument=function(e,t){var s=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(qe.EXPECT_ARGUMENT_CLOSING_BRACE,Et(s,this.clonePosition()));if(125===this.char())return this.bump(),this.error(qe.EMPTY_ARGUMENT,Et(s,this.clonePosition()));var a=this.parseIdentifierIfPossible().value;if(!a)return this.error(qe.MALFORMED_ARGUMENT,Et(s,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(qe.EXPECT_ARGUMENT_CLOSING_BRACE,Et(s,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:Ze.argument,value:a,location:Et(s,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(qe.EXPECT_ARGUMENT_CLOSING_BRACE,Et(s,this.clonePosition())):this.parseArgumentOptions(e,t,a,s);default:return this.error(qe.MALFORMED_ARGUMENT,Et(s,this.clonePosition()));}},e.prototype.parseIdentifierIfPossible=function(){var e=this.clonePosition(),t=this.offset(),s=Rt(this.message,t),a=t+s.length;return this.bumpTo(a),{value:s,location:Et(e,this.clonePosition())};},e.prototype.parseArgumentOptions=function(e,t,a,i){var n,o=this.clonePosition(),r=this.parseIdentifierIfPossible().value,l=this.clonePosition();switch(r){case"":return this.error(qe.EXPECT_ARGUMENT_TYPE,Et(o,l));case"number":case"date":case"time":this.bumpSpace();var c=null;if(this.bumpIf(",")){this.bumpSpace();var d=this.clonePosition();if((b=this.parseSimpleArgStyleIfPossible()).err)return b;if(0===(m=Gt(b.val)).length)return this.error(qe.EXPECT_ARGUMENT_STYLE,Et(this.clonePosition(),this.clonePosition()));c={style:m,styleLocation:Et(d,this.clonePosition())};}if((f=this.tryParseArgumentClose(i)).err)return f;var h=Et(i,this.clonePosition());if(c&&Bt(null==c?void 0:c.style,"::",0)){var p=Ft(c.style.slice(2));if("number"===r)return(b=this.parseNumberSkeletonFromString(p,c.styleLocation)).err?b:{val:{type:Ze.number,value:a,location:h,style:b.val},err:null};if(0===p.length)return this.error(qe.EXPECT_DATE_TIME_SKELETON,h);var u=p;this.locale&&(u=function(e,t){for(var s="",a=0;a<e.length;a++){var i=e.charAt(a);if("j"===i){for(var n=0;a+1<e.length&&e.charAt(a+1)===i;)n++,a++;var o=1+(1&n),r=n<2?1:3+(n>>1),l=St(t);for("H"!=l&&"k"!=l||(r=0);r-->0;)s+="a";for(;o-->0;)s=l+s;}else s+="J"===i?"H":i;}return s;}(p,this.locale));var m={type:Ye.dateTime,pattern:u,location:c.styleLocation,parsedOptions:this.shouldParseSkeletons?ut(u):{}};return{val:{type:"date"===r?Ze.date:Ze.time,value:a,location:h,style:m},err:null};}return{val:{type:"number"===r?Ze.number:"date"===r?Ze.date:Ze.time,value:a,location:h,style:null!==(n=null==c?void 0:c.style)&&void 0!==n?n:null},err:null};case"plural":case"selectordinal":case"select":var g=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(qe.EXPECT_SELECT_ARGUMENT_OPTIONS,Et(g,s({},g)));this.bumpSpace();var v=this.parseIdentifierIfPossible(),y=0;if("select"!==r&&"offset"===v.value){if(!this.bumpIf(":"))return this.error(qe.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,Et(this.clonePosition(),this.clonePosition()));var b;if(this.bumpSpace(),(b=this.tryParseDecimalInteger(qe.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,qe.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE)).err)return b;this.bumpSpace(),v=this.parseIdentifierIfPossible(),y=b.val;}var f,$=this.tryParsePluralOrSelectOptions(e,r,t,v);if($.err)return $;if((f=this.tryParseArgumentClose(i)).err)return f;var _=Et(i,this.clonePosition());return"select"===r?{val:{type:Ze.select,value:a,options:Vt($.val),location:_},err:null}:{val:{type:Ze.plural,value:a,options:Vt($.val),offset:y,pluralType:"plural"===r?"cardinal":"ordinal",location:_},err:null};default:return this.error(qe.INVALID_ARGUMENT_TYPE,Et(o,l));}},e.prototype.tryParseArgumentClose=function(e){return this.isEOF()||125!==this.char()?this.error(qe.EXPECT_ARGUMENT_CLOSING_BRACE,Et(e,this.clonePosition())):(this.bump(),{val:!0,err:null});},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var e=0,t=this.clonePosition();!this.isEOF();){switch(this.char()){case 39:this.bump();var s=this.clonePosition();if(!this.bumpUntil("'"))return this.error(qe.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,Et(s,this.clonePosition()));this.bump();break;case 123:e+=1,this.bump();break;case 125:if(!(e>0))return{val:this.message.slice(t.offset,this.offset()),err:null};e-=1;break;default:this.bump();}}return{val:this.message.slice(t.offset,this.offset()),err:null};},e.prototype.parseNumberSkeletonFromString=function(e,t){var s=[];try{s=function(e){if(0===e.length)throw new Error("Number skeleton cannot be empty");for(var t=e.split(mt).filter(function(e){return e.length>0;}),s=[],a=0,i=t;a<i.length;a++){var n=i[a].split("/");if(0===n.length)throw new Error("Invalid number skeleton");for(var o=n[0],r=n.slice(1),l=0,c=r;l<c.length;l++)if(0===c[l].length)throw new Error("Invalid number skeleton");s.push({stem:o,options:r});}return s;}(e);}catch(e){return this.error(qe.INVALID_NUMBER_SKELETON,t);}return{val:{type:Ye.number,tokens:s,location:t,parsedOptions:this.shouldParseSkeletons?xt(s):{}},err:null};},e.prototype.tryParsePluralOrSelectOptions=function(e,t,s,a){for(var i,n=!1,o=[],r=new Set(),l=a.value,c=a.location;;){if(0===l.length){var d=this.clonePosition();if("select"===t||!this.bumpIf("="))break;var h=this.tryParseDecimalInteger(qe.EXPECT_PLURAL_ARGUMENT_SELECTOR,qe.INVALID_PLURAL_ARGUMENT_SELECTOR);if(h.err)return h;c=Et(d,this.clonePosition()),l=this.message.slice(d.offset,this.offset());}if(r.has(l))return this.error("select"===t?qe.DUPLICATE_SELECT_ARGUMENT_SELECTOR:qe.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,c);"other"===l&&(n=!0),this.bumpSpace();var p=this.clonePosition();if(!this.bumpIf("{"))return this.error("select"===t?qe.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:qe.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,Et(this.clonePosition(),this.clonePosition()));var u=this.parseMessage(e+1,t,s);if(u.err)return u;var m=this.tryParseArgumentClose(p);if(m.err)return m;o.push([l,{value:u.val,location:Et(p,this.clonePosition())}]),r.add(l),this.bumpSpace(),l=(i=this.parseIdentifierIfPossible()).value,c=i.location;}return 0===o.length?this.error("select"===t?qe.EXPECT_SELECT_ARGUMENT_SELECTOR:qe.EXPECT_PLURAL_ARGUMENT_SELECTOR,Et(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!n?this.error(qe.MISSING_OTHER_CLAUSE,Et(this.clonePosition(),this.clonePosition())):{val:o,err:null};},e.prototype.tryParseDecimalInteger=function(e,t){var s=1,a=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(s=-1);for(var i=!1,n=0;!this.isEOF();){var o=this.char();if(!(o>=48&&o<=57))break;i=!0,n=10*n+(o-48),this.bump();}var r=Et(a,this.clonePosition());return i?Nt(n*=s)?{val:n,err:null}:this.error(t,r):this.error(e,r);},e.prototype.offset=function(){return this.position.offset;},e.prototype.isEOF=function(){return this.offset()===this.message.length;},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column};},e.prototype.char=function(){var e=this.position.offset;if(e>=this.message.length)throw Error("out of bound");var t=Ut(this.message,e);if(void 0===t)throw Error("Offset ".concat(e," is at invalid UTF-16 code unit boundary"));return t;},e.prototype.error=function(e,t){return{val:null,err:{kind:e,message:this.message,location:t}};},e.prototype.bump=function(){if(!this.isEOF()){var e=this.char();10===e?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=e<65536?1:2);}},e.prototype.bumpIf=function(e){if(Bt(this.message,e,this.offset())){for(var t=0;t<e.length;t++)this.bump();return!0;}return!1;},e.prototype.bumpUntil=function(e){var t=this.offset(),s=this.message.indexOf(e,t);return s>=0?(this.bumpTo(s),!0):(this.bumpTo(this.message.length),!1);},e.prototype.bumpTo=function(e){if(this.offset()>e)throw Error("targetOffset ".concat(e," must be greater than or equal to the current offset ").concat(this.offset()));for(e=Math.min(e,this.message.length);;){var t=this.offset();if(t===e)break;if(t>e)throw Error("targetOffset ".concat(e," is at invalid UTF-16 code unit boundary"));if(this.bump(),this.isEOF())break;}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&Xt(this.char());)this.bump();},e.prototype.peek=function(){if(this.isEOF())return null;var e=this.char(),t=this.offset(),s=this.message.charCodeAt(t+(e>=65536?2:1));return null!=s?s:null;},e;}();function Kt(e){return e>=97&&e<=122||e>=65&&e<=90;}function Jt(e){return 45===e||46===e||e>=48&&e<=57||95===e||e>=97&&e<=122||e>=65&&e<=90||183==e||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039;}function Xt(e){return e>=9&&e<=13||32===e||133===e||e>=8206&&e<=8207||8232===e||8233===e;}function Qt(e){return e>=33&&e<=35||36===e||e>=37&&e<=39||40===e||41===e||42===e||43===e||44===e||45===e||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||91===e||92===e||93===e||94===e||96===e||123===e||124===e||125===e||126===e||161===e||e>=162&&e<=165||166===e||167===e||169===e||171===e||172===e||174===e||176===e||177===e||182===e||187===e||191===e||215===e||247===e||e>=8208&&e<=8213||e>=8214&&e<=8215||8216===e||8217===e||8218===e||e>=8219&&e<=8220||8221===e||8222===e||8223===e||e>=8224&&e<=8231||e>=8240&&e<=8248||8249===e||8250===e||e>=8251&&e<=8254||e>=8257&&e<=8259||8260===e||8261===e||8262===e||e>=8263&&e<=8273||8274===e||8275===e||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||8608===e||e>=8609&&e<=8610||8611===e||e>=8612&&e<=8613||8614===e||e>=8615&&e<=8621||8622===e||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||8658===e||8659===e||8660===e||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||8968===e||8969===e||8970===e||8971===e||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||9001===e||9002===e||e>=9003&&e<=9083||9084===e||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||9655===e||e>=9656&&e<=9664||9665===e||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||9839===e||e>=9840&&e<=10087||10088===e||10089===e||10090===e||10091===e||10092===e||10093===e||10094===e||10095===e||10096===e||10097===e||10098===e||10099===e||10100===e||10101===e||e>=10132&&e<=10175||e>=10176&&e<=10180||10181===e||10182===e||e>=10183&&e<=10213||10214===e||10215===e||10216===e||10217===e||10218===e||10219===e||10220===e||10221===e||10222===e||10223===e||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||10627===e||10628===e||10629===e||10630===e||10631===e||10632===e||10633===e||10634===e||10635===e||10636===e||10637===e||10638===e||10639===e||10640===e||10641===e||10642===e||10643===e||10644===e||10645===e||10646===e||10647===e||10648===e||e>=10649&&e<=10711||10712===e||10713===e||10714===e||10715===e||e>=10716&&e<=10747||10748===e||10749===e||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||11158===e||e>=11159&&e<=11263||e>=11776&&e<=11777||11778===e||11779===e||11780===e||11781===e||e>=11782&&e<=11784||11785===e||11786===e||11787===e||11788===e||11789===e||e>=11790&&e<=11798||11799===e||e>=11800&&e<=11801||11802===e||11803===e||11804===e||11805===e||e>=11806&&e<=11807||11808===e||11809===e||11810===e||11811===e||11812===e||11813===e||11814===e||11815===e||11816===e||11817===e||e>=11818&&e<=11822||11823===e||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||11840===e||11841===e||11842===e||e>=11843&&e<=11855||e>=11856&&e<=11857||11858===e||e>=11859&&e<=11903||e>=12289&&e<=12291||12296===e||12297===e||12298===e||12299===e||12300===e||12301===e||12302===e||12303===e||12304===e||12305===e||e>=12306&&e<=12307||12308===e||12309===e||12310===e||12311===e||12312===e||12313===e||12314===e||12315===e||12316===e||12317===e||e>=12318&&e<=12319||12320===e||12336===e||64830===e||64831===e||e>=65093&&e<=65094;}function es(e){e.forEach(function(e){if(delete e.location,nt(e)||ot(e))for(var t in e.options)delete e.options[t].location,es(e.options[t].value);else st(e)&&ct(e.style)||(at(e)||it(e))&&dt(e.style)?delete e.style.location:lt(e)&&es(e.children);});}function ts(e,t){void 0===t&&(t={}),t=s({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var a=new Yt(e,t).parse();if(a.err){var i=SyntaxError(qe[a.err.kind]);throw i.location=a.err.location,i.originalMessage=a.err.message,i;}return(null==t?void 0:t.captureLocation)||es(a.val),a.val;}!function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API";}(Zt||(Zt={}));var ss,as=function(e){function s(t,s,a){var i=e.call(this,t)||this;return i.code=s,i.originalMessage=a,i;}return t(s,e),s.prototype.toString=function(){return"[formatjs Error: ".concat(this.code,"] ").concat(this.message);},s;}(Error),is=function(e){function s(t,s,a,i){return e.call(this,'Invalid values for "'.concat(t,'": "').concat(s,'". Options are "').concat(Object.keys(a).join('", "'),'"'),Zt.INVALID_VALUE,i)||this;}return t(s,e),s;}(as),ns=function(e){function s(t,s,a){return e.call(this,'Value for "'.concat(t,'" must be of type ').concat(s),Zt.INVALID_VALUE,a)||this;}return t(s,e),s;}(as),os=function(e){function s(t,s){return e.call(this,'The intl string context variable "'.concat(t,'" was not provided to the string "').concat(s,'"'),Zt.MISSING_VALUE,s)||this;}return t(s,e),s;}(as);function rs(e){return"function"==typeof e;}function ls(e,t,s,a,i,n,o){if(1===e.length&&et(e[0]))return[{type:ss.literal,value:e[0].value}];for(var r=[],l=0,c=e;l<c.length;l++){var d=c[l];if(et(d))r.push({type:ss.literal,value:d.value});else if(rt(d))"number"==typeof n&&r.push({type:ss.literal,value:s.getNumberFormat(t).format(n)});else{var h=d.value;if(!i||!(h in i))throw new os(h,o);var p=i[h];if(tt(d))p&&"string"!=typeof p&&"number"!=typeof p||(p="string"==typeof p||"number"==typeof p?String(p):""),r.push({type:"string"==typeof p?ss.literal:ss.object,value:p});else if(at(d)){var u="string"==typeof d.style?a.date[d.style]:dt(d.style)?d.style.parsedOptions:void 0;r.push({type:ss.literal,value:s.getDateTimeFormat(t,u).format(p)});}else if(it(d)){u="string"==typeof d.style?a.time[d.style]:dt(d.style)?d.style.parsedOptions:a.time.medium;r.push({type:ss.literal,value:s.getDateTimeFormat(t,u).format(p)});}else if(st(d)){(u="string"==typeof d.style?a.number[d.style]:ct(d.style)?d.style.parsedOptions:void 0)&&u.scale&&(p*=u.scale||1),r.push({type:ss.literal,value:s.getNumberFormat(t,u).format(p)});}else{if(lt(d)){var m=d.children,g=d.value,v=i[g];if(!rs(v))throw new ns(g,"function",o);var y=v(ls(m,t,s,a,i,n).map(function(e){return e.value;}));Array.isArray(y)||(y=[y]),r.push.apply(r,y.map(function(e){return{type:"string"==typeof e?ss.literal:ss.object,value:e};}));}if(nt(d)){if(!(b=d.options[p]||d.options.other))throw new is(d.value,p,Object.keys(d.options),o);r.push.apply(r,ls(b.value,t,s,a,i));}else if(ot(d)){var b;if(!(b=d.options["=".concat(p)])){if(!Intl.PluralRules)throw new as('Intl.PluralRules is not available in this environment.\nTry polyfilling it using "@formatjs/intl-pluralrules"\n',Zt.MISSING_INTL_API,o);var f=s.getPluralRules(t,{type:d.pluralType}).select(p-(d.offset||0));b=d.options[f]||d.options.other;}if(!b)throw new is(d.value,p,Object.keys(d.options),o);r.push.apply(r,ls(b.value,t,s,a,i,p-(d.offset||0)));}else;}}}return function(e){return e.length<2?e:e.reduce(function(e,t){var s=e[e.length-1];return s&&s.type===ss.literal&&t.type===ss.literal?s.value+=t.value:e.push(t),e;},[]);}(r);}function cs(e,t){return t?Object.keys(e).reduce(function(a,i){var n,o;return a[i]=(n=e[i],(o=t[i])?s(s(s({},n||{}),o||{}),Object.keys(n).reduce(function(e,t){return e[t]=s(s({},n[t]),o[t]||{}),e;},{})):n),a;},s({},e)):e;}function ds(e){return{create:function(){return{get:function(t){return e[t];},set:function(t,s){e[t]=s;}};}};}!function(e){e[e.literal=0]="literal",e[e.object=1]="object";}(ss||(ss={}));var hs=function(){function e(t,i,o,r){void 0===i&&(i=e.defaultLocale);var l,c=this;if(this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(e){var t=c.formatToParts(e);if(1===t.length)return t[0].value;var s=t.reduce(function(e,t){return e.length&&t.type===ss.literal&&"string"==typeof e[e.length-1]?e[e.length-1]+=t.value:e.push(t.value),e;},[]);return s.length<=1?s[0]||"":s;},this.formatToParts=function(e){return ls(c.ast,c.locales,c.formatters,c.formats,e,void 0,c.message);},this.resolvedOptions=function(){var e;return{locale:(null===(e=c.resolvedLocale)||void 0===e?void 0:e.toString())||Intl.NumberFormat.supportedLocalesOf(c.locales)[0]};},this.getAst=function(){return c.ast;},this.locales=i,this.resolvedLocale=e.resolveLocale(i),"string"==typeof t){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");var d=r||{};d.formatters;var h=a(d,["formatters"]);this.ast=e.__parse(t,s(s({},h),{locale:this.resolvedLocale}));}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=cs(e.formats,o),this.formatters=r&&r.formatters||(void 0===(l=this.formatterCache)&&(l={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:Ve(function(){for(var e,t=[],s=0;s<arguments.length;s++)t[s]=arguments[s];return new((e=Intl.NumberFormat).bind.apply(e,n([void 0],t,!1)))();},{cache:ds(l.number),strategy:Qe.variadic}),getDateTimeFormat:Ve(function(){for(var e,t=[],s=0;s<arguments.length;s++)t[s]=arguments[s];return new((e=Intl.DateTimeFormat).bind.apply(e,n([void 0],t,!1)))();},{cache:ds(l.dateTime),strategy:Qe.variadic}),getPluralRules:Ve(function(){for(var e,t=[],s=0;s<arguments.length;s++)t[s]=arguments[s];return new((e=Intl.PluralRules).bind.apply(e,n([void 0],t,!1)))();},{cache:ds(l.pluralRules),strategy:Qe.variadic})});}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale;},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.resolveLocale=function(e){if(void 0!==Intl.Locale){var t=Intl.NumberFormat.supportedLocalesOf(e);return t.length>0?new Intl.Locale(t[0]):new Intl.Locale("string"==typeof e?e:e[0]);}},e.__parse=ts,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e;}(),ps={en:Ie};function us(e,t,...s){const a=t.replace(/['"]+/g,"");var i;try{i=e.split(".").reduce((e,t)=>e[t],ps[a]);}catch(t){i=e.split(".").reduce((e,t)=>e[t],ps.en);}if(void 0===i&&(i=e.split(".").reduce((e,t)=>e[t],ps.en)),!s.length)return i;const n={};for(let e=0;e<s.length;e+=2){let t=s[e];t=t.replace(/^{([^}]+)?}$/,"$1"),n[t]=s[e+1];}try{return new hs(i,t).format(n);}catch(e){return"Translation "+e;}}var ms="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",gs="M7.5,5.6L5,7L6.4,4.5L5,2L7.5,3.4L10,2L8.6,4.5L10,7L7.5,5.6M19.5,15.4L22,14L20.6,16.5L22,19L19.5,17.6L17,19L18.4,16.5L17,14L19.5,15.4M22,2L20.6,4.5L22,7L19.5,5.6L17,7L18.4,4.5L17,2L19.5,3.4L22,2M13.34,12.78L15.78,10.34L13.66,8.22L11.22,10.66L13.34,12.78M14.37,7.29L16.71,9.63C17.1,10 17.1,10.65 16.71,11.04L5.04,22.71C4.65,23.1 4,23.1 3.63,22.71L1.29,20.37C0.9,20 0.9,19.35 1.29,18.96L12.96,7.29C13.35,6.9 14,6.9 14.37,7.29Z",vs="M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",ys="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z",bs="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",fs="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z",$s="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",_s="M17,19H7V5H17M17,3H7A2,2 0 0,0 5,5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V5C19,3.89 18.1,3 17,3Z",ws="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z",ks="M16,11H18V13H16V11M12,3H19C20.11,3 21,3.89 21,5V19H22V21H2V19H10V5C10,3.89 10.89,3 12,3M12,5V19H19V5H12Z",xs="M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z",As="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z",Os="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z",Ss="M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69M12 3L2 12H5V20H11V14H13V20H19V12H22",Cs="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",js="M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10A2,2 0 0,1 6,8H15V6A3,3 0 0,0 12,3A3,3 0 0,0 9,6H7A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,17A2,2 0 0,0 14,15A2,2 0 0,0 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17Z",Es="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z",Ms="M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M15.1,7.07C15.24,7.07 15.38,7.12 15.5,7.23L16.77,8.5C17,8.72 17,9.07 16.77,9.28L15.77,10.28L13.72,8.23L14.72,7.23C14.82,7.12 14.96,7.07 15.1,7.07M13.13,8.81L15.19,10.87L9.13,16.93H7.07V14.87L13.13,8.81Z",Hs="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",Ls="M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z",Ts="M20.84 22.73L15.31 17.2L14.5 18V21H9.5V18L6 14.5V9C6 8.7 6.1 8.41 6.25 8.14L1.11 3L2.39 1.73L22.11 21.46L20.84 22.73M18 14.5V9C18 8 17 7 16 7V3H14V7H10.2L17.85 14.65L18 14.5M10 3H8V4.8L10 6.8V3Z",zs="M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z",Ps="M16,19H8V5H16M16.5,3H7.5A1.5,1.5 0 0,0 6,4.5V19.5A1.5,1.5 0 0,0 7.5,21H16.5A1.5,1.5 0 0,0 18,19.5V4.5A1.5,1.5 0 0,0 16.5,3M19,17H21V7H19M22,9V15H24V9M3,17H5V7H3M0,15H2V9H0V15Z",Ns="M6,11H10V9H14V11H18V4H6V11M18,13H6V20H18V13M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2Z",Ds="M6,8H10V6H14V8H18V4H6V8M18,10H6V15H18V10M6,20H18V17H6V20M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2Z";const Rs={ArmedAway:Cs,ArmedHome:Os,ArmedNight:"M2 12A10 10 0 0 0 15 21.54A10 10 0 0 1 15 2.46A10 10 0 0 0 2 12Z",ArmedCustom:"M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z",ArmedVacation:"M20.56 3.91C21.15 4.5 21.15 5.45 20.56 6.03L16.67 9.92L18.79 19.11L17.38 20.53L13.5 13.1L9.6 17L9.96 19.47L8.89 20.53L7.13 17.35L3.94 15.58L5 14.5L7.5 14.87L11.37 11L3.94 7.09L5.36 5.68L14.55 7.8L18.44 3.91C19 3.33 20 3.33 20.56 3.91Z"};var Bs,Is,Vs;!function(e){e.STATE_ALARM_DISARMED="disarmed",e.STATE_ALARM_ARMED_HOME="armed_home",e.STATE_ALARM_ARMED_AWAY="armed_away",e.STATE_ALARM_ARMED_NIGHT="armed_night",e.STATE_ALARM_ARMED_CUSTOM_BYPASS="armed_custom_bypass",e.STATE_ALARM_ARMED_VACATION="armed_vacation",e.STATE_ALARM_PENDING="pending",e.STATE_ALARM_ARMING="arming",e.STATE_ALARM_TRIGGERED="triggered";}(Bs||(Bs={})),function(e){e.COMMAND_ALARM_DISARM="disarm",e.COMMAND_ALARM_ARM_HOME="arm_home",e.COMMAND_ALARM_ARM_AWAY="arm_away",e.COMMAND_ALARM_ARM_NIGHT="arm_night",e.COMMAND_ALARM_ARM_CUSTOM_BYPASS="arm_custom_bypass",e.COMMAND_ALARM_ARM_VACATION="arm_vacation";}(Is||(Is={})),function(e){e.Door="door",e.Window="window",e.Motion="motion",e.Tamper="tamper",e.Environmental="environmental",e.Other="other";}(Vs||(Vs={}));const Us={Door:ks,Window:Ns,Motion:"M11.4 8.2H15V10H13.2L11.4 8.2M19.67 1H18.33C18.33 3.58 20.42 5.67 23 5.67V4.33C21.16 4.33 19.67 2.84 19.67 1M21 1C21 2.11 21.9 3 23 3V1H21M17 1H15.67C15.67 5.05 18.95 8.33 23 8.33V7C19.69 7 17 4.31 17 1M10 3.8C11 3.8 11.8 3 11.8 2S11 .2 10 .2 8.2 1 8.2 2 9 3.8 10 3.8M2.39 1.73L1.11 3L3.46 5.35L2 5.8V11H3.8V7.33L5.05 6.94L5.68 7.57L2 22H3.8L6.67 13.89L9 17V22H10.8V15.59L8.31 11.05L8.5 10.37L20.84 22.73L22.11 21.46L2.39 1.73M9.38 4.87C9.08 4.37 8.54 4.03 7.92 4.03C7.75 4.03 7.58 4.06 7.42 4.11L7.34 4.14L11.35 8.15L9.38 4.87Z",Tamper:_s,Environmental:As,Other:ys},Fs={Door:xs,Window:Ds,Motion:"M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z",Tamper:Ps,Environmental:"M15.66 11.2C15.43 10.9 15.15 10.64 14.89 10.38C14.22 9.78 13.46 9.35 12.82 8.72C11.33 7.26 11 4.85 11.95 3C11 3.23 10.17 3.75 9.46 4.32C6.87 6.4 5.85 10.07 7.07 13.22C7.11 13.32 7.15 13.42 7.15 13.55C7.15 13.77 7 13.97 6.8 14.05C6.57 14.15 6.33 14.09 6.14 13.93C6.08 13.88 6.04 13.83 6 13.76C4.87 12.33 4.69 10.28 5.45 8.64C3.78 10 2.87 12.3 3 14.47C3.06 14.97 3.12 15.47 3.29 15.97C3.43 16.57 3.7 17.17 4 17.7C5.08 19.43 6.95 20.67 8.96 20.92C11.1 21.19 13.39 20.8 15.03 19.32C16.86 17.66 17.5 15 16.56 12.72L16.43 12.46C16.22 12 15.66 11.2 15.66 11.2M12.5 17.5C12.22 17.74 11.76 18 11.4 18.1C10.28 18.5 9.16 17.94 8.5 17.28C9.69 17 10.4 16.12 10.61 15.23C10.78 14.43 10.46 13.77 10.33 13C10.21 12.26 10.23 11.63 10.5 10.94C10.69 11.32 10.89 11.7 11.13 12C11.9 13 13.11 13.44 13.37 14.8C13.41 14.94 13.43 15.08 13.43 15.23C13.46 16.05 13.1 16.95 12.5 17.5H12.5M21 13H19V7H21V13M21 17H19V15H21V17Z",Other:ms};var Gs,Ws,qs;!function(e){e.Notification="notification",e.Action="action";}(Gs||(Gs={})),function(e){e.ArmedAway="armed_away",e.ArmedHome="armed_home",e.ArmedNight="armed_night",e.ArmedVacation="armed_vacation",e.ArmedCustom="armed_custom_bypass";}(Ws||(Ws={})),function(e){e.Armed="armed",e.Disarmed="disarmed",e.Triggered="triggered",e.Untriggered="untriggered",e.ArmFailure="arm_failure",e.Arming="arming",e.Pending="pending";}(qs||(qs={}));const Zs=(e,t,s,a)=>{a=a||{},s=null==s?{}:s;const i=new Event(t,{bubbles:void 0===a.bubbles||a.bubbles,cancelable:Boolean(a.cancelable),composed:void 0===a.composed||a.composed});return i.detail=s,e.dispatchEvent(i),i;};function Ys(e){return(e=e.replace("_"," ")).charAt(0).toUpperCase()+e.slice(1);}function Ks(e){return e?e.attributes&&e.attributes.friendly_name?e.attributes.friendly_name:String(e.entity_id.split(".").pop()):"(unrecognized entity)";}function Js(e){let t=[];return e.forEach(e=>{t.find(t=>"object"==typeof e?function(...e){return e.every(t=>JSON.stringify(t)===JSON.stringify(e[0]));}(t,e):t===e)||t.push(e);}),t;}function Xs(e,t){return e.filter(e=>e!==t);}function Qs(e,t){return e?Object.entries(e).filter(([e])=>t.includes(e)).reduce((e,[t,s])=>Object.assign(e,{[t]:s}),{}):{};}const ea=(e,...t)=>{const s={};let a;for(a in e)t.includes(a)||(s[a]=e[a]);return s;};function ta(e){return null!=e;}function sa(e,t){if(null===e||null===t)return e===t;const s=Object.keys(e),a=Object.keys(t);if(s.length!==a.length)return!1;for(const a of s)if("object"==typeof e[a]&&"object"==typeof t[a]){if(!sa(e[a],t[a]))return!1;}else if(e[a]!==t[a])return!1;return!0;}function aa(e,t){const s=e instanceof HTMLElement?e:e.target;Zs(s,"show-dialog",{dialogTag:"hm-error-dialog",dialogImport:()=>Promise.resolve().then(function(){return wi;}),dialogParams:{error:t}});}function ia(e,t){aa(t,Z`
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
  `);}const na=(e,t)=>{var s,a,i,n,o;if(!e)return!1;switch(e){case Bs.STATE_ALARM_ARMED_AWAY:return null===(s=t[Ws.ArmedAway])||void 0===s?void 0:s.enabled;case Bs.STATE_ALARM_ARMED_HOME:return null===(a=t[Ws.ArmedHome])||void 0===a?void 0:a.enabled;case Bs.STATE_ALARM_ARMED_NIGHT:return null===(i=t[Ws.ArmedNight])||void 0===i?void 0:i.enabled;case Bs.STATE_ALARM_ARMED_CUSTOM_BYPASS:return null===(n=t[Ws.ArmedCustom])||void 0===n?void 0:n.enabled;case Bs.STATE_ALARM_ARMED_VACATION:return null===(o=t[Ws.ArmedVacation])||void 0===o?void 0:o.enabled;default:return!0;}};function oa(e,t){return Object.entries(t).forEach(([t,s])=>{e=t in e&&"object"==typeof e[t]&&null!==e[t]?Object.assign(Object.assign({},e),{[t]:oa(e[t],s)}):Object.assign(Object.assign({},e),{[t]:s});}),e;}function ra(e,t){const s=e=>"object"==typeof e?s(e.name):e.trim().toLowerCase();return s(e)<s(t)?-1:1;}const la=(e,t,s=!1)=>{s?history.replaceState(null,"",t):history.pushState(null,"",t),Zs(window,"location-changed",{replace:s});};function ca(e){return e.substr(0,e.indexOf("."));}function da(e){return e.substr(e.indexOf(".")+1);}function ha(e,t){const s={alert:"mdi:alert",automation:"mdi:playlist-play",calendar:"mdi:calendar",camera:"mdi:video",climate:"mdi:thermostat",configurator:"mdi:settings",conversation:"mdi:text-to-speech",device_tracker:"mdi:account",fan:"mdi:fan",group:"mdi:google-circles-communities",history_graph:"mdi:chart-line",homeassistant:"mdi:home-assistant",homekit:"mdi:home-automation",image_processing:"mdi:image-filter-frames",input_boolean:"mdi:drawing",input_datetime:"mdi:calendar-clock",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:textbox",light:"mdi:lightbulb",mailbox:"mdi:mailbox",notify:"mdi:comment-alert",person:"mdi:account",plant:"mdi:flower",proximity:"mdi:apple-safari",remote:"mdi:remote",scene:"mdi:google-pages",script:"mdi:file-document",sensor:"mdi:eye",simple_alarm:"mdi:bell",sun:"mdi:white-balance-sunny",switch:"mdi:flash",timer:"mdi:timer",updater:"mdi:cloud-upload",vacuum:"mdi:robot-vacuum",water_heater:"mdi:thermometer",weblink:"mdi:open-in-new"};if(e in s)return s[e];switch(e){case"alarm_control_panel":switch(t){case"armed_home":return"mdi:bell-plus";case"armed_night":return"mdi:bell-sleep";case"disarmed":return"mdi:bell-outline";case"triggered":return"mdi:bell-ring";default:return"mdi:bell";}case"binary_sensor":return t&&"off"===t?"mdi:radiobox-blank":"mdi:checkbox-marked-circle";case"cover":return"closed"===t?"mdi:window-closed":"mdi:window-open";case"lock":return t&&"unlocked"===t?"mdi:lock-open":"mdi:lock";case"media_player":return t&&"off"!==t&&"idle"!==t?"mdi:cast-connected":"mdi:cast";case"zwave":switch(t){case"dead":return"mdi:emoticon-dead";case"sleeping":return"mdi:sleep";case"initializing":return"mdi:timer-sand";default:return"mdi:z-wave";}default:return"mdi:bookmark";}}const pa=h`
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
    display: var(--ext-sec-head, flex);
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
    display: var(--ext-card-name, inline-flex);
  }
  .card-header .name {
    display: var(--ext-card-name, block);
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

  input[type='checkbox'].cb {
    width: 18px;
    height: 18px;
    accent-color: var(--primary-color);
    cursor: pointer;
  }

  div.checkbox-row input.cb,
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

  ha-card hm-settings-row:first-child,
  ha-card hm-settings-row:first-of-type {
    border-top: 0px;
  }

  ha-card > ha-card {
    margin: 10px;
  }
`,ua=h`
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
`,ma=()=>{const e=e=>{let t={};for(var s=0;s<e.length;s+=2){const a=e[s],i=s<e.length?e[s+1]:void 0;t=Object.assign(Object.assign({},t),{[a]:i});}return t;},t=window.location.pathname.split("/");let s={page:t[2]||"general",params:{}};if(t.length>3){let a=t.slice(3);if(t.includes("filter")){const t=a.findIndex(e=>"filter"==e),i=a.slice(t+1);a=a.slice(0,t),s=Object.assign(Object.assign({},s),{filter:e(i)});}a.length&&(a.length%2&&(s=Object.assign(Object.assign({},s),{subpage:a.shift()})),a.length&&(s=Object.assign(Object.assign({},s),{params:e(a)})));}return s;},ga=(e,...t)=>{let s={page:e,params:{}};t.forEach(e=>{"string"==typeof e?s=Object.assign(Object.assign({},s),{subpage:e}):"params"in e?s=Object.assign(Object.assign({},s),{params:e.params}):"filter"in e&&(s=Object.assign(Object.assign({},s),{filter:e.filter}));});const a=e=>{let t=Object.keys(e);t=t.filter(t=>e[t]),t.sort();let s="";return t.forEach(t=>{let a=e[t];s=s.length?`${s}/${t}/${a}`:`${t}/${a}`;}),s;};let i=`/house_modes/${s.page}`;return s.subpage&&(i=`${i}/${s.subpage}`),a(s.params).length&&(i=`${i}/${a(s.params)}`),s.filter&&(i=`${i}/filter/${a(s.filter)}`),i;},va=e=>e.callWS({type:"house_modes/ext/info"}),ya=(e,t)=>e.callWS(Object.assign({type:"house_modes/ext/backup/create"},t?{label:t}:{})),ba=e=>e&&(e.message||e.body&&e.body.message||e.error||e.code)||String(e),fa=(e,t,s="text/yaml")=>{const a=new Blob([t],{type:`${s};charset=utf-8`}),i=URL.createObjectURL(a),n=document.createElement("a");n.href=i,n.download=e,document.body.appendChild(n),n.click(),setTimeout(()=>{URL.revokeObjectURL(i),n.remove();},0);},$a=(e,t)=>{if(!e)return"";try{return new Date(e).toLocaleString(t,{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"});}catch(t){return e;}},_a=(e,t)=>{e.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:t},bubbles:!0,composed:!0}));},wa=h`
  /* text fields and drop-downs like the dashboard card's editor (CARD_DESIGN_SYSTEM controls) */
  select,
  input[type='text'],
  input[type='number'],
  input[type='search'],
  input[type='time'] {
    font: inherit;
    font-size: 14px;
    color: var(--primary-text-color);
    background-color: var(--card-background-color, var(--primary-background-color));
    border: 1px solid var(--divider-color, #444);
    border-radius: 6px;
    padding: 6px 10px;
    min-height: 34px;
    box-sizing: border-box;
    max-width: 100%;
  }
  select {
    appearance: none;
    -webkit-appearance: none;
    padding-right: 32px;
    cursor: pointer;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23aaa'><path d='M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6z'/></svg>");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 18px;
  }
  select:hover,
  input[type='text']:hover,
  input[type='search']:hover {
    border-color: var(--secondary-text-color, #888);
  }
  select:focus,
  input:focus {
    outline: none;
    border-color: var(--primary-color);
  }
  select:disabled {
    opacity: 0.55;
    cursor: default;
  }
  select option {
    background: var(--card-background-color, #1c1c1c);
    color: var(--primary-text-color);
  }
`,ka=h`
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
  .list-filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 16px;
    padding: 0 16px 8px;
  }
  .list-filter {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }
  /* a tab as one card with collapsible sections (tabCard / tabSection, like Activity) */
  .tab-secs {
    padding: 4px 0 4px;
  }
  details.collapse.tab-sec {
    margin: 0 16px 12px;
  }
  details.collapse.tab-sec > .collapse-body {
    padding: 0 4px 8px;
  }
  details.collapse.tab-sec.flat > .collapse-body {
    padding: 0 0 4px;
    --ha-card-box-shadow: none;
    --ha-card-border-width: 0;
    --ha-card-background: transparent;
    --ext-sec-head: none;
    --ext-card-name: none;
  }
  button.link:disabled {
    color: var(--disabled-text-color, #9e9e9e);
    cursor: default;
  }
  .setting-lock {
    border: none;
    background: none;
    padding: 2px;
    cursor: pointer;
    color: var(--accent-color, var(--primary-color));
    --mdc-icon-size: 18px;
    vertical-align: middle;
  }
  .setting-lock.open {
    color: var(--accent-color, var(--primary-color));
    opacity: 0.7;
  }
  .run-chip {
    display: inline-flex;
    align-items: center;
    padding: 1px 10px;
    border-radius: 12px;
    border: 1px solid currentColor;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
  }
  .run-chip.run-off {
    color: var(--error-color, #f44336);
  }
  .run-chip.run-shadow {
    color: var(--warning-color, #ffc107);
  }
  .run-chip.run-live {
    color: var(--success-color, #4caf50);
  }
  .run-state {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 12px;
  }
  .run-state label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  /* checkboxes, never toggle switches (user rule 2026-11-06) */
  input[type='checkbox'] {
    accent-color: var(--primary-color);
    cursor: pointer;
  }
  input[type='checkbox'].cb {
    width: 18px;
    height: 18px;
  }
  ${wa}
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
    display: var(--ext-sec-head, flex);
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
  /* All Modes grids: the mode's own icon where it applies, a faint dot where not */
  .mode-ic {
    --mdc-icon-size: 20px;
  }
  .mode-ic.dim {
    opacity: 0.45;
  }
  .mode-off {
    color: var(--disabled-text-color, #9e9e9e);
    opacity: 0.6;
  }
  .list-filter-ic {
    --mdc-icon-size: 18px;
    margin-right: -2px;
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
  /* a whole card that collapses (collapsibleCard) */
  ha-card.fold-card {
    padding: 4px 0;
  }
  ha-card.fold-card details.collapse.top {
    margin: 8px 12px;
  }
  details.collapse.top > summary {
    padding: 12px;
  }
  .fold-icon {
    --mdc-icon-size: 22px;
    color: var(--primary-color);
  }
  .fold-title {
    font-size: 18px;
    font-weight: 500;
    color: var(--primary-text-color);
  }
  details.collapse.top > summary .grow {
    flex: 1;
  }
  .fold-body {
    padding: 0 0 8px;
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
  .related-list .field-row {
    min-height: 32px;
  }
`,xa={general:{role:"settings",text:'Options for the whole alarm: what happens after an alarm, MQTT, and the "All partitions" alarm entity.\n\nThe "All partitions" entity only exists when there are two or more partitions.'},partitions:{role:"settings",text:"Partitions are parts of the building that are armed separately. Each has its own alarm entity: alarm_control_panel.<partition name>.\n\nMost homes need one partition. The zone, notification and action counts link to those pages."},modes:{role:"settings",text:"The Arm Modes per partition: which ones the partition offers, and the alarm's exit delay, entry delay and trigger time for each.\n\nWith a physical panel, the physical panel's own delays still apply to its own zones."},zones_legacy:{role:"legacy",text:"The original zone page, kept for reference.\n\nZones does the same and more. Changes made here are not backed up first."},codes:{role:"settings",text:"Who may arm and disarm the alarm with a code, and when a code is needed."},notifications:{role:"settings",text:"Messages sent on alarm events — armed, disarmed, triggered, failed to arm … — per partition."},actions:{role:"settings",text:"Scripts that run on alarm events, per partition."}},Aa={settings:{icon:"mdi:cog",label:"Settings"},picker:{icon:"mdi:playlist-plus",label:"Picker"},readonly:{icon:"mdi:eye",label:"Read only"},legacy:{icon:"mdi:history",label:"Legacy"}},Oa=e=>Z`<span class="role"><ha-icon icon=${Aa[e].icon}></ha-icon>${Aa[e].label}</span>`,Sa=(e,t,s=K)=>Z`<div class="sec-head"><h2>${e}</h2><span class="sec-side">${s}${t?Oa(t):K}</span></div>`,Ca={},ja=(e,t)=>Z`<ha-button appearance=${e?"plain":"filled"} @click=${t}
    title=${e?"Unlock to change the settings in this table":"Lock the table again"}>
    <ha-icon slot="start" icon=${e?"mdi:lock":"mdi:lock-open-variant"}></ha-icon>${e?"Unlock to edit":"Editing — lock"}
  </ha-button>`,Ea=(e,t,s="unchanged")=>{const a=e.states[t],i="changed"===s?"var(--warning-color, #ffc107)":"new"===s?"var(--success-color, #4caf50)":"removed"===s?"var(--error-color, #f44336)":"";return Z`<button class="badge-btn" title=${("changed"===s?"Unsaved changes · ":"new"===s?"New, not saved · ":"removed"===s?"Will be removed · ":"")+"Show details"} aria-label=${`Show details of ${t}`}
    @click=${e=>e.target.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0}))}>
    ${a?Z`<state-badge .hass=${e} .stateObj=${a} .stateColor=${!i}
          style=${i?`--state-icon-color:${i};--state-icon-active-color:${i};color:${i}`:""}></state-badge>`:Z`<ha-icon icon="mdi:help-circle-outline" style=${i?`color:${i}`:""}></ha-icon>`}
  </button>`;};let Ma=class extends pe{constructor(){super(...arguments),this.page="",this.heading="";}render(){const e=xa[this.page];return e?Z`
      <div class="notice warn" style="margin:0 0 12px;display:flex;gap:8px;align-items:flex-start">
        ${Oa(e.role)}
        <div class="desc" style="padding:0">${e.text.split("\n\n").map(e=>Z`<p style="margin:0 0 4px">${e}</p>`)}</div>
      </div>
    `:Z``;}};Ma.styles=ka,i([ye()],Ma.prototype,"page",void 0),i([ye()],Ma.prototype,"heading",void 0),Ma=i([me("hm-page-intro")],Ma);const Ha=(e,t,s,a="Show")=>Z`<div class="list-filters">
  <span class="secondary" style="display:inline">${a}</span>
  ${e.filter(e=>e.count).map(e=>Z`<label class="list-filter" title=${e.hint||""}><input type="checkbox" .checked=${t.has(e.key)}
      @change=${a=>{const i=new Set(t);a.target.checked?i.add(e.key):i.delete(e.key),s(i);}} />${e.icon?Z`<ha-icon class="list-filter-ic" icon=${e.icon} style=${e.color?`color:${e.color}`:""}></ha-icon>`:""}${e.label} <span class="secondary" style="display:inline">(${e.count})</span></label>`)}
</div>`,La={},Ta=(e,t,s,a,i={})=>Z`<details class="collapse tab-sec ${i.flat?"flat":""}" ?open=${e in La?La[e]:!!i.open}
      @toggle=${t=>La[e]=t.target.open}>
    <summary>
      <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
      <span class="collapse-title">${t}</span>
      ${s?Z`<span class="secondary" style="display:inline">${s}</span>`:K}
    </summary>
    <div class="collapse-body">${a}</div>
  </details>`,za=(e,t,s,a)=>Z`<ha-card class="tab-card">${Sa(e,t)}
    ${s?Z`<div class="card-content desc">${s}</div>`:K}
    <div class="tab-secs">${a}</div>
  </ha-card>`,Pa=(e,t,s="this setting")=>Z`<button class="setting-lock ${e?"":"open"}" title=${e?`Unlock to change ${s}`:"Lock again"}
    aria-pressed=${!e} @click=${t}><ha-icon icon=${e?"mdi:lock":"mdi:lock-open-variant"}></ha-icon></button>`,Na={},Da=e=>!1!==Na[e],Ra={off:"Off",shadow:"Shadow",live:"Live"},Ba=e=>Z`<span class="run-chip run-${e}">${Ra[e]||e}</span>`,Ia=(e,t,s,a,i)=>{const n=Da(e);return Z`<span class="run-state">
    <span>Current Run State:</span>
    ${Ba(s)}
    ${Pa(n,()=>{Na[e]=!n,i();},"the run state")}
    ${n?K:["off","shadow","live"].map(e=>Z`<label><input type="radio" name=${t} .checked=${s===e}
          @change=${()=>a(e)} />${Ra[e]}</label>`)}
  </span>`;},Va=60;let Ua=class extends pe{constructor(){super(...arguments),this.min=0,this.max=300,this.value=0,this.step=15,this.disabled=!1,this.showArrows=!0,this.required=!1;}render(){return Z`
      <div class="wrapper">
        ${this.required?K:Z`
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
            .max=${Math.floor(this.max/Va)}
            .disabled=${this.disabled}
            .validityTransform=${this._validateMinutesInput}
          >
          </ha-input>
          <div class="time-separator">:</div>
          </div>
          <span class="label">${us("components.time_picker.minutes",this.hass.language)}</span>
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
          <span class="label">${us("components.time_picker.seconds",this.hass.language)}</span>
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
          </wa-button>`:K}
        </div>
      </div>
    `;}_getMinutes(){return Math.floor(this.value/Va);}_getSeconds(){return this.value%Va;}_minutesChanged(e){let t=Number(e.target.value),s=t*Va+this._getSeconds();s<this.min&&(s=this.min,t=Math.floor(s/Va),e.target.value=String(t)),s>this.max&&(s=this.max,t=Math.floor(s/Va),e.target.value=String(t)),this.value=s,this._valueChanged();}_secondsChanged(e){let t=Number(e.target.value);t>=Va&&(t=59,e.target.value=String(t));let s=this._getMinutes()*Va+t;s<this.min&&(s=this.min,t=this.value%Va,e.target.value=String(t)),s>this.max&&(s=this.max,t=this.value%Va,e.target.value=String(t)),this.value=s,this._valueChanged();}_validateMinutesInput(e,t){let s=null!==e.match(/^[0-9]+$/);return{valid:s,customError:!s};}_validateSecondsInput(e,t){let s=null!==e.match(/^[0-9]+$/);return{valid:s,customError:!s};}_secondsUpClick(){let e=Math.round(this.value/this.step)*this.step;e+=this.step,e>this.max&&(e=this.max),this.value=e,this._valueChanged();}_secondsDownClick(){let e=Math.round(this.value/this.step)*this.step;e-=this.step,e<this.min&&(e=this.min),this.value=e,this._valueChanged();}_toggleEnableClick(e){const t=e.target.checked;this.disabled=!t,e.target.blur(),this._valueChanged();}_onFocus(e){e.currentTarget.select();}_valueChanged(){let e=this.disabled?null:this.value;Zs(this,"value-changed",{value:e});}};Ua.styles=h`
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
  `,i([ye({attribute:!1})],Ua.prototype,"hass",void 0),i([ye({type:Number})],Ua.prototype,"min",void 0),i([ye({type:Number})],Ua.prototype,"max",void 0),i([ye({type:Number})],Ua.prototype,"value",void 0),i([ye({type:Number})],Ua.prototype,"step",void 0),i([ye({type:Boolean})],Ua.prototype,"disabled",void 0),i([ye({type:Boolean})],Ua.prototype,"showArrows",void 0),i([ye({type:String})],Ua.prototype,"placeholder",void 0),i([ye({type:Boolean})],Ua.prototype,"required",void 0),Ua=i([me("hm-duration-picker")],Ua);const Fa=[{name:"primary",weight:10},{name:"secondary",weight:8}];let Ga=class extends pe{constructor(){super(...arguments),this.label="",this.items=[],this.disabled=!1,this.showSearch=!1,this.clearable=!1,this.invalid=!1,this._valueRenderer=e=>{const t=this.items.find(t=>t.value===e);return Z`
      ${(null==t?void 0:t.icon)?Z`<ha-icon slot="start" .icon=${t.icon}></ha-icon>`:K}
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
        .searchKeys=${Fa}
        @value-changed=${this._pickerChanged}
        hide-clear-icon
      >
      </ha-generic-picker>
      ${this.invalid?Z`<span class="invalid">Invalid</span>`:K}
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
        ${this.invalid?Z`<span class="invalid">Invalid</span>`:K}
      `;}}_renderOptions(){const e=this.items.some(e=>e.icon);return this.items.map(t=>Z`
      <ha-dropdown-item
        .graphic=${e?"icon":""}
        .value=${t.value}
        ?selected=${this.value===t.value}
      >
        ${t.icon?Z`<ha-icon slot="graphic" .icon=${t.icon}></ha-icon>`:K}
        <span>${t.name}</span>
      </ha-dropdown-item>
    `);}_selectChanged(e){e.stopPropagation(),this.value=e.detail.value,Zs(this,"value-changed",{value:this.value});}_pickerChanged(e){e.stopPropagation(),this.value=e.detail.value,Zs(this,"value-changed",{value:this.value});}clearValue(){if(this.showSearch){const e=this.shadowRoot.querySelector("ha-generic-picker");this.value="",e.blur();}else{const e=this.shadowRoot.querySelector("ha-select");this.value=void 0,setTimeout(()=>{e.blur();},50);}}};Ga.styles=h`
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
  `,i([ye()],Ga.prototype,"hass",void 0),i([ye()],Ga.prototype,"label",void 0),i([ye()],Ga.prototype,"items",void 0),i([ye({type:String,reflect:!0})],Ga.prototype,"value",void 0),i([ye({type:Boolean,reflect:!0})],Ga.prototype,"disabled",void 0),i([ye()],Ga.prototype,"helper",void 0),i([ye({type:Boolean})],Ga.prototype,"showSearch",void 0),i([ye({type:Boolean})],Ga.prototype,"clearable",void 0),i([ye({type:Boolean})],Ga.prototype,"invalid",void 0),i([fe("ha-input")],Ga.prototype,"_menu",void 0),Ga=i([me("hm-select")],Ga);let Wa=class extends pe{static get styles(){return h`
      :host {
        display: block;
      }
    `;}render(){return Z`
      <slot></slot>
    `;}constructor(){super(),this.addEventListener("clickHeader",this.manageSpoilers);}manageSpoilers(e){const t=e.target;t.getAttribute("active")?t.removeAttribute("active"):t.setAttribute("active","true"),this.querySelectorAll("hm-collapsible-header[active]").forEach(function(e){e!==t&&e.removeAttribute("active");});}};Wa=i([me("hm-collapsible-group")],Wa);let qa=class extends pe{static get styles(){return h`
      :host {
        display: block;
      }
    `;}render(){return Z`
      <slot></slot>
    `;}};qa=i([me("hm-collapsible-item")],qa);let Za=class extends pe{constructor(){super(),this.clickHeader=new CustomEvent("clickHeader",{detail:{message:"clickHeader happened."},bubbles:!0,composed:!0}),this.active=!1,this.addEventListener("click",this.handleClick);}handleClick(){this.dispatchEvent(this.clickHeader);}render(){return Z`
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
    `;}attributeChangedCallback(e,t,s){this.hasAttribute("active")&&this.nextElementSibling?this.nextElementSibling.style.maxHeight=this.nextElementSibling.scrollHeight+"px":this.nextElementSibling&&(this.nextElementSibling.style.maxHeight="0px"),super.attributeChangedCallback(e,t,s);}};i([ye({type:CustomEvent})],Za.prototype,"clickHeader",void 0),i([ye({type:Boolean,attribute:!0,reflect:!0})],Za.prototype,"active",void 0),Za=i([me("hm-collapsible-header")],Za);let Ya=class extends pe{static get styles(){return h`
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
    `;}};Ya=i([me("hm-collapsible-body")],Ya);let Ka=class extends ze(pe){hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"house_modes_config_updated"})];}async _fetchData(){this.hass&&(this.areas=await Le(this.hass),this.sensors=await ke(this.hass));}async firstUpdated(){await this._fetchData(),this.selectedArea=Object.keys(this.areas)[0],this.data=Object.assign({},this.areas[this.selectedArea].modes);}render(){return this.data?Z`
      <ha-card>
        <div class="card-header">
          <div class="name">
            ${us("panels.general.cards.modes.title",this.hass.language)}
          </div>
          ${Oa("settings")}

          ${Object.keys(this.areas).length>1?Z`
          <hm-select
            .hass=${this.hass}
            .items=${Object.values(this.areas).map(e=>Object({value:e.area_id,name:e.name}))}
            value=${this.selectedArea}
            label=${this.hass.localize("ui.components.area-picker.area")}
            @value-changed=${e=>this.selectArea(e.target.value)}
          ></hm-select>
        `:""}
        </div>
        <div class="card-content mode-intro">
          <span>${us("panels.general.cards.modes.description",this.hass.language)}</span>
          ${Pa(Da("arm-modes"),()=>{Na["arm-modes"]=!Da("arm-modes"),this.requestUpdate();},"the Arm Modes and their delays")}
        </div>

        <hm-collapsible-group>
          ${Object.entries(Ws).map(([e,t])=>{var s;return Z`
                <hm-collapsible-item>
                  <hm-collapsible-header>
                    <ha-svg-icon slot="icon" .path=${Rs[e]}></ha-svg-icon>
                    <span slot="title">
                      ${this.hass.localize(`component.alarm_control_panel.entity_component._.state.${t}`)}
                    </span>
                    <span slot="description">
                      ${(null===(s=this.data[t])||void 0===s?void 0:s.enabled)?Z`
                            ${us("common.enabled",this.hass.language)},
                            <a href="${ga("zones",{filter:{area:this.selectedArea,mode:t}})}">
                              ${us("panels.general.cards.modes.number_sensors_active",this.hass.language,"number",this.getSensorsByMode(t))}
                            </a>
                          `:us("common.disabled",this.hass.language)}
                    </span>
                  </hm-collapsible-header>
                  <hm-collapsible-body>
                    ${this.renderModeConfig(t)}
                  </hm-collapsible-body>
                </hm-collapsible-item>
              `;})}
        </hm-collapsible-group>
      </ha-card>
    `:Z``;}getSensorsByMode(e){return Object.values(this.sensors).filter(t=>t.area==this.selectedArea&&(t.modes.includes(e)||t.always_on)).length;}renderModeConfig(e){const t=e in this.data?this.data[e]:void 0;return Z`<div class="mode-cfg ${Da("arm-modes")?"locked":""}" title=${Da("arm-modes")?"Locked: click the lock above to change":""}>
      <div class="description">
        <ha-icon icon="mdi:information-outline"></ha-icon>
        ${us(`panels.general.cards.modes.modes.${e}`,this.hass.language)}
      </div>
      <hm-settings-row .narrow=${this.narrow}>
        <span slot="heading">
          ${us("panels.general.cards.modes.fields.status.heading",this.hass.language)}
        </span>
        <span slot="description">
          ${us("panels.general.cards.modes.fields.status.description",this.hass.language)}
        </span>
        <div>
          <ha-button
            appearance="${(null==t?void 0:t.enabled)?"filled":"plain"}"
            variant="${(null==t?void 0:t.enabled)?"brand":"neutral"}"
            @click=${t=>this.saveData(t,e,{enabled:!0})}
          >
            <ha-icon slot="start" icon="mdi:check"></ha-icon>
            ${us("common.enabled",this.hass.language)}
          </ha-button>
          <ha-button
            appearance="${(null==t?void 0:t.enabled)?"plain":"filled"}"
            variant="${(null==t?void 0:t.enabled)?"neutral":"brand"}"
            @click=${t=>this.saveData(t,e,{enabled:!1})}
          >
            <ha-icon slot="start" icon="mdi:close"></ha-icon>
            ${us("common.disabled",this.hass.language)}
          </ha-button>
        </div>
      </hm-settings-row>
      <hm-settings-row .narrow=${this.narrow}>
        <span slot="heading">
          ${us("panels.general.cards.modes.fields.exit_delay.heading",this.hass.language)}
        </span>
        <span slot="description">
          ${us("panels.general.cards.modes.fields.exit_delay.description",this.hass.language)}
        </span>
        <hm-duration-picker
          .hass=${this.hass}
          max="300"
          placeholder="-"
          value=${(null==t?void 0:t.exit_time)||0}
          @value-changed=${t=>{this.saveData(t,e,{exit_time:t.detail.value});}}
          ?disabled=${!(null==t?void 0:t.enabled)||!ta(null==t?void 0:t.exit_time)}
        ></hm-duration-picker>
      </hm-settings-row>
      <hm-settings-row .narrow=${this.narrow}>
        <span slot="heading">
          ${us("panels.general.cards.modes.fields.entry_delay.heading",this.hass.language)}
        </span>
        <span slot="description">
          ${us("panels.general.cards.modes.fields.entry_delay.description",this.hass.language)}
        </span>
        <hm-duration-picker
          .hass=${this.hass}
          max="300"
          placeholder="-"
          value=${(null==t?void 0:t.entry_time)||0}
          @value-changed=${t=>this.saveData(t,e,{entry_time:t.detail.value})}
          ?disabled=${!(null==t?void 0:t.enabled)||!ta(null==t?void 0:t.entry_time)}
        ></hm-duration-picker>
      </hm-settings-row>
      <hm-settings-row .narrow=${this.narrow}>
        <span slot="heading">
          ${us("panels.general.cards.modes.fields.trigger_time.heading",this.hass.language)}
        </span>
        <span slot="description">
          ${us("panels.general.cards.modes.fields.trigger_time.description",this.hass.language)}
        </span>
        <hm-duration-picker
          .hass=${this.hass}
          max="3600"
          step="60"
          placeholder="&#8734;"
          value=${(null==t?void 0:t.trigger_time)||0}
          @value-changed=${t=>this.saveData(t,e,{trigger_time:t.detail.value})}
          ?disabled=${!(null==t?void 0:t.enabled)||!ta(null==t?void 0:t.trigger_time)}
        ></hm-duration-picker>
      </hm-settings-row>
      </div>
    `;}selectArea(e){e!=this.selectedArea&&(this.selectedArea=e,this.data=Object.assign({},this.areas[e].modes));}saveClick(e){Te(this.hass,{area_id:this.selectedArea,modes:this.data}).catch(t=>ia(t,e)).then();}saveData(e,t,s){if(Da("arm-modes"))return;this.data=Object.assign(Object.assign({},this.data),{[t]:Object.assign(Object.assign({},this.data[t]||{enabled:!1,exit_time:0,entry_time:0,trigger_time:0}),s)}),Te(this.hass,{area_id:this.selectedArea,modes:this.data}).catch(t=>ia(t,e.target)).then();}static get styles(){return h`
      ${pa}
      ${ka}
      .mode-intro {
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }
      .mode-intro > span {
        flex: 1;
      }
      .mode-cfg.locked {
        opacity: 0.6;
      }
      .mode-cfg.locked > *:not(.description) {
        pointer-events: none;
      }
      hm-collapsible-header:first-of-type {
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
      hm-select {
        display: flex;
        min-width: 180px;
      }
    `;}};i([ye()],Ka.prototype,"hass",void 0),i([ye({type:Boolean})],Ka.prototype,"narrow",void 0),i([ye()],Ka.prototype,"config",void 0),i([ye()],Ka.prototype,"areas",void 0),i([ye()],Ka.prototype,"sensors",void 0),i([ye()],Ka.prototype,"data",void 0),i([ye()],Ka.prototype,"selectedArea",void 0),Ka=i([me("hm-alarm-mode-card")],Ka);let Ja=class extends pe{constructor(){super(...arguments),this.threeLine=!1;}render(){return Z`
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
      /* ext: compact row (Notifications editor): label and control side by side, one line per field */
      :host([compact]) {
        display: grid;
        grid-template-columns: minmax(180px, 260px) minmax(0, 640px);
        gap: 4px 16px;
        align-items: center;
        min-height: 0;
        padding: 8px 0;
        border: none;
        border-top: 1px solid var(--divider-color);
      }
      :host([compact][narrow]) {
        grid-template-columns: minmax(0, 1fr);
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
      ::slotted(input[type='checkbox']) {
        margin: 14px 4px;
        width: 18px;
        height: 18px;
        accent-color: var(--primary-color);
        cursor: pointer;
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
    `;}};i([ye({type:Boolean,reflect:!0})],Ja.prototype,"narrow",void 0),i([ye({type:Boolean,reflect:!0})],Ja.prototype,"large",void 0),i([ye({type:Boolean,attribute:"three-line"})],Ja.prototype,"threeLine",void 0),i([ye({type:Boolean})],Ja.prototype,"nested",void 0),i([ye({type:Boolean})],Ja.prototype,"dialog",void 0),Ja=i([me("hm-settings-row")],Ja);let Xa=class extends pe{constructor(){super(...arguments),this.header="",this.open=!1;}render(){return Z`
      ${this.open?Z`
            <div class="header open">
              <span @click=${()=>{this.open=!1;}}>${this.header}</span>
              <ha-icon-button .path=${bs} @click=${()=>{this.open=!1;}}>
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
              <ha-icon-button .path=${fs} @click=${()=>{this.open=!0;}}>
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
    `;}};i([ye({type:Boolean,reflect:!0})],Xa.prototype,"narrow",void 0),i([ye()],Xa.prototype,"header",void 0),i([ye()],Xa.prototype,"open",void 0),Xa=i([me("hm-collapsible-section")],Xa);let Qa=class extends ze(pe){constructor(){super(...arguments),this.areas={};}hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"house_modes_config_updated"})];}async _fetchData(){if(!this.hass)return;const e=await we(this.hass);this.config=e,this.areas=await Le(this.hass),this.selection=e.mqtt;}firstUpdated(){(async()=>{await $e();})();}render(){return this.hass&&this.selection?Z`
      <ha-card>
        <div class="card-header">
          <div class="name">${us("panels.general.cards.mqtt.title",this.hass.language)}</div>
          ${Oa("settings")}
          <ha-icon-button .path=${$s} @click=${this.cancelClick}></ha-icon-button>
        </div>
        <div class="card-content">${us("panels.general.cards.mqtt.description",this.hass.language)}</div>

        <hm-settings-row .narrow=${this.narrow}>
          <span slot="heading">
            ${us("panels.general.cards.mqtt.fields.state_topic.heading",this.hass.language)}
          </span>
          <span slot="description">
            ${us("panels.general.cards.mqtt.fields.state_topic.description",this.hass.language)}
          </span>
          <ha-input
            label="${us("panels.general.cards.mqtt.fields.state_topic.heading",this.hass.language)}"
            value=${this.selection.state_topic}
            @change=${e=>{this.selection=Object.assign(Object.assign({},this.selection),{state_topic:e.target.value});}}
          ></ha-input>
        </hm-settings-row>

        <hm-collapsible-section
          .narrow=${this.narrow}
          header=${us("panels.general.cards.mqtt.fields.state_payload.heading",this.hass.language)}
        >
          ${Object.values(Bs).filter(e=>Object.values(this.areas).some(t=>na(e,t.modes))).map(e=>Z`
                <hm-settings-row .narrow=${this.narrow}>
                  <span slot="heading">${Ys(e)}</span>
                  <span slot="description">
                    ${us("panels.general.cards.mqtt.fields.state_payload.item",this.hass.language,"{state}",Ys(e))}
                  </span>
                  <ha-input
                    label=${Ys(e)}
                    placeholder=${e}
                    value=${this.selection.state_payload[e]||""}
                    @change=${t=>{this.selection=oa(this.selection,{state_payload:{[e]:t.target.value}});}}
                  ></ha-input>
                </hm-settings-row>
              `)}
        </hm-collapsible-section>

        <hm-settings-row .narrow=${this.narrow}>
          <span slot="heading">
            ${us("panels.general.cards.mqtt.fields.event_topic.heading",this.hass.language)}
          </span>
          <span slot="description">
            ${us("panels.general.cards.mqtt.fields.event_topic.description",this.hass.language)}
          </span>
          <ha-input
            label="${us("panels.general.cards.mqtt.fields.event_topic.heading",this.hass.language)}"
            value=${this.selection.event_topic}
            @change=${e=>{this.selection=Object.assign(Object.assign({},this.selection),{event_topic:e.target.value});}}
          ></ha-input>
        </hm-settings-row>

        <hm-settings-row .narrow=${this.narrow}>
          <span slot="heading">
            ${us("panels.general.cards.mqtt.fields.command_topic.heading",this.hass.language)}
          </span>
          <span slot="description">
            ${us("panels.general.cards.mqtt.fields.command_topic.description",this.hass.language)}
          </span>
          <ha-input
            label="${us("panels.general.cards.mqtt.fields.command_topic.heading",this.hass.language)}"
            value=${this.selection.command_topic}
            @change=${e=>{this.selection=Object.assign(Object.assign({},this.selection),{command_topic:e.target.value});}}
          ></ha-input>
        </hm-settings-row>

        <hm-collapsible-section
          .narrow=${this.narrow}
          header=${us("panels.general.cards.mqtt.fields.command_payload.heading",this.hass.language)}
        >
          ${Object.values(Is).filter(e=>Object.values(this.areas).some(t=>na((e=>{switch(e){case Is.COMMAND_ALARM_DISARM:return Bs.STATE_ALARM_DISARMED;case Is.COMMAND_ALARM_ARM_HOME:return Bs.STATE_ALARM_ARMED_HOME;case Is.COMMAND_ALARM_ARM_AWAY:return Bs.STATE_ALARM_ARMED_AWAY;case Is.COMMAND_ALARM_ARM_NIGHT:return Bs.STATE_ALARM_ARMED_NIGHT;case Is.COMMAND_ALARM_ARM_CUSTOM_BYPASS:return Bs.STATE_ALARM_ARMED_CUSTOM_BYPASS;case Is.COMMAND_ALARM_ARM_VACATION:return Bs.STATE_ALARM_ARMED_VACATION;default:return;}})(e),t.modes))).map(e=>Z`
                <hm-settings-row .narrow=${this.narrow}>
                  <span slot="heading">${Ys(e)}</span>
                  <span slot="description">
                    ${us("panels.general.cards.mqtt.fields.command_payload.item",this.hass.language,"{command}",Ys(e))}
                  </span>
                  <ha-input
                    label=${Ys(e)}
                    placeholder=${e}
                    value=${this.selection.command_payload[e]||""}
                    @change=${t=>{this.selection=oa(this.selection,{command_payload:{[e]:t.target.value}});}}
                  ></ha-input>
                </hm-settings-row>
              `)}
        </hm-collapsible-section>

        <hm-settings-row .narrow=${this.narrow}>
          <span slot="heading">
            ${us("panels.general.cards.mqtt.fields.require_code.heading",this.hass.language)}
          </span>
          <span slot="description">
            ${us("panels.general.cards.mqtt.fields.require_code.description",this.hass.language)}
          </span>
          <input type="checkbox" class="cb"
            .checked=${this.selection.require_code}
            ?disabled=${!this.config.code_arm_required&&!this.config.code_disarm_required}
            @change=${e=>{this.selection=Object.assign(Object.assign({},this.selection),{require_code:e.target.checked});}} />
        </hm-settings-row>

        <div class="card-actions">
          <ha-button appearance="plain" @click=${this.saveClick}>
            ${this.hass.localize("ui.common.save")}
          </ha-button>
        </div>
      </ha-card>
    `:Z``;}saveClick(e){this.hass&&Se(this.hass,{mqtt:Object.assign(Object.assign({},this.selection),{enabled:!0})}).catch(t=>ia(t,e)).then(()=>{this.cancelClick();});}cancelClick(){la(0,ga("backup"),!0);}};Qa.styles=pa,i([ye()],Qa.prototype,"narrow",void 0),i([ye()],Qa.prototype,"config",void 0),i([ye()],Qa.prototype,"areas",void 0),i([ye()],Qa.prototype,"selection",void 0),Qa=i([me("hm-mqtt-config-card")],Qa);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ei=2;class ti{constructor(e){}get _$AU(){return this._$AM._$AU;}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s;}_$AS(e,t){return this.update(e,t);}update(e,t){return this.render(...t);}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class si extends ti{constructor(e){if(super(e),this.it=K,e.type!==ei)throw Error(this.constructor.directiveName+"() can only be used in child bindings");}render(e){if(e===K||null==e)return this._t=void 0,this.it=e;if(e===Y)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]};}}si.directiveName="unsafeHTML",si.resultType=1;const ai=(e=>(...t)=>({_$litDirective$:e,values:t}))(si);let ii=class extends pe{constructor(){super(...arguments),this.active=!1;}render(){return Z`
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
      `:K;}renderTrailingIcon(){if(!this.removable&&!this.badge)return K;if(this.badge)return Z`
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
    `;}};i([ye({attribute:!1})],ii.prototype,"hass",void 0),i([ye({type:String})],ii.prototype,"icon",void 0),i([ye({type:Boolean})],ii.prototype,"selectable",void 0),i([ye({type:Boolean})],ii.prototype,"removable",void 0),i([ye({type:Boolean})],ii.prototype,"toggleable",void 0),i([ye({type:Boolean})],ii.prototype,"active",void 0),i([ye({type:String})],ii.prototype,"badge",void 0),i([ye({type:String})],ii.prototype,"value",void 0),ii=i([me("hm-chip")],ii);let ni=class extends pe{constructor(){super(...arguments),this.value=[];}render(){return this.items?Z`
      ${Object.values(this.items).map(e=>Z`
          <hm-chip
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
          </hm-chip>
        `)}
    `:Z``;}_handleClick(e){if(this.toggleable){const t=e.detail.value,s=e.detail.active;this.value.includes(t)&&!s?this.value=this.value.filter(e=>e!=t):!this.value.includes(t)&&t&&(this.value=[...this.value,t]);const a=new CustomEvent("value-changed",{detail:this.value});this.dispatchEvent(a);}else{const t=new CustomEvent("value-changed",{detail:e.detail.value});this.dispatchEvent(t);}}static get styles(){return h`
      :host {
        display: flex;
        flex-direction: row;
        flex: 1;
        margin: 0px -4px;
        flex-wrap: wrap;
      }
    `;}};i([ye({attribute:!1})],ni.prototype,"hass",void 0),i([ye({attribute:!1})],ni.prototype,"items",void 0),i([ye({attribute:!1})],ni.prototype,"value",void 0),i([ye({type:Boolean})],ni.prototype,"selectable",void 0),i([ye({type:Boolean})],ni.prototype,"toggleable",void 0),i([ye({type:Boolean})],ni.prototype,"removable",void 0),ni=i([me("hm-chip-set")],ni);let oi=class extends pe{set filters(e){this.filterConfig||(this.filterConfig=e);}shouldUpdate(e){return e.get("filters")&&!this.filterConfig&&(this.filterConfig=e.get("filters")),!0;}render(){if(!this.columns||!this.data)return Z``;const e=this.data.filter(e=>this.filterTableData(e,this.filterConfig));return Z`
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
        ${Object.entries(this.columns).map(([t,s])=>s.hide?"":Z`
                <div
                  class="table-cell ${s.text?"text":""} ${s.grow?"grow":""} ${s.align?s.align:""}"
                  style="${s.grow?"":`width: ${s.width}`}"
                >
                  ${s.renderer?s.renderer(e):e[t]}
                </div>
              `)}
      </div>
    `:Z``;}filterTableData(e,t){return!t||Object.keys(t).every(s=>{if(!Object.keys(e).includes(s))return!0;const a=t[s].value;return!a||!a.length||(Array.isArray(e[s])?e[s].some(e=>a.includes(e)):a.includes(e[s]));});}_getFilteredItems(){return this.data.filter(e=>!this.filterTableData(e,this.filterConfig)).length;}handleClick(e){if(!this.selectable)return;const t=new CustomEvent("row-click",{detail:{id:e}});this.dispatchEvent(t);}renderFilterRow(){var e;return this.filterConfig?Z`
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
            label=${us("components.table.filter.label",this.hass.language)}
          ></ha-icon-button>
          ${this.renderFilterMenu()}
        </ha-dropdown>

        ${this._getFilteredItems()?Z`
              <hm-chip
                .hass=${this.hass}
                removable
                active
                @icon-clicked=${this._clearFilters}
                style="--chip-color: var(--primary-color); --background-opacity: 0.12; --chip-border-radius: 8px; --chip-height: 40px; --chip-font-size: 1em; --icon-color: var(--dark-primary-color)"
              >
                ${us("components.table.filter.hidden_items",this.hass.language,"number",this._getFilteredItems())}
              </hm-chip>
            `:""}
      </div>
    `:Z``;}_showFilterMenu(){this.filterSelection=Object.entries(this.filterConfig).reduce((e,[t,s])=>Object.assign(Object.assign({},e),{[t]:Qs(s,["value"])}),{});}renderFilterMenu(){return this.filterConfig&&this.filterSelection?Z`
      <span class="header">
        ${us("components.table.filter.label",this.hass.language)}
      </span>
      <ha-icon-button
        class="close"
        .path=${$s}
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
          `;let t=this.filterConfig[e].items;t=t.map(t=>{var s;return t.badge&&"function"==typeof t.badge?Object.assign(Object.assign({},t),{badge:t.badge(null===(s=this.data)||void 0===s?void 0:s.filter(t=>this.filterTableData(t,ea(this.filterSelection,e))))}):t;});const s=this.filterSelection[e].value;return Z`
          <div class="dropdown-item">
            <span class="name">
              ${this.filterConfig[e].name}
            </span>
            <hm-chip-set
              toggleable
              .items=${t}
              @value-changed=${t=>this._updateFilterSelection(e,t.detail)}
              .value=${s}
            ></hm-chip-set>
          </div>
        `;})}
    `:Z``;}_updateFilterSelection(e,t){"boolean"==typeof t&&(t=t?this.filterConfig[e].items[0].value:[],1==Object.keys(this.filterConfig).length&&(this._menu.open=!1)),this.filterSelection=Object.assign(Object.assign({},this.filterSelection),{[e]:{value:t}});}_clearFilters(){Object.keys(this.filterConfig).forEach(e=>{this.filterConfig=Object.assign(Object.assign({},this.filterConfig),{[e]:Object.assign(Object.assign({},this.filterConfig[e]),{value:[]})});});}_applyFilterSelection(){Object.keys(this.filterConfig).forEach(e=>{this.filterConfig=Object.assign(Object.assign({},this.filterConfig),{[e]:Object.assign(Object.assign({},this.filterConfig[e]),this.filterSelection[e])});});}};oi.styles=h`
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

    div.table-cell > input[type='checkbox'] {
      width: 18px;
      accent-color: var(--primary-color);
      cursor: pointer;
      margin: 0 auto;
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
    div.dropdown-item hm-chips {
      display: flex;
      flex-direction: row;
    }
    div.dropdown-item.checkbox {
      flex-direction: row;
      align-items: center;
    }
  `,i([ye()],oi.prototype,"hass",void 0),i([ye()],oi.prototype,"columns",void 0),i([ye()],oi.prototype,"data",void 0),i([be()],oi.prototype,"filterConfig",void 0),i([be()],oi.prototype,"filterSelection",void 0),i([ye({type:Boolean})],oi.prototype,"selectable",void 0),i([fe("ha-dropdown")],oi.prototype,"_menu",void 0),oi=i([me("hm-table")],oi);let ri=class extends pe{async showDialog(e){this._params=e,await this.updateComplete;}async closeDialog(){this._params&&this._params.cancel(),this._params=void 0;}render(){return this._params?Z`
      <ha-dialog
        open
        @closed=${this.closeDialog}
      >
        <ha-dialog-header slot="header">
          <ha-icon-button
            slot="navigationIcon"
            data-dialog="close"
            .label=${this.hass.localize("ui.common.close")}
            .path=${$s}
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
      ${pa}
      div.wrapper {
        color: var(--primary-text-color);
      }
    `;}};i([ye({attribute:!1})],ri.prototype,"hass",void 0),i([be()],ri.prototype,"_params",void 0),ri=i([me("hm-confirm-delete-dialog")],ri);var li=Object.freeze({__proto__:null,get ConfirmDeleteDialog(){return ri;}});let ci=class extends ze(pe){constructor(){super(...arguments),this.areas={},this.sensors={},this.automations={},this.name="";}hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"house_modes_config_updated"})];}async _fetchData(){this.hass&&(this.areas=await Le(this.hass),this.sensors=await ke(this.hass),this.automations=await Ae(this.hass));}async showDialog(e){await this._fetchData(),this._params=e,e.area_id&&(this.area_id=e.area_id,this.name=this.areas[this.area_id].name),await this.updateComplete;}async closeDialog(){this._params=void 0,this.area_id=void 0,this.name="";}render(){return this._params?Z`
      <ha-dialog
        open
        @closed=${this.closeDialog}
      >
        <ha-dialog-header slot="header">
          <ha-icon-button
            slot="navigationIcon"
            data-dialog="close"
            .label=${this.hass.localize("ui.common.close")}
            .path=${$s}
          ></ha-icon-button>
          <div slot="title">
            ${this.area_id?us("panels.general.dialogs.edit_area.title",this.hass.language,"{area}",this.areas[this.area_id].name):us("panels.general.dialogs.create_area.title",this.hass.language)}
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
                  ${us("panels.general.dialogs.edit_area.name_warning",this.hass.language)}
                </span>
              `:""}
          ${this.area_id?"":Z`
          <hm-select
            .hass=${this.hass}
            .items=${Object.values(this.areas).map(e=>Object({value:e.area_id,name:e.name}))}
            value=${this.selectedArea}
            label="${us("panels.general.dialogs.create_area.fields.copy_from",this.hass.language)}"
            clearable=${!0}
            @value-changed=${e=>this.selectedArea=e.target.value}
          ></hm-select>
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
    `:Z``;}saveClick(e){const t=this.name.trim();if(!t.length)return;let s={name:t};this.area_id?s=Object.assign(Object.assign({},s),{area_id:this.area_id}):this.selectedArea&&(s=Object.assign(Object.assign({},s),{modes:Object.assign({},this.areas[this.selectedArea].modes)})),Te(this.hass,s).catch(t=>ia(t,e)).then(()=>{this.closeDialog();});}async deleteClick(e){if(!this.area_id)return;const t=Object.values(this.sensors).filter(e=>e.area==this.area_id).length,s=Object.values(this.automations).filter(e=>{var t;return null===(t=e.triggers)||void 0===t?void 0:t.map(e=>e.area).includes(this.area_id);}).length;let a=!1;var i,n;a=t||s?await new Promise(a=>{Zs(e.target,"show-dialog",{dialogTag:"hm-confirm-delete-dialog",dialogImport:()=>Promise.resolve().then(function(){return li;}),dialogParams:{title:us("panels.general.dialogs.remove_area.title",this.hass.language),description:us("panels.general.dialogs.remove_area.description",this.hass.language,"sensors",String(t),"automations",String(s)),cancel:()=>a(!1),confirm:()=>a(!0)}});}):window.confirm("Delete this partition and its alarm entity?"),a&&(i=this.hass,n=this.area_id,i.callApi("POST","house_modes/area",{area_id:n,remove:!0})).catch(t=>ia(t,e)).then(()=>{this.closeDialog();});}static get styles(){return h`
      ${pa}
      div.wrapper {
        color: var(--primary-text-color);
      }
      span.note {
        color: var(--secondary-text-color);
      }
      ha-input {
        display: block;
      }
      hm-select {
        margin-top: 10px;
      }
    `;}};i([ye({attribute:!1})],ci.prototype,"hass",void 0),i([be()],ci.prototype,"_params",void 0),i([ye()],ci.prototype,"areas",void 0),i([ye()],ci.prototype,"sensors",void 0),i([ye()],ci.prototype,"automations",void 0),i([ye()],ci.prototype,"name",void 0),i([ye()],ci.prototype,"area_id",void 0),i([ye()],ci.prototype,"selectedArea",void 0),ci=i([me("hm-create-area-dialog")],ci);var di=Object.freeze({__proto__:null,get CreateAreaDialog(){return ci;}});let hi=class extends ze(pe){constructor(){super(...arguments),this.areas={},this.sensors={},this.automations={};}hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"house_modes_config_updated"})];}async _fetchData(){this.hass&&(this.areas=await Le(this.hass),this.sensors=await ke(this.hass),this.automations=await Ae(this.hass));}render(){if(!this.hass)return Z``;const e=Object.values(this.areas);e.sort(ra);const t={actions:{width:"48px"},name:{title:this.hass.localize("ui.common.name"),width:"40%",grow:!0,text:!0},remarks:{title:us("panels.general.cards.areas.table.remarks",this.hass.language),width:"60%",hide:this.narrow,text:!0}},s=Object.values(e).map(t=>{const s=Object.values(this.sensors).filter(e=>e.area==t.area_id).length,a=1==Object.values(e).length?Object.values(this.automations).filter(e=>{var s,a;return(null===(s=e.triggers)||void 0===s?void 0:s.map(e=>e.area).includes(t.area_id))||!(null===(a=e.triggers)||void 0===a?void 0:a.map(e=>e.area).length);}).length:Object.values(this.automations).filter(e=>{var s;return null===(s=e.triggers)||void 0===s?void 0:s.map(e=>e.area).includes(t.area_id);}).length,i=`<a href="${ga("zones",{filter:{area:t.area_id}})}">${us("panels.general.cards.areas.table.summary_sensors",this.hass.language,"number",s)}</a>`,n=s=>Object.values(this.automations).filter(a=>{var i,n;return a.type==s&&((null===(i=a.triggers)||void 0===i?void 0:i.map(e=>e.area).includes(t.area_id))||1==Object.values(e).length&&!(null===(n=a.triggers)||void 0===n?void 0:n.map(e=>e.area).length));}).length,o=(e,t)=>`${e} ${t}${1==e?"":"s"}`,r=a?`<a href="${ga("notifications",{filter:{area:t.area_id}})}">${o(n("notification"),"notification")}</a> and <a href="${ga("actions",{filter:{area:t.area_id}})}">${o(n("action"),"action")}</a>`:us("panels.general.cards.areas.table.summary_automations",this.hass.language,"number",0);return{id:t.area_id,actions:Z`
          <ha-icon-button @click=${e=>this.editClick(e,t.area_id)} .path=${Es}></ha-icon-button>
        `,name:Ys(t.name),remarks:ai(us("panels.general.cards.areas.table.summary",this.hass.language,"summary_sensors",i,"summary_automations",r))};});return Z`
      <ha-card>${Sa(us("panels.general.cards.areas.title",this.hass.language),"settings")}
        <div class="card-content">
          ${us("panels.general.cards.areas.description",this.hass.language)}
        </div>
        <div class="card-actions" style="border-top:none;border-bottom:1px solid var(--divider-color)">
          <ha-button appearance="plain" @click=${this.addClick}>
            ${us("panels.general.cards.areas.actions.add",this.hass.language)}
          </ha-button>
        </div>

        <hm-table .columns=${t} .data=${s}>
          ${us("panels.general.cards.areas.no_items",this.hass.language)}
        </hm-table>
      </ha-card>
    `;}addClick(e){const t=e.target;Zs(t,"show-dialog",{dialogTag:"hm-create-area-dialog",dialogImport:()=>Promise.resolve().then(function(){return di;}),dialogParams:{}});}editClick(e,t){const s=e.target;Zs(s,"show-dialog",{dialogTag:"hm-create-area-dialog",dialogImport:()=>Promise.resolve().then(function(){return di;}),dialogParams:{area_id:t}});}};hi.styles=pa,i([ye()],hi.prototype,"narrow",void 0),i([ye()],hi.prototype,"path",void 0),i([ye()],hi.prototype,"config",void 0),i([ye()],hi.prototype,"areas",void 0),i([ye()],hi.prototype,"sensors",void 0),i([ye()],hi.prototype,"automations",void 0),hi=i([me("hm-area-config-card")],hi);let pi=class extends pe{constructor(){super(...arguments),this.name="";}async showDialog(e){this._params=e;const t=await we(this.hass);this.name=t.master.name||"",await this.updateComplete;}async closeDialog(){this._params=void 0;}render(){return this._params?Z`
      <ha-dialog
        open
        @closed=${this.closeDialog}
      >
        <ha-dialog-header slot="header">
          <ha-icon-button
            slot="navigationIcon"
            data-dialog="close"
            .label=${this.hass.localize("ui.common.close")}
            .path=${$s}
          ></ha-icon-button>
          <div slot="title">${us("panels.general.dialogs.edit_master.title",this.hass.language)}</div>
        </ha-dialog-header>
        <div class="wrapper">
          <ha-input
            label=${this.hass.localize("ui.common.name")}
            @input=${e=>this.name=e.target.value}
            value="${this.name}"
          ></ha-input>
          <span class="note">${us("panels.general.dialogs.edit_area.name_warning",this.hass.language)}</span>
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
    `:Z``;}saveClick(){const e=this.name.trim();e.length&&Se(this.hass,{master:{enabled:!0,name:e}}).catch().then(()=>{this.closeDialog();});}static get styles(){return h`
      div.wrapper {
        color: var(--primary-text-color);
      }
      span.note {
        color: var(--secondary-text-color);
      }
      ha-input {
        display: block;
      }
    `;}};i([ye({attribute:!1})],pi.prototype,"hass",void 0),i([be()],pi.prototype,"_params",void 0),i([ye()],pi.prototype,"name",void 0),pi=i([me("hm-edit-master-dialog")],pi);var ui=Object.freeze({__proto__:null,get EditMasterDialog(){return pi;}});let mi=class extends ze(pe){constructor(){super(...arguments),this.areas={},this.automations={},this.showLegacy=!1;}hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"house_modes_config_updated"})];}async _fetchData(){var e;if(this.hass){this.config=await we(this.hass),this.areas=await Le(this.hass),this.automations=await Ae(this.hass),this.data=Qs(this.config,["trigger_time","disarm_after_trigger","ignore_blocking_sensors_after_trigger","mqtt","master"]);try{this.showLegacy=!!(null===(e=(await va(this.hass)).ui)||void 0===e?void 0:e.show_legacy_zones);}catch(e){}}}firstUpdated(){(async()=>{await $e();})();}render(){if(!this.hass||!this.config||!this.data)return Z``;if("mqtt_configuration"==this.path.subpage)return Z`
        <hm-mqtt-config-card .hass=${this.hass} .narrow=${this.narrow}></hm-mqtt-config-card>
      `;if(this.path.params.edit_area)return Z`
        <area-editor-card
          .hass=${this.hass}
          .narrow=${this.narrow}
          item=${this.path.params.edit_area}
        ></area-editor-card>
      `;{if("modes"==this.section)return Z`<hm-alarm-mode-card .hass=${this.hass} .narrow=${this.narrow}></hm-alarm-mode-card>`;const e=void 0===this.section;if("partitions"==this.section){const e=Object.keys(this.areas||{}).length;return za("Partitions & Arm Modes","settings",Z`<p>The parts of the building armed on their own, the Arm
            Modes (Away, Home, Night, …) with their delays, and what the alarm does after it goes off.</p>`,Z`
          ${Ta("partitions","Partitions",`${e} partition${1===e?"":"s"}`,Z`<hm-area-config-card .hass=${this.hass} .narrow=${this.narrow}></hm-area-config-card>`,{flat:!0})}
          ${Ta("arm-modes","Arm Modes","exit, entry and alarm times per Arm Mode",Z`<hm-alarm-mode-card .hass=${this.hass} .narrow=${this.narrow}></hm-alarm-mode-card>`,{flat:!0})}
          ${this.renderAlarmSettings()}`);}return"mqtt"==this.section?this.renderMqtt():Z`
        ${this.renderAlarmSettings()} ${this.renderMqtt()}
        ${e?Z`
              <hm-alarm-mode-card .hass=${this.hass} .narrow=${this.narrow}></hm-alarm-mode-card>
              <hm-area-config-card .hass=${this.hass} .narrow=${this.narrow}></hm-area-config-card>
            `:""}
      `;}}renderAlarmSettings(){var e,t,s;if(!this.hass||!this.data)return Z``;const a=this.hass.language,i=Da("alarm-behavior"),n=Object.keys(this.areas).length>=2,o=(e,t,s,n=!1)=>Z`
      <label class="ab-row ${n?"nested":""}">
        <input type="checkbox" class="cb" ?disabled=${i} .checked=${t}
          @change=${e=>s(e.target.checked,e)} />
        <span><strong>${us(`panels.general.cards.general.fields.${e}.heading`,a)}</strong>
          <span class="secondary">${us(`panels.general.cards.general.fields.${e}.description`,a)}</span></span>
      </label>`,r=[this.data.disarm_after_trigger?"disarm after an alarm":"back to armed after an alarm",n?(null===(e=this.data.master)||void 0===e?void 0:e.enabled)?"All partitions alarm on":"no All partitions alarm":""].filter(Boolean).join(" · ");return Z`
        ${Ta("alarm-behavior","Alarm behavior",r,Z`
          <div class="ab-head">
            <span class="secondary">What the alarm does after it goes off, and whether it has an "All partitions" alarm.</span>
            <span class="grow"></span>
            ${Pa(i,()=>{Na["alarm-behavior"]=!i,this.requestUpdate();},"these settings")}
          </div>
          <div class="ab-group">After an alarm</div>
          ${o("disarm_after_trigger",!!this.data.disarm_after_trigger,e=>this.saveData({disarm_after_trigger:e}))}
          ${!1===this.data.disarm_after_trigger?o("ignore_blocking_sensors_after_trigger",!!this.data.ignore_blocking_sensors_after_trigger,e=>this.saveData({ignore_blocking_sensors_after_trigger:e}),!0):K}
          ${n?Z`<div class="ab-group">All partitions</div>
              ${o("enable_master",!!(null===(t=this.data.master)||void 0===t?void 0:t.enabled),(e,t)=>this.toggleEnableMaster(t))}
              ${(null===(s=this.data.master)||void 0===s?void 0:s.enabled)?Z`<div class="ab-actions"><ha-button appearance="plain" ?disabled=${i} @click=${this.setupMasterClick}>
                    ${us("panels.general.cards.general.actions.setup_master",a)}
                    <ha-icon slot="end" icon="mdi:open-in-new"></ha-icon></ha-button></div>`:K}`:K}
        `)}`;}renderMqtt(){var e,t,s,a;return this.hass&&this.data?Z`
        <ha-card class="flat-in-section">${Sa("MQTT","settings")}
          <div class="card-content">Publish the alarm's state to MQTT and accept commands from it (e.g. for wall panels).</div>
          <hm-settings-row .narrow=${this.narrow}>
            <span slot="heading">
              ${us("panels.general.cards.general.fields.enable_mqtt.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${us("panels.general.cards.general.fields.enable_mqtt.description",this.hass.language)}
            </span>
            <input type="checkbox" class="cb"
              .checked=${null===(t=null===(e=this.data)||void 0===e?void 0:e.mqtt)||void 0===t?void 0:t.enabled}
              @change=${e=>{this.saveData({mqtt:Object.assign(Object.assign({},this.data.mqtt),{enabled:e.target.checked})});}} />
          </hm-settings-row>

          ${(null===(a=null===(s=this.data)||void 0===s?void 0:s.mqtt)||void 0===a?void 0:a.enabled)?Z`
                <div style="padding: 0px 0px 16px 16px; margin-top: -8px">
                  <ha-button
                    appearance="filled"
                    @click=${()=>la(0,ga("general","mqtt_configuration"),!0)}
                  >
                    ${us("panels.general.cards.general.actions.setup_mqtt",this.hass.language)}
                    <ha-icon slot="end" icon="mdi:open-in-new"></ha-icon>
                  </ha-button>
                </div>
              `:""}
        </ha-card>`:Z``;}setupMasterClick(e){const t=e.target;Zs(t,"show-dialog",{dialogTag:"hm-edit-master-dialog",dialogImport:()=>Promise.resolve().then(function(){return ui;}),dialogParams:{}});}async toggleEnableMaster(e){const t=e.target;let s=t.checked;if(!s){const a=Object.values(this.automations).filter(e=>e.triggers.some(e=>!e.area));if(a.length){(await new Promise(e=>{Zs(t,"show-dialog",{dialogTag:"hm-confirm-delete-dialog",dialogImport:()=>Promise.resolve().then(function(){return li;}),dialogParams:{title:us("panels.general.dialogs.disable_master.title",this.hass.language),description:us("panels.general.dialogs.disable_master.description",this.hass.language,"automations",String(a.length)),cancel:()=>e(!1),confirm:()=>e(!0)}});}))?!s&&a.length&&a.forEach(t=>{He(this.hass,t.automation_id).catch(t=>ia(t,e));}):(s=!0,t.checked=!0);}}this.saveData({master:Object.assign(Object.assign({},this.data.master),{enabled:s})});}saveData(e){this.hass&&this.data&&(this.data=Object.assign(Object.assign({},this.data),e),Se(this.hass,this.data).catch(e=>ia(e,this.shadowRoot.querySelector("ha-card"))).then());}};mi.styles=[pa,ka,h`
      .ab-head {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 4px 4px;
      }
      .ab-head .grow {
        flex: 1;
      }
      .ab-group {
        color: var(--accent-color);
        font-weight: 500;
        font-size: 14px;
        margin: 10px 4px 2px;
      }
      .ab-row {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 8px 4px;
        border-bottom: 1px solid var(--divider-color);
        cursor: pointer;
      }
      .ab-row.nested {
        padding-left: 32px;
      }
      .ab-row input {
        margin-top: 2px;
        flex: none;
      }
      .ab-row > span {
        display: flex;
        flex-direction: column;
      }
      .ab-actions {
        padding: 8px 0 0 32px;
      }
    `],i([ye()],mi.prototype,"narrow",void 0),i([ye()],mi.prototype,"path",void 0),i([ye()],mi.prototype,"section",void 0),i([ye()],mi.prototype,"data",void 0),i([ye()],mi.prototype,"config",void 0),i([ye()],mi.prototype,"areas",void 0),i([ye()],mi.prototype,"automations",void 0),i([ye()],mi.prototype,"showLegacy",void 0),mi=i([me("hm-view-general")],mi);const gi=(e,t)=>{const s=function(e){const t="string"==typeof e?e:e.entity_id;return String(t.split(".").shift());}(e.entity_id);if("binary_sensor"==s){if(t)return!0;const s=e.attributes.device_class;return!!s&&!!["carbon_monoxide","door","garage_door","gas","heat","lock","moisture","motion","moving","occupancy","opening","presence","safety","smoke","sound","tamper","vibration","window"].includes(s);}return!1;},vi=e=>{switch(e.attributes.device_class){case"door":case"garage_door":case"lock":case"opening":return Vs.Door;case"window":return Vs.Window;case"carbon_monoxide":case"gas":case"heat":case"moisture":case"smoke":case"safety":return Vs.Environmental;case"motion":case"moving":case"occupancy":case"presence":return Vs.Motion;case"sound":case"vibration":case"tamper":return Vs.Tamper;default:return;}},yi=e=>{const t=t=>t.filter(t=>e.includes(t));return{[Vs.Door]:{modes:t([Ws.ArmedAway,Ws.ArmedHome,Ws.ArmedNight,Ws.ArmedVacation]),always_on:!1,allow_open:!1,arm_on_close:!1,use_entry_delay:!0,use_exit_delay:!0},[Vs.Window]:{modes:t([Ws.ArmedAway,Ws.ArmedHome,Ws.ArmedNight,Ws.ArmedVacation]),always_on:!1,allow_open:!1,arm_on_close:!1,use_entry_delay:!1,use_exit_delay:!1},[Vs.Motion]:{modes:t([Ws.ArmedAway,Ws.ArmedVacation]),always_on:!1,allow_open:!0,arm_on_close:!1,use_entry_delay:!0,use_exit_delay:!0},[Vs.Tamper]:{modes:t([Ws.ArmedAway,Ws.ArmedHome,Ws.ArmedNight,Ws.ArmedVacation,Ws.ArmedCustom]),always_on:!1,allow_open:!1,arm_on_close:!1,use_entry_delay:!1,use_exit_delay:!1},[Vs.Environmental]:{modes:t([Ws.ArmedAway,Ws.ArmedHome,Ws.ArmedNight,Ws.ArmedVacation,Ws.ArmedCustom]),always_on:!0,allow_open:!1,arm_on_close:!1,use_entry_delay:!1,use_exit_delay:!1}};};function bi(e,t){if(!e)return null;const s=ca(e.entity_id);let a={entity_id:e.entity_id,modes:[],use_entry_delay:!0,use_exit_delay:!0,entry_delay:null,delay_on:null,arm_on_close:!1,allow_open:!1,always_on:!1,auto_bypass:!1,auto_bypass_modes:[],trigger_unavailable:!1,type:Vs.Other,enabled:!0};if("binary_sensor"==s){const s=vi(e);s&&(a=Object.assign(Object.assign(Object.assign({},a),{type:s}),yi(t)[s]));}return a;}const fi=(e,t,s=!1)=>{const a=Object.values(e.states).filter(e=>gi(e,s)).filter(e=>!t.includes(e.entity_id)).map(e=>Object({id:e.entity_id,name:Ks(e),icon:$i(e)}));return a.sort(ra),a;},$i=(e,t)=>{const s="off"===t;switch(null==e?void 0:e.attributes.device_class){case"battery":return s?vs:"M16,20H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z";case"battery_charging":return s?vs:"M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.66C6,21.4 6.6,22 7.33,22H16.66C17.4,22 18,21.4 18,20.67V5.33C18,4.6 17.4,4 16.67,4M11,20V14.5H9L13,7V12.5H15";case"cold":return s?zs:"M20.79,13.95L18.46,14.57L16.46,13.44V10.56L18.46,9.43L20.79,10.05L21.31,8.12L19.54,7.65L20,5.88L18.07,5.36L17.45,7.69L15.45,8.82L13,7.38V5.12L14.71,3.41L13.29,2L12,3.29L10.71,2L9.29,3.41L11,5.12V7.38L8.5,8.82L6.5,7.69L5.92,5.36L4,5.88L4.47,7.65L2.7,8.12L3.22,10.05L5.55,9.43L7.55,10.56V13.45L5.55,14.58L3.22,13.96L2.7,15.89L4.47,16.36L4,18.12L5.93,18.64L6.55,16.31L8.55,15.18L11,16.62V18.88L9.29,20.59L10.71,22L12,20.71L13.29,22L14.7,20.59L13,18.88V16.62L15.5,15.17L17.5,16.3L18.12,18.63L20,18.12L19.53,16.35L21.3,15.88L20.79,13.95M9.5,10.56L12,9.11L14.5,10.56V13.44L12,14.89L9.5,13.44V10.56Z";case"connectivity":return s?"M13,19H14A1,1 0 0,1 15,20H15.73L13,17.27V19M22,20V21.18L20.82,20H22M21,22.72L19.73,24L17.73,22H15A1,1 0 0,1 14,23H10A1,1 0 0,1 9,22H2V20H9A1,1 0 0,1 10,19H11V17H4A1,1 0 0,1 3,16V12A1,1 0 0,1 4,11H6.73L4.73,9H4A1,1 0 0,1 3,8V7.27L1,5.27L2.28,4L21,22.72M4,3H20A1,1 0 0,1 21,4V8A1,1 0 0,1 20,9H9.82L7,6.18V5H5.82L3.84,3C3.89,3 3.94,3 4,3M20,11A1,1 0 0,1 21,12V16A1,1 0 0,1 20,17H17.82L11.82,11H20M9,7H10V5H9V7M9,15H10V14.27L9,13.27V15M5,13V15H7V13H5Z":"M13,19H14A1,1 0 0,1 15,20H22V22H15A1,1 0 0,1 14,23H10A1,1 0 0,1 9,22H2V20H9A1,1 0 0,1 10,19H11V17H4A1,1 0 0,1 3,16V12A1,1 0 0,1 4,11H20A1,1 0 0,1 21,12V16A1,1 0 0,1 20,17H13V19M4,3H20A1,1 0 0,1 21,4V8A1,1 0 0,1 20,9H4A1,1 0 0,1 3,8V4A1,1 0 0,1 4,3M9,7H10V5H9V7M9,15H10V13H9V15M5,5V7H7V5H5M5,13V15H7V13H5Z";case"door":return s?ks:xs;case"garage_door":return s?"M19,20H17V11H7V20H5V9L12,5L19,9V20M8,12H16V14H8V12M8,15H16V17H8V15M16,18V20H8V18H16Z":"M19,20H17V11H7V20H5V9L12,5L19,9V20M8,12H16V14H8V12Z";case"power":case"plug":return s?Ts:Ls;case"gas":case"problem":case"safety":case"tamper":return s?ys:ms;case"smoke":return s?ys:"M17 19V22H15V19C15 17.9 14.1 17 13 17H10C7.2 17 5 14.8 5 12C5 10.8 5.4 9.8 6.1 8.9C3.8 8.5 2 6.4 2 4C2 3.3 2.2 2.6 2.4 2H4.8C4.3 2.5 4 3.2 4 4C4 5.7 5.3 7 7 7H10V9C8.3 9 7 10.3 7 12S8.3 15 10 15H13C15.2 15 17 16.8 17 19M17.9 8.9C20.2 8.5 22 6.4 22 4C22 3.3 21.8 2.6 21.6 2H19.2C19.7 2.5 20 3.2 20 4C20 5.7 18.7 7 17 7H15.8C15.9 7.3 16 7.6 16 8C16 9.7 14.7 11 13 11V13C15.8 13 18 15.2 18 18V22H20V18C20 15.3 18.5 13 16.2 11.8C17.1 11.1 17.7 10.1 17.9 8.9Z";case"heat":return s?zs:As;case"light":return s?"M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z":"M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z";case"lock":return s?Cs:js;case"moisture":return s?"M20.84 22.73L16.29 18.18C15.2 19.3 13.69 20 12 20C8.69 20 6 17.31 6 14C6 12.67 6.67 11.03 7.55 9.44L1.11 3L2.39 1.73L22.11 21.46L20.84 22.73M18 14C18 10 12 3.25 12 3.25S10.84 4.55 9.55 6.35L17.95 14.75C18 14.5 18 14.25 18 14Z":"M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z";case"motion":return s?"M14.12,10H19V8.2H15.38L13.38,4.87C13.08,4.37 12.54,4.03 11.92,4.03C11.74,4.03 11.58,4.06 11.42,4.11L6,5.8V11H7.8V7.33L9.91,6.67L6,22H7.8L10.67,13.89L13,17V22H14.8V15.59L12.31,11.05L13.04,8.18M14,3.8C15,3.8 15.8,3 15.8,2C15.8,1 15,0.2 14,0.2C13,0.2 12.2,1 12.2,2C12.2,3 13,3.8 14,3.8Z":"M13.5,5.5C14.59,5.5 15.5,4.58 15.5,3.5C15.5,2.38 14.59,1.5 13.5,1.5C12.39,1.5 11.5,2.38 11.5,3.5C11.5,4.58 12.39,5.5 13.5,5.5M9.89,19.38L10.89,15L13,17V23H15V15.5L12.89,13.5L13.5,10.5C14.79,12 16.79,13 19,13V11C17.09,11 15.5,10 14.69,8.58L13.69,7C13.29,6.38 12.69,6 12,6C11.69,6 11.5,6.08 11.19,6.08L6,8.28V13H8V9.58L9.79,8.88L8.19,17L3.29,16L2.89,18L9.89,19.38Z";case"occupancy":case"presence":return s?Ss:Os;case"opening":return s?"M3,3V21H21V3":"M3,3H21V21H3V3M5,5V19H19V5H5Z";case"running":return s?"M18,18H6V6H18V18Z":"M8,5.14V19.14L19,12.14L8,5.14Z";case"sound":return s?"M4.27 3L3 4.27L12 13.27V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17S7.79 21 10 21 14 19.21 14 17V15.27L19.73 21L21 19.73L4.27 3M14 7H18V3H12V8.18L14 10.18Z":"M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17S7.79 21 10 21 14 19.21 14 17V7H18V3H12Z";case"update":return s?"M5.12,5H18.87L17.93,4H5.93L5.12,5M20.54,5.23C20.83,5.57 21,6 21,6.5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V6.5C3,6 3.17,5.57 3.46,5.23L4.84,3.55C5.12,3.21 5.53,3 6,3H18C18.47,3 18.88,3.21 19.15,3.55L20.54,5.23M6,18H12V15H6V18Z":"M20.54,5.23C20.83,5.57 21,6 21,6.5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V6.5C3,6 3.17,5.57 3.46,5.23L4.84,3.55C5.12,3.21 5.53,3 6,3H18C18.47,3 18.88,3.21 19.15,3.55L20.54,5.23M5.12,5H18.87L17.93,4H5.93L5.12,5M12,9.5L6.5,15H10V17H14V15H17.5L12,9.5Z";case"vibration":return s?_s:Ps;case"window":return s?Ns:Ds;default:return s?"M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z":"M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z";}};let _i=class extends pe{async showDialog(e){this._params=e,await this.updateComplete;}async closeDialog(){this._params=void 0;}render(){return this._params?Z`
      <ha-dialog
        open
        @closed=${this.closeDialog}
      >
        <ha-dialog-header slot="header">
          <ha-icon-button
            slot="navigationIcon"
            data-dialog="close"
            .label=${this.hass.localize("ui.common.close")}
            .path=${$s}
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
    `;}};i([ye({attribute:!1})],_i.prototype,"hass",void 0),i([be()],_i.prototype,"_params",void 0),_i=i([me("hm-error-dialog")],_i);var wi=Object.freeze({__proto__:null,get ErrorDialog(){return _i;}});let ki=class extends ze(pe){constructor(){super(...arguments),this.sensorGroups={},this.sensors={};}hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"house_modes_config_updated"})];}async _fetchData(){this.hass&&(this.sensorGroups=await Oe(this.hass),this.sensors=await ke(this.hass));}async showDialog(e){await this._fetchData(),this._params=e,e.group_id&&Object.keys(this.sensorGroups).includes(e.group_id)?this.data=Object.assign({},this.sensorGroups[e.group_id]):this.data={name:"",entities:[],timeout:600,event_count:2},await this.updateComplete;}async closeDialog(){this._params=void 0;}render(){return this._params?Z`
      <ha-dialog
        open
        @closed=${this.closeDialog}
      >
        <ha-dialog-header slot="header">
          <ha-icon-button
            slot="navigationIcon"
            data-dialog="close"
            .label=${this.hass.localize("ui.common.close")}
            .path=${$s}
          ></ha-icon-button>
          <div slot="title">
            ${this.data.group_id?us("panels.sensors.dialogs.edit_group.title",this.hass.language,"{name}",this.sensorGroups[this.data.group_id].name):us("panels.sensors.dialogs.create_group.title",this.hass.language)}
          </div>
        </ha-dialog-header>
        <div class="wrapper">
          <hm-settings-row dialog>
            <span slot="heading">
              ${us("panels.sensors.dialogs.create_group.fields.name.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${us("panels.sensors.dialogs.create_group.fields.name.description",this.hass.language)}
            </span>
            <ha-input
              label=${this.hass.localize("ui.common.name")}
              @input=${e=>this.data=Object.assign(Object.assign({},this.data),{name:String(e.target.value).trim()})}
              value="${this.data.name}"
            ></ha-input>
          </hm-settings-row>

          <hm-settings-row large dialog>
            <span slot="heading">
              ${us("panels.sensors.dialogs.create_group.fields.sensors.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${us("panels.sensors.dialogs.create_group.fields.sensors.description",this.hass.language)}
            </span>
            <div>
              ${this.renderSensorOptions()}
            </div>
          </hm-settings-row>

          <hm-settings-row dialog>
            <span slot="heading">
              ${us("panels.sensors.dialogs.create_group.fields.timeout.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${us("panels.sensors.dialogs.create_group.fields.timeout.description",this.hass.language)}
            </span>
            <hm-duration-picker
              .hass=${this.hass}
              min="10"
              max="900"
              .value=${this.data.timeout}
              ?required=${!0}
              @value-changed=${e=>this.data=Object.assign(Object.assign({},this.data),{timeout:e.detail.value})}
            ></hm-duration-picker>
          </hm-settings-row>

          ${this.data.entities.length>2?Z`
          <hm-settings-row dialog>
            <span slot="heading">
              ${us("panels.sensors.dialogs.create_group.fields.event_count.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${us("panels.sensors.dialogs.create_group.fields.event_count.description",this.hass.language)}
            </span>
            <hm-select
              .hass=${this.hass}
              .items=${this.renderSensorCountOptions()}
              ?disabled=${this.data.entities.length<=2}
              @value-changed=${e=>{this.data=Object.assign(Object.assign({},this.data),{event_count:Number(e.detail.value)});}}
              .value=${String(this.data.event_count>this.data.entities.length?this.data.entities.length:this.data.event_count)}
            ></hm-select>
          </hm-settings-row>
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
    `:Z``;}renderSensorOptions(){const e=Object.keys(this.sensors).filter(e=>!ta(this.sensors[e].group)||this.sensors[e].group===this.data.group_id).map(e=>{const t=this.hass.states[e],s=Object.entries(Vs).find(([,t])=>t==this.sensors[e].type)[0];return{value:e,name:Ys(Ks(t)),icon:Us[s]};});return e.sort(ra),e.length?Z`
      <hm-chip-set
        .hass=${this.hass}
        .items=${e}
        .value=${this.data.entities}
        toggleable
        @value-changed=${e=>this.data=Object.assign(Object.assign({},this.data),{entities:e.detail})}
      ></hm-chip-set>
    `:us("panels.sensors.cards.sensors.no_items",this.hass.language);}renderSensorCountOptions(){let e=[];for(let t=2;t<=this.data.entities.length;t++)e=[...e,{name:`${t}`,value:`${t}`}];return e;}saveClick(e){var t,s;this.data.name.length&&(this.data.group_id&&this.data.name==this.sensorGroups[this.data.group_id].name||!Object.values(this.sensorGroups).find(e=>e.name.toLowerCase()==this.data.name.toLowerCase()))?this.data.entities.length<2?aa(e,us("panels.sensors.dialogs.create_group.errors.insufficient_sensors",this.hass.language)):(this.data.event_count>this.data.entities.length&&(this.data=Object.assign(Object.assign({},this.data),{event_count:this.data.entities.length})),(t=this.hass,s=this.data,t.callApi("POST","house_modes/sensor_groups",s)).catch(t=>ia(t,e)).then(()=>{this.closeDialog();})):aa(e,us("panels.sensors.dialogs.create_group.errors.invalid_name",this.hass.language));}deleteClick(e){var t,s;this.data.group_id&&(t=this.hass,s=this.data.group_id,t.callApi("POST","house_modes/sensor_groups",{group_id:s,remove:!0})).catch(t=>ia(t,e)).then(()=>{this.closeDialog();});}static get styles(){return h`
      ${ua}
      div.wrapper {
        color: var(--primary-text-color);
      }
    `;}};i([ye({attribute:!1})],ki.prototype,"hass",void 0),i([be()],ki.prototype,"_params",void 0),i([ye()],ki.prototype,"sensorGroups",void 0),i([ye()],ki.prototype,"sensors",void 0),i([ye()],ki.prototype,"data",void 0),ki=i([me("hm-create-sensor-group-dialog")],ki);var xi=Object.freeze({__proto__:null,get CreateSensorGroupDialog(){return ki;}});let Ai=class extends ze(pe){constructor(){super(...arguments),this.sensorGroups={},this.sensors={};}hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"house_modes_config_updated"})];}async _fetchData(){this.hass&&(this.sensorGroups=await Oe(this.hass),this.sensors=await ke(this.hass));}async showDialog(e){await this._fetchData(),this._params=e,await this.updateComplete;}async closeDialog(){this._params=void 0;}render(){return this._params?Z`
      <ha-dialog
        open
        @closed=${this.closeDialog}
      >
        <ha-dialog-header slot="header">
          <ha-icon-button
            slot="navigationIcon"
            data-dialog="close"
            .label=${this.hass.localize("ui.common.close")}
            .path=${$s}
          ></ha-icon-button>
          <div slot="title">${us("panels.sensors.dialogs.manage_groups.title",this.hass.language)}</div>
        </ha-dialog-header>
        <div class="wrapper">
          <div class="description">
            ${us("panels.sensors.dialogs.manage_groups.description",this.hass.language)}
          </div>
          <div class="container">
            ${Object.keys(this.sensorGroups).length?Object.values(this.sensorGroups).map(e=>this.renderGroup(e)):us("panels.sensors.dialogs.manage_groups.no_items",this.hass.language)}
          </div>
        </div>
        <ha-button appearance="plain" @click=${this.createGroupClick}>
          <ha-icon icon="hass:plus"></ha-icon>
          ${us("panels.sensors.dialogs.manage_groups.actions.new_group",this.hass.language)}
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
        <span class="description">${us("panels.general.cards.areas.table.summary_sensors",this.hass.language,"{number}",String(e.entities.length))}
      </div>
      <ha-icon-button .path=${fs}>
      </ha-icon-button>
    </ha-card>
    `;}createGroupClick(e){const t=e.target;Zs(t,"show-dialog",{dialogTag:"hm-create-sensor-group-dialog",dialogImport:()=>Promise.resolve().then(function(){return xi;}),dialogParams:{}});}editGroupClick(e,t){const s=e.target;Zs(s,"show-dialog",{dialogTag:"hm-create-sensor-group-dialog",dialogImport:()=>Promise.resolve().then(function(){return xi;}),dialogParams:{group_id:t}});}static get styles(){return h`
      ${ua}

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
    `;}};i([ye({attribute:!1})],Ai.prototype,"hass",void 0),i([be()],Ai.prototype,"_params",void 0),i([ye()],Ai.prototype,"sensorGroups",void 0),i([ye()],Ai.prototype,"sensors",void 0),Ai=i([me("hm-manage-sensor-groups-dialog")],Ai);var Oi=Object.freeze({__proto__:null,get ManageSensorGroupsDialog(){return Ai;}});let Si=class extends ze(pe){constructor(){super(...arguments),this.showBypassModes=!1,this.sensorsList=[],this.entityIdUnlocked=!1;}hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"house_modes_config_updated"})];}async _fetchData(){var e;if(!this.hass)return;const t=await Le(this.hass);this.areas=t;const s=await Oe(this.hass);this.sensorGroups=s;const a=await ke(this.hass);this.data=Object.keys(a).includes(this.item)?a[this.item]:void 0,this.data&&!(null===(e=this.data)||void 0===e?void 0:e.area)&&1==Object.keys(t).length&&(this.data=Object.assign(Object.assign({},this.data),{area:Object.keys(this.areas)[0]}));let i=fi(this.hass,Object.keys(a),!0);this.sensorsList=i.map(e=>Object(Object.assign(Object.assign({},e),{description:e.id,value:e.id}))),this.hass.states[this.item]||(this.entityIdUnlocked=!0);}render(){if(!this.data)return Z``;let e=[...this.sensorsList];return e.find(e=>e.value==this.data.entity_id)||(e=[{value:this.data.entity_id,description:this.data.entity_id,name:Ks(this.hass.states[this.item]),icon:$i(this.hass.states[this.item])},...e]),this.hass.states[this.data.entity_id],Z`
      <ha-card>
        <div class="card-header">
          <div class="name">${us("panels.sensors.cards.editor.title",this.hass.language)}</div>
          ${Oa("legacy")}
          <ha-icon-button .path=${$s} @click=${this.cancelClick}></ha-icon-button>
        </div>
        <div class="card-content">
          ${us("panels.sensors.cards.editor.description",this.hass.language,"{entity}",Ks(this.hass.states[this.item]))}
        </div>

        <hm-settings-row .narrow=${this.narrow} .large=${!0}>
          <span slot="heading">
            ${us("panels.sensors.cards.editor.fields.entity.heading",this.hass.language)}
          </span>
          <span slot="description">
            ${us("panels.sensors.cards.editor.fields.entity.description",this.hass.language)}
          </span>

          <div style="display: flex; flex-direction: row">
            <hm-select
              .hass=${this.hass}
              style="flex: 1"
              .items=${e}
              .value=${this.data.entity_id}
              label="${us("panels.sensors.cards.editor.fields.entity.heading",this.hass.language)}"
              @value-changed=${e=>{this.data=Object.assign(Object.assign({},this.data),{new_entity_id:e.target.value});}}
              ?disabled=${!this.entityIdUnlocked}
              ?icons=${!0}
              ?invalid=${void 0===this.hass.states[this.data.new_entity_id||this.data.entity_id]}
            ></hm-select>

            <ha-icon-button
              .path=${this.entityIdUnlocked?Cs:js}
              @click=${()=>{this.entityIdUnlocked=!this.entityIdUnlocked;}}
              style="--mdc-icon-size: 20px; --mdc-icon-button-size: 48px"
            >

            </ha-icon-button>
          </div>
        </hm-settings-row>


        ${Object.keys(this.areas).length>1?Z`
              <hm-settings-row .narrow=${this.narrow}>
                <span slot="heading">
                  ${us("panels.sensors.cards.editor.fields.area.heading",this.hass.language)}
                </span>
                <span slot="description">
                  ${us("panels.sensors.cards.editor.fields.area.description",this.hass.language)}
                </span>

                <hm-select
                  .hass=${this.hass}
                  .items=${Object.values(this.areas).map(e=>Object({value:e.area_id,name:e.name}))}
                  value=${this.data.area}
                  label=${us("panels.sensors.cards.editor.fields.area.heading",this.hass.language)}
                  @value-changed=${e=>this.data=Object.assign(Object.assign({},this.data),{area:e.target.value})}
                  ?invalid=${!this.data.area}
                ></hm-select>
              </hm-settings-row>
            `:""}

        <hm-settings-row .narrow=${this.narrow} .large=${!0}>
          <span slot="heading">
            ${us("panels.sensors.cards.editor.fields.device_type.heading",this.hass.language)}
          </span>
          <span slot="description">
            ${us("panels.sensors.cards.editor.fields.device_type.description",this.hass.language)}
          </span>

          <hm-select
            .hass=${this.hass}
            .items=${t=this.hass,Object.entries(Vs).filter(([,e])=>e!=Vs.Other).map(([e,s])=>Object({value:s,name:us(`panels.sensors.cards.editor.fields.device_type.choose.${s}.name`,t.language),description:us(`panels.sensors.cards.editor.fields.device_type.choose.${s}.description`,t.language),icon:Us[e]}))}
            label=${us("panels.sensors.cards.editor.fields.device_type.heading",this.hass.language)}
            clearable=${!0}
            icons=${!0}
            value=${this.data.type}
            @value-changed=${e=>this.setType(e.target.value||Vs.Other)}
          ></hm-select>
        </hm-settings-row>

        <hm-settings-row .narrow=${this.narrow} .large=${this.modesByArea(this.data.area).length>3}>
          <span slot="heading">
            ${us("panels.sensors.cards.editor.fields.modes.heading",this.hass.language)}
          </span>
          <span slot="description">
            ${us("panels.sensors.cards.editor.fields.modes.description",this.hass.language)}
          </span>

          <div>
            ${this.modesByArea(this.data.area).map(e=>Z`
                <ha-button
                  appearance="${this.data.modes.includes(e)||this.data.always_on?"filled":"plain"}"
                  variant="${this.data.modes.includes(e)||this.data.always_on?"brand":"neutral"}"
                  @click=${()=>{this.setMode(e);}}
                  ?disabled=${this.data.always_on}
                >
                  <ha-svg-icon slot="start" .path=${Rs[Object.entries(Ws).find(([,t])=>t==e)[0]]}></ha-svg-icon>
                  ${us(`common.modes_short.${e}`,this.hass.language)}
                </ha-button>
              `)}
          </div>
        </hm-settings-row>

        <hm-settings-row .narrow=${this.narrow}>
          <span slot="heading">
            ${us("panels.sensors.cards.editor.fields.group.heading",this.hass.language)}
          </span>
          <span slot="description">
            ${us("panels.sensors.cards.editor.fields.group.description",this.hass.language)}
          </span>

          <div style="padding: 8px 0px; max-width: 250px">
            ${Object.keys(this.sensorGroups).length?Z`
                  <hm-select
                    .hass=${this.hass}
                    .clearable=${!0}
                    .items=${this.getSensorGroups()}
                    value=${this.data.group}
                    label="${us("panels.sensors.cards.editor.fields.group.heading",this.hass.language)}"
                    @value-changed=${e=>{this.data=Object.assign(Object.assign({},this.data),{group:e.detail.value});}}
                  ></hm-select>
                `:""}
            <ha-button appearance="filled" @click=${this.manageGroupsClick} style="margin-top: 4px">
              ${us("panels.sensors.cards.editor.actions.setup_groups",this.hass.language)}
              <ha-icon slot="end" icon="mdi:open-in-new"></ha-icon>
            </ha-button>
          </div>
        </hm-settings-row>

        <hm-collapsible-section
          .narrow=${this.narrow}
          header=${us("panels.sensors.cards.editor.actions.toggle_advanced",this.hass.language)}
        >
          ${!this.data.type||[Vs.Environmental,Vs.Tamper,Vs.Other].includes(this.data.type)?Z`
                <hm-settings-row .narrow=${this.narrow}>
                  <span slot="heading">
                    ${us("panels.sensors.cards.editor.fields.always_on.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${us("panels.sensors.cards.editor.fields.always_on.description",this.hass.language)}
                  </span>

                  <input type="checkbox" class="cb"
                    .checked=${this.data.always_on}
                    @change=${e=>this._SetData({always_on:e.target.checked})} />
                </hm-settings-row>
              `:""}
          ${!this.data.type||[Vs.Window,Vs.Door,Vs.Motion,Vs.Other].includes(this.data.type)?Z`
                <hm-settings-row .narrow=${this.narrow}>
                  <span slot="heading">
                    ${us("panels.sensors.cards.editor.fields.use_exit_delay.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${us("panels.sensors.cards.editor.fields.use_exit_delay.description",this.hass.language)}
                  </span>

                  <input type="checkbox" class="cb"
                    .checked=${this.data.use_exit_delay}
                    ?disabled=${this.data.always_on}
                    @change=${e=>this._SetData({use_exit_delay:e.target.checked})} />
                </hm-settings-row>

                ${this.data.type==Vs.Motion&&this.data.use_exit_delay?Z`
                      <hm-settings-row .narrow=${this.narrow} nested>
                        <span slot="heading">
                          ${us("panels.sensors.cards.editor.fields.allow_open.heading",this.hass.language)}
                        </span>
                        <span slot="description">
                          ${us("panels.sensors.cards.editor.fields.allow_open.description",this.hass.language)}
                        </span>

                        <input type="checkbox" class="cb"
                          .checked=${this.data.allow_open}
                          ?disabled=${this.data.always_on||this.data.arm_on_close}
                          @change=${e=>this._SetData({allow_open:e.target.checked})} />
                      </hm-settings-row>
                    `:""}
              `:""}
          ${!this.data.type||[Vs.Window,Vs.Door,Vs.Motion,Vs.Other].includes(this.data.type)?Z`
                <hm-settings-row .narrow=${this.narrow}>
                  <span slot="heading">
                    ${us("panels.sensors.cards.editor.fields.use_entry_delay.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${us("panels.sensors.cards.editor.fields.use_entry_delay.description",this.hass.language)}
                  </span>

                  <input type="checkbox" class="cb"
                    .checked=${this.data.use_entry_delay}
                    ?disabled=${this.data.always_on}
                    @change=${e=>this._SetData({use_entry_delay:e.target.checked})} />
                </hm-settings-row>
              `:""}


          ${this.data.type&&![Vs.Window,Vs.Door,Vs.Motion,Vs.Other].includes(this.data.type)||!this.data.use_entry_delay?"":Z`
                <hm-settings-row .narrow=${this.narrow} nested>
                  <span slot="heading">
                    ${us("panels.sensors.cards.editor.fields.entry_delay.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${us("panels.sensors.cards.editor.fields.entry_delay.description",this.hass.language)}
                  </span>

                  <hm-duration-picker
                    .hass=${this.hass}
                    max="900"
                    placeholder="-"
                    ?disabled=${!ta(this.data.entry_delay)}
                    value=${this.data.entry_delay}
                    @value-changed=${e=>this._SetData({entry_delay:e.detail.value})}
                  ></hm-duration-picker>
                </hm-settings-row>
              `}

          ${!this.data.type||[Vs.Window,Vs.Door,Vs.Motion,Vs.Other].includes(this.data.type)?Z`
                <hm-settings-row .narrow=${this.narrow}>
                  <span slot="heading">
                    ${us("panels.sensors.cards.editor.fields.delay_on.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${us("panels.sensors.cards.editor.fields.delay_on.description",this.hass.language)}
                  </span>

                  <hm-duration-picker
                    .hass=${this.hass}
                    max="300"
                    step="5"
                    placeholder="-"
                    ?disabled=${!ta(this.data.delay_on)}
                    value=${this.data.delay_on}
                    @value-changed=${e=>this._SetData({delay_on:e.detail.value})}
                  ></hm-duration-picker>
                </hm-settings-row>
              `:""}

          ${!this.data.type||[Vs.Door,Vs.Other].includes(this.data.type)?Z`
                <hm-settings-row .narrow=${this.narrow}>
                  <span slot="heading">
                    ${us("panels.sensors.cards.editor.fields.arm_on_close.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${us("panels.sensors.cards.editor.fields.arm_on_close.description",this.hass.language)}
                  </span>

                  <input type="checkbox" class="cb"
                    .checked=${this.data.arm_on_close}
                    ?disabled=${this.data.always_on}
                    @change=${e=>this._SetData({arm_on_close:e.target.checked})} />
                </hm-settings-row>
              `:""}
          ${!this.data.type||[Vs.Window,Vs.Door,Vs.Other].includes(this.data.type)?Z`
                <hm-settings-row .narrow=${this.narrow}>
                  <span slot="heading">
                    ${us("panels.sensors.cards.editor.fields.auto_bypass.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${us("panels.sensors.cards.editor.fields.auto_bypass.description",this.hass.language)}
                  </span>

                  <input type="checkbox" class="cb"
                    .checked=${this.data.auto_bypass}
                    ?disabled=${this.data.always_on}
                    @change=${e=>this._SetData({auto_bypass:e.target.checked})} />
                </hm-settings-row>

                ${this.data.auto_bypass?Z`
                      <hm-settings-row .narrow=${this.narrow} .large=${this.modesByArea(this.data.area).length>2} nested>
                        <span slot="heading">
                          ${us("panels.sensors.cards.editor.fields.auto_bypass.modes",this.hass.language)}
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
                                  .path=${Rs[Object.entries(Ws).find(([,t])=>t==e)[0]]}
                                ></ha-svg-icon>
                                ${us(`common.modes_short.${e}`,this.hass.language)}
                              </ha-button>
                            `)}
                        </div>
                      </hm-settings-row>
                    `:""}
              `:""}

        ${!this.data.type||[Vs.Window,Vs.Door,Vs.Other].includes(this.data.type)?Z`
              <hm-settings-row .narrow=${this.narrow}>
                <span slot="heading">
                  ${us("panels.sensors.cards.editor.fields.allow_open.heading",this.hass.language)}
                </span>
                <span slot="description">
                  ${us("panels.sensors.cards.editor.fields.allow_open.description",this.hass.language)}
                </span>

                <input type="checkbox" class="cb"
                  .checked=${this.data.allow_open}
                  ?disabled=${this.data.always_on||this.data.arm_on_close}
                  @change=${e=>this._SetData({allow_open:e.target.checked})} />
              </hm-settings-row>
            `:""}

          <hm-settings-row .narrow=${this.narrow}>
            <span slot="heading">
              ${us("panels.sensors.cards.editor.fields.trigger_unavailable.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${us("panels.sensors.cards.editor.fields.trigger_unavailable.description",this.hass.language)}
            </span>

            <input type="checkbox" class="cb"
              .checked=${this.data.trigger_unavailable}
              @change=${e=>this._SetData({trigger_unavailable:e.target.checked})} />
          </hm-settings-row>
        </hm-collapsible-section>

        <div class="card-actions">
          <ha-button appearance="plain" @click=${this.saveClick}>
            ${this.hass.localize("ui.common.save")}
          </ha-button>

          <ha-button appearance="plain" variant="danger" @click=${this.deleteClick}>
            ${us("panels.sensors.cards.editor.actions.remove",this.hass.language)}
          </ha-button>
        </div>
      </ha-card>
    `;var t;}modesByArea(e){const t=Object.keys(this.areas).reduce((e,t)=>Object.assign(e,{[t]:Object.entries(this.areas[t].modes).filter(([,e])=>e.enabled).map(([e])=>e)}),{});return e?t[e]:Object.values(t).reduce((e,t)=>e.filter(e=>t.includes(e)));}_SetData(e){if(this.data)for(const[t,s]of Object.entries(e))switch(t){case"always_on":this.data=Object.assign(Object.assign({},this.data),{always_on:1==s}),s&&(this.data=Object.assign(Object.assign({},this.data),{arm_on_close:!1,use_exit_delay:!1,use_entry_delay:!1,allow_open:!1,auto_bypass:!1}));break;case"use_entry_delay":this.data=Object.assign(Object.assign({},this.data),{use_entry_delay:1==s});break;case"use_exit_delay":this.data=Object.assign(Object.assign({},this.data),{use_exit_delay:1==s}),this.data.type!==Vs.Motion||s||(this.data=Object.assign(Object.assign({},this.data),{allow_open:!1}));break;case"arm_on_close":this.data=Object.assign(Object.assign({},this.data),{arm_on_close:1==s}),s&&(this.data=Object.assign(Object.assign({},this.data),{always_on:!1,allow_open:!1}));break;case"allow_open":this.data=Object.assign(Object.assign({},this.data),{allow_open:1==s}),s&&(this.data=Object.assign(Object.assign({},this.data),{arm_on_close:!1,always_on:!1}));break;case"auto_bypass":this.data=Object.assign(Object.assign({},this.data),{auto_bypass:1==s}),s&&(this.data=Object.assign(Object.assign({},this.data),{always_on:!1}));break;case"trigger_unavailable":this.data=Object.assign(Object.assign({},this.data),{trigger_unavailable:1==s});break;case"entry_delay":this.data=Object.assign(Object.assign({},this.data),{entry_delay:s});break;case"delay_on":this.data=Object.assign(Object.assign({},this.data),{delay_on:s});}}setMode(e){this.data&&(this.data=Object.assign(Object.assign({},this.data),{modes:this.data.modes.includes(e)?Xs(this.data.modes,e):Js(this.data.modes.concat([e]))}));}setBypassMode(e){this.data&&(this.data=Object.assign(Object.assign({},this.data),{auto_bypass_modes:this.data.auto_bypass_modes.includes(e)?Xs(this.data.auto_bypass_modes,e):Js(this.data.auto_bypass_modes.concat([e]))}));}setType(e){if(!this.data)return;const t=e!=Vs.Other?yi(this.modesByArea(this.data.area))[e]:{};this.data=Object.assign(Object.assign(Object.assign({},this.data),{type:e}),t);}deleteClick(e){var t,s;(t=this.hass,s=this.item,t.callApi("POST","house_modes/sensors",{entity_id:s,remove:!0})).catch(t=>ia(t,e)).then(()=>{this.cancelClick();});}saveClick(e){if(!this.data)return;const t=[];this.data.new_entity_id&&this.data.new_entity_id==this.data.entity_id&&(this.data=ea(this.data,"new_entity_id")),this.data=Object.assign(Object.assign({},this.data),{auto_bypass_modes:this.data.auto_bypass_modes.filter(e=>this.data.modes.includes(e))}),this.data.area||t.push(us("panels.sensors.cards.editor.errors.no_area",this.hass.language)),this.data.modes.length||this.data.always_on||t.push(us("panels.sensors.cards.editor.errors.no_modes",this.hass.language)),this.data.auto_bypass&&!this.data.auto_bypass_modes.length&&t.push(us("panels.sensors.cards.editor.errors.no_auto_bypass_modes",this.hass.language)),t.length?aa(e,Z`
          ${us("panels.sensors.cards.editor.errors.description",this.hass.language)}
          <ul>
            ${t.map(e=>Z`
                  <li>${e}</li>
                `)}
          </ul>
        `):Ce(this.hass,Object.assign({},this.data)).catch(t=>ia(t,e)).then(()=>{this.cancelClick();});}cancelClick(){la(0,ga("sensors"),!0);}manageGroupsClick(e){const t=e.target;Zs(t,"show-dialog",{dialogTag:"hm-manage-sensor-groups-dialog",dialogImport:()=>Promise.resolve().then(function(){return Oi;}),dialogParams:{}});}getSensorGroups(){return Object.keys(this.sensorGroups).map(e=>Object({value:e,name:this.sensorGroups[e].name}));}};Si.styles=pa,i([ye()],Si.prototype,"hass",void 0),i([ye()],Si.prototype,"narrow",void 0),i([ye()],Si.prototype,"item",void 0),i([ye()],Si.prototype,"data",void 0),i([ye()],Si.prototype,"showBypassModes",void 0),i([be()],Si.prototype,"entityIdUnlocked",void 0),Si=i([me("hm-sensor-editor-card")],Si);const Ci=e=>Object.keys(e.modes).filter(t=>e.modes[t].enabled),ji=e=>{let t=[];return Object.values(e).forEach(e=>{t=[...t,...Ci(e)];}),t=Js(t),t.sort((e,t)=>{const s=Object.values(Ws),a=s.findIndex(t=>t==e),i=s.findIndex(e=>e==t);return a-i;}),t;},Ei="no_area";let Mi=class extends ze(pe){hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"house_modes_config_updated"})];}async _fetchData(){this.hass&&(this.areas=await Le(this.hass),this.sensors=await ke(this.hass));}async firstUpdated(){this.path&&2==this.path.length&&"filter"==this.path[0]&&(this.selectedArea=this.path[1]);}shouldUpdate(e){const t=e.get("hass");return!t||1!=e.size||!this.sensors||Object.keys(this.sensors).some(e=>t.states[e]!==this.hass.states[e]);}render(){return this.hass&&this.areas&&this.sensors?Z`
      <ha-card>${Sa(us("panels.sensors.title",this.hass.language),"legacy")}
        <div class="card-content">
          ${us("panels.sensors.cards.sensors.description",this.hass.language)}
        </div>

        <hm-table
          .hass=${this.hass}
          ?selectable=${!0}
          .columns=${this.tableColumns()}
          .data=${this.getTableData()}
          .filters=${this.getTableFilterOptions()}
          @row-click=${e=>la(0,ga("sensors",{params:{edit:e.detail.id}}),!0)}
        >
          ${us("panels.sensors.cards.sensors.table.no_items",this.hass.language)}
        </hm-table>
      </ha-card>
    `:Z``;}tableColumns(){const e=(...e)=>e.map(e=>e.replace(".","_")).join("_");return{icon:{width:"40px",renderer:t=>{const s=this.hass.states[t.entity_id],a=Object.keys(Vs).find(e=>Vs[e]==t.type),i=s?"on"===s.state?Fs[a]:Us[a]:"M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z";return t.area==Ei?Z`
              <ha-icon icon="mdi:alert" style="color: var(--error-color)" id="${e(t.entity_id,"icon")}"></ha-icon>
              <ha-tooltip for="${e(t.entity_id,"icon")}">${us("panels.sensors.cards.sensors.table.no_area_warning",this.hass.language)}</ha-tooltip>
            `:Z`
              <ha-svg-icon .path=${i} class="${t.enabled?"":"disabled"}" id="${e(t.entity_id,"icon")}"></ha-svg-icon>
              <ha-tooltip for="${e(t.entity_id,"icon")}">${s?us(`panels.sensors.cards.editor.fields.device_type.choose.${t.type}.name`,this.hass.language):this.hass.localize("state_badge.default.entity_not_found")}</ha-tooltip>
            `;}},name:{title:this.hass.localize("ui.components.entity.entity-picker.entity"),width:"60%",grow:!0,text:!0,renderer:t=>Z`
          <span class="${t.enabled?"":"disabled"}" id="${e(t.entity_id,"name")}">
            ${t.name}
          </span>
          ${t.area==Ei?Z`<ha-tooltip for="${e(t.entity_id,"name")}">${us("panels.sensors.cards.sensors.table.no_area_warning",this.hass.language)}</ha-tooltip>`:K}
          <span class="secondary ${t.enabled?"":"disabled"}" id="${e(t.entity_id,"name","secondary")}">
            ${t.entity_id}
          </span>
          ${t.area==Ei?Z`<ha-tooltip for="${e(t.entity_id,"name","secondary")}">${us("panels.sensors.cards.sensors.table.no_area_warning",this.hass.language)}</ha-tooltip>`:K}
        `},modes:{title:us("panels.sensors.cards.sensors.table.arm_modes",this.hass.language),width:"25%",hide:this.narrow,text:!0,renderer:t=>Z`
          <span class="${t.enabled?"":"disabled"}" id="${e(t.entity_id,"modes")}">
            ${t.always_on?us("panels.sensors.cards.sensors.table.always_on",this.hass.language):t.modes.length?t.modes.map(e=>us(`common.modes_short.${e}`,this.hass.language)).join(", "):this.hass.localize("state_attributes.climate.preset_mode.none")}
          </span>
          ${t.area==Ei?Z`<ha-tooltip for="${e(t.entity_id,"modes")}">${us("panels.sensors.cards.sensors.table.no_area_warning",this.hass.language)}</ha-tooltip>`:K}
        `},enabled:{title:us("common.enabled",this.hass.language),width:"68px",align:"center",renderer:e=>Z`
          <input type="checkbox" class="cb"
            @click=${e=>e.stopPropagation()}
            .checked=${e.enabled}
            @change=${t=>this.toggleEnabled(t,e.entity_id)} />
        `}};}getTableData(){const e=Object.keys(this.sensors).map(e=>{const t=this.hass.states[e],s=this.sensors[e],a=s.area?Ci(this.areas[s.area]):ji(this.areas),i=Object.assign(Object.assign({},s),{id:e,name:Ks(t),modes:s.always_on?a:s.modes.filter(e=>a.includes(e)),warning:!s.area,area:s.area||Ei});return i;});return e.sort(ra),e;}toggleEnabled(e,t){const s=e.target.checked;Ce(this.hass,{entity_id:t,enabled:s}).catch(t=>ia(t,e)).then();}removeCustomName(e){const t={entity_id:e,name:""};Ce(this.hass,t);}getTableFilterOptions(){let e=Object.values(this.areas).map(e=>Object({value:e.area_id,name:e.name,badge:t=>t.filter(t=>t.area==e.area_id).length})).sort(ra);Object.values(this.sensors).filter(e=>!e.area).length&&(e=[{value:Ei,name:this.hass.localize("state_attributes.climate.preset_mode.none"),badge:e=>e.filter(e=>e.area==Ei).length},...e]);const t=ji(this.areas).map(e=>Object({value:e,name:us(`common.modes_short.${e}`,this.hass.language),badge:t=>t.filter(t=>t.modes.includes(e)).length}));return{area:{name:us("components.table.filter.item",this.hass.language,"name",us("panels.actions.cards.new_action.fields.area.heading",this.hass.language)),items:e,value:this.selectedArea?[this.selectedArea]:[]},modes:{name:us("components.table.filter.item",this.hass.language,"name",us("panels.actions.cards.new_action.fields.mode.heading",this.hass.language)),items:t,value:this.selectedMode?[this.selectedMode]:[]}};}};Mi.styles=pa,i([ye()],Mi.prototype,"hass",void 0),i([ye()],Mi.prototype,"narrow",void 0),i([ye()],Mi.prototype,"areas",void 0),i([ye()],Mi.prototype,"sensors",void 0),i([ye()],Mi.prototype,"selectedArea",void 0),i([ye()],Mi.prototype,"selectedMode",void 0),i([ye()],Mi.prototype,"path",void 0),Mi=i([me("hm-sensors-overview-card")],Mi);let Hi=class extends ze(pe){constructor(){super(...arguments),this.addSelection=[],this.areas={},this.sensors={};}hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"house_modes_config_updated"})];}async _fetchData(){this.hass&&(this.areas=await Le(this.hass));}async firstUpdated(){this.areas=await Le(this.hass),this.sensors=await ke(this.hass);}render(){const e={checkbox:{width:"48px",renderer:e=>Z`
          <ha-checkbox
            @change=${t=>this.toggleSelect(t,e.id)}
            ?checked=${this.addSelection.includes(e.id)}
          ></ha-checkbox>
        `},icon:{width:"40px",renderer:e=>Z`
          <state-badge .hass=${this.hass} .stateObj=${this.hass.states[e.id]}></state-badge>
        `},name:{title:this.hass.localize("ui.components.entity.entity-picker.entity"),width:"40%",grow:!0,text:!0,renderer:e=>Z`
          ${Ys(e.name)}
          <span class="secondary">${e.id}</span>
        `},type:{title:us("panels.sensors.cards.add_sensors.table.type",this.hass.language),width:"40%",hide:this.narrow,text:!0,renderer:e=>e.type?us(`panels.sensors.cards.editor.fields.device_type.choose.${e.type}.name`,this.hass.language):this.hass.localize("state.default.unknown")}},t=fi(this.hass,Object.keys(this.sensors),!0).map(e=>Object.assign(Object.assign({},e),{type:vi(this.hass.states[e.id]),isSupportedType:void 0!==vi(this.hass.states[e.id])?"true":"false"}));return Z`
      <ha-card>${Sa(us("panels.sensors.cards.add_sensors.title",this.hass.language),"picker")}
        <div class="card-content">
          ${us("panels.sensors.cards.add_sensors.description",this.hass.language)}
        </div>

        <hm-table
          .hass=${this.hass}
          .columns=${e}
          .data=${t}
          .filters=${this.getTableFilterOptions()}
        >
          ${us("panels.sensors.cards.add_sensors.no_items",this.hass.language)}
        </hm-table>

        <div class="card-actions">
          <ha-button appearance="plain" @click=${this.addSelected} ?disabled=${0==this.addSelection.length}>
            ${us("panels.sensors.cards.add_sensors.actions.add_to_alarm",this.hass.language)}
          </ha-button>
        </div>
      </ha-card>
    `;}toggleSelect(e,t){const s=e.target.checked;this.addSelection=s&&!this.addSelection.includes(t)?[...this.addSelection,t]:s?this.addSelection:this.addSelection.filter(e=>e!=t);}addSelected(e){if(!this.hass)return;const t=Object.values(this.areas).map(e=>Object.entries(e.modes).filter(([,e])=>e.enabled).map(([e])=>e)).reduce((e,t)=>e.filter(e=>t.includes(e))),s=this.addSelection.map(e=>bi(this.hass.states[e],t)).map(e=>1==Object.keys(this.areas).length?Object.assign(e,{area:Object.keys(this.areas)[0]}):e).filter(e=>e);s.forEach(t=>{Ce(this.hass,t).catch(t=>ia(t,e)).then();}),this.addSelection=[];}getTableFilterOptions(){return{isSupportedType:{name:us("panels.sensors.cards.add_sensors.actions.filter_supported",this.hass.language),items:[{value:"true",name:"true"}],value:["true"],binary:!0}};}};Hi.styles=pa,i([ye()],Hi.prototype,"hass",void 0),i([ye()],Hi.prototype,"narrow",void 0),i([ye()],Hi.prototype,"addSelection",void 0),i([ye()],Hi.prototype,"areas",void 0),i([ye()],Hi.prototype,"sensors",void 0),Hi=i([me("hm-add-sensors-card")],Hi);let Li=class extends pe{firstUpdated(){(async()=>{await $e();})();}render(){var e,t;if(!this.hass)return Z``;if(this.path.params.edit)return Z`
        <hm-sensor-editor-card
          .hass=${this.hass}
          .narrow=${this.narrow}
          .item=${this.path.params.edit}
        ></hm-sensor-editor-card>
      `;{const s=null===(e=this.path.filter)||void 0===e?void 0:e.area,a=null===(t=this.path.filter)||void 0===t?void 0:t.mode;return Z`
        <hm-sensors-overview-card
          .hass=${this.hass}
          .narrow=${this.narrow}
          .selectedArea=${s}
          .selectedMode=${a}
        ></hm-sensors-overview-card>
        <hm-add-sensors-card .hass=${this.hass} .narrow=${this.narrow}></hm-add-sensors-card>
      `;}}};i([ye()],Li.prototype,"hass",void 0),i([ye()],Li.prototype,"narrow",void 0),i([ye()],Li.prototype,"path",void 0),Li=i([me("hm-view-sensors")],Li);const Ti=["manual","automation","schedule","presence_away","presence_home","lock","panel_keypad","timer"],zi={manual:"Manual (dashboard / you)",automation:"Automations (other)",schedule:"Schedule",presence_away:"Presence: everyone left",presence_home:"Presence: someone home",lock:"Lock keypad",panel_keypad:"Alarm panel keypad",timer:"House Mode timers"},Pi=["armed_away","armed_home","armed_night","armed_vacation","armed_custom_bypass","disarmed"],Ni=e=>e.enabled?"shadow"===e.run_mode?"shadow":"live":"off",Di=e=>e.callWS({type:"house_modes/ext/house/get"}),Ri=e=>e.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,32)||"mode",Bi=e=>{var t;const s=e.trim().toLowerCase();return(null===(t=[[/vacation|holiday|travel/,"mdi:shield-airplane"],[/disarm|^off$|wake|^day/,"mdi:shield-lock-open-outline"],[/away|out|leave/,"mdi:shield-lock"],[/sleep|night|bed/,"mdi:bed"],[/stay|home/,"mdi:shield-home"],[/spa|bypass|custom|pool|hot.?tub/,"mdi:hot-tub"],[/guest|party|visitor|clean/,"mdi:account-group"],[/local/,"mdi:map-marker-radius"]].find(([e])=>e.test(s)))||void 0===t?void 0:t[1])||"mdi:home";},Ii=e=>{var t;const s=e.trim().toLowerCase();return(null===(t=[[/late.?night/,"#00bfff"],[/vacation|holiday|travel/,"#dc143c"],[/disarm|^off$|wake|^day/,"#008000"],[/away|out|leave/,"#ff0000"],[/sleep|night|bed/,"#5d5df4"],[/stay|home/,"#ffa500"],[/spa|bypass|custom|pool|hot.?tub/,"#00a8a8"],[/guest|party|visitor|clean/,"#990099"],[/local/,"#7bb314"]].find(([e])=>e.test(s)))||void 0===t?void 0:t[1])||"#808080";},Vi={green:"#008000",red:"#ff0000",orange:"#ffa500",magenta:"#ff00ff",purple:"#800080",cyan:"#00ffff",midnightblue:"#191970",deepskyblue:"#00bfff",crimson:"#dc143c",blue:"#0000ff",yellow:"#ffff00",gray:"#808080",grey:"#808080",white:"#ffffff",black:"#000000",pink:"#ffc0cb"},Ui=(e,t)=>{let s=Ri(e),a=2;for(;t.some(e=>e.id===s);)s=`${Ri(e).slice(0,29)}_${a++}`;return{id:s,name:e,icon:Bi(e),targets:{},enter_sources:[...Ti],leave_sources:[...Ti],delay_sources:{},readiness:{entities:[],labels:[],action:"warn"},on_failure:"undo",timers:[],steps:[]};},Fi=(e,t,s)=>{const a=Object.entries(e.targets).map(([e,a])=>`${t[e]||e}: ${s(a)}`);return a.length?a.join(" · "):"no partition changes";},Gi=e=>{var t;return(null===(t=e.split(".",2)[1])||void 0===t?void 0:t.startsWith("hm_"))||!1;},Wi=e=>Object.keys(e.states).filter(e=>e.startsWith("script.")).sort((e,t)=>Number(Gi(t))-Number(Gi(e))||e.localeCompare(t)),qi=(e,t)=>[`${e.at?`at ${e.at}`:`after ${e.after_minutes} min`} → ${"previous"===e.then?"the previous mode":t(e.then)}`,e.from_modes.length?`only from ${e.from_modes.map(t).join(", ")}`:"",e.window_start||e.window_end?`${e.window_start||"00:00"}–${e.window_end||"24:00"}`:""].filter(Boolean).join(" · "),Zi=(e,t)=>e.entity_id===t.entity_id&&e.when===t.when&&e.phase===t.phase,Yi=(e,t)=>Object.assign(Object.assign({},e),{modes:e.modes.map(e=>Object.assign(Object.assign({},e),{steps:t(e,(e.steps||[]).map(e=>Object.assign(Object.assign({},e),{modes:[...e.modes]})))}))}),Ki=(e,t,s)=>Yi(e,(e,a)=>{const i=a.some(e=>Zi(e,t));return s.includes(e.id)&&!i?[...a,{entity_id:t.entity_id,when:t.when,phase:t.phase,modes:[],wait:!1}]:!s.includes(e.id)&&i?a.filter(e=>!Zi(e,t)):a;}),Ji=e=>{const t=[],s=new Map(e.map(e=>[e.id,e]));for(const a of e){a.timers.length&&!a.leave_sources.includes("timer")&&t.push({mode:a.id,text:`${a.name}: its timers never fire, because ${a.name} doesn't allow House Mode timers to exit (Allowed Sources, May Exit).`});for(const e of a.timers){const i="previous"===e.then?null:s.get(e.then);e.then===a.id?t.push({mode:a.id,text:`${a.name}: a timer goes to ${a.name} itself.`}):i&&!i.enter_sources.includes("timer")&&t.push({mode:a.id,text:`${a.name}: the timer to ${i.name} is blocked, because ${i.name} doesn't allow House Mode timers to enter (Allowed Sources, May Enter).`});for(const i of e.from_modes)s.has(i)?i===a.id&&t.push({mode:a.id,text:`${a.name}: a timer's "only when coming from" names ${a.name} itself, which can never come first.`}):t.push({mode:a.id,text:`${a.name}: a timer's "only when coming from" names a mode that no longer exists (${i}).`});if(i&&i.id!==a.id&&!e.window_start&&!e.window_end){const e=i.timers.some(e=>e.then===a.id&&!e.window_start&&!e.window_end);e&&a.id<i.id&&t.push({mode:a.id,text:`${a.name} and ${i.name} have timers that go to each other, so the mode can keep switching between them.`});}}}return t;},Xi={in_sync:"Slot = User Code",different:"Slot ≠ User Code",empty:"Slot Empty",unknown:"Not readable",user_disabled:"User disabled, code still in slot",no_user:"User removed"},Qi={in_sync:"var(--success-color, #43a047)",different:"var(--warning-color, #ffa600)",empty:"var(--warning-color, #ffa600)",unknown:"var(--secondary-text-color)",user_disabled:"var(--error-color, #f44336)",no_user:"var(--error-color, #f44336)"},en={code_slots:"Code slots (User Code)",user_credential:"Lock users (User Credential)",unknown:"Codes not readable"},tn=e=>e.callWS({type:"house_modes/ext/locks/get"}),sn=(e,t)=>e.callWS({type:"house_modes/ext/locks/read",entity_id:t}),an=(e,t,s,a)=>e.callWS({type:"house_modes/ext/locks/link",entity_id:t,slot:s,user_id:a}),nn=(e,t,s=!1)=>e.callWS({type:"house_modes/ext/locks/clear",user_id:t,unlink:s}),on=(e,t)=>e.callWS({type:"house_modes/ext/locks/user",user_id:t}),rn=e=>!e||!e.house_mode&&!Object.keys(e.targets||{}).length,ln=e=>e.filter(e=>e.in_use&&e.readable&&!e.user_id),cn=(e,t)=>{if(!e||rn(t))return[];if(!e.enabled)return["The user is disabled: nothing will happen."];const s=[];return Object.keys(t.targets).forEach(a=>{const i=t.targets[a];e.area_limit.length&&!e.area_limit.includes(a)?s.push("Partition target: partition not allowed for this user."):"disarmed"!==i||e.can_disarm?"disarmed"===i||e.can_arm||s.push("Partition target: the user may not arm (Can arm is off)."):s.push("Partition target: the user may not disarm (Can disarm is off).");}),s.filter((e,t)=>s.indexOf(e)===t);},dn=(e,t,s)=>e.callWS(Object.assign({type:"house_modes/ext/locks/sync_user",user_id:t},s?{code:s}:{}));let hn=class extends pe{constructor(){super(...arguments),this.entityId="",this.slotNo=0,this.userId="",this.code=null,this.msg="";}disconnectedCallback(){super.disconnectedCallback(),this.hide();}hide(){window.clearTimeout(this.timer),this.code=null,this.msg="";}async show(){if(this.code)return this.hide();this.msg="…";try{const s=this.userId?await(e=this.hass,t=this.userId,e.callWS({type:"house_modes/ext/user/reveal",user_id:t})):await((e,t,s)=>e.callWS({type:"house_modes/ext/locks/reveal",entity_id:t,slot:s}))(this.hass,this.entityId,this.slotNo);s.code?(this.code=s.code,this.msg="",this.timer=window.setTimeout(()=>this.hide(),3e4)):this.msg=this.userId?"only shown when a linked lock slot holds it":"not readable";}catch(e){this.msg=ba(e);}var e,t;}render(){return Z`<button
        title=${this.code?"Hide the code":"Show the code (30 s)"}
        aria-label=${this.code?"Hide code":this.userId?"Show the user code":`Show code of slot ${this.slotNo}`}
        @click=${this.show}
      ><ha-icon icon=${this.code?"mdi:eye-off-outline":"mdi:eye-outline"}></ha-icon></button
      ><span class=${this.code?"code":"msg"}>${this.code?this.code:this.msg||"••••"}</span>`;}};hn.styles=h`
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
  `,i([ye({attribute:!1})],hn.prototype,"hass",void 0),i([ye()],hn.prototype,"entityId",void 0),i([ye({type:Number})],hn.prototype,"slotNo",void 0),i([ye()],hn.prototype,"userId",void 0),i([be()],hn.prototype,"code",void 0),i([be()],hn.prototype,"msg",void 0),hn=i([me("hm-reveal-code")],hn);const pn={armed_away:"Away",armed_home:"Home (Stay)",armed_night:"Night",armed_vacation:"Vacation",armed_custom_bypass:"Custom",disarmed:"Disarm"};let un=class extends pe{constructor(){super(...arguments),this.modes=[],this.houseEnabled=!1,this.partitions=[],this.label="",this.disabled=!1;}emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e}}));}render(){const e=this.action||{house_mode:null,targets:{}};return Z`
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
        ${e.house_mode&&!this.houseEnabled?Z`<span class="warn">House Modes are off, so this part does nothing.</span>`:K}
        ${this.partitions.map(t=>Z`<label
            >${t.name}
            <select
              aria-label=${`${this.label}: ${t.name}`}
              @change=${s=>this.emit(((e,t,s)=>{const a=Object.assign({},e&&e.targets||{});return s?a[t]=s:delete a[t],{house_mode:e&&e.house_mode||null,targets:a};})(e,t.key,s.target.value))}
            >
              <option value="" ?selected=${!e.targets[t.key]}>${e.house_mode?"as the House Mode sets it":"leave unchanged"}</option>
              ${Pi.map(s=>Z`<option value=${s} ?selected=${e.targets[t.key]===s}>${pn[s]}</option>`)}
            </select>
          </label>`)}
      </fieldset>
    `;}};un.styles=[wa,h`
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
  `],i([ye({attribute:!1})],un.prototype,"action",void 0),i([ye({attribute:!1})],un.prototype,"modes",void 0),i([ye({type:Boolean})],un.prototype,"houseEnabled",void 0),i([ye({attribute:!1})],un.prototype,"partitions",void 0),i([ye()],un.prototype,"label",void 0),i([ye({type:Boolean})],un.prototype,"disabled",void 0),un=i([me("hm-keypad-action")],un);let mn=class extends pe{constructor(){super(...arguments),this.pushOnSave=!0,this.embedded=!1,this.links=[],this.draft={},this.locks=[],this.reads={},this.taken={},this.users=[],this.pickLock="",this.pickSlot="",this.error="",this.loading=!0,this.writing=!1;}async writeNow(){if(this.userId){this.writing=!0,this.error="";try{const e=await dn(this.hass,this.userId);if(e.needs_code)this.error="No linked slot holds this user's code yet. Use Change code above; the new code is written to the slots on Save.";else{const t=e.results.filter(e=>"error"===e.result);t.length&&(this.error=t.map(e=>`${e.entity_id} slot ${e.slot}: ${e.error}`).join("; "));}await new Promise(e=>setTimeout(e,4e3)),await this.recheck();}catch(e){this.error=ba(e);}finally{this.writing=!1;}}}async recheck(){if(!this.userId)return;const e=await on(this.hass,this.userId),t=this.links.filter(e=>e.pending);this.links=[...e.links.map(e=>({entity_id:e.entity_id,slot:e.slot,status:e.status})),...t.filter(e=>"add"===e.pending)].map(e=>t.some(t=>"remove"===t.pending&&t.entity_id===e.entity_id&&t.slot===e.slot)?Object.assign(Object.assign({},e),{pending:"remove"}):e),this.reads={},this.pickLock&&this.readSlots(this.pickLock);}get linkCount(){return this.links.filter(e=>"remove"!==e.pending).length;}firstUpdated(){this.load();}async load(){var e;this.loading=!0;try{const[t,s]=await Promise.all([Di(this.hass),tn(this.hass)]);if(this.house=t,this.locks=s.locks,this.users=s.users,this.taken={},s.settings.links.forEach(e=>this.taken[`${e.entity_id}:${e.slot}`]=e.user_id),this.pickLock||(this.pickLock=(null===(e=s.locks[0])||void 0===e?void 0:e.entity_id)||""),this.userId){const e=await on(this.hass,this.userId);this.links=e.links.map(e=>({entity_id:e.entity_id,slot:e.slot,status:e.status})),this.draft=JSON.parse(JSON.stringify(e.actions||{})),this.user=s.users.find(e=>e.user_id===this.userId);}this.pickLock&&this.readSlots(this.pickLock),this.error="";}catch(e){this.error=ba(e);}finally{this.loading=!1;}}async readSlots(e){if(!this.reads[e])try{const t=await sn(this.hass,e);this.reads=Object.assign(Object.assign({},this.reads),{[e]:t});}catch(e){}}userName(e){var t;return(null===(t=this.users.find(t=>t.user_id===e))||void 0===t?void 0:t.name)||"another user";}addLink(){const e=parseInt(this.pickSlot,10);if(!(this.pickLock&&e>0))return;const t=this.links.find(t=>t.entity_id===this.pickLock&&t.slot===e);this.links=t?this.links.map(e=>e===t?Object.assign(Object.assign({},e),{pending:void 0}):e):[...this.links,{entity_id:this.pickLock,slot:e,pending:"add"}],this.pickSlot="";}removeLink(e){this.links="add"===e.pending?this.links.filter(t=>t!==e):this.links.map(t=>t===e?Object.assign(Object.assign({},t),{pending:"remove"}):t);}async applyAfterSave(e,t){const s=[];try{for(const e of this.links.filter(e=>"remove"===e.pending))await an(this.hass,e.entity_id,e.slot,null);for(const t of this.links.filter(e=>"add"===e.pending))await an(this.hass,t.entity_id,t.slot,e);if(await(a=this.hass,i=e,n=this.draft,a.callWS({type:"house_modes/ext/locks/actions",user_id:i,unlock:n.unlock||null,lock:n.lock||null})),this.pushOnSave&&this.linkCount){const a=await dn(this.hass,e,t);a.needs_code&&s.push("no linked slot holds this user's code yet, so it could not be copied: use Change code (the new code is written on Save)"),a.results.filter(e=>"error"===e.result).forEach(e=>s.push(`${e.entity_id} slot ${e.slot}: ${e.error}`));}}catch(e){s.push(ba(e));}var a,i,n;return s;}render(){var e,t,s;const a=((null===(e=this.house)||void 0===e?void 0:e.targets)||[]).filter(e=>"master"!==e.key),i=(null===(t=this.house)||void 0===t?void 0:t.settings.modes)||[],n=!!(null===(s=this.house)||void 0===s?void 0:s.settings.enabled),o=e=>{var t,s;return(null===(t=this.locks.find(t=>t.entity_id===e))||void 0===t?void 0:t.name)||(null===(s=this.hass.states[e])||void 0===s?void 0:s.attributes.friendly_name)||e;},r=this.reads[this.pickLock],l=(e,t)=>this.links.some(s=>s.entity_id===e&&s.slot===t&&"remove"!==s.pending),c=r?r.slots.filter(e=>!l(this.pickLock,e.slot)):[],d=this.permissions?Object.assign({user_id:this.userId||"",name:""},this.permissions):this.user,h=[...cn(d,this.draft.unlock),...cn(d,this.draft.lock)],p=Z`
        ${this.error?Z`<div class="notice error" style="margin:0 16px 12px">${this.error}</div>`:K}
        ${this.embedded?Z`<h4 class="subhead">Locks</h4>`:K}
        ${this.loading?Z`<div class="empty">Reading the locks…</div>`:Z`
              ${this.locks.length?Z`<div class="toolbar">
                    <label>Lock
                      <select @change=${e=>{this.pickLock=e.target.value,this.pickSlot="",this.readSlots(this.pickLock);}}>
                        ${this.locks.map(e=>Z`<option value=${e.entity_id} ?selected=${e.entity_id===this.pickLock}>${e.name}</option>`)}
                      </select>
                    </label>
                    <label>Slot
                      ${r&&r.slots.length?Z`<select @change=${e=>this.pickSlot=e.target.value}>
                            <option value="" ?selected=${!this.pickSlot}>choose…</option>
                            ${c.map(e=>{const t=this.taken[`${this.pickLock}:${e.slot}`],s=t&&t!==this.userId?`linked to ${this.userName(t)}`:e.in_use?"in use, no user":"empty";return Z`<option value=${e.slot} ?selected=${String(e.slot)===this.pickSlot}>${e.slot} (${s})</option>`;})}
                          </select>`:Z`<input type="number" min="1" max="250" style="width:80px" aria-label="Slot number" .value=${this.pickSlot}
                            @input=${e=>this.pickSlot=e.target.value} />`}
                    </label>
                    <ha-button appearance="plain" ?disabled=${!this.pickSlot} @click=${this.addLink}>
                      <ha-icon slot="start" icon="mdi:plus"></ha-icon>Add lock slot</ha-button>
                    <label><input type="checkbox" .checked=${this.pushOnSave} @change=${e=>this.pushOnSave=e.target.checked} />
                      On Save, write this user's code to the linked slots</label>
                    ${this.userId?Z`<ha-button appearance="plain" ?disabled=${this.writing} @click=${()=>this.recheck()}>
                          <ha-icon slot="start" icon="mdi:refresh"></ha-icon>Check the locks again</ha-button>`:K}
                  </div>`:Z`<div class="empty">No Z-Wave JS locks found.</div>`}
              ${this.links.length?Z`<div class="table-wrap"><table>
                    <thead><tr><th class="icon"></th><th>Lock</th><th>Slot</th><th>Code</th><th></th></tr></thead>
                    <tbody>${this.links.map(e=>{const t=this.taken[`${e.entity_id}:${e.slot}`],s="add"===e.pending?"new":"remove"===e.pending?"removed":"unchanged";return Z`<tr class=${"remove"===e.pending?"status-removed":""}>
                        <td class="icon">${Ea(this.hass,e.entity_id,s)}</td>
                        <td>${o(e.entity_id)}<span class="secondary">${e.entity_id}</span></td>
                        <td>${e.slot}</td>
                        <td>${"add"===e.pending?Z`<span class="secondary" style="display:inline">linked on Save${t&&t!==this.userId?` (moves it from ${this.userName(t)})`:""}</span>`:"remove"===e.pending?Z`<span class="secondary" style="display:inline">unlinked on Save (the code stays on the lock)</span>`:Z`<span style=${`color:${Qi[e.status||"unknown"]}`}>${Xi[e.status||"unknown"]}</span>
                                <div><hm-reveal-code .hass=${this.hass} .entityId=${e.entity_id} .slotNo=${e.slot}></hm-reveal-code></div>
                                ${e.status&&"in_sync"!==e.status&&"no_user"!==e.status?Z`<button class="link" ?disabled=${this.writing} @click=${this.writeNow}>${this.writing?"Writing…":"Write the user code"}</button>`:K}`}</td>
                        <td>${"remove"===e.pending?Z`<button class="link" @click=${()=>this.links=this.links.map(t=>t===e?Object.assign(Object.assign({},t),{pending:void 0}):t)}>undo</button>`:Z`<ha-icon-button .label=${"Unlink slot"} @click=${()=>this.removeLink(e)}><ha-icon icon="mdi:link-off"></ha-icon></ha-icon-button>`}</td>
                      </tr>`;})}</tbody>
                  </table></div>`:K}
              <div class="action-stack">
                <hm-keypad-action
                  .label=${"When this code unlocks a lock"}
                  .action=${this.draft.unlock}
                  .modes=${i}
                  .houseEnabled=${n}
                  .partitions=${a}
                  @value-changed=${e=>this.draft=Object.assign(Object.assign({},this.draft),{unlock:e.detail.value})}
                ></hm-keypad-action>
                <hm-keypad-action
                  .label=${"When this code locks a lock (keypad lock)"}
                  .action=${this.draft.lock}
                  .modes=${i}
                  .houseEnabled=${n}
                  .partitions=${a}
                  @value-changed=${e=>this.draft=Object.assign(Object.assign({},this.draft),{lock:e.detail.value})}
                ></hm-keypad-action>
              </div>
              ${h.map(e=>{const t=(e=>e.includes("may not disarm")?{can_disarm:!0}:e.includes("may not arm")?{can_arm:!0}:null)(e);return Z`<div class="notice warn" style="margin:0 16px 8px">${e} That part will be skipped.
                  ${t&&this.permissions?Z`<button class="link" @click=${()=>this.dispatchEvent(new CustomEvent("grant",{detail:Object.assign(Object.assign({},this.permissions),t)}))}>
                        Allow it (${t.can_arm?"arm":"disarm"} the alarm)</button>`:K}
                </div>`;})}
              <div class="secondary" style="padding:0 16px 12px">Saved with the user (Save below). Most locks only report the
                code for an unlock; Schlage's outside button locks without a code (set that per lock below the users).</div>
            `}
    `;return this.embedded?Z`<div class="sect">${p}</div>`:Z`<ha-card>${Sa("Lock codes and keypad actions","settings")}${p}</ha-card>`;}};mn.styles=[ka,h`
      :host([embedded]) {
        padding: 0;
      }
      :host([embedded]) .sect {
        border-top: 1px solid var(--divider-color);
        padding: 4px 0 4px;
      }
      :host([embedded]) .subhead {
        margin: 10px 12px 4px;
        color: var(--accent-color);
        text-transform: none;
        letter-spacing: 0;
        font-weight: 500;
        font-size: 14px;
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
    `],i([ye({attribute:!1})],mn.prototype,"hass",void 0),i([ye()],mn.prototype,"userId",void 0),i([ye({type:Boolean})],mn.prototype,"pushOnSave",void 0),i([ye({type:Boolean,reflect:!0})],mn.prototype,"embedded",void 0),i([ye({attribute:!1})],mn.prototype,"permissions",void 0),i([be()],mn.prototype,"links",void 0),i([be()],mn.prototype,"draft",void 0),i([be()],mn.prototype,"house",void 0),i([be()],mn.prototype,"user",void 0),i([be()],mn.prototype,"locks",void 0),i([be()],mn.prototype,"reads",void 0),i([be()],mn.prototype,"taken",void 0),i([be()],mn.prototype,"users",void 0),i([be()],mn.prototype,"pickLock",void 0),i([be()],mn.prototype,"pickSlot",void 0),i([be()],mn.prototype,"error",void 0),i([be()],mn.prototype,"loading",void 0),i([be()],mn.prototype,"writing",void 0),mn=i([me("hm-user-locks")],mn);const gn=[{id:"arm_disarm",label:"arm and disarm",hint:"a household member"},{id:"arm",label:"arm only",hint:"can lock up, but not turn the alarm off"},{id:"disarm",label:"disarm only",hint:"rarely needed"},{id:"none",label:"nothing (lock only)",hint:"the code works at the locks and for their keypad actions only"}];let vn=class extends pe{constructor(){super(...arguments),this.narrow=!1,this.data={enabled:!0,can_arm:!0,can_disarm:!0,is_override_code:!1,area_limit:[]},this.code="",this.repeatCode="",this.changeCode=!1,this.busy=!1,this.areas={},this.loaded=!1;}async firstUpdated(){if(this.users=await xe(this.hass),this.areas=await Le(this.hass),this.item&&this.users[this.item]){const e=this.users[this.item];this.data=Object.assign(Object.assign({},e),{area_limit:(e.area_limit||[]).filter(e=>e in this.areas)}),delete this.data.code;}this.changeCode=!this.item,this.loaded=!0;}get areaOptions(){return Object.values(this.areas).map(e=>({value:e.area_id,name:e.name})).sort(ra);}get lockCard(){var e;return null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("hm-user-locks");}set(e){this.data=Object.assign(Object.assign({},this.data),e);}render(){var e;if(!this.loaded)return Z``;const t=(e=>e.can_arm&&e.can_disarm?"arm_disarm":e.can_arm?"arm":e.can_disarm?"disarm":"none")(this.data),s=this.areaOptions.length>=2,a=this.data.area_limit||[];return Z`
      <div class="ed">
        <div class="ed-head">
          <div class="ed-title">${this.item?(null===(e=this.users[this.item])||void 0===e?void 0:e.name)||"User":"New user"}</div>
          <ha-icon-button .path=${$s} .label=${"Close"} @click=${this.cancelClick}></ha-icon-button>
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
            <span class="secondary" style="display:inline">a disabled user's code works nowhere (the alarm or the locks' keypad actions)</span>
          </div>
          ${this.changeCode?Z`<div class="field-row">
                  <label for="code">${this.item?"New code":"Code"}</label>
                  <input id="code" type="password" autocomplete="new-password" .value=${this.code} @input=${e=>this.code=e.target.value.trim()} />
                  <label for="code2">Repeat</label>
                  <input id="code2" type="password" autocomplete="new-password" .value=${this.repeatCode} @input=${e=>this.repeatCode=e.target.value.trim()} />
                  ${this.item?Z`<button class="link" @click=${()=>{this.changeCode=!1,this.code=this.repeatCode="";}}>keep the current code</button>`:K}
                </div>
                <div class="secondary" style="padding:0 6px">At least 4 characters; digits only for lock keypads. Codes are stored only hashed.</div>`:Z`<div class="field-row">
                <span>Code</span>
                <hm-reveal-code .hass=${this.hass} .userId=${this.item}></hm-reveal-code>
                <ha-button appearance="plain" @click=${()=>this.changeCode=!0}>Change code</ha-button>
              </div>`}
          <div class="field-row">
            <label for="access">With the alarm, this code can</label>
            <select id="access" @change=${e=>this.set((e=>({can_arm:"arm_disarm"===e||"arm"===e,can_disarm:"arm_disarm"===e||"disarm"===e}))(e.target.value))}>
              ${gn.map(e=>Z`<option value=${e.id} ?selected=${e.id===t}>${e.label}</option>`)}
            </select>
            <span class="secondary" style="display:inline">${gn.find(e=>e.id===t).hint}</span>
          </div>
          ${s&&"none"!==t?Z`<div class="field-row">
                <span>Partitions</span>
                ${this.areaOptions.map(e=>{const t=!a.length||a.includes(e.value);return Z`<label><input type="checkbox" .checked=${t} @change=${t=>this.toggleArea(e.value,t.target.checked)} />${e.name}</label>`;})}
              </div>`:K}
          <div class="field-row">
            <label><input type="checkbox" .checked=${!!this.data.is_override_code} @change=${e=>this.set({is_override_code:e.target.checked})} />
              Override code</label>
            <span class="secondary" style="display:inline">arms even with open zones (force arm)</span>
          </div>
        </div>

        <hm-user-locks
          embedded
          .hass=${this.hass}
          .userId=${this.item}
          .permissions=${{enabled:!1!==this.data.enabled,can_arm:!!this.data.can_arm,can_disarm:!!this.data.can_disarm,area_limit:a}}
          @grant=${e=>this.set(e.detail)}
        ></hm-user-locks>

        <div class="card-actions">
          <ha-button ?disabled=${this.busy} @click=${this.saveClick}>${this.busy?"Saving…":"Save"}</ha-button>
          <ha-button appearance="plain" @click=${this.cancelClick}>Cancel</ha-button>
          <span style="flex:1"></span>
          ${this.item?Z`<ha-icon-button class="ed-del" .label=${"Delete user"} title="Delete user" @click=${this.deleteClick}>
                <ha-icon icon="mdi:trash-can-outline"></ha-icon></ha-icon-button>`:K}
        </div>
      </div>
    `;}toggleArea(e,t){const s=this.areaOptions.map(e=>e.value);let a=this.data.area_limit&&this.data.area_limit.length?[...this.data.area_limit]:[...s];a=t?[...new Set([...a,e])]:a.filter(t=>t!==e),a.length&&this.set({area_limit:a.length===s.length?[]:a});}async deleteClick(e){if(!this.item)return;if(!confirm(`Delete ${this.data.name}?`))return;const t=this.lockCard;if(t&&t.linkCount&&confirm(`Also clear this user's code from ${t.linkCount} linked lock slot(s)? Cancel keeps the codes on the locks.`))try{await nn(this.hass,this.item,!0);}catch(t){ia(t,e);}Ee(this.hass,this.item).catch(t=>ia(t,e)).then(()=>this.cancelClick());}async saveClick(e){var t,s;const a=this.data;if(!a.name||!a.name.trim())return aa(e,"Enter a name.");if(this.changeCode){if(this.code.length<4)return aa(e,"The code needs at least 4 characters.");if(this.code!==this.repeatCode)return aa(e,"The two codes are different.");}const i=!(!this.item||!this.users)&&!1!==(null===(t=this.users[this.item])||void 0===t?void 0:t.enabled),n={name:a.name.trim(),enabled:!1!==a.enabled,can_arm:!!a.can_arm,can_disarm:!!a.can_disarm,is_override_code:!!a.is_override_code,area_limit:a.area_limit||[]};this.busy=!0;try{let t=this.item;if(t){const e=await je(this.hass,Object.assign(Object.assign({},n),{user_id:t}));if(!e||!e.success)throw new Error(e&&e.error||"unknown error");this.changeCode&&(await(o=this.hass,r=t,l=this.code,o.callWS({type:"house_modes/ext/user/set_code",user_id:r,code:l})));}else{const e=await je(this.hass,Object.assign(Object.assign({},n),{code:this.code}));if(!e||!e.success)throw new Error(e&&e.error||"unknown error");const a=await xe(this.hass);t=null===(s=Object.values(a).find(e=>e.name===n.name))||void 0===s?void 0:s.user_id;}const a=this.lockCard;if(t&&a){const s=i&&!1===n.enabled;s&&a.linkCount&&confirm(`This user is now disabled. Also clear the code from ${a.linkCount} linked lock slot(s)?`)&&(await nn(this.hass,t));const o=await a.applyAfterSave(t,!s&&this.changeCode?this.code:void 0);o.length&&aa(e,`Saved, but the locks were not all updated: ${o.join("; ")}`);}this.cancelClick();}catch(t){aa(e,ba(t));}finally{this.busy=!1;}var o,r,l;}cancelClick(){la(0,ga("codes"),!0);}static get styles(){return h`
      ${pa}
      ${ka}
      /* one compact panel with an accent outline (CARD_DESIGN_SYSTEM), like the other editors */
      :host {
        display: block;
        padding: 0;
      }
      .ed {
        border: 1px solid var(--accent-color);
        border-radius: 10px;
        padding: 4px 4px 4px;
      }
      .ed-head {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 4px 0 12px;
      }
      .ed-title {
        flex: 1 1 auto;
        color: var(--primary-color);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        font-weight: 600;
        font-size: 13px;
      }
      .ed-del:hover {
        color: var(--error-color);
      }
      .sect {
        padding: 0 12px 8px;
        border-top: 1px solid var(--divider-color);
      }
      .sect .subhead {
        margin: 10px 0 4px;
        color: var(--accent-color);
        text-transform: none;
        letter-spacing: 0;
        font-weight: 500;
        font-size: 14px;
      }
      .card-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      input[type='checkbox'] {
        margin-right: 6px;
      }
    `;}};i([ye({attribute:!1})],vn.prototype,"hass",void 0),i([ye({type:Boolean})],vn.prototype,"narrow",void 0),i([ye()],vn.prototype,"item",void 0),i([be()],vn.prototype,"data",void 0),i([be()],vn.prototype,"code",void 0),i([be()],vn.prototype,"repeatCode",void 0),i([be()],vn.prototype,"changeCode",void 0),i([be()],vn.prototype,"busy",void 0),i([be()],vn.prototype,"loaded",void 0),vn=i([me("hm-user-editor-card")],vn);let yn=class extends pe{constructor(){super(...arguments),this.narrow=!1,this.embedded=!1,this.locks=[],this.error="",this.busy=!1,this.users=[],this.reads={},this.names={},this.lockActionDraft={},this.openLocks={},this.legacy=[];}firstUpdated(){this.refresh(!0);}async refresh(e=!1){try{const[s,a,i]=await Promise.all([Di(this.hass),(t=this.hass,t.callWS({type:"house_modes/ext/house/locks"})),tn(this.hass)]);this.saved=s.settings,this.houseInfo=s,this.locks=a.locks,this.lockSettings=i.settings,this.users=i.users,e&&(this.lockActionDraft=Object.assign({},i.settings.lock_actions)),e&&a.locks.forEach(e=>this.read(e.entity_id)),this.legacy=(await(e=>e.callWS({type:"house_modes/ext/locks/legacy"}))(this.hass)).legacy,!e&&this.draft||(this.draft=(e=>JSON.parse(JSON.stringify(e)))(s.settings));}catch(e){this.error=ba(e);}var t;}render(){return this.draft?Z`
      ${this.error?Z`<div class="notice error" style="white-space:pre-line;margin:0 0 12px">${this.error}</div>`:K}
      ${this.renderCodes()}
    `:Z`<ha-card><div class="empty">${this.error||"Loading…"}</div></ha-card>`;}async migrate(){if(window.confirm(`Move ${this.legacy.length} old "code slot → House Mode" setting(s) to Users? Each slot gets a lock-only user (or the user with the same code) whose unlock action is that House Mode. A backup is in Backup if you need it.`)){this.busy=!0;try{const t=await(e=this.hass,e.callWS({type:"house_modes/ext/locks/migrate"})),s=t.results.filter(e=>"moved"!==e.result);_a(this,`${t.results.length-s.length} moved to users${s.length?`, ${s.length} failed`:""}.`),s.length&&(this.error=s.map(e=>`${e.lock_name} slot ${e.slot}: ${e.error}`).join("\n")),await this.refresh(!0);}catch(e){this.error=ba(e);}finally{this.busy=!1;}var e;}}async read(e){this.reads=Object.assign(Object.assign({},this.reads),{[e]:"reading"});try{const t=await sn(this.hass,e);this.reads=Object.assign(Object.assign({},this.reads),{[e]:t});}catch(t){this.reads=Object.assign(Object.assign({},this.reads),{[e]:ba(t)});}}userName(e){const t=this.users.find(t=>t.user_id===e);return t?t.name:e?"removed user":"";}async link(e,t,s){try{this.lockSettings=(await an(this.hass,e,t,s)).settings,_a(this,s?`Slot ${t} linked to ${this.userName(s)}.`:`Slot ${t} unlinked.`),await this.read(e);}catch(e){this.error=ba(e);}}async doImport(e,t){const s=ln(t.slots);if(s.length){this.busy=!0;try{const t=await((e,t,s)=>e.callWS({type:"house_modes/ext/locks/import",entity_id:t,slots:s}))(this.hass,e,s.map(t=>({slot:t.slot,name:this.names[`${e}:${t.slot}`]||t.lock_name||void 0}))),a=t.results.filter(e=>"created"===e.result).length,i=t.results.filter(e=>"linked"===e.result).length,n=t.results.filter(e=>"error"===e.result);_a(this,`${a} user(s) created, ${i} linked to existing users${n.length?`, ${n.length} failed`:""}.`),n.length&&(this.error=n.map(e=>`Slot ${e.slot}: ${e.error}`).join("\n")),await this.refresh(),await this.read(e);}catch(e){this.error=ba(e);}finally{this.busy=!1;}}}async saveLockAct(e){try{this.lockSettings=(await((e,t,s)=>e.callWS({type:"house_modes/ext/locks/actions",entity_id:t,lock:s}))(this.hass,e,this.lockActionDraft[e]||null)).settings,_a(this,"Keypad lock action saved.");}catch(e){this.error=ba(e);}}renderCodes(){var e,t;const s=this.lockSettings,a=(null===(e=this.saved)||void 0===e?void 0:e.modes)||[],i=((null===(t=this.houseInfo)||void 0===t?void 0:t.targets)||[]).filter(e=>"master"!==e.key),n=e=>(a.find(t=>t.id===e)||{name:e}).name,o=e=>(i.find(t=>t.key===e)||{name:e}).name;return(e=>this.embedded?Z`<div class="kp-embedded">${e}</div>`:Z`<ha-card>${Sa("Keypads","settings")}${e}</ha-card>`)(Z`
        <div class="card-content desc">
          <p>Each Z-Wave lock, with one row per code slot. A slot's code belongs to a User; that user's keypad
            actions (a House Mode, partition targets, or both) run when the code is used at the lock.</p>
          <ul>
            <li><strong>Import</strong> makes a <em>lock-only</em> user for each code that has no user yet: the code works at
              the lock and for its keypad actions, but cannot arm or disarm the alarm until you allow it. A code that is
              already a User's code is linked to that user instead.</li>
            <li><em>Code</em> compares the slot's code with the user's code (<em>Slot = User Code</em>). Codes are stored only hashed. The eye
              shows a lock's code for 30 seconds, read from the lock right then; it is never stored.</li>
            <li>Click a user (in Users) to change its name, code, permissions, lock slots and keypad actions.</li>
          </ul>
        </div>
        ${this.legacy.length?Z`<div class="notice warn" style="margin:0 16px 12px">
              <strong>${this.legacy.length} old "code slot → House Mode" setting(s)</strong> (${this.legacy.map(e=>`${e.lock_name} slot ${e.slot}`).join(", ")})
              still work, but now belong on users.
              <div class="toolbar" style="padding:6px 0 0"><ha-button ?disabled=${this.busy} @click=${this.migrate}>Move them to users</ha-button></div>
            </div>`:K}
        ${this.locks.length?K:Z`<div class="empty">No Z-Wave JS locks found.</div>`}
        ${this.locks.map(e=>{var t,r,l;const c=this.reads[e.entity_id],d=c&&"object"==typeof c?c:void 0,h=d?ln(d.slots):[],p=this.lockActionDraft[e.entity_id],u=JSON.stringify(p||null)!==JSON.stringify(s&&s.lock_actions[e.entity_id]||null),m=s?s.links.filter(t=>t.entity_id===e.entity_id).length:0,g=`codes:${e.entity_id}`,v=null!==(t=this.openLocks[g])&&void 0!==t&&t;return Z`
            <details class="collapse" ?open=${v} @toggle=${e=>this.openLocks=Object.assign(Object.assign({},this.openLocks),{[g]:e.target.open})}>
            <summary>
              <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
              ${Ea(this.hass,e.entity_id)}
              <span class="collapse-title">${e.name}</span>
              ${m?Z`<span class="role">${m} linked</span>`:K}
              ${h.length?Z`<span class="role" style="color:var(--warning-color,#ffa600);border-color:var(--warning-color,#ffa600)">${h.length} without user</span>`:K}
              <span class="secondary" style="display:inline">${e.entity_id} · node ${null!==(r=e.node_id)&&void 0!==r?r:"unknown"}${d?` · ${en[d.api]||d.api}`:""}</span>
            </summary>
            <div class="collapse-body">
            <div class="toolbar" style="padding:4px 0 8px">
              <ha-button appearance="plain" ?disabled=${"reading"===c} @click=${()=>this.read(e.entity_id)}>
                <ha-icon slot="start" icon="mdi:refresh"></ha-icon>${"reading"===c?"Reading…":"Read the lock again"}</ha-button>
              <ha-button ?disabled=${!h.length||this.busy} @click=${()=>this.doImport(e.entity_id,d)}>
                <ha-icon slot="start" icon="mdi:account-multiple-plus"></ha-icon>Import ${h.length} code(s) as lock-only users</ha-button>
            </div>
            ${h.length?Z`<div class="notice warn" style="margin:0 0 8px">${h.length} code(s) on ${e.name} have no user: slot
                  ${h.map(e=>e.slot).join(", ")}. Type a name in the row if you like, then Import.</div>`:K}
            ${"string"==typeof c&&"reading"!==c?Z`<div class="notice error" style="margin:0 16px 8px">${c}</div>`:K}
            ${d&&!d.readable?Z`<div class="notice warn" style="margin:0 16px 8px">The codes could not be read from this lock. You can still link slots to users by
                  number; the code check then shows "not readable".</div>`:K}
            ${d?Z`<div class="table-wrap"><table>
                  <thead><tr><th>Slot</th><th>On the lock</th><th>User</th><th>Code</th><th>When this code is used</th></tr></thead>
                  <tbody>${d.slots.filter(e=>e.in_use||e.user_id).map(t=>{const a=`${e.entity_id}:${t.slot}`,i=t.user_id&&s?s.actions[t.user_id]:void 0;return Z`<tr>
                      <td>${t.slot}</td>
                      <td>${t.in_use?"in use":"empty"}${t.lock_name?Z`<span class="secondary">${t.lock_name}</span>`:K}</td>
                      <td>
                        <select aria-label=${`User for slot ${t.slot}`} @change=${s=>this.link(e.entity_id,t.slot,s.target.value||null)}>
                          <option value="" ?selected=${!t.user_id}>— not linked —</option>
                          ${this.users.map(e=>Z`<option value=${e.user_id} ?selected=${t.user_id===e.user_id}>${e.name}${e.enabled?"":" (disabled)"}</option>`)}
                        </select>
                        ${!t.user_id&&t.match_user_id?Z`<button class="link" @click=${()=>this.link(e.entity_id,t.slot,t.match_user_id)}>Same code as ${this.userName(t.match_user_id)} — link</button>`:K}
                        ${!t.user_id&&!t.match_user_id&&t.readable&&t.in_use?Z`<input placeholder="Name for import" aria-label=${`Name for slot ${t.slot}`} style="width:140px" .value=${this.names[a]||t.lock_name}
                              @input=${e=>this.names=Object.assign(Object.assign({},this.names),{[a]:e.target.value})} />`:K}
                      </td>
                      <td>${t.status?Z`<span style=${`color:${Qi[t.status]}`}>${Xi[t.status]}</span>`:Z`<span class="secondary" style="display:inline">—</span>`}
                        ${t.in_use&&t.readable?Z`<div><hm-reveal-code .hass=${this.hass} .entityId=${e.entity_id} .slotNo=${t.slot}></hm-reveal-code></div>`:K}</td>
                      <td>${t.user_id?Z`${((e,t,s,a)=>{if(rn(e))return"nothing";const i=[];return e.house_mode&&i.push(`House Mode ${t(e.house_mode)}`),Object.keys(e.targets).forEach(t=>i.push(`${s(t)}: ${a(e.targets[t])}`)),i.join(" · ");})(i&&i.unlock,n,o,e=>pn[e]||e)}
                            <button class="link" @click=${()=>la(0,ga("codes",{params:{edit_user:t.user_id}}),!0)}>edit</button>`:Z`<span class="secondary" style="display:inline">nothing (no user)</span>`}</td>
                    </tr>`;})}</tbody>
                </table></div>`:"reading"===c?Z`<div class="empty">Reading the lock…</div>`:K}
            <div style="padding:8px 0 4px;max-width:640px">
              <hm-keypad-action
                .label=${"Keypad lock without a code (e.g. Schlage outside button)"}
                .action=${p}
                .modes=${a}
                .houseEnabled=${!!(null===(l=this.saved)||void 0===l?void 0:l.enabled)}
                .partitions=${i}
                @value-changed=${t=>this.lockActionDraft=Object.assign(Object.assign({},this.lockActionDraft),{[e.entity_id]:t.detail.value})}
              ></hm-keypad-action>
              ${u?Z`<div class="toolbar" style="padding:8px 0 0"><ha-button @click=${()=>this.saveLockAct(e.entity_id)}>Save keypad lock action</ha-button></div>`:K}
            </div>
            </div>
            </details>
          `;})}
    `);}};yn.styles=[ka,h`
      .kp-embedded .card-content.desc {
        padding: 0 0 8px;
      }
      .kp-embedded details.collapse {
        margin: 0 0 8px;
      }
      .kp-embedded details.collapse[open] {
        border-color: var(--accent-color);
      }
      .kp-embedded .notice {
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
    `],i([ye({attribute:!1})],yn.prototype,"hass",void 0),i([ye({type:Boolean})],yn.prototype,"narrow",void 0),i([ye({attribute:!1})],yn.prototype,"path",void 0),i([ye({type:Boolean})],yn.prototype,"embedded",void 0),i([be()],yn.prototype,"saved",void 0),i([be()],yn.prototype,"draft",void 0),i([be()],yn.prototype,"locks",void 0),i([be()],yn.prototype,"error",void 0),i([be()],yn.prototype,"busy",void 0),i([be()],yn.prototype,"lockSettings",void 0),i([be()],yn.prototype,"users",void 0),i([be()],yn.prototype,"reads",void 0),i([be()],yn.prototype,"names",void 0),i([be()],yn.prototype,"lockActionDraft",void 0),i([be()],yn.prototype,"houseInfo",void 0),i([be()],yn.prototype,"openLocks",void 0),i([be()],yn.prototype,"legacy",void 0),yn=i([me("hm-view-connections")],yn);const bn={};let fn=class extends ze(pe){constructor(){super(...arguments),this.users={},this.lockLinks=[],this.lockActions={};}hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"house_modes_config_updated"})];}async _fetchData(){if(!this.hass)return;const e=await we(this.hass);this.data=Qs(e,["code_arm_required","code_disarm_required","code_mode_change_required","code_format"]);const t=await xe(this.hass);try{const e=await tn(this.hass);this.lockLinks=e.settings.links,this.lockActions=e.settings.actions;}catch(e){this.lockLinks=[];}this.users=t;}render(){if(!this.hass||!this.data)return Z``;const e=this.hass.language,t=this.data,s=t.code_arm_required||t.code_disarm_required||t.code_mode_change_required,a=[t.code_arm_required?"arming":"",t.code_disarm_required?"disarming":"",t.code_mode_change_required?"mode change":""].filter(Boolean).join(", "),i="text"===t.code_format?us("panels.codes.cards.codes.fields.code_format.code_format_text",e):us("panels.codes.cards.codes.fields.code_format.code_format_number",e),n=s=>Z`
      <label class="uc-check"><input type="checkbox" class="cb" .checked=${!!t[s]}
          @change=${e=>this.saveData({[s]:e.target.checked})} />
        <span><strong>${us(`panels.codes.cards.codes.fields.${s}.heading`,e)}</strong>
          <span class="secondary">${us(`panels.codes.cards.codes.fields.${s}.description`,e)}</span></span></label>`;return Z`
      <ha-card>${Sa(us("panels.users_codes.title",e),"settings")}
        <div class="card-content desc">
          <p>The people who may use the alarm, their codes, and the Z-Wave lock keypads. A user's code can arm and disarm
            the alarm, and, used at a lock, run that user's keypad actions (a House Mode, partition targets, or both).</p>
        </div>
        ${this.sec("codes","Codes",`${a?`required for ${a}`:"not required"} · ${i}`,!1,Z`
          ${n("code_arm_required")} ${n("code_disarm_required")} ${n("code_mode_change_required")}
          <div class="uc-row">
            <span><strong>${us("panels.codes.cards.codes.fields.code_format.heading",e)}</strong>
              <span class="secondary">${us("panels.codes.cards.codes.fields.code_format.description",e)}</span></span>
            <span class="uc-chips">
              ${["number","text"].map(a=>Z`<button class="uc-chip ${t.code_format===a?"on":""}" ?disabled=${!s}
                aria-pressed=${t.code_format===a} @click=${()=>this.saveData({code_format:a})}>
                ${us(`panels.codes.cards.codes.fields.code_format.code_format_${a}`,e)}</button>`)}
            </span>
          </div>`)}
        ${this.sec("users","Users",this.usersSummary(),!1,this.usersPanel())}
        ${this.editing?K:this.sec("keypads","Keypads","Z-Wave lock code slots and keypad actions",!1,Z`<hm-view-connections .hass=${this.hass} .narrow=${this.narrow} embedded></hm-view-connections>`)}
      </ha-card>
    `;}sec(e,t,s,a,i){const n=e in bn?bn[e]:a||"users"===e&&this.editing;return Z`<details class="collapse uc-sec" ?open=${n||"users"===e&&this.editing}
        @toggle=${t=>bn[e]=t.target.open}>
      <summary>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        <span class="collapse-title">${t}</span>
        <span class="secondary" style="display:inline">${s}</span>
      </summary>
      <div class="collapse-body">${i}</div>
    </details>`;}usersSummary(){const e=Object.values(this.users),t=e.filter(e=>e.enabled).length;return`${e.length} user${1===e.length?"":"s"} · ${t} enabled`;}get editing(){return"new_user"==this.path.subpage||!!this.path.params.edit_user;}renderEditor(){return"new_user"==this.path.subpage?Z`<hm-user-editor-card .hass=${this.hass} .narrow=${this.narrow}></hm-user-editor-card>`:Z`<hm-user-editor-card .hass=${this.hass} .narrow=${this.narrow} item=${this.path.params.edit_user}></hm-user-editor-card>`;}updated(){var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("hm-user-editor-card");t&&!t.dataset.scrolled&&(t.dataset.scrolled="1",t.scrollIntoView({behavior:"smooth",block:"start"}));}usersPanel(){if(!this.hass)return Z``;const e=Object.values(this.users);e.sort(ra);const t=this.hass.language,s=e=>"number"===e.code_format?us("panels.codes.cards.codes.fields.code_format.code_format_number",t):"text"===e.code_format?us("panels.codes.cards.codes.fields.code_format.code_format_text",t):"",a=e=>e.can_arm&&e.can_disarm?"arms and disarms":e.can_arm?"arms only":e.can_disarm?"disarms only":"lock-only",i=e=>this.lockLinks.filter(t=>t.user_id===e.user_id).map(e=>{var t;return`${(null===(t=this.hass.states[e.entity_id])||void 0===t?void 0:t.attributes.friendly_name)||e.entity_id} ${e.slot}`;}).join(", "),n=e=>{const t=this.lockActions[e.user_id]||{},s=e=>[e&&e.house_mode?`House Mode ${e.house_mode}`:"",e&&Object.keys(e.targets).length?`${Object.keys(e.targets).length} partition target(s)`:""].filter(Boolean).join(" + ");return[rn(t.unlock)?"":`unlock → ${s(t.unlock)}`,rn(t.lock)?"":`lock → ${s(t.lock)}`].filter(Boolean).join(" · ");},o=e=>la(0,ga("codes",{params:{edit_user:e.user_id}}),!0);return Z`
      <div class="uc-intro secondary">${us("panels.codes.cards.user_management.description",t)}</div>
      <ha-button ?disabled=${this.editing} @click=${this.addUserClick}>
        <ha-icon slot="start" icon="mdi:plus"></ha-icon>${us("panels.codes.cards.user_management.actions.new_user",t)}</ha-button>
      ${this.editing?Z`<div class="uc-editor">${this.renderEditor()}</div>`:K}
      ${this.editing?K:e.length?Z`<div class="uc-list">${e.map(e=>Z`<div class="uc-user ${e.enabled?"":"off"}">
              <ha-icon class="uc-icon" icon=${e.can_arm||e.can_disarm?"mdi:account-key-outline":"mdi:account-lock-outline"}></ha-icon>
              <div class="uc-name">
                <button class="link" @click=${()=>o(e)}>${Ys(e.name)}</button>
                <span class="secondary">${[a(e),s(e),e.is_override_code?"override code":"",i(e)?`lock slots ${i(e)}`:"",n(e)].filter(Boolean).join(" · ")}</span>
              </div>
              <button class="uc-chip ${e.enabled?"on":""}" title=${e.enabled?"Enabled: click to disable":"Disabled: click to enable"}
                @click=${()=>this.setUserEnabled(e.user_id,!e.enabled)}>${e.enabled?"Enabled":"Disabled"}</button>
              <ha-icon-button .label=${"Edit"} title="Edit" @click=${()=>o(e)}><ha-icon icon="mdi:pencil"></ha-icon></ha-icon-button>
              <ha-icon-button class="uc-del" .label=${"Delete"} title="Delete" @click=${()=>this.removeUser(e)}><ha-icon icon="mdi:trash-can-outline"></ha-icon></ha-icon-button>
            </div>`)}</div>`:Z`<div class="empty">${us("panels.codes.cards.user_management.no_items",t)}</div>`}
    `;}removeUser(e){window.confirm(`Delete the user "${e.name}"?`)&&Ee(this.hass,e.user_id).then(async()=>this.users=await xe(this.hass)).catch(e=>ia(e,this.shadowRoot.querySelector("ha-card")));}addUserClick(){la(0,ga("codes","new_user"),!0);}saveData(e){this.hass&&(this.data=Object.assign(Object.assign({},this.data),e),Se(this.hass,this.data).catch(e=>ia(e,this.shadowRoot.querySelector("ha-card"))).then());}setUserEnabled(e,t){const s=this.shadowRoot.querySelector("ha-card"),a=this.lockLinks.filter(t=>t.user_id===e).length;je(this.hass,{user_id:e,enabled:t}).catch(e=>ia(e,s)).then(()=>{!t&&a&&confirm(`Also clear this user's code from ${a} linked lock slot(s)?`)&&nn(this.hass,e).catch(e=>ia(e,s));});}};fn.styles=[pa,ka,h`
      details.collapse.uc-sec {
        margin: 0 16px 12px;
      }
      .uc-check,
      .uc-row {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 8px 0;
        border-bottom: 1px solid var(--divider-color);
      }
      .uc-row {
        align-items: center;
        flex-wrap: wrap;
        border-bottom: none;
      }
      .uc-check input {
        margin-top: 2px;
        flex: none;
      }
      .uc-check > span,
      .uc-row > span:first-child {
        display: flex;
        flex-direction: column;
        flex: 1 1 260px;
      }
      .uc-chips {
        display: flex;
        gap: 6px;
      }
      .uc-chip {
        border: 1px solid var(--divider-color);
        border-radius: 14px;
        padding: 2px 12px;
        background: none;
        color: var(--secondary-text-color);
        font: inherit;
        font-size: 13px;
        cursor: pointer;
      }
      .uc-chip.on {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
      .uc-chip[disabled] {
        opacity: 0.5;
        cursor: default;
      }
      .uc-intro {
        display: block;
        margin: 0 0 8px;
      }
      .uc-list {
        margin-top: 8px;
      }
      .uc-user {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 4px 0;
        border-top: 1px solid var(--divider-color);
      }
      .uc-user.off .uc-name button,
      .uc-user.off .uc-icon {
        opacity: 0.55;
      }
      .uc-icon {
        color: var(--primary-color);
        margin: 0 4px;
      }
      .uc-name {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex: 1 1 auto;
        min-width: 0;
      }
      .uc-del:hover {
        color: var(--error-color);
      }
      .uc-editor {
        margin-top: 8px;
      }
    `],i([ye()],fn.prototype,"hass",void 0),i([ye()],fn.prototype,"narrow",void 0),i([ye()],fn.prototype,"path",void 0),i([ye()],fn.prototype,"data",void 0),i([ye()],fn.prototype,"users",void 0),fn=i([me("hm-view-codes")],fn);const $n=(e,t)=>{switch(e){case Ws.ArmedAway:return{value:Ws.ArmedAway,name:us("common.modes_short.armed_away",t.language),icon:Rs.ArmedAway};case Ws.ArmedHome:return{value:Ws.ArmedHome,name:us("common.modes_short.armed_home",t.language),icon:Rs.ArmedHome};case Ws.ArmedNight:return{value:Ws.ArmedNight,name:us("common.modes_short.armed_night",t.language),icon:Rs.ArmedNight};case Ws.ArmedCustom:return{value:Ws.ArmedCustom,name:us("common.modes_short.armed_custom_bypass",t.language),icon:Rs.ArmedCustom};case Ws.ArmedVacation:return{value:Ws.ArmedVacation,name:us("common.modes_short.armed_vacation",t.language),icon:Rs.ArmedVacation};}},_n=(e,t)=>{switch(e){case qs.Armed:return{value:qs.Armed,name:us("panels.actions.cards.new_notification.fields.event.choose.armed.name",t.language),description:us("panels.actions.cards.new_notification.fields.event.choose.armed.description",t.language),icon:"hass:shield-check-outline"};case qs.Disarmed:return{value:qs.Disarmed,name:us("panels.actions.cards.new_notification.fields.event.choose.disarmed.name",t.language),description:us("panels.actions.cards.new_notification.fields.event.choose.disarmed.description",t.language),icon:"hass:shield-off-outline"};case qs.Triggered:return{value:qs.Triggered,name:us("panels.actions.cards.new_notification.fields.event.choose.triggered.name",t.language),description:us("panels.actions.cards.new_notification.fields.event.choose.triggered.description",t.language),icon:"hass:bell-alert-outline"};case qs.Untriggered:return{value:qs.Untriggered,name:us("panels.actions.cards.new_notification.fields.event.choose.untriggered.name",t.language),description:us("panels.actions.cards.new_notification.fields.event.choose.untriggered.description",t.language),icon:"hass:bell-off-outline"};case qs.ArmFailure:return{value:qs.ArmFailure,name:us("panels.actions.cards.new_notification.fields.event.choose.arm_failure.name",t.language),description:us("panels.actions.cards.new_notification.fields.event.choose.arm_failure.description",t.language),icon:"hass:alert-outline"};case qs.Arming:return{value:qs.Arming,name:us("panels.actions.cards.new_notification.fields.event.choose.arming.name",t.language),description:us("panels.actions.cards.new_notification.fields.event.choose.arming.description",t.language),icon:"hass:home-export-outline"};case qs.Pending:return{value:qs.Pending,name:us("panels.actions.cards.new_notification.fields.event.choose.pending.name",t.language),description:us("panels.actions.cards.new_notification.fields.event.choose.pending.description",t.language),icon:"hass:home-import-outline"};}},wn=(e,t,s)=>0==e?{name:s.master.name,value:"0"}:Object.keys(t).includes(String(e))?{name:t[e].name,value:String(e)}:{name:String(e),value:String(e)},kn=(e,...t)=>{const s=t.map(t=>{if(t.entity_id){return On([t.entity_id],e).pop();}if(!t||!t.service)return null;const s=ca(t.service),a=da(t.service);let i={value:t.service,name:a.replace(/_/g," ").split(" ").map(e=>e.substring(0,1).toUpperCase()+e.substring(1)).join(" "),icon:"hass:home",description:t.service};switch(s){case"notify":const t=e.states[`device_tracker.${a.replace("mobile_app_","")}`];i=t?Object.assign(Object.assign({},i),{name:t.attributes.friendly_name||da(t.entity_id),icon:t.attributes.icon||"hass:cellphone-text"}):Object.assign(Object.assign({},i),{icon:"hass:comment-alert"});break;case"tts":i=Object.assign(Object.assign({},i),{icon:"hass:microphone"});break;case"telegram_bot":i=Object.assign(Object.assign({},i),{icon:"mdi:send"});}return i;}).filter(ta);return s.sort((e,t)=>{const s=ca(e.value),a=ca(t.value);return s!=a?ra(s,a):ra(e,t);}),s;},xn=(e,t)=>{let s=[];const a=Object.keys(e).filter(t=>Object.values(e[t].modes).some(e=>e.enabled));return t.master.enabled&&a.length>1&&(s=[...s,0]),s=[...s,...a],s;},An=(e,t)=>{const s=e=>Object.keys(e.modes).filter(t=>e.modes[t].enabled);if(ta(e)&&Object.keys(t).includes(String(e)))return s(t[e]);{const e=Object.keys(t).map(e=>s(t[e]));return e[0].filter(t=>e.every(e=>e.includes(t)));}},On=(e,t)=>{const s=e.map(e=>({value:e,name:e in t.states?t.states[e].attributes.friendly_name||da(e):e,icon:e in t.states&&t.states[e].attributes.icon||ha(ca(e)),description:e}));return s;},Sn=e=>{let t=[];return"notify"in e.services&&(t=[...t,...Object.keys(e.services.notify).filter(e=>"send_message"!=e).map(e=>Object({service:`notify.${e}`}))]),"tts"in e.services&&(t=[...t,...Object.keys(e.services.tts).filter(e=>"clear_cache"!=e).map(e=>Object({service:`tts.${e}`}))]),"telegram_bot"in e.services&&(t=[...t,{service:"telegram_bot.send_message"}]),Object.keys(e.states).filter(e=>"notify"==ca(e)).map(e=>{t=[...t,{service:"notify.send_message",entity_id:e}];}),t;},Cn=(...e)=>{if(!e.length||!e.every(e=>e.length))return[];if(1==e.length&&e[0].length>1&&Js(e[0].map(ca)).length>1)return Cn(...e[0].map(e=>Array(e)));let t=[...e[0]];return e.forEach(e=>{t=t.map(t=>e.includes(t)?t:"script"==ca(t)&&e.map(ca).includes("script")?"script.script":e.map(da).includes(da(t))?`homeassistant.${da(t)}`:null).filter(ta);}),t;},jn=(e,t,s=1)=>{if(s>10)return[];if(Array.isArray(e)){const a=e.map(e=>jn(e,t,s+1));return Cn(...a);}if(!ta(e))return[];const a=ca(e);switch(a){case"light":case"switch":case"input_boolean":case"siren":return[`${a}.turn_on`,`${a}.turn_off`];case"script":return[e];case"lock":return["lock.lock","lock.unlock"];case"group":const i=e in t.states?t.states[e]:void 0,n=(null==i?void 0:i.attributes.entity_id)||[];return jn(n,t,s+1);default:return[];}},En=(e,t)=>{let s=[...Object.keys(e.states).filter(t=>"script"!=ca(t)&&jn(t,e).length)];const a=Object.keys(e.services.script||{}).filter(e=>!["turn_on","turn_off","reload","toggle"].includes(e)).map(e=>`script.${e}`);return s=[...s,...a],t&&t.length&&(s=[...s,...t.filter(e=>!s.includes(e))]),s.sort(ra),s;},Mn=(e,...t)=>{let s=[...Object.keys(e.states).filter(e=>t.includes(ca(e)))];return s.sort(ra),s;},Hn=e=>{let t=[{value:"{{arm_mode}}",name:e.translationMetadata.translations.en.nativeName}];return"en"!=e.language&&(t=[...t,{value:`{{arm_mode|lang=${e.language}}}`,name:e.translationMetadata.translations[e.language].nativeName}]),t;},Ln=e=>"string"==typeof e&&e.trim().length>0,Tn=(e,t)=>Ln(e)&&t.services[ca(e)]&&t.services[ca(e)][da(e)],zn=(e,t)=>Ln(e)&&(t.states[e]||"script"==ca(e)&&t.services.script[da(e)]),Pn=e=>"object"==typeof e&&null!==e&&!Array.isArray(e),Nn=e=>"string"==typeof e;let Dn=class extends pe{constructor(){super(...arguments),this.items=[],this.value=[],this.label="",this.invalid=!1,this.showSearch=!1;}shouldUpdate(e){return e.get("items")&&(sa(this.items,e.get("items"))||this.firstUpdated()),!0;}firstUpdated(){this.value.some(e=>!this.items.map(e=>e.value).includes(e))&&(this.value=this.value.filter(e=>this.items.map(e=>e.value).includes(e)),Zs(this,"value-changed",{value:this.value}));}render(){return Z`
      <hm-chip-set
        .hass=${this.hass}
        .items=${this.value.map(e=>this.items.find(t=>t.value==e)).filter(ta)}
        removable
        @value-changed=${this._removeClick}
      >
      </hm-chip-set>
      <hm-select
        .hass=${this.hass}
        .items=${this.items.filter(e=>!this.value.includes(e.value))}
        ?disabled=${this.value.length==this.items.length}
        label=${this.label}
        icons=${!0}
        @value-changed=${this._addClick}
        ?invalid=${this.invalid&&this.value.length!=this.items.length}
        ?showSearch=${this.showSearch}
      ></hm-select>
    `;}_removeClick(e){const t=e.detail;this.value=this.value.filter(e=>e!==t),Zs(this,"value-changed",{value:this.value});}_addClick(e){e.stopPropagation();const t=e.target,s=t.value;""!==s&&(this.value.includes(s)||(this.value=[...this.value,s]),Zs(this,"value-changed",{value:[...this.value]}),t.clearValue());}};var Rn;i([ye()],Dn.prototype,"hass",void 0),i([ye()],Dn.prototype,"items",void 0),i([ye({type:Array})],Dn.prototype,"value",void 0),i([ye()],Dn.prototype,"label",void 0),i([ye({type:Boolean})],Dn.prototype,"invalid",void 0),i([ye({type:Boolean})],Dn.prototype,"showSearch",void 0),Dn=i([me("hm-selector")],Dn),function(e){e[e.Yaml=0]="Yaml",e[e.UI=1]="UI";}(Rn||(Rn={}));let Bn=class extends pe{constructor(){super(...arguments),this.config={type:Gs.Notification,triggers:[{}],actions:[{}]},this.viewMode=Rn.UI,this.errors={};}async firstUpdated(){if(await _e(),this.areas=await Le(this.hass),this.hmConfig=await we(this.hass),this.item){let e=[...this.item.actions];this.config=Object.assign(Object.assign({},this.item),{actions:[e[0],...e.slice(1)]}),null===this.config.actions[0].entity_id&&Object.assign(this.config.actions,{0:ea(this.config.actions[0],"entity_id")}),this.config.triggers.length>1&&(this.config=Object.assign(Object.assign({},this.config),{triggers:[this.config.triggers[0]]}));let t=this.config.triggers[0].area;ta(t)&&!xn(this.areas,this.hmConfig).includes(t)?t=void 0:null===t&&(t=0),this._setArea(new CustomEvent("value-changed",{detail:{value:t}}));}if(!ta(this.config.triggers[0].area)){const e=xn(this.areas,this.hmConfig);1==e.length?this._setArea(new CustomEvent("value-changed",{detail:{value:e[0]}})):e.includes(0)&&this._setArea(new CustomEvent("value-changed",{detail:{value:0}}));}}render(){var e,t,s,a,i,n,o,r;return this.hass&&this.areas&&this.hmConfig?Z`
      <div class="heading">
        <div class="header">${(null===(e=this.item)||void 0===e?void 0:e.automation_id)&&this.item.name||us("panels.actions.cards.new_notification.title",this.hass.language)}</div>
        <ha-button appearance="plain" @click=${this._toggleYamlMode}>
          <ha-icon slot="start" icon="mdi:code-braces"></ha-icon>
          ${this.viewMode==Rn.Yaml?us("components.editor.ui_mode",this.hass.language):us("components.editor.yaml_mode",this.hass.language)}
        </ha-button>
        <ha-icon-button .path=${$s} @click=${this._cancelClick} class="icon" .label=${"Close"}></ha-icon-button>
      </div>
      <div class="section-header">${us("panels.actions.cards.new_notification.trigger",this.hass.language)}</div>
      <div class="box">
        <div class="card-content">
          <hm-settings-row .narrow=${this.narrow} compact first>
            <span slot="heading">
              ${us("panels.actions.cards.new_notification.fields.event.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${us("panels.actions.cards.new_notification.fields.event.description",this.hass.language)}
            </span>

            <hm-select
              .hass=${this.hass}
              .items=${Object.values(qs).map(e=>_n(e,this.hass))}
              label=${us("panels.actions.cards.new_action.fields.event.heading",this.hass.language)}
              icons=${!0}
              .value=${this.config.triggers[0].event}
              @value-changed=${this._setEvent}
              ?invalid=${this.errors.event}
              showSearch
            ></hm-select>
          </hm-settings-row>

          ${Object.keys(this.areas).length>1?Z`
                <hm-settings-row .narrow=${this.narrow} compact>
                  <span slot="heading">
                    ${us("panels.actions.cards.new_action.fields.area.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${us("panels.actions.cards.new_action.fields.area.description",this.hass.language)}
                  </span>

                  <hm-select
                    .hass=${this.hass}
                    .items=${xn(this.areas,this.hmConfig).map(e=>wn(e,this.areas,this.hmConfig))}
                    label=${us("panels.actions.cards.new_action.fields.area.heading",this.hass.language)}
                    .value=${String(this.config.triggers[0].area)}
                    @value-changed=${this._setArea}
                    ?invalid=${this.errors.area||!this.config.triggers[0].area&&!this.hmConfig.master.enabled}
                  ></hm-select>
                </hm-settings-row>
              `:""}

          <hm-settings-row .narrow=${this.narrow} compact last>
            <span slot="heading">
              ${us("panels.actions.cards.new_notification.fields.mode.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${us("panels.actions.cards.new_notification.fields.mode.description",this.hass.language)}
            </span>

            <hm-selector
              .hass=${this.hass}
              .items=${An(this.config.triggers[0].area,this.areas).map(e=>$n(e,this.hass))}
              label=${us("panels.actions.cards.new_action.fields.mode.heading",this.hass.language)}
              .value=${this.config.triggers[0].modes||[]}
              @value-changed=${this._setModes}
              ?invalid=${this.errors.modes}
            ></hm-selector>
          </hm-settings-row>
        </div>
      </div>

      <div class="section-header">${us("panels.actions.cards.new_notification.action",this.hass.language)}</div>
      <div class="box">
        <div class="card-content">
          ${this.viewMode==Rn.UI?Z`
                <hm-settings-row .narrow=${this.narrow} compact first>
                  <span slot="heading">
                    ${us("panels.actions.cards.new_notification.fields.target.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${us("panels.actions.cards.new_notification.fields.target.description",this.hass.language)}
                  </span>

                  <hm-select
                    .hass=${this.hass}
                    .items=${kn(this.hass,...Sn(this.hass))}
                    ?disabled=${!Sn(this.hass).length}
                    label=${us("panels.actions.cards.new_notification.fields.target.heading",this.hass.language)}
                    .value=${(null===(t=Sn(this.hass).find(e=>e.entity_id==this.config.actions[0].entity_id&&e.service==this.config.actions[0].service))||void 0===t?void 0:t.entity_id)||(null===(s=Sn(this.hass).find(e=>e.service==this.config.actions[0].service))||void 0===s?void 0:s.service)||void 0}
                    @value-changed=${this._setService}
                    ?invalid=${this.errors.service}
                    showSearch
                  ></hm-select>
                </hm-settings-row>

                ${this.config.actions[0].service&&"notify"!=ca(this.config.actions[0].service)?"":Z`
                      <hm-settings-row .narrow=${this.narrow} compact>
                        <span slot="heading">
                          ${us("panels.actions.cards.new_notification.fields.title.heading",this.hass.language)}
                        </span>
                        <span slot="description">
                          ${us("panels.actions.cards.new_notification.fields.title.description",this.hass.language)}
                        </span>

                        <ha-input
                          label="${us("panels.actions.cards.new_notification.fields.title.heading",this.hass.language)}"
                          .value=${(null===(a=this.config.actions[0].data)||void 0===a?void 0:a.title)||""}
                          @input=${this._setTitle}
                          ?invalid=${this.errors.title}
                        ></ha-input>
                      </hm-settings-row>
                    `}
                ${this.config.actions[0].service&&"tts"==ca(this.config.actions[0].service)?Z`
                      <hm-settings-row .narrow=${this.narrow} compact first>
                        <span slot="heading">
                          ${us("panels.actions.cards.new_action.fields.entity.heading",this.hass.language)}
                        </span>
                        <span slot="description">
                          ${us("panels.actions.cards.new_action.fields.entity.description",this.hass.language)}
                        </span>

                        <hm-select
                          .hass=${this.hass}
                          .items=${On("tts.speak"==this.config.actions[0].service?Mn(this.hass,"tts"):Mn(this.hass,"media_player","tts"),this.hass)}
                          label=${us("panels.actions.cards.new_action.fields.entity.heading",this.hass.language)}
                          .value=${(null===(i=this.config.actions[0].data)||void 0===i?void 0:i.entity_id)||""}
                          @value-changed=${this._setEntity}
                          ?invalid=${this.errors.entity}
                          showSearch
                        ></hm-select>
                      </hm-settings-row>
                    `:""}

                  
                ${this.config.actions[0].service&&"tts.speak"==this.config.actions[0].service?Z`
                      <hm-settings-row .narrow=${this.narrow} compact>
                        <span slot="heading">
                          ${us("panels.actions.cards.new_notification.fields.media_player_entity.heading",this.hass.language)}
                        </span>
                        <span slot="description">
                          ${us("panels.actions.cards.new_notification.fields.media_player_entity.description",this.hass.language)}
                        </span>

                        <hm-select
                          .hass=${this.hass}
                          .items=${On(Mn(this.hass,"media_player"),this.hass)}
                          label=${us("panels.actions.cards.new_notification.fields.media_player_entity.heading",this.hass.language)}
                          .value=${(null===(n=this.config.actions[0].data)||void 0===n?void 0:n.media_player_entity_id)||""}
                          @value-changed=${this._setMediaPlayerEntity}
                          .icons=${!0}
                          ?invalid=${this.errors.media_player_entity}
                        ></hm-select>
                      </hm-settings-row>
                    `:""}

                <hm-settings-row .narrow=${this.narrow} compact last>
                  <span slot="heading">
                    ${us("panels.actions.cards.new_notification.fields.message.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${us("panels.actions.cards.new_notification.fields.message.description",this.hass.language)}
                  </span>

                  <ha-selector
                    .hass=${this.hass}
                    .selector=${Object({text:{multiline:!0,type:"text"}})}
                    id="message"
                    label="${us("panels.actions.cards.new_notification.fields.message.heading",this.hass.language)}"
                    placeholder=${this._messagePlaceholder()}
                    .value=${(null===(o=this.config.actions[0].data)||void 0===o?void 0:o.message)||""}
                    @value-changed=${e=>{this._setMessage(e.detail.value);}}
                    ?invalid=${this.errors.message}
                  ></ha-selector>
                  ${this.errors.message?Z`
                   <span class="error-message">
                      ${this.hass.localize("ui.common.error_required")}
                    </span>
                  `:K}
                  ${this.config.triggers[0].event?Z`
                        <div style="margin-top: 10px">
                          <span style="padding-right: 10px">
                            ${us("panels.actions.cards.new_notification.fields.message.insert_wildcard",this.hass.language)}:
                          </span>
                          <hm-chip-set
                            selectable
                            .items=${((e,t)=>{let s=[];return s=[],e&&![qs.Pending,qs.Triggered,qs.ArmFailure].includes(e)||(s=[...s,{name:"Open Sensors",value:"{{open_sensors}}"}]),e&&![qs.Armed].includes(e)||(s=[...s,{name:"Bypassed Sensors",value:"{{bypassed_sensors}}"}]),(!e||(null==t?void 0:t.code_arm_required)&&[qs.Armed,qs.Arming,qs.ArmFailure].includes(e)||(null==t?void 0:t.code_disarm_required)&&[qs.Disarmed,qs.Untriggered].includes(e))&&(s=[...s,{name:"Changed By",value:"{{changed_by}}"}]),e&&![qs.Armed,qs.Arming,qs.Pending,qs.Triggered,qs.ArmFailure].includes(e)||(s=[...s,{name:"Arm Mode",value:"{{arm_mode}}"}]),e&&![qs.Arming,qs.Pending].includes(e)||(s=[...s,{name:"Delay",value:"{{delay}}"}]),s;})(this.config.triggers[0].event,this.hmConfig)}
                            @value-changed=${e=>this._insertWildCard(e.detail)}
                          ></hm-chip-set>
                        </div>
                      `:""}
                </hm-settings-row>

                ${null!==this._getOpenSensorsFormat()?Z`
                      <hm-settings-row .narrow=${this.narrow} compact>
                        <span slot="heading">
                          ${us("panels.actions.cards.new_notification.fields.open_sensors_format.heading",this.hass.language)}
                        </span>

                        <span slot="description">
                          ${us("panels.actions.cards.new_notification.fields.open_sensors_format.description",this.hass.language)}
                        </span>

                        <hm-select
                          .hass=${this.hass}
                          .items=${(e=>{let t=[];return t="en"!=e.language?[...t,{value:"{{open_sensors}}",name:`${us("panels.actions.cards.new_notification.fields.open_sensors_format.options.default",e.language)} (${e.translationMetadata.translations.en.nativeName})`},{value:`{{open_sensors|lang=${e.language}}}`,name:`${us("panels.actions.cards.new_notification.fields.open_sensors_format.options.default",e.language)} (${e.translationMetadata.translations[e.language].nativeName})`}]:[...t,{value:"{{open_sensors}}",name:us("panels.actions.cards.new_notification.fields.open_sensors_format.options.default",e.language)}],t=[...t,{value:"{{open_sensors|format=short}}",name:us("panels.actions.cards.new_notification.fields.open_sensors_format.options.short",e.language)}],t;})(this.hass)}
                          .value=${this._getOpenSensorsFormat(!0)}
                          @value-changed=${this._setOpenSensorsFormat}
                        ></hm-select>
                      </hm-settings-row>
                    `:""}
                ${null!==this._getArmModeFormat()&&(Hn(this.hass).length>1||1==Hn(this.hass).length&&Hn(this.hass)[0].value!=this._getArmModeFormat())?Z`
                      <hm-settings-row .narrow=${this.narrow} compact>
                        <span slot="heading">
                          ${us("panels.actions.cards.new_notification.fields.arm_mode_format.heading",this.hass.language)}
                        </span>

                        <span slot="description">
                          ${us("panels.actions.cards.new_notification.fields.arm_mode_format.description",this.hass.language)}
                        </span>

                        <hm-select
                          .hass=${this.hass}
                          .items=${Hn(this.hass)}
                          .value=${this._getArmModeFormat(!0)}
                          @value-changed=${this._setArmModeFormat}
                        ></hm-select>
                      </hm-settings-row>
                    `:""}
              `:Z`
                <h2>${us("components.editor.edit_in_yaml",this.hass.language)}</h2>

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


        <div class="card-actions">
          <ha-button appearance="plain" ?disabled=${!this._validAction()} @click=${this._testClick}>
            ${us("panels.actions.cards.new_notification.actions.test",this.hass.language)}
            <ha-icon slot="end" icon="hass:arrow-right"></ha-icon>
          </ha-button>
        </div>
      </div>

      <div class="section-header">${us("panels.actions.cards.new_notification.options",this.hass.language)}</div>
      <div class="box">
        <div class="card-content">
          <hm-settings-row .narrow=${this.narrow} compact first>
            <span slot="heading">
              ${us("panels.actions.cards.new_notification.fields.name.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${us("panels.actions.cards.new_notification.fields.name.description",this.hass.language)}
            </span>

            <ha-input
              label="${us("panels.actions.cards.new_notification.fields.name.heading",this.hass.language)}"
              .placeholder=${this._namePlaceholder()}
              .value=${this.config.name||""}
              @input=${this._setName}
              ?invalid=${this.errors.name}
            ></ha-input>
          </hm-settings-row>

        </div>
      </div>

      <div class="actions">
        <ha-button appearance="filled" @click=${this._saveClick}>
          <ha-icon slot="start" icon="hass:content-save-outline"></ha-icon>
          ${this.hass.localize("ui.common.save")}
        </ha-button>
        <ha-button appearance="plain" @click=${this._cancelClick}>${this.hass.localize("ui.common.cancel")}</ha-button>
        <span style="flex:1"></span>
        ${(null===(r=this.item)||void 0===r?void 0:r.automation_id)?Z`<ha-icon-button .label=${this.hass.localize("ui.common.delete")} title=${this.hass.localize("ui.common.delete")}
              @click=${this._deleteClick}><ha-icon icon="mdi:trash-can-outline"></ha-icon></ha-icon-button>`:K}
      </div>
    `:Z``;}_setEvent(e){e.stopPropagation();const t=e.target.value;let s=this.config.triggers;Object.assign(s,{0:Object.assign(Object.assign({},s[0]),{event:t})}),this.config=Object.assign(Object.assign({},this.config),{triggers:s}),Object.keys(this.errors).includes("event")&&this._validateConfig();}_setArea(e){var t;e.stopPropagation();let s=e.detail.value;"0"===s&&(s=0);let a=this.config.triggers;Object.assign(a,{0:Object.assign(Object.assign({},a[0]),{area:s})});const i=An(s,this.areas);(null===(t=a[0].modes)||void 0===t?void 0:t.length)&&this._setModes(new CustomEvent("value-changed",{detail:{value:a[0].modes.filter(e=>i.includes(e))}})),this.config=Object.assign(Object.assign({},this.config),{triggers:a}),Object.keys(this.errors).includes("area")&&this._validateConfig();}_setModes(e){e.stopPropagation();const t=e.detail.value;let s=this.config.triggers;Object.assign(s,{0:Object.assign(Object.assign({},s[0]),{modes:t})}),this.config=Object.assign(Object.assign({},this.config),{triggers:s}),Object.keys(this.errors).includes("modes")&&this._validateConfig();}_setService(e){e.stopPropagation();const t=String(e.detail.value);let s=Sn(this.hass).find(e=>e.entity_id==t||e.service==t),a=this.config.actions;Object.assign(a,{0:Object.assign(Object.assign({},s),ea(a[0],"service","entity_id"))}),this.config=Object.assign(Object.assign({},this.config),{actions:a}),(Object.keys(this.errors).includes("service")||Object.keys(this.errors).includes("entity"))&&this._validateConfig();}_setTitle(e){e.stopPropagation();const t=e.target.value;let s=this.config.actions;Object.assign(s,{0:Object.assign(Object.assign({},s[0]),{service:s[0].service||"",data:Object.assign(Object.assign({},s[0].data||{}),{title:t})})}),this.config=Object.assign(Object.assign({},this.config),{actions:s}),Object.keys(this.errors).includes("title")&&this._validateConfig();}_setEntity(e){e.stopPropagation();const t=e.target.value;let s=this.config.actions;Object.assign(s,{0:Object.assign(Object.assign({},s[0]),{service:s[0].service||"",data:Object.assign(Object.assign({},s[0].data||{}),{entity_id:t})})}),this.config=Object.assign(Object.assign({},this.config),{actions:s}),Object.keys(this.errors).includes("entity")&&this._validateConfig();}_setMediaPlayerEntity(e){e.stopPropagation();const t=e.target.value;let s=this.config.actions;Object.assign(s,{0:Object.assign(Object.assign({},s[0]),{service:s[0].service||"",data:Object.assign(Object.assign({},s[0].data||{}),{media_player_entity_id:t})})}),this.config=Object.assign(Object.assign({},this.config),{actions:s}),Object.keys(this.errors).includes("media_player_entity")&&this._validateConfig();}_setMessage(e){let t=this.config.actions;Object.assign(t,{0:Object.assign(Object.assign({},t[0]),{service:t[0].service||"",data:Object.assign(Object.assign({},t[0].data||{}),{message:e})})}),this.config=Object.assign(Object.assign({},this.config),{actions:t}),Object.keys(this.errors).includes("message")&&this._validateConfig();}_setName(e){e.stopPropagation();const t=e.target.value;this.config=Object.assign(Object.assign({},this.config),{name:t});}_setYaml(e){const t=e.detail.value;let s={};Nn(null==t?void 0:t.service)&&(s=Object.assign(Object.assign({},s),{service:String(t.service)})),Pn(null==t?void 0:t.data)&&(s=Object.assign(Object.assign({},s),{data:t.data})),Object.keys(s).length&&(this.config=Object.assign(Object.assign({},this.config),{actions:Object.assign(this.config.actions,{0:Object.assign(Object.assign({},this.config.actions[0]),s)})})),Object.keys(this.errors).some(e=>["service","message","title"].includes(e))&&this._validateConfig();}_validateConfig(){var e;this.errors={};const t=this._parseAutomation(),s=t.triggers[0];s.event&&Object.values(qs).includes(s.event)||(this.errors=Object.assign(Object.assign({},this.errors),{event:!0})),ta(s.area)&&xn(this.areas,this.hmConfig).includes(s.area)||(this.errors=Object.assign(Object.assign({},this.errors),{area:!0})),(s.modes||[]).every(e=>An(s.area,this.areas).includes(e))||(this.errors=Object.assign(Object.assign({},this.errors),{modes:!0}));const a=t.actions[0];return!a.service||!Sn(this.hass).find(e=>e.service==a.service&&e.entity_id==a.entity_id)&&"script"!=ca(a.service)?this.errors=Object.assign(Object.assign({},this.errors),{service:!0}):!a.service||"tts"!=ca(a.service)||Object.keys(a.data||{}).includes("entity_id")&&Mn(this.hass,"media_player","tts").includes(a.data.entity_id)||(this.errors=Object.assign(Object.assign({},this.errors),{entity:!0})),a.service&&"tts.speak"==a.service&&(this.errors.entity||Mn(this.hass,"tts").includes(a.data.entity_id)||(this.errors=Object.assign(Object.assign({},this.errors),{entity:!0})),Object.keys(a.data||{}).includes("media_player_entity_id")&&Mn(this.hass,"media_player").includes(a.data.media_player_entity_id)||(this.errors=Object.assign(Object.assign({},this.errors),{media_player_entity:!0}))),Ln(null===(e=a.data)||void 0===e?void 0:e.message)||(this.errors=Object.assign(Object.assign({},this.errors),{message:!0})),Ln(t.name)||(this.errors=Object.assign(Object.assign({},this.errors),{name:!0})),!Object.values(this.errors).length;}_validAction(){var e;const t=this._parseAutomation().actions[0];return t.service&&("script"==ca(t.service)||Sn(this.hass).find(e=>e.service==t.service&&e.entity_id==t.entity_id))&&Ln(null===(e=t.data)||void 0===e?void 0:e.message);}_insertWildCard(e){var t,s,a;let i=this.shadowRoot.querySelector("#message"),n=(null===(t=this.config.actions[0].data)||void 0===t?void 0:t.message)||"";if(i){let e=null===(s=i.shadowRoot)||void 0===s?void 0:s.querySelector("ha-selector-text");e&&(i=e),e=null===(a=i.shadowRoot)||void 0===a?void 0:a.querySelector("ha-textarea"),e&&(i=e),i.focus();}n=i&&ta(i.selectionStart)&&ta(i.selectionEnd)?n.substring(0,i.selectionStart)+e+n.substring(i.selectionEnd,n.length):n+e,this._setMessage(n);}_toggleYamlMode(){if(this.viewMode=this.viewMode==Rn.UI?Rn.Yaml:Rn.UI,this.viewMode==Rn.Yaml){let e=Object.assign({},this.config.actions[0]),t="object"==typeof e.data&&ta(e.data)?e.data:{};e=Object.assign(Object.assign({},e),{service:e.service||""}),t.message||(t=Object.assign(Object.assign({},t),{message:""})),Sn(this.hass).find(t=>t.service==e.service&&t.entity_id==e.entity_id)&&("notify"!=ca(e.service)||t.title||(t=Object.assign(Object.assign({},t),{title:""})),"tts"!=ca(e.service)||t.entity_id||(t=Object.assign(Object.assign({},t),{entity_id:""}))),e=Object.assign(Object.assign({},e),{data:t}),this.config=Object.assign(Object.assign({},this.config),{actions:Object.assign(this.config.actions,{0:e})});}}_namePlaceholder(){const e=this.config.triggers[0].event,t=this.config.actions[0].service?ca(this.config.actions[0].service):null;if(!e)return"";if("notify"==t){const t=kn(this.hass,this.config.actions[0]);return t.length?us(`panels.actions.cards.new_notification.fields.name.placeholders.${e}`,this.hass.language,"{target}",t[0].name):"";}if("tts"==t){const t="object"==typeof this.config.actions[0].data&&ta(this.config.actions[0].data)?this.config.actions[0].data.entity_id:null;if(!t||!this.hass.states[t])return"";const s=Ks(this.hass.states[t]);return us(`panels.actions.cards.new_notification.fields.name.placeholders.${e}`,this.hass.language,"{target}",s);}if("telegram_bot"==t){const s=Ys(t);return us(`panels.actions.cards.new_notification.fields.name.placeholders.${e}`,this.hass.language,"{target}",s);}return"";}_messagePlaceholder(){const e=this.config.triggers[0].event;return e?us(`panels.actions.cards.new_notification.fields.message.placeholders.${e}`,this.hass.language):"";}_parseAutomation(){var e;let t=Object.assign({},this.config),s=t.actions[0];return!Ln(null===(e=s.data)||void 0===e?void 0:e.message)&&this.viewMode==Rn.UI&&this._messagePlaceholder()&&(s=Object.assign(Object.assign({},s),{data:Object.assign(Object.assign({},s.data),{message:this._messagePlaceholder()})}),Object.assign(t,{actions:Object.assign(t.actions,{0:s})})),!Ln(t.name)&&this._namePlaceholder()&&(t=Object.assign(Object.assign({},t),{name:this._namePlaceholder()})),t;}_getOpenSensorsFormat(e=!1){var t;const s=((null===(t=this.config.actions[0].data)||void 0===t?void 0:t.message)||"").match(/{{open_sensors(\|[^}]+)?}}/);return null!==s?s[0]:e?"{{open_sensors}}":null;}_setOpenSensorsFormat(e){var t;e.stopPropagation();const s=String(e.detail.value);let a=(null===(t=this.config.actions[0].data)||void 0===t?void 0:t.message)||"";a=a.replace(/{{open_sensors(\|[^}]+)?}}/,s);let i=this.config.actions;Object.assign(i,{0:Object.assign(Object.assign({},i[0]),{service:i[0].service||"",data:Object.assign(Object.assign({},i[0].data||{}),{message:a})})}),this.config=Object.assign(Object.assign({},this.config),{actions:i});}_getArmModeFormat(e=!1){var t;const s=((null===(t=this.config.actions[0].data)||void 0===t?void 0:t.message)||"").match(/{{arm_mode(\|[^}]+)?}}/);return null!==s?s[0]:e?"{{arm_mode}}":null;}_setArmModeFormat(e){var t;e.stopPropagation();const s=String(e.detail.value);let a=(null===(t=this.config.actions[0].data)||void 0===t?void 0:t.message)||"";a=a.replace(/{{arm_mode(\|[^}]+)?}}/,s);let i=this.config.actions;Object.assign(i,{0:Object.assign(Object.assign({},i[0]),{service:i[0].service||"",data:Object.assign(Object.assign({},i[0].data||{}),{message:a})})}),this.config=Object.assign(Object.assign({},this.config),{actions:i});}_saveClick(e){if(!this._validateConfig())return;let t=this._parseAutomation();An(t.triggers[0].area,this.areas).every(e=>{var s;return null===(s=t.triggers[0].modes)||void 0===s?void 0:s.includes(e);})&&(t=Object.assign(Object.assign({},t),{triggers:Object.assign(t.triggers,{0:Object.assign(Object.assign({},t.triggers[0]),{modes:[]})})})),this.item&&(t=Object.assign(Object.assign({},t),{automation_id:this.item.automation_id})),Me(this.hass,t).catch(t=>ia(t,e)).then(()=>this._cancelClick());}_deleteClick(e){var t;(null===(t=this.item)||void 0===t?void 0:t.automation_id)&&window.confirm(`Delete the notification "${this.item.name}"?`)&&He(this.hass,this.item.automation_id).catch(t=>ia(t,e)).then(()=>this._cancelClick());}async _testClick(e){const t=this._parseAutomation();let s=Object.assign({},t.actions[0]),a=s.data.message;a=a.replace("{{open_sensors|format=short}}","Some Example Sensor"),a=a.replace(/{{open_sensors(\|[^}]+)?}}/,"Some Example Sensor is open"),a=a.replace("{{bypassed_sensors}}","Some Bypassed Sensor"),a=a.replace(/{{arm_mode(\|[^}]+)?}}/,"Armed away"),a=a.replace("{{changed_by}}","Some Example User"),a=a.replace("{{delay}}","30"),s=Object.assign(Object.assign({},s),{data:Object.assign(Object.assign({},s.data),{message:a})});let i=Object.assign(Object.assign({},ea(s,"service")),{action:s.service});this.hass.callWS({type:"execute_script",sequence:i}).then().catch(t=>{aa(e,t.message);});}_cancelClick(){la(0,ga("actions"),!0);}static get styles(){return h`
      /* ext: one compact panel (CARD_DESIGN_SYSTEM): accent group subtitles, label and control on one line */
      :host {
        display: block;
        border: 1px solid var(--accent-color);
        border-radius: 10px;
        padding: 4px 12px 8px;
      }
      div.heading {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 4px 0 0;
      }
      div.header {
        flex: 1 1 auto;
        color: var(--primary-color);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        font-weight: 600;
        font-size: 13px;
      }
      div.section-header {
        color: var(--accent-color);
        font-weight: 500;
        font-size: 14px;
        margin: 12px 0 0;
      }
      div.box {
        border-bottom: 1px solid var(--divider-color);
      }
      div.box .card-content {
        padding: 0;
      }
      div.box .card-actions {
        border: none;
        padding: 4px 0 8px;
      }
      div.actions {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 0 4px;
      }
      h2 {
        margin-top: 10px;
        font-size: 18px;
        font-weight: 400;
      }
      span.error-message {
        color: var(--error-color);
      }
      ha-textarea[invalid] {
        --mdc-text-field-idle-line-color: var(--mdc-theme-error);
        --mdc-text-field-label-ink-color: var(--mdc-theme-error);
      }
    `;}};i([ye({attribute:!1})],Bn.prototype,"hass",void 0),i([ye()],Bn.prototype,"narrow",void 0),i([ye()],Bn.prototype,"config",void 0),i([ye()],Bn.prototype,"item",void 0),i([ye()],Bn.prototype,"areas",void 0),i([ye()],Bn.prototype,"hmConfig",void 0),i([ye()],Bn.prototype,"viewMode",void 0),i([ye()],Bn.prototype,"errors",void 0),Bn=i([me("hm-notification-editor-card")],Bn);const In="action",Vn=e=>String(e||"").split(".")[0],Un=e=>({service:"scene"==Vn(e)?"scene.turn_on":"script.turn_on",entity_id:e}),Fn=e=>e.map(Un),Gn=e=>!e||"object"==typeof e&&!Object.keys(e).length,Wn=e=>{const t=Vn(e.entity_id);return"scene.turn_on"==e.service?"scene"==t&&Gn(e.data):"script.turn_on"==e.service&&"script"==t;},qn=e=>e.type==In&&(e.actions||[]).some(e=>Object.keys(e||{}).length&&!Wn(e)),Zn=e=>(e.actions||[]).filter(Wn).map(e=>e.entity_id),Yn=e=>(Array.isArray(e)?e:String(e||"").split(",")).map(e=>String(e).trim()).filter(Boolean),Kn=(e,t)=>{const s=`alarm_event_${(e=>String(e||"").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")||"event")(e)}`.slice(0,60);let a=s;for(let e=2;t.has(a);e++)a=`${s}_${e}`;return t.add(a),a;},Jn=e=>e.filter(e=>e&&e.service).map(e=>`${e.service} ${Yn(e.entity_id).join(", ")}${Gn(e.data)?"":" "+JSON.stringify(e.data)}`.trim()),Xn=async(e,t,s)=>{await e.callApi("POST",`config/script/config/${t}`,s),await e.callService("script","reload",{}).catch(()=>{});};var Qn;!function(e){e[e.Yaml=0]="Yaml",e[e.UI=1]="UI";}(Qn||(Qn={}));let eo=class extends pe{constructor(){super(...arguments),this.config={type:Gs.Action,triggers:[{}],actions:[{}]},this.viewMode=Qn.UI,this.errors={},this.legacy=!1;}async firstUpdated(){if(await _e(),this.areas=await Le(this.hass),this.hmConfig=await we(this.hass),this.item){let e=this.item.actions.map(e=>e.entity_id?e:ea(e,"entity_id"));this.config=Object.assign(Object.assign({},this.item),{actions:[e[0],...e.slice(1)]}),this.config.triggers.length>1&&(this.config=Object.assign(Object.assign({},this.config),{triggers:[this.config.triggers[0]]}));let t=this.config.triggers[0].area;ta(t)&&!xn(this.areas,this.hmConfig).includes(t)?t=void 0:null===t&&(t=0),this._setArea(new CustomEvent("value-changed",{detail:{value:t}})),this.legacy=qn(this.item),this.legacy&&this._hasCustomEntities()&&(this.viewMode=Qn.Yaml);}if(!this.item&&this.preset&&(this.config=Object.assign(Object.assign({},this.config),{actions:Fn([this.preset])})),!ta(this.config.triggers[0].area)){const e=xn(this.areas,this.hmConfig);1==e.length?this._setArea(new CustomEvent("value-changed",{detail:{value:e[0]}})):e.includes(0)&&this._setArea(new CustomEvent("value-changed",{detail:{value:0}}));}!this.item||this.config.triggers[0].area||this.hmConfig.master.enabled||(this.errors=Object.assign(Object.assign({},this.errors),{area:!0}));}render(){var e,t;return this.hass&&this.areas&&this.hmConfig?Z`
      <div class="heading">
        <div class="header">${(null===(e=this.item)||void 0===e?void 0:e.automation_id)&&this.item.name||us("panels.actions.cards.new_action.title",this.hass.language)}</div>
        <ha-button appearance="plain" @click=${this._toggleYamlMode}>
          <ha-icon slot="start" icon="mdi:code-braces"></ha-icon>
          ${this.viewMode==Qn.Yaml?us("components.editor.ui_mode",this.hass.language):us("components.editor.yaml_mode",this.hass.language)}
        </ha-button>
        <ha-icon-button .path=${$s} @click=${this._cancelClick} class="icon" .label=${"Close"}></ha-icon-button>
      </div>
      <div class="description">${us("panels.actions.cards.new_action.description",this.hass.language)}</div>
      <div class="section-header">${us("panels.actions.cards.new_notification.trigger",this.hass.language)}</div>
      <div class="box">
        <div class="card-content">
          <hm-settings-row .narrow=${this.narrow} compact first>
            <span slot="heading">
              ${us("panels.actions.cards.new_action.fields.event.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${us("panels.actions.cards.new_action.fields.event.description",this.hass.language)}
            </span>

            <hm-select
              .hass=${this.hass}
              .items=${Object.values(qs).map(e=>_n(e,this.hass))}
              label=${us("panels.actions.cards.new_action.fields.event.heading",this.hass.language)}
              icons=${!0}
              .value=${this.config.triggers[0].event}
              @value-changed=${this._setEvent}
              ?invalid=${this.errors.event}
              showSearch
            ></hm-select>
          </hm-settings-row>

          ${Object.keys(this.areas).length>1?Z`
                <hm-settings-row .narrow=${this.narrow} compact>
                  <span slot="heading">
                    ${us("panels.actions.cards.new_action.fields.area.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${us("panels.actions.cards.new_action.fields.area.description",this.hass.language)}
                  </span>

                  <hm-select
                    .hass=${this.hass}
                    .items=${xn(this.areas,this.hmConfig).map(e=>wn(e,this.areas,this.hmConfig))}
                    label=${us("panels.actions.cards.new_action.fields.area.heading",this.hass.language)}
                    .value=${String(this.config.triggers[0].area)}
                    @value-changed=${this._setArea}
                    ?invalid=${this.errors.area}
                  ></hm-select>
                </hm-settings-row>
              `:""}

          <hm-settings-row .narrow=${this.narrow} compact last>
            <span slot="heading">
              ${us("panels.actions.cards.new_notification.fields.mode.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${us("panels.actions.cards.new_action.fields.mode.description",this.hass.language)}
            </span>

            <hm-selector
              .hass=${this.hass}
              .items=${An(this.config.triggers[0].area,this.areas).map(e=>$n(e,this.hass))}
              label=${us("panels.actions.cards.new_action.fields.mode.heading",this.hass.language)}
              .value=${this.config.triggers[0].modes||[]}
              @value-changed=${this._setModes}
              ?invalid=${this.errors.modes}
            ></hm-selector>
          </hm-settings-row>
        </div>
      </div>

      <div class="section-header">${"Runs"}</div>
      <div class="box">
        <div class="card-content">
          ${this.viewMode!=Qn.UI||this.legacy?this.viewMode==Qn.UI?Z`
                <div class="legacy-note">
                  This event uses the old built-in list of actions. Use <b>Migrate to scripts</b> above the
                  Alarm Events list to turn it into a native script.
                </div>
                <hm-settings-row .narrow=${this.narrow} compact first>
                  <span slot="heading">
                    ${us("panels.actions.cards.new_action.fields.entity.heading",this.hass.language)}
                  </span>
                  <span slot="description">
                    ${us("panels.actions.cards.new_action.fields.entity.description",this.hass.language)}
                  </span>

                  <hm-selector
                    .hass=${this.hass}
                    .items=${On(En(this.hass,this._getEntities()),this.hass)}
                    ?disabled=${!En(this.hass,this._getEntities()).length}
                    label=${us("panels.actions.cards.new_action.fields.entity.heading",this.hass.language)}
                    .value=${this._getEntities()}
                    @value-changed=${this._setEntity}
                    ?invalid=${this.errors.entity_id}
                    showSearch
                  ></hm-selector>
                </hm-settings-row>

                ${this._getEntities().length?Z`
                      <hm-settings-row .narrow=${this.narrow} compact>
                        <span slot="heading">
                          ${us("panels.actions.cards.new_action.fields.action.heading",this.hass.language)}
                        </span>
                        <span slot="description">
                          ${us("panels.actions.cards.new_action.fields.action.description",this.hass.language)}
                        </span>

                        <div>
                          ${this.renderActions()||us("panels.actions.cards.new_action.fields.action.no_common_actions",this.hass.language)}
                        </div>
                        ${this.errors.service?Z`
                              <span class="error-message">
                                ${this.hass.localize("ui.common.error_required",this.hass.language)}
                              </span>
                            `:""}
                      </hm-settings-row>
                    `:""}
              `:Z`
                <h2>${us("components.editor.edit_in_yaml",this.hass.language)}</h2>

                <ha-yaml-editor
                  .defaultValue=${this.config.actions||""}
                  @value-changed=${this._setYaml}
                ></ha-yaml-editor>

                ${this.errors.service||this.errors.entity_id?Z`
                      <span class="error-message">
                        ${this.hass.localize("ui.errors.config.key_missing","key",Object.entries(this.errors).find(([e,t])=>t&&["service","entity_id"].includes(e))[0])}
                      </span>
                    `:""}
              `:this.renderRun()}
        </div>

        <div class="card-actions">
          <ha-button appearance="plain" ?disabled=${!this._validAction()} @click=${this._testClick}>
            ${us("panels.actions.cards.new_notification.actions.test",this.hass.language)}
            <ha-icon slot="end" icon="hass:arrow-right"></ha-icon>
          </ha-button>
        </div>
      </div>

      <div class="section-header">${us("panels.actions.cards.new_notification.options",this.hass.language)}</div>
      <div class="box">
        <div class="card-content">
          <hm-settings-row .narrow=${this.narrow} compact first>
            <span slot="heading">
              ${us("panels.actions.cards.new_action.fields.name.heading",this.hass.language)}
            </span>
            <span slot="description">
              ${us("panels.actions.cards.new_action.fields.name.description",this.hass.language)}
            </span>

            <ha-input
              label="${us("panels.actions.cards.new_action.fields.name.heading",this.hass.language)}"
              .placeholder=${this._namePlaceholder()}
              .value=${this.config.name||""}
              @input=${this._setName}
              ?invalid=${this.errors.name}
            ></ha-input>
          </hm-settings-row>

        </div>
      </div>

      <div class="actions">
        <ha-button appearance="filled" @click=${this._saveClick}>
          <ha-icon slot="start" icon="hass:content-save-outline"></ha-icon>
          ${this.hass.localize("ui.common.save")}
        </ha-button>
        <ha-button appearance="plain" @click=${this._cancelClick}>${this.hass.localize("ui.common.cancel")}</ha-button>
        <span style="flex:1"></span>
        ${(null===(t=this.item)||void 0===t?void 0:t.automation_id)?Z`<ha-icon-button .label=${this.hass.localize("ui.common.delete")} title=${this.hass.localize("ui.common.delete")}
              @click=${this._deleteClick}><ha-icon icon="mdi:trash-can-outline"></ha-icon></ha-icon-button>`:""}
      </div>
    `:Z``;}renderRun(){const e=Object.keys(this.hass.states).filter(e=>e.startsWith("script.")).sort((e,t)=>String(this.hass.states[e].attributes.friendly_name||e).localeCompare(String(this.hass.states[t].attributes.friendly_name||t))),t=Zn(this.config);return Z`
      <hm-settings-row .narrow=${this.narrow} compact first>
        <span slot="heading">Scripts</span>
        <span slot="description">
          Run these Home Assistant scripts, in this order. Scripts get the variables <code>event</code>,
          <code>area</code> and <code>arm_mode</code>. Create them in Home Assistant.
        </span>
        <hm-selector
          .hass=${this.hass}
          .items=${On([...new Set([...e,...t])],this.hass)}
          ?disabled=${!e.length&&!t.length}
          label="Scripts"
          .value=${t}
          @value-changed=${this._setRun}
          ?invalid=${this.errors.entity_id||this.errors.service}
          showSearch
        ></hm-selector>
      </hm-settings-row>
    `;}_setRun(e){e.stopPropagation();const t=e.detail.value||[];this.config=Object.assign(Object.assign({},this.config),{actions:t.length?Fn(t):[{}]}),Object.keys(this.errors).length&&this._validateConfig();}renderActions(){let e=this.config.actions.map(e=>e.entity_id),t=jn(e,this.hass);if(!t.length)return;const s=(...e)=>!!e.every(ta)&&1==Js(Cn(e.filter(ta))).length;return t.map(e=>Z`
        <ha-button
          appearance="${s(this._selectedAction(),e)?"filled":"plain"}"
          variant="${s(this._selectedAction(),e)?"brand":"neutral"}"
          @click=${()=>this._setAction(e)}
        >
          ${((e,t)=>{let s=da(e);switch("script"==ca(e)&&(s="run"),s){case"turn_on":return t.localize("ui.card.media_player.turn_on");case"turn_off":return t.localize("ui.card.media_player.turn_off");case"lock":return t.localize("ui.card.lock.lock");case"unlock":return t.localize("ui.card.lock.unlock");case"run":return t.localize("ui.card.script.run");default:return s;}})(e,this.hass)}
        </ha-button>
      `);}_selectedAction(){let e=this.config.actions.map(e=>e.service);return e.every(ta)?(e=Js(Cn(e.filter(ta))),1==e.length?e[0]:null):null;}_setEvent(e){e.stopPropagation();const t=e.detail.value;let s=this.config.triggers;Object.assign(s,{0:Object.assign(Object.assign({},s[0]),{event:t})}),this.config=Object.assign(Object.assign({},this.config),{triggers:s}),Object.keys(this.errors).includes("event")&&this._validateConfig();}_setArea(e){var t;e.stopPropagation();let s=e.detail.value;"0"===s&&(s=0);let a=this.config.triggers;Object.assign(a,{0:Object.assign(Object.assign({},a[0]),{area:s})});const i=An(s,this.areas);(null===(t=a[0].modes)||void 0===t?void 0:t.length)&&this._setModes(new CustomEvent("value-changed",{detail:{value:a[0].modes.filter(e=>i.includes(e))}})),this.config=Object.assign(Object.assign({},this.config),{triggers:a}),Object.keys(this.errors).includes("area")&&this._validateConfig();}_setModes(e){e.stopPropagation();const t=e.detail.value,s=this.config.triggers;Object.assign(s,{0:Object.assign(Object.assign({},s[0]),{modes:t})}),this.config=Object.assign(Object.assign({},this.config),{triggers:s}),Object.keys(this.errors).includes("service")&&this._validateConfig();}_setEntity(e){e.stopPropagation();const t=e.detail.value;let s=this.config.actions,a=null;if(t.length>s.length&&this._selectedAction()&&(a=this._selectedAction()),s.length>t.length){let e=s.findIndex(e=>!t.includes(e.entity_id||""));e<0&&(e=s.length-1),s.splice(e,1);}t.length||Object.assign(s,{0:ea(s[0],"entity_id")}),t.forEach((e,t)=>{let a=s.length>t?Object.assign({},s[t]):{};a=a.entity_id==e?Object.assign({},a):{entity_id:e},Object.assign(s,{[t]:a});}),this.config=Object.assign(Object.assign({},this.config),{actions:s}),a&&this._setAction(a),Object.keys(this.errors).includes("entity_id")&&this._validateConfig();}_setAction(e){let t=this.config.actions,s=this.config.actions.map(e=>e.entity_id);jn(s,this.hass).length&&(t.forEach((s,a)=>{let i=jn(s.entity_id,this.hass),n=(o=e,i.find(e=>e==o||"turn_on"==da(o)&&"turn_on"==da(e)||"turn_off"==da(o)&&"turn_off"==da(e)||"script"==ca(o)&&"script"==ca(e)));var o;Object.assign(t,{[a]:Object.assign({service:n},ea(s,"service"))});}),this.config=Object.assign(Object.assign({},this.config),{actions:t}),Object.keys(this.errors).includes("service")&&this._validateConfig());}_setName(e){e.stopPropagation();const t=e.target.value;this.config=Object.assign(Object.assign({},this.config),{name:t});}_setYaml(e){let t=e.detail.value,s=[{}];var a;Pn(t)&&(t=[t]),"object"==typeof(a=t)&&null!==a&&Array.isArray(a)&&(t.forEach((e,t)=>{let a={};Pn(e)&&Nn(e.service)&&(a=Object.assign(Object.assign({},a),{service:e.service})),Pn(e)&&Nn(e.entity_id)&&(a=Object.assign(Object.assign({},a),{entity_id:e.entity_id})),Pn(e)&&Pn(e.data)&&(a=Object.assign(Object.assign({},a),{data:e.data})),Object.assign(s,{[t]:a});}),this.config=Object.assign(Object.assign({},this.config),{actions:s}));}_validateConfig(){this.errors={};const e=this._parseAutomation(),t=e.triggers[0];t.event&&Object.values(qs).includes(t.event)||(this.errors=Object.assign(Object.assign({},this.errors),{event:!0})),ta(t.area)&&xn(this.areas,this.hmConfig).includes(t.area)||(this.errors=Object.assign(Object.assign({},this.errors),{area:!0})),(t.modes||[]).every(e=>An(t.area,this.areas).includes(e))||(this.errors=Object.assign(Object.assign({},this.errors),{modes:!0}));let s=e.actions.map(e=>e.entity_id);this.viewMode==Qn.Yaml&&(s=s.filter(ta)),e.actions.length&&s.every(e=>zn(e,this.hass))||(this.errors=Object.assign(Object.assign({},this.errors),{entity_id:!0}));const a=e.actions.map(e=>e.service).filter(ta);if(!a.length||!a.every(e=>Tn(e,this.hass))){this.errors=Object.assign(Object.assign({},this.errors),{service:!0}),!jn(s,this.hass).length&&a.length&&(this.viewMode=Qn.Yaml);}return Ln(e.name)||(this.errors=Object.assign(Object.assign({},this.errors),{name:!0})),!Object.values(this.errors).length;}_validAction(){const e=this._parseAutomation(),t=e.actions.map(e=>e.service);let s=e.actions.map(e=>e.entity_id);return this.viewMode==Qn.Yaml&&(s=s.filter(ta)),t.length&&t.every(e=>Tn(e,this.hass))&&s.every(e=>zn(e,this.hass));}_toggleYamlMode(){this.viewMode=this.viewMode==Qn.UI?Qn.Yaml:Qn.UI,this.viewMode==Qn.Yaml&&(this.config=Object.assign(Object.assign({},this.config),{actions:Object.assign(this.config.actions,{0:Object.assign(Object.assign({},this.config.actions[0]),{service:this.config.actions[0].service||"",data:Object.assign({},this.config.actions[0].data||{})})})}));}_namePlaceholder(){var e,t,s,a;if(!this.legacy&&this.viewMode==Qn.UI){const e=On(Zn(this.config),this.hass).map(e=>e.name),t=this.config.triggers[0].event;return t&&e.length?`${_n(t,this.hass).name}: ${e.join(", ")}`:"";}if(!this._validAction)return"";const i=this.config.triggers[0].event,n=this.config.actions.map(e=>e.entity_id).filter(ta),o=On(n,this.hass).map(e=>e.name).join(", "),r=Js(this.config.actions.map(e=>e.service).filter(ta).map(e=>da(e)));let l;return 1==r.length&&(null===(e=r[0])||void 0===e?void 0:e.includes("turn_on"))&&(l=this.hass.localize("state.default.on")),1==r.length&&(null===(t=r[0])||void 0===t?void 0:t.includes("turn_off"))&&(l=this.hass.localize("state.default.off")),1==r.length&&(null===(s=r[0])||void 0===s?void 0:s.includes("lock"))&&(l=this.hass.localize("component.lock.state._.locked")),1==r.length&&(null===(a=r[0])||void 0===a?void 0:a.includes("unlock"))&&(l=this.hass.localize("component.lock.state._.unlocked")),i&&o&&l?us(`panels.actions.cards.new_action.fields.name.placeholders.${i}`,this.hass.language,"entity",o,"state",l):"";}_getEntities(){return Js(this.config.actions.map(e=>e.entity_id).filter(ta))||[];}_hasCustomEntities(){return this._getEntities().some(e=>!En(this.hass).includes(e));}_parseAutomation(){let e=Object.assign({},this.config);return!Ln(e.name)&&this._namePlaceholder()&&(e=Object.assign(Object.assign({},e),{name:this._namePlaceholder()})),e;}_saveClick(e){if(!this._validateConfig())return;let t=this._parseAutomation();An(t.triggers[0].area,this.areas).every(e=>{var s;return null===(s=t.triggers[0].modes)||void 0===s?void 0:s.includes(e);})&&(t=Object.assign(Object.assign({},t),{triggers:Object.assign(t.triggers,{0:Object.assign(Object.assign({},t.triggers[0]),{modes:[]})})})),Me(this.hass,t).catch(t=>ia(t,e)).then(()=>this._cancelClick());}_deleteClick(e){var t;(null===(t=this.item)||void 0===t?void 0:t.automation_id)&&window.confirm(`Delete the Alarm Event "${this.item.name}"?`)&&He(this.hass,this.item.automation_id).catch(t=>ia(t,e)).then(()=>this._cancelClick());}_testClick(e){this._parseAutomation().actions.forEach(t=>{const[s,a]=t.service.split(".");let i=Object.assign({},t.data);t.entity_id&&(i=Object.assign(Object.assign({},i),{entity_id:t.entity_id})),this.hass.callService(s,a,i).then().catch(t=>{aa(e,t.message);});});}_cancelClick(){la(0,ga("actions"),!0);}static get styles(){return h`
      /* ext: one compact panel (CARD_DESIGN_SYSTEM), the same as the notification editor */
      :host {
        display: block;
        border: 1px solid var(--accent-color);
        border-radius: 10px;
        padding: 4px 12px 8px;
      }
      div.heading {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 4px 0 0;
      }
      div.header {
        flex: 1 1 auto;
        color: var(--primary-color);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        font-weight: 600;
        font-size: 13px;
      }
      div.description {
        color: var(--secondary-text-color);
        font-size: 13px;
      }
      div.section-header {
        color: var(--accent-color);
        font-weight: 500;
        font-size: 14px;
        margin: 12px 0 0;
      }
      div.box {
        border-bottom: 1px solid var(--divider-color);
      }
      div.box .card-content {
        padding: 0;
      }
      div.box .card-actions {
        border: none;
        padding: 4px 0 8px;
      }
      div.actions {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 0 4px;
      }
      h2 {
        margin-top: 10px;
        font-size: 18px;
        font-weight: 400;
      }
      div.legacy-note {
        margin: 8px 0;
        padding: 8px 12px;
        border: 1px solid var(--warning-color, #ff9800);
        border-radius: 8px;
      }
      span.error-message {
        color: var(--error-color);
        font-size: 0.875rem;
        display: flex;
        margin-top: 10px;
      }
    `;}};i([ye({attribute:!1})],eo.prototype,"hass",void 0),i([ye()],eo.prototype,"narrow",void 0),i([ye()],eo.prototype,"config",void 0),i([ye()],eo.prototype,"item",void 0),i([ye()],eo.prototype,"preset",void 0),i([ye()],eo.prototype,"areas",void 0),i([ye()],eo.prototype,"hmConfig",void 0),i([ye()],eo.prototype,"viewMode",void 0),i([ye()],eo.prototype,"errors",void 0),i([ye()],eo.prototype,"legacy",void 0),eo=i([me("hm-automation-editor-card")],eo);const to=e=>new Promise(t=>setTimeout(t,e));let so=class extends pe{constructor(){super(...arguments),this.events=[],this.plan=null,this.busy=!1,this.results=null;}legacy(){return this.events.filter(qn);}preview(){var e,t,s;this.results=null,this.plan=(e=this.legacy(),s=this.hass,t=new Set(Object.keys(s.states).filter(e=>e.startsWith("script.")).map(e=>e.slice(7))),e.filter(e=>e.type==In).map(e=>{const s=e.name||"Alarm Event";return qn(e)?{kind:"script",event:e,reason:"",scriptId:Kn(s,t),script:{alias:s,icon:"mdi:shield-home-outline",description:`Migrated from the Alarm Event "${s}". Variables: event, area, arm_mode.`,mode:"queued",sequence:(a=e.actions,a.filter(e=>e&&e.service).map(e=>{const t={action:e.service},s=Yn(e.entity_id);return s.length&&(t.target={entity_id:1==s.length?s[0]:s}),Gn(e.data)||(t.data=e.data),t;}))},summary:Jn(e.actions)}:{kind:"skip",event:e,reason:"already runs scripts"};var a;}));}async waitFor(e){for(let t=0;t<30;t++){const t=e();if(t)return t;await to(300);}return null;}async migrate(){if(!this.plan)return;this.busy=!0;const e=[];try{await ya(this.hass,"before Alarm Events migration");}catch(e){return this.busy=!1,void(this.results=[{name:"Backup",ok:!1,text:`Not migrated: the backup failed (${(null==e?void 0:e.message)||e}).`}]);}for(const t of this.plan){if("skip"==t.kind)continue;const s=t.event.name||"Alarm Event";try{await Xn(this.hass,t.scriptId,t.script);const a=await this.waitFor(()=>this.hass.states[`script.${t.scriptId}`]?`script.${t.scriptId}`:null);if(!a)throw new Error("the new script did not appear in Home Assistant");await Me(this.hass,{automation_id:t.event.automation_id,actions:Fn([a])}),e.push({name:s,ok:!0,text:`now runs ${a}`});}catch(t){e.push({name:s,ok:!1,text:`not changed: ${(null==t?void 0:t.message)||t}`});}}this.busy=!1,this.plan=null,this.results=e,this.dispatchEvent(new CustomEvent("events-migrated",{bubbles:!0,composed:!0}));}render(){const e=this.legacy().length;return e||this.results?Z`
      <div class="box">
        ${this.results?Z`
              <div class="title">Migration finished</div>
              <ul>
                ${this.results.map(e=>Z`<li class=${e.ok?"ok":"bad"}><b>${e.name}</b>: ${e.text}</li>`)}
              </ul>
              <ha-button appearance="plain" @click=${()=>this.results=null}>Close</ha-button>
            `:this.plan?this.renderPlan():Z`
                <div class="title">${e} Alarm Event${1==e?"":"s"} still use the old built-in list of actions</div>
                <p>
                  Alarm Events now run native Home Assistant scripts, the same as House Modes. Migrating turns each
                  event's actions into a script. The event keeps its trigger and runs the new script. A backup is made
                  first, and you see the plan before anything changes.
                </p>
                <ha-button appearance="filled" @click=${this.preview}>Migrate to scripts…</ha-button>
              `}
      </div>
    `:K;}renderPlan(){const e=this.plan.filter(e=>"skip"!=e.kind);return Z`
      <div class="title">Migration plan</div>
      <table>
        <thead><tr><th>Alarm Event</th><th>Becomes</th><th>Contents</th></tr></thead>
        <tbody>
          ${e.map(e=>Z`<tr>
              <td>${e.event.name}</td>
              <td>
                script <code>script.${e.scriptId}</code>
              </td>
              <td>${e.summary.map(e=>Z`<div><code>${e}</code></div>`)}</td>
            </tr>`)}
        </tbody>
      </table>
      <div class="actions">
        <ha-button appearance="filled" ?disabled=${this.busy||!e.length} @click=${this.migrate}>
          ${this.busy?"Migrating…":`Migrate ${e.length}`}
        </ha-button>
        <ha-button appearance="plain" ?disabled=${this.busy} @click=${()=>this.plan=null}>Cancel</ha-button>
      </div>
    `;}};so.styles=h`
    .box {
      margin: 8px 16px 12px;
      padding: 10px 14px;
      border-left: 3px solid var(--primary-color);
      background: rgba(3, 169, 244, 0.06);
    }
    .title {
      font-weight: 600;
      color: var(--primary-color);
      text-transform: uppercase;
      font-size: 0.85rem;
      letter-spacing: 0.04em;
      margin-bottom: 4px;
    }
    p {
      margin: 4px 0 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 6px 0;
    }
    th,
    td {
      text-align: left;
      padding: 6px 8px;
      border-bottom: 1px solid var(--divider-color);
      vertical-align: top;
    }
    th {
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .why {
      color: var(--secondary-text-color);
      font-size: 0.85em;
    }
    .actions {
      display: flex;
      gap: 8px;
      margin-top: 6px;
    }
    li.ok b {
      color: var(--success-color, #4caf50);
    }
    li.bad b {
      color: var(--error-color);
    }
  `,i([ye({attribute:!1})],so.prototype,"hass",void 0),i([ye({attribute:!1})],so.prototype,"events",void 0),i([be()],so.prototype,"plan",void 0),i([be()],so.prototype,"busy",void 0),i([be()],so.prototype,"results",void 0),so=i([me("hm-event-migrate")],so);const ao=[{key:"house_mode",label:"House Mode",hint:"watches the House Mode"},{key:"alarm",label:"Alarm & safety",hint:"alarm zones, doors, windows, motion, fire, CO, gas, leaks"},{key:"security",label:"Security",hint:"cameras, locks, doorbells"},{key:"other",label:"Other",hint:"everything else (temperatures, appliances, …)"}],io=e=>{let t=0;if("number"==typeof e)t=e;else if("string"==typeof e){const s=e.split(":").map(Number);t=3===s.length?3600*s[0]+60*s[1]+s[2]:Number(e)||0;}else if(e&&"object"==typeof e){const s=e;t=86400*(s.days||0)+3600*(s.hours||0)+60*(s.minutes||0)+(s.seconds||0);}return t?t%3600==0?t/3600+" h":t%60==0?t/60+" min":`${t} s`:"";},no=async(e,t,s)=>{const a=String(Date.now());return await e.callApi("POST",`config/automation/config/${a}`,{alias:t,description:"Smart Repeating Alerts (made on the Notifications tab)",use_blueprint:{path:s,input:{}}}),a;},oo={keys:new Set(["on","off","camera","test","old"]),cats:new Set(["house_mode","alarm","security"])};let ro=class extends pe{constructor(){super(...arguments),this.embedded=!1,this.error="",this.busy=!1,this.lastSummary="",this.name=e=>{var t;return(null===(t=this.hass.states[e])||void 0===t?void 0:t.attributes.friendly_name)||e;};}firstUpdated(){this.load();}async load(){try{this.info=await(e=this.hass,e.callWS({type:"house_modes/ext/alerts/get"})),this.error="";}catch(e){this.error=ba(e);}var e;}later(){window.setTimeout(()=>this.load(),900);}async install(e=!1){this.busy=!0;try{await((e,t=!1)=>e.callWS({type:"house_modes/ext/alerts/install",force:t}))(this.hass,e),_a(this,"Smart Repeating Alerts blueprint installed."),await this.load();}catch(e){this.error=ba(e);}finally{this.busy=!1;}}async add(){const e=window.prompt("Name of the new alert","Smart Repeating Alert - ");if(e){this.busy=!0;try{const t=await no(this.hass,e.trim(),this.info.blueprint.path);la(0,`/config/automation/edit/${t}`);}catch(e){this.error=ba(e);}finally{this.busy=!1;}}}async deleteOne(e){var t,s;if(e.edit_id&&window.confirm(`Delete the automation "${e.name}"?`))try{await(t=this.hass,s=e.edit_id,t.callApi("DELETE",`config/automation/config/${s}`)),_a(this,`${e.name} deleted.`),this.later();}catch(e){this.error=ba(e);}}async setEnabled(e,t){await this.hass.callService("automation",t?"turn_on":"turn_off",{entity_id:e.entity_id}),this.later();}async run(e){await this.hass.callService("automation","trigger",{entity_id:e.entity_id,skip_condition:!1}),_a(this,`Ran ${e.name}.`);}row(e){const t=e.edit_id?`/config/automation/edit/${e.edit_id}`:null,s="on"===e.state;return Z`<div class="sa-row ${s?"":"off"}">
      <ha-icon class="sa-icon" icon=${e.summary.camera?"mdi:cctv":e.summary.critical?"mdi:alarm-light-outline":"mdi:bell-ring-outline"}></ha-icon>
      <div class="sa-name">
        ${t?Z`<button class="link" title="Open in Home Assistant's editor" @click=${()=>la(0,t)}>${e.name}</button>`:Z`<span>${e.name}</span>`}
        <span class="secondary">${((e,t)=>{const s=e.summary,a=[];s.triggers.length&&a.push(s.triggers.slice(0,3).map(e=>e.includes(".")?t(e):e).join(", ")+(s.triggers.length>3?" +"+(s.triggers.length-3):""));const i=s.devices+s.services;return a.push(i?`${i} target${1===i?"":"s"}`:"no targets"),s.repeat&&a.push(`repeats${io(s.repeat_every)?` every ${io(s.repeat_every)}`:""}${s.max_repeats?` (max ${s.max_repeats})`:""}`),s.camera&&a.push(`camera ${t(s.camera)}`),s.buttons&&a.push(`${s.buttons} button${1===s.buttons?"":"s"}`),s.critical&&a.push("critical"),s.test_mode&&a.push("TEST MODE"),a.join(" · ");})(e,this.name)}</span>
        ${e.old?Z`<span class="sa-old"><ha-icon icon="mdi:alert"></ha-icon>Uses ${e.old}: change its blueprint to Smart Repeating Alerts (the converted YAML is ready).</span>`:K}
      </div>
      <button class="sa-chip ${s?"on":""}" title=${s?"Enabled: click to disable":"Disabled: click to enable"} @click=${()=>this.setEnabled(e,!s)}>${s?"Enabled":"Disabled"}</button>
      <ha-icon-button .label=${"Run now"} title="Run now (as if triggered)" @click=${()=>this.run(e)}><ha-icon icon="mdi:play"></ha-icon></ha-icon-button>
      ${t?Z`<ha-icon-button .label=${"Edit"} title="Edit in Home Assistant" @click=${()=>la(0,t)}><ha-icon icon="mdi:pencil"></ha-icon></ha-icon-button>`:K}
      ${e.edit_id?Z`<ha-icon-button class="sa-del" .label=${"Delete"} title="Delete" @click=${()=>this.deleteOne(e)}><ha-icon icon="mdi:trash-can-outline"></ha-icon></ha-icon-button>`:K}
    </div>`;}render(){const e=this.info,t=(null==e?void 0:e.items)||[],s=e=>["on"===e.state?"on":"off",e.summary.camera?"camera":"",e.summary.test_mode?"test":"",e.old?"old":""].filter(Boolean),a=e=>e.categories&&e.categories.length?e.categories:["other"],i=e=>s(e).every(e=>oo.keys.has(e))&&a(e).some(e=>oo.cats.has(e)),n=Ha(ao.map(e=>({key:e.key,label:e.label,hint:e.hint,count:t.filter(t=>a(t).includes(e.key)).length})),oo.cats,e=>{oo.cats=e,this.requestUpdate();},"About"),o=e=>t.filter(t=>s(t).includes(e)).length,r=Ha([{key:"on",label:"Enabled",count:o("on")},{key:"off",label:"Disabled",count:o("off")},{key:"camera",label:"Cameras",count:o("camera")},{key:"test",label:"Test mode",count:o("test")},{key:"old",label:"On old blueprints",count:o("old")}],oo.keys,e=>{oo.keys=e,this.requestUpdate();}),l=t.filter(e=>!e.old&&i(e)),c=t.filter(e=>e.old&&i(e)),d=t.length-l.length-c.length,h=null==e?void 0:e.blueprint,p=t.filter(e=>!e.old).length,u=t.length-p,m=e?`${p} alert${1===p?"":"s"}${u?` · ${u} on old blueprints`:""} · ${o("on")} enabled`:"loading…";this.embedded&&m!==this.lastSummary&&(this.lastSummary=m,this.dispatchEvent(new CustomEvent("alerts-summary",{detail:m})));const g=Z`
      <div class="card-content desc">
        <p>Repeating, actionable alerts for doors, windows, leaks, smoke, cameras and anything else with a trigger: each one
          a Home Assistant automation made from the <em>Smart Repeating Alerts</em> blueprint, with repeats until cleared, buttons,
          camera snapshots, critical alerts and a test mode. They are listed here and edited in Home Assistant's editor,
          so they keep traces and are in every backup.</p>
        <p class="secondary">Alarm messages (armed, triggered, failed to arm) are set up under <em>Alarm notifications</em>.</p>
      </div>
      ${this.error?Z`<div class="notice error" style="margin:0 16px 12px">${this.error}</div>`:K}
      ${h?Z`<div class="sa-bp">
            <ha-icon icon=${h.installed?"mdi:check-circle":"mdi:alert-circle-outline"} class=${h.installed?"ok":"warn"}></ha-icon>
            ${h.installed?Z`<span>Blueprint <code>${h.path}</code> ${h.installed_version?`v${h.installed_version}`:""}
                  ${h.update?Z`· <strong>v${h.shipped_version} is available</strong>`:K}
                  ${h.ours?K:Z`· <span class="secondary" style="display:inline">not the copy that ships with this integration</span>`}</span>`:Z`<span>The Smart Repeating Alerts blueprint is not installed yet.</span>`}
            ${!h.installed||h.update?Z`<ha-button ?disabled=${this.busy} @click=${()=>this.install()}>${h.installed?"Update":"Install"} blueprint</ha-button>`:K}
          </div>`:K}
      <div class="toolbar">
        <ha-button ?disabled=${this.busy||!(null==h?void 0:h.installed)} @click=${this.add}><ha-icon slot="start" icon="mdi:plus"></ha-icon>New alert</ha-button>
        <ha-button appearance="plain" @click=${()=>la(0,"/config/blueprint/dashboard")}><ha-icon slot="start" icon="mdi:file-document-outline"></ha-icon>Blueprints</ha-button>
        <ha-button appearance="plain" @click=${()=>this.load()}><ha-icon slot="start" icon="mdi:refresh"></ha-icon>Refresh</ha-button>
      </div>
      ${t.length?Z`${n}${r}`:K}
      <div class="sa-list">
        ${l.map(e=>this.row(e))}
        ${c.length?Z`<div class="sa-group">Still on the old blueprints</div>${c.map(e=>this.row(e))}`:K}
        ${d?Z`<div class="secondary sa-hidden">${d} hidden by the filters above.</div>`:K}
        ${e&&!t.length?Z`<div class="empty">No Smart Repeating Alerts yet. <em>New alert</em> makes one and opens it in Home Assistant's editor.</div>`:K}
      </div>
    `;return this.embedded?g:((e,t,s,a,i,n)=>Z`<ha-card class="fold-card">
    <details class="collapse top" ?open=${!!Ca[e]} @toggle=${t=>Ca[e]=t.target.open}>
      <summary>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        <ha-icon class="fold-icon" icon=${t}></ha-icon>
        <span class="fold-title">${s}</span>
        <span class="secondary" style="display:inline">${a}</span>
        <span class="grow"></span>
        ${Oa(i)}
      </summary>
      <div class="fold-body">${n}</div>
    </details>
  </ha-card>`)("smart-alerts","mdi:bell-ring-outline","Smart Repeating Alerts",m,"settings",g);}};ro.styles=[ka,h`
      :host {
        display: block;
        margin-bottom: 16px;
      }
      .sa-bp {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        margin: 0 16px 8px;
      }
      .sa-bp ha-icon.ok {
        color: var(--success-color, #4caf50);
      }
      .sa-bp ha-icon.warn {
        color: var(--warning-color, #ff9800);
      }
      .sa-list {
        padding: 0 16px 12px;
      }
      .sa-group {
        color: var(--accent-color);
        font-weight: 500;
        font-size: 14px;
        margin: 12px 0 2px;
      }
      .sa-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 4px 0;
        border-top: 1px solid var(--divider-color);
      }
      .sa-row.off .sa-name button,
      .sa-row.off .sa-icon {
        opacity: 0.55;
      }
      .sa-icon {
        color: var(--primary-color);
        margin: 0 4px;
      }
      .sa-name {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex: 1 1 auto;
        min-width: 0;
      }
      .sa-old {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--warning-color, #ff9800);
        font-size: 13px;
        --mdc-icon-size: 16px;
      }
      .sa-chip {
        border: 1px solid var(--divider-color);
        border-radius: 14px;
        padding: 1px 10px;
        background: none;
        color: var(--secondary-text-color);
        font: inherit;
        font-size: 12px;
        cursor: pointer;
      }
      .sa-chip.on {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
      .sa-hidden {
        display: block;
        padding: 6px 0 0;
      }
      .sa-del:hover {
        color: var(--error-color);
      }
    `],i([ye({attribute:!1})],ro.prototype,"hass",void 0),i([ye({type:Boolean})],ro.prototype,"embedded",void 0),i([be()],ro.prototype,"info",void 0),i([be()],ro.prototype,"error",void 0),i([be()],ro.prototype,"busy",void 0),ro=i([me("hm-smart-alerts")],ro);const lo={notifications:new Set(["on","off","warning"]),events:new Set(["on","off","warning","legacy"])},co="no_area";let ho=class extends ze(pe){constructor(){super(...arguments),this.areas={},this.alertsSummary="",this.getAreaForAutomation=e=>{if(!this.config)return;const t=xn(this.areas,this.config);let s=e.triggers[0].area;return ta(s)&&t.includes(s)?s:void 0;};}hassSubscribe(){return this._fetchData(),[this.hass.connection.subscribeMessage(()=>this._fetchData(),{type:"house_modes_config_updated"})];}async _fetchData(){if(!this.hass)return;const e=await Ae(this.hass);this.automations=Object.values(e),this.areas=await Le(this.hass),this.config=await we(this.hass);}firstUpdated(){var e;this.path.filter&&(this.selectedArea=null===(e=this.path.filter)||void 0===e?void 0:e.area),(async()=>{await $e();})();}render(){if(!this.hass||!this.automations||!this.config)return Z``;const e=(()=>{if("new_notification"==this.path.subpage)return Z`<hm-notification-editor-card .hass=${this.hass} .narrow=${this.narrow}></hm-notification-editor-card>`;if(this.path.params.edit_notification){const e=this.automations.find(e=>e.automation_id==this.path.params.edit_notification&&e.type==Gs.Notification);return Z`<hm-notification-editor-card .hass=${this.hass} .narrow=${this.narrow} .item=${e}></hm-notification-editor-card>`;}if("new_action"==this.path.subpage)return Z`<hm-automation-editor-card .hass=${this.hass} .narrow=${this.narrow} .preset=${this.path.params.scene}></hm-automation-editor-card>`;if(this.path.params.edit_action){const e=this.automations.find(e=>e.automation_id==this.path.params.edit_action&&e.type==Gs.Action);return Z`<hm-automation-editor-card .hass=${this.hass} .narrow=${this.narrow} .item=${e}></hm-automation-editor-card>`;}return null;})();{const t=this.automations.filter(e=>e.type==Gs.Notification).map(e=>Object(Object.assign(Object.assign({},e),{id:e.automation_id,warning:!this.config.master.enabled&&!this.getAreaForAutomation(e),area:this.getAreaForAutomation(e)||co}))),s=this.automations.filter(e=>e.type==Gs.Action).map(e=>Object(Object.assign(Object.assign({},e),{id:e.automation_id,warning:!this.config.master.enabled&&!this.getAreaForAutomation(e),area:this.getAreaForAutomation(e)||co}))),a="actions"!==this.section,i="notifications"!==this.section;return Z`
        ${a&&e?this.renderNotifications(e,t):""}
        ${a&&!e?za("Notifications","settings",Z`<p>Alerts and messages sent to your phones. <em>Smart Repeating Alerts</em> are Home
              Assistant automations (doors, windows, leaks, cameras …); <em>Alarm notifications</em> are sent on alarm events.
              House Mode messages are set on the House Modes tab.</p>`,Z`
              ${Ta("smart-alerts","Smart Repeating Alerts",this.alertsSummary,Z`<hm-smart-alerts embedded .hass=${this.hass}
                  @alerts-summary=${e=>{this.alertsSummary=e.detail,this.requestUpdate();}}></hm-smart-alerts>`)}
              ${Ta("alarm-notifications","Alarm notifications",`${t.length} notification${1===t.length?"":"s"} · ${t.filter(e=>e.enabled).length} enabled`,this.renderNotifications(e,t,!0))}`):""}

        ${i?this.renderAlarmEvents(e,s):""}
      `;}}renderAlarmEvents(e,t){const s=t,a=e=>[e.enabled?"on":"off",e.warning?"warning":"",qn(e)?"legacy":""].filter(Boolean),i=e=>s.filter(t=>a(t).includes(e)).length;t=s.filter(e=>a(e).every(e=>lo.events.has(e)));const n=s.length-t.length,o=s.length?Ha([{key:"on",label:"Enabled",count:i("on")},{key:"off",label:"Disabled",count:i("off")},{key:"warning",label:"No partition (warning)",count:i("warning")},{key:"legacy",label:"Old list of actions",count:i("legacy")}],lo.events,e=>{lo.events=e,this.requestUpdate();}):K,r=this.hass,l=r.language,c=Object.values(qs),d=c.map(e=>({ev:e,items:t.filter(t=>t.triggers[0].event===e).sort((e,t)=>(e.name||"").localeCompare(t.name||""))})).filter(e=>e.items.length),h=t.filter(e=>!c.includes(e.triggers[0].event)),p=e=>e.area===co?this.config.master.enabled?this.config.master.name:"—":wn(e.area,this.areas,this.config).name,u=e=>la(0,ga("actions",{params:{edit_action:e.automation_id}}),!0),m=e=>{const t=e.triggers[0],s=_n(t.event,r),a=(t.modes||[]).map(e=>{var t;return(null===(t=$n(e,r))||void 0===t?void 0:t.name)||e;}).join(", "),i=qn(e);return Z`<div class="nt-row ${e.enabled?"":"off"}">
        <ha-icon class="nt-icon" icon=${e.warning?"mdi:alert":(null==s?void 0:s.icon)||"mdi:flash"}
          style=${e.warning?"color:var(--error-color)":""}
          title=${e.warning?us("panels.actions.cards.notifications.table.no_area_warning",l):""}></ha-icon>
        <div class="nt-name">
          <button class="link" @click=${()=>u(e)}>${e.name}</button>
          <span class="secondary" style=${i?"color:var(--warning-color,#ff9800)":""}>${p(e)}${a?` · ${a}`:""} → ${(e=>{if(qn(e))return"old list of actions: migrate it to a script";const t=Zn(e).map(e=>{var t;return(null===(t=r.states[e])||void 0===t?void 0:t.attributes.friendly_name)||e;});return t.length?t.join(", "):"runs nothing yet";})(e)}</span>
        </div>
        <button class="nt-chip ${e.enabled?"on":""}" title=${e.enabled?"Enabled: click to disable":"Disabled: click to enable"}
          @click=${()=>this.setEnabled(e.automation_id,!e.enabled)}>${e.enabled?"Enabled":"Disabled"}</button>
        <ha-icon-button .label=${"Edit"} title="Edit" @click=${()=>u(e)}><ha-icon icon="mdi:pencil"></ha-icon></ha-icon-button>
        <ha-icon-button .label=${"Delete"} title="Delete" @click=${()=>this.deleteEvent(e)}><ha-icon icon="mdi:trash-can-outline"></ha-icon></ha-icon-button>
      </div>`;};return Z`
      <ha-card>${Sa("Alarm Events","settings")}
        <div class="card-content desc">
          <p>Scripts that run when the alarm arms, disarms, triggers, fails to arm and more, per partition. Scripts get the
            variables <code>event</code>, <code>area</code> and <code>arm_mode</code>. What runs when the House Mode changes
            is set on the <a href="/house_modes/house">House Modes</a> tab.</p>
        </div>
        <div class="toolbar">
          <ha-button ?disabled=${!!e} @click=${this.addActionClick}>
            <ha-icon slot="start" icon="mdi:plus"></ha-icon>${us("panels.actions.cards.actions.actions.new_action",l)}</ha-button>
          <span class="secondary" style="display:inline">${s.length} Alarm Event${1===s.length?"":"s"} ·
            ${i("on")} enabled</span>
        </div>
        ${e?K:o}
        ${e?Z`<div class="nt-editor">${e}</div>`:Z`<hm-event-migrate
                .hass=${this.hass}
                .events=${(this.automations||[]).filter(e=>e.type==Gs.Action)}
                @events-migrated=${()=>this._fetchData()}
              ></hm-event-migrate>
              ${t.length?Z`<div class="nt-list">
                    ${d.map(e=>{var t;return Z`<div class="nt-group">${(null===(t=_n(e.ev,r))||void 0===t?void 0:t.name)||e.ev}</div>${e.items.map(m)}`;})}
                    ${h.length?Z`<div class="nt-group">Other</div>${h.map(m)}`:K}
                  </div>`:Z`<div class="empty">${n?`All ${n} hidden by the filters above.`:us("panels.actions.cards.actions.table.no_items",l)}</div>`}`}
      </ha-card>
    `;}deleteEvent(e){window.confirm(`Delete the Alarm Event "${e.name}"?`)&&He(this.hass,e.automation_id).then(()=>this._fetchData()).catch(e=>ia(e,this));}renderNotifications(e,t,s=!1){const a=t,i=e=>[e.enabled?"on":"off",e.warning?"warning":""].filter(Boolean),n=e=>a.filter(t=>i(t).includes(e)).length;t=a.filter(e=>i(e).every(e=>lo.notifications.has(e)));const o=a.length-t.length,r=a.length?Ha([{key:"on",label:"Enabled",count:n("on")},{key:"off",label:"Disabled",count:n("off")},{key:"warning",label:"No partition (warning)",count:n("warning")}],lo.notifications,e=>{lo.notifications=e,this.requestUpdate();}):K,l=this.hass,c=l.language,d=Object.values(qs),h=d.map(e=>({ev:e,items:t.filter(t=>t.triggers[0].event===e).sort((e,t)=>(e.name||"").localeCompare(t.name||""))})).filter(e=>e.items.length),p=t.filter(e=>!d.includes(e.triggers[0].event)),u=e=>e.area===co?this.config.master.enabled?this.config.master.name:"—":wn(e.area,this.areas,this.config).name,m=e=>la(0,ga("actions",{params:{edit_notification:e.automation_id}}),!0),g=e=>{const t=e.triggers[0],s=_n(t.event,l),a=(t.modes||[]).map(e=>{var t;return(null===(t=$n(e,l))||void 0===t?void 0:t.name)||e;}).join(", ");return Z`<div class="nt-row ${e.enabled?"":"off"}">
        <ha-icon class="nt-icon" icon=${e.warning?"mdi:alert":(null==s?void 0:s.icon)||"mdi:message-text-outline"}
          style=${e.warning?"color:var(--error-color)":""}
          title=${e.warning?us("panels.actions.cards.notifications.table.no_area_warning",c):""}></ha-icon>
        <div class="nt-name">
          <button class="link" @click=${()=>m(e)}>${e.name}</button>
          <span class="secondary">${u(e)}${a?` · ${a}`:""} → ${(e=>{var t;const s=e.actions[0]||{},a=s.entity_id;return a?(null===(t=l.states[a])||void 0===t?void 0:t.attributes.friendly_name)||a:s.service||"—";})(e)}</span>
        </div>
        <button class="nt-chip ${e.enabled?"on":""}" title=${e.enabled?"Enabled: click to disable":"Disabled: click to enable"}
          @click=${()=>this.setEnabled(e.automation_id,!e.enabled)}>${e.enabled?"Enabled":"Disabled"}</button>
        <ha-icon-button .label=${"Edit"} title="Edit" @click=${()=>m(e)}><ha-icon icon="mdi:pencil"></ha-icon></ha-icon-button>
        <ha-icon-button .label=${"Delete"} title="Delete" @click=${()=>this.deleteNotification(e)}><ha-icon icon="mdi:trash-can-outline"></ha-icon></ha-icon-button>
      </div>`;};return Z`
      <ha-card class=${s?"in-section":""}>${s?K:Sa("Alarm notifications","settings")}
        <div class="card-content desc">
          <p>Messages sent on alarm events (armed, disarmed, triggered, failed to arm and more), per partition. Each one goes
            to a notify service: a phone, a speaker.</p>
        </div>
        <div class="toolbar">
          <ha-button ?disabled=${!!e} @click=${this.addNotificationClick}>
            <ha-icon slot="start" icon="mdi:plus"></ha-icon>${us("panels.actions.cards.notifications.actions.new_notification",c)}</ha-button>
          <span class="secondary" style="display:inline">${a.length} notification${1===a.length?"":"s"} ·
            ${n("on")} enabled</span>
        </div>
        ${e?K:r}
        ${e?Z`<div class="nt-editor">${e}</div>`:K}
        ${e?K:t.length?Z`<div class="nt-list">
                ${h.map(e=>{var t;return Z`<div class="nt-group">${(null===(t=_n(e.ev,l))||void 0===t?void 0:t.name)||e.ev}</div>${e.items.map(g)}`;})}
                ${p.length?Z`<div class="nt-group">Other</div>${p.map(g)}`:K}
              </div>`:Z`<div class="empty">${o?`All ${o} hidden by the filters above.`:us("panels.actions.cards.notifications.table.no_items",c)}</div>`}
      </ha-card>
    `;}setEnabled(e,t){Me(this.hass,{automation_id:e,enabled:t}).then(()=>this._fetchData()).catch(e=>ia(e,this));}deleteNotification(e){window.confirm(`Delete the notification "${e.name}"?`)&&He(this.hass,e.automation_id).then(()=>this._fetchData()).catch(e=>ia(e,this));}toggleEnable(e,t){Me(this.hass,{automation_id:t,enabled:e.target.checked}).catch(t=>ia(t,e)).then();}getTableFilterOptions(){if(!this.hass)return;let e=Object.values(this.areas).map(e=>Object({value:e.area_id,name:e.name,badge:t=>t.filter(t=>t.area==e.area_id).length})).sort(ra);Object.values(this.automations||[]).filter(e=>!this.getAreaForAutomation(e)).length&&(e=[{value:co,name:this.config.master.enabled?this.config.master.name:this.hass.localize("state_attributes.climate.preset_mode.none"),badge:e=>e.filter(e=>e.area==co).length},...e]);return{area:{name:us("components.table.filter.item",this.hass.language,"name",us("panels.actions.cards.new_action.fields.area.heading",this.hass.language)),items:e,value:this.selectedArea?[this.selectedArea]:[]}};}addNotificationClick(){la(0,ga("actions","new_notification"),!0);}addActionClick(){la(0,ga("actions","new_action"),!0);}};ho.styles=[pa,ka,h`
      :host {
        padding: 0;
      }
      .nt-list {
        padding: 0 16px 12px;
      }
      .nt-group {
        color: var(--accent-color);
        font-weight: 500;
        font-size: 13px;
        margin: 12px 0 2px;
      }
      .nt-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 4px 0;
        border-bottom: 1px solid var(--divider-color);
      }
      .nt-row.off .nt-name button,
      .nt-row.off .nt-icon {
        opacity: 0.55;
      }
      .nt-icon {
        color: var(--primary-color);
        margin: 0 4px;
      }
      .nt-name {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        min-width: 0;
        align-items: flex-start;
      }
      .nt-chip {
        border: 1px solid var(--divider-color);
        border-radius: 14px;
        padding: 1px 10px;
        background: none;
        color: var(--secondary-text-color);
        font: inherit;
        font-size: 12px;
        cursor: pointer;
      }
      .nt-chip.on {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
      ha-card.in-section {
        box-shadow: none;
        border: none;
        background: none;
      }
      .nt-editor {
        padding: 0 16px 12px;
      }
    `],i([ye()],ho.prototype,"hass",void 0),i([ye()],ho.prototype,"narrow",void 0),i([ye()],ho.prototype,"path",void 0),i([ye()],ho.prototype,"alarmEntity",void 0),i([ye()],ho.prototype,"automations",void 0),i([ye()],ho.prototype,"areas",void 0),i([ye()],ho.prototype,"config",void 0),i([ye()],ho.prototype,"selectedArea",void 0),i([ye()],ho.prototype,"section",void 0),ho=i([me("hm-view-actions")],ho);const po=["type","area","modes","enabled","always_on","use_entry_delay","use_exit_delay","allow_open","arm_on_close","trigger_unavailable","auto_bypass","auto_bypass_modes","entry_delay","delay_on","group"],uo=["modes","auto_bypass_modes"],mo=e=>void 0===e?e:JSON.parse(JSON.stringify(e));function go(e,t,s){if(uo.includes(e)){const e=[...(t||[])].sort(),a=[...(s||[])].sort();return JSON.stringify(e)===JSON.stringify(a);}return null==t&&null==s||JSON.stringify(t)===JSON.stringify(s);}class vo{constructor(e={}){this.saved={},this.edits={},this.added={},this.removed=new Set(),this.order=[],this.setSaved(e);}setSaved(e){this.saved=mo(e)||{};for(const e of Object.keys(this.edits))if(e in this.saved){for(const t of Object.keys(this.edits[e]))go(t,this.edits[e][t],this.saved[e][t])&&delete this.edits[e][t];Object.keys(this.edits[e]).length||delete this.edits[e];}else delete this.edits[e];for(const e of Object.keys(this.added))e in this.saved&&delete this.added[e];for(const e of[...this.removed])e in this.saved||this.removed.delete(e);const t=new Set([...Object.keys(this.saved),...Object.keys(this.added)]);this.order=[...this.order.filter(e=>t.has(e))];for(const e of t)this.order.includes(e)||this.order.push(e);}ids(){return[...this.order];}has(e){return e in this.saved||e in this.added;}isSaved(e){return e in this.saved;}get(e){return e in this.added?mo(this.added[e]):e in this.saved?Object.assign(Object.assign({},mo(this.saved[e])),mo(this.edits[e]||{})):void 0;}savedValue(e,t){return this.saved[e]?mo(this.saved[e][t]):void 0;}setField(e,t,s){if(e in this.added)return void(this.added[e]=Object.assign(Object.assign({},this.added[e]),{[t]:mo(s)}));if(!(e in this.saved))throw new Error(`unknown sensor ${e}`);const a=Object.assign({},this.edits[e]||{});go(t,s,this.saved[e][t])?delete a[t]:a[t]=mo(s),Object.keys(a).length?this.edits[e]=a:delete this.edits[e];}setFieldMany(e,t,s){e.filter(e=>!this.removed.has(e)).forEach(e=>this.setField(e,t,s));}toggleMode(e,t,s,a="modes"){const i=this.get(e);if(!i)return;const n=[...(i[a]||[])].filter(e=>e!==t);s&&n.push(t),this.setField(e,a,n);}toggleModeMany(e,t,s,a="modes"){e.filter(e=>!this.removed.has(e)).forEach(e=>this.toggleMode(e,t,s,a));}isFieldChanged(e,t){return!(e in this.added)&&!!this.edits[e]&&t in this.edits[e];}isModeChanged(e,t,s="modes"){if(!this.isFieldChanged(e,s))return!1;return(this.get(e)[s]||[]).includes(t)!==(this.saved[e][s]||[]).includes(t);}rowStatus(e){return e in this.added?"new":this.removed.has(e)?"removed":this.edits[e]?"changed":"unchanged";}rowChangeCount(e){const t=this.rowStatus(e);return"new"===t||"removed"===t?1:Object.keys(this.edits[e]||{}).length;}add(e){const t=e.entity_id;t in this.saved?this.removed.delete(t):(this.added[t]=mo(e),this.order.includes(t)||this.order.push(t));}remove(e){e in this.added?(delete this.added[e],this.order=this.order.filter(t=>t!==e)):e in this.saved&&this.removed.add(e);}removeMany(e){e.forEach(e=>this.remove(e));}restore(e){this.removed.delete(e);}revertRow(e){e in this.added&&this.remove(e),delete this.edits[e],this.removed.delete(e);}discardAll(){this.edits={},this.added={},this.removed=new Set(),this.order=this.order.filter(e=>e in this.saved);}changeCount(){return this.order.reduce((e,t)=>e+this.rowChangeCount(t),0);}isDirty(){return this.changeCount()>0;}toBatch(){return{create:Object.values(this.added).map(e=>{const t={entity_id:e.entity_id};for(const s of po)void 0!==e[s]&&("group"!==s||e[s])&&(t[s]=mo(e[s]));return t;}),update:Object.entries(this.edits).filter(([e])=>!this.removed.has(e)).map(([e,t])=>({entity_id:e,changes:mo(t)})),delete:[...this.removed]};}snapshot(){return{edits:mo(this.edits),added:mo(this.added),removed:[...this.removed]};}loadSnapshot(e){if(e){this.discardAll();for(const[t,s]of Object.entries(e.added||{}))t in this.saved||this.add(s);for(const[t,s]of Object.entries(e.edits||{}))if(t in this.saved)for(const[e,a]of Object.entries(s))this.setField(t,e,a);for(const t of e.removed||[])t in this.saved&&this.removed.add(t);}}}let yo=class extends pe{constructor(){super(...arguments),this.label="",this.value=null,this.min=0,this.max=100,this.step=1,this.unit="",this.optional=!1,this.offText="default",this.disabled=!1,this.compact=!1;}emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!1}));}clamp(e){return Math.min(this.max,Math.max(this.min,e));}render(){var e;const t=null!==this.value&&void 0!==this.value,s=t?this.clamp(Number(this.value)):this.clamp(null!==(e=this.onValue)&&void 0!==e?e:this.min);return Z`
      <div class="row">
        ${this.optional?Z`<label class="lbl">
              <input
                type="checkbox"
                .checked=${t}
                ?disabled=${this.disabled}
                aria-label=${this.compact?this.label:K}
                @change=${e=>this.emit(e.target.checked?s:null)}
              />${this.compact?K:Z`<span>${this.label}</span>`}
            </label>`:this.compact?K:Z`<span class="lbl">${this.label}</span>`}
        ${t||!this.optional?Z`<span class="grp">
              <input
                type="range"
                min=${this.min}
                max=${this.max}
                step=${this.step}
                .value=${String(s)}
                ?disabled=${this.disabled}
                aria-label=${this.label}
                @input=${e=>this.shadowRoot.querySelector(".val").textContent=`${e.target.value}${this.unit?" "+this.unit:""}`}
                @change=${e=>this.emit(this.clamp(parseInt(e.target.value,10)||0))}
              />
              <span class="val">${s}${this.unit?` ${this.unit}`:""}</span>
            </span>`:Z`<span class="off">${this.offText}</span>`}
      </div>
    `;}};yo.styles=h`
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
  `,i([ye()],yo.prototype,"label",void 0),i([ye({attribute:!1})],yo.prototype,"value",void 0),i([ye({type:Number})],yo.prototype,"min",void 0),i([ye({type:Number})],yo.prototype,"max",void 0),i([ye({type:Number})],yo.prototype,"step",void 0),i([ye()],yo.prototype,"unit",void 0),i([ye({type:Boolean})],yo.prototype,"optional",void 0),i([ye()],yo.prototype,"offText",void 0),i([ye({type:Number})],yo.prototype,"onValue",void 0),i([ye({type:Boolean})],yo.prototype,"disabled",void 0),i([ye({type:Boolean})],yo.prototype,"compact",void 0),yo=i([me("hm-slider")],yo);const bo="hm-sensor-table-draft",fo=["on","open","opening","closing","unlocked","tilted","true","detected"],$o=["off","closed","locked","false","clear"],_o=e=>e&&"unavailable"!==e?fo.includes(e)?"open":$o.includes(e)?"closed":"unknown":"unavailable",wo=(e,t,s)=>{const a=e[t]||{opened:!1,closed:!1},i=_o(s);if(a.last===s)return e;const n=Object.assign(Object.assign({},a),{last:s});return"open"===i&&(n.opened=!0),"closed"===i&&a.opened&&(n.closed=!0),Object.assign(Object.assign({},e),{[t]:n});},ko=e=>!!e&&e.opened&&e.closed,xo={open:"mdi:alert-circle-outline",closed:"mdi:check-circle-outline",unavailable:"mdi:help-circle-outline",unknown:"mdi:help-circle-outline"},Ao=(e,t={})=>null===e?Z`<span class="state-cell muted"><ha-icon icon="mdi:minus"></ha-icon><span>—</span></span>`:Z`<span class="state-cell" style=${`color:${((e,t=!1)=>t?"var(--error-color, #f44336)":"open"===e?"var(--warning-color, #ffa600)":"closed"===e?"var(--success-color, #43a047)":"var(--error-color, #f44336)")(e,t.blocks)}`} title=${t.title||e}>
        <ha-icon icon=${xo[e]}></ha-icon><span>${t.label||e}</span>${t.blocks?Z`<span class="blocks">blocks</span>`:K}
      </span>`,Oo=["armed_away","armed_home","armed_night","armed_vacation","armed_custom_bypass","disarmed"],So=e=>e.callWS({type:"house_modes/ext/panel/get"}),Co=(e,t)=>e.callWS({type:"house_modes/ext/panel/save",settings:t}),jo=(e,t,s,a=!1)=>e.callWS({type:"house_modes/ext/panel/import",partition:t,entities:s,dry_run:a}),Eo=(e,t)=>e.callWS({type:"house_modes/ext/panel/repoint",pairs:t}),Mo=[{id:"door",label:"Doors",classes:["door","garage_door","opening"]},{id:"window",label:"Windows",classes:["window"]},{id:"motion",label:"Motion",classes:["motion","occupancy","presence","moving"]}],Ho=e=>(Mo.find(t=>t.classes.includes(e||""))||{id:""}).id,Lo=e=>`binary_sensor.${e.replace(/^binary_sensor\./,"")}_mirror`,To=(e,t,s=!1)=>e.callWS({type:"house_modes/ext/panel/match_exit",link:t,dry_run:s}),zo={zone:{title:"Zone",text:"A Home Assistant entity used as an alarm zone: a door or window contact, motion sensor, garage door, lock, smoke detector, etc."},type:{title:"Zone type",text:"What kind of zone this is (Door, Window, Motion, Tamper, Environmental, Generic). In the Zones tab it pre-fills sensible options; in this table changing it does not change the other options by itself."},area:{title:"Partition",text:"The partition this zone belongs to. Arming a partition only watches its own zones. Most homes have a single partition."},modes:{title:"Arm Modes",text:"Checked = this zone is watched while its partition is armed in that mode (Away, Home/Stay, Night, Vacation, Custom). A greyed-out box means the mode is turned off for the partition."},enabled:{title:"Enabled",text:"Unchecked = the zone is ignored completely, as if it were removed, but it keeps its settings so you can turn it back on later."},always_on:{title:"Always on",text:"The zone is watched all the time, even when the alarm is disarmed, and triggers immediately. Use it for smoke, CO, water leak and tamper zones."},use_entry_delay:{title:"Entry delay",text:'Checked: when this zone opens while armed, the alarm first waits for the entry delay so you can disarm (typical for the door you come in through). Unchecked: the alarm triggers immediately (an "instant" zone, typical for windows).'},use_exit_delay:{title:"Exit delay",text:"Checked: this zone may be open during the exit delay after you arm, e.g. the door you leave through. Unchecked: if it is open while arming, the arming is stopped."},auto_bypass:{title:"Auto-bypass",text:'If this zone is open when you arm, it is left out ("bypassed") for that arming instead of blocking it, e.g. a window you left open. It only happens in the modes chosen under "Bypass in" (click › at the end of the row). The zone is watched again the next time you arm.'},auto_bypass_modes:{title:"Bypass in",text:"The Arm Modes in which this zone may be bypassed automatically when it is open while arming."},allow_open:{title:"Allow open initially",text:"The zone may be open (active) when you arm. It is ignored until it closes, and triggers if it opens again after that. Typical for motion sensors that are still active when you leave."},arm_on_close:{title:"Arm after closing",text:"When this zone closes during the exit delay, the rest of the delay is skipped and the alarm arms right away, e.g. the front door shutting behind you."},trigger_unavailable:{title:"Trigger when unavailable",text:'If the entity becomes "unavailable" while armed (device offline, flat battery, cut wire), treat it as open. Safer, but a flaky device can cause false alarms.'},entry_delay:{title:"Entry delay override",text:"Seconds of entry delay for this zone only, instead of the partition's entry delay for the current mode. Leave empty to use the partition setting."},delay_on:{title:"Delay on",text:"The zone must stay open for this many seconds before it counts, which filters out short glitches. Resets if it closes again. Leave empty for no delay."},group:{title:"Cross-zone group",text:'Zones in a cross-zone group only trigger the alarm when several of them (the group setting, e.g. 2) trigger within the group\'s time window; one zone on its own is ignored. Use it to avoid false alarms, e.g. two motion sensors in the same room. Groups are created on the Zones tab ("Set up cross-zone groups").'},partition:{title:"Partition",text:"The partition the matching zones are put in."}},Po=e=>{var t;return(null===(t=zo[e])||void 0===t?void 0:t.text)||"";},No=["garage","gate","door",void 0,null,""],Do=(e,t)=>{const s=e.entity_id.split(".")[0];return"cover"===s?t||No.includes(e.attributes.device_class):"lock"===s||gi(e,t);};let Ro=class extends pe{constructor(){super(...arguments),this.areas={},this.exclude=[],this.defaultArea="",this.search="",this.deviceClass="",this.showAll=!1,this.picked=[],this.area="";}firstUpdated(){this.area=this.defaultArea||Object.keys(this.areas)[0]||"";}candidates(){const e=this.search.trim().toLowerCase();return Object.values(this.hass.states).filter(e=>Do(e,this.showAll)).filter(e=>!this.exclude.includes(e.entity_id)).filter(e=>!this.deviceClass||e.attributes.device_class===this.deviceClass).filter(t=>!e||t.entity_id.includes(e)||Ks(t).toLowerCase().includes(e)).sort((e,t)=>Ks(e).localeCompare(Ks(t)));}render(){const e=Object.values(this.hass.states).filter(e=>Do(e,!0)).filter(e=>!this.exclude.includes(e.entity_id)),t=[...new Set(e.map(e=>e.attributes.device_class).filter(Boolean))].sort(),s=this.candidates(),a=s.length>0&&s.every(e=>this.picked.includes(e.entity_id));return Z`
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
                        .checked=${a}
                        @change=${e=>this.pickAll(s.map(e=>e.entity_id),e.target.checked)}
                      />
                    </th>
                    <th class="icon"></th>
                    <th>Entity</th>
                    <th>Device class</th>
                  </tr>
                </thead>
                <tbody>
                  ${s.map(e=>Z`
                      <tr>
                        <td class="c">
                          <input
                            type="checkbox"
                            aria-label=${`Select ${Ks(e)}`}
                            .checked=${this.picked.includes(e.entity_id)}
                            @change=${t=>this.pickAll([e.entity_id],t.target.checked)}
                          />
                        </td>
                        <td class="icon">${Ea(this.hass,e.entity_id)}</td>
                        <td class="name">${Ks(e)}<span class="secondary">${e.entity_id}</span></td>
                        <td>${e.attributes.device_class||"—"}</td>
                      </tr>
                    `)}
                </tbody>
              </table>
              ${s.length?"":Z`<div class="empty">No unconfigured entities match.</div>`}
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
    `;}pickAll(e,t){const s=this.picked.filter(t=>!e.includes(t));this.picked=t?[...s,...e]:s;}confirm(){this.dispatchEvent(new CustomEvent("sensors-picked",{detail:{entity_ids:this.picked,area:this.area}}));}close(){this.dispatchEvent(new CustomEvent("close"));}};Ro.styles=ka,i([ye({attribute:!1})],Ro.prototype,"hass",void 0),i([ye({attribute:!1})],Ro.prototype,"areas",void 0),i([ye({attribute:!1})],Ro.prototype,"exclude",void 0),i([ye()],Ro.prototype,"defaultArea",void 0),i([be()],Ro.prototype,"search",void 0),i([be()],Ro.prototype,"deviceClass",void 0),i([be()],Ro.prototype,"showAll",void 0),i([be()],Ro.prototype,"picked",void 0),i([be()],Ro.prototype,"area",void 0),Ro=i([me("hm-add-sensors")],Ro);const Bo=e=>{const t={};return e.forEach(([e,s])=>t[e]=s),t;},Io=(e,t)=>e.callWS({type:"house_modes/ext/rules/save",rule:t}),Vo=e=>e.callWS({type:"house_modes/ext/rules/preview"}),Uo=async e=>{const[t,s,a]=await Promise.all([e.callWS({type:"config/label_registry/list"}),e.callWS({type:"config/area_registry/list"}),e.callWS({type:"config/floor_registry/list"})]),i=(e,t)=>Bo(e.map(e=>[String(e[t]),String(e.name)]));return{labels:i(t,"label_id"),areas:i(s,"area_id"),floors:i(a,"floor_id")};},Fo={partition:"Partition",modes:"Arm modes",type:"Zone type",enabled:"Enabled",always_on:"Always on",use_entry_delay:"Entry delay",use_exit_delay:"Exit delay",allow_open:"Allow open initially",arm_on_close:"Arm after closing",trigger_unavailable:"Trigger when unavailable",auto_bypass:"Bypass automatically",auto_bypass_modes:"Bypass in modes",entry_delay:"Entry delay override (s)",delay_on:"Delay on (s)"},Go=e=>e.match.labels.length+(e.match.areas.length?1:0)+(e.match.floors.length?1:0),Wo=(e,t)=>e.map(e=>t[e]||`${e} (missing)`),qo=(e,t,s)=>s?e.includes(t)?e:[...e,t]:e.filter(e=>e!==t);let Zo=class extends pe{constructor(){super(...arguments),this.options=[],this.value=[],this.label="",this.placeholder="Choose…",this.filterFrom=8,this.filter="",this.choice="";}render(){const e=e=>{var t;return(null===(t=this.options.find(t=>t.value===e))||void 0===t?void 0:t.label)||`${e} (missing)`;},t=((e,t,s)=>{const a=s.trim().toLowerCase();return e.filter(e=>!t.includes(e.value)).filter(e=>!a||e.label.toLowerCase().includes(a)||e.value.toLowerCase().includes(a)).sort((e,t)=>e.label.localeCompare(t.label));})(this.options,this.value,this.filter);return Z`
      <div class="wrap">
        ${this.label?Z`<span class="lbl">${this.label}</span>`:K}
        <div class="row">
          ${this.options.length>this.filterFrom?Z`<input type="search" placeholder="Filter" aria-label=${`Filter ${this.label}`} .value=${this.filter}
                @input=${e=>this.filter=e.target.value} />`:K}
          <select aria-label=${this.label||this.placeholder} @change=${e=>this.choice=e.target.value}>
            <option value="" ?selected=${!this.choice}>${t.length?this.placeholder:"nothing left to add"}</option>
            ${t.map(e=>Z`<option value=${e.value} ?selected=${e.value===this.choice}>${e.label}</option>`)}
          </select>
          <ha-icon-button .path=${Hs} .label=${`Add to ${this.label}`} ?disabled=${!this.choice} @click=${this.add}></ha-icon-button>
        </div>
        ${this.value.length?Z`<div class="chips">
              ${this.value.map(t=>Z`<span class="chip ${this.options.some(e=>e.value===t)?"":"missing"}">
                ${e(t)}
                <ha-icon-button .path=${$s} .label=${`Remove ${e(t)}`} @click=${()=>this.emit(this.value.filter(e=>e!==t))}></ha-icon-button>
              </span>`)}
            </div>`:K}
      </div>
    `;}add(){this.choice&&!this.value.includes(this.choice)&&(this.emit([...this.value,this.choice]),this.choice="");}emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e}}));}};Zo.styles=[wa,h`
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
  `],i([ye({attribute:!1})],Zo.prototype,"options",void 0),i([ye({attribute:!1})],Zo.prototype,"value",void 0),i([ye()],Zo.prototype,"label",void 0),i([ye()],Zo.prototype,"placeholder",void 0),i([ye({type:Number})],Zo.prototype,"filterFrom",void 0),i([be()],Zo.prototype,"filter",void 0),i([be()],Zo.prototype,"choice",void 0),Zo=i([me("hm-multi-picker")],Zo);const Yo=[Ws.ArmedAway,Ws.ArmedHome,Ws.ArmedNight,Ws.ArmedVacation,Ws.ArmedCustom],Ko=["enabled","always_on","use_entry_delay","use_exit_delay","allow_open","arm_on_close","trigger_unavailable","auto_bypass"],Jo=e=>JSON.parse(JSON.stringify(e));let Xo=class extends pe{constructor(){super(...arguments),this.registry={labels:{},areas:{},floors:{}},this.partitions={},this.draft={name:"",enabled:!0,order:0,match:{labels:[],areas:[],floors:[]},set:{}},this.busy=!1,this.error="";}firstUpdated(){this.draft=this.rule?Jo(this.rule):{name:"",enabled:!0,order:0,match:{labels:[],areas:[],floors:[]},set:{}};}modeLabel(e){const t=us(`common.modes_short.${e}`,this.hass.language)||e;return e===Ws.ArmedHome&&"Home"===t?"Home (Stay)":t;}setMatch(e,t,s){this.draft=Object.assign(Object.assign({},this.draft),{match:Object.assign(Object.assign({},this.draft.match),{[e]:qo(this.draft.match[e],t,s)})});}useField(e,t,s){const a=Object.assign({},this.draft.set);t?a[e]=s:delete a[e],this.draft=Object.assign(Object.assign({},this.draft),{set:a});}setValue(e,t){this.draft=Object.assign(Object.assign({},this.draft),{set:Object.assign(Object.assign({},this.draft.set),{[e]:t})});}render(){const e=this.draft,t=(e=>{const t=[];return e.name.trim()||t.push("Give the rule a name."),Go(e)||t.push("Choose at least one label, area or floor to match."),Object.keys(e.set).length||t.push("Choose at least one thing for the rule to set."),t;})(e),s=Object.keys(this.partitions)[0];return Z`
      <ha-card class="editor">
          ${Sa(e.id?`Edit zone rule: ${e.name}`:"New zone rule","settings")}
          <div class="toolbar">
            <span class="grow secondary" style="display:inline">Saving a rule changes no zones; the results show as pending changes below.</span>
            <ha-button appearance="plain" ?disabled=${this.busy} @click=${this.close}>Cancel</ha-button>
            <ha-button ?disabled=${this.busy||t.length>0} @click=${this.save}>${this.busy?"Saving…":"Save rule"}</ha-button>
          </div>
          <div class="card-content">
            ${e.id?K:Z`
                  <p>
                    Start from a template:
                    ${((e,t)=>{const s=(e,t)=>Object.keys(e).find(s=>e[s].toLowerCase()===t)||"",a=s(e.labels,"perimeter"),i=s(e.labels,"interior"),n=(e,t,s)=>({name:e,rule:Object.assign(Object.assign({},{name:"",enabled:!0,order:0,match:{labels:[],areas:[],floors:[]},set:{}}),{name:e,match:Object.assign({labels:[],areas:[],floors:[]},t),set:s})});return[n("Area → Partition",{},t?{partition:t}:{}),n("Perimeter label → Stay/Night/Away/Vacation",{labels:a?[a]:[]},{modes:["armed_away","armed_home","armed_night","armed_vacation"]}),n("Interior label → Away/Vacation",{labels:i?[i]:[]},{modes:["armed_away","armed_vacation"]})];})(this.registry,s).map(e=>Z`<button class="link" @click=${()=>this.draft=Jo(e.rule)}>${e.name}</button>`)}
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
            ${this.renderSetRow("partition",s,Z`
                <select aria-label="Partition" @change=${e=>this.setValue("partition",e.target.value)}>
                  ${Object.values(this.partitions).map(t=>Z`<option value=${t.area_id} ?selected=${e.set.partition===t.area_id}>${t.name}</option>`)}
                </select>
              `)}
            ${this.renderSetRow("modes",[],Z`${Yo.map(t=>Z`
                  <label style="margin-right:8px">
                    <input
                      type="checkbox"
                      .checked=${(e.set.modes||[]).includes(t)}
                      @change=${s=>this.setValue("modes",qo(e.set.modes||[],t,s.target.checked))}
                    />
                    ${this.modeLabel(t)}
                  </label>
                `)}<span class="secondary" style="display:block">Modes from all matching rules are added together.</span>`)}
            ${this.renderSetRow("type",Vs.Door,Z`
                <select aria-label="Zone type" @change=${e=>this.setValue("type",e.target.value)}>
                  ${Object.values(Vs).map(t=>Z`<option value=${t} ?selected=${e.set.type===t}>
                      ${us(`panels.sensors.cards.editor.fields.device_type.choose.${t}.name`,this.hass.language)||t}
                    </option>`)}
                </select>
              `)}
            ${Ko.map(t=>this.renderSetRow(t,!0,Z`
                  <select aria-label=${Fo[t]} @change=${e=>this.setValue(t,"on"===e.target.value)}>
                    <option value="on" ?selected=${!0===e.set[t]}>On</option>
                    <option value="off" ?selected=${!1===e.set[t]}>Off</option>
                  </select>
                `))}
            ${["entry_delay","delay_on"].map(t=>this.renderSetRow(t,null,Z`
                  <hm-slider
                    compact
                    optional
                    .label=${Fo[t]}
                    .min=${0}
                    .max=${"entry_delay"===t?300:600}
                    .onValue=${30}
                    unit="s"
                    offText="partition default"
                    .value=${null===e.set[t]||void 0===e.set[t]?null:e.set[t]}
                    @value-changed=${e=>this.setValue(t,e.detail.value)}
                  ></hm-slider>
                `))}
            <p class="secondary" style="display:block">
              Specificity: ${Go(e)}. Saving a rule changes no zones — the results appear as pending rule
              changes on the Zones page, to preview and apply.
            </p>
            ${t.length&&e.name?Z`<div class="notice warn" style="margin:8px 0">${t.map(e=>Z`<div>${e}</div>`)}</div>`:K}
            ${this.error?Z`<div class="notice error" style="margin:8px 0;white-space:pre-line">${this.error}</div>`:K}
          </div>
          <div class="toolbar">
            <span class="grow"></span>
            <ha-button appearance="plain" ?disabled=${this.busy} @click=${this.close}>Cancel</ha-button>
            <ha-button ?disabled=${this.busy||t.length>0} @click=${this.save}>${this.busy?"Saving…":"Save rule"}</ha-button>
          </div>
      </ha-card>
    `;}renderPicker(e,t,s){return Z`
      <hm-multi-picker
        .label=${t}
        .placeholder=${`Add a ${e.slice(0,-1)}…`}
        .options=${a=s,Object.keys(a).map(e=>({value:e,label:a[e]}))}
        .value=${this.draft.match[e]}
        @value-changed=${t=>this.draft=Object.assign(Object.assign({},this.draft),{match:Object.assign(Object.assign({},this.draft.match),{[e]:t.detail.value})})}
      ></hm-multi-picker>
    `;var a;}renderSetRow(e,t,s){const a=e in this.draft.set;return Z`
      <div class="detail-grid" style="padding:2px 0;align-items:center">
        <label style="min-width:220px;cursor:help" title=${Po(e)}>
          <input type="checkbox" .checked=${a} @change=${s=>this.useField(e,s.target.checked,t)} />
          ${Fo[e]}
        </label>
        ${a?s:K}
      </div>
    `;}async save(){this.busy=!0,this.error="";try{const e=await Io(this.hass,this.draft);this.dispatchEvent(new CustomEvent("saved",{detail:e}));}catch(e){this.error=ba(e);}finally{this.busy=!1;}}close(){this.dispatchEvent(new CustomEvent("close"));}};Xo.styles=ka,i([ye({attribute:!1})],Xo.prototype,"hass",void 0),i([ye({attribute:!1})],Xo.prototype,"registry",void 0),i([ye({attribute:!1})],Xo.prototype,"partitions",void 0),i([ye({attribute:!1})],Xo.prototype,"rule",void 0),i([be()],Xo.prototype,"draft",void 0),i([be()],Xo.prototype,"busy",void 0),i([be()],Xo.prototype,"error",void 0),Xo=i([me("hm-rule-editor")],Xo);let Qo=class extends pe{constructor(){super(...arguments),this.rules=[],this.registry={labels:{},areas:{},floors:{}},this.partitions={},this.editing=void 0,this.open=!0,this.error="",this.modeLabel=e=>{const t=us(`common.modes_short.${e}`,this.hass.language)||e;return e===Ws.ArmedHome&&"Home"===t?"Home (Stay)":t;};}render(){var e;const t=(e=>{const t={};if(!e)return t;for(const s of Object.values(e.zones))for(const e of s.rules)t[e]=(t[e]||0)+1;return t;})(this.preview),s=Bo(Object.values(this.partitions).map(e=>[e.area_id,e.name])),a=(null===(e=this.preview)||void 0===e?void 0:e.stale)||[],i=[...this.rules].sort((e,t)=>(e.order||0)-(t.order||0)||e.name.localeCompare(t.name));return Z`
      <ha-card>
        ${Sa(Z`<button class="link" style="font-size:inherit;padding:0" aria-expanded=${this.open} @click=${()=>this.open=!this.open}>
            ${this.open?"▾":"▸"} Zone rules (${this.rules.length})</button>`,"settings")}
        <div class="card-content desc"><p>Optional: assign zones automatically from Home Assistant labels, areas and floors.</p></div>
        <div class="toolbar">
          <ha-button appearance="plain" ?disabled=${void 0!==this.editing} @click=${()=>this.editing=null}>
            <ha-svg-icon slot="start" .path=${Hs}></ha-svg-icon>
            New rule
          </ha-button>
        </div>
        ${void 0!==this.editing?Z`
            <hm-rule-editor
              .hass=${this.hass}
              .registry=${this.registry}
              .partitions=${this.partitions}
              .rule=${this.editing||void 0}
              @close=${()=>this.editing=void 0}
              @saved=${()=>{this.editing=void 0,this.changed();}}
            ></hm-rule-editor>
          `:K}
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
              ${this.error?Z`<div class="notice error">${this.error}</div>`:K}
              ${a.length?Z`<div class="notice warn">
                    Some rules refer to labels, areas or floors that no longer exist (those conditions are ignored):
                    ${a.map(e=>Z`<div>${e.name}: ${e.kind.slice(0,-1)} <code>${e.ref}</code></div>`)}
                  </div>`:K}
              ${i.length?Z`
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
                          ${i.map(e=>Z`
                              <tr class=${e.enabled?"":"status-removed"}>
                                <td class="c">
                                  <input type="checkbox" class="cb"
                                    aria-label=${`Enable ${e.name}`}
                                    .checked=${e.enabled}
                                    @change=${t=>this.toggleRule(e,t.target.checked)} />
                                </td>
                                <td class="name">${e.name}</td>
                                <td style="white-space:normal">${((e,t)=>{const s=[];return e.labels.length&&s.push(`Label ${Wo(e.labels,t.labels).join(" and ")}`),e.areas.length&&s.push(`Area ${Wo(e.areas,t.areas).join(" or ")}`),e.floors.length&&s.push(`Floor ${Wo(e.floors,t.floors).join(" or ")}`),s.join(" · ");})(e.match,this.registry)}</td>
                                <td style="white-space:normal">${((e,t,s=e=>e)=>Object.entries(e).map(([e,a])=>{const i=Fo[e]||e;return"partition"===e?`${i} ${t[a]||a}`:Array.isArray(a)?`${i} ${a.length?a.map(s).join(", "):"none"}`:"boolean"==typeof a?`${i} ${a?"on":"off"}`:`${i} ${null===a?"default":a}`;}).join(" · "))(e.set,s,this.modeLabel)}</td>
                                <td class="c">${e.enabled?t[e.id]||0:"—"}</td>
                                <td>
                                  <ha-icon-button .path=${Es} .label=${"Edit rule"} @click=${()=>this.editing=e}></ha-icon-button>
                                  <ha-icon-button .path=${ws} .label=${"Delete rule"} @click=${()=>this.removeRule(e)}></ha-icon-button>
                                </td>
                              </tr>
                            `)}
                        </tbody>
                      </table>
                    </div>
                  `:Z`<div class="empty">
                    No rules yet. Rules are optional: zones you set up by hand keep working as before.
                  </div>`}
            `:K}
      </ha-card>
    `;}changed(){this.dispatchEvent(new CustomEvent("rules-changed"));}async toggleRule(e,t){this.error="";try{await Io(this.hass,Object.assign(Object.assign({},e),{enabled:t})),this.changed();}catch(e){this.error=ba(e);}}async removeRule(e){if(window.confirm(`Delete the rule "${e.name}"? Zones keep their current settings.`)){this.error="";try{await(t=this.hass,s=e.id,t.callWS({type:"house_modes/ext/rules/delete",rule_id:s})),this.changed();}catch(e){this.error=ba(e);}var t,s;}}};Qo.styles=ka,i([ye({attribute:!1})],Qo.prototype,"hass",void 0),i([ye({attribute:!1})],Qo.prototype,"rules",void 0),i([ye({attribute:!1})],Qo.prototype,"preview",void 0),i([ye({attribute:!1})],Qo.prototype,"registry",void 0),i([ye({attribute:!1})],Qo.prototype,"partitions",void 0),i([be()],Qo.prototype,"editing",void 0),i([be()],Qo.prototype,"open",void 0),i([be()],Qo.prototype,"error",void 0),Qo=i([me("hm-rules-card")],Qo);let er=class extends pe{constructor(){super(...arguments),this.current={},this.partitionNames={},this.blockedReason="",this.busy=!1,this.error="";}name(e){const t=this.hass.states[e];return t&&t.attributes.friendly_name||e;}value(e,t){return"area"===e?this.partitionNames[t]||t:(e=>null==e?"—":Array.isArray(e)?e.join(", ")||"none":String(e))(t);}render(){const e=this.preview,t=t=>t.map(t=>e.rule_names[t]||t).join(", ");return Z`
      <div class="overlay" @click=${e=>e.target===e.currentTarget&&!this.busy&&this.close()}>
        <div class="modal" role="dialog" aria-label="Pending rule changes">
          <h2>Pending rule changes (${e.total_changes})</h2>
          <div class="body">
            ${e.create.length?Z`<h3 style="font-weight:500">New zones (${e.create.length})</h3>
                  ${e.create.map(e=>Z`<div class="status-icon new">
                      + ${this.name(e.entity_id)} <span class="secondary" style="display:inline">${e.entity_id}</span>
                      — ${Object.entries(e).filter(([e])=>"entity_id"!==e).map(([e,t])=>`${e}: ${this.value(e,t)}`).join(" · ")}
                    </div>`)}`:K}
            ${e.update.length?Z`<h3 style="font-weight:500">Changed zones (${e.update.length})</h3>
                  ${e.update.map(s=>{var a;return Z`<div style="margin:4px 0">
                      <span class="status-icon changed">✎ ${this.name(s.entity_id)}</span>
                      <span class="secondary" style="display:inline">${s.entity_id} · ${t((null===(a=e.zones[s.entity_id])||void 0===a?void 0:a.rules)||[])}</span>
                      <ul style="margin:2px 0">
                        ${Object.entries(s.changes).map(([e,t])=>Z`<li><code>${e}</code>: ${this.value(e,(this.current[s.entity_id]||{})[e])} →
                              <strong>${this.value(e,t)}</strong></li>`)}
                      </ul>
                    </div>`;})}`:K}
            ${e.total_changes?K:Z`<div class="notice">Zones already match the rules.</div>`}
            ${e.conflicts.length?Z`<div class="notice error" style="margin:8px 0">
                  <strong>Conflicts (not applied):</strong>
                  ${e.conflicts.map(e=>Z`<div>${this.name(e.entity_id)} — <code>${e.field}</code>:
                      ${e.reason||`rules ${t(e.rules)} disagree (${e.values.map(t=>this.value(e.field,t)).join(" vs ")})`}</div>`)}
                  <div class="secondary" style="display:block">Make one rule more specific, or set the value by hand in the table (an override).</div>
                </div>`:K}
            ${e.needs_partition.length?Z`<div class="notice warn" style="margin:8px 0">
                  Matched but not added — no rule sets their partition:
                  ${e.needs_partition.map(e=>Z`<div>${this.name(e)} <code>${e}</code></div>`)}
                </div>`:K}
            <p class="secondary" style="display:block">
              Rules never remove zones. ${e.unmanaged.length} configured zone(s) are not matched by any rule and are left as they are.
              Applying makes a backup first.
            </p>
            ${this.blockedReason?Z`<div class="notice warn" style="margin:8px 0">${this.blockedReason}</div>`:K}
            ${this.error?Z`<div class="notice error" style="margin:8px 0;white-space:pre-line">${this.error}</div>`:K}
          </div>
          <div class="footer">
            <ha-button appearance="plain" ?disabled=${this.busy} @click=${this.close}>Close</ha-button>
            <ha-button ?disabled=${this.busy||!e.total_changes||!!this.blockedReason} @click=${this.apply}>
              ${this.busy?"Applying…":`Apply ${e.total_changes} change(s)`}
            </ha-button>
          </div>
        </div>
      </div>
    `;}async apply(){this.busy=!0,this.error="";try{const s=await(e=this.hass,t=this.preview.token,e.callWS({type:"house_modes/ext/rules/apply",token:t}));this.dispatchEvent(new CustomEvent("applied",{detail:s}));}catch(e){this.error=ba(e);}finally{this.busy=!1;}var e,t;}close(){this.dispatchEvent(new CustomEvent("close"));}};er.styles=ka,i([ye({attribute:!1})],er.prototype,"hass",void 0),i([ye({attribute:!1})],er.prototype,"preview",void 0),i([ye({attribute:!1})],er.prototype,"current",void 0),i([ye({attribute:!1})],er.prototype,"partitionNames",void 0),i([ye()],er.prototype,"blockedReason",void 0),i([be()],er.prototype,"busy",void 0),i([be()],er.prototype,"error",void 0),er=i([me("hm-rules-preview")],er);const tr="hm-sensor-table-draft",sr=[Ws.ArmedAway,Ws.ArmedHome,Ws.ArmedNight,Ws.ArmedVacation,Ws.ArmedCustom],ar=Object.values(Vs),ir=[["enabled","Enabled"],["always_on","Always on"],["use_entry_delay","Use entry delay"],["use_exit_delay","Use exit delay"],["allow_open","Allow open initially"],["arm_on_close","Arm after closing"],["trigger_unavailable","Trigger when unavailable"],["auto_bypass","Auto-bypass"]],nr=[["always_on","mdi:shield-alert","Always on"],["auto_bypass","mdi:debug-step-over","Auto-bypass"],["allow_open","mdi:door-open","Allow open initially"],["arm_on_close","mdi:door-closed-lock","Arm after closing"],["trigger_unavailable","mdi:lan-disconnect","Trigger when unavailable"]],or={panel:"set off the alarm",notify:"notify only",none:"nothing extra"},rr={panel:"mdi:bullhorn",notify:"mdi:bell-outline",none:"mdi:bell-off-outline"},lr=["mdi:timer-off-outline","No entry delay (instant)"],cr={armed_away:"mdi:lock",armed_home:"mdi:home",armed_night:"mdi:weather-night",armed_vacation:"mdi:airplane",armed_custom_bypass:"mdi:shield"},dr={door:"#1e88e5",window:"#00897b",motion:"#8e24aa",tamper:"#6d4c41",environmental:"#e53935",other:"#757575"},hr=[{id:"modes",label:"Arm Modes",fields:["modes"]},{id:"type",label:"Zone type",fields:["type"]},{id:"area",label:"Partition",fields:["area"]},{id:"options",label:"Options and delays",fields:["always_on","use_entry_delay","use_exit_delay","allow_open","arm_on_close","trigger_unavailable","auto_bypass","auto_bypass_modes","entry_delay","delay_on"]}];let pr=class extends ze(pe){constructor(){super(...arguments),this.narrow=!1,this.areas={},this.groups={},this.loaded=!1,this.selection=[],this.expanded=[],this.filters={search:"",area:"",mode:"",type:"",status:""},this.saving=!1,this.error="",this.restoredCount=0,this.showAdd=!1,this.copyFrom=null,this.tripDraft={},this.copyGroups=["modes","options"],this.rev=0,this.rules=[],this.registry={labels:{},areas:{},floors:{}},this.showRulesPreview=!1,this.showHelp=!1,this.locked=!0,this.draft=new vo(),this.bulkMode=Ws.ArmedAway,this.beforeUnload=e=>{this.draft.isDirty()&&(e.preventDefault(),e.returnValue="");};}hasUnsavedChanges(){return this.draft.isDirty();}firstUpdated(){var e;const t=(null===(e=this.path)||void 0===e?void 0:e.filter)||{};(t.area||t.mode)&&(this.filters=Object.assign(Object.assign({},this.filters),{area:t.area||"",mode:t.mode||""}));}connectedCallback(){super.connectedCallback(),window.addEventListener("beforeunload",this.beforeUnload);}disconnectedCallback(){window.removeEventListener("beforeunload",this.beforeUnload),super.disconnectedCallback();}hassSubscribe(){return this.fetchData(),[this.hass.connection.subscribeMessage(()=>this.fetchData(),{type:"house_modes_config_updated"})];}async fetchData(){if(this.hass)try{const[e,t,s]=await Promise.all([ke(this.hass),Le(this.hass),Oe(this.hass)]);this.areas=t,this.groups=s,this.draft.setSaved(e),await this.fetchRules(),await this.fetchPanelInfo(),this.loaded||(this.loaded=!0,this.restoreDraft()),this.rev++;}catch(e){this.error=ba(e);}}async fetchPanelInfo(){try{const e=this.panel?this.tripChanges():0;this.panel=await So(this.hass),e||(this.tripDraft=Object.assign({},this.panel.settings.zone_trip));}catch(e){this.panel=void 0;}}panelWatched(e){return!!this.panel&&this.panel.panels.some(t=>t.zones.some(t=>t.entity_id===e||Lo(t.entity_id)===e));}tripChanges(){if(!this.panel)return 0;const e=this.panel.settings.zone_trip;return[...new Set([...Object.keys(e),...Object.keys(this.tripDraft)])].filter(t=>(e[t]||null)!==(this.tripDraft[t]||null)).length;}tripDefault(){return this.panel&&this.panel.settings.monitored?"notify":"panel";}setTrip(e,t){const s=Object.assign({},this.tripDraft);"default"===t?delete s[e]:s[e]=t,this.tripDraft=s;}async fetchRules(){try{const[t,s,a]=await Promise.all([(e=this.hass,e.callWS({type:"house_modes/ext/rules/list"})),Vo(this.hass),Uo(this.hass)]);this.rules=t.rules,this.rulesPreview=s,this.registry=a;}catch(e){this.rulesPreview=void 0,this.error=`Zone rules unavailable: ${ba(e)}`;}var e;}source(e,t){var s,a;return null===(a=null===(s=this.rulesPreview)||void 0===s?void 0:s.zones[e])||void 0===a?void 0:a.sources[t];}conflict(e,t){var s,a;return((null===(a=null===(s=this.rulesPreview)||void 0===s?void 0:s.zones[e])||void 0===a?void 0:a.conflicts)||[]).find(e=>e.field===t);}ruleNames(e){return e.map(e=>{var t;return(null===(t=this.rulesPreview)||void 0===t?void 0:t.rule_names[e])||e;}).join(", ");}sourceMark(e,t){const s=this.source(e,t);return s&&"new"!==this.draft.rowStatus(e)?"override"===s.kind?Z`<ha-svg-icon
        class="src override"
        role="button"
        tabindex="0"
        .path=${"M21.7,13.35L20.7,14.35L18.65,12.3L19.65,11.3C19.86,11.09 20.21,11.09 20.42,11.3L21.7,12.58C21.91,12.79 21.91,13.14 21.7,13.35M12,18.94L18.06,12.88L20.11,14.93L14.06,21H12V18.94M12,14C7.58,14 4,15.79 4,18V20H10V18.11L14,14.11C13.34,14.03 12.67,14 12,14M12,4A4,4 0 0,0 8,8A4,4 0 0,0 12,12A4,4 0 0,0 16,8A4,4 0 0,0 12,4Z"}
        title=${`Manual override${s.rules.length?` of rule ${this.ruleNames(s.rules)}`:""} — click to clear (the rule value comes back on the next Apply)`}
        @click=${()=>this.clearOverride(e,t)}
        @keydown=${s=>"Enter"===s.key&&this.clearOverride(e,t)}
      ></ha-svg-icon>`:Z`<ha-svg-icon class="src rule" .path=${gs} title=${`Set by rule: ${this.ruleNames(s.rules)}`}></ha-svg-icon>`:K;}srcClass(e,t){return this.conflict(e,t)?"conflict":"";}async clearOverride(e,t){if(window.confirm(`Clear the manual override of "${t}" for ${this.name(e)}? The rule value is applied on the next Apply.`))try{await((e,t,s)=>e.callWS(Object.assign({type:"house_modes/ext/overrides/clear",entity_id:t},s?{field:s}:{})))(this.hass,e,t),await this.fetchRules();}catch(e){this.error=ba(e);}}renderRulesBar(){const e=this.rulesPreview;if(!e||!e.total_changes&&!e.conflicts.length&&!e.needs_partition.length)return K;const t=[e.total_changes?`${e.total_changes} pending rule change${1===e.total_changes?"":"s"}`:"",e.conflicts.length?`${e.conflicts.length} conflict${1===e.conflicts.length?"":"s"}`:"",e.needs_partition.length?`${e.needs_partition.length} matched without a partition`:""].filter(Boolean);return Z`
      <div class="notice ${e.conflicts.length?"error":"warn"}" role="region" aria-label="Pending rule changes">
        <ha-svg-icon .path=${gs} style="width:18px;height:18px;vertical-align:middle"></ha-svg-icon>
        Zone rules: ${t.join(" · ")}.
        <button class="link" @click=${()=>this.showRulesPreview=!0}>Preview${e.total_changes?" & apply":""}</button>
        ${e.conflicts.length?Z`<div style="margin-top:4px">
              ${e.conflicts.map(e=>Z`<div>⚠ ${this.name(e.entity_id)} — <code>${e.field}</code>: ${e.reason||`rules ${this.ruleNames(e.rules)} disagree`}</div>`)}
            </div>`:K}
      </div>
    `;}restoreDraft(){try{const e=window.sessionStorage.getItem(tr);if(!e)return;this.draft.loadSnapshot(JSON.parse(e)),this.restoredCount=this.draft.changeCount(),this.restoredCount||window.sessionStorage.removeItem(tr);}catch(e){window.sessionStorage.removeItem(tr);}}persist(){try{this.draft.isDirty()?window.sessionStorage.setItem(tr,JSON.stringify(this.draft.snapshot())):window.sessionStorage.removeItem(tr);}catch(e){}}edit(e){e(),this.persist(),this.rev++;}visibleModes(){const e=new Set();return Object.values(this.areas).forEach(t=>Object.entries(t.modes||{}).forEach(([t,s])=>s&&s.enabled&&e.add(t))),this.draft.ids().forEach(t=>{var s;return((null===(s=this.draft.get(t))||void 0===s?void 0:s.modes)||[]).forEach(t=>e.add(t));}),sr.filter(t=>e.has(t));}modeEnabledInArea(e,t){const s=e?this.areas[e]:void 0;return!!s&&!!s.modes&&!!s.modes[t]&&s.modes[t].enabled;}name(e){const t=this.hass.states[e];return t?Ks(t):e;}modeLabel(e){const t=us(`common.modes_short.${e}`,this.hass.language)||e;return e===Ws.ArmedHome&&"Home"===t?"Home (Stay)":t;}typeLabel(e){return us(`panels.sensors.cards.editor.fields.device_type.choose.${e}.name`,this.hass.language)||e;}rows(){const e=this.filters,t=e.search.trim().toLowerCase();return this.draft.ids().filter(s=>{const a=this.draft.get(s);if(t&&!s.toLowerCase().includes(t)&&!this.name(s).toLowerCase().includes(t))return!1;if("__none__"===e.area){if(a.area&&this.areas[a.area])return!1;}else if(e.area&&a.area!==e.area)return!1;if("__none__"===e.mode){if((a.modes||[]).length||a.always_on)return!1;}else if(e.mode&&!(a.modes||[]).includes(e.mode))return!1;return(!e.type||a.type===e.type)&&("unsaved"!==e.status||"unchanged"!==this.draft.rowStatus(s))&&("disabled"!==e.status||!1===a.enabled)&&("missing"!==e.status||!this.hass.states[s]);}).sort((e,t)=>{var s,a;const i=(null===(s=this.areas[this.draft.get(e).area])||void 0===s?void 0:s.name)||"~",n=(null===(a=this.areas[this.draft.get(t).area])||void 0===a?void 0:a.name)||"~";return i.localeCompare(n)||this.name(e).localeCompare(this.name(t));});}render(){if(!this.hass)return K;if(!this.loaded)return Z`
        <ha-card><div class="empty">${this.error||"Loading…"}</div></ha-card>
      `;this.rev;const e=this.rows(),t=this.visibleModes(),s=this.draft.changeCount()+this.tripChanges(),a=e.length>0&&e.every(e=>this.selection.includes(e)),i=Bo(Object.values(this.areas).map(e=>[e.area_id,e.name]));return Z`
      ${za("Zones","settings",Z`
          <p><strong>The main place for zones.</strong> Every zone the alarm watches, with its partition, the Arm Modes it
            is active in, its zone type and its options. Hover a column title for help; click a zone's icon for its details.</p>
          <p><strong>Unlock to edit</strong> (button above the table). Changes stay drafts until you click Save — a
            backup is made first. Edited zones get a yellow icon, new ones green, removed ones red.</p>
          <ul>
            <li>Add zones with <em>Add zones</em>, or from your physical panel on the Physical Panel tab.</li>
            <li>What a zone that only Home Assistant watches does when it trips: open the zone (›) → <em>When tripped</em>; the default is on <a href="/house_modes/panel">Physical Panel</a>.</li>
            <li>Mirrors of physical panel zones: <a href="/house_modes/panel">Physical Panel → Panel zones</a>.</li>
          </ul>
`,Z`
        ${Ta("zones-list","Zone list",`${this.draft.ids().length} zone${1===this.draft.ids().length?"":"s"}${s?` · ${s} unsaved`:""}`,Z`        ${this.renderRulesBar()}
        ${this.restoredCount?Z`
              <div class="notice warn">
                Restored ${this.restoredCount} unsaved change${1===this.restoredCount?"":"s"} from your last
                visit. Save or discard them below.
                <button class="link" @click=${()=>this.restoredCount=0}>Dismiss</button>
              </div>
            `:K}
        ${this.error?Z`
              <div class="notice error" style="white-space:pre-line">
                ${this.error}
                <button class="link" @click=${()=>this.error=""}>Dismiss</button>
              </div>
            `:K}
        <div class="toolbar">
          ${ja(this.locked,()=>{this.locked=!this.locked,this.locked&&(this.selection=[]);})}
          <ha-button @click=${()=>this.showAdd=!0}>
            <ha-svg-icon slot="start" .path=${"M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"}></ha-svg-icon>Add zones
          </ha-button>
          <span class="grow"></span>
          <span class="secondary" style="display:inline">${e.length} of ${this.draft.ids().length} zones shown</span>
        </div>
        ${this.renderFilters()} ${this.showHelp?this.renderHelp():K}
        ${this.selection.length&&!this.locked?this.renderBulkBar():K}
        <div class="table-wrap">
          <table class="full">
            <thead>
              <tr>
                <th class="c">
                  <input
                    type="checkbox"
                    aria-label="Select all shown"
                    ?disabled=${this.locked}
                    .checked=${a}
                    @change=${t=>this.selectRows(e,t.target.checked)}
                  />
                </th>
                <th class="icon"></th>
                <th class="help" title=${Po("zone")}>Zone</th>
                <th class="help c" title="Live state of the zone; red when it blocks arming">State</th>
                <th class="help" title=${Po("type")}>Type</th>
                ${this.multiPartition?Z`<th class="help" title=${Po("area")}>Partition</th>`:K}
                ${t.map(e=>Z`<th class="c mode help" title=${`${this.modeLabel(e)} — ${Po("modes")}`}><ha-icon icon=${cr[e]}></ha-icon></th>`)}
                <th class="help" title="Options: hover an icon; edit them in the expanded row (›)">Options</th>
                <th></th>
                <th class="fill" aria-hidden="true"></th>
              </tr>
            </thead>
            <tbody>
              ${e.map(e=>this.renderRow(e,t))}
            </tbody>
          </table>
          ${e.length?K:Z`<div class="empty">${this.draft.ids().length?"No zones match the filters.":"No zones configured yet."}</div>`}
        </div>

        `)}
        ${Ta("zone-rules","Zone rules",`${this.rules.length} rule${1===this.rules.length?"":"s"}`,Z`
      <hm-rules-card
        .hass=${this.hass}
        .rules=${this.rules}
        .preview=${this.rulesPreview}
        .registry=${this.registry}
        .partitions=${this.areas}
        @rules-changed=${()=>this.fetchRules()}
      ></hm-rules-card>
        `,{flat:!0})}
      `)}
      ${this.showRulesPreview&&this.rulesPreview?Z`
            <hm-rules-preview
              .hass=${this.hass}
              .preview=${this.rulesPreview}
              .current=${Bo(this.draft.ids().filter(e=>this.draft.isSaved(e)).map(e=>[e,this.draft.get(e)]))}
              .partitionNames=${i}
              .blockedReason=${s?"Save or discard your unsaved changes on this page first.":""}
              @close=${()=>this.showRulesPreview=!1}
              @applied=${this.rulesApplied}
            ></hm-rules-preview>
          `:K}
      ${s?this.renderSaveBar(s):K}
      ${this.showAdd?Z`
            <hm-add-sensors
              .hass=${this.hass}
              .areas=${this.areas}
              .exclude=${this.draft.ids()}
              .defaultArea=${this.filters.area&&this.areas[this.filters.area]?this.filters.area:""}
              @close=${()=>this.showAdd=!1}
              @sensors-picked=${this.addPicked}
            ></hm-add-sensors>
          `:K}
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
          ${sr.map(t=>Z`<option value=${t} ?selected=${e.mode===t}>${this.modeLabel(t)}</option>`)}
          <option value="__none__" ?selected=${"__none__"===e.mode}>No arm mode (inactive)</option>
        </select>
        <select aria-label="Filter by zone type" @change=${t("type")}>
          <option value="" ?selected=${!e.type}>All zone types</option>
          ${ar.map(t=>Z`<option value=${t} ?selected=${e.type===t}>${this.typeLabel(t)}</option>`)}
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
        ${e.search||e.area||e.mode||e.type||e.status?Z`<button class="link" @click=${()=>this.filters={search:"",area:"",mode:"",type:"",status:""}}>Clear filters</button>`:K}
      </div>
    `;}renderHelp(){return Z`
      <div class="notice help-panel" role="region" aria-label="Help">
        <p style="margin:0 0 6px">
          Hover over a column title, checkbox or option to see this text. Options without a column are in the
          expanded row: click › at the end of a zone's row.
        </p>
        <dl class="help-rows">
          ${["modes","area","type","enabled","always_on","use_entry_delay","use_exit_delay","auto_bypass","auto_bypass_modes","allow_open","arm_on_close","trigger_unavailable","entry_delay","delay_on","group"].map(e=>Z`<div><dt>${zo[e].title}</dt><dd>${zo[e].text}</dd></div>`)}
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
          ${ar.map(e=>Z`<option value=${e}>${this.typeLabel(e)}</option>`)}
        </select>
        <select aria-label="Arm mode for selected" @change=${e=>this.bulkMode=e.target.value}>
          ${sr.map(e=>Z`<option value=${e} ?selected=${this.bulkMode===e}>${this.modeLabel(e)}</option>`)}
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
          Delete zone
        </ha-button>
        <button class="link" @click=${()=>this.selection=[]}>Clear selection</button>
      </div>
    `;}cellClass(e,t,s=""){return`${s} ${this.draft.isFieldChanged(e,t)?"changed":""}`;}mark(e){return e?Z`<ha-svg-icon class="mark" .path=${Ms} title="Unsaved change"></ha-svg-icon>`:K;}get multiPartition(){return Object.keys(this.areas).length>1;}chip(e,t,s=!1){return Z`<span class="chip-cell ${s?"changed":""}" style=${`--chip:${t}`}>${e}</span>`;}liveCell(e,t){var s;const a=_o(null===(s=this.hass.states[e])||void 0===s?void 0:s.state),i=sr.filter(e=>this.modeEnabledInArea(t.area,e)),n=((e,t,s)=>!1===e.enabled?[]:"open"===t||"unavailable"===t&&e.trigger_unavailable?"motion"===e.type?[]:s.filter(s=>((e.modes||[]).includes(s)||e.always_on)&&!(e.auto_bypass&&(e.auto_bypass_modes||[]).includes(s))&&!(e.allow_open&&"open"===t)):[])(t,a,i);return Ao(a,{blocks:n.length>0,title:n.length?`Open: blocks arming ${n.map(e=>this.modeLabel(e)).join(", ")} (see Arm Check)`:a});}renderRow(e,t){const s=this.draft.get(e),a=this.draft.rowStatus(e),i="removed"===a||this.locked,n=this.expanded.includes(e),o=s.area&&this.areas[s.area],r=!1===s.enabled,l=this.draft.isFieldChanged(e,"type"),c=this.draft.isFieldChanged(e,"area"),d=nr.filter(([e])=>s[e]),h=!s.always_on&&!1===s.use_entry_delay,p=!!this.panel&&(this.panel.settings.zone_trip[e]||null)!==(this.tripDraft[e]||null)||[...nr.map(e=>e[0]),"use_entry_delay","use_exit_delay","entry_delay","delay_on","auto_bypass_modes","group","enabled"].some(t=>this.draft.isFieldChanged(e,t)),u=t.length+(this.multiPartition?9:8);return Z`
      <tr class="status-${a} ${r?"zone-disabled":""}">
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
            ${Ea(this.hass,e,a)}
            ${r||!this.locked?Z`<button
                  class="eye ${r?"off":""}"
                  ?disabled=${i}
                  title=${r?"Disabled — click to enable (unlock first)":"Enabled — click to disable"}
                  aria-label=${r?`Enable ${this.name(e)}`:`Disable ${this.name(e)}`}
                  @click=${()=>this.setField(e,"enabled",r)}
                ><ha-icon icon=${r?"mdi:eye-off":"mdi:eye-outline"}></ha-icon></button>`:K}
          </span>
        </td>
        <td class="name">
          ${this.name(e)}
          ${this.source(e,"modes")?Z`<span class="modes-src" title=${this.modesTitle(e)}>modes ${this.sourceMark(e,"modes")}</span>`:K}
          <span class="secondary">${e}${this.hass.states[e]?"":" · not found in Home Assistant"}</span>
        </td>
        <td class="c">${this.liveCell(e,s)}</td>
        <td class="${this.srcClass(e,"type")}">
          ${this.locked?this.chip(this.typeLabel(s.type),dr[s.type]||dr.other,l):Z`<select aria-label="Zone type" class=${l?"changed-inline":""} ?disabled=${i} @change=${t=>this.setField(e,"type",t.target.value)}>
                ${ar.map(e=>Z`<option value=${e} ?selected=${s.type===e}>${this.typeLabel(e)}</option>`)}
              </select>`}
          ${this.sourceMark(e,"type")}
        </td>
        ${this.multiPartition?Z`<td class="${this.srcClass(e,"area")}">
              ${this.locked?this.chip(o?this.areas[s.area].name:"— none —",o?"var(--primary-color)":"var(--error-color, #f44336)",c):Z`<select aria-label="Partition" class=${c?"changed-inline":""} ?disabled=${i} @change=${t=>this.setField(e,"area",t.target.value)}>
                    ${o?K:Z`<option value="" selected>— choose —</option>`}
                    ${Object.values(this.areas).map(e=>Z`<option value=${e.area_id} ?selected=${s.area===e.area_id}>${e.name}</option>`)}
                  </select>`}
              ${this.sourceMark(e,"area")}
            </td>`:K}
        ${t.map(t=>{var n;const o=(s.modes||[]).includes(t),r=this.modeEnabledInArea(s.area,t),l="changed"===a&&this.draft.isModeChanged(e,t);return Z`
            <td
              class="c mode ${l?"changed":""} ${this.srcClass(e,"modes")} ${"override"===(null===(n=this.source(e,"modes"))||void 0===n?void 0:n.kind)?"override-cell":""}"
              title=${`${this.modeLabel(t)}: ${o?"active":"not active"}${r?"":" — this arm mode is not enabled in the zone’s partition"}`}
            >
              ${this.locked?Z`<ha-icon class="mode-dot ${o?"on":""}" icon=${o?"mdi:check-circle":"mdi:circle-small"}></ha-icon>`:Z`<ha-checkbox
                    aria-label=${`${this.modeLabel(t)} mode`}
                    .checked=${o}
                    ?disabled=${i||!r&&!o}
                    @change=${s=>this.edit(()=>this.draft.toggleMode(e,t,s.target.checked))}
                  ></ha-checkbox>`}
            </td>
          `;})}
        <td class="opts ${p?"changed":""}">
          ${d.map(([e,t,s])=>Z`<ha-icon icon=${t} title=${`${s}: ${Po(e)}`}></ha-icon>`)}
          ${h?Z`<ha-icon icon=${lr[0]} title=${lr[1]}></ha-icon>`:K}
          ${null!==s.entry_delay&&void 0!==s.entry_delay?Z`<span class="opt-num" title="Entry delay override">${s.entry_delay}s</span>`:K}
          ${this.tripDraft[e]&&!this.panelWatched(e)?Z`<ha-icon icon=${rr[this.tripDraft[e]]} title=${`When tripped: ${or[this.tripDraft[e]]}`}></ha-icon>`:K}
        </td>
        <td class="row-actions">
          <ha-icon-button
            .path=${n?bs:fs}
            .label=${n?"Hide zone settings":"Zone settings"}
            @click=${()=>this.expanded=n?this.expanded.filter(t=>t!==e):[...this.expanded,e]}
          ></ha-icon-button>
          ${"unchanged"===a||this.locked?K:Z`<ha-icon-button .path=${"M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z"} .label=${"new"===a?"Cancel adding":"Undo changes"} @click=${()=>this.edit(()=>this.draft.revertRow(e))}></ha-icon-button>`}
        </td>
        <td class="fill"></td>
      </tr>
      ${n?this.renderDetail(e,s,u):K}
    `;}renderDetail(e,t,s){const a="removed"===this.draft.rowStatus(e)||this.locked,i=t=>this.draft.isFieldChanged(e,t)?"changed-inline":"",n=(s,n,o)=>Z`
      <div class="field ${i(s)}" title=${Po(s)}>
        <hm-slider
          .label=${n}
          .value=${void 0===t[s]?null:t[s]}
          .min=${0}
          .max=${o}
          .unit=${"s"}
          .onValue=${30}
          optional
          offText="partition default"
          ?disabled=${a}
          @value-changed=${t=>this.setField(e,s,t.detail.value)}
        ></hm-slider>
      </div>
    `,o=this.copyFrom===e,r=this.selection.filter(t=>t!==e&&"removed"!==this.draft.rowStatus(t));return Z`
      <tr class="detail">
        <td colspan=${s}>
          ${this.locked?Z`<div class="locked-note">Unlock the table to change these settings.</div>`:K}
          <div class="zone-editor">
            <div class="col">
              <h4 class="subhead">Options</h4>
              ${ir.map(([s,n])=>Z`
                  <label class="field ${i(s)}" title=${Po(s)}>
                    <span>${n}</span>
                    <input type="checkbox" class="cb" .checked=${"enabled"===s?!1!==t.enabled:!!t[s]} ?disabled=${a}
                      @change=${t=>this.setField(e,s,t.target.checked)} />
                  </label>
                `)}
            </div>
            <div class="col">
              <h4 class="subhead">Delays and grouping</h4>
              ${n("entry_delay","Entry delay override",300)} ${n("delay_on","Delay on",600)}
              <label class="field ${i("group")}" title=${Po("group")}>
                <span>Cross-zone group</span>
                <select aria-label="Cross-zone group" ?disabled=${a} @change=${t=>this.setField(e,"group",t.target.value||null)}>
                  <option value="" ?selected=${!t.group}>None</option>
                  ${Object.values(this.groups).map(e=>Z`<option value=${e.group_id} ?selected=${t.group===e.group_id}>${e.name}</option>`)}
                </select>
              </label>
              ${t.auto_bypass?Z`<div class="field ${i("auto_bypass_modes")}" title=${Po("auto_bypass_modes")}>
                    <span>Bypass in</span>
                    <span class="mode-picks">
                      ${sr.filter(e=>this.modeEnabledInArea(t.area,e)||(t.auto_bypass_modes||[]).includes(e)).map(s=>Z`<label><ha-checkbox .checked=${(t.auto_bypass_modes||[]).includes(s)} ?disabled=${a}
                          @change=${t=>this.edit(()=>this.draft.toggleMode(e,s,t.target.checked,"auto_bypass_modes"))}></ha-checkbox>${this.modeLabel(s)}</label>`)}
                    </span>
                  </div>`:K}
              ${this.renderTripField(e,a)}
              ${this.multiPartition?K:Z`<div class="field"><span>Partition</span><span>${t.area&&this.areas[t.area]?this.areas[t.area].name:"— none —"}</span></div>`}
              <div class="copy">
                ${o?Z`<div class="notice" style="margin:0">
                      <strong>Copy settings of this zone</strong>
                      <div class="mode-picks">
                        ${hr.map(e=>Z`<label><ha-checkbox .checked=${this.copyGroups.includes(e.id)}
                          @change=${t=>this.copyGroups=t.target.checked?[...this.copyGroups,e.id]:this.copyGroups.filter(t=>t!==e.id)}></ha-checkbox>${e.label}</label>`)}
                      </div>
                      <p style="margin:6px 0">${r.length?Z`to the <strong>${r.length}</strong> zone(s) selected with the row checkboxes.`:Z`Select the target zones with the row checkboxes.`}</p>
                      <ha-button ?disabled=${!r.length||!this.copyGroups.length} @click=${()=>this.copySettings(e,r)}>Copy</ha-button>
                      <ha-button appearance="plain" @click=${()=>this.copyFrom=null}>Cancel</ha-button>
                    </div>`:Z`<ha-button appearance="plain" ?disabled=${a} @click=${()=>this.copyFrom=e}>
                      <ha-icon slot="start" icon="mdi:content-copy"></ha-icon>Copy settings to…</ha-button>`}
              </div>
            </div>
          </div>
        </td>
      </tr>
    `;}renderTripField(e,t){if(!this.panel||!Object.keys(this.panel.settings.links).length)return K;if(this.panelWatched(e))return Z`<div class="field"><span>When tripped</span><span class="secondary" style="display:inline">the physical panel handles this zone</span></div>`;const s=this.tripDraft[e]||"default",a=(this.panel.settings.zone_trip[e]||null)!==(this.tripDraft[e]||null);return Z`<label class="field ${a?"changed-inline":""}"
      title="This zone is watched only by Home Assistant. What happens when it triggers the alarm: the default is set on Physical Panel → How HA-only zones raise the alarm.">
      <span>When tripped</span>
      <select aria-label="When tripped" ?disabled=${t} @change=${t=>this.setTrip(e,t.target.value)}>
        <option value="default" ?selected=${"default"===s}>default (${or[this.tripDefault()]})</option>
        <option value="panel" ?selected=${"panel"===s}>${or.panel}</option>
        <option value="notify" ?selected=${"notify"===s}>${or.notify}</option>
        <option value="none" ?selected=${"none"===s}>${or.none}</option>
      </select>
    </label>`;}copySettings(e,t){const s=this.draft.get(e),a=hr.filter(e=>this.copyGroups.includes(e.id)).reduce((e,t)=>[...e,...t.fields],[]);this.edit(()=>t.forEach(e=>a.forEach(t=>{var a;return this.draft.setField(e,t,JSON.parse(JSON.stringify(null!==(a=s[t])&&void 0!==a?a:null)));}))),this.copyFrom=null,_a(this,`Copied to ${t.length} zone(s) as unsaved changes — review and Save.`);}renderSaveBar(e){const t=this.draft.toBatch(),s=this.tripChanges(),a=[t.create.length?`${t.create.length} new`:"",t.update.length?`${t.update.length} changed`:"",t.delete.length?`${t.delete.length} to remove`:"",s?`${s} trip action(s)`:""].filter(Boolean);return Z`
      <div class="savebar" role="region" aria-label="Unsaved changes">
        <ha-svg-icon class="mark" style="width:22px;height:22px" .path=${Ms}></ha-svg-icon>
        <span class="count">
          ${e} unsaved change${1===e?"":"s"}
          <span class="secondary" style="display:inline">(${a.join(", ")}) — a backup is made before saving</span>
        </span>
        <ha-button appearance="plain" ?disabled=${this.saving} @click=${this.discard}>Discard</ha-button>
        <ha-button ?disabled=${this.saving} @click=${this.save}>${this.saving?"Saving…":"Save"}</ha-button>
      </div>
    `;}setField(e,t,s){this.edit(()=>this.draft.setField(e,t,s));}selectRows(e,t){const s=this.selection.filter(t=>!e.includes(t));this.selection=t?[...s,...e]:s;}bulkSet(e,t){const s=t.target.value;t.target.value="",s&&this.edit(()=>this.draft.setFieldMany(this.selection,e,s));}addPicked(e){this.locked=!1;const{entity_ids:t,area:s}=e.detail,a=this.areas[s],i=sr.filter(e=>a&&a.modes&&a.modes[e]&&a.modes[e].enabled);this.edit(()=>{t.forEach(e=>{let t=bi(this.hass.states[e],i);t&&(["cover","lock"].includes(e.split(".")[0])&&(t=Object.assign(Object.assign(Object.assign({},t),{type:Vs.Door}),yi(i)[Vs.Door])),this.draft.add(Object.assign(Object.assign({},t),{area:s,group:null})));});}),this.showAdd=!1,_a(this,`${t.length} zone(s) added to the draft. Click Save to apply.`);}discard(){window.confirm(`Discard ${this.draft.changeCount()+this.tripChanges()} unsaved change(s)?`)&&(this.edit(()=>this.draft.discardAll()),this.panel&&(this.tripDraft=Object.assign({},this.panel.settings.zone_trip)),this.restoredCount=0);}modesTitle(e){const t=this.source(e,"modes");return t?"override"===t.kind?"Arm modes: manual override (clear it from the Modes icon next to the zone name)":`Arm modes set by rule: ${this.ruleNames(t.rules)}`:"";}async rulesApplied(e){this.showRulesPreview=!1;const t=e.detail;_a(this,`Rules applied: ${t.created} new, ${t.updated} changed zone(s). Backup: ${t.backup.name}`),await this.fetchData();}async save(){const e=this.draft.toBatch();if(e.delete.length&&!window.confirm(`Remove ${e.delete.length} zone(s) from the alarm: ${e.delete.join(", ")}? A backup is made first.`))return;const t=e.create.filter(e=>!e.area||!this.areas[e.area]).map(e=>e.entity_id);if(t.length)this.error=`Choose a partition for: ${t.join(", ")}`;else{this.saving=!0,this.error="";try{const t=!e.create.length&&!e.update.length&&!e.delete.length?null:await((e,t)=>e.callWS(Object.assign({type:"house_modes/ext/sensors/apply_changes"},t)))(this.hass,e);if(this.panel&&this.tripChanges()){const t={};Object.keys(this.tripDraft).forEach(s=>{e.delete.includes(s)||(t[s]=this.tripDraft[s]);});const s=(await So(this.hass)).settings;await Co(this.hass,Object.assign(Object.assign({},s),{zone_trip:t})),this.panel=void 0;}this.edit(()=>this.draft.discardAll()),this.restoredCount=0,this.selection=[],this.locked=!0,await this.fetchData(),_a(this,t?`Saved ${t.created+t.updated+t.deleted} zone(s). Backup: ${t.backup.name}`:"Saved.");}catch(e){this.error=`Nothing was saved:\n${ba(e)}`;}finally{this.saving=!1;}}}};pr.styles=ka,i([ye({attribute:!1})],pr.prototype,"hass",void 0),i([ye({type:Boolean})],pr.prototype,"narrow",void 0),i([ye({attribute:!1})],pr.prototype,"path",void 0),i([be()],pr.prototype,"areas",void 0),i([be()],pr.prototype,"groups",void 0),i([be()],pr.prototype,"loaded",void 0),i([be()],pr.prototype,"selection",void 0),i([be()],pr.prototype,"expanded",void 0),i([be()],pr.prototype,"filters",void 0),i([be()],pr.prototype,"saving",void 0),i([be()],pr.prototype,"error",void 0),i([be()],pr.prototype,"restoredCount",void 0),i([be()],pr.prototype,"showAdd",void 0),i([be()],pr.prototype,"copyFrom",void 0),i([be()],pr.prototype,"panel",void 0),i([be()],pr.prototype,"tripDraft",void 0),i([be()],pr.prototype,"copyGroups",void 0),i([be()],pr.prototype,"rev",void 0),i([be()],pr.prototype,"rules",void 0),i([be()],pr.prototype,"rulesPreview",void 0),i([be()],pr.prototype,"registry",void 0),i([be()],pr.prototype,"showRulesPreview",void 0),i([be()],pr.prototype,"showHelp",void 0),i([be()],pr.prototype,"locked",void 0),pr=i([me("hm-view-sensor-table")],pr);const ur=e=>e.callWS({type:"house_modes/ext/alarmo_import/status"});function mr(e){return[[e.partitions,"partition"],[e.zones,"zone"],[e.users,"user"],[e.alarm_events,"Alarm Event"],[e.sensor_groups,"cross-zone group"],[e.house_modes,"House Mode"],[e.panel_links,"panel link"],[e.mirrors,"mirror"],[e.zone_rules,"zone rule"],[e.lock_links,"lock code slot"]].filter(([e])=>e>0).map(([e,t])=>`${e} ${t}${1===e?"":"s"}`).join(" · ");}const gr=e=>e?new Date(e).toLocaleString():"";let vr=class extends pe{constructor(){super(...arguments),this.mode="ask",this.busy="",this.error="",this.justImported=!1;}firstUpdated(){this.load();}async load(){try{this.status=await ur(this.hass),this.error="",this.dispatchEvent(new CustomEvent("import-status",{detail:this.status,bubbles:!0,composed:!0}));}catch(e){this.error=ba(e);}}async doImport(){const e=this.status,t="fresh"===e.choice,s=`Import from ${"fork"===e.kind?"the Alarmo-based House Modes build":"Alarmo"}?\n\n${mr(e.counts)}\n\n`+(t?"This replaces the current configuration of this integration (a backup is made first).\n\n":"")+"The Alarmo files are only read: they are not changed, moved or deleted. Activity and backups are copied to /config/house_modes/.";if(window.confirm(s)){this.busy="import";try{await(a=this.hass,a.callWS({type:"house_modes/ext/alarmo_import/run"})),this.justImported=!0,_a(this,"Imported from Alarmo. Check the House Mode, then disarm and arm once."),await new Promise(e=>setTimeout(e,1500)),await this.load();}catch(e){this.error=ba(e);}finally{this.busy="";}var a;}}async doFresh(){if(window.confirm("Start fresh, without the Alarmo configuration?\n\nYou can still import it later from the Backup tab while the Alarmo files exist.")){this.busy="fresh";try{await(e=this.hass,e.callWS({type:"house_modes/ext/alarmo_import/fresh"})),await this.load();}catch(e){this.error=ba(e);}finally{this.busy="";}var e;}}async doScan(){this.busy="scan";try{this.scan=await(e=this.hass,e.callWS({type:"house_modes/ext/references/scan"})),this.error="";}catch(e){this.error=ba(e);}finally{this.busy="";}var e;}async doRewrite(){const e=this.scan,t=e.files.filter(e=>e.hits.length).map(e=>e.file),s=e.dashboards.filter(e=>e.hits.length&&"storage"===e.mode).map(e=>e.url_path||"Overview");if(window.confirm(`Rewrite ${e.total} Alarmo name(s)?\n\nFiles: ${t.join(", ")||"none"}\nDashboards: ${s.join(", ")||"none"}\n\nA copy of each is kept; Undo puts them back.`)){this.busy="rewrite";try{const t=await(a=this.hass,i=e.token,a.callWS({type:"house_modes/ext/references/apply",token:i}));_a(this,t.restart.length?`Rewritten. Restart Home Assistant for: ${t.restart.join(", ")}`:"Rewritten and reloaded."),await this.doScan();}catch(e){this.error=ba(e);}finally{this.busy="";}var a,i;}}async doUndo(){if(window.confirm("Put the automations, scripts and dashboards back as they were before the rewrite?\n\nDo this before going back to Alarmo.")){this.busy="undo";try{const t=await(e=this.hass,e.callWS({type:"house_modes/ext/references/undo"}));_a(this,t.restart.length?`Put back. Restart Home Assistant for: ${t.restart.join(", ")}`:"Put back and reloaded."),await this.doScan();}catch(e){this.error=ba(e);}finally{this.busy="";}var e;}}render(){const e=this.status;return e?"ask"!==this.mode||e.ask||this.justImported?e.found||"imported"===e.choice?Z`
      ${this.error?Z`<div class="notice error" style="white-space:pre-line">${this.error}</div>`:K}
      ${"imported"===e.choice?this.renderImported(e):this.renderQuestion(e)}
      ${"imported"===e.choice?this.renderReferences():K}
    `:"backup"===this.mode?Z`<p class="secondary">No Alarmo files found (.storage/alarmo.storage, .storage/alarmo_extras).</p>`:K:K:this.error?Z`<div class="notice error">${this.error}</div>`:K;}renderOldEntry(e){return e.old_entries.length?e.old_active?Z`<div class="notice warn">The <strong>Alarmo</strong> integration is still enabled. Disable it first: Settings →
          Devices &amp; services → Alarmo → ⋮ → <strong>Disable</strong>. The two must never run at the same time (double
          arming, double keypresses to the panel); until then this integration's panel link stays in Shadow.</div>`:Z`<p class="secondary">The Alarmo integration is disabled. To go back: disable this integration, then enable Alarmo again.</p>`:K;}renderQuestion(e){const t="fork"===e.kind?"the Alarmo-based House Modes build (with House Modes)":"Alarmo (no House Modes)";return Z`
      <div class="import ${this.mode}">
        <h3><ha-icon icon="mdi:database-import-outline"></ha-icon>Import from Alarmo?</h3>
        <p>Found a configuration from ${t}:</p>
        <p class="counts">${mr(e.counts)||"no partitions or zones"}</p>
        ${e.folders.activity||e.folders.backups?Z`<p class="secondary">Also ${e.folders.activity} Activity day(s) and ${e.folders.backups} backup file(s) in /config/alarmo/: they are copied.</p>`:K}
        <p class="secondary">Import copies it into this integration: user codes stay as they are (hashed), service and event
          names are updated. The Alarmo files are only read and stay as they are, so going back to Alarmo is always possible.</p>
        ${this.renderOldEntry(e)}
        ${"fresh"===e.choice?Z`<p class="secondary">You chose <em>Start fresh</em> on ${gr(e.at)}. Importing now replaces the current configuration (a backup is made first).</p>`:K}
        <div class="toolbar">
          <ha-button ?disabled=${!!this.busy||e.old_active} @click=${this.doImport}>
            <ha-icon slot="start" icon="mdi:database-import-outline"></ha-icon>${"import"===this.busy?"Importing…":"Import"}
          </ha-button>
          ${"fresh"!==e.choice?Z`<ha-button appearance="plain" ?disabled=${!!this.busy} @click=${this.doFresh}>Start fresh</ha-button>`:K}
        </div>
      </div>`;}renderImported(e){const t=e.imported;return Z`
      <div class="import done">
        <h3><ha-icon icon="mdi:check-circle"></ha-icon>Imported from Alarmo</h3>
        <p>On ${gr(e.at)}${t?Z`, from ${"fork"===t.kind?"the Alarmo-based House Modes build":"Alarmo"}:`:""}</p>
        ${t?Z`<p class="counts">${mr(t.counts)}</p>
          <p class="secondary">Copied ${t.copied.activity} Activity day(s) and ${t.copied.backups} backup file(s) to /config/house_modes/.
            Backup before the import: ${t.backup}.</p>`:K}
        ${this.renderOldEntry(e)}
      </div>`;}renderReferences(){const e=this.scan;return Z`
      <div class="import refs">
        <h4>Alarmo names in your automations, scripts and dashboards</h4>
        <p class="secondary">Automations may still call <code>alarmo.set_house_mode</code>, listen for
          <code>alarmo_house_mode_changed</code> or read <code>select.alarmo_house_mode</code>. Scan lists them; nothing changes until
          you press Rewrite. A copy of every file and dashboard is kept, and Undo puts them back.</p>
        <div class="toolbar">
          <ha-button appearance="plain" ?disabled=${!!this.busy} @click=${this.doScan}>${"scan"===this.busy?"Scanning…":e?"Scan again":"Scan"}</ha-button>
          ${e&&e.total?Z`<ha-button ?disabled=${!!this.busy} @click=${this.doRewrite}>${"rewrite"===this.busy?"Rewriting…":`Rewrite ${e.total}`}</ha-button>`:K}
          ${(null==e?void 0:e.last)?Z`<span class="grow"></span><ha-button appearance="plain" ?disabled=${!!this.busy} @click=${this.doUndo}>Undo the rewrite of ${gr(e.last.at)}</ha-button>`:K}
        </div>
        ${e?this.renderScan(e):K}
      </div>`;}renderScan(e){return e.files.length||e.dashboards.length?Z`
      ${e.files.map(e=>Z`<details class="ref">
        <summary><code>${e.file}</code> <span class="secondary" style="display:inline">· ${e.hits.length} to rewrite${e.other.length?` · ${e.other.length} other mention(s), left as they are`:""}</span></summary>
        <table>
          ${e.hits.map(e=>Z`<tr><td class="num">${e.line}</td><td>${e.kind}</td><td><code>${e.old}</code> → <code>${e.new}</code></td></tr>`)}
          ${e.other.map(e=>Z`<tr class="other"><td class="num">${e.line}</td><td>left as is</td><td><code>${e.text}</code></td></tr>`)}
          ${e.cards.map(e=>Z`<tr class="other"><td class="num">${e}</td><td>by hand</td><td>custom:alarmo-card is not part of this integration: use custom:house-modes-alarm-center-card</td></tr>`)}
        </table>
      </details>`)}
      ${e.dashboards.map(e=>Z`<details class="ref">
        <summary>Dashboard <code>${e.url_path||"Overview"}</code> <span class="secondary" style="display:inline">· ${e.hits.length} to rewrite${"storage"!==e.mode?" (YAML mode: change it by hand)":""}${e.cards?` · ${e.cards} custom:alarmo-card (by hand)`:""}</span></summary>
        <table>${e.hits.map(e=>Z`<tr><td>${e.kind}</td><td><code>${e.old}</code> → <code>${e.new}</code></td></tr>`)}</table>
      </details>`)}`:Z`<p class="secondary">No Alarmo names found.</p>`;}};vr.styles=[ka,h`
      :host {
        display: block;
      }
      .import {
        padding: 4px 16px 12px;
      }
      .import.ask {
        border: 1px solid var(--primary-color);
        border-radius: 8px;
        margin: 0 0 12px;
        padding: 4px 16px 12px;
        background: var(--card-background-color);
      }
      h3 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 12px 0 4px;
        font-size: 1.1em;
      }
      .import.done h3 ha-icon {
        color: var(--success-color, #43a047);
      }
      h4 {
        margin: 12px 0 4px;
      }
      .counts {
        font-weight: 500;
      }
      .ref summary {
        cursor: pointer;
        padding: 4px 0;
      }
      .ref table {
        border-collapse: collapse;
        width: 100%;
        font-size: 0.9em;
      }
      .ref td {
        padding: 2px 6px;
        border-top: 1px solid var(--divider-color);
        vertical-align: top;
        word-break: break-word;
      }
      .ref td.num {
        width: 3em;
        text-align: right;
        color: var(--secondary-text-color);
      }
      .ref tr.other {
        color: var(--secondary-text-color);
      }
    `],i([ye({attribute:!1})],vr.prototype,"hass",void 0),i([ye()],vr.prototype,"mode",void 0),i([be()],vr.prototype,"status",void 0),i([be()],vr.prototype,"scan",void 0),i([be()],vr.prototype,"busy",void 0),i([be()],vr.prototype,"error",void 0),i([be()],vr.prototype,"justImported",void 0),vr=i([me("hm-alarmo-import")],vr);const yr={config:"General settings",areas:"Partitions",sensors:"Zones",users:"Users / codes",automations:"Actions & notifications",sensor_groups:"Cross-zone groups"},br=e=>null==e?"—":"object"==typeof e?JSON.stringify(e):String(e);let fr=class extends pe{constructor(){super(...arguments),this.backups=[],this.backupName="",this.initialMode="merge",this.sourceKind="file",this.fileName="",this.fileContent=null,this.selectedBackup="",this.mode="merge",this.busy=!1,this.error="",this.openSections=[];}firstUpdated(){this.mode=this.initialMode,this.backupName?(this.sourceKind="backup",this.selectedBackup=this.backupName):this.backups.length&&(this.selectedBackup=this.backups[0].name);}source(){return"backup"===this.sourceKind?this.selectedBackup?{backup_name:this.selectedBackup}:null:null!==this.fileContent?{content:this.fileContent}:null;}reset(){this.preview=void 0,this.error="";}render(){return Z`
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
          Upload a file (YAML export or <code>house_modes.storage</code>)
        </label>
      </p>
      ${"file"===this.sourceKind?Z`
            <p style="margin-left:24px">
              <input type="file" accept=".yaml,.yml,.json,.storage,text/yaml,application/json" aria-label="File to import" @change=${this.pickFile} />
              ${this.fileName?Z`<span class="secondary">${this.fileName}</span>`:K}
            </p>
          `:K}
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
                      ${$a(e.created,this.hass.language)}${e.label?` — ${e.label}`:""}
                    </option>
                  `)}
              </select>
            </p>
          `:K}
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
      ${this.error?Z`<div class="notice error" style="margin:8px 0;white-space:pre-line">${this.error}</div>`:K}
    `;}renderPreview(e){if(!e.ok&&!e.sections)return Z`
        <div class="notice error" style="margin:8px 0">
          <strong>This file cannot be imported:</strong>
          <ul>${e.errors.map(e=>Z`<li>${e}</li>`)}</ul>
        </div>
      `;const t=e.sections||{};return Z`
      <p class="secondary" style="display:block">
        ${"storage"===e.format?"house_modes.storage file":"YAML export"} · storage ${e.source_version}
        ${e.exported_at?Z` · exported ${$a(e.exported_at,this.hass.language)}`:K}
        ${e.house_modes_version?Z` · version ${e.house_modes_version}`:K} · mode <strong>${e.mode}</strong>
      </p>
      ${e.blocked_by&&e.blocked_by.length?Z`<div class="notice error" style="margin:8px 0">
            <strong>Disarm first.</strong> Import and restore are blocked while armed, arming, pending or triggered:
            ${e.blocked_by.join(", ")}
          </div>`:K}
      ${e.errors.length?Z`<div class="notice error" style="margin:8px 0">
            <strong>Problems that must be fixed first:</strong>
            <ul>${e.errors.map(e=>Z`<li>${e}</li>`)}</ul>
          </div>`:K}
      ${e.warnings&&e.warnings.length?Z`<div class="notice warn" style="margin:8px 0">
            <strong>Warnings:</strong>
            <ul>${e.warnings.map(e=>Z`<li>${e}</li>`)}</ul>
          </div>`:K}
      ${e.extras_included?Z`<div class="notice" style="margin:8px 0">
            <strong>Also restores the extra settings:</strong>
            ${e.extras_changes&&e.extras_changes.length?Z`<ul style="margin:4px 0">${e.extras_changes.map(e=>Z`<li>${e.label}</li>`)}</ul>`:Z` unchanged.`}
            <span class="secondary" style="display:block">The current House Mode and its history stay as they are.</span>
          </div>`:Z`<div class="notice" style="margin:8px 0">This file has no extra settings (House Modes, physical panel,
            zone rules, mirrors); those stay as they are.</div>`}
      ${e.total_changes?K:Z`<div class="notice" style="margin:8px 0">No changes — the file matches the current configuration.</div>`}
      <table>
        <thead>
          <tr><th>Section</th><th class="c">Added</th><th class="c">Changed</th><th class="c">Removed</th><th></th></tr>
        </thead>
        <tbody>
          ${Object.entries(t).map(([e,t])=>{const s=t.added.length+t.changed.length+t.removed.length,a=this.openSections.includes(e);return Z`
              <tr>
                <td>${yr[e]||e}</td>
                <td class="c">${t.added.length?Z`<span class="badge new">${t.added.length}</span>`:"0"}</td>
                <td class="c">${t.changed.length?Z`<span class="badge">${t.changed.length}</span>`:"0"}</td>
                <td class="c">${t.removed.length?Z`<span class="badge removed">${t.removed.length}</span>`:"0"}</td>
                <td>
                  ${s?Z`<button class="link" @click=${()=>this.openSections=a?this.openSections.filter(t=>t!==e):[...this.openSections,e]}>
                        ${a?"Hide":"Details"}
                      </button>`:K}
                </td>
              </tr>
              ${a?Z`<tr class="detail"><td colspan="5">
                    ${t.added.map(e=>Z`<div class="status-icon new">+ ${e.label}</div>`)}
                    ${t.removed.map(e=>Z`<div class="status-icon removed">− ${e.label}</div>`)}
                    ${t.changed.map(e=>Z`<div style="margin:4px 0">
                        <span class="status-icon changed">✎ ${e.label}</span>
                        <ul style="margin:2px 0">
                          ${e.fields.map(e=>Z`<li><code>${e.field}</code>: ${br(e.old)} → <strong>${br(e.new)}</strong></li>`)}
                        </ul>
                      </div>`)}
                  </td></tr>`:K}
            `;})}
        </tbody>
      </table>
      <p class="secondary" style="display:block;margin-top:12px">
        Applying makes a backup of the current configuration first, then reloads the integration (alarm entities are
        unavailable for a few seconds).
      </p>
      ${this.error?Z`<div class="notice error" style="margin:8px 0;white-space:pre-line">${this.error}</div>`:K}
    `;}renderFooter(){const e=this.preview;if(!e)return Z`
        <ha-button appearance="plain" @click=${this.close}>Cancel</ha-button>
        <ha-button ?disabled=${this.busy||!this.source()} @click=${this.runPreview}>
          ${this.busy?"Checking…":"Preview changes"}
        </ha-button>
      `;const t=!(!e.blocked_by||!e.blocked_by.length),s=e.ok&&!t&&!!e.total_changes&&!this.busy;return Z`
      <ha-button appearance="plain" ?disabled=${this.busy} @click=${this.reset}>Back</ha-button>
      <ha-button appearance="plain" ?disabled=${this.busy} @click=${this.runPreview}>Check again</ha-button>
      <ha-button appearance="plain" ?disabled=${this.busy} @click=${this.close}>Cancel</ha-button>
      <ha-button ?disabled=${!s} variant=${"replace"===e.mode?"danger":"brand"} @click=${this.apply}>
        ${this.busy?"Applying…":`${"replace"===e.mode?"Replace":"Merge"} ${e.total_changes||0} change(s)`}
      </ha-button>
    `;}async pickFile(e){const t=e.target.files&&e.target.files[0];this.reset(),t&&(t.size>5242880?this.error="File is too large (over 5 MB) to be a configuration file.":(this.fileName=t.name,this.fileContent=await t.text()));}async runPreview(){const e=this.source();if(e){this.busy=!0,this.error="";try{this.preview=await(t=this.hass,s=e,a=this.mode,t.callWS(Object.assign(Object.assign({type:"house_modes/ext/import/preview"},s),{mode:a}))),this.openSections=[];}catch(e){this.error=ba(e);}finally{this.busy=!1;}var t,s,a;}}async apply(){const e=this.source(),t=this.preview;if(!e||!t||!t.token)return;const s="replace"===t.mode?"REPLACE the whole configuration":"merge these changes into the configuration";if(window.confirm(`This will ${s} (${t.total_changes} change(s)). A backup is made first. Continue?`)){this.busy=!0,this.error="";try{const s=await(a=this.hass,i=e,n=t.mode,o=t.token,a.callWS(Object.assign(Object.assign({type:"house_modes/ext/import/apply"},i),{mode:n,token:o})));this.dispatchEvent(new CustomEvent("imported",{detail:s}));}catch(e){this.error=ba(e);}finally{this.busy=!1;}var a,i,n,o;}}close(){this.dispatchEvent(new CustomEvent("close"));}};fr.styles=ka,i([ye({attribute:!1})],fr.prototype,"hass",void 0),i([ye({attribute:!1})],fr.prototype,"backups",void 0),i([ye()],fr.prototype,"backupName",void 0),i([ye()],fr.prototype,"initialMode",void 0),i([be()],fr.prototype,"sourceKind",void 0),i([be()],fr.prototype,"fileName",void 0),i([be()],fr.prototype,"fileContent",void 0),i([be()],fr.prototype,"selectedBackup",void 0),i([be()],fr.prototype,"mode",void 0),i([be()],fr.prototype,"preview",void 0),i([be()],fr.prototype,"busy",void 0),i([be()],fr.prototype,"error",void 0),i([be()],fr.prototype,"openSections",void 0),fr=i([me("hm-import-dialog")],fr);let $r=class extends pe{constructor(){super(...arguments),this.narrow=!1,this.backups=[],this.settings={retention_days:30},this.retentionInput="30",this.backupDir="",this.label="",this.busy=!1,this.error="",this.loaded=!1,this.dialog=null;}firstUpdated(){this.refresh();}async refresh(){try{const[t,s]=await Promise.all([va(this.hass),(e=this.hass,e.callWS({type:"house_modes/ext/backup/list"}))]);this.backupDir=t.backup_dir,this.backups=s.backups,this.settings=s.settings,this.retentionInput=String(s.settings.retention_days),this.loaded=!0;}catch(e){this.error=ba(e);}var e;}async run(e){this.busy=!0,this.error="";try{await e();}catch(e){this.error=ba(e);}finally{this.busy=!1;}}render(){if(!this.hass)return K;const e=this.retentionInput!==String(this.settings.retention_days);return Z`
      ${za("Integrations & Backup","settings",Z`<p>Backups of the whole configuration, export and import, and MQTT for wall
        panels. Open a section to see it.</p>`,Z`
      ${Ta("alarmo-import","Import from Alarmo","one-time import, and Alarmo names in your automations",Z`<hm-alarmo-import .hass=${this.hass} mode="backup"></hm-alarmo-import>`)}
      ${Ta("backup-restore","Backup & restore","one before every save and import · keep "+(this.settings.retention_days?`${this.settings.retention_days} days`:"forever"),Z`
        <div class="card-content desc">
          <p>A backup is a copy of the whole configuration: partitions, zones, users, notifications, actions and the ext settings.</p>
          <ul>
            <li>One is made automatically before every save on these pages and before every import.</li>
            <li>You can also make one here, download the configuration as YAML, or import / restore one.</li>
            <li>It includes the House Mode, physical panel, mirror and zone rule settings (backups made before ext.11 do not).</li>
          </ul>
        </div>
        <div class="notice warn">
          Backups and exports contain the <strong>hashed user codes</strong>. Keep the files private.
        </div>
        ${this.error?Z`<div class="notice error" style="white-space:pre-line">${this.error}</div>`:K}
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
          <hm-slider
            .label=${"Delete backups older than"}
            .min=${1}
            .max=${365}
            unit="days"
            optional
            offText="keep forever"
            .onValue=${30}
            .value=${parseInt(this.retentionInput,10)>0?parseInt(this.retentionInput,10):null}
            @value-changed=${e=>this.retentionInput=String(e.detail.value||0)}
          ></hm-slider>
          <ha-button appearance="plain" ?disabled=${this.busy||!e} @click=${this.saveRetention}>Save</ha-button>
          <span class="secondary" style="display:inline">
            Untick to keep backups forever. The newest backup is always kept.
            ${this.backupDir?Z`Folder: <code>${this.backupDir}</code>`:K}
          </span>
        </div>
      `)}

      ${Ta("backup-saved","Saved backups",`${this.backups.length} backup${1===this.backups.length?"":"s"}`,Z`
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
      `)}

      ${this.dialog?Z`
            <hm-import-dialog
              .hass=${this.hass}
              .backups=${this.backups}
              .backupName=${this.dialog.backupName}
              .initialMode=${this.dialog.mode}
              @close=${()=>this.dialog=null}
              @imported=${this.imported}
            ></hm-import-dialog>
          `:K}
        ${Ta("mqtt","MQTT","publish the alarm and accept commands, e.g. for wall panels",Z`<hm-view-general .hass=${this.hass} .narrow=${this.narrow} .path=${{page:"backup",params:{}}} .section=${"mqtt"}></hm-view-general>`,{flat:!0})}
      `)}
    `;}renderRow(e){const t=(t,s)=>e.files[t]?Z`
            <ha-button appearance="plain" size="small" @click=${()=>this.download(e.files[t].file)}>
              <ha-svg-icon slot="start" .path=${"M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"}></ha-svg-icon>
              ${s} (${(e=>e<1024?`${e} B`:`${(e/1024).toFixed(1)} KB`)(e.files[t].size)})
            </ha-button>
          `:K;return Z`
      <tr>
        <td>${$a(e.created,this.hass.language)}</td>
        <td>${e.label||"—"}</td>
        <td>${t("yaml","YAML")} ${t("storage",".storage")} ${t("extras","ext settings")}</td>
        <td>
          <ha-icon-button
            .path=${"M12,3A9,9 0 0,0 3,12H0L4,16L8,12H5A7,7 0 0,1 12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19C10.5,19 9.09,18.5 7.94,17.7L6.5,19.14C8.04,20.3 9.94,21 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M14,12A2,2 0 0,0 12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12Z"}
            .label=${"Restore this backup"}
            @click=${()=>this.dialog={backupName:e.name,mode:"replace"}}
          ></ha-icon-button>
          <ha-icon-button .path=${ws} .label=${"Delete backup"} @click=${()=>this.removeBackup(e)}></ha-icon-button>
        </td>
      </tr>
    `;}create(){this.run(async()=>{const e=await ya(this.hass,this.label.trim()||void 0);this.label="",await this.refresh(),_a(this,`Backup created: ${e.name}`);});}exportNow(){this.run(async()=>{const e=await(t=this.hass,t.callWS({type:"house_modes/ext/export"}));var t;fa(e.file_name,e.content);});}download(e){this.run(async()=>{const t=await((e,t)=>e.callWS({type:"house_modes/ext/backup/download",file:t}))(this.hass,e);fa(t.file_name,t.content,e.endsWith(".json")?"application/json":"text/yaml");});}removeBackup(e){window.confirm(`Delete the backup from ${$a(e.created,this.hass.language)}? Both files are removed.`)&&this.run(async()=>{var t,s;await(t=this.hass,s=e.name,t.callWS({type:"house_modes/ext/backup/delete",name:s})),await this.refresh();});}saveRetention(){const e=parseInt(this.retentionInput,10);isNaN(e)||e<0||e>3650?this.error="Retention must be a number of days between 0 and 3650.":this.run(async()=>{var t,s;this.settings=await(t=this.hass,s={retention_days:e},t.callWS(Object.assign({type:"house_modes/ext/backup/settings"},s))),await this.refresh(),_a(this,e?`Backups older than ${e} days will be deleted.`:"Backups will be kept forever.");});}async imported(e){this.dialog=null;const t=e.detail;_a(this,`Applied ${t.total_changes} change(s). Previous configuration saved as ${t.backup.name}.`),setTimeout(()=>this.refresh(),1500);}};$r.styles=ka,i([ye({attribute:!1})],$r.prototype,"hass",void 0),i([ye({type:Boolean})],$r.prototype,"narrow",void 0),i([ye({attribute:!1})],$r.prototype,"path",void 0),i([be()],$r.prototype,"backups",void 0),i([be()],$r.prototype,"settings",void 0),i([be()],$r.prototype,"retentionInput",void 0),i([be()],$r.prototype,"backupDir",void 0),i([be()],$r.prototype,"label",void 0),i([be()],$r.prototype,"busy",void 0),i([be()],$r.prototype,"error",void 0),i([be()],$r.prototype,"loaded",void 0),i([be()],$r.prototype,"dialog",void 0),$r=i([me("hm-view-backup")],$r);const _r=e=>JSON.parse(JSON.stringify(e)),wr={enabled:!0,use_exit_delay:!0,use_entry_delay:!0,always_on:!1,arm_on_close:!1,allow_open:!1,trigger_unavailable:!1,auto_bypass:!1,auto_bypass_modes:[],entry_delay:null,delay_on:null,group:null};let kr=class extends pe{constructor(){super(...arguments),this.narrow=!1,this.mirrors={},this.ignored=[],this.bypassEntity=null,this.sensors={},this.areas={},this.extra="",this.search="",this.error="",this.busy=!1,this.locked=!0,this.selection=[],this.addTo="",this.showIgnored=!1,this.mirrorType="",this.useMirrors=!0;}firstUpdated(){this.refresh();}async refresh(){try{const[e,t,s]=await Promise.all([So(this.hass),ke(this.hass),Le(this.hass)]);this.info=e,this.sensors=t,this.areas=s,this.addTo&&s[this.addTo]||(this.addTo=Object.keys(s)[0]||""),this.mirrors=_r(e.settings.mirrors),this.ignored=[...(e.settings.ignored_zones||[])],this.bypassEntity=e.settings.bypass_entity||null;}catch(e){this.error=ba(e);}}get dirty(){var e;const t=null===(e=this.info)||void 0===e?void 0:e.settings;return!!t&&(JSON.stringify(t.mirrors)!==JSON.stringify(this.mirrors)||JSON.stringify([...(t.ignored_zones||[])].sort())!==JSON.stringify([...this.ignored].sort())||(t.bypass_entity||null)!==this.bypassEntity);}name(e){var t;return(null===(t=this.hass.states[e])||void 0===t?void 0:t.attributes.friendly_name)||e;}allRows(){var e;const t=[],s=new Set();for(const e of this.info.panels)for(const a of e.zones)t.push({source:a.entity_id,name:a.name,zone:a.zone,panel:e.name,panelZone:!0,dc:a.device_class}),s.add(a.entity_id);for(const a of Object.keys(this.mirrors))s.has(a)||t.push({source:a,name:this.name(a),zone:null,panel:null,panelZone:!1,dc:(null===(e=this.hass.states[a])||void 0===e?void 0:e.attributes.device_class)||null});return t;}inAlarm(e){return this.sensors[Lo(e)]?"mirror":this.sensors[e]?"zone":null;}render(){if(!this.info)return Z`<div class="empty">${this.error||"Loading…"}</div>`;const e=this.allRows(),t=this.search.trim().toLowerCase(),s=e.filter(e=>(this.showIgnored||!this.ignored.includes(e.source))&&(!t||e.source.includes(t)||e.name.toLowerCase().includes(t))),a=e.filter(e=>e.panelZone&&!this.inAlarm(e.source)&&!this.ignored.includes(e.source)),i=e.filter(e=>this.info.settings.mirrors[e.source]&&this.sensors[e.source]&&this.hass.states[Lo(e.source)]&&!this.sensors[Lo(e.source)]),n=Object.keys(this.hass.states).filter(t=>t.startsWith("binary_sensor.")&&!t.endsWith("_mirror")&&!e.some(e=>e.source===t)).sort(),o=this.selection.filter(e=>s.some(t=>t.source===e)),r=s.length>0&&s.every(e=>o.includes(e.source)),l=this.info.panels.filter(e=>e.zones.length).length>1;return Z`
      ${this.error?Z`<div class="notice error" style="white-space:pre-line;margin:0 0 12px">${this.error}</div>`:K}
      ${Ta("panel-zones","Panel zones",`${e.length} zone${1===e.length?"":"s"} · ${Object.keys(this.mirrors).length} mirrored${a.length?` · ${a.length} not zones yet`:""}`,Z`
        <div class="card-content desc">
          <p>Every zone your physical panel reports to Home Assistant: its live state, its mirror, and which entity the alarm uses.</p>
          <p><strong>Why mirrors exist — a Vista limitation.</strong> A Honeywell/Ademco Vista panel stops reporting a zone
            while it is bypassed, so the zone falsely shows "closed". A mirror (<code>binary_sensor.&lt;zone&gt;_mirror</code>)
            follows the zone live and keeps its last known state while bypassed (or shows unknown). DSC panels keep
            reporting bypassed zones, so they do not need mirrors.</p>
          <ul>
            <li>Unlock to edit, then tick <em>Mirror</em> to create a mirror, untick to remove it, and Save.</li>
            <li>Select rows to add them as zones or as their mirrors (a backup is made first), or to ignore them.</li>
            <li><em>Ignore</em> hides a zone that is not a real sensor (keyfob button, RF supervision, unused number) from
              the "not zones yet" list.</li>
            <li>A window opened <em>after</em> it was bypassed can't be seen by any software.</li>
          </ul>
        </div>
        ${a.length?Z`<div class="notice warn" style="margin:0 16px 12px">
              <strong>${a.length} panel zone(s) are not zones yet:</strong> ${a.map(e=>e.name).join(", ")}.
              <div class="toolbar" style="padding:6px 0 0">
                ${Object.keys(this.areas).length>1?Z`<label>Partition
                      <select @change=${e=>this.addTo=e.target.value}>
                        ${Object.values(this.areas).map(e=>Z`<option value=${e.area_id} ?selected=${e.area_id===this.addTo}>${e.name}</option>`)}
                      </select></label>`:K}
                <ha-button ?disabled=${this.busy||!this.addTo} @click=${()=>this.addAllAsDrafts(a.map(e=>e.source))}>
                  <ha-icon slot="start" icon="mdi:playlist-plus"></ha-icon>Add all with suggested settings…</ha-button>
                <span class="secondary" style="display:inline">They become unsaved drafts on Zones (type and Arm Modes
                  guessed from the device class) for you to review and Save. Ignore the ones you don't want first.</span>
              </div>
            </div>`:K}
        <div class="toolbar">
          ${ja(this.locked,()=>this.locked=!this.locked)}
          <input type="search" placeholder="Search" aria-label="Search" .value=${this.search} @input=${e=>this.search=e.target.value} />
          <label><input type="checkbox" .checked=${this.showIgnored} @change=${e=>this.showIgnored=e.target.checked} />
            Show ignored (${this.ignored.length})</label>
          ${i.length?Z`<ha-button appearance="plain" ?disabled=${this.busy||this.dirty} @click=${()=>this.repoint(i.map(e=>e.source))}>
                Use mirrors as zones for ${i.length} zone(s)</ha-button>`:K}
        </div>
        ${this.renderBypassHelper()}
        ${this.renderMirrorTools(e)}
        ${o.length&&!this.locked?Z`<div class="bulkbar" role="toolbar" aria-label="Selected zones">
              <strong>${o.length} selected</strong>
              <label>Partition
                <select @change=${e=>this.addTo=e.target.value}>
                  ${Object.values(this.areas).map(e=>Z`<option value=${e.area_id} ?selected=${e.area_id===this.addTo}>${e.name}</option>`)}
                </select>
              </label>
              <ha-button appearance="plain" ?disabled=${this.busy||this.dirty} @click=${()=>this.addNow(o,!1)}>Add as zones</ha-button>
              <ha-button appearance="plain" ?disabled=${this.busy||this.dirty} @click=${()=>this.addNow(o,!0)}>Add their mirrors</ha-button>
              <ha-button appearance="plain" @click=${()=>o.forEach(e=>this.toggle(e,!0))}>Mirror on</ha-button>
              <ha-button appearance="plain" @click=${()=>o.forEach(e=>this.toggle(e,!1))}>Mirror off</ha-button>
              <ha-button appearance="plain" @click=${()=>this.ignored=[...new Set([...this.ignored,...o])]}>Ignore</ha-button>
              <ha-button appearance="plain" @click=${()=>this.ignored=this.ignored.filter(e=>!o.includes(e))}>Stop ignoring</ha-button>
              <button class="link" @click=${()=>this.selection=[]}>Clear selection</button>
            </div>`:K}
        <div class="table-wrap"><table>
          <thead><tr>
            <th class="c"><input type="checkbox" aria-label="Select all shown" ?disabled=${this.locked} .checked=${r}
              @change=${e=>this.selection=e.target.checked?s.map(e=>e.source):[]} /></th>
            <th class="icon"></th><th>Zone</th><th>Panel zone</th><th class="c">State: Zone / Mirror</th><th class="c">Mirror</th><th>While bypassed</th><th>Entity in use</th>
          </tr></thead>
          <tbody>${s.map(e=>{var t;const s=this.info.settings.mirrors[e.source],a=this.mirrors[e.source],i=Lo(e.source),n=this.hass.states[i],r=a&&!s?"new":!a&&s?"removed":a&&s&&a.hold!==s.hold?"changed":"unchanged",c=this.ignored.includes(e.source),d=_o(null===(t=this.hass.states[e.source])||void 0===t?void 0:t.state),h=this.inAlarm(e.source);return Z`<tr class=${c?"zone-disabled":""}>
              <td class="c"><input type="checkbox" aria-label=${`Select ${e.name}`} ?disabled=${this.locked} .checked=${o.includes(e.source)}
                @change=${t=>this.selection=t.target.checked?[...o,e.source]:o.filter(t=>t!==e.source)} /></td>
              <td class="icon">${Ea(this.hass,e.source,r)}</td>
              <td class="name">${e.name}<span class="secondary">${e.source}${c?" · ignored":""}</span></td>
              <td>${null!==e.zone?`${e.zone}${e.panel&&l?` · ${e.panel}`:""}`:Z`<span class="secondary" style="display:inline">not a panel zone</span>`}</td>
              <td class="c"><span class="state-pair">
                ${Ao(d,{label:this.info.bypassed.includes(e.source)?"bypassed":void 0,title:`Zone: ${d}`})}
                <span class="sep">/</span>
                ${n?Ao(_o(n.state),{label:n.attributes.bypass_held?"held":void 0,title:`Mirror: ${n.state}${n.attributes.bypass_held?" (holding the last state while bypassed)":""}`}):Ao(null)}
              </span></td>
              <td class="c"><input type="checkbox" aria-label=${`Mirror ${e.name}`} ?disabled=${this.locked} .checked=${!!a} @change=${t=>this.toggle(e.source,t.target.checked)} />
                ${!n&&a?Z`<span class="secondary">created on Save</span>`:K}</td>
              <td>${a?Z`<select aria-label="While bypassed" ?disabled=${this.locked} @change=${t=>this.mirrors=Object.assign(Object.assign({},this.mirrors),{[e.source]:{hold:t.target.value}})}>
                    <option value="last" ?selected=${"last"===a.hold}>hold last state</option>
                    <option value="unknown" ?selected=${"unknown"===a.hold}>unknown</option>
                  </select>`:"—"}</td>
              <td>${"mirror"===h?Z`<code>${i}</code>`:"zone"===h?"same":Z`<span class="secondary" style="display:inline">not a zone</span>`}</td>
            </tr>`;})}</tbody>
        </table></div>
        ${s.length?K:Z`<div class="empty">No physical panel zones found. Add the physical panel's integration to Home Assistant, or mirror another entity below.</div>`}
      `)}
      ${Ta("panel-mirror-other","Mirror another entity","a mirror for any binary sensor",Z`
        <div class="card-content desc">
          <p>Any binary_sensor can have a mirror. Entities that are not panel zones only know they are bypassed if they report a
            <code>bypassed</code> attribute.</p>
        </div>
        <div class="toolbar">
          <label>Entity
            <input list="hm-mirror-candidates" placeholder="binary_sensor.…" .value=${this.extra} @input=${e=>this.extra=e.target.value} />
            <datalist id="hm-mirror-candidates">${n.map(e=>Z`<option value=${e}>${this.hass.states[e].attributes.friendly_name||""}</option>`)}</datalist>
          </label>
          <ha-button appearance="plain" ?disabled=${!this.extra.startsWith("binary_sensor.")||!this.hass.states[this.extra]} @click=${this.addExtra}>Add mirror</ha-button>
        </div>
      `)}
      ${this.dirty?Z`<div class="savebar" role="region" aria-label="Unsaved panel zone changes">
            <span class="count">Unsaved mirror / ignore changes</span>
            <ha-button appearance="plain" ?disabled=${this.busy} @click=${()=>{this.mirrors=_r(this.info.settings.mirrors),this.ignored=[...(this.info.settings.ignored_zones||[])];}}>Discard</ha-button>
            <ha-button ?disabled=${this.busy} @click=${this.save}>${this.busy?"Saving…":"Save"}</ha-button>
          </div>`:K}
    `;}renderBypassHelper(){const e=Object.keys(this.hass.states).filter(e=>/^(input_boolean|switch|binary_sensor)\./.test(e)&&!e.endsWith("_mirror")&&!(e in this.sensors)).filter(e=>!this.info.panels.some(t=>t.zones.some(t=>t.entity_id===e))).sort(),t=this.bypassEntity?this.hass.states[this.bypassEntity]:void 0,s=this.info.bypass_unreported||[];return Z`
      ${s.length&&!this.bypassEntity?Z`<div class="notice warn" style="margin:0 16px 8px">
            <strong>${s.length} mirrored zone(s) can't learn about bypasses.</strong> Their panel (Honeywell/Vista via
            envisalink_new) reports bypasses only on its keypad sensor, and no keypad sensor with <code>armed_bypass</code> was
            found for them. Choose a bypass helper below, or check the envisalink_new keypad sensor.</div>`:K}
      <div class="toolbar" style="padding-top:0">
        <label>Bypass helper
          <select ?disabled=${this.locked} @change=${e=>this.bypassEntity=e.target.value||null}>
            <option value="" ?selected=${!this.bypassEntity}>none (detect bypasses from the panel only)</option>
            ${e.map(e=>Z`<option value=${e} ?selected=${e===this.bypassEntity}>${this.name(e)} (${e})</option>`)}
          </select>
        </label>
        ${t?Z`<span class="secondary" style="display:inline">now ${t.state}${"on"===t.state?" — mirrors are holding":""}</span>`:K}
        <span class="secondary" style="display:block;flex-basis:100%">Usually not needed: bypasses are read from the panel (on a Vista,
          its keypad sensor's BYPASS indicator and "BYPAS zz" messages; a window open when the panel was Quick-Bypassed keeps
          showing "open"). Only choose a helper that is <em>on exactly while zones are bypassed on the panel</em> — not one that
          only asks your automations to bypass when arming.</span>
      </div>
    `;}renderMirrorTools(e){const t=this.mirrorType?e.filter(e=>e.panelZone&&Ho(e.dc)===this.mirrorType&&!this.ignored.includes(e.source)):[],s=t.length,a=this.areas[this.addTo];return Z`
      <div class="toolbar" style="padding-top:0">
        <label>Create mirror for
          <select ?disabled=${this.locked} @change=${t=>this.chooseType(t.target.value,e)}>
            <option value="" ?selected=${!this.mirrorType}>choose a zone type…</option>
            ${Mo.map(t=>{const s=e.filter(e=>e.panelZone&&Ho(e.dc)===t.id).length;return Z`<option value=${t.id} ?selected=${this.mirrorType===t.id}>${t.label} (${s})</option>`;})}
          </select>
        </label>
        <label><input type="checkbox" ?disabled=${this.locked} .checked=${this.useMirrors} @change=${e=>this.useMirrors=e.target.checked} />
          Use the mirrors as zones, remove the panel's real zones</label>
        ${Object.keys(this.areas).length>1?Z`<label>Partition
              <select ?disabled=${this.locked} @change=${e=>this.addTo=e.target.value}>
                ${Object.values(this.areas).map(e=>Z`<option value=${e.area_id} ?selected=${e.area_id===this.addTo}>${e.name}</option>`)}
              </select></label>`:K}
      </div>
      ${this.mirrorType?Z`<div class="toolbar" style="padding-top:0">
            <ha-button ?disabled=${this.locked||this.busy||!s} @click=${()=>this.applyMirrors(t.map(e=>e.source))}>
              <ha-icon slot="start" icon="mdi:content-duplicate"></ha-icon>${this.useMirrors?`Save ${s} mirror(s), use them in ${a?a.name:"the alarm"} instead of the real zones`:`Save ${s} mirror(s)`}
            </ha-button>
            <button class="link" @click=${()=>{this.mirrorType="",this.mirrors=_r(this.info.settings.mirrors);}}>Cancel</button>
            ${s?K:Z`<span class="secondary" style="display:inline">No ${this.mirrorType} zones found.</span>`}
          </div>`:K}
    `;}chooseType(e,t){this.mirrorType=e,e&&t.filter(t=>t.panelZone&&Ho(t.dc)===e&&!this.ignored.includes(t.source)).forEach(e=>this.toggle(e.source,!0));}async applyMirrors(e){var t,s;const a=e.filter(e=>this.sensors[e]&&!this.sensors[Lo(e)]),i=e.filter(e=>!this.sensors[e]&&!this.sensors[Lo(e)]);if(!this.useMirrors||window.confirm(`Create ${e.length} mirror(s)`+(a.length?`, switch ${a.length} zone(s) to their mirror (settings kept, the real zone is removed)`:"")+(i.length?`, add ${i.length} mirror(s) to ${null===(t=this.areas[this.addTo])||void 0===t?void 0:t.name} with suggested settings`:"")+"? A backup is made first.")){this.busy=!0,this.error="";try{const t=(await So(this.hass)).settings;if(await Co(this.hass,Object.assign(Object.assign({},t),{mirrors:this.mirrors,ignored_zones:this.ignored,bypass_entity:this.bypassEntity})),this.useMirrors){const t=e.map(Lo);for(let e=0;e<30&&t.some(e=>!this.hass.states[e]);e++)await new Promise(e=>setTimeout(e,500));const n=t.filter(e=>!this.hass.states[e]);if(n.length)throw new Error(`Mirrors not created yet: ${n.join(", ")} — try again in a moment.`);const o=[];if(a.length){const e=await Eo(this.hass,a.map(e=>({from:e,to:Lo(e)})));o.push(`${e.changed} zone(s) now use their mirror`);}if(i.length){const e=await jo(this.hass,this.addTo,i.map(Lo));o.push(`${e.create.length} mirror(s) added to ${null===(s=this.areas[this.addTo])||void 0===s?void 0:s.name}`);}_a(this,`Mirrors saved${o.length?`; ${o.join(", ")}`:""}.`);}else _a(this,"Mirrors saved.");this.locked=!0,this.mirrorType="",await this.refresh();}catch(e){this.error=ba(e),await this.refresh();}finally{this.busy=!1;}}}toggle(e,t){const s=Object.assign({},this.mirrors);t?s[e]=this.info.settings.mirrors[e]||{hold:"last"}:delete s[e],this.mirrors=s;}addExtra(){this.toggle(this.extra.trim(),!0),this.extra="";}async save(){const e=Object.keys(this.info.settings.mirrors).filter(e=>!this.mirrors[e]&&this.sensors[Lo(e)]);if(!e.length||window.confirm(`These mirrors are zones; removing them makes those zones unavailable:\n${e.map(Lo).join("\n")}\n\nContinue?`)){this.busy=!0,this.error="";try{const e=(await So(this.hass)).settings;await Co(this.hass,Object.assign(Object.assign({},e),{mirrors:this.mirrors,ignored_zones:this.ignored,bypass_entity:this.bypassEntity})),_a(this,"Panel zones saved."),this.locked=!0,this.selection=[],await this.refresh();}catch(e){this.error=ba(e);}finally{this.busy=!1;}}}async addNow(e,t){var s;const a=e.map(e=>t?Lo(e):e).filter(e=>!this.sensors[e]),i=t?a.filter(e=>!this.hass.states[e]):[];if(i.length)this.error=`Turn the mirror on and Save first for: ${i.join(", ")}`;else if(a.length){this.busy=!0;try{const e=await jo(this.hass,this.addTo,a);_a(this,`${e.create.length} zone(s) added to ${null===(s=this.areas[this.addTo])||void 0===s?void 0:s.name}. Set their Arm Modes on Zones.${e.backup?` Backup: ${e.backup.name}`:""}`),this.selection=[],await this.refresh();}catch(e){this.error=ba(e);}finally{this.busy=!1;}}}async addAllAsDrafts(e){const t=this.areas[this.addTo];if(!t)return;const s=e.map(e=>this.mirrors[e]&&this.hass.states[Lo(e)]?Lo(e):e);if(window.confirm(`Add ${s.length} zone(s) to ${t.name} as drafts? Nothing is saved until you click Save on Zones.`)){this.busy=!0;try{const e=await jo(this.hass,this.addTo,s,!0);let t={edits:{},added:{},removed:[]};try{t=JSON.parse(window.sessionStorage.getItem(bo)||"")||t;}catch(e){}e.create.forEach(e=>t.added[e.entity_id]=Object.assign(Object.assign({},wr),e)),window.sessionStorage.setItem(bo,JSON.stringify(t)),la(0,"/house_modes/zones");}catch(e){this.error=ba(e);}finally{this.busy=!1;}}}async repoint(e){if(window.confirm(`Point ${e.length} zone(s) at their mirror? Their settings are kept. A backup is made first.`)){this.busy=!0;try{const t=await Eo(this.hass,e.map(e=>({from:e,to:Lo(e)})));_a(this,`${t.changed} zone(s) now use mirrors. Backup: ${t.backup.name}`),await this.refresh();}catch(e){this.error=ba(e);}finally{this.busy=!1;}}}};kr.styles=[ka,h`
    `],i([ye({attribute:!1})],kr.prototype,"hass",void 0),i([ye({type:Boolean})],kr.prototype,"narrow",void 0),i([ye({attribute:!1})],kr.prototype,"path",void 0),i([be()],kr.prototype,"info",void 0),i([be()],kr.prototype,"mirrors",void 0),i([be()],kr.prototype,"ignored",void 0),i([be()],kr.prototype,"bypassEntity",void 0),i([be()],kr.prototype,"sensors",void 0),i([be()],kr.prototype,"areas",void 0),i([be()],kr.prototype,"extra",void 0),i([be()],kr.prototype,"search",void 0),i([be()],kr.prototype,"error",void 0),i([be()],kr.prototype,"busy",void 0),i([be()],kr.prototype,"locked",void 0),i([be()],kr.prototype,"selection",void 0),i([be()],kr.prototype,"addTo",void 0),i([be()],kr.prototype,"showIgnored",void 0),i([be()],kr.prototype,"mirrorType",void 0),i([be()],kr.prototype,"useMirrors",void 0),kr=i([me("hm-view-mirrors")],kr);const xr=e=>JSON.parse(JSON.stringify(e)),Ar=e=>({monitored:e.monitored,notify_service:e.notify_service||null,trip:e.trip});let Or=class extends pe{constructor(){super(...arguments),this.narrow=!1,this.sensors={},this.error="",this.busy=!1;}firstUpdated(){this.refresh();}async refresh(){try{const[e,t]=await Promise.all([So(this.hass),ke(this.hass)]);this.info=e,this.sensors=t,this.draft=xr(Ar(e.settings));}catch(e){this.error=ba(e);}}get dirty(){return!!this.info&&!!this.draft&&JSON.stringify(Ar(this.info.settings))!==JSON.stringify(this.draft);}set(e){const t=xr(this.draft);e(t),this.draft=t;}haZones(){const e=new Set();return this.info.panels.forEach(t=>t.zones.forEach(t=>{e.add(t.entity_id),e.add(`binary_sensor.${t.entity_id.replace(/^binary_sensor\./,"")}_mirror`);})),Object.keys(this.sensors).filter(t=>!e.has(t)).sort();}render(){if(!this.info||!this.draft)return Z`<div class="empty">${this.error||"Loading…"}</div>`;const e=this.draft,t=this.haZones(),s=t.filter(e=>this.info.settings.zone_trip[e]).length,a=Object.keys(this.info.settings.links).length>0,i="panel"===((e,t)=>e.zone_trip[t]||(e.monitored?"notify":"panel"))(Object.assign(Object.assign(Object.assign({},this.info.settings),e),{zone_trip:{}}),"_")?"set off the alarm":"notify only";return Z`
      ${this.error?Z`<div class="notice error" style="white-space:pre-line;margin:0 0 12px">${this.error}</div>`:K}
      ${Ta("panel-ha-zones","How HA-only zones raise the alarm",`${t.length} zone${1===t.length?"":"s"} only Home Assistant watches · default: ${i}`,Z`
        <div class="card-content desc">
          <p>Some zones are watched only by Home Assistant — Zigbee/Z-Wave motion, garage covers, smoke detectors
            — not by your physical panel. When one of them triggers the alarm while armed, the physical panel knows
            nothing about it.</p>
          <p>Choose here what the alarm does then, by default. Each zone can do something else: Zones → open the
            zone (›) → <em>When tripped</em>. Now: ${t.length} HA-only zone(s)${s?`, ${s} with their own choice`:""}; default
            <em>${i}</em>. Use <em>notify only</em> for zones that give false alarms, like outdoor motion.</p>
          ${a?K:Z`<div class="notice warn" style="margin:0 0 8px">No physical panel is linked (Physical Panel tab), so these settings are not used yet — the alarm only uses its own notifications.</div>`}
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
                @change=${e=>this.set(t=>t.trip.entity=e.target.value.trim()||null)} /></label>`:K}
          ${"panic"===e.trip.method?Z`<label>Panic
                <select @change=${e=>this.set(t=>t.trip.panic_method=e.target.value)}>
                  <option value="service" ?selected=${"service"===e.trip.panic_method}>the physical panel's alarm trigger</option>
                  <option value="keypress" ?selected=${"keypress"===e.trip.panic_method}>keypresses</option>
                </select></label>
              ${"keypress"===e.trip.panic_method?Z`<label>Keys (e.g. A) <input type="text" style="width:70px" .value=${e.trip.panic_keys} @change=${e=>this.set(t=>t.trip.panic_keys=e.target.value)} /></label>`:K}
              <span class="secondary" style="display:block">Only works if the key is programmed on the physical panel (Vista: field *57).</span>`:K}
          <label>Notify service <input type="text" placeholder="notify.mobile_app_…" .value=${e.notify_service||""}
            @change=${e=>this.set(t=>t.notify_service=e.target.value.trim()||null)} /></label>
        </div>
      `)}

      ${this.dirty?Z`<div class="savebar" role="region" aria-label="Unsaved settings">
            <span class="count">Unsaved settings</span>
            <ha-button appearance="plain" ?disabled=${this.busy} @click=${()=>this.draft=xr(Ar(this.info.settings))}>Discard</ha-button>
            <ha-button ?disabled=${this.busy} @click=${this.save}>${this.busy?"Saving…":"Save"}</ha-button>
          </div>`:K}
    `;}async save(){if("siren"!==this.draft.trip.method&&"relay"!==this.draft.trip.method||this.draft.trip.entity){this.busy=!0,this.error="";try{const e=(await So(this.hass)).settings;await Co(this.hass,Object.assign(Object.assign({},e),this.draft)),_a(this,"Saved."),await this.refresh();}catch(e){this.error=ba(e);}finally{this.busy=!1;}}else this.error=`Choose the ${this.draft.trip.method} entity.`;}};Or.styles=ka,i([ye({attribute:!1})],Or.prototype,"hass",void 0),i([ye({type:Boolean})],Or.prototype,"narrow",void 0),i([ye({attribute:!1})],Or.prototype,"path",void 0),i([be()],Or.prototype,"info",void 0),i([be()],Or.prototype,"draft",void 0),i([be()],Or.prototype,"sensors",void 0),i([be()],Or.prototype,"error",void 0),i([be()],Or.prototype,"busy",void 0),Or=i([me("hm-view-ha-zones")],Or);const Sr=e=>JSON.parse(JSON.stringify(e)),Cr={armed_away:"Away",armed_home:"Home (Stay)",armed_night:"Night",armed_vacation:"Vacation",armed_custom_bypass:"Custom",disarmed:"Disarm"};let jr=class extends pe{constructor(){super(...arguments),this.narrow=!1,this.sensors={},this.areas={},this.error="",this.busy=!1,this.openLinks={},this.newTarget="",this.newPanel="",this.usersAsked=!1,this.haUsers=[],this.exitPlan={};}firstUpdated(){this.refresh();}async refresh(){try{const[e,t,s]=await Promise.all([So(this.hass),ke(this.hass),Le(this.hass)]);this.info=e,this.sensors=t,this.areas=s,this.draft||(this.draft=Sr(e.settings));}catch(e){this.error=ba(e);}}get dirty(){return!!this.info&&!!this.draft&&JSON.stringify(this.info.settings)!==JSON.stringify(this.draft);}set(e){const t=Sr(this.draft);e(t),this.draft=t;}render(){if(!this.info||!this.draft)return Z`<ha-card><div class="empty">${this.error||"Loading…"}</div></ha-card>`;const e=((e,t)=>{const s=[];for(const[a,i]of Object.entries(e.links)){const e=t.find(e=>e.entity_id===i.panel_entity),n=Object.values(i.commands).some(e=>"keypress"===e.method&&e.keys.includes("{code}"))||"envisalink"===i.panel_type;e?n&&!e.code_set&&s.push(`${a}: set a default code on ${i.panel_entity} (entity settings) so keypresses can be sent.`):s.push(`${a}: panel ${i.panel_entity} was not found.`);}return"siren"!==e.trip.method&&"relay"!==e.trip.method||e.trip.entity||s.push(`Choose the ${e.trip.method} entity used to set off the alarm.`),s;})(this.draft,this.info.panels);return Z`
      ${this.error?Z`<div class="notice error" style="white-space:pre-line;margin:0 0 12px">${this.error}</div>`:K}
      ${za("Physical Panel","settings",Z`<p>Your alarm panel (e.g. a Vista through Envisalink): the link that keeps it
          and the alarm in step, its keypad on dashboards, its zones and their mirrors, and what zones only Home Assistant
          watches do. The link's log is on the <a href="/house_modes/activity">Activity</a> tab.</p>`,Z`
        ${this.renderLinks()} ${this.renderKeypadInput()}
        <hm-view-mirrors .hass=${this.hass} .narrow=${this.narrow} embedded></hm-view-mirrors>
        <hm-view-ha-zones .hass=${this.hass} .narrow=${this.narrow} embedded></hm-view-ha-zones>`)}
      ${this.dirty?Z`<div class="savebar" role="region" aria-label="Unsaved panel settings">
            <span class="count">
              Unsaved panel settings
              ${e.length?Z`<span class="secondary" style="display:block">${e.join(" ")}</span>`:K}
            </span>
            <ha-button appearance="plain" ?disabled=${this.busy} @click=${()=>this.draft=Sr(this.info.settings)}>Discard</ha-button>
            <ha-button ?disabled=${this.busy} @click=${this.save}>${this.busy?"Saving…":"Save"}</ha-button>
          </div>`:K}
    `;}renderKeypadInput(){const e=this.draft;if(!Object.values(e.links).some(e=>"envisalink"===e.panel_type))return K;const t=e.keypad_input||{mode:"admins",users:[],blocked_keys:""},s=e=>{const s=Sr(this.draft);s.keypad_input=Object.assign(Object.assign({},t),{users:[...t.users]}),e(s.keypad_input),this.draft=s;};this.usersAsked||(this.usersAsked=!0,this.hass.callWS({type:"config/auth/list"}).then(e=>this.haUsers=e.filter(e=>!e.system_generated)).catch(()=>{}));const a={off:"Off — ignore every keypress",admins:"Administrators only",users:"Administrators and these users",all:"Everyone"};return Z`
      ${Ta("panel-keypad","Panel keypad on dashboards",`who may press keys: ${a[t.mode]||t.mode}`,Z`
        <div class="card-content desc">
          <p>The House Modes &amp; Alarm Center Card can show your panel's keypad. Its keys go through the integration, which checks
            who is logged in before passing them to the panel. Refused presses are shown on the card and in the Activity log.</p>
          <ul>
            <li>Automations calling <code>house_modes.panel_keypress</code> are not checked.</li>
            <li>This limits the card, not Home Assistant: a logged-in user can still call the Envisalink service directly.
              The panel code remains the real protection.</li>
          </ul>
        </div>
        <div class="toolbar">
          ${["off","admins","users","all"].map(e=>Z`<label><input type="radio" name="kp-mode" .checked=${t.mode===e} @change=${()=>s(t=>t.mode=e)} />${a[e]}</label>`)}
        </div>
        ${"users"===t.mode?Z`<div class="toolbar">
              ${this.haUsers.filter(e=>!e.is_admin).map(e=>Z`<label><input type="checkbox" .checked=${t.users.includes(e.id)}
                  @change=${t=>s(s=>s.users=t.target.checked?[...s.users,e.id]:s.users.filter(t=>t!==e.id))} />${e.name}</label>`)}
              ${this.haUsers.filter(e=>!e.is_admin).length?K:Z`<span class="secondary" style="display:inline">No other users.</span>`}
            </div>`:K}
        ${"off"!==t.mode?Z`<div class="field-row" style="padding:0 16px 12px">
              <label>Keys never sent from a dashboard
                <input type="text" placeholder="e.g. 6 (bypass)" .value=${t.blocked_keys}
                  @change=${e=>s(t=>t.blocked_keys=String(e.target.value).toUpperCase().replace(/[^0-9*#A-D]/g,""))} /></label>
            </div>`:K}
      `)}
    `;}renderLinks(){const e=this.draft,t=this.info.targets.filter(t=>!(t.key in e.links));return Z`
      ${Ta("panel-link","Physical panel link",`${Object.keys(e.links).length} link${1===Object.keys(e.links).length?"":"s"}${Object.values(e.links).map(e=>` · ${e.mode}`).join("")}`,Z`
        <div class="card-content desc">
          <p>Keeps the alarm (a partition, or All partitions) and your physical alarm panel in step:</p>
          <ul>
            <li>Arming or disarming the alarm is sent to the physical panel and checked (with retries).</li>
            <li>Arming or disarming at the physical panel's keypad is followed by the alarm.</li>
          </ul>
          <p><strong>Shadow</strong> sends nothing and changes nothing — it only logs what would have happened, so you
            can compare it with your current automations. Switch to <strong>Live</strong> when the log matches.</p>
        </div>
        ${t.length&&this.info.panels.length?Z`<div class="toolbar">
              <select aria-label="Alarm" @change=${e=>this.newTarget=e.target.value}>
                <option value="">Link a partition…</option>
                ${t.map(e=>Z`<option value=${e.key}>${e.name} (${e.entity_id})</option>`)}
              </select>
              to
              <select aria-label="Panel" @change=${e=>this.newPanel=e.target.value}>
                <option value="">panel…</option>
                ${this.info.panels.map(e=>Z`<option value=${e.entity_id}>${e.name} (${e.entity_id})</option>`)}
              </select>
              <ha-button appearance="plain" ?disabled=${!this.newTarget||!this.newPanel} @click=${this.addLink}>Add link</ha-button>
            </div>`:this.info.panels.length?K:Z`<div class="empty">No physical alarm panel integration found in Home Assistant.</div>`}
        ${Object.entries(e.links).map(([t,s])=>this.renderLink(t,s,1===Object.keys(e.links).length))}
      `)}
    `;}renderExitMatch(e,t){const s=Object.keys(t.learned_exit_delay||{});if(!s.length)return Z`<div class="secondary" style="padding:0 6px 6px">Once the panel has armed a few times, its exit delays are learned here and
        the alarm's exit times can be matched to them.</div>`;const a=this.exitPlan[e],i=a?Object.values(a):[];return Z`<div class="field-row">
        <span>Panel exit delays: ${s.map(e=>`${Cr[e]||e} ${t.learned_exit_delay[e]} s`).join(" · ")}</span>
        <ha-button appearance="plain" ?disabled=${this.dirty} @click=${()=>this.checkExit(e)}>Match the alarm's exit times…</ha-button>
        ${this.dirty?Z`<span class="secondary" style="display:inline">Save first.</span>`:K}
      </div>
      ${a?i.length?Z`<div class="notice" style="margin:0 0 8px">${i.map(e=>Z`<div><strong>${e.name}</strong>: ${Object.keys(e.changes).map(t=>`${Cr[t]} ${e.before[t]} → ${e.changes[t]} s`).join(", ")}</div>`)}
              <div class="toolbar" style="padding:6px 0 0"><ha-button @click=${()=>this.applyExit(e)}>Apply (backup first)</ha-button>
                <button class="link" @click=${()=>this.exitPlan=Object.assign(Object.assign({},this.exitPlan),{[e]:null})}>Cancel</button></div></div>`:Z`<div class="secondary" style="padding:0 6px 6px">The alarm's exit times already match the panel.</div>`:K}`;}async checkExit(e){try{const t=await To(this.hass,e,!0);this.exitPlan=Object.assign(Object.assign({},this.exitPlan),{[e]:t.plan});}catch(e){this.error=ba(e);}}async applyExit(e){try{const t=await To(this.hass,e);_a(this,`Alarm exit times updated. Backup: ${t.backup?t.backup.name:"-"}`),this.exitPlan=Object.assign(Object.assign({},this.exitPlan),{[e]:null});}catch(e){this.error=ba(e);}}addLink(){const e=this.info.panels.find(e=>e.entity_id===this.newPanel);this.set(t=>{return t.links[this.newTarget]=(s=e.entity_id,a=e.platform,{panel_entity:s,mode:"shadow",panel_type:"envisalink_new"===a?"envisalink":"generic",follow_panel:!0,retries:3,retry_delay:5,failure_policy:"disarm",bypass_keys:"{code}6{zone}",commands:{},delays:{},learned_exit_delay:{},arm_order:"panel_leads",confirm_margin:10,follow_map:{}});var s,a;}),this.newTarget=this.newPanel="";}renderLink(e,t,s=!1){var a,i,n;const o=this.info.targets.find(t=>t.key===e),r=this.info.panels.find(e=>e.entity_id===t.panel_entity),l=this.info.running.includes(e),c=t=>this.set(s=>t(s.links[e])),d=(e,s,a,i)=>Z`
      <hm-slider .label=${s} .min=${a} .max=${i} unit=${"retry_delay"===e?"s":""} .value=${t[e]}
        @value-changed=${t=>c(s=>s[e]=t.detail.value)}></hm-slider>`,h=null!==(a=this.openLinks[e])&&void 0!==a&&a,p=Z`<span class="collapse-title">${(null==o?void 0:o.name)||e} ⇄ ${(null==r?void 0:r.name)||t.panel_entity}</span>
          ${Ba(t.mode)}
          <span class="secondary" style="display:inline">${l?"running":"not running"}${r?` · panel is ${r.state}`:""}</span>`,u=Z`
      <div class="collapse-body ${"live"===t.mode?"live":""}">
        <div class="toolbar" style="padding:4px 0">
          ${Ia(`link-run:${e}`,`link-run-${e}`,t.mode,e=>c(t=>t.mode=e),()=>this.requestUpdate())}
          <span class="grow"></span>
          <span class="run-state">
            <button class="link" ?disabled=${Da(`link-remove:${e}`)}
              @click=${()=>window.confirm("Remove this link? The alarm and the panel stop following each other.")&&this.set(t=>delete t.links[e])}>Remove link</button>
            ${Pa(Da(`link-remove:${e}`),()=>{Na[`link-remove:${e}`]=!Da(`link-remove:${e}`),this.requestUpdate();},"Remove link")}
          </span>
        </div>
        <h4 class="subhead" style="margin:8px 0 4px">Arming</h4>
        <div class="field-row">
          <label for=${`order-${e}`}>When the alarm arms</label>
          <select id=${`order-${e}`} @change=${e=>c(t=>t.arm_order=e.target.value)}>
            <option value="panel_leads" ?selected=${"panel_leads"===(t.arm_order||"panel_leads")}>send to the panel at once; the alarm is armed when the panel is (one exit delay)</option>
            <option value="after_alarm" ?selected=${"after_alarm"===t.arm_order}>send to the panel after the alarm's exit delay (two exit delays)</option>
          </select>
        </div>
        ${"panel_leads"===(t.arm_order||"panel_leads")?Z`<div class="secondary" style="padding:0 6px 6px">The alarm checks every zone first (panel zones through their mirrors, and the
              zones only Home Assistant watches); nothing is sent if one blocks. If the panel has not finished arming
              ${null!==(i=t.confirm_margin)&&void 0!==i?i:10} s after the longer of its exit delay and the alarm's, arming counts as failed.</div>
            <hm-slider .label=${"Extra time for the panel to confirm"} .min=${0} .max=${60} unit="s" .value=${null!==(n=t.confirm_margin)&&void 0!==n?n:10}
              @value-changed=${e=>c(t=>t.confirm_margin=e.detail.value)}></hm-slider>
            ${this.renderExitMatch(e,t)}`:K}
        <h4 class="subhead" style="margin:10px 0 4px">Arming at the panel (keypad, app)</h4>
        <div class="field-row">
          <label><input type="checkbox" .checked=${t.follow_panel} @change=${e=>c(t=>t.follow_panel=e.target.checked)} />
            The alarm follows the panel</label>
          <span class="secondary" style="display:inline">The alarm starts arming when the panel does. Open zones the panel does not watch
            are bypassed in the alarm and you are told.</span>
        </div>
        ${t.follow_panel?Z`<div class="field-row">${["armed_away","armed_home","armed_night"].map(e=>Z`
              <label>Panel ${Cr[e]} →
                <select aria-label=${`Alarm mode when the panel arms ${Cr[e]}`}
                  @change=${t=>c(s=>{const a=Object.assign({},s.follow_map||{});t.target.value===e?delete a[e]:a[e]=t.target.value,s.follow_map=a;})}>
                  ${Object.keys(Cr).filter(e=>"disarmed"!==e).map(s=>Z`<option value=${s} ?selected=${((t.follow_map||{})[e]||e)===s}>${Cr[s]}</option>`)}
                </select></label>`)}</div>`:K}
        <h4 class="subhead" style="margin:10px 0 4px">Commands</h4>
        <div class="detail-grid">
          ${d("retries","Retries",0,10)} ${d("retry_delay","Seconds between tries",1,120)}
          <label>If the panel does not follow
            <select @change=${e=>c(t=>t.failure_policy=e.target.value)}>
              <option value="disarm" ?selected=${"disarm"===t.failure_policy}>disarm the alarm again + notify</option>
              <option value="keep" ?selected=${"keep"===t.failure_policy}>keep the alarm armed + notify</option>
            </select>
          </label>
          <label>Panel type
            <select @change=${e=>c(t=>t.panel_type=e.target.value)}>
              <option value="envisalink" ?selected=${"envisalink"===t.panel_type}>Envisalink (keypresses)</option>
              <option value="generic" ?selected=${"generic"===t.panel_type}>Other (HA services only)</option>
            </select>
          </label>
          ${"envisalink"===t.panel_type?Z`<label>Bypass keys <input type="text" .value=${t.bypass_keys} @change=${e=>c(t=>t.bypass_keys=e.target.value)} /></label>`:K}
        </div>
        ${r&&!r.code_set&&"envisalink"===t.panel_type?Z`<div class="notice error" style="margin:4px 0">Set a <strong>default code</strong> on ${t.panel_entity} (its entity settings) — keypresses use it as {code}.</div>`:K}
        <div class="table-wrap">
          <table>
            <thead><tr><th>When the alarm becomes</th><th>Send</th><th>Keys</th><th title="Panel states that count as success">Panel must become</th><th>Wait (s)</th><th>Panel delays (entry / exit s)</th><th>Learned exit</th></tr></thead>
            <tbody>
              ${Oo.map(e=>{const s=t.commands[e];if(!s)return K;const a=t.delays[e]||{},i=t=>c(s=>t(s.commands[e])),n=t=>Z`<hm-slider compact optional .label=${`${Cr[e]}: ${t} delay`}
                  .min=${0} .max=${255} .onValue=${30} unit="s" offText=${"entry"===t?"entry: unknown":"exit: unknown"}
                  .value=${null===a[t]||void 0===a[t]?null:a[t]}
                  @value-changed=${s=>c(a=>a.delays[e]=Object.assign(Object.assign({},a.delays[e]||{}),{[t]:s.detail.value}))}></hm-slider>`;return Z`<tr>
                  <td>${Cr[e]}</td>
                  <td><select @change=${e=>i(t=>t.method=e.target.value)}>
                    <option value="service" ?selected=${"service"===s.method}>HA service</option>
                    <option value="keypress" ?selected=${"keypress"===s.method} ?disabled=${"envisalink"!==t.panel_type}>keypresses</option>
                    <option value="none" ?selected=${"none"===s.method}>nothing</option>
                  </select></td>
                  <td>${"keypress"===s.method?Z`<input type="text" style="width:90px" .value=${s.keys} @change=${e=>i(t=>t.keys=e.target.value)} />`:"—"}</td>
                  <td><input type="text" style="width:220px" .value=${(e=>e.join(", "))(s.accept)} @change=${e=>i(t=>t.accept=e.target.value.split(/[\s,]+/).map(e=>e.trim()).filter(e=>e&&(Oo.includes(e)||"triggered"===e)))} /></td>
                  <td><hm-slider compact .label=${`${Cr[e]}: timeout`} .min=${5} .max=${300} unit="s" .value=${s.timeout}
                    @value-changed=${e=>i(t=>t.timeout=e.detail.value||20)}></hm-slider></td>
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
      </div>`;return s?Z`<div class="link-single"><div class="link-head">${p}</div>${u}</div>`:Z`
      <details class="collapse" ?open=${h} @toggle=${t=>this.openLinks=Object.assign(Object.assign({},this.openLinks),{[e]:t.target.open})}>
        <summary>
          <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
          ${p}
        </summary>
        ${u}
      </details>
    `;}async save(){this.busy=!0,this.error="";try{const e=await Co(this.hass,this.draft);this.draft=Sr(e),this.info=Object.assign(Object.assign({},this.info),{settings:e}),_a(this,"Panel settings saved."),await this.refresh(),this.draft=Sr(this.info.settings);}catch(e){this.error=ba(e);}finally{this.busy=!1;}}};jr.styles=[ka,h`
      .link-head {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        padding: 8px 12px 0;
        border-top: 1px solid var(--divider-color);
      }
    `],i([ye({attribute:!1})],jr.prototype,"hass",void 0),i([ye({type:Boolean})],jr.prototype,"narrow",void 0),i([ye({attribute:!1})],jr.prototype,"path",void 0),i([be()],jr.prototype,"info",void 0),i([be()],jr.prototype,"draft",void 0),i([be()],jr.prototype,"sensors",void 0),i([be()],jr.prototype,"areas",void 0),i([be()],jr.prototype,"error",void 0),i([be()],jr.prototype,"busy",void 0),i([be()],jr.prototype,"openLinks",void 0),i([be()],jr.prototype,"newTarget",void 0),i([be()],jr.prototype,"newPanel",void 0),i([be()],jr.prototype,"haUsers",void 0),i([be()],jr.prototype,"exitPlan",void 0),jr=i([me("hm-view-panel")],jr);const Er=e=>e.edit_id?`/config/${e.kind}/edit/${encodeURIComponent(e.edit_id)}`:null,Mr=(e,t)=>({enter:e.filter(e=>e.reacts&&e.reacts.to.includes(t)),leave:e.filter(e=>e.reacts&&e.reacts.from.includes(t)&&!e.reacts.to.includes(t))}),Hr=(e,t)=>e.map(e=>({item:e,sets:(e.sets||[]).filter(e=>e.mode&&e.mode.toLowerCase()===t.toLowerCase())})).filter(e=>e.sets.length),Lr=e=>"current"===e.via?"":"service"===e.via&&e.source?e.source:"automation",Tr={time:"a time",presence:"presence",house_mode:"a House Mode change",alarm:"the alarm",event:"an event",sun:"the sun",template:"a template",state:"a state",numeric_state:"a value",other:"another trigger"},zr=(e,t)=>{const s=(e.trigger_kinds||[]).map(e=>Tr[e]||e).join(", ");return[s?`on ${s}`:"",`via ${"service"===t.via?"house_modes.set_house_mode"+(t.source?` (${t.source})`:""):"select"===t.via?"the House Mode select":"selector"===t.via?"your selector":"the current-mode helper"}`].filter(Boolean).join(" · ");},Pr=(e,t,s)=>{const a=[];if("current"===e.via)return["It writes the current-mode helper directly, so House Modes never sees a request: nothing is armed and no\n      script runs. Call house_modes.set_house_mode instead.".replace(/\s+/g," ")];"selector"===e.via||"select"===e.via?a.push('Its request arrives as "automation" (it writes the selector). Call house_modes.set_house_mode with a source.'):e.source||a.push('It calls house_modes.set_house_mode without a source, so it arrives as "automation".');const i=Lr(e);return i&&!s.includes(i)&&a.push(`${t} doesn't allow "${i}" to enter (Allowed Sources, May Enter).`),a;},Nr={time:["schedule"],presence:["presence_away","presence_home"]},Dr={time:"a time",presence:"presence",house_mode:"a House Mode change",alarm:"the alarm",state:"a state change",event:"an event",numeric_state:"a value",template:"a template",sun:"the sun"},Rr=(e,t)=>{const s=Lr(t),a=e.trigger_kinds||[];if(!s||!a.length||"automation"===s)return[];if("manual"===s&&e.asks_user)return[];const i=[],n=1===a.length||a.every(e=>e===a[0])?a[0]:"";return n&&Nr[n]&&!Nr[n].includes(s)&&i.push(`It is started by ${"time"===n?"a time":"presence"} but says source "${s}"; ${Nr[n].join(" or ")} would fit.`),"schedule"!==s||a.includes("time")||i.push('It says source "schedule" but no time trigger starts it.'),"presence_away"!==s&&"presence_home"!==s||a.includes("presence")||i.push(`It says source "${s}" but no person or zone trigger starts it.`),"manual"!==s||e.asks_user||i.length||i.push(`It says source "manual" (a person chose it) but runs on its own, on ${a.map(e=>Dr[e]||e).join(", ")}.`),i;},Br=e=>{const t=String(e||"").trim();return t?t.includes(":")?t:`mdi:${t.toLowerCase().replace(/[\s_]+/g,"-")}`:"";},Ir=e=>String(e||"").replace(/^mdi:/,"");let Vr=class extends pe{constructor(){super(...arguments),this.label="Icon",this.value="",this.placeholder="home";}firstUpdated(){customElements.get("ha-icon-picker")||$e().then(()=>this.requestUpdate()).catch(()=>{});}emit(e){this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:Br(e)},bubbles:!0,composed:!0}));}render(){return customElements.get("ha-icon-picker")?Z`<span class="lab">${this.label}</span>
        <ha-icon-picker
          .hass=${this.hass}
          .value=${this.value||""}
          .placeholder=${Br(this.placeholder)}
          @value-changed=${e=>{e.stopPropagation(),this.emit(e.detail.value);}}
        ></ha-icon-picker>`:Z`<span class="lab">${this.label}</span>
      <ha-icon icon=${Br(this.value)||Br(this.placeholder)}></ha-icon>
      <input
        type="text"
        aria-label=${this.label}
        placeholder=${Ir(this.placeholder)}
        .value=${Ir(this.value)}
        @change=${e=>this.emit(e.target.value)}
      />`;}};Vr.styles=h`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    ha-icon-picker {
      min-width: 220px;
    }
    input {
      font: inherit;
      padding: 6px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      width: 160px;
    }
  `,i([ye({attribute:!1})],Vr.prototype,"hass",void 0),i([ye()],Vr.prototype,"label",void 0),i([ye()],Vr.prototype,"value",void 0),i([ye()],Vr.prototype,"placeholder",void 0),Vr=i([me("hm-icon-field")],Vr);const Ur=(e,t)=>{var s;const[a,i]=e.split(".");if("script"===a)return`/config/script/edit/${i}`;const n=null===(s=t.states[e])||void 0===s?void 0:s.attributes.id;return"scene"===a&&n?`/config/scene/edit/${n}`:null;},Fr=e=>JSON.parse(JSON.stringify(e)),Gr={},Wr={locked:!0},qr={byscript:new Set(),byauto:new Set()},Zr={armed_away:"Away",armed_home:"Home (Stay)",armed_night:"Night",armed_vacation:"Vacation",armed_custom_bypass:"Custom",disarmed:"Disarm"},Yr=e=>e.split(/[\s,]+/).map(e=>e.trim()).filter(Boolean);let Kr=class extends pe{constructor(){super(...arguments),this.narrow=!1,this.open=[],this.error="",this.busy=!1,this.lastBlocked=null,this.detectPick=[],this.detecting=!1,this.pendingGroups=[],this.nameOf=e=>{var t,s;return(null===(s=null===(t=this.draft)||void 0===t?void 0:t.modes.find(t=>t.id===e))||void 0===s?void 0:s.name)||e;};}firstUpdated(){this.refresh(),this.loadActions();}async refresh(e=!1){try{if(this.info=await Di(this.hass),!this.draft||e)this.draft=Fr(this.info.settings);else{const e=this.info.settings;this.draft=Object.assign(Object.assign({},this.draft),{current:e.current,previous:e.previous,source:e.source,changed_at:e.changed_at,history:e.history,pending:e.pending});}}catch(e){this.error=ba(e);}}editable(e){const{current:t,previous:s,source:i,changed_at:n,history:o,pending:r}=e,l=a(e,["current","previous","source","changed_at","history","pending"]);return JSON.stringify(l);}get dirty(){return!!this.info&&!!this.draft&&this.editable(this.info.settings)!==this.editable(this.draft);}set(e){const t=Fr(this.draft);e(t),this.draft=t;}setMode(e,t){this.set(s=>t(s.modes.find(t=>t.id===e)));}render(){if(!this.info||!this.draft)return Z`<ha-card><div class="empty">${this.error||"Loading…"}</div></ha-card>`;const e=(e=>{const t=[],s=e.map(e=>e.name.trim().toLowerCase());s.some(e=>!e)&&t.push("Every House Mode needs a name."),new Set(s).size!==s.length&&t.push("House Mode names must be unique.");const a=new Set(e.map(e=>e.id));for(const s of e)for(const e of s.timers)"previous"===e.then||a.has(e.then)||t.push(`${s.name}: a timer goes to a mode that no longer exists.`);return t;})(this.draft.modes);return Z`
      ${this.error?Z`<div class="notice error" style="white-space:pre-line;margin:0 0 12px">${this.error}</div>`:K}
      ${this.renderCurrent()}
      <ha-card><div class="toolbar"><ha-icon icon="mdi:history"></ha-icon>House Mode history and every sequence around it are on the <a href="/house_modes/activity">Activity</a> tab.</div></ha-card>
      ${this.dirty?Z`<div class="savebar" role="region" aria-label="Unsaved House Mode settings">
            <span class="count">Unsaved House Mode settings
              ${e.length?Z`<span class="secondary" style="display:block">${e.join(" ")}</span>`:K}</span>
            <ha-button appearance="plain" ?disabled=${this.busy} @click=${()=>this.draft=Fr(this.info.settings)}>Discard</ha-button>
            <ha-button ?disabled=${this.busy||e.length>0} @click=${this.save}>${this.busy?"Saving…":"Save"}</ha-button>
          </div>`:K}
    `;}renderCurrent(){const e=this.info.settings,t=e.modes.find(t=>t.id===e.current),s=e.enabled?Z`<div class="hm-status">${"shadow"===Ni(e)?"Would be":"Now"}: <strong>${t?t.name:"unknown"}</strong>
          ${e.changed_at?Z`<span class="secondary" style="display:inline">since ${$a(e.changed_at,this.hass.language)} (${e.source})</span>`:K}</div>`:Z`<div class="hm-status secondary">Off — choose Shadow or Live and save to start.</div>`;return Z`
      <ha-card>${Sa("House Modes","settings")}
        <div class="card-content desc">
          <p>A House Mode says what is going on at home — Away, Stay, Guest, Spa, … Each mode:</p>
          <ul>
            <li>sets the partitions to an Arm Mode (or leaves them alone);</li>
            <li>has <strong>Allowed Sources</strong>: whether you, schedules, presence, a lock code or the keypad may enter or exit it;</li>
            <li>can check that zones are closed, and can change itself back after a while.</li>
          </ul>
          <p>Each mode can run your scripts as its <em>actions</em> (lock up, lights, …). Automations can also
            react to <code>select.house_mode</code> or the <code>house_modes_house_mode_changed</code> event, and change
            the mode with <code>house_modes.set_house_mode</code> (mode + source).</p>
        </div>
        <div class="toolbar">
          ${Ia("house-run","hm-run",Ni(this.draft),e=>this.set(t=>((e,t)=>{e.enabled="off"!==t,"off"!==t&&(e.run_mode=t);})(t,e)),()=>this.requestUpdate())}
        </div>
        ${"shadow"===Ni(this.draft)?Z`<div class="notice" style="margin:0 16px 12px">
              <strong>Shadow:</strong> House Modes run next to your own automations and change nothing. Each request
              (your input_select, the House Mode select, a lock code, a timer) is checked the way Live would handle it,
              then compared with what your automations really did. Nothing is armed or disarmed, no script
              runs, no notification is sent, and the input_select is never written. The comparison is on the
              <a href="/house_modes/activity">Activity</a> tab.
              ${s}
            </div>`:Z`<div class="hm-status-line">${s}</div>`}
        ${this.lastBlocked?Z`<div class="notice warn">${this.lastBlocked.reason}
              <button class="link" @click=${()=>this.choose(this.lastBlocked.mode,!0)}>Change anyway</button></div>`:K}
        ${e.pending.length?Z`<div class="notice">${e.pending.map(t=>{const s=e.modes.find(e=>e.id===t.target);return Z`<div>${"delayed"===t.kind?"Delayed request":"Timer"}: ${s?s.name:t.target} at ${new Date(1e3*t.due).toLocaleTimeString()}</div>`;})}</div>`:K}
        ${this.renderModes()}
        ${this.renderByScript()}
        ${this.renderByAutomation()}
        ${this.renderEveryChange()}
        ${this.renderTemplated()}
        ${this.renderSettingsRow()}
      </ha-card>
    `;}async choose(e,t=!1){var s;this.busy=!0,this.error="",this.lastBlocked=null;try{const a=await((e,t,s=!1)=>e.callWS({type:"house_modes/ext/house/set",mode:t,force:s}))(this.hass,e,t),i=(null===(s=this.info.settings.modes.find(t=>t.id===e))||void 0===s?void 0:s.name)||e;"blocked"===a.result?this.lastBlocked={mode:e,reason:a.reason||"Not allowed now."}:"not_ready"===a.result?this.lastBlocked={mode:e,reason:`Not ready, open: ${(a.open||[]).join(", ")}`}:"failed"===a.result?this.error=`${i} failed: ${(a.failed||[]).join(", ")} did not arm.`:"delayed"===a.result?_a(this,`${i} in ${a.minutes} min.`):"shadow"===a.result?_a(this,`Shadow: ${i} ${"changed"===a.would?"would be set":`would be ${a.would}`} (nothing changed)`):_a(this,`House Mode: ${i}`),await this.refresh();}catch(e){this.error=ba(e);}finally{this.busy=!1;}}renderModes(){const e=this.draft,t={};this.info.targets.forEach(e=>t[e.key]=e.name);const s=this.info.settings,a=s.current,i=s.enabled,n="shadow"===Ni(s),o=new Set(s.modes.map(e=>e.id));return this.tabSec("modes",`Modes (${e.modes.length})`,"",!1,Z`
        <div class="card-content desc hm-desc">
          <p><ha-icon icon="mdi:play-circle-outline" style="--mdc-icon-size:18px"></ha-icon> switches to a mode now.
            The pencil edits it: which partitions it arms, its Allowed Sources, readiness checks, what happens
            if arming fails, what starts it (Triggers), timers, the scripts it runs (Script Actions) and the automations it
            starts (Automation Actions). Save at the
            bottom of the page.</p>
        </div>
        <div class="toolbar">
          <ha-button appearance="plain" ?disabled=${this.detecting} @click=${()=>this.runDetect()}><ha-icon slot="start" icon="mdi:magnify-scan"></ha-icon>Detect from your input_selects</ha-button>
          <ha-button appearance="plain" @click=${this.addMode}><ha-icon slot="start" icon="mdi:plus-circle"></ha-icon>Add House Mode</ha-button>
          ${e.modes.length?K:Z`<ha-button appearance="plain" @click=${this.addStarter}><ha-icon slot="start" icon="mdi:auto-fix"></ha-icon>Add starter modes</ha-button>`}
          ${this.dirty?Z`<span class="secondary" style="display:inline">Save before switching modes.</span>`:K}
        </div>
        ${this.detect?this.renderDetect():K}
        ${Ji(e.modes).length?Z`<div class="notice warn" style="margin:0 16px 12px"><strong>Timers that can't work:</strong>
              ${Ji(e.modes).map(e=>Z`<div>${e.text}</div>`)}</div>`:K}
        ${e.modes.length?Z`<div class="table-wrap"><table class="full">
              <thead><tr><th class="icon"></th><th>House Mode</th><th>Partitions</th><th></th></tr></thead>
              <tbody>
                ${e.modes.map(s=>{const r=this.open.includes(s.id);return Z`
                    <tr>
                      <td class="icon"><ha-icon icon=${s.icon} style=${`color:${s.color||Ii(s.name)}`}></ha-icon></td>
                      <td class="name">${s.name}${s.id===a?Z`<span class="secondary">${n?"current (would be)":"current"}</span>`:K}
                        <span class="secondary hm-counts">${Ji(e.modes).some(e=>e.mode===s.id)?Z`<ha-icon class="hm-warn-icon" icon="mdi:alert" title="A timer can't work: open Timers"></ha-icon>`:K}${this.modeCounts(s)}</span></td>
                      <td>${Fi(s,t,e=>Zr[e]||e)||Z`<span class="secondary" style="display:inline">leaves the partitions alone</span>`}</td>
                      <td class="row-actions">
                        ${s.id!==a&&i?Z`<ha-icon-button .label=${`Switch to ${s.name}`} title=${n?`Switch to ${s.name} (Shadow: only logged)`:`Switch to ${s.name}`}
                              ?disabled=${this.busy||this.dirty||!o.has(s.id)} @click=${()=>this.choose(s.id)}>
                              <ha-icon icon="mdi:play-circle-outline"></ha-icon></ha-icon-button>`:Z`<ha-icon-button class="hm-noswitch" aria-hidden="true" tabindex="-1"><ha-icon icon="mdi:play-circle-outline"></ha-icon></ha-icon-button>`}
                        <ha-icon-button .label=${r?"Close":"Edit"} title=${r?"Close":"Edit"} @click=${()=>this.open=r?this.open.filter(e=>e!==s.id):[...this.open,s.id]}>
                          <ha-icon icon=${r?"mdi:chevron-up":"mdi:pencil"}></ha-icon></ha-icon-button>
                        <ha-icon-button .label=${"Delete"} title="Delete"
                          @click=${()=>window.confirm(`Delete the House Mode "${s.name}" with its Script Actions and timers? Timers in other modes that go to it are removed too. It is gone once you Save; a backup is made first.`)&&(this.draft=((e,t)=>Object.assign(Object.assign({},e),{modes:e.modes.filter(e=>e.id!==t).map(e=>Object.assign(Object.assign({},e),{timers:e.timers.filter(e=>e.then!==t)})),lock_keypads:e.lock_keypads.map(e=>{const s={};return Object.keys(e.slots).forEach(a=>{e.slots[a]!==t&&(s[a]=e.slots[a]);}),Object.assign(Object.assign({},e),{slots:s});}),current:e.current===t?null:e.current}))(this.draft,s.id))}>
                          <ha-icon icon="mdi:trash-can-outline"></ha-icon></ha-icon-button>
                      </td>
                    </tr>
                    ${r?Z`<tr class="detail hm-detail"><td colspan="4">${this.renderEditor(s)}</td></tr>`:K}
                  `;})}
              </tbody>
            </table></div>`:K}
    `);}modeCounts(e){const t=this.actions?Mr(this.actions.items,e.name):{enter:[],leave:[]},s=(e,t)=>`${e} ${t}${1===e?"":"s"}`;return[s((e.steps||[]).length,"script"),s(e.timers.length,"timer"),this.actions?s(t.enter.length+t.leave.length,"automation"):""].filter(Boolean).join(" · ");}tabSec(e,t,s,a,i){const n=`*:tab:${e}`,o=n in Gr?Gr[n]:a;return Z`<details class="collapse hm-tabsec" ?open=${o} @toggle=${e=>Gr[n]=e.target.open}>
      <summary>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        <span class="collapse-title">${t}</span>
        ${s?Z`<span class="secondary" style="display:inline">${s}</span>`:K}
      </summary>
      <div class="hm-tabsec-body">${i}</div>
    </details>`;}async runDetect(e){var t,s,a;this.detecting=!0,this.error="";try{const i=null===(t=this.detect)||void 0===t?void 0:t.entities;this.detect=await(s=this.hass,a=e?Object.assign(Object.assign({},i),e):void 0,s.callWS(Object.assign({type:"house_modes/ext/house/detect"},a||{}))),this.detectPick=this.detect.suggestions.filter(e=>"none"!==e.basis).map(e=>e.name);}catch(e){this.error=ba(e);}finally{this.detecting=!1;}}renderDetect(){const e=this.detect,t={};e.targets.forEach(e=>t[e.key]=e.name);const s=e=>this.draft.modes.some(t=>t.name.toLowerCase()===e.toLowerCase()),a=(t,s)=>Z`<label>${s}
        <select @change=${e=>this.runDetect({[t]:e.target.value||null})}>
          <option value="" ?selected=${!e.entities[t]}>none</option>
          ${e.selects.map(s=>Z`<option value=${s.entity_id} ?selected=${e.entities[t]===s.entity_id}>${s.name||s.entity_id} (${s.entity_id})</option>`)}
        </select></label>`,i=e.span.length?Math.max(1,Math.round((e.span[1]-e.span[0])/86400)):0;return Z`
      <div class="editor" style="margin:0 16px 12px;padding:8px 12px;border-left:3px solid var(--primary-color)">
        <div class="subhead">Detected House Modes</div>
        <p class="secondary">One House Mode per option of your input_selects. Partitions come from the Activity log (what
          the partitions were set to each time your current-mode entity changed: ${e.changes} changes over ${i} days), or from the
          name when a mode never appears there. Nothing is saved until you press Save.</p>
        <div class="detail-grid">
          ${a("selector","Selector (manual choice)")} ${a("current","Current House Mode")} ${a("previous","Previous House Mode")}
        </div>
        <div class="table-wrap"><table class="full">
          <thead><tr><th></th><th>House Mode</th><th>Partitions</th><th>Based on</th><th>Note</th></tr></thead>
          <tbody>
            ${e.suggestions.map(e=>{const a=this.detectPick.includes(e.name),i=Object.entries(e.targets).map(([e,s])=>`${t[e]||e}: ${Zr[s]||s}`).join(", "),n="activity"===e.basis?`seen ${e.seen}× (${Object.values(e.share).map(e=>Math.round(100*e)+"%").join(", ")||"—"})`:"name"===e.basis?"the name":"—";return Z`<tr>
                <td><input type="checkbox" .checked=${a} @change=${t=>this.detectPick=t.target.checked?[...this.detectPick,e.name]:this.detectPick.filter(t=>t!==e.name)} /></td>
                <td><ha-icon icon=${e.icon}></ha-icon> ${e.name}${s(e.name)?Z` <span class="secondary" style="display:inline">(updates yours)</span>`:K}</td>
                <td>${i||Z`<span class="secondary">leaves them alone</span>`}</td>
                <td>${n}</td>
                <td><span class="secondary" style="display:inline">${e.note}</span></td>
              </tr>`;})}
          </tbody>
        </table></div>
        <div class="toolbar">
          <ha-button ?disabled=${!this.detectPick.length} @click=${this.useDetected}>Use ${this.detectPick.length} House Mode${1===this.detectPick.length?"":"s"}</ha-button>
          <ha-button appearance="plain" @click=${()=>this.detect=void 0}>Cancel</ha-button>
        </div>
      </div>
    `;}useDetected(){const e=this.detect,t=e.suggestions.filter(e=>this.detectPick.includes(e.name));let s=[];this.set(a=>s=((e,t,s)=>{const a=[];s.selector&&e.input_select!==s.selector&&(e.input_select=s.selector,a.push(`input_select: ${s.selector}`)),s.current&&e.current_entity!==s.current&&(e.current_entity=s.current),s.previous&&e.previous_entity!==s.previous&&(e.previous_entity=s.previous);for(const s of t){const t=e.modes.find(e=>e.name.toLowerCase()===s.name.toLowerCase());if(t)"none"!==s.basis&&JSON.stringify(t.targets)!==JSON.stringify(s.targets)&&(t.targets=Object.assign({},s.targets),a.push(`${t.name}: partitions updated`)),"mdi:home"===t.icon&&"mdi:home"!==s.icon&&(t.icon=s.icon);else{const t=Ui(s.name,e.modes);t.icon=s.icon,t.targets=Object.assign({},s.targets),e.modes.push(t),a.push(`${t.name}: added`);}}return e.enabled||(e.enabled=!0,e.run_mode="shadow",a.push("House Modes: Shadow")),a;})(a,t,e.entities)),this.detect=void 0,_a(this,`Detected House Modes added to the draft (${s.length} changes). Check them, then Save.`);}addMode(){const e=window.prompt("Name of the new House Mode");if(!e)return;const t=Ui(e.trim(),this.draft.modes);this.set(e=>e.modes.push(t)),this.open=[...this.open,t.id];}addStarter(){var e;const t=null===(e=this.info.targets.find(e=>"master"===e.key)||this.info.targets[0])||void 0===e?void 0:e.key,s=(e,s,a={})=>{const i=Object.assign(Object.assign({},Ui(e,[])),a);return t&&s&&(i.targets={[t]:s}),i;},a=[...Ti];this.set(e=>{e.modes=[s("Disarmed","disarmed"),s("Stay","armed_home"),s("Sleep","armed_night"),s("Away","armed_away"),s("Vacation","armed_vacation",{leave_sources:["manual","presence_home","lock","panel_keypad"]}),s("Guest","disarmed",{leave_sources:a.filter(e=>"presence_away"!==e)}),s("Local","disarmed",{enter_sources:["manual"],leave_sources:a.filter(e=>"presence_away"!==e)}),s("Spa","armed_custom_bypass",{enter_sources:["manual"],delay_sources:{schedule:30},timers:[{after_minutes:45,then:"previous",from_modes:[],notify:!0}]})];});}sec(e,t,s,a,i){const n=`${e.id}:${t}`;return Z`<details class="collapse sub hm-sec" ?open=${!!Gr[n]}
        @toggle=${e=>Gr[n]=e.target.open}>
      <summary>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        <span class="collapse-title">${s}</span>
        <span class="secondary" style="display:inline">${a}</span>
      </summary>
      <div class="collapse-body">${i}</div>
    </details>`;}renderEditor(e){const t=t=>this.setMode(e.id,t),s=this.draft.modes.filter(t=>t.id!==e.id),a={};this.info.targets.forEach(e=>a[e.key]=e.name);const i=Fi(e,a,e=>Zr[e]||e),n=e.enter_sources.length,o=e.leave_sources.length,r=e.readiness.entities.length+e.readiness.labels.length,l=this.actions?Mr(this.actions.items,e.name):{enter:[],leave:[]},c=l.enter.length+l.leave.length,d=(e,t)=>`${e} ${t}${1===e?"":"s"}`,h=Ji(this.draft.modes).filter(t=>t.mode===e.id);return Z`
      <div class="hm-ed">
        <div class="hm-fields">
          <label class="hm-f">Name <input type="text" .value=${e.name} @change=${e=>t(t=>t.name=e.target.value)} /></label>
          <div class="hm-f"><hm-icon-field .hass=${this.hass} .value=${e.icon} .placeholder=${"home"}
            @value-changed=${e=>t(t=>t.icon=e.detail.value||"mdi:home")}></hm-icon-field></div>
          <label class="hm-f">Color
            <input type="color" .value=${(e=>{const t=(e||"").trim().toLowerCase();return /^#[0-9a-f]{6}$/.test(t)?t:/^#[0-9a-f]{3}$/.test(t)?"#"+[...t.slice(1)].map(e=>e+e).join(""):Vi[t]||"#9e9e9e";})(e.color||Ii(e.name))} @input=${e=>t(t=>t.color=e.target.value)} />
            ${e.color?Z`<button class="link" @click=${()=>t(e=>e.color="")}>automatic</button>`:Z`<span class="secondary" style="display:inline">automatic</span>`}
          </label>
          <label class="hm-f" title="What happens when a partition does not arm">If arming fails
            <select @change=${e=>t(t=>t.on_failure=e.target.value)}>
              <option value="undo" ?selected=${"undo"===e.on_failure}>undo (back to how it was)</option>
              <option value="keep" ?selected=${"keep"===e.on_failure}>keep what armed (mode unknown)</option>
              <option value="previous" ?selected=${"previous"===e.on_failure}>go to the previous mode</option>
            </select>
          </label>
        </div>
        ${this.sec(e,"partitions","Partitions",i||"leaves the partitions alone",Z`
          <div class="hm-fields">
            ${this.info.targets.map(s=>Z`<label class="hm-f">${s.name}
              <select @change=${e=>t(t=>{""===e.target.value?delete t.targets[s.key]:t.targets[s.key]=e.target.value;})}>
                <option value="" ?selected=${!e.targets[s.key]}>leave unchanged</option>
                ${Pi.map(t=>Z`<option value=${t} ?selected=${e.targets[s.key]===t}>${Zr[t]}</option>`)}
              </select></label>`)}
          </div>
          <div class="secondary hm-hint">Leave everything unchanged for a mode that only tells your automations what is going on.</div>`)}
        ${this.sec(e,"sources","Allowed Sources",`${n} of ${Ti.length} may enter · ${o} may exit`,Z`
          <div class="table-wrap"><table>
            <thead><tr><th>Source</th><th class="c" title="This source may switch into this mode">May Enter</th><th class="c" title="This source may change the mode while this mode is on">May Exit</th><th title="Instead of blocking an exit, wait this many minutes">Wait Before Exit (min)</th></tr></thead>
            <tbody>${Ti.map(s=>Z`<tr>
              <td>${zi[s]}</td>
              <td class="c"><input type="checkbox" .checked=${e.enter_sources.includes(s)} @change=${e=>t(t=>t.enter_sources=e.target.checked?[...t.enter_sources,s]:t.enter_sources.filter(e=>e!==s))} /></td>
              <td class="c"><input type="checkbox" .checked=${e.leave_sources.includes(s)} @change=${e=>t(t=>t.leave_sources=e.target.checked?[...t.leave_sources,s]:t.leave_sources.filter(e=>e!==s))} /></td>
              <td><hm-slider compact optional .label=${`${zi[s]}: wait before exit`} .min=${1} .max=${120} .onValue=${10}
                unit="min" offText="no wait" .value=${e.delay_sources[s]||null}
                @value-changed=${e=>t(t=>{e.detail.value?t.delay_sources[s]=e.detail.value:delete t.delay_sources[s];})}></hm-slider></td>
            </tr>`)}</tbody>
          </table></div>`)}
        ${this.sec(e,"readiness","Readiness",r?`${d(r,"check")} · ${"block"===e.readiness.action?"blocks":"warns"} if open`:"no checks",Z`
          <div class="hm-fields">
            <label class="hm-f">Entities that should be closed <input type="text" placeholder="binary_sensor.patio_door, …" .value=${e.readiness.entities.join(", ")}
              @change=${e=>t(t=>t.readiness.entities=Yr(e.target.value))} /></label>
            <label class="hm-f">…or with label (ids) <input type="text" placeholder="windows" .value=${e.readiness.labels.join(", ")}
              @change=${e=>t(t=>t.readiness.labels=Yr(e.target.value))} /></label>
            <label class="hm-f">If open
              <select @change=${e=>t(t=>t.readiness.action=e.target.value)}>
                <option value="warn" ?selected=${"warn"===e.readiness.action}>warn and continue</option>
                <option value="block" ?selected=${"block"===e.readiness.action}>do not change the mode</option>
              </select></label>
          </div>`)}
        ${this.sec(e,"triggers","Triggers",this.triggerSummary(e),this.renderTriggers(e))}
        ${this.sec(e,"timers","Timers",Z`${h.length?Z`<ha-icon class="hm-warn-icon" icon="mdi:alert"></ha-icon>`:K}${e.timers.length?e.timers.map(e=>qi(e,this.nameOf)).join(" · "):"none"}`,this.renderTimers(e,s))}
        ${this.sec(e,"actions","Script Actions",d((e.steps||[]).length,"script"),this.renderSteps(e,s))}
        ${this.sec(e,"automations","Automation Actions",this.actions?d(c,"automation"):"loading…",this.renderRelated(e))}
      </div>
    `;}triggerSummary(e){const t=this.draft,s=this.actions?Hr(this.actions.items,e.name):[],a=t.modes.filter(t=>t.id!==e.id&&t.timers.some(t=>t.then===e.id)).length,i=t.lock_keypads.reduce((t,s)=>t+Object.values(s.slots).filter(t=>t===e.id).length,0),n=s.some(t=>t.sets.some(s=>Pr(s,e.name,e.enter_sources).length||Rr(t.item,s).length)),o=(e,t)=>`${e} ${t}${1===e?"":"s"}`,r=[this.actions?o(s.length,"automation"):"loading…",a?o(a,"timer"):"",i?o(i,"lock code"):"","manual"];return Z`${n?Z`<ha-icon class="hm-warn-icon" icon="mdi:alert"></ha-icon>`:K}${r.filter(Boolean).join(" · ")}`;}renderTriggers(e){const t=this.draft,s=this.actions?Hr(this.actions.items,e.name):[],a=t.modes.reduce((t,s)=>s.id===e.id?t:t.concat(s.timers.filter(t=>t.then===e.id).map(e=>({o:s,t:e}))),[]),i=t.lock_keypads.map(t=>({k:t,slots:Object.entries(t.slots).filter(([,t])=>t===e.id).map(([e])=>e)})).filter(e=>e.slots.length);return Z`
      <div class="hm-group">Automations that set ${e.name}</div>
      ${this.actions?s.length?s.map(({item:t,sets:s})=>Z`${this.autoLine(t,s.map(e=>zr(t,e)).join("; "))}
              ${s.reduce((s,a)=>s.concat(Pr(a,e.name,e.enter_sources),Rr(t,a)),[]).map(e=>Z`<div class="hm-line-warn"><ha-icon icon="mdi:alert"></ha-icon>${e}</div>`)}`):Z`<div class="secondary hm-hint">None: no automation's actions set ${e.name}.</div>`:Z`<div class="secondary hm-hint">Loading…</div>`}
      <div class="hm-group">Built in</div>
      ${a.map(({o:e,t:t})=>Z`<div class="hm-line"><ha-icon class="hm-item-icon" icon="mdi:timer-outline"></ha-icon>
        <div class="hm-line-name"><span>Timer in ${e.name}</span><span class="secondary">${qi(t,this.nameOf)}</span></div></div>`)}
      ${i.map(({k:e,slots:t})=>{var s;return Z`<div class="hm-line"><ha-icon class="hm-item-icon" icon="mdi:lock-smart"></ha-icon>
        <div class="hm-line-name"><span>${e.name||(e.entity_id?(null===(s=this.hass.states[e.entity_id])||void 0===s?void 0:s.attributes.friendly_name)||e.entity_id:`Lock ${e.node_id}`)}</span>
          <span class="secondary">code slot${1===t.length?"":"s"} ${t.join(", ")}</span></div></div>`;})}
      <div class="hm-line"><ha-icon class="hm-item-icon" icon="mdi:gesture-tap"></ha-icon>
        <div class="hm-line-name"><span>Manual</span><span class="secondary">the mode buttons, the dashboard card, ${t.input_select?t.input_select:"your selector"}</span></div></div>
      <div class="secondary hm-hint">Read from the automations' actions. Each one's request still has to pass this mode's
        Allowed Sources. Partitions armed from the panel keypad or another alarm card also set the House Mode whose
        partitions match.</div>
    `;}renderTimers(e,t){const s=t=>this.setMode(e.id,t),a=Ji(this.draft.modes).filter(t=>t.mode===e.id);return Z`
      ${a.length?Z`<div class="notice warn hm-warn">${a.map(e=>Z`<div>${e.text}</div>`)}</div>`:K}
      <button class="hm-add" @click=${()=>s(e=>e.timers.push({after_minutes:10,then:"previous",from_modes:[],window_start:null,window_end:null,notify:!0}))}>
        <ha-icon icon="mdi:plus"></ha-icon>Timer</button>
      ${e.timers.map((a,i)=>Z`<div class="hm-item">
        <ha-icon class="hm-item-icon" icon="mdi:timer-outline"></ha-icon>
        <div class="hm-item-body">
          <label><select aria-label="When" @change=${e=>s(t=>{const s=t.timers[i];"at"===e.target.value?(s.at=s.at||"01:00",s.after_minutes=null):(s.after_minutes=s.after_minutes||10,s.at=null);})}>
              <option value="after" ?selected=${!a.at}>after</option>
              <option value="at" ?selected=${!!a.at}>at</option>
            </select></label>
          ${a.at?Z`<label><input type="time" aria-label="At" .value=${a.at} @change=${e=>s(t=>t.timers[i].at=e.target.value||"01:00")} /></label>`:Z`<hm-slider .label=${""} .min=${1} .max=${720} unit="min" .value=${a.after_minutes||10}
                @value-changed=${e=>s(t=>t.timers[i].after_minutes=Math.max(1,e.detail.value||1))}></hm-slider>`}
          <label>go to <select @change=${e=>s(t=>t.timers[i].then=e.target.value)}>
            <option value="previous" ?selected=${"previous"===a.then}>the previous mode</option>
            ${t.map(e=>Z`<option value=${e.id} ?selected=${a.then===e.id}>${e.name}</option>`)}
          </select></label>
          <hm-multi-picker .label=${"only when coming from"} .placeholder=${"any mode"}
            .options=${t.map(e=>({value:e.id,label:e.name}))} .value=${a.from_modes}
            @value-changed=${e=>s(t=>t.timers[i].from_modes=e.detail.value)}></hm-multi-picker>
          <label>between <input type="time" .value=${a.window_start||""} @change=${e=>s(t=>t.timers[i].window_start=e.target.value||null)} />
            and <input type="time" .value=${a.window_end||""} @change=${e=>s(t=>t.timers[i].window_end=e.target.value||null)} /></label>
          <label><input type="checkbox" .checked=${a.notify} @change=${e=>s(t=>t.timers[i].notify=e.target.checked)} /> notify</label>
        </div>
        <span class="hm-item-actions">
          <ha-icon-button class="hm-del" .label=${"Delete timer"} title="Delete timer" @click=${()=>window.confirm(`Delete this timer of ${e.name}?`)&&s(e=>e.timers.splice(i,1))}>
            <ha-icon icon="mdi:trash-can-outline"></ha-icon></ha-icon-button>
        </span>
      </div>`)}
      ${e.timers.length?K:Z`<div class="secondary hm-hint">None.</div>`}
      <div class="secondary hm-hint">"At" is the next time that clock time comes round after the mode began (e.g. Late Night → Sleep at 01:00).
        Timers start when this mode begins, survive restarts, and are cancelled when the mode changes. The time window is
        checked when the mode begins. A timer only switches if the target mode allows the "House Mode timers" source.</div>
    `;}renderSteps(e,t){const s=t=>this.setMode(e.id,t),a=e.steps||[],i=Wi(this.hass),n=e=>{var t;return(null===(t=this.hass.states[e])||void 0===t?void 0:t.attributes.friendly_name)||e;};return Z`
      <button class="hm-add" ?disabled=${!i.length}
        @click=${()=>s(e=>e.steps=[...(e.steps||[]),{entity_id:i[0],when:"enter",phase:"after",modes:[],wait:!1}])}>
        <ha-icon icon="mdi:plus"></ha-icon>Script</button>
      ${a.map((a,o)=>Z`<div class="hm-item">
        ${Ea(this.hass,a.entity_id)}
        <div class="hm-item-body">
          <label>Run
            <select @change=${e=>s(t=>t.steps[o].entity_id=e.target.value)}>
              ${i.includes(a.entity_id)?K:Z`<option value=${a.entity_id} selected>${a.entity_id} (${a.entity_id.startsWith("scene.")?"a scene: replace it with a script":"missing"})</option>`}
              ${i.map(e=>Z`<option value=${e} ?selected=${e===a.entity_id}>${n(e)}</option>`)}
            </select></label>
          <label>when
            <select @change=${e=>s(t=>t.steps[o].when=e.target.value)}>
              <option value="enter" ?selected=${"enter"===a.when}>entering ${e.name}</option>
              <option value="leave" ?selected=${"leave"===a.when}>leaving ${e.name}</option>
            </select></label>
          <label>
            <select aria-label="Phase" @change=${e=>s(t=>t.steps[o].phase=e.target.value)}>
              <option value="before" ?selected=${"before"===a.phase}>before arming</option>
              <option value="after" ?selected=${"after"===a.phase}>after the change</option>
            </select></label>
          <hm-multi-picker
            .label=${"enter"===a.when?"only when coming from":"only when going to"}
            .placeholder=${"any mode"}
            .options=${t.map(e=>({value:e.id,label:e.name}))}
            .value=${a.modes}
            @value-changed=${e=>s(t=>t.steps[o].modes=e.detail.value)}
          ></hm-multi-picker>
          ${a.entity_id.startsWith("script.")?Z`<label title="Wait until the script has finished before the next action (at most 5 minutes)"><input type="checkbox" .checked=${a.wait}
                @change=${e=>s(t=>t.steps[o].wait=e.target.checked)} /> wait for it</label>`:K}
        </div>
        <span class="hm-item-actions">
          ${Ur(a.entity_id,this.hass)?Z`<ha-icon-button .label=${"Open in Home Assistant"} title="Open in Home Assistant's editor"
                @click=${()=>la(0,Ur(a.entity_id,this.hass))}><ha-icon icon="mdi:open-in-new"></ha-icon></ha-icon-button>`:K}
          <ha-icon-button .label=${"Run now"} title="Run now" @click=${()=>this.runEntity(a.entity_id)}><ha-icon icon="mdi:play"></ha-icon></ha-icon-button>
          <ha-icon-button class="hm-del" .label=${"Delete action"} title="Delete action" @click=${()=>window.confirm(`Remove ${n(a.entity_id)} from ${e.name}'s Script Actions?`)&&s(e=>e.steps.splice(o,1))}>
            <ha-icon icon="mdi:trash-can-outline"></ha-icon></ha-icon-button>
        </span>
      </div>`)}
      ${a.length?K:Z`<div class="secondary hm-hint">None. Actions are Home Assistant scripts; build them in Home Assistant
        (Settings → Automations &amp; scenes → Scripts). A script can turn on a scene if you want one.</div>`}
      <div class="secondary hm-hint">Order: the old mode's "leaving" actions, then the new mode's "entering" actions.
        <em>Before arming</em> runs before the partitions change (e.g. lock up); <em>after the change</em> once it succeeded.
        Scripts get <code>from_mode</code>, <code>to_mode</code> and <code>source</code>. Actions run only in Live; a failing
        action is logged on the Activity tab and does not stop the change. Scripts named <code>hm_…</code> are listed first.
        When you save, each script gets a "House Mode: &lt;mode&gt;" label, and each script in <code>scripts.yaml</code> a first
        description line such as "House Mode action: Sleep · entering, before arming"; both are written from this list,
        never read back.</div>
    `;}item(e){var t;return null===(t=this.actions)||void 0===t?void 0:t.items.find(t=>t.entity_id===e);}async runEntity(e){var t,s;const[a]=e.split(".");try{"automation"===a?await this.hass.callService("automation","trigger",{entity_id:e}):"script"===a?await this.hass.callService("script","turn_on",{entity_id:e}):await this.hass.callService("scene","turn_on",{entity_id:e}),_a(this,`Ran ${(null===(t=this.item(e))||void 0===t?void 0:t.name)||(null===(s=this.hass.states[e])||void 0===s?void 0:s.attributes.friendly_name)||e}.`);}catch(e){this.error=ba(e);}}async enableAutomation(e,t){await this.hass.callService("automation",t?"turn_on":"turn_off",{entity_id:e.entity_id}),window.setTimeout(()=>this.loadActions(),800);}loadActions(){var e;(e=this.hass,e.callWS({type:"house_modes/ext/house_actions/get"})).then(e=>this.actions=e).catch(()=>this.actions={modes:[],modes_source:"none",label_prefix:"",items:[]});}autoLine(e,t){const s=Er(e);return Z`<div class="hm-line">
      ${Ea(this.hass,e.entity_id)}
      <div class="hm-line-name">
        ${s?Z`<button class="link" title="Open in Home Assistant's editor" @click=${()=>la(0,s)}>${e.name}</button>`:Z`<span>${e.name}</span>`}
        <span class="secondary">${t}</span>
      </div>
      <button class="hm-chip ${"on"===e.state?"en":""}" title=${"on"===e.state?"Enabled: click to disable":"Disabled: click to enable"}
        @click=${()=>this.enableAutomation(e,"on"!==e.state)}>${"on"===e.state?"Enabled":"Disabled"}</button>
      <ha-icon-button .label=${"Run now"} title="Run now" @click=${()=>this.runEntity(e.entity_id)}><ha-icon icon="mdi:play"></ha-icon></ha-icon-button>
    </div>`;}renderRelated(e){if(!this.actions)return Z`<div class="secondary hm-hint">Loading…</div>`;const t=Mr(this.actions.items,e.name),s=[...t.enter.map(t=>this.autoLine(t,t.reacts.from.includes(e.name)?`when ${e.name} starts or ends`:`when ${e.name} starts`)),...t.leave.map(t=>this.autoLine(t,`when ${e.name} ends`))];return Z`
      ${s.length?s:Z`<div class="secondary hm-hint">None: no automation has a trigger on this mode.</div>`}
      <div class="secondary hm-hint">Read from the automations' triggers; automations that only use the House Mode as a
        condition are not listed. Change them in Home Assistant's editor (click a name).</div>
    `;}renderByScript(){const e=this.draft;if(!e.modes.length)return K;const t=(e=>{const t=[];for(const s of e.modes)for(const e of s.steps||[]){let a=t.find(t=>Zi(e,t));a||t.push(a={entity_id:e.entity_id,when:e.when,phase:e.phase,modes:[]}),a.modes.includes(s.id)||a.modes.push(s.id);}return t;})(e),s=this.pendingGroups.filter(e=>!t.some(t=>t.entity_id===e.entity_id&&t.when===e.when&&t.phase===e.phase)),a=[...t,...s.map(e=>Object.assign(Object.assign({},e),{modes:[]}))],i=Wi(this.hass),n=e=>{var t;return(null===(t=this.hass.states[e])||void 0===t?void 0:t.attributes.friendly_name)||e;},o=new Set(t.map(e=>e.entity_id)).size,r=t.reduce((e,t)=>e+t.modes.length,0),l=e=>!e.modes.length,c=(t,s)=>{l(t)?this.pendingGroups=this.pendingGroups.map(e=>e.entity_id===t.entity_id&&e.when===t.when&&e.phase===t.phase?Object.assign(Object.assign({},e),s):e):this.draft=((e,t,s)=>{const a=Object.assign(Object.assign({},t),s);return Yi(e,(e,i)=>i.some(e=>Zi(e,t))?i.some(e=>Zi(e,a))&&!Zi(t,a)?i.filter(e=>!Zi(e,t)):i.map(e=>Zi(e,t)?Object.assign(Object.assign({},e),s):e):i);})(e,t,s);},d=(t,s)=>{const a=t.modes.includes(s)?t.modes.filter(e=>e!==s):[...t.modes,s];this.draft=Ki(e,t,a),a.length||(this.pendingGroups=[...this.pendingGroups,{entity_id:t.entity_id,when:t.when,phase:t.phase}]);},h=t=>{(l(t)||window.confirm(`Remove ${n(t.entity_id)} from every House Mode (${t.modes.length})?`))&&(this.pendingGroups=this.pendingGroups.filter(e=>!(e.entity_id===t.entity_id&&e.when===t.when&&e.phase===t.phase)),l(t)||(this.draft=((e,t)=>Ki(e,t,[]))(e,t)));},p=Wr.locked,u=e.modes.filter(e=>!qr.byscript.has(e.id)),m=p&&u.length<e.modes.length?a.filter(e=>!e.modes.length||e.modes.some(e=>u.some(t=>t.id===e))):a;return Z`<details class="collapse hm-tabsec" ?open=${!!Gr["*:byscript"]}
        @toggle=${e=>Gr["*:byscript"]=e.target.open}>
      <summary>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        <span class="collapse-title">Script Actions - All Modes</span>
        <span class="secondary" style="display:inline">${o} script${1===o?"":"s"} · used ${r} time${1===r?"":"s"}</span>
      </summary>
      <div class="collapse-body">
        <div class="secondary hm-hint" style="margin-top:0">Every script the House Modes run, one row per script and timing, with a column
          per mode. <strong>Unlock to edit</strong>: tick the modes that run it, change the script or its timing, add or remove
          rows. "Only when coming from" and "wait for it" are set per mode, in the mode's <em>Script Actions</em>. Changes are
          drafts until you Save at the bottom of the page.</div>
        ${this.modeFilter("byscript",e.modes)}
        <div class="toolbar" style="padding-left:0">
          ${ja(p,()=>{Wr.locked=!p,this.requestUpdate();})}
          <ha-button ?disabled=${p||!i.length} @click=${()=>{const e=new Set(a.map(e=>e.entity_id)),t=i.find(t=>!e.has(t))||i[0];t&&(this.pendingGroups=[...this.pendingGroups,{entity_id:t,when:"enter",phase:"after"}]);}}><ha-icon slot="start" icon="mdi:plus-circle"></ha-icon>Add script</ha-button>
        </div>
        ${a.length?Z`<div class="table-wrap"><table class="full sa-table">
              <thead><tr>
                <th class="icon"></th><th>Script</th><th>When</th>
                ${u.map(e=>Z`<th class="c mode" title=${e.name}><ha-icon icon=${e.icon}
                  style=${`color:${e.color||Ii(e.name)}`}></ha-icon></th>`)}
                <th></th>
              </tr></thead>
              <tbody>${m.map(e=>Z`<tr>
                <td class="icon">${Ea(this.hass,e.entity_id)}</td>
                <td class="name">${p?Z`${n(e.entity_id)}<span class="secondary">${e.entity_id}</span>`:Z`<select aria-label="Script" @change=${t=>c(e,{entity_id:t.target.value})}>
                      ${i.includes(e.entity_id)?K:Z`<option value=${e.entity_id} selected>${e.entity_id} (${e.entity_id.startsWith("scene.")?"a scene: replace it with a script":"missing"})</option>`}
                      ${i.map(t=>Z`<option value=${t} ?selected=${t===e.entity_id}>${n(t)}</option>`)}
                    </select>`}</td>
                <td>${p?Z`<span class="sa-when">${(e=>`${"enter"===e.when?"entering":"leaving"} · ${"before"===e.phase?"before arming":"after the change"}`)(e)}</span>`:Z`<select aria-label="When" @change=${t=>c(e,{when:t.target.value})}>
                        <option value="enter" ?selected=${"enter"===e.when}>entering</option>
                        <option value="leave" ?selected=${"leave"===e.when}>leaving</option>
                      </select>
                      <select aria-label="Phase" @change=${t=>c(e,{phase:t.target.value})}>
                        <option value="before" ?selected=${"before"===e.phase}>before arming</option>
                        <option value="after" ?selected=${"after"===e.phase}>after the change</option>
                      </select>`}</td>
                ${u.map(t=>{const s=e.modes.includes(t.id),a=`${t.name}: ${s?"runs "+("enter"===e.when?"entering":"leaving"):"not run"}`;return Z`<td class="c mode" title=${a}>${p?this.modeCell(t,s):Z`<input type="checkbox" class="cb" aria-label=${a} .checked=${s} @change=${()=>d(e,t.id)} />`}</td>`;})}
                <td class="row-actions">
                  ${Ur(e.entity_id,this.hass)?Z`<ha-icon-button .label=${"Open in Home Assistant"} title="Open in Home Assistant's editor"
                        @click=${()=>la(0,Ur(e.entity_id,this.hass))}><ha-icon icon="mdi:open-in-new"></ha-icon></ha-icon-button>`:K}
                  <ha-icon-button .label=${"Run now"} title="Run now" @click=${()=>this.runEntity(e.entity_id)}><ha-icon icon="mdi:play"></ha-icon></ha-icon-button>
                  ${p?K:Z`<ha-icon-button class="hm-del" .label=${"Remove from every mode"} title="Remove from every mode" @click=${()=>h(e)}>
                        <ha-icon icon="mdi:trash-can-outline"></ha-icon></ha-icon-button>`}
                </td>
              </tr>`)}</tbody>
            </table></div>
            ${a.length-m.length?Z`<div class="secondary hm-hint">${a.length-m.length} row${a.length-m.length===1?"":"s"} hidden: no shown mode runs ${a.length-m.length===1?"it":"them"}.</div>`:K}`:Z`<div class="secondary hm-hint">None yet. Unlock to edit, then <em>Add script</em> and tick the modes that run it.</div>`}
      </div>
    </details>`;}modeCell(e,t,s=!1){return t?Z`<ha-icon class="mode-ic ${s?"dim":""}" icon=${e.icon} style=${`color:${e.color||Ii(e.name)}`}></ha-icon>`:Z`<span class="mode-off" aria-hidden="true">·</span>`;}modeFilter(e,t){const s=qr[e],a=t=>{qr[e]=t,this.requestUpdate();};return Z`<div class="list-filters" style="padding-left:0">
      <span class="secondary" style="display:inline">Modes</span>
      ${t.map(e=>Z`<label class="list-filter" title=${e.name}>
        <input type="checkbox" .checked=${!s.has(e.id)} @change=${t=>{const i=new Set(s);t.target.checked?i.delete(e.id):i.add(e.id),a(i);}} /><ha-icon class="list-filter-ic" icon=${e.icon} style=${`color:${e.color||Ii(e.name)}`}></ha-icon>${e.name}</label>`)}
      ${s.size?Z`<button class="link" @click=${()=>a(new Set())}>Show all</button>`:Z`<button class="link" @click=${()=>a(new Set(t.map(e=>e.id)))}>Hide all</button>`}
    </div>`;}autoRows(){var e;const t=this.draft,s=e=>t.modes.find(t=>t.name.toLowerCase()===e.toLowerCase()),a=[];for(const i of(null===(e=this.actions)||void 0===e?void 0:e.items)||[]){if("automation"!==i.kind)continue;const e={};for(const t of i.sets||[]){const a=t.mode&&!t.template?s(t.mode):void 0;a&&(e[a.id]="sets");}Object.keys(e).length&&a.push({item:i,role:"trigger",modes:e});const n=i.reacts;if(!n)continue;const o={};for(const e of t.modes){const t=n.any||n.to.some(t=>t.toLowerCase()===e.name.toLowerCase()),s=n.any||n.from.some(t=>t.toLowerCase()===e.name.toLowerCase());(t||s)&&(o[e.id]=t&&s?"both":t?"enter":"leave");}Object.keys(o).length&&a.push({item:i,role:"action",modes:o});}return a.sort((e,t)=>e.role===t.role?e.item.name.localeCompare(t.item.name):"trigger"===e.role?-1:1);}renderByAutomation(){const e=this.draft;if(!e.modes.length)return K;const t=this.actions?this.autoRows():[],s=e.modes.filter(e=>!qr.byauto.has(e.id)),a=t.filter(e=>Object.keys(e.modes).some(e=>s.some(t=>t.id===e))),i=new Set(t.map(e=>e.item.entity_id)).size,n=t.filter(e=>"trigger"===e.role).length;return Z`<details class="collapse hm-tabsec" ?open=${!!Gr["*:byauto"]}
        @toggle=${e=>Gr["*:byauto"]=e.target.open}>
      <summary>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        <span class="collapse-title">Automations - All Modes</span>
        <span class="secondary" style="display:inline">${this.actions?`${i} automation${1===i?"":"s"} · ${n} trigger${1===n?"":"s"} · ${t.length-n} action${t.length-n===1?"":"s"}`:"loading…"}</span>
      </summary>
      <div class="collapse-body">
        <div class="secondary hm-hint" style="margin-top:0">Every Home Assistant automation that sets a House Mode (<em>Trigger</em>,
          from its actions) or runs when one starts or ends (<em>Action</em>, from its triggers), with a column per mode. A
          faded icon: it runs only when that mode ends. Read from the automations; change them in Home Assistant's editor
          (click a name). Automations that set the mode from a template are listed further down.</div>
        ${this.modeFilter("byauto",e.modes)}
        ${this.actions?t.length?Z`<div class="table-wrap"><table class="full sa-table">
                <thead><tr>
                  <th class="icon"></th><th>Automation</th><th>Role</th>
                  ${s.map(e=>Z`<th class="c mode" title=${e.name}><ha-icon icon=${e.icon}
                    style=${`color:${e.color||Ii(e.name)}`}></ha-icon></th>`)}
                  <th></th>
                </tr></thead>
                <tbody>${a.map(e=>{const t=Er(e.item);return Z`<tr>
                    <td class="icon">${Ea(this.hass,e.item.entity_id)}</td>
                    <td class="name">${t?Z`<button class="link" title="Open in Home Assistant's editor" @click=${()=>la(0,t)}>${e.item.name}</button>`:e.item.name}<span class="secondary">${e.item.entity_id}</span></td>
                    <td><span class="sa-when">${(e=>{var t;if("trigger"===e.role)return"Trigger · sets the mode";if(null===(t=e.item.reacts)||void 0===t?void 0:t.any)return"Action · every change";const s=Object.values(e.modes);return"Action · when it "+(s.every(e=>"leave"===e)?"ends":s.every(e=>"enter"===e)?"starts":"starts or ends");})(e)}</span></td>
                    ${s.map(t=>Z`<td class="c mode" title=${((e,t)=>{const s=e.modes[t.id];return s?"sets"===s?`${t.name}: sets it`:`${t.name}: runs when it ${"enter"===s?"starts":"leave"===s?"ends":"starts or ends"}`:`${t.name}: not used`;})(e,t)}>${this.modeCell(t,!!e.modes[t.id],"leave"===e.modes[t.id])}</td>`)}
                    <td class="row-actions">
                      <button class="hm-chip ${"on"===e.item.state?"en":""}" title=${"on"===e.item.state?"Enabled: click to disable":"Disabled: click to enable"}
                        @click=${()=>this.enableAutomation(e.item,"on"!==e.item.state)}>${"on"===e.item.state?"Enabled":"Disabled"}</button>
                      <ha-icon-button .label=${"Run now"} title="Run now" @click=${()=>this.runEntity(e.item.entity_id)}><ha-icon icon="mdi:play"></ha-icon></ha-icon-button>
                    </td>
                  </tr>`;})}</tbody>
              </table></div>
              ${t.length-a.length?Z`<div class="secondary hm-hint">${t.length-a.length} row${t.length-a.length===1?"":"s"} hidden: no shown mode uses ${t.length-a.length===1?"it":"them"}.</div>`:K}`:Z`<div class="secondary hm-hint">None: no automation sets a House Mode or has a trigger on one.</div>`:Z`<div class="secondary hm-hint">Loading…</div>`}
      </div>
    </details>`;}renderTemplated(){const e=this.actions?this.actions.items.filter(e=>(e.sets||[]).some(e=>e.template)):[];if(!e.length)return K;const t=e=>(e.sets||[]).filter(e=>e.template).reduce((e,t)=>e.concat(Pr(t,"the mode",[...Ti])),[]),s=e.filter(e=>t(e).length).length;return Z`<details class="collapse hm-tabsec" ?open=${!!Gr["*:templated"]}
        @toggle=${e=>Gr["*:templated"]=e.target.open}>
      <summary>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        <span class="collapse-title">Automations that set the mode from a template</span>
        <span class="secondary" style="display:inline">${s?Z`<ha-icon class="hm-warn-icon" icon="mdi:alert"></ha-icon>${s} of ${e.length} need a look`:`${e.length} automation${1===e.length?"":"s"} · no problems found`}</span>
      </summary>
      <div class="collapse-body">
        ${e.map(e=>{const s=(e.sets||[]).filter(e=>e.template);return Z`${this.autoLine(e,s.map(t=>zr(e,t)).join("; "))}
            ${t(e).map(e=>Z`<div class="hm-line-warn"><ha-icon icon="mdi:alert"></ha-icon>${e}</div>`)}`;})}
        <div class="secondary hm-hint">Which mode these set is only known when they run, so they are not listed under a mode's
          Triggers and their mode's Allowed Sources can't be checked here. A warning means the request bypasses House Modes or
          arrives without its source.</div>
      </div>
    </details>`;}renderEveryChange(){const e=this.actions?this.actions.items.filter(e=>e.reacts&&e.reacts.any):[];return e.length?Z`<details class="collapse hm-tabsec" ?open=${!!Gr["*:every"]}
        @toggle=${e=>Gr["*:every"]=e.target.open}>
      <summary>
        <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        <span class="collapse-title">Automations every change triggers</span>
        <span class="secondary" style="display:inline">${e.length} automation${1===e.length?"":"s"}</span>
      </summary>
      <div class="collapse-body">${e.map(e=>this.autoLine(e,"on every House Mode change"))}</div>
    </details>`:K;}renderSettingsRow(){var e;const t=this.draft,s=Object.keys(this.hass.states).filter(e=>e.startsWith("input_select.")).sort(),a=Object.keys(this.hass.states).filter(e=>/^(input_select|input_text)\./.test(e)).sort(),i=Object.keys(this.hass.services.notify||{}).map(e=>({value:`notify.${e}`,label:`notify.${e}`})),n=t.input_select&&(null===(e=this.hass.states[t.input_select])||void 0===e?void 0:e.attributes.options)||[],o=t.modes.map(e=>e.name).filter(e=>!n.some(t=>t.toLowerCase()===e.toLowerCase())),r=(e,t,s,a)=>Z`<select aria-label=${a} @change=${e=>s(e.target.value||null)}>
        <option value="" ?selected=${!e}>none</option>
        ${t.map(t=>Z`<option value=${t} ?selected=${e===t}>${this.hass.states[t].attributes.friendly_name||t} (${t})</option>`)}
      </select>`,l=(e,t,s,a)=>Z`<div class="hm-row">
        <ha-icon class="hm-row-icon" icon=${e}></ha-icon>
        <div class="hm-row-label"><strong>${t}</strong><span class="secondary">${s}</span></div>
        <div class="hm-row-ctl">${a}</div>
      </div>`,c=[t.input_select,t.current_entity,t.previous_entity].filter(Boolean).length,d=(t.notify_services||[]).length;return this.tabSec("helpers","Helpers and notifications",`${c} of 3 helpers · ${d} notify service${1===d?"":"s"}${t.notify_changes?" · every change":""}`,!1,Z`
      <div class="hm-rows">
        ${l("mdi:form-dropdown","House Mode selector","Your input_select that people and automations change. Kept in step both ways; its options must match the mode names.",Z`${r(t.input_select,s,e=>this.set(t=>t.input_select=e),"House Mode selector")}
            ${t.input_select&&t.modes.length?o.length?Z`<div class="notice warn" style="margin:6px 0 0">Missing options on ${t.input_select}: ${o.join(", ")}.</div>`:Z`<div class="secondary hm-ok"><ha-icon icon="mdi:check-circle"></ha-icon>Its options match the ${t.modes.length} modes.</div>`:K}`)}
        ${l("mdi:home-outline","Current House Mode","Optional. Live writes the mode name here after each change; Shadow compares it with what House Modes would have set.",r(t.current_entity,a,e=>this.set(t=>t.current_entity=e),"Current House Mode"))}
        ${l("mdi:history","Previous House Mode","Optional. Live writes the mode it changed from here.",r(t.previous_entity,a,e=>this.set(t=>t.previous_entity=e),"Previous House Mode"))}
        ${l("mdi:bell-outline","Notifications","Where House Mode messages go: blocked, failed to arm, timers, and every change if you tick it.",Z`<hm-multi-picker
            .placeholder=${"Add a notify service…"}
            .options=${i}
            .value=${t.notify_services||[]}
            @value-changed=${e=>this.set(t=>t.notify_services=e.detail.value)}
          ></hm-multi-picker>
          <label class="hm-check"><input type="checkbox" .checked=${!!t.notify_changes}
              @change=${e=>this.set(t=>t.notify_changes=e.target.checked)} />
            Notify on every change <span class="secondary" style="display:inline">e.g. "House Mode: Stay — from Disarmed · timer"</span></label>
          ${t.notify_changes?Z`<div class="hm-skip"><span class="secondary" style="display:inline">Not for changes by:</span>
                ${[...Ti,"external"].map(e=>{const s=(t.notify_skip_sources||[]).includes(e);return Z`<button class="hm-chip ${s?"on":""}" aria-pressed=${s} title=${s?"Not notified":"Notified"}
                    @click=${()=>this.set(t=>t.notify_skip_sources=s?(t.notify_skip_sources||[]).filter(t=>t!==e):[...(t.notify_skip_sources||[]),e])}>
                    ${"external"===e?"Outside House Modes":zi[e]}</button>`;})}</div>`:K}
          ${t.notify_changes&&!(t.notify_services||[]).length?Z`<div class="notice warn" style="margin:6px 0 0">Add a notify service, or nothing is sent.</div>`:K}`)}
      </div>
      <div class="secondary" style="margin:0 16px 12px">Lock keypads and per-user keypad actions are on the
        <a href="/house_modes/codes">Users, Codes, Keypads</a> tab.</div>
    `);}async save(){this.busy=!0,this.error="";try{await(e=this.hass,t=this.draft,e.callWS({type:"house_modes/ext/house/save",settings:t})),_a(this,"House Modes saved."),await this.refresh(!0);}catch(e){this.error=ba(e);}finally{this.busy=!1;}var e,t;}};Kr.styles=[ka,h`
      .hm-sub {
        padding: 12px 16px 0;
        border-top: 1px solid var(--divider-color);
        margin-top: 8px;
        color: var(--accent-color);
        font-weight: 600;
        font-size: 13px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .hm-rows {
        padding: 4px 16px 8px;
      }
      .hm-row {
        display: grid;
        grid-template-columns: 28px minmax(200px, 340px) minmax(240px, 520px);
        gap: 6px 14px;
        align-items: start;
        padding: 10px 0;
        border-bottom: 1px solid var(--divider-color);
      }
      .hm-row:last-child {
        border-bottom: none;
      }
      .hm-row-icon {
        color: var(--primary-color);
        --mdc-icon-size: 22px;
        padding-top: 2px;
      }
      .hm-row-label {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .hm-row-ctl select {
        width: 100%;
      }
      .hm-ok {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-top: 6px;
      }
      .hm-ok ha-icon {
        --mdc-icon-size: 16px;
        color: var(--success-color, #4caf50);
      }
      .hm-check {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
        margin-top: 10px;
      }
      .hm-skip {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
        margin-top: 8px;
      }
      .hm-chip {
        border: 1px solid var(--divider-color);
        border-radius: 14px;
        padding: 2px 10px;
        background: none;
        color: var(--primary-text-color);
        font: inherit;
        font-size: 13px;
        cursor: pointer;
      }
      .hm-chip.on {
        border-color: var(--accent-color);
        color: var(--accent-color);
        text-decoration: line-through;
      }
      details.collapse.hm-tabsec {
        margin: 8px 16px 12px;
      }
      .hm-tabsec-body {
        padding: 0 0 8px;
      }
      .hm-desc {
        padding-top: 8px;
      }
      .hm-tabsec-body .hm-rows {
        padding: 4px 12px 8px;
      }
      .hm-status-line {
        padding: 0 16px 12px;
      }
      .hm-status {
        margin-top: 10px;
      }
      .notice .hm-status {
        margin-top: 12px;
      }
      .hm-counts {
        display: block;
      }
      .hm-noswitch {
        visibility: hidden;
      }
      /* the open mode: an accent outline, not an indent (CARD_DESIGN_SYSTEM) */
      tr.hm-detail td {
        background: none;
        padding: 0 8px 12px;
      }
      .hm-ed {
        border: 1px solid var(--accent-color);
        border-radius: 10px;
        padding: 8px 4px 4px;
      }
      .hm-ed details.collapse.sub {
        margin: 0 8px 8px;
      }
      details.collapse.sub[open] {
        border-color: var(--accent-color);
      }
      .hm-every {
        margin: 4px 16px 12px !important;
      }
      .hm-fields {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 0 8px 8px;
      }
      .hm-sec .hm-fields {
        padding: 0 0 4px;
      }
      .hm-f {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        padding: 2px 0;
      }
      .hm-f input[type='text'] {
        flex: 1 1 220px;
        max-width: 420px;
        min-width: 0;
      }
      .hm-hint {
        display: block;
        margin: 6px 0 2px;
      }
      .hm-add {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        border: 1px dashed var(--primary-color);
        border-radius: 6px;
        background: none;
        color: var(--primary-color);
        font: inherit;
        font-size: 13px;
        padding: 3px 10px;
        margin: 0 0 6px;
        cursor: pointer;
      }
      .hm-add[disabled] {
        opacity: 0.5;
        cursor: default;
      }
      .hm-add ha-icon {
        --mdc-icon-size: 16px;
      }
      .hm-item,
      .hm-line {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 6px 0;
        border-top: 1px solid var(--divider-color);
      }
      .hm-item-icon {
        color: var(--primary-color);
        margin: 0 8px;
      }
      .hm-item-body {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px 16px;
        flex: 1 1 auto;
        min-width: 0;
      }
      .hm-item-body label {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .hm-item-actions {
        display: flex;
        align-items: center;
        flex: none;
      }
      .hm-del:hover {
        color: var(--error-color);
      }
      .hm-line-name {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex: 1 1 auto;
        min-width: 0;
      }
      .hm-group {
        color: var(--accent-color);
        font-weight: 500;
        font-size: 14px;
        margin: 8px 0 2px;
      }
      .hm-group:first-child {
        margin-top: 0;
      }
      .hm-warn-icon {
        --mdc-icon-size: 16px;
        color: var(--warning-color, #ff9800);
        margin-right: 4px;
        vertical-align: -2px;
      }
      .hm-line-warn {
        display: flex;
        align-items: flex-start;
        gap: 6px;
        color: var(--warning-color, #ff9800);
        font-size: 13px;
        padding: 0 0 6px 44px;
      }
      .hm-line-warn ha-icon {
        --mdc-icon-size: 16px;
        flex: none;
      }
      .hm-warn {
        margin: 0 0 8px !important;
      }
      .sa-table th.mode,
      .sa-table td.mode {
        width: 34px;
        padding-left: 2px;
        padding-right: 2px;
      }
      .sa-table th.mode ha-icon {
        --mdc-icon-size: 20px;
      }
      .sa-table td select {
        max-width: 240px;
      }
      .sa-when {
        white-space: nowrap;
      }
      .hm-modes {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      .hm-chip.en {
        border-color: var(--primary-color);
        color: var(--primary-color);
        text-decoration: none;
      }
      @media (max-width: 760px) {
        .hm-row {
          grid-template-columns: 28px 1fr;
        }
        .hm-row-ctl {
          grid-column: 2;
        }
      }
    `],i([ye({attribute:!1})],Kr.prototype,"hass",void 0),i([ye({type:Boolean})],Kr.prototype,"narrow",void 0),i([ye({attribute:!1})],Kr.prototype,"path",void 0),i([be()],Kr.prototype,"actions",void 0),i([be()],Kr.prototype,"info",void 0),i([be()],Kr.prototype,"draft",void 0),i([be()],Kr.prototype,"open",void 0),i([be()],Kr.prototype,"error",void 0),i([be()],Kr.prototype,"busy",void 0),i([be()],Kr.prototype,"lastBlocked",void 0),i([be()],Kr.prototype,"detect",void 0),i([be()],Kr.prototype,"detectPick",void 0),i([be()],Kr.prototype,"detecting",void 0),i([be()],Kr.prototype,"pendingGroups",void 0),Kr=i([me("hm-view-house")],Kr);const Jr=[{id:"general",view:"general",section:"general",titleKey:"panels.general.title"},{id:"house",view:"house",titleKey:"panels.house.title"},{id:"actions",view:"actions",section:"actions",titleKey:"panels.actions.title"},{id:"partitions",view:"general",section:"partitions",titleKey:"panels.partitions.title"},{id:"zones",view:"sensor_table",titleKey:"panels.zones.title"},{id:"codes",view:"codes",titleKey:"panels.users_codes.title"},{id:"notifications",view:"actions",section:"notifications",titleKey:"panels.notifications.title"},{id:"panel",view:"panel",titleKey:"panels.panel.title"},{id:"activity",view:"activity",titleKey:"panels.activity.title"},{id:"backup",view:"backup",titleKey:"panels.backup.title"}],Xr={sensors:"zones",zones_legacy:"zones",why:"activity",house_actions:"house",sensor_table:"zones",mirrors:"panel",connections:"codes",ha_zones:"panel",modes:"partitions"},Qr=(e,t,s={})=>{const a=e||"general";return a in Xr?Jr.find(e=>e.id===Xr[a]):"general"===a&&s.edit_area?Jr.find(e=>"partitions"===e.id):"general"===a&&"mqtt_configuration"===t?Jr.find(e=>"backup"===e.id):"actions"===a?"new_notification"===t||s.edit_notification?Jr.find(e=>"notifications"===e.id):Jr.find(e=>"actions"===e.id):Jr.find(e=>e.id===a);},el=(e,t={})=>!!e||Object.values(t).some(e=>void 0!==e),tl={disarmed:"mdi:shield-off-outline",armed_away:"mdi:shield-lock",armed_home:"mdi:shield-home",armed_night:"mdi:shield-moon",armed_vacation:"mdi:shield-airplane",armed_custom_bypass:"mdi:shield-half-full",arming:"mdi:shield-sync",pending:"mdi:shield-alert-outline",triggered:"mdi:bell-ring"},sl=e=>(e||"unknown").replace(/_/g," ");let al=class extends pe{constructor(){super(...arguments),this.load=async()=>{try{this.info=await(e=this.hass,e.callWS({type:"house_modes/ext/status"}));}catch(e){}var e;};}connectedCallback(){super.connectedCallback(),this.load(),this.timer=window.setInterval(()=>this.load(),15e3),window.addEventListener("hm-ui-changed",this.load);}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this.timer),window.removeEventListener("hm-ui-changed",this.load);}go(e){la(0,e),window.setTimeout(this.load,1500);}chip(e,t,s,a,i=""){return Z`<button class="chip ${i}" title=${s} @click=${()=>this.go(a)}>
      <ha-icon icon=${e}></ha-icon><span>${t}</span>
    </button>`;}render(){const e=this.info;if(!e)return K;const t=e=>e?this.hass.states[e]:void 0,s=(()=>{try{return!!window.sessionStorage.getItem(bo);}catch(e){return!1;}})();return Z`
      <div class="strip" role="status" aria-label="Alarm system status">
        ${e.house.enabled?this.chip(e.house.icon||"mdi:home",`House Mode: ${e.house.name||"unknown"}${e.house.shadow?" · shadow":""}`,`Changed by ${e.house.source||"—"}`,"/house_modes/house"):K}
        ${e.alarms.map(e=>{var s;const a=null===(s=t(e.entity_id))||void 0===s?void 0:s.state,i="triggered"===a?"bad":"pending"===a||"arming"===a?"warn":a&&"disarmed"!==a?"on":"";return this.chip(tl[a||""]||"mdi:shield-outline",`${e.name}: ${sl(a)}`,e.entity_id,"/house_modes/activity/arm_check",i);})}
        ${e.links.map(e=>{const s=t(e.panel_entity),a=t(e.ready_entity),i=(null==s?void 0:s.attributes.friendly_name)||e.panel_entity,n=a?"on"===a.state?" · ready":" · not ready":"",o=e.running||"off"===e.mode?"live"===e.mode?"on":"":"bad";return this.chip("mdi:alarm-panel-outline",`${i}: ${sl(null==s?void 0:s.state)}${n} · ${e.mode}`,`Physical panel link (${e.running?"running":"not running"})`,"/house_modes/panel",o);})}
        ${e.alarmo_enabled?this.chip("mdi:alert","Alarmo is still enabled","Disable the Alarmo integration: the two must never run together. Until then the panel link stays in Shadow.","/house_modes/backup","warn"):K}
        ${e.rules_pending?this.chip("mdi:auto-fix",`${e.rules_pending} zone rule change(s) pending`,"Review on Zones","/house_modes/zones","warn"):K}
        ${s?this.chip("mdi:pencil-circle","Unsaved zone edits","Zones has unsaved changes","/house_modes/zones","warn"):K}
        <span class="grow"></span>
        ${this.chip("mdi:help-circle-outline","Why won't it arm?","What blocks arming right now","/house_modes/activity/arm_check")}
      </div>
    `;}};al.styles=h`
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
  `,i([ye({attribute:!1})],al.prototype,"hass",void 0),i([be()],al.prototype,"info",void 0),al=i([me("hm-status-strip")],al);const il={armed_away:"Away",armed_home:"Home (Stay)",armed_night:"Night",armed_vacation:"Vacation",armed_custom_bypass:"Custom"},nl={open:"var(--warning-color, #ffa600)",closed:"var(--success-color, #43a047)",unavailable:"var(--error-color, #f44336)",unknown:"var(--secondary-text-color)"};let ol=class extends pe{constructor(){super(...arguments),this.narrow=!1,this.error="",this.sensors={},this.areas={},this.walkArea="",this.walking=!1,this.walk={},this.walkOpen=!1,this.lastStates={};}firstUpdated(){this.load();}disconnectedCallback(){super.disconnectedCallback(),window.clearTimeout(this.refreshTimer);}async load(){try{const[t,s,a]=await Promise.all([(e=this.hass,e.callWS({type:"house_modes/ext/why"})),ke(this.hass),Le(this.hass)]);this.why=t,this.sensors=s,this.areas=a,this.walkArea||(this.walkArea=Object.keys(a)[0]||""),this.error="";}catch(e){this.error=ba(e);}var e;}name(e){var t;return(null===(t=this.hass.states[e])||void 0===t?void 0:t.attributes.friendly_name)||e;}updated(e){var t,s,a;if(!e.has("hass")||!this.hass)return;const i=[...Object.keys(this.sensors),...((null===(t=this.why)||void 0===t?void 0:t.areas.map(e=>e.entity_id))||[]),...((null===(s=this.why)||void 0===s?void 0:s.panels.map(e=>e.ready_entity||""))||[])];let n=!1;for(const e of i){const t=null===(a=this.hass.states[e])||void 0===a?void 0:a.state;t!==this.lastStates[e]&&(this.walking&&e in this.sensors&&(this.walk=wo(this.walk,e,t)),this.lastStates[e]=t,n=!0);}n&&this.why&&(window.clearTimeout(this.refreshTimer),this.refreshTimer=window.setTimeout(()=>this.load(),800));}render(){return Z`
      ${this.error?Z`<div class="notice error" style="margin:0 0 12px">${this.error}</div>`:K}
      ${this.renderWhy()} ${this.renderWalk()}
    `;}renderWhy(){const e=this.why;return Z`
      <ha-card>${Sa("Why won't it arm?","readonly")}
        <div class="card-content desc">
          <p>The alarm's own check, live: for each partition and Arm Mode, the zones that would stop it from arming now.</p>
          <ul>
            <li>Zones with <em>Use exit delay</em> may be open when you start arming, but must be closed when the exit delay
              ends.</li>
            <li>Open motion zones do not count while disarmed (the alarm ignores them for "ready").</li>
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
                        <td>${il[e.mode]||e.mode}</td>
                        <td>${e.ready?Z`<ha-icon icon="mdi:check-circle" style="color:var(--success-color,#43a047)" title="Ready"></ha-icon>`:Z`<ha-icon icon="mdi:close-circle" style="color:var(--error-color,#f44336)" title="Not ready"></ha-icon>`}</td>
                        <td style="white-space:normal">${e.blocking.length?e.blocking.map(t=>Z`<div class="blk">${Ea(this.hass,t.entity_id)} ${this.name(t.entity_id)}
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
                    </table></div>`:K}
            `:Z`<div class="empty">Checking…</div>`}
      </ha-card>
    `;}walkZones(){return Object.values(this.sensors).filter(e=>e.area===this.walkArea&&e.enabled).map(e=>e.entity_id).sort((e,t)=>this.name(e).localeCompare(this.name(t)));}startWalk(){this.walk={},this.walkZones().forEach(e=>{var t;return this.walk=Object.assign(Object.assign({},this.walk),{[e]:{opened:!1,closed:!1,last:null===(t=this.hass.states[e])||void 0===t?void 0:t.state}});}),this.walking=!0;}renderWalk(){var e;const t=this.walkZones(),s=t.filter(e=>!this.sensors[e].always_on),a=t.filter(e=>this.sensors[e].always_on),i=null===(e=this.why)||void 0===e?void 0:e.areas.find(e=>e.area_id===this.walkArea),n=!i||"disarmed"===i.state,o=((e,t)=>{const s=t.filter(t=>ko(e[t])).length,a=t.filter(t=>e[t]&&e[t].opened&&!e[t].closed).length;return{passed:s,open:a,left:t.length-s,total:t.length};})(this.walk,s);return Z`
      <ha-card>${Sa("Walk test","readonly")}
        <details class="collapse" ?open=${this.walking||this.walkOpen} @toggle=${e=>this.walkOpen=e.target.open}>
          <summary>
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <span class="collapse-title">Run a walk test</span>
            ${this.walking||o.passed?Z`<span class="role">${o.passed} of ${o.total} passed</span>`:K}
            <span class="secondary" style="display:inline">open and close each zone to check it reports</span>
          </summary>
          <div class="collapse-body">
        <div class="card-content desc">
          <p>Checks that every zone reports to Home Assistant: open and close each one (walk past each motion zone), and
            it ticks off. Nothing is armed and nothing is changed.</p>
          <ul>
            <li>Run it with the partition <strong>disarmed</strong>. <em>Always on</em> zones (fire, 24-hour) would raise the
              alarm even then, so they are left out.</li>
            <li>The physical panel still reacts to its own zones. If it would sound, put it in its own test mode first
              (Vista: usually code + 5 at the keypad — check your panel's manual).</li>
          </ul>
        </div>
        <div class="toolbar">
          ${this.walking?Z`<ha-button @click=${()=>this.walking=!1}><ha-icon slot="start" icon="mdi:stop"></ha-icon>Stop</ha-button>
                <ha-button appearance="plain" @click=${this.startWalk}>Start over</ha-button>`:Z`<ha-button ?disabled=${!s.length||!n} @click=${this.startWalk}><ha-icon slot="start" icon="mdi:walk"></ha-icon>Start walk test</ha-button>`}
          <label>Partition
            <select ?disabled=${this.walking} @change=${e=>this.walkArea=e.target.value}>
              ${Object.values(this.areas).map(e=>Z`<option value=${e.area_id} ?selected=${e.area_id===this.walkArea}>${e.name}</option>`)}
            </select>
          </label>
          ${n?K:Z`<span class="secondary" style="display:inline;color:var(--warning-color,#ffa600)">Disarm the partition first.</span>`}
          ${this.walking||o.passed?Z`<strong>${o.passed} of ${o.total} passed</strong>${o.open?Z`<span class="secondary" style="display:inline">· ${o.open} open now</span>`:K}`:K}
        </div>
        ${s.length?Z`<div class="table-wrap"><table>
              <thead><tr><th class="icon"></th><th>Zone</th><th>Now</th><th class="c">Opened</th><th class="c">Closed again</th></tr></thead>
              <tbody>${s.map(e=>{var t;const s=this.walk[e],a=_o(null===(t=this.hass.states[e])||void 0===t?void 0:t.state),i=e=>e?Z`<ha-icon icon="mdi:check-circle" style="color:var(--success-color,#43a047)"></ha-icon>`:Z`<ha-icon icon="mdi:circle-outline" style="color:var(--disabled-text-color,#9e9e9e)"></ha-icon>`;return Z`<tr class=${ko(s)?"passed":""}>
                  <td class="icon">${Ea(this.hass,e)}</td>
                  <td class="name">${this.name(e)}<span class="secondary">${e}</span></td>
                  <td><span style=${`color:${nl[a]}`}>${a}</span></td>
                  <td class="c">${i(null==s?void 0:s.opened)}</td>
                  <td class="c">${i(null==s?void 0:s.closed)}</td>
                </tr>`;})}</tbody>
            </table></div>`:Z`<div class="empty">No enabled zones in this partition.</div>`}
        ${a.length?Z`<div class="secondary" style="padding:0 16px 12px">Left out (always on): ${a.map(e=>this.name(e)).join(", ")}.</div>`:K}
          </div>
        </details>
      </ha-card>
    `;}};ol.styles=ka,i([ye({attribute:!1})],ol.prototype,"hass",void 0),i([ye({type:Boolean})],ol.prototype,"narrow",void 0),i([ye({attribute:!1})],ol.prototype,"path",void 0),i([be()],ol.prototype,"why",void 0),i([be()],ol.prototype,"error",void 0),i([be()],ol.prototype,"sensors",void 0),i([be()],ol.prototype,"areas",void 0),i([be()],ol.prototype,"walkArea",void 0),i([be()],ol.prototype,"walking",void 0),i([be()],ol.prototype,"walk",void 0),i([be()],ol.prototype,"walkOpen",void 0),ol=i([me("hm-view-why")],ol);const rl=e=>e.callWS({type:"house_modes/ext/activity/get"}),ll=(e,t)=>e.callWS({type:"house_modes/ext/activity/day",day:t}),cl=/fail|error|not allowed|differ|could not/i,dl={house:"mdi:home-switch",alarm:"mdi:shield-home",panel:"mdi:alarm-panel-outline",keypad:"mdi:dialpad",lock:"mdi:lock-smart",bypass:"mdi:debug-step-over",zone:"mdi:door",helper:"mdi:toggle-switch-outline",automation:"mdi:robot",command:"mdi:send",notify:"mdi:bell-ring-outline",link:"mdi:link-variant",event:"mdi:flash-outline"},hl=e=>new Date(1e3*e).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"});let pl=class extends pe{constructor(){super(...arguments),this.narrow=!1,this.day="",this.dayTo="",this.loadingDays=!1,this.seqs=[],this.kinds=[],this.onlyProblems=!1,this.search="",this.error="",this.panelLog=[],this.shadowAll=!1,this.shadowOpen=!1,this.seqOpen=!1,this.downloadShown=async()=>{const e=this.shownDays,t=[];for(const s of[...e].reverse()){[...(await ll(this.hass,s)).sequences].reverse().forEach(e=>t.push(JSON.stringify(e)));}const s=e.length>1?`${e[e.length-1]}_to_${e[0]}`:e[0];fa(`house_modes_activity_${s}.jsonl`,t.join("\n")+"\n","application/x-ndjson"),_a(this,`${t.length} sequence(s) from ${e.length} day(s) downloaded.`);},this.downloadAll=async()=>{const e=[];for(const t of[...this.info.days].reverse()){[...(await ll(this.hass,t)).sequences].reverse().forEach(t=>e.push(JSON.stringify(t)));}fa(`house_modes_activity_${this.info.days[this.info.days.length-1]}_to_${this.info.days[0]}.jsonl`,e.join("\n")+"\n","application/x-ndjson"),_a(this,`${e.length} sequence(s) downloaded.`);};}connectedCallback(){super.connectedCallback(),this.timer=window.setInterval(()=>this.loadOpen(),5e3);}disconnectedCallback(){super.disconnectedCallback(),window.clearInterval(this.timer);}firstUpdated(){this.load();}async load(){try{this.info=await rl(this.hass),this.draft=JSON.parse(JSON.stringify(this.info.settings));const t=new Date(),s=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;this.day||(this.day=this.dayTo=this.info.days[0]||s),await this.loadDay();const[a,i]=await Promise.all([(e=this.hass,e.callWS({type:"house_modes/ext/panel/log"})).catch(()=>({log:[]})),Di(this.hass).catch(()=>{})]);this.panelLog=[...a.log].reverse(),this.house=i,i&&"shadow"===Ni(i.settings)&&this.loadShadow(),this.error="";}catch(e){this.error=ba(e);}var e;}async loadOpen(){if(this.info)try{const e=await rl(this.hass),t=this.info.open&&(!e.open||e.open.id!==this.info.open.id);this.info=Object.assign(Object.assign({},e),{settings:this.info.settings}),t&&(await this.loadDay());}catch(e){}}get shownDays(){var e;const t=((e,t,s)=>{const[a,i]=t<=s?[t,s]:[s,t];return e.filter(e=>e>=a&&e<=i);})((null===(e=this.info)||void 0===e?void 0:e.days)||[],this.day,this.dayTo||this.day);return t.length?t:[this.day];}async loadDay(){this.loadingDays=!0;try{const e=await Promise.all(this.shownDays.map(e=>ll(this.hass,e)));this.seqs=[].concat(...e.map(e=>e.sequences)),this.summary=(e=>{const t={sequences:0,starters:{},failures:0,panel_latency:{}};for(const s of e){t.sequences+=s.sequences,t.failures+=s.failures;for(const[e,a]of Object.entries(s.starters))t.starters[e]=(t.starters[e]||0)+a;for(const[e,a]of Object.entries(s.panel_latency)){const s=t.panel_latency[e];if(s){const i=s.n+a.n;t.panel_latency[e]={n:i,avg:Math.round((s.avg*s.n+a.avg*a.n)/i*10)/10,max:Math.max(s.max,a.max)};}else t.panel_latency[e]=Object.assign({},a);}}return t;})(e.map(e=>e.summary));}finally{this.loadingDays=!1;}}async setDays(e,t){this.day=e,this.dayTo=t,await this.loadDay();}resetFilters(){var e;const t=(null===(e=this.info)||void 0===e?void 0:e.days)||[];this.kinds=[],this.search="",this.onlyProblems=!1,t.length&&this.setDays(t[t.length-1],t[0]);}get dirty(){return!!this.info&&JSON.stringify(this.info.settings)!==JSON.stringify(this.draft);}async save(){try{await(e=this.hass,t=this.draft,e.callWS({type:"house_modes/ext/activity/settings",settings:t})),_a(this,"Activity settings saved."),await this.load();}catch(e){this.error=ba(e);}var e,t;}render(){return this.info?Z`
      ${this.error?Z`<div class="notice error" style="margin:0 0 12px">${this.error}</div>`:K}
      <ha-card>
        ${this.renderHeader()}
        ${this.renderSequences()} ${this.renderArmCheck()} ${this.renderShadow()} ${this.renderSettings()} ${this.renderPanelLog()} ${this.renderHouseHistory()}
      </ha-card>
    `:Z`<ha-card><div class="empty">${this.error||"Loading…"}</div></ha-card>`;}renderShadow(){if(!this.house||"shadow"!==Ni(this.house.settings))return K;const e=this.shadow,t=e?[...e.log].reverse():[],s=this.shadowAll?t:t.slice(0,30);return Z`
        <details class="collapse act-sec" ?open=${this.shadowOpen}
          @toggle=${e=>this.shadowOpen=e.target.open}>
          <summary>
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <span class="collapse-title">Shadow comparison</span>
            <span class="secondary" style="display:inline">${e?`${e.summary.matched} matched · ${e.summary.differed} differed${e.summary.watching?" · watching a change…":""}`:"loading…"}</span>
          </summary>
          <div class="collapse-body">
            <p>What House Modes would have done, next to what your automations did:</p>
            <ul>
              <li><strong>✓</strong> your automations ended where House Modes would have;</li>
              <li><strong>✗</strong> they differ: read the line, then fix the House Mode or your automation.</li>
            </ul>
            <p class="secondary">The same lines are in the sequences below, marked <em>[shadow]</em>. This list starts again after a restart.</p>
            <div class="toolbar" style="padding-left:0">
              <ha-button appearance="plain" @click=${()=>this.loadShadow()}><ha-icon slot="start" icon="mdi:refresh"></ha-icon>Refresh</ha-button>
            </div>
            ${s.length?Z`<div class="table-wrap"><table class="full">
                  <tbody>
                    ${s.map(e=>{return Z`<tr>
                        <td style="width:28px">${t=e.ok,!0===t?Z`<ha-icon icon="mdi:check-circle" style="color:var(--success-color,#4caf50)"></ha-icon>`:!1===t?Z`<ha-icon icon="mdi:alert-circle" style="color:var(--error-color)"></ha-icon>`:Z`<ha-icon icon="mdi:information-outline" style="color:var(--secondary-text-color)"></ha-icon>`}</td>
                        <td style="white-space:nowrap" class="secondary">${new Date(1e3*e.t).toLocaleString()}</td>
                        <td>${e.msg}</td>
                      </tr>`;var t;})}
                  </tbody>
                </table></div>
                ${t.length>30&&!this.shadowAll?Z`<div class="toolbar"><button class="link" @click=${()=>this.shadowAll=!0}>Show all ${t.length}</button></div>`:K}`:Z`<div class="empty">Nothing yet. Lines appear when the House Mode is requested or the partitions change.</div>`}
          </div>
        </details>
    `;}async loadShadow(){var e;this.shadow=await(e=this.hass,e.callWS({type:"house_modes/ext/house/shadow"})).catch(()=>{});}renderArmCheck(){var e,t;const s="arm_check"===(null===(e=this.path)||void 0===e?void 0:e.subpage)||"why"===(null===(t=this.path)||void 0===t?void 0:t.page);return Z`
        <details class="collapse act-sec" ?open=${s}>
          <summary>
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <span class="collapse-title">Arm Check</span>
            <span class="secondary" style="display:inline">why won't it arm · walk test</span>
          </summary>
          <div class="collapse-body arm-check">
            <hm-view-why .hass=${this.hass} .narrow=${this.narrow} .path=${this.path}></hm-view-why>
          </div>
        </details>
    `;}renderHeader(){const e=this.info;return Z`${Sa("Activity","readonly")}
        <div class="card-content desc">
          <p>Everything around House Modes, the alarm, the physical panel, locks and bypasses, grouped into <em>sequences</em>:
            a sequence starts with a House Mode helper change, a lock keypad use, an alarm or panel change, the BYPASS
            indicator or an alarm, and collects everything that follows until nothing happens for
            ${e.settings.window_s} s. Each entry shows the time since the start and, where known, what caused it.</p>
          <p>It only records — it never changes anything. Codes are never recorded.</p>
        </div>
        <div class=${"notice "+(e.last_error||e.settings.enabled&&!e.running?"error":"")} style="margin:0 16px 12px">
          ${e.settings.enabled?e.running?Z`<span class="rec on"><ha-icon icon="mdi:record-circle"></ha-icon>RECORDING ENABLED</span> · ${Object.keys(e.watched||{}).length} entities watched ·
                  ${e.open?Z`a sequence is open now (started ${hl(e.open.start)})`:"waiting for the next sequence"} ·
                  ${e.last_write?Z`last saved ${new Date(1e3*e.last_write).toLocaleString()}`:"nothing saved since Home Assistant started"}`:Z`<strong>The recorder is not running.</strong> Check Settings → System → Logs for "house_modes" or "Activity recorder".`:Z`<span class="rec off"><ha-icon icon="mdi:record-circle-outline"></ha-icon>RECORDING OFF</span>
                <span class="secondary" style="display:inline">· turn it on under Recording settings below</span>`}
          ${e.last_error?Z`<div><strong>Error:</strong> ${e.last_error}</div>`:K}
        </div>
    `;}renderSequences(){const e=this.info,t=e=>((e,t,s,a)=>{if(t.length&&!e.kinds.some(e=>t.includes(e)))return!1;if(s&&!e.entries.some(e=>cl.test(e.text)||"error"===e.level))return!1;const i=a.trim().toLowerCase();return!(i&&!e.title.toLowerCase().includes(i)&&!e.entries.some(e=>e.text.toLowerCase().includes(i)||(e.cause||"").toLowerCase().includes(i)));})(e,this.kinds,this.onlyProblems,this.search),s=this.seqs.filter(t),a=Object.keys(e.kinds),i=e.days.length?e.days:[this.day],[n,o]=this.day<=(this.dayTo||this.day)?[this.day,this.dayTo||this.day]:[this.dayTo,this.day],r=(e,t,s)=>{const a=n===t&&o===s;return Z`<button class="chip-cell kind-chip ${a?"on":""}" style="--chip:var(--primary-color)" aria-pressed=${a}
        @click=${()=>this.setDays(t,s)}>${e}</button>`;},l=!(i.length>0&&n===i[i.length-1]&&o===i[0])||this.kinds.length>0||!!this.search||this.onlyProblems;return Z`
        <details class="collapse act-sec" ?open=${this.seqOpen} @toggle=${e=>this.seqOpen=e.target.open}>
          <summary>
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <span class="collapse-title">Sequences</span>
            <span class="secondary" style="display:inline">${this.rangeLabel()} · ${s.length} sequence${1===s.length?"":"s"}${e.open?" · one open now":""}</span>
          </summary>
          <div class="collapse-body">
        <div class="toolbar">
          <label>From
            <select aria-label="From day" @change=${e=>this.setDays(e.target.value,this.dayTo)}>
              ${i.map(e=>Z`<option value=${e} ?selected=${e===n}>${e}</option>`)}
            </select></label>
          <label>to
            <select aria-label="To day" @change=${e=>this.setDays(this.day,e.target.value)}>
              ${i.map(e=>Z`<option value=${e} ?selected=${e===o}>${e}</option>`)}
            </select></label>
          <span class="act-quick">
            ${r("Latest day",i[0],i[0])}
            ${i.length>1?r("Last 7 days",i[Math.min(6,i.length-1)],i[0]):K}
            ${i.length>1?r("All days",i[i.length-1],i[0]):K}
          </span>
          ${this.loadingDays?Z`<span class="secondary" style="display:inline">loading…</span>`:K}
        </div>
        <div class="toolbar" style="padding-top:0">
          <input type="search" placeholder="Search" aria-label="Search" .value=${this.search} @input=${e=>this.search=e.target.value} />
          <label><input type="checkbox" .checked=${this.onlyProblems} @change=${e=>this.onlyProblems=e.target.checked} /> Only problems</label>
          <button class="link" ?disabled=${!l} title="All days, all kinds, no search" @click=${()=>this.resetFilters()}>Reset filters</button>
          <span class="grow"></span>
          <ha-button appearance="plain" @click=${()=>this.load()}><ha-icon slot="start" icon="mdi:refresh"></ha-icon>Refresh</ha-button>
          <ha-button appearance="plain" ?disabled=${!e.days.length} @click=${this.downloadShown}><ha-icon slot="start" icon="mdi:download"></ha-icon>Download days displayed</ha-button>
          <ha-button appearance="plain" ?disabled=${!e.days.length} @click=${this.downloadAll}><ha-icon slot="start" icon="mdi:download-multiple"></ha-icon>Download all days</ha-button>
        </div>
        <div class="toolbar" style="padding-top:0">
          ${a.map(t=>{const s=this.kinds.includes(t);return Z`<button class="chip-cell kind-chip ${s?"on":""}" style="--chip:var(--primary-color)"
              @click=${()=>this.kinds=s?this.kinds.filter(e=>e!==t):[...this.kinds,t]}>
              <ha-icon icon=${dl[t]||"mdi:circle-small"}></ha-icon>${e.kinds[t]}</button>`;})}
          ${this.kinds.length?Z`<button class="link" @click=${()=>this.kinds=[]}>all</button>`:K}
        </div>
        ${this.summary&&this.summary.sequences?Z`<div class="secondary" style="padding:0 16px 8px">
              ${this.summary.sequences} sequence(s) · started by ${Object.keys(this.summary.starters).map(t=>`${e.kinds[t]||t} ${this.summary.starters[t]}`).join(", ")}
              ${this.summary.failures?Z` · <span style="color:var(--error-color,#f44336)">${this.summary.failures} problem(s)</span>`:K}
              ${Object.keys(this.summary.panel_latency).length?Z`<br />Panel after the alarm: ${Object.keys(this.summary.panel_latency).map(e=>{const t=this.summary.panel_latency[e];return`${e.replace("armed_","")} avg ${t.avg} s (max ${t.max} s, ${t.n}×)`;}).join(" · ")}`:K}
            </div>`:K}
        ${e.open&&t(e.open)?this.renderSequence(e.open,!0):K}
        ${s.map(e=>this.renderSequence(e,!1))}
        ${s.length||e.open?K:Z`<div class="empty">Nothing recorded${this.seqs.length?" that matches the filters":this.shownDays.length>1?" on these days":" this day yet"}.</div>`}
          </div>
        </details>
    `;}renderSequence(e,t){var s;const a=e.entries.some(e=>/fail|error|not allowed|differ/i.test(e.text)||"error"===e.level);return Z`
      <details class="collapse sub seq" ?open=${t}>
        <summary>
          <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
          <span class="seq-time">${this.shownDays.length>1?Z`<span class="secondary" style="display:inline">${new Date(1e3*e.start).toLocaleDateString(void 0,{month:"short",day:"numeric"})}</span> `:K}${hl(e.start)}</span>
          <span class="seq-title">${e.title}</span>
          ${t?Z`<span class="role">recording…</span>`:Z`<span class="secondary" style="display:inline">${null!==(s=e.duration)&&void 0!==s?s:0} s · ${e.entries.length} entries</span>`}
          ${a?Z`<ha-icon icon="mdi:alert-circle" style="color:var(--error-color,#f44336)" title="Something failed or differs"></ha-icon>`:K}
          <span class="seq-kinds">${e.kinds.map(e=>Z`<ha-icon icon=${dl[e]||"mdi:circle-small"} title=${this.info.kinds[e]||e}></ha-icon>`)}</span>
        </summary>
        <div class="collapse-body">
          <div class="table-wrap"><table class="full"><tbody>
            ${e.entries.map(e=>Z`<tr class=${"error"===e.level?"status-removed":"warning"===e.level?"status-changed":""}>
              <td class="c" style="width:1%">+${e.dt.toFixed(1)} s</td>
              <td class="icon"><ha-icon icon=${dl[e.kind]||"mdi:circle-small"} title=${this.info.kinds[e.kind]||e.kind}></ha-icon></td>
              <td style="white-space:normal">${e.text}${e.cause?Z`<span class="secondary">${e.cause}</span>`:K}</td>
            </tr>`)}
          </tbody></table></div>
        </div>
      </details>
    `;}rangeLabel(){const e=this.shownDays;return e.length>1?`${e[e.length-1]} – ${e[0]} (${e.length} days)`:e[0];}renderSettings(){const e=this.draft,t=this.info.watched||{},s=Object.keys(this.hass.states).filter(e=>!(e in t)).sort().map(e=>({value:e,label:`${this.hass.states[e].attributes.friendly_name||e} (${e})`}));return Z`
        <details class="collapse act-sec">
          <summary>
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <span class="collapse-title">Recording settings</span>
            <span class="secondary" style="display:inline">${e.enabled?`on · ${e.window_s} s window · ${e.retention_days} days`:"off"}</span>
          </summary>
          <div class="collapse-body">
            <div class="field-row"><label><input type="checkbox" .checked=${e.enabled} @change=${t=>this.draft=Object.assign(Object.assign({},e),{enabled:t.target.checked})} /> Record activity</label></div>
            <hm-slider .label=${"Sequence window (quiet time before a sequence ends)"} .min=${15} .max=${1800} .step=${15} unit="s" .value=${e.window_s}
              @value-changed=${t=>this.draft=Object.assign(Object.assign({},e),{window_s:t.detail.value})}></hm-slider>
            <div class="secondary" style="padding:0 6px 6px">A sequence also stays open while an alarm is arming or in its entry delay.</div>
            <hm-slider .label=${"Keep logs for"} .min=${1} .max=${365} unit="days" .value=${e.retention_days}
              @value-changed=${t=>this.draft=Object.assign(Object.assign({},e),{retention_days:t.detail.value})}></hm-slider>
            <hm-multi-picker .label=${"Also record"} .placeholder=${"Add an entity…"} .options=${s} .value=${e.entities}
              @value-changed=${t=>this.draft=Object.assign(Object.assign({},e),{entities:t.detail.value})}></hm-multi-picker>
            <div class="secondary" style="padding:6px">
              Recorded automatically (${Object.keys(t).length}): ${Object.keys(t).sort().join(", ")}. Zones and mirrors
              are recorded inside a sequence; automations that ran, commands to the panel, alarm and locks and notifications too.
              Files: <code>${this.info.directory}</code>.
            </div>
            ${this.dirty?Z`<div class="toolbar" style="padding:8px 0 0">
              <ha-button @click=${this.save}>Save</ha-button>
              <ha-button appearance="plain" @click=${()=>this.draft=JSON.parse(JSON.stringify(this.info.settings))}>Discard</ha-button></div>`:K}
          </div>
        </details>
    `;}renderPanelLog(){return Z`
        <details class="collapse act-sec">
          <summary>
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <span class="collapse-title">Physical panel link log</span>
            <span class="secondary" style="display:inline">${this.panelLog.length} entries since Home Assistant started (these are also in the sequences)</span>
          </summary>
          <div class="collapse-body">
            ${this.panelLog.length?Z`<div class="table-wrap" style="max-height:360px"><table class="full"><tbody>
                  ${this.panelLog.map(e=>Z`<tr class=${"error"===e.level?"status-removed":"warning"===e.level?"status-changed":""}>
                    <td>${(e=>{const t=new Date(1e3*e),s=e=>String(e).padStart(2,"0");return`${s(t.getHours())}:${s(t.getMinutes())}:${s(t.getSeconds())}`;})(e.ts)}</td><td>${e.link||""}</td><td style="white-space:normal">${e.msg}</td></tr>`)}
                </tbody></table></div>`:Z`<div class="empty">Nothing yet.</div>`}
          </div>
        </details>
    `;}renderHouseHistory(){const e=this.house;if(!e||!e.settings.history.length)return K;const t=t=>{var s;return t?(null===(s=e.settings.modes.find(e=>e.id===t))||void 0===s?void 0:s.name)||t:"unknown";},s=[...e.settings.history].reverse();return Z`
        <details class="collapse act-sec">
          <summary>
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <span class="collapse-title">House Mode history</span>
            <span class="secondary" style="display:inline">last ${s.length} changes made by the integration's House Modes</span>
          </summary>
          <div class="collapse-body">
            <div class="table-wrap" style="max-height:300px"><table class="full"><tbody>
              ${s.map(e=>Z`<tr class=${"failed"===e.result?"status-removed":""}><td>${new Date(e.at).toLocaleString()}</td>
                <td>${t(e.from)} → <strong>${t(e.to)}</strong></td><td>${e.source}</td><td>${e.result}</td></tr>`)}
            </tbody></table></div>
          </div>
        </details>
    `;}};var ul;pl.styles=[ka,h`
      /* the recording status stands out in the theme's accent color */
      .rec {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-weight: 700;
        letter-spacing: 0.04em;
        --mdc-icon-size: 16px;
      }
      .act-quick {
        display: inline-flex;
        gap: 6px;
        flex-wrap: wrap;
      }
      details.collapse.act-sec {
        margin: 0 16px 12px;
      }
      details.collapse.act-sec > .collapse-body > .toolbar {
        padding-left: 0;
        padding-right: 0;
      }
      details.collapse.seq {
        margin: 0 0 8px;
      }
      details.collapse.sub[open] {
        border-color: var(--accent-color);
      }
      .rec.on {
        color: var(--accent-color, var(--primary-color));
      }
      .rec.off {
        color: var(--secondary-text-color);
      }
      /* Arm Check's own cards sit flat inside the panel */
      .arm-check hm-view-why {
        display: block;
        --ha-card-box-shadow: none;
      }
    `],i([ye({attribute:!1})],pl.prototype,"hass",void 0),i([ye({type:Boolean})],pl.prototype,"narrow",void 0),i([ye({attribute:!1})],pl.prototype,"path",void 0),i([be()],pl.prototype,"info",void 0),i([be()],pl.prototype,"day",void 0),i([be()],pl.prototype,"dayTo",void 0),i([be()],pl.prototype,"loadingDays",void 0),i([be()],pl.prototype,"seqs",void 0),i([be()],pl.prototype,"summary",void 0),i([be()],pl.prototype,"kinds",void 0),i([be()],pl.prototype,"onlyProblems",void 0),i([be()],pl.prototype,"search",void 0),i([be()],pl.prototype,"error",void 0),i([be()],pl.prototype,"draft",void 0),i([be()],pl.prototype,"panelLog",void 0),i([be()],pl.prototype,"house",void 0),i([be()],pl.prototype,"shadow",void 0),i([be()],pl.prototype,"shadowAll",void 0),i([be()],pl.prototype,"shadowOpen",void 0),i([be()],pl.prototype,"seqOpen",void 0),pl=i([me("hm-view-activity")],pl);const ml=[{id:"house",icon:"mdi:home-switch-outline",title:"House Modes only",text:"Home, Away, Sleep, Guest, … to tell your automations what is going on. No alarm: the House Modes do not arm anything (one partition is kept in the background)."},{id:"virtual",icon:"mdi:shield-home-outline",title:"Alarm without a physical panel",text:"The built-in alarm: a partition with Away, Home and Night, your door, window and motion sensors as zones, and a user code."},{id:"panel",icon:"mdi:alarm-panel-outline",title:"House Modes and a physical panel",text:"The alarm and your panel (e.g. a Vista through Envisalink) kept in step, with House Modes. Everything starts in Shadow next to your own automations, so nothing changes until you switch to Live."}],gl={done:"mdi:check-circle",todo:"mdi:circle-outline",manual:"mdi:hand-pointing-right",skip:"mdi:minus-circle-outline"};let vl=ul=class extends pe{constructor(){super(...arguments),this.narrow=!1,this.plans={},this.error="",this.busy="",this.pickZones=null,this.cardOn=null,this.askImport=!1;}firstUpdated(){this.load(),this.findCard();}async findCard(){const e=[];try{const t=[{url_path:null,title:"Overview"},...(await this.hass.callWS({type:"lovelace/dashboards/list"}))];for(const s of t)try{const t=await this.hass.callWS({type:"lovelace/config",url_path:s.url_path});JSON.stringify(t).includes("custom:house-modes-alarm-center-card")&&e.push(s.title||s.url_path||"Overview");}catch(e){}}catch(e){return void(this.cardOn=null);}this.cardOn=e;}picked(e){if(this.pickZones)return this.pickZones;const t=[].concat(...ul.GROUPS.filter(e=>e.on).map(e=>e.classes));return e.filter(e=>t.includes(e.device_class)).map(e=>e.entity_id);}async load(){try{const e=await this.hass.callWS({type:"house_modes/ext/quickstart/plan"});this.status=e.status,this.plans=e.plans,this.error="";}catch(e){this.error=ba(e);}}async apply(e){const t=this.plans[e],s=t.steps.filter(e=>"todo"===e.status).map(e=>e.title);if(window.confirm(`Quick Start will make a backup, then:\n\n• ${s.join("\n• ")}\n\nGo ahead?`)){this.busy=e;try{const s=t.steps.find(e=>"zones"===e.id),a=(null==s?void 0:s.candidates)?this.picked(s.candidates):void 0,i=await this.hass.callWS(Object.assign({type:"house_modes/ext/quickstart/apply",setup:e},a?{entities:a}:{}));this.plans=Object.assign(Object.assign({},this.plans),{[e]:i.plan}),this.status=i.status,_a(this,i.done.length?`Done: ${i.done.length} step(s). A backup was made first.`:"Nothing to do."),await this.load();}catch(e){this.error=ba(e);}finally{this.busy="";}}}render(){const e=Z`<hm-alarmo-import .hass=${this.hass} mode="ask"
        @import-status=${e=>{var t;return this.askImport=!!(null===(t=e.detail)||void 0===t?void 0:t.ask);}}></hm-alarmo-import>`;return this.askImport?e:Z`
      ${this.error?Z`<div class="notice error" style="margin:0 0 12px">${this.error}</div>`:K}
      ${e}
      ${za("Quick Start","settings",Z`<p>House Modes &amp; Alarm Center can be used three ways. Pick the one that fits, check
          what it will do, and press <strong>Apply</strong>: it makes a backup first and only adds what is missing. You can run
          it again later.</p>`,Z`
        ${Ta("qs-status","What's configured",this.statusSummary(),this.renderStatus())}
        ${ml.map(e=>this.renderSetup(e))}`)}
    `;}statusSummary(){const e=this.status;return e?[e.house.enabled?"House Modes "+("shadow"===e.house.run_mode?"Shadow":"Live"):"House Modes off",`${e.partitions} partition${1===e.partitions?"":"s"}`,`${e.zones} zones`,`${e.users} users`,e.panel_links.length?`panel link ${e.panel_links[0].mode}`:"no panel link"].join(" · "):"loading…";}renderStatus(){const e=this.status;if(!e)return Z`<div class="empty">Loading…</div>`;const t=(e,t,s,a)=>Z`
      <button class="stat ${e?"ok":""}" @click=${()=>la(0,a,!0)}>
        <ha-icon icon=${t}></ha-icon><span>${s}</span></button>`;return Z`<div class="stats">
        ${t(e.house.enabled,"mdi:home-switch-outline",e.house.enabled?`House Modes · ${e.house.modes} · ${"shadow"===e.house.run_mode?"Shadow":"Live"}`:"House Modes off","/house_modes/house")}
        ${t(e.partitions>0,"mdi:shield-home-outline",`${e.partitions} partition(s)`,"/house_modes/partitions")}
        ${t(e.zones>0,"mdi:door-open",`${e.zones} zone(s)`,"/house_modes/zones")}
        ${t(e.users>0,"mdi:account-key-outline",`${e.users} user(s)`,"/house_modes/codes")}
        ${t(e.panel_links.length>0,"mdi:alarm-panel-outline",e.panel_links.length?`Panel link · ${e.panel_links[0].mode}`:"No panel link","/house_modes/panel")}
        ${t(e.recording,"mdi:record-circle-outline",e.recording?"Recording on":"Recording off","/house_modes/activity")}
      </div>`;}renderSetup(e){const t=this.plans[e.id],s=t?t.steps.filter(e=>"done"===e.status).length:0;return Ta(`qs-${e.id}`,Z`<ha-icon icon=${e.icon} style="--mdc-icon-size:18px;vertical-align:-3px;margin-right:4px"></ha-icon>${e.title}`,t?`${s} of ${t.steps.length} done${t.todo?` · ${t.todo} to apply`:""}`:"",Z`
          <p class="secondary" style="display:block;margin:4px 0 8px">${e.text}</p>
          ${t?Z`<ol class="steps">${t.steps.map(e=>this.renderStep(e))}</ol>`:Z`<div class="empty">Loading…</div>`}
          ${t?Z`<div class="toolbar" style="padding:8px 0 0">
                <ha-button ?disabled=${!t.todo||!!this.busy} @click=${()=>this.apply(e.id)}>
                  <ha-icon slot="start" icon="mdi:auto-fix"></ha-icon>${this.busy===e.id?"Applying…":t.todo?`Apply ${t.todo} step(s)`:"All automatic steps done"}
                </ha-button>
                <span class="secondary" style="display:inline">A backup is made first; nothing that exists is changed.</span>
              </div>`:K}
    `);}renderZoneGroups(e){const t=this.picked(e),s=e=>this.pickZones=e;return Z`<div class="zgroups">
      <p class="secondary" style="display:block;margin:2px 0 6px">${t.length} of ${e.length} picked. Doors and windows are
        picked to start with; motion sensors (cameras often have several) only if you tick them.</p>
      ${ul.GROUPS.map(a=>{const i=e.filter(e=>a.classes.includes(e.device_class));if(!i.length)return K;const n=i.filter(e=>t.includes(e.entity_id)).length,o=i.map(e=>e.entity_id);return Z`<details class="zgroup">
          <summary>
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <ha-icon icon=${a.icon}></ha-icon>
            <span class="zg-title">${a.title}</span>
            <span class="secondary" style="display:inline">${n} of ${i.length}</span>
            <span class="grow"></span>
            <button class="link" @click=${e=>{e.preventDefault(),s([...new Set([...t,...o])]);}}>all</button>
            <button class="link" @click=${e=>{e.preventDefault(),s(t.filter(e=>!o.includes(e)));}}>none</button>
          </summary>
          <div class="cands">${i.map(e=>Z`<label><input type="checkbox" .checked=${t.includes(e.entity_id)}
              @change=${a=>s(a.target.checked?[...t,e.entity_id]:t.filter(t=>t!==e.entity_id))} />${e.name}</label>`)}</div>
        </details>`;})}
    </div>`;}renderStep(e){var t;const s="card"===e.id&&(null===(t=this.cardOn)||void 0===t?void 0:t.length)?Object.assign(Object.assign({},e),{status:"done",detail:`on ${this.cardOn.join(", ")}`,yaml:void 0}):"card"===e.id?Object.assign(Object.assign({},e),{detail:"not on a dashboard yet — add it:"}):e;return Z`<li class="step ${s.status}">
      <ha-icon icon=${gl[s.status]}></ha-icon>
      <div class="step-body">
        <div><strong>${s.title}</strong>${s.detail?Z` <span class="secondary" style="display:inline">· ${s.detail}</span>`:K}
          ${s.link?Z` <a href=${s.link} @click=${e=>{e.preventDefault(),la(0,s.link,!0);}}>open</a>`:K}</div>
        ${s.candidates&&"todo"===s.status?this.renderZoneGroups(s.candidates):K}
        ${s.yaml?Z`<pre class="yaml">${s.yaml}</pre>
              <button class="link" @click=${()=>{var e;return null===(e=navigator.clipboard)||void 0===e?void 0:e.writeText(s.yaml).then(()=>_a(this,"Copied"),()=>_a(this,"Select the text and copy it"));}}>Copy</button>
              <span class="secondary" style="display:inline">· or Edit dashboard → Add card → House Modes &amp; Alarm Center Card</span>`:K}
      </div>
    </li>`;}};vl.GROUPS=[{id:"door",title:"Doors",icon:"mdi:door",classes:["door","garage_door","opening"],on:!0},{id:"window",title:"Windows",icon:"mdi:window-closed-variant",classes:["window"],on:!0},{id:"motion",title:"Motion",icon:"mdi:motion-sensor",classes:["motion"],on:!1},{id:"occupancy",title:"Occupancy and presence",icon:"mdi:account-search-outline",classes:["occupancy","presence"],on:!1}],vl.styles=[ka,h`
      .stats {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 4px 16px 16px;
      }
      .stat {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px 4px 8px;
        border-radius: 16px;
        border: 1px solid var(--divider-color);
        background: none;
        color: var(--secondary-text-color);
        font: inherit;
        cursor: pointer;
        --mdc-icon-size: 18px;
      }
      .stat.ok {
        color: var(--primary-text-color);
        border-color: var(--success-color, #43a047);
      }
      .stat.ok ha-icon {
        color: var(--success-color, #43a047);
      }
      .steps {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .step {
        display: flex;
        gap: 8px;
        padding: 6px 0;
        border-top: 1px solid var(--divider-color);
        --mdc-icon-size: 20px;
      }
      .step.done > ha-icon {
        color: var(--success-color, #43a047);
      }
      .step.todo > ha-icon {
        color: var(--primary-color);
      }
      .step.manual > ha-icon {
        color: var(--warning-color, #ffa600);
      }
      .step-body {
        flex: 1;
        min-width: 0;
      }
      .zgroup {
        border-top: 1px solid var(--divider-color);
      }
      .zgroup[open] {
        border: 1px solid var(--accent-color, var(--primary-color));
        border-radius: 6px;
        margin: 4px 0;
      }
      .zgroup summary {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 5px 6px;
        cursor: pointer;
        list-style: none;
        --mdc-icon-size: 18px;
      }
      .zgroup summary::-webkit-details-marker {
        display: none;
      }
      .zgroup .chev {
        transition: transform 0.15s;
      }
      .zgroup[open] .chev {
        transform: rotate(90deg);
      }
      .zg-title {
        font-weight: 600;
      }
      .grow {
        flex: 1;
      }
      .cands {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
        gap: 2px 16px;
        padding: 4px 10px 8px 30px;
      }
      .cands label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .yaml {
        margin: 6px 0 4px;
        padding: 8px 10px;
        border-radius: 6px;
        background: var(--secondary-background-color, #202020);
        font-family: var(--code-font-family, monospace);
        font-size: 0.9em;
        white-space: pre-wrap;
      }
    `],i([ye({attribute:!1})],vl.prototype,"hass",void 0),i([ye({type:Boolean})],vl.prototype,"narrow",void 0),i([ye({attribute:!1})],vl.prototype,"path",void 0),i([be()],vl.prototype,"status",void 0),i([be()],vl.prototype,"plans",void 0),i([be()],vl.prototype,"error",void 0),i([be()],vl.prototype,"busy",void 0),i([be()],vl.prototype,"pickZones",void 0),i([be()],vl.prototype,"cardOn",void 0),i([be()],vl.prototype,"askImport",void 0),vl=ul=i([me("hm-view-quick-start")],vl);const yl="hm-actions-tab";let bl=class extends pe{constructor(){super(...arguments),this.showLegacy=!1;}async loadUi(){var e;try{this.showLegacy=!!(null===(e=(await va(this.hass)).ui)||void 0===e?void 0:e.show_legacy_zones);}catch(e){this.showLegacy=!1;}}async firstUpdated(){window.addEventListener("location-changed",()=>{window.location.pathname.includes("house_modes")&&this.requestUpdate();}),window.addEventListener("hm-ui-changed",()=>this.loadUi()),await $e(),await this.loadUi(),this.userConfig=await xe(this.hass);try{(await ur(this.hass)).ask&&ma().page&&"general"!==ma().page&&la(0,"/house_modes/general",!0);}catch(e){}this.requestUpdate();}render(){if(!customElements.get("ha-panel-config")||!this.userConfig)return Z`
        loading...
      `;const e=ma(),t=Qr(e.page,e.subpage,e.params);return Z`
      <div class="header">
        <div class="toolbar">
          <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
          <div class="main-title">
            ${us("title",this.hass.language)}
          </div>
          <div class="version">
            v${"2026.11.11.94"}
          </div>
        </div>

        <ha-tab-group
          @wa-tab-show=${this.handlePageSelected}
        >
          ${Jr.map(e=>Z`
            <ha-tab-group-tab slot="nav" panel="${e.id}" .active=${(null==t?void 0:t.id)===e.id}>
              ${us(e.titleKey,this.hass.language)}
            </ha-tab-group-tab>
          `)}
        </ha-tab-group>
      </div>
      <hm-status-strip .hass=${this.hass}></hm-status-strip>
      <div class="view">
        ${this.getView(e,t)}
      </div>
    `;}getView(e,t){switch(null==t?void 0:t.view){case"general":return"general"!==(null==t?void 0:t.id)||el(e.subpage,e.params)?Z`
          <hm-view-general
            .hass=${this.hass}
            .narrow=${this.narrow}
            .path=${e}
            .section=${t.section}
          ></hm-view-general>
        `:Z`<hm-view-quick-start .hass=${this.hass} .narrow=${this.narrow} .path=${e}></hm-view-quick-start>`;case"sensors":{const t="zones_legacy"===e.page?Object.assign(Object.assign({},e),{page:"sensors"}):e;return Z`
          <hm-view-sensors .hass=${this.hass} .narrow=${this.narrow} .path=${t}></hm-view-sensors>
        `;}case"codes":return Z`
          <hm-view-codes .hass=${this.hass} .narrow=${this.narrow} .path=${e}></hm-view-codes>
        `;case"sensor_table":return Z`
          <hm-view-sensor-table .hass=${this.hass} .narrow=${this.narrow} .path=${e}></hm-view-sensor-table>
        `;case"activity":return Z`
          <hm-view-activity .hass=${this.hass} .narrow=${this.narrow} .path=${e}></hm-view-activity>
        `;case"why":return Z`
          <hm-view-why .hass=${this.hass} .narrow=${this.narrow} .path=${e}></hm-view-why>
        `;case"house":return Z`
          <hm-view-house .hass=${this.hass} .narrow=${this.narrow} .path=${e}></hm-view-house>
        `;case"ha_zones":return Z`
          <hm-view-ha-zones .hass=${this.hass} .narrow=${this.narrow} .path=${e}></hm-view-ha-zones>
        `;case"mirrors":return Z`
          <hm-view-mirrors .hass=${this.hass} .narrow=${this.narrow} .path=${e}></hm-view-mirrors>
        `;case"connections":return Z`
          <hm-view-connections .hass=${this.hass} .narrow=${this.narrow} .path=${e}></hm-view-connections>
        `;case"panel":return Z`
          <hm-view-panel .hass=${this.hass} .narrow=${this.narrow} .path=${e}></hm-view-panel>
        `;case"backup":return"mqtt_configuration"===e.subpage?Z`<hm-view-general .hass=${this.hass} .narrow=${this.narrow} .path=${e}></hm-view-general>`:Z`<hm-view-backup .hass=${this.hass} .narrow=${this.narrow} .path=${e}></hm-view-backup>`;case"actions":{const s=el(e.subpage,e.params);"notifications"===e.page?window.sessionStorage.setItem(yl,"notifications"):s||e.filter||"actions"!==e.page?s&&"actions"===t.id&&window.sessionStorage.removeItem(yl):"notifications"===window.sessionStorage.getItem(yl)&&(window.sessionStorage.removeItem(yl),setTimeout(()=>la(0,ga("notifications"),!0),0));const a="notifications"===e.page?Object.assign(Object.assign({},e),{page:"actions"}):e,i="new_notification"===e.subpage||!!e.params.edit_notification,n=s?i?"notifications":"actions":t.section;return Z`
          <hm-view-actions
            .hass=${this.hass}
            .narrow=${this.narrow}
            .path=${a}
            .section=${n}
          ></hm-view-actions>
        `;}default:return Z`
          <ha-card header="Page not found">
            <div class="card-content">
              The page you are trying to reach cannot be found. Please select a page from the menu above to continue.
            </div>
          </ha-card>
        `;}}handlePageSelected(e){var t,s;const a=e.detail.name,i=ma();if(a!==(null===(t=Qr(i.page,i.subpage,i.params))||void 0===t?void 0:t.id)){window.sessionStorage.removeItem(yl);const e=null===(s=this.shadowRoot)||void 0===s?void 0:s.querySelector("hm-view-sensor-table");if(e&&e.hasUnsavedChanges&&e.hasUnsavedChanges()){if(!window.confirm("The Zones page has unsaved changes. They are kept as a draft until you return, but are not saved yet. Leave the page?"))return void this.requestUpdate();}la(0,ga(a)),this.requestUpdate();}else scrollTo(0,0);}static get styles(){return h`
      ${pa} :host {
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
    `;}};i([ye({attribute:!1})],bl.prototype,"hass",void 0),i([ye({type:Boolean,reflect:!0})],bl.prototype,"narrow",void 0),i([ye({attribute:!1})],bl.prototype,"userConfig",void 0),i([ye({attribute:!1})],bl.prototype,"showLegacy",void 0),bl=i([me("house-modes-panel")],bl);export{bl as MyAlarmPanel};
