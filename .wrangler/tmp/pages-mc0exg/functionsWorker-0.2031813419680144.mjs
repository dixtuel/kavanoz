var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../../root/.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
var init_utils = __esm({
  "../../../root/.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
    __name(notImplementedClass, "notImplementedClass");
  }
});

// ../../../root/.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin, _performanceNow, nodeTiming, PerformanceEntry, PerformanceMark, PerformanceMeasure, PerformanceResourceTiming, PerformanceObserverEntryList, Performance, PerformanceObserver, performance;
var init_performance = __esm({
  "../../../root/.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry = class {
      static {
        __name(this, "PerformanceEntry");
      }
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
      static {
        __name(this, "PerformanceMark");
      }
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    };
    PerformanceMeasure = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceMeasure");
      }
      entryType = "measure";
    };
    PerformanceResourceTiming = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceResourceTiming");
      }
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    PerformanceObserverEntryList = class {
      static {
        __name(this, "PerformanceObserverEntryList");
      }
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    Performance = class {
      static {
        __name(this, "Performance");
      }
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e) => e.entryType === type);
      }
      mark(name, options) {
        const entry = new PerformanceMark(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    PerformanceObserver = class {
      static {
        __name(this, "PerformanceObserver");
      }
      __unenv__ = true;
      static supportedEntryTypes = [];
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});

// ../../../root/.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/perf_hooks.mjs
var init_perf_hooks = __esm({
  "../../../root/.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});

// ../../../root/.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
var init_performance2 = __esm({
  "../../../root/.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    if (!("__unenv__" in performance)) {
      const proto = Performance.prototype;
      for (const key of Object.getOwnPropertyNames(proto)) {
        if (key !== "constructor" && !(key in performance)) {
          const desc = Object.getOwnPropertyDescriptor(proto, key);
          if (desc) {
            Object.defineProperty(performance, key, desc);
          }
        }
      }
    }
    globalThis.performance = performance;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  }
});

// ../../../root/.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default;
var init_noop = __esm({
  "../../../root/.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});

// ../../../root/.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";
var _console, _ignoreErrors, _stderr, _stdout, log, info, trace, debug, table, error, warn, createTask, clear, count, countReset, dir, dirxml, group, groupEnd, groupCollapsed, profile, profileEnd, time, timeEnd, timeLog, timeStamp, Console, _times, _stdoutErrorHandler, _stderrErrorHandler;
var init_console = __esm({
  "../../../root/.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});

// ../../../root/.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole, assert, clear2, context, count2, countReset2, createTask2, debug2, dir2, dirxml2, error2, group2, groupCollapsed2, groupEnd2, info2, log2, profile2, profileEnd2, table2, time2, timeEnd2, timeLog2, timeStamp2, trace2, warn2, console_default;
var init_console2 = __esm({
  "../../../root/.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});

// ../../../root/.npm/_npx/32026684e21afda6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "../../../root/.npm/_npx/32026684e21afda6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});

// ../../../root/.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime;
var init_hrtime = __esm({
  "../../../root/.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, "bigint") });
  }
});

// ../../../root/.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream;
var init_read_stream = __esm({
  "../../../root/.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class {
      static {
        __name(this, "ReadStream");
      }
      fd;
      isRaw = false;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
    };
  }
});

// ../../../root/.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream;
var init_write_stream = __esm({
  "../../../root/.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class {
      static {
        __name(this, "WriteStream");
      }
      fd;
      columns = 80;
      rows = 24;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env2) {
        return 1;
      }
      hasColors(count3, env2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      write(str, encoding, cb) {
        if (str instanceof Uint8Array) {
          str = new TextDecoder().decode(str);
        }
        try {
          console.log(str);
        } catch {
        }
        cb && typeof cb === "function" && cb();
        return false;
      }
    };
  }
});

// ../../../root/.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/tty.mjs
var init_tty = __esm({
  "../../../root/.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});

// ../../../root/.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION;
var init_node_version = __esm({
  "../../../root/.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    NODE_VERSION = "22.14.0";
  }
});

// ../../../root/.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";
var Process;
var init_process = __esm({
  "../../../root/.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    init_node_version();
    Process = class _Process extends EventEmitter {
      static {
        __name(this, "Process");
      }
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      // --- event emitter ---
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      // --- stdio (lazy initializers) ---
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream(2);
      }
      // --- cwd ---
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      // --- dummy props and getters ---
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return `v${NODE_VERSION}`;
      }
      get versions() {
        return { node: NODE_VERSION };
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      // --- noop methods ---
      ref() {
      }
      unref() {
      }
      // --- unimplemented methods ---
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      // --- attached interfaces ---
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
      // --- undefined props ---
      mainModule = void 0;
      domain = void 0;
      // optional
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      // internals
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
  }
});

// ../../../root/.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess, getBuiltinModule, workerdProcess, unenvProcess, exit, features, platform, _channel, _debugEnd, _debugProcess, _disconnect, _events, _eventsCount, _exiting, _fatalException, _getActiveHandles, _getActiveRequests, _handleQueue, _kill, _linkedBinding, _maxListeners, _pendingMessage, _preload_modules, _rawDebug, _send, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, abort, addListener, allowedNodeEnvironmentFlags, arch, argv, argv0, assert2, availableMemory, binding, channel, chdir, config, connected, constrainedMemory, cpuUsage, cwd, debugPort, disconnect, dlopen, domain, emit, emitWarning, env, eventNames, execArgv, execPath, exitCode, finalization, getActiveResourcesInfo, getegid, geteuid, getgid, getgroups, getMaxListeners, getuid, hasUncaughtExceptionCaptureCallback, hrtime3, initgroups, kill, listenerCount, listeners, loadEnvFile, mainModule, memoryUsage, moduleLoadList, nextTick, off, on, once, openStdin, permission, pid, ppid, prependListener, prependOnceListener, rawListeners, reallyExit, ref, release, removeAllListeners, removeListener, report, resourceUsage, send, setegid, seteuid, setgid, setgroups, setMaxListeners, setSourceMapsEnabled, setuid, setUncaughtExceptionCaptureCallback, sourceMapsEnabled, stderr, stdin, stdout, throwDeprecation, title, traceDeprecation, umask, unref, uptime, version, versions, _process, process_default;
var init_process2 = __esm({
  "../../../root/.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    workerdProcess = getBuiltinModule("node:process");
    unenvProcess = new Process({
      env: globalProcess.env,
      hrtime,
      // `nextTick` is available from workerd process v1
      nextTick: workerdProcess.nextTick
    });
    ({ exit, features, platform } = workerdProcess);
    ({
      _channel,
      _debugEnd,
      _debugProcess,
      _disconnect,
      _events,
      _eventsCount,
      _exiting,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _handleQueue,
      _kill,
      _linkedBinding,
      _maxListeners,
      _pendingMessage,
      _preload_modules,
      _rawDebug,
      _send,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      arch,
      argv,
      argv0,
      assert: assert2,
      availableMemory,
      binding,
      channel,
      chdir,
      config,
      connected,
      constrainedMemory,
      cpuUsage,
      cwd,
      debugPort,
      disconnect,
      dlopen,
      domain,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exitCode,
      finalization,
      getActiveResourcesInfo,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getMaxListeners,
      getuid,
      hasUncaughtExceptionCaptureCallback,
      hrtime: hrtime3,
      initgroups,
      kill,
      listenerCount,
      listeners,
      loadEnvFile,
      mainModule,
      memoryUsage,
      moduleLoadList,
      nextTick,
      off,
      on,
      once,
      openStdin,
      permission,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      reallyExit,
      ref,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      send,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setMaxListeners,
      setSourceMapsEnabled,
      setuid,
      setUncaughtExceptionCaptureCallback,
      sourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      throwDeprecation,
      title,
      traceDeprecation,
      umask,
      unref,
      uptime,
      version,
      versions
    } = unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    };
    process_default = _process;
  }
});

// ../../../root/.npm/_npx/32026684e21afda6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "../../../root/.npm/_npx/32026684e21afda6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});

// _lib/turso.js
async function tursoQuery(env2, sql, args = []) {
  const dbUrl = env2.TURSO_DATABASE_URL.replace(/^libsql:\/\//, "https://");
  const authToken = env2.TURSO_AUTH_TOKEN;
  const body = {
    requests: [
      {
        type: "execute",
        stmt: {
          sql,
          args: args.map((arg) => {
            if (arg === null || arg === void 0) return { type: "null" };
            if (typeof arg === "number") return { type: "integer", value: String(arg) };
            return { type: "text", value: String(arg) };
          })
        }
      },
      { type: "close" }
    ]
  };
  const res = await fetch(`${dbUrl}/v2/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Turso HTTP hata ${res.status}: ${errText}`);
  }
  const data = await res.json();
  const execResult = data.results?.[0];
  if (execResult?.type === "error") {
    throw new Error(`Turso sorgu hatas\u0131: ${execResult.error.message}`);
  }
  const response = execResult?.response?.result;
  if (!response) return { rows: [], affected_row_count: 0 };
  const cols = response.cols.map((c) => c.name);
  const rows = (response.rows || []).map((row) => {
    const obj = {};
    row.forEach((val, idx) => {
      obj[cols[idx]] = val.value;
    });
    return obj;
  });
  return { rows, affected_row_count: response.affected_row_count || 0 };
}
async function ensureTables(env2) {
  if (tableInitialized) return;
  await tursoQuery(env2, `
    CREATE TABLE IF NOT EXISTS jars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived')),
      note_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      archived_at TEXT
    );
  `);
  await tursoQuery(env2, `
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      jar_id INTEGER NOT NULL REFERENCES jars(id),
      message_enc TEXT NOT NULL,
      display_name TEXT,
      lang TEXT NOT NULL DEFAULT 'tr',
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      email_enc TEXT,
      mail_send_at TEXT,
      mail_status TEXT NOT NULL DEFAULT 'none' CHECK (mail_status IN ('none','pending','sending','sent','failed')),
      mail_attempts INTEGER NOT NULL DEFAULT 0,
      mail_next_attempt_at TEXT,
      retention_mode TEXT NOT NULL DEFAULT 'admin' CHECK (retention_mode IN ('admin','until_date')),
      retention_until TEXT,
      management_key_hash TEXT NOT NULL,
      visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','private'))
    );
  `);
  await tursoQuery(env2, `CREATE INDEX IF NOT EXISTS idx_notes_jar ON notes(jar_id, id);`);
  await tursoQuery(env2, `CREATE UNIQUE INDEX IF NOT EXISTS idx_notes_key ON notes(management_key_hash);`);
  await tursoQuery(env2, `CREATE INDEX IF NOT EXISTS idx_jars_status ON jars(status, id);`);
  tableInitialized = true;
}
var tableInitialized;
var init_turso = __esm({
  "_lib/turso.js"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(tursoQuery, "tursoQuery");
    tableInitialized = false;
    __name(ensureTables, "ensureTables");
  }
});

// _lib/crypto.js
import crypto from "node:crypto";
import zlib from "node:zlib";
function loadKey(env2) {
  const hex = env2.KAVANOZ_ENC_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error("KAVANOZ_ENC_KEY tan\u0131ml\u0131 de\u011Fil veya 32 byte (64 hex karakter) uzunlu\u011Funda de\u011Fil");
  }
  return Buffer.from(hex, "hex");
}
function encrypt(env2, plainText) {
  if (plainText === null || plainText === void 0) return null;
  const key = loadKey(env2);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(String(plainText), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return ["v1", iv.toString("base64"), tag.toString("base64"), ciphertext.toString("base64")].join(":");
}
function decrypt(env2, payload) {
  if (!payload) return null;
  const parts = payload.split(":");
  if (parts.length !== 4 || parts[0] !== "v1") {
    throw new Error("Bilinmeyen \u015Fifreleme format\u0131");
  }
  const [, ivB64, tagB64, dataB64] = parts;
  const key = loadKey(env2);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  const plain = Buffer.concat([decipher.update(Buffer.from(dataB64, "base64")), decipher.final()]);
  return plain.toString("utf8");
}
function generateManagementKey() {
  return crypto.randomBytes(15).toString("base64url");
}
function hashManagementKey(key) {
  return crypto.createHash("sha256").update(key, "utf8").digest("hex");
}
function compressText(raw) {
  if (!raw || typeof raw !== "string" || raw.length < 24) return raw;
  try {
    const payload = `z64:${zlib.deflateSync(Buffer.from(raw, "utf8")).toString("base64")}`;
    return payload.length < raw.length ? payload : raw;
  } catch {
    return raw;
  }
}
function decompressText(stored) {
  if (!stored || typeof stored !== "string" || !stored.startsWith("z64:")) return stored;
  try {
    return zlib.inflateSync(Buffer.from(stored.slice(4), "base64")).toString("utf8");
  } catch {
    return stored;
  }
}
var init_crypto = __esm({
  "_lib/crypto.js"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(loadKey, "loadKey");
    __name(encrypt, "encrypt");
    __name(decrypt, "decrypt");
    __name(generateManagementKey, "generateManagementKey");
    __name(hashManagementKey, "hashManagementKey");
    __name(compressText, "compressText");
    __name(decompressText, "decompressText");
  }
});

// _lib/db.js
function jarCapacity(env2) {
  return Number(env2.JAR_CAPACITY || 50);
}
async function getOrCreateActiveJar(env2) {
  const existing = await tursoQuery(env2, `SELECT id, note_count FROM jars WHERE status='active' ORDER BY id DESC LIMIT 1`);
  if (existing.rows[0]) {
    return { id: Number(existing.rows[0].id), noteCount: Number(existing.rows[0].note_count) };
  }
  const created = await tursoQuery(env2, `INSERT INTO jars DEFAULT VALUES RETURNING id`);
  return { id: Number(created.rows[0].id), noteCount: 0 };
}
async function createNote(env2, { message, displayName, email, mailSendAt, lang, retentionMode, retentionUntil, managementKeyHash, visibility }) {
  await ensureTables(env2);
  const jar = await getOrCreateActiveJar(env2);
  const result = await tursoQuery(
    env2,
    `INSERT INTO notes (jar_id, message_enc, display_name, lang, email_enc, mail_send_at, mail_status, retention_mode, retention_until, management_key_hash, visibility)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
    [
      jar.id,
      encrypt(env2, compressText(message)),
      displayName || null,
      lang || "tr",
      email ? encrypt(env2, email) : null,
      mailSendAt || null,
      email ? "pending" : "none",
      retentionMode,
      retentionUntil || null,
      managementKeyHash,
      visibility === "private" ? "private" : "public"
    ]
  );
  const newCount = jar.noteCount + 1;
  await tursoQuery(env2, `UPDATE jars SET note_count = note_count + 1 WHERE id=?`, [jar.id]);
  const capacity = jarCapacity(env2);
  if (newCount >= capacity) {
    await tursoQuery(
      env2,
      `UPDATE jars SET status='archived', archived_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id=? AND status='active'`,
      [jar.id]
    );
  }
  return { id: Number(result.rows[0].id), jarId: jar.id, jarFilled: newCount >= capacity };
}
function noteRowToPublic(env2, row) {
  const sealed = row.visibility === "private";
  return {
    id: Number(row.id),
    jarId: Number(row.jar_id),
    displayName: row.display_name || null,
    sealed,
    message: sealed ? null : decompressText(decrypt(env2, row.message_enc)),
    createdAt: row.created_at
  };
}
async function listJarNotes(env2, jarId, beforeId, limit) {
  await ensureTables(env2);
  const result = await tursoQuery(
    env2,
    `SELECT id, jar_id, display_name, message_enc, created_at, visibility FROM notes
     WHERE jar_id=? AND (? IS NULL OR id < ?) ORDER BY id DESC LIMIT ?`,
    [jarId, beforeId ?? null, beforeId ?? null, limit]
  );
  return result.rows.map((r) => noteRowToPublic(env2, r));
}
async function getNote(env2, id) {
  await ensureTables(env2);
  const result = await tursoQuery(env2, `SELECT id, jar_id, display_name, message_enc, created_at, visibility FROM notes WHERE id=?`, [id]);
  return result.rows[0] ? noteRowToPublic(env2, result.rows[0]) : null;
}
async function getActiveJarSummary(env2) {
  await ensureTables(env2);
  const jar = await getOrCreateActiveJar(env2);
  return { id: jar.id, noteCount: jar.noteCount, capacity: jarCapacity(env2) };
}
async function listShelf(env2, beforeId, limit) {
  await ensureTables(env2);
  const result = await tursoQuery(
    env2,
    `SELECT id, note_count, created_at, archived_at FROM jars
     WHERE status='archived' AND (? IS NULL OR id < ?) ORDER BY id DESC LIMIT ?`,
    [beforeId ?? null, beforeId ?? null, limit]
  );
  return result.rows.map((row) => ({
    id: Number(row.id),
    noteCount: Number(row.note_count),
    createdAt: row.created_at,
    archivedAt: row.archived_at
  }));
}
async function countShelf(env2) {
  await ensureTables(env2);
  const result = await tursoQuery(env2, `SELECT COUNT(*) AS total FROM jars WHERE status='archived'`);
  return Number(result.rows[0].total);
}
async function getJarMeta(env2, id) {
  await ensureTables(env2);
  const result = await tursoQuery(env2, `SELECT id, status, note_count, created_at, archived_at FROM jars WHERE id=?`, [id]);
  if (!result.rows[0]) return null;
  const row = result.rows[0];
  return { id: Number(row.id), status: row.status, noteCount: Number(row.note_count), createdAt: row.created_at, archivedAt: row.archived_at };
}
async function findNoteByManagementKeyHash(env2, hash) {
  await ensureTables(env2);
  const result = await tursoQuery(
    env2,
    `SELECT id, jar_id, message_enc, display_name, lang, email_enc, mail_send_at, mail_status, retention_mode, retention_until, created_at, visibility
     FROM notes WHERE management_key_hash=?`,
    [hash]
  );
  if (!result.rows[0]) return null;
  const row = result.rows[0];
  return {
    id: Number(row.id),
    jarId: Number(row.jar_id),
    message: decompressText(decrypt(env2, row.message_enc)),
    displayName: row.display_name,
    lang: row.lang,
    email: row.email_enc ? decrypt(env2, row.email_enc) : null,
    mailSendAt: row.mail_send_at,
    mailStatus: row.mail_status,
    retentionMode: row.retention_mode,
    retentionUntil: row.retention_until,
    createdAt: row.created_at,
    visibility: row.visibility
  };
}
async function deleteNoteById(env2, id, jarId) {
  await tursoQuery(env2, `DELETE FROM notes WHERE id=?`, [id]);
  await tursoQuery(env2, `UPDATE jars SET note_count = MAX(note_count - 1, 0) WHERE id=?`, [jarId]);
}
async function updateNoteById(env2, id, fields) {
  const sets = [];
  const args = [];
  if (fields.message !== void 0) {
    sets.push("message_enc=?");
    args.push(encrypt(env2, compressText(fields.message)));
  }
  if (fields.displayName !== void 0) {
    sets.push("display_name=?");
    args.push(fields.displayName || null);
  }
  if (fields.email !== void 0) {
    sets.push("email_enc=?", "mail_status=?");
    args.push(fields.email ? encrypt(env2, fields.email) : null, fields.email ? "pending" : "none");
  }
  if (fields.mailSendAt !== void 0) {
    sets.push("mail_send_at=?", "mail_attempts=0", "mail_next_attempt_at=NULL");
    args.push(fields.mailSendAt || null);
  }
  if (fields.retentionMode !== void 0) {
    sets.push("retention_mode=?");
    args.push(fields.retentionMode);
  }
  if (fields.retentionUntil !== void 0) {
    sets.push("retention_until=?");
    args.push(fields.retentionUntil || null);
  }
  if (fields.visibility !== void 0) {
    sets.push("visibility=?");
    args.push(fields.visibility === "private" ? "private" : "public");
  }
  if (sets.length === 0) return;
  args.push(id);
  await tursoQuery(env2, `UPDATE notes SET ${sets.join(", ")} WHERE id=?`, args);
}
var init_db = __esm({
  "_lib/db.js"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_turso();
    init_crypto();
    __name(jarCapacity, "jarCapacity");
    __name(getOrCreateActiveJar, "getOrCreateActiveJar");
    __name(createNote, "createNote");
    __name(noteRowToPublic, "noteRowToPublic");
    __name(listJarNotes, "listJarNotes");
    __name(getNote, "getNote");
    __name(getActiveJarSummary, "getActiveJarSummary");
    __name(listShelf, "listShelf");
    __name(countShelf, "countShelf");
    __name(getJarMeta, "getJarMeta");
    __name(findNoteByManagementKeyHash, "findNoteByManagementKeyHash");
    __name(deleteNoteById, "deleteNoteById");
    __name(updateNoteById, "updateNoteById");
  }
});

// _lib/response.js
function jsonResponse(data, status = 200, env2 = null, extraHeaders = {}) {
  const origin = env2?.CORS_ALLOWED_ORIGINS || "*";
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": origin,
      "Vary": "Origin",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders
    }
  });
}
function corsPreflight(env2) {
  const origin = env2?.CORS_ALLOWED_ORIGINS || "*";
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400"
    }
  });
}
function isValidEmailSyntax(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}
function maxFutureDate() {
  return new Date(Date.now() + MAX_YEARS * 365 * 864e5);
}
function validateFutureDate(value) {
  const d = new Date(value);
  const now = /* @__PURE__ */ new Date();
  return !Number.isNaN(d.getTime()) && d > now && d <= maxFutureDate() ? d : null;
}
var MAX_YEARS;
var init_response = __esm({
  "_lib/response.js"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(jsonResponse, "jsonResponse");
    __name(corsPreflight, "corsPreflight");
    __name(isValidEmailSyntax, "isValidEmailSyntax");
    MAX_YEARS = 5;
    __name(maxFutureDate, "maxFutureDate");
    __name(validateFutureDate, "validateFutureDate");
  }
});

// api/jars/[id]/notes.js
async function onRequestOptions({ env: env2 }) {
  return corsPreflight(env2);
}
async function onRequestGet({ params, request, env: env2 }) {
  const jarId = Number(params.id);
  if (!Number.isInteger(jarId)) return jsonResponse({ error: "invalid_jar_id" }, 400, env2);
  const jar = await getJarMeta(env2, jarId);
  if (!jar) return jsonResponse({ error: "not_found" }, 404, env2);
  const url = new URL(request.url);
  const before = url.searchParams.get("before") ? Number(url.searchParams.get("before")) : null;
  const limit = Math.min(Number(url.searchParams.get("limit")) || 30, 60);
  const items = await listJarNotes(env2, jarId, before, limit);
  const cacheHeader = jar.status === "archived" ? "public, max-age=300, s-maxage=900, stale-while-revalidate=1800" : "public, max-age=5, s-maxage=10, stale-while-revalidate=30";
  return jsonResponse({ jar, items }, 200, env2, { "Cache-Control": cacheHeader });
}
var init_notes = __esm({
  "api/jars/[id]/notes.js"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_db();
    init_response();
    __name(onRequestOptions, "onRequestOptions");
    __name(onRequestGet, "onRequestGet");
  }
});

// api/jars/active.js
async function onRequestOptions2({ env: env2 }) {
  return corsPreflight(env2);
}
async function onRequestGet2({ env: env2 }) {
  const summary = await getActiveJarSummary(env2);
  return jsonResponse(summary, 200, env2, {
    "Cache-Control": "public, max-age=3, s-maxage=6, stale-while-revalidate=30"
  });
}
var init_active = __esm({
  "api/jars/active.js"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_db();
    init_response();
    __name(onRequestOptions2, "onRequestOptions");
    __name(onRequestGet2, "onRequestGet");
  }
});

// api/jars/shelf.js
async function onRequestOptions3({ env: env2 }) {
  return corsPreflight(env2);
}
async function onRequestGet3({ request, env: env2 }) {
  const url = new URL(request.url);
  const before = url.searchParams.get("before") ? Number(url.searchParams.get("before")) : null;
  const limit = Math.min(Number(url.searchParams.get("limit")) || 20, 200);
  if (before !== null && !Number.isInteger(before)) return jsonResponse({ error: "invalid_before" }, 400, env2);
  const [items, total] = await Promise.all([listShelf(env2, before, limit), countShelf(env2)]);
  return jsonResponse({ items, total }, 200, env2, {
    "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600"
  });
}
var init_shelf = __esm({
  "api/jars/shelf.js"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_db();
    init_response();
    __name(onRequestOptions3, "onRequestOptions");
    __name(onRequestGet3, "onRequestGet");
  }
});

// ../server/wordlist.js
var require_wordlist = __commonJS({
  "../server/wordlist.js"(exports, module) {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var BLOCKED_WORDS = [
      "a.q",
      "a.q.",
      "abaza",
      "abazan",
      "am biti",
      "amar\u0131m",
      "ambiti",
      "amcik",
      "amck",
      "amckl",
      "amcklama",
      "amcklaryla",
      "amckta",
      "amcktan",
      "amcuk",
      "amc\u0131k",
      "amc\u0131k ho\u015Faf\u0131",
      "amc\u0131klama",
      "amc\u0131kland\u0131",
      "amc\u0131\u011F\u0131",
      "amc\u0131\u011F\u0131n",
      "amc\u0131\u011F\u0131n\u0131",
      "amc\u0131\u011F\u0131n\u0131z\u0131",
      "amin oglu",
      "amina",
      "amina g",
      "amina k",
      "amina koyarim",
      "amina koyayim",
      "amina koyay\u0131m",
      "aminako",
      "aminakoyarim",
      "aminakoyim",
      "aminda",
      "amindan",
      "amindayken",
      "amini",
      "aminiyarraaniskiim",
      "aminoglu",
      "amiyum",
      "amk",
      "amk \xE7ocu\u011Fu",
      "amkafa",
      "amlarnzn",
      "aml\u0131",
      "amm",
      "ammak",
      "ammna",
      "amn",
      "amna",
      "amnda",
      "amndaki",
      "amngtn",
      "amnn",
      "amona",
      "amq",
      "amsiz",
      "amsz",
      "ams\u0131z",
      "amteri",
      "amugaa",
      "amuna",
      "amu\u011Fa",
      "am\u0131k",
      "am\u0131n feryad\u0131",
      "am\u0131n oglu",
      "am\u0131n o\u011Flu",
      "am\u0131na",
      "am\u0131na koy",
      "am\u0131na koyar\u0131m",
      "am\u0131na koyay\u0131m",
      "am\u0131na koyyim",
      "am\u0131na s",
      "am\u0131na sikem",
      "am\u0131na sokam",
      "am\u0131nako",
      "am\u0131nakoyim",
      "am\u0131no\u011Flu",
      "am\u0131n\u0131",
      "am\u0131n\u0131 s",
      "am\u0131s\u0131na",
      "am\u0131s\u0131n\u0131",
      "anaaann",
      "anal",
      "analarn",
      "anamla",
      "anandan",
      "anani sikerim",
      "anani sikeyim",
      "ananin",
      "ananisikerim",
      "ananisikeyim",
      "anan\u0131 sikerim",
      "anan\u0131 sikeyim",
      "anan\u0131n",
      "anan\u0131n am",
      "anan\u0131n am\u0131",
      "anan\u0131n d\xF6l\xFC",
      "anan\u0131nki",
      "anan\u0131sikerim",
      "anan\u0131sikeyim",
      "anan\u0131z\u0131n",
      "anan\u0131z\u0131n am",
      "anasinin",
      "anas\u0131 orospu",
      "anas\u0131n\u0131",
      "anas\u0131n\u0131n am",
      "anayin",
      "angut",
      "anneni",
      "annenin",
      "annesiz",
      "anuna",
      "aptal",
      "aq",
      "aq.",
      "atkafas\u0131",
      "atm\u0131k",
      "attrrm",
      "att\u0131rd\u0131\u011F\u0131m",
      "auzlu",
      "avrat",
      "ayklarmalrmsikerim",
      "azd\u0131m",
      "azd\u0131r",
      "azd\u0131r\u0131c\u0131",
      "a\u011Fz\u0131na s\u0131\xE7ay\u0131m",
      "babaannesi ka\u015Far",
      "babani",
      "baban\u0131",
      "baban\u0131n",
      "babas\u0131 pezevenk",
      "baca\u011F\u0131na s\u0131\xE7ay\u0131m",
      "bacini",
      "bacndan",
      "bac\u0131na",
      "bac\u0131n\u0131",
      "bac\u0131n\u0131n",
      "bastard",
      "basur",
      "beyinsiz",
      "bitch",
      "biting",
      "bok",
      "boka",
      "bokbok",
      "bokhu",
      "bokkkumu",
      "boklar",
      "boktan",
      "boku",
      "bokubokuna",
      "bokum",
      "bok\xE7a",
      "bombok",
      "boner",
      "bosalmak",
      "bo\u015Falmak",
      "b\u0131z\u0131r",
      "cenabet",
      "cibiliyetsiz",
      "cibilliyetini",
      "cibilliyetsiz",
      "cikar",
      "dalaks\u0131z",
      "dallama",
      "daltassak",
      "dalyarak",
      "dalyarrak",
      "dangalak",
      "dassagi",
      "diktim",
      "dildo",
      "dingil",
      "dingilini",
      "dinsiz",
      "dkerim",
      "domal",
      "domalan",
      "domald\u0131",
      "domald\u0131n",
      "domalmak",
      "domalm\u0131\u015F",
      "domals\u0131n",
      "domalt",
      "domaltarak",
      "domaltip",
      "domaltmak",
      "domalt\u0131p",
      "domalt\u0131r",
      "domalt\u0131r\u0131m",
      "domal\u0131k",
      "domal\u0131yor",
      "d\xF6l\xFC",
      "d\xF6nek",
      "d\xFCd\xFCk",
      "eben",
      "ebeni",
      "ebenin",
      "ebeninki",
      "ebleh",
      "ecdadini",
      "ecdad\u0131n\u0131",
      "embesil",
      "fahise",
      "fahi\u015Fe",
      "feri\u015Ftah",
      "ferre",
      "fuck",
      "fucker",
      "fuckin",
      "fucking",
      "gavad",
      "gavat",
      "geber",
      "geberik",
      "gebermek",
      "gebermi\u015F",
      "gebertir",
      "gerizekali",
      "gerizekal\u0131",
      "gerzek",
      "ger\u0131zekal\u0131",
      "giberim",
      "giberler",
      "gibis",
      "gibi\u015F",
      "gibmek",
      "gibtiler",
      "goddamn",
      "godo\u015F",
      "godumun",
      "gotelek",
      "gotlalesi",
      "gotlu",
      "gotten",
      "gotundeki",
      "gotunden",
      "gotune",
      "gotunu",
      "gotveren",
      "goyiim",
      "goyum",
      "goyuyim",
      "goyyim",
      "gtelek",
      "gtn",
      "gtnde",
      "gtnden",
      "gtne",
      "gtten",
      "gtveren",
      "g\xF6t",
      "g\xF6t deli\u011Fi",
      "g\xF6t herif",
      "g\xF6t o\u011Flan\u0131",
      "g\xF6t veren",
      "g\xF6t verir",
      "g\xF6telek",
      "g\xF6tlalesi",
      "g\xF6tlek",
      "g\xF6to\u011Flan\u0131",
      "g\xF6to\u015F",
      "g\xF6tten",
      "g\xF6tveren",
      "g\xF6t\xFC",
      "g\xF6t\xFCn",
      "g\xF6t\xFCne",
      "g\xF6t\xFCne koyim",
      "g\xF6t\xFCnekoyim",
      "g\xF6t\xFCn\xFC",
      "has siktir",
      "hasiktir",
      "hassikome",
      "hassiktir",
      "hassittir",
      "haysiyetsiz",
      "hayvan herif",
      "ho\u015Faf\u0131",
      "hsktr",
      "huur",
      "h\xF6d\xFCk",
      "ibina",
      "ibine",
      "ibinenin",
      "ibne",
      "ibnedir",
      "ibneleri",
      "ibnelik",
      "ibnelri",
      "ibneni",
      "ibnenin",
      "ibnerator",
      "ibnesi",
      "idiot",
      "idiyot",
      "imansz",
      "ipne",
      "iserim",
      "ito\u011Flu it",
      "i\u015Ferim",
      "kafam girsin",
      "kafasiz",
      "kafas\u0131z",
      "kahpe",
      "kahpenin",
      "kahpenin feryad\u0131",
      "kaka",
      "kaltak",
      "kancik",
      "kanc\u0131k",
      "kappe",
      "karhane",
      "kavat",
      "kavatn",
      "kaypak",
      "kayyum",
      "ka\u015Far",
      "kerane",
      "kerhane",
      "kerhanelerde",
      "kevase",
      "keva\u015Fe",
      "kevvase",
      "koca g\xF6t",
      "kodumun",
      "kodumunun",
      "koduumun",
      "kodu\u011Fmun",
      "kodu\u011Fmunun",
      "koyarm",
      "koyay\u0131m",
      "koyiim",
      "koyiiym",
      "koyim",
      "koyum",
      "koyyim",
      "kukudaym",
      "laciye boyad\u0131m",
      "lavuk",
      "libo\u015F",
      "madafaka",
      "mal",
      "malafat",
      "malak",
      "manyak",
      "mcik",
      "meme",
      "memelerini",
      "mezveleli",
      "minaamc\u0131k",
      "mincikliyim",
      "monakkoluyum",
      "motherfucker",
      "mudik",
      "o. \xE7ocu\u011Fu",
      "ocuu",
      "ocuun",
      "orosbucocuu",
      "orospu",
      "orospu cocugu",
      "orospu \xE7oc",
      "orospu \xE7ocuklar\u0131",
      "orospu \xE7ocu\u011Fu",
      "orospu \xE7ocu\u011Fudur",
      "orospucocugu",
      "orospudur",
      "orospular",
      "orospunun",
      "orospunun evlad\u0131",
      "orospuydu",
      "orospuyuz",
      "orospu\xE7ocu\u011Fu",
      "orostoban",
      "orostopol",
      "orrospu",
      "oruspu",
      "oruspu \xE7ocu\u011Fu",
      "oruspu\xE7ocu\u011Fu",
      "osbir",
      "ossurduum",
      "ossurmak",
      "ossuruk",
      "osur",
      "osurduu",
      "osuruk",
      "osururum",
      "otuzbir",
      "o\xE7",
      "o\u011Flan",
      "o\u011Flanc\u0131",
      "o\u011Flu it",
      "patlak zar",
      "penis",
      "pezevek",
      "pezeven",
      "pezeveng",
      "pezevengi",
      "pezevengin evlad\u0131",
      "pezevenk",
      "pezo",
      "pic",
      "pici",
      "picler",
      "pipi",
      "pipi\u015F",
      "pisliktir",
      "pi\xE7",
      "pi\xE7 kurusu",
      "pi\xE7in o\u011Flu",
      "pi\xE7ler",
      "porno",
      "pussy",
      "pu\u015Ft",
      "pu\u015Fttur",
      "rahminde",
      "revizyonist",
      "s1kerim",
      "s1kerm",
      "s1krm",
      "sakso",
      "saksofon",
      "salaak",
      "salak",
      "saxo",
      "sekis",
      "serefsiz",
      "sevgi koyar\u0131m",
      "sevi\u015Felim",
      "sexs",
      "sicarsin",
      "sie",
      "sik",
      "sikdi",
      "sikdi\u011Fim",
      "sike",
      "sikecem",
      "sikem",
      "siken",
      "sikenin",
      "siker",
      "sikerim",
      "sikerler",
      "sikersin",
      "sikertir",
      "sikertmek",
      "sikesen",
      "sikesicenin",
      "sikey",
      "sikeydim",
      "sikeyim",
      "sikeym",
      "siki",
      "sikicem",
      "sikici",
      "sikien",
      "sikienler",
      "sikiiim",
      "sikiiimmm",
      "sikiim",
      "sikiir",
      "sikiirken",
      "sikik",
      "sikil",
      "sikildiini",
      "sikilesice",
      "sikilmi",
      "sikilmie",
      "sikilmis",
      "sikilmi\u015F",
      "sikilsin",
      "sikim",
      "sikimde",
      "sikimden",
      "sikime",
      "sikimi",
      "sikimiin",
      "sikimin",
      "sikimle",
      "sikimsonik",
      "sikimtrak",
      "sikin",
      "sikinde",
      "sikinden",
      "sikine",
      "sikini",
      "sikip",
      "sikis",
      "sikisek",
      "sikisen",
      "sikish",
      "sikismis",
      "sikitiin",
      "sikiyim",
      "sikiym",
      "sikiyorum",
      "siki\u015F",
      "siki\u015Fen",
      "siki\u015Fme",
      "sikkim",
      "sikko",
      "sikleri",
      "sikleriii",
      "sikli",
      "sikm",
      "sikmek",
      "sikmem",
      "sikmiler",
      "sikmisligim",
      "siksem",
      "sikseydin",
      "sikseyidin",
      "siksin",
      "siksinbaya",
      "siksinler",
      "siksiz",
      "siksok",
      "siksz",
      "sikt",
      "sikti",
      "siktigimin",
      "siktigiminin",
      "siktii",
      "siktiim",
      "siktiimin",
      "siktiiminin",
      "siktiler",
      "siktim",
      "siktimin",
      "siktiminin",
      "siktir",
      "siktir et",
      "siktir git",
      "siktir lan",
      "siktir ol git",
      "siktirgit",
      "siktirir",
      "siktiririm",
      "siktiriyor",
      "siktirolgit",
      "sikti\u011Fim",
      "sikti\u011Fimin",
      "sikti\u011Fiminin",
      "sittimin",
      "sittir",
      "skcem",
      "skecem",
      "skem",
      "sker",
      "skerim",
      "skerm",
      "skeyim",
      "skiim",
      "skik",
      "skim",
      "skime",
      "skmek",
      "sksin",
      "sksn",
      "sksz",
      "sktiimin",
      "sktrr",
      "skyim",
      "slaleni",
      "sokam",
      "sokarim",
      "sokarm",
      "sokarmkoduumun",
      "sokar\u0131m",
      "sokaym",
      "sokay\u0131m",
      "sokiim",
      "soktu\u011Fumunun",
      "sokuk",
      "sokum",
      "sokuyum",
      "soku\u015F",
      "soxum",
      "sulaleni",
      "s\xFClaleni",
      "s\xFClalenizi",
      "s\xFCrt\xFCk",
      "s\u0131ecem",
      "s\u0131\xE7ar\u0131m",
      "s\u0131\xE7t\u0131\u011F\u0131m",
      "taaklarn",
      "taaklarna",
      "tarrakimin",
      "tasak",
      "tassak",
      "ta\u015Fak",
      "ta\u015F\u015Fak",
      "tipini s.k",
      "tipinizi s.keyim",
      "tiyniyat",
      "toplarm",
      "topsun",
      "toto\u015F",
      "vajina",
      "vajinan\u0131",
      "veled",
      "veled i zina",
      "veledizina",
      "verdiimin",
      "weled",
      "weledizina",
      "whore",
      "xikeyim",
      "yaaraaa",
      "yalama",
      "yalarun",
      "yalar\u0131m",
      "yaraaam",
      "yarak",
      "yaraks\u0131z",
      "yaraktr",
      "yaram",
      "yaraminbasi",
      "yaramn",
      "yararmorospunun",
      "yarra",
      "yarraaaa",
      "yarraak",
      "yarraam",
      "yarraam\u0131",
      "yarragi",
      "yarragimi",
      "yarragina",
      "yarragindan",
      "yarragm",
      "yarraimin",
      "yarrak",
      "yarram",
      "yarramin",
      "yarraminba\u015F\u0131",
      "yarramn",
      "yarran",
      "yarrana",
      "yarra\u011F",
      "yarra\u011F\u0131m",
      "yarra\u011F\u0131m\u0131",
      "yarrrak",
      "yavak",
      "yavu\u015Fak",
      "yav\u015F",
      "yav\u015Fak",
      "yav\u015Fakt\u0131r",
      "yilisik",
      "yogurtlayam",
      "yo\u011Furtlayam",
      "yrrak",
      "y\u0131l\u0131\u015F\u0131k",
      "zibidi",
      "zigsin",
      "zikeyim",
      "zikiiim",
      "zikiim",
      "zikik",
      "zikim",
      "ziksiiin",
      "ziksiin",
      "zulliyetini",
      "zviyetini",
      "z\u0131kk\u0131m\u0131m",
      "\xE7\xFCk",
      "\xF6k\xFCz",
      "\xF6\u015Fex",
      "\u0131bnel\u0131k",
      "\u015Ferefsiz",
      "\u015F\u0131ll\u0131k"
    ];
    var SPAM_PATTERNS = [
      /https?:\/\//i,
      /www\./i,
      /\b\d{10,}\b/,
      /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i,
      /(.)\1{6,}/
    ];
    function normalize(text) {
      return text.toLocaleLowerCase("tr-TR").replace(/[^a-zçğıöşü0-9\s]/gi, " ");
    }
    __name(normalize, "normalize");
    function containsBlockedWord(text) {
      const normalized = normalize(text);
      const tokens = normalized.split(/\s+/).filter(Boolean);
      const tokenSet = new Set(tokens);
      return BLOCKED_WORDS.some((entry) => {
        if (entry.includes(" ")) {
          return normalized.includes(entry);
        }
        return tokenSet.has(entry);
      });
    }
    __name(containsBlockedWord, "containsBlockedWord");
    function matchesSpamPattern(text) {
      return SPAM_PATTERNS.some((pattern) => pattern.test(text));
    }
    __name(matchesSpamPattern, "matchesSpamPattern");
    function quickFilterReject2(text) {
      return containsBlockedWord(text) || matchesSpamPattern(text);
    }
    __name(quickFilterReject2, "quickFilterReject");
    module.exports = { quickFilterReject: quickFilterReject2 };
  }
});

// _lib/moderation.js
async function classifyWithNim(env2, text) {
  const apiKey = env2.NIM_API_KEY;
  if (!apiKey) throw new Error("NIM_API_KEY tan\u0131ml\u0131 de\u011Fil");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Number(env2.NIM_TIMEOUT_MS || 8e3));
  try {
    const response = await fetch(NIM_API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: env2.NIM_MODEL || "nvidia/llama-3.1-nemotron-safety-guard-8b-v3",
        temperature: 0,
        max_tokens: 100,
        messages: [{ role: "user", content: TASK_TEMPLATE(text) }]
      }),
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`NIM API ${response.status}`);
    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content ?? "";
    const match2 = raw.match(/\{[\s\S]*\}/);
    if (!match2) throw new Error("NIM yan\u0131t\u0131 JSON i\xE7ermiyor");
    const parsed = JSON.parse(match2[0]);
    const userSafety = String(parsed["User Safety"] || "").toLowerCase();
    if (userSafety !== "safe" && userSafety !== "unsafe") throw new Error("NIM yan\u0131t\u0131 beklenen alan\u0131 i\xE7ermiyor");
    return { safe: userSafety === "safe", category: parsed["Safety Categories"] || "none" };
  } finally {
    clearTimeout(timer);
  }
}
async function moderateMessage(env2, text) {
  if ((0, import_wordlist.quickFilterReject)(text)) return { safe: false, category: "yerel-filtre" };
  try {
    return await classifyWithNim(env2, text);
  } catch (err) {
    return { safe: false, category: "moderasyon-hatasi", error: err.message };
  }
}
async function verifyHcaptcha(env2, token, remoteIp) {
  const secret = env2.HCAPTCHA_SECRET;
  if (!secret) throw new Error("HCAPTCHA_SECRET tan\u0131ml\u0131 de\u011Fil");
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);
  const response = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (!response.ok) return false;
  const data = await response.json();
  return data.success === true;
}
async function hasMx(email) {
  const domain2 = email.split("@")[1];
  if (!domain2) return false;
  try {
    const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain2)}&type=MX`, {
      headers: { Accept: "application/dns-json" }
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Array.isArray(data.Answer) && data.Answer.length > 0;
  } catch {
    return false;
  }
}
var import_wordlist, NIM_API_URL, TASK_TEMPLATE;
var init_moderation = __esm({
  "_lib/moderation.js"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    import_wordlist = __toESM(require_wordlist());
    NIM_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
    TASK_TEMPLATE = /* @__PURE__ */ __name((text) => `Task: Check if there is unsafe content in the user or agent messages in the below conversation in accordance with our safety policy with the below categories. Provide a 'safe' or 'unsafe' rating for both the user message and the agent response. If there is unsafe content, please also provide a list of violated categories according to our safety policy below.

<BEGIN UNSAFE CONTENT CATEGORIES>
S1: Violence.
S2: Sexual.
S3: Criminal Planning/Confessions.
S4: Guns and Illegal Weapons.
S5: Controlled/Regulated Substances.
S6: Suicide and Self Harm.
S7: Sexual (minor).
S8: Hate/Identity Hate.
S9: PII/Privacy.
S10: Harassment.
S11: Threat.
S12: Profanity.
S13: Needs Caution.
S14: Other.
S15: Manipulation.
S16: Fraud/Deception.
S17: Malware.
S18: High Risk Gov Decision Making.
S19: Political/Misinformation/Conspiracy.
S20: Copyright/Trademark/Plagiarism.
S21: Unauthorized Advice.
S22: Illegal Activity.
S23: Immoral/Unethical.
<END UNSAFE CONTENT CATEGORIES>

<BEGIN CONVERSATION>

user: ${text}

<END CONVERSATION>

Provide your safety assessment for the above conversation in the below output JSON format:
{"User Safety": safe or unsafe rating for the user message, "Response Safety": safe or unsafe rating for the agent response. Omit if no agent response present. "Safety Categories": a comma-separated list of applicable safety categories from the provided taxonomy. Omit if all safe.}

Do not include anything other than the output JSON in your response.
Output JSON: `, "TASK_TEMPLATE");
    __name(classifyWithNim, "classifyWithNim");
    __name(moderateMessage, "moderateMessage");
    __name(verifyHcaptcha, "verifyHcaptcha");
    __name(hasMx, "hasMx");
  }
});

// api/notes/manage.js
async function onRequestOptions4({ env: env2 }) {
  return corsPreflight(env2);
}
async function onRequestPost({ request, env: env2 }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "invalid_key" }, 400, env2);
  }
  const { managementKey, action } = body || {};
  if (typeof managementKey !== "string" || managementKey.length < 10) {
    return jsonResponse({ error: "invalid_key" }, 400, env2);
  }
  const note = await findNoteByManagementKeyHash(env2, hashManagementKey(managementKey));
  if (!note) return jsonResponse({ error: "not_found" }, 404, env2);
  if (action === "get") {
    return jsonResponse({
      ok: true,
      note: {
        id: note.id,
        message: note.message,
        displayName: note.displayName,
        email: note.email,
        mailSendAt: note.mailSendAt,
        mailStatus: note.mailStatus,
        retentionMode: note.retentionMode,
        retentionUntil: note.retentionUntil,
        createdAt: note.createdAt,
        visibility: note.visibility
      }
    }, 200, env2);
  }
  if (action === "delete") {
    await deleteNoteById(env2, note.id, note.jarId);
    return jsonResponse({ ok: true, deleted: true }, 200, env2);
  }
  if (action === "update") {
    const fields = {};
    const { message, displayName, email, mailSendAt, retentionMode, retentionUntil, visibility } = body || {};
    if (message !== void 0) {
      if (typeof message !== "string" || message.trim().length === 0 || message.length > MESSAGE_MAX) {
        return jsonResponse({ error: "invalid_message" }, 400, env2);
      }
      fields.message = message;
    }
    if (displayName !== void 0) {
      if (displayName && (typeof displayName !== "string" || displayName.length > NAME_MAX)) {
        return jsonResponse({ error: "invalid_display_name" }, 400, env2);
      }
      fields.displayName = displayName ? displayName.trim() : null;
    }
    if (email !== void 0) {
      if (email) {
        if (!isValidEmailSyntax(email)) return jsonResponse({ error: "invalid_email" }, 400, env2);
        if (!await hasMx(email)) return jsonResponse({ error: "email_unreachable" }, 400, env2);
        fields.email = email;
      } else {
        fields.email = null;
      }
    }
    if (mailSendAt !== void 0) {
      if (mailSendAt) {
        const mailDate = validateFutureDate(mailSendAt);
        if (!mailDate) return jsonResponse({ error: "invalid_mail_send_at", maxYears: MAX_YEARS }, 400, env2);
        fields.mailSendAt = mailDate.toISOString();
      } else {
        fields.mailSendAt = null;
      }
    }
    if (retentionMode !== void 0) {
      fields.retentionMode = retentionMode === "until_date" ? "until_date" : "admin";
      if (fields.retentionMode === "until_date") {
        const retDate = validateFutureDate(retentionUntil);
        if (!retDate) return jsonResponse({ error: "invalid_retention_until", maxYears: MAX_YEARS }, 400, env2);
        fields.retentionUntil = retDate.toISOString();
      } else {
        fields.retentionUntil = null;
      }
    }
    if (visibility !== void 0) {
      fields.visibility = visibility === "private" ? "private" : "public";
    }
    if (fields.message && fields.message !== note.message || fields.displayName !== void 0) {
      const check = await moderateMessage(env2, fields.message !== void 0 ? fields.message : note.message);
      if (!check.safe) return jsonResponse({ error: "content_rejected" }, 422, env2);
    }
    await updateNoteById(env2, note.id, fields);
    return jsonResponse({ ok: true, updated: true }, 200, env2);
  }
  return jsonResponse({ error: "invalid_action" }, 400, env2);
}
var MESSAGE_MAX, NAME_MAX;
var init_manage = __esm({
  "api/notes/manage.js"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_db();
    init_crypto();
    init_moderation();
    init_moderation();
    init_response();
    MESSAGE_MAX = 2e3;
    NAME_MAX = 60;
    __name(onRequestOptions4, "onRequestOptions");
    __name(onRequestPost, "onRequestPost");
  }
});

// api/notes/[id].js
async function onRequestOptions5({ env: env2 }) {
  return corsPreflight(env2);
}
async function onRequestGet4({ params, env: env2 }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return jsonResponse({ error: "invalid_id" }, 400, env2);
  const note = await getNote(env2, id);
  if (!note) return jsonResponse({ error: "not_found" }, 404, env2);
  return jsonResponse(note, 200, env2, {
    "Cache-Control": "public, max-age=30, s-maxage=120, stale-while-revalidate=300"
  });
}
var init_id = __esm({
  "api/notes/[id].js"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_db();
    init_response();
    __name(onRequestOptions5, "onRequestOptions");
    __name(onRequestGet4, "onRequestGet");
  }
});

// api/notes/index.js
async function onRequestOptions6({ env: env2 }) {
  return corsPreflight(env2);
}
async function onRequestPost2({ request, env: env2 }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "invalid_message" }, 400, env2);
  }
  const { message, displayName, email, mailSendAt, lang, retentionMode, retentionUntil, hcaptchaToken, visibility } = body || {};
  if (typeof message !== "string" || message.trim().length === 0 || message.length > MESSAGE_MAX2) {
    return jsonResponse({ error: "invalid_message" }, 400, env2);
  }
  if (displayName && (typeof displayName !== "string" || displayName.length > NAME_MAX2)) {
    return jsonResponse({ error: "invalid_display_name" }, 400, env2);
  }
  const safeLang = lang === "en" ? "en" : "tr";
  let normalizedEmail = null;
  let normalizedMailSendAt = null;
  if (email) {
    if (!isValidEmailSyntax(email)) return jsonResponse({ error: "invalid_email" }, 400, env2);
    const mailDate = validateFutureDate(mailSendAt);
    if (!mailDate) return jsonResponse({ error: "invalid_mail_send_at", maxYears: MAX_YEARS }, 400, env2);
    if (!await hasMx(email)) return jsonResponse({ error: "email_unreachable" }, 400, env2);
    normalizedEmail = email;
    normalizedMailSendAt = mailDate.toISOString();
  }
  let normalizedRetentionMode = retentionMode === "until_date" ? "until_date" : "admin";
  let normalizedRetentionUntil = null;
  if (normalizedRetentionMode === "until_date") {
    const retDate = validateFutureDate(retentionUntil);
    if (!retDate) return jsonResponse({ error: "invalid_retention_until", maxYears: MAX_YEARS }, 400, env2);
    normalizedRetentionUntil = retDate.toISOString();
  }
  const clientIp = request.headers.get("CF-Connecting-IP") || "";
  try {
    const okCaptcha = await verifyHcaptcha(env2, hcaptchaToken, clientIp);
    if (!okCaptcha) return jsonResponse({ error: "captcha_failed" }, 400, env2);
  } catch {
    return jsonResponse({ error: "captcha_failed" }, 400, env2);
  }
  const moderation = await moderateMessage(env2, message);
  if (!moderation.safe) return jsonResponse({ error: "content_rejected" }, 422, env2);
  const normalizedVisibility = visibility === "private" ? "private" : "public";
  const managementKey = generateManagementKey();
  try {
    const created = await createNote(env2, {
      message,
      displayName: displayName ? displayName.trim() : null,
      email: normalizedEmail,
      mailSendAt: normalizedMailSendAt,
      lang: safeLang,
      retentionMode: normalizedRetentionMode,
      retentionUntil: normalizedRetentionUntil,
      managementKeyHash: hashManagementKey(managementKey),
      visibility: normalizedVisibility
    });
    return jsonResponse({ id: created.id, jarId: created.jarId, jarFilled: created.jarFilled, managementKey }, 201, env2);
  } catch (err) {
    return jsonResponse({ error: "server_error", detail: err.message }, 500, env2);
  }
}
var MESSAGE_MAX2, NAME_MAX2;
var init_notes2 = __esm({
  "api/notes/index.js"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_db();
    init_crypto();
    init_moderation();
    init_response();
    MESSAGE_MAX2 = 2e3;
    NAME_MAX2 = 60;
    __name(onRequestOptions6, "onRequestOptions");
    __name(onRequestPost2, "onRequestPost");
  }
});

// health.js
async function onRequestGet5() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
var init_health = __esm({
  "health.js"() {
    init_functionsRoutes_0_12782929689655131();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(onRequestGet5, "onRequestGet");
  }
});

// ../.wrangler/tmp/pages-mc0exg/functionsRoutes-0.12782929689655131.mjs
var routes;
var init_functionsRoutes_0_12782929689655131 = __esm({
  "../.wrangler/tmp/pages-mc0exg/functionsRoutes-0.12782929689655131.mjs"() {
    init_notes();
    init_notes();
    init_active();
    init_active();
    init_shelf();
    init_shelf();
    init_manage();
    init_manage();
    init_id();
    init_id();
    init_notes2();
    init_notes2();
    init_health();
    routes = [
      {
        routePath: "/api/jars/:id/notes",
        mountPath: "/api/jars/:id",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet]
      },
      {
        routePath: "/api/jars/:id/notes",
        mountPath: "/api/jars/:id",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions]
      },
      {
        routePath: "/api/jars/active",
        mountPath: "/api/jars",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet2]
      },
      {
        routePath: "/api/jars/active",
        mountPath: "/api/jars",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions2]
      },
      {
        routePath: "/api/jars/shelf",
        mountPath: "/api/jars",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet3]
      },
      {
        routePath: "/api/jars/shelf",
        mountPath: "/api/jars",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions3]
      },
      {
        routePath: "/api/notes/manage",
        mountPath: "/api/notes",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions4]
      },
      {
        routePath: "/api/notes/manage",
        mountPath: "/api/notes",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost]
      },
      {
        routePath: "/api/notes/:id",
        mountPath: "/api/notes",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet4]
      },
      {
        routePath: "/api/notes/:id",
        mountPath: "/api/notes",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions5]
      },
      {
        routePath: "/api/notes",
        mountPath: "/api/notes",
        method: "OPTIONS",
        middlewares: [],
        modules: [onRequestOptions6]
      },
      {
        routePath: "/api/notes",
        mountPath: "/api/notes",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost2]
      },
      {
        routePath: "/health",
        mountPath: "/",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet5]
      }
    ];
  }
});

// ../.wrangler/tmp/bundle-yW0aOH/middleware-loader.entry.ts
init_functionsRoutes_0_12782929689655131();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../.wrangler/tmp/bundle-yW0aOH/middleware-insertion-facade.js
init_functionsRoutes_0_12782929689655131();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../../root/.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-template-worker.ts
init_functionsRoutes_0_12782929689655131();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../../../root/.npm/_npx/32026684e21afda6/node_modules/path-to-regexp/dist.es2015/index.js
init_functionsRoutes_0_12782929689655131();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count3 = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count3--;
          if (count3 === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count3++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count3)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../../../root/.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env2, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context2 = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env: env2,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context2);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error3) {
      if (isFailOpen) {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error3;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// ../../../root/.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_functionsRoutes_0_12782929689655131();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../root/.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_functionsRoutes_0_12782929689655131();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    const body = JSON.stringify(error3);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-yW0aOH/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// ../../../root/.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
init_functionsRoutes_0_12782929689655131();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-yW0aOH/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=functionsWorker-0.2031813419680144.mjs.map
