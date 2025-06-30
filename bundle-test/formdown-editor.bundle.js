var FormdownEditor = function (exports) {
  "use strict"; var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  /**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var _a, _b, _c;
  const t$7 = globalThis, e$b = t$7.ShadowRoot && (void 0 === t$7.ShadyCSS || t$7.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s$5 = Symbol(), o$d = /* @__PURE__ */ new WeakMap();
  let n$b = class n {
    constructor(t2, e2, o2) {
      if (this._$cssResult$ = true, o2 !== s$5) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t2, this.t = e2;
    }
    get styleSheet() {
      let t2 = this.o;
      const s2 = this.t;
      if (e$b && void 0 === t2) {
        const e2 = void 0 !== s2 && 1 === s2.length;
        e2 && (t2 = o$d.get(s2)), void 0 === t2 && ((this.o = t2 = new CSSStyleSheet()).replaceSync(this.cssText), e2 && o$d.set(s2, t2));
      }
      return t2;
    }
    toString() {
      return this.cssText;
    }
  };
  const r$d = (t2) => new n$b("string" == typeof t2 ? t2 : t2 + "", void 0, s$5), i$7 = (t2, ...e2) => {
    const o2 = 1 === t2.length ? t2[0] : e2.reduce((e3, s2, o3) => e3 + ((t3) => {
      if (true === t3._$cssResult$) return t3.cssText;
      if ("number" == typeof t3) return t3;
      throw Error("Value passed to 'css' function must be a 'css' function result: " + t3 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
    })(s2) + t2[o3 + 1], t2[0]);
    return new n$b(o2, t2, s$5);
  }, S$3 = (s2, o2) => {
    if (e$b) s2.adoptedStyleSheets = o2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet);
    else for (const e2 of o2) {
      const o3 = document.createElement("style"), n2 = t$7.litNonce;
      void 0 !== n2 && o3.setAttribute("nonce", n2), o3.textContent = e2.cssText, s2.appendChild(o3);
    }
  }, c$5 = e$b ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
    let e2 = "";
    for (const s2 of t3.cssRules) e2 += s2.cssText;
    return r$d(e2);
  })(t2) : t2;
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const { is: i$6, defineProperty: e$a, getOwnPropertyDescriptor: h$3, getOwnPropertyNames: r$c, getOwnPropertySymbols: o$c, getPrototypeOf: n$a } = Object, a$3 = globalThis, c$4 = a$3.trustedTypes, l$3 = c$4 ? c$4.emptyScript : "", p$3 = a$3.reactiveElementPolyfillSupport, d$3 = (t2, s2) => t2, u$3 = {
    toAttribute(t2, s2) {
      switch (s2) {
        case Boolean:
          t2 = t2 ? l$3 : null;
          break;
        case Object:
        case Array:
          t2 = null == t2 ? t2 : JSON.stringify(t2);
      }
      return t2;
    }, fromAttribute(t2, s2) {
      let i2 = t2;
      switch (s2) {
        case Boolean:
          i2 = null !== t2;
          break;
        case Number:
          i2 = null === t2 ? null : Number(t2);
          break;
        case Object:
        case Array:
          try {
            i2 = JSON.parse(t2);
          } catch (t3) {
            i2 = null;
          }
      }
      return i2;
    }
  }, f$3 = (t2, s2) => !i$6(t2, s2), b$3 = { attribute: true, type: String, converter: u$3, reflect: false, useDefault: false, hasChanged: f$3 };
  Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a$3.litPropertyMetadata ?? (a$3.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
  let y$3 = class y extends HTMLElement {
    static addInitializer(t2) {
      this._$Ei(), (this.l ?? (this.l = [])).push(t2);
    }
    static get observedAttributes() {
      return this.finalize(), this._$Eh && [...this._$Eh.keys()];
    }
    static createProperty(t2, s2 = b$3) {
      if (s2.state && (s2.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t2) && ((s2 = Object.create(s2)).wrapped = true), this.elementProperties.set(t2, s2), !s2.noAccessor) {
        const i2 = Symbol(), h2 = this.getPropertyDescriptor(t2, i2, s2);
        void 0 !== h2 && e$a(this.prototype, t2, h2);
      }
    }
    static getPropertyDescriptor(t2, s2, i2) {
      const { get: e2, set: r2 } = h$3(this.prototype, t2) ?? {
        get() {
          return this[s2];
        }, set(t3) {
          this[s2] = t3;
        }
      };
      return {
        get: e2, set(s3) {
          const h2 = e2 == null ? void 0 : e2.call(this);
          r2 == null ? void 0 : r2.call(this, s3), this.requestUpdate(t2, h2, i2);
        }, configurable: true, enumerable: true
      };
    }
    static getPropertyOptions(t2) {
      return this.elementProperties.get(t2) ?? b$3;
    }
    static _$Ei() {
      if (this.hasOwnProperty(d$3("elementProperties"))) return;
      const t2 = n$a(this);
      t2.finalize(), void 0 !== t2.l && (this.l = [...t2.l]), this.elementProperties = new Map(t2.elementProperties);
    }
    static finalize() {
      if (this.hasOwnProperty(d$3("finalized"))) return;
      if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d$3("properties"))) {
        const t3 = this.properties, s2 = [...r$c(t3), ...o$c(t3)];
        for (const i2 of s2) this.createProperty(i2, t3[i2]);
      }
      const t2 = this[Symbol.metadata];
      if (null !== t2) {
        const s2 = litPropertyMetadata.get(t2);
        if (void 0 !== s2) for (const [t3, i2] of s2) this.elementProperties.set(t3, i2);
      }
      this._$Eh = /* @__PURE__ */ new Map();
      for (const [t3, s2] of this.elementProperties) {
        const i2 = this._$Eu(t3, s2);
        void 0 !== i2 && this._$Eh.set(i2, t3);
      }
      this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(s2) {
      const i2 = [];
      if (Array.isArray(s2)) {
        const e2 = new Set(s2.flat(1 / 0).reverse());
        for (const s3 of e2) i2.unshift(c$5(s3));
      } else void 0 !== s2 && i2.push(c$5(s2));
      return i2;
    }
    static _$Eu(t2, s2) {
      const i2 = s2.attribute;
      return false === i2 ? void 0 : "string" == typeof i2 ? i2 : "string" == typeof t2 ? t2.toLowerCase() : void 0;
    }
    constructor() {
      super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
    }
    _$Ev() {
      var _a2;
      this._$ES = new Promise((t2) => this.enableUpdating = t2), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (_a2 = this.constructor.l) == null ? void 0 : _a2.forEach((t2) => t2(this));
    }
    addController(t2) {
      var _a2;
      (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t2), void 0 !== this.renderRoot && this.isConnected && ((_a2 = t2.hostConnected) == null ? void 0 : _a2.call(t2));
    }
    removeController(t2) {
      var _a2;
      (_a2 = this._$EO) == null ? void 0 : _a2.delete(t2);
    }
    _$E_() {
      const t2 = /* @__PURE__ */ new Map(), s2 = this.constructor.elementProperties;
      for (const i2 of s2.keys()) this.hasOwnProperty(i2) && (t2.set(i2, this[i2]), delete this[i2]);
      t2.size > 0 && (this._$Ep = t2);
    }
    createRenderRoot() {
      const t2 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
      return S$3(t2, this.constructor.elementStyles), t2;
    }
    connectedCallback() {
      var _a2;
      this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
        var _a3;
        return (_a3 = t2.hostConnected) == null ? void 0 : _a3.call(t2);
      });
    }
    enableUpdating(t2) {
    }
    disconnectedCallback() {
      var _a2;
      (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
        var _a3;
        return (_a3 = t2.hostDisconnected) == null ? void 0 : _a3.call(t2);
      });
    }
    attributeChangedCallback(t2, s2, i2) {
      this._$AK(t2, i2);
    }
    _$ET(t2, s2) {
      var _a2;
      const i2 = this.constructor.elementProperties.get(t2), e2 = this.constructor._$Eu(t2, i2);
      if (void 0 !== e2 && true === i2.reflect) {
        const h2 = (void 0 !== ((_a2 = i2.converter) == null ? void 0 : _a2.toAttribute) ? i2.converter : u$3).toAttribute(s2, i2.type);
        this._$Em = t2, null == h2 ? this.removeAttribute(e2) : this.setAttribute(e2, h2), this._$Em = null;
      }
    }
    _$AK(t2, s2) {
      var _a2, _b2;
      const i2 = this.constructor, e2 = i2._$Eh.get(t2);
      if (void 0 !== e2 && this._$Em !== e2) {
        const t3 = i2.getPropertyOptions(e2), h2 = "function" == typeof t3.converter ? { fromAttribute: t3.converter } : void 0 !== ((_a2 = t3.converter) == null ? void 0 : _a2.fromAttribute) ? t3.converter : u$3;
        this._$Em = e2, this[e2] = h2.fromAttribute(s2, t3.type) ?? ((_b2 = this._$Ej) == null ? void 0 : _b2.get(e2)) ?? null, this._$Em = null;
      }
    }
    requestUpdate(t2, s2, i2) {
      var _a2;
      if (void 0 !== t2) {
        const e2 = this.constructor, h2 = this[t2];
        if (i2 ?? (i2 = e2.getPropertyOptions(t2)), !((i2.hasChanged ?? f$3)(h2, s2) || i2.useDefault && i2.reflect && h2 === ((_a2 = this._$Ej) == null ? void 0 : _a2.get(t2)) && !this.hasAttribute(e2._$Eu(t2, i2)))) return;
        this.C(t2, s2, i2);
      }
      false === this.isUpdatePending && (this._$ES = this._$EP());
    }
    C(t2, s2, { useDefault: i2, reflect: e2, wrapped: h2 }, r2) {
      i2 && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t2) && (this._$Ej.set(t2, r2 ?? s2 ?? this[t2]), true !== h2 || void 0 !== r2) || (this._$AL.has(t2) || (this.hasUpdated || i2 || (s2 = void 0), this._$AL.set(t2, s2)), true === e2 && this._$Em !== t2 && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t2));
    }
    async _$EP() {
      this.isUpdatePending = true;
      try {
        await this._$ES;
      } catch (t3) {
        Promise.reject(t3);
      }
      const t2 = this.scheduleUpdate();
      return null != t2 && await t2, !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      var _a2;
      if (!this.isUpdatePending) return;
      if (!this.hasUpdated) {
        if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
          for (const [t4, s3] of this._$Ep) this[t4] = s3;
          this._$Ep = void 0;
        }
        const t3 = this.constructor.elementProperties;
        if (t3.size > 0) for (const [s3, i2] of t3) {
          const { wrapped: t4 } = i2, e2 = this[s3];
          true !== t4 || this._$AL.has(s3) || void 0 === e2 || this.C(s3, void 0, i2, e2);
        }
      }
      let t2 = false;
      const s2 = this._$AL;
      try {
        t2 = this.shouldUpdate(s2), t2 ? (this.willUpdate(s2), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
          var _a3;
          return (_a3 = t3.hostUpdate) == null ? void 0 : _a3.call(t3);
        }), this.update(s2)) : this._$EM();
      } catch (s3) {
        throw t2 = false, this._$EM(), s3;
      }
      t2 && this._$AE(s2);
    }
    willUpdate(t2) {
    }
    _$AE(t2) {
      var _a2;
      (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
        var _a3;
        return (_a3 = t3.hostUpdated) == null ? void 0 : _a3.call(t3);
      }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t2)), this.updated(t2);
    }
    _$EM() {
      this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this._$ES;
    }
    shouldUpdate(t2) {
      return true;
    }
    update(t2) {
      this._$Eq && (this._$Eq = this._$Eq.forEach((t3) => this._$ET(t3, this[t3]))), this._$EM();
    }
    updated(t2) {
    }
    firstUpdated(t2) {
    }
  };
  y$3.elementStyles = [], y$3.shadowRootOptions = { mode: "open" }, y$3[d$3("elementProperties")] = /* @__PURE__ */ new Map(), y$3[d$3("finalized")] = /* @__PURE__ */ new Map(), p$3 == null ? void 0 : p$3({ ReactiveElement: y$3 }), (a$3.reactiveElementVersions ?? (a$3.reactiveElementVersions = [])).push("2.1.0");
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const t$6 = globalThis, i$5 = t$6.trustedTypes, s$4 = i$5 ? i$5.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0, e$9 = "$lit$", h$2 = `lit$${Math.random().toFixed(9).slice(2)}$`, o$b = "?" + h$2, n$9 = `<${o$b}>`, r$b = document, l$2 = () => r$b.createComment(""), c$3 = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2, a$2 = Array.isArray, u$2 = (t2) => a$2(t2) || "function" == typeof (t2 == null ? void 0 : t2[Symbol.iterator]), d$2 = "[ 	\n\f\r]", f$2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, v$1 = /-->/g, _$1 = />/g, m$1 = RegExp(`>|${d$2}(?:([^\\s"'>=/]+)(${d$2}*=${d$2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), p$2 = /'/g, g$1 = /"/g, $$1 = /^(?:script|style|textarea|title)$/i, y$2 = (t2) => (i2, ...s2) => ({ _$litType$: t2, strings: i2, values: s2 }), x$1 = y$2(1), b$2 = y$2(2), w$1 = y$2(3), T$1 = Symbol.for("lit-noChange"), E$1 = Symbol.for("lit-nothing"), A$1 = /* @__PURE__ */ new WeakMap(), C$1 = r$b.createTreeWalker(r$b, 129);
  function P$1(t2, i2) {
    if (!a$2(t2) || !t2.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== s$4 ? s$4.createHTML(i2) : i2;
  }
  const V$1 = (t2, i2) => {
    const s2 = t2.length - 1, o2 = [];
    let r2, l2 = 2 === i2 ? "<svg>" : 3 === i2 ? "<math>" : "", c2 = f$2;
    for (let i3 = 0; i3 < s2; i3++) {
      const s3 = t2[i3];
      let a2, u2, d2 = -1, y2 = 0;
      for (; y2 < s3.length && (c2.lastIndex = y2, u2 = c2.exec(s3), null !== u2);) y2 = c2.lastIndex, c2 === f$2 ? "!--" === u2[1] ? c2 = v$1 : void 0 !== u2[1] ? c2 = _$1 : void 0 !== u2[2] ? ($$1.test(u2[2]) && (r2 = RegExp("</" + u2[2], "g")), c2 = m$1) : void 0 !== u2[3] && (c2 = m$1) : c2 === m$1 ? ">" === u2[0] ? (c2 = r2 ?? f$2, d2 = -1) : void 0 === u2[1] ? d2 = -2 : (d2 = c2.lastIndex - u2[2].length, a2 = u2[1], c2 = void 0 === u2[3] ? m$1 : '"' === u2[3] ? g$1 : p$2) : c2 === g$1 || c2 === p$2 ? c2 = m$1 : c2 === v$1 || c2 === _$1 ? c2 = f$2 : (c2 = m$1, r2 = void 0);
      const x2 = c2 === m$1 && t2[i3 + 1].startsWith("/>") ? " " : "";
      l2 += c2 === f$2 ? s3 + n$9 : d2 >= 0 ? (o2.push(a2), s3.slice(0, d2) + e$9 + s3.slice(d2) + h$2 + x2) : s3 + h$2 + (-2 === d2 ? i3 : x2);
    }
    return [P$1(t2, l2 + (t2[s2] || "<?>") + (2 === i2 ? "</svg>" : 3 === i2 ? "</math>" : "")), o2];
  };
  let N$1 = class N2 {
    constructor({ strings: t2, _$litType$: s2 }, n2) {
      let r2;
      this.parts = [];
      let c2 = 0, a2 = 0;
      const u2 = t2.length - 1, d2 = this.parts, [f2, v2] = V$1(t2, s2);
      if (this.el = N2.createElement(f2, n2), C$1.currentNode = this.el.content, 2 === s2 || 3 === s2) {
        const t3 = this.el.content.firstChild;
        t3.replaceWith(...t3.childNodes);
      }
      for (; null !== (r2 = C$1.nextNode()) && d2.length < u2;) {
        if (1 === r2.nodeType) {
          if (r2.hasAttributes()) for (const t3 of r2.getAttributeNames()) if (t3.endsWith(e$9)) {
            const i2 = v2[a2++], s3 = r2.getAttribute(t3).split(h$2), e2 = /([.?@])?(.*)/.exec(i2);
            d2.push({ type: 1, index: c2, name: e2[2], strings: s3, ctor: "." === e2[1] ? H$1 : "?" === e2[1] ? I$1 : "@" === e2[1] ? L$1 : k$1 }), r2.removeAttribute(t3);
          } else t3.startsWith(h$2) && (d2.push({ type: 6, index: c2 }), r2.removeAttribute(t3));
          if ($$1.test(r2.tagName)) {
            const t3 = r2.textContent.split(h$2), s3 = t3.length - 1;
            if (s3 > 0) {
              r2.textContent = i$5 ? i$5.emptyScript : "";
              for (let i2 = 0; i2 < s3; i2++) r2.append(t3[i2], l$2()), C$1.nextNode(), d2.push({ type: 2, index: ++c2 });
              r2.append(t3[s3], l$2());
            }
          }
        } else if (8 === r2.nodeType) if (r2.data === o$b) d2.push({ type: 2, index: c2 });
        else {
          let t3 = -1;
          for (; -1 !== (t3 = r2.data.indexOf(h$2, t3 + 1));) d2.push({ type: 7, index: c2 }), t3 += h$2.length - 1;
        }
        c2++;
      }
    }
    static createElement(t2, i2) {
      const s2 = r$b.createElement("template");
      return s2.innerHTML = t2, s2;
    }
  };
  function S$2(t2, i2, s2 = t2, e2) {
    var _a2, _b2;
    if (i2 === T$1) return i2;
    let h2 = void 0 !== e2 ? (_a2 = s2._$Co) == null ? void 0 : _a2[e2] : s2._$Cl;
    const o2 = c$3(i2) ? void 0 : i2._$litDirective$;
    return (h2 == null ? void 0 : h2.constructor) !== o2 && ((_b2 = h2 == null ? void 0 : h2._$AO) == null ? void 0 : _b2.call(h2, false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s2, e2)), void 0 !== e2 ? (s2._$Co ?? (s2._$Co = []))[e2] = h2 : s2._$Cl = h2), void 0 !== h2 && (i2 = S$2(t2, h2._$AS(t2, i2.values), h2, e2)), i2;
  }
  let M$1 = class M {
    constructor(t2, i2) {
      this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i2;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t2) {
      const { el: { content: i2 }, parts: s2 } = this._$AD, e2 = ((t2 == null ? void 0 : t2.creationScope) ?? r$b).importNode(i2, true);
      C$1.currentNode = e2;
      let h2 = C$1.nextNode(), o2 = 0, n2 = 0, l2 = s2[0];
      for (; void 0 !== l2;) {
        if (o2 === l2.index) {
          let i3;
          2 === l2.type ? i3 = new R$1(h2, h2.nextSibling, this, t2) : 1 === l2.type ? i3 = new l2.ctor(h2, l2.name, l2.strings, this, t2) : 6 === l2.type && (i3 = new z$1(h2, this, t2)), this._$AV.push(i3), l2 = s2[++n2];
        }
        o2 !== (l2 == null ? void 0 : l2.index) && (h2 = C$1.nextNode(), o2++);
      }
      return C$1.currentNode = r$b, e2;
    }
    p(t2) {
      let i2 = 0;
      for (const s2 of this._$AV) void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i2), i2 += s2.strings.length - 2) : s2._$AI(t2[i2])), i2++;
    }
  };
  let R$1 = class R2 {
    get _$AU() {
      var _a2;
      return ((_a2 = this._$AM) == null ? void 0 : _a2._$AU) ?? this._$Cv;
    }
    constructor(t2, i2, s2, e2) {
      this.type = 2, this._$AH = E$1, this._$AN = void 0, this._$AA = t2, this._$AB = i2, this._$AM = s2, this.options = e2, this._$Cv = (e2 == null ? void 0 : e2.isConnected) ?? true;
    }
    get parentNode() {
      let t2 = this._$AA.parentNode;
      const i2 = this._$AM;
      return void 0 !== i2 && 11 === (t2 == null ? void 0 : t2.nodeType) && (t2 = i2.parentNode), t2;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t2, i2 = this) {
      t2 = S$2(this, t2, i2), c$3(t2) ? t2 === E$1 || null == t2 || "" === t2 ? (this._$AH !== E$1 && this._$AR(), this._$AH = E$1) : t2 !== this._$AH && t2 !== T$1 && this._(t2) : void 0 !== t2._$litType$ ? this.$(t2) : void 0 !== t2.nodeType ? this.T(t2) : u$2(t2) ? this.k(t2) : this._(t2);
    }
    O(t2) {
      return this._$AA.parentNode.insertBefore(t2, this._$AB);
    }
    T(t2) {
      this._$AH !== t2 && (this._$AR(), this._$AH = this.O(t2));
    }
    _(t2) {
      this._$AH !== E$1 && c$3(this._$AH) ? this._$AA.nextSibling.data = t2 : this.T(r$b.createTextNode(t2)), this._$AH = t2;
    }
    $(t2) {
      var _a2;
      const { values: i2, _$litType$: s2 } = t2, e2 = "number" == typeof s2 ? this._$AC(t2) : (void 0 === s2.el && (s2.el = N$1.createElement(P$1(s2.h, s2.h[0]), this.options)), s2);
      if (((_a2 = this._$AH) == null ? void 0 : _a2._$AD) === e2) this._$AH.p(i2);
      else {
        const t3 = new M$1(e2, this), s3 = t3.u(this.options);
        t3.p(i2), this.T(s3), this._$AH = t3;
      }
    }
    _$AC(t2) {
      let i2 = A$1.get(t2.strings);
      return void 0 === i2 && A$1.set(t2.strings, i2 = new N$1(t2)), i2;
    }
    k(t2) {
      a$2(this._$AH) || (this._$AH = [], this._$AR());
      const i2 = this._$AH;
      let s2, e2 = 0;
      for (const h2 of t2) e2 === i2.length ? i2.push(s2 = new R2(this.O(l$2()), this.O(l$2()), this, this.options)) : s2 = i2[e2], s2._$AI(h2), e2++;
      e2 < i2.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i2.length = e2);
    }
    _$AR(t2 = this._$AA.nextSibling, i2) {
      var _a2;
      for ((_a2 = this._$AP) == null ? void 0 : _a2.call(this, false, true, i2); t2 && t2 !== this._$AB;) {
        const i3 = t2.nextSibling;
        t2.remove(), t2 = i3;
      }
    }
    setConnected(t2) {
      var _a2;
      void 0 === this._$AM && (this._$Cv = t2, (_a2 = this._$AP) == null ? void 0 : _a2.call(this, t2));
    }
  };
  let k$1 = class k {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t2, i2, s2, e2, h2) {
      this.type = 1, this._$AH = E$1, this._$AN = void 0, this.element = t2, this.name = i2, this._$AM = e2, this.options = h2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = E$1;
    }
    _$AI(t2, i2 = this, s2, e2) {
      const h2 = this.strings;
      let o2 = false;
      if (void 0 === h2) t2 = S$2(this, t2, i2, 0), o2 = !c$3(t2) || t2 !== this._$AH && t2 !== T$1, o2 && (this._$AH = t2);
      else {
        const e3 = t2;
        let n2, r2;
        for (t2 = h2[0], n2 = 0; n2 < h2.length - 1; n2++) r2 = S$2(this, e3[s2 + n2], i2, n2), r2 === T$1 && (r2 = this._$AH[n2]), o2 || (o2 = !c$3(r2) || r2 !== this._$AH[n2]), r2 === E$1 ? t2 = E$1 : t2 !== E$1 && (t2 += (r2 ?? "") + h2[n2 + 1]), this._$AH[n2] = r2;
      }
      o2 && !e2 && this.j(t2);
    }
    j(t2) {
      t2 === E$1 ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 ?? "");
    }
  };
  let H$1 = class H extends k$1 {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t2) {
      this.element[this.name] = t2 === E$1 ? void 0 : t2;
    }
  };
  let I$1 = class I extends k$1 {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t2) {
      this.element.toggleAttribute(this.name, !!t2 && t2 !== E$1);
    }
  };
  let L$1 = class L extends k$1 {
    constructor(t2, i2, s2, e2, h2) {
      super(t2, i2, s2, e2, h2), this.type = 5;
    }
    _$AI(t2, i2 = this) {
      if ((t2 = S$2(this, t2, i2, 0) ?? E$1) === T$1) return;
      const s2 = this._$AH, e2 = t2 === E$1 && s2 !== E$1 || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, h2 = t2 !== E$1 && (s2 === E$1 || e2);
      e2 && this.element.removeEventListener(this.name, this, s2), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
    }
    handleEvent(t2) {
      var _a2;
      "function" == typeof this._$AH ? this._$AH.call(((_a2 = this.options) == null ? void 0 : _a2.host) ?? this.element, t2) : this._$AH.handleEvent(t2);
    }
  };
  let z$1 = class z {
    constructor(t2, i2, s2) {
      this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i2, this.options = s2;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t2) {
      S$2(this, t2);
    }
  };
  const Z$1 = { M: e$9, P: h$2, A: o$b, C: 1, L: V$1, R: M$1, D: u$2, V: S$2, I: R$1, H: k$1, N: I$1, U: L$1, B: H$1, F: z$1 }, j$1 = t$6.litHtmlPolyfillSupport;
  j$1 == null ? void 0 : j$1(N$1, R$1), (t$6.litHtmlVersions ?? (t$6.litHtmlVersions = [])).push("3.3.0");
  const B$1 = (t2, i2, s2) => {
    const e2 = (s2 == null ? void 0 : s2.renderBefore) ?? i2;
    let h2 = e2._$litPart$;
    if (void 0 === h2) {
      const t3 = (s2 == null ? void 0 : s2.renderBefore) ?? null;
      e2._$litPart$ = h2 = new R$1(i2.insertBefore(l$2(), t3), t3, void 0, s2 ?? {});
    }
    return h2._$AI(t2), h2;
  };
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const s$3 = globalThis;
  let i$4 = class i extends y$3 {
    constructor() {
      super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
    }
    createRenderRoot() {
      var _a2;
      const t2 = super.createRenderRoot();
      return (_a2 = this.renderOptions).renderBefore ?? (_a2.renderBefore = t2.firstChild), t2;
    }
    update(t2) {
      const r2 = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t2), this._$Do = B$1(r2, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      var _a2;
      super.connectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(true);
    }
    disconnectedCallback() {
      var _a2;
      super.disconnectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(false);
    }
    render() {
      return T$1;
    }
  };
  i$4._$litElement$ = true, i$4["finalized"] = true, (_a = s$3.litElementHydrateSupport) == null ? void 0 : _a.call(s$3, { LitElement: i$4 });
  const o$a = s$3.litElementPolyfillSupport;
  o$a == null ? void 0 : o$a({ LitElement: i$4 });
  const n$8 = {
    _$AK: (t2, e2, r2) => {
      t2._$AK(e2, r2);
    }, _$AL: (t2) => t2._$AL
  };
  (s$3.litElementVersions ?? (s$3.litElementVersions = [])).push("4.2.0");
  /**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const o$9 = false;
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const t$5 = (t2) => (e2, o2) => {
    void 0 !== o2 ? o2.addInitializer(() => {
      customElements.define(t2, e2);
    }) : customElements.define(t2, e2);
  };
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const o$8 = { attribute: true, type: String, converter: u$3, reflect: false, hasChanged: f$3 }, r$a = (t2 = o$8, e2, r2) => {
    const { kind: n2, metadata: i2 } = r2;
    let s2 = globalThis.litPropertyMetadata.get(i2);
    if (void 0 === s2 && globalThis.litPropertyMetadata.set(i2, s2 = /* @__PURE__ */ new Map()), "setter" === n2 && ((t2 = Object.create(t2)).wrapped = true), s2.set(r2.name, t2), "accessor" === n2) {
      const { name: o2 } = r2;
      return {
        set(r3) {
          const n3 = e2.get.call(this);
          e2.set.call(this, r3), this.requestUpdate(o2, n3, t2);
        }, init(e3) {
          return void 0 !== e3 && this.C(o2, void 0, t2, e3), e3;
        }
      };
    }
    if ("setter" === n2) {
      const { name: o2 } = r2;
      return function (r3) {
        const n3 = this[o2];
        e2.call(this, r3), this.requestUpdate(o2, n3, t2);
      };
    }
    throw Error("Unsupported decorator location: " + n2);
  };
  function n$7(t2) {
    return (e2, o2) => "object" == typeof o2 ? r$a(t2, e2, o2) : ((t3, e3, o3) => {
      const r2 = e3.hasOwnProperty(o3);
      return e3.constructor.createProperty(o3, t3), r2 ? Object.getOwnPropertyDescriptor(e3, o3) : void 0;
    })(t2, e2, o2);
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  function r$9(r2) {
    return n$7({ ...r2, state: true, attribute: false });
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  function t$4(t2) {
    return (n2, o2) => {
      const c2 = "function" == typeof n2 ? n2 : n2[o2];
      Object.assign(c2, t2);
    };
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const e$8 = (e2, t2, c2) => (c2.configurable = true, c2.enumerable = true, Reflect.decorate && "object" != typeof t2 && Object.defineProperty(e2, t2, c2), c2);
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  function e$7(e2, r2) {
    return (n2, s2, i2) => {
      const o2 = (t2) => {
        var _a2;
        return ((_a2 = t2.renderRoot) == null ? void 0 : _a2.querySelector(e2)) ?? null;
      };
      if (r2) {
        const { get: e3, set: r3 } = "object" == typeof s2 ? n2 : i2 ?? (() => {
          const t2 = Symbol();
          return {
            get() {
              return this[t2];
            }, set(e4) {
              this[t2] = e4;
            }
          };
        })();
        return e$8(n2, s2, {
          get() {
            let t2 = e3.call(this);
            return void 0 === t2 && (t2 = o2(this), (null !== t2 || this.hasUpdated) && r3.call(this, t2)), t2;
          }
        });
      }
      return e$8(n2, s2, {
        get() {
          return o2(this);
        }
      });
    };
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  let e$6;
  function r$8(r2) {
    return (n2, o2) => e$8(n2, o2, {
      get() {
        return (this.renderRoot ?? (e$6 ?? (e$6 = document.createDocumentFragment()))).querySelectorAll(r2);
      }
    });
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  function r$7(r2) {
    return (n2, e2) => e$8(n2, e2, {
      async get() {
        var _a2;
        return await this.updateComplete, ((_a2 = this.renderRoot) == null ? void 0 : _a2.querySelector(r2)) ?? null;
      }
    });
  }
  /**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  function o$7(o2) {
    return (e2, n2) => {
      const { slot: r2, selector: s2 } = o2 ?? {}, c2 = "slot" + (r2 ? `[name=${r2}]` : ":not([name])");
      return e$8(e2, n2, {
        get() {
          var _a2;
          const t2 = (_a2 = this.renderRoot) == null ? void 0 : _a2.querySelector(c2), e3 = (t2 == null ? void 0 : t2.assignedElements(o2)) ?? [];
          return void 0 === s2 ? e3 : e3.filter((t3) => t3.matches(s2));
        }
      });
    };
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  function n$6(n2) {
    return (o2, r2) => {
      const { slot: e2 } = n2 ?? {}, s2 = "slot" + (e2 ? `[name=${e2}]` : ":not([name])");
      return e$8(o2, r2, {
        get() {
          var _a2;
          const t2 = (_a2 = this.renderRoot) == null ? void 0 : _a2.querySelector(s2);
          return (t2 == null ? void 0 : t2.assignedNodes(n2)) ?? [];
        }
      });
    };
  }
  const styles = "/* formdown-editor styles */\r\n:host {\r\n    display: block;\r\n    font-family: system-ui, -apple-system, sans-serif;\r\n    height: 600px;\r\n    border: 1px solid #d1d5db;\r\n    border-radius: 0.375rem;\r\n    overflow: hidden;\r\n}\r\n\r\n.editor-container {\r\n    display: flex;\r\n    height: 100%;\r\n}\r\n\r\n.editor-panel {\r\n    flex: 1;\r\n    display: flex;\r\n    flex-direction: column;\r\n    border-right: 1px solid #d1d5db;\r\n}\r\n\r\n.preview-panel {\r\n    flex: 1;\r\n    display: flex;\r\n    flex-direction: column;\r\n    background-color: #f9fafb;\r\n}\r\n\r\n.panel-header {\r\n    padding: 0.75rem 1rem;\r\n    background-color: #f3f4f6;\r\n    border-bottom: 1px solid #d1d5db;\r\n    font-weight: 500;\r\n    font-size: 0.875rem;\r\n    color: #374151;\r\n}\r\n\r\n.editor-textarea {\r\n    flex: 1;\r\n    width: 100%;\r\n    border: none;\r\n    outline: none;\r\n    padding: 1rem;\r\n    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;\r\n    font-size: 0.875rem;\r\n    line-height: 1.5;\r\n    resize: none;\r\n    background-color: white;\r\n    height: 0;\r\n}\r\n\r\n.preview-content {\r\n    flex: 1;\r\n    padding: 1rem;\r\n    overflow-y: auto;\r\n    height: 0;\r\n}\r\n\r\n.toolbar {\r\n    display: flex;\r\n    padding: 0.5rem;\r\n    background-color: #f9fafb;\r\n    border-bottom: 1px solid #d1d5db;\r\n    gap: 0.5rem;\r\n}\r\n\r\n.toolbar-button {\r\n    padding: 0.25rem 0.5rem;\r\n    background-color: white;\r\n    border: 1px solid #d1d5db;\r\n    border-radius: 0.25rem;\r\n    font-size: 0.75rem;\r\n    cursor: pointer;\r\n    transition: background-color 0.15s ease-in-out;\r\n}\r\n\r\n.toolbar-button:hover {\r\n    background-color: #f3f4f6;\r\n}\r\n\r\n.stats {\r\n    padding: 0.5rem 1rem;\r\n    background-color: #f9fafb;\r\n    border-top: 1px solid #d1d5db;\r\n    font-size: 0.75rem;\r\n    color: #6b7280;\r\n    display: flex;\r\n    justify-content: space-between;\r\n}\r\n\r\n.error-list {\r\n    background-color: #fef2f2;\r\n    border-left: 4px solid #dc2626;\r\n    padding: 1rem;\r\n    margin-bottom: 1rem;\r\n}\r\n\r\n.error-item {\r\n    color: #dc2626;\r\n    font-size: 0.875rem;\r\n    margin-bottom: 0.25rem;\r\n}\r\n\r\n/* Mode-specific styles */\r\n.mode-edit .preview-panel,\r\n.mode-view .editor-panel {\r\n    display: none;\r\n}\r\n\r\n.mode-edit .editor-panel {\r\n    border-right: none;\r\n}\r\n\r\n.mode-view {\r\n    overflow-y: auto;\r\n}\r\n\r\n.mode-view .preview-panel {\r\n    border-right: none;\r\n    height: auto;\r\n    min-height: 100%;\r\n}\r\n\r\n/* Responsive */\r\n@media (max-width: 768px) {\r\n    .editor-container {\r\n        flex-direction: column;\r\n    }\r\n\r\n    .editor-panel {\r\n        border-right: none;\r\n        border-bottom: 1px solid #d1d5db;\r\n    }\r\n}";
  function renderEditorPanel(header, toolbar, content, placeholder, insertSnippet, handleInput, handleKeydown) {
    return x$1`
        <div class="editor-panel">
            ${header ? x$1`
                <div class="panel-header">Formdown Editor</div>
            ` : ""}
            ${toolbar ? x$1`
                <div class="toolbar">
                    <button class="toolbar-button" @click=${() => insertSnippet("@name: [text required]")}>
                        Text
                    </button>
                    <button class="toolbar-button" @click=${() => insertSnippet("@bio: [textarea rows=4]")}>
                        Textarea
                    </button>
                    <button class="toolbar-button" @click=${() => insertSnippet(`@gender: [radio required options="Option 1,Option 2"]`)}>
                        Radio
                    </button>
                    <button class="toolbar-button" @click=${() => insertSnippet(`@interests: [checkbox options="Item 1,Item 2"]`)}>
                        Check
                    </button>
                    <button class="toolbar-button" @click=${() => insertSnippet(`@country: [select required options="USA,Canada,UK"]`)}>
                        Select
                    </button>
                </div>
            ` : ""}

            <textarea
                class="editor-textarea"
                .value=${content}
                @input=${handleInput}
                @keydown=${handleKeydown}
                placeholder=${placeholder}
                spellcheck="false"
            ></textarea>

            <div class="stats">
                <span>Lines: ${content.split("\n").length}</span>
                <span>Characters: ${content.length}</span>
            </div>
        </div>
    `;
  }
  function renderPreviewPanel(header, parseResult) {
    return x$1`
        <div class="preview-panel">
            ${header ? x$1`
                <div class="panel-header">Formdown UI</div>
            ` : ""}
            <div class="preview-content">
                ${parseResult.errors.length > 0 ? x$1`
                    <div class="error-list">
                        <strong>Errors:</strong>
                        ${parseResult.errors.map((error) => x$1`
                            <div class="error-item">${error}</div>
                        `)}
                    </div>
                ` : ""}
                <div id="formdown-ui-container"></div>
            </div>
        </div>
    `;
  }
  var __defProp$1 = Object.defineProperty;
  var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
  var __decorateClass$1 = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
    for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
      if (decorator = decorators[i2])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result) __defProp$1(target, key, result);
    return result;
  };
  class SimpleFormdownParser {
    parse(content) {
      const lines = content.split("\n").filter((line) => line.trim());
      const fields = [];
      const errors = [];
      lines.forEach((line, index) => {
        if (line.startsWith("@")) {
          try {
            const match = line.match(/@(\w+):\s*\[([^\]]+)\](.*)$/);
            if (match) {
              const [, name, type] = match;
              fields.push({
                name,
                type: type.split(" ")[0],
                label: name,
                required: type.includes("required"),
                attributes: {}
              });
            }
          } catch (error) {
            errors.push(`Line ${index + 1}: Invalid syntax`);
          }
        }
      });
      return { fields, errors };
    }
  }
  var defaultContent = `# Contact Form

Fill out the form below to get in touch:

@full_name: [text required placeholder="Enter your full name"]
@email_address: [email required]
@phone_number: [tel]
@message: [textarea rows=4 placeholder="Your message here..."]
@contact_method: [radio options="Email, Phone, Either"]
@newsletter_signup: [checkbox]`;
  exports.FormdownEditor = class FormdownEditor extends i$4 {
    constructor() {
      super(...arguments);
      this.content = defaultContent;
      this.mode = "split";
      this.placeholder = 'Try FormDown with smart labels! Field names like "full_name" become "Full Name" automatically...';
      this.header = false;
      this.toolbar = true;
      this._data = {};
      this.parseResult = { fields: [], errors: [] };
      this.parser = new SimpleFormdownParser();
    }
    // Getter and setter for data to handle nested structures
    get data() {
      return this._data;
    }
    set data(value) {
      let cleanedValue = {};
      if (value !== null && value !== void 0 && typeof value === "object") {
        if ("formData" in value && typeof value.formData === "object") {
          cleanedValue = { ...value.formData };
        } else {
          cleanedValue = { ...value };
        }
        cleanedValue = this.processCheckboxFields(cleanedValue);
      }
      this._data = cleanedValue;
      this.requestUpdate("data");
    }
    connectedCallback() {
      var _a2;
      super.connectedCallback();
      if (this.content === defaultContent && ((_a2 = this.textContent) == null ? void 0 : _a2.trim())) {
        this.content = this.textContent.trim();
        this.textContent = "";
      }
      this.updateParseResult();
    }
    willUpdate(changedProperties) {
      var _a2;
      super.willUpdate(changedProperties);
      if (changedProperties.has("content")) {
        const textarea = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector(".editor-textarea");
        if (textarea && document.activeElement === textarea) {
          return;
        }
      }
    }
    render() {
      const containerClass = `editor-container mode-${this.mode}`;
      return x$1`
            <div class="${containerClass}">
                ${this.mode !== "view" ? renderEditorPanel(
        this.header,
        this.toolbar,
        this.content,
        this.placeholder,
        this.insertSnippet.bind(this),
        this.handleInput.bind(this),
        this.handleKeydown.bind(this)
      ) : ""}
                ${this.mode !== "edit" ? renderPreviewPanel(this.header, this.parseResult) : ""}
            </div>
        `;
    }
    updated(changedProperties) {
      var _a2;
      super.updated(changedProperties);
      if (changedProperties.has("mode")) {
        const currentData = this._data;
        if (this.mode !== "edit") {
          this.updateFormdownUI();
          if (currentData && Object.keys(currentData).length > 0) {
            setTimeout(() => {
              var _a3;
              const container = (_a3 = this.shadowRoot) == null ? void 0 : _a3.querySelector("#formdown-ui-container");
              const formdownUI = container == null ? void 0 : container.querySelector("formdown-ui");
              if (formdownUI) {
                formdownUI.data = currentData;
              }
            }, 0);
          }
        }
        return;
      }
      if (this.mode !== "edit" && (changedProperties.has("content") || changedProperties.has("parseResult"))) {
        this.updateFormdownUI();
      }
      if (changedProperties.has("data") && this.mode !== "edit") {
        const container = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector("#formdown-ui-container");
        const formdownUI = container == null ? void 0 : container.querySelector("formdown-ui");
        if (formdownUI) {
          formdownUI.data = this.data || {};
        }
      }
    }
    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
      if (this.mode !== "edit") {
        this.updateFormdownUI();
      }
    }
    updateFormdownUI() {
      var _a2;
      const container = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector("#formdown-ui-container");
      if (!container) return;
      const isRegistered = customElements.get("formdown-ui");
      if (!isRegistered) {
        container.innerHTML = '<div style="padding: 1rem; color: #666;">Loading form preview...</div>';
        return;
      }
      let formdownUI = container.querySelector("formdown-ui");
      if (!formdownUI) {
        formdownUI = document.createElement("formdown-ui");
        formdownUI.style.width = "100%";
        formdownUI.style.height = "100%";
        formdownUI.addEventListener("formdown-data-update", (e2) => {
          const customEvent = e2;
          let newData = customEvent.detail;
          if (newData && typeof newData === "object" && "formData" in newData) {
            newData = newData.formData;
          }
          newData = this.processCheckboxFields(newData);
          this.data = { ...newData };
          this.dispatchEvent(new CustomEvent("formdown-data-update", {
            detail: newData,
            // Pass the clean data
            bubbles: true,
            composed: true
          }));
        });
        formdownUI.addEventListener("formdown-change", (e2) => {
          const customEvent = e2;
          this.dispatchEvent(new CustomEvent("formdown-change", {
            detail: customEvent.detail,
            bubbles: true,
            composed: true
          }));
        });
        container.appendChild(formdownUI);
      }
      formdownUI.setAttribute("content", this.content);
      if (this._data && Object.keys(this._data).length > 0) {
        formdownUI.data = this._data;
      }
    }
    handleInput(e2) {
      const target = e2.target;
      this.content = target.value;
      this.updateParseResult();
      this.dispatchContentChange();
    }
    handleKeydown(e2) {
      if (e2.key === "Tab") {
        e2.preventDefault();
        const target = e2.target;
        const start = target.selectionStart;
        const end = target.selectionEnd;
        const before = target.value.substring(0, start);
        const after = target.value.substring(end);
        target.value = before + "  " + after;
        target.selectionStart = target.selectionEnd = start + 2;
        this.content = target.value;
        this.updateParseResult();
        this.dispatchContentChange();
      }
    }
    insertSnippet(snippet) {
      var _a2;
      const textarea = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector(".editor-textarea");
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = this.content.substring(0, start);
      const after = this.content.substring(end);
      this.content = before + snippet + after;
      this.updateParseResult();
      this.dispatchContentChange();
      this.updateComplete.then(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + snippet.length;
      });
    }
    updateParseResult() {
      try {
        this.parseResult = this.parser.parse(this.content);
      } catch (error) {
        this.parseResult = {
          fields: [],
          errors: [error instanceof Error ? error.message : "Parse error"]
        };
      }
    }
    dispatchContentChange() {
      this.dispatchEvent(new CustomEvent("contentChange", {
        detail: { content: this.content },
        bubbles: true,
        composed: true
      }));
    }
    processCheckboxFields(data) {
      if (!data || typeof data !== "object") {
        return data;
      }
      const processedData = { ...data };
      const checkboxFieldInfo = this.getCheckboxFieldsFromContent();
      checkboxFieldInfo.forEach(({ fieldName, isGroup }) => {
        if (fieldName in processedData) {
          const value = processedData[fieldName];
          if (isGroup) {
            if (Array.isArray(value)) {
              processedData[fieldName] = value;
            } else if (typeof value === "string" && value.trim() !== "") {
              processedData[fieldName] = value.split(",").map((v2) => v2.trim()).filter((v2) => v2);
            } else {
              processedData[fieldName] = value ? [value] : [];
            }
          } else {
            if (typeof value === "boolean") {
              processedData[fieldName] = value;
            } else if (Array.isArray(value)) {
              processedData[fieldName] = value.length > 0;
            } else {
              processedData[fieldName] = Boolean(value);
            }
          }
        }
      });
      return processedData;
    }
    getCheckboxFieldsFromContent() {
      const checkboxFields = [];
      const lines = this.content.split("\n");
      lines.forEach((line) => {
        const match = line.match(/@(\w+):\s*\[([^\]]*checkbox[^\]]*)\]/i);
        if (match) {
          const fieldName = match[1];
          const checkboxConfig = match[2];
          const isGroup = checkboxConfig.includes("options=");
          checkboxFields.push({ fieldName, isGroup });
        }
      });
      return checkboxFields;
    }
    // Validation methods - delegate to FormdownUI component
    validate() {
      var _a2;
      const previewContainer = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector(".preview-content");
      const formdownUI = previewContainer == null ? void 0 : previewContainer.querySelector("formdown-ui");
      if (formdownUI && typeof formdownUI.validate === "function") {
        return formdownUI.validate();
      }
      return {
        isValid: false,
        errors: [{ field: "general", message: "FormdownUI component not found for validation" }]
      };
    }
    // Get form data - delegate to FormdownUI component
    getFormData() {
      var _a2;
      const previewContainer = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector(".preview-content");
      const formdownUI = previewContainer == null ? void 0 : previewContainer.querySelector("formdown-ui");
      if (formdownUI && typeof formdownUI.getFormData === "function") {
        return formdownUI.getFormData();
      }
      return {};
    }
  };
  exports.FormdownEditor.styles = i$7`${r$d(styles)}`;
  __decorateClass$1([
    n$7()
  ], exports.FormdownEditor.prototype, "content", 2);
  __decorateClass$1([
    n$7({ type: String })
  ], exports.FormdownEditor.prototype, "mode", 2);
  __decorateClass$1([
    n$7({ type: String })
  ], exports.FormdownEditor.prototype, "placeholder", 2);
  __decorateClass$1([
    n$7({ type: Boolean })
  ], exports.FormdownEditor.prototype, "header", 2);
  __decorateClass$1([
    n$7({ type: Boolean })
  ], exports.FormdownEditor.prototype, "toolbar", 2);
  __decorateClass$1([
    r$9()
  ], exports.FormdownEditor.prototype, "_data", 2);
  __decorateClass$1([
    r$9()
  ], exports.FormdownEditor.prototype, "parseResult", 2);
  exports.FormdownEditor = __decorateClass$1([
    t$5("formdown-editor")
  ], exports.FormdownEditor);
  const formdownEditor = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    get FormdownEditor() {
      return exports.FormdownEditor;
    }
  }, Symbol.toStringTag, { value: "Module" }));
  /**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const t$3 = globalThis, e$5 = t$3.ShadowRoot && (void 0 === t$3.ShadyCSS || t$3.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s$2 = Symbol(), o$6 = /* @__PURE__ */ new WeakMap();
  let n$5 = class n {
    constructor(t2, e2, o2) {
      if (this._$cssResult$ = true, o2 !== s$2) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t2, this.t = e2;
    }
    get styleSheet() {
      let t2 = this.o;
      const s2 = this.t;
      if (e$5 && void 0 === t2) {
        const e2 = void 0 !== s2 && 1 === s2.length;
        e2 && (t2 = o$6.get(s2)), void 0 === t2 && ((this.o = t2 = new CSSStyleSheet()).replaceSync(this.cssText), e2 && o$6.set(s2, t2));
      }
      return t2;
    }
    toString() {
      return this.cssText;
    }
  };
  const r$6 = (t2) => new n$5("string" == typeof t2 ? t2 : t2 + "", void 0, s$2), i$3 = (t2, ...e2) => {
    const o2 = 1 === t2.length ? t2[0] : e2.reduce((e3, s2, o3) => e3 + ((t3) => {
      if (true === t3._$cssResult$) return t3.cssText;
      if ("number" == typeof t3) return t3;
      throw Error("Value passed to 'css' function must be a 'css' function result: " + t3 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
    })(s2) + t2[o3 + 1], t2[0]);
    return new n$5(o2, t2, s$2);
  }, S$1 = (s2, o2) => {
    if (e$5) s2.adoptedStyleSheets = o2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet);
    else for (const e2 of o2) {
      const o3 = document.createElement("style"), n2 = t$3.litNonce;
      void 0 !== n2 && o3.setAttribute("nonce", n2), o3.textContent = e2.cssText, s2.appendChild(o3);
    }
  }, c$2 = e$5 ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
    let e2 = "";
    for (const s2 of t3.cssRules) e2 += s2.cssText;
    return r$6(e2);
  })(t2) : t2;
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const { is: i$2, defineProperty: e$4, getOwnPropertyDescriptor: h$1, getOwnPropertyNames: r$5, getOwnPropertySymbols: o$5, getPrototypeOf: n$4 } = Object, a$1 = globalThis, c$1 = a$1.trustedTypes, l$1 = c$1 ? c$1.emptyScript : "", p$1 = a$1.reactiveElementPolyfillSupport, d$1 = (t2, s2) => t2, u$1 = {
    toAttribute(t2, s2) {
      switch (s2) {
        case Boolean:
          t2 = t2 ? l$1 : null;
          break;
        case Object:
        case Array:
          t2 = null == t2 ? t2 : JSON.stringify(t2);
      }
      return t2;
    }, fromAttribute(t2, s2) {
      let i2 = t2;
      switch (s2) {
        case Boolean:
          i2 = null !== t2;
          break;
        case Number:
          i2 = null === t2 ? null : Number(t2);
          break;
        case Object:
        case Array:
          try {
            i2 = JSON.parse(t2);
          } catch (t3) {
            i2 = null;
          }
      }
      return i2;
    }
  }, f$1 = (t2, s2) => !i$2(t2, s2), b$1 = { attribute: true, type: String, converter: u$1, reflect: false, useDefault: false, hasChanged: f$1 };
  Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a$1.litPropertyMetadata ?? (a$1.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
  let y$1 = class y extends HTMLElement {
    static addInitializer(t2) {
      this._$Ei(), (this.l ?? (this.l = [])).push(t2);
    }
    static get observedAttributes() {
      return this.finalize(), this._$Eh && [...this._$Eh.keys()];
    }
    static createProperty(t2, s2 = b$1) {
      if (s2.state && (s2.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t2) && ((s2 = Object.create(s2)).wrapped = true), this.elementProperties.set(t2, s2), !s2.noAccessor) {
        const i2 = Symbol(), h2 = this.getPropertyDescriptor(t2, i2, s2);
        void 0 !== h2 && e$4(this.prototype, t2, h2);
      }
    }
    static getPropertyDescriptor(t2, s2, i2) {
      const { get: e2, set: r2 } = h$1(this.prototype, t2) ?? {
        get() {
          return this[s2];
        }, set(t3) {
          this[s2] = t3;
        }
      };
      return {
        get: e2, set(s3) {
          const h2 = e2 == null ? void 0 : e2.call(this);
          r2 == null ? void 0 : r2.call(this, s3), this.requestUpdate(t2, h2, i2);
        }, configurable: true, enumerable: true
      };
    }
    static getPropertyOptions(t2) {
      return this.elementProperties.get(t2) ?? b$1;
    }
    static _$Ei() {
      if (this.hasOwnProperty(d$1("elementProperties"))) return;
      const t2 = n$4(this);
      t2.finalize(), void 0 !== t2.l && (this.l = [...t2.l]), this.elementProperties = new Map(t2.elementProperties);
    }
    static finalize() {
      if (this.hasOwnProperty(d$1("finalized"))) return;
      if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d$1("properties"))) {
        const t3 = this.properties, s2 = [...r$5(t3), ...o$5(t3)];
        for (const i2 of s2) this.createProperty(i2, t3[i2]);
      }
      const t2 = this[Symbol.metadata];
      if (null !== t2) {
        const s2 = litPropertyMetadata.get(t2);
        if (void 0 !== s2) for (const [t3, i2] of s2) this.elementProperties.set(t3, i2);
      }
      this._$Eh = /* @__PURE__ */ new Map();
      for (const [t3, s2] of this.elementProperties) {
        const i2 = this._$Eu(t3, s2);
        void 0 !== i2 && this._$Eh.set(i2, t3);
      }
      this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(s2) {
      const i2 = [];
      if (Array.isArray(s2)) {
        const e2 = new Set(s2.flat(1 / 0).reverse());
        for (const s3 of e2) i2.unshift(c$2(s3));
      } else void 0 !== s2 && i2.push(c$2(s2));
      return i2;
    }
    static _$Eu(t2, s2) {
      const i2 = s2.attribute;
      return false === i2 ? void 0 : "string" == typeof i2 ? i2 : "string" == typeof t2 ? t2.toLowerCase() : void 0;
    }
    constructor() {
      super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
    }
    _$Ev() {
      var _a2;
      this._$ES = new Promise((t2) => this.enableUpdating = t2), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (_a2 = this.constructor.l) == null ? void 0 : _a2.forEach((t2) => t2(this));
    }
    addController(t2) {
      var _a2;
      (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t2), void 0 !== this.renderRoot && this.isConnected && ((_a2 = t2.hostConnected) == null ? void 0 : _a2.call(t2));
    }
    removeController(t2) {
      var _a2;
      (_a2 = this._$EO) == null ? void 0 : _a2.delete(t2);
    }
    _$E_() {
      const t2 = /* @__PURE__ */ new Map(), s2 = this.constructor.elementProperties;
      for (const i2 of s2.keys()) this.hasOwnProperty(i2) && (t2.set(i2, this[i2]), delete this[i2]);
      t2.size > 0 && (this._$Ep = t2);
    }
    createRenderRoot() {
      const t2 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
      return S$1(t2, this.constructor.elementStyles), t2;
    }
    connectedCallback() {
      var _a2;
      this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
        var _a3;
        return (_a3 = t2.hostConnected) == null ? void 0 : _a3.call(t2);
      });
    }
    enableUpdating(t2) {
    }
    disconnectedCallback() {
      var _a2;
      (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
        var _a3;
        return (_a3 = t2.hostDisconnected) == null ? void 0 : _a3.call(t2);
      });
    }
    attributeChangedCallback(t2, s2, i2) {
      this._$AK(t2, i2);
    }
    _$ET(t2, s2) {
      var _a2;
      const i2 = this.constructor.elementProperties.get(t2), e2 = this.constructor._$Eu(t2, i2);
      if (void 0 !== e2 && true === i2.reflect) {
        const h2 = (void 0 !== ((_a2 = i2.converter) == null ? void 0 : _a2.toAttribute) ? i2.converter : u$1).toAttribute(s2, i2.type);
        this._$Em = t2, null == h2 ? this.removeAttribute(e2) : this.setAttribute(e2, h2), this._$Em = null;
      }
    }
    _$AK(t2, s2) {
      var _a2, _b2;
      const i2 = this.constructor, e2 = i2._$Eh.get(t2);
      if (void 0 !== e2 && this._$Em !== e2) {
        const t3 = i2.getPropertyOptions(e2), h2 = "function" == typeof t3.converter ? { fromAttribute: t3.converter } : void 0 !== ((_a2 = t3.converter) == null ? void 0 : _a2.fromAttribute) ? t3.converter : u$1;
        this._$Em = e2, this[e2] = h2.fromAttribute(s2, t3.type) ?? ((_b2 = this._$Ej) == null ? void 0 : _b2.get(e2)) ?? null, this._$Em = null;
      }
    }
    requestUpdate(t2, s2, i2) {
      var _a2;
      if (void 0 !== t2) {
        const e2 = this.constructor, h2 = this[t2];
        if (i2 ?? (i2 = e2.getPropertyOptions(t2)), !((i2.hasChanged ?? f$1)(h2, s2) || i2.useDefault && i2.reflect && h2 === ((_a2 = this._$Ej) == null ? void 0 : _a2.get(t2)) && !this.hasAttribute(e2._$Eu(t2, i2)))) return;
        this.C(t2, s2, i2);
      }
      false === this.isUpdatePending && (this._$ES = this._$EP());
    }
    C(t2, s2, { useDefault: i2, reflect: e2, wrapped: h2 }, r2) {
      i2 && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t2) && (this._$Ej.set(t2, r2 ?? s2 ?? this[t2]), true !== h2 || void 0 !== r2) || (this._$AL.has(t2) || (this.hasUpdated || i2 || (s2 = void 0), this._$AL.set(t2, s2)), true === e2 && this._$Em !== t2 && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t2));
    }
    async _$EP() {
      this.isUpdatePending = true;
      try {
        await this._$ES;
      } catch (t3) {
        Promise.reject(t3);
      }
      const t2 = this.scheduleUpdate();
      return null != t2 && await t2, !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      var _a2;
      if (!this.isUpdatePending) return;
      if (!this.hasUpdated) {
        if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
          for (const [t4, s3] of this._$Ep) this[t4] = s3;
          this._$Ep = void 0;
        }
        const t3 = this.constructor.elementProperties;
        if (t3.size > 0) for (const [s3, i2] of t3) {
          const { wrapped: t4 } = i2, e2 = this[s3];
          true !== t4 || this._$AL.has(s3) || void 0 === e2 || this.C(s3, void 0, i2, e2);
        }
      }
      let t2 = false;
      const s2 = this._$AL;
      try {
        t2 = this.shouldUpdate(s2), t2 ? (this.willUpdate(s2), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
          var _a3;
          return (_a3 = t3.hostUpdate) == null ? void 0 : _a3.call(t3);
        }), this.update(s2)) : this._$EM();
      } catch (s3) {
        throw t2 = false, this._$EM(), s3;
      }
      t2 && this._$AE(s2);
    }
    willUpdate(t2) {
    }
    _$AE(t2) {
      var _a2;
      (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
        var _a3;
        return (_a3 = t3.hostUpdated) == null ? void 0 : _a3.call(t3);
      }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t2)), this.updated(t2);
    }
    _$EM() {
      this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this._$ES;
    }
    shouldUpdate(t2) {
      return true;
    }
    update(t2) {
      this._$Eq && (this._$Eq = this._$Eq.forEach((t3) => this._$ET(t3, this[t3]))), this._$EM();
    }
    updated(t2) {
    }
    firstUpdated(t2) {
    }
  };
  y$1.elementStyles = [], y$1.shadowRootOptions = { mode: "open" }, y$1[d$1("elementProperties")] = /* @__PURE__ */ new Map(), y$1[d$1("finalized")] = /* @__PURE__ */ new Map(), p$1 == null ? void 0 : p$1({ ReactiveElement: y$1 }), (a$1.reactiveElementVersions ?? (a$1.reactiveElementVersions = [])).push("2.1.0");
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const t$2 = globalThis, i$1 = t$2.trustedTypes, s$1 = i$1 ? i$1.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0, e$3 = "$lit$", h = `lit$${Math.random().toFixed(9).slice(2)}$`, o$4 = "?" + h, n$3 = `<${o$4}>`, r$4 = document, l = () => r$4.createComment(""), c = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2, a = Array.isArray, u = (t2) => a(t2) || "function" == typeof (t2 == null ? void 0 : t2[Symbol.iterator]), d = "[ 	\n\f\r]", f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, v = /-->/g, _ = />/g, m = RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), p = /'/g, g = /"/g, $ = /^(?:script|style|textarea|title)$/i, y = (t2) => (i2, ...s2) => ({ _$litType$: t2, strings: i2, values: s2 }), x = y(1), b = y(2), w = y(3), T = Symbol.for("lit-noChange"), E = Symbol.for("lit-nothing"), A = /* @__PURE__ */ new WeakMap(), C = r$4.createTreeWalker(r$4, 129);
  function P(t2, i2) {
    if (!a(t2) || !t2.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== s$1 ? s$1.createHTML(i2) : i2;
  }
  const V = (t2, i2) => {
    const s2 = t2.length - 1, o2 = [];
    let r2, l2 = 2 === i2 ? "<svg>" : 3 === i2 ? "<math>" : "", c2 = f;
    for (let i3 = 0; i3 < s2; i3++) {
      const s3 = t2[i3];
      let a2, u2, d2 = -1, y2 = 0;
      for (; y2 < s3.length && (c2.lastIndex = y2, u2 = c2.exec(s3), null !== u2);) y2 = c2.lastIndex, c2 === f ? "!--" === u2[1] ? c2 = v : void 0 !== u2[1] ? c2 = _ : void 0 !== u2[2] ? ($.test(u2[2]) && (r2 = RegExp("</" + u2[2], "g")), c2 = m) : void 0 !== u2[3] && (c2 = m) : c2 === m ? ">" === u2[0] ? (c2 = r2 ?? f, d2 = -1) : void 0 === u2[1] ? d2 = -2 : (d2 = c2.lastIndex - u2[2].length, a2 = u2[1], c2 = void 0 === u2[3] ? m : '"' === u2[3] ? g : p) : c2 === g || c2 === p ? c2 = m : c2 === v || c2 === _ ? c2 = f : (c2 = m, r2 = void 0);
      const x2 = c2 === m && t2[i3 + 1].startsWith("/>") ? " " : "";
      l2 += c2 === f ? s3 + n$3 : d2 >= 0 ? (o2.push(a2), s3.slice(0, d2) + e$3 + s3.slice(d2) + h + x2) : s3 + h + (-2 === d2 ? i3 : x2);
    }
    return [P(t2, l2 + (t2[s2] || "<?>") + (2 === i2 ? "</svg>" : 3 === i2 ? "</math>" : "")), o2];
  };
  class N {
    constructor({ strings: t2, _$litType$: s2 }, n2) {
      let r2;
      this.parts = [];
      let c2 = 0, a2 = 0;
      const u2 = t2.length - 1, d2 = this.parts, [f2, v2] = V(t2, s2);
      if (this.el = N.createElement(f2, n2), C.currentNode = this.el.content, 2 === s2 || 3 === s2) {
        const t3 = this.el.content.firstChild;
        t3.replaceWith(...t3.childNodes);
      }
      for (; null !== (r2 = C.nextNode()) && d2.length < u2;) {
        if (1 === r2.nodeType) {
          if (r2.hasAttributes()) for (const t3 of r2.getAttributeNames()) if (t3.endsWith(e$3)) {
            const i2 = v2[a2++], s3 = r2.getAttribute(t3).split(h), e2 = /([.?@])?(.*)/.exec(i2);
            d2.push({ type: 1, index: c2, name: e2[2], strings: s3, ctor: "." === e2[1] ? H : "?" === e2[1] ? I : "@" === e2[1] ? L : k }), r2.removeAttribute(t3);
          } else t3.startsWith(h) && (d2.push({ type: 6, index: c2 }), r2.removeAttribute(t3));
          if ($.test(r2.tagName)) {
            const t3 = r2.textContent.split(h), s3 = t3.length - 1;
            if (s3 > 0) {
              r2.textContent = i$1 ? i$1.emptyScript : "";
              for (let i2 = 0; i2 < s3; i2++) r2.append(t3[i2], l()), C.nextNode(), d2.push({ type: 2, index: ++c2 });
              r2.append(t3[s3], l());
            }
          }
        } else if (8 === r2.nodeType) if (r2.data === o$4) d2.push({ type: 2, index: c2 });
        else {
          let t3 = -1;
          for (; -1 !== (t3 = r2.data.indexOf(h, t3 + 1));) d2.push({ type: 7, index: c2 }), t3 += h.length - 1;
        }
        c2++;
      }
    }
    static createElement(t2, i2) {
      const s2 = r$4.createElement("template");
      return s2.innerHTML = t2, s2;
    }
  }
  function S(t2, i2, s2 = t2, e2) {
    var _a2, _b2;
    if (i2 === T) return i2;
    let h2 = void 0 !== e2 ? (_a2 = s2._$Co) == null ? void 0 : _a2[e2] : s2._$Cl;
    const o2 = c(i2) ? void 0 : i2._$litDirective$;
    return (h2 == null ? void 0 : h2.constructor) !== o2 && ((_b2 = h2 == null ? void 0 : h2._$AO) == null ? void 0 : _b2.call(h2, false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s2, e2)), void 0 !== e2 ? (s2._$Co ?? (s2._$Co = []))[e2] = h2 : s2._$Cl = h2), void 0 !== h2 && (i2 = S(t2, h2._$AS(t2, i2.values), h2, e2)), i2;
  }
  class M {
    constructor(t2, i2) {
      this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i2;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t2) {
      const { el: { content: i2 }, parts: s2 } = this._$AD, e2 = ((t2 == null ? void 0 : t2.creationScope) ?? r$4).importNode(i2, true);
      C.currentNode = e2;
      let h2 = C.nextNode(), o2 = 0, n2 = 0, l2 = s2[0];
      for (; void 0 !== l2;) {
        if (o2 === l2.index) {
          let i3;
          2 === l2.type ? i3 = new R(h2, h2.nextSibling, this, t2) : 1 === l2.type ? i3 = new l2.ctor(h2, l2.name, l2.strings, this, t2) : 6 === l2.type && (i3 = new z(h2, this, t2)), this._$AV.push(i3), l2 = s2[++n2];
        }
        o2 !== (l2 == null ? void 0 : l2.index) && (h2 = C.nextNode(), o2++);
      }
      return C.currentNode = r$4, e2;
    }
    p(t2) {
      let i2 = 0;
      for (const s2 of this._$AV) void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i2), i2 += s2.strings.length - 2) : s2._$AI(t2[i2])), i2++;
    }
  }
  class R {
    get _$AU() {
      var _a2;
      return ((_a2 = this._$AM) == null ? void 0 : _a2._$AU) ?? this._$Cv;
    }
    constructor(t2, i2, s2, e2) {
      this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t2, this._$AB = i2, this._$AM = s2, this.options = e2, this._$Cv = (e2 == null ? void 0 : e2.isConnected) ?? true;
    }
    get parentNode() {
      let t2 = this._$AA.parentNode;
      const i2 = this._$AM;
      return void 0 !== i2 && 11 === (t2 == null ? void 0 : t2.nodeType) && (t2 = i2.parentNode), t2;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t2, i2 = this) {
      t2 = S(this, t2, i2), c(t2) ? t2 === E || null == t2 || "" === t2 ? (this._$AH !== E && this._$AR(), this._$AH = E) : t2 !== this._$AH && t2 !== T && this._(t2) : void 0 !== t2._$litType$ ? this.$(t2) : void 0 !== t2.nodeType ? this.T(t2) : u(t2) ? this.k(t2) : this._(t2);
    }
    O(t2) {
      return this._$AA.parentNode.insertBefore(t2, this._$AB);
    }
    T(t2) {
      this._$AH !== t2 && (this._$AR(), this._$AH = this.O(t2));
    }
    _(t2) {
      this._$AH !== E && c(this._$AH) ? this._$AA.nextSibling.data = t2 : this.T(r$4.createTextNode(t2)), this._$AH = t2;
    }
    $(t2) {
      var _a2;
      const { values: i2, _$litType$: s2 } = t2, e2 = "number" == typeof s2 ? this._$AC(t2) : (void 0 === s2.el && (s2.el = N.createElement(P(s2.h, s2.h[0]), this.options)), s2);
      if (((_a2 = this._$AH) == null ? void 0 : _a2._$AD) === e2) this._$AH.p(i2);
      else {
        const t3 = new M(e2, this), s3 = t3.u(this.options);
        t3.p(i2), this.T(s3), this._$AH = t3;
      }
    }
    _$AC(t2) {
      let i2 = A.get(t2.strings);
      return void 0 === i2 && A.set(t2.strings, i2 = new N(t2)), i2;
    }
    k(t2) {
      a(this._$AH) || (this._$AH = [], this._$AR());
      const i2 = this._$AH;
      let s2, e2 = 0;
      for (const h2 of t2) e2 === i2.length ? i2.push(s2 = new R(this.O(l()), this.O(l()), this, this.options)) : s2 = i2[e2], s2._$AI(h2), e2++;
      e2 < i2.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i2.length = e2);
    }
    _$AR(t2 = this._$AA.nextSibling, i2) {
      var _a2;
      for ((_a2 = this._$AP) == null ? void 0 : _a2.call(this, false, true, i2); t2 && t2 !== this._$AB;) {
        const i3 = t2.nextSibling;
        t2.remove(), t2 = i3;
      }
    }
    setConnected(t2) {
      var _a2;
      void 0 === this._$AM && (this._$Cv = t2, (_a2 = this._$AP) == null ? void 0 : _a2.call(this, t2));
    }
  }
  class k {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t2, i2, s2, e2, h2) {
      this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t2, this.name = i2, this._$AM = e2, this.options = h2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = E;
    }
    _$AI(t2, i2 = this, s2, e2) {
      const h2 = this.strings;
      let o2 = false;
      if (void 0 === h2) t2 = S(this, t2, i2, 0), o2 = !c(t2) || t2 !== this._$AH && t2 !== T, o2 && (this._$AH = t2);
      else {
        const e3 = t2;
        let n2, r2;
        for (t2 = h2[0], n2 = 0; n2 < h2.length - 1; n2++) r2 = S(this, e3[s2 + n2], i2, n2), r2 === T && (r2 = this._$AH[n2]), o2 || (o2 = !c(r2) || r2 !== this._$AH[n2]), r2 === E ? t2 = E : t2 !== E && (t2 += (r2 ?? "") + h2[n2 + 1]), this._$AH[n2] = r2;
      }
      o2 && !e2 && this.j(t2);
    }
    j(t2) {
      t2 === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 ?? "");
    }
  }
  class H extends k {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t2) {
      this.element[this.name] = t2 === E ? void 0 : t2;
    }
  }
  class I extends k {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t2) {
      this.element.toggleAttribute(this.name, !!t2 && t2 !== E);
    }
  }
  class L extends k {
    constructor(t2, i2, s2, e2, h2) {
      super(t2, i2, s2, e2, h2), this.type = 5;
    }
    _$AI(t2, i2 = this) {
      if ((t2 = S(this, t2, i2, 0) ?? E) === T) return;
      const s2 = this._$AH, e2 = t2 === E && s2 !== E || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, h2 = t2 !== E && (s2 === E || e2);
      e2 && this.element.removeEventListener(this.name, this, s2), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
    }
    handleEvent(t2) {
      var _a2;
      "function" == typeof this._$AH ? this._$AH.call(((_a2 = this.options) == null ? void 0 : _a2.host) ?? this.element, t2) : this._$AH.handleEvent(t2);
    }
  }
  class z {
    constructor(t2, i2, s2) {
      this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i2, this.options = s2;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t2) {
      S(this, t2);
    }
  }
  const Z = { M: e$3, P: h, A: o$4, C: 1, L: V, R: M, D: u, V: S, I: R, H: k, N: I, U: L, B: H, F: z }, j = t$2.litHtmlPolyfillSupport;
  j == null ? void 0 : j(N, R), (t$2.litHtmlVersions ?? (t$2.litHtmlVersions = [])).push("3.3.0");
  const B = (t2, i2, s2) => {
    const e2 = (s2 == null ? void 0 : s2.renderBefore) ?? i2;
    let h2 = e2._$litPart$;
    if (void 0 === h2) {
      const t3 = (s2 == null ? void 0 : s2.renderBefore) ?? null;
      e2._$litPart$ = h2 = new R(i2.insertBefore(l(), t3), t3, void 0, s2 ?? {});
    }
    return h2._$AI(t2), h2;
  };
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const s = globalThis;
  class i extends y$1 {
    constructor() {
      super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
    }
    createRenderRoot() {
      var _a2;
      const t2 = super.createRenderRoot();
      return (_a2 = this.renderOptions).renderBefore ?? (_a2.renderBefore = t2.firstChild), t2;
    }
    update(t2) {
      const r2 = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t2), this._$Do = B(r2, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      var _a2;
      super.connectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(true);
    }
    disconnectedCallback() {
      var _a2;
      super.disconnectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(false);
    }
    render() {
      return T;
    }
  }
  i._$litElement$ = true, i["finalized"] = true, (_b = s.litElementHydrateSupport) == null ? void 0 : _b.call(s, { LitElement: i });
  const o$3 = s.litElementPolyfillSupport;
  o$3 == null ? void 0 : o$3({ LitElement: i });
  const n$2 = {
    _$AK: (t2, e2, r2) => {
      t2._$AK(e2, r2);
    }, _$AL: (t2) => t2._$AL
  };
  (s.litElementVersions ?? (s.litElementVersions = [])).push("4.2.0");
  /**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const o$2 = false;
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const t$1 = (t2) => (e2, o2) => {
    void 0 !== o2 ? o2.addInitializer(() => {
      customElements.define(t2, e2);
    }) : customElements.define(t2, e2);
  };
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const o$1 = { attribute: true, type: String, converter: u$1, reflect: false, hasChanged: f$1 }, r$3 = (t2 = o$1, e2, r2) => {
    const { kind: n2, metadata: i2 } = r2;
    let s2 = globalThis.litPropertyMetadata.get(i2);
    if (void 0 === s2 && globalThis.litPropertyMetadata.set(i2, s2 = /* @__PURE__ */ new Map()), "setter" === n2 && ((t2 = Object.create(t2)).wrapped = true), s2.set(r2.name, t2), "accessor" === n2) {
      const { name: o2 } = r2;
      return {
        set(r3) {
          const n3 = e2.get.call(this);
          e2.set.call(this, r3), this.requestUpdate(o2, n3, t2);
        }, init(e3) {
          return void 0 !== e3 && this.C(o2, void 0, t2, e3), e3;
        }
      };
    }
    if ("setter" === n2) {
      const { name: o2 } = r2;
      return function (r3) {
        const n3 = this[o2];
        e2.call(this, r3), this.requestUpdate(o2, n3, t2);
      };
    }
    throw Error("Unsupported decorator location: " + n2);
  };
  function n$1(t2) {
    return (e2, o2) => "object" == typeof o2 ? r$3(t2, e2, o2) : ((t3, e3, o3) => {
      const r2 = e3.hasOwnProperty(o3);
      return e3.constructor.createProperty(o3, t3), r2 ? Object.getOwnPropertyDescriptor(e3, o3) : void 0;
    })(t2, e2, o2);
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  function r$2(r2) {
    return n$1({ ...r2, state: true, attribute: false });
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  function t(t2) {
    return (n2, o2) => {
      const c2 = "function" == typeof n2 ? n2 : n2[o2];
      Object.assign(c2, t2);
    };
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const e$2 = (e2, t2, c2) => (c2.configurable = true, c2.enumerable = true, Reflect.decorate && "object" != typeof t2 && Object.defineProperty(e2, t2, c2), c2);
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  function e$1(e2, r2) {
    return (n2, s2, i2) => {
      const o2 = (t2) => {
        var _a2;
        return ((_a2 = t2.renderRoot) == null ? void 0 : _a2.querySelector(e2)) ?? null;
      };
      if (r2) {
        const { get: e3, set: r3 } = "object" == typeof s2 ? n2 : i2 ?? (() => {
          const t2 = Symbol();
          return {
            get() {
              return this[t2];
            }, set(e4) {
              this[t2] = e4;
            }
          };
        })();
        return e$2(n2, s2, {
          get() {
            let t2 = e3.call(this);
            return void 0 === t2 && (t2 = o2(this), (null !== t2 || this.hasUpdated) && r3.call(this, t2)), t2;
          }
        });
      }
      return e$2(n2, s2, {
        get() {
          return o2(this);
        }
      });
    };
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  let e;
  function r$1(r2) {
    return (n2, o2) => e$2(n2, o2, {
      get() {
        return (this.renderRoot ?? (e ?? (e = document.createDocumentFragment()))).querySelectorAll(r2);
      }
    });
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  function r(r2) {
    return (n2, e2) => e$2(n2, e2, {
      async get() {
        var _a2;
        return await this.updateComplete, ((_a2 = this.renderRoot) == null ? void 0 : _a2.querySelector(r2)) ?? null;
      }
    });
  }
  /**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  function o(o2) {
    return (e2, n2) => {
      const { slot: r2, selector: s2 } = o2 ?? {}, c2 = "slot" + (r2 ? `[name=${r2}]` : ":not([name])");
      return e$2(e2, n2, {
        get() {
          var _a2;
          const t2 = (_a2 = this.renderRoot) == null ? void 0 : _a2.querySelector(c2), e3 = (t2 == null ? void 0 : t2.assignedElements(o2)) ?? [];
          return void 0 === s2 ? e3 : e3.filter((t3) => t3.matches(s2));
        }
      });
    };
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  function n(n2) {
    return (o2, r2) => {
      const { slot: e2 } = n2 ?? {}, s2 = "slot" + (e2 ? `[name=${e2}]` : ":not([name])");
      return e$2(o2, r2, {
        get() {
          var _a2;
          const t2 = (_a2 = this.renderRoot) == null ? void 0 : _a2.querySelector(s2);
          return (t2 == null ? void 0 : t2.assignedNodes(n2)) ?? [];
        }
      });
    };
  }
  class FormdownParser {
    constructor(options2 = {}) {
      this.options = {
        preserveMarkdown: true,
        fieldPrefix: "@",
        inlineFieldDelimiter: "___",
        ...options2
      };
    }
    parseFormdown(content) {
      const { fields, cleanedMarkdown } = this.extractFields(content);
      return {
        markdown: this.options.preserveMarkdown ? cleanedMarkdown : "",
        forms: fields
      };
    }
    parse(content) {
      const { fields } = this.extractFields(content);
      return { fields, errors: [] };
    }
    extractFields(content) {
      const fields = [];
      const lines = content.split("\n");
      const cleanedLines = [];
      for (let i2 = 0; i2 < lines.length; i2++) {
        const line = lines[i2];
        const blockField = this.parseBlockField(line);
        if (blockField) {
          fields.push(blockField);
          cleanedLines.push(`<!--FORMDOWN_FIELD_${fields.length - 1}-->`);
          continue;
        }
        const { cleanedLine, inlineFields } = this.parseInlineFields(line);
        fields.push(...inlineFields);
        cleanedLines.push(cleanedLine);
      }
      return {
        fields,
        cleanedMarkdown: cleanedLines.join("\n")
      };
    }
    parseBlockField(line) {
      const trimmedLine = line.trim();
      const hasShorthandMarker = /^@\w+\*/.test(trimmedLine) || // Required marker
        /^@\w+\{.*?\}/.test(trimmedLine) || // Content
        /^@\w+\s*:\s*(dt|d|[#@%&t?TrscRFCMW])\d*\[/.test(trimmedLine) || // Type marker 
        /^@\w+\([^)]+\)\*/.test(trimmedLine) || // Label + required
        /^@\w+\([^)]+\)\{.*?\}/.test(trimmedLine) || // Label + content
        /^@\w+\([^)]+\)\s*:\s*(dt|d|[#@%&t?TrscRFCMW])\d*\[/.test(trimmedLine);
      if (hasShorthandMarker) {
        const shorthandField = this.parseShorthandBlockField(trimmedLine);
        if (shorthandField)
          return shorthandField;
      }
      const match = trimmedLine.match(/^@(\w+)(?:\(([^)]+)\))?\s*:\s*\[([^\]]*)\].*$/);
      if (!match)
        return null;
      const [, name, customLabel, typeAndAttributes] = match;
      const field = this.createField(name, customLabel, typeAndAttributes);
      return field;
    }
    parseShorthandBlockField(line) {
      let shorthandMatch = line.match(/^@(\w+)(\*)?(?:\{(.*?)\})?(?:\(([^)]+)\))?\s*:\s*(dt|d|[#@%&t?TrscRFCMW])?(\d*)\[([^\]]*)\].*$/);
      if (!shorthandMatch) {
        shorthandMatch = line.match(/^@(\w+)(?:\(([^)]+)\))?(\*)?(?:\{(.*?)\})?\s*:\s*(dt|d|[#@%&t?TrscRFCMW])?(\d*)\[([^\]]*)\].*$/);
        if (shorthandMatch) {
          const [, name2, customLabel2, requiredMarker2, content2, typeMarker2, rowsOrModifier2, attributes2] = shorthandMatch;
          shorthandMatch = [shorthandMatch[0], name2, requiredMarker2, content2, customLabel2, typeMarker2, rowsOrModifier2, attributes2];
        }
      }
      if (!shorthandMatch) {
        return null;
      }
      const [, name, requiredMarker, content, customLabel, typeMarker, rowsOrModifier, attributes] = shorthandMatch;
      if (!requiredMarker && !content && !customLabel && !typeMarker && !rowsOrModifier) {
        return null;
      }
      const field = this.convertShorthandToField(name, requiredMarker, content, customLabel, typeMarker || "", rowsOrModifier, attributes);
      return field;
    }
    parseInlineFields(line) {
      const inlineFields = [];
      const delimiter = this.options.inlineFieldDelimiter;
      const shorthandPattern = new RegExp(`(dt|d|[#@%&t?TrscRFCMW]?)${delimiter}@(\\w+)(\\*)?(?:\\{(.*?)\\})?(?:\\(([^)]+)\\))?(?:\\[([^\\]]*)\\])?`, "g");
      let cleanedLine = line.replace(shorthandPattern, (match, typeMarker, name, requiredMarker, content, customLabel, attributes) => {
        if (!typeMarker && !requiredMarker && !content) {
          return match;
        }
        const field = this.convertShorthandToField(name, requiredMarker, content, customLabel, typeMarker, "", attributes || "");
        if (field) {
          field.inline = true;
          inlineFields.push(field);
          const requiredAttr = field.required ? ' data-required="true"' : "";
          return `<span contenteditable="true" data-field-name="${name}" data-field-type="${field.type}" data-placeholder="${field.label || name}" class="formdown-inline-field" role="textbox"${requiredAttr}>${field.label || name}</span>`;
        }
        return match;
      });
      const standardPattern = new RegExp(`${delimiter}@(\\w+)(?:\\(([^)]+)\\))?(?:\\[([^\\]]*)\\])?`, "g");
      cleanedLine = cleanedLine.replace(standardPattern, (match, name, customLabel, typeAndAttributes) => {
        if (inlineFields.some((field2) => field2.name === name))
          return match;
        const finalTypeAndAttributes = typeAndAttributes !== void 0 ? typeAndAttributes : "text";
        const field = this.createField(name, customLabel, finalTypeAndAttributes);
        if (field) {
          field.inline = true;
          inlineFields.push(field);
          const requiredAttr = field.required ? ' data-required="true"' : "";
          return `<span contenteditable="true" data-field-name="${name}" data-field-type="${field.type}" data-placeholder="${field.label || name}" class="formdown-inline-field" role="textbox"${requiredAttr}>${field.label || name}</span>`;
        }
        return match;
      });
      return { cleanedLine, inlineFields };
    }
    convertShorthandToField(name, requiredMarker, content, customLabel, typeMarker, rowsOrModifier, attributes) {
      const typeMap = {
        "@": "email",
        "#": "number",
        "%": "tel",
        "&": "url",
        "d": "date",
        "t": "time",
        "dt": "datetime-local",
        "?": "password",
        "T": "textarea",
        "r": "radio",
        "s": "select",
        "c": "checkbox",
        "R": "range",
        "F": "file",
        "C": "color",
        "M": "month",
        "W": "week"
      };
      const type = typeMap[typeMarker] || "text";
      let fieldAttributes = attributes ? this.parseAttributes(attributes) : {};
      if (requiredMarker === "*") {
        fieldAttributes.required = true;
      }
      if (type === "textarea" && rowsOrModifier) {
        fieldAttributes.rows = parseInt(rowsOrModifier, 10);
      }
      if (content) {
        const contentInterpreted = this.interpretContent(content, typeMarker);
        fieldAttributes = { ...fieldAttributes, ...contentInterpreted };
      }
      const typeAndAttributes = this.buildTypeAndAttributesString(type, fieldAttributes);
      return this.createField(name, customLabel, typeAndAttributes);
    }
    interpretContent(content, typeMarker) {
      if (["r", "s", "c"].includes(typeMarker)) {
        const hasOther = content.includes(",*");
        const options2 = content.replace(",*", "");
        const result = { options: options2 };
        if (hasOther) {
          result["allow-other"] = true;
        }
        return result;
      }
      if (["d", "t", "dt"].includes(typeMarker)) {
        return { format: content };
      }
      let pattern = content;
      if (content.includes("#") || content.includes("*") && !content.match(/^\^.*\$$/)) {
        pattern = "^" + content.replace(/[().\/]/g, "\\$&").replace(/-/g, "\\-").replace(/#{1,}/g, (match) => `\\d{${match.length}}`).replace(/\*/g, ".*").replace(/\?/g, ".") + "$";
      }
      return { pattern };
    }
    parseAttributes(attributeString) {
      const attributes = {};
      const attributePattern = /([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/g;
      const matches = Array.from(attributeString.matchAll(attributePattern));
      for (const match of matches) {
        const [, key, quotedValue1, quotedValue2, unquotedValue] = match;
        if (key === "required") {
          attributes.required = true;
        } else if (quotedValue1 !== void 0 || quotedValue2 !== void 0 || unquotedValue !== void 0) {
          const value = quotedValue1 || quotedValue2 || unquotedValue;
          attributes[key] = this.parseAttributeValue(value);
        } else {
          attributes[key] = true;
        }
      }
      return attributes;
    }
    buildTypeAndAttributesString(type, attributes) {
      const parts = [type];
      for (const [key, value] of Object.entries(attributes)) {
        if (value === true) {
          parts.push(key);
        } else if (typeof value === "string") {
          parts.push(`${key}="${value}"`);
        } else {
          parts.push(`${key}=${value}`);
        }
      }
      return parts.join(" ");
    }
    createField(name, customLabel, typeAndAttributes) {
      if (/^\d/.test(name) || !name.trim()) {
        return null;
      }
      if (!typeAndAttributes.trim()) {
        return {
          name,
          type: "text",
          label: customLabel || this.formatLabel(name),
          attributes: {}
        };
      }
      const attributePattern = /([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/g;
      const matches = Array.from(typeAndAttributes.matchAll(attributePattern));
      if (matches.length === 0)
        return null;
      const type = matches[0][1];
      if (!type)
        return null;
      const field = {
        name,
        type,
        label: customLabel || this.formatLabel(name),
        attributes: {}
      };
      for (let i2 = 1; i2 < matches.length; i2++) {
        const [, key, quotedValue1, quotedValue2, unquotedValue] = matches[i2];
        if (key === "required") {
          field.required = true;
        } else if (key === "label" && (quotedValue1 !== void 0 || quotedValue2 !== void 0 || unquotedValue !== void 0)) {
          field.label = quotedValue1 || quotedValue2 || unquotedValue;
        } else if (key === "placeholder" && (quotedValue1 !== void 0 || quotedValue2 !== void 0 || unquotedValue !== void 0)) {
          field.placeholder = quotedValue1 || quotedValue2 || unquotedValue;
        } else if (key === "options" && (quotedValue1 !== void 0 || quotedValue2 !== void 0 || unquotedValue !== void 0)) {
          const optionsValue = quotedValue1 || quotedValue2 || unquotedValue;
          if (["radio", "checkbox", "select"].includes(type)) {
            field.options = optionsValue.split(",").map((opt) => opt.trim()).filter((opt) => opt.length > 0);
          }
        } else if (key === "allow-other") {
          field.allowOther = true;
        } else if (key === "format" && (quotedValue1 !== void 0 || quotedValue2 !== void 0 || unquotedValue !== void 0)) {
          field.format = quotedValue1 || quotedValue2 || unquotedValue;
        } else if (key === "pattern" && (quotedValue1 !== void 0 || quotedValue2 !== void 0 || unquotedValue !== void 0)) {
          field.pattern = quotedValue1 || quotedValue2 || unquotedValue;
        } else if (quotedValue1 !== void 0 || quotedValue2 !== void 0 || unquotedValue !== void 0) {
          const value = quotedValue1 || quotedValue2 || unquotedValue;
          field.attributes[key] = this.parseAttributeValue(value);
        } else {
          field.attributes[key] = true;
        }
      }
      return field;
    }
    /**
     * Generate a human-readable label from a field name
     * @param fieldName - The field name to convert
     * @returns A formatted label string
     */
    formatLabel(fieldName) {
      if (fieldName.includes("_")) {
        return fieldName.split("_").map((word) => this.capitalizeWord(word)).join(" ");
      }
      if (/[a-z][A-Z]/.test(fieldName)) {
        return fieldName.replace(/([a-z])([A-Z])/g, "$1 $2").split(" ").map((word) => this.capitalizeWord(word)).join(" ");
      }
      return this.capitalizeWord(fieldName);
    }
    /**
     * Capitalize the first letter of a word
     * @param word - The word to capitalize
     * @returns The capitalized word
     */
    capitalizeWord(word) {
      if (!word)
        return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    parseAttributeValue(value) {
      if (/^\d+$/.test(value)) {
        return parseInt(value, 10);
      }
      if (/^\d*\.\d+$/.test(value)) {
        return parseFloat(value);
      }
      if (value === "true")
        return true;
      if (value === "false")
        return false;
      return value;
    }
  }
  function _getDefaults() {
    return {
      async: false,
      breaks: false,
      extensions: null,
      gfm: true,
      hooks: null,
      pedantic: false,
      renderer: null,
      silent: false,
      tokenizer: null,
      walkTokens: null
    };
  }
  var _defaults = _getDefaults();
  function changeDefaults(newDefaults) {
    _defaults = newDefaults;
  }
  var noopTest = { exec: () => null };
  function edit(regex, opt = "") {
    let source = typeof regex === "string" ? regex : regex.source;
    const obj = {
      replace: (name, val) => {
        let valSource = typeof val === "string" ? val : val.source;
        valSource = valSource.replace(other.caret, "$1");
        source = source.replace(name, valSource);
        return obj;
      },
      getRegex: () => {
        return new RegExp(source, opt);
      }
    };
    return obj;
  }
  var other = {
    codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
    outputLinkReplace: /\\([\[\]])/g,
    indentCodeCompensation: /^(\s+)(?:```)/,
    beginningSpace: /^\s+/,
    endingHash: /#$/,
    startingSpaceChar: /^ /,
    endingSpaceChar: / $/,
    nonSpaceChar: /[^ ]/,
    newLineCharGlobal: /\n/g,
    tabCharGlobal: /\t/g,
    multipleSpaceGlobal: /\s+/g,
    blankLine: /^[ \t]*$/,
    doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
    blockquoteStart: /^ {0,3}>/,
    blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
    blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
    listReplaceTabs: /^\t+/,
    listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
    listIsTask: /^\[[ xX]\] /,
    listReplaceTask: /^\[[ xX]\] +/,
    anyLine: /\n.*\n/,
    hrefBrackets: /^<(.*)>$/,
    tableDelimiter: /[:|]/,
    tableAlignChars: /^\||\| *$/g,
    tableRowBlankLine: /\n[ \t]*$/,
    tableAlignRight: /^ *-+: *$/,
    tableAlignCenter: /^ *:-+: *$/,
    tableAlignLeft: /^ *:-+ *$/,
    startATag: /^<a /i,
    endATag: /^<\/a>/i,
    startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
    endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
    startAngleBracket: /^</,
    endAngleBracket: />$/,
    pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
    unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
    escapeTest: /[&<>"']/,
    escapeReplace: /[&<>"']/g,
    escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
    escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
    unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
    caret: /(^|[^\[])\^/g,
    percentDecode: /%25/g,
    findPipe: /\|/g,
    splitPipe: / \|/,
    slashPipe: /\\\|/g,
    carriageReturn: /\r\n|\r/g,
    spaceLine: /^ +$/gm,
    notSpaceStart: /^\S*/,
    endingNewline: /\n$/,
    listItemRegex: (bull) => new RegExp(`^( {0,3}${bull})((?:[	 ][^\\n]*)?(?:\\n|$))`),
    nextBulletRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
    hrRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
    fencesBeginRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:\`\`\`|~~~)`),
    headingBeginRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}#`),
    htmlBeginRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}<(?:[a-z].*>|!--)`, "i")
  };
  var newline = /^(?:[ \t]*(?:\n|$))+/;
  var blockCode = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
  var fences = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
  var hr = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
  var heading = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
  var bullet = /(?:[*+-]|\d{1,9}[.)])/;
  var lheadingCore = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
  var lheading = edit(lheadingCore).replace(/bull/g, bullet).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
  var lheadingGfm = edit(lheadingCore).replace(/bull/g, bullet).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
  var _paragraph = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
  var blockText = /^[^\n]+/;
  var _blockLabel = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
  var def = edit(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", _blockLabel).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
  var list = edit(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, bullet).getRegex();
  var _tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
  var _comment = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
  var html = edit(
    "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
    "i"
  ).replace("comment", _comment).replace("tag", _tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
  var paragraph = edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
  var blockquote = edit(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", paragraph).getRegex();
  var blockNormal = {
    blockquote,
    code: blockCode,
    def,
    fences,
    heading,
    hr,
    html,
    lheading,
    list,
    newline,
    paragraph,
    table: noopTest,
    text: blockText
  };
  var gfmTable = edit(
    "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
  ).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
  var blockGfm = {
    ...blockNormal,
    lheading: lheadingGfm,
    table: gfmTable,
    paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", gfmTable).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex()
  };
  var blockPedantic = {
    ...blockNormal,
    html: edit(
      `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
    ).replace("comment", _comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
    heading: /^(#{1,6})(.*)(?:\n+|$)/,
    fences: noopTest,
    // fences not supported
    lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
    paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", lheading).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
  };
  var escape = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
  var inlineCode = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
  var br = /^( {2,}|\\)\n(?!\s*$)/;
  var inlineText = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
  var _punctuation = /[\p{P}\p{S}]/u;
  var _punctuationOrSpace = /[\s\p{P}\p{S}]/u;
  var _notPunctuationOrSpace = /[^\s\p{P}\p{S}]/u;
  var punctuation = edit(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, _punctuationOrSpace).getRegex();
  var _punctuationGfmStrongEm = /(?!~)[\p{P}\p{S}]/u;
  var _punctuationOrSpaceGfmStrongEm = /(?!~)[\s\p{P}\p{S}]/u;
  var _notPunctuationOrSpaceGfmStrongEm = /(?:[^\s\p{P}\p{S}]|~)/u;
  var blockSkip = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g;
  var emStrongLDelimCore = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/;
  var emStrongLDelim = edit(emStrongLDelimCore, "u").replace(/punct/g, _punctuation).getRegex();
  var emStrongLDelimGfm = edit(emStrongLDelimCore, "u").replace(/punct/g, _punctuationGfmStrongEm).getRegex();
  var emStrongRDelimAstCore = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
  var emStrongRDelimAst = edit(emStrongRDelimAstCore, "gu").replace(/notPunctSpace/g, _notPunctuationOrSpace).replace(/punctSpace/g, _punctuationOrSpace).replace(/punct/g, _punctuation).getRegex();
  var emStrongRDelimAstGfm = edit(emStrongRDelimAstCore, "gu").replace(/notPunctSpace/g, _notPunctuationOrSpaceGfmStrongEm).replace(/punctSpace/g, _punctuationOrSpaceGfmStrongEm).replace(/punct/g, _punctuationGfmStrongEm).getRegex();
  var emStrongRDelimUnd = edit(
    "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
    "gu"
  ).replace(/notPunctSpace/g, _notPunctuationOrSpace).replace(/punctSpace/g, _punctuationOrSpace).replace(/punct/g, _punctuation).getRegex();
  var anyPunctuation = edit(/\\(punct)/, "gu").replace(/punct/g, _punctuation).getRegex();
  var autolink = edit(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
  var _inlineComment = edit(_comment).replace("(?:-->|$)", "-->").getRegex();
  var tag = edit(
    "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
  ).replace("comment", _inlineComment).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
  var _inlineLabel = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
  var link = edit(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", _inlineLabel).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
  var reflink = edit(/^!?\[(label)\]\[(ref)\]/).replace("label", _inlineLabel).replace("ref", _blockLabel).getRegex();
  var nolink = edit(/^!?\[(ref)\](?:\[\])?/).replace("ref", _blockLabel).getRegex();
  var reflinkSearch = edit("reflink|nolink(?!\\()", "g").replace("reflink", reflink).replace("nolink", nolink).getRegex();
  var inlineNormal = {
    _backpedal: noopTest,
    // only used for GFM url
    anyPunctuation,
    autolink,
    blockSkip,
    br,
    code: inlineCode,
    del: noopTest,
    emStrongLDelim,
    emStrongRDelimAst,
    emStrongRDelimUnd,
    escape,
    link,
    nolink,
    punctuation,
    reflink,
    reflinkSearch,
    tag,
    text: inlineText,
    url: noopTest
  };
  var inlinePedantic = {
    ...inlineNormal,
    link: edit(/^!?\[(label)\]\((.*?)\)/).replace("label", _inlineLabel).getRegex(),
    reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", _inlineLabel).getRegex()
  };
  var inlineGfm = {
    ...inlineNormal,
    emStrongRDelimAst: emStrongRDelimAstGfm,
    emStrongLDelim: emStrongLDelimGfm,
    url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
    _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
    del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
    text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
  };
  var inlineBreaks = {
    ...inlineGfm,
    br: edit(br).replace("{2,}", "*").getRegex(),
    text: edit(inlineGfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
  };
  var block = {
    normal: blockNormal,
    gfm: blockGfm,
    pedantic: blockPedantic
  };
  var inline = {
    normal: inlineNormal,
    gfm: inlineGfm,
    breaks: inlineBreaks,
    pedantic: inlinePedantic
  };
  var escapeReplacements = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  var getEscapeReplacement = (ch) => escapeReplacements[ch];
  function escape2(html2, encode) {
    if (encode) {
      if (other.escapeTest.test(html2)) {
        return html2.replace(other.escapeReplace, getEscapeReplacement);
      }
    } else {
      if (other.escapeTestNoEncode.test(html2)) {
        return html2.replace(other.escapeReplaceNoEncode, getEscapeReplacement);
      }
    }
    return html2;
  }
  function cleanUrl(href) {
    try {
      href = encodeURI(href).replace(other.percentDecode, "%");
    } catch {
      return null;
    }
    return href;
  }
  function splitCells(tableRow, count) {
    var _a2;
    const row = tableRow.replace(other.findPipe, (match, offset, str) => {
      let escaped = false;
      let curr = offset;
      while (--curr >= 0 && str[curr] === "\\") escaped = !escaped;
      if (escaped) {
        return "|";
      } else {
        return " |";
      }
    }), cells = row.split(other.splitPipe);
    let i2 = 0;
    if (!cells[0].trim()) {
      cells.shift();
    }
    if (cells.length > 0 && !((_a2 = cells.at(-1)) == null ? void 0 : _a2.trim())) {
      cells.pop();
    }
    if (count) {
      if (cells.length > count) {
        cells.splice(count);
      } else {
        while (cells.length < count) cells.push("");
      }
    }
    for (; i2 < cells.length; i2++) {
      cells[i2] = cells[i2].trim().replace(other.slashPipe, "|");
    }
    return cells;
  }
  function rtrim(str, c2, invert) {
    const l2 = str.length;
    if (l2 === 0) {
      return "";
    }
    let suffLen = 0;
    while (suffLen < l2) {
      const currChar = str.charAt(l2 - suffLen - 1);
      if (currChar === c2 && !invert) {
        suffLen++;
      } else if (currChar !== c2 && invert) {
        suffLen++;
      } else {
        break;
      }
    }
    return str.slice(0, l2 - suffLen);
  }
  function findClosingBracket(str, b2) {
    if (str.indexOf(b2[1]) === -1) {
      return -1;
    }
    let level = 0;
    for (let i2 = 0; i2 < str.length; i2++) {
      if (str[i2] === "\\") {
        i2++;
      } else if (str[i2] === b2[0]) {
        level++;
      } else if (str[i2] === b2[1]) {
        level--;
        if (level < 0) {
          return i2;
        }
      }
    }
    if (level > 0) {
      return -2;
    }
    return -1;
  }
  function outputLink(cap, link2, raw, lexer2, rules) {
    const href = link2.href;
    const title = link2.title || null;
    const text = cap[1].replace(rules.other.outputLinkReplace, "$1");
    lexer2.state.inLink = true;
    const token = {
      type: cap[0].charAt(0) === "!" ? "image" : "link",
      raw,
      href,
      title,
      text,
      tokens: lexer2.inlineTokens(text)
    };
    lexer2.state.inLink = false;
    return token;
  }
  function indentCodeCompensation(raw, text, rules) {
    const matchIndentToCode = raw.match(rules.other.indentCodeCompensation);
    if (matchIndentToCode === null) {
      return text;
    }
    const indentToCode = matchIndentToCode[1];
    return text.split("\n").map((node) => {
      const matchIndentInNode = node.match(rules.other.beginningSpace);
      if (matchIndentInNode === null) {
        return node;
      }
      const [indentInNode] = matchIndentInNode;
      if (indentInNode.length >= indentToCode.length) {
        return node.slice(indentToCode.length);
      }
      return node;
    }).join("\n");
  }
  var _Tokenizer = class {
    // set by the lexer
    constructor(options2) {
      __publicField(this, "options");
      __publicField(this, "rules");
      // set by the lexer
      __publicField(this, "lexer");
      this.options = options2 || _defaults;
    }
    space(src) {
      const cap = this.rules.block.newline.exec(src);
      if (cap && cap[0].length > 0) {
        return {
          type: "space",
          raw: cap[0]
        };
      }
    }
    code(src) {
      const cap = this.rules.block.code.exec(src);
      if (cap) {
        const text = cap[0].replace(this.rules.other.codeRemoveIndent, "");
        return {
          type: "code",
          raw: cap[0],
          codeBlockStyle: "indented",
          text: !this.options.pedantic ? rtrim(text, "\n") : text
        };
      }
    }
    fences(src) {
      const cap = this.rules.block.fences.exec(src);
      if (cap) {
        const raw = cap[0];
        const text = indentCodeCompensation(raw, cap[3] || "", this.rules);
        return {
          type: "code",
          raw,
          lang: cap[2] ? cap[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : cap[2],
          text
        };
      }
    }
    heading(src) {
      const cap = this.rules.block.heading.exec(src);
      if (cap) {
        let text = cap[2].trim();
        if (this.rules.other.endingHash.test(text)) {
          const trimmed = rtrim(text, "#");
          if (this.options.pedantic) {
            text = trimmed.trim();
          } else if (!trimmed || this.rules.other.endingSpaceChar.test(trimmed)) {
            text = trimmed.trim();
          }
        }
        return {
          type: "heading",
          raw: cap[0],
          depth: cap[1].length,
          text,
          tokens: this.lexer.inline(text)
        };
      }
    }
    hr(src) {
      const cap = this.rules.block.hr.exec(src);
      if (cap) {
        return {
          type: "hr",
          raw: rtrim(cap[0], "\n")
        };
      }
    }
    blockquote(src) {
      const cap = this.rules.block.blockquote.exec(src);
      if (cap) {
        let lines = rtrim(cap[0], "\n").split("\n");
        let raw = "";
        let text = "";
        const tokens = [];
        while (lines.length > 0) {
          let inBlockquote = false;
          const currentLines = [];
          let i2;
          for (i2 = 0; i2 < lines.length; i2++) {
            if (this.rules.other.blockquoteStart.test(lines[i2])) {
              currentLines.push(lines[i2]);
              inBlockquote = true;
            } else if (!inBlockquote) {
              currentLines.push(lines[i2]);
            } else {
              break;
            }
          }
          lines = lines.slice(i2);
          const currentRaw = currentLines.join("\n");
          const currentText = currentRaw.replace(this.rules.other.blockquoteSetextReplace, "\n    $1").replace(this.rules.other.blockquoteSetextReplace2, "");
          raw = raw ? `${raw}
${currentRaw}` : currentRaw;
          text = text ? `${text}
${currentText}` : currentText;
          const top = this.lexer.state.top;
          this.lexer.state.top = true;
          this.lexer.blockTokens(currentText, tokens, true);
          this.lexer.state.top = top;
          if (lines.length === 0) {
            break;
          }
          const lastToken = tokens.at(-1);
          if ((lastToken == null ? void 0 : lastToken.type) === "code") {
            break;
          } else if ((lastToken == null ? void 0 : lastToken.type) === "blockquote") {
            const oldToken = lastToken;
            const newText = oldToken.raw + "\n" + lines.join("\n");
            const newToken = this.blockquote(newText);
            tokens[tokens.length - 1] = newToken;
            raw = raw.substring(0, raw.length - oldToken.raw.length) + newToken.raw;
            text = text.substring(0, text.length - oldToken.text.length) + newToken.text;
            break;
          } else if ((lastToken == null ? void 0 : lastToken.type) === "list") {
            const oldToken = lastToken;
            const newText = oldToken.raw + "\n" + lines.join("\n");
            const newToken = this.list(newText);
            tokens[tokens.length - 1] = newToken;
            raw = raw.substring(0, raw.length - lastToken.raw.length) + newToken.raw;
            text = text.substring(0, text.length - oldToken.raw.length) + newToken.raw;
            lines = newText.substring(tokens.at(-1).raw.length).split("\n");
            continue;
          }
        }
        return {
          type: "blockquote",
          raw,
          tokens,
          text
        };
      }
    }
    list(src) {
      let cap = this.rules.block.list.exec(src);
      if (cap) {
        let bull = cap[1].trim();
        const isordered = bull.length > 1;
        const list2 = {
          type: "list",
          raw: "",
          ordered: isordered,
          start: isordered ? +bull.slice(0, -1) : "",
          loose: false,
          items: []
        };
        bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;
        if (this.options.pedantic) {
          bull = isordered ? bull : "[*+-]";
        }
        const itemRegex = this.rules.other.listItemRegex(bull);
        let endsWithBlankLine = false;
        while (src) {
          let endEarly = false;
          let raw = "";
          let itemContents = "";
          if (!(cap = itemRegex.exec(src))) {
            break;
          }
          if (this.rules.block.hr.test(src)) {
            break;
          }
          raw = cap[0];
          src = src.substring(raw.length);
          let line = cap[2].split("\n", 1)[0].replace(this.rules.other.listReplaceTabs, (t2) => " ".repeat(3 * t2.length));
          let nextLine = src.split("\n", 1)[0];
          let blankLine = !line.trim();
          let indent = 0;
          if (this.options.pedantic) {
            indent = 2;
            itemContents = line.trimStart();
          } else if (blankLine) {
            indent = cap[1].length + 1;
          } else {
            indent = cap[2].search(this.rules.other.nonSpaceChar);
            indent = indent > 4 ? 1 : indent;
            itemContents = line.slice(indent);
            indent += cap[1].length;
          }
          if (blankLine && this.rules.other.blankLine.test(nextLine)) {
            raw += nextLine + "\n";
            src = src.substring(nextLine.length + 1);
            endEarly = true;
          }
          if (!endEarly) {
            const nextBulletRegex = this.rules.other.nextBulletRegex(indent);
            const hrRegex = this.rules.other.hrRegex(indent);
            const fencesBeginRegex = this.rules.other.fencesBeginRegex(indent);
            const headingBeginRegex = this.rules.other.headingBeginRegex(indent);
            const htmlBeginRegex = this.rules.other.htmlBeginRegex(indent);
            while (src) {
              const rawLine = src.split("\n", 1)[0];
              let nextLineWithoutTabs;
              nextLine = rawLine;
              if (this.options.pedantic) {
                nextLine = nextLine.replace(this.rules.other.listReplaceNesting, "  ");
                nextLineWithoutTabs = nextLine;
              } else {
                nextLineWithoutTabs = nextLine.replace(this.rules.other.tabCharGlobal, "    ");
              }
              if (fencesBeginRegex.test(nextLine)) {
                break;
              }
              if (headingBeginRegex.test(nextLine)) {
                break;
              }
              if (htmlBeginRegex.test(nextLine)) {
                break;
              }
              if (nextBulletRegex.test(nextLine)) {
                break;
              }
              if (hrRegex.test(nextLine)) {
                break;
              }
              if (nextLineWithoutTabs.search(this.rules.other.nonSpaceChar) >= indent || !nextLine.trim()) {
                itemContents += "\n" + nextLineWithoutTabs.slice(indent);
              } else {
                if (blankLine) {
                  break;
                }
                if (line.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4) {
                  break;
                }
                if (fencesBeginRegex.test(line)) {
                  break;
                }
                if (headingBeginRegex.test(line)) {
                  break;
                }
                if (hrRegex.test(line)) {
                  break;
                }
                itemContents += "\n" + nextLine;
              }
              if (!blankLine && !nextLine.trim()) {
                blankLine = true;
              }
              raw += rawLine + "\n";
              src = src.substring(rawLine.length + 1);
              line = nextLineWithoutTabs.slice(indent);
            }
          }
          if (!list2.loose) {
            if (endsWithBlankLine) {
              list2.loose = true;
            } else if (this.rules.other.doubleBlankLine.test(raw)) {
              endsWithBlankLine = true;
            }
          }
          let istask = null;
          let ischecked;
          if (this.options.gfm) {
            istask = this.rules.other.listIsTask.exec(itemContents);
            if (istask) {
              ischecked = istask[0] !== "[ ] ";
              itemContents = itemContents.replace(this.rules.other.listReplaceTask, "");
            }
          }
          list2.items.push({
            type: "list_item",
            raw,
            task: !!istask,
            checked: ischecked,
            loose: false,
            text: itemContents,
            tokens: []
          });
          list2.raw += raw;
        }
        const lastItem = list2.items.at(-1);
        if (lastItem) {
          lastItem.raw = lastItem.raw.trimEnd();
          lastItem.text = lastItem.text.trimEnd();
        } else {
          return;
        }
        list2.raw = list2.raw.trimEnd();
        for (let i2 = 0; i2 < list2.items.length; i2++) {
          this.lexer.state.top = false;
          list2.items[i2].tokens = this.lexer.blockTokens(list2.items[i2].text, []);
          if (!list2.loose) {
            const spacers = list2.items[i2].tokens.filter((t2) => t2.type === "space");
            const hasMultipleLineBreaks = spacers.length > 0 && spacers.some((t2) => this.rules.other.anyLine.test(t2.raw));
            list2.loose = hasMultipleLineBreaks;
          }
        }
        if (list2.loose) {
          for (let i2 = 0; i2 < list2.items.length; i2++) {
            list2.items[i2].loose = true;
          }
        }
        return list2;
      }
    }
    html(src) {
      const cap = this.rules.block.html.exec(src);
      if (cap) {
        const token = {
          type: "html",
          block: true,
          raw: cap[0],
          pre: cap[1] === "pre" || cap[1] === "script" || cap[1] === "style",
          text: cap[0]
        };
        return token;
      }
    }
    def(src) {
      const cap = this.rules.block.def.exec(src);
      if (cap) {
        const tag2 = cap[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " ");
        const href = cap[2] ? cap[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "";
        const title = cap[3] ? cap[3].substring(1, cap[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : cap[3];
        return {
          type: "def",
          tag: tag2,
          raw: cap[0],
          href,
          title
        };
      }
    }
    table(src) {
      var _a2;
      const cap = this.rules.block.table.exec(src);
      if (!cap) {
        return;
      }
      if (!this.rules.other.tableDelimiter.test(cap[2])) {
        return;
      }
      const headers = splitCells(cap[1]);
      const aligns = cap[2].replace(this.rules.other.tableAlignChars, "").split("|");
      const rows = ((_a2 = cap[3]) == null ? void 0 : _a2.trim()) ? cap[3].replace(this.rules.other.tableRowBlankLine, "").split("\n") : [];
      const item = {
        type: "table",
        raw: cap[0],
        header: [],
        align: [],
        rows: []
      };
      if (headers.length !== aligns.length) {
        return;
      }
      for (const align of aligns) {
        if (this.rules.other.tableAlignRight.test(align)) {
          item.align.push("right");
        } else if (this.rules.other.tableAlignCenter.test(align)) {
          item.align.push("center");
        } else if (this.rules.other.tableAlignLeft.test(align)) {
          item.align.push("left");
        } else {
          item.align.push(null);
        }
      }
      for (let i2 = 0; i2 < headers.length; i2++) {
        item.header.push({
          text: headers[i2],
          tokens: this.lexer.inline(headers[i2]),
          header: true,
          align: item.align[i2]
        });
      }
      for (const row of rows) {
        item.rows.push(splitCells(row, item.header.length).map((cell, i2) => {
          return {
            text: cell,
            tokens: this.lexer.inline(cell),
            header: false,
            align: item.align[i2]
          };
        }));
      }
      return item;
    }
    lheading(src) {
      const cap = this.rules.block.lheading.exec(src);
      if (cap) {
        return {
          type: "heading",
          raw: cap[0],
          depth: cap[2].charAt(0) === "=" ? 1 : 2,
          text: cap[1],
          tokens: this.lexer.inline(cap[1])
        };
      }
    }
    paragraph(src) {
      const cap = this.rules.block.paragraph.exec(src);
      if (cap) {
        const text = cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1];
        return {
          type: "paragraph",
          raw: cap[0],
          text,
          tokens: this.lexer.inline(text)
        };
      }
    }
    text(src) {
      const cap = this.rules.block.text.exec(src);
      if (cap) {
        return {
          type: "text",
          raw: cap[0],
          text: cap[0],
          tokens: this.lexer.inline(cap[0])
        };
      }
    }
    escape(src) {
      const cap = this.rules.inline.escape.exec(src);
      if (cap) {
        return {
          type: "escape",
          raw: cap[0],
          text: cap[1]
        };
      }
    }
    tag(src) {
      const cap = this.rules.inline.tag.exec(src);
      if (cap) {
        if (!this.lexer.state.inLink && this.rules.other.startATag.test(cap[0])) {
          this.lexer.state.inLink = true;
        } else if (this.lexer.state.inLink && this.rules.other.endATag.test(cap[0])) {
          this.lexer.state.inLink = false;
        }
        if (!this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(cap[0])) {
          this.lexer.state.inRawBlock = true;
        } else if (this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(cap[0])) {
          this.lexer.state.inRawBlock = false;
        }
        return {
          type: "html",
          raw: cap[0],
          inLink: this.lexer.state.inLink,
          inRawBlock: this.lexer.state.inRawBlock,
          block: false,
          text: cap[0]
        };
      }
    }
    link(src) {
      const cap = this.rules.inline.link.exec(src);
      if (cap) {
        const trimmedUrl = cap[2].trim();
        if (!this.options.pedantic && this.rules.other.startAngleBracket.test(trimmedUrl)) {
          if (!this.rules.other.endAngleBracket.test(trimmedUrl)) {
            return;
          }
          const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), "\\");
          if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
            return;
          }
        } else {
          const lastParenIndex = findClosingBracket(cap[2], "()");
          if (lastParenIndex === -2) {
            return;
          }
          if (lastParenIndex > -1) {
            const start = cap[0].indexOf("!") === 0 ? 5 : 4;
            const linkLen = start + cap[1].length + lastParenIndex;
            cap[2] = cap[2].substring(0, lastParenIndex);
            cap[0] = cap[0].substring(0, linkLen).trim();
            cap[3] = "";
          }
        }
        let href = cap[2];
        let title = "";
        if (this.options.pedantic) {
          const link2 = this.rules.other.pedanticHrefTitle.exec(href);
          if (link2) {
            href = link2[1];
            title = link2[3];
          }
        } else {
          title = cap[3] ? cap[3].slice(1, -1) : "";
        }
        href = href.trim();
        if (this.rules.other.startAngleBracket.test(href)) {
          if (this.options.pedantic && !this.rules.other.endAngleBracket.test(trimmedUrl)) {
            href = href.slice(1);
          } else {
            href = href.slice(1, -1);
          }
        }
        return outputLink(cap, {
          href: href ? href.replace(this.rules.inline.anyPunctuation, "$1") : href,
          title: title ? title.replace(this.rules.inline.anyPunctuation, "$1") : title
        }, cap[0], this.lexer, this.rules);
      }
    }
    reflink(src, links) {
      let cap;
      if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
        const linkString = (cap[2] || cap[1]).replace(this.rules.other.multipleSpaceGlobal, " ");
        const link2 = links[linkString.toLowerCase()];
        if (!link2) {
          const text = cap[0].charAt(0);
          return {
            type: "text",
            raw: text,
            text
          };
        }
        return outputLink(cap, link2, cap[0], this.lexer, this.rules);
      }
    }
    emStrong(src, maskedSrc, prevChar = "") {
      let match = this.rules.inline.emStrongLDelim.exec(src);
      if (!match) return;
      if (match[3] && prevChar.match(this.rules.other.unicodeAlphaNumeric)) return;
      const nextChar = match[1] || match[2] || "";
      if (!nextChar || !prevChar || this.rules.inline.punctuation.exec(prevChar)) {
        const lLength = [...match[0]].length - 1;
        let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;
        const endReg = match[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
        endReg.lastIndex = 0;
        maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
        while ((match = endReg.exec(maskedSrc)) != null) {
          rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
          if (!rDelim) continue;
          rLength = [...rDelim].length;
          if (match[3] || match[4]) {
            delimTotal += rLength;
            continue;
          } else if (match[5] || match[6]) {
            if (lLength % 3 && !((lLength + rLength) % 3)) {
              midDelimTotal += rLength;
              continue;
            }
          }
          delimTotal -= rLength;
          if (delimTotal > 0) continue;
          rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
          const lastCharLength = [...match[0]][0].length;
          const raw = src.slice(0, lLength + match.index + lastCharLength + rLength);
          if (Math.min(lLength, rLength) % 2) {
            const text2 = raw.slice(1, -1);
            return {
              type: "em",
              raw,
              text: text2,
              tokens: this.lexer.inlineTokens(text2)
            };
          }
          const text = raw.slice(2, -2);
          return {
            type: "strong",
            raw,
            text,
            tokens: this.lexer.inlineTokens(text)
          };
        }
      }
    }
    codespan(src) {
      const cap = this.rules.inline.code.exec(src);
      if (cap) {
        let text = cap[2].replace(this.rules.other.newLineCharGlobal, " ");
        const hasNonSpaceChars = this.rules.other.nonSpaceChar.test(text);
        const hasSpaceCharsOnBothEnds = this.rules.other.startingSpaceChar.test(text) && this.rules.other.endingSpaceChar.test(text);
        if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
          text = text.substring(1, text.length - 1);
        }
        return {
          type: "codespan",
          raw: cap[0],
          text
        };
      }
    }
    br(src) {
      const cap = this.rules.inline.br.exec(src);
      if (cap) {
        return {
          type: "br",
          raw: cap[0]
        };
      }
    }
    del(src) {
      const cap = this.rules.inline.del.exec(src);
      if (cap) {
        return {
          type: "del",
          raw: cap[0],
          text: cap[2],
          tokens: this.lexer.inlineTokens(cap[2])
        };
      }
    }
    autolink(src) {
      const cap = this.rules.inline.autolink.exec(src);
      if (cap) {
        let text, href;
        if (cap[2] === "@") {
          text = cap[1];
          href = "mailto:" + text;
        } else {
          text = cap[1];
          href = text;
        }
        return {
          type: "link",
          raw: cap[0],
          text,
          href,
          tokens: [
            {
              type: "text",
              raw: text,
              text
            }
          ]
        };
      }
    }
    url(src) {
      var _a2;
      let cap;
      if (cap = this.rules.inline.url.exec(src)) {
        let text, href;
        if (cap[2] === "@") {
          text = cap[0];
          href = "mailto:" + text;
        } else {
          let prevCapZero;
          do {
            prevCapZero = cap[0];
            cap[0] = ((_a2 = this.rules.inline._backpedal.exec(cap[0])) == null ? void 0 : _a2[0]) ?? "";
          } while (prevCapZero !== cap[0]);
          text = cap[0];
          if (cap[1] === "www.") {
            href = "http://" + cap[0];
          } else {
            href = cap[0];
          }
        }
        return {
          type: "link",
          raw: cap[0],
          text,
          href,
          tokens: [
            {
              type: "text",
              raw: text,
              text
            }
          ]
        };
      }
    }
    inlineText(src) {
      const cap = this.rules.inline.text.exec(src);
      if (cap) {
        const escaped = this.lexer.state.inRawBlock;
        return {
          type: "text",
          raw: cap[0],
          text: cap[0],
          escaped
        };
      }
    }
  };
  var _Lexer = class __Lexer {
    constructor(options2) {
      __publicField(this, "tokens");
      __publicField(this, "options");
      __publicField(this, "state");
      __publicField(this, "tokenizer");
      __publicField(this, "inlineQueue");
      this.tokens = [];
      this.tokens.links = /* @__PURE__ */ Object.create(null);
      this.options = options2 || _defaults;
      this.options.tokenizer = this.options.tokenizer || new _Tokenizer();
      this.tokenizer = this.options.tokenizer;
      this.tokenizer.options = this.options;
      this.tokenizer.lexer = this;
      this.inlineQueue = [];
      this.state = {
        inLink: false,
        inRawBlock: false,
        top: true
      };
      const rules = {
        other,
        block: block.normal,
        inline: inline.normal
      };
      if (this.options.pedantic) {
        rules.block = block.pedantic;
        rules.inline = inline.pedantic;
      } else if (this.options.gfm) {
        rules.block = block.gfm;
        if (this.options.breaks) {
          rules.inline = inline.breaks;
        } else {
          rules.inline = inline.gfm;
        }
      }
      this.tokenizer.rules = rules;
    }
    /**
     * Expose Rules
     */
    static get rules() {
      return {
        block,
        inline
      };
    }
    /**
     * Static Lex Method
     */
    static lex(src, options2) {
      const lexer2 = new __Lexer(options2);
      return lexer2.lex(src);
    }
    /**
     * Static Lex Inline Method
     */
    static lexInline(src, options2) {
      const lexer2 = new __Lexer(options2);
      return lexer2.inlineTokens(src);
    }
    /**
     * Preprocessing
     */
    lex(src) {
      src = src.replace(other.carriageReturn, "\n");
      this.blockTokens(src, this.tokens);
      for (let i2 = 0; i2 < this.inlineQueue.length; i2++) {
        const next = this.inlineQueue[i2];
        this.inlineTokens(next.src, next.tokens);
      }
      this.inlineQueue = [];
      return this.tokens;
    }
    blockTokens(src, tokens = [], lastParagraphClipped = false) {
      var _a2, _b2, _c2;
      if (this.options.pedantic) {
        src = src.replace(other.tabCharGlobal, "    ").replace(other.spaceLine, "");
      }
      while (src) {
        let token;
        if ((_b2 = (_a2 = this.options.extensions) == null ? void 0 : _a2.block) == null ? void 0 : _b2.some((extTokenizer) => {
          if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            return true;
          }
          return false;
        })) {
          continue;
        }
        if (token = this.tokenizer.space(src)) {
          src = src.substring(token.raw.length);
          const lastToken = tokens.at(-1);
          if (token.raw.length === 1 && lastToken !== void 0) {
            lastToken.raw += "\n";
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (token = this.tokenizer.code(src)) {
          src = src.substring(token.raw.length);
          const lastToken = tokens.at(-1);
          if ((lastToken == null ? void 0 : lastToken.type) === "paragraph" || (lastToken == null ? void 0 : lastToken.type) === "text") {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.text;
            this.inlineQueue.at(-1).src = lastToken.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (token = this.tokenizer.fences(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.heading(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.hr(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.blockquote(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.list(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.html(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.def(src)) {
          src = src.substring(token.raw.length);
          const lastToken = tokens.at(-1);
          if ((lastToken == null ? void 0 : lastToken.type) === "paragraph" || (lastToken == null ? void 0 : lastToken.type) === "text") {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.raw;
            this.inlineQueue.at(-1).src = lastToken.text;
          } else if (!this.tokens.links[token.tag]) {
            this.tokens.links[token.tag] = {
              href: token.href,
              title: token.title
            };
          }
          continue;
        }
        if (token = this.tokenizer.table(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.lheading(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        let cutSrc = src;
        if ((_c2 = this.options.extensions) == null ? void 0 : _c2.startBlock) {
          let startIndex = Infinity;
          const tempSrc = src.slice(1);
          let tempStart;
          this.options.extensions.startBlock.forEach((getStartIndex) => {
            tempStart = getStartIndex.call({ lexer: this }, tempSrc);
            if (typeof tempStart === "number" && tempStart >= 0) {
              startIndex = Math.min(startIndex, tempStart);
            }
          });
          if (startIndex < Infinity && startIndex >= 0) {
            cutSrc = src.substring(0, startIndex + 1);
          }
        }
        if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
          const lastToken = tokens.at(-1);
          if (lastParagraphClipped && (lastToken == null ? void 0 : lastToken.type) === "paragraph") {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.text;
            this.inlineQueue.pop();
            this.inlineQueue.at(-1).src = lastToken.text;
          } else {
            tokens.push(token);
          }
          lastParagraphClipped = cutSrc.length !== src.length;
          src = src.substring(token.raw.length);
          continue;
        }
        if (token = this.tokenizer.text(src)) {
          src = src.substring(token.raw.length);
          const lastToken = tokens.at(-1);
          if ((lastToken == null ? void 0 : lastToken.type) === "text") {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.text;
            this.inlineQueue.pop();
            this.inlineQueue.at(-1).src = lastToken.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (src) {
          const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
          if (this.options.silent) {
            console.error(errMsg);
            break;
          } else {
            throw new Error(errMsg);
          }
        }
      }
      this.state.top = true;
      return tokens;
    }
    inline(src, tokens = []) {
      this.inlineQueue.push({ src, tokens });
      return tokens;
    }
    /**
     * Lexing/Compiling
     */
    inlineTokens(src, tokens = []) {
      var _a2, _b2, _c2;
      let maskedSrc = src;
      let match = null;
      if (this.tokens.links) {
        const links = Object.keys(this.tokens.links);
        if (links.length > 0) {
          while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
            if (links.includes(match[0].slice(match[0].lastIndexOf("[") + 1, -1))) {
              maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
            }
          }
        }
      }
      while ((match = this.tokenizer.rules.inline.anyPunctuation.exec(maskedSrc)) != null) {
        maskedSrc = maskedSrc.slice(0, match.index) + "++" + maskedSrc.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
      }
      while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
        maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
      }
      let keepPrevChar = false;
      let prevChar = "";
      while (src) {
        if (!keepPrevChar) {
          prevChar = "";
        }
        keepPrevChar = false;
        let token;
        if ((_b2 = (_a2 = this.options.extensions) == null ? void 0 : _a2.inline) == null ? void 0 : _b2.some((extTokenizer) => {
          if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            return true;
          }
          return false;
        })) {
          continue;
        }
        if (token = this.tokenizer.escape(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.tag(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.link(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.reflink(src, this.tokens.links)) {
          src = src.substring(token.raw.length);
          const lastToken = tokens.at(-1);
          if (token.type === "text" && (lastToken == null ? void 0 : lastToken.type) === "text") {
            lastToken.raw += token.raw;
            lastToken.text += token.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.codespan(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.br(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.del(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.autolink(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (!this.state.inLink && (token = this.tokenizer.url(src))) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        let cutSrc = src;
        if ((_c2 = this.options.extensions) == null ? void 0 : _c2.startInline) {
          let startIndex = Infinity;
          const tempSrc = src.slice(1);
          let tempStart;
          this.options.extensions.startInline.forEach((getStartIndex) => {
            tempStart = getStartIndex.call({ lexer: this }, tempSrc);
            if (typeof tempStart === "number" && tempStart >= 0) {
              startIndex = Math.min(startIndex, tempStart);
            }
          });
          if (startIndex < Infinity && startIndex >= 0) {
            cutSrc = src.substring(0, startIndex + 1);
          }
        }
        if (token = this.tokenizer.inlineText(cutSrc)) {
          src = src.substring(token.raw.length);
          if (token.raw.slice(-1) !== "_") {
            prevChar = token.raw.slice(-1);
          }
          keepPrevChar = true;
          const lastToken = tokens.at(-1);
          if ((lastToken == null ? void 0 : lastToken.type) === "text") {
            lastToken.raw += token.raw;
            lastToken.text += token.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (src) {
          const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
          if (this.options.silent) {
            console.error(errMsg);
            break;
          } else {
            throw new Error(errMsg);
          }
        }
      }
      return tokens;
    }
  };
  var _Renderer = class {
    // set by the parser
    constructor(options2) {
      __publicField(this, "options");
      __publicField(this, "parser");
      this.options = options2 || _defaults;
    }
    space(token) {
      return "";
    }
    code({ text, lang, escaped }) {
      var _a2;
      const langString = (_a2 = (lang || "").match(other.notSpaceStart)) == null ? void 0 : _a2[0];
      const code = text.replace(other.endingNewline, "") + "\n";
      if (!langString) {
        return "<pre><code>" + (escaped ? code : escape2(code, true)) + "</code></pre>\n";
      }
      return '<pre><code class="language-' + escape2(langString) + '">' + (escaped ? code : escape2(code, true)) + "</code></pre>\n";
    }
    blockquote({ tokens }) {
      const body = this.parser.parse(tokens);
      return `<blockquote>
${body}</blockquote>
`;
    }
    html({ text }) {
      return text;
    }
    heading({ tokens, depth }) {
      return `<h${depth}>${this.parser.parseInline(tokens)}</h${depth}>
`;
    }
    hr(token) {
      return "<hr>\n";
    }
    list(token) {
      const ordered = token.ordered;
      const start = token.start;
      let body = "";
      for (let j2 = 0; j2 < token.items.length; j2++) {
        const item = token.items[j2];
        body += this.listitem(item);
      }
      const type = ordered ? "ol" : "ul";
      const startAttr = ordered && start !== 1 ? ' start="' + start + '"' : "";
      return "<" + type + startAttr + ">\n" + body + "</" + type + ">\n";
    }
    listitem(item) {
      var _a2;
      let itemBody = "";
      if (item.task) {
        const checkbox = this.checkbox({ checked: !!item.checked });
        if (item.loose) {
          if (((_a2 = item.tokens[0]) == null ? void 0 : _a2.type) === "paragraph") {
            item.tokens[0].text = checkbox + " " + item.tokens[0].text;
            if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === "text") {
              item.tokens[0].tokens[0].text = checkbox + " " + escape2(item.tokens[0].tokens[0].text);
              item.tokens[0].tokens[0].escaped = true;
            }
          } else {
            item.tokens.unshift({
              type: "text",
              raw: checkbox + " ",
              text: checkbox + " ",
              escaped: true
            });
          }
        } else {
          itemBody += checkbox + " ";
        }
      }
      itemBody += this.parser.parse(item.tokens, !!item.loose);
      return `<li>${itemBody}</li>
`;
    }
    checkbox({ checked }) {
      return "<input " + (checked ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
    }
    paragraph({ tokens }) {
      return `<p>${this.parser.parseInline(tokens)}</p>
`;
    }
    table(token) {
      let header = "";
      let cell = "";
      for (let j2 = 0; j2 < token.header.length; j2++) {
        cell += this.tablecell(token.header[j2]);
      }
      header += this.tablerow({ text: cell });
      let body = "";
      for (let j2 = 0; j2 < token.rows.length; j2++) {
        const row = token.rows[j2];
        cell = "";
        for (let k2 = 0; k2 < row.length; k2++) {
          cell += this.tablecell(row[k2]);
        }
        body += this.tablerow({ text: cell });
      }
      if (body) body = `<tbody>${body}</tbody>`;
      return "<table>\n<thead>\n" + header + "</thead>\n" + body + "</table>\n";
    }
    tablerow({ text }) {
      return `<tr>
${text}</tr>
`;
    }
    tablecell(token) {
      const content = this.parser.parseInline(token.tokens);
      const type = token.header ? "th" : "td";
      const tag2 = token.align ? `<${type} align="${token.align}">` : `<${type}>`;
      return tag2 + content + `</${type}>
`;
    }
    /**
     * span level renderer
     */
    strong({ tokens }) {
      return `<strong>${this.parser.parseInline(tokens)}</strong>`;
    }
    em({ tokens }) {
      return `<em>${this.parser.parseInline(tokens)}</em>`;
    }
    codespan({ text }) {
      return `<code>${escape2(text, true)}</code>`;
    }
    br(token) {
      return "<br>";
    }
    del({ tokens }) {
      return `<del>${this.parser.parseInline(tokens)}</del>`;
    }
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const cleanHref = cleanUrl(href);
      if (cleanHref === null) {
        return text;
      }
      href = cleanHref;
      let out = '<a href="' + href + '"';
      if (title) {
        out += ' title="' + escape2(title) + '"';
      }
      out += ">" + text + "</a>";
      return out;
    }
    image({ href, title, text, tokens }) {
      if (tokens) {
        text = this.parser.parseInline(tokens, this.parser.textRenderer);
      }
      const cleanHref = cleanUrl(href);
      if (cleanHref === null) {
        return escape2(text);
      }
      href = cleanHref;
      let out = `<img src="${href}" alt="${text}"`;
      if (title) {
        out += ` title="${escape2(title)}"`;
      }
      out += ">";
      return out;
    }
    text(token) {
      return "tokens" in token && token.tokens ? this.parser.parseInline(token.tokens) : "escaped" in token && token.escaped ? token.text : escape2(token.text);
    }
  };
  var _TextRenderer = class {
    // no need for block level renderers
    strong({ text }) {
      return text;
    }
    em({ text }) {
      return text;
    }
    codespan({ text }) {
      return text;
    }
    del({ text }) {
      return text;
    }
    html({ text }) {
      return text;
    }
    text({ text }) {
      return text;
    }
    link({ text }) {
      return "" + text;
    }
    image({ text }) {
      return "" + text;
    }
    br() {
      return "";
    }
  };
  var _Parser = class __Parser {
    constructor(options2) {
      __publicField(this, "options");
      __publicField(this, "renderer");
      __publicField(this, "textRenderer");
      this.options = options2 || _defaults;
      this.options.renderer = this.options.renderer || new _Renderer();
      this.renderer = this.options.renderer;
      this.renderer.options = this.options;
      this.renderer.parser = this;
      this.textRenderer = new _TextRenderer();
    }
    /**
     * Static Parse Method
     */
    static parse(tokens, options2) {
      const parser2 = new __Parser(options2);
      return parser2.parse(tokens);
    }
    /**
     * Static Parse Inline Method
     */
    static parseInline(tokens, options2) {
      const parser2 = new __Parser(options2);
      return parser2.parseInline(tokens);
    }
    /**
     * Parse Loop
     */
    parse(tokens, top = true) {
      var _a2, _b2;
      let out = "";
      for (let i2 = 0; i2 < tokens.length; i2++) {
        const anyToken = tokens[i2];
        if ((_b2 = (_a2 = this.options.extensions) == null ? void 0 : _a2.renderers) == null ? void 0 : _b2[anyToken.type]) {
          const genericToken = anyToken;
          const ret = this.options.extensions.renderers[genericToken.type].call({ parser: this }, genericToken);
          if (ret !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(genericToken.type)) {
            out += ret || "";
            continue;
          }
        }
        const token = anyToken;
        switch (token.type) {
          case "space": {
            out += this.renderer.space(token);
            continue;
          }
          case "hr": {
            out += this.renderer.hr(token);
            continue;
          }
          case "heading": {
            out += this.renderer.heading(token);
            continue;
          }
          case "code": {
            out += this.renderer.code(token);
            continue;
          }
          case "table": {
            out += this.renderer.table(token);
            continue;
          }
          case "blockquote": {
            out += this.renderer.blockquote(token);
            continue;
          }
          case "list": {
            out += this.renderer.list(token);
            continue;
          }
          case "html": {
            out += this.renderer.html(token);
            continue;
          }
          case "paragraph": {
            out += this.renderer.paragraph(token);
            continue;
          }
          case "text": {
            let textToken = token;
            let body = this.renderer.text(textToken);
            while (i2 + 1 < tokens.length && tokens[i2 + 1].type === "text") {
              textToken = tokens[++i2];
              body += "\n" + this.renderer.text(textToken);
            }
            if (top) {
              out += this.renderer.paragraph({
                type: "paragraph",
                raw: body,
                text: body,
                tokens: [{ type: "text", raw: body, text: body, escaped: true }]
              });
            } else {
              out += body;
            }
            continue;
          }
          default: {
            const errMsg = 'Token with "' + token.type + '" type was not found.';
            if (this.options.silent) {
              console.error(errMsg);
              return "";
            } else {
              throw new Error(errMsg);
            }
          }
        }
      }
      return out;
    }
    /**
     * Parse Inline Tokens
     */
    parseInline(tokens, renderer = this.renderer) {
      var _a2, _b2;
      let out = "";
      for (let i2 = 0; i2 < tokens.length; i2++) {
        const anyToken = tokens[i2];
        if ((_b2 = (_a2 = this.options.extensions) == null ? void 0 : _a2.renderers) == null ? void 0 : _b2[anyToken.type]) {
          const ret = this.options.extensions.renderers[anyToken.type].call({ parser: this }, anyToken);
          if (ret !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(anyToken.type)) {
            out += ret || "";
            continue;
          }
        }
        const token = anyToken;
        switch (token.type) {
          case "escape": {
            out += renderer.text(token);
            break;
          }
          case "html": {
            out += renderer.html(token);
            break;
          }
          case "link": {
            out += renderer.link(token);
            break;
          }
          case "image": {
            out += renderer.image(token);
            break;
          }
          case "strong": {
            out += renderer.strong(token);
            break;
          }
          case "em": {
            out += renderer.em(token);
            break;
          }
          case "codespan": {
            out += renderer.codespan(token);
            break;
          }
          case "br": {
            out += renderer.br(token);
            break;
          }
          case "del": {
            out += renderer.del(token);
            break;
          }
          case "text": {
            out += renderer.text(token);
            break;
          }
          default: {
            const errMsg = 'Token with "' + token.type + '" type was not found.';
            if (this.options.silent) {
              console.error(errMsg);
              return "";
            } else {
              throw new Error(errMsg);
            }
          }
        }
      }
      return out;
    }
  };
  var _Hooks = (_c = class {
    constructor(options2) {
      __publicField(this, "options");
      __publicField(this, "block");
      this.options = options2 || _defaults;
    }
    /**
     * Process markdown before marked
     */
    preprocess(markdown) {
      return markdown;
    }
    /**
     * Process HTML after marked is finished
     */
    postprocess(html2) {
      return html2;
    }
    /**
     * Process all tokens before walk tokens
     */
    processAllTokens(tokens) {
      return tokens;
    }
    /**
     * Provide function to tokenize markdown
     */
    provideLexer() {
      return this.block ? _Lexer.lex : _Lexer.lexInline;
    }
    /**
     * Provide function to parse tokens
     */
    provideParser() {
      return this.block ? _Parser.parse : _Parser.parseInline;
    }
  }, __publicField(_c, "passThroughHooks", /* @__PURE__ */ new Set([
    "preprocess",
    "postprocess",
    "processAllTokens"
  ])), _c);
  var Marked = class {
    constructor(...args) {
      __publicField(this, "defaults", _getDefaults());
      __publicField(this, "options", this.setOptions);
      __publicField(this, "parse", this.parseMarkdown(true));
      __publicField(this, "parseInline", this.parseMarkdown(false));
      __publicField(this, "Parser", _Parser);
      __publicField(this, "Renderer", _Renderer);
      __publicField(this, "TextRenderer", _TextRenderer);
      __publicField(this, "Lexer", _Lexer);
      __publicField(this, "Tokenizer", _Tokenizer);
      __publicField(this, "Hooks", _Hooks);
      this.use(...args);
    }
    /**
     * Run callback for every token
     */
    walkTokens(tokens, callback) {
      var _a2, _b2;
      let values = [];
      for (const token of tokens) {
        values = values.concat(callback.call(this, token));
        switch (token.type) {
          case "table": {
            const tableToken = token;
            for (const cell of tableToken.header) {
              values = values.concat(this.walkTokens(cell.tokens, callback));
            }
            for (const row of tableToken.rows) {
              for (const cell of row) {
                values = values.concat(this.walkTokens(cell.tokens, callback));
              }
            }
            break;
          }
          case "list": {
            const listToken = token;
            values = values.concat(this.walkTokens(listToken.items, callback));
            break;
          }
          default: {
            const genericToken = token;
            if ((_b2 = (_a2 = this.defaults.extensions) == null ? void 0 : _a2.childTokens) == null ? void 0 : _b2[genericToken.type]) {
              this.defaults.extensions.childTokens[genericToken.type].forEach((childTokens) => {
                const tokens2 = genericToken[childTokens].flat(Infinity);
                values = values.concat(this.walkTokens(tokens2, callback));
              });
            } else if (genericToken.tokens) {
              values = values.concat(this.walkTokens(genericToken.tokens, callback));
            }
          }
        }
      }
      return values;
    }
    use(...args) {
      const extensions = this.defaults.extensions || { renderers: {}, childTokens: {} };
      args.forEach((pack) => {
        const opts = { ...pack };
        opts.async = this.defaults.async || opts.async || false;
        if (pack.extensions) {
          pack.extensions.forEach((ext) => {
            if (!ext.name) {
              throw new Error("extension name required");
            }
            if ("renderer" in ext) {
              const prevRenderer = extensions.renderers[ext.name];
              if (prevRenderer) {
                extensions.renderers[ext.name] = function (...args2) {
                  let ret = ext.renderer.apply(this, args2);
                  if (ret === false) {
                    ret = prevRenderer.apply(this, args2);
                  }
                  return ret;
                };
              } else {
                extensions.renderers[ext.name] = ext.renderer;
              }
            }
            if ("tokenizer" in ext) {
              if (!ext.level || ext.level !== "block" && ext.level !== "inline") {
                throw new Error("extension level must be 'block' or 'inline'");
              }
              const extLevel = extensions[ext.level];
              if (extLevel) {
                extLevel.unshift(ext.tokenizer);
              } else {
                extensions[ext.level] = [ext.tokenizer];
              }
              if (ext.start) {
                if (ext.level === "block") {
                  if (extensions.startBlock) {
                    extensions.startBlock.push(ext.start);
                  } else {
                    extensions.startBlock = [ext.start];
                  }
                } else if (ext.level === "inline") {
                  if (extensions.startInline) {
                    extensions.startInline.push(ext.start);
                  } else {
                    extensions.startInline = [ext.start];
                  }
                }
              }
            }
            if ("childTokens" in ext && ext.childTokens) {
              extensions.childTokens[ext.name] = ext.childTokens;
            }
          });
          opts.extensions = extensions;
        }
        if (pack.renderer) {
          const renderer = this.defaults.renderer || new _Renderer(this.defaults);
          for (const prop in pack.renderer) {
            if (!(prop in renderer)) {
              throw new Error(`renderer '${prop}' does not exist`);
            }
            if (["options", "parser"].includes(prop)) {
              continue;
            }
            const rendererProp = prop;
            const rendererFunc = pack.renderer[rendererProp];
            const prevRenderer = renderer[rendererProp];
            renderer[rendererProp] = (...args2) => {
              let ret = rendererFunc.apply(renderer, args2);
              if (ret === false) {
                ret = prevRenderer.apply(renderer, args2);
              }
              return ret || "";
            };
          }
          opts.renderer = renderer;
        }
        if (pack.tokenizer) {
          const tokenizer = this.defaults.tokenizer || new _Tokenizer(this.defaults);
          for (const prop in pack.tokenizer) {
            if (!(prop in tokenizer)) {
              throw new Error(`tokenizer '${prop}' does not exist`);
            }
            if (["options", "rules", "lexer"].includes(prop)) {
              continue;
            }
            const tokenizerProp = prop;
            const tokenizerFunc = pack.tokenizer[tokenizerProp];
            const prevTokenizer = tokenizer[tokenizerProp];
            tokenizer[tokenizerProp] = (...args2) => {
              let ret = tokenizerFunc.apply(tokenizer, args2);
              if (ret === false) {
                ret = prevTokenizer.apply(tokenizer, args2);
              }
              return ret;
            };
          }
          opts.tokenizer = tokenizer;
        }
        if (pack.hooks) {
          const hooks = this.defaults.hooks || new _Hooks();
          for (const prop in pack.hooks) {
            if (!(prop in hooks)) {
              throw new Error(`hook '${prop}' does not exist`);
            }
            if (["options", "block"].includes(prop)) {
              continue;
            }
            const hooksProp = prop;
            const hooksFunc = pack.hooks[hooksProp];
            const prevHook = hooks[hooksProp];
            if (_Hooks.passThroughHooks.has(prop)) {
              hooks[hooksProp] = (arg) => {
                if (this.defaults.async) {
                  return Promise.resolve(hooksFunc.call(hooks, arg)).then((ret2) => {
                    return prevHook.call(hooks, ret2);
                  });
                }
                const ret = hooksFunc.call(hooks, arg);
                return prevHook.call(hooks, ret);
              };
            } else {
              hooks[hooksProp] = (...args2) => {
                let ret = hooksFunc.apply(hooks, args2);
                if (ret === false) {
                  ret = prevHook.apply(hooks, args2);
                }
                return ret;
              };
            }
          }
          opts.hooks = hooks;
        }
        if (pack.walkTokens) {
          const walkTokens2 = this.defaults.walkTokens;
          const packWalktokens = pack.walkTokens;
          opts.walkTokens = function (token) {
            let values = [];
            values.push(packWalktokens.call(this, token));
            if (walkTokens2) {
              values = values.concat(walkTokens2.call(this, token));
            }
            return values;
          };
        }
        this.defaults = { ...this.defaults, ...opts };
      });
      return this;
    }
    setOptions(opt) {
      this.defaults = { ...this.defaults, ...opt };
      return this;
    }
    lexer(src, options2) {
      return _Lexer.lex(src, options2 ?? this.defaults);
    }
    parser(tokens, options2) {
      return _Parser.parse(tokens, options2 ?? this.defaults);
    }
    parseMarkdown(blockType) {
      const parse2 = (src, options2) => {
        const origOpt = { ...options2 };
        const opt = { ...this.defaults, ...origOpt };
        const throwError = this.onError(!!opt.silent, !!opt.async);
        if (this.defaults.async === true && origOpt.async === false) {
          return throwError(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
        }
        if (typeof src === "undefined" || src === null) {
          return throwError(new Error("marked(): input parameter is undefined or null"));
        }
        if (typeof src !== "string") {
          return throwError(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected"));
        }
        if (opt.hooks) {
          opt.hooks.options = opt;
          opt.hooks.block = blockType;
        }
        const lexer2 = opt.hooks ? opt.hooks.provideLexer() : blockType ? _Lexer.lex : _Lexer.lexInline;
        const parser2 = opt.hooks ? opt.hooks.provideParser() : blockType ? _Parser.parse : _Parser.parseInline;
        if (opt.async) {
          return Promise.resolve(opt.hooks ? opt.hooks.preprocess(src) : src).then((src2) => lexer2(src2, opt)).then((tokens) => opt.hooks ? opt.hooks.processAllTokens(tokens) : tokens).then((tokens) => opt.walkTokens ? Promise.all(this.walkTokens(tokens, opt.walkTokens)).then(() => tokens) : tokens).then((tokens) => parser2(tokens, opt)).then((html2) => opt.hooks ? opt.hooks.postprocess(html2) : html2).catch(throwError);
        }
        try {
          if (opt.hooks) {
            src = opt.hooks.preprocess(src);
          }
          let tokens = lexer2(src, opt);
          if (opt.hooks) {
            tokens = opt.hooks.processAllTokens(tokens);
          }
          if (opt.walkTokens) {
            this.walkTokens(tokens, opt.walkTokens);
          }
          let html2 = parser2(tokens, opt);
          if (opt.hooks) {
            html2 = opt.hooks.postprocess(html2);
          }
          return html2;
        } catch (e2) {
          return throwError(e2);
        }
      };
      return parse2;
    }
    onError(silent, async) {
      return (e2) => {
        e2.message += "\nPlease report this to https://github.com/markedjs/marked.";
        if (silent) {
          const msg = "<p>An error occurred:</p><pre>" + escape2(e2.message + "", true) + "</pre>";
          if (async) {
            return Promise.resolve(msg);
          }
          return msg;
        }
        if (async) {
          return Promise.reject(e2);
        }
        throw e2;
      };
    }
  };
  var markedInstance = new Marked();
  function marked(src, opt) {
    return markedInstance.parse(src, opt);
  }
  marked.options = marked.setOptions = function (options2) {
    markedInstance.setOptions(options2);
    marked.defaults = markedInstance.defaults;
    changeDefaults(marked.defaults);
    return marked;
  };
  marked.getDefaults = _getDefaults;
  marked.defaults = _defaults;
  marked.use = function (...args) {
    markedInstance.use(...args);
    marked.defaults = markedInstance.defaults;
    changeDefaults(marked.defaults);
    return marked;
  };
  marked.walkTokens = function (tokens, callback) {
    return markedInstance.walkTokens(tokens, callback);
  };
  marked.parseInline = markedInstance.parseInline;
  marked.Parser = _Parser;
  marked.parser = _Parser.parse;
  marked.Renderer = _Renderer;
  marked.TextRenderer = _TextRenderer;
  marked.Lexer = _Lexer;
  marked.lexer = _Lexer.lex;
  marked.Tokenizer = _Tokenizer;
  marked.Hooks = _Hooks;
  marked.parse = marked;
  var options = marked.options;
  var setOptions = marked.setOptions;
  var use = marked.use;
  var walkTokens = marked.walkTokens;
  var parseInline = marked.parseInline;
  var parse = marked;
  var parser = _Parser.parse;
  var lexer = _Lexer.lex;
  class FormdownGenerator {
    /**
     * Generate a human-readable label from a field name
     * @param fieldName - The field name to convert
     * @returns A formatted label string
     */
    generateSmartLabel(fieldName) {
      if (/^\d/.test(fieldName)) {
        throw new Error(`Invalid field name '${fieldName}': Field names cannot start with a number`);
      }
      if (fieldName.includes("_")) {
        return fieldName.split("_").map((word) => this.capitalizeWord(word)).join(" ");
      }
      if (/[a-z][A-Z]/.test(fieldName)) {
        return fieldName.replace(/([a-z])([A-Z])/g, "$1 $2").split(" ").map((word) => this.capitalizeWord(word)).join(" ");
      }
      return this.capitalizeWord(fieldName);
    }
    /**
     * Capitalize the first letter of a word
     * @param word - The word to capitalize
     * @returns The capitalized word
     */
    capitalizeWord(word) {
      if (!word)
        return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    generateHTML(content) {
      const markdownHTML = content.markdown ? marked(content.markdown) : "";
      if (typeof markdownHTML === "string") {
        return this.processContent(markdownHTML, content.forms);
      } else {
        return this.generateLegacyHTML(content);
      }
    }
    processContent(html2, fields) {
      if (fields.length === 0) {
        return html2;
      }
      const inlineFields = [];
      const blockFields = [];
      fields.forEach((field) => {
        if (field.inline) {
          inlineFields.push(field);
        } else {
          blockFields.push(field);
        }
      });
      let result = html2;
      inlineFields.forEach((field, index) => {
        const placeholder = `<!--FORMDOWN_FIELD_${fields.indexOf(field)}-->`;
        const fieldHTML = this.generateInlineFieldHTML(field);
        result = result.replace(new RegExp(placeholder, "g"), fieldHTML);
      });
      if (blockFields.length > 0) {
        const formHTML = this.generateSingleFormHTML(blockFields);
        const firstBlockFieldIndex = fields.findIndex((f2) => !f2.inline);
        if (firstBlockFieldIndex !== -1) {
          const firstPlaceholder = `<!--FORMDOWN_FIELD_${firstBlockFieldIndex}-->`;
          result = result.replace(new RegExp(firstPlaceholder, "g"), formHTML);
          blockFields.slice(1).forEach((field) => {
            const fieldIndex = fields.indexOf(field);
            const placeholder = `<!--FORMDOWN_FIELD_${fieldIndex}-->`;
            result = result.replace(new RegExp(placeholder, "g"), "");
          });
        } else {
          result += "\n" + formHTML;
        }
      }
      return result;
    }
    processFieldPlaceholders(html2, fields) {
      let result = html2;
      fields.forEach((field, index) => {
        const placeholder = `<!--FORMDOWN_FIELD_${index}-->`;
        const fieldHTML = this.generateStandaloneFieldHTML(field);
        result = result.replace(new RegExp(placeholder, "g"), fieldHTML);
      });
      return result;
    }
    generateLegacyHTML(content) {
      const markdownHTML = content.markdown ? marked(content.markdown) : "";
      const formHTML = this.generateFormHTML(content.forms);
      return markdownHTML + formHTML;
    }
    generateStandaloneFieldHTML(field) {
      if (field.inline) {
        return this.generateInlineFieldHTML(field);
      }
      return `
<form class="formdown-form">
${this.generateFieldHTML(field)}
</form>`;
    }
    generateSingleFormHTML(fields) {
      if (fields.length === 0)
        return "";
      const fieldsHTML = fields.map((field) => this.generateFieldHTML(field)).join("\n");
      return `
<form class="formdown-form" role="form">
${fieldsHTML}
</form>`;
    }
    generateInlineFieldHTML(field) {
      const { name, type, required, placeholder, attributes } = field;
      const displayLabel = field.label || this.generateSmartLabel(name);
      const commonAttrs = {
        "data-field-name": name,
        "data-field-type": type,
        "data-placeholder": placeholder || displayLabel,
        "class": "formdown-inline-field",
        "contenteditable": "true",
        "role": "textbox",
        ...required && { "data-required": "true" },
        ...attributes && attributes
      };
      const attrString = Object.entries(commonAttrs).map(([key, value]) => {
        if (typeof value === "boolean") {
          return value ? key : "";
        }
        return `${key}="${value}"`;
      }).filter(Boolean).join(" ");
      return `<span ${attrString}>${displayLabel}</span>`;
    }
    generateFormHTML(fields) {
      if (fields.length === 0)
        return "";
      const fieldsHTML = fields.map((field) => this.generateFieldHTML(field)).join("\n");
      return `
<form class="formdown-form">
${fieldsHTML}
</form>`;
    }
    generateFieldHTML(field) {
      const { name, type, label, required, placeholder, attributes, options: options2, description, errorMessage, pattern, format } = field;
      const displayLabel = label || this.generateSmartLabel(name);
      const fieldId = name;
      const descriptionId = description ? `${name}-description` : void 0;
      const errorId = errorMessage ? `${name}-error` : void 0;
      const commonAttrs = {
        id: fieldId,
        name,
        ...required && { required: true },
        ...placeholder && { placeholder },
        ...pattern && { pattern },
        ...format && { format },
        ...description && { "aria-describedby": descriptionId },
        ...errorMessage && { "aria-describedby": `${descriptionId ? descriptionId + " " : ""}${errorId}` },
        ...attributes
      };
      const attrString = Object.entries(commonAttrs).map(([key, value]) => {
        if (typeof value === "boolean") {
          return value ? key : "";
        }
        return `${key}="${value}"`;
      }).filter(Boolean).join(" ");
      const generateHelpText = () => {
        let helpHTML = "";
        if (description) {
          helpHTML += `
    <div id="${descriptionId}" class="formdown-field-description">${description}</div>`;
        }
        if (errorMessage) {
          helpHTML += `
    <div id="${errorId}" class="formdown-field-error" role="alert">${errorMessage}</div>`;
        }
        return helpHTML;
      };
      switch (type) {
        case "textarea":
          return `
<div class="formdown-field">
    <label for="${fieldId}">${displayLabel}${required ? " *" : ""}</label>
    <textarea ${attrString}></textarea>${generateHelpText()}
</div>`;
        case "select":
          const optionsHTML = (options2 == null ? void 0 : options2.map((opt) => `<option value="${opt}">${opt}</option>`).join("\n")) || "";
          return `
<div class="formdown-field">
    <label for="${fieldId}">${displayLabel}${required ? " *" : ""}</label>
    <select ${attrString}>
        ${optionsHTML}
    </select>${generateHelpText()}
</div>`;
        case "radio":
          if (!options2 || options2.length === 0) {
            return `
<div class="formdown-field">
    <label for="${fieldId}">${displayLabel}${required ? " *" : ""}</label>
    <input type="text" ${attrString}>${generateHelpText()}
</div>`;
          }
          const radioInputsHTML = options2.map((opt, index) => {
            const inputId = `${name}_${index}`;
            const isRequired = required && index === 0;
            return `
        <label for="${inputId}" class="formdown-option-label">
            <input type="radio" id="${inputId}" name="${name}" value="${opt}" ${isRequired ? "required" : ""} ${descriptionId ? `aria-describedby="${descriptionId}"` : ""}>
            <span>${opt}</span>
        </label>`;
          }).join("\n");
          const isVertical = (attributes == null ? void 0 : attributes.layout) === "vertical";
          const groupClass = isVertical ? "radio-group vertical" : "radio-group inline";
          return `
<div class="formdown-field">
    <fieldset ${descriptionId ? `aria-describedby="${descriptionId}"` : ""}>
        <legend>${displayLabel}${required ? " *" : ""}</legend>
        <div class="${groupClass}" role="radiogroup">
${radioInputsHTML}
        </div>
    </fieldset>${generateHelpText()}
</div>`;
        case "checkbox":
          if (!options2 || options2.length === 0) {
            return `
<div class="formdown-field">
    <label for="${fieldId}" class="formdown-checkbox-label">
        <input type="checkbox" id="${fieldId}" name="${name}" value="true" ${required ? "required" : ""} ${attrString}>
        <span>${displayLabel}${required ? " *" : ""}</span>
    </label>${generateHelpText()}
</div>`;
          } else {
            const checkboxInputsHTML = options2.map((opt, index) => {
              const inputId = `${name}_${index}`;
              const isRequired = required && index === 0;
              return `
        <label for="${inputId}" class="formdown-option-label">
            <input type="checkbox" id="${inputId}" name="${name}" value="${opt}" ${isRequired ? "required" : ""} ${descriptionId ? `aria-describedby="${descriptionId}"` : ""}>
            <span>${opt}</span>
        </label>`;
            }).join("\n");
            const isVertical2 = (attributes == null ? void 0 : attributes.layout) === "vertical";
            const groupClass2 = isVertical2 ? "checkbox-group vertical" : "checkbox-group inline";
            return `
<div class="formdown-field">
    <fieldset ${descriptionId ? `aria-describedby="${descriptionId}"` : ""}>
        <legend>${displayLabel}${required ? " *" : ""}</legend>
        <div class="${groupClass2}" role="group">
${checkboxInputsHTML}
        </div>
    </fieldset>${generateHelpText()}
</div>`;
          }
        // Extended HTML5 input types
        case "range":
          const min = (attributes == null ? void 0 : attributes.min) || 0;
          const max = (attributes == null ? void 0 : attributes.max) || 100;
          const step = (attributes == null ? void 0 : attributes.step) || 1;
          const value = (attributes == null ? void 0 : attributes.value) || Math.floor((min + max) / 2);
          return `
<div class="formdown-field">
    <label for="${fieldId}">${displayLabel}${required ? " *" : ""}</label>
    <input type="range" ${attrString} value="${value}">
    <output for="${fieldId}" class="formdown-range-output">${value}</output>${generateHelpText()}
</div>`;
        case "file":
          return `
<div class="formdown-field">
    <label for="${fieldId}">${displayLabel}${required ? " *" : ""}</label>
    <input type="file" ${attrString}>${generateHelpText()}
</div>`;
        case "color":
          return `
<div class="formdown-field">
    <label for="${fieldId}">${displayLabel}${required ? " *" : ""}</label>
    <input type="color" ${attrString}>${generateHelpText()}
</div>`;
        case "week":
          return `
<div class="formdown-field">
    <label for="${fieldId}">${displayLabel}${required ? " *" : ""}</label>
    <input type="week" ${attrString}>${generateHelpText()}
</div>`;
        case "month":
          return `
<div class="formdown-field">
    <label for="${fieldId}">${displayLabel}${required ? " *" : ""}</label>
    <input type="month" ${attrString}>${generateHelpText()}
</div>`;
        default:
          return `
<div class="formdown-field">
    <label for="${fieldId}">${displayLabel}${required ? " *" : ""}</label>
    <input type="${type}" ${attrString}>${generateHelpText()}
</div>`;
      }
    }
  }
  function parseFormdown(input) {
    const parser2 = new FormdownParser();
    return parser2.parseFormdown(input);
  }
  function generateFormHTML(content) {
    const generator = new FormdownGenerator();
    return generator.generateHTML(content);
  }
  function parseFormFields(input) {
    const parser2 = new FormdownParser();
    return parser2.parse(input);
  }
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __decorateClass = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
      if (decorator = decorators[i2])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result) __defProp2(target, key, result);
    return result;
  };
  let FormdownUI = class extends i {
    // Prevent infinite loops
    constructor() {
      super();
      this.content = "";
      this.selectOnFocus = true;
      this.formId = "";
      this.showSubmitButton = true;
      this.submitText = "Submit";
      this._data = {};
      this.parser = new FormdownParser();
      this.generator = new FormdownGenerator();
      this.fieldRegistry = /* @__PURE__ */ new Map();
      this._isUpdatingUI = false;
      this._uniqueFormId = this.formId || `formdown-${Math.random().toString(36).substring(2, 15)}`;
    }
    // Get the form ID (user-provided or auto-generated)
    getFormId() {
      return this.formId || this._uniqueFormId;
    }
    // Process HTML to replace form wrapper with hidden form and add form attributes
    processFormHTML(html2, formId) {
      const hiddenForm = `<form id="${formId}" class="formdown-form" style="display: none;"></form>`;
      let processedHTML = html2.replace(/<form[^>]*class="formdown-form"[^>]*>/g, "").replace(/<\/form>/g, "");
      processedHTML = processedHTML.replace(
        /<(input|textarea|select)([^>]*?)>/g,
        (match, tagName, attributes) => {
          if (attributes.includes("form=")) {
            return match;
          }
          return `<${tagName}${attributes} form="${formId}">`;
        }
      );
      return hiddenForm + processedHTML;
    }
    get data() {
      return this._data;
    }
    set data(newData) {
      const oldData = this._data;
      this._data = newData !== null && newData !== void 0 && typeof newData === "object" ? { ...newData } : {};
      this.requestUpdate("data", oldData);
    }
    // Public method to update data programmatically
    updateData(newData) {
      this.data = newData;
    }
    // Public method to update single field
    updateField(fieldName, value) {
      this.data = { ...this.data, [fieldName]: value };
    }
    connectedCallback() {
      var _a2;
      super.connectedCallback();
      if (!this.content && ((_a2 = this.textContent) == null ? void 0 : _a2.trim())) {
        this.content = this.textContent.trim();
        this.textContent = "";
      }
    }
    render() {
      if (!this.content || !this.content.trim()) {
        return x`<div class="error">No Formdown content provided</div>`;
      }
      try {
        const parseResult = this.parser.parseFormdown(this.content);
        const generatedHTML = this.generator.generateHTML(parseResult);
        if (!generatedHTML || !generatedHTML.trim()) {
          return x`<div class="error">Generated HTML is empty</div>`;
        }
        return x`<div id="content-container"></div>`;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return x`<div class="error">Error rendering content: ${errorMessage}</div>`;
      }
    }
    // Override firstUpdated to set innerHTML after the initial render
    firstUpdated() {
      this.updateContent();
      if (Object.keys(this.data).length > 0) {
        this.syncUIFromData();
      }
    }
    // Override updated to update content when properties change
    updated(changedProperties) {
      super.updated(changedProperties);
      if (changedProperties.has("content")) {
        this.updateContent();
      }
      if (changedProperties.has("data")) {
        this.syncUIFromData();
      }
    }
    updateContent() {
      var _a2, _b2;
      if (!this.content || !this.content.trim()) {
        return;
      }
      try {
        const container = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector("#content-container");
        if (!container) {
          return;
        }
        const parseResult = this.parser.parseFormdown(this.content);
        let generatedHTML = this.generator.generateHTML(parseResult);
        if (!generatedHTML || generatedHTML.trim() === "") {
          container.innerHTML = `<div class="error">Generator returned empty HTML</div>`;
          return;
        }
        const formId = this.getFormId();
        generatedHTML = this.processFormHTML(generatedHTML, formId);
        container.innerHTML = generatedHTML;
        this.setupFieldHandlers(container);
      } catch (error) {
        const container = (_b2 = this.shadowRoot) == null ? void 0 : _b2.querySelector("#content-container");
        if (container) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          container.innerHTML = `<div class="error">Error: ${errorMessage}</div>`;
        }
      }
    }
    setupFieldHandlers(container) {
      this.fieldRegistry.clear();
      const allInputs = container.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), [contenteditable="true"]');
      this.setupKeyboardNavigation(allInputs);
      const allFields = container.querySelectorAll('input, textarea, select, [contenteditable="true"]');
      allFields.forEach((element) => {
        const htmlElement = element;
        const fieldName = this.getFieldName(htmlElement);
        if (fieldName) {
          this.registerField(fieldName, htmlElement);
          const existingValue = this.data[fieldName];
          if (existingValue !== void 0) {
            this.setElementValue(htmlElement, existingValue);
          }
          this.setupFieldEventHandlers(htmlElement, fieldName);
          this.setupFieldSpecificBehaviors(htmlElement);
        }
      });
    }
    setupKeyboardNavigation(inputs) {
      inputs.forEach((input, index) => {
        input.addEventListener("keydown", (e2) => {
          const keyEvent = e2;
          if (keyEvent.key === "Enter") {
            keyEvent.preventDefault();
            if (input.tagName.toLowerCase() === "textarea") {
              return;
            }
            const nextIndex = index + 1;
            if (nextIndex < inputs.length) {
              const nextInput = inputs[nextIndex];
              nextInput.focus();
            }
          }
        });
      });
    }
    setupFieldEventHandlers(element, fieldName) {
      const handleValueChange = () => {
        var _a2;
        if (element instanceof HTMLInputElement && element.type === "checkbox") {
          const allCheckboxes = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelectorAll(`input[type="checkbox"][name="${fieldName}"]`);
          const isSingleCheckbox = allCheckboxes.length === 1 && allCheckboxes[0].value === "true";
          if (isSingleCheckbox) {
            this.updateDataReactively(fieldName, element.checked, element);
            return;
          } else {
            const checkedValues = [];
            allCheckboxes.forEach((cb) => {
              if (cb.checked) {
                checkedValues.push(cb.value);
              }
            });
            this.updateDataReactively(fieldName, checkedValues, element);
            return;
          }
        }
        const value = this.getFieldValue(element);
        this.updateDataReactively(fieldName, value, element);
      };
      if (element.hasAttribute("contenteditable")) {
        element.addEventListener("input", handleValueChange);
      } else {
        element.addEventListener("input", handleValueChange);
        element.addEventListener("change", handleValueChange);
      }
    }
    setupFieldSpecificBehaviors(element) {
      if (element.hasAttribute("contenteditable")) {
        this.setupContentEditableBehaviors(element);
      }
    }
    setupContentEditableBehaviors(element) {
      var _a2;
      const placeholder = element.dataset.placeholder;
      if (((_a2 = element.textContent) == null ? void 0 : _a2.trim()) === placeholder) {
        element.textContent = "";
      }
      element.addEventListener("focus", () => {
        var _a3;
        if (((_a3 = element.textContent) == null ? void 0 : _a3.trim()) === placeholder) {
          element.textContent = "";
        }
        if (this.selectOnFocus) {
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(element);
          selection == null ? void 0 : selection.removeAllRanges();
          selection == null ? void 0 : selection.addRange(range);
        }
      });
      element.addEventListener("blur", () => {
        var _a3;
        if (!((_a3 = element.textContent) == null ? void 0 : _a3.trim())) {
          element.textContent = placeholder || "";
        }
      });
      const fieldType = element.dataset.fieldType;
      if (fieldType === "email") {
        element.addEventListener("input", () => {
          var _a3;
          const value = ((_a3 = element.textContent) == null ? void 0 : _a3.trim()) || "";
          if (value && !value.includes("@")) {
            element.style.color = "#dc2626";
          } else {
            element.style.color = "#1e40af";
          }
        });
      }
    }
    // Reactive data management - data is the single source of truth
    updateDataReactively(fieldName, value, sourceElement) {
      if (this._isUpdatingUI) return;
      this.data = { ...this.data, [fieldName]: value };
      this.syncUIFromData(fieldName, sourceElement);
      this.emitFieldEvents(fieldName, value);
    }
    syncUIFromData(fieldName, sourceElement) {
      this._isUpdatingUI = true;
      try {
        let fieldsToSync;
        if (fieldName) {
          fieldsToSync = [fieldName];
        } else {
          const registeredFields = Array.from(this.fieldRegistry.keys());
          const dataFields = Object.keys(this.data);
          fieldsToSync = [.../* @__PURE__ */ new Set([...registeredFields, ...dataFields])];
        }
        fieldsToSync.forEach((field) => {
          const value = this.data[field] ?? "";
          const boundElements = this.fieldRegistry.get(field);
          if (boundElements) {
            boundElements.forEach((element) => {
              if (element === sourceElement) return;
              this.setElementValue(element, value);
            });
          }
        });
      } finally {
        this._isUpdatingUI = false;
      }
    }
    // Universal element value setter
    setElementValue(element, value) {
      if (element.hasAttribute("contenteditable")) {
        const stringValue = Array.isArray(value) ? value.join(", ") : String(value);
        if (element.textContent !== stringValue) {
          element.textContent = stringValue;
        }
      } else if (element instanceof HTMLInputElement) {
        if (element.type === "checkbox") {
          if (Array.isArray(value)) {
            element.checked = value.includes(element.value);
          } else if (typeof value === "boolean") {
            element.checked = value;
          } else {
            element.checked = Boolean(value) && (value === "true" || value === element.value);
          }
        } else if (element.type === "radio") {
          element.checked = element.value === String(value);
        } else {
          const stringValue = Array.isArray(value) ? value.join(", ") : String(value);
          if (element.value !== stringValue) {
            element.value = stringValue;
          }
        }
      } else if (element instanceof HTMLSelectElement) {
        const stringValue = Array.isArray(value) ? value.join(", ") : String(value);
        if (element.value !== stringValue) {
          element.value = stringValue;
        }
      } else if (element instanceof HTMLTextAreaElement) {
        const stringValue = Array.isArray(value) ? value.join(", ") : String(value);
        if (element.value !== stringValue) {
          element.value = stringValue;
        }
      }
    }
    // Universal field name extractor
    getFieldName(element) {
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
        return element.name || element.id || null;
      }
      return element.dataset.fieldName || element.id || null;
    }
    // Universal field value extractor
    getFieldValue(element) {
      var _a2;
      if (element.hasAttribute("contenteditable")) {
        return ((_a2 = element.textContent) == null ? void 0 : _a2.trim()) || "";
      } else if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
        return element.value || "";
      }
      return "";
    }
    // Register field in the universal registry
    registerField(fieldName, element) {
      if (!this.fieldRegistry.has(fieldName)) {
        this.fieldRegistry.set(fieldName, /* @__PURE__ */ new Set());
      }
      this.fieldRegistry.get(fieldName).add(element);
    }
    // Emit standardized events
    emitFieldEvents(fieldName, value) {
      const currentFormData = this.getFormData();
      this.dispatchEvent(new CustomEvent("formdown-change", {
        detail: { fieldName, value, formData: currentFormData },
        bubbles: true
      }));
      this.dispatchEvent(new CustomEvent("formdown-data-update", {
        detail: { formData: currentFormData },
        bubbles: true
      }));
    }
    // Universal field synchronization method - expected by tests
    syncFieldValue(fieldName, value) {
      this.data = { ...this.data, [fieldName]: value };
      this.emitFieldEvents(fieldName, value);
    }
    // Update form data method - expected by tests
    updateFormData(fieldName, value) {
      this.data = { ...this.data, [fieldName]: value };
      this.emitFieldEvents(fieldName, value);
    }
    // Get form data programmatically - use reactive data as source of truth
    getFormData() {
      return { ...this.data };
    }
    // Validation methods
    validate() {
      var _a2;
      const errors = [];
      const container = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector("#content-container");
      if (!container) {
        return { isValid: false, errors: [{ field: "general", message: "Form container not found" }] };
      }
      this.clearValidationStates();
      const allFields = container.querySelectorAll('input, textarea, select, [contenteditable="true"]');
      allFields.forEach((element) => {
        const htmlElement = element;
        const fieldName = this.getFieldName(htmlElement);
        if (fieldName) {
          const fieldErrors = this.validateField(htmlElement, fieldName);
          errors.push(...fieldErrors);
        }
      });
      this.applyValidationFeedback(errors);
      return {
        isValid: errors.length === 0,
        errors
      };
    }
    validateField(element, fieldName) {
      var _a2, _b2;
      const errors = [];
      if (this.isFieldRequired(element)) {
        const value = this.getFieldValue(element);
        if (element instanceof HTMLInputElement) {
          if (element.type === "checkbox") {
            const allCheckboxes = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelectorAll(`input[type="checkbox"][name="${fieldName}"]`);
            const isAnyChecked = Array.from(allCheckboxes).some((cb) => cb.checked);
            if (!isAnyChecked) {
              errors.push({ field: fieldName, message: "This field is required" });
            }
          } else if (element.type === "radio") {
            const allRadios = (_b2 = this.shadowRoot) == null ? void 0 : _b2.querySelectorAll(`input[type="radio"][name="${fieldName}"]`);
            const isAnySelected = Array.from(allRadios).some((radio) => radio.checked);
            if (!isAnySelected) {
              errors.push({ field: fieldName, message: "Please select an option" });
            }
          } else if (!value || value.trim() === "") {
            errors.push({ field: fieldName, message: "This field is required" });
          }
        } else if (!value || value.trim() === "") {
          errors.push({ field: fieldName, message: "This field is required" });
        }
      }
      if (element instanceof HTMLInputElement) {
        const value = element.value.trim();
        if (value && element.type === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push({ field: fieldName, message: "Please enter a valid email address" });
          }
        }
        if (value && element.type === "url") {
          try {
            new URL(value);
          } catch {
            errors.push({ field: fieldName, message: "Please enter a valid URL" });
          }
        }
        if (value && element.type === "tel") {
          const phoneRegex = /^[\d\s\-\+\(\)]+$/;
          if (!phoneRegex.test(value)) {
            errors.push({ field: fieldName, message: "Please enter a valid phone number" });
          }
        }
        if (element.minLength && element.minLength > 0 && value.length < element.minLength) {
          errors.push({ field: fieldName, message: `Minimum length is ${element.minLength} characters` });
        }
        if (element.maxLength && element.maxLength > 0 && value.length > element.maxLength) {
          errors.push({ field: fieldName, message: `Maximum length is ${element.maxLength} characters` });
        }
        if (element.pattern && value) {
          const pattern = new RegExp(element.pattern);
          if (!pattern.test(value)) {
            errors.push({ field: fieldName, message: element.title || "Please match the required format" });
          }
        }
      }
      return errors;
    }
    isFieldRequired(element) {
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
        return element.required;
      }
      return element.dataset.required === "true";
    }
    clearValidationStates() {
      var _a2;
      const container = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector("#content-container");
      if (!container) return;
      container.querySelectorAll(".field-error, .field-valid").forEach((el) => {
        el.classList.remove("field-error", "field-valid");
      });
      container.querySelectorAll(".validation-error-message").forEach((el) => {
        el.remove();
      });
    }
    applyValidationFeedback(errors) {
      var _a2;
      const container = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector("#content-container");
      if (!container) return;
      const errorsByField = /* @__PURE__ */ new Map();
      errors.forEach((error) => {
        if (!errorsByField.has(error.field)) {
          errorsByField.set(error.field, []);
        }
        errorsByField.get(error.field).push(error);
      });
      const allFields = container.querySelectorAll('input, textarea, select, [contenteditable="true"]');
      allFields.forEach((element) => {
        const htmlElement = element;
        const fieldName = this.getFieldName(htmlElement);
        if (fieldName) {
          const fieldErrors = errorsByField.get(fieldName);
          if (fieldErrors && fieldErrors.length > 0) {
            htmlElement.classList.add("field-error");
            htmlElement.classList.remove("field-valid");
            this.addErrorMessage(htmlElement, fieldErrors[0].message);
          } else {
            htmlElement.classList.remove("field-error", "field-valid");
          }
        }
      });
    }
    addErrorMessage(element, message) {
      let parent = element.parentElement;
      if (element instanceof HTMLInputElement && (element.type === "radio" || element.type === "checkbox")) {
        while (parent && !parent.classList.contains("radio-group") && !parent.classList.contains("checkbox-group") && parent.tagName !== "FIELDSET") {
          parent = parent.parentElement;
        }
      }
      if (parent) {
        const existingError = parent.querySelector(".validation-error-message");
        if (existingError) {
          existingError.remove();
        }
        const errorEl = document.createElement("span");
        errorEl.className = "validation-error-message";
        errorEl.textContent = message;
        parent.appendChild(errorEl);
      }
    }
    // Reset form method
    resetForm() {
      var _a2;
      const formId = this.getFormId();
      const form = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector(`#${formId}`);
      if (form) {
        form.reset();
      }
      this.data = {};
      this.clearValidationStates();
    }
  };
  FormdownUI.styles = i$3`
    :host {
      display: block;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
      color: #1f2937;
      max-width: 100%;
      box-sizing: border-box;
      overflow-y: auto;
    }

    * {
      box-sizing: border-box;
    }

    .formdown-form {
      max-width: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
      display: none; /* Hidden form for form attribute reference */
    }

    .formdown-field {
      margin-bottom: 1.5rem;
      max-width: 100%;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
      line-height: 1.25;
    }

    input, textarea, select {
      width: 100%;
      max-width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-family: inherit;
      line-height: 1.5;
      transition: all 0.15s ease-in-out;
      background-color: #ffffff;
    }

    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      background-color: #ffffff;
    }

    input:hover, textarea:hover, select:hover {
      border-color: #9ca3af;
    }

    input[type="radio"], input[type="checkbox"] {
      width: auto;
      max-width: none;
      margin-right: 0.5rem;
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

    fieldset {
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      padding: 1.25rem;
      margin: 0 0 1.5rem 0;
      max-width: 100%;
    }

    legend {
      font-weight: 600;
      color: #374151;
      padding: 0 0.75rem;
      font-size: 0.875rem;
    }

    fieldset label {
      display: flex;
      align-items: center;
      margin-bottom: 0.75rem;
      font-weight: normal;
      font-size: 0.875rem;
    }    /* Enhanced inline formdown-field elements with contentEditable */
    formdown-field,
    [contenteditable="true"]:not(textarea) {
      display: inline;
      min-width: 60px;
      max-width: 200px;
      padding: 0.125rem 0.25rem;
      border: 1px solid transparent;
      background-color: rgba(239, 246, 255, 0.6);
      border-radius: 0.125rem;
      font-style: normal;
      color: inherit;
      font-size: inherit;
      line-height: inherit;
      font-family: inherit;
      font-weight: inherit;
      cursor: text;
      outline: none;
      transition: all 0.15s ease-in-out;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: baseline;
      box-decoration-break: clone;
    }

    [contenteditable="true"]:not(textarea):hover {
      background-color: rgba(219, 234, 254, 0.8);
      border-color: rgba(147, 197, 253, 0.5);
    }

    [contenteditable="true"]:not(textarea):focus {
      background-color: rgba(255, 255, 255, 0.9);
      border-color: #3b82f6;
      box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
      color: #1e40af;
    }

    [contenteditable="true"]:not(textarea):empty::before {
      content: attr(data-placeholder);
      color: #94a3b8;
      font-style: italic;
      opacity: 0.7;
    }

    /* Enhanced typography for markdown content */
    h1, h2, h3, h4, h5, h6 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #1f2937;
      font-weight: 600;
      line-height: 1.25;
    }

    h1 { 
      font-size: 2.25rem; 
      font-weight: 700;
    }
    h2 { 
      font-size: 1.875rem; 
      font-weight: 600;
    }
    h3 { 
      font-size: 1.5rem; 
      font-weight: 600;
    }
    h4 { 
      font-size: 1.25rem; 
      font-weight: 600;
    }
    h5 { 
      font-size: 1.125rem; 
      font-weight: 600;
    }
    h6 { 
      font-size: 1rem; 
      font-weight: 600;
    }

    p {
      margin-bottom: 1rem;
      line-height: 1.7;
      color: #4b5563;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      :host {
        font-size: 0.875rem;
      }
      
      input, textarea, select {
        padding: 0.625rem;
        font-size: 0.875rem;
      }
      
      h1 { font-size: 1.875rem; }
      h2 { font-size: 1.5rem; }
      h3 { font-size: 1.25rem; }
    }

    .error {
      color: #dc2626;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      display: block;
    }

    /* Field validation styles */
    .field-error {
      border-color: #dc2626 !important;
      box-shadow: 0 0 0 1px rgba(220, 38, 38, 0.1) !important;
    }

    .field-error:focus {
      border-color: #dc2626 !important;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
    }

    .validation-error-message {
      color: #dc2626;
      font-size: 0.75rem;
      margin-top: 0.25rem;
      display: block;
      font-weight: 500;
    }

    /* Success state */
    .field-valid {
      border-color: #10b981 !important;
      box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.1) !important;
    }

    .submit-button {
      background-color: #3b82f6;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
      margin-top: 1.5rem;
      width: auto;
      max-width: 100%;
    }

    .submit-button:hover {
      background-color: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .submit-button:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .submit-button:active {
      transform: translateY(0);
    }

    /* Ensure content doesn't overflow */
    #content-container {
      max-width: 100%;
      overflow-wrap: break-word;
      word-wrap: break-word;
    }    /* Radio and checkbox groups */
    .radio-group, .checkbox-group {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    /* Inline layout (default) */
    .radio-group.inline, .checkbox-group.inline {
      flex-direction: row;
      align-items: center;
    }

    /* Vertical layout */
    .radio-group.vertical, .checkbox-group.vertical {
      flex-direction: column;
      align-items: flex-start;
    }

    .formdown-option-label {
      display: flex;
      align-items: center;
      margin-bottom: 0;
      font-weight: normal;
      cursor: pointer;
      font-size: 0.875rem;
      white-space: nowrap;
    }

    .formdown-option-label input {
      margin-right: 0.5rem;
      margin-bottom: 0;
    }

    .formdown-option-label span {
      user-select: none;
    }

    /* Legacy support for old structure */
    .radio-group label, .checkbox-group label {
      display: flex;
      align-items: center;
      margin-bottom: 0;
      font-weight: normal;
      cursor: pointer;
    }/* Better spacing for form elements */
    .formdown-form > * + * {
      margin-top: 1rem;
    }
  `;
  __decorateClass([
    n$1()
  ], FormdownUI.prototype, "content", 2);
  __decorateClass([
    n$1({ type: Boolean, attribute: "select-on-focus" })
  ], FormdownUI.prototype, "selectOnFocus", 2);
  __decorateClass([
    n$1({ attribute: "form-id" })
  ], FormdownUI.prototype, "formId", 2);
  __decorateClass([
    n$1({ type: Boolean, attribute: "show-submit-button" })
  ], FormdownUI.prototype, "showSubmitButton", 2);
  __decorateClass([
    n$1({ attribute: "submit-text" })
  ], FormdownUI.prototype, "submitText", 2);
  __decorateClass([
    n$1({ type: Object })
  ], FormdownUI.prototype, "data", 1);
  FormdownUI = __decorateClass([
    t$1("formdown-ui")
  ], FormdownUI);
  const createFormdownEditor = (container, options2 = {}) => {
    const editor = document.createElement("formdown-editor");
    if (options2.content) editor.content = options2.content;
    if (options2.showPreview !== void 0) editor.showPreview = options2.showPreview;
    if (options2.showToolbar !== void 0) editor.showToolbar = options2.showToolbar;
    if (options2.placeholder) editor.placeholder = options2.placeholder;
    container.appendChild(editor);
    return editor;
  };
  const registerFormdownEditor = () => {
    if (!customElements.get("formdown-editor")) {
      Promise.resolve().then(() => formdownEditor);
    }
  };
  if (!customElements.get("formdown-editor")) {
    customElements.define("formdown-editor", exports.FormdownEditor);
  }
  if (FormdownUI && !customElements.get("formdown-ui")) {
    customElements.define("formdown-ui", FormdownUI);
  }
  exports.createFormdownEditor = createFormdownEditor;
  Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
  return exports;
}({});
