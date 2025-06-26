var gt = Object.defineProperty;
var mt = (n, e, t) => e in n ? gt(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var b = (n, e, t) => mt(n, typeof e != "symbol" ? e + "" : e, t);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const se = globalThis, _e = se.ShadowRoot && (se.ShadyCSS === void 0 || se.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ae = Symbol(), He = /* @__PURE__ */ new WeakMap();
let Ye = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== Ae) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (_e && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = He.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && He.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const bt = (n) => new Ye(typeof n == "string" ? n : n + "", void 0, Ae), kt = (n, ...e) => {
  const t = n.length === 1 ? n[0] : e.reduce((r, i, s) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + n[s + 1], n[0]);
  return new Ye(t, n, Ae);
}, xt = (n, e) => {
  if (_e) n.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), i = se.litNonce;
    i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
  }
}, qe = _e ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return bt(t);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: wt, defineProperty: $t, getOwnPropertyDescriptor: yt, getOwnPropertyNames: vt, getOwnPropertySymbols: _t, getPrototypeOf: At } = Object, E = globalThis, Be = E.trustedTypes, St = Be ? Be.emptyScript : "", me = E.reactiveElementPolyfillSupport, W = (n, e) => n, ae = { toAttribute(n, e) {
  switch (e) {
    case Boolean:
      n = n ? St : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, e) {
  let t = n;
  switch (e) {
    case Boolean:
      t = n !== null;
      break;
    case Number:
      t = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(n);
      } catch {
        t = null;
      }
  }
  return t;
} }, Se = (n, e) => !wt(n, e), Oe = { attribute: !0, type: String, converter: ae, reflect: !1, useDefault: !1, hasChanged: Se };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), E.litPropertyMetadata ?? (E.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let H = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Oe) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = Symbol(), i = this.getPropertyDescriptor(e, r, t);
      i !== void 0 && $t(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: i, set: s } = yt(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get: i, set(o) {
      const a = i == null ? void 0 : i.call(this);
      s == null || s.call(this, o), this.requestUpdate(e, a, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Oe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(W("elementProperties"))) return;
    const e = At(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(W("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(W("properties"))) {
      const t = this.properties, r = [...vt(t), ..._t(t)];
      for (const i of r) this.createProperty(i, t[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [r, i] of t) this.elementProperties.set(r, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, r] of this.elementProperties) {
      const i = this._$Eu(t, r);
      i !== void 0 && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const i of r) t.unshift(qe(i));
    } else e !== void 0 && t.push(qe(e));
    return t;
  }
  static _$Eu(e, t) {
    const r = t.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const r of t.keys()) this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return xt(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var r;
      return (r = t.hostConnected) == null ? void 0 : r.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var r;
      return (r = t.hostDisconnected) == null ? void 0 : r.call(t);
    });
  }
  attributeChangedCallback(e, t, r) {
    this._$AK(e, r);
  }
  _$ET(e, t) {
    var s;
    const r = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, r);
    if (i !== void 0 && r.reflect === !0) {
      const o = (((s = r.converter) == null ? void 0 : s.toAttribute) !== void 0 ? r.converter : ae).toAttribute(t, r.type);
      this._$Em = e, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var s, o;
    const r = this.constructor, i = r._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const a = r.getPropertyOptions(i), c = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((s = a.converter) == null ? void 0 : s.fromAttribute) !== void 0 ? a.converter : ae;
      this._$Em = i, this[i] = c.fromAttribute(t, a.type) ?? ((o = this._$Ej) == null ? void 0 : o.get(i)) ?? null, this._$Em = null;
    }
  }
  requestUpdate(e, t, r) {
    var i;
    if (e !== void 0) {
      const s = this.constructor, o = this[e];
      if (r ?? (r = s.getPropertyOptions(e)), !((r.hasChanged ?? Se)(o, t) || r.useDefault && r.reflect && o === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(s._$Eu(e, r)))) return;
      this.C(e, t, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: r, reflect: i, wrapped: s }, o) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, o ?? t ?? this[e]), s !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var r;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [s, o] of this._$Ep) this[s] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [s, o] of i) {
        const { wrapped: a } = o, c = this[s];
        a !== !0 || this._$AL.has(s) || c === void 0 || this.C(s, void 0, o, c);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (r = this._$EO) == null || r.forEach((i) => {
        var s;
        return (s = i.hostUpdate) == null ? void 0 : s.call(i);
      }), this.update(t)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((r) => {
      var i;
      return (i = r.hostUpdated) == null ? void 0 : i.call(r);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
H.elementStyles = [], H.shadowRootOptions = { mode: "open" }, H[W("elementProperties")] = /* @__PURE__ */ new Map(), H[W("finalized")] = /* @__PURE__ */ new Map(), me == null || me({ ReactiveElement: H }), (E.reactiveElementVersions ?? (E.reactiveElementVersions = [])).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = globalThis, le = G.trustedTypes, Ue = le ? le.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, et = "$lit$", S = `lit$${Math.random().toFixed(9).slice(2)}$`, tt = "?" + S, Et = `<${tt}>`, P = document, X = () => P.createComment(""), J = (n) => n === null || typeof n != "object" && typeof n != "function", Ee = Array.isArray, Tt = (n) => Ee(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", be = `[ 	
\f\r]`, V = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, De = /-->/g, je = />/g, L = RegExp(`>|${be}(?:([^\\s"'>=/]+)(${be}*=${be}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ve = /'/g, Ne = /"/g, nt = /^(?:script|style|textarea|title)$/i, Rt = (n) => (e, ...t) => ({ _$litType$: n, strings: e, values: t }), re = Rt(1), q = Symbol.for("lit-noChange"), k = Symbol.for("lit-nothing"), Ze = /* @__PURE__ */ new WeakMap(), C = P.createTreeWalker(P, 129);
function rt(n, e) {
  if (!Ee(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ue !== void 0 ? Ue.createHTML(e) : e;
}
const Lt = (n, e) => {
  const t = n.length - 1, r = [];
  let i, s = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = V;
  for (let a = 0; a < t; a++) {
    const c = n[a];
    let l, h, u = -1, p = 0;
    for (; p < c.length && (o.lastIndex = p, h = o.exec(c), h !== null); ) p = o.lastIndex, o === V ? h[1] === "!--" ? o = De : h[1] !== void 0 ? o = je : h[2] !== void 0 ? (nt.test(h[2]) && (i = RegExp("</" + h[2], "g")), o = L) : h[3] !== void 0 && (o = L) : o === L ? h[0] === ">" ? (o = i ?? V, u = -1) : h[1] === void 0 ? u = -2 : (u = o.lastIndex - h[2].length, l = h[1], o = h[3] === void 0 ? L : h[3] === '"' ? Ne : Ve) : o === Ne || o === Ve ? o = L : o === De || o === je ? o = V : (o = L, i = void 0);
    const f = o === L && n[a + 1].startsWith("/>") ? " " : "";
    s += o === V ? c + Et : u >= 0 ? (r.push(l), c.slice(0, u) + et + c.slice(u) + S + f) : c + S + (u === -2 ? a : f);
  }
  return [rt(n, s + (n[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class Y {
  constructor({ strings: e, _$litType$: t }, r) {
    let i;
    this.parts = [];
    let s = 0, o = 0;
    const a = e.length - 1, c = this.parts, [l, h] = Lt(e, t);
    if (this.el = Y.createElement(l, r), C.currentNode = this.el.content, t === 2 || t === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (i = C.nextNode()) !== null && c.length < a; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const u of i.getAttributeNames()) if (u.endsWith(et)) {
          const p = h[o++], f = i.getAttribute(u).split(S), d = /([.?@])?(.*)/.exec(p);
          c.push({ type: 1, index: s, name: d[2], strings: f, ctor: d[1] === "." ? zt : d[1] === "?" ? Pt : d[1] === "@" ? It : ue }), i.removeAttribute(u);
        } else u.startsWith(S) && (c.push({ type: 6, index: s }), i.removeAttribute(u));
        if (nt.test(i.tagName)) {
          const u = i.textContent.split(S), p = u.length - 1;
          if (p > 0) {
            i.textContent = le ? le.emptyScript : "";
            for (let f = 0; f < p; f++) i.append(u[f], X()), C.nextNode(), c.push({ type: 2, index: ++s });
            i.append(u[p], X());
          }
        }
      } else if (i.nodeType === 8) if (i.data === tt) c.push({ type: 2, index: s });
      else {
        let u = -1;
        for (; (u = i.data.indexOf(S, u + 1)) !== -1; ) c.push({ type: 7, index: s }), u += S.length - 1;
      }
      s++;
    }
  }
  static createElement(e, t) {
    const r = P.createElement("template");
    return r.innerHTML = e, r;
  }
}
function B(n, e, t = n, r) {
  var o, a;
  if (e === q) return e;
  let i = r !== void 0 ? (o = t._$Co) == null ? void 0 : o[r] : t._$Cl;
  const s = J(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== s && ((a = i == null ? void 0 : i._$AO) == null || a.call(i, !1), s === void 0 ? i = void 0 : (i = new s(n), i._$AT(n, t, r)), r !== void 0 ? (t._$Co ?? (t._$Co = []))[r] = i : t._$Cl = i), i !== void 0 && (e = B(n, i._$AS(n, e.values), i, r)), e;
}
class Ct {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: r } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? P).importNode(t, !0);
    C.currentNode = i;
    let s = C.nextNode(), o = 0, a = 0, c = r[0];
    for (; c !== void 0; ) {
      if (o === c.index) {
        let l;
        c.type === 2 ? l = new ee(s, s.nextSibling, this, e) : c.type === 1 ? l = new c.ctor(s, c.name, c.strings, this, e) : c.type === 6 && (l = new Mt(s, this, e)), this._$AV.push(l), c = r[++a];
      }
      o !== (c == null ? void 0 : c.index) && (s = C.nextNode(), o++);
    }
    return C.currentNode = P, i;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class ee {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, r, i) {
    this.type = 2, this._$AH = k, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = r, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = B(this, e, t), J(e) ? e === k || e == null || e === "" ? (this._$AH !== k && this._$AR(), this._$AH = k) : e !== this._$AH && e !== q && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Tt(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== k && J(this._$AH) ? this._$AA.nextSibling.data = e : this.T(P.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var s;
    const { values: t, _$litType$: r } = e, i = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = Y.createElement(rt(r.h, r.h[0]), this.options)), r);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === i) this._$AH.p(t);
    else {
      const o = new Ct(i, this), a = o.u(this.options);
      o.p(t), this.T(a), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = Ze.get(e.strings);
    return t === void 0 && Ze.set(e.strings, t = new Y(e)), t;
  }
  k(e) {
    Ee(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, i = 0;
    for (const s of e) i === t.length ? t.push(r = new ee(this.O(X()), this.O(X()), this, this.options)) : r = t[i], r._$AI(s), i++;
    i < t.length && (this._$AR(r && r._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, t); e && e !== this._$AB; ) {
      const i = e.nextSibling;
      e.remove(), e = i;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class ue {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, i, s) {
    this.type = 1, this._$AH = k, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = s, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = k;
  }
  _$AI(e, t = this, r, i) {
    const s = this.strings;
    let o = !1;
    if (s === void 0) e = B(this, e, t, 0), o = !J(e) || e !== this._$AH && e !== q, o && (this._$AH = e);
    else {
      const a = e;
      let c, l;
      for (e = s[0], c = 0; c < s.length - 1; c++) l = B(this, a[r + c], t, c), l === q && (l = this._$AH[c]), o || (o = !J(l) || l !== this._$AH[c]), l === k ? e = k : e !== k && (e += (l ?? "") + s[c + 1]), this._$AH[c] = l;
    }
    o && !i && this.j(e);
  }
  j(e) {
    e === k ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class zt extends ue {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === k ? void 0 : e;
  }
}
class Pt extends ue {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== k);
  }
}
class It extends ue {
  constructor(e, t, r, i, s) {
    super(e, t, r, i, s), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = B(this, e, t, 0) ?? k) === q) return;
    const r = this._$AH, i = e === k && r !== k || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, s = e !== k && (r === k || i);
    i && this.element.removeEventListener(this.name, this, r), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Mt {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    B(this, e);
  }
}
const ke = G.litHtmlPolyfillSupport;
ke == null || ke(Y, ee), (G.litHtmlVersions ?? (G.litHtmlVersions = [])).push("3.3.0");
const Ft = (n, e, t) => {
  const r = (t == null ? void 0 : t.renderBefore) ?? e;
  let i = r._$litPart$;
  if (i === void 0) {
    const s = (t == null ? void 0 : t.renderBefore) ?? null;
    r._$litPart$ = i = new ee(e.insertBefore(X(), s), s, void 0, t ?? {});
  }
  return i._$AI(n), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = globalThis;
class Q extends H {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ft(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return q;
  }
}
var Je;
Q._$litElement$ = !0, Q.finalized = !0, (Je = z.litElementHydrateSupport) == null || Je.call(z, { LitElement: Q });
const xe = z.litElementPolyfillSupport;
xe == null || xe({ LitElement: Q });
(z.litElementVersions ?? (z.litElementVersions = [])).push("4.2.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ht = (n) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(n, e);
  }) : customElements.define(n, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qt = { attribute: !0, type: String, converter: ae, reflect: !1, hasChanged: Se }, Bt = (n = qt, e, t) => {
  const { kind: r, metadata: i } = t;
  let s = globalThis.litPropertyMetadata.get(i);
  if (s === void 0 && globalThis.litPropertyMetadata.set(i, s = /* @__PURE__ */ new Map()), r === "setter" && ((n = Object.create(n)).wrapped = !0), s.set(t.name, n), r === "accessor") {
    const { name: o } = t;
    return { set(a) {
      const c = e.get.call(this);
      e.set.call(this, a), this.requestUpdate(o, c, n);
    }, init(a) {
      return a !== void 0 && this.C(o, void 0, n, a), a;
    } };
  }
  if (r === "setter") {
    const { name: o } = t;
    return function(a) {
      const c = this[o];
      e.call(this, a), this.requestUpdate(o, c, n);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function O(n) {
  return (e, t) => typeof t == "object" ? Bt(n, e, t) : ((r, i, s) => {
    const o = i.hasOwnProperty(s);
    return i.constructor.createProperty(s, r), o ? Object.getOwnPropertyDescriptor(i, s) : void 0;
  })(n, e, t);
}
class Ot {
  constructor(e = {}) {
    this.options = {
      preserveMarkdown: !0,
      fieldPrefix: "@",
      inlineFieldDelimiter: "___",
      ...e
    };
  }
  parseFormdown(e) {
    const { fields: t, cleanedMarkdown: r } = this.extractFields(e);
    return {
      markdown: this.options.preserveMarkdown ? r : "",
      forms: t
    };
  }
  parse(e) {
    const { fields: t } = this.extractFields(e);
    return { fields: t, errors: [] };
  }
  extractFields(e) {
    const t = [], r = e.split(`
`), i = [];
    for (let s = 0; s < r.length; s++) {
      const o = r[s], a = this.parseBlockField(o);
      if (a) {
        t.push(a), i.push(`<!--FORMDOWN_FIELD_${t.length - 1}-->`);
        continue;
      }
      const { cleanedLine: c, inlineFields: l } = this.parseInlineFields(o);
      t.push(...l), i.push(c);
    }
    return {
      fields: t,
      cleanedMarkdown: i.join(`
`)
    };
  }
  parseBlockField(e) {
    const r = e.trim().match(/^@(\w+)(?:\(([^)]+)\))?\s*:\s*\[([^\]]*)\].*$/);
    if (!r)
      return null;
    const [, i, s, o] = r;
    return this.createField(i, s, o);
  }
  parseInlineFields(e) {
    const t = [], r = this.options.inlineFieldDelimiter, i = new RegExp(`${r}@(\\w+)(?:\\(([^)]+)\\))?(?:\\[([^\\]]*)\\])?`, "g");
    return { cleanedLine: e.replace(i, (o, a, c, l) => {
      const h = l !== void 0 ? l : "text", u = this.createField(a, c, h);
      return u ? (t.push(u), `<span contenteditable="true" data-field-name="${a}" data-field-type="${u.type}" data-placeholder="${u.label || a}" class="formdown-inline-field">${u.label || a}</span>`) : o;
    }), inlineFields: t };
  }
  createField(e, t, r) {
    if (/^\d/.test(e))
      throw new Error(`Invalid field name '${e}': Field names cannot start with a number`);
    if (!r.trim())
      return {
        name: e,
        type: "text",
        label: t || this.formatLabel(e),
        attributes: {}
      };
    const i = /([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/g, s = Array.from(r.matchAll(i));
    if (s.length === 0)
      return null;
    const o = s[0][1];
    if (!o)
      return null;
    const a = {
      name: e,
      type: o,
      label: t || this.formatLabel(e),
      attributes: {}
    };
    for (let c = 1; c < s.length; c++) {
      const [, l, h, u, p] = s[c];
      if (l === "required")
        a.required = !0;
      else if (l === "label" && (h !== void 0 || u !== void 0 || p !== void 0))
        a.label = h || u || p;
      else if (l === "options" && (h !== void 0 || u !== void 0 || p !== void 0)) {
        const f = h || u || p;
        ["radio", "checkbox", "select"].includes(o) && (a.options = f.split(",").map((d) => d.trim()).filter((d) => d.length > 0));
      } else if (h !== void 0 || u !== void 0 || p !== void 0) {
        const f = h || u || p;
        l === "placeholder" ? a.placeholder = f : a.attributes[l] = this.parseAttributeValue(f);
      } else
        a.attributes[l] = !0;
    }
    return a;
  }
  /**
   * Generate a human-readable label from a field name
   * @param fieldName - The field name to convert
   * @returns A formatted label string
   */
  formatLabel(e) {
    return e.includes("_") ? e.split("_").map((t) => this.capitalizeWord(t)).join(" ") : /[a-z][A-Z]/.test(e) ? e.replace(/([a-z])([A-Z])/g, "$1 $2").split(" ").map((t) => this.capitalizeWord(t)).join(" ") : this.capitalizeWord(e);
  }
  /**
   * Capitalize the first letter of a word
   * @param word - The word to capitalize
   * @returns The capitalized word
   */
  capitalizeWord(e) {
    return e && e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
  }
  parseAttributeValue(e) {
    return /^\d+$/.test(e) ? parseInt(e, 10) : /^\d*\.\d+$/.test(e) ? parseFloat(e) : e === "true" ? !0 : e === "false" ? !1 : e;
  }
}
function Te() {
  return {
    async: !1,
    breaks: !1,
    extensions: null,
    gfm: !0,
    hooks: null,
    pedantic: !1,
    renderer: null,
    silent: !1,
    tokenizer: null,
    walkTokens: null
  };
}
var M = Te();
function it(n) {
  M = n;
}
var K = { exec: () => null };
function m(n, e = "") {
  let t = typeof n == "string" ? n : n.source;
  const r = {
    replace: (i, s) => {
      let o = typeof s == "string" ? s : s.source;
      return o = o.replace(w.caret, "$1"), t = t.replace(i, o), r;
    },
    getRegex: () => new RegExp(t, e)
  };
  return r;
}
var w = {
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
  listItemRegex: (n) => new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`),
  nextBulletRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
  hrRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
  fencesBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}(?:\`\`\`|~~~)`),
  headingBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}#`),
  htmlBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}<(?:[a-z].*>|!--)`, "i")
}, Ut = /^(?:[ \t]*(?:\n|$))+/, Dt = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, jt = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, te = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Vt = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Re = /(?:[*+-]|\d{1,9}[.)])/, st = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, ot = m(st).replace(/bull/g, Re).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Nt = m(st).replace(/bull/g, Re).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Le = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Zt = /^[^\n]+/, Ce = /(?!\s*\])(?:\\.|[^\[\]\\])+/, Wt = m(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Ce).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Gt = m(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Re).getRegex(), de = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", ze = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Qt = m(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", ze).replace("tag", de).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), at = m(Le).replace("hr", te).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", de).getRegex(), Kt = m(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", at).getRegex(), Pe = {
  blockquote: Kt,
  code: Dt,
  def: Wt,
  fences: jt,
  heading: Vt,
  hr: te,
  html: Qt,
  lheading: ot,
  list: Gt,
  newline: Ut,
  paragraph: at,
  table: K,
  text: Zt
}, We = m(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", te).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", de).getRegex(), Xt = {
  ...Pe,
  lheading: Nt,
  table: We,
  paragraph: m(Le).replace("hr", te).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", We).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", de).getRegex()
}, Jt = {
  ...Pe,
  html: m(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", ze).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: K,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: m(Le).replace("hr", te).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ot).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, Yt = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, en = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, lt = /^( {2,}|\\)\n(?!\s*$)/, tn = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, fe = /[\p{P}\p{S}]/u, Ie = /[\s\p{P}\p{S}]/u, ct = /[^\s\p{P}\p{S}]/u, nn = m(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Ie).getRegex(), ht = /(?!~)[\p{P}\p{S}]/u, rn = /(?!~)[\s\p{P}\p{S}]/u, sn = /(?:[^\s\p{P}\p{S}]|~)/u, on = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, pt = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, an = m(pt, "u").replace(/punct/g, fe).getRegex(), ln = m(pt, "u").replace(/punct/g, ht).getRegex(), ut = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", cn = m(ut, "gu").replace(/notPunctSpace/g, ct).replace(/punctSpace/g, Ie).replace(/punct/g, fe).getRegex(), hn = m(ut, "gu").replace(/notPunctSpace/g, sn).replace(/punctSpace/g, rn).replace(/punct/g, ht).getRegex(), pn = m(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, ct).replace(/punctSpace/g, Ie).replace(/punct/g, fe).getRegex(), un = m(/\\(punct)/, "gu").replace(/punct/g, fe).getRegex(), dn = m(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), fn = m(ze).replace("(?:-->|$)", "-->").getRegex(), gn = m(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", fn).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), ce = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, mn = m(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", ce).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), dt = m(/^!?\[(label)\]\[(ref)\]/).replace("label", ce).replace("ref", Ce).getRegex(), ft = m(/^!?\[(ref)\](?:\[\])?/).replace("ref", Ce).getRegex(), bn = m("reflink|nolink(?!\\()", "g").replace("reflink", dt).replace("nolink", ft).getRegex(), Me = {
  _backpedal: K,
  // only used for GFM url
  anyPunctuation: un,
  autolink: dn,
  blockSkip: on,
  br: lt,
  code: en,
  del: K,
  emStrongLDelim: an,
  emStrongRDelimAst: cn,
  emStrongRDelimUnd: pn,
  escape: Yt,
  link: mn,
  nolink: ft,
  punctuation: nn,
  reflink: dt,
  reflinkSearch: bn,
  tag: gn,
  text: tn,
  url: K
}, kn = {
  ...Me,
  link: m(/^!?\[(label)\]\((.*?)\)/).replace("label", ce).getRegex(),
  reflink: m(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", ce).getRegex()
}, $e = {
  ...Me,
  emStrongRDelimAst: hn,
  emStrongLDelim: ln,
  url: m(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, xn = {
  ...$e,
  br: m(lt).replace("{2,}", "*").getRegex(),
  text: m($e.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, ie = {
  normal: Pe,
  gfm: Xt,
  pedantic: Jt
}, N = {
  normal: Me,
  gfm: $e,
  breaks: xn,
  pedantic: kn
}, wn = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, Ge = (n) => wn[n];
function v(n, e) {
  if (e) {
    if (w.escapeTest.test(n))
      return n.replace(w.escapeReplace, Ge);
  } else if (w.escapeTestNoEncode.test(n))
    return n.replace(w.escapeReplaceNoEncode, Ge);
  return n;
}
function Qe(n) {
  try {
    n = encodeURI(n).replace(w.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function Ke(n, e) {
  var s;
  const t = n.replace(w.findPipe, (o, a, c) => {
    let l = !1, h = a;
    for (; --h >= 0 && c[h] === "\\"; ) l = !l;
    return l ? "|" : " |";
  }), r = t.split(w.splitPipe);
  let i = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !((s = r.at(-1)) != null && s.trim()) && r.pop(), e)
    if (r.length > e)
      r.splice(e);
    else
      for (; r.length < e; ) r.push("");
  for (; i < r.length; i++)
    r[i] = r[i].trim().replace(w.slashPipe, "|");
  return r;
}
function Z(n, e, t) {
  const r = n.length;
  if (r === 0)
    return "";
  let i = 0;
  for (; i < r && n.charAt(r - i - 1) === e; )
    i++;
  return n.slice(0, r - i);
}
function $n(n, e) {
  if (n.indexOf(e[1]) === -1)
    return -1;
  let t = 0;
  for (let r = 0; r < n.length; r++)
    if (n[r] === "\\")
      r++;
    else if (n[r] === e[0])
      t++;
    else if (n[r] === e[1] && (t--, t < 0))
      return r;
  return t > 0 ? -2 : -1;
}
function Xe(n, e, t, r, i) {
  const s = e.href, o = e.title || null, a = n[1].replace(i.other.outputLinkReplace, "$1");
  r.state.inLink = !0;
  const c = {
    type: n[0].charAt(0) === "!" ? "image" : "link",
    raw: t,
    href: s,
    title: o,
    text: a,
    tokens: r.inlineTokens(a)
  };
  return r.state.inLink = !1, c;
}
function yn(n, e, t) {
  const r = n.match(t.other.indentCodeCompensation);
  if (r === null)
    return e;
  const i = r[1];
  return e.split(`
`).map((s) => {
    const o = s.match(t.other.beginningSpace);
    if (o === null)
      return s;
    const [a] = o;
    return a.length >= i.length ? s.slice(i.length) : s;
  }).join(`
`);
}
var he = class {
  // set by the lexer
  constructor(n) {
    b(this, "options");
    b(this, "rules");
    // set by the lexer
    b(this, "lexer");
    this.options = n || M;
  }
  space(n) {
    const e = this.rules.block.newline.exec(n);
    if (e && e[0].length > 0)
      return {
        type: "space",
        raw: e[0]
      };
  }
  code(n) {
    const e = this.rules.block.code.exec(n);
    if (e) {
      const t = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return {
        type: "code",
        raw: e[0],
        codeBlockStyle: "indented",
        text: this.options.pedantic ? t : Z(t, `
`)
      };
    }
  }
  fences(n) {
    const e = this.rules.block.fences.exec(n);
    if (e) {
      const t = e[0], r = yn(t, e[3] || "", this.rules);
      return {
        type: "code",
        raw: t,
        lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2],
        text: r
      };
    }
  }
  heading(n) {
    const e = this.rules.block.heading.exec(n);
    if (e) {
      let t = e[2].trim();
      if (this.rules.other.endingHash.test(t)) {
        const r = Z(t, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (t = r.trim());
      }
      return {
        type: "heading",
        raw: e[0],
        depth: e[1].length,
        text: t,
        tokens: this.lexer.inline(t)
      };
    }
  }
  hr(n) {
    const e = this.rules.block.hr.exec(n);
    if (e)
      return {
        type: "hr",
        raw: Z(e[0], `
`)
      };
  }
  blockquote(n) {
    const e = this.rules.block.blockquote.exec(n);
    if (e) {
      let t = Z(e[0], `
`).split(`
`), r = "", i = "";
      const s = [];
      for (; t.length > 0; ) {
        let o = !1;
        const a = [];
        let c;
        for (c = 0; c < t.length; c++)
          if (this.rules.other.blockquoteStart.test(t[c]))
            a.push(t[c]), o = !0;
          else if (!o)
            a.push(t[c]);
          else
            break;
        t = t.slice(c);
        const l = a.join(`
`), h = l.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${l}` : l, i = i ? `${i}
${h}` : h;
        const u = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(h, s, !0), this.lexer.state.top = u, t.length === 0)
          break;
        const p = s.at(-1);
        if ((p == null ? void 0 : p.type) === "code")
          break;
        if ((p == null ? void 0 : p.type) === "blockquote") {
          const f = p, d = f.raw + `
` + t.join(`
`), x = this.blockquote(d);
          s[s.length - 1] = x, r = r.substring(0, r.length - f.raw.length) + x.raw, i = i.substring(0, i.length - f.text.length) + x.text;
          break;
        } else if ((p == null ? void 0 : p.type) === "list") {
          const f = p, d = f.raw + `
` + t.join(`
`), x = this.list(d);
          s[s.length - 1] = x, r = r.substring(0, r.length - p.raw.length) + x.raw, i = i.substring(0, i.length - f.raw.length) + x.raw, t = d.substring(s.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return {
        type: "blockquote",
        raw: r,
        tokens: s,
        text: i
      };
    }
  }
  list(n) {
    let e = this.rules.block.list.exec(n);
    if (e) {
      let t = e[1].trim();
      const r = t.length > 1, i = {
        type: "list",
        raw: "",
        ordered: r,
        start: r ? +t.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      t = r ? `\\d{1,9}\\${t.slice(-1)}` : `\\${t}`, this.options.pedantic && (t = r ? t : "[*+-]");
      const s = this.rules.other.listItemRegex(t);
      let o = !1;
      for (; n; ) {
        let c = !1, l = "", h = "";
        if (!(e = s.exec(n)) || this.rules.block.hr.test(n))
          break;
        l = e[0], n = n.substring(l.length);
        let u = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (T) => " ".repeat(3 * T.length)), p = n.split(`
`, 1)[0], f = !u.trim(), d = 0;
        if (this.options.pedantic ? (d = 2, h = u.trimStart()) : f ? d = e[1].length + 1 : (d = e[2].search(this.rules.other.nonSpaceChar), d = d > 4 ? 1 : d, h = u.slice(d), d += e[1].length), f && this.rules.other.blankLine.test(p) && (l += p + `
`, n = n.substring(p.length + 1), c = !0), !c) {
          const T = this.rules.other.nextBulletRegex(d), R = this.rules.other.hrRegex(d), U = this.rules.other.fencesBeginRegex(d), D = this.rules.other.headingBeginRegex(d), ne = this.rules.other.htmlBeginRegex(d);
          for (; n; ) {
            const ge = n.split(`
`, 1)[0];
            let j;
            if (p = ge, this.options.pedantic ? (p = p.replace(this.rules.other.listReplaceNesting, "  "), j = p) : j = p.replace(this.rules.other.tabCharGlobal, "    "), U.test(p) || D.test(p) || ne.test(p) || T.test(p) || R.test(p))
              break;
            if (j.search(this.rules.other.nonSpaceChar) >= d || !p.trim())
              h += `
` + j.slice(d);
            else {
              if (f || u.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || U.test(u) || D.test(u) || R.test(u))
                break;
              h += `
` + p;
            }
            !f && !p.trim() && (f = !0), l += ge + `
`, n = n.substring(ge.length + 1), u = j.slice(d);
          }
        }
        i.loose || (o ? i.loose = !0 : this.rules.other.doubleBlankLine.test(l) && (o = !0));
        let x = null, y;
        this.options.gfm && (x = this.rules.other.listIsTask.exec(h), x && (y = x[0] !== "[ ] ", h = h.replace(this.rules.other.listReplaceTask, ""))), i.items.push({
          type: "list_item",
          raw: l,
          task: !!x,
          checked: y,
          loose: !1,
          text: h,
          tokens: []
        }), i.raw += l;
      }
      const a = i.items.at(-1);
      if (a)
        a.raw = a.raw.trimEnd(), a.text = a.text.trimEnd();
      else
        return;
      i.raw = i.raw.trimEnd();
      for (let c = 0; c < i.items.length; c++)
        if (this.lexer.state.top = !1, i.items[c].tokens = this.lexer.blockTokens(i.items[c].text, []), !i.loose) {
          const l = i.items[c].tokens.filter((u) => u.type === "space"), h = l.length > 0 && l.some((u) => this.rules.other.anyLine.test(u.raw));
          i.loose = h;
        }
      if (i.loose)
        for (let c = 0; c < i.items.length; c++)
          i.items[c].loose = !0;
      return i;
    }
  }
  html(n) {
    const e = this.rules.block.html.exec(n);
    if (e)
      return {
        type: "html",
        block: !0,
        raw: e[0],
        pre: e[1] === "pre" || e[1] === "script" || e[1] === "style",
        text: e[0]
      };
  }
  def(n) {
    const e = this.rules.block.def.exec(n);
    if (e) {
      const t = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return {
        type: "def",
        tag: t,
        raw: e[0],
        href: r,
        title: i
      };
    }
  }
  table(n) {
    var o;
    const e = this.rules.block.table.exec(n);
    if (!e || !this.rules.other.tableDelimiter.test(e[2]))
      return;
    const t = Ke(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = (o = e[3]) != null && o.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], s = {
      type: "table",
      raw: e[0],
      header: [],
      align: [],
      rows: []
    };
    if (t.length === r.length) {
      for (const a of r)
        this.rules.other.tableAlignRight.test(a) ? s.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? s.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? s.align.push("left") : s.align.push(null);
      for (let a = 0; a < t.length; a++)
        s.header.push({
          text: t[a],
          tokens: this.lexer.inline(t[a]),
          header: !0,
          align: s.align[a]
        });
      for (const a of i)
        s.rows.push(Ke(a, s.header.length).map((c, l) => ({
          text: c,
          tokens: this.lexer.inline(c),
          header: !1,
          align: s.align[l]
        })));
      return s;
    }
  }
  lheading(n) {
    const e = this.rules.block.lheading.exec(n);
    if (e)
      return {
        type: "heading",
        raw: e[0],
        depth: e[2].charAt(0) === "=" ? 1 : 2,
        text: e[1],
        tokens: this.lexer.inline(e[1])
      };
  }
  paragraph(n) {
    const e = this.rules.block.paragraph.exec(n);
    if (e) {
      const t = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return {
        type: "paragraph",
        raw: e[0],
        text: t,
        tokens: this.lexer.inline(t)
      };
    }
  }
  text(n) {
    const e = this.rules.block.text.exec(n);
    if (e)
      return {
        type: "text",
        raw: e[0],
        text: e[0],
        tokens: this.lexer.inline(e[0])
      };
  }
  escape(n) {
    const e = this.rules.inline.escape.exec(n);
    if (e)
      return {
        type: "escape",
        raw: e[0],
        text: e[1]
      };
  }
  tag(n) {
    const e = this.rules.inline.tag.exec(n);
    if (e)
      return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), {
        type: "html",
        raw: e[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: !1,
        text: e[0]
      };
  }
  link(n) {
    const e = this.rules.inline.link.exec(n);
    if (e) {
      const t = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(t)) {
        if (!this.rules.other.endAngleBracket.test(t))
          return;
        const s = Z(t.slice(0, -1), "\\");
        if ((t.length - s.length) % 2 === 0)
          return;
      } else {
        const s = $n(e[2], "()");
        if (s === -2)
          return;
        if (s > -1) {
          const a = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + s;
          e[2] = e[2].substring(0, s), e[0] = e[0].substring(0, a).trim(), e[3] = "";
        }
      }
      let r = e[2], i = "";
      if (this.options.pedantic) {
        const s = this.rules.other.pedanticHrefTitle.exec(r);
        s && (r = s[1], i = s[3]);
      } else
        i = e[3] ? e[3].slice(1, -1) : "";
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(t) ? r = r.slice(1) : r = r.slice(1, -1)), Xe(e, {
        href: r && r.replace(this.rules.inline.anyPunctuation, "$1"),
        title: i && i.replace(this.rules.inline.anyPunctuation, "$1")
      }, e[0], this.lexer, this.rules);
    }
  }
  reflink(n, e) {
    let t;
    if ((t = this.rules.inline.reflink.exec(n)) || (t = this.rules.inline.nolink.exec(n))) {
      const r = (t[2] || t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i = e[r.toLowerCase()];
      if (!i) {
        const s = t[0].charAt(0);
        return {
          type: "text",
          raw: s,
          text: s
        };
      }
      return Xe(t, i, t[0], this.lexer, this.rules);
    }
  }
  emStrong(n, e, t = "") {
    let r = this.rules.inline.emStrongLDelim.exec(n);
    if (!r || r[3] && t.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(r[1] || r[2] || "") || !t || this.rules.inline.punctuation.exec(t)) {
      const s = [...r[0]].length - 1;
      let o, a, c = s, l = 0;
      const h = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (h.lastIndex = 0, e = e.slice(-1 * n.length + s); (r = h.exec(e)) != null; ) {
        if (o = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !o) continue;
        if (a = [...o].length, r[3] || r[4]) {
          c += a;
          continue;
        } else if ((r[5] || r[6]) && s % 3 && !((s + a) % 3)) {
          l += a;
          continue;
        }
        if (c -= a, c > 0) continue;
        a = Math.min(a, a + c + l);
        const u = [...r[0]][0].length, p = n.slice(0, s + r.index + u + a);
        if (Math.min(s, a) % 2) {
          const d = p.slice(1, -1);
          return {
            type: "em",
            raw: p,
            text: d,
            tokens: this.lexer.inlineTokens(d)
          };
        }
        const f = p.slice(2, -2);
        return {
          type: "strong",
          raw: p,
          text: f,
          tokens: this.lexer.inlineTokens(f)
        };
      }
    }
  }
  codespan(n) {
    const e = this.rules.inline.code.exec(n);
    if (e) {
      let t = e[2].replace(this.rules.other.newLineCharGlobal, " ");
      const r = this.rules.other.nonSpaceChar.test(t), i = this.rules.other.startingSpaceChar.test(t) && this.rules.other.endingSpaceChar.test(t);
      return r && i && (t = t.substring(1, t.length - 1)), {
        type: "codespan",
        raw: e[0],
        text: t
      };
    }
  }
  br(n) {
    const e = this.rules.inline.br.exec(n);
    if (e)
      return {
        type: "br",
        raw: e[0]
      };
  }
  del(n) {
    const e = this.rules.inline.del.exec(n);
    if (e)
      return {
        type: "del",
        raw: e[0],
        text: e[2],
        tokens: this.lexer.inlineTokens(e[2])
      };
  }
  autolink(n) {
    const e = this.rules.inline.autolink.exec(n);
    if (e) {
      let t, r;
      return e[2] === "@" ? (t = e[1], r = "mailto:" + t) : (t = e[1], r = t), {
        type: "link",
        raw: e[0],
        text: t,
        href: r,
        tokens: [
          {
            type: "text",
            raw: t,
            text: t
          }
        ]
      };
    }
  }
  url(n) {
    var t;
    let e;
    if (e = this.rules.inline.url.exec(n)) {
      let r, i;
      if (e[2] === "@")
        r = e[0], i = "mailto:" + r;
      else {
        let s;
        do
          s = e[0], e[0] = ((t = this.rules.inline._backpedal.exec(e[0])) == null ? void 0 : t[0]) ?? "";
        while (s !== e[0]);
        r = e[0], e[1] === "www." ? i = "http://" + e[0] : i = e[0];
      }
      return {
        type: "link",
        raw: e[0],
        text: r,
        href: i,
        tokens: [
          {
            type: "text",
            raw: r,
            text: r
          }
        ]
      };
    }
  }
  inlineText(n) {
    const e = this.rules.inline.text.exec(n);
    if (e) {
      const t = this.lexer.state.inRawBlock;
      return {
        type: "text",
        raw: e[0],
        text: e[0],
        escaped: t
      };
    }
  }
}, _ = class ye {
  constructor(e) {
    b(this, "tokens");
    b(this, "options");
    b(this, "state");
    b(this, "tokenizer");
    b(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || M, this.options.tokenizer = this.options.tokenizer || new he(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const t = {
      other: w,
      block: ie.normal,
      inline: N.normal
    };
    this.options.pedantic ? (t.block = ie.pedantic, t.inline = N.pedantic) : this.options.gfm && (t.block = ie.gfm, this.options.breaks ? t.inline = N.breaks : t.inline = N.gfm), this.tokenizer.rules = t;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: ie,
      inline: N
    };
  }
  /**
   * Static Lex Method
   */
  static lex(e, t) {
    return new ye(t).lex(e);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(e, t) {
    return new ye(t).inlineTokens(e);
  }
  /**
   * Preprocessing
   */
  lex(e) {
    e = e.replace(w.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      const r = this.inlineQueue[t];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], r = !1) {
    var i, s, o;
    for (this.options.pedantic && (e = e.replace(w.tabCharGlobal, "    ").replace(w.spaceLine, "")); e; ) {
      let a;
      if ((s = (i = this.options.extensions) == null ? void 0 : i.block) != null && s.some((l) => (a = l.call({ lexer: this }, e, t)) ? (e = e.substring(a.raw.length), t.push(a), !0) : !1))
        continue;
      if (a = this.tokenizer.space(e)) {
        e = e.substring(a.raw.length);
        const l = t.at(-1);
        a.raw.length === 1 && l !== void 0 ? l.raw += `
` : t.push(a);
        continue;
      }
      if (a = this.tokenizer.code(e)) {
        e = e.substring(a.raw.length);
        const l = t.at(-1);
        (l == null ? void 0 : l.type) === "paragraph" || (l == null ? void 0 : l.type) === "text" ? (l.raw += `
` + a.raw, l.text += `
` + a.text, this.inlineQueue.at(-1).src = l.text) : t.push(a);
        continue;
      }
      if (a = this.tokenizer.fences(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.heading(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.hr(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.blockquote(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.list(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.html(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.def(e)) {
        e = e.substring(a.raw.length);
        const l = t.at(-1);
        (l == null ? void 0 : l.type) === "paragraph" || (l == null ? void 0 : l.type) === "text" ? (l.raw += `
` + a.raw, l.text += `
` + a.raw, this.inlineQueue.at(-1).src = l.text) : this.tokens.links[a.tag] || (this.tokens.links[a.tag] = {
          href: a.href,
          title: a.title
        });
        continue;
      }
      if (a = this.tokenizer.table(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.lheading(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      let c = e;
      if ((o = this.options.extensions) != null && o.startBlock) {
        let l = 1 / 0;
        const h = e.slice(1);
        let u;
        this.options.extensions.startBlock.forEach((p) => {
          u = p.call({ lexer: this }, h), typeof u == "number" && u >= 0 && (l = Math.min(l, u));
        }), l < 1 / 0 && l >= 0 && (c = e.substring(0, l + 1));
      }
      if (this.state.top && (a = this.tokenizer.paragraph(c))) {
        const l = t.at(-1);
        r && (l == null ? void 0 : l.type) === "paragraph" ? (l.raw += `
` + a.raw, l.text += `
` + a.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = l.text) : t.push(a), r = c.length !== e.length, e = e.substring(a.raw.length);
        continue;
      }
      if (a = this.tokenizer.text(e)) {
        e = e.substring(a.raw.length);
        const l = t.at(-1);
        (l == null ? void 0 : l.type) === "text" ? (l.raw += `
` + a.raw, l.text += `
` + a.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = l.text) : t.push(a);
        continue;
      }
      if (e) {
        const l = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(l);
          break;
        } else
          throw new Error(l);
      }
    }
    return this.state.top = !0, t;
  }
  inline(e, t = []) {
    return this.inlineQueue.push({ src: e, tokens: t }), t;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(e, t = []) {
    var a, c, l;
    let r = e, i = null;
    if (this.tokens.links) {
      const h = Object.keys(this.tokens.links);
      if (h.length > 0)
        for (; (i = this.tokenizer.rules.inline.reflinkSearch.exec(r)) != null; )
          h.includes(i[0].slice(i[0].lastIndexOf("[") + 1, -1)) && (r = r.slice(0, i.index) + "[" + "a".repeat(i[0].length - 2) + "]" + r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (i = this.tokenizer.rules.inline.anyPunctuation.exec(r)) != null; )
      r = r.slice(0, i.index) + "++" + r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; (i = this.tokenizer.rules.inline.blockSkip.exec(r)) != null; )
      r = r.slice(0, i.index) + "[" + "a".repeat(i[0].length - 2) + "]" + r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    let s = !1, o = "";
    for (; e; ) {
      s || (o = ""), s = !1;
      let h;
      if ((c = (a = this.options.extensions) == null ? void 0 : a.inline) != null && c.some((p) => (h = p.call({ lexer: this }, e, t)) ? (e = e.substring(h.raw.length), t.push(h), !0) : !1))
        continue;
      if (h = this.tokenizer.escape(e)) {
        e = e.substring(h.raw.length), t.push(h);
        continue;
      }
      if (h = this.tokenizer.tag(e)) {
        e = e.substring(h.raw.length), t.push(h);
        continue;
      }
      if (h = this.tokenizer.link(e)) {
        e = e.substring(h.raw.length), t.push(h);
        continue;
      }
      if (h = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(h.raw.length);
        const p = t.at(-1);
        h.type === "text" && (p == null ? void 0 : p.type) === "text" ? (p.raw += h.raw, p.text += h.text) : t.push(h);
        continue;
      }
      if (h = this.tokenizer.emStrong(e, r, o)) {
        e = e.substring(h.raw.length), t.push(h);
        continue;
      }
      if (h = this.tokenizer.codespan(e)) {
        e = e.substring(h.raw.length), t.push(h);
        continue;
      }
      if (h = this.tokenizer.br(e)) {
        e = e.substring(h.raw.length), t.push(h);
        continue;
      }
      if (h = this.tokenizer.del(e)) {
        e = e.substring(h.raw.length), t.push(h);
        continue;
      }
      if (h = this.tokenizer.autolink(e)) {
        e = e.substring(h.raw.length), t.push(h);
        continue;
      }
      if (!this.state.inLink && (h = this.tokenizer.url(e))) {
        e = e.substring(h.raw.length), t.push(h);
        continue;
      }
      let u = e;
      if ((l = this.options.extensions) != null && l.startInline) {
        let p = 1 / 0;
        const f = e.slice(1);
        let d;
        this.options.extensions.startInline.forEach((x) => {
          d = x.call({ lexer: this }, f), typeof d == "number" && d >= 0 && (p = Math.min(p, d));
        }), p < 1 / 0 && p >= 0 && (u = e.substring(0, p + 1));
      }
      if (h = this.tokenizer.inlineText(u)) {
        e = e.substring(h.raw.length), h.raw.slice(-1) !== "_" && (o = h.raw.slice(-1)), s = !0;
        const p = t.at(-1);
        (p == null ? void 0 : p.type) === "text" ? (p.raw += h.raw, p.text += h.text) : t.push(h);
        continue;
      }
      if (e) {
        const p = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(p);
          break;
        } else
          throw new Error(p);
      }
    }
    return t;
  }
}, pe = class {
  // set by the parser
  constructor(n) {
    b(this, "options");
    b(this, "parser");
    this.options = n || M;
  }
  space(n) {
    return "";
  }
  code({ text: n, lang: e, escaped: t }) {
    var s;
    const r = (s = (e || "").match(w.notSpaceStart)) == null ? void 0 : s[0], i = n.replace(w.endingNewline, "") + `
`;
    return r ? '<pre><code class="language-' + v(r) + '">' + (t ? i : v(i, !0)) + `</code></pre>
` : "<pre><code>" + (t ? i : v(i, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: n }) {
    return `<blockquote>
${this.parser.parse(n)}</blockquote>
`;
  }
  html({ text: n }) {
    return n;
  }
  heading({ tokens: n, depth: e }) {
    return `<h${e}>${this.parser.parseInline(n)}</h${e}>
`;
  }
  hr(n) {
    return `<hr>
`;
  }
  list(n) {
    const e = n.ordered, t = n.start;
    let r = "";
    for (let o = 0; o < n.items.length; o++) {
      const a = n.items[o];
      r += this.listitem(a);
    }
    const i = e ? "ol" : "ul", s = e && t !== 1 ? ' start="' + t + '"' : "";
    return "<" + i + s + `>
` + r + "</" + i + `>
`;
  }
  listitem(n) {
    var t;
    let e = "";
    if (n.task) {
      const r = this.checkbox({ checked: !!n.checked });
      n.loose ? ((t = n.tokens[0]) == null ? void 0 : t.type) === "paragraph" ? (n.tokens[0].text = r + " " + n.tokens[0].text, n.tokens[0].tokens && n.tokens[0].tokens.length > 0 && n.tokens[0].tokens[0].type === "text" && (n.tokens[0].tokens[0].text = r + " " + v(n.tokens[0].tokens[0].text), n.tokens[0].tokens[0].escaped = !0)) : n.tokens.unshift({
        type: "text",
        raw: r + " ",
        text: r + " ",
        escaped: !0
      }) : e += r + " ";
    }
    return e += this.parser.parse(n.tokens, !!n.loose), `<li>${e}</li>
`;
  }
  checkbox({ checked: n }) {
    return "<input " + (n ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens: n }) {
    return `<p>${this.parser.parseInline(n)}</p>
`;
  }
  table(n) {
    let e = "", t = "";
    for (let i = 0; i < n.header.length; i++)
      t += this.tablecell(n.header[i]);
    e += this.tablerow({ text: t });
    let r = "";
    for (let i = 0; i < n.rows.length; i++) {
      const s = n.rows[i];
      t = "";
      for (let o = 0; o < s.length; o++)
        t += this.tablecell(s[o]);
      r += this.tablerow({ text: t });
    }
    return r && (r = `<tbody>${r}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + r + `</table>
`;
  }
  tablerow({ text: n }) {
    return `<tr>
${n}</tr>
`;
  }
  tablecell(n) {
    const e = this.parser.parseInline(n.tokens), t = n.header ? "th" : "td";
    return (n.align ? `<${t} align="${n.align}">` : `<${t}>`) + e + `</${t}>
`;
  }
  /**
   * span level renderer
   */
  strong({ tokens: n }) {
    return `<strong>${this.parser.parseInline(n)}</strong>`;
  }
  em({ tokens: n }) {
    return `<em>${this.parser.parseInline(n)}</em>`;
  }
  codespan({ text: n }) {
    return `<code>${v(n, !0)}</code>`;
  }
  br(n) {
    return "<br>";
  }
  del({ tokens: n }) {
    return `<del>${this.parser.parseInline(n)}</del>`;
  }
  link({ href: n, title: e, tokens: t }) {
    const r = this.parser.parseInline(t), i = Qe(n);
    if (i === null)
      return r;
    n = i;
    let s = '<a href="' + n + '"';
    return e && (s += ' title="' + v(e) + '"'), s += ">" + r + "</a>", s;
  }
  image({ href: n, title: e, text: t, tokens: r }) {
    r && (t = this.parser.parseInline(r, this.parser.textRenderer));
    const i = Qe(n);
    if (i === null)
      return v(t);
    n = i;
    let s = `<img src="${n}" alt="${t}"`;
    return e && (s += ` title="${v(e)}"`), s += ">", s;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : v(n.text);
  }
}, Fe = class {
  // no need for block level renderers
  strong({ text: n }) {
    return n;
  }
  em({ text: n }) {
    return n;
  }
  codespan({ text: n }) {
    return n;
  }
  del({ text: n }) {
    return n;
  }
  html({ text: n }) {
    return n;
  }
  text({ text: n }) {
    return n;
  }
  link({ text: n }) {
    return "" + n;
  }
  image({ text: n }) {
    return "" + n;
  }
  br() {
    return "";
  }
}, A = class ve {
  constructor(e) {
    b(this, "options");
    b(this, "renderer");
    b(this, "textRenderer");
    this.options = e || M, this.options.renderer = this.options.renderer || new pe(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Fe();
  }
  /**
   * Static Parse Method
   */
  static parse(e, t) {
    return new ve(t).parse(e);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(e, t) {
    return new ve(t).parseInline(e);
  }
  /**
   * Parse Loop
   */
  parse(e, t = !0) {
    var i, s;
    let r = "";
    for (let o = 0; o < e.length; o++) {
      const a = e[o];
      if ((s = (i = this.options.extensions) == null ? void 0 : i.renderers) != null && s[a.type]) {
        const l = a, h = this.options.extensions.renderers[l.type].call({ parser: this }, l);
        if (h !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(l.type)) {
          r += h || "";
          continue;
        }
      }
      const c = a;
      switch (c.type) {
        case "space": {
          r += this.renderer.space(c);
          continue;
        }
        case "hr": {
          r += this.renderer.hr(c);
          continue;
        }
        case "heading": {
          r += this.renderer.heading(c);
          continue;
        }
        case "code": {
          r += this.renderer.code(c);
          continue;
        }
        case "table": {
          r += this.renderer.table(c);
          continue;
        }
        case "blockquote": {
          r += this.renderer.blockquote(c);
          continue;
        }
        case "list": {
          r += this.renderer.list(c);
          continue;
        }
        case "html": {
          r += this.renderer.html(c);
          continue;
        }
        case "paragraph": {
          r += this.renderer.paragraph(c);
          continue;
        }
        case "text": {
          let l = c, h = this.renderer.text(l);
          for (; o + 1 < e.length && e[o + 1].type === "text"; )
            l = e[++o], h += `
` + this.renderer.text(l);
          t ? r += this.renderer.paragraph({
            type: "paragraph",
            raw: h,
            text: h,
            tokens: [{ type: "text", raw: h, text: h, escaped: !0 }]
          }) : r += h;
          continue;
        }
        default: {
          const l = 'Token with "' + c.type + '" type was not found.';
          if (this.options.silent)
            return console.error(l), "";
          throw new Error(l);
        }
      }
    }
    return r;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(e, t = this.renderer) {
    var i, s;
    let r = "";
    for (let o = 0; o < e.length; o++) {
      const a = e[o];
      if ((s = (i = this.options.extensions) == null ? void 0 : i.renderers) != null && s[a.type]) {
        const l = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (l !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(a.type)) {
          r += l || "";
          continue;
        }
      }
      const c = a;
      switch (c.type) {
        case "escape": {
          r += t.text(c);
          break;
        }
        case "html": {
          r += t.html(c);
          break;
        }
        case "link": {
          r += t.link(c);
          break;
        }
        case "image": {
          r += t.image(c);
          break;
        }
        case "strong": {
          r += t.strong(c);
          break;
        }
        case "em": {
          r += t.em(c);
          break;
        }
        case "codespan": {
          r += t.codespan(c);
          break;
        }
        case "br": {
          r += t.br(c);
          break;
        }
        case "del": {
          r += t.del(c);
          break;
        }
        case "text": {
          r += t.text(c);
          break;
        }
        default: {
          const l = 'Token with "' + c.type + '" type was not found.';
          if (this.options.silent)
            return console.error(l), "";
          throw new Error(l);
        }
      }
    }
    return r;
  }
}, we, oe = (we = class {
  constructor(n) {
    b(this, "options");
    b(this, "block");
    this.options = n || M;
  }
  /**
   * Process markdown before marked
   */
  preprocess(n) {
    return n;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(n) {
    return n;
  }
  /**
   * Process all tokens before walk tokens
   */
  processAllTokens(n) {
    return n;
  }
  /**
   * Provide function to tokenize markdown
   */
  provideLexer() {
    return this.block ? _.lex : _.lexInline;
  }
  /**
   * Provide function to parse tokens
   */
  provideParser() {
    return this.block ? A.parse : A.parseInline;
  }
}, b(we, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess",
  "processAllTokens"
])), we), vn = class {
  constructor(...n) {
    b(this, "defaults", Te());
    b(this, "options", this.setOptions);
    b(this, "parse", this.parseMarkdown(!0));
    b(this, "parseInline", this.parseMarkdown(!1));
    b(this, "Parser", A);
    b(this, "Renderer", pe);
    b(this, "TextRenderer", Fe);
    b(this, "Lexer", _);
    b(this, "Tokenizer", he);
    b(this, "Hooks", oe);
    this.use(...n);
  }
  /**
   * Run callback for every token
   */
  walkTokens(n, e) {
    var r, i;
    let t = [];
    for (const s of n)
      switch (t = t.concat(e.call(this, s)), s.type) {
        case "table": {
          const o = s;
          for (const a of o.header)
            t = t.concat(this.walkTokens(a.tokens, e));
          for (const a of o.rows)
            for (const c of a)
              t = t.concat(this.walkTokens(c.tokens, e));
          break;
        }
        case "list": {
          const o = s;
          t = t.concat(this.walkTokens(o.items, e));
          break;
        }
        default: {
          const o = s;
          (i = (r = this.defaults.extensions) == null ? void 0 : r.childTokens) != null && i[o.type] ? this.defaults.extensions.childTokens[o.type].forEach((a) => {
            const c = o[a].flat(1 / 0);
            t = t.concat(this.walkTokens(c, e));
          }) : o.tokens && (t = t.concat(this.walkTokens(o.tokens, e)));
        }
      }
    return t;
  }
  use(...n) {
    const e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return n.forEach((t) => {
      const r = { ...t };
      if (r.async = this.defaults.async || r.async || !1, t.extensions && (t.extensions.forEach((i) => {
        if (!i.name)
          throw new Error("extension name required");
        if ("renderer" in i) {
          const s = e.renderers[i.name];
          s ? e.renderers[i.name] = function(...o) {
            let a = i.renderer.apply(this, o);
            return a === !1 && (a = s.apply(this, o)), a;
          } : e.renderers[i.name] = i.renderer;
        }
        if ("tokenizer" in i) {
          if (!i.level || i.level !== "block" && i.level !== "inline")
            throw new Error("extension level must be 'block' or 'inline'");
          const s = e[i.level];
          s ? s.unshift(i.tokenizer) : e[i.level] = [i.tokenizer], i.start && (i.level === "block" ? e.startBlock ? e.startBlock.push(i.start) : e.startBlock = [i.start] : i.level === "inline" && (e.startInline ? e.startInline.push(i.start) : e.startInline = [i.start]));
        }
        "childTokens" in i && i.childTokens && (e.childTokens[i.name] = i.childTokens);
      }), r.extensions = e), t.renderer) {
        const i = this.defaults.renderer || new pe(this.defaults);
        for (const s in t.renderer) {
          if (!(s in i))
            throw new Error(`renderer '${s}' does not exist`);
          if (["options", "parser"].includes(s))
            continue;
          const o = s, a = t.renderer[o], c = i[o];
          i[o] = (...l) => {
            let h = a.apply(i, l);
            return h === !1 && (h = c.apply(i, l)), h || "";
          };
        }
        r.renderer = i;
      }
      if (t.tokenizer) {
        const i = this.defaults.tokenizer || new he(this.defaults);
        for (const s in t.tokenizer) {
          if (!(s in i))
            throw new Error(`tokenizer '${s}' does not exist`);
          if (["options", "rules", "lexer"].includes(s))
            continue;
          const o = s, a = t.tokenizer[o], c = i[o];
          i[o] = (...l) => {
            let h = a.apply(i, l);
            return h === !1 && (h = c.apply(i, l)), h;
          };
        }
        r.tokenizer = i;
      }
      if (t.hooks) {
        const i = this.defaults.hooks || new oe();
        for (const s in t.hooks) {
          if (!(s in i))
            throw new Error(`hook '${s}' does not exist`);
          if (["options", "block"].includes(s))
            continue;
          const o = s, a = t.hooks[o], c = i[o];
          oe.passThroughHooks.has(s) ? i[o] = (l) => {
            if (this.defaults.async)
              return Promise.resolve(a.call(i, l)).then((u) => c.call(i, u));
            const h = a.call(i, l);
            return c.call(i, h);
          } : i[o] = (...l) => {
            let h = a.apply(i, l);
            return h === !1 && (h = c.apply(i, l)), h;
          };
        }
        r.hooks = i;
      }
      if (t.walkTokens) {
        const i = this.defaults.walkTokens, s = t.walkTokens;
        r.walkTokens = function(o) {
          let a = [];
          return a.push(s.call(this, o)), i && (a = a.concat(i.call(this, o))), a;
        };
      }
      this.defaults = { ...this.defaults, ...r };
    }), this;
  }
  setOptions(n) {
    return this.defaults = { ...this.defaults, ...n }, this;
  }
  lexer(n, e) {
    return _.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return A.parse(n, e ?? this.defaults);
  }
  parseMarkdown(n) {
    return (t, r) => {
      const i = { ...r }, s = { ...this.defaults, ...i }, o = this.onError(!!s.silent, !!s.async);
      if (this.defaults.async === !0 && i.async === !1)
        return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof t > "u" || t === null)
        return o(new Error("marked(): input parameter is undefined or null"));
      if (typeof t != "string")
        return o(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
      s.hooks && (s.hooks.options = s, s.hooks.block = n);
      const a = s.hooks ? s.hooks.provideLexer() : n ? _.lex : _.lexInline, c = s.hooks ? s.hooks.provideParser() : n ? A.parse : A.parseInline;
      if (s.async)
        return Promise.resolve(s.hooks ? s.hooks.preprocess(t) : t).then((l) => a(l, s)).then((l) => s.hooks ? s.hooks.processAllTokens(l) : l).then((l) => s.walkTokens ? Promise.all(this.walkTokens(l, s.walkTokens)).then(() => l) : l).then((l) => c(l, s)).then((l) => s.hooks ? s.hooks.postprocess(l) : l).catch(o);
      try {
        s.hooks && (t = s.hooks.preprocess(t));
        let l = a(t, s);
        s.hooks && (l = s.hooks.processAllTokens(l)), s.walkTokens && this.walkTokens(l, s.walkTokens);
        let h = c(l, s);
        return s.hooks && (h = s.hooks.postprocess(h)), h;
      } catch (l) {
        return o(l);
      }
    };
  }
  onError(n, e) {
    return (t) => {
      if (t.message += `
Please report this to https://github.com/markedjs/marked.`, n) {
        const r = "<p>An error occurred:</p><pre>" + v(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(r) : r;
      }
      if (e)
        return Promise.reject(t);
      throw t;
    };
  }
}, I = new vn();
function g(n, e) {
  return I.parse(n, e);
}
g.options = g.setOptions = function(n) {
  return I.setOptions(n), g.defaults = I.defaults, it(g.defaults), g;
};
g.getDefaults = Te;
g.defaults = M;
g.use = function(...n) {
  return I.use(...n), g.defaults = I.defaults, it(g.defaults), g;
};
g.walkTokens = function(n, e) {
  return I.walkTokens(n, e);
};
g.parseInline = I.parseInline;
g.Parser = A;
g.parser = A.parse;
g.Renderer = pe;
g.TextRenderer = Fe;
g.Lexer = _;
g.lexer = _.lex;
g.Tokenizer = he;
g.Hooks = oe;
g.parse = g;
g.options;
g.setOptions;
g.use;
g.walkTokens;
g.parseInline;
A.parse;
_.lex;
class _n {
  /**
   * Generate a human-readable label from a field name
   * @param fieldName - The field name to convert
   * @returns A formatted label string
   */
  generateSmartLabel(e) {
    if (/^\d/.test(e))
      throw new Error(`Invalid field name '${e}': Field names cannot start with a number`);
    return e.includes("_") ? e.split("_").map((t) => this.capitalizeWord(t)).join(" ") : /[a-z][A-Z]/.test(e) ? e.replace(/([a-z])([A-Z])/g, "$1 $2").split(" ").map((t) => this.capitalizeWord(t)).join(" ") : this.capitalizeWord(e);
  }
  /**
   * Capitalize the first letter of a word
   * @param word - The word to capitalize
   * @returns The capitalized word
   */
  capitalizeWord(e) {
    return e && e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
  }
  generateHTML(e) {
    const t = e.markdown ? g(e.markdown) : "";
    return typeof t == "string" ? this.processFieldPlaceholders(t, e.forms) : this.generateLegacyHTML(e);
  }
  processFieldPlaceholders(e, t) {
    let r = e;
    return t.forEach((i, s) => {
      const o = `<!--FORMDOWN_FIELD_${s}-->`, a = this.generateStandaloneFieldHTML(i);
      r = r.replace(new RegExp(o, "g"), a);
    }), r;
  }
  generateLegacyHTML(e) {
    const t = e.markdown ? g(e.markdown) : "", r = this.generateFormHTML(e.forms);
    return t + r;
  }
  generateStandaloneFieldHTML(e) {
    return `
<form class="formdown-form">
${this.generateFieldHTML(e)}
</form>`;
  }
  generateFormHTML(e) {
    return e.length === 0 ? "" : `
<form class="formdown-form">
${e.map((r) => this.generateFieldHTML(r)).join(`
`)}
</form>`;
  }
  generateFieldHTML(e) {
    const { name: t, type: r, label: i, required: s, placeholder: o, attributes: a, options: c } = e, l = i || this.generateSmartLabel(t), h = {
      id: t,
      name: t,
      ...s && { required: !0 },
      ...o && { placeholder: o },
      ...a
    }, u = Object.entries(h).map(([p, f]) => typeof f == "boolean" ? f ? p : "" : `${p}="${f}"`).filter(Boolean).join(" ");
    switch (r) {
      case "textarea":
        return `
<div class="formdown-field">
    <label for="${t}">${l}${s ? " *" : ""}</label>
    <textarea ${u}></textarea>
</div>`;
      case "select":
        const p = (c == null ? void 0 : c.map((y) => `<option value="${y}">${y}</option>`).join(`
`)) || "";
        return `
<div class="formdown-field">
    <label for="${t}">${l}${s ? " *" : ""}</label>
    <select ${u}>
        ${p}
    </select>
</div>`;
      case "radio":
        if (!c || c.length === 0)
          return `
<div class="formdown-field">
    <label for="${t}">${l}${s ? " *" : ""}</label>
    <input type="text" ${u}>
</div>`;
        const f = c.map((y, T) => {
          const R = `${t}_${T}`;
          return `
        <label for="${R}" class="formdown-option-label">
            <input type="radio" id="${R}" name="${t}" value="${y}" ${s && T === 0 ? "required" : ""}>
            <span>${y}</span>
        </label>`;
        }).join(`
`), x = (a == null ? void 0 : a.layout) === "vertical" ? "radio-group vertical" : "radio-group inline";
        return `
<div class="formdown-field">
    <fieldset>
        <legend>${l}${s ? " *" : ""}</legend>
        <div class="${x}">
${f}
        </div>
    </fieldset>
</div>`;
      case "checkbox":
        if (!c || c.length === 0)
          return `
<div class="formdown-field">
    <label for="${t}" class="formdown-checkbox-label">
        <input type="checkbox" id="${t}" name="${t}" value="true" ${s ? "required" : ""} ${u}>
        <span>${l}${s ? " *" : ""}</span>
    </label>
</div>`;
        {
          const y = c.map((U, D) => {
            const ne = `${t}_${D}`;
            return `
        <label for="${ne}" class="formdown-option-label">
            <input type="checkbox" id="${ne}" name="${t}" value="${U}" ${s && D === 0 ? "required" : ""}>
            <span>${U}</span>
        </label>`;
          }).join(`
`), R = (a == null ? void 0 : a.layout) === "vertical" ? "checkbox-group vertical" : "checkbox-group inline";
          return `
<div class="formdown-field">
    <fieldset>
        <legend>${l}${s ? " *" : ""}</legend>
        <div class="${R}">
${y}
        </div>
    </fieldset>
</div>`;
        }
      default:
        return `
<div class="formdown-field">
    <label for="${t}">${l}${s ? " *" : ""}</label>
    <input type="${r}" ${u}>
</div>`;
    }
  }
}
var An = Object.defineProperty, Sn = Object.getOwnPropertyDescriptor, F = (n, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? Sn(e, t) : e, s = n.length - 1, o; s >= 0; s--)
    (o = n[s]) && (i = (r ? o(e, t, i) : o(i)) || i);
  return r && i && An(e, t, i), i;
};
let $ = class extends Q {
  // Prevent infinite loops
  constructor() {
    super(), this.content = "", this.selectOnFocus = !0, this.formId = "", this.showSubmitButton = !0, this.submitText = "Submit", this._data = {}, this.parser = new Ot(), this.generator = new _n(), this.fieldRegistry = /* @__PURE__ */ new Map(), this._isUpdatingUI = !1, this._uniqueFormId = this.formId || `formdown-${Math.random().toString(36).substring(2, 15)}`;
  }
  // Get the form ID (user-provided or auto-generated)
  getFormId() {
    return this.formId || this._uniqueFormId;
  }
  // Process HTML to replace form wrapper with hidden form and add form attributes
  processFormHTML(n, e) {
    const t = `<form id="${e}" class="formdown-form" style="display: none;"></form>`;
    let r = n.replace(/<form[^>]*class="formdown-form"[^>]*>/g, "").replace(/<\/form>/g, "");
    return r = r.replace(
      /<(input|textarea|select)([^>]*?)>/g,
      (i, s, o) => o.includes("form=") ? i : `<${s}${o} form="${e}">`
    ), t + r;
  }
  get data() {
    return this._data;
  }
  set data(n) {
    const e = this._data;
    this._data = { ...n }, this.requestUpdate("data", e);
  }
  // Public method to update data programmatically
  updateData(n) {
    this.data = n;
  }
  // Public method to update single field
  updateField(n, e) {
    this.data = { ...this.data, [n]: e };
  }
  connectedCallback() {
    var n;
    super.connectedCallback(), !this.content && ((n = this.textContent) != null && n.trim()) && (this.content = this.textContent.trim(), this.textContent = "");
  }
  render() {
    if (!this.content || !this.content.trim())
      return re`<div class="error">No Formdown content provided</div>`;
    try {
      const n = this.parser.parseFormdown(this.content), e = this.generator.generateHTML(n);
      return !e || !e.trim() ? re`<div class="error">Generated HTML is empty</div>` : re`<div id="content-container"></div>`;
    } catch (n) {
      const e = n instanceof Error ? n.message : String(n);
      return re`<div class="error">Error rendering content: ${e}</div>`;
    }
  }
  // Override firstUpdated to set innerHTML after the initial render
  firstUpdated() {
    this.updateContent(), Object.keys(this.data).length > 0 && this.syncUIFromData();
  }
  // Override updated to update content when properties change
  updated(n) {
    super.updated(n), n.has("content") && this.updateContent(), n.has("data") && this.syncUIFromData();
  }
  updateContent() {
    var n, e;
    if (!(!this.content || !this.content.trim()))
      try {
        const t = (n = this.shadowRoot) == null ? void 0 : n.querySelector("#content-container");
        if (!t)
          return;
        const r = this.parser.parseFormdown(this.content);
        let i = this.generator.generateHTML(r);
        if (!i || i.trim() === "") {
          t.innerHTML = '<div class="error">Generator returned empty HTML</div>';
          return;
        }
        const s = this.getFormId();
        i = this.processFormHTML(i, s), t.innerHTML = i, this.setupFieldHandlers(t);
      } catch (t) {
        const r = (e = this.shadowRoot) == null ? void 0 : e.querySelector("#content-container");
        if (r) {
          const i = t instanceof Error ? t.message : String(t);
          r.innerHTML = `<div class="error">Error: ${i}</div>`;
        }
      }
  }
  setupFieldHandlers(n) {
    this.fieldRegistry.clear();
    const e = n.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), [contenteditable="true"]');
    this.setupKeyboardNavigation(e), n.querySelectorAll('input, textarea, select, [contenteditable="true"]').forEach((r) => {
      const i = r, s = this.getFieldName(i);
      if (s) {
        this.registerField(s, i);
        const o = this.data[s];
        o !== void 0 && this.setElementValue(i, o), this.setupFieldEventHandlers(i, s), this.setupFieldSpecificBehaviors(i);
      }
    });
  }
  setupKeyboardNavigation(n) {
    n.forEach((e, t) => {
      e.addEventListener("keydown", (r) => {
        const i = r;
        if (i.key === "Enter") {
          if (i.preventDefault(), e.tagName.toLowerCase() === "textarea")
            return;
          const s = t + 1;
          s < n.length && n[s].focus();
        }
      });
    });
  }
  setupFieldEventHandlers(n, e) {
    const t = () => {
      var i;
      if (n instanceof HTMLInputElement && n.type === "checkbox") {
        const s = (i = this.shadowRoot) == null ? void 0 : i.querySelectorAll(`input[type="checkbox"][name="${e}"]`);
        if (s.length === 1 && s[0].value === "true") {
          this.updateDataReactively(e, n.checked, n);
          return;
        } else {
          const a = [];
          s.forEach((c) => {
            c.checked && a.push(c.value);
          }), this.updateDataReactively(e, a, n);
          return;
        }
      }
      const r = this.getFieldValue(n);
      this.updateDataReactively(e, r, n);
    };
    n.hasAttribute("contenteditable") ? n.addEventListener("input", t) : (n.addEventListener("input", t), n.addEventListener("change", t));
  }
  setupFieldSpecificBehaviors(n) {
    n.hasAttribute("contenteditable") && this.setupContentEditableBehaviors(n);
  }
  setupContentEditableBehaviors(n) {
    var r;
    const e = n.dataset.placeholder;
    ((r = n.textContent) == null ? void 0 : r.trim()) === e && (n.textContent = ""), n.addEventListener("focus", () => {
      var i;
      if (((i = n.textContent) == null ? void 0 : i.trim()) === e && (n.textContent = ""), this.selectOnFocus) {
        const s = window.getSelection(), o = document.createRange();
        o.selectNodeContents(n), s == null || s.removeAllRanges(), s == null || s.addRange(o);
      }
    }), n.addEventListener("blur", () => {
      var i;
      (i = n.textContent) != null && i.trim() || (n.textContent = e || "");
    }), n.dataset.fieldType === "email" && n.addEventListener("input", () => {
      var s;
      const i = ((s = n.textContent) == null ? void 0 : s.trim()) || "";
      i && !i.includes("@") ? n.style.color = "#dc2626" : n.style.color = "#1e40af";
    });
  }
  // Reactive data management - data is the single source of truth
  updateDataReactively(n, e, t) {
    this._isUpdatingUI || (this.data = { ...this.data, [n]: e }, this.syncUIFromData(n, t), this.emitFieldEvents(n, e));
  }
  syncUIFromData(n, e) {
    this._isUpdatingUI = !0;
    try {
      (n ? [n] : Object.keys(this.data)).forEach((r) => {
        const i = this.data[r], s = this.fieldRegistry.get(r);
        s && s.forEach((o) => {
          o !== e && this.setElementValue(o, i);
        });
      });
    } finally {
      this._isUpdatingUI = !1;
    }
  }
  // Universal element value setter
  setElementValue(n, e) {
    if (n.hasAttribute("contenteditable")) {
      const t = Array.isArray(e) ? e.join(", ") : String(e);
      n.textContent !== t && (n.textContent = t);
    } else if (n instanceof HTMLInputElement)
      if (n.type === "checkbox")
        Array.isArray(e) ? n.checked = e.includes(n.value) : typeof e == "boolean" ? n.checked = e : n.checked = !!e && (e === "true" || e === n.value);
      else if (n.type === "radio")
        n.checked = n.value === String(e);
      else {
        const t = Array.isArray(e) ? e.join(", ") : String(e);
        n.value !== t && (n.value = t);
      }
    else if (n instanceof HTMLSelectElement) {
      const t = Array.isArray(e) ? e.join(", ") : String(e);
      n.value !== t && (n.value = t);
    } else if (n instanceof HTMLTextAreaElement) {
      const t = Array.isArray(e) ? e.join(", ") : String(e);
      n.value !== t && (n.value = t);
    }
  }
  // Universal field name extractor
  getFieldName(n) {
    return n instanceof HTMLInputElement || n instanceof HTMLTextAreaElement || n instanceof HTMLSelectElement ? n.name || n.id || null : n.dataset.fieldName || n.id || null;
  }
  // Universal field value extractor
  getFieldValue(n) {
    var e;
    return n.hasAttribute("contenteditable") ? ((e = n.textContent) == null ? void 0 : e.trim()) || "" : (n instanceof HTMLInputElement || n instanceof HTMLTextAreaElement || n instanceof HTMLSelectElement) && n.value || "";
  }
  // Register field in the universal registry
  registerField(n, e) {
    this.fieldRegistry.has(n) || this.fieldRegistry.set(n, /* @__PURE__ */ new Set()), this.fieldRegistry.get(n).add(e);
  }
  // Emit standardized events
  emitFieldEvents(n, e) {
    const t = this.getFormData();
    this.dispatchEvent(new CustomEvent("formdown-change", {
      detail: { fieldName: n, value: e, formData: t },
      bubbles: !0
    })), this.dispatchEvent(new CustomEvent("formdown-data-update", {
      detail: { formData: t },
      bubbles: !0
    }));
  }
  // Universal field synchronization method - expected by tests
  syncFieldValue(n, e) {
    this.data = { ...this.data, [n]: e }, this.emitFieldEvents(n, e);
  }
  // Update form data method - expected by tests
  updateFormData(n, e) {
    this.data = { ...this.data, [n]: e }, this.emitFieldEvents(n, e);
  }
  // Get form data programmatically - use reactive data as source of truth
  getFormData() {
    return { ...this.data };
  }
  // Validation methods
  validate() {
    var r;
    const n = [], e = (r = this.shadowRoot) == null ? void 0 : r.querySelector("#content-container");
    return e ? (this.clearValidationStates(), e.querySelectorAll('input, textarea, select, [contenteditable="true"]').forEach((i) => {
      const s = i, o = this.getFieldName(s);
      if (o) {
        const a = this.validateField(s, o);
        n.push(...a);
      }
    }), this.applyValidationFeedback(n), {
      isValid: n.length === 0,
      errors: n
    }) : { isValid: !1, errors: [{ field: "general", message: "Form container not found" }] };
  }
  validateField(n, e) {
    var r, i;
    const t = [];
    if (this.isFieldRequired(n)) {
      const s = this.getFieldValue(n);
      if (n instanceof HTMLInputElement)
        if (n.type === "checkbox") {
          const o = (r = this.shadowRoot) == null ? void 0 : r.querySelectorAll(`input[type="checkbox"][name="${e}"]`);
          Array.from(o).some((c) => c.checked) || t.push({ field: e, message: "This field is required" });
        } else if (n.type === "radio") {
          const o = (i = this.shadowRoot) == null ? void 0 : i.querySelectorAll(`input[type="radio"][name="${e}"]`);
          Array.from(o).some((c) => c.checked) || t.push({ field: e, message: "Please select an option" });
        } else (!s || s.trim() === "") && t.push({ field: e, message: "This field is required" });
      else (!s || s.trim() === "") && t.push({ field: e, message: "This field is required" });
    }
    if (n instanceof HTMLInputElement) {
      const s = n.value.trim();
      if (s && n.type === "email" && (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) || t.push({ field: e, message: "Please enter a valid email address" })), s && n.type === "url")
        try {
          new URL(s);
        } catch {
          t.push({ field: e, message: "Please enter a valid URL" });
        }
      s && n.type === "tel" && (/^[\d\s\-\+\(\)]+$/.test(s) || t.push({ field: e, message: "Please enter a valid phone number" })), n.minLength && n.minLength > 0 && s.length < n.minLength && t.push({ field: e, message: `Minimum length is ${n.minLength} characters` }), n.maxLength && n.maxLength > 0 && s.length > n.maxLength && t.push({ field: e, message: `Maximum length is ${n.maxLength} characters` }), n.pattern && s && (new RegExp(n.pattern).test(s) || t.push({ field: e, message: n.title || "Please match the required format" }));
    }
    return t;
  }
  isFieldRequired(n) {
    return n instanceof HTMLInputElement || n instanceof HTMLTextAreaElement || n instanceof HTMLSelectElement ? n.required : n.dataset.required === "true";
  }
  clearValidationStates() {
    var e;
    const n = (e = this.shadowRoot) == null ? void 0 : e.querySelector("#content-container");
    n && (n.querySelectorAll(".field-error, .field-valid").forEach((t) => {
      t.classList.remove("field-error", "field-valid");
    }), n.querySelectorAll(".validation-error-message").forEach((t) => {
      t.remove();
    }));
  }
  applyValidationFeedback(n) {
    var i;
    const e = (i = this.shadowRoot) == null ? void 0 : i.querySelector("#content-container");
    if (!e) return;
    const t = /* @__PURE__ */ new Map();
    n.forEach((s) => {
      t.has(s.field) || t.set(s.field, []), t.get(s.field).push(s);
    }), e.querySelectorAll('input, textarea, select, [contenteditable="true"]').forEach((s) => {
      const o = s, a = this.getFieldName(o);
      if (a) {
        const c = t.get(a);
        c && c.length > 0 ? (o.classList.add("field-error"), o.classList.remove("field-valid"), this.addErrorMessage(o, c[0].message)) : o.classList.remove("field-error", "field-valid");
      }
    });
  }
  addErrorMessage(n, e) {
    let t = n.parentElement;
    if (n instanceof HTMLInputElement && (n.type === "radio" || n.type === "checkbox"))
      for (; t && !t.classList.contains("radio-group") && !t.classList.contains("checkbox-group") && t.tagName !== "FIELDSET"; )
        t = t.parentElement;
    if (t) {
      const r = t.querySelector(".validation-error-message");
      r && r.remove();
      const i = document.createElement("span");
      i.className = "validation-error-message", i.textContent = e, t.appendChild(i);
    }
  }
  // Reset form method
  resetForm() {
    var t;
    const n = this.getFormId(), e = (t = this.shadowRoot) == null ? void 0 : t.querySelector(`#${n}`);
    e && e.reset(), this.data = {}, this.clearValidationStates();
  }
};
$.styles = kt`
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
F([
  O()
], $.prototype, "content", 2);
F([
  O({ type: Boolean, attribute: "select-on-focus" })
], $.prototype, "selectOnFocus", 2);
F([
  O({ attribute: "form-id" })
], $.prototype, "formId", 2);
F([
  O({ type: Boolean, attribute: "show-submit-button" })
], $.prototype, "showSubmitButton", 2);
F([
  O({ attribute: "submit-text" })
], $.prototype, "submitText", 2);
F([
  O({ type: Object })
], $.prototype, "data", 1);
$ = F([
  Ht("formdown-ui")
], $);
const Ln = (n, e = {}) => {
  const t = document.createElement("formdown-ui");
  return e.content && (t.content = e.content), e.formId && (t.formId = e.formId), e.showSubmitButton !== void 0 && (t.showSubmitButton = e.showSubmitButton), e.submitText && (t.submitText = e.submitText), n.appendChild(t), t;
};
customElements.get("formdown-ui") || customElements.define("formdown-ui", $);
typeof window < "u" && (window.FormdownUI = $);
export {
  $ as FormdownUI,
  Ln as createFormdownUI
};
