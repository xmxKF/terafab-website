/* TeraFab — 共用互動腳本 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 導覽列 ---------- */
  var nav = document.querySelector(".nav");
  function onNavScroll() {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onNavScroll, { passive: true });
  onNavScroll();

  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    links.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (a && links.classList.contains("open")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
    /* 視窗跨回桌面寬度時解除選單與捲動鎖定 */
    var mq = window.matchMedia("(max-width: 880px)");
    var onMq = function (e) {
      if (!e.matches && links.classList.contains("open")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    };
    if (mq.addEventListener) mq.addEventListener("change", onMq);
    else if (mq.addListener) mq.addListener(onMq);
  }

  /* 行動版：業務範圍子選單展開 */
  var subBtn = document.querySelector(".nav-sub-btn");
  if (subBtn) {
    subBtn.setAttribute("aria-expanded", "false");
    subBtn.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 880px)").matches) {
        var li = subBtn.parentElement;
        var open = li.classList.toggle("open-sub");
        subBtn.setAttribute("aria-expanded", open ? "true" : "false");
      } else {
        var first = subBtn.parentElement.querySelector(".dropdown-menu a");
        if (first) first.focus();
      }
    });
  }

  /* ---------- 進場顯示 ---------- */
  var reveals = document.querySelectorAll(".rv");
  if (reveals.length && "IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("on");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("on"); });
  }

  /* ---------- Hero OHT 描線 ---------- */
  var ohtLine = document.querySelector(".oht-line");
  if (ohtLine) {
    window.setTimeout(function () { ohtLine.classList.add("drawn"); }, 300);
  }

  /* ---------- 標高導覽軌（首頁） ---------- */
  var rail = document.querySelector(".elev-rail");
  if (rail) {
    document.body.classList.add("has-rail");
    var ind = rail.querySelector(".rail-ind");
    var ticks = Array.prototype.slice.call(rail.querySelectorAll(".rail-tick"));
    var sections = Array.prototype.slice.call(document.querySelectorAll("main [data-level]"));
    var railScroll = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (ind) ind.style.top = (p * 100) + "%";

      var current = null;
      var mid = window.scrollY + window.innerHeight * 0.4;
      sections.forEach(function (s) {
        if (s.offsetTop <= mid) current = s.getAttribute("data-level");
      });
      ticks.forEach(function (t) {
        t.classList.toggle("active", t.getAttribute("data-level") === current);
      });
    };
    var railTickPending = false;
    window.addEventListener("scroll", function () {
      if (railTickPending) return;
      railTickPending = true;
      window.requestAnimationFrame(function () {
        railScroll();
        railTickPending = false;
      });
    }, { passive: true });
    railScroll();
  }

  /* ---------- 聯絡表單（靜態站：組合 mailto） ---------- */
  var form = document.querySelector(".form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var get = function (name) {
        var el = form.querySelector('[name="' + name + '"]');
        return el ? el.value.trim() : "";
      };
      var to = form.getAttribute("data-mailto") || "ivan@terafabsystem.com";
      var subject = "[網站洽詢] " + get("topic") + " — " + get("company");
      var body = [
        "姓名：" + get("name"),
        "公司：" + get("company"),
        "Email：" + get("email"),
        "需求類別：" + get("topic"),
        "",
        get("message")
      ].join("\n");
      /* 簡體模式下郵件內容同步轉換 */
      if (document.documentElement.lang === "zh-Hans" && window.TF_CONV) {
        subject = window.TF_CONV(subject);
        body = window.TF_CONV(body);
      }
      window.location.href = "mailto:" + to +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    });
  }

  /* ---------- 年份 ---------- */
  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
