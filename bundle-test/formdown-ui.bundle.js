var _t = Object.defineProperty;
var At = (n, e, t) => e in n ? _t(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var x = (n, e, t) => At(n, typeof e != "symbol" ? e + "" : e, t);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const le = globalThis, Te = le.ShadowRoot && (le.ShadyCSS === void 0 || le.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Re = Symbol(), Ve = /* @__PURE__ */ new WeakMap();
let ot = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== Re) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Te && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = Ve.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && Ve.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const St = (n) => new ot(typeof n == "string" ? n : n + "", void 0, Re), Et = (n, ...e) => {
  const t = n.length === 1 ? n[0] : e.reduce((r, i, s) => r + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + n[s + 1], n[0]);
  return new ot(t, n, Re);
}, Tt = (n, e) => {
  if (Te) n.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), i = le.litNonce;
    i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
  }
}, Ne = Te ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return St(t);
})(n) : n;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Rt, defineProperty: Lt, getOwnPropertyDescriptor: Ct, getOwnPropertyNames: Mt, getOwnPropertySymbols: zt, getPrototypeOf: Ft } = Object, R = globalThis, Ze = R.trustedTypes, It = Ze ? Ze.emptyScript : "", $e = R.reactiveElementPolyfillSupport, Q = (n, e) => n, he = { toAttribute(n, e) {
  switch (e) {
    case Boolean:
      n = n ? It : null;
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
} }, Le = (n, e) => !Rt(n, e), We = { attribute: !0, type: String, converter: he, reflect: !1, useDefault: !1, hasChanged: Le };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), R.litPropertyMetadata ?? (R.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let D = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = We) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = Symbol(), i = this.getPropertyDescriptor(e, r, t);
      i !== void 0 && Lt(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: i, set: s } = Ct(this.prototype, e) ?? { get() {
      return this[t];
    }, set(a) {
      this[t] = a;
    } };
    return { get: i, set(a) {
      const o = i == null ? void 0 : i.call(this);
      s == null || s.call(this, a), this.requestUpdate(e, o, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? We;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Q("elementProperties"))) return;
    const e = Ft(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Q("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Q("properties"))) {
      const t = this.properties, r = [...Mt(t), ...zt(t)];
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
      for (const i of r) t.unshift(Ne(i));
    } else e !== void 0 && t.push(Ne(e));
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
    return Tt(e, this.constructor.elementStyles), e;
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
      const a = (((s = r.converter) == null ? void 0 : s.toAttribute) !== void 0 ? r.converter : he).toAttribute(t, r.type);
      this._$Em = e, a == null ? this.removeAttribute(i) : this.setAttribute(i, a), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var s, a;
    const r = this.constructor, i = r._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const o = r.getPropertyOptions(i), c = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((s = o.converter) == null ? void 0 : s.fromAttribute) !== void 0 ? o.converter : he;
      this._$Em = i, this[i] = c.fromAttribute(t, o.type) ?? ((a = this._$Ej) == null ? void 0 : a.get(i)) ?? null, this._$Em = null;
    }
  }
  requestUpdate(e, t, r) {
    var i;
    if (e !== void 0) {
      const s = this.constructor, a = this[e];
      if (r ?? (r = s.getPropertyOptions(e)), !((r.hasChanged ?? Le)(a, t) || r.useDefault && r.reflect && a === ((i = this._$Ej) == null ? void 0 : i.get(e)) && !this.hasAttribute(s._$Eu(e, r)))) return;
      this.C(e, t, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: r, reflect: i, wrapped: s }, a) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), s !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [s, a] of this._$Ep) this[s] = a;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [s, a] of i) {
        const { wrapped: o } = a, c = this[s];
        o !== !0 || this._$AL.has(s) || c === void 0 || this.C(s, void 0, a, c);
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
D.elementStyles = [], D.shadowRootOptions = { mode: "open" }, D[Q("elementProperties")] = /* @__PURE__ */ new Map(), D[Q("finalized")] = /* @__PURE__ */ new Map(), $e == null || $e({ ReactiveElement: D }), (R.reactiveElementVersions ?? (R.reactiveElementVersions = [])).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const K = globalThis, ue = K.trustedTypes, Ge = ue ? ue.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, at = "$lit$", T = `lit$${Math.random().toFixed(9).slice(2)}$`, lt = "?" + T, Pt = `<${lt}>`, q = document, Y = () => q.createComment(""), ee = (n) => n === null || typeof n != "object" && typeof n != "function", Ce = Array.isArray, Ht = (n) => Ce(n) || typeof (n == null ? void 0 : n[Symbol.iterator]) == "function", we = `[ 	
\f\r]`, Z = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Qe = /-->/g, Ke = />/g, I = RegExp(`>|${we}(?:([^\\s"'>=/]+)(${we}*=${we}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Xe = /'/g, Je = /"/g, ct = /^(?:script|style|textarea|title)$/i, qt = (n) => (e, ...t) => ({ _$litType$: n, strings: e, values: t }), oe = qt(1), j = Symbol.for("lit-noChange"), k = Symbol.for("lit-nothing"), Ye = /* @__PURE__ */ new WeakMap(), P = q.createTreeWalker(q, 129);
function ht(n, e) {
  if (!Ce(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ge !== void 0 ? Ge.createHTML(e) : e;
}
const Ot = (n, e) => {
  const t = n.length - 1, r = [];
  let i, s = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = Z;
  for (let o = 0; o < t; o++) {
    const c = n[o];
    let l, h, d = -1, u = 0;
    for (; u < c.length && (a.lastIndex = u, h = a.exec(c), h !== null); ) u = a.lastIndex, a === Z ? h[1] === "!--" ? a = Qe : h[1] !== void 0 ? a = Ke : h[2] !== void 0 ? (ct.test(h[2]) && (i = RegExp("</" + h[2], "g")), a = I) : h[3] !== void 0 && (a = I) : a === I ? h[0] === ">" ? (a = i ?? Z, d = -1) : h[1] === void 0 ? d = -2 : (d = a.lastIndex - h[2].length, l = h[1], a = h[3] === void 0 ? I : h[3] === '"' ? Je : Xe) : a === Je || a === Xe ? a = I : a === Qe || a === Ke ? a = Z : (a = I, i = void 0);
    const f = a === I && n[o + 1].startsWith("/>") ? " " : "";
    s += a === Z ? c + Pt : d >= 0 ? (r.push(l), c.slice(0, d) + at + c.slice(d) + T + f) : c + T + (d === -2 ? o : f);
  }
  return [ht(n, s + (n[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class te {
  constructor({ strings: e, _$litType$: t }, r) {
    let i;
    this.parts = [];
    let s = 0, a = 0;
    const o = e.length - 1, c = this.parts, [l, h] = Ot(e, t);
    if (this.el = te.createElement(l, r), P.currentNode = this.el.content, t === 2 || t === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = P.nextNode()) !== null && c.length < o; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith(at)) {
          const u = h[a++], f = i.getAttribute(d).split(T), p = /([.?@])?(.*)/.exec(u);
          c.push({ type: 1, index: s, name: p[2], strings: f, ctor: p[1] === "." ? Ut : p[1] === "?" ? Dt : p[1] === "@" ? jt : ge }), i.removeAttribute(d);
        } else d.startsWith(T) && (c.push({ type: 6, index: s }), i.removeAttribute(d));
        if (ct.test(i.tagName)) {
          const d = i.textContent.split(T), u = d.length - 1;
          if (u > 0) {
            i.textContent = ue ? ue.emptyScript : "";
            for (let f = 0; f < u; f++) i.append(d[f], Y()), P.nextNode(), c.push({ type: 2, index: ++s });
            i.append(d[u], Y());
          }
        }
      } else if (i.nodeType === 8) if (i.data === lt) c.push({ type: 2, index: s });
      else {
        let d = -1;
        for (; (d = i.data.indexOf(T, d + 1)) !== -1; ) c.push({ type: 7, index: s }), d += T.length - 1;
      }
      s++;
    }
  }
  static createElement(e, t) {
    const r = q.createElement("template");
    return r.innerHTML = e, r;
  }
}
function V(n, e, t = n, r) {
  var a, o;
  if (e === j) return e;
  let i = r !== void 0 ? (a = t._$Co) == null ? void 0 : a[r] : t._$Cl;
  const s = ee(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== s && ((o = i == null ? void 0 : i._$AO) == null || o.call(i, !1), s === void 0 ? i = void 0 : (i = new s(n), i._$AT(n, t, r)), r !== void 0 ? (t._$Co ?? (t._$Co = []))[r] = i : t._$Cl = i), i !== void 0 && (e = V(n, i._$AS(n, e.values), i, r)), e;
}
class Bt {
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
    const { el: { content: t }, parts: r } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? q).importNode(t, !0);
    P.currentNode = i;
    let s = P.nextNode(), a = 0, o = 0, c = r[0];
    for (; c !== void 0; ) {
      if (a === c.index) {
        let l;
        c.type === 2 ? l = new ne(s, s.nextSibling, this, e) : c.type === 1 ? l = new c.ctor(s, c.name, c.strings, this, e) : c.type === 6 && (l = new Vt(s, this, e)), this._$AV.push(l), c = r[++o];
      }
      a !== (c == null ? void 0 : c.index) && (s = P.nextNode(), a++);
    }
    return P.currentNode = q, i;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class ne {
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
    e = V(this, e, t), ee(e) ? e === k || e == null || e === "" ? (this._$AH !== k && this._$AR(), this._$AH = k) : e !== this._$AH && e !== j && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ht(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== k && ee(this._$AH) ? this._$AA.nextSibling.data = e : this.T(q.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var s;
    const { values: t, _$litType$: r } = e, i = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = te.createElement(ht(r.h, r.h[0]), this.options)), r);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === i) this._$AH.p(t);
    else {
      const a = new Bt(i, this), o = a.u(this.options);
      a.p(t), this.T(o), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = Ye.get(e.strings);
    return t === void 0 && Ye.set(e.strings, t = new te(e)), t;
  }
  k(e) {
    Ce(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, i = 0;
    for (const s of e) i === t.length ? t.push(r = new ne(this.O(Y()), this.O(Y()), this, this.options)) : r = t[i], r._$AI(s), i++;
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
class ge {
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
    let a = !1;
    if (s === void 0) e = V(this, e, t, 0), a = !ee(e) || e !== this._$AH && e !== j, a && (this._$AH = e);
    else {
      const o = e;
      let c, l;
      for (e = s[0], c = 0; c < s.length - 1; c++) l = V(this, o[r + c], t, c), l === j && (l = this._$AH[c]), a || (a = !ee(l) || l !== this._$AH[c]), l === k ? e = k : e !== k && (e += (l ?? "") + s[c + 1]), this._$AH[c] = l;
    }
    a && !i && this.j(e);
  }
  j(e) {
    e === k ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ut extends ge {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === k ? void 0 : e;
  }
}
class Dt extends ge {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== k);
  }
}
class jt extends ge {
  constructor(e, t, r, i, s) {
    super(e, t, r, i, s), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = V(this, e, t, 0) ?? k) === j) return;
    const r = this._$AH, i = e === k && r !== k || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, s = e !== k && (r === k || i);
    i && this.element.removeEventListener(this.name, this, r), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Vt {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    V(this, e);
  }
}
const ye = K.litHtmlPolyfillSupport;
ye == null || ye(te, ne), (K.litHtmlVersions ?? (K.litHtmlVersions = [])).push("3.3.0");
const Nt = (n, e, t) => {
  const r = (t == null ? void 0 : t.renderBefore) ?? e;
  let i = r._$litPart$;
  if (i === void 0) {
    const s = (t == null ? void 0 : t.renderBefore) ?? null;
    r._$litPart$ = i = new ne(e.insertBefore(Y(), s), s, void 0, t ?? {});
  }
  return i._$AI(n), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis;
class X extends D {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Nt(t, this.renderRoot, this.renderOptions);
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
    return j;
  }
}
var st;
X._$litElement$ = !0, X.finalized = !0, (st = H.litElementHydrateSupport) == null || st.call(H, { LitElement: X });
const ve = H.litElementPolyfillSupport;
ve == null || ve({ LitElement: X });
(H.litElementVersions ?? (H.litElementVersions = [])).push("4.2.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Zt = (n) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(n, e);
  }) : customElements.define(n, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Wt = { attribute: !0, type: String, converter: he, reflect: !1, hasChanged: Le }, Gt = (n = Wt, e, t) => {
  const { kind: r, metadata: i } = t;
  let s = globalThis.litPropertyMetadata.get(i);
  if (s === void 0 && globalThis.litPropertyMetadata.set(i, s = /* @__PURE__ */ new Map()), r === "setter" && ((n = Object.create(n)).wrapped = !0), s.set(t.name, n), r === "accessor") {
    const { name: a } = t;
    return { set(o) {
      const c = e.get.call(this);
      e.set.call(this, o), this.requestUpdate(a, c, n);
    }, init(o) {
      return o !== void 0 && this.C(a, void 0, n, o), o;
    } };
  }
  if (r === "setter") {
    const { name: a } = t;
    return function(o) {
      const c = this[a];
      e.call(this, o), this.requestUpdate(a, c, n);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function N(n) {
  return (e, t) => typeof t == "object" ? Gt(n, e, t) : ((r, i, s) => {
    const a = i.hasOwnProperty(s);
    return i.constructor.createProperty(s, r), a ? Object.getOwnPropertyDescriptor(i, s) : void 0;
  })(n, e, t);
}
class Qt {
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
      const a = r[s], o = this.parseBlockField(a);
      if (o) {
        t.push(o), i.push(`<!--FORMDOWN_FIELD_${t.length - 1}-->`);
        continue;
      }
      const { cleanedLine: c, inlineFields: l } = this.parseInlineFields(a);
      t.push(...l), i.push(c);
    }
    return {
      fields: t,
      cleanedMarkdown: i.join(`
`)
    };
  }
  parseBlockField(e) {
    const t = e.trim();
    if (/^@\w+\*/.test(t) || // Required marker
    /^@\w+\{.*?\}/.test(t) || // Content
    /^@\w+\s*:\s*(dt|d|[#@%&t?TrscRFCMW])\d*\[/.test(t) || // Type marker 
    /^@\w+\([^)]+\)\*/.test(t) || // Label + required
    /^@\w+\([^)]+\)\{.*?\}/.test(t) || // Label + content
    /^@\w+\([^)]+\)\s*:\s*(dt|d|[#@%&t?TrscRFCMW])\d*\[/.test(t)) {
      const l = this.parseShorthandBlockField(t);
      if (l)
        return l;
    }
    const i = t.match(/^@(\w+)(?:\(([^)]+)\))?\s*:\s*\[([^\]]*)\].*$/);
    if (!i)
      return null;
    const [, s, a, o] = i;
    return this.createField(s, a, o);
  }
  parseShorthandBlockField(e) {
    let t = e.match(/^@(\w+)(\*)?(?:\{(.*?)\})?(?:\(([^)]+)\))?\s*:\s*(dt|d|[#@%&t?TrscRFCMW])?(\d*)\[([^\]]*)\].*$/);
    if (!t && (t = e.match(/^@(\w+)(?:\(([^)]+)\))?(\*)?(?:\{(.*?)\})?\s*:\s*(dt|d|[#@%&t?TrscRFCMW])?(\d*)\[([^\]]*)\].*$/), t)) {
      const [, d, u, f, p, g, L, C] = t;
      t = [t[0], d, f, p, u, g, L, C];
    }
    if (!t)
      return null;
    const [, r, i, s, a, o, c, l] = t;
    return !i && !s && !a && !o && !c ? null : this.convertShorthandToField(r, i, s, a, o || "", c, l);
  }
  parseInlineFields(e) {
    const t = [], r = this.options.inlineFieldDelimiter, i = new RegExp(`(dt|d|[#@%&t?TrscRFCMW]?)${r}@(\\w+)(\\*)?(?:\\{(.*?)\\})?(?:\\(([^)]+)\\))?(?:\\[([^\\]]*)\\])?`, "g");
    let s = e.replace(i, (o, c, l, h, d, u, f) => {
      if (!c && !h && !d)
        return o;
      const p = this.convertShorthandToField(l, h, d, u, c, "", f || "");
      if (p) {
        p.inline = !0, t.push(p);
        const g = p.required ? ' data-required="true"' : "";
        return `<span contenteditable="true" data-field-name="${l}" data-field-type="${p.type}" data-placeholder="${p.label || l}" class="formdown-inline-field" role="textbox"${g}>${p.label || l}</span>`;
      }
      return o;
    });
    const a = new RegExp(`${r}@(\\w+)(?:\\(([^)]+)\\))?(?:\\[([^\\]]*)\\])?`, "g");
    return s = s.replace(a, (o, c, l, h) => {
      if (t.some((f) => f.name === c))
        return o;
      const d = h !== void 0 ? h : "text", u = this.createField(c, l, d);
      if (u) {
        u.inline = !0, t.push(u);
        const f = u.required ? ' data-required="true"' : "";
        return `<span contenteditable="true" data-field-name="${c}" data-field-type="${u.type}" data-placeholder="${u.label || c}" class="formdown-inline-field" role="textbox"${f}>${u.label || c}</span>`;
      }
      return o;
    }), { cleanedLine: s, inlineFields: t };
  }
  convertShorthandToField(e, t, r, i, s, a, o) {
    const l = {
      "@": "email",
      "#": "number",
      "%": "tel",
      "&": "url",
      d: "date",
      t: "time",
      dt: "datetime-local",
      "?": "password",
      T: "textarea",
      r: "radio",
      s: "select",
      c: "checkbox",
      R: "range",
      F: "file",
      C: "color",
      M: "month",
      W: "week"
    }[s] || "text";
    let h = o ? this.parseAttributes(o) : {};
    if (t === "*" && (h.required = !0), l === "textarea" && a && (h.rows = parseInt(a, 10)), r) {
      const u = this.interpretContent(r, s);
      h = { ...h, ...u };
    }
    const d = this.buildTypeAndAttributesString(l, h);
    return this.createField(e, i, d);
  }
  interpretContent(e, t) {
    if (["r", "s", "c"].includes(t)) {
      const i = e.includes(",*"), a = { options: e.replace(",*", "") };
      return i && (a["allow-other"] = !0), a;
    }
    if (["d", "t", "dt"].includes(t))
      return { format: e };
    let r = e;
    return (e.includes("#") || e.includes("*") && !e.match(/^\^.*\$$/)) && (r = "^" + e.replace(/[().\/]/g, "\\$&").replace(/-/g, "\\-").replace(/#{1,}/g, (i) => `\\d{${i.length}}`).replace(/\*/g, ".*").replace(/\?/g, ".") + "$"), { pattern: r };
  }
  parseAttributes(e) {
    const t = {}, r = /([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/g, i = Array.from(e.matchAll(r));
    for (const s of i) {
      const [, a, o, c, l] = s;
      if (a === "required")
        t.required = !0;
      else if (o !== void 0 || c !== void 0 || l !== void 0) {
        const h = o || c || l;
        t[a] = this.parseAttributeValue(h);
      } else
        t[a] = !0;
    }
    return t;
  }
  buildTypeAndAttributesString(e, t) {
    const r = [e];
    for (const [i, s] of Object.entries(t))
      s === !0 ? r.push(i) : typeof s == "string" ? r.push(`${i}="${s}"`) : r.push(`${i}=${s}`);
    return r.join(" ");
  }
  createField(e, t, r) {
    if (/^\d/.test(e) || !e.trim())
      return null;
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
    const a = s[0][1];
    if (!a)
      return null;
    const o = {
      name: e,
      type: a,
      label: t || this.formatLabel(e),
      attributes: {}
    };
    for (let c = 1; c < s.length; c++) {
      const [, l, h, d, u] = s[c];
      if (l === "required")
        o.required = !0;
      else if (l === "label" && (h !== void 0 || d !== void 0 || u !== void 0))
        o.label = h || d || u;
      else if (l === "placeholder" && (h !== void 0 || d !== void 0 || u !== void 0))
        o.placeholder = h || d || u;
      else if (l === "options" && (h !== void 0 || d !== void 0 || u !== void 0)) {
        const f = h || d || u;
        ["radio", "checkbox", "select"].includes(a) && (o.options = f.split(",").map((p) => p.trim()).filter((p) => p.length > 0));
      } else if (l === "allow-other")
        o.allowOther = !0;
      else if (l === "format" && (h !== void 0 || d !== void 0 || u !== void 0))
        o.format = h || d || u;
      else if (l === "pattern" && (h !== void 0 || d !== void 0 || u !== void 0))
        o.pattern = h || d || u;
      else if (h !== void 0 || d !== void 0 || u !== void 0) {
        const f = h || d || u;
        o.attributes[l] = this.parseAttributeValue(f);
      } else
        o.attributes[l] = !0;
    }
    return o;
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
function Me() {
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
var B = Me();
function ut(n) {
  B = n;
}
var J = { exec: () => null };
function b(n, e = "") {
  let t = typeof n == "string" ? n : n.source;
  const r = {
    replace: (i, s) => {
      let a = typeof s == "string" ? s : s.source;
      return a = a.replace(w.caret, "$1"), t = t.replace(i, a), r;
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
}, Kt = /^(?:[ \t]*(?:\n|$))+/, Xt = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Jt = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, re = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Yt = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, ze = /(?:[*+-]|\d{1,9}[.)])/, dt = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, pt = b(dt).replace(/bull/g, ze).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), en = b(dt).replace(/bull/g, ze).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Fe = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, tn = /^[^\n]+/, Ie = /(?!\s*\])(?:\\.|[^\[\]\\])+/, nn = b(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Ie).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), rn = b(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, ze).getRegex(), me = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Pe = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, sn = b(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", Pe).replace("tag", me).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), ft = b(Fe).replace("hr", re).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", me).getRegex(), on = b(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", ft).getRegex(), He = {
  blockquote: on,
  code: Xt,
  def: nn,
  fences: Jt,
  heading: Yt,
  hr: re,
  html: sn,
  lheading: pt,
  list: rn,
  newline: Kt,
  paragraph: ft,
  table: J,
  text: tn
}, et = b(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", re).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", me).getRegex(), an = {
  ...He,
  lheading: en,
  table: et,
  paragraph: b(Fe).replace("hr", re).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", et).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", me).getRegex()
}, ln = {
  ...He,
  html: b(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", Pe).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: J,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: b(Fe).replace("hr", re).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", pt).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, cn = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, hn = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, gt = /^( {2,}|\\)\n(?!\s*$)/, un = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, be = /[\p{P}\p{S}]/u, qe = /[\s\p{P}\p{S}]/u, mt = /[^\s\p{P}\p{S}]/u, dn = b(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, qe).getRegex(), bt = /(?!~)[\p{P}\p{S}]/u, pn = /(?!~)[\s\p{P}\p{S}]/u, fn = /(?:[^\s\p{P}\p{S}]|~)/u, gn = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, xt = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, mn = b(xt, "u").replace(/punct/g, be).getRegex(), bn = b(xt, "u").replace(/punct/g, bt).getRegex(), kt = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", xn = b(kt, "gu").replace(/notPunctSpace/g, mt).replace(/punctSpace/g, qe).replace(/punct/g, be).getRegex(), kn = b(kt, "gu").replace(/notPunctSpace/g, fn).replace(/punctSpace/g, pn).replace(/punct/g, bt).getRegex(), $n = b(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, mt).replace(/punctSpace/g, qe).replace(/punct/g, be).getRegex(), wn = b(/\\(punct)/, "gu").replace(/punct/g, be).getRegex(), yn = b(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), vn = b(Pe).replace("(?:-->|$)", "-->").getRegex(), _n = b(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", vn).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), de = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, An = b(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", de).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), $t = b(/^!?\[(label)\]\[(ref)\]/).replace("label", de).replace("ref", Ie).getRegex(), wt = b(/^!?\[(ref)\](?:\[\])?/).replace("ref", Ie).getRegex(), Sn = b("reflink|nolink(?!\\()", "g").replace("reflink", $t).replace("nolink", wt).getRegex(), Oe = {
  _backpedal: J,
  // only used for GFM url
  anyPunctuation: wn,
  autolink: yn,
  blockSkip: gn,
  br: gt,
  code: hn,
  del: J,
  emStrongLDelim: mn,
  emStrongRDelimAst: xn,
  emStrongRDelimUnd: $n,
  escape: cn,
  link: An,
  nolink: wt,
  punctuation: dn,
  reflink: $t,
  reflinkSearch: Sn,
  tag: _n,
  text: un,
  url: J
}, En = {
  ...Oe,
  link: b(/^!?\[(label)\]\((.*?)\)/).replace("label", de).getRegex(),
  reflink: b(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", de).getRegex()
}, Ae = {
  ...Oe,
  emStrongRDelimAst: kn,
  emStrongLDelim: bn,
  url: b(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, Tn = {
  ...Ae,
  br: b(gt).replace("{2,}", "*").getRegex(),
  text: b(Ae.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, ae = {
  normal: He,
  gfm: an,
  pedantic: ln
}, W = {
  normal: Oe,
  gfm: Ae,
  breaks: Tn,
  pedantic: En
}, Rn = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, tt = (n) => Rn[n];
function A(n, e) {
  if (e) {
    if (w.escapeTest.test(n))
      return n.replace(w.escapeReplace, tt);
  } else if (w.escapeTestNoEncode.test(n))
    return n.replace(w.escapeReplaceNoEncode, tt);
  return n;
}
function nt(n) {
  try {
    n = encodeURI(n).replace(w.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function rt(n, e) {
  var s;
  const t = n.replace(w.findPipe, (a, o, c) => {
    let l = !1, h = o;
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
function G(n, e, t) {
  const r = n.length;
  if (r === 0)
    return "";
  let i = 0;
  for (; i < r && n.charAt(r - i - 1) === e; )
    i++;
  return n.slice(0, r - i);
}
function Ln(n, e) {
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
function it(n, e, t, r, i) {
  const s = e.href, a = e.title || null, o = n[1].replace(i.other.outputLinkReplace, "$1");
  r.state.inLink = !0;
  const c = {
    type: n[0].charAt(0) === "!" ? "image" : "link",
    raw: t,
    href: s,
    title: a,
    text: o,
    tokens: r.inlineTokens(o)
  };
  return r.state.inLink = !1, c;
}
function Cn(n, e, t) {
  const r = n.match(t.other.indentCodeCompensation);
  if (r === null)
    return e;
  const i = r[1];
  return e.split(`
`).map((s) => {
    const a = s.match(t.other.beginningSpace);
    if (a === null)
      return s;
    const [o] = a;
    return o.length >= i.length ? s.slice(i.length) : s;
  }).join(`
`);
}
var pe = class {
  // set by the lexer
  constructor(n) {
    x(this, "options");
    x(this, "rules");
    // set by the lexer
    x(this, "lexer");
    this.options = n || B;
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
        text: this.options.pedantic ? t : G(t, `
`)
      };
    }
  }
  fences(n) {
    const e = this.rules.block.fences.exec(n);
    if (e) {
      const t = e[0], r = Cn(t, e[3] || "", this.rules);
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
        const r = G(t, "#");
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
        raw: G(e[0], `
`)
      };
  }
  blockquote(n) {
    const e = this.rules.block.blockquote.exec(n);
    if (e) {
      let t = G(e[0], `
`).split(`
`), r = "", i = "";
      const s = [];
      for (; t.length > 0; ) {
        let a = !1;
        const o = [];
        let c;
        for (c = 0; c < t.length; c++)
          if (this.rules.other.blockquoteStart.test(t[c]))
            o.push(t[c]), a = !0;
          else if (!a)
            o.push(t[c]);
          else
            break;
        t = t.slice(c);
        const l = o.join(`
`), h = l.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${l}` : l, i = i ? `${i}
${h}` : h;
        const d = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(h, s, !0), this.lexer.state.top = d, t.length === 0)
          break;
        const u = s.at(-1);
        if ((u == null ? void 0 : u.type) === "code")
          break;
        if ((u == null ? void 0 : u.type) === "blockquote") {
          const f = u, p = f.raw + `
` + t.join(`
`), g = this.blockquote(p);
          s[s.length - 1] = g, r = r.substring(0, r.length - f.raw.length) + g.raw, i = i.substring(0, i.length - f.text.length) + g.text;
          break;
        } else if ((u == null ? void 0 : u.type) === "list") {
          const f = u, p = f.raw + `
` + t.join(`
`), g = this.list(p);
          s[s.length - 1] = g, r = r.substring(0, r.length - u.raw.length) + g.raw, i = i.substring(0, i.length - f.raw.length) + g.raw, t = p.substring(s.at(-1).raw.length).split(`
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
      let a = !1;
      for (; n; ) {
        let c = !1, l = "", h = "";
        if (!(e = s.exec(n)) || this.rules.block.hr.test(n))
          break;
        l = e[0], n = n.substring(l.length);
        let d = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (C) => " ".repeat(3 * C.length)), u = n.split(`
`, 1)[0], f = !d.trim(), p = 0;
        if (this.options.pedantic ? (p = 2, h = d.trimStart()) : f ? p = e[1].length + 1 : (p = e[2].search(this.rules.other.nonSpaceChar), p = p > 4 ? 1 : p, h = d.slice(p), p += e[1].length), f && this.rules.other.blankLine.test(u) && (l += u + `
`, n = n.substring(u.length + 1), c = !0), !c) {
          const C = this.rules.other.nextBulletRegex(p), y = this.rules.other.hrRegex(p), $ = this.rules.other.fencesBeginRegex(p), v = this.rules.other.headingBeginRegex(p), M = this.rules.other.htmlBeginRegex(p);
          for (; n; ) {
            const ie = n.split(`
`, 1)[0];
            let z;
            if (u = ie, this.options.pedantic ? (u = u.replace(this.rules.other.listReplaceNesting, "  "), z = u) : z = u.replace(this.rules.other.tabCharGlobal, "    "), $.test(u) || v.test(u) || M.test(u) || C.test(u) || y.test(u))
              break;
            if (z.search(this.rules.other.nonSpaceChar) >= p || !u.trim())
              h += `
` + z.slice(p);
            else {
              if (f || d.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || $.test(d) || v.test(d) || y.test(d))
                break;
              h += `
` + u;
            }
            !f && !u.trim() && (f = !0), l += ie + `
`, n = n.substring(ie.length + 1), d = z.slice(p);
          }
        }
        i.loose || (a ? i.loose = !0 : this.rules.other.doubleBlankLine.test(l) && (a = !0));
        let g = null, L;
        this.options.gfm && (g = this.rules.other.listIsTask.exec(h), g && (L = g[0] !== "[ ] ", h = h.replace(this.rules.other.listReplaceTask, ""))), i.items.push({
          type: "list_item",
          raw: l,
          task: !!g,
          checked: L,
          loose: !1,
          text: h,
          tokens: []
        }), i.raw += l;
      }
      const o = i.items.at(-1);
      if (o)
        o.raw = o.raw.trimEnd(), o.text = o.text.trimEnd();
      else
        return;
      i.raw = i.raw.trimEnd();
      for (let c = 0; c < i.items.length; c++)
        if (this.lexer.state.top = !1, i.items[c].tokens = this.lexer.blockTokens(i.items[c].text, []), !i.loose) {
          const l = i.items[c].tokens.filter((d) => d.type === "space"), h = l.length > 0 && l.some((d) => this.rules.other.anyLine.test(d.raw));
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
    var a;
    const e = this.rules.block.table.exec(n);
    if (!e || !this.rules.other.tableDelimiter.test(e[2]))
      return;
    const t = rt(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = (a = e[3]) != null && a.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], s = {
      type: "table",
      raw: e[0],
      header: [],
      align: [],
      rows: []
    };
    if (t.length === r.length) {
      for (const o of r)
        this.rules.other.tableAlignRight.test(o) ? s.align.push("right") : this.rules.other.tableAlignCenter.test(o) ? s.align.push("center") : this.rules.other.tableAlignLeft.test(o) ? s.align.push("left") : s.align.push(null);
      for (let o = 0; o < t.length; o++)
        s.header.push({
          text: t[o],
          tokens: this.lexer.inline(t[o]),
          header: !0,
          align: s.align[o]
        });
      for (const o of i)
        s.rows.push(rt(o, s.header.length).map((c, l) => ({
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
        const s = G(t.slice(0, -1), "\\");
        if ((t.length - s.length) % 2 === 0)
          return;
      } else {
        const s = Ln(e[2], "()");
        if (s === -2)
          return;
        if (s > -1) {
          const o = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + s;
          e[2] = e[2].substring(0, s), e[0] = e[0].substring(0, o).trim(), e[3] = "";
        }
      }
      let r = e[2], i = "";
      if (this.options.pedantic) {
        const s = this.rules.other.pedanticHrefTitle.exec(r);
        s && (r = s[1], i = s[3]);
      } else
        i = e[3] ? e[3].slice(1, -1) : "";
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(t) ? r = r.slice(1) : r = r.slice(1, -1)), it(e, {
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
      return it(t, i, t[0], this.lexer, this.rules);
    }
  }
  emStrong(n, e, t = "") {
    let r = this.rules.inline.emStrongLDelim.exec(n);
    if (!r || r[3] && t.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(r[1] || r[2] || "") || !t || this.rules.inline.punctuation.exec(t)) {
      const s = [...r[0]].length - 1;
      let a, o, c = s, l = 0;
      const h = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (h.lastIndex = 0, e = e.slice(-1 * n.length + s); (r = h.exec(e)) != null; ) {
        if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a) continue;
        if (o = [...a].length, r[3] || r[4]) {
          c += o;
          continue;
        } else if ((r[5] || r[6]) && s % 3 && !((s + o) % 3)) {
          l += o;
          continue;
        }
        if (c -= o, c > 0) continue;
        o = Math.min(o, o + c + l);
        const d = [...r[0]][0].length, u = n.slice(0, s + r.index + d + o);
        if (Math.min(s, o) % 2) {
          const p = u.slice(1, -1);
          return {
            type: "em",
            raw: u,
            text: p,
            tokens: this.lexer.inlineTokens(p)
          };
        }
        const f = u.slice(2, -2);
        return {
          type: "strong",
          raw: u,
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
}, S = class Se {
  constructor(e) {
    x(this, "tokens");
    x(this, "options");
    x(this, "state");
    x(this, "tokenizer");
    x(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || B, this.options.tokenizer = this.options.tokenizer || new pe(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const t = {
      other: w,
      block: ae.normal,
      inline: W.normal
    };
    this.options.pedantic ? (t.block = ae.pedantic, t.inline = W.pedantic) : this.options.gfm && (t.block = ae.gfm, this.options.breaks ? t.inline = W.breaks : t.inline = W.gfm), this.tokenizer.rules = t;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: ae,
      inline: W
    };
  }
  /**
   * Static Lex Method
   */
  static lex(e, t) {
    return new Se(t).lex(e);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(e, t) {
    return new Se(t).inlineTokens(e);
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
    var i, s, a;
    for (this.options.pedantic && (e = e.replace(w.tabCharGlobal, "    ").replace(w.spaceLine, "")); e; ) {
      let o;
      if ((s = (i = this.options.extensions) == null ? void 0 : i.block) != null && s.some((l) => (o = l.call({ lexer: this }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), !0) : !1))
        continue;
      if (o = this.tokenizer.space(e)) {
        e = e.substring(o.raw.length);
        const l = t.at(-1);
        o.raw.length === 1 && l !== void 0 ? l.raw += `
` : t.push(o);
        continue;
      }
      if (o = this.tokenizer.code(e)) {
        e = e.substring(o.raw.length);
        const l = t.at(-1);
        (l == null ? void 0 : l.type) === "paragraph" || (l == null ? void 0 : l.type) === "text" ? (l.raw += `
` + o.raw, l.text += `
` + o.text, this.inlineQueue.at(-1).src = l.text) : t.push(o);
        continue;
      }
      if (o = this.tokenizer.fences(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.heading(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.hr(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.blockquote(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.list(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.html(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.def(e)) {
        e = e.substring(o.raw.length);
        const l = t.at(-1);
        (l == null ? void 0 : l.type) === "paragraph" || (l == null ? void 0 : l.type) === "text" ? (l.raw += `
` + o.raw, l.text += `
` + o.raw, this.inlineQueue.at(-1).src = l.text) : this.tokens.links[o.tag] || (this.tokens.links[o.tag] = {
          href: o.href,
          title: o.title
        });
        continue;
      }
      if (o = this.tokenizer.table(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.lheading(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      let c = e;
      if ((a = this.options.extensions) != null && a.startBlock) {
        let l = 1 / 0;
        const h = e.slice(1);
        let d;
        this.options.extensions.startBlock.forEach((u) => {
          d = u.call({ lexer: this }, h), typeof d == "number" && d >= 0 && (l = Math.min(l, d));
        }), l < 1 / 0 && l >= 0 && (c = e.substring(0, l + 1));
      }
      if (this.state.top && (o = this.tokenizer.paragraph(c))) {
        const l = t.at(-1);
        r && (l == null ? void 0 : l.type) === "paragraph" ? (l.raw += `
` + o.raw, l.text += `
` + o.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = l.text) : t.push(o), r = c.length !== e.length, e = e.substring(o.raw.length);
        continue;
      }
      if (o = this.tokenizer.text(e)) {
        e = e.substring(o.raw.length);
        const l = t.at(-1);
        (l == null ? void 0 : l.type) === "text" ? (l.raw += `
` + o.raw, l.text += `
` + o.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = l.text) : t.push(o);
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
    var o, c, l;
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
    let s = !1, a = "";
    for (; e; ) {
      s || (a = ""), s = !1;
      let h;
      if ((c = (o = this.options.extensions) == null ? void 0 : o.inline) != null && c.some((u) => (h = u.call({ lexer: this }, e, t)) ? (e = e.substring(h.raw.length), t.push(h), !0) : !1))
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
        const u = t.at(-1);
        h.type === "text" && (u == null ? void 0 : u.type) === "text" ? (u.raw += h.raw, u.text += h.text) : t.push(h);
        continue;
      }
      if (h = this.tokenizer.emStrong(e, r, a)) {
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
      let d = e;
      if ((l = this.options.extensions) != null && l.startInline) {
        let u = 1 / 0;
        const f = e.slice(1);
        let p;
        this.options.extensions.startInline.forEach((g) => {
          p = g.call({ lexer: this }, f), typeof p == "number" && p >= 0 && (u = Math.min(u, p));
        }), u < 1 / 0 && u >= 0 && (d = e.substring(0, u + 1));
      }
      if (h = this.tokenizer.inlineText(d)) {
        e = e.substring(h.raw.length), h.raw.slice(-1) !== "_" && (a = h.raw.slice(-1)), s = !0;
        const u = t.at(-1);
        (u == null ? void 0 : u.type) === "text" ? (u.raw += h.raw, u.text += h.text) : t.push(h);
        continue;
      }
      if (e) {
        const u = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(u);
          break;
        } else
          throw new Error(u);
      }
    }
    return t;
  }
}, fe = class {
  // set by the parser
  constructor(n) {
    x(this, "options");
    x(this, "parser");
    this.options = n || B;
  }
  space(n) {
    return "";
  }
  code({ text: n, lang: e, escaped: t }) {
    var s;
    const r = (s = (e || "").match(w.notSpaceStart)) == null ? void 0 : s[0], i = n.replace(w.endingNewline, "") + `
`;
    return r ? '<pre><code class="language-' + A(r) + '">' + (t ? i : A(i, !0)) + `</code></pre>
` : "<pre><code>" + (t ? i : A(i, !0)) + `</code></pre>
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
    for (let a = 0; a < n.items.length; a++) {
      const o = n.items[a];
      r += this.listitem(o);
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
      n.loose ? ((t = n.tokens[0]) == null ? void 0 : t.type) === "paragraph" ? (n.tokens[0].text = r + " " + n.tokens[0].text, n.tokens[0].tokens && n.tokens[0].tokens.length > 0 && n.tokens[0].tokens[0].type === "text" && (n.tokens[0].tokens[0].text = r + " " + A(n.tokens[0].tokens[0].text), n.tokens[0].tokens[0].escaped = !0)) : n.tokens.unshift({
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
      for (let a = 0; a < s.length; a++)
        t += this.tablecell(s[a]);
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
    return `<code>${A(n, !0)}</code>`;
  }
  br(n) {
    return "<br>";
  }
  del({ tokens: n }) {
    return `<del>${this.parser.parseInline(n)}</del>`;
  }
  link({ href: n, title: e, tokens: t }) {
    const r = this.parser.parseInline(t), i = nt(n);
    if (i === null)
      return r;
    n = i;
    let s = '<a href="' + n + '"';
    return e && (s += ' title="' + A(e) + '"'), s += ">" + r + "</a>", s;
  }
  image({ href: n, title: e, text: t, tokens: r }) {
    r && (t = this.parser.parseInline(r, this.parser.textRenderer));
    const i = nt(n);
    if (i === null)
      return A(t);
    n = i;
    let s = `<img src="${n}" alt="${t}"`;
    return e && (s += ` title="${A(e)}"`), s += ">", s;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : A(n.text);
  }
}, Be = class {
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
}, E = class Ee {
  constructor(e) {
    x(this, "options");
    x(this, "renderer");
    x(this, "textRenderer");
    this.options = e || B, this.options.renderer = this.options.renderer || new fe(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Be();
  }
  /**
   * Static Parse Method
   */
  static parse(e, t) {
    return new Ee(t).parse(e);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(e, t) {
    return new Ee(t).parseInline(e);
  }
  /**
   * Parse Loop
   */
  parse(e, t = !0) {
    var i, s;
    let r = "";
    for (let a = 0; a < e.length; a++) {
      const o = e[a];
      if ((s = (i = this.options.extensions) == null ? void 0 : i.renderers) != null && s[o.type]) {
        const l = o, h = this.options.extensions.renderers[l.type].call({ parser: this }, l);
        if (h !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(l.type)) {
          r += h || "";
          continue;
        }
      }
      const c = o;
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
          for (; a + 1 < e.length && e[a + 1].type === "text"; )
            l = e[++a], h += `
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
    for (let a = 0; a < e.length; a++) {
      const o = e[a];
      if ((s = (i = this.options.extensions) == null ? void 0 : i.renderers) != null && s[o.type]) {
        const l = this.options.extensions.renderers[o.type].call({ parser: this }, o);
        if (l !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(o.type)) {
          r += l || "";
          continue;
        }
      }
      const c = o;
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
}, _e, ce = (_e = class {
  constructor(n) {
    x(this, "options");
    x(this, "block");
    this.options = n || B;
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
    return this.block ? S.lex : S.lexInline;
  }
  /**
   * Provide function to parse tokens
   */
  provideParser() {
    return this.block ? E.parse : E.parseInline;
  }
}, x(_e, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess",
  "processAllTokens"
])), _e), Mn = class {
  constructor(...n) {
    x(this, "defaults", Me());
    x(this, "options", this.setOptions);
    x(this, "parse", this.parseMarkdown(!0));
    x(this, "parseInline", this.parseMarkdown(!1));
    x(this, "Parser", E);
    x(this, "Renderer", fe);
    x(this, "TextRenderer", Be);
    x(this, "Lexer", S);
    x(this, "Tokenizer", pe);
    x(this, "Hooks", ce);
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
          const a = s;
          for (const o of a.header)
            t = t.concat(this.walkTokens(o.tokens, e));
          for (const o of a.rows)
            for (const c of o)
              t = t.concat(this.walkTokens(c.tokens, e));
          break;
        }
        case "list": {
          const a = s;
          t = t.concat(this.walkTokens(a.items, e));
          break;
        }
        default: {
          const a = s;
          (i = (r = this.defaults.extensions) == null ? void 0 : r.childTokens) != null && i[a.type] ? this.defaults.extensions.childTokens[a.type].forEach((o) => {
            const c = a[o].flat(1 / 0);
            t = t.concat(this.walkTokens(c, e));
          }) : a.tokens && (t = t.concat(this.walkTokens(a.tokens, e)));
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
          s ? e.renderers[i.name] = function(...a) {
            let o = i.renderer.apply(this, a);
            return o === !1 && (o = s.apply(this, a)), o;
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
        const i = this.defaults.renderer || new fe(this.defaults);
        for (const s in t.renderer) {
          if (!(s in i))
            throw new Error(`renderer '${s}' does not exist`);
          if (["options", "parser"].includes(s))
            continue;
          const a = s, o = t.renderer[a], c = i[a];
          i[a] = (...l) => {
            let h = o.apply(i, l);
            return h === !1 && (h = c.apply(i, l)), h || "";
          };
        }
        r.renderer = i;
      }
      if (t.tokenizer) {
        const i = this.defaults.tokenizer || new pe(this.defaults);
        for (const s in t.tokenizer) {
          if (!(s in i))
            throw new Error(`tokenizer '${s}' does not exist`);
          if (["options", "rules", "lexer"].includes(s))
            continue;
          const a = s, o = t.tokenizer[a], c = i[a];
          i[a] = (...l) => {
            let h = o.apply(i, l);
            return h === !1 && (h = c.apply(i, l)), h;
          };
        }
        r.tokenizer = i;
      }
      if (t.hooks) {
        const i = this.defaults.hooks || new ce();
        for (const s in t.hooks) {
          if (!(s in i))
            throw new Error(`hook '${s}' does not exist`);
          if (["options", "block"].includes(s))
            continue;
          const a = s, o = t.hooks[a], c = i[a];
          ce.passThroughHooks.has(s) ? i[a] = (l) => {
            if (this.defaults.async)
              return Promise.resolve(o.call(i, l)).then((d) => c.call(i, d));
            const h = o.call(i, l);
            return c.call(i, h);
          } : i[a] = (...l) => {
            let h = o.apply(i, l);
            return h === !1 && (h = c.apply(i, l)), h;
          };
        }
        r.hooks = i;
      }
      if (t.walkTokens) {
        const i = this.defaults.walkTokens, s = t.walkTokens;
        r.walkTokens = function(a) {
          let o = [];
          return o.push(s.call(this, a)), i && (o = o.concat(i.call(this, a))), o;
        };
      }
      this.defaults = { ...this.defaults, ...r };
    }), this;
  }
  setOptions(n) {
    return this.defaults = { ...this.defaults, ...n }, this;
  }
  lexer(n, e) {
    return S.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return E.parse(n, e ?? this.defaults);
  }
  parseMarkdown(n) {
    return (t, r) => {
      const i = { ...r }, s = { ...this.defaults, ...i }, a = this.onError(!!s.silent, !!s.async);
      if (this.defaults.async === !0 && i.async === !1)
        return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof t > "u" || t === null)
        return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof t != "string")
        return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(t) + ", string expected"));
      s.hooks && (s.hooks.options = s, s.hooks.block = n);
      const o = s.hooks ? s.hooks.provideLexer() : n ? S.lex : S.lexInline, c = s.hooks ? s.hooks.provideParser() : n ? E.parse : E.parseInline;
      if (s.async)
        return Promise.resolve(s.hooks ? s.hooks.preprocess(t) : t).then((l) => o(l, s)).then((l) => s.hooks ? s.hooks.processAllTokens(l) : l).then((l) => s.walkTokens ? Promise.all(this.walkTokens(l, s.walkTokens)).then(() => l) : l).then((l) => c(l, s)).then((l) => s.hooks ? s.hooks.postprocess(l) : l).catch(a);
      try {
        s.hooks && (t = s.hooks.preprocess(t));
        let l = o(t, s);
        s.hooks && (l = s.hooks.processAllTokens(l)), s.walkTokens && this.walkTokens(l, s.walkTokens);
        let h = c(l, s);
        return s.hooks && (h = s.hooks.postprocess(h)), h;
      } catch (l) {
        return a(l);
      }
    };
  }
  onError(n, e) {
    return (t) => {
      if (t.message += `
Please report this to https://github.com/markedjs/marked.`, n) {
        const r = "<p>An error occurred:</p><pre>" + A(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(r) : r;
      }
      if (e)
        return Promise.reject(t);
      throw t;
    };
  }
}, O = new Mn();
function m(n, e) {
  return O.parse(n, e);
}
m.options = m.setOptions = function(n) {
  return O.setOptions(n), m.defaults = O.defaults, ut(m.defaults), m;
};
m.getDefaults = Me;
m.defaults = B;
m.use = function(...n) {
  return O.use(...n), m.defaults = O.defaults, ut(m.defaults), m;
};
m.walkTokens = function(n, e) {
  return O.walkTokens(n, e);
};
m.parseInline = O.parseInline;
m.Parser = E;
m.parser = E.parse;
m.Renderer = fe;
m.TextRenderer = Be;
m.Lexer = S;
m.lexer = S.lex;
m.Tokenizer = pe;
m.Hooks = ce;
m.parse = m;
m.options;
m.setOptions;
m.use;
m.walkTokens;
m.parseInline;
E.parse;
S.lex;
class zn {
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
    const t = e.markdown ? m(e.markdown) : "";
    return typeof t == "string" ? this.processContent(t, e.forms) : this.generateLegacyHTML(e);
  }
  processContent(e, t) {
    if (t.length === 0)
      return e;
    const r = [], i = [];
    t.forEach((a) => {
      a.inline ? r.push(a) : i.push(a);
    });
    let s = e;
    if (r.forEach((a, o) => {
      const c = `<!--FORMDOWN_FIELD_${t.indexOf(a)}-->`, l = this.generateInlineFieldHTML(a);
      s = s.replace(new RegExp(c, "g"), l);
    }), i.length > 0) {
      const a = this.generateSingleFormHTML(i), o = t.findIndex((c) => !c.inline);
      if (o !== -1) {
        const c = `<!--FORMDOWN_FIELD_${o}-->`;
        s = s.replace(new RegExp(c, "g"), a), i.slice(1).forEach((l) => {
          const d = `<!--FORMDOWN_FIELD_${t.indexOf(l)}-->`;
          s = s.replace(new RegExp(d, "g"), "");
        });
      } else
        s += `
` + a;
    }
    return s;
  }
  processFieldPlaceholders(e, t) {
    let r = e;
    return t.forEach((i, s) => {
      const a = `<!--FORMDOWN_FIELD_${s}-->`, o = this.generateStandaloneFieldHTML(i);
      r = r.replace(new RegExp(a, "g"), o);
    }), r;
  }
  generateLegacyHTML(e) {
    const t = e.markdown ? m(e.markdown) : "", r = this.generateFormHTML(e.forms);
    return t + r;
  }
  generateStandaloneFieldHTML(e) {
    return e.inline ? this.generateInlineFieldHTML(e) : `
<form class="formdown-form">
${this.generateFieldHTML(e)}
</form>`;
  }
  generateSingleFormHTML(e) {
    return e.length === 0 ? "" : `
<form class="formdown-form" role="form">
${e.map((r) => this.generateFieldHTML(r)).join(`
`)}
</form>`;
  }
  generateInlineFieldHTML(e) {
    const { name: t, type: r, required: i, placeholder: s, attributes: a } = e, o = e.label || this.generateSmartLabel(t), c = {
      "data-field-name": t,
      "data-field-type": r,
      "data-placeholder": s || o,
      class: "formdown-inline-field",
      contenteditable: "true",
      role: "textbox",
      ...i && { "data-required": "true" },
      ...a && a
    };
    return `<span ${Object.entries(c).map(([h, d]) => typeof d == "boolean" ? d ? h : "" : `${h}="${d}"`).filter(Boolean).join(" ")}>${o}</span>`;
  }
  generateFormHTML(e) {
    return e.length === 0 ? "" : `
<form class="formdown-form">
${e.map((r) => this.generateFieldHTML(r)).join(`
`)}
</form>`;
  }
  generateFieldHTML(e) {
    const { name: t, type: r, label: i, required: s, placeholder: a, attributes: o, options: c, description: l, errorMessage: h, pattern: d, format: u } = e, f = i || this.generateSmartLabel(t), p = t, g = l ? `${t}-description` : void 0, L = h ? `${t}-error` : void 0, C = {
      id: p,
      name: t,
      ...s && { required: !0 },
      ...a && { placeholder: a },
      ...d && { pattern: d },
      ...u && { format: u },
      ...l && { "aria-describedby": g },
      ...h && { "aria-describedby": `${g ? g + " " : ""}${L}` },
      ...o
    }, y = Object.entries(C).map(([v, M]) => typeof M == "boolean" ? M ? v : "" : `${v}="${M}"`).filter(Boolean).join(" "), $ = () => {
      let v = "";
      return l && (v += `
    <div id="${g}" class="formdown-field-description">${l}</div>`), h && (v += `
    <div id="${L}" class="formdown-field-error" role="alert">${h}</div>`), v;
    };
    switch (r) {
      case "textarea":
        return `
<div class="formdown-field">
    <label for="${p}">${f}${s ? " *" : ""}</label>
    <textarea ${y}></textarea>${$()}
</div>`;
      case "select":
        const v = (c == null ? void 0 : c.map((F) => `<option value="${F}">${F}</option>`).join(`
`)) || "";
        return `
<div class="formdown-field">
    <label for="${p}">${f}${s ? " *" : ""}</label>
    <select ${y}>
        ${v}
    </select>${$()}
</div>`;
      case "radio":
        if (!c || c.length === 0)
          return `
<div class="formdown-field">
    <label for="${p}">${f}${s ? " *" : ""}</label>
    <input type="text" ${y}>${$()}
</div>`;
        const M = c.map((F, xe) => {
          const se = `${t}_${xe}`;
          return `
        <label for="${se}" class="formdown-option-label">
            <input type="radio" id="${se}" name="${t}" value="${F}" ${s && xe === 0 ? "required" : ""} ${g ? `aria-describedby="${g}"` : ""}>
            <span>${F}</span>
        </label>`;
        }).join(`
`), z = (o == null ? void 0 : o.layout) === "vertical" ? "radio-group vertical" : "radio-group inline";
        return `
<div class="formdown-field">
    <fieldset ${g ? `aria-describedby="${g}"` : ""}>
        <legend>${f}${s ? " *" : ""}</legend>
        <div class="${z}" role="radiogroup">
${M}
        </div>
    </fieldset>${$()}
</div>`;
      case "checkbox":
        if (!c || c.length === 0)
          return `
<div class="formdown-field">
    <label for="${p}" class="formdown-checkbox-label">
        <input type="checkbox" id="${p}" name="${t}" value="true" ${s ? "required" : ""} ${y}>
        <span>${f}${s ? " *" : ""}</span>
    </label>${$()}
</div>`;
        {
          const F = c.map((ke, De) => {
            const je = `${t}_${De}`;
            return `
        <label for="${je}" class="formdown-option-label">
            <input type="checkbox" id="${je}" name="${t}" value="${ke}" ${s && De === 0 ? "required" : ""} ${g ? `aria-describedby="${g}"` : ""}>
            <span>${ke}</span>
        </label>`;
          }).join(`
`), se = (o == null ? void 0 : o.layout) === "vertical" ? "checkbox-group vertical" : "checkbox-group inline";
          return `
<div class="formdown-field">
    <fieldset ${g ? `aria-describedby="${g}"` : ""}>
        <legend>${f}${s ? " *" : ""}</legend>
        <div class="${se}" role="group">
${F}
        </div>
    </fieldset>${$()}
</div>`;
        }
      // Extended HTML5 input types
      case "range":
        const yt = (o == null ? void 0 : o.min) || 0, vt = (o == null ? void 0 : o.max) || 100;
        o != null && o.step;
        const Ue = (o == null ? void 0 : o.value) || Math.floor((yt + vt) / 2);
        return `
<div class="formdown-field">
    <label for="${p}">${f}${s ? " *" : ""}</label>
    <input type="range" ${y} value="${Ue}">
    <output for="${p}" class="formdown-range-output">${Ue}</output>${$()}
</div>`;
      case "file":
        return `
<div class="formdown-field">
    <label for="${p}">${f}${s ? " *" : ""}</label>
    <input type="file" ${y}>${$()}
</div>`;
      case "color":
        return `
<div class="formdown-field">
    <label for="${p}">${f}${s ? " *" : ""}</label>
    <input type="color" ${y}>${$()}
</div>`;
      case "week":
        return `
<div class="formdown-field">
    <label for="${p}">${f}${s ? " *" : ""}</label>
    <input type="week" ${y}>${$()}
</div>`;
      case "month":
        return `
<div class="formdown-field">
    <label for="${p}">${f}${s ? " *" : ""}</label>
    <input type="month" ${y}>${$()}
</div>`;
      default:
        return `
<div class="formdown-field">
    <label for="${p}">${f}${s ? " *" : ""}</label>
    <input type="${r}" ${y}>${$()}
</div>`;
    }
  }
}
var Fn = Object.defineProperty, In = Object.getOwnPropertyDescriptor, U = (n, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? In(e, t) : e, s = n.length - 1, a; s >= 0; s--)
    (a = n[s]) && (i = (r ? a(e, t, i) : a(i)) || i);
  return r && i && Fn(e, t, i), i;
};
let _ = class extends X {
  // Prevent infinite loops
  constructor() {
    super(), this.content = "", this.selectOnFocus = !0, this.formId = "", this.showSubmitButton = !0, this.submitText = "Submit", this._data = {}, this.parser = new Qt(), this.generator = new zn(), this.fieldRegistry = /* @__PURE__ */ new Map(), this._isUpdatingUI = !1, this._uniqueFormId = this.formId || `formdown-${Math.random().toString(36).substring(2, 15)}`;
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
      (i, s, a) => a.includes("form=") ? i : `<${s}${a} form="${e}">`
    ), t + r;
  }
  get data() {
    return this._data;
  }
  set data(n) {
    const e = this._data;
    this._data = n != null && typeof n == "object" ? { ...n } : {}, this.requestUpdate("data", e);
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
      return oe`<div class="error">No Formdown content provided</div>`;
    try {
      const n = this.parser.parseFormdown(this.content), e = this.generator.generateHTML(n);
      return !e || !e.trim() ? oe`<div class="error">Generated HTML is empty</div>` : oe`<div id="content-container"></div>`;
    } catch (n) {
      const e = n instanceof Error ? n.message : String(n);
      return oe`<div class="error">Error rendering content: ${e}</div>`;
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
        const a = this.data[s];
        a !== void 0 && this.setElementValue(i, a), this.setupFieldEventHandlers(i, s), this.setupFieldSpecificBehaviors(i);
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
          const o = [];
          s.forEach((c) => {
            c.checked && o.push(c.value);
          }), this.updateDataReactively(e, o, n);
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
        const s = window.getSelection(), a = document.createRange();
        a.selectNodeContents(n), s == null || s.removeAllRanges(), s == null || s.addRange(a);
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
      let t;
      if (n)
        t = [n];
      else {
        const r = Array.from(this.fieldRegistry.keys()), i = Object.keys(this.data);
        t = [.../* @__PURE__ */ new Set([...r, ...i])];
      }
      t.forEach((r) => {
        const i = this.data[r] ?? "", s = this.fieldRegistry.get(r);
        s && s.forEach((a) => {
          a !== e && this.setElementValue(a, i);
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
      const s = i, a = this.getFieldName(s);
      if (a) {
        const o = this.validateField(s, a);
        n.push(...o);
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
          const a = (r = this.shadowRoot) == null ? void 0 : r.querySelectorAll(`input[type="checkbox"][name="${e}"]`);
          Array.from(a).some((c) => c.checked) || t.push({ field: e, message: "This field is required" });
        } else if (n.type === "radio") {
          const a = (i = this.shadowRoot) == null ? void 0 : i.querySelectorAll(`input[type="radio"][name="${e}"]`);
          Array.from(a).some((c) => c.checked) || t.push({ field: e, message: "Please select an option" });
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
      const a = s, o = this.getFieldName(a);
      if (o) {
        const c = t.get(o);
        c && c.length > 0 ? (a.classList.add("field-error"), a.classList.remove("field-valid"), this.addErrorMessage(a, c[0].message)) : a.classList.remove("field-error", "field-valid");
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
_.styles = Et`
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
U([
  N()
], _.prototype, "content", 2);
U([
  N({ type: Boolean, attribute: "select-on-focus" })
], _.prototype, "selectOnFocus", 2);
U([
  N({ attribute: "form-id" })
], _.prototype, "formId", 2);
U([
  N({ type: Boolean, attribute: "show-submit-button" })
], _.prototype, "showSubmitButton", 2);
U([
  N({ attribute: "submit-text" })
], _.prototype, "submitText", 2);
U([
  N({ type: Object })
], _.prototype, "data", 1);
_ = U([
  Zt("formdown-ui")
], _);
const Bn = (n, e = {}) => {
  const t = document.createElement("formdown-ui");
  return e.content && (t.content = e.content), e.formId && (t.formId = e.formId), e.showSubmitButton !== void 0 && (t.showSubmitButton = e.showSubmitButton), e.submitText && (t.submitText = e.submitText), n.appendChild(t), t;
};
customElements.get("formdown-ui") || customElements.define("formdown-ui", _);
typeof window < "u" && (window.FormdownUI = _);
export {
  _ as FormdownUI,
  Bn as createFormdownUI
};
