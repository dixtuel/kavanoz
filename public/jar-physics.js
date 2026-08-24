/*
 * Sanal Kavanoz — Matter.js 2D Fizik Motoru
 * Kavanoz içine düşen renkli, mühürlü mektup zarfları, sallama ve tıklama fiziği.
 */
(function (global) {
  "use strict";

  var NOTE_COLORS = [
    "#FAD2D8", // Gül kurusu / pastel pembe
    "#C8E6C9", // Adaçayı / pastel nane
    "#BBDEFB", // Açık pastel mavi
    "#FFF3CD", // Bal sarısı pastel
    "#E1D5E7", // Lavanta pastel
    "#FFE0B2", // Açık şeftali
    "#D1E7DD", // Yumuşak yeşil
    "#FCE4D6", // Sıcak kayısı
    "#F8D7DA"  // Pudra pembe
  ];
  var MAX_NOTES = 50;

  // Yüksek çözünürlüklü, gerçekçi 3D katlamalı zarf dokusu (Data URI)
  var envelopeCache = {};
  function envelopeTexture(color) {
    if (envelopeCache[color]) return envelopeCache[color];
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="66" height="44" viewBox="0 0 66 44">' +
      '<defs>' +
      '  <linearGradient id="envGrad_' + color.replace('#','') + '" x1="0" y1="0" x2="0" y2="1">' +
      '    <stop offset="0%" stop-color="' + color + '"/>' +
      '    <stop offset="100%" stop-color="' + shadeColor(color, -10) + '"/>' +
      '  </linearGradient>' +
      '</defs>' +
      '<!-- Zarf Ana Gövde -->' +
      '<rect x="2" y="2" width="62" height="40" rx="5" fill="url(#envGrad_' + color.replace('#','') + ')" stroke="rgba(50,42,30,0.38)" stroke-width="1.6"/>' +
      '<!-- Üst Katlama Çizgisi (Kapak) -->' +
      '<path d="M3 4 L33 24 L63 4" fill="rgba(255,255,255,0.22)" stroke="rgba(50,42,30,0.35)" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<!-- Alt Katlama Çizgileri -->' +
      '<path d="M4 40 L25 21" fill="none" stroke="rgba(50,42,30,0.2)" stroke-width="1.3" stroke-linecap="round"/>' +
      '<path d="M62 40 L41 21" fill="none" stroke="rgba(50,42,30,0.2)" stroke-width="1.3" stroke-linecap="round"/>' +
      '<!-- Mühür Damgası -->' +
      '<circle cx="33" cy="23.5" r="4.2" fill="#C24A2E" stroke="#8E2D18" stroke-width="0.8"/>' +
      '<circle cx="33" cy="23.5" r="2.2" fill="#E65A3D"/>' +
      '</svg>';
    var uri = "data:image/svg+xml;utf8," + encodeURIComponent(svg);
    envelopeCache[color] = uri;
    return uri;
  }

  function shadeColor(color, percent) {
    var num = parseInt(color.replace("#",""), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      B = ((num >> 8) & 0x00FF) + amt,
      G = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
  }

  function KavanozJar(canvas, opts) {
    this.canvas = canvas;
    this.opts = opts || {};
    this.width = canvas.clientWidth || 282;
    this.height = canvas.clientHeight || 305;
    this.notes = [];
    this._setup();
  }

  KavanozJar.prototype._setup = function () {
    var Matter = global.Matter;
    if (!Matter) return;
    var Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint,
      Body = Matter.Body,
      Events = Matter.Events;

    var engine = Engine.create();
    engine.gravity.y = 1.0;
    this.engine = engine;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var render = Render.create({
      canvas: this.canvas,
      engine: engine,
      options: {
        width: this.width,
        height: this.height,
        pixelRatio: dpr,
        wireframes: false,
        background: "transparent",
      },
    });
    this.render = render;

    // Kavanoz iç fizik sınırları
    var w = this.width, h = this.height;
    var wallOpts = { isStatic: true, restitution: 0.18, friction: 0.65, render: { visible: false } };
    var floor = Bodies.rectangle(w / 2, h + 8, w * 0.94, 20, wallOpts);
    var leftWall = Bodies.rectangle(w * 0.06, h * 0.5, 18, h * 0.98, wallOpts);
    var rightWall = Bodies.rectangle(w * 0.94, h * 0.5, 18, h * 0.98, wallOpts);
    var floorLeft = Bodies.rectangle(w * 0.14, h * 0.94, w * 0.22, 18, Object.assign({ angle: -0.38 }, wallOpts));
    var floorRight = Bodies.rectangle(w * 0.86, h * 0.94, w * 0.22, 18, Object.assign({ angle: 0.38 }, wallOpts));
    World.add(engine.world, [floor, leftWall, rightWall, floorLeft, floorRight]);

    var mouse = Mouse.create(render.canvas);
    mouse.pixelRatio = dpr;
    var mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;
    this.mouseConstraint = mouseConstraint;

    Events.on(mouseConstraint, "enddrag", function (e) {
      if (e.body) {
        Body.setAngularVelocity(e.body, (Math.random() - 0.5) * 0.2);
      }
    });

    // Zarf tıklandığında ilişkili notu aç
    var self = this;
    var pressStart = null;
    Events.on(mouseConstraint, "mousedown", function (e) {
      pressStart = { x: e.mouse.position.x, y: e.mouse.position.y, body: mouseConstraint.body, time: Date.now() };
    });
    Events.on(mouseConstraint, "mouseup", function (e) {
      if (!pressStart) return;
      var dx = e.mouse.position.x - pressStart.x;
      var dy = e.mouse.position.y - pressStart.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var duration = Date.now() - pressStart.time;
      if (pressStart.body && dist < 8 && duration < 400 && self.opts.onNoteClick) {
        var noteData = pressStart.body.plugin && pressStart.body.plugin.noteData;
        if (noteData) self.opts.onNoteClick(noteData);
      }
      pressStart = null;
    });

    // Boş alandan sürükleme = kavanozu salla
    var shaking = false, lastX = 0, lastT = 0;
    this.canvas.addEventListener("pointerdown", function (e) {
      if (!mouseConstraint.body) {
        shaking = true;
        lastX = e.clientX;
        lastT = Date.now();
      }
    });
    window.addEventListener("pointermove", function (e) {
      if (!shaking || mouseConstraint.body) return;
      var now = Date.now();
      var dt = now - lastT;
      if (dt > 12) {
        var vx = (e.clientX - lastX) / dt;
        if (Math.abs(vx) > 0.04) {
          self.shake(Math.min(Math.abs(vx) * 28, 7));
        }
        lastX = e.clientX;
        lastT = now;
      }
    });
    window.addEventListener("pointerup", function () { shaking = false; });

    var runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    this._dropZoneX = [w * 0.2, w * 0.8];
  };

  KavanozJar.prototype.clearNotes = function () {
    var Matter = global.Matter;
    if (!Matter || !this.engine) return;
    var World = Matter.World;
    this.notes.forEach(function (body) {
      World.remove(this.engine.world, body);
    }, this);
    this.notes = [];
  };

  KavanozJar.prototype.setNotes = function (notesList) {
    this.clearNotes();
    if (!notesList || notesList.length === 0) return;
    var count = Math.min(notesList.length, MAX_NOTES);
    var self = this;
    var dropped = 0;
    var interval = setInterval(function () {
      if (dropped >= count) {
        clearInterval(interval);
        return;
      }
      self.addNote(1, [notesList[dropped]]);
      dropped++;
    }, 60);
  };

  KavanozJar.prototype.addNote = function (count, notesData) {
    var Matter = global.Matter;
    if (!Matter || !this.engine) return;
    var Bodies = Matter.Bodies, World = Matter.World;
    count = count || 1;
    for (var i = 0; i < count; i++) {
      if (this.notes.length >= MAX_NOTES) {
        var oldest = this.notes.shift();
        World.remove(this.engine.world, oldest);
      }
      var x = this._dropZoneX[0] + Math.random() * (this._dropZoneX[1] - this._dropZoneX[0]);
      var color = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
      var w = 46, h = 30; // Zarf boyutları (50 adede kadar kavanoza mükemmel oturur)
      var body = Bodies.rectangle(x, -25 - Math.random() * 45, w, h, {
        chamfer: { radius: 3.5 },
        angle: (Math.random() - 0.5) * 1.2,
        restitution: 0.2,
        friction: 0.7,
        frictionAir: 0.015,
        density: 0.002,
        render: {
          sprite: { texture: envelopeTexture(color), xScale: w / 66, yScale: h / 44 },
        },
      });
      body.plugin = { noteData: notesData ? notesData[i] : null };
      World.add(this.engine.world, body);
      this.notes.push(body);
    }
  };

  KavanozJar.prototype.shake = function (strength) {
    var Matter = global.Matter;
    if (!Matter) return;
    var Body = Matter.Body;
    var s = strength || 1.8;
    this.notes.forEach(function (body) {
      Body.applyForce(body, body.position, {
        x: (Math.random() - 0.5) * 0.04 * s,
        y: -Math.random() * 0.022 * s,
      });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.25 * s);
    });

    var glass = this.canvas.closest(".jar-canvas-glass");
    if (glass && !glass.classList.contains("shaking")) {
      glass.classList.add("shaking");
      setTimeout(function () { glass.classList.remove("shaking"); }, 350);
    }
  };

  global.KavanozJar = KavanozJar;
})(window);
