/* TeraFab — 繁簡一鍵切換
   原理：繁體為內容源，簡體由「詞彙表＋逐字對照表」（assets/js/zh-map.js，
   依全站字集以 OpenCC 生成）即時轉換；原文快取於記憶體，切回繁體無損。
   偏好儲存於 localStorage（key: tf-lang），跨頁生效。 */
(function () {
  "use strict";

  var DATA = window.TF_ZH || { phrases: [], chars: {} };
  var ATTRS = ["alt", "aria-label", "placeholder", "title"];
  var HAN_RE = /[㐀-鿿豈-﫿]/;

  function conv(s) {
    var i;
    for (i = 0; i < DATA.phrases.length; i++) {
      if (s.indexOf(DATA.phrases[i][0]) !== -1) {
        s = s.split(DATA.phrases[i][0]).join(DATA.phrases[i][1]);
      }
    }
    var out = "";
    for (i = 0; i < s.length; i++) {
      out += DATA.chars[s.charAt(i)] || s.charAt(i);
    }
    return out;
  }

  var origText = new WeakMap();
  var origAttr = new WeakMap();

  function eachTextNode(cb) {
    var tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode && n.parentNode.nodeName;
        if (p === "SCRIPT" || p === "STYLE") return NodeFilter.FILTER_REJECT;
        return HAN_RE.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    var n;
    while ((n = tw.nextNode())) cb(n);
  }

  function ensureScFont() {
    if (document.getElementById("tf-font-sc")) return;
    var base = document.querySelector('link[href$="assets/css/fonts.css"]');
    var href = base ? base.getAttribute("href").replace("fonts.css", "fonts-sc.css") : "assets/css/fonts-sc.css";
    var l = document.createElement("link"); l.id = "tf-font-sc"; l.rel = "stylesheet"; l.href = href;
    document.head.appendChild(l);
  }

  function apply(lang) {
    var toHans = lang === "hans";
    if (toHans) ensureScFont();

    eachTextNode(function (n) {
      if (toHans) {
        if (!origText.has(n)) origText.set(n, n.nodeValue);
        n.nodeValue = conv(origText.get(n));
      } else if (origText.has(n)) {
        n.nodeValue = origText.get(n);
      }
    });

    var els = document.querySelectorAll("[alt],[aria-label],[placeholder],[title]");
    Array.prototype.forEach.call(els, function (el) {
      ATTRS.forEach(function (a) {
        var v = el.getAttribute(a);
        if (v === null || !HAN_RE.test(v)) return;
        var store = origAttr.get(el) || {};
        if (toHans) {
          if (!(a in store)) { store[a] = v; origAttr.set(el, store); }
          el.setAttribute(a, conv(store[a]));
        } else if (a in store) {
          el.setAttribute(a, store[a]);
        }
      });
    });

    var root = document.documentElement;
    if (toHans) {
      if (!root.getAttribute("data-orig-title")) root.setAttribute("data-orig-title", document.title);
      document.title = conv(root.getAttribute("data-orig-title"));
    } else if (root.getAttribute("data-orig-title")) {
      document.title = root.getAttribute("data-orig-title");
    }
    root.lang = toHans ? "zh-Hans" : "zh-Hant-TW";

    Array.prototype.forEach.call(document.querySelectorAll(".lang-switch [data-lang]"), function (b) {
      var cur = b.getAttribute("data-lang") === (toHans ? "hans" : "hant");
      b.classList.toggle("is-current", cur);
      if (cur) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
    });

    try { localStorage.setItem("tf-lang", lang); } catch (e) { /* 私密模式 */ }
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest(".lang-switch [data-lang]") : null;
    if (!b) return;
    apply(b.getAttribute("data-lang") === "hans" ? "hans" : "hant");
  });

  window.TF_CONV = conv;

  /* 英文頁的「简」連結：先記下偏好再前往中文頁 */
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("[data-set-lang]") : null;
    if (!a) return;
    try { localStorage.setItem("tf-lang", a.getAttribute("data-set-lang")); } catch (err) { /* 私密模式 */ }
  });

  var saved = "hant";
  try { saved = localStorage.getItem("tf-lang") || "hant"; } catch (e) { /* 私密模式 */ }
  var isZh = /^zh/i.test(document.documentElement.lang || "");
  if (isZh && saved === "hans") apply("hans");
})();
