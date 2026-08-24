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

  function todayPlusDays(days) {
    var d = new Date(Date.now() + days * 86400000);
    return d.toISOString().slice(0, 10);
  }

  // ---------------- Not bırakma formu ----------------
  var messageEl = document.getElementById("message");
  var charCountEl = document.getElementById("char-count");
  if (messageEl && charCountEl) {
    messageEl.addEventListener("input", function () {
      charCountEl.textContent = messageEl.value.length;
    });
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
            selectedRetention = "admin";
            Array.prototype.forEach.call(retentionGroup.children, function (b) { b.classList.remove("selected"); });
            retentionGroup.children[0].classList.add("selected");
            if (window.hcaptcha) window.hcaptcha.reset();
            charCountEl.textContent = "0";
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

  // ---------------- Aktif kavanoz / raf görüntüleyici ----------------
  var CHIP_POSITIONS = [
    { left: 20, top: 55, rot: -8 }, { left: 55, top: 48, rot: 5 }, { left: 38, top: 68, rot: 10 },
    { left: 68, top: 62, rot: -4 }, { left: 25, top: 78, rot: 6 }, { left: 58, top: 80, rot: -10 },
    { left: 45, top: 58, rot: 3 }, { left: 15, top: 68, rot: -6 },
  ];

  var jarStage = document.getElementById("jar-view-stage");
  var fillRect = document.getElementById("fill-level-rect");
  var fillLabel = document.getElementById("jar-fill-label");
  var progressText = document.getElementById("jar-progress-text");
  var noteListEl = document.getElementById("note-list");
  var loadMoreActiveBtn = document.getElementById("load-more-active");
  var jarSection = document.getElementById("kavanoz");

  var currentJarId = null;
  var currentJarIsActive = true;
  var lastNoteId = null;
  var loadedNotes = {};

  function clearChips() {
    Array.prototype.forEach.call(jarStage.querySelectorAll(".note-chip"), function (c) { c.remove(); });
  }

  function renderChips(notes) {
    clearChips();
    var subset = notes.slice(0, CHIP_POSITIONS.length);
    subset.forEach(function (note, i) {
      var pos = CHIP_POSITIONS[i];
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "note-chip";
      chip.style.left = pos.left + "%";
      chip.style.top = pos.top + "%";
      chip.style.transform = "rotate(" + pos.rot + "deg)";
      chip.title = note.displayName || T.anon;
      chip.addEventListener("click", function (e) {
        e.stopPropagation();
        showNoteModal(loadedNotes[note.id] || note);
      });
      jarStage.appendChild(chip);
    });
  }

  function renderNoteListItems(notes, append) {
    if (!append) noteListEl.innerHTML = "";
    if (notes.length === 0 && !append) {
      var li = document.createElement("li");
      li.style.padding = "18px";
      li.style.color = "var(--ink-dim)";
      li.textContent = currentJarIsActive ? T.empty : T.empty;
      noteListEl.appendChild(li);
      return;
    }
    notes.forEach(function (note) {
      loadedNotes[note.id] = note;
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "note-list-item";
      var snippet = note.message.length > 90 ? note.message.slice(0, 90) + "…" : note.message;
      btn.innerHTML =
        '<span class="name">' + escapeHtml(note.displayName || T.anon) + "</span>" +
        '<span class="snippet">' + escapeHtml(snippet) + "</span>" +
        '<span class="date">' + escapeHtml(formatDate(note.createdAt)) + "</span>";
      btn.addEventListener("click", function () { showNoteModal(note); });
      li.appendChild(btn);
      noteListEl.appendChild(li);
    });
  }

  function loadJarNotes(jarId, append) {
    var url = "/api/jars/" + jarId + "/notes?limit=20" + (append && lastNoteId ? "&before=" + lastNoteId : "");
    return fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var items = data.items || [];
        renderChips(currentJarIsActive ? items : []);
        renderNoteListItems(items, append);
        if (items.length > 0) lastNoteId = items[items.length - 1].id;
        loadMoreActiveBtn.hidden = items.length < 20;
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
        var pct = Math.min(100, Math.round((summary.noteCount / summary.capacity) * 100));
        var maxHeight = 178;
        fillRect.setAttribute("height", (maxHeight * pct) / 100);
        fillRect.setAttribute("y", 228 - (maxHeight * pct) / 100);
        fillLabel.textContent = summary.noteCount + " / " + summary.capacity;
        progressText.textContent = LANG === "en"
          ? "The current jar has " + summary.noteCount + " of " + summary.capacity + " notes."
          : "Şu anki kavanozda " + summary.noteCount + " / " + summary.capacity + " not var.";
        return loadJarNotes(currentJarId, false);
      })
      .catch(function () {
        progressText.textContent = T.loadError;
      });
  }

  function viewArchivedJar(jarId, meta) {
    currentJarIsActive = false;
    currentJarId = jarId;
    lastNoteId = null;
    fillRect.setAttribute("height", 178);
    fillRect.setAttribute("y", 50);
    fillLabel.textContent = meta.noteCount + " / " + meta.noteCount;
    progressText.innerHTML = '<a href="#" id="back-to-active" class="back-link">' + T.backToActive + "</a><br>" +
      (LANG === "en" ? "Archived jar, " + formatDate(meta.archivedAt) : "Rafa kalkma tarihi: " + formatDate(meta.archivedAt));
    document.getElementById("back-to-active").addEventListener("click", function (e) {
      e.preventDefault();
      loadActiveJar();
      jarSection.scrollIntoView({ behavior: "smooth" });
    });
    loadJarNotes(jarId, false);
    jarSection.scrollIntoView({ behavior: "smooth" });
  }

  if (loadMoreActiveBtn) {
    loadMoreActiveBtn.addEventListener("click", function () { loadJarNotes(currentJarId, true); });
  }

  if (jarStage) {
    jarStage.addEventListener("click", function () {
      document.getElementById("note-list").closest(".note-list-panel").scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  // ---------------- Raf ----------------
  var shelfGrid = document.getElementById("shelf-grid");
  var loadMoreShelfBtn = document.getElementById("load-more-shelf");
  var lastShelfId = null;

  function jarIconSvg() {
    return '<svg viewBox="0 0 40 46" aria-hidden="true"><rect x="6" y="16" width="28" height="26" rx="7" fill="#D98E3B" opacity="0.85"/><rect x="12" y="8" width="16" height="9" rx="3" fill="#8a7050"/></svg>';
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
          card.innerHTML = jarIconSvg() +
            '<div class="count">' + jar.noteCount + "</div>" +
            '<div class="date">' + escapeHtml(formatDate(jar.archivedAt)) + "</div>";
          card.addEventListener("click", function () { viewArchivedJar(jar.id, jar); });
          shelfGrid.appendChild(card);
        });
        if (items.length > 0) lastShelfId = items[items.length - 1].id;
        loadMoreShelfBtn.hidden = items.length < 18;
      })
      .catch(function () {
        if (!append) shelfGrid.innerHTML = '<p style="color:var(--ink-dim)">' + T.loadError + "</p>";
      });
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
