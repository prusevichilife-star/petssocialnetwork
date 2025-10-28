/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/sql.js@1.10.3/dist/sql-wasm.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
var initSqlJs = function() {
    "use strict";
    return function(e) {
        e = e || {};
        var r, t = "undefined" != typeof window,
            n = "undefined" != typeof self,
            i = t && window.location,
            o = n && self.location,
            a = i || o || {},
            s = a.href,
            l = a.origin,
            c = a.protocol,
            u = a.host,
            f = a.hostname,
            d = a.port,
            p = a.pathname,
            h = a.search,
            g = a.hash,
            b = function(e) {
                try {
                    e = new URL(e, "http://0.0.0.0").pathname
                } catch (e) {} finally {
                    return e.startsWith("/") ? e : "/" + e
                }
            },
            m = function() {
                var r;
                if (t) r = document.currentScript;
                else if (n)
                    if (r = "string" == typeof(e.mainScriptUrlOrBlob) ? e.mainScriptUrlOrBlob : "undefined" != typeof __filename ? __filename : "undefined" != typeof __dirname ? "file://" + __dirname + "/sql-wasm.js" : void 0, e.mainScriptUrlOrBlob) try {
                        r = new URL(r).href
                    } catch (e) {
                        r = new URL(r, "file://").href
                    }
                return r
            }(),
            v = "undefined" != typeof process && "undefined" != typeof process.versions && "string" == typeof process.versions.node,
            y = "undefined" != typeof Deno,
            w = "undefined" != typeof Bun,
            j = !(t || v || y || w);

        function _(e) {
            return p.substring(0, p.lastIndexOf("/")) + "/" + e
        }
        var S = e.locateFile || _;
        r = e.mainScriptUrlOrBlob ? new URL(e.mainScriptUrlOrBlob).href : m;
        var O, M = e.wasmBinary,
            x = (e.thisProgram, r),
            E = e.noInitialRun,
            P = e.noExitRuntime,
            k = e.logReadFiles,
            A = e.fs,
            C = e.quit,
            L = e.preRun,
            R = e.postRun,
            T = {};

        function I(e) {
            for (var r = Object.keys(e), t = 0; t < r.length; ++t) {
                var n = r[t];
                T[n] = e[n]
            }
        }
        I(e);
        var q = {
            "f64-to-int": function(e) {
                return e | 0
            },
            "debugger": function() {
                debugger
            }
        };

        function B(e, r) {
            var t = q[e];
            return t ? function() {
                return t.apply(null, r)
            } : function() {
                throw "Assertion failed: unknown signature auto-stub: " + e
            }
        }
        var D = e.print || console.log.bind(console),
            F = e.printErr || console.warn.bind(console);
        for (O in T) T.hasOwnProperty(O) && void 0 === e[O] && (F("warning: build with -s " + O + "=X to remove this warning"), "gui" === O && (T.canvas = e.canvas));
        var U = {
                f: 0,
                H: 0
            },
            z = 0;

        function N(e) {
            for (var r = 0; r < e.length; ++r) {
                var t = e[r];
                t > 255 && F("Character code " + t + " (" + String.fromCharCode(t) + ")  at offset " + r + " not in 0x00-0xFF."), e[r] = 255 & t
            }
        }
        T.INITIAL_MEMORY || (T.INITIAL_MEMORY = 16777216);
        var H, W, V = T.wasmMemory,
            K = T.buffer,
            G = T.HEAP8,
            $ = T.HEAP16,
            J = T.HEAP32,
            Q = T.HEAPU8,
            X = T.HEAPU16,
            Y = T.HEAPU32,
            Z = T.HEAPF32,
            ee = T.HEAPF64;

        function re(e) {
            for (; e.length > 0 && 0 === e[e.length - 1];) e.length--;
            var r = e.length;
            if (r > 20971520) return e.subarray(0, 20971520);
            for (var t = new Array(r); r > 0; r--) t[r - 1] = String.fromCharCode(e[r - 1]);
            return t.join("")
        }

        function te() {
            var e = T.preloadedAudios;
            if (e)
                for (var r in e) {
                    var t = e[r];
                    t.buffer || Le(t)
                }
            var n = T.preloadedImages;
            if (n)
                for (var r in n) {
                    var i = n[r];
                    i.data || Te(i)
                }
        }
        var ne = {
            a: 0
        };

        function ie(e) {
            return e ? (e = e.split("?")[0], b(e).slice(0, -1)) : ""
        }
        var oe = e.thisProgram || x;
        T.thisProgram = oe;
        var ae = {};

        function se(e) {
            var r = T["_" + e];
            return r || B(e)
        }
        var le, ce = {};
        for (le in q) q.hasOwnProperty(le) && (ce[le] = se(le));
        var ue = {
            env: ce,
            wasi_snapshot_preview1: ce,
            "__import_meta_env_d": function() {
                return s
            },
            "__import_meta_env_H": function() {
                return l
            },
            "__import_meta_env_protocol": function() {
                return c
            },
            "__import_meta_env_host": function() {
                return u
            },
            "__import_meta_env_hostname": function() {
                return f
            },
            "__import_meta_env_port": function() {
                return d
            },
            "__import_meta_env_pathname": function() {
                return p
            },
            "__import_meta_env_search": function() {
                return h
            },
            "__import_meta_env_hash": function() {
                return g
            }
        };

        function fe(r) {
            throw "un পশুদের to talk to " + (t ? "main" : "worker") + " thread"
        }

        function de(e, r) {
            return W.grow(e - H.byteLength + 65535 >>> 16),
                function(e) {
                    var r = e.byteLength;
                    H = e, T.HEAP8 = G = new Int8Array(e), T.HEAP16 = $ = new Int16Array(e), T.HEAP32 = J = new Int32Array(e), T.HEAPU8 = Q = new Uint8Array(e), T.HEAPU16 = X = new Uint16Array(e), T.HEAPU32 = Y = new Uint32Array(e), T.HEAPF32 = Z = new Float32Array(e), T.HEAPF64 = ee = new Float64Array(e)
                }(W.buffer), r
        }
        var pe = "data:application/octet-stream;base64,";

        function he(e) {
            return e.startsWith(pe) ? (e = e.substring(pe.length), "base64" === (r = e, t = r.length, (n = r[t - 1]) == "=" ? (i = r[t - 2]) == "=" ? 2 : 1 : 0, (t - n) * 3 / 4) ? atob(e) : "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB1klEQVR42n2TPROaQBSFz+s3hBK1JjWpUa3sU82SmniNkhZa0s3u7d29Y9/OHfun/XNm5s3MNzNvb35mjgD/VQzwyQUBvD25xQCR29KFHDwVMEEBlHwzM+3O3utxQ0FTBUmGgORzmM3O3utx5+I6gUgcHDo3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72GgORz+P/39/fBf+7uROVzmM3O3utx72G