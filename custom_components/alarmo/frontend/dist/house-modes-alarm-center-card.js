function e(e,t,s,a){var o,i=arguments.length,r=i<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,s):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,s,a);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(r=(i<3?o(r):i>3?o(t,s,r):o(t,s))||r);return i>3&&r&&Object.defineProperty(t,s,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,s=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,a=Symbol(),o=new WeakMap;let i=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==a)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const s=void 0!==t&&1===t.length;s&&(e=o.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(t,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const s=1===e.length?e[0]:t.reduce((t,s,a)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[a+1],e[0]);return new i(s,e,a)},n=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>new i("string"==typeof e?e:e+"",void 0,a))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:m}=Object,u=globalThis,g=u.trustedTypes,_=g?g.emptyScript:"",b=u.reactiveElementPolyfillSupport,v=(e,t)=>e,f={toAttribute(e,t){switch(t){case Boolean:e=e?_:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},y=(e,t)=>!l(e,t),w={attribute:!0,type:String,converter:f,reflect:!1,useDefault:!1,hasChanged:y};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let k=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=w){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),a=this.getPropertyDescriptor(e,s,t);void 0!==a&&c(this.prototype,e,a)}}static getPropertyDescriptor(e,t,s){const{get:a,set:o}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:a,set(t){const i=a?.call(this);o?.call(this,t),this.requestUpdate(e,i,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??w}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=m(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(n(e))}else void 0!==e&&t.push(n(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,a)=>{if(s)e.adoptedStyleSheets=a.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const s of a){const a=document.createElement("style"),o=t.litNonce;void 0!==o&&a.setAttribute("nonce",o),a.textContent=s.cssText,e.appendChild(a)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),a=this.constructor._$Eu(e,s);if(void 0!==a&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:f).toAttribute(t,s.type);this._$Em=e,null==o?this.removeAttribute(a):this.setAttribute(a,o),this._$Em=null}}_$AK(e,t){const s=this.constructor,a=s._$Eh.get(e);if(void 0!==a&&this._$Em!==a){const e=s.getPropertyOptions(a),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:f;this._$Em=a;const i=o.fromAttribute(t,e.type);this[a]=i??this._$Ej?.get(a)??i,this._$Em=null}}requestUpdate(e,t,s,a=!1,o){if(void 0!==e){const i=this.constructor;if(!1===a&&(o=this[e]),s??=i.getPropertyOptions(e),!((s.hasChanged??y)(o,t)||s.useDefault&&s.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(i._$Eu(e,s))))return;this.C(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:a,wrapped:o},i){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,i??t??this[e]),!0!==o||void 0!==i)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===a&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,a=this[t];!0!==e||this._$AL.has(t)||void 0===a||this.C(t,void 0,s,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[v("elementProperties")]=new Map,k[v("finalized")]=new Map,b?.({ReactiveElement:k}),(u.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $=globalThis,x=e=>e,A=$.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:e=>e}):void 0,C="$lit$",z=`lit$${Math.random().toFixed(9).slice(2)}$`,O="?"+z,E=`<${O}>`,M=document,T=()=>M.createComment(""),j=e=>null===e||"object"!=typeof e&&"function"!=typeof e,P=Array.isArray,N="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,D=/>/g,L=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,B=/"/g,U=/^(?:script|style|textarea|title)$/i,F=(e=>(t,...s)=>({_$litType$:e,strings:t,values:s}))(1),q=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),W=new WeakMap,K=M.createTreeWalker(M,129);function Z(e,t){if(!P(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const G=(e,t)=>{const s=e.length-1,a=[];let o,i=2===t?"<svg>":3===t?"<math>":"",r=R;for(let t=0;t<s;t++){const s=e[t];let n,l,c=-1,d=0;for(;d<s.length&&(r.lastIndex=d,l=r.exec(s),null!==l);)d=r.lastIndex,r===R?"!--"===l[1]?r=H:void 0!==l[1]?r=D:void 0!==l[2]?(U.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=L):void 0!==l[3]&&(r=L):r===L?">"===l[0]?(r=o??R,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,n=l[1],r=void 0===l[3]?L:'"'===l[3]?B:I):r===B||r===I?r=L:r===H||r===D?r=R:(r=L,o=void 0);const h=r===L&&e[t+1].startsWith("/>")?" ":"";i+=r===R?s+E:c>=0?(a.push(n),s.slice(0,c)+C+s.slice(c)+z+h):s+z+(-2===c?t:h)}return[Z(e,i+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),a]};class Y{constructor({strings:e,_$litType$:t},s){let a;this.parts=[];let o=0,i=0;const r=e.length-1,n=this.parts,[l,c]=G(e,t);if(this.el=Y.createElement(l,s),K.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(a=K.nextNode())&&n.length<r;){if(1===a.nodeType){if(a.hasAttributes())for(const e of a.getAttributeNames())if(e.endsWith(C)){const t=c[i++],s=a.getAttribute(e).split(z),r=/([.?@])?(.*)/.exec(t);n.push({type:1,index:o,name:r[2],strings:s,ctor:"."===r[1]?te:"?"===r[1]?se:"@"===r[1]?ae:ee}),a.removeAttribute(e)}else e.startsWith(z)&&(n.push({type:6,index:o}),a.removeAttribute(e));if(U.test(a.tagName)){const e=a.textContent.split(z),t=e.length-1;if(t>0){a.textContent=A?A.emptyScript:"";for(let s=0;s<t;s++)a.append(e[s],T()),K.nextNode(),n.push({type:2,index:++o});a.append(e[t],T())}}}else if(8===a.nodeType)if(a.data===O)n.push({type:2,index:o});else{let e=-1;for(;-1!==(e=a.data.indexOf(z,e+1));)n.push({type:7,index:o}),e+=z.length-1}o++}}static createElement(e,t){const s=M.createElement("template");return s.innerHTML=e,s}}function J(e,t,s=e,a){if(t===q)return t;let o=void 0!==a?s._$Co?.[a]:s._$Cl;const i=j(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),void 0===i?o=void 0:(o=new i(e),o._$AT(e,s,a)),void 0!==a?(s._$Co??=[])[a]=o:s._$Cl=o),void 0!==o&&(t=J(e,o._$AS(e,t.values),o,a)),t}class X{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,a=(e?.creationScope??M).importNode(t,!0);K.currentNode=a;let o=K.nextNode(),i=0,r=0,n=s[0];for(;void 0!==n;){if(i===n.index){let t;2===n.type?t=new Q(o,o.nextSibling,this,e):1===n.type?t=new n.ctor(o,n.name,n.strings,this,e):6===n.type&&(t=new oe(o,this,e)),this._$AV.push(t),n=s[++r]}i!==n?.index&&(o=K.nextNode(),i++)}return K.currentNode=M,a}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,a){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=J(this,e,t),j(e)?e===V||null==e||""===e?(this._$AH!==V&&this._$AR(),this._$AH=V):e!==this._$AH&&e!==q&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>P(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==V&&j(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,a="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=Y.createElement(Z(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===a)this._$AH.p(t);else{const e=new X(a,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=W.get(e.strings);return void 0===t&&W.set(e.strings,t=new Y(e)),t}k(e){P(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,a=0;for(const o of e)a===t.length?t.push(s=new Q(this.O(T()),this.O(T()),this,this.options)):s=t[a],s._$AI(o),a++;a<t.length&&(this._$AR(s&&s._$AB.nextSibling,a),t.length=a)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=x(e).nextSibling;x(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,a,o){this.type=1,this._$AH=V,this._$AN=void 0,this.element=e,this.name=t,this._$AM=a,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=V}_$AI(e,t=this,s,a){const o=this.strings;let i=!1;if(void 0===o)e=J(this,e,t,0),i=!j(e)||e!==this._$AH&&e!==q,i&&(this._$AH=e);else{const a=e;let r,n;for(e=o[0],r=0;r<o.length-1;r++)n=J(this,a[s+r],t,r),n===q&&(n=this._$AH[r]),i||=!j(n)||n!==this._$AH[r],n===V?e=V:e!==V&&(e+=(n??"")+o[r+1]),this._$AH[r]=n}i&&!a&&this.j(e)}j(e){e===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===V?void 0:e}}class se extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==V)}}class ae extends ee{constructor(e,t,s,a,o){super(e,t,s,a,o),this.type=5}_$AI(e,t=this){if((e=J(this,e,t,0)??V)===q)return;const s=this._$AH,a=e===V&&s!==V||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==V&&(s===V||a);a&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class oe{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){J(this,e)}}const ie=$.litHtmlPolyfillSupport;ie?.(Y,Q),($.litHtmlVersions??=[]).push("3.3.3");const re=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ne extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const a=s?.renderBefore??t;let o=a._$litPart$;if(void 0===o){const e=s?.renderBefore??null;a._$litPart$=o=new Q(t.insertBefore(T(),e),e,void 0,s??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}ne._$litElement$=!0,ne.finalized=!0,re.litElementHydrateSupport?.({LitElement:ne});const le=re.litElementPolyfillSupport;le?.({LitElement:ne}),(re.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ce=e=>(t,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},de={attribute:!0,type:String,converter:f,reflect:!1,hasChanged:y},he=(e=de,t,s)=>{const{kind:a,metadata:o}=s;let i=globalThis.litPropertyMetadata.get(o);if(void 0===i&&globalThis.litPropertyMetadata.set(o,i=new Map),"setter"===a&&((e=Object.create(e)).wrapped=!0),i.set(s.name,e),"accessor"===a){const{name:a}=s;return{set(s){const o=t.get.call(this);t.set.call(this,s),this.requestUpdate(a,o,e,!0,s)},init(t){return void 0!==t&&this.C(a,void 0,e,t),t}}}if("setter"===a){const{name:a}=s;return function(s){const o=this[a];t.call(this,s),this.requestUpdate(a,o,e,!0,s)}}throw Error("Unsupported decorator location: "+a)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function pe(e){return(t,s)=>"object"==typeof s?he(e,t,s):((e,t,s)=>{const a=t.hasOwnProperty(s);return t.constructor.createProperty(s,e),a?Object.getOwnPropertyDescriptor(t,s):void 0})(e,t,s)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function me(e){return pe({...e,state:!0,attribute:!1})}const ue=(e,t)=>{if(void 0!==e&&""!==e)return"mode"===e?t:"none"===e?"transparent":String(e).replace(/[;{}<>]/g,"")},ge={mode_name:{label:"House Mode name",size:22,weight:400,font:"monospace",caps:!0},line1:{label:"Panel display, line 1",size:14,weight:400,font:"monospace",caps:!1},line2:{label:"Panel display, line 2",size:14,weight:400,font:"monospace",caps:!1},mode_label:{label:"House Mode button text",size:10,weight:400,font:"sans",caps:!1},alarm_bar:{label:"Section bars (collapsible sections)",size:14,weight:500,font:"sans",caps:!1},alarm_name:{label:"Alarm name",size:24,weight:400,font:"sans",caps:!1},alarm_state:{label:"Alarm state",size:14,weight:400,font:"sans",caps:!1},alarm_button:{label:"Arm button text",size:14,weight:400,font:"sans",caps:!1},chip:{label:"Option chips",size:12,weight:500,font:"sans",caps:!1},key_digit:{label:"Keypad digit",size:16,weight:400,font:"sans",caps:!1},key_label:{label:"Keypad function",size:10,weight:400,font:"sans",caps:!1}},_e={header_icon:{label:"House Mode icon (header)",size:48},mode_icon:{label:"House Mode button icons",size:36},alarm_icon:{label:"Arm button icons",size:22}},be={show_header:!0,show_house_modes:!0,show_alarm:!0,show_panel_keypad:!1,collapsible:!1,start_collapsed:!0,show_chevron:!1,columns:5,modes_align:"grid",show_mode_labels:!0,show_mode_name:!0,show_line1:!0,show_line2:!0,alarm_collapsible:!1,alarm_start_collapsed:!0,show_alarm_name:!0,show_alarm_state:!0,show_arm_options:!0,alarm_colors_from_modes:!0,modes_collapsible:!1,modes_start_collapsed:!0,keypad_collapsible:!1,keypad_start_collapsed:!0,show_header_icon:!0,show_mode_icons:!0,show_alarm_icon:!0,show_arm_icons:!0,show_arm_labels:!0,show_key_labels:!0},ve={monospace:"var(--code-font-family, monospace)",sans:'var(--ha-font-family-body, Roboto, "Noto Sans", sans-serif)',serif:'Georgia, "Times New Roman", serif'},fe=e=>{const t={};for(const[s,a]of e)t[s]=a;return t},ye=e=>{const t=[],s=(e,s)=>null!=s&&""!==s&&t.push(`--hmac-${e}:${(e=>String(e).replace(/[;{}<>]/g,""))(s)}`);for(const t of Object.keys(ge)){const a=(e||{})[t];if(!a)continue;const o=t.replace(/_/g,"-");a.size&&s(`${o}-size`,`${Number(a.size)}px`),a.weight&&s(`${o}-weight`,Number(a.weight)),s(`${o}-color`,a.color),a.font&&ve[a.font]&&s(`${o}-font`,ve[a.font]),void 0!==a.italic&&s(`${o}-style`,a.italic?"italic":"normal"),void 0!==a.caps&&s(`${o}-transform`,a.caps?"uppercase":"none")}for(const t of Object.keys(_e)){const a=(e||{})[t];if(!a)continue;const o=t.replace(/_/g,"-");a.size&&s(`${o}-size`,`${Number(a.size)}px`)}const a=(e||{}).card;return void 0!==(null==a?void 0:a.border_width)&&s("border-width",`${Number(a.border_width)}px`),void 0!==(null==a?void 0:a.radius)&&s("radius",`${Number(a.radius)}px`),t.join(";")},we={disarmed:"#4caf50",armed_away:"#f44336",armed_home:"#ff9800",armed_night:"#5c6bc0",armed_vacation:"#dc143c",armed_custom_bypass:"#00bcd4"},ke=(e,t)=>{var s,a;const o=null===(s=e.alarms.find(e=>e.entity_id===t))||void 0===s?void 0:s.key,i={};for(const t of Object.keys(we)){const s=e.house.modes.find(e=>{var s;return o&&(null===(s=e.targets)||void 0===s?void 0:s[o])===t}),r=e.house.modes.find(e=>Object.values(e.targets||{}).includes(t));i[t]=(null===(a=s||r)||void 0===a?void 0:a.color)||we[t]}return i},$e=[["1","OFF"],["2","AWAY"],["3","STAY"],["4","MAX"],["5","TEST"],["6","BYPASS"],["7","INSTANT"],["8","CODE"],["9","CHIME"],["*","READY"],["0",""],["#",""]],xe=e=>{const t=String(e||"");return[t.slice(0,16).trim(),t.slice(16,32).trim()]},Ae=(e,t)=>e.links.find(e=>e.alarm_entity===t)||e.links[0],Se=["armed_away","armed_home","armed_night","armed_vacation","armed_custom_bypass"],Ce="number";var ze;!function(e){e.Disarmed="disarmed",e.Arming="arming",e.Pending="pending",e.Triggered="triggered",e.ArmedAway="armed_away",e.ArmedHome="armed_home",e.ArmedNight="armed_night",e.ArmedVacation="armed_vacation",e.ArmedCustomBypass="armed_custom_bypass"}(ze||(ze={}));const Oe={[ze.ArmedAway]:"hass:shield-lock",[ze.ArmedHome]:"hass:shield-home",[ze.ArmedNight]:"hass:shield-moon",[ze.ArmedVacation]:"hass:shield-airplane",[ze.ArmedCustomBypass]:"mdi:lock-percent-open",[ze.Disarmed]:"mdi:lock-open-variant",[ze.Arming]:"hass:shield-outline",[ze.Pending]:"hass:shield-outline",[ze.Triggered]:"hass:bell-ring"};var Ee;!function(e){e.ArmAway="arm_away",e.ArmHome="arm_home",e.ArmNight="arm_night",e.ArmVacation="arm_vacation",e.ArmCustomBypass="arm_custom_bypass",e.Disarm="disarm"}(Ee||(Ee={}));const Me={[Ee.ArmAway]:"mdi:lock",[Ee.ArmHome]:"mdi:home",[Ee.ArmNight]:"mdi:moon-waning-crescent",[Ee.ArmVacation]:"mdi:airplane",[Ee.ArmCustomBypass]:"mdi:lock-percent-open",[Ee.Disarm]:"mdi:lock-open-variant"},Te={[Ee.ArmAway]:ze.ArmedAway,[Ee.ArmHome]:ze.ArmedHome,[Ee.ArmNight]:ze.ArmedNight,[Ee.ArmVacation]:ze.ArmedVacation,[Ee.ArmCustomBypass]:ze.ArmedCustomBypass,[Ee.Disarm]:ze.Disarmed};var je;!function(e){e.Disarm="disarm",e.Arm="arm",e.Trigger="trigger",e.FailedToArm="failed_to_arm",e.CommandNotAllowed="command_not_allowed",e.NoCodeProvided="no_code_provided",e.InvalidCodeProvided="invalid_code_provided",e.TriggerTimeExpired="trigger_time_expired",e.ReadyToArmModesChanged="ready_to_arm_modes_changed"}(je||(je={}));const Pe="alarmo_updated",Ne=["arming","pending"],Re={type:"",entity:"",name:"",keep_keypad_visible:!1,button_scale_actions:1,button_scale_keypad:1,states:{},show_messages:!0,show_ready_indicator:!0,show_bypassed_sensors:!0,use_code_dialog:!1,hide_keypad:!1},He={skip_delay:!1,force:!1};var De;!function(e){e.Red="red",e.Pink="pink",e.Purple="purple",e.DeepPurple="deep-purple",e.Indigo="indigo",e.Blue="blue",e.LightBlue="light-blue",e.Cyan="cyan",e.Teal="teal",e.Green="green",e.LightGreen="light-green",e.Lime="lime",e.Yellow="yellow",e.Amber="amber",e.Orange="orange",e.DeepOrange="deep-orange",e.Brown="brown",e.LightGrey="light-grey",e.Grey="grey",e.DarkGrey="dark-grey",e.BlueGrey="blue-grey",e.Black="black",e.White="white"}(De||(De={}));const Le=(e,t,s,a)=>{a=a||{},s=null==s?{}:s;const o=new Event(t,{bubbles:void 0===a.bubbles||a.bubbles,cancelable:Boolean(a.cancelable),composed:void 0===a.composed||a.composed});return o.detail=s,e.dispatchEvent(o),o};class Ie extends ne{constructor(){super(...arguments),this.duration=0,this.datetime=null,this.timer=0,this._touchStarted=!1,this._hover=!1}shouldUpdate(e){if(!e.size)return!0;const t=e.get("hass");if(!t||t.themes!==this.hass.themes||t.language!==this.hass.language)return!0;if(t.states[this.entity].state!==this.hass.states[this.entity].state||t.states[this.entity].attributes.delay!==this.hass.states[this.entity].attributes.delay){const e=t.states[this.entity].state,s=this.hass.states[this.entity].state;return Ne.includes(s)?this.startTimer():Ne.includes(e)&&this.stopTimer(),!0}return!1}firstUpdated(){const e=this.hass.states[this.entity].state;Ne.includes(e)&&this.startTimer(),this.addEventListener("click",this.handleClick),this.addEventListener("touchstart",()=>{this._touchStarted=!0}),this.addEventListener("touchend",()=>{setTimeout(()=>{this._touchStarted=!1},10)}),this.addEventListener("mouseenter",()=>{this._touchStarted||(this._hover=!0)}),this.addEventListener("mouseleave",()=>{this._hover=!1})}async startTimer(){var e,t;clearInterval(this.timer),(e=this.hass,t=this.entity,e.callWS({type:"alarmo/countdown",entity_id:t})).then(e=>{this.duration=e.delay,this.datetime=new Date((new Date).getTime()+1e3*e.remaining)}).catch(e=>{}),this.timer=window.setInterval(()=>{this.requestUpdate()},1e3)}stopTimer(){clearInterval(this.timer),this.datetime=null,this.duration=0}getRemaining(){if(!this.datetime)return 0;const e=(this.datetime.getTime()-(new Date).getTime())/1e3;return e<0?(clearInterval(this.timer),0):e}getFraction(){return this.duration?(Math.round(this.getRemaining())-1)/this.duration:1}_stateValue(e){return this._hover&&Ne.includes(e)&&this.timer?F` <ha-icon icon="mdi:skip-forward"></ha-icon> `:this.datetime&&this.duration?F` ${Math.max(Math.round(this.getRemaining()),0)} `:F` <ha-icon .icon=${Oe[e]}></ha-icon> `}handleClick(){const e=this.hass.states[this.entity].state;Ne.includes(e)&&this.timer?this.hass.callService("alarmo","skip_delay",{entity_id:this.entity}):Le(this,"hass-more-info",{entityId:this.entity})}render(){let e=45,t=2*Math.PI*e;const s=this.hass.states[this.entity],a=this.datetime&&this.duration;return F`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="track ${s.state.split("_").shift()} ${a?"timer":""}">
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
      <div class="overlay ${s.state.split("_").shift()} ${a?"timer":""}">
        <div class="value">${this._stateValue(s.state)}</div>
      </div>
    `}static get styles(){return r`
      :host {
        width: 60px;
        height: 60px;
        cursor: pointer;
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
        margin-top: -60px;
        margin-left: 0;
        width: 60px;
        height: 60px;
        font-size: 1.5em;
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
    `}}function Be(e){return null!=e}function Ue(e){switch(typeof e){case"object":return 0==Object.keys(e).length;case"string":return 0==String(e).length;default:return!Be(e)}}function Fe(e){return e.substring(0,e.indexOf("."))}e([pe()],Ie.prototype,"hass",void 0),e([pe()],Ie.prototype,"entity",void 0),e([me()],Ie.prototype,"_hover",void 0),customElements.define("hmac-state-badge",Ie);const qe=(e,t)=>{let s={hide:!1};return(t.states||{}).hasOwnProperty(e)&&(s=Object.assign(Object.assign({},s),t.states[e])),s},Ve=e=>{if(!e)return[];const t=e.attributes.supported_features||0;let s=[];return 2&t&&s.push(Ee.ArmAway),1&t&&s.push(Ee.ArmHome),4&t&&s.push(Ee.ArmNight),32&t&&s.push(Ee.ArmVacation),16&t&&s.push(Ee.ArmCustomBypass),s},We=(e,t,s)=>{const a=Fe(e.entity_id),o=e.attributes.device_class,i=e.state;if(Object.values(ze).includes(i)&&s){const e=qe(i,s);if(!Ue(e.state_label))return e.state_label}let r="";return o&&(r=t(`component.${a}.entity_component.${o}.state.${e.state}`)),r||(r=t(`component.${a}.entity_component._.state.${e.state}`)),r},Ke=e=>null!==e.attributes.code_format,Ze=(e,t,s=!1)=>{if(!e||!e.state)return"var(--state-unavailable-color)";let a=e.state;if(s){const s=Object.values(Ee).map(e=>Te[e]);if(!s.includes(a)){const t=e.attributes.arm_mode;t&&(a=t)}const o=[Ee.Disarm,...Ve(e)].filter(e=>!qe(Te[e],t).hide);1==o.length&&(a=Te[o[0]])}if(Object.keys(t.states||{}).includes(a)&&Be((t.states[a]||{}).color)){const e=t.states[a].color;return Object.values(De).includes(e)?`var(--${e}-color)`:e}return a==ze.Disarmed?"var(--state-alarm_control_panel-disarmed-color, var(--state-alarm_control_panel-inactive-color, var(--state-inactive-color)))":Object.values(ze).includes(a)?`var(--state-alarm_control_panel-${a}-color, var(--state-alarm_control_panel-active-color, var(--state-active-color)))`:"var(--disabled-color, var(--state-inactive-color))"};var Ge,Ye;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(Ge||(Ge={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(Ye||(Ye={}));class Je extends ne{shouldUpdate(e){const t=e.get("hass");return!t||!(!this.entity||t.states[this.entity]===this.hass.states[this.entity])}render(){if(!this.hass||!this.entity)return F``;const e=this.entity in this.hass.states;let t=Object.assign({},this.hass.states[this.entity]);void 0!==this.state&&(t=Object.assign(Object.assign({},t),{state:this.state}));const s=e?We(t,this.hass.localize):this.hass.localize("state.default.unavailable",this.hass.locale||{language:this.hass.language,number_format:Ge.language}),a=e?t.attributes.friendly_name||(o=t.entity_id).substring(o.indexOf(".")+1):this.entity;var o;let i=!!this.state||"on"==t.state;return F`
      <div class="badge-container" @click=${()=>Le(this,"hass-more-info",{entityId:this.entity})}>
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
        <div class="title">${a}</div>
      </div>
    `}static get styles(){return r`
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
    `}}e([pe()],Je.prototype,"hass",void 0),e([pe()],Je.prototype,"entity",void 0),e([pe()],Je.prototype,"state",void 0),customElements.define("hmac-sensor-badge",Je);class Xe extends ne{constructor(){super(...arguments),this.disabled=!1,this.scaled=!1}render(){return F`
      <button ?disabled=${this.disabled}>
        <slot></slot>
      </button>
    `}handleFocus(e){e.target.blur()}static get styles(){return r`
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
    `}}e([pe({type:Boolean})],Xe.prototype,"disabled",void 0),e([pe({type:Boolean})],Xe.prototype,"scaled",void 0),customElements.define("hmac-button",Xe);const Qe=t=>{class s extends t{connectedCallback(){super.connectedCallback(),this.__checkSubscribed()}disconnectedCallback(){if(super.disconnectedCallback(),this.__unsubs){for(;this.__unsubs.length;){const e=this.__unsubs.pop();e instanceof Promise?e.then(e=>e()):e()}this.__unsubs=void 0}}updated(e){super.updated(e),e.has("hass")&&this.__checkSubscribed()}hassSubscribe(){return[]}__checkSubscribed(){void 0===this.__unsubs&&this.isConnected&&void 0!==this.hass&&(this.__unsubs=this.hassSubscribe())}}return e([pe({attribute:!1})],s.prototype,"hass",void 0),s};var et={heading:"Možnosti aktivace",skip_delay:"Přeskočit čas pro vystup",force:"Bypass otevřených senzorů"},tt={keep_keypad_visible:"Zachovat klávesnici vždy viditelnou, i když není vyžadován žádný kód.",button_scale_actions:"Měřítko použité pro změnu velikosti tlačítek akcí.",button_scale_keypad:"Měřítko použité pro změnu velikosti tlačítek klávesnice.",show_messages:"Zobrazit diagnostické zprávy při spuštění alarmu nebo nemožnosti aktivace.",show_ready_indicator:"Zobrazit indikátor připraveno/nepřipraveno na tlačítkách režimu aktivace.",show_bypassed_sensors:"Zobrazit varování při aktivaci alarmu s přemostěnými senzory.",use_code_dialog:"Zobrazte klávesnici pro zadání kódu jako vyskakovací dialog.",hide_keypad:"Skrýt tlačítka klávesnice pro zadávání kódu.",available_actions:"Dostupné akce:",action_dialog:{title:"Upravit zobrazení akce '{action}'",show_button:{title:"Viditelnost akčního tlačítka",options:{always:"Vždy zobrazeno",never:"Nikdy zobrazeno",disarmed:"Zobrazit pouze při odzbrojení",armed:"Zobrazit pouze při zapnutí"}},button_label:"Přepsat popisek tlačítka",button_icon:"Ikona zobrazeného tlačítka",state_label:"Přepsat popisek stavu",color:"Přepsat barvu použitou pro akci"}},st={invalid_pin:"Neplatný",blocking_sensors:"Nelze aktivovat kvůli následujícím senzorům",triggered_sensors:"Alarm byl spuštěn následujícími senzory",bypassed_sensors:"Jsou tam přemostěné senzory"},at={arm_options:et,editor:tt,errors:st},ot={heading:"Scharfschaltungsoptionen",skip_delay:"Ausgangsverzögerung überspringen",force:"Offene Sensoren ignorieren"},it={keep_keypad_visible:"Zeige das Pin-Eingabefeld immer an, auch wenn kein Code erfordert ist.",button_scale_actions:"Skalierungsfaktor für Buttongröße der Aktionen.",button_scale_keypad:"Skalierungsfaktor für Buttongröße der Pin-Eingabefeld.",show_messages:"Anzeige von Diagnosemeldungen, wenn der Alarm ausgelöst wird oder nicht scharf geschaltet werden kann.",show_ready_indicator:"Zeigt die Bereitschafts-/Nicht-Bereitschaftsanzeige auf den Scharfschaltmodus-Tasten an.",show_bypassed_sensors:"Warnung anzeigen, wenn der Alarm mit umgangenen Sensoren aktiviert wird.",use_code_dialog:"Zeigen Sie die Tastatur zur Codeeingabe als Popup-Dialog an.",hide_keypad:"Blenden Sie die Tasten der Tastatur zur Codeeingabe aus.",available_actions:"Verfügbare Aktionen:",action_dialog:{title:"Anzeige der Aktion '{action}' anpassen",show_button:{title:"Sichtbarkeit der Aktionsschaltfläche",options:{always:"Immer angezeigt",never:"Nie angezeigt",disarmed:"Nur im deaktivierten Zustand anzeigen",armed:"Nur im aktivierten Zustand anzeigen"}},button_label:"Überschreibung der Tastenbeschriftung",button_icon:"Angezeigtes Schaltflächensymbol",state_label:"Überschreibung der Statusbezeichnung",color:"Die für die Aktion verwendete Farbe überschreiben"}},rt={invalid_pin:"Ungültig",blocking_sensors:"Konnte nicht scharf geschaltet werden, da folgende Sensoren geöffnet sind",triggered_sensors:"Alarm wurde durch folgende Sensoren ausgelöst",bypassed_sensors:"Es gibt umgangene Sensoren"},nt={arm_options:ot,editor:it,errors:rt},lt={heading:"Επιλογές για όπλισμα",skip_delay:"Παράλειψη καθυστέρησης εξόδου",force:"Παράκαμψη ανοιχτών αισθητήρων"},ct={keep_keypad_visible:"Κράτησε το πληκτρολόγιο πάντα ορατό, ακόμη και όταν δεν απαιτείται εισαγωγή κωδικού.",button_scale_actions:"Συντελεστής κλίμακας για αλλαγή μεγέθους των κουμπιών ενεργειών.",button_scale_keypad:"Συντελεστής κλίμακας για αλλαγή μεγέθους των κουμπιών του πληκτρολογίου.",show_messages:"Εμφάνιση διαγνωστικών μηνυμάτων όταν ενεργοποιείται ο συναγερμός ή δεν μπορεί να οπλιστεί.",show_ready_indicator:"Εμφάνιση ένδειξης έτοιμο/μη έτοιμο στα κουμπιά λειτουργίας όπλισης.",show_bypassed_sensors:"Εμφάνιση προειδοποιητικού μηνύματος όταν ο συναγερμός οπλίζεται με παρακαμφθέντες αισθητήρες.",use_code_dialog:"Εμφανίστε το πληκτρολόγιο για την εισαγωγή του κωδικού ως αναδυόμενο παράθυρο διαλόγου.",hide_keypad:"Απόκρυψη των κουμπιών του πληκτρολογίου για την εισαγωγή του κωδικού.",available_actions:"Διαθέσιμες ενέργειες:",action_dialog:{title:"Προσαρμογή εμφάνισης της ενέργειας '{action}'",show_button:{title:"Ορατότητα κουμπιού ενέργειας",options:{always:"Εμφανίζεται πάντα",never:"Ποτέ δεν εμφανίζεται",disarmed:"Εμφάνιση μόνο όταν είναι αφοπλισμένο",armed:"Εμφάνιση μόνο όταν είναι οπλισμένο"}},button_icon:"Εμφανιζόμενο εικονίδιο κουμπιού",state_label:"Αντικατάσταση ετικέτας κατάστασης",color:"Παράκαμψη χρώματος που χρησιμοποιείται για την ενέργεια"}},dt={invalid_pin:"Ακυρος",blocking_sensors:"Δεν ήταν δυνατή η όπλιση λόγω των ακόλουθων αισθητήρων",triggered_sensors:"Ο συναγερμός ενεργοποιήθηκε από τους ακόλουθους αισθητήρες",bypassed_sensors:"Υπάρχουν παρακαμφθέντες αισθητήρες"},ht={arm_options:lt,editor:ct,errors:dt},pt={heading:"Options for arming",skip_delay:"Skip exit delay",force:"Bypass open sensors"},mt={keep_keypad_visible:"Keep the keypad always visible, also when no code input is required.",button_scale_actions:"Scaling factor to apply for resizing the action buttons.",button_scale_keypad:"Scaling factor to apply for resizing the keypad buttons.",show_messages:"Display diagnostic messages when alarm is triggered or cannot be armed.",show_ready_indicator:"Show ready/not ready indicator on arm mode buttons.",show_bypassed_sensors:"Show warning message when alarm is armed with bypassed sensors.",use_code_dialog:"Display the keypad for entering the code as a popup dialog.",hide_keypad:"Hide the keypad buttons for entering the code.",available_actions:"Available actions:",action_dialog:{title:"Customize display of action '{action}'",show_button:{title:"Button visibility",options:{always:"Always shown",never:"Never shown",disarmed:"Show only when disarmed",armed:"Hide only when disarmed"}},button_label:"Override displayed action label",button_icon:"Override displayed icon",state_label:"Override displayed state label",color:"Override color used for the action"}},ut={invalid_pin:"Invalid",blocking_sensors:"Could not arm due to the following sensors",triggered_sensors:"Alarm was triggered by the following sensors",bypassed_sensors:"There are bypassed sensors"},gt={arm_options:pt,editor:mt,errors:ut},_t={heading:"Opciones de armado",skip_delay:"Omitir el retardo de salida",force:"Pasar por alto los sensores abiertos"},bt={keep_keypad_visible:"Mantener el teclado siempre visible, también cuando no se requiere ninguna entrada de código.",button_scale_actions:"Factor de escalado para cambiar el tamaño de los botones de acción.",button_scale_keypad:"Factor de escalado para cambiar el tamaño de los botones del teclado.",show_messages:"Mostrar mensajes de diagnóstico cuando se activa la alarma o no se puede activar.",show_ready_indicator:"Mostrar indicador listo/no listo en los botones de modo armado.",show_bypassed_sensors:"Mostrar advertencia cuando la alarma está activada con sensores omitidos.",use_code_dialog:"Muestra el teclado para ingresar el código como un cuadro de diálogo emergente.",hide_keypad:"Ocultar los botones del teclado para ingresar el código.",available_actions:"Acciones disponibles:",action_dialog:{title:"Personalizar la visualización de la acción '{action}'",show_button:{title:"Visibilidad del botón de acción",options:{always:"Mostrar siempre",never:"Ocultar siempre",disarmed:"Mostrar solo si desarmada",armed:"Ocultar solo si desarmada"}},button_label:"Sobrescribir el texto del botón",button_icon:"Icono de botón mostrado",state_label:"Sobrescribir el texto de estado",color:"Anular el color utilizado para la acción"}},vt={invalid_pin:"Inválido",blocking_sensors:"No se pudo armar debido a los siguientes sensores",triggered_sensors:"La alarma fue disparada por los siguientes sensores",bypassed_sensors:"Hay sensores omitidos"},ft={arm_options:_t,editor:bt,errors:vt},yt={heading:"Options pour l'armement",skip_delay:"Ignorer le délai de sortie",force:"Bypasser les capteurs ouverts"},wt={keep_keypad_visible:"Gardez le clavier toujours visible, même lorsqu'aucune saisie de code n'est requise.",button_scale_actions:"Facteur d'échelle à appliquer pour le redimensionnement des boutons des actions.",button_scale_keypad:"Facteur d'échelle à appliquer pour le redimensionnement des boutons du clavier.",show_messages:"Afficher les messages de diagnostic lorsque l'alarme est déclenchée ou ne peut pas être armée.",show_ready_indicator:"Afficher l'indicateur prêt/pas prêt sur les boutons de mode d'armement.",show_bypassed_sensors:"Afficher un avertissement lorsque l'alarme est armée avec des capteurs ignorés.",use_code_dialog:"Affichez le clavier pour saisir le code sous forme de boîte de dialogue contextuelle.",hide_keypad:"Masquer les boutons du clavier pour saisir le code.",available_actions:"Actions disponibles:",action_dialog:{title:"Personnaliser l'affichage de l'action '{action}'",show_button:{title:"Visibilité du bouton d'action",options:{always:"Toujours affiché",never:"Jamais affiché",disarmed:"Afficher uniquement si désarmé",armed:"Afficher uniquement si armé"}},button_label:"Remplacer le libellé du bouton",button_icon:"Icône de bouton affichée",state_label:"Remplacer l'étiquette d'état",color:"Remplacer la couleur utilisée pour l'action"}},kt={invalid_pin:"Invalide",blocking_sensors:"Impossible d'armer en raison du(es) capteur(s) suivant(s)",triggered_sensors:"L'alarme a été déclenchée par le(s) capteur(s) suivant(s)",bypassed_sensors:"Il y a des capteurs ignorés"},$t={arm_options:yt,editor:wt,errors:kt},xt={heading:"Opzioni di inserimento",skip_delay:"Ignorare il ritardo di uscita",force:"Ignorare i sensori aperti"},At={keep_keypad_visible:"Mantenere la tastiera sempre visibile, anche quando nessun codice è richiesto.",button_scale_actions:"Fattore di scala da applicare per ridimensionare i pulsanti di azione.",button_scale_keypad:"Fattore di scala da applicare per ridimensionare i pulsanti della tastiera.",show_messages:"Mostrare messaggi diagnostici quando l'allarme viene attivato o non può essere inserito.",show_ready_indicator:"Mostra l'indicatore pronto/non pronto sui pulsanti della modalità di inserimento.",show_bypassed_sensors:"Mostra avviso quando l'allarme è armato con sensori esclusi.",use_code_dialog:"Visualizza la tastiera per l'immissione del codice come finestra di dialogo popup.",hide_keypad:"Nascondi i pulsanti della tastiera per l'inserimento del codice.",available_actions:"Azioni disponibili:",action_dialog:{title:"Personalizzare la visualizzazione dell'azione '{action}'",show_button:{title:"Visibilità del pulsante di azione",options:{always:"Sempre visualizzato",never:"Mai visualizzato",disarmed:"Mostra solo quando disarmato",armed:"Mostra solo quando disarmato"}},button_label:"Sovrascrivere l'etichetta del pulsante",button_icon:"Icona del pulsante visualizzato",state_label:"Sovrascrivere l'etichetta di stato",color:"Sostituisci il colore utilizzato per l'azione"}},St={invalid_pin:"Non valido",blocking_sensors:"Impossibile inserire l'allarme a causa dei seguenti sensori",triggered_sensors:"L'allarme è stato attivato dai seguenti sensori",bypassed_sensors:"Sono presenti sensori esclusi"},Ct={arm_options:xt,editor:At,errors:St},zt={heading:"Opties voor inschakelen",skip_delay:"Sla vertraging over",force:"Negeer open sensoren"},Ot={keep_keypad_visible:"Houd het keypad altijd zichtbaar, ook wanneer er geen code vereist is.",button_scale_actions:"Schaalfactor actieknoppen",button_scale_keypad:"Schaalfactor keypadknoppen",show_messages:"Toon diagnostische berichten wanneer het alarm wordt geactiveerd of niet kan worden ingeschakeld.",show_ready_indicator:"Toon gereed/niet gereed-indicator op inschakelmodusknoppen.",show_bypassed_sensors:"Toon melding wanneer het alarm is ingeschakeld met omzeilde sensoren.",use_code_dialog:"Geef het toetsenbord voor het invoeren van de code weer als een pop-upvenster.",hide_keypad:"Verberg het toetsenbord voor het invoeren van de code.",available_actions:"Beschikbare acties:",action_dialog:{title:"Weergave van actie '{action}' aanpassen",show_button:{title:"Actieknop weergave",options:{always:"Altijd zichtbaar",never:"Nooit zichtbaar",disarmed:"Toon alleen bij uitgeschakeld",armed:"Zichtbaar tenzij uitgeschakeld"}},button_label:"Weergegeven naam voor actie",button_icon:"Weergegeven icoon voor actie",state_label:"Weergegeven status",color:"Weergegeven kleur voor action"}},Et={invalid_pin:"Ongeldig",blocking_sensors:"Kon niet inschakelen vanwege de volgende sensoren",triggered_sensors:"Alarm werd geactiveerd door de volgende sensoren",bypassed_sensors:"Er zijn omzeilde sensoren"},Mt={arm_options:zt,editor:Ot,errors:Et},Tt={heading:"Opções para armar",skip_delay:"Omitir tempo para sair",force:"Ignorar os sensores abertos"},jt={keep_keypad_visible:"Mantenha o teclado sempre visível, mesmo quando não for necessária nenhuma entrada de código.",button_scale_actions:"Fator de escala para redimensionar botões de ação.",button_scale_keypad:"Fator de escala para redimensionar os botões do teclado.",show_messages:"Mostrar mensagens de diagnóstico quando o alarme estiver disparado ou não puder ser armado.",show_ready_indicator:"Mostrar indicador de disponível/não disponível nos botões do modo de armar.",show_bypassed_sensors:"Mostrar aviso quando o alarme for ativado com sensores ignorados.",use_code_dialog:"Exiba o teclado para inserir o código como uma caixa de diálogo pop-up.",hide_keypad:"Oculte os botões do teclado para inserir o código.",available_actions:"Ações disponíveis:",action_dialog:{title:"Personalize a exibição da ação '{action}'",show_button:{title:"Visibilidade do botão de ação",options:{always:"Sempre visível",never:"Sempre visível",disarmed:"Mostrar somente quando desarmado",armed:"Mostrar somente quando armado"}},button_label:"Substituir texto do botão",button_icon:"Ícone de botão exibido",state_label:"Substituir texto de status",color:"Substituir a cor usada para a ação"}},Pt={invalid_pin:"Inválido",blocking_sensors:"Não foi possível armar devido aos seguintes sensores",triggered_sensors:"O alarme foi disparado pelos seguintes sensores",bypassed_sensors:"Existem sensores ignorados"},Nt={arm_options:Tt,editor:jt,errors:Pt},Rt={heading:"Варианты постановки на охрану",skip_delay:"Задержка перед выходом",force:"Обход датчиков открытия"},Ht={keep_keypad_visible:"Клавиатура всегда видима, даже если ввод кода не требуется.",button_scale_actions:"Коэффициент масштабирования для изменения размера кнопок действий.",button_scale_keypad:"Коэффициент масштабирования для изменения размера кнопок клавиатуры.",show_messages:"Вывод диагностических сообщений, когда срабатывает сигнализация или ее невозможно включить.",show_ready_indicator:"Отображать индикатор готовности/неготовности на кнопках режима охраны.",show_bypassed_sensors:"Вывод предупреждающего сообщения, когда сигнализация включена с помощью обходных датчиков.",use_code_dialog:"Отобразить клавиатуру для ввода кода в виде всплывающего диалогового окна.",hide_keypad:"Скрыть кнопки клавиатуры для ввода кода.",available_actions:"Доступные действия:",action_dialog:{title:"Настройка отображения действия '{action}'",show_button:{title:"Видимость кнопки действия",options:{always:"Показывать всегда",never:"Показывать никогда",disarmed:"Показывать только при снятии с охраны",armed:"Показывать только при поддержании под охраной"}},button_label:"Измененение названия кнопки",button_icon:"Отображаемый значок кнопки",state_label:"Изменение названия состояния",color:"Переопределить цвет, используемый для действия"}},Dt={invalid_pin:"Неверный",blocking_sensors:"Не удалось включить охрану из-за следующих датчиков",triggered_sensors:"Сигнал тревоги был вызван следующими датчиками",bypassed_sensors:"Есть обходные датчики"},Lt={arm_options:Rt,editor:Ht,errors:Dt},It={heading:"Alternativ vid aktivering",skip_delay:"Hoppa över lämna fördröjning",force:"Förbikoppla öppna sensorer"},Bt={keep_keypad_visible:"Håll knappsatsen alltid synlig, även när ingen kodinmatning krävs.",button_scale_actions:"Ändra storlek på åtgärdsknapparna.",button_scale_keypad:"Ändra storlek på knapparna på knappsatsen.",show_messages:"Visa diagnostiska meddelanden när larmet utlöses eller inte kan aktiveras.",show_ready_indicator:"Visa redo/ej redo-indikator på lägesknapparna.",show_bypassed_sensors:"Visa varningsmeddelande när larmet är aktiverat med förbikopplade sensorer.",use_code_dialog:"Visa knappsatsen för att ange koden som en popup-dialogruta.",hide_keypad:"Dölj knapparna på tangentbordet för att ange koden.",available_actions:"Tillgängliga åtgärder:",action_dialog:{title:"Anpassa visningen av åtgärden '{action}'",show_button:{title:"Synlighet för åtgärdsknapp",options:{always:"Visas alltid",never:"Visas aldrig",disarmed:"Visa endast vid avaktivering",armed:"Visa endast vid aktivering"}},button_label:"Anpassad knappetikett",button_icon:"Visad knappikon",state_label:"Anpassad tillståndsetikett",color:"Åsidosättningsfärg som används för åtgärden"}},Ut={invalid_pin:"Ogiltig",blocking_sensors:"Kunde inte aktivera på grund av följande sensorer",triggered_sensors:"Larmet utlöstes av följande sensorer",bypassed_sensors:"Det finns förbikopplade sensorer"},Ft={arm_options:It,editor:Bt,errors:Ut},qt={heading:"警戒选项",skip_delay:"跳过离开延迟",force:"绕过开放的传感器"},Vt={keep_keypad_visible:"保持小键盘总是可见，即使不需要输入密码",button_scale_actions:"调整动作按键大小的缩放系数",button_scale_keypad:"调整小键盘按键大小的缩放系数",show_messages:"当警报被触发或无法警戒时，显示诊断信息。",show_ready_indicator:"在手臂模式按钮上显示就绪/未就绪指示器。",show_bypassed_sensors:"当警报配备旁路传感器时显示警告消息。",use_code_dialog:"以弹出对话框的形式显示用于输入代码的键盘。",hide_keypad:"隐藏用于输入代码的键盘按钮。",available_actions:"可用动作：",action_dialog:{title:"自定义动作'{action}'的显示",show_button:{title:"操作按钮可见性",options:{always:"始终显示",never:"从不显示",disarmed:"仅在解除武装时显示",armed:"仅在武装时显示"}},button_label:"覆盖按钮标签",button_icon:"显示的按钮图标",state_label:"覆盖状态标签",color:"覆盖操作使用的颜色"}},Wt={invalid_pin:"无效的",blocking_sensors:"由于以下传感器而无法警戒",triggered_sensors:"警报是由以下传感器触发的",bypassed_sensors:"有绕过的传感器"},Kt={arm_options:qt,editor:Vt,errors:Wt},Zt={cs:Object.freeze({__proto__:null,arm_options:et,default:at,editor:tt,errors:st}),de:Object.freeze({__proto__:null,arm_options:ot,default:nt,editor:it,errors:rt}),el:Object.freeze({__proto__:null,arm_options:lt,default:ht,editor:ct,errors:dt}),en:Object.freeze({__proto__:null,arm_options:pt,default:gt,editor:mt,errors:ut}),es:Object.freeze({__proto__:null,arm_options:_t,default:ft,editor:bt,errors:vt}),fr:Object.freeze({__proto__:null,arm_options:yt,default:$t,editor:wt,errors:kt}),it:Object.freeze({__proto__:null,arm_options:xt,default:Ct,editor:At,errors:St}),nl:Object.freeze({__proto__:null,arm_options:zt,default:Mt,editor:Ot,errors:Et}),"pt-BR":Object.freeze({__proto__:null,arm_options:Tt,default:Nt,editor:jt,errors:Pt}),ru:Object.freeze({__proto__:null,arm_options:Rt,default:Lt,editor:Ht,errors:Dt}),sv:Object.freeze({__proto__:null,arm_options:It,default:Ft,editor:Bt,errors:Ut}),"zh-Hans":Object.freeze({__proto__:null,arm_options:qt,default:Kt,editor:Vt,errors:Wt})};function Gt(e,t,s="",a=""){const o=t.replace(/['"]+/g,"");var i;try{i=e.split(".").reduce((e,t)=>e[t],Zt[o])}catch(t){i=e.split(".").reduce((e,t)=>e[t],Zt.en)}if(void 0===i&&(i=e.split(".").reduce((e,t)=>e[t],Zt.en)),""!==s&&""!==a){Array.isArray(s)||(s=[s]),Array.isArray(a)||(a=[a]);for(let e=0;e<s.length;e++)i=i.replace(s[e],a[e])}return i}const Yt=["1","2","3","4","5","6","7","8","9","0","clear","submit"];let Jt=class extends(Qe(ne)){constructor(){super(...arguments),this._input="",this._showClearButton=!1,this._narrow=!1,this._codeClearTimer=0}hassSubscribe(){return[this.hass.connection.subscribeMessage(e=>this._fetchData(e),{type:Pe})]}async _fetchData(e){var t;if(e.data.area_id===(null===(t=this._params)||void 0===t?void 0:t.area_id))switch(e.data.event){case je.Disarm:case je.Arm:case je.Trigger:this._confirm(e.data.event);break;case je.InvalidCodeProvided:case je.NoCodeProvided:this._showCodeError();break;case je.FailedToArm:case je.CommandNotAllowed:this._confirm(e.data.event);case je.TriggerTimeExpired:case je.ReadyToArmModesChanged:}}shouldUpdate(e){const t=e.get("hass");return!(!e.has("_params")&&this._params)||(!!e.has("_input")||(!t||t.states[this._params.entity_id]!==this.hass.states[this._params.entity_id]&&(t.states[this._params.entity_id],this.hass.states[this._params.entity_id],!0)))}firstUpdated(e){super.firstUpdated(e),this.addEventListener("keypress",e=>{"Enter"===e.key&&this._input.length&&this._submit()})}async showDialog(e){this._params=e,this._input="",this._narrow=matchMedia("all and (max-width: 450px), all and (max-height: 500px)").matches,await this.updateComplete}closeDialog(){return this._params=void 0,this._showClearButton=!1,!0}_showCodeError(){var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#code");t&&(t.classList.remove("error"),t.classList.add("error"),t.hint=Gt("errors.invalid_pin",this.hass.language))}_clearCodeError(){var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#code");t&&t.classList.contains("error")&&(t.classList.remove("error"),t.hint="",this._input="",this._cancelCodeClearTimer())}_clearCode(){this._input="",this._clearCodeError(),this._cancelCodeClearTimer()}_setCodeClearTimer(){this._cancelCodeClearTimer(),this._input.length&&(this._codeClearTimer=window.setTimeout(()=>{this._clearCode()},12e4))}_cancelCodeClearTimer(){this._codeClearTimer&&clearTimeout(this._codeClearTimer)}_submit(){var e;const t=null!==(e=this._input)&&void 0!==e?e:"";this._clearCodeError(),this._params.action==Ee.Disarm?this.hass.callService("alarmo","disarm",{entity_id:this._params.entity_id,code:t}):this.hass.callService("alarmo","arm",Object.assign(Object.assign({},this._params.armOptions),{entity_id:this._params.entity_id,mode:Te[this._params.action],code:t}))}_confirm(e){var t,s;null===(s=null===(t=this._params)||void 0===t?void 0:t.confirm)||void 0===s||s.call(t,e),this.closeDialog()}_cancel(){var e,t;null===(t=null===(e=this._params)||void 0===e?void 0:e.cancel)||void 0===t||t.call(e),this.closeDialog()}_numberClick(e){const t=e.currentTarget.value;this._clearCodeError(),this._setCodeClearTimer(),this._input=this._input+t,this._showClearButton=!0}_clear(){this._input="",this._showClearButton=!1}render(){if(!this._params||!this.hass)return V;return"text"===this._params.code_format?F`
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
      `:F`
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
            ${Yt.map(e=>""===e?F`<span></span>`:"clear"===e?F`
                      <ha-control-button
                        @click=${this._clear}
                        class="clear"
                        .disabled=${!this._showClearButton}
                        .label=${this.hass.localize("ui.common.clear")}
                      >
                        <ha-svg-icon path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}></ha-svg-icon>
                      </ha-control-button>
                    `:"submit"===e?F`
                        <ha-control-button
                          @click=${this._submit}
                          class="submit"
                          .label=${this.hass.localize("ui.common.submit")}
                        >
                          <ha-svg-icon path=${"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"}></ha-svg-icon>
                        </ha-control-button>
                      `:F`
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
    `}};Jt.styles=r`
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
  `,e([pe({attribute:!1})],Jt.prototype,"hass",void 0),e([me()],Jt.prototype,"_params",void 0),e([me()],Jt.prototype,"_input",void 0),e([me()],Jt.prototype,"_showClearButton",void 0),e([me()],Jt.prototype,"_narrow",void 0),Jt=e([ce("hmac-code-dialog")],Jt);var Xt=Object.freeze({__proto__:null,get AlarmoCodeDialog(){return Jt}});let Qt=class extends ne{render(){if(!this.hass||!this.config)return V;const e=this.hass.states[this.config.entity];let t=e.state;const s=Object.values(Ee).map(e=>Te[e]);if(!s.includes(t)){const s=e.attributes.arm_mode;s&&(t=s)}const a=this.config.button_style||{};return F`
      <div class="container ${a.text_follows_icon?"follow":""}" style=${a.track?`--b-track:${String("none"===a.track?"transparent":a.track).replace(/[;{}<>]/g,"")};--b-track-opacity:1`:""}>
        ${this._renderOptions(t)}
      </div>
    `}_renderOptions(e){const t=this.hass.states[this.config.entity],s=[Ee.Disarm,...Ve(t)].filter(e=>{const s=qe(Te[e],this.config).hide;if("boolean"==typeof s||!Be(s))return!s;switch(s){case"always":return!1;case"never":return!0;case"armed":return"disarmed"==t.state;case"disarmed":return"disarmed"!==t.state}}),a=s.map(e=>qe(Te[e],this.config)).some(e=>!Be(e.button_label)||e.button_label.length);return s.sort((e,t)=>{const s=qe(Te[e],this.config).button_order,a=qe(Te[t],this.config).button_order;return Be(s)||Be(a)?Be(s)&&!Be(a)?-1:!Be(s)&&Be(a)?1:s-a:0}),s.map(s=>{const o=Be(this.readyForArmModes)&&!this.readyForArmModes.includes(Te[s])&&s!=Ee.Disarm,i=qe(Te[s],this.config);return F`
        <div class="button ${Te[s]==e?"selected":""}"
          style="${this._buttonStyle(Ze(Object.assign(Object.assign({},t),{state:Te[s]}),this.config))}"
          @click=${e=>this._handleClick(e,s)}>
          <div class="content ${a&&!1!==this.config.show_labels?"has-text":""}">
            ${!1===this.config.show_icons?V:F`<ha-icon icon="${Ue(i.button_icon)?Me[s]:i.button_icon}"></ha-icon>`}
            ${Te[s]!=e&&Be(this.readyForArmModes)?F`
              <ha-icon
                icon="${"mdi:circle-medium"}"
                class="badge ${o?"error":"success"}"
              ></ha-icon>
            `:V}
            ${!1===this.config.show_labels?V:F`<span>
              ${Be(i.button_label)?i.button_label:s==Ee.Disarm&&t.state!==ze.Disarmed?this.hass.localize(`ui.card.alarm_control_panel.${s}`):this.hass.localize(`ui.card.alarm_control_panel.modes.${Te[s]}`)}
            </span>`}
          </div>
        </div>
      `})}_buttonStyle(e){const t=this.config.button_style||{},s=this.config.icon_style||{},a=t=>void 0===t||""===t?void 0:"mode"===t?e:"none"===t?"transparent":String(t).replace(/[;{}<>]/g,"");return[["--btn-color",e],["--b-bg",a(t.background)],["--b-abg",a(t.active_background)],["--b-bd",a(t.border)],["--b-abd",a(t.active_border)],["--b-ic",a(s.color)],["--b-aic",a(s.active_color)]].filter(([,e])=>e).map(([e,t])=>`${e}:${t}`).join(";")}_handleClick(e,t){Le(this,"button-clicked",{ev:e,action:t})}static get styles(){return r`
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
        padding: 8px 2px;
        overvlow: hidden;
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
    `}};e([pe({attribute:!1})],Qt.prototype,"hass",void 0),e([pe({attribute:!1})],Qt.prototype,"config",void 0),e([pe({attribute:!1})],Qt.prototype,"readyForArmModes",void 0),Qt=e([ce("hmac-actions-bar")],Qt);const es=["1","2","3","4","5","6","7","8","9","","0","clear"],ts=new Map;let ss=class extends(Qe(ne)){constructor(){super(...arguments),this._input="",this.warning="",this.area_id=void 0,this.armOptions=Object.assign({},He),this.readyForArmModes=null,this.backendConnection=null,this.showBypassedSensors=!1,this.subscribedEntities=[],this._codeClearTimer=0}async getCardSize(){var e;if(!this._config||!this.hass)return 9;const t=this.hass.states[this._config.entity];return t&&(null===(e=this._alarmoConfig)||void 0===e?void 0:e.code_format)===Ce?!Ke(t)&&!this._config.keep_keypad_visible||this._config.use_code_dialog?4:9:4}set cardConfig(e){e&&JSON.stringify(e)!==JSON.stringify(this._cardConfigRaw)&&(this._cardConfigRaw=e,this.setConfig(e))}setConfig(e){!(null==e?void 0:e.button_scale_actions)&&(null==e?void 0:e.button_scale)&&(e=Object.assign(Object.assign({},e),{button_scale_actions:null==e?void 0:e.button_scale})),!(null==e?void 0:e.button_scale_keypad)&&(null==e?void 0:e.button_scale)&&(e=Object.assign(Object.assign({},e),{button_scale_keypad:null==e?void 0:e.button_scale})),(e=>{if(!e||!e.entity||"alarm_control_panel"!==Fe(e.entity))throw new Error("Invalid configuration provided for entity");if(Be(e.button_scale_keypad)&&("number"!=typeof e.button_scale_keypad||e.button_scale_keypad<1||e.button_scale_keypad>2.5))throw new Error("Invalid configuration provided for button_scale_keypad");if(Be(e.button_scale_actions)&&("number"!=typeof e.button_scale_actions||e.button_scale_actions<1||e.button_scale_actions>2.5))throw new Error("Invalid configuration provided for button_scale_actions")})(e),this._config=Object.assign(Object.assign({},Re),e),this.restoreBackend()}hassSubscribe(){return[this.hass.connection.subscribeMessage(e=>this._fetchData(e),{type:Pe})]}restoreBackend(){const e=this._config?ts.get(this._config.entity):void 0;e&&!this.backendConnection&&(this.area_id=e.area_id,this._alarmoConfig=e.alarmoConfig,this.readyForArmModes=e.ready,this.backendConnection=!0)}async firstUpdated(){this.restoreBackend();const e=await window.loadCardHelpers(),t=await e.createCardElement({type:"entities",entities:[]});await t.constructor.getConfigElement(),await this.loadBackendConfig()}async loadBackendConfig(){var e;this.backendConnection&&!ts.has(this._config.entity)||(e=this.hass,e.callWS({type:"alarmo/entities"})).then(e=>{const t=e.find(e=>e.entity_id==this._config.entity);t&&(this.area_id=t.area_id?t.area_id:null)}).then(()=>(e=>e.callWS({type:"alarmo/config"}))(this.hass)).then(e=>{this._alarmoConfig=e,this.backendConnection=!0}).then(()=>((e,t)=>e.callWS({type:"alarmo/ready_to_arm_modes",entity_id:t}))(this.hass,this._config.entity)).then(e=>{this.readyForArmModes=e.modes,ts.set(this._config.entity,{area_id:this.area_id,alarmoConfig:this._alarmoConfig,ready:e.modes})}).catch(e=>{this.backendConnection=!1})}async _fetchData(e){if(e.data.area_id===this.area_id)switch(e.data.event){case je.Arm:this._clearCode();break;case je.Trigger:break;case je.InvalidCodeProvided:case je.NoCodeProvided:this._showCodeError(),this.subscribedEntities=[];break;case je.FailedToArm:this.warning="blocking_sensors",this._last_command=e.data.command,this._last_code=this._input,this._clearCode();break;case je.CommandNotAllowed:this._clearCode();break;case je.TriggerTimeExpired:break;case je.ReadyToArmModesChanged:this.readyForArmModes=e.data.modes}}shouldUpdate(e){if(e.has("_config"))return!0;const t=e.get("hass");if(!t||t.themes!==this.hass.themes||t.language!==this.hass.language||t.config.state!==this.hass.config.state)return!0;if(t.states[this._config.entity]!==this.hass.states[this._config.entity]){const e=t.states[this._config.entity],s=this.hass.states[this._config.entity];return!1===this.backendConnection&&(async()=>{await this.loadBackendConfig()})(),this.processStateUpdate(e,s),!0}return!(!this.subscribedEntities.length||!this.subscribedEntities.some(e=>t.states[e]!==this.hass.states[e]))}processStateUpdate(e,t){t.state!=e.state&&(this.subscribedEntities=[]),(t.state==ze.Disarmed||t.last_changed!==e.last_changed)&&this._clearCode()}render(){var e,t;if(!this._config||!this.hass||null===this.backendConnection)return F``;const s=this.hass.states[this._config.entity];return s?!1===this.backendConnection?F`
        <hui-warning>
          Could not establish a connection with the alarmo integration. Please check if it is installed and the correct
          entity is selected in the card settings.
        </hui-warning>
      `:F`
      <ha-card>
        <div class="header">
${!1===this._config.show_icon?"":F`<div class="icon">
            <hmac-state-badge
              .hass=${this.hass}
              .entity=${this._config.entity}
              style="--alarm-state-color: ${Ze(s,this._config)}"
            >
            </hmac-state-badge>
          </div>`}
          <div class="summary">
            ${!1===this._config.show_name?"":F`<div class="name">
              ${((e,t)=>Ue(t.name)?e.attributes.friendly_name:t.name)(s,this._config)}
            </div>`}
            ${!1===this._config.show_state?"":F`<div class="state">
              ${We(s,this.hass.localize,this._config)}
            </div>`}
          </div>
        </div>

        ${this._renderWarning()}

        <div id="actions" class="actions">
          ${this._renderActions()}
        </div>

        ${s.state===ze.Disarmed&&!1!==this._config.show_arm_options?F`
          <div class="chips" role="group" aria-label=${Gt("arm_options.heading",this.hass.language)}>
            ${["skip_delay","force"].map(e=>F`
              <button class="chip ${this.armOptions[e]?"on":""}" aria-pressed=${this.armOptions[e]?"true":"false"}
                @click=${t=>this._toggleArmOptions(t,e)}>
                <ha-icon icon=${this.armOptions[e]?"mdi:check":"skip_delay"===e?"mdi:timer-off-outline":"mdi:shield-alert-outline"}></ha-icon>
                ${Gt(`arm_options.${e}`,this.hass.language)}
              </button>`)}
          </div>`:""}

        ${!Ke(s)&&!this._config.keep_keypad_visible||this._config.use_code_dialog?F``:F`
              <ha-input
                .value=${this._input}
                .label=${this.hass.localize("ui.card.alarm_control_panel.code")}
                ?disabled=${!Ke(s)}
                @input=${e=>{this._clearCodeError(),this._input=e.target.value,this._setCodeClearTimer()}}
                @focus=${this._clearCodeError}
                type="password"
                id="code_input"
                .inputmode=${(null===(e=this._alarmoConfig)||void 0===e?void 0:e.code_format)===Ce?"numeric":"text"}
              ></ha-input>
            `}
        ${!Ke(s)&&!this._config.keep_keypad_visible||(null===(t=this._alarmoConfig)||void 0===t?void 0:t.code_format)!==Ce||this._config.use_code_dialog||this._config.hide_keypad?F``:F`
          <div id="keypad" class="keypad" style="max-width: ${300*this._config.button_scale_keypad}px">
            ${es.map(e=>""===e?F`
              <hmac-button
                disabled
                style="--content-scale: ${this._config.button_scale_keypad}"
                ?scaled=${1!=this._config.button_scale_keypad}
                class="placeholder"
              ></hmac-button>
            `:F`
              <hmac-button
                .value="${e}"
                @click=${this._handlePadClick}
                ?disabled=${!Ke(s)||"clear"===e&&!this._input.length}
                class="${"clear"!==e?"numberKey":"clear"}"
                style="--content-scale: ${this._config.button_scale_keypad}"
                ?scaled=${1!=this._config.button_scale_keypad}
              >
                ${"clear"===e?F`<ha-icon icon="mdi:close" style="--mdc-icon-size: calc(${this._config.button_scale_keypad} * 24px)"></ha-icon>`:F` <span>${e}</span>`}
              </hmac-button>
            `)}
          </div>
        `}
      </ha-card>
    `:F`
        <hui-warning>
          ${"NOT_RUNNING"!==this.hass.config.state?this.hass.localize("ui.panel.lovelace.warning.entity_not_found","entity",this._config.entity||"[empty]"):this.hass.localize("ui.panel.lovelace.warning.starting")}
        </hui-warning>
      `}_renderActions(){if(!this.hass||!this._config)return F``;const e=this.hass.states[this._config.entity],t=this._config.show_ready_indicator;return F`
      <hmac-actions-bar
        @button-clicked=${e=>this._handleActionClick(e,e.detail.action)}
        .hass=${this.hass}
        .config=${this._config}
        .readyForArmModes=${t?this.readyForArmModes:void 0}
        style="--alarm-state-color: ${Ze(e,this._config,!0)}; --content-scale: ${this._config.button_scale_actions}"
      ></hmac-actions-bar>
    `}_renderWarning(){var e;if(!this.hass||!this._config||!this._config.show_messages)return F``;const t=this.hass.states[this._config.entity];return t.attributes.open_sensors&&t.state==ze.Triggered||"blocking_sensors"==this.warning&&t.attributes.open_sensors?F`
        <div class="messagebox">
          <div class="messagebox-left"></div>
          <div class="messagebox-inner">
            <div class="description">
              <div class="description-filler"></div>
              <span>
                <ha-icon icon="hass:alert"></ha-icon>
                ${"blocking_sensors"==this.warning?Gt("errors.blocking_sensors",this.hass.language):Gt("errors.triggered_sensors",this.hass.language)}
              </span>
              <div class="description-filler"></div>
            </div>
            <div class="content">
              ${Object.entries(t.attributes.open_sensors).map(([e])=>(this.subscribedEntities.includes(e)||this.subscribedEntities.push(e),F`
                  <div class="badge">
                    <hmac-sensor-badge .hass=${this.hass} .entity=${e}> </hmac-sensor-badge>
                  </div>
                `))}
            </div>
          ${"blocking_sensors"==this.warning&&t.attributes.open_sensors?F`
            <hmac-button
              @click=${this._forceRetryClick}
              style="--content-scale: ${this._config.button_scale_actions}"
              ?scaled=${1!=this._config.button_scale_actions}
            >
              <span>${Gt("arm_options.force",this.hass.language)}</span>
            </hmac-button>
          `:""}
          </div>
          <div class="messagebox-right"></div>
        </div>
      `:t.state.startsWith("armed_")&&(null===(e=t.attributes.bypassed_sensors)||void 0===e?void 0:e.length)&&this._config.show_bypassed_sensors?F`
        <div class="messagebox warning">
          <div class="messagebox-left"></div>
          <div class="messagebox-inner">
            <div class="description">
              <div class="description-filler"></div>
              <span>
                <ha-icon icon="hass:alert"></ha-icon>
                ${Gt("errors.bypassed_sensors",this.hass.language)}
              </span>
              <div class="description-filler"></div>
            </div>
            <div class="content">
              ${t.attributes.bypassed_sensors.map(e=>(this.subscribedEntities.includes(e)||this.subscribedEntities.push(e),F`
                  <div class="badge">
                    <hmac-sensor-badge .hass=${this.hass} .entity=${e}> </hmac-sensor-badge>
                  </div>
                `))}
            </div>
          </div>
          <div class="messagebox-right"></div>
        </div>
      `:F``}_handlePadClick(e){const t=e.currentTarget.value;this._clearCodeError(),this._input="clear"===t?"":this._input+t}async _handleActionClick(e,t){var s;e.target.blur(),this._clearCodeError();const a=this.hass.states[this._config.entity];if((null===(s=this._config)||void 0===s?void 0:s.use_code_dialog)&&!this._config.hide_keypad&&Ke(a)){const s=await new Promise(s=>{const a=e.target,o={code_format:this._alarmoConfig.code_format,area_id:this.area_id,entity_id:this._config.entity,action:t,armOptions:this.armOptions,cancel:()=>{s(null)},confirm:e=>{s(e)}};Le(a,"show-dialog",{dialogTag:"hmac-code-dialog",dialogImport:()=>Promise.resolve().then(function(){return Xt}),dialogParams:o})});s!=je.Arm&&s!=je.Disarm||(this.warning="",this.armOptions=Object.assign({},He))}else t==Ee.Disarm?this.hass.callService("alarmo","disarm",{entity_id:this._config.entity,code:this._input}):this.hass.callService("alarmo","arm",Object.assign(Object.assign({},this.armOptions),{entity_id:this._config.entity,mode:Te[t],code:this._input})),this.warning="",this.armOptions=Object.assign({},He)}_showCodeError(){var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#code_input");t&&(t.classList.remove("error"),t.classList.add("error"),t.hint=Gt("errors.invalid_pin",this.hass.language))}_clearCodeError(){var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#code_input");t&&t.classList.contains("error")&&(t.classList.remove("error"),t.hint="",this._input="",this._cancelCodeClearTimer())}_clearCode(){this._input="",this._clearCodeError(),this._cancelCodeClearTimer()}_setCodeClearTimer(){this._cancelCodeClearTimer(),this._input.length&&(this._codeClearTimer=window.setTimeout(()=>{this._clearCode()},12e4))}_cancelCodeClearTimer(){this._codeClearTimer&&clearTimeout(this._codeClearTimer)}_toggleArmOptions(e,t){e.stopImmediatePropagation(),e.target.blur(),"skip_delay"==t?this.armOptions=Object.assign(Object.assign({},this.armOptions),{skip_delay:!this.armOptions.skip_delay}):"force"==t&&(this.armOptions=Object.assign(Object.assign({},this.armOptions),{force:!this.armOptions.force}))}_forceRetryClick(){if(!this.hass||!this._config||!this._last_command)return;let e=this._last_command;this.hass.callService("alarmo","arm",{entity_id:this._config.entity,mode:Te[e],code:this._last_code,force:!0}),this._last_command=void 0,this._last_code=void 0}static get styles(){return r`
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
    `}};e([pe({attribute:!1})],ss.prototype,"hass",void 0),e([me()],ss.prototype,"_config",void 0),e([me()],ss.prototype,"_alarmoConfig",void 0),e([me()],ss.prototype,"_input",void 0),e([me()],ss.prototype,"warning",void 0),e([me()],ss.prototype,"area_id",void 0),e([me()],ss.prototype,"armOptions",void 0),e([me()],ss.prototype,"readyForArmModes",void 0),e([me()],ss.prototype,"backendConnection",void 0),e([me()],ss.prototype,"showBypassedSensors",void 0),e([pe({attribute:!1})],ss.prototype,"cardConfig",null),ss=e([ce("hmac-alarm")],ss);const as=[["var(--primary-color)","Primary"],["var(--accent-color)","Accent"],["var(--primary-text-color)","Primary text"],["var(--secondary-text-color)","Secondary text"],["var(--disabled-text-color)","Disabled text"],["var(--state-active-color)","State active"],["var(--error-color)","Error"],["var(--warning-color)","Warning"],["var(--success-color)","Success"],["var(--info-color)","Info"]],os=["keep_keypad_visible","use_code_dialog","hide_keypad","show_messages","show_ready_indicator","show_bypassed_sensors"],is={keep_keypad_visible:!1,use_code_dialog:!1,hide_keypad:!1,show_messages:!0,show_ready_indicator:!0,show_bypassed_sensors:!0},rs={keep_keypad_visible:"Always show the code keypad",use_code_dialog:"Ask for the code in a dialog",hide_keypad:"Hide the code keypad",show_messages:"Messages (not ready, triggered)",show_ready_indicator:"Ready dot on the arm buttons",show_bypassed_sensors:"Warn about bypassed zones"},ns=[300,400,500,600,700,800],ls=[["monospace","Monospace (panel display)"],["sans","Sans-serif (theme)"],["serif","Serif"]],cs={monospace:"monospace",sans:"sans-serif",serif:"serif"};let ds=class extends ne{setConfig(e){this.config=e}firstUpdated(){var e;null===(e=this.hass)||void 0===e||e.callWS({type:"alarmo/ext/card/get"}).then(e=>this.data=e).catch(()=>{})}get cfg(){return Object.assign(Object.assign({},be),this.config||{})}emit(e){const t=Object.assign({},e);for(const[e,s]of Object.entries(be))t[e]===s&&delete t[e];Array.isArray(t.hidden_modes)&&!t.hidden_modes.length&&delete t.hidden_modes;const s=(e=>{if(!e)return;const t={};for(const[s,a]of Object.entries(e)){if(!a||"object"!=typeof a)continue;const e=fe(Object.entries(a).filter(([,e])=>void 0!==e&&""!==e&&null!==e&&("card"===s||0!==e)));Object.keys(e).length&&(t[s]=e)}return Object.keys(t).length?t:void 0})(t.styles);if(s?t.styles=s:delete t.styles,t.alarm){for(const[e,s]of Object.entries(is))t.alarm[e]===s&&delete t.alarm[e];for(const e of["button_scale_actions","button_scale_keypad"])1===t.alarm[e]&&delete t.alarm[e];Object.keys(t.alarm).length||delete t.alarm}t.name||delete t.name,t.entity||delete t.entity,this.config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}set(e,t){this.emit(Object.assign(Object.assign({},this.config),{[e]:t}))}setAlarm(e,t){const s=Object.assign(Object.assign({},(this.config||{}).alarm||{}),{[e]:t});this.emit(Object.assign(Object.assign({},this.config),{alarm:s}))}setStyle(e,t,s){const a=(e=>JSON.parse(JSON.stringify(null!=e?e:null)))((this.config||{}).styles||{});a[e]=Object.assign({},a[e]||{}),void 0===s||""===s||null===s?delete a[e][t]:a[e][t]=s,this.emit(Object.assign(Object.assign({},this.config),{styles:a}))}styleOf(e){return((this.config||{}).styles||{})[e]||{}}toggle(e,t,s,a){return F`<label class="row check">
      <input type="checkbox" .checked=${t} @change=${e=>s(e.target.checked)} />
      <span>${e}</span>${a?F`<span class="hint inline">${a}</span>`:V}
    </label>`}slider(e,t,s,a,o,i,r,n,l=!0){return F`<div class="row slider">
      <span class="lab">${e}</span>
      <div class="ctl nowrap">
        <input type="range" .min=${String(l?0:s)} .max=${String(a)} .step=${String(o)}
          .value=${String(t||(l?0:s))}
          @input=${e=>{const t=Number(e.target.value);n(l&&t>0&&t<s?s:t)}} />
        <span class="val">${l&&!t?F`<span class="muted">${r}${i}</span>`:F`${t}${i}`}</span>
      </div>
    </div>`}select(e,t,s,a){return F`<div class="row">
      <span class="lab">${e}</span>
      <select class="ctl" @change=${e=>a(e.target.value)}>
        ${s.map(([e,s])=>F`<option value=${e} ?selected=${e===t}>${s}</option>`)}
      </select>
    </div>`}triState(e,t,s,a){const o=void 0===t?"":t?"on":"off";return this.select(e,o,[["",s],["off","Off"],["on","On"]],e=>a(""===e?void 0:"on"===e))}color(e,t,s,a,o,i=[]){const r=i.find(([e])=>e===t),n=r?`preset:${r[0]}`:(e=>{const t=null==e?"":String(e);return""===t?"default":/^#[0-9a-fA-F]{3,8}$/.test(t)?"custom":/^var\(/.test(t)&&as.some(([e])=>e===t)?"theme":"css"})(t),l=/^#[0-9a-fA-F]{6}$/.test(t||"")?t:a;return F`<div class="row">
      <span class="lab">${e}</span>
      <div class="ctl color">
        <select aria-label=${`${e}: kind`} @change=${e=>{const s=e.target.value;s.startsWith("preset:")?o(s.slice(7)):o("default"===s?void 0:"theme"===s?as[0][0]:"custom"===s?l:!t||"theme"!==n&&"custom"!==n&&"css"!==n?a:t)}}>
          <option value="default" ?selected=${"default"===n}>${s}</option>
          ${i.map(([e,t])=>F`<option value=${`preset:${e}`} ?selected=${n===`preset:${e}`}>${t}</option>`)}
          <option value="theme" ?selected=${"theme"===n}>Theme color</option>
          <option value="custom" ?selected=${"custom"===n}>Custom color</option>
          <option value="css" ?selected=${"css"===n}>CSS value</option>
        </select>
        ${"theme"===n?F`<select aria-label=${`${e}: theme color`} @change=${e=>o(e.target.value)}>
              ${as.map(([e,s])=>F`<option value=${e} ?selected=${e===t}>${s}</option>`)}
            </select>`:"custom"===n?F`<input type="color" aria-label=${e} .value=${l} @input=${e=>o(e.target.value)} />`:"css"===n?F`<input type="text" aria-label=${e} placeholder="tomato, rgba(…), var(--…)" .value=${t||""}
                  @change=${e=>o(e.target.value||void 0)} />`:V}
      </div>
    </div>`}panel(e,t,s,a,o,i=!1){return F`<details class="panel" ?open=${i} data-id=${e}>
      <summary><ha-icon icon=${t}></ha-icon><span>${s}</span><ha-icon class="chev" icon="mdi:chevron-down"></ha-icon></summary>
      <div class="body"><p class="hint">${a}</p>${o}</div>
    </details>`}sub(e,t){return F`<details class="sub">
      <summary><span>${e}</span><ha-icon class="chev" icon="mdi:chevron-down"></ha-icon></summary>
      <div class="sub-body">${t}</div>
    </details>`}group(e){return F`<div class="group">${e}</div>`}textStyle(e){const t=ge[e],s=this.styleOf(e);return this.sub(t.label,F`
      ${this.group("Size and weight")}
      ${this.slider("Size",s.size||0,6,48,1," px",t.size,t=>this.setStyle(e,"size",t||void 0))}
      ${this.select("Weight",s.weight?String(s.weight):"",[["",`Card default (${t.weight})`],...ns.map(e=>[String(e),String(e)])],t=>this.setStyle(e,"weight",t?Number(t):void 0))}
      ${this.group("Font and case")}
      ${this.select("Font",s.font||"",[["",`Card default (${cs[t.font]})`],...ls],t=>this.setStyle(e,"font",t||void 0))}
      ${this.triState("Italic",s.italic,"Card default (off)",t=>this.setStyle(e,"italic",t))}
      ${this.triState("Capitals",s.caps,`Card default (${t.caps?"on":"off"})`,t=>this.setStyle(e,"caps",t))}
      ${this.group("Color")}
      ${this.color("Text color",s.color,"Card default","#e1e1e1",t=>this.setStyle(e,"color",t))}
    `)}iconStyle(e,t){const s=_e[e],a=this.styleOf(e);return this.sub(s.label,F`
      ${this.group("Size")}
      ${this.slider("Size",a.size||0,12,96,1," px",s.size,t=>this.setStyle(e,"size",t||void 0))}
      ${t?F`${this.group("Color")}
            ${this.color("Icon color",a.color,t.defaultLabel,"#9e9e9e",t=>this.setStyle(e,"color",t),t.presets)}`:V}
    `)}buttonColors(e,t,s,a){const o=this.styleOf(e),i=this.styleOf(t),r=[["transparent","Transparent"],["mode",s]],n=[["none","None"],["mode",s]],l=[["mode",s]];return this.sub("Button colors",F`
      ${this.group("Background")}
      ${this.color("Background",o.background,a.bg,"#2a2a2a",t=>this.setStyle(e,"background",t),r)}
      ${this.color("Background (selected)",o.active_background,a.abg,"#3a3a3a",t=>this.setStyle(e,"active_background",t),r)}
      ${"arm_button"===e?this.color("Bar behind the buttons",o.track,"Card default (faint)","#202020",t=>this.setStyle(e,"track",t),[["transparent","Transparent"]]):V}
      ${this.group("Border")}
      ${this.color("Border",o.border,"Card default (none)","#444444",t=>this.setStyle(e,"border",t),n)}
      ${this.color("Border (selected)",o.active_border,"Same as not selected","#ffffff",t=>this.setStyle(e,"active_border",t),n)}
      ${this.group("Icon and text")}
      ${this.color("Icon color",i.color,a.ic,"#9e9e9e",e=>this.setStyle(t,"color",e),l)}
      ${this.color("Icon color (selected)",i.active_color,a.aic,"#ffffff",e=>this.setStyle(t,"active_color",e),l)}
      ${this.toggle("Text color follows the icon",!!o.text_follows_icon,t=>this.setStyle(e,"text_follows_icon",t||void 0))}
    `)}sectionRow(e,t,s,a,o,i){const r=this.cfg;return F`<div class="sec-row">
      <input type="checkbox" aria-label=${`Show ${e}`} .checked=${!!r[s]} @change=${e=>this.set(s,e.target.checked)} />
      <span class="sec-name">${e}${t?F`<span class="hint inline"> · ${t}</span>`:V}</span>
      ${r[s]?F`<input type="checkbox" aria-label=${`Collapse ${e}`} title=${i||"a bar opens and closes this section"}
              .checked=${!!r[a]} @change=${e=>this.set(a,e.target.checked)} />
            ${r[a]?F`<input type="checkbox" aria-label=${`Start ${e} closed`} .checked=${!!r[o]} @change=${e=>this.set(o,e.target.checked)} />`:F`<span></span>`}`:F`<span></span><span></span>`}
    </div>`}render(){var e,t,s,a;if(!this.hass||!this.config)return V;const o=this.cfg,i=Object.assign(Object.assign(Object.assign({},is),{button_scale_actions:1,button_scale_keypad:1}),this.config.alarm||{}),r=(null===(e=this.data)||void 0===e?void 0:e.alarms)||[],n=(null===(t=this.data)||void 0===t?void 0:t.house.modes)||[],l=this.styleOf("card");return F`<div class="ed">
      ${this.panel("card","mdi:card-outline","Card","Which Alarmo alarm the card controls, and the frame around it.",F`
        ${this.group("Alarm")}
        ${this.select("Alarmo alarm",o.entity||"",[["","First linked alarm"],...r.map(e=>[e.entity_id,`${e.name} (${e.entity_id})`])],e=>this.set("entity",e||void 0))}
        <div class="row"><span class="lab">Name</span>
          <input class="ctl" type="text" placeholder="Shown when House Modes are off" .value=${o.name||""}
            @change=${e=>this.set("name",e.target.value||void 0)} /></div>
        ${this.group("Frame")}
        ${this.slider("Border width",null!==(s=l.border_width)&&void 0!==s?s:2,0,8,1," px",2,e=>this.setStyle("card","border_width",2===e?void 0:e),!1)}
        ${this.slider("Corner radius",null!==(a=l.radius)&&void 0!==a?a:12,0,32,1," px",12,e=>this.setStyle("card","radius",12===e?void 0:e),!1)}
        <p class="hint">The border shows the state: red alarm, orange arming or not ready, the House Mode's color while
          armed, green ready.</p>
      `,!0)}

      ${this.panel("sections","mdi:view-agenda-outline","Sections","Turn each part of the card on or off, and choose which ones can be collapsed.",F`
        <div class="sec-head"><span></span><span>Section</span><span>Collapse</span><span>Start closed</span></div>
        ${this.sectionRow("Header","House Mode and panel display","show_header","collapsible","start_collapsed","the whole card folds to the header")}
        ${this.sectionRow("House Mode buttons","","show_house_modes","modes_collapsible","modes_start_collapsed")}
        ${this.sectionRow("Alarm","arm / disarm, code, messages","show_alarm","alarm_collapsible","alarm_start_collapsed")}
        ${this.sectionRow("Physical panel keypad","","show_panel_keypad","keypad_collapsible","keypad_start_collapsed")}
        ${o.collapsible||o.modes_collapsible||o.alarm_collapsible||o.keypad_collapsible?F`${this.group("Collapsing")}${this.toggle("Show the open / close arrow",o.show_chevron,e=>this.set("show_chevron",e))}
              ${this.textStyle("alarm_bar")}`:V}
      `)}

      ${this.panel("header","mdi:page-layout-header","Header","The House Mode icon and name, and the physical panel's two display lines.",o.show_header?F`
          ${this.group("Show")}
          ${this.toggle("House Mode icon",o.show_header_icon,e=>this.set("show_header_icon",e))}
          ${this.toggle("House Mode name",o.show_mode_name,e=>this.set("show_mode_name",e))}
          ${this.toggle("Panel display, line 1",o.show_line1,e=>this.set("show_line1",e))}
          ${this.toggle("Panel display, line 2",o.show_line2,e=>this.set("show_line2",e))}
          ${this.group("Styles")}
          ${o.show_header_icon?this.iconStyle("header_icon",{defaultLabel:"House Mode color",presets:[]}):V}
          ${o.show_mode_name?this.textStyle("mode_name"):V}
          ${o.show_line1?this.textStyle("line1"):V}
          ${o.show_line2?this.textStyle("line2"):V}`:F`<p class="hint">Turned off under Sections.</p>`)}

      ${this.panel("modes","mdi:home-switch-outline","House Mode buttons","One button per House Mode; icons and colors come from the House Modes tab.",o.show_house_modes?F`
          ${this.group("Show")}
          ${this.toggle("Icons",o.show_mode_icons,e=>this.set("show_mode_icons",e))}
          ${this.toggle("Text",o.show_mode_labels,e=>this.set("show_mode_labels",e))}
          ${this.group("Layout")}
          ${this.select("Alignment",o.modes_align,[["grid","Standard (fixed columns, wrap left)"],["center","Center on width"]],e=>this.set("modes_align",e))}
          ${this.slider("Buttons per row",o.columns,2,9,1,"",5,e=>this.set("columns",e),!1)}
          ${n.length?F`${this.group("Buttons shown")}
                <div class="chips">${n.map(e=>{const t=(o.hidden_modes||[]).includes(e.id)||(o.hidden_modes||[]).includes(e.name);return F`<button class="chip ${t?"":"on"}" aria-pressed=${t?"false":"true"}
                    @click=${()=>this.set("hidden_modes",t?(o.hidden_modes||[]).filter(t=>t!==e.id&&t!==e.name):[...o.hidden_modes||[],e.id])}>
                    <ha-icon icon=${e.icon} style=${`color:${e.color}`}></ha-icon>${e.name}</button>`})}</div>`:V}
          ${this.group("Styles")}
          ${this.buttonColors("mode_button","mode_icon","House Mode color",{bg:"Card default (transparent)",abg:"Card default (faint gray)",ic:"Card default (secondary text)",aic:"House Mode color"})}
          ${o.show_mode_icons?this.iconStyle("mode_icon"):V}
          ${o.show_mode_labels?this.textStyle("mode_label"):V}`:F`<p class="hint">Turned off under Sections.</p>`)}

      ${this.panel("alarm","mdi:shield-lock-outline","Alarm","Arm and disarm Alarmo, enter the code, see why it will not arm.",o.show_alarm?F`
          ${this.group("Show")}
          ${this.toggle("State icon",o.show_alarm_icon,e=>this.set("show_alarm_icon",e))}
          ${this.toggle("Alarm name",o.show_alarm_name,e=>this.set("show_alarm_name",e))}
          ${this.toggle("Alarm state",o.show_alarm_state,e=>this.set("show_alarm_state",e))}
          ${this.toggle("Arm button icons",o.show_arm_icons,e=>this.set("show_arm_icons",e))}
          ${this.toggle("Arm button text",o.show_arm_labels,e=>this.set("show_arm_labels",e))}
          ${this.toggle("Option chips: Skip exit delay, Bypass open sensors",o.show_arm_options,e=>this.set("show_arm_options",e))}
          ${this.group("Arm buttons")}
          ${this.toggle("Arm mode colors from the House Modes",o.alarm_colors_from_modes,e=>this.set("alarm_colors_from_modes",e),"each arm mode in the color of the House Mode that sets it")}
          ${this.slider("Arm button scale",Math.round(10*i.button_scale_actions)/10,1,2.5,.1,"×",1,e=>this.setAlarm("button_scale_actions",e),!1)}
          ${this.group("Code entry and messages")}
          ${os.map(e=>this.toggle(rs[e],!!i[e],t=>this.setAlarm(e,t)))}
          ${this.slider("Code keypad scale",Math.round(10*i.button_scale_keypad)/10,1,2.5,.1,"×",1,e=>this.setAlarm("button_scale_keypad",e),!1)}
          ${this.group("Styles")}
          ${this.buttonColors("arm_button","alarm_icon","Arm mode color",{bg:"Card default (transparent)",abg:"Arm mode color",ic:"Arm mode color",aic:"Card default (white)"})}
          ${o.show_arm_icons?this.iconStyle("alarm_icon"):V}
          ${o.show_arm_labels?this.textStyle("alarm_button"):V}
          ${o.show_alarm_name?this.textStyle("alarm_name"):V}
          ${o.show_alarm_state?this.textStyle("alarm_state"):V}
          ${o.show_arm_options?this.textStyle("chip"):V}`:F`<p class="hint">Turned off under Sections.</p>`)}

      ${this.panel("keypad","mdi:dialpad","Physical panel keypad","The panel's 12 keys with their functions, sent through Alarmo.",o.show_panel_keypad?F`
          <p class="hint">Who may use the keys is set in the integration: Alarmo panel → Physical Panel → <em>Panel keypad on
            dashboards</em>. Other users see the keys disabled.</p>
          ${this.group("Show")}
          ${this.toggle("Key functions (OFF, AWAY, STAY, …)",o.show_key_labels,e=>this.set("show_key_labels",e))}
          ${this.group("Styles")}
          ${this.textStyle("key_digit")}
          ${o.show_key_labels?this.textStyle("key_label"):V}`:F`<p class="hint">Turned off under Sections.</p>`)}
    </div>`}};ds.styles=r`
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
      border: 1px solid var(--ltek-c-accent);
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
    /* Sections panel: show · name · collapse · start closed */
    .sec-head,
    .sec-row {
      display: grid;
      grid-template-columns: 22px 1fr 70px 84px;
      align-items: center;
      gap: var(--ltek-sp-3);
      padding: var(--ltek-sp-1) 0;
      font-size: var(--ltek-fs-label);
    }
    .sec-head {
      color: var(--ltek-c-muted);
      font-size: var(--ltek-fs-small);
    }
    .sec-head span:nth-child(n + 3),
    .sec-row input:nth-of-type(n + 2) {
      justify-self: center;
    }
    .sec-row input {
      accent-color: var(--ltek-c-accent);
      margin: 0;
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
  `,e([pe({attribute:!1})],ds.prototype,"hass",void 0),e([me()],ds.prototype,"config",void 0),e([me()],ds.prototype,"data",void 0),ds=e([ce("house-modes-alarm-center-card-editor")],ds);var hs,ps,ms,us;!function(e){e.STATE_ALARM_DISARMED="disarmed",e.STATE_ALARM_ARMED_HOME="armed_home",e.STATE_ALARM_ARMED_AWAY="armed_away",e.STATE_ALARM_ARMED_NIGHT="armed_night",e.STATE_ALARM_ARMED_CUSTOM_BYPASS="armed_custom_bypass",e.STATE_ALARM_ARMED_VACATION="armed_vacation",e.STATE_ALARM_PENDING="pending",e.STATE_ALARM_ARMING="arming",e.STATE_ALARM_TRIGGERED="triggered"}(hs||(hs={})),function(e){e.COMMAND_ALARM_DISARM="disarm",e.COMMAND_ALARM_ARM_HOME="arm_home",e.COMMAND_ALARM_ARM_AWAY="arm_away",e.COMMAND_ALARM_ARM_NIGHT="arm_night",e.COMMAND_ALARM_ARM_CUSTOM_BYPASS="arm_custom_bypass",e.COMMAND_ALARM_ARM_VACATION="arm_vacation"}(ps||(ps={})),function(e){e.Door="door",e.Window="window",e.Motion="motion",e.Tamper="tamper",e.Environmental="environmental",e.Other="other"}(ms||(ms={})),function(e){e.Notification="notification",e.Action="action"}(us||(us={}));const gs="2026.11.05.44",_s="house-modes-alarm-center-card",bs=new Map;let vs,fs=class extends ne{constructor(){super(...arguments),this.error="",this.collapsed=!1,this.message="",this.busyKey="",this.closed={},this.fetchedFor="",this.requestedAt=0,this.messageTimer=0}static getConfigElement(){return document.createElement(`${_s}-editor`)}static getStubConfig(e){const t=Object.keys(e.states).find(t=>t.startsWith("alarm_control_panel.")&&void 0!==e.states[t].attributes.arm_mode);return{entity:t}}setConfig(e){if(!e)throw new Error("Invalid configuration");if(e.entity&&!e.entity.startsWith("alarm_control_panel."))throw new Error("entity must be an Alarmo alarm_control_panel");const t=!this.config;if(this.config=Object.assign(Object.assign({},be),e),t){vs&&!this.data&&(this.data=vs);const e=bs.get(this.viewKey);e?(this.collapsed=e.collapsed,this.closed=Object.assign({},e.closed)):(this.collapsed=!(!this.config.collapsible||!this.config.start_collapsed),this.closed={modes:!(!this.config.modes_collapsible||!this.config.modes_start_collapsed),alarm:!(!this.config.alarm_collapsible||!this.config.alarm_start_collapsed),keypad:!(!this.config.keypad_collapsible||!this.config.keypad_start_collapsed)},this.saveView())}this.config.collapsible||(this.collapsed=!1)}get viewKey(){var e;return(null===(e=this.config)||void 0===e?void 0:e.entity)||"(first alarm)"}saveView(){bs.set(this.viewKey,{collapsed:this.collapsed,closed:Object.assign({},this.closed)})}getCardSize(){var e,t,s,a;if(this.collapsed)return 2;let o=0;return(null===(e=this.config)||void 0===e?void 0:e.show_header)&&(o+=2),(null===(t=this.config)||void 0===t?void 0:t.show_house_modes)&&(o+=2),(null===(s=this.config)||void 0===s?void 0:s.show_alarm)&&(o+=4),(null===(a=this.config)||void 0===a?void 0:a.show_panel_keypad)&&(o+=4),o||2}updated(e){if(!e.has("hass")||!this.hass)return;const t=this.hass.states["select.alarmo_house_mode"],s=this.data?this.hass.states[this.data.house.select_entity]:void 0,a=`${null==t?void 0:t.last_updated}|${null==s?void 0:s.last_updated}`;a!==this.fetchedFor&&(this.fetchedFor=a,this.fetch())}async fetch(){try{const e=await this.hass.callWS({type:"alarmo/ext/card/get"});JSON.stringify(e)!==JSON.stringify(this.data)&&(this.data=e),vs=e,this.error="";const t=e.house.last_result;if(this.requestedAt&&(null==t?void 0:t.at)&&Date.parse(t.at)>=this.requestedAt-2e3){this.requestedAt=0;const e=((e,t)=>{if(!e)return null;const s=e.requested||"House Mode";switch(e.result){case"blocked":return`${s} not set: ${e.reason||"not allowed now"}`;case"not_ready":return`${s} not set: open ${(e.open||[]).map(t).join(", ")||"zones"}`;case"delayed":return`${s} in ${e.minutes} min`;case"failed":return`${s} failed: ${(e.failed||[]).join(", ")} did not arm`;case"error":return`${s}: ${e.reason||"error"}`;case"shadow":return e.would&&"changed"!==e.would?`Shadow: ${s} would be ${e.would.replace("_"," ")}`:null;default:return null}})(t,e=>this.name(e));e&&this.flash(e)}}catch(e){this.error="House Modes & Alarm Center is not installed or not up to date: "+((null==e?void 0:e.message)||e)}}name(e){var t,s,a;return(null===(a=null===(s=null===(t=this.hass)||void 0===t?void 0:t.states[e])||void 0===s?void 0:s.attributes)||void 0===a?void 0:a.friendly_name)||e}flash(e){this.message=e,window.clearTimeout(this.messageTimer),this.messageTimer=window.setTimeout(()=>this.message="",8e3)}get alarmEntity(){var e,t,s,a;return(null===(e=this.config)||void 0===e?void 0:e.entity)||(null===(t=Ae(this.data,void 0))||void 0===t?void 0:t.alarm_entity)||(null===(a=null===(s=this.data)||void 0===s?void 0:s.alarms[0])||void 0===a?void 0:a.entity_id)}async chooseMode(e){const t=this.data.house.select_entity,s=t.split(".")[0];this.requestedAt=Date.now();try{await this.hass.callService(s,"select_option",{entity_id:t,option:e})}catch(e){this.requestedAt=0,this.flash((null==e?void 0:e.message)||String(e))}}async press(e){const t=Ae(this.data,this.alarmEntity);if(t){this.busyKey=e;try{await this.hass.callService("alarmo","panel_keypress",{keys:e,entity_id:t.panel_entity})}catch(e){this.flash((null==e?void 0:e.message)||String(e))}finally{this.busyKey=""}}}toggle(){var e;(null===(e=this.config)||void 0===e?void 0:e.collapsible)&&(this.collapsed=!this.collapsed,this.saveView())}moreInfo(e){e&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}render(){var e,t,s;if(!this.config||!this.hass)return V;if(this.error)return F`<ha-card><div class="warn">${this.error}</div></ha-card>`;if(!this.data)return F`<ha-card><div class="loading">…</div></ha-card>`;const a=this.config,o=this.data.house,i=o.modes.find(e=>e.id===o.current),r=this.alarmEntity,n=Ae(this.data,r),l=r?null===(e=this.hass.states[r])||void 0===e?void 0:e.state:void 0,c=((e,t,s,a)=>"triggered"===e||"triggered"===t?"#f44336":"arming"===e||"pending"===e||"arming"===t||"pending"===t?"#ff9800":e&&Se.includes(e)||t&&Se.includes(t)?a||"#f44336":"on"===s?"#4caf50":"off"===s?"#ff9800":"var(--divider-color)")(l,n?null===(t=this.hass.states[n.panel_entity])||void 0===t?void 0:t.state:void 0,(null==n?void 0:n.ready_entity)?null===(s=this.hass.states[n.ready_entity])||void 0===s?void 0:s.state:void 0,null==i?void 0:i.color);return F`
      <ha-card style=${`--hmac-border:${c};${ye(a.styles)}`}>
        ${a.show_header||this.collapsed?this.renderHeader(i,l,n):V}
        ${this.message?F`<div class="message" role="status">${this.message}</div>`:V}
        ${this.collapsed?V:F`
              ${a.show_house_modes&&o.enabled?this.section("modes",!!a.modes_collapsible,(null==i?void 0:i.icon)||"mdi:home-switch",null==i?void 0:i.color,`House Mode · ${(null==i?void 0:i.name)||"unknown"}`,()=>this.renderModes()):V}
              ${a.show_alarm&&r?this.renderAlarm(r,l):V}
              ${a.show_panel_keypad&&"envisalink"===(null==n?void 0:n.panel_type)?this.section("keypad",!!a.keypad_collapsible,"mdi:dialpad",void 0,"Panel keypad",()=>this.renderKeypad(n)):V}
            `}
      </ha-card>
    `}alarmConfig(e){var t,s;const a=this.config,o=a.alarm||{};let i=o.states||{};if(a.alarm_colors_from_modes){const t=ke(this.data,e);i=fe([...new Set([...Object.keys(t),...Object.keys(i)])].map(e=>[e,Object.assign({color:t[e]},i[e]||{})]))}return Object.assign(Object.assign(Object.assign(Object.assign({type:"hmac-alarm"},o),{states:i,entity:e}),a.name?{name:a.name}:{}),{show_name:a.show_alarm_name,show_state:a.show_alarm_state,show_icon:a.show_alarm_icon,show_arm_options:a.show_arm_options,show_icons:a.show_arm_icons,show_labels:a.show_arm_labels,button_style:null===(t=a.styles)||void 0===t?void 0:t.arm_button,icon_style:null===(s=a.styles)||void 0===s?void 0:s.alarm_icon})}section(e,t,s,a,o,i){if(!t)return i();const r=t&&!!this.closed[e];return F`
      <button class="bar" aria-expanded=${String(!r)} @click=${()=>{this.closed=Object.assign(Object.assign({},this.closed),{[e]:!r}),this.saveView()}}>
        <ha-icon icon=${s} style=${a?`color:${a}`:""}></ha-icon>
        <span class="bar-text">${o}</span>
        ${this.config.show_chevron?F`<ha-icon class="bar-chev" icon=${r?"mdi:chevron-down":"mdi:chevron-up"}></ha-icon>`:V}
      </button>
      ${r?V:i()}
    `}renderAlarm(e,t){var s,a;const o=this.config,i=this.hass.states[e],r=o.name||(null===(s=null==i?void 0:i.attributes)||void 0===s?void 0:s.friendly_name)||e,n=t?this.hass.localize(`component.alarm_control_panel.entity_component._.state.${t}`)||t.replace(/_/g," "):"",l=ke(this.data,e)[("arming"===t||"pending"===t?null===(a=null==i?void 0:i.attributes)||void 0===a?void 0:a.arm_mode:t)||""],c="disarmed"===t?"mdi:lock-open-variant":"triggered"===t?"mdi:bell-ring":"mdi:lock";return this.section("alarm",!!o.alarm_collapsible,c,l,`${r} · ${n}`,()=>F`<hmac-alarm embedded .hass=${this.hass} .cardConfig=${this.alarmConfig(e)}></hmac-alarm>`)}renderHeader(e,t,s){var a,o,i,r;const n=this.data.house,l=(null==s?void 0:s.keypad_entity)?this.hass.states[s.keypad_entity]:void 0,[c,d]=xe(null!==(o=null===(a=null==l?void 0:l.attributes)||void 0===a?void 0:a.alpha)&&void 0!==o?o:null==l?void 0:l.state),h=n.enabled?e?e.name:"unknown":this.config.name||(t?t.replace(/_/g," "):"");return F`
      <div class="head ${this.config.collapsible?"clickable":""} ${this.config.collapsible&&this.config.show_chevron?"chevron":""}" @click=${this.toggle}
        @contextmenu=${e=>{e.preventDefault(),this.moreInfo((null==s?void 0:s.keypad_entity)||this.alarmEntity)}}
        role=${this.config.collapsible?"button":V} aria-expanded=${this.config.collapsible?String(!this.collapsed):V}>
        ${this.config.show_header_icon?F`<ha-icon class="mode-icon" icon=${(null==e?void 0:e.icon)||"mdi:shield-home"}
              style=${`color:${ue(null===(r=null===(i=this.config.styles)||void 0===i?void 0:i.header_icon)||void 0===r?void 0:r.color,(null==e?void 0:e.color)||"var(--secondary-text-color)")||(null==e?void 0:e.color)||"var(--secondary-text-color)"}`}></ha-icon>`:V}
        <div class="head-text">
          ${this.config.show_mode_name?F`<div class="mode-name">${h}</div>`:V}
          ${l&&(this.config.show_line1||this.config.show_line2)?F`<div class="lcd" aria-label="Panel display">
                ${this.config.show_line1?F`<div class="line1">${c||" "}</div>`:V}
                ${this.config.show_line2?F`<div class="line2">${d||" "}</div>`:V}
              </div>`:V}
        </div>
        ${n.shadow?F`<span class="tag" title="House Modes run in Shadow: your automations are in charge">shadow</span>`:V}
        ${this.config.collapsible&&this.config.show_chevron?F`<ha-icon class="chev" icon=${this.collapsed?"mdi:chevron-down":"mdi:chevron-up"}></ha-icon>`:V}
      </div>
    `}renderModes(){var e,t;const s=this.data.house,a=(o=this.data,i=this.config.hidden_modes,o.house.modes.filter(e=>!(i||[]).includes(e.id)&&!(i||[]).includes(e.name)));var o,i;return F`
      <div class="modes ${"center"===this.config.modes_align?"center":""} ${(null===(t=null===(e=this.config.styles)||void 0===e?void 0:e.mode_button)||void 0===t?void 0:t.text_follows_icon)?"follow":""}"
        style=${`--cols:${Math.max(1,Math.min(9,this.config.columns||5))}`}>
        ${a.map(e=>{const t=e.id===s.current,a=this.config.styles||{};return F`<button class="mode ${t?"on":""}" aria-pressed=${t?"true":"false"} title=${e.name}
              style=${`--mode-color:${e.color};${((e,t,s)=>[["--b-bg",ue(null==e?void 0:e.background,s)],["--b-abg",ue(null==e?void 0:e.active_background,s)],["--b-bd",ue(null==e?void 0:e.border,s)],["--b-abd",ue(null==e?void 0:e.active_border,s)],["--b-ic",ue(null==t?void 0:t.color,s)],["--b-aic",ue(null==t?void 0:t.active_color,s)]].filter(([,e])=>e).map(([e,t])=>`${e}:${t}`).join(";"))(a.mode_button,a.mode_icon,e.color)}`}
              @click=${()=>this.chooseMode(e.name)}>
              ${this.config.show_mode_icons?F`<ha-icon icon=${e.icon}></ha-icon>`:V}
              ${this.config.show_mode_labels?F`<span>${e.name}</span>`:V}
            </button>`})}
      </div>
    `}renderKeypad(e){const t=this.data.keypad,s=t.blocked_keys||"";return F`
      <div class="keypad-wrap">
        ${!this.config.show_header&&e.keypad_entity?(()=>{var t,s;const a=this.hass.states[e.keypad_entity],[o,i]=xe(null!==(s=null===(t=null==a?void 0:a.attributes)||void 0===t?void 0:t.alpha)&&void 0!==s?s:null==a?void 0:a.state);return F`<div class="lcd big"><div>${o||" "}</div><div>${i||" "}</div></div>`})():V}
        ${t.allowed?V:F`<div class="note">Panel keypad: ${t.reason}</div>`}
        <div class="keys">
          ${(a=this.config.keypad_labels,$e.map(([e,t])=>[e,a&&e in a?a[e]:t])).map(([e,a])=>F`
            <button class="key" ?disabled=${!t.allowed||s.includes(e)||this.busyKey===e}
              aria-label=${a?`${e} ${a}`:e} @click=${()=>this.press(e)}>
              <span class="k">${e}</span>${a&&this.config.show_key_labels?F`<span class="l">${a}</span>`:V}
            </button>`)}
        </div>
      </div>
    `;var a}};fs.styles=r`
    ha-card {
      overflow: hidden;
      border: var(--hmac-border-width, 2px) solid var(--hmac-border, var(--divider-color));
      border-radius: var(--hmac-radius, var(--ha-card-border-radius, 12px));
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
      gap: 4px;
      padding: 4px 8px 8px;
    }
    /* 'center': same button width, every row (the last one too) centered across the card */
    .modes.center {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    .modes.center .mode {
      flex: 0 0 calc((100% - (var(--cols, 5) - 1) * 4px) / var(--cols, 5));
    }
    .mode {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 6px 2px;
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
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
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
    .bar {
      display: flex;
      align-items: center;
      gap: 8px;
      width: calc(100% - 16px);
      margin: 4px 8px;
      padding: 8px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      background: none;
      cursor: pointer;
      color: var(--primary-text-color);
      font: inherit;
      --mdc-icon-size: 22px;
    }
    .bar-text {
      flex: 1;
      text-align: left;
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
    .key:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
    .warn,
    .loading {
      padding: 16px;
    }
  `,e([pe({attribute:!1})],fs.prototype,"hass",void 0),e([me()],fs.prototype,"config",void 0),e([me()],fs.prototype,"data",void 0),e([me()],fs.prototype,"error",void 0),e([me()],fs.prototype,"collapsed",void 0),e([me()],fs.prototype,"message",void 0),e([me()],fs.prototype,"busyKey",void 0),e([me()],fs.prototype,"closed",void 0),fs=e([ce(_s)],fs),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===_s)||window.customCards.push({type:_s,name:"House Modes & Alarm Center Card",description:"House Mode, Alarmo alarm and physical panel keypad in one card.",preview:!0}),console.info(`%c HOUSE MODES & ALARM CENTER CARD %c ${gs} `,"background:#03a9f4;color:#fff","background:#333;color:#fff");export{gs as CARD_VERSION,fs as HouseModesAlarmCenterCard};
