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

  // clonelevel/src/paste/paste.tsx
  var import_client = __toESM(require_client(), 1);
  var import_react = __toESM(require_react(), 1);

  // clonelevel/src/content/builder-runtime-probe.ts
  function _builderRuntimeProbeFunc() {
    const w = window;
    if (w.__cl_runtime?.spyActive) return "already_active";
    w.__cl_runtime = {
      spyActive: false,
      storeType: "none",
      storeKey: null,
      _storeRef: null,
      _origDispatch: null,
      dispatched: [],
      apolloFound: false,
      errors: []
    };
    let store = null;
    try {
      const hook = w.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (hook) {
        let findStoreInFiber2 = function(fiber, depth) {
          if (!fiber || depth > 150) return null;
          const mp = fiber.memoizedProps;
          if (mp) {
            if (mp.store?.dispatch && typeof mp.store.getState === "function") return mp.store;
            if (mp.value?.store?.dispatch) return mp.value.store;
            if (mp.value?.dispatch && typeof mp.value.getState === "function") return mp.value;
          }
          const ms = fiber.memoizedState;
          if (ms?.element?.props?.store?.dispatch) return ms.element.props.store;
          return findStoreInFiber2(fiber.child, depth + 1) || findStoreInFiber2(fiber.sibling, depth + 1);
        };
        var findStoreInFiber = findStoreInFiber2;
        if (hook.renderers) {
          for (const [, renderer] of hook.renderers) {
            try {
              const roots = typeof renderer.getFiberRoots === "function" ? renderer.getFiberRoots() : /* @__PURE__ */ new Set();
              for (const root2 of roots) {
                if (root2?.current) {
                  const s = findStoreInFiber2(root2.current, 0);
                  if (s) {
                    store = s;
                    w.__cl_runtime.storeType = "devtools-fiber";
                    break;
                  }
                }
              }
            } catch {
            }
            if (store) break;
          }
        }
        if (!store && hook._roots) {
          for (const root2 of hook._roots) {
            if (root2?.current) {
              const s = findStoreInFiber2(root2.current, 0);
              if (s) {
                store = s;
                w.__cl_runtime.storeType = "devtools-fiber-_roots";
                break;
              }
            }
          }
        }
      }
    } catch (e) {
      w.__cl_runtime.errors.push("devtools:" + String(e).slice(0, 60));
    }
    if (!store) {
      const STORE_KEYS = [
        "store",
        "__store",
        "__redux_store",
        "pageStore",
        "builderStore",
        "funnelStore",
        "appStore",
        "rootStore",
        "__builderStore",
        "__pageStore",
        "editorStore",
        "__editorStore",
        "__appStore",
        "__rootStore",
        "_store",
        "mainStore",
        "hlStore",
        "__hlStore"
      ];
      for (const k of STORE_KEYS) {
        try {
          const s = w[k];
          if (s?.dispatch && typeof s.dispatch === "function" && typeof s.getState === "function") {
            store = s;
            w.__cl_runtime.storeType = "window-global";
            w.__cl_runtime.storeKey = k;
            break;
          }
        } catch {
        }
      }
    }
    if (!store) {
      try {
        const propNames = Object.getOwnPropertyNames(w).slice(0, 1e3);
        for (const k of propNames) {
          if (/^(__cl_|on|webkit|moz|ms|css|SVG|HTML|document|window|navigator|screen|history|location|performance|crypto|indexedDB|caches|console|Math|JSON|Array|Object|Function|String|Number|Boolean|Symbol|BigInt|Promise|Set|Map|WeakSet|WeakMap|Error|RegExp|Date|Intl|Reflect|Proxy|globalThis|undefined|NaN|Infinity)/.test(k)) continue;
          try {
            const v = w[k];
            if (!v || typeof v !== "object" || Array.isArray(v)) continue;
            if (typeof v.dispatch !== "function" || typeof v.getState !== "function") continue;
            try {
              const st = v.getState();
              if (st && typeof st === "object") {
                const stKeys = Object.keys(st).join(",").toLowerCase();
                if (/section|page|funnel|builder|editor|element|step|row|block/.test(stKeys)) {
                  store = v;
                  w.__cl_runtime.storeType = "window-scan";
                  w.__cl_runtime.storeKey = k;
                  break;
                }
              }
            } catch {
            }
          } catch {
          }
        }
      } catch (e) {
        w.__cl_runtime.errors.push("scan:" + String(e).slice(0, 60));
      }
    }
    if (!store) {
      try {
        const iframes = document.querySelectorAll("iframe");
        for (let i = 0; i < Math.min(iframes.length, 10) && !store; i++) {
          try {
            const fw = iframes[i].contentWindow;
            if (!fw) continue;
            for (const k of ["store", "__store", "__redux_store", "builderStore", "pageStore", "editorStore", "appStore"]) {
              try {
                const s = fw[k];
                if (s?.dispatch && typeof s.getState === "function") {
                  store = s;
                  w.__cl_runtime.storeType = "iframe-window";
                  w.__cl_runtime.storeKey = `iframe[${i}].${k}`;
                  break;
                }
              } catch {
              }
            }
          } catch {
          }
        }
      } catch {
      }
    }
    try {
      if (w.__APOLLO_CLIENT__ || w.apolloClient || w.__APOLLO_STATE__ || w.__APOLLO__) {
        w.__cl_runtime.apolloFound = true;
      }
    } catch {
    }
    if (store) {
      try {
        w.__cl_runtime._storeRef = store;
        w.__cl_runtime._origDispatch = store.dispatch;
        const rt2 = w.__cl_runtime;
        const origDispatch = store.dispatch;
        store.dispatch = function clSpyDispatch(action) {
          try {
            if (action && typeof action === "object") {
              rt2.dispatched.push({
                type: String(action.type ?? "@@unknown"),
                payload: JSON.stringify(action).slice(0, 3e3),
                ts: Date.now()
              });
              if (rt2.dispatched.length > 300) rt2.dispatched.shift();
            }
          } catch {
          }
          return origDispatch.call(this, action);
        };
        w.__cl_runtime.spyActive = true;
      } catch (e) {
        w.__cl_runtime.errors.push("spy:" + String(e).slice(0, 60));
      }
    }
    const rt = w.__cl_runtime;
    if (rt.spyActive) return `store:${rt.storeType}:key=${rt.storeKey ?? "?"}:spy=ACTIVE`;
    if (rt._storeRef) return `store:${rt.storeType}:spy=WRAP_FAILED`;
    return `no_store:apollo=${rt.apolloFound}:errors=${rt.errors.length}`;
  }
  function _pullRuntimeCapturesFunc() {
    const w = window;
    const rt = w.__cl_runtime;
    const empty = {
      active: false,
      storeFound: false,
      storeType: "none",
      storeKey: null,
      apolloFound: false,
      dispatched: [],
      allDispatched: [],
      totalCaptured: 0,
      statePreview: null,
      errors: []
    };
    if (!rt) return empty;
    const SECTION_ADD = [
      "add",
      "insert",
      "create",
      "append",
      "paste",
      "import",
      "duplicate",
      "copy",
      "clone",
      "template",
      "apply",
      "inject",
      "load"
    ];
    const SECTION_NOUN = [
      "section",
      "element",
      "row",
      "block",
      "component",
      "widget",
      "module",
      "node",
      "step",
      "column"
    ];
    const REMOVE_KW = ["delete", "remove", "destroy", "clear", "reset", "undo", "pop", "splice"];
    function scoreAction(type) {
      const t = type.toLowerCase().replace(/[/_\-\.]/g, " ");
      const hasRemove = REMOVE_KW.some((k) => t.includes(k));
      if (hasRemove) return -10;
      const addHits = SECTION_ADD.filter((k) => t.includes(k)).length;
      const nounHits = SECTION_NOUN.filter((k) => t.includes(k)).length;
      return addHits * 8 + nounHits * 12;
    }
    const allDispatched = (rt.dispatched ?? []).slice(-50).map((d) => ({
      type: d.type ?? "unknown",
      payload: d.payload ?? "",
      ts: d.ts ?? 0,
      score: scoreAction(d.type ?? "")
    }));
    const scored = [...allDispatched].filter((d) => d.score > 0).sort((a, b) => b.score - a.score || b.ts - a.ts).slice(0, 30);
    let statePreview = null;
    try {
      if (rt._storeRef?.getState) {
        statePreview = JSON.stringify(rt._storeRef.getState()).slice(0, 4e3);
      }
    } catch {
    }
    return {
      active: rt.spyActive ?? false,
      storeFound: !!rt._storeRef,
      storeType: rt.storeType ?? "none",
      storeKey: rt.storeKey ?? null,
      apolloFound: rt.apolloFound ?? false,
      dispatched: scored,
      allDispatched,
      totalCaptured: (rt.dispatched ?? []).length,
      statePreview,
      errors: rt.errors ?? []
    };
  }

  // clonelevel/src/paste/paste.tsx
  var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
  var ErrorBoundary = class extends import_react.Component {
    constructor(props) {
      super(props);
      this.state = { error: null, stack: "" };
    }
    static getDerivedStateFromError(error) {
      return { error, stack: "" };
    }
    componentDidCatch(error, info) {
      console.error("[CloneLevel] paste.html crash:", error.message, error.stack);
      console.error("[CloneLevel] component stack:", info.componentStack);
      this.setState({ error, stack: info.componentStack ?? "" });
    }
    render() {
      if (this.state.error) {
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: 32, background: "#0d1117", color: "#f87171", minHeight: "100vh", fontFamily: "monospace" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 14, fontWeight: 700, marginBottom: 12, color: "#fca5a5" }, children: "\u26A0 CloneLevel \u2014 Paste Workbench Error" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, marginBottom: 8, color: "#ef4444" }, children: this.state.error.message }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pre", { style: { fontSize: 10, color: "#6b7280", whiteSpace: "pre-wrap", wordBreak: "break-all", marginBottom: 16, maxHeight: 280, overflow: "auto", background: "#080b12", padding: 10, borderRadius: 6 }, children: [
            (this.state.error.stack ?? "").slice(0, 800),
            this.state.stack ? "\n\nComponent stack:\n" + this.state.stack.slice(0, 400) : ""
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              onClick: () => this.setState({ error: null, stack: "" }),
              style: { fontSize: 11, padding: "6px 18px", borderRadius: 7, border: "1px solid rgba(248,113,113,.4)", background: "rgba(248,113,113,.08)", color: "#f87171", cursor: "pointer" },
              children: "\u21BA Retry"
            }
          )
        ] });
      }
      return this.props.children;
    }
  };
  function candidatePriority(url) {
    const u = (url ?? "").toLowerCase();
    if (u.includes("prebuilt-section")) return 1e3;
    if (u.includes("autosave")) return 800;
    if (u.includes("element-template")) return 600;
    if (u.includes("global-section")) return 400;
    return 0;
  }
  function sortCandidatesByPriority(arr) {
    return [...arr].sort(
      (a, b) => candidatePriority(b.url) + (b.score ?? 0) - (candidatePriority(a.url) + (a.score ?? 0))
    );
  }
  function buildActivePasteStrategy(candidate) {
    if (!candidate) {
      return {
        type: "content-script-inject",
        executor: "dom-inject (content-script)",
        candidate: null,
        candidateId: null,
        method: null,
        fullUrl: null,
        headerCount: 0,
        replayable: false
      };
    }
    const isDispatch = candidate.tag === "RUNTIME_DISPATCH" || candidate.source === "runtime-dispatch" || !!candidate.dispatchActionType;
    if (isDispatch) {
      return {
        type: "runtime-dispatch",
        executor: "dispatch-inject (MAIN world)",
        candidate,
        candidateId: candidate.id,
        method: "DISPATCH",
        fullUrl: candidate.url || null,
        headerCount: 0,
        replayable: !!candidate.dispatchActionType,
        dispatchActionType: candidate.dispatchActionType,
        dispatchPayload: candidate.dispatchPayload
      };
    }
    const url = candidate.url ?? candidate.fullUrl ?? candidate.endpoint ?? "";
    const method = candidate.method ?? "";
    const headers = { ...candidate.requestHeaders ?? {}, ...candidate.headers ?? {} };
    return {
      type: "learned-mutation-replay",
      executor: "fetch-replay (MAIN world)",
      candidate,
      candidateId: candidate.id,
      method: method || null,
      fullUrl: url || null,
      headerCount: Object.keys(headers).length,
      replayable: !!(url && method)
    };
  }
  function normalizeCandidate(c) {
    const url = c.url ?? c.fullUrl ?? c.endpoint ?? "";
    const requestHeaders = {
      ...c.requestHeaders ?? {},
      ...c.headers ?? {}
    };
    return {
      id: c.id,
      url,
      method: c.method ?? "POST",
      tag: c.tag ?? "UNKNOWN",
      score: c.score ?? 0,
      statusCode: c.statusCode ?? null,
      payloadSize: c.payloadSize ?? c.body?.length ?? 0,
      capturedAt: c.capturedAt ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestBody: c.requestBody ?? c.body ?? "",
      responseBody: c.responseBody ?? "",
      requestHeaders: Object.keys(requestHeaders).length > 0 ? requestHeaders : void 0,
      ...c.scoreBreakdown ? { scoreBreakdown: c.scoreBreakdown } : {},
      ...c.contentType ? { contentType: c.contentType } : {},
      ...c.frameId ? { frameId: c.frameId } : {},
      ...c.fullUrl ? { fullUrl: c.fullUrl } : {},
      ...c.endpoint ? { endpoint: c.endpoint } : {},
      ...c.host ? { host: c.host } : {},
      // ── Runtime dispatch fields — must be preserved so buildActivePasteStrategy detects them ──
      ...c.dispatchActionType ? { dispatchActionType: c.dispatchActionType } : {},
      ...c.dispatchPayload ? { dispatchPayload: c.dispatchPayload } : {},
      ...c.dispatchStoreType ? { dispatchStoreType: c.dispatchStoreType } : {},
      ...c.source ? { source: c.source } : {}
    };
  }
  function msg(type, payload) {
    return new Promise(
      (resolve) => chrome.runtime.sendMessage(
        { type, id: crypto.randomUUID(), timestamp: (/* @__PURE__ */ new Date()).toISOString(), payload },
        resolve
      )
    );
  }
  function _domSnapshotFunc() {
    const SECTION_SELS = [
      "[data-type='section']",
      "[data-section]",
      "[data-row]",
      ".hl-section",
      "[class*='section']",
      "[class*='row-wrap']",
      "section",
      "[class*='builder-section']",
      "[class*='funnel-section']"
    ];
    let sectionCount = 0;
    for (const sel of SECTION_SELS) {
      try {
        const n = document.querySelectorAll(sel).length;
        if (n > sectionCount) sectionCount = n;
      } catch {
      }
    }
    const elementCount = document.querySelectorAll(
      "p, h1, h2, h3, h4, img, a, button, input, [class*='element']"
    ).length;
    return {
      sectionCount,
      elementCount,
      htmlLength: document.body?.innerHTML?.length ?? 0,
      capturedAt: (/* @__PURE__ */ new Date()).toISOString(),
      source: "injected"
    };
  }
  async function takeDomSnapshot(tabId, frameId) {
    try {
      if (frameId != null) {
        const results2 = await chrome.scripting.executeScript({
          target: { tabId, frameIds: [frameId] },
          world: "MAIN",
          func: _domSnapshotFunc
        });
        const snap2 = results2?.[0]?.result;
        if (snap2) {
          snap2.source = `frame:${frameId}`;
          return snap2;
        }
      }
      const results = await chrome.scripting.executeScript({
        target: { tabId, allFrames: false },
        world: "MAIN",
        func: _domSnapshotFunc
      });
      const snap = results?.[0]?.result ?? null;
      if (snap) snap.source = "top";
      return snap;
    } catch {
      return null;
    }
  }
  function ts() {
    return (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }
  function fmt(n) {
    if (!n) return "0B";
    if (n < 1024) return `${n}B`;
    if (n < 1048576) return `${(n / 1024).toFixed(1)}KB`;
    return `${(n / 1048576).toFixed(2)}MB`;
  }
  function Card({ children, style }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
      borderRadius: 14,
      padding: "20px 24px",
      border: "1px solid rgba(255,255,255,.07)",
      background: "rgba(255,255,255,.02)",
      ...style
    }, children });
  }
  function SectionLabel({ children }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
      fontSize: 9.5,
      fontWeight: 800,
      color: "#4b5563",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      marginBottom: 10
    }, children });
  }
  function StatusRow({
    label,
    value,
    ok,
    neutral,
    warn
  }) {
    const dot = neutral ? "#6b7280" : warn ? "#f59e0b" : ok ? "#10b981" : "#f87171";
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 11, color: "#6b7280" }, children: label }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#e2e8f0", fontFamily: "monospace" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: dot,
          flexShrink: 0,
          boxShadow: !neutral ? `0 0 5px ${dot}` : void 0
        } }),
        value ?? "\u2014"
      ] })
    ] });
  }
  function Spinner({ size = 16 }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
      display: "inline-block",
      width: size,
      height: size,
      border: "2px solid rgba(255,255,255,.12)",
      borderTop: "2px solid #6366f1",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
      flexShrink: 0
    } });
  }
  function PrimaryBtn({
    label,
    onClick,
    disabled,
    loading,
    accent,
    testId
  }) {
    const color = accent ?? "#6366f1";
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "button",
      {
        onClick,
        disabled: disabled || loading,
        "data-testid": testId,
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: "100%",
          padding: "13px 20px",
          borderRadius: 10,
          border: `1px solid ${color}55`,
          background: `linear-gradient(135deg, ${color}22, ${color}11)`,
          color: disabled ? "#374151" : color,
          fontSize: 13,
          fontWeight: 700,
          cursor: disabled || loading ? "default" : "pointer",
          opacity: disabled ? 0.45 : 1,
          transition: "all .15s",
          boxShadow: !disabled ? `0 0 18px ${color}22` : void 0
        },
        children: [
          loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { size: 14 }),
          label
        ]
      }
    );
  }
  function StageBar({ stages }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 0, marginBottom: 20 }, children: stages.map((s, i) => {
      const color = s.failed ? "#f87171" : s.done ? "#10b981" : s.active ? "#6366f1" : "#374151";
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: 5 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
            width: 24,
            height: 24,
            borderRadius: "50%",
            flexShrink: 0,
            background: s.done ? "#10b981" : s.failed ? "#f87171" : s.active ? "#6366f1" : "#1a1d27",
            border: `2px solid ${color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 800,
            color: s.done || s.failed || s.active ? "#fff" : "#374151",
            boxShadow: s.active ? `0 0 12px ${color}55` : void 0,
            transition: "all .3s"
          }, children: s.done ? "\u2713" : s.failed ? "\u2717" : s.n }),
          i < stages.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
            flex: 1,
            height: 2,
            background: s.done ? "#10b981" : "#1a1d27",
            transition: "background .3s"
          } })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 9, fontWeight: 600, letterSpacing: "0.04em", color: s.active ? "#a5b4fc" : s.done ? "#10b981" : "#4b5563" }, children: s.label })
      ] }, s.n);
    }) });
  }
  function ResultBanner({ phase, result }) {
    if (phase === "verified_success") {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
        borderRadius: 12,
        padding: "20px 24px",
        background: "linear-gradient(135deg,rgba(16,185,129,.1),rgba(52,211,153,.05))",
        border: "1px solid rgba(16,185,129,.3)",
        boxShadow: "0 0 24px rgba(16,185,129,.12)"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 28 }, children: "\u2705" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 800, color: "#10b981" }, children: "Verified Success" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, color: "#6b7280", marginTop: 3 }, children: "Builder DOM changed after paste \u2014 a real change was detected in HighLevel" })
          ] })
        ] }),
        result?.snapBefore && result?.snapAfter && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 10.5, color: "#10b981", fontFamily: "monospace", lineHeight: 1.9 }, children: [
          "Sections: ",
          result.snapBefore.sectionCount,
          " \u2192 ",
          result.snapAfter.sectionCount,
          "\xA0\xB7 Elements: ",
          result.snapBefore.elementCount,
          " \u2192 ",
          result.snapAfter.elementCount
        ] })
      ] });
    }
    if (phase === "attempted_unverified") {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
        borderRadius: 12,
        padding: "20px 24px",
        background: "rgba(245,158,11,.05)",
        border: "1px solid rgba(245,158,11,.3)"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 28 }, children: "\u26A0\uFE0F" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 800, color: "#f59e0b" }, children: "Attempted But Unverified" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, color: "#6b7280", marginTop: 3 }, children: "The paste message was sent \u2014 but no visible change was detected in the HighLevel builder DOM" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 11, color: "#6b7280", lineHeight: 1.7 }, children: [
          "Injection was attempted via ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { style: { fontSize: 10, color: "#c4b5fd" }, children: result?.strategy ?? "content-script injection" }),
          " but no DOM change was detected.",
          " ",
          "Use ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { style: { color: "#f59e0b" }, children: "Learn Import Path" }),
          " below to capture a real HighLevel save endpoint \u2014 then select it as your strategy above and paste again."
        ] })
      ] });
    }
    if (phase === "attempt_failed") {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
        borderRadius: 12,
        padding: "20px 24px",
        background: "rgba(248,113,113,.05)",
        border: "1px solid rgba(248,113,113,.25)"
      }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 28 }, children: "\u274C" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 800, color: "#f87171" }, children: "Attempt Failed" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, color: "#6b7280", marginTop: 3 }, children: result?.responseMsg ?? "An error occurred during the paste attempt. See the execution log." })
        ] })
      ] }) });
    }
    return null;
  }
  function ExecLog({ lines, title }) {
    const ref = (0, import_react.useRef)(null);
    (0, import_react.useEffect)(() => {
      if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
    }, [lines]);
    if (lines.length === 0) return null;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: title ?? "Execution Log" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref, style: {
        background: "#060810",
        border: "1px solid rgba(99,102,241,.14)",
        borderRadius: 8,
        padding: "12px 14px",
        fontFamily: "monospace",
        fontSize: 11,
        lineHeight: 2,
        maxHeight: 220,
        overflowY: "auto",
        color: "#4b5563"
      }, children: lines.map((l, i) => {
        const isErr = l.includes("\u2717") || l.includes("FAILED") || l.includes("ERROR");
        const isOk = l.includes("\u2713") || l.includes("VERIFIED") || l.includes("CHANGED");
        const isWarn = l.includes("\u26A0") || l.includes("UNVERIFIED");
        const isSt = /^Stage \d/.test(l);
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { color: isErr ? "#f87171" : isOk ? "#10b981" : isWarn ? "#f59e0b" : isSt ? "#818cf8" : "#4b5563", fontWeight: isSt ? 700 : 400 }, children: [
          "[",
          ts(),
          "] ",
          l
        ] }, i);
      }) })
    ] });
  }
  function CandidateTable({
    candidates,
    selectedCandidate,
    onSelect
  }) {
    const [sortKey, setSortKey] = (0, import_react.useState)("score");
    const [sortAsc, setSortAsc] = (0, import_react.useState)(false);
    const [expandedRowId, setExpandedRowId] = (0, import_react.useState)(null);
    function handleSort(k) {
      if (k === sortKey) setSortAsc(!sortAsc);
      else {
        setSortKey(k);
        setSortAsc(k !== "score");
      }
    }
    const sorted = [...candidates].sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (av == null) av = "";
      if (bv == null) bv = "";
      const cmp = String(av).localeCompare(String(bv), void 0, { numeric: true });
      return sortAsc ? cmp : -cmp;
    });
    const TAG_COLORS = {
      SAVE_PAGE: "#6366f1",
      SAVE_FUNNEL: "#8b5cf6",
      IMPORT_CANDIDATE: "#10b981",
      PUBLISH: "#f59e0b",
      AUTOSAVE: "#3b82f6",
      UNKNOWN: "#4b5563"
    };
    function scoreColor(s) {
      if (s >= 70) return "#10b981";
      if (s >= 50) return "#f59e0b";
      return "#f87171";
    }
    function methodColor(m) {
      if (m === "PUT") return "#6366f1";
      if (m === "POST") return "#10b981";
      if (m === "PATCH") return "#f59e0b";
      if (m === "DELETE") return "#f87171";
      return "#4b5563";
    }
    function SortTh({ col, label }) {
      const active = sortKey === col;
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "th",
        {
          onClick: () => handleSort(col),
          style: {
            padding: "6px 8px",
            textAlign: "left",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: active ? "#a78bfa" : "#4b5563",
            cursor: "pointer",
            userSelect: "none",
            whiteSpace: "nowrap",
            borderBottom: "1px solid rgba(255,255,255,.06)",
            background: "#0a0c14"
          },
          children: [
            label,
            active ? sortAsc ? " \u2191" : " \u2193" : ""
          ]
        }
      );
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 8 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 9.5, color: "#374151", fontWeight: 700, letterSpacing: "0.06em", marginBottom: 6 }, children: [
        "IMPORT CANDIDATES (",
        candidates.length,
        ") \u2014 click a row to select"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { overflowX: "auto", overflowY: "auto", maxHeight: 320, borderRadius: 8, border: "1px solid rgba(255,255,255,.06)" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { style: { width: "100%", borderCollapse: "collapse", tableLayout: "auto", minWidth: 640 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { style: { position: "sticky", top: 0, zIndex: 2 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { style: { width: 18, padding: "6px 6px 6px 8px", background: "#0a0c14", borderBottom: "1px solid rgba(255,255,255,.06)" } }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, { col: "score", label: "SCORE" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, { col: "method", label: "METHOD" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, { col: "url", label: "ENDPOINT" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, { col: "tag", label: "TAG" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, { col: "statusCode", label: "STATUS" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, { col: "payloadSize", label: "SIZE" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortTh, { col: "capturedAt", label: "CAPTURED" })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: sorted.map((c) => {
          const isSelected = selectedCandidate?.id === c.id;
          const isExpanded = expandedRowId === c.id;
          const urlObj = (() => {
            try {
              return new URL(c.url);
            } catch {
              return null;
            }
          })();
          const safeUrl = c.url ?? "";
          const pathShort = urlObj ? urlObj.pathname.slice(0, 52) + (urlObj.pathname.length > 52 ? "\u2026" : "") : safeUrl.slice(0, 52);
          const domain = urlObj?.hostname ?? "";
          const timeStr = c.capturedAt ? new Date(c.capturedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "\u2014";
          const bodyPreview = c.requestBody ? (() => {
            try {
              const parsed = JSON.parse(c.requestBody);
              const keys = Object.keys(parsed);
              return `{${keys.slice(0, 5).join(", ")}${keys.length > 5 ? ", \u2026" : ""}}`;
            } catch {
              return c.requestBody.slice(0, 60) + (c.requestBody.length > 60 ? "\u2026" : "");
            }
          })() : "\u2014";
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "tr",
              {
                "data-testid": `candidate-${c.id.slice(0, 8)}`,
                onClick: () => onSelect(isSelected ? null : c),
                style: {
                  cursor: "pointer",
                  background: isSelected ? "rgba(99,102,241,.12)" : isExpanded ? "rgba(255,255,255,.03)" : "transparent",
                  borderBottom: "1px solid rgba(255,255,255,.04)",
                  transition: "background .1s"
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "7px 6px 7px 8px", textAlign: "center", verticalAlign: "middle" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    margin: "0 auto",
                    background: isSelected ? "#6366f1" : "transparent",
                    border: `2px solid ${isSelected ? "#6366f1" : "#374151"}`,
                    transition: "all .15s"
                  } }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "7px 8px", verticalAlign: "middle", textAlign: "center" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
                    display: "inline-block",
                    minWidth: 30,
                    textAlign: "center",
                    fontSize: 11,
                    fontWeight: 800,
                    color: scoreColor(c.score),
                    background: `${scoreColor(c.score)}18`,
                    borderRadius: 4,
                    padding: "1px 6px"
                  }, children: c.score }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "7px 8px", verticalAlign: "middle" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
                    fontSize: 9,
                    fontWeight: 800,
                    padding: "2px 6px",
                    borderRadius: 4,
                    background: `${methodColor(c.method)}22`,
                    color: methodColor(c.method),
                    fontFamily: "monospace"
                  }, children: c.method }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { style: { padding: "7px 8px", verticalAlign: "middle", maxWidth: 260 }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 9, color: "#4b5563", marginBottom: 1 }, children: domain }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 10, color: "#d1d5db", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, title: c.url, children: pathShort })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "7px 8px", verticalAlign: "middle" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
                    fontSize: 8.5,
                    fontWeight: 700,
                    padding: "2px 5px",
                    borderRadius: 4,
                    background: `${TAG_COLORS[c.tag] ?? "#4b5563"}22`,
                    color: TAG_COLORS[c.tag] ?? "#9ca3af",
                    whiteSpace: "nowrap"
                  }, children: c.tag }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "7px 8px", verticalAlign: "middle", textAlign: "center" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
                    fontSize: 10,
                    fontWeight: 700,
                    color: !c.statusCode ? "#4b5563" : c.statusCode < 300 ? "#10b981" : c.statusCode < 400 ? "#f59e0b" : "#f87171"
                  }, children: c.statusCode ?? "\u2014" }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "7px 8px", verticalAlign: "middle", whiteSpace: "nowrap" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 10, color: "#6b7280" }, children: fmt(c.payloadSize) }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { style: { padding: "7px 8px", verticalAlign: "middle", whiteSpace: "nowrap" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 9, color: "#374151", fontFamily: "monospace" }, children: timeStr }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "button",
                      {
                        "data-testid": `btn-expand-row-${c.id.slice(0, 8)}`,
                        onClick: (e) => {
                          e.stopPropagation();
                          setExpandedRowId(isExpanded ? null : c.id);
                        },
                        title: isExpanded ? "Collapse details" : "Expand details",
                        style: { background: "none", border: "none", cursor: "pointer", padding: "1px 3px", color: isExpanded ? "#6366f1" : "#374151", fontSize: 9, lineHeight: 1 },
                        children: isExpanded ? "\u25B2" : "\u25BC"
                      }
                    )
                  ] }) })
                ]
              }
            ),
            (isSelected || isExpanded) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { style: { background: "rgba(99,102,241,.05)" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { colSpan: 8, style: { padding: "10px 16px 12px", borderBottom: "1px solid rgba(255,255,255,.06)" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 24, flexWrap: "wrap" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: "0 0 auto" }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 9, color: "#4b5563", fontWeight: 700, marginBottom: 5, letterSpacing: ".05em" }, children: "SCORE BREAKDOWN" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 3 }, children: Object.entries(c.scoreBreakdown ?? {}).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 9, color: "#6b7280", width: 60, flexShrink: 0 }, children: k }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { flex: 1, background: "rgba(255,255,255,.04)", borderRadius: 2, height: 4, minWidth: 80 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: `${Math.min(100, v * 5)}%`, height: 4, background: "#6366f1", borderRadius: 2 } }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 9, color: "#9ca3af", width: 20, textAlign: "right" }, children: v })
                ] }, k)) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1, minWidth: 200 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 9, color: "#4b5563", fontWeight: 700, marginBottom: 5, letterSpacing: ".05em" }, children: "REQUEST BODY KEYS" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 9.5, color: "#9ca3af", fontFamily: "monospace", wordBreak: "break-all", lineHeight: 1.6 }, children: bodyPreview })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: "0 0 auto" }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 9, color: "#4b5563", fontWeight: 700, marginBottom: 5, letterSpacing: ".05em" }, children: "CONTENT TYPE" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 9, color: "#9ca3af", fontFamily: "monospace" }, children: c.contentType || "\u2014" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 9, color: "#4b5563", fontWeight: 700, marginTop: 8, marginBottom: 5, letterSpacing: ".05em" }, children: "FULL URL" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 8.5, color: "#6b7280", fontFamily: "monospace", wordBreak: "break-all", maxWidth: 280 }, children: c.url })
              ] })
            ] }) }) })
          ] }, c.id);
        }) })
      ] }) })
    ] });
  }
  function MutationStrategyPanel({
    candidates,
    selectedCandidate,
    onSelect,
    builderTabId,
    lastMutVerified,
    lastMutStatus,
    testResult,
    onTestResult,
    lastMutStrategy,
    lastFetchPath,
    activePasteStrategy,
    onRunTestSection,
    testRunning
  }) {
    const [open, setOpen] = (0, import_react.useState)(true);
    const isTier1 = !!selectedCandidate;
    const confColor = isTier1 ? selectedCandidate.score >= 70 ? "#10b981" : selectedCandidate.score >= 45 ? "#f59e0b" : "#f87171" : "#f59e0b";
    const priority = isTier1 ? candidatePriority(selectedCandidate.url) : 0;
    const priorityLabel = priority >= 1e3 ? "prebuilt-section (highest)" : priority >= 800 ? "autosave" : priority >= 600 ? "element-template" : priority >= 400 ? "global-sections" : "scored candidate";
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { padding: "16px 20px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: open ? 12 : 0 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Mutation Strategy" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setOpen(!open), style: { background: "none", border: "none", cursor: "pointer", fontSize: 10, color: "#4b5563" }, children: open ? "\u25B2" : "\u25BC" })
      ] }),
      open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 14, padding: "10px 12px", background: "#0d0f17", borderRadius: 8, border: `1px solid ${isTier1 ? "rgba(167,139,250,.2)" : "rgba(255,255,255,.05)"}` }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "flex-start", gap: 8 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 9, padding: "2px 7px", borderRadius: 4, background: isTier1 ? "rgba(167,139,250,.15)" : "rgba(99,102,241,.1)", color: isTier1 ? "#c4b5fd" : "#818cf8", fontWeight: 700, flexShrink: 0, marginTop: 1 }, children: isTier1 ? "TIER 1" : "TIER 2" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, fontWeight: 700, color: isTier1 ? "#c4b5fd" : "#818cf8", fontFamily: "monospace", wordBreak: "break-all", lineHeight: 1.5 }, children: isTier1 ? `${selectedCandidate.method} ${selectedCandidate.url}` : "Content script DOM injection (React fiber + clipboard)" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 12, flexWrap: "wrap", fontSize: 10 }, children: [
            isTier1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: "#4b5563" }, children: [
                "Score: ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: confColor, fontWeight: 700 }, children: selectedCandidate.score })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: "#4b5563" }, children: [
                "Type: ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "#9ca3af" }, children: selectedCandidate.tag })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: "#4b5563" }, children: [
                "Priority: ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "#a78bfa" }, children: priorityLabel })
              ] }),
              selectedCandidate.statusCode != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: "#4b5563" }, children: [
                "Captured: ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: selectedCandidate.statusCode < 300 ? "#10b981" : "#f87171" }, children: selectedCandidate.statusCode })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: "#4b5563" }, children: [
                "Size: ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "#9ca3af" }, children: fmt(selectedCandidate.payloadSize) })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: "#4b5563" }, children: [
              "Verified: ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: lastMutVerified ? "#10b981" : "#f87171", fontWeight: 700 }, children: lastMutVerified ? `YES (${lastMutStatus})` : "NO" })
            ] }),
            !isTier1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: "#4b5563" }, children: [
              "Source: ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "#9ca3af" }, children: "Built-in fallback" })
            ] })
          ] }),
          isTier1 && (() => {
            const sc = candidates.find((c) => c.id === selectedCandidate.id) ?? selectedCandidate;
            const resolvedUrl = sc.url ?? sc.fullUrl ?? sc.endpoint ?? "";
            const resolvedMethod = sc.method ?? "";
            const hasBody = !!(sc.requestBody ?? sc.body);
            const replayable = !!resolvedUrl && !!resolvedMethod;
            const foundInArr = candidates.some((c) => c.id === sc.id);
            const capturedHeaders = {
              ...sc.requestHeaders ?? {},
              ...sc.headers ?? {}
            };
            const hCount = Object.keys(capturedHeaders).length;
            const authKeys = ["authorization", "token", "x-location-id", "x-user-id", "x-source", "cookie"];
            const presentAuth = authKeys.filter((k) => k in capturedHeaders);
            const hasAuth = presentAuth.length > 0;
            const aps = activePasteStrategy;
            const apsOk = aps.type === "learned-mutation-replay";
            const rows = [
              // ── Execution strategy ─────────────────────────────────────
              ["\u2500\u2500\u2500 NEXT EXECUTION \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", ""],
              ["strategy type", aps.type, !apsOk, apsOk],
              ["executor", aps.executor],
              ["candidateId", aps.candidateId ?? "none (DOM inject)"],
              ["method", aps.method ?? "N/A"],
              ["fullUrl", aps.fullUrl ?? "N/A"],
              ["headers", `${aps.headerCount} captured`],
              ["replayable", aps.replayable ? "YES \u2713" : "NO \u2014 missing url or method", !aps.replayable, aps.replayable],
              ["replay channel", apsOk ? "main-world \u2192 content-script \u2192 sw" : "N/A (DOM injection)"],
              ["strict fallback", apsOk ? "BLOCKED \u2014 no silent downgrade" : "N/A"],
              // ── Last execution (if any) ──────────────────────────────
              ...lastMutStrategy ? [
                ["\u2500\u2500\u2500 LAST EXECUTION \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", ""],
                [
                  "strategy used",
                  lastMutStrategy,
                  lastMutStrategy === "content-script-inject" && isTier1,
                  lastMutStrategy === "learned-mutation-replay"
                ],
                ...lastFetchPath ? [[
                  "fetch channel",
                  lastFetchPath,
                  lastFetchPath === "service-worker-error",
                  lastFetchPath === "main-world"
                ]] : []
              ] : [],
              // ── Raw candidate fields ──────────────────────────────────
              // (url, method, candidateId already shown above via activePasteStrategy)
              ["\u2500\u2500\u2500 CANDIDATE (raw store) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", ""],
              ["found in registry", foundInArr ? "YES \u2713" : "NO (re-run Learn)", !foundInArr, foundInArr],
              ["requestBody", hasBody ? `YES (${fmt((sc.requestBody ?? sc.body ?? "").length)})` : "NO (empty)"],
              ["auth headers", hasAuth ? `YES \u2014 ${presentAuth.join(", ")}` : "NONE \u2014 replay may 401", !hasAuth, hasAuth],
              ["score", `${sc.score} \xB7 ${sc.tag}`]
            ];
            return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 8, padding: "7px 10px", background: "#080b12", borderRadius: 6, border: "1px solid rgba(255,255,255,.06)", fontSize: 9, fontFamily: "monospace" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { color: "#4b5563", fontWeight: 700, letterSpacing: ".06em", marginBottom: 5 }, children: "ACTIVE STRATEGY DEBUG \u2014 source: activePasteStrategy (canonical)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 10, rowGap: 2 }, children: rows.map(([k, v, isWarn, isOk]) => {
                if (k.startsWith("\u2500\u2500\u2500")) {
                  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { gridColumn: "1 / -1", color: "#1f2937", marginTop: 4, marginBottom: 1, fontSize: 8, letterSpacing: ".08em" }, children: k.replace(/─/g, "").trim() }) }, k);
                }
                const color = isWarn ? "#f87171" : isOk ? "#10b981" : "#9ca3af";
                return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: "#374151" }, children: [
                    k,
                    ":"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color }, children: v })
                ] }, k);
              }) })
            ] });
          })(),
          isTier1 && builderTabId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 6, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,.04)" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 10, color: "#6b7280", marginBottom: 6 }, children: "Safe test: sends one minimal section to validate the endpoint before full paste." }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  onClick: onRunTestSection,
                  disabled: testRunning,
                  "data-testid": "btn-test-section-via-candidate",
                  style: { fontSize: 11, padding: "5px 14px", borderRadius: 7, border: "1px solid rgba(16,185,129,.3)", background: "rgba(16,185,129,.08)", color: "#10b981", cursor: testRunning ? "wait" : "pointer", opacity: testRunning ? 0.6 : 1, fontWeight: 600 },
                  children: testRunning ? "Sending\u2026" : "\u25B6 Insert Test Section via Candidate"
                }
              ),
              testResult && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 10, color: testResult.ok ? "#10b981" : "#f87171", fontWeight: 700 }, children: [
                testResult.ok ? `\u2713 ${testResult.status}` : `\u2717 ${testResult.status || "err"}`,
                (Number(testResult.sectionsDelta) || 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: "#10b981" }, children: [
                  " +",
                  Number(testResult.sectionsDelta) || 0,
                  " sections"
                ] })
              ] })
            ] }),
            testResult && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 8, padding: "8px 10px", background: "#080b12", borderRadius: 6, border: `1px solid ${testResult.ok ? "rgba(16,185,129,.15)" : "rgba(248,113,113,.15)"}` }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 14, flexWrap: "wrap", fontSize: 10, marginBottom: testResult.responseBodyPreview ? 6 : 0 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: "#4b5563" }, children: [
                  "URL: ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "#9ca3af", fontFamily: "monospace", fontSize: 9 }, children: (testResult.candidateUrl ?? "").split("/").slice(-3).join("/") || "unknown" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: "#4b5563" }, children: [
                  "Method: ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "#9ca3af" }, children: testResult.candidateMethod ?? "\u2014" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: "#4b5563" }, children: [
                  "Body: ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "#9ca3af" }, children: fmt(testResult.requestBodySize) })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: "#4b5563" }, children: [
                  "Status: ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: testResult.ok ? "#10b981" : "#f87171", fontWeight: 700 }, children: testResult.status || "error" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: "#4b5563" }, children: [
                  "Response: ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "#9ca3af" }, children: fmt(testResult.responseSize) })
                ] }),
                (() => {
                  const sBefore = Number(testResult.sectionsBefore) || 0;
                  const sDelta = Number(testResult.sectionsDelta) || 0;
                  const sAfter = sBefore + sDelta;
                  if (sDelta === 0) return null;
                  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: "#4b5563" }, children: [
                    "Sections: ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: sDelta > 0 ? "#10b981" : "#f87171", fontWeight: 700 }, children: [
                      sBefore,
                      " \u2192 ",
                      sAfter,
                      " (",
                      sDelta > 0 ? "+" : "",
                      sDelta,
                      ")"
                    ] })
                  ] });
                })(),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: "#4b5563" }, children: [
                  "Verified: ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: testResult.verified ? "#10b981" : "#f87171", fontWeight: 700 }, children: testResult.verified ? "YES" : "NO" })
                ] }),
                testResult.fetchPath && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: "#4b5563" }, children: [
                  "Path: ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
                    color: testResult.fetchPath === "main-world" ? "#10b981" : testResult.fetchPath === "content-script" ? "#f59e0b" : "#f87171",
                    fontWeight: 700,
                    fontFamily: "monospace",
                    fontSize: 9
                  }, children: testResult.fetchPath })
                ] })
              ] }),
              testResult.responseBodyPreview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { style: { margin: 0, fontSize: 9, color: "#4b5563", fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all", maxHeight: 80, overflow: "auto" }, children: testResult.responseBodyPreview.slice(0, 300) }),
              testResult.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 10, color: "#f87171", marginTop: 4 }, children: [
                "\u2717 ",
                testResult.error
              ] })
            ] })
          ] })
        ] }),
        candidates.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          CandidateTable,
          {
            candidates,
            selectedCandidate,
            onSelect
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 11, color: "#374151", lineHeight: 1.6, padding: "8px 0" }, children: [
          "No import candidates recorded. Use ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { style: { color: "#a78bfa" }, children: "Learn Import Path" }),
          " below to discover real HighLevel mutation endpoints."
        ] })
      ] })
    ] });
  }
  var ACTION_LABELS = {
    "add-section": "Add Section",
    "duplicate-section": "Duplicate Section",
    "duplicate-page": "Duplicate Page",
    "delete-section": "Delete Section",
    "edit-text-autosave": "Edit Text + Autosave",
    "publish": "Publish",
    "other": "Other"
  };
  var ACTION_HINTS = {
    "add-section": "Click \uFF0B Add Section in the HL builder",
    "duplicate-section": "Right-click a section \u2192 Duplicate",
    "duplicate-page": "Open Pages panel \u2192 Duplicate a page",
    "delete-section": "Right-click a section \u2192 Delete",
    "edit-text-autosave": "Click any text element and edit it \u2014 wait for autosave",
    "publish": "Click the Publish button in the builder",
    "other": "Perform any builder action"
  };
  async function detectBuilderFrame(tabId) {
    try {
      const frames = await chrome.webNavigation.getAllFrames({ tabId });
      if (!frames || frames.length === 0) return null;
      const BUILDER_URL_RE = /page-builder|funnel-builder|builder|funnels|pages\/edit|\/editor\//i;
      const HL_DOMAIN_RE2 = /gohighlevel\.com|leadconnectorhq\.com|msgsndr\.com|highlevel\.com|app\.ghl\.io/i;
      const NOISE_RE = /analytics|tracking|widget|chat-widget|crisp|intercom|zendesk|hotjar|cdn\.|assets\.|fonts\./i;
      let best = null;
      for (const frame of frames) {
        if (frame.frameId === 0) continue;
        const url = frame.url ?? "";
        if (!url || url === "about:blank" || url.startsWith("chrome-extension://")) continue;
        let score = 0;
        let reason = "";
        if (HL_DOMAIN_RE2.test(url)) {
          score += 10;
          reason += "hl-domain ";
        }
        if (BUILDER_URL_RE.test(url)) {
          score += 15;
          reason += "builder-url ";
        }
        if (NOISE_RE.test(url)) {
          score -= 25;
          reason += "noise ";
        }
        if (frame.parentFrameId === 0) {
          score += 5;
          reason += "direct-child ";
        }
        if (score > (best?.score ?? -999)) {
          best = { frameId: frame.frameId, url, score, reason: reason.trim() };
        }
      }
      return best && best.score >= 5 ? best : null;
    } catch {
      return null;
    }
  }
  function _watcherFunc() {
    if (window.__cl_watch_active) return "already_active";
    const watched = [];
    let mutations = 0;
    function extractHeaders(h) {
      const out = {};
      try {
        if (!h) return out;
        if (typeof h.entries === "function") {
          for (const [k, v] of h.entries()) {
            out[k.toLowerCase()] = v;
          }
        } else if (Array.isArray(h)) {
          for (const [k, v] of h) {
            out[k.toLowerCase()] = v;
          }
        } else if (typeof h === "object") {
          for (const k of Object.keys(h)) {
            out[k.toLowerCase()] = h[k];
          }
        }
      } catch {
      }
      return out;
    }
    try {
      const target = document.body ?? document.documentElement;
      if (target) {
        new MutationObserver(() => {
          mutations++;
        }).observe(target, { subtree: true, childList: true, attributes: false, characterData: false });
      }
    } catch {
    }
    try {
      const orig = window.fetch.bind(window);
      window.fetch = function(input, init) {
        try {
          const url = typeof input === "string" ? input : input?.url ?? String(input);
          const method = ((init?.method ?? input?.method ?? "GET") + "").toUpperCase();
          let body = "";
          try {
            body = typeof init?.body === "string" ? init.body.slice(0, 2e4) : "";
          } catch {
          }
          const headers = extractHeaders(init?.headers ?? input?.headers);
          watched.push({ url, method, body, headers, ts: Date.now(), source: "fetch" });
        } catch {
        }
        return orig(input, init);
      };
    } catch {
    }
    try {
      const oOpen = window.XMLHttpRequest.prototype.open;
      const oSend = window.XMLHttpRequest.prototype.send;
      const oSetHeader = window.XMLHttpRequest.prototype.setRequestHeader;
      window.XMLHttpRequest.prototype.open = function(m, u) {
        this.__cl_m = m.toUpperCase();
        this.__cl_u = u;
        this.__cl_h = {};
        return oOpen.apply(this, arguments);
      };
      window.XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
        try {
          if (this.__cl_h) this.__cl_h[name.toLowerCase()] = value;
        } catch {
        }
        return oSetHeader.apply(this, arguments);
      };
      window.XMLHttpRequest.prototype.send = function(body) {
        try {
          if (this.__cl_u) {
            watched.push({
              url: this.__cl_u,
              method: this.__cl_m ?? "POST",
              body: typeof body === "string" ? body.slice(0, 2e4) : "",
              headers: this.__cl_h ?? {},
              ts: Date.now(),
              source: "xhr"
            });
          }
        } catch {
        }
        return oSend.apply(this, arguments);
      };
    } catch {
    }
    window.__cl_watch = { requests: watched, get mutations() {
      return mutations;
    } };
    window.__cl_watch_active = true;
    return "injected";
  }
  async function injectNetworkWatcher(tabId, frameId) {
    const parts = [];
    try {
      const topRes = await chrome.scripting.executeScript({
        target: { tabId, allFrames: false },
        world: "MAIN",
        func: _watcherFunc
      });
      parts.push(`top:${topRes?.[0]?.result ?? "?"}`);
    } catch (e) {
      parts.push(`top:error:${String(e).slice(0, 40)}`);
    }
    if (frameId != null) {
      try {
        const fRes = await chrome.scripting.executeScript({
          target: { tabId, frameIds: [frameId] },
          world: "MAIN",
          func: _watcherFunc
        });
        parts.push(`frame:${fRes?.[0]?.result ?? "?"}`);
      } catch (e) {
        parts.push(`frame:error:${String(e).slice(0, 40)}`);
      }
    }
    return parts.join(" | ");
  }
  async function readWatcherResults(tabId, frameId) {
    const readFunc = () => {
      const w = window.__cl_watch;
      if (!w) return null;
      return { requests: [...w.requests], mutations: w.mutations };
    };
    try {
      const topRes = await chrome.scripting.executeScript({
        target: { tabId, allFrames: false },
        world: "MAIN",
        func: readFunc
      });
      const topData = topRes?.[0]?.result;
      let frameData = null;
      if (frameId != null) {
        try {
          const fRes = await chrome.scripting.executeScript({
            target: { tabId, frameIds: [frameId] },
            world: "MAIN",
            func: readFunc
          });
          frameData = fRes?.[0]?.result;
        } catch {
        }
      }
      const merged = [
        ...(topData?.requests ?? []).map((r) => ({ ...r, source: `top:${r.source}` })),
        ...(frameData?.requests ?? []).map((r) => ({ ...r, source: `frame:${r.source}` }))
      ];
      return {
        requests: merged,
        mutations: (topData?.mutations ?? 0) + (frameData?.mutations ?? 0),
        iframeLabel: frameData != null ? `frame:${frameId}` : topData != null ? "top-only" : "none",
        iframeCount: frameId != null ? 1 : 0
      };
    } catch {
      return null;
    }
  }
  function _runtimeDiscoverFunc() {
    const LAYOUT_KEYS = ["sections", "rows", "columns", "elements", "layout", "page", "funnel", "steps", "blocks", "nodes"];
    const DISPATCH_NAMES = ["dispatch", "setState", "setPage", "setSections", "addSection", "duplicateSection", "patchPage", "autosave", "save", "update", "publish", "commit"];
    const STORE_NAMES = ["store", "state", "reducer", "editor", "builder", "funnel", "page", "app"];
    const result = {
      reactRoots: 0,
      storeCandidates: [],
      dispatchCandidates: [],
      sectionCount: 0,
      rowCount: 0,
      elementCount: 0,
      rawGlobals: []
    };
    try {
      const sels = ["[data-type='section']", "[data-section]", "section", "[class*='section']"];
      let mx = 0;
      for (const s of sels) {
        try {
          mx = Math.max(mx, document.querySelectorAll(s).length);
        } catch {
        }
      }
      result.sectionCount = mx;
      result.rowCount = document.querySelectorAll("[data-type='row'], [data-row], [class*='row-wrap']").length;
      result.elementCount = document.querySelectorAll("p, h1, h2, h3, h4, img, a, button, input").length;
    } catch {
    }
    try {
      for (const el of document.querySelectorAll("[data-reactroot], #root, #app, #builder, #funnel-builder")) {
        const k = Object.keys(el).find((k2) => k2.startsWith("__reactFiber") || k2.startsWith("__reactContainer") || k2.startsWith("__reactInternalInstance"));
        if (k) result.reactRoots++;
      }
    } catch {
    }
    try {
      const gKeys = Object.getOwnPropertyNames(window).slice(0, 300);
      const NOISE = /* @__PURE__ */ new Set(["length", "window", "self", "top", "parent", "frames", "location", "document", "navigator", "screen", "history", "crypto", "performance", "console", "fetch", "XMLHttpRequest", "localStorage", "sessionStorage", "alert", "confirm", "prompt", "setTimeout", "setInterval", "clearTimeout", "clearInterval", "requestAnimationFrame", "cancelAnimationFrame", "addEventListener", "removeEventListener", "dispatchEvent", "postMessage", "close", "focus", "blur", "print"]);
      result.rawGlobals = gKeys.filter((k) => !NOISE.has(k) && !k.startsWith("_") && !k.startsWith("webkit")).slice(0, 60);
      for (const key of gKeys.slice(0, 200)) {
        try {
          const val = window[key];
          if (val == null) continue;
          if (typeof val === "function" && DISPATCH_NAMES.some((n) => key.toLowerCase().includes(n.toLowerCase()))) {
            result.dispatchCandidates.push({ path: `window.${key}`, name: key, type: "dispatch", confidence: 70, keyPreview: [], hasSections: false, hasRows: false, hasElements: false });
            continue;
          }
          if (typeof val !== "object") continue;
          if (typeof val.getState === "function" && typeof val.dispatch === "function") {
            try {
              const st = val.getState() ?? {};
              const stKeys = Object.keys(st);
              result.storeCandidates.push({ path: `window.${key}`, type: "store", confidence: 90, keyPreview: stKeys.slice(0, 8), hasSections: stKeys.some((k) => k.toLowerCase().includes("section")), hasRows: stKeys.some((k) => k.toLowerCase().includes("row")), hasElements: stKeys.some((k) => k.toLowerCase().includes("element")) });
              result.dispatchCandidates.push({ path: `window.${key}.dispatch`, name: "dispatch", type: "dispatch", confidence: 90, keyPreview: [], hasSections: false, hasRows: false, hasElements: false });
            } catch {
            }
            continue;
          }
          const keys = Object.keys(val).slice(0, 30);
          const hasSects = keys.some((k) => LAYOUT_KEYS.some((lk) => k.toLowerCase().includes(lk)));
          const isStoreName = STORE_NAMES.some((n) => key.toLowerCase().includes(n.toLowerCase()));
          if (hasSects || isStoreName) {
            result.storeCandidates.push({ path: `window.${key}`, type: "store", confidence: (hasSects ? 60 : 30) + (isStoreName ? 20 : 0), keyPreview: keys.slice(0, 8), hasSections: keys.some((k) => k.toLowerCase().includes("section")), hasRows: keys.some((k) => k.toLowerCase().includes("row")), hasElements: keys.some((k) => k.toLowerCase().includes("element")) });
          }
          for (const [sub, subVal] of Object.entries(val)) {
            if (typeof subVal === "function" && DISPATCH_NAMES.some((n) => sub.toLowerCase().includes(n.toLowerCase()))) {
              result.dispatchCandidates.push({ path: `window.${key}.${sub}`, name: sub, type: "dispatch", confidence: 50, keyPreview: [], hasSections: false, hasRows: false, hasElements: false });
            }
          }
        } catch {
        }
      }
    } catch {
    }
    return result;
  }
  async function runRuntimeDiscovery(tabId, frameId, frameUrl) {
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId, frameIds: [frameId] },
        world: "MAIN",
        func: _runtimeDiscoverFunc
      });
      const raw = results?.[0]?.result;
      if (!raw) return null;
      return { frameId, frameUrl, ...raw };
    } catch {
      return null;
    }
  }
  function _insertTestSectionFunc() {
    const TS = { id: `cl_test_${Date.now()}`, type: "section", name: "CloneLevel Test", rows: [] };
    const ACTIONS = ["ADD_SECTION", "SECTION_ADD", "builder/addSection", "page/addSection", "addSection"];
    for (const key of Object.getOwnPropertyNames(window).slice(0, 200)) {
      try {
        const v = window[key];
        if (!v || typeof v !== "object") continue;
        if (typeof v.dispatch === "function" && typeof v.getState === "function") {
          for (const act of ACTIONS) {
            try {
              v.dispatch({ type: act, payload: TS });
            } catch {
            }
          }
          return { tried: true, path: `window.${key}.dispatch`, strategies: ACTIONS };
        }
      } catch {
      }
    }
    for (const fn of ["dispatch", "addSection", "setState", "setPage"]) {
      try {
        if (typeof window[fn] === "function") {
          window[fn]({ type: "ADD_SECTION", payload: TS });
          return { tried: true, path: `window.${fn}`, strategies: [fn] };
        }
      } catch {
      }
    }
    return { tried: false, path: "none", strategies: [], error: "no dispatch handle found" };
  }
  async function runInsertTestSection(tabId, frameId) {
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId, frameIds: [frameId] },
        world: "MAIN",
        func: _insertTestSectionFunc
      });
      return results?.[0]?.result ?? { tried: false, path: "none", strategies: [], error: "no result" };
    } catch (e) {
      return { tried: false, path: "none", strategies: [], error: String(e).slice(0, 100) };
    }
  }
  var HL_DOMAIN_RE = /gohighlevel\.com|leadconnectorhq\.com|highlevel\.com|msgsndr\.com|app\.ghl\.io/;
  var BLOCKED_DOMAIN_RE = /requestmetrics|google-analytics|googletagmanager|analytics\.google|mixpanel|amplitude|segment\.io|intercom|hotjar|fullstory|heap\.io|sentry\.io|datadog|newrelic|pingdom|rollbar|logrocket|cloudflare|jsdelivr|unpkg\.com|cdnjs|jquery\.com|bootstrap\.com|fontawesome|facebook\.com|twitter\.com|linkedin\.com|doubleclick|googlesyndication|adsystem|chartbeat|quantserve|comscore|krxd\.net|blueshift|braze\.com|klaviyo|hubspot|salesforce|zendesk|drift\.com|tawk\.to|freshchat|crisp\.chat|olark/;
  function scoreWatcherRequest(url, method, body, actionType) {
    const u = url.toLowerCase();
    const m = method.toUpperCase();
    const pts = { hl: 0, method: 0, path: 0, body: 0, action: 0 };
    if (!HL_DOMAIN_RE.test(u)) {
      return { score: 0, tag: "NON_HL_SKIP", breakdown: pts };
    }
    if (BLOCKED_DOMAIN_RE.test(u)) {
      return { score: 0, tag: "BLOCKED_DOMAIN_SKIP", breakdown: pts };
    }
    pts.hl = 30;
    if (m === "POST") pts.method = 25;
    else if (m === "PUT" || m === "PATCH") pts.method = 20;
    else return { score: 0, tag: "GET_SKIP", breakdown: pts };
    const pathKws = [
      "funnels",
      "funnel",
      "page",
      "pages",
      "builder",
      "section",
      "element",
      "autosave",
      "save",
      "update",
      "create",
      "duplicate",
      "import",
      "template",
      "publish",
      "clone",
      "step"
    ];
    const pathHits = pathKws.filter((k) => u.includes(k));
    pts.path = Math.min(pathHits.length * 5, 20);
    if (body && body.length > 10) {
      pts.body = 5;
      try {
        const parsed = JSON.parse(body);
        if (parsed && typeof parsed === "object") {
          const keyStr = Object.keys(parsed).join(" ").toLowerCase();
          const bodyKws = [
            "sections",
            "elements",
            "content",
            "layout",
            "page",
            "funnel",
            "html",
            "css",
            "templateId",
            "pageId",
            "funnelId",
            "steps"
          ];
          pts.body += Math.min(bodyKws.filter((k) => keyStr.includes(k)).length * 3, 15);
        }
      } catch {
      }
    }
    const actionBonus = {
      "add-section": ["section", "element", "add", "create", "insert"],
      "duplicate-section": ["duplicate", "copy", "clone", "section"],
      "duplicate-page": ["duplicate", "copy", "clone", "page", "step"],
      "delete-section": ["delete", "remove", "section"],
      "edit-text-autosave": ["autosave", "save", "update", "text", "content", "patch"],
      "publish": ["publish", "deploy", "live", "release"],
      "other": []
    };
    const bonusHits = (actionBonus[actionType] ?? []).filter((k) => u.includes(k));
    pts.action = Math.min(bonusHits.length * 8, 20);
    const total = Object.values(pts).reduce((a, b) => a + b, 0);
    let tag = "UPDATE_CANDIDATE";
    if (/duplicate|copy|clone/.test(u)) tag = "DUPLICATE_CANDIDATE";
    else if (/import|template/.test(u)) tag = "IMPORT_CANDIDATE";
    else if (/create|\/new|\/add/.test(u)) tag = "CREATE_CANDIDATE";
    else if (/publish|deploy/.test(u)) tag = "PUBLISH_CANDIDATE";
    else if (/autosave|\/save/.test(u)) tag = "SAVE_CANDIDATE";
    return { score: Math.min(total, 100), tag, breakdown: pts };
  }
  function truncateJson(str, maxLen = 500) {
    if (!str) return "";
    let pretty = str;
    try {
      pretty = JSON.stringify(JSON.parse(str), null, 2);
    } catch {
    }
    return pretty.length > maxLen ? pretty.slice(0, maxLen) + "\n\u2026" : pretty;
  }
  function ActionTypeSelector({
    selected,
    onChange
  }) {
    const types = ["add-section", "duplicate-section", "duplicate-page", "delete-section", "edit-text-autosave", "publish", "other"];
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 10, fontWeight: 700, color: "#4b5563", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }, children: "What action will you perform?" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 }, children: types.map((t) => {
        const active = selected === t;
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            onClick: () => onChange(t),
            "data-testid": `action-type-${t}`,
            style: {
              padding: "5px 11px",
              borderRadius: 20,
              fontSize: 10.5,
              fontWeight: 600,
              cursor: "pointer",
              border: `1px solid ${active ? "rgba(167,139,250,.6)" : "rgba(255,255,255,.08)"}`,
              background: active ? "rgba(167,139,250,.15)" : "rgba(255,255,255,.02)",
              color: active ? "#c4b5fd" : "#6b7280",
              transition: "all .12s"
            },
            children: ACTION_LABELS[t]
          },
          t
        );
      }) })
    ] });
  }
  function LearnPhaseBar({ phase }) {
    const phases = [
      { key: "phase1_baseline", label: "Baseline", duration: "2s" },
      { key: "phase2_watching", label: "Watching", duration: "20s" },
      { key: "phase3_verifying", label: "Verifying", duration: "15s" }
    ];
    const order = ["phase1_baseline", "phase2_watching", "phase3_verifying"];
    const currentIdx = order.indexOf(phase);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 0, marginBottom: 16 }, children: phases.map((p, i) => {
      const done = currentIdx > i;
      const active = currentIdx === i;
      const color = done ? "#10b981" : active ? "#a78bfa" : "#374151";
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: 4 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
            width: 22,
            height: 22,
            borderRadius: "50%",
            flexShrink: 0,
            background: done ? "#10b981" : active ? "#a78bfa" : "#1a1d27",
            border: `2px solid ${color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            fontWeight: 800,
            color: done || active ? "#fff" : "#374151",
            boxShadow: active ? `0 0 10px ${color}66` : void 0,
            transition: "all .3s"
          }, children: done ? "\u2713" : i + 1 }),
          i < phases.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { flex: 1, height: 2, background: done ? "#10b981" : "#1a1d27", transition: "background .3s" } })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 9, fontWeight: 600, color: active ? "#c4b5fd" : done ? "#10b981" : "#374151" }, children: [
          p.label,
          " (",
          p.duration,
          ")"
        ] })
      ] }, p.key);
    }) });
  }
  function CandidateCard({
    c,
    rank,
    onSelect,
    onMarkStrategy,
    isStrategy
  }) {
    const [expanded, setExpanded] = (0, import_react.useState)(false);
    const isDispatch = c.source === "runtime-dispatch";
    const scoreColor = isDispatch ? "#a78bfa" : c.score >= 70 ? "#10b981" : c.score >= 45 ? "#f59e0b" : "#f87171";
    const sourceColor = isDispatch ? "#a78bfa" : c.source === "watcher" ? "#22d3ee" : "#818cf8";
    const borderColor = isStrategy ? isDispatch ? "rgba(167,139,250,.6)" : "rgba(167,139,250,.4)" : isDispatch ? "rgba(167,139,250,.25)" : "rgba(255,255,255,.06)";
    const bgColor = isStrategy ? isDispatch ? "rgba(167,139,250,.10)" : "rgba(167,139,250,.06)" : isDispatch ? "rgba(167,139,250,.04)" : "rgba(255,255,255,.01)";
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
      borderRadius: 10,
      border: `1px solid ${borderColor}`,
      background: bgColor,
      overflow: "hidden",
      transition: "border-color .15s"
    }, children: [
      isDispatch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "4px 12px", background: "rgba(139,92,246,.12)", borderBottom: "1px solid rgba(139,92,246,.2)", display: "flex", alignItems: "center", gap: 6 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 10 }, children: "\u26A1" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 9.5, fontWeight: 700, color: "#c4b5fd" }, children: "RUNTIME DISPATCH \u2014 Redux store action (no network, no auth needed)" }),
        c.dispatchStoreType && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 9, color: "#6b7280", marginLeft: "auto" }, children: [
          "store: ",
          c.dispatchStoreType
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "10px 12px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 6, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 10, fontWeight: 800, color: "#1a1d27", background: scoreColor, padding: "1px 6px", borderRadius: 4, flexShrink: 0 }, children: [
            "#",
            rank
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 9, padding: "1px 6px", borderRadius: 4, background: "rgba(255,255,255,.07)", color: "#9ca3af", fontWeight: 700, flexShrink: 0 }, children: c.method }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 9, padding: "1px 6px", borderRadius: 4, background: `${sourceColor}18`, color: sourceColor, fontWeight: 700, flexShrink: 0 }, children: c.source }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 9, padding: "1px 6px", borderRadius: 4, background: "rgba(255,255,255,.04)", color: "#6b7280" }, children: c.tag }),
          c.statusCode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 9, color: c.statusCode < 300 ? "#10b981" : "#f87171" }, children: c.statusCode }),
          isStrategy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 9, padding: "1px 7px", borderRadius: 10, background: "rgba(167,139,250,.2)", color: "#c4b5fd", fontWeight: 700 }, children: "STRATEGY" })
        ] }),
        isDispatch ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontFamily: "monospace", marginBottom: 7 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 10, color: "#6b7280", marginBottom: 2 }, children: "ACTION TYPE" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, color: "#c4b5fd", fontWeight: 700, letterSpacing: ".02em" }, children: c.dispatchActionType ?? "(unknown)" })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 10.5, color: "#d1d5db", fontFamily: "monospace", wordBreak: "break-all", marginBottom: 7, lineHeight: 1.5 }, children: c.url }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { flex: 1, height: 4, background: "#1a1d27", borderRadius: 4, overflow: "hidden" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: `${c.score}%`, height: "100%", background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}cc)`, borderRadius: 4, transition: "width .4s" } }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 10, fontWeight: 800, color: scoreColor, flexShrink: 0 }, children: c.score })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }, children: [
          Object.entries(c.scoreBreakdown).filter(([, v]) => v > 0).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 9, color: "#4b5563" }, children: [
            k,
            ": ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: "#6b7280" }, children: [
              "+",
              v
            ] })
          ] }, k)),
          c.payloadSize != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 9, color: "#4b5563" }, children: [
            "payload: ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "#6b7280" }, children: fmt(c.payloadSize) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              onClick: () => setExpanded(!expanded),
              style: { fontSize: 9.5, padding: "3px 10px", borderRadius: 6, border: "1px solid #2a2d3d", background: "#111318", color: "#6b7280", cursor: "pointer" },
              children: expanded ? "\u25B2 Hide JSON" : "\u25BC View JSON"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              onClick: () => onMarkStrategy(c),
              "data-testid": `btn-mark-strategy-${rank}`,
              style: { fontSize: 9.5, padding: "3px 10px", borderRadius: 6, border: `1px solid ${isStrategy ? "rgba(167,139,250,.5)" : "#2a2d3d"}`, background: isStrategy ? "rgba(167,139,250,.1)" : "#111318", color: isStrategy ? "#c4b5fd" : "#6b7280", cursor: "pointer", fontWeight: isStrategy ? 700 : 400 },
              children: isStrategy ? "\u2605 Strategy" : "\u2606 Use as Strategy"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              onClick: () => onSelect(c),
              "data-testid": `btn-use-paste-${rank}`,
              style: { fontSize: 9.5, padding: "3px 10px", borderRadius: 6, border: "1px solid rgba(99,102,241,.4)", background: "rgba(99,102,241,.08)", color: "#818cf8", cursor: "pointer" },
              children: "\u2191 Use for Paste"
            }
          )
        ] })
      ] }),
      expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { borderTop: "1px solid rgba(255,255,255,.04)", padding: "10px 12px", background: "#06080f" }, children: [
        c.body || c.requestBody ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 9, fontWeight: 700, color: "#374151", letterSpacing: "0.06em", marginBottom: 4 }, children: "REQUEST BODY" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { style: { fontSize: 9.5, color: "#6b7280", margin: 0, overflow: "auto", maxHeight: 120, fontFamily: "monospace", lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-all" }, children: truncateJson(c.body || c.requestBody || "", 600) })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 9, color: "#374151" }, children: "No request body captured" }),
        c.responseBody && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 9, fontWeight: 700, color: "#374151", letterSpacing: "0.06em", marginBottom: 4 }, children: "RESPONSE BODY" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { style: { fontSize: 9.5, color: "#6b7280", margin: 0, overflow: "auto", maxHeight: 100, fontFamily: "monospace", lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-all" }, children: truncateJson(c.responseBody, 400) })
        ] })
      ] })
    ] });
  }
  function LearnHistoryPanel({ onSelectCandidate }) {
    const [sessions, setSessions] = (0, import_react.useState)([]);
    const [open, setOpen] = (0, import_react.useState)(false);
    const [expanded, setExpanded] = (0, import_react.useState)(null);
    (0, import_react.useEffect)(() => {
      msg("GET_LEARN_SESSIONS").then((res) => {
        if (res?.ok && Array.isArray(res.data)) setSessions(res.data);
      });
    }, [open]);
    if (!open) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => setOpen(true), style: { fontSize: 10, padding: "5px 12px", borderRadius: 7, border: "1px solid #2a2d3d", background: "#0d0f17", color: "#4b5563", cursor: "pointer" }, "data-testid": "btn-learn-history", children: [
        "\u{1F4CB} View Learn History (",
        sessions.length === 0 ? "\u2026" : sessions.length,
        ")"
      ] });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { border: "1px solid rgba(255,255,255,.06)", borderRadius: 10, overflow: "hidden" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", background: "#0d0f17", borderBottom: "1px solid rgba(255,255,255,.04)" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 10, fontWeight: 700, color: "#4b5563" }, children: [
          "Learn History (",
          sessions.length,
          ")"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => {
            msg("CLEAR_LEARN_SESSIONS");
            setSessions([]);
          }, style: { fontSize: 9, padding: "2px 8px", borderRadius: 5, border: "1px solid #374151", background: "#1a1d27", color: "#6b7280", cursor: "pointer" }, children: "Clear" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setOpen(false), style: { fontSize: 9, padding: "2px 8px", borderRadius: 5, border: "1px solid #374151", background: "#1a1d27", color: "#6b7280", cursor: "pointer" }, children: "Close" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { maxHeight: 300, overflowY: "auto", padding: "8px 12px", display: "flex", flexDirection: "column", gap: 6 }, children: sessions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, color: "#374151", padding: "12px 0", textAlign: "center" }, children: "No saved sessions" }) : sessions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { borderRadius: 8, border: "1px solid rgba(255,255,255,.05)", overflow: "hidden" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => setExpanded(expanded === s.id ? null : s.id), style: { width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: "#0a0c14", border: "none", cursor: "pointer", textAlign: "left" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 9, padding: "1px 6px", borderRadius: 4, background: "rgba(167,139,250,.12)", color: "#a78bfa", fontWeight: 700, flexShrink: 0 }, children: ACTION_LABELS[s.actionType] ?? s.actionType }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 10, color: "#6b7280", flex: 1 }, children: [
            s.candidateCount,
            " candidate",
            s.candidateCount !== 1 ? "s" : "",
            " \xB7 best: ",
            s.winnerScore
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 9, color: "#4b5563" }, children: new Date(s.completedAt).toLocaleTimeString() }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 9, color: "#374151" }, children: expanded === s.id ? "\u25B2" : "\u25BC" })
        ] }),
        expanded === s.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "8px 10px", background: "#060810", display: "flex", flexDirection: "column", gap: 4 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 9, color: "#4b5563" }, children: [
            "DOM mutations: ",
            s.domMutations,
            " \xB7 DOM changed: ",
            s.domChanged ? "YES \u2713" : "NO"
          ] }),
          s.candidates.slice(0, 4).map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6, padding: "4px 6px", borderRadius: 5, background: "#0d0f17" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 9, fontWeight: 700, color: "#9ca3af", flexShrink: 0 }, children: [
              i + 1,
              "."
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 9, fontFamily: "monospace", color: "#6b7280", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
              c.method,
              " ",
              c.url
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 9, fontWeight: 700, color: c.score >= 60 ? "#10b981" : "#f59e0b", flexShrink: 0 }, children: c.score }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => onSelectCandidate(c), style: { fontSize: 8, padding: "1px 6px", borderRadius: 4, border: "1px solid rgba(99,102,241,.3)", background: "transparent", color: "#818cf8", cursor: "pointer" }, children: "Use" })
          ] }, i))
        ] })
      ] }, s.id)) })
    ] });
  }
  function LearnImportPathPanel({
    builderTabId,
    builderUrl,
    onLearnComplete
  }) {
    const [phase, setPhase] = (0, import_react.useState)("idle");
    const [actionType, setActionType] = (0, import_react.useState)("add-section");
    const [countdown, setCountdown] = (0, import_react.useState)(20);
    const [log, setLog] = (0, import_react.useState)([]);
    const [candidates, setCandidates] = (0, import_react.useState)([]);
    const [strategyId, setStrategyId] = (0, import_react.useState)(null);
    const [domBefore, setDomBefore] = (0, import_react.useState)(null);
    const [domAfter, setDomAfter] = (0, import_react.useState)(null);
    const [mutations, setMutations] = (0, import_react.useState)(0);
    const [watchedCount, setWatchedCount] = (0, import_react.useState)(0);
    const [builderFrame, setBuilderFrame] = (0, import_react.useState)(null);
    const [runtimeDisc, setRuntimeDisc] = (0, import_react.useState)(null);
    const [runtimeCaptures, setRuntimeCaptures] = (0, import_react.useState)(null);
    const [testSecResult, setTestSecResult] = (0, import_react.useState)(null);
    const [testSecRunning, setTestSecRunning] = (0, import_react.useState)(false);
    const timerRef = (0, import_react.useRef)(null);
    const logRef = (0, import_react.useRef)([]);
    const frameRef = (0, import_react.useRef)(null);
    function pushLog(line) {
      logRef.current = [...logRef.current, line];
      setLog([...logRef.current]);
    }
    function clearTimer() {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    (0, import_react.useEffect)(() => () => clearTimer(), []);
    async function startLearning() {
      if (!builderTabId) {
        setPhase("error");
        return;
      }
      setPhase("phase1_baseline");
      setCandidates([]);
      setStrategyId(null);
      logRef.current = [];
      setLog([]);
      setMutations(0);
      setWatchedCount(0);
      setBuilderFrame(null);
      setRuntimeDisc(null);
      setTestSecResult(null);
      frameRef.current = null;
      pushLog(`Starting Learn Import Path \u2014 action: ${ACTION_LABELS[actionType]}`);
      pushLog("Phase 1 \u2014 Detecting builder frame\u2026");
      const frame = await detectBuilderFrame(builderTabId);
      frameRef.current = frame;
      setBuilderFrame(frame);
      if (frame) {
        pushLog(`Builder frame found: frameId=${frame.frameId} score=${frame.score} (${frame.reason})`);
        pushLog(`  URL: ${frame.url.slice(0, 100)}`);
      } else {
        pushLog("Builder frame: not found (single-page or top-level builder) \u2014 using top window");
      }
      pushLog("Recording baseline DOM\u2026");
      const snap = await takeDomSnapshot(builderTabId, frame?.frameId);
      setDomBefore(snap);
      if (snap) pushLog(`DOM before: ${snap.sectionCount} sections, ${snap.elementCount} elements [${snap.source ?? "top"}]`);
      const baseRes = await msg("GET_IMPORT_CANDIDATES");
      const baseStorage = baseRes?.ok ? baseRes.data ?? [] : [];
      const baseIds = new Set(baseStorage.map((c) => c.id));
      pushLog(`Baseline: ${baseStorage.length} stored candidates`);
      if (frame) {
        pushLog("Running runtime discovery inside builder frame\u2026");
        const disc = await runRuntimeDiscovery(builderTabId, frame.frameId, frame.url);
        setRuntimeDisc(disc);
        if (disc) {
          pushLog(`React roots: ${disc.reactRoots} \xB7 Stores: ${disc.storeCandidates.length} \xB7 Dispatches: ${disc.dispatchCandidates.length}`);
          pushLog(`Frame DOM: ${disc.sectionCount} sections, ${disc.rowCount} rows, ${disc.elementCount} elements`);
          if (disc.rawGlobals.length) pushLog(`Notable globals: ${disc.rawGlobals.slice(0, 8).join(", ")}`);
        } else {
          pushLog("Runtime discovery: no result (frame may be loading)");
        }
      }
      await new Promise((r) => setTimeout(r, 1e3));
      setPhase("phase2_watching");
      setCountdown(20);
      const injectResult = await injectNetworkWatcher(builderTabId, frame?.frameId);
      setRuntimeCaptures(null);
      const probeFrameIds = [0];
      if (frame?.frameId != null && frame.frameId !== 0) probeFrameIds.push(frame.frameId);
      const probeResults = [];
      for (const fid of probeFrameIds) {
        try {
          const r = await chrome.scripting.executeScript({
            target: { tabId: builderTabId, frameIds: [fid] },
            world: "MAIN",
            func: _builderRuntimeProbeFunc
          });
          probeResults.push(`frame${fid}:${r?.[0]?.result ?? "?"}`);
        } catch (e) {
          probeResults.push(`frame${fid}:err:${String(e).slice(0, 50)}`);
        }
      }
      const probeStatus = probeResults.join(" | ");
      const storeFound = probeResults.some((r) => r.includes("store:") && !r.includes("no_store"));
      pushLog(`Runtime probe: ${probeStatus}`);
      if (storeFound) {
        pushLog("  \u2713 Redux store found + dispatch spy active \u2014 will capture action types during watch window");
      } else {
        pushLog("  \u26A0 No Redux store found \u2014 network replay remains primary strategy");
      }
      await new Promise((r) => setTimeout(r, 150));
      const initRead = await readWatcherResults(builderTabId, frame?.frameId);
      const hookInfo = initRead ? initRead.iframeLabel : "not readable";
      pushLog(`Phase 2 \u2014 Watcher: ${injectResult}`);
      pushLog(`Network hook status: ${hookInfo}`);
      pushLog(`Watching 20s \xB7 \u27A4 ${ACTION_HINTS[actionType]}`);
      let remaining = 20;
      timerRef.current = setInterval(async () => {
        remaining -= 1;
        setCountdown(remaining);
        if (remaining % 3 === 0) {
          const fId = frameRef.current?.frameId;
          const interim = await readWatcherResults(builderTabId, fId);
          if (interim) {
            setWatchedCount(interim.requests.length);
            if (remaining === 17) {
              pushLog(`Hook check @ 3s: ${interim.iframeLabel} \u2014 ${interim.requests.length} requests so far`);
            }
          }
        }
        if (remaining <= 0) {
          clearTimer();
          setPhase("phase3_verifying");
          setCountdown(15);
          pushLog("Phase 3 \u2014 Verifying changes (15s)\u2026");
          let verifyRemaining = 15;
          timerRef.current = setInterval(async () => {
            verifyRemaining -= 1;
            setCountdown(verifyRemaining);
            if (verifyRemaining <= 0) {
              clearTimer();
              await finalize(baseIds, baseStorage);
            }
          }, 1e3);
        }
      }, 1e3);
    }
    async function finalize(baseIds, baseStorage) {
      if (!builderTabId) return;
      const fId = frameRef.current?.frameId;
      pushLog("Reading back watcher results and runtime captures\u2026");
      const watcherData = await readWatcherResults(builderTabId, fId);
      const snapAfter = await takeDomSnapshot(builderTabId, fId);
      setDomAfter(snapAfter);
      let rtCaptures = null;
      const pullFrameIds = [0];
      if (fId != null && fId !== 0) pullFrameIds.push(fId);
      for (const pfid of pullFrameIds) {
        try {
          const r = await chrome.scripting.executeScript({
            target: { tabId: builderTabId, frameIds: [pfid] },
            world: "MAIN",
            func: _pullRuntimeCapturesFunc
          });
          const raw = r?.[0]?.result;
          if (raw?.storeFound) {
            rtCaptures = raw;
            break;
          }
          if (!rtCaptures && raw) rtCaptures = raw;
        } catch {
        }
      }
      if (rtCaptures) setRuntimeCaptures(rtCaptures);
      const domChanged = !!(snapAfter && domBefore && (snapAfter.sectionCount !== domBefore.sectionCount || snapAfter.elementCount !== domBefore.elementCount || Math.abs(snapAfter.htmlLength - domBefore.htmlLength) > 150));
      const domMuts = watcherData?.mutations ?? 0;
      setMutations(domMuts);
      setWatchedCount(watcherData?.requests.length ?? 0);
      if (snapAfter) pushLog(`DOM after: ${snapAfter.sectionCount} sections, ${snapAfter.elementCount} elements [${snapAfter.source ?? "top"}]`);
      pushLog(`DOM changed: ${domChanged ? "YES \u2713" : "NO"}`);
      pushLog(`DOM mutations: ${domMuts} \xB7 iframe hooked: ${watcherData?.iframeLabel ?? "n/a"}`);
      const watcherCandidates = [];
      for (const req of watcherData?.requests ?? []) {
        const { score, tag, breakdown } = scoreWatcherRequest(req.url, req.method, req.body, actionType);
        if (score >= 40) {
          const stableId = `watcher-${req.method.toUpperCase()}-${btoa(req.url).replace(/[^a-zA-Z0-9]/g, "").slice(0, 16)}`;
          watcherCandidates.push({
            id: stableId,
            url: req.url,
            method: req.method,
            body: req.body,
            headers: req.headers ?? {},
            // captured auth/session headers
            requestBody: req.body,
            // alias for normalizeCandidate
            requestHeaders: req.headers ?? {},
            // alias for ImportCandidate compat
            score,
            scoreBreakdown: breakdown,
            tag,
            source: "watcher",
            ts: req.ts
          });
        }
      }
      const totalRequests = (watcherData?.requests ?? []).length;
      const nonHlSkipped = (watcherData?.requests ?? []).filter((r) => !HL_DOMAIN_RE.test(r.url.toLowerCase())).length;
      pushLog(`Watcher captured: ${totalRequests} requests (${nonHlSkipped} skipped \u2014 non-HL domain)`);
      pushLog(`Watcher candidates (score \u2265 40, HL domain only): ${watcherCandidates.length}`);
      if (watcherCandidates.length > 0) {
        const AUTH_KEYS_SET = /* @__PURE__ */ new Set([
          "authorization",
          "token",
          "x-location-id",
          "x-builder-session-id",
          "x-csrf-token",
          "x-xsrf-token",
          "x-session-id",
          "x-api-key",
          "x-user-id",
          "x-organization-id"
        ]);
        const allStorageRes = await msg("GET_IMPORT_CANDIDATES");
        const allStorage = allStorageRes?.ok ? allStorageRes.data ?? [] : [];
        const bufferRes = await msg("GET_HEADER_BUFFER", {
          urls: watcherCandidates.map((c) => c.url)
        });
        const headerBufferMap = bufferRes?.ok ? bufferRes.data ?? {} : {};
        let enrichedCount = 0;
        for (const cand of watcherCandidates) {
          const existing = cand.headers ?? {};
          const cdpMatch = allStorage.find(
            (s) => s.url === cand.url && s.method.toUpperCase() === cand.method.toUpperCase() && s.requestHeaders && Object.keys(s.requestHeaders).length > 0
          );
          const enrichSource = cdpMatch?.requestHeaders ?? headerBufferMap[cand.url]?.headers;
          if (enrichSource && Object.keys(enrichSource).length > 0) {
            const merged2 = { ...existing };
            for (const [k, v] of Object.entries(enrichSource)) {
              const kl = k.toLowerCase();
              if (AUTH_KEYS_SET.has(kl) || !existing[kl]) merged2[kl] = v;
            }
            cand.headers = merged2;
            cand.requestHeaders = merged2;
            enrichedCount++;
            const authPresent = [...AUTH_KEYS_SET].filter((k) => k in merged2);
            pushLog(`  Header enrichment [${cdpMatch ? "CDP" : "webRequest"}]: ${cand.url.slice(0, 60)} \u2192 auth=[${authPresent.join(",")}]`);
          }
        }
        if (enrichedCount > 0) {
          pushLog(`Headers enriched for ${enrichedCount}/${watcherCandidates.length} watcher candidates`);
        } else {
          pushLog("Header enrichment: no matches found \u2014 headers are as captured by JS watcher");
          pushLog("  \u2192 If replay returns 401, attach the Chrome Debugger (Open Advanced Tools) before running Learn");
        }
      }
      const newStorageRes = await msg("GET_IMPORT_CANDIDATES");
      const newStorage = newStorageRes?.ok ? newStorageRes.data ?? [] : [];
      const newStorageCandidates = newStorage.filter((c) => !baseIds.has(c.id)).map((c) => ({
        id: c.id,
        url: c.url,
        method: c.method,
        body: "",
        score: c.score,
        scoreBreakdown: { stored: c.score },
        tag: c.tag,
        source: "storage",
        payloadSize: c.payloadSize,
        statusCode: c.statusCode ?? void 0,
        requestBody: c.requestBody,
        responseBody: c.responseBody,
        // Preserve auth headers from storage so replay can still authenticate
        requestHeaders: c.requestHeaders
      }));
      pushLog(`New storage candidates: ${newStorageCandidates.length}`);
      const runtimeDispatchCandidates = [];
      if (rtCaptures?.dispatched && rtCaptures.dispatched.length > 0) {
        pushLog(`Runtime dispatch captures: ${rtCaptures.totalCaptured} total, ${rtCaptures.dispatched.length} scored`);
        for (const cap of rtCaptures.dispatched.slice(0, 10)) {
          runtimeDispatchCandidates.push({
            id: `rd-${Date.now()}-${cap.type.replace(/[^a-z0-9]/gi, "").slice(0, 20)}`,
            url: `redux://dispatch/${cap.type}`,
            // synthetic URL for dedup
            method: "DISPATCH",
            body: cap.payload,
            score: cap.score + 200,
            // dispatch actions rank higher than network replay
            scoreBreakdown: { dispatch: cap.score, dispatchBonus: 200 },
            tag: "RUNTIME_DISPATCH",
            source: "runtime-dispatch",
            ts: cap.ts,
            dispatchActionType: cap.type,
            dispatchPayload: cap.payload,
            dispatchStoreType: rtCaptures.storeType
          });
          pushLog(`  \u2726 Action: "${cap.type}" (score ${cap.score}) via ${rtCaptures.storeType}`);
        }
      } else if (rtCaptures?.storeFound) {
        pushLog(`Runtime: store found (${rtCaptures.storeType}) but no "add section" actions observed during watch window`);
        pushLog(`  \u21B3 Re-run Learn Import Path and perform an "Add Section" action in the builder`);
      } else {
        pushLog(`Runtime: no Redux store detected \u2014 HL builder may not use Redux directly`);
      }
      const seenUrls = /* @__PURE__ */ new Set();
      const merged = [];
      const allCandidates = [
        ...runtimeDispatchCandidates,
        ...watcherCandidates,
        ...newStorageCandidates
      ].sort((a, b) => b.score - a.score);
      for (const c of allCandidates) {
        const key = `${c.method}:${c.url}`;
        if (!seenUrls.has(key)) {
          seenUrls.add(key);
          merged.push(c);
        }
      }
      if (merged.length > 0) {
        pushLog(`\u2713 Total candidates: ${merged.length} (best score: ${merged[0].score})`);
        const top = merged[0];
        if (top.source === "runtime-dispatch") {
          pushLog(`\u2605 Best: DISPATCH "${top.dispatchActionType}" \u2014 inject via Redux store (${top.dispatchStoreType})`);
        } else {
          pushLog(`Top candidate: ${top.method} ${top.url}`);
        }
      } else {
        pushLog(`\u26A0 No strong candidates found.`);
        pushLog(`Tip: Try a more structural action like Add Section or Duplicate Page.`);
      }
      setCandidates(merged);
      const session = {
        id: `learn-${Date.now()}`,
        actionType,
        completedAt: (/* @__PURE__ */ new Date()).toISOString(),
        candidateCount: merged.length,
        winnerScore: merged[0]?.score ?? 0,
        domMutations: domMuts,
        domChanged,
        candidates: merged
      };
      await msg("SAVE_LEARN_SESSION", {
        ...session,
        builderTabId: builderTabId ?? 0,
        builderUrl: builderUrl ?? "",
        startedAt: new Date(Date.now() - 37e3).toISOString(),
        snapBefore: domBefore ? { sectionCount: domBefore.sectionCount, elementCount: domBefore.elementCount, htmlLength: domBefore.htmlLength } : void 0,
        snapAfter: snapAfter ? { sectionCount: snapAfter.sectionCount, elementCount: snapAfter.elementCount, htmlLength: snapAfter.htmlLength } : void 0
      });
      pushLog("Session saved to Learn History.");
      const passthroughCandidates = sortCandidatesByPriority(
        merged.map((c) => ({
          id: c.id,
          url: c.url,
          method: c.method,
          tag: c.tag,
          score: c.score,
          statusCode: c.statusCode ?? null,
          payloadSize: c.payloadSize ?? (c.body ?? "").length ?? 0,
          capturedAt: (/* @__PURE__ */ new Date()).toISOString(),
          requestBody: c.requestBody ?? c.body ?? "",
          responseBody: c.responseBody ?? "",
          // Merge both field-name variants so auth headers survive the pass-through
          requestHeaders: Object.keys({ ...c.requestHeaders ?? {}, ...c.headers ?? {} }).length > 0 ? { ...c.requestHeaders ?? {}, ...c.headers ?? {} } : void 0,
          ...c.scoreBreakdown ? { scoreBreakdown: c.scoreBreakdown } : {}
        }))
      );
      onLearnComplete(passthroughCandidates);
      setPhase("done");
    }
    function stopLearning() {
      clearTimer();
      setPhase("idle");
      pushLog("Stopped by user.");
    }
    const isActive = ["phase1_baseline", "phase2_watching", "phase3_verifying"].includes(phase);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { border: "1px solid rgba(167,139,250,.2)", background: "rgba(167,139,250,.02)" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Learn Import Path" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 11, color: "#6b7280", lineHeight: 1.7, marginBottom: 14 }, children: [
        "Injects a live network watcher into the HighLevel builder, then watches all requests while you manually perform an action. Discovers the ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { style: { color: "#c4b5fd" }, children: "real mutation endpoint" }),
        " without relying on the content-script bridge."
      ] }),
      phase === "idle" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 14 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionTypeSelector, { selected: actionType, onChange: setActionType }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 10.5, color: "#a78bfa", padding: "7px 10px", background: "rgba(167,139,250,.06)", borderRadius: 8, border: "1px solid rgba(167,139,250,.15)" }, children: [
          "\u27A4 ",
          ACTION_HINTS[actionType]
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryBtn, { label: "\u25B6  Start Learning (2s baseline + 20s watch + 15s verify)", onClick: startLearning, disabled: !builderTabId, accent: "#a78bfa", testId: "btn-learn-start" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LearnHistoryPanel, { onSelectCandidate: (c) => {
          onLearnComplete(sortCandidatesByPriority([normalizeCandidate({ ...c, id: c.id })]));
        } })
      ] }),
      isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LearnPhaseBar, { phase }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { size: 18 }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, color: "#a78bfa" }, children: phase === "phase1_baseline" ? "Phase 1 \u2014 Recording baseline\u2026" : phase === "phase2_watching" ? `Phase 2 \u2014 Watching\u2026 ${countdown}s` : `Phase 3 \u2014 Verifying\u2026 ${countdown}s` }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, color: "#6b7280" }, children: phase === "phase1_baseline" ? "Capturing DOM snapshot + existing candidates" : phase === "phase2_watching" ? `${ACTION_HINTS[actionType]} (${watchedCount} requests captured so far)` : "Reading back network captures + scoring candidates" })
          ] })
        ] }),
        phase === "phase2_watching" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "10px 12px", background: "rgba(167,139,250,.08)", borderRadius: 8, border: "1px solid rgba(167,139,250,.2)", marginBottom: 12, fontSize: 11, color: "#c4b5fd", fontWeight: 600 }, children: [
          "\u27A4 ",
          ACTION_HINTS[actionType]
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: stopLearning, style: { fontSize: 11, padding: "5px 14px", borderRadius: 7, border: "1px solid #374151", background: "#1a1d27", color: "#6b7280", cursor: "pointer" }, "data-testid": "btn-learn-stop", children: "Stop" })
      ] }),
      phase === "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
          padding: "12px 14px",
          borderRadius: 10,
          background: candidates.length > 0 ? "rgba(16,185,129,.06)" : "rgba(245,158,11,.05)",
          border: `1px solid ${candidates.length > 0 ? "rgba(16,185,129,.25)" : "rgba(245,158,11,.25)"}`
        }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, fontWeight: 700, color: candidates.length > 0 ? "#10b981" : "#f59e0b", marginBottom: 6 }, children: candidates.length > 0 ? `\u2713 ${candidates.length} mutation candidate${candidates.length > 1 ? "s" : ""} found` : "\u26A0 No strong mutation candidates detected" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 16, flexWrap: "wrap", fontSize: 10.5, color: "#4b5563" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
              "Requests captured: ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { style: { color: "#9ca3af" }, children: watchedCount })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
              "DOM mutations: ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { style: { color: "#9ca3af" }, children: mutations })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
              "DOM changed: ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { style: { color: domAfter && domBefore && (domAfter.sectionCount !== domBefore.sectionCount || Math.abs(domAfter.htmlLength - domBefore.htmlLength) > 150) ? "#10b981" : "#f87171" }, children: domAfter && domBefore && (domAfter.sectionCount !== domBefore.sectionCount || Math.abs(domAfter.htmlLength - domBefore.htmlLength) > 150) ? "YES" : "NO" })
            ] }),
            candidates.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "#f59e0b" }, children: "Try a more structural action: Add Section or Duplicate Page" })
          ] })
        ] }),
        candidates.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 9.5, fontWeight: 700, color: "#4b5563", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 }, children: 'Ranked Candidates \u2014 click "Use as Strategy" to select for paste' }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: candidates.slice(0, 8).map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            CandidateCard,
            {
              c,
              rank: i + 1,
              isStrategy: strategyId === c.id,
              onMarkStrategy: (cand) => {
                const toggling = strategyId === cand.id;
                setStrategyId(toggling ? null : cand.id);
                if (!toggling) {
                  onLearnComplete(sortCandidatesByPriority([normalizeCandidate({ ...cand, id: cand.id })]));
                }
              },
              onSelect: (cand) => {
                onLearnComplete(sortCandidatesByPriority([normalizeCandidate({ ...cand, id: cand.id })]));
              }
            },
            c.id
          )) })
        ] }),
        runtimeCaptures && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { border: `1px solid ${runtimeCaptures.storeFound ? "rgba(139,92,246,.35)" : "rgba(255,255,255,.08)"}`, borderRadius: 10, overflow: "hidden" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "9px 14px", background: runtimeCaptures.storeFound ? "rgba(139,92,246,.10)" : "rgba(255,255,255,.03)", display: "flex", alignItems: "center", gap: 8 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 10 }, children: "\u26A1" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 10.5, fontWeight: 700, color: runtimeCaptures.storeFound ? "#a78bfa" : "#4b5563", letterSpacing: "0.05em", textTransform: "uppercase" }, children: "Dispatch Spy" }),
            runtimeCaptures.storeFound ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 9.5, color: "#c4b5fd", background: "rgba(139,92,246,.15)", borderRadius: 4, padding: "1px 7px" }, children: [
              "Redux store found (",
              runtimeCaptures.storeType,
              ")"
            ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 9.5, color: "#6b7280", background: "rgba(255,255,255,.05)", borderRadius: 4, padding: "1px 7px" }, children: "No store \u2014 HL may not use Redux" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { marginLeft: "auto", fontSize: 9, color: "#4b5563" }, children: [
              runtimeCaptures.totalCaptured,
              " actions captured"
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "10px 14px" }, children: [
            runtimeCaptures.storeFound && runtimeCaptures.dispatched.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 10, color: "#f59e0b", marginBottom: 6 }, children: [
              'Store found but no "add section" actions observed.',
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
              'Re-run Learn Import Path and click "Add Section" in the builder during the 20s window.'
            ] }),
            runtimeCaptures.dispatched.slice(0, 5).map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginBottom: 6, padding: "5px 8px", background: "rgba(139,92,246,.06)", borderRadius: 6, border: "1px solid rgba(139,92,246,.12)" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 9, fontWeight: 700, color: "#818cf8", background: "rgba(129,140,248,.12)", padding: "1px 5px", borderRadius: 3 }, children: [
                  "score ",
                  d.score
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 10, fontWeight: 700, color: "#c4b5fd", fontFamily: "monospace" }, children: d.type })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 9, color: "#4b5563", fontFamily: "monospace", wordBreak: "break-all", maxHeight: 30, overflow: "hidden" }, children: d.payload.slice(0, 120) })
            ] }, i)),
            runtimeCaptures.apolloFound && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 9.5, color: "#f59e0b", marginTop: 4 }, children: "Apollo/GraphQL client detected \u2014 HL may use GraphQL mutations for some operations" }),
            runtimeCaptures.errors?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 9, color: "#f87171", marginTop: 4 }, children: [
              "Probe errors: ",
              runtimeCaptures.errors.join(" | ")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { border: "1px solid rgba(167,139,250,.15)", borderRadius: 10, overflow: "hidden" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "9px 14px", background: "rgba(167,139,250,.06)", display: "flex", alignItems: "center", gap: 8 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 10.5, fontWeight: 700, color: "#a78bfa", letterSpacing: "0.05em", textTransform: "uppercase" }, children: "Runtime Discovery" }),
            builderFrame ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 10, color: "#10b981", background: "rgba(16,185,129,.12)", borderRadius: 4, padding: "1px 7px" }, children: "iframe hooked \u2713" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 10, color: "#f87171", background: "rgba(248,113,113,.1)", borderRadius: 4, padding: "1px 7px" }, children: "no builder frame" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "10px 14px", display: "flex", flexDirection: "column", gap: 6 }, children: [
            builderFrame && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 10, color: "#6b7280", wordBreak: "break-all" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { style: { color: "#9ca3af" }, children: "Frame:" }),
              " ",
              builderFrame.url.slice(0, 90),
              " (id=",
              builderFrame.frameId,
              ", score=",
              builderFrame.score,
              ", ",
              builderFrame.reason,
              ")"
            ] }),
            runtimeDisc ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 12, flexWrap: "wrap", fontSize: 10.5 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: (runtimeDisc.reactRoots ?? 0) > 0 ? "#10b981" : "#6b7280" }, children: [
                  "React roots: ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: runtimeDisc.reactRoots ?? 0 })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: (runtimeDisc.storeCandidates?.length ?? 0) > 0 ? "#f59e0b" : "#6b7280" }, children: [
                  "Stores: ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: runtimeDisc.storeCandidates?.length ?? 0 })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: (runtimeDisc.dispatchCandidates?.length ?? 0) > 0 ? "#f59e0b" : "#6b7280" }, children: [
                  "Dispatches: ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: runtimeDisc.dispatchCandidates?.length ?? 0 })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: (runtimeDisc.sectionCount ?? 0) > 0 ? "#a78bfa" : "#6b7280" }, children: [
                  "Sections: ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: runtimeDisc.sectionCount ?? 0 }),
                  " / Rows: ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: runtimeDisc.rowCount ?? 0 })
                ] })
              ] }),
              (runtimeDisc.storeCandidates ?? []).slice(0, 3).map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 10, color: "#9ca3af", padding: "4px 8px", background: "rgba(255,255,255,.03)", borderRadius: 6, fontFamily: "monospace" }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "#f59e0b" }, children: s?.path ?? "?" }),
                s?.hasSections && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "#a78bfa", marginLeft: 6 }, children: "sections" }),
                s?.hasRows && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "#7dd3fc", marginLeft: 4 }, children: "rows" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: "#4b5563", marginLeft: 6 }, children: [
                  "[",
                  (s?.keyPreview ?? []).slice(0, 5).join(", "),
                  "]"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: "#10b981", marginLeft: 6 }, children: [
                  "conf:",
                  s?.confidence ?? 0
                ] })
              ] }, i)),
              (runtimeDisc.dispatchCandidates ?? []).slice(0, 3).map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 10, color: "#9ca3af", padding: "4px 8px", background: "rgba(255,255,255,.03)", borderRadius: 6, fontFamily: "monospace" }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "#34d399" }, children: "fn:" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: "#10b981" }, children: d?.path ?? "?" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { color: "#10b981", marginLeft: 6 }, children: [
                  "conf:",
                  d?.confidence ?? 0
                ] })
              ] }, i)),
              (runtimeDisc.rawGlobals?.length ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 9.5, color: "#4b5563", fontFamily: "monospace" }, children: [
                "globals: ",
                (runtimeDisc.rawGlobals ?? []).slice(0, 12).join(", ")
              ] })
            ] }) : builderFrame ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 10.5, color: "#6b7280" }, children: "No runtime data \u2014 discovery runs automatically next time." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 10.5, color: "#6b7280" }, children: "Frame not detected. Check that the HighLevel page builder is open." }),
            builderFrame && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,.05)" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 10, color: "#6b7280", marginBottom: 6 }, children: "Insert Test Section \u2014 validates runtime mutation path before full paste." }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "button",
                  {
                    onClick: async () => {
                      if (!builderTabId || !builderFrame) return;
                      setTestSecRunning(true);
                      const snapBefore = await takeDomSnapshot(builderTabId, builderFrame.frameId);
                      const res = await runInsertTestSection(builderTabId, builderFrame.frameId);
                      await new Promise((r) => setTimeout(r, 600));
                      const snapAfter = await takeDomSnapshot(builderTabId, builderFrame.frameId);
                      const changed = !!(snapBefore && snapAfter && (snapAfter.sectionCount !== snapBefore.sectionCount || Math.abs(snapAfter.htmlLength - snapBefore.htmlLength) > 50));
                      setTestSecResult({ ...res, error: changed ? void 0 : res.error ?? "no DOM change detected" });
                      setTestSecRunning(false);
                    },
                    disabled: testSecRunning,
                    style: { fontSize: 11, padding: "5px 14px", borderRadius: 7, border: "1px solid rgba(167,139,250,.3)", background: "rgba(167,139,250,.08)", color: "#a78bfa", cursor: testSecRunning ? "wait" : "pointer", opacity: testSecRunning ? 0.6 : 1 },
                    "data-testid": "btn-insert-test-section",
                    children: testSecRunning ? "Inserting\u2026" : "\u25B6 Insert Test Section"
                  }
                ),
                testSecResult && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 10.5, color: testSecResult?.error ? "#f87171" : "#10b981" }, children: testSecResult?.error ? `\u2717 ${testSecResult.error}` : `\u2713 via ${testSecResult?.path ?? "unknown path"}` })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", gap: 8 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => setPhase("idle"), style: { fontSize: 11, padding: "6px 16px", borderRadius: 7, border: "1px solid #374151", background: "#1a1d27", color: "#a78bfa", cursor: "pointer", fontWeight: 600 }, "data-testid": "btn-learn-again", children: "\u21BA Learn Again" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LearnHistoryPanel, { onSelectCandidate: (c) => {
          onLearnComplete(sortCandidatesByPriority([normalizeCandidate({ ...c, id: c.id })]));
        } })
      ] }),
      phase === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, color: "#f87171" }, children: "No builder tab available. Open a HighLevel page builder and try again." }),
      log.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 14 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExecLog, { lines: log, title: "Learn Log" }) })
    ] });
  }
  function DebugPanel({ session, item, builder, phase, lastError, connStatus, mutResult }) {
    const [open, setOpen] = (0, import_react.useState)(false);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { border: "1px solid rgba(255,255,255,.04)", borderRadius: 10, overflow: "hidden" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { onClick: () => setOpen(!open), style: { width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", background: "#0d0f17", border: "none", cursor: "pointer" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 10, color: "#374151" }, children: "\u2699 Debug Panel" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 10, color: "#374151", marginLeft: "auto" }, children: open ? "\u25B2" : "\u25BC" })
      ] }),
      open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "12px 14px", background: "#0a0c14", display: "flex", flexDirection: "column", gap: 2 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, { label: "Session ID", value: session?.sessionId?.slice(0, 16) + "\u2026", neutral: true }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, { label: "Item ID", value: item?.captureId?.slice(0, 16) + "\u2026", neutral: true }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, { label: "Builder Tab", value: builder ? `tab ${builder.tabId}` : "\u2014", ok: !!builder }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, { label: "CS Connected", value: connStatus, ok: connStatus === "alive" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, { label: "Phase", value: phase, neutral: true }),
        mutResult && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, { label: "Strategy", value: mutResult.strategy.slice(0, 40), neutral: true }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, { label: "Attempted", value: String(mutResult.attempted), ok: mutResult.attempted }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, { label: "Response", value: mutResult.responseOk ? "ok" : "error", ok: mutResult.responseOk }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, { label: "DOM Changed", value: String(mutResult.domChanged), ok: mutResult.domChanged }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, { label: "Verified", value: String(mutResult.verified), ok: mutResult.verified })
        ] }),
        lastError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 6, fontSize: 10, color: "#f87171", lineHeight: 1.6, padding: "6px 8px", background: "rgba(248,113,113,.05)", borderRadius: 5 }, children: lastError })
      ] })
    ] });
  }
  function PastePage() {
    const [phase, setPhase] = (0, import_react.useState)("loading");
    const [session, setSession] = (0, import_react.useState)(null);
    const [item, setItem] = (0, import_react.useState)(null);
    const [builder, setBuilder] = (0, import_react.useState)(null);
    const [connStatus, setConnStatus] = (0, import_react.useState)("unknown");
    const [lastError, setLastError] = (0, import_react.useState)("");
    const [execLog, setExecLog] = (0, import_react.useState)([]);
    const [dryLog, setDryLog] = (0, import_react.useState)([]);
    const [mutResult, setMutResult] = (0, import_react.useState)(null);
    const [candidates, setCandidates] = (0, import_react.useState)([]);
    const [activePasteStrategy, setActivePasteStrategy] = (0, import_react.useState)(() => buildActivePasteStrategy(null));
    const strategyRef = (0, import_react.useRef)(buildActivePasteStrategy(null));
    function setStrategy(candidate) {
      const s = buildActivePasteStrategy(candidate);
      strategyRef.current = s;
      setActivePasteStrategy(s);
    }
    const selectedCandidate = activePasteStrategy.candidate;
    const [activeStage, setActiveStage] = (0, import_react.useState)(null);
    const [testSectionResult, setTestSectionResult] = (0, import_react.useState)(null);
    const [lastMutVerified, setLastMutVerified] = (0, import_react.useState)(false);
    const [lastMutStatus, setLastMutStatus] = (0, import_react.useState)(0);
    const [testRunning, setTestRunning] = (0, import_react.useState)(false);
    const sessionId = new URLSearchParams(window.location.search).get("sessionId") ?? "";
    const logRef = (0, import_react.useRef)([]);
    function pushLog(line) {
      logRef.current = [...logRef.current, line];
      setExecLog([...logRef.current]);
    }
    const bootstrap = (0, import_react.useCallback)(async () => {
      console.log("[CloneLevel] bootstrap() start, sessionId:", sessionId);
      setPhase("loading");
      setLastError("");
      setExecLog([]);
      setMutResult(null);
      setActiveStage(null);
      logRef.current = [];
      if (!sessionId) {
        setPhase("no_session");
        setLastError("No sessionId in URL. Cannot determine what to paste.");
        return;
      }
      const sesRes = await msg("GET_PASTE_SESSION");
      if (!sesRes?.ok || !sesRes.data) {
        setPhase("no_session");
        setLastError("Paste session not found. Click Paste Into Builder again from the popup.");
        return;
      }
      const ses = sesRes.data;
      setSession(ses);
      const capRes = await msg("GET_PUBLIC_CAPTURES");
      if (!capRes?.ok) {
        setPhase("no_item");
        setLastError("Could not load library. Check that the extension is active.");
        return;
      }
      const captures = capRes.data ?? [];
      const found = captures.find((c) => c.captureId === ses.selectedItemId);
      if (!found) {
        setPhase("no_item");
        setLastError(`Item "${ses.selectedItemId}" not found in library.`);
        return;
      }
      setItem(found);
      const pingRes = await msg("PING_BUILDER");
      if (!pingRes?.ok || !pingRes.data) {
        setPhase("no_builder");
        setLastError(pingRes?.error ?? "No HighLevel builder tab detected. Open a HL page builder and try again.");
        return;
      }
      const bInfo = { ...pingRes.data, alive: true };
      setBuilder(bInfo);
      setPhase("connecting");
      setConnStatus("unknown");
      try {
        const csRes = await chrome.tabs.sendMessage(bInfo.tabId, { type: "PING_BUILDER", id: crypto.randomUUID(), timestamp: (/* @__PURE__ */ new Date()).toISOString() });
        if (csRes?.ok) {
          setConnStatus("alive");
          setPhase("ready");
        } else throw new Error("No ok");
      } catch {
        try {
          await chrome.scripting.executeScript({ target: { tabId: bInfo.tabId }, files: ["content/bootstrap.js"] });
          await new Promise((r) => setTimeout(r, 600));
          const retry = await chrome.tabs.sendMessage(bInfo.tabId, { type: "PING_BUILDER", id: crypto.randomUUID(), timestamp: (/* @__PURE__ */ new Date()).toISOString() });
          if (retry?.ok) {
            setConnStatus("alive");
            setPhase("ready");
          } else throw new Error("Retry failed");
        } catch {
          setConnStatus("dead");
          setPhase("conn_failed");
          setLastError("Could not connect to the HighLevel builder. Refresh the builder tab and try again.");
        }
      }
      const candRes = await msg("GET_IMPORT_CANDIDATES");
      if (candRes?.ok && Array.isArray(candRes.data) && candRes.data.length) {
        const sorted = sortCandidatesByPriority(candRes.data);
        setCandidates(sorted);
      }
    }, [sessionId]);
    (0, import_react.useEffect)(() => {
      bootstrap();
    }, [bootstrap]);
    async function doDryRun() {
      if (!item || !builder) return;
      setPhase("dry_running");
      setDryLog([]);
      const log = [];
      const push = (l) => log.push(l);
      push(`Dry Run \u2014 no changes will be made`);
      push(`Item: "${item.title || item.domain}" (${item.captureId.slice(0, 8)}\u2026)`);
      push(`Target: tab ${builder.tabId}`);
      push(`Sections: ${item.sections?.length ?? 0} \xB7 Assets: ${item.assets?.length ?? 0}`);
      push(`Payload estimate: ~${fmt(item.rawHtmlSize ?? 0)}`);
      await new Promise((r) => setTimeout(r, 400));
      push(`Content script: ${connStatus === "alive" ? "CONNECTED \u2713" : "NOT CONNECTED \u2717"}`);
      const dryStrategy = strategyRef.current;
      push(`Strategy type: ${dryStrategy.type}`);
      push(`Executor:      ${dryStrategy.executor}`);
      push(`CandidateId:   ${dryStrategy.candidateId ?? "none"}`);
      push(`Method:        ${dryStrategy.method ?? "N/A"}`);
      push(`URL:           ${dryStrategy.fullUrl ?? "N/A (DOM inject)"}`);
      push(`Headers:       ${dryStrategy.headerCount}`);
      push(`Replayable:    ${dryStrategy.replayable ? "YES \u2713" : "NO"}`);
      push(`Fallback used: ${dryStrategy.type === "content-script-inject" && !dryStrategy.candidateId ? "N/A (base strategy)" : "no"}`);
      const snap = await takeDomSnapshot(builder.tabId);
      if (snap) push(`Builder DOM: ${snap.sectionCount} sections, ${snap.elementCount} elements`);
      push(`Stage 1 \u2014 Session Ready: ${connStatus === "alive" ? "PASS \u2713" : "FAIL \u2717"}`);
      push(`Stage 2 \u2014 Payload: will pack ${item.sections?.length ?? 0} sections`);
      push(`Stage 3 \u2014 Mutation: will execute "${dryStrategy.type}" via ${dryStrategy.executor}`);
      push(`Stage 4 \u2014 Verify: will compare DOM before/after (+ API response status if candidate)`);
      push(`Dry run complete. No changes made.`);
      setDryLog(log);
      setPhase("dry_done");
    }
    async function doExecutePaste() {
      if (!item || !builder) return;
      setExecLog([]);
      setMutResult(null);
      logRef.current = [];
      setPhase("stage2_preparing");
      setActiveStage(2);
      setLastError("");
      pushLog(`Stage 2 \u2014 Payload Prepared`);
      pushLog(`Item: "${item.title || item.domain}" (${item.captureId.slice(0, 8)}\u2026)`);
      pushLog(`Sections: ${item.sections?.length ?? 0} \xB7 Assets: ${item.assets?.length ?? 0}`);
      pushLog(`Raw size: ~${fmt(item.rawHtmlSize ?? 0)}`);
      await new Promise((r) => setTimeout(r, 300));
      setPhase("stage3_mutating");
      setActiveStage(3);
      pushLog(`Stage 3 \u2014 Mutation Attempted`);
      const snapBefore = await takeDomSnapshot(builder.tabId);
      if (snapBefore) {
        pushLog(`DOM before: ${snapBefore.sectionCount} sections, ${snapBefore.elementCount} elements, ${fmt(snapBefore.htmlLength)} [${snapBefore.source ?? "top"}]`);
      }
      const strategy = strategyRef.current;
      const isLearnedStrategy = strategy.type === "learned-mutation-replay";
      const uiStrategyType = activePasteStrategy.type;
      const refStrategyType = strategy.type;
      if (uiStrategyType !== refStrategyType) {
        const mismatch = `Strategy state mismatch: UI shows "${uiStrategyType}" but executor has "${refStrategyType}". Click Execute Paste again.`;
        pushLog(`\u26D4 ABORT \u2014 ${mismatch}`);
        setLastError(mismatch);
        setPhase("attempt_failed");
        setActiveStage(null);
        return;
      }
      const isDispatchStrategy = strategy.type === "runtime-dispatch";
      if (isLearnedStrategy) {
        const sc = strategy.candidate;
        const rawHdrs = {
          ...sc.requestHeaders ?? {},
          ...sc.headers ?? {}
        };
        const AUTH_AUDIT_KEYS = ["authorization", "token", "x-location-id", "x-builder-session-id", "x-csrf-token", "x-xsrf-token", "x-session-id", "x-api-key"];
        const presentAuth2 = AUTH_AUDIT_KEYS.filter((k) => k in rawHdrs);
        const missingAuth2 = AUTH_AUDIT_KEYS.filter((k) => !(k in rawHdrs));
        pushLog(`\u2554\u2550\u2550 EXECUTING STRATEGY [MODIFIED REPLAY] \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557`);
        pushLog(`  type:         ${strategy.type}`);
        pushLog(`  executor:     ${strategy.executor}`);
        pushLog(`  candidateId:  ${strategy.candidateId}`);
        pushLog(`  method:       ${strategy.method}`);
        pushLog(`  url:          ${strategy.fullUrl}`);
        pushLog(`  headers:      ${Object.keys(rawHdrs).length} captured`);
        pushLog(`  Auth \u2713:       ${presentAuth2.length ? presentAuth2.join(", ") : "(none)"}`);
        pushLog(`  Auth \u2717:       ${missingAuth2.length ? missingAuth2.join(", ") : "(none \u2014 all present)"}`);
        pushLog(`  body:         modified (sections replaced with import content)`);
        pushLog(`  score:        ${sc.score} \xB7 ${sc.tag}`);
        pushLog(`  channel:      main-world \u2192 content-script \u2192 service-worker`);
        pushLog(`  frame:        ${builder?.frame?.frameId ?? "auto"}`);
        pushLog(`\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D`);
      } else if (isDispatchStrategy) {
        pushLog(`\u2554\u2550\u2550 EXECUTING STRATEGY [RUNTIME DISPATCH INJECT] \u2557`);
        pushLog(`  type:         ${strategy.type}`);
        pushLog(`  executor:     ${strategy.executor}`);
        pushLog(`  actionType:   ${strategy.dispatchActionType ?? "?"}`);
        pushLog(`  channel:      MAIN world \u2192 store.dispatch (bypasses network)`);
        pushLog(`  frame:        ${builder?.frame?.frameId ?? "auto"}`);
        pushLog(`\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D`);
      } else {
        pushLog(`\u2554\u2550\u2550 EXECUTING STRATEGY \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557`);
        pushLog(`  type:         ${strategy.type}`);
        pushLog(`  executor:     ${strategy.executor}`);
        pushLog(`  candidateId:  none \u2014 no learned candidate selected`);
        pushLog(`  channel:      Redux \u2192 React fiber \u2192 clipboard \u2192 events`);
        pushLog(`  fallback:     N/A`);
        pushLog(`\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D`);
      }
      let mutAttempted = false;
      let mutResponseOk = false;
      let mutResponseMsg = "";
      let mutVerifiedByApi = false;
      let mutStrategy = strategy.type;
      let mutStrategiesDetail;
      let res = null;
      if (isDispatchStrategy && strategy.dispatchActionType) {
        try {
          const sections = item.sections?.map((s, idx) => ({
            id: `cl_${Date.now()}_${idx}`,
            type: "section",
            label: s.sectionHint ?? `Imported Section ${idx + 1}`,
            rows: [],
            props: { cloneLevel: true, source: "runtime-dispatch" }
          })) ?? [];
          res = await msg("DISPATCH_SECTION_INSERT", {
            tabId: builder.tabId,
            frameId: builder.frame?.frameId,
            actionType: strategy.dispatchActionType,
            sectionsJson: JSON.stringify(sections),
            origPayloadJson: strategy.dispatchPayload ?? "null"
          });
          mutAttempted = true;
          mutResponseOk = res?.ok === true;
          mutResponseMsg = res?.data?.results?.join("; ") ?? res?.error ?? "no message";
          mutVerifiedByApi = res?.ok === true;
          pushLog(`Dispatched action: "${strategy.dispatchActionType}"`);
          pushLog(`Sections injected: ${sections.length}`);
          if (res?.data?.results?.length) pushLog(`Attempts: ${res.data.results.join(" \u2192 ")}`);
          pushLog(`Result: ${mutResponseOk ? "\u2713 ok" : "\u2717 error"} \u2014 "${mutResponseMsg}"`);
          if (!mutResponseOk) {
            pushLog(`\u26A0 Dispatch failed \u2014 probe may have expired (page navigated)`);
            pushLog(`  Re-run Learn Import Path to re-inject the dispatch spy`);
          }
        } catch (e) {
          mutAttempted = true;
          mutResponseMsg = String(e);
          pushLog(`\u2717 DISPATCH_SECTION_INSERT threw: ${mutResponseMsg}`);
        }
      } else {
        try {
          res = await msg("IMPORT_JSON_PACKAGE", {
            captureId: item.captureId,
            targetTabId: builder.tabId,
            // targetFrameId: inject MAIN-world fetch into the exact iframe where HL builder runs
            // so the request originates from the page origin, not chrome-extension://
            targetFrameId: builder.frame?.frameId ?? void 0,
            candidateId: strategy.candidateId ?? void 0,
            // Pass full candidate inline to avoid store-lookup race conditions
            candidate: strategy.candidate ?? void 0,
            // strictStrategy=true → background will NOT fall back to content-script-inject
            strictStrategy: isLearnedStrategy
          });
          mutAttempted = true;
          mutResponseOk = res?.ok === true;
          mutResponseMsg = res?.message ?? res?.error ?? "no message";
          mutVerifiedByApi = res?.verified === true;
          const confirmedStrategy = res?.strategy ?? strategy.type;
          mutStrategy = confirmedStrategy;
          pushLog(`Dispatched to builder tab ${builder.tabId}`);
          pushLog(`Strategy confirmed: ${confirmedStrategy}`);
          pushLog(`Fallback used: ${confirmedStrategy !== strategy.type ? `YES \u2192 ${confirmedStrategy}` : "no"}`);
          if (isLearnedStrategy && confirmedStrategy === "content-script-inject") {
            pushLog(`\u26A0 WARNING: background switched to content-script-inject despite strictStrategy=true`);
            pushLog(`  This is a bug \u2014 please report with the candidate details above.`);
          }
          mutStrategiesDetail = res?.strategies;
          if (res?.fetchPath) pushLog(`Fetch channel: ${res.fetchPath}`);
          if (res?.candidateUrl) pushLog(`Endpoint: ${res.candidateUrl}`);
          if (res?.status) pushLog(`Response status: ${res.status}${res?.responseSize ? ` (${fmt(res.responseSize)} body)` : ""}`);
          if (res?.requestBodySize) pushLog(`Request body: ${fmt(res.requestBodySize)}`);
          pushLog(`Result: ${mutResponseOk ? "\u2713 ok" : "\u2717 error"} \u2014 "${mutResponseMsg}"`);
          if (!mutResponseOk && isLearnedStrategy) {
            pushLog(`\u26A0 Learned mutation replay failed \u2014 did NOT fall back to DOM injection`);
            pushLog(`  Re-run Learn Import Path or check the endpoint is still valid`);
          }
          if (mutStrategiesDetail?.length) {
            pushLog(`Injection strategies tried: ${mutStrategiesDetail.join(", ")}`);
          }
          if (res?.globals) {
            const foundGlobals = Object.entries(res.globals).filter(([, v]) => v !== "undefined").map(([k]) => k);
            if (foundGlobals.length) pushLog(`HL globals detected: ${foundGlobals.join(", ")}`);
          }
        } catch (err) {
          mutAttempted = true;
          mutResponseOk = false;
          mutResponseMsg = String(err).replace("Error: ", "");
          if (isLearnedStrategy) {
            pushLog(`\u2717 Learned mutation replay exception: ${mutResponseMsg}`);
            pushLog(`  Did NOT fall back to DOM injection \u2014 failure is explicit`);
          } else {
            pushLog(`\u2717 Exception: ${mutResponseMsg}`);
          }
        }
      }
      setPhase("stage4_verifying");
      setActiveStage(4);
      pushLog(`Stage 4 \u2014 Verification`);
      await new Promise((r) => setTimeout(r, mutVerifiedByApi ? 400 : 900));
      const snapAfter = await takeDomSnapshot(builder.tabId);
      let domChanged = false;
      if (snapBefore && snapAfter) {
        pushLog(`DOM after: ${snapAfter.sectionCount} sections, ${snapAfter.elementCount} elements, ${fmt(snapAfter.htmlLength)} [${snapAfter.source ?? "top"}]`);
        domChanged = snapAfter.sectionCount !== snapBefore.sectionCount || snapAfter.elementCount !== snapBefore.elementCount || Math.abs(snapAfter.htmlLength - snapBefore.htmlLength) > 100;
        pushLog(`DOM changed: ${domChanged ? "YES \u2713" : "NO"}`);
      } else {
        pushLog(`DOM snapshot unavailable \u2014 cannot verify via DOM`);
      }
      const verified = mutVerifiedByApi || domChanged;
      const resultPhase = !mutAttempted ? "attempt_failed" : verified ? "verified_success" : "attempted_unverified";
      const finalResult = {
        strategy: mutStrategy,
        attempted: mutAttempted,
        responseOk: mutResponseOk,
        responseMsg: mutResponseMsg,
        verified,
        verifyMethod: mutVerifiedByApi ? "API response (2xx)" : "DOM snapshot comparison",
        domChanged,
        snapBefore: snapBefore ?? void 0,
        snapAfter: snapAfter ?? void 0,
        candidateUrl: selectedCandidate?.url,
        payloadSize: item.rawHtmlSize,
        fetchPath: res?.fetchPath,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (!mutAttempted) {
        pushLog(`\u2717 RESULT: ATTEMPT FAILED`);
      } else if (verified) {
        pushLog(`\u2713 RESULT: VERIFIED SUCCESS \u2014 builder DOM changed`);
        await msg("CLEAR_PASTE_SESSION");
      } else {
        pushLog(`\u26A0 RESULT: ATTEMPTED BUT UNVERIFIED`);
        pushLog(`Use Learn Import Path to discover the real HighLevel mutation endpoint`);
      }
      setMutResult(finalResult);
      setLastMutVerified(verified);
      setLastMutStatus(res?.status ?? (mutResponseOk ? 200 : 0));
      setActiveStage(null);
      setPhase(resultPhase);
    }
    async function doTestSection() {
      const strategy = strategyRef.current;
      const uiType = activePasteStrategy.type;
      logRef.current = [];
      setExecLog([]);
      setMutResult(null);
      if (strategy.type !== uiType) {
        pushLog(`\u2554\u2550\u2550 TEST SECTION \u2014 ABORTED \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550`);
        pushLog(`  \u2717 Strategy mismatch: UI=${uiType} / ref=${strategy.type}`);
        pushLog(`  Reload the popup and re-select a candidate.`);
        pushLog(`\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550`);
        return;
      }
      const isLearnedStrategy = strategy.type === "learned-mutation-replay";
      const isDispatchStrategy2 = strategy.type === "runtime-dispatch";
      const candidate = strategy.candidate;
      pushLog(`\u2554\u2550\u2550 TEST SECTION \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550`);
      pushLog(`  Strategy confirmed: ${strategy.type}`);
      if (isLearnedStrategy) {
        const cand0 = strategy.candidate;
        const rawHeaders = {
          ...cand0?.requestHeaders ?? {},
          ...cand0?.headers ?? {}
        };
        const AUTH_AUDIT_KEYS = ["authorization", "token", "x-location-id", "x-builder-session-id", "x-csrf-token", "x-xsrf-token", "x-session-id", "x-api-key"];
        const presentAuth = AUTH_AUDIT_KEYS.filter((k) => k in rawHeaders);
        const missingAuth = AUTH_AUDIT_KEYS.filter((k) => !(k in rawHeaders));
        pushLog(`  Executor:    fetch-replay (MAIN world)`);
        pushLog(`  URL:         ${strategy.fullUrl ?? "N/A"}`);
        pushLog(`  Method:      ${strategy.method ?? "N/A"}`);
        pushLog(`  Headers:     ${Object.keys(rawHeaders).length} captured`);
        pushLog(`  Auth \u2713:      ${presentAuth.length ? presentAuth.join(", ") : "(none)"}`);
        pushLog(`  Auth \u2717:      ${missingAuth.length ? missingAuth.join(", ") : "(none \u2014 all present)"}`);
        pushLog(`  Body:        verbatim (${(cand0?.requestBody ?? "").length} bytes, no reconstruction)`);
        pushLog(`  Channel:     main-world \u2192 content-script \u2192 service-worker`);
        pushLog(`  Frame:       ${builder?.frame?.frameId ?? "auto"}`);
      } else if (isDispatchStrategy2) {
        pushLog(`  Executor:    dispatch-inject (MAIN world)`);
        pushLog(`  ActionType:  ${strategy.dispatchActionType ?? "?"}`);
        pushLog(`  Channel:     MAIN world \u2192 store.dispatch (no network, no auth needed)`);
        pushLog(`  Frame:       ${builder?.frame?.frameId ?? "auto"}`);
      } else {
        pushLog(`  Executor:    DOM inject (content-script)`);
        pushLog(`  Path: _insertTestSectionFunc (Redux dispatch probe \u2014 guessed types)`);
      }
      pushLog(`\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550`);
      setTestRunning(true);
      setTestSectionResult(null);
      try {
        if (isLearnedStrategy) {
          if (!candidate) {
            pushLog(`  \u2717 Aborted: no candidate attached to strategy \u2014 call setStrategy(candidate) first`);
            setTestSectionResult({
              ok: false,
              status: 0,
              responseBodyPreview: "",
              responseSize: 0,
              requestBodySize: 0,
              sectionsDelta: 0,
              sectionsBefore: 0,
              verified: false,
              error: "No candidate in active strategy"
            });
            return;
          }
          const freshCand = {
            ...candidate,
            requestHeaders: {
              ...candidate.requestHeaders ?? {},
              ...candidate.headers ?? {}
            }
          };
          const candidateUrl = freshCand.url ?? freshCand.fullUrl ?? freshCand.endpoint ?? "";
          const candidateMethod = freshCand.method ?? "";
          if (!candidateUrl || !candidateMethod) {
            const msg2 = !candidateUrl ? `Candidate "${freshCand.id}" has no URL \u2014 re-run Learn Import Path` : `Candidate "${freshCand.id}" has no method`;
            pushLog(`  \u2717 ${msg2}`);
            setTestSectionResult({
              ok: false,
              status: 0,
              responseBodyPreview: "",
              responseSize: 0,
              requestBodySize: 0,
              sectionsDelta: 0,
              sectionsBefore: 0,
              verified: false,
              error: msg2
            });
            return;
          }
          console.log("[CloneLevel] doTestSection \u2192 REPLAY_TEST_SECTION via strategyRef:", {
            id: freshCand.id,
            url: candidateUrl,
            method: candidateMethod,
            headerCount: Object.keys(freshCand.requestHeaders ?? {}).length,
            strategyType: strategy.type
          });
          try {
            await msg("SAVE_IMPORT_CANDIDATES", { candidates: [freshCand] });
          } catch {
          }
          const res = await msg("REPLAY_TEST_SECTION", {
            candidateId: freshCand.id,
            targetTabId: builder?.tabId ?? void 0,
            // targetFrameId: inject MAIN-world fetch into the exact iframe where HL builder runs
            // so the request originates from the page origin, not chrome-extension://
            targetFrameId: builder?.frame?.frameId ?? void 0,
            candidate: freshCand
          });
          setTestSectionResult(res);
          if (res.ok) {
            pushLog(`  \u2713 OK (${res.status}) \xB7 sections +${res.sectionsDelta ?? 0} \xB7 channel: ${res.fetchPath ?? "unknown"}`);
          } else {
            pushLog(`  \u2717 Failed (${res.status}) \u2014 ${res.error ?? "no error detail"}`);
          }
          if (res.strategy === "content-script-inject") {
            pushLog(`  \u26A0 WARNING: background returned content-script-inject despite learned strategy`);
            pushLog(`    \u2192 Check candidateId lookup and header capture quality`);
          }
        } else if (isDispatchStrategy2 && strategy.dispatchActionType) {
          const testSection = {
            id: `cl_test_${Date.now()}`,
            type: "section",
            label: "CloneLevel Test Section",
            rows: [],
            props: { cloneLevel: true, test: true }
          };
          const dispatchRes = await msg("DISPATCH_SECTION_INSERT", {
            tabId: builder?.tabId,
            frameId: builder?.frame?.frameId,
            actionType: strategy.dispatchActionType,
            sectionsJson: JSON.stringify([testSection]),
            origPayloadJson: strategy.dispatchPayload ?? "null"
          });
          const dispatchOk = dispatchRes?.ok === true;
          const dispatchResults = dispatchRes?.data?.results ?? [];
          setTestSectionResult({
            ok: dispatchOk,
            status: dispatchOk ? 200 : 0,
            responseBodyPreview: JSON.stringify(dispatchRes?.data ?? {}),
            responseSize: 0,
            requestBodySize: 0,
            sectionsDelta: dispatchOk ? 1 : 0,
            sectionsBefore: 0,
            verified: dispatchOk,
            error: dispatchRes?.error
          });
          if (dispatchOk) {
            pushLog(`  \u2713 Dispatched "${strategy.dispatchActionType}" \u2014 check builder for test section`);
          } else {
            pushLog(`  \u2717 Dispatch failed: ${dispatchRes?.error ?? "unknown error"}`);
            pushLog(`  \u21B3 The probe may have expired \u2014 re-run Learn Import Path to re-inject`);
          }
          if (dispatchResults.length) pushLog(`  Attempts: ${dispatchResults.join(" \u2192 ")}`);
        } else {
          if (!builder?.tabId || !builder?.frame) {
            pushLog(`  \u2717 DOM inject failed \u2014 no builder tab/frame detected`);
            return;
          }
          const res = await runInsertTestSection(builder.tabId, builder.frame.frameId);
          const tr = {
            ok: !res.error && res.tried,
            status: 0,
            responseBodyPreview: "",
            responseSize: 0,
            requestBodySize: 0,
            sectionsDelta: 0,
            sectionsBefore: 0,
            verified: res.tried && !res.error,
            error: res.error,
            candidateUrl: void 0,
            candidateMethod: void 0
          };
          setTestSectionResult(tr);
          pushLog(tr.ok ? `  \u2713 DOM inject success \xB7 path: ${res.path}` : `  \u2717 DOM inject failed \u2014 ${res.error ?? "no dispatch handle found"}`);
        }
      } catch (e) {
        const msg2 = String(e);
        setTestSectionResult({
          ok: false,
          status: 0,
          responseBodyPreview: "",
          responseSize: 0,
          requestBodySize: 0,
          sectionsDelta: 0,
          sectionsBefore: 0,
          verified: false,
          error: msg2
        });
        pushLog(`  \u2717 Exception: ${msg2}`);
      } finally {
        setTestRunning(false);
      }
    }
    const canAct = (phase === "ready" || phase === "dry_done") && connStatus === "alive";
    const isPasting = ["stage2_preparing", "stage3_mutating", "stage4_verifying"].includes(phase);
    const showResult = ["verified_success", "attempted_unverified", "attempt_failed"].includes(phase);
    const stagesDone = {
      s1: !["loading", "no_session", "no_item", "no_builder", "connecting", "conn_failed"].includes(phase),
      s2: ["stage3_mutating", "stage4_verifying", "verified_success", "attempted_unverified", "attempt_failed"].includes(phase),
      s3: ["stage4_verifying", "verified_success", "attempted_unverified", "attempt_failed"].includes(phase),
      s4: ["verified_success", "attempted_unverified", "attempt_failed"].includes(phase)
    };
    const stagesConfig = [
      { n: 1, label: "Session Ready", done: stagesDone.s1, active: activeStage === 1, failed: false },
      { n: 2, label: "Payload Prepared", done: stagesDone.s2, active: activeStage === 2, failed: false },
      { n: 3, label: "Mutation Attempted", done: stagesDone.s3, active: activeStage === 3, failed: phase === "attempt_failed" },
      { n: 4, label: "Verification", done: stagesDone.s4, active: activeStage === 4, failed: phase === "attempted_unverified" }
    ];
    const isErrorPhase = ["no_session", "no_item", "no_builder", "conn_failed"].includes(phase);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { minHeight: "100vh", background: "#080a12", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif", color: "#e2e8f0", overflowY: "auto" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: {
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 28px",
        background: "rgba(8,10,18,.96)",
        borderBottom: "1px solid rgba(99,102,241,.15)",
        backdropFilter: "blur(12px)"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 11, fontWeight: 900, color: "#a78bfa", letterSpacing: "0.1em", padding: "2px 9px", borderRadius: 5, background: "rgba(99,102,241,.2)", border: "1px solid rgba(99,102,241,.35)" }, children: "CL" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 14, fontWeight: 700, color: "#e2e8f0" }, children: "Paste Workbench" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 10, marginLeft: 4, color: canAct ? "#10b981" : isPasting ? "#818cf8" : showResult ? "#f59e0b" : "#6b7280" }, children: [
          "\u25CF ",
          canAct ? "Ready" : isPasting ? "Executing\u2026" : showResult ? "Complete" : phase
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { flex: 1 } }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: bootstrap, style: { fontSize: 10, padding: "4px 12px", borderRadius: 6, border: "1px solid #2a2d3d", background: "#111318", color: "#6b7280", cursor: "pointer" }, "data-testid": "btn-refresh", children: "\u21BB Refresh" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { maxWidth: 780, margin: "0 auto", padding: "28px 24px", display: "flex", flexDirection: "column", gap: 18 }, children: [
        phase === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: 60, color: "#4b5563" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { size: 20 }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 14 }, children: "Setting up paste session\u2026" })
        ] }),
        isErrorPhase && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { border: "1px solid rgba(248,113,113,.2)", background: "rgba(248,113,113,.04)" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 15, fontWeight: 700, color: "#f87171", marginBottom: 6 }, children: phase === "no_session" ? "No Paste Session" : phase === "no_item" ? "No Item Selected" : phase === "no_builder" ? "No Builder Detected" : "Content Script Unreachable" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, color: "#6b7280", lineHeight: 1.6, marginBottom: 16 }, children: lastError }),
          phase === "conn_failed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryBtn, { label: "Refresh connection", onClick: bootstrap, accent: "#6366f1", testId: "btn-refresh-conn" })
        ] }),
        !["loading", ...["no_session", "no_item", "no_builder", "conn_failed"]].includes(phase) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageBar, { stages: stagesConfig }),
          showResult && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultBanner, { phase, result: mutResult }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Stage 1 \u2014 Session Ready" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, { label: "Saved item loaded", value: item?.title || item?.domain || "\u2014", ok: !!item }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, { label: "Builder tab detected", value: builder ? `tab ${builder.tabId} \u2014 ${(builder.title ?? builder.url).slice(0, 45)}` : "\u2014", ok: !!builder }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, { label: "Content script", value: connStatus === "alive" ? "Connected" : connStatus === "dead" ? "Not connected" : "Connecting\u2026", ok: connStatus === "alive", warn: phase === "connecting" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, { label: "Ready to paste", value: canAct ? "YES" : "NO", ok: canAct, warn: !canAct && !isErrorPhase })
          ] }),
          item && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { padding: "16px 20px" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Selected Item" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 12, alignItems: "flex-start" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: 42, height: 42, borderRadius: 10, flexShrink: 0, background: "linear-gradient(135deg,#1e1b4b,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }, children: "\u{1F4C4}" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 2 }, children: item.title || item.domain }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 10.5, color: "#6b7280", marginBottom: 6 }, children: item.domain }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 9, padding: "1px 7px", borderRadius: 20, background: "rgba(99,102,241,.12)", color: "#818cf8", border: "1px solid rgba(99,102,241,.25)" }, children: item.pageType }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 9, padding: "1px 7px", borderRadius: 20, background: "rgba(255,255,255,.05)", color: "#6b7280" }, children: [
                    item.sections?.length ?? 0,
                    " sections"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 9, padding: "1px 7px", borderRadius: 20, background: "rgba(255,255,255,.05)", color: "#6b7280" }, children: [
                    item.assets?.length ?? 0,
                    " assets"
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            MutationStrategyPanel,
            {
              candidates,
              selectedCandidate,
              onSelect: (c) => {
                setStrategy(c);
                setTestSectionResult(null);
              },
              builderTabId: builder?.tabId ?? null,
              lastMutVerified,
              lastMutStatus,
              testResult: testSectionResult,
              onTestResult: setTestSectionResult,
              lastMutStrategy: mutResult?.strategy,
              lastFetchPath: mutResult?.fetchPath,
              activePasteStrategy,
              onRunTestSection: doTestSection,
              testRunning
            }
          ),
          !showResult && !isPasting && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
            !canAct && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 11, color: "#f59e0b", padding: "8px 14px", background: "rgba(245,158,11,.05)", borderRadius: 8, border: "1px solid rgba(245,158,11,.2)", textAlign: "center" }, children: [
              "\u26A0 Execute Paste is disabled \u2014 ",
              connStatus !== "alive" ? "content script not connected" : "readiness check failed"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryBtn, { label: "\u2191  Execute Paste", onClick: doExecutePaste, disabled: !canAct, accent: "#6366f1", testId: "btn-execute-paste" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryBtn, { label: "\u{1F50D}  Dry Run (preview only \u2014 no changes)", onClick: doDryRun, disabled: !canAct || phase === "dry_running", loading: phase === "dry_running", accent: "#374151", testId: "btn-dry-run" })
          ] }),
          isPasting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { size: 20 }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, color: "#818cf8" }, children: phase === "stage2_preparing" ? "Stage 2 \u2014 Preparing payload\u2026" : phase === "stage3_mutating" ? "Stage 3 \u2014 Attempting mutation\u2026" : "Stage 4 \u2014 Verifying builder change\u2026" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, color: "#4b5563", marginTop: 2 }, children: "See execution log below for live updates" })
            ] })
          ] }) }),
          phase === "dry_done" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { style: { border: "1px solid rgba(96,165,250,.2)", background: "rgba(96,165,250,.04)" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 13, fontWeight: 700, color: "#60a5fa", marginBottom: 6 }, children: "Dry Run Passed" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, color: "#6b7280", marginBottom: 12 }, children: "No changes were made. Review the log, then Execute Paste when ready." }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryBtn, { label: "\u2191  Execute Paste", onClick: doExecutePaste, disabled: !canAct, accent: "#6366f1", testId: "btn-execute-paste-after-dry" })
          ] }),
          showResult && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              onClick: () => {
                setPhase("ready");
                setMutResult(null);
                setExecLog([]);
                setLastError("");
                logRef.current = [];
              },
              style: { padding: "9px 20px", borderRadius: 9, border: "1px solid #2a2d3d", background: "#111318", color: "#6b7280", fontSize: 12, cursor: "pointer", fontWeight: 600 },
              "data-testid": "btn-try-again",
              children: "\u21BA Try again"
            }
          ),
          phase === "dry_done" && dryLog.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExecLog, { lines: dryLog, title: "Dry Run Log" }),
          execLog.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExecLog, { lines: execLog }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            LearnImportPathPanel,
            {
              builderTabId: builder?.tabId ?? null,
              builderUrl: builder?.url,
              onLearnComplete: (newCands) => {
                const merged = sortCandidatesByPriority([
                  ...newCands,
                  ...candidates.filter((c) => !newCands.find((n) => n.id === c.id))
                ]);
                setCandidates(merged);
                if (newCands.length > 0) setStrategy(newCands[0]);
                setTestSectionResult(null);
                if (newCands.length > 0) {
                  msg("SAVE_IMPORT_CANDIDATES", { candidates: newCands }).catch(() => {
                  });
                }
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DebugPanel, { session, item, builder, phase, lastError, connStatus, mutResult })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes spin { to { transform: rotate(360deg); } }` })
    ] });
  }
  console.log("[CloneLevel] paste.html: script evaluating, chrome available:", typeof chrome !== "undefined");
  var root = document.getElementById("paste-root");
  console.log("[CloneLevel] paste.html: #paste-root", root ? "found" : "NOT FOUND \u2014 blank page will result");
  if (root) {
    try {
      (0, import_client.createRoot)(root).render(
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PastePage, {}) })
      );
      console.log("[CloneLevel] paste.html: React mounted OK");
    } catch (e) {
      console.error("[CloneLevel] paste.html: mount threw:", e);
      root.innerHTML = `<div style="padding:32px;background:#0d1117;color:#f87171;font-family:monospace;min-height:100vh">
      <div style="font-size:14px;font-weight:700;margin-bottom:12px">\u26A0 CloneLevel \u2014 Mount Failed</div>
      <pre style="font-size:11px;white-space:pre-wrap">${String(e)}</pre>
    </div>`;
    }
  }
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
//# sourceMappingURL=paste.js.map
