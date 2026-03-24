"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/react/cjs/react.production.min.js
  var require_react_production_min = __commonJS({
    "node_modules/react/cjs/react.production.min.js"(exports) {
      "use strict";
      var l = Symbol.for("react.element");
      var n = Symbol.for("react.portal");
      var p = Symbol.for("react.fragment");
      var q = Symbol.for("react.strict_mode");
      var r = Symbol.for("react.profiler");
      var t = Symbol.for("react.provider");
      var u = Symbol.for("react.context");
      var v = Symbol.for("react.forward_ref");
      var w = Symbol.for("react.suspense");
      var x = Symbol.for("react.memo");
      var y = Symbol.for("react.lazy");
      var z = Symbol.iterator;
      function A(a) {
        if (null === a || "object" !== typeof a) return null;
        a = z && a[z] || a["@@iterator"];
        return "function" === typeof a ? a : null;
      }
      var B = { isMounted: function() {
        return false;
      }, enqueueForceUpdate: function() {
      }, enqueueReplaceState: function() {
      }, enqueueSetState: function() {
      } };
      var C = Object.assign;
      var D = {};
      function E(a, b, e) {
        this.props = a;
        this.context = b;
        this.refs = D;
        this.updater = e || B;
      }
      E.prototype.isReactComponent = {};
      E.prototype.setState = function(a, b) {
        if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, a, b, "setState");
      };
      E.prototype.forceUpdate = function(a) {
        this.updater.enqueueForceUpdate(this, a, "forceUpdate");
      };
      function F() {
      }
      F.prototype = E.prototype;
      function G(a, b, e) {
        this.props = a;
        this.context = b;
        this.refs = D;
        this.updater = e || B;
      }
      var H = G.prototype = new F();
      H.constructor = G;
      C(H, E.prototype);
      H.isPureReactComponent = true;
      var I = Array.isArray;
      var J = Object.prototype.hasOwnProperty;
      var K = { current: null };
      var L = { key: true, ref: true, __self: true, __source: true };
      function M(a, b, e) {
        var d, c = {}, k = null, h = null;
        if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k = "" + b.key), b) J.call(b, d) && !L.hasOwnProperty(d) && (c[d] = b[d]);
        var g = arguments.length - 2;
        if (1 === g) c.children = e;
        else if (1 < g) {
          for (var f = Array(g), m = 0; m < g; m++) f[m] = arguments[m + 2];
          c.children = f;
        }
        if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
        return { $$typeof: l, type: a, key: k, ref: h, props: c, _owner: K.current };
      }
      function N(a, b) {
        return { $$typeof: l, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
      }
      function O(a) {
        return "object" === typeof a && null !== a && a.$$typeof === l;
      }
      function escape(a) {
        var b = { "=": "=0", ":": "=2" };
        return "$" + a.replace(/[=:]/g, function(a2) {
          return b[a2];
        });
      }
      var P = /\/+/g;
      function Q(a, b) {
        return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
      }
      function R(a, b, e, d, c) {
        var k = typeof a;
        if ("undefined" === k || "boolean" === k) a = null;
        var h = false;
        if (null === a) h = true;
        else switch (k) {
          case "string":
          case "number":
            h = true;
            break;
          case "object":
            switch (a.$$typeof) {
              case l:
              case n:
                h = true;
            }
        }
        if (h) return h = a, c = c(h), a = "" === d ? "." + Q(h, 0) : d, I(c) ? (e = "", null != a && (e = a.replace(P, "$&/") + "/"), R(c, b, e, "", function(a2) {
          return a2;
        })) : null != c && (O(c) && (c = N(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P, "$&/") + "/") + a)), b.push(c)), 1;
        h = 0;
        d = "" === d ? "." : d + ":";
        if (I(a)) for (var g = 0; g < a.length; g++) {
          k = a[g];
          var f = d + Q(k, g);
          h += R(k, b, e, f, c);
        }
        else if (f = A(a), "function" === typeof f) for (a = f.call(a), g = 0; !(k = a.next()).done; ) k = k.value, f = d + Q(k, g++), h += R(k, b, e, f, c);
        else if ("object" === k) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
        return h;
      }
      function S(a, b, e) {
        if (null == a) return a;
        var d = [], c = 0;
        R(a, d, "", "", function(a2) {
          return b.call(e, a2, c++);
        });
        return d;
      }
      function T(a) {
        if (-1 === a._status) {
          var b = a._result;
          b = b();
          b.then(function(b2) {
            if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
          }, function(b2) {
            if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
          });
          -1 === a._status && (a._status = 0, a._result = b);
        }
        if (1 === a._status) return a._result.default;
        throw a._result;
      }
      var U = { current: null };
      var V = { transition: null };
      var W = { ReactCurrentDispatcher: U, ReactCurrentBatchConfig: V, ReactCurrentOwner: K };
      function X() {
        throw Error("act(...) is not supported in production builds of React.");
      }
      exports.Children = { map: S, forEach: function(a, b, e) {
        S(a, function() {
          b.apply(this, arguments);
        }, e);
      }, count: function(a) {
        var b = 0;
        S(a, function() {
          b++;
        });
        return b;
      }, toArray: function(a) {
        return S(a, function(a2) {
          return a2;
        }) || [];
      }, only: function(a) {
        if (!O(a)) throw Error("React.Children.only expected to receive a single React element child.");
        return a;
      } };
      exports.Component = E;
      exports.Fragment = p;
      exports.Profiler = r;
      exports.PureComponent = G;
      exports.StrictMode = q;
      exports.Suspense = w;
      exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W;
      exports.act = X;
      exports.cloneElement = function(a, b, e) {
        if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
        var d = C({}, a.props), c = a.key, k = a.ref, h = a._owner;
        if (null != b) {
          void 0 !== b.ref && (k = b.ref, h = K.current);
          void 0 !== b.key && (c = "" + b.key);
          if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
          for (f in b) J.call(b, f) && !L.hasOwnProperty(f) && (d[f] = void 0 === b[f] && void 0 !== g ? g[f] : b[f]);
        }
        var f = arguments.length - 2;
        if (1 === f) d.children = e;
        else if (1 < f) {
          g = Array(f);
          for (var m = 0; m < f; m++) g[m] = arguments[m + 2];
          d.children = g;
        }
        return { $$typeof: l, type: a.type, key: c, ref: k, props: d, _owner: h };
      };
      exports.createContext = function(a) {
        a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
        a.Provider = { $$typeof: t, _context: a };
        return a.Consumer = a;
      };
      exports.createElement = M;
      exports.createFactory = function(a) {
        var b = M.bind(null, a);
        b.type = a;
        return b;
      };
      exports.createRef = function() {
        return { current: null };
      };
      exports.forwardRef = function(a) {
        return { $$typeof: v, render: a };
      };
      exports.isValidElement = O;
      exports.lazy = function(a) {
        return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T };
      };
      exports.memo = function(a, b) {
        return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
      };
      exports.startTransition = function(a) {
        var b = V.transition;
        V.transition = {};
        try {
          a();
        } finally {
          V.transition = b;
        }
      };
      exports.unstable_act = X;
      exports.useCallback = function(a, b) {
        return U.current.useCallback(a, b);
      };
      exports.useContext = function(a) {
        return U.current.useContext(a);
      };
      exports.useDebugValue = function() {
      };
      exports.useDeferredValue = function(a) {
        return U.current.useDeferredValue(a);
      };
      exports.useEffect = function(a, b) {
        return U.current.useEffect(a, b);
      };
      exports.useId = function() {
        return U.current.useId();
      };
      exports.useImperativeHandle = function(a, b, e) {
        return U.current.useImperativeHandle(a, b, e);
      };
      exports.useInsertionEffect = function(a, b) {
        return U.current.useInsertionEffect(a, b);
      };
      exports.useLayoutEffect = function(a, b) {
        return U.current.useLayoutEffect(a, b);
      };
      exports.useMemo = function(a, b) {
        return U.current.useMemo(a, b);
      };
      exports.useReducer = function(a, b, e) {
        return U.current.useReducer(a, b, e);
      };
      exports.useRef = function(a) {
        return U.current.useRef(a);
      };
      exports.useState = function(a) {
        return U.current.useState(a);
      };
      exports.useSyncExternalStore = function(a, b, e) {
        return U.current.useSyncExternalStore(a, b, e);
      };
      exports.useTransition = function() {
        return U.current.useTransition();
      };
      exports.version = "18.3.1";
    }
  });

  // node_modules/react/index.js
  var require_react = __commonJS({
    "node_modules/react/index.js"(exports, module) {
      "use strict";
      if (true) {
        module.exports = require_react_production_min();
      } else {
        module.exports = null;
      }
    }
  });

  // node_modules/scheduler/cjs/scheduler.production.min.js
  var require_scheduler_production_min = __commonJS({
    "node_modules/scheduler/cjs/scheduler.production.min.js"(exports) {
      "use strict";
      function f(a, b) {
        var c = a.length;
        a.push(b);
        a: for (; 0 < c; ) {
          var d = c - 1 >>> 1, e = a[d];
          if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
          else break a;
        }
      }
      function h(a) {
        return 0 === a.length ? null : a[0];
      }
      function k(a) {
        if (0 === a.length) return null;
        var b = a[0], c = a.pop();
        if (c !== b) {
          a[0] = c;
          a: for (var d = 0, e = a.length, w = e >>> 1; d < w; ) {
            var m = 2 * (d + 1) - 1, C = a[m], n = m + 1, x = a[n];
            if (0 > g(C, c)) n < e && 0 > g(x, C) ? (a[d] = x, a[n] = c, d = n) : (a[d] = C, a[m] = c, d = m);
            else if (n < e && 0 > g(x, c)) a[d] = x, a[n] = c, d = n;
            else break a;
          }
        }
        return b;
      }
      function g(a, b) {
        var c = a.sortIndex - b.sortIndex;
        return 0 !== c ? c : a.id - b.id;
      }
      if ("object" === typeof performance && "function" === typeof performance.now) {
        l = performance;
        exports.unstable_now = function() {
          return l.now();
        };
      } else {
        p = Date, q = p.now();
        exports.unstable_now = function() {
          return p.now() - q;
        };
      }
      var l;
      var p;
      var q;
      var r = [];
      var t = [];
      var u = 1;
      var v = null;
      var y = 3;
      var z = false;
      var A = false;
      var B = false;
      var D = "function" === typeof setTimeout ? setTimeout : null;
      var E = "function" === typeof clearTimeout ? clearTimeout : null;
      var F = "undefined" !== typeof setImmediate ? setImmediate : null;
      "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function G(a) {
        for (var b = h(t); null !== b; ) {
          if (null === b.callback) k(t);
          else if (b.startTime <= a) k(t), b.sortIndex = b.expirationTime, f(r, b);
          else break;
          b = h(t);
        }
      }
      function H(a) {
        B = false;
        G(a);
        if (!A) if (null !== h(r)) A = true, I(J);
        else {
          var b = h(t);
          null !== b && K(H, b.startTime - a);
        }
      }
      function J(a, b) {
        A = false;
        B && (B = false, E(L), L = -1);
        z = true;
        var c = y;
        try {
          G(b);
          for (v = h(r); null !== v && (!(v.expirationTime > b) || a && !M()); ) {
            var d = v.callback;
            if ("function" === typeof d) {
              v.callback = null;
              y = v.priorityLevel;
              var e = d(v.expirationTime <= b);
              b = exports.unstable_now();
              "function" === typeof e ? v.callback = e : v === h(r) && k(r);
              G(b);
            } else k(r);
            v = h(r);
          }
          if (null !== v) var w = true;
          else {
            var m = h(t);
            null !== m && K(H, m.startTime - b);
            w = false;
          }
          return w;
        } finally {
          v = null, y = c, z = false;
        }
      }
      var N = false;
      var O = null;
      var L = -1;
      var P = 5;
      var Q = -1;
      function M() {
        return exports.unstable_now() - Q < P ? false : true;
      }
      function R() {
        if (null !== O) {
          var a = exports.unstable_now();
          Q = a;
          var b = true;
          try {
            b = O(true, a);
          } finally {
            b ? S() : (N = false, O = null);
          }
        } else N = false;
      }
      var S;
      if ("function" === typeof F) S = function() {
        F(R);
      };
      else if ("undefined" !== typeof MessageChannel) {
        T = new MessageChannel(), U = T.port2;
        T.port1.onmessage = R;
        S = function() {
          U.postMessage(null);
        };
      } else S = function() {
        D(R, 0);
      };
      var T;
      var U;
      function I(a) {
        O = a;
        N || (N = true, S());
      }
      function K(a, b) {
        L = D(function() {
          a(exports.unstable_now());
        }, b);
      }
      exports.unstable_IdlePriority = 5;
      exports.unstable_ImmediatePriority = 1;
      exports.unstable_LowPriority = 4;
      exports.unstable_NormalPriority = 3;
      exports.unstable_Profiling = null;
      exports.unstable_UserBlockingPriority = 2;
      exports.unstable_cancelCallback = function(a) {
        a.callback = null;
      };
      exports.unstable_continueExecution = function() {
        A || z || (A = true, I(J));
      };
      exports.unstable_forceFrameRate = function(a) {
        0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P = 0 < a ? Math.floor(1e3 / a) : 5;
      };
      exports.unstable_getCurrentPriorityLevel = function() {
        return y;
      };
      exports.unstable_getFirstCallbackNode = function() {
        return h(r);
      };
      exports.unstable_next = function(a) {
        switch (y) {
          case 1:
          case 2:
          case 3:
            var b = 3;
            break;
          default:
            b = y;
        }
        var c = y;
        y = b;
        try {
          return a();
        } finally {
          y = c;
        }
      };
      exports.unstable_pauseExecution = function() {
      };
      exports.unstable_requestPaint = function() {
      };
      exports.unstable_runWithPriority = function(a, b) {
        switch (a) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
          default:
            a = 3;
        }
        var c = y;
        y = a;
        try {
          return b();
        } finally {
          y = c;
        }
      };
      exports.unstable_scheduleCallback = function(a, b, c) {
        var d = exports.unstable_now();
        "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
        switch (a) {
          case 1:
            var e = -1;
            break;
          case 2:
            e = 250;
            break;
          case 5:
            e = 1073741823;
            break;
          case 4:
            e = 1e4;
            break;
          default:
            e = 5e3;
        }
        e = c + e;
        a = { id: u++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
        c > d ? (a.sortIndex = c, f(t, a), null === h(r) && a === h(t) && (B ? (E(L), L = -1) : B = true, K(H, c - d))) : (a.sortIndex = e, f(r, a), A || z || (A = true, I(J)));
        return a;
      };
      exports.unstable_shouldYield = M;
      exports.unstable_wrapCallback = function(a) {
        var b = y;
        return function() {
          var c = y;
          y = b;
          try {
            return a.apply(this, arguments);
          } finally {
            y = c;
          }
        };
      };
    }
  });

  // node_modules/scheduler/index.js
  var require_scheduler = __commonJS({
    "node_modules/scheduler/index.js"(exports, module) {
      "use strict";
      if (true) {
        module.exports = require_scheduler_production_min();
      } else {
        module.exports = null;
      }
    }
  });

  // node_modules/react-dom/cjs/react-dom.production.min.js
  var require_react_dom_production_min = __commonJS({
    "node_modules/react-dom/cjs/react-dom.production.min.js"(exports) {
      "use strict";
      var aa = require_react();
      var ca = require_scheduler();
      function p(a) {
        for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
        return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
      }
      var da = /* @__PURE__ */ new Set();
      var ea = {};
      function fa(a, b) {
        ha(a, b);
        ha(a + "Capture", b);
      }
      function ha(a, b) {
        ea[a] = b;
        for (a = 0; a < b.length; a++) da.add(b[a]);
      }
      var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement);
      var ja = Object.prototype.hasOwnProperty;
      var ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/;
      var la = {};
      var ma = {};
      function oa(a) {
        if (ja.call(ma, a)) return true;
        if (ja.call(la, a)) return false;
        if (ka.test(a)) return ma[a] = true;
        la[a] = true;
        return false;
      }
      function pa(a, b, c, d) {
        if (null !== c && 0 === c.type) return false;
        switch (typeof b) {
          case "function":
          case "symbol":
            return true;
          case "boolean":
            if (d) return false;
            if (null !== c) return !c.acceptsBooleans;
            a = a.toLowerCase().slice(0, 5);
            return "data-" !== a && "aria-" !== a;
          default:
            return false;
        }
      }
      function qa(a, b, c, d) {
        if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
        if (d) return false;
        if (null !== c) switch (c.type) {
          case 3:
            return !b;
          case 4:
            return false === b;
          case 5:
            return isNaN(b);
          case 6:
            return isNaN(b) || 1 > b;
        }
        return false;
      }
      function v(a, b, c, d, e, f, g) {
        this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
        this.attributeName = d;
        this.attributeNamespace = e;
        this.mustUseProperty = c;
        this.propertyName = a;
        this.type = b;
        this.sanitizeURL = f;
        this.removeEmptyString = g;
      }
      var z = {};
      "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
        z[a] = new v(a, 0, false, a, null, false, false);
      });
      [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
        var b = a[0];
        z[b] = new v(b, 1, false, a[1], null, false, false);
      });
      ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
        z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
      });
      ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
        z[a] = new v(a, 2, false, a, null, false, false);
      });
      "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
        z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
      });
      ["checked", "multiple", "muted", "selected"].forEach(function(a) {
        z[a] = new v(a, 3, true, a, null, false, false);
      });
      ["capture", "download"].forEach(function(a) {
        z[a] = new v(a, 4, false, a, null, false, false);
      });
      ["cols", "rows", "size", "span"].forEach(function(a) {
        z[a] = new v(a, 6, false, a, null, false, false);
      });
      ["rowSpan", "start"].forEach(function(a) {
        z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
      });
      var ra = /[\-:]([a-z])/g;
      function sa(a) {
        return a[1].toUpperCase();
      }
      "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
        var b = a.replace(
          ra,
          sa
        );
        z[b] = new v(b, 1, false, a, null, false, false);
      });
      "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
        var b = a.replace(ra, sa);
        z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
      });
      ["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
        var b = a.replace(ra, sa);
        z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
      });
      ["tabIndex", "crossOrigin"].forEach(function(a) {
        z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
      });
      z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
      ["src", "href", "action", "formAction"].forEach(function(a) {
        z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
      });
      function ta(a, b, c, d) {
        var e = z.hasOwnProperty(b) ? z[b] : null;
        if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
      }
      var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      var va = Symbol.for("react.element");
      var wa = Symbol.for("react.portal");
      var ya = Symbol.for("react.fragment");
      var za = Symbol.for("react.strict_mode");
      var Aa = Symbol.for("react.profiler");
      var Ba = Symbol.for("react.provider");
      var Ca = Symbol.for("react.context");
      var Da = Symbol.for("react.forward_ref");
      var Ea = Symbol.for("react.suspense");
      var Fa = Symbol.for("react.suspense_list");
      var Ga = Symbol.for("react.memo");
      var Ha = Symbol.for("react.lazy");
      Symbol.for("react.scope");
      Symbol.for("react.debug_trace_mode");
      var Ia = Symbol.for("react.offscreen");
      Symbol.for("react.legacy_hidden");
      Symbol.for("react.cache");
      Symbol.for("react.tracing_marker");
      var Ja = Symbol.iterator;
      function Ka(a) {
        if (null === a || "object" !== typeof a) return null;
        a = Ja && a[Ja] || a["@@iterator"];
        return "function" === typeof a ? a : null;
      }
      var A = Object.assign;
      var La;
      function Ma(a) {
        if (void 0 === La) try {
          throw Error();
        } catch (c) {
          var b = c.stack.trim().match(/\n( *(at )?)/);
          La = b && b[1] || "";
        }
        return "\n" + La + a;
      }
      var Na = false;
      function Oa(a, b) {
        if (!a || Na) return "";
        Na = true;
        var c = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        try {
          if (b) if (b = function() {
            throw Error();
          }, Object.defineProperty(b.prototype, "props", { set: function() {
            throw Error();
          } }), "object" === typeof Reflect && Reflect.construct) {
            try {
              Reflect.construct(b, []);
            } catch (l) {
              var d = l;
            }
            Reflect.construct(a, [], b);
          } else {
            try {
              b.call();
            } catch (l) {
              d = l;
            }
            a.call(b.prototype);
          }
          else {
            try {
              throw Error();
            } catch (l) {
              d = l;
            }
            a();
          }
        } catch (l) {
          if (l && d && "string" === typeof l.stack) {
            for (var e = l.stack.split("\n"), f = d.stack.split("\n"), g = e.length - 1, h = f.length - 1; 1 <= g && 0 <= h && e[g] !== f[h]; ) h--;
            for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f[h]) {
              if (1 !== g || 1 !== h) {
                do
                  if (g--, h--, 0 > h || e[g] !== f[h]) {
                    var k = "\n" + e[g].replace(" at new ", " at ");
                    a.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", a.displayName));
                    return k;
                  }
                while (1 <= g && 0 <= h);
              }
              break;
            }
          }
        } finally {
          Na = false, Error.prepareStackTrace = c;
        }
        return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
      }
      function Pa(a) {
        switch (a.tag) {
          case 5:
            return Ma(a.type);
          case 16:
            return Ma("Lazy");
          case 13:
            return Ma("Suspense");
          case 19:
            return Ma("SuspenseList");
          case 0:
          case 2:
          case 15:
            return a = Oa(a.type, false), a;
          case 11:
            return a = Oa(a.type.render, false), a;
          case 1:
            return a = Oa(a.type, true), a;
          default:
            return "";
        }
      }
      function Qa(a) {
        if (null == a) return null;
        if ("function" === typeof a) return a.displayName || a.name || null;
        if ("string" === typeof a) return a;
        switch (a) {
          case ya:
            return "Fragment";
          case wa:
            return "Portal";
          case Aa:
            return "Profiler";
          case za:
            return "StrictMode";
          case Ea:
            return "Suspense";
          case Fa:
            return "SuspenseList";
        }
        if ("object" === typeof a) switch (a.$$typeof) {
          case Ca:
            return (a.displayName || "Context") + ".Consumer";
          case Ba:
            return (a._context.displayName || "Context") + ".Provider";
          case Da:
            var b = a.render;
            a = a.displayName;
            a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
            return a;
          case Ga:
            return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
          case Ha:
            b = a._payload;
            a = a._init;
            try {
              return Qa(a(b));
            } catch (c) {
            }
        }
        return null;
      }
      function Ra(a) {
        var b = a.type;
        switch (a.tag) {
          case 24:
            return "Cache";
          case 9:
            return (b.displayName || "Context") + ".Consumer";
          case 10:
            return (b._context.displayName || "Context") + ".Provider";
          case 18:
            return "DehydratedFragment";
          case 11:
            return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
          case 7:
            return "Fragment";
          case 5:
            return b;
          case 4:
            return "Portal";
          case 3:
            return "Root";
          case 6:
            return "Text";
          case 16:
            return Qa(b);
          case 8:
            return b === za ? "StrictMode" : "Mode";
          case 22:
            return "Offscreen";
          case 12:
            return "Profiler";
          case 21:
            return "Scope";
          case 13:
            return "Suspense";
          case 19:
            return "SuspenseList";
          case 25:
            return "TracingMarker";
          case 1:
          case 0:
          case 17:
          case 2:
          case 14:
          case 15:
            if ("function" === typeof b) return b.displayName || b.name || null;
            if ("string" === typeof b) return b;
        }
        return null;
      }
      function Sa(a) {
        switch (typeof a) {
          case "boolean":
          case "number":
          case "string":
          case "undefined":
            return a;
          case "object":
            return a;
          default:
            return "";
        }
      }
      function Ta(a) {
        var b = a.type;
        return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
      }
      function Ua(a) {
        var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
        if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
          var e = c.get, f = c.set;
          Object.defineProperty(a, b, { configurable: true, get: function() {
            return e.call(this);
          }, set: function(a2) {
            d = "" + a2;
            f.call(this, a2);
          } });
          Object.defineProperty(a, b, { enumerable: c.enumerable });
          return { getValue: function() {
            return d;
          }, setValue: function(a2) {
            d = "" + a2;
          }, stopTracking: function() {
            a._valueTracker = null;
            delete a[b];
          } };
        }
      }
      function Va(a) {
        a._valueTracker || (a._valueTracker = Ua(a));
      }
      function Wa(a) {
        if (!a) return false;
        var b = a._valueTracker;
        if (!b) return true;
        var c = b.getValue();
        var d = "";
        a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
        a = d;
        return a !== c ? (b.setValue(a), true) : false;
      }
      function Xa(a) {
        a = a || ("undefined" !== typeof document ? document : void 0);
        if ("undefined" === typeof a) return null;
        try {
          return a.activeElement || a.body;
        } catch (b) {
          return a.body;
        }
      }
      function Ya(a, b) {
        var c = b.checked;
        return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
      }
      function Za(a, b) {
        var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
        c = Sa(null != b.value ? b.value : c);
        a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
      }
      function ab(a, b) {
        b = b.checked;
        null != b && ta(a, "checked", b, false);
      }
      function bb(a, b) {
        ab(a, b);
        var c = Sa(b.value), d = b.type;
        if (null != c) if ("number" === d) {
          if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
        } else a.value !== "" + c && (a.value = "" + c);
        else if ("submit" === d || "reset" === d) {
          a.removeAttribute("value");
          return;
        }
        b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
        null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
      }
      function db(a, b, c) {
        if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
          var d = b.type;
          if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
          b = "" + a._wrapperState.initialValue;
          c || b === a.value || (a.value = b);
          a.defaultValue = b;
        }
        c = a.name;
        "" !== c && (a.name = "");
        a.defaultChecked = !!a._wrapperState.initialChecked;
        "" !== c && (a.name = c);
      }
      function cb(a, b, c) {
        if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
      }
      var eb = Array.isArray;
      function fb(a, b, c, d) {
        a = a.options;
        if (b) {
          b = {};
          for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
          for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
        } else {
          c = "" + Sa(c);
          b = null;
          for (e = 0; e < a.length; e++) {
            if (a[e].value === c) {
              a[e].selected = true;
              d && (a[e].defaultSelected = true);
              return;
            }
            null !== b || a[e].disabled || (b = a[e]);
          }
          null !== b && (b.selected = true);
        }
      }
      function gb(a, b) {
        if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
        return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
      }
      function hb(a, b) {
        var c = b.value;
        if (null == c) {
          c = b.children;
          b = b.defaultValue;
          if (null != c) {
            if (null != b) throw Error(p(92));
            if (eb(c)) {
              if (1 < c.length) throw Error(p(93));
              c = c[0];
            }
            b = c;
          }
          null == b && (b = "");
          c = b;
        }
        a._wrapperState = { initialValue: Sa(c) };
      }
      function ib(a, b) {
        var c = Sa(b.value), d = Sa(b.defaultValue);
        null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
        null != d && (a.defaultValue = "" + d);
      }
      function jb(a) {
        var b = a.textContent;
        b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
      }
      function kb(a) {
        switch (a) {
          case "svg":
            return "http://www.w3.org/2000/svg";
          case "math":
            return "http://www.w3.org/1998/Math/MathML";
          default:
            return "http://www.w3.org/1999/xhtml";
        }
      }
      function lb(a, b) {
        return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
      }
      var mb;
      var nb = (function(a) {
        return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
          MSApp.execUnsafeLocalFunction(function() {
            return a(b, c, d, e);
          });
        } : a;
      })(function(a, b) {
        if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
        else {
          mb = mb || document.createElement("div");
          mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
          for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
          for (; b.firstChild; ) a.appendChild(b.firstChild);
        }
      });
      function ob(a, b) {
        if (b) {
          var c = a.firstChild;
          if (c && c === a.lastChild && 3 === c.nodeType) {
            c.nodeValue = b;
            return;
          }
        }
        a.textContent = b;
      }
      var pb = {
        animationIterationCount: true,
        aspectRatio: true,
        borderImageOutset: true,
        borderImageSlice: true,
        borderImageWidth: true,
        boxFlex: true,
        boxFlexGroup: true,
        boxOrdinalGroup: true,
        columnCount: true,
        columns: true,
        flex: true,
        flexGrow: true,
        flexPositive: true,
        flexShrink: true,
        flexNegative: true,
        flexOrder: true,
        gridArea: true,
        gridRow: true,
        gridRowEnd: true,
        gridRowSpan: true,
        gridRowStart: true,
        gridColumn: true,
        gridColumnEnd: true,
        gridColumnSpan: true,
        gridColumnStart: true,
        fontWeight: true,
        lineClamp: true,
        lineHeight: true,
        opacity: true,
        order: true,
        orphans: true,
        tabSize: true,
        widows: true,
        zIndex: true,
        zoom: true,
        fillOpacity: true,
        floodOpacity: true,
        stopOpacity: true,
        strokeDasharray: true,
        strokeDashoffset: true,
        strokeMiterlimit: true,
        strokeOpacity: true,
        strokeWidth: true
      };
      var qb = ["Webkit", "ms", "Moz", "O"];
      Object.keys(pb).forEach(function(a) {
        qb.forEach(function(b) {
          b = b + a.charAt(0).toUpperCase() + a.substring(1);
          pb[b] = pb[a];
        });
      });
      function rb(a, b, c) {
        return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
      }
      function sb(a, b) {
        a = a.style;
        for (var c in b) if (b.hasOwnProperty(c)) {
          var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
          "float" === c && (c = "cssFloat");
          d ? a.setProperty(c, e) : a[c] = e;
        }
      }
      var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
      function ub(a, b) {
        if (b) {
          if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
          if (null != b.dangerouslySetInnerHTML) {
            if (null != b.children) throw Error(p(60));
            if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
          }
          if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
        }
      }
      function vb(a, b) {
        if (-1 === a.indexOf("-")) return "string" === typeof b.is;
        switch (a) {
          case "annotation-xml":
          case "color-profile":
          case "font-face":
          case "font-face-src":
          case "font-face-uri":
          case "font-face-format":
          case "font-face-name":
          case "missing-glyph":
            return false;
          default:
            return true;
        }
      }
      var wb = null;
      function xb(a) {
        a = a.target || a.srcElement || window;
        a.correspondingUseElement && (a = a.correspondingUseElement);
        return 3 === a.nodeType ? a.parentNode : a;
      }
      var yb = null;
      var zb = null;
      var Ab = null;
      function Bb(a) {
        if (a = Cb(a)) {
          if ("function" !== typeof yb) throw Error(p(280));
          var b = a.stateNode;
          b && (b = Db(b), yb(a.stateNode, a.type, b));
        }
      }
      function Eb(a) {
        zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
      }
      function Fb() {
        if (zb) {
          var a = zb, b = Ab;
          Ab = zb = null;
          Bb(a);
          if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
        }
      }
      function Gb(a, b) {
        return a(b);
      }
      function Hb() {
      }
      var Ib = false;
      function Jb(a, b, c) {
        if (Ib) return a(b, c);
        Ib = true;
        try {
          return Gb(a, b, c);
        } finally {
          if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
        }
      }
      function Kb(a, b) {
        var c = a.stateNode;
        if (null === c) return null;
        var d = Db(c);
        if (null === d) return null;
        c = d[b];
        a: switch (b) {
          case "onClick":
          case "onClickCapture":
          case "onDoubleClick":
          case "onDoubleClickCapture":
          case "onMouseDown":
          case "onMouseDownCapture":
          case "onMouseMove":
          case "onMouseMoveCapture":
          case "onMouseUp":
          case "onMouseUpCapture":
          case "onMouseEnter":
            (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
            a = !d;
            break a;
          default:
            a = false;
        }
        if (a) return null;
        if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
        return c;
      }
      var Lb = false;
      if (ia) try {
        Mb = {};
        Object.defineProperty(Mb, "passive", { get: function() {
          Lb = true;
        } });
        window.addEventListener("test", Mb, Mb);
        window.removeEventListener("test", Mb, Mb);
      } catch (a) {
        Lb = false;
      }
      var Mb;
      function Nb(a, b, c, d, e, f, g, h, k) {
        var l = Array.prototype.slice.call(arguments, 3);
        try {
          b.apply(c, l);
        } catch (m) {
          this.onError(m);
        }
      }
      var Ob = false;
      var Pb = null;
      var Qb = false;
      var Rb = null;
      var Sb = { onError: function(a) {
        Ob = true;
        Pb = a;
      } };
      function Tb(a, b, c, d, e, f, g, h, k) {
        Ob = false;
        Pb = null;
        Nb.apply(Sb, arguments);
      }
      function Ub(a, b, c, d, e, f, g, h, k) {
        Tb.apply(this, arguments);
        if (Ob) {
          if (Ob) {
            var l = Pb;
            Ob = false;
            Pb = null;
          } else throw Error(p(198));
          Qb || (Qb = true, Rb = l);
        }
      }
      function Vb(a) {
        var b = a, c = a;
        if (a.alternate) for (; b.return; ) b = b.return;
        else {
          a = b;
          do
            b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
          while (a);
        }
        return 3 === b.tag ? c : null;
      }
      function Wb(a) {
        if (13 === a.tag) {
          var b = a.memoizedState;
          null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
          if (null !== b) return b.dehydrated;
        }
        return null;
      }
      function Xb(a) {
        if (Vb(a) !== a) throw Error(p(188));
      }
      function Yb(a) {
        var b = a.alternate;
        if (!b) {
          b = Vb(a);
          if (null === b) throw Error(p(188));
          return b !== a ? null : a;
        }
        for (var c = a, d = b; ; ) {
          var e = c.return;
          if (null === e) break;
          var f = e.alternate;
          if (null === f) {
            d = e.return;
            if (null !== d) {
              c = d;
              continue;
            }
            break;
          }
          if (e.child === f.child) {
            for (f = e.child; f; ) {
              if (f === c) return Xb(e), a;
              if (f === d) return Xb(e), b;
              f = f.sibling;
            }
            throw Error(p(188));
          }
          if (c.return !== d.return) c = e, d = f;
          else {
            for (var g = false, h = e.child; h; ) {
              if (h === c) {
                g = true;
                c = e;
                d = f;
                break;
              }
              if (h === d) {
                g = true;
                d = e;
                c = f;
                break;
              }
              h = h.sibling;
            }
            if (!g) {
              for (h = f.child; h; ) {
                if (h === c) {
                  g = true;
                  c = f;
                  d = e;
                  break;
                }
                if (h === d) {
                  g = true;
                  d = f;
                  c = e;
                  break;
                }
                h = h.sibling;
              }
              if (!g) throw Error(p(189));
            }
          }
          if (c.alternate !== d) throw Error(p(190));
        }
        if (3 !== c.tag) throw Error(p(188));
        return c.stateNode.current === c ? a : b;
      }
      function Zb(a) {
        a = Yb(a);
        return null !== a ? $b(a) : null;
      }
      function $b(a) {
        if (5 === a.tag || 6 === a.tag) return a;
        for (a = a.child; null !== a; ) {
          var b = $b(a);
          if (null !== b) return b;
          a = a.sibling;
        }
        return null;
      }
      var ac = ca.unstable_scheduleCallback;
      var bc = ca.unstable_cancelCallback;
      var cc = ca.unstable_shouldYield;
      var dc = ca.unstable_requestPaint;
      var B = ca.unstable_now;
      var ec = ca.unstable_getCurrentPriorityLevel;
      var fc = ca.unstable_ImmediatePriority;
      var gc = ca.unstable_UserBlockingPriority;
      var hc = ca.unstable_NormalPriority;
      var ic = ca.unstable_LowPriority;
      var jc = ca.unstable_IdlePriority;
      var kc = null;
      var lc = null;
      function mc(a) {
        if (lc && "function" === typeof lc.onCommitFiberRoot) try {
          lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
        } catch (b) {
        }
      }
      var oc = Math.clz32 ? Math.clz32 : nc;
      var pc = Math.log;
      var qc = Math.LN2;
      function nc(a) {
        a >>>= 0;
        return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
      }
      var rc = 64;
      var sc = 4194304;
      function tc(a) {
        switch (a & -a) {
          case 1:
            return 1;
          case 2:
            return 2;
          case 4:
            return 4;
          case 8:
            return 8;
          case 16:
            return 16;
          case 32:
            return 32;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
            return a & 4194240;
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            return a & 130023424;
          case 134217728:
            return 134217728;
          case 268435456:
            return 268435456;
          case 536870912:
            return 536870912;
          case 1073741824:
            return 1073741824;
          default:
            return a;
        }
      }
      function uc(a, b) {
        var c = a.pendingLanes;
        if (0 === c) return 0;
        var d = 0, e = a.suspendedLanes, f = a.pingedLanes, g = c & 268435455;
        if (0 !== g) {
          var h = g & ~e;
          0 !== h ? d = tc(h) : (f &= g, 0 !== f && (d = tc(f)));
        } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f && (d = tc(f));
        if (0 === d) return 0;
        if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f = b & -b, e >= f || 16 === e && 0 !== (f & 4194240))) return b;
        0 !== (d & 4) && (d |= c & 16);
        b = a.entangledLanes;
        if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
        return d;
      }
      function vc(a, b) {
        switch (a) {
          case 1:
          case 2:
          case 4:
            return b + 250;
          case 8:
          case 16:
          case 32:
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
            return b + 5e3;
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            return -1;
          case 134217728:
          case 268435456:
          case 536870912:
          case 1073741824:
            return -1;
          default:
            return -1;
        }
      }
      function wc(a, b) {
        for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f = a.pendingLanes; 0 < f; ) {
          var g = 31 - oc(f), h = 1 << g, k = e[g];
          if (-1 === k) {
            if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
          } else k <= b && (a.expiredLanes |= h);
          f &= ~h;
        }
      }
      function xc(a) {
        a = a.pendingLanes & -1073741825;
        return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
      }
      function yc() {
        var a = rc;
        rc <<= 1;
        0 === (rc & 4194240) && (rc = 64);
        return a;
      }
      function zc(a) {
        for (var b = [], c = 0; 31 > c; c++) b.push(a);
        return b;
      }
      function Ac(a, b, c) {
        a.pendingLanes |= b;
        536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
        a = a.eventTimes;
        b = 31 - oc(b);
        a[b] = c;
      }
      function Bc(a, b) {
        var c = a.pendingLanes & ~b;
        a.pendingLanes = b;
        a.suspendedLanes = 0;
        a.pingedLanes = 0;
        a.expiredLanes &= b;
        a.mutableReadLanes &= b;
        a.entangledLanes &= b;
        b = a.entanglements;
        var d = a.eventTimes;
        for (a = a.expirationTimes; 0 < c; ) {
          var e = 31 - oc(c), f = 1 << e;
          b[e] = 0;
          d[e] = -1;
          a[e] = -1;
          c &= ~f;
        }
      }
      function Cc(a, b) {
        var c = a.entangledLanes |= b;
        for (a = a.entanglements; c; ) {
          var d = 31 - oc(c), e = 1 << d;
          e & b | a[d] & b && (a[d] |= b);
          c &= ~e;
        }
      }
      var C = 0;
      function Dc(a) {
        a &= -a;
        return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
      }
      var Ec;
      var Fc;
      var Gc;
      var Hc;
      var Ic;
      var Jc = false;
      var Kc = [];
      var Lc = null;
      var Mc = null;
      var Nc = null;
      var Oc = /* @__PURE__ */ new Map();
      var Pc = /* @__PURE__ */ new Map();
      var Qc = [];
      var Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
      function Sc(a, b) {
        switch (a) {
          case "focusin":
          case "focusout":
            Lc = null;
            break;
          case "dragenter":
          case "dragleave":
            Mc = null;
            break;
          case "mouseover":
          case "mouseout":
            Nc = null;
            break;
          case "pointerover":
          case "pointerout":
            Oc.delete(b.pointerId);
            break;
          case "gotpointercapture":
          case "lostpointercapture":
            Pc.delete(b.pointerId);
        }
      }
      function Tc(a, b, c, d, e, f) {
        if (null === a || a.nativeEvent !== f) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
        a.eventSystemFlags |= d;
        b = a.targetContainers;
        null !== e && -1 === b.indexOf(e) && b.push(e);
        return a;
      }
      function Uc(a, b, c, d, e) {
        switch (b) {
          case "focusin":
            return Lc = Tc(Lc, a, b, c, d, e), true;
          case "dragenter":
            return Mc = Tc(Mc, a, b, c, d, e), true;
          case "mouseover":
            return Nc = Tc(Nc, a, b, c, d, e), true;
          case "pointerover":
            var f = e.pointerId;
            Oc.set(f, Tc(Oc.get(f) || null, a, b, c, d, e));
            return true;
          case "gotpointercapture":
            return f = e.pointerId, Pc.set(f, Tc(Pc.get(f) || null, a, b, c, d, e)), true;
        }
        return false;
      }
      function Vc(a) {
        var b = Wc(a.target);
        if (null !== b) {
          var c = Vb(b);
          if (null !== c) {
            if (b = c.tag, 13 === b) {
              if (b = Wb(c), null !== b) {
                a.blockedOn = b;
                Ic(a.priority, function() {
                  Gc(c);
                });
                return;
              }
            } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
              a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
              return;
            }
          }
        }
        a.blockedOn = null;
      }
      function Xc(a) {
        if (null !== a.blockedOn) return false;
        for (var b = a.targetContainers; 0 < b.length; ) {
          var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
          if (null === c) {
            c = a.nativeEvent;
            var d = new c.constructor(c.type, c);
            wb = d;
            c.target.dispatchEvent(d);
            wb = null;
          } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
          b.shift();
        }
        return true;
      }
      function Zc(a, b, c) {
        Xc(a) && c.delete(b);
      }
      function $c() {
        Jc = false;
        null !== Lc && Xc(Lc) && (Lc = null);
        null !== Mc && Xc(Mc) && (Mc = null);
        null !== Nc && Xc(Nc) && (Nc = null);
        Oc.forEach(Zc);
        Pc.forEach(Zc);
      }
      function ad(a, b) {
        a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
      }
      function bd(a) {
        function b(b2) {
          return ad(b2, a);
        }
        if (0 < Kc.length) {
          ad(Kc[0], a);
          for (var c = 1; c < Kc.length; c++) {
            var d = Kc[c];
            d.blockedOn === a && (d.blockedOn = null);
          }
        }
        null !== Lc && ad(Lc, a);
        null !== Mc && ad(Mc, a);
        null !== Nc && ad(Nc, a);
        Oc.forEach(b);
        Pc.forEach(b);
        for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
        for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
      }
      var cd = ua.ReactCurrentBatchConfig;
      var dd = true;
      function ed(a, b, c, d) {
        var e = C, f = cd.transition;
        cd.transition = null;
        try {
          C = 1, fd(a, b, c, d);
        } finally {
          C = e, cd.transition = f;
        }
      }
      function gd(a, b, c, d) {
        var e = C, f = cd.transition;
        cd.transition = null;
        try {
          C = 4, fd(a, b, c, d);
        } finally {
          C = e, cd.transition = f;
        }
      }
      function fd(a, b, c, d) {
        if (dd) {
          var e = Yc(a, b, c, d);
          if (null === e) hd(a, b, d, id, c), Sc(a, d);
          else if (Uc(e, a, b, c, d)) d.stopPropagation();
          else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
            for (; null !== e; ) {
              var f = Cb(e);
              null !== f && Ec(f);
              f = Yc(a, b, c, d);
              null === f && hd(a, b, d, id, c);
              if (f === e) break;
              e = f;
            }
            null !== e && d.stopPropagation();
          } else hd(a, b, d, null, c);
        }
      }
      var id = null;
      function Yc(a, b, c, d) {
        id = null;
        a = xb(d);
        a = Wc(a);
        if (null !== a) if (b = Vb(a), null === b) a = null;
        else if (c = b.tag, 13 === c) {
          a = Wb(b);
          if (null !== a) return a;
          a = null;
        } else if (3 === c) {
          if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
          a = null;
        } else b !== a && (a = null);
        id = a;
        return null;
      }
      function jd(a) {
        switch (a) {
          case "cancel":
          case "click":
          case "close":
          case "contextmenu":
          case "copy":
          case "cut":
          case "auxclick":
          case "dblclick":
          case "dragend":
          case "dragstart":
          case "drop":
          case "focusin":
          case "focusout":
          case "input":
          case "invalid":
          case "keydown":
          case "keypress":
          case "keyup":
          case "mousedown":
          case "mouseup":
          case "paste":
          case "pause":
          case "play":
          case "pointercancel":
          case "pointerdown":
          case "pointerup":
          case "ratechange":
          case "reset":
          case "resize":
          case "seeked":
          case "submit":
          case "touchcancel":
          case "touchend":
          case "touchstart":
          case "volumechange":
          case "change":
          case "selectionchange":
          case "textInput":
          case "compositionstart":
          case "compositionend":
          case "compositionupdate":
          case "beforeblur":
          case "afterblur":
          case "beforeinput":
          case "blur":
          case "fullscreenchange":
          case "focus":
          case "hashchange":
          case "popstate":
          case "select":
          case "selectstart":
            return 1;
          case "drag":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "mousemove":
          case "mouseout":
          case "mouseover":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "scroll":
          case "toggle":
          case "touchmove":
          case "wheel":
          case "mouseenter":
          case "mouseleave":
          case "pointerenter":
          case "pointerleave":
            return 4;
          case "message":
            switch (ec()) {
              case fc:
                return 1;
              case gc:
                return 4;
              case hc:
              case ic:
                return 16;
              case jc:
                return 536870912;
              default:
                return 16;
            }
          default:
            return 16;
        }
      }
      var kd = null;
      var ld = null;
      var md = null;
      function nd() {
        if (md) return md;
        var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f = e.length;
        for (a = 0; a < c && b[a] === e[a]; a++) ;
        var g = c - a;
        for (d = 1; d <= g && b[c - d] === e[f - d]; d++) ;
        return md = e.slice(a, 1 < d ? 1 - d : void 0);
      }
      function od(a) {
        var b = a.keyCode;
        "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
        10 === a && (a = 13);
        return 32 <= a || 13 === a ? a : 0;
      }
      function pd() {
        return true;
      }
      function qd() {
        return false;
      }
      function rd(a) {
        function b(b2, d, e, f, g) {
          this._reactName = b2;
          this._targetInst = e;
          this.type = d;
          this.nativeEvent = f;
          this.target = g;
          this.currentTarget = null;
          for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f) : f[c]);
          this.isDefaultPrevented = (null != f.defaultPrevented ? f.defaultPrevented : false === f.returnValue) ? pd : qd;
          this.isPropagationStopped = qd;
          return this;
        }
        A(b.prototype, { preventDefault: function() {
          this.defaultPrevented = true;
          var a2 = this.nativeEvent;
          a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
        }, stopPropagation: function() {
          var a2 = this.nativeEvent;
          a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
        }, persist: function() {
        }, isPersistent: pd });
        return b;
      }
      var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
        return a.timeStamp || Date.now();
      }, defaultPrevented: 0, isTrusted: 0 };
      var td = rd(sd);
      var ud = A({}, sd, { view: 0, detail: 0 });
      var vd = rd(ud);
      var wd;
      var xd;
      var yd;
      var Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
        return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
      }, movementX: function(a) {
        if ("movementX" in a) return a.movementX;
        a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
        return wd;
      }, movementY: function(a) {
        return "movementY" in a ? a.movementY : xd;
      } });
      var Bd = rd(Ad);
      var Cd = A({}, Ad, { dataTransfer: 0 });
      var Dd = rd(Cd);
      var Ed = A({}, ud, { relatedTarget: 0 });
      var Fd = rd(Ed);
      var Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 });
      var Hd = rd(Gd);
      var Id = A({}, sd, { clipboardData: function(a) {
        return "clipboardData" in a ? a.clipboardData : window.clipboardData;
      } });
      var Jd = rd(Id);
      var Kd = A({}, sd, { data: 0 });
      var Ld = rd(Kd);
      var Md = {
        Esc: "Escape",
        Spacebar: " ",
        Left: "ArrowLeft",
        Up: "ArrowUp",
        Right: "ArrowRight",
        Down: "ArrowDown",
        Del: "Delete",
        Win: "OS",
        Menu: "ContextMenu",
        Apps: "ContextMenu",
        Scroll: "ScrollLock",
        MozPrintableKey: "Unidentified"
      };
      var Nd = {
        8: "Backspace",
        9: "Tab",
        12: "Clear",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Escape",
        32: " ",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        45: "Insert",
        46: "Delete",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        145: "ScrollLock",
        224: "Meta"
      };
      var Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
      function Pd(a) {
        var b = this.nativeEvent;
        return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
      }
      function zd() {
        return Pd;
      }
      var Qd = A({}, ud, { key: function(a) {
        if (a.key) {
          var b = Md[a.key] || a.key;
          if ("Unidentified" !== b) return b;
        }
        return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
      }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
        return "keypress" === a.type ? od(a) : 0;
      }, keyCode: function(a) {
        return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
      }, which: function(a) {
        return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
      } });
      var Rd = rd(Qd);
      var Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 });
      var Td = rd(Sd);
      var Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd });
      var Vd = rd(Ud);
      var Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 });
      var Xd = rd(Wd);
      var Yd = A({}, Ad, {
        deltaX: function(a) {
          return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
        },
        deltaY: function(a) {
          return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
        },
        deltaZ: 0,
        deltaMode: 0
      });
      var Zd = rd(Yd);
      var $d = [9, 13, 27, 32];
      var ae = ia && "CompositionEvent" in window;
      var be = null;
      ia && "documentMode" in document && (be = document.documentMode);
      var ce = ia && "TextEvent" in window && !be;
      var de = ia && (!ae || be && 8 < be && 11 >= be);
      var ee = String.fromCharCode(32);
      var fe = false;
      function ge(a, b) {
        switch (a) {
          case "keyup":
            return -1 !== $d.indexOf(b.keyCode);
          case "keydown":
            return 229 !== b.keyCode;
          case "keypress":
          case "mousedown":
          case "focusout":
            return true;
          default:
            return false;
        }
      }
      function he(a) {
        a = a.detail;
        return "object" === typeof a && "data" in a ? a.data : null;
      }
      var ie = false;
      function je(a, b) {
        switch (a) {
          case "compositionend":
            return he(b);
          case "keypress":
            if (32 !== b.which) return null;
            fe = true;
            return ee;
          case "textInput":
            return a = b.data, a === ee && fe ? null : a;
          default:
            return null;
        }
      }
      function ke(a, b) {
        if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
        switch (a) {
          case "paste":
            return null;
          case "keypress":
            if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
              if (b.char && 1 < b.char.length) return b.char;
              if (b.which) return String.fromCharCode(b.which);
            }
            return null;
          case "compositionend":
            return de && "ko" !== b.locale ? null : b.data;
          default:
            return null;
        }
      }
      var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
      function me(a) {
        var b = a && a.nodeName && a.nodeName.toLowerCase();
        return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
      }
      function ne(a, b, c, d) {
        Eb(d);
        b = oe(b, "onChange");
        0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
      }
      var pe = null;
      var qe = null;
      function re(a) {
        se(a, 0);
      }
      function te(a) {
        var b = ue(a);
        if (Wa(b)) return a;
      }
      function ve(a, b) {
        if ("change" === a) return b;
      }
      var we = false;
      if (ia) {
        if (ia) {
          ye = "oninput" in document;
          if (!ye) {
            ze = document.createElement("div");
            ze.setAttribute("oninput", "return;");
            ye = "function" === typeof ze.oninput;
          }
          xe = ye;
        } else xe = false;
        we = xe && (!document.documentMode || 9 < document.documentMode);
      }
      var xe;
      var ye;
      var ze;
      function Ae() {
        pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
      }
      function Be(a) {
        if ("value" === a.propertyName && te(qe)) {
          var b = [];
          ne(b, qe, a, xb(a));
          Jb(re, b);
        }
      }
      function Ce(a, b, c) {
        "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
      }
      function De(a) {
        if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
      }
      function Ee(a, b) {
        if ("click" === a) return te(b);
      }
      function Fe(a, b) {
        if ("input" === a || "change" === a) return te(b);
      }
      function Ge(a, b) {
        return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
      }
      var He = "function" === typeof Object.is ? Object.is : Ge;
      function Ie(a, b) {
        if (He(a, b)) return true;
        if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
        var c = Object.keys(a), d = Object.keys(b);
        if (c.length !== d.length) return false;
        for (d = 0; d < c.length; d++) {
          var e = c[d];
          if (!ja.call(b, e) || !He(a[e], b[e])) return false;
        }
        return true;
      }
      function Je(a) {
        for (; a && a.firstChild; ) a = a.firstChild;
        return a;
      }
      function Ke(a, b) {
        var c = Je(a);
        a = 0;
        for (var d; c; ) {
          if (3 === c.nodeType) {
            d = a + c.textContent.length;
            if (a <= b && d >= b) return { node: c, offset: b - a };
            a = d;
          }
          a: {
            for (; c; ) {
              if (c.nextSibling) {
                c = c.nextSibling;
                break a;
              }
              c = c.parentNode;
            }
            c = void 0;
          }
          c = Je(c);
        }
      }
      function Le(a, b) {
        return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
      }
      function Me() {
        for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
          try {
            var c = "string" === typeof b.contentWindow.location.href;
          } catch (d) {
            c = false;
          }
          if (c) a = b.contentWindow;
          else break;
          b = Xa(a.document);
        }
        return b;
      }
      function Ne(a) {
        var b = a && a.nodeName && a.nodeName.toLowerCase();
        return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
      }
      function Oe(a) {
        var b = Me(), c = a.focusedElem, d = a.selectionRange;
        if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
          if (null !== d && Ne(c)) {
            if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
            else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
              a = a.getSelection();
              var e = c.textContent.length, f = Math.min(d.start, e);
              d = void 0 === d.end ? f : Math.min(d.end, e);
              !a.extend && f > d && (e = d, d = f, f = e);
              e = Ke(c, f);
              var g = Ke(
                c,
                d
              );
              e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
            }
          }
          b = [];
          for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
          "function" === typeof c.focus && c.focus();
          for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
        }
      }
      var Pe = ia && "documentMode" in document && 11 >= document.documentMode;
      var Qe = null;
      var Re = null;
      var Se = null;
      var Te = false;
      function Ue(a, b, c) {
        var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
        Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
      }
      function Ve(a, b) {
        var c = {};
        c[a.toLowerCase()] = b.toLowerCase();
        c["Webkit" + a] = "webkit" + b;
        c["Moz" + a] = "moz" + b;
        return c;
      }
      var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") };
      var Xe = {};
      var Ye = {};
      ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
      function Ze(a) {
        if (Xe[a]) return Xe[a];
        if (!We[a]) return a;
        var b = We[a], c;
        for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
        return a;
      }
      var $e = Ze("animationend");
      var af = Ze("animationiteration");
      var bf = Ze("animationstart");
      var cf = Ze("transitionend");
      var df = /* @__PURE__ */ new Map();
      var ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
      function ff(a, b) {
        df.set(a, b);
        fa(b, [a]);
      }
      for (gf = 0; gf < ef.length; gf++) {
        hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
        ff(jf, "on" + kf);
      }
      var hf;
      var jf;
      var kf;
      var gf;
      ff($e, "onAnimationEnd");
      ff(af, "onAnimationIteration");
      ff(bf, "onAnimationStart");
      ff("dblclick", "onDoubleClick");
      ff("focusin", "onFocus");
      ff("focusout", "onBlur");
      ff(cf, "onTransitionEnd");
      ha("onMouseEnter", ["mouseout", "mouseover"]);
      ha("onMouseLeave", ["mouseout", "mouseover"]);
      ha("onPointerEnter", ["pointerout", "pointerover"]);
      ha("onPointerLeave", ["pointerout", "pointerover"]);
      fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
      fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
      fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
      fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
      fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
      fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
      var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" ");
      var mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
      function nf(a, b, c) {
        var d = a.type || "unknown-event";
        a.currentTarget = c;
        Ub(d, b, void 0, a);
        a.currentTarget = null;
      }
      function se(a, b) {
        b = 0 !== (b & 4);
        for (var c = 0; c < a.length; c++) {
          var d = a[c], e = d.event;
          d = d.listeners;
          a: {
            var f = void 0;
            if (b) for (var g = d.length - 1; 0 <= g; g--) {
              var h = d[g], k = h.instance, l = h.currentTarget;
              h = h.listener;
              if (k !== f && e.isPropagationStopped()) break a;
              nf(e, h, l);
              f = k;
            }
            else for (g = 0; g < d.length; g++) {
              h = d[g];
              k = h.instance;
              l = h.currentTarget;
              h = h.listener;
              if (k !== f && e.isPropagationStopped()) break a;
              nf(e, h, l);
              f = k;
            }
          }
        }
        if (Qb) throw a = Rb, Qb = false, Rb = null, a;
      }
      function D(a, b) {
        var c = b[of];
        void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
        var d = a + "__bubble";
        c.has(d) || (pf(b, a, 2, false), c.add(d));
      }
      function qf(a, b, c) {
        var d = 0;
        b && (d |= 4);
        pf(c, a, d, b);
      }
      var rf = "_reactListening" + Math.random().toString(36).slice(2);
      function sf(a) {
        if (!a[rf]) {
          a[rf] = true;
          da.forEach(function(b2) {
            "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
          });
          var b = 9 === a.nodeType ? a : a.ownerDocument;
          null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
        }
      }
      function pf(a, b, c, d) {
        switch (jd(b)) {
          case 1:
            var e = ed;
            break;
          case 4:
            e = gd;
            break;
          default:
            e = fd;
        }
        c = e.bind(null, b, c, a);
        e = void 0;
        !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
        d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
      }
      function hd(a, b, c, d, e) {
        var f = d;
        if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
          if (null === d) return;
          var g = d.tag;
          if (3 === g || 4 === g) {
            var h = d.stateNode.containerInfo;
            if (h === e || 8 === h.nodeType && h.parentNode === e) break;
            if (4 === g) for (g = d.return; null !== g; ) {
              var k = g.tag;
              if (3 === k || 4 === k) {
                if (k = g.stateNode.containerInfo, k === e || 8 === k.nodeType && k.parentNode === e) return;
              }
              g = g.return;
            }
            for (; null !== h; ) {
              g = Wc(h);
              if (null === g) return;
              k = g.tag;
              if (5 === k || 6 === k) {
                d = f = g;
                continue a;
              }
              h = h.parentNode;
            }
          }
          d = d.return;
        }
        Jb(function() {
          var d2 = f, e2 = xb(c), g2 = [];
          a: {
            var h2 = df.get(a);
            if (void 0 !== h2) {
              var k2 = td, n = a;
              switch (a) {
                case "keypress":
                  if (0 === od(c)) break a;
                case "keydown":
                case "keyup":
                  k2 = Rd;
                  break;
                case "focusin":
                  n = "focus";
                  k2 = Fd;
                  break;
                case "focusout":
                  n = "blur";
                  k2 = Fd;
                  break;
                case "beforeblur":
                case "afterblur":
                  k2 = Fd;
                  break;
                case "click":
                  if (2 === c.button) break a;
                case "auxclick":
                case "dblclick":
                case "mousedown":
                case "mousemove":
                case "mouseup":
                case "mouseout":
                case "mouseover":
                case "contextmenu":
                  k2 = Bd;
                  break;
                case "drag":
                case "dragend":
                case "dragenter":
                case "dragexit":
                case "dragleave":
                case "dragover":
                case "dragstart":
                case "drop":
                  k2 = Dd;
                  break;
                case "touchcancel":
                case "touchend":
                case "touchmove":
                case "touchstart":
                  k2 = Vd;
                  break;
                case $e:
                case af:
                case bf:
                  k2 = Hd;
                  break;
                case cf:
                  k2 = Xd;
                  break;
                case "scroll":
                  k2 = vd;
                  break;
                case "wheel":
                  k2 = Zd;
                  break;
                case "copy":
                case "cut":
                case "paste":
                  k2 = Jd;
                  break;
                case "gotpointercapture":
                case "lostpointercapture":
                case "pointercancel":
                case "pointerdown":
                case "pointermove":
                case "pointerout":
                case "pointerover":
                case "pointerup":
                  k2 = Td;
              }
              var t = 0 !== (b & 4), J = !t && "scroll" === a, x = t ? null !== h2 ? h2 + "Capture" : null : h2;
              t = [];
              for (var w = d2, u; null !== w; ) {
                u = w;
                var F = u.stateNode;
                5 === u.tag && null !== F && (u = F, null !== x && (F = Kb(w, x), null != F && t.push(tf(w, F, u))));
                if (J) break;
                w = w.return;
              }
              0 < t.length && (h2 = new k2(h2, n, null, c, e2), g2.push({ event: h2, listeners: t }));
            }
          }
          if (0 === (b & 7)) {
            a: {
              h2 = "mouseover" === a || "pointerover" === a;
              k2 = "mouseout" === a || "pointerout" === a;
              if (h2 && c !== wb && (n = c.relatedTarget || c.fromElement) && (Wc(n) || n[uf])) break a;
              if (k2 || h2) {
                h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
                if (k2) {
                  if (n = c.relatedTarget || c.toElement, k2 = d2, n = n ? Wc(n) : null, null !== n && (J = Vb(n), n !== J || 5 !== n.tag && 6 !== n.tag)) n = null;
                } else k2 = null, n = d2;
                if (k2 !== n) {
                  t = Bd;
                  F = "onMouseLeave";
                  x = "onMouseEnter";
                  w = "mouse";
                  if ("pointerout" === a || "pointerover" === a) t = Td, F = "onPointerLeave", x = "onPointerEnter", w = "pointer";
                  J = null == k2 ? h2 : ue(k2);
                  u = null == n ? h2 : ue(n);
                  h2 = new t(F, w + "leave", k2, c, e2);
                  h2.target = J;
                  h2.relatedTarget = u;
                  F = null;
                  Wc(e2) === d2 && (t = new t(x, w + "enter", n, c, e2), t.target = u, t.relatedTarget = J, F = t);
                  J = F;
                  if (k2 && n) b: {
                    t = k2;
                    x = n;
                    w = 0;
                    for (u = t; u; u = vf(u)) w++;
                    u = 0;
                    for (F = x; F; F = vf(F)) u++;
                    for (; 0 < w - u; ) t = vf(t), w--;
                    for (; 0 < u - w; ) x = vf(x), u--;
                    for (; w--; ) {
                      if (t === x || null !== x && t === x.alternate) break b;
                      t = vf(t);
                      x = vf(x);
                    }
                    t = null;
                  }
                  else t = null;
                  null !== k2 && wf(g2, h2, k2, t, false);
                  null !== n && null !== J && wf(g2, J, n, t, true);
                }
              }
            }
            a: {
              h2 = d2 ? ue(d2) : window;
              k2 = h2.nodeName && h2.nodeName.toLowerCase();
              if ("select" === k2 || "input" === k2 && "file" === h2.type) var na = ve;
              else if (me(h2)) if (we) na = Fe;
              else {
                na = De;
                var xa = Ce;
              }
              else (k2 = h2.nodeName) && "input" === k2.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
              if (na && (na = na(a, d2))) {
                ne(g2, na, c, e2);
                break a;
              }
              xa && xa(a, h2, d2);
              "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
            }
            xa = d2 ? ue(d2) : window;
            switch (a) {
              case "focusin":
                if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
                break;
              case "focusout":
                Se = Re = Qe = null;
                break;
              case "mousedown":
                Te = true;
                break;
              case "contextmenu":
              case "mouseup":
              case "dragend":
                Te = false;
                Ue(g2, c, e2);
                break;
              case "selectionchange":
                if (Pe) break;
              case "keydown":
              case "keyup":
                Ue(g2, c, e2);
            }
            var $a;
            if (ae) b: {
              switch (a) {
                case "compositionstart":
                  var ba = "onCompositionStart";
                  break b;
                case "compositionend":
                  ba = "onCompositionEnd";
                  break b;
                case "compositionupdate":
                  ba = "onCompositionUpdate";
                  break b;
              }
              ba = void 0;
            }
            else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
            ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
            if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
          }
          se(g2, b);
        });
      }
      function tf(a, b, c) {
        return { instance: a, listener: b, currentTarget: c };
      }
      function oe(a, b) {
        for (var c = b + "Capture", d = []; null !== a; ) {
          var e = a, f = e.stateNode;
          5 === e.tag && null !== f && (e = f, f = Kb(a, c), null != f && d.unshift(tf(a, f, e)), f = Kb(a, b), null != f && d.push(tf(a, f, e)));
          a = a.return;
        }
        return d;
      }
      function vf(a) {
        if (null === a) return null;
        do
          a = a.return;
        while (a && 5 !== a.tag);
        return a ? a : null;
      }
      function wf(a, b, c, d, e) {
        for (var f = b._reactName, g = []; null !== c && c !== d; ) {
          var h = c, k = h.alternate, l = h.stateNode;
          if (null !== k && k === d) break;
          5 === h.tag && null !== l && (h = l, e ? (k = Kb(c, f), null != k && g.unshift(tf(c, k, h))) : e || (k = Kb(c, f), null != k && g.push(tf(c, k, h))));
          c = c.return;
        }
        0 !== g.length && a.push({ event: b, listeners: g });
      }
      var xf = /\r\n?/g;
      var yf = /\u0000|\uFFFD/g;
      function zf(a) {
        return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
      }
      function Af(a, b, c) {
        b = zf(b);
        if (zf(a) !== b && c) throw Error(p(425));
      }
      function Bf() {
      }
      var Cf = null;
      var Df = null;
      function Ef(a, b) {
        return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
      }
      var Ff = "function" === typeof setTimeout ? setTimeout : void 0;
      var Gf = "function" === typeof clearTimeout ? clearTimeout : void 0;
      var Hf = "function" === typeof Promise ? Promise : void 0;
      var Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
        return Hf.resolve(null).then(a).catch(If);
      } : Ff;
      function If(a) {
        setTimeout(function() {
          throw a;
        });
      }
      function Kf(a, b) {
        var c = b, d = 0;
        do {
          var e = c.nextSibling;
          a.removeChild(c);
          if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
            if (0 === d) {
              a.removeChild(e);
              bd(b);
              return;
            }
            d--;
          } else "$" !== c && "$?" !== c && "$!" !== c || d++;
          c = e;
        } while (c);
        bd(b);
      }
      function Lf(a) {
        for (; null != a; a = a.nextSibling) {
          var b = a.nodeType;
          if (1 === b || 3 === b) break;
          if (8 === b) {
            b = a.data;
            if ("$" === b || "$!" === b || "$?" === b) break;
            if ("/$" === b) return null;
          }
        }
        return a;
      }
      function Mf(a) {
        a = a.previousSibling;
        for (var b = 0; a; ) {
          if (8 === a.nodeType) {
            var c = a.data;
            if ("$" === c || "$!" === c || "$?" === c) {
              if (0 === b) return a;
              b--;
            } else "/$" === c && b++;
          }
          a = a.previousSibling;
        }
        return null;
      }
      var Nf = Math.random().toString(36).slice(2);
      var Of = "__reactFiber$" + Nf;
      var Pf = "__reactProps$" + Nf;
      var uf = "__reactContainer$" + Nf;
      var of = "__reactEvents$" + Nf;
      var Qf = "__reactListeners$" + Nf;
      var Rf = "__reactHandles$" + Nf;
      function Wc(a) {
        var b = a[Of];
        if (b) return b;
        for (var c = a.parentNode; c; ) {
          if (b = c[uf] || c[Of]) {
            c = b.alternate;
            if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
              if (c = a[Of]) return c;
              a = Mf(a);
            }
            return b;
          }
          a = c;
          c = a.parentNode;
        }
        return null;
      }
      function Cb(a) {
        a = a[Of] || a[uf];
        return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
      }
      function ue(a) {
        if (5 === a.tag || 6 === a.tag) return a.stateNode;
        throw Error(p(33));
      }
      function Db(a) {
        return a[Pf] || null;
      }
      var Sf = [];
      var Tf = -1;
      function Uf(a) {
        return { current: a };
      }
      function E(a) {
        0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
      }
      function G(a, b) {
        Tf++;
        Sf[Tf] = a.current;
        a.current = b;
      }
      var Vf = {};
      var H = Uf(Vf);
      var Wf = Uf(false);
      var Xf = Vf;
      function Yf(a, b) {
        var c = a.type.contextTypes;
        if (!c) return Vf;
        var d = a.stateNode;
        if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
        var e = {}, f;
        for (f in c) e[f] = b[f];
        d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
        return e;
      }
      function Zf(a) {
        a = a.childContextTypes;
        return null !== a && void 0 !== a;
      }
      function $f() {
        E(Wf);
        E(H);
      }
      function ag(a, b, c) {
        if (H.current !== Vf) throw Error(p(168));
        G(H, b);
        G(Wf, c);
      }
      function bg(a, b, c) {
        var d = a.stateNode;
        b = b.childContextTypes;
        if ("function" !== typeof d.getChildContext) return c;
        d = d.getChildContext();
        for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
        return A({}, c, d);
      }
      function cg(a) {
        a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
        Xf = H.current;
        G(H, a);
        G(Wf, Wf.current);
        return true;
      }
      function dg(a, b, c) {
        var d = a.stateNode;
        if (!d) throw Error(p(169));
        c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
        G(Wf, c);
      }
      var eg = null;
      var fg = false;
      var gg = false;
      function hg(a) {
        null === eg ? eg = [a] : eg.push(a);
      }
      function ig(a) {
        fg = true;
        hg(a);
      }
      function jg() {
        if (!gg && null !== eg) {
          gg = true;
          var a = 0, b = C;
          try {
            var c = eg;
            for (C = 1; a < c.length; a++) {
              var d = c[a];
              do
                d = d(true);
              while (null !== d);
            }
            eg = null;
            fg = false;
          } catch (e) {
            throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
          } finally {
            C = b, gg = false;
          }
        }
        return null;
      }
      var kg = [];
      var lg = 0;
      var mg = null;
      var ng = 0;
      var og = [];
      var pg = 0;
      var qg = null;
      var rg = 1;
      var sg = "";
      function tg(a, b) {
        kg[lg++] = ng;
        kg[lg++] = mg;
        mg = a;
        ng = b;
      }
      function ug(a, b, c) {
        og[pg++] = rg;
        og[pg++] = sg;
        og[pg++] = qg;
        qg = a;
        var d = rg;
        a = sg;
        var e = 32 - oc(d) - 1;
        d &= ~(1 << e);
        c += 1;
        var f = 32 - oc(b) + e;
        if (30 < f) {
          var g = e - e % 5;
          f = (d & (1 << g) - 1).toString(32);
          d >>= g;
          e -= g;
          rg = 1 << 32 - oc(b) + e | c << e | d;
          sg = f + a;
        } else rg = 1 << f | c << e | d, sg = a;
      }
      function vg(a) {
        null !== a.return && (tg(a, 1), ug(a, 1, 0));
      }
      function wg(a) {
        for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
        for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
      }
      var xg = null;
      var yg = null;
      var I = false;
      var zg = null;
      function Ag(a, b) {
        var c = Bg(5, null, null, 0);
        c.elementType = "DELETED";
        c.stateNode = b;
        c.return = a;
        b = a.deletions;
        null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
      }
      function Cg(a, b) {
        switch (a.tag) {
          case 5:
            var c = a.type;
            b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
            return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
          case 6:
            return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
          case 13:
            return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
          default:
            return false;
        }
      }
      function Dg(a) {
        return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
      }
      function Eg(a) {
        if (I) {
          var b = yg;
          if (b) {
            var c = b;
            if (!Cg(a, b)) {
              if (Dg(a)) throw Error(p(418));
              b = Lf(c.nextSibling);
              var d = xg;
              b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
            }
          } else {
            if (Dg(a)) throw Error(p(418));
            a.flags = a.flags & -4097 | 2;
            I = false;
            xg = a;
          }
        }
      }
      function Fg(a) {
        for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
        xg = a;
      }
      function Gg(a) {
        if (a !== xg) return false;
        if (!I) return Fg(a), I = true, false;
        var b;
        (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
        if (b && (b = yg)) {
          if (Dg(a)) throw Hg(), Error(p(418));
          for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
        }
        Fg(a);
        if (13 === a.tag) {
          a = a.memoizedState;
          a = null !== a ? a.dehydrated : null;
          if (!a) throw Error(p(317));
          a: {
            a = a.nextSibling;
            for (b = 0; a; ) {
              if (8 === a.nodeType) {
                var c = a.data;
                if ("/$" === c) {
                  if (0 === b) {
                    yg = Lf(a.nextSibling);
                    break a;
                  }
                  b--;
                } else "$" !== c && "$!" !== c && "$?" !== c || b++;
              }
              a = a.nextSibling;
            }
            yg = null;
          }
        } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
        return true;
      }
      function Hg() {
        for (var a = yg; a; ) a = Lf(a.nextSibling);
      }
      function Ig() {
        yg = xg = null;
        I = false;
      }
      function Jg(a) {
        null === zg ? zg = [a] : zg.push(a);
      }
      var Kg = ua.ReactCurrentBatchConfig;
      function Lg(a, b, c) {
        a = c.ref;
        if (null !== a && "function" !== typeof a && "object" !== typeof a) {
          if (c._owner) {
            c = c._owner;
            if (c) {
              if (1 !== c.tag) throw Error(p(309));
              var d = c.stateNode;
            }
            if (!d) throw Error(p(147, a));
            var e = d, f = "" + a;
            if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f) return b.ref;
            b = function(a2) {
              var b2 = e.refs;
              null === a2 ? delete b2[f] : b2[f] = a2;
            };
            b._stringRef = f;
            return b;
          }
          if ("string" !== typeof a) throw Error(p(284));
          if (!c._owner) throw Error(p(290, a));
        }
        return a;
      }
      function Mg(a, b) {
        a = Object.prototype.toString.call(b);
        throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
      }
      function Ng(a) {
        var b = a._init;
        return b(a._payload);
      }
      function Og(a) {
        function b(b2, c2) {
          if (a) {
            var d2 = b2.deletions;
            null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
          }
        }
        function c(c2, d2) {
          if (!a) return null;
          for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
          return null;
        }
        function d(a2, b2) {
          for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
          return a2;
        }
        function e(a2, b2) {
          a2 = Pg(a2, b2);
          a2.index = 0;
          a2.sibling = null;
          return a2;
        }
        function f(b2, c2, d2) {
          b2.index = d2;
          if (!a) return b2.flags |= 1048576, c2;
          d2 = b2.alternate;
          if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
          b2.flags |= 2;
          return c2;
        }
        function g(b2) {
          a && null === b2.alternate && (b2.flags |= 2);
          return b2;
        }
        function h(a2, b2, c2, d2) {
          if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
          b2 = e(b2, c2);
          b2.return = a2;
          return b2;
        }
        function k(a2, b2, c2, d2) {
          var f2 = c2.type;
          if (f2 === ya) return m(a2, b2, c2.props.children, d2, c2.key);
          if (null !== b2 && (b2.elementType === f2 || "object" === typeof f2 && null !== f2 && f2.$$typeof === Ha && Ng(f2) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
          d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
          d2.ref = Lg(a2, b2, c2);
          d2.return = a2;
          return d2;
        }
        function l(a2, b2, c2, d2) {
          if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
          b2 = e(b2, c2.children || []);
          b2.return = a2;
          return b2;
        }
        function m(a2, b2, c2, d2, f2) {
          if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f2), b2.return = a2, b2;
          b2 = e(b2, c2);
          b2.return = a2;
          return b2;
        }
        function q(a2, b2, c2) {
          if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
          if ("object" === typeof b2 && null !== b2) {
            switch (b2.$$typeof) {
              case va:
                return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
              case wa:
                return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
              case Ha:
                var d2 = b2._init;
                return q(a2, d2(b2._payload), c2);
            }
            if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
            Mg(a2, b2);
          }
          return null;
        }
        function r(a2, b2, c2, d2) {
          var e2 = null !== b2 ? b2.key : null;
          if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
          if ("object" === typeof c2 && null !== c2) {
            switch (c2.$$typeof) {
              case va:
                return c2.key === e2 ? k(a2, b2, c2, d2) : null;
              case wa:
                return c2.key === e2 ? l(a2, b2, c2, d2) : null;
              case Ha:
                return e2 = c2._init, r(
                  a2,
                  b2,
                  e2(c2._payload),
                  d2
                );
            }
            if (eb(c2) || Ka(c2)) return null !== e2 ? null : m(a2, b2, c2, d2, null);
            Mg(a2, c2);
          }
          return null;
        }
        function y(a2, b2, c2, d2, e2) {
          if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
          if ("object" === typeof d2 && null !== d2) {
            switch (d2.$$typeof) {
              case va:
                return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k(b2, a2, d2, e2);
              case wa:
                return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l(b2, a2, d2, e2);
              case Ha:
                var f2 = d2._init;
                return y(a2, b2, c2, f2(d2._payload), e2);
            }
            if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m(b2, a2, d2, e2, null);
            Mg(b2, d2);
          }
          return null;
        }
        function n(e2, g2, h2, k2) {
          for (var l2 = null, m2 = null, u = g2, w = g2 = 0, x = null; null !== u && w < h2.length; w++) {
            u.index > w ? (x = u, u = null) : x = u.sibling;
            var n2 = r(e2, u, h2[w], k2);
            if (null === n2) {
              null === u && (u = x);
              break;
            }
            a && u && null === n2.alternate && b(e2, u);
            g2 = f(n2, g2, w);
            null === m2 ? l2 = n2 : m2.sibling = n2;
            m2 = n2;
            u = x;
          }
          if (w === h2.length) return c(e2, u), I && tg(e2, w), l2;
          if (null === u) {
            for (; w < h2.length; w++) u = q(e2, h2[w], k2), null !== u && (g2 = f(u, g2, w), null === m2 ? l2 = u : m2.sibling = u, m2 = u);
            I && tg(e2, w);
            return l2;
          }
          for (u = d(e2, u); w < h2.length; w++) x = y(u, e2, w, h2[w], k2), null !== x && (a && null !== x.alternate && u.delete(null === x.key ? w : x.key), g2 = f(x, g2, w), null === m2 ? l2 = x : m2.sibling = x, m2 = x);
          a && u.forEach(function(a2) {
            return b(e2, a2);
          });
          I && tg(e2, w);
          return l2;
        }
        function t(e2, g2, h2, k2) {
          var l2 = Ka(h2);
          if ("function" !== typeof l2) throw Error(p(150));
          h2 = l2.call(h2);
          if (null == h2) throw Error(p(151));
          for (var u = l2 = null, m2 = g2, w = g2 = 0, x = null, n2 = h2.next(); null !== m2 && !n2.done; w++, n2 = h2.next()) {
            m2.index > w ? (x = m2, m2 = null) : x = m2.sibling;
            var t2 = r(e2, m2, n2.value, k2);
            if (null === t2) {
              null === m2 && (m2 = x);
              break;
            }
            a && m2 && null === t2.alternate && b(e2, m2);
            g2 = f(t2, g2, w);
            null === u ? l2 = t2 : u.sibling = t2;
            u = t2;
            m2 = x;
          }
          if (n2.done) return c(
            e2,
            m2
          ), I && tg(e2, w), l2;
          if (null === m2) {
            for (; !n2.done; w++, n2 = h2.next()) n2 = q(e2, n2.value, k2), null !== n2 && (g2 = f(n2, g2, w), null === u ? l2 = n2 : u.sibling = n2, u = n2);
            I && tg(e2, w);
            return l2;
          }
          for (m2 = d(e2, m2); !n2.done; w++, n2 = h2.next()) n2 = y(m2, e2, w, n2.value, k2), null !== n2 && (a && null !== n2.alternate && m2.delete(null === n2.key ? w : n2.key), g2 = f(n2, g2, w), null === u ? l2 = n2 : u.sibling = n2, u = n2);
          a && m2.forEach(function(a2) {
            return b(e2, a2);
          });
          I && tg(e2, w);
          return l2;
        }
        function J(a2, d2, f2, h2) {
          "object" === typeof f2 && null !== f2 && f2.type === ya && null === f2.key && (f2 = f2.props.children);
          if ("object" === typeof f2 && null !== f2) {
            switch (f2.$$typeof) {
              case va:
                a: {
                  for (var k2 = f2.key, l2 = d2; null !== l2; ) {
                    if (l2.key === k2) {
                      k2 = f2.type;
                      if (k2 === ya) {
                        if (7 === l2.tag) {
                          c(a2, l2.sibling);
                          d2 = e(l2, f2.props.children);
                          d2.return = a2;
                          a2 = d2;
                          break a;
                        }
                      } else if (l2.elementType === k2 || "object" === typeof k2 && null !== k2 && k2.$$typeof === Ha && Ng(k2) === l2.type) {
                        c(a2, l2.sibling);
                        d2 = e(l2, f2.props);
                        d2.ref = Lg(a2, l2, f2);
                        d2.return = a2;
                        a2 = d2;
                        break a;
                      }
                      c(a2, l2);
                      break;
                    } else b(a2, l2);
                    l2 = l2.sibling;
                  }
                  f2.type === ya ? (d2 = Tg(f2.props.children, a2.mode, h2, f2.key), d2.return = a2, a2 = d2) : (h2 = Rg(f2.type, f2.key, f2.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f2), h2.return = a2, a2 = h2);
                }
                return g(a2);
              case wa:
                a: {
                  for (l2 = f2.key; null !== d2; ) {
                    if (d2.key === l2) if (4 === d2.tag && d2.stateNode.containerInfo === f2.containerInfo && d2.stateNode.implementation === f2.implementation) {
                      c(a2, d2.sibling);
                      d2 = e(d2, f2.children || []);
                      d2.return = a2;
                      a2 = d2;
                      break a;
                    } else {
                      c(a2, d2);
                      break;
                    }
                    else b(a2, d2);
                    d2 = d2.sibling;
                  }
                  d2 = Sg(f2, a2.mode, h2);
                  d2.return = a2;
                  a2 = d2;
                }
                return g(a2);
              case Ha:
                return l2 = f2._init, J(a2, d2, l2(f2._payload), h2);
            }
            if (eb(f2)) return n(a2, d2, f2, h2);
            if (Ka(f2)) return t(a2, d2, f2, h2);
            Mg(a2, f2);
          }
          return "string" === typeof f2 && "" !== f2 || "number" === typeof f2 ? (f2 = "" + f2, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f2), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f2, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
        }
        return J;
      }
      var Ug = Og(true);
      var Vg = Og(false);
      var Wg = Uf(null);
      var Xg = null;
      var Yg = null;
      var Zg = null;
      function $g() {
        Zg = Yg = Xg = null;
      }
      function ah(a) {
        var b = Wg.current;
        E(Wg);
        a._currentValue = b;
      }
      function bh(a, b, c) {
        for (; null !== a; ) {
          var d = a.alternate;
          (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
          if (a === c) break;
          a = a.return;
        }
      }
      function ch(a, b) {
        Xg = a;
        Zg = Yg = null;
        a = a.dependencies;
        null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
      }
      function eh(a) {
        var b = a._currentValue;
        if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
          if (null === Xg) throw Error(p(308));
          Yg = a;
          Xg.dependencies = { lanes: 0, firstContext: a };
        } else Yg = Yg.next = a;
        return b;
      }
      var fh = null;
      function gh(a) {
        null === fh ? fh = [a] : fh.push(a);
      }
      function hh(a, b, c, d) {
        var e = b.interleaved;
        null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
        b.interleaved = c;
        return ih(a, d);
      }
      function ih(a, b) {
        a.lanes |= b;
        var c = a.alternate;
        null !== c && (c.lanes |= b);
        c = a;
        for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
        return 3 === c.tag ? c.stateNode : null;
      }
      var jh = false;
      function kh(a) {
        a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
      }
      function lh(a, b) {
        a = a.updateQueue;
        b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
      }
      function mh(a, b) {
        return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
      }
      function nh(a, b, c) {
        var d = a.updateQueue;
        if (null === d) return null;
        d = d.shared;
        if (0 !== (K & 2)) {
          var e = d.pending;
          null === e ? b.next = b : (b.next = e.next, e.next = b);
          d.pending = b;
          return ih(a, c);
        }
        e = d.interleaved;
        null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
        d.interleaved = b;
        return ih(a, c);
      }
      function oh(a, b, c) {
        b = b.updateQueue;
        if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
          var d = b.lanes;
          d &= a.pendingLanes;
          c |= d;
          b.lanes = c;
          Cc(a, c);
        }
      }
      function ph(a, b) {
        var c = a.updateQueue, d = a.alternate;
        if (null !== d && (d = d.updateQueue, c === d)) {
          var e = null, f = null;
          c = c.firstBaseUpdate;
          if (null !== c) {
            do {
              var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
              null === f ? e = f = g : f = f.next = g;
              c = c.next;
            } while (null !== c);
            null === f ? e = f = b : f = f.next = b;
          } else e = f = b;
          c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f, shared: d.shared, effects: d.effects };
          a.updateQueue = c;
          return;
        }
        a = c.lastBaseUpdate;
        null === a ? c.firstBaseUpdate = b : a.next = b;
        c.lastBaseUpdate = b;
      }
      function qh(a, b, c, d) {
        var e = a.updateQueue;
        jh = false;
        var f = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
        if (null !== h) {
          e.shared.pending = null;
          var k = h, l = k.next;
          k.next = null;
          null === g ? f = l : g.next = l;
          g = k;
          var m = a.alternate;
          null !== m && (m = m.updateQueue, h = m.lastBaseUpdate, h !== g && (null === h ? m.firstBaseUpdate = l : h.next = l, m.lastBaseUpdate = k));
        }
        if (null !== f) {
          var q = e.baseState;
          g = 0;
          m = l = k = null;
          h = f;
          do {
            var r = h.lane, y = h.eventTime;
            if ((d & r) === r) {
              null !== m && (m = m.next = {
                eventTime: y,
                lane: 0,
                tag: h.tag,
                payload: h.payload,
                callback: h.callback,
                next: null
              });
              a: {
                var n = a, t = h;
                r = b;
                y = c;
                switch (t.tag) {
                  case 1:
                    n = t.payload;
                    if ("function" === typeof n) {
                      q = n.call(y, q, r);
                      break a;
                    }
                    q = n;
                    break a;
                  case 3:
                    n.flags = n.flags & -65537 | 128;
                  case 0:
                    n = t.payload;
                    r = "function" === typeof n ? n.call(y, q, r) : n;
                    if (null === r || void 0 === r) break a;
                    q = A({}, q, r);
                    break a;
                  case 2:
                    jh = true;
                }
              }
              null !== h.callback && 0 !== h.lane && (a.flags |= 64, r = e.effects, null === r ? e.effects = [h] : r.push(h));
            } else y = { eventTime: y, lane: r, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m ? (l = m = y, k = q) : m = m.next = y, g |= r;
            h = h.next;
            if (null === h) if (h = e.shared.pending, null === h) break;
            else r = h, h = r.next, r.next = null, e.lastBaseUpdate = r, e.shared.pending = null;
          } while (1);
          null === m && (k = q);
          e.baseState = k;
          e.firstBaseUpdate = l;
          e.lastBaseUpdate = m;
          b = e.shared.interleaved;
          if (null !== b) {
            e = b;
            do
              g |= e.lane, e = e.next;
            while (e !== b);
          } else null === f && (e.shared.lanes = 0);
          rh |= g;
          a.lanes = g;
          a.memoizedState = q;
        }
      }
      function sh(a, b, c) {
        a = b.effects;
        b.effects = null;
        if (null !== a) for (b = 0; b < a.length; b++) {
          var d = a[b], e = d.callback;
          if (null !== e) {
            d.callback = null;
            d = c;
            if ("function" !== typeof e) throw Error(p(191, e));
            e.call(d);
          }
        }
      }
      var th = {};
      var uh = Uf(th);
      var vh = Uf(th);
      var wh = Uf(th);
      function xh(a) {
        if (a === th) throw Error(p(174));
        return a;
      }
      function yh(a, b) {
        G(wh, b);
        G(vh, a);
        G(uh, th);
        a = b.nodeType;
        switch (a) {
          case 9:
          case 11:
            b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
            break;
          default:
            a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
        }
        E(uh);
        G(uh, b);
      }
      function zh() {
        E(uh);
        E(vh);
        E(wh);
      }
      function Ah(a) {
        xh(wh.current);
        var b = xh(uh.current);
        var c = lb(b, a.type);
        b !== c && (G(vh, a), G(uh, c));
      }
      function Bh(a) {
        vh.current === a && (E(uh), E(vh));
      }
      var L = Uf(0);
      function Ch(a) {
        for (var b = a; null !== b; ) {
          if (13 === b.tag) {
            var c = b.memoizedState;
            if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
          } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
            if (0 !== (b.flags & 128)) return b;
          } else if (null !== b.child) {
            b.child.return = b;
            b = b.child;
            continue;
          }
          if (b === a) break;
          for (; null === b.sibling; ) {
            if (null === b.return || b.return === a) return null;
            b = b.return;
          }
          b.sibling.return = b.return;
          b = b.sibling;
        }
        return null;
      }
      var Dh = [];
      function Eh() {
        for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
        Dh.length = 0;
      }
      var Fh = ua.ReactCurrentDispatcher;
      var Gh = ua.ReactCurrentBatchConfig;
      var Hh = 0;
      var M = null;
      var N = null;
      var O = null;
      var Ih = false;
      var Jh = false;
      var Kh = 0;
      var Lh = 0;
      function P() {
        throw Error(p(321));
      }
      function Mh(a, b) {
        if (null === b) return false;
        for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
        return true;
      }
      function Nh(a, b, c, d, e, f) {
        Hh = f;
        M = b;
        b.memoizedState = null;
        b.updateQueue = null;
        b.lanes = 0;
        Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
        a = c(d, e);
        if (Jh) {
          f = 0;
          do {
            Jh = false;
            Kh = 0;
            if (25 <= f) throw Error(p(301));
            f += 1;
            O = N = null;
            b.updateQueue = null;
            Fh.current = Qh;
            a = c(d, e);
          } while (Jh);
        }
        Fh.current = Rh;
        b = null !== N && null !== N.next;
        Hh = 0;
        O = N = M = null;
        Ih = false;
        if (b) throw Error(p(300));
        return a;
      }
      function Sh() {
        var a = 0 !== Kh;
        Kh = 0;
        return a;
      }
      function Th() {
        var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
        null === O ? M.memoizedState = O = a : O = O.next = a;
        return O;
      }
      function Uh() {
        if (null === N) {
          var a = M.alternate;
          a = null !== a ? a.memoizedState : null;
        } else a = N.next;
        var b = null === O ? M.memoizedState : O.next;
        if (null !== b) O = b, N = a;
        else {
          if (null === a) throw Error(p(310));
          N = a;
          a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
          null === O ? M.memoizedState = O = a : O = O.next = a;
        }
        return O;
      }
      function Vh(a, b) {
        return "function" === typeof b ? b(a) : b;
      }
      function Wh(a) {
        var b = Uh(), c = b.queue;
        if (null === c) throw Error(p(311));
        c.lastRenderedReducer = a;
        var d = N, e = d.baseQueue, f = c.pending;
        if (null !== f) {
          if (null !== e) {
            var g = e.next;
            e.next = f.next;
            f.next = g;
          }
          d.baseQueue = e = f;
          c.pending = null;
        }
        if (null !== e) {
          f = e.next;
          d = d.baseState;
          var h = g = null, k = null, l = f;
          do {
            var m = l.lane;
            if ((Hh & m) === m) null !== k && (k = k.next = { lane: 0, action: l.action, hasEagerState: l.hasEagerState, eagerState: l.eagerState, next: null }), d = l.hasEagerState ? l.eagerState : a(d, l.action);
            else {
              var q = {
                lane: m,
                action: l.action,
                hasEagerState: l.hasEagerState,
                eagerState: l.eagerState,
                next: null
              };
              null === k ? (h = k = q, g = d) : k = k.next = q;
              M.lanes |= m;
              rh |= m;
            }
            l = l.next;
          } while (null !== l && l !== f);
          null === k ? g = d : k.next = h;
          He(d, b.memoizedState) || (dh = true);
          b.memoizedState = d;
          b.baseState = g;
          b.baseQueue = k;
          c.lastRenderedState = d;
        }
        a = c.interleaved;
        if (null !== a) {
          e = a;
          do
            f = e.lane, M.lanes |= f, rh |= f, e = e.next;
          while (e !== a);
        } else null === e && (c.lanes = 0);
        return [b.memoizedState, c.dispatch];
      }
      function Xh(a) {
        var b = Uh(), c = b.queue;
        if (null === c) throw Error(p(311));
        c.lastRenderedReducer = a;
        var d = c.dispatch, e = c.pending, f = b.memoizedState;
        if (null !== e) {
          c.pending = null;
          var g = e = e.next;
          do
            f = a(f, g.action), g = g.next;
          while (g !== e);
          He(f, b.memoizedState) || (dh = true);
          b.memoizedState = f;
          null === b.baseQueue && (b.baseState = f);
          c.lastRenderedState = f;
        }
        return [f, d];
      }
      function Yh() {
      }
      function Zh(a, b) {
        var c = M, d = Uh(), e = b(), f = !He(d.memoizedState, e);
        f && (d.memoizedState = e, dh = true);
        d = d.queue;
        $h(ai.bind(null, c, d, a), [a]);
        if (d.getSnapshot !== b || f || null !== O && O.memoizedState.tag & 1) {
          c.flags |= 2048;
          bi(9, ci.bind(null, c, d, e, b), void 0, null);
          if (null === Q) throw Error(p(349));
          0 !== (Hh & 30) || di(c, b, e);
        }
        return e;
      }
      function di(a, b, c) {
        a.flags |= 16384;
        a = { getSnapshot: b, value: c };
        b = M.updateQueue;
        null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
      }
      function ci(a, b, c, d) {
        b.value = c;
        b.getSnapshot = d;
        ei(b) && fi(a);
      }
      function ai(a, b, c) {
        return c(function() {
          ei(b) && fi(a);
        });
      }
      function ei(a) {
        var b = a.getSnapshot;
        a = a.value;
        try {
          var c = b();
          return !He(a, c);
        } catch (d) {
          return true;
        }
      }
      function fi(a) {
        var b = ih(a, 1);
        null !== b && gi(b, a, 1, -1);
      }
      function hi(a) {
        var b = Th();
        "function" === typeof a && (a = a());
        b.memoizedState = b.baseState = a;
        a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
        b.queue = a;
        a = a.dispatch = ii.bind(null, M, a);
        return [b.memoizedState, a];
      }
      function bi(a, b, c, d) {
        a = { tag: a, create: b, destroy: c, deps: d, next: null };
        b = M.updateQueue;
        null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
        return a;
      }
      function ji() {
        return Uh().memoizedState;
      }
      function ki(a, b, c, d) {
        var e = Th();
        M.flags |= a;
        e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
      }
      function li(a, b, c, d) {
        var e = Uh();
        d = void 0 === d ? null : d;
        var f = void 0;
        if (null !== N) {
          var g = N.memoizedState;
          f = g.destroy;
          if (null !== d && Mh(d, g.deps)) {
            e.memoizedState = bi(b, c, f, d);
            return;
          }
        }
        M.flags |= a;
        e.memoizedState = bi(1 | b, c, f, d);
      }
      function mi(a, b) {
        return ki(8390656, 8, a, b);
      }
      function $h(a, b) {
        return li(2048, 8, a, b);
      }
      function ni(a, b) {
        return li(4, 2, a, b);
      }
      function oi(a, b) {
        return li(4, 4, a, b);
      }
      function pi(a, b) {
        if ("function" === typeof b) return a = a(), b(a), function() {
          b(null);
        };
        if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
          b.current = null;
        };
      }
      function qi(a, b, c) {
        c = null !== c && void 0 !== c ? c.concat([a]) : null;
        return li(4, 4, pi.bind(null, b, a), c);
      }
      function ri() {
      }
      function si(a, b) {
        var c = Uh();
        b = void 0 === b ? null : b;
        var d = c.memoizedState;
        if (null !== d && null !== b && Mh(b, d[1])) return d[0];
        c.memoizedState = [a, b];
        return a;
      }
      function ti(a, b) {
        var c = Uh();
        b = void 0 === b ? null : b;
        var d = c.memoizedState;
        if (null !== d && null !== b && Mh(b, d[1])) return d[0];
        a = a();
        c.memoizedState = [a, b];
        return a;
      }
      function ui(a, b, c) {
        if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
        He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
        return b;
      }
      function vi(a, b) {
        var c = C;
        C = 0 !== c && 4 > c ? c : 4;
        a(true);
        var d = Gh.transition;
        Gh.transition = {};
        try {
          a(false), b();
        } finally {
          C = c, Gh.transition = d;
        }
      }
      function wi() {
        return Uh().memoizedState;
      }
      function xi(a, b, c) {
        var d = yi(a);
        c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
        if (zi(a)) Ai(b, c);
        else if (c = hh(a, b, c, d), null !== c) {
          var e = R();
          gi(c, a, d, e);
          Bi(c, b, d);
        }
      }
      function ii(a, b, c) {
        var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
        if (zi(a)) Ai(b, e);
        else {
          var f = a.alternate;
          if (0 === a.lanes && (null === f || 0 === f.lanes) && (f = b.lastRenderedReducer, null !== f)) try {
            var g = b.lastRenderedState, h = f(g, c);
            e.hasEagerState = true;
            e.eagerState = h;
            if (He(h, g)) {
              var k = b.interleaved;
              null === k ? (e.next = e, gh(b)) : (e.next = k.next, k.next = e);
              b.interleaved = e;
              return;
            }
          } catch (l) {
          } finally {
          }
          c = hh(a, b, e, d);
          null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
        }
      }
      function zi(a) {
        var b = a.alternate;
        return a === M || null !== b && b === M;
      }
      function Ai(a, b) {
        Jh = Ih = true;
        var c = a.pending;
        null === c ? b.next = b : (b.next = c.next, c.next = b);
        a.pending = b;
      }
      function Bi(a, b, c) {
        if (0 !== (c & 4194240)) {
          var d = b.lanes;
          d &= a.pendingLanes;
          c |= d;
          b.lanes = c;
          Cc(a, c);
        }
      }
      var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false };
      var Oh = { readContext: eh, useCallback: function(a, b) {
        Th().memoizedState = [a, void 0 === b ? null : b];
        return a;
      }, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
        c = null !== c && void 0 !== c ? c.concat([a]) : null;
        return ki(
          4194308,
          4,
          pi.bind(null, b, a),
          c
        );
      }, useLayoutEffect: function(a, b) {
        return ki(4194308, 4, a, b);
      }, useInsertionEffect: function(a, b) {
        return ki(4, 2, a, b);
      }, useMemo: function(a, b) {
        var c = Th();
        b = void 0 === b ? null : b;
        a = a();
        c.memoizedState = [a, b];
        return a;
      }, useReducer: function(a, b, c) {
        var d = Th();
        b = void 0 !== c ? c(b) : b;
        d.memoizedState = d.baseState = b;
        a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
        d.queue = a;
        a = a.dispatch = xi.bind(null, M, a);
        return [d.memoizedState, a];
      }, useRef: function(a) {
        var b = Th();
        a = { current: a };
        return b.memoizedState = a;
      }, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
        return Th().memoizedState = a;
      }, useTransition: function() {
        var a = hi(false), b = a[0];
        a = vi.bind(null, a[1]);
        Th().memoizedState = a;
        return [b, a];
      }, useMutableSource: function() {
      }, useSyncExternalStore: function(a, b, c) {
        var d = M, e = Th();
        if (I) {
          if (void 0 === c) throw Error(p(407));
          c = c();
        } else {
          c = b();
          if (null === Q) throw Error(p(349));
          0 !== (Hh & 30) || di(d, b, c);
        }
        e.memoizedState = c;
        var f = { value: c, getSnapshot: b };
        e.queue = f;
        mi(ai.bind(
          null,
          d,
          f,
          a
        ), [a]);
        d.flags |= 2048;
        bi(9, ci.bind(null, d, f, c, b), void 0, null);
        return c;
      }, useId: function() {
        var a = Th(), b = Q.identifierPrefix;
        if (I) {
          var c = sg;
          var d = rg;
          c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
          b = ":" + b + "R" + c;
          c = Kh++;
          0 < c && (b += "H" + c.toString(32));
          b += ":";
        } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
        return a.memoizedState = b;
      }, unstable_isNewReconciler: false };
      var Ph = {
        readContext: eh,
        useCallback: si,
        useContext: eh,
        useEffect: $h,
        useImperativeHandle: qi,
        useInsertionEffect: ni,
        useLayoutEffect: oi,
        useMemo: ti,
        useReducer: Wh,
        useRef: ji,
        useState: function() {
          return Wh(Vh);
        },
        useDebugValue: ri,
        useDeferredValue: function(a) {
          var b = Uh();
          return ui(b, N.memoizedState, a);
        },
        useTransition: function() {
          var a = Wh(Vh)[0], b = Uh().memoizedState;
          return [a, b];
        },
        useMutableSource: Yh,
        useSyncExternalStore: Zh,
        useId: wi,
        unstable_isNewReconciler: false
      };
      var Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
        return Xh(Vh);
      }, useDebugValue: ri, useDeferredValue: function(a) {
        var b = Uh();
        return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
      }, useTransition: function() {
        var a = Xh(Vh)[0], b = Uh().memoizedState;
        return [a, b];
      }, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
      function Ci(a, b) {
        if (a && a.defaultProps) {
          b = A({}, b);
          a = a.defaultProps;
          for (var c in a) void 0 === b[c] && (b[c] = a[c]);
          return b;
        }
        return b;
      }
      function Di(a, b, c, d) {
        b = a.memoizedState;
        c = c(d, b);
        c = null === c || void 0 === c ? b : A({}, b, c);
        a.memoizedState = c;
        0 === a.lanes && (a.updateQueue.baseState = c);
      }
      var Ei = { isMounted: function(a) {
        return (a = a._reactInternals) ? Vb(a) === a : false;
      }, enqueueSetState: function(a, b, c) {
        a = a._reactInternals;
        var d = R(), e = yi(a), f = mh(d, e);
        f.payload = b;
        void 0 !== c && null !== c && (f.callback = c);
        b = nh(a, f, e);
        null !== b && (gi(b, a, e, d), oh(b, a, e));
      }, enqueueReplaceState: function(a, b, c) {
        a = a._reactInternals;
        var d = R(), e = yi(a), f = mh(d, e);
        f.tag = 1;
        f.payload = b;
        void 0 !== c && null !== c && (f.callback = c);
        b = nh(a, f, e);
        null !== b && (gi(b, a, e, d), oh(b, a, e));
      }, enqueueForceUpdate: function(a, b) {
        a = a._reactInternals;
        var c = R(), d = yi(a), e = mh(c, d);
        e.tag = 2;
        void 0 !== b && null !== b && (e.callback = b);
        b = nh(a, e, d);
        null !== b && (gi(b, a, d, c), oh(b, a, d));
      } };
      function Fi(a, b, c, d, e, f, g) {
        a = a.stateNode;
        return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f) : true;
      }
      function Gi(a, b, c) {
        var d = false, e = Vf;
        var f = b.contextType;
        "object" === typeof f && null !== f ? f = eh(f) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
        b = new b(c, f);
        a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
        b.updater = Ei;
        a.stateNode = b;
        b._reactInternals = a;
        d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f);
        return b;
      }
      function Hi(a, b, c, d) {
        a = b.state;
        "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
        "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
        b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
      }
      function Ii(a, b, c, d) {
        var e = a.stateNode;
        e.props = c;
        e.state = a.memoizedState;
        e.refs = {};
        kh(a);
        var f = b.contextType;
        "object" === typeof f && null !== f ? e.context = eh(f) : (f = Zf(b) ? Xf : H.current, e.context = Yf(a, f));
        e.state = a.memoizedState;
        f = b.getDerivedStateFromProps;
        "function" === typeof f && (Di(a, b, f, c), e.state = a.memoizedState);
        "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
        "function" === typeof e.componentDidMount && (a.flags |= 4194308);
      }
      function Ji(a, b) {
        try {
          var c = "", d = b;
          do
            c += Pa(d), d = d.return;
          while (d);
          var e = c;
        } catch (f) {
          e = "\nError generating stack: " + f.message + "\n" + f.stack;
        }
        return { value: a, source: b, stack: e, digest: null };
      }
      function Ki(a, b, c) {
        return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
      }
      function Li(a, b) {
        try {
          console.error(b.value);
        } catch (c) {
          setTimeout(function() {
            throw c;
          });
        }
      }
      var Mi = "function" === typeof WeakMap ? WeakMap : Map;
      function Ni(a, b, c) {
        c = mh(-1, c);
        c.tag = 3;
        c.payload = { element: null };
        var d = b.value;
        c.callback = function() {
          Oi || (Oi = true, Pi = d);
          Li(a, b);
        };
        return c;
      }
      function Qi(a, b, c) {
        c = mh(-1, c);
        c.tag = 3;
        var d = a.type.getDerivedStateFromError;
        if ("function" === typeof d) {
          var e = b.value;
          c.payload = function() {
            return d(e);
          };
          c.callback = function() {
            Li(a, b);
          };
        }
        var f = a.stateNode;
        null !== f && "function" === typeof f.componentDidCatch && (c.callback = function() {
          Li(a, b);
          "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
          var c2 = b.stack;
          this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
        });
        return c;
      }
      function Si(a, b, c) {
        var d = a.pingCache;
        if (null === d) {
          d = a.pingCache = new Mi();
          var e = /* @__PURE__ */ new Set();
          d.set(b, e);
        } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
        e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
      }
      function Ui(a) {
        do {
          var b;
          if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
          if (b) return a;
          a = a.return;
        } while (null !== a);
        return null;
      }
      function Vi(a, b, c, d, e) {
        if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
        a.flags |= 65536;
        a.lanes = e;
        return a;
      }
      var Wi = ua.ReactCurrentOwner;
      var dh = false;
      function Xi(a, b, c, d) {
        b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
      }
      function Yi(a, b, c, d, e) {
        c = c.render;
        var f = b.ref;
        ch(b, e);
        d = Nh(a, b, c, d, f, e);
        c = Sh();
        if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
        I && c && vg(b);
        b.flags |= 1;
        Xi(a, b, d, e);
        return b.child;
      }
      function $i(a, b, c, d, e) {
        if (null === a) {
          var f = c.type;
          if ("function" === typeof f && !aj(f) && void 0 === f.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f, bj(a, b, f, d, e);
          a = Rg(c.type, null, d, b, b.mode, e);
          a.ref = b.ref;
          a.return = b;
          return b.child = a;
        }
        f = a.child;
        if (0 === (a.lanes & e)) {
          var g = f.memoizedProps;
          c = c.compare;
          c = null !== c ? c : Ie;
          if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
        }
        b.flags |= 1;
        a = Pg(f, d);
        a.ref = b.ref;
        a.return = b;
        return b.child = a;
      }
      function bj(a, b, c, d, e) {
        if (null !== a) {
          var f = a.memoizedProps;
          if (Ie(f, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
          else return b.lanes = a.lanes, Zi(a, b, e);
        }
        return cj(a, b, c, d, e);
      }
      function dj(a, b, c) {
        var d = b.pendingProps, e = d.children, f = null !== a ? a.memoizedState : null;
        if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
        else {
          if (0 === (c & 1073741824)) return a = null !== f ? f.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
          b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
          d = null !== f ? f.baseLanes : c;
          G(ej, fj);
          fj |= d;
        }
        else null !== f ? (d = f.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
        Xi(a, b, e, c);
        return b.child;
      }
      function gj(a, b) {
        var c = b.ref;
        if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
      }
      function cj(a, b, c, d, e) {
        var f = Zf(c) ? Xf : H.current;
        f = Yf(b, f);
        ch(b, e);
        c = Nh(a, b, c, d, f, e);
        d = Sh();
        if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
        I && d && vg(b);
        b.flags |= 1;
        Xi(a, b, c, e);
        return b.child;
      }
      function hj(a, b, c, d, e) {
        if (Zf(c)) {
          var f = true;
          cg(b);
        } else f = false;
        ch(b, e);
        if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
        else if (null === a) {
          var g = b.stateNode, h = b.memoizedProps;
          g.props = h;
          var k = g.context, l = c.contextType;
          "object" === typeof l && null !== l ? l = eh(l) : (l = Zf(c) ? Xf : H.current, l = Yf(b, l));
          var m = c.getDerivedStateFromProps, q = "function" === typeof m || "function" === typeof g.getSnapshotBeforeUpdate;
          q || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k !== l) && Hi(b, g, d, l);
          jh = false;
          var r = b.memoizedState;
          g.state = r;
          qh(b, d, g, e);
          k = b.memoizedState;
          h !== d || r !== k || Wf.current || jh ? ("function" === typeof m && (Di(b, c, m, d), k = b.memoizedState), (h = jh || Fi(b, c, h, d, r, k, l)) ? (q || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k), g.props = d, g.state = k, g.context = l, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
        } else {
          g = b.stateNode;
          lh(a, b);
          h = b.memoizedProps;
          l = b.type === b.elementType ? h : Ci(b.type, h);
          g.props = l;
          q = b.pendingProps;
          r = g.context;
          k = c.contextType;
          "object" === typeof k && null !== k ? k = eh(k) : (k = Zf(c) ? Xf : H.current, k = Yf(b, k));
          var y = c.getDerivedStateFromProps;
          (m = "function" === typeof y || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q || r !== k) && Hi(b, g, d, k);
          jh = false;
          r = b.memoizedState;
          g.state = r;
          qh(b, d, g, e);
          var n = b.memoizedState;
          h !== q || r !== n || Wf.current || jh ? ("function" === typeof y && (Di(b, c, y, d), n = b.memoizedState), (l = jh || Fi(b, c, l, d, r, n, k) || false) ? (m || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n, k), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n, k)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n), g.props = d, g.state = n, g.context = k, d = l) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 1024), d = false);
        }
        return jj(a, b, c, d, f, e);
      }
      function jj(a, b, c, d, e, f) {
        gj(a, b);
        var g = 0 !== (b.flags & 128);
        if (!d && !g) return e && dg(b, c, false), Zi(a, b, f);
        d = b.stateNode;
        Wi.current = b;
        var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
        b.flags |= 1;
        null !== a && g ? (b.child = Ug(b, a.child, null, f), b.child = Ug(b, null, h, f)) : Xi(a, b, h, f);
        b.memoizedState = d.state;
        e && dg(b, c, true);
        return b.child;
      }
      function kj(a) {
        var b = a.stateNode;
        b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
        yh(a, b.containerInfo);
      }
      function lj(a, b, c, d, e) {
        Ig();
        Jg(e);
        b.flags |= 256;
        Xi(a, b, c, d);
        return b.child;
      }
      var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
      function nj(a) {
        return { baseLanes: a, cachePool: null, transitions: null };
      }
      function oj(a, b, c) {
        var d = b.pendingProps, e = L.current, f = false, g = 0 !== (b.flags & 128), h;
        (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
        if (h) f = true, b.flags &= -129;
        else if (null === a || null !== a.memoizedState) e |= 1;
        G(L, e & 1);
        if (null === a) {
          Eg(b);
          a = b.memoizedState;
          if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
          g = d.children;
          a = d.fallback;
          return f ? (d = b.mode, f = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f ? (f.childLanes = 0, f.pendingProps = g) : f = pj(g, d, 0, null), a = Tg(a, d, c, null), f.return = b, a.return = b, f.sibling = a, b.child = f, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
        }
        e = a.memoizedState;
        if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
        if (f) {
          f = d.fallback;
          g = b.mode;
          e = a.child;
          h = e.sibling;
          var k = { mode: "hidden", children: d.children };
          0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k, b.deletions = null) : (d = Pg(e, k), d.subtreeFlags = e.subtreeFlags & 14680064);
          null !== h ? f = Pg(h, f) : (f = Tg(f, g, c, null), f.flags |= 2);
          f.return = b;
          d.return = b;
          d.sibling = f;
          b.child = d;
          d = f;
          f = b.child;
          g = a.child.memoizedState;
          g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
          f.memoizedState = g;
          f.childLanes = a.childLanes & ~c;
          b.memoizedState = mj;
          return d;
        }
        f = a.child;
        a = f.sibling;
        d = Pg(f, { mode: "visible", children: d.children });
        0 === (b.mode & 1) && (d.lanes = c);
        d.return = b;
        d.sibling = null;
        null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
        b.child = d;
        b.memoizedState = null;
        return d;
      }
      function qj(a, b) {
        b = pj({ mode: "visible", children: b }, a.mode, 0, null);
        b.return = a;
        return a.child = b;
      }
      function sj(a, b, c, d) {
        null !== d && Jg(d);
        Ug(b, a.child, null, c);
        a = qj(b, b.pendingProps.children);
        a.flags |= 2;
        b.memoizedState = null;
        return a;
      }
      function rj(a, b, c, d, e, f, g) {
        if (c) {
          if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
          if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
          f = d.fallback;
          e = b.mode;
          d = pj({ mode: "visible", children: d.children }, e, 0, null);
          f = Tg(f, e, g, null);
          f.flags |= 2;
          d.return = b;
          f.return = b;
          d.sibling = f;
          b.child = d;
          0 !== (b.mode & 1) && Ug(b, a.child, null, g);
          b.child.memoizedState = nj(g);
          b.memoizedState = mj;
          return f;
        }
        if (0 === (b.mode & 1)) return sj(a, b, g, null);
        if ("$!" === e.data) {
          d = e.nextSibling && e.nextSibling.dataset;
          if (d) var h = d.dgst;
          d = h;
          f = Error(p(419));
          d = Ki(f, d, void 0);
          return sj(a, b, g, d);
        }
        h = 0 !== (g & a.childLanes);
        if (dh || h) {
          d = Q;
          if (null !== d) {
            switch (g & -g) {
              case 4:
                e = 2;
                break;
              case 16:
                e = 8;
                break;
              case 64:
              case 128:
              case 256:
              case 512:
              case 1024:
              case 2048:
              case 4096:
              case 8192:
              case 16384:
              case 32768:
              case 65536:
              case 131072:
              case 262144:
              case 524288:
              case 1048576:
              case 2097152:
              case 4194304:
              case 8388608:
              case 16777216:
              case 33554432:
              case 67108864:
                e = 32;
                break;
              case 536870912:
                e = 268435456;
                break;
              default:
                e = 0;
            }
            e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
            0 !== e && e !== f.retryLane && (f.retryLane = e, ih(a, e), gi(d, a, e, -1));
          }
          tj();
          d = Ki(Error(p(421)));
          return sj(a, b, g, d);
        }
        if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
        a = f.treeContext;
        yg = Lf(e.nextSibling);
        xg = b;
        I = true;
        zg = null;
        null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
        b = qj(b, d.children);
        b.flags |= 4096;
        return b;
      }
      function vj(a, b, c) {
        a.lanes |= b;
        var d = a.alternate;
        null !== d && (d.lanes |= b);
        bh(a.return, b, c);
      }
      function wj(a, b, c, d, e) {
        var f = a.memoizedState;
        null === f ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f.isBackwards = b, f.rendering = null, f.renderingStartTime = 0, f.last = d, f.tail = c, f.tailMode = e);
      }
      function xj(a, b, c) {
        var d = b.pendingProps, e = d.revealOrder, f = d.tail;
        Xi(a, b, d.children, c);
        d = L.current;
        if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
        else {
          if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
            if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
            else if (19 === a.tag) vj(a, c, b);
            else if (null !== a.child) {
              a.child.return = a;
              a = a.child;
              continue;
            }
            if (a === b) break a;
            for (; null === a.sibling; ) {
              if (null === a.return || a.return === b) break a;
              a = a.return;
            }
            a.sibling.return = a.return;
            a = a.sibling;
          }
          d &= 1;
        }
        G(L, d);
        if (0 === (b.mode & 1)) b.memoizedState = null;
        else switch (e) {
          case "forwards":
            c = b.child;
            for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
            c = e;
            null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
            wj(b, false, e, c, f);
            break;
          case "backwards":
            c = null;
            e = b.child;
            for (b.child = null; null !== e; ) {
              a = e.alternate;
              if (null !== a && null === Ch(a)) {
                b.child = e;
                break;
              }
              a = e.sibling;
              e.sibling = c;
              c = e;
              e = a;
            }
            wj(b, true, c, null, f);
            break;
          case "together":
            wj(b, false, null, null, void 0);
            break;
          default:
            b.memoizedState = null;
        }
        return b.child;
      }
      function ij(a, b) {
        0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
      }
      function Zi(a, b, c) {
        null !== a && (b.dependencies = a.dependencies);
        rh |= b.lanes;
        if (0 === (c & b.childLanes)) return null;
        if (null !== a && b.child !== a.child) throw Error(p(153));
        if (null !== b.child) {
          a = b.child;
          c = Pg(a, a.pendingProps);
          b.child = c;
          for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
          c.sibling = null;
        }
        return b.child;
      }
      function yj(a, b, c) {
        switch (b.tag) {
          case 3:
            kj(b);
            Ig();
            break;
          case 5:
            Ah(b);
            break;
          case 1:
            Zf(b.type) && cg(b);
            break;
          case 4:
            yh(b, b.stateNode.containerInfo);
            break;
          case 10:
            var d = b.type._context, e = b.memoizedProps.value;
            G(Wg, d._currentValue);
            d._currentValue = e;
            break;
          case 13:
            d = b.memoizedState;
            if (null !== d) {
              if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
              if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
              G(L, L.current & 1);
              a = Zi(a, b, c);
              return null !== a ? a.sibling : null;
            }
            G(L, L.current & 1);
            break;
          case 19:
            d = 0 !== (c & b.childLanes);
            if (0 !== (a.flags & 128)) {
              if (d) return xj(a, b, c);
              b.flags |= 128;
            }
            e = b.memoizedState;
            null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
            G(L, L.current);
            if (d) break;
            else return null;
          case 22:
          case 23:
            return b.lanes = 0, dj(a, b, c);
        }
        return Zi(a, b, c);
      }
      var zj;
      var Aj;
      var Bj;
      var Cj;
      zj = function(a, b) {
        for (var c = b.child; null !== c; ) {
          if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
          else if (4 !== c.tag && null !== c.child) {
            c.child.return = c;
            c = c.child;
            continue;
          }
          if (c === b) break;
          for (; null === c.sibling; ) {
            if (null === c.return || c.return === b) return;
            c = c.return;
          }
          c.sibling.return = c.return;
          c = c.sibling;
        }
      };
      Aj = function() {
      };
      Bj = function(a, b, c, d) {
        var e = a.memoizedProps;
        if (e !== d) {
          a = b.stateNode;
          xh(uh.current);
          var f = null;
          switch (c) {
            case "input":
              e = Ya(a, e);
              d = Ya(a, d);
              f = [];
              break;
            case "select":
              e = A({}, e, { value: void 0 });
              d = A({}, d, { value: void 0 });
              f = [];
              break;
            case "textarea":
              e = gb(a, e);
              d = gb(a, d);
              f = [];
              break;
            default:
              "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
          }
          ub(c, d);
          var g;
          c = null;
          for (l in e) if (!d.hasOwnProperty(l) && e.hasOwnProperty(l) && null != e[l]) if ("style" === l) {
            var h = e[l];
            for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
          } else "dangerouslySetInnerHTML" !== l && "children" !== l && "suppressContentEditableWarning" !== l && "suppressHydrationWarning" !== l && "autoFocus" !== l && (ea.hasOwnProperty(l) ? f || (f = []) : (f = f || []).push(l, null));
          for (l in d) {
            var k = d[l];
            h = null != e ? e[l] : void 0;
            if (d.hasOwnProperty(l) && k !== h && (null != k || null != h)) if ("style" === l) if (h) {
              for (g in h) !h.hasOwnProperty(g) || k && k.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
              for (g in k) k.hasOwnProperty(g) && h[g] !== k[g] && (c || (c = {}), c[g] = k[g]);
            } else c || (f || (f = []), f.push(
              l,
              c
            )), c = k;
            else "dangerouslySetInnerHTML" === l ? (k = k ? k.__html : void 0, h = h ? h.__html : void 0, null != k && h !== k && (f = f || []).push(l, k)) : "children" === l ? "string" !== typeof k && "number" !== typeof k || (f = f || []).push(l, "" + k) : "suppressContentEditableWarning" !== l && "suppressHydrationWarning" !== l && (ea.hasOwnProperty(l) ? (null != k && "onScroll" === l && D("scroll", a), f || h === k || (f = [])) : (f = f || []).push(l, k));
          }
          c && (f = f || []).push("style", c);
          var l = f;
          if (b.updateQueue = l) b.flags |= 4;
        }
      };
      Cj = function(a, b, c, d) {
        c !== d && (b.flags |= 4);
      };
      function Dj(a, b) {
        if (!I) switch (a.tailMode) {
          case "hidden":
            b = a.tail;
            for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
            null === c ? a.tail = null : c.sibling = null;
            break;
          case "collapsed":
            c = a.tail;
            for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
            null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
        }
      }
      function S(a) {
        var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
        if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
        else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
        a.subtreeFlags |= d;
        a.childLanes = c;
        return b;
      }
      function Ej(a, b, c) {
        var d = b.pendingProps;
        wg(b);
        switch (b.tag) {
          case 2:
          case 16:
          case 15:
          case 0:
          case 11:
          case 7:
          case 8:
          case 12:
          case 9:
          case 14:
            return S(b), null;
          case 1:
            return Zf(b.type) && $f(), S(b), null;
          case 3:
            d = b.stateNode;
            zh();
            E(Wf);
            E(H);
            Eh();
            d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
            if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
            Aj(a, b);
            S(b);
            return null;
          case 5:
            Bh(b);
            var e = xh(wh.current);
            c = b.type;
            if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
            else {
              if (!d) {
                if (null === b.stateNode) throw Error(p(166));
                S(b);
                return null;
              }
              a = xh(uh.current);
              if (Gg(b)) {
                d = b.stateNode;
                c = b.type;
                var f = b.memoizedProps;
                d[Of] = b;
                d[Pf] = f;
                a = 0 !== (b.mode & 1);
                switch (c) {
                  case "dialog":
                    D("cancel", d);
                    D("close", d);
                    break;
                  case "iframe":
                  case "object":
                  case "embed":
                    D("load", d);
                    break;
                  case "video":
                  case "audio":
                    for (e = 0; e < lf.length; e++) D(lf[e], d);
                    break;
                  case "source":
                    D("error", d);
                    break;
                  case "img":
                  case "image":
                  case "link":
                    D(
                      "error",
                      d
                    );
                    D("load", d);
                    break;
                  case "details":
                    D("toggle", d);
                    break;
                  case "input":
                    Za(d, f);
                    D("invalid", d);
                    break;
                  case "select":
                    d._wrapperState = { wasMultiple: !!f.multiple };
                    D("invalid", d);
                    break;
                  case "textarea":
                    hb(d, f), D("invalid", d);
                }
                ub(c, f);
                e = null;
                for (var g in f) if (f.hasOwnProperty(g)) {
                  var h = f[g];
                  "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f.suppressHydrationWarning && Af(
                    d.textContent,
                    h,
                    a
                  ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
                }
                switch (c) {
                  case "input":
                    Va(d);
                    db(d, f, true);
                    break;
                  case "textarea":
                    Va(d);
                    jb(d);
                    break;
                  case "select":
                  case "option":
                    break;
                  default:
                    "function" === typeof f.onClick && (d.onclick = Bf);
                }
                d = e;
                b.updateQueue = d;
                null !== d && (b.flags |= 4);
              } else {
                g = 9 === e.nodeType ? e : e.ownerDocument;
                "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
                "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
                a[Of] = b;
                a[Pf] = d;
                zj(a, b, false, false);
                b.stateNode = a;
                a: {
                  g = vb(c, d);
                  switch (c) {
                    case "dialog":
                      D("cancel", a);
                      D("close", a);
                      e = d;
                      break;
                    case "iframe":
                    case "object":
                    case "embed":
                      D("load", a);
                      e = d;
                      break;
                    case "video":
                    case "audio":
                      for (e = 0; e < lf.length; e++) D(lf[e], a);
                      e = d;
                      break;
                    case "source":
                      D("error", a);
                      e = d;
                      break;
                    case "img":
                    case "image":
                    case "link":
                      D(
                        "error",
                        a
                      );
                      D("load", a);
                      e = d;
                      break;
                    case "details":
                      D("toggle", a);
                      e = d;
                      break;
                    case "input":
                      Za(a, d);
                      e = Ya(a, d);
                      D("invalid", a);
                      break;
                    case "option":
                      e = d;
                      break;
                    case "select":
                      a._wrapperState = { wasMultiple: !!d.multiple };
                      e = A({}, d, { value: void 0 });
                      D("invalid", a);
                      break;
                    case "textarea":
                      hb(a, d);
                      e = gb(a, d);
                      D("invalid", a);
                      break;
                    default:
                      e = d;
                  }
                  ub(c, e);
                  h = e;
                  for (f in h) if (h.hasOwnProperty(f)) {
                    var k = h[f];
                    "style" === f ? sb(a, k) : "dangerouslySetInnerHTML" === f ? (k = k ? k.__html : void 0, null != k && nb(a, k)) : "children" === f ? "string" === typeof k ? ("textarea" !== c || "" !== k) && ob(a, k) : "number" === typeof k && ob(a, "" + k) : "suppressContentEditableWarning" !== f && "suppressHydrationWarning" !== f && "autoFocus" !== f && (ea.hasOwnProperty(f) ? null != k && "onScroll" === f && D("scroll", a) : null != k && ta(a, f, k, g));
                  }
                  switch (c) {
                    case "input":
                      Va(a);
                      db(a, d, false);
                      break;
                    case "textarea":
                      Va(a);
                      jb(a);
                      break;
                    case "option":
                      null != d.value && a.setAttribute("value", "" + Sa(d.value));
                      break;
                    case "select":
                      a.multiple = !!d.multiple;
                      f = d.value;
                      null != f ? fb(a, !!d.multiple, f, false) : null != d.defaultValue && fb(
                        a,
                        !!d.multiple,
                        d.defaultValue,
                        true
                      );
                      break;
                    default:
                      "function" === typeof e.onClick && (a.onclick = Bf);
                  }
                  switch (c) {
                    case "button":
                    case "input":
                    case "select":
                    case "textarea":
                      d = !!d.autoFocus;
                      break a;
                    case "img":
                      d = true;
                      break a;
                    default:
                      d = false;
                  }
                }
                d && (b.flags |= 4);
              }
              null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
            }
            S(b);
            return null;
          case 6:
            if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
            else {
              if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
              c = xh(wh.current);
              xh(uh.current);
              if (Gg(b)) {
                d = b.stateNode;
                c = b.memoizedProps;
                d[Of] = b;
                if (f = d.nodeValue !== c) {
                  if (a = xg, null !== a) switch (a.tag) {
                    case 3:
                      Af(d.nodeValue, c, 0 !== (a.mode & 1));
                      break;
                    case 5:
                      true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
                  }
                }
                f && (b.flags |= 4);
              } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
            }
            S(b);
            return null;
          case 13:
            E(L);
            d = b.memoizedState;
            if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
              if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f = false;
              else if (f = Gg(b), null !== d && null !== d.dehydrated) {
                if (null === a) {
                  if (!f) throw Error(p(318));
                  f = b.memoizedState;
                  f = null !== f ? f.dehydrated : null;
                  if (!f) throw Error(p(317));
                  f[Of] = b;
                } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
                S(b);
                f = false;
              } else null !== zg && (Fj(zg), zg = null), f = true;
              if (!f) return b.flags & 65536 ? b : null;
            }
            if (0 !== (b.flags & 128)) return b.lanes = c, b;
            d = null !== d;
            d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
            null !== b.updateQueue && (b.flags |= 4);
            S(b);
            return null;
          case 4:
            return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
          case 10:
            return ah(b.type._context), S(b), null;
          case 17:
            return Zf(b.type) && $f(), S(b), null;
          case 19:
            E(L);
            f = b.memoizedState;
            if (null === f) return S(b), null;
            d = 0 !== (b.flags & 128);
            g = f.rendering;
            if (null === g) if (d) Dj(f, false);
            else {
              if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
                g = Ch(a);
                if (null !== g) {
                  b.flags |= 128;
                  Dj(f, false);
                  d = g.updateQueue;
                  null !== d && (b.updateQueue = d, b.flags |= 4);
                  b.subtreeFlags = 0;
                  d = c;
                  for (c = b.child; null !== c; ) f = c, a = d, f.flags &= 14680066, g = f.alternate, null === g ? (f.childLanes = 0, f.lanes = a, f.child = null, f.subtreeFlags = 0, f.memoizedProps = null, f.memoizedState = null, f.updateQueue = null, f.dependencies = null, f.stateNode = null) : (f.childLanes = g.childLanes, f.lanes = g.lanes, f.child = g.child, f.subtreeFlags = 0, f.deletions = null, f.memoizedProps = g.memoizedProps, f.memoizedState = g.memoizedState, f.updateQueue = g.updateQueue, f.type = g.type, a = g.dependencies, f.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
                  G(L, L.current & 1 | 2);
                  return b.child;
                }
                a = a.sibling;
              }
              null !== f.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f, false), b.lanes = 4194304);
            }
            else {
              if (!d) if (a = Ch(g), null !== a) {
                if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f, true), null === f.tail && "hidden" === f.tailMode && !g.alternate && !I) return S(b), null;
              } else 2 * B() - f.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f, false), b.lanes = 4194304);
              f.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f.last, null !== c ? c.sibling = g : b.child = g, f.last = g);
            }
            if (null !== f.tail) return b = f.tail, f.rendering = b, f.tail = b.sibling, f.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
            S(b);
            return null;
          case 22:
          case 23:
            return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
          case 24:
            return null;
          case 25:
            return null;
        }
        throw Error(p(156, b.tag));
      }
      function Ij(a, b) {
        wg(b);
        switch (b.tag) {
          case 1:
            return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
          case 3:
            return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
          case 5:
            return Bh(b), null;
          case 13:
            E(L);
            a = b.memoizedState;
            if (null !== a && null !== a.dehydrated) {
              if (null === b.alternate) throw Error(p(340));
              Ig();
            }
            a = b.flags;
            return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
          case 19:
            return E(L), null;
          case 4:
            return zh(), null;
          case 10:
            return ah(b.type._context), null;
          case 22:
          case 23:
            return Hj(), null;
          case 24:
            return null;
          default:
            return null;
        }
      }
      var Jj = false;
      var U = false;
      var Kj = "function" === typeof WeakSet ? WeakSet : Set;
      var V = null;
      function Lj(a, b) {
        var c = a.ref;
        if (null !== c) if ("function" === typeof c) try {
          c(null);
        } catch (d) {
          W(a, b, d);
        }
        else c.current = null;
      }
      function Mj(a, b, c) {
        try {
          c();
        } catch (d) {
          W(a, b, d);
        }
      }
      var Nj = false;
      function Oj(a, b) {
        Cf = dd;
        a = Me();
        if (Ne(a)) {
          if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
          else a: {
            c = (c = a.ownerDocument) && c.defaultView || window;
            var d = c.getSelection && c.getSelection();
            if (d && 0 !== d.rangeCount) {
              c = d.anchorNode;
              var e = d.anchorOffset, f = d.focusNode;
              d = d.focusOffset;
              try {
                c.nodeType, f.nodeType;
              } catch (F) {
                c = null;
                break a;
              }
              var g = 0, h = -1, k = -1, l = 0, m = 0, q = a, r = null;
              b: for (; ; ) {
                for (var y; ; ) {
                  q !== c || 0 !== e && 3 !== q.nodeType || (h = g + e);
                  q !== f || 0 !== d && 3 !== q.nodeType || (k = g + d);
                  3 === q.nodeType && (g += q.nodeValue.length);
                  if (null === (y = q.firstChild)) break;
                  r = q;
                  q = y;
                }
                for (; ; ) {
                  if (q === a) break b;
                  r === c && ++l === e && (h = g);
                  r === f && ++m === d && (k = g);
                  if (null !== (y = q.nextSibling)) break;
                  q = r;
                  r = q.parentNode;
                }
                q = y;
              }
              c = -1 === h || -1 === k ? null : { start: h, end: k };
            } else c = null;
          }
          c = c || { start: 0, end: 0 };
        } else c = null;
        Df = { focusedElem: a, selectionRange: c };
        dd = false;
        for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
        else for (; null !== V; ) {
          b = V;
          try {
            var n = b.alternate;
            if (0 !== (b.flags & 1024)) switch (b.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (null !== n) {
                  var t = n.memoizedProps, J = n.memoizedState, x = b.stateNode, w = x.getSnapshotBeforeUpdate(b.elementType === b.type ? t : Ci(b.type, t), J);
                  x.__reactInternalSnapshotBeforeUpdate = w;
                }
                break;
              case 3:
                var u = b.stateNode.containerInfo;
                1 === u.nodeType ? u.textContent = "" : 9 === u.nodeType && u.documentElement && u.removeChild(u.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(p(163));
            }
          } catch (F) {
            W(b, b.return, F);
          }
          a = b.sibling;
          if (null !== a) {
            a.return = b.return;
            V = a;
            break;
          }
          V = b.return;
        }
        n = Nj;
        Nj = false;
        return n;
      }
      function Pj(a, b, c) {
        var d = b.updateQueue;
        d = null !== d ? d.lastEffect : null;
        if (null !== d) {
          var e = d = d.next;
          do {
            if ((e.tag & a) === a) {
              var f = e.destroy;
              e.destroy = void 0;
              void 0 !== f && Mj(b, c, f);
            }
            e = e.next;
          } while (e !== d);
        }
      }
      function Qj(a, b) {
        b = b.updateQueue;
        b = null !== b ? b.lastEffect : null;
        if (null !== b) {
          var c = b = b.next;
          do {
            if ((c.tag & a) === a) {
              var d = c.create;
              c.destroy = d();
            }
            c = c.next;
          } while (c !== b);
        }
      }
      function Rj(a) {
        var b = a.ref;
        if (null !== b) {
          var c = a.stateNode;
          switch (a.tag) {
            case 5:
              a = c;
              break;
            default:
              a = c;
          }
          "function" === typeof b ? b(a) : b.current = a;
        }
      }
      function Sj(a) {
        var b = a.alternate;
        null !== b && (a.alternate = null, Sj(b));
        a.child = null;
        a.deletions = null;
        a.sibling = null;
        5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
        a.stateNode = null;
        a.return = null;
        a.dependencies = null;
        a.memoizedProps = null;
        a.memoizedState = null;
        a.pendingProps = null;
        a.stateNode = null;
        a.updateQueue = null;
      }
      function Tj(a) {
        return 5 === a.tag || 3 === a.tag || 4 === a.tag;
      }
      function Uj(a) {
        a: for (; ; ) {
          for (; null === a.sibling; ) {
            if (null === a.return || Tj(a.return)) return null;
            a = a.return;
          }
          a.sibling.return = a.return;
          for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
            if (a.flags & 2) continue a;
            if (null === a.child || 4 === a.tag) continue a;
            else a.child.return = a, a = a.child;
          }
          if (!(a.flags & 2)) return a.stateNode;
        }
      }
      function Vj(a, b, c) {
        var d = a.tag;
        if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
        else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
      }
      function Wj(a, b, c) {
        var d = a.tag;
        if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
        else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
      }
      var X = null;
      var Xj = false;
      function Yj(a, b, c) {
        for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
      }
      function Zj(a, b, c) {
        if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
          lc.onCommitFiberUnmount(kc, c);
        } catch (h) {
        }
        switch (c.tag) {
          case 5:
            U || Lj(c, b);
          case 6:
            var d = X, e = Xj;
            X = null;
            Yj(a, b, c);
            X = d;
            Xj = e;
            null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X.removeChild(c.stateNode));
            break;
          case 18:
            null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X, c.stateNode));
            break;
          case 4:
            d = X;
            e = Xj;
            X = c.stateNode.containerInfo;
            Xj = true;
            Yj(a, b, c);
            X = d;
            Xj = e;
            break;
          case 0:
          case 11:
          case 14:
          case 15:
            if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
              e = d = d.next;
              do {
                var f = e, g = f.destroy;
                f = f.tag;
                void 0 !== g && (0 !== (f & 2) ? Mj(c, b, g) : 0 !== (f & 4) && Mj(c, b, g));
                e = e.next;
              } while (e !== d);
            }
            Yj(a, b, c);
            break;
          case 1:
            if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
              d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
            } catch (h) {
              W(c, b, h);
            }
            Yj(a, b, c);
            break;
          case 21:
            Yj(a, b, c);
            break;
          case 22:
            c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
            break;
          default:
            Yj(a, b, c);
        }
      }
      function ak(a) {
        var b = a.updateQueue;
        if (null !== b) {
          a.updateQueue = null;
          var c = a.stateNode;
          null === c && (c = a.stateNode = new Kj());
          b.forEach(function(b2) {
            var d = bk.bind(null, a, b2);
            c.has(b2) || (c.add(b2), b2.then(d, d));
          });
        }
      }
      function ck(a, b) {
        var c = b.deletions;
        if (null !== c) for (var d = 0; d < c.length; d++) {
          var e = c[d];
          try {
            var f = a, g = b, h = g;
            a: for (; null !== h; ) {
              switch (h.tag) {
                case 5:
                  X = h.stateNode;
                  Xj = false;
                  break a;
                case 3:
                  X = h.stateNode.containerInfo;
                  Xj = true;
                  break a;
                case 4:
                  X = h.stateNode.containerInfo;
                  Xj = true;
                  break a;
              }
              h = h.return;
            }
            if (null === X) throw Error(p(160));
            Zj(f, g, e);
            X = null;
            Xj = false;
            var k = e.alternate;
            null !== k && (k.return = null);
            e.return = null;
          } catch (l) {
            W(e, b, l);
          }
        }
        if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
      }
      function dk(a, b) {
        var c = a.alternate, d = a.flags;
        switch (a.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            ck(b, a);
            ek(a);
            if (d & 4) {
              try {
                Pj(3, a, a.return), Qj(3, a);
              } catch (t) {
                W(a, a.return, t);
              }
              try {
                Pj(5, a, a.return);
              } catch (t) {
                W(a, a.return, t);
              }
            }
            break;
          case 1:
            ck(b, a);
            ek(a);
            d & 512 && null !== c && Lj(c, c.return);
            break;
          case 5:
            ck(b, a);
            ek(a);
            d & 512 && null !== c && Lj(c, c.return);
            if (a.flags & 32) {
              var e = a.stateNode;
              try {
                ob(e, "");
              } catch (t) {
                W(a, a.return, t);
              }
            }
            if (d & 4 && (e = a.stateNode, null != e)) {
              var f = a.memoizedProps, g = null !== c ? c.memoizedProps : f, h = a.type, k = a.updateQueue;
              a.updateQueue = null;
              if (null !== k) try {
                "input" === h && "radio" === f.type && null != f.name && ab(e, f);
                vb(h, g);
                var l = vb(h, f);
                for (g = 0; g < k.length; g += 2) {
                  var m = k[g], q = k[g + 1];
                  "style" === m ? sb(e, q) : "dangerouslySetInnerHTML" === m ? nb(e, q) : "children" === m ? ob(e, q) : ta(e, m, q, l);
                }
                switch (h) {
                  case "input":
                    bb(e, f);
                    break;
                  case "textarea":
                    ib(e, f);
                    break;
                  case "select":
                    var r = e._wrapperState.wasMultiple;
                    e._wrapperState.wasMultiple = !!f.multiple;
                    var y = f.value;
                    null != y ? fb(e, !!f.multiple, y, false) : r !== !!f.multiple && (null != f.defaultValue ? fb(
                      e,
                      !!f.multiple,
                      f.defaultValue,
                      true
                    ) : fb(e, !!f.multiple, f.multiple ? [] : "", false));
                }
                e[Pf] = f;
              } catch (t) {
                W(a, a.return, t);
              }
            }
            break;
          case 6:
            ck(b, a);
            ek(a);
            if (d & 4) {
              if (null === a.stateNode) throw Error(p(162));
              e = a.stateNode;
              f = a.memoizedProps;
              try {
                e.nodeValue = f;
              } catch (t) {
                W(a, a.return, t);
              }
            }
            break;
          case 3:
            ck(b, a);
            ek(a);
            if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
              bd(b.containerInfo);
            } catch (t) {
              W(a, a.return, t);
            }
            break;
          case 4:
            ck(b, a);
            ek(a);
            break;
          case 13:
            ck(b, a);
            ek(a);
            e = a.child;
            e.flags & 8192 && (f = null !== e.memoizedState, e.stateNode.isHidden = f, !f || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
            d & 4 && ak(a);
            break;
          case 22:
            m = null !== c && null !== c.memoizedState;
            a.mode & 1 ? (U = (l = U) || m, ck(b, a), U = l) : ck(b, a);
            ek(a);
            if (d & 8192) {
              l = null !== a.memoizedState;
              if ((a.stateNode.isHidden = l) && !m && 0 !== (a.mode & 1)) for (V = a, m = a.child; null !== m; ) {
                for (q = V = m; null !== V; ) {
                  r = V;
                  y = r.child;
                  switch (r.tag) {
                    case 0:
                    case 11:
                    case 14:
                    case 15:
                      Pj(4, r, r.return);
                      break;
                    case 1:
                      Lj(r, r.return);
                      var n = r.stateNode;
                      if ("function" === typeof n.componentWillUnmount) {
                        d = r;
                        c = r.return;
                        try {
                          b = d, n.props = b.memoizedProps, n.state = b.memoizedState, n.componentWillUnmount();
                        } catch (t) {
                          W(d, c, t);
                        }
                      }
                      break;
                    case 5:
                      Lj(r, r.return);
                      break;
                    case 22:
                      if (null !== r.memoizedState) {
                        gk(q);
                        continue;
                      }
                  }
                  null !== y ? (y.return = r, V = y) : gk(q);
                }
                m = m.sibling;
              }
              a: for (m = null, q = a; ; ) {
                if (5 === q.tag) {
                  if (null === m) {
                    m = q;
                    try {
                      e = q.stateNode, l ? (f = e.style, "function" === typeof f.setProperty ? f.setProperty("display", "none", "important") : f.display = "none") : (h = q.stateNode, k = q.memoizedProps.style, g = void 0 !== k && null !== k && k.hasOwnProperty("display") ? k.display : null, h.style.display = rb("display", g));
                    } catch (t) {
                      W(a, a.return, t);
                    }
                  }
                } else if (6 === q.tag) {
                  if (null === m) try {
                    q.stateNode.nodeValue = l ? "" : q.memoizedProps;
                  } catch (t) {
                    W(a, a.return, t);
                  }
                } else if ((22 !== q.tag && 23 !== q.tag || null === q.memoizedState || q === a) && null !== q.child) {
                  q.child.return = q;
                  q = q.child;
                  continue;
                }
                if (q === a) break a;
                for (; null === q.sibling; ) {
                  if (null === q.return || q.return === a) break a;
                  m === q && (m = null);
                  q = q.return;
                }
                m === q && (m = null);
                q.sibling.return = q.return;
                q = q.sibling;
              }
            }
            break;
          case 19:
            ck(b, a);
            ek(a);
            d & 4 && ak(a);
            break;
          case 21:
            break;
          default:
            ck(
              b,
              a
            ), ek(a);
        }
      }
      function ek(a) {
        var b = a.flags;
        if (b & 2) {
          try {
            a: {
              for (var c = a.return; null !== c; ) {
                if (Tj(c)) {
                  var d = c;
                  break a;
                }
                c = c.return;
              }
              throw Error(p(160));
            }
            switch (d.tag) {
              case 5:
                var e = d.stateNode;
                d.flags & 32 && (ob(e, ""), d.flags &= -33);
                var f = Uj(a);
                Wj(a, f, e);
                break;
              case 3:
              case 4:
                var g = d.stateNode.containerInfo, h = Uj(a);
                Vj(a, h, g);
                break;
              default:
                throw Error(p(161));
            }
          } catch (k) {
            W(a, a.return, k);
          }
          a.flags &= -3;
        }
        b & 4096 && (a.flags &= -4097);
      }
      function hk(a, b, c) {
        V = a;
        ik(a, b, c);
      }
      function ik(a, b, c) {
        for (var d = 0 !== (a.mode & 1); null !== V; ) {
          var e = V, f = e.child;
          if (22 === e.tag && d) {
            var g = null !== e.memoizedState || Jj;
            if (!g) {
              var h = e.alternate, k = null !== h && null !== h.memoizedState || U;
              h = Jj;
              var l = U;
              Jj = g;
              if ((U = k) && !l) for (V = e; null !== V; ) g = V, k = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k ? (k.return = g, V = k) : jk(e);
              for (; null !== f; ) V = f, ik(f, b, c), f = f.sibling;
              V = e;
              Jj = h;
              U = l;
            }
            kk(a, b, c);
          } else 0 !== (e.subtreeFlags & 8772) && null !== f ? (f.return = e, V = f) : kk(a, b, c);
        }
      }
      function kk(a) {
        for (; null !== V; ) {
          var b = V;
          if (0 !== (b.flags & 8772)) {
            var c = b.alternate;
            try {
              if (0 !== (b.flags & 8772)) switch (b.tag) {
                case 0:
                case 11:
                case 15:
                  U || Qj(5, b);
                  break;
                case 1:
                  var d = b.stateNode;
                  if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
                  else {
                    var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
                    d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
                  }
                  var f = b.updateQueue;
                  null !== f && sh(b, f, d);
                  break;
                case 3:
                  var g = b.updateQueue;
                  if (null !== g) {
                    c = null;
                    if (null !== b.child) switch (b.child.tag) {
                      case 5:
                        c = b.child.stateNode;
                        break;
                      case 1:
                        c = b.child.stateNode;
                    }
                    sh(b, g, c);
                  }
                  break;
                case 5:
                  var h = b.stateNode;
                  if (null === c && b.flags & 4) {
                    c = h;
                    var k = b.memoizedProps;
                    switch (b.type) {
                      case "button":
                      case "input":
                      case "select":
                      case "textarea":
                        k.autoFocus && c.focus();
                        break;
                      case "img":
                        k.src && (c.src = k.src);
                    }
                  }
                  break;
                case 6:
                  break;
                case 4:
                  break;
                case 12:
                  break;
                case 13:
                  if (null === b.memoizedState) {
                    var l = b.alternate;
                    if (null !== l) {
                      var m = l.memoizedState;
                      if (null !== m) {
                        var q = m.dehydrated;
                        null !== q && bd(q);
                      }
                    }
                  }
                  break;
                case 19:
                case 17:
                case 21:
                case 22:
                case 23:
                case 25:
                  break;
                default:
                  throw Error(p(163));
              }
              U || b.flags & 512 && Rj(b);
            } catch (r) {
              W(b, b.return, r);
            }
          }
          if (b === a) {
            V = null;
            break;
          }
          c = b.sibling;
          if (null !== c) {
            c.return = b.return;
            V = c;
            break;
          }
          V = b.return;
        }
      }
      function gk(a) {
        for (; null !== V; ) {
          var b = V;
          if (b === a) {
            V = null;
            break;
          }
          var c = b.sibling;
          if (null !== c) {
            c.return = b.return;
            V = c;
            break;
          }
          V = b.return;
        }
      }
      function jk(a) {
        for (; null !== V; ) {
          var b = V;
          try {
            switch (b.tag) {
              case 0:
              case 11:
              case 15:
                var c = b.return;
                try {
                  Qj(4, b);
                } catch (k) {
                  W(b, c, k);
                }
                break;
              case 1:
                var d = b.stateNode;
                if ("function" === typeof d.componentDidMount) {
                  var e = b.return;
                  try {
                    d.componentDidMount();
                  } catch (k) {
                    W(b, e, k);
                  }
                }
                var f = b.return;
                try {
                  Rj(b);
                } catch (k) {
                  W(b, f, k);
                }
                break;
              case 5:
                var g = b.return;
                try {
                  Rj(b);
                } catch (k) {
                  W(b, g, k);
                }
            }
          } catch (k) {
            W(b, b.return, k);
          }
          if (b === a) {
            V = null;
            break;
          }
          var h = b.sibling;
          if (null !== h) {
            h.return = b.return;
            V = h;
            break;
          }
          V = b.return;
        }
      }
      var lk = Math.ceil;
      var mk = ua.ReactCurrentDispatcher;
      var nk = ua.ReactCurrentOwner;
      var ok = ua.ReactCurrentBatchConfig;
      var K = 0;
      var Q = null;
      var Y = null;
      var Z = 0;
      var fj = 0;
      var ej = Uf(0);
      var T = 0;
      var pk = null;
      var rh = 0;
      var qk = 0;
      var rk = 0;
      var sk = null;
      var tk = null;
      var fk = 0;
      var Gj = Infinity;
      var uk = null;
      var Oi = false;
      var Pi = null;
      var Ri = null;
      var vk = false;
      var wk = null;
      var xk = 0;
      var yk = 0;
      var zk = null;
      var Ak = -1;
      var Bk = 0;
      function R() {
        return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
      }
      function yi(a) {
        if (0 === (a.mode & 1)) return 1;
        if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
        if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
        a = C;
        if (0 !== a) return a;
        a = window.event;
        a = void 0 === a ? 16 : jd(a.type);
        return a;
      }
      function gi(a, b, c, d) {
        if (50 < yk) throw yk = 0, zk = null, Error(p(185));
        Ac(a, c, d);
        if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
      }
      function Dk(a, b) {
        var c = a.callbackNode;
        wc(a, b);
        var d = uc(a, a === Q ? Z : 0);
        if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
        else if (b = d & -d, a.callbackPriority !== b) {
          null != c && bc(c);
          if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
            0 === (K & 6) && jg();
          }), c = null;
          else {
            switch (Dc(d)) {
              case 1:
                c = fc;
                break;
              case 4:
                c = gc;
                break;
              case 16:
                c = hc;
                break;
              case 536870912:
                c = jc;
                break;
              default:
                c = hc;
            }
            c = Fk(c, Gk.bind(null, a));
          }
          a.callbackPriority = b;
          a.callbackNode = c;
        }
      }
      function Gk(a, b) {
        Ak = -1;
        Bk = 0;
        if (0 !== (K & 6)) throw Error(p(327));
        var c = a.callbackNode;
        if (Hk() && a.callbackNode !== c) return null;
        var d = uc(a, a === Q ? Z : 0);
        if (0 === d) return null;
        if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
        else {
          b = d;
          var e = K;
          K |= 2;
          var f = Jk();
          if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
          do
            try {
              Lk();
              break;
            } catch (h) {
              Mk(a, h);
            }
          while (1);
          $g();
          mk.current = f;
          K = e;
          null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
        }
        if (0 !== b) {
          2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
          if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
          if (6 === b) Ck(a, d);
          else {
            e = a.current.alternate;
            if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f = xc(a), 0 !== f && (d = f, b = Nk(a, f))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
            a.finishedWork = e;
            a.finishedLanes = d;
            switch (b) {
              case 0:
              case 1:
                throw Error(p(345));
              case 2:
                Pk(a, tk, uk);
                break;
              case 3:
                Ck(a, d);
                if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
                  if (0 !== uc(a, 0)) break;
                  e = a.suspendedLanes;
                  if ((e & d) !== d) {
                    R();
                    a.pingedLanes |= a.suspendedLanes & e;
                    break;
                  }
                  a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
                  break;
                }
                Pk(a, tk, uk);
                break;
              case 4:
                Ck(a, d);
                if ((d & 4194240) === d) break;
                b = a.eventTimes;
                for (e = -1; 0 < d; ) {
                  var g = 31 - oc(d);
                  f = 1 << g;
                  g = b[g];
                  g > e && (e = g);
                  d &= ~f;
                }
                d = e;
                d = B() - d;
                d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
                if (10 < d) {
                  a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
                  break;
                }
                Pk(a, tk, uk);
                break;
              case 5:
                Pk(a, tk, uk);
                break;
              default:
                throw Error(p(329));
            }
          }
        }
        Dk(a, B());
        return a.callbackNode === c ? Gk.bind(null, a) : null;
      }
      function Nk(a, b) {
        var c = sk;
        a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
        a = Ik(a, b);
        2 !== a && (b = tk, tk = c, null !== b && Fj(b));
        return a;
      }
      function Fj(a) {
        null === tk ? tk = a : tk.push.apply(tk, a);
      }
      function Ok(a) {
        for (var b = a; ; ) {
          if (b.flags & 16384) {
            var c = b.updateQueue;
            if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
              var e = c[d], f = e.getSnapshot;
              e = e.value;
              try {
                if (!He(f(), e)) return false;
              } catch (g) {
                return false;
              }
            }
          }
          c = b.child;
          if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
          else {
            if (b === a) break;
            for (; null === b.sibling; ) {
              if (null === b.return || b.return === a) return true;
              b = b.return;
            }
            b.sibling.return = b.return;
            b = b.sibling;
          }
        }
        return true;
      }
      function Ck(a, b) {
        b &= ~rk;
        b &= ~qk;
        a.suspendedLanes |= b;
        a.pingedLanes &= ~b;
        for (a = a.expirationTimes; 0 < b; ) {
          var c = 31 - oc(b), d = 1 << c;
          a[c] = -1;
          b &= ~d;
        }
      }
      function Ek(a) {
        if (0 !== (K & 6)) throw Error(p(327));
        Hk();
        var b = uc(a, 0);
        if (0 === (b & 1)) return Dk(a, B()), null;
        var c = Ik(a, b);
        if (0 !== a.tag && 2 === c) {
          var d = xc(a);
          0 !== d && (b = d, c = Nk(a, d));
        }
        if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
        if (6 === c) throw Error(p(345));
        a.finishedWork = a.current.alternate;
        a.finishedLanes = b;
        Pk(a, tk, uk);
        Dk(a, B());
        return null;
      }
      function Qk(a, b) {
        var c = K;
        K |= 1;
        try {
          return a(b);
        } finally {
          K = c, 0 === K && (Gj = B() + 500, fg && jg());
        }
      }
      function Rk(a) {
        null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
        var b = K;
        K |= 1;
        var c = ok.transition, d = C;
        try {
          if (ok.transition = null, C = 1, a) return a();
        } finally {
          C = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
        }
      }
      function Hj() {
        fj = ej.current;
        E(ej);
      }
      function Kk(a, b) {
        a.finishedWork = null;
        a.finishedLanes = 0;
        var c = a.timeoutHandle;
        -1 !== c && (a.timeoutHandle = -1, Gf(c));
        if (null !== Y) for (c = Y.return; null !== c; ) {
          var d = c;
          wg(d);
          switch (d.tag) {
            case 1:
              d = d.type.childContextTypes;
              null !== d && void 0 !== d && $f();
              break;
            case 3:
              zh();
              E(Wf);
              E(H);
              Eh();
              break;
            case 5:
              Bh(d);
              break;
            case 4:
              zh();
              break;
            case 13:
              E(L);
              break;
            case 19:
              E(L);
              break;
            case 10:
              ah(d.type._context);
              break;
            case 22:
            case 23:
              Hj();
          }
          c = c.return;
        }
        Q = a;
        Y = a = Pg(a.current, null);
        Z = fj = b;
        T = 0;
        pk = null;
        rk = qk = rh = 0;
        tk = sk = null;
        if (null !== fh) {
          for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
            c.interleaved = null;
            var e = d.next, f = c.pending;
            if (null !== f) {
              var g = f.next;
              f.next = e;
              d.next = g;
            }
            c.pending = d;
          }
          fh = null;
        }
        return a;
      }
      function Mk(a, b) {
        do {
          var c = Y;
          try {
            $g();
            Fh.current = Rh;
            if (Ih) {
              for (var d = M.memoizedState; null !== d; ) {
                var e = d.queue;
                null !== e && (e.pending = null);
                d = d.next;
              }
              Ih = false;
            }
            Hh = 0;
            O = N = M = null;
            Jh = false;
            Kh = 0;
            nk.current = null;
            if (null === c || null === c.return) {
              T = 1;
              pk = b;
              Y = null;
              break;
            }
            a: {
              var f = a, g = c.return, h = c, k = b;
              b = Z;
              h.flags |= 32768;
              if (null !== k && "object" === typeof k && "function" === typeof k.then) {
                var l = k, m = h, q = m.tag;
                if (0 === (m.mode & 1) && (0 === q || 11 === q || 15 === q)) {
                  var r = m.alternate;
                  r ? (m.updateQueue = r.updateQueue, m.memoizedState = r.memoizedState, m.lanes = r.lanes) : (m.updateQueue = null, m.memoizedState = null);
                }
                var y = Ui(g);
                if (null !== y) {
                  y.flags &= -257;
                  Vi(y, g, h, f, b);
                  y.mode & 1 && Si(f, l, b);
                  b = y;
                  k = l;
                  var n = b.updateQueue;
                  if (null === n) {
                    var t = /* @__PURE__ */ new Set();
                    t.add(k);
                    b.updateQueue = t;
                  } else n.add(k);
                  break a;
                } else {
                  if (0 === (b & 1)) {
                    Si(f, l, b);
                    tj();
                    break a;
                  }
                  k = Error(p(426));
                }
              } else if (I && h.mode & 1) {
                var J = Ui(g);
                if (null !== J) {
                  0 === (J.flags & 65536) && (J.flags |= 256);
                  Vi(J, g, h, f, b);
                  Jg(Ji(k, h));
                  break a;
                }
              }
              f = k = Ji(k, h);
              4 !== T && (T = 2);
              null === sk ? sk = [f] : sk.push(f);
              f = g;
              do {
                switch (f.tag) {
                  case 3:
                    f.flags |= 65536;
                    b &= -b;
                    f.lanes |= b;
                    var x = Ni(f, k, b);
                    ph(f, x);
                    break a;
                  case 1:
                    h = k;
                    var w = f.type, u = f.stateNode;
                    if (0 === (f.flags & 128) && ("function" === typeof w.getDerivedStateFromError || null !== u && "function" === typeof u.componentDidCatch && (null === Ri || !Ri.has(u)))) {
                      f.flags |= 65536;
                      b &= -b;
                      f.lanes |= b;
                      var F = Qi(f, h, b);
                      ph(f, F);
                      break a;
                    }
                }
                f = f.return;
              } while (null !== f);
            }
            Sk(c);
          } catch (na) {
            b = na;
            Y === c && null !== c && (Y = c = c.return);
            continue;
          }
          break;
        } while (1);
      }
      function Jk() {
        var a = mk.current;
        mk.current = Rh;
        return null === a ? Rh : a;
      }
      function tj() {
        if (0 === T || 3 === T || 2 === T) T = 4;
        null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
      }
      function Ik(a, b) {
        var c = K;
        K |= 2;
        var d = Jk();
        if (Q !== a || Z !== b) uk = null, Kk(a, b);
        do
          try {
            Tk();
            break;
          } catch (e) {
            Mk(a, e);
          }
        while (1);
        $g();
        K = c;
        mk.current = d;
        if (null !== Y) throw Error(p(261));
        Q = null;
        Z = 0;
        return T;
      }
      function Tk() {
        for (; null !== Y; ) Uk(Y);
      }
      function Lk() {
        for (; null !== Y && !cc(); ) Uk(Y);
      }
      function Uk(a) {
        var b = Vk(a.alternate, a, fj);
        a.memoizedProps = a.pendingProps;
        null === b ? Sk(a) : Y = b;
        nk.current = null;
      }
      function Sk(a) {
        var b = a;
        do {
          var c = b.alternate;
          a = b.return;
          if (0 === (b.flags & 32768)) {
            if (c = Ej(c, b, fj), null !== c) {
              Y = c;
              return;
            }
          } else {
            c = Ij(c, b);
            if (null !== c) {
              c.flags &= 32767;
              Y = c;
              return;
            }
            if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
            else {
              T = 6;
              Y = null;
              return;
            }
          }
          b = b.sibling;
          if (null !== b) {
            Y = b;
            return;
          }
          Y = b = a;
        } while (null !== b);
        0 === T && (T = 5);
      }
      function Pk(a, b, c) {
        var d = C, e = ok.transition;
        try {
          ok.transition = null, C = 1, Wk(a, b, c, d);
        } finally {
          ok.transition = e, C = d;
        }
        return null;
      }
      function Wk(a, b, c, d) {
        do
          Hk();
        while (null !== wk);
        if (0 !== (K & 6)) throw Error(p(327));
        c = a.finishedWork;
        var e = a.finishedLanes;
        if (null === c) return null;
        a.finishedWork = null;
        a.finishedLanes = 0;
        if (c === a.current) throw Error(p(177));
        a.callbackNode = null;
        a.callbackPriority = 0;
        var f = c.lanes | c.childLanes;
        Bc(a, f);
        a === Q && (Y = Q = null, Z = 0);
        0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
          Hk();
          return null;
        }));
        f = 0 !== (c.flags & 15990);
        if (0 !== (c.subtreeFlags & 15990) || f) {
          f = ok.transition;
          ok.transition = null;
          var g = C;
          C = 1;
          var h = K;
          K |= 4;
          nk.current = null;
          Oj(a, c);
          dk(c, a);
          Oe(Df);
          dd = !!Cf;
          Df = Cf = null;
          a.current = c;
          hk(c, a, e);
          dc();
          K = h;
          C = g;
          ok.transition = f;
        } else a.current = c;
        vk && (vk = false, wk = a, xk = e);
        f = a.pendingLanes;
        0 === f && (Ri = null);
        mc(c.stateNode, d);
        Dk(a, B());
        if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
        if (Oi) throw Oi = false, a = Pi, Pi = null, a;
        0 !== (xk & 1) && 0 !== a.tag && Hk();
        f = a.pendingLanes;
        0 !== (f & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
        jg();
        return null;
      }
      function Hk() {
        if (null !== wk) {
          var a = Dc(xk), b = ok.transition, c = C;
          try {
            ok.transition = null;
            C = 16 > a ? 16 : a;
            if (null === wk) var d = false;
            else {
              a = wk;
              wk = null;
              xk = 0;
              if (0 !== (K & 6)) throw Error(p(331));
              var e = K;
              K |= 4;
              for (V = a.current; null !== V; ) {
                var f = V, g = f.child;
                if (0 !== (V.flags & 16)) {
                  var h = f.deletions;
                  if (null !== h) {
                    for (var k = 0; k < h.length; k++) {
                      var l = h[k];
                      for (V = l; null !== V; ) {
                        var m = V;
                        switch (m.tag) {
                          case 0:
                          case 11:
                          case 15:
                            Pj(8, m, f);
                        }
                        var q = m.child;
                        if (null !== q) q.return = m, V = q;
                        else for (; null !== V; ) {
                          m = V;
                          var r = m.sibling, y = m.return;
                          Sj(m);
                          if (m === l) {
                            V = null;
                            break;
                          }
                          if (null !== r) {
                            r.return = y;
                            V = r;
                            break;
                          }
                          V = y;
                        }
                      }
                    }
                    var n = f.alternate;
                    if (null !== n) {
                      var t = n.child;
                      if (null !== t) {
                        n.child = null;
                        do {
                          var J = t.sibling;
                          t.sibling = null;
                          t = J;
                        } while (null !== t);
                      }
                    }
                    V = f;
                  }
                }
                if (0 !== (f.subtreeFlags & 2064) && null !== g) g.return = f, V = g;
                else b: for (; null !== V; ) {
                  f = V;
                  if (0 !== (f.flags & 2048)) switch (f.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(9, f, f.return);
                  }
                  var x = f.sibling;
                  if (null !== x) {
                    x.return = f.return;
                    V = x;
                    break b;
                  }
                  V = f.return;
                }
              }
              var w = a.current;
              for (V = w; null !== V; ) {
                g = V;
                var u = g.child;
                if (0 !== (g.subtreeFlags & 2064) && null !== u) u.return = g, V = u;
                else b: for (g = w; null !== V; ) {
                  h = V;
                  if (0 !== (h.flags & 2048)) try {
                    switch (h.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Qj(9, h);
                    }
                  } catch (na) {
                    W(h, h.return, na);
                  }
                  if (h === g) {
                    V = null;
                    break b;
                  }
                  var F = h.sibling;
                  if (null !== F) {
                    F.return = h.return;
                    V = F;
                    break b;
                  }
                  V = h.return;
                }
              }
              K = e;
              jg();
              if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
                lc.onPostCommitFiberRoot(kc, a);
              } catch (na) {
              }
              d = true;
            }
            return d;
          } finally {
            C = c, ok.transition = b;
          }
        }
        return false;
      }
      function Xk(a, b, c) {
        b = Ji(c, b);
        b = Ni(a, b, 1);
        a = nh(a, b, 1);
        b = R();
        null !== a && (Ac(a, 1, b), Dk(a, b));
      }
      function W(a, b, c) {
        if (3 === a.tag) Xk(a, a, c);
        else for (; null !== b; ) {
          if (3 === b.tag) {
            Xk(b, a, c);
            break;
          } else if (1 === b.tag) {
            var d = b.stateNode;
            if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
              a = Ji(c, a);
              a = Qi(b, a, 1);
              b = nh(b, a, 1);
              a = R();
              null !== b && (Ac(b, 1, a), Dk(b, a));
              break;
            }
          }
          b = b.return;
        }
      }
      function Ti(a, b, c) {
        var d = a.pingCache;
        null !== d && d.delete(b);
        b = R();
        a.pingedLanes |= a.suspendedLanes & c;
        Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
        Dk(a, b);
      }
      function Yk(a, b) {
        0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
        var c = R();
        a = ih(a, b);
        null !== a && (Ac(a, b, c), Dk(a, c));
      }
      function uj(a) {
        var b = a.memoizedState, c = 0;
        null !== b && (c = b.retryLane);
        Yk(a, c);
      }
      function bk(a, b) {
        var c = 0;
        switch (a.tag) {
          case 13:
            var d = a.stateNode;
            var e = a.memoizedState;
            null !== e && (c = e.retryLane);
            break;
          case 19:
            d = a.stateNode;
            break;
          default:
            throw Error(p(314));
        }
        null !== d && d.delete(b);
        Yk(a, c);
      }
      var Vk;
      Vk = function(a, b, c) {
        if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
        else {
          if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
          dh = 0 !== (a.flags & 131072) ? true : false;
        }
        else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
        b.lanes = 0;
        switch (b.tag) {
          case 2:
            var d = b.type;
            ij(a, b);
            a = b.pendingProps;
            var e = Yf(b, H.current);
            ch(b, c);
            e = Nh(null, b, d, a, e, c);
            var f = Sh();
            b.flags |= 1;
            "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f = true, cg(b)) : f = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f, c)) : (b.tag = 0, I && f && vg(b), Xi(null, b, e, c), b = b.child);
            return b;
          case 16:
            d = b.elementType;
            a: {
              ij(a, b);
              a = b.pendingProps;
              e = d._init;
              d = e(d._payload);
              b.type = d;
              e = b.tag = Zk(d);
              a = Ci(d, a);
              switch (e) {
                case 0:
                  b = cj(null, b, d, a, c);
                  break a;
                case 1:
                  b = hj(null, b, d, a, c);
                  break a;
                case 11:
                  b = Yi(null, b, d, a, c);
                  break a;
                case 14:
                  b = $i(null, b, d, Ci(d.type, a), c);
                  break a;
              }
              throw Error(p(
                306,
                d,
                ""
              ));
            }
            return b;
          case 0:
            return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
          case 1:
            return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
          case 3:
            a: {
              kj(b);
              if (null === a) throw Error(p(387));
              d = b.pendingProps;
              f = b.memoizedState;
              e = f.element;
              lh(a, b);
              qh(b, d, null, c);
              var g = b.memoizedState;
              d = g.element;
              if (f.isDehydrated) if (f = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f, b.memoizedState = f, b.flags & 256) {
                e = Ji(Error(p(423)), b);
                b = lj(a, b, d, c, e);
                break a;
              } else if (d !== e) {
                e = Ji(Error(p(424)), b);
                b = lj(a, b, d, c, e);
                break a;
              } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
              else {
                Ig();
                if (d === e) {
                  b = Zi(a, b, c);
                  break a;
                }
                Xi(a, b, d, c);
              }
              b = b.child;
            }
            return b;
          case 5:
            return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f && Ef(d, f) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
          case 6:
            return null === a && Eg(b), null;
          case 13:
            return oj(a, b, c);
          case 4:
            return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
          case 11:
            return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
          case 7:
            return Xi(a, b, b.pendingProps, c), b.child;
          case 8:
            return Xi(a, b, b.pendingProps.children, c), b.child;
          case 12:
            return Xi(a, b, b.pendingProps.children, c), b.child;
          case 10:
            a: {
              d = b.type._context;
              e = b.pendingProps;
              f = b.memoizedProps;
              g = e.value;
              G(Wg, d._currentValue);
              d._currentValue = g;
              if (null !== f) if (He(f.value, g)) {
                if (f.children === e.children && !Wf.current) {
                  b = Zi(a, b, c);
                  break a;
                }
              } else for (f = b.child, null !== f && (f.return = b); null !== f; ) {
                var h = f.dependencies;
                if (null !== h) {
                  g = f.child;
                  for (var k = h.firstContext; null !== k; ) {
                    if (k.context === d) {
                      if (1 === f.tag) {
                        k = mh(-1, c & -c);
                        k.tag = 2;
                        var l = f.updateQueue;
                        if (null !== l) {
                          l = l.shared;
                          var m = l.pending;
                          null === m ? k.next = k : (k.next = m.next, m.next = k);
                          l.pending = k;
                        }
                      }
                      f.lanes |= c;
                      k = f.alternate;
                      null !== k && (k.lanes |= c);
                      bh(
                        f.return,
                        c,
                        b
                      );
                      h.lanes |= c;
                      break;
                    }
                    k = k.next;
                  }
                } else if (10 === f.tag) g = f.type === b.type ? null : f.child;
                else if (18 === f.tag) {
                  g = f.return;
                  if (null === g) throw Error(p(341));
                  g.lanes |= c;
                  h = g.alternate;
                  null !== h && (h.lanes |= c);
                  bh(g, c, b);
                  g = f.sibling;
                } else g = f.child;
                if (null !== g) g.return = f;
                else for (g = f; null !== g; ) {
                  if (g === b) {
                    g = null;
                    break;
                  }
                  f = g.sibling;
                  if (null !== f) {
                    f.return = g.return;
                    g = f;
                    break;
                  }
                  g = g.return;
                }
                f = g;
              }
              Xi(a, b, e.children, c);
              b = b.child;
            }
            return b;
          case 9:
            return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
          case 14:
            return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
          case 15:
            return bj(a, b, b.type, b.pendingProps, c);
          case 17:
            return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
          case 19:
            return xj(a, b, c);
          case 22:
            return dj(a, b, c);
        }
        throw Error(p(156, b.tag));
      };
      function Fk(a, b) {
        return ac(a, b);
      }
      function $k(a, b, c, d) {
        this.tag = a;
        this.key = c;
        this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
        this.index = 0;
        this.ref = null;
        this.pendingProps = b;
        this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
        this.mode = d;
        this.subtreeFlags = this.flags = 0;
        this.deletions = null;
        this.childLanes = this.lanes = 0;
        this.alternate = null;
      }
      function Bg(a, b, c, d) {
        return new $k(a, b, c, d);
      }
      function aj(a) {
        a = a.prototype;
        return !(!a || !a.isReactComponent);
      }
      function Zk(a) {
        if ("function" === typeof a) return aj(a) ? 1 : 0;
        if (void 0 !== a && null !== a) {
          a = a.$$typeof;
          if (a === Da) return 11;
          if (a === Ga) return 14;
        }
        return 2;
      }
      function Pg(a, b) {
        var c = a.alternate;
        null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
        c.flags = a.flags & 14680064;
        c.childLanes = a.childLanes;
        c.lanes = a.lanes;
        c.child = a.child;
        c.memoizedProps = a.memoizedProps;
        c.memoizedState = a.memoizedState;
        c.updateQueue = a.updateQueue;
        b = a.dependencies;
        c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
        c.sibling = a.sibling;
        c.index = a.index;
        c.ref = a.ref;
        return c;
      }
      function Rg(a, b, c, d, e, f) {
        var g = 2;
        d = a;
        if ("function" === typeof a) aj(a) && (g = 1);
        else if ("string" === typeof a) g = 5;
        else a: switch (a) {
          case ya:
            return Tg(c.children, e, f, b);
          case za:
            g = 8;
            e |= 8;
            break;
          case Aa:
            return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f, a;
          case Ea:
            return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f, a;
          case Fa:
            return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f, a;
          case Ia:
            return pj(c, e, f, b);
          default:
            if ("object" === typeof a && null !== a) switch (a.$$typeof) {
              case Ba:
                g = 10;
                break a;
              case Ca:
                g = 9;
                break a;
              case Da:
                g = 11;
                break a;
              case Ga:
                g = 14;
                break a;
              case Ha:
                g = 16;
                d = null;
                break a;
            }
            throw Error(p(130, null == a ? a : typeof a, ""));
        }
        b = Bg(g, c, b, e);
        b.elementType = a;
        b.type = d;
        b.lanes = f;
        return b;
      }
      function Tg(a, b, c, d) {
        a = Bg(7, a, d, b);
        a.lanes = c;
        return a;
      }
      function pj(a, b, c, d) {
        a = Bg(22, a, d, b);
        a.elementType = Ia;
        a.lanes = c;
        a.stateNode = { isHidden: false };
        return a;
      }
      function Qg(a, b, c) {
        a = Bg(6, a, null, b);
        a.lanes = c;
        return a;
      }
      function Sg(a, b, c) {
        b = Bg(4, null !== a.children ? a.children : [], a.key, b);
        b.lanes = c;
        b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
        return b;
      }
      function al(a, b, c, d, e) {
        this.tag = b;
        this.containerInfo = a;
        this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
        this.timeoutHandle = -1;
        this.callbackNode = this.pendingContext = this.context = null;
        this.callbackPriority = 0;
        this.eventTimes = zc(0);
        this.expirationTimes = zc(-1);
        this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
        this.entanglements = zc(0);
        this.identifierPrefix = d;
        this.onRecoverableError = e;
        this.mutableSourceEagerHydrationData = null;
      }
      function bl(a, b, c, d, e, f, g, h, k) {
        a = new al(a, b, c, h, k);
        1 === b ? (b = 1, true === f && (b |= 8)) : b = 0;
        f = Bg(3, null, null, b);
        a.current = f;
        f.stateNode = a;
        f.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
        kh(f);
        return a;
      }
      function cl(a, b, c) {
        var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
        return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
      }
      function dl(a) {
        if (!a) return Vf;
        a = a._reactInternals;
        a: {
          if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
          var b = a;
          do {
            switch (b.tag) {
              case 3:
                b = b.stateNode.context;
                break a;
              case 1:
                if (Zf(b.type)) {
                  b = b.stateNode.__reactInternalMemoizedMergedChildContext;
                  break a;
                }
            }
            b = b.return;
          } while (null !== b);
          throw Error(p(171));
        }
        if (1 === a.tag) {
          var c = a.type;
          if (Zf(c)) return bg(a, c, b);
        }
        return b;
      }
      function el(a, b, c, d, e, f, g, h, k) {
        a = bl(c, d, true, a, e, f, g, h, k);
        a.context = dl(null);
        c = a.current;
        d = R();
        e = yi(c);
        f = mh(d, e);
        f.callback = void 0 !== b && null !== b ? b : null;
        nh(c, f, e);
        a.current.lanes = e;
        Ac(a, e, d);
        Dk(a, d);
        return a;
      }
      function fl(a, b, c, d) {
        var e = b.current, f = R(), g = yi(e);
        c = dl(c);
        null === b.context ? b.context = c : b.pendingContext = c;
        b = mh(f, g);
        b.payload = { element: a };
        d = void 0 === d ? null : d;
        null !== d && (b.callback = d);
        a = nh(e, b, g);
        null !== a && (gi(a, e, g, f), oh(a, e, g));
        return g;
      }
      function gl(a) {
        a = a.current;
        if (!a.child) return null;
        switch (a.child.tag) {
          case 5:
            return a.child.stateNode;
          default:
            return a.child.stateNode;
        }
      }
      function hl(a, b) {
        a = a.memoizedState;
        if (null !== a && null !== a.dehydrated) {
          var c = a.retryLane;
          a.retryLane = 0 !== c && c < b ? c : b;
        }
      }
      function il(a, b) {
        hl(a, b);
        (a = a.alternate) && hl(a, b);
      }
      function jl() {
        return null;
      }
      var kl = "function" === typeof reportError ? reportError : function(a) {
        console.error(a);
      };
      function ll(a) {
        this._internalRoot = a;
      }
      ml.prototype.render = ll.prototype.render = function(a) {
        var b = this._internalRoot;
        if (null === b) throw Error(p(409));
        fl(a, b, null, null);
      };
      ml.prototype.unmount = ll.prototype.unmount = function() {
        var a = this._internalRoot;
        if (null !== a) {
          this._internalRoot = null;
          var b = a.containerInfo;
          Rk(function() {
            fl(null, a, null, null);
          });
          b[uf] = null;
        }
      };
      function ml(a) {
        this._internalRoot = a;
      }
      ml.prototype.unstable_scheduleHydration = function(a) {
        if (a) {
          var b = Hc();
          a = { blockedOn: null, target: a, priority: b };
          for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
          Qc.splice(c, 0, a);
          0 === c && Vc(a);
        }
      };
      function nl(a) {
        return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
      }
      function ol(a) {
        return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
      }
      function pl() {
      }
      function ql(a, b, c, d, e) {
        if (e) {
          if ("function" === typeof d) {
            var f = d;
            d = function() {
              var a2 = gl(g);
              f.call(a2);
            };
          }
          var g = el(b, d, a, 0, null, false, false, "", pl);
          a._reactRootContainer = g;
          a[uf] = g.current;
          sf(8 === a.nodeType ? a.parentNode : a);
          Rk();
          return g;
        }
        for (; e = a.lastChild; ) a.removeChild(e);
        if ("function" === typeof d) {
          var h = d;
          d = function() {
            var a2 = gl(k);
            h.call(a2);
          };
        }
        var k = bl(a, 0, false, null, null, false, false, "", pl);
        a._reactRootContainer = k;
        a[uf] = k.current;
        sf(8 === a.nodeType ? a.parentNode : a);
        Rk(function() {
          fl(b, k, c, d);
        });
        return k;
      }
      function rl(a, b, c, d, e) {
        var f = c._reactRootContainer;
        if (f) {
          var g = f;
          if ("function" === typeof e) {
            var h = e;
            e = function() {
              var a2 = gl(g);
              h.call(a2);
            };
          }
          fl(b, g, a, e);
        } else g = ql(c, b, a, e, d);
        return gl(g);
      }
      Ec = function(a) {
        switch (a.tag) {
          case 3:
            var b = a.stateNode;
            if (b.current.memoizedState.isDehydrated) {
              var c = tc(b.pendingLanes);
              0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
            }
            break;
          case 13:
            Rk(function() {
              var b2 = ih(a, 1);
              if (null !== b2) {
                var c2 = R();
                gi(b2, a, 1, c2);
              }
            }), il(a, 1);
        }
      };
      Fc = function(a) {
        if (13 === a.tag) {
          var b = ih(a, 134217728);
          if (null !== b) {
            var c = R();
            gi(b, a, 134217728, c);
          }
          il(a, 134217728);
        }
      };
      Gc = function(a) {
        if (13 === a.tag) {
          var b = yi(a), c = ih(a, b);
          if (null !== c) {
            var d = R();
            gi(c, a, b, d);
          }
          il(a, b);
        }
      };
      Hc = function() {
        return C;
      };
      Ic = function(a, b) {
        var c = C;
        try {
          return C = a, b();
        } finally {
          C = c;
        }
      };
      yb = function(a, b, c) {
        switch (b) {
          case "input":
            bb(a, c);
            b = c.name;
            if ("radio" === c.type && null != b) {
              for (c = a; c.parentNode; ) c = c.parentNode;
              c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
              for (b = 0; b < c.length; b++) {
                var d = c[b];
                if (d !== a && d.form === a.form) {
                  var e = Db(d);
                  if (!e) throw Error(p(90));
                  Wa(d);
                  bb(d, e);
                }
              }
            }
            break;
          case "textarea":
            ib(a, c);
            break;
          case "select":
            b = c.value, null != b && fb(a, !!c.multiple, b, false);
        }
      };
      Gb = Qk;
      Hb = Rk;
      var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] };
      var tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
      var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
        a = Zb(a);
        return null === a ? null : a.stateNode;
      }, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
      if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
        vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (!vl.isDisabled && vl.supportsFiber) try {
          kc = vl.inject(ul), lc = vl;
        } catch (a) {
        }
      }
      var vl;
      exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
      exports.createPortal = function(a, b) {
        var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
        if (!nl(b)) throw Error(p(200));
        return cl(a, b, null, c);
      };
      exports.createRoot = function(a, b) {
        if (!nl(a)) throw Error(p(299));
        var c = false, d = "", e = kl;
        null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
        b = bl(a, 1, false, null, null, c, false, d, e);
        a[uf] = b.current;
        sf(8 === a.nodeType ? a.parentNode : a);
        return new ll(b);
      };
      exports.findDOMNode = function(a) {
        if (null == a) return null;
        if (1 === a.nodeType) return a;
        var b = a._reactInternals;
        if (void 0 === b) {
          if ("function" === typeof a.render) throw Error(p(188));
          a = Object.keys(a).join(",");
          throw Error(p(268, a));
        }
        a = Zb(b);
        a = null === a ? null : a.stateNode;
        return a;
      };
      exports.flushSync = function(a) {
        return Rk(a);
      };
      exports.hydrate = function(a, b, c) {
        if (!ol(b)) throw Error(p(200));
        return rl(null, a, b, true, c);
      };
      exports.hydrateRoot = function(a, b, c) {
        if (!nl(a)) throw Error(p(405));
        var d = null != c && c.hydratedSources || null, e = false, f = "", g = kl;
        null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
        b = el(b, null, a, 1, null != c ? c : null, e, false, f, g);
        a[uf] = b.current;
        sf(a);
        if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
          c,
          e
        );
        return new ml(b);
      };
      exports.render = function(a, b, c) {
        if (!ol(b)) throw Error(p(200));
        return rl(null, a, b, false, c);
      };
      exports.unmountComponentAtNode = function(a) {
        if (!ol(a)) throw Error(p(40));
        return a._reactRootContainer ? (Rk(function() {
          rl(null, null, a, false, function() {
            a._reactRootContainer = null;
            a[uf] = null;
          });
        }), true) : false;
      };
      exports.unstable_batchedUpdates = Qk;
      exports.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
        if (!ol(c)) throw Error(p(200));
        if (null == a || void 0 === a._reactInternals) throw Error(p(38));
        return rl(a, b, c, false, d);
      };
      exports.version = "18.3.1-next-f1338f8080-20240426";
    }
  });

  // node_modules/react-dom/index.js
  var require_react_dom = __commonJS({
    "node_modules/react-dom/index.js"(exports, module) {
      "use strict";
      function checkDCE() {
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
          return;
        }
        if (false) {
          throw new Error("^_^");
        }
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
        } catch (err) {
          console.error(err);
        }
      }
      if (true) {
        checkDCE();
        module.exports = require_react_dom_production_min();
      } else {
        module.exports = null;
      }
    }
  });

  // node_modules/react-dom/client.js
  var require_client = __commonJS({
    "node_modules/react-dom/client.js"(exports) {
      "use strict";
      var m = require_react_dom();
      if (true) {
        exports.createRoot = m.createRoot;
        exports.hydrateRoot = m.hydrateRoot;
      } else {
        i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        exports.createRoot = function(c, o) {
          i.usingClientEntryPoint = true;
          try {
            return m.createRoot(c, o);
          } finally {
            i.usingClientEntryPoint = false;
          }
        };
        exports.hydrateRoot = function(c, h, o) {
          i.usingClientEntryPoint = true;
          try {
            return m.hydrateRoot(c, h, o);
          } finally {
            i.usingClientEntryPoint = false;
          }
        };
      }
      var i;
    }
  });

  // node_modules/react/cjs/react-jsx-runtime.production.min.js
  var require_react_jsx_runtime_production_min = __commonJS({
    "node_modules/react/cjs/react-jsx-runtime.production.min.js"(exports) {
      "use strict";
      var f = require_react();
      var k = Symbol.for("react.element");
      var l = Symbol.for("react.fragment");
      var m = Object.prototype.hasOwnProperty;
      var n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner;
      var p = { key: true, ref: true, __self: true, __source: true };
      function q(c, a, g) {
        var b, d = {}, e = null, h = null;
        void 0 !== g && (e = "" + g);
        void 0 !== a.key && (e = "" + a.key);
        void 0 !== a.ref && (h = a.ref);
        for (b in a) m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
        if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
        return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
      }
      exports.Fragment = l;
      exports.jsx = q;
      exports.jsxs = q;
    }
  });

  // node_modules/react/jsx-runtime.js
  var require_jsx_runtime = __commonJS({
    "node_modules/react/jsx-runtime.js"(exports, module) {
      "use strict";
      if (true) {
        module.exports = require_react_jsx_runtime_production_min();
      } else {
        module.exports = null;
      }
    }
  });

  // clonelevel/src/inspector/inspector.tsx
  var import_client = __toESM(require_client(), 1);
  var import_react = __toESM(require_react(), 1);

  // clonelevel/src/core/inspector/payload-schema.ts
  var NOISE_DOMAINS = [
    "reqmetrics",
    "clarity.ms",
    "clarity.com",
    "pendo.io",
    "pendo",
    "sentry.io",
    "sentry",
    ".beacon.",
    "beacon.",
    "analytics",
    "tracking",
    "telemetry",
    "hotjar.com",
    "hotjar",
    "intercom.io",
    "intercom",
    "mixpanel.com",
    "mixpanel",
    "segment.io",
    "segment.com",
    "fullstory.com",
    "fullstory",
    "datadog.com",
    "datadog-rum",
    "logrocket.com",
    "logrocket",
    "amplitude.com",
    "amplitude",
    "heap.io",
    "heapanalytics",
    "mouseflow.com",
    "tealium.com",
    "tealiumiq",
    "optimizely.com",
    "hubspot.com/analytics",
    "doubleclick.net",
    "google-analytics.com",
    "googletagmanager.com",
    "nr-data.net",
    // New Relic
    "nr-rum",
    "bugsnag.com",
    "rollbar.com"
  ];
  var HL_DOMAINS = [
    "gohighlevel.com",
    "leadconnectorhq.com",
    "highlevel.com"
  ];
  var SAVE_PATHS = [
    "/save",
    "/update",
    "/draft",
    "/publish",
    "/upsert",
    "/savepage",
    "/savefunnel",
    "/autosave"
  ];
  var BUILDER_PATHS = [
    "/page",
    "/pages",
    "/site",
    "/sites",
    "/funnel",
    "/funnels",
    "/builder",
    "/location",
    "/object",
    "/element",
    "/component",
    "/graphql"
  ];
  var BUILDER_SCHEMA_KEYS = [
    "page",
    "pages",
    "site",
    "sites",
    "funnel",
    "funnels",
    "sections",
    "rows",
    "columns",
    "elements",
    "styles",
    "layout",
    "content",
    "settings",
    "draft",
    "publish",
    "blocks",
    "nodes",
    "steps",
    "children",
    "components"
  ];
  function detectStructuredJson(text) {
    if (!text || text.trim() === "" || text === "(empty)") return "none";
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return "none";
    }
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return Array.isArray(parsed) && parsed.length > 0 ? "structured-json" : "json";
    }
    const obj = parsed;
    const hasNested = Object.values(obj).some(
      (v) => typeof v === "object" && v !== null
    );
    if (!hasNested) return "json";
    const keys = Object.keys(obj).map((k) => k.toLowerCase());
    const hasBuilderKeys = BUILDER_SCHEMA_KEYS.some((k) => keys.includes(k));
    return hasBuilderKeys ? "possible-builder-schema" : "structured-json";
  }
  function computePriorityScore(snap, saveMarkTs, loadMarkTs, nearWindowMs = 3e4) {
    const url = snap.requestUrl.toLowerCase();
    let domain = 0, path = 0, method = 0;
    let reqBody = 0, respBody = 0, reqJson = 0, respJson = 0;
    let reqSchema = 0, respSchema = 0, nearSave = 0, nearLoad = 0;
    if (HL_DOMAINS.some((d) => url.includes(d))) domain = 40;
    if (SAVE_PATHS.some((p) => url.includes(p))) path = 30;
    else if (BUILDER_PATHS.some((p) => url.includes(p))) path = 20;
    const m = snap.method.toUpperCase();
    if (m === "POST" || m === "PUT" || m === "PATCH") method = 15;
    else if (m === "GET" && path > 0) method = 5;
    const hasReqBody = !!snap.requestBodyText && snap.requestBodyText.length > 2;
    const hasRespBody = snap.payloadSize > 10 || !!snap.rawBody && snap.rawBody.length > 10;
    if (hasReqBody) reqBody = 10;
    if (hasRespBody) respBody = 10;
    const reqStructured = hasReqBody ? detectStructuredJson(snap.requestBodyText) : "none";
    const respStructured = hasRespBody ? detectStructuredJson(snap.rawBody) : "none";
    if (reqStructured !== "none") reqJson = 10;
    if (reqStructured === "possible-builder-schema") reqSchema = 25;
    else if (reqStructured === "structured-json") reqSchema = 10;
    if (respStructured !== "none") respJson = 10;
    if (respStructured === "possible-builder-schema") respSchema = 25;
    else if (respStructured === "structured-json") respSchema = 10;
    const reqTime = new Date(snap.timestamp).getTime();
    if (saveMarkTs !== null && reqTime >= saveMarkTs && reqTime <= saveMarkTs + nearWindowMs) nearSave = 20;
    if (loadMarkTs !== null && reqTime >= loadMarkTs && reqTime <= loadMarkTs + nearWindowMs) nearLoad = 10;
    const raw = domain + path + method + reqBody + respBody + reqJson + respJson + reqSchema + respSchema + nearSave + nearLoad;
    const maxRaw = 40 + 30 + 15 + 10 + 10 + 10 + 10 + 25 + 25 + 20 + 10;
    const score = Math.round(Math.min(raw / maxRaw * 100, 100));
    return { score, domain, path, method, reqBody, respBody, reqJson, respJson, reqSchema, respSchema, nearSave, nearLoad };
  }
  function diffSnapshots(a, b) {
    const base = {
      snapshotAId: a.id,
      snapshotBId: b.id,
      addedKeys: [],
      removedKeys: [],
      changedKeys: [],
      unchangedKeys: [],
      parseError: null
    };
    let objA;
    let objB;
    try {
      objA = JSON.parse(a.rawBody);
    } catch {
      base.parseError = `Snapshot A (${a.id}) is not valid JSON`;
      return base;
    }
    try {
      objB = JSON.parse(b.rawBody);
    } catch {
      base.parseError = `Snapshot B (${b.id}) is not valid JSON`;
      return base;
    }
    if (typeof objA !== "object" || objA === null) {
      base.parseError = "Snapshot A root is not an object";
      return base;
    }
    if (typeof objB !== "object" || objB === null) {
      base.parseError = "Snapshot B root is not an object";
      return base;
    }
    const keysA = new Set(Object.keys(objA));
    const keysB = new Set(Object.keys(objB));
    for (const k of keysA) {
      if (!keysB.has(k)) {
        base.removedKeys.push(k);
      } else {
        if (JSON.stringify(objA[k]) !== JSON.stringify(objB[k])) base.changedKeys.push(k);
        else base.unchangedKeys.push(k);
      }
    }
    for (const k of keysB) {
      if (!keysA.has(k)) base.addedKeys.push(k);
    }
    return base;
  }

  // clonelevel/src/popup/components/SnapshotDiff.tsx
  var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
  function formatTime(ts) {
    try {
      return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return ts;
    }
  }
  function KeyList({ keys, color, label, icon }) {
    if (keys.length === 0) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "diff-section", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "diff-section-title", style: { color }, children: [
        icon,
        " ",
        label,
        " (",
        keys.length,
        ")"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "diff-keys", children: keys.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "diff-key-badge", style: { borderColor: color, color }, children: k }, k)) })
    ] });
  }
  function tryGetValue(rawBody, key) {
    try {
      const obj = JSON.parse(rawBody);
      const val = obj[key];
      const str = JSON.stringify(val, null, 2);
      return str.length > 300 ? str.slice(0, 300) + "\u2026" : str;
    } catch {
      return "[parse error]";
    }
  }
  function SnapshotDiff({ snapshotA, snapshotB, result, onBack }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "diff-view", "data-testid": "snapshot-diff", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "insp-header", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "btn btn-sm map-back-btn", onClick: onBack, "data-testid": "btn-diff-back", children: "\u2190 Back" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "insp-title", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "insp-title-icon", children: "\u2295" }),
          "Snapshot Diff"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "diff-header-grid", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "diff-snapshot-label diff-label-a", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "diff-slot-badge", children: "A" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "diff-snap-url", title: snapshotA.requestUrl, children: snapshotA.requestUrl.split("/").slice(-3).join("/") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "diff-snap-time", children: formatTime(snapshotA.timestamp) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "diff-snapshot-label diff-label-b", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "diff-slot-badge diff-slot-b", children: "B" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "diff-snap-url", title: snapshotB.requestUrl, children: snapshotB.requestUrl.split("/").slice(-3).join("/") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "diff-snap-time", children: formatTime(snapshotB.timestamp) })
          ] })
        ] })
      ] }),
      result.parseError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "diff-parse-error", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "diff-error-icon", children: "\u26A0" }),
        " ",
        result.parseError,
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: "10px", marginTop: "4px", color: "var(--text-muted)" }, children: "Only JSON payloads can be diffed. Try expanding the snapshot to inspect the raw body." })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "diff-body", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "diff-summary", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "diff-stat diff-added", children: [
            "+",
            result.addedKeys.length,
            " added"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "diff-stat diff-removed", children: [
            "\u2212",
            result.removedKeys.length,
            " removed"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "diff-stat diff-changed", children: [
            "~",
            result.changedKeys.length,
            " changed"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "diff-stat diff-unchanged", children: [
            result.unchangedKeys.length,
            " same"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyList, { keys: result.addedKeys, color: "var(--success)", label: "Added in B", icon: "+" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyList, { keys: result.removedKeys, color: "var(--danger)", label: "Removed in B", icon: "\u2212" }),
        result.changedKeys.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "diff-section", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "diff-section-title", style: { color: "var(--warning)" }, children: [
            "~ Changed (",
            result.changedKeys.length,
            ")"
          ] }),
          result.changedKeys.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "diff-changed-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "diff-changed-key", children: k }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "diff-changed-vals", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "diff-val diff-val-a", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "diff-val-label", children: "A" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { className: "diff-val-pre", children: tryGetValue(snapshotA.rawBody, k) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "diff-val diff-val-b", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "diff-val-label", children: "B" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { className: "diff-val-pre", children: tryGetValue(snapshotB.rawBody, k) })
              ] })
            ] })
          ] }, k))
        ] }),
        result.unchangedKeys.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { className: "diff-unchanged-details", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", { className: "diff-unchanged-summary", children: [
            "Unchanged keys (",
            result.unchangedKeys.length,
            ")"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "diff-keys", style: { marginTop: "6px" }, children: result.unchangedKeys.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "diff-key-badge", style: { color: "var(--text-muted)", borderColor: "var(--border)" }, children: k }, k)) })
        ] })
      ] })
    ] });
  }

  // clonelevel/src/inspector/inspector.tsx
  var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
  var STATE_EXTRACTS_KEY = "clonelevel_state_extracts";
  var SNAPSHOTS_KEY = "clonelevel_inspector_snapshots_v2";
  var SAVE_MARK_KEY = "clonelevel_save_mark_ts";
  var LOAD_MARK_KEY = "clonelevel_load_mark_ts";
  var DEFAULT_NEAR_WINDOW_S = 30;
  function isNoisyUrl(url) {
    const u = url.toLowerCase();
    return NOISE_DOMAINS.some((d) => u.includes(d));
  }
  function classifyRequest(url, contentType) {
    const u = url.toLowerCase();
    const ct = contentType.toLowerCase();
    if (isNoisyUrl(url)) return "ANALYTICS";
    if (ct.includes("javascript") || ct.includes("font") || ct.includes("image") || ct.includes("png") || ct.includes("svg") || ct.includes("css") || u.endsWith(".js") || u.endsWith(".css") || u.endsWith(".woff2") || u.endsWith(".png") || u.endsWith(".svg") || u.endsWith(".jpg") || u.endsWith(".webp")) return "STATIC";
    if (u.includes("gohighlevel.com") || u.includes("leadconnectorhq.com") || u.includes("/pages") || u.includes("/graphql") || u.includes("/funnels") || u.includes("/sites") || u.includes("/builder") || u.includes("/funnel") || u.includes("/save") || u.includes("/draft") || u.includes("/publish") || u.includes("/location") || u.includes("/object")) return "BUILDER_EVENT";
    return "OTHER";
  }
  function isNoise(snap) {
    if (snap.method.toUpperCase() === "OPTIONS") return true;
    const cls = classifyRequest(snap.requestUrl, snap.contentType ?? "");
    return cls === "STATIC" || cls === "ANALYTICS";
  }
  function isPossiblePageSave(snap) {
    const m = snap.method.toUpperCase();
    if (m !== "POST" && m !== "PUT" && m !== "PATCH") return false;
    const url = snap.requestUrl.toLowerCase();
    const isBuilderUrl = url.includes("/pages") || url.includes("/graphql") || url.includes("/funnels") || url.includes("/save") || url.includes("/draft") || url.includes("/publish");
    if (!isBuilderUrl) return false;
    const ct = (snap.contentType ?? "").toLowerCase();
    const isJson = ct.includes("json") || snap.rawBody.trimStart().startsWith("{") || snap.rawBody.trimStart().startsWith("[");
    return isJson;
  }
  function formatBytes(n) {
    if (!n || n === 0) return "0B";
    if (n < 1024) return `${n}B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)}KB`;
    return `${(n / (1024 * 1024)).toFixed(2)}MB`;
  }
  function sizeTier(bytes) {
    if (bytes < 5e3) return "tiny";
    if (bytes < 2e4) return "small";
    if (bytes < 1e5) return "medium";
    return "large";
  }
  function formatTime2(ts) {
    if (!ts) return "\u2014";
    try {
      return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    } catch {
      return String(ts);
    }
  }
  function tryPrettyJson(raw) {
    if (!raw || raw.trim() === "") return "(empty)";
    try {
      return JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
      return raw;
    }
  }
  function truncUrl(url, max = 65) {
    try {
      const u = new URL(url);
      const path = u.pathname + (u.search || "");
      return path.length > max ? "\u2026" + path.slice(-max) : path;
    } catch {
      return url.length > max ? "\u2026" + url.slice(-max) : url;
    }
  }
  function contentTypeShort(ct) {
    if (!ct) return "\u2014";
    const l = ct.toLowerCase();
    if (l.includes("json")) return "JSON";
    if (l.includes("html")) return "HTML";
    if (l.includes("javascript")) return "JS";
    if (l.includes("css")) return "CSS";
    if (l.includes("xml")) return "XML";
    if (l.includes("form")) return "FORM";
    if (l.includes("image")) return "IMG";
    if (l.includes("font")) return "FONT";
    if (l.includes("stream")) return "BIN";
    return ct.split(";")[0].split("/").pop()?.toUpperCase().slice(0, 6) ?? "\u2014";
  }
  function methodColor(method) {
    switch (method.toUpperCase()) {
      case "GET":
        return "#60a5fa";
      case "POST":
        return "#4ade80";
      case "PUT":
        return "#f5c842";
      case "PATCH":
        return "#fb923c";
      case "DELETE":
        return "#f87171";
      case "OPTIONS":
        return "#6b7280";
      default:
        return "#8b8fa3";
    }
  }
  function statusColor(code) {
    if (!code) return "#8b8fa3";
    if (code < 300) return "#4ade80";
    if (code < 400) return "#f5c842";
    return "#f87171";
  }
  function scoreColor(score) {
    if (score >= 70) return "#4ade80";
    if (score >= 45) return "#f5c842";
    if (score >= 20) return "#60a5fa";
    return "#4b5563";
  }
  function targetKindColor(kind) {
    switch (kind) {
      case "FRAME":
        return "#a5b4fc";
      case "IFRAME":
        return "#60a5fa";
      case "WORKER":
        return "#fb923c";
      case "SERVICE_WORKER":
        return "#f5c842";
      default:
        return "#8b8fa3";
    }
  }
  function TargetBadge({ kind }) {
    if (!kind || kind === "FRAME") return null;
    const label = kind === "SERVICE_WORKER" ? "SW" : kind;
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "span",
      {
        className: "insp-badge",
        style: {
          background: "rgba(0,0,0,0.25)",
          color: targetKindColor(kind),
          border: `1px solid ${targetKindColor(kind)}44`,
          fontSize: 8.5,
          letterSpacing: "0.04em"
        },
        title: `Captured from ${kind}`,
        children: label
      }
    );
  }
  function sendMsg(type, payload) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { type, id: crypto.randomUUID(), timestamp: (/* @__PURE__ */ new Date()).toISOString(), ...payload !== void 0 ? { payload } : {} },
        (res) => {
          if (chrome.runtime.lastError) resolve({ ok: false, error: chrome.runtime.lastError.message });
          else resolve(res);
        }
      );
    });
  }
  function getPrimaryTab(f) {
    if (f === "CLONE_VIEW") return "CLONE";
    if (f === "PAGE") return "PAGE";
    if (f === "FUNNEL") return "FUNNEL";
    if (f === "ASSETS") return "ASSETS";
    if (f === "IMPORT") return "IMPORT";
    if (f === "STATE_EXTRACT") return "STATE_EXTRACT";
    if (f === "GLOBAL_SECTIONS") return "GLOBAL_SECTIONS";
    if (f === "THEMES") return "THEMES";
    if (f === "TEMPLATES") return "TEMPLATES";
    return "INSPECTOR";
  }
  var FULL_WIDTH_FILTERS = [
    "CLONE_VIEW",
    "STATE_EXTRACT",
    "PAGE",
    "FUNNEL",
    "IMPORT",
    "ASSETS",
    "GLOBAL_SECTIONS",
    "THEMES",
    "TEMPLATES"
  ];
  function isFullWidth(f) {
    return FULL_WIDTH_FILTERS.includes(f);
  }
  function enrich(snap, saveMarkTs, loadMarkTs, nearWindowMs) {
    const cls = classifyRequest(snap.requestUrl, snap.contentType ?? "");
    const totalBytes = snap.payloadSize + (snap.requestBodyText?.length ?? 0);
    const tier = sizeTier(totalBytes);
    const reqBodyType = detectStructuredJson(snap.requestBodyText ?? "");
    const respBodyType = detectStructuredJson(snap.rawBody);
    const save = isPossiblePageSave(snap);
    const { score } = computePriorityScore(snap, saveMarkTs, loadMarkTs, nearWindowMs);
    const reqTime = new Date(snap.timestamp).getTime();
    const nearSave = saveMarkTs !== null && reqTime >= saveMarkTs && reqTime <= saveMarkTs + nearWindowMs;
    const nearLoad = loadMarkTs !== null && reqTime >= loadMarkTs && reqTime <= loadMarkTs + nearWindowMs;
    return { snap, cls, totalBytes, tier, reqBodyType, respBodyType, save, score, nearSave, nearLoad };
  }
  var GRID = "44px 34px 44px 50px 34px 22px 22px 1fr";
  function BodyDot({ type, label }) {
    const has = type !== "none";
    const isSchema = type === "possible-builder-schema";
    const isStructured = type === "structured-json";
    const color = isSchema ? "#4ade80" : isStructured ? "#60a5fa" : has ? "#8b8fa3" : "#2a2d3d";
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "span",
      {
        title: `${label}: ${type}`,
        style: {
          display: "inline-block",
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: color,
          border: `1px solid ${has ? color + "88" : "#2a2d3d"}`,
          flexShrink: 0
        }
      }
    );
  }
  function SnapshotRow({
    e,
    selected,
    compact,
    diffSlot,
    diffPickMode,
    onSelect,
    onDiffPick,
    onQuickOpen
  }) {
    const { snap, cls, totalBytes, tier, reqBodyType, respBodyType, save, score, nearSave, nearLoad } = e;
    const isSchema = reqBodyType === "possible-builder-schema" || respBodyType === "possible-builder-schema";
    let rowClass = "insp-snap-row";
    if (compact) rowClass += " compact";
    if (selected || diffSlot) rowClass += " selected";
    if (nearSave || nearLoad) rowClass += " near-save";
    else if (save) rowClass += " possible-save";
    if (tier === "large" && !selected) rowClass += " size-large";
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
      "div",
      {
        className: rowClass,
        style: { gridTemplateColumns: GRID },
        "data-testid": `snap-row-${snap.id}`,
        onClick: diffPickMode ? onDiffPick : onSelect,
        title: snap.requestUrl,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-col-method", style: { color: methodColor(snap.method) }, children: snap.method.toUpperCase().slice(0, 6) }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-col-status", style: { color: statusColor(snap.statusCode) }, children: snap.statusCode ?? "\u2014" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-col-type", children: contentTypeShort(snap.contentType ?? "") }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: `insp-col-size sz-${tier}`, children: formatBytes(totalBytes) }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "span",
            {
              className: "insp-col-score",
              style: { color: scoreColor(score), fontWeight: score >= 45 ? 800 : 500 },
              title: `Priority score: ${score}/100`,
              children: score
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-col-dot", title: "Request body", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(BodyDot, { type: reqBodyType, label: "Req" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-col-dot", title: "Response body", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(BodyDot, { type: respBodyType, label: "Resp" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-col-url-wrap", children: [
            save && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-badge insp-badge-save", onClick: (ev) => {
              ev.stopPropagation();
              onQuickOpen();
            }, children: "\u2B50 SAVE" }),
            snap.schemaTag === "PAGE_SCHEMA" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-badge insp-badge-page-schema", children: "\u{1F4C4} PAGE" }),
            snap.schemaTag === "FUNNEL_SCHEMA" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-badge insp-badge-funnel-schema", children: "\u{1F5C2} FUNNEL" }),
            snap.schemaTag === "SAVE_EVENT" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-badge insp-badge-save-event", children: "\u{1F4BE} SAVE EVENT" }),
            isSchema && !save && !snap.schemaTag && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-badge insp-badge-schema", onClick: (ev) => {
              ev.stopPropagation();
              onQuickOpen();
            }, children: "\u{1F511} SCHEMA" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(TargetBadge, { kind: snap.targetKind }),
            cls === "BUILDER_EVENT" && !save && !isSchema && !snap.schemaTag && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-badge insp-badge-builder", children: "BUILDER" }),
            cls === "ANALYTICS" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-badge insp-badge-analytics", children: "ANLYTCS" }),
            cls === "STATIC" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-badge insp-badge-static", children: "STATIC" }),
            (nearSave || nearLoad) && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-badge-near-save", title: nearSave ? "Near save mark" : "Near load mark", children: nearSave ? "\u2605" : "\u25C9" }),
            diffSlot && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "insp-badge", style: { background: "rgba(99,102,241,0.3)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.5)" }, children: [
              "Diff ",
              diffSlot
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: `insp-col-url${compact ? " compact" : ""}`, children: truncUrl(snap.requestUrl, compact ? 50 : 65) }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-col-time", children: formatTime2(snap.timestamp) })
          ] })
        ]
      }
    );
  }
  function DetailPanel({
    e,
    onClose
  }) {
    const { snap, cls, totalBytes, tier, reqBodyType, respBodyType, save, score } = e;
    const [copiedResp, setCopiedResp] = (0, import_react.useState)(false);
    const [copiedReq, setCopiedReq] = (0, import_react.useState)(false);
    const [showSchemaTree, setShowSchemaTree] = (0, import_react.useState)(false);
    const isSchema = reqBodyType === "possible-builder-schema" || respBodyType === "possible-builder-schema";
    const hasReqHeaders = snap.requestHeaders && Object.keys(snap.requestHeaders).length > 0;
    const hasRespHeaders = snap.responseHeaders && Object.keys(snap.responseHeaders).length > 0;
    function copy(text, which) {
      navigator.clipboard.writeText(tryPrettyJson(text)).then(() => {
        if (which === "req") {
          setCopiedReq(true);
          setTimeout(() => setCopiedReq(false), 1500);
        } else {
          setCopiedResp(true);
          setTimeout(() => setCopiedResp(false), 1500);
        }
      });
    }
    function getBuilderKeys(text) {
      try {
        const obj = JSON.parse(text);
        if (typeof obj !== "object" || obj === null) return [];
        const keys = Object.keys(obj).map((k) => k.toLowerCase());
        return BUILDER_SCHEMA_KEYS.filter((k) => keys.includes(k));
      } catch {
        return [];
      }
    }
    const reqBuilderKeys = snap.requestBodyText ? getBuilderKeys(snap.requestBodyText) : [];
    const respBuilderKeys = getBuilderKeys(snap.rawBody);
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-detail-header", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-detail-title", children: "Detail" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" }, children: [
          save && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-badge insp-badge-save", style: { fontSize: 9 }, children: "\u2B50 PAGE SAVE" }),
          isSchema && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-badge insp-badge-schema", style: { fontSize: 9 }, children: "\u{1F511} SCHEMA" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "insp-badge", style: { fontSize: 9, background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }, children: [
            "\u25CF",
            score
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-detail-close", onClick: onClose, "data-testid": "btn-close-detail", children: "\u2715" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-detail-scroll", children: [
        isSchema && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
          padding: "6px 10px",
          marginBottom: 8,
          background: "rgba(34,197,94,0.08)",
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: 4,
          fontSize: 10.5,
          color: "#4ade80",
          lineHeight: 1.5
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontWeight: 700, marginBottom: 4 }, children: "\u{1F511} Possible Builder Schema Detected" }),
          reqBuilderKeys.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
            "Req keys: ",
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: reqBuilderKeys.join(", ") })
          ] }),
          respBuilderKeys.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
            "Resp keys: ",
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: respBuilderKeys.join(", ") })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              className: "insp-detail-copy-btn",
              style: { marginTop: 4 },
              onClick: () => setShowSchemaTree((v) => !v),
              children: showSchemaTree ? "\u25B2 Hide top-level keys" : "\u25BC Show top-level keys"
            }
          ),
          showSchemaTree && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("pre", { style: {
            marginTop: 4,
            fontFamily: "monospace",
            fontSize: 9.5,
            maxHeight: 120,
            overflowY: "auto",
            background: "rgba(0,0,0,0.3)",
            borderRadius: 3,
            padding: "4px 6px",
            color: "#e2e4f0",
            whiteSpace: "pre-wrap"
          }, children: (() => {
            try {
              const target = respBuilderKeys.length > 0 ? snap.rawBody : snap.requestBodyText ?? "";
              const obj = JSON.parse(target);
              return Object.keys(obj).map((k) => {
                const v = obj[k];
                const type = Array.isArray(v) ? `array[${v.length}]` : typeof v;
                return `${k}: ${type}`;
              }).join("\n");
            } catch {
              return "Could not parse";
            }
          })() })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "insp-detail-url", "data-testid": "detail-url", children: snap.requestUrl }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-detail-section", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "insp-detail-section-title", children: "Summary" }),
          [
            ["Method", snap.method],
            ["Status", snap.statusCode ?? "\u2014"],
            ["Priority score", `${score}/100`],
            ["Classification", cls],
            ["Type", contentTypeShort(snap.contentType ?? "")],
            ["Response size", formatBytes(snap.payloadSize)],
            ["Request body", snap.requestBodyText ? formatBytes(snap.requestBodyText.length) : "none"],
            ["Total size", `${formatBytes(totalBytes)} (${tier.toUpperCase()})`],
            ["Req body type", reqBodyType],
            ["Resp body type", respBodyType],
            ["Source", snap.source ?? "page-bridge"],
            ["Target", snap.targetKind ?? "FRAME"],
            ...snap.targetId ? [["Target ID", snap.targetId.slice(0, 32)]] : [],
            ...snap.targetUrl && snap.targetUrl !== snap.tabUrl ? [["Target URL", snap.targetUrl.replace(/^https?:\/\//, "").slice(0, 60)]] : [],
            ["Relevance", snap.relevanceScore !== void 0 ? `${snap.relevanceScore}/100` : "\u2014"],
            ["Tags", snap.tags?.join(", ") || "\u2014"],
            ["Time", formatTime2(snap.timestamp)]
          ].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-detail-kv", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-detail-kv-key", children: k }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-detail-kv-val", children: String(v) })
          ] }, k))
        ] }),
        hasReqHeaders && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-detail-section", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "insp-detail-section-title", children: "Request Headers" }),
          Object.entries(snap.requestHeaders).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-detail-kv", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-detail-kv-key", children: k }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-detail-kv-val", children: v })
          ] }, k))
        ] }),
        hasRespHeaders && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-detail-section", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "insp-detail-section-title", children: "Response Headers" }),
          Object.entries(snap.responseHeaders).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-detail-kv", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-detail-kv-key", children: k }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-detail-kv-val", children: v })
          ] }, k))
        ] }),
        snap.requestBodyText && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-detail-section", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-detail-section-title", children: [
            "Request Body \u2014 ",
            formatBytes(snap.requestBodyText.length),
            " / ",
            reqBodyType
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("pre", { className: "insp-detail-pre", "data-testid": "detail-req-body", children: tryPrettyJson(snap.requestBodyText) }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              className: "insp-detail-copy-btn",
              onClick: () => copy(snap.requestBodyText, "req"),
              "data-testid": "btn-copy-req-body",
              children: copiedReq ? "\u2713 Copied" : "Copy request body"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-detail-section", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-detail-section-title", children: [
            "Response Body \u2014 ",
            formatBytes(snap.payloadSize),
            " / ",
            respBodyType
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("pre", { className: "insp-detail-pre", "data-testid": "detail-resp-body", children: tryPrettyJson(snap.rawBody) }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              className: "insp-detail-copy-btn",
              onClick: () => copy(snap.rawBody, "resp"),
              "data-testid": "btn-copy-resp-body",
              children: copiedResp ? "\u2713 Copied" : "Copy response body"
            }
          )
        ] })
      ] })
    ] });
  }
  function DebuggerBar({
    saveMarkTs,
    loadMarkTs,
    onSaveMarkSet,
    onLoadMarkSet,
    nearWindowS,
    setNearWindowS
  }) {
    const [status, setStatus] = (0, import_react.useState)(null);
    const [attaching, setAttaching] = (0, import_react.useState)(false);
    const [detaching, setDetaching] = (0, import_react.useState)(false);
    const [error, setError] = (0, import_react.useState)(null);
    const pollRef = (0, import_react.useRef)(null);
    async function loadStatus() {
      const res = await sendMsg("GET_DEBUGGER_STATUS");
      if (res?.ok && res.data) setStatus(res.data);
    }
    (0, import_react.useEffect)(() => {
      loadStatus();
      pollRef.current = setInterval(loadStatus, 4e3);
      return () => {
        if (pollRef.current) clearInterval(pollRef.current);
      };
    }, []);
    async function attach() {
      setAttaching(true);
      setError(null);
      const res = await sendMsg("ATTACH_DEBUGGER");
      if (!res?.ok) setError(res?.error ?? "Attach failed");
      await loadStatus();
      setAttaching(false);
    }
    async function detach() {
      setDetaching(true);
      setError(null);
      const res = await sendMsg("DETACH_DEBUGGER");
      if (!res?.ok) setError(res?.error ?? "Detach failed");
      await loadStatus();
      setDetaching(false);
    }
    async function markSave() {
      const res = await sendMsg("MARK_SAVE_EVENT_NOW");
      if (res?.ok && res.data?.ts) onSaveMarkSet(res.data.ts);
    }
    async function markLoad() {
      const ts = Date.now();
      await chrome.storage.local.set({ [LOAD_MARK_KEY]: ts });
      onLoadMarkSet(ts);
    }
    async function clearSaveMk() {
      await sendMsg("CLEAR_SAVE_MARK");
      onSaveMarkSet(0);
    }
    async function clearLoadMk() {
      await chrome.storage.local.remove(LOAD_MARK_KEY);
      onLoadMarkSet(0);
    }
    const attached = status?.attached === true;
    const networkEnabled = status?.networkEnabled !== false;
    const autoAttachEnabled = status?.autoAttachEnabled === true;
    const targets = status?.targets ?? {};
    const totalTargets = status?.totalTargets ?? 0;
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-dbg-bar", "data-testid": "debugger-bar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "span",
        {
          className: `insp-dbg-status ${attached ? "attached" : "detached"}`,
          "data-testid": "dbg-status-attached",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-dbg-dot" }),
            attached ? "ATTACHED" : "DETACHED"
          ]
        }
      ),
      attached && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "span",
        {
          style: {
            fontSize: 9.5,
            fontWeight: 700,
            padding: "1px 6px",
            borderRadius: 3,
            background: networkEnabled ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)",
            color: networkEnabled ? "#4ade80" : "#f87171",
            border: `1px solid ${networkEnabled ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`
          },
          title: "Network.enable status \u2014 required for request capture",
          "data-testid": "dbg-status-network",
          children: networkEnabled ? "\u2713 NETWORK" : "\u2717 NETWORK"
        }
      ),
      attached && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "span",
        {
          style: {
            fontSize: 9.5,
            fontWeight: 700,
            padding: "1px 6px",
            borderRadius: 3,
            background: autoAttachEnabled ? "rgba(99,102,241,0.12)" : "rgba(75,85,99,0.15)",
            color: autoAttachEnabled ? "#a5b4fc" : "#6b7280",
            border: `1px solid ${autoAttachEnabled ? "rgba(99,102,241,0.3)" : "rgba(75,85,99,0.3)"}`
          },
          title: autoAttachEnabled ? "Target.setAutoAttach enabled \u2014 capturing iframes, workers and service workers" : "Auto-attach unavailable (Chrome returned -32601) \u2014 tab-level capture only",
          "data-testid": "dbg-status-autoattach",
          children: autoAttachEnabled ? "\u2713 MULTI-TARGET" : "\u25CB TAB ONLY"
        }
      ),
      attached && totalTargets > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
        display: "flex",
        gap: 4,
        alignItems: "center",
        padding: "1px 7px",
        borderRadius: 4,
        background: "rgba(99,102,241,0.1)",
        border: "1px solid rgba(99,102,241,0.25)",
        fontSize: 9.5,
        fontWeight: 700
      }, title: "Attached targets", "data-testid": "target-counts", children: [
        ["FRAME", "IFRAME", "WORKER", "SERVICE_WORKER"].map(
          (k) => (targets[k] ?? 0) > 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { color: targetKindColor(k) }, children: [
            k.replace("_", " "),
            ":",
            targets[k]
          ] }, k) : null
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { color: "#8b8fa3" }, children: [
          "(",
          totalTargets,
          " total)"
        ] })
      ] }),
      attached && status?.tabUrl && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-dbg-tab", title: status.tabUrl, children: status.tabUrl.replace(/^https?:\/\//, "").slice(0, 40) }),
      error && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontSize: 10, color: "#f87171" }, title: error, children: [
        "\u2717 ",
        error.slice(0, 36)
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "insp-dbg-gap" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { style: { display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#8b8fa3", whiteSpace: "nowrap" }, children: [
        "Window:",
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "input",
          {
            type: "number",
            min: 1,
            max: 300,
            value: nearWindowS,
            onChange: (e) => setNearWindowS(Number(e.target.value) || DEFAULT_NEAR_WINDOW_S),
            style: { width: 36, background: "var(--bg-base,#0f1117)", border: "1px solid var(--border,#2a2d3d)", borderRadius: 3, color: "#e2e4f0", fontSize: 10, padding: "1px 4px", textAlign: "center" },
            "data-testid": "input-near-window"
          }
        ),
        "s"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "button",
        {
          className: "btn btn-sm",
          onClick: markSave,
          style: { fontSize: 10, border: "1px solid rgba(245,200,66,0.35)", background: saveMarkTs ? "rgba(245,200,66,0.15)" : "transparent", color: "#f5c842" },
          "data-testid": "btn-mark-save",
          children: [
            "\u23F1 Save ",
            saveMarkTs ? `(${formatTime2(new Date(saveMarkTs).toISOString())})` : ""
          ]
        }
      ),
      saveMarkTs ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: clearSaveMk, title: "Clear save mark", "data-testid": "btn-clear-save", children: "\u2715" }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "button",
        {
          className: "btn btn-sm",
          onClick: markLoad,
          style: { fontSize: 10, border: "1px solid rgba(96,165,250,0.35)", background: loadMarkTs ? "rgba(96,165,250,0.15)" : "transparent", color: "#60a5fa" },
          "data-testid": "btn-mark-load",
          children: [
            "\u25C9 Load ",
            loadMarkTs ? `(${formatTime2(new Date(loadMarkTs).toISOString())})` : ""
          ]
        }
      ),
      loadMarkTs ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: clearLoadMk, title: "Clear load mark", "data-testid": "btn-clear-load", children: "\u2715" }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "btn btn-sm btn-primary", onClick: attach, disabled: attaching || attached, "data-testid": "btn-attach", children: attaching ? "\u2026" : "\u{1F4E1} Attach" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "btn btn-sm btn-secondary", onClick: detach, disabled: detaching || !attached, "data-testid": "btn-detach", children: detaching ? "\u2026" : "\u23F9 Detach" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: loadStatus, title: "Refresh", "data-testid": "btn-refresh-dbg", children: "\u21BB" })
    ] });
  }
  var PRIMARY_TABS = [
    { key: "CLONE", label: "\u26A1 Clone", activeCls: "active-clone", defaultFilter: "CLONE_VIEW" },
    { key: "FUNNEL", label: "\u{1F5C2} Funnels", activeCls: "active-funnel", defaultFilter: "FUNNEL" },
    { key: "PAGE", label: "\u{1F4C4} Pages", activeCls: "active-page", defaultFilter: "PAGE" },
    { key: "ASSETS", label: "\u{1F5BC} Assets", activeCls: "active-assets", defaultFilter: "ASSETS" },
    { key: "IMPORT", label: "\u2191 Import", activeCls: "active-import", defaultFilter: "IMPORT" },
    { key: "GLOBAL_SECTIONS", label: "\u{1F9E9} Globals", activeCls: "active-globals", defaultFilter: "GLOBAL_SECTIONS" },
    { key: "THEMES", label: "\u{1F3A8} Themes", activeCls: "active-themes", defaultFilter: "THEMES" },
    { key: "TEMPLATES", label: "\u{1F4CB} Templates", activeCls: "active-templates", defaultFilter: "TEMPLATES" },
    { key: "INSPECTOR", label: "\u{1F52C} Inspector", activeCls: "active-inspector", defaultFilter: "CLONE_DATA" }
  ];
  var CLONE_SUB_FILTERS = [
    ["CLONE_DATA", "Best Fit", "active-clone"],
    ["ALL", "All", "active"],
    ["BEST", "\u2B50 Best", "active-save"],
    ["BUILDER", "Builder", "active"],
    ["SCHEMA", "Schema", "active-save"],
    ["WRITE", "Write", "active"],
    ["LARGE", "\u226520KB", "active-large"],
    ["GRAPHQL", "GraphQL", "active"],
    ["BODY", "Body", "active"],
    ["ANALYTICS", "Noise", "active"]
  ];
  function NavBar({
    enriched,
    activeFilter,
    setActiveFilter,
    showNoise,
    setShowNoise,
    compact,
    setCompact,
    onClear,
    onExportAll,
    onRefresh,
    lastCloneFilter,
    setLastCloneFilter,
    globalSectionCount,
    themeCount,
    templateCount
  }) {
    const primaryTab = getPrimaryTab(activeFilter);
    const counts = (0, import_react.useMemo)(() => ({
      all: enriched.length,
      best: enriched.filter((e) => e.score >= 40).length,
      builder: enriched.filter((e) => e.cls === "BUILDER_EVENT").length,
      schema: enriched.filter((e) => e.reqBodyType === "possible-builder-schema" || e.respBodyType === "possible-builder-schema").length,
      large: enriched.filter((e) => e.totalBytes >= 2e4).length,
      graphql: enriched.filter((e) => e.snap.requestUrl.toLowerCase().includes("/graphql")).length,
      write: enriched.filter((e) => ["POST", "PUT", "PATCH"].includes(e.snap.method.toUpperCase())).length,
      body: enriched.filter((e) => e.reqBodyType !== "none" || e.respBodyType !== "none").length,
      analytics: enriched.filter((e) => e.cls === "ANALYTICS" || e.cls === "STATIC").length,
      pageSchemas: enriched.filter((e) => e.snap.schemaTag === "PAGE_SCHEMA").length,
      funnelSchemas: enriched.filter((e) => e.snap.schemaTag === "FUNNEL_SCHEMA").length,
      cloneData: enriched.filter((e) => e.snap.schemaTag === "PAGE_SCHEMA" || e.snap.schemaTag === "FUNNEL_SCHEMA" || e.snap.schemaTag === "SAVE_EVENT").length
    }), [enriched]);
    const subCountFor = (key) => {
      switch (key) {
        case "CLONE_DATA":
          return counts.cloneData;
        case "ALL":
          return counts.all;
        case "BEST":
          return counts.best;
        case "BUILDER":
          return counts.builder;
        case "SCHEMA":
          return counts.schema;
        case "WRITE":
          return counts.write;
        case "LARGE":
          return counts.large;
        case "GRAPHQL":
          return counts.graphql;
        case "BODY":
          return counts.body;
        case "ANALYTICS":
          return counts.analytics;
        default:
          return null;
      }
    };
    function handlePrimaryClick(tab) {
      if (tab.key === "INSPECTOR") {
        setActiveFilter(lastCloneFilter);
      } else {
        setActiveFilter(tab.defaultFilter);
      }
    }
    function handleSubFilter(key) {
      setActiveFilter(key);
      setLastCloneFilter(key);
    }
    const showControls = primaryTab === "INSPECTOR";
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-navbar", "data-testid": "nav-bar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-nav-primary", children: [
        PRIMARY_TABS.map((tab) => {
          const active = primaryTab === tab.key;
          let badge = null;
          if (tab.key === "INSPECTOR") badge = counts.all;
          if (tab.key === "PAGE") badge = counts.pageSchemas;
          if (tab.key === "FUNNEL") badge = counts.funnelSchemas;
          if (tab.key === "GLOBAL_SECTIONS") badge = globalSectionCount;
          if (tab.key === "THEMES") badge = themeCount;
          if (tab.key === "TEMPLATES") badge = templateCount;
          return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "button",
            {
              className: `insp-nav-tab${active ? ` ${tab.activeCls}` : ""}`,
              onClick: () => handlePrimaryClick(tab),
              "data-testid": `nav-${tab.key.toLowerCase()}`,
              children: [
                tab.label,
                badge !== null && badge > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: `insp-nav-badge${active ? " active" : ""}`, children: badge })
              ]
            },
            tab.key
          );
        }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "insp-nav-spacer" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: onRefresh, "data-testid": "btn-refresh", title: "Refresh", children: "\u21BB" }),
        showControls && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: onExportAll, "data-testid": "btn-export-all", disabled: enriched.length === 0, title: "Export all", children: "\u2193" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn insp-action-danger", onClick: onClear, "data-testid": "btn-clear", disabled: enriched.length === 0, title: "Clear", children: "\u2715" })
        ] })
      ] }),
      primaryTab === "INSPECTOR" && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-nav-subfilter", "data-testid": "subfilter-bar", children: [
        CLONE_SUB_FILTERS.map(([key, label, cls]) => {
          const cnt = subCountFor(key);
          return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "button",
            {
              className: `insp-subfil-btn${activeFilter === key ? ` ${cls}` : ""}`,
              onClick: () => handleSubFilter(key),
              "data-testid": `filter-${key.toLowerCase()}`,
              children: [
                label,
                cnt !== null ? ` (${cnt})` : ""
              ]
            },
            key
          );
        }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "insp-nav-spacer" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: "insp-show-noise-toggle", "data-testid": "toggle-show-noise", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("input", { type: "checkbox", checked: showNoise, onChange: (e) => setShowNoise(e.target.checked) }),
          "Noise"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: "insp-show-noise-toggle", "data-testid": "toggle-compact", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("input", { type: "checkbox", checked: compact, onChange: (e) => setCompact(e.target.checked) }),
          "Compact"
        ] })
      ] })
    ] });
  }
  function StatsBar({ shown, total, enriched }) {
    const saves = enriched.filter((e) => e.save).length;
    const schemas = enriched.filter((e) => e.reqBodyType === "possible-builder-schema" || e.respBodyType === "possible-builder-schema").length;
    const large = enriched.filter((e) => e.totalBytes >= 2e4).length;
    const best = enriched.filter((e) => e.score >= 40).length;
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-stats-bar", "data-testid": "stats-bar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { children: [
        "Showing ",
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: shown }),
        " / ",
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: total })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { color: "#4ade80" }, children: [
        "\u2B50 ",
        saves,
        " saves"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { color: "#22d3ee" }, children: [
        "\u{1F511} ",
        schemas,
        " schema"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { color: "#f87171" }, children: [
        "\u{1F534} ",
        large,
        " \u226520KB"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { color: "#a5b4fc" }, children: [
        "\u2605 ",
        best,
        " best"
      ] })
    ] });
  }
  function CollapsibleSection({ title, defaultOpen = false, children }) {
    const [open, setOpen] = (0, import_react.useState)(defaultOpen);
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { marginBottom: 6 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("button", { className: "insp-section-toggle", onClick: () => setOpen((v) => !v), children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 8 }, children: open ? "\u25BC" : "\u25B6" }),
        title
      ] }),
      open && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { padding: "4px 0" }, children })
    ] });
  }
  function StatusKV({ label, value, ok }) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-status-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { color: "var(--text-muted)", fontSize: 10.5 }, children: label }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontSize: 10.5, fontFamily: "monospace", fontWeight: 500, color: ok === void 0 ? "var(--text)" : ok ? "#22c55e" : "#ef4444" }, children: [
        ok !== void 0 ? ok ? "\u2714" : "\u2717" : "",
        " ",
        ok !== void 0 ? ok ? "yes" : "no" : value ?? "\u2014"
      ] })
    ] });
  }
  function BridgeDebugDrawer() {
    const [status, setStatus] = (0, import_react.useState)(null);
    const [loading, setLoading] = (0, import_react.useState)(false);
    const [activateLog, setActivateLog] = (0, import_react.useState)([]);
    const [activating, setActivating] = (0, import_react.useState)(false);
    const [testInjecting, setTestInjecting] = (0, import_react.useState)(false);
    async function loadStatus() {
      setLoading(true);
      const r = await sendMsg("GET_BRIDGE_STATUS");
      if (r?.ok && r.data) setStatus(r.data);
      setLoading(false);
    }
    async function activate() {
      setActivating(true);
      setActivateLog([`Activating\u2026`]);
      const res = await sendMsg("ACTIVATE_BRIDGE_DEBUG");
      setActivateLog(res?.log?.length ? res.log : [res?.ok ? "\u2714 Done" : `\u2717 ${res?.error ?? "Failed"}`]);
      setActivating(false);
    }
    async function verifyPatches() {
      await sendMsg("VERIFY_PATCHES");
      await new Promise((r) => setTimeout(r, 800));
      await loadStatus();
    }
    (0, import_react.useEffect)(() => {
      loadStatus();
    }, []);
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-bridge-drawer", "data-testid": "bridge-debug-drawer", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 10.5, color: "#8b8fa3", marginBottom: 8, fontStyle: "italic" }, children: "Bridge debug \u2014 secondary. Prefer debugger network capture above." }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(CollapsibleSection, { title: "\u25B6 Activate Bridge", defaultOpen: true, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 6 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "btn btn-sm btn-primary", onClick: activate, disabled: activating, "data-testid": "btn-activate-bridge", children: activating ? "\u2026" : "Activate Bridge" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "btn btn-sm btn-secondary", onClick: verifyPatches, "data-testid": "btn-verify-patches", children: "Re-verify Patches" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              className: "insp-action-btn",
              onClick: () => {
                setTestInjecting(true);
                sendMsg("INJECT_TEST_SNAPSHOT").then(() => setTestInjecting(false));
              },
              disabled: testInjecting,
              "data-testid": "btn-inject-test",
              children: testInjecting ? "\u2026" : "\u26A1 Test Snap"
            }
          )
        ] }),
        activateLog.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("pre", { style: { fontFamily: "monospace", fontSize: 9.5, background: "#0f1117", border: "1px solid #2a2d3d", borderRadius: 4, padding: "5px 8px", maxHeight: 110, overflowY: "auto", whiteSpace: "pre-wrap", margin: 0 }, children: activateLog.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { color: l.includes("\u2717") ? "#f87171" : l.includes("\u2714") ? "#4ade80" : "inherit" }, children: l + "\n" }, i)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(CollapsibleSection, { title: "Bridge Status", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", gap: 6, marginBottom: 6 }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: loadStatus, disabled: loading, children: loading ? "\u2026" : "\u21BB Refresh" }) }),
        status && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(StatusKV, { label: "CS reachable", ok: status.contentScriptReachable !== false && status.editorTabId !== null }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(StatusKV, { label: "Bridge active", ok: status.bridgeActive === true }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(StatusKV, { label: "fetch patched", ok: status.fetchPatched === true }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(StatusKV, { label: "XHR patched", ok: status.xhrPatched === true }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(StatusKV, { label: "Raw fetch seen", value: status.rawFetchSeen ?? 0 }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(StatusKV, { label: "Payloads emitted", value: status.bridgeInterceptCount ?? 0 })
        ] })
      ] })
    ] });
  }
  function DiffView({ a, b, onBack }) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-page-wrap", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-page-topbar", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-page-logo", children: "CL" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-page-title", children: "Inspector \u2014 Diff View" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "insp-page-topbar-gap" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: onBack, children: "\u2190 Back" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { flex: 1, overflowY: "auto", padding: 16 }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SnapshotDiff, { snapshotA: a, snapshotB: b, result: diffSnapshots(a, b), onBack }) })
    ] });
  }
  function CandidateCard({ c, expanded, onToggle }) {
    const [copied, setCopied] = (0, import_react.useState)(false);
    const copyFull = () => {
      navigator.clipboard.writeText(c.full).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    };
    const scoreCol = c.score >= 70 ? "#4ade80" : c.score >= 40 ? "#f5c842" : "#60a5fa";
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
      marginBottom: 10,
      border: "1px solid #2a2d3d",
      borderRadius: 6,
      background: "#14161f",
      overflow: "hidden"
    }, "data-testid": `state-candidate-${c.id}`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 10px",
            cursor: "pointer",
            background: "#1a1d2b",
            borderBottom: expanded ? "1px solid #2a2d3d" : "none"
          },
          onClick: onToggle,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: {
              minWidth: 28,
              textAlign: "center",
              fontSize: 9.5,
              fontWeight: 800,
              padding: "1px 5px",
              borderRadius: 3,
              background: `${scoreCol}22`,
              color: scoreCol,
              border: `1px solid ${scoreCol}44`
            }, children: c.score }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("code", { style: { fontSize: 10.5, color: "#e2e8f0", flexGrow: 1, wordBreak: "break-all" }, children: c.source }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontSize: 9, color: "#8b8fa3", whiteSpace: "nowrap" }, children: [
              formatBytes(c.byteSize),
              " \xB7 depth ",
              c.depth
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 10, color: "#4b5563" }, children: expanded ? "\u25B2" : "\u25BC" })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { padding: "5px 10px", display: "flex", flexWrap: "wrap", gap: 4 }, children: c.matchedKeys.map((k) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-badge", style: {
        background: "rgba(34,211,238,0.1)",
        color: "#22d3ee",
        border: "1px solid rgba(34,211,238,0.25)",
        fontSize: 9
      }, children: k }, k)) }),
      expanded && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { padding: "0 10px 10px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 9.5, color: "#8b8fa3", marginBottom: 6 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { style: { color: "#6b7280" }, children: "Top-level keys: " }),
          c.topLevelKeys.join(", ")
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", gap: 6, marginBottom: 6 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: copyFull, "data-testid": `btn-copy-candidate-${c.id}`, children: copied ? "\u2713 Copied!" : "\u2398 Copy JSON" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: () => {
            const blob = new Blob([c.full], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `hl-state-${c.source.replace(/[^a-z0-9]/gi, "_")}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }, "data-testid": `btn-dl-candidate-${c.id}`, children: "\u2193 Download" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("pre", { style: {
          fontSize: 9,
          background: "#0d0f17",
          padding: 8,
          borderRadius: 4,
          maxHeight: 300,
          overflow: "auto",
          margin: 0,
          color: "#94a3b8",
          border: "1px solid #1e2130",
          whiteSpace: "pre-wrap",
          wordBreak: "break-all"
        }, children: [
          c.preview,
          c.full.length > 800 ? `
\u2026 (${formatBytes(c.byteSize)} total \u2014 download for full JSON)` : ""
        ] })
      ] })
    ] });
  }
  function StateExtractPanel() {
    const [extracts, setExtracts] = (0, import_react.useState)([]);
    const [loading, setLoading] = (0, import_react.useState)(false);
    const [expandedId, setExpandedId] = (0, import_react.useState)(null);
    const load = (0, import_react.useCallback)(async () => {
      const res = await chrome.storage.local.get(STATE_EXTRACTS_KEY);
      const data = res[STATE_EXTRACTS_KEY];
      setExtracts(Array.isArray(data) ? data : []);
    }, []);
    (0, import_react.useEffect)(() => {
      load();
      const onChange = (changes, area) => {
        if (area === "local" && changes[STATE_EXTRACTS_KEY]) {
          const v = changes[STATE_EXTRACTS_KEY].newValue;
          setExtracts(Array.isArray(v) ? v : []);
        }
      };
      chrome.storage.onChanged.addListener(onChange);
      return () => chrome.storage.onChanged.removeListener(onChange);
    }, [load]);
    const handleExtract = async () => {
      setLoading(true);
      setExpandedId(null);
      try {
        await chrome.runtime.sendMessage({
          type: "EXTRACT_STATE",
          id: crypto.randomUUID(),
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
        await load();
      } finally {
        setLoading(false);
      }
    };
    const handleClear = async () => {
      await chrome.runtime.sendMessage({
        type: "CLEAR_STATE_EXTRACTS",
        id: crypto.randomUUID(),
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      setExtracts([]);
    };
    const latest = extracts[0] ?? null;
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
      flex: 1,
      overflow: "auto",
      padding: 12,
      display: "flex",
      flexDirection: "column",
      gap: 0
    }, "data-testid": "state-extract-panel", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
        flexShrink: 0
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            className: "insp-action-btn",
            style: {
              background: loading ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.15)",
              color: "#a5b4fc",
              border: "1px solid rgba(99,102,241,0.4)",
              padding: "3px 10px"
            },
            onClick: handleExtract,
            disabled: loading,
            "data-testid": "btn-extract-now",
            children: loading ? "\u23F3 Extracting\u2026" : "\u26A1 Extract Now"
          }
        ),
        extracts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn insp-action-danger", onClick: handleClear, "data-testid": "btn-clear-extracts", children: "\u2715 Clear" }),
        latest && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontSize: 9.5, color: "#6b7280" }, children: [
          "Last: ",
          formatTime2(latest.extractedAt),
          " \xB7 ",
          latest.tabUrl.replace(/^https?:\/\//, "").slice(0, 50)
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { flexGrow: 1 } }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontSize: 9, color: "#4b5563" }, children: [
          latest?.candidates.length ?? 0,
          " candidates"
        ] })
      ] }),
      !latest && !loading && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        color: "#4b5563",
        textAlign: "center"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 28 }, children: "\u{1F50D}" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 12 }, children: "No state extractions yet." }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 10.5, maxWidth: 340, color: "#374151" }, children: [
          "Click ",
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { style: { color: "#a5b4fc" }, children: "Extract Now" }),
          " while the HighLevel page builder tab is open. CloneLevel will probe the page's in-memory JavaScript state and surface any builder data structures it finds."
        ] })
      ] }),
      latest && latest.candidates.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
        padding: 16,
        borderRadius: 6,
        border: "1px dashed #2a2d3d",
        background: "#0d0f17",
        color: "#6b7280",
        fontSize: 11
      }, children: latest.error ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { style: { color: "#f87171" }, children: "Error:" }),
        " ",
        latest.error
      ] }) : "No builder state objects found in window globals. The page may not be the HL editor, or the state may be in a nested iframe." }),
      latest && latest.candidates.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
          marginBottom: 8,
          fontSize: 9.5,
          color: "#6b7280",
          display: "flex",
          gap: 14
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { color: "#4ade80" }, children: [
            "Top match: ",
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: latest.candidates[0].source })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { children: [
            "Score: ",
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { style: { color: "#4ade80" }, children: latest.candidates[0].score })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { children: [
            latest.candidates[0].matchedKeys.length,
            " builder keys matched"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: formatBytes(latest.candidates[0].byteSize) })
        ] }),
        latest.candidates.map((c) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          CandidateCard,
          {
            c,
            expanded: expandedId === c.id,
            onToggle: () => setExpandedId(expandedId === c.id ? null : c.id)
          },
          c.id
        ))
      ] })
    ] });
  }
  var PAGE_SCHEMAS_KEY = "clonelevel_page_schemas";
  var FUNNEL_SCHEMAS_KEY = "clonelevel_funnel_schemas";
  var SAVE_EVENTS_KEY = "clonelevel_save_events";
  var IMPORT_CANDIDATES_KEY = "clonelevel_import_candidates";
  var IMPORT_TARGET_KEY = "clonelevel_import_target";
  var ASSETS_KEY = "clonelevel_assets";
  function downloadJson(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(() => {
    });
  }
  var TAG_COLORS = {
    IMPORT_CANDIDATE: { bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.5)", color: "#a5b4fc" },
    CREATE_CANDIDATE: { bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.45)", color: "#34d399" },
    DUPLICATE_CANDIDATE: { bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.45)", color: "#fbbf24" },
    UPDATE_CANDIDATE: { bg: "rgba(96,165,250,0.12)", border: "rgba(96,165,250,0.45)", color: "#60a5fa" },
    PUBLISH_CANDIDATE: { bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.4)", color: "#c4b5fd" },
    SAVE_CANDIDATE: { bg: "rgba(75,85,99,0.2)", border: "rgba(75,85,99,0.4)", color: "#9ca3af" }
  };
  var DRY_RUN_NOTE = `Dry-run mode \u2014 this payload preview simulates what would be sent.
No real request will be made until you click "Send Real Request".

CloneLevel cannot yet verify which of these endpoints reliably creates
or imports a page. Use this panel to study the request shape, then
choose the best candidate for your import flow.`;
  function ScoreBar({ score }) {
    const color = score >= 70 ? "#34d399" : score >= 45 ? "#fbbf24" : "#60a5fa";
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        background: "#1e2030",
        overflow: "hidden"
      }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { width: `${score}%`, height: "100%", background: color, borderRadius: 2 } }) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 10, fontWeight: 700, color, minWidth: 28, textAlign: "right" }, children: score })
    ] });
  }
  function BreakdownBar({ bd }) {
    const items = [
      ["domain", bd.domain, "#6366f1"],
      ["method", bd.method, "#34d399"],
      ["path", bd.path, "#60a5fa"],
      ["bodyKeys", bd.bodyKeys, "#fbbf24"],
      ["mutation", bd.mutation, "#c4b5fd"],
      ["tag", bd.tag, "#f87171"]
    ];
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }, children: items.map(([k, v, c]) => v > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: {
      padding: "1px 6px",
      borderRadius: 3,
      fontSize: 9,
      fontWeight: 600,
      background: `${c}22`,
      border: `1px solid ${c}55`,
      color: c
    }, children: [
      k,
      "+",
      v
    ] }, k)) });
  }
  function ImportWorkbench() {
    const [candidates, setCandidates] = (0, import_react.useState)([]);
    const [target, setTarget] = (0, import_react.useState)(null);
    const [selected, setSelected] = (0, import_react.useState)(null);
    const [loading, setLoading] = (0, import_react.useState)(false);
    const [dryRunLog, setDryRunLog] = (0, import_react.useState)([]);
    const [dryRunBusy, setDryRunBusy] = (0, import_react.useState)(false);
    const [activePayload, setActivePayload] = (0, import_react.useState)("request");
    const [filterTag, setFilterTag] = (0, import_react.useState)("ALL");
    const [sortBy, setSortBy] = (0, import_react.useState)("score");
    const [targetBusy, setTargetBusy] = (0, import_react.useState)(false);
    async function load() {
      setLoading(true);
      try {
        const r = await chrome.storage.local.get([IMPORT_CANDIDATES_KEY, IMPORT_TARGET_KEY]);
        const cands = Array.isArray(r[IMPORT_CANDIDATES_KEY]) ? r[IMPORT_CANDIDATES_KEY] : [];
        setCandidates(cands);
        setTarget(r[IMPORT_TARGET_KEY] ?? null);
        if (cands.length && !selected) setSelected(cands[0]);
      } finally {
        setLoading(false);
      }
    }
    async function handleClear() {
      await sendMsg("CLEAR_IMPORT_CANDIDATES");
      setCandidates([]);
      setSelected(null);
      setDryRunLog([]);
    }
    async function handleDetectTarget() {
      setTargetBusy(true);
      try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const tab = tabs[0];
        if (!tab?.id) {
          alert("No active tab found");
          return;
        }
        const url = tab.url ?? "";
        const isBuilder = url.includes("gohighlevel.com") || url.includes("leadconnectorhq.com");
        const pageMatch = url.match(/\/page\/([a-z0-9-]+)/i);
        const funnelMatch = url.match(/\/funnel(?:s)?\/([a-z0-9-]+)/i);
        const t = {
          tabId: tab.id,
          tabUrl: url,
          pageId: pageMatch?.[1],
          funnelId: funnelMatch?.[1],
          builderDetected: isBuilder
        };
        await sendMsg("SET_IMPORT_TARGET", t);
        setTarget({ ...t, detectedAt: (/* @__PURE__ */ new Date()).toISOString() });
      } finally {
        setTargetBusy(false);
      }
    }
    async function handleDryRun() {
      if (!selected) return;
      setDryRunBusy(true);
      const lines = [];
      const ts = () => (/* @__PURE__ */ new Date()).toISOString().slice(11, 23);
      lines.push(`[${ts()}] \u2500\u2500 Dry Run Started \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500`);
      lines.push(`[${ts()}] Endpoint : ${selected.method} ${selected.url}`);
      lines.push(`[${ts()}] Tag      : ${selected.tag}`);
      lines.push(`[${ts()}] Score    : ${selected.score}/100`);
      lines.push(`[${ts()}] Status   : ${selected.statusCode ?? "unknown"} (original capture)`);
      if (target?.builderDetected) {
        lines.push(`[${ts()}] Target   : \u2713 Builder tab detected (${target.tabUrl?.slice(0, 60) ?? "\u2014"})`);
        if (target.pageId) lines.push(`[${ts()}]   pageId   \u2192 ${target.pageId}`);
        if (target.funnelId) lines.push(`[${ts()}]   funnelId \u2192 ${target.funnelId}`);
      } else {
        lines.push(`[${ts()}] Target   : \u26A0 No builder tab set \u2014 use "Detect Target Tab" first`);
      }
      lines.push(`[${ts()}] \u2500\u2500 Payload Analysis \u2500\u2500`);
      if (selected.requestBody && selected.requestBody.length > 4) {
        try {
          const parsed = JSON.parse(selected.requestBody);
          const keys = Object.keys(parsed);
          lines.push(`[${ts()}] Request body keys (${keys.length}): ${keys.slice(0, 15).join(", ")}`);
          lines.push(`[${ts()}] Request body size: ${(selected.requestBody.length / 1024).toFixed(1)} KB`);
        } catch {
          lines.push(`[${ts()}] Request body: non-JSON (${selected.requestBody.length} bytes)`);
        }
      } else {
        lines.push(`[${ts()}] Request body: (empty)`);
      }
      if (selected.responseBody && selected.responseBody.length > 4) {
        try {
          const parsed = JSON.parse(selected.responseBody);
          const keys = Object.keys(parsed);
          lines.push(`[${ts()}] Response body keys (${keys.length}): ${keys.slice(0, 15).join(", ")}`);
          lines.push(`[${ts()}] Response body size: ${(selected.responseBody.length / 1024).toFixed(1)} KB`);
        } catch {
          lines.push(`[${ts()}] Response body: non-JSON (${selected.responseBody.length} bytes)`);
        }
      }
      lines.push(`[${ts()}] \u2500\u2500 Score Breakdown \u2500\u2500`);
      const bd = selected.scoreBreakdown;
      lines.push(`[${ts()}]   domain=${bd.domain}  method=${bd.method}  path=${bd.path}  bodyKeys=${bd.bodyKeys}  mutation=${bd.mutation}  tag=${bd.tag}`);
      lines.push(`[${ts()}] \u2500\u2500 Headers (captured) \u2500\u2500`);
      const hEntries = Object.entries(selected.requestHeaders ?? {}).slice(0, 8);
      for (const [k, v] of hEntries) {
        lines.push(`[${ts()}]   ${k}: ${String(v).slice(0, 80)}`);
      }
      lines.push(`[${ts()}] \u2500\u2500 Recommendation \u2500\u2500`);
      if (selected.score >= 70) {
        lines.push(`[${ts()}] \u{1F7E2} HIGH confidence \u2014 this endpoint is a strong candidate for page import/create`);
        lines.push(`[${ts()}]    Review the request body carefully, then adapt it for your target page`);
      } else if (selected.score >= 45) {
        lines.push(`[${ts()}] \u{1F7E1} MEDIUM confidence \u2014 plausible endpoint, verify manually`);
        lines.push(`[${ts()}]    Trigger the same action again in the builder to confirm pattern`);
      } else {
        lines.push(`[${ts()}] \u{1F535} LOW confidence \u2014 may be a read or peripheral endpoint`);
        lines.push(`[${ts()}]    Look for higher-scored CREATE/IMPORT candidates`);
      }
      lines.push(`[${ts()}] \u2500\u2500 Dry Run Complete (no request sent) \u2500\u2500\u2500\u2500\u2500`);
      setDryRunLog(lines);
      setDryRunBusy(false);
    }
    (0, import_react.useEffect)(() => {
      load();
    }, []);
    const visibleCandidates = candidates.filter((c) => filterTag === "ALL" || c.tag === filterTag).sort(
      (a, b) => sortBy === "score" ? b.score - a.score : b.capturedAt.localeCompare(a.capturedAt)
    );
    const tagCounts = candidates.reduce((acc, c) => {
      acc[c.tag] = (acc[c.tag] ?? 0) + 1;
      return acc;
    }, {});
    const allTags = [
      "ALL",
      "IMPORT_CANDIDATE",
      "CREATE_CANDIDATE",
      "DUPLICATE_CANDIDATE",
      "UPDATE_CANDIDATE",
      "PUBLISH_CANDIDATE",
      "SAVE_CANDIDATE"
    ];
    const tagLabel = {
      ALL: "All",
      IMPORT_CANDIDATE: "IMPORT",
      CREATE_CANDIDATE: "CREATE",
      DUPLICATE_CANDIDATE: "DUPE",
      UPDATE_CANDIDATE: "UPDATE",
      PUBLISH_CANDIDATE: "PUBLISH",
      SAVE_CANDIDATE: "SAVE"
    };
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
        padding: "10px 14px",
        borderBottom: "1px solid #1e2030",
        display: "flex",
        gap: 8,
        alignItems: "center",
        flexWrap: "wrap",
        background: "linear-gradient(180deg,#12141f 0%,#0d0f1a 100%)"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 12, fontWeight: 700, color: "#a5b4fc" }, children: "\u{1F50D} Import Discovery" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontSize: 10, color: "#4b5563", flex: 1 }, children: [
          candidates.length,
          " candidate",
          candidates.length !== 1 ? "s" : "",
          " captured"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: load, disabled: loading, "data-testid": "btn-refresh-import", children: loading ? "\u2026" : "\u21BB Refresh" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            className: "insp-action-btn",
            style: { color: "#60a5fa", borderColor: "rgba(96,165,250,0.35)", background: "rgba(96,165,250,0.08)" },
            onClick: handleDetectTarget,
            disabled: targetBusy,
            "data-testid": "btn-detect-target",
            children: targetBusy ? "Detecting\u2026" : "\u2316 Detect Target Tab"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            className: "insp-action-btn insp-action-danger",
            onClick: handleClear,
            disabled: candidates.length === 0,
            "data-testid": "btn-clear-import",
            children: "\u2715 Clear"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
        padding: "6px 14px",
        borderBottom: "1px solid #1a1d27",
        background: "#0d0f17",
        display: "flex",
        gap: 8,
        alignItems: "center",
        flexWrap: "wrap"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 10, fontWeight: 600, color: "#6b7280" }, children: "Import Target:" }),
        target ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: {
            padding: "1px 7px",
            borderRadius: 3,
            fontSize: 9,
            fontWeight: 700,
            background: target.builderDetected ? "rgba(52,211,153,0.12)" : "rgba(75,85,99,0.2)",
            border: `1px solid ${target.builderDetected ? "rgba(52,211,153,0.4)" : "#2a2d3d"}`,
            color: target.builderDetected ? "#34d399" : "#6b7280"
          }, children: target.builderDetected ? "\u2713 BUILDER" : "\u25CB NOT BUILDER" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 9.5, color: "#9ca3af", fontFamily: "monospace" }, children: target.tabUrl ? target.tabUrl.slice(0, 60) + (target.tabUrl.length > 60 ? "\u2026" : "") : "\u2014" }),
          target.pageId && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontSize: 9, color: "#60a5fa" }, children: [
            "page:",
            target.pageId.slice(0, 12)
          ] }),
          target.funnelId && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontSize: 9, color: "#34d399" }, children: [
            "funnel:",
            target.funnelId.slice(0, 12)
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 10, color: "#4b5563" }, children: 'None \u2014 click "Detect Target Tab" to set the active HighLevel builder tab' })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
        padding: "6px 14px",
        borderBottom: "1px solid #1a1d27",
        background: "#0d0f17",
        display: "flex",
        gap: 6,
        alignItems: "center",
        flexWrap: "wrap"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 9, color: "#6b7280", marginRight: 2 }, children: "Filter:" }),
        allTags.map((t) => {
          const tc = t === "ALL" ? void 0 : TAG_COLORS[t];
          const count = t === "ALL" ? candidates.length : tagCounts[t] ?? 0;
          const isActive = filterTag === t;
          return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "button",
            {
              onClick: () => setFilterTag(t),
              style: {
                padding: "2px 8px",
                borderRadius: 10,
                fontSize: 9,
                fontWeight: 700,
                cursor: "pointer",
                border: `1px solid ${isActive && tc ? tc.border : "#2a2d3d"}`,
                background: isActive && tc ? tc.bg : isActive ? "rgba(99,102,241,0.12)" : "transparent",
                color: isActive && tc ? tc.color : isActive ? "#a5b4fc" : "#6b7280"
              },
              "data-testid": `filter-import-tag-${t.toLowerCase()}`,
              children: [
                tagLabel[t],
                " ",
                count > 0 && `(${count})`
              ]
            },
            t
          );
        }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { marginLeft: "auto", display: "flex", gap: 5, alignItems: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 9, color: "#6b7280" }, children: "Sort:" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              onClick: () => setSortBy("score"),
              style: {
                padding: "2px 8px",
                borderRadius: 10,
                fontSize: 9,
                cursor: "pointer",
                border: "1px solid #2a2d3d",
                background: sortBy === "score" ? "rgba(99,102,241,0.15)" : "transparent",
                color: sortBy === "score" ? "#a5b4fc" : "#6b7280"
              },
              children: "Score"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              onClick: () => setSortBy("time"),
              style: {
                padding: "2px 8px",
                borderRadius: 10,
                fontSize: 9,
                cursor: "pointer",
                border: "1px solid #2a2d3d",
                background: sortBy === "time" ? "rgba(99,102,241,0.15)" : "transparent",
                color: sortBy === "time" ? "#a5b4fc" : "#6b7280"
              },
              children: "Time"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { width: 260, borderRight: "1px solid #1a1d27", overflowY: "auto", flexShrink: 0 }, children: visibleCandidates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
          padding: 20,
          textAlign: "center",
          fontSize: 11,
          color: "#4b5563",
          lineHeight: 1.6
        }, children: candidates.length === 0 ? "No import candidates yet.\n\nAttach the debugger and perform actions in the HighLevel builder:\n\u2022 Create a new page\n\u2022 Duplicate a page\n\u2022 Save the builder\n\u2022 Publish a funnel" : `No candidates match "${filterTag}"` }) : visibleCandidates.map((c) => {
          const tc = TAG_COLORS[c.tag];
          const isSelected = selected?.id === c.id;
          return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "div",
            {
              onClick: () => {
                setSelected(c);
                setDryRunLog([]);
              },
              "data-testid": `import-candidate-${c.id}`,
              style: {
                padding: "9px 12px",
                cursor: "pointer",
                borderBottom: "1px solid #1a1d27",
                background: isSelected ? "rgba(99,102,241,0.1)" : "transparent",
                borderLeft: isSelected ? "2px solid #6366f1" : "2px solid transparent"
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: {
                    padding: "1px 6px",
                    borderRadius: 3,
                    fontSize: 8,
                    fontWeight: 700,
                    letterSpacing: 0.4,
                    background: tc.bg,
                    border: `1px solid ${tc.border}`,
                    color: tc.color
                  }, children: c.tag.replace("_CANDIDATE", "") }),
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 9, color: "#6b7280", marginLeft: "auto" }, children: formatTime2(c.capturedAt) })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
                  fontSize: 9.5,
                  color: "#c4c4d4",
                  wordBreak: "break-all",
                  fontFamily: "monospace",
                  lineHeight: 1.4,
                  marginBottom: 4
                }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { color: methodColor(c.method), fontWeight: 700 }, children: c.method }),
                  " ",
                  c.url.replace(/https?:\/\/[^/]+/, "").slice(0, 55)
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ScoreBar, { score: c.score })
              ]
            },
            c.id
          );
        }) }),
        !selected ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#4b5563",
          fontSize: 11,
          textAlign: "center",
          padding: 20,
          lineHeight: 1.7
        }, children: "Select a candidate from the list to inspect its request & response payloads" }) : (() => {
          const tc = TAG_COLORS[selected.tag];
          return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 12 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", gap: 8, alignItems: "flex-start", flexWrap: "wrap" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: {
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: 0.5,
                    background: tc.bg,
                    border: `1px solid ${tc.border}`,
                    color: tc.color
                  }, children: selected.tag.replace("_CANDIDATE", "") }),
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: {
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontSize: 9,
                    fontWeight: 700,
                    background: "rgba(75,85,99,0.2)",
                    border: "1px solid #2a2d3d",
                    color: methodColor(selected.method)
                  }, children: selected.method }),
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 9, color: "#6b7280" }, children: formatTime2(selected.capturedAt) })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
                  fontSize: 10,
                  color: "#e2e8f0",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                  lineHeight: 1.5
                }, children: selected.url })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { textAlign: "right", minWidth: 60 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 22, fontWeight: 800, color: selected.score >= 70 ? "#34d399" : selected.score >= 45 ? "#fbbf24" : "#60a5fa" }, children: selected.score }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 9, color: "#6b7280" }, children: "score" })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { background: "#0d0f17", borderRadius: 4, padding: "8px 12px", border: "1px solid #1e2030" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 10, fontWeight: 700, color: "#6b7280", marginBottom: 6 }, children: "Score Breakdown" }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ScoreBar, { score: selected.score }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(BreakdownBar, { bd: selected.scoreBreakdown })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", gap: 1, marginBottom: 0, borderBottom: "1px solid #1e2030" }, children: [
                ["request", "response"].map((p) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                  "button",
                  {
                    onClick: () => setActivePayload(p),
                    style: {
                      padding: "5px 14px",
                      fontSize: 10,
                      fontWeight: 600,
                      cursor: "pointer",
                      border: "none",
                      borderBottom: activePayload === p ? "2px solid #6366f1" : "2px solid transparent",
                      background: "transparent",
                      color: activePayload === p ? "#a5b4fc" : "#6b7280"
                    },
                    "data-testid": `btn-payload-${p}`,
                    children: [
                      p === "request" ? "Request Body" : "Response Body",
                      p === "request" && selected.requestBody && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { marginLeft: 5, fontSize: 8.5, color: "#4b5563" }, children: [
                        (selected.requestBody.length / 1024).toFixed(1),
                        " KB"
                      ] }),
                      p === "response" && selected.responseBody && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { marginLeft: 5, fontSize: 8.5, color: "#4b5563" }, children: [
                        (selected.responseBody.length / 1024).toFixed(1),
                        " KB"
                      ] })
                    ]
                  },
                  p
                )),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { marginLeft: "auto", display: "flex", gap: 6, alignItems: "center", paddingBottom: 2 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                    "button",
                    {
                      className: "insp-action-btn",
                      onClick: () => copyToClipboard(activePayload === "request" ? selected.requestBody : selected.responseBody),
                      "data-testid": "btn-copy-import-payload",
                      children: "Copy"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                    "button",
                    {
                      className: "insp-action-btn",
                      onClick: () => {
                        const raw = activePayload === "request" ? selected.requestBody : selected.responseBody;
                        let parsed;
                        try {
                          parsed = JSON.parse(raw);
                        } catch {
                          parsed = raw;
                        }
                        downloadJson(parsed, `import-candidate-${activePayload}-${selected.id.slice(0, 8)}.json`);
                      },
                      "data-testid": "btn-download-import-payload",
                      children: "\u2193 .json"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
                fontFamily: "monospace",
                fontSize: 9.5,
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
                overflowX: "auto",
                background: "#0a0c14",
                border: "1px solid #1e2030",
                borderTop: "none",
                borderRadius: "0 0 4px 4px",
                padding: 10,
                color: "#d1d5db",
                maxHeight: 260,
                overflowY: "auto"
              }, children: (() => {
                const raw = activePayload === "request" ? selected.requestBody : selected.responseBody;
                if (!raw || raw.length < 2) return "(empty)";
                try {
                  return JSON.stringify(JSON.parse(raw), null, 2);
                } catch {
                  return raw;
                }
              })() })
            ] }),
            Object.keys(selected.requestHeaders ?? {}).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("details", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("summary", { style: { fontSize: 10, fontWeight: 600, color: "#6b7280", cursor: "pointer", userSelect: "none" }, children: [
                "Request Headers (",
                Object.keys(selected.requestHeaders).length,
                ")"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
                fontFamily: "monospace",
                fontSize: 9,
                lineHeight: 1.6,
                padding: "6px 10px",
                background: "#0a0c14",
                border: "1px solid #1e2030",
                borderRadius: 4,
                marginTop: 6,
                color: "#9ca3af",
                maxHeight: 120,
                overflowY: "auto"
              }, children: Object.entries(selected.requestHeaders).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { color: "#6366f1" }, children: k }),
                ": ",
                String(v)
              ] }, k)) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { background: "#0d0f17", borderRadius: 6, border: "1px solid #1e2030", overflow: "hidden" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
                padding: "8px 12px",
                background: "#12141f",
                display: "flex",
                gap: 8,
                alignItems: "center",
                borderBottom: "1px solid #1e2030"
              }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 10, fontWeight: 700, color: "#a5b4fc" }, children: "Import Workbench" }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 9, color: "#4b5563", flex: 1 }, children: "dry run only \u2014 no real requests" }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  "button",
                  {
                    className: "insp-action-btn",
                    style: { color: "#a5b4fc", borderColor: "rgba(99,102,241,0.4)", background: "rgba(99,102,241,0.12)" },
                    onClick: handleDryRun,
                    disabled: dryRunBusy,
                    "data-testid": "btn-dry-run",
                    children: dryRunBusy ? "Running\u2026" : "\u25B6 Dry Run"
                  }
                ),
                dryRunLog.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  "button",
                  {
                    className: "insp-action-btn",
                    onClick: () => copyToClipboard(dryRunLog.join("\n")),
                    "data-testid": "btn-copy-dry-run-log",
                    children: "Copy Log"
                  }
                )
              ] }),
              dryRunLog.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { padding: 12, fontSize: 10, color: "#4b5563", lineHeight: 1.7, whiteSpace: "pre-line" }, children: DRY_RUN_NOTE }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
                fontFamily: "monospace",
                fontSize: 9.5,
                lineHeight: 1.6,
                padding: "10px 12px",
                color: "#d1d5db",
                whiteSpace: "pre-wrap",
                maxHeight: 300,
                overflowY: "auto"
              }, children: dryRunLog.map((line, i) => {
                const color = line.includes("\u{1F7E2}") ? "#34d399" : line.includes("\u{1F7E1}") ? "#fbbf24" : line.includes("\u26A0") ? "#f87171" : line.includes("\u2713") ? "#34d399" : "#9ca3af";
                return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { color: line.startsWith("[") && line.includes("\u2500\u2500") ? "#6366f1" : color }, children: line }, i);
              }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
              padding: "8px 12px",
              borderRadius: 4,
              fontSize: 10,
              lineHeight: 1.6,
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#f87171"
            }, children: '\u26A0 Real import is not yet implemented. This panel is for endpoint discovery and payload analysis only. Use "Dry Run" to analyse candidates, then export the payload and adapt it manually.' })
          ] });
        })()
      ] })
    ] });
  }
  function PageSchemaPanel() {
    const [pages, setPages] = (0, import_react.useState)([]);
    const [saves, setSaves] = (0, import_react.useState)([]);
    const [selected, setSelected] = (0, import_react.useState)(null);
    const [loading, setLoading] = (0, import_react.useState)(false);
    const [diffA, setDiffA] = (0, import_react.useState)(null);
    const [diffB, setDiffB] = (0, import_react.useState)(null);
    const [showDiff, setShowDiff] = (0, import_react.useState)(false);
    const [layoutBusy, setLayoutBusy] = (0, import_react.useState)(false);
    const [layoutError, setLayoutError] = (0, import_react.useState)(null);
    async function load() {
      setLoading(true);
      try {
        const r = await chrome.storage.local.get([PAGE_SCHEMAS_KEY, SAVE_EVENTS_KEY]);
        const ps = Array.isArray(r[PAGE_SCHEMAS_KEY]) ? r[PAGE_SCHEMAS_KEY] : [];
        const sv = Array.isArray(r[SAVE_EVENTS_KEY]) ? r[SAVE_EVENTS_KEY] : [];
        setPages(ps);
        setSaves(sv);
        if (ps.length && !selected) setSelected(ps[0]);
      } finally {
        setLoading(false);
      }
    }
    async function handleDownloadLayout() {
      if (!selected) return;
      setLayoutBusy(true);
      setLayoutError(null);
      try {
        if (selected.pageLayout) {
          downloadJson(selected.pageLayout, `page-layout-${selected.pageId}.json`);
          return;
        }
        const res = await sendMsg("FETCH_PAGE_LAYOUT", { pageId: selected.pageId });
        if (!res?.ok) {
          setLayoutError(res?.error ?? "Fetch failed");
          return;
        }
        downloadJson(res.data, `page-layout-${selected.pageId}.json`);
        await load();
        const r = await chrome.storage.local.get(PAGE_SCHEMAS_KEY);
        const ps = Array.isArray(r[PAGE_SCHEMAS_KEY]) ? r[PAGE_SCHEMAS_KEY] : [];
        const updated = ps.find((p) => p.pageId === selected.pageId);
        if (updated) setSelected(updated);
      } catch (e) {
        setLayoutError(String(e));
      } finally {
        setLayoutBusy(false);
      }
    }
    (0, import_react.useEffect)(() => {
      load();
    }, []);
    const linkedSaves = selected ? saves.filter((s) => s.pageId === selected.pageId) : [];
    const samePageVersions = pages.filter((p) => selected && p.pageId === selected.pageId);
    if (showDiff && diffA && diffB) {
      let parsedA, parsedB;
      let parseErr = "";
      try {
        parsedA = JSON.parse(diffA.raw);
      } catch {
        parseErr = "A not valid JSON";
      }
      try {
        parsedB = JSON.parse(diffB.raw);
      } catch {
        parseErr = "B not valid JSON";
      }
      const changes = [];
      if (!parseErr) {
        const aKeys = new Set(Object.keys(parsedA));
        const bKeys = new Set(Object.keys(parsedB));
        for (const k of aKeys) {
          if (!bKeys.has(k)) changes.push(`\u2212 removed: ${k}`);
        }
        for (const k of bKeys) {
          if (!aKeys.has(k)) changes.push(`+ added: ${k}`);
          else if (JSON.stringify(parsedA[k]) !== JSON.stringify(parsedB[k])) changes.push(`~ changed: ${k}`);
        }
        const aSum = diffA.summary;
        const bSum = diffB.summary;
        if (aSum.sections !== bSum.sections) changes.unshift(`Sections: ${aSum.sections} \u2192 ${bSum.sections}`);
        if (aSum.rows !== bSum.rows) changes.unshift(`Rows: ${aSum.rows} \u2192 ${bSum.rows}`);
        if (aSum.columns !== bSum.columns) changes.unshift(`Columns: ${aSum.columns} \u2192 ${bSum.columns}`);
        if (aSum.elements !== bSum.elements) changes.unshift(`Elements: ${aSum.elements} \u2192 ${bSum.elements}`);
      }
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", flexDirection: "column", height: "100%", padding: 12, gap: 8, overflowY: "auto" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: () => setShowDiff(false), children: "\u2190 Back" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 12, fontWeight: 700, color: "#a5b4fc" }, children: "Page Schema Diff" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontSize: 10, color: "#6b7280" }, children: [
            "A: ",
            formatTime2(diffA.capturedAt),
            " \xB7 B: ",
            formatTime2(diffB.capturedAt)
          ] })
        ] }),
        parseErr ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { color: "#f87171", fontSize: 11 }, children: [
          "Parse error: ",
          parseErr
        ] }) : changes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { color: "#4ade80", fontSize: 11 }, children: "\u2713 No differences between A and B" }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontFamily: "monospace", fontSize: 11, lineHeight: 1.6, whiteSpace: "pre-wrap", color: "#e2e8f0" }, children: changes.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
          color: c.startsWith("+") ? "#4ade80" : c.startsWith("\u2212") ? "#f87171" : c.startsWith("~") ? "#f5c842" : "#22d3ee"
        }, children: c }, i)) })
      ] });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", height: "100%", overflow: "hidden" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
        width: 240,
        flexShrink: 0,
        borderRight: "1px solid #2a2d3d",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
          padding: "6px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #2a2d3d",
          background: "#111318"
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontSize: 10, fontWeight: 700, color: "#a5b4fc" }, children: [
            "PAGE SCHEMAS (",
            pages.length,
            ")"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: load, disabled: loading, "data-testid": "btn-refresh-pages", children: "\u21BB" })
        ] }),
        pages.length === 0 && !loading && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { padding: 16, color: "#4b5563", fontSize: 10.5, lineHeight: 1.5, textAlign: "center" }, children: "No page schemas captured yet. In the HL builder, navigate to a page \u2014 CloneLevel will automatically capture the GET /funnels/page/{pageId} response." }),
        pages.map((p) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
          "div",
          {
            onClick: () => setSelected(p),
            "data-testid": `page-schema-row-${p.pageId}`,
            style: {
              padding: "7px 10px",
              cursor: "pointer",
              borderBottom: "1px solid #1a1d27",
              background: selected?.snapshotId === p.snapshotId ? "rgba(99,102,241,0.12)" : "transparent"
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 10, fontWeight: 700, color: "#e2e8f0", wordBreak: "break-all" }, children: p.title ?? p.pageId }),
              p.slug && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 9.5, color: "#60a5fa" }, children: p.slug }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 9, color: "#6b7280", display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }, children: [
                "\xA7",
                p.summary.sections,
                " R",
                p.summary.rows,
                " C",
                p.summary.columns,
                " E",
                p.summary.elements,
                " \xB7 ",
                formatTime2(p.capturedAt),
                p.pageLayout && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: {
                  display: "inline-block",
                  padding: "1px 5px",
                  borderRadius: 3,
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  background: "rgba(52,211,153,0.15)",
                  border: "1px solid rgba(52,211,153,0.4)",
                  color: "#34d399"
                }, children: "LAYOUT" })
              ] })
            ]
          },
          `${p.pageId}:${p.snapshotId}`
        ))
      ] }),
      !selected ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#4b5563", fontSize: 11 }, children: "Select a page schema from the list" }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 13, fontWeight: 700, color: "#e2e8f0" }, children: selected.title ?? selected.pageId }),
          selected.slug && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 10, color: "#60a5fa" }, children: selected.slug }),
          selected.pageLayout && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: {
            padding: "2px 7px",
            borderRadius: 3,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 0.5,
            background: "rgba(52,211,153,0.15)",
            border: "1px solid rgba(52,211,153,0.4)",
            color: "#34d399"
          }, children: "\u2713 LAYOUT_CAPTURED" }),
          selected.pageDataDownloadUrl && !selected.pageLayout && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: {
            padding: "2px 7px",
            borderRadius: 3,
            fontSize: 9,
            fontWeight: 600,
            background: "rgba(251,191,36,0.1)",
            border: "1px solid rgba(251,191,36,0.3)",
            color: "#fbbf24"
          }, children: "LAYOUT_URL \u2193" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 9, color: "#6b7280", marginLeft: "auto" }, children: formatTime2(selected.capturedAt) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" }, children: ["sections", "rows", "columns", "elements"].map((k) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
          padding: "4px 10px",
          borderRadius: 4,
          background: "#1a1d27",
          border: "1px solid #2a2d3d",
          textAlign: "center"
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 16, fontWeight: 700, color: "#a5b4fc" }, children: selected.summary[k] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 9, color: "#6b7280", textTransform: "uppercase" }, children: k })
        ] }, k)) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 10, color: "#6b7280" }, children: [
          "Page ID: ",
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { color: "#e2e8f0", fontFamily: "monospace" }, children: selected.pageId })
        ] }),
        linkedSaves.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 10, fontWeight: 700, color: "#f5c842", marginBottom: 4 }, children: [
            "Linked save events (",
            linkedSaves.length,
            ")"
          ] }),
          linkedSaves.slice(0, 5).map((s) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
            fontSize: 9.5,
            padding: "3px 8px",
            marginBottom: 2,
            borderRadius: 3,
            background: "rgba(245,200,66,0.08)",
            border: "1px solid rgba(245,200,66,0.2)",
            color: "#e2e8f0"
          }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { color: "#f5c842" }, children: s.eventType }),
            " \xB7 ",
            formatTime2(s.capturedAt),
            " \xB7 ",
            formatBytes(s.bodySize),
            " body"
          ] }, s.snapshotId))
        ] }),
        selected.elementTypes && Object.keys(selected.elementTypes).length > 0 && (() => {
          const known = [
            "section",
            "row",
            "column",
            "headline",
            "paragraph",
            "text",
            "richtext",
            "image",
            "video",
            "button",
            "form",
            "input",
            "icon",
            "list",
            "countdown",
            "timer",
            "divider",
            "spacer",
            "html",
            "custom",
            "embed",
            "map",
            "survey",
            "calendar",
            "testimonial",
            "slider",
            "carousel",
            "tabs",
            "accordion"
          ];
          const entries = Object.entries(selected.elementTypes).sort((a, b) => b[1] - a[1]).slice(0, 40);
          const knownEntries = entries.filter(([k]) => known.includes(k));
          const unknownEntries = entries.filter(([k]) => !known.includes(k)).slice(0, 10);
          return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 10, fontWeight: 700, color: "#a5b4fc", marginBottom: 6 }, children: "Builder Tree" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 6 }, children: [
              knownEntries.map(([type, count]) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: {
                padding: "2px 8px",
                borderRadius: 3,
                fontSize: 10,
                fontWeight: 600,
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.25)",
                color: "#a5b4fc",
                display: "flex",
                gap: 5,
                alignItems: "center"
              }, children: [
                type,
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: {
                  background: "#6366f1",
                  color: "#fff",
                  borderRadius: 10,
                  padding: "0 5px",
                  fontSize: 9,
                  fontWeight: 700,
                  minWidth: 14,
                  textAlign: "center"
                }, children: count })
              ] }, type)),
              unknownEntries.map(([type, count]) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: {
                padding: "2px 8px",
                borderRadius: 3,
                fontSize: 10,
                fontWeight: 600,
                background: "rgba(75,85,99,0.15)",
                border: "1px solid rgba(75,85,99,0.3)",
                color: "#9ca3af",
                display: "flex",
                gap: 5,
                alignItems: "center"
              }, children: [
                type,
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: {
                  background: "#4b5563",
                  color: "#fff",
                  borderRadius: 10,
                  padding: "0 5px",
                  fontSize: 9,
                  fontWeight: 700,
                  minWidth: 14,
                  textAlign: "center"
                }, children: count })
              ] }, type))
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 9, color: "#4b5563" }, children: [
              Object.keys(selected.elementTypes).length,
              " unique element types detected"
            ] })
          ] });
        })(),
        samePageVersions.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 10, color: "#6b7280" }, children: "Diff mode:" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              className: "insp-action-btn",
              style: { fontSize: 9.5, color: diffA?.snapshotId === selected.snapshotId ? "#a5b4fc" : void 0 },
              onClick: () => {
                setDiffA(selected);
              },
              "data-testid": "btn-diff-set-a",
              children: diffA ? diffA.snapshotId === selected.snapshotId ? "\u2713 Set as A" : "Set as A" : "Set as A"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              className: "insp-action-btn",
              style: { fontSize: 9.5, color: diffB?.snapshotId === selected.snapshotId ? "#f5c842" : void 0 },
              onClick: () => {
                setDiffB(selected);
              },
              "data-testid": "btn-diff-set-b",
              children: diffB ? diffB.snapshotId === selected.snapshotId ? "\u2713 Set as B" : "Set as B" : "Set as B"
            }
          ),
          diffA && diffB && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: () => setShowDiff(true), "data-testid": "btn-compare-pages", children: "Compare \u2192" }),
          (diffA || diffB) && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: () => {
            setDiffA(null);
            setDiffB(null);
          }, "data-testid": "btn-clear-diff", children: "\u2715" }),
          diffA && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontSize: 9, color: "#a5b4fc" }, children: [
            "A: ",
            formatTime2(diffA.capturedAt)
          ] }),
          diffB && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontSize: 9, color: "#f5c842" }, children: [
            "B: ",
            formatTime2(diffB.capturedAt)
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              className: "insp-action-btn",
              onClick: () => copyToClipboard(selected.raw),
              "data-testid": "btn-copy-page-schema",
              children: "Copy JSON"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              className: "insp-action-btn",
              onClick: () => {
                let parsed;
                try {
                  parsed = JSON.parse(selected.raw);
                } catch {
                  parsed = selected.raw;
                }
                downloadJson(parsed, `page-schema-${selected.pageId}.json`);
              },
              "data-testid": "btn-export-page-schema",
              children: "\u2193 page-schema.json"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              className: "insp-action-btn",
              style: selected.pageLayout ? {
                color: "#34d399",
                borderColor: "rgba(52,211,153,0.35)",
                background: "rgba(52,211,153,0.08)"
              } : selected.pageDataDownloadUrl ? {
                color: "#fbbf24",
                borderColor: "rgba(251,191,36,0.35)",
                background: "rgba(251,191,36,0.07)"
              } : { opacity: 0.4 },
              onClick: handleDownloadLayout,
              disabled: layoutBusy || !selected.pageDataDownloadUrl && !selected.pageLayout,
              title: !selected.pageDataDownloadUrl && !selected.pageLayout ? "No pageDataDownloadUrl in this schema" : selected.pageLayout ? "Re-download or save cached layout" : "Fetch layout JSON from Firebase",
              "data-testid": "btn-download-page-layout",
              children: layoutBusy ? "Fetching\u2026" : selected.pageLayout ? "\u2193 page-layout.json" : "\u2193 Download Page Layout"
            }
          )
        ] }),
        layoutError && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
          padding: "6px 10px",
          borderRadius: 4,
          fontSize: 10,
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.3)",
          color: "#f87171"
        }, children: layoutError }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
          fontFamily: "monospace",
          fontSize: 10,
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
          overflowX: "auto",
          background: "#0d0f17",
          border: "1px solid #2a2d3d",
          borderRadius: 4,
          padding: 10,
          color: "#d1d5db",
          maxHeight: 420,
          overflowY: "auto"
        }, children: (() => {
          try {
            return JSON.stringify(JSON.parse(selected.raw), null, 2);
          } catch {
            return selected.raw;
          }
        })() })
      ] })
    ] });
  }
  var ASSET_TYPE_COLORS = {
    image: { bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.4)", color: "#a5b4fc" },
    video: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.4)", color: "#fca5a5" },
    font: { bg: "rgba(234,179,8,0.12)", border: "rgba(234,179,8,0.4)", color: "#fde047" },
    audio: { bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.4)", color: "#6ee7b7" },
    script: { bg: "rgba(96,165,250,0.12)", border: "rgba(96,165,250,0.4)", color: "#93c5fd" },
    style: { bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.4)", color: "#c4b5fd" },
    other: { bg: "rgba(107,114,128,0.12)", border: "rgba(107,114,128,0.4)", color: "#9ca3af" }
  };
  function AssetTypeBadge({ type }) {
    const c = ASSET_TYPE_COLORS[type];
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: {
      fontSize: 9,
      fontWeight: 700,
      padding: "1px 5px",
      borderRadius: 3,
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.color,
      letterSpacing: "0.04em",
      textTransform: "uppercase"
    }, children: type });
  }
  function AssetLibraryPanel() {
    const [assets, setAssets] = (0, import_react.useState)([]);
    const [typeFilter, setTypeFilter] = (0, import_react.useState)("ALL");
    const [loading, setLoading] = (0, import_react.useState)(false);
    const [rebuilding, setRebuilding] = (0, import_react.useState)(false);
    const [selected, setSelected] = (0, import_react.useState)(null);
    const [viewMode, setViewMode] = (0, import_react.useState)("grid");
    async function load() {
      setLoading(true);
      try {
        const r = await chrome.storage.local.get(ASSETS_KEY);
        setAssets(Array.isArray(r[ASSETS_KEY]) ? r[ASSETS_KEY] : []);
      } finally {
        setLoading(false);
      }
    }
    async function rebuild() {
      setRebuilding(true);
      try {
        await sendMsg("REBUILD_ASSET_STORE");
        await load();
      } finally {
        setRebuilding(false);
      }
    }
    async function clearAll() {
      await sendMsg("CLEAR_ASSETS");
      setAssets([]);
      setSelected(null);
    }
    (0, import_react.useEffect)(() => {
      load();
      const onChange = (changes, area) => {
        if (area === "local" && changes[ASSETS_KEY]) {
          const v = changes[ASSETS_KEY].newValue;
          setAssets(Array.isArray(v) ? v : []);
        }
      };
      chrome.storage.onChanged.addListener(onChange);
      return () => chrome.storage.onChanged.removeListener(onChange);
    }, []);
    const counts = (0, import_react.useMemo)(() => {
      const c = { ALL: assets.length };
      for (const a of assets) c[a.type] = (c[a.type] ?? 0) + 1;
      return c;
    }, [assets]);
    const filtered = (0, import_react.useMemo)(
      () => typeFilter === "ALL" ? assets : assets.filter((a) => a.type === typeFilter),
      [assets, typeFilter]
    );
    const TYPE_TABS = [
      ["ALL", "All"],
      ["image", "Images"],
      ["video", "Videos"],
      ["font", "Fonts"],
      ["audio", "Audio"],
      ["script", "Scripts"],
      ["style", "Styles"],
      ["other", "Other"]
    ];
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", height: "100%", overflow: "hidden", flexDirection: "column" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
        padding: "8px 14px",
        background: "#111318",
        borderBottom: "1px solid #2a2d3d",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 11, fontWeight: 700, color: "#a5b4fc" }, children: "\u{1F5BC} Asset Library" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontSize: 10, color: "#6b7280" }, children: [
          assets.length,
          " URLs found across ",
          new Set(assets.map((a) => a.pageId)).size,
          " pages"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { flex: 1 } }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", gap: 2 }, children: ["grid", "list"].map((m) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            className: `insp-action-btn${viewMode === m ? " active" : ""}`,
            onClick: () => setViewMode(m),
            "data-testid": `btn-view-${m}`,
            children: m === "grid" ? "\u229E" : "\u2261"
          },
          m
        )) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: load, disabled: loading, "data-testid": "btn-refresh-assets", children: "\u21BB" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            className: "insp-action-btn",
            onClick: rebuild,
            disabled: rebuilding,
            style: { color: "#a5b4fc", borderColor: "rgba(99,102,241,0.3)" },
            "data-testid": "btn-rebuild-assets",
            title: "Re-scan all captured page layouts for asset URLs",
            children: rebuilding ? "Scanning\u2026" : "\u{1F50D} Scan"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            className: "insp-action-btn insp-action-danger",
            onClick: clearAll,
            disabled: assets.length === 0,
            "data-testid": "btn-clear-assets",
            children: "\u2715 Clear"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
        display: "flex",
        gap: 4,
        padding: "6px 14px",
        flexShrink: 0,
        borderBottom: "1px solid #2a2d3d",
        background: "#0f1117",
        flexWrap: "wrap"
      }, children: [
        TYPE_TABS.map(([key, label]) => {
          const cnt = counts[key] ?? 0;
          const active = typeFilter === key;
          const c = key !== "ALL" ? ASSET_TYPE_COLORS[key] : null;
          return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "button",
            {
              onClick: () => setTypeFilter(key),
              "data-testid": `asset-type-${key}`,
              style: {
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 4,
                cursor: "pointer",
                background: active ? c?.bg ?? "rgba(255,255,255,0.08)" : "transparent",
                border: active ? `1px solid ${c?.border ?? "rgba(255,255,255,0.2)"}` : "1px solid transparent",
                color: active ? c?.color ?? "#e2e8f0" : "#6b7280",
                fontWeight: active ? 700 : 400
              },
              children: [
                label,
                " ",
                cnt > 0 ? `(${cnt})` : ""
              ]
            },
            key
          );
        }),
        filtered.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
          "button",
          {
            className: "insp-action-btn",
            style: { marginLeft: "auto", fontSize: 9 },
            onClick: () => {
              const data = JSON.stringify(filtered, null, 2);
              const blob = new Blob([data], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `assets-${typeFilter.toLowerCase()}.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            },
            "data-testid": "btn-export-assets",
            children: [
              "\u2193 Export ",
              typeFilter === "ALL" ? "All" : typeFilter,
              " (",
              filtered.length,
              ")"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, overflow: "hidden", display: "flex" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, overflowY: "auto", padding: 12 }, children: [
          loading && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { textAlign: "center", padding: 32, color: "#4b5563", fontSize: 11 }, children: "Loading\u2026" }),
          !loading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { padding: 32, color: "#4b5563", fontSize: 11, textAlign: "center", lineHeight: 1.6 }, children: assets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
            "No assets found yet. Download page layouts first (\u{1F4C4} Pages tab \u2192 Download Layout), then click ",
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { style: { color: "#a5b4fc" }, children: "\u{1F50D} Scan" }),
            " to extract asset URLs from them."
          ] }) : `No ${typeFilter} assets found.` }),
          !loading && filtered.length > 0 && viewMode === "grid" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 8
          }, children: filtered.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "div",
            {
              "data-testid": `asset-grid-${i}`,
              onClick: () => setSelected(a === selected ? null : a),
              style: {
                borderRadius: 6,
                overflow: "hidden",
                cursor: "pointer",
                border: selected === a ? `1px solid ${ASSET_TYPE_COLORS[a.type].border}` : "1px solid #2a2d3d",
                background: selected === a ? ASSET_TYPE_COLORS[a.type].bg : "#1a1d27"
              },
              children: [
                a.type === "image" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { width: "100%", height: 90, overflow: "hidden", background: "#0d0f17" }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  "img",
                  {
                    src: a.url,
                    alt: "",
                    loading: "lazy",
                    style: { width: "100%", height: "100%", objectFit: "cover" },
                    onError: (e) => {
                      e.target.style.display = "none";
                    }
                  }
                ) }) : a.type === "video" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
                  width: "100%",
                  height: 90,
                  background: "#0d0f17",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  color: "#fca5a5"
                }, children: "\u25B6" }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
                  width: "100%",
                  height: 55,
                  background: "#0d0f17",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  color: ASSET_TYPE_COLORS[a.type].color
                }, children: a.type === "font" ? "A" : a.type === "audio" ? "\u266A" : a.type === "script" ? "JS" : a.type === "style" ? "CSS" : "?" }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { padding: "5px 7px" }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 9, color: "#9ca3af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: a.domain }),
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 4, marginTop: 3 }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AssetTypeBadge, { type: a.type }),
                    a.ext && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontSize: 8.5, color: "#4b5563" }, children: [
                      ".",
                      a.ext
                    ] })
                  ] })
                ] })
              ]
            },
            `${a.url}::${i}`
          )) }),
          !loading && filtered.length > 0 && viewMode === "list" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 2 }, children: filtered.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "div",
            {
              "data-testid": `asset-list-${i}`,
              onClick: () => setSelected(a === selected ? null : a),
              style: {
                padding: "5px 10px",
                borderRadius: 5,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: selected === a ? `1px solid ${ASSET_TYPE_COLORS[a.type].border}` : "1px solid #2a2d3d",
                background: selected === a ? ASSET_TYPE_COLORS[a.type].bg : "#1a1d27"
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AssetTypeBadge, { type: a.type }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 9.5, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: (() => {
                    try {
                      return new URL(a.url).pathname;
                    } catch {
                      return a.url;
                    }
                  })() }),
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 8.5, color: "#6b7280" }, children: [
                    a.domain,
                    " \xB7 ",
                    a.pageTitle
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  "button",
                  {
                    className: "insp-action-btn",
                    style: { fontSize: 9, padding: "1px 5px", flexShrink: 0 },
                    onClick: (ev) => {
                      ev.stopPropagation();
                      copyToClipboard(a.url);
                    },
                    "data-testid": `btn-copy-asset-${i}`,
                    children: "Copy"
                  }
                )
              ]
            },
            `${a.url}::${i}`
          )) })
        ] }),
        selected && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
          width: 280,
          flexShrink: 0,
          borderLeft: "1px solid #2a2d3d",
          background: "#1a1d27",
          overflowY: "auto",
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 10
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AssetTypeBadge, { type: selected.type }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: () => setSelected(null), children: "\u2715" })
          ] }),
          selected.type === "image" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "img",
            {
              src: selected.url,
              alt: "",
              loading: "lazy",
              style: {
                width: "100%",
                maxHeight: 160,
                objectFit: "contain",
                background: "#0d0f17",
                borderRadius: 4,
                border: "1px solid #2a2d3d"
              },
              onError: (e) => {
                e.target.style.display = "none";
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 9.5, color: "#9ca3af", wordBreak: "break-all" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { style: { color: "#e2e8f0" }, children: "URL:" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { marginTop: 2, fontFamily: "monospace", fontSize: 9, lineHeight: 1.4 }, children: selected.url })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 9.5, color: "#6b7280" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { color: "#9ca3af" }, children: "Domain:" }),
              " ",
              selected.domain
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { color: "#9ca3af" }, children: "Ext:" }),
              " ",
              selected.ext || "\u2014"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { color: "#9ca3af" }, children: "Page:" }),
              " ",
              selected.pageTitle
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { color: "#9ca3af" }, children: "Page ID:" }),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontFamily: "monospace" }, children: [
                selected.pageId.slice(0, 16),
                "\u2026"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "button",
              {
                className: "insp-action-btn",
                onClick: () => copyToClipboard(selected.url),
                "data-testid": "btn-copy-asset-url",
                children: "Copy URL"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "a",
              {
                href: selected.url,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "insp-action-btn",
                style: { textDecoration: "none", display: "inline-block" },
                "data-testid": "link-open-asset",
                children: "Open \u2197"
              }
            )
          ] })
        ] })
      ] })
    ] });
  }
  function FunnelSchemaPanel() {
    const [funnels, setFunnels] = (0, import_react.useState)([]);
    const [pages, setPages] = (0, import_react.useState)([]);
    const [selected, setSelected] = (0, import_react.useState)(null);
    const [loading, setLoading] = (0, import_react.useState)(false);
    const [pkgBusy, setPkgBusy] = (0, import_react.useState)(false);
    const [bulkBusy, setBulkBusy] = (0, import_react.useState)(false);
    const [bulkLog, setBulkLog] = (0, import_react.useState)([]);
    const [showJson, setShowJson] = (0, import_react.useState)(false);
    const [layoutBusy, setLayoutBusy] = (0, import_react.useState)(/* @__PURE__ */ new Set());
    async function load() {
      setLoading(true);
      try {
        const r = await chrome.storage.local.get([FUNNEL_SCHEMAS_KEY, PAGE_SCHEMAS_KEY]);
        const fs = Array.isArray(r[FUNNEL_SCHEMAS_KEY]) ? r[FUNNEL_SCHEMAS_KEY] : [];
        const ps = Array.isArray(r[PAGE_SCHEMAS_KEY]) ? r[PAGE_SCHEMAS_KEY] : [];
        setFunnels(fs);
        setPages(ps);
        if (fs.length && !selected) setSelected(fs[0]);
      } finally {
        setLoading(false);
      }
    }
    (0, import_react.useEffect)(() => {
      load();
      const onChange = (changes, area) => {
        if (area !== "local") return;
        if (changes[FUNNEL_SCHEMAS_KEY] || changes[PAGE_SCHEMAS_KEY]) load();
      };
      chrome.storage.onChanged.addListener(onChange);
      return () => chrome.storage.onChanged.removeListener(onChange);
    }, []);
    async function exportFunnelPackage() {
      if (!selected) return;
      setPkgBusy(true);
      try {
        const res = await sendMsg("GET_FUNNEL_PACKAGE", { funnelId: selected.funnelId });
        if (res?.ok && res.data) {
          downloadJson(res.data, `full-funnel-package-${selected.funnelId}.json`);
        } else {
          const pageIds = new Set(selected.pageIds);
          const pkg = { funnel: selected, pages: pages.filter((p) => pageIds.has(p.pageId)), exportedAt: (/* @__PURE__ */ new Date()).toISOString() };
          downloadJson(pkg, `full-funnel-package-${selected.funnelId}.json`);
        }
      } finally {
        setPkgBusy(false);
      }
    }
    async function fetchSingleLayout(pageId) {
      setLayoutBusy((s) => /* @__PURE__ */ new Set([...s, pageId]));
      try {
        await sendMsg("FETCH_PAGE_LAYOUT", { pageId });
        await load();
      } finally {
        setLayoutBusy((s) => {
          const n = new Set(s);
          n.delete(pageId);
          return n;
        });
      }
    }
    async function bulkFetchLayouts() {
      if (!selected) return;
      setBulkBusy(true);
      setBulkLog(["Starting bulk layout fetch\u2026"]);
      const capturedPages = pages.filter((p) => selected.pageIds.includes(p.pageId) && !p.pageLayout && p.pageDataDownloadUrl);
      if (capturedPages.length === 0) {
        setBulkLog(["All captured pages already have layouts downloaded."]);
        setBulkBusy(false);
        return;
      }
      let done = 0;
      for (const pg of capturedPages) {
        setBulkLog((prev) => [...prev, `[${done + 1}/${capturedPages.length}] Fetching: ${pg.title ?? pg.pageId}\u2026`]);
        try {
          await sendMsg("FETCH_PAGE_LAYOUT", { pageId: pg.pageId });
          done++;
          setBulkLog((prev) => [...prev, `  \u2713 Done`]);
        } catch {
          setBulkLog((prev) => [...prev, `  \u2717 Failed`]);
        }
      }
      await load();
      setBulkLog((prev) => [...prev, `
Completed: ${done}/${capturedPages.length} layouts fetched.`]);
      setBulkBusy(false);
    }
    const knownPages = selected ? pages.filter((p) => selected.pageIds.includes(p.pageId)) : [];
    const totalPageIds = selected?.pageIds.length ?? 0;
    const capturedCount = knownPages.length;
    const layoutCount = knownPages.filter((p) => !!p.pageLayout).length;
    const capturePct = totalPageIds > 0 ? Math.round(capturedCount / totalPageIds * 100) : 0;
    const layoutPct = capturedCount > 0 ? Math.round(layoutCount / capturedCount * 100) : 0;
    const capturedSet = new Set(knownPages.map((kp) => kp.pageId));
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", height: "100%", overflow: "hidden" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
        width: 230,
        flexShrink: 0,
        borderRight: "1px solid #2a2d3d",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
          padding: "7px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #2a2d3d",
          background: "#111318",
          flexShrink: 0
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontSize: 10, fontWeight: 700, color: "#34d399" }, children: [
            "FUNNELS (",
            funnels.length,
            ")"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: load, disabled: loading, "data-testid": "btn-refresh-funnels", children: "\u21BB" })
        ] }),
        funnels.length === 0 && !loading && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { padding: 16, color: "#4b5563", fontSize: 10.5, lineHeight: 1.6, textAlign: "center" }, children: "No funnel schemas yet. Open a funnel in the HL builder \u2014 CloneLevel captures GET /funnels/funnel/fetch/{id} automatically." }),
        funnels.map((f) => {
          const fps = pages.filter((p) => f.pageIds.includes(p.pageId));
          const flayouts = fps.filter((p) => !!p.pageLayout).length;
          return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "div",
            {
              onClick: () => setSelected(f),
              "data-testid": `funnel-schema-row-${f.funnelId}`,
              style: {
                padding: "8px 10px",
                cursor: "pointer",
                borderBottom: "1px solid #1a1d27",
                background: selected?.snapshotId === f.snapshotId ? "rgba(52,211,153,0.1)" : "transparent"
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 10, fontWeight: 700, color: "#e2e8f0", wordBreak: "break-all" }, children: f.name ?? f.funnelId }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 9, color: "#6b7280", marginTop: 2 }, children: [
                  f.pageCount,
                  " pages \xB7 ",
                  fps.length,
                  " captured \xB7 ",
                  flayouts,
                  " layouts"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 9, color: "#4b5563", marginTop: 1 }, children: formatTime2(f.capturedAt) })
              ]
            },
            `${f.funnelId}:${f.snapshotId}`
          );
        })
      ] }),
      !selected ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#4b5563", fontSize: 11 }, children: "Select a funnel from the list" }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 13, fontWeight: 700, color: "#e2e8f0" }, children: selected.name ?? selected.funnelId }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: {
            fontSize: 9.5,
            padding: "1px 6px",
            borderRadius: 3,
            background: "rgba(52,211,153,0.1)",
            border: "1px solid rgba(52,211,153,0.25)",
            color: "#34d399"
          }, children: [
            selected.pageCount,
            " pages"
          ] }),
          selected.steps?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: {
            fontSize: 9.5,
            padding: "1px 6px",
            borderRadius: 3,
            background: "rgba(167,139,250,0.1)",
            border: "1px solid rgba(167,139,250,0.25)",
            color: "#c4b5fd"
          }, children: [
            selected.steps.length,
            " steps"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 9, color: "#6b7280", marginLeft: "auto" }, children: formatTime2(selected.capturedAt) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 9.5, color: "#6b7280" }, children: [
          "ID: ",
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { color: "#9ca3af", fontFamily: "monospace", fontSize: 9 }, children: selected.funnelId })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
          background: "#111318",
          border: "1px solid #2a2d3d",
          borderRadius: 6,
          padding: "10px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 8
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 9.5, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", textTransform: "uppercase" }, children: "Coverage" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 3, fontSize: 9 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { color: "#9ca3af" }, children: "Schemas captured" }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { color: capturedCount === totalPageIds ? "#34d399" : "#fbbf24" }, children: [
                capturedCount,
                " / ",
                totalPageIds,
                " (",
                capturePct,
                "%)"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { height: 4, background: "#1e2030", borderRadius: 2, overflow: "hidden" }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { height: "100%", width: `${capturePct}%`, background: capturedCount === totalPageIds ? "#34d399" : "#fbbf24", borderRadius: 2 } }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 3, fontSize: 9 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { color: "#9ca3af" }, children: "Layouts downloaded" }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { color: layoutCount === capturedCount && capturedCount > 0 ? "#34d399" : "#60a5fa" }, children: [
                layoutCount,
                " / ",
                capturedCount,
                " (",
                layoutPct,
                "%)"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { height: 4, background: "#1e2030", borderRadius: 2, overflow: "hidden" }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { height: "100%", width: `${layoutPct}%`, background: "#60a5fa", borderRadius: 2 } }) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              className: "insp-action-btn",
              style: { color: "#60a5fa", borderColor: "rgba(96,165,250,0.3)", background: "rgba(96,165,250,0.08)" },
              onClick: bulkFetchLayouts,
              disabled: bulkBusy || capturedCount === 0,
              "data-testid": "btn-bulk-fetch-layouts",
              children: bulkBusy ? "Fetching\u2026" : `\u2193 Fetch All Layouts (${capturedCount - layoutCount} pending)`
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              className: "insp-action-btn",
              style: { color: "#34d399", borderColor: "rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.08)" },
              onClick: exportFunnelPackage,
              disabled: pkgBusy,
              "data-testid": "btn-export-funnel-package",
              children: pkgBusy ? "Building\u2026" : "\u2193 Export Full Package"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: () => copyToClipboard(selected.raw), "data-testid": "btn-copy-funnel-schema", children: "Copy JSON" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              className: "insp-action-btn",
              onClick: () => {
                let p;
                try {
                  p = JSON.parse(selected.raw);
                } catch {
                  p = selected.raw;
                }
                downloadJson(p, `funnel-schema-${selected.funnelId}.json`);
              },
              "data-testid": "btn-export-funnel-schema",
              children: "\u2193 funnel-schema.json"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: () => setShowJson((v) => !v), "data-testid": "btn-toggle-funnel-json", children: showJson ? "\u25BC Hide JSON" : "\u25B6 Show JSON" })
        ] }),
        bulkLog.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
          background: "#0d0f17",
          border: "1px solid #2a2d3d",
          borderRadius: 4,
          padding: 8,
          fontFamily: "monospace",
          fontSize: 9,
          lineHeight: 1.5,
          color: "#9ca3af",
          maxHeight: 120,
          overflowY: "auto",
          whiteSpace: "pre-wrap"
        }, children: bulkLog.join("\n") }),
        (selected.steps?.length > 0 || selected.pageIds?.length > 0) && (() => {
          if (selected.steps?.length > 0) {
            const STEP_PALETTES = [
              { grad: "linear-gradient(135deg,#312e81,#4f46e5)", accent: "#6366f1", glow: "rgba(99,102,241,0.35)" },
              { grad: "linear-gradient(135deg,#1e3a5f,#0ea5e9)", accent: "#38bdf8", glow: "rgba(56,189,248,0.3)" },
              { grad: "linear-gradient(135deg,#064e3b,#10b981)", accent: "#34d399", glow: "rgba(52,211,153,0.3)" },
              { grad: "linear-gradient(135deg,#78350f,#f59e0b)", accent: "#fbbf24", glow: "rgba(251,191,36,0.3)" },
              { grad: "linear-gradient(135deg,#4a044e,#a855f7)", accent: "#d8b4fe", glow: "rgba(168,85,247,0.3)" },
              { grad: "linear-gradient(135deg,#7f1d1d,#ef4444)", accent: "#f87171", glow: "rgba(239,68,68,0.3)" },
              { grad: "linear-gradient(135deg,#134e4a,#14b8a6)", accent: "#2dd4bf", glow: "rgba(45,212,191,0.3)" },
              { grad: "linear-gradient(135deg,#1e1b4b,#ec4899)", accent: "#f9a8d4", glow: "rgba(236,72,153,0.3)" }
            ];
            return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 10, fontWeight: 700, color: "#c4b5fd", marginBottom: 12, letterSpacing: "0.05em", textTransform: "uppercase" }, children: [
                "Funnel Flow \u2014 ",
                selected.steps.length,
                " Steps"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { overflowX: "auto", paddingBottom: 12 }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", alignItems: "flex-start", gap: 0, minWidth: "max-content" }, children: selected.steps.map((step, si) => {
                const palette = STEP_PALETTES[si % STEP_PALETTES.length];
                const stepPages = step.pageIds.map((pid) => {
                  const captured = capturedSet.has(pid);
                  const pageRec = knownPages.find((kp) => kp.pageId === pid);
                  const hasLayout = !!pageRec?.pageLayout;
                  const canFetch = captured && !!pageRec?.pageDataDownloadUrl && !hasLayout;
                  const fetching = layoutBusy.has(pid);
                  return { pid, captured, pageRec, hasLayout, canFetch, fetching };
                });
                const allCaptured = stepPages.every((p) => p.captured);
                const allLayout = stepPages.every((p) => p.hasLayout);
                const someCapture = stepPages.some((p) => p.captured);
                const statusColor2 = allLayout ? "#34d399" : allCaptured ? "#60a5fa" : someCapture ? "#fbbf24" : "#374151";
                const statusLabel = allLayout ? "COMPLETE" : allCaptured ? "SCHEMA \u2713" : someCapture ? "PARTIAL" : "PENDING";
                return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "flex-start", gap: 0 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
                    width: 200,
                    borderRadius: 10,
                    overflow: "hidden",
                    border: `1px solid ${palette.accent}40`,
                    boxShadow: `0 0 20px ${palette.glow}, 0 4px 12px rgba(0,0,0,0.4)`,
                    background: "#0d0f17",
                    flexShrink: 0
                  }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
                      background: palette.grad,
                      padding: "9px 12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      position: "relative",
                      overflow: "hidden"
                    }, children: [
                      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "50%",
                        background: "rgba(255,255,255,0.07)",
                        pointerEvents: "none"
                      } }),
                      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: {
                          fontSize: 10,
                          fontWeight: 900,
                          padding: "2px 8px",
                          borderRadius: 20,
                          background: "rgba(0,0,0,0.35)",
                          color: "#fff",
                          letterSpacing: "0.04em"
                        }, children: [
                          "STEP ",
                          si + 1
                        ] }),
                        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: {
                          marginLeft: "auto",
                          fontSize: 8,
                          fontWeight: 800,
                          padding: "2px 7px",
                          borderRadius: 20,
                          background: `${statusColor2}22`,
                          color: statusColor2,
                          border: `1px solid ${statusColor2}50`
                        }, children: statusLabel })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginTop: 2 }, children: step.name ?? "(unnamed step)" }),
                      step.path && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 9, color: "rgba(255,255,255,0.6)", fontFamily: "monospace", marginTop: 1 }, children: step.path })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { padding: "6px 0" }, children: [
                      stepPages.map(({ pid, captured, pageRec, hasLayout, canFetch, fetching }, pi) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
                        padding: "5px 12px",
                        background: captured ? hasLayout ? "rgba(52,211,153,0.04)" : "rgba(96,165,250,0.03)" : "transparent",
                        borderTop: pi > 0 ? "1px solid rgba(255,255,255,0.04)" : "none"
                      }, children: [
                        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }, children: [
                          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: {
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            flexShrink: 0,
                            background: hasLayout ? "#34d399" : captured ? "#60a5fa" : "#374151",
                            boxShadow: hasLayout ? "0 0 4px #34d399" : captured ? "0 0 4px #60a5fa" : "none"
                          } }),
                          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: {
                            fontSize: 9.5,
                            color: captured ? "#d1d5db" : "#4b5563",
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontWeight: captured ? 500 : 400
                          }, children: pageRec?.title ?? pid.slice(0, 16) + "\u2026" })
                        ] }),
                        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" }, children: [
                          captured ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 8, padding: "0 5px", borderRadius: 6, background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)", fontWeight: 700 }, children: "SCHEMA" }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 8, padding: "0 5px", borderRadius: 6, background: "transparent", color: "#374151", border: "1px solid #1e2030" }, children: "no schema" }),
                          captured && (hasLayout ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 8, padding: "0 5px", borderRadius: 6, background: "rgba(96,165,250,0.1)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.2)", fontWeight: 700 }, children: "LAYOUT" }) : canFetch ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                            "button",
                            {
                              className: "insp-action-btn",
                              style: { fontSize: 8, padding: "0 5px", borderRadius: 6, height: 16, minHeight: 0, lineHeight: "14px" },
                              disabled: fetching,
                              onClick: () => fetchSingleLayout(pid),
                              "data-testid": `btn-fetch-layout-${pid.slice(0, 8)}`,
                              children: fetching ? "\u2026" : "\u2193 Layout"
                            }
                          ) : null)
                        ] })
                      ] }, pid)),
                      stepPages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { padding: "6px 12px", fontSize: 9.5, color: "#374151" }, children: "No pages in step" })
                    ] })
                  ] }),
                  si < selected.steps.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "center", paddingTop: 22, flexShrink: 0, width: 36 }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { flex: 1, height: 2, background: "linear-gradient(90deg, #374151, #4b5563)" } }),
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
                      width: 0,
                      height: 0,
                      borderTop: "5px solid transparent",
                      borderBottom: "5px solid transparent",
                      borderLeft: "8px solid #4b5563"
                    } })
                  ] })
                ] }, step.stepId);
              }) }) })
            ] });
          }
          return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 10, fontWeight: 700, color: "#34d399", marginBottom: 4 }, children: [
              "Pages (",
              selected.pageIds.length,
              ")"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 2 }, children: selected.pageIds.map((pid, i) => {
              const captured = capturedSet.has(pid);
              const pageRec = knownPages.find((kp) => kp.pageId === pid);
              const hasLayout = !!pageRec?.pageLayout;
              return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
                padding: "4px 8px",
                borderRadius: 3,
                background: captured ? "rgba(52,211,153,0.06)" : "#1a1d27",
                border: `1px solid ${captured ? "rgba(52,211,153,0.2)" : "#2a2d3d"}`,
                display: "flex",
                alignItems: "center",
                gap: 6
              }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontSize: 9, color: "#6b7280", minWidth: 14 }, children: [
                  i + 1,
                  "."
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 9.5, color: "#e2e8f0", flex: 1, fontFamily: "monospace" }, children: pageRec?.title ?? pid }),
                pageRec?.slug && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 9, color: "#60a5fa" }, children: pageRec.slug }),
                captured ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 8.5, color: "#34d399" }, children: "SCHEMA \u2713" }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 8.5, color: "#4b5563" }, children: "not yet" }),
                hasLayout && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 8.5, color: "#60a5fa" }, children: "LAYOUT \u2713" })
              ] }, pid);
            }) })
          ] });
        })(),
        showJson && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
          fontFamily: "monospace",
          fontSize: 10,
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
          overflowX: "auto",
          background: "#0d0f17",
          border: "1px solid #2a2d3d",
          borderRadius: 4,
          padding: 10,
          color: "#d1d5db",
          maxHeight: 380,
          overflowY: "auto"
        }, children: (() => {
          try {
            return JSON.stringify(JSON.parse(selected.raw), null, 2);
          } catch {
            return selected.raw;
          }
        })() })
      ] })
    ] });
  }
  var PAGE_TYPE_LABELS = {
    landing: "Landing Page",
    checkout: "Checkout",
    upsell: "Upsell",
    "order-bump": "Order Bump",
    "thank-you": "Thank You",
    booking: "Booking",
    webinar: "Webinar",
    squeeze: "Squeeze",
    unknown: "Page"
  };
  var PAGE_TYPE_COLORS = {
    landing: "#6366f1",
    checkout: "#f59e0b",
    upsell: "#ec4899",
    "order-bump": "#f97316",
    "thank-you": "#10b981",
    booking: "#06b6d4",
    webinar: "#8b5cf6",
    squeeze: "#14b8a6",
    unknown: "#555"
  };
  function sendMsg2(type) {
    return chrome.runtime.sendMessage({ type, id: crypto.randomUUID(), timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  }
  function CopyView({ onGoToLibrary }) {
    const [tab, setTab] = (0, import_react.useState)(null);
    const [tabLoading, setTabLoading] = (0, import_react.useState)(true);
    const [copyState, setCopyState] = (0, import_react.useState)("idle");
    const [copied, setCopied] = (0, import_react.useState)(null);
    const [errorMsg, setErrorMsg] = (0, import_react.useState)("");
    const loadTab = (0, import_react.useCallback)(async () => {
      setTabLoading(true);
      try {
        const res = await sendMsg2("GET_CURRENT_TAB_INFO");
        setTab(res.ok ? res.data : null);
      } finally {
        setTabLoading(false);
      }
    }, []);
    (0, import_react.useEffect)(() => {
      loadTab();
      const t = setInterval(loadTab, 6e3);
      const onChange = (_, area) => {
        if (area === "local") loadTab();
      };
      chrome.storage.onChanged.addListener(onChange);
      return () => {
        clearInterval(t);
        chrome.storage.onChanged.removeListener(onChange);
      };
    }, [loadTab]);
    const isReal = tab && (tab.url.startsWith("http://") || tab.url.startsWith("https://"));
    const isHL = tab?.isHighLevel ?? false;
    const isEditor = tab?.isEditor ?? false;
    const canCopy = isReal && !isHL;
    async function handleCopy(asFunnel) {
      setCopyState("copying");
      setErrorMsg("");
      try {
        const res = await chrome.runtime.sendMessage({
          type: "CLONE_PUBLIC_PAGE",
          id: crypto.randomUUID(),
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
        if (!res.ok) throw new Error(res.error ?? "Copy failed");
        setCopied(res.data);
        setCopyState("copied");
      } catch (err) {
        setErrorMsg(String(err).replace("Error: ", ""));
        setCopyState("error");
      }
    }
    function reset() {
      setCopyState("idle");
      setCopied(null);
      setErrorMsg("");
    }
    if (!tabLoading && !isReal) {
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center", gap: 16 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { width: 72, height: 72, borderRadius: 18, background: "linear-gradient(135deg,rgba(99,102,241,.15),rgba(168,85,247,.1))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, border: "1px solid rgba(99,102,241,.2)" }, children: "\u26A1" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 17, fontWeight: 800, color: "#e2e8f0" }, children: "Ready to Copy" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 13, color: "#4b5563", maxWidth: 280, lineHeight: 1.7 }, children: "Open any public page or funnel in your browser, then return here to copy it." }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: loadTab, "data-testid": "btn-refresh-tab", children: "\u21BB Refresh" })
      ] });
    }
    if (isEditor) {
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center", gap: 16 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { width: 72, height: 72, borderRadius: 18, background: "linear-gradient(135deg,rgba(16,185,129,.2),rgba(52,211,153,.1))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, border: "1px solid rgba(16,185,129,.3)", boxShadow: "0 0 24px rgba(16,185,129,.2)" }, children: "\u{1F528}" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 17, fontWeight: 800, color: "#10b981" }, children: "Builder Ready" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 13, color: "#4b5563", maxWidth: 280, lineHeight: 1.7 }, children: [
          "HighLevel page builder is open. Switch to the ",
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { style: { color: "#34d399" }, children: "PASTE" }),
          " tab to paste a saved page into the builder."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 10, color: "#2d3748", marginTop: 4, maxWidth: 300, wordBreak: "break-all" }, children: tab?.url })
      ] });
    }
    if (isHL) {
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center", gap: 16 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { width: 72, height: 72, borderRadius: 18, background: "linear-gradient(135deg,rgba(16,185,129,.15),rgba(6,182,212,.1))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, border: "1px solid rgba(16,185,129,.2)" }, children: "\u{1F7E2}" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 17, fontWeight: 800, color: "#e2e8f0" }, children: "HighLevel Detected" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 13, color: "#4b5563", maxWidth: 280, lineHeight: 1.7 }, children: [
          "Navigate to a ",
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { style: { color: "#e2e8f0" }, children: "public funnel page" }),
          " to copy it, or open the page builder to paste."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: loadTab, "data-testid": "btn-refresh-hl", children: "\u21BB Refresh" })
      ] });
    }
    if (copyState === "copied" && copied) {
      const tc = PAGE_TYPE_COLORS[copied.pageType] ?? "#6366f1";
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, overflowY: "auto", padding: 24 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { borderRadius: 14, padding: "20px 24px", marginBottom: 20, background: "linear-gradient(135deg,rgba(16,185,129,.1),rgba(52,211,153,.05))", border: "1px solid rgba(16,185,129,.3)", textAlign: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 26, marginBottom: 8 }, children: "\u2705" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 18, fontWeight: 800, color: "#34d399", marginBottom: 4 }, children: "Page Copied!" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 12, color: "#4b5563" }, children: "Saved to your Library" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { borderRadius: 10, padding: 16, marginBottom: 16, background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.07)" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }, children: [
            copied.favicon && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("img", { src: copied.favicon, alt: "", style: { width: 20, height: 20, borderRadius: 4 }, onError: (e) => {
              e.target.style.display = "none";
            } }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 13, fontWeight: 700, color: "#e2e8f0" }, children: copied.title }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 10, color: "#4b5563" }, children: copied.domain })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { marginLeft: "auto", fontSize: 10, padding: "2px 8px", borderRadius: 20, background: tc + "22", color: tc, fontWeight: 700, border: "1px solid " + tc + "44", flexShrink: 0 }, children: PAGE_TYPE_LABELS[copied.pageType] ?? "Page" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }, children: [{ label: "Sections", val: copied.sections.length, color: "#818cf8" }, { label: "Assets", val: copied.assetCount, color: "#22d3ee" }, { label: "Links", val: copied.linkCount, color: "#a78bfa" }].map(({ label, val, color }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { background: "rgba(255,255,255,.03)", borderRadius: 8, padding: "10px 12px", textAlign: "center", border: "1px solid rgba(255,255,255,.05)" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 18, fontWeight: 800, color }, children: val }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 9, color: "#4b5563", textTransform: "uppercase", letterSpacing: 0.5 }, children: label })
          ] }, label)) }),
          copied.hasFunnel && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { padding: "8px 12px", borderRadius: 8, background: "rgba(167,139,250,.08)", border: "1px solid rgba(167,139,250,.2)" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 11, color: "#a78bfa", fontWeight: 700 }, children: [
              "\u{1F5C2} Funnel Detected \u2014 ",
              copied.funnelLinks.length,
              " linked pages"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 10, color: "#4b5563", marginTop: 2 }, children: "Visit each funnel page and copy each step to build your full library." })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "btn btn-primary", onClick: onGoToLibrary, "data-testid": "btn-view-library", children: "\u{1F4DA} View in Library" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "btn btn-secondary", onClick: reset, "data-testid": "btn-copy-another", children: "Copy Another" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: () => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([JSON.stringify(copied, null, 2)], { type: "application/json" }));
            a.download = "clonelevel-" + copied.domain + "-" + Date.now() + ".json";
            a.click();
          }, "data-testid": "btn-export-copy", children: "\u2193 Export" })
        ] })
      ] });
    }
    if (copyState === "error") {
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center", gap: 14 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 36 }, children: "\u26A0\uFE0F" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 16, fontWeight: 700, color: "#f87171" }, children: "Copy Failed" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 12, color: "#4b5563", maxWidth: 300, lineHeight: 1.6 }, children: errorMsg }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "btn btn-secondary", onClick: reset, "data-testid": "btn-copy-retry", children: "Try Again" })
      ] });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, overflowY: "auto", padding: 24 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { borderRadius: 12, padding: "16px 20px", marginBottom: 20, background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.07)" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 10, color: "#4b5563", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }, children: "Active Page" }),
        tabLoading ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 12, color: "#374151" }, children: "Detecting\u2026" }) : tab ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }, children: [
            tab.favIconUrl && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("img", { src: tab.favIconUrl, alt: "", style: { width: 18, height: 18, borderRadius: 3 }, onError: (e) => {
              e.target.style.display = "none";
            } }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 13, fontWeight: 700, color: "#e2e8f0", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: tab.title || tab.url }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: loadTab, title: "Refresh", style: { flexShrink: 0 }, children: "\u21BB" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 10, color: "#2d3748", marginBottom: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: tab.url }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "rgba(99,102,241,.15)", color: "#818cf8", fontWeight: 700, border: "1px solid rgba(99,102,241,.25)" }, children: "\u2713 Page Ready" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "rgba(6,182,212,.1)", color: "#22d3ee", fontWeight: 600, border: "1px solid rgba(6,182,212,.2)" }, children: "Public Page" })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 12, color: "#374151" }, children: "No page detected \u2014 navigate to a public site" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            onClick: () => handleCopy(false),
            disabled: copyState === "copying" || !canCopy,
            "data-testid": "btn-copy-page",
            style: {
              width: "100%",
              padding: "14px 0",
              borderRadius: 12,
              border: "none",
              cursor: copyState === "copying" || !canCopy ? "not-allowed" : "pointer",
              background: !canCopy || copyState === "copying" ? "rgba(255,255,255,.04)" : "linear-gradient(135deg,#6366f1,#a855f7)",
              color: !canCopy || copyState === "copying" ? "#2d3748" : "#fff",
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: 0.4,
              transition: "all .2s",
              boxShadow: canCopy && copyState !== "copying" ? "0 0 24px rgba(99,102,241,.4)" : "none",
              opacity: !canCopy ? 0.5 : 1
            },
            children: copyState === "copying" ? "Copying\u2026" : "\u26A1 Copy Page"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            onClick: () => handleCopy(true),
            disabled: copyState === "copying" || !canCopy,
            "data-testid": "btn-copy-funnel",
            style: {
              width: "100%",
              padding: "11px 0",
              borderRadius: 12,
              border: "1px solid rgba(167,139,250,.25)",
              cursor: copyState === "copying" || !canCopy ? "not-allowed" : "pointer",
              background: "rgba(167,139,250,.06)",
              color: !canCopy || copyState === "copying" ? "#2d3748" : "#a78bfa",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: 0.3,
              transition: "all .2s",
              opacity: !canCopy ? 0.4 : 1
            },
            children: "\u{1F5C2} Copy Funnel"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 11, color: "#2d3748", lineHeight: 1.8, textAlign: "center", padding: "0 8px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { style: { color: "#4b5563" }, children: "Copy Page" }),
        " captures this page's structure, assets, and content.",
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("br", {}),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { style: { color: "#4b5563" }, children: "Copy Funnel" }),
        " \u2014 visit each step in your funnel and copy each one.",
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("br", {}),
        "All copies are saved to your ",
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { style: { color: "#818cf8" }, children: "Library" }),
        "."
      ] })
    ] });
  }
  function AssetSection({
    label,
    count,
    color,
    bg,
    icon,
    children
  }) {
    const [open, setOpen] = (0, import_react.useState)(true);
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "button",
        {
          onClick: () => setOpen((o) => !o),
          style: {
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: open ? 10 : 0,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            width: "100%"
          },
          "data-testid": `asset-section-${label.toLowerCase()}`,
          children: [
            icon && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 13 }, children: icon }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 10, fontWeight: 800, color, textTransform: "uppercase", letterSpacing: "0.08em" }, children: label }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 10, fontWeight: 800, color, background: bg, padding: "1px 7px", borderRadius: 10 }, children: count }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { marginLeft: "auto", fontSize: 10, color: "#374151" }, children: open ? "\u25BE" : "\u25B8" })
          ]
        }
      ),
      open && children
    ] });
  }
  function AssetFileRow({
    asset,
    color,
    showType = false
  }) {
    const filename = (() => {
      try {
        return new URL(asset.url).pathname.split("/").filter(Boolean).pop() ?? asset.url;
      } catch {
        return asset.url;
      }
    })();
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "rgba(255,255,255,.02)", borderRadius: 7, border: "1px solid rgba(255,255,255,.04)" }, children: [
      showType && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 9, padding: "1px 6px", borderRadius: 4, background: color + "18", color, fontWeight: 700, flexShrink: 0, textTransform: "uppercase" }, children: asset.type }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 10, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }, title: asset.url, children: filename }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("a", { href: asset.url, target: "_blank", rel: "noreferrer", style: { fontSize: 10, color: "#374151", flexShrink: 0, textDecoration: "none" }, title: asset.url, children: "\u2197" })
    ] });
  }
  function LibraryDetailPanel({
    selected,
    onPasteItem,
    onExport,
    onDelete
  }) {
    const [detailTab, setDetailTab] = (0, import_react.useState)("details");
    const assetGroups = {
      image: selected.assets.filter((a) => a.type === "image"),
      video: selected.assets.filter((a) => a.type === "video"),
      audio: selected.assets.filter((a) => a.type === "audio"),
      font: selected.assets.filter((a) => a.type === "font"),
      script: selected.assets.filter((a) => a.type === "script"),
      css: selected.assets.filter((a) => a.type === "css" || a.type === "style"),
      other: selected.assets.filter((a) => !["image", "video", "audio", "font", "script", "css", "style"].includes(a.type))
    };
    const totalAssets = selected.assets.length;
    const tabStyle = (active) => ({
      padding: "7px 18px",
      fontSize: 11,
      fontWeight: 700,
      cursor: "pointer",
      background: "none",
      border: "none",
      borderBottom: `2px solid ${active ? "#818cf8" : "transparent"}`,
      color: active ? "#c4b5fd" : "#374151",
      transition: "color .12s, border-color .12s"
    });
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { padding: "14px 20px 0", borderBottom: "1px solid rgba(255,255,255,.06)", flexShrink: 0, background: "rgba(255,255,255,.01)" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "div",
              {
                style: { fontSize: 14, fontWeight: 800, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 3 },
                title: selected.title,
                children: selected.title
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 10, color: "#4b5563", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: selected.domain }),
              selected.hasFunnel && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 9, padding: "1px 7px", borderRadius: 10, background: "rgba(167,139,250,.12)", color: "#a78bfa", fontWeight: 700, flexShrink: 0 }, children: "Funnel" }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 9, padding: "1px 7px", borderRadius: 10, background: "rgba(99,102,241,.1)", color: "#6366f1", fontWeight: 700, flexShrink: 0 }, children: selected.pageType })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", gap: 6, flexShrink: 0 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "button",
              {
                className: "btn btn-primary btn-sm",
                onClick: () => onPasteItem(selected.captureId),
                "data-testid": "btn-lib-paste",
                style: { background: "linear-gradient(135deg,#10b981,#059669)", boxShadow: "0 0 12px rgba(16,185,129,.3)", fontSize: 11 },
                children: "\u2191 Paste"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "btn btn-secondary btn-sm", onClick: () => onExport(selected), "data-testid": "btn-lib-export", style: { fontSize: 11 }, children: "\u2193 Export" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: () => copyToClipboard(selected.sourceUrl), "data-testid": "btn-lib-copy-url", children: "URL" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn insp-action-danger", onClick: () => onDelete(selected.captureId), "data-testid": "btn-lib-delete", children: "\u2715" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", gap: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { style: tabStyle(detailTab === "details"), onClick: () => setDetailTab("details"), "data-testid": "tab-lib-details", children: "Details" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "button",
            {
              style: tabStyle(detailTab === "assets"),
              onClick: () => setDetailTab("assets"),
              "data-testid": "tab-lib-assets",
              children: [
                "Assets",
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: {
                  marginLeft: 6,
                  fontSize: 9,
                  padding: "1px 5px",
                  borderRadius: 10,
                  background: detailTab === "assets" ? "rgba(129,140,248,.2)" : "rgba(255,255,255,.05)",
                  color: detailTab === "assets" ? "#818cf8" : "#4b5563",
                  fontWeight: 700
                }, children: selected.sections.length + totalAssets + selected.funnelLinks.length })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { flex: 1, overflowY: "auto", padding: "16px 20px" }, children: detailTab === "details" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 10, color: "#2d3748", marginBottom: 14, wordBreak: "break-all", lineHeight: 1.5 }, children: selected.sourceUrl }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 8 }, children: [
          { label: "Sections", val: selected.sections.length, color: "#818cf8" },
          { label: "Images", val: assetGroups.image.length, color: "#22d3ee" },
          { label: "Videos", val: assetGroups.video.length, color: "#f87171" },
          { label: "Audio", val: assetGroups.audio.length, color: "#fb923c" },
          { label: "Fonts", val: assetGroups.font.length, color: "#a78bfa" },
          { label: "Scripts", val: assetGroups.script.length, color: "#fbbf24" },
          { label: "Stylesheets", val: assetGroups.css.length, color: "#34d399" },
          { label: "Other", val: assetGroups.other.length, color: "#6b7280" },
          { label: "Funnel Steps", val: selected.funnelLinks.length, color: "#10b981" }
        ].map(({ label, val, color }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { background: "rgba(255,255,255,.03)", borderRadius: 8, padding: "10px 12px", textAlign: "center", border: "1px solid rgba(255,255,255,.05)" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 20, fontWeight: 800, color }, children: val }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 9, color: "#374151", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }, children: label })
        ] }, label)) }),
        selected.hasFunnel && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { marginTop: 14, padding: "9px 12px", borderRadius: 8, background: "rgba(167,139,250,.06)", border: "1px solid rgba(167,139,250,.15)", fontSize: 11, color: "#a78bfa" }, children: [
          "\u{1F517} This capture includes a funnel. Switch to ",
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: "Assets" }),
          " to view all steps."
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 24 }, children: [
        selected.sections.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AssetSection, { label: "Sections", count: selected.sections.length, color: "#818cf8", bg: "rgba(129,140,248,.1)", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: selected.sections.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 7, background: "rgba(99,102,241,.04)", border: "1px solid rgba(99,102,241,.1)" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 9, fontWeight: 800, color: "#374151", width: 20, textAlign: "right", flexShrink: 0 }, children: i + 1 }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 10, fontWeight: 700, color: "#818cf8", padding: "1px 8px", borderRadius: 8, background: "rgba(99,102,241,.12)", flexShrink: 0 }, children: s.sectionHint }),
          s.html && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 9, color: "#2d3748", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: s.html.replace(/<[^>]+>/g, " ").trim().slice(0, 80) })
        ] }, i)) }) }),
        selected.funnelLinks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AssetSection, { label: "Funnel Steps", count: selected.funnelLinks.length, color: "#a78bfa", bg: "rgba(167,139,250,.1)", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: selected.funnelLinks.map((link, i) => {
          const lc = PAGE_TYPE_COLORS[link.type] ?? "#555";
          return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", background: "rgba(255,255,255,.02)", borderRadius: 7, border: "1px solid rgba(255,255,255,.04)" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 9, padding: "1px 7px", borderRadius: 6, background: lc + "22", color: lc, fontWeight: 700, flexShrink: 0 }, children: PAGE_TYPE_LABELS[link.type] ?? link.type }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 10, color: "#4b5563", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }, children: link.text || link.url }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("a", { href: link.url, target: "_blank", rel: "noreferrer", style: { fontSize: 10, color: "#4b5563", flexShrink: 0, textDecoration: "none" }, title: link.url, children: "\u2197" })
          ] }, i);
        }) }) }),
        assetGroups.image.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AssetSection, { label: "Images", count: assetGroups.image.length, color: "#22d3ee", bg: "rgba(34,211,238,.1)", icon: "\u{1F5BC}", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(90px,1fr))", gap: 6 }, children: assetGroups.image.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("a", { href: a.url, target: "_blank", rel: "noreferrer", style: { textDecoration: "none", borderRadius: 7, overflow: "hidden", border: "1px solid rgba(255,255,255,.06)", background: "#0a0c14", display: "block" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "img",
            {
              src: a.url,
              alt: a.alt ?? "",
              style: { width: "100%", height: 64, objectFit: "cover", display: "block" },
              onError: (e) => {
                e.target.style.display = "none";
              }
            }
          ),
          a.alt && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { padding: "3px 5px", fontSize: 8, color: "#2d3748", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: a.alt })
        ] }, i)) }) }),
        assetGroups.video.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AssetSection, { label: "Videos", count: assetGroups.video.length, color: "#f87171", bg: "rgba(248,113,113,.1)", icon: "\u{1F3AC}", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: assetGroups.video.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AssetFileRow, { asset: a, color: "#f87171" }, i)) }) }),
        assetGroups.audio.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AssetSection, { label: "Audio", count: assetGroups.audio.length, color: "#fb923c", bg: "rgba(251,146,60,.1)", icon: "\u{1F3B5}", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: assetGroups.audio.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AssetFileRow, { asset: a, color: "#fb923c" }, i)) }) }),
        assetGroups.font.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AssetSection, { label: "Fonts", count: assetGroups.font.length, color: "#a78bfa", bg: "rgba(167,139,250,.1)", icon: "\u270F\uFE0F", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: assetGroups.font.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AssetFileRow, { asset: a, color: "#a78bfa" }, i)) }) }),
        assetGroups.script.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AssetSection, { label: "Scripts", count: assetGroups.script.length, color: "#fbbf24", bg: "rgba(251,191,36,.1)", icon: "\u2699\uFE0F", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: assetGroups.script.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AssetFileRow, { asset: a, color: "#fbbf24" }, i)) }) }),
        assetGroups.css.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AssetSection, { label: "Stylesheets", count: assetGroups.css.length, color: "#34d399", bg: "rgba(52,211,153,.1)", icon: "\u{1F3A8}", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: assetGroups.css.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AssetFileRow, { asset: a, color: "#34d399" }, i)) }) }),
        assetGroups.other.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AssetSection, { label: "Other", count: assetGroups.other.length, color: "#6b7280", bg: "rgba(107,114,128,.1)", icon: "\u{1F4CE}", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: assetGroups.other.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AssetFileRow, { asset: a, color: "#6b7280", showType: true }, i)) }) }),
        totalAssets === 0 && selected.sections.length === 0 && selected.funnelLinks.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { padding: "40px 0", textAlign: "center", color: "#2d3748", fontSize: 12 }, children: "No assets found for this capture." })
      ] }) })
    ] });
  }
  function LibraryView({ onPasteItem }) {
    const [captures, setCaptures] = (0, import_react.useState)([]);
    const [loading, setLoading] = (0, import_react.useState)(true);
    const [selected, setSelected] = (0, import_react.useState)(null);
    const load = (0, import_react.useCallback)(async () => {
      setLoading(true);
      try {
        const res = await sendMsg2("GET_PUBLIC_CAPTURES");
        if (res.ok) setCaptures(res.data ?? []);
      } finally {
        setLoading(false);
      }
    }, []);
    (0, import_react.useEffect)(() => {
      load();
      const onChange = (_, area) => {
        if (area === "local") load();
      };
      chrome.storage.onChanged.addListener(onChange);
      return () => chrome.storage.onChanged.removeListener(onChange);
    }, [load]);
    async function deleteCapture(captureId) {
      if (!confirm("Remove this item from your library?")) return;
      const updated = captures.filter((c) => c.captureId !== captureId);
      await chrome.storage.local.set({ clonelevel_public_captures: updated });
      setCaptures(updated);
      if (selected?.captureId === captureId) setSelected(null);
    }
    function exportCapture(cap) {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(cap, null, 2)], { type: "application/json" }));
      a.download = `clonelevel-${cap.domain}-${Date.now()}.json`;
      a.click();
    }
    if (loading) {
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#374151", fontSize: 12 }, children: "Loading library\u2026" });
    }
    if (captures.length === 0) {
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center", gap: 16 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { width: 72, height: 72, borderRadius: 18, background: "rgba(99,102,241,.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, border: "1px solid rgba(99,102,241,.12)" }, children: "\u{1F4DA}" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 17, fontWeight: 800, color: "#6b7280" }, children: "Library is empty" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 13, color: "#374151", maxWidth: 260, lineHeight: 1.7 }, children: [
          "Go to ",
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { style: { color: "#a78bfa" }, children: "COPY" }),
          " and copy your first page or funnel to get started."
        ] })
      ] });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", height: "100%", overflow: "hidden" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { width: 280, borderRight: "1px solid rgba(255,255,255,.06)", overflowY: "auto", flexShrink: 0, background: "rgba(0,0,0,.15)" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { padding: "10px 14px", fontSize: 10, color: "#4b5563", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid rgba(255,255,255,.04)", display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { children: [
            "Library (",
            captures.length,
            ")"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: load, title: "Refresh", children: "\u21BB" })
        ] }),
        captures.map((cap) => {
          const tc = PAGE_TYPE_COLORS[cap.pageType] ?? "#555";
          const active = selected?.captureId === cap.captureId;
          return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "div",
            {
              onClick: () => setSelected(cap),
              "data-testid": `library-item-${cap.captureId}`,
              style: {
                padding: "12px 14px",
                borderBottom: "1px solid rgba(255,255,255,.03)",
                cursor: "pointer",
                background: active ? "rgba(99,102,241,.08)" : "transparent",
                borderLeft: active ? "2px solid #6366f1" : "2px solid transparent",
                transition: "all .1s"
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }, children: [
                  cap.favicon && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("img", { src: cap.favicon, alt: "", style: { width: 13, height: 13, borderRadius: 2 }, onError: (e) => {
                    e.target.style.display = "none";
                  } }),
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 11, fontWeight: 700, color: "#e2e8f0", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: cap.title })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 9, color: "#374151", marginBottom: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: cap.domain }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 9, padding: "1px 7px", borderRadius: 20, background: tc + "20", color: tc, fontWeight: 700, border: "1px solid " + tc + "35" }, children: PAGE_TYPE_LABELS[cap.pageType] ?? "Page" }),
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontSize: 9, color: "#374151" }, children: [
                    cap.assetCount,
                    " assets"
                  ] }),
                  cap.hasFunnel && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 9, color: "#a78bfa", fontWeight: 700 }, children: "Funnel" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 9, color: "#2d3748" }, children: new Date(cap.capturedAt).toLocaleDateString() }),
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        onPasteItem(cap.captureId);
                      },
                      "data-testid": `btn-list-paste-${cap.captureId}`,
                      title: "Paste Into Builder",
                      style: {
                        fontSize: 9,
                        padding: "2px 7px",
                        borderRadius: 6,
                        border: "1px solid rgba(16,185,129,.3)",
                        background: "rgba(16,185,129,.08)",
                        color: "#10b981",
                        cursor: "pointer",
                        fontWeight: 700
                      },
                      children: "\u2191 Paste"
                    }
                  )
                ] })
              ]
            },
            cap.captureId
          );
        })
      ] }),
      selected ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        LibraryDetailPanel,
        {
          selected,
          onPasteItem,
          onExport: exportCapture,
          onDelete: deleteCapture
        }
      ) : /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: "#2d3748" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { width: 48, height: 48, borderRadius: 14, background: "rgba(99,102,241,.05)", border: "1px solid rgba(99,102,241,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }, children: "\u{1F4CB}" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 13, fontWeight: 700, color: "#374151" }, children: "Select a capture" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 11, color: "#2d3748", textAlign: "center", maxWidth: 200, lineHeight: 1.6 }, children: "Choose an item from the library to view its details and assets" })
      ] })
    ] });
  }
  function PasteView({ initialCaptureId }) {
    const [builderTab, setBuilderTab] = (0, import_react.useState)(null);
    const [builderTabId, setBuilderTabId] = (0, import_react.useState)(null);
    const [captures, setCaptures] = (0, import_react.useState)([]);
    const [selectedId, setSelectedId] = (0, import_react.useState)(initialCaptureId ?? null);
    const [loading, setLoading] = (0, import_react.useState)(true);
    const [pasteState, setPasteState] = (0, import_react.useState)("idle");
    const [pasteMsg, setPasteMsg] = (0, import_react.useState)("");
    const [sessionLoaded, setSessionLoaded] = (0, import_react.useState)(false);
    (0, import_react.useEffect)(() => {
      if (initialCaptureId) setSelectedId(initialCaptureId);
    }, [initialCaptureId]);
    const loadAll = (0, import_react.useCallback)(async () => {
      setLoading(true);
      try {
        if (!sessionLoaded) {
          const sessionRes = await chrome.runtime.sendMessage({
            type: "GET_PASTE_SESSION",
            id: crypto.randomUUID(),
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
          if (sessionRes?.ok && sessionRes.data) {
            const s = sessionRes.data;
            if (s.selectedItemId && !selectedId) setSelectedId(s.selectedItemId);
            if (s.targetBuilderTabId) setBuilderTabId(Number(s.targetBuilderTabId));
          }
          setSessionLoaded(true);
        }
        try {
          const qp = new URLSearchParams(window.location.search);
          const qCapture = qp.get("captureId");
          const qBuilder = qp.get("builderTabId");
          if (qCapture && !selectedId) setSelectedId(qCapture);
          if (qBuilder) setBuilderTabId(Number(qBuilder));
        } catch {
        }
        const [tabRes, capRes] = await Promise.all([
          sendMsg2("GET_CURRENT_TAB_INFO"),
          sendMsg2("GET_PUBLIC_CAPTURES")
        ]);
        const t = tabRes.ok ? tabRes.data : null;
        setBuilderTab(t?.isEditor ? t : null);
        if (capRes.ok) setCaptures(capRes.data ?? []);
      } finally {
        setLoading(false);
      }
    }, [sessionLoaded, selectedId]);
    (0, import_react.useEffect)(() => {
      loadAll();
      const t = setInterval(loadAll, 5e3);
      return () => clearInterval(t);
    }, [loadAll]);
    const builderReady = !!builderTab;
    const selectedCap = captures.find((c) => c.captureId === selectedId) ?? null;
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, overflowY: "auto", padding: 24 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
        borderRadius: 12,
        padding: "16px 20px",
        marginBottom: 20,
        background: builderReady ? "linear-gradient(135deg,rgba(16,185,129,.1),rgba(52,211,153,.05))" : "rgba(255,255,255,.02)",
        border: builderReady ? "1px solid rgba(16,185,129,.3)" : "1px solid rgba(255,255,255,.06)",
        boxShadow: builderReady ? "0 0 20px rgba(16,185,129,.1)" : "none"
      }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
          width: 40,
          height: 40,
          borderRadius: 10,
          flexShrink: 0,
          background: builderReady ? "rgba(16,185,129,.2)" : "rgba(255,255,255,.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20
        }, children: builderReady ? "\u{1F528}" : "\u23F3" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 13, fontWeight: 800, color: builderReady ? "#10b981" : "#6b7280" }, children: builderReady ? "HighLevel Builder Detected" : "No Builder Detected" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 11, color: "#374151", marginTop: 2 }, children: builderReady ? builderTab.title || builderTab.url : "Open a HighLevel page builder, then return here." })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: loadAll, title: "Refresh", children: "\u21BB" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { marginBottom: 20 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 10, color: "#4b5563", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }, children: "Select from Library" }),
        loading ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 12, color: "#374151" }, children: "Loading library\u2026" }) : captures.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 12, color: "#374151", padding: "12px 16px", background: "rgba(255,255,255,.02)", borderRadius: 8, border: "1px solid rgba(255,255,255,.05)" }, children: [
          "Library is empty. Go to ",
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { style: { color: "#a78bfa" }, children: "COPY" }),
          " first."
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: captures.map((cap) => {
          const active = selectedId === cap.captureId;
          const tc = PAGE_TYPE_COLORS[cap.pageType] ?? "#555";
          return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "div",
            {
              onClick: () => setSelectedId(active ? null : cap.captureId),
              "data-testid": `paste-item-${cap.captureId}`,
              style: {
                padding: "11px 14px",
                borderRadius: 10,
                cursor: "pointer",
                border: active ? "1px solid rgba(99,102,241,.5)" : "1px solid rgba(255,255,255,.06)",
                background: active ? "rgba(99,102,241,.1)" : "rgba(255,255,255,.02)",
                boxShadow: active ? "0 0 12px rgba(99,102,241,.2)" : "none",
                transition: "all .15s"
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { width: 8, height: 8, borderRadius: "50%", background: active ? "#6366f1" : "#2d3748", flexShrink: 0, boxShadow: active ? "0 0 6px #6366f1" : "none" } }),
                  cap.favicon && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("img", { src: cap.favicon, alt: "", style: { width: 14, height: 14, borderRadius: 3 }, onError: (e) => {
                    e.target.style.display = "none";
                  } }),
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 11, fontWeight: 700, color: active ? "#e2e8f0" : "#9ca3af", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: cap.title }),
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 9, padding: "1px 7px", borderRadius: 20, background: tc + "20", color: tc, fontWeight: 700, flexShrink: 0 }, children: PAGE_TYPE_LABELS[cap.pageType] ?? "Page" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 9, color: "#374151", marginTop: 4, marginLeft: 16 }, children: [
                  cap.domain,
                  " \xB7 ",
                  cap.assetCount,
                  " assets"
                ] })
              ]
            },
            cap.captureId
          );
        }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [
        pasteState === "success" && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { borderRadius: 10, padding: "12px 16px", background: "linear-gradient(135deg,rgba(16,185,129,.12),rgba(52,211,153,.06))", border: "1px solid rgba(16,185,129,.3)", textAlign: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 14, fontWeight: 800, color: "#34d399", marginBottom: 4 }, children: "\u2705 Paste Sent!" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 11, color: "#4b5563" }, children: pasteMsg || "Your page has been sent to the builder." }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", style: { marginTop: 10 }, onClick: () => setPasteState("idle"), children: "Paste Again" })
        ] }),
        pasteState === "error" && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { borderRadius: 10, padding: "12px 16px", background: "rgba(248,113,113,.06)", border: "1px solid rgba(248,113,113,.25)", textAlign: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 14, fontWeight: 700, color: "#f87171", marginBottom: 4 }, children: "\u26A0\uFE0F Paste Failed" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 11, color: "#4b5563" }, children: pasteMsg }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", style: { marginTop: 10 }, onClick: () => setPasteState("idle"), children: "Try Again" })
        ] }),
        (pasteState === "idle" || pasteState === "pasting") && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            disabled: !builderReady || !selectedCap || pasteState === "pasting",
            "data-testid": "btn-paste-into-builder",
            style: {
              width: "100%",
              padding: "14px 0",
              borderRadius: 12,
              border: "none",
              cursor: !builderReady || !selectedCap || pasteState === "pasting" ? "not-allowed" : "pointer",
              background: builderReady && selectedCap ? "linear-gradient(135deg,#10b981,#059669)" : "rgba(255,255,255,.04)",
              color: builderReady && selectedCap ? "#fff" : "#2d3748",
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: 0.4,
              transition: "all .2s",
              boxShadow: builderReady && selectedCap ? "0 0 24px rgba(16,185,129,.4)" : "none",
              opacity: !builderReady || !selectedCap ? 0.6 : 1
            },
            onClick: async () => {
              if (!selectedCap || !builderTab) return;
              setPasteState("pasting");
              try {
                const res = await chrome.runtime.sendMessage({
                  type: "IMPORT_JSON_PACKAGE",
                  id: crypto.randomUUID(),
                  timestamp: (/* @__PURE__ */ new Date()).toISOString(),
                  payload: { captureId: selectedCap.captureId, targetTabId: builderTabId ?? void 0 }
                });
                if (res?.ok) {
                  setPasteMsg(res.message ?? "");
                  setPasteState("success");
                } else {
                  setPasteMsg(res?.error ?? "An unknown error occurred.");
                  setPasteState("error");
                }
              } catch (err) {
                setPasteMsg(String(err).replace("Error: ", ""));
                setPasteState("error");
              }
            },
            children: pasteState === "pasting" ? "Sending to Builder\u2026" : "\u2191 Paste Into Builder"
          }
        ),
        !builderReady && pasteState === "idle" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 11, color: "#374151", textAlign: "center", lineHeight: 1.6 }, children: "Open a HighLevel page builder tab, then come back here." }),
        builderReady && !selectedCap && pasteState === "idle" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 11, color: "#374151", textAlign: "center" }, children: "Select a page from the library above to paste." })
      ] })
    ] });
  }
  var GLOBAL_SECTIONS_STORAGE_KEY = "clonelevel_global_sections";
  function GlobalSectionsPanel() {
    const [sections, setSections] = (0, import_react.useState)([]);
    const [selected, setSelected] = (0, import_react.useState)(null);
    const [jsonOpen, setJsonOpen] = (0, import_react.useState)(false);
    const load = (0, import_react.useCallback)(async () => {
      const r = await chrome.storage.local.get(GLOBAL_SECTIONS_STORAGE_KEY);
      setSections(Array.isArray(r[GLOBAL_SECTIONS_STORAGE_KEY]) ? r[GLOBAL_SECTIONS_STORAGE_KEY] : []);
    }, []);
    (0, import_react.useEffect)(() => {
      load();
      const onChange = (changes, area) => {
        if (area === "local" && changes[GLOBAL_SECTIONS_STORAGE_KEY]) load();
      };
      chrome.storage.onChanged.addListener(onChange);
      return () => chrome.storage.onChanged.removeListener(onChange);
    }, [load]);
    async function handleClear() {
      if (!confirm("Clear all captured global sections?")) return;
      await chrome.storage.local.remove(GLOBAL_SECTIONS_STORAGE_KEY);
      setSections([]);
      setSelected(null);
    }
    function exportSections() {
      const blob = JSON.stringify(sections, null, 2);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([blob], { type: "application/json" }));
      a.download = `clonelevel-global-sections-${Date.now()}.json`;
      a.click();
    }
    const typeColors = {
      header: "#6366f1",
      footer: "#06b6d4",
      section: "#10b981",
      popup: "#f59e0b",
      sticky: "#ec4899"
    };
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { padding: "10px 14px", borderBottom: "1px solid #222", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 13, fontWeight: 700, color: "#a78bfa" }, children: "\u{1F9E9} Global Sections" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { marginLeft: 4, background: "#2d2747", color: "#a78bfa", borderRadius: 10, padding: "1px 8px", fontSize: 11, fontWeight: 700 }, children: sections.length }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { flex: 1 } }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: load, title: "Refresh", children: "\u21BB" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: exportSections, disabled: sections.length === 0, title: "Export JSON", children: "\u2193 Export" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn insp-action-danger", onClick: handleClear, disabled: sections.length === 0, title: "Clear", children: "\u2715 Clear" })
      ] }),
      sections.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: 13, textAlign: "center", padding: 24 }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 28, marginBottom: 8 }, children: "\u{1F9E9}" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontWeight: 600, marginBottom: 4 }, children: "No global sections captured yet" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { color: "#444", fontSize: 12, maxWidth: 280 }, children: [
          "CloneLevel automatically captures global sections when HighLevel loads",
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("code", { style: { background: "#1a1a1a", padding: "0 4px", borderRadius: 3 }, children: "/global-sections" }),
          " or",
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("code", { style: { background: "#1a1a1a", padding: "0 4px", borderRadius: 3 }, children: "/prebuilt-section" }),
          " endpoints. Browse to a funnel in the builder to trigger detection."
        ] })
      ] }) }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", flex: 1, overflow: "hidden" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { width: 280, borderRight: "1px solid #222", overflowY: "auto", flexShrink: 0 }, children: sections.map((sec, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
          "div",
          {
            onClick: () => {
              setSelected(sec);
              setJsonOpen(false);
            },
            style: {
              padding: "10px 14px",
              borderBottom: "1px solid #1a1a1a",
              cursor: "pointer",
              background: selected?.sectionId === sec.sectionId ? "#1e1e30" : "transparent"
            },
            "data-testid": `global-section-row-${sec.sectionId}`,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }, children: [
                sec.type && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: {
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "1px 6px",
                  borderRadius: 8,
                  background: typeColors[sec.type?.toLowerCase()] ?? "#333",
                  color: "#fff",
                  textTransform: "uppercase",
                  letterSpacing: 0.5
                }, children: sec.type }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 12, fontWeight: 600, color: "#e2e8f0" }, children: sec.name ?? "Unnamed Section" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 10, color: "#555", fontFamily: "monospace" }, children: [
                sec.sectionId.slice(0, 20),
                "\u2026"
              ] }),
              sec.assetUrls.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 10, color: "#4ade80", marginTop: 3 }, children: [
                sec.assetUrls.length,
                " asset",
                sec.assetUrls.length !== 1 ? "s" : ""
              ] })
            ]
          },
          sec.sectionId + i
        )) }),
        selected ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, overflowY: "auto", padding: 16 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 10 }, children: selected.name ?? "Unnamed Section" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("table", { style: { width: "100%", fontSize: 12, borderCollapse: "collapse", marginBottom: 12 }, children: [
            ["Section ID", selected.sectionId],
            ["Type", selected.type ?? "\u2014"],
            ["Captured", new Date(selected.capturedAt).toLocaleString()],
            ["Assets", selected.assetUrls.length.toString()],
            ["URL", selected.url]
          ].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("tr", { style: { borderBottom: "1px solid #1a1a1a" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("td", { style: { padding: "5px 8px 5px 0", color: "#888", width: 90 }, children: k }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("td", { style: { padding: "5px 0", color: "#e2e8f0", wordBreak: "break-all" }, children: v })
          ] }, k)) }),
          selected.assetUrls.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { marginBottom: 12 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }, children: "Assets in this section" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { maxHeight: 120, overflowY: "auto", background: "#111", borderRadius: 6, padding: 8 }, children: selected.assetUrls.map((u, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 10, color: "#4ade80", fontFamily: "monospace", marginBottom: 2, wordBreak: "break-all" }, children: u }, i)) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              className: `insp-action-btn${jsonOpen ? " active-clone" : ""}`,
              style: { marginBottom: 8 },
              onClick: () => setJsonOpen((v) => !v),
              children: jsonOpen ? "\u25B2 Hide Layout JSON" : "\u25BC Show Layout JSON"
            }
          ),
          jsonOpen && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("pre", { style: { fontSize: 10, background: "#0d0d0d", borderRadius: 6, padding: 10, overflowX: "auto", maxHeight: 300, color: "#a3e635" }, children: JSON.stringify(selected.layout, null, 2) })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: 12 }, children: "\u2190 Select a section to inspect" })
      ] })
    ] });
  }
  var THEME_SETTINGS_STORAGE_KEY = "clonelevel_theme_settings";
  function ThemesPanel() {
    const [records, setRecords] = (0, import_react.useState)([]);
    const [selected, setSelected] = (0, import_react.useState)(null);
    const [filter, setFilter] = (0, import_react.useState)("all");
    const load = (0, import_react.useCallback)(async () => {
      const r = await chrome.storage.local.get(THEME_SETTINGS_STORAGE_KEY);
      setRecords(Array.isArray(r[THEME_SETTINGS_STORAGE_KEY]) ? r[THEME_SETTINGS_STORAGE_KEY] : []);
    }, []);
    (0, import_react.useEffect)(() => {
      load();
      const onChange = (changes, area) => {
        if (area === "local" && changes[THEME_SETTINGS_STORAGE_KEY]) load();
      };
      chrome.storage.onChanged.addListener(onChange);
      return () => chrome.storage.onChanged.removeListener(onChange);
    }, [load]);
    async function handleClear() {
      if (!confirm("Clear all captured theme settings?")) return;
      await chrome.storage.local.remove(THEME_SETTINGS_STORAGE_KEY);
      setRecords([]);
      setSelected(null);
    }
    function exportThemes() {
      const blob = JSON.stringify(records, null, 2);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([blob], { type: "application/json" }));
      a.download = `clonelevel-themes-${Date.now()}.json`;
      a.click();
    }
    const mergedVars = (0, import_react.useMemo)(() => {
      const map = /* @__PURE__ */ new Map();
      for (const rec of [...records].reverse()) {
        for (const v of rec.variables) map.set(v.name, v);
      }
      return [...map.values()];
    }, [records]);
    const varTypes = ["all", "color", "font", "spacing", "other"];
    const displayVars = filter === "all" ? mergedVars : mergedVars.filter((v) => v.type === filter);
    function isHex(v) {
      return /^#[0-9a-f]{3,8}$/i.test(v.trim());
    }
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { padding: "10px 14px", borderBottom: "1px solid #222", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 13, fontWeight: 700, color: "#f472b6" }, children: "\u{1F3A8} Theme Settings" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { marginLeft: 4, background: "#2d1a2e", color: "#f472b6", borderRadius: 10, padding: "1px 8px", fontSize: 11, fontWeight: 700 }, children: [
          mergedVars.length,
          " vars"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { flex: 1 } }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: load, title: "Refresh", children: "\u21BB" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: exportThemes, disabled: records.length === 0, title: "Export JSON", children: "\u2193 Export" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn insp-action-danger", onClick: handleClear, disabled: records.length === 0, children: "\u2715 Clear" })
      ] }),
      records.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: 13, textAlign: "center", padding: 24 }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 28, marginBottom: 8 }, children: "\u{1F3A8}" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontWeight: 600, marginBottom: 4 }, children: "No theme data captured yet" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { color: "#444", fontSize: 12, maxWidth: 300 }, children: "CloneLevel scans all HighLevel API responses for CSS variables and design tokens automatically \u2014 colors, fonts, spacing, and border radii. Browse a funnel to start." })
      ] }) }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", flex: 1, overflow: "hidden" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { width: 220, borderRight: "1px solid #222", overflowY: "auto", flexShrink: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { padding: "8px 12px", fontSize: 10, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #1a1a1a" }, children: [
            records.length,
            " source",
            records.length !== 1 ? "s" : ""
          ] }),
          records.map((rec) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "div",
            {
              onClick: () => setSelected(rec),
              style: {
                padding: "9px 12px",
                borderBottom: "1px solid #1a1a1a",
                cursor: "pointer",
                background: selected?.themeId === rec.themeId ? "#2a1535" : "transparent"
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 11, fontWeight: 600, color: "#e2e8f0", marginBottom: 2, textTransform: "capitalize" }, children: rec.source }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 10, color: "#555" }, children: [
                  rec.variables.length,
                  " variables"
                ] })
              ]
            },
            rec.themeId
          ))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", gap: 4, padding: "8px 12px", borderBottom: "1px solid #1a1a1a", flexShrink: 0 }, children: varTypes.map((t) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "button",
            {
              onClick: () => setFilter(t),
              style: {
                fontSize: 11,
                padding: "3px 10px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                background: filter === t ? "#831843" : "#1a1a2e",
                color: filter === t ? "#fce7f3" : "#555",
                fontWeight: filter === t ? 700 : 400
              },
              children: [
                t,
                " ",
                t === "all" ? `(${mergedVars.length})` : `(${mergedVars.filter((v) => v.type === t).length})`
              ]
            },
            t
          )) }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { flex: 1, overflowY: "auto", padding: 12 }, children: displayVars.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { color: "#444", fontSize: 12, padding: 16 }, children: [
            'No variables of type "',
            filter,
            '"'
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }, children: displayVars.map((v) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { background: "#111", borderRadius: 8, padding: 10, border: "1px solid #222" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 10, color: "#888", fontFamily: "monospace", marginBottom: 4, wordBreak: "break-all" }, children: v.name }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
              v.type === "color" && isHex(v.value) && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
                width: 22,
                height: 22,
                borderRadius: 4,
                background: v.value,
                border: "1px solid #333",
                flexShrink: 0
              } }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: {
                fontSize: 12,
                fontWeight: 600,
                color: "#e2e8f0",
                fontFamily: v.type === "font" ? v.value : void 0,
                wordBreak: "break-all"
              }, children: v.value })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
              marginTop: 4,
              fontSize: 9,
              padding: "1px 6px",
              borderRadius: 6,
              display: "inline-block",
              background: v.type === "color" ? "#422" : v.type === "font" ? "#224" : "#333",
              color: "#888",
              textTransform: "uppercase",
              letterSpacing: 0.5
            }, children: v.type })
          ] }, v.name)) }) })
        ] })
      ] })
    ] });
  }
  var TEMPLATES_STORAGE_KEY = "clonelevel_templates";
  function TemplatesPanel() {
    const [templates, setTemplates] = (0, import_react.useState)([]);
    const [selected, setSelected] = (0, import_react.useState)(null);
    const [exporting, setExporting] = (0, import_react.useState)(false);
    const [exportLog, setExportLog] = (0, import_react.useState)([]);
    const [showExportDlg, setShowExportDlg] = (0, import_react.useState)(false);
    const [templateName, setTemplateName] = (0, import_react.useState)("My CloneLevel Template");
    const load = (0, import_react.useCallback)(async () => {
      const r = await chrome.storage.local.get(TEMPLATES_STORAGE_KEY);
      setTemplates(Array.isArray(r[TEMPLATES_STORAGE_KEY]) ? r[TEMPLATES_STORAGE_KEY] : []);
    }, []);
    (0, import_react.useEffect)(() => {
      load();
      const onChange = (changes, area) => {
        if (area === "local" && changes[TEMPLATES_STORAGE_KEY]) load();
      };
      chrome.storage.onChanged.addListener(onChange);
      return () => chrome.storage.onChanged.removeListener(onChange);
    }, [load]);
    async function handleClear() {
      if (!confirm("Clear all captured templates?")) return;
      await chrome.storage.local.remove(TEMPLATES_STORAGE_KEY);
      setTemplates([]);
      setSelected(null);
    }
    function exportTemplates() {
      const blob = JSON.stringify(templates, null, 2);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([blob], { type: "application/json" }));
      a.download = `clonelevel-templates-${Date.now()}.json`;
      a.click();
    }
    async function exportAsTemplate() {
      setExporting(true);
      setExportLog(["Building full clone package..."]);
      try {
        const res = await chrome.runtime.sendMessage({
          type: "EXPORT_AS_TEMPLATE",
          id: crypto.randomUUID(),
          payload: { name: templateName }
        });
        if (!res.ok) throw new Error("Export failed");
        setExportLog((l) => [...l, `Package built (${(res.data.size / 1024).toFixed(1)} KB)`]);
        setExportLog((l) => [...l, "Triggering download..."]);
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([res.data.json], { type: "application/json" }));
        a.download = `${templateName.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.json`;
        a.click();
        setExportLog((l) => [...l, "\u2713 Template exported successfully"]);
      } catch (err) {
        setExportLog((l) => [...l, `\u2717 ${String(err)}`]);
      }
      setExporting(false);
    }
    async function getFullPackage() {
      setExporting(true);
      setExportLog(["Building full clone package v2.0..."]);
      try {
        const res = await chrome.runtime.sendMessage({
          type: "GET_FULL_CLONE_PACKAGE",
          id: crypto.randomUUID(),
          payload: {}
        });
        if (!res.ok) throw new Error("Failed to build package");
        const json = JSON.stringify(res.data, null, 2);
        setExportLog((l) => [...l, `Package v2.0 built (${(json.length / 1024).toFixed(1)} KB)`]);
        setExportLog((l) => [...l, "Downloading..."]);
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
        a.download = `clonelevel-package-v2-${Date.now()}.json`;
        a.click();
        setExportLog((l) => [...l, "\u2713 Full clone package downloaded"]);
      } catch (err) {
        setExportLog((l) => [...l, `\u2717 ${String(err)}`]);
      }
      setExporting(false);
    }
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { padding: "10px 14px", borderBottom: "1px solid #222", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 13, fontWeight: 700, color: "#34d399" }, children: "\u{1F4CB} Templates" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { marginLeft: 4, background: "#0d2d1f", color: "#34d399", borderRadius: 10, padding: "1px 8px", fontSize: 11, fontWeight: 700 }, children: templates.length }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { flex: 1 } }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: load, title: "Refresh", children: "\u21BB" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: exportTemplates, disabled: templates.length === 0, title: "Export captured templates", children: "\u2193 Templates" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn insp-action-danger", onClick: handleClear, disabled: templates.length === 0, children: "\u2715 Clear" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", flex: 1, overflow: "hidden" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { width: 260, borderRight: "1px solid #222", overflowY: "auto", flexShrink: 0 }, children: templates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { padding: 20, color: "#444", fontSize: 12, textAlign: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 24, marginBottom: 6 }, children: "\u{1F4CB}" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontWeight: 600, color: "#555", marginBottom: 4 }, children: "No templates captured" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { color: "#333" }, children: "CloneLevel auto-captures HighLevel template endpoints (marketplace, builder templates, snapshots)." })
        ] }) : templates.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
          "div",
          {
            onClick: () => setSelected(t),
            style: {
              padding: "10px 14px",
              borderBottom: "1px solid #1a1a1a",
              cursor: "pointer",
              background: selected?.templateId === t.templateId ? "#0d1f12" : "transparent"
            },
            "data-testid": `template-row-${t.templateId}`,
            children: [
              t.preview && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "img",
                {
                  src: t.preview,
                  alt: t.name,
                  style: { width: "100%", height: 80, objectFit: "cover", borderRadius: 4, marginBottom: 6, background: "#111" },
                  onError: (e) => {
                    e.target.style.display = "none";
                  }
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 12, fontWeight: 600, color: "#e2e8f0", marginBottom: 3 }, children: t.name ?? "Unnamed Template" }),
              t.category && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 10, color: "#34d399", marginBottom: 2 }, children: t.category }),
              t.pageCount && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 10, color: "#555" }, children: [
                t.pageCount,
                " pages"
              ] }),
              t.tags && t.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { marginTop: 4, display: "flex", flexWrap: "wrap", gap: 3 }, children: t.tags.slice(0, 4).map((tag) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 9, background: "#1a2a1a", color: "#4ade80", padding: "1px 5px", borderRadius: 4 }, children: tag }, tag)) })
            ]
          },
          t.templateId + i
        )) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { padding: "14px 16px", borderBottom: "1px solid #1a1a1a", flexShrink: 0 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 12, fontWeight: 700, color: "#34d399", marginBottom: 10 }, children: "\u{1F4E6} Export as Reusable Template" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "input",
                {
                  type: "text",
                  value: templateName,
                  onChange: (e) => setTemplateName(e.target.value),
                  style: {
                    flex: 1,
                    background: "#111",
                    border: "1px solid #333",
                    borderRadius: 6,
                    color: "#e2e8f0",
                    fontSize: 12,
                    padding: "5px 10px"
                  },
                  placeholder: "Template name...",
                  "data-testid": "input-template-name"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "button",
                {
                  className: "insp-action-btn",
                  style: { background: "#065f46", color: "#a7f3d0", fontWeight: 700, fontSize: 12 },
                  onClick: exportAsTemplate,
                  disabled: exporting,
                  "data-testid": "btn-export-as-template",
                  children: exporting ? "..." : "\u{1F4CB} Export As Template"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", gap: 8, marginBottom: 8 }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "button",
              {
                className: "insp-action-btn",
                style: { fontSize: 11, background: "#0d2d1f", color: "#34d399" },
                onClick: getFullPackage,
                disabled: exporting,
                "data-testid": "btn-get-full-package",
                children: "\u{1F4E6} Full Clone Package v2"
              }
            ) }),
            exportLog.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { background: "#0a0a0a", borderRadius: 6, padding: 8, maxHeight: 100, overflowY: "auto" }, children: exportLog.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 10, fontFamily: "monospace", color: line.startsWith("\u2713") ? "#4ade80" : line.startsWith("\u2717") ? "#f87171" : "#888", marginBottom: 2 }, children: line }, i)) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { padding: "12px 16px", borderBottom: "1px solid #1a1a1a", flexShrink: 0 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }, children: "Import Order (v2 pipeline)" }),
            [
              "1. Upload & register asset files",
              "2. Apply theme settings (CSS vars, fonts, colors)",
              "3. Create global sections \u2192 capture new IDs",
              "4. Create funnel shell (name, domain, steps)",
              "5. Create each page within funnel steps",
              "6. Apply page layouts (attach builder JSON)",
              "7. Rewrite global section references \u2192 new IDs",
              "8. Publish funnel"
            ].map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 11, color: "#555", marginBottom: 4, display: "flex", gap: 6 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { color: "#34d399", fontWeight: 700 }, children: "\u2192" }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: step })
            ] }, i))
          ] }),
          selected && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, overflowY: "auto", padding: 16 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 10 }, children: selected.name ?? "Unnamed Template" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("table", { style: { width: "100%", fontSize: 12, borderCollapse: "collapse" }, children: [
              ["Template ID", selected.templateId],
              ["Category", selected.category ?? "\u2014"],
              ["Pages", selected.pageCount?.toString() ?? "\u2014"],
              ["Captured", new Date(selected.capturedAt).toLocaleString()]
            ].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("tr", { style: { borderBottom: "1px solid #1a1a1a" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("td", { style: { padding: "5px 8px 5px 0", color: "#888", width: 90 }, children: k }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("td", { style: { padding: "5px 0", color: "#e2e8f0" }, children: v })
            ] }, k)) })
          ] })
        ] })
      ] })
    ] });
  }
  function CloneView() {
    const [tab, setTab] = (0, import_react.useState)("COPY");
    const [pasteCapId, setPasteCapId] = (0, import_react.useState)(null);
    const handlePasteItem = (captureId) => {
      setPasteCapId(captureId);
      setTab("PASTE");
    };
    const SUB_TABS = [
      { key: "COPY", label: "Copy", icon: "\u26A1" },
      { key: "LIBRARY", label: "Library", icon: "\u{1F5C2}" },
      { key: "PASTE", label: "Paste", icon: "\u{1F4CB}" }
    ];
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "clone-subnav", children: [
        SUB_TABS.map(({ key, label, icon }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
          "button",
          {
            className: `clone-subnav-btn${tab === key ? " active" : ""}`,
            onClick: () => setTab(key),
            "data-testid": `clone-subnav-${key.toLowerCase()}`,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "clone-subnav-icon", children: icon }),
              label
            ]
          },
          key
        )),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { flex: 1 } }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: {
          fontSize: 9,
          color: "#6366f1",
          padding: "0 12px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          opacity: 0.7
        }, children: "CloneLevel" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }, children: [
        tab === "COPY" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(CopyView, { onGoToLibrary: () => setTab("LIBRARY") }),
        tab === "LIBRARY" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(LibraryView, { onPasteItem: handlePasteItem }),
        tab === "PASTE" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PasteView, { initialCaptureId: pasteCapId })
      ] })
    ] });
  }
  function AdvancedView() {
    const [snapshots, setSnapshots] = (0, import_react.useState)([]);
    const [saveMarkTs, setSaveMarkTs] = (0, import_react.useState)(null);
    const [loadMarkTs, setLoadMarkTs] = (0, import_react.useState)(null);
    const [nearWindowS, setNearWindowS] = (0, import_react.useState)(DEFAULT_NEAR_WINDOW_S);
    const [activeFilter, setActiveFilter] = (0, import_react.useState)("CLONE_VIEW");
    const [lastCloneFilter, setLastCloneFilter] = (0, import_react.useState)("CLONE_DATA");
    const [showNoise, setShowNoise] = (0, import_react.useState)(false);
    const [globalSectionCount, setGlobalSectionCount] = (0, import_react.useState)(0);
    const [themeCount, setThemeCount] = (0, import_react.useState)(0);
    const [templateCount, setTemplateCount] = (0, import_react.useState)(0);
    const [compact, setCompact] = (0, import_react.useState)(false);
    const [selected, setSelected] = (0, import_react.useState)(null);
    const [scrollLocked, setScrollLocked] = (0, import_react.useState)(false);
    const [diffPickMode, setDiffPickMode] = (0, import_react.useState)(false);
    const [diffA, setDiffA] = (0, import_react.useState)(null);
    const [diffB, setDiffB] = (0, import_react.useState)(null);
    const [showDiff, setShowDiff] = (0, import_react.useState)(false);
    const [swConnected, setSwConnected] = (0, import_react.useState)(false);
    const [showBridge, setShowBridge] = (0, import_react.useState)(false);
    const portRef = (0, import_react.useRef)(null);
    const reconnectRef = (0, import_react.useRef)(null);
    const pollRef = (0, import_react.useRef)(null);
    const listRef = (0, import_react.useRef)(null);
    const prevSnapCount = (0, import_react.useRef)(0);
    const nearWindowMs = nearWindowS * 1e3;
    const loadSnapshots = (0, import_react.useCallback)(async () => {
      const res = await chrome.storage.local.get(SNAPSHOTS_KEY);
      setSnapshots(res[SNAPSHOTS_KEY] || []);
    }, []);
    const loadGlobalCounts = (0, import_react.useCallback)(async () => {
      const r = await chrome.storage.local.get([
        "clonelevel_global_sections",
        "clonelevel_theme_settings",
        "clonelevel_templates"
      ]);
      const gs = Array.isArray(r["clonelevel_global_sections"]) ? r["clonelevel_global_sections"].length : 0;
      const th = Array.isArray(r["clonelevel_theme_settings"]) ? r["clonelevel_theme_settings"].length : 0;
      const tm = Array.isArray(r["clonelevel_templates"]) ? r["clonelevel_templates"].length : 0;
      setGlobalSectionCount(gs);
      setThemeCount(th);
      setTemplateCount(tm);
    }, []);
    const loadMarks = (0, import_react.useCallback)(async () => {
      const res = await chrome.storage.local.get([SAVE_MARK_KEY, LOAD_MARK_KEY]);
      const sv = res[SAVE_MARK_KEY];
      setSaveMarkTs(typeof sv === "number" && sv > 0 ? sv : null);
      const lv = res[LOAD_MARK_KEY];
      setLoadMarkTs(typeof lv === "number" && lv > 0 ? lv : null);
    }, []);
    const connectPort = (0, import_react.useCallback)(() => {
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
        reconnectRef.current = null;
      }
      try {
        const port = chrome.runtime.connect({ name: "cl-inspector" });
        portRef.current = port;
        setSwConnected(true);
        port.onMessage.addListener((msg) => {
          if (msg.type === "SNAPSHOTS_CLEARED") setSnapshots([]);
        });
        port.onDisconnect.addListener(() => {
          portRef.current = null;
          setSwConnected(false);
          reconnectRef.current = setTimeout(() => connectPort(), 3e3);
        });
      } catch {
        setSwConnected(false);
        reconnectRef.current = setTimeout(() => connectPort(), 3e3);
      }
    }, []);
    (0, import_react.useEffect)(() => {
      loadSnapshots();
      loadMarks();
      connectPort();
      loadGlobalCounts();
      const onChanged = (changes, area) => {
        if (area !== "local") return;
        if (changes[SNAPSHOTS_KEY]) setSnapshots(changes[SNAPSHOTS_KEY].newValue || []);
        if (changes[SAVE_MARK_KEY]) {
          const v = changes[SAVE_MARK_KEY].newValue;
          setSaveMarkTs(typeof v === "number" && v > 0 ? v : null);
        }
        if (changes[LOAD_MARK_KEY]) {
          const v = changes[LOAD_MARK_KEY].newValue;
          setLoadMarkTs(typeof v === "number" && v > 0 ? v : null);
        }
        if (changes["clonelevel_global_sections"] || changes["clonelevel_theme_settings"] || changes["clonelevel_templates"]) {
          loadGlobalCounts();
        }
      };
      chrome.storage.onChanged.addListener(onChanged);
      pollRef.current = setInterval(() => {
        loadSnapshots();
        loadMarks();
        loadGlobalCounts();
      }, 5e3);
      return () => {
        portRef.current?.disconnect();
        if (reconnectRef.current) clearTimeout(reconnectRef.current);
        if (pollRef.current) clearInterval(pollRef.current);
        chrome.storage.onChanged.removeListener(onChanged);
      };
    }, [loadSnapshots, loadMarks, connectPort, loadGlobalCounts]);
    (0, import_react.useEffect)(() => {
      if (!scrollLocked && snapshots.length !== prevSnapCount.current && listRef.current) {
        listRef.current.scrollTop = 0;
      }
      prevSnapCount.current = snapshots.length;
    }, [snapshots.length, scrollLocked]);
    const allEnriched = (0, import_react.useMemo)(
      () => snapshots.map((s) => enrich(s, saveMarkTs, loadMarkTs, nearWindowMs)),
      [snapshots, saveMarkTs, loadMarkTs, nearWindowMs]
    );
    const visibleEnriched = (0, import_react.useMemo)(() => {
      let list = showNoise ? allEnriched : allEnriched.filter((e) => !isNoise(e.snap));
      switch (activeFilter) {
        case "BEST":
          list = list.filter((e) => e.score >= 30);
          return [...list].sort((a, b) => b.score - a.score);
        case "BUILDER":
          list = list.filter((e) => e.cls === "BUILDER_EVENT");
          break;
        case "SCHEMA":
          list = list.filter((e) => e.reqBodyType === "possible-builder-schema" || e.respBodyType === "possible-builder-schema");
          break;
        case "STRUCTURED":
          list = list.filter((e) => e.reqBodyType !== "none" && e.reqBodyType !== "json" || e.respBodyType !== "none" && e.respBodyType !== "json");
          break;
        case "LARGE":
          list = list.filter((e) => e.totalBytes >= 2e4);
          break;
        case "GRAPHQL":
          list = list.filter((e) => e.snap.requestUrl.toLowerCase().includes("/graphql"));
          break;
        case "WRITE":
          list = list.filter((e) => ["POST", "PUT", "PATCH"].includes(e.snap.method.toUpperCase()));
          break;
        case "BODY":
          list = list.filter((e) => e.reqBodyType !== "none" || e.respBodyType !== "none");
          break;
        case "ANALYTICS":
          list = list.filter((e) => e.cls === "ANALYTICS" || e.cls === "STATIC");
          break;
        case "CLONE_DATA":
          list = list.filter(
            (e) => e.snap.schemaTag === "PAGE_SCHEMA" || e.snap.schemaTag === "FUNNEL_SCHEMA" || e.snap.schemaTag === "SAVE_EVENT"
          );
          return [...list].sort((a, b) => b.snap.timestamp.localeCompare(a.snap.timestamp));
        case "PAGE":
          list = list.filter((e) => e.snap.schemaTag === "PAGE_SCHEMA");
          break;
        case "FUNNEL":
          list = list.filter((e) => e.snap.schemaTag === "FUNNEL_SCHEMA");
          break;
      }
      if (activeFilter !== "BEST") {
        list = [...list].sort((a, b) => b.snap.timestamp.localeCompare(a.snap.timestamp));
      }
      return list;
    }, [allEnriched, activeFilter, showNoise]);
    async function handleClear() {
      await sendMsg("CLEAR_INSPECTOR_SNAPSHOTS");
      setSnapshots([]);
      setSelected(null);
      setDiffA(null);
      setDiffB(null);
    }
    function exportAll() {
      const blob = new Blob([JSON.stringify(snapshots, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inspector-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    function handleSelect(e) {
      const same = selected?.snap.id === e.snap.id;
      setSelected(same ? null : e);
      setScrollLocked(!same);
    }
    function handleQuickOpen(e) {
      setSelected(e);
      setScrollLocked(true);
    }
    function handleDiffPick(snap) {
      if (!diffA || diffA.id === snap.id) {
        setDiffA(snap);
      } else if (!diffB || diffB.id === snap.id) {
        setDiffB(snap);
      } else {
        setDiffA(snap);
        setDiffB(null);
      }
    }
    function getDiffSlot(snap) {
      if (diffA?.id === snap.id) return "A";
      if (diffB?.id === snap.id) return "B";
      return null;
    }
    if (showDiff && diffA && diffB) {
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(DiffView, { a: diffA, b: diffB, onBack: () => setShowDiff(false) });
    }
    const hasDetail = !!selected && !diffPickMode;
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-page-wrap", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-page-topbar", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-page-logo", children: "CL" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "insp-page-title", children: "Network Inspector" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { fontSize: 10, color: swConnected ? "#22c55e" : "#f87171", marginLeft: 2 }, children: [
          "\u25CF ",
          swConnected ? "live" : "offline"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "insp-page-topbar-gap" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { className: "insp-action-btn", onClick: () => setShowBridge((v) => !v), "data-testid": "btn-toggle-bridge", children: showBridge ? "\u25BC Bridge" : "\u2699 Bridge" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        DebuggerBar,
        {
          saveMarkTs,
          loadMarkTs,
          onSaveMarkSet: (ts) => setSaveMarkTs(ts > 0 ? ts : null),
          onLoadMarkSet: (ts) => setLoadMarkTs(ts > 0 ? ts : null),
          nearWindowS,
          setNearWindowS
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        NavBar,
        {
          enriched: allEnriched.filter((e) => showNoise || !isNoise(e.snap)),
          activeFilter,
          setActiveFilter,
          showNoise,
          setShowNoise,
          compact,
          setCompact,
          onClear: handleClear,
          onExportAll: exportAll,
          onRefresh: loadSnapshots,
          lastCloneFilter,
          setLastCloneFilter,
          globalSectionCount,
          themeCount,
          templateCount
        }
      ),
      !isFullWidth(activeFilter) && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        StatsBar,
        {
          shown: visibleEnriched.length,
          total: allEnriched.length,
          enriched: allEnriched.filter((e) => showNoise || !isNoise(e.snap))
        }
      ),
      (saveMarkTs || loadMarkTs) && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { padding: "2px 12px", fontSize: 10, background: "rgba(0,0,0,0.3)", borderBottom: "1px solid #2a2d3d", display: "flex", gap: 14 }, children: [
        saveMarkTs && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { color: "#f5c842" }, children: [
          "\u2605 Save at ",
          formatTime2(new Date(saveMarkTs).toISOString()),
          " \xB1",
          nearWindowS,
          "s"
        ] }),
        loadMarkTs && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { color: "#60a5fa" }, children: [
          "\u25C9 Load at ",
          formatTime2(new Date(loadMarkTs).toISOString()),
          " \xB1",
          nearWindowS,
          "s"
        ] })
      ] }),
      !isFullWidth(activeFilter) && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
        display: "grid",
        gridTemplateColumns: GRID,
        padding: "2px 10px",
        background: "#1a1d27",
        borderBottom: "1px solid #2a2d3d",
        fontSize: 9,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "#4b5563",
        flexShrink: 0,
        gap: 0,
        userSelect: "none"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "Method" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "St" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "Type" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "Size" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { title: "Priority score (0-100)", style: { cursor: "help" }, children: "Score" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { title: "Request body present", style: { cursor: "help" }, children: "RB" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { title: "Response body present", style: { cursor: "help" }, children: "RS" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "URL + Tags" })
      ] }),
      activeFilter === "CLONE_VIEW" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "insp-body", style: { flexDirection: "column", padding: 0, overflow: "hidden" }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(CloneView, {}) }),
      activeFilter === "STATE_EXTRACT" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "insp-body", style: { flexDirection: "column" }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(StateExtractPanel, {}) }),
      activeFilter === "PAGE" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "insp-body", style: { flexDirection: "column", padding: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PageSchemaPanel, {}) }),
      activeFilter === "FUNNEL" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "insp-body", style: { flexDirection: "column", padding: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(FunnelSchemaPanel, {}) }),
      activeFilter === "ASSETS" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "insp-body", style: { flexDirection: "column", padding: 0, overflow: "hidden" }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AssetLibraryPanel, {}) }),
      activeFilter === "IMPORT" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "insp-body", style: { flexDirection: "column", padding: 0, overflow: "hidden" }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ImportWorkbench, {}) }),
      activeFilter === "GLOBAL_SECTIONS" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "insp-body", style: { flexDirection: "column", padding: 0, overflow: "hidden" }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(GlobalSectionsPanel, {}) }),
      activeFilter === "THEMES" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "insp-body", style: { flexDirection: "column", padding: 0, overflow: "hidden" }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ThemesPanel, {}) }),
      activeFilter === "TEMPLATES" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "insp-body", style: { flexDirection: "column", padding: 0, overflow: "hidden" }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(TemplatesPanel, {}) }),
      !isFullWidth(activeFilter) && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-body", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-list-col", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { ref: listRef, className: `insp-snap-list${scrollLocked ? " scroll-locked" : ""}`, "data-testid": "snap-list", children: visibleEnriched.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "insp-snap-empty", "data-testid": "snap-empty", children: snapshots.length === 0 ? "Attach the debugger, then navigate to a HighLevel funnel in the builder. Page and funnel schemas will appear here automatically." : activeFilter === "CLONE_DATA" ? "No clone-ready requests captured yet. Open a funnel page in the HighLevel builder \u2014 CloneLevel will detect GET /funnels/page/ and /funnel/fetch/ automatically." : `No requests match "${activeFilter}". Try ALL or enable "Show noise".` }) : visibleEnriched.map((e) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            SnapshotRow,
            {
              e,
              selected: selected?.snap.id === e.snap.id,
              compact,
              diffSlot: getDiffSlot(e.snap),
              diffPickMode,
              onSelect: () => handleSelect(e),
              onDiffPick: () => handleDiffPick(e.snap),
              onQuickOpen: () => handleQuickOpen(e)
            },
            e.snap.id
          )) }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-diff-bar", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: "insp-diff-toggle", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "input",
                {
                  type: "checkbox",
                  checked: diffPickMode,
                  onChange: (ev) => {
                    setDiffPickMode(ev.target.checked);
                    if (!ev.target.checked) {
                      setDiffA(null);
                      setDiffB(null);
                      setScrollLocked(false);
                    }
                  },
                  "data-testid": "chk-diff-mode"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 11, color: "#8b8fa3" }, children: "Diff" })
            ] }),
            diffPickMode && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "insp-diff-slots", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: `insp-diff-slot${diffA ? " insp-diff-slot-filled" : ""}`, children: [
                "A: ",
                diffA ? truncUrl(diffA.requestUrl, 18) : "click row"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: `insp-diff-slot${diffB ? " insp-diff-slot-filled" : ""}`, children: [
                "B: ",
                diffB ? truncUrl(diffB.requestUrl, 18) : "click row"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "button",
                {
                  className: "btn btn-sm btn-primary",
                  onClick: () => setShowDiff(true),
                  disabled: !diffA || !diffB,
                  "data-testid": "btn-show-diff",
                  children: "Compare \u2192"
                }
              )
            ] }),
            scrollLocked && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "button",
              {
                className: "insp-action-btn",
                style: { marginLeft: "auto" },
                onClick: () => setScrollLocked(false),
                "data-testid": "btn-unlock-scroll",
                children: "\u{1F512} Unlock"
              }
            )
          ] }),
          showBridge && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(BridgeDebugDrawer, {})
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: `insp-detail-col${hasDetail ? "" : " insp-detail-hidden"}`, "data-testid": "detail-panel", children: selected && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          DetailPanel,
          {
            e: selected,
            onClose: () => {
              setSelected(null);
              setScrollLocked(false);
            }
          }
        ) })
      ] })
    ] });
  }
  var FUNNEL_PLATFORM_STYLES = {
    "HighLevel": { bg: "rgba(16,185,129,.15)", color: "#34d399", border: "rgba(16,185,129,.35)" },
    "WordPress": { bg: "rgba(0,115,170,.15)", color: "#60a5fa", border: "rgba(0,115,170,.35)" },
    "Webflow": { bg: "rgba(67,83,255,.15)", color: "#818cf8", border: "rgba(67,83,255,.35)" },
    "Squarespace": { bg: "rgba(255,255,255,.06)", color: "#d1d5db", border: "rgba(255,255,255,.15)" },
    "Wix": { bg: "rgba(12,110,252,.15)", color: "#93c5fd", border: "rgba(12,110,252,.35)" },
    "HubSpot": { bg: "rgba(255,122,0,.15)", color: "#fb923c", border: "rgba(255,122,0,.35)" },
    "ClickFunnels 1": { bg: "rgba(255,204,0,.12)", color: "#fde047", border: "rgba(255,204,0,.35)" },
    "ClickFunnels 2": { bg: "rgba(247,147,26,.12)", color: "#fb923c", border: "rgba(247,147,26,.35)" },
    "Kajabi": { bg: "rgba(249,115,22,.12)", color: "#fb923c", border: "rgba(249,115,22,.3)" },
    "Kartra": { bg: "rgba(168,85,247,.12)", color: "#c084fc", border: "rgba(168,85,247,.3)" },
    "Systeme.io": { bg: "rgba(59,130,246,.12)", color: "#60a5fa", border: "rgba(59,130,246,.3)" },
    "Leadpages": { bg: "rgba(34,197,94,.12)", color: "#4ade80", border: "rgba(34,197,94,.3)" }
  };
  function FunnelPlatformPill({ label }) {
    if (!label) return null;
    const s = FUNNEL_PLATFORM_STYLES[label.replace(/[?]$/, "").split(" / ")[0].trim()] ?? { bg: "rgba(255,255,255,.06)", color: "#9ca3af", border: "rgba(255,255,255,.12)" };
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "2px 8px",
      borderRadius: 10,
      flexShrink: 0,
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.03em"
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { width: 6, height: 6, borderRadius: "50%", background: s.color, flexShrink: 0 } }),
      label
    ] });
  }
  function classifyFunnelStep(name, stepType) {
    const n = (name + " " + stepType).toLowerCase();
    if (/thank.?you|confirmation|success|order.confirm/.test(n)) return { label: "Thank You", color: "#2dd4bf", bg: "rgba(45,212,191,.12)", icon: "\u2705" };
    if (/downsell|down.sell/.test(n)) return { label: "Downsell", color: "#f87171", bg: "rgba(248,113,113,.1)", icon: "\u2B07" };
    if (/oto|one.time.offer|order.bump|bump/.test(n)) return { label: "OTO", color: "#fb923c", bg: "rgba(251,146,60,.1)", icon: "\u26A1" };
    if (/upsell|up.sell/.test(n)) return { label: "Upsell", color: "#4ade80", bg: "rgba(74,222,128,.1)", icon: "\u{1F53C}" };
    if (/checkout|order.form|payment|cart/.test(n)) return { label: "Checkout", color: "#f97316", bg: "rgba(249,115,22,.1)", icon: "\u{1F4B3}" };
    if (/sales|vsl|video.sales|long.form/.test(n)) return { label: "Sales", color: "#60a5fa", bg: "rgba(96,165,250,.1)", icon: "\u{1F4B0}" };
    if (/opt.?in|optin|squeeze|lead|signup|subscribe|register/.test(n)) return { label: "Opt-in", color: "#a78bfa", bg: "rgba(167,139,250,.1)", icon: "\u{1F4E5}" };
    if (/webinar|workshop|masterclass|training/.test(n)) return { label: "Webinar", color: "#c084fc", bg: "rgba(192,132,252,.1)", icon: "\u{1F3A5}" };
    if (/booking|calendar|schedule|appointment/.test(n)) return { label: "Booking", color: "#818cf8", bg: "rgba(129,140,248,.1)", icon: "\u{1F4C5}" };
    if (/bridge|interstitial/.test(n)) return { label: "Bridge", color: "#94a3b8", bg: "rgba(148,163,184,.08)", icon: "\u{1F517}" };
    return { label: "Page", color: "#6b7280", bg: "rgba(107,114,128,.08)", icon: "\u{1F4C4}" };
  }
  function buildFunnelStepUrl(domain, stepPath) {
    if (!domain) return "";
    const d = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
    const p = (stepPath ?? "").replace(/^\//, "");
    return p ? `https://${d}/${p}` : `https://${d}`;
  }
  function FunnelMapView() {
    const [domain, setDomain] = (0, import_react.useState)("");
    const [loadState, setLoadState] = (0, import_react.useState)("idle");
    const [errMsg, setErrMsg] = (0, import_react.useState)("");
    const [mapData, setMapData] = (0, import_react.useState)(null);
    const [preview, setPreview] = (0, import_react.useState)(null);
    const [expandedMedia, setExpandedMedia] = (0, import_react.useState)(/* @__PURE__ */ new Set());
    function toggleMedia(stepId) {
      setExpandedMedia((prev) => {
        const next = new Set(prev);
        next.has(stepId) ? next.delete(stepId) : next.add(stepId);
        return next;
      });
    }
    function mediaIcon(type, platform) {
      if (platform === "youtube") return "\u25B6\uFE0F";
      if (platform === "vimeo") return "\u25B6\uFE0F";
      if (platform === "wistia") return "\u25B6\uFE0F";
      if (platform === "loom") return "\u25B6\uFE0F";
      if (platform === "videolytics") return "\u25B6\uFE0F";
      if (type === "pdf") return "\u{1F4C4}";
      if (type === "mp3") return "\u{1F3B5}";
      if (type === "mp4") return "\u{1F3AC}";
      if (type === "video-embed") return "\u25B6\uFE0F";
      if (type === "audio-embed") return "\u{1F50A}";
      return "\u{1F4CE}";
    }
    function mediaLabel(item) {
      if (item.platform && item.platform !== "direct") {
        const pid = item.embedId ? ` \xB7 ${item.embedId.slice(0, 10)}` : "";
        return `${item.platform}${pid}`;
      }
      if (item.filename) return item.filename.slice(0, 50);
      try {
        return new URL(item.url).pathname.split("/").pop()?.slice(0, 50) || item.url.slice(0, 50);
      } catch {
        return item.url.slice(0, 50);
      }
    }
    async function doLoad() {
      setLoadState("loading");
      setErrMsg("");
      setPreview(null);
      try {
        const trimmed = domain.trim();
        if (trimmed) {
          let rootUrl = trimmed;
          if (!/^https?:\/\//i.test(rootUrl)) rootUrl = "https://" + rootUrl;
          const res = await sendMsg("CRAWL_FUNNEL", { rootUrl, maxPages: 40, maxDepth: 4, delayMs: 100 });
          if (!res?.ok) throw new Error(res?.error ?? "Crawl failed");
          const crawlMap = res.data;
          const host = (() => {
            try {
              return new URL(crawlMap.rootUrl).hostname;
            } catch {
              return trimmed;
            }
          })();
          const steps = crawlMap.discoveredPages.map((p, i) => ({
            id: p.id ?? p.url,
            name: p.title || p.url.replace(/^https?:\/\/[^/]+/, "") || "/",
            url: p.url.replace(/^https?:\/\/[^/]+/, ""),
            stepType: p.pageTypeHint ?? "",
            sequence: i,
            platformHint: p.platformHint,
            platformLabel: p.platformLabel,
            mediaItems: p.mediaItems ?? []
          }));
          setMapData({ funnelName: host, domain: host, steps });
        } else {
          const res = await sendMsg("FETCH_GHL_FUNNEL_MAP");
          if (!res?.ok) throw new Error(res?.error ?? "Fetch failed");
          setMapData(res.data);
        }
        setLoadState("loaded");
      } catch (e) {
        setErrMsg(String(e).replace("Error: ", ""));
        setLoadState("error");
      }
    }
    if (preview) {
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, display: "flex", flexDirection: "column", background: "#0b0d14", overflow: "hidden" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 16px",
          borderBottom: "1px solid rgba(255,255,255,.06)",
          flexShrink: 0
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              onClick: () => setPreview(null),
              style: {
                padding: "5px 12px",
                borderRadius: 6,
                border: "1px solid rgba(255,255,255,.1)",
                background: "rgba(255,255,255,.04)",
                color: "#9ca3af",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer"
              },
              children: "\u2190 Back to Map"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 13, fontWeight: 800, color: "#e2e8f0" }, children: preview.name }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 10, color: "#4b5563", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: preview.fullUrl })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "button",
            {
              onClick: () => chrome.tabs.create({ url: preview.fullUrl }),
              style: {
                padding: "6px 14px",
                borderRadius: 6,
                border: "1px solid rgba(99,102,241,.4)",
                background: "rgba(99,102,241,.15)",
                color: "#818cf8",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer"
              },
              children: "\u2197 Full Page"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { flex: 1, position: "relative", overflow: "hidden", background: "#fff" }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "iframe",
          {
            src: preview.fullUrl,
            title: preview.name,
            sandbox: "allow-scripts allow-same-origin",
            style: { width: "100%", height: "100%", border: "none" }
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { padding: "6px 16px", fontSize: 10, color: "#374151", textAlign: "center" }, children: [
          "If blank, the page blocks embedding \u2014",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { color: "#818cf8", cursor: "pointer" }, onClick: () => chrome.tabs.create({ url: preview.fullUrl }), children: "open in new tab \u2197" })
        ] })
      ] });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#0b0d14" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
        display: "flex",
        gap: 8,
        alignItems: "center",
        padding: "12px 16px",
        borderBottom: "1px solid rgba(255,255,255,.06)",
        flexShrink: 0
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "input",
          {
            type: "text",
            placeholder: "Enter public funnel domain (e.g. mysite.com or https://mysite.com)",
            value: domain,
            onChange: (e) => setDomain(e.currentTarget.value),
            onKeyDown: (e) => e.key === "Enter" && doLoad(),
            style: {
              flex: 1,
              padding: "7px 12px",
              borderRadius: 7,
              border: "1px solid rgba(99,102,241,.25)",
              background: "rgba(255,255,255,.03)",
              color: "#e2e8f0",
              fontSize: 12,
              outline: "none"
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            onClick: doLoad,
            disabled: loadState === "loading",
            style: {
              padding: "7px 16px",
              borderRadius: 7,
              border: "1px solid rgba(99,102,241,.35)",
              background: loadState === "loading" ? "rgba(99,102,241,.05)" : "rgba(99,102,241,.15)",
              color: loadState === "loading" ? "#4b5563" : "#818cf8",
              fontSize: 12,
              fontWeight: 700,
              cursor: loadState === "loading" ? "default" : "pointer"
            },
            children: loadState === "loading" ? "Loading\u2026" : loadState === "loaded" ? "\u21BA Refresh" : "Load Map"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, overflowY: "auto", padding: "16px" }, children: [
        loadState === "idle" && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
          maxWidth: 520,
          margin: "24px auto",
          padding: "20px 24px",
          borderRadius: 12,
          background: "rgba(255,255,255,.02)",
          border: "1px solid rgba(255,255,255,.06)",
          fontSize: 12,
          color: "#4b5563",
          lineHeight: 1.8
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 14, fontWeight: 800, color: "#818cf8", marginBottom: 8 }, children: "Funnel Map" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { children: "Discover and visualise every step of any published funnel by scraping the live site." }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { marginTop: 8 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { style: { color: "#a78bfa" }, children: "Public domain:" }),
            " enter any custom domain (e.g. ",
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("em", { children: "mysite.com" }),
            "). The extension fetches the pages directly \u2014 no HL account or login required."
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { marginTop: 8 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { style: { color: "#a78bfa" }, children: "Current HL funnel:" }),
            " leave the domain blank while the GHL page builder is open in another tab to pull the step list from your account."
          ] })
        ] }),
        loadState === "error" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
          maxWidth: 520,
          margin: "24px auto",
          padding: "14px 18px",
          borderRadius: 10,
          background: "rgba(248,113,113,.07)",
          border: "1px solid rgba(248,113,113,.2)",
          fontSize: 12,
          color: "#fca5a5"
        }, children: errMsg }),
        loadState === "loaded" && mapData && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { maxWidth: 560, margin: "0 auto", display: "flex", flexDirection: "column" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { marginBottom: 16, textAlign: "center" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 16, fontWeight: 800, color: "#818cf8" }, children: mapData.funnelName }),
            mapData.domain && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 11, color: "#4b5563", marginTop: 2 }, children: mapData.domain }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 10, color: "#374151", marginTop: 4 }, children: [
              mapData.steps.length,
              " step",
              mapData.steps.length !== 1 ? "s" : ""
            ] })
          ] }),
          mapData.steps.map((step, i) => {
            const cls = classifyFunnelStep(step.name, step.stepType);
            const fullUrl = buildFunnelStepUrl(mapData.domain, step.url);
            const isLast = i === mapData.steps.length - 1;
            return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", flexDirection: "column", alignItems: "center" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                background: cls.bg,
                border: `1px solid ${cls.color}30`,
                display: "flex",
                alignItems: "center",
                gap: 12
              }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  flexShrink: 0,
                  border: `2px solid ${cls.color}55`,
                  background: cls.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 800,
                  color: cls.color
                }, children: i + 1 }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#e2e8f0",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }, children: step.name }),
                  step.url && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { fontSize: 10, color: "#4b5563", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
                    "/",
                    step.url.replace(/^\//, "")
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: {
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  flexShrink: 0,
                  padding: "3px 10px",
                  borderRadius: 12,
                  background: cls.bg,
                  border: `1px solid ${cls.color}44`,
                  color: cls.color,
                  fontSize: 10,
                  fontWeight: 700
                }, children: [
                  cls.icon,
                  " ",
                  cls.label
                ] }),
                step.platformHint && step.platformHint !== "unknown" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(FunnelPlatformPill, { label: step.platformLabel }),
                fullUrl && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  "button",
                  {
                    onClick: () => setPreview({ name: step.name, fullUrl }),
                    title: "Preview page",
                    style: {
                      flexShrink: 0,
                      padding: "4px 10px",
                      borderRadius: 6,
                      border: "1px solid rgba(255,255,255,.1)",
                      background: "rgba(255,255,255,.04)",
                      color: "#9ca3af",
                      fontSize: 11,
                      cursor: "pointer"
                    },
                    children: "\u{1F441} Preview"
                  }
                ),
                fullUrl && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  "button",
                  {
                    onClick: () => chrome.tabs.create({ url: fullUrl }),
                    title: "Open in new tab",
                    style: {
                      flexShrink: 0,
                      padding: "4px 10px",
                      borderRadius: 6,
                      border: "1px solid rgba(99,102,241,.3)",
                      background: "rgba(99,102,241,.1)",
                      color: "#818cf8",
                      fontSize: 11,
                      cursor: "pointer"
                    },
                    children: "\u2197"
                  }
                )
              ] }),
              step.mediaItems?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { width: "100%", marginTop: 2 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                  "button",
                  {
                    onClick: () => toggleMedia(step.id),
                    "data-testid": `btn-media-toggle-${step.id}`,
                    style: {
                      width: "100%",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "3px 10px",
                      color: "#6b7280",
                      fontSize: 10
                    },
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: expandedMedia.has(step.id) ? "\u25BE" : "\u25B8" }),
                      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { children: [
                        "\u{1F4CE} ",
                        step.mediaItems.length,
                        " media asset",
                        step.mediaItems.length !== 1 ? "s" : ""
                      ] })
                    ]
                  }
                ),
                expandedMedia.has(step.id) && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  padding: "4px 12px 8px",
                  background: "rgba(255,255,255,.02)",
                  borderRadius: "0 0 8px 8px",
                  border: "1px solid rgba(255,255,255,.06)",
                  borderTop: "none"
                }, children: step.mediaItems.map((item, mi) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                  "a",
                  {
                    href: item.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    "data-testid": `link-media-${step.id}-${mi}`,
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 11,
                      color: "#9ca3af",
                      textDecoration: "none",
                      padding: "3px 0"
                    },
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 14, flexShrink: 0 }, children: mediaIcon(item.type, item.platform) }),
                      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: {
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }, children: mediaLabel(item) }),
                      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: {
                        padding: "2px 6px",
                        borderRadius: 5,
                        background: "rgba(99,102,241,.12)",
                        color: "#818cf8",
                        fontSize: 9,
                        fontWeight: 700,
                        flexShrink: 0
                      }, children: item.platform && item.platform !== "direct" ? item.platform : item.type })
                    ]
                  },
                  mi
                )) })
              ] }),
              !isLast && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", margin: "2px 0" }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { width: 2, height: 14, background: "rgba(99,102,241,.3)" } }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 10, color: "rgba(99,102,241,.5)", lineHeight: 1 }, children: "\u25BC" })
              ] })
            ] }, step.id);
          })
        ] })
      ] })
    ] });
  }
  var TOP_NAV_TABS = [
    { id: "copy", label: "COPY", icon: "\u26A1" },
    { id: "library", label: "LIBRARY", icon: "\u{1F4DA}" },
    { id: "paste", label: "PASTE", icon: "\u2191" },
    { id: "assets", label: "ASSETS", icon: "\u{1F5BC}" },
    { id: "map", label: "MAP", icon: "\u{1F5FA}" },
    { id: "advanced", label: "ADVANCED", icon: "\u{1F52C}" }
  ];
  function getInitialNav() {
    try {
      const p = new URLSearchParams(window.location.search).get("view");
      if (p === "library" || p === "paste" || p === "assets" || p === "map" || p === "advanced") return p;
    } catch {
    }
    return "copy";
  }
  function App() {
    const [nav, setNav] = (0, import_react.useState)(getInitialNav);
    const [pasteTarget, setPasteTarget] = (0, import_react.useState)(null);
    function goToPaste(captureId) {
      setPasteTarget(captureId);
      setNav("paste");
    }
    function handleNavChange(id) {
      if (id !== "paste") setPasteTarget(null);
      setNav(id);
    }
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: "#0b0d14",
      fontFamily: "'Inter', system-ui, sans-serif",
      color: "#e2e8f0",
      overflow: "hidden"
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,.06)",
        background: "linear-gradient(90deg, #0e1018 0%, #0d0f1a 100%)",
        flexShrink: 0
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: {
          padding: "0 16px",
          height: 46,
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderRight: "1px solid rgba(255,255,255,.05)",
          flexShrink: 0
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: {
            width: 22,
            height: 22,
            borderRadius: 6,
            background: "linear-gradient(135deg,#6366f1,#a855f7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 900,
            color: "#fff",
            boxShadow: "0 0 10px rgba(99,102,241,.5)"
          }, children: "C" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 11, fontWeight: 800, color: "#818cf8", letterSpacing: "0.08em" }, children: "CLONELEVEL" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", height: 46, paddingLeft: 4, flex: 1 }, children: TOP_NAV_TABS.map(({ id, label, icon }) => {
          const active = nav === id;
          return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "button",
            {
              onClick: () => handleNavChange(id),
              "data-testid": `top-nav-${id}`,
              style: {
                height: "100%",
                padding: "0 16px",
                border: "none",
                cursor: "pointer",
                background: "transparent",
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.09em",
                color: active ? "#818cf8" : "#374151",
                borderBottom: active ? "2px solid #6366f1" : "2px solid transparent",
                transition: "all .15s",
                position: "relative"
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { fontSize: 12 }, children: icon }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: label }),
                active && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: {
                  position: "absolute",
                  bottom: -1,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 28,
                  height: 2,
                  borderRadius: 2,
                  background: "linear-gradient(90deg,#6366f1,#a855f7)",
                  boxShadow: "0 0 8px rgba(99,102,241,.6)"
                } })
              ]
            },
            id
          );
        }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }, children: [
        nav === "copy" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(CopyView, { onGoToLibrary: () => handleNavChange("library") }),
        nav === "library" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(LibraryView, { onPasteItem: goToPaste }),
        nav === "paste" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PasteView, { initialCaptureId: pasteTarget }),
        nav === "assets" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AssetLibraryPanel, {}),
        nav === "map" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(FunnelMapView, {}),
        nav === "advanced" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(AdvancedView, {})
      ] })
    ] });
  }
  var root = document.getElementById("inspector-root");
  if (root) (0, import_client.createRoot)(root).render(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)(App, {}));
})();
/*! Bundled license information:

react/cjs/react.production.min.js:
  (**
   * @license React
   * react.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

scheduler/cjs/scheduler.production.min.js:
  (**
   * @license React
   * scheduler.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.production.min.js:
  (**
   * @license React
   * react-dom.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.min.js:
  (**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=inspector.js.map
