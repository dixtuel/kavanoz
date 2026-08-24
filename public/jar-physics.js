/*
 * Kavanozun içindeki notların gerçek fizikle (Matter.js) düşmesi, yığılması ve
 * sürüklenip sallanabilmesi için ince bir katman. Fizik tamamen istemci
 * tarafında çalışır — sunucuya hiçbir yük bindirmez.
 */
(function (global) {
  "use strict";

  var NOTE_COLORS = ["#F2A2A2", "#A8CDD6", "#B7C9A0", "#F2CB6E", "#D9C9F0"];
  var MAX_NOTES = 34;

  // Zarf/mektup görünümlü küçük bir doku üretir (data URI, ağ isteği yok).
  var envelopeCache = {};
  function envelopeTexture(color) {
    if (envelopeCache[color]) return envelopeCache[color];
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="52" height="34" viewBox="0 0 52 34">' +
      '<rect x="1.5" y="1.5" width="49" height="31" rx="4" fill="' + color + '" stroke="rgba(46,42,34,0.32)" stroke-width="1.5"/>' +
      '<path d="M3 4 L26 20 L49 4" fill="none" stroke="rgba(46,42,34,0.34)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>";
    var uri = "data:image/svg+xml;utf8," + encodeURIComponent(svg);
    envelopeCache[color] = uri;
    return uri;
  }

  function KavanozJar(canvas, opts) {
    this.canvas = canvas;
    this.opts = opts || {};
    this.width = canvas.clientWidth;
    this.height = canvas.clientHeight;
    this.notes = [];
    this._setup();
  }

  KavanozJar.prototype._setup = function () {
    var Matter = global.Matter;
    var Engine = Matter.Engine, Render = Matter.Render, World = Matter.World, Bodies = Matter.Bodies,
      Mouse = Matter.Mouse, MouseConstraint = Matter.MouseConstraint, Body = Matter.Body, Events = Matter.Events;

    var engine = Engine.create();
    engine.gravity.y = 1;
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

    // Kavanozun iç sınırları: sol/sağ camlar + zemin. Ağız kısmı açık —
    // notlar üstten düşer, camın görünür genişliği dışına taşmaz.
    var w = this.width, h = this.height;
    var wallOpts = { isStatic: true, restitution: 0.15, friction: 0.6, render: { visible: false } };
    var floor = Bodies.rectangle(w / 2, h + 8, w * 0.92, 20, wallOpts);
    var leftWall = Bodies.rectangle(w * 0.08, h * 0.55, 16, h * 0.95, wallOpts);
    var rightWall = Bodies.rectangle(w * 0.92, h * 0.55, 16, h * 0.95, wallOpts);
    // Hafif eğik taban köşeleri: kavanozun yuvarlak dibini taklit eder.
    var floorLeft = Bodies.rectangle(w * 0.14, h * 0.94, w * 0.18, 16, Object.assign({ angle: -0.35 }, wallOpts));
    var floorRight = Bodies.rectangle(w * 0.86, h * 0.94, w * 0.18, 16, Object.assign({ angle: 0.35 }, wallOpts));
    World.add(engine.world, [floor, leftWall, rightWall, floorLeft, floorRight]);

    var mouse = Mouse.create(render.canvas);
    mouse.pixelRatio = dpr;
    var mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.15, render: { visible: false } },
    });
    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;
    this.mouseConstraint = mouseConstraint;

    // Bir notu tutup bırakınca hafif bir "sekme" hissi versin.
    Events.on(mouseConstraint, "enddrag", function (e) {
      Body.setAngularVelocity(e.body, (Math.random() - 0.5) * 0.3);
    });

    // Bir zarfa TIKLANDIYSA (sürüklenmediyse) ilişkili notu göster.
    var self = this;
    var pressStart = null;
    Events.on(mouseConstraint, "mousedown", function (e) {
      pressStart = { x: e.mouse.position.x, y: e.mouse.position.y, body: mouseConstraint.body };
    });
    Events.on(mouseConstraint, "mouseup", function (e) {
      if (!pressStart) return;
      var dx = e.mouse.position.x - pressStart.x, dy = e.mouse.position.y - pressStart.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (pressStart.body && dist < 6 && self.opts.onNoteClick) {
        self.opts.onNoteClick(pressStart.body.plugin && pressStart.body.plugin.noteData);
      }
      pressStart = null;
    });

    // Boş bir noktadan yatay sürükleme = kavanozu "salla". Bir zarf tutuluyorsa
    // (mouseConstraint.body dolu) bu devreye girmez, MouseConstraint kendi işini yapar.
    var shaking = false, lastX = 0, lastT = 0;
    this.canvas.addEventListener("pointerdown", function (e) {
      shaking = true;
      lastX = e.clientX;
      lastT = Date.now();
    });
    window.addEventListener("pointermove", function (e) {
      if (!shaking || mouseConstraint.body) return;
      var now = Date.now();
      var dt = now - lastT;
      if (dt > 12) {
        var vx = (e.clientX - lastX) / dt;
        if (Math.abs(vx) > 0.05) self.shake(Math.min(Math.abs(vx) * 30, 8));
        lastX = e.clientX;
        lastT = now;
      }
    });
    window.addEventListener("pointerup", function () { shaking = false; });

    Engine.run(engine);
    Render.run(render);

    this._dropZoneX = [w * 0.2, w * 0.8];
  };

  // notesData (opsiyonel): count ile aynı uzunlukta, her zarfa gerçek not verisini
  // (id, message, displayName, createdAt) bağlar — tıklanınca doğru not gösterilsin diye.
  KavanozJar.prototype.addNote = function (count, notesData) {
    var Matter = global.Matter;
    var Bodies = Matter.Bodies, World = Matter.World;
    count = count || 1;
    for (var i = 0; i < count; i++) {
      if (this.notes.length >= MAX_NOTES) {
        var oldest = this.notes.shift();
        World.remove(this.engine.world, oldest);
      }
      var x = this._dropZoneX[0] + Math.random() * (this._dropZoneX[1] - this._dropZoneX[0]);
      var color = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
      var w = 34, h = 22;
      var body = Bodies.rectangle(x, -20 - Math.random() * 60, w, h, {
        chamfer: { radius: 3 },
        angle: (Math.random() - 0.5) * 1.2,
        restitution: 0.25,
        friction: 0.7,
        frictionAir: 0.012,
        density: 0.0018,
        render: {
          sprite: { texture: envelopeTexture(color), xScale: w / 52, yScale: h / 34 },
        },
      });
      body.plugin = { noteData: notesData ? notesData[i] : null };
      World.add(this.engine.world, body);
      this.notes.push(body);
    }
  };

  // Kavanozu sallar: tüm notlara yatay/dikey rastgele bir itki uygular.
  KavanozJar.prototype.shake = function (strength) {
    var Matter = global.Matter;
    var Body = Matter.Body;
    var s = strength || 1;
    this.notes.forEach(function (body) {
      Body.applyForce(body, body.position, {
        x: (Math.random() - 0.5) * 0.03 * s,
        y: -Math.random() * 0.015 * s,
      });
    });
  };

  global.KavanozJar = KavanozJar;
})(window);
