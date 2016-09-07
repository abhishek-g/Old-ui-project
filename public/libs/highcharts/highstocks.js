/*
 Highstock JS v2.1.5 (2015-04-13)

 (c) 2009-2014 Torstein Honsi

 License: www.highcharts.com/license
*/
(function () {
    function y() {
        var a, b = arguments,
            c, d = {},
            e = function (a, b) {
                var c, d;
                typeof a !== "object" && (a = {});
                for (d in b) b.hasOwnProperty(d) && (c = b[d], a[d] = c && typeof c === "object" && Object.prototype.toString.call(c) !== "[object Array]" && d !== "renderTo" && typeof c.nodeType !== "number" ? e(a[d] || {}, c) : b[d]);
                return a
            };
        b[0] === !0 && (d = b[1], b = Array.prototype.slice.call(b, 2));
        c = b.length;
        for (a = 0; a < c; a++) d = e(d, b[a]);
        return d
    }

    function C(a, b) {
        return parseInt(a, b || 10)
    }

    function Ja(a) {
        return typeof a === "string"
    }

    function ia(a) {
        return a &&
            typeof a === "object"
    }

    function Ka(a) {
        return Object.prototype.toString.call(a) === "[object Array]"
    }

    function sa(a) {
        return typeof a === "number"
    }

    function La(a) {
        return X.log(a) / X.LN10
    }

    function ta(a) {
        return X.pow(10, a)
    }

    function ua(a, b) {
        for (var c = a.length; c--;)
            if (a[c] === b) {
                a.splice(c, 1);
                break
            }
    }

    function r(a) {
        return a !== s && a !== null
    }

    function V(a, b, c) {
        var d, e;
        if (Ja(b)) r(c) ? a.setAttribute(b, c) : a && a.getAttribute && (e = a.getAttribute(b));
        else if (r(b) && ia(b))
            for (d in b) a.setAttribute(d, b[d]);
        return e
    }

    function pa(a) {
        return Ka(a) ?
            a : [a]
    }

    function L(a, b) {
        if (Ea && !ea && b && b.opacity !== s) b.filter = "alpha(opacity=" + b.opacity * 100 + ")";
        x(a.style, b)
    }

    function aa(a, b, c, d, e) {
        a = D.createElement(a);
        b && x(a, b);
        e && L(a, {
            padding: 0,
            border: Z,
            margin: 0
        });
        c && L(a, c);
        d && d.appendChild(a);
        return a
    }

    function ja(a, b) {
        var c = function () {
            return s
        };
        c.prototype = new a;
        x(c.prototype, b);
        return c
    }

    function Ra(a, b) {
        return Array((b || 2) + 1 - String(a).length).join(0) + a
    }

    function bb(a) {
        return (kb && kb(a) || ub || 0) * 6E4
    }

    function Ma(a, b) {
        for (var c = "{", d = !1, e, f, g, h, i, j = [];
            (c = a.indexOf(c)) !==
            -1;) {
            e = a.slice(0, c);
            if (d) {
                f = e.split(":");
                g = f.shift().split(".");
                i = g.length;
                e = b;
                for (h = 0; h < i; h++) e = e[g[h]];
                if (f.length) f = f.join(":"), g = /\.([0-9])/, h = P.lang, i = void 0, /f$/.test(f) ? (i = (i = f.match(g)) ? i[1] : -1, e !== null && (e = A.numberFormat(e, i, h.decimalPoint, f.indexOf(",") > -1 ? h.thousandsSep : ""))) : e = ka(f, e)
            }
            j.push(e);
            a = a.slice(c + 1);
            c = (d = !d) ? "}" : "{"
        }
        j.push(a);
        return j.join("")
    }

    function vb(a) {
        return X.pow(10, W(X.log(a) / X.LN10))
    }

    function wb(a, b, c, d, e) {
        var f, g = a,
            c = p(c, 1);
        f = a / c;
        b || (b = [1, 2, 2.5, 5, 10], d === !1 && (c ===
            1 ? b = [1, 2, 5, 10] : c <= 0.1 && (b = [1 / c])));
        for (d = 0; d < b.length; d++)
            if (g = b[d], e && g * c >= a || !e && f <= (b[d] + (b[d + 1] || b[d])) / 2) break;
        g *= c;
        return g
    }

    function xb(a, b) {
        var c = a.length,
            d, e;
        for (e = 0; e < c; e++) a[e].ss_i = e;
        a.sort(function (a, c) {
            d = b(a, c);
            return d === 0 ? a.ss_i - c.ss_i : d
        });
        for (e = 0; e < c; e++) delete a[e].ss_i
    }

    function Sa(a) {
        for (var b = a.length, c = a[0]; b--;) a[b] < c && (c = a[b]);
        return c
    }

    function Fa(a) {
        for (var b = a.length, c = a[0]; b--;) a[b] > c && (c = a[b]);
        return c
    }

    function Na(a, b) {
        for (var c in a) a[c] && a[c] !== b && a[c].destroy && a[c].destroy(),
            delete a[c]
    }

    function Ta(a) {
        lb || (lb = aa(Ua));
        a && lb.appendChild(a);
        lb.innerHTML = ""
    }

    function qa(a, b) {
        var c = "Highcharts error #" + a + ": www.highcharts.com/errors/" + a;
        if (b) throw c;
        S.console && console.log(c)
    }

    function la(a) {
        return parseFloat(a.toPrecision(14))
    }

    function Ya(a, b) {
        Ga = p(a, b.animation)
    }

    function Nb() {
        var a = P.global,
            b = a.useUTC,
            c = b ? "getUTC" : "get",
            d = b ? "setUTC" : "set";
        fa = a.Date || window.Date;
        ub = b && a.timezoneOffset;
        kb = b && a.getTimezoneOffset;
        mb = function (a, c, d, h, i, j) {
            var k;
            b ? (k = fa.UTC.apply(0, arguments), k +=
                bb(k)) : k = (new fa(a, c, p(d, 1), p(h, 0), p(i, 0), p(j, 0))).getTime();
            return k
        };
        yb = c + "Minutes";
        zb = c + "Hours";
        Ab = c + "Day";
        cb = c + "Date";
        db = c + "Month";
        eb = c + "FullYear";
        Ob = d + "Milliseconds";
        Pb = d + "Seconds";
        Qb = d + "Minutes";
        Rb = d + "Hours";
        Bb = d + "Date";
        Cb = d + "Month";
        Db = d + "FullYear"
    }

    function Y() {}

    function Za(a, b, c, d) {
        this.axis = a;
        this.pos = b;
        this.type = c || "";
        this.isNew = !0;
        !c && !d && this.addLabel()
    }

    function Sb(a, b, c, d, e) {
        var f = a.chart.inverted;
        this.axis = a;
        this.isNegative = c;
        this.options = b;
        this.x = d;
        this.total = null;
        this.points = {};
        this.stack =
            e;
        this.alignOptions = {
            align: b.align || (f ? c ? "left" : "right" : "center"),
            verticalAlign: b.verticalAlign || (f ? "middle" : c ? "bottom" : "top"),
            y: p(b.y, f ? 4 : c ? 14 : -6),
            x: p(b.x, f ? c ? -6 : 6 : 0)
        };
        this.textAlign = b.textAlign || (f ? c ? "right" : "left" : "center")
    }

    function Eb(a) {
        var b = a.options,
            c = b.navigator,
            d = c.enabled,
            b = b.scrollbar,
            e = b.enabled,
            f = d ? c.height : 0,
            g = e ? b.height : 0;
        this.handles = [];
        this.scrollbarButtons = [];
        this.elementsToDestroy = [];
        this.chart = a;
        this.setBaseSeries();
        this.height = f;
        this.scrollbarHeight = g;
        this.scrollbarEnabled = e;
        this.navigatorEnabled = d;
        this.navigatorOptions = c;
        this.scrollbarOptions = b;
        this.outlineHeight = f + g;
        this.init()
    }

    function Fb(a) {
        this.init(a)
    }
    var s, D = document,
        S = window,
        X = Math,
        w = X.round,
        W = X.floor,
        za = X.ceil,
        v = X.max,
        B = X.min,
        Q = X.abs,
        ba = X.cos,
        ga = X.sin,
        va = X.PI,
        ra = va * 2 / 360,
        Ha = navigator.userAgent,
        Tb = S.opera,
        Ea = /(msie|trident)/i.test(Ha) && !Tb,
        nb = D.documentMode === 8,
        Gb = /AppleWebKit/.test(Ha),
        Va = /Firefox/.test(Ha),
        fb = /(Mobile|Android|Windows Phone)/.test(Ha),
        Ia = "http://www.w3.org/2000/svg",
        ea = !!D.createElementNS && !!D.createElementNS(Ia,
            "svg").createSVGRect,
        Yb = Va && parseInt(Ha.split("Firefox/")[1], 10) < 4,
        ma = !ea && !Ea && !!D.createElement("canvas").getContext,
        Wa, $a, Ub = {},
        Hb = 0,
        lb, P, ka, Ga, Ib, H, ha = function () {
            return s
        },
        ca = [],
        gb = 0,
        Ua = "div",
        Z = "none",
        Zb = /^[0-9]+$/,
        ob = ["plotTop", "marginRight", "marginBottom", "plotLeft"],
        $b = "stroke-width",
        fa, mb, ub, kb, yb, zb, Ab, cb, db, eb, Ob, Pb, Qb, Rb, Bb, Cb, Db, K = {},
        A;
    A = S.Highcharts = S.Highcharts ? qa(16, !0) : {};
    A.seriesTypes = K;
    var x = A.extend = function (a, b) {
            var c;
            a || (a = {});
            for (c in b) a[c] = b[c];
            return a
        },
        p = A.pick = function () {
            var a =
                arguments,
                b, c, d = a.length;
            for (b = 0; b < d; b++)
                if (c = a[b], c !== s && c !== null) return c
        },
        R = A.wrap = function (a, b, c) {
            var d = a[b];
            a[b] = function () {
                var a = Array.prototype.slice.call(arguments);
                a.unshift(d);
                return c.apply(this, a)
            }
        };
    ka = function (a, b, c) {
        if (!r(b) || isNaN(b)) return "Invalid date";
        var a = p(a, "%Y-%m-%d %H:%M:%S"),
            d = new fa(b - bb(b)),
            e, f = d[zb](),
            g = d[Ab](),
            h = d[cb](),
            i = d[db](),
            j = d[eb](),
            k = P.lang,
            m = k.weekdays,
            d = x({
                a: m[g].substr(0, 3),
                A: m[g],
                d: Ra(h),
                e: h,
                w: g,
                b: k.shortMonths[i],
                B: k.months[i],
                m: Ra(i + 1),
                y: j.toString().substr(2,
                    2),
                Y: j,
                H: Ra(f),
                I: Ra(f % 12 || 12),
                l: f % 12 || 12,
                M: Ra(d[yb]()),
                p: f < 12 ? "AM" : "PM",
                P: f < 12 ? "am" : "pm",
                S: Ra(d.getSeconds()),
                L: Ra(w(b % 1E3), 3)
            }, A.dateFormats);
        for (e in d)
            for (; a.indexOf("%" + e) !== -1;) a = a.replace("%" + e, typeof d[e] === "function" ? d[e](b) : d[e]);
        return c ? a.substr(0, 1).toUpperCase() + a.substr(1) : a
    };
    H = {
        millisecond: 1,
        second: 1E3,
        minute: 6E4,
        hour: 36E5,
        day: 864E5,
        week: 6048E5,
        month: 24192E5,
        year: 314496E5
    };
    A.numberFormat = function (a, b, c, d) {
        var e = P.lang,
            a = +a || 0,
            f = b === -1 ? B((a.toString().split(".")[1] || "").length, 20) : isNaN(b =
                Q(b)) ? 2 : b,
            b = c === void 0 ? e.decimalPoint : c,
            d = d === void 0 ? e.thousandsSep : d,
            e = a < 0 ? "-" : "",
            c = String(C(a = Q(a).toFixed(f))),
            g = c.length > 3 ? c.length % 3 : 0;
        return e + (g ? c.substr(0, g) + d : "") + c.substr(g).replace(/(\d{3})(?=\d)/g, "$1" + d) + (f ? b + Q(a - c).toFixed(f).slice(2) : "")
    };
    Ib = {
        init: function (a, b, c) {
            var b = b || "",
                d = a.shift,
                e = b.indexOf("C") > -1,
                f = e ? 7 : 3,
                g, b = b.split(" "),
                c = [].concat(c),
                h, i, j = function (a) {
                    for (g = a.length; g--;) a[g] === "M" && a.splice(g + 1, 0, a[g + 1], a[g + 2], a[g + 1], a[g + 2])
                };
            e && (j(b), j(c));
            a.isArea && (h = b.splice(b.length -
                6, 6), i = c.splice(c.length - 6, 6));
            if (d <= c.length / f && b.length === c.length)
                for (; d--;) c = [].concat(c).splice(0, f).concat(c);
            a.shift = 0;
            if (b.length)
                for (a = c.length; b.length < a;) d = [].concat(b).splice(b.length - f, f), e && (d[f - 6] = d[f - 2], d[f - 5] = d[f - 1]), b = b.concat(d);
            h && (b = b.concat(h), c = c.concat(i));
            return [b, c]
        },
        step: function (a, b, c, d) {
            var e = [],
                f = a.length;
            if (c === 1) e = d;
            else if (f === b.length && c < 1)
                for (; f--;) d = parseFloat(a[f]), e[f] = isNaN(d) ? a[f] : c * parseFloat(b[f] - d) + d;
            else e = b;
            return e
        }
    };
    (function (a) {
        S.HighchartsAdapter = S.HighchartsAdapter ||
            a && {
                init: function (b) {
                    var c = a.fx;
                    a.extend(a.easing, {
                        easeOutQuad: function (a, b, c, g, h) {
                            return -g * (b /= h) * (b - 2) + c
                        }
                    });
                    a.each(["cur", "_default", "width", "height", "opacity"], function (b, e) {
                        var f = c.step,
                            g;
                        e === "cur" ? f = c.prototype : e === "_default" && a.Tween && (f = a.Tween.propHooks[e], e = "set");
                        (g = f[e]) && (f[e] = function (a) {
                            var c, a = b ? a : this;
                            if (a.prop !== "align") return c = a.elem, c.attr ? c.attr(a.prop, e === "cur" ? s : a.now) : g.apply(this, arguments)
                        })
                    });
                    R(a.cssHooks.opacity, "get", function (a, b, c) {
                        return b.attr ? b.opacity || 0 : a.call(this,
                            b, c)
                    });
                    this.addAnimSetter("d", function (a) {
                        var c = a.elem,
                            f;
                        if (!a.started) f = b.init(c, c.d, c.toD), a.start = f[0], a.end = f[1], a.started = !0;
                        c.attr("d", b.step(a.start, a.end, a.pos, c.toD))
                    });
                    this.each = Array.prototype.forEach ? function (a, b) {
                        return Array.prototype.forEach.call(a, b)
                    } : function (a, b) {
                        var c, g = a.length;
                        for (c = 0; c < g; c++)
                            if (b.call(a[c], a[c], c, a) === !1) return c
                    };
                    a.fn.highcharts = function () {
                        var a = "Chart",
                            b = arguments,
                            c, g;
                        if (this[0]) {
                            Ja(b[0]) && (a = b[0], b = Array.prototype.slice.call(b, 1));
                            c = b[0];
                            if (c !== s) c.chart =
                                c.chart || {}, c.chart.renderTo = this[0], new A[a](c, b[1]), g = this;
                            c === s && (g = ca[V(this[0], "data-highcharts-chart")])
                        }
                        return g
                    }
                },
                addAnimSetter: function (b, c) {
                    a.Tween ? a.Tween.propHooks[b] = {
                        set: c
                    } : a.fx.step[b] = c
                },
                getScript: a.getScript,
                inArray: a.inArray,
                adapterRun: function (b, c) {
                    return a(b)[c]()
                },
                grep: a.grep,
                map: function (a, c) {
                    for (var d = [], e = 0, f = a.length; e < f; e++) d[e] = c.call(a[e], a[e], e, a);
                    return d
                },
                offset: function (b) {
                    return a(b).offset()
                },
                addEvent: function (b, c, d) {
                    a(b).bind(c, d)
                },
                removeEvent: function (b, c, d) {
                    var e =
                        D.removeEventListener ? "removeEventListener" : "detachEvent";
                    D[e] && b && !b[e] && (b[e] = function () {});
                    a(b).unbind(c, d)
                },
                fireEvent: function (b, c, d, e) {
                    var f = a.Event(c),
                        g = "detached" + c,
                        h;
                    !Ea && d && (delete d.layerX, delete d.layerY, delete d.returnValue);
                    x(f, d);
                    b[c] && (b[g] = b[c], b[c] = null);
                    a.each(["preventDefault", "stopPropagation"], function (a, b) {
                        var c = f[b];
                        f[b] = function () {
                            try {
                                c.call(f)
                            } catch (a) {
                                b === "preventDefault" && (h = !0)
                            }
                        }
                    });
                    a(b).trigger(f);
                    b[g] && (b[c] = b[g], b[g] = null);
                    e && !f.isDefaultPrevented() && !h && e(f)
                },
                washMouseEvent: function (a) {
                    var c =
                        a.originalEvent || a;
                    if (c.pageX === s) c.pageX = a.pageX, c.pageY = a.pageY;
                    return c
                },
                animate: function (b, c, d) {
                    var e = a(b);
                    if (!b.style) b.style = {};
                    if (c.d) b.toD = c.d, c.d = 1;
                    e.stop();
                    c.opacity !== s && b.attr && (c.opacity += "px");
                    b.hasAnim = 1;
                    e.animate(c, d)
                },
                stop: function (b) {
                    b.hasAnim && a(b).stop()
                }
            }
    })(S.jQuery);
    var N = S.HighchartsAdapter,
        G = N || {};
    N && N.init.call(N, Ib);
    var pb = G.adapterRun,
        ac = G.getScript,
        Oa = G.inArray,
        n = A.each = G.each,
        hb = G.grep,
        bc = G.offset,
        Aa = G.map,
        E = G.addEvent,
        T = G.removeEvent,
        F = G.fireEvent,
        cc = G.washMouseEvent,
        qb = G.animate,
        ab = G.stop;
    P = {
        colors: "#7cb5ec,#434348,#90ed7d,#f7a35c,#8085e9,#f15c80,#e4d354,#2b908f,#f45b5b,#91e8e1".split(","),
        symbols: ["circle", "diamond", "square", "triangle", "triangle-down"],
        lang: {
            loading: "Loading...",
            months: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
            shortMonths: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
            weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
            decimalPoint: ".",
            numericSymbols: "k,M,G,T,P,E".split(","),
            resetZoom: "Reset zoom",
            resetZoomTitle: "Reset zoom level 1:1",
            thousandsSep: " "
        },
        global: {
            useUTC: !0,
            canvasToolsURL: "http://code.highcharts.com/stock/2.1.5/modules/canvas-tools.js",
            VMLRadialGradientURL: "http://code.highcharts.com/stock/2.1.5/gfx/vml-radial-gradient.png"
        },
        chart: {
            borderColor: "#4572A7",
            borderRadius: 0,
            defaultSeriesType: "line",
            ignoreHiddenSeries: !0,
            spacing: [10, 10, 15, 10],
            backgroundColor: "#FFFFFF",
            plotBorderColor: "#C0C0C0",
            resetZoomButton: {
                theme: {
                    zIndex: 20
                },
                position: {
                    align: "right",
                    x: -10,
                    y: 10
                }
            }
        },
        title: {
            text: "Chart title",
            align: "center",
            margin: 15,
            style: {
                color: "#333333",
                fontSize: "18px"
            }
        },
        subtitle: {
            text: "",
            align: "center",
            style: {
                color: "#555555"
            }
        },
        plotOptions: {
            line: {
                allowPointSelect: !1,
                showCheckbox: !1,
                animation: {
                    duration: 1E3
                },
                events: {},
                lineWidth: 2,
                marker: {
                    lineWidth: 0,
                    radius: 4,
                    lineColor: "#FFFFFF",
                    states: {
                        hover: {
                            enabled: !0,
                            lineWidthPlus: 1,
                            radiusPlus: 2
                        },
                        select: {
                            fillColor: "#FFFFFF",
                            lineColor: "#000000",
                            lineWidth: 2
                        }
                    }
                },
                point: {
                    events: {}
                },
                dataLabels: {
                    align: "center",
                    formatter: function () {
                        return this.y ===
                            null ? "" : A.numberFormat(this.y, -1)
                    },
                    style: {
                        color: "contrast",
                        fontSize: "11px",
                        fontWeight: "bold",
                        textShadow: "0 0 6px contrast, 0 0 3px contrast"
                    },
                    verticalAlign: "bottom",
                    x: 0,
                    y: 0,
                    padding: 5
                },
                cropThreshold: 300,
                pointRange: 0,
                states: {
                    hover: {
                        lineWidthPlus: 1,
                        marker: {},
                        halo: {
                            size: 10,
                            opacity: 0.25
                        }
                    },
                    select: {
                        marker: {}
                    }
                },
                stickyTracking: !0,
                turboThreshold: 1E3
            }
        },
        labels: {
            style: {
                position: "absolute",
                color: "#3E576F"
            }
        },
        legend: {
            enabled: !0,
            align: "center",
            layout: "horizontal",
            labelFormatter: function () {
                return this.name
            },
            borderColor: "#909090",
            borderRadius: 0,
            navigation: {
                activeColor: "#274b6d",
                inactiveColor: "#CCC"
            },
            shadow: !1,
            itemStyle: {
                color: "#333333",
                fontSize: "12px",
                fontWeight: "bold"
            },
            itemHoverStyle: {
                color: "#000"
            },
            itemHiddenStyle: {
                color: "#CCC"
            },
            itemCheckboxStyle: {
                position: "absolute",
                width: "13px",
                height: "13px"
            },
            symbolPadding: 5,
            verticalAlign: "bottom",
            x: 0,
            y: 0,
            title: {
                style: {
                    fontWeight: "bold"
                }
            }
        },
        loading: {
            labelStyle: {
                fontWeight: "bold",
                position: "relative",
                top: "45%"
            },
            style: {
                position: "absolute",
                backgroundColor: "white",
                opacity: 0.5,
                textAlign: "center"
            }
        },
        tooltip: {
            enabled: !0,
            animation: ea,
            backgroundColor: "rgba(249, 249, 249, .85)",
            borderWidth: 1,
            borderRadius: 3,
            dateTimeLabelFormats: {
                millisecond: "%A, %b %e, %H:%M:%S.%L",
                second: "%A, %b %e, %H:%M:%S",
                minute: "%A, %b %e, %H:%M",
                hour: "%A, %b %e, %H:%M",
                day: "%A, %b %e, %Y",
                week: "Week from %A, %b %e, %Y",
                month: "%B %Y",
                year: "%Y"
            },
            footerFormat: "",
            headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
            shadow: !0,
            snap: fb ? 25 : 10,
            style: {
                color: "#333333",
                cursor: "default",
                fontSize: "12px",
                padding: "8px",
                whiteSpace: "nowrap"
            }
        },
        credits: {
            enabled: !0,
            text: "Highcharts.com",
            href: "http://www.highcharts.com",
            position: {
                align: "right",
                x: -10,
                verticalAlign: "bottom",
                y: -5
            },
            style: {
                cursor: "pointer",
                color: "#909090",
                fontSize: "9px"
            }
        }
    };
    var U = P.plotOptions,
        N = U.line;
    Nb();
    var dc = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,
        ec = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
        fc = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,
        wa = function (a) {
            var b = [],
                c, d;
            (function (a) {
                a && a.stops ? d = Aa(a.stops, function (a) {
                    return wa(a[1])
                }) : (c = dc.exec(a)) ? b = [C(c[1]), C(c[2]), C(c[3]), parseFloat(c[4], 10)] : (c = ec.exec(a)) ? b = [C(c[1], 16), C(c[2], 16), C(c[3], 16), 1] : (c = fc.exec(a)) && (b = [C(c[1]), C(c[2]), C(c[3]), 1])
            })(a);
            return {
                get: function (c) {
                    var f;
                    d ? (f = y(a), f.stops = [].concat(f.stops), n(d, function (a, b) {
                        f.stops[b] = [f.stops[b][0], a.get(c)]
                    })) : f = b && !isNaN(b[0]) ? c === "rgb" ? "rgb(" + b[0] + "," + b[1] + "," + b[2] + ")" : c === "a" ? b[3] : "rgba(" + b.join(",") + ")" : a;
                    return f
                },
                brighten: function (a) {
                    if (d) n(d,
                        function (b) {
                            b.brighten(a)
                        });
                    else if (sa(a) && a !== 0) {
                        var c;
                        for (c = 0; c < 3; c++) b[c] += C(a * 255), b[c] < 0 && (b[c] = 0), b[c] > 255 && (b[c] = 255)
                    }
                    return this
                },
                rgba: b,
                setOpacity: function (a) {
                    b[3] = a;
                    return this
                },
                raw: a
            }
        };
    Y.prototype = {
        opacity: 1,
        textProps: "fontSize,fontWeight,fontFamily,fontStyle,color,lineHeight,width,textDecoration,textShadow".split(","),
        init: function (a, b) {
            this.element = b === "span" ? aa(b) : D.createElementNS(Ia, b);
            this.renderer = a
        },
        animate: function (a, b, c) {
            b = p(b, Ga, !0);
            ab(this);
            if (b) {
                b = y(b, {});
                if (c) b.complete = c;
                qb(this, a, b)
            } else this.attr(a), c && c();
            return this
        },
        colorGradient: function (a, b, c) {
            var d = this.renderer,
                e, f, g, h, i, j, k, m, l, o, q = [];
            a.linearGradient ? f = "linearGradient" : a.radialGradient && (f = "radialGradient");
            if (f) {
                g = a[f];
                h = d.gradients;
                j = a.stops;
                l = c.radialReference;
                Ka(g) && (a[f] = g = {
                    x1: g[0],
                    y1: g[1],
                    x2: g[2],
                    y2: g[3],
                    gradientUnits: "userSpaceOnUse"
                });
                f === "radialGradient" && l && !r(g.gradientUnits) && (g = y(g, {
                    cx: l[0] - l[2] / 2 + g.cx * l[2],
                    cy: l[1] - l[2] / 2 + g.cy * l[2],
                    r: g.r * l[2],
                    gradientUnits: "userSpaceOnUse"
                }));
                for (o in g) o !==
                    "id" && q.push(o, g[o]);
                for (o in j) q.push(j[o]);
                q = q.join(",");
                h[q] ? a = h[q].attr("id") : (g.id = a = "highcharts-" + Hb++, h[q] = i = d.createElement(f).attr(g).add(d.defs), i.stops = [], n(j, function (a) {
                    a[1].indexOf("rgba") === 0 ? (e = wa(a[1]), k = e.get("rgb"), m = e.get("a")) : (k = a[1], m = 1);
                    a = d.createElement("stop").attr({
                        offset: a[0],
                        "stop-color": k,
                        "stop-opacity": m
                    }).add(i);
                    i.stops.push(a)
                }));
                c.setAttribute(b, "url(" + d.url + "#" + a + ")")
            }
        },
        applyTextShadow: function (a) {
            var b = this.element,
                c, d = a.indexOf("contrast") !== -1,
                e = this.renderer.forExport ||
                b.style.textShadow !== s && !Ea;
            d && (a = a.replace(/contrast/g, this.renderer.getContrast(b.style.fill)));
            e ? d && L(b, {
                textShadow: a
            }) : (this.fakeTS = !0, this.ySetter = this.xSetter, c = [].slice.call(b.getElementsByTagName("tspan")), n(a.split(/\s?,\s?/g), function (a) {
                var d = b.firstChild,
                    e, i, a = a.split(" ");
                e = a[a.length - 1];
                (i = a[a.length - 2]) && n(c, function (a, c) {
                    var f;
                    c === 0 && (a.setAttribute("x", b.getAttribute("x")), c = b.getAttribute("y"), a.setAttribute("y", c || 0), c === null && b.setAttribute("y", 0));
                    f = a.cloneNode(1);
                    V(f, {
                        "class": "highcharts-text-shadow",
                        fill: e,
                        stroke: e,
                        "stroke-opacity": 1 / v(C(i), 3),
                        "stroke-width": i,
                        "stroke-linejoin": "round"
                    });
                    b.insertBefore(f, d)
                })
            }))
        },
        attr: function (a, b) {
            var c, d, e = this.element,
                f, g = this,
                h;
            typeof a === "string" && b !== s && (c = a, a = {}, a[c] = b);
            if (typeof a === "string") g = (this[a + "Getter"] || this._defaultGetter).call(this, a, e);
            else {
                for (c in a) {
                    d = a[c];
                    h = !1;
                    this.symbolName && /^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)/.test(c) && (f || (this.symbolAttr(a), f = !0), h = !0);
                    if (this.rotation && (c === "x" || c === "y")) this.doTransform = !0;
                    h ||
                        (this[c + "Setter"] || this._defaultSetter).call(this, d, c, e);
                    this.shadows && /^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(c) && this.updateShadows(c, d)
                }
                if (this.doTransform) this.updateTransform(), this.doTransform = !1
            }
            return g
        },
        updateShadows: function (a, b) {
            for (var c = this.shadows, d = c.length; d--;) c[d].setAttribute(a, a === "height" ? v(b - (c[d].cutHeight || 0), 0) : a === "d" ? this.d : b)
        },
        addClass: function (a) {
            var b = this.element,
                c = V(b, "class") || "";
            c.indexOf(a) === -1 && V(b, "class", c + " " + a);
            return this
        },
        symbolAttr: function (a) {
            var b =
                this;
            n("x,y,r,start,end,width,height,innerR,anchorX,anchorY".split(","), function (c) {
                b[c] = p(a[c], b[c])
            });
            b.attr({
                d: b.renderer.symbols[b.symbolName](b.x, b.y, b.width, b.height, b)
            })
        },
        clip: function (a) {
            return this.attr("clip-path", a ? "url(" + this.renderer.url + "#" + a.id + ")" : Z)
        },
        crisp: function (a) {
            var b, c = {},
                d, e = a.strokeWidth || this.strokeWidth || 0;
            d = w(e) % 2 / 2;
            a.x = W(a.x || this.x || 0) + d;
            a.y = W(a.y || this.y || 0) + d;
            a.width = W((a.width || this.width || 0) - 2 * d);
            a.height = W((a.height || this.height || 0) - 2 * d);
            a.strokeWidth = e;
            for (b in a) this[b] !==
                a[b] && (this[b] = c[b] = a[b]);
            return c
        },
        css: function (a) {
            var b = this.styles,
                c = {},
                d = this.element,
                e, f, g = "";
            e = !b;
            if (a && a.color) a.fill = a.color;
            if (b)
                for (f in a) a[f] !== b[f] && (c[f] = a[f], e = !0);
            if (e) {
                e = this.textWidth = a && a.width && d.nodeName.toLowerCase() === "text" && C(a.width) || this.textWidth;
                b && (a = x(b, c));
                this.styles = a;
                e && (ma || !ea && this.renderer.forExport) && delete a.width;
                if (Ea && !ea) L(this.element, a);
                else {
                    b = function (a, b) {
                        return "-" + b.toLowerCase()
                    };
                    for (f in a) g += f.replace(/([A-Z])/g, b) + ":" + a[f] + ";";
                    V(d, "style", g)
                }
                e &&
                    this.added && this.renderer.buildText(this)
            }
            return this
        },
        on: function (a, b) {
            var c = this,
                d = c.element;
            $a && a === "click" ? (d.ontouchstart = function (a) {
                c.touchEventFired = fa.now();
                a.preventDefault();
                b.call(d, a)
            }, d.onclick = function (a) {
                (Ha.indexOf("Android") === -1 || fa.now() - (c.touchEventFired || 0) > 1100) && b.call(d, a)
            }) : d["on" + a] = b;
            return this
        },
        setRadialReference: function (a) {
            this.element.radialReference = a;
            return this
        },
        translate: function (a, b) {
            return this.attr({
                translateX: a,
                translateY: b
            })
        },
        invert: function () {
            this.inverted = !0;
            this.updateTransform();
            return this
        },
        updateTransform: function () {
            var a = this.translateX || 0,
                b = this.translateY || 0,
                c = this.scaleX,
                d = this.scaleY,
                e = this.inverted,
                f = this.rotation,
                g = this.element;
            e && (a += this.attr("width"), b += this.attr("height"));
            a = ["translate(" + a + "," + b + ")"];
            e ? a.push("rotate(90) scale(-1,1)") : f && a.push("rotate(" + f + " " + (g.getAttribute("x") || 0) + " " + (g.getAttribute("y") || 0) + ")");
            (r(c) || r(d)) && a.push("scale(" + p(c, 1) + " " + p(d, 1) + ")");
            a.length && g.setAttribute("transform", a.join(" "))
        },
        toFront: function () {
            var a =
                this.element;
            a.parentNode.appendChild(a);
            return this
        },
        align: function (a, b, c) {
            var d, e, f, g, h = {};
            e = this.renderer;
            f = e.alignedObjects;
            if (a) {
                if (this.alignOptions = a, this.alignByTranslate = b, !c || Ja(c)) this.alignTo = d = c || "renderer", ua(f, this), f.push(this), c = null
            } else a = this.alignOptions, b = this.alignByTranslate, d = this.alignTo;
            c = p(c, e[d], e);
            d = a.align;
            e = a.verticalAlign;
            f = (c.x || 0) + (a.x || 0);
            g = (c.y || 0) + (a.y || 0);
            if (d === "right" || d === "center") f += (c.width - (a.width || 0)) / {
                right: 1,
                center: 2
            }[d];
            h[b ? "translateX" : "x"] = w(f);
            if (e === "bottom" || e === "middle") g += (c.height - (a.height || 0)) / ({
                bottom: 1,
                middle: 2
            }[e] || 1);
            h[b ? "translateY" : "y"] = w(g);
            this[this.placed ? "animate" : "attr"](h);
            this.placed = !0;
            this.alignAttr = h;
            return this
        },
        getBBox: function (a) {
            var b, c = this.renderer,
                d, e = this.rotation,
                f = this.element,
                g = this.styles,
                h = e * ra;
            d = this.textStr;
            var i, j = f.style,
                k, m;
            d !== s && (m = ["", e || 0, g && g.fontSize, f.style.width].join(","), m = d === "" || Zb.test(d) ? "num:" + d.toString().length + m : d + m);
            m && !a && (b = c.cache[m]);
            if (!b) {
                if (f.namespaceURI === Ia || c.forExport) {
                    try {
                        k =
                            this.fakeTS && function (a) {
                                n(f.querySelectorAll(".highcharts-text-shadow"), function (b) {
                                    b.style.display = a
                                })
                            }, Va && j.textShadow ? (i = j.textShadow, j.textShadow = "") : k && k(Z), b = f.getBBox ? x({}, f.getBBox()) : {
                                width: f.offsetWidth,
                                height: f.offsetHeight
                            }, i ? j.textShadow = i : k && k("")
                    } catch (l) {}
                    if (!b || b.width < 0) b = {
                        width: 0,
                        height: 0
                    }
                } else b = this.htmlGetBBox();
                if (c.isSVG) {
                    a = b.width;
                    d = b.height;
                    if (Ea && g && g.fontSize === "11px" && d.toPrecision(3) === "16.9") b.height = d = 14;
                    if (e) b.width = Q(d * ga(h)) + Q(a * ba(h)), b.height = Q(d * ba(h)) + Q(a *
                        ga(h))
                }
                c.cache[m] = b
            }
            return b
        },
        show: function (a) {
            a && this.element.namespaceURI === Ia ? this.element.removeAttribute("visibility") : this.attr({
                visibility: a ? "inherit" : "visible"
            });
            return this
        },
        hide: function () {
            return this.attr({
                visibility: "hidden"
            })
        },
        fadeOut: function (a) {
            var b = this;
            b.animate({
                opacity: 0
            }, {
                duration: a || 150,
                complete: function () {
                    b.attr({
                        y: -9999
                    })
                }
            })
        },
        add: function (a) {
            var b = this.renderer,
                c = this.element,
                d;
            if (a) this.parentGroup = a;
            this.parentInverted = a && a.inverted;
            this.textStr !== void 0 && b.buildText(this);
            this.added = !0;
            if (!a || a.handleZ || this.zIndex) d = this.zIndexSetter();
            d || (a ? a.element : b.box).appendChild(c);
            if (this.onAdd) this.onAdd();
            return this
        },
        safeRemoveChild: function (a) {
            var b = a.parentNode;
            b && b.removeChild(a)
        },
        destroy: function () {
            var a = this,
                b = a.element || {},
                c = a.shadows,
                d = a.renderer.isSVG && b.nodeName === "SPAN" && a.parentGroup,
                e, f;
            b.onclick = b.onmouseout = b.onmouseover = b.onmousemove = b.point = null;
            ab(a);
            if (a.clipPath) a.clipPath = a.clipPath.destroy();
            if (a.stops) {
                for (f = 0; f < a.stops.length; f++) a.stops[f] = a.stops[f].destroy();
                a.stops = null
            }
            a.safeRemoveChild(b);
            for (c && n(c, function (b) {
                    a.safeRemoveChild(b)
                }); d && d.div && d.div.childNodes.length === 0;) b = d.parentGroup, a.safeRemoveChild(d.div), delete d.div, d = b;
            a.alignTo && ua(a.renderer.alignedObjects, a);
            for (e in a) delete a[e];
            return null
        },
        shadow: function (a, b, c) {
            var d = [],
                e, f, g = this.element,
                h, i, j, k;
            if (a) {
                i = p(a.width, 3);
                j = (a.opacity || 0.15) / i;
                k = this.parentInverted ? "(-1,-1)" : "(" + p(a.offsetX, 1) + ", " + p(a.offsetY, 1) + ")";
                for (e = 1; e <= i; e++) {
                    f = g.cloneNode(0);
                    h = i * 2 + 1 - 2 * e;
                    V(f, {
                        isShadow: "true",
                        stroke: a.color || "black",
                        "stroke-opacity": j * e,
                        "stroke-width": h,
                        transform: "translate" + k,
                        fill: Z
                    });
                    if (c) V(f, "height", v(V(f, "height") - h, 0)), f.cutHeight = h;
                    b ? b.element.appendChild(f) : g.parentNode.insertBefore(f, g);
                    d.push(f)
                }
                this.shadows = d
            }
            return this
        },
        xGetter: function (a) {
            this.element.nodeName === "circle" && (a = {
                x: "cx",
                y: "cy"
            }[a] || a);
            return this._defaultGetter(a)
        },
        _defaultGetter: function (a) {
            a = p(this[a], this.element ? this.element.getAttribute(a) : null, 0);
            /^[\-0-9\.]+$/.test(a) && (a = parseFloat(a));
            return a
        },
        dSetter: function (a,
            b, c) {
            a && a.join && (a = a.join(" "));
            /(NaN| {2}|^$)/.test(a) && (a = "M 0 0");
            c.setAttribute(b, a);
            this[b] = a
        },
        dashstyleSetter: function (a) {
            var b;
            if (a = a && a.toLowerCase()) {
                a = a.replace("shortdashdotdot", "3,1,1,1,1,1,").replace("shortdashdot", "3,1,1,1").replace("shortdot", "1,1,").replace("shortdash", "3,1,").replace("longdash", "8,3,").replace(/dot/g, "1,3,").replace("dash", "4,3,").replace(/,$/, "").split(",");
                for (b = a.length; b--;) a[b] = C(a[b]) * this["stroke-width"];
                a = a.join(",").replace("NaN", "none");
                this.element.setAttribute("stroke-dasharray",
                    a)
            }
        },
        alignSetter: function (a) {
            this.element.setAttribute("text-anchor", {
                left: "start",
                center: "middle",
                right: "end"
            }[a])
        },
        opacitySetter: function (a, b, c) {
            this[b] = a;
            c.setAttribute(b, a)
        },
        titleSetter: function (a) {
            var b = this.element.getElementsByTagName("title")[0];
            b || (b = D.createElementNS(Ia, "title"), this.element.appendChild(b));
            b.textContent = String(p(a), "").replace(/<[^>]*>/g, "")
        },
        textSetter: function (a) {
            if (a !== this.textStr) delete this.bBox, this.textStr = a, this.added && this.renderer.buildText(this)
        },
        fillSetter: function (a,
            b, c) {
            typeof a === "string" ? c.setAttribute(b, a) : a && this.colorGradient(a, b, c)
        },
        zIndexSetter: function (a, b) {
            var c = this.renderer,
                d = this.parentGroup,
                c = (d || c).element || c.box,
                e, f, g = this.element,
                h;
            e = this.added;
            var i;
            r(a) && (g.setAttribute(b, a), a = +a, this[b] === a && (e = !1), this[b] = a);
            if (e) {
                if ((a = this.zIndex) && d) d.handleZ = !0;
                d = c.childNodes;
                for (i = 0; i < d.length && !h; i++)
                    if (e = d[i], f = V(e, "zIndex"), e !== g && (C(f) > a || !r(a) && r(f))) c.insertBefore(g, e), h = !0;
                h || c.appendChild(g)
            }
            return h
        },
        _defaultSetter: function (a, b, c) {
            c.setAttribute(b,
                a)
        }
    };
    Y.prototype.yGetter = Y.prototype.xGetter;
    Y.prototype.translateXSetter = Y.prototype.translateYSetter = Y.prototype.rotationSetter = Y.prototype.verticalAlignSetter = Y.prototype.scaleXSetter = Y.prototype.scaleYSetter = function (a, b) {
        this[b] = a;
        this.doTransform = !0
    };
    Y.prototype["stroke-widthSetter"] = Y.prototype.strokeSetter = function (a, b, c) {
        this[b] = a;
        if (this.stroke && this["stroke-width"]) this.strokeWidth = this["stroke-width"], Y.prototype.fillSetter.call(this, this.stroke, "stroke", c), c.setAttribute("stroke-width",
            this["stroke-width"]), this.hasStroke = !0;
        else if (b === "stroke-width" && a === 0 && this.hasStroke) c.removeAttribute("stroke"), this.hasStroke = !1
    };
    var na = function () {
        this.init.apply(this, arguments)
    };
    na.prototype = {
        Element: Y,
        init: function (a, b, c, d, e) {
            var f = location,
                g, d = this.createElement("svg").attr({
                    version: "1.1"
                }).css(this.getStyle(d));
            g = d.element;
            a.appendChild(g);
            a.innerHTML.indexOf("xmlns") === -1 && V(g, "xmlns", Ia);
            this.isSVG = !0;
            this.box = g;
            this.boxWrapper = d;
            this.alignedObjects = [];
            this.url = (Va || Gb) && D.getElementsByTagName("base").length ?
                f.href.replace(/#.*?$/, "").replace(/([\('\)])/g, "\\$1").replace(/ /g, "%20") : "";
            this.createElement("desc").add().element.appendChild(D.createTextNode("Created with Highstock 2.1.5"));
            this.defs = this.createElement("defs").add();
            this.forExport = e;
            this.gradients = {};
            this.cache = {};
            this.setSize(b, c, !1);
            var h;
            if (Va && a.getBoundingClientRect) this.subPixelFix = b = function () {
                L(a, {
                    left: 0,
                    top: 0
                });
                h = a.getBoundingClientRect();
                L(a, {
                    left: za(h.left) - h.left + "px",
                    top: za(h.top) - h.top + "px"
                })
            }, b(), E(S, "resize", b)
        },
        getStyle: function (a) {
            return this.style =
                x({
                    fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
                    fontSize: "12px"
                }, a)
        },
        isHidden: function () {
            return !this.boxWrapper.getBBox().width
        },
        destroy: function () {
            var a = this.defs;
            this.box = null;
            this.boxWrapper = this.boxWrapper.destroy();
            Na(this.gradients || {});
            this.gradients = null;
            if (a) this.defs = a.destroy();
            this.subPixelFix && T(S, "resize", this.subPixelFix);
            return this.alignedObjects = null
        },
        createElement: function (a) {
            var b = new this.Element;
            b.init(this, a);
            return b
        },
        draw: function () {},
        buildText: function (a) {
            for (var b = a.element, c = this, d = c.forExport, e = p(a.textStr, "").toString(), f = e.indexOf("<") !== -1, g = b.childNodes, h, i, j = V(b, "x"), k = a.styles, m = a.textWidth, l = k && k.lineHeight, o = k && k.textShadow, q = k && k.textOverflow === "ellipsis", t = g.length, $ = m && !a.added && this.box, z = function (a) {
                    return l ? C(l) : c.fontMetrics(/(px|em)$/.test(a && a.style.fontSize) ? a.style.fontSize : k && k.fontSize || c.style.fontSize || 12, a).h
                }, u = function (a) {
                    return a.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
                }; t--;) b.removeChild(g[t]);
            !f && !o && !q && e.indexOf(" ") === -1 ? b.appendChild(D.createTextNode(u(e))) : (h = /<.*style="([^"]+)".*>/, i = /<.*href="(http[^"]+)".*>/, $ && $.appendChild(b), e = f ? e.replace(/<(b|strong)>/g, '<span style="font-weight:bold">').replace(/<(i|em)>/g, '<span style="font-style:italic">').replace(/<a/g, "<span").replace(/<\/(b|strong|i|em|a)>/g, "</span>").split(/<br.*?>/g) : [e], e[e.length - 1] === "" && e.pop(), n(e, function (e, f) {
                var g, l = 0,
                    e = e.replace(/<span/g, "|||<span").replace(/<\/span>/g, "</span>|||");
                g = e.split("|||");
                n(g, function (e) {
                    if (e !==
                        "" || g.length === 1) {
                        var o = {},
                            t = D.createElementNS(Ia, "tspan"),
                            $;
                        h.test(e) && ($ = e.match(h)[1].replace(/(;| |^)color([ :])/, "$1fill$2"), V(t, "style", $));
                        i.test(e) && !d && (V(t, "onclick", 'location.href="' + e.match(i)[1] + '"'), L(t, {
                            cursor: "pointer"
                        }));
                        e = u(e.replace(/<(.|\n)*?>/g, "") || " ");
                        if (e !== " ") {
                            t.appendChild(D.createTextNode(e));
                            if (l) o.dx = 0;
                            else if (f && j !== null) o.x = j;
                            V(t, o);
                            b.appendChild(t);
                            !l && f && (!ea && d && L(t, {
                                display: "block"
                            }), V(t, "dy", z(t)));
                            if (m) {
                                for (var o = e.replace(/([^\^])-/g, "$1- ").split(" "), n = g.length >
                                        1 || f || o.length > 1 && k.whiteSpace !== "nowrap", p, M, s, r = [], w = z(t), v = 1, x = a.rotation, y = e, B = y.length;
                                    (n || q) && (o.length || r.length);) a.rotation = 0, p = a.getBBox(!0), s = p.width, !ea && c.forExport && (s = c.measureSpanWidth(t.firstChild.data, a.styles)), p = s > m, M === void 0 && (M = p), q && M ? (B /= 2, y === "" || !p && B < 0.5 ? o = [] : (p && (M = !0), y = e.substring(0, y.length + (p ? -1 : 1) * za(B)), o = [y + "â€¦"], t.removeChild(t.firstChild))) : !p || o.length === 1 ? (o = r, r = [], o.length && (v++, t = D.createElementNS(Ia, "tspan"), V(t, {
                                        dy: w,
                                        x: j
                                    }), $ && V(t, "style", $), b.appendChild(t)),
                                    s > m && (m = s)) : (t.removeChild(t.firstChild), r.unshift(o.pop())), o.length && t.appendChild(D.createTextNode(o.join(" ").replace(/- /g, "-")));
                                M && a.attr("title", a.textStr);
                                a.rotation = x
                            }
                            l++
                        }
                    }
                })
            }), $ && $.removeChild(b), o && a.applyTextShadow && a.applyTextShadow(o))
        },
        getContrast: function (a) {
            a = wa(a).rgba;
            return a[0] + a[1] + a[2] > 384 ? "#000" : "#FFF"
        },
        button: function (a, b, c, d, e, f, g, h, i) {
            var j = this.label(a, b, c, i, null, null, null, null, "button"),
                k = 0,
                m, l, o, q, t, p, a = {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                e = y({
                    "stroke-width": 1,
                    stroke: "#CCCCCC",
                    fill: {
                        linearGradient: a,
                        stops: [[0, "#FEFEFE"], [1, "#F6F6F6"]]
                    },
                    r: 2,
                    padding: 5,
                    style: {
                        color: "black"
                    }
                }, e);
            o = e.style;
            delete e.style;
            f = y(e, {
                stroke: "#68A",
                fill: {
                    linearGradient: a,
                    stops: [[0, "#FFF"], [1, "#ACF"]]
                }
            }, f);
            q = f.style;
            delete f.style;
            g = y(e, {
                stroke: "#68A",
                fill: {
                    linearGradient: a,
                    stops: [[0, "#9BD"], [1, "#CDF"]]
                }
            }, g);
            t = g.style;
            delete g.style;
            h = y(e, {
                style: {
                    color: "#CCC"
                }
            }, h);
            p = h.style;
            delete h.style;
            E(j.element, Ea ? "mouseover" : "mouseenter", function () {
                k !== 3 && j.attr(f).css(q)
            });
            E(j.element, Ea ? "mouseout" : "mouseleave", function () {
                k !== 3 &&
                    (m = [e, f, g][k], l = [o, q, t][k], j.attr(m).css(l))
            });
            j.setState = function (a) {
                (j.state = k = a) ? a === 2 ? j.attr(g).css(t) : a === 3 && j.attr(h).css(p): j.attr(e).css(o)
            };
            return j.on("click", function () {
                k !== 3 && d.call(j)
            }).attr(e).css(x({
                cursor: "default"
            }, o))
        },
        crispLine: function (a, b) {
            a[1] === a[4] && (a[1] = a[4] = w(a[1]) - b % 2 / 2);
            a[2] === a[5] && (a[2] = a[5] = w(a[2]) + b % 2 / 2);
            return a
        },
        path: function (a) {
            var b = {
                fill: Z
            };
            Ka(a) ? b.d = a : ia(a) && x(b, a);
            return this.createElement("path").attr(b)
        },
        circle: function (a, b, c) {
            a = ia(a) ? a : {
                x: a,
                y: b,
                r: c
            };
            b = this.createElement("circle");
            b.xSetter = function (a) {
                this.element.setAttribute("cx", a)
            };
            b.ySetter = function (a) {
                this.element.setAttribute("cy", a)
            };
            return b.attr(a)
        },
        arc: function (a, b, c, d, e, f) {
            if (ia(a)) b = a.y, c = a.r, d = a.innerR, e = a.start, f = a.end, a = a.x;
            a = this.symbol("arc", a || 0, b || 0, c || 0, c || 0, {
                innerR: d || 0,
                start: e || 0,
                end: f || 0
            });
            a.r = c;
            return a
        },
        rect: function (a, b, c, d, e, f) {
            var e = ia(a) ? a.r : e,
                g = this.createElement("rect"),
                a = ia(a) ? a : a === s ? {} : {
                    x: a,
                    y: b,
                    width: v(c, 0),
                    height: v(d, 0)
                };
            if (f !== s) a.strokeWidth = f, a = g.crisp(a);
            if (e) a.r = e;
            g.rSetter = function (a) {
                V(this.element, {
                    rx: a,
                    ry: a
                })
            };
            return g.attr(a)
        },
        setSize: function (a, b, c) {
            var d = this.alignedObjects,
                e = d.length;
            this.width = a;
            this.height = b;
            for (this.boxWrapper[p(c, !0) ? "animate" : "attr"]({
                    width: a,
                    height: b
                }); e--;) d[e].align()
        },
        g: function (a) {
            var b = this.createElement("g");
            return r(a) ? b.attr({
                "class": "highcharts-" + a
            }) : b
        },
        image: function (a, b, c, d, e) {
            var f = {
                preserveAspectRatio: Z
            };
            arguments.length > 1 && x(f, {
                x: b,
                y: c,
                width: d,
                height: e
            });
            f = this.createElement("image").attr(f);
            f.element.setAttributeNS ? f.element.setAttributeNS("http://www.w3.org/1999/xlink",
                "href", a) : f.element.setAttribute("hc-svg-href", a);
            return f
        },
        symbol: function (a, b, c, d, e, f) {
            var g, h = this.symbols[a],
                h = h && h(w(b), w(c), d, e, f),
                i = /^url\((.*?)\)$/,
                j, k;
            if (h) g = this.path(h), x(g, {
                symbolName: a,
                x: b,
                y: c,
                width: d,
                height: e
            }), f && x(g, f);
            else if (i.test(a)) k = function (a, b) {
                a.element && (a.attr({
                    width: b[0],
                    height: b[1]
                }), a.alignByTranslate || a.translate(w((d - b[0]) / 2), w((e - b[1]) / 2)))
            }, j = a.match(i)[1], a = Ub[j] || f && f.width && f.height && [f.width, f.height], g = this.image(j).attr({
                x: b,
                y: c
            }), g.isImg = !0, a ? k(g, a) : (g.attr({
                width: 0,
                height: 0
            }), aa("img", {
                onload: function () {
                    k(g, Ub[j] = [this.width, this.height])
                },
                src: j
            }));
            return g
        },
        symbols: {
            circle: function (a, b, c, d) {
                var e = 0.166 * c;
                return ["M", a + c / 2, b, "C", a + c + e, b, a + c + e, b + d, a + c / 2, b + d, "C", a - e, b + d, a - e, b, a + c / 2, b, "Z"]
            },
            square: function (a, b, c, d) {
                return ["M", a, b, "L", a + c, b, a + c, b + d, a, b + d, "Z"]
            },
            triangle: function (a, b, c, d) {
                return ["M", a + c / 2, b, "L", a + c, b + d, a, b + d, "Z"]
            },
            "triangle-down": function (a, b, c, d) {
                return ["M", a, b, "L", a + c, b, a + c / 2, b + d, "Z"]
            },
            diamond: function (a, b, c, d) {
                return ["M", a + c / 2, b, "L", a + c, b + d / 2, a +
c / 2, b + d, a, b + d / 2, "Z"]
            },
            arc: function (a, b, c, d, e) {
                var f = e.start,
                    c = e.r || c || d,
                    g = e.end - 0.001,
                    d = e.innerR,
                    h = e.open,
                    i = ba(f),
                    j = ga(f),
                    k = ba(g),
                    g = ga(g),
                    e = e.end - f < va ? 0 : 1;
                return ["M", a + c * i, b + c * j, "A", c, c, 0, e, 1, a + c * k, b + c * g, h ? "M" : "L", a + d * k, b + d * g, "A", d, d, 0, e, 0, a + d * i, b + d * j, h ? "" : "Z"]
            },
            callout: function (a, b, c, d, e) {
                var f = B(e && e.r || 0, c, d),
                    g = f + 6,
                    h = e && e.anchorX,
                    i = e && e.anchorY,
                    e = w(e.strokeWidth || 0) % 2 / 2;
                a += e;
                b += e;
                e = ["M", a + f, b, "L", a + c - f, b, "C", a + c, b, a + c, b, a + c, b + f, "L", a + c, b + d - f, "C", a + c, b + d, a + c, b + d, a + c - f, b + d, "L", a + f, b + d, "C", a, b + d,
a, b + d, a, b + d - f, "L", a, b + f, "C", a, b, a, b, a + f, b];
                h && h > c && i > b + g && i < b + d - g ? e.splice(13, 3, "L", a + c, i - 6, a + c + 6, i, a + c, i + 6, a + c, b + d - f) : h && h < 0 && i > b + g && i < b + d - g ? e.splice(33, 3, "L", a, i + 6, a - 6, i, a, i - 6, a, b + f) : i && i > d && h > a + g && h < a + c - g ? e.splice(23, 3, "L", h + 6, b + d, h, b + d + 6, h - 6, b + d, a + f, b + d) : i && i < 0 && h > a + g && h < a + c - g && e.splice(3, 3, "L", h - 6, b, h, b - 6, h + 6, b, c - f, b);
                return e
            }
        },
        clipRect: function (a, b, c, d) {
            var e = "highcharts-" + Hb++,
                f = this.createElement("clipPath").attr({
                    id: e
                }).add(this.defs),
                a = this.rect(a, b, c, d, 0).add(f);
            a.id = e;
            a.clipPath = f;
            a.count =
                0;
            return a
        },
        text: function (a, b, c, d) {
            var e = ma || !ea && this.forExport,
                f = {};
            if (d && !this.forExport) return this.html(a, b, c);
            f.x = Math.round(b || 0);
            if (c) f.y = Math.round(c);
            if (a || a === 0) f.text = a;
            a = this.createElement("text").attr(f);
            e && a.css({
                position: "absolute"
            });
            if (!d) a.xSetter = function (a, b, c) {
                var d = c.getElementsByTagName("tspan"),
                    e, f = c.getAttribute(b),
                    l;
                for (l = 0; l < d.length; l++) e = d[l], e.getAttribute(b) === f && e.setAttribute(b, a);
                c.setAttribute(b, a)
            };
            return a
        },
        fontMetrics: function (a, b) {
            a = a || this.style.fontSize;
            if (b &&
                S.getComputedStyle) b = b.element || b, a = S.getComputedStyle(b, "").fontSize;
            var a = /px/.test(a) ? C(a) : /em/.test(a) ? parseFloat(a) * 12 : 12,
                c = a < 24 ? a + 3 : w(a * 1.2),
                d = w(c * 0.8);
            return {
                h: c,
                b: d,
                f: a
            }
        },
        rotCorr: function (a, b, c) {
            var d = a;
            b && c && (d = v(d * ba(b * ra), 4));
            return {
                x: -a / 3 * ga(b * ra),
                y: d
            }
        },
        label: function (a, b, c, d, e, f, g, h, i) {
            function j() {
                var a, b;
                a = q.element.style;
                p = (oa === void 0 || v === void 0 || o.styles.textAlign) && r(q.textStr) && q.getBBox();
                o.width = (oa || p.width || 0) + 2 * u + M;
                o.height = (v || p.height || 0) + 2 * u;
                E = u + l.fontMetrics(a && a.fontSize,
                    q).b;
                if (D) {
                    if (!t) a = w(-z * u), b = h ? -E : 0, o.box = t = d ? l.symbol(d, a, b, o.width, o.height, J) : l.rect(a, b, o.width, o.height, 0, J[$b]), t.attr("fill", Z).add(o);
                    t.isImg || t.attr(x({
                        width: w(o.width),
                        height: w(o.height)
                    }, J));
                    J = null
                }
            }

            function k() {
                var a = o.styles,
                    a = a && a.textAlign,
                    b = M + u * (1 - z),
                    c;
                c = h ? 0 : E;
                if (r(oa) && p && (a === "center" || a === "right")) b += {
                    center: 0.5,
                    right: 1
                }[a] * (oa - p.width);
                if (b !== q.x || c !== q.y) q.attr("x", b), c !== s && q.attr(q.element.nodeName === "SPAN" ? "y" : "translateY", c);
                q.x = b;
                q.y = c
            }

            function m(a, b) {
                t ? t.attr(a, b) : J[a] =
                    b
            }
            var l = this,
                o = l.g(i),
                q = l.text("", 0, 0, g).attr({
                    zIndex: 1
                }),
                t, p, z = 0,
                u = 3,
                M = 0,
                oa, v, B, Jb, A = 0,
                J = {},
                E, D;
            o.onAdd = function () {
                q.add(o);
                o.attr({
                    text: a || a === 0 ? a : "",
                    x: b,
                    y: c
                });
                t && r(e) && o.attr({
                    anchorX: e,
                    anchorY: f
                })
            };
            o.widthSetter = function (a) {
                oa = a
            };
            o.heightSetter = function (a) {
                v = a
            };
            o.paddingSetter = function (a) {
                if (r(a) && a !== u) u = o.padding = a, k()
            };
            o.paddingLeftSetter = function (a) {
                r(a) && a !== M && (M = a, k())
            };
            o.alignSetter = function (a) {
                z = {
                    left: 0,
                    center: 0.5,
                    right: 1
                }[a]
            };
            o.textSetter = function (a) {
                a !== s && q.textSetter(a);
                j();
                k()
            };
            o["stroke-widthSetter"] = function (a, b) {
                a && (D = !0);
                A = a % 2 / 2;
                m(b, a)
            };
            o.strokeSetter = o.fillSetter = o.rSetter = function (a, b) {
                b === "fill" && a && (D = !0);
                m(b, a)
            };
            o.anchorXSetter = function (a, b) {
                e = a;
                m(b, a + A - B)
            };
            o.anchorYSetter = function (a, b) {
                f = a;
                m(b, a - Jb)
            };
            o.xSetter = function (a) {
                o.x = a;
                z && (a -= z * ((oa || p.width) + u));
                B = w(a);
                o.attr("translateX", B)
            };
            o.ySetter = function (a) {
                Jb = o.y = w(a);
                o.attr("translateY", Jb)
            };
            var C = o.css;
            return x(o, {
                css: function (a) {
                    if (a) {
                        var b = {},
                            a = y(a);
                        n(o.textProps, function (c) {
                            a[c] !== s && (b[c] = a[c], delete a[c])
                        });
                        q.css(b)
                    }
                    return C.call(o, a)
                },
                getBBox: function () {
                    return {
                        width: p.width + 2 * u,
                        height: p.height + 2 * u,
                        x: p.x - u,
                        y: p.y - u
                    }
                },
                shadow: function (a) {
                    t && t.shadow(a);
                    return o
                },
                destroy: function () {
                    T(o.element, "mouseenter");
                    T(o.element, "mouseleave");
                    q && (q = q.destroy());
                    t && (t = t.destroy());
                    Y.prototype.destroy.call(o);
                    o = l = j = k = m = null
                }
            })
        }
    };
    Wa = na;
    x(Y.prototype, {
        htmlCss: function (a) {
            var b = this.element;
            if (b = a && b.tagName === "SPAN" && a.width) delete a.width, this.textWidth = b, this.updateTransform();
            if (a && a.textOverflow === "ellipsis") a.whiteSpace =
                "nowrap", a.overflow = "hidden";
            this.styles = x(this.styles, a);
            L(this.element, a);
            return this
        },
        htmlGetBBox: function () {
            var a = this.element;
            if (a.nodeName === "text") a.style.position = "absolute";
            return {
                x: a.offsetLeft,
                y: a.offsetTop,
                width: a.offsetWidth,
                height: a.offsetHeight
            }
        },
        htmlUpdateTransform: function () {
            if (this.added) {
                var a = this.renderer,
                    b = this.element,
                    c = this.translateX || 0,
                    d = this.translateY || 0,
                    e = this.x || 0,
                    f = this.y || 0,
                    g = this.textAlign || "left",
                    h = {
                        left: 0,
                        center: 0.5,
                        right: 1
                    }[g],
                    i = this.shadows,
                    j = this.styles;
                L(b, {
                    marginLeft: c,
                    marginTop: d
                });
                i && n(i, function (a) {
                    L(a, {
                        marginLeft: c + 1,
                        marginTop: d + 1
                    })
                });
                this.inverted && n(b.childNodes, function (c) {
                    a.invertChild(c, b)
                });
                if (b.tagName === "SPAN") {
                    var k = this.rotation,
                        m, l = C(this.textWidth),
                        o = [k, g, b.innerHTML, this.textWidth].join(",");
                    if (o !== this.cTT) {
                        m = a.fontMetrics(b.style.fontSize).b;
                        r(k) && this.setSpanRotation(k, h, m);
                        i = p(this.elemWidth, b.offsetWidth);
                        if (i > l && /[ \-]/.test(b.textContent || b.innerText)) L(b, {
                            width: l + "px",
                            display: "block",
                            whiteSpace: j && j.whiteSpace || "normal"
                        }), i = l;
                        this.getSpanCorrection(i,
                            m, h, k, g)
                    }
                    L(b, {
                        left: e + (this.xCorr || 0) + "px",
                        top: f + (this.yCorr || 0) + "px"
                    });
                    if (Gb) m = b.offsetHeight;
                    this.cTT = o
                }
            } else this.alignOnAdd = !0
        },
        setSpanRotation: function (a, b, c) {
            var d = {},
                e = Ea ? "-ms-transform" : Gb ? "-webkit-transform" : Va ? "MozTransform" : Tb ? "-o-transform" : "";
            d[e] = d.transform = "rotate(" + a + "deg)";
            d[e + (Va ? "Origin" : "-origin")] = d.transformOrigin = b * 100 + "% " + c + "px";
            L(this.element, d)
        },
        getSpanCorrection: function (a, b, c) {
            this.xCorr = -a * c;
            this.yCorr = -b
        }
    });
    x(na.prototype, {
        html: function (a, b, c) {
            var d = this.createElement("span"),
                e = d.element,
                f = d.renderer;
            d.textSetter = function (a) {
                a !== e.innerHTML && delete this.bBox;
                e.innerHTML = this.textStr = a
            };
            d.xSetter = d.ySetter = d.alignSetter = d.rotationSetter = function (a, b) {
                b === "align" && (b = "textAlign");
                d[b] = a;
                d.htmlUpdateTransform()
            };
            d.attr({
                text: a,
                x: w(b),
                y: w(c)
            }).css({
                position: "absolute",
                fontFamily: this.style.fontFamily,
                fontSize: this.style.fontSize
            });
            e.style.whiteSpace = "nowrap";
            d.css = d.htmlCss;
            if (f.isSVG) d.add = function (a) {
                var b, c = f.box.parentNode,
                    j = [];
                if (this.parentGroup = a) {
                    if (b = a.div, !b) {
                        for (; a;) j.push(a),
                            a = a.parentGroup;
                        n(j.reverse(), function (a) {
                            var d;
                            b = a.div = a.div || aa(Ua, {
                                className: V(a.element, "class")
                            }, {
                                position: "absolute",
                                left: (a.translateX || 0) + "px",
                                top: (a.translateY || 0) + "px"
                            }, b || c);
                            d = b.style;
                            x(a, {
                                translateXSetter: function (b, c) {
                                    d.left = b + "px";
                                    a[c] = b;
                                    a.doTransform = !0
                                },
                                translateYSetter: function (b, c) {
                                    d.top = b + "px";
                                    a[c] = b;
                                    a.doTransform = !0
                                },
                                visibilitySetter: function (a, b) {
                                    d[b] = a
                                }
                            })
                        })
                    }
                } else b = c;
                b.appendChild(e);
                d.added = !0;
                d.alignOnAdd && d.htmlUpdateTransform();
                return d
            };
            return d
        }
    });
    var ib;
    if (!ea && !ma) G = {
        init: function (a, b) {
            var c = ["<", b, ' filled="f" stroked="f"'],
                d = ["position: ", "absolute", ";"],
                e = b === Ua;
            (b === "shape" || e) && d.push("left:0;top:0;width:1px;height:1px;");
            d.push("visibility: ", e ? "hidden" : "visible");
            c.push(' style="', d.join(""), '"/>');
            if (b) c = e || b === "span" || b === "img" ? c.join("") : a.prepVML(c), this.element = aa(c);
            this.renderer = a
        },
        add: function (a) {
            var b = this.renderer,
                c = this.element,
                d = b.box,
                d = a ? a.element || a : d;
            a && a.inverted && b.invertChild(c, d);
            d.appendChild(c);
            this.added = !0;
            this.alignOnAdd && !this.deferUpdateTransform &&
                this.updateTransform();
            if (this.onAdd) this.onAdd();
            return this
        },
        updateTransform: Y.prototype.htmlUpdateTransform,
        setSpanRotation: function () {
            var a = this.rotation,
                b = ba(a * ra),
                c = ga(a * ra);
            L(this.element, {
                filter: a ? ["progid:DXImageTransform.Microsoft.Matrix(M11=", b, ", M12=", -c, ", M21=", c, ", M22=", b, ", sizingMethod='auto expand')"].join("") : Z
            })
        },
        getSpanCorrection: function (a, b, c, d, e) {
            var f = d ? ba(d * ra) : 1,
                g = d ? ga(d * ra) : 0,
                h = p(this.elemHeight, this.element.offsetHeight),
                i;
            this.xCorr = f < 0 && -a;
            this.yCorr = g < 0 && -h;
            i = f * g <
                0;
            this.xCorr += g * b * (i ? 1 - c : c);
            this.yCorr -= f * b * (d ? i ? c : 1 - c : 1);
            e && e !== "left" && (this.xCorr -= a * c * (f < 0 ? -1 : 1), d && (this.yCorr -= h * c * (g < 0 ? -1 : 1)), L(this.element, {
                textAlign: e
            }))
        },
        pathToVML: function (a) {
            for (var b = a.length, c = []; b--;)
                if (sa(a[b])) c[b] = w(a[b] * 10) - 5;
                else if (a[b] === "Z") c[b] = "x";
            else if (c[b] = a[b], a.isArc && (a[b] === "wa" || a[b] === "at")) c[b + 5] === c[b + 7] && (c[b + 7] += a[b + 7] > a[b + 5] ? 1 : -1), c[b + 6] === c[b + 8] && (c[b + 8] += a[b + 8] > a[b + 6] ? 1 : -1);
            return c.join(" ") || "x"
        },
        clip: function (a) {
            var b = this,
                c;
            a ? (c = a.members, ua(c, b), c.push(b),
                b.destroyClip = function () {
                    ua(c, b)
                }, a = a.getCSS(b)) : (b.destroyClip && b.destroyClip(), a = {
                clip: nb ? "inherit" : "rect(auto)"
            });
            return b.css(a)
        },
        css: Y.prototype.htmlCss,
        safeRemoveChild: function (a) {
            a.parentNode && Ta(a)
        },
        destroy: function () {
            this.destroyClip && this.destroyClip();
            return Y.prototype.destroy.apply(this)
        },
        on: function (a, b) {
            this.element["on" + a] = function () {
                var a = S.event;
                a.target = a.srcElement;
                b(a)
            };
            return this
        },
        cutOffPath: function (a, b) {
            var c, a = a.split(/[ ,]/);
            c = a.length;
            if (c === 9 || c === 11) a[c - 4] = a[c - 2] = C(a[c -
                2]) - 10 * b;
            return a.join(" ")
        },
        shadow: function (a, b, c) {
            var d = [],
                e, f = this.element,
                g = this.renderer,
                h, i = f.style,
                j, k = f.path,
                m, l, o, q;
            k && typeof k.value !== "string" && (k = "x");
            l = k;
            if (a) {
                o = p(a.width, 3);
                q = (a.opacity || 0.15) / o;
                for (e = 1; e <= 3; e++) {
                    m = o * 2 + 1 - 2 * e;
                    c && (l = this.cutOffPath(k.value, m + 0.5));
                    j = ['<shape isShadow="true" strokeweight="', m, '" filled="false" path="', l, '" coordsize="10 10" style="', f.style.cssText, '" />'];
                    h = aa(g.prepVML(j), null, {
                        left: C(i.left) + p(a.offsetX, 1),
                        top: C(i.top) + p(a.offsetY, 1)
                    });
                    if (c) h.cutOff =
                        m + 1;
                    j = ['<stroke color="', a.color || "black", '" opacity="', q * e, '"/>'];
                    aa(g.prepVML(j), null, null, h);
                    b ? b.element.appendChild(h) : f.parentNode.insertBefore(h, f);
                    d.push(h)
                }
                this.shadows = d
            }
            return this
        },
        updateShadows: ha,
        setAttr: function (a, b) {
            nb ? this.element[a] = b : this.element.setAttribute(a, b)
        },
        classSetter: function (a) {
            this.element.className = a
        },
        dashstyleSetter: function (a, b, c) {
            (c.getElementsByTagName("stroke")[0] || aa(this.renderer.prepVML(["<stroke/>"]), null, null, c))[b] = a || "solid";
            this[b] = a
        },
        dSetter: function (a,
            b, c) {
            var d = this.shadows,
                a = a || [];
            this.d = a.join && a.join(" ");
            c.path = a = this.pathToVML(a);
            if (d)
                for (c = d.length; c--;) d[c].path = d[c].cutOff ? this.cutOffPath(a, d[c].cutOff) : a;
            this.setAttr(b, a)
        },
        fillSetter: function (a, b, c) {
            var d = c.nodeName;
            if (d === "SPAN") c.style.color = a;
            else if (d !== "IMG") c.filled = a !== Z, this.setAttr("fillcolor", this.renderer.color(a, c, b, this))
        },
        opacitySetter: ha,
        rotationSetter: function (a, b, c) {
            c = c.style;
            this[b] = c[b] = a;
            c.left = -w(ga(a * ra) + 1) + "px";
            c.top = w(ba(a * ra)) + "px"
        },
        strokeSetter: function (a, b,
            c) {
            this.setAttr("strokecolor", this.renderer.color(a, c, b))
        },
        "stroke-widthSetter": function (a, b, c) {
            c.stroked = !!a;
            this[b] = a;
            sa(a) && (a += "px");
            this.setAttr("strokeweight", a)
        },
        titleSetter: function (a, b) {
            this.setAttr(b, a)
        },
        visibilitySetter: function (a, b, c) {
            a === "inherit" && (a = "visible");
            this.shadows && n(this.shadows, function (c) {
                c.style[b] = a
            });
            c.nodeName === "DIV" && (a = a === "hidden" ? "-999em" : 0, nb || (c.style[b] = a ? "visible" : "hidden"), b = "top");
            c.style[b] = a
        },
        xSetter: function (a, b, c) {
            this[b] = a;
            b === "x" ? b = "left" : b === "y" && (b =
                "top");
            this.updateClipping ? (this[b] = a, this.updateClipping()) : c.style[b] = a
        },
        zIndexSetter: function (a, b, c) {
            c.style[b] = a
        }
    }, A.VMLElement = G = ja(Y, G), G.prototype.ySetter = G.prototype.widthSetter = G.prototype.heightSetter = G.prototype.xSetter, G = {
        Element: G,
        isIE8: Ha.indexOf("MSIE 8.0") > -1,
        init: function (a, b, c, d) {
            var e;
            this.alignedObjects = [];
            d = this.createElement(Ua).css(x(this.getStyle(d), {
                position: "relative"
            }));
            e = d.element;
            a.appendChild(d.element);
            this.isVML = !0;
            this.box = e;
            this.boxWrapper = d;
            this.cache = {};
            this.setSize(b,
                c, !1);
            if (!D.namespaces.hcv) {
                D.namespaces.add("hcv", "urn:schemas-microsoft-com:vml");
                try {
                    D.createStyleSheet().cssText = "hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "
                } catch (f) {
                    D.styleSheets[0].cssText += "hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "
                }
            }
        },
        isHidden: function () {
            return !this.box.offsetWidth
        },
        clipRect: function (a, b, c, d) {
            var e = this.createElement(),
                f = ia(a);
            return x(e, {
                members: [],
                count: 0,
                left: (f ? a.x : a) + 1,
                top: (f ? a.y : b) + 1,
                width: (f ? a.width : c) - 1,
                height: (f ? a.height : d) - 1,
                getCSS: function (a) {
                    var b = a.element,
                        c = b.nodeName,
                        a = a.inverted,
                        d = this.top - (c === "shape" ? b.offsetTop : 0),
                        e = this.left,
                        b = e + this.width,
                        f = d + this.height,
                        d = {
                            clip: "rect(" + w(a ? e : d) + "px," + w(a ? f : b) + "px," + w(a ? b : f) + "px," + w(a ? d : e) + "px)"
                        };
                    !a && nb && c === "DIV" && x(d, {
                        width: b + "px",
                        height: f + "px"
                    });
                    return d
                },
                updateClipping: function () {
                    n(e.members, function (a) {
                        a.element && a.css(e.getCSS(a))
                    })
                }
            })
        },
        color: function (a, b, c, d) {
            var e = this,
                f, g = /^rgba/,
                h, i, j = Z;
            a && a.linearGradient ? i = "gradient" : a && a.radialGradient && (i = "pattern");
            if (i) {
                var k, m, l = a.linearGradient || a.radialGradient,
                    o, q, t, p, z, u = "",
                    a = a.stops,
                    M, oa = [],
                    s = function () {
                        h = ['<fill colors="' + oa.join(",") + '" opacity="', t, '" o:opacity2="', q, '" type="', i, '" ', u, 'focus="100%" method="any" />'];
                        aa(e.prepVML(h), null, null, b)
                    };
                o = a[0];
                M = a[a.length - 1];
                o[0] > 0 && a.unshift([0, o[1]]);
                M[0] < 1 && a.push([1, M[1]]);
                n(a, function (a, b) {
                    g.test(a[1]) ? (f = wa(a[1]), k = f.get("rgb"), m = f.get("a")) : (k = a[1], m = 1);
                    oa.push(a[0] * 100 +
                        "% " + k);
                    b ? (t = m, p = k) : (q = m, z = k)
                });
                if (c === "fill")
                    if (i === "gradient") c = l.x1 || l[0] || 0, a = l.y1 || l[1] || 0, o = l.x2 || l[2] || 0, l = l.y2 || l[3] || 0, u = 'angle="' + (90 - X.atan((l - a) / (o - c)) * 180 / va) + '"', s();
                    else {
                        var j = l.r,
                            r = j * 2,
                            w = j * 2,
                            v = l.cx,
                            x = l.cy,
                            y = b.radialReference,
                            B, j = function () {
                                y && (B = d.getBBox(), v += (y[0] - B.x) / B.width - 0.5, x += (y[1] - B.y) / B.height - 0.5, r *= y[2] / B.width, w *= y[2] / B.height);
                                u = 'src="' + P.global.VMLRadialGradientURL + '" size="' + r + "," + w + '" origin="0.5,0.5" position="' + v + "," + x + '" color2="' + z + '" ';
                                s()
                            };
                        d.added ? j() : d.onAdd =
                            j;
                        j = p
                    } else j = k
            } else if (g.test(a) && b.tagName !== "IMG") f = wa(a), h = ["<", c, ' opacity="', f.get("a"), '"/>'], aa(this.prepVML(h), null, null, b), j = f.get("rgb");
            else {
                j = b.getElementsByTagName(c);
                if (j.length) j[0].opacity = 1, j[0].type = "solid";
                j = a
            }
            return j
        },
        prepVML: function (a) {
            var b = this.isIE8,
                a = a.join("");
            b ? (a = a.replace("/>", ' xmlns="urn:schemas-microsoft-com:vml" />'), a = a.indexOf('style="') === -1 ? a.replace("/>", ' style="display:inline-block;behavior:url(#default#VML);" />') : a.replace('style="', 'style="display:inline-block;behavior:url(#default#VML);')) :
                a = a.replace("<", "<hcv:");
            return a
        },
        text: na.prototype.html,
        path: function (a) {
            var b = {
                coordsize: "10 10"
            };
            Ka(a) ? b.d = a : ia(a) && x(b, a);
            return this.createElement("shape").attr(b)
        },
        circle: function (a, b, c) {
            var d = this.symbol("circle");
            if (ia(a)) c = a.r, b = a.y, a = a.x;
            d.isCircle = !0;
            d.r = c;
            return d.attr({
                x: a,
                y: b
            })
        },
        g: function (a) {
            var b;
            a && (b = {
                className: "highcharts-" + a,
                "class": "highcharts-" + a
            });
            return this.createElement(Ua).attr(b)
        },
        image: function (a, b, c, d, e) {
            var f = this.createElement("img").attr({
                src: a
            });
            arguments.length >
                1 && f.attr({
                    x: b,
                    y: c,
                    width: d,
                    height: e
                });
            return f
        },
        createElement: function (a) {
            return a === "rect" ? this.symbol(a) : na.prototype.createElement.call(this, a)
        },
        invertChild: function (a, b) {
            var c = this,
                d = b.style,
                e = a.tagName === "IMG" && a.style;
            L(a, {
                flip: "x",
                left: C(d.width) - (e ? C(e.top) : 1),
                top: C(d.height) - (e ? C(e.left) : 1),
                rotation: -90
            });
            n(a.childNodes, function (b) {
                c.invertChild(b, a)
            })
        },
        symbols: {
            arc: function (a, b, c, d, e) {
                var f = e.start,
                    g = e.end,
                    h = e.r || c || d,
                    c = e.innerR,
                    d = ba(f),
                    i = ga(f),
                    j = ba(g),
                    k = ga(g);
                if (g - f === 0) return ["x"];
                f = ["wa",
a - h, b - h, a + h, b + h, a + h * d, b + h * i, a + h * j, b + h * k];
                e.open && !c && f.push("e", "M", a, b);
                f.push("at", a - c, b - c, a + c, b + c, a + c * j, b + c * k, a + c * d, b + c * i, "x", "e");
                f.isArc = !0;
                return f
            },
            circle: function (a, b, c, d, e) {
                e && (c = d = 2 * e.r);
                e && e.isCircle && (a -= c / 2, b -= d / 2);
                return ["wa", a, b, a + c, b + d, a + c, b + d / 2, a + c, b + d / 2, "e"]
            },
            rect: function (a, b, c, d, e) {
                return na.prototype.symbols[!r(e) || !e.r ? "square" : "callout"].call(0, a, b, c, d, e)
            }
        }
    }, A.VMLRenderer = ib = function () {
        this.init.apply(this, arguments)
    }, ib.prototype = y(na.prototype, G), Wa = ib;
    na.prototype.measureSpanWidth =
        function (a, b) {
            var c = D.createElement("span"),
                d;
            d = D.createTextNode(a);
            c.appendChild(d);
            L(c, b);
            this.box.appendChild(c);
            d = c.offsetWidth;
            Ta(c);
            return d
        };
    var Vb;
    if (ma) A.CanVGRenderer = G = function () {
        Ia = "http://www.w3.org/1999/xhtml"
    }, G.prototype.symbols = {}, Vb = function () {
        function a() {
            var a = b.length,
                d;
            for (d = 0; d < a; d++) b[d]();
            b = []
        }
        var b = [];
        return {
            push: function (c, d) {
                b.length === 0 && ac(d, a);
                b.push(c)
            }
        }
    }(), Wa = G;
    Za.prototype = {
        addLabel: function () {
            var a = this.axis,
                b = a.options,
                c = a.chart,
                d = a.categories,
                e = a.names,
                f = this.pos,
                g = b.labels,
                h = a.tickPositions,
                i = f === h[0],
                j = f === h[h.length - 1],
                e = d ? p(d[f], e[f], f) : f,
                d = this.label,
                h = h.info,
                k;
            a.isDatetimeAxis && h && (k = b.dateTimeLabelFormats[h.higherRanks[f] || h.unitName]);
            this.isFirst = i;
            this.isLast = j;
            b = a.labelFormatter.call({
                axis: a,
                chart: c,
                isFirst: i,
                isLast: j,
                dateTimeLabelFormat: k,
                value: a.isLog ? la(ta(e)) : e
            });
            r(d) ? d && d.attr({
                text: b
            }) : (this.labelLength = (this.label = d = r(b) && g.enabled ? c.renderer.text(b, 0, 0, g.useHTML).css(y(g.style)).add(a.labelGroup) : null) && d.getBBox().width, this.rotation = 0)
        },
        getLabelSize: function () {
            return this.label ? this.label.getBBox()[this.axis.horiz ? "height" : "width"] : 0
        },
        handleOverflow: function (a) {
            var b = this.axis,
                c = a.x,
                d = b.chart.chartWidth,
                e = b.chart.spacing,
                f = p(b.labelLeft, e[3]),
                e = p(b.labelRight, d - e[1]),
                g = this.label,
                h = this.rotation,
                i = {
                    left: 0,
                    center: 0.5,
                    right: 1
                }[b.labelAlign],
                j = g.getBBox().width,
                k = b.slotWidth,
                m;
            if (h) h < 0 && c - i * j < f ? m = w(c / ba(h * ra) - f) : h > 0 && c + i * j > e && (m = w((d - c) / ba(h * ra)));
            else {
                d = c - i * j;
                c += i * j;
                if (d < f) k -= f - d, a.x = f, g.attr({
                    align: "left"
                });
                else if (c > e) k -= c - e, a.x =
                    e, g.attr({
                        align: "right"
                    });
                if (j > k || b.autoRotation && g.styles.width) m = k
            }
            m && g.css({
                width: m,
                textOverflow: "ellipsis"
            })
        },
        getPosition: function (a, b, c, d) {
            var e = this.axis,
                f = e.chart,
                g = d && f.oldChartHeight || f.chartHeight;
            return {
                x: a ? e.translate(b + c, null, null, d) + e.transB : e.left + e.offset + (e.opposite ? (d && f.oldChartWidth || f.chartWidth) - e.right - e.left : 0),
                y: a ? g - e.bottom + e.offset - (e.opposite ? e.height : 0) : g - e.translate(b + c, null, null, d) - e.transB
            }
        },
        getLabelPosition: function (a, b, c, d, e, f, g, h) {
            var i = this.axis,
                j = i.transA,
                k = i.reversed,
                m = i.staggerLines,
                l = i.tickRotCorr || {
                    x: 0,
                    y: 0
                },
                c = p(e.y, l.y + (i.side === 2 ? 8 : -(c.getBBox().height / 2))),
                a = a + e.x + l.x - (f && d ? f * j * (k ? -1 : 1) : 0),
                b = b + c - (f && !d ? f * j * (k ? 1 : -1) : 0);
            m && (b += g / (h || 1) % m * (i.labelOffset / m));
            return {
                x: a,
                y: w(b)
            }
        },
        getMarkPath: function (a, b, c, d, e, f) {
            return f.crispLine(["M", a, b, "L", a + (e ? 0 : -c), b + (e ? c : 0)], d)
        },
        render: function (a, b, c) {
            var d = this.axis,
                e = d.options,
                f = d.chart.renderer,
                g = d.horiz,
                h = this.type,
                i = this.label,
                j = this.pos,
                k = e.labels,
                m = this.gridLine,
                l = h ? h + "Grid" : "grid",
                o = h ? h + "Tick" : "tick",
                q = e[l + "LineWidth"],
                t = e[l + "LineColor"],
                n = e[l + "LineDashStyle"],
                z = e[o + "Length"],
                l = e[o + "Width"] || 0,
                u = e[o + "Color"],
                M = e[o + "Position"],
                o = this.mark,
                oa = k.step,
                r = !0,
                w = d.tickmarkOffset,
                v = this.getPosition(g, j, w, b),
                x = v.x,
                v = v.y,
                y = g && x === d.pos + d.len || !g && v === d.pos ? -1 : 1,
                c = p(c, 1);
            this.isActive = !0;
            if (q) {
                j = d.getPlotLinePath(j + w, q * y, b, !0);
                if (m === s) {
                    m = {
                        stroke: t,
                        "stroke-width": q
                    };
                    if (n) m.dashstyle = n;
                    if (!h) m.zIndex = 1;
                    if (b) m.opacity = 0;
                    this.gridLine = m = q ? f.path(j).attr(m).add(d.gridGroup) : null
                }
                if (!b && m && j) m[this.isNew ? "attr" : "animate"]({
                    d: j,
                    opacity: c
                })
            }
            if (l && z) M === "inside" && (z = -z), d.opposite && (z = -z), h = this.getMarkPath(x, v, z, l * y, g, f), o ? o.animate({
                d: h,
                opacity: c
            }) : this.mark = f.path(h).attr({
                stroke: u,
                "stroke-width": l,
                opacity: c
            }).add(d.axisGroup);
            if (i && !isNaN(x)) i.xy = v = this.getLabelPosition(x, v, i, g, k, w, a, oa), this.isFirst && !this.isLast && !p(e.showFirstLabel, 1) || this.isLast && !this.isFirst && !p(e.showLastLabel, 1) ? r = !1 : g && !d.isRadial && !k.step && !k.rotation && !b && c !== 0 && this.handleOverflow(v), oa && a % oa && (r = !1), r && !isNaN(v.y) ? (v.opacity = c, i[this.isNew ?
                "attr" : "animate"](v), this.isNew = !1) : i.attr("y", -9999)
        },
        destroy: function () {
            Na(this, this.axis)
        }
    };
    A.PlotLineOrBand = function (a, b) {
        this.axis = a;
        if (b) this.options = b, this.id = b.id
    };
    A.PlotLineOrBand.prototype = {
        render: function () {
            var a = this,
                b = a.axis,
                c = b.horiz,
                d = a.options,
                e = d.label,
                f = a.label,
                g = d.width,
                h = d.to,
                i = d.from,
                j = r(i) && r(h),
                k = d.value,
                m = d.dashStyle,
                l = a.svgElem,
                o = [],
                q, t = d.color,
                p = d.zIndex,
                n = d.events,
                u = {},
                M = b.chart.renderer;
            b.isLog && (i = La(i), h = La(h), k = La(k));
            if (g) {
                if (o = b.getPlotLinePath(k, g), u = {
                        stroke: t,
                        "stroke-width": g
                    },
                    m) u.dashstyle = m
            } else if (j) {
                o = b.getPlotBandPath(i, h, d);
                if (t) u.fill = t;
                if (d.borderWidth) u.stroke = d.borderColor, u["stroke-width"] = d.borderWidth
            } else return;
            if (r(p)) u.zIndex = p;
            if (l)
                if (o) l.animate({
                    d: o
                }, null, l.onGetPath);
                else {
                    if (l.hide(), l.onGetPath = function () {
                            l.show()
                        }, f) a.label = f = f.destroy()
                } else if (o && o.length && (a.svgElem = l = M.path(o).attr(u).add(), n))
                for (q in d = function (b) {
                        l.on(b, function (c) {
                            n[b].apply(a, [c])
                        })
                    }, n) d(q);
            if (e && r(e.text) && o && o.length && b.width > 0 && b.height > 0) {
                e = y({
                    align: c && j && "center",
                    x: c ?
                        !j && 4 : 10,
                    verticalAlign: !c && j && "middle",
                    y: c ? j ? 16 : 10 : j ? 6 : -4,
                    rotation: c && !j && 90
                }, e);
                if (!f) {
                    u = {
                        align: e.textAlign || e.align,
                        rotation: e.rotation
                    };
                    if (r(p)) u.zIndex = p;
                    a.label = f = M.text(e.text, 0, 0, e.useHTML).attr(u).css(e.style).add()
                }
                b = [o[1], o[4], j ? o[6] : o[1]];
                j = [o[2], o[5], j ? o[7] : o[2]];
                o = Sa(b);
                c = Sa(j);
                f.align(e, !1, {
                    x: o,
                    y: c,
                    width: Fa(b) - o,
                    height: Fa(j) - c
                });
                f.show()
            } else f && f.hide();
            return a
        },
        destroy: function () {
            ua(this.axis.plotLinesAndBands, this);
            delete this.axis;
            Na(this)
        }
    };
    var I = A.Axis = function () {
        this.init.apply(this,
            arguments)
    };
    I.prototype = {
        defaultOptions: {
            dateTimeLabelFormats: {
                millisecond: "%H:%M:%S.%L",
                second: "%H:%M:%S",
                minute: "%H:%M",
                hour: "%H:%M",
                day: "%e. %b",
                week: "%e. %b",
                month: "%b '%y",
                year: "%Y"
            },
            endOnTick: !1,
            gridLineColor: "#D8D8D8",
            labels: {
                enabled: !0,
                style: {
                    color: "#606060",
                    cursor: "default",
                    fontSize: "11px"
                },
                x: 0,
                y: 15
            },
            lineColor: "#C0D0E0",
            lineWidth: 1,
            minPadding: 0.01,
            maxPadding: 0.01,
            minorGridLineColor: "#E0E0E0",
            minorGridLineWidth: 1,
            minorTickColor: "#A0A0A0",
            minorTickLength: 2,
            minorTickPosition: "outside",
            startOfWeek: 1,
            startOnTick: !1,
            tickColor: "#C0D0E0",
            tickLength: 10,
            tickmarkPlacement: "between",
            tickPixelInterval: 100,
            tickPosition: "outside",
            tickWidth: 1,
            title: {
                align: "middle",
                style: {
                    color: "#707070"
                }
            },
            type: "linear"
        },
        defaultYAxisOptions: {
            endOnTick: !0,
            gridLineWidth: 1,
            tickPixelInterval: 72,
            showLastLabel: !0,
            labels: {
                x: -8,
                y: 3
            },
            lineWidth: 0,
            maxPadding: 0.05,
            minPadding: 0.05,
            startOnTick: !0,
            tickWidth: 0,
            title: {
                rotation: 270,
                text: "Values"
            },
            stackLabels: {
                enabled: !1,
                formatter: function () {
                    return A.numberFormat(this.total, -1)
                },
                style: y(U.line.dataLabels.style, {
                    color: "#000000"
                })
            }
        },
        defaultLeftAxisOptions: {
            labels: {
                x: -15,
                y: null
            },
            title: {
                rotation: 270
            }
        },
        defaultRightAxisOptions: {
            labels: {
                x: 15,
                y: null
            },
            title: {
                rotation: 90
            }
        },
        defaultBottomAxisOptions: {
            labels: {
                autoRotation: [-45],
                x: 0,
                y: null
            },
            title: {
                rotation: 0
            }
        },
        defaultTopAxisOptions: {
            labels: {
                autoRotation: [-45],
                x: 0,
                y: -15
            },
            title: {
                rotation: 0
            }
        },
        init: function (a, b) {
            var c = b.isX;
            this.horiz = a.inverted ? !c : c;
            this.coll = (this.isXAxis = c) ? "xAxis" : "yAxis";
            this.opposite = b.opposite;
            this.side = b.side || (this.horiz ? this.opposite ? 0 : 2 : this.opposite ?
                1 : 3);
            this.setOptions(b);
            var d = this.options,
                e = d.type;
            this.labelFormatter = d.labels.formatter || this.defaultLabelFormatter;
            this.userOptions = b;
            this.minPixelPadding = 0;
            this.chart = a;
            this.reversed = d.reversed;
            this.zoomEnabled = d.zoomEnabled !== !1;
            this.categories = d.categories || e === "category";
            this.names = this.names || [];
            this.isLog = e === "logarithmic";
            this.isDatetimeAxis = e === "datetime";
            this.isLinked = r(d.linkedTo);
            this.ticks = {};
            this.labelEdge = [];
            this.minorTicks = {};
            this.plotLinesAndBands = [];
            this.alternateBands = {};
            this.len =
                0;
            this.minRange = this.userMinRange = d.minRange || d.maxZoom;
            this.range = d.range;
            this.offset = d.offset || 0;
            this.stacks = {};
            this.oldStacks = {};
            this.min = this.max = null;
            this.crosshair = p(d.crosshair, pa(a.options.tooltip.crosshairs)[c ? 0 : 1], !1);
            var f, d = this.options.events;
            Oa(this, a.axes) === -1 && (c && !this.isColorAxis ? a.axes.splice(a.xAxis.length, 0, this) : a.axes.push(this), a[this.coll].push(this));
            this.series = this.series || [];
            if (a.inverted && c && this.reversed === s) this.reversed = !0;
            this.removePlotLine = this.removePlotBand =
                this.removePlotBandOrLine;
            for (f in d) E(this, f, d[f]);
            if (this.isLog) this.val2lin = La, this.lin2val = ta
        },
        setOptions: function (a) {
            this.options = y(this.defaultOptions, this.isXAxis ? {} : this.defaultYAxisOptions, [this.defaultTopAxisOptions, this.defaultRightAxisOptions, this.defaultBottomAxisOptions, this.defaultLeftAxisOptions][this.side], y(P[this.coll], a))
        },
        defaultLabelFormatter: function () {
            var a = this.axis,
                b = this.value,
                c = a.categories,
                d = this.dateTimeLabelFormat,
                e = P.lang.numericSymbols,
                f = e && e.length,
                g, h = a.options.labels.format,
                a = a.isLog ? b : a.tickInterval;
            if (h) g = Ma(h, this);
            else if (c) g = b;
            else if (d) g = ka(d, b);
            else if (f && a >= 1E3)
                for (; f-- && g === s;) c = Math.pow(1E3, f + 1), a >= c && e[f] !== null && (g = A.numberFormat(b / c, -1) + e[f]);
            g === s && (g = Q(b) >= 1E4 ? A.numberFormat(b, 0) : A.numberFormat(b, -1, s, ""));
            return g
        },
        getSeriesExtremes: function () {
            var a = this,
                b = a.chart;
            a.hasVisibleSeries = !1;
            a.dataMin = a.dataMax = a.ignoreMinPadding = a.ignoreMaxPadding = null;
            a.buildStacks && a.buildStacks();
            n(a.series, function (c) {
                if (c.visible || !b.options.chart.ignoreHiddenSeries) {
                    var d;
                    d = c.options.threshold;
                    var e;
                    a.hasVisibleSeries = !0;
                    a.isLog && d <= 0 && (d = null);
                    if (a.isXAxis) {
                        if (d = c.xData, d.length) a.dataMin = B(p(a.dataMin, d[0]), Sa(d)), a.dataMax = v(p(a.dataMax, d[0]), Fa(d))
                    } else {
                        c.getExtremes();
                        e = c.dataMax;
                        c = c.dataMin;
                        if (r(c) && r(e)) a.dataMin = B(p(a.dataMin, c), c), a.dataMax = v(p(a.dataMax, e), e);
                        if (r(d))
                            if (a.dataMin >= d) a.dataMin = d, a.ignoreMinPadding = !0;
                            else if (a.dataMax < d) a.dataMax = d, a.ignoreMaxPadding = !0
                    }
                }
            })
        },
        translate: function (a, b, c, d, e, f) {
            var g = 1,
                h = 0,
                i = d ? this.oldTransA : this.transA,
                d = d ? this.oldMin :
                this.min,
                j = this.minPixelPadding,
                e = (this.doPostTranslate || this.isLog && e) && this.lin2val;
            if (!i) i = this.transA;
            if (c) g *= -1, h = this.len;
            this.reversed && (g *= -1, h -= g * (this.sector || this.len));
            b ? (a = a * g + h, a -= j, a = a / i + d, e && (a = this.lin2val(a))) : (e && (a = this.val2lin(a)), f === "between" && (f = 0.5), a = g * (a - d) * i + h + g * j + (sa(f) ? i * f * this.pointRange : 0));
            return a
        },
        toPixels: function (a, b) {
            return this.translate(a, !1, !this.horiz, null, !0) + (b ? 0 : this.pos)
        },
        toValue: function (a, b) {
            return this.translate(a - (b ? 0 : this.pos), !0, !this.horiz, null, !0)
        },
        getPlotLinePath: function (a, b, c, d, e) {
            var f = this.chart,
                g = this.left,
                h = this.top,
                i, j, k = c && f.oldChartHeight || f.chartHeight,
                m = c && f.oldChartWidth || f.chartWidth,
                l;
            i = this.transB;
            var o = function (a, b, c) {
                    if (a < b || a > c) d ? a = B(v(b, a), c) : l = !0;
                    return a
                },
                e = p(e, this.translate(a, null, null, c)),
                a = c = w(e + i);
            i = j = w(k - e - i);
            isNaN(e) ? l = !0 : this.horiz ? (i = h, j = k - this.bottom, a = c = o(a, g, g + this.width)) : (a = g, c = m - this.right, i = j = o(i, h, h + this.height));
            return l && !d ? null : f.renderer.crispLine(["M", a, i, "L", c, j], b || 1)
        },
        getLinearTickPositions: function (a,
            b, c) {
            var d, e = la(W(b / a) * a),
                f = la(za(c / a) * a),
                g = [];
            if (b === c && sa(b)) return [b];
            for (b = e; b <= f;) {
                g.push(b);
                b = la(b + a);
                if (b === d) break;
                d = b
            }
            return g
        },
        getMinorTickPositions: function () {
            var a = this.options,
                b = this.tickPositions,
                c = this.minorTickInterval,
                d = [],
                e, f = this.min;
            e = this.max;
            var g = e - f;
            if (g && g / c < this.len / 3)
                if (this.isLog) {
                    a = b.length;
                    for (e = 1; e < a; e++) d = d.concat(this.getLogTickPositions(c, b[e - 1], b[e], !0))
                } else if (this.isDatetimeAxis && a.minorTickInterval === "auto") d = d.concat(this.getTimeTicks(this.normalizeTimeTickInterval(c),
                f, e, a.startOfWeek));
            else
                for (b = f + (b[0] - f) % c; b <= e; b += c) d.push(b);
            this.trimTicks(d);
            return d
        },
        adjustForMinRange: function () {
            var a = this.options,
                b = this.min,
                c = this.max,
                d, e = this.dataMax - this.dataMin >= this.minRange,
                f, g, h, i, j;
            if (this.isXAxis && this.minRange === s && !this.isLog) r(a.min) || r(a.max) ? this.minRange = null : (n(this.series, function (a) {
                i = a.xData;
                for (g = j = a.xIncrement ? 1 : i.length - 1; g > 0; g--)
                    if (h = i[g] - i[g - 1], f === s || h < f) f = h
            }), this.minRange = B(f * 5, this.dataMax - this.dataMin));
            if (c - b < this.minRange) {
                var k = this.minRange;
                d = (k - c + b) / 2;
                d = [b - d, p(a.min, b - d)];
                if (e) d[2] = this.dataMin;
                b = Fa(d);
                c = [b + k, p(a.max, b + k)];
                if (e) c[2] = this.dataMax;
                c = Sa(c);
                c - b < k && (d[0] = c - k, d[1] = p(a.min, c - k), b = Fa(d))
            }
            this.min = b;
            this.max = c
        },
        setAxisTranslation: function (a) {
            var b = this,
                c = b.max - b.min,
                d = b.axisPointRange || 0,
                e, f = 0,
                g = 0,
                h = b.linkedParent,
                i = !!b.categories,
                j = b.transA,
                k = b.isXAxis;
            if (k || i || d)
                if (h ? (f = h.minPointOffset, g = h.pointRangePadding) : n(b.series, function (a) {
                        var h = i ? 1 : k ? a.pointRange : b.axisPointRange || 0,
                            j = a.options.pointPlacement,
                            q = a.closestPointRange;
                        h > c && (h = 0);
                        d = v(d, h);
                        b.single || (f = v(f, Ja(j) ? 0 : h / 2), g = v(g, j === "on" ? 0 : h));
                        !a.noSharedTooltip && r(q) && (e = r(e) ? B(e, q) : q)
                    }), h = b.ordinalSlope && e ? b.ordinalSlope / e : 1, b.minPointOffset = f *= h, b.pointRangePadding = g *= h, b.pointRange = B(d, c), k) b.closestPointRange = e;
            if (a) b.oldTransA = j;
            b.translationSlope = b.transA = j = b.len / (c + g || 1);
            b.transB = b.horiz ? b.left : b.bottom;
            b.minPixelPadding = j * f
        },
        setTickInterval: function (a) {
            var b = this,
                c = b.chart,
                d = b.options,
                e = b.isLog,
                f = b.isDatetimeAxis,
                g = b.isXAxis,
                h = b.isLinked,
                i = d.maxPadding,
                j = d.minPadding,
                k = d.tickInterval,
                m = d.tickPixelInterval,
                l = b.categories;
            !f && !l && !h && this.getTickAmount();
            h ? (b.linkedParent = c[b.coll][d.linkedTo], c = b.linkedParent.getExtremes(), b.min = p(c.min, c.dataMin), b.max = p(c.max, c.dataMax), d.type !== b.linkedParent.options.type && qa(11, 1)) : (b.min = p(b.userMin, d.min, b.dataMin), b.max = p(b.userMax, d.max, b.dataMax));
            if (e) !a && B(b.min, p(b.dataMin, b.min)) <= 0 && qa(10, 1), b.min = la(La(b.min)), b.max = la(La(b.max));
            if (b.range && r(b.max)) b.userMin = b.min = v(b.min, b.max - b.range), b.userMax = b.max, b.range =
                null;
            b.beforePadding && b.beforePadding();
            b.adjustForMinRange();
            if (!l && !b.axisPointRange && !b.usePercentage && !h && r(b.min) && r(b.max) && (c = b.max - b.min)) {
                if (!r(d.min) && !r(b.userMin) && j && (b.dataMin < 0 || !b.ignoreMinPadding)) b.min -= c * j;
                if (!r(d.max) && !r(b.userMax) && i && (b.dataMax > 0 || !b.ignoreMaxPadding)) b.max += c * i
            }
            if (sa(d.floor)) b.min = v(b.min, d.floor);
            if (sa(d.ceiling)) b.max = B(b.max, d.ceiling);
            b.tickInterval = b.min === b.max || b.min === void 0 || b.max === void 0 ? 1 : h && !k && m === b.linkedParent.options.tickPixelInterval ? b.linkedParent.tickInterval :
                p(k, this.tickAmount ? (b.max - b.min) / v(this.tickAmount - 1, 1) : void 0, l ? 1 : (b.max - b.min) * m / v(b.len, m));
            g && !a && n(b.series, function (a) {
                a.processData(b.min !== b.oldMin || b.max !== b.oldMax)
            });
            b.setAxisTranslation(!0);
            b.beforeSetTickPositions && b.beforeSetTickPositions();
            if (b.postProcessTickInterval) b.tickInterval = b.postProcessTickInterval(b.tickInterval);
            if (b.pointRange) b.tickInterval = v(b.pointRange, b.tickInterval);
            a = p(d.minTickInterval, b.isDatetimeAxis && b.closestPointRange);
            if (!k && b.tickInterval < a) b.tickInterval =
                a;
            if (!f && !e && !k) b.tickInterval = wb(b.tickInterval, null, vb(b.tickInterval), p(d.allowDecimals, !(b.tickInterval > 0.5 && b.tickInterval < 5 && b.max > 1E3 && b.max < 9999)), !!this.tickAmount);
            if (!this.tickAmount && this.len) b.tickInterval = b.unsquish();
            this.setTickPositions()
        },
        setTickPositions: function () {
            var a = this.options,
                b, c = a.tickPositions,
                d = a.tickPositioner,
                e = a.startOnTick,
                f = a.endOnTick,
                g;
            this.tickmarkOffset = this.categories && a.tickmarkPlacement === "between" && this.tickInterval === 1 ? 0.5 : 0;
            this.minorTickInterval = a.minorTickInterval ===
                "auto" && this.tickInterval ? this.tickInterval / 5 : a.minorTickInterval;
            this.tickPositions = b = a.tickPositions && a.tickPositions.slice();
            if (!b && (this.tickPositions = b = this.isDatetimeAxis ? this.getTimeTicks(this.normalizeTimeTickInterval(this.tickInterval, a.units), this.min, this.max, a.startOfWeek, this.ordinalPositions, this.closestPointRange, !0) : this.isLog ? this.getLogTickPositions(this.tickInterval, this.min, this.max) : this.getLinearTickPositions(this.tickInterval, this.min, this.max), d && (d = d.apply(this, [this.min,
this.max])))) this.tickPositions = b = d;
            if (!this.isLinked) this.trimTicks(b, e, f), this.min === this.max && r(this.min) && !this.tickAmount && (g = !0, this.min -= 0.5, this.max += 0.5), this.single = g, !c && !d && this.adjustTickAmount()
        },
        trimTicks: function (a, b, c) {
            var d = a[0],
                e = a[a.length - 1],
                f = this.minPointOffset || 0;
            b ? this.min = d : this.min - f > d && a.shift();
            c ? this.max = e : this.max + f < e && a.pop();
            a.length === 0 && r(d) && a.push((e + d) / 2)
        },
        getTickAmount: function () {
            var a = {},
                b, c = this.options,
                d = c.tickAmount,
                e = c.tickPixelInterval;
            !r(c.tickInterval) &&
                this.len < e && !this.isRadial && !this.isLog && c.startOnTick && c.endOnTick && (d = 2);
            !d && this.chart.options.chart.alignTicks !== !1 && c.alignTicks !== !1 && (n(this.chart[this.coll], function (c) {
                var d = c.options,
                    c = c.horiz,
                    d = [c ? d.left : d.top, c ? d.width : d.height, d.pane].join(",");
                a[d] ? b = !0 : a[d] = 1
            }), b && (d = za(this.len / e) + 1));
            if (d < 4) this.finalTickAmt = d, d = 5;
            this.tickAmount = d
        },
        adjustTickAmount: function () {
            var a = this.tickInterval,
                b = this.tickPositions,
                c = this.tickAmount,
                d = this.finalTickAmt,
                e = b && b.length;
            if (e < c) {
                for (; b.length < c;) b.push(la(b[b.length -
                    1] + a));
                this.transA *= (e - 1) / (c - 1);
                this.max = b[b.length - 1]
            } else e > c && (this.tickInterval *= 2, this.setTickPositions());
            if (r(d)) {
                for (a = c = b.length; a--;)(d === 3 && a % 2 === 1 || d <= 2 && a > 0 && a < c - 1) && b.splice(a, 1);
                this.finalTickAmt = s
            }
        },
        setScale: function () {
            var a = this.stacks,
                b, c, d, e;
            this.oldMin = this.min;
            this.oldMax = this.max;
            this.oldAxisLength = this.len;
            this.setAxisSize();
            e = this.len !== this.oldAxisLength;
            n(this.series, function (a) {
                if (a.isDirtyData || a.isDirty || a.xAxis.isDirty) d = !0
            });
            if (e || d || this.isLinked || this.forceRedraw ||
                this.userMin !== this.oldUserMin || this.userMax !== this.oldUserMax) {
                if (!this.isXAxis)
                    for (b in a)
                        for (c in a[b]) a[b][c].total = null, a[b][c].cum = 0;
                this.forceRedraw = !1;
                this.getSeriesExtremes();
                this.setTickInterval();
                this.oldUserMin = this.userMin;
                this.oldUserMax = this.userMax;
                if (!this.isDirty) this.isDirty = e || this.min !== this.oldMin || this.max !== this.oldMax
            } else if (!this.isXAxis) {
                if (this.oldStacks) a = this.stacks = this.oldStacks;
                for (b in a)
                    for (c in a[b]) a[b][c].cum = a[b][c].total
            }
        },
        setExtremes: function (a, b, c, d, e) {
            var f =
                this,
                g = f.chart,
                c = p(c, !0);
            n(f.series, function (a) {
                delete a.kdTree
            });
            e = x(e, {
                min: a,
                max: b
            });
            F(f, "setExtremes", e, function () {
                f.userMin = a;
                f.userMax = b;
                f.eventArgs = e;
                f.isDirtyExtremes = !0;
                c && g.redraw(d)
            })
        },
        zoom: function (a, b) {
            var c = this.dataMin,
                d = this.dataMax,
                e = this.options;
            this.allowZoomOutside || (r(c) && a <= B(c, p(e.min, c)) && (a = s), r(d) && b >= v(d, p(e.max, d)) && (b = s));
            this.displayBtn = a !== s || b !== s;
            this.setExtremes(a, b, !1, s, {
                trigger: "zoom"
            });
            return !0
        },
        setAxisSize: function () {
            var a = this.chart,
                b = this.options,
                c = b.offsetLeft ||
                0,
                d = this.horiz,
                e = p(b.width, a.plotWidth - c + (b.offsetRight || 0)),
                f = p(b.height, a.plotHeight),
                g = p(b.top, a.plotTop),
                b = p(b.left, a.plotLeft + c),
                c = /%$/;
            c.test(f) && (f = parseFloat(f) / 100 * a.plotHeight);
            c.test(g) && (g = parseFloat(g) / 100 * a.plotHeight + a.plotTop);
            this.left = b;
            this.top = g;
            this.width = e;
            this.height = f;
            this.bottom = a.chartHeight - f - g;
            this.right = a.chartWidth - e - b;
            this.len = v(d ? e : f, 0);
            this.pos = d ? b : g
        },
        getExtremes: function () {
            var a = this.isLog;
            return {
                min: a ? la(ta(this.min)) : this.min,
                max: a ? la(ta(this.max)) : this.max,
                dataMin: this.dataMin,
                dataMax: this.dataMax,
                userMin: this.userMin,
                userMax: this.userMax
            }
        },
        getThreshold: function (a) {
            var b = this.isLog,
                c = b ? ta(this.min) : this.min,
                b = b ? ta(this.max) : this.max;
            c > a || a === null ? a = c : b < a && (a = b);
            return this.translate(a, 0, 1, 0, 1)
        },
        autoLabelAlign: function (a) {
            a = (p(a, 0) - this.side * 90 + 720) % 360;
            return a > 15 && a < 165 ? "right" : a > 195 && a < 345 ? "left" : "center"
        },
        unsquish: function () {
            var a = this.ticks,
                b = this.options.labels,
                c = this.horiz,
                d = this.tickInterval,
                e = d,
                f = this.len / (((this.categories ? 1 : 0) + this.max - this.min) / d),
                g, h = b.rotation,
                i = this.chart.renderer.fontMetrics(b.style.fontSize, a[0] && a[0].label),
                j, k = Number.MAX_VALUE,
                m, l = function (a) {
                    a /= f || 1;
                    a = a > 1 ? za(a) : 1;
                    return a * d
                };
            c ? (m = r(h) ? [h] : f < p(b.autoRotationLimit, 80) && !b.staggerLines && !b.step && b.autoRotation) && n(m, function (a) {
                var b;
                if (a === h || a && a >= -90 && a <= 90) j = l(Q(i.h / ga(ra * a))), b = j + Q(a / 360), b < k && (k = b, g = a, e = j)
            }) : e = l(i.h);
            this.autoRotation = m;
            this.labelRotation = g;
            return e
        },
        renderUnsquish: function () {
            var a = this.chart,
                b = a.renderer,
                c = this.tickPositions,
                d = this.ticks,
                e = this.options.labels,
                f = this.horiz,
                g = a.margin,
                h = this.slotWidth = f && !e.step && !e.rotation && (this.staggerLines || 1) * a.plotWidth / c.length || !f && (g[3] && g[3] - a.spacing[3] || a.chartWidth * 0.33),
                i = v(1, w(h - 2 * (e.padding || 5))),
                j = {},
                g = b.fontMetrics(e.style.fontSize, d[0] && d[0].label),
                k, m = 0;
            if (!Ja(e.rotation)) j.rotation = e.rotation;
            if (this.autoRotation) n(c, function (a) {
                if ((a = d[a]) && a.labelLength > m) m = a.labelLength
            }), m > i && m > g.h ? j.rotation = this.labelRotation : this.labelRotation = 0;
            else if (h) {
                k = {
                    width: i + "px",
                    textOverflow: "clip"
                };
                for (h = c.length; !f &&
                    h--;)
                    if (i = c[h], i = d[i].label)
                        if (i.styles.textOverflow === "ellipsis" && i.css({
                                textOverflow: "clip"
                            }), i.getBBox().height > this.len / c.length - (g.h - g.f)) i.specCss = {
                            textOverflow: "ellipsis"
                        }
            }
            j.rotation && (k = {
                width: (m > a.chartHeight * 0.5 ? a.chartHeight * 0.33 : a.chartHeight) + "px",
                textOverflow: "ellipsis"
            });
            this.labelAlign = j.align = e.align || this.autoLabelAlign(this.labelRotation);
            n(c, function (a) {
                var b = (a = d[a]) && a.label;
                if (b) k && b.css(y(k, b.specCss)), delete b.specCss, b.attr(j), a.rotation = j.rotation
            });
            this.tickRotCorr = b.rotCorr(g.b,
                this.labelRotation || 0, this.side === 2)
        },
        getOffset: function () {
            var a = this,
                b = a.chart,
                c = b.renderer,
                d = a.options,
                e = a.tickPositions,
                f = a.ticks,
                g = a.horiz,
                h = a.side,
                i = b.inverted ? [1, 0, 3, 2][h] : h,
                j, k, m = 0,
                l, o = 0,
                q = d.title,
                t = d.labels,
                $ = 0,
                z = b.axisOffset,
                b = b.clipOffset,
                u = [-1, 1, 1, -1][h],
                M;
            a.hasData = j = a.hasVisibleSeries || r(a.min) && r(a.max) && !!e;
            a.showAxis = k = j || p(d.showEmpty, !0);
            a.staggerLines = a.horiz && t.staggerLines;
            if (!a.axisGroup) a.gridGroup = c.g("grid").attr({
                zIndex: d.gridZIndex || 1
            }).add(), a.axisGroup = c.g("axis").attr({
                zIndex: d.zIndex ||
                    2
            }).add(), a.labelGroup = c.g("axis-labels").attr({
                zIndex: t.zIndex || 7
            }).addClass("highcharts-" + a.coll.toLowerCase() + "-labels").add();
            if (j || a.isLinked) {
                if (n(e, function (b) {
                        f[b] ? f[b].addLabel() : f[b] = new Za(a, b)
                    }), a.renderUnsquish(), n(e, function (b) {
                        if (h === 0 || h === 2 || {
                                1: "left",
                                3: "right"
                            }[h] === a.labelAlign) $ = v(f[b].getLabelSize(), $)
                    }), a.staggerLines) $ *= a.staggerLines, a.labelOffset = $
            } else
                for (M in f) f[M].destroy(), delete f[M];
            if (q && q.text && q.enabled !== !1) {
                if (!a.axisTitle) a.axisTitle = c.text(q.text, 0, 0, q.useHTML).attr({
                    zIndex: 7,
                    rotation: q.rotation || 0,
                    align: q.textAlign || {
                        low: "left",
                        middle: "center",
                        high: "right"
                    }[q.align]
                }).addClass("highcharts-" + this.coll.toLowerCase() + "-title").css(q.style).add(a.axisGroup), a.axisTitle.isNew = !0;
                if (k) m = a.axisTitle.getBBox()[g ? "height" : "width"], l = q.offset, o = r(l) ? 0 : p(q.margin, g ? 5 : 10);
                a.axisTitle[k ? "show" : "hide"]()
            }
            a.offset = u * p(d.offset, z[h]);
            a.tickRotCorr = a.tickRotCorr || {
                x: 0,
                y: 0
            };
            c = h === 2 ? a.tickRotCorr.y : 0;
            g = $ + o + ($ && u * (g ? p(t.y, a.tickRotCorr.y + 8) : t.x) - c);
            a.axisTitleMargin = p(l, g);
            z[h] = v(z[h], a.axisTitleMargin +
                m + u * a.offset, g);
            b[i] = v(b[i], W(d.lineWidth / 2) * 2)
        },
        getLinePath: function (a) {
            var b = this.chart,
                c = this.opposite,
                d = this.offset,
                e = this.horiz,
                f = this.left + (c ? this.width : 0) + d,
                d = b.chartHeight - this.bottom - (c ? this.height : 0) + d;
            c && (a *= -1);
            return b.renderer.crispLine(["M", e ? this.left : f, e ? d : this.top, "L", e ? b.chartWidth - this.right : f, e ? d : b.chartHeight - this.bottom], a)
        },
        getTitlePosition: function () {
            var a = this.horiz,
                b = this.left,
                c = this.top,
                d = this.len,
                e = this.options.title,
                f = a ? b : c,
                g = this.opposite,
                h = this.offset,
                i = C(e.style.fontSize ||
                    12),
                d = {
                    low: f + (a ? 0 : d),
                    middle: f + d / 2,
                    high: f + (a ? d : 0)
                }[e.align],
                b = (a ? c + this.height : b) + (a ? 1 : -1) * (g ? -1 : 1) * this.axisTitleMargin + (this.side === 2 ? i : 0);
            return {
                x: a ? d : b + (g ? this.width : 0) + h + (e.x || 0),
                y: a ? b - (g ? this.height : 0) + h : d + (e.y || 0)
            }
        },
        render: function () {
            var a = this,
                b = a.chart,
                c = b.renderer,
                d = a.options,
                e = a.isLog,
                f = a.isLinked,
                g = a.tickPositions,
                h = a.axisTitle,
                i = a.ticks,
                j = a.minorTicks,
                k = a.alternateBands,
                m = d.stackLabels,
                l = d.alternateGridColor,
                o = a.tickmarkOffset,
                q = d.lineWidth,
                t, p = b.hasRendered && r(a.oldMin) && !isNaN(a.oldMin);
            t = a.hasData;
            var z = a.showAxis,
                u, M;
            a.labelEdge.length = 0;
            a.overlap = !1;
            n([i, j, k], function (a) {
                for (var b in a) a[b].isActive = !1
            });
            if (t || f) {
                a.minorTickInterval && !a.categories && n(a.getMinorTickPositions(), function (b) {
                    j[b] || (j[b] = new Za(a, b, "minor"));
                    p && j[b].isNew && j[b].render(null, !0);
                    j[b].render(null, !1, 1)
                });
                if (g.length && (n(g, function (b, c) {
                        if (!f || b >= a.min && b <= a.max) i[b] || (i[b] = new Za(a, b)), p && i[b].isNew && i[b].render(c, !0, 0.1), i[b].render(c)
                    }), o && (a.min === 0 || a.single))) i[-1] || (i[-1] = new Za(a, -1, null, !0)),
                    i[-1].render(-1);
                l && n(g, function (b, c) {
                    if (c % 2 === 0 && b < a.max) k[b] || (k[b] = new A.PlotLineOrBand(a)), u = b + o, M = g[c + 1] !== s ? g[c + 1] + o : a.max, k[b].options = {
                        from: e ? ta(u) : u,
                        to: e ? ta(M) : M,
                        color: l
                    }, k[b].render(), k[b].isActive = !0
                });
                if (!a._addedPlotLB) n((d.plotLines || []).concat(d.plotBands || []), function (b) {
                    a.addPlotBandOrLine(b)
                }), a._addedPlotLB = !0
            }
            n([i, j, k], function (a) {
                var c, d, e = [],
                    f = Ga ? Ga.duration || 500 : 0,
                    g = function () {
                        for (d = e.length; d--;) a[e[d]] && !a[e[d]].isActive && (a[e[d]].destroy(), delete a[e[d]])
                    };
                for (c in a)
                    if (!a[c].isActive) a[c].render(c, !1, 0), a[c].isActive = !1, e.push(c);
                a === k || !b.hasRendered || !f ? g() : f && setTimeout(g, f)
            });
            if (q) t = a.getLinePath(q), a.axisLine ? a.axisLine.animate({
                d: t
            }) : a.axisLine = c.path(t).attr({
                stroke: d.lineColor,
                "stroke-width": q,
                zIndex: 7
            }).add(a.axisGroup), a.axisLine[z ? "show" : "hide"]();
            if (h && z) h[h.isNew ? "attr" : "animate"](a.getTitlePosition()), h.isNew = !1;
            m && m.enabled && a.renderStackTotals();
            a.isDirty = !1
        },
        redraw: function () {
            this.render();
            n(this.plotLinesAndBands, function (a) {
                a.render()
            });
            n(this.series, function (a) {
                a.isDirty = !0
            })
        },
        destroy: function (a) {
            var b = this,
                c = b.stacks,
                d, e = b.plotLinesAndBands;
            a || T(b);
            for (d in c) Na(c[d]), c[d] = null;
            n([b.ticks, b.minorTicks, b.alternateBands], function (a) {
                Na(a)
            });
            for (a = e.length; a--;) e[a].destroy();
            n("stackTotalGroup,axisLine,axisTitle,axisGroup,cross,gridGroup,labelGroup".split(","), function (a) {
                b[a] && (b[a] = b[a].destroy())
            });
            this.cross && this.cross.destroy()
        },
        drawCrosshair: function (a, b) {
            var c, d = this.crosshair,
                e = d.animation;
            if (!this.crosshair || (r(b) || !p(this.crosshair.snap, !0)) === !1) this.hideCrosshair();
            else if (p(d.snap, !0) ? r(b) && (c = this.isXAxis ? b.plotX : this.len - b.plotY) : c = this.horiz ? a.chartX - this.pos : this.len - a.chartY + this.pos, c = this.isRadial ? this.getPlotLinePath(this.isXAxis ? b.x : p(b.stackY, b.y)) || null : this.getPlotLinePath(null, null, null, null, c) || null, c === null) this.hideCrosshair();
            else if (this.cross) this.cross.attr({
                visibility: "visible"
            })[e ? "animate" : "attr"]({
                d: c
            }, e);
            else {
                e = this.categories && !this.isRadial;
                e = {
                    "stroke-width": d.width || (e ? this.transA : 1),
                    stroke: d.color || (e ? "rgba(155,200,255,0.2)" : "#C0C0C0"),
                    zIndex: d.zIndex || 2
                };
                if (d.dashStyle) e.dashstyle = d.dashStyle;
                this.cross = this.chart.renderer.path(c).attr(e).add()
            }
        },
        hideCrosshair: function () {
            this.cross && this.cross.hide()
        }
    };
    x(I.prototype, {
        getPlotBandPath: function (a, b) {
            var c = this.getPlotLinePath(b, null, null, !0),
                d = this.getPlotLinePath(a, null, null, !0);
            d && c && d.toString() !== c.toString() ? d.push(c[4], c[5], c[1], c[2]) : d = null;
            return d
        },
        addPlotBand: function (a) {
            return this.addPlotBandOrLine(a, "plotBands")
        },
        addPlotLine: function (a) {
            return this.addPlotBandOrLine(a,
                "plotLines")
        },
        addPlotBandOrLine: function (a, b) {
            var c = (new A.PlotLineOrBand(this, a)).render(),
                d = this.userOptions;
            c && (b && (d[b] = d[b] || [], d[b].push(a)), this.plotLinesAndBands.push(c));
            return c
        },
        removePlotBandOrLine: function (a) {
            for (var b = this.plotLinesAndBands, c = this.options, d = this.userOptions, e = b.length; e--;) b[e].id === a && b[e].destroy();
            n([c.plotLines || [], d.plotLines || [], c.plotBands || [], d.plotBands || []], function (b) {
                for (e = b.length; e--;) b[e].id === a && ua(b, b[e])
            })
        }
    });
    I.prototype.getTimeTicks = function (a, b, c,
        d) {
        var e = [],
            f = {},
            g = P.global.useUTC,
            h, i = new fa(b - bb(b)),
            j = a.unitRange,
            k = a.count;
        if (r(b)) {
            i[Ob](j >= H.second ? 0 : k * W(i.getMilliseconds() / k));
            if (j >= H.second) i[Pb](j >= H.minute ? 0 : k * W(i.getSeconds() / k));
            if (j >= H.minute) i[Qb](j >= H.hour ? 0 : k * W(i[yb]() / k));
            if (j >= H.hour) i[Rb](j >= H.day ? 0 : k * W(i[zb]() / k));
            if (j >= H.day) i[Bb](j >= H.month ? 1 : k * W(i[cb]() / k));
            j >= H.month && (i[Cb](j >= H.year ? 0 : k * W(i[db]() / k)), h = i[eb]());
            j >= H.year && (h -= h % k, i[Db](h));
            if (j === H.week) i[Bb](i[cb]() - i[Ab]() + p(d, 1));
            b = 1;
            if (ub || kb) i = i.getTime(), i = new fa(i +
                bb(i));
            h = i[eb]();
            for (var d = i.getTime(), m = i[db](), l = i[cb](), o = (H.day + (g ? bb(i) : i.getTimezoneOffset() * 6E4)) % H.day; d < c;) e.push(d), j === H.year ? d = mb(h + b * k, 0) : j === H.month ? d = mb(h, m + b * k) : !g && (j === H.day || j === H.week) ? d = mb(h, m, l + b * k * (j === H.day ? 1 : 7)) : d += j * k, b++;
            e.push(d);
            n(hb(e, function (a) {
                return j <= H.hour && a % H.day === o
            }), function (a) {
                f[a] = "day"
            })
        }
        e.info = x(a, {
            higherRanks: f,
            totalRange: j * k
        });
        return e
    };
    I.prototype.normalizeTimeTickInterval = function (a, b) {
        var c = b || [["millisecond", [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]], ["second",
[1, 2, 5, 10, 15, 30]], ["minute", [1, 2, 5, 10, 15, 30]], ["hour", [1, 2, 3, 4, 6, 8, 12]], ["day", [1, 2]], ["week", [1, 2]], ["month", [1, 2, 3, 4, 6]], ["year", null]],
            d = c[c.length - 1],
            e = H[d[0]],
            f = d[1],
            g;
        for (g = 0; g < c.length; g++)
            if (d = c[g], e = H[d[0]], f = d[1], c[g + 1] && a <= (e * f[f.length - 1] + H[c[g + 1][0]]) / 2) break;
        e === H.year && a < 5 * e && (f = [1, 2, 5]);
        c = wb(a / e, f, d[0] === "year" ? v(vb(a / e), 1) : 1);
        return {
            unitRange: e,
            count: c,
            unitName: d[0]
        }
    };
    I.prototype.getLogTickPositions = function (a, b, c, d) {
        var e = this.options,
            f = this.len,
            g = [];
        if (!d) this._minorAutoInterval =
            null;
        if (a >= 0.5) a = w(a), g = this.getLinearTickPositions(a, b, c);
        else if (a >= 0.08)
            for (var f = W(b), h, i, j, k, m, e = a > 0.3 ? [1, 2, 4] : a > 0.15 ? [1, 2, 4, 6, 8] : [1, 2, 3, 4, 5, 6, 7, 8, 9]; f < c + 1 && !m; f++) {
                i = e.length;
                for (h = 0; h < i && !m; h++) j = La(ta(f) * e[h]), j > b && (!d || k <= c) && k !== s && g.push(k), k > c && (m = !0), k = j
            } else if (b = ta(b), c = ta(c), a = e[d ? "minorTickInterval" : "tickInterval"], a = p(a === "auto" ? null : a, this._minorAutoInterval, (c - b) * (e.tickPixelInterval / (d ? 5 : 1)) / ((d ? f / this.tickPositions.length : f) || 1)), a = wb(a, null, vb(a)), g = Aa(this.getLinearTickPositions(a,
                    b, c), La), !d) this._minorAutoInterval = a / 5;
        if (!d) this.tickInterval = a;
        return g
    };
    var Kb = A.Tooltip = function () {
        this.init.apply(this, arguments)
    };
    Kb.prototype = {
        init: function (a, b) {
            var c = b.borderWidth,
                d = b.style,
                e = C(d.padding);
            this.chart = a;
            this.options = b;
            this.crosshairs = [];
            this.now = {
                x: 0,
                y: 0
            };
            this.isHidden = !0;
            this.label = a.renderer.label("", 0, 0, b.shape || "callout", null, null, b.useHTML, null, "tooltip").attr({
                padding: e,
                fill: b.backgroundColor,
                "stroke-width": c,
                r: b.borderRadius,
                zIndex: 8
            }).css(d).css({
                padding: 0
            }).add().attr({
                y: -9999
            });
            ma || this.label.shadow(b.shadow);
            this.shared = b.shared
        },
        destroy: function () {
            if (this.label) this.label = this.label.destroy();
            clearTimeout(this.hideTimer);
            clearTimeout(this.tooltipTimeout)
        },
        move: function (a, b, c, d) {
            var e = this,
                f = e.now,
                g = e.options.animation !== !1 && !e.isHidden && (Q(a - f.x) > 1 || Q(b - f.y) > 1),
                h = e.followPointer || e.len > 1;
            x(f, {
                x: g ? (2 * f.x + a) / 3 : a,
                y: g ? (f.y + b) / 2 : b,
                anchorX: h ? s : g ? (2 * f.anchorX + c) / 3 : c,
                anchorY: h ? s : g ? (f.anchorY + d) / 2 : d
            });
            e.label.attr(f);
            if (g) clearTimeout(this.tooltipTimeout), this.tooltipTimeout = setTimeout(function () {
                e &&
                    e.move(a, b, c, d)
            }, 32)
        },
        hide: function (a) {
            var b = this,
                c;
            clearTimeout(this.hideTimer);
            if (!this.isHidden) c = this.chart.hoverPoints, this.hideTimer = setTimeout(function () {
                b.label.fadeOut();
                b.isHidden = !0
            }, p(a, this.options.hideDelay, 500)), c && n(c, function (a) {
                a.setState()
            }), this.chart.hoverPoints = null, this.chart.hoverSeries = null
        },
        getAnchor: function (a, b) {
            var c, d = this.chart,
                e = d.inverted,
                f = d.plotTop,
                g = d.plotLeft,
                h = 0,
                i = 0,
                j, k, a = pa(a);
            c = a[0].tooltipPos;
            this.followPointer && b && (b.chartX === s && (b = d.pointer.normalize(b)),
                c = [b.chartX - d.plotLeft, b.chartY - f]);
            c || (n(a, function (a) {
                j = a.series.yAxis;
                k = a.series.xAxis;
                h += a.plotX + (!e && k ? k.left - g : 0);
                i += (a.plotLow ? (a.plotLow + a.plotHigh) / 2 : a.plotY) + (!e && j ? j.top - f : 0)
            }), h /= a.length, i /= a.length, c = [e ? d.plotWidth - i : h, this.shared && !e && a.length > 1 && b ? b.chartY - f : e ? d.plotHeight - h : i]);
            return Aa(c, w)
        },
        getPosition: function (a, b, c) {
            var d = this.chart,
                e = this.distance,
                f = {},
                g = c.h,
                h, i = ["y", d.chartHeight, b, c.plotY + d.plotTop],
                j = ["x", d.chartWidth, a, c.plotX + d.plotLeft],
                k = p(c.ttBelow, d.inverted && !c.negative ||
                    !d.inverted && c.negative),
                m = function (a, b, c, d) {
                    var h = c < d - e,
                        i = d + e + c < b,
                        j = d - e - c;
                    d += e;
                    if (k && i) f[a] = d;
                    else if (!k && h) f[a] = j;
                    else if (h) f[a] = j - g < 0 ? j : j - g;
                    else if (i) f[a] = d + g + c > b ? d : d + g;
                    else return !1
                },
                l = function (a, b, c, d) {
                    if (d < e || d > b - e) return !1;
                    else f[a] = d < c / 2 ? 1 : d > b - c / 2 ? b - c - 2 : d - c / 2
                },
                o = function (a) {
                    var b = i;
                    i = j;
                    j = b;
                    h = a
                },
                q = function () {
                    m.apply(0, i) !== !1 ? l.apply(0, j) === !1 && !h && (o(!0), q()) : h ? f.x = f.y = 0 : (o(!0), q())
                };
            (d.inverted || this.len > 1) && o();
            q();
            return f
        },
        defaultFormatter: function (a) {
            var b = this.points || pa(this),
                c;
            c = [a.tooltipFooterHeaderFormatter(b[0])];
            c = c.concat(a.bodyFormatter(b));
            c.push(a.tooltipFooterHeaderFormatter(b[0], !0));
            return c.join("")
        },
        refresh: function (a, b) {
            var c = this.chart,
                d = this.label,
                e = this.options,
                f, g, h = {},
                i, j = [];
            i = e.formatter || this.defaultFormatter;
            var h = c.hoverPoints,
                k, m = this.shared;
            clearTimeout(this.hideTimer);
            this.followPointer = pa(a)[0].series.tooltipOptions.followPointer;
            g = this.getAnchor(a, b);
            f = g[0];
            g = g[1];
            m && (!a.series || !a.series.noSharedTooltip) ? (c.hoverPoints = a, h && n(h, function (a) {
                a.setState()
            }), n(a, function (a) {
                a.setState("hover");
                j.push(a.getLabelConfig())
            }), h = {
                x: a[0].category,
                y: a[0].y
            }, h.points = j, this.len = j.length, a = a[0]) : h = a.getLabelConfig();
            i = i.call(h, this);
            h = a.series;
            this.distance = p(h.tooltipOptions.distance, 16);
            i === !1 ? this.hide() : (this.isHidden && (ab(d), d.attr("opacity", 1).show()), d.attr({
                text: i
            }), k = e.borderColor || a.color || h.color || "#606060", d.attr({
                stroke: k
            }), this.updatePosition({
                plotX: f,
                plotY: g,
                negative: a.negative,
                ttBelow: a.ttBelow,
                h: a.shapeArgs && a.shapeArgs.height || 0
            }), this.isHidden = !1);
            F(c, "tooltipRefresh", {
                text: i,
                x: f + c.plotLeft,
                y: g + c.plotTop,
                borderColor: k
            })
        },
        updatePosition: function (a) {
            var b = this.chart,
                c = this.label,
                c = (this.options.positioner || this.getPosition).call(this, c.width, c.height, a);
            this.move(w(c.x), w(c.y), a.plotX + b.plotLeft, a.plotY + b.plotTop)
        },
        getXDateFormat: function (a, b, c) {
            var d, b = b.dateTimeLabelFormats,
                e = c && c.closestPointRange,
                f, g = {
                    millisecond: 15,
                    second: 12,
                    minute: 9,
                    hour: 6,
                    day: 3
                },
                h, i;
            if (e) {
                h = ka("%m-%d %H:%M:%S.%L", a.x);
                for (f in H) {
                    if (e === H.week && +ka("%w", a.x) === c.options.startOfWeek && h.substr(6) ===
                        "00:00:00.000") {
                        f = "week";
                        break
                    } else if (H[f] > e) {
                        f = i;
                        break
                    } else if (g[f] && h.substr(g[f]) !== "01-01 00:00:00.000".substr(g[f])) break;
                    f !== "week" && (i = f)
                }
                f && (d = b[f])
            } else d = b.day;
            return d || b.year
        },
        tooltipFooterHeaderFormatter: function (a, b) {
            var c = b ? "footer" : "header",
                d = a.series,
                e = d.tooltipOptions,
                f = e.xDateFormat,
                g = d.xAxis,
                h = g && g.options.type === "datetime" && sa(a.key),
                c = e[c + "Format"];
            h && !f && (f = this.getXDateFormat(a, e, g));
            h && f && (c = c.replace("{point.key}", "{point.key:" + f + "}"));
            return Ma(c, {
                point: a,
                series: d
            })
        },
        bodyFormatter: function (a) {
            return Aa(a,
                function (a) {
                    var c = a.series.tooltipOptions;
                    return (c.pointFormatter || a.point.tooltipFormatter).call(a.point, c.pointFormat)
                })
        }
    };
    var xa;
    $a = D.documentElement.ontouchstart !== s;
    var Xa = A.Pointer = function (a, b) {
        this.init(a, b)
    };
    Xa.prototype = {
        init: function (a, b) {
            var c = b.chart,
                d = c.events,
                e = ma ? "" : c.zoomType,
                c = a.inverted,
                f;
            this.options = b;
            this.chart = a;
            this.zoomX = f = /x/.test(e);
            this.zoomY = e = /y/.test(e);
            this.zoomHor = f && !c || e && c;
            this.zoomVert = e && !c || f && c;
            this.hasZoom = f || e;
            this.runChartClick = d && !!d.click;
            this.pinchDown = [];
            this.lastValidTouch = {};
            if (A.Tooltip && b.tooltip.enabled) a.tooltip = new Kb(a, b.tooltip), this.followTouchMove = p(b.tooltip.followTouchMove, !0);
            this.setDOMEvents()
        },
        normalize: function (a, b) {
            var c, d, a = a || window.event,
                a = cc(a);
            if (!a.target) a.target = a.srcElement;
            d = a.touches ? a.touches.length ? a.touches.item(0) : a.changedTouches[0] : a;
            if (!b) this.chartPosition = b = bc(this.chart.container);
            d.pageX === s ? (c = v(a.x, a.clientX - b.left), d = a.y) : (c = d.pageX - b.left, d = d.pageY - b.top);
            return x(a, {
                chartX: w(c),
                chartY: w(d)
            })
        },
        getCoordinates: function (a) {
            var b = {
                xAxis: [],
                yAxis: []
            };
            n(this.chart.axes, function (c) {
                b[c.isXAxis ? "xAxis" : "yAxis"].push({
                    axis: c,
                    value: c.toValue(a[c.horiz ? "chartX" : "chartY"])
                })
            });
            return b
        },
        runPointActions: function (a) {
            var b = this.chart,
                c = b.series,
                d = b.tooltip,
                e = d ? d.shared : !1,
                f = b.hoverPoint,
                g = b.hoverSeries,
                h, i = b.chartWidth,
                j = b.chartWidth,
                k, m = [],
                l, o;
            if (!e && !g)
                for (h = 0; h < c.length; h++)
                    if (c[h].directTouch || !c[h].options.stickyTracking) c = [];
                    !e && g && g.directTouch && f ? l = f : (n(c, function (b) {
                k = b.noSharedTooltip && e;
                b.visible && !k && p(b.options.enableMouseTracking, !0) && (o = b.searchPoint(a)) && m.push(o)
            }), n(m, function (a) {
                if (a && r(a.plotX) && r(a.plotY) && (a.dist.distX < i || (a.dist.distX === i || a.series.kdDimensions > 1) && a.dist.distR < j)) i = a.dist.distX, j = a.dist.distR, l = a
            }));
            if (l && (l !== f || d && d.isHidden))
                if (e && !l.series.noSharedTooltip) {
                    for (h = m.length; h--;)(m[h].clientX !== l.clientX || m[h].series.noSharedTooltip) && m.splice(h, 1);
                    m.length && d && d.refresh(m, a);
                    n(m, function (b) {
                        if (b !== l) b.onMouseOver(a)
                    });
                    (g && g.directTouch && f || l).onMouseOver(a)
                } else d && d.refresh(l, a), l.onMouseOver(a);
            else c = g && g.tooltipOptions.followPointer, d && c && !d.isHidden && (c = d.getAnchor([{}], a), d.updatePosition({
                plotX: c[0],
                plotY: c[1]
            }));
            if (d && !this._onDocumentMouseMove) this._onDocumentMouseMove = function (a) {
                if (ca[xa]) ca[xa].pointer.onDocumentMouseMove(a)
            }, E(D, "mousemove", this._onDocumentMouseMove);
            n(b.axes, function (b) {
                b.drawCrosshair(a, p(l, f))
            })
        },
        reset: function (a, b) {
            var c = this.chart,
                d = c.hoverSeries,
                e = c.hoverPoint,
                f = c.tooltip,
                g = f && f.shared ? c.hoverPoints : e;
            (a = a && f && g) && pa(g)[0].plotX === s && (a = !1);
            if (a) f.refresh(g),
                e && (e.setState(e.state, !0), n(c.axes, function (b) {
                    p(b.options.crosshair && b.options.crosshair.snap, !0) ? b.drawCrosshair(null, a) : b.hideCrosshair()
                }));
            else {
                if (e) e.onMouseOut();
                if (d) d.onMouseOut();
                f && f.hide(b);
                if (this._onDocumentMouseMove) T(D, "mousemove", this._onDocumentMouseMove), this._onDocumentMouseMove = null;
                n(c.axes, function (a) {
                    a.hideCrosshair()
                });
                this.hoverX = null
            }
        },
        scaleGroups: function (a, b) {
            var c = this.chart,
                d;
            n(c.series, function (e) {
                d = a || e.getPlotBox();
                e.xAxis && e.xAxis.zoomEnabled && (e.group.attr(d),
                    e.markerGroup && (e.markerGroup.attr(d), e.markerGroup.clip(b ? c.clipRect : null)), e.dataLabelsGroup && e.dataLabelsGroup.attr(d))
            });
            c.clipRect.attr(b || c.clipBox)
        },
        dragStart: function (a) {
            var b = this.chart;
            b.mouseIsDown = a.type;
            b.cancelClick = !1;
            b.mouseDownX = this.mouseDownX = a.chartX;
            b.mouseDownY = this.mouseDownY = a.chartY
        },
        drag: function (a) {
            var b = this.chart,
                c = b.options.chart,
                d = a.chartX,
                e = a.chartY,
                f = this.zoomHor,
                g = this.zoomVert,
                h = b.plotLeft,
                i = b.plotTop,
                j = b.plotWidth,
                k = b.plotHeight,
                m, l = this.mouseDownX,
                o = this.mouseDownY,
                q = c.panKey && a[c.panKey + "Key"];
            d < h ? d = h : d > h + j && (d = h + j);
            e < i ? e = i : e > i + k && (e = i + k);
            this.hasDragged = Math.sqrt(Math.pow(l - d, 2) + Math.pow(o - e, 2));
            if (this.hasDragged > 10) {
                m = b.isInsidePlot(l - h, o - i);
                if (b.hasCartesianSeries && (this.zoomX || this.zoomY) && m && !q && !this.selectionMarker) this.selectionMarker = b.renderer.rect(h, i, f ? 1 : j, g ? 1 : k, 0).attr({
                    fill: c.selectionMarkerFill || "rgba(69,114,167,0.25)",
                    zIndex: 7
                }).add();
                this.selectionMarker && f && (d -= l, this.selectionMarker.attr({
                    width: Q(d),
                    x: (d > 0 ? 0 : d) + l
                }));
                this.selectionMarker &&
                    g && (d = e - o, this.selectionMarker.attr({
                        height: Q(d),
                        y: (d > 0 ? 0 : d) + o
                    }));
                m && !this.selectionMarker && c.panning && b.pan(a, c.panning)
            }
        },
        drop: function (a) {
            var b = this,
                c = this.chart,
                d = this.hasPinched;
            if (this.selectionMarker) {
                var e = {
                        xAxis: [],
                        yAxis: [],
                        originalEvent: a.originalEvent || a
                    },
                    f = this.selectionMarker,
                    g = f.attr ? f.attr("x") : f.x,
                    h = f.attr ? f.attr("y") : f.y,
                    i = f.attr ? f.attr("width") : f.width,
                    j = f.attr ? f.attr("height") : f.height,
                    k;
                if (this.hasDragged || d) n(c.axes, function (c) {
                    if (c.zoomEnabled && r(c.min) && (d || b[{
                            xAxis: "zoomX",
                            yAxis: "zoomY"
                        }[c.coll]])) {
                        var f = c.horiz,
                            o = a.type === "touchend" ? c.minPixelPadding : 0,
                            q = c.toValue((f ? g : h) + o),
                            f = c.toValue((f ? g + i : h + j) - o);
                        e[c.coll].push({
                            axis: c,
                            min: B(q, f),
                            max: v(q, f)
                        });
                        k = !0
                    }
                }), k && F(c, "selection", e, function (a) {
                    c.zoom(x(a, d ? {
                        animation: !1
                    } : null))
                });
                this.selectionMarker = this.selectionMarker.destroy();
                d && this.scaleGroups()
            }
            if (c) L(c.container, {
                cursor: c._cursor
            }), c.cancelClick = this.hasDragged > 10, c.mouseIsDown = this.hasDragged = this.hasPinched = !1, this.pinchDown = []
        },
        onContainerMouseDown: function (a) {
            a =
                this.normalize(a);
            a.preventDefault && a.preventDefault();
            this.dragStart(a)
        },
        onDocumentMouseUp: function (a) {
            ca[xa] && ca[xa].pointer.drop(a)
        },
        onDocumentMouseMove: function (a) {
            var b = this.chart,
                c = this.chartPosition,
                a = this.normalize(a, c);
            c && !this.inClass(a.target, "highcharts-tracker") && !b.isInsidePlot(a.chartX - b.plotLeft, a.chartY - b.plotTop) && this.reset()
        },
        onContainerMouseLeave: function () {
            var a = ca[xa];
            if (a) a.pointer.reset(), a.pointer.chartPosition = null
        },
        onContainerMouseMove: function (a) {
            var b = this.chart;
            xa = b.index;
            a = this.normalize(a);
            a.returnValue = !1;
            b.mouseIsDown === "mousedown" && this.drag(a);
            (this.inClass(a.target, "highcharts-tracker") || b.isInsidePlot(a.chartX - b.plotLeft, a.chartY - b.plotTop)) && !b.openMenu && this.runPointActions(a)
        },
        inClass: function (a, b) {
            for (var c; a;) {
                if (c = V(a, "class"))
                    if (c.indexOf(b) !== -1) return !0;
                    else if (c.indexOf("highcharts-container") !== -1) return !1;
                a = a.parentNode
            }
        },
        onTrackerMouseOut: function (a) {
            var b = this.chart.hoverSeries,
                c = (a = a.relatedTarget || a.toElement) && a.point && a.point.series;
            if (b &&
                !b.options.stickyTracking && !this.inClass(a, "highcharts-tooltip") && c !== b) b.onMouseOut()
        },
        onContainerClick: function (a) {
            var b = this.chart,
                c = b.hoverPoint,
                d = b.plotLeft,
                e = b.plotTop,
                a = this.normalize(a);
            a.originalEvent = a;
            a.cancelBubble = !0;
            b.cancelClick || (c && this.inClass(a.target, "highcharts-tracker") ? (F(c.series, "click", x(a, {
                point: c
            })), b.hoverPoint && c.firePointEvent("click", a)) : (x(a, this.getCoordinates(a)), b.isInsidePlot(a.chartX - d, a.chartY - e) && F(b, "click", a)))
        },
        setDOMEvents: function () {
            var a = this,
                b = a.chart.container;
            b.onmousedown = function (b) {
                a.onContainerMouseDown(b)
            };
            b.onmousemove = function (b) {
                a.onContainerMouseMove(b)
            };
            b.onclick = function (b) {
                a.onContainerClick(b)
            };
            E(b, "mouseleave", a.onContainerMouseLeave);
            gb === 1 && E(D, "mouseup", a.onDocumentMouseUp);
            if ($a) b.ontouchstart = function (b) {
                a.onContainerTouchStart(b)
            }, b.ontouchmove = function (b) {
                a.onContainerTouchMove(b)
            }, gb === 1 && E(D, "touchend", a.onDocumentTouchEnd)
        },
        destroy: function () {
            var a;
            T(this.chart.container, "mouseleave", this.onContainerMouseLeave);
            gb || (T(D, "mouseup",
                this.onDocumentMouseUp), T(D, "touchend", this.onDocumentTouchEnd));
            clearInterval(this.tooltipTimeout);
            for (a in this) this[a] = null
        }
    };
    x(A.Pointer.prototype, {
        pinchTranslate: function (a, b, c, d, e, f) {
            (this.zoomHor || this.pinchHor) && this.pinchTranslateDirection(!0, a, b, c, d, e, f);
            (this.zoomVert || this.pinchVert) && this.pinchTranslateDirection(!1, a, b, c, d, e, f)
        },
        pinchTranslateDirection: function (a, b, c, d, e, f, g, h) {
            var i = this.chart,
                j = a ? "x" : "y",
                k = a ? "X" : "Y",
                m = "chart" + k,
                l = a ? "width" : "height",
                o = i["plot" + (a ? "Left" : "Top")],
                q, t,
                p = h || 1,
                n = i.inverted,
                u = i.bounds[a ? "h" : "v"],
                M = b.length === 1,
                s = b[0][m],
                r = c[0][m],
                v = !M && b[1][m],
                w = !M && c[1][m],
                x, c = function () {
                    !M && Q(s - v) > 20 && (p = h || Q(r - w) / Q(s - v));
                    t = (o - r) / p + s;
                    q = i["plot" + (a ? "Width" : "Height")] / p
                };
            c();
            b = t;
            b < u.min ? (b = u.min, x = !0) : b + q > u.max && (b = u.max - q, x = !0);
            x ? (r -= 0.8 * (r - g[j][0]), M || (w -= 0.8 * (w - g[j][1])), c()) : g[j] = [r, w];
            n || (f[j] = t - o, f[l] = q);
            f = n ? 1 / p : p;
            e[l] = q;
            e[j] = b;
            d[n ? a ? "scaleY" : "scaleX" : "scale" + k] = p;
            d["translate" + k] = f * o + (r - f * s)
        },
        pinch: function (a) {
            var b = this,
                c = b.chart,
                d = b.pinchDown,
                e = a.touches,
                f = e.length,
                g = b.lastValidTouch,
                h = b.hasZoom,
                i = b.selectionMarker,
                j = {},
                k = f === 1 && (b.inClass(a.target, "highcharts-tracker") && c.runTrackerClick || b.runChartClick),
                m = {};
            h && !k && a.preventDefault();
            Aa(e, function (a) {
                return b.normalize(a)
            });
            if (a.type === "touchstart") n(e, function (a, b) {
                d[b] = {
                    chartX: a.chartX,
                    chartY: a.chartY
                }
            }), g.x = [d[0].chartX, d[1] && d[1].chartX], g.y = [d[0].chartY, d[1] && d[1].chartY], n(c.axes, function (a) {
                if (a.zoomEnabled) {
                    var b = c.bounds[a.horiz ? "h" : "v"],
                        d = a.minPixelPadding,
                        e = a.toPixels(p(a.options.min,
                            a.dataMin)),
                        f = a.toPixels(p(a.options.max, a.dataMax)),
                        g = B(e, f),
                        e = v(e, f);
                    b.min = B(a.pos, g - d);
                    b.max = v(a.pos + a.len, e + d)
                }
            }), b.res = !0;
            else if (d.length) {
                if (!i) b.selectionMarker = i = x({
                    destroy: ha
                }, c.plotBox);
                b.pinchTranslate(d, e, j, i, m, g);
                b.hasPinched = h;
                b.scaleGroups(j, m);
                if (!h && b.followTouchMove && f === 1) this.runPointActions(b.normalize(a));
                else if (b.res) b.res = !1, this.reset(!1, 0)
            }
        },
        onContainerTouchStart: function (a) {
            var b = this.chart;
            xa = b.index;
            a.touches.length === 1 ? (a = this.normalize(a), b.isInsidePlot(a.chartX - b.plotLeft,
                a.chartY - b.plotTop) && !b.openMenu ? (this.runPointActions(a), this.pinch(a)) : this.reset()) : a.touches.length === 2 && this.pinch(a)
        },
        onContainerTouchMove: function (a) {
            (a.touches.length === 1 || a.touches.length === 2) && this.pinch(a)
        },
        onDocumentTouchEnd: function (a) {
            ca[xa] && ca[xa].pointer.drop(a)
        }
    });
    if (S.PointerEvent || S.MSPointerEvent) {
        var Ba = {},
            Lb = !!S.PointerEvent,
            gc = function () {
                var a, b = [];
                b.item = function (a) {
                    return this[a]
                };
                for (a in Ba) Ba.hasOwnProperty(a) && b.push({
                    pageX: Ba[a].pageX,
                    pageY: Ba[a].pageY,
                    target: Ba[a].target
                });
                return b
            },
            Mb = function (a, b, c, d) {
                a = a.originalEvent || a;
                if ((a.pointerType === "touch" || a.pointerType === a.MSPOINTER_TYPE_TOUCH) && ca[xa]) d(a), d = ca[xa].pointer, d[b]({
                    type: c,
                    target: a.currentTarget,
                    preventDefault: ha,
                    touches: gc()
                })
            };
        x(Xa.prototype, {
            onContainerPointerDown: function (a) {
                Mb(a, "onContainerTouchStart", "touchstart", function (a) {
                    Ba[a.pointerId] = {
                        pageX: a.pageX,
                        pageY: a.pageY,
                        target: a.currentTarget
                    }
                })
            },
            onContainerPointerMove: function (a) {
                Mb(a, "onContainerTouchMove", "touchmove", function (a) {
                    Ba[a.pointerId] = {
                        pageX: a.pageX,
                        pageY: a.pageY
                    };
                    if (!Ba[a.pointerId].target) Ba[a.pointerId].target = a.currentTarget
                })
            },
            onDocumentPointerUp: function (a) {
                Mb(a, "onDocumentTouchEnd", "touchend", function (a) {
                    delete Ba[a.pointerId]
                })
            },
            batchMSEvents: function (a) {
                a(this.chart.container, Lb ? "pointerdown" : "MSPointerDown", this.onContainerPointerDown);
                a(this.chart.container, Lb ? "pointermove" : "MSPointerMove", this.onContainerPointerMove);
                a(D, Lb ? "pointerup" : "MSPointerUp", this.onDocumentPointerUp)
            }
        });
        R(Xa.prototype, "init", function (a, b, c) {
            a.call(this,
                b, c);
            this.hasZoom && L(b.container, {
                "-ms-touch-action": Z,
                "touch-action": Z
            })
        });
        R(Xa.prototype, "setDOMEvents", function (a) {
            a.apply(this);
            (this.hasZoom || this.followTouchMove) && this.batchMSEvents(E)
        });
        R(Xa.prototype, "destroy", function (a) {
            this.batchMSEvents(T);
            a.call(this)
        })
    }
    var rb = A.Legend = function (a, b) {
        this.init(a, b)
    };
    rb.prototype = {
        init: function (a, b) {
            var c = this,
                d = b.itemStyle,
                e = b.itemMarginTop || 0;
            this.options = b;
            if (b.enabled) c.itemStyle = d, c.itemHiddenStyle = y(d, b.itemHiddenStyle), c.itemMarginTop = e, c.padding =
                d = p(b.padding, 8), c.initialItemX = d, c.initialItemY = d - 5, c.maxItemWidth = 0, c.chart = a, c.itemHeight = 0, c.symbolWidth = p(b.symbolWidth, 16), c.pages = [], c.render(), E(c.chart, "endResize", function () {
                    c.positionCheckboxes()
                })
        },
        colorizeItem: function (a, b) {
            var c = this.options,
                d = a.legendItem,
                e = a.legendLine,
                f = a.legendSymbol,
                g = this.itemHiddenStyle.color,
                c = b ? c.itemStyle.color : g,
                h = b ? a.legendColor || a.color || "#CCC" : g,
                g = a.options && a.options.marker,
                i = {
                    fill: h
                },
                j;
            d && d.css({
                fill: c,
                color: c
            });
            e && e.attr({
                stroke: h
            });
            if (f) {
                if (g && f.isMarker)
                    for (j in i.stroke =
                        h, g = a.convertAttribs(g), g) d = g[j], d !== s && (i[j] = d);
                f.attr(i)
            }
        },
        positionItem: function (a) {
            var b = this.options,
                c = b.symbolPadding,
                b = !b.rtl,
                d = a._legendItemPos,
                e = d[0],
                d = d[1],
                f = a.checkbox;
            a.legendGroup && a.legendGroup.translate(b ? e : this.legendWidth - e - 2 * c - 4, d);
            if (f) f.x = e, f.y = d
        },
        destroyItem: function (a) {
            var b = a.checkbox;
            n(["legendItem", "legendLine", "legendSymbol", "legendGroup"], function (b) {
                a[b] && (a[b] = a[b].destroy())
            });
            b && Ta(a.checkbox)
        },
        clearItems: function () {
            var a = this;
            n(a.getAllItems(), function (b) {
                a.destroyItem(b)
            })
        },
        destroy: function () {
            var a = this.group,
                b = this.box;
            if (b) this.box = b.destroy();
            if (a) this.group = a.destroy()
        },
        positionCheckboxes: function (a) {
            var b = this.group.alignAttr,
                c, d = this.clipHeight || this.legendHeight;
            if (b) c = b.translateY, n(this.allItems, function (e) {
                var f = e.checkbox,
                    g;
                f && (g = c + f.y + (a || 0) + 3, L(f, {
                    left: b.translateX + e.checkboxOffset + f.x - 20 + "px",
                    top: g + "px",
                    display: g > c - 6 && g < c + d - 6 ? "" : Z
                }))
            })
        },
        renderTitle: function () {
            var a = this.padding,
                b = this.options.title,
                c = 0;
            if (b.text) {
                if (!this.title) this.title = this.chart.renderer.label(b.text,
                    a - 3, a - 4, null, null, null, null, null, "legend-title").attr({
                    zIndex: 1
                }).css(b.style).add(this.group);
                a = this.title.getBBox();
                c = a.height;
                this.offsetWidth = a.width;
                this.contentGroup.attr({
                    translateY: c
                })
            }
            this.titleHeight = c
        },
        renderItem: function (a) {
            var b = this.chart,
                c = b.renderer,
                d = this.options,
                e = d.layout === "horizontal",
                f = this.symbolWidth,
                g = d.symbolPadding,
                h = this.itemStyle,
                i = this.itemHiddenStyle,
                j = this.padding,
                k = e ? p(d.itemDistance, 20) : 0,
                m = !d.rtl,
                l = d.width,
                o = d.itemMarginBottom || 0,
                q = this.itemMarginTop,
                t = this.initialItemX,
                n = a.legendItem,
                z = a.series && a.series.drawLegendSymbol ? a.series : a,
                u = z.options,
                u = this.createCheckboxForItem && u && u.showCheckbox,
                M = d.useHTML;
            if (!n) {
                a.legendGroup = c.g("legend-item").attr({
                    zIndex: 1
                }).add(this.scrollGroup);
                a.legendItem = n = c.text(d.labelFormat ? Ma(d.labelFormat, a) : d.labelFormatter.call(a), m ? f + g : -g, this.baseline || 0, M).css(y(a.visible ? h : i)).attr({
                    align: m ? "left" : "right",
                    zIndex: 2
                }).add(a.legendGroup);
                if (!this.baseline) this.fontMetrics = c.fontMetrics(h.fontSize, n), this.baseline = this.fontMetrics.f +
                    3 + q, n.attr("y", this.baseline);
                z.drawLegendSymbol(this, a);
                this.setItemEvents && this.setItemEvents(a, n, M, h, i);
                this.colorizeItem(a, a.visible);
                u && this.createCheckboxForItem(a)
            }
            c = n.getBBox();
            f = a.checkboxOffset = d.itemWidth || a.legendItemWidth || f + g + c.width + k + (u ? 20 : 0);
            this.itemHeight = g = w(a.legendItemHeight || c.height);
            if (e && this.itemX - t + f > (l || b.chartWidth - 2 * j - t - d.x)) this.itemX = t, this.itemY += q + this.lastLineHeight + o, this.lastLineHeight = 0;
            this.maxItemWidth = v(this.maxItemWidth, f);
            this.lastItemY = q + this.itemY + o;
            this.lastLineHeight =
                v(g, this.lastLineHeight);
            a._legendItemPos = [this.itemX, this.itemY];
            e ? this.itemX += f : (this.itemY += q + g + o, this.lastLineHeight = g);
            this.offsetWidth = l || v((e ? this.itemX - t - k : f) + j, this.offsetWidth)
        },
        getAllItems: function () {
            var a = [];
            n(this.chart.series, function (b) {
                var c = b.options;
                if (p(c.showInLegend, !r(c.linkedTo) ? s : !1, !0)) a = a.concat(b.legendItems || (c.legendType === "point" ? b.data : b))
            });
            return a
        },
        adjustMargins: function (a, b) {
            var c = this.chart,
                d = this.options,
                e = d.align[0] + d.verticalAlign[0] + d.layout[0];
            this.display &&
                !d.floating && n([/(lth|ct|rth)/, /(rtv|rm|rbv)/, /(rbh|cb|lbh)/, /(lbv|lm|ltv)/], function (f, g) {
                    f.test(e) && !r(a[g]) && (c[ob[g]] = v(c[ob[g]], c.legend[(g + 1) % 2 ? "legendHeight" : "legendWidth"] + [1, -1, -1, 1][g] * d[g % 2 ? "x" : "y"] + p(d.margin, 12) + b[g]))
                })
        },
        render: function () {
            var a = this,
                b = a.chart,
                c = b.renderer,
                d = a.group,
                e, f, g, h, i = a.box,
                j = a.options,
                k = a.padding,
                m = j.borderWidth,
                l = j.backgroundColor;
            a.itemX = a.initialItemX;
            a.itemY = a.initialItemY;
            a.offsetWidth = 0;
            a.lastItemY = 0;
            if (!d) a.group = d = c.g("legend").attr({
                    zIndex: 7
                }).add(),
                a.contentGroup = c.g().attr({
                    zIndex: 1
                }).add(d), a.scrollGroup = c.g().add(a.contentGroup);
            a.renderTitle();
            e = a.getAllItems();
            xb(e, function (a, b) {
                return (a.options && a.options.legendIndex || 0) - (b.options && b.options.legendIndex || 0)
            });
            j.reversed && e.reverse();
            a.allItems = e;
            a.display = f = !!e.length;
            a.lastLineHeight = 0;
            n(e, function (b) {
                a.renderItem(b)
            });
            g = (j.width || a.offsetWidth) + k;
            h = a.lastItemY + a.lastLineHeight + a.titleHeight;
            h = a.handleOverflow(h);
            h += k;
            if (m || l) {
                if (i) {
                    if (g > 0 && h > 0) i[i.isNew ? "attr" : "animate"](i.crisp({
                        width: g,
                        height: h
                    })), i.isNew = !1
                } else a.box = i = c.rect(0, 0, g, h, j.borderRadius, m || 0).attr({
                    stroke: j.borderColor,
                    "stroke-width": m || 0,
                    fill: l || Z
                }).add(d).shadow(j.shadow), i.isNew = !0;
                i[f ? "show" : "hide"]()
            }
            a.legendWidth = g;
            a.legendHeight = h;
            n(e, function (b) {
                a.positionItem(b)
            });
            f && d.align(x({
                width: g,
                height: h
            }, j), !0, "spacingBox");
            b.isResizing || this.positionCheckboxes()
        },
        handleOverflow: function (a) {
            var b = this,
                c = this.chart,
                d = c.renderer,
                e = this.options,
                f = e.y,
                f = c.spacingBox.height + (e.verticalAlign === "top" ? -f : f) - this.padding,
                g =
                e.maxHeight,
                h, i = this.clipRect,
                j = e.navigation,
                k = p(j.animation, !0),
                m = j.arrowSize || 12,
                l = this.nav,
                o = this.pages,
                q, t = this.allItems;
            e.layout === "horizontal" && (f /= 2);
            g && (f = B(f, g));
            o.length = 0;
            if (a > f && !e.useHTML) {
                this.clipHeight = h = v(f - 20 - this.titleHeight - this.padding, 0);
                this.currentPage = p(this.currentPage, 1);
                this.fullHeight = a;
                n(t, function (a, b) {
                    var c = a._legendItemPos[1],
                        d = w(a.legendItem.getBBox().height),
                        e = o.length;
                    if (!e || c - o[e - 1] > h && (q || c) !== o[e - 1]) o.push(q || c), e++;
                    b === t.length - 1 && c + d - o[e - 1] > h && o.push(c);
                    c !==
                        q && (q = c)
                });
                if (!i) i = b.clipRect = d.clipRect(0, this.padding, 9999, 0), b.contentGroup.clip(i);
                i.attr({
                    height: h
                });
                if (!l) this.nav = l = d.g().attr({
                    zIndex: 1
                }).add(this.group), this.up = d.symbol("triangle", 0, 0, m, m).on("click", function () {
                    b.scroll(-1, k)
                }).add(l), this.pager = d.text("", 15, 10).css(j.style).add(l), this.down = d.symbol("triangle-down", 0, 0, m, m).on("click", function () {
                    b.scroll(1, k)
                }).add(l);
                b.scroll(0);
                a = f
            } else if (l) i.attr({
                    height: c.chartHeight
                }), l.hide(), this.scrollGroup.attr({
                    translateY: 1
                }), this.clipHeight =
                0;
            return a
        },
        scroll: function (a, b) {
            var c = this.pages,
                d = c.length,
                e = this.currentPage + a,
                f = this.clipHeight,
                g = this.options.navigation,
                h = g.activeColor,
                g = g.inactiveColor,
                i = this.pager,
                j = this.padding;
            e > d && (e = d);
            if (e > 0) b !== s && Ya(b, this.chart), this.nav.attr({
                translateX: j,
                translateY: f + this.padding + 7 + this.titleHeight,
                visibility: "visible"
            }), this.up.attr({
                fill: e === 1 ? g : h
            }).css({
                cursor: e === 1 ? "default" : "pointer"
            }), i.attr({
                text: e + "/" + d
            }), this.down.attr({
                x: 18 + this.pager.getBBox().width,
                fill: e === d ? g : h
            }).css({
                cursor: e ===
                    d ? "default" : "pointer"
            }), c = -c[e - 1] + this.initialItemY, this.scrollGroup.animate({
                translateY: c
            }), this.currentPage = e, this.positionCheckboxes(c)
        }
    };
    G = A.LegendSymbolMixin = {
        drawRectangle: function (a, b) {
            var c = a.options.symbolHeight || a.fontMetrics.f;
            b.legendSymbol = this.chart.renderer.rect(0, a.baseline - c + 1, a.symbolWidth, c, a.options.symbolRadius || 0).attr({
                zIndex: 3
            }).add(b.legendGroup)
        },
        drawLineMarker: function (a) {
            var b = this.options,
                c = b.marker,
                d;
            d = a.symbolWidth;
            var e = this.chart.renderer,
                f = this.legendGroup,
                a = a.baseline -
                w(a.fontMetrics.b * 0.3),
                g;
            if (b.lineWidth) {
                g = {
                    "stroke-width": b.lineWidth
                };
                if (b.dashStyle) g.dashstyle = b.dashStyle;
                this.legendLine = e.path(["M", 0, a, "L", d, a]).attr(g).add(f)
            }
            if (c && c.enabled !== !1) b = c.radius, this.legendSymbol = d = e.symbol(this.symbol, d / 2 - b, a - b, 2 * b, 2 * b).add(f), d.isMarker = !0
        }
    };
    (/Trident\/7\.0/.test(Ha) || Va) && R(rb.prototype, "positionItem", function (a, b) {
        var c = this,
            d = function () {
                b._legendItemPos && a.call(c, b)
            };
        d();
        setTimeout(d)
    });
    var Pa = A.Chart = function () {
        this.init.apply(this, arguments)
    };
    Pa.prototype = {
        callbacks: [],
        init: function (a, b) {
            var c, d = a.series;
            a.series = null;
            c = y(P, a);
            c.series = a.series = d;
            this.userOptions = a;
            d = c.chart;
            this.margin = this.splashArray("margin", d);
            this.spacing = this.splashArray("spacing", d);
            var e = d.events;
            this.bounds = {
                h: {},
                v: {}
            };
            this.callback = b;
            this.isResizing = 0;
            this.options = c;
            this.axes = [];
            this.series = [];
            this.hasCartesianSeries = d.showAxes;
            var f = this,
                g;
            f.index = ca.length;
            ca.push(f);
            gb++;
            d.reflow !== !1 && E(f, "load", function () {
                f.initReflow()
            });
            if (e)
                for (g in e) E(f, g, e[g]);
            f.xAxis = [];
            f.yAxis = [];
            f.animation = ma ? !1 : p(d.animation, !0);
            f.pointCount = f.colorCounter = f.symbolCounter = 0;
            f.firstRender()
        },
        initSeries: function (a) {
            var b = this.options.chart;
            (b = K[a.type || b.type || b.defaultSeriesType]) || qa(17, !0);
            b = new b;
            b.init(this, a);
            return b
        },
        isInsidePlot: function (a, b, c) {
            var d = c ? b : a,
                a = c ? a : b;
            return d >= 0 && d <= this.plotWidth && a >= 0 && a <= this.plotHeight
        },
        redraw: function (a) {
            var b = this.axes,
                c = this.series,
                d = this.pointer,
                e = this.legend,
                f = this.isDirtyLegend,
                g, h, i = this.hasCartesianSeries,
                j = this.isDirtyBox,
                k = c.length,
                m = k,
                l = this.renderer,
                o = l.isHidden(),
                q = [];
            Ya(a, this);
            o && this.cloneRenderTo();
            for (this.layOutTitles(); m--;)
                if (a = c[m], a.options.stacking && (g = !0, a.isDirty)) {
                    h = !0;
                    break
                }
            if (h)
                for (m = k; m--;)
                    if (a = c[m], a.options.stacking) a.isDirty = !0;
            n(c, function (a) {
                a.isDirty && a.options.legendType === "point" && (f = !0)
            });
            if (f && e.options.enabled) e.render(), this.isDirtyLegend = !1;
            g && this.getStacks();
            if (i && !this.isResizing) this.maxTicks = null, n(b, function (a) {
                a.setScale()
            });
            this.getMargins();
            i && (n(b, function (a) {
                a.isDirty && (j = !0)
            }), n(b,
                function (a) {
                    if (a.isDirtyExtremes) a.isDirtyExtremes = !1, q.push(function () {
                        F(a, "afterSetExtremes", x(a.eventArgs, a.getExtremes()));
                        delete a.eventArgs
                    });
                    (j || g) && a.redraw()
                }));
            j && this.drawChartBox();
            n(c, function (a) {
                a.isDirty && a.visible && (!a.isCartesian || a.xAxis) && a.redraw()
            });
            d && d.reset(!0);
            l.draw();
            F(this, "redraw");
            o && this.cloneRenderTo(!0);
            n(q, function (a) {
                a.call()
            })
        },
        get: function (a) {
            var b = this.axes,
                c = this.series,
                d, e;
            for (d = 0; d < b.length; d++)
                if (b[d].options.id === a) return b[d];
            for (d = 0; d < c.length; d++)
                if (c[d].options.id ===
                    a) return c[d];
            for (d = 0; d < c.length; d++) {
                e = c[d].points || [];
                for (b = 0; b < e.length; b++)
                    if (e[b].id === a) return e[b]
            }
            return null
        },
        getAxes: function () {
            var a = this,
                b = this.options,
                c = b.xAxis = pa(b.xAxis || {}),
                b = b.yAxis = pa(b.yAxis || {});
            n(c, function (a, b) {
                a.index = b;
                a.isX = !0
            });
            n(b, function (a, b) {
                a.index = b
            });
            c = c.concat(b);
            n(c, function (b) {
                new I(a, b)
            })
        },
        getSelectedPoints: function () {
            var a = [];
            n(this.series, function (b) {
                a = a.concat(hb(b.points || [], function (a) {
                    return a.selected
                }))
            });
            return a
        },
        getSelectedSeries: function () {
            return hb(this.series,
                function (a) {
                    return a.selected
                })
        },
        getStacks: function () {
            var a = this;
            n(a.yAxis, function (a) {
                if (a.stacks && a.hasVisibleSeries) a.oldStacks = a.stacks
            });
            n(a.series, function (b) {
                if (b.options.stacking && (b.visible === !0 || a.options.chart.ignoreHiddenSeries === !1)) b.stackKey = b.type + p(b.options.stack, "")
            })
        },
        setTitle: function (a, b, c) {
            var g;
            var d = this,
                e = d.options,
                f;
            f = e.title = y(e.title, a);
            g = e.subtitle = y(e.subtitle, b), e = g;
            n([["title", a, f], ["subtitle", b, e]], function (a) {
                var b = a[0],
                    c = d[b],
                    e = a[1],
                    a = a[2];
                c && e && (d[b] = c = c.destroy());
                a && a.text && !c && (d[b] = d.renderer.text(a.text, 0, 0, a.useHTML).attr({
                    align: a.align,
                    "class": "highcharts-" + b,
                    zIndex: a.zIndex || 4
                }).css(a.style).add())
            });
            d.layOutTitles(c)
        },
        layOutTitles: function (a) {
            var b = 0,
                c = this.title,
                d = this.subtitle,
                e = this.options,
                f = e.title,
                e = e.subtitle,
                g = this.renderer,
                h = this.spacingBox.width - 44;
            if (c && (c.css({
                    width: (f.width || h) + "px"
                }).align(x({
                    y: g.fontMetrics(f.style.fontSize, c).b - 3
                }, f), !1, "spacingBox"), !f.floating && !f.verticalAlign)) b = c.getBBox().height;
            d && (d.css({
                width: (e.width || h) + "px"
            }).align(x({
                y: b +
                    (f.margin - 13) + g.fontMetrics(f.style.fontSize, d).b
            }, e), !1, "spacingBox"), !e.floating && !e.verticalAlign && (b = za(b + d.getBBox().height)));
            c = this.titleOffset !== b;
            this.titleOffset = b;
            if (!this.isDirtyBox && c) this.isDirtyBox = c, this.hasRendered && p(a, !0) && this.isDirtyBox && this.redraw()
        },
        getChartSize: function () {
            var a = this.options.chart,
                b = a.width,
                a = a.height,
                c = this.renderToClone || this.renderTo;
            if (!r(b)) this.containerWidth = pb(c, "width");
            if (!r(a)) this.containerHeight = pb(c, "height");
            this.chartWidth = v(0, b || this.containerWidth ||
                600);
            this.chartHeight = v(0, p(a, this.containerHeight > 19 ? this.containerHeight : 400))
        },
        cloneRenderTo: function (a) {
            var b = this.renderToClone,
                c = this.container;
            a ? b && (this.renderTo.appendChild(c), Ta(b), delete this.renderToClone) : (c && c.parentNode === this.renderTo && this.renderTo.removeChild(c), this.renderToClone = b = this.renderTo.cloneNode(0), L(b, {
                position: "absolute",
                top: "-9999px",
                display: "block"
            }), b.style.setProperty && b.style.setProperty("display", "block", "important"), D.body.appendChild(b), c && b.appendChild(c))
        },
        getContainer: function () {
            var a, b = this.options.chart,
                c, d, e;
            this.renderTo = a = b.renderTo;
            e = "highcharts-" + Hb++;
            if (Ja(a)) this.renderTo = a = D.getElementById(a);
            a || qa(13, !0);
            c = C(V(a, "data-highcharts-chart"));
            !isNaN(c) && ca[c] && ca[c].hasRendered && ca[c].destroy();
            V(a, "data-highcharts-chart", this.index);
            a.innerHTML = "";
            !b.skipClone && !a.offsetWidth && this.cloneRenderTo();
            this.getChartSize();
            c = this.chartWidth;
            d = this.chartHeight;
            this.container = a = aa(Ua, {
                className: "highcharts-container" + (b.className ? " " + b.className : ""),
                id: e
            }, x({
                position: "relative",
                overflow: "hidden",
                width: c + "px",
                height: d + "px",
                textAlign: "left",
                lineHeight: "normal",
                zIndex: 0,
                "-webkit-tap-highlight-color": "rgba(0,0,0,0)"
            }, b.style), this.renderToClone || a);
            this._cursor = a.style.cursor;
            this.renderer = b.forExport ? new na(a, c, d, b.style, !0) : new Wa(a, c, d, b.style);
            ma && this.renderer.create(this, a, c, d);
            this.renderer.chartIndex = this.index
        },
        getMargins: function (a) {
            var b = this.spacing,
                c = this.margin,
                d = this.titleOffset;
            this.resetMargins();
            if (d && !r(c[0])) this.plotTop = v(this.plotTop,
                d + this.options.title.margin + b[0]);
            this.legend.adjustMargins(c, b);
            this.extraBottomMargin && (this.marginBottom += this.extraBottomMargin);
            this.extraTopMargin && (this.plotTop += this.extraTopMargin);
            a || this.getAxisMargins()
        },
        getAxisMargins: function () {
            var a = this,
                b = a.axisOffset = [0, 0, 0, 0],
                c = a.margin;
            a.hasCartesianSeries && n(a.axes, function (a) {
                a.getOffset()
            });
            n(ob, function (d, e) {
                r(c[e]) || (a[d] += b[e])
            });
            a.setChartSize()
        },
        reflow: function (a) {
            var b = this,
                c = b.options.chart,
                d = b.renderTo,
                e = c.width || pb(d, "width"),
                f = c.height ||
                pb(d, "height"),
                c = a ? a.target : S,
                d = function () {
                    if (b.container) b.setSize(e, f, !1), b.hasUserSize = null
                };
            if (!b.hasUserSize && !b.isPrinting && e && f && (c === S || c === D)) {
                if (e !== b.containerWidth || f !== b.containerHeight) clearTimeout(b.reflowTimeout), a ? b.reflowTimeout = setTimeout(d, 100) : d();
                b.containerWidth = e;
                b.containerHeight = f
            }
        },
        initReflow: function () {
            var a = this,
                b = function (b) {
                    a.reflow(b)
                };
            E(S, "resize", b);
            E(a, "destroy", function () {
                T(S, "resize", b)
            })
        },
        setSize: function (a, b, c) {
            var d = this,
                e, f, g;
            d.isResizing += 1;
            g = function () {
                d &&
                    F(d, "endResize", null, function () {
                        d.isResizing -= 1
                    })
            };
            Ya(c, d);
            d.oldChartHeight = d.chartHeight;
            d.oldChartWidth = d.chartWidth;
            if (r(a)) d.chartWidth = e = v(0, w(a)), d.hasUserSize = !!e;
            if (r(b)) d.chartHeight = f = v(0, w(b));
            (Ga ? qb : L)(d.container, {
                width: e + "px",
                height: f + "px"
            }, Ga);
            d.setChartSize(!0);
            d.renderer.setSize(e, f, c);
            d.maxTicks = null;
            n(d.axes, function (a) {
                a.isDirty = !0;
                a.setScale()
            });
            n(d.series, function (a) {
                a.isDirty = !0
            });
            d.isDirtyLegend = !0;
            d.isDirtyBox = !0;
            d.layOutTitles();
            d.getMargins();
            d.redraw(c);
            d.oldChartHeight =
                null;
            F(d, "resize");
            Ga === !1 ? g() : setTimeout(g, Ga && Ga.duration || 500)
        },
        setChartSize: function (a) {
            var b = this.inverted,
                c = this.renderer,
                d = this.chartWidth,
                e = this.chartHeight,
                f = this.options.chart,
                g = this.spacing,
                h = this.clipOffset,
                i, j, k, m;
            this.plotLeft = i = w(this.plotLeft);
            this.plotTop = j = w(this.plotTop);
            this.plotWidth = k = v(0, w(d - i - this.marginRight));
            this.plotHeight = m = v(0, w(e - j - this.marginBottom));
            this.plotSizeX = b ? m : k;
            this.plotSizeY = b ? k : m;
            this.plotBorderWidth = f.plotBorderWidth || 0;
            this.spacingBox = c.spacingBox = {
                x: g[3],
                y: g[0],
                width: d - g[3] - g[1],
                height: e - g[0] - g[2]
            };
            this.plotBox = c.plotBox = {
                x: i,
                y: j,
                width: k,
                height: m
            };
            d = 2 * W(this.plotBorderWidth / 2);
            b = za(v(d, h[3]) / 2);
            c = za(v(d, h[0]) / 2);
            this.clipBox = {
                x: b,
                y: c,
                width: W(this.plotSizeX - v(d, h[1]) / 2 - b),
                height: v(0, W(this.plotSizeY - v(d, h[2]) / 2 - c))
            };
            a || n(this.axes, function (a) {
                a.setAxisSize();
                a.setAxisTranslation()
            })
        },
        resetMargins: function () {
            var a = this;
            n(ob, function (b, c) {
                a[b] = p(a.margin[c], a.spacing[c])
            });
            a.axisOffset = [0, 0, 0, 0];
            a.clipOffset = [0, 0, 0, 0]
        },
        drawChartBox: function () {
            var a =
                this.options.chart,
                b = this.renderer,
                c = this.chartWidth,
                d = this.chartHeight,
                e = this.chartBackground,
                f = this.plotBackground,
                g = this.plotBorder,
                h = this.plotBGImage,
                i = a.borderWidth || 0,
                j = a.backgroundColor,
                k = a.plotBackgroundColor,
                m = a.plotBackgroundImage,
                l = a.plotBorderWidth || 0,
                o, q = this.plotLeft,
                t = this.plotTop,
                p = this.plotWidth,
                n = this.plotHeight,
                u = this.plotBox,
                s = this.clipRect,
                r = this.clipBox;
            o = i + (a.shadow ? 8 : 0);
            if (i || j)
                if (e) e.animate(e.crisp({
                    width: c - o,
                    height: d - o
                }));
                else {
                    e = {
                        fill: j || Z
                    };
                    if (i) e.stroke = a.borderColor, e["stroke-width"] =
                        i;
                    this.chartBackground = b.rect(o / 2, o / 2, c - o, d - o, a.borderRadius, i).attr(e).addClass("highcharts-background").add().shadow(a.shadow)
                }
            if (k) f ? f.animate(u) : this.plotBackground = b.rect(q, t, p, n, 0).attr({
                fill: k
            }).add().shadow(a.plotShadow);
            if (m) h ? h.animate(u) : this.plotBGImage = b.image(m, q, t, p, n).add();
            s ? s.animate({
                width: r.width,
                height: r.height
            }) : this.clipRect = b.clipRect(r);
            if (l) g ? g.animate(g.crisp({
                x: q,
                y: t,
                width: p,
                height: n,
                strokeWidth: -l
            })) : this.plotBorder = b.rect(q, t, p, n, 0, -l).attr({
                stroke: a.plotBorderColor,
                "stroke-width": l,
                fill: Z,
                zIndex: 1
            }).add();
            this.isDirtyBox = !1
        },
        propFromSeries: function () {
            var a = this,
                b = a.options.chart,
                c, d = a.options.series,
                e, f;
            n(["inverted", "angular", "polar"], function (g) {
                c = K[b.type || b.defaultSeriesType];
                f = a[g] || b[g] || c && c.prototype[g];
                for (e = d && d.length; !f && e--;)(c = K[d[e].type]) && c.prototype[g] && (f = !0);
                a[g] = f
            })
        },
        linkSeries: function () {
            var a = this,
                b = a.series;
            n(b, function (a) {
                a.linkedSeries.length = 0
            });
            n(b, function (b) {
                var d = b.options.linkedTo;
                if (Ja(d) && (d = d === ":previous" ? a.series[b.index -
                        1] : a.get(d))) d.linkedSeries.push(b), b.linkedParent = d
            })
        },
        renderSeries: function () {
            n(this.series, function (a) {
                a.translate();
                a.render()
            })
        },
        renderLabels: function () {
            var a = this,
                b = a.options.labels;
            b.items && n(b.items, function (c) {
                var d = x(b.style, c.style),
                    e = C(d.left) + a.plotLeft,
                    f = C(d.top) + a.plotTop + 12;
                delete d.left;
                delete d.top;
                a.renderer.text(c.html, e, f).attr({
                    zIndex: 2
                }).css(d).add()
            })
        },
        render: function () {
            var a = this.axes,
                b = this.renderer,
                c = this.options,
                d, e, f, g;
            this.setTitle();
            this.legend = new rb(this, c.legend);
            this.getStacks();
            this.getMargins(!0);
            this.setChartSize();
            d = this.plotWidth;
            e = this.plotHeight -= 13;
            n(a, function (a) {
                a.setScale()
            });
            this.getAxisMargins();
            f = d / this.plotWidth > 1.1;
            g = e / this.plotHeight > 1.1;
            if (f || g) this.maxTicks = null, n(a, function (a) {
                (a.horiz && f || !a.horiz && g) && a.setTickInterval(!0)
            }), this.getMargins();
            this.drawChartBox();
            this.hasCartesianSeries && n(a, function (a) {
                a.render()
            });
            if (!this.seriesGroup) this.seriesGroup = b.g("series-group").attr({
                zIndex: 3
            }).add();
            this.renderSeries();
            this.renderLabels();
            this.showCredits(c.credits);
            this.hasRendered = !0
        },
        showCredits: function (a) {
            if (a.enabled && !this.credits) this.credits = this.renderer.text(a.text, 0, 0).on("click", function () {
                if (a.href) location.href = a.href
            }).attr({
                align: a.position.align,
                zIndex: 8
            }).css(a.style).add().align(a.position)
        },
        destroy: function () {
            var a = this,
                b = a.axes,
                c = a.series,
                d = a.container,
                e, f = d && d.parentNode;
            F(a, "destroy");
            ca[a.index] = s;
            gb--;
            a.renderTo.removeAttribute("data-highcharts-chart");
            T(a);
            for (e = b.length; e--;) b[e] = b[e].destroy();
            for (e = c.length; e--;) c[e] =
                c[e].destroy();
            n("title,subtitle,chartBackground,plotBackground,plotBGImage,plotBorder,seriesGroup,clipRect,credits,pointer,scroller,rangeSelector,legend,resetZoomButton,tooltip,renderer".split(","), function (b) {
                var c = a[b];
                c && c.destroy && (a[b] = c.destroy())
            });
            if (d) d.innerHTML = "", T(d), f && Ta(d);
            for (e in a) delete a[e]
        },
        isReadyToRender: function () {
            var a = this;
            return !ea && S == S.top && D.readyState !== "complete" || ma && !S.canvg ? (ma ? Vb.push(function () {
                a.firstRender()
            }, a.options.global.canvasToolsURL) : D.attachEvent("onreadystatechange",
                function () {
                    D.detachEvent("onreadystatechange", a.firstRender);
                    D.readyState === "complete" && a.firstRender()
                }), !1) : !0
        },
        firstRender: function () {
            var a = this,
                b = a.options,
                c = a.callback;
            if (a.isReadyToRender()) {
                a.getContainer();
                F(a, "init");
                a.resetMargins();
                a.setChartSize();
                a.propFromSeries();
                a.getAxes();
                n(b.series || [], function (b) {
                    a.initSeries(b)
                });
                a.linkSeries();
                F(a, "beforeRender");
                if (A.Pointer) a.pointer = new Xa(a, b);
                a.render();
                a.renderer.draw();
                c && c.apply(a, [a]);
                n(a.callbacks, function (b) {
                    a.index !== s && b.apply(a, [a])
                });
                F(a, "load");
                a.cloneRenderTo(!0)
            }
        },
        splashArray: function (a, b) {
            var c = b[a],
                c = ia(c) ? c : [c, c, c, c];
            return [p(b[a + "Top"], c[0]), p(b[a + "Right"], c[1]), p(b[a + "Bottom"], c[2]), p(b[a + "Left"], c[3])]
        }
    };
    var hc = A.CenteredSeriesMixin = {
            getCenter: function () {
                var a = this.options,
                    b = this.chart,
                    c = 2 * (a.slicedOffset || 0),
                    d = b.plotWidth - 2 * c,
                    b = b.plotHeight - 2 * c,
                    e = a.center,
                    e = [p(e[0], "50%"), p(e[1], "50%"), a.size || "100%", a.innerSize || 0],
                    f = B(d, b),
                    g, h, i;
                for (h = 0; h < 4; ++h) i = e[h], g = /%$/.test(i), a = h < 2 || h === 2 && g, e[h] = (g ? [d, b, f, e[2]][h] * C(i) /
                    100 : C(i)) + (a ? c : 0);
                return e
            }
        },
        Ca = function () {};
    Ca.prototype = {
        init: function (a, b, c) {
            this.series = a;
            this.color = a.color;
            this.applyOptions(b, c);
            this.pointAttr = {};
            if (a.options.colorByPoint && (b = a.options.colors || a.chart.options.colors, this.color = this.color || b[a.colorCounter++], a.colorCounter === b.length)) a.colorCounter = 0;
            a.chart.pointCount++;
            return this
        },
        applyOptions: function (a, b) {
            var c = this.series,
                d = c.options.pointValKey || c.pointValKey,
                a = Ca.prototype.optionsToObject.call(this, a);
            x(this, a);
            this.options = this.options ?
                x(this.options, a) : a;
            if (d) this.y = this[d];
            if (this.x === s && c) this.x = b === s ? c.autoIncrement() : b;
            return this
        },
        optionsToObject: function (a) {
            var b = {},
                c = this.series,
                d = c.options.keys,
                e = d || c.pointArrayMap || ["y"],
                f = e.length,
                g = 0,
                h = 0;
            if (typeof a === "number" || a === null) b[e[0]] = a;
            else if (Ka(a)) {
                if (!d && a.length > f) {
                    c = typeof a[0];
                    if (c === "string") b.name = a[0];
                    else if (c === "number") b.x = a[0];
                    g++
                }
                for (; h < f;) b[e[h++]] = a[g++]
            } else if (typeof a === "object") {
                b = a;
                if (a.dataLabels) c._hasPointLabels = !0;
                if (a.marker) c._hasPointMarkers = !0
            }
            return b
        },
        destroy: function () {
            var a = this.series.chart,
                b = a.hoverPoints,
                c;
            a.pointCount--;
            if (b && (this.setState(), ua(b, this), !b.length)) a.hoverPoints = null;
            if (this === a.hoverPoint) this.onMouseOut();
            if (this.graphic || this.dataLabel) T(this), this.destroyElements();
            this.legendItem && a.legend.destroyItem(this);
            for (c in this) this[c] = null
        },
        destroyElements: function () {
            for (var a = "graphic,dataLabel,dataLabelUpper,group,connector,shadowGroup".split(","), b, c = 6; c--;) b = a[c], this[b] && (this[b] = this[b].destroy())
        },
        getLabelConfig: function () {
            return {
                x: this.category,
                y: this.y,
                key: this.name || this.category,
                series: this.series,
                point: this,
                percentage: this.percentage,
                total: this.total || this.stackTotal
            }
        },
        tooltipFormatter: function (a) {
            var b = this.series,
                c = b.tooltipOptions,
                d = p(c.valueDecimals, ""),
                e = c.valuePrefix || "",
                f = c.valueSuffix || "";
            n(b.pointArrayMap || ["y"], function (b) {
                b = "{point." + b;
                if (e || f) a = a.replace(b + "}", e + b + "}" + f);
                a = a.replace(b + "}", b + ":,." + d + "f}")
            });
            return Ma(a, {
                point: this,
                series: this.series
            })
        },
        firePointEvent: function (a, b, c) {
            var d = this,
                e = this.series.options;
            (e.point.events[a] ||
                d.options && d.options.events && d.options.events[a]) && this.importEvents();
            a === "click" && e.allowPointSelect && (c = function (a) {
                d.select(null, a.ctrlKey || a.metaKey || a.shiftKey)
            });
            F(this, a, b, c)
        }
    };
    var O = A.Series = function () {};
    O.prototype = {
        isCartesian: !0,
        type: "line",
        pointClass: Ca,
        sorted: !0,
        requireSorting: !0,
        pointAttrToOptions: {
            stroke: "lineColor",
            "stroke-width": "lineWidth",
            fill: "fillColor",
            r: "radius"
        },
        axisTypes: ["xAxis", "yAxis"],
        colorCounter: 0,
        parallelArrays: ["x", "y"],
        init: function (a, b) {
            var c = this,
                d, e, f = a.series,
                g = function (a, b) {
                    return p(a.options.index, a._i) - p(b.options.index, b._i)
                };
            c.chart = a;
            c.options = b = c.setOptions(b);
            c.linkedSeries = [];
            c.bindAxes();
            x(c, {
                name: b.name,
                state: "",
                pointAttr: {},
                visible: b.visible !== !1,
                selected: b.selected === !0
            });
            if (ma) b.animation = !1;
            e = b.events;
            for (d in e) E(c, d, e[d]);
            if (e && e.click || b.point && b.point.events && b.point.events.click || b.allowPointSelect) a.runTrackerClick = !0;
            c.getColor();
            c.getSymbol();
            n(c.parallelArrays, function (a) {
                c[a + "Data"] = []
            });
            c.setData(b.data, !1);
            if (c.isCartesian) a.hasCartesianSeries = !0;
            f.push(c);
            c._i = f.length - 1;
            xb(f, g);
            this.yAxis && xb(this.yAxis.series, g);
            n(f, function (a, b) {
                a.index = b;
                a.name = a.name || "Series " + (b + 1)
            })
        },
        bindAxes: function () {
            var a = this,
                b = a.options,
                c = a.chart,
                d;
            n(a.axisTypes || [], function (e) {
                n(c[e], function (c) {
                    d = c.options;
                    if (b[e] === d.index || b[e] !== s && b[e] === d.id || b[e] === s && d.index === 0) c.series.push(a), a[e] = c, c.isDirty = !0
                });
                !a[e] && a.optionalAxis !== e && qa(18, !0)
            })
        },
        updateParallelArrays: function (a, b) {
            var c = a.series,
                d = arguments;
            n(c.parallelArrays, typeof b === "number" ? function (d) {
                var f =
                    d === "y" && c.toYData ? c.toYData(a) : a[d];
                c[d + "Data"][b] = f
            } : function (a) {
                Array.prototype[b].apply(c[a + "Data"], Array.prototype.slice.call(d, 2))
            })
        },
        autoIncrement: function () {
            var a = this.options,
                b = this.xIncrement,
                c, d = a.pointIntervalUnit,
                b = p(b, a.pointStart, 0);
            this.pointInterval = c = p(this.pointInterval, a.pointInterval, 1);
            if (d === "month" || d === "year") a = new fa(b), a = d === "month" ? +a[Cb](a[db]() + c) : +a[Db](a[eb]() + c), c = a - b;
            this.xIncrement = b + c;
            return b
        },
        getSegments: function () {
            var a = -1,
                b = [],
                c, d = this.points,
                e = d.length;
            if (e)
                if (this.options.connectNulls) {
                    for (c =
                        e; c--;) d[c].y === null && d.splice(c, 1);
                    d.length && (b = [d])
                } else n(d, function (c, g) {
                    c.y === null ? (g > a + 1 && b.push(d.slice(a + 1, g)), a = g) : g === e - 1 && b.push(d.slice(a + 1, g + 1))
                });
            this.segments = b
        },
        setOptions: function (a) {
            var b = this.chart,
                c = b.options.plotOptions,
                b = b.userOptions || {},
                d = b.plotOptions || {},
                e = c[this.type];
            this.userOptions = a;
            c = y(e, c.series, a);
            this.tooltipOptions = y(P.tooltip, P.plotOptions[this.type].tooltip, b.tooltip, d.series && d.series.tooltip, d[this.type] && d[this.type].tooltip, a.tooltip);
            e.marker === null && delete c.marker;
            this.zoneAxis = c.zoneAxis;
            a = this.zones = (c.zones || []).slice();
            if ((c.negativeColor || c.negativeFillColor) && !c.zones) a.push({
                value: c[this.zoneAxis + "Threshold"] || c.threshold || 0,
                color: c.negativeColor,
                fillColor: c.negativeFillColor
            });
            a.length && r(a[a.length - 1].value) && a.push({
                color: this.color,
                fillColor: this.fillColor
            });
            return c
        },
        getCyclic: function (a, b, c) {
            var d = this.userOptions,
                e = "_" + a + "Index",
                f = a + "Counter";
            b || (r(d[e]) ? b = d[e] : (d[e] = b = this.chart[f] % c.length, this.chart[f] += 1), b = c[b]);
            this[a] = b
        },
        getColor: function () {
            this.options.colorByPoint ||
                this.getCyclic("color", this.options.color || U[this.type].color, this.chart.options.colors)
        },
        getSymbol: function () {
            var a = this.options.marker;
            this.getCyclic("symbol", a.symbol, this.chart.options.symbols);
            if (/^url/.test(this.symbol)) a.radius = 0
        },
        drawLegendSymbol: G.drawLineMarker,
        setData: function (a, b, c, d) {
            var e = this,
                f = e.points,
                g = f && f.length || 0,
                h, i = e.options,
                j = e.chart,
                k = null,
                m = e.xAxis,
                l = m && !!m.categories,
                o = i.turboThreshold,
                q = this.xData,
                t = this.yData,
                $ = (h = e.pointArrayMap) && h.length,
                a = a || [];
            h = a.length;
            b = p(b, !0);
            if (d !== !1 && h && g === h && !e.cropped && !e.hasGroupedData && e.visible) n(a, function (a, b) {
                f[b].update(a, !1, null, !1)
            });
            else {
                e.xIncrement = null;
                e.pointRange = l ? 1 : i.pointRange;
                e.colorCounter = 0;
                n(this.parallelArrays, function (a) {
                    e[a + "Data"].length = 0
                });
                if (o && h > o) {
                    for (c = 0; k === null && c < h;) k = a[c], c++;
                    if (sa(k)) {
                        l = p(i.pointStart, 0);
                        i = p(i.pointInterval, 1);
                        for (c = 0; c < h; c++) q[c] = l, t[c] = a[c], l += i;
                        e.xIncrement = l
                    } else if (Ka(k))
                        if ($)
                            for (c = 0; c < h; c++) i = a[c], q[c] = i[0], t[c] = i.slice(1, $ + 1);
                        else
                            for (c = 0; c < h; c++) i = a[c], q[c] = i[0], t[c] =
                                i[1];
                    else qa(12)
                } else
                    for (c = 0; c < h; c++)
                        if (a[c] !== s && (i = {
                                series: e
                            }, e.pointClass.prototype.applyOptions.apply(i, [a[c]]), e.updateParallelArrays(i, c), l && i.name)) m.names[i.x] = i.name;
                Ja(t[0]) && qa(14, !0);
                e.data = [];
                e.options.data = a;
                for (c = g; c--;) f[c] && f[c].destroy && f[c].destroy();
                if (m) m.minRange = m.userMinRange;
                e.isDirty = e.isDirtyData = j.isDirtyBox = !0;
                c = !1
            }
            b && j.redraw(c)
        },
        processData: function (a) {
            var b = this.xData,
                c = this.yData,
                d = b.length,
                e;
            e = 0;
            var f, g, h = this.xAxis,
                i, j = this.options;
            i = j.cropThreshold;
            var k = this.isCartesian,
                m, l;
            if (k && !this.isDirty && !h.isDirty && !this.yAxis.isDirty && !a) return !1;
            if (h) a = h.getExtremes(), m = a.min, l = a.max;
            if (k && this.sorted && (!i || d > i || this.forceCrop))
                if (b[d - 1] < m || b[0] > l) b = [], c = [];
                else if (b[0] < m || b[d - 1] > l) e = this.cropData(this.xData, this.yData, m, l), b = e.xData, c = e.yData, e = e.start, f = !0;
            for (i = b.length - 1; i >= 0; i--) d = b[i] - b[i - 1], d > 0 && (g === s || d < g) ? g = d : d < 0 && this.requireSorting && qa(15);
            this.cropped = f;
            this.cropStart = e;
            this.processedXData = b;
            this.processedYData = c;
            if (j.pointRange === null) this.pointRange = g || 1;
            this.closestPointRange = g
        },
        cropData: function (a, b, c, d) {
            var e = a.length,
                f = 0,
                g = e,
                h = p(this.cropShoulder, 1),
                i;
            for (i = 0; i < e; i++)
                if (a[i] >= c) {
                    f = v(0, i - h);
                    break
                }
            for (; i < e; i++)
                if (a[i] > d) {
                    g = i + h;
                    break
                }
            return {
                xData: a.slice(f, g),
                yData: b.slice(f, g),
                start: f,
                end: g
            }
        },
        generatePoints: function () {
            var a = this.options.data,
                b = this.data,
                c, d = this.processedXData,
                e = this.processedYData,
                f = this.pointClass,
                g = d.length,
                h = this.cropStart || 0,
                i, j = this.hasGroupedData,
                k, m = [],
                l;
            if (!b && !j) b = [], b.length = a.length, b = this.data = b;
            for (l = 0; l < g; l++) i = h +
                l, j ? m[l] = (new f).init(this, [d[l]].concat(pa(e[l]))) : (b[i] ? k = b[i] : a[i] !== s && (b[i] = k = (new f).init(this, a[i], d[l])), m[l] = k), m[l].index = i;
            if (b && (g !== (c = b.length) || j))
                for (l = 0; l < c; l++)
                    if (l === h && !j && (l += g), b[l]) b[l].destroyElements(), b[l].plotX = s;
            this.data = b;
            this.points = m
        },
        getExtremes: function (a) {
            var b = this.yAxis,
                c = this.processedXData,
                d, e = [],
                f = 0;
            d = this.xAxis.getExtremes();
            var g = d.min,
                h = d.max,
                i, j, k, m, a = a || this.stackedYData || this.processedYData;
            d = a.length;
            for (m = 0; m < d; m++)
                if (j = c[m], k = a[m], i = k !== null && k !== s &&
                    (!b.isLog || k.length || k > 0), j = this.getExtremesFromAll || this.cropped || (c[m + 1] || j) >= g && (c[m - 1] || j) <= h, i && j)
                    if (i = k.length)
                        for (; i--;) k[i] !== null && (e[f++] = k[i]);
                    else e[f++] = k;
            this.dataMin = Sa(e);
            this.dataMax = Fa(e)
        },
        translate: function () {
            this.processedXData || this.processData();
            this.generatePoints();
            for (var a = this.options, b = a.stacking, c = this.xAxis, d = c.categories, e = this.yAxis, f = this.points, g = f.length, h = !!this.modifyValue, i = a.pointPlacement, j = i === "between" || sa(i), k = a.threshold, m, l, o, q = Number.MAX_VALUE, a = 0; a < g; a++) {
                var t =
                    f[a],
                    n = t.x,
                    z = t.y;
                l = t.low;
                var u = b && e.stacks[(this.negStacks && z < k ? "-" : "") + this.stackKey];
                if (e.isLog && z !== null && z <= 0) t.y = z = null, qa(10);
                t.plotX = m = c.translate(n, 0, 0, 0, 1, i, this.type === "flags");
                if (b && this.visible && u && u[n]) u = u[n], z = u.points[this.index + "," + a], l = z[0], z = z[1], l === 0 && (l = p(k, e.min)), e.isLog && l <= 0 && (l = null), t.total = t.stackTotal = u.total, t.percentage = u.total && t.y / u.total * 100, t.stackY = z, u.setOffset(this.pointXOffset || 0, this.barW || 0);
                t.yBottom = r(l) ? e.translate(l, 0, 1, 0, 1) : null;
                h && (z = this.modifyValue(z,
                    t));
                t.plotY = l = typeof z === "number" && z !== Infinity ? B(v(-1E5, e.translate(z, 0, 1, 0, 1)), 1E5) : s;
                t.isInside = l !== s && l >= 0 && l <= e.len && m >= 0 && m <= c.len;
                t.clientX = j ? c.translate(n, 0, 0, 0, 1) : m;
                t.negative = t.y < (k || 0);
                t.category = d && d[t.x] !== s ? d[t.x] : t.x;
                a && (q = B(q, Q(m - o)));
                o = m
            }
            this.closestPointRangePx = q;
            this.getSegments()
        },
        setClip: function (a) {
            var b = this.chart,
                c = b.renderer,
                d = b.inverted,
                e = this.clipBox,
                f = e || b.clipBox,
                g = this.sharedClipKey || ["_sharedClip", a && a.duration, a && a.easing, f.height].join(","),
                h = b[g],
                i = b[g + "m"];
            if (!h) {
                if (a) f.width =
                    0, b[g + "m"] = i = c.clipRect(-99, d ? -b.plotLeft : -b.plotTop, 99, d ? b.chartWidth : b.chartHeight);
                b[g] = h = c.clipRect(f)
            }
            a && (h.count += 1);
            if (this.options.clip !== !1) this.group.clip(a || e ? h : b.clipRect), this.markerGroup.clip(i), this.sharedClipKey = g;
            a || (h.count -= 1, h.count <= 0 && g && b[g] && (e || (b[g] = b[g].destroy()), b[g + "m"] && (b[g + "m"] = b[g + "m"].destroy())))
        },
        animate: function (a) {
            var b = this.chart,
                c = this.options.animation,
                d;
            if (c && !ia(c)) c = U[this.type].animation;
            a ? this.setClip(c) : (d = this.sharedClipKey, (a = b[d]) && a.animate({
                    width: b.plotSizeX
                },
                c), b[d + "m"] && b[d + "m"].animate({
                width: b.plotSizeX + 99
            }, c), this.animate = null)
        },
        afterAnimate: function () {
            this.setClip();
            F(this, "afterAnimate")
        },
        drawPoints: function () {
            var a, b = this.points,
                c = this.chart,
                d, e, f, g, h, i, j, k, m = this.options.marker,
                l = this.pointAttr[""],
                o, q, t, n = this.markerGroup,
                z = p(m.enabled, this.xAxis.isRadial, this.closestPointRangePx > 2 * m.radius);
            if (m.enabled !== !1 || this._hasPointMarkers)
                for (f = b.length; f--;)
                    if (g = b[f], d = W(g.plotX), e = g.plotY, k = g.graphic, o = g.marker || {}, q = !!g.marker, a = z && o.enabled === s ||
                        o.enabled, t = g.isInside, a && e !== s && !isNaN(e) && g.y !== null)
                        if (a = g.pointAttr[g.selected ? "select" : ""] || l, h = a.r, i = p(o.symbol, this.symbol), j = i.indexOf("url") === 0, k) k[t ? "show" : "hide"](!0).animate(x({
                            x: d - h,
                            y: e - h
                        }, k.symbolName ? {
                            width: 2 * h,
                            height: 2 * h
                        } : {}));
                        else {
                            if (t && (h > 0 || j)) g.graphic = c.renderer.symbol(i, d - h, e - h, 2 * h, 2 * h, q ? o : m).attr(a).add(n)
                        } else if (k) g.graphic = k.destroy()
        },
        convertAttribs: function (a, b, c, d) {
            var e = this.pointAttrToOptions,
                f, g, h = {},
                a = a || {},
                b = b || {},
                c = c || {},
                d = d || {};
            for (f in e) g = e[f], h[f] = p(a[g], b[f],
                c[f], d[f]);
            return h
        },
        getAttribs: function () {
            var a = this,
                b = a.options,
                c = U[a.type].marker ? b.marker : b,
                d = c.states,
                e = d.hover,
                f, g = a.color,
                h = a.options.negativeColor;
            f = {
                stroke: g,
                fill: g
            };
            var i = a.points || [],
                j, k = [],
                m, l = a.pointAttrToOptions;
            m = a.hasPointSpecificOptions;
            var o = c.lineColor,
                q = c.fillColor;
            j = b.turboThreshold;
            var t = a.zones,
                p = a.zoneAxis || "y",
                z;
            b.marker ? (e.radius = e.radius || c.radius + e.radiusPlus, e.lineWidth = e.lineWidth || c.lineWidth + e.lineWidthPlus) : (e.color = e.color || wa(e.color || g).brighten(e.brightness).get(),
                e.negativeColor = e.negativeColor || wa(e.negativeColor || h).brighten(e.brightness).get());
            k[""] = a.convertAttribs(c, f);
            n(["hover", "select"], function (b) {
                k[b] = a.convertAttribs(d[b], k[""])
            });
            a.pointAttr = k;
            g = i.length;
            if (!j || g < j || m)
                for (; g--;) {
                    j = i[g];
                    if ((c = j.options && j.options.marker || j.options) && c.enabled === !1) c.radius = 0;
                    if (t.length) {
                        m = 0;
                        for (f = t[m]; j[p] >= f.value;) f = t[++m];
                        j.color = j.fillColor = f.color
                    }
                    m = b.colorByPoint || j.color;
                    if (j.options)
                        for (z in l) r(c[l[z]]) && (m = !0);
                    if (m) {
                        c = c || {};
                        m = [];
                        d = c.states || {};
                        f = d.hover =
                            d.hover || {};
                        if (!b.marker) f.color = f.color || !j.options.color && e[j.negative && h ? "negativeColor" : "color"] || wa(j.color).brighten(f.brightness || e.brightness).get();
                        f = {
                            color: j.color
                        };
                        if (!q) f.fillColor = j.color;
                        if (!o) f.lineColor = j.color;
                        c.hasOwnProperty("color") && !c.color && delete c.color;
                        m[""] = a.convertAttribs(x(f, c), k[""]);
                        m.hover = a.convertAttribs(d.hover, k.hover, m[""]);
                        m.select = a.convertAttribs(d.select, k.select, m[""])
                    } else m = k;
                    j.pointAttr = m
                }
        },
        destroy: function () {
            var a = this,
                b = a.chart,
                c = /AppleWebKit\/533/.test(Ha),
                d, e = a.data || [],
                f, g, h;
            F(a, "destroy");
            T(a);
            n(a.axisTypes || [], function (b) {
                if (h = a[b]) ua(h.series, a), h.isDirty = h.forceRedraw = !0
            });
            a.legendItem && a.chart.legend.destroyItem(a);
            for (d = e.length; d--;)(f = e[d]) && f.destroy && f.destroy();
            a.points = null;
            clearTimeout(a.animationTimeout);
            for (g in a) a[g] instanceof Y && !a[g].survive && (d = c && g === "group" ? "hide" : "destroy", a[g][d]());
            if (b.hoverSeries === a) b.hoverSeries = null;
            ua(b.series, a);
            for (g in a) delete a[g]
        },
        getSegmentPath: function (a) {
            var b = this,
                c = [],
                d = b.options.step;
            n(a,
                function (e, f) {
                    var g = e.plotX,
                        h = e.plotY,
                        i;
                    b.getPointSpline ? c.push.apply(c, b.getPointSpline(a, e, f)) : (c.push(f ? "L" : "M"), d && f && (i = a[f - 1], d === "right" ? c.push(i.plotX, h) : d === "center" ? c.push((i.plotX + g) / 2, i.plotY, (i.plotX + g) / 2, h) : c.push(g, i.plotY)), c.push(e.plotX, e.plotY))
                });
            return c
        },
        getGraphPath: function () {
            var a = this,
                b = [],
                c, d = [];
            n(a.segments, function (e) {
                c = a.getSegmentPath(e);
                e.length > 1 ? b = b.concat(c) : d.push(e[0])
            });
            a.singlePoints = d;
            return a.graphPath = b
        },
        drawGraph: function () {
            var a = this,
                b = this.options,
                c = [["graph",
b.lineColor || this.color, b.dashStyle]],
                d = b.lineWidth,
                e = b.linecap !== "square",
                f = this.getGraphPath(),
                g = this.fillGraph && this.color || Z;
            n(this.zones, function (d, e) {
                c.push(["zoneGraph" + e, d.color || a.color, d.dashStyle || b.dashStyle])
            });
            n(c, function (c, i) {
                var j = c[0],
                    k = a[j];
                if (k) ab(k), k.animate({
                    d: f
                });
                else if ((d || g) && f.length) k = {
                    stroke: c[1],
                    "stroke-width": d,
                    fill: g,
                    zIndex: 1
                }, c[2] ? k.dashstyle = c[2] : e && (k["stroke-linecap"] = k["stroke-linejoin"] = "round"), a[j] = a.chart.renderer.path(f).attr(k).add(a.group).shadow(i < 2 &&
                    b.shadow)
            })
        },
        applyZones: function () {
            var a = this,
                b = this.chart,
                c = b.renderer,
                d = this.zones,
                e, f, g = this.clips || [],
                h, i = this.graph,
                j = this.area,
                k = v(b.chartWidth, b.chartHeight),
                m = this[(this.zoneAxis || "y") + "Axis"],
                l = m.reversed,
                o = m.horiz,
                q = !1;
            if (d.length && (i || j)) i && i.hide(), j && j.hide(), n(d, function (d, n) {
                e = p(f, l ? o ? b.plotWidth : 0 : o ? 0 : m.toPixels(m.min));
                f = w(m.toPixels(p(d.value, m.max), !0));
                e = m.isXAxis ? e > f ? f : e : e < f ? f : e;
                q && (e = f = m.toPixels(m.max));
                if (m.isXAxis) {
                    if (h = {
                            x: l ? f : e,
                            y: 0,
                            width: Math.abs(e - f),
                            height: k
                        }, !o) h.x = b.plotHeight -
                        h.x
                } else if (h = {
                        x: 0,
                        y: l ? e : f,
                        width: k,
                        height: Math.abs(e - f)
                    }, o) h.y = b.plotWidth - h.y;
                b.inverted && c.isVML && (h = m.isXAxis ? {
                    x: 0,
                    y: l ? e : f,
                    height: h.width,
                    width: b.chartWidth
                } : {
                    x: h.y - b.plotLeft - b.spacingBox.x,
                    y: 0,
                    width: h.height,
                    height: b.chartHeight
                });
                g[n] ? g[n].animate(h) : (g[n] = c.clipRect(h), i && a["zoneGraph" + n].clip(g[n]), j && a["zoneArea" + n].clip(g[n]));
                q = d.value > m.max
            }), this.clips = g
        },
        invertGroups: function () {
            function a() {
                var a = {
                    width: b.yAxis.len,
                    height: b.xAxis.len
                };
                n(["group", "markerGroup"], function (c) {
                    b[c] && b[c].attr(a).invert()
                })
            }
            var b = this,
                c = b.chart;
            if (b.xAxis) E(c, "resize", a), E(b, "destroy", function () {
                T(c, "resize", a)
            }), a(), b.invertGroups = a
        },
        plotGroup: function (a, b, c, d, e) {
            var f = this[a],
                g = !f;
            g && (this[a] = f = this.chart.renderer.g(b).attr({
                visibility: c,
                zIndex: d || 0.1
            }).add(e));
            f[g ? "attr" : "animate"](this.getPlotBox());
            return f
        },
        getPlotBox: function () {
            var a = this.chart,
                b = this.xAxis,
                c = this.yAxis;
            if (a.inverted) b = c, c = this.xAxis;
            return {
                translateX: b ? b.left : a.plotLeft,
                translateY: c ? c.top : a.plotTop,
                scaleX: 1,
                scaleY: 1
            }
        },
        render: function () {
            var a =
                this,
                b = a.chart,
                c, d = a.options,
                e = (c = d.animation) && !!a.animate && b.renderer.isSVG && p(c.duration, 500) || 0,
                f = a.visible ? "visible" : "hidden",
                g = d.zIndex,
                h = a.hasRendered,
                i = b.seriesGroup;
            c = a.plotGroup("group", "series", f, g, i);
            a.markerGroup = a.plotGroup("markerGroup", "markers", f, g, i);
            e && a.animate(!0);
            a.getAttribs();
            c.inverted = a.isCartesian ? b.inverted : !1;
            a.drawGraph && (a.drawGraph(), a.applyZones());
            n(a.points, function (a) {
                a.redraw && a.redraw()
            });
            a.drawDataLabels && a.drawDataLabels();
            a.visible && a.drawPoints();
            a.drawTracker &&
                a.options.enableMouseTracking !== !1 && a.drawTracker();
            b.inverted && a.invertGroups();
            d.clip !== !1 && !a.sharedClipKey && !h && c.clip(b.clipRect);
            e && a.animate();
            if (!h) e ? a.animationTimeout = setTimeout(function () {
                a.afterAnimate()
            }, e) : a.afterAnimate();
            a.isDirty = a.isDirtyData = !1;
            a.hasRendered = !0
        },
        redraw: function () {
            var a = this.chart,
                b = this.isDirtyData,
                c = this.isDirty,
                d = this.group,
                e = this.xAxis,
                f = this.yAxis;
            d && (a.inverted && d.attr({
                width: a.plotWidth,
                height: a.plotHeight
            }), d.animate({
                translateX: p(e && e.left, a.plotLeft),
                translateY: p(f &&
                    f.top, a.plotTop)
            }));
            this.translate();
            this.render();
            b && F(this, "updatedData");
            (c || b) && delete this.kdTree
        },
        kdDimensions: 1,
        kdTree: null,
        kdAxisArray: ["clientX", "plotY"],
        kdComparer: "distX",
        searchPoint: function (a) {
            var b = this.xAxis,
                c = this.yAxis,
                d = this.chart.inverted;
            return this.searchKDTree({
                clientX: d ? b.len - a.chartY + b.pos : a.chartX - b.pos,
                plotY: d ? c.len - a.chartX + c.pos : a.chartY - c.pos
            })
        },
        buildKDTree: function () {
            function a(b, d, g) {
                var h, i;
                if (i = b && b.length) return h = c.kdAxisArray[d % g], b.sort(function (a, b) {
                    return a[h] -
                        b[h]
                }), i = Math.floor(i / 2), {
                    point: b[i],
                    left: a(b.slice(0, i), d + 1, g),
                    right: a(b.slice(i + 1), d + 1, g)
                }
            }

            function b() {
                var b = hb(c.points, function (a) {
                    return a.y !== null
                });
                c.kdTree = a(b, d, d)
            }
            var c = this,
                d = c.kdDimensions;
            delete c.kdTree;
            c.options.kdSync ? b() : setTimeout(b)
        },
        searchKDTree: function (a) {
            function b(a, h, i, j) {
                var k = h.point,
                    m = c.kdAxisArray[i % j],
                    l, o = k;
                l = r(a[e]) && r(k[e]) ? Math.pow(a[e] - k[e], 2) : null;
                var q = r(a[f]) && r(k[f]) ? Math.pow(a[f] - k[f], 2) : null,
                    t = (l || 0) + (q || 0);
                l = {
                    distX: r(l) ? Math.sqrt(l) : Number.MAX_VALUE,
                    distY: r(q) ?
                        Math.sqrt(q) : Number.MAX_VALUE,
                    distR: r(t) ? Math.sqrt(t) : Number.MAX_VALUE
                };
                k.dist = l;
                m = a[m] - k[m];
                l = m < 0 ? "left" : "right";
                h[l] && (l = b(a, h[l], i + 1, j), o = l.dist[d] < o.dist[d] ? l : k, k = m < 0 ? "right" : "left", h[k] && Math.sqrt(m * m) < o.dist[d] && (a = b(a, h[k], i + 1, j), o = a.dist[d] < o.dist[d] ? a : o));
                return o
            }
            var c = this,
                d = this.kdComparer,
                e = this.kdAxisArray[0],
                f = this.kdAxisArray[1];
            this.kdTree || this.buildKDTree();
            if (this.kdTree) return b(a, this.kdTree, this.kdDimensions, this.kdDimensions)
        }
    };
    Sb.prototype = {
        destroy: function () {
            Na(this, this.axis)
        },
        render: function (a) {
            var b = this.options,
                c = b.format,
                c = c ? Ma(c, this) : b.formatter.call(this);
            this.label ? this.label.attr({
                text: c,
                visibility: "hidden"
            }) : this.label = this.axis.chart.renderer.text(c, null, null, b.useHTML).css(b.style).attr({
                align: this.textAlign,
                rotation: b.rotation,
                visibility: "hidden"
            }).add(a)
        },
        setOffset: function (a, b) {
            var c = this.axis,
                d = c.chart,
                e = d.inverted,
                f = c.reversed,
                f = this.isNegative && !f || !this.isNegative && f,
                g = c.translate(c.usePercentage ? 100 : this.total, 0, 0, 0, 1),
                c = c.translate(0),
                c = Q(g - c),
                h = d.xAxis[0].translate(this.x) +
                a,
                i = d.plotHeight,
                f = {
                    x: e ? f ? g : g - c : h,
                    y: e ? i - h - b : f ? i - g - c : i - g,
                    width: e ? c : b,
                    height: e ? b : c
                };
            if (e = this.label) e.align(this.alignOptions, null, f), f = e.alignAttr, e[this.options.crop === !1 || d.isInsidePlot(f.x, f.y) ? "show" : "hide"](!0)
        }
    };
    I.prototype.buildStacks = function () {
        var a = this.series,
            b = p(this.options.reversedStacks, !0),
            c = a.length;
        if (!this.isXAxis) {
            for (this.usePercentage = !1; c--;) a[b ? c : a.length - c - 1].setStackedPoints();
            if (this.usePercentage)
                for (c = 0; c < a.length; c++) a[c].setPercentStacks()
        }
    };
    I.prototype.renderStackTotals =
        function () {
            var a = this.chart,
                b = a.renderer,
                c = this.stacks,
                d, e, f = this.stackTotalGroup;
            if (!f) this.stackTotalGroup = f = b.g("stack-labels").attr({
                visibility: "visible",
                zIndex: 6
            }).add();
            f.translate(a.plotLeft, a.plotTop);
            for (d in c)
                for (e in a = c[d], a) a[e].render(f)
        };
    O.prototype.setStackedPoints = function () {
        if (this.options.stacking && !(this.visible !== !0 && this.chart.options.chart.ignoreHiddenSeries !== !1)) {
            var a = this.processedXData,
                b = this.processedYData,
                c = [],
                d = b.length,
                e = this.options,
                f = e.threshold,
                g = e.stack,
                e = e.stacking,
                h = this.stackKey,
                i = "-" + h,
                j = this.negStacks,
                k = this.yAxis,
                m = k.stacks,
                l = k.oldStacks,
                o, q, t, p, n, u;
            for (p = 0; p < d; p++) {
                n = a[p];
                u = b[p];
                t = this.index + "," + p;
                q = (o = j && u < f) ? i : h;
                m[q] || (m[q] = {});
                if (!m[q][n]) l[q] && l[q][n] ? (m[q][n] = l[q][n], m[q][n].total = null) : m[q][n] = new Sb(k, k.options.stackLabels, o, n, g);
                q = m[q][n];
                q.points[t] = [q.cum || 0];
                e === "percent" ? (o = o ? h : i, j && m[o] && m[o][n] ? (o = m[o][n], q.total = o.total = v(o.total, q.total) + Q(u) || 0) : q.total = la(q.total + (Q(u) || 0))) : q.total = la(q.total + (u || 0));
                q.cum = (q.cum || 0) + (u || 0);
                q.points[t].push(q.cum);
                c[p] = q.cum
            }
            if (e === "percent") k.usePercentage = !0;
            this.stackedYData = c;
            k.oldStacks = {}
        }
    };
    O.prototype.setPercentStacks = function () {
        var a = this,
            b = a.stackKey,
            c = a.yAxis.stacks,
            d = a.processedXData;
        n([b, "-" + b], function (b) {
            var e;
            for (var f = d.length, g, h; f--;)
                if (g = d[f], e = (h = c[b] && c[b][g]) && h.points[a.index + "," + f], g = e) h = h.total ? 100 / h.total : 0, g[0] = la(g[0] * h), g[1] = la(g[1] * h), a.stackedYData[f] = g[1]
        })
    };
    x(Pa.prototype, {
        addSeries: function (a, b, c) {
            var d, e = this;
            a && (b = p(b, !0), F(e, "addSeries", {
                options: a
            }, function () {
                d = e.initSeries(a);
                e.isDirtyLegend = !0;
                e.linkSeries();
                b && e.redraw(c)
            }));
            return d
        },
        addAxis: function (a, b, c, d) {
            var e = b ? "xAxis" : "yAxis",
                f = this.options;
            new I(this, y(a, {
                index: this[e].length,
                isX: b
            }));
            f[e] = pa(f[e] || {});
            f[e].push(a);
            p(c, !0) && this.redraw(d)
        },
        showLoading: function (a) {
            var b = this,
                c = b.options,
                d = b.loadingDiv,
                e = c.loading,
                f = function () {
                    d && L(d, {
                        left: b.plotLeft + "px",
                        top: b.plotTop + "px",
                        width: b.plotWidth + "px",
                        height: b.plotHeight + "px"
                    })
                };
            if (!d) b.loadingDiv = d = aa(Ua, {
                    className: "highcharts-loading"
                }, x(e.style, {
                    zIndex: 10,
                    display: Z
                }),
                b.container), b.loadingSpan = aa("span", null, e.labelStyle, d), E(b, "redraw", f);
            b.loadingSpan.innerHTML = a || c.lang.loading;
            if (!b.loadingShown) L(d, {
                opacity: 0,
                display: ""
            }), qb(d, {
                opacity: e.style.opacity
            }, {
                duration: e.showDuration || 0
            }), b.loadingShown = !0;
            f()
        },
        hideLoading: function () {
            var a = this.options,
                b = this.loadingDiv;
            b && qb(b, {
                opacity: 0
            }, {
                duration: a.loading.hideDuration || 100,
                complete: function () {
                    L(b, {
                        display: Z
                    })
                }
            });
            this.loadingShown = !1
        }
    });
    x(Ca.prototype, {
        update: function (a, b, c, d) {
            function e() {
                f.applyOptions(a);
                if (ia(a) && !Ka(a)) f.redraw = function () {
                    if (h) a && a.marker && a.marker.symbol ? f.graphic = h.destroy() : h.attr(f.pointAttr[f.state || ""]);
                    if (a && a.dataLabels && f.dataLabel) f.dataLabel = f.dataLabel.destroy();
                    f.redraw = null
                };
                i = f.index;
                g.updateParallelArrays(f, i);
                if (m && f.name) m[f.x] = f.name;
                k.data[i] = f.options;
                g.isDirty = g.isDirtyData = !0;
                if (!g.fixedBox && g.hasCartesianSeries) j.isDirtyBox = !0;
                j.legend.display && k.legendType === "point" && (g.updateTotals(), j.legend.clearItems());
                b && j.redraw(c)
            }
            var f = this,
                g = f.series,
                h = f.graphic,
                i, j = g.chart,
                k = g.options,
                m = g.xAxis && g.xAxis.names,
                b = p(b, !0);
            d === !1 ? e() : f.firePointEvent("update", {
                options: a
            }, e)
        },
        remove: function (a, b) {
            this.series.removePoint(Oa(this, this.series.data), a, b)
        }
    });
    x(O.prototype, {
        addPoint: function (a, b, c, d) {
            var e = this,
                f = e.options,
                g = e.data,
                h = e.graph,
                i = e.area,
                j = e.chart,
                k = e.xAxis && e.xAxis.names,
                m = h && h.shift || 0,
                l = ["graph", "area"],
                h = f.data,
                o, q = e.xData;
            Ya(d, j);
            if (c) {
                for (d = e.zones.length; d--;) l.push("zoneGraph" + d, "zoneArea" + d);
                n(l, function (a) {
                    if (e[a]) e[a].shift = m + 1
                })
            }
            if (i) i.isArea = !0;
            b = p(b, !0);
            i = {
                series: e
            };
            e.pointClass.prototype.applyOptions.apply(i, [a]);
            l = i.x;
            d = q.length;
            if (e.requireSorting && l < q[d - 1])
                for (o = !0; d && q[d - 1] > l;) d--;
            e.updateParallelArrays(i, "splice", d, 0, 0);
            e.updateParallelArrays(i, d);
            if (k && i.name) k[l] = i.name;
            h.splice(d, 0, a);
            o && (e.data.splice(d, 0, null), e.processData());
            f.legendType === "point" && e.generatePoints();
            c && (g[0] && g[0].remove ? g[0].remove(!1) : (g.shift(), e.updateParallelArrays(i, "shift"), h.shift()));
            e.isDirty = !0;
            e.isDirtyData = !0;
            b && (e.getAttribs(), j.redraw())
        },
        removePoint: function (a, b, c) {
            var d = this,
                e = d.data,
                f = e[a],
                g = d.points,
                h = d.chart,
                i = function () {
                    e.length === g.length && g.splice(a, 1);
                    e.splice(a, 1);
                    d.options.data.splice(a, 1);
                    d.updateParallelArrays(f || {
                        series: d
                    }, "splice", a, 1);
                    f && f.destroy();
                    d.isDirty = !0;
                    d.isDirtyData = !0;
                    b && h.redraw()
                };
            Ya(c, h);
            b = p(b, !0);
            f ? f.firePointEvent("remove", null, i) : i()
        },
        remove: function (a, b) {
            var c = this,
                d = c.chart,
                a = p(a, !0);
            if (!c.isRemoving) c.isRemoving = !0, F(c, "remove", null, function () {
                c.destroy();
                d.isDirtyLegend = d.isDirtyBox = !0;
                d.linkSeries();
                a && d.redraw(b)
            });
            c.isRemoving = !1
        },
        update: function (a, b) {
            var c = this,
                d = this.chart,
                e = this.userOptions,
                f = this.type,
                g = K[f].prototype,
                h = ["group", "markerGroup", "dataLabelsGroup"],
                i;
            if (a.type && a.type !== f || a.zIndex !== void 0) h.length = 0;
            n(h, function (a) {
                h[a] = c[a];
                delete c[a]
            });
            a = y(e, {
                animation: !1,
                index: this.index,
                pointStart: this.xData[0]
            }, {
                data: this.options.data
            }, a);
            this.remove(!1);
            for (i in g) this[i] = s;
            x(this, K[a.type || f].prototype);
            n(h, function (a) {
                c[a] = h[a]
            });
            this.init(d, a);
            d.linkSeries();
            p(b, !0) && d.redraw(!1)
        }
    });
    x(I.prototype, {
        update: function (a, b) {
            var c = this.chart,
                a = c.options[this.coll][this.options.index] = y(this.userOptions, a);
            this.destroy(!0);
            this._addedPlotLB = s;
            this.init(c, x(a, {
                events: s
            }));
            c.isDirtyBox = !0;
            p(b, !0) && c.redraw()
        },
        remove: function (a) {
            for (var b = this.chart, c = this.coll, d = this.series, e = d.length; e--;) d[e] && d[e].remove(!1);
            ua(b.axes, this);
            ua(b[c], this);
            b.options[c].splice(this.options.index, 1);
            n(b[c], function (a, b) {
                a.options.index = b
            });
            this.destroy();
            b.isDirtyBox = !0;
            p(a, !0) && b.redraw()
        },
        setTitle: function (a,
            b) {
            this.update({
                title: a
            }, b)
        },
        setCategories: function (a, b) {
            this.update({
                categories: a
            }, b)
        }
    });
    var Da = ja(O);
    K.line = Da;
    U.area = y(N, {
        threshold: 0
    });
    var ya = ja(O, {
        type: "area",
        getSegments: function () {
            var a = this,
                b = [],
                c = [],
                d = [],
                e = this.xAxis,
                f = this.yAxis,
                g = f.stacks[this.stackKey],
                h = {},
                i, j, k = this.points,
                m = this.options.connectNulls,
                l, o;
            if (this.options.stacking && !this.cropped) {
                for (l = 0; l < k.length; l++) h[k[l].x] = k[l];
                for (o in g) g[o].total !== null && d.push(+o);
                d.sort(function (a, b) {
                    return a - b
                });
                n(d, function (b) {
                    var d = 0,
                        k;
                    if (!m ||
                        h[b] && h[b].y !== null)
                        if (h[b]) c.push(h[b]);
                        else {
                            for (l = a.index; l <= f.series.length; l++)
                                if (k = g[b].points[l + "," + b]) {
                                    d = k[1];
                                    break
                                }
                            i = e.translate(b);
                            j = f.toPixels(d, !0);
                            c.push({
                                y: null,
                                plotX: i,
                                clientX: i,
                                plotY: j,
                                yBottom: j,
                                onMouseOver: ha
                            })
                        }
                });
                c.length && b.push(c)
            } else O.prototype.getSegments.call(this), b = this.segments;
            this.segments = b
        },
        getSegmentPath: function (a) {
            var b = O.prototype.getSegmentPath.call(this, a),
                c = [].concat(b),
                d, e = this.options;
            d = b.length;
            var f = this.yAxis.getThreshold(e.threshold),
                g;
            d === 3 && c.push("L",
                b[1], b[2]);
            if (e.stacking && !this.closedStacks)
                for (d = a.length - 1; d >= 0; d--) g = p(a[d].yBottom, f), d < a.length - 1 && e.step && c.push(a[d + 1].plotX, g), c.push(a[d].plotX, g);
            else this.closeSegment(c, a, f);
            this.areaPath = this.areaPath.concat(c);
            return b
        },
        closeSegment: function (a, b, c) {
            a.push("L", b[b.length - 1].plotX, c, "L", b[0].plotX, c)
        },
        drawGraph: function () {
            this.areaPath = [];
            O.prototype.drawGraph.apply(this);
            var a = this,
                b = this.areaPath,
                c = this.options,
                d = [["area", this.color, c.fillColor]];
            n(this.zones, function (b, f) {
                d.push(["zoneArea" +
f, b.color || a.color, b.fillColor || c.fillColor])
            });
            n(d, function (d) {
                var f = d[0],
                    g = a[f];
                g ? g.animate({
                    d: b
                }) : a[f] = a.chart.renderer.path(b).attr({
                    fill: p(d[2], wa(d[1]).setOpacity(p(c.fillOpacity, 0.75)).get()),
                    zIndex: 0
                }).add(a.group)
            })
        },
        drawLegendSymbol: G.drawRectangle
    });
    K.area = ya;
    U.spline = y(N);
    Da = ja(O, {
        type: "spline",
        getPointSpline: function (a, b, c) {
            var d = b.plotX,
                e = b.plotY,
                f = a[c - 1],
                g = a[c + 1],
                h, i, j, k;
            if (f && g) {
                a = f.plotY;
                j = g.plotX;
                var g = g.plotY,
                    m;
                h = (1.5 * d + f.plotX) / 2.5;
                i = (1.5 * e + a) / 2.5;
                j = (1.5 * d + j) / 2.5;
                k = (1.5 * e + g) / 2.5;
                m = (k - i) * (j - d) / (j - h) + e - k;
                i += m;
                k += m;
                i > a && i > e ? (i = v(a, e), k = 2 * e - i) : i < a && i < e && (i = B(a, e), k = 2 * e - i);
                k > g && k > e ? (k = v(g, e), i = 2 * e - k) : k < g && k < e && (k = B(g, e), i = 2 * e - k);
                b.rightContX = j;
                b.rightContY = k
            }
            c ? (b = ["C", f.rightContX || f.plotX, f.rightContY || f.plotY, h || d, i || e, d, e], f.rightContX = f.rightContY = null) : b = ["M", d, e];
            return b
        }
    });
    K.spline = Da;
    U.areaspline = y(U.area);
    ya = ya.prototype;
    Da = ja(Da, {
        type: "areaspline",
        closedStacks: !0,
        getSegmentPath: ya.getSegmentPath,
        closeSegment: ya.closeSegment,
        drawGraph: ya.drawGraph,
        drawLegendSymbol: G.drawRectangle
    });
    K.areaspline = Da;
    U.column = y(N, {
        borderColor: "#FFFFFF",
        borderRadius: 0,
        groupPadding: 0.2,
        marker: null,
        pointPadding: 0.1,
        minPointLength: 0,
        cropThreshold: 50,
        pointRange: null,
        states: {
            hover: {
                brightness: 0.1,
                shadow: !1,
                halo: !1
            },
            select: {
                color: "#C0C0C0",
                borderColor: "#000000",
                shadow: !1
            }
        },
        dataLabels: {
            align: null,
            verticalAlign: null,
            y: null
        },
        stickyTracking: !1,
        tooltip: {
            distance: 6
        },
        threshold: 0
    });
    Da = ja(O, {
        type: "column",
        pointAttrToOptions: {
            stroke: "borderColor",
            fill: "color",
            r: "borderRadius"
        },
        cropShoulder: 0,
        directTouch: !0,
        trackerGroups: ["group",
"dataLabelsGroup"],
        negStacks: !0,
        init: function () {
            O.prototype.init.apply(this, arguments);
            var a = this,
                b = a.chart;
            b.hasRendered && n(b.series, function (b) {
                if (b.type === a.type) b.isDirty = !0
            })
        },
        getColumnMetrics: function () {
            var a = this,
                b = a.options,
                c = a.xAxis,
                d = a.yAxis,
                e = c.reversed,
                f, g = {},
                h, i = 0;
            b.grouping === !1 ? i = 1 : n(a.chart.series, function (b) {
                var c = b.options,
                    e = b.yAxis;
                if (b.type === a.type && b.visible && d.len === e.len && d.pos === e.pos) c.stacking ? (f = b.stackKey, g[f] === s && (g[f] = i++), h = g[f]) : c.grouping !== !1 && (h = i++), b.columnIndex =
                    h
            });
            var c = B(Q(c.transA) * (c.ordinalSlope || b.pointRange || c.closestPointRange || c.tickInterval || 1), c.len),
                j = c * b.groupPadding,
                k = (c - 2 * j) / i,
                m = b.pointWidth,
                b = r(m) ? (k - m) / 2 : k * b.pointPadding,
                m = p(m, k - 2 * b);
            return a.columnMetrics = {
                width: m,
                offset: b + (j + ((e ? i - (a.columnIndex || 0) : a.columnIndex) || 0) * k - c / 2) * (e ? -1 : 1)
            }
        },
        translate: function () {
            var a = this,
                b = a.chart,
                c = a.options,
                d = a.borderWidth = p(c.borderWidth, a.closestPointRange * a.xAxis.transA < 2 ? 0 : 1),
                e = a.yAxis,
                f = a.translatedThreshold = e.getThreshold(c.threshold),
                g = p(c.minPointLength,
                    5),
                h = a.getColumnMetrics(),
                i = h.width,
                j = a.barW = v(i, 1 + 2 * d),
                k = a.pointXOffset = h.offset,
                m = -(d % 2 ? 0.5 : 0),
                l = d % 2 ? 0.5 : 1;
            b.inverted && (f -= 0.5, b.renderer.isVML && (l += 1));
            c.pointPadding && (j = za(j));
            O.prototype.translate.apply(a);
            n(a.points, function (c) {
                var d = p(c.yBottom, f),
                    h = B(v(-999 - d, c.plotY), e.len + 999 + d),
                    n = c.plotX + k,
                    z = j,
                    u = B(h, d),
                    s, r;
                s = v(h, d) - u;
                Q(s) < g && g && (s = g, r = !e.reversed && !c.negative || e.reversed && c.negative, u = w(Q(u - f) > g ? d - g : f - (r ? g : 0)));
                c.barX = n;
                c.pointWidth = i;
                c.tooltipPos = b.inverted ? [e.len + e.pos - b.plotLeft - h,
a.xAxis.len - n - z / 2] : [n + z / 2, h + e.pos - b.plotTop];
                z = w(n + z) + m;
                n = w(n) + m;
                z -= n;
                d = Q(u) < 0.5;
                s = B(w(u + s) + l, 9E4);
                u = w(u) + l;
                s -= u;
                d && (u -= 1, s += 1);
                c.shapeType = "rect";
                c.shapeArgs = {
                    x: n,
                    y: u,
                    width: z,
                    height: s
                }
            })
        },
        getSymbol: ha,
        drawLegendSymbol: G.drawRectangle,
        drawGraph: ha,
        drawPoints: function () {
            var a = this,
                b = this.chart,
                c = a.options,
                d = b.renderer,
                e = c.animationLimit || 250,
                f, g;
            n(a.points, function (h) {
                var i = h.plotY,
                    j = h.graphic;
                if (i !== s && !isNaN(i) && h.y !== null) f = h.shapeArgs, i = r(a.borderWidth) ? {
                    "stroke-width": a.borderWidth
                } : {}, g = h.pointAttr[h.selected ?
                    "select" : ""] || a.pointAttr[""], j ? (ab(j), j.attr(i)[b.pointCount < e ? "animate" : "attr"](y(f))) : h.graphic = d[h.shapeType](f).attr(i).attr(g).add(a.group).shadow(c.shadow, null, c.stacking && !c.borderRadius);
                else if (j) h.graphic = j.destroy()
            })
        },
        animate: function (a) {
            var b = this.yAxis,
                c = this.options,
                d = this.chart.inverted,
                e = {};
            if (ea) a ? (e.scaleY = 0.001, a = B(b.pos + b.len, v(b.pos, b.toPixels(c.threshold))), d ? e.translateX = a - b.len : e.translateY = a, this.group.attr(e)) : (e.scaleY = 1, e[d ? "translateX" : "translateY"] = b.pos, this.group.animate(e,
                this.options.animation), this.animate = null)
        },
        remove: function () {
            var a = this,
                b = a.chart;
            b.hasRendered && n(b.series, function (b) {
                if (b.type === a.type) b.isDirty = !0
            });
            O.prototype.remove.apply(a, arguments)
        }
    });
    K.column = Da;
    U.bar = y(U.column);
    ya = ja(Da, {
        type: "bar",
        inverted: !0
    });
    K.bar = ya;
    U.scatter = y(N, {
        lineWidth: 0,
        marker: {
            enabled: !0
        },
        tooltip: {
            headerFormat: '<span style="color:{series.color}">\u25CF</span> <span style="font-size: 10px;"> {series.name}</span><br/>',
            pointFormat: "x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>"
        }
    });
    ya = ja(O, {
        type: "scatter",
        sorted: !1,
        requireSorting: !1,
        noSharedTooltip: !0,
        trackerGroups: ["group", "markerGroup", "dataLabelsGroup"],
        takeOrdinalPosition: !1,
        kdDimensions: 2,
        kdComparer: "distR",
        drawGraph: function () {
            this.options.lineWidth && O.prototype.drawGraph.call(this)
        }
    });
    K.scatter = ya;
    U.pie = y(N, {
        borderColor: "#FFFFFF",
        borderWidth: 1,
        center: [null, null],
        clip: !1,
        colorByPoint: !0,
        dataLabels: {
            distance: 30,
            enabled: !0,
            formatter: function () {
                return this.point.name
            },
            x: 0
        },
        ignoreHiddenPoint: !0,
        legendType: "point",
        marker: null,
        size: null,
        showInLegend: !1,
        slicedOffset: 10,
        states: {
            hover: {
                brightness: 0.1,
                shadow: !1
            }
        },
        stickyTracking: !1,
        tooltip: {
            followPointer: !0
        }
    });
    N = {
        type: "pie",
        isCartesian: !1,
        pointClass: ja(Ca, {
            init: function () {
                Ca.prototype.init.apply(this, arguments);
                var a = this,
                    b;
                x(a, {
                    visible: a.visible !== !1,
                    name: p(a.name, "Slice")
                });
                b = function (b) {
                    a.slice(b.type === "select")
                };
                E(a, "select", b);
                E(a, "unselect", b);
                return a
            },
            setVisible: function (a, b) {
                var c = this,
                    d = c.series,
                    e = d.chart,
                    f = !d.isDirty && d.options.ignoreHiddenPoint;
                if (a !== c.visible ||
                    b)
                    if (c.visible = c.options.visible = a = a === s ? !c.visible : a, d.options.data[Oa(c, d.data)] = c.options, n(["graphic", "dataLabel", "connector", "shadowGroup"], function (b) {
                            if (c[b]) c[b][a ? "show" : "hide"](!0)
                        }), c.legendItem && (e.hasRendered && (d.updateTotals(), e.legend.clearItems(), f || e.legend.render()), e.legend.colorizeItem(c, a)), f) d.isDirty = !0, e.redraw()
            },
            slice: function (a, b, c) {
                var d = this.series;
                Ya(c, d.chart);
                p(b, !0);
                this.sliced = this.options.sliced = a = r(a) ? a : !this.sliced;
                d.options.data[Oa(this, d.data)] = this.options;
                a = a ? this.slicedTranslation : {
                    translateX: 0,
                    translateY: 0
                };
                this.graphic.animate(a);
                this.shadowGroup && this.shadowGroup.animate(a)
            },
            haloPath: function (a) {
                var b = this.shapeArgs,
                    c = this.series.chart;
                return this.sliced || !this.visible ? [] : this.series.chart.renderer.symbols.arc(c.plotLeft + b.x, c.plotTop + b.y, b.r + a, b.r + a, {
                    innerR: this.shapeArgs.r,
                    start: b.start,
                    end: b.end
                })
            }
        }),
        requireSorting: !1,
        noSharedTooltip: !0,
        trackerGroups: ["group", "dataLabelsGroup"],
        axisTypes: [],
        pointAttrToOptions: {
            stroke: "borderColor",
            "stroke-width": "borderWidth",
            fill: "color"
        },
        getColor: ha,
        animate: function (a) {
            var b = this,
                c = b.points,
                d = b.startAngleRad;
            if (!a) n(c, function (a) {
                var c = a.graphic,
                    g = a.shapeArgs;
                c && (c.attr({
                    r: a.startR || b.center[3] / 2,
                    start: d,
                    end: d
                }), c.animate({
                    r: g.r,
                    start: g.start,
                    end: g.end
                }, b.options.animation))
            }), b.animate = null
        },
        setData: function (a, b, c, d) {
            O.prototype.setData.call(this, a, !1, c, d);
            this.processData();
            this.generatePoints();
            p(b, !0) && this.chart.redraw(c)
        },
        updateTotals: function () {
            var a, b = 0,
                c, d, e, f = this.options.ignoreHiddenPoint;
            c = this.points;
            d =
                c.length;
            for (a = 0; a < d; a++) {
                e = c[a];
                if (e.y < 0) e.y = null;
                b += f && !e.visible ? 0 : e.y
            }
            this.total = b;
            for (a = 0; a < d; a++) e = c[a], e.percentage = b > 0 && (e.visible || !f) ? e.y / b * 100 : 0, e.total = b
        },
        generatePoints: function () {
            O.prototype.generatePoints.call(this);
            this.updateTotals()
        },
        translate: function (a) {
            this.generatePoints();
            var b = 0,
                c = this.options,
                d = c.slicedOffset,
                e = d + c.borderWidth,
                f, g, h, i = c.startAngle || 0,
                j = this.startAngleRad = va / 180 * (i - 90),
                i = (this.endAngleRad = va / 180 * (p(c.endAngle, i + 360) - 90)) - j,
                k = this.points,
                m = c.dataLabels.distance,
                c = c.ignoreHiddenPoint,
                l, o = k.length,
                q;
            if (!a) this.center = a = this.getCenter();
            this.getX = function (b, c) {
                h = X.asin(B((b - a[1]) / (a[2] / 2 + m), 1));
                return a[0] + (c ? -1 : 1) * ba(h) * (a[2] / 2 + m)
            };
            for (l = 0; l < o; l++) {
                q = k[l];
                f = j + b * i;
                if (!c || q.visible) b += q.percentage / 100;
                g = j + b * i;
                q.shapeType = "arc";
                q.shapeArgs = {
                    x: a[0],
                    y: a[1],
                    r: a[2] / 2,
                    innerR: a[3] / 2,
                    start: w(f * 1E3) / 1E3,
                    end: w(g * 1E3) / 1E3
                };
                h = (g + f) / 2;
                h > 1.5 * va ? h -= 2 * va : h < -va / 2 && (h += 2 * va);
                q.slicedTranslation = {
                    translateX: w(ba(h) * d),
                    translateY: w(ga(h) * d)
                };
                f = ba(h) * a[2] / 2;
                g = ga(h) * a[2] / 2;
                q.tooltipPos = [a[0] + f * 0.7, a[1] + g * 0.7];
                q.half = h < -va / 2 || h > va / 2 ? 1 : 0;
                q.angle = h;
                e = B(e, m / 2);
                q.labelPos = [a[0] + f + ba(h) * m, a[1] + g + ga(h) * m, a[0] + f + ba(h) * e, a[1] + g + ga(h) * e, a[0] + f, a[1] + g, m < 0 ? "center" : q.half ? "right" : "left", h]
            }
        },
        drawGraph: null,
        drawPoints: function () {
            var a = this,
                b = a.chart.renderer,
                c, d, e = a.options.shadow,
                f, g;
            if (e && !a.shadowGroup) a.shadowGroup = b.g("shadow").add(a.group);
            n(a.points, function (h) {
                var i = h.options.visible;
                d = h.graphic;
                g = h.shapeArgs;
                f = h.shadowGroup;
                if (e && !f) f = h.shadowGroup = b.g("shadow").add(a.shadowGroup);
                c = h.sliced ? h.slicedTranslation : {
                    translateX: 0,
                    translateY: 0
                };
                f && f.attr(c);
                d ? d.animate(x(g, c)) : h.graphic = d = b[h.shapeType](g).setRadialReference(a.center).attr(h.pointAttr[h.selected ? "select" : ""]).attr({
                    "stroke-linejoin": "round"
                }).attr(c).add(a.group).shadow(e, f);
                i !== void 0 && h.setVisible(i, !0)
            })
        },
        searchPoint: ha,
        sortByAngle: function (a, b) {
            a.sort(function (a, d) {
                return a.angle !== void 0 && (d.angle - a.angle) * b
            })
        },
        drawLegendSymbol: G.drawRectangle,
        getCenter: hc.getCenter,
        getSymbol: ha
    };
    N = ja(O, N);
    K.pie = N;
    O.prototype.drawDataLabels =
        function () {
            var a = this,
                b = a.options,
                c = b.cursor,
                d = b.dataLabels,
                e = a.points,
                f, g, h = a.hasRendered || 0,
                i, j, k = a.chart.renderer;
            if (d.enabled || a._hasPointLabels) a.dlProcessOptions && a.dlProcessOptions(d), j = a.plotGroup("dataLabelsGroup", "data-labels", d.defer ? "hidden" : "visible", d.zIndex || 6), p(d.defer, !0) && (j.attr({
                opacity: +h
            }), h || E(a, "afterAnimate", function () {
                a.visible && j.show();
                j[b.animation ? "animate" : "attr"]({
                    opacity: 1
                }, {
                    duration: 200
                })
            })), g = d, n(e, function (e) {
                var h, o = e.dataLabel,
                    q, t, n = e.connector,
                    z = !0,
                    u, v = {};
                f =
                    e.dlOptions || e.options && e.options.dataLabels;
                h = p(f && f.enabled, g.enabled);
                if (o && !h) e.dataLabel = o.destroy();
                else if (h) {
                    d = y(g, f);
                    u = d.style;
                    h = d.rotation;
                    q = e.getLabelConfig();
                    i = d.format ? Ma(d.format, q) : d.formatter.call(q, d);
                    u.color = p(d.color, u.color, a.color, "black");
                    if (o)
                        if (r(i)) o.attr({
                            text: i
                        }), z = !1;
                        else {
                            if (e.dataLabel = o = o.destroy(), n) e.connector = n.destroy()
                        } else if (r(i)) {
                        o = {
                            fill: d.backgroundColor,
                            stroke: d.borderColor,
                            "stroke-width": d.borderWidth,
                            r: d.borderRadius || 0,
                            rotation: h,
                            padding: d.padding,
                            zIndex: 1
                        };
                        if (u.color === "contrast") v.color = d.inside || d.distance < 0 || b.stacking ? k.getContrast(e.color || a.color) : "#000000";
                        if (c) v.cursor = c;
                        for (t in o) o[t] === s && delete o[t];
                        o = e.dataLabel = k[h ? "text" : "label"](i, 0, -999, d.shape, null, null, d.useHTML).attr(o).css(x(u, v)).add(j).shadow(d.shadow)
                    }
                    o && a.alignDataLabel(e, o, d, null, z)
                }
            })
        };
    O.prototype.alignDataLabel = function (a, b, c, d, e) {
        var f = this.chart,
            g = f.inverted,
            h = p(a.plotX, -999),
            i = p(a.plotY, -999),
            j = b.getBBox(),
            k = f.renderer.fontMetrics(c.style.fontSize).b,
            m = this.visible && (a.series.forceDL ||
                f.isInsidePlot(h, w(i), g) || d && f.isInsidePlot(h, g ? d.x + 1 : d.y + d.height - 1, g));
        if (m) d = x({
            x: g ? f.plotWidth - i : h,
            y: w(g ? f.plotHeight - h : i),
            width: 0,
            height: 0
        }, d), x(c, {
            width: j.width,
            height: j.height
        }), c.rotation ? (a = f.renderer.rotCorr(k, c.rotation), b[e ? "attr" : "animate"]({
            x: d.x + c.x + d.width / 2 + a.x,
            y: d.y + c.y + d.height / 2
        }).attr({
            align: c.align
        })) : (b.align(c, null, d), g = b.alignAttr, p(c.overflow, "justify") === "justify" ? this.justifyDataLabel(b, c, g, j, d, e) : p(c.crop, !0) && (m = f.isInsidePlot(g.x, g.y) && f.isInsidePlot(g.x + j.width, g.y +
            j.height)), c.shape && b.attr({
            anchorX: a.plotX,
            anchorY: a.plotY
        }));
        if (!m) b.attr({
            y: -999
        }), b.placed = !1
    };
    O.prototype.justifyDataLabel = function (a, b, c, d, e, f) {
        var g = this.chart,
            h = b.align,
            i = b.verticalAlign,
            j, k, m = a.box ? 0 : a.padding || 0;
        j = c.x + m;
        if (j < 0) h === "right" ? b.align = "left" : b.x = -j, k = !0;
        j = c.x + d.width - m;
        if (j > g.plotWidth) h === "left" ? b.align = "right" : b.x = g.plotWidth - j, k = !0;
        j = c.y + m;
        if (j < 0) i === "bottom" ? b.verticalAlign = "top" : b.y = -j, k = !0;
        j = c.y + d.height - m;
        if (j > g.plotHeight) i === "top" ? b.verticalAlign = "bottom" : b.y = g.plotHeight -
            j, k = !0;
        if (k) a.placed = !f, a.align(b, null, e)
    };
    if (K.pie) K.pie.prototype.drawDataLabels = function () {
        var a = this,
            b = a.data,
            c, d = a.chart,
            e = a.options.dataLabels,
            f = p(e.connectorPadding, 10),
            g = p(e.connectorWidth, 1),
            h = d.plotWidth,
            i = d.plotHeight,
            j, k, m = p(e.softConnector, !0),
            l = e.distance,
            o = a.center,
            q = o[2] / 2,
            t = o[1],
            s = l > 0,
            z, u, r, x = [[], []],
            y, A, E, D, J, C = [0, 0, 0, 0],
            K = function (a, b) {
                return b.y - a.y
            };
        if (a.visible && (e.enabled || a._hasPointLabels)) {
            O.prototype.drawDataLabels.apply(a);
            n(b, function (a) {
                a.dataLabel && a.visible && x[a.half].push(a)
            });
            for (D = 2; D--;) {
                var G = [],
                    L = [],
                    H = x[D],
                    I = H.length,
                    F;
                if (I) {
                    a.sortByAngle(H, D - 0.5);
                    for (J = b = 0; !b && H[J];) b = H[J] && H[J].dataLabel && (H[J].dataLabel.getBBox().height || 21), J++;
                    if (l > 0) {
                        u = B(t + q + l, d.plotHeight);
                        for (J = v(0, t - q - l); J <= u; J += b) G.push(J);
                        u = G.length;
                        if (I > u) {
                            c = [].concat(H);
                            c.sort(K);
                            for (J = I; J--;) c[J].rank = J;
                            for (J = I; J--;) H[J].rank >= u && H.splice(J, 1);
                            I = H.length
                        }
                        for (J = 0; J < I; J++) {
                            c = H[J];
                            r = c.labelPos;
                            c = 9999;
                            var P, N;
                            for (N = 0; N < u; N++) P = Q(G[N] - r[1]), P < c && (c = P, F = N);
                            if (F < J && G[J] !== null) F = J;
                            else
                                for (u < I - J + F && G[J] !== null &&
                                    (F = u - I + J); G[F] === null;) F++;
                            L.push({
                                i: F,
                                y: G[F]
                            });
                            G[F] = null
                        }
                        L.sort(K)
                    }
                    for (J = 0; J < I; J++) {
                        c = H[J];
                        r = c.labelPos;
                        z = c.dataLabel;
                        E = c.visible === !1 ? "hidden" : "inherit";
                        c = r[1];
                        if (l > 0) {
                            if (u = L.pop(), F = u.i, A = u.y, c > A && G[F + 1] !== null || c < A && G[F - 1] !== null) A = B(v(0, c), d.plotHeight)
                        } else A = c;
                        y = e.justify ? o[0] + (D ? -1 : 1) * (q + l) : a.getX(A === t - q - l || A === t + q + l ? c : A, D);
                        z._attr = {
                            visibility: E,
                            align: r[6]
                        };
                        z._pos = {
                            x: y + e.x + ({
                                left: f,
                                right: -f
                            }[r[6]] || 0),
                            y: A + e.y - 10
                        };
                        z.connX = y;
                        z.connY = A;
                        if (this.options.size === null) u = z.width, y - u < f ? C[3] = v(w(u -
                            y + f), C[3]) : y + u > h - f && (C[1] = v(w(y + u - h + f), C[1])), A - b / 2 < 0 ? C[0] = v(w(-A + b / 2), C[0]) : A + b / 2 > i && (C[2] = v(w(A + b / 2 - i), C[2]))
                    }
                }
            }
            if (Fa(C) === 0 || this.verifyDataLabelOverflow(C)) this.placeDataLabels(), s && g && n(this.points, function (b) {
                j = b.connector;
                r = b.labelPos;
                if ((z = b.dataLabel) && z._pos) E = z._attr.visibility, y = z.connX, A = z.connY, k = m ? ["M", y + (r[6] === "left" ? 5 : -5), A, "C", y, A, 2 * r[2] - r[4], 2 * r[3] - r[5], r[2], r[3], "L", r[4], r[5]] : ["M", y + (r[6] === "left" ? 5 : -5), A, "L", r[2], r[3], "L", r[4], r[5]], j ? (j.animate({
                        d: k
                    }), j.attr("visibility", E)) :
                    b.connector = j = a.chart.renderer.path(k).attr({
                        "stroke-width": g,
                        stroke: e.connectorColor || b.color || "#606060",
                        visibility: E
                    }).add(a.dataLabelsGroup);
                else if (j) b.connector = j.destroy()
            })
        }
    }, K.pie.prototype.placeDataLabels = function () {
        n(this.points, function (a) {
            var a = a.dataLabel,
                b;
            if (a)(b = a._pos) ? (a.attr(a._attr), a[a.moved ? "animate" : "attr"](b), a.moved = !0) : a && a.attr({
                y: -999
            })
        })
    }, K.pie.prototype.alignDataLabel = ha, K.pie.prototype.verifyDataLabelOverflow = function (a) {
        var b = this.center,
            c = this.options,
            d = c.center,
            e =
            c = c.minSize || 80,
            f;
        d[0] !== null ? e = v(b[2] - v(a[1], a[3]), c) : (e = v(b[2] - a[1] - a[3], c), b[0] += (a[3] - a[1]) / 2);
        d[1] !== null ? e = v(B(e, b[2] - v(a[0], a[2])), c) : (e = v(B(e, b[2] - a[0] - a[2]), c), b[1] += (a[0] - a[2]) / 2);
        e < b[2] ? (b[2] = e, this.translate(b), n(this.points, function (a) {
            if (a.dataLabel) a.dataLabel._pos = null
        }), this.drawDataLabels && this.drawDataLabels()) : f = !0;
        return f
    };
    if (K.column) K.column.prototype.alignDataLabel = function (a, b, c, d, e) {
        var f = this.chart.inverted,
            g = a.series,
            h = a.dlBox || a.shapeArgs,
            i = a.below || a.plotY > p(this.translatedThreshold,
                g.yAxis.len),
            j = p(c.inside, !!this.options.stacking);
        if (h && (d = y(h), f && (d = {
                x: g.yAxis.len - d.y - d.height,
                y: g.xAxis.len - d.x - d.width,
                width: d.height,
                height: d.width
            }), !j)) f ? (d.x += i ? 0 : d.width, d.width = 0) : (d.y += i ? d.height : 0, d.height = 0);
        c.align = p(c.align, !f || j ? "center" : i ? "right" : "left");
        c.verticalAlign = p(c.verticalAlign, f || j ? "middle" : i ? "top" : "bottom");
        O.prototype.alignDataLabel.call(this, a, b, c, d, e)
    };
    (function (a) {
        var b = a.Chart,
            c = a.each,
            d = HighchartsAdapter.addEvent;
        b.prototype.callbacks.push(function (a) {
            function b() {
                var d = [];
                c(a.series, function (a) {
                    var b = a.options.dataLabels;
                    (b.enabled || a._hasPointLabels) && !b.allowOverlap && a.visible && c(a.points, function (a) {
                        if (a.dataLabel) a.dataLabel.labelrank = a.labelrank, d.push(a.dataLabel)
                    })
                });
                a.hideOverlappingLabels(d)
            }
            b();
            d(a, "redraw", b)
        });
        b.prototype.hideOverlappingLabels = function (a) {
            var b = a.length,
                c, d, i, j;
            for (d = 0; d < b; d++)
                if (c = a[d]) c.oldOpacity = c.opacity, c.newOpacity = 1;
            for (d = 0; d < b; d++) {
                i = a[d];
                for (c = d + 1; c < b; ++c)
                    if (j = a[c], i && j && i.placed && j.placed && i.newOpacity !== 0 && j.newOpacity !==
                        0 && !(j.alignAttr.x > i.alignAttr.x + i.width || j.alignAttr.x + j.width < i.alignAttr.x || j.alignAttr.y > i.alignAttr.y + i.height || j.alignAttr.y + j.height < i.alignAttr.y))(i.labelrank < j.labelrank ? i : j).newOpacity = 0
            }
            for (d = 0; d < b; d++)
                if (c = a[d]) {
                    if (c.oldOpacity !== c.newOpacity && c.placed) c.alignAttr.opacity = c.newOpacity, c[c.isOld && c.newOpacity ? "animate" : "attr"](c.alignAttr);
                    c.isOld = !0
                }
        }
    })(A);
    var jb = A.TrackerMixin = {
        drawTrackerPoint: function () {
            var a = this,
                b = a.chart,
                c = b.pointer,
                d = a.options.cursor,
                e = d && {
                    cursor: d
                },
                f = function (a) {
                    for (var c =
                            a.target, d; c && !d;) d = c.point, c = c.parentNode;
                    if (d !== s && d !== b.hoverPoint) d.onMouseOver(a)
                };
            n(a.points, function (a) {
                if (a.graphic) a.graphic.element.point = a;
                if (a.dataLabel) a.dataLabel.element.point = a
            });
            if (!a._hasTracking) n(a.trackerGroups, function (b) {
                if (a[b] && (a[b].addClass("highcharts-tracker").on("mouseover", f).on("mouseout", function (a) {
                        c.onTrackerMouseOut(a)
                    }).css(e), $a)) a[b].on("touchstart", f)
            }), a._hasTracking = !0
        },
        drawTrackerGraph: function () {
            var a = this,
                b = a.options,
                c = b.trackByArea,
                d = [].concat(c ? a.areaPath :
                    a.graphPath),
                e = d.length,
                f = a.chart,
                g = f.pointer,
                h = f.renderer,
                i = f.options.tooltip.snap,
                j = a.tracker,
                k = b.cursor,
                m = k && {
                    cursor: k
                },
                k = a.singlePoints,
                l, o = function () {
                    if (f.hoverSeries !== a) a.onMouseOver()
                },
                q = "rgba(192,192,192," + (ea ? 1.0E-4 : 0.002) + ")";
            if (e && !c)
                for (l = e + 1; l--;) d[l] === "M" && d.splice(l + 1, 0, d[l + 1] - i, d[l + 2], "L"), (l && d[l] === "M" || l === e) && d.splice(l, 0, "L", d[l - 2] + i, d[l - 1]);
            for (l = 0; l < k.length; l++) e = k[l], d.push("M", e.plotX - i, e.plotY, "L", e.plotX + i, e.plotY);
            j ? j.attr({
                d: d
            }) : (a.tracker = h.path(d).attr({
                "stroke-linejoin": "round",
                visibility: a.visible ? "visible" : "hidden",
                stroke: q,
                fill: c ? q : Z,
                "stroke-width": b.lineWidth + (c ? 0 : 2 * i),
                zIndex: 2
            }).add(a.group), n([a.tracker, a.markerGroup], function (a) {
                a.addClass("highcharts-tracker").on("mouseover", o).on("mouseout", function (a) {
                    g.onTrackerMouseOut(a)
                }).css(m);
                if ($a) a.on("touchstart", o)
            }))
        }
    };
    if (K.column) Da.prototype.drawTracker = jb.drawTrackerPoint;
    if (K.pie) K.pie.prototype.drawTracker = jb.drawTrackerPoint;
    if (K.scatter) ya.prototype.drawTracker = jb.drawTrackerPoint;
    x(rb.prototype, {
        setItemEvents: function (a,
            b, c, d, e) {
            var f = this;
            (c ? b : a.legendGroup).on("mouseover", function () {
                a.setState("hover");
                b.css(f.options.itemHoverStyle)
            }).on("mouseout", function () {
                b.css(a.visible ? d : e);
                a.setState()
            }).on("click", function (b) {
                var c = function () {
                        a.setVisible()
                    },
                    b = {
                        browserEvent: b
                    };
                a.firePointEvent ? a.firePointEvent("legendItemClick", b, c) : F(a, "legendItemClick", b, c)
            })
        },
        createCheckboxForItem: function (a) {
            a.checkbox = aa("input", {
                type: "checkbox",
                checked: a.selected,
                defaultChecked: a.selected
            }, this.options.itemCheckboxStyle, this.chart.container);
            E(a.checkbox, "click", function (b) {
                F(a.series || a, "checkboxClick", {
                    checked: b.target.checked,
                    item: a
                }, function () {
                    a.select()
                })
            })
        }
    });
    P.legend.itemStyle.cursor = "pointer";
    x(Pa.prototype, {
        showResetZoom: function () {
            var a = this,
                b = P.lang,
                c = a.options.chart.resetZoomButton,
                d = c.theme,
                e = d.states,
                f = c.relativeTo === "chart" ? null : "plotBox";
            this.resetZoomButton = a.renderer.button(b.resetZoom, null, null, function () {
                a.zoomOut()
            }, d, e && e.hover).attr({
                align: c.position.align,
                title: b.resetZoomTitle
            }).add().align(c.position, !1, f)
        },
        zoomOut: function () {
            var a = this;
            F(a, "selection", {
                resetSelection: !0
            }, function () {
                a.zoom()
            })
        },
        zoom: function (a) {
            var b, c = this.pointer,
                d = !1,
                e;
            !a || a.resetSelection ? n(this.axes, function (a) {
                b = a.zoom()
            }) : n(a.xAxis.concat(a.yAxis), function (a) {
                var e = a.axis,
                    h = e.isXAxis;
                if (c[h ? "zoomX" : "zoomY"] || c[h ? "pinchX" : "pinchY"]) b = e.zoom(a.min, a.max), e.displayBtn && (d = !0)
            });
            e = this.resetZoomButton;
            if (d && !e) this.showResetZoom();
            else if (!d && ia(e)) this.resetZoomButton = e.destroy();
            b && this.redraw(p(this.options.chart.animation, a &&
                a.animation, this.pointCount < 100))
        },
        pan: function (a, b) {
            var c = this,
                d = c.hoverPoints,
                e;
            d && n(d, function (a) {
                a.setState()
            });
            n(b === "xy" ? [1, 0] : [1], function (b) {
                var d = a[b ? "chartX" : "chartY"],
                    h = c[b ? "xAxis" : "yAxis"][0],
                    i = c[b ? "mouseDownX" : "mouseDownY"],
                    j = (h.pointRange || 0) / 2,
                    k = h.getExtremes(),
                    m = h.toValue(i - d, !0) + j,
                    j = h.toValue(i + c[b ? "plotWidth" : "plotHeight"] - d, !0) - j,
                    i = i > d;
                if (h.series.length && (i || m > B(k.dataMin, k.min)) && (!i || j < v(k.dataMax, k.max))) h.setExtremes(m, j, !1, !1, {
                    trigger: "pan"
                }), e = !0;
                c[b ? "mouseDownX" : "mouseDownY"] =
                    d
            });
            e && c.redraw(!1);
            L(c.container, {
                cursor: "move"
            })
        }
    });
    x(Ca.prototype, {
        select: function (a, b) {
            var c = this,
                d = c.series,
                e = d.chart,
                a = p(a, !c.selected);
            c.firePointEvent(a ? "select" : "unselect", {
                accumulate: b
            }, function () {
                c.selected = c.options.selected = a;
                d.options.data[Oa(c, d.data)] = c.options;
                c.setState(a && "select");
                b || n(e.getSelectedPoints(), function (a) {
                    if (a.selected && a !== c) a.selected = a.options.selected = !1, d.options.data[Oa(a, d.data)] = a.options, a.setState(""), a.firePointEvent("unselect")
                })
            })
        },
        onMouseOver: function (a) {
            var b =
                this.series,
                c = b.chart,
                d = c.tooltip,
                e = c.hoverPoint;
            if (c.hoverSeries !== b) b.onMouseOver();
            if (e && e !== this) e.onMouseOut();
            this.firePointEvent("mouseOver");
            d && (!d.shared || b.noSharedTooltip) && d.refresh(this, a);
            this.setState("hover");
            c.hoverPoint = this
        },
        onMouseOut: function () {
            var a = this.series.chart,
                b = a.hoverPoints;
            this.firePointEvent("mouseOut");
            if (!b || Oa(this, b) === -1) this.setState(), a.hoverPoint = null
        },
        importEvents: function () {
            if (!this.hasImportedEvents) {
                var a = y(this.series.options.point, this.options).events,
                    b;
                this.events = a;
                for (b in a) E(this, b, a[b]);
                this.hasImportedEvents = !0
            }
        },
        setState: function (a, b) {
            var c = this.plotX,
                d = this.plotY,
                e = this.series,
                f = e.options.states,
                g = U[e.type].marker && e.options.marker,
                h = g && !g.enabled,
                i = g && g.states[a],
                j = i && i.enabled === !1,
                k = e.stateMarkerGraphic,
                m = this.marker || {},
                l = e.chart,
                o = e.halo,
                q, a = a || "";
            q = this.pointAttr[a] || e.pointAttr[a];
            if (!(a === this.state && !b || this.selected && a !== "select" || f[a] && f[a].enabled === !1 || a && (j || h && i.enabled === !1) || a && m.states && m.states[a] && m.states[a].enabled ===
                    !1)) {
                if (this.graphic) g = g && this.graphic.symbolName && q.r, this.graphic.attr(y(q, g ? {
                    x: c - g,
                    y: d - g,
                    width: 2 * g,
                    height: 2 * g
                } : {})), k && k.hide();
                else {
                    if (a && i)
                        if (g = i.radius, m = m.symbol || e.symbol, k && k.currentSymbol !== m && (k = k.destroy()), k) k[b ? "animate" : "attr"]({
                            x: c - g,
                            y: d - g
                        });
                        else if (m) e.stateMarkerGraphic = k = l.renderer.symbol(m, c - g, d - g, 2 * g, 2 * g).attr(q).add(e.markerGroup), k.currentSymbol = m;
                    if (k) k[a && l.isInsidePlot(c, d, l.inverted) ? "show" : "hide"]()
                }
                if ((c = f[a] && f[a].halo) && c.size) {
                    if (!o) e.halo = o = l.renderer.path().add(l.seriesGroup);
                    o.attr(x({
                        fill: wa(this.color || e.color).setOpacity(c.opacity).get()
                    }, c.attributes))[b ? "animate" : "attr"]({
                        d: this.haloPath(c.size)
                    })
                } else o && o.attr({
                    d: []
                });
                this.state = a
            }
        },
        haloPath: function (a) {
            var b = this.series,
                c = b.chart,
                d = b.getPlotBox(),
                e = c.inverted;
            return c.renderer.symbols.circle(d.translateX + (e ? b.yAxis.len - this.plotY : this.plotX) - a, d.translateY + (e ? b.xAxis.len - this.plotX : this.plotY) - a, a * 2, a * 2)
        }
    });
    x(O.prototype, {
        onMouseOver: function () {
            var a = this.chart,
                b = a.hoverSeries;
            if (b && b !== this) b.onMouseOut();
            this.options.events.mouseOver &&
                F(this, "mouseOver");
            this.setState("hover");
            a.hoverSeries = this
        },
        onMouseOut: function () {
            var a = this.options,
                b = this.chart,
                c = b.tooltip,
                d = b.hoverPoint;
            if (d) d.onMouseOut();
            this && a.events.mouseOut && F(this, "mouseOut");
            c && !a.stickyTracking && (!c.shared || this.noSharedTooltip) && c.hide();
            this.setState();
            b.hoverSeries = null
        },
        setState: function (a) {
            var b = this.options,
                c = this.graph,
                d = b.states,
                e = b.lineWidth,
                b = 0,
                a = a || "";
            if (this.state !== a && (this.state = a, !(d[a] && d[a].enabled === !1) && (a && (e = d[a].lineWidth || e + (d[a].lineWidthPlus ||
                    0)), c && !c.dashstyle))) {
                a = {
                    "stroke-width": e
                };
                for (c.attr(a); this["zoneGraph" + b];) this["zoneGraph" + b].attr(a), b += 1
            }
        },
        setVisible: function (a, b) {
            var c = this,
                d = c.chart,
                e = c.legendItem,
                f, g = d.options.chart.ignoreHiddenSeries,
                h = c.visible;
            f = (c.visible = a = c.userOptions.visible = a === s ? !h : a) ? "show" : "hide";
            n(["group", "dataLabelsGroup", "markerGroup", "tracker"], function (a) {
                if (c[a]) c[a][f]()
            });
            if (d.hoverSeries === c || (d.hoverPoint && d.hoverPoint.series) === c) c.onMouseOut();
            e && d.legend.colorizeItem(c, a);
            c.isDirty = !0;
            c.options.stacking &&
                n(d.series, function (a) {
                    if (a.options.stacking && a.visible) a.isDirty = !0
                });
            n(c.linkedSeries, function (b) {
                b.setVisible(a, !1)
            });
            if (g) d.isDirtyBox = !0;
            b !== !1 && d.redraw();
            F(c, f)
        },
        show: function () {
            this.setVisible(!0)
        },
        hide: function () {
            this.setVisible(!1)
        },
        select: function (a) {
            this.selected = a = a === s ? !this.selected : a;
            if (this.checkbox) this.checkbox.checked = a;
            F(this, a ? "select" : "unselect")
        },
        drawTracker: jb.drawTrackerGraph
    });
    R(O.prototype, "init", function (a) {
        var b;
        a.apply(this, Array.prototype.slice.call(arguments, 1));
        (b =
            this.xAxis) && b.options.ordinal && E(this, "updatedData", function () {
            delete b.ordinalIndex
        })
    });
    R(I.prototype, "getTimeTicks", function (a, b, c, d, e, f, g, h) {
        var i = 0,
            j = 0,
            k, m = {},
            l, o, q, t = [],
            n = -Number.MAX_VALUE,
            p = this.options.tickPixelInterval;
        if (!this.options.ordinal && !this.options.breaks || !f || f.length < 3 || c === s) return a.call(this, b, c, d, e);
        for (o = f.length; j < o; j++) {
            q = j && f[j - 1] > d;
            f[j] < c && (i = j);
            if (j === o - 1 || f[j + 1] - f[j] > g * 5 || q) {
                if (f[j] > n) {
                    for (k = a.call(this, b, f[i], f[j], e); k.length && k[0] <= n;) k.shift();
                    k.length && (n = k[k.length -
                        1]);
                    t = t.concat(k)
                }
                i = j + 1
            }
            if (q) break
        }
        a = k.info;
        if (h && a.unitRange <= H.hour) {
            j = t.length - 1;
            for (i = 1; i < j; i++) ka("%d", t[i]) !== ka("%d", t[i - 1]) && (m[t[i]] = "day", l = !0);
            l && (m[t[0]] = "day");
            a.higherRanks = m
        }
        t.info = a;
        if (h && r(p)) {
            var h = a = t.length,
                j = [],
                u;
            for (l = []; h--;) i = this.translate(t[h]), u && (l[h] = u - i), j[h] = u = i;
            l.sort();
            l = l[W(l.length / 2)];
            l < p * 0.6 && (l = null);
            h = t[a - 1] > d ? a - 1 : a;
            for (u = void 0; h--;) i = j[h], d = u - i, u && d < p * 0.8 && (l === null || d < l * 0.8) ? (m[t[h]] && !m[t[h + 1]] ? (d = h + 1, u = i) : d = h, t.splice(d, 1)) : u = i
        }
        return t
    });
    x(I.prototype, {
        beforeSetTickPositions: function () {
            var a = this,
                b, c = [],
                d = !1,
                e, f = a.getExtremes(),
                g = f.min,
                f = f.max,
                h;
            if (a.options.ordinal || a.options.breaks) {
                n(a.series, function (d, e) {
                    if (d.visible !== !1 && (d.takeOrdinalPosition !== !1 || a.options.breaks))
                        if (c = c.concat(d.processedXData), b = c.length, c.sort(function (a, b) {
                                return a - b
                            }), b)
                            for (e = b - 1; e--;) c[e] === c[e + 1] && c.splice(e, 1)
                });
                b = c.length;
                if (b > 2) {
                    e = c[1] - c[0];
                    for (h = b - 1; h-- && !d;) c[h + 1] - c[h] !== e && (d = !0);
                    if (!a.options.keepOrdinalPadding && (c[0] - g > e || f - c[c.length - 1] > e)) d = !0
                }
                d ? (a.ordinalPositions =
                    c, e = a.val2lin(v(g, c[0]), !0), h = v(a.val2lin(B(f, c[c.length - 1]), !0), 1), a.ordinalSlope = f = (f - g) / (h - e), a.ordinalOffset = g - e * f) : a.ordinalPositions = a.ordinalSlope = a.ordinalOffset = s;
                if (a.options.ordinal) a.doPostTranslate = d
            }
            a.groupIntervalFactor = null
        },
        val2lin: function (a, b) {
            var c = this.ordinalPositions;
            if (c) {
                var d = c.length,
                    e, f;
                for (e = d; e--;)
                    if (c[e] === a) {
                        f = e;
                        break
                    }
                for (e = d - 1; e--;)
                    if (a > c[e] || e === 0) {
                        c = (a - c[e]) / (c[e + 1] - c[e]);
                        f = e + c;
                        break
                    }
                return b ? f : this.ordinalSlope * (f || 0) + this.ordinalOffset
            } else return a
        },
        lin2val: function (a,
            b) {
            var c = this.ordinalPositions;
            if (c) {
                var d = this.ordinalSlope,
                    e = this.ordinalOffset,
                    f = c.length - 1,
                    g, h;
                if (b) a < 0 ? a = c[0] : a > f ? a = c[f] : (f = W(a), h = a - f);
                else
                    for (; f--;)
                        if (g = d * f + e, a >= g) {
                            d = d * (f + 1) + e;
                            h = (a - g) / (d - g);
                            break
                        } return h !== s && c[f] !== s ? c[f] + (h ? h * (c[f + 1] - c[f]) : 0) : a
            } else return a
        },
        getExtendedPositions: function () {
            var a = this.chart,
                b = this.series[0].currentDataGrouping,
                c = this.ordinalIndex,
                d = b ? b.count + b.unitName : "raw",
                e = this.getExtremes(),
                f, g;
            if (!c) c = this.ordinalIndex = {};
            if (!c[d]) f = {
                series: [],
                getExtremes: function () {
                    return {
                        min: e.dataMin,
                        max: e.dataMax
                    }
                },
                options: {
                    ordinal: !0
                },
                val2lin: I.prototype.val2lin
            }, n(this.series, function (c) {
                g = {
                    xAxis: f,
                    xData: c.xData,
                    chart: a,
                    destroyGroupedData: ha
                };
                g.options = {
                    dataGrouping: b ? {
                        enabled: !0,
                        forced: !0,
                        approximation: "open",
                        units: [[b.unitName, [b.count]]]
                    } : {
                        enabled: !1
                    }
                };
                c.processData.apply(g);
                f.series.push(g)
            }), this.beforeSetTickPositions.apply(f), c[d] = f.ordinalPositions;
            return c[d]
        },
        getGroupIntervalFactor: function (a, b, c) {
            var d = 0,
                c = c.processedXData,
                e = c.length,
                f = [],
                g = this.groupIntervalFactor;
            if (!g) {
                for (; d <
                    e - 1; d++) f[d] = c[d + 1] - c[d];
                f.sort(function (a, b) {
                    return a - b
                });
                d = f[W(e / 2)];
                a = v(a, c[0]);
                b = B(b, c[e - 1]);
                this.groupIntervalFactor = g = e * d / (b - a)
            }
            return g
        },
        postProcessTickInterval: function (a) {
            var b = this.ordinalSlope;
            return b ? this.options.breaks ? this.closestPointRange : a / (b / this.closestPointRange) : a
        }
    });
    R(Pa.prototype, "pan", function (a, b) {
        var c = this.xAxis[0],
            d = b.chartX,
            e = !1;
        if (c.options.ordinal && c.series.length) {
            var f = this.mouseDownX,
                g = c.getExtremes(),
                h = g.dataMax,
                i = g.min,
                j = g.max,
                k = this.hoverPoints,
                m = c.closestPointRange,
                f = (f - d) / (c.translationSlope * (c.ordinalSlope || m)),
                l = {
                    ordinalPositions: c.getExtendedPositions()
                },
                m = c.lin2val,
                o = c.val2lin,
                q;
            if (l.ordinalPositions) {
                if (Q(f) > 1) k && n(k, function (a) {
                        a.setState()
                    }), f < 0 ? (k = l, q = c.ordinalPositions ? c : l) : (k = c.ordinalPositions ? c : l, q = l), l = q.ordinalPositions, h > l[l.length - 1] && l.push(h), this.fixedRange = j - i, f = c.toFixedRange(null, null, m.apply(k, [o.apply(k, [i, !0]) + f, !0]), m.apply(q, [o.apply(q, [j, !0]) + f, !0])), f.min >= B(g.dataMin, i) && f.max <= v(h, j) && c.setExtremes(f.min, f.max, !0, !1, {
                        trigger: "pan"
                    }),
                    this.mouseDownX = d, L(this.container, {
                        cursor: "move"
                    })
            } else e = !0
        } else e = !0;
        e && a.apply(this, Array.prototype.slice.call(arguments, 1))
    });
    R(O.prototype, "getSegments", function (a) {
        var b, c = this.options.gapSize,
            d = this.xAxis;
        a.apply(this, Array.prototype.slice.call(arguments, 1));
        if (c) b = this.segments, n(b, function (a, f) {
            for (var g = a.length - 1; g--;) a[g + 1].x - a[g].x > d.closestPointRange * c && b.splice(f + 1, 0, a.splice(g + 1, a.length - g))
        })
    });
    (function (a) {
        function b() {
            return Array.prototype.slice.call(arguments, 1)
        }
        var c = a.pick,
            d = a.wrap,
            e = a.extend,
            f = HighchartsAdapter.fireEvent,
            g = a.Axis,
            h = a.Series;
        e(g.prototype, {
            isInBreak: function (a, b) {
                var c = a.repeat || Infinity,
                    d = a.from,
                    e = a.to - a.from,
                    c = b >= d ? (b - d) % c : c - (d - b) % c;
                return a.inclusive ? c <= e : c < e && c !== 0
            },
            isInAnyBreak: function (a, b) {
                if (!this.options.breaks) return !1;
                for (var d = this.options.breaks, e = d.length, f = !1, g = !1; e--;) this.isInBreak(d[e], a) && (f = !0, g || (g = c(d[e].showPoints, this.isXAxis ? !1 : !0)));
                return f && b ? f && !g : f
            }
        });
        d(g.prototype, "setTickPositions", function (a) {
            a.apply(this, Array.prototype.slice.call(arguments,
                1));
            if (this.options.breaks) {
                var b = this.tickPositions,
                    c = this.tickPositions.info,
                    d = [],
                    e;
                if (!(c && c.totalRange >= this.closestPointRange)) {
                    for (e = 0; e < b.length; e++) this.isInAnyBreak(b[e]) || d.push(b[e]);
                    this.tickPositions = d;
                    this.tickPositions.info = c
                }
            }
        });
        d(g.prototype, "init", function (a, b, c) {
            if (c.breaks && c.breaks.length) c.ordinal = !1;
            a.call(this, b, c);
            if (this.options.breaks) {
                var d = this;
                d.doPostTranslate = !0;
                this.val2lin = function (a) {
                    var b = a,
                        c, e;
                    for (e = 0; e < d.breakArray.length; e++)
                        if (c = d.breakArray[e], c.to <= a) b -= c.len;
                        else if (c.from >= a) break;
                    else if (d.isInBreak(c, a)) {
                        b -= a - c.from;
                        break
                    }
                    return b
                };
                this.lin2val = function (a) {
                    var b, c;
                    for (c = 0; c < d.breakArray.length; c++)
                        if (b = d.breakArray[c], b.from >= a) break;
                        else b.to < a ? a += b.to - b.from : d.isInBreak(b, a) && (a += b.to - b.from);
                    return a
                };
                this.setExtremes = function (a, b, c, d, e) {
                    for (; this.isInAnyBreak(a);) a -= this.closestPointRange;
                    for (; this.isInAnyBreak(b);) b -= this.closestPointRange;
                    g.prototype.setExtremes.call(this, a, b, c, d, e)
                };
                this.setAxisTranslation = function (a) {
                    g.prototype.setAxisTranslation.call(this,
                        a);
                    var b = d.options.breaks,
                        a = [],
                        c = [],
                        e = 0,
                        h, i, j = d.userMin || d.min,
                        k = d.userMax || d.max,
                        n, p;
                    for (p in b) i = b[p], d.isInBreak(i, j) && (j += i.to % i.repeat - j % i.repeat), d.isInBreak(i, k) && (k -= k % i.repeat - i.from % i.repeat);
                    for (p in b) {
                        i = b[p];
                        n = i.from;
                        for (h = i.repeat || Infinity; n - h > j;) n -= h;
                        for (; n < j;) n += h;
                        for (; n < k; n += h) a.push({
                            value: n,
                            move: "in"
                        }), a.push({
                            value: n + (i.to - i.from),
                            move: "out",
                            size: i.breakSize
                        })
                    }
                    a.sort(function (a, b) {
                        return a.value === b.value ? (a.move === "in" ? 0 : 1) - (b.move === "in" ? 0 : 1) : a.value - b.value
                    });
                    b = 0;
                    n = j;
                    for (p in a) {
                        i =
                            a[p];
                        b += i.move === "in" ? 1 : -1;
                        if (b === 1 && i.move === "in") n = i.value;
                        b === 0 && (c.push({
                            from: n,
                            to: i.value,
                            len: i.value - n - (i.size || 0)
                        }), e += i.value - n - (i.size || 0))
                    }
                    d.breakArray = c;
                    f(d, "afterBreaks");
                    d.transA *= (k - d.min) / (k - j - e);
                    d.min = j;
                    d.max = k
                }
            }
        });
        d(h.prototype, "generatePoints", function (a) {
            a.apply(this, b(arguments));
            var c = this.xAxis,
                d = this.yAxis,
                e = this.points,
                f, g = e.length;
            if (c && d && (c.options.breaks || d.options.breaks))
                for (; g--;)
                    if (f = e[g], c.isInAnyBreak(f.x, !0) || d.isInAnyBreak(f.y, !0)) e.splice(g, 1), this.data[g].destroyElements()
        });
        d(a.seriesTypes.column.prototype, "drawPoints", function (a) {
            a.apply(this);
            var a = this.points,
                b = this.yAxis,
                c = b.breakArray || [],
                d, e, g, h, n;
            for (g = 0; g < a.length; g++) {
                d = a[g];
                n = d.stackY || d.y;
                for (h = 0; h < c.length; h++)
                    if (e = c[h], n < e.from) break;
                    else n > e.to ? f(b, "pointBreak", {
                        point: d,
                        brk: e
                    }) : f(b, "pointInBreak", {
                        point: d,
                        brk: e
                    })
            }
        })
    })(A);
    var da = O.prototype,
        N = Kb.prototype,
        ic = da.processData,
        jc = da.generatePoints,
        kc = da.destroy,
        lc = N.tooltipFooterHeaderFormatter,
        mc = {
            approximation: "average",
            groupPixelWidth: 2,
            dateTimeLabelFormats: {
                millisecond: ["%A, %b %e, %H:%M:%S.%L",
"%A, %b %e, %H:%M:%S.%L", "-%H:%M:%S.%L"],
                second: ["%A, %b %e, %H:%M:%S", "%A, %b %e, %H:%M:%S", "-%H:%M:%S"],
                minute: ["%A, %b %e, %H:%M", "%A, %b %e, %H:%M", "-%H:%M"],
                hour: ["%A, %b %e, %H:%M", "%A, %b %e, %H:%M", "-%H:%M"],
                day: ["%A, %b %e, %Y", "%A, %b %e", "-%A, %b %e, %Y"],
                week: ["Week from %A, %b %e, %Y", "%A, %b %e", "-%A, %b %e, %Y"],
                month: ["%B %Y", "%B", "-%B %Y"],
                year: ["%Y", "%Y", "-%Y"]
            }
        },
        Wb = {
            line: {},
            spline: {},
            area: {},
            areaspline: {},
            column: {
                approximation: "sum",
                groupPixelWidth: 10
            },
            arearange: {
                approximation: "range"
            },
            areasplinerange: {
                approximation: "range"
            },
            columnrange: {
                approximation: "range",
                groupPixelWidth: 10
            },
            candlestick: {
                approximation: "ohlc",
                groupPixelWidth: 10
            },
            ohlc: {
                approximation: "ohlc",
                groupPixelWidth: 5
            }
        },
        Xb = [["millisecond", [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]], ["second", [1, 2, 5, 10, 15, 30]], ["minute", [1, 2, 5, 10, 15, 30]], ["hour", [1, 2, 3, 4, 6, 8, 12]], ["day", [1]], ["week", [1]], ["month", [1, 3, 6]], ["year", null]],
        Qa = {
            sum: function (a) {
                var b = a.length,
                    c;
                if (!b && a.hasNulls) c = null;
                else if (b)
                    for (c = 0; b--;) c += a[b];
                return c
            },
            average: function (a) {
                var b =
                    a.length,
                    a = Qa.sum(a);
                typeof a === "number" && b && (a /= b);
                return a
            },
            open: function (a) {
                return a.length ? a[0] : a.hasNulls ? null : s
            },
            high: function (a) {
                return a.length ? Fa(a) : a.hasNulls ? null : s
            },
            low: function (a) {
                return a.length ? Sa(a) : a.hasNulls ? null : s
            },
            close: function (a) {
                return a.length ? a[a.length - 1] : a.hasNulls ? null : s
            },
            ohlc: function (a, b, c, d) {
                a = Qa.open(a);
                b = Qa.high(b);
                c = Qa.low(c);
                d = Qa.close(d);
                if (typeof a === "number" || typeof b === "number" || typeof c === "number" || typeof d === "number") return [a, b, c, d]
            },
            range: function (a, b) {
                a =
                    Qa.low(a);
                b = Qa.high(b);
                if (typeof a === "number" || typeof b === "number") return [a, b]
            }
        };
    da.groupData = function (a, b, c, d) {
        var e = this.data,
            f = this.options.data,
            g = [],
            h = [],
            i = a.length,
            j, k, m = !!b,
            l = [[], [], [], []],
            d = typeof d === "function" ? d : Qa[d],
            o = this.pointArrayMap,
            q = o && o.length,
            n;
        for (n = 0; n <= i; n++)
            if (a[n] >= c[0]) break;
        for (; n <= i; n++) {
            for (; c[1] !== s && a[n] >= c[1] || n === i;)
                if (j = c.shift(), k = d.apply(0, l), k !== s && (g.push(j), h.push(k)), l[0] = [], l[1] = [], l[2] = [], l[3] = [], n === i) break;
            if (n === i) break;
            if (o) {
                j = this.cropStart + n;
                j = e && e[j] ||
                    this.pointClass.prototype.applyOptions.apply({
                        series: this
                    }, [f[j]]);
                var p;
                for (k = 0; k < q; k++)
                    if (p = j[o[k]], typeof p === "number") l[k].push(p);
                    else if (p === null) l[k].hasNulls = !0
            } else if (j = m ? b[n] : null, typeof j === "number") l[0].push(j);
            else if (j === null) l[0].hasNulls = !0
        }
        return [g, h]
    };
    da.processData = function () {
        var a = this.chart,
            b = this.options,
            c = b.dataGrouping,
            d = this.allowDG !== !1 && c && p(c.enabled, a.options._stock),
            e;
        this.forceCrop = d;
        this.groupPixelWidth = null;
        this.hasProcessed = !0;
        if (ic.apply(this, arguments) !== !1 && d) {
            this.destroyGroupedData();
            var f = this.processedXData,
                g = this.processedYData,
                h = a.plotSizeX,
                a = this.xAxis,
                i = a.options.ordinal,
                j = this.groupPixelWidth = a.getGroupPixelWidth && a.getGroupPixelWidth(),
                d = this.pointRange;
            if (j) {
                e = !0;
                this.points = null;
                var k = a.getExtremes(),
                    d = k.min,
                    k = k.max,
                    i = i && a.getGroupIntervalFactor(d, k, this) || 1,
                    h = j * (k - d) / h * i,
                    j = a.getTimeTicks(a.normalizeTimeTickInterval(h, c.units || Xb), d, k, a.options.startOfWeek, f, this.closestPointRange),
                    g = da.groupData.apply(this, [f, g, j, c.approximation]),
                    f = g[0],
                    g = g[1];
                if (c.smoothed) {
                    c = f.length -
                        1;
                    for (f[c] = k; c-- && c > 0;) f[c] += h / 2;
                    f[0] = d
                }
                this.currentDataGrouping = j.info;
                if (b.pointRange === null) this.pointRange = j.info.totalRange;
                this.closestPointRange = j.info.totalRange;
                if (r(f[0]) && f[0] < a.dataMin) {
                    if (a.min === a.dataMin) a.min = f[0];
                    a.dataMin = f[0]
                }
                this.processedXData = f;
                this.processedYData = g
            } else this.currentDataGrouping = null, this.pointRange = d;
            this.hasGroupedData = e
        }
    };
    da.destroyGroupedData = function () {
        var a = this.groupedData;
        n(a || [], function (b, c) {
            b && (a[c] = b.destroy ? b.destroy() : null)
        });
        this.groupedData = null
    };
    da.generatePoints = function () {
        jc.apply(this);
        this.destroyGroupedData();
        this.groupedData = this.hasGroupedData ? this.points : null
    };
    N.tooltipFooterHeaderFormatter = function (a, b) {
        var c = a.series,
            d = c.tooltipOptions,
            e = c.options.dataGrouping,
            f = d.xDateFormat,
            g, h = c.xAxis;
        h && h.options.type === "datetime" && e && sa(a.key) ? (c = c.currentDataGrouping, e = e.dateTimeLabelFormats, c ? (h = e[c.unitName], c.count === 1 ? f = h[0] : (f = h[1], g = h[2])) : !f && e && (f = this.getXDateFormat(a, d, h)), f = ka(f, a.key), g && (f += ka(g, a.key + c.totalRange - 1)), d = d[(b ?
            "footer" : "header") + "Format"].replace("{point.key}", f)) : d = lc.call(this, a, b);
        return d
    };
    da.destroy = function () {
        for (var a = this.groupedData || [], b = a.length; b--;) a[b] && a[b].destroy();
        kc.apply(this)
    };
    R(da, "setOptions", function (a, b) {
        var c = a.call(this, b),
            d = this.type,
            e = this.chart.options.plotOptions,
            f = U[d].dataGrouping;
        if (Wb[d]) f || (f = y(mc, Wb[d])), c.dataGrouping = y(f, e.series && e.series.dataGrouping, e[d].dataGrouping, b.dataGrouping);
        if (this.chart.options._stock) this.requireSorting = !0;
        return c
    });
    R(I.prototype, "setScale",
        function (a) {
            a.call(this);
            n(this.series, function (a) {
                a.hasProcessed = !1
            })
        });
    I.prototype.getGroupPixelWidth = function () {
        var a = this.series,
            b = a.length,
            c, d = 0,
            e = !1,
            f;
        for (c = b; c--;)(f = a[c].options.dataGrouping) && (d = v(d, f.groupPixelWidth));
        for (c = b; c--;)
            if ((f = a[c].options.dataGrouping) && a[c].hasProcessed)
                if (b = (a[c].processedXData || a[c].data).length, a[c].groupPixelWidth || b > this.chart.plotSizeX / d || b && f.forced) e = !0;
        return e ? d : 0
    };
    I.prototype.setDataGrouping = function (a, b) {
        b = p(b, !0);
        a || (a = {
            forced: !1,
            units: null
        });
        this instanceof
        I ? n(this.series, function (b) {
            b.update({
                dataGrouping: a
            }, !1)
        }) : n(this.chart.options.series, function (b) {
            b.dataGrouping = a
        })
    };
    U.ohlc = y(U.column, {
        lineWidth: 1,
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b><br/>Open: {point.open}<br/>High: {point.high}<br/>Low: {point.low}<br/>Close: {point.close}<br/>'
        },
        states: {
            hover: {
                lineWidth: 3
            }
        },
        threshold: null
    });
    N = ja(K.column, {
        type: "ohlc",
        pointArrayMap: ["open", "high", "low", "close"],
        toYData: function (a) {
            return [a.open, a.high, a.low,
a.close]
        },
        pointValKey: "high",
        pointAttrToOptions: {
            stroke: "color",
            "stroke-width": "lineWidth"
        },
        upColorProp: "stroke",
        getAttribs: function () {
            K.column.prototype.getAttribs.apply(this, arguments);
            var a = this.options,
                b = a.states,
                a = a.upColor || this.color,
                c = y(this.pointAttr),
                d = this.upColorProp;
            c[""][d] = a;
            c.hover[d] = b.hover.upColor || a;
            c.select[d] = b.select.upColor || a;
            n(this.points, function (a) {
                if (a.open < a.close && !a.options.color) a.pointAttr = c
            })
        },
        translate: function () {
            var a = this.yAxis;
            K.column.prototype.translate.apply(this);
            n(this.points, function (b) {
                if (b.open !== null) b.plotOpen = a.translate(b.open, 0, 1, 0, 1);
                if (b.close !== null) b.plotClose = a.translate(b.close, 0, 1, 0, 1)
            })
        },
        drawPoints: function () {
            var a = this,
                b = a.chart,
                c, d, e, f, g, h, i, j;
            n(a.points, function (k) {
                if (k.plotY !== s) i = k.graphic, c = k.pointAttr[k.selected ? "selected" : ""] || a.pointAttr[""], f = c["stroke-width"] % 2 / 2, j = w(k.plotX) - f, g = w(k.shapeArgs.width / 2), h = ["M", j, w(k.yBottom), "L", j, w(k.plotY)], k.open !== null && (d = w(k.plotOpen) + f, h.push("M", j, d, "L", j - g, d)), k.close !== null && (e = w(k.plotClose) +
                    f, h.push("M", j, e, "L", j + g, e)), i ? i.attr(c).animate({
                    d: h
                }) : k.graphic = b.renderer.path(h).attr(c).add(a.group)
            })
        },
        animate: null
    });
    K.ohlc = N;
    U.candlestick = y(U.column, {
        lineColor: "black",
        lineWidth: 1,
        states: {
            hover: {
                lineWidth: 2
            }
        },
        tooltip: U.ohlc.tooltip,
        threshold: null,
        upColor: "white"
    });
    N = ja(N, {
        type: "candlestick",
        pointAttrToOptions: {
            fill: "color",
            stroke: "lineColor",
            "stroke-width": "lineWidth"
        },
        upColorProp: "fill",
        getAttribs: function () {
            K.ohlc.prototype.getAttribs.apply(this, arguments);
            var a = this.options,
                b = a.states,
                c = a.upLineColor || a.lineColor,
                d = b.hover.upLineColor || c,
                e = b.select.upLineColor || c;
            n(this.points, function (a) {
                if (a.open < a.close) a.pointAttr[""].stroke = c, a.pointAttr.hover.stroke = d, a.pointAttr.select.stroke = e
            })
        },
        drawPoints: function () {
            var a = this,
                b = a.chart,
                c, d = a.pointAttr[""],
                e, f, g, h, i, j, k, m, l, o, q;
            n(a.points, function (n) {
                l = n.graphic;
                if (n.plotY !== s) c = n.pointAttr[n.selected ? "selected" : ""] || d, k = c["stroke-width"] % 2 / 2, m = w(n.plotX) - k, e = n.plotOpen, f = n.plotClose, g = X.min(e, f), h = X.max(e, f), q = w(n.shapeArgs.width / 2),
                    i = w(g) !== w(n.plotY), j = h !== n.yBottom, g = w(g) + k, h = w(h) + k, o = ["M", m - q, h, "L", m - q, g, "L", m + q, g, "L", m + q, h, "Z", "M", m, g, "L", m, i ? w(n.plotY) : g, "M", m, h, "L", m, j ? w(n.yBottom) : h], l ? l.attr(c).animate({
                        d: o
                    }) : n.graphic = b.renderer.path(o).attr(c).add(a.group).shadow(a.options.shadow)
            })
        }
    });
    K.candlestick = N;
    var sb = na.prototype.symbols;
    U.flags = y(U.column, {
        fillColor: "white",
        lineWidth: 1,
        pointRange: 0,
        shape: "flag",
        stackDistance: 12,
        states: {
            hover: {
                lineColor: "black",
                fillColor: "#FCFFC5"
            }
        },
        style: {
            fontSize: "11px",
            fontWeight: "bold",
            textAlign: "center"
        },
        tooltip: {
            pointFormat: "{point.text}<br/>"
        },
        threshold: null,
        y: -30
    });
    K.flags = ja(K.column, {
        type: "flags",
        sorted: !1,
        noSharedTooltip: !0,
        allowDG: !1,
        takeOrdinalPosition: !1,
        trackerGroups: ["markerGroup"],
        forceCrop: !0,
        init: O.prototype.init,
        pointAttrToOptions: {
            fill: "fillColor",
            stroke: "color",
            "stroke-width": "lineWidth",
            r: "radius"
        },
        translate: function () {
            K.column.prototype.translate.apply(this);
            var a = this.chart,
                b = this.points,
                c = b.length - 1,
                d, e, f = this.options.onSeries,
                f = (d = f && a.get(f)) && d.options.step,
                g = d && d.points,
                h = g && g.length,
                i = this.xAxis,
                j = i.getExtremes(),
                k, m, l;
            if (d && d.visible && h) {
                d = d.currentDataGrouping;
                m = g[h - 1].x + (d ? d.totalRange : 0);
                for (b.sort(function (a, b) {
                        return a.x - b.x
                    }); h-- && b[c];)
                    if (d = b[c], k = g[h], k.x <= d.x && k.plotY !== s) {
                        if (d.x <= m) d.plotY = k.plotY, k.x < d.x && !f && (l = g[h + 1]) && l.plotY !== s && (d.plotY += (d.x - k.x) / (l.x - k.x) * (l.plotY - k.plotY));
                        c--;
                        h++;
                        if (c < 0) break
                    }
            }
            n(b, function (c, d) {
                var f;
                if (c.plotY === s) c.x >= j.min && c.x <= j.max ? c.plotY = a.chartHeight - i.bottom - (i.opposite ? i.height : 0) + i.offset - a.plotTop :
                    c.shapeArgs = {};
                if ((e = b[d - 1]) && e.plotX === c.plotX) {
                    if (e.stackIndex === s) e.stackIndex = 0;
                    f = e.stackIndex + 1
                }
                c.stackIndex = f
            })
        },
        drawPoints: function () {
            var a, b = this.pointAttr[""],
                c = this.points,
                d = this.chart.renderer,
                e, f, g = this.options,
                h = g.y,
                i, j, k, m, l = g.lineWidth % 2 / 2,
                o, n;
            for (j = c.length; j--;)
                if (k = c[j], a = k.plotX > this.xAxis.len, e = k.plotX + (a ? l : -l), m = k.stackIndex, i = k.options.shape || g.shape, f = k.plotY, f !== s && (f = k.plotY + h + l - (m !== s && m * g.stackDistance)), o = m ? s : k.plotX + l, n = m ? s : k.plotY, m = k.graphic, f !== s && e >= 0 && !a) a = k.pointAttr[k.selected ?
                    "select" : ""] || b, m ? m.attr({
                    x: e,
                    y: f,
                    r: a.r,
                    anchorX: o,
                    anchorY: n
                }) : k.graphic = d.label(k.options.title || g.title || "A", e, f, i, o, n, g.useHTML).css(y(g.style, k.style)).attr(a).attr({
                    align: i === "flag" ? "left" : "center",
                    width: g.width,
                    height: g.height
                }).add(this.markerGroup).shadow(g.shadow), k.tooltipPos = [e, f];
                else if (m) k.graphic = m.destroy()
        },
        drawTracker: function () {
            var a = this.points;
            jb.drawTrackerPoint.apply(this);
            n(a, function (b) {
                var c = b.graphic;
                c && E(c.element, "mouseover", function () {
                    if (b.stackIndex > 0 && !b.raised) b._y =
                        c.y, c.attr({
                            y: b._y - 8
                        }), b.raised = !0;
                    n(a, function (a) {
                        if (a !== b && a.raised && a.graphic) a.graphic.attr({
                            y: a._y
                        }), a.raised = !1
                    })
                })
            })
        },
        animate: ha,
        buildKDTree: ha,
        setClip: ha
    });
    sb.flag = function (a, b, c, d, e) {
        var f = e && e.anchorX || a,
            e = e && e.anchorY || b;
        return ["M", f, e, "L", a, b + d, a, b, a + c, b, a + c, b + d, a, b + d, "M", f, e, "Z"]
    };
    n(["circle", "square"], function (a) {
        sb[a + "pin"] = function (b, c, d, e, f) {
            var g = f && f.anchorX,
                f = f && f.anchorY,
                b = sb[a](b, c, d, e);
            g && f && b.push("M", g, c > f ? c : c + e, "L", g, f);
            return b
        }
    });
    Wa === A.VMLRenderer && n(["flag", "circlepin",
"squarepin"], function (a) {
        ib.prototype.symbols[a] = sb[a]
    });
    var N = [].concat(Xb),
        tb = function (a) {
            var b = hb(arguments, function (a) {
                return typeof a === "number"
            });
            if (b.length) return Math[a].apply(0, b)
        };
    N[4] = ["day", [1, 2, 3, 4]];
    N[5] = ["week", [1, 2, 3]];
    x(P, {
        navigator: {
            handles: {
                backgroundColor: "#ebe7e8",
                borderColor: "#b2b1b6"
            },
            height: 40,
            margin: 25,
            maskFill: "rgba(128,179,236,0.3)",
            maskInside: !0,
            outlineColor: "#b2b1b6",
            outlineWidth: 1,
            series: {
                type: K.areaspline === s ? "line" : "areaspline",
                color: "#4572A7",
                compare: null,
                fillOpacity: 0.05,
                dataGrouping: {
                    approximation: "average",
                    enabled: !0,
                    groupPixelWidth: 2,
                    smoothed: !0,
                    units: N
                },
                dataLabels: {
                    enabled: !1,
                    zIndex: 2
                },
                id: "highcharts-navigator-series",
                lineColor: "#4572A7",
                lineWidth: 1,
                marker: {
                    enabled: !1
                },
                pointRange: 0,
                shadow: !1,
                threshold: null
            },
            xAxis: {
                tickWidth: 0,
                lineWidth: 0,
                gridLineColor: "#EEE",
                gridLineWidth: 1,
                tickPixelInterval: 200,
                labels: {
                    align: "left",
                    style: {
                        color: "#888"
                    },
                    x: 3,
                    y: -4
                },
                crosshair: !1
            },
            yAxis: {
                gridLineWidth: 0,
                startOnTick: !1,
                endOnTick: !1,
                minPadding: 0.1,
                maxPadding: 0.1,
                labels: {
                    enabled: !1
                },
                crosshair: !1,
                title: {
                    text: null
                },
                tickWidth: 0
            }
        },
        scrollbar: {
            height: fb ? 20 : 14,
            barBackgroundColor: "#bfc8d1",
            barBorderRadius: 0,
            barBorderWidth: 1,
            barBorderColor: "#bfc8d1",
            buttonArrowColor: "#666",
            buttonBackgroundColor: "#ebe7e8",
            buttonBorderColor: "#bbb",
            buttonBorderRadius: 0,
            buttonBorderWidth: 1,
            minWidth: 6,
            rifleColor: "#666",
            trackBackgroundColor: "#eeeeee",
            trackBorderColor: "#eeeeee",
            trackBorderWidth: 1,
            liveRedraw: ea && !fb
        }
    });
    Eb.prototype = {
        drawHandle: function (a, b) {
            var c = this.chart,
                d = c.renderer,
                e = this.elementsToDestroy,
                f = this.handles,
                g = this.navigatorOptions.handles,
                g = {
                    fill: g.backgroundColor,
                    stroke: g.borderColor,
                    "stroke-width": 1
                },
                h;
            this.rendered || (f[b] = d.g("navigator-handle-" + ["left", "right"][b]).css({
                cursor: "ew-resize"
            }).attr({
                zIndex: 4 - b
            }).add(), h = d.rect(-4.5, 0, 9, 16, 0, 1).attr(g).add(f[b]), e.push(h), h = d.path(["M", -1.5, 4, "L", -1.5, 12, "M", 0.5, 4, "L", 0.5, 12]).attr(g).add(f[b]), e.push(h));
            f[b][c.isResizing ? "animate" : "attr"]({
                translateX: this.scrollerLeft + this.scrollbarHeight + parseInt(a, 10),
                translateY: this.top + this.height /
                    2 - 8
            })
        },
        drawScrollbarButton: function (a) {
            var b = this.chart.renderer,
                c = this.elementsToDestroy,
                d = this.scrollbarButtons,
                e = this.scrollbarHeight,
                f = this.scrollbarOptions,
                g;
            this.rendered || (d[a] = b.g().add(this.scrollbarGroup), g = b.rect(-0.5, -0.5, e + 1, e + 1, f.buttonBorderRadius, f.buttonBorderWidth).attr({
                    stroke: f.buttonBorderColor,
                    "stroke-width": f.buttonBorderWidth,
                    fill: f.buttonBackgroundColor
                }).add(d[a]), c.push(g), g = b.path(["M", e / 2 + (a ? -1 : 1), e / 2 - 3, "L", e / 2 + (a ? -1 : 1), e / 2 + 3, e / 2 + (a ? 2 : -2), e / 2]).attr({
                    fill: f.buttonArrowColor
                }).add(d[a]),
                c.push(g));
            a && d[a].attr({
                translateX: this.scrollerWidth - e
            })
        },
        render: function (a, b, c, d) {
            var e = this.chart,
                f = e.renderer,
                g, h, i, j, k = this.scrollbarGroup,
                m = this.navigatorGroup,
                l = this.scrollbar,
                m = this.xAxis,
                o = this.scrollbarTrack,
                n = this.scrollbarHeight,
                t = this.scrollbarEnabled,
                r = this.navigatorOptions,
                s = this.scrollbarOptions,
                u = s.minWidth,
                x = this.height,
                y = this.top,
                A = this.navigatorEnabled,
                E = r.outlineWidth,
                C = E / 2,
                D = 0,
                J = this.outlineHeight,
                H = s.barBorderRadius,
                G = s.barBorderWidth,
                F = y + C,
                I;
            if (!isNaN(a)) {
                this.navigatorLeft =
                    g = p(m.left, e.plotLeft + n);
                this.navigatorWidth = h = p(m.len, e.plotWidth - 2 * n);
                this.scrollerLeft = i = g - n;
                this.scrollerWidth = j = j = h + 2 * n;
                m.getExtremes && (I = this.getUnionExtremes(!0)) && (I.dataMin !== m.min || I.dataMax !== m.max) && m.setExtremes(I.dataMin, I.dataMax, !0, !1);
                c = p(c, m.translate(a));
                d = p(d, m.translate(b));
                if (isNaN(c) || Q(c) === Infinity) c = 0, d = j;
                if (!(m.translate(d, !0) - m.translate(c, !0) < e.xAxis[0].minRange)) {
                    this.zoomedMax = B(v(c, d), h);
                    this.zoomedMin = v(this.fixedWidth ? this.zoomedMax - this.fixedWidth : B(c, d), 0);
                    this.range =
                        this.zoomedMax - this.zoomedMin;
                    c = w(this.zoomedMax);
                    b = w(this.zoomedMin);
                    a = c - b;
                    if (!this.rendered) {
                        if (A) this.navigatorGroup = m = f.g("navigator").attr({
                            zIndex: 3
                        }).add(), this.leftShade = f.rect().attr({
                            fill: r.maskFill
                        }).add(m), r.maskInside ? this.leftShade.css({
                            cursor: "ew-resize "
                        }) : this.rightShade = f.rect().attr({
                            fill: r.maskFill
                        }).add(m), this.outline = f.path().attr({
                            "stroke-width": E,
                            stroke: r.outlineColor
                        }).add(m);
                        if (t) this.scrollbarGroup = k = f.g("scrollbar").add(), l = s.trackBorderWidth, this.scrollbarTrack = o = f.rect().attr({
                            x: 0,
                            y: -l % 2 / 2,
                            fill: s.trackBackgroundColor,
                            stroke: s.trackBorderColor,
                            "stroke-width": l,
                            r: s.trackBorderRadius || 0,
                            height: n
                        }).add(k), this.scrollbar = l = f.rect().attr({
                            y: -G % 2 / 2,
                            height: n,
                            fill: s.barBackgroundColor,
                            stroke: s.barBorderColor,
                            "stroke-width": G,
                            r: H
                        }).add(k), this.scrollbarRifles = f.path().attr({
                            stroke: s.rifleColor,
                            "stroke-width": 1
                        }).add(k)
                    }
                    e = e.isResizing ? "animate" : "attr";
                    if (A) {
                        this.leftShade[e](r.maskInside ? {
                            x: g + b,
                            y: y,
                            width: c - b,
                            height: x
                        } : {
                            x: g,
                            y: y,
                            width: b,
                            height: x
                        });
                        if (this.rightShade) this.rightShade[e]({
                            x: g +
                                c,
                            y: y,
                            width: h - c,
                            height: x
                        });
                        this.outline[e]({
                            d: ["M", i, F, "L", g + b - C, F, g + b - C, F + J, "L", g + c - C, F + J, "L", g + c - C, F, i + j, F].concat(r.maskInside ? ["M", g + b + C, F, "L", g + c - C, F] : [])
                        });
                        this.drawHandle(b + C, 0);
                        this.drawHandle(c + C, 1)
                    }
                    if (t && k) this.drawScrollbarButton(0), this.drawScrollbarButton(1), k[e]({
                        translateX: i,
                        translateY: w(F + x)
                    }), o[e]({
                        width: j
                    }), g = n + b, h = a - G, h < u && (D = (u - h) / 2, h = u, g -= D), this.scrollbarPad = D, l[e]({
                        x: W(g) + G % 2 / 2,
                        width: h
                    }), u = n + b + a / 2 - 0.5, this.scrollbarRifles.attr({
                        visibility: a > 12 ? "visible" : "hidden"
                    })[e]({
                        d: ["M",
u - 3, n / 4, "L", u - 3, 2 * n / 3, "M", u, n / 4, "L", u, 2 * n / 3, "M", u + 3, n / 4, "L", u + 3, 2 * n / 3]
                    });
                    this.scrollbarPad = D;
                    this.rendered = !0
                }
            }
        },
        addEvents: function () {
            var a = this.chart.container,
                b = this.mouseDownHandler,
                c = this.mouseMoveHandler,
                d = this.mouseUpHandler,
                e;
            e = [[a, "mousedown", b], [a, "mousemove", c], [document, "mouseup", d]];
            $a && e.push([a, "touchstart", b], [a, "touchmove", c], [document, "touchend", d]);
            n(e, function (a) {
                E.apply(null, a)
            });
            this._events = e
        },
        removeEvents: function () {
            n(this._events, function (a) {
                T.apply(null, a)
            });
            this._events =
                s;
            this.navigatorEnabled && this.baseSeries && T(this.baseSeries, "updatedData", this.updatedDataHandler)
        },
        init: function () {
            var a = this,
                b = a.chart,
                c, d, e = a.scrollbarHeight,
                f = a.navigatorOptions,
                g = a.height,
                h = a.top,
                i, j, k = a.baseSeries;
            a.mouseDownHandler = function (d) {
                var d = b.pointer.normalize(d),
                    e = a.zoomedMin,
                    f = a.zoomedMax,
                    h = a.top,
                    j = a.scrollbarHeight,
                    k = a.scrollerLeft,
                    m = a.scrollerWidth,
                    l = a.navigatorLeft,
                    n = a.navigatorWidth,
                    p = a.scrollbarPad,
                    r = a.range,
                    s = d.chartX,
                    v = d.chartY,
                    d = b.xAxis[0],
                    w, x = fb ? 10 : 7;
                if (v > h && v < h + g + j)
                    if ((h = !a.scrollbarEnabled || v < h + g) && X.abs(s - e - l) < x) a.grabbedLeft = !0, a.otherHandlePos = f, a.fixedExtreme = d.max, b.fixedRange = null;
                    else if (h && X.abs(s - f - l) < x) a.grabbedRight = !0, a.otherHandlePos = e, a.fixedExtreme = d.min, b.fixedRange = null;
                else if (s > l + e - p && s < l + f + p) a.grabbedCenter = s, a.fixedWidth = r, i = s - e;
                else if (s > k && s < k + m) {
                    f = h ? s - l - r / 2 : s < l ? e - r * 0.2 : s > k + m - j ? e + r * 0.2 : s < l + e ? e - r : f;
                    if (f < 0) f = 0;
                    else if (f + r >= n) f = n - r, w = a.getUnionExtremes().dataMax;
                    if (f !== e) a.fixedWidth = r, e = c.toFixedRange(f, f + r, null, w), d.setExtremes(e.min, e.max, !0, !1, {
                        trigger: "navigator"
                    })
                }
            };
            a.mouseMoveHandler = function (c) {
                var d = a.scrollbarHeight,
                    e = a.navigatorLeft,
                    f = a.navigatorWidth,
                    g = a.scrollerLeft,
                    h = a.scrollerWidth,
                    k = a.range,
                    l;
                if (c.pageX !== 0) c = b.pointer.normalize(c), l = c.chartX, l < e ? l = e : l > g + h - d && (l = g + h - d), a.grabbedLeft ? (j = !0, a.render(0, 0, l - e, a.otherHandlePos)) : a.grabbedRight ? (j = !0, a.render(0, 0, a.otherHandlePos, l - e)) : a.grabbedCenter && (j = !0, l < i ? l = i : l > f + i - k && (l = f + i - k), a.render(0, 0, l - i, l - i + k)), j && a.scrollbarOptions.liveRedraw && setTimeout(function () {
                        a.mouseUpHandler(c)
                    },
                    0)
            };
            a.mouseUpHandler = function (d) {
                var e, f;
                if (j) {
                    if (a.zoomedMin === a.otherHandlePos) e = a.fixedExtreme;
                    else if (a.zoomedMax === a.otherHandlePos) f = a.fixedExtreme;
                    e = c.toFixedRange(a.zoomedMin, a.zoomedMax, e, f);
                    b.xAxis[0].setExtremes(e.min, e.max, !0, !1, {
                        trigger: "navigator",
                        triggerOp: "navigator-drag",
                        DOMEvent: d
                    })
                }
                if (d.type !== "mousemove") a.grabbedLeft = a.grabbedRight = a.grabbedCenter = a.fixedWidth = a.fixedExtreme = a.otherHandlePos = j = i = null
            };
            var m = b.xAxis.length,
                l = b.yAxis.length;
            b.extraBottomMargin = a.outlineHeight + f.margin;
            a.navigatorEnabled ? (a.xAxis = c = new I(b, y({
                breaks: k && k.xAxis.options.breaks,
                ordinal: k && k.xAxis.options.ordinal
            }, f.xAxis, {
                id: "navigator-x-axis",
                isX: !0,
                type: "datetime",
                index: m,
                height: g,
                offset: 0,
                offsetLeft: e,
                offsetRight: -e,
                keepOrdinalPadding: !0,
                startOnTick: !1,
                endOnTick: !1,
                minPadding: 0,
                maxPadding: 0,
                zoomEnabled: !1
            })), a.yAxis = d = new I(b, y(f.yAxis, {
                id: "navigator-y-axis",
                alignTicks: !1,
                height: g,
                offset: 0,
                index: l,
                zoomEnabled: !1
            })), k || f.series.data ? a.addBaseSeries() : b.series.length === 0 && R(b, "redraw", function (c,
                d) {
                if (b.series.length > 0 && !a.series) a.setBaseSeries(), b.redraw = c;
                c.call(b, d)
            })) : a.xAxis = c = {
                translate: function (a, c) {
                    var d = b.xAxis[0],
                        f = d.getExtremes(),
                        g = b.plotWidth - 2 * e,
                        h = tb("min", d.options.min, f.dataMin),
                        d = tb("max", d.options.max, f.dataMax) - h;
                    return c ? a * d / g + h : g * (a - h) / d
                },
                toFixedRange: I.prototype.toFixedRange
            };
            R(b, "getMargins", function (b) {
                var e = this.legend,
                    f = e.options;
                b.apply(this, [].slice.call(arguments, 1));
                a.top = h = a.navigatorOptions.top || this.chartHeight - a.height - a.scrollbarHeight - this.spacing[2] - (f.verticalAlign ===
                    "bottom" && f.enabled && !f.floating ? e.legendHeight + p(f.margin, 10) : 0);
                if (c && d) c.options.top = d.options.top = h, c.setAxisSize(), d.setAxisSize()
            });
            a.addEvents()
        },
        getUnionExtremes: function (a) {
            var b = this.chart.xAxis[0],
                c = this.xAxis,
                d = c.options,
                e = b.options,
                f;
            if (!a || b.dataMin !== null) f = {
                dataMin: p(d && d.min, tb("min", e.min, b.dataMin, c.dataMin)),
                dataMax: p(d && d.max, tb("max", e.max, b.dataMax, c.dataMax))
            };
            return f
        },
        setBaseSeries: function (a) {
            var b = this.chart,
                a = a || b.options.navigator.baseSeries;
            this.series && this.series.remove();
            this.baseSeries = b.series[a] || typeof a === "string" && b.get(a) || b.series[0];
            this.xAxis && this.addBaseSeries()
        },
        addBaseSeries: function () {
            var a = this.baseSeries,
                b = a ? a.options : {},
                c = b.data,
                d = this.navigatorOptions.series,
                e;
            e = d.data;
            this.hasNavigatorData = !!e;
            b = y(b, d, {
                enableMouseTracking: !1,
                group: "nav",
                padXAxis: !1,
                xAxis: "navigator-x-axis",
                yAxis: "navigator-y-axis",
                name: "Navigator",
                showInLegend: !1,
                isInternal: !0,
                visible: !0
            });
            b.data = e || c;
            this.series = this.chart.initSeries(b);
            if (a && this.navigatorOptions.adaptToUpdatedData !==
                !1) E(a, "updatedData", this.updatedDataHandler), a.userOptions.events = x(a.userOptions.event, {
                updatedData: this.updatedDataHandler
            })
        },
        updatedDataHandler: function () {
            var a = this.chart.scroller,
                b = a.baseSeries,
                c = b.xAxis,
                d = c.getExtremes(),
                e = d.min,
                f = d.max,
                g = d.dataMin,
                d = d.dataMax,
                h = f - e,
                i, j, k, m, l, n = a.series;
            i = n.xData;
            var p = !!c.setExtremes;
            j = f >= i[i.length - 1] - (this.closestPointRange || 0);
            i = e <= g;
            if (!a.hasNavigatorData) n.options.pointStart = b.xData[0], n.setData(b.options.data, !1), l = !0;
            i && (m = g, k = m + h);
            j && (k = d, i || (m = v(k -
                h, n.xData[0])));
            p && (i || j) ? isNaN(m) || c.setExtremes(m, k, !0, !1, {
                trigger: "updatedData"
            }) : (l && this.chart.redraw(!1), a.render(v(e, g), B(f, d)))
        },
        destroy: function () {
            this.removeEvents();
            n([this.xAxis, this.yAxis, this.leftShade, this.rightShade, this.outline, this.scrollbarTrack, this.scrollbarRifles, this.scrollbarGroup, this.scrollbar], function (a) {
                a && a.destroy && a.destroy()
            });
            this.xAxis = this.yAxis = this.leftShade = this.rightShade = this.outline = this.scrollbarTrack = this.scrollbarRifles = this.scrollbarGroup = this.scrollbar =
                null;
            n([this.scrollbarButtons, this.handles, this.elementsToDestroy], function (a) {
                Na(a)
            })
        }
    };
    A.Scroller = Eb;
    R(I.prototype, "zoom", function (a, b, c) {
        var d = this.chart,
            e = d.options,
            f = e.chart.zoomType,
            g = e.navigator,
            e = e.rangeSelector,
            h;
        if (this.isXAxis && (g && g.enabled || e && e.enabled))
            if (f === "x") d.resetZoomButton = "blocked";
            else if (f === "y") h = !1;
        else if (f === "xy") d = this.previousZoom, r(b) ? this.previousZoom = [this.min, this.max] : d && (b = d[0], c = d[1], delete this.previousZoom);
        return h !== s ? h : a.call(this, b, c)
    });
    R(Pa.prototype,
        "init",
        function (a, b, c) {
            E(this, "beforeRender", function () {
                var a = this.options;
                if (a.navigator.enabled || a.scrollbar.enabled) this.scroller = new Eb(this)
            });
            a.call(this, b, c)
        });
    R(O.prototype, "addPoint", function (a, b, c, d, e) {
        var f = this.options.turboThreshold;
        f && this.xData.length > f && ia(b) && !Ka(b) && this.chart.scroller && qa(20, !0);
        a.call(this, b, c, d, e)
    });
    x(P, {
        rangeSelector: {
            buttonTheme: {
                width: 28,
                height: 18,
                fill: "#f7f7f7",
                padding: 2,
                r: 0,
                "stroke-width": 0,
                style: {
                    color: "#444",
                    cursor: "pointer",
                    fontWeight: "normal"
                },
                zIndex: 7,
                states: {
                    hover: {
                        fill: "#e7e7e7"
                    },
                    select: {
                        fill: "#e7f0f9",
                        style: {
                            color: "black",
                            fontWeight: "bold"
                        }
                    }
                }
            },
            inputPosition: {
                align: "right"
            },
            labelStyle: {
                color: "#666"
            }
        }
    });
    P.lang = y(P.lang, {
        rangeSelectorZoom: "Zoom",
        rangeSelectorFrom: "From",
        rangeSelectorTo: "To"
    });
    Fb.prototype = {
        clickButton: function (a, b) {
            var c = this,
                d = c.selected,
                e = c.chart,
                f = c.buttons,
                g = c.buttonOptions[a],
                h = e.xAxis[0],
                i = e.scroller && e.scroller.getUnionExtremes() || h || {},
                j = i.dataMin,
                k = i.dataMax,
                m, l = h && w(B(h.max, p(k, h.max))),
                o = new fa(l),
                q = g.type,
                t = g.count,
                i = g._range,
                r, x = g.dataGrouping;
            if (!(j === null || k === null || a === c.selected)) {
                if (x) this.forcedDataGrouping = !0, I.prototype.setDataGrouping.call(h || {
                    chart: this.chart
                }, x, !1);
                if (q === "month" || q === "year") m = {
                    month: "Month",
                    year: "FullYear"
                }[q], o["set" + m](o["get" + m]() - t), m = o.getTime(), j = p(j, Number.MIN_VALUE), isNaN(m) || m < j ? (m = j, l = B(m + i, k)) : i = l - m;
                else if (i) m = v(l - i, j), l = B(m + i, k);
                else if (q === "ytd")
                    if (h) {
                        if (k === s) j = Number.MAX_VALUE, k = Number.MIN_VALUE, n(e.series, function (a) {
                                a = a.xData;
                                j = B(a[0], j);
                                k = v(a[a.length - 1], k)
                            }),
                            b = !1;
                        l = new fa(k);
                        r = l.getFullYear();
                        m = r = v(j || 0, fa.UTC(r, 0, 1));
                        l = l.getTime();
                        l = B(k || l, l)
                    } else {
                        E(e, "beforeRender", function () {
                            c.clickButton(a)
                        });
                        return
                    } else q === "all" && h && (m = j, l = k);
                f[d] && f[d].setState(0);
                f[a] && f[a].setState(2);
                e.fixedRange = i;
                h ? h.setExtremes(m, l, p(b, 1), 0, {
                    trigger: "rangeSelectorButton",
                    rangeSelectorButton: g
                }) : (d = e.options.xAxis, d[0] = y(d[0], {
                    range: i,
                    min: r
                }));
                c.setSelected(a)
            }
        },
        setSelected: function (a) {
            this.selected = this.options.selected = a
        },
        defaultButtons: [{
                type: "month",
                count: 1,
                text: "1m"
            },
            {
                type: "month",
                count: 3,
                text: "3m"
            }, {
                type: "month",
                count: 6,
                text: "6m"
            }, {
                type: "ytd",
                text: "YTD"
            }, {
                type: "year",
                count: 1,
                text: "1y"
            }, {
                type: "all",
                text: "All"
            }],
        init: function (a) {
            var b = this,
                c = a.options.rangeSelector,
                d = c.buttons || [].concat(b.defaultButtons),
                e = c.selected,
                f = b.blurInputs = function () {
                    var a = b.minInput,
                        c = b.maxInput;
                    a && a.blur && F(a, "blur");
                    c && c.blur && F(c, "blur")
                };
            b.chart = a;
            b.options = c;
            b.buttons = [];
            a.extraTopMargin = 35;
            b.buttonOptions = d;
            E(a.container, "mousedown", f);
            E(a, "resize", f);
            n(d, b.computeButtonRange);
            e !== s && d[e] && this.clickButton(e, !1);
            E(a, "load", function () {
                E(a.xAxis[0], "setExtremes", function (c) {
                    this.max - this.min !== a.fixedRange && c.trigger !== "rangeSelectorButton" && c.trigger !== "updatedData" && b.forcedDataGrouping && this.setDataGrouping(!1, !1)
                });
                E(a.xAxis[0], "afterSetExtremes", function () {
                    b.updateButtonStates(!0)
                })
            })
        },
        updateButtonStates: function (a) {
            var b = this,
                c = this.chart,
                d = c.xAxis[0],
                e = c.scroller && c.scroller.getUnionExtremes() || d,
                f = e.dataMin,
                g = e.dataMax,
                h = b.selected,
                i = b.options.allButtonsEnabled,
                j =
                b.buttons;
            a && c.fixedRange !== w(d.max - d.min) && (j[h] && j[h].setState(0), b.setSelected(null));
            n(b.buttonOptions, function (a, c) {
                var e = a._range,
                    n = e > g - f,
                    p = e < d.minRange,
                    r = a.type === "all" && d.max - d.min >= g - f && j[c].state !== 2,
                    s = a.type === "ytd" && ka("%Y", f) === ka("%Y", g);
                e === w(d.max - d.min) && c !== h ? (b.setSelected(c), j[c].setState(2)) : !i && (n || p || r || s) ? j[c].setState(3) : j[c].state === 3 && j[c].setState(0)
            })
        },
        computeButtonRange: function (a) {
            var b = a.type,
                c = a.count || 1,
                d = {
                    millisecond: 1,
                    second: 1E3,
                    minute: 6E4,
                    hour: 36E5,
                    day: 864E5,
                    week: 6048E5
                };
            if (d[b]) a._range = d[b] * c;
            else if (b === "month" || b === "year") a._range = {
                month: 30,
                year: 365
            }[b] * 864E5 * c
        },
        setInputValue: function (a, b) {
            var c = this.chart.options.rangeSelector;
            if (r(b)) this[a + "Input"].HCTime = b;
            this[a + "Input"].value = ka(c.inputEditDateFormat || "%Y-%m-%d", this[a + "Input"].HCTime);
            this[a + "DateBox"].attr({
                text: ka(c.inputDateFormat || "%b %e, %Y", this[a + "Input"].HCTime)
            })
        },
        showInput: function (a) {
            var b = this.inputGroup,
                c = this[a + "DateBox"];
            L(this[a + "Input"], {
                left: b.translateX + c.x + "px",
                top: b.translateY + "px",
                width: c.width - 2 + "px",
                height: c.height - 2 + "px",
                border: "2px solid silver"
            })
        },
        hideInput: function (a) {
            document.activeElement === this[a + "Input"] && (L(this[a + "Input"], {
                border: 0,
                width: "1px",
                height: "1px"
            }), this.setInputValue(a))
        },
        drawInput: function (a) {
            var b = this,
                c = b.chart,
                d = c.renderer.style,
                e = c.renderer,
                f = c.options.rangeSelector,
                g = b.div,
                h = a === "min",
                i, j, k = this.inputGroup;
            this[a + "Label"] = j = e.label(P.lang[h ? "rangeSelectorFrom" : "rangeSelectorTo"], this.inputGroup.offset).attr({
                padding: 2
            }).css(y(d, f.labelStyle)).add(k);
            k.offset += j.width + 5;
            this[a + "DateBox"] = e = e.label("", k.offset).attr({
                padding: 2,
                width: f.inputBoxWidth || 90,
                height: f.inputBoxHeight || 17,
                stroke: f.inputBoxBorderColor || "silver",
                "stroke-width": 1
            }).css(y({
                textAlign: "center",
                color: "#444"
            }, d, f.inputStyle)).on("click", function () {
                b.showInput(a);
                b[a + "Input"].focus()
            }).add(k);
            k.offset += e.width + (h ? 10 : 0);
            this[a + "Input"] = i = aa("input", {
                name: a,
                className: "highcharts-range-selector",
                type: "text"
            }, x({
                position: "absolute",
                border: 0,
                width: "1px",
                height: "1px",
                padding: 0,
                textAlign: "center",
                fontSize: d.fontSize,
                fontFamily: d.fontFamily,
                top: c.plotTop + "px"
            }, f.inputStyle), g);
            i.onfocus = function () {
                b.showInput(a)
            };
            i.onblur = function () {
                b.hideInput(a)
            };
            i.onchange = function () {
                var a = i.value,
                    d = (f.inputDateParser || fa.parse)(a),
                    e = c.xAxis[0],
                    g = e.dataMin,
                    j = e.dataMax;
                isNaN(d) && (d = a.split("-"), d = fa.UTC(C(d[0]), C(d[1]) - 1, C(d[2])));
                isNaN(d) || (P.global.useUTC || (d += (new fa).getTimezoneOffset() * 6E4), h ? d > b.maxInput.HCTime ? d = s : d < g && (d = g) : d < b.minInput.HCTime ? d = s : d > j && (d = j), d !== s && c.xAxis[0].setExtremes(h ? d : e.min,
                    h ? e.max : d, s, s, {
                        trigger: "rangeSelectorInput"
                    }))
            }
        },
        render: function (a, b) {
            var c = this,
                d = c.chart,
                e = d.renderer,
                f = d.container,
                g = d.options,
                h = g.exporting && g.navigation && g.navigation.buttonOptions,
                i = g.rangeSelector,
                j = c.buttons,
                k = P.lang,
                g = c.div,
                g = c.inputGroup,
                m = i.buttonTheme,
                l = i.buttonPosition || {},
                o = i.inputEnabled,
                q = m && m.states,
                t = d.plotLeft,
                s, v, u = c.group;
            if (!c.rendered && (c.group = u = e.g("range-selector-buttons").add(), c.zoomText = e.text(k.rangeSelectorZoom, p(l.x, t), p(l.y, d.plotTop - 35) + 15).css(i.labelStyle).add(u),
                    s = p(l.x, t) + c.zoomText.getBBox().width + 5, v = p(l.y, d.plotTop - 35), n(c.buttonOptions, function (a, b) {
                        j[b] = e.button(a.text, s, v, function () {
                            c.clickButton(b);
                            c.isActive = !0
                        }, m, q && q.hover, q && q.select, q && q.disabled).css({
                            textAlign: "center"
                        }).add(u);
                        s += j[b].width + p(i.buttonSpacing, 5);
                        c.selected === b && j[b].setState(2)
                    }), c.updateButtonStates(), o !== !1)) c.div = g = aa("div", null, {
                position: "relative",
                height: 0,
                zIndex: 1
            }), f.parentNode.insertBefore(g, f), c.inputGroup = g = e.g("input-group").add(), g.offset = 0, c.drawInput("min"), c.drawInput("max");
            o !== !1 && (f = d.plotTop - 45, g.align(x({
                y: f,
                width: g.offset,
                x: h && f < (h.y || 0) + h.height - d.spacing[0] ? -40 : 0
            }, i.inputPosition), !0, d.spacingBox), r(o) || (d = u.getBBox(), g[g.translateX < d.x + d.width + 10 ? "hide" : "show"]()), c.setInputValue("min", a), c.setInputValue("max", b));
            c.rendered = !0
        },
        destroy: function () {
            var a = this.minInput,
                b = this.maxInput,
                c = this.chart,
                d = this.blurInputs,
                e;
            T(c.container, "mousedown", d);
            T(c, "resize", d);
            Na(this.buttons);
            if (a) a.onfocus = a.onblur = a.onchange = null;
            if (b) b.onfocus = b.onblur = b.onchange = null;
            for (e in this) this[e] &&
                e !== "chart" && (this[e].destroy ? this[e].destroy() : this[e].nodeType && Ta(this[e])), this[e] = null
        }
    };
    I.prototype.toFixedRange = function (a, b, c, d) {
        var e = this.chart && this.chart.fixedRange,
            a = p(c, this.translate(a, !0)),
            b = p(d, this.translate(b, !0)),
            c = e && (b - a) / e;
        c > 0.7 && c < 1.3 && (d ? a = b - e : b = a + e);
        return {
            min: a,
            max: b
        }
    };
    R(Pa.prototype, "init", function (a, b, c) {
        E(this, "init", function () {
            if (this.options.rangeSelector.enabled) this.rangeSelector = new Fb(this)
        });
        a.call(this, b, c)
    });
    A.RangeSelector = Fb;
    Pa.prototype.callbacks.push(function (a) {
        function b() {
            f =
                a.xAxis[0].getExtremes();
            g.render(f.min, f.max)
        }

        function c() {
            f = a.xAxis[0].getExtremes();
            isNaN(f.min) || h.render(f.min, f.max)
        }

        function d(a) {
            a.triggerOp !== "navigator-drag" && g.render(a.min, a.max)
        }

        function e(a) {
            h.render(a.min, a.max)
        }
        var f, g = a.scroller,
            h = a.rangeSelector;
        g && (E(a.xAxis[0], "afterSetExtremes", d), R(a, "drawChartBox", function (a) {
            var c = this.isDirtyBox;
            a.call(this);
            c && b()
        }), b());
        h && (E(a.xAxis[0], "afterSetExtremes", e), E(a, "resize", c), c());
        E(a, "destroy", function () {
            g && T(a.xAxis[0], "afterSetExtremes",
                d);
            h && (T(a, "resize", c), T(a.xAxis[0], "afterSetExtremes", e))
        })
    });
    A.StockChart = function (a, b) {
        var c = a.series,
            d, e = p(a.navigator && a.navigator.enabled, !0) ? {
                startOnTick: !1,
                endOnTick: !1
            } : null,
            f = {
                marker: {
                    enabled: !1,
                    radius: 2
                }
            },
            g = {
                shadow: !1,
                borderWidth: 0
            };
        a.xAxis = Aa(pa(a.xAxis || {}), function (a) {
            return y({
                minPadding: 0,
                maxPadding: 0,
                ordinal: !0,
                title: {
                    text: null
                },
                labels: {
                    overflow: "justify"
                },
                showLastLabel: !0
            }, a, {
                type: "datetime",
                categories: null
            }, e)
        });
        a.yAxis = Aa(pa(a.yAxis || {}), function (a) {
            d = p(a.opposite, !0);
            return y({
                labels: {
                    y: -2
                },
                opposite: d,
                showLastLabel: !1,
                title: {
                    text: null
                }
            }, a)
        });
        a.series = null;
        a = y({
            chart: {
                panning: !0,
                pinchType: "x"
            },
            navigator: {
                enabled: !0
            },
            scrollbar: {
                enabled: !0
            },
            rangeSelector: {
                enabled: !0
            },
            title: {
                text: null,
                style: {
                    fontSize: "16px"
                }
            },
            tooltip: {
                shared: !0,
                crosshairs: !0
            },
            legend: {
                enabled: !1
            },
            plotOptions: {
                line: f,
                spline: f,
                area: f,
                areaspline: f,
                arearange: f,
                areasplinerange: f,
                column: g,
                columnrange: g,
                candlestick: g,
                ohlc: g
            }
        }, a, {
            _stock: !0,
            chart: {
                inverted: !1
            }
        });
        a.series = c;
        return new Pa(a, b)
    };
    R(Xa.prototype, "init", function (a, b, c) {
        var d =
            c.chart.pinchType || "";
        a.call(this, b, c);
        this.pinchX = this.pinchHor = d.indexOf("x") !== -1;
        this.pinchY = this.pinchVert = d.indexOf("y") !== -1;
        this.hasZoom = this.hasZoom || this.pinchHor || this.pinchVert
    });
    R(I.prototype, "autoLabelAlign", function (a) {
        var b = this.chart,
            c = this.options,
            b = b._labelPanes = b._labelPanes || {},
            d = this.options.labels;
        if (this.chart.options._stock && this.coll === "yAxis" && (c = c.top + "," + c.height, !b[c] && d.enabled)) {
            if (d.x === 15) d.x = 0;
            if (d.align === void 0) d.align = "right";
            b[c] = 1;
            return "right"
        }
        return a.call(this, [].slice.call(arguments, 1))
    });
    R(I.prototype, "getPlotLinePath", function (a, b, c, d, e, f) {
        var g = this,
            h = this.isLinked && !this.series ? this.linkedParent.series : this.series,
            i = g.chart,
            j = i.renderer,
            k = g.left,
            m = g.top,
            l, o, q, s, x = [],
            y = [],
            u;
        if (g.coll === "colorAxis") return a.apply(this, [].slice.call(arguments, 1));
        y = g.isXAxis ? r(g.options.yAxis) ? [i.yAxis[g.options.yAxis]] : Aa(h, function (a) {
            return a.yAxis
        }) : r(g.options.xAxis) ? [i.xAxis[g.options.xAxis]] : Aa(h, function (a) {
            return a.xAxis
        });
        n(g.isXAxis ? i.yAxis : i.xAxis, function (a) {
            if (r(a.options.id) ?
                a.options.id.indexOf("navigator") === -1 : 1) {
                var b = a.isXAxis ? "yAxis" : "xAxis",
                    b = r(a.options[b]) ? i[b][a.options[b]] : i[b][0];
                g === b && y.push(a)
            }
        });
        u = y.length ? [] : [g.isXAxis ? i.yAxis[0] : i.xAxis[0]];
        n(y, function (a) {
            Oa(a, u) === -1 && u.push(a)
        });
        f = p(f, g.translate(b, null, null, d));
        isNaN(f) || (g.horiz ? n(u, function (a) {
            var b;
            o = a.pos;
            s = o + a.len;
            l = q = w(f + g.transB);
            if (l < k || l > k + g.width) e ? l = q = B(v(k, l), k + g.width) : b = !0;
            b || x.push("M", l, o, "L", q, s)
        }) : n(u, function (a) {
            var b;
            l = a.pos;
            q = l + a.len;
            o = s = w(m + g.height - f);
            if (o < m || o > m + g.height) e ?
                o = s = B(v(m, o), g.top + g.height) : b = !0;
            b || x.push("M", l, o, "L", q, s)
        }));
        return x.length > 0 ? j.crispPolyLine(x, c || 1) : null
    });
    I.prototype.getPlotBandPath = function (a, b) {
        var c = this.getPlotLinePath(b, null, null, !0),
            d = this.getPlotLinePath(a, null, null, !0),
            e = [],
            f;
        if (d && c && d.toString() !== c.toString())
            for (f = 0; f < d.length; f += 6) e.push("M", d[f + 1], d[f + 2], "L", d[f + 4], d[f + 5], c[f + 4], c[f + 5], c[f + 1], c[f + 2]);
        else e = null;
        return e
    };
    na.prototype.crispPolyLine = function (a, b) {
        var c;
        for (c = 0; c < a.length; c += 6) a[c + 1] === a[c + 4] && (a[c + 1] = a[c + 4] =
            w(a[c + 1]) - b % 2 / 2), a[c + 2] === a[c + 5] && (a[c + 2] = a[c + 5] = w(a[c + 2]) + b % 2 / 2);
        return a
    };
    if (Wa === A.VMLRenderer) ib.prototype.crispPolyLine = na.prototype.crispPolyLine;
    R(I.prototype, "hideCrosshair", function (a, b) {
        a.call(this, b);
        r(this.crossLabelArray) && (r(b) ? this.crossLabelArray[b] && this.crossLabelArray[b].hide() : n(this.crossLabelArray, function (a) {
            a.hide()
        }))
    });
    R(I.prototype, "drawCrosshair", function (a, b, c) {
        var d, e;
        a.call(this, b, c);
        if (r(this.crosshair.label) && this.crosshair.label.enabled && r(c)) {
            var a = this.chart,
                f =
                this.options.crosshair.label,
                g = this.isXAxis ? "x" : "y",
                b = this.horiz,
                h = this.opposite,
                i = this.left,
                j = this.top,
                k = this.crossLabel,
                m, l, n = f.format,
                q = "";
            if (!k) k = this.crossLabel = a.renderer.label().attr({
                align: f.align || (b ? "center" : h ? this.labelAlign === "right" ? "right" : "left" : this.labelAlign === "left" ? "left" : "center"),
                zIndex: 12,
                height: b ? 16 : s,
                fill: f.backgroundColor || this.series[0] && this.series[0].color || "gray",
                padding: p(f.padding, 2),
                stroke: f.borderColor || null,
                "stroke-width": f.borderWidth || 0
            }).css(x({
                color: "white",
                fontWeight: "normal",
                fontSize: "11px",
                textAlign: "center"
            }, f.style)).add();
            b ? (m = c.plotX + i, l = j + (h ? 0 : this.height)) : (m = h ? this.width + i : 0, l = c.plotY + j);
            if (l < j || l > j + this.height) this.hideCrosshair();
            else {
                !n && !f.formatter && (this.isDatetimeAxis && (q = "%b %d, %Y"), n = "{value" + (q ? ":" + q : "") + "}");
                k.attr({
                    text: n ? Ma(n, {
                        value: c[g]
                    }) : f.formatter.call(this, c[g]),
                    x: m,
                    y: l,
                    visibility: "visible"
                });
                c = k.getBBox();
                if (b) {
                    if (this.options.tickPosition === "inside" && !h || this.options.tickPosition !== "inside" && h) l = k.y - c.height
                } else l = k.y -
                    c.height / 2;
                b ? (d = i - c.x, e = i + this.width - c.x) : (d = this.labelAlign === "left" ? i : 0, e = this.labelAlign === "right" ? i + this.width : a.chartWidth);
                k.translateX < d && (m += d - k.translateX);
                k.translateX + c.width >= e && (m -= k.translateX + c.width - e);
                k.attr({
                    x: m,
                    y: l,
                    visibility: "visible"
                })
            }
        }
    });
    var nc = da.init,
        oc = da.processData,
        pc = Ca.prototype.tooltipFormatter;
    da.init = function () {
        nc.apply(this, arguments);
        this.setCompare(this.options.compare)
    };
    da.setCompare = function (a) {
        this.modifyValue = a === "value" || a === "percent" ? function (b, c) {
            var d = this.compareValue;
            if (b !== s && (b = a === "value" ? b - d : b = 100 * (b / d) - 100, c)) c.change = b;
            return b
        } : null;
        if (this.chart.hasRendered) this.isDirty = !0
    };
    da.processData = function () {
        var a = 0,
            b, c, d;
        oc.apply(this, arguments);
        if (this.xAxis && this.processedYData) {
            b = this.processedXData;
            c = this.processedYData;
            for (d = c.length; a < d; a++)
                if (typeof c[a] === "number" && b[a] >= this.xAxis.min) {
                    this.compareValue = c[a];
                    break
                }
        }
    };
    R(da, "getExtremes", function (a) {
        a.apply(this, [].slice.call(arguments, 1));
        if (this.modifyValue) this.dataMax = this.modifyValue(this.dataMax),
            this.dataMin = this.modifyValue(this.dataMin)
    });
    I.prototype.setCompare = function (a, b) {
        this.isXAxis || (n(this.series, function (b) {
            b.setCompare(a)
        }), p(b, !0) && this.chart.redraw())
    };
    Ca.prototype.tooltipFormatter = function (a) {
        a = a.replace("{point.change}", (this.change > 0 ? "+" : "") + A.numberFormat(this.change, p(this.series.tooltipOptions.changeDecimals, 2)));
        return pc.apply(this, [a])
    };
    R(O.prototype, "render", function (a) {
        if (this.chart.options._stock) !this.clipBox && this.animate && this.animate.toString().indexOf("sharedClip") !==
            -1 ? (this.clipBox = y(this.chart.clipBox), this.clipBox.width = this.xAxis.len, this.clipBox.height = this.yAxis.len) : this.chart[this.sharedClipKey] && (ab(this.chart[this.sharedClipKey]), this.chart[this.sharedClipKey].attr({
                width: this.xAxis.len,
                height: this.yAxis.len
            }));
        a.call(this)
    });
    x(A, {
        Color: wa,
        Point: Ca,
        Tick: Za,
        Renderer: Wa,
        SVGElement: Y,
        SVGRenderer: na,
        arrayMin: Sa,
        arrayMax: Fa,
        charts: ca,
        dateFormat: ka,
        error: qa,
        format: Ma,
        pathAnim: Ib,
        getOptions: function () {
            return P
        },
        hasBidiBug: Yb,
        isTouchDevice: fb,
        setOptions: function (a) {
            P =
                y(!0, P, a);
            Nb();
            return P
        },
        addEvent: E,
        removeEvent: T,
        createElement: aa,
        discardElement: Ta,
        css: L,
        each: n,
        map: Aa,
        merge: y,
        splat: pa,
        extendClass: ja,
        pInt: C,
        svg: ea,
        canvas: ma,
        vml: !ea && !ma,
        product: "Highstock",
        version: "2.1.5"
    })
})();