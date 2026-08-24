(function () {
  "use strict";

  var LANG = document.documentElement.lang === "en" ? "en" : "tr";

  var T = {
    tr: {
      anon: "Anonim",
      sending: "Gönderiliyor…",
      errGeneric: "Bir şeyler ters gitti, birazdan tekrar dene.",
      errCaptcha: "Doğrulamayı tamamlayamadık, tekrar dene.",
      errEmail: "Bu mail adresine ulaşılamıyor gibi görünüyor — adresi kontrol eder misin?",
      errContent: "Bu metin yayın kurallarımıza uymuyor, lütfen düzenleyip tekrar dene.",
      errMailDate: "Mail gönderim tarihi bugünden ileri ve en fazla 5 yıl sonrası olmalı.",
      errRetentionDate: "Saklama tarihi bugünden ileri ve en fazla 5 yıl sonrası olmalı.",
      success: "Kavanoza bırakıldı!",
      loadError: "Yüklenemedi.",
      empty: "Bu kavanoz henüz boş.",
      shelfEmpty: "Rafta henüz kavanoz yok.",
      manageNotFound: "Bu anahtarla eşleşen bir not bulunamadı.",
      manageDeleted: "Not silindi.",
      manageSaved: "Değişiklikler kaydedildi.",
      confirmDelete: "Bu notu kalıcı olarak silmek istediğine emin misin?",
      backToActive: "◀ aktif kavanoza dön",
      jarBadge: function (n, cap) { return n + " / " + cap; },
      progress: function (n, cap) { return "Şu anki kavanozda " + n + " / " + cap + " not var."; },
      progressArchived: function (n, date) { return "Rafa kalkma tarihi: " + date; },
    },
    en: {
      anon: "Anonymous",
      sending: "Sending…",
      errGeneric: "Something went wrong, try again shortly.",
      errCaptcha: "We couldn't verify you're human, please try again.",
      errEmail: "That email address doesn't look reachable — could you check it?",
      errContent: "This text doesn't meet our content guidelines, please edit and try again.",
      errMailDate: "The delivery date must be in the future, at most 5 years out.",
      errRetentionDate: "The retention date must be in the future, at most 5 years out.",
      success: "Dropped in the jar!",
      loadError: "Couldn't load.",
      empty: "This jar is still empty.",
      shelfEmpty: "No jars on the shelf yet.",
      manageNotFound: "No note matches this key.",
      manageDeleted: "Note deleted.",
      manageSaved: "Changes saved.",
      confirmDelete: "Are you sure you want to permanently delete this note?",
      backToActive: "◀ back to the active jar",
      jarBadge: function (n, cap) { return n + " / " + cap; },
      progress: function (n, cap) { return "The current jar has " + n + " of " + cap + " notes."; },
      progressArchived: function (n, date) { return "Archived on " + date; },
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

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString(LANG === "en" ? "en-GB" : "tr-TR", { year: "numeric", month: "short", day: "numeric" });
    } catch (e) {
      return iso;
    }
  }

  // ---------------- Kompakt "not bırak" tetikleyicisi ----------------
  var dropSection = document.getElementById("birak");
  var quickTrigger = document.getElementById("quick-drop-trigger");
  var quickBtn = document.getElementById("quick-drop-btn");
  var cancelDropBtn = document.getElementById("cancel-drop-btn");
  var messageEl = document.getElementById("message");

  function openDropForm() {
    dropSection.hidden = false;
    dropSection.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(function () { messageEl.focus(); }, 300);
  }
  function closeDropForm() { dropSection.hidden = true; }

  if (quickTrigger) quickTrigger.addEventListener("click", openDropForm);
  if (quickBtn) quickBtn.addEventListener("click", function (e) { e.stopPropagation(); openDropForm(); });
  if (cancelDropBtn) cancelDropBtn.addEventListener("click", closeDropForm);

  var moreToggle = document.getElementById("more-options-toggle");
  var moreOptions = document.getElementById("more-options");
  if (moreToggle) {
    moreToggle.addEventListener("click", function () {
      var show = moreOptions.hidden;
      moreOptions.hidden = !show;
      moreToggle.textContent = show ? "− mail / saklama süresi seçenekleri" : "+ mail / saklama süresi seçenekleri";
    });
  }

  var charCountEl = document.getElementById("char-count");
  if (messageEl && charCountEl) {
    messageEl.addEventListener("input", function () { charCountEl.textContent = messageEl.value.length; });
  }

  var wantMailCheckbox = document.getElementById("wantMail");
  var mailFields = document.getElementById("mail-fields");
  if (wantMailCheckbox) {
    wantMailCheckbox.addEventListener("change", function () {
      mailFields.style.display = wantMailCheckbox.checked ? "grid" : "none";
    });
  }

  var selectedRetention = "admin";
  var retentionGroup = document.getElementById("retention-group");
  var retentionUntilInput = document.getElementById("retentionUntil");
  if (retentionGroup) {
    retentionGroup.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      Array.prototype.forEach.call(retentionGroup.children, function (b) { b.classList.remove("selected"); });
      btn.classList.add("selected");
      selectedRetention = btn.dataset.retention;
      retentionUntilInput.style.display = selectedRetention === "until_date" ? "block" : "none";
    });
  }

  // ---------------- Form gönderimi ----------------
  var form = document.getElementById("note-form");
  var formMsg = document.getElementById("form-msg");
  var submitBtn = document.getElementById("submit-btn");

  var ERROR_MAP = {
    invalid_message: T.errGeneric,
    invalid_display_name: T.errGeneric,
    invalid_email: T.errEmail,
    invalid_mail_send_at: T.errMailDate,
    invalid_retention_until: T.errRetentionDate,
    captcha_failed: T.errCaptcha,
    email_unreachable: T.errEmail,
    content_rejected: T.errContent,
    server_error: T.errGeneric,
  };

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      formMsg.className = "form-msg";
      formMsg.textContent = "";

      var hcaptchaToken = window.hcaptcha ? window.hcaptcha.getResponse() : "";
      if (!hcaptchaToken) {
        formMsg.className = "form-msg error";
        formMsg.textContent = T.errCaptcha;
        return;
      }

      var payload = {
        message: messageEl.value,
        displayName: document.getElementById("displayName").value,
        lang: LANG,
        retentionMode: selectedRetention,
        hcaptchaToken: hcaptchaToken,
      };
      if (wantMailCheckbox.checked) {
        payload.email = document.getElementById("email").value;
        var mailDate = document.getElementById("mailSendAt").value;
        payload.mailSendAt = mailDate ? new Date(mailDate + "T12:00:00").toISOString() : null;
      }
      if (selectedRetention === "until_date") {
        var retDate = retentionUntilInput.value;
        payload.retentionUntil = retDate ? new Date(retDate + "T12:00:00").toISOString() : null;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = T.sending;

      fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (res) { return res.json().then(function (body) { return { ok: res.ok, body: body }; }); })
        .then(function (result) {
          if (result.ok) {
            formMsg.className = "form-msg success";
            formMsg.textContent = T.success;
            showKeyModal(result.body.managementKey);
            form.reset();
            mailFields.style.display = "none";
            retentionUntilInput.style.display = "none";
            moreOptions.hidden = true;
            moreToggle.textContent = "+ mail / saklama süresi seçenekleri";
            selectedRetention = "admin";
            Array.prototype.forEach.call(retentionGroup.children, function (b) { b.classList.remove("selected"); });
            retentionGroup.children[0].classList.add("selected");
            if (window.hcaptcha) window.hcaptcha.reset();
            charCountEl.textContent = "0";
            closeDropForm();
            if (window.__kavanozJar) window.__kavanozJar.addNote(1);
            loadActiveJar();
          } else {
            formMsg.className = "form-msg error";
            formMsg.textContent = ERROR_MAP[result.body.error] || T.errGeneric;
            if (window.hcaptcha) window.hcaptcha.reset();
          }
        })
        .catch(function () {
          formMsg.className = "form-msg error";
          formMsg.textContent = T.errGeneric;
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = LANG === "en" ? "Drop it in the jar" : "Kavanoza bırak";
        });
    });
  }

  // ---------------- Modallar ----------------
  function openModal(id) { document.getElementById(id).hidden = false; }
  function closeModal(id) { document.getElementById(id).hidden = true; }

  var noteModal = document.getElementById("note-modal");
  if (noteModal) {
    document.getElementById("note-modal-close").addEventListener("click", function () { closeModal("note-modal"); });
    noteModal.addEventListener("click", function (e) { if (e.target === noteModal) closeModal("note-modal"); });
  }
  function showNoteModal(note) {
    document.getElementById("note-modal-name").textContent = note.displayName || T.anon;
    document.getElementById("note-modal-date").textContent = formatDate(note.createdAt);
    document.getElementById("note-modal-message").textContent = note.message;
    openModal("note-modal");
  }

  var keyModal = document.getElementById("key-modal");
  if (keyModal) {
    document.getElementById("key-modal-close").addEventListener("click", function () { closeModal("key-modal"); });
    keyModal.addEventListener("click", function (e) { if (e.target === keyModal) closeModal("key-modal"); });
    document.getElementById("key-copy-btn").addEventListener("click", function () {
      var text = document.getElementById("key-display").textContent;
      if (navigator.clipboard) navigator.clipboard.writeText(text).catch(function () {});
    });
  }
  function showKeyModal(key) {
    document.getElementById("key-display").textContent = key;
    openModal("key-modal");
  }

  // ---------------- Fizik kavanozu ----------------
  var jarCanvas = document.getElementById("jar-canvas");
  var jarCountBadge = document.getElementById("jar-count-badge");
  if (jarCanvas && window.Matter && window.KavanozJar) {
    var glassEl = jarCanvas.closest(".jar-canvas-glass");
    jarCanvas.width = glassEl.clientWidth * 0.84;
    jarCanvas.height = glassEl.clientHeight * 0.82;
    jarCanvas.style.width = jarCanvas.width + "px";
    jarCanvas.style.height = jarCanvas.height + "px";
    window.__kavanozJar = new window.KavanozJar(jarCanvas, {});
  }

  // ---------------- Not kartları (masonry) ----------------
  var CARD_COLORS = ["#F2A2A2", "#A8CDD6", "#B7C9A0", "#F2CB6E", "#D9C9F0", "#FFFDF8"];
  var CARD_ROTATIONS = [-2.5, 1.5, -1, 2, -1.8, 1, 2.5, -2];

  var masonryEl = document.getElementById("note-masonry");
  var loadMoreActiveBtn = document.getElementById("load-more-active");
  var progressText = document.getElementById("jar-progress-text");
  var jarSection = document.getElementById("kavanoz");

  var currentJarId = null;
  var currentJarIsActive = true;
  var lastNoteId = null;

  function renderNoteCards(notes, append) {
    if (!append) masonryEl.innerHTML = "";
    if (notes.length === 0 && !append) {
      masonryEl.innerHTML = '<p style="color:var(--ink-dim)">' + T.empty + "</p>";
      return;
    }
    notes.forEach(function (note, i) {
      var card = document.createElement("button");
      card.type = "button";
      card.className = "note-card";
      var color = CARD_COLORS[(note.id + i) % CARD_COLORS.length];
      var rot = CARD_ROTATIONS[(note.id + i) % CARD_ROTATIONS.length];
      card.style.setProperty("--card-color", color);
      card.style.setProperty("--rot", rot + "deg");
      var snippet = note.message.length > 140 ? note.message.slice(0, 140) + "…" : note.message;
      card.innerHTML =
        '<div class="snippet">' + escapeHtml(snippet) + "</div>" +
        '<div class="meta"><span>' + escapeHtml(note.displayName || T.anon) + '</span><span>' + escapeHtml(formatDate(note.createdAt)) + "</span></div>";
      card.addEventListener("click", function () { showNoteModal(note); });
      masonryEl.appendChild(card);
    });
  }

  function loadJarNotes(jarId, append) {
    var url = "/api/jars/" + jarId + "/notes?limit=24" + (append && lastNoteId ? "&before=" + lastNoteId : "");
    return fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var items = data.items || [];
        renderNoteCards(items, append);
        if (items.length > 0) lastNoteId = items[items.length - 1].id;
        loadMoreActiveBtn.hidden = items.length < 24;
        return data;
      });
  }

  function loadActiveJar() {
    currentJarIsActive = true;
    lastNoteId = null;
    fetch("/api/jars/active")
      .then(function (res) { return res.json(); })
      .then(function (summary) {
        currentJarId = summary.id;
        if (jarCountBadge) jarCountBadge.textContent = T.jarBadge(summary.noteCount, summary.capacity);
        progressText.textContent = T.progress(summary.noteCount, summary.capacity);
        return loadJarNotes(currentJarId, false).then(function (data) {
          if (window.__kavanozJar) {
            var n = Math.min((data.items || []).length, 12);
            var dropped = 0;
            var timer = setInterval(function () {
              window.__kavanozJar.addNote(1);
              dropped++;
              if (dropped >= n) clearInterval(timer);
            }, 90);
          }
        });
      })
      .catch(function () { progressText.textContent = T.loadError; });
  }

  function viewArchivedJar(jarId, meta) {
    currentJarIsActive = false;
    currentJarId = jarId;
    lastNoteId = null;
    progressText.innerHTML = '<a href="#" id="back-to-active" class="back-link">' + T.backToActive + "</a><br>" + T.progressArchived(meta.noteCount, formatDate(meta.archivedAt));
    document.getElementById("back-to-active").addEventListener("click", function (e) {
      e.preventDefault();
      loadActiveJar();
      jarSection.scrollIntoView({ behavior: "smooth" });
    });
    loadJarNotes(jarId, false);
    jarSection.scrollIntoView({ behavior: "smooth" });
  }

  if (loadMoreActiveBtn) loadMoreActiveBtn.addEventListener("click", function () { loadJarNotes(currentJarId, true); });

  // ---------------- Raf ----------------
  var shelfGrid = document.getElementById("shelf-grid");
  var loadMoreShelfBtn = document.getElementById("load-more-shelf");
  var lastShelfId = null;

  function jarIconSvg() {
    return '<svg viewBox="0 0 40 46" aria-hidden="true"><rect x="12" y="6" width="16" height="8" rx="3" fill="#7C9660"/><rect x="6" y="14" width="28" height="28" rx="8" fill="#E2A33D" opacity="0.85"/></svg>';
  }

  function loadShelf(append) {
    var url = "/api/jars/shelf?limit=18" + (append && lastShelfId ? "&before=" + lastShelfId : "");
    fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var items = data.items || [];
        if (!append) shelfGrid.innerHTML = "";
        if (items.length === 0 && !append) {
          shelfGrid.innerHTML = '<p style="color:var(--ink-dim)">' + T.shelfEmpty + "</p>";
          return;
        }
        items.forEach(function (jar) {
          var card = document.createElement("button");
          card.type = "button";
          card.className = "shelf-jar";
          card.innerHTML = jarIconSvg() + '<div class="count">' + jar.noteCount + "</div>" + '<div class="date">' + escapeHtml(formatDate(jar.archivedAt)) + "</div>";
          card.addEventListener("click", function () { viewArchivedJar(jar.id, jar); });
          shelfGrid.appendChild(card);
        });
        if (items.length > 0) lastShelfId = items[items.length - 1].id;
        loadMoreShelfBtn.hidden = items.length < 18;
      })
      .catch(function () { if (!append) shelfGrid.innerHTML = '<p style="color:var(--ink-dim)">' + T.loadError + "</p>"; });
  }
  if (loadMoreShelfBtn) loadMoreShelfBtn.addEventListener("click", function () { loadShelf(true); });

  if (jarSection) {
    loadActiveJar();
    loadShelf(false);
  }

  // ---------------- Notunu yönet ----------------
  var manageKeyInput = document.getElementById("manageKey");
  var manageFetchBtn = document.getElementById("manage-fetch-btn");
  var manageMsg = document.getElementById("manage-msg");
  var manageResult = document.getElementById("manage-result");
  var manageWantMail = document.getElementById("manageWantMail");
  var manageMailFields = document.getElementById("manage-mail-fields");

  if (manageWantMail) {
    manageWantMail.addEventListener("change", function () {
      manageMailFields.style.display = manageWantMail.checked ? "grid" : "none";
    });
  }

  function manageRequest(action, extra) {
    var body = Object.assign({ managementKey: manageKeyInput.value.trim(), action: action }, extra || {});
    return fetch("/api/notes/manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); });
  }

  if (manageFetchBtn) {
    manageFetchBtn.addEventListener("click", function () {
      manageMsg.className = "form-msg";
      manageMsg.textContent = "";
      manageResult.hidden = true;
      manageRequest("get").then(function (result) {
        if (!result.ok) {
          manageMsg.className = "form-msg error";
          manageMsg.textContent = T.manageNotFound;
          return;
        }
        var note = result.data.note;
        document.getElementById("manageMessage").value = note.message;
        document.getElementById("manageDisplayName").value = note.displayName || "";
        manageWantMail.checked = !!note.email;
        manageMailFields.style.display = note.email ? "grid" : "none";
        document.getElementById("manageEmail").value = note.email || "";
        document.getElementById("manageMailSendAt").value = note.mailSendAt ? note.mailSendAt.slice(0, 10) : "";
        manageResult.hidden = false;
      });
    });
  }

  var manageSaveBtn = document.getElementById("manage-save-btn");
  if (manageSaveBtn) {
    manageSaveBtn.addEventListener("click", function () {
      var fields = {
        message: document.getElementById("manageMessage").value,
        displayName: document.getElementById("manageDisplayName").value,
      };
      if (manageWantMail.checked) {
        fields.email = document.getElementById("manageEmail").value;
        var d = document.getElementById("manageMailSendAt").value;
        fields.mailSendAt = d ? new Date(d + "T12:00:00").toISOString() : null;
      } else {
        fields.email = null;
        fields.mailSendAt = null;
      }
      manageRequest("update", fields).then(function (result) {
        manageMsg.className = "form-msg " + (result.ok ? "success" : "error");
        manageMsg.textContent = result.ok ? T.manageSaved : (ERROR_MAP[result.data.error] || T.errGeneric);
      });
    });
  }

  var manageDeleteBtn = document.getElementById("manage-delete-btn");
  if (manageDeleteBtn) {
    manageDeleteBtn.addEventListener("click", function () {
      if (!confirm(T.confirmDelete)) return;
      manageRequest("delete").then(function (result) {
        manageMsg.className = "form-msg " + (result.ok ? "success" : "error");
        manageMsg.textContent = result.ok ? T.manageDeleted : T.manageNotFound;
        if (result.ok) {
          manageResult.hidden = true;
          manageKeyInput.value = "";
          loadActiveJar();
        }
      });
    });
  }
})();
