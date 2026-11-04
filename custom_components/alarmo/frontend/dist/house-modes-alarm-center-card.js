function e(e,t,s,i){var a,o=arguments.length,r=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,s,i);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(r=(o<3?a(r):o>3?a(t,s,r):a(t,s))||r);return o>3&&r&&Object.defineProperty(t,s,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,s=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),a=new WeakMap;let o=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const s=void 0!==t&&1===t.length;s&&(e=a.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&a.set(t,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const s=1===e.length?e[0]:t.reduce((t,s,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1],e[0]);return new o(s,e,i)},n=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:d,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,m=globalThis,_=m.trustedTypes,g=_?_.emptyScript:"",b=m.reactiveElementPolyfillSupport,v=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},f=(e,t)=>!d(e,t),w={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:f};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let k=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=w){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);void 0!==i&&l(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:a}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const o=i?.call(this);a?.call(this,t),this.requestUpdate(e,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??w}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(n(e))}else void 0!==e&&t.push(n(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,i)=>{if(s)e.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const s of i){const i=document.createElement("style"),a=t.litNonce;void 0!==a&&i.setAttribute("nonce",a),i.textContent=s.cssText,e.appendChild(i)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(void 0!==i&&!0===s.reflect){const a=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(t,s.type);this._$Em=e,null==a?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(e,t){const s=this.constructor,i=s._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=s.getPropertyOptions(i),a="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=i;const o=a.fromAttribute(t,e.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(e,t,s,i=!1,a){if(void 0!==e){const o=this.constructor;if(!1===i&&(a=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??f)(a,t)||s.useDefault&&s.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:a},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==a||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,s,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[v("elementProperties")]=new Map,k[v("finalized")]=new Map,b?.({ReactiveElement:k}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x=globalThis,$=e=>e,A=x.trustedTypes,C=A?A.createPolicy("lit-html",{createHTML:e=>e}):void 0,S="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+E,O=`<${z}>`,M=document,T=()=>M.createComment(""),j=e=>null===e||"object"!=typeof e&&"function"!=typeof e,P=Array.isArray,R="[ \t\n\f\r]",D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,H=/>/g,L=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),U=/'/g,I=/"/g,B=/^(?:script|style|textarea|title)$/i,q=(e=>(t,...s)=>({_$litType$:e,strings:t,values:s}))(1),F=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),W=new WeakMap,Z=M.createTreeWalker(M,129);function G(e,t){if(!P(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(t):t}const K=(e,t)=>{const s=e.length-1,i=[];let a,o=2===t?"<svg>":3===t?"<math>":"",r=D;for(let t=0;t<s;t++){const s=e[t];let n,d,l=-1,c=0;for(;c<s.length&&(r.lastIndex=c,d=r.exec(s),null!==d);)c=r.lastIndex,r===D?"!--"===d[1]?r=N:void 0!==d[1]?r=H:void 0!==d[2]?(B.test(d[2])&&(a=RegExp("</"+d[2],"g")),r=L):void 0!==d[3]&&(r=L):r===L?">"===d[0]?(r=a??D,l=-1):void 0===d[1]?l=-2:(l=r.lastIndex-d[2].length,n=d[1],r=void 0===d[3]?L:'"'===d[3]?I:U):r===I||r===U?r=L:r===N||r===H?r=D:(r=L,a=void 0);const h=r===L&&e[t+1].startsWith("/>")?" ":"";o+=r===D?s+O:l>=0?(i.push(n),s.slice(0,l)+S+s.slice(l)+E+h):s+E+(-2===l?t:h)}return[G(e,o+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class Y{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let a=0,o=0;const r=e.length-1,n=this.parts,[d,l]=K(e,t);if(this.el=Y.createElement(d,s),Z.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=Z.nextNode())&&n.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(S)){const t=l[o++],s=i.getAttribute(e).split(E),r=/([.?@])?(.*)/.exec(t);n.push({type:1,index:a,name:r[2],strings:s,ctor:"."===r[1]?te:"?"===r[1]?se:"@"===r[1]?ie:ee}),i.removeAttribute(e)}else e.startsWith(E)&&(n.push({type:6,index:a}),i.removeAttribute(e));if(B.test(i.tagName)){const e=i.textContent.split(E),t=e.length-1;if(t>0){i.textContent=A?A.emptyScript:"";for(let s=0;s<t;s++)i.append(e[s],T()),Z.nextNode(),n.push({type:2,index:++a});i.append(e[t],T())}}}else if(8===i.nodeType)if(i.data===z)n.push({type:2,index:a});else{let e=-1;for(;-1!==(e=i.data.indexOf(E,e+1));)n.push({type:7,index:a}),e+=E.length-1}a++}}static createElement(e,t){const s=M.createElement("template");return s.innerHTML=e,s}}function J(e,t,s=e,i){if(t===F)return t;let a=void 0!==i?s._$Co?.[i]:s._$Cl;const o=j(t)?void 0:t._$litDirective$;return a?.constructor!==o&&(a?._$AO?.(!1),void 0===o?a=void 0:(a=new o(e),a._$AT(e,s,i)),void 0!==i?(s._$Co??=[])[i]=a:s._$Cl=a),void 0!==a&&(t=J(e,a._$AS(e,t.values),a,i)),t}class X{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??M).importNode(t,!0);Z.currentNode=i;let a=Z.nextNode(),o=0,r=0,n=s[0];for(;void 0!==n;){if(o===n.index){let t;2===n.type?t=new Q(a,a.nextSibling,this,e):1===n.type?t=new n.ctor(a,n.name,n.strings,this,e):6===n.type&&(t=new ae(a,this,e)),this._$AV.push(t),n=s[++r]}o!==n?.index&&(a=Z.nextNode(),o++)}return Z.currentNode=M,i}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=J(this,e,t),j(e)?e===V||null==e||""===e?(this._$AH!==V&&this._$AR(),this._$AH=V):e!==this._$AH&&e!==F&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>P(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==V&&j(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,i="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=Y.createElement(G(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new X(i,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=W.get(e.strings);return void 0===t&&W.set(e.strings,t=new Y(e)),t}k(e){P(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const a of e)i===t.length?t.push(s=new Q(this.O(T()),this.O(T()),this,this.options)):s=t[i],s._$AI(a),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=$(e).nextSibling;$(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,a){this.type=1,this._$AH=V,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=a,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=V}_$AI(e,t=this,s,i){const a=this.strings;let o=!1;if(void 0===a)e=J(this,e,t,0),o=!j(e)||e!==this._$AH&&e!==F,o&&(this._$AH=e);else{const i=e;let r,n;for(e=a[0],r=0;r<a.length-1;r++)n=J(this,i[s+r],t,r),n===F&&(n=this._$AH[r]),o||=!j(n)||n!==this._$AH[r],n===V?e=V:e!==V&&(e+=(n??"")+a[r+1]),this._$AH[r]=n}o&&!i&&this.j(e)}j(e){e===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===V?void 0:e}}class se extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==V)}}class ie extends ee{constructor(e,t,s,i,a){super(e,t,s,i,a),this.type=5}_$AI(e,t=this){if((e=J(this,e,t,0)??V)===F)return;const s=this._$AH,i=e===V&&s!==V||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,a=e!==V&&(s===V||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ae{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){J(this,e)}}const oe=x.litHtmlPolyfillSupport;oe?.(Y,Q),(x.litHtmlVersions??=[]).push("3.3.3");const re=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ne extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const i=s?.renderBefore??t;let a=i._$litPart$;if(void 0===a){const e=s?.renderBefore??null;i._$litPart$=a=new Q(t.insertBefore(T(),e),e,void 0,s??{})}return a._$AI(e),a})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}}ne._$litElement$=!0,ne.finalized=!0,re.litElementHydrateSupport?.({LitElement:ne});const de=re.litElementPolyfillSupport;de?.({LitElement:ne}),(re.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const le=e=>(t,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},ce={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:f},he=(e=ce,t,s)=>{const{kind:i,metadata:a}=s;let o=globalThis.litPropertyMetadata.get(a);if(void 0===o&&globalThis.litPropertyMetadata.set(a,o=new Map),"setter"===i&&((e=Object.create(e)).wrapped=!0),o.set(s.name,e),"accessor"===i){const{name:i}=s;return{set(s){const a=t.get.call(this);t.set.call(this,s),this.requestUpdate(i,a,e,!0,s)},init(t){return void 0!==t&&this.C(i,void 0,e,t),t}}}if("setter"===i){const{name:i}=s;return function(s){const a=this[i];t.call(this,s),this.requestUpdate(i,a,e,!0,s)}}throw Error("Unsupported decorator location: "+i)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function pe(e){return(t,s)=>"object"==typeof s?he(e,t,s):((e,t,s)=>{const i=t.hasOwnProperty(s);return t.constructor.createProperty(s,e),i?Object.getOwnPropertyDescriptor(t,s):void 0})(e,t,s)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ue(e){return pe({...e,state:!0,attribute:!1})}const me={show_header:!0,show_house_modes:!0,show_alarm:!0,show_panel_keypad:!1,collapsible:!1,start_collapsed:!0,columns:5},_e=[["1","OFF"],["2","AWAY"],["3","STAY"],["4","MAX"],["5","TEST"],["6","BYPASS"],["7","INSTANT"],["8","CODE"],["9","CHIME"],["*","READY"],["0",""],["#",""]],ge=e=>{const t=String(e||"");return[t.slice(0,16).trim(),t.slice(16,32).trim()]},be=(e,t)=>e.links.find(e=>e.alarm_entity===t)||e.links[0],ve=["armed_away","armed_home","armed_night","armed_vacation","armed_custom_bypass"],ye="number";var fe;!function(e){e.Disarmed="disarmed",e.Arming="arming",e.Pending="pending",e.Triggered="triggered",e.ArmedAway="armed_away",e.ArmedHome="armed_home",e.ArmedNight="armed_night",e.ArmedVacation="armed_vacation",e.ArmedCustomBypass="armed_custom_bypass"}(fe||(fe={}));const we={[fe.ArmedAway]:"hass:shield-lock",[fe.ArmedHome]:"hass:shield-home",[fe.ArmedNight]:"hass:shield-moon",[fe.ArmedVacation]:"hass:shield-airplane",[fe.ArmedCustomBypass]:"hass:security",[fe.Disarmed]:"hass:shield-off",[fe.Arming]:"hass:shield-outline",[fe.Pending]:"hass:shield-outline",[fe.Triggered]:"hass:bell-ring"};var ke;!function(e){e.ArmAway="arm_away",e.ArmHome="arm_home",e.ArmNight="arm_night",e.ArmVacation="arm_vacation",e.ArmCustomBypass="arm_custom_bypass",e.Disarm="disarm"}(ke||(ke={}));const xe={[ke.ArmAway]:"mdi:lock",[ke.ArmHome]:"mdi:home",[ke.ArmNight]:"mdi:moon-waning-crescent",[ke.ArmVacation]:"mdi:airplane",[ke.ArmCustomBypass]:"mdi:shield",[ke.Disarm]:"mdi:shield-off"},$e={[ke.ArmAway]:fe.ArmedAway,[ke.ArmHome]:fe.ArmedHome,[ke.ArmNight]:fe.ArmedNight,[ke.ArmVacation]:fe.ArmedVacation,[ke.ArmCustomBypass]:fe.ArmedCustomBypass,[ke.Disarm]:fe.Disarmed};var Ae;!function(e){e.Disarm="disarm",e.Arm="arm",e.Trigger="trigger",e.FailedToArm="failed_to_arm",e.CommandNotAllowed="command_not_allowed",e.NoCodeProvided="no_code_provided",e.InvalidCodeProvided="invalid_code_provided",e.TriggerTimeExpired="trigger_time_expired",e.ReadyToArmModesChanged="ready_to_arm_modes_changed"}(Ae||(Ae={}));const Ce="alarmo_updated",Se=["arming","pending"],Ee={type:"",entity:"",name:"",keep_keypad_visible:!1,button_scale_actions:1,button_scale_keypad:1,states:{},show_messages:!0,show_ready_indicator:!0,show_bypassed_sensors:!0,use_code_dialog:!1,hide_keypad:!1},ze={skip_delay:!1,force:!1};var Oe;!function(e){e.Red="red",e.Pink="pink",e.Purple="purple",e.DeepPurple="deep-purple",e.Indigo="indigo",e.Blue="blue",e.LightBlue="light-blue",e.Cyan="cyan",e.Teal="teal",e.Green="green",e.LightGreen="light-green",e.Lime="lime",e.Yellow="yellow",e.Amber="amber",e.Orange="orange",e.DeepOrange="deep-orange",e.Brown="brown",e.LightGrey="light-grey",e.Grey="grey",e.DarkGrey="dark-grey",e.BlueGrey="blue-grey",e.Black="black",e.White="white"}(Oe||(Oe={}));const Me=(e,t,s,i)=>{i=i||{},s=null==s?{}:s;const a=new Event(t,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});return a.detail=s,e.dispatchEvent(a),a};class Te extends ne{constructor(){super(...arguments),this.duration=0,this.datetime=null,this.timer=0,this._touchStarted=!1,this._hover=!1}shouldUpdate(e){if(!e.size)return!0;const t=e.get("hass");if(!t||t.themes!==this.hass.themes||t.language!==this.hass.language)return!0;if(t.states[this.entity].state!==this.hass.states[this.entity].state||t.states[this.entity].attributes.delay!==this.hass.states[this.entity].attributes.delay){const e=t.states[this.entity].state,s=this.hass.states[this.entity].state;return Se.includes(s)?this.startTimer():Se.includes(e)&&this.stopTimer(),!0}return!1}firstUpdated(){const e=this.hass.states[this.entity].state;Se.includes(e)&&this.startTimer(),this.addEventListener("click",this.handleClick),this.addEventListener("touchstart",()=>{this._touchStarted=!0}),this.addEventListener("touchend",()=>{setTimeout(()=>{this._touchStarted=!1},10)}),this.addEventListener("mouseenter",()=>{this._touchStarted||(this._hover=!0)}),this.addEventListener("mouseleave",()=>{this._hover=!1})}async startTimer(){var e,t;clearInterval(this.timer),(e=this.hass,t=this.entity,e.callWS({type:"alarmo/countdown",entity_id:t})).then(e=>{this.duration=e.delay,this.datetime=new Date((new Date).getTime()+1e3*e.remaining)}).catch(e=>{}),this.timer=window.setInterval(()=>{this.requestUpdate()},1e3)}stopTimer(){clearInterval(this.timer),this.datetime=null,this.duration=0}getRemaining(){if(!this.datetime)return 0;const e=(this.datetime.getTime()-(new Date).getTime())/1e3;return e<0?(clearInterval(this.timer),0):e}getFraction(){return this.duration?(Math.round(this.getRemaining())-1)/this.duration:1}_stateValue(e){return this._hover&&Se.includes(e)&&this.timer?q` <ha-icon icon="mdi:skip-forward"></ha-icon> `:this.datetime&&this.duration?q` ${Math.max(Math.round(this.getRemaining()),0)} `:q` <ha-icon .icon=${we[e]}></ha-icon> `}handleClick(){const e=this.hass.states[this.entity].state;Se.includes(e)&&this.timer?this.hass.callService("alarmo","skip_delay",{entity_id:this.entity}):Me(this,"hass-more-info",{entityId:this.entity})}render(){let e=45,t=2*Math.PI*e;const s=this.hass.states[this.entity],i=this.datetime&&this.duration;return q`
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="track ${s.state.split("_").shift()} ${i?"timer":""}">
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
      <div class="overlay ${s.state.split("_").shift()} ${i?"timer":""}">
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
    `}}function je(e){return null!=e}function Pe(e){switch(typeof e){case"object":return 0==Object.keys(e).length;case"string":return 0==String(e).length;default:return!je(e)}}function Re(e){return e.substring(0,e.indexOf("."))}e([pe()],Te.prototype,"hass",void 0),e([pe()],Te.prototype,"entity",void 0),e([ue()],Te.prototype,"_hover",void 0),customElements.define("hmac-state-badge",Te);const De=(e,t)=>{let s={hide:!1};return(t.states||{}).hasOwnProperty(e)&&(s=Object.assign(Object.assign({},s),t.states[e])),s},Ne=e=>{if(!e)return[];const t=e.attributes.supported_features||0;let s=[];return 2&t&&s.push(ke.ArmAway),1&t&&s.push(ke.ArmHome),4&t&&s.push(ke.ArmNight),32&t&&s.push(ke.ArmVacation),16&t&&s.push(ke.ArmCustomBypass),s},He=(e,t,s)=>{const i=Re(e.entity_id),a=e.attributes.device_class,o=e.state;if(Object.values(fe).includes(o)&&s){const e=De(o,s);if(!Pe(e.state_label))return e.state_label}let r="";return a&&(r=t(`component.${i}.entity_component.${a}.state.${e.state}`)),r||(r=t(`component.${i}.entity_component._.state.${e.state}`)),r},Le=e=>null!==e.attributes.code_format,Ue=(e,t,s=!1)=>{if(!e||!e.state)return"var(--state-unavailable-color)";let i=e.state;if(s){const s=Object.values(ke).map(e=>$e[e]);if(!s.includes(i)){const t=e.attributes.arm_mode;t&&(i=t)}const a=[ke.Disarm,...Ne(e)].filter(e=>!De($e[e],t).hide);1==a.length&&(i=$e[a[0]])}if(Object.keys(t.states||{}).includes(i)&&je((t.states[i]||{}).color)){const e=t.states[i].color;return Object.values(Oe).includes(e)?`var(--${e}-color)`:e}return i==fe.Disarmed?"var(--state-alarm_control_panel-disarmed-color, var(--state-alarm_control_panel-inactive-color, var(--state-inactive-color)))":Object.values(fe).includes(i)?`var(--state-alarm_control_panel-${i}-color, var(--state-alarm_control_panel-active-color, var(--state-active-color)))`:"var(--disabled-color, var(--state-inactive-color))"};var Ie,Be;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(Ie||(Ie={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(Be||(Be={}));class qe extends ne{shouldUpdate(e){const t=e.get("hass");return!t||!(!this.entity||t.states[this.entity]===this.hass.states[this.entity])}render(){if(!this.hass||!this.entity)return q``;const e=this.entity in this.hass.states;let t=Object.assign({},this.hass.states[this.entity]);void 0!==this.state&&(t=Object.assign(Object.assign({},t),{state:this.state}));const s=e?He(t,this.hass.localize):this.hass.localize("state.default.unavailable",this.hass.locale||{language:this.hass.language,number_format:Ie.language}),i=e?t.attributes.friendly_name||(a=t.entity_id).substring(a.indexOf(".")+1):this.entity;var a;let o=!!this.state||"on"==t.state;return q`
      <div class="badge-container" @click=${()=>Me(this,"hass-more-info",{entityId:this.entity})}>
        <div class="label-badge ${o?"active":""}" id="badge">
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
        <div class="title">${i}</div>
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
    `}}e([pe()],qe.prototype,"hass",void 0),e([pe()],qe.prototype,"entity",void 0),e([pe()],qe.prototype,"state",void 0),customElements.define("hmac-sensor-badge",qe);class Fe extends ne{constructor(){super(...arguments),this.disabled=!1,this.scaled=!1}render(){return q`
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
    `}}e([pe({type:Boolean})],Fe.prototype,"disabled",void 0),e([pe({type:Boolean})],Fe.prototype,"scaled",void 0),customElements.define("hmac-button",Fe);const Ve=t=>{class s extends t{connectedCallback(){super.connectedCallback(),this.__checkSubscribed()}disconnectedCallback(){if(super.disconnectedCallback(),this.__unsubs){for(;this.__unsubs.length;){const e=this.__unsubs.pop();e instanceof Promise?e.then(e=>e()):e()}this.__unsubs=void 0}}updated(e){super.updated(e),e.has("hass")&&this.__checkSubscribed()}hassSubscribe(){return[]}__checkSubscribed(){void 0===this.__unsubs&&this.isConnected&&void 0!==this.hass&&(this.__unsubs=this.hassSubscribe())}}return e([pe({attribute:!1})],s.prototype,"hass",void 0),s};var We={heading:"Možnosti aktivace",skip_delay:"Přeskočit čas pro vystup",force:"Bypass otevřených senzorů"},Ze={keep_keypad_visible:"Zachovat klávesnici vždy viditelnou, i když není vyžadován žádný kód.",button_scale_actions:"Měřítko použité pro změnu velikosti tlačítek akcí.",button_scale_keypad:"Měřítko použité pro změnu velikosti tlačítek klávesnice.",show_messages:"Zobrazit diagnostické zprávy při spuštění alarmu nebo nemožnosti aktivace.",show_ready_indicator:"Zobrazit indikátor připraveno/nepřipraveno na tlačítkách režimu aktivace.",show_bypassed_sensors:"Zobrazit varování při aktivaci alarmu s přemostěnými senzory.",use_code_dialog:"Zobrazte klávesnici pro zadání kódu jako vyskakovací dialog.",hide_keypad:"Skrýt tlačítka klávesnice pro zadávání kódu.",available_actions:"Dostupné akce:",action_dialog:{title:"Upravit zobrazení akce '{action}'",show_button:{title:"Viditelnost akčního tlačítka",options:{always:"Vždy zobrazeno",never:"Nikdy zobrazeno",disarmed:"Zobrazit pouze při odzbrojení",armed:"Zobrazit pouze při zapnutí"}},button_label:"Přepsat popisek tlačítka",button_icon:"Ikona zobrazeného tlačítka",state_label:"Přepsat popisek stavu",color:"Přepsat barvu použitou pro akci"}},Ge={invalid_pin:"Neplatný",blocking_sensors:"Nelze aktivovat kvůli následujícím senzorům",triggered_sensors:"Alarm byl spuštěn následujícími senzory",bypassed_sensors:"Jsou tam přemostěné senzory"},Ke={arm_options:We,editor:Ze,errors:Ge},Ye={heading:"Scharfschaltungsoptionen",skip_delay:"Ausgangsverzögerung überspringen",force:"Offene Sensoren ignorieren"},Je={keep_keypad_visible:"Zeige das Pin-Eingabefeld immer an, auch wenn kein Code erfordert ist.",button_scale_actions:"Skalierungsfaktor für Buttongröße der Aktionen.",button_scale_keypad:"Skalierungsfaktor für Buttongröße der Pin-Eingabefeld.",show_messages:"Anzeige von Diagnosemeldungen, wenn der Alarm ausgelöst wird oder nicht scharf geschaltet werden kann.",show_ready_indicator:"Zeigt die Bereitschafts-/Nicht-Bereitschaftsanzeige auf den Scharfschaltmodus-Tasten an.",show_bypassed_sensors:"Warnung anzeigen, wenn der Alarm mit umgangenen Sensoren aktiviert wird.",use_code_dialog:"Zeigen Sie die Tastatur zur Codeeingabe als Popup-Dialog an.",hide_keypad:"Blenden Sie die Tasten der Tastatur zur Codeeingabe aus.",available_actions:"Verfügbare Aktionen:",action_dialog:{title:"Anzeige der Aktion '{action}' anpassen",show_button:{title:"Sichtbarkeit der Aktionsschaltfläche",options:{always:"Immer angezeigt",never:"Nie angezeigt",disarmed:"Nur im deaktivierten Zustand anzeigen",armed:"Nur im aktivierten Zustand anzeigen"}},button_label:"Überschreibung der Tastenbeschriftung",button_icon:"Angezeigtes Schaltflächensymbol",state_label:"Überschreibung der Statusbezeichnung",color:"Die für die Aktion verwendete Farbe überschreiben"}},Xe={invalid_pin:"Ungültig",blocking_sensors:"Konnte nicht scharf geschaltet werden, da folgende Sensoren geöffnet sind",triggered_sensors:"Alarm wurde durch folgende Sensoren ausgelöst",bypassed_sensors:"Es gibt umgangene Sensoren"},Qe={arm_options:Ye,editor:Je,errors:Xe},et={heading:"Επιλογές για όπλισμα",skip_delay:"Παράλειψη καθυστέρησης εξόδου",force:"Παράκαμψη ανοιχτών αισθητήρων"},tt={keep_keypad_visible:"Κράτησε το πληκτρολόγιο πάντα ορατό, ακόμη και όταν δεν απαιτείται εισαγωγή κωδικού.",button_scale_actions:"Συντελεστής κλίμακας για αλλαγή μεγέθους των κουμπιών ενεργειών.",button_scale_keypad:"Συντελεστής κλίμακας για αλλαγή μεγέθους των κουμπιών του πληκτρολογίου.",show_messages:"Εμφάνιση διαγνωστικών μηνυμάτων όταν ενεργοποιείται ο συναγερμός ή δεν μπορεί να οπλιστεί.",show_ready_indicator:"Εμφάνιση ένδειξης έτοιμο/μη έτοιμο στα κουμπιά λειτουργίας όπλισης.",show_bypassed_sensors:"Εμφάνιση προειδοποιητικού μηνύματος όταν ο συναγερμός οπλίζεται με παρακαμφθέντες αισθητήρες.",use_code_dialog:"Εμφανίστε το πληκτρολόγιο για την εισαγωγή του κωδικού ως αναδυόμενο παράθυρο διαλόγου.",hide_keypad:"Απόκρυψη των κουμπιών του πληκτρολογίου για την εισαγωγή του κωδικού.",available_actions:"Διαθέσιμες ενέργειες:",action_dialog:{title:"Προσαρμογή εμφάνισης της ενέργειας '{action}'",show_button:{title:"Ορατότητα κουμπιού ενέργειας",options:{always:"Εμφανίζεται πάντα",never:"Ποτέ δεν εμφανίζεται",disarmed:"Εμφάνιση μόνο όταν είναι αφοπλισμένο",armed:"Εμφάνιση μόνο όταν είναι οπλισμένο"}},button_icon:"Εμφανιζόμενο εικονίδιο κουμπιού",state_label:"Αντικατάσταση ετικέτας κατάστασης",color:"Παράκαμψη χρώματος που χρησιμοποιείται για την ενέργεια"}},st={invalid_pin:"Ακυρος",blocking_sensors:"Δεν ήταν δυνατή η όπλιση λόγω των ακόλουθων αισθητήρων",triggered_sensors:"Ο συναγερμός ενεργοποιήθηκε από τους ακόλουθους αισθητήρες",bypassed_sensors:"Υπάρχουν παρακαμφθέντες αισθητήρες"},it={arm_options:et,editor:tt,errors:st},at={heading:"Options for arming",skip_delay:"Skip exit delay",force:"Bypass open sensors"},ot={keep_keypad_visible:"Keep the keypad always visible, also when no code input is required.",button_scale_actions:"Scaling factor to apply for resizing the action buttons.",button_scale_keypad:"Scaling factor to apply for resizing the keypad buttons.",show_messages:"Display diagnostic messages when alarm is triggered or cannot be armed.",show_ready_indicator:"Show ready/not ready indicator on arm mode buttons.",show_bypassed_sensors:"Show warning message when alarm is armed with bypassed sensors.",use_code_dialog:"Display the keypad for entering the code as a popup dialog.",hide_keypad:"Hide the keypad buttons for entering the code.",available_actions:"Available actions:",action_dialog:{title:"Customize display of action '{action}'",show_button:{title:"Button visibility",options:{always:"Always shown",never:"Never shown",disarmed:"Show only when disarmed",armed:"Hide only when disarmed"}},button_label:"Override displayed action label",button_icon:"Override displayed icon",state_label:"Override displayed state label",color:"Override color used for the action"}},rt={invalid_pin:"Invalid",blocking_sensors:"Could not arm due to the following sensors",triggered_sensors:"Alarm was triggered by the following sensors",bypassed_sensors:"There are bypassed sensors"},nt={arm_options:at,editor:ot,errors:rt},dt={heading:"Opciones de armado",skip_delay:"Omitir el retardo de salida",force:"Pasar por alto los sensores abiertos"},lt={keep_keypad_visible:"Mantener el teclado siempre visible, también cuando no se requiere ninguna entrada de código.",button_scale_actions:"Factor de escalado para cambiar el tamaño de los botones de acción.",button_scale_keypad:"Factor de escalado para cambiar el tamaño de los botones del teclado.",show_messages:"Mostrar mensajes de diagnóstico cuando se activa la alarma o no se puede activar.",show_ready_indicator:"Mostrar indicador listo/no listo en los botones de modo armado.",show_bypassed_sensors:"Mostrar advertencia cuando la alarma está activada con sensores omitidos.",use_code_dialog:"Muestra el teclado para ingresar el código como un cuadro de diálogo emergente.",hide_keypad:"Ocultar los botones del teclado para ingresar el código.",available_actions:"Acciones disponibles:",action_dialog:{title:"Personalizar la visualización de la acción '{action}'",show_button:{title:"Visibilidad del botón de acción",options:{always:"Mostrar siempre",never:"Ocultar siempre",disarmed:"Mostrar solo si desarmada",armed:"Ocultar solo si desarmada"}},button_label:"Sobrescribir el texto del botón",button_icon:"Icono de botón mostrado",state_label:"Sobrescribir el texto de estado",color:"Anular el color utilizado para la acción"}},ct={invalid_pin:"Inválido",blocking_sensors:"No se pudo armar debido a los siguientes sensores",triggered_sensors:"La alarma fue disparada por los siguientes sensores",bypassed_sensors:"Hay sensores omitidos"},ht={arm_options:dt,editor:lt,errors:ct},pt={heading:"Options pour l'armement",skip_delay:"Ignorer le délai de sortie",force:"Bypasser les capteurs ouverts"},ut={keep_keypad_visible:"Gardez le clavier toujours visible, même lorsqu'aucune saisie de code n'est requise.",button_scale_actions:"Facteur d'échelle à appliquer pour le redimensionnement des boutons des actions.",button_scale_keypad:"Facteur d'échelle à appliquer pour le redimensionnement des boutons du clavier.",show_messages:"Afficher les messages de diagnostic lorsque l'alarme est déclenchée ou ne peut pas être armée.",show_ready_indicator:"Afficher l'indicateur prêt/pas prêt sur les boutons de mode d'armement.",show_bypassed_sensors:"Afficher un avertissement lorsque l'alarme est armée avec des capteurs ignorés.",use_code_dialog:"Affichez le clavier pour saisir le code sous forme de boîte de dialogue contextuelle.",hide_keypad:"Masquer les boutons du clavier pour saisir le code.",available_actions:"Actions disponibles:",action_dialog:{title:"Personnaliser l'affichage de l'action '{action}'",show_button:{title:"Visibilité du bouton d'action",options:{always:"Toujours affiché",never:"Jamais affiché",disarmed:"Afficher uniquement si désarmé",armed:"Afficher uniquement si armé"}},button_label:"Remplacer le libellé du bouton",button_icon:"Icône de bouton affichée",state_label:"Remplacer l'étiquette d'état",color:"Remplacer la couleur utilisée pour l'action"}},mt={invalid_pin:"Invalide",blocking_sensors:"Impossible d'armer en raison du(es) capteur(s) suivant(s)",triggered_sensors:"L'alarme a été déclenchée par le(s) capteur(s) suivant(s)",bypassed_sensors:"Il y a des capteurs ignorés"},_t={arm_options:pt,editor:ut,errors:mt},gt={heading:"Opzioni di inserimento",skip_delay:"Ignorare il ritardo di uscita",force:"Ignorare i sensori aperti"},bt={keep_keypad_visible:"Mantenere la tastiera sempre visibile, anche quando nessun codice è richiesto.",button_scale_actions:"Fattore di scala da applicare per ridimensionare i pulsanti di azione.",button_scale_keypad:"Fattore di scala da applicare per ridimensionare i pulsanti della tastiera.",show_messages:"Mostrare messaggi diagnostici quando l'allarme viene attivato o non può essere inserito.",show_ready_indicator:"Mostra l'indicatore pronto/non pronto sui pulsanti della modalità di inserimento.",show_bypassed_sensors:"Mostra avviso quando l'allarme è armato con sensori esclusi.",use_code_dialog:"Visualizza la tastiera per l'immissione del codice come finestra di dialogo popup.",hide_keypad:"Nascondi i pulsanti della tastiera per l'inserimento del codice.",available_actions:"Azioni disponibili:",action_dialog:{title:"Personalizzare la visualizzazione dell'azione '{action}'",show_button:{title:"Visibilità del pulsante di azione",options:{always:"Sempre visualizzato",never:"Mai visualizzato",disarmed:"Mostra solo quando disarmato",armed:"Mostra solo quando disarmato"}},button_label:"Sovrascrivere l'etichetta del pulsante",button_icon:"Icona del pulsante visualizzato",state_label:"Sovrascrivere l'etichetta di stato",color:"Sostituisci il colore utilizzato per l'azione"}},vt={invalid_pin:"Non valido",blocking_sensors:"Impossibile inserire l'allarme a causa dei seguenti sensori",triggered_sensors:"L'allarme è stato attivato dai seguenti sensori",bypassed_sensors:"Sono presenti sensori esclusi"},yt={arm_options:gt,editor:bt,errors:vt},ft={heading:"Opties voor inschakelen",skip_delay:"Sla vertraging over",force:"Negeer open sensoren"},wt={keep_keypad_visible:"Houd het keypad altijd zichtbaar, ook wanneer er geen code vereist is.",button_scale_actions:"Schaalfactor actieknoppen",button_scale_keypad:"Schaalfactor keypadknoppen",show_messages:"Toon diagnostische berichten wanneer het alarm wordt geactiveerd of niet kan worden ingeschakeld.",show_ready_indicator:"Toon gereed/niet gereed-indicator op inschakelmodusknoppen.",show_bypassed_sensors:"Toon melding wanneer het alarm is ingeschakeld met omzeilde sensoren.",use_code_dialog:"Geef het toetsenbord voor het invoeren van de code weer als een pop-upvenster.",hide_keypad:"Verberg het toetsenbord voor het invoeren van de code.",available_actions:"Beschikbare acties:",action_dialog:{title:"Weergave van actie '{action}' aanpassen",show_button:{title:"Actieknop weergave",options:{always:"Altijd zichtbaar",never:"Nooit zichtbaar",disarmed:"Toon alleen bij uitgeschakeld",armed:"Zichtbaar tenzij uitgeschakeld"}},button_label:"Weergegeven naam voor actie",button_icon:"Weergegeven icoon voor actie",state_label:"Weergegeven status",color:"Weergegeven kleur voor action"}},kt={invalid_pin:"Ongeldig",blocking_sensors:"Kon niet inschakelen vanwege de volgende sensoren",triggered_sensors:"Alarm werd geactiveerd door de volgende sensoren",bypassed_sensors:"Er zijn omzeilde sensoren"},xt={arm_options:ft,editor:wt,errors:kt},$t={heading:"Opções para armar",skip_delay:"Omitir tempo para sair",force:"Ignorar os sensores abertos"},At={keep_keypad_visible:"Mantenha o teclado sempre visível, mesmo quando não for necessária nenhuma entrada de código.",button_scale_actions:"Fator de escala para redimensionar botões de ação.",button_scale_keypad:"Fator de escala para redimensionar os botões do teclado.",show_messages:"Mostrar mensagens de diagnóstico quando o alarme estiver disparado ou não puder ser armado.",show_ready_indicator:"Mostrar indicador de disponível/não disponível nos botões do modo de armar.",show_bypassed_sensors:"Mostrar aviso quando o alarme for ativado com sensores ignorados.",use_code_dialog:"Exiba o teclado para inserir o código como uma caixa de diálogo pop-up.",hide_keypad:"Oculte os botões do teclado para inserir o código.",available_actions:"Ações disponíveis:",action_dialog:{title:"Personalize a exibição da ação '{action}'",show_button:{title:"Visibilidade do botão de ação",options:{always:"Sempre visível",never:"Sempre visível",disarmed:"Mostrar somente quando desarmado",armed:"Mostrar somente quando armado"}},button_label:"Substituir texto do botão",button_icon:"Ícone de botão exibido",state_label:"Substituir texto de status",color:"Substituir a cor usada para a ação"}},Ct={invalid_pin:"Inválido",blocking_sensors:"Não foi possível armar devido aos seguintes sensores",triggered_sensors:"O alarme foi disparado pelos seguintes sensores",bypassed_sensors:"Existem sensores ignorados"},St={arm_options:$t,editor:At,errors:Ct},Et={heading:"Варианты постановки на охрану",skip_delay:"Задержка перед выходом",force:"Обход датчиков открытия"},zt={keep_keypad_visible:"Клавиатура всегда видима, даже если ввод кода не требуется.",button_scale_actions:"Коэффициент масштабирования для изменения размера кнопок действий.",button_scale_keypad:"Коэффициент масштабирования для изменения размера кнопок клавиатуры.",show_messages:"Вывод диагностических сообщений, когда срабатывает сигнализация или ее невозможно включить.",show_ready_indicator:"Отображать индикатор готовности/неготовности на кнопках режима охраны.",show_bypassed_sensors:"Вывод предупреждающего сообщения, когда сигнализация включена с помощью обходных датчиков.",use_code_dialog:"Отобразить клавиатуру для ввода кода в виде всплывающего диалогового окна.",hide_keypad:"Скрыть кнопки клавиатуры для ввода кода.",available_actions:"Доступные действия:",action_dialog:{title:"Настройка отображения действия '{action}'",show_button:{title:"Видимость кнопки действия",options:{always:"Показывать всегда",never:"Показывать никогда",disarmed:"Показывать только при снятии с охраны",armed:"Показывать только при поддержании под охраной"}},button_label:"Измененение названия кнопки",button_icon:"Отображаемый значок кнопки",state_label:"Изменение названия состояния",color:"Переопределить цвет, используемый для действия"}},Ot={invalid_pin:"Неверный",blocking_sensors:"Не удалось включить охрану из-за следующих датчиков",triggered_sensors:"Сигнал тревоги был вызван следующими датчиками",bypassed_sensors:"Есть обходные датчики"},Mt={arm_options:Et,editor:zt,errors:Ot},Tt={heading:"Alternativ vid aktivering",skip_delay:"Hoppa över lämna fördröjning",force:"Förbikoppla öppna sensorer"},jt={keep_keypad_visible:"Håll knappsatsen alltid synlig, även när ingen kodinmatning krävs.",button_scale_actions:"Ändra storlek på åtgärdsknapparna.",button_scale_keypad:"Ändra storlek på knapparna på knappsatsen.",show_messages:"Visa diagnostiska meddelanden när larmet utlöses eller inte kan aktiveras.",show_ready_indicator:"Visa redo/ej redo-indikator på lägesknapparna.",show_bypassed_sensors:"Visa varningsmeddelande när larmet är aktiverat med förbikopplade sensorer.",use_code_dialog:"Visa knappsatsen för att ange koden som en popup-dialogruta.",hide_keypad:"Dölj knapparna på tangentbordet för att ange koden.",available_actions:"Tillgängliga åtgärder:",action_dialog:{title:"Anpassa visningen av åtgärden '{action}'",show_button:{title:"Synlighet för åtgärdsknapp",options:{always:"Visas alltid",never:"Visas aldrig",disarmed:"Visa endast vid avaktivering",armed:"Visa endast vid aktivering"}},button_label:"Anpassad knappetikett",button_icon:"Visad knappikon",state_label:"Anpassad tillståndsetikett",color:"Åsidosättningsfärg som används för åtgärden"}},Pt={invalid_pin:"Ogiltig",blocking_sensors:"Kunde inte aktivera på grund av följande sensorer",triggered_sensors:"Larmet utlöstes av följande sensorer",bypassed_sensors:"Det finns förbikopplade sensorer"},Rt={arm_options:Tt,editor:jt,errors:Pt},Dt={heading:"警戒选项",skip_delay:"跳过离开延迟",force:"绕过开放的传感器"},Nt={keep_keypad_visible:"保持小键盘总是可见，即使不需要输入密码",button_scale_actions:"调整动作按键大小的缩放系数",button_scale_keypad:"调整小键盘按键大小的缩放系数",show_messages:"当警报被触发或无法警戒时，显示诊断信息。",show_ready_indicator:"在手臂模式按钮上显示就绪/未就绪指示器。",show_bypassed_sensors:"当警报配备旁路传感器时显示警告消息。",use_code_dialog:"以弹出对话框的形式显示用于输入代码的键盘。",hide_keypad:"隐藏用于输入代码的键盘按钮。",available_actions:"可用动作：",action_dialog:{title:"自定义动作'{action}'的显示",show_button:{title:"操作按钮可见性",options:{always:"始终显示",never:"从不显示",disarmed:"仅在解除武装时显示",armed:"仅在武装时显示"}},button_label:"覆盖按钮标签",button_icon:"显示的按钮图标",state_label:"覆盖状态标签",color:"覆盖操作使用的颜色"}},Ht={invalid_pin:"无效的",blocking_sensors:"由于以下传感器而无法警戒",triggered_sensors:"警报是由以下传感器触发的",bypassed_sensors:"有绕过的传感器"},Lt={arm_options:Dt,editor:Nt,errors:Ht},Ut={cs:Object.freeze({__proto__:null,arm_options:We,default:Ke,editor:Ze,errors:Ge}),de:Object.freeze({__proto__:null,arm_options:Ye,default:Qe,editor:Je,errors:Xe}),el:Object.freeze({__proto__:null,arm_options:et,default:it,editor:tt,errors:st}),en:Object.freeze({__proto__:null,arm_options:at,default:nt,editor:ot,errors:rt}),es:Object.freeze({__proto__:null,arm_options:dt,default:ht,editor:lt,errors:ct}),fr:Object.freeze({__proto__:null,arm_options:pt,default:_t,editor:ut,errors:mt}),it:Object.freeze({__proto__:null,arm_options:gt,default:yt,editor:bt,errors:vt}),nl:Object.freeze({__proto__:null,arm_options:ft,default:xt,editor:wt,errors:kt}),"pt-BR":Object.freeze({__proto__:null,arm_options:$t,default:St,editor:At,errors:Ct}),ru:Object.freeze({__proto__:null,arm_options:Et,default:Mt,editor:zt,errors:Ot}),sv:Object.freeze({__proto__:null,arm_options:Tt,default:Rt,editor:jt,errors:Pt}),"zh-Hans":Object.freeze({__proto__:null,arm_options:Dt,default:Lt,editor:Nt,errors:Ht})};function It(e,t,s="",i=""){const a=t.replace(/['"]+/g,"");var o;try{o=e.split(".").reduce((e,t)=>e[t],Ut[a])}catch(t){o=e.split(".").reduce((e,t)=>e[t],Ut.en)}if(void 0===o&&(o=e.split(".").reduce((e,t)=>e[t],Ut.en)),""!==s&&""!==i){Array.isArray(s)||(s=[s]),Array.isArray(i)||(i=[i]);for(let e=0;e<s.length;e++)o=o.replace(s[e],i[e])}return o}const Bt=["1","2","3","4","5","6","7","8","9","0","clear","submit"];let qt=class extends(Ve(ne)){constructor(){super(...arguments),this._input="",this._showClearButton=!1,this._narrow=!1,this._codeClearTimer=0}hassSubscribe(){return[this.hass.connection.subscribeMessage(e=>this._fetchData(e),{type:Ce})]}async _fetchData(e){var t;if(e.data.area_id===(null===(t=this._params)||void 0===t?void 0:t.area_id))switch(e.data.event){case Ae.Disarm:case Ae.Arm:case Ae.Trigger:this._confirm(e.data.event);break;case Ae.InvalidCodeProvided:case Ae.NoCodeProvided:this._showCodeError();break;case Ae.FailedToArm:case Ae.CommandNotAllowed:this._confirm(e.data.event);case Ae.TriggerTimeExpired:case Ae.ReadyToArmModesChanged:}}shouldUpdate(e){const t=e.get("hass");return!(!e.has("_params")&&this._params)||(!!e.has("_input")||(!t||t.states[this._params.entity_id]!==this.hass.states[this._params.entity_id]&&(t.states[this._params.entity_id],this.hass.states[this._params.entity_id],!0)))}firstUpdated(e){super.firstUpdated(e),this.addEventListener("keypress",e=>{"Enter"===e.key&&this._input.length&&this._submit()})}async showDialog(e){this._params=e,this._input="",this._narrow=matchMedia("all and (max-width: 450px), all and (max-height: 500px)").matches,await this.updateComplete}closeDialog(){return this._params=void 0,this._showClearButton=!1,!0}_showCodeError(){var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#code");t&&(t.classList.remove("error"),t.classList.add("error"),t.hint=It("errors.invalid_pin",this.hass.language))}_clearCodeError(){var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#code");t&&t.classList.contains("error")&&(t.classList.remove("error"),t.hint="",this._input="",this._cancelCodeClearTimer())}_clearCode(){this._input="",this._clearCodeError(),this._cancelCodeClearTimer()}_setCodeClearTimer(){this._cancelCodeClearTimer(),this._input.length&&(this._codeClearTimer=window.setTimeout(()=>{this._clearCode()},12e4))}_cancelCodeClearTimer(){this._codeClearTimer&&clearTimeout(this._codeClearTimer)}_submit(){var e;const t=null!==(e=this._input)&&void 0!==e?e:"";this._clearCodeError(),this._params.action==ke.Disarm?this.hass.callService("alarmo","disarm",{entity_id:this._params.entity_id,code:t}):this.hass.callService("alarmo","arm",Object.assign(Object.assign({},this._params.armOptions),{entity_id:this._params.entity_id,mode:$e[this._params.action],code:t}))}_confirm(e){var t,s;null===(s=null===(t=this._params)||void 0===t?void 0:t.confirm)||void 0===s||s.call(t,e),this.closeDialog()}_cancel(){var e,t;null===(t=null===(e=this._params)||void 0===e?void 0:e.cancel)||void 0===t||t.call(e),this.closeDialog()}_numberClick(e){const t=e.currentTarget.value;this._clearCodeError(),this._setCodeClearTimer(),this._input=this._input+t,this._showClearButton=!0}_clear(){this._input="",this._showClearButton=!1}render(){if(!this._params||!this.hass)return V;return"text"===this._params.code_format?q`
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
            ${Bt.map(e=>""===e?q`<span></span>`:"clear"===e?q`
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
    `}};qt.styles=r`
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
  `,e([pe({attribute:!1})],qt.prototype,"hass",void 0),e([ue()],qt.prototype,"_params",void 0),e([ue()],qt.prototype,"_input",void 0),e([ue()],qt.prototype,"_showClearButton",void 0),e([ue()],qt.prototype,"_narrow",void 0),qt=e([le("hmac-code-dialog")],qt);var Ft=Object.freeze({__proto__:null,get AlarmoCodeDialog(){return qt}});let Vt=class extends ne{render(){if(!this.hass||!this.config)return V;const e=this.hass.states[this.config.entity];let t=e.state;const s=Object.values(ke).map(e=>$e[e]);if(!s.includes(t)){const s=e.attributes.arm_mode;s&&(t=s)}return q`
      <div class="container">
        ${this._renderOptions(t)}
      </div>
    `}_renderOptions(e){const t=this.hass.states[this.config.entity],s=[ke.Disarm,...Ne(t)].filter(e=>{const s=De($e[e],this.config).hide;if("boolean"==typeof s||!je(s))return!s;switch(s){case"always":return!1;case"never":return!0;case"armed":return"disarmed"==t.state;case"disarmed":return"disarmed"!==t.state}}),i=s.map(e=>De($e[e],this.config)).some(e=>!je(e.button_label)||e.button_label.length);return s.sort((e,t)=>{const s=De($e[e],this.config).button_order,i=De($e[t],this.config).button_order;return je(s)||je(i)?je(s)&&!je(i)?-1:!je(s)&&je(i)?1:s-i:0}),s.map(s=>{const a=je(this.readyForArmModes)&&!this.readyForArmModes.includes($e[s])&&s!=ke.Disarm,o=De($e[s],this.config);return q`
        <div class="button ${$e[s]==e?"selected":""}" @click=${e=>this._handleClick(e,s)}>
          <div class="content ${i?"has-text":""}">
            <ha-icon icon="${Pe(o.button_icon)?xe[s]:o.button_icon}"></ha-icon>
            ${$e[s]!=e&&je(this.readyForArmModes)?q`
              <ha-icon
                icon="${"mdi:circle-medium"}"
                class="badge ${a?"error":"success"}"
              ></ha-icon>
            `:V}
            <span>
              ${je(o.button_label)?o.button_label:s==ke.Disarm&&t.state!==fe.Disarmed?this.hass.localize(`ui.card.alarm_control_panel.${s}`):this.hass.localize(`ui.card.alarm_control_panel.modes.${$e[s]}`)}
            </span>
          </div>
        </div>
      `})}_handleClick(e,t){Me(this,"button-clicked",{ev:e,action:t})}static get styles(){return r`
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
        --mdc-icon-size: calc(var(--content-scale, 1) * 22px);
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
        background: var(--selected-color);
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
        font-weight: 400;
        font-size: calc(var(--content-scale, 1) * 1rem);
      }
      div.button.selected div.content ha-icon, div.button.selected div.content {
        color: white;
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
    `}};e([pe({attribute:!1})],Vt.prototype,"hass",void 0),e([pe({attribute:!1})],Vt.prototype,"config",void 0),e([pe({attribute:!1})],Vt.prototype,"readyForArmModes",void 0),Vt=e([le("hmac-actions-bar")],Vt);const Wt=["1","2","3","4","5","6","7","8","9","","0","clear"];let Zt=class extends(Ve(ne)){constructor(){super(...arguments),this._input="",this.warning="",this.area_id=void 0,this.armOptions=Object.assign({},ze),this.readyForArmModes=null,this.backendConnection=null,this.showBypassedSensors=!1,this.subscribedEntities=[],this._codeClearTimer=0}async getCardSize(){var e;if(!this._config||!this.hass)return 9;const t=this.hass.states[this._config.entity];return t&&(null===(e=this._alarmoConfig)||void 0===e?void 0:e.code_format)===ye?!Le(t)&&!this._config.keep_keypad_visible||this._config.use_code_dialog?4:9:4}set cardConfig(e){e&&JSON.stringify(e)!==JSON.stringify(this._cardConfigRaw)&&(this._cardConfigRaw=e,this.setConfig(e))}setConfig(e){!(null==e?void 0:e.button_scale_actions)&&(null==e?void 0:e.button_scale)&&(e=Object.assign(Object.assign({},e),{button_scale_actions:null==e?void 0:e.button_scale})),!(null==e?void 0:e.button_scale_keypad)&&(null==e?void 0:e.button_scale)&&(e=Object.assign(Object.assign({},e),{button_scale_keypad:null==e?void 0:e.button_scale})),(e=>{if(!e||!e.entity||"alarm_control_panel"!==Re(e.entity))throw new Error("Invalid configuration provided for entity");if(je(e.button_scale_keypad)&&("number"!=typeof e.button_scale_keypad||e.button_scale_keypad<1||e.button_scale_keypad>2.5))throw new Error("Invalid configuration provided for button_scale_keypad");if(je(e.button_scale_actions)&&("number"!=typeof e.button_scale_actions||e.button_scale_actions<1||e.button_scale_actions>2.5))throw new Error("Invalid configuration provided for button_scale_actions")})(e),this._config=Object.assign(Object.assign({},Ee),e)}hassSubscribe(){return[this.hass.connection.subscribeMessage(e=>this._fetchData(e),{type:Ce})]}async firstUpdated(){const e=await window.loadCardHelpers(),t=await e.createCardElement({type:"entities",entities:[]});await t.constructor.getConfigElement(),await this.loadBackendConfig()}async loadBackendConfig(){var e;this.backendConnection||(e=this.hass,e.callWS({type:"alarmo/entities"})).then(e=>{const t=e.find(e=>e.entity_id==this._config.entity);t&&(this.area_id=t.area_id?t.area_id:null)}).then(()=>(e=>e.callWS({type:"alarmo/config"}))(this.hass)).then(e=>{this._alarmoConfig=e,this.backendConnection=!0}).then(()=>((e,t)=>e.callWS({type:"alarmo/ready_to_arm_modes",entity_id:t}))(this.hass,this._config.entity)).then(e=>{this.readyForArmModes=e.modes}).catch(e=>{this.backendConnection=!1})}async _fetchData(e){if(e.data.area_id===this.area_id)switch(e.data.event){case Ae.Arm:this._clearCode();break;case Ae.Trigger:break;case Ae.InvalidCodeProvided:case Ae.NoCodeProvided:this._showCodeError(),this.subscribedEntities=[];break;case Ae.FailedToArm:this.warning="blocking_sensors",this._last_command=e.data.command,this._last_code=this._input,this._clearCode();break;case Ae.CommandNotAllowed:this._clearCode();break;case Ae.TriggerTimeExpired:break;case Ae.ReadyToArmModesChanged:this.readyForArmModes=e.data.modes}}shouldUpdate(e){if(e.has("_config"))return!0;const t=e.get("hass");if(!t||t.themes!==this.hass.themes||t.language!==this.hass.language||t.config.state!==this.hass.config.state)return!0;if(t.states[this._config.entity]!==this.hass.states[this._config.entity]){const e=t.states[this._config.entity],s=this.hass.states[this._config.entity];return!1===this.backendConnection&&(async()=>{await this.loadBackendConfig()})(),this.processStateUpdate(e,s),!0}return!(!this.subscribedEntities.length||!this.subscribedEntities.some(e=>t.states[e]!==this.hass.states[e]))}processStateUpdate(e,t){t.state!=e.state&&(this.subscribedEntities=[]),(t.state==fe.Disarmed||t.last_changed!==e.last_changed)&&this._clearCode()}render(){var e,t;if(!this._config||!this.hass||null===this.backendConnection)return q``;const s=this.hass.states[this._config.entity];return s?!1===this.backendConnection?q`
        <hui-warning>
          Could not establish a connection with the alarmo integration. Please check if it is installed and the correct
          entity is selected in the card settings.
        </hui-warning>
      `:q`
      <ha-card>
        ${s.state===fe.Disarmed?q`
              <ha-dropdown
                placement="bottom-end"
                id="cornerMenu"
              >
                <ha-icon-button slot="trigger" .label=${this.hass.localize("ui.common.menu")} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"}>
                </ha-icon-button>
                <span class="title">
                  ${It("arm_options.heading",this.hass.language)}
                </span>
                <ha-dropdown-item @click=${e=>this._toggleArmOptions(e,"skip_delay")}>
                  <ha-icon
                    icon="mdi:check"
                    style="${this.armOptions.skip_delay?"":"visibility: hidden"}"
                  ></ha-icon>
                  ${It("arm_options.skip_delay",this.hass.language)}
                </ha-dropdown-item>
                <ha-dropdown-item @click=${e=>this._toggleArmOptions(e,"force")}>
                  <ha-icon
                    icon="mdi:check"
                    style="${this.armOptions.force?"":"visibility: hidden"}"
                  ></ha-icon>
                  ${It("arm_options.force",this.hass.language)}
                </ha-dropdown-item>
              </ha-dropdown>
            `:""}

        <div class="header">
          <div class="icon">
            <hmac-state-badge
              .hass=${this.hass}
              .entity=${this._config.entity}
              style="--alarm-state-color: ${Ue(s,this._config)}"
            >
            </hmac-state-badge>
          </div>
          <div class="summary">
            <div class="name">
              ${((e,t)=>Pe(t.name)?e.attributes.friendly_name:t.name)(s,this._config)}
            </div>
            <div class="state">
              ${He(s,this.hass.localize,this._config)}
            </div>
          </div>
        </div>

        ${this._renderWarning()}

        <div id="actions" class="actions">
          ${this._renderActions()}
        </div>

        ${!Le(s)&&!this._config.keep_keypad_visible||this._config.use_code_dialog?q``:q`
              <ha-input
                .value=${this._input}
                .label=${this.hass.localize("ui.card.alarm_control_panel.code")}
                ?disabled=${!Le(s)}
                @input=${e=>{this._clearCodeError(),this._input=e.target.value,this._setCodeClearTimer()}}
                @focus=${this._clearCodeError}
                type="password"
                id="code_input"
                .inputmode=${(null===(e=this._alarmoConfig)||void 0===e?void 0:e.code_format)===ye?"numeric":"text"}
              ></ha-input>
            `}
        ${!Le(s)&&!this._config.keep_keypad_visible||(null===(t=this._alarmoConfig)||void 0===t?void 0:t.code_format)!==ye||this._config.use_code_dialog||this._config.hide_keypad?q``:q`
          <div id="keypad" class="keypad" style="max-width: ${300*this._config.button_scale_keypad}px">
            ${Wt.map(e=>""===e?q`
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
                ?disabled=${!Le(s)||"clear"===e&&!this._input.length}
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
        style="--alarm-state-color: ${Ue(e,this._config,!0)}; --content-scale: ${this._config.button_scale_actions}"
      ></hmac-actions-bar>
    `}_renderWarning(){var e;if(!this.hass||!this._config||!this._config.show_messages)return q``;const t=this.hass.states[this._config.entity];return t.attributes.open_sensors&&t.state==fe.Triggered||"blocking_sensors"==this.warning&&t.attributes.open_sensors?q`
        <div class="messagebox">
          <div class="messagebox-left"></div>
          <div class="messagebox-inner">
            <div class="description">
              <div class="description-filler"></div>
              <span>
                <ha-icon icon="hass:alert"></ha-icon>
                ${"blocking_sensors"==this.warning?It("errors.blocking_sensors",this.hass.language):It("errors.triggered_sensors",this.hass.language)}
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
              <span>${It("arm_options.force",this.hass.language)}</span>
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
                ${It("errors.bypassed_sensors",this.hass.language)}
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
      `:q``}_handlePadClick(e){const t=e.currentTarget.value;this._clearCodeError(),this._input="clear"===t?"":this._input+t}async _handleActionClick(e,t){var s;e.target.blur(),this._clearCodeError();const i=this.hass.states[this._config.entity];if((null===(s=this._config)||void 0===s?void 0:s.use_code_dialog)&&!this._config.hide_keypad&&Le(i)){const s=await new Promise(s=>{const i=e.target,a={code_format:this._alarmoConfig.code_format,area_id:this.area_id,entity_id:this._config.entity,action:t,armOptions:this.armOptions,cancel:()=>{s(null)},confirm:e=>{s(e)}};Me(i,"show-dialog",{dialogTag:"hmac-code-dialog",dialogImport:()=>Promise.resolve().then(function(){return Ft}),dialogParams:a})});s!=Ae.Arm&&s!=Ae.Disarm||(this.warning="",this.armOptions=Object.assign({},ze))}else t==ke.Disarm?this.hass.callService("alarmo","disarm",{entity_id:this._config.entity,code:this._input}):this.hass.callService("alarmo","arm",Object.assign(Object.assign({},this.armOptions),{entity_id:this._config.entity,mode:$e[t],code:this._input})),this.warning="",this.armOptions=Object.assign({},ze)}_showCodeError(){var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#code_input");t&&(t.classList.remove("error"),t.classList.add("error"),t.hint=It("errors.invalid_pin",this.hass.language))}_clearCodeError(){var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#code_input");t&&t.classList.contains("error")&&(t.classList.remove("error"),t.hint="",this._input="",this._cancelCodeClearTimer())}_clearCode(){this._input="",this._clearCodeError(),this._cancelCodeClearTimer()}_setCodeClearTimer(){this._cancelCodeClearTimer(),this._input.length&&(this._codeClearTimer=window.setTimeout(()=>{this._clearCode()},12e4))}_cancelCodeClearTimer(){this._codeClearTimer&&clearTimeout(this._codeClearTimer)}_toggleArmOptions(e,t){e.stopImmediatePropagation(),e.target.blur(),"skip_delay"==t?this.armOptions=Object.assign(Object.assign({},this.armOptions),{skip_delay:!this.armOptions.skip_delay}):"force"==t&&(this.armOptions=Object.assign(Object.assign({},this.armOptions),{force:!this.armOptions.force}))}_forceRetryClick(){if(!this.hass||!this._config||!this._last_command)return;let e=this._last_command;this.hass.callService("alarmo","arm",{entity_id:this._config.entity,mode:$e[e],code:this._last_code,force:!0}),this._last_command=void 0,this._last_code=void 0}static get styles(){return r`
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
        font-size: 24px;
        display: flex;
      }
      .header .state {
        font-size: 14px;
        display: flex;
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
      ha-dropdown {
        display: block;
        position: absolute;
        right: 4px;
        top: 4px;
      }
      ha-dropdown span.title {
        font-weight: bold;
        display: flex;
        height: 32px;
        align-items: center;
        padding: 0px 8px;
      }
      @media all and (max-width: 250px) {
        ha-dropdown {
          display: none;
        }
      }
    `}};e([pe({attribute:!1})],Zt.prototype,"hass",void 0),e([ue()],Zt.prototype,"_config",void 0),e([ue()],Zt.prototype,"_alarmoConfig",void 0),e([ue()],Zt.prototype,"_input",void 0),e([ue()],Zt.prototype,"warning",void 0),e([ue()],Zt.prototype,"area_id",void 0),e([ue()],Zt.prototype,"armOptions",void 0),e([ue()],Zt.prototype,"readyForArmModes",void 0),e([ue()],Zt.prototype,"backendConnection",void 0),e([ue()],Zt.prototype,"showBypassedSensors",void 0),e([pe({attribute:!1})],Zt.prototype,"cardConfig",null),Zt=e([le("hmac-alarm")],Zt);const Gt=["keep_keypad_visible","use_code_dialog","hide_keypad","show_messages","show_ready_indicator","show_bypassed_sensors","button_scale_actions","button_scale_keypad"],Kt={entity:"Alarmo alarm (partition)",name:"Name (when House Modes are off)",show_header:"Header: House Mode and panel display",show_house_modes:"House Mode buttons",show_alarm:"Alarm: arm / disarm, code, messages",show_panel_keypad:"Physical panel keypad",collapsible:"Collapsible (tap the header)",start_collapsed:"Start collapsed",columns:"House Mode buttons per row",hidden_modes:"Hide these House Modes",alarm:"Alarm options",keep_keypad_visible:"Always show the code keypad",use_code_dialog:"Ask for the code in a dialog",hide_keypad:"Hide the code keypad",show_messages:"Show messages (not ready, triggered)",show_ready_indicator:"Ready indicator on the arm buttons",show_bypassed_sensors:"Warn about bypassed zones",button_scale_actions:"Arm button size",button_scale_keypad:"Code keypad size"};let Yt=class extends ne{setConfig(e){this.config=e}firstUpdated(){var e;null===(e=this.hass)||void 0===e||e.callWS({type:"alarmo/ext/card/get"}).then(e=>this.data=e).catch(()=>{})}schema(){var e;const t=((null===(e=this.data)||void 0===e?void 0:e.house.modes)||[]).map(e=>({value:e.id,label:e.name}));return[{name:"entity",selector:{entity:{domain:"alarm_control_panel",integration:"alarmo"}}},{name:"name",selector:{text:{}}},{type:"grid",name:"",schema:["show_header","show_house_modes","show_alarm","show_panel_keypad","collapsible","start_collapsed"].map(e=>({name:e,selector:{boolean:{}}}))},{name:"columns",selector:{number:{min:2,max:9,mode:"slider"}}},...t.length?[{name:"hidden_modes",selector:{select:{multiple:!0,mode:"dropdown",options:t}}}]:[],{type:"expandable",name:"alarm",title:Kt.alarm,schema:Gt.map(e=>e.startsWith("button_scale")?{name:e,selector:{number:{min:1,max:2.5,step:.1,mode:"slider"}}}:{name:e,selector:{boolean:{}}})}]}render(){if(!this.hass||!this.config)return V;const e=Object.assign(Object.assign({},me),this.config);return q`
      <ha-form
        .hass=${this.hass}
        .data=${e}
        .schema=${this.schema()}
        .computeLabel=${e=>Kt[e.name]||e.name}
        @value-changed=${this.changed}
      ></ha-form>
      <p style="color:var(--secondary-text-color);font-size:0.9em">
        Who may use the physical panel keypad is set in the integration: Alarmo panel → Physical Panel → <em>Panel keypad
        on dashboards</em>. House Mode icons and colours are set on the House Modes tab.
      </p>
    `}changed(e){e.stopPropagation();const t=Object.assign({},e.detail.value);for(const[e,s]of Object.entries(me))t[e]===s&&delete t[e];Array.isArray(t.hidden_modes)&&!t.hidden_modes.length&&delete t.hidden_modes,t.alarm&&!Object.keys(t.alarm).length&&delete t.alarm,t.name||delete t.name,this.config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}};e([pe({attribute:!1})],Yt.prototype,"hass",void 0),e([ue()],Yt.prototype,"config",void 0),e([ue()],Yt.prototype,"data",void 0),Yt=e([le("house-modes-alarm-center-card-editor")],Yt);var Jt,Xt,Qt,es;!function(e){e.STATE_ALARM_DISARMED="disarmed",e.STATE_ALARM_ARMED_HOME="armed_home",e.STATE_ALARM_ARMED_AWAY="armed_away",e.STATE_ALARM_ARMED_NIGHT="armed_night",e.STATE_ALARM_ARMED_CUSTOM_BYPASS="armed_custom_bypass",e.STATE_ALARM_ARMED_VACATION="armed_vacation",e.STATE_ALARM_PENDING="pending",e.STATE_ALARM_ARMING="arming",e.STATE_ALARM_TRIGGERED="triggered"}(Jt||(Jt={})),function(e){e.COMMAND_ALARM_DISARM="disarm",e.COMMAND_ALARM_ARM_HOME="arm_home",e.COMMAND_ALARM_ARM_AWAY="arm_away",e.COMMAND_ALARM_ARM_NIGHT="arm_night",e.COMMAND_ALARM_ARM_CUSTOM_BYPASS="arm_custom_bypass",e.COMMAND_ALARM_ARM_VACATION="arm_vacation"}(Xt||(Xt={})),function(e){e.Door="door",e.Window="window",e.Motion="motion",e.Tamper="tamper",e.Environmental="environmental",e.Other="other"}(Qt||(Qt={})),function(e){e.Notification="notification",e.Action="action"}(es||(es={}));const ts="2026.11.04.40",ss="house-modes-alarm-center-card";let is=class extends ne{constructor(){super(...arguments),this.error="",this.collapsed=!1,this.message="",this.busyKey="",this.fetchedFor="",this.requestedAt=0,this.messageTimer=0}static getConfigElement(){return document.createElement(`${ss}-editor`)}static getStubConfig(e){const t=Object.keys(e.states).find(t=>t.startsWith("alarm_control_panel.")&&void 0!==e.states[t].attributes.arm_mode);return{entity:t}}setConfig(e){if(!e)throw new Error("Invalid configuration");if(e.entity&&!e.entity.startsWith("alarm_control_panel."))throw new Error("entity must be an Alarmo alarm_control_panel");const t=!this.config;this.config=Object.assign(Object.assign({},me),e),t&&(this.collapsed=!(!this.config.collapsible||!this.config.start_collapsed))}getCardSize(){var e,t,s,i;if(this.collapsed)return 2;let a=0;return(null===(e=this.config)||void 0===e?void 0:e.show_header)&&(a+=2),(null===(t=this.config)||void 0===t?void 0:t.show_house_modes)&&(a+=2),(null===(s=this.config)||void 0===s?void 0:s.show_alarm)&&(a+=4),(null===(i=this.config)||void 0===i?void 0:i.show_panel_keypad)&&(a+=4),a||2}updated(e){if(!e.has("hass")||!this.hass)return;const t=this.hass.states["select.alarmo_house_mode"],s=this.data?this.hass.states[this.data.house.select_entity]:void 0,i=`${null==t?void 0:t.last_updated}|${null==s?void 0:s.last_updated}`;i!==this.fetchedFor&&(this.fetchedFor=i,this.fetch())}async fetch(){try{this.data=await this.hass.callWS({type:"alarmo/ext/card/get"}),this.error="";const e=this.data.house.last_result;if(this.requestedAt&&(null==e?void 0:e.at)&&Date.parse(e.at)>=this.requestedAt-2e3){this.requestedAt=0;const t=((e,t)=>{if(!e)return null;const s=e.requested||"House Mode";switch(e.result){case"blocked":return`${s} not set: ${e.reason||"not allowed now"}`;case"not_ready":return`${s} not set: open ${(e.open||[]).map(t).join(", ")||"zones"}`;case"delayed":return`${s} in ${e.minutes} min`;case"failed":return`${s} failed: ${(e.failed||[]).join(", ")} did not arm`;case"error":return`${s}: ${e.reason||"error"}`;case"shadow":return e.would&&"changed"!==e.would?`Shadow: ${s} would be ${e.would.replace("_"," ")}`:null;default:return null}})(e,e=>this.name(e));t&&this.flash(t)}}catch(e){this.error="House Modes & Alarm Center is not installed or not up to date: "+((null==e?void 0:e.message)||e)}}name(e){var t,s,i;return(null===(i=null===(s=null===(t=this.hass)||void 0===t?void 0:t.states[e])||void 0===s?void 0:s.attributes)||void 0===i?void 0:i.friendly_name)||e}flash(e){this.message=e,window.clearTimeout(this.messageTimer),this.messageTimer=window.setTimeout(()=>this.message="",8e3)}get alarmEntity(){var e,t,s,i;return(null===(e=this.config)||void 0===e?void 0:e.entity)||(null===(t=be(this.data,void 0))||void 0===t?void 0:t.alarm_entity)||(null===(i=null===(s=this.data)||void 0===s?void 0:s.alarms[0])||void 0===i?void 0:i.entity_id)}async chooseMode(e){const t=this.data.house.select_entity,s=t.split(".")[0];this.requestedAt=Date.now();try{await this.hass.callService(s,"select_option",{entity_id:t,option:e})}catch(e){this.requestedAt=0,this.flash((null==e?void 0:e.message)||String(e))}}async press(e){const t=be(this.data,this.alarmEntity);if(t){this.busyKey=e;try{await this.hass.callService("alarmo","panel_keypress",{keys:e,entity_id:t.panel_entity})}catch(e){this.flash((null==e?void 0:e.message)||String(e))}finally{this.busyKey=""}}}toggle(){var e;(null===(e=this.config)||void 0===e?void 0:e.collapsible)&&(this.collapsed=!this.collapsed)}moreInfo(e){e&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}render(){var e,t,s;if(!this.config||!this.hass)return V;if(this.error)return q`<ha-card><div class="warn">${this.error}</div></ha-card>`;if(!this.data)return q`<ha-card><div class="loading">…</div></ha-card>`;const i=this.config,a=this.data.house,o=a.modes.find(e=>e.id===a.current),r=this.alarmEntity,n=be(this.data,r),d=r?null===(e=this.hass.states[r])||void 0===e?void 0:e.state:void 0,l=((e,t,s,i)=>"triggered"===e||"triggered"===t?"#f44336":"arming"===e||"pending"===e||"arming"===t||"pending"===t?"#ff9800":e&&ve.includes(e)||t&&ve.includes(t)?i||"#f44336":"on"===s?"#4caf50":"off"===s?"#ff9800":"var(--divider-color)")(d,n?null===(t=this.hass.states[n.panel_entity])||void 0===t?void 0:t.state:void 0,(null==n?void 0:n.ready_entity)?null===(s=this.hass.states[n.ready_entity])||void 0===s?void 0:s.state:void 0,null==o?void 0:o.color);return q`
      <ha-card style=${`--hmac-border:${l}`}>
        ${i.show_header||this.collapsed?this.renderHeader(o,d,n):V}
        ${this.message?q`<div class="message" role="status">${this.message}</div>`:V}
        ${this.collapsed?V:q`
              ${i.show_house_modes&&a.enabled?this.renderModes():V}
              ${i.show_alarm&&r?q`<hmac-alarm embedded .hass=${this.hass} .cardConfig=${Object.assign(Object.assign(Object.assign({type:"hmac-alarm"},i.alarm||{}),{entity:r}),i.name?{name:i.name}:{})}></hmac-alarm>`:V}
              ${i.show_panel_keypad&&"envisalink"===(null==n?void 0:n.panel_type)?this.renderKeypad(n):V}
            `}
      </ha-card>
    `}renderHeader(e,t,s){var i,a;const o=this.data.house,r=(null==s?void 0:s.keypad_entity)?this.hass.states[s.keypad_entity]:void 0,[n,d]=ge(null!==(a=null===(i=null==r?void 0:r.attributes)||void 0===i?void 0:i.alpha)&&void 0!==a?a:null==r?void 0:r.state),l=o.enabled?e?e.name:"unknown":this.config.name||(t?t.replace(/_/g," "):"");return q`
      <div class="head ${this.config.collapsible?"clickable":""}" @click=${this.toggle}
        @contextmenu=${e=>{e.preventDefault(),this.moreInfo((null==s?void 0:s.keypad_entity)||this.alarmEntity)}}
        role=${this.config.collapsible?"button":V} aria-expanded=${this.config.collapsible?String(!this.collapsed):V}>
        <ha-icon class="mode-icon" icon=${(null==e?void 0:e.icon)||"mdi:shield-home"} style=${`color:${(null==e?void 0:e.color)||"var(--secondary-text-color)"}`}></ha-icon>
        <div class="head-text">
          <div class="mode-name">${l.toUpperCase()}</div>
          ${r?q`<div class="lcd" aria-label="Panel display"><div>${n||" "}</div><div>${d||" "}</div></div>`:V}
        </div>
        ${o.shadow?q`<span class="tag" title="House Modes run in Shadow: your automations are in charge">shadow</span>`:V}
        ${this.config.collapsible?q`<ha-icon class="chev" icon=${this.collapsed?"mdi:chevron-down":"mdi:chevron-up"}></ha-icon>`:V}
      </div>
    `}renderModes(){const e=this.data.house,t=(s=this.data,i=this.config.hidden_modes,s.house.modes.filter(e=>!(i||[]).includes(e.id)&&!(i||[]).includes(e.name)));var s,i;return q`
      <div class="modes" style=${`grid-template-columns:repeat(${Math.max(1,Math.min(9,this.config.columns||5))}, 1fr)`}>
        ${t.map(t=>{const s=t.id===e.current;return q`<button class="mode ${s?"on":""}" aria-pressed=${s?"true":"false"} title=${t.name}
              @click=${()=>this.chooseMode(t.name)}>
              <ha-icon icon=${t.icon} style=${s?`color:${t.color}`:""}></ha-icon>
              <span>${t.name}</span>
            </button>`})}
      </div>
    `}renderKeypad(e){const t=this.data.keypad,s=t.blocked_keys||"";return q`
      <div class="keypad-wrap">
        ${!this.config.show_header&&e.keypad_entity?(()=>{var t,s;const i=this.hass.states[e.keypad_entity],[a,o]=ge(null!==(s=null===(t=null==i?void 0:i.attributes)||void 0===t?void 0:t.alpha)&&void 0!==s?s:null==i?void 0:i.state);return q`<div class="lcd big"><div>${a||" "}</div><div>${o||" "}</div></div>`})():V}
        ${t.allowed?V:q`<div class="note">Panel keypad: ${t.reason}</div>`}
        <div class="keys">
          ${(i=this.config.keypad_labels,_e.map(([e,t])=>[e,i&&e in i?i[e]:t])).map(([e,i])=>q`
            <button class="key" ?disabled=${!t.allowed||s.includes(e)||this.busyKey===e}
              aria-label=${i?`${e} ${i}`:e} @click=${()=>this.press(e)}>
              <span class="k">${e}</span>${i?q`<span class="l">${i}</span>`:V}
            </button>`)}
        </div>
      </div>
    `;var i}};is.styles=r`
    ha-card {
      overflow: hidden;
      border: 2px solid var(--hmac-border, var(--divider-color));
      border-radius: var(--ha-card-border-radius, 12px);
    }
    /* icon + text centred together in the card (chevron at the right edge) */
    .head {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      padding: 12px 44px;
      min-height: 72px;
    }
    .head.clickable {
      cursor: pointer;
    }
    /* a box (ha-icon is inline in Home Assistant): its middle is the text block's middle */
    .mode-icon {
      --mdc-icon-size: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      flex: none;
      line-height: 0;
    }
    .head-text {
      flex: none;
      text-align: center;
      min-width: 0;
      max-width: calc(100% - 84px);
    }
    .mode-name {
      font-family: var(--code-font-family, monospace);
      font-size: 1.6em;
      letter-spacing: 0.06em;
      line-height: 1.25;
      color: var(--primary-text-color);
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
    .head.clickable .tag {
      right: 40px;
    }
    .lcd {
      font-family: var(--code-font-family, monospace);
      font-size: 1em;
      white-space: pre;
      color: var(--primary-text-color);
      line-height: 1.6;
      margin-top: 2px;
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
      gap: 4px;
      padding: 4px 8px 8px;
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
      --mdc-icon-size: 36px;
    }
    .mode span {
      font-size: 0.72em;
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
      font-size: 1.15em;
      line-height: 1;
    }
    .key .l {
      font-size: 0.7em;
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
  `,e([pe({attribute:!1})],is.prototype,"hass",void 0),e([ue()],is.prototype,"config",void 0),e([ue()],is.prototype,"data",void 0),e([ue()],is.prototype,"error",void 0),e([ue()],is.prototype,"collapsed",void 0),e([ue()],is.prototype,"message",void 0),e([ue()],is.prototype,"busyKey",void 0),is=e([le(ss)],is),window.customCards=window.customCards||[],window.customCards.some(e=>e.type===ss)||window.customCards.push({type:ss,name:"House Modes & Alarm Center Card",description:"House Mode, Alarmo alarm and physical panel keypad in one card.",preview:!0}),console.info(`%c HOUSE MODES & ALARM CENTER CARD %c ${ts} `,"background:#03a9f4;color:#fff","background:#333;color:#fff");export{ts as CARD_VERSION,is as HouseModesAlarmCenterCard};
