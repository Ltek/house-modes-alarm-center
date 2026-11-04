function e(e,t,a,s){var i,o=arguments.length,r=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,a):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,a,s);else for(var n=e.length-1;n>=0;n--)(i=e[n])&&(r=(o<3?i(r):o>3?i(t,a,r):i(t,a))||r);return o>3&&r&&Object.defineProperty(t,a,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,a=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let o=class{constructor(e,t,a){if(this._$cssResult$=!0,a!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(a&&void 0===e){const a=void 0!==t&&1===t.length;a&&(e=i.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),a&&i.set(t,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const a=1===e.length?e[0]:t.reduce((t,a,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+e[s+1],e[0]);return new o(a,e,s)},n=a?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const a of e.cssRules)t+=a.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:m}=Object,u=globalThis,g=u.trustedTypes,_=g?g.emptyScript:"",b=u.reactiveElementPolyfillSupport,v=(e,t)=>e,f={toAttribute(e,t){switch(t){case Boolean:e=e?_:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let a=e;switch(t){case Boolean:a=null!==e;break;case Number:a=null===e?null:Number(e);break;case Object:case Array:try{a=JSON.parse(e)}catch(e){a=null}}return a}},y=(e,t)=>!l(e,t),w={attribute:!0,type:String,converter:f,reflect:!1,useDefault:!1,hasChanged:y};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let k=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=w){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const a=Symbol(),s=this.getPropertyDescriptor(e,a,t);void 0!==s&&c(this.prototype,e,s)}}static getPropertyDescriptor(e,t,a){const{get:s,set:i}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const o=s?.call(this);i?.call(this,t),this.requestUpdate(e,o,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??w}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=m(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const a of t)this.createProperty(a,e[a])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,a]of t)this.elementProperties.set(e,a)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const a=this._$Eu(e,t);void 0!==a&&this._$Eh.set(a,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const a=new Set(e.flat(1/0).reverse());for(const e of a)t.unshift(n(e))}else void 0!==e&&t.push(n(e));return t}static _$Eu(e,t){const a=t.attribute;return!1===a?void 0:"string"==typeof a?a:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const a of t.keys())this.hasOwnProperty(a)&&(e.set(a,this[a]),delete this[a]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,s)=>{if(a)e.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const a of s){const s=document.createElement("style"),i=t.litNonce;void 0!==i&&s.setAttribute("nonce",i),s.textContent=a.cssText,e.appendChild(s)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,a){this._$AK(e,a)}_$ET(e,t){const a=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,a);if(void 0!==s&&!0===a.reflect){const i=(void 0!==a.converter?.toAttribute?a.converter:f).toAttribute(t,a.type);this._$Em=e,null==i?this.removeAttribute(s):this.setAttribute(s,i),this._$Em=null}}_$AK(e,t){const a=this.constructor,s=a._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=a.getPropertyOptions(s),i="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:f;this._$Em=s;const o=i.fromAttribute(t,e.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(e,t,a,s=!1,i){if(void 0!==e){const o=this.constructor;if(!1===s&&(i=this[e]),a??=o.getPropertyOptions(e),!((a.hasChanged??y)(i,t)||a.useDefault&&a.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,a))))return;this.C(e,t,a)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:a,reflect:s,wrapped:i},o){a&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==i||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||a||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,a]of e){const{wrapped:e}=a,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,a,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[v("elementProperties")]=new Map,k[v("finalized")]=new Map,b?.({ReactiveElement:k}),(u.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $=globalThis,x=e=>e,A=$.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:e=>e}):void 0,C="$lit$",z=`lit$${Math.random().toFixed(9).slice(2)}$`,O="?"+z,E=`<${O}>`,M=document,T=()=>M.createComment(""),j=e=>null===e||"object"!=typeof e&&"function"!=typeof e,P=Array.isArray,N="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,H=/>/g,L=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,U=/"/g,B=/^(?:script|style|textarea|title)$/i,q=(e=>(t,...a)=>({_$litType$:e,strings:t,values:a}))(1),F=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),W=new WeakMap,Z=M.createTreeWalker(M,129);function G(e,t){if(!P(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const K=(e,t)=>{const a=e.length-1,s=[];let i,o=2===t?"<svg>":3===t?"<math>":"",r=R;for(let t=0;t<a;t++){const a=e[t];let n,l,c=-1,d=0;for(;d<a.length&&(r.lastIndex=d,l=r.exec(a),null!==l);)d=r.lastIndex,r===R?"!--"===l[1]?r=D:void 0!==l[1]?r=H:void 0!==l[2]?(B.test(l[2])&&(i=RegExp("</"+l[2],"g")),r=L):void 0!==l[3]&&(r=L):r===L?">"===l[0]?(r=i??R,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,n=l[1],r=void 0===l[3]?L:'"'===l[3]?U:I):r===U||r===I?r=L:r===D||r===H?r=R:(r=L,i=void 0);const h=r===L&&e[t+1].startsWith("/>")?" ":"";o+=r===R?a+E:c>=0?(s.push(n),a.slice(0,c)+C+a.slice(c)+z+h):a+z+(-2===c?t:h)}return[G(e,o+(e[a]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class Y{constructor({strings:e,_$litType$:t},a){let s;this.parts=[];let i=0,o=0;const r=e.length-1,n=this.parts,[l,c]=K(e,t);if(this.el=Y.createElement(l,a),Z.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=Z.nextNode())&&n.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(C)){const t=c[o++],a=s.getAttribute(e).split(z),r=/([.?@])?(.*)/.exec(t);n.push({type:1,index:i,name:r[2],strings:a,ctor:"."===r[1]?te:"?"===r[1]?ae:"@"===r[1]?se:ee}),s.removeAttribute(e)}else e.startsWith(z)&&(n.push({type:6,index:i}),s.removeAttribute(e));if(B.test(s.tagName)){const e=s.textContent.split(z),t=e.length-1;if(t>0){s.textContent=A?A.emptyScript:"";for(let a=0;a<t;a++)s.append(e[a],T()),Z.nextNode(),n.push({type:2,index:++i});s.append(e[t],T())}}}else if(8===s.nodeType)if(s.data===O)n.push({type:2,index:i});else{let e=-1;for(;-1!==(e=s.data.indexOf(z,e+1));)n.push({type:7,index:i}),e+=z.length-1}i++}}static createElement(e,t){const a=M.createElement("template");return a.innerHTML=e,a}}function J(e,t,a=e,s){if(t===F)return t;let i=void 0!==s?a._$Co?.[s]:a._$Cl;const o=j(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),void 0===o?i=void 0:(i=new o(e),i._$AT(e,a,s)),void 0!==s?(a._$Co??=[])[s]=i:a._$Cl=i),void 0!==i&&(t=J(e,i._$AS(e,t.values),i,s)),t}class X{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:a}=this._$AD,s=(e?.creationScope??M).importNode(t,!0);Z.currentNode=s;let i=Z.nextNode(),o=0,r=0,n=a[0];for(;void 0!==n;){if(o===n.index){let t;2===n.type?t=new Q(i,i.nextSibling,this,e):1===n.type?t=new n.ctor(i,n.name,n.strings,this,e):6===n.type&&(t=new ie(i,this,e)),this._$AV.push(t),n=a[++r]}o!==n?.index&&(i=Z.nextNode(),o++)}return Z.currentNode=M,s}p(e){let t=0;for(const a of this._$AV)void 0!==a&&(void 0!==a.strings?(a._$AI(e,a,t),t+=a.strings.length-2):a._$AI(e[t])),t++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,a,s){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=a,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=J(this,e,t),j(e)?e===V||null==e||""===e?(this._$AH!==V&&this._$AR(),this._$AH=V):e!==this._$AH&&e!==F&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>P(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==V&&j(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:a}=e,s="number"==typeof a?this._$AC(e):(void 0===a.el&&(a.el=Y.createElement(G(a.h,a.h[0]),this.options)),a);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new X(s,this),a=e.u(this.options);e.p(t),this.T(a),this._$AH=e}}_$AC(e){let t=W.get(e.strings);return void 0===t&&W.set(e.strings,t=new Y(e)),t}k(e){P(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let a,s=0;for(const i of e)s===t.length?t.push(a=new Q(this.O(T()),this.O(T()),this,this.options)):a=t[s],a._$AI(i),s++;s<t.length&&(this._$AR(a&&a._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=x(e).nextSibling;x(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,a,s,i){this.type=1,this._$AH=V,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=i,a.length>2||""!==a[0]||""!==a[1]?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=V}_$AI(e,t=this,a,s){const i=this.strings;let o=!1;if(void 0===i)e=J(this,e,t,0),o=!j(e)||e!==this._$AH&&e!==F,o&&(this._$AH=e);else{const s=e;let r,n;for(e=i[0],r=0;r<i.length-1;r++)n=J(this,s[a+r],t,r),n===F&&(n=this._$AH[r]),o||=!j(n)||n!==this._$AH[r],n===V?e=V:e!==V&&(e+=(n??"")+i[r+1]),this._$AH[r]=n}o&&!s&&this.j(e)}j(e){e===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===V?void 0:e}}class ae extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==V)}}class se extends ee{constructor(e,t,a,s,i){super(e,t,a,s,i),this.type=5}_$AI(e,t=this){if((e=J(this,e,t,0)??V)===F)return;const a=this._$AH,s=e===V&&a!==V||e.capture!==a.capture||e.once!==a.once||e.passive!==a.passive,i=e!==V&&(a===V||s);s&&this.element.removeEventListener(this.name,this,a),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ie{constructor(e,t,a){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(e){J(this,e)}}const oe=$.litHtmlPolyfillSupport;oe?.(Y,Q),($.litHtmlVersions??=[]).push("3.3.3");const re=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ne extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,a)=>{const s=a?.renderBefore??t;let i=s._$litPart$;if(void 0===i){const e=a?.renderBefore??null;s._$litPart$=i=new Q(t.insertBefore(T(),e),e,void 0,a??{})}return i._$AI(e),i})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}}ne._$litElement$=!0,ne.finalized=!0,re.litElementHydrateSupport?.({LitElement:ne});const le=re.litElementPolyfillSupport;le?.({LitElement:ne}),(re.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ce=e=>(t,a)=>{void 0!==a?a.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},de={attribute:!0,type:String,converter:f,reflect:!1,hasChanged:y},he=(e=de,t,a)=>{const{kind:s,metadata:i}=a;let o=globalThis.litPropertyMetadata.get(i);if(void 0===o&&globalThis.litPropertyMetadata.set(i,o=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),o.set(a.name,e),"accessor"===s){const{name:s}=a;return{set(a){const i=t.get.call(this);t.set.call(this,a),this.requestUpdate(s,i,e,!0,a)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=a;return function(a){const i=this[s];t.call(this,a),this.requestUpdate(s,i,e,!0,a)}}throw Error("Unsupported decorator location: "+s)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function pe(e){return(t,a)=>"object"==typeof a?he(e,t,a):((e,t,a)=>{const s=t.hasOwnProperty(a);return t.constructor.createProperty(a,e),s?Object.getOwnPropertyDescriptor(t,a):void 0})(e,t,a)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function me(e){return pe({...e,state:!0,attribute:!1})}const ue={mode_name:{label:"House Mode name",size:22,weight:400,font:"monospace",caps:!0},line1:{label:"Panel display, line 1",size:14,weight:400,font:"monospace",caps:!1},line2:{label:"Panel display, line 2",size:14,weight:400,font:"monospace",caps:!1},mode_label:{label:"House Mode button text",size:10,weight:400,font:"sans",caps:!1},alarm_bar:{label:"Alarm bar (collapsed)",size:14,weight:500,font:"sans",caps:!1},alarm_name:{label:"Alarm name",size:24,weight:400,font:"sans",caps:!1},alarm_state:{label:"Alarm state",size:14,weight:400,font:"sans",caps:!1},alarm_button:{label:"Arm button text",size:14,weight:400,font:"sans",caps:!1},chip:{label:"Option chips",size:12,weight:500,font:"sans",caps:!1},key_digit:{label:"Keypad digit",size:16,weight:400,font:"sans",caps:!1},key_label:{label:"Keypad function",size:10,weight:400,font:"sans",caps:!1}},ge={header_icon:{label:"House Mode icon (header)",size:48},mode_icon:{label:"House Mode button icons",size:36},alarm_icon:{label:"Arm button icons",size:22}},_e={show_header:!0,show_house_modes:!0,show_alarm:!0,show_panel_keypad:!1,collapsible:!1,start_collapsed:!0,show_chevron:!1,columns:5,modes_align:"grid",show_mode_labels:!0,show_mode_name:!0,show_line1:!0,show_line2:!0,alarm_collapsible:!1,alarm_start_collapsed:!0,show_alarm_name:!0,show_alarm_state:!0,show_arm_options:!0,alarm_colors_from_modes:!0},be={monospace:"var(--code-font-family, monospace)",sans:'var(--ha-font-family-body, Roboto, "Noto Sans", sans-serif)',serif:'Georgia, "Times New Roman", serif'},ve=e=>{const t={};for(const[a,s]of e)t[a]=s;return t},fe=e=>{const t=[],a=(e,a)=>null!=a&&""!==a&&t.push(`--hmac-${e}:${(e=>String(e).replace(/[;{}<>]/g,""))(a)}`);for(const t of Object.keys(ue)){const s=(e||{})[t];if(!s)continue;const i=t.replace(/_/g,"-");s.size&&a(`${i}-size`,`${Number(s.size)}px`),s.weight&&a(`${i}-weight`,Number(s.weight)),a(`${i}-color`,s.color),s.font&&be[s.font]&&a(`${i}-font`,be[s.font]),void 0!==s.italic&&a(`${i}-style`,s.italic?"italic":"normal"),void 0!==s.caps&&a(`${i}-transform`,s.caps?"uppercase":"none")}for(const t of Object.keys(ge)){const s=(e||{})[t];if(!s)continue;const i=t.replace(/_/g,"-");s.size&&a(`${i}-size`,`${Number(s.size)}px`),a(`${i}-color`,s.color),a(`${i}-active-color`,s.active_color)}const s=(e||{}).card;return void 0!==(null==s?void 0:s.border_width)&&a("border-width",`${Number(s.border_width)}px`),void 0!==(null==s?void 0:s.radius)&&a("radius",`${Number(s.radius)}px`),t.join(";")},ye={disarmed:"#4caf50",armed_away:"#f44336",armed_home:"#ff9800",armed_night:"#5c6bc0",armed_vacation:"#dc143c",armed_custom_bypass:"#00bcd4"},we=(e,t)=>{var a,s;const i=null===(a=e.alarms.find(e=>e.entity_id===t))||void 0===a?void 0:a.key,o={};for(const t of Object.keys(ye)){const a=e.house.modes.find(e=>{var a;return i&&(null===(a=e.targets)||void 0===a?void 0:a[i])===t}),r=e.house.modes.find(e=>Object.values(e.targets||{}).includes(t));o[t]=(null===(s=a||r)||void 0===s?void 0:s.color)||ye[t]}return o},ke=[["1","OFF"],["2","AWAY"],["3","STAY"],["4","MAX"],["5","TEST"],["6","BYPASS"],["7","INSTANT"],["8","CODE"],["9","CHIME"],["*","READY"],["0",""],["#",""]],$e=e=>{const t=String(e||"");return[t.slice(0,16).trim(),t.slice(16,32).trim()]},xe=(e,t)=>e.links.find(e=>e.alarm_entity===t)||e.links[0],Ae=["armed_away","armed_home","armed_night","armed_vacation","armed_custom_bypass"],Se="number";var Ce;!function(e){e.Disarmed="disarmed",e.Arming="arming",e.Pending="pending",e.Triggered="triggered",e.ArmedAway="armed_away",e.ArmedHome="armed_home",e.ArmedNight="armed_night",e.ArmedVacation="armed_vacation",e.ArmedCustomBypass="armed_custom_bypass"}(Ce||(Ce={}));const ze={[Ce.ArmedAway]:"hass:shield-lock",[Ce.ArmedHome]:"hass:shield-home",[Ce.ArmedNight]:"hass:shield-moon",[Ce.ArmedVacation]:"hass:shield-airplane",[Ce.ArmedCustomBypass]:"mdi:lock-percent-open",[Ce.Disarmed]:"mdi:lock-open-variant",[Ce.Arming]:"hass:shield-outline",[Ce.Pending]:"hass:shield-outline",[Ce.Triggered]:"hass:bell-ring"};var Oe;!function(e){e.ArmAway="arm_away",e.ArmHome="arm_home",e.ArmNight="arm_night",e.ArmVacation="arm_vacation",e.ArmCustomBypass="arm_custom_bypass",e.Disarm="disarm"}(Oe||(Oe={}));const Ee={[Oe.ArmAway]:"mdi:lock",[Oe.ArmHome]:"mdi:home",[Oe.ArmNight]:"mdi:moon-waning-crescent",[Oe.ArmVacation]:"mdi:airplane",[Oe.ArmCustomBypass]:"mdi:lock-percent-open",[Oe.Disarm]:"mdi:lock-open-variant"},Me={[Oe.ArmAway]:Ce.ArmedAway,[Oe.ArmHome]:Ce.ArmedHome,[Oe.ArmNight]:Ce.ArmedNight,[Oe.ArmVacation]:Ce.ArmedVacation,[Oe.ArmCustomBypass]:Ce.ArmedCustomBypass,[Oe.Disarm]:Ce.Disarmed};var Te;!function(e){e.Disarm="disarm",e.Arm="arm",e.Trigger="trigger",e.FailedToArm="failed_to_arm",e.CommandNotAllowed="command_not_allowed",e.NoCodeProvided="no_code_provided",e.InvalidCodeProvided="invalid_code_provided",e.TriggerTimeExpired="trigger_time_expired",e.ReadyToArmModesChanged="ready_to_arm_modes_changed"}(Te||(Te={}));const je="alarmo_updated",Pe=["arming","pending"],Ne={type:"",entity:"",name:"",keep_keypad_visible:!1,button_scale_actions:1,button_scale_keypad:1,states:{},show_messages:!0,show_ready_indicator:!0,show_bypassed_sensors:!0,use_code_dialog:!1,hide_keypad:!1},Re={skip_delay:!1,force:!1};var De;!function(e){e.Red="red",e.Pink="pink",e.Purple="purple",e.DeepPurple="deep-purple",e.Indigo="indigo",e.Blue="blue",e.LightBlue="light-blue",e.Cyan="cyan",e.Teal="teal",e.Green="green",e.LightGreen="light-green",e.Lime="lime",e.Yellow="yellow",e.Amber="amber",e.Orange="orange",e.DeepOrange="deep-orange",e.Brown="brown",e.LightGrey="light-grey",e.Grey="grey",e.DarkGrey="dark-grey",e.BlueGrey="blue-grey",e.Black="black",e.White="white"}(De||(De={}));const He=(e,t,a,s)=>{s=s||{},a=null==a?{}:a;const i=new Event(t,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return i.detail=a,e.dispatchEvent(i),i};class Le extends ne{constructor(){super(...arguments),this.duration=0,this.datetime=null,this.timer=0,this._touchStarted=!1,this._hover=!1}shouldUpdate(e){if(!e.size)return!0;const t=e.get("hass");if(!t||t.themes!==this.hass.themes||t.language!==this.hass.language)return!0;if(t.states[this.entity].state!==this.hass.states[this.entity].state||t.states[this.entity].attributes.delay!==this.hass.states[this.entity].attributes.delay){const e=t.states[this.entity].state,a=this.hass.states[this.entity].state;return Pe.includes(a)?this.startTimer():Pe.includes(e)&&this.stopTimer(),!0}return!1}firstUpdated(){const e=this.hass.states[this.entity].state;Pe.includes(e)&&this.startTimer(),this.addEventListener("click",this.handleClick),this.addEventListener("touchstart",()=>{this._touchStarted=!0}),this.addEventListener("touchend",()=>{setTimeout(()=>{this._touchStarted=!1},10)}),this.addEventListener("mouseenter",()=>{this._touchStarted||(this._hover=!0)}),this.addEventListener("mouseleave",()=>{this._hover=!1})}async startTimer(){var e,t;clearInterval(this.timer),(e=this.hass,t=this.entity,e.callWS({type:"alarmo/countdown",entity_id:t})).then(e=>{this.duration=e.delay,this.datetime=new Date((new Date).getTime()+1e3*e.remaining)}).catch(e=>{}),this.timer=window.setInterval(()=>{this.requestUpdate()},1e3)}stopTimer(){clearInterval(this.timer),this.datetime=null,this.duration=0}getRemaining(){if(!this.datetime)return 0;const e=(this.datetime.getTime()-(new Date).getTime())/1e3;return e<0?(clearInterval(this.timer),0):e}getFraction(){return this.duration?(Math.round(this.getRemaining())-1)/this.duration:1}_stateValue(e){return this._hover&&Pe.includes(e)&&this.timer?q` <ha-icon icon="mdi:skip-forward"></ha-icon> `:this.datetime&&this.duration?q` ${Math.max(Math.round(this.getRemaining()),0)} `:q` <ha-icon .icon=${ze[e]}></ha-icon> `}handleClick(){const e=this.hass.states[this.entity].state;Pe.includes(e)&&this.timer?this.hass.callService("alarmo","skip_delay",{entity_id:this.entity}):He(this,"hass-more-info",{entityId:this.entity})}render(){let e=45,t=2*Math.PI*e;const a=this.hass.states[this.entity],s=this.datetime&&this.duration;return q`
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
    `}}function Ie(e){return null!=e}function Ue(e){switch(typeof e){case"object":return 0==Object.keys(e).length;case"string":return 0==String(e).length;default:return!Ie(e)}}function Be(e){return e.substring(0,e.indexOf("."))}e([pe()],Le.prototype,"hass",void 0),e([pe()],Le.prototype,"entity",void 0),e([me()],Le.prototype,"_hover",void 0),customElements.define("hmac-state-badge",Le);const qe=(e,t)=>{let a={hide:!1};return(t.states||{}).hasOwnProperty(e)&&(a=Object.assign(Object.assign({},a),t.states[e])),a},Fe=e=>{if(!e)return[];const t=e.attributes.supported_features||0;let a=[];return 2&t&&a.push(Oe.ArmAway),1&t&&a.push(Oe.ArmHome),4&t&&a.push(Oe.ArmNight),32&t&&a.push(Oe.ArmVacation),16&t&&a.push(Oe.ArmCustomBypass),a},Ve=(e,t,a)=>{const s=Be(e.entity_id),i=e.attributes.device_class,o=e.state;if(Object.values(Ce).includes(o)&&a){const e=qe(o,a);if(!Ue(e.state_label))return e.state_label}let r="";return i&&(r=t(`component.${s}.entity_component.${i}.state.${e.state}`)),r||(r=t(`component.${s}.entity_component._.state.${e.state}`)),r},We=e=>null!==e.attributes.code_format,Ze=(e,t,a=!1)=>{if(!e||!e.state)return"var(--state-unavailable-color)";let s=e.state;if(a){const a=Object.values(Oe).map(e=>Me[e]);if(!a.includes(s)){const t=e.attributes.arm_mode;t&&(s=t)}const i=[Oe.Disarm,...Fe(e)].filter(e=>!qe(Me[e],t).hide);1==i.length&&(s=Me[i[0]])}if(Object.keys(t.states||{}).includes(s)&&Ie((t.states[s]||{}).color)){const e=t.states[s].color;return Object.values(De).includes(e)?`var(--${e}-color)`:e}return s==Ce.Disarmed?"var(--state-alarm_control_panel-disarmed-color, var(--state-alarm_control_panel-inactive-color, var(--state-inactive-color)))":Object.values(Ce).includes(s)?`var(--state-alarm_control_panel-${s}-color, var(--state-alarm_control_panel-active-color, var(--state-active-color)))`:"var(--disabled-color, var(--state-inactive-color))"};var Ge,Ke;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(Ge||(Ge={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(Ke||(Ke={}));class Ye extends ne{shouldUpdate(e){const t=e.get("hass");return!t||!(!this.entity||t.states[this.entity]===this.hass.states[this.entity])}render(){if(!this.hass||!this.entity)return q``;const e=this.entity in this.hass.states;let t=Object.assign({},this.hass.states[this.entity]);void 0!==this.state&&(t=Object.assign(Object.assign({},t),{state:this.state}));const a=e?Ve(t,this.hass.localize):this.hass.localize("state.default.unavailable",this.hass.locale||{language:this.hass.language,number_format:Ge.language}),s=e?t.attributes.friendly_name||(i=t.entity_id).substring(i.indexOf(".")+1):this.entity;var i;let o=!!this.state||"on"==t.state;return q`
      <div class="badge-container" @click=${()=>He(this,"hass-more-info",{entityId:this.entity})}>
        <div class="label-badge ${o?"active":""}" id="badge">
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
    `}}e([pe()],Ye.prototype,"hass",void 0),e([pe()],Ye.prototype,"entity",void 0),e([pe()],Ye.prototype,"state",void 0),customElements.define("hmac-sensor-badge",Ye);class Je extends ne{constructor(){super(...arguments),this.disabled=!1,this.scaled=!1}render(){return q`
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
    `}}e([pe({type:Boolean})],Je.prototype,"disabled",void 0),e([pe({type:Boolean})],Je.prototype,"scaled",void 0),customElements.define("hmac-button",Je);const Xe=t=>{class a extends t{connectedCallback(){super.connectedCallback(),this.__checkSubscribed()}disconnectedCallback(){if(super.disconnectedCallback(),this.__unsubs){for(;this.__unsubs.length;){const e=this.__unsubs.pop();e instanceof Promise?e.then(e=>e()):e()}this.__unsubs=void 0}}updated(e){super.updated(e),e.has("hass")&&this.__checkSubscribed()}hassSubscribe(){return[]}__checkSubscribed(){void 0===this.__unsubs&&this.isConnected&&void 0!==this.hass&&(this.__unsubs=this.hassSubscribe())}}return e([pe({attribute:!1})],a.prototype,"hass",void 0),a};var Qe={heading:"Možnosti aktivace",skip_delay:"Přeskočit čas pro vystup",force:"Bypass otevřených senzorů"},et={keep_keypad_visible:"Zachovat klávesnici vždy viditelnou, i když není vyžadován žádný kód.",button_scale_actions:"Měřítko použité pro změnu velikosti tlačítek akcí.",button_scale_keypad:"Měřítko použité pro změnu velikosti tlačítek klávesnice.",show_messages:"Zobrazit diagnostické zprávy při spuštění alarmu nebo nemožnosti aktivace.",show_ready_indicator:"Zobrazit indikátor připraveno/nepřipraveno na tlačítkách režimu aktivace.",show_bypassed_sensors:"Zobrazit varování při aktivaci alarmu s přemostěnými senzory.",use_code_dialog:"Zobrazte klávesnici pro zadání kódu jako vyskakovací dialog.",hide_keypad:"Skrýt tlačítka klávesnice pro zadávání kódu.",available_actions:"Dostupné akce:",action_dialog:{title:"Upravit zobrazení akce '{action}'",show_button:{title:"Viditelnost akčního tlačítka",options:{always:"Vždy zobrazeno",never:"Nikdy zobrazeno",disarmed:"Zobrazit pouze při odzbrojení",armed:"Zobrazit pouze při zapnutí"}},button_label:"Přepsat popisek tlačítka",button_icon:"Ikona zobrazeného tlačítka",state_label:"Přepsat popisek stavu",color:"Přepsat barvu použitou pro akci"}},tt={invalid_pin:"Neplatný",blocking_sensors:"Nelze aktivovat kvůli následujícím senzorům",triggered_sensors:"Alarm byl spuštěn následujícími senzory",bypassed_sensors:"Jsou tam přemostěné senzory"},at={arm_options:Qe,editor:et,errors:tt},st={heading:"Scharfschaltungsoptionen",skip_delay:"Ausgangsverzögerung überspringen",force:"Offene Sensoren ignorieren"},it={keep_keypad_visible:"Zeige das Pin-Eingabefeld immer an, auch wenn kein Code erfordert ist.",button_scale_actions:"Skalierungsfaktor für Buttongröße der Aktionen.",button_scale_keypad:"Skalierungsfaktor für Buttongröße der Pin-Eingabefeld.",show_messages:"Anzeige von Diagnosemeldungen, wenn der Alarm ausgelöst wird oder nicht scharf geschaltet werden kann.",show_ready_indicator:"Zeigt die Bereitschafts-/Nicht-Bereitschaftsanzeige auf den Scharfschaltmodus-Tasten an.",show_bypassed_sensors:"Warnung anzeigen, wenn der Alarm mit umgangenen Sensoren aktiviert wird.",use_code_dialog:"Zeigen Sie die Tastatur zur Codeeingabe als Popup-Dialog an.",hide_keypad:"Blenden Sie die Tasten der Tastatur zur Codeeingabe aus.",available_actions:"Verfügbare Aktionen:",action_dialog:{title:"Anzeige der Aktion '{action}' anpassen",show_button:{title:"Sichtbarkeit der Aktionsschaltfläche",options:{always:"Immer angezeigt",never:"Nie angezeigt",disarmed:"Nur im deaktivierten Zustand anzeigen",armed:"Nur im aktivierten Zustand anzeigen"}},button_label:"Überschreibung der Tastenbeschriftung",button_icon:"Angezeigtes Schaltflächensymbol",state_label:"Überschreibung der Statusbezeichnung",color:"Die für die Aktion verwendete Farbe überschreiben"}},ot={invalid_pin:"Ungültig",blocking_sensors:"Konnte nicht scharf geschaltet werden, da folgende Sensoren geöffnet sind",triggered_sensors:"Alarm wurde durch folgende Sensoren ausgelöst",bypassed_sensors:"Es gibt umgangene Sensoren"},rt={arm_options:st,editor:it,errors:ot},nt={heading:"Επιλογές για όπλισμα",skip_delay:"Παράλειψη καθυστέρησης εξόδου",force:"Παράκαμψη ανοιχτών αισθητήρων"},lt={keep_keypad_visible:"Κράτησε το πληκτρολόγιο πάντα ορατό, ακόμη και όταν δεν απαιτείται εισαγωγή κωδικού.",button_scale_actions:"Συντελεστής κλίμακας για αλλαγή μεγέθους των κουμπιών ενεργειών.",button_scale_keypad:"Συντελεστής κλίμακας για αλλαγή μεγέθους των κουμπιών του πληκτρολογίου.",show_messages:"Εμφάνιση διαγνωστικών μηνυμάτων όταν ενεργοποιείται ο συναγερμός ή δεν μπορεί να οπλιστεί.",show_ready_indicator:"Εμφάνιση ένδειξης έτοιμο/μη έτοιμο στα κουμπιά λειτουργίας όπλισης.",show_bypassed_sensors:"Εμφάνιση προειδοποιητικού μηνύματος όταν ο συναγερμός οπλίζεται με παρακαμφθέντες αισθητήρες.",use_code_dialog:"Εμφανίστε το πληκτρολόγιο για την εισαγωγή του κωδικού ως αναδυόμενο παράθυρο διαλόγου.",hide_keypad:"Απόκρυψη των κουμπιών του πληκτρολογίου για την εισαγωγή του κωδικού.",available_actions:"Διαθέσιμες ενέργειες:",action_dialog:{title:"Προσαρμογή εμφάνισης της ενέργειας '{action}'",show_button:{title:"Ορατότητα κουμπιού ενέργειας",options:{always:"Εμφανίζεται πάντα",never:"Ποτέ δεν εμφανίζεται",disarmed:"Εμφάνιση μόνο όταν είναι αφοπλισμένο",armed:"Εμφάνιση μόνο όταν είναι οπλισμένο"}},button_icon:"Εμφανιζόμενο εικονίδιο κουμπιού",state_label:"Αντικατάσταση ετικέτας κατάστασης",color:"Παράκαμψη χρώματος που χρησιμοποιείται για την ενέργεια"}},ct={invalid_pin:"Ακυρος",blocking_sensors:"Δεν ήταν δυνατή η όπλιση λόγω των ακόλουθων αισθητήρων",triggered_sensors:"Ο συναγερμός ενεργοποιήθηκε από τους ακόλουθους αισθητήρες",bypassed_sensors:"Υπάρχουν παρακαμφθέντες αισθητήρες"},dt={arm_options:nt,editor:lt,errors:ct},ht={heading:"Options for arming",skip_delay:"Skip exit delay",force:"Bypass open sensors"},pt={keep_keypad_visible:"Keep the keypad always visible, also when no code input is required.",button_scale_actions:"Scaling factor to apply for resizing the action buttons.",button_scale_keypad:"Scaling factor to apply for resizing the keypad buttons.",show_messages:"Display diagnostic messages when alarm is triggered or cannot be armed.",show_ready_indicator:"Show ready/not ready indicator on arm mode buttons.",show_bypassed_sensors:"Show warning message when alarm is armed with bypassed sensors.",use_code_dialog:"Display the keypad for entering the code as a popup dialog.",hide_keypad:"Hide the keypad buttons for entering the code.",available_actions:"Available actions:",action_dialog:{title:"Customize display of action '{action}'",show_button:{title:"Button visibility",options:{always:"Always shown",never:"Never shown",disarmed:"Show only when disarmed",armed:"Hide only when disarmed"}},button_label:"Override displayed action label",button_icon:"Override displayed icon",state_label:"Override displayed state label",color:"Override color used for the action"}},mt={invalid_pin:"Invalid",blocking_sensors:"Could not arm due to the following sensors",triggered_sensors:"Alarm was triggered by the following sensors",bypassed_sensors:"There are bypassed sensors"},ut={arm_options:ht,editor:pt,errors:mt},gt={heading:"Opciones de armado",skip_delay:"Omitir el retardo de salida",force:"Pasar por alto los sensores abiertos"},_t={keep_keypad_visible:"Mantener el teclado siempre visible, también cuando no se requiere ninguna entrada de código.",button_scale_actions:"Factor de escalado para cambiar el tamaño de los botones de acción.",button_scale_keypad:"Factor de escalado para cambiar el tamaño de los botones del teclado.",show_messages:"Mostrar mensajes de diagnóstico cuando se activa la alarma o no se puede activar.",show_ready_indicator:"Mostrar indicador listo/no listo en los botones de modo armado.",show_bypassed_sensors:"Mostrar advertencia cuando la alarma está activada con sensores omitidos.",use_code_dialog:"Muestra el teclado para ingresar el código como un cuadro de diálogo emergente.",hide_keypad:"Ocultar los botones del teclado para ingresar el código.",available_actions:"Acciones disponibles:",action_dialog:{title:"Personalizar la visualización de la acción '{action}'",show_button:{title:"Visibilidad del botón de acción",options:{always:"Mostrar siempre",never:"Ocultar siempre",disarmed:"Mostrar solo si desarmada",armed:"Ocultar solo si desarmada"}},button_label:"Sobrescribir el texto del botón",button_icon:"Icono de botón mostrado",state_label:"Sobrescribir el texto de estado",color:"Anular el color utilizado para la acción"}},bt={invalid_pin:"Inválido",blocking_sensors:"No se pudo armar debido a los siguientes sensores",triggered_sensors:"La alarma fue disparada por los siguientes sensores",bypassed_sensors:"Hay sensores omitidos"},vt={arm_options:gt,editor:_t,errors:bt},ft={heading:"Options pour l'armement",skip_delay:"Ignorer le délai de sortie",force:"Bypasser les capteurs ouverts"},yt={keep_keypad_visible:"Gardez le clavier toujours visible, même lorsqu'aucune saisie de code n'est requise.",button_scale_actions:"Facteur d'échelle à appliquer pour le redimensionnement des boutons des actions.",button_scale_keypad:"Facteur d'échelle à appliquer pour le redimensionnement des boutons du clavier.",show_messages:"Afficher les messages de diagnostic lorsque l'alarme est déclenchée ou ne peut pas être armée.",show_ready_indicator:"Afficher l'indicateur prêt/pas prêt sur les boutons de mode d'armement.",show_bypassed_sensors:"Afficher un avertissement lorsque l'alarme est armée avec des capteurs ignorés.",use_code_dialog:"Affichez le clavier pour saisir le code sous forme de boîte de dialogue contextuelle.",hide_keypad:"Masquer les boutons du clavier pour saisir le code.",available_actions:"Actions disponibles:",action_dialog:{title:"Personnaliser l'affichage de l'action '{action}'",show_button:{title:"Visibilité du bouton d'action",options:{always:"Toujours affiché",never:"Jamais affiché",disarmed:"Afficher uniquement si désarmé",armed:"Afficher uniquement si armé"}},button_label:"Remplacer le libellé du bouton",button_icon:"Icône de bouton affichée",state_label:"Remplacer l'étiquette d'état",color:"Remplacer la couleur utilisée pour l'action"}},wt={invalid_pin:"Invalide",blocking_sensors:"Impossible d'armer en raison du(es) capteur(s) suivant(s)",triggered_sensors:"L'alarme a été déclenchée par le(s) capteur(s) suivant(s)",bypassed_sensors:"Il y a des capteurs ignorés"},kt={arm_options:ft,editor:yt,errors:wt},$t={heading:"Opzioni di inserimento",skip_delay:"Ignorare il ritardo di uscita",force:"Ignorare i sensori aperti"},xt={keep_keypad_visible:"Mantenere la tastiera sempre visibile, anche quando nessun codice è richiesto.",button_scale_actions:"Fattore di scala da applicare per ridimensionare i pulsanti di azione.",button_scale_keypad:"Fattore di scala da applicare per ridimensionare i pulsanti della tastiera.",show_messages:"Mostrare messaggi diagnostici quando l'allarme viene attivato o non può essere inserito.",show_ready_indicator:"Mostra l'indicatore pronto/non pronto sui pulsanti della modalità di inserimento.",show_bypassed_sensors:"Mostra avviso quando l'allarme è armato con sensori esclusi.",use_code_dialog:"Visualizza la tastiera per l'immissione del codice come finestra di dialogo popup.",hide_keypad:"Nascondi i pulsanti della tastiera per l'inserimento del codice.",available_actions:"Azioni disponibili:",action_dialog:{title:"Personalizzare la visualizzazione dell'azione '{action}'",show_button:{title:"Visibilità del pulsante di azione",options:{always:"Sempre visualizzato",never:"Mai visualizzato",disarmed:"Mostra solo quando disarmato",armed:"Mostra solo quando disarmato"}},button_label:"Sovrascrivere l'etichetta del pulsante",button_icon:"Icona del pulsante visualizzato",state_label:"Sovrascrivere l'etichetta di stato",color:"Sostituisci il colore utilizzato per l'azione"}},At={invalid_pin:"Non valido",blocking_sensors:"Impossibile inserire l'allarme a causa dei seguenti sensori",triggered_sensors:"L'allarme è stato attivato dai seguenti sensori",bypassed_sensors:"Sono presenti sensori esclusi"},St={arm_options:$t,editor:xt,errors:At},Ct={heading:"Opties voor inschakelen",skip_delay:"Sla vertraging over",force:"Negeer open sensoren"},zt={keep_keypad_visible:"Houd het keypad altijd zichtbaar, ook wanneer er geen code vereist is.",button_scale_actions:"Schaalfactor actieknoppen",button_scale_keypad:"Schaalfactor keypadknoppen",show_messages:"Toon diagnostische berichten wanneer het alarm wordt geactiveerd of niet kan worden ingeschakeld.",show_ready_indicator:"Toon gereed/niet gereed-indicator op inschakelmodusknoppen.",show_bypassed_sensors:"Toon melding wanneer het alarm is ingeschakeld met omzeilde sensoren.",use_code_dialog:"Geef het toetsenbord voor het invoeren van de code weer als een pop-upvenster.",hide_keypad:"Verberg het toetsenbord voor het invoeren van de code.",available_actions:"Beschikbare acties:",action_dialog:{title:"Weergave van actie '{action}' aanpassen",show_button:{title:"Actieknop weergave",options:{always:"Altijd zichtbaar",never:"Nooit zichtbaar",disarmed:"Toon alleen bij uitgeschakeld",armed:"Zichtbaar tenzij uitgeschakeld"}},button_label:"Weergegeven naam voor actie",button_icon:"Weergegeven icoon voor actie",state_label:"Weergegeven status",color:"Weergegeven kleur voor action"}},Ot={invalid_pin:"Ongeldig",blocking_sensors:"Kon niet inschakelen vanwege de volgende sensoren",triggered_sensors:"Alarm werd geactiveerd door de volgende sensoren",bypassed_sensors:"Er zijn omzeilde sensoren"},Et={arm_options:Ct,editor:zt,errors:Ot},Mt={heading:"Opções para armar",skip_delay:"Omitir tempo para sair",force:"Ignorar os sensores abertos"},Tt={keep_keypad_visible:"Mantenha o teclado sempre visível, mesmo quando não for necessária nenhuma entrada de código.",button_scale_actions:"Fator de escala para redimensionar botões de ação.",button_scale_keypad:"Fator de escala para redimensionar os botões do teclado.",show_messages:"Mostrar mensagens de diagnóstico quando o alarme estiver disparado ou não puder ser armado.",show_ready_indicator:"Mostrar indicador de disponível/não disponível nos botões do modo de armar.",show_bypassed_sensors:"Mostrar aviso quando o alarme for ativado com sensores ignorados.",use_code_dialog:"Exiba o teclado para inserir o código como uma caixa de diálogo pop-up.",hide_keypad:"Oculte os botões do teclado para inserir o código.",available_actions:"Ações disponíveis:",action_dialog:{title:"Personalize a exibição da ação '{action}'",show_button:{title:"Visibilidade do botão de ação",options:{always:"Sempre visível",never:"Sempre visível",disarmed:"Mostrar somente quando desarmado",armed:"Mostrar somente quando armado"}},button_label:"Substituir texto do botão",button_icon:"Ícone de botão exibido",state_label:"Substituir texto de status",color:"Substituir a cor usada para a ação"}},jt={invalid_pin:"Inválido",blocking_sensors:"Não foi possível armar devido aos seguintes sensores",triggered_sensors:"O alarme foi disparado pelos seguintes sensores",bypassed_sensors:"Existem sensores ignorados"},Pt={arm_options:Mt,editor:Tt,errors:jt},Nt={heading:"Варианты постановки на охрану",skip_delay:"Задержка перед выходом",force:"Обход датчиков открытия"},Rt={keep_keypad_visible:"Клавиатура всегда видима, даже если ввод кода не требуется.",button_scale_actions:"Коэффициент масштабирования для изменения размера кнопок действий.",button_scale_keypad:"Коэффициент масштабирования для изменения размера кнопок клавиатуры.",show_messages:"Вывод диагностических сообщений, когда срабатывает сигнализация или ее невозможно включить.",show_ready_indicator:"Отображать индикатор готовности/неготовности на кнопках режима охраны.",show_bypassed_sensors:"Вывод предупреждающего сообщения, когда сигнализация включена с помощью обходных датчиков.",use_code_dialog:"Отобразить клавиатуру для ввода кода в виде всплывающего диалогового окна.",hide_keypad:"Скрыть кнопки клавиатуры для ввода кода.",available_actions:"Доступные действия:",action_dialog:{title:"Настройка отображения действия '{action}'",show_button:{title:"Видимость кнопки действия",options:{always:"Показывать всегда",never:"Показывать никогда",disarmed:"Показывать только при снятии с охраны",armed:"Показывать только при поддержании под охраной"}},button_label:"Измененение названия кнопки",button_icon:"Отображаемый значок кнопки",state_label:"Изменение названия состояния",color:"Переопределить цвет, используемый для действия"}},Dt={invalid_pin:"Неверный",blocking_sensors:"Не удалось включить охрану из-за следующих датчиков",triggered_sensors:"Сигнал тревоги был вызван следующими датчиками",bypassed_sensors:"Есть обходные датчики"},Ht={arm_options:Nt,editor:Rt,errors:Dt},Lt={heading:"Alternativ vid aktivering",skip_delay:"Hoppa över lämna fördröjning",force:"Förbikoppla öppna sensorer"},It={keep_keypad_visible:"Håll knappsatsen alltid synlig, även när ingen kodinmatning krävs.",button_scale_actions:"Ändra storlek på åtgärdsknapparna.",button_scale_keypad:"Ändra storlek på knapparna på knappsatsen.",show_messages:"Visa diagnostiska meddelanden när larmet utlöses eller inte kan aktiveras.",show_ready_indicator:"Visa redo/ej redo-indikator på lägesknapparna.",show_bypassed_sensors:"Visa varningsmeddelande när larmet är aktiverat med förbikopplade sensorer.",use_code_dialog:"Visa knappsatsen för att ange koden som en popup-dialogruta.",hide_keypad:"Dölj knapparna på tangentbordet för att ange koden.",available_actions:"Tillgängliga åtgärder:",action_dialog:{title:"Anpassa visningen av åtgärden '{action}'",show_button:{title:"Synlighet för åtgärdsknapp",options:{always:"Visas alltid",never:"Visas aldrig",disarmed:"Visa endast vid avaktivering",armed:"Visa endast vid aktivering"}},button_label:"Anpassad knappetikett",button_icon:"Visad knappikon",state_label:"Anpassad tillståndsetikett",color:"Åsidosättningsfärg som används för åtgärden"}},Ut={invalid_pin:"Ogiltig",blocking_sensors:"Kunde inte aktivera på grund av följande sensorer",triggered_sensors:"Larmet utlöstes av följande sensorer",bypassed_sensors:"Det finns förbikopplade sensorer"},Bt={arm_options:Lt,editor:It,errors:Ut},qt={heading:"警戒选项",skip_delay:"跳过离开延迟",force:"绕过开放的传感器"},Ft={keep_keypad_visible:"保持小键盘总是可见，即使不需要输入密码",button_scale_actions:"调整动作按键大小的缩放系数",button_scale_keypad:"调整小键盘按键大小的缩放系数",show_messages:"当警报被触发或无法警戒时，显示诊断信息。",show_ready_indicator:"在手臂模式按钮上显示就绪/未就绪指示器。",show_bypassed_sensors:"当警报配备旁路传感器时显示警告消息。",use_code_dialog:"以弹出对话框的形式显示用于输入代码的键盘。",hide_keypad:"隐藏用于输入代码的键盘按钮。",available_actions:"可用动作：",action_dialog:{title:"自定义动作'{action}'的显示",show_button:{title:"操作按钮可见性",options:{always:"始终显示",never:"从不显示",disarmed:"仅在解除武装时显示",armed:"仅在武装时显示"}},button_label:"覆盖按钮标签",button_icon:"显示的按钮图标",state_label:"覆盖状态标签",color:"覆盖操作使用的颜色"}},Vt={invalid_pin:"无效的",blocking_sensors:"由于以下传感器而无法警戒",triggered_sensors:"警报是由以下传感器触发的",bypassed_sensors:"有绕过的传感器"},Wt={arm_options:qt,editor:Ft,errors:Vt},Zt={cs:Object.freeze({__proto__:null,arm_options:Qe,default:at,editor:et,errors:tt}),de:Object.freeze({__proto__:null,arm_options:st,default:rt,editor:it,errors:ot}),el:Object.freeze({__proto__:null,arm_options:nt,default:dt,editor:lt,errors:ct}),en:Object.freeze({__proto__:null,arm_options:ht,default:ut,editor:pt,errors:mt}),es:Object.freeze({__proto__:null,arm_options:gt,default:vt,editor:_t,errors:bt}),fr:Object.freeze({__proto__:null,arm_options:ft,default:kt,editor:yt,errors:wt}),it:Object.freeze({__proto__:null,arm_options:$t,default:St,editor:xt,errors:At}),nl:Object.freeze({__proto__:null,arm_options:Ct,default:Et,editor:zt,errors:Ot}),"pt-BR":Object.freeze({__proto__:null,arm_options:Mt,default:Pt,editor:Tt,errors:jt}),ru:Object.freeze({__proto__:null,arm_options:Nt,default:Ht,editor:Rt,errors:Dt}),sv:Object.freeze({__proto__:null,arm_options:Lt,default:Bt,editor:It,errors:Ut}),"zh-Hans":Object.freeze({__proto__:null,arm_options:qt,default:Wt,editor:Ft,errors:Vt})};function Gt(e,t,a="",s=""){const i=t.replace(/['"]+/g,"");var o;try{o=e.split(".").reduce((e,t)=>e[t],Zt[i])}catch(t){o=e.split(".").reduce((e,t)=>e[t],Zt.en)}if(void 0===o&&(o=e.split(".").reduce((e,t)=>e[t],Zt.en)),""!==a&&""!==s){Array.isArray(a)||(a=[a]),Array.isArray(s)||(s=[s]);for(let e=0;e<a.length;e++)o=o.replace(a[e],s[e])}return o}const Kt=["1","2","3","4","5","6","7","8","9","0","clear","submit"];let Yt=class extends(Xe(ne)){constructor(){super(...arguments),this._input="",this._showClearButton=!1,this._narrow=!1,this._codeClearTimer=0}hassSubscribe(){return[this.hass.connection.subscribeMessage(e=>this._fetchData(e),{type:je})]}async _fetchData(e){var t;if(e.data.area_id===(null===(t=this._params)||void 0===t?void 0:t.area_id))switch(e.data.event){case Te.Disarm:case Te.Arm:case Te.Trigger:this._confirm(e.data.event);break;case Te.InvalidCodeProvided:case Te.NoCodeProvided:this._showCodeError();break;case Te.FailedToArm:case Te.CommandNotAllowed:this._confirm(e.data.event);case Te.TriggerTimeExpired:case Te.ReadyToArmModesChanged:}}shouldUpdate(e){const t=e.get("hass");return!(!e.has("_params")&&this._params)||(!!e.has("_input")||(!t||t.states[this._params.entity_id]!==this.hass.states[this._params.entity_id]&&(t.states[this._params.entity_id],this.hass.states[this._params.entity_id],!0)))}firstUpdated(e){super.firstUpdated(e),this.addEventListener("keypress",e=>{"Enter"===e.key&&this._input.length&&this._submit()})}async showDialog(e){this._params=e,this._input="",this._narrow=matchMedia("all and (max-width: 450px), all and (max-height: 500px)").matches,await this.updateComplete}closeDialog(){return this._params=void 0,this._showClearButton=!1,!0}_showCodeError(){var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#code");t&&(t.classList.remove("error"),t.classList.add("error"),t.hint=Gt("errors.invalid_pin",this.hass.language))}_clearCodeError(){var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#code");t&&t.classList.contains("error")&&(t.classList.remove("error"),t.hint="",this._input="",this._cancelCodeClearTimer())}_clearCode(){this._input="",this._clearCodeError(),this._cancelCodeClearTimer()}_setCodeClearTimer(){this._cancelCodeClearTimer(),this._input.length&&(this._codeClearTimer=window.setTimeout(()=>{this._clearCode()},12e4))}_cancelCodeClearTimer(){this._codeClearTimer&&clearTimeout(this._codeClearTimer)}_submit(){var e;const t=null!==(e=this._input)&&void 0!==e?e:"";this._clearCodeError(),this._params.action==Oe.Disarm?this.hass.callService("alarmo","disarm",{entity_id:this._params.entity_id,code:t}):this.hass.callService("alarmo","arm",Object.assign(Object.assign({},this._params.armOptions),{entity_id:this._params.entity_id,mode:Me[this._params.action],code:t}))}_confirm(e){var t,a;null===(a=null===(t=this._params)||void 0===t?void 0:t.confirm)||void 0===a||a.call(t,e),this.closeDialog()}_cancel(){var e,t;null===(t=null===(e=this._params)||void 0===e?void 0:e.cancel)||void 0===t||t.call(e),this.closeDialog()}_numberClick(e){const t=e.currentTarget.value;this._clearCodeError(),this._setCodeClearTimer(),this._input=this._input+t,this._showClearButton=!0}_clear(){this._input="",this._showClearButton=!1}render(){if(!this._params||!this.hass)return V;return"text"===this._params.code_format?q`
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
            ${Kt.map(e=>""===e?q`<span></span>`:"clear"===e?q`
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
    `}};Yt.styles=r`
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
  `,e([pe({attribute:!1})],Yt.prototype,"hass",void 0),e([me()],Yt.prototype,"_params",void 0),e([me()],Yt.prototype,"_input",void 0),e([me()],Yt.prototype,"_showClearButton",void 0),e([me()],Yt.prototype,"_narrow",void 0),Yt=e([ce("hmac-code-dialog")],Yt);var Jt=Object.freeze({__proto__:null,get AlarmoCodeDialog(){return Yt}});let Xt=class extends ne{render(){if(!this.hass||!this.config)return V;const e=this.hass.states[this.config.entity];let t=e.state;const a=Object.values(Oe).map(e=>Me[e]);if(!a.includes(t)){const a=e.attributes.arm_mode;a&&(t=a)}return q`
      <div class="container">
        ${this._renderOptions(t)}
      </div>
    `}_renderOptions(e){const t=this.hass.states[this.config.entity],a=[Oe.Disarm,...Fe(t)].filter(e=>{const a=qe(Me[e],this.config).hide;if("boolean"==typeof a||!Ie(a))return!a;switch(a){case"always":return!1;case"never":return!0;case"armed":return"disarmed"==t.state;case"disarmed":return"disarmed"!==t.state}}),s=a.map(e=>qe(Me[e],this.config)).some(e=>!Ie(e.button_label)||e.button_label.length);return a.sort((e,t)=>{const a=qe(Me[e],this.config).button_order,s=qe(Me[t],this.config).button_order;return Ie(a)||Ie(s)?Ie(a)&&!Ie(s)?-1:!Ie(a)&&Ie(s)?1:a-s:0}),a.map(a=>{const i=Ie(this.readyForArmModes)&&!this.readyForArmModes.includes(Me[a])&&a!=Oe.Disarm,o=qe(Me[a],this.config);return q`
        <div class="button ${Me[a]==e?"selected":""}"
          style="--btn-color: ${Ze(Object.assign(Object.assign({},t),{state:Me[a]}),this.config)}"
          @click=${e=>this._handleClick(e,a)}>
          <div class="content ${s?"has-text":""}">
            <ha-icon icon="${Ue(o.button_icon)?Ee[a]:o.button_icon}"></ha-icon>
            ${Me[a]!=e&&Ie(this.readyForArmModes)?q`
              <ha-icon
                icon="${"mdi:circle-medium"}"
                class="badge ${i?"error":"success"}"
              ></ha-icon>
            `:V}
            <span>
              ${Ie(o.button_label)?o.button_label:a==Oe.Disarm&&t.state!==Ce.Disarmed?this.hass.localize(`ui.card.alarm_control_panel.${a}`):this.hass.localize(`ui.card.alarm_control_panel.modes.${Me[a]}`)}
            </span>
          </div>
        </div>
      `})}_handleClick(e,t){He(this,"button-clicked",{ev:e,action:t})}static get styles(){return r`
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
        background: var(--primary-text-color);
        opacity: 0.05;
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
        background: var(--btn-color, var(--selected-color));
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
      div.content ha-icon {
        display: flex;
        color: var(--hmac-alarm-icon-color, var(--btn-color, inherit));
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
        color: var(--hmac-alarm-icon-active-color, white);
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
    `}};e([pe({attribute:!1})],Xt.prototype,"hass",void 0),e([pe({attribute:!1})],Xt.prototype,"config",void 0),e([pe({attribute:!1})],Xt.prototype,"readyForArmModes",void 0),Xt=e([ce("hmac-actions-bar")],Xt);const Qt=["1","2","3","4","5","6","7","8","9","","0","clear"];let ea=class extends(Xe(ne)){constructor(){super(...arguments),this._input="",this.warning="",this.area_id=void 0,this.armOptions=Object.assign({},Re),this.readyForArmModes=null,this.backendConnection=null,this.showBypassedSensors=!1,this.subscribedEntities=[],this._codeClearTimer=0}async getCardSize(){var e;if(!this._config||!this.hass)return 9;const t=this.hass.states[this._config.entity];return t&&(null===(e=this._alarmoConfig)||void 0===e?void 0:e.code_format)===Se?!We(t)&&!this._config.keep_keypad_visible||this._config.use_code_dialog?4:9:4}set cardConfig(e){e&&JSON.stringify(e)!==JSON.stringify(this._cardConfigRaw)&&(this._cardConfigRaw=e,this.setConfig(e))}setConfig(e){!(null==e?void 0:e.button_scale_actions)&&(null==e?void 0:e.button_scale)&&(e=Object.assign(Object.assign({},e),{button_scale_actions:null==e?void 0:e.button_scale})),!(null==e?void 0:e.button_scale_keypad)&&(null==e?void 0:e.button_scale)&&(e=Object.assign(Object.assign({},e),{button_scale_keypad:null==e?void 0:e.button_scale})),(e=>{if(!e||!e.entity||"alarm_control_panel"!==Be(e.entity))throw new Error("Invalid configuration provided for entity");if(Ie(e.button_scale_keypad)&&("number"!=typeof e.button_scale_keypad||e.button_scale_keypad<1||e.button_scale_keypad>2.5))throw new Error("Invalid configuration provided for button_scale_keypad");if(Ie(e.button_scale_actions)&&("number"!=typeof e.button_scale_actions||e.button_scale_actions<1||e.button_scale_actions>2.5))throw new Error("Invalid configuration provided for button_scale_actions")})(e),this._config=Object.assign(Object.assign({},Ne),e)}hassSubscribe(){return[this.hass.connection.subscribeMessage(e=>this._fetchData(e),{type:je})]}async firstUpdated(){const e=await window.loadCardHelpers(),t=await e.createCardElement({type:"entities",entities:[]});await t.constructor.getConfigElement(),await this.loadBackendConfig()}async loadBackendConfig(){var e;this.backendConnection||(e=this.hass,e.callWS({type:"alarmo/entities"})).then(e=>{const t=e.find(e=>e.entity_id==this._config.entity);t&&(this.area_id=t.area_id?t.area_id:null)}).then(()=>(e=>e.callWS({type:"alarmo/config"}))(this.hass)).then(e=>{this._alarmoConfig=e,this.backendConnection=!0}).then(()=>((e,t)=>e.callWS({type:"alarmo/ready_to_arm_modes",entity_id:t}))(this.hass,this._config.entity)).then(e=>{this.readyForArmModes=e.modes}).catch(e=>{this.backendConnection=!1})}async _fetchData(e){if(e.data.area_id===this.area_id)switch(e.data.event){case Te.Arm:this._clearCode();break;case Te.Trigger:break;case Te.InvalidCodeProvided:case Te.NoCodeProvided:this._showCodeError(),this.subscribedEntities=[];break;case Te.FailedToArm:this.warning="blocking_sensors",this._last_command=e.data.command,this._last_code=this._input,this._clearCode();break;case Te.CommandNotAllowed:this._clearCode();break;case Te.TriggerTimeExpired:break;case Te.ReadyToArmModesChanged:this.readyForArmModes=e.data.modes}}shouldUpdate(e){if(e.has("_config"))return!0;const t=e.get("hass");if(!t||t.themes!==this.hass.themes||t.language!==this.hass.language||t.config.state!==this.hass.config.state)return!0;if(t.states[this._config.entity]!==this.hass.states[this._config.entity]){const e=t.states[this._config.entity],a=this.hass.states[this._config.entity];return!1===this.backendConnection&&(async()=>{await this.loadBackendConfig()})(),this.processStateUpdate(e,a),!0}return!(!this.subscribedEntities.length||!this.subscribedEntities.some(e=>t.states[e]!==this.hass.states[e]))}processStateUpdate(e,t){t.state!=e.state&&(this.subscribedEntities=[]),(t.state==Ce.Disarmed||t.last_changed!==e.last_changed)&&this._clearCode()}render(){var e,t;if(!this._config||!this.hass||null===this.backendConnection)return q``;const a=this.hass.states[this._config.entity];return a?!1===this.backendConnection?q`
        <hui-warning>
          Could not establish a connection with the alarmo integration. Please check if it is installed and the correct
          entity is selected in the card settings.
        </hui-warning>
      `:q`
      <ha-card>
        <div class="header">
          <div class="icon">
            <hmac-state-badge
              .hass=${this.hass}
              .entity=${this._config.entity}
              style="--alarm-state-color: ${Ze(a,this._config)}"
            >
            </hmac-state-badge>
          </div>
          <div class="summary">
            ${!1===this._config.show_name?"":q`<div class="name">
              ${((e,t)=>Ue(t.name)?e.attributes.friendly_name:t.name)(a,this._config)}
            </div>`}
            ${!1===this._config.show_state?"":q`<div class="state">
              ${Ve(a,this.hass.localize,this._config)}
            </div>`}
          </div>
        </div>

        ${this._renderWarning()}

        <div id="actions" class="actions">
          ${this._renderActions()}
        </div>

        ${a.state===Ce.Disarmed&&!1!==this._config.show_arm_options?q`
          <div class="chips" role="group" aria-label=${Gt("arm_options.heading",this.hass.language)}>
            ${["skip_delay","force"].map(e=>q`
              <button class="chip ${this.armOptions[e]?"on":""}" aria-pressed=${this.armOptions[e]?"true":"false"}
                @click=${t=>this._toggleArmOptions(t,e)}>
                <ha-icon icon=${this.armOptions[e]?"mdi:check":"skip_delay"===e?"mdi:timer-off-outline":"mdi:shield-alert-outline"}></ha-icon>
                ${Gt(`arm_options.${e}`,this.hass.language)}
              </button>`)}
          </div>`:""}

        ${!We(a)&&!this._config.keep_keypad_visible||this._config.use_code_dialog?q``:q`
              <ha-input
                .value=${this._input}
                .label=${this.hass.localize("ui.card.alarm_control_panel.code")}
                ?disabled=${!We(a)}
                @input=${e=>{this._clearCodeError(),this._input=e.target.value,this._setCodeClearTimer()}}
                @focus=${this._clearCodeError}
                type="password"
                id="code_input"
                .inputmode=${(null===(e=this._alarmoConfig)||void 0===e?void 0:e.code_format)===Se?"numeric":"text"}
              ></ha-input>
            `}
        ${!We(a)&&!this._config.keep_keypad_visible||(null===(t=this._alarmoConfig)||void 0===t?void 0:t.code_format)!==Se||this._config.use_code_dialog||this._config.hide_keypad?q``:q`
          <div id="keypad" class="keypad" style="max-width: ${300*this._config.button_scale_keypad}px">
            ${Qt.map(e=>""===e?q`
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
                ?disabled=${!We(a)||"clear"===e&&!this._input.length}
                class="${"clear"!==e?"numberKey":"clear"}"
                style="--content-scale: ${this._config.button_scale_keypad}"
                ?scaled=${1!=this._config.button_scale_keypad}
              >
                ${"clear"===e?q`<ha-icon icon="mdi:close" style="--mdc-icon-size: calc(${this._config.button_scale_keypad} * 24px)"></ha-icon>`:q` <span>${e}</span>`}
              </hmac-button>
            `)}
          </div>
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
        style="--alarm-state-color: ${Ze(e,this._config,!0)}; --content-scale: ${this._config.button_scale_actions}"
      ></hmac-actions-bar>
    `}_renderWarning(){var e;if(!this.hass||!this._config||!this._config.show_messages)return q``;const t=this.hass.states[this._config.entity];return t.attributes.open_sensors&&t.state==Ce.Triggered||"blocking_sensors"==this.warning&&t.attributes.open_sensors?q`
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
              <span>${Gt("arm_options.force",this.hass.language)}</span>
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
                ${Gt("errors.bypassed_sensors",this.hass.language)}
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
      `:q``}_handlePadClick(e){const t=e.currentTarget.value;this._clearCodeError(),this._input="clear"===t?"":this._input+t}async _handleActionClick(e,t){var a;e.target.blur(),this._clearCodeError();const s=this.hass.states[this._config.entity];if((null===(a=this._config)||void 0===a?void 0:a.use_code_dialog)&&!this._config.hide_keypad&&We(s)){const a=await new Promise(a=>{const s=e.target,i={code_format:this._alarmoConfig.code_format,area_id:this.area_id,entity_id:this._config.entity,action:t,armOptions:this.armOptions,cancel:()=>{a(null)},confirm:e=>{a(e)}};He(s,"show-dialog",{dialogTag:"hmac-code-dialog",dialogImport:()=>Promise.resolve().then(function(){return Jt}),dialogParams:i})});a!=Te.Arm&&a!=Te.Disarm||(this.warning="",this.armOptions=Object.assign({},Re))}else t==Oe.Disarm?this.hass.callService("alarmo","disarm",{entity_id:this._config.entity,code:this._input}):this.hass.callService("alarmo","arm",Object.assign(Object.assign({},this.armOptions),{entity_id:this._config.entity,mode:Me[t],code:this._input})),this.warning="",this.armOptions=Object.assign({},Re)}_showCodeError(){var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#code_input");t&&(t.classList.remove("error"),t.classList.add("error"),t.hint=Gt("errors.invalid_pin",this.hass.language))}_clearCodeError(){var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#code_input");t&&t.classList.contains("error")&&(t.classList.remove("error"),t.hint="",this._input="",this._cancelCodeClearTimer())}_clearCode(){this._input="",this._clearCodeError(),this._cancelCodeClearTimer()}_setCodeClearTimer(){this._cancelCodeClearTimer(),this._input.length&&(this._codeClearTimer=window.setTimeout(()=>{this._clearCode()},12e4))}_cancelCodeClearTimer(){this._codeClearTimer&&clearTimeout(this._codeClearTimer)}_toggleArmOptions(e,t){e.stopImmediatePropagation(),e.target.blur(),"skip_delay"==t?this.armOptions=Object.assign(Object.assign({},this.armOptions),{skip_delay:!this.armOptions.skip_delay}):"force"==t&&(this.armOptions=Object.assign(Object.assign({},this.armOptions),{force:!this.armOptions.force}))}_forceRetryClick(){if(!this.hass||!this._config||!this._last_command)return;let e=this._last_command;this.hass.callService("alarmo","arm",{entity_id:this._config.entity,mode:Me[e],code:this._last_code,force:!0}),this._last_command=void 0,this._last_code=void 0}static get styles(){return r`
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
    `}};e([pe({attribute:!1})],ea.prototype,"hass",void 0),e([me()],ea.prototype,"_config",void 0),e([me()],ea.prototype,"_alarmoConfig",void 0),e([me()],ea.prototype,"_input",void 0),e([me()],ea.prototype,"warning",void 0),e([me()],ea.prototype,"area_id",void 0),e([me()],ea.prototype,"armOptions",void 0),e([me()],ea.prototype,"readyForArmModes",void 0),e([me()],ea.prototype,"backendConnection",void 0),e([me()],ea.prototype,"showBypassedSensors",void 0),e([pe({attribute:!1})],ea.prototype,"cardConfig",null),ea=e([ce("hmac-alarm")],ea);const ta=[["var(--primary-color)","Primary"],["var(--accent-color)","Accent"],["var(--primary-text-color)","Primary text"],["var(--secondary-text-color)","Secondary text"],["var(--disabled-text-color)","Disabled text"],["var(--state-active-color)","State active"],["var(--error-color)","Error"],["var(--warning-color)","Warning"],["var(--success-color)","Success"],["var(--info-color)","Info"]],aa=["keep_keypad_visible","use_code_dialog","hide_keypad","show_messages","show_ready_indicator","show_bypassed_sensors"],sa={keep_keypad_visible:!1,use_code_dialog:!1,hide_keypad:!1,show_messages:!0,show_ready_indicator:!0,show_bypassed_sensors:!0},ia={keep_keypad_visible:"Always show the code keypad",use_code_dialog:"Ask for the code in a dialog",hide_keypad:"Hide the code keypad",show_messages:"Messages (not ready, triggered)",show_ready_indicator:"Ready dot on the arm buttons",show_bypassed_sensors:"Warn about bypassed zones"},oa=[300,400,500,600,700,800],ra=[["monospace","Monospace (panel display)"],["sans","Sans-serif (theme)"],["serif","Serif"]],na={monospace:"monospace",sans:"sans-serif",serif:"serif"};let la=class extends ne{setConfig(e){this.config=e}firstUpdated(){var e;null===(e=this.hass)||void 0===e||e.callWS({type:"alarmo/ext/card/get"}).then(e=>this.data=e).catch(()=>{})}get cfg(){return Object.assign(Object.assign({},_e),this.config||{})}emit(e){const t=Object.assign({},e);for(const[e,a]of Object.entries(_e))t[e]===a&&delete t[e];Array.isArray(t.hidden_modes)&&!t.hidden_modes.length&&delete t.hidden_modes;const a=(e=>{if(!e)return;const t={};for(const[a,s]of Object.entries(e)){if(!s||"object"!=typeof s)continue;const e=ve(Object.entries(s).filter(([,e])=>void 0!==e&&""!==e&&null!==e&&("card"===a||0!==e)));Object.keys(e).length&&(t[a]=e)}return Object.keys(t).length?t:void 0})(t.styles);if(a?t.styles=a:delete t.styles,t.alarm){for(const[e,a]of Object.entries(sa))t.alarm[e]===a&&delete t.alarm[e];for(const e of["button_scale_actions","button_scale_keypad"])1===t.alarm[e]&&delete t.alarm[e];Object.keys(t.alarm).length||delete t.alarm}t.name||delete t.name,t.entity||delete t.entity,this.config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}set(e,t){this.emit(Object.assign(Object.assign({},this.config),{[e]:t}))}setAlarm(e,t){const a=Object.assign(Object.assign({},(this.config||{}).alarm||{}),{[e]:t});this.emit(Object.assign(Object.assign({},this.config),{alarm:a}))}setStyle(e,t,a){const s=(e=>JSON.parse(JSON.stringify(null!=e?e:null)))((this.config||{}).styles||{});s[e]=Object.assign({},s[e]||{}),void 0===a||""===a||null===a?delete s[e][t]:s[e][t]=a,this.emit(Object.assign(Object.assign({},this.config),{styles:s}))}styleOf(e){return((this.config||{}).styles||{})[e]||{}}toggle(e,t,a,s){return q`<label class="row check">
      <input type="checkbox" .checked=${t} @change=${e=>a(e.target.checked)} />
      <span>${e}</span>${s?q`<span class="hint inline">${s}</span>`:V}
    </label>`}slider(e,t,a,s,i,o,r,n,l=!0){return q`<div class="row slider">
      <span class="lab">${e}</span>
      <div class="ctl nowrap">
        <input type="range" .min=${String(l?0:a)} .max=${String(s)} .step=${String(i)}
          .value=${String(t||(l?0:a))}
          @input=${e=>{const t=Number(e.target.value);n(l&&t>0&&t<a?a:t)}} />
        <span class="val">${l&&!t?q`<span class="muted">${r}${o}</span>`:q`${t}${o}`}</span>
      </div>
    </div>`}select(e,t,a,s){return q`<div class="row">
      <span class="lab">${e}</span>
      <select class="ctl" @change=${e=>s(e.target.value)}>
        ${a.map(([e,a])=>q`<option value=${e} ?selected=${e===t}>${a}</option>`)}
      </select>
    </div>`}triState(e,t,a,s){const i=void 0===t?"":t?"on":"off";return this.select(e,i,[["",a],["off","Off"],["on","On"]],e=>s(""===e?void 0:"on"===e))}color(e,t,a,s,i){const o=(e=>{const t=null==e?"":String(e);return""===t?"default":/^#[0-9a-fA-F]{3,8}$/.test(t)?"custom":/^var\(/.test(t)&&ta.some(([e])=>e===t)?"theme":"css"})(t),r=/^#[0-9a-fA-F]{6}$/.test(t||"")?t:s;return q`<div class="row">
      <span class="lab">${e}</span>
      <div class="ctl color">
        <select aria-label=${`${e}: kind`} @change=${e=>{const a=e.target.value;i("default"===a?void 0:"theme"===a?ta[0][0]:"custom"===a?r:t&&"default"!==o?t:s)}}>
          <option value="default" ?selected=${"default"===o}>${a}</option>
          <option value="theme" ?selected=${"theme"===o}>Theme colour</option>
          <option value="custom" ?selected=${"custom"===o}>Custom colour</option>
          <option value="css" ?selected=${"css"===o}>CSS value</option>
        </select>
        ${"theme"===o?q`<select aria-label=${`${e}: theme colour`} @change=${e=>i(e.target.value)}>
              ${ta.map(([e,a])=>q`<option value=${e} ?selected=${e===t}>${a}</option>`)}
            </select>`:"custom"===o?q`<input type="color" aria-label=${e} .value=${r} @input=${e=>i(e.target.value)} />`:"css"===o?q`<input type="text" aria-label=${e} placeholder="tomato, rgba(…), var(--…)" .value=${t||""}
                  @change=${e=>i(e.target.value||void 0)} />`:V}
      </div>
    </div>`}panel(e,t,a,s,i,o=!1){return q`<details class="panel" ?open=${o} data-id=${e}>
      <summary><ha-icon icon=${t}></ha-icon><span>${a}</span><ha-icon class="chev" icon="mdi:chevron-down"></ha-icon></summary>
      <div class="body"><p class="hint">${s}</p>${i}</div>
    </details>`}sub(e,t){return q`<details class="sub">
      <summary><span>${e}</span><ha-icon class="chev" icon="mdi:chevron-down"></ha-icon></summary>
      <div class="sub-body">${t}</div>
    </details>`}group(e){return q`<div class="group">${e}</div>`}textStyle(e){const t=ue[e],a=this.styleOf(e);return this.sub(t.label,q`
      ${this.group("Size and weight")}
      ${this.slider("Size",a.size||0,6,48,1," px",t.size,t=>this.setStyle(e,"size",t||void 0))}
      ${this.select("Weight",a.weight?String(a.weight):"",[["",`Card default (${t.weight})`],...oa.map(e=>[String(e),String(e)])],t=>this.setStyle(e,"weight",t?Number(t):void 0))}
      ${this.group("Font and case")}
      ${this.select("Font",a.font||"",[["",`Card default (${na[t.font]})`],...ra],t=>this.setStyle(e,"font",t||void 0))}
      ${this.triState("Italic",a.italic,"Card default (off)",t=>this.setStyle(e,"italic",t))}
      ${this.triState("Capitals",a.caps,`Card default (${t.caps?"on":"off"})`,t=>this.setStyle(e,"caps",t))}
      ${this.group("Colour")}
      ${this.color("Text colour",a.color,"Card default","#e1e1e1",t=>this.setStyle(e,"color",t))}
    `)}iconStyle(e,t,a,s){const i=ge[e],o=this.styleOf(e);return this.sub(i.label,q`
      ${this.group("Size")}
      ${this.slider("Size",o.size||0,12,96,1," px",i.size,t=>this.setStyle(e,"size",t||void 0))}
      ${this.group("Colour")}
      ${this.color(a?"Colour (not selected)":"Colour",o.color,t,"#9e9e9e",t=>this.setStyle(e,"color",t))}
      ${a?this.color(a,o.active_color,s||"Card default","#ffffff",t=>this.setStyle(e,"active_color",t)):V}
    `)}render(){var e,t,a,s;if(!this.hass||!this.config)return V;const i=this.cfg,o=Object.assign(Object.assign(Object.assign({},sa),{button_scale_actions:1,button_scale_keypad:1}),this.config.alarm||{}),r=(null===(e=this.data)||void 0===e?void 0:e.alarms)||[],n=(null===(t=this.data)||void 0===t?void 0:t.house.modes)||[],l=this.styleOf("card");return q`<div class="ed">
      ${this.panel("card","mdi:card-outline","Card","Which Alarmo alarm the card controls, and the frame around it.",q`
        ${this.group("Alarm")}
        ${this.select("Alarmo alarm",i.entity||"",[["","First linked alarm"],...r.map(e=>[e.entity_id,`${e.name} (${e.entity_id})`])],e=>this.set("entity",e||void 0))}
        <div class="row"><span class="lab">Name</span>
          <input class="ctl" type="text" placeholder="Shown when House Modes are off" .value=${i.name||""}
            @change=${e=>this.set("name",e.target.value||void 0)} /></div>
        ${this.group("Frame")}
        ${this.slider("Border width",null!==(a=l.border_width)&&void 0!==a?a:2,0,8,1," px",2,e=>this.setStyle("card","border_width",2===e?void 0:e),!1)}
        ${this.slider("Corner radius",null!==(s=l.radius)&&void 0!==s?s:12,0,32,1," px",12,e=>this.setStyle("card","radius",12===e?void 0:e),!1)}
        <p class="hint">The border shows the state: red alarm, orange arming or not ready, the House Mode's colour while
          armed, green ready.</p>
      `,!0)}

      ${this.panel("sections","mdi:view-agenda-outline","Sections","Turn each part of the card on or off.",q`
        ${this.toggle("Header: House Mode and panel display",i.show_header,e=>this.set("show_header",e))}
        ${this.toggle("House Mode buttons",i.show_house_modes,e=>this.set("show_house_modes",e))}
        ${this.toggle("Alarm: arm / disarm, code, messages",i.show_alarm,e=>this.set("show_alarm",e))}
        ${this.toggle("Physical panel keypad",i.show_panel_keypad,e=>this.set("show_panel_keypad",e))}
        ${this.group("Collapsing")}
        ${this.toggle("Collapsible card (tap the header)",i.collapsible,e=>this.set("collapsible",e))}
        ${i.collapsible?this.toggle("Start collapsed",i.start_collapsed,e=>this.set("start_collapsed",e)):V}
        ${i.collapsible||i.alarm_collapsible?this.toggle("Show the open / close arrow",i.show_chevron,e=>this.set("show_chevron",e)):V}
      `)}

      ${this.panel("header","mdi:page-layout-header","Header","The House Mode icon and name, and the physical panel's two display lines.",q`
        ${this.group("Status lines")}
        ${this.toggle("House Mode name",i.show_mode_name,e=>this.set("show_mode_name",e))}
        ${this.toggle("Panel display, line 1",i.show_line1,e=>this.set("show_line1",e))}
        ${this.toggle("Panel display, line 2",i.show_line2,e=>this.set("show_line2",e))}
        ${this.group("Styles")}
        ${this.iconStyle("header_icon","House Mode's colour")}
        ${i.show_mode_name?this.textStyle("mode_name"):V}
        ${i.show_line1?this.textStyle("line1"):V}
        ${i.show_line2?this.textStyle("line2"):V}
      `)}

      ${this.panel("modes","mdi:home-switch-outline","House Mode buttons","One button per House Mode; icons and colours come from the House Modes tab.",i.show_house_modes?q`
          ${this.group("Layout")}
          ${this.select("Alignment",i.modes_align,[["grid","Standard (fixed columns, wrap left)"],["center","Centre on width"]],e=>this.set("modes_align",e))}
          ${this.slider("Buttons per row",i.columns,2,9,1,"",5,e=>this.set("columns",e),!1)}
          ${this.toggle("Button text",i.show_mode_labels,e=>this.set("show_mode_labels",e))}
          ${n.length?q`${this.group("Buttons shown")}
                <div class="chips">${n.map(e=>{const t=(i.hidden_modes||[]).includes(e.id)||(i.hidden_modes||[]).includes(e.name);return q`<button class="chip ${t?"":"on"}" aria-pressed=${t?"false":"true"}
                    @click=${()=>this.set("hidden_modes",t?(i.hidden_modes||[]).filter(t=>t!==e.id&&t!==e.name):[...i.hidden_modes||[],e.id])}>
                    <ha-icon icon=${e.icon} style=${`color:${e.color}`}></ha-icon>${e.name}</button>`})}</div>`:V}
          ${this.group("Styles")}
          ${this.iconStyle("mode_icon","Secondary text","Colour (selected)","House Mode's colour")}
          ${i.show_mode_labels?this.textStyle("mode_label"):V}`:q`<p class="hint">Turned off under Sections.</p>`)}

      ${this.panel("alarm","mdi:shield-lock-outline","Alarm","Arm and disarm Alarmo, enter the code, see why it will not arm.",i.show_alarm?q`
          ${this.group("Collapsing")}
          ${this.toggle("Collapsible alarm section (a bar with the state)",i.alarm_collapsible,e=>this.set("alarm_collapsible",e))}
          ${i.alarm_collapsible?this.toggle("Start collapsed",i.alarm_start_collapsed,e=>this.set("alarm_start_collapsed",e)):V}
          ${this.group("Status lines")}
          ${this.toggle("Alarm name",i.show_alarm_name,e=>this.set("show_alarm_name",e))}
          ${this.toggle("Alarm state",i.show_alarm_state,e=>this.set("show_alarm_state",e))}
          ${this.group("Arm buttons")}
          ${this.toggle("Colours from the House Modes",i.alarm_colors_from_modes,e=>this.set("alarm_colors_from_modes",e),"each arm mode in the colour of the House Mode that sets it")}
          ${this.toggle("Option chips: Skip exit delay, Bypass open sensors",i.show_arm_options,e=>this.set("show_arm_options",e))}
          ${this.slider("Arm button scale",Math.round(10*o.button_scale_actions)/10,1,2.5,.1,"×",1,e=>this.setAlarm("button_scale_actions",e),!1)}
          ${this.group("Code entry and messages")}
          ${aa.map(e=>this.toggle(ia[e],!!o[e],t=>this.setAlarm(e,t)))}
          ${this.slider("Code keypad scale",Math.round(10*o.button_scale_keypad)/10,1,2.5,.1,"×",1,e=>this.setAlarm("button_scale_keypad",e),!1)}
          ${this.group("Styles")}
          ${i.alarm_collapsible?this.textStyle("alarm_bar"):V}
          ${i.show_alarm_name?this.textStyle("alarm_name"):V}
          ${i.show_alarm_state?this.textStyle("alarm_state"):V}
          ${this.iconStyle("alarm_icon","Arm mode colour","Colour (selected)","White")}
          ${this.textStyle("alarm_button")}
          ${i.show_arm_options?this.textStyle("chip"):V}`:q`<p class="hint">Turned off under Sections.</p>`)}

      ${this.panel("keypad","mdi:dialpad","Physical panel keypad","The panel's 12 keys with their functions, sent through Alarmo.",i.show_panel_keypad?q`
          <p class="hint">Who may use the keys is set in the integration: Alarmo panel → Physical Panel → <em>Panel keypad on
            dashboards</em>. Other users see the keys disabled.</p>
          ${this.group("Styles")}
          ${this.textStyle("key_digit")}
          ${this.textStyle("key_label")}`:q`<p class="hint">Turned off under Sections.</p>`)}
    </div>`}};la.styles=r`
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
  `,e([pe({attribute:!1})],la.prototype,"hass",void 0),e([me()],la.prototype,"config",void 0),e([me()],la.prototype,"data",void 0),la=e([ce("house-modes-alarm-center-card-editor")],la);var ca,da,ha,pa;!function(e){e.STATE_ALARM_DISARMED="disarmed",e.STATE_ALARM_ARMED_HOME="armed_home",e.STATE_ALARM_ARMED_AWAY="armed_away",e.STATE_ALARM_ARMED_NIGHT="armed_night",e.STATE_ALARM_ARMED_CUSTOM_BYPASS="armed_custom_bypass",e.STATE_ALARM_ARMED_VACATION="armed_vacation",e.STATE_ALARM_PENDING="pending",e.STATE_ALARM_ARMING="arming",e.STATE_ALARM_TRIGGERED="triggered"}(ca||(ca={})),function(e){e.COMMAND_ALARM_DISARM="disarm",e.COMMAND_ALARM_ARM_HOME="arm_home",e.COMMAND_ALARM_ARM_AWAY="arm_away",e.COMMAND_ALARM_ARM_NIGHT="arm_night",e.COMMAND_ALARM_ARM_CUSTOM_BYPASS="arm_custom_bypass",e.COMMAND_ALARM_ARM_VACATION="arm_vacation"}(da||(da={})),function(e){e.Door="door",e.Window="window",e.Motion="motion",e.Tamper="tamper",e.Environmental="environmental",e.Other="other"}(ha||(ha={})),function(e){e.Notification="notification",e.Action="action"}(pa||(pa={}));const ma="2026.11.04.42",ua="house-modes-alarm-center-card";let ga=class extends ne{constructor(){super(...arguments),this.error="",this.collapsed=!1,this.message="",this.busyKey="",this.alarmCollapsed=!1,this.fetchedFor="",this.requestedAt=0,this.messageTimer=0}static getConfigElement(){return document.createElement(`${ua}-editor`)}static getStubConfig(e){const t=Object.keys(e.states).find(t=>t.startsWith("alarm_control_panel.")&&void 0!==e.states[t].attributes.arm_mode);return{entity:t}}setConfig(e){if(!e)throw new Error("Invalid configuration");if(e.entity&&!e.entity.startsWith("alarm_control_panel."))throw new Error("entity must be an Alarmo alarm_control_panel");const t=!this.config;this.config=Object.assign(Object.assign({},_e),e),t&&(this.collapsed=!(!this.config.collapsible||!this.config.start_collapsed),this.alarmCollapsed=!(!this.config.alarm_collapsible||!this.config.alarm_start_collapsed))}getCardSize(){var e,t,a,s;if(this.collapsed)return 2;let i=0;return(null===(e=this.config)||void 0===e?void 0:e.show_header)&&(i+=2),(null===(t=this.config)||void 0===t?void 0:t.show_house_modes)&&(i+=2),(null===(a=this.config)||void 0===a?void 0:a.show_alarm)&&(i+=4),(null===(s=this.config)||void 0===s?void 0:s.show_panel_keypad)&&(i+=4),i||2}updated(e){if(!e.has("hass")||!this.hass)return;const t=this.hass.states["select.alarmo_house_mode"],a=this.data?this.hass.states[this.data.house.select_entity]:void 0,s=`${null==t?void 0:t.last_updated}|${null==a?void 0:a.last_updated}`;s!==this.fetchedFor&&(this.fetchedFor=s,this.fetch())}async fetch(){try{this.data=await this.hass.callWS({type:"alarmo/ext/card/get"}),this.error="";const e=this.data.house.last_result;if(this.requestedAt&&(null==e?void 0:e.at)&&Date.parse(e.at)>=this.requestedAt-2e3){this.requestedAt=0;const t=((e,t)=>{if(!e)return null;const a=e.requested||"House Mode";switch(e.result){case"blocked":return`${a} not set: ${e.reason||"not allowed now"}`;case"not_ready":return`${a} not set: open ${(e.open||[]).map(t).join(", ")||"zones"}`;case"delayed":return`${a} in ${e.minutes} min`;case"failed":return`${a} failed: ${(e.failed||[]).join(", ")} did not arm`;case"error":return`${a}: ${e.reason||"error"}`;case"shadow":return e.would&&"changed"!==e.would?`Shadow: ${a} would be ${e.would.replace("_"," ")}`:null;default:return null}})(e,e=>this.name(e));t&&this.flash(t)}}catch(e){this.error="House Modes & Alarm Center is not installed or not up to date: "+((null==e?void 0:e.message)||e)}}name(e){var t,a,s;return(null===(s=null===(a=null===(t=this.hass)||void 0===t?void 0:t.states[e])||void 0===a?void 0:a.attributes)||void 0===s?void 0:s.friendly_name)||e}flash(e){this.message=e,window.clearTimeout(this.messageTimer),this.messageTimer=window.setTimeout(()=>this.message="",8e3)}get alarmEntity(){var e,t,a,s;return(null===(e=this.config)||void 0===e?void 0:e.entity)||(null===(t=xe(this.data,void 0))||void 0===t?void 0:t.alarm_entity)||(null===(s=null===(a=this.data)||void 0===a?void 0:a.alarms[0])||void 0===s?void 0:s.entity_id)}async chooseMode(e){const t=this.data.house.select_entity,a=t.split(".")[0];this.requestedAt=Date.now();try{await this.hass.callService(a,"select_option",{entity_id:t,option:e})}catch(e){this.requestedAt=0,this.flash((null==e?void 0:e.message)||String(e))}}async press(e){const t=xe(this.data,this.alarmEntity);if(t){this.busyKey=e;try{await this.hass.callService("alarmo","panel_keypress",{keys:e,entity_id:t.panel_entity})}catch(e){this.flash((null==e?void 0:e.message)||String(e))}finally{this.busyKey=""}}}toggle(){var e;(null===(e=this.config)||void 0===e?void 0:e.collapsible)&&(this.collapsed=!this.collapsed)}moreInfo(e){e&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}render(){var e,t,a;if(!this.config||!this.hass)return V;if(this.error)return q`<ha-card><div class="warn">${this.error}</div></ha-card>`;if(!this.data)return q`<ha-card><div class="loading">…</div></ha-card>`;const s=this.config,i=this.data.house,o=i.modes.find(e=>e.id===i.current),r=this.alarmEntity,n=xe(this.data,r),l=r?null===(e=this.hass.states[r])||void 0===e?void 0:e.state:void 0,c=((e,t,a,s)=>"triggered"===e||"triggered"===t?"#f44336":"arming"===e||"pending"===e||"arming"===t||"pending"===t?"#ff9800":e&&Ae.includes(e)||t&&Ae.includes(t)?s||"#f44336":"on"===a?"#4caf50":"off"===a?"#ff9800":"var(--divider-color)")(l,n?null===(t=this.hass.states[n.panel_entity])||void 0===t?void 0:t.state:void 0,(null==n?void 0:n.ready_entity)?null===(a=this.hass.states[n.ready_entity])||void 0===a?void 0:a.state:void 0,null==o?void 0:o.color);return q`
      <ha-card style=${`--hmac-border:${c};${fe(s.styles)}`}>
        ${s.show_header||this.collapsed?this.renderHeader(o,l,n):V}
        ${this.message?q`<div class="message" role="status">${this.message}</div>`:V}
        ${this.collapsed?V:q`
              ${s.show_house_modes&&i.enabled?this.renderModes():V}
              ${s.show_alarm&&r?this.renderAlarm(r,l):V}
              ${s.show_panel_keypad&&"envisalink"===(null==n?void 0:n.panel_type)?this.renderKeypad(n):V}
            `}
      </ha-card>
    `}alarmConfig(e){const t=this.config,a=t.alarm||{};let s=a.states||{};if(t.alarm_colors_from_modes){const t=we(this.data,e);s=ve([...new Set([...Object.keys(t),...Object.keys(s)])].map(e=>[e,Object.assign({color:t[e]},s[e]||{})]))}return Object.assign(Object.assign(Object.assign(Object.assign({type:"hmac-alarm"},a),{states:s,entity:e}),t.name?{name:t.name}:{}),{show_name:t.show_alarm_name,show_state:t.show_alarm_state,show_arm_options:t.show_arm_options})}renderAlarm(e,t){var a,s;const i=this.config,o=this.hass.states[e],r=i.name||(null===(a=null==o?void 0:o.attributes)||void 0===a?void 0:a.friendly_name)||e,n=t?this.hass.localize(`component.alarm_control_panel.entity_component._.state.${t}`)||t.replace(/_/g," "):"",l=we(this.data,e)[("arming"===t||"pending"===t?null===(s=null==o?void 0:o.attributes)||void 0===s?void 0:s.arm_mode:t)||""];return q`
      ${i.alarm_collapsible?q`<button class="alarm-bar" aria-expanded=${String(!this.alarmCollapsed)} @click=${()=>this.alarmCollapsed=!this.alarmCollapsed}>
            <ha-icon icon=${"disarmed"===t?"mdi:lock-open-variant":"triggered"===t?"mdi:bell-ring":"mdi:lock"}
              style=${l?`color:${l}`:""}></ha-icon>
            <span class="alarm-bar-text">${r} · ${n}</span>
            ${i.show_chevron?q`<ha-icon class="bar-chev" icon=${this.alarmCollapsed?"mdi:chevron-down":"mdi:chevron-up"}></ha-icon>`:V}
          </button>`:V}
      ${i.alarm_collapsible&&this.alarmCollapsed?V:q`<hmac-alarm embedded .hass=${this.hass} .cardConfig=${this.alarmConfig(e)}></hmac-alarm>`}
    `}renderHeader(e,t,a){var s,i;const o=this.data.house,r=(null==a?void 0:a.keypad_entity)?this.hass.states[a.keypad_entity]:void 0,[n,l]=$e(null!==(i=null===(s=null==r?void 0:r.attributes)||void 0===s?void 0:s.alpha)&&void 0!==i?i:null==r?void 0:r.state),c=o.enabled?e?e.name:"unknown":this.config.name||(t?t.replace(/_/g," "):"");return q`
      <div class="head ${this.config.collapsible?"clickable":""} ${this.config.collapsible&&this.config.show_chevron?"chevron":""}" @click=${this.toggle}
        @contextmenu=${e=>{e.preventDefault(),this.moreInfo((null==a?void 0:a.keypad_entity)||this.alarmEntity)}}
        role=${this.config.collapsible?"button":V} aria-expanded=${this.config.collapsible?String(!this.collapsed):V}>
        <ha-icon class="mode-icon" icon=${(null==e?void 0:e.icon)||"mdi:shield-home"} style=${`--mode-color:${(null==e?void 0:e.color)||"var(--secondary-text-color)"}`}></ha-icon>
        <div class="head-text">
          ${this.config.show_mode_name?q`<div class="mode-name">${c}</div>`:V}
          ${r&&(this.config.show_line1||this.config.show_line2)?q`<div class="lcd" aria-label="Panel display">
                ${this.config.show_line1?q`<div class="line1">${n||" "}</div>`:V}
                ${this.config.show_line2?q`<div class="line2">${l||" "}</div>`:V}
              </div>`:V}
        </div>
        ${o.shadow?q`<span class="tag" title="House Modes run in Shadow: your automations are in charge">shadow</span>`:V}
        ${this.config.collapsible&&this.config.show_chevron?q`<ha-icon class="chev" icon=${this.collapsed?"mdi:chevron-down":"mdi:chevron-up"}></ha-icon>`:V}
      </div>
    `}renderModes(){const e=this.data.house,t=(a=this.data,s=this.config.hidden_modes,a.house.modes.filter(e=>!(s||[]).includes(e.id)&&!(s||[]).includes(e.name)));var a,s;return q`
      <div class="modes ${"center"===this.config.modes_align?"center":""}"
        style=${`--cols:${Math.max(1,Math.min(9,this.config.columns||5))}`}>
        ${t.map(t=>{const a=t.id===e.current;return q`<button class="mode ${a?"on":""}" aria-pressed=${a?"true":"false"} title=${t.name}
              @click=${()=>this.chooseMode(t.name)}>
              <ha-icon icon=${t.icon} style=${`--mode-color:${t.color}`}></ha-icon>
              ${this.config.show_mode_labels?q`<span>${t.name}</span>`:V}
            </button>`})}
      </div>
    `}renderKeypad(e){const t=this.data.keypad,a=t.blocked_keys||"";return q`
      <div class="keypad-wrap">
        ${!this.config.show_header&&e.keypad_entity?(()=>{var t,a;const s=this.hass.states[e.keypad_entity],[i,o]=$e(null!==(a=null===(t=null==s?void 0:s.attributes)||void 0===t?void 0:t.alpha)&&void 0!==a?a:null==s?void 0:s.state);return q`<div class="lcd big"><div>${i||" "}</div><div>${o||" "}</div></div>`})():V}
        ${t.allowed?V:q`<div class="note">Panel keypad: ${t.reason}</div>`}
        <div class="keys">
          ${(s=this.config.keypad_labels,ke.map(([e,t])=>[e,s&&e in s?s[e]:t])).map(([e,s])=>q`
            <button class="key" ?disabled=${!t.allowed||a.includes(e)||this.busyKey===e}
              aria-label=${s?`${e} ${s}`:e} @click=${()=>this.press(e)}>
              <span class="k">${e}</span>${s?q`<span class="l">${s}</span>`:V}
            </button>`)}
        </div>
      </div>
    `;var s}};ga.styles=r`
    ha-card {
      overflow: hidden;
      border: var(--hmac-border-width, 2px) solid var(--hmac-border, var(--divider-color));
      border-radius: var(--hmac-radius, var(--ha-card-border-radius, 12px));
    }
    /* icon + text centred together, as in a button-card header: 48 px icon, 12 px gap, the pair nudged 10 px left
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
      color: var(--hmac-header-icon-color, var(--mode-color));
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
    /* top-right corner, so it never pushes the centred text */
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
    /* 'center': same button width, every row (the last one too) centred across the card */
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
      background: none;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      color: var(--secondary-text-color);
      font: inherit;
    }
    .mode ha-icon {
      --mdc-icon-size: var(--hmac-mode-icon-size, 36px);
      color: var(--hmac-mode-icon-color, var(--secondary-text-color));
    }
    .mode.on ha-icon {
      color: var(--hmac-mode-icon-active-color, var(--mode-color));
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
      background: rgba(127, 127, 127, 0.12);
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
    .alarm-bar {
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
    .alarm-bar-text {
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
  `,e([pe({attribute:!1})],ga.prototype,"hass",void 0),e([me()],ga.prototype,"config",void 0),e([me()],ga.prototype,"data",void 0),e([me()],ga.prototype,"error",void 0),e([me()],ga.prototype,"collapsed",void 0),e([me()],ga.prototype,"message",void 0),e([me()],ga.prototype,"busyKey",void 0),e([me()],ga.prototype,"alarmCollapsed",void 0),ga=e([ce(ua)],ga),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===ua)||window.customCards.push({type:ua,name:"House Modes & Alarm Center Card",description:"House Mode, Alarmo alarm and physical panel keypad in one card.",preview:!0}),console.info(`%c HOUSE MODES & ALARM CENTER CARD %c ${ma} `,"background:#03a9f4;color:#fff","background:#333;color:#fff");export{ma as CARD_VERSION,ga as HouseModesAlarmCenterCard};
