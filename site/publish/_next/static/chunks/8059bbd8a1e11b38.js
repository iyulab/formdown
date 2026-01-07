(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,12207,54479,92057,4148,t=>{"use strict";let e=globalThis,r=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),i=new WeakMap;class n{constructor(t,e,r){if(this._$cssResult$=!0,r!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(r&&void 0===t){let r=void 0!==e&&1===e.length;r&&(t=i.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&i.set(e,t))}return t}toString(){return this.cssText}}let s=t=>new n("string"==typeof t?t:t+"",void 0,o),a=(t,...e)=>new n(1===t.length?t[0]:e.reduce((e,r,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[o+1],t[0]),t,o),d=(t,o)=>{if(r)t.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let r of o){let o=document.createElement("style"),i=e.litNonce;void 0!==i&&o.setAttribute("nonce",i),o.textContent=r.cssText,t.appendChild(o)}},l=r?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(let r of t.cssRules)e+=r.cssText;return s(e)})(t):t,{is:h,defineProperty:c,getOwnPropertyDescriptor:m,getOwnPropertyNames:p,getOwnPropertySymbols:u,getPrototypeOf:f}=Object,b=globalThis,g=b.trustedTypes,w=g?g.emptyScript:"",v=b.reactiveElementPolyfillSupport,y={toAttribute(t,e){switch(e){case Boolean:t=t?w:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=null!==t;break;case Number:r=null===t?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch(t){r=null}}return r}},_=(t,e)=>!h(t,e),$={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:_};Symbol.metadata??=Symbol("metadata"),b.litPropertyMetadata??=new WeakMap;class x extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let r=Symbol(),o=this.getPropertyDescriptor(t,r,e);void 0!==o&&c(this.prototype,t,o)}}static getPropertyDescriptor(t,e,r){let{get:o,set:i}=m(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){let n=o?.call(this);i?.call(this,e),this.requestUpdate(t,n,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty("elementProperties"))return;let t=f(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty("finalized"))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty("properties")){let t=this.properties;for(let e of[...p(t),...u(t)])this.createProperty(e,t[e])}let t=this[Symbol.metadata];if(null!==t){let e=litPropertyMetadata.get(t);if(void 0!==e)for(let[t,r]of e)this.elementProperties.set(t,r)}for(let[t,e]of(this._$Eh=new Map,this.elementProperties)){let r=this._$Eu(t,e);void 0!==r&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t))for(let r of new Set(t.flat(1/0).reverse()))e.unshift(l(r));else void 0!==t&&e.push(l(t));return e}static _$Eu(t,e){let r=e.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map;for(let e of this.constructor.elementProperties.keys())this.hasOwnProperty(e)&&(t.set(e,this[e]),delete this[e]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return d(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){let r=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,r);if(void 0!==o&&!0===r.reflect){let i=(void 0!==r.converter?.toAttribute?r.converter:y).toAttribute(e,r.type);this._$Em=t,null==i?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){let r=this.constructor,o=r._$Eh.get(t);if(void 0!==o&&this._$Em!==o){let t=r.getPropertyOptions(o),i="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=o,this[o]=i.fromAttribute(e,t.type)??this._$Ej?.get(o)??null,this._$Em=null}}requestUpdate(t,e,r){if(void 0!==t){let o=this.constructor,i=this[t];if(!(((r??=o.getPropertyOptions(t)).hasChanged??_)(i,e)||r.useDefault&&r.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,r))))return;this.C(t,e,r)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:o,wrapped:i},n){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==i||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),!0===o&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[e,r]of t){let{wrapped:t}=r,o=this[e];!0!==t||this._$AL.has(e)||void 0===o||this.C(e,void 0,r,o)}}let t=!1,e=this._$AL;try{(t=this.shouldUpdate(e))?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}}x.elementStyles=[],x.shadowRootOptions={mode:"open"},x.elementProperties=new Map,x.finalized=new Map,v?.({ReactiveElement:x}),(b.reactiveElementVersions??=[]).push("2.1.0"),t.s(["ReactiveElement",()=>x,"defaultConverter",()=>y,"notEqual",()=>_],31507);let E=globalThis,S=E.trustedTypes,A=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,U="?"+M,k=`<${U}>`,P=document,T=()=>P.createComment(""),z=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,R=t=>O(t)||"function"==typeof t?.[Symbol.iterator],H="[ 	\n\f\r]",D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,L=/-->/g,F=/>/g,I=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),N=/'/g,B=/"/g,j=/^(?:script|style|textarea|title)$/i,q=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),V=q(1),K=q(2),W=q(3),G=Symbol.for("lit-noChange"),J=Symbol.for("lit-nothing"),Y=new WeakMap,Z=P.createTreeWalker(P,129);function Q(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}let X=(t,e)=>{let r=t.length-1,o=[],i,n=2===e?"<svg>":3===e?"<math>":"",s=D;for(let e=0;e<r;e++){let r=t[e],a,d,l=-1,h=0;for(;h<r.length&&(s.lastIndex=h,null!==(d=s.exec(r)));)h=s.lastIndex,s===D?"!--"===d[1]?s=L:void 0!==d[1]?s=F:void 0!==d[2]?(j.test(d[2])&&(i=RegExp("</"+d[2],"g")),s=I):void 0!==d[3]&&(s=I):s===I?">"===d[0]?(s=i??D,l=-1):void 0===d[1]?l=-2:(l=s.lastIndex-d[2].length,a=d[1],s=void 0===d[3]?I:'"'===d[3]?B:N):s===B||s===N?s=I:s===L||s===F?s=D:(s=I,i=void 0);let c=s===I&&t[e+1].startsWith("/>")?" ":"";n+=s===D?r+k:l>=0?(o.push(a),r.slice(0,l)+C+r.slice(l)+M+c):r+M+(-2===l?e:c)}return[Q(t,n+(t[r]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class tt{constructor({strings:t,_$litType$:e},r){let o;this.parts=[];let i=0,n=0;const s=t.length-1,a=this.parts,[d,l]=X(t,e);if(this.el=tt.createElement(d,r),Z.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=Z.nextNode())&&a.length<s;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(C)){const e=l[n++],r=o.getAttribute(t).split(M),s=/([.?@])?(.*)/.exec(e);a.push({type:1,index:i,name:s[2],strings:r,ctor:"."===s[1]?tn:"?"===s[1]?ts:"@"===s[1]?ta:ti}),o.removeAttribute(t)}else t.startsWith(M)&&(a.push({type:6,index:i}),o.removeAttribute(t));if(j.test(o.tagName)){const t=o.textContent.split(M),e=t.length-1;if(e>0){o.textContent=S?S.emptyScript:"";for(let r=0;r<e;r++)o.append(t[r],T()),Z.nextNode(),a.push({type:2,index:++i});o.append(t[e],T())}}}else if(8===o.nodeType)if(o.data===U)a.push({type:2,index:i});else{let t=-1;for(;-1!==(t=o.data.indexOf(M,t+1));)a.push({type:7,index:i}),t+=M.length-1}i++}}static createElement(t,e){let r=P.createElement("template");return r.innerHTML=t,r}}function te(t,e,r=t,o){if(e===G)return e;let i=void 0!==o?r._$Co?.[o]:r._$Cl,n=z(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),void 0===n?i=void 0:(i=new n(t))._$AT(t,r,o),void 0!==o?(r._$Co??=[])[o]=i:r._$Cl=i),void 0!==i&&(e=te(t,i._$AS(t,e.values),i,o)),e}class tr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:r}=this._$AD,o=(t?.creationScope??P).importNode(e,!0);Z.currentNode=o;let i=Z.nextNode(),n=0,s=0,a=r[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new to(i,i.nextSibling,this,t):1===a.type?e=new a.ctor(i,a.name,a.strings,this,t):6===a.type&&(e=new td(i,this,t)),this._$AV.push(e),a=r[++s]}n!==a?.index&&(i=Z.nextNode(),n++)}return Z.currentNode=P,o}p(t){let e=0;for(let r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class to{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,o){this.type=2,this._$AH=J,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){z(t=te(this,t,e))?t===J||null==t||""===t?(this._$AH!==J&&this._$AR(),this._$AH=J):t!==this._$AH&&t!==G&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):R(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==J&&z(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:r}=t,o="number"==typeof r?this._$AC(t):(void 0===r.el&&(r.el=tt.createElement(Q(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===o)this._$AH.p(e);else{let t=new tr(o,this),r=t.u(this.options);t.p(e),this.T(r),this._$AH=t}}_$AC(t){let e=Y.get(t.strings);return void 0===e&&Y.set(t.strings,e=new tt(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,o=0;for(let i of t)o===e.length?e.push(r=new to(this.O(T()),this.O(T()),this,this.options)):r=e[o],r._$AI(i),o++;o<e.length&&(this._$AR(r&&r._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){let e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class ti{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,o,i){this.type=1,this._$AH=J,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=J}_$AI(t,e=this,r,o){let i=this.strings,n=!1;if(void 0===i)(n=!z(t=te(this,t,e,0))||t!==this._$AH&&t!==G)&&(this._$AH=t);else{let o,s,a=t;for(t=i[0],o=0;o<i.length-1;o++)(s=te(this,a[r+o],e,o))===G&&(s=this._$AH[o]),n||=!z(s)||s!==this._$AH[o],s===J?t=J:t!==J&&(t+=(s??"")+i[o+1]),this._$AH[o]=s}n&&!o&&this.j(t)}j(t){t===J?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tn extends ti{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===J?void 0:t}}class ts extends ti{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==J)}}class ta extends ti{constructor(t,e,r,o,i){super(t,e,r,o,i),this.type=5}_$AI(t,e=this){if((t=te(this,t,e,0)??J)===G)return;let r=this._$AH,o=t===J&&r!==J||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,i=t!==J&&(r===J||o);o&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class td{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){te(this,t)}}let tl={M:C,P:M,A:U,C:1,L:X,R:tr,D:R,V:te,I:to,H:ti,N:ts,U:ta,B:tn,F:td},th=E.litHtmlPolyfillSupport;th?.(tt,to),(E.litHtmlVersions??=[]).push("3.3.0");let tc=(t,e,r)=>{let o=r?.renderBefore??e,i=o._$litPart$;if(void 0===i){let t=r?.renderBefore??null;o._$litPart$=i=new to(e.insertBefore(T(),t),t,void 0,r??{})}return i._$AI(t),i};t.s(["_$LH",()=>tl,"html",()=>V,"mathml",()=>W,"noChange",()=>G,"nothing",()=>J,"render",()=>tc,"svg",()=>K],54479);let tm=globalThis;class tp extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=tc(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}}tp._$litElement$=!0,tp.finalized=!0,tm.litElementHydrateSupport?.({LitElement:tp});let tu=tm.litElementPolyfillSupport;tu?.({LitElement:tp});let tf={_$AK:(t,e,r)=>{t._$AK(e,r)},_$AL:t=>t._$AL};(tm.litElementVersions??=[]).push("4.2.0"),t.s(["LitElement",()=>tp,"_$LE",()=>tf],8285),t.s([],12207),t.i(31507),t.s(["CSSResult",()=>n,"ReactiveElement",()=>x,"adoptStyles",()=>d,"css",()=>a,"defaultConverter",()=>y,"getCompatibleStyle",()=>l,"notEqual",()=>_,"supportsAdoptingStyleSheets",()=>r,"unsafeCSS",()=>s],92057),t.i(8285),t.i(92057),t.i(54479),t.s(["LitElement",()=>tp],4148)},8703,t=>{"use strict";let e;t.i(12207);var r=t.i(92057),o=t.i(4148),i=t.i(54479);t.i(40365);var n=t.i(19559),s=t.i(4594);let a=globalThis,d=a.ShadowRoot&&(void 0===a.ShadyCSS||a.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,l=Symbol(),h=new WeakMap,c=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==l)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(d&&void 0===t){let r=void 0!==e&&1===e.length;r&&(t=h.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&h.set(e,t))}return t}toString(){return this.cssText}},m=d?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e,r="";for(let e of t.cssRules)r+=e.cssText;return new c("string"==typeof(e=r)?e:e+"",void 0,l)})(t):t,{is:p,defineProperty:u,getOwnPropertyDescriptor:f,getOwnPropertyNames:b,getOwnPropertySymbols:g,getPrototypeOf:w}=Object,v=globalThis,y=v.trustedTypes,_=y?y.emptyScript:"",$=v.reactiveElementPolyfillSupport,x={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=null!==t;break;case Number:r=null===t?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch{r=null}}return r}},E=(t,e)=>!p(t,e),S={attribute:!0,type:String,converter:x,reflect:!1,useDefault:!1,hasChanged:E};Symbol.metadata??=Symbol("metadata"),v.litPropertyMetadata??=new WeakMap;class A extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=S){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let r=Symbol(),o=this.getPropertyDescriptor(t,r,e);void 0!==o&&u(this.prototype,t,o)}}static getPropertyDescriptor(t,e,r){let{get:o,set:i}=f(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){let n=o?.call(this);i?.call(this,e),this.requestUpdate(t,n,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??S}static _$Ei(){if(this.hasOwnProperty("elementProperties"))return;let t=w(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty("finalized"))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty("properties")){let t=this.properties;for(let e of[...b(t),...g(t)])this.createProperty(e,t[e])}let t=this[Symbol.metadata];if(null!==t){let e=litPropertyMetadata.get(t);if(void 0!==e)for(let[t,r]of e)this.elementProperties.set(t,r)}for(let[t,e]of(this._$Eh=new Map,this.elementProperties)){let r=this._$Eu(t,e);void 0!==r&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t))for(let r of new Set(t.flat(1/0).reverse()))e.unshift(m(r));else void 0!==t&&e.push(m(t));return e}static _$Eu(t,e){let r=e.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map;for(let e of this.constructor.elementProperties.keys())this.hasOwnProperty(e)&&(t.set(e,this[e]),delete this[e]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{if(d)t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let r of e){let e=document.createElement("style"),o=a.litNonce;void 0!==o&&e.setAttribute("nonce",o),e.textContent=r.cssText,t.appendChild(e)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){let r=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,r);if(void 0!==o&&!0===r.reflect){let i=(r.converter?.toAttribute!==void 0?r.converter:x).toAttribute(e,r.type);this._$Em=t,null==i?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){let r=this.constructor,o=r._$Eh.get(t);if(void 0!==o&&this._$Em!==o){let t=r.getPropertyOptions(o),i="function"==typeof t.converter?{fromAttribute:t.converter}:t.converter?.fromAttribute!==void 0?t.converter:x;this._$Em=o,this[o]=i.fromAttribute(e,t.type)??this._$Ej?.get(o)??null,this._$Em=null}}requestUpdate(t,e,r){if(void 0!==t){let o=this.constructor,i=this[t];if(!(((r??=o.getPropertyOptions(t)).hasChanged??E)(i,e)||r.useDefault&&r.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,r))))return;this.C(t,e,r)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:o,wrapped:i},n){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==i||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),!0===o&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[e,r]of t){let{wrapped:t}=r,o=this[e];!0!==t||this._$AL.has(e)||void 0===o||this.C(e,void 0,r,o)}}let t=!1,e=this._$AL;try{(t=this.shouldUpdate(e))?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}}A.elementStyles=[],A.shadowRootOptions={mode:"open"},A.elementProperties=new Map,A.finalized=new Map,$?.({ReactiveElement:A}),(v.reactiveElementVersions??=[]).push("2.1.0");let C={attribute:!0,type:String,converter:x,reflect:!1,hasChanged:E};function M(t){return(e,r)=>{let o;return"object"==typeof r?((t=C,e,r)=>{let{kind:o,metadata:i}=r,n=globalThis.litPropertyMetadata.get(i);if(void 0===n&&globalThis.litPropertyMetadata.set(i,n=new Map),"setter"===o&&((t=Object.create(t)).wrapped=!0),n.set(r.name,t),"accessor"===o){let{name:o}=r;return{set(r){let i=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,i,t)},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===o){let{name:o}=r;return function(r){let i=this[o];e.call(this,r),this.requestUpdate(o,i,t)}}throw Error("Unsupported decorator location: "+o)})(t,e,r):(o=e.hasOwnProperty(r),e.constructor.createProperty(r,t),o?Object.getOwnPropertyDescriptor(e,r):void 0)}}let U=class t{constructor(){this.initialized=!1}static getInstance(){return t.instance||(t.instance=new t),t.instance}async initialize(){if(!this.initialized)try{await n.extensionManager.initialize(),this.setupUIHooks(),this.initialized=!0}catch{}}setupUIHooks(){(0,n.registerHook)({name:"field-render",priority:1,handler:this.handleFieldRender.bind(this)}),(0,n.registerHook)({name:"field-validate",priority:1,handler:this.handleFieldValidate.bind(this)})}handleFieldRender(t,e){return e}handleFieldValidate(t,e){return{valid:!0,message:""}}async registerUIPlugin(t){await (0,n.registerPlugin)(t)}getExtensionStats(){return n.extensionManager.getStats()}async executeUIHooks(t,e,...r){return n.extensionManager.executeHooks(t,e,...r)}};U.instance=null;let k=U.getInstance(),P=r.css`
  /* ========================================
   * CSS Custom Properties (Design Tokens)
   * ======================================== */
  :host {
    /* Colors - Primary */
    --formdown-bg-primary: var(--theme-bg-primary, #ffffff);
    --formdown-bg-secondary: var(--theme-bg-secondary, #f8fafc);
    --formdown-text-primary: var(--theme-text-primary, #1f2937);
    --formdown-text-secondary: var(--theme-text-secondary, #64748b);
    --formdown-border-color: var(--theme-border, #e2e8f0);
    --formdown-accent-color: var(--theme-accent, #3b82f6);
    --formdown-error-color: var(--theme-error, #ef4444);
    --formdown-success-color: #10b981;
    --formdown-warning-color: #f59e0b;

    /* Typography */
    --formdown-font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --formdown-font-size-base: 1rem;
    --formdown-font-size-sm: 0.875rem;
    --formdown-font-size-xs: 0.75rem;
    --formdown-font-size-lg: 1.125rem;
    --formdown-line-height: 1.5;
    --formdown-font-weight-normal: 400;
    --formdown-font-weight-medium: 500;
    --formdown-font-weight-semibold: 600;
    --formdown-font-weight-bold: 700;

    /* Spacing */
    --formdown-spacing-xs: 0.25rem;
    --formdown-spacing-sm: 0.5rem;
    --formdown-spacing-md: 1rem;
    --formdown-spacing-lg: 1.5rem;
    --formdown-spacing-xl: 2rem;

    /* Transitions */
    --formdown-transition-fast: 0.15s ease-in-out;
    --formdown-transition-normal: 0.2s ease-in-out;

    /* Form Layout */
    --formdown-field-gap: 1.5rem;
    --formdown-label-margin: 0.5rem;

    /* Input Elements */
    --formdown-input-padding: 0.75rem;
    --formdown-input-padding-x: 0.75rem;
    --formdown-input-padding-y: 0.75rem;
    --formdown-input-border-width: 1px;
    --formdown-input-border-radius: 0.5rem;
    --formdown-input-focus-ring-width: 3px;
    --formdown-input-focus-ring-color: rgba(59, 130, 246, 0.1);
    --formdown-input-focus-ring: 0 0 0 var(--formdown-input-focus-ring-width) var(--formdown-input-focus-ring-color);

    /* Buttons */
    --formdown-button-bg: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    --formdown-button-bg-hover: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    --formdown-button-text: #ffffff;
    --formdown-button-border-radius: 0.5rem;
    --formdown-button-padding-x: 1.75rem;
    --formdown-button-padding-y: 0.75rem;
    --formdown-button-font-weight: 600;
    --formdown-button-shadow: 0 2px 4px rgba(59, 130, 246, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
    --formdown-button-shadow-hover: 0 6px 12px rgba(59, 130, 246, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);

    /* Secondary Button */
    --formdown-button-secondary-bg: linear-gradient(135deg, #64748b 0%, #475569 100%);
    --formdown-button-secondary-bg-hover: linear-gradient(135deg, #475569 0%, #334155 100%);

    /* Danger Button */
    --formdown-button-danger-bg: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    --formdown-button-danger-bg-hover: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);

    /* Section/Fieldset */
    --formdown-section-bg: var(--formdown-bg-primary);
    --formdown-section-border-width: 1px;
    --formdown-section-border-color: var(--formdown-border-color);
    --formdown-section-border-radius: 0.5rem;
    --formdown-section-padding: 1.25rem;

    /* Table */
    --formdown-table-bg: var(--formdown-bg-primary);
    --formdown-table-border-color: var(--formdown-border-color);
    --formdown-table-border-width: 1px;
    --formdown-table-border-radius: 6px;
    --formdown-table-cell-padding: 0.5rem 1rem;
    --formdown-table-header-bg: var(--formdown-bg-secondary);
    --formdown-table-header-color: var(--formdown-text-primary);
    --formdown-table-header-weight: 600;
    --formdown-table-row-hover-bg: var(--formdown-bg-secondary);
    --formdown-table-margin: 1rem 0;
    --formdown-table-font-size: 0.875rem;

    /* Code Blocks */
    --formdown-code-bg: var(--formdown-bg-secondary);
    --formdown-code-font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    --formdown-code-font-size: 0.875em;
    --formdown-code-border-radius: 0.375rem;

    /* Host styles */
    display: block;
    font-family: var(--formdown-font-family);
    line-height: var(--formdown-line-height);
    color: var(--formdown-text-primary);
    background: var(--formdown-bg-primary);
    max-width: 100%;
    box-sizing: border-box;
    overflow-y: auto;
  }

  * {
    box-sizing: border-box;
  }

  /* ========================================
   * Form Container
   * ======================================== */
  .formdown-form {
    max-width: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    display: none; /* Hidden form for form attribute reference */
  }

  /* ========================================
   * Field Layout
   * ======================================== */
  .formdown-field {
    margin-bottom: var(--formdown-field-gap);
    max-width: 100%;
  }

  .formdown-field-container {
    margin-bottom: var(--formdown-spacing-md);
  }

  .formdown-field-container:last-child {
    margin-bottom: 0;
  }

  /* ========================================
   * Labels
   * ======================================== */
  label {
    display: block;
    margin-bottom: var(--formdown-label-margin);
    font-weight: var(--formdown-font-weight-medium);
    color: var(--formdown-text-primary);
    font-size: var(--formdown-font-size-sm);
    line-height: 1.25;
  }

  /* ========================================
   * Input Elements
   * ======================================== */
  input, textarea, select {
    width: 100%;
    max-width: 100%;
    padding: var(--formdown-input-padding-y) var(--formdown-input-padding-x);
    border: var(--formdown-input-border-width) solid var(--formdown-border-color);
    border-radius: var(--formdown-input-border-radius);
    font-size: var(--formdown-font-size-base);
    font-family: inherit;
    line-height: var(--formdown-line-height);
    transition: all var(--formdown-transition-fast);
    background-color: var(--formdown-bg-primary);
    color: var(--formdown-text-primary);
  }

  input::placeholder, textarea::placeholder {
    color: var(--formdown-text-secondary);
    font-style: italic;
    opacity: 0.8;
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: var(--formdown-accent-color);
    box-shadow: var(--formdown-input-focus-ring);
    background-color: var(--formdown-bg-primary);
  }

  input:hover, textarea:hover, select:hover {
    border-color: var(--formdown-text-secondary);
  }

  input[type="radio"], input[type="checkbox"] {
    width: auto;
    max-width: none;
    margin-right: var(--formdown-spacing-sm);
    margin-bottom: 0;
  }

  textarea {
    min-height: 6rem;
    resize: vertical;
  }

  select {
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
  }

  /* ========================================
   * Fieldset/Section
   * ======================================== */
  fieldset {
    border: var(--formdown-section-border-width) solid var(--formdown-section-border-color);
    border-radius: var(--formdown-section-border-radius);
    padding: var(--formdown-section-padding);
    margin: 0 0 var(--formdown-field-gap) 0;
    max-width: 100%;
    background-color: var(--formdown-section-bg);
  }

  legend {
    font-weight: var(--formdown-font-weight-semibold);
    color: var(--formdown-text-primary);
    padding: 0 var(--formdown-spacing-md);
    font-size: var(--formdown-font-size-sm);
  }

  fieldset label {
    display: flex;
    align-items: center;
    margin-bottom: var(--formdown-spacing-md);
    font-weight: var(--formdown-font-weight-normal);
    font-size: var(--formdown-font-size-sm);
  }

  /* ========================================
   * Inline Fields (contentEditable)
   * ======================================== */
  formdown-field,
  [contenteditable="true"]:not(textarea) {
    display: inline-block;
    min-width: 60px;
    max-width: 200px;
    font-style: normal;
    color: inherit;
    font-size: inherit;
    line-height: var(--formdown-line-height);
    font-family: inherit;
    font-weight: inherit;
    cursor: text;
    outline: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    box-decoration-break: clone;
  }

  [contenteditable="true"]:not(textarea):empty::before {
    content: attr(data-placeholder);
    color: var(--formdown-text-secondary);
    font-style: italic;
    font-weight: var(--formdown-font-weight-normal);
    opacity: 0.7;
    pointer-events: none;
    user-select: none;
  }

  [contenteditable="true"]:not(textarea) {
    border: 1px solid rgba(209, 213, 219, 0.6);
    background-color: rgba(248, 250, 252, 0.8);
    border-radius: 0.25rem;
    padding: 0.125rem 0.5rem;
    transition: all var(--formdown-transition-normal);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
    position: relative;
    min-height: 1.5em;
  }

  [contenteditable="true"]:not(textarea):hover {
    background-color: rgba(241, 245, 249, 0.9);
    border-color: rgba(156, 163, 175, 0.8);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
  }

  [contenteditable="true"]:not(textarea):focus {
    background-color: var(--formdown-bg-primary);
    border-color: var(--formdown-accent-color);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2), 0 2px 8px rgba(0, 0, 0, 0.15);
    color: var(--formdown-text-primary);
    transform: translateY(-1px);
  }

  [contenteditable="true"]:not(textarea):not(:empty) {
    background-color: var(--formdown-bg-primary);
    border-color: rgba(156, 163, 175, 0.9);
    font-weight: var(--formdown-font-weight-normal);
  }

  /* ========================================
   * Typography (Markdown Content)
   * ======================================== */
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: var(--formdown-spacing-md);
    color: var(--formdown-text-primary);
    font-weight: var(--formdown-font-weight-semibold);
    line-height: 1.25;
  }

  h1 { font-size: 2.25rem; font-weight: var(--formdown-font-weight-bold); }
  h2 { font-size: 1.875rem; }
  h3 { font-size: 1.5rem; }
  h4 { font-size: 1.25rem; }
  h5 { font-size: 1.125rem; }
  h6 { font-size: 1rem; }

  p {
    margin-bottom: var(--formdown-spacing-md);
    line-height: 1.7;
    color: var(--formdown-text-secondary);
  }

  /* ========================================
   * Code Blocks
   * ======================================== */
  pre {
    background-color: var(--formdown-code-bg);
    border: 1px solid var(--formdown-border-color);
    border-radius: var(--formdown-code-border-radius);
    padding: var(--formdown-spacing-md);
    margin: var(--formdown-spacing-md) 0;
    overflow-x: auto;
    font-family: var(--formdown-code-font-family);
    font-size: var(--formdown-font-size-sm);
    line-height: 1.6;
  }

  code {
    font-family: var(--formdown-code-font-family);
    font-size: var(--formdown-code-font-size);
    background-color: rgba(175, 184, 193, 0.2);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    color: var(--formdown-text-primary);
  }

  pre code {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
    font-size: var(--formdown-font-size-sm);
    color: var(--formdown-text-primary);
  }

  .language-javascript, .language-js,
  .language-typescript, .language-ts,
  .language-python, .language-py,
  .language-html, .language-css,
  .language-json, .language-bash {
    display: block;
  }

  /* ========================================
   * Responsive Design
   * ======================================== */
  @media (max-width: 768px) {
    :host {
      font-size: var(--formdown-font-size-sm);
    }

    input, textarea, select {
      padding: 0.625rem;
      font-size: var(--formdown-font-size-sm);
    }

    h1 { font-size: 1.875rem; }
    h2 { font-size: 1.5rem; }
    h3 { font-size: 1.25rem; }
  }

  /* ========================================
   * Validation States
   * ======================================== */
  .error {
    color: var(--formdown-error-color);
    font-size: var(--formdown-font-size-sm);
    margin-top: var(--formdown-spacing-sm);
    display: block;
  }

  .field-error {
    border-color: var(--formdown-error-color) !important;
    box-shadow: 0 0 0 1px rgba(220, 38, 38, 0.1) !important;
  }

  .field-error:focus {
    border-color: var(--formdown-error-color) !important;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
  }

  .validation-error-message {
    color: var(--formdown-error-color);
    font-size: var(--formdown-font-size-xs);
    margin-top: var(--formdown-spacing-xs);
    display: block;
    font-weight: var(--formdown-font-weight-medium);
  }

  .field-valid {
    border-color: var(--formdown-success-color) !important;
    box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.1) !important;
  }

  /* ========================================
   * Buttons - Base Styles
   * ======================================== */
  .submit-button,
  button,
  input[type="submit"],
  input[type="button"],
  input[type="reset"] {
    color: var(--formdown-button-text);
    padding: var(--formdown-button-padding-y) var(--formdown-button-padding-x);
    border: none;
    border-radius: var(--formdown-button-border-radius);
    font-size: var(--formdown-font-size-base);
    font-weight: var(--formdown-button-font-weight);
    cursor: pointer;
    transition: all var(--formdown-transition-normal);
    margin-top: var(--formdown-field-gap);
    width: auto;
    max-width: 100%;
    letter-spacing: 0.025em;
    position: relative;
    overflow: hidden;
    font-family: inherit;
  }

  /* Shine effect */
  .submit-button::before,
  button::before,
  input[type="submit"]::before,
  input[type="button"]::before,
  input[type="reset"]::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease-in-out;
  }

  .submit-button:hover::before,
  button:hover::before,
  input[type="submit"]:hover::before,
  input[type="button"]:hover::before,
  input[type="reset"]:hover::before {
    left: 100%;
  }

  .submit-button:hover,
  button:hover,
  input[type="submit"]:hover,
  input[type="button"]:hover,
  input[type="reset"]:hover {
    transform: translateY(-2px);
  }

  .submit-button:active,
  button:active,
  input[type="submit"]:active,
  input[type="button"]:active,
  input[type="reset"]:active {
    transform: translateY(0);
  }

  .submit-button:disabled,
  button:disabled,
  input[type="submit"]:disabled,
  input[type="button"]:disabled,
  input[type="reset"]:disabled {
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.6;
  }

  .submit-button:disabled::before,
  button:disabled::before,
  input[type="submit"]:disabled::before,
  input[type="button"]:disabled::before,
  input[type="reset"]:disabled::before {
    display: none;
  }

  /* Primary Button (submit) */
  .submit-button,
  button[type="submit"],
  input[type="submit"],
  button:not([type]) {
    background: var(--formdown-button-bg);
    box-shadow: var(--formdown-button-shadow);
  }

  .submit-button:hover,
  button[type="submit"]:hover,
  input[type="submit"]:hover,
  button:not([type]):hover {
    background: var(--formdown-button-bg-hover);
    box-shadow: var(--formdown-button-shadow-hover);
  }

  .submit-button:active,
  button[type="submit"]:active,
  input[type="submit"]:active,
  button:not([type]):active {
    box-shadow: var(--formdown-button-shadow);
  }

  /* Secondary Button */
  button[type="button"],
  input[type="button"] {
    background: var(--formdown-button-secondary-bg);
    box-shadow: 0 2px 4px rgba(100, 116, 139, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  button[type="button"]:hover,
  input[type="button"]:hover {
    background: var(--formdown-button-secondary-bg-hover);
    box-shadow: 0 6px 12px rgba(100, 116, 139, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  button[type="button"]:active,
  input[type="button"]:active {
    box-shadow: 0 2px 4px rgba(100, 116, 139, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  /* Danger Button (reset) */
  button[type="reset"],
  input[type="reset"] {
    background: var(--formdown-button-danger-bg);
    box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  button[type="reset"]:hover,
  input[type="reset"]:hover {
    background: var(--formdown-button-danger-bg-hover);
    box-shadow: 0 6px 12px rgba(239, 68, 68, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  button[type="reset"]:active,
  input[type="reset"]:active {
    box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  /* ========================================
   * Content Container
   * ======================================== */
  #content-container {
    max-width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }

  /* ========================================
   * Radio and Checkbox Groups
   * ======================================== */
  .radio-group, .checkbox-group {
    display: flex;
    gap: var(--formdown-spacing-md);
    flex-wrap: wrap;
  }

  .radio-group.inline, .checkbox-group.inline {
    flex-direction: row;
    align-items: center;
  }

  .radio-group.vertical, .checkbox-group.vertical {
    flex-direction: column;
    align-items: flex-start;
  }

  .formdown-option-label {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    font-weight: var(--formdown-font-weight-normal);
    cursor: pointer;
    font-size: var(--formdown-font-size-sm);
    white-space: nowrap;
  }

  .formdown-option-label input {
    margin-right: var(--formdown-spacing-sm);
    margin-bottom: 0;
  }

  .formdown-option-label span {
    user-select: none;
  }

  .radio-group label, .checkbox-group label {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    font-weight: var(--formdown-font-weight-normal);
    cursor: pointer;
  }

  .formdown-form > * + * {
    margin-top: var(--formdown-spacing-md);
  }

  /* ========================================
   * Table Styles (GitHub Flavored Markdown)
   * ======================================== */
  .formdown-table {
    width: 100%;
    border-collapse: collapse;
    margin: var(--formdown-table-margin);
    background-color: var(--formdown-table-bg);
    border: var(--formdown-table-border-width) solid var(--formdown-table-border-color);
    border-radius: var(--formdown-table-border-radius);
    overflow: hidden;
    font-size: var(--formdown-table-font-size);
  }

  .formdown-table thead {
    background-color: var(--formdown-table-header-bg);
    border-bottom: var(--formdown-table-border-width) solid var(--formdown-table-border-color);
  }

  .formdown-table th {
    padding: var(--formdown-table-cell-padding);
    text-align: left;
    font-weight: var(--formdown-table-header-weight);
    font-size: inherit;
    color: var(--formdown-table-header-color);
    border-right: var(--formdown-table-border-width) solid var(--formdown-table-border-color);
  }

  .formdown-table th:last-child {
    border-right: none;
  }

  .formdown-table td {
    padding: var(--formdown-table-cell-padding);
    border-top: var(--formdown-table-border-width) solid var(--formdown-table-border-color);
    border-right: var(--formdown-table-border-width) solid var(--formdown-table-border-color);
    color: var(--formdown-text-secondary);
    line-height: var(--formdown-line-height);
  }

  .formdown-table td:last-child {
    border-right: none;
  }

  .formdown-table tbody tr {
    transition: background-color var(--formdown-transition-fast);
  }

  .formdown-table tbody tr:hover {
    background-color: var(--formdown-table-row-hover-bg);
  }

  .formdown-table tbody tr:last-child td {
    border-bottom: none;
  }

  .formdown-table td [contenteditable="true"] {
    min-width: 80px;
    max-width: 100%;
    display: inline-block;
  }

  @media (max-width: 768px) {
    .formdown-table {
      font-size: 0.8125rem;
      border-radius: 4px;
    }

    .formdown-table th,
    .formdown-table td {
      padding: 0.375rem 0.75rem;
    }
  }
`;var T=Object.defineProperty,z=Object.getOwnPropertyDescriptor,O=(t,e,r,o)=>{for(var i,n=o>1?void 0:o?z(e,r):e,s=t.length-1;s>=0;s--)(i=t[s])&&(n=(o?i(e,r,n):i(n))||n);return o&&n&&T(e,r,n),n};let R=class extends o.LitElement{constructor(){super(),this.content="",this.selectOnFocus=!0,this.formId="",this.showSubmitButton=!0,this.submitText="Submit",this._data={},this.fieldRegistry=new Map,this._isUpdatingUI=!1,this._schema=null,this.formManager=new s.FormManager,this.domBinder=this.formManager.createDOMBinder(),this.setupCoreUIBridge(),this.setupFormManagerEvents()}get data(){return this._data}set data(t){if(this._isUpdatingUI)return;let e=this._data;this._data=null!=t&&"object"==typeof t?{...t}:{},this.requestUpdate("data",e),this.formManager&&this._schema&&!this._isUpdatingUI&&this.formManager.updateData(this._data)}updateData(t){this.data=t,this.formManager&&this._schema&&this.formManager.updateData(t)}updateField(t,e){this.data={...this.data,[t]:e},this.formManager&&this._schema&&this.formManager.setFieldValue(t,e)}setupCoreUIBridge(){this.formManager.setupComponentBridge({id:"formdown-ui",type:"ui",emit:(t,e)=>this.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0})),on:(t,e)=>()=>{}})}setupFormManagerEvents(){this.formManager.on("data-change",({formData:t})=>{this._isUpdatingUI||(this._isUpdatingUI=!0,this.data=t,this._isUpdatingUI=!1)}),this.formManager.on("validation-error",({field:t,errors:e})=>{this.dispatchEvent(new CustomEvent("validation-error",{detail:{field:t,errors:e},bubbles:!0}))}),this.formManager.on("form-submit",({formData:t})=>{this.dispatchEvent(new CustomEvent("form-submit",{detail:{formData:t},bubbles:!0}))})}validate(){return this.formManager&&this._schema?this.formManager.validate():{isValid:!0,errors:[]}}getSchema(){return this._schema}reset(){this.formManager&&this._schema&&(this.formManager.reset(),this.data=this.formManager.getData())}isDirty(){return!!this.formManager&&!!this._schema&&this.formManager.isDirty()}async connectedCallback(){super.connectedCallback();try{await k.initialize()}catch{}!this.content&&this.textContent?.trim()&&(this.content=this.textContent.trim(),this.textContent="")}render(){if(!this.content||!this.content.trim())return i.html`<div class="error">No Formdown content provided</div>`;try{this.formManager.parse(this.content),this._schema=this.formManager.getSchema(),this.data&&Object.keys(this.data).length>0&&this.formManager.updateData(this.data);let t=this.formManager.renderToTemplate({container:this});return t.html&&t.html.trim()?i.html`<div id="content-container"></div>`:i.html`<div class="error">Generated HTML is empty</div>`}catch(e){let t=e instanceof Error?e.message:String(e);return i.html`<div class="error">Error rendering content: ${t}</div>`}}firstUpdated(){this.updateContent(),setTimeout(()=>{this.syncUIFromData()},0)}updated(t){super.updated(t),t.has("content")&&(this.updateContent(),setTimeout(()=>{this.syncUIFromData()},0)),t.has("data")&&this.syncUIFromData()}updateContent(){if(!(!this.content||!this.content.trim()))try{let t=this.shadowRoot?.querySelector("#content-container");if(!t)return;this.formManager.parse(this.content),this._schema=this.formManager.getSchema(),this.data&&Object.keys(this.data).length>0&&this.formManager.updateData(this.data);let e=this.formManager.renderToTemplate({container:this});if(!e.html||""===e.html.trim()){t.innerHTML='<div class="error">FormManager returned empty HTML</div>';return}t.innerHTML=e.html,this.injectExtensionAssets(t),this.setupFieldHandlers(t)}catch(e){let t=this.shadowRoot?.querySelector("#content-container");if(t){let r=e instanceof Error?e.message:String(e);t.innerHTML=`<div class="error">Error: ${r}</div>`}}}injectExtensionAssets(t){try{let e=new Set;t.querySelectorAll("[data-field-type]").forEach(t=>{let r=t.getAttribute("data-field-type");r&&e.add(r)})}catch{}}setupFieldHandlers(t){this.fieldRegistry.clear(),t.querySelectorAll('input, textarea, select, [contenteditable="true"]').forEach(t=>{let e=this.getFieldName(t);e&&(this.registerField(e,t),this.setupFieldEventHandlers(t,e))});let e=t.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), [contenteditable="true"]');this.setupBasicKeyboardNavigation(e)}setupBasicKeyboardNavigation(t){t.forEach((e,r)=>{e.addEventListener("keydown",o=>{if("Enter"===o.key&&"textarea"!==e.tagName.toLowerCase()){o.preventDefault();let e=r+1;e<t.length&&t[e].focus()}})})}setupFieldEventHandlers(t,e){this.domBinder.bindFieldToElement(e,t);let r=r=>{this.formManager.handleUIEvent(r,this.domBinder);let o=this.getFieldValueFromElement(t);this.updateDataReactively(e,o)};t.addEventListener("input",r),t.addEventListener("change",r),t.addEventListener("focus",t=>{let e=t.target;e.hasAttribute("contenteditable")&&setTimeout(()=>{let t=document.createRange(),r=window.getSelection();r&&e.textContent&&(t.selectNodeContents(e),r.removeAllRanges(),r.addRange(t))},0),e instanceof HTMLInputElement&&"file"!==e.type&&"checkbox"!==e.type&&"radio"!==e.type&&setTimeout(()=>{e.select()},0)}),t.hasAttribute("contenteditable")&&t.addEventListener("blur",r)}updateDataReactively(t,e,r){this._isUpdatingUI||(this.formManager.setFieldValue(t,e),this.data={...this.data,[t]:e},this.emitFieldEvents(t,e))}syncUIFromData(){if(!this._isUpdatingUI){this._isUpdatingUI=!0;try{let t=this.shadowRoot?.activeElement;this.domBinder.getValueAssignments(this.data).forEach(({element:e,value:r,fieldType:o})=>{e!==t&&this.applyValueToElement(e,r,o)})}finally{this._isUpdatingUI=!1,this.domBinder.releaseSyncLock()}}}applyValueToElement(t,e,r){t instanceof HTMLInputElement?"checkbox"===r?"boolean"==typeof e?t.checked=e:Array.isArray(e)&&(t.checked=e.includes(t.value)):"radio"===r?t.checked=t.value===String(e):t.value=String(e??""):t instanceof HTMLTextAreaElement||t instanceof HTMLSelectElement?t.value=String(e??""):t.hasAttribute("contenteditable")&&(t.textContent=String(e??""))}getFieldName(t){return t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||t instanceof HTMLSelectElement?t.name||t.id||null:t.dataset.fieldName||t.id||null}getFieldValueFromElement(t){if(t instanceof HTMLInputElement){if("checkbox"===t.type){let e=t.name,r=this.formManager.createFieldProcessor().processCheckboxGroup(e,{querySelector:t=>this.shadowRoot?.querySelector(t),querySelectorAll:t=>Array.from(this.shadowRoot?.querySelectorAll(t)||[])});return r.success?r.value:t.checked}return t.type,t.value}return t instanceof HTMLTextAreaElement||t instanceof HTMLSelectElement?t.value:t.hasAttribute("contenteditable")&&t.textContent?.trim()||""}registerField(t,e){this.fieldRegistry.has(t)||this.fieldRegistry.set(t,new Set),this.fieldRegistry.get(t).add(e)}emitFieldEvents(t,e){let r=this.getFormData();this.dispatchEvent(new CustomEvent("formdown-change",{detail:{fieldName:t,value:e,formData:r},bubbles:!0})),this.dispatchEvent(new CustomEvent("formdown-data-update",{detail:{formData:r},bubbles:!0}))}syncFieldValue(t,e){this.formManager.setFieldValue(t,e),this.data=this.formManager.getData(),this.emitFieldEvents(t,e)}updateFormData(t,e){this.formManager.setFieldValue(t,e),this.data=this.formManager.getData(),this.emitFieldEvents(t,e)}getFormData(){return this.formManager.getData()}getDefaultValues(){return this.formManager.getDefaultValues()}clearValidationStates(){let t=this.shadowRoot?.querySelector("#content-container");t&&(t.querySelectorAll(".field-error, .field-valid").forEach(t=>{t.classList.remove("field-error","field-valid")}),t.querySelectorAll(".validation-error-message").forEach(t=>t.remove()))}resetForm(){this.formManager.reset(),this.data=this.formManager.getData(),this.clearValidationStates()}setFormData(t){if(!this.formManager)return;let e=this.shadowRoot?.querySelector("#content-container");e&&(Object.entries(t).forEach(([t,r])=>{let o=e.querySelector(`[name="${t}"]`);o||(o=e.querySelector(`[data-field-name="${t}"]`)),o||(o=e.querySelector(`#${t}`)),o&&(o.hasAttribute("contenteditable")?o.textContent=String(r||""):o instanceof HTMLInputElement?"checkbox"===o.type||"radio"===o.type?o.checked=!!r:o.value=String(r||""):(o instanceof HTMLTextAreaElement||o instanceof HTMLSelectElement)&&(o.value=String(r||"")),o.dispatchEvent(new Event("input",{bubbles:!0})))}),this.data={...t})}};R.styles=P,O([M()],R.prototype,"content",2),O([M({type:Boolean,attribute:"select-on-focus"})],R.prototype,"selectOnFocus",2),O([M({attribute:"form-id"})],R.prototype,"formId",2),O([M({type:Boolean,attribute:"show-submit-button"})],R.prototype,"showSubmitButton",2),O([M({attribute:"submit-text"})],R.prototype,"submitText",2),O([M({type:Object})],R.prototype,"data",1),R=O([(e="formdown-ui",(t,r)=>{void 0!==r?r.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)})],R);let H=(t,e={})=>{let r=document.createElement("formdown-ui");return e.content&&(r.content=e.content),e.formId&&(r.formId=e.formId),void 0!==e.showSubmitButton&&(r.showSubmitButton=e.showSubmitButton),e.submitText&&(r.submitText=e.submitText),t.appendChild(r),r},D=()=>{};t.s(["FormdownUI",()=>R,"UIExtensionSupport",()=>U,"createFormdownUI",()=>H,"registerFormdownUI",()=>D,"uiExtensionSupport",()=>k])}]);