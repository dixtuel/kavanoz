(function () {
  "use strict";

  var LANG = document.documentElement.lang === "en" ? "en" : "tr";

  var T = {
    tr: {
      anon: "Anonim",
      sending: "Kavanoza bırakılıyor…",
      dropBtn: "Kavanoza Bırak",
      errGeneric: "Bir şeyler ters gitti, lütfen tekrar dene.",
      errCaptcha: "Lütfen doğrulamayı tamamla.",
      errEmail: "Bu mail adresine ulaşılamıyor gibi görünüyor — adresi kontrol eder misin?",
      errContent: "Bu metin yayın kurallarımıza uymuyor, lütfen düzenleyip tekrar dene.",
      errMailDate: "Mail gönderim tarihi bugünden ileri ve en fazla 5 yıl sonrası olmalı.",
      errRetentionDate: "Saklama tarihi bugünden ileri ve en fazla 5 yıl sonrası olmalı.",
      success: "Kavanoza bırakıldı!",
      copied: "Kopyalandı!",
      loadError: "Yüklenemedi.",
      empty: "Bu kavanoz henüz boş.",
      shelfEmpty: "Rafta henüz arşivlenmiş kavanoz yok.",
      manageNotFound: "Bu anahtarla eşleşen bir not bulunamadı.",
      manageDeleted: "Not silindi.",
      manageSaved: "Değişiklikler kaydedildi.",
      confirmDelete: "Bu notu kalıcı olarak silmek istediğine emin misin?",
      activeJarBadge: "🫙 Aktif Kavanoz",
      archivedJarBadge: function (id) { return "Kavanoz #" + id; },
      backToActive: "◀ Aktif Kavanoza Dön",
      capacityBadge: function (n, cap) { return "Kapasite: " + n + " / " + cap + " Not"; },
      archivedCapacityBadge: function (n) { return "Arşiv: " + n + " Not"; },
      archiveMenuTitle: "+ Arşiv Menüsü",
      archiveMenuMore: function (n) { return "+" + n + " Daha Eski"; },
      archiveMenuSub: "Geçmiş Kavanozlar",
      archiveMenuAction: "Tümünü İncele 📋",
      shelfJarBadge: function (id) { return "Kavanoz #" + id; },
      notesCountSuffix: " Not",
      archivedPrefix: "Arşivlendi: ",
      sealedTitle: "🔒 Bu not gizli",
      sealedBody: "Bu notun içeriğini yalnızca sahibi, yönetim anahtarıyla görebilir.",
      sealedSnippet: "🔒 Gizli not",
    },
    en: {
      anon: "Anonymous",
      sending: "Dropping into jar…",
      dropBtn: "Drop in the Jar",
      errGeneric: "Something went wrong, please try again.",
      errCaptcha: "Please complete the verification.",
      errEmail: "That email address doesn't look reachable — could you check it?",
      errContent: "This text doesn't meet our content guidelines, please edit and try again.",
      errMailDate: "The delivery date must be in the future, at most 5 years out.",
      errRetentionDate: "The retention date must be in the future, at most 5 years out.",
      success: "Dropped into the jar!",
      copied: "Copied!",
      loadError: "Couldn't load.",
      empty: "This jar is still empty.",
      shelfEmpty: "No archived jars on the shelf yet.",
      manageNotFound: "No note matches this key.",
      manageDeleted: "Note deleted.",
      manageSaved: "Changes saved.",
      confirmDelete: "Are you sure you want to permanently delete this note?",
      activeJarBadge: "🫙 Active Jar",
      archivedJarBadge: function (id) { return "Jar #" + id; },
      backToActive: "◀ Back to Active Jar",
      capacityBadge: function (n, cap) { return "Capacity: " + n + " / " + cap + " Notes"; },
      archivedCapacityBadge: function (n) { return "Archive: " + n + " Notes"; },
      archiveMenuTitle: "+ Archive Menu",
      archiveMenuMore: function (n) { return "+" + n + " Older Jars"; },
      archiveMenuSub: "Past Jars",
      archiveMenuAction: "View All 📋",
      shelfJarBadge: function (id) { return "Jar #" + id; },
      notesCountSuffix: " Notes",
      archivedPrefix: "Archived: ",
      sealedTitle: "🔒 This note is private",
      sealedBody: "Only the owner can see this note's content, with their management key.",
      sealedSnippet: "🔒 Private note",
    },
  }[LANG];

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var langBtn = document.getElementById("lang-btn");
  if (langBtn) {
    langBtn.addEventListener("click", function () {
      var nextLang = LANG === "tr" ? "en" : "tr";
      try { localStorage.setItem("kavanozLang", nextLang); } catch (e) {}
      location.href = nextLang === "en" ? "/en/" : "/";
    });
  }

  document.querySelectorAll(".lang-switch a").forEach(function (el) {
    el.addEventListener("click", function () {
      var href = el.getAttribute("href") || "";
      var isEn = href.indexOf("/en") !== -1;
      try { localStorage.setItem("kavanozLang", isEn ? "en" : "tr"); } catch (e) {}
    });
  });

  function escapeHtml(str) {
    if (!str) return "";
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDate(iso) {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString(LANG === "en" ? "en-GB" : "tr-TR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (e) {
      return iso;
    }
  }

  // ---------------- Modallar Genel ----------------
  function openModal(id) {
    var el = document.getElementById(id);
    if (el) el.hidden = false;
  }
  function closeModal(id) {
    var el = document.getElementById(id);
    if (el) el.hidden = true;
  }

  // ---------------- Not Ekle Modal ----------------
  var openAddNoteBtns = document.querySelectorAll(".open-add-note-btn");
  var addNoteModal = document.getElementById("add-note-modal");
  var addNoteClose = document.getElementById("add-note-modal-close");
  var messageEl = document.getElementById("message");
  var charCountEl = document.getElementById("char-count");

  function openDropForm() {
    openModal("add-note-modal");
    setTimeout(function () { if (messageEl) messageEl.focus(); }, 100);
  }
  function closeDropForm() { closeModal("add-note-modal"); }

  Array.prototype.forEach.call(openAddNoteBtns, function (btn) {
    btn.addEventListener("click", openDropForm);
  });
  if (addNoteClose) addNoteClose.addEventListener("click", closeDropForm);
  if (addNoteModal) {
    addNoteModal.addEventListener("click", function (e) {
      if (e.target === addNoteModal) closeDropForm();
    });
  }

  if (messageEl && charCountEl) {
    messageEl.addEventListener("input", function () {
      charCountEl.textContent = messageEl.value.length;
    });
  }

  var wantMailCheckbox = document.getElementById("wantMail");
  var mailFields = document.getElementById("mail-fields");
  if (wantMailCheckbox && mailFields) {
    wantMailCheckbox.addEventListener("change", function () {
      mailFields.style.display = wantMailCheckbox.checked ? "grid" : "none";
    });
  }

  var moreToggle = document.getElementById("more-options-toggle");
  var moreOptions = document.getElementById("more-options");
  if (moreToggle && moreOptions) {
    moreToggle.addEventListener("click", function () {
      var show = moreOptions.hidden;
      moreOptions.hidden = !show;
      moreToggle.textContent = show
        ? (LANG === "en" ? "− email / retention options" : "− mail / saklama süresi seçenekleri")
        : (LANG === "en" ? "+ email / retention options" : "+ mail / saklama süresi seçenekleri");
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
      if (retentionUntilInput) {
        retentionUntilInput.style.display = selectedRetention === "until_date" ? "block" : "none";
      }
    });
  }

  // ---------------- Header / Anahtar Yönetimi Modalı ----------------
  var manageOpenBtn = document.getElementById("manage-open-btn");
  var manageModal = document.getElementById("manage-modal");
  var manageModalClose = document.getElementById("manage-modal-close");
  if (manageOpenBtn) manageOpenBtn.addEventListener("click", function () { openModal("manage-modal"); });
  if (manageModalClose) manageModalClose.addEventListener("click", function () { closeModal("manage-modal"); });
  if (manageModal) {
    manageModal.addEventListener("click", function (e) {
      if (e.target === manageModal) closeModal("manage-modal");
    });
  }

  // ---------------- Nasıl Çalışır Modalı ----------------
  var howItWorksBtn = document.getElementById("how-it-works-btn");
  var howItWorksLink = document.getElementById("how-it-works-link");
  var howItWorksModal = document.getElementById("how-it-works-modal");
  var howItWorksClose = document.getElementById("how-it-works-close");
  function openHowItWorks(e) {
    if (e) e.preventDefault();
    openModal("how-it-works-modal");
  }
  if (howItWorksBtn) howItWorksBtn.addEventListener("click", openHowItWorks);
  if (howItWorksLink) howItWorksLink.addEventListener("click", openHowItWorks);
  if (howItWorksClose) howItWorksClose.addEventListener("click", function () { closeModal("how-it-works-modal"); });
  if (howItWorksModal) {
    howItWorksModal.addEventListener("click", function (e) {
      if (e.target === howItWorksModal) closeModal("how-it-works-modal");
    });
  }

  // ---------------- Note View Modal ----------------
  var noteModal = document.getElementById("note-modal");
  var noteModalClose = document.getElementById("note-modal-close");
  if (noteModalClose) noteModalClose.addEventListener("click", function () { closeModal("note-modal"); });
  if (noteModal) {
    noteModal.addEventListener("click", function (e) {
      if (e.target === noteModal) closeModal("note-modal");
    });
  }

  function showNoteModal(note) {
    if (!note) return;
    var messageEl = document.getElementById("note-modal-message");
    document.getElementById("note-modal-name").textContent = note.displayName || T.anon;
    document.getElementById("note-modal-date").textContent = formatDate(note.createdAt);
    if (note.sealed) {
      messageEl.classList.add("note-view-sealed");
      messageEl.textContent = T.sealedTitle + "\n" + T.sealedBody;
    } else {
      messageEl.classList.remove("note-view-sealed");
      messageEl.textContent = note.message;
    }
    openModal("note-modal");
  }

  // ---------------- Key Onay Modalı ----------------
  var keyModal = document.getElementById("key-modal");
  var keyModalClose = document.getElementById("key-modal-close");
  var keyModalOk = document.getElementById("key-modal-ok");
  var keyCopyBtn = document.getElementById("key-copy-btn");
  var keyDisplay = document.getElementById("key-display");

  function showKeyModal(key) {
    if (keyDisplay) keyDisplay.textContent = key;
    openModal("key-modal");
  }
  if (keyModalClose) keyModalClose.addEventListener("click", function () { closeModal("key-modal"); });
  if (keyModalOk) keyModalOk.addEventListener("click", function () { closeModal("key-modal"); });
  if (keyModal) {
    keyModal.addEventListener("click", function (e) {
      if (e.target === keyModal) closeModal("key-modal");
    });
  }
  if (keyCopyBtn) {
    keyCopyBtn.addEventListener("click", function () {
      var text = keyDisplay ? keyDisplay.textContent : "";
      if (navigator.clipboard && text) {
        navigator.clipboard.writeText(text).then(function () {
          var orig = keyCopyBtn.textContent;
          keyCopyBtn.textContent = T.copied;
          setTimeout(function () { keyCopyBtn.textContent = orig; }, 1500);
        }).catch(function () {});
      }
    });
  }

  // ---------------- Form Gönderimi ----------------
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

      var isPrivateCheckbox = document.getElementById("isPrivate");
      var payload = {
        message: messageEl.value,
        displayName: document.getElementById("displayName").value,
        lang: LANG,
        retentionMode: selectedRetention,
        hcaptchaToken: hcaptchaToken,
        visibility: isPrivateCheckbox && isPrivateCheckbox.checked ? "private" : "public",
      };
      if (wantMailCheckbox && wantMailCheckbox.checked) {
        payload.email = document.getElementById("email").value;
        var mailDate = document.getElementById("mailSendAt").value;
        payload.mailSendAt = mailDate ? new Date(mailDate + "T12:00:00").toISOString() : null;
      }
      if (selectedRetention === "until_date" && retentionUntilInput) {
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
        .then(function (res) {
          return res.json().then(function (body) { return { ok: res.ok, body: body }; });
        })
        .then(function (result) {
          if (result.ok) {
            var justAdded = {
              id: result.body.id,
              displayName: document.getElementById("displayName").value.trim() || null,
              sealed: payload.visibility === "private",
              message: payload.visibility === "private" ? null : messageEl.value,
              createdAt: new Date().toISOString(),
            };
            formMsg.className = "form-msg success";
            formMsg.textContent = T.success;
            form.reset();
            if (mailFields) mailFields.style.display = "none";
            if (retentionUntilInput) retentionUntilInput.style.display = "none";
            if (moreOptions) moreOptions.hidden = true;
            if (moreToggle) {
              moreToggle.textContent = LANG === "en" ? "+ email / retention options" : "+ mail / saklama süresi seçenekleri";
            }
            selectedRetention = "admin";
            if (retentionGroup) {
              Array.prototype.forEach.call(retentionGroup.children, function (b) { b.classList.remove("selected"); });
              retentionGroup.children[0].classList.add("selected");
            }
            if (window.hcaptcha) window.hcaptcha.reset();
            if (charCountEl) charCountEl.textContent = "0";

            closeDropForm();
            showKeyModal(result.body.managementKey);

            if (window.__kavanozJar) {
              window.__kavanozJar.addNote(1, [justAdded]);
            }
            loadActiveJar();
            loadShelf();
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
          submitBtn.textContent = T.dropBtn;
        });
    });
  }

  // ---------------- Fizik Kavanozu & Sallama (Mektup Zarfları Fiziği) ----------------
  var jarCanvas = document.getElementById("jar-canvas");
  var jarCapacityText = document.getElementById("jar-capacity-text");
  var jarProgressFill = document.getElementById("jar-progress-fill");
  var jarShakeBtn = document.getElementById("jar-shake-btn");
  var backToActiveBtn = document.getElementById("back-to-active-btn");

  if (jarCanvas && window.Matter && window.KavanozJar) {
    jarCanvas.width = 288;
    jarCanvas.height = 312;
    window.__kavanozJar = new window.KavanozJar(jarCanvas, {
      onNoteClick: function (noteData) {
        if (noteData) showNoteModal(noteData);
      },
    });
  }

  if (jarShakeBtn) {
    jarShakeBtn.addEventListener("click", function () {
      if (window.__kavanozJar) {
        window.__kavanozJar.shake(2.8);
      }
    });
  }

  // ---------------- Kavanozdaki Yazılar Çekmecesi ----------------
  var jarDrawerToggle = document.getElementById("jar-drawer-toggle");
  var jarDrawerPanel = document.getElementById("jar-drawer-panel");
  var jarDrawerItems = document.getElementById("jar-drawer-items");
  var activeNotesList = [];

  function renderDrawerNotes() {
    if (!jarDrawerItems) return;
    jarDrawerItems.innerHTML = "";
    if (activeNotesList.length === 0) {
      jarDrawerItems.innerHTML = '<div style="padding:16px; color:var(--ink-dim); font-size:0.85rem; text-align:center;">' + T.empty + '</div>';
      return;
    }
    activeNotesList.forEach(function (note) {
      var item = document.createElement("div");
      item.className = "drawer-note-item";
      var snippet = note.sealed ? T.sealedSnippet : note.message;
      item.innerHTML =
        '<div class="drawer-note-name">' + escapeHtml(note.displayName || T.anon) + '</div>' +
        '<div class="drawer-note-snippet' + (note.sealed ? ' is-sealed' : '') + '">' + escapeHtml(snippet) + '</div>' +
        '<div class="drawer-note-date">' + escapeHtml(formatDate(note.createdAt)) + '</div>';
      item.addEventListener("click", function () { showNoteModal(note); });
      jarDrawerItems.appendChild(item);
    });
  }

  if (jarDrawerToggle && jarDrawerPanel) {
    jarDrawerToggle.addEventListener("click", function () {
      var hidden = jarDrawerPanel.hidden;
      jarDrawerPanel.hidden = !hidden;
      if (!jarDrawerPanel.hidden) renderDrawerNotes();
    });
  }

  var currentJarId = null;
  var currentJarIsActive = true;

  function loadJarNotes(jarId) {
    var url = "/api/jars/" + jarId + "/notes?limit=60";
    return fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var items = data.items || [];
        activeNotesList = items;
        if (jarDrawerPanel && !jarDrawerPanel.hidden) renderDrawerNotes();
        if (window.__kavanozJar) {
          window.__kavanozJar.setNotes(items);
        }
        return data;
      });
  }

  function loadActiveJar() {
    currentJarIsActive = true;
    if (backToActiveBtn) backToActiveBtn.hidden = true;

    fetch("/api/jars/active")
      .then(function (res) { return res.json(); })
      .then(function (summary) {
        currentJarId = summary.id;
        if (jarCapacityText) {
          jarCapacityText.textContent = T.capacityBadge(summary.noteCount, summary.capacity);
        }
        if (jarProgressFill) {
          var pct = Math.min(100, Math.round((summary.noteCount / summary.capacity) * 100));
          jarProgressFill.style.width = Math.max(pct, summary.noteCount > 0 ? 6 : 0) + "%";
        }
        return loadJarNotes(currentJarId);
      })
      .catch(function () {
        if (jarCapacityText) jarCapacityText.textContent = T.loadError;
      });
  }

  function viewArchivedJar(jarId, meta) {
    currentJarIsActive = false;
    currentJarId = jarId;

    if (backToActiveBtn) backToActiveBtn.hidden = false;
    if (jarCapacityText) {
      jarCapacityText.textContent = T.archivedJarBadge(jarId) + " · " + T.archivedCapacityBadge(meta.noteCount);
    }
    if (jarProgressFill) {
      jarProgressFill.style.width = "100%";
    }

    loadJarNotes(jarId);
  }

  if (backToActiveBtn) {
    backToActiveBtn.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelectorAll(".jarbtn").forEach(function (c) { c.classList.remove("is-active"); });
      loadActiveJar();
    });
  }

  // ---------------- Kademeli 3D Raflar (Üstte 2 Kavanoz, Altta 3 Kavanoz: 2 Eski + 1 Arşiv Menüsü) ----------------
  var shelf1El = document.getElementById("shelf-1-jars");
  var shelf2El = document.getElementById("shelf-2-jars");
  var shelfListModal = document.getElementById("shelf-list-modal");
  var shelfListClose = document.getElementById("shelf-list-modal-close");
  var shelfListItems = document.getElementById("shelf-list-items");

  var TINT_PALETTE = ["sky", "rose", "mint", "peach", "lilac"];
  var allArchivedJars = [];

  function getJarTint(id) {
    var num = typeof id === "number" ? id : parseInt(id, 10) || 0;
    return TINT_PALETTE[Math.abs(num) % TINT_PALETTE.length];
  }

  function createShelfJarCard(jar, active) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "jarbtn" + (active ? " is-active" : "");
    btn.setAttribute("aria-label", T.shelfJarBadge(jar.id) + " kavanozunu aç");

    var tint = getJarTint(jar.id);
    var dateStr = formatDate(jar.archivedAt || jar.createdAt);

    btn.innerHTML =
      '<span class="jar">' +
        '<span class="small-lid"><i /><i /><i /></span>' +
        '<span class="small-neck"></span>' +
        '<span class="small-glass">' +
          '<span class="small-glass-shine"></span>' +
          '<span class="label ' + tint + '">' +
            '<strong>' + escapeHtml(T.shelfJarBadge(jar.id)) + '</strong>' +
            '<small>' + escapeHtml(T.archivedPrefix + dateStr) + '</small>' +
            '<em>' + jar.noteCount + T.notesCountSuffix + '</em>' +
          '</span>' +
        '</span>' +
        '<span class="jar-contact-shadow"></span>' +
      '</span>';

    btn.addEventListener("click", function () {
      document.querySelectorAll(".jarbtn").forEach(function (c) { c.classList.remove("is-active"); });
      btn.classList.add("is-active");
      viewArchivedJar(jar.id, jar);
    });
    return btn;
  }

  function createArchiveMenuJar(remainingCount) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "jarbtn archive-selector-btn";
    btn.setAttribute("aria-label", "Eski Kavanozlar Menüsü");

    var titleText = remainingCount > 0 ? T.archiveMenuMore(remainingCount) : T.archiveMenuTitle;

    btn.innerHTML =
      '<span class="jar">' +
        '<span class="small-lid archive-menu-lid"><i /><i /><i /></span>' +
        '<span class="small-neck"></span>' +
        '<span class="small-glass archive-menu-glass">' +
          '<span class="small-glass-shine"></span>' +
          '<span class="label archive-menu-label">' +
            '<strong>' + escapeHtml(titleText) + '</strong>' +
            '<small>' + escapeHtml(T.archiveMenuSub) + '</small>' +
            '<em>' + escapeHtml(T.archiveMenuAction) + '</em>' +
          '</span>' +
        '</span>' +
        '<span class="jar-contact-shadow"></span>' +
      '</span>';

    btn.addEventListener("click", openShelfListModal);
    return btn;
  }

  function renderShelves(items, total) {
    if (!shelf1El || !shelf2El) return;
    shelf1El.innerHTML = "";
    shelf2El.innerHTML = "";

    if (!items || items.length === 0) {
      var hint = document.createElement("div");
      hint.className = "shelf-empty-hint";
      hint.textContent = T.shelfEmpty;
      shelf1El.appendChild(hint);
      return;
    }

    // 1. Üst Raf: Tam 2 Eski Kavanoz
    var upperJars = items.slice(0, 2);
    upperJars.forEach(function (jar) {
      shelf1El.appendChild(createShelfJarCard(jar, !currentJarIsActive && currentJarId === jar.id));
    });

    // 2. Alt Raf: 3 Slot (2 Eski Kavanoz + En Alt Sağda Arşiv Menüsü Kavanozu)
    var lowerJars = items.slice(2, 4);
    lowerJars.forEach(function (jar) {
      shelf2El.appendChild(createShelfJarCard(jar, !currentJarIsActive && currentJarId === jar.id));
    });

    // En alt sağdaki 3. slot: Arşiv Menüsü ve Kalan Sayaç
    var shownCount = upperJars.length + lowerJars.length;
    var remainingCount = Math.max(total - shownCount, 0);
    shelf2El.appendChild(createArchiveMenuJar(remainingCount));
  }

  function loadShelf() {
    fetch("/api/jars/shelf?limit=150")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var items = data.items || [];
        var total = data.total || items.length;
        allArchivedJars = items;
        renderShelves(items, total);
      })
      .catch(function () {
        renderShelves([], 0);
      });
  }

  function openShelfListModal() {
    if (!shelfListItems) return;
    shelfListItems.innerHTML = "";

    if (allArchivedJars.length === 0) {
      shelfListItems.innerHTML = '<li style="padding:16px; text-align:center;">' + T.shelfEmpty + '</li>';
      openModal("shelf-list-modal");
      return;
    }

    allArchivedJars.forEach(function (jar) {
      var li = document.createElement("li");
      li.innerHTML =
        '<span class="jar-id-title">' + T.shelfJarBadge(jar.id) + '</span>' +
        '<span class="shelf-list-meta">' + formatDate(jar.archivedAt || jar.createdAt) + ' · ' + jar.noteCount + T.notesCountSuffix + '</span>';
      li.addEventListener("click", function () {
        closeModal("shelf-list-modal");
        document.querySelectorAll(".jarbtn").forEach(function (c) { c.classList.remove("is-active"); });
        viewArchivedJar(jar.id, jar);
      });
      shelfListItems.appendChild(li);
    });
    openModal("shelf-list-modal");
  }

  if (shelfListClose) shelfListClose.addEventListener("click", function () { closeModal("shelf-list-modal"); });
  if (shelfListModal) {
    shelfListModal.addEventListener("click", function (e) {
      if (e.target === shelfListModal) closeModal("shelf-list-modal");
    });
  }

  // ---------------- Notunu Yönet İşlemleri ----------------
  var manageKeyInput = document.getElementById("manageKey");
  var manageFetchBtn = document.getElementById("manage-fetch-btn");
  var manageMsg = document.getElementById("manage-msg");
  var manageResult = document.getElementById("manage-result");
  var manageWantMail = document.getElementById("manageWantMail");
  var manageIsPrivate = document.getElementById("manageIsPrivate");
  var manageMailFields = document.getElementById("manage-mail-fields");
  var manageSaveBtn = document.getElementById("manage-save-btn");
  var manageDeleteBtn = document.getElementById("manage-delete-btn");

  if (manageWantMail && manageMailFields) {
    manageWantMail.addEventListener("change", function () {
      manageMailFields.style.display = manageWantMail.checked ? "grid" : "none";
    });
  }

  function manageRequest(action, extra) {
    var key = manageKeyInput ? manageKeyInput.value.trim() : "";
    var body = Object.assign({ managementKey: key, action: action }, extra || {});
    return fetch("/api/notes/manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(function (res) {
      return res.json().then(function (data) { return { ok: res.ok, data: data }; });
    });
  }

  if (manageFetchBtn) {
    manageFetchBtn.addEventListener("click", function () {
      if (manageMsg) {
        manageMsg.className = "form-msg";
        manageMsg.textContent = "";
      }
      if (manageResult) manageResult.hidden = true;

      manageRequest("get").then(function (result) {
        if (!result.ok) {
          if (manageMsg) {
            manageMsg.className = "form-msg error";
            manageMsg.textContent = T.manageNotFound;
          }
          return;
        }
        var note = result.data.note;
        document.getElementById("manageMessage").value = note.message;
        document.getElementById("manageDisplayName").value = note.displayName || "";
        if (manageIsPrivate) manageIsPrivate.checked = note.visibility === "private";
        if (manageWantMail) manageWantMail.checked = !!note.email;
        if (manageMailFields) manageMailFields.style.display = note.email ? "grid" : "none";
        document.getElementById("manageEmail").value = note.email || "";
        document.getElementById("manageMailSendAt").value = note.mailSendAt ? note.mailSendAt.slice(0, 10) : "";
        if (manageResult) manageResult.hidden = false;
      });
    });
  }

  if (manageSaveBtn) {
    manageSaveBtn.addEventListener("click", function () {
      var fields = {
        message: document.getElementById("manageMessage").value,
        displayName: document.getElementById("manageDisplayName").value,
        visibility: manageIsPrivate && manageIsPrivate.checked ? "private" : "public",
      };
      if (manageWantMail && manageWantMail.checked) {
        fields.email = document.getElementById("manageEmail").value;
        var d = document.getElementById("manageMailSendAt").value;
        fields.mailSendAt = d ? new Date(d + "T12:00:00").toISOString() : null;
      } else {
        fields.email = null;
        fields.mailSendAt = null;
      }

      manageRequest("update", fields).then(function (result) {
        if (manageMsg) {
          manageMsg.className = "form-msg " + (result.ok ? "success" : "error");
          manageMsg.textContent = result.ok ? T.manageSaved : (ERROR_MAP[result.data.error] || T.errGeneric);
        }
        if (result.ok) {
          loadActiveJar();
        }
      });
    });
  }

  if (manageDeleteBtn) {
    manageDeleteBtn.addEventListener("click", function () {
      if (!confirm(T.confirmDelete)) return;
      manageRequest("delete").then(function (result) {
        if (manageMsg) {
          manageMsg.className = "form-msg " + (result.ok ? "success" : "error");
          manageMsg.textContent = result.ok ? T.manageDeleted : T.manageNotFound;
        }
        if (result.ok) {
          if (manageResult) manageResult.hidden = true;
          if (manageKeyInput) manageKeyInput.value = "";
          loadActiveJar();
          loadShelf();
        }
      });
    });
  }

  // İlk Yükleme
  loadActiveJar();
  loadShelf();
})();
