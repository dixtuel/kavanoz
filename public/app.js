(function () {
  "use strict";

  var LANG = document.documentElement.lang === "en" ? "en" : "tr";

  var T = {
    tr: {
      anon: "Anonim",
      sealedLabel: "mühürlü",
      opensIn: function (d) { return "açılıyor: " + d; },
      revealedOn: function (d) { return d + " tarihinde açıldı"; },
      sending: "Gönderiliyor…",
      errGeneric: "Bir şeyler ters gitti, birazdan tekrar dene.",
      errCaptcha: "Doğrulamayı tamamlayamadık, tekrar dene.",
      errEmail: "Bu mail adresine ulaşılamıyor gibi görünüyor — adresi kontrol eder misin?",
      errContent: "Bu metin yayın kurallarımıza uymuyor, lütfen düzenleyip tekrar dene.",
      errDate: "Lütfen 7 gün ile 5 yıl arasında bir tarih seç.",
      success: "Kavanozun mühürlendi! Şimdi mailine bir onay linki gönderdik — onaylamadan kavanoz açılmaz.",
      loadError: "Duvar yüklenemedi.",
      empty: "Henüz hiç kavanoz yok — ilkini sen bırak.",
    },
    en: {
      anon: "Anonymous",
      sealedLabel: "sealed",
      opensIn: function (d) { return "opens: " + d; },
      revealedOn: function (d) { return "opened on " + d; },
      sending: "Sending…",
      errGeneric: "Something went wrong, try again shortly.",
      errCaptcha: "We couldn't verify you're human, please try again.",
      errEmail: "That email address doesn't look reachable — could you check it?",
      errContent: "This text doesn't meet our content guidelines, please edit and try again.",
      errDate: "Please pick a date between 7 days and 5 years from now.",
      success: "Your jar is sealed! We just sent a confirmation link to your email — the jar won't activate until you click it.",
      loadError: "Couldn't load the wall.",
      empty: "No jars yet — leave the first one.",
    },
  }[LANG];

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var langLinks = document.querySelectorAll(".lang-switch a");
  Array.prototype.forEach.call(langLinks, function (a) {
    a.addEventListener("click", function () {
      try { localStorage.setItem("kavanozLang", a.textContent.trim().toLowerCase()); } catch (e) {}
    });
  });

  // ---- Form: char count ----
  var messageEl = document.getElementById("message");
  var charCountEl = document.getElementById("char-count");
  if (messageEl && charCountEl) {
    messageEl.addEventListener("input", function () {
      charCountEl.textContent = messageEl.value.length;
    });
  }

  // ---- Duration choice group ----
  var selectedDays = 365;
  var durationGroup = document.getElementById("duration-group");
  var customDateInput = document.getElementById("customDate");
  if (durationGroup) {
    durationGroup.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      Array.prototype.forEach.call(durationGroup.children, function (b) { b.classList.remove("selected"); });
      btn.classList.add("selected");
      if (btn.dataset.days === "custom") {
        customDateInput.style.display = "block";
        selectedDays = null;
      } else {
        customDateInput.style.display = "none";
        selectedDays = Number(btn.dataset.days);
      }
    });
  }

  // ---- Visibility choice group ----
  var selectedVisibility = "public";
  var visibilityGroup = document.getElementById("visibility-group");
  if (visibilityGroup) {
    visibilityGroup.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      Array.prototype.forEach.call(visibilityGroup.children, function (b) { b.classList.remove("selected"); });
      btn.classList.add("selected");
      selectedVisibility = btn.dataset.vis;
    });
  }

  function computeUnlockAt() {
    if (selectedDays) {
      return new Date(Date.now() + selectedDays * 86400000).toISOString();
    }
    if (customDateInput && customDateInput.value) {
      return new Date(customDateInput.value + "T12:00:00").toISOString();
    }
    return null;
  }

  // ---- Submit ----
  var form = document.getElementById("jar-form");
  var msgEl = document.getElementById("form-msg");
  var submitBtn = document.getElementById("submit-btn");

  var ERROR_MAP = {
    invalid_message: T.errGeneric,
    invalid_display_name: T.errGeneric,
    invalid_visibility: T.errGeneric,
    invalid_email: T.errEmail,
    invalid_unlock_at: T.errDate,
    captcha_failed: T.errCaptcha,
    email_unreachable: T.errEmail,
    content_rejected: T.errContent,
    server_error: T.errGeneric,
  };

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      msgEl.className = "form-msg";
      msgEl.textContent = "";

      var unlockAt = computeUnlockAt();
      if (!unlockAt) {
        msgEl.className = "form-msg error";
        msgEl.textContent = T.errDate;
        return;
      }

      var hcaptchaToken = window.hcaptcha ? window.hcaptcha.getResponse() : "";
      if (!hcaptchaToken) {
        msgEl.className = "form-msg error";
        msgEl.textContent = T.errCaptcha;
        return;
      }

      var payload = {
        message: messageEl.value,
        displayName: document.getElementById("displayName").value,
        email: document.getElementById("email").value,
        visibility: selectedVisibility,
        unlockAt: unlockAt,
        lang: LANG,
        hcaptchaToken: hcaptchaToken,
      };

      submitBtn.disabled = true;
      submitBtn.textContent = T.sending;

      fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (res) { return res.json().then(function (body) { return { ok: res.ok, body: body }; }); })
        .then(function (result) {
          if (result.ok) {
            msgEl.className = "form-msg success";
            msgEl.textContent = T.success;
            form.reset();
            if (window.hcaptcha) window.hcaptcha.reset();
            charCountEl.textContent = "0";
          } else {
            msgEl.className = "form-msg error";
            msgEl.textContent = ERROR_MAP[result.body.error] || T.errGeneric;
            if (window.hcaptcha) window.hcaptcha.reset();
          }
        })
        .catch(function () {
          msgEl.className = "form-msg error";
          msgEl.textContent = T.errGeneric;
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = LANG === "en" ? "Seal the jar" : "Kavanozu mühürle";
        });
    });
  }

  // ---- Wall ----
  var wallGrid = document.getElementById("wall-grid");
  var loadMoreBtn = document.getElementById("load-more");
  var lastId = null;

  function jarSvg(revealed) {
    var fill = revealed ? "#D98E3B" : "#4b5d55";
    return '<svg viewBox="0 0 40 46" aria-hidden="true"><rect x="6" y="16" width="28" height="26" rx="7" fill="' + fill + '" opacity="0.85"/><rect x="12" y="8" width="16" height="9" rx="3" fill="#8a7050"/></svg>';
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString(LANG === "en" ? "en-GB" : "tr-TR", { year: "numeric", month: "short", day: "numeric" });
    } catch (e) {
      return iso;
    }
  }

  function renderJar(item) {
    var el = document.createElement("div");
    el.className = "jar-card" + (item.revealed ? "" : " sealed");
    var name = item.revealed ? (item.displayName || T.anon) : T.sealedLabel;
    var meta = item.revealed ? T.revealedOn(formatDate(item.unlockAt)) : T.opensIn(formatDate(item.unlockAt));
    var body = item.revealed && item.message
      ? '<div class="msg">' + escapeHtml(item.message) + "</div>"
      : "";
    el.innerHTML = jarSvg(item.revealed) +
      '<div class="name">' + escapeHtml(name) + "</div>" +
      '<div class="meta">' + escapeHtml(meta) + "</div>" + body;
    return el;
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function loadWall() {
    var url = "/api/wall?limit=24" + (lastId ? "&before=" + lastId : "");
    fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var items = data.items || [];
        if (items.length === 0 && !lastId) {
          wallGrid.innerHTML = '<p style="color:var(--ink-dim)">' + T.empty + "</p>";
          return;
        }
        items.forEach(function (item) { wallGrid.appendChild(renderJar(item)); });
        if (items.length > 0) lastId = items[items.length - 1].id;
        loadMoreBtn.hidden = items.length < 24;
      })
      .catch(function () {
        if (!lastId) wallGrid.innerHTML = '<p style="color:var(--ink-dim)">' + T.loadError + "</p>";
      });
  }

  if (wallGrid) {
    loadWall();
    if (loadMoreBtn) loadMoreBtn.addEventListener("click", loadWall);
  }
})();
