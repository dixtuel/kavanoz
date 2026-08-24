/*
 * Kavanozun içindeki kapalı mektup/zarf notlarının gerçek fizikle (Matter.js)
 * düşmesi, yığılması, sürüklenmesi ve kavanozun sallanabilmesi için fizik katmanı.
 */
(function (global) {
  "use strict";

  var NOTE_COLORS = [
    "#FAD2D8", // Gül kurusu / pembe pastel
    "#C8E6C9", // Nane / adaçayı pastel
    "#BBDEFB", // Açık gökyüzü mavisi
    "#FFF3CD", // Bal sarısı pastel
    "#E1D5E7", // Lavanta pastel
    "#FFE0B2", // Açık şeftali
    "#D1E7DD", // Yumuşak yeşil
    "#F8D7DA"  // Pudra pembe
  ];
  var MAX_NOTES = 36;

  // Zarf/mektup görünümlü data-URI doku üretir (kapalı zarf, katlama çizgileri ve mühür).
  var envelopeCache = {};
  function envelopeTexture(color) {
    if (envelopeCache[color]) return envelopeCache[color];
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 60 40">' +
      '<rect x="2" y="2" width="56" height="36" rx="4" fill="' + color + '" stroke="rgba(50,45,35,0.35)" stroke-width="1.5"/>' +
      '<path d="M4 5 L30 22 L56 5" fill="none" stroke="rgba(50,45,35,0.32)" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<path d="M4 36 L22 20" fill="none" stroke="rgba(50,45,35,0.18)" stroke-width="1.2" stroke-linecap="round"/>' +
      '<path d="M56 36 L38 20" fill="none" stroke="rgba(50,45,35,0.18)" stroke-width="1.2" stroke-linecap="round"/>' +
      '<circle cx="30" cy="21.5" r="3.2" fill="#C24A2E" opacity="0.82"/>' +
      '</svg>';
    var uri = "data:image/svg+xml;utf8," + encodeURIComponent(svg);
    envelopeCache[color] = uri;
    return uri;
  }

  function KavanozJar(canvas, opts) {
    this.canvas = canvas;
    this.opts = opts || {};
    this.width = canvas.clientWidth || 320;
    this.height = canvas.clientHeight || 360;
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
    engine.gravity.y = 1.05;
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

    // Kavanozun iç sınırları: alt taban, sol/sağ duvarlar, yuvarlak dip köşeleri.
    var w = this.width, h = this.height;
    var wallOpts = { isStatic: true, restitution: 0.2, friction: 0.6, render: { visible: false } };
    var floor = Bodies.rectangle(w / 2, h + 10, w * 0.94, 24, wallOpts);
    var leftWall = Bodies.rectangle(w * 0.07, h * 0.5, 18, h * 0.96, wallOpts);
    var rightWall = Bodies.rectangle(w * 0.93, h * 0.5, 18, h * 0.96, wallOpts);
    var floorLeft = Bodies.rectangle(w * 0.15, h * 0.95, w * 0.2, 20, Object.assign({ angle: -0.4 }, wallOpts));
    var floorRight = Bodies.rectangle(w * 0.85, h * 0.95, w * 0.2, 20, Object.assign({ angle: 0.4 }, wallOpts));
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
        Body.setAngularVelocity(e.body, (Math.random() - 0.5) * 0.25);
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

    this._dropZoneX = [w * 0.22, w * 0.78];
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
    }, 70);
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
      var w = 40, h = 26; // Zarf boyutları
      var body = Bodies.rectangle(x, -25 - Math.random() * 50, w, h, {
        chamfer: { radius: 3 },
        angle: (Math.random() - 0.5) * 1.1,
        restitution: 0.22,
        friction: 0.65,
        frictionAir: 0.014,
        density: 0.002,
        render: {
          sprite: { texture: envelopeTexture(color), xScale: w / 60, yScale: h / 40 },
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
        x: (Math.random() - 0.5) * 0.035 * s,
        y: -Math.random() * 0.02 * s,
      });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2 * s);
    });

    var glass = this.canvas.closest(".jar-canvas-glass");
    if (glass && !glass.classList.contains("shaking")) {
      glass.classList.add("shaking");
      setTimeout(function () { glass.classList.remove("shaking"); }, 350);
    }
  };

  global.KavanozJar = KavanozJar;
})(window);
