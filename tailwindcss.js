/*! For license information please see https://cdn.tailwindcss.com/LICENSE */
!function() {
    "use strict";
    var t = {
        755: function(t, e, n) {
            var r = n(699).default;
            function o() {
                return "function" == typeof WeakMap ? (t.exports = o = function() {
                    return new WeakMap
                }
                ,
                o()) : (t.exports = o = function() {
                    return null
                }
                ,
                o())
            }
            t.exports = function(t, e) {
                if (t && "object" == typeof t) {
                    var n = o();
                    if (n)
                        return n.get(t) === e
                }
                return !1
            }
            ,
            t.exports.__esModule = !0,
            t.exports.default = t.exports
        },
        699: function(t) {
            t.exports = function(t, e) {
                if (t && t.length) {
                    var n = t.indexOf(e);
                    if (n > -1)
                        return t.splice(n, 1)
                }
            }
            ,
            t.exports.__esModule = !0,
            t.exports.default = t.exports
        },
        46: function(t, e, n) {
            var r = n(755).default;
            t.exports = function(t, e) {
                var n = r(t, e);
                if (t && "object" == typeof t && !n) {
                    var o = o();
                    if (o)
                        o.set(t, e);
                    else
                        ;
                }
            }
            ,
            t.exports.__esModule = !0,
            t.exports.default = t.exports
        }
    }
      , e = {};
    function n(r) {
        var o = e[r];
        if (void 0 !== o)
            return o.exports;
        var i = e[r] = {
            exports: {}
        };
        return t[r](i, i.exports, n),
        i.exports
    }
    n.d = function(t, e) {
        for (var r in e)
            n.o(e, r) && !n.o(t, r) && Object.defineProperty(t, r, {
                enumerable: !0,
                get: e[r]
            })
    }
    ,
    n.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }
    ,
    function() {
        var t, e = function() {
            function t(t) {
                var e = this;
                this.options = t,
                this.selectors = [],
                this.declarations = [],
                this.atRules = [],
                this.handle = function(t) {
                    return "rule" === t.type ? e.rule(t) : "decl" === t.type ? e.decl(t) : "at-rule" === t.type ? e.atRule(t) : void 0
                }
            }
            return t.prototype.rule = function(t) {
                if (t.parent && "rule" === t.parent.type) {
                    var e = this.selectors[this.selectors.length - 1]
                      , n = e ? e + " " : "";
                    this.selectors[this.selectors.length - 1] = n + t.selectors.join(", ")
                } else
                    t.selectors.forEach((function(t) {
                        e.selectors.push(t)
                    }
                    ));
                this.walk(t.nodes),
                this.selectors.pop()
            }
            ,
            t.prototype.decl = function(t) {
                this.declarations.push(t)
            }
            ,
            t.prototype.atRule = function(t) {
                this.atRules.push(t),
                this.walk(t.nodes)
            }
            ,
            t.prototype.walk = function(t) {
                var e = this;
                t && t.forEach((function(t) {
                    e.handle(t)
                }
                ))
            }
            ,
            t
        }(), r = {
            attributes: !0,
            characterData: !0,
            childList: !0,
            subtree: !0
        };
        function o(t, e) {
            return t.reduce((function(t, n) {
                return t.concat(e(n))
            }
            ), [])
        }
        function i(t) {
            return t.value.replace(/:/g, "\\:").replace(/\//g, "\\/").replace(/%/g, "\\%")
        }
        function a(t) {
            if (!t)
                return "";
            var e = o(t.attributes || [], (function(t) {
                return "[" + t.name + '="' + t.value + '"]'
            }
            )).join("");
            return "" + t.tag + e
        }
        function s(t) {
            var e = function(t) {
                var e = a(t.el);
                return t.parent ? "" + s(t.parent) + (e ? " " : "") + e : e
            }(t);
            return {
                selector: e.replace(/>/g, " > "),
                rules: t.rules.map(i).sort()
            }
        }
        function c(t) {
            return t.selector + JSON.stringify(t.rules)
        }
        function u(t) {
            return t.map(s).filter((function(t) {
                return t.selector
            }
            )).sort((function(t, e) {
                return t.selector > e.selector ? 1 : -1
            }
            )).filter((function(t, e, n) {
                return e > 0 ? c(t) !== c(n[e - 1]) : t
            }
            )).reduce((function(t, e) {
                return e.rules.length ? t + e.selector + "{" + e.rules.join(";") + "}" : t
            }
            ), "")
        }
        var l = "undefined" != typeof window ? window : "undefined" != typeof self ? self : {};
        function f(t) {
            return t.split(" ").map((function(t) {
                var e = t.split(":");
                return {
                    key: e[0],
                    value: e.slice(1).join(":")
                }
            }
            ))
        }
        function d(t) {
            return f(t).reduce((function(t, e) {
                return t[e.key] = e.value,
                t
            }
            ), {})
        }
        var p = []
          , h = null;
        function m() {
            var t = document.querySelector("#__play");
            if (t) {
                var e = function() {
                    var t, e, n = d(document.querySelector('meta[name="play-config"]').content);
                    if (l.tailwind)
                        return (t = l.tailwind).config ? t.config = Object.assign(t.config, {
                            ...n,
                            plugins: p
                        }) : t.config = {
                            ...n,
                            plugins: p
                        },
                        "undefined" != typeof BroadcastChannel ? ((e = new BroadcastChannel("tailwindcss-play-channel")).postMessage({
                            type: "config",
                            payload: l.tailwind.config
                        }),
                        e.close()) : parent.postMessage({
                            type: "config",
                            payload: l.tailwind.config
                        }, "*"),
                        l.tailwind;
                    var r = document.createElement("script");
                    return r.src = "https://cdn.tailwindcss.com/v1?plugins=" + function(t) {
                        return t.map((function(t) {
                            return t.name
                        }
                        )).join(",")
                    }(p),
                    document.head.appendChild(r),
                    r.onload = function() {
                        l.tailwind.config = {
                            ...n,
                            plugins: p
                        }
                    }
                    ,
                    l.tailwind
                }();
                if (!e)
                    return;
                var n = new function() {
                    function t(t) {
                        this.ast = t
                    }
                    return t.prototype.walk = function(e, n) {
                        this.ast.forEach((function(r) {
                            "rule" === r.type && r.selectors.includes(e) && n(r)
                        }
                        ))
                    }
                    ,
                    t
                }(l.tailwind.generated || [])
                  , o = document.querySelector("style[type='text/tailwindcss']")
                  , i = function() {
                    var t = []
                      , o = new WeakMap;
                    function i(n) {
                        var a = o.get(n);
                        if (a)
                            return a;
                        if (n.hasAttribute("play-ignore"))
                            return null;
                        var s = []
                          , c = [];
                        if (n.hasAttribute("class")) {
                            var u = n.getAttribute("class").trim();
                            u && (s = u.split(" ").filter((function(t) {
                                return t.includes(":")
                            }
                            )))
                        }
                        if (n.hasAttribute("play")) {
                            var l = n.getAttribute("play").trim();
                            l && (c = l.split(" ").filter(Boolean))
                        }
                        if (!s.length && !c.length)
                            return null;
                        var d = {
                            el: {
                                tag: n.tagName.toLowerCase(),
                                attributes: Array.from(n.attributes).filter((function(t) {
                                    return "class" !== t.name && "play" !== t.name
                                }
                                )).map((function(t) {
                                    return {
                                        name: t.name,
                                        value: t.value
                                    }
                                }
                                )).sort((function(t, e) {
                                    return t.name > e.name ? 1 : -1
                                }
                                ))
                            },
                            rules: [],
                            parent: null
                        };
                        n.parentElement && (d.parent = i(n.parentElement)),
                        s.length && s.forEach((function(e) {
                            var o = {
                                rule: e,
                                applied: !1
                            }
                              , a = [];
                            n.walk("." + i(e), (function(t) {
                                a.push.apply(a, t.nodes)
                            }
                            )),
                            a.length && (o.applied = !0,
                            d.rules.push.apply(d.rules, a))
                        }
                        )),
                        c.length && c.forEach((function(t) {
                            d.rules.push(t)
                        }
                        ));
                        var p = d.rules.length ? new e({
                            root: d.el,
                            rules: d.rules
                        }) : null;
                        p && p.walk(p.options.rules);
                        var h = p ? p.declarations.map((function(t) {
                            return t.prop + ":" + t.value
                        }
                        )) : [];
                        d.rules = h;
                        var m = {
                            ...d
                        };
                        return o.set(n, m),
                        t.push(m),
                        m
                    }
                    return function(e, n) {
                        return Array.from(e.querySelectorAll("*")).map(n),
                        t
                    }
                }()(t, (function(r) {
                    var a = new MutationObserver((function() {
                        !function(r, a) {
                            if (h)
                                return clearTimeout(h),
                                void (h = setTimeout(i, 100));
                            var s = u(a)
                              , c = n(699).default
                              , l = n(46).default;
                            c(t, r),
                            l(r, a),
                            t.push(a),
                            o.innerHTML = s,
                            h = setTimeout(i, 100)
                        }(r, i(r))
                    }
                    ));
                    a.observe(r, {
                        attributes: !0
                    })
                }
                ));
                o.innerHTML = u(i)
            }
        }
        "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", m) : m(),
        "undefined" != typeof MutationObserver && new MutationObserver(m).observe(document.documentElement, r)
    }()
}();
