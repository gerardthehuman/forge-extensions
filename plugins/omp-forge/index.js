var __defProp = Object.defineProperty;
var __returnValue = (v) => v;
function __exportSetter(name, newValue) {
  this[name] = __returnValue.bind(null, newValue);
}
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: !0,
      configurable: !0,
      set: __exportSetter.bind(all, name)
    });
};

// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/classic/iso.js
var exports_iso2 = {};
__export(exports_iso2, {
  ZodISODate: () => ZodISODate2,
  ZodISODateTime: () => ZodISODateTime2,
  ZodISODuration: () => ZodISODuration2,
  ZodISOTime: () => ZodISOTime2,
  date: () => date4,
  datetime: () => datetime4,
  duration: () => duration4,
  time: () => time4
});

// ../models/src/desktop-catalog.ts
import { readFile as readFile3 } from "node:fs/promises";
import { homedir as homedir3 } from "node:os";
import path3 from "node:path";

// ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/core.js
var NEVER = Object.freeze({
  status: "aborted"
});
function $constructor(name, initializer, params) {
  function init(inst, def) {
    if (!inst._zod)
      Object.defineProperty(inst, "_zod", {
        value: {
          def,
          constr: _,
          traits: /* @__PURE__ */ new Set
        },
        enumerable: !1
      });
    if (inst._zod.traits.has(name))
      return;
    inst._zod.traits.add(name), initializer(inst, def);
    let proto = _.prototype, keys = Object.keys(proto);
    for (let i = 0;i < keys.length; i++) {
      let k = keys[i];
      if (!(k in inst))
        inst[k] = proto[k].bind(inst);
    }
  }
  let Parent = params?.Parent ?? Object;

  class Definition extends Parent {
  }
  Object.defineProperty(Definition, "name", { value: name });
  function _(def) {
    var _a;
    let inst = params?.Parent ? new Definition : this;
    init(inst, def), (_a = inst._zod).deferred ?? (_a.deferred = []);
    for (let fn of inst._zod.deferred)
      fn();
    return inst;
  }
  return Object.defineProperty(_, "init", { value: init }), Object.defineProperty(_, Symbol.hasInstance, {
    value: (inst) => {
      if (params?.Parent && inst instanceof params.Parent)
        return !0;
      return inst?._zod?.traits?.has(name);
    }
  }), Object.defineProperty(_, "name", { value: name }), _;
}
var $brand = Symbol("zod_brand");

class $ZodAsyncError extends Error {
  constructor() {
    super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
  }
}

class $ZodEncodeError extends Error {
  constructor(name) {
    super(`Encountered unidirectional transform during encode: ${name}`);
    this.name = "ZodEncodeError";
  }
}
var globalConfig = {};
function config(newConfig) {
  if (newConfig)
    Object.assign(globalConfig, newConfig);
  return globalConfig;
}
// ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/util.js
function getEnumValues(entries) {
  let numericValues = Object.values(entries).filter((v) => typeof v === "number");
  return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
}
function jsonStringifyReplacer(_, value) {
  if (typeof value === "bigint")
    return value.toString();
  return value;
}
function cached(getter) {
  return {
    get value() {
      {
        let value = getter();
        return Object.defineProperty(this, "value", { value }), value;
      }
      throw Error("cached value already set");
    }
  };
}
function nullish(input) {
  return input === null || input === void 0;
}
function cleanRegex(source) {
  let start = source.startsWith("^") ? 1 : 0, end = source.endsWith("$") ? source.length - 1 : source.length;
  return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
  let valDecCount = (val.toString().split(".")[1] || "").length, stepString = step.toString(), stepDecCount = (stepString.split(".")[1] || "").length;
  if (stepDecCount === 0 && /\d?e-\d?/.test(stepString)) {
    let match = stepString.match(/\d?e-(\d?)/);
    if (match?.[1])
      stepDecCount = Number.parseInt(match[1]);
  }
  let decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount, valInt = Number.parseInt(val.toFixed(decCount).replace(".", "")), stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var EVALUATING = Symbol("evaluating");
function defineLazy(object, key, getter) {
  let value = void 0;
  Object.defineProperty(object, key, {
    get() {
      if (value === EVALUATING)
        return;
      if (value === void 0)
        value = EVALUATING, value = getter();
      return value;
    },
    set(v) {
      Object.defineProperty(object, key, {
        value: v
      });
    },
    configurable: !0
  });
}
function assignProp(target, prop, value) {
  Object.defineProperty(target, prop, {
    value,
    writable: !0,
    enumerable: !0,
    configurable: !0
  });
}
function mergeDefs(...defs) {
  let mergedDescriptors = {};
  for (let def of defs) {
    let descriptors = Object.getOwnPropertyDescriptors(def);
    Object.assign(mergedDescriptors, descriptors);
  }
  return Object.defineProperties({}, mergedDescriptors);
}
function esc(str) {
  return JSON.stringify(str);
}
function slugify(input) {
  return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
function isObject(data) {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}
var allowsEval = cached(() => {
  if (typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare"))
    return !1;
  try {
    return new Function(""), !0;
  } catch (_) {
    return !1;
  }
});
function isPlainObject(o) {
  if (isObject(o) === !1)
    return !1;
  let ctor = o.constructor;
  if (ctor === void 0)
    return !0;
  if (typeof ctor !== "function")
    return !0;
  let prot = ctor.prototype;
  if (isObject(prot) === !1)
    return !1;
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === !1)
    return !1;
  return !0;
}
function shallowClone(o) {
  if (isPlainObject(o))
    return { ...o };
  if (Array.isArray(o))
    return [...o];
  return o;
}
var propertyKeyTypes = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
  let cl = new inst._zod.constr(def ?? inst._zod.def);
  if (!def || params?.parent)
    cl._zod.parent = inst;
  return cl;
}
function normalizeParams(_params) {
  let params = _params;
  if (!params)
    return {};
  if (typeof params === "string")
    return { error: () => params };
  if (params?.message !== void 0) {
    if (params?.error !== void 0)
      throw Error("Cannot specify both `message` and `error` params");
    params.error = params.message;
  }
  if (delete params.message, typeof params.error === "string")
    return { ...params, error: () => params.error };
  return params;
}
function optionalKeys(shape) {
  return Object.keys(shape).filter((k) => shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional");
}
var NUMBER_FORMAT_RANGES = {
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-340282346638528860000000000000000000000, 340282346638528860000000000000000000000],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
function pick(schema, mask) {
  let currDef = schema._zod.def, checks = currDef.checks;
  if (checks && checks.length > 0)
    throw Error(".pick() cannot be used on object schemas containing refinements");
  let def = mergeDefs(schema._zod.def, {
    get shape() {
      let newShape = {};
      for (let key in mask) {
        if (!(key in currDef.shape))
          throw Error(`Unrecognized key: "${key}"`);
        if (!mask[key])
          continue;
        newShape[key] = currDef.shape[key];
      }
      return assignProp(this, "shape", newShape), newShape;
    },
    checks: []
  });
  return clone(schema, def);
}
function omit(schema, mask) {
  let currDef = schema._zod.def, checks = currDef.checks;
  if (checks && checks.length > 0)
    throw Error(".omit() cannot be used on object schemas containing refinements");
  let def = mergeDefs(schema._zod.def, {
    get shape() {
      let newShape = { ...schema._zod.def.shape };
      for (let key in mask) {
        if (!(key in currDef.shape))
          throw Error(`Unrecognized key: "${key}"`);
        if (!mask[key])
          continue;
        delete newShape[key];
      }
      return assignProp(this, "shape", newShape), newShape;
    },
    checks: []
  });
  return clone(schema, def);
}
function extend(schema, shape) {
  if (!isPlainObject(shape))
    throw Error("Invalid input to extend: expected a plain object");
  let checks = schema._zod.def.checks;
  if (checks && checks.length > 0) {
    let existingShape = schema._zod.def.shape;
    for (let key in shape)
      if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0)
        throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
  }
  let def = mergeDefs(schema._zod.def, {
    get shape() {
      let _shape = { ...schema._zod.def.shape, ...shape };
      return assignProp(this, "shape", _shape), _shape;
    }
  });
  return clone(schema, def);
}
function safeExtend(schema, shape) {
  if (!isPlainObject(shape))
    throw Error("Invalid input to safeExtend: expected a plain object");
  let def = mergeDefs(schema._zod.def, {
    get shape() {
      let _shape = { ...schema._zod.def.shape, ...shape };
      return assignProp(this, "shape", _shape), _shape;
    }
  });
  return clone(schema, def);
}
function merge(a, b) {
  let def = mergeDefs(a._zod.def, {
    get shape() {
      let _shape = { ...a._zod.def.shape, ...b._zod.def.shape };
      return assignProp(this, "shape", _shape), _shape;
    },
    get catchall() {
      return b._zod.def.catchall;
    },
    checks: []
  });
  return clone(a, def);
}
function partial(Class, schema, mask) {
  let checks = schema._zod.def.checks;
  if (checks && checks.length > 0)
    throw Error(".partial() cannot be used on object schemas containing refinements");
  let def = mergeDefs(schema._zod.def, {
    get shape() {
      let oldShape = schema._zod.def.shape, shape = { ...oldShape };
      if (mask)
        for (let key in mask) {
          if (!(key in oldShape))
            throw Error(`Unrecognized key: "${key}"`);
          if (!mask[key])
            continue;
          shape[key] = Class ? new Class({
            type: "optional",
            innerType: oldShape[key]
          }) : oldShape[key];
        }
      else
        for (let key in oldShape)
          shape[key] = Class ? new Class({
            type: "optional",
            innerType: oldShape[key]
          }) : oldShape[key];
      return assignProp(this, "shape", shape), shape;
    },
    checks: []
  });
  return clone(schema, def);
}
function required(Class, schema, mask) {
  let def = mergeDefs(schema._zod.def, {
    get shape() {
      let oldShape = schema._zod.def.shape, shape = { ...oldShape };
      if (mask)
        for (let key in mask) {
          if (!(key in shape))
            throw Error(`Unrecognized key: "${key}"`);
          if (!mask[key])
            continue;
          shape[key] = new Class({
            type: "nonoptional",
            innerType: oldShape[key]
          });
        }
      else
        for (let key in oldShape)
          shape[key] = new Class({
            type: "nonoptional",
            innerType: oldShape[key]
          });
      return assignProp(this, "shape", shape), shape;
    }
  });
  return clone(schema, def);
}
function aborted(x, startIndex = 0) {
  if (x.aborted === !0)
    return !0;
  for (let i = startIndex;i < x.issues.length; i++)
    if (x.issues[i]?.continue !== !0)
      return !0;
  return !1;
}
function prefixIssues(path, issues) {
  return issues.map((iss) => {
    var _a;
    return (_a = iss).path ?? (_a.path = []), iss.path.unshift(path), iss;
  });
}
function unwrapMessage(message) {
  return typeof message === "string" ? message : message?.message;
}
function finalizeIssue(iss, ctx, config) {
  let full = { ...iss, path: iss.path ?? [] };
  if (!iss.message) {
    let message = unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
    full.message = message;
  }
  if (delete full.inst, delete full.continue, !ctx?.reportInput)
    delete full.input;
  return full;
}
function getLengthableOrigin(input) {
  if (Array.isArray(input))
    return "array";
  if (typeof input === "string")
    return "string";
  return "unknown";
}
function issue(...args) {
  let [iss, input, inst] = args;
  if (typeof iss === "string")
    return {
      message: iss,
      code: "custom",
      input,
      inst
    };
  return { ...iss };
}

// ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/errors.js
var initializer = (inst, def) => {
  inst.name = "$ZodError", Object.defineProperty(inst, "_zod", {
    value: inst._zod,
    enumerable: !1
  }), Object.defineProperty(inst, "issues", {
    value: def,
    enumerable: !1
  }), inst.message = JSON.stringify(def, jsonStringifyReplacer, 2), Object.defineProperty(inst, "toString", {
    value: () => inst.message,
    enumerable: !1
  });
}, $ZodError = $constructor("$ZodError", initializer), $ZodRealError = $constructor("$ZodError", initializer, { Parent: Error });
function flattenError(error, mapper = (issue) => issue.message) {
  let fieldErrors = {}, formErrors = [];
  for (let sub of error.issues)
    if (sub.path.length > 0)
      fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [], fieldErrors[sub.path[0]].push(mapper(sub));
    else
      formErrors.push(mapper(sub));
  return { formErrors, fieldErrors };
}
function formatError(error, mapper = (issue) => issue.message) {
  let fieldErrors = { _errors: [] }, processError = (error) => {
    for (let issue of error.issues)
      if (issue.code === "invalid_union" && issue.errors.length)
        issue.errors.map((issues) => processError({ issues }));
      else if (issue.code === "invalid_key")
        processError({ issues: issue.issues });
      else if (issue.code === "invalid_element")
        processError({ issues: issue.issues });
      else if (issue.path.length === 0)
        fieldErrors._errors.push(mapper(issue));
      else {
        let curr = fieldErrors, i = 0;
        while (i < issue.path.length) {
          let el = issue.path[i];
          if (i !== issue.path.length - 1)
            curr[el] = curr[el] || { _errors: [] };
          else
            curr[el] = curr[el] || { _errors: [] }, curr[el]._errors.push(mapper(issue));
          curr = curr[el], i++;
        }
      }
  };
  return processError(error), fieldErrors;
}

// ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/parse.js
var _parse = (_Err) => (schema, value, _ctx, _params) => {
  let ctx = _ctx ? Object.assign(_ctx, { async: !1 }) : { async: !1 }, result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    throw new $ZodAsyncError;
  if (result.issues.length) {
    let e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    throw captureStackTrace(e, _params?.callee), e;
  }
  return result.value;
};
var _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
  let ctx = _ctx ? Object.assign(_ctx, { async: !0 }) : { async: !0 }, result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  if (result.issues.length) {
    let e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    throw captureStackTrace(e, params?.callee), e;
  }
  return result.value;
};
var _safeParse = (_Err) => (schema, value, _ctx) => {
  let ctx = _ctx ? { ..._ctx, async: !1 } : { async: !1 }, result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    throw new $ZodAsyncError;
  return result.issues.length ? {
    success: !1,
    error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: !0, data: result.value };
}, safeParse = /* @__PURE__ */ _safeParse($ZodRealError), _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
  let ctx = _ctx ? Object.assign(_ctx, { async: !0 }) : { async: !0 }, result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length ? {
    success: !1,
    error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: !0, data: result.value };
}, safeParseAsync = /* @__PURE__ */ _safeParseAsync($ZodRealError), _encode = (_Err) => (schema, value, _ctx) => {
  let ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
  return _parse(_Err)(schema, value, ctx);
};
var _decode = (_Err) => (schema, value, _ctx) => _parse(_Err)(schema, value, _ctx);
var _encodeAsync = (_Err) => async (schema, value, _ctx) => {
  let ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
  return _parseAsync(_Err)(schema, value, ctx);
};
var _decodeAsync = (_Err) => async (schema, value, _ctx) => _parseAsync(_Err)(schema, value, _ctx);
var _safeEncode = (_Err) => (schema, value, _ctx) => {
  let ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
  return _safeParse(_Err)(schema, value, ctx);
};
var _safeDecode = (_Err) => (schema, value, _ctx) => _safeParse(_Err)(schema, value, _ctx);
var _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
  let ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
  return _safeParseAsync(_Err)(schema, value, ctx);
};
var _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => _safeParseAsync(_Err)(schema, value, _ctx);
// ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/regexes.js
var cuid = /^[cC][^\s-]{8,}$/, cuid2 = /^[0-9a-z]+$/, ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/, xid = /^[0-9a-vA-V]{20}$/, ksuid = /^[A-Za-z0-9]{27}$/, nanoid = /^[a-zA-Z0-9_-]{21}$/, duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
var guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, uuid = (version) => {
  if (!version)
    return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
  return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
var email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
var _emoji = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
function emoji() {
  return new RegExp(_emoji, "u");
}
var ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
var cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, base64url = /^[A-Za-z0-9_-]*$/;
var e164 = /^\+[1-9]\d{6,14}$/, dateSource = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))", date = /* @__PURE__ */ new RegExp(`^${dateSource}$`);
function timeSource(args) {
  return typeof args.precision === "number" ? args.precision === -1 ? "(?:[01]\\d|2[0-3]):[0-5]\\d" : args.precision === 0 ? "(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d" : `(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{${args.precision}}` : "(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?";
}
function time(args) {
  return new RegExp(`^${timeSource(args)}$`);
}
function datetime(args) {
  let time = timeSource({ precision: args.precision }), opts = ["Z"];
  if (args.local)
    opts.push("");
  if (args.offset)
    opts.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
  let timeRegex = `${time}(?:${opts.join("|")})`;
  return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
var string = (params) => {
  let regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : "[\\s\\S]*";
  return new RegExp(`^${regex}$`);
};
var integer = /^-?\d+$/, number = /^-?\d+(?:\.\d+)?$/, boolean = /^(?:true|false)$/i;
var lowercase = /^[^A-Z]*$/, uppercase = /^[^a-z]*$/;

// ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/checks.js
var $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
  var _a;
  inst._zod ?? (inst._zod = {}), inst._zod.def = def, (_a = inst._zod).onattach ?? (_a.onattach = []);
}), numericOriginMap = {
  number: "number",
  bigint: "bigint",
  object: "date"
}, $ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  let origin = numericOriginMap[typeof def.value];
  inst._zod.onattach.push((inst) => {
    let bag = inst._zod.bag, curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
    if (def.value < curr)
      if (def.inclusive)
        bag.maximum = def.value;
      else
        bag.exclusiveMaximum = def.value;
  }), inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value <= def.value : payload.value < def.value)
      return;
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckGreaterThan = /* @__PURE__ */ $constructor("$ZodCheckGreaterThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  let origin = numericOriginMap[typeof def.value];
  inst._zod.onattach.push((inst) => {
    let bag = inst._zod.bag, curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
    if (def.value > curr)
      if (def.inclusive)
        bag.minimum = def.value;
      else
        bag.exclusiveMinimum = def.value;
  }), inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value >= def.value : payload.value > def.value)
      return;
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def) => {
  $ZodCheck.init(inst, def), inst._zod.onattach.push((inst) => {
    var _a;
    (_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
  }), inst._zod.check = (payload) => {
    if (typeof payload.value !== typeof def.value)
      throw Error("Cannot mix number and bigint in multiple_of check.");
    if (typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0)
      return;
    payload.issues.push({
      origin: typeof payload.value,
      code: "not_multiple_of",
      divisor: def.value,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckNumberFormat = /* @__PURE__ */ $constructor("$ZodCheckNumberFormat", (inst, def) => {
  $ZodCheck.init(inst, def), def.format = def.format || "float64";
  let isInt = def.format?.includes("int"), origin = isInt ? "int" : "number", [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
  inst._zod.onattach.push((inst) => {
    let bag = inst._zod.bag;
    if (bag.format = def.format, bag.minimum = minimum, bag.maximum = maximum, isInt)
      bag.pattern = integer;
  }), inst._zod.check = (payload) => {
    let input = payload.value;
    if (isInt) {
      if (!Number.isInteger(input)) {
        payload.issues.push({
          expected: origin,
          format: def.format,
          code: "invalid_type",
          continue: !1,
          input,
          inst
        });
        return;
      }
      if (!Number.isSafeInteger(input)) {
        if (input > 0)
          payload.issues.push({
            input,
            code: "too_big",
            maximum: Number.MAX_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: !0,
            continue: !def.abort
          });
        else
          payload.issues.push({
            input,
            code: "too_small",
            minimum: Number.MIN_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: !0,
            continue: !def.abort
          });
        return;
      }
    }
    if (input < minimum)
      payload.issues.push({
        origin: "number",
        input,
        code: "too_small",
        minimum,
        inclusive: !0,
        inst,
        continue: !def.abort
      });
    if (input > maximum)
      payload.issues.push({
        origin: "number",
        input,
        code: "too_big",
        maximum,
        inclusive: !0,
        inst,
        continue: !def.abort
      });
  };
});
var $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def), (_a = inst._zod.def).when ?? (_a.when = (payload) => {
    let val = payload.value;
    return !nullish(val) && val.length !== void 0;
  }), inst._zod.onattach.push((inst) => {
    let curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    if (def.maximum < curr)
      inst._zod.bag.maximum = def.maximum;
  }), inst._zod.check = (payload) => {
    let input = payload.value;
    if (input.length <= def.maximum)
      return;
    let origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: def.maximum,
      inclusive: !0,
      input,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def), (_a = inst._zod.def).when ?? (_a.when = (payload) => {
    let val = payload.value;
    return !nullish(val) && val.length !== void 0;
  }), inst._zod.onattach.push((inst) => {
    let curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    if (def.minimum > curr)
      inst._zod.bag.minimum = def.minimum;
  }), inst._zod.check = (payload) => {
    let input = payload.value;
    if (input.length >= def.minimum)
      return;
    let origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: def.minimum,
      inclusive: !0,
      input,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def), (_a = inst._zod.def).when ?? (_a.when = (payload) => {
    let val = payload.value;
    return !nullish(val) && val.length !== void 0;
  }), inst._zod.onattach.push((inst) => {
    let bag = inst._zod.bag;
    bag.minimum = def.length, bag.maximum = def.length, bag.length = def.length;
  }), inst._zod.check = (payload) => {
    let input = payload.value, length = input.length;
    if (length === def.length)
      return;
    let origin = getLengthableOrigin(input), tooBig = length > def.length;
    payload.issues.push({
      origin,
      ...tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length },
      inclusive: !0,
      exact: !0,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
  var _a, _b;
  if ($ZodCheck.init(inst, def), inst._zod.onattach.push((inst) => {
    let bag = inst._zod.bag;
    if (bag.format = def.format, def.pattern)
      bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set), bag.patterns.add(def.pattern);
  }), def.pattern)
    (_a = inst._zod).check ?? (_a.check = (payload) => {
      if (def.pattern.lastIndex = 0, def.pattern.test(payload.value))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: def.format,
        input: payload.value,
        ...def.pattern ? { pattern: def.pattern.toString() } : {},
        inst,
        continue: !def.abort
      });
    });
  else
    (_b = inst._zod).check ?? (_b.check = () => {});
}), $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def), inst._zod.check = (payload) => {
    if (def.pattern.lastIndex = 0, def.pattern.test(payload.value))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: payload.value,
      pattern: def.pattern.toString(),
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
  def.pattern ?? (def.pattern = lowercase), $ZodCheckStringFormat.init(inst, def);
}), $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
  def.pattern ?? (def.pattern = uppercase), $ZodCheckStringFormat.init(inst, def);
}), $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
  $ZodCheck.init(inst, def);
  let escapedRegex = escapeRegex(def.includes), pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
  def.pattern = pattern, inst._zod.onattach.push((inst) => {
    let bag = inst._zod.bag;
    bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set), bag.patterns.add(pattern);
  }), inst._zod.check = (payload) => {
    if (payload.value.includes(def.includes, def.position))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: def.includes,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  let pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
  def.pattern ?? (def.pattern = pattern), inst._zod.onattach.push((inst) => {
    let bag = inst._zod.bag;
    bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set), bag.patterns.add(pattern);
  }), inst._zod.check = (payload) => {
    if (payload.value.startsWith(def.prefix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: def.prefix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  let pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
  def.pattern ?? (def.pattern = pattern), inst._zod.onattach.push((inst) => {
    let bag = inst._zod.bag;
    bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set), bag.patterns.add(pattern);
  }), inst._zod.check = (payload) => {
    if (payload.value.endsWith(def.suffix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: def.suffix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
  $ZodCheck.init(inst, def), inst._zod.check = (payload) => {
    payload.value = def.tx(payload.value);
  };
});

// ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/doc.js
class Doc {
  constructor(args = []) {
    if (this.content = [], this.indent = 0, this)
      this.args = args;
  }
  indented(fn) {
    this.indent += 1, fn(this), this.indent -= 1;
  }
  write(arg) {
    if (typeof arg === "function") {
      arg(this, { execution: "sync" }), arg(this, { execution: "async" });
      return;
    }
    let lines = arg.split(`
`).filter((x) => x), minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length)), dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
    for (let line of dedented)
      this.content.push(line);
  }
  compile() {
    let F = Function, args = this?.args, lines = [...(this?.content ?? [""]).map((x) => `  ${x}`)];
    return new F(...args, lines.join(`
`));
  }
}

// ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/versions.js
var version = {
  major: 4,
  minor: 3,
  patch: 6
};

// ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/schemas.js
var $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
  var _a;
  inst ?? (inst = {}), inst._zod.def = def, inst._zod.bag = inst._zod.bag || {}, inst._zod.version = version;
  let checks = [...inst._zod.def.checks ?? []];
  if (inst._zod.traits.has("$ZodCheck"))
    checks.unshift(inst);
  for (let ch of checks)
    for (let fn of ch._zod.onattach)
      fn(inst);
  if (checks.length === 0)
    (_a = inst._zod).deferred ?? (_a.deferred = []), inst._zod.deferred?.push(() => {
      inst._zod.run = inst._zod.parse;
    });
  else {
    let runChecks = (payload, checks, ctx) => {
      let isAborted = aborted(payload), asyncResult;
      for (let ch of checks) {
        if (ch._zod.def.when) {
          if (!ch._zod.def.when(payload))
            continue;
        } else if (isAborted)
          continue;
        let currLen = payload.issues.length, _ = ch._zod.check(payload);
        if (_ instanceof Promise && ctx?.async === !1)
          throw new $ZodAsyncError;
        if (asyncResult || _ instanceof Promise)
          asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
            if (await _, payload.issues.length === currLen)
              return;
            if (!isAborted)
              isAborted = aborted(payload, currLen);
          });
        else {
          if (payload.issues.length === currLen)
            continue;
          if (!isAborted)
            isAborted = aborted(payload, currLen);
        }
      }
      if (asyncResult)
        return asyncResult.then(() => payload);
      return payload;
    }, handleCanaryResult = (canary, payload, ctx) => {
      if (aborted(canary))
        return canary.aborted = !0, canary;
      let checkResult = runChecks(payload, checks, ctx);
      if (checkResult instanceof Promise) {
        if (ctx.async === !1)
          throw new $ZodAsyncError;
        return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
      }
      return inst._zod.parse(checkResult, ctx);
    };
    inst._zod.run = (payload, ctx) => {
      if (ctx.skipChecks)
        return inst._zod.parse(payload, ctx);
      if (ctx.direction === "backward") {
        let canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: !0 });
        if (canary instanceof Promise)
          return canary.then((canary) => handleCanaryResult(canary, payload, ctx));
        return handleCanaryResult(canary, payload, ctx);
      }
      let result = inst._zod.parse(payload, ctx);
      if (result instanceof Promise) {
        if (ctx.async === !1)
          throw new $ZodAsyncError;
        return result.then((result) => runChecks(result, checks, ctx));
      }
      return runChecks(result, checks, ctx);
    };
  }
  defineLazy(inst, "~standard", () => ({
    validate: (value) => {
      try {
        let r = safeParse(inst, value);
        return r.success ? { value: r.data } : { issues: r.error?.issues };
      } catch (_) {
        return safeParseAsync(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
      }
    },
    vendor: "zod",
    version: 1
  }));
}), $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
  $ZodType.init(inst, def), inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string(inst._zod.bag), inst._zod.parse = (payload, _) => {
    if (def.coerce)
      try {
        payload.value = String(payload.value);
      } catch (_) {}
    if (typeof payload.value === "string")
      return payload;
    return payload.issues.push({
      expected: "string",
      code: "invalid_type",
      input: payload.value,
      inst
    }), payload;
  };
}), $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def), $ZodString.init(inst, def);
}), $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
  def.pattern ?? (def.pattern = guid), $ZodStringFormat.init(inst, def);
}), $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
  if (def.version) {
    let v = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    }[def.version];
    if (v === void 0)
      throw Error(`Invalid UUID version: "${def.version}"`);
    def.pattern ?? (def.pattern = uuid(v));
  } else
    def.pattern ?? (def.pattern = uuid());
  $ZodStringFormat.init(inst, def);
}), $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
  def.pattern ?? (def.pattern = email), $ZodStringFormat.init(inst, def);
}), $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
  $ZodStringFormat.init(inst, def), inst._zod.check = (payload) => {
    try {
      let trimmed = payload.value.trim(), url = new URL(trimmed);
      if (def.hostname) {
        if (def.hostname.lastIndex = 0, !def.hostname.test(url.hostname))
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid hostname",
            pattern: def.hostname.source,
            input: payload.value,
            inst,
            continue: !def.abort
          });
      }
      if (def.protocol) {
        if (def.protocol.lastIndex = 0, !def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol))
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid protocol",
            pattern: def.protocol.source,
            input: payload.value,
            inst,
            continue: !def.abort
          });
      }
      if (def.normalize)
        payload.value = url.href;
      else
        payload.value = trimmed;
      return;
    } catch (_) {
      payload.issues.push({
        code: "invalid_format",
        format: "url",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
}), $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
  def.pattern ?? (def.pattern = emoji()), $ZodStringFormat.init(inst, def);
}), $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
  def.pattern ?? (def.pattern = nanoid), $ZodStringFormat.init(inst, def);
}), $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
  def.pattern ?? (def.pattern = cuid), $ZodStringFormat.init(inst, def);
}), $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
  def.pattern ?? (def.pattern = cuid2), $ZodStringFormat.init(inst, def);
}), $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
  def.pattern ?? (def.pattern = ulid), $ZodStringFormat.init(inst, def);
}), $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
  def.pattern ?? (def.pattern = xid), $ZodStringFormat.init(inst, def);
}), $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
  def.pattern ?? (def.pattern = ksuid), $ZodStringFormat.init(inst, def);
}), $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
  def.pattern ?? (def.pattern = datetime(def)), $ZodStringFormat.init(inst, def);
}), $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
  def.pattern ?? (def.pattern = date), $ZodStringFormat.init(inst, def);
}), $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
  def.pattern ?? (def.pattern = time(def)), $ZodStringFormat.init(inst, def);
}), $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
  def.pattern ?? (def.pattern = duration), $ZodStringFormat.init(inst, def);
}), $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
  def.pattern ?? (def.pattern = ipv4), $ZodStringFormat.init(inst, def), inst._zod.bag.format = "ipv4";
}), $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
  def.pattern ?? (def.pattern = ipv6), $ZodStringFormat.init(inst, def), inst._zod.bag.format = "ipv6", inst._zod.check = (payload) => {
    try {
      new URL(`http://[${payload.value}]`);
    } catch {
      payload.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv4), $ZodStringFormat.init(inst, def);
}), $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv6), $ZodStringFormat.init(inst, def), inst._zod.check = (payload) => {
    let parts = payload.value.split("/");
    try {
      if (parts.length !== 2)
        throw Error();
      let [address, prefix] = parts;
      if (!prefix)
        throw Error();
      let prefixNum = Number(prefix);
      if (`${prefixNum}` !== prefix)
        throw Error();
      if (prefixNum < 0 || prefixNum > 128)
        throw Error();
      new URL(`http://[${address}]`);
    } catch {
      payload.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
function isValidBase64(data) {
  if (data === "")
    return !0;
  if (data.length % 4 !== 0)
    return !1;
  try {
    return atob(data), !0;
  } catch {
    return !1;
  }
}
var $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
  def.pattern ?? (def.pattern = base64), $ZodStringFormat.init(inst, def), inst._zod.bag.contentEncoding = "base64", inst._zod.check = (payload) => {
    if (isValidBase64(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
function isValidBase64URL(data) {
  if (!base64url.test(data))
    return !1;
  let base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/"), padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return isValidBase64(padded);
}
var $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
  def.pattern ?? (def.pattern = base64url), $ZodStringFormat.init(inst, def), inst._zod.bag.contentEncoding = "base64url", inst._zod.check = (payload) => {
    if (isValidBase64URL(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
}), $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
  def.pattern ?? (def.pattern = e164), $ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
  try {
    let tokensParts = token.split(".");
    if (tokensParts.length !== 3)
      return !1;
    let [header] = tokensParts;
    if (!header)
      return !1;
    let parsedHeader = JSON.parse(atob(header));
    if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
      return !1;
    if (!parsedHeader.alg)
      return !1;
    if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
      return !1;
    return !0;
  } catch {
    return !1;
  }
}
var $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
  $ZodStringFormat.init(inst, def), inst._zod.check = (payload) => {
    if (isValidJWT(payload.value, def.alg))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodNumber = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
  $ZodType.init(inst, def), inst._zod.pattern = inst._zod.bag.pattern ?? number, inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Number(payload.value);
      } catch (_) {}
    let input = payload.value;
    if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input))
      return payload;
    let received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
    return payload.issues.push({
      expected: "number",
      code: "invalid_type",
      input,
      inst,
      ...received ? { received } : {}
    }), payload;
  };
}), $ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumberFormat", (inst, def) => {
  $ZodCheckNumberFormat.init(inst, def), $ZodNumber.init(inst, def);
}), $ZodBoolean = /* @__PURE__ */ $constructor("$ZodBoolean", (inst, def) => {
  $ZodType.init(inst, def), inst._zod.pattern = boolean, inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Boolean(payload.value);
      } catch (_) {}
    let input = payload.value;
    if (typeof input === "boolean")
      return payload;
    return payload.issues.push({
      expected: "boolean",
      code: "invalid_type",
      input,
      inst
    }), payload;
  };
});
var $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
  $ZodType.init(inst, def), inst._zod.parse = (payload) => payload;
}), $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
  $ZodType.init(inst, def), inst._zod.parse = (payload, _ctx) => (payload.issues.push({
    expected: "never",
    code: "invalid_type",
    input: payload.value,
    inst
  }), payload);
});
function handleArrayResult(result, final, index) {
  if (result.issues.length)
    final.issues.push(...prefixIssues(index, result.issues));
  final.value[index] = result.value;
}
var $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
  $ZodType.init(inst, def), inst._zod.parse = (payload, ctx) => {
    let input = payload.value;
    if (!Array.isArray(input))
      return payload.issues.push({
        expected: "array",
        code: "invalid_type",
        input,
        inst
      }), payload;
    payload.value = Array(input.length);
    let proms = [];
    for (let i = 0;i < input.length; i++) {
      let item = input[i], result = def.element._zod.run({
        value: item,
        issues: []
      }, ctx);
      if (result instanceof Promise)
        proms.push(result.then((result) => handleArrayResult(result, payload, i)));
      else
        handleArrayResult(result, payload, i);
    }
    if (proms.length)
      return Promise.all(proms).then(() => payload);
    return payload;
  };
});
function handlePropertyResult(result, final, key, input, isOptionalOut) {
  if (result.issues.length) {
    if (isOptionalOut && !(key in input))
      return;
    final.issues.push(...prefixIssues(key, result.issues));
  }
  if (result.value === void 0) {
    if (key in input)
      final.value[key] = void 0;
  } else
    final.value[key] = result.value;
}
function normalizeDef(def) {
  let keys = Object.keys(def.shape);
  for (let k of keys)
    if (!def.shape?.[k]?._zod?.traits?.has("$ZodType"))
      throw Error(`Invalid element at key "${k}": expected a Zod schema`);
  let okeys = optionalKeys(def.shape);
  return {
    ...def,
    keys,
    keySet: new Set(keys),
    numKeys: keys.length,
    optionalKeys: new Set(okeys)
  };
}
function handleCatchall(proms, input, payload, ctx, def, inst) {
  let unrecognized = [], keySet = def.keySet, _catchall = def.catchall._zod, t = _catchall.def.type, isOptionalOut = _catchall.optout === "optional";
  for (let key in input) {
    if (keySet.has(key))
      continue;
    if (t === "never") {
      unrecognized.push(key);
      continue;
    }
    let r = _catchall.run({ value: input[key], issues: [] }, ctx);
    if (r instanceof Promise)
      proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalOut)));
    else
      handlePropertyResult(r, payload, key, input, isOptionalOut);
  }
  if (unrecognized.length)
    payload.issues.push({
      code: "unrecognized_keys",
      keys: unrecognized,
      input,
      inst
    });
  if (!proms.length)
    return payload;
  return Promise.all(proms).then(() => payload);
}
var $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
  if ($ZodType.init(inst, def), !Object.getOwnPropertyDescriptor(def, "shape")?.get) {
    let sh = def.shape;
    Object.defineProperty(def, "shape", {
      get: () => {
        let newSh = { ...sh };
        return Object.defineProperty(def, "shape", {
          value: newSh
        }), newSh;
      }
    });
  }
  let _normalized = cached(() => normalizeDef(def));
  defineLazy(inst._zod, "propValues", () => {
    let shape = def.shape, propValues = {};
    for (let key in shape) {
      let field = shape[key]._zod;
      if (field.values) {
        propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set);
        for (let v of field.values)
          propValues[key].add(v);
      }
    }
    return propValues;
  });
  let isObject2 = isObject, catchall = def.catchall, value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    let input = payload.value;
    if (!isObject2(input))
      return payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      }), payload;
    payload.value = {};
    let proms = [], shape = value.shape;
    for (let key of value.keys) {
      let el = shape[key], isOptionalOut = el._zod.optout === "optional", r = el._zod.run({ value: input[key], issues: [] }, ctx);
      if (r instanceof Promise)
        proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalOut)));
      else
        handlePropertyResult(r, payload, key, input, isOptionalOut);
    }
    if (!catchall)
      return proms.length ? Promise.all(proms).then(() => payload) : payload;
    return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
  };
}), $ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def) => {
  $ZodObject.init(inst, def);
  let superParse = inst._zod.parse, _normalized = cached(() => normalizeDef(def)), generateFastpass = (shape) => {
    let doc = new Doc(["shape", "payload", "ctx"]), normalized = _normalized.value, parseStr = (key) => {
      let k = esc(key);
      return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
    };
    doc.write("const input = payload.value;");
    let ids = Object.create(null), counter = 0;
    for (let key of normalized.keys)
      ids[key] = `key_${counter++}`;
    doc.write("const newResult = {};");
    for (let key of normalized.keys) {
      let id = ids[key], k = esc(key), isOptionalOut = shape[key]?._zod?.optout === "optional";
      if (doc.write(`const ${id} = ${parseStr(key)};`), isOptionalOut)
        doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
      else
        doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
    }
    doc.write("payload.value = newResult;"), doc.write("return payload;");
    let fn = doc.compile();
    return (payload, ctx) => fn(shape, payload, ctx);
  }, fastpass, isObject2 = isObject, jit = !globalConfig.jitless, fastEnabled = jit && allowsEval.value, catchall = def.catchall, value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    let input = payload.value;
    if (!isObject2(input))
      return payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      }), payload;
    if (jit && fastEnabled && ctx?.async === !1 && ctx.jitless !== !0) {
      if (!fastpass)
        fastpass = generateFastpass(def.shape);
      if (payload = fastpass(payload, ctx), !catchall)
        return payload;
      return handleCatchall([], input, payload, ctx, value, inst);
    }
    return superParse(payload, ctx);
  };
});
function handleUnionResults(results, final, inst, ctx) {
  for (let result of results)
    if (result.issues.length === 0)
      return final.value = result.value, final;
  let nonaborted = results.filter((r) => !aborted(r));
  if (nonaborted.length === 1)
    return final.value = nonaborted[0].value, nonaborted[0];
  return final.issues.push({
    code: "invalid_union",
    input: final.value,
    inst,
    errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  }), final;
}
var $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
  $ZodType.init(inst, def), defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0), defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0), defineLazy(inst._zod, "values", () => {
    if (def.options.every((o) => o._zod.values))
      return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
    return;
  }), defineLazy(inst._zod, "pattern", () => {
    if (def.options.every((o) => o._zod.pattern)) {
      let patterns = def.options.map((o) => o._zod.pattern);
      return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
    }
    return;
  });
  let single = def.options.length === 1, first = def.options[0]._zod.run;
  inst._zod.parse = (payload, ctx) => {
    if (single)
      return first(payload, ctx);
    let async = !1, results = [];
    for (let option of def.options) {
      let result = option._zod.run({
        value: payload.value,
        issues: []
      }, ctx);
      if (result instanceof Promise)
        results.push(result), async = !0;
      else {
        if (result.issues.length === 0)
          return result;
        results.push(result);
      }
    }
    if (!async)
      return handleUnionResults(results, payload, inst, ctx);
    return Promise.all(results).then((results) => handleUnionResults(results, payload, inst, ctx));
  };
});
var $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
  $ZodType.init(inst, def), inst._zod.parse = (payload, ctx) => {
    let input = payload.value, left = def.left._zod.run({ value: input, issues: [] }, ctx), right = def.right._zod.run({ value: input, issues: [] }, ctx);
    if (left instanceof Promise || right instanceof Promise)
      return Promise.all([left, right]).then(([left, right]) => handleIntersectionResults(payload, left, right));
    return handleIntersectionResults(payload, left, right);
  };
});
function mergeValues(a, b) {
  if (a === b)
    return { valid: !0, data: a };
  if (a instanceof Date && b instanceof Date && +a === +b)
    return { valid: !0, data: a };
  if (isPlainObject(a) && isPlainObject(b)) {
    let bKeys = Object.keys(b), sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1), newObj = { ...a, ...b };
    for (let key of sharedKeys) {
      let sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid)
        return {
          valid: !1,
          mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
        };
      newObj[key] = sharedValue.data;
    }
    return { valid: !0, data: newObj };
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length)
      return { valid: !1, mergeErrorPath: [] };
    let newArray = [];
    for (let index = 0;index < a.length; index++) {
      let itemA = a[index], itemB = b[index], sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid)
        return {
          valid: !1,
          mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
        };
      newArray.push(sharedValue.data);
    }
    return { valid: !0, data: newArray };
  }
  return { valid: !1, mergeErrorPath: [] };
}
function handleIntersectionResults(result, left, right) {
  let unrecKeys = /* @__PURE__ */ new Map, unrecIssue;
  for (let iss of left.issues)
    if (iss.code === "unrecognized_keys") {
      unrecIssue ?? (unrecIssue = iss);
      for (let k of iss.keys) {
        if (!unrecKeys.has(k))
          unrecKeys.set(k, {});
        unrecKeys.get(k).l = !0;
      }
    } else
      result.issues.push(iss);
  for (let iss of right.issues)
    if (iss.code === "unrecognized_keys")
      for (let k of iss.keys) {
        if (!unrecKeys.has(k))
          unrecKeys.set(k, {});
        unrecKeys.get(k).r = !0;
      }
    else
      result.issues.push(iss);
  let bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
  if (bothKeys.length && unrecIssue)
    result.issues.push({ ...unrecIssue, keys: bothKeys });
  if (aborted(result))
    return result;
  let merged = mergeValues(left.value, right.value);
  if (!merged.valid)
    throw Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
  return result.value = merged.data, result;
}
var $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
  $ZodType.init(inst, def);
  let values = getEnumValues(def.entries), valuesSet = new Set(values);
  inst._zod.values = valuesSet, inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`), inst._zod.parse = (payload, _ctx) => {
    let input = payload.value;
    if (valuesSet.has(input))
      return payload;
    return payload.issues.push({
      code: "invalid_value",
      values,
      input,
      inst
    }), payload;
  };
});
var $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
  $ZodType.init(inst, def), inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward")
      throw new $ZodEncodeError(inst.constructor.name);
    let _out = def.transform(payload.value, payload);
    if (ctx.async)
      return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => (payload.value = output, payload));
    if (_out instanceof Promise)
      throw new $ZodAsyncError;
    return payload.value = _out, payload;
  };
});
function handleOptionalResult(result, input) {
  if (result.issues.length && input === void 0)
    return { issues: [], value: void 0 };
  return result;
}
var $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
  $ZodType.init(inst, def), inst._zod.optin = "optional", inst._zod.optout = "optional", defineLazy(inst._zod, "values", () => def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0]) : void 0), defineLazy(inst._zod, "pattern", () => {
    let pattern = def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
  }), inst._zod.parse = (payload, ctx) => {
    if (def.innerType._zod.optin === "optional") {
      let result = def.innerType._zod.run(payload, ctx);
      if (result instanceof Promise)
        return result.then((r) => handleOptionalResult(r, payload.value));
      return handleOptionalResult(result, payload.value);
    }
    if (payload.value === void 0)
      return payload;
    return def.innerType._zod.run(payload, ctx);
  };
}), $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
  $ZodOptional.init(inst, def), defineLazy(inst._zod, "values", () => def.innerType._zod.values), defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern), inst._zod.parse = (payload, ctx) => def.innerType._zod.run(payload, ctx);
}), $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
  $ZodType.init(inst, def), defineLazy(inst._zod, "optin", () => def.innerType._zod.optin), defineLazy(inst._zod, "optout", () => def.innerType._zod.optout), defineLazy(inst._zod, "pattern", () => {
    let pattern = def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
  }), defineLazy(inst._zod, "values", () => def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, null]) : void 0), inst._zod.parse = (payload, ctx) => {
    if (payload.value === null)
      return payload;
    return def.innerType._zod.run(payload, ctx);
  };
}), $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
  $ZodType.init(inst, def), inst._zod.optin = "optional", defineLazy(inst._zod, "values", () => def.innerType._zod.values), inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward")
      return def.innerType._zod.run(payload, ctx);
    if (payload.value === void 0)
      return payload.value = def.defaultValue, payload;
    let result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise)
      return result.then((result) => handleDefaultResult(result, def));
    return handleDefaultResult(result, def);
  };
});
function handleDefaultResult(payload, def) {
  if (payload.value === void 0)
    payload.value = def.defaultValue;
  return payload;
}
var $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
  $ZodType.init(inst, def), inst._zod.optin = "optional", defineLazy(inst._zod, "values", () => def.innerType._zod.values), inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward")
      return def.innerType._zod.run(payload, ctx);
    if (payload.value === void 0)
      payload.value = def.defaultValue;
    return def.innerType._zod.run(payload, ctx);
  };
}), $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
  $ZodType.init(inst, def), defineLazy(inst._zod, "values", () => {
    let v = def.innerType._zod.values;
    return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
  }), inst._zod.parse = (payload, ctx) => {
    let result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise)
      return result.then((result) => handleNonOptionalResult(result, inst));
    return handleNonOptionalResult(result, inst);
  };
});
function handleNonOptionalResult(payload, inst) {
  if (!payload.issues.length && payload.value === void 0)
    payload.issues.push({
      code: "invalid_type",
      expected: "nonoptional",
      input: payload.value,
      inst
    });
  return payload;
}
var $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
  $ZodType.init(inst, def), defineLazy(inst._zod, "optin", () => def.innerType._zod.optin), defineLazy(inst._zod, "optout", () => def.innerType._zod.optout), defineLazy(inst._zod, "values", () => def.innerType._zod.values), inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward")
      return def.innerType._zod.run(payload, ctx);
    let result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise)
      return result.then((result) => {
        if (payload.value = result.value, result.issues.length)
          payload.value = def.catchValue({
            ...payload,
            error: {
              issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
            },
            input: payload.value
          }), payload.issues = [];
        return payload;
      });
    if (payload.value = result.value, result.issues.length)
      payload.value = def.catchValue({
        ...payload,
        error: {
          issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
        },
        input: payload.value
      }), payload.issues = [];
    return payload;
  };
});
var $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
  $ZodType.init(inst, def), defineLazy(inst._zod, "values", () => def.in._zod.values), defineLazy(inst._zod, "optin", () => def.in._zod.optin), defineLazy(inst._zod, "optout", () => def.out._zod.optout), defineLazy(inst._zod, "propValues", () => def.in._zod.propValues), inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      let right = def.out._zod.run(payload, ctx);
      if (right instanceof Promise)
        return right.then((right) => handlePipeResult(right, def.in, ctx));
      return handlePipeResult(right, def.in, ctx);
    }
    let left = def.in._zod.run(payload, ctx);
    if (left instanceof Promise)
      return left.then((left) => handlePipeResult(left, def.out, ctx));
    return handlePipeResult(left, def.out, ctx);
  };
});
function handlePipeResult(left, next, ctx) {
  if (left.issues.length)
    return left.aborted = !0, left;
  return next._zod.run({ value: left.value, issues: left.issues }, ctx);
}
var $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
  $ZodType.init(inst, def), defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues), defineLazy(inst._zod, "values", () => def.innerType._zod.values), defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin), defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout), inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward")
      return def.innerType._zod.run(payload, ctx);
    let result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise)
      return result.then(handleReadonlyResult);
    return handleReadonlyResult(result);
  };
});
function handleReadonlyResult(payload) {
  return payload.value = Object.freeze(payload.value), payload;
}
var $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
  $ZodCheck.init(inst, def), $ZodType.init(inst, def), inst._zod.parse = (payload, _) => payload, inst._zod.check = (payload) => {
    let input = payload.value, r = def.fn(input);
    if (r instanceof Promise)
      return r.then((r) => handleRefineResult(r, payload, input, inst));
    handleRefineResult(r, payload, input, inst);
    return;
  };
});
function handleRefineResult(result, payload, input, inst) {
  if (!result) {
    let _iss = {
      code: "custom",
      input,
      inst,
      path: [...inst._zod.def.path ?? []],
      continue: !inst._zod.def.abort
    };
    if (inst._zod.def.params)
      _iss.params = inst._zod.def.params;
    payload.issues.push(issue(_iss));
  }
}
// ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/registries.js
var _a, $output = Symbol("ZodOutput"), $input = Symbol("ZodInput");

class $ZodRegistry {
  constructor() {
    this._map = /* @__PURE__ */ new WeakMap, this._idmap = /* @__PURE__ */ new Map;
  }
  add(schema, ..._meta) {
    let meta = _meta[0];
    if (this._map.set(schema, meta), meta && typeof meta === "object" && "id" in meta)
      this._idmap.set(meta.id, schema);
    return this;
  }
  clear() {
    return this._map = /* @__PURE__ */ new WeakMap, this._idmap = /* @__PURE__ */ new Map, this;
  }
  remove(schema) {
    let meta = this._map.get(schema);
    if (meta && typeof meta === "object" && "id" in meta)
      this._idmap.delete(meta.id);
    return this._map.delete(schema), this;
  }
  get(schema) {
    let p = schema._zod.parent;
    if (p) {
      let pm = { ...this.get(p) ?? {} };
      delete pm.id;
      let f = { ...pm, ...this._map.get(schema) };
      return Object.keys(f).length ? f : void 0;
    }
    return this._map.get(schema);
  }
  has(schema) {
    return this._map.has(schema);
  }
}
function registry() {
  return new $ZodRegistry;
}
(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
var globalRegistry = globalThis.__zod_globalRegistry;
// ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/api.js
function _string(Class, params) {
  return new Class({
    type: "string",
    ...normalizeParams(params)
  });
}
function _email(Class, params) {
  return new Class({
    type: "string",
    format: "email",
    check: "string_format",
    abort: !1,
    ...normalizeParams(params)
  });
}
function _guid(Class, params) {
  return new Class({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: !1,
    ...normalizeParams(params)
  });
}
function _uuid(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    ...normalizeParams(params)
  });
}
function _uuidv4(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v4",
    ...normalizeParams(params)
  });
}
function _uuidv6(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v6",
    ...normalizeParams(params)
  });
}
function _uuidv7(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v7",
    ...normalizeParams(params)
  });
}
function _url(Class, params) {
  return new Class({
    type: "string",
    format: "url",
    check: "string_format",
    abort: !1,
    ...normalizeParams(params)
  });
}
function _emoji2(Class, params) {
  return new Class({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: !1,
    ...normalizeParams(params)
  });
}
function _nanoid(Class, params) {
  return new Class({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: !1,
    ...normalizeParams(params)
  });
}
function _cuid(Class, params) {
  return new Class({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: !1,
    ...normalizeParams(params)
  });
}
function _cuid2(Class, params) {
  return new Class({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: !1,
    ...normalizeParams(params)
  });
}
function _ulid(Class, params) {
  return new Class({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: !1,
    ...normalizeParams(params)
  });
}
function _xid(Class, params) {
  return new Class({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: !1,
    ...normalizeParams(params)
  });
}
function _ksuid(Class, params) {
  return new Class({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: !1,
    ...normalizeParams(params)
  });
}
function _ipv4(Class, params) {
  return new Class({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: !1,
    ...normalizeParams(params)
  });
}
function _ipv6(Class, params) {
  return new Class({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: !1,
    ...normalizeParams(params)
  });
}
function _cidrv4(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: !1,
    ...normalizeParams(params)
  });
}
function _cidrv6(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: !1,
    ...normalizeParams(params)
  });
}
function _base64(Class, params) {
  return new Class({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: !1,
    ...normalizeParams(params)
  });
}
function _base64url(Class, params) {
  return new Class({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: !1,
    ...normalizeParams(params)
  });
}
function _e164(Class, params) {
  return new Class({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: !1,
    ...normalizeParams(params)
  });
}
function _jwt(Class, params) {
  return new Class({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: !1,
    ...normalizeParams(params)
  });
}
function _isoDateTime(Class, params) {
  return new Class({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: !1,
    local: !1,
    precision: null,
    ...normalizeParams(params)
  });
}
function _isoDate(Class, params) {
  return new Class({
    type: "string",
    format: "date",
    check: "string_format",
    ...normalizeParams(params)
  });
}
function _isoTime(Class, params) {
  return new Class({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...normalizeParams(params)
  });
}
function _isoDuration(Class, params) {
  return new Class({
    type: "string",
    format: "duration",
    check: "string_format",
    ...normalizeParams(params)
  });
}
function _number(Class, params) {
  return new Class({
    type: "number",
    checks: [],
    ...normalizeParams(params)
  });
}
function _int(Class, params) {
  return new Class({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "safeint",
    ...normalizeParams(params)
  });
}
function _boolean(Class, params) {
  return new Class({
    type: "boolean",
    ...normalizeParams(params)
  });
}
function _unknown(Class) {
  return new Class({
    type: "unknown"
  });
}
function _never(Class, params) {
  return new Class({
    type: "never",
    ...normalizeParams(params)
  });
}
function _lt(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: !1
  });
}
function _lte(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: !0
  });
}
function _gt(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: !1
  });
}
function _gte(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: !0
  });
}
function _multipleOf(value, params) {
  return new $ZodCheckMultipleOf({
    check: "multiple_of",
    ...normalizeParams(params),
    value
  });
}
function _maxLength(maximum, params) {
  return new $ZodCheckMaxLength({
    check: "max_length",
    ...normalizeParams(params),
    maximum
  });
}
function _minLength(minimum, params) {
  return new $ZodCheckMinLength({
    check: "min_length",
    ...normalizeParams(params),
    minimum
  });
}
function _length(length, params) {
  return new $ZodCheckLengthEquals({
    check: "length_equals",
    ...normalizeParams(params),
    length
  });
}
function _regex(pattern, params) {
  return new $ZodCheckRegex({
    check: "string_format",
    format: "regex",
    ...normalizeParams(params),
    pattern
  });
}
function _lowercase(params) {
  return new $ZodCheckLowerCase({
    check: "string_format",
    format: "lowercase",
    ...normalizeParams(params)
  });
}
function _uppercase(params) {
  return new $ZodCheckUpperCase({
    check: "string_format",
    format: "uppercase",
    ...normalizeParams(params)
  });
}
function _includes(includes, params) {
  return new $ZodCheckIncludes({
    check: "string_format",
    format: "includes",
    ...normalizeParams(params),
    includes
  });
}
function _startsWith(prefix, params) {
  return new $ZodCheckStartsWith({
    check: "string_format",
    format: "starts_with",
    ...normalizeParams(params),
    prefix
  });
}
function _endsWith(suffix, params) {
  return new $ZodCheckEndsWith({
    check: "string_format",
    format: "ends_with",
    ...normalizeParams(params),
    suffix
  });
}
function _overwrite(tx) {
  return new $ZodCheckOverwrite({
    check: "overwrite",
    tx
  });
}
function _normalize(form) {
  return _overwrite((input) => input.normalize(form));
}
function _trim() {
  return _overwrite((input) => input.trim());
}
function _toLowerCase() {
  return _overwrite((input) => input.toLowerCase());
}
function _toUpperCase() {
  return _overwrite((input) => input.toUpperCase());
}
function _slugify() {
  return _overwrite((input) => slugify(input));
}
function _array(Class, element, params) {
  return new Class({
    type: "array",
    element,
    ...normalizeParams(params)
  });
}
function _refine(Class, fn, _params) {
  return new Class({
    type: "custom",
    check: "custom",
    fn,
    ...normalizeParams(_params)
  });
}
function _superRefine(fn) {
  let ch = _check((payload) => (payload.addIssue = (issue2) => {
    if (typeof issue2 === "string")
      payload.issues.push(issue(issue2, payload.value, ch._zod.def));
    else {
      let _issue = issue2;
      if (_issue.fatal)
        _issue.continue = !1;
      _issue.code ?? (_issue.code = "custom"), _issue.input ?? (_issue.input = payload.value), _issue.inst ?? (_issue.inst = ch), _issue.continue ?? (_issue.continue = !ch._zod.def.abort), payload.issues.push(issue(_issue));
    }
  }, fn(payload.value, payload)));
  return ch;
}
function _check(fn, params) {
  let ch = new $ZodCheck({
    check: "custom",
    ...normalizeParams(params)
  });
  return ch._zod.check = fn, ch;
}
// ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/to-json-schema.js
function initializeContext(params) {
  let target = params?.target ?? "draft-2020-12";
  if (target === "draft-4")
    target = "draft-04";
  if (target === "draft-7")
    target = "draft-07";
  return {
    processors: params.processors ?? {},
    metadataRegistry: params?.metadata ?? globalRegistry,
    target,
    unrepresentable: params?.unrepresentable ?? "throw",
    override: params?.override ?? (() => {}),
    io: params?.io ?? "output",
    counter: 0,
    seen: /* @__PURE__ */ new Map,
    cycles: params?.cycles ?? "ref",
    reused: params?.reused ?? "inline",
    external: params?.external ?? void 0
  };
}
function process2(schema, ctx, _params = { path: [], schemaPath: [] }) {
  var _a;
  let def = schema._zod.def, seen = ctx.seen.get(schema);
  if (seen) {
    if (seen.count++, _params.schemaPath.includes(schema))
      seen.cycle = _params.path;
    return seen.schema;
  }
  let result = { schema: {}, count: 1, cycle: void 0, path: _params.path };
  ctx.seen.set(schema, result);
  let overrideSchema = schema._zod.toJSONSchema?.();
  if (overrideSchema)
    result.schema = overrideSchema;
  else {
    let params = {
      ..._params,
      schemaPath: [..._params.schemaPath, schema],
      path: _params.path
    };
    if (schema._zod.processJSONSchema)
      schema._zod.processJSONSchema(ctx, result.schema, params);
    else {
      let _json = result.schema, processor = ctx.processors[def.type];
      if (!processor)
        throw Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
      processor(schema, ctx, _json, params);
    }
    let parent = schema._zod.parent;
    if (parent) {
      if (!result.ref)
        result.ref = parent;
      process2(parent, ctx, params), ctx.seen.get(parent).isParent = !0;
    }
  }
  let meta = ctx.metadataRegistry.get(schema);
  if (meta)
    Object.assign(result.schema, meta);
  if (ctx.io === "input" && isTransforming(schema))
    delete result.schema.examples, delete result.schema.default;
  if (ctx.io === "input" && result.schema._prefault)
    (_a = result.schema).default ?? (_a.default = result.schema._prefault);
  return delete result.schema._prefault, ctx.seen.get(schema).schema;
}
function extractDefs(ctx, schema) {
  let root = ctx.seen.get(schema);
  if (!root)
    throw Error("Unprocessed schema. This is a bug in Zod.");
  let idToSchema = /* @__PURE__ */ new Map;
  for (let entry of ctx.seen.entries()) {
    let id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      let existing = idToSchema.get(id);
      if (existing && existing !== entry[0])
        throw Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      idToSchema.set(id, entry[0]);
    }
  }
  let makeURI = (entry) => {
    let defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
    if (ctx.external) {
      let externalId = ctx.external.registry.get(entry[0])?.id, uriGenerator = ctx.external.uri ?? ((id) => id);
      if (externalId)
        return { ref: uriGenerator(externalId) };
      let id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
      return entry[1].defId = id, { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}` };
    }
    if (entry[1] === root)
      return { ref: "#" };
    let defUriPrefix = `${"#"}/${defsSegment}/`, defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
    return { defId, ref: defUriPrefix + defId };
  }, extractToDef = (entry) => {
    if (entry[1].schema.$ref)
      return;
    let seen = entry[1], { ref, defId } = makeURI(entry);
    if (seen.def = { ...seen.schema }, defId)
      seen.defId = defId;
    let schema = seen.schema;
    for (let key in schema)
      delete schema[key];
    schema.$ref = ref;
  };
  if (ctx.cycles === "throw")
    for (let entry of ctx.seen.entries()) {
      let seen = entry[1];
      if (seen.cycle)
        throw Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
    }
  for (let entry of ctx.seen.entries()) {
    let seen = entry[1];
    if (schema === entry[0]) {
      extractToDef(entry);
      continue;
    }
    if (ctx.external) {
      let ext = ctx.external.registry.get(entry[0])?.id;
      if (schema !== entry[0] && ext) {
        extractToDef(entry);
        continue;
      }
    }
    if (ctx.metadataRegistry.get(entry[0])?.id) {
      extractToDef(entry);
      continue;
    }
    if (seen.cycle) {
      extractToDef(entry);
      continue;
    }
    if (seen.count > 1) {
      if (ctx.reused === "ref") {
        extractToDef(entry);
        continue;
      }
    }
  }
}
function finalize(ctx, schema) {
  let root = ctx.seen.get(schema);
  if (!root)
    throw Error("Unprocessed schema. This is a bug in Zod.");
  let flattenRef = (zodSchema) => {
    let seen = ctx.seen.get(zodSchema);
    if (seen.ref === null)
      return;
    let schema = seen.def ?? seen.schema, _cached = { ...schema }, ref = seen.ref;
    if (seen.ref = null, ref) {
      flattenRef(ref);
      let refSeen = ctx.seen.get(ref), refSchema = refSeen.schema;
      if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0"))
        schema.allOf = schema.allOf ?? [], schema.allOf.push(refSchema);
      else
        Object.assign(schema, refSchema);
      if (Object.assign(schema, _cached), zodSchema._zod.parent === ref)
        for (let key in schema) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (!(key in _cached))
            delete schema[key];
        }
      if (refSchema.$ref && refSeen.def)
        for (let key in schema) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key]))
            delete schema[key];
        }
    }
    let parent = zodSchema._zod.parent;
    if (parent && parent !== ref) {
      flattenRef(parent);
      let parentSeen = ctx.seen.get(parent);
      if (parentSeen?.schema.$ref) {
        if (schema.$ref = parentSeen.schema.$ref, parentSeen.def)
          for (let key in schema) {
            if (key === "$ref" || key === "allOf")
              continue;
            if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key]))
              delete schema[key];
          }
      }
    }
    ctx.override({
      zodSchema,
      jsonSchema: schema,
      path: seen.path ?? []
    });
  };
  for (let entry of [...ctx.seen.entries()].reverse())
    flattenRef(entry[0]);
  let result = {};
  if (ctx.target === "draft-2020-12")
    result.$schema = "https://json-schema.org/draft/2020-12/schema";
  else if (ctx.target === "draft-07")
    result.$schema = "http://json-schema.org/draft-07/schema#";
  else if (ctx.target === "draft-04")
    result.$schema = "http://json-schema.org/draft-04/schema#";
  else if (ctx.target === "openapi-3.0")
    ;
  if (ctx.external?.uri) {
    let id = ctx.external.registry.get(schema)?.id;
    if (!id)
      throw Error("Schema is missing an `id` property");
    result.$id = ctx.external.uri(id);
  }
  Object.assign(result, root.def ?? root.schema);
  let defs = ctx.external?.defs ?? {};
  for (let entry of ctx.seen.entries()) {
    let seen = entry[1];
    if (seen.def && seen.defId)
      defs[seen.defId] = seen.def;
  }
  if (ctx.external)
    ;
  else if (Object.keys(defs).length > 0)
    if (ctx.target === "draft-2020-12")
      result.$defs = defs;
    else
      result.definitions = defs;
  try {
    let finalized = JSON.parse(JSON.stringify(result));
    return Object.defineProperty(finalized, "~standard", {
      value: {
        ...schema["~standard"],
        jsonSchema: {
          input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
          output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
        }
      },
      enumerable: !1,
      writable: !1
    }), finalized;
  } catch (_err) {
    throw Error("Error converting schema to JSON.");
  }
}
function isTransforming(_schema, _ctx) {
  let ctx = _ctx ?? { seen: /* @__PURE__ */ new Set };
  if (ctx.seen.has(_schema))
    return !1;
  ctx.seen.add(_schema);
  let def = _schema._zod.def;
  if (def.type === "transform")
    return !0;
  if (def.type === "array")
    return isTransforming(def.element, ctx);
  if (def.type === "set")
    return isTransforming(def.valueType, ctx);
  if (def.type === "lazy")
    return isTransforming(def.getter(), ctx);
  if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault")
    return isTransforming(def.innerType, ctx);
  if (def.type === "intersection")
    return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
  if (def.type === "record" || def.type === "map")
    return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
  if (def.type === "pipe")
    return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
  if (def.type === "object") {
    for (let key in def.shape)
      if (isTransforming(def.shape[key], ctx))
        return !0;
    return !1;
  }
  if (def.type === "union") {
    for (let option of def.options)
      if (isTransforming(option, ctx))
        return !0;
    return !1;
  }
  if (def.type === "tuple") {
    for (let item of def.items)
      if (isTransforming(item, ctx))
        return !0;
    if (def.rest && isTransforming(def.rest, ctx))
      return !0;
    return !1;
  }
  return !1;
}
var createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
  let ctx = initializeContext({ ...params, processors });
  return process2(schema, ctx), extractDefs(ctx, schema), finalize(ctx, schema);
}, createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
  let { libraryOptions, target } = params ?? {}, ctx = initializeContext({ ...libraryOptions ?? {}, target, io, processors });
  return process2(schema, ctx), extractDefs(ctx, schema), finalize(ctx, schema);
};
// ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/core/json-schema-processors.js
var formatMap = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
}, stringProcessor = (schema, ctx, _json, _params) => {
  let json = _json;
  json.type = "string";
  let { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
  if (typeof minimum === "number")
    json.minLength = minimum;
  if (typeof maximum === "number")
    json.maxLength = maximum;
  if (format) {
    if (json.format = formatMap[format] ?? format, json.format === "")
      delete json.format;
    if (format === "time")
      delete json.format;
  }
  if (contentEncoding)
    json.contentEncoding = contentEncoding;
  if (patterns && patterns.size > 0) {
    let regexes = [...patterns];
    if (regexes.length === 1)
      json.pattern = regexes[0].source;
    else if (regexes.length > 1)
      json.allOf = [
        ...regexes.map((regex) => ({
          ...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
          pattern: regex.source
        }))
      ];
  }
}, numberProcessor = (schema, ctx, _json, _params) => {
  let json = _json, { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
  if (typeof format === "string" && format.includes("int"))
    json.type = "integer";
  else
    json.type = "number";
  if (typeof exclusiveMinimum === "number")
    if (ctx.target === "draft-04" || ctx.target === "openapi-3.0")
      json.minimum = exclusiveMinimum, json.exclusiveMinimum = !0;
    else
      json.exclusiveMinimum = exclusiveMinimum;
  if (typeof minimum === "number") {
    if (json.minimum = minimum, typeof exclusiveMinimum === "number" && ctx.target !== "draft-04")
      if (exclusiveMinimum >= minimum)
        delete json.minimum;
      else
        delete json.exclusiveMinimum;
  }
  if (typeof exclusiveMaximum === "number")
    if (ctx.target === "draft-04" || ctx.target === "openapi-3.0")
      json.maximum = exclusiveMaximum, json.exclusiveMaximum = !0;
    else
      json.exclusiveMaximum = exclusiveMaximum;
  if (typeof maximum === "number") {
    if (json.maximum = maximum, typeof exclusiveMaximum === "number" && ctx.target !== "draft-04")
      if (exclusiveMaximum <= maximum)
        delete json.maximum;
      else
        delete json.exclusiveMaximum;
  }
  if (typeof multipleOf === "number")
    json.multipleOf = multipleOf;
}, booleanProcessor = (_schema, _ctx, json, _params) => {
  json.type = "boolean";
};
var neverProcessor = (_schema, _ctx, json, _params) => {
  json.not = {};
};
var unknownProcessor = (_schema, _ctx, _json, _params) => {};
var enumProcessor = (schema, _ctx, json, _params) => {
  let def = schema._zod.def, values = getEnumValues(def.entries);
  if (values.every((v) => typeof v === "number"))
    json.type = "number";
  if (values.every((v) => typeof v === "string"))
    json.type = "string";
  json.enum = values;
};
var customProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw")
    throw Error("Custom types cannot be represented in JSON Schema");
};
var transformProcessor = (_schema, ctx, _json, _params) => {
  if (ctx.unrepresentable === "throw")
    throw Error("Transforms cannot be represented in JSON Schema");
};
var arrayProcessor = (schema, ctx, _json, params) => {
  let json = _json, def = schema._zod.def, { minimum, maximum } = schema._zod.bag;
  if (typeof minimum === "number")
    json.minItems = minimum;
  if (typeof maximum === "number")
    json.maxItems = maximum;
  json.type = "array", json.items = process2(def.element, ctx, { ...params, path: [...params.path, "items"] });
}, objectProcessor = (schema, ctx, _json, params) => {
  let json = _json, def = schema._zod.def;
  json.type = "object", json.properties = {};
  let shape = def.shape;
  for (let key in shape)
    json.properties[key] = process2(shape[key], ctx, {
      ...params,
      path: [...params.path, "properties", key]
    });
  let allKeys = new Set(Object.keys(shape)), requiredKeys = new Set([...allKeys].filter((key) => {
    let v = def.shape[key]._zod;
    if (ctx.io === "input")
      return v.optin === void 0;
    else
      return v.optout === void 0;
  }));
  if (requiredKeys.size > 0)
    json.required = Array.from(requiredKeys);
  if (def.catchall?._zod.def.type === "never")
    json.additionalProperties = !1;
  else if (!def.catchall) {
    if (ctx.io === "output")
      json.additionalProperties = !1;
  } else if (def.catchall)
    json.additionalProperties = process2(def.catchall, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
}, unionProcessor = (schema, ctx, json, params) => {
  let def = schema._zod.def, isExclusive = def.inclusive === !1, options = def.options.map((x, i) => process2(x, ctx, {
    ...params,
    path: [...params.path, isExclusive ? "oneOf" : "anyOf", i]
  }));
  if (isExclusive)
    json.oneOf = options;
  else
    json.anyOf = options;
}, intersectionProcessor = (schema, ctx, json, params) => {
  let def = schema._zod.def, a = process2(def.left, ctx, {
    ...params,
    path: [...params.path, "allOf", 0]
  }), b = process2(def.right, ctx, {
    ...params,
    path: [...params.path, "allOf", 1]
  }), isSimpleIntersection = (val) => ("allOf" in val) && Object.keys(val).length === 1, allOf = [
    ...isSimpleIntersection(a) ? a.allOf : [a],
    ...isSimpleIntersection(b) ? b.allOf : [b]
  ];
  json.allOf = allOf;
};
var nullableProcessor = (schema, ctx, json, params) => {
  let def = schema._zod.def, inner = process2(def.innerType, ctx, params), seen = ctx.seen.get(schema);
  if (ctx.target === "openapi-3.0")
    seen.ref = def.innerType, json.nullable = !0;
  else
    json.anyOf = [inner, { type: "null" }];
}, nonoptionalProcessor = (schema, ctx, _json, params) => {
  let def = schema._zod.def;
  process2(def.innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
}, defaultProcessor = (schema, ctx, json, params) => {
  let def = schema._zod.def;
  process2(def.innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  seen.ref = def.innerType, json.default = JSON.parse(JSON.stringify(def.defaultValue));
}, prefaultProcessor = (schema, ctx, json, params) => {
  let def = schema._zod.def;
  process2(def.innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  if (seen.ref = def.innerType, ctx.io === "input")
    json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
}, catchProcessor = (schema, ctx, json, params) => {
  let def = schema._zod.def;
  process2(def.innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  let catchValue;
  try {
    catchValue = def.catchValue(void 0);
  } catch {
    throw Error("Dynamic catch values are not supported in JSON Schema");
  }
  json.default = catchValue;
}, pipeProcessor = (schema, ctx, _json, params) => {
  let def = schema._zod.def, innerType = ctx.io === "input" ? def.in._zod.def.type === "transform" ? def.out : def.in : def.out;
  process2(innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  seen.ref = innerType;
}, readonlyProcessor = (schema, ctx, json, params) => {
  let def = schema._zod.def;
  process2(def.innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  seen.ref = def.innerType, json.readOnly = !0;
};
var optionalProcessor = (schema, ctx, _json, params) => {
  let def = schema._zod.def;
  process2(def.innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
// ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/classic/iso.js
var ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
  $ZodISODateTime.init(inst, def), ZodStringFormat.init(inst, def);
});
function datetime2(params) {
  return _isoDateTime(ZodISODateTime, params);
}
var ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
  $ZodISODate.init(inst, def), ZodStringFormat.init(inst, def);
});
function date2(params) {
  return _isoDate(ZodISODate, params);
}
var ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
  $ZodISOTime.init(inst, def), ZodStringFormat.init(inst, def);
});
function time2(params) {
  return _isoTime(ZodISOTime, params);
}
var ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
  $ZodISODuration.init(inst, def), ZodStringFormat.init(inst, def);
});
function duration2(params) {
  return _isoDuration(ZodISODuration, params);
}

// ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/classic/errors.js
var initializer2 = (inst, issues) => {
  $ZodError.init(inst, issues), inst.name = "ZodError", Object.defineProperties(inst, {
    format: {
      value: (mapper) => formatError(inst, mapper)
    },
    flatten: {
      value: (mapper) => flattenError(inst, mapper)
    },
    addIssue: {
      value: (issue) => {
        inst.issues.push(issue), inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }
    },
    addIssues: {
      value: (issues) => {
        inst.issues.push(...issues), inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }
    },
    isEmpty: {
      get() {
        return inst.issues.length === 0;
      }
    }
  });
}, ZodError = $constructor("ZodError", initializer2), ZodRealError = $constructor("ZodError", initializer2, {
  Parent: Error
});

// ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/classic/parse.js
var parse3 = /* @__PURE__ */ _parse(ZodRealError), parseAsync2 = /* @__PURE__ */ _parseAsync(ZodRealError), safeParse2 = /* @__PURE__ */ _safeParse(ZodRealError), safeParseAsync2 = /* @__PURE__ */ _safeParseAsync(ZodRealError), encode = /* @__PURE__ */ _encode(ZodRealError), decode = /* @__PURE__ */ _decode(ZodRealError), encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError), decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError), safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError), safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError), safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError), safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);

// ../../node_modules/.bun/zod@4.3.6/node_modules/zod/v4/classic/schemas.js
var ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => ($ZodType.init(inst, def), Object.assign(inst["~standard"], {
  jsonSchema: {
    input: createStandardJSONSchemaMethod(inst, "input"),
    output: createStandardJSONSchemaMethod(inst, "output")
  }
}), inst.toJSONSchema = createToJSONSchemaMethod(inst, {}), inst.def = def, inst.type = def.type, Object.defineProperty(inst, "_def", { value: def }), inst.check = (...checks) => inst.clone(mergeDefs(def, {
  checks: [
    ...def.checks ?? [],
    ...checks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
  ]
}), {
  parent: !0
}), inst.with = inst.check, inst.clone = (def, params) => clone(inst, def, params), inst.brand = () => inst, inst.register = (reg, meta) => (reg.add(inst, meta), inst), inst.parse = (data, params) => parse3(inst, data, params, { callee: inst.parse }), inst.safeParse = (data, params) => safeParse2(inst, data, params), inst.parseAsync = async (data, params) => parseAsync2(inst, data, params, { callee: inst.parseAsync }), inst.safeParseAsync = async (data, params) => safeParseAsync2(inst, data, params), inst.spa = inst.safeParseAsync, inst.encode = (data, params) => encode(inst, data, params), inst.decode = (data, params) => decode(inst, data, params), inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params), inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params), inst.safeEncode = (data, params) => safeEncode(inst, data, params), inst.safeDecode = (data, params) => safeDecode(inst, data, params), inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params), inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params), inst.refine = (check, params) => inst.check(refine(check, params)), inst.superRefine = (refinement) => inst.check(superRefine(refinement)), inst.overwrite = (fn) => inst.check(_overwrite(fn)), inst.optional = () => optional(inst), inst.exactOptional = () => exactOptional(inst), inst.nullable = () => nullable(inst), inst.nullish = () => optional(nullable(inst)), inst.nonoptional = (params) => nonoptional(inst, params), inst.array = () => array(inst), inst.or = (arg) => union([inst, arg]), inst.and = (arg) => intersection(inst, arg), inst.transform = (tx) => pipe(inst, transform(tx)), inst.default = (def) => _default(inst, def), inst.prefault = (def) => prefault(inst, def), inst.catch = (params) => _catch(inst, params), inst.pipe = (target) => pipe(inst, target), inst.readonly = () => readonly(inst), inst.describe = (description) => {
  let cl = inst.clone();
  return globalRegistry.add(cl, { description }), cl;
}, Object.defineProperty(inst, "description", {
  get() {
    return globalRegistry.get(inst)?.description;
  },
  configurable: !0
}), inst.meta = (...args) => {
  if (args.length === 0)
    return globalRegistry.get(inst);
  let cl = inst.clone();
  return globalRegistry.add(cl, args[0]), cl;
}, inst.isOptional = () => inst.safeParse(void 0).success, inst.isNullable = () => inst.safeParse(null).success, inst.apply = (fn) => fn(inst), inst)), _ZodString = /* @__PURE__ */ $constructor("_ZodString", (inst, def) => {
  $ZodString.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
  let bag = inst._zod.bag;
  inst.format = bag.format ?? null, inst.minLength = bag.minimum ?? null, inst.maxLength = bag.maximum ?? null, inst.regex = (...args) => inst.check(_regex(...args)), inst.includes = (...args) => inst.check(_includes(...args)), inst.startsWith = (...args) => inst.check(_startsWith(...args)), inst.endsWith = (...args) => inst.check(_endsWith(...args)), inst.min = (...args) => inst.check(_minLength(...args)), inst.max = (...args) => inst.check(_maxLength(...args)), inst.length = (...args) => inst.check(_length(...args)), inst.nonempty = (...args) => inst.check(_minLength(1, ...args)), inst.lowercase = (params) => inst.check(_lowercase(params)), inst.uppercase = (params) => inst.check(_uppercase(params)), inst.trim = () => inst.check(_trim()), inst.normalize = (...args) => inst.check(_normalize(...args)), inst.toLowerCase = () => inst.check(_toLowerCase()), inst.toUpperCase = () => inst.check(_toUpperCase()), inst.slugify = () => inst.check(_slugify());
}), ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
  $ZodString.init(inst, def), _ZodString.init(inst, def), inst.email = (params) => inst.check(_email(ZodEmail, params)), inst.url = (params) => inst.check(_url(ZodURL, params)), inst.jwt = (params) => inst.check(_jwt(ZodJWT, params)), inst.emoji = (params) => inst.check(_emoji2(ZodEmoji, params)), inst.guid = (params) => inst.check(_guid(ZodGUID, params)), inst.uuid = (params) => inst.check(_uuid(ZodUUID, params)), inst.uuidv4 = (params) => inst.check(_uuidv4(ZodUUID, params)), inst.uuidv6 = (params) => inst.check(_uuidv6(ZodUUID, params)), inst.uuidv7 = (params) => inst.check(_uuidv7(ZodUUID, params)), inst.nanoid = (params) => inst.check(_nanoid(ZodNanoID, params)), inst.guid = (params) => inst.check(_guid(ZodGUID, params)), inst.cuid = (params) => inst.check(_cuid(ZodCUID, params)), inst.cuid2 = (params) => inst.check(_cuid2(ZodCUID2, params)), inst.ulid = (params) => inst.check(_ulid(ZodULID, params)), inst.base64 = (params) => inst.check(_base64(ZodBase64, params)), inst.base64url = (params) => inst.check(_base64url(ZodBase64URL, params)), inst.xid = (params) => inst.check(_xid(ZodXID, params)), inst.ksuid = (params) => inst.check(_ksuid(ZodKSUID, params)), inst.ipv4 = (params) => inst.check(_ipv4(ZodIPv4, params)), inst.ipv6 = (params) => inst.check(_ipv6(ZodIPv6, params)), inst.cidrv4 = (params) => inst.check(_cidrv4(ZodCIDRv4, params)), inst.cidrv6 = (params) => inst.check(_cidrv6(ZodCIDRv6, params)), inst.e164 = (params) => inst.check(_e164(ZodE164, params)), inst.datetime = (params) => inst.check(datetime2(params)), inst.date = (params) => inst.check(date2(params)), inst.time = (params) => inst.check(time2(params)), inst.duration = (params) => inst.check(duration2(params));
});
function string2(params) {
  return _string(ZodString, params);
}
var ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
  $ZodStringFormat.init(inst, def), _ZodString.init(inst, def);
}), ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
  $ZodEmail.init(inst, def), ZodStringFormat.init(inst, def);
});
var ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
  $ZodGUID.init(inst, def), ZodStringFormat.init(inst, def);
});
var ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
  $ZodUUID.init(inst, def), ZodStringFormat.init(inst, def);
});
var ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
  $ZodURL.init(inst, def), ZodStringFormat.init(inst, def);
});
var ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def) => {
  $ZodEmoji.init(inst, def), ZodStringFormat.init(inst, def);
});
var ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def) => {
  $ZodNanoID.init(inst, def), ZodStringFormat.init(inst, def);
});
var ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def) => {
  $ZodCUID.init(inst, def), ZodStringFormat.init(inst, def);
});
var ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def) => {
  $ZodCUID2.init(inst, def), ZodStringFormat.init(inst, def);
});
var ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def) => {
  $ZodULID.init(inst, def), ZodStringFormat.init(inst, def);
});
var ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def) => {
  $ZodXID.init(inst, def), ZodStringFormat.init(inst, def);
});
var ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def) => {
  $ZodKSUID.init(inst, def), ZodStringFormat.init(inst, def);
});
var ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def) => {
  $ZodIPv4.init(inst, def), ZodStringFormat.init(inst, def);
});
var ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def) => {
  $ZodIPv6.init(inst, def), ZodStringFormat.init(inst, def);
});
var ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def) => {
  $ZodCIDRv4.init(inst, def), ZodStringFormat.init(inst, def);
});
var ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def) => {
  $ZodCIDRv6.init(inst, def), ZodStringFormat.init(inst, def);
});
var ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def) => {
  $ZodBase64.init(inst, def), ZodStringFormat.init(inst, def);
});
var ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def) => {
  $ZodBase64URL.init(inst, def), ZodStringFormat.init(inst, def);
});
var ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def) => {
  $ZodE164.init(inst, def), ZodStringFormat.init(inst, def);
});
var ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def) => {
  $ZodJWT.init(inst, def), ZodStringFormat.init(inst, def);
});
var ZodNumber = /* @__PURE__ */ $constructor("ZodNumber", (inst, def) => {
  $ZodNumber.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params), inst.gt = (value, params) => inst.check(_gt(value, params)), inst.gte = (value, params) => inst.check(_gte(value, params)), inst.min = (value, params) => inst.check(_gte(value, params)), inst.lt = (value, params) => inst.check(_lt(value, params)), inst.lte = (value, params) => inst.check(_lte(value, params)), inst.max = (value, params) => inst.check(_lte(value, params)), inst.int = (params) => inst.check(int(params)), inst.safe = (params) => inst.check(int(params)), inst.positive = (params) => inst.check(_gt(0, params)), inst.nonnegative = (params) => inst.check(_gte(0, params)), inst.negative = (params) => inst.check(_lt(0, params)), inst.nonpositive = (params) => inst.check(_lte(0, params)), inst.multipleOf = (value, params) => inst.check(_multipleOf(value, params)), inst.step = (value, params) => inst.check(_multipleOf(value, params)), inst.finite = () => inst;
  let bag = inst._zod.bag;
  inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null, inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null, inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? 0.5), inst.isFinite = !0, inst.format = bag.format ?? null;
});
function number2(params) {
  return _number(ZodNumber, params);
}
var ZodNumberFormat = /* @__PURE__ */ $constructor("ZodNumberFormat", (inst, def) => {
  $ZodNumberFormat.init(inst, def), ZodNumber.init(inst, def);
});
function int(params) {
  return _int(ZodNumberFormat, params);
}
var ZodBoolean = /* @__PURE__ */ $constructor("ZodBoolean", (inst, def) => {
  $ZodBoolean.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
});
function boolean2(params) {
  return _boolean(ZodBoolean, params);
}
var ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
  $ZodUnknown.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => unknownProcessor(inst, ctx, json, params);
});
function unknown() {
  return _unknown(ZodUnknown);
}
var ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
  $ZodNever.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
});
function never(params) {
  return _never(ZodNever, params);
}
var ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
  $ZodArray.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params), inst.element = def.element, inst.min = (minLength, params) => inst.check(_minLength(minLength, params)), inst.nonempty = (params) => inst.check(_minLength(1, params)), inst.max = (maxLength, params) => inst.check(_maxLength(maxLength, params)), inst.length = (len, params) => inst.check(_length(len, params)), inst.unwrap = () => inst.element;
});
function array(element, params) {
  return _array(ZodArray, element, params);
}
var ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
  $ZodObjectJIT.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params), defineLazy(inst, "shape", () => def.shape), inst.keyof = () => _enum(Object.keys(inst._zod.def.shape)), inst.catchall = (catchall) => inst.clone({ ...inst._zod.def, catchall }), inst.passthrough = () => inst.clone({ ...inst._zod.def, catchall: unknown() }), inst.loose = () => inst.clone({ ...inst._zod.def, catchall: unknown() }), inst.strict = () => inst.clone({ ...inst._zod.def, catchall: never() }), inst.strip = () => inst.clone({ ...inst._zod.def, catchall: void 0 }), inst.extend = (incoming) => extend(inst, incoming), inst.safeExtend = (incoming) => safeExtend(inst, incoming), inst.merge = (other) => merge(inst, other), inst.pick = (mask) => pick(inst, mask), inst.omit = (mask) => omit(inst, mask), inst.partial = (...args) => partial(ZodOptional, inst, args[0]), inst.required = (...args) => required(ZodNonOptional, inst, args[0]);
});
function object(shape, params) {
  let def = {
    type: "object",
    shape: shape ?? {},
    ...normalizeParams(params)
  };
  return new ZodObject(def);
}
var ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
  $ZodUnion.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params), inst.options = def.options;
});
function union(options, params) {
  return new ZodUnion({
    type: "union",
    options,
    ...normalizeParams(params)
  });
}
var ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
  $ZodIntersection.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
});
function intersection(left, right) {
  return new ZodIntersection({
    type: "intersection",
    left,
    right
  });
}
var ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
  $ZodEnum.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params), inst.enum = def.entries, inst.options = Object.values(def.entries);
  let keys = new Set(Object.keys(def.entries));
  inst.extract = (values, params) => {
    let newEntries = {};
    for (let value of values)
      if (keys.has(value))
        newEntries[value] = def.entries[value];
      else
        throw Error(`Key ${value} not found in enum`);
    return new ZodEnum({
      ...def,
      checks: [],
      ...normalizeParams(params),
      entries: newEntries
    });
  }, inst.exclude = (values, params) => {
    let newEntries = { ...def.entries };
    for (let value of values)
      if (keys.has(value))
        delete newEntries[value];
      else
        throw Error(`Key ${value} not found in enum`);
    return new ZodEnum({
      ...def,
      checks: [],
      ...normalizeParams(params),
      entries: newEntries
    });
  };
});
function _enum(values, params) {
  let entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
  return new ZodEnum({
    type: "enum",
    entries,
    ...normalizeParams(params)
  });
}
var ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
  $ZodTransform.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params), inst._zod.parse = (payload, _ctx) => {
    if (_ctx.direction === "backward")
      throw new $ZodEncodeError(inst.constructor.name);
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string")
        payload.issues.push(issue(issue2, payload.value, def));
      else {
        let _issue = issue2;
        if (_issue.fatal)
          _issue.continue = !1;
        _issue.code ?? (_issue.code = "custom"), _issue.input ?? (_issue.input = payload.value), _issue.inst ?? (_issue.inst = inst), payload.issues.push(issue(_issue));
      }
    };
    let output = def.transform(payload.value, payload);
    if (output instanceof Promise)
      return output.then((output) => (payload.value = output, payload));
    return payload.value = output, payload;
  };
});
function transform(fn) {
  return new ZodTransform({
    type: "transform",
    transform: fn
  });
}
var ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
  $ZodOptional.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
  return new ZodOptional({
    type: "optional",
    innerType
  });
}
var ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def) => {
  $ZodExactOptional.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
  return new ZodExactOptional({
    type: "optional",
    innerType
  });
}
var ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
  $ZodNullable.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
  return new ZodNullable({
    type: "nullable",
    innerType
  });
}
var ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
  $ZodDefault.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType, inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
  return new ZodDefault({
    type: "default",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
    }
  });
}
var ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
  $ZodPrefault.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
  return new ZodPrefault({
    type: "prefault",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
    }
  });
}
var ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
  $ZodNonOptional.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
  return new ZodNonOptional({
    type: "nonoptional",
    innerType,
    ...normalizeParams(params)
  });
}
var ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
  $ZodCatch.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType, inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
  return new ZodCatch({
    type: "catch",
    innerType,
    catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
  });
}
var ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
  $ZodPipe.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params), inst.in = def.in, inst.out = def.out;
});
function pipe(in_, out) {
  return new ZodPipe({
    type: "pipe",
    in: in_,
    out
  });
}
var ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
  $ZodReadonly.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
  return new ZodReadonly({
    type: "readonly",
    innerType
  });
}
var ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
  $ZodCustom.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
});
function refine(fn, _params = {}) {
  return _refine(ZodCustom, fn, _params);
}
function superRefine(fn) {
  return _superRefine(fn);
}
// ../../node_modules/.bun/@forge+code-client@..+..+vendor+forge-client.tgz+dd935286ce580721/node_modules/@forge/code-client/dist/index.js
import { randomUUID } from "node:crypto";
import { chmod, mkdir, rename, rm, stat, writeFile } from "node:fs/promises";
import { posix, win32 } from "node:path";
import { readFile, unlink } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { execSync } from "child_process";
import os from "os";

// ../../node_modules/.bun/hono@4.12.14/node_modules/hono/dist/utils/cookie.js
var validCookieNameRegEx = /^[\w!#$%&'*.^`|~+-]+$/;
var _serialize = (name, value, opt = {}) => {
  if (!validCookieNameRegEx.test(name))
    throw Error("Invalid cookie name");
  let cookie = `${name}=${value}`;
  if (name.startsWith("__Secure-") && !opt.secure)
    throw Error("__Secure- Cookie must have Secure attributes");
  if (name.startsWith("__Host-")) {
    if (!opt.secure)
      throw Error("__Host- Cookie must have Secure attributes");
    if (opt.path !== "/")
      throw Error('__Host- Cookie must have Path attributes with "/"');
    if (opt.domain)
      throw Error("__Host- Cookie must not have Domain attributes");
  }
  for (let key of ["domain", "path"])
    if (opt[key] && /[;\r\n]/.test(opt[key]))
      throw Error(`${key} must not contain ";", "\\r", or "\\n"`);
  if (opt && typeof opt.maxAge === "number" && opt.maxAge >= 0) {
    if (opt.maxAge > 34560000)
      throw Error("Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration.");
    cookie += `; Max-Age=${opt.maxAge | 0}`;
  }
  if (opt.domain && opt.prefix !== "host")
    cookie += `; Domain=${opt.domain}`;
  if (opt.path)
    cookie += `; Path=${opt.path}`;
  if (opt.expires) {
    if (opt.expires.getTime() - Date.now() > 34560000000)
      throw Error("Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future.");
    cookie += `; Expires=${opt.expires.toUTCString()}`;
  }
  if (opt.httpOnly)
    cookie += "; HttpOnly";
  if (opt.secure)
    cookie += "; Secure";
  if (opt.sameSite)
    cookie += `; SameSite=${opt.sameSite.charAt(0).toUpperCase() + opt.sameSite.slice(1)}`;
  if (opt.priority)
    cookie += `; Priority=${opt.priority.charAt(0).toUpperCase() + opt.priority.slice(1)}`;
  if (opt.partitioned) {
    if (!opt.secure)
      throw Error("Partitioned Cookie must have Secure attributes");
    cookie += "; Partitioned";
  }
  return cookie;
}, serialize = (name, value, opt) => (value = encodeURIComponent(value), _serialize(name, value, opt));

// ../../node_modules/.bun/hono@4.12.14/node_modules/hono/dist/client/utils.js
var mergePath = (base, path) => (base = base.replace(/\/+$/, ""), base = base + "/", path = path.replace(/^\/+/, ""), base + path), replaceUrlParam = (urlString, params) => {
  for (let [k, v] of Object.entries(params)) {
    let reg = new RegExp("/:" + k + "(?:{[^/]+})?\\??");
    urlString = urlString.replace(reg, v ? `/${v}` : "");
  }
  return urlString;
}, buildSearchParams = (query) => {
  let searchParams = new URLSearchParams;
  for (let [k, v] of Object.entries(query)) {
    if (v === void 0)
      continue;
    if (Array.isArray(v))
      for (let v2 of v)
        searchParams.append(k, v2);
    else
      searchParams.set(k, v);
  }
  return searchParams;
}, replaceUrlProtocol = (urlString, protocol) => {
  switch (protocol) {
    case "ws":
      return urlString.replace(/^http/, "ws");
    case "http":
      return urlString.replace(/^ws/, "http");
  }
}, removeIndexString = (urlString) => {
  if (/^https?:\/\/[^\/]+?\/index(?=\?|$)/.test(urlString))
    return urlString.replace(/\/index(?=\?|$)/, "/");
  return urlString.replace(/\/index(?=\?|$)/, "");
};
function isObject2(item) {
  return typeof item === "object" && item !== null && !Array.isArray(item);
}
function deepMerge(target, source) {
  if (!isObject2(target) && !isObject2(source))
    return source;
  let merged = { ...target };
  for (let key in source) {
    let value = source[key];
    if (isObject2(merged[key]) && isObject2(value))
      merged[key] = deepMerge(merged[key], value);
    else
      merged[key] = value;
  }
  return merged;
}

// ../../node_modules/.bun/hono@4.12.14/node_modules/hono/dist/client/client.js
var createProxy = (callback, path) => new Proxy(() => {}, {
  get(_obj, key) {
    if (typeof key !== "string" || key === "then")
      return;
    return createProxy(callback, [...path, key]);
  },
  apply(_1, _2, args) {
    return callback({
      path,
      args
    });
  }
}), ClientRequestImpl = class {
  url;
  method;
  buildSearchParams;
  queryParams = void 0;
  pathParams = {};
  rBody;
  cType = void 0;
  constructor(url, method, options) {
    this.url = url, this.method = method, this.buildSearchParams = options.buildSearchParams;
  }
  fetch = async (args, opt) => {
    if (args) {
      if (args.query)
        this.queryParams = this.buildSearchParams(args.query);
      if (args.form) {
        let form = new FormData;
        for (let [k, v] of Object.entries(args.form)) {
          if (v === void 0)
            continue;
          if (Array.isArray(v))
            for (let v2 of v)
              form.append(k, v2);
          else
            form.append(k, v);
        }
        this.rBody = form;
      }
      if (args.json)
        this.rBody = JSON.stringify(args.json), this.cType = "application/json";
      if (args.param)
        this.pathParams = args.param;
    }
    let methodUpperCase = this.method.toUpperCase(), headerValues = {
      ...args?.header,
      ...typeof opt?.headers === "function" ? await opt.headers() : opt?.headers
    };
    if (args?.cookie) {
      let cookies = [];
      for (let [key, value] of Object.entries(args.cookie))
        cookies.push(serialize(key, value, { path: "/" }));
      headerValues.Cookie = cookies.join(",");
    }
    if (this.cType)
      headerValues["Content-Type"] = this.cType;
    let headers = new Headers(headerValues ?? void 0), url = this.url;
    if (url = removeIndexString(url), url = replaceUrlParam(url, this.pathParams), this.queryParams)
      url = url + "?" + this.queryParams.toString();
    methodUpperCase = this.method.toUpperCase();
    let setBody = !(methodUpperCase === "GET" || methodUpperCase === "HEAD");
    return (opt?.fetch || fetch)(url, {
      body: setBody ? this.rBody : void 0,
      method: methodUpperCase,
      headers,
      ...opt?.init
    });
  };
}, hc = (baseUrl, options) => createProxy(function proxyCallback(opts) {
  let buildSearchParamsOption = options?.buildSearchParams ?? buildSearchParams, parts = [...opts.path], lastParts = parts.slice(-3).reverse();
  if (lastParts[0] === "toString") {
    if (lastParts[1] === "name")
      return lastParts[2] || "";
    return proxyCallback.toString();
  }
  if (lastParts[0] === "valueOf") {
    if (lastParts[1] === "name")
      return lastParts[2] || "";
    return proxyCallback;
  }
  let method = "";
  if (/^\$/.test(lastParts[0])) {
    let last = parts.pop();
    if (last)
      method = last.replace(/^\$/, "");
  }
  let path = parts.join("/"), url = mergePath(baseUrl, path);
  if (method === "url" || method === "path") {
    let result = url;
    if (opts.args[0]) {
      if (opts.args[0].param)
        result = replaceUrlParam(url, opts.args[0].param);
      if (opts.args[0].query)
        result = result + "?" + buildSearchParamsOption(opts.args[0].query).toString();
    }
    if (result = removeIndexString(result), method === "url")
      return new URL(result);
    return result.slice(baseUrl.replace(/\/+$/, "").length).replace(/^\/?/, "/");
  }
  if (method === "ws") {
    let webSocketUrl = replaceUrlProtocol(opts.args[0] && opts.args[0].param ? replaceUrlParam(url, opts.args[0].param) : url, "ws"), targetUrl = new URL(webSocketUrl), queryParams = opts.args[0]?.query;
    if (queryParams)
      Object.entries(queryParams).forEach(([key, value]) => {
        if (Array.isArray(value))
          value.forEach((item) => targetUrl.searchParams.append(key, item));
        else
          targetUrl.searchParams.set(key, value);
      });
    return ((...args) => {
      if (options?.webSocket !== void 0 && typeof options.webSocket === "function")
        return options.webSocket(...args);
      return new WebSocket(...args);
    })(targetUrl.toString());
  }
  let req = new ClientRequestImpl(url, method, {
    buildSearchParams: buildSearchParamsOption
  });
  if (method) {
    options ??= {};
    let args = deepMerge(options, { ...opts.args[1] });
    return req.fetch(opts.args[0], args);
  }
  return req;
}, []);

// ../../node_modules/.bun/eventsource-parser@3.0.8/node_modules/eventsource-parser/dist/index.js
class ParseError extends Error {
  constructor(message, options) {
    super(message), this.name = "ParseError", this.type = options.type, this.field = options.field, this.value = options.value, this.line = options.line;
  }
}
var LF = 10, CR = 13, SPACE = 32;
function noop(_arg) {}
function createParser(callbacks) {
  if (typeof callbacks == "function")
    throw TypeError("`callbacks` must be an object, got a function instead. Did you mean `{onEvent: fn}`?");
  let { onEvent = noop, onError = noop, onRetry = noop, onComment } = callbacks, pendingFragments = [], isFirstChunk = !0, id, data = "", dataLines = 0, eventType;
  function feed(chunk) {
    if (isFirstChunk && (isFirstChunk = !1, chunk.charCodeAt(0) === 239 && chunk.charCodeAt(1) === 187 && chunk.charCodeAt(2) === 191 && (chunk = chunk.slice(3))), pendingFragments.length === 0) {
      let trailing2 = processLines(chunk);
      trailing2 !== "" && pendingFragments.push(trailing2);
      return;
    }
    if (chunk.indexOf(`
`) === -1 && chunk.indexOf("\r") === -1) {
      pendingFragments.push(chunk);
      return;
    }
    pendingFragments.push(chunk);
    let input = pendingFragments.join("");
    pendingFragments.length = 0;
    let trailing = processLines(input);
    trailing !== "" && pendingFragments.push(trailing);
  }
  function processLines(chunk) {
    let searchIndex = 0;
    if (chunk.indexOf("\r") === -1) {
      let lfIndex = chunk.indexOf(`
`, searchIndex);
      for (;lfIndex !== -1; ) {
        if (searchIndex === lfIndex) {
          dataLines > 0 && onEvent({ id, event: eventType, data }), id = void 0, data = "", dataLines = 0, eventType = void 0, searchIndex = lfIndex + 1, lfIndex = chunk.indexOf(`
`, searchIndex);
          continue;
        }
        let firstCharCode = chunk.charCodeAt(searchIndex);
        if (isDataPrefix(chunk, searchIndex, firstCharCode)) {
          let valueStart = chunk.charCodeAt(searchIndex + 5) === SPACE ? searchIndex + 6 : searchIndex + 5, value = chunk.slice(valueStart, lfIndex);
          if (dataLines === 0 && chunk.charCodeAt(lfIndex + 1) === LF) {
            onEvent({ id, event: eventType, data: value }), id = void 0, data = "", eventType = void 0, searchIndex = lfIndex + 2, lfIndex = chunk.indexOf(`
`, searchIndex);
            continue;
          }
          data = dataLines === 0 ? value : `${data}
${value}`, dataLines++;
        } else
          isEventPrefix(chunk, searchIndex, firstCharCode) ? eventType = chunk.slice(chunk.charCodeAt(searchIndex + 6) === SPACE ? searchIndex + 7 : searchIndex + 6, lfIndex) || void 0 : parseLine(chunk, searchIndex, lfIndex);
        searchIndex = lfIndex + 1, lfIndex = chunk.indexOf(`
`, searchIndex);
      }
      return chunk.slice(searchIndex);
    }
    for (;searchIndex < chunk.length; ) {
      let crIndex = chunk.indexOf("\r", searchIndex), lfIndex = chunk.indexOf(`
`, searchIndex), lineEnd = -1;
      if (crIndex !== -1 && lfIndex !== -1 ? lineEnd = crIndex < lfIndex ? crIndex : lfIndex : crIndex !== -1 ? crIndex === chunk.length - 1 ? lineEnd = -1 : lineEnd = crIndex : lfIndex !== -1 && (lineEnd = lfIndex), lineEnd === -1)
        break;
      parseLine(chunk, searchIndex, lineEnd), searchIndex = lineEnd + 1, chunk.charCodeAt(searchIndex - 1) === CR && chunk.charCodeAt(searchIndex) === LF && searchIndex++;
    }
    return chunk.slice(searchIndex);
  }
  function parseLine(chunk, start, end) {
    if (start === end) {
      dispatchEvent();
      return;
    }
    let firstCharCode = chunk.charCodeAt(start);
    if (isDataPrefix(chunk, start, firstCharCode)) {
      let valueStart = chunk.charCodeAt(start + 5) === SPACE ? start + 6 : start + 5, value2 = chunk.slice(valueStart, end);
      data = dataLines === 0 ? value2 : `${data}
${value2}`, dataLines++;
      return;
    }
    if (isEventPrefix(chunk, start, firstCharCode)) {
      eventType = chunk.slice(chunk.charCodeAt(start + 6) === SPACE ? start + 7 : start + 6, end) || void 0;
      return;
    }
    if (firstCharCode === 105 && chunk.charCodeAt(start + 1) === 100 && chunk.charCodeAt(start + 2) === 58) {
      let value2 = chunk.slice(chunk.charCodeAt(start + 3) === SPACE ? start + 4 : start + 3, end);
      id = value2.includes("\x00") ? void 0 : value2;
      return;
    }
    if (firstCharCode === 58) {
      if (onComment) {
        let line2 = chunk.slice(start, end);
        onComment(line2.slice(chunk.charCodeAt(start + 1) === SPACE ? 2 : 1));
      }
      return;
    }
    let line = chunk.slice(start, end), fieldSeparatorIndex = line.indexOf(":");
    if (fieldSeparatorIndex === -1) {
      processField(line, "", line);
      return;
    }
    let field = line.slice(0, fieldSeparatorIndex), offset = line.charCodeAt(fieldSeparatorIndex + 1) === SPACE ? 2 : 1, value = line.slice(fieldSeparatorIndex + offset);
    processField(field, value, line);
  }
  function processField(field, value, line) {
    switch (field) {
      case "event":
        eventType = value || void 0;
        break;
      case "data":
        data = dataLines === 0 ? value : `${data}
${value}`, dataLines++;
        break;
      case "id":
        id = value.includes("\x00") ? void 0 : value;
        break;
      case "retry":
        /^\d+$/.test(value) ? onRetry(parseInt(value, 10)) : onError(new ParseError(`Invalid \`retry\` value: "${value}"`, {
          type: "invalid-retry",
          value,
          line
        }));
        break;
      default:
        onError(new ParseError(`Unknown field "${field.length > 20 ? `${field.slice(0, 20)}…` : field}"`, { type: "unknown-field", field, value, line }));
        break;
    }
  }
  function dispatchEvent() {
    dataLines > 0 && onEvent({
      id,
      event: eventType,
      data
    }), id = void 0, data = "", dataLines = 0, eventType = void 0;
  }
  function reset(options = {}) {
    if (options.consume && pendingFragments.length > 0) {
      let incompleteLine = pendingFragments.join("");
      parseLine(incompleteLine, 0, incompleteLine.length);
    }
    isFirstChunk = !0, id = void 0, data = "", dataLines = 0, eventType = void 0, pendingFragments.length = 0;
  }
  return { feed, reset };
}
function isDataPrefix(chunk, i, firstCharCode) {
  return firstCharCode === 100 && chunk.charCodeAt(i + 1) === 97 && chunk.charCodeAt(i + 2) === 116 && chunk.charCodeAt(i + 3) === 97 && chunk.charCodeAt(i + 4) === 58;
}
function isEventPrefix(chunk, i, firstCharCode) {
  return firstCharCode === 101 && chunk.charCodeAt(i + 1) === 118 && chunk.charCodeAt(i + 2) === 101 && chunk.charCodeAt(i + 3) === 110 && chunk.charCodeAt(i + 4) === 116 && chunk.charCodeAt(i + 5) === 58;
}

// ../../node_modules/.bun/eventsource-parser@3.0.8/node_modules/eventsource-parser/dist/stream.js
class EventSourceParserStream extends TransformStream {
  constructor({ onError, onRetry, onComment } = {}) {
    let parser;
    super({
      start(controller) {
        parser = createParser({
          onEvent: (event) => {
            controller.enqueue(event);
          },
          onError(error) {
            onError === "terminate" ? controller.error(error) : typeof onError == "function" && onError(error);
          },
          onRetry,
          onComment
        });
      },
      transform(chunk) {
        parser.feed(chunk);
      }
    });
  }
}

// ../../node_modules/.bun/@forge+code-client@..+..+vendor+forge-client.tgz+dd935286ce580721/node_modules/@forge/code-client/dist/index.js
var AGENT_PERMISSION_KEYS = [
  "execute",
  "fetch",
  "read",
  "write",
  "delegate"
], agentPermissionSchemas = {
  execute: boolean2().optional(),
  fetch: boolean2().optional(),
  read: boolean2().optional(),
  write: boolean2().optional(),
  delegate: union([boolean2(), array(string2())]).optional()
}, agentPermissionsShape = Object.fromEntries(AGENT_PERMISSION_KEYS.map((key) => [key, agentPermissionSchemas[key]])), AgentPermissionsSchema = object(agentPermissionsShape).strict(), AgentTypeSchema = _enum(["main", "worker", "general"]), AGENT_ID_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/, MAX_AGENT_ID_LENGTH = 63, AgentNameSchema = string2({ error: "Agent id must be a string." }).refine((id) => id === id.trim(), {
  error: "Agent id must not contain leading or trailing whitespace.",
  abort: !0
}).min(1, { error: "Agent id must not be empty.", abort: !0 }).refine((id) => id !== "__proto__" && !Object.prototype.hasOwnProperty.call(Object.prototype, id), {
  error: "Agent id is reserved.",
  abort: !0
}).max(MAX_AGENT_ID_LENGTH, {
  error: `Agent id must be at most ${MAX_AGENT_ID_LENGTH} characters.`,
  abort: !0
}).regex(AGENT_ID_PATTERN, { error: "Agent id must be a lowercase slug.", abort: !0 }), AgentSchema = object({
  name: AgentNameSchema,
  type: AgentTypeSchema,
  description: string2().optional(),
  permissions: AgentPermissionsSchema.optional(),
  delegateAgents: array(string2()).optional(),
  prompt: string2(),
  model: string2().optional(),
  effort: string2().optional(),
  primary: boolean2().optional(),
  disable: boolean2().optional()
}), agentSchemaKeys = new Set(Object.keys(AgentSchema.shape));
async function writeFileAtomic(path, contents, options = {}) {
  let windowsPath = /^[a-zA-Z]:[\\/]/.test(path) || path.startsWith("\\\\") || path.startsWith("//");
  await mkdir((windowsPath ? win32 : posix).dirname(path), { recursive: !0 });
  let temporaryPath = `${path}.${randomUUID()}.tmp`;
  try {
    let mode = options.mode;
    if (options.preserveExistingMode)
      try {
        mode = (await stat(path)).mode;
      } catch (error) {
        if (error.code !== "ENOENT")
          throw error;
      }
    if (await writeFile(temporaryPath, contents, { mode }), mode !== void 0)
      await chmod(temporaryPath, mode);
    await rename(temporaryPath, path);
  } catch (error) {
    throw await rm(temporaryPath, { force: !0 }).catch(() => {
      return;
    }), error;
  }
}
function isWsl() {
  return process.platform === "linux" && (Boolean(process.env.WSL_DISTRO_NAME) || os.release().toLowerCase().includes("microsoft"));
}
function fromWindowsToWslPath(path) {
  if (!isWsl())
    throw Error("Not running inside WSL");
  let escapedPath = path.replace(/'/g, "'\\''");
  return execSync(`wslpath -u '${escapedPath}'`, { timeout: 2000 }).toString().trim();
}
function getWindowsEnvironmentVariable(name) {
  if (!isWsl())
    throw Error("Not running inside WSL");
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name))
    throw Error("Invalid Windows environment variable name");
  try {
    return execSync(`cmd.exe /c "echo %${name}%"`, {
      encoding: "utf-8",
      timeout: 2000,
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch (error) {
    throw Error(`Failed to get Windows environment variable ${name}: ${error}`);
  }
}
function getWindowsUserHome() {
  let userProfile = process.env.USERPROFILE;
  if (userProfile)
    return /^[a-zA-Z]:[/\\]/.test(userProfile) ? fromWindowsToWslPath(userProfile) : userProfile;
  return fromWindowsToWslPath(getWindowsEnvironmentVariable("USERPROFILE"));
}
var ForgeServerSnapshotSchema = object({
  version: number2().int().positive().default(1),
  host: string2().default("127.0.0.1"),
  port: number2().int().positive(),
  token: string2().min(1),
  pid: number2().int().positive(),
  appPath: string2().min(1),
  home: string2().min(1),
  started: string2(),
  tools: object({
    node: string2().optional(),
    rg: string2().optional(),
    opencode: string2().optional()
  }).default({})
});
async function readSnapshot(path) {
  let content;
  try {
    content = await readFile(path, "utf8");
  } catch (error) {
    if (error.code === "ENOENT")
      return null;
    throw error;
  }
  return ForgeServerSnapshotSchema.parse(JSON.parse(content));
}
async function useForgeServerSnapshot(directory = join(homedir(), ".forge")) {
  let file = join(directory, "server.json");
  return {
    get path() {
      return file;
    },
    async load() {
      let local = await readSnapshot(this.path);
      if (local)
        return local;
      if (isWsl())
        return readSnapshot(join(getWindowsUserHome(), ".forge", "server.json"));
      return null;
    },
    async capture(data) {
      let snapshot = ForgeServerSnapshotSchema.parse(data);
      await writeFileAtomic(this.path, `${JSON.stringify(snapshot, null, 2)}
`, { mode: 384 });
    },
    async remove() {
      try {
        await unlink(this.path);
      } catch {}
    }
  };
}
var ForgeError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "ForgeError";
  }
}, FORGE_NOT_RUNNING_MESSAGE = "Forge app isn't running — open Forge to continue.", ForgeNotRunning = class extends ForgeError {
  constructor(message, options) {
    super(message, options);
    this.name = "ForgeNotRunning";
  }
}, ForgeNotReady = class extends ForgeError {
  status;
  constructor(message, options) {
    super(message, options);
    this.name = "ForgeNotReady", this.status = options?.status;
  }
};
function hostname(host, port) {
  if (host.includes(":") && !host.startsWith("["))
    host = `[${host}]`;
  return port ? `${host}:${port}` : host;
}
function sameServer(a, b) {
  return a.host === b.host && a.port === b.port && a.token === b.token && a.pid === b.pid;
}
function isAbort(error) {
  return error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError");
}
function isGone(server) {
  if (isWsl())
    return !1;
  try {
    return process.kill(server.pid, 0), !1;
  } catch (error) {
    return error.code === "ESRCH";
  }
}
function request(initial, { timeout, resolve }) {
  let current = initial, reloading, attempt = async (server, input, init) => {
    let controller = new AbortController, signal = init?.signal ? AbortSignal.any([init.signal, controller.signal]) : controller.signal, timer = setTimeout(() => controller.abort(), Number.isFinite(timeout) ? Math.max(timeout, 0) : 5000), url = new URL(input instanceof Request ? input.url : String(input));
    url.host = hostname(server.host, server.port);
    let headers = new Headers(init?.headers);
    headers.set("authorization", `Bearer ${server.token}`);
    try {
      return await fetch(url, { ...init, headers, signal });
    } finally {
      clearTimeout(timer);
    }
  }, reload = () => {
    if (!resolve)
      return Promise.resolve(current);
    return reloading ??= resolve().finally(() => {
      reloading = void 0;
    }), reloading;
  }, retry = async (next, input, init) => {
    current = next;
    try {
      return await attempt(next, input, init);
    } catch (retryError) {
      if (init?.signal?.aborted || isAbort(retryError) || !isGone(next))
        throw retryError;
      throw new ForgeNotRunning(FORGE_NOT_RUNNING_MESSAGE, { cause: retryError });
    }
  };
  return async (input, init) => {
    let server = current, replayable = !(init?.body instanceof ReadableStream), response;
    try {
      if (response = await attempt(server, input, init), !resolve || !replayable || response.status !== 401)
        return response;
    } catch (error) {
      if (!resolve || !replayable || init?.signal?.aborted)
        throw error;
      let next2 = await reload();
      if (!next2)
        throw new ForgeNotRunning(FORGE_NOT_RUNNING_MESSAGE, { cause: error });
      if (sameServer(next2, server)) {
        if (isAbort(error) || !isGone(server))
          throw error;
        throw new ForgeNotRunning(FORGE_NOT_RUNNING_MESSAGE, { cause: error });
      }
      return retry(next2, input, init);
    }
    let next = await reload();
    if (!next || sameServer(next, server))
      return response;
    return await response.body?.cancel().catch(() => {}), retry(next, input, init);
  };
}
function createForgeApi(server, options = {}) {
  return hc(`http://${hostname(server.host, server.port)}`, {
    headers: { authorization: `Bearer ${server.token}` },
    fetch: request(server, options)
  });
}
async function jsonOrFail(response) {
  let resolved = await response;
  if (!resolved.ok) {
    let details;
    try {
      let text = await resolved.text();
      if (text.trim())
        details = text.trim();
    } catch {
      details = void 0;
    }
    throw new ForgeError(`Request to ${resolved.url} failed with status ${resolved.status}${details ? `: ${details}` : "."}`);
  }
  return await resolved.json();
}
async function* streamSse(response) {
  let resolved = await response;
  if (!resolved.ok)
    await jsonOrFail(resolved);
  if (!resolved.body)
    return;
  let reader = resolved.body.pipeThrough(new TextDecoderStream).pipeThrough(new EventSourceParserStream).getReader();
  try {
    while (!0) {
      let { done, value } = await reader.read();
      if (done)
        break;
      try {
        yield JSON.parse(value.data);
      } catch {}
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
}
function createForgeClient(api) {
  return {
    traces: {
      post: (spans) => jsonOrFail(api.telemetry.traces.$post({ json: spans }))
    },
    get status() {
      return jsonOrFail(api.status.$get());
    },
    get env() {
      return jsonOrFail(api.env.$get());
    },
    get mcp() {
      return {
        servers() {
          return jsonOrFail(api.mcp.$get());
        },
        tools() {
          return jsonOrFail(api.mcp.tools.$get());
        }
      };
    },
    providers() {
      return jsonOrFail(api.providers.$get());
    },
    agents() {
      return jsonOrFail(api.agents.$get());
    },
    agentTemplate() {
      return jsonOrFail(api.agents.template.$get());
    },
    get config() {
      return {
        get() {
          return jsonOrFail(api.config.$get());
        },
        set(config) {
          return jsonOrFail(api.config.$post({ json: config }));
        }
      };
    },
    models(options) {
      let tz = typeof options === "string" ? options : options?.tz;
      return jsonOrFail(api.models.$get({ query: tz === void 0 ? {} : { tz } }));
    },
    get projectBudget() {
      return {
        chargeContext(directory) {
          return jsonOrFail(api["project-budget"]["charge-context"].$get({ query: { directory } }));
        },
        state(projectId) {
          return jsonOrFail(api["project-budget"].state[":projectId"].$get({ param: { projectId } }));
        },
        sessionSwitch(input) {
          return jsonOrFail(api["project-budget"]["session-switch"].$post({ json: input }));
        }
      };
    },
    session: (id) => ({
      events: {
        async* list(signal) {
          yield* streamSse(api.sessions[":id"].events.$get({ param: { id } }, { init: { signal } }));
        },
        emit: (input) => jsonOrFail(api.sessions[":id"].events.$post({
          param: { id },
          json: input
        })).then((res) => res.event)
      }
    }),
    usage: ({ signal } = {}) => ({
      get value() {
        return jsonOrFail(api.usage.$get(void 0, { init: { signal } }));
      },
      async* [Symbol.asyncIterator]() {
        yield* streamSse(api.usage.stream.$get(void 0, {
          init: { signal }
        }));
      }
    }),
    plannotator: ({ signal } = {}) => ({
      status() {
        return jsonOrFail(api.plannotator.status.$get());
      },
      async* [Symbol.asyncIterator]() {
        yield* streamSse(api.plannotator.stream.$get(void 0, { init: { signal } }));
      }
    })
  };
}
async function waitForReady(api, { timeoutMs = 30000, onSlowWait } = {}) {
  let controller = new AbortController, timer = setTimeout(() => controller.abort(), timeoutMs), slowWaitTimer = onSlowWait ? setTimeout(onSlowWait, 2000) : void 0, delay = 250, reason = "not-healthy", status;
  try {
    while (!controller.signal.aborted) {
      try {
        let response = await api.status.$get(void 0, { init: { signal: controller.signal } });
        if (!response.ok)
          reason = "not-healthy", status = response.status;
        else {
          let current = await response.json();
          if (!current.signedIn)
            reason = "not-signed-in", status = void 0;
          else if (current.ready)
            return { ready: !0 };
          else
            reason = "not-ready", status = void 0;
        }
      } catch {
        if (controller.signal.aborted)
          break;
        reason = "not-healthy", status = void 0;
      }
      if (controller.signal.aborted)
        break;
      await new Promise((resolve) => setTimeout(resolve, delay)), delay = Math.min(delay * 2, 1000);
    }
  } finally {
    if (clearTimeout(timer), slowWaitTimer)
      clearTimeout(slowWaitTimer);
  }
  return status === void 0 ? { ready: !1, reason } : { ready: !1, reason, status };
}
async function useForgeClient(options = {}) {
  let snapshot = await useForgeServerSnapshot(), server = await snapshot.load();
  if (!server)
    throw new ForgeNotRunning("Forge server cannot be detected.");
  let api = createForgeApi(server, { resolve: () => snapshot.load() }), forge = createForgeClient(api), readiness = await waitForReady(api, { timeoutMs: 30000, onSlowWait: options.onSlowWait });
  if (!readiness.ready) {
    let message = readiness.reason === "not-healthy" ? "Forge server is not healthy" : readiness.reason === "not-signed-in" ? "Forge is not signed in" : "Forge did not become ready in time.";
    throw new ForgeNotReady(message, { status: readiness.status });
  }
  return forge;
}

// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/core/util.js
function getEnumValues2(entries) {
  let numericValues = Object.values(entries).filter((v) => typeof v === "number");
  return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
}
function joinValues(array, separator = "|") {
  return array.map((val) => stringifyPrimitive(val)).join(separator);
}
function jsonStringifyReplacer2(_, value) {
  if (typeof value === "bigint")
    return value.toString();
  return value;
}

class Cached {
  constructor(getter) {
    this._getter = getter, this._value = void 0;
  }
  get value() {
    let getter = this._getter;
    if (getter !== void 0)
      this._value = getter(), this._getter = void 0;
    return this._value;
  }
}
function cached2(getter) {
  return new Cached(getter);
}
function nullish2(input) {
  return input === null || input === void 0;
}
function cleanRegex2(source) {
  let start = source.startsWith("^") ? 1 : 0, end = source.endsWith("$") ? source.length - 1 : source.length;
  return source.slice(start, end);
}
function floatSafeRemainder2(val, step) {
  let ratio = val / step, roundedRatio = Math.round(ratio), tolerance = 4 * Number.EPSILON * Math.max(Math.abs(ratio), 1);
  if (Math.abs(ratio - roundedRatio) < tolerance)
    return 0;
  return ratio - roundedRatio;
}
var EVALUATING2 = /* @__PURE__ */ Symbol("evaluating");
function defineLazy2(object, key, getter) {
  let value = void 0;
  Object.defineProperty(object, key, {
    get() {
      if (value === EVALUATING2)
        return;
      if (value === void 0)
        value = EVALUATING2, value = getter();
      return value;
    },
    set(v) {
      Object.defineProperty(object, key, {
        value: v
      });
    },
    configurable: !0
  });
}
function assignProp2(target, prop, value) {
  Object.defineProperty(target, prop, {
    value,
    writable: !0,
    enumerable: !0,
    configurable: !0
  });
}
function rawShape(def) {
  let desc = Object.getOwnPropertyDescriptor(def, "shape");
  return desc?.get ? desc.get.raw : desc?.value;
}
function sourceShape(schema) {
  return rawShape(schema._zod.def) ?? schema._zod.def.shape;
}
function deferProp(target, key, getter) {
  Object.defineProperty(target, key, {
    get() {
      let value = getter();
      return assignProp2(this, key, value), value;
    },
    enumerable: !0,
    configurable: !0
  });
}
function putProp(target, key, value) {
  if (key in target)
    assignProp2(target, key, value);
  else
    target[key] = value;
}
function mirrorShape(target, source, keys, wrap) {
  let raw = sourceShape(source);
  for (let key of keys) {
    let desc = Object.getOwnPropertyDescriptor(raw, key);
    if (!desc.enumerable)
      continue;
    if (desc.get)
      deferProp(target, key, () => {
        let value = source._zod.def.shape[key];
        return wrap ? wrap(value, key) : value;
      });
    else
      putProp(target, key, wrap ? wrap(desc.value, key) : desc.value);
  }
}
function mirrorProps(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    let desc = Object.getOwnPropertyDescriptor(source, key);
    if (!desc.enumerable)
      continue;
    if (desc.get)
      deferProp(target, key, () => source[key]);
    else
      putProp(target, key, desc.value);
  }
}
function mergeDefs2(...defs) {
  let mergedDescriptors = {};
  for (let def of defs) {
    let descriptors = Object.getOwnPropertyDescriptors(def);
    Object.assign(mergedDescriptors, descriptors);
  }
  return Object.defineProperties({}, mergedDescriptors);
}
function esc2(str) {
  return JSON.stringify(str);
}
function slugify2(input) {
  return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var captureStackTrace2 = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
function isObject3(data) {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}
var allowsEval2 = /* @__PURE__ */ cached2(() => {
  if (globalConfig2.jitless)
    return !1;
  if (typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare"))
    return !1;
  try {
    return new Function(""), !0;
  } catch (_) {
    return !1;
  }
});
function isPlainObject2(o) {
  if (isObject3(o) === !1)
    return !1;
  let ctor = o.constructor;
  if (ctor === void 0)
    return !0;
  if (typeof ctor !== "function")
    return !0;
  let prot = ctor.prototype;
  if (isObject3(prot) === !1)
    return !1;
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === !1)
    return !1;
  return !0;
}
function shallowClone2(o) {
  if (isPlainObject2(o))
    return { ...o };
  if (Array.isArray(o))
    return [...o];
  if (o instanceof Map)
    return new Map(o);
  if (o instanceof Set)
    return new Set(o);
  return o;
}
var propertyKeyTypes2 = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
function escapeRegex2(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone2(inst, def, params) {
  let cl = new inst._zod.constr(def ?? inst._zod.def);
  if (!def || params?.parent)
    cl._zod.parent = inst;
  return cl;
}
function normalizeParams2(_params) {
  let params = _params;
  if (!params)
    return {};
  if (typeof params === "string")
    return { error: () => params };
  if (params?.message !== void 0) {
    if (params?.error !== void 0)
      throw Error("Cannot specify both `message` and `error` params");
    params.error = params.message;
  }
  if (delete params.message, typeof params.error === "string")
    return { ...params, error: () => params.error };
  return params;
}
function stringifyPrimitive(value) {
  if (typeof value === "bigint")
    return value.toString() + "n";
  if (typeof value === "string")
    return `"${value}"`;
  return `${value}`;
}
function optionalKeys2(shape) {
  return Object.keys(shape).filter((k) => shape[k]._zod.optin !== void 0 && shape[k]._zod.optout === "optional");
}
var NUMBER_FORMAT_RANGES2 = /* @__PURE__ */ (() => ({
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-340282346638528860000000000000000000000, 340282346638528860000000000000000000000],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
}))(), BIGINT_FORMAT_RANGES2 = {
  int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
  uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
};
function pick2(schema, mask) {
  let currDef = schema._zod.def, checks = currDef.checks;
  if (checks && checks.length > 0)
    throw Error(".pick() cannot be used on object schemas containing refinements");
  let newShape = {};
  return mirrorShape(newShape, schema, maskedKeys(schema, mask)), clone2(schema, mergeDefs2(currDef, { shape: newShape, checks: [] }));
}
function maskedKeys(schema, mask) {
  let raw = sourceShape(schema), keys = [];
  for (let key of Reflect.ownKeys(mask)) {
    if (!Object.getOwnPropertyDescriptor(raw, key)?.enumerable)
      throw Error(`Unrecognized key: "${String(key)}"`);
    if (mask[key])
      keys.push(key);
  }
  return keys;
}
function omit2(schema, mask) {
  let currDef = schema._zod.def, checks = currDef.checks;
  if (checks && checks.length > 0)
    throw Error(".omit() cannot be used on object schemas containing refinements");
  let omitted = new Set(maskedKeys(schema, mask)), newShape = {};
  return mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)).filter((key) => !omitted.has(key))), clone2(schema, mergeDefs2(currDef, { shape: newShape, checks: [] }));
}
function extend2(schema, shape) {
  if (!isPlainObject2(shape))
    throw Error("Invalid input to extend: expected a plain object");
  let checks = schema._zod.def.checks;
  if (checks && checks.length > 0) {
    let existingShape = sourceShape(schema);
    for (let key of Reflect.ownKeys(shape))
      if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0)
        throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
  }
  return clone2(schema, mergeDefs2(schema._zod.def, { shape: extended(schema, shape) }));
}
function extended(schema, shape) {
  let newShape = {};
  return mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema))), mirrorProps(newShape, shape), newShape;
}
function safeExtend2(schema, shape) {
  if (!isPlainObject2(shape))
    throw Error("Invalid input to safeExtend: expected a plain object");
  return clone2(schema, mergeDefs2(schema._zod.def, { shape: extended(schema, shape) }));
}
function merge2(a, b) {
  if (!b?._zod?.def)
    throw Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
  if (a._zod.def.checks?.length)
    throw Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
  let newShape = {};
  mirrorShape(newShape, a, Reflect.ownKeys(sourceShape(a))), mirrorShape(newShape, b, Reflect.ownKeys(sourceShape(b)));
  let def = mergeDefs2(a._zod.def, {
    shape: newShape,
    get catchall() {
      return b._zod.def.catchall;
    },
    checks: b._zod.def.checks ?? []
  });
  return clone2(a, def);
}
function partial2(Class, schema, mask, name = "partial") {
  let checks = schema._zod.def.checks;
  if (checks && checks.length > 0)
    throw Error(`.${name}() cannot be used on object schemas containing refinements`);
  let selected = mask ? new Set(maskedKeys(schema, mask)) : void 0, newShape = {};
  return mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), Class && ((value, key) => selected && !selected.has(key) ? value : new Class({ type: "optional", innerType: value }))), clone2(schema, mergeDefs2(schema._zod.def, { shape: newShape, checks: [] }));
}
function required2(Class, schema, mask) {
  let selected = mask ? new Set(maskedKeys(schema, mask)) : void 0, newShape = {};
  return mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), (value, key) => selected && !selected.has(key) ? value : new Class({ type: "nonoptional", innerType: value })), clone2(schema, mergeDefs2(schema._zod.def, { shape: newShape }));
}
function aborted2(x, startIndex = 0) {
  if (x.aborted === !0)
    return !0;
  for (let i = startIndex;i < x.issues.length; i++)
    if (x.issues[i]?.continue !== !0)
      return !0;
  return !1;
}
function explicitlyAborted(x, startIndex = 0) {
  if (x.aborted === !0)
    return !0;
  for (let i = startIndex;i < x.issues.length; i++)
    if (x.issues[i]?.continue === !1)
      return !0;
  return !1;
}
function prefixIssues2(path, issues) {
  return issues.map((iss) => {
    var _a;
    return (_a = iss).path ?? (_a.path = []), iss.path.unshift(path), iss;
  });
}
function unwrapMessage2(message) {
  return typeof message === "string" ? message : message?.message;
}
function sizeCaps(defChecks) {
  let caps = [];
  for (let ch of defChecks ?? []) {
    let d = ch._zod.def;
    if (!/_(length|size)$|_equals$/.test(d.check))
      break;
    let max = d.maximum ?? d.length ?? d.size;
    if (max >= 0)
      caps.push([max, ch]);
  }
  return caps;
}
function attachSchema(issues, start, inst) {
  var _a;
  for (let i = start;i < issues.length; i++)
    (_a = issues[i]).schema ?? (_a.schema = inst);
}
function finalizeIssue2(iss, ctx, config) {
  var _a;
  let traits = iss.inst?._zod?.traits;
  if (traits?.has("$ZodType"))
    if (traits.has("$ZodCheck"))
      (_a = iss).schema ?? (_a.schema = iss.inst);
    else
      iss.schema = iss.inst;
  let schemaError = iss.schema !== iss.inst ? iss.schema?._zod.def?.error : void 0, message = iss.message ? iss.message : unwrapMessage2(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage2(schemaError?.(iss)) ?? unwrapMessage2(ctx?.error?.(iss)) ?? unwrapMessage2(config.customError?.(iss)) ?? unwrapMessage2(config.localeError?.(iss)) ?? "Invalid input", full = {};
  for (let k of Object.keys(iss)) {
    if (k === "inst" || k === "schema" || k === "continue" || k === "input" || k === "__proto__")
      continue;
    full[k] = iss[k];
  }
  if (full.path ?? (full.path = []), full.message = message, ctx?.reportInput)
    full.input = iss.input;
  return full;
}
var highSurrogate = /[\uD800-\uDBFF]/;
function codePointLength(str) {
  let units = str.length;
  if (!highSurrogate.test(str))
    return units;
  let count = units;
  for (let i = 0;i < units - 1; i++)
    if ((str.charCodeAt(i) & 64512) === 55296 && (str.charCodeAt(i + 1) & 64512) === 56320)
      count--, i++;
  return count;
}
function getLengthableOrigin2(input) {
  if (Array.isArray(input))
    return "array";
  if (typeof input === "string")
    return "string";
  return "unknown";
}
function parsedType(data) {
  let t = typeof data;
  switch (t) {
    case "number":
      return Number.isNaN(data) ? "nan" : "number";
    case "object": {
      if (data === null)
        return "null";
      if (Array.isArray(data))
        return "array";
      let obj = data;
      if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor)
        return obj.constructor.name;
    }
  }
  return t;
}
function issue2(...args) {
  let [iss, input, inst] = args;
  if (typeof iss === "string")
    return {
      message: iss,
      code: "custom",
      input,
      inst
    };
  return { ...iss };
}
function members(proto, table) {
  for (let key in table) {
    let desc = Object.getOwnPropertyDescriptor(table, key);
    if (desc.get)
      Object.defineProperty(proto, key, { ...desc, enumerable: !1 });
    else
      defineBound(proto, key, desc.value);
  }
}
function own(inst, key, value, enumerable = !0) {
  return Object.defineProperty(inst, key, { configurable: !0, writable: !0, enumerable, value }), value;
}
function hide(inst, key, value) {
  return own(inst, key, value, !1);
}
function derived(computes, table) {
  for (let key in computes) {
    let compute = computes[key];
    Object.defineProperty(table, key, {
      configurable: !0,
      enumerable: !0,
      get() {
        return own(this, key, compute(this));
      },
      set(value) {
        own(this, key, value);
      }
    });
  }
  return table;
}
function defineBound(proto, key, fn) {
  Object.defineProperty(proto, key, {
    configurable: !0,
    get() {
      return this == null ? fn : own(this, key, fn.bind(this));
    },
    set(value) {
      own(this, key, value);
    }
  });
}
function claim(inst, sentinel) {
  let proto = Object.getPrototypeOf(inst);
  return sentinel in proto ? void 0 : proto;
}
var installing, broke = !1, breaker = {
  configurable: !0,
  get() {
    broke = !0;
    return;
  }
};
function defineLazyInternal(inst, key, compute) {
  let proto = Object.getPrototypeOf(inst._zod);
  if (key in proto && installing !== inst._zod) {
    installing = void 0;
    return;
  }
  installing = inst._zod, Object.defineProperty(proto, key, {
    configurable: !0,
    get() {
      Object.defineProperty(this, key, breaker);
      let outer = broke;
      broke = !1;
      try {
        let value = compute(this);
        if (broke)
          delete this[key];
        else
          Object.defineProperty(this, key, { configurable: !0, writable: !0, value });
        return broke = broke || outer, value;
      } catch (err) {
        throw delete this[key], broke = broke || outer, err;
      }
    },
    set(value) {
      Object.defineProperty(this, key, { configurable: !0, writable: !0, value });
    }
  });
}
function installLazyProp(inst, key, make, enumerable) {
  let proto = claim(inst, key);
  if (!proto)
    return;
  Object.defineProperty(proto, key, {
    configurable: !0,
    get() {
      let desc = { configurable: !0, writable: !0, enumerable, value: void 0 };
      return Object.defineProperty(this, key, desc), desc.value = make(this), Object.defineProperty(this, key, desc), desc.value;
    },
    set(value) {
      Object.defineProperty(this, key, { configurable: !0, writable: !0, enumerable, value });
    }
  });
}
var CONSTANT_CATCH = "~constantCatch";
function constantCatch(value) {
  let fn = () => value;
  return fn[CONSTANT_CATCH] = !0, fn;
}

// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/core/core.js
var _a2;
var _zodDesc = { value: void 0, enumerable: !1 }, _E = "captureStackTrace" in Error ? Error : null;
function newError(Definition) {
  let E = _E;
  if (E) {
    let saved = E.stackTraceLimit;
    if (typeof saved === "number") {
      try {
        E.stackTraceLimit = 0;
      } catch {
        return _E = null, new Definition;
      }
      try {
        return new Definition;
      } finally {
        E.stackTraceLimit = saved;
      }
    }
  }
  return new Definition;
}
function $constructor2(name, initializer, proto, params) {
  let zodProto = {};
  function Internals(def) {
    this.def = def, this.constr = _, this.traits = /* @__PURE__ */ new Set;
  }
  Internals.prototype = zodProto;
  let protoMembers = proto, initialized = protoMembers && /* @__PURE__ */ new WeakSet;
  function init(inst, def) {
    if (!inst._zod) {
      _zodDesc.value = new Internals(def);
      try {
        Object.defineProperty(inst, "_zod", _zodDesc);
      } finally {
        _zodDesc.value = void 0;
      }
    } else if (inst._zod.traits.has(name))
      return;
    if (inst._zod.traits.add(name), initializer(inst, def), initialized) {
      let own = Object.getPrototypeOf(inst), ctorProto = inst._zod.constr.prototype, up = own;
      while (up && up !== ctorProto)
        up = Object.getPrototypeOf(up);
      let target = up ?? own;
      if (!initialized.has(target))
        initialized.add(target), members(target, protoMembers);
    }
    let proto = _.prototype;
    for (let k in proto) {
      if (!Object.prototype.hasOwnProperty.call(proto, k))
        continue;
      if (!(k in inst))
        inst[k] = proto[k].bind(inst);
    }
  }
  let Parent = params?.Parent ?? Object;

  class Definition extends Parent {
  }
  Object.defineProperty(Definition, "name", { value: name });
  function _(def) {
    let inst = params?.Parent ? newError(Definition) : this;
    init(inst, def);
    let deferred = inst._zod.deferred;
    if (deferred) {
      for (let fn of deferred)
        fn();
      inst._zod.deferred = void 0;
    }
    let pp = globalThis.__zod_globalConfig?.postProcessor;
    if (pp)
      pp(inst);
    return inst;
  }
  return Object.defineProperty(_, "init", { value: init }), Object.defineProperty(_, Symbol.hasInstance, {
    value: (inst) => {
      if (params?.Parent && inst instanceof params.Parent)
        return !0;
      return inst?._zod?.traits?.has(name);
    }
  }), Object.defineProperty(_, "name", { value: name }), _;
}
class $ZodAsyncError2 extends Error {
  constructor() {
    super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
  }
}

class $ZodEncodeError2 extends Error {
  constructor(name) {
    super(`Encountered unidirectional transform during encode: ${name}`);
    this.name = "ZodEncodeError";
  }
}
(_a2 = globalThis).__zod_globalConfig ?? (_a2.__zod_globalConfig = {});
var globalConfig2 = globalThis.__zod_globalConfig;
function config2(newConfig) {
  if (newConfig)
    Object.assign(globalConfig2, newConfig);
  return globalConfig2;
}
// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/core/errors.js
function _getMessage() {
  let internals = this._zod;
  return internals.message ?? (internals.message = JSON.stringify(internals.def, jsonStringifyReplacer2, 2)), internals.message;
}
function _setMessage(value) {
  this._zod.message = value;
}
var _messageDesc = {
  get: _getMessage,
  set: _setMessage,
  enumerable: !0,
  configurable: !0
}, _issuesDesc = { value: void 0, enumerable: !1 }, _installedToString = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]), initializer3 = (inst, def) => {
  inst.name = "$ZodError", _issuesDesc.value = def, Object.defineProperty(inst, "issues", _issuesDesc), _issuesDesc.value = void 0, Object.defineProperty(inst, "message", _messageDesc);
  let proto = Object.getPrototypeOf(inst);
  if (!_installedToString.has(proto))
    _installedToString.add(proto), Object.defineProperty(proto, "toString", {
      configurable: !0,
      enumerable: !1,
      get() {
        let value = () => this.message;
        return Object.defineProperty(this, "toString", { value, configurable: !0, writable: !0 }), value;
      },
      set(value) {
        Object.defineProperty(this, "toString", { value, configurable: !0, writable: !0 });
      }
    });
}, $ZodError2 = $constructor2("$ZodError", initializer3), $ZodRealError2 = $constructor2("$ZodError", initializer3, void 0, {
  Parent: Error
});
function node(obj, key, make) {
  if (!Object.prototype.hasOwnProperty.call(obj, key))
    if (key === "__proto__")
      Object.defineProperty(obj, key, { value: make(), writable: !0, enumerable: !0, configurable: !0 });
    else
      obj[key] = make();
  return obj[key];
}
function flattenError2(error, mapper = (issue) => issue.message) {
  let fieldErrors = {}, formErrors = [];
  for (let sub of error.issues)
    if (sub.path.length > 0)
      node(fieldErrors, sub.path[0], () => []).push(mapper(sub));
    else
      formErrors.push(mapper(sub));
  return { formErrors, fieldErrors };
}
function formatError2(error, mapper = (issue) => issue.message) {
  let fieldErrors = { _errors: [] }, processError = (error, path = []) => {
    for (let issue of error.issues)
      if (issue.code === "invalid_union" && issue.errors.length)
        issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
      else if (issue.code === "invalid_key")
        processError({ issues: issue.issues }, [...path, ...issue.path]);
      else if (issue.code === "invalid_element")
        processError({ issues: issue.issues }, [...path, ...issue.path]);
      else {
        let fullpath = [...path, ...issue.path];
        if (fullpath.length === 0)
          fieldErrors._errors.push(mapper(issue));
        else {
          let curr = fieldErrors, i = 0;
          while (i < fullpath.length) {
            let el = fullpath[i], terminal = i === fullpath.length - 1;
            if (el === "_errors") {
              if (terminal)
                curr._errors.push(mapper(issue));
              i++;
              continue;
            }
            if (!Object.prototype.hasOwnProperty.call(curr, el))
              Object.defineProperty(curr, el, {
                value: { _errors: [] },
                enumerable: !0,
                writable: !0,
                configurable: !0
              });
            let node = curr[el];
            if (terminal)
              node._errors.push(mapper(issue));
            curr = node, i++;
          }
        }
      }
  };
  return processError(error), fieldErrors;
}

// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/core/parse.js
function finalizeParams(callee, params) {
  return { callee: params?.callee ?? callee, Err: params?.Err };
}
var _parse2 = (_Err) => {
  let fn = (schema, value, _ctx, _params) => {
    let ctx = _ctx ? { ..._ctx, async: !1 } : { async: !1 }, result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
      throw new $ZodAsyncError2;
    if (result.issues.length) {
      let e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue2(iss, ctx, config2())));
      throw captureStackTrace2(e, _params?.callee ?? fn), e;
    }
    return result.value;
  };
  return fn;
};
var _parseAsync2 = (_Err) => {
  let fn = async (schema, value, _ctx, params) => {
    let ctx = _ctx ? { ..._ctx, async: !0 } : { async: !0 }, result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
      result = await result;
    if (result.issues.length) {
      let e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue2(iss, ctx, config2())));
      throw captureStackTrace2(e, params?.callee ?? fn), e;
    }
    return result.value;
  };
  return fn;
};
var _safeParse2 = (_Err) => (schema, value, _ctx) => {
  let ctx = _ctx ? { ..._ctx, async: !1 } : { async: !1 }, result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    throw new $ZodAsyncError2;
  return result.issues.length ? failure(_Err, result.issues, ctx) : { success: !0, data: result.value };
};
function failure(Err, issues, ctx) {
  let error;
  return {
    success: !1,
    get error() {
      if (!error)
        error = new Err(issues.map((iss) => finalizeIssue2(iss, ctx, config2()))), issues = void 0, ctx = void 0;
      return error;
    },
    set error(e) {
      error = e, issues = void 0, ctx = void 0;
    }
  };
}
var _safeParseAsync2 = (_Err) => async (schema, value, _ctx) => {
  let ctx = _ctx ? { ..._ctx, async: !0 } : { async: !0 }, result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length ? failure(_Err, result.issues, ctx) : { success: !0, data: result.value };
};
var COMPILE_INVALID = /* @__PURE__ */ Symbol.for("zod.compile.invalid"), COMPILE_FALLBACK = /* @__PURE__ */ Symbol.for("zod.compile.fallback"), validate = (schema, value, _ctx) => {
  let validator = schema._zod.bag.validator;
  if (validator !== void 0) {
    if (validator(value) !== COMPILE_INVALID)
      return !0;
    if (validator.definite === !0 && _ctx === void 0)
      return !1;
  }
  return validateFallback(schema, value, _ctx);
};
function validateFallback(schema, value, _ctx) {
  let ctx = _ctx ? { ..._ctx, async: !1, abortEarly: !0 } : { async: !1, abortEarly: !0 }, fallbackRun = schema._zod.bag.fallbackRun, result;
  if (fallbackRun)
    ctx[COMPILE_FALLBACK] = !0, result = fallbackRun({ value, issues: [] }, ctx);
  else
    result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    throw new $ZodAsyncError2;
  return result.issues.length === 0;
}
var validateAsync = async (schema, value, _ctx) => {
  let ctx = _ctx ? { ..._ctx, async: !0, abortEarly: !0 } : { async: !0, abortEarly: !0 }, result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length === 0;
}, _encode2 = (_Err) => {
  let parse = _parse2(_Err), fn = (schema, value, _ctx, _params) => {
    let ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
    return parse(schema, value, ctx, finalizeParams(fn, _params));
  };
  return fn;
};
var _decode2 = (_Err) => {
  let parse = _parse2(_Err), fn = (schema, value, _ctx, _params) => parse(schema, value, _ctx, finalizeParams(fn, _params));
  return fn;
};
var _encodeAsync2 = (_Err) => {
  let parseAsync = _parseAsync2(_Err), fn = async (schema, value, _ctx, _params) => {
    let ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
    return await parseAsync(schema, value, ctx, finalizeParams(fn, _params));
  };
  return fn;
};
var _decodeAsync2 = (_Err) => {
  let parseAsync = _parseAsync2(_Err), fn = async (schema, value, _ctx, _params) => await parseAsync(schema, value, _ctx, finalizeParams(fn, _params));
  return fn;
};
var _safeEncode2 = (_Err) => (schema, value, _ctx) => {
  let ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParse2(_Err)(schema, value, ctx);
};
var _safeDecode2 = (_Err) => (schema, value, _ctx) => _safeParse2(_Err)(schema, value, _ctx);
var _safeEncodeAsync2 = (_Err) => async (schema, value, _ctx) => {
  let ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParseAsync2(_Err)(schema, value, ctx);
};
var _safeDecodeAsync2 = (_Err) => async (schema, value, _ctx) => _safeParseAsync2(_Err)(schema, value, _ctx);
// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/core/regexes.js
var cuid3 = /^[cC][0-9a-z]{6,}$/, cuid22 = /^[0-9a-z]+$/, ulid2 = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/, xid2 = /^[0-9a-vA-V]{20}$/, ksuid2 = /^[A-Za-z0-9]{27}$/, nanoid2 = /^[a-zA-Z0-9_-]{21}$/;
function nanoidOfLength(length) {
  return new RegExp(`^[a-zA-Z0-9_-]{${length}}$`);
}
var duration3 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
var guid2 = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, uuid2 = (version) => {
  if (!version)
    return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
  return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
var email2 = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
var _emoji3 = "^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$";
function emoji2() {
  return new RegExp(_emoji3, "u");
}
var ipv42 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, ipv62 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
var cidrv42 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, cidrv62 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, base642 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, base64url2 = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/;
var httpProtocol = /^https?$/, e1642 = /^\+[1-9]\d{6,14}$/;
var dateSource2 = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))";
function anchor(source) {
  return new RegExp(`^${source}$`);
}
var date3 = /* @__PURE__ */ anchor(dateSource2);
function timeSource2(args) {
  return typeof args.precision === "number" ? args.precision === -1 ? "(?:[01]\\d|2[0-3]):[0-5]\\d" : args.precision === 0 ? "(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d" : `(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{${args.precision}}` : args.seconds ? "(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d+)?" : "(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?";
}
function time3(args) {
  return new RegExp(`^${timeSource2(args)}$`);
}
function datetime3(args) {
  let opts = ["Z"];
  if (args.offset)
    opts.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
  let qualified = `${timeSource2({ precision: args.precision, seconds: !0 })}(?:${opts.join("|")})`, timeRegex = args.local ? `${qualified}|${timeSource2({ precision: args.precision })}` : qualified;
  return new RegExp(`^${dateSource2}T(?:${timeRegex})$`);
}
var anyString = /^[\s\S]{0,}$/;
var integer2 = /^-?\d+$/, number3 = /^-?\d+(?:\.\d+)?$/, boolean3 = /^(?:true|false)$/i, _null3 = /^null$/i;
var _undefined3 = /^undefined$/i;
var lowercase2 = /^[^A-Z]*$/, uppercase2 = /^[^a-z]*$/;

// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/core/checks.js
var $ZodCheck2 = /* @__PURE__ */ $constructor2("$ZodCheck", (inst, def) => {
  var _a;
  inst._zod ?? (inst._zod = {}), inst._zod.def = def, (_a = inst._zod).onattach ?? (_a.onattach = []);
});
var _whenHasLength = (payload) => {
  let val = payload.value;
  return !nullish2(val) && val.length !== void 0;
}, numericOriginMap2 = {
  number: "number",
  bigint: "bigint",
  object: "date"
}, $ZodCheckLessThan2 = /* @__PURE__ */ $constructor2("$ZodCheckLessThan", (inst, def) => {
  $ZodCheck2.init(inst, def);
  let origin = numericOriginMap2[typeof def.value];
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value <= def.value : payload.value < def.value)
      return;
    payload.issues.push({
      origin: numericOriginMap2[typeof payload.value] ?? origin,
      code: "too_big",
      maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckGreaterThan2 = /* @__PURE__ */ $constructor2("$ZodCheckGreaterThan", (inst, def) => {
  $ZodCheck2.init(inst, def);
  let origin = numericOriginMap2[typeof def.value];
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value >= def.value : payload.value > def.value)
      return;
    payload.issues.push({
      origin: numericOriginMap2[typeof payload.value] ?? origin,
      code: "too_small",
      minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckMultipleOf2 = /* @__PURE__ */ $constructor2("$ZodCheckMultipleOf", (inst, def) => {
  $ZodCheck2.init(inst, def), inst._zod.check = (payload) => {
    if (typeof payload.value !== typeof def.value)
      throw Error("Cannot mix number and bigint in multiple_of check.");
    if (typeof payload.value === "bigint" ? def.value !== BigInt(0) && payload.value % def.value === BigInt(0) : floatSafeRemainder2(payload.value, def.value) === 0)
      return;
    payload.issues.push({
      origin: typeof payload.value,
      code: "not_multiple_of",
      divisor: def.value,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckNumberFormat2 = /* @__PURE__ */ $constructor2("$ZodCheckNumberFormat", (inst, def) => {
  $ZodCheck2.init(inst, def), def.format = def.format || "float64";
  let isInt = def.format?.includes("int"), origin = isInt ? "int" : "number", [minimum, maximum] = NUMBER_FORMAT_RANGES2[def.format];
  inst._zod.check = (payload) => {
    let input = payload.value;
    if (isInt) {
      if (!Number.isInteger(input)) {
        payload.issues.push({
          expected: origin,
          format: def.format,
          code: "invalid_type",
          continue: !1,
          input,
          inst
        });
        return;
      }
      if (!Number.isSafeInteger(input)) {
        if (input > 0)
          payload.issues.push({
            input,
            code: "too_big",
            maximum: Number.MAX_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: !0,
            continue: !def.abort
          });
        else
          payload.issues.push({
            input,
            code: "too_small",
            minimum: Number.MIN_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: !0,
            continue: !def.abort
          });
        return;
      }
    }
    if (input < minimum)
      payload.issues.push({
        origin: "number",
        input,
        code: "too_small",
        minimum,
        inclusive: !0,
        inst,
        continue: !def.abort
      });
    if (input > maximum)
      payload.issues.push({
        origin: "number",
        input,
        code: "too_big",
        maximum,
        inclusive: !0,
        inst,
        continue: !def.abort
      });
  };
});
var $ZodCheckMaxLength2 = /* @__PURE__ */ $constructor2("$ZodCheckMaxLength", (inst, def) => {
  var _a;
  $ZodCheck2.init(inst, def), (_a = inst._zod.def).when ?? (_a.when = _whenHasLength), inst._zod.check = (payload) => {
    let input = payload.value, units = input.length;
    if ((typeof input === "string" && units > def.maximum ? codePointLength(input) : units) <= def.maximum)
      return;
    let origin = getLengthableOrigin2(input);
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: def.maximum,
      inclusive: !0,
      input,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckMinLength2 = /* @__PURE__ */ $constructor2("$ZodCheckMinLength", (inst, def) => {
  var _a;
  $ZodCheck2.init(inst, def), (_a = inst._zod.def).when ?? (_a.when = _whenHasLength), inst._zod.check = (payload) => {
    let input = payload.value, units = input.length;
    if ((typeof input === "string" && units >= def.minimum && units < def.minimum * 2 ? codePointLength(input) : units) >= def.minimum)
      return;
    let origin = getLengthableOrigin2(input);
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: def.minimum,
      inclusive: !0,
      input,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckLengthEquals2 = /* @__PURE__ */ $constructor2("$ZodCheckLengthEquals", (inst, def) => {
  var _a;
  $ZodCheck2.init(inst, def), (_a = inst._zod.def).when ?? (_a.when = _whenHasLength), inst._zod.check = (payload) => {
    let input = payload.value, units = input.length, length = typeof input === "string" && units >= def.length && units <= def.length * 2 ? codePointLength(input) : units;
    if (length === def.length)
      return;
    let origin = getLengthableOrigin2(input), tooBig = length > def.length;
    payload.issues.push({
      origin,
      ...tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length },
      inclusive: !0,
      exact: !0,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckStringFormat2 = /* @__PURE__ */ $constructor2("$ZodCheckStringFormat", (inst, def) => {
  var _a, _b;
  if ($ZodCheck2.init(inst, def), def.pattern)
    (_a = inst._zod).check ?? (_a.check = (payload) => {
      if (def.pattern.lastIndex = 0, def.pattern.test(payload.value))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: def.format,
        input: payload.value,
        ...def.pattern ? { pattern: def.pattern.toString() } : {},
        inst,
        continue: !def.abort
      });
    });
  else
    (_b = inst._zod).check ?? (_b.check = () => {});
}), $ZodCheckRegex2 = /* @__PURE__ */ $constructor2("$ZodCheckRegex", (inst, def) => {
  $ZodCheckStringFormat2.init(inst, def), inst._zod.check = (payload) => {
    if (def.pattern.lastIndex = 0, def.pattern.test(payload.value))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: payload.value,
      pattern: def.pattern.toString(),
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckLowerCase2 = /* @__PURE__ */ $constructor2("$ZodCheckLowerCase", (inst, def) => {
  def.pattern ?? (def.pattern = lowercase2), $ZodCheckStringFormat2.init(inst, def);
}), $ZodCheckUpperCase2 = /* @__PURE__ */ $constructor2("$ZodCheckUpperCase", (inst, def) => {
  def.pattern ?? (def.pattern = uppercase2), $ZodCheckStringFormat2.init(inst, def);
}), $ZodCheckIncludes2 = /* @__PURE__ */ $constructor2("$ZodCheckIncludes", (inst, def) => {
  $ZodCheck2.init(inst, def);
  let escapedRegex = escapeRegex2(def.includes), pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position},}${escapedRegex}` : escapedRegex);
  def.pattern = pattern, inst._zod.check = (payload) => {
    if (payload.value.includes(def.includes, def.position))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: def.includes,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckStartsWith2 = /* @__PURE__ */ $constructor2("$ZodCheckStartsWith", (inst, def) => {
  $ZodCheck2.init(inst, def);
  let pattern = new RegExp(`^${escapeRegex2(def.prefix)}.*`);
  def.pattern ?? (def.pattern = pattern), inst._zod.check = (payload) => {
    if (payload.value.startsWith(def.prefix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: def.prefix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckEndsWith2 = /* @__PURE__ */ $constructor2("$ZodCheckEndsWith", (inst, def) => {
  $ZodCheck2.init(inst, def);
  let pattern = new RegExp(`.*${escapeRegex2(def.suffix)}$`);
  def.pattern ?? (def.pattern = pattern), inst._zod.check = (payload) => {
    if (payload.value.endsWith(def.suffix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: def.suffix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckOverwrite2 = /* @__PURE__ */ $constructor2("$ZodCheckOverwrite", (inst, def) => {
  $ZodCheck2.init(inst, def), inst._zod.check = (payload) => {
    payload.value = def.tx(payload.value);
  };
});

// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/core/doc.js
class Doc2 {
  constructor(args = [], closed = {}) {
    this.content = [], this.indent = 0, this.args = args, this.closed = closed;
  }
  indented(fn) {
    this.indent += 1;
    try {
      fn(this);
    } finally {
      this.indent -= 1;
    }
  }
  write(arg) {
    if (typeof arg === "function") {
      arg(this, { execution: "sync" }), arg(this, { execution: "async" });
      return;
    }
    let lines = arg.split(`
`).filter((x) => x), minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length)), dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
    for (let line of dedented)
      this.content.push(line);
  }
  compile() {
    let F = Function, content = this?.content ?? [""];
    return new F(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {
${content.join(`
`)}
};`)(...Object.values(this.closed));
  }
}

// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/core/versions.js
var version2 = {
  major: 4,
  minor: 6,
  patch: 7
};

// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/core/schemas.js
var $ZodType2 = /* @__PURE__ */ $constructor2("$ZodType", (inst, def) => {
  var _a;
  inst ?? (inst = {}), inst._zod.def = def, inst._zod.bag = inst._zod.bag || {}, inst._zod.version = version2;
  let defChecks = inst._zod.def.checks, checks = inst._zod.traits.has("$ZodCheck") ? [inst, ...defChecks ?? []] : defChecks?.length ? [...defChecks] : [];
  for (let ch of checks)
    for (let fn of ch._zod.onattach)
      fn(inst);
  if (checks.length === 0)
    (_a = inst._zod).deferred ?? (_a.deferred = []), inst._zod.deferred?.push(() => {
      inst._zod.run = inst._zod.parse;
    });
  else {
    let runChecks = (payload, checks, ctx) => {
      if (payload.memo)
        return payload;
      let isAborted = aborted2(payload), asyncResult;
      for (let ch of checks) {
        if (ch._zod.def.when) {
          if (explicitlyAborted(payload))
            continue;
          if (!ch._zod.def.when(payload))
            continue;
        } else if (isAborted)
          continue;
        let currLen = payload.issues.length, _ = ch._zod.check(payload);
        if (_ instanceof Promise && ctx?.async === !1)
          throw new $ZodAsyncError2;
        if (asyncResult || _ instanceof Promise)
          asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
            if (await _, payload.issues.length === currLen)
              return;
            if (attachSchema(payload.issues, currLen, inst), !isAborted)
              isAborted = aborted2(payload, currLen);
          });
        else {
          if (payload.issues.length === currLen)
            continue;
          if (attachSchema(payload.issues, currLen, inst), !isAborted)
            isAborted = aborted2(payload, currLen);
        }
      }
      if (asyncResult)
        return asyncResult.then(() => payload);
      return payload;
    }, handleCanaryResult = (canary, payload, ctx) => {
      if (aborted2(canary))
        return canary.aborted = !0, canary;
      let checkResult = runChecks(payload, checks, ctx);
      if (checkResult instanceof Promise) {
        if (ctx.async === !1)
          throw new $ZodAsyncError2;
        return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
      }
      return inst._zod.parse(checkResult, ctx);
    };
    inst._zod.run = (payload, ctx) => {
      if (ctx.skipChecks)
        return inst._zod.parse(payload, ctx);
      if (ctx.direction === "backward") {
        let canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: !0 });
        if (canary instanceof Promise)
          return canary.then((canary) => handleCanaryResult(canary, payload, ctx));
        return handleCanaryResult(canary, payload, ctx);
      }
      let result = inst._zod.parse(payload, ctx);
      if (result instanceof Promise) {
        if (ctx.async === !1)
          throw new $ZodAsyncError2;
        return result.then((result) => runChecks(result, checks, ctx));
      }
      return runChecks(result, checks, ctx);
    };
  }
}, {
  get "~standard"() {
    return hide(this, "~standard", standardProps(this));
  },
  set "~standard"(value) {
    own(this, "~standard", value);
  }
}), toStandardResult = (r, ctx) => r.issues.length ? { issues: r.issues.map((iss) => finalizeIssue2(iss, ctx, config2())) } : { value: r.value };
async function validateAsync2(inst, value) {
  let ctx = { async: !0 };
  return toStandardResult(await inst._zod.run({ value, issues: [] }, ctx), ctx);
}
function standardProps(inst) {
  return {
    validate: (value) => {
      let ctx = { async: !1 };
      try {
        let r = inst._zod.run({ value, issues: [] }, ctx);
        if (!(r instanceof Promise))
          return toStandardResult(r, ctx);
      } catch (_) {}
      return validateAsync2(inst, value);
    },
    vendor: "zod",
    version: 1
  };
}
var $ZodString2 = /* @__PURE__ */ $constructor2("$ZodString", (inst, def) => {
  $ZodType2.init(inst, def), inst._zod.pattern = def.pattern ?? anyString, inst._zod.parse = (payload, _) => {
    if (def.coerce)
      try {
        payload.value = String(payload.value);
      } catch (_) {}
    if (typeof payload.value === "string")
      return payload;
    return payload.issues.push({
      expected: "string",
      code: "invalid_type",
      input: payload.value,
      inst
    }), payload;
  };
}), $ZodStringFormat2 = /* @__PURE__ */ $constructor2("$ZodStringFormat", (inst, def) => {
  $ZodCheckStringFormat2.init(inst, def), $ZodString2.init(inst, def);
}), $ZodGUID2 = /* @__PURE__ */ $constructor2("$ZodGUID", (inst, def) => {
  def.pattern ?? (def.pattern = guid2), $ZodStringFormat2.init(inst, def);
}), $ZodUUID2 = /* @__PURE__ */ $constructor2("$ZodUUID", (inst, def) => {
  if (def.version) {
    let v = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    }[def.version];
    if (v === void 0)
      throw Error(`Invalid UUID version: "${def.version}"`);
    def.pattern ?? (def.pattern = uuid2(v));
  } else
    def.pattern ?? (def.pattern = uuid2());
  $ZodStringFormat2.init(inst, def);
}), $ZodEmail2 = /* @__PURE__ */ $constructor2("$ZodEmail", (inst, def) => {
  def.pattern ?? (def.pattern = email2), $ZodStringFormat2.init(inst, def);
}), URL_BAD_FORMAT = 1, URL_UNPARSEABLE = 2;
function canParseURL(input) {
  try {
    if (typeof URL < "u" && typeof URL.canParse === "function")
      return URL.canParse(input);
    return new URL(input), !0;
  } catch {
    return !1;
  }
}
function validateURL(trimmed, def) {
  if (!("normalize" in def) && !("hostname" in def) && !("protocol" in def))
    return canParseURL(trimmed) || URL_UNPARSEABLE;
  return parseURLObject(trimmed, def);
}
function parseURLObject(trimmed, def) {
  if (!def.normalize && def.protocol?.source === httpProtocol.source && !/^https?:\/\//i.test(trimmed))
    return URL_BAD_FORMAT;
  try {
    if (typeof URL < "u") {
      let URLStatic = URL;
      if (typeof URLStatic.parse === "function")
        return URLStatic.parse(trimmed) ?? URL_UNPARSEABLE;
    }
    return new URL(trimmed);
  } catch {
    return URL_UNPARSEABLE;
  }
}
var asciiTabOrNewline = /[\t\n\r]/g;
function stripTabAndNewline(value) {
  return value.replace(asciiTabOrNewline, "");
}
function urlHostnameOk(url, hostname) {
  return hostname.lastIndex = 0, hostname.test(url.hostname);
}
function urlProtocolOk(url, protocol) {
  return protocol.lastIndex = 0, protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol);
}
var $ZodURL2 = /* @__PURE__ */ $constructor2("$ZodURL", (inst, def) => {
  $ZodStringFormat2.init(inst, def), inst._zod.check = (payload) => {
    try {
      let trimmed = payload.value.trim(), url = validateURL(trimmed, def);
      if (url === URL_BAD_FORMAT) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          note: "Invalid URL format",
          input: payload.value,
          inst,
          continue: !def.abort
        });
        return;
      }
      if (url === URL_UNPARSEABLE) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          input: payload.value,
          inst,
          continue: !def.abort
        });
        return;
      }
      if (url === !0) {
        payload.value = stripTabAndNewline(trimmed);
        return;
      }
      if (def.hostname && !urlHostnameOk(url, def.hostname))
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          note: "Invalid hostname",
          pattern: def.hostname.source,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      if (def.protocol && !urlProtocolOk(url, def.protocol))
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          note: "Invalid protocol",
          pattern: def.protocol.source,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      payload.value = def.normalize ? url.href : stripTabAndNewline(trimmed);
      return;
    } catch (_) {
      payload.issues.push({
        code: "invalid_format",
        format: "url",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
}), $ZodEmoji2 = /* @__PURE__ */ $constructor2("$ZodEmoji", (inst, def) => {
  def.pattern ?? (def.pattern = emoji2()), $ZodStringFormat2.init(inst, def);
}), $ZodNanoID2 = /* @__PURE__ */ $constructor2("$ZodNanoID", (inst, def) => {
  if (def.length !== void 0 && (!Number.isInteger(def.length) || def.length < 1))
    throw Error(`Invalid nanoid length: ${def.length}`);
  def.pattern ?? (def.pattern = def.length === void 0 ? nanoid2 : nanoidOfLength(def.length)), $ZodStringFormat2.init(inst, def);
}), $ZodCUID3 = /* @__PURE__ */ $constructor2("$ZodCUID", (inst, def) => {
  def.pattern ?? (def.pattern = cuid3), $ZodStringFormat2.init(inst, def);
}), $ZodCUID22 = /* @__PURE__ */ $constructor2("$ZodCUID2", (inst, def) => {
  def.pattern ?? (def.pattern = cuid22), $ZodStringFormat2.init(inst, def);
}), $ZodULID2 = /* @__PURE__ */ $constructor2("$ZodULID", (inst, def) => {
  def.pattern ?? (def.pattern = ulid2), $ZodStringFormat2.init(inst, def);
}), $ZodXID2 = /* @__PURE__ */ $constructor2("$ZodXID", (inst, def) => {
  def.pattern ?? (def.pattern = xid2), $ZodStringFormat2.init(inst, def);
}), $ZodKSUID2 = /* @__PURE__ */ $constructor2("$ZodKSUID", (inst, def) => {
  def.pattern ?? (def.pattern = ksuid2), $ZodStringFormat2.init(inst, def);
}), $ZodISODateTime2 = /* @__PURE__ */ $constructor2("$ZodISODateTime", (inst, def) => {
  def.pattern ?? (def.pattern = datetime3(def)), $ZodStringFormat2.init(inst, def);
}), $ZodISODate2 = /* @__PURE__ */ $constructor2("$ZodISODate", (inst, def) => {
  def.pattern ?? (def.pattern = date3), $ZodStringFormat2.init(inst, def);
}), $ZodISOTime2 = /* @__PURE__ */ $constructor2("$ZodISOTime", (inst, def) => {
  def.pattern ?? (def.pattern = time3(def)), $ZodStringFormat2.init(inst, def);
}), $ZodISODuration2 = /* @__PURE__ */ $constructor2("$ZodISODuration", (inst, def) => {
  def.pattern ?? (def.pattern = duration3), $ZodStringFormat2.init(inst, def);
}), $ZodIPv42 = /* @__PURE__ */ $constructor2("$ZodIPv4", (inst, def) => {
  def.pattern ?? (def.pattern = ipv42), $ZodStringFormat2.init(inst, def);
}), ipv6Alphabet = /^[0-9a-fA-F:.]+$/;
function isValidIPv6(value) {
  if (!ipv6Alphabet.test(value))
    return !1;
  return canParseURL(`http://[${value}]`);
}
var $ZodIPv62 = /* @__PURE__ */ $constructor2("$ZodIPv6", (inst, def) => {
  def.pattern ?? (def.pattern = ipv62), $ZodStringFormat2.init(inst, def), inst._zod.check = (payload) => {
    if (!isValidIPv6(payload.value))
      payload.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
  };
});
var $ZodCIDRv42 = /* @__PURE__ */ $constructor2("$ZodCIDRv4", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv42), $ZodStringFormat2.init(inst, def);
});
function isValidCIDRv6(value) {
  let parts = value.split("/");
  if (parts.length !== 2)
    return !1;
  let [address, prefix] = parts;
  if (!prefix)
    return !1;
  let prefixNum = Number(prefix);
  if (`${prefixNum}` !== prefix)
    return !1;
  if (prefixNum < 0 || prefixNum > 128)
    return !1;
  return isValidIPv6(address);
}
var $ZodCIDRv62 = /* @__PURE__ */ $constructor2("$ZodCIDRv6", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv62), $ZodStringFormat2.init(inst, def), inst._zod.check = (payload) => {
    if (!isValidCIDRv6(payload.value))
      payload.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
  };
});
function isValidBase642(data) {
  if (data === "")
    return !0;
  if (/\s/.test(data))
    return !1;
  if (data.length % 4 !== 0)
    return !1;
  try {
    return atob(data), !0;
  } catch {
    return !1;
  }
}
var base64Charset = /^[0-9a-zA-Z+/]*={0,2}$/, $ZodBase642 = /* @__PURE__ */ $constructor2("$ZodBase64", (inst, def) => {
  def.pattern ?? (def.pattern = base64Charset), $ZodStringFormat2.init(inst, def), inst._zod.check = (payload) => {
    if (isValidBase642(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
}), base64urlCharset = /^[A-Za-z0-9_-]*$/;
function isValidBase64URL2(data) {
  if (!base64urlCharset.test(data))
    return !1;
  let base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/"), padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return isValidBase642(padded);
}
var $ZodBase64URL2 = /* @__PURE__ */ $constructor2("$ZodBase64URL", (inst, def) => {
  def.pattern ?? (def.pattern = base64urlCharset), $ZodStringFormat2.init(inst, def), inst._zod.check = (payload) => {
    if (isValidBase64URL2(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
}), $ZodE1642 = /* @__PURE__ */ $constructor2("$ZodE164", (inst, def) => {
  def.pattern ?? (def.pattern = e1642), $ZodStringFormat2.init(inst, def);
});
function isValidJWT2(token, algorithm = null) {
  try {
    let tokensParts = token.split(".");
    if (tokensParts.length !== 3)
      return !1;
    let [header] = tokensParts;
    if (!header)
      return !1;
    let parsedHeader = JSON.parse(atob(header));
    if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
      return !1;
    if (!parsedHeader.alg)
      return !1;
    if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
      return !1;
    return !0;
  } catch {
    return !1;
  }
}
var $ZodJWT2 = /* @__PURE__ */ $constructor2("$ZodJWT", (inst, def) => {
  $ZodStringFormat2.init(inst, def), inst._zod.check = (payload) => {
    if (isValidJWT2(payload.value, def.alg))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodNumber2 = /* @__PURE__ */ $constructor2("$ZodNumber", (inst, def) => {
  $ZodType2.init(inst, def), inst._zod.pattern = number3, inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Number(payload.value);
      } catch (_) {}
    let input = payload.value;
    if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input))
      return payload;
    let received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? String(input) : void 0 : void 0;
    return payload.issues.push({
      expected: "number",
      code: "invalid_type",
      input,
      inst,
      ...received ? { received } : {}
    }), payload;
  };
}), $ZodNumberFormat2 = /* @__PURE__ */ $constructor2("$ZodNumberFormat", (inst, def) => {
  $ZodCheckNumberFormat2.init(inst, def), $ZodNumber2.init(inst, def);
}), $ZodBoolean2 = /* @__PURE__ */ $constructor2("$ZodBoolean", (inst, def) => {
  $ZodType2.init(inst, def), inst._zod.pattern = boolean3, inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Boolean(payload.value);
      } catch (_) {}
    let input = payload.value;
    if (typeof input === "boolean")
      return payload;
    return payload.issues.push({
      expected: "boolean",
      code: "invalid_type",
      input,
      inst
    }), payload;
  };
});
var $ZodUndefined2 = /* @__PURE__ */ $constructor2("$ZodUndefined", (inst, def) => {
  $ZodType2.init(inst, def), inst._zod.pattern = _undefined3, inst._zod.values = /* @__PURE__ */ new Set([void 0]), inst._zod.parse = (payload, _ctx) => {
    let input = payload.value;
    if (typeof input > "u")
      return payload;
    return payload.issues.push({
      expected: "undefined",
      code: "invalid_type",
      input,
      inst
    }), payload;
  };
}), $ZodNull2 = /* @__PURE__ */ $constructor2("$ZodNull", (inst, def) => {
  $ZodType2.init(inst, def), inst._zod.pattern = _null3, inst._zod.values = /* @__PURE__ */ new Set([null]), inst._zod.parse = (payload, _ctx) => {
    let input = payload.value;
    if (input === null)
      return payload;
    return payload.issues.push({
      expected: "null",
      code: "invalid_type",
      input,
      inst
    }), payload;
  };
});
var $ZodUnknown2 = /* @__PURE__ */ $constructor2("$ZodUnknown", (inst, def) => {
  $ZodType2.init(inst, def), inst._zod.parse = (payload) => payload;
}), $ZodNever2 = /* @__PURE__ */ $constructor2("$ZodNever", (inst, def) => {
  $ZodType2.init(inst, def), inst._zod.parse = (payload, _ctx) => (payload.issues.push({
    expected: "never",
    code: "invalid_type",
    input: payload.value,
    inst
  }), payload);
});
function capSize(inst, size) {
  let caps = sizeCaps(inst._zod.def.checks);
  if (!caps.length)
    return;
  let cap = Math.min(...caps.map((c) => c[0])), parse = inst._zod.parse;
  inst._zod.parse = (payload, ctx) => {
    let n = size(payload.value);
    if (n > cap && !ctx?.skipChecks && ctx?.direction !== "backward") {
      for (let [max, ch] of sizeCaps(inst._zod.def.checks))
        if (n > max && ch._zod.def.when(payload)) {
          let start = payload.issues.length;
          return ch._zod.check(payload), payload.issues[start].continue = !1, attachSchema(payload.issues, start, inst), payload;
        }
    }
    return parse(payload, ctx);
  };
}
var arraySize = (input) => Array.isArray(input) ? input.length : -1;
function handleArrayResult2(result, final, index) {
  if (result.issues.length)
    final.issues.push(...prefixIssues2(index, result.issues));
  final.value[index] = result.value;
}
var $ZodArray2 = /* @__PURE__ */ $constructor2("$ZodArray", (inst, def) => {
  $ZodType2.init(inst, def);
  let memo = globalConfig2.memoizer;
  memo?.attach(inst), inst._zod.parse = (payload, ctx) => {
    let input = payload.value;
    if (!Array.isArray(input))
      return payload.issues.push({
        expected: "array",
        code: "invalid_type",
        input,
        inst
      }), payload;
    payload.value = memo ? memo.alloc(inst, payload, Array(input.length), ctx) : Array(input.length);
    let proms = [], abortEarly = ctx?.abortEarly;
    for (let i = 0;i < input.length; i++) {
      let item = input[i], result = def.element._zod.run({
        value: item,
        issues: []
      }, ctx);
      if (result instanceof Promise)
        proms.push(result.then((result) => handleArrayResult2(result, payload, i)));
      else if (handleArrayResult2(result, payload, i), abortEarly && result.issues.length !== 0 && aborted2(result))
        break;
    }
    if (proms.length)
      return Promise.all(proms).then(() => payload);
    return payload;
  }, capSize(inst, arraySize);
});
function handlePropertyResult2(result, final, key, input, optin, optout) {
  let isPresent = key in input, isOptionalOut = optout === "optional";
  if (!isPresent && isOptionalOut && optin === "optional")
    return;
  if (result.issues.length) {
    if (optin !== void 0 && isOptionalOut && !isPresent)
      return;
    final.issues.push(...prefixIssues2(key, result.issues));
  }
  if (!isPresent && optin === void 0) {
    if (!result.issues.length)
      final.issues.push({
        code: "invalid_type",
        expected: "nonoptional",
        input: void 0,
        path: [key]
      });
    return;
  }
  if (result.value === void 0) {
    if (isPresent || optin === "defaulted" && !isOptionalOut)
      final.value[key] = void 0;
  } else
    final.value[key] = result.value;
}
var NO_SYMBOL_KEYS = [];
function normalizeDef2(def) {
  let keys = Object.keys(def.shape), ownSymbols = Object.getOwnPropertySymbols(def.shape), symbolKeys = ownSymbols.length ? ownSymbols : NO_SYMBOL_KEYS, allKeys = symbolKeys.length ? [...keys, ...symbolKeys] : keys;
  for (let k of allKeys)
    if (!def.shape?.[k]?._zod?.traits?.has("$ZodType"))
      throw Error(`Invalid element at key "${String(k)}": expected a Zod schema`);
  let okeys = optionalKeys2(def.shape);
  return {
    ...def,
    allKeys,
    symbolKeys,
    keySet: new Set(keys),
    numKeys: keys.length,
    optionalKeys: new Set(okeys)
  };
}
function handleCatchall2(proms, input, payload, ctx, def, inst, abortEarly) {
  let unrecognized = [], keySet = def.keySet, _catchall = def.catchall._zod, t = _catchall.def.type, { optin, optout } = _catchall, seen = 0;
  for (let key in input) {
    if (abortEarly && payload.issues.length !== seen) {
      if (aborted2(payload, seen))
        break;
      seen = payload.issues.length;
    }
    if (keySet.has(key))
      continue;
    if (key === "__proto__") {
      if (t === "never")
        unrecognized.push(key);
      continue;
    }
    if (t === "never") {
      unrecognized.push(key);
      continue;
    }
    let r = _catchall.run({ value: input[key], issues: [] }, ctx);
    if (r instanceof Promise)
      proms.push(r.then((r) => handlePropertyResult2(r, payload, key, input, optin, optout)));
    else
      handlePropertyResult2(r, payload, key, input, optin, optout);
  }
  if (unrecognized.length)
    payload.issues.push({
      code: "unrecognized_keys",
      keys: unrecognized,
      input,
      inst,
      continue: !0
    });
  if (!proms.length)
    return payload;
  return Promise.all(proms).then(() => payload);
}
var $ZodObject2 = /* @__PURE__ */ $constructor2("$ZodObject", (inst, def) => {
  $ZodType2.init(inst, def);
  let desc = Object.getOwnPropertyDescriptor(def, "shape"), sh = desc?.get ? desc.get.raw : def.shape ?? {};
  if (sh) {
    let get = () => {
      let newSh = { ...sh };
      return Object.defineProperty(def, "shape", { value: newSh }), get.raw = newSh, newSh;
    };
    get.raw = sh, Object.defineProperty(def, "shape", { get });
  }
  let _normalized = cached2(() => normalizeDef2(def));
  defineLazyInternal(inst, "propValues", (zod) => {
    let shape = zod.def.shape, propValues = {};
    for (let key in shape) {
      let field = shape[key]._zod;
      if (field.values) {
        if (!Object.prototype.hasOwnProperty.call(propValues, key))
          assignProp2(propValues, key, /* @__PURE__ */ new Set);
        for (let v of field.values)
          propValues[key].add(v);
        if (field.optin !== void 0)
          propValues[key].add(void 0);
      }
    }
    return propValues;
  });
  let isObject = isObject3, catchall = def.catchall, value, memo = globalConfig2.memoizer;
  memo?.attach(inst), inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    let input = payload.value;
    if (!isObject(input))
      return payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      }), payload;
    payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
    let proms = [], shape = value.shape, abortEarly = ctx?.abortEarly, seen = payload.issues.length;
    for (let key of value.allKeys) {
      if (abortEarly && payload.issues.length !== seen) {
        if (aborted2(payload, seen))
          break;
        seen = payload.issues.length;
      }
      if (key === "__proto__")
        continue;
      let el = shape[key], optin = el._zod.optin, optout = el._zod.optout, r = el._zod.run({ value: input[key], issues: [] }, ctx);
      if (r instanceof Promise)
        proms.push(r.then((r) => handlePropertyResult2(r, payload, key, input, optin, optout)));
      else
        handlePropertyResult2(r, payload, key, input, optin, optout);
    }
    if (!catchall)
      return proms.length ? Promise.all(proms).then(() => payload) : payload;
    return handleCatchall2(proms, input, payload, ctx, _normalized.value, inst, abortEarly === !0);
  };
}), $ZodObjectJIT2 = /* @__PURE__ */ $constructor2("$ZodObjectJIT", (inst, def) => {
  $ZodObject2.init(inst, def);
  let superParse = inst._zod.parse, _normalized = cached2(() => normalizeDef2(def)), memo = globalConfig2.memoizer, generateFastpass = (shape) => {
    let normalized = _normalized.value, syms = normalized.symbolKeys, doc = new Doc2(["payload", "ctx"], { shape, inst, memo, syms }), parseStr = (k) => `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`, prefixStr = (id, k) => `
          let ${id}_ab = false;
          for (let i = 0; i < ${id}.issues.length; i++) {
            const iss = ${id}.issues[i];
            iss.path = iss.path ? [${k}, ...iss.path] : [${k}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${id}_ab = true;
          }
          if (${id}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;
    doc.write("const input = payload.value;");
    let ids = Object.create(null), counter = 0;
    for (let key of normalized.allKeys)
      ids[key] = `key_${counter++}`;
    doc.write(memo ? "const newResult = memo.alloc(inst, payload, {}, ctx);" : "const newResult = {};");
    for (let key of normalized.allKeys) {
      if (key === "__proto__")
        continue;
      let id = ids[key], k = typeof key === "symbol" ? `syms[${syms.indexOf(key)}]` : esc2(key), isPresent = `${k} in input`, schema = shape[key], optin = schema?._zod?.optin, isOptionalIn = optin !== void 0, isOptionalOut = schema?._zod?.optout === "optional";
      if (doc.write(`const ${id} = ${parseStr(k)};`), isOptionalIn && isOptionalOut) {
        let assign = optin === "optional" ? `${id}_present` : `${id}.value !== undefined || ${id}_present`;
        doc.write(`
        const ${id}_present = ${isPresent};
        if (!${id}.issues.length || ${id}_present) {
          if (${id}.issues.length) {${prefixStr(id, k)}
          }

          if (${assign}) {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
      } else if (!isOptionalIn)
        doc.write(`
        const ${id}_present = ${isPresent};
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${id}_present) {
          newResult[${k}] = ${id}.value;
        }

      `);
      else if (doc.write(`
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
      `), optin === "defaulted")
        doc.write(`newResult[${k}] = ${id}.value;`);
      else
        doc.write(`
        if (${id}.value !== undefined || ${isPresent}) {
          newResult[${k}] = ${id}.value;
        }
      `);
    }
    return doc.write("payload.value = newResult;"), doc.write("return payload;"), doc.compile();
  }, fastpass, isObject = isObject3, jit = !globalConfig2.jitless, fastEnabled = jit && allowsEval2.value, catchall = def.catchall, value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    let input = payload.value;
    if (!isObject(input))
      return payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      }), payload;
    if (jit && fastEnabled && ctx?.async === !1 && ctx.jitless !== !0) {
      if (!fastpass)
        fastpass = generateFastpass(def.shape);
      if (payload = fastpass(payload, ctx), !catchall)
        return payload;
      return handleCatchall2([], input, payload, ctx, value, inst, ctx?.abortEarly === !0);
    }
    return superParse(payload, ctx);
  };
});
function handleUnionResults2(results, final, inst, ctx) {
  for (let result of results)
    if (result.issues.length === 0)
      return final.value = result.value, final;
  let nonaborted = results.filter((r) => !aborted2(r));
  if (nonaborted.length === 1)
    return final.value = nonaborted[0].value, nonaborted[0];
  return final.issues.push({
    code: "invalid_union",
    input: final.value,
    inst,
    errors: results.map((result) => result.issues.map((iss) => finalizeIssue2(iss, ctx, config2())))
  }), final;
}
var $ZodUnion2 = /* @__PURE__ */ $constructor2("$ZodUnion", (inst, def) => {
  $ZodType2.init(inst, def), defineLazyInternal(inst, "optin", (zod) => zod.def.options.some((o) => o._zod.optin === "defaulted") ? "defaulted" : zod.def.options.some((o) => o._zod.optin !== void 0) ? "optional" : void 0), defineLazyInternal(inst, "optout", (zod) => zod.def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0), defineLazyInternal(inst, "values", (zod) => {
    if (zod.def.options.every((o) => o._zod.values))
      return new Set(zod.def.options.flatMap((option) => Array.from(option._zod.values)));
    return;
  }), defineLazyInternal(inst, "pattern", (zod) => {
    if (zod.def.options.every((o) => o._zod.pattern)) {
      let patterns = zod.def.options.map((o) => o._zod.pattern);
      return new RegExp(`^(${patterns.map((p) => cleanRegex2(p.source)).join("|")})$`);
    }
    return;
  });
  let first = def.options.length === 1 ? def.options[0]._zod.run : null;
  inst._zod.parse = (payload, ctx) => {
    if (first)
      return first(payload, ctx);
    let async = !1, results = [];
    for (let option of def.options) {
      let result = option._zod.run({
        value: payload.value,
        issues: []
      }, ctx);
      if (result instanceof Promise)
        results.push(result), async = !0;
      else {
        if (result.issues.length === 0)
          return result;
        results.push(result);
      }
    }
    if (!async)
      return handleUnionResults2(results, payload, inst, ctx);
    return Promise.all(results).then((results) => handleUnionResults2(results, payload, inst, ctx));
  };
});
function discriminatorMap(def) {
  let map = /* @__PURE__ */ new Map;
  for (let option of def.options) {
    let values = option._zod.propValues?.[def.discriminator];
    if (!values || values.size === 0)
      throw Error(`Invalid discriminated union option at index "${def.options.indexOf(option)}"`);
    for (let value of values)
      if (map.has(value)) {
        if (value !== void 0)
          throw Error(`Duplicate discriminator value "${String(value)}"`);
        map.set(value, null);
      } else
        map.set(value, option);
  }
  return map;
}
var $ZodDiscriminatedUnion2 = /* @__PURE__ */ $constructor2("$ZodDiscriminatedUnion", (inst, def) => {
  def.inclusive = !1, $ZodUnion2.init(inst, def);
  let _super = inst._zod.parse;
  defineLazyInternal(inst, "propValues", (zod) => {
    let propValues = {}, undefinedCount = 0;
    for (let option of zod.def.options) {
      let pv = option._zod.propValues;
      if (!pv || Object.keys(pv).length === 0)
        throw Error(`Invalid discriminated union option at index "${zod.def.options.indexOf(option)}"`);
      if (pv[zod.def.discriminator]?.has(void 0))
        undefinedCount++;
      for (let [k, v] of Object.entries(pv)) {
        if (!Object.prototype.hasOwnProperty.call(propValues, k))
          assignProp2(propValues, k, /* @__PURE__ */ new Set);
        for (let val of v)
          propValues[k].add(val);
      }
    }
    if (!zod.def.unionFallback && undefinedCount > 1)
      propValues[zod.def.discriminator]?.delete(void 0);
    return propValues;
  }), def.options.forEach((option, i) => {
    let propShape = rawShape(option._zod.def);
    if (propShape && !Object.prototype.hasOwnProperty.call(propShape, def.discriminator))
      throw Error(`Invalid discriminated union option at index "${i}"`);
  });
  let disc = cached2(() => discriminatorMap(def));
  inst._zod.parse = (payload, ctx) => {
    let input = payload.value;
    if (!isObject3(input))
      return payload.issues.push({
        code: "invalid_type",
        expected: "object",
        input,
        inst
      }), payload;
    let value = input?.[def.discriminator], opt = disc.value.get(value);
    if (opt && (value !== void 0 || ctx.direction !== "backward"))
      return opt._zod.run(payload, ctx);
    if (def.unionFallback || ctx.direction === "backward")
      return _super(payload, ctx);
    return payload.issues.push({
      code: "invalid_union",
      errors: [],
      note: "No matching discriminator",
      discriminator: def.discriminator,
      options: Array.from(disc.value.keys()).filter((value) => disc.value.get(value) !== null),
      input,
      path: [def.discriminator],
      inst
    }), payload;
  };
}), $ZodIntersection2 = /* @__PURE__ */ $constructor2("$ZodIntersection", (inst, def) => {
  $ZodType2.init(inst, def), inst._zod.parse = (payload, ctx) => {
    let input = payload.value, left = def.left._zod.run({ value: input, issues: [] }, ctx), right = def.right._zod.run({ value: input, issues: [] }, ctx);
    if (left instanceof Promise || right instanceof Promise)
      return Promise.all([left, right]).then(([left, right]) => handleIntersectionResults2(payload, left, right));
    return handleIntersectionResults2(payload, left, right);
  };
});
function mergeValues2(a, b) {
  if (a === b)
    return { valid: !0, data: a };
  if (a instanceof Date && b instanceof Date && +a === +b)
    return { valid: !0, data: a };
  if (isPlainObject2(a) && isPlainObject2(b)) {
    let bKeys = Object.keys(b), sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1), newObj = { ...a, ...b };
    if (Object.prototype.hasOwnProperty.call(newObj, "__proto__"))
      delete newObj.__proto__;
    for (let key of sharedKeys) {
      if (key === "__proto__")
        continue;
      let sharedValue = mergeValues2(a[key], b[key]);
      if (!sharedValue.valid)
        return {
          valid: !1,
          mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
        };
      newObj[key] = sharedValue.data;
    }
    return { valid: !0, data: newObj };
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length)
      return { valid: !1, mergeErrorPath: [] };
    let newArray = [];
    for (let index = 0;index < a.length; index++) {
      let itemA = a[index], itemB = b[index], sharedValue = mergeValues2(itemA, itemB);
      if (!sharedValue.valid)
        return {
          valid: !1,
          mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
        };
      newArray.push(sharedValue.data);
    }
    return { valid: !0, data: newArray };
  }
  return { valid: !1, mergeErrorPath: [] };
}
function handleIntersectionResults2(result, left, right) {
  let unrecKeys = /* @__PURE__ */ new Map, unrecIssue, keyIssues = /* @__PURE__ */ new Map, collect = (iss, side) => {
    let keys;
    if (iss.code === "unrecognized_keys" && !iss.path?.length)
      unrecIssue ?? (unrecIssue = iss), keys = iss.keys;
    else if (iss.code === "invalid_key" && iss.origin === "record" && iss.path?.length === 1) {
      let k = String(iss.path[0]);
      if (!keyIssues.has(k))
        keyIssues.set(k, iss);
      keys = [k];
    } else
      return !1;
    for (let k of keys) {
      if (!unrecKeys.has(k))
        unrecKeys.set(k, {});
      unrecKeys.get(k)[side] = !0;
    }
    return !0;
  };
  for (let iss of left.issues)
    if (!collect(iss, "l"))
      result.issues.push(iss);
  for (let iss of right.issues)
    if (!collect(iss, "r"))
      result.issues.push(iss);
  let bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
  if (bothKeys.length) {
    let aggregated = unrecIssue ? bothKeys.filter((k) => unrecIssue.keys.includes(k)) : [];
    if (aggregated.length)
      result.issues.push({ ...unrecIssue, keys: aggregated });
    for (let k of bothKeys)
      if (!aggregated.includes(k) && keyIssues.has(k))
        result.issues.push(keyIssues.get(k));
  }
  let merged = mergeValues2(left.value, right.value);
  if (!merged.valid) {
    if (aborted2(result))
      return result;
    throw Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
  }
  return result.value = merged.data, result;
}
var $ZodRecord2 = /* @__PURE__ */ $constructor2("$ZodRecord", (inst, def) => {
  $ZodType2.init(inst, def);
  let memo = globalConfig2.memoizer;
  memo?.attach(inst), inst._zod.parse = (payload, ctx) => {
    let input = payload.value;
    if (!isPlainObject2(input))
      return payload.issues.push({
        expected: "record",
        code: "invalid_type",
        input,
        inst
      }), payload;
    let proms = [], values = def.keyType._zod.values;
    if (values && !def.partial) {
      payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
      let recordKeys = /* @__PURE__ */ new Set;
      for (let key of values)
        if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
          if (recordKeys.add(typeof key === "number" ? key.toString() : key), key === "__proto__")
            continue;
          let keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
          if (keyResult instanceof Promise)
            throw Error("Async schemas not supported in object keys currently");
          if (keyResult.issues.length) {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue2(iss, ctx, config2())),
              input: key,
              path: [key],
              inst
            });
            continue;
          }
          let outKey = keyResult.value;
          if (outKey === "__proto__")
            continue;
          let result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
          if (result instanceof Promise)
            proms.push(result.then((result) => {
              if (result.issues.length)
                payload.issues.push(...prefixIssues2(key, result.issues));
              payload.value[outKey] = result.value;
            }));
          else {
            if (result.issues.length)
              payload.issues.push(...prefixIssues2(key, result.issues));
            payload.value[outKey] = result.value;
          }
        }
      let unrecognized;
      for (let key in input)
        if (!recordKeys.has(key))
          if (def.mode === "loose") {
            if (key === "__proto__")
              continue;
            payload.value[key] = input[key];
          } else
            unrecognized = unrecognized ?? [], unrecognized.push(key);
      if (unrecognized && unrecognized.length > 0)
        payload.issues.push({
          code: "unrecognized_keys",
          input,
          inst,
          keys: unrecognized,
          continue: !0
        });
    } else {
      payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
      let unrecognized;
      for (let key of Reflect.ownKeys(input)) {
        if (key === "__proto__")
          continue;
        if (!Object.prototype.propertyIsEnumerable.call(input, key))
          continue;
        let keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
        if (keyResult instanceof Promise)
          throw Error("Async schemas not supported in object keys currently");
        if (typeof key === "string" && number3.test(key) && keyResult.issues.length) {
          let retryResult = def.keyType._zod.run({ value: Number(key), issues: [] }, ctx);
          if (retryResult instanceof Promise)
            throw Error("Async schemas not supported in object keys currently");
          if (retryResult.issues.length === 0)
            keyResult = retryResult;
        }
        if (keyResult.issues.length) {
          if (def.mode === "loose")
            payload.value[key] = input[key];
          else if (values)
            unrecognized = unrecognized ?? [], unrecognized.push(key);
          else
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue2(iss, ctx, config2())),
              input: key,
              path: [key],
              inst
            });
          continue;
        }
        let outKey = keyResult.value;
        if (outKey === "__proto__")
          continue;
        let result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
        if (result instanceof Promise)
          proms.push(result.then((result) => {
            if (result.issues.length)
              payload.issues.push(...prefixIssues2(key, result.issues));
            payload.value[outKey] = result.value;
          }));
        else {
          if (result.issues.length)
            payload.issues.push(...prefixIssues2(key, result.issues));
          payload.value[outKey] = result.value;
        }
      }
      if (unrecognized && unrecognized.length > 0)
        payload.issues.push({
          code: "unrecognized_keys",
          input,
          inst,
          keys: unrecognized,
          continue: !0
        });
    }
    if (proms.length)
      return Promise.all(proms).then(() => payload);
    return payload;
  };
});
var $ZodEnum2 = /* @__PURE__ */ $constructor2("$ZodEnum", (inst, def) => {
  $ZodType2.init(inst, def);
  let values = getEnumValues2(def.entries), valuesSet = new Set(values);
  inst._zod.values = valuesSet, defineLazyInternal(inst, "pattern", (zod) => {
    let patternValues = getEnumValues2(zod.def.entries).filter((k) => propertyKeyTypes2.has(typeof k));
    return new RegExp(patternValues.length ? `^(${patternValues.map((o) => escapeRegex2(o.toString())).join("|")})$` : "^[^\\s\\S]$");
  }), inst._zod.parse = (payload, _ctx) => {
    let input = payload.value;
    if (valuesSet.has(input))
      return payload;
    return payload.issues.push({
      code: "invalid_value",
      values,
      input,
      inst
    }), payload;
  };
}), $ZodLiteral2 = /* @__PURE__ */ $constructor2("$ZodLiteral", (inst, def) => {
  $ZodType2.init(inst, def);
  let values = new Set(def.values);
  inst._zod.values = values, defineLazyInternal(inst, "pattern", (zod) => {
    let vals = zod.def.values;
    return new RegExp(vals.length ? `^(${vals.map((o) => typeof o === "string" ? escapeRegex2(o) : o ? escapeRegex2(o.toString()) : String(o)).join("|")})$` : "^[^\\s\\S]$");
  }), inst._zod.parse = (payload, _ctx) => {
    let input = payload.value;
    if (values.has(input))
      return payload;
    return payload.issues.push({
      code: "invalid_value",
      values: def.values,
      input,
      inst
    }), payload;
  };
});
var $ZodTransform2 = /* @__PURE__ */ $constructor2("$ZodTransform", (inst, def) => {
  $ZodType2.init(inst, def), inst._zod.optin = "optional", globalConfig2.memoizer?.guard(inst), inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward")
      throw new $ZodEncodeError2(inst.constructor.name);
    let _out = def.transform(payload.value, payload);
    if (ctx.async)
      return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => (payload.value = output, payload));
    if (_out instanceof Promise)
      throw new $ZodAsyncError2;
    return payload.value = _out, payload;
  };
});
function handleOptionalResult2(payload, result) {
  return payload.value = result.issues.length ? void 0 : result.value, payload;
}
var $ZodOptional2 = /* @__PURE__ */ $constructor2("$ZodOptional", (inst, def) => {
  $ZodType2.init(inst, def), defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional"), inst._zod.optout = "optional", defineLazyInternal(inst, "values", (zod) => {
    let values = zod.def.innerType._zod.values;
    return values ? /* @__PURE__ */ new Set([...values, void 0]) : void 0;
  }), defineLazyInternal(inst, "pattern", (zod) => {
    let pattern = zod.def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex2(pattern.source)})?$`) : void 0;
  }), inst._zod.parse = (payload, ctx) => {
    if (payload.value === void 0) {
      if (def.innerType._zod.optin !== "defaulted")
        return payload;
      let result = def.innerType._zod.run({ value: payload.value, issues: [] }, ctx);
      if (result instanceof Promise)
        return result.then((result) => handleOptionalResult2(payload, result));
      return handleOptionalResult2(payload, result);
    }
    return def.innerType._zod.run(payload, ctx);
  };
}), $ZodExactOptional2 = /* @__PURE__ */ $constructor2("$ZodExactOptional", (inst, def) => {
  $ZodOptional2.init(inst, def), defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values), defineLazyInternal(inst, "pattern", (zod) => zod.def.innerType._zod.pattern), inst._zod.parse = (payload, ctx) => def.innerType._zod.run(payload, ctx);
}), $ZodNullable2 = /* @__PURE__ */ $constructor2("$ZodNullable", (inst, def) => {
  $ZodType2.init(inst, def), defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin), defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout), defineLazyInternal(inst, "pattern", (zod) => {
    let pattern = zod.def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex2(pattern.source)}|null)$`) : void 0;
  }), defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values ? /* @__PURE__ */ new Set([...zod.def.innerType._zod.values, null]) : void 0), inst._zod.parse = (payload, ctx) => {
    if (payload.value === null)
      return payload;
    return def.innerType._zod.run(payload, ctx);
  };
}), $ZodDefault2 = /* @__PURE__ */ $constructor2("$ZodDefault", (inst, def) => {
  $ZodType2.init(inst, def), inst._zod.optin = "defaulted", defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values), inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward")
      return def.innerType._zod.run(payload, ctx);
    if (payload.value === void 0)
      return payload.value = def.defaultValue, payload;
    let result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise)
      return result.then((result) => handleDefaultResult2(result, def));
    return handleDefaultResult2(result, def);
  };
});
function handleDefaultResult2(payload, def) {
  if (payload.value === void 0)
    payload.value = def.defaultValue;
  return payload;
}
var $ZodPrefault2 = /* @__PURE__ */ $constructor2("$ZodPrefault", (inst, def) => {
  $ZodType2.init(inst, def), inst._zod.optin = "defaulted", defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values), inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward")
      return def.innerType._zod.run(payload, ctx);
    if (payload.value === void 0)
      payload.value = def.defaultValue;
    return def.innerType._zod.run(payload, ctx);
  };
}), $ZodNonOptional2 = /* @__PURE__ */ $constructor2("$ZodNonOptional", (inst, def) => {
  $ZodType2.init(inst, def), defineLazyInternal(inst, "values", (zod) => {
    let v = zod.def.innerType._zod.values;
    return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
  }), inst._zod.parse = (payload, ctx) => {
    let result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise)
      return result.then((result) => handleNonOptionalResult2(result, inst));
    return handleNonOptionalResult2(result, inst);
  };
});
function handleNonOptionalResult2(payload, inst) {
  if (!payload.issues.length && payload.value === void 0)
    payload.issues.push({
      code: "invalid_type",
      expected: "nonoptional",
      input: payload.value,
      inst
    });
  return payload;
}
function handleCatchResult(payload, result, def, ctx) {
  if (!result.issues.length) {
    if (payload.value = result.value, result.memo)
      payload.memo = !0;
    return payload;
  }
  return payload.value = def.catchValue({
    ...result,
    value: payload.value,
    error: {
      issues: result.issues.map((iss) => finalizeIssue2(iss, ctx, config2()))
    },
    input: payload.value
  }), payload;
}
var $ZodCatch2 = /* @__PURE__ */ $constructor2("$ZodCatch", (inst, def) => {
  $ZodType2.init(inst, def), defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional"), defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout), defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values), inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward")
      return def.innerType._zod.run(payload, ctx);
    let result = def.innerType._zod.run({ value: payload.value, issues: [] }, ctx);
    if (result instanceof Promise)
      return result.then((result) => handleCatchResult(payload, result, def, ctx));
    return handleCatchResult(payload, result, def, ctx);
  };
}), $ZodNaN2 = /* @__PURE__ */ $constructor2("$ZodNaN", (inst, def) => {
  $ZodType2.init(inst, def), inst._zod.parse = (payload, _ctx) => {
    if (typeof payload.value !== "number" || !Number.isNaN(payload.value))
      return payload.issues.push({
        input: payload.value,
        inst,
        expected: "nan",
        code: "invalid_type"
      }), payload;
    return payload;
  };
}), $ZodPipe2 = /* @__PURE__ */ $constructor2("$ZodPipe", (inst, def) => {
  $ZodType2.init(inst, def), defineLazyInternal(inst, "values", (zod) => zod.def.in._zod.values), defineLazyInternal(inst, "optin", (zod) => zod.def.in._zod.optin), defineLazyInternal(inst, "optout", (zod) => zod.def.out._zod.optout), defineLazyInternal(inst, "propValues", (zod) => zod.def.in._zod.propValues), inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      let right = def.out._zod.run(payload, ctx);
      if (right instanceof Promise)
        return right.then((right) => handlePipeResult2(right, def.in, ctx));
      return handlePipeResult2(right, def.in, ctx);
    }
    let left = def.in._zod.run(payload, ctx);
    if (left instanceof Promise)
      return left.then((left) => handlePipeResult2(left, def.out, ctx));
    return handlePipeResult2(left, def.out, ctx);
  };
});
function handlePipeResult2(left, next, ctx) {
  if (left.issues.some((iss) => iss.code !== "unrecognized_keys"))
    return left.aborted = !0, left;
  return next._zod.run({ value: left.value, issues: left.issues }, ctx);
}
var $ZodReadonly2 = /* @__PURE__ */ $constructor2("$ZodReadonly", (inst, def) => {
  $ZodType2.init(inst, def), defineLazyInternal(inst, "propValues", (zod) => zod.def.innerType._zod.propValues), defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values), defineLazyInternal(inst, "optin", (zod) => zod.def.innerType?._zod?.optin), defineLazyInternal(inst, "optout", (zod) => zod.def.innerType?._zod?.optout), inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward")
      return def.innerType._zod.run(payload, ctx);
    let result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise)
      return result.then(handleReadonlyResult2);
    return handleReadonlyResult2(result);
  };
});
function handleReadonlyResult2(payload) {
  if (!payload.memo)
    payload.value = Object.freeze(payload.value);
  return payload;
}
var $ZodLazy2 = /* @__PURE__ */ $constructor2("$ZodLazy", (inst, def) => {
  $ZodType2.init(inst, def), defineLazy2(inst._zod, "innerType", () => {
    let d = def;
    if (!d._cachedInner)
      d._cachedInner = def.getter();
    return d._cachedInner;
  }), defineLazyInternal(inst, "pattern", (zod) => zod.innerType?._zod?.pattern), defineLazyInternal(inst, "propValues", (zod) => zod.innerType?._zod?.propValues), defineLazyInternal(inst, "optin", (zod) => zod.innerType?._zod?.optin ?? void 0), defineLazyInternal(inst, "optout", (zod) => zod.innerType?._zod?.optout ?? void 0), inst._zod.parse = (payload, ctx) => inst._zod.innerType._zod.run(payload, ctx);
}), $ZodCustom2 = /* @__PURE__ */ $constructor2("$ZodCustom", (inst, def) => {
  $ZodCheck2.init(inst, def), $ZodType2.init(inst, def), inst._zod.parse = (payload, _) => payload, inst._zod.check = (payload) => {
    let input = payload.value, r = def.fn(input);
    if (r instanceof Promise)
      return r.then((r) => handleRefineResult2(r, payload, input, inst));
    handleRefineResult2(r, payload, input, inst);
    return;
  };
});
function handleRefineResult2(result, payload, input, inst) {
  if (!result) {
    let _iss = {
      code: "custom",
      input,
      inst,
      path: [...inst._zod.def.path ?? []],
      continue: !inst._zod.def.abort
    };
    if (inst._zod.def.params)
      _iss.params = inst._zod.def.params;
    payload.issues.push(issue2(_iss));
  }
}
// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/core/memoizer.js
class $ZodCyclicError extends Error {
  constructor() {
    super("Cannot parse a reference cycle that closes through a transform");
    this.name = "ZodCyclicError";
  }
}
var STATE = "~memo", NO_ISSUES = [];
function isRef(value) {
  return value !== null && typeof value === "object";
}
function cloneIssues(issues) {
  return issues.map((iss) => iss.path ? { ...iss, path: iss.path.slice() } : { ...iss });
}
var recursive = /* @__PURE__ */ new WeakMap, NONE = 0, ASSUMED = 1, PROVEN = 2;
function isRecursive(inst, stack, resolve) {
  let cached = recursive.get(inst);
  if (cached !== void 0)
    return cached ? PROVEN : NONE;
  if (stack.has(inst))
    return PROVEN;
  stack.add(inst);
  let result = NONE, check = (child) => {
    if (result !== PROVEN && child?._zod) {
      let answer = isRecursive(child, stack, resolve);
      if (answer > result)
        result = answer;
    }
  }, shape = (sh, spread) => {
    let answer = NONE;
    for (let key of Reflect.ownKeys(sh)) {
      let desc = Object.getOwnPropertyDescriptor(sh, key);
      if (spread && !desc.enumerable)
        continue;
      let child = desc.get ? ASSUMED : desc.value?._zod ? isRecursive(desc.value, stack, resolve) : NONE;
      if (child > answer)
        answer = child;
    }
    return answer;
  }, merge = (answer) => {
    if (answer > result)
      result = answer;
  }, def = inst._zod.def, kind = def.type;
  switch (kind) {
    case "object": {
      let raw = rawShape(def);
      merge(raw ? shape(raw, !0) : ASSUMED), check(def.catchall);
      break;
    }
    case "array":
      check(def.element);
      break;
    case "tuple":
      for (let el of def.items)
        check(el);
      check(def.rest);
      break;
    case "record":
    case "map":
      check(def.keyType), check(def.valueType);
      break;
    case "set":
      check(def.valueType);
      break;
    case "union":
      for (let el of def.options)
        check(el);
      break;
    case "intersection":
      check(def.left), check(def.right);
      break;
    case "optional":
    case "nullable":
    case "default":
    case "prefault":
    case "catch":
    case "readonly":
    case "nonoptional":
    case "promise":
    case "success":
      check(def.innerType);
      break;
    case "pipe":
      check(def.in), check(def.out);
      break;
    case "function":
      check(def.input), check(def.output);
      break;
    case "lazy": {
      let inner = def._cachedInner ?? (resolve ? inst._zod.innerType : void 0);
      merge(inner ? isRecursive(inner, stack, !1) : ASSUMED);
      break;
    }
    case "template_literal":
    case "string":
    case "number":
    case "int":
    case "boolean":
    case "bigint":
    case "symbol":
    case "undefined":
    case "null":
    case "void":
    case "never":
    case "any":
    case "unknown":
    case "date":
    case "nan":
    case "enum":
    case "literal":
    case "file":
    case "transform":
    case "custom":
      break;
    default:
      for (let key in def) {
        let desc = Object.getOwnPropertyDescriptor(def, key);
        if (!desc || desc.get)
          continue;
        let value = desc.value;
        if (!value || typeof value !== "object")
          continue;
        if (value._zod)
          check(value);
        else if (Array.isArray(value))
          for (let el of value)
            check(el);
      }
  }
  return stack.delete(inst), settle(inst, result);
}
function settle(inst, answer) {
  if (answer !== ASSUMED)
    recursive.set(inst, answer === PROVEN);
  return answer;
}
function bucketFor(state, inst) {
  let bucket = state.buckets.get(inst);
  if (!bucket)
    bucket = /* @__PURE__ */ new WeakMap, state.buckets.set(inst, bucket);
  return bucket;
}
var handoff, open = [], memo = {
  alloc(_inst, payload, empty) {
    let bucket = handoff;
    if (!bucket)
      return empty;
    handoff = void 0;
    let entry = { value: empty, issues: null };
    return bucket.set(payload.value, entry), open.push(entry), empty;
  },
  guard(inst) {
    var _a;
    (_a = inst._zod).deferred ?? (_a.deferred = []), inst._zod.deferred.push(() => {
      let base = inst._zod.parse, wrapped = (payload, ctx) => {
        if (ctx.direction !== "backward" && isBackEdge(ctx, payload.value))
          throw new $ZodCyclicError;
        return base(payload, ctx);
      };
      if (inst._zod.parse = wrapped, inst._zod.run === base)
        inst._zod.run = wrapped;
    });
  },
  attach(inst) {
    var _a;
    let isRecursiveInst, rechecked = !1, lastCtx, lastBucket;
    (_a = inst._zod).deferred ?? (_a.deferred = []), inst._zod.deferred.push(() => {
      let base = inst._zod.parse, wrapped = (payload, ctx) => {
        if (isRecursiveInst === void 0) {
          let walked = isRecursive(inst, /* @__PURE__ */ new Set, !1);
          if (walked === NONE) {
            if (inst._zod.parse = base, inst._zod.run === wrapped)
              inst._zod.run = base;
            return base(payload, ctx);
          }
          if (walked === PROVEN || rechecked)
            isRecursiveInst = !0;
          else
            rechecked = !0;
        }
        let input = payload.value;
        if (!isRef(input))
          return base(payload, ctx);
        let state = ctx[STATE];
        if (!state)
          state = { buckets: /* @__PURE__ */ new WeakMap, backEdges: void 0 }, ctx[STATE] = state;
        let bucket;
        if (lastCtx === ctx)
          bucket = lastBucket;
        else
          bucket = bucketFor(state, inst), lastCtx = ctx, lastBucket = bucket;
        let hit = bucket.get(input);
        if (hit) {
          if (payload.value = hit.value, hit.issues) {
            if (hit.issues.length)
              payload.issues.push(...cloneIssues(hit.issues));
          } else
            payload.memo = !0, state.backEdges ?? (state.backEdges = /* @__PURE__ */ new WeakSet), state.backEdges.add(hit.value);
          return payload;
        }
        handoff = bucket;
        let depth = open.length, result = base(payload, ctx);
        handoff = void 0;
        let entry = open.length > depth ? open.pop() : void 0;
        if (result instanceof Promise)
          return result.then((r) => {
            if (entry)
              entry.issues = r.issues.length ? cloneIssues(r.issues) : NO_ISSUES;
            return r;
          });
        if (entry)
          entry.issues = result.issues.length ? cloneIssues(result.issues) : NO_ISSUES;
        return result;
      };
      if (inst._zod.parse = wrapped, inst._zod.run === base)
        inst._zod.run = wrapped;
    });
  }
};
function memoizer() {
  return memo;
}
function isBackEdge(ctx, value) {
  let backEdges = ctx[STATE]?.backEdges;
  return backEdges !== void 0 && isRef(value) && backEdges.has(value);
}
// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/locales/en.js
var error = () => {
  let Sizable = {
    string: { unit: "characters", verb: "to have" },
    file: { unit: "bytes", verb: "to have" },
    array: { unit: "items", verb: "to have" },
    set: { unit: "items", verb: "to have" },
    map: { unit: "entries", verb: "to have" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  let FormatDictionary = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    mac: "MAC address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    currency_code: "currency code",
    credit_card: "credit card number",
    iban: "IBAN",
    jwt: "JWT",
    template_literal: "input"
  }, TypeDictionary = {
    nan: "NaN"
  };
  function getTypeName(type, input) {
    if (type === "number" && typeof input === "number" && !Number.isFinite(input))
      return String(input);
    return TypeDictionary[type] ?? type;
  }
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        let expected = getTypeName(issue.expected), receivedType = parsedType(issue.input), received = getTypeName(receivedType, issue.input);
        return `Invalid input: expected ${expected}, received ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Invalid input: expected ${stringifyPrimitive(issue.values[0])}`;
        return `Invalid option: expected one of ${joinValues(issue.values, "|")}`;
      case "too_big": {
        let adj = issue.exact ? "exactly " : issue.inclusive ? "<=" : "<", sizing = getSizing(issue.origin);
        if (sizing)
          return `Too big: expected ${issue.origin ?? "value"} to have ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
        return `Too big: expected ${issue.origin ?? "value"} to be ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        let adj = issue.exact ? "exactly " : issue.inclusive ? ">=" : ">", sizing = getSizing(issue.origin);
        if (sizing)
          return `Too small: expected ${issue.origin} to have ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        return `Too small: expected ${issue.origin} to be ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        let _issue = issue;
        if (_issue.format === "starts_with")
          return `Invalid string: must start with "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Invalid string: must end with "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Invalid string: must include "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Invalid string: must match pattern ${_issue.pattern}`;
        return `Invalid ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Invalid number: must be a multiple of ${issue.divisor}`;
      case "unrecognized_keys":
        return `Unrecognized key${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Invalid key in ${issue.origin}`;
      case "invalid_union":
        if (issue.options && Array.isArray(issue.options) && issue.options.length > 0)
          return `Invalid discriminator value. Expected ${issue.options.map((o) => `'${o}'`).join(" | ")}`;
        if (issue.inclusive === !1)
          return "Invalid input: more than one option matched";
        return "Invalid input";
      case "invalid_element":
        return `Invalid value in ${issue.origin}`;
      default:
        return "Invalid input";
    }
  };
};
function en_default() {
  return {
    localeError: error()
  };
}
// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/core/registries.js
var _a3;
class $ZodRegistry2 {
  constructor() {
    this._map = /* @__PURE__ */ new WeakMap, this._idmap = /* @__PURE__ */ new Map;
  }
  add(schema, ..._meta) {
    let meta = _meta[0];
    if (this._map.set(schema, meta), meta && typeof meta === "object" && "id" in meta)
      this._idmap.set(meta.id, schema);
    return this;
  }
  clear() {
    return this._map = /* @__PURE__ */ new WeakMap, this._idmap = /* @__PURE__ */ new Map, this;
  }
  remove(schema) {
    let meta = this._map.get(schema);
    if (meta && typeof meta === "object" && "id" in meta)
      this._idmap.delete(meta.id);
    return this._map.delete(schema), this;
  }
  get(schema) {
    let p = schema._zod.parent;
    if (p) {
      let pm = { ...this.get(p) ?? {} };
      delete pm.id;
      let f = { ...pm, ...this._map.get(schema) };
      return Object.keys(f).length ? f : void 0;
    }
    return this._map.get(schema);
  }
  has(schema) {
    return this._map.has(schema);
  }
}
function registry2() {
  return new $ZodRegistry2;
}
(_a3 = globalThis).__zod_globalRegistry ?? (_a3.__zod_globalRegistry = registry2());
var globalRegistry2 = globalThis.__zod_globalRegistry;
// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/core/api.js
function snapshotChecks(def) {
  if (def.checks)
    def.checks = [...def.checks];
  return def;
}
function _string2(Class, params) {
  return new Class(snapshotChecks({ type: "string", ...normalizeParams2(params) }));
}
function _email2(Class, params) {
  return new Class({
    type: "string",
    format: "email",
    check: "string_format",
    abort: !1,
    ...normalizeParams2(params)
  });
}
function _guid2(Class, params) {
  return new Class({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: !1,
    ...normalizeParams2(params)
  });
}
function _uuid2(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    ...normalizeParams2(params)
  });
}
function _uuidv42(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v4",
    ...normalizeParams2(params)
  });
}
function _uuidv62(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v6",
    ...normalizeParams2(params)
  });
}
function _uuidv72(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v7",
    ...normalizeParams2(params)
  });
}
function _url2(Class, params) {
  return new Class({
    type: "string",
    format: "url",
    check: "string_format",
    abort: !1,
    ...normalizeParams2(params)
  });
}
function _emoji4(Class, params) {
  return new Class({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: !1,
    ...normalizeParams2(params)
  });
}
function _nanoid2(Class, params) {
  return new Class({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: !1,
    ...normalizeParams2(params)
  });
}
function _cuid3(Class, params) {
  return new Class({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: !1,
    ...normalizeParams2(params)
  });
}
function _cuid22(Class, params) {
  return new Class({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: !1,
    ...normalizeParams2(params)
  });
}
function _ulid2(Class, params) {
  return new Class({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: !1,
    ...normalizeParams2(params)
  });
}
function _xid2(Class, params) {
  return new Class({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: !1,
    ...normalizeParams2(params)
  });
}
function _ksuid2(Class, params) {
  return new Class({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: !1,
    ...normalizeParams2(params)
  });
}
function _ipv42(Class, params) {
  return new Class({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: !1,
    ...normalizeParams2(params)
  });
}
function _ipv62(Class, params) {
  return new Class({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: !1,
    ...normalizeParams2(params)
  });
}
function _cidrv42(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: !1,
    ...normalizeParams2(params)
  });
}
function _cidrv62(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: !1,
    ...normalizeParams2(params)
  });
}
function _base642(Class, params) {
  return new Class({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: !1,
    ...normalizeParams2(params)
  });
}
function _base64url2(Class, params) {
  return new Class({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: !1,
    ...normalizeParams2(params)
  });
}
function _e1642(Class, params) {
  return new Class({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: !1,
    ...normalizeParams2(params)
  });
}
function _jwt2(Class, params) {
  return new Class({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: !1,
    ...normalizeParams2(params)
  });
}
function _isoDateTime2(Class, params) {
  return new Class({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: !1,
    local: !1,
    precision: null,
    ...normalizeParams2(params)
  });
}
function _isoDate2(Class, params) {
  return new Class({
    type: "string",
    format: "date",
    check: "string_format",
    ...normalizeParams2(params)
  });
}
function _isoTime2(Class, params) {
  return new Class({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...normalizeParams2(params)
  });
}
function _isoDuration2(Class, params) {
  return new Class({
    type: "string",
    format: "duration",
    check: "string_format",
    ...normalizeParams2(params)
  });
}
function _number2(Class, params) {
  return new Class(snapshotChecks({ type: "number", checks: [], ...normalizeParams2(params) }));
}
function _int2(Class, params) {
  return new Class({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "safeint",
    ...normalizeParams2(params)
  });
}
function _boolean2(Class, params) {
  return new Class({
    type: "boolean",
    ...normalizeParams2(params)
  });
}
function _undefined4(Class, params) {
  return new Class({
    type: "undefined",
    ...normalizeParams2(params)
  });
}
function _null4(Class, params) {
  return new Class({
    type: "null",
    ...normalizeParams2(params)
  });
}
function _unknown2(Class) {
  return new Class({
    type: "unknown"
  });
}
function _never2(Class, params) {
  return new Class({
    type: "never",
    ...normalizeParams2(params)
  });
}
function _nan2(Class, params) {
  return new Class({
    type: "nan",
    ...normalizeParams2(params)
  });
}
function _lt2(value, params) {
  return new $ZodCheckLessThan2({
    check: "less_than",
    ...normalizeParams2(params),
    value,
    inclusive: !1
  });
}
function _lte2(value, params) {
  return new $ZodCheckLessThan2({
    check: "less_than",
    ...normalizeParams2(params),
    value,
    inclusive: !0
  });
}
function _gt2(value, params) {
  return new $ZodCheckGreaterThan2({
    check: "greater_than",
    ...normalizeParams2(params),
    value,
    inclusive: !1
  });
}
function _gte2(value, params) {
  return new $ZodCheckGreaterThan2({
    check: "greater_than",
    ...normalizeParams2(params),
    value,
    inclusive: !0
  });
}
function _multipleOf2(value, params) {
  return new $ZodCheckMultipleOf2({
    check: "multiple_of",
    ...normalizeParams2(params),
    value
  });
}
function _maxLength2(maximum, params) {
  return new $ZodCheckMaxLength2({
    check: "max_length",
    ...normalizeParams2(params),
    maximum
  });
}
function _minLength2(minimum, params) {
  return new $ZodCheckMinLength2({
    check: "min_length",
    ...normalizeParams2(params),
    minimum
  });
}
function _length2(length, params) {
  return new $ZodCheckLengthEquals2({
    check: "length_equals",
    ...normalizeParams2(params),
    length
  });
}
function _regex2(pattern, params) {
  return new $ZodCheckRegex2({
    check: "string_format",
    format: "regex",
    ...normalizeParams2(params),
    pattern
  });
}
function _lowercase2(params) {
  return new $ZodCheckLowerCase2({
    check: "string_format",
    format: "lowercase",
    ...normalizeParams2(params)
  });
}
function _uppercase2(params) {
  return new $ZodCheckUpperCase2({
    check: "string_format",
    format: "uppercase",
    ...normalizeParams2(params)
  });
}
function _includes2(includes, params) {
  return new $ZodCheckIncludes2({
    check: "string_format",
    format: "includes",
    ...normalizeParams2(params),
    includes
  });
}
function _startsWith2(prefix, params) {
  return new $ZodCheckStartsWith2({
    check: "string_format",
    format: "starts_with",
    ...normalizeParams2(params),
    prefix
  });
}
function _endsWith2(suffix, params) {
  return new $ZodCheckEndsWith2({
    check: "string_format",
    format: "ends_with",
    ...normalizeParams2(params),
    suffix
  });
}
function _overwrite2(tx) {
  return new $ZodCheckOverwrite2({
    check: "overwrite",
    tx
  });
}
function _normalize2(form) {
  return _overwrite2((input) => input.normalize(form));
}
function _trim2() {
  return _overwrite2((input) => input.trim());
}
function _toLowerCase2() {
  return _overwrite2((input) => input.toLowerCase());
}
function _toUpperCase2() {
  return _overwrite2((input) => input.toUpperCase());
}
function _slugify2() {
  return _overwrite2((input) => slugify2(input));
}
function _array2(Class, element, params) {
  return new Class({
    type: "array",
    element,
    ...normalizeParams2(params)
  });
}
function _refine2(Class, fn, _params) {
  return new Class({
    type: "custom",
    check: "custom",
    fn,
    ...normalizeParams2(_params)
  });
}
function _superRefine2(fn, params) {
  let ch = _check2((payload) => (payload.addIssue = (issue) => {
    if (typeof issue === "string")
      payload.issues.push(issue2(issue, payload.value, ch._zod.def));
    else {
      let _issue = issue;
      if (_issue.fatal)
        _issue.continue = !1;
      if (_issue.code ?? (_issue.code = "custom"), !("input" in _issue))
        _issue.input = payload.value;
      _issue.inst ?? (_issue.inst = ch), _issue.continue ?? (_issue.continue = !ch._zod.def.abort), payload.issues.push(issue2(_issue));
    }
  }, fn(payload.value, payload)), params);
  return ch;
}
function _check2(fn, params) {
  let ch = new $ZodCheck2({
    check: "custom",
    ...normalizeParams2(params)
  });
  return ch._zod.check = fn, ch;
}
// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/core/to-json-schema.js
function assignProps(target, ...sources) {
  for (let source of sources)
    for (let key of Reflect.ownKeys(source))
      if (Object.prototype.propertyIsEnumerable.call(source, key))
        assignProp2(target, key, source[key]);
  return target;
}
function initializeContext2(params) {
  let target = params?.target ?? "draft-2020-12";
  if (target === "draft-4")
    target = "draft-04";
  if (target === "draft-7")
    target = "draft-07";
  return {
    processors: params.processors ?? {},
    metadataRegistry: params?.metadata ?? globalRegistry2,
    target,
    unrepresentable: params?.unrepresentable ?? "throw",
    override: params?.override ?? (() => {}),
    io: params?.io ?? "output",
    counter: 0,
    seen: /* @__PURE__ */ new Map,
    sharedDefsExtractedFor: void 0,
    sharedEmitDoneFor: void 0,
    cycles: params?.cycles ?? "ref",
    reused: params?.reused ?? "inline",
    intersections: [],
    deferred: [],
    external: params?.external ?? void 0
  };
}
function handleUnrepresentable(schema, ctx, json, params, message) {
  let result = typeof ctx.unrepresentable === "function" ? ctx.unrepresentable({ zodSchema: schema, path: params.path, message }) : ctx.unrepresentable;
  if (result === "any")
    return !1;
  if (result === void 0 || result === "throw")
    throw Error(message);
  return Object.assign(json, result), !0;
}
function processSchema(schema, ctx, _params = { path: [], schemaPath: [] }) {
  var _a;
  let def = schema._zod.def, seen = ctx.seen.get(schema);
  if (seen) {
    if (seen.count++, _params.schemaPath.includes(schema))
      seen.cycle = _params.path;
    return seen.schema;
  }
  let result = { schema: {}, count: 1, cycle: void 0, path: _params.path };
  ctx.seen.set(schema, result), ctx.sharedDefsExtractedFor = void 0, ctx.sharedEmitDoneFor = void 0;
  let overrideSchema = schema._zod.toJSONSchema?.();
  if (overrideSchema)
    result.schema = overrideSchema;
  else {
    let params = {
      ..._params,
      schemaPath: [..._params.schemaPath, schema],
      path: _params.path
    };
    if (schema._zod.processJSONSchema)
      schema._zod.processJSONSchema(ctx, result.schema, params);
    else {
      let _json = result.schema, processor = ctx.processors[def.type];
      if (!processor)
        throw Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
      processor(schema, ctx, _json, params);
    }
    let parent = schema._zod.parent;
    if (parent) {
      if (!result.ref)
        result.ref = parent;
      processSchema(parent, ctx, params), ctx.seen.get(parent).isParent = !0;
    }
  }
  let meta = ctx.metadataRegistry.get(schema);
  if (meta)
    assignProps(result.schema, meta);
  if (ctx.io === "input" && isTransforming2(schema))
    delete result.schema.examples, delete result.schema.default;
  if (ctx.io === "input" && "_prefault" in result.schema)
    (_a = result.schema).default ?? (_a.default = result.schema._prefault);
  return delete result.schema._prefault, ctx.seen.get(schema).schema;
}
function encodeJSONPointerSegment(segment) {
  return segment.replace(/~/g, "~0").replace(/\//g, "~1");
}
function extractDefs2(ctx, schema) {
  let root = ctx.seen.get(schema);
  if (!root)
    throw Error("Unprocessed schema. This is a bug in Zod.");
  if (ctx.external && ctx.sharedDefsExtractedFor === ctx.external)
    return;
  let idToSchema = /* @__PURE__ */ new Map;
  for (let entry of ctx.seen.entries()) {
    let id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      let existing = idToSchema.get(id);
      if (existing && existing !== entry[0])
        throw Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      idToSchema.set(id, entry[0]);
    }
  }
  let makeURI = (entry) => {
    let defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
    if (ctx.external) {
      let externalId = ctx.external.registry.get(entry[0])?.id, uriGenerator = ctx.external.uri ?? ((id) => id);
      if (externalId)
        return { ref: uriGenerator(externalId) };
      let id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
      return entry[1].defId = id, { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${encodeJSONPointerSegment(id)}` };
    }
    let uriPrefix = "#", defUriPrefix = `${uriPrefix}/${defsSegment}/`;
    if (entry[1] === root && !entry[1].schema.id)
      return { ref: uriPrefix };
    let defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
    return { defId, ref: defUriPrefix + encodeJSONPointerSegment(defId) };
  }, extractToDef = (entry) => {
    if (entry[1].schema.$ref)
      return;
    let seen = entry[1], { ref, defId } = makeURI(entry);
    if (seen.def = { ...seen.schema }, defId)
      seen.defId = defId;
    let schema = seen.schema;
    for (let key in schema)
      delete schema[key];
    schema.$ref = ref;
  };
  if (ctx.cycles === "throw")
    for (let entry of ctx.seen.entries()) {
      let seen = entry[1];
      if (seen.cycle)
        throw Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
    }
  for (let entry of ctx.seen.entries()) {
    let seen = entry[1];
    if (schema === entry[0]) {
      extractToDef(entry);
      continue;
    }
    if (ctx.external) {
      let ext = ctx.external.registry.get(entry[0])?.id;
      if (schema !== entry[0] && ext) {
        extractToDef(entry);
        continue;
      }
    }
    if (ctx.metadataRegistry.get(entry[0])?.id) {
      extractToDef(entry);
      continue;
    }
    if (seen.cycle) {
      extractToDef(entry);
      continue;
    }
    if (seen.count > 1) {
      if (ctx.reused === "ref")
        extractToDef(entry);
    }
  }
  if (ctx.external)
    ctx.sharedDefsExtractedFor = ctx.external;
}
function compactTypeUnion(schema) {
  let options = schema.anyOf;
  if (!Array.isArray(options) || options.length === 0 || schema.type !== void 0)
    return;
  let types = [];
  for (let option of options) {
    if (!option || typeof option !== "object")
      return;
    compactTypeUnion(option);
    let keys = Object.keys(option);
    if (keys.length !== 1 || keys[0] !== "type")
      return;
    let type = option.type;
    for (let member of Array.isArray(type) ? type : [type]) {
      if (typeof member !== "string")
        return;
      if (!types.includes(member))
        types.push(member);
    }
  }
  delete schema.anyOf, schema.type = types.length === 1 ? types[0] : types;
}
var FOLDABLE_KEYS = /* @__PURE__ */ new Set(["type", "properties", "required", "additionalProperties"]), UNION_KEYS = ["oneOf", "anyOf"];
function undeclaredConstraint(member) {
  let extra = member.additionalProperties;
  if (extra === void 0 || extra === !1 || typeof extra !== "object" || extra === null)
    return null;
  return Object.keys(extra).length ? extra : null;
}
function foldObjects(members) {
  let objects = [];
  for (let member of members) {
    if (typeof member !== "object" || member.type !== "object")
      return null;
    for (let key in member)
      if (!FOLDABLE_KEYS.has(key))
        return null;
    objects.push(member);
  }
  let properties = {}, required = /* @__PURE__ */ new Set;
  for (let object of objects) {
    for (let key in object.properties) {
      if (Object.prototype.hasOwnProperty.call(properties, key))
        continue;
      let parts = [];
      for (let other of objects) {
        let part = other.properties?.[key] ?? undeclaredConstraint(other);
        if (part === null || part === void 0)
          continue;
        if (!parts.some((seen) => JSON.stringify(seen) === JSON.stringify(part)))
          parts.push(part);
      }
      let merged = parts.length === 1 ? parts[0] : foldObjects(parts) ?? { allOf: parts };
      assignProp2(properties, key, merged);
    }
    for (let key of object.required ?? [])
      required.add(key);
  }
  let folded = { type: "object", properties };
  if (required.size)
    folded.required = [...required];
  if (objects.every((object) => object.additionalProperties === !1))
    folded.additionalProperties = !1;
  else {
    let constraints = [];
    for (let object of objects) {
      let constraint = undeclaredConstraint(object);
      if (constraint && !constraints.some((seen) => JSON.stringify(seen) === JSON.stringify(constraint)))
        constraints.push(constraint);
    }
    if (constraints.length === 1)
      folded.additionalProperties = constraints[0];
    else if (constraints.length > 1)
      folded.additionalProperties = { allOf: constraints };
  }
  return folded;
}
function foldIntersection(json) {
  let allOf = json.allOf;
  if (!Array.isArray(allOf) || allOf.length < 2)
    return;
  for (let key of FOLDABLE_KEYS)
    if (key in json)
      return;
  let unions = allOf.filter((m) => UNION_KEYS.some((k) => Array.isArray(m[k]))), folded = null;
  if (!unions.length)
    folded = foldObjects(allOf);
  else {
    let union = unions[0], keyword = UNION_KEYS.find((k) => Array.isArray(union[k]));
    if (Object.keys(union).length !== 1)
      return;
    let rest = allOf.filter((m) => m !== union), branches = union[keyword].map((branch) => foldObjects([...rest, branch]));
    if (branches.some((b) => !b))
      return;
    folded = { [keyword]: branches };
  }
  if (!folded)
    return;
  delete json.allOf, assignProps(json, folded);
}
function finalize2(ctx, schema) {
  let root = ctx.seen.get(schema);
  if (!root)
    throw Error("Unprocessed schema. This is a bug in Zod.");
  let flattenRef = (zodSchema) => {
    let seen = ctx.seen.get(zodSchema);
    if (seen.ref === null)
      return;
    let schema = seen.def ?? seen.schema, _cached = { ...schema }, ref = seen.ref;
    if (seen.ref = null, ref) {
      flattenRef(ref);
      let refSeen = ctx.seen.get(ref), refSchema = refSeen.schema;
      if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0"))
        schema.allOf = schema.allOf ?? [], schema.allOf.push(refSchema);
      else
        assignProps(schema, refSchema);
      if (assignProps(schema, _cached), zodSchema._zod.parent === ref)
        for (let key in schema) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (!(key in _cached))
            delete schema[key];
        }
      if (refSchema.$ref && refSeen.def)
        for (let key in schema) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key]))
            delete schema[key];
        }
    }
    let parent = zodSchema._zod.parent;
    if (parent && parent !== ref) {
      flattenRef(parent);
      let parentSeen = ctx.seen.get(parent);
      if (parentSeen?.schema.$ref) {
        if (schema.$ref = parentSeen.schema.$ref, parentSeen.def)
          for (let key in schema) {
            if (key === "$ref" || key === "allOf")
              continue;
            if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key]))
              delete schema[key];
          }
      }
    }
    ctx.override({
      zodSchema,
      jsonSchema: schema,
      path: seen.path ?? []
    });
  };
  if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) {
    for (let entry of [...ctx.seen.entries()].reverse())
      flattenRef(entry[0]);
    if (ctx.target !== "openapi-3.0")
      for (let entry of ctx.seen.entries())
        compactTypeUnion(entry[1].def ?? entry[1].schema);
    for (let rewrite of ctx.deferred)
      rewrite();
    if (ctx.intersections.length) {
      let carriers = /* @__PURE__ */ new Map;
      for (let seen of ctx.seen.values())
        for (let json of [seen.schema, seen.def]) {
          let allOf = json?.allOf;
          if (!Array.isArray(allOf))
            continue;
          let existing = carriers.get(allOf);
          if (existing)
            existing.push(json);
          else
            carriers.set(allOf, [json]);
        }
      for (let allOf of ctx.intersections)
        for (let json of carriers.get(allOf) ?? [])
          foldIntersection(json);
    }
  }
  let result = {};
  if (ctx.target === "draft-2020-12")
    result.$schema = "https://json-schema.org/draft/2020-12/schema";
  else if (ctx.target === "draft-07")
    result.$schema = "http://json-schema.org/draft-07/schema#";
  else if (ctx.target === "draft-04")
    result.$schema = "http://json-schema.org/draft-04/schema#";
  else if (ctx.target === "openapi-3.0")
    ;
  if (ctx.external?.uri) {
    let id = ctx.external.registry.get(schema)?.id;
    if (!id)
      throw Error("Schema is missing an `id` property");
    result.$id = ctx.external.uri(id);
  }
  assignProps(result, root.defId ? root.schema : root.def ?? root.schema);
  let rootMetaId = ctx.metadataRegistry.get(schema)?.id;
  if (rootMetaId !== void 0 && result.id === rootMetaId)
    delete result.id;
  let defs = ctx.external?.defs ?? {};
  if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external)
    for (let entry of ctx.seen.entries()) {
      let seen = entry[1];
      if (seen.def && seen.defId) {
        if (seen.def.id === seen.defId)
          delete seen.def.id;
        assignProp2(defs, seen.defId, seen.def);
      }
    }
  if (ctx.external)
    ctx.sharedEmitDoneFor = ctx.external;
  if (ctx.external)
    ;
  else if (Object.keys(defs).length > 0)
    if (ctx.target === "draft-2020-12")
      result.$defs = defs;
    else
      result.definitions = defs;
  try {
    let finalized = JSON.parse(JSON.stringify(result));
    return Object.defineProperty(finalized, "~standard", {
      value: {
        ...schema["~standard"],
        jsonSchema: {
          input: createStandardJSONSchemaMethod2(schema, "input", ctx.processors),
          output: createStandardJSONSchemaMethod2(schema, "output", ctx.processors)
        }
      },
      enumerable: !1,
      writable: !1
    }), finalized;
  } catch (_err) {
    throw Error("Error converting schema to JSON.");
  }
}
function isTransforming2(_schema, _ctx) {
  let ctx = _ctx ?? { seen: /* @__PURE__ */ new Set };
  if (ctx.seen.has(_schema))
    return !1;
  ctx.seen.add(_schema);
  let def = _schema._zod.def;
  if (def.type === "transform")
    return !0;
  if (def.type === "array")
    return isTransforming2(def.element, ctx);
  if (def.type === "set")
    return isTransforming2(def.valueType, ctx);
  if (def.type === "lazy")
    return isTransforming2(def.getter(), ctx);
  if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault" || def.type === "catch")
    return isTransforming2(def.innerType, ctx);
  if (def.type === "intersection")
    return isTransforming2(def.left, ctx) || isTransforming2(def.right, ctx);
  if (def.type === "record" || def.type === "map")
    return isTransforming2(def.keyType, ctx) || isTransforming2(def.valueType, ctx);
  if (def.type === "pipe") {
    if (_schema._zod.traits.has("$ZodCodec"))
      return !0;
    return isTransforming2(def.in, ctx) || isTransforming2(def.out, ctx);
  }
  if (def.type === "object") {
    for (let key in def.shape)
      if (isTransforming2(def.shape[key], ctx))
        return !0;
    return !1;
  }
  if (def.type === "union") {
    for (let option of def.options)
      if (isTransforming2(option, ctx))
        return !0;
    return !1;
  }
  if (def.type === "tuple") {
    for (let item of def.items)
      if (isTransforming2(item, ctx))
        return !0;
    if (def.rest && isTransforming2(def.rest, ctx))
      return !0;
    return !1;
  }
  return !1;
}
var createToJSONSchemaMethod2 = (schema, processors = {}) => (params) => {
  let ctx = initializeContext2({ ...params, processors });
  return processSchema(schema, ctx), extractDefs2(ctx, schema), finalize2(ctx, schema);
}, createStandardJSONSchemaMethod2 = (schema, io, processors = {}) => (params) => {
  let { libraryOptions, target } = params ?? {}, ctx = initializeContext2({ ...libraryOptions ?? {}, target, io, processors });
  return processSchema(schema, ctx), extractDefs2(ctx, schema), finalize2(ctx, schema);
};
// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/core/json-schema-processors.js
var narrowMin = (agg, key, value) => {
  if (agg[key] === void 0 || value > agg[key])
    agg[key] = value;
}, narrowMax = (agg, key, value) => {
  if (agg[key] === void 0 || value < agg[key])
    agg[key] = value;
}, narrowBoth = (agg, value) => {
  narrowMin(agg, "minimum", value), narrowMax(agg, "maximum", value);
}, addDivisor = (agg, value) => {
  if (agg.multipleOf ?? (agg.multipleOf = []), !agg.multipleOf.includes(value))
    agg.multipleOf.push(value);
}, addPattern = (agg, pattern) => {
  agg.patterns ?? (agg.patterns = /* @__PURE__ */ new Set), agg.patterns.add(pattern);
}, intersectMime = (agg, mime) => {
  agg.mime = agg.mime ? agg.mime.filter((m) => mime.includes(m)) : [...mime];
}, setFormat = (agg, format) => {
  if (agg.format = format, format.includes("int"))
    agg.isInt = !0;
}, minContributor = (agg, def) => narrowMin(agg, "minimum", def.minimum), maxContributor = (agg, def) => narrowMax(agg, "maximum", def.maximum), formatContributor = (ranges) => (agg, def) => {
  setFormat(agg, def.format);
  let [minimum, maximum] = ranges[def.format];
  narrowMin(agg, "minimum", minimum), narrowMax(agg, "maximum", maximum);
}, contributors = {
  greater_than: (agg, def) => narrowMin(agg, def.inclusive ? "minimum" : "exclusiveMinimum", def.value),
  less_than: (agg, def) => narrowMax(agg, def.inclusive ? "maximum" : "exclusiveMaximum", def.value),
  multiple_of: (agg, def) => addDivisor(agg, def.value),
  number_format: formatContributor(NUMBER_FORMAT_RANGES2),
  bigint_format: formatContributor(BIGINT_FORMAT_RANGES2),
  min_length: minContributor,
  max_length: maxContributor,
  length_equals: (agg, def) => narrowBoth(agg, def.length),
  min_size: minContributor,
  max_size: maxContributor,
  size_equals: (agg, def) => narrowBoth(agg, def.size),
  string_format: (agg, def) => {
    if (setFormat(agg, def.format), def.pattern)
      addPattern(agg, def.pattern);
    if (def.format === "base64" || def.format === "base64url")
      agg.contentEncoding = def.format;
    if (def.local || def.precision === -1)
      agg.laxFormat = !0;
  },
  mime_type: (agg, def) => intersectMime(agg, def.mime)
};
function aggregateChecks(schema) {
  let agg = {}, def = schema._zod.def, list = schema._zod.traits.has("$ZodCheck") ? [schema, ...def.checks ?? []] : def.checks ?? [];
  for (let ch of list)
    contributors[ch._zod.def.check]?.(agg, ch._zod.def);
  let bag = schema._zod.bag;
  if (bag.minimum !== void 0)
    narrowMin(agg, "minimum", bag.minimum);
  if (bag.exclusiveMinimum !== void 0)
    narrowMin(agg, "exclusiveMinimum", bag.exclusiveMinimum);
  if (bag.maximum !== void 0)
    narrowMax(agg, "maximum", bag.maximum);
  if (bag.exclusiveMaximum !== void 0)
    narrowMax(agg, "exclusiveMaximum", bag.exclusiveMaximum);
  if (bag.multipleOf !== void 0)
    addDivisor(agg, bag.multipleOf);
  if (bag.format !== void 0) {
    if (agg.format ?? (agg.format = bag.format), bag.format.includes("int"))
      agg.isInt = !0;
  }
  if (bag.mime)
    intersectMime(agg, bag.mime);
  for (let pattern of bag.patterns ?? [])
    addPattern(agg, pattern);
  return agg;
}
var formatMap2 = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
}, exactPatterns = /* @__PURE__ */ new Map([
  [base64Charset, base642],
  [base64urlCharset, base64url2]
]), exactPattern = (p) => exactPatterns.get(p) ?? p, stringProcessor2 = (schema, ctx, _json, _params) => {
  let json = _json;
  json.type = "string";
  let { minimum, maximum, format, patterns, contentEncoding, laxFormat } = aggregateChecks(schema);
  if (typeof minimum === "number")
    json.minLength = minimum;
  if (typeof maximum === "number")
    json.maxLength = maximum;
  if (format) {
    if (json.format = formatMap2[format] ?? format, json.format === "")
      delete json.format;
    if (format === "time" || laxFormat)
      delete json.format;
  }
  if (contentEncoding)
    json.contentEncoding = contentEncoding;
  if (patterns && patterns.size > 0) {
    let patternList = [...patterns].map(exactPattern);
    if (patternList.length === 1)
      json.pattern = patternList[0].source;
    else if (patternList.length > 1)
      json.allOf = [
        ...patternList.map((regex) => ({
          ...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
          pattern: regex.source
        }))
      ];
  }
}, numberProcessor2 = (schema, ctx, _json, params) => {
  let json = _json, { minimum, maximum, multipleOf, exclusiveMaximum, exclusiveMinimum, isInt } = aggregateChecks(schema);
  json.type = isInt ? "integer" : "number";
  let exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY), exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY), legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
  if (exMin)
    if (legacy)
      json.minimum = exclusiveMinimum, json.exclusiveMinimum = !0;
    else
      json.exclusiveMinimum = exclusiveMinimum;
  else if (typeof minimum === "number")
    json.minimum = minimum;
  if (exMax)
    if (legacy)
      json.maximum = exclusiveMaximum, json.exclusiveMaximum = !0;
    else
      json.exclusiveMaximum = exclusiveMaximum;
  else if (typeof maximum === "number")
    json.maximum = maximum;
  if (multipleOf) {
    let divisors = /* @__PURE__ */ new Set;
    for (let divisor of multipleOf)
      if (Number.isFinite(divisor) && divisor !== 0)
        divisors.add(Math.abs(divisor));
      else
        handleUnrepresentable(schema, ctx, json, params, `A multipleOf divisor of ${divisor} cannot be represented in JSON Schema`);
    let [first, ...rest] = divisors;
    if (first !== void 0)
      json.multipleOf = first;
    if (rest.length)
      json.allOf = [...json.allOf ?? [], ...rest.map((m) => ({ multipleOf: m }))];
  }
}, booleanProcessor2 = (_schema, _ctx, json, _params) => {
  json.type = "boolean";
};
var nullProcessor2 = (_schema, ctx, json, _params) => {
  if (ctx.target === "openapi-3.0")
    json.type = "string", json.nullable = !0, json.enum = [null];
  else
    json.type = "null";
}, undefinedProcessor2 = (schema, ctx, json, params) => {
  handleUnrepresentable(schema, ctx, json, params, "Undefined cannot be represented in JSON Schema");
};
var neverProcessor2 = (_schema, _ctx, json, _params) => {
  json.not = {};
};
var unknownProcessor2 = (_schema, _ctx, _json, _params) => {};
var enumProcessor2 = (schema, _ctx, json, _params) => {
  let def = schema._zod.def, values = getEnumValues2(def.entries);
  if (values.length === 0) {
    json.not = {};
    return;
  }
  if (values.every((v) => typeof v === "number"))
    json.type = "number";
  if (values.every((v) => typeof v === "string"))
    json.type = "string";
  json.enum = values;
}, literalProcessor2 = (schema, ctx, json, params) => {
  let def = schema._zod.def;
  if (def.values.length === 0) {
    json.not = {};
    return;
  }
  let vals = [];
  for (let val of def.values)
    if (val === void 0) {
      if (handleUnrepresentable(schema, ctx, json, params, "Literal `undefined` cannot be represented in JSON Schema"))
        return;
    } else if (typeof val === "bigint") {
      if (handleUnrepresentable(schema, ctx, json, params, "BigInt literals cannot be represented in JSON Schema"))
        return;
      vals.push(Number(val));
    } else
      vals.push(val);
  if (vals.length === 0)
    ;
  else if (vals.length === 1) {
    let val = vals[0];
    if (json.type = val === null ? "null" : typeof val, ctx.target === "draft-04" || ctx.target === "openapi-3.0")
      json.enum = [val];
    else
      json.const = val;
  } else {
    if (vals.every((v) => typeof v === "number"))
      json.type = "number";
    if (vals.every((v) => typeof v === "string"))
      json.type = "string";
    if (vals.every((v) => typeof v === "boolean"))
      json.type = "boolean";
    if (vals.every((v) => v === null))
      json.type = "null";
    json.enum = vals;
  }
}, nanProcessor2 = (schema, ctx, json, params) => {
  handleUnrepresentable(schema, ctx, json, params, "NaN cannot be represented in JSON Schema");
};
var customProcessor2 = (schema, ctx, json, params) => {
  handleUnrepresentable(schema, ctx, json, params, "Custom types cannot be represented in JSON Schema");
};
var transformProcessor2 = (schema, ctx, json, params) => {
  handleUnrepresentable(schema, ctx, json, params, "Transforms cannot be represented in JSON Schema");
};
var arrayProcessor2 = (schema, ctx, _json, params) => {
  let json = _json, def = schema._zod.def, { minimum, maximum } = aggregateChecks(schema);
  if (typeof minimum === "number")
    json.minItems = minimum;
  if (typeof maximum === "number")
    json.maxItems = maximum;
  json.type = "array", json.items = processSchema(def.element, ctx, {
    ...params,
    path: [...params.path, "items"]
  });
};
function inputOptin(schema) {
  let def = schema._zod.def;
  if (def.type === "pipe" && def.in._zod.traits.has("$ZodTransform"))
    return inputOptin(def.out);
  if (def.type === "catch")
    return inputOptin(def.innerType);
  return schema._zod.optin;
}
var objectProcessor2 = (schema, ctx, _json, params) => {
  let json = _json, def = schema._zod.def, shape = def.shape;
  if (Object.getOwnPropertySymbols(shape).length && handleUnrepresentable(schema, ctx, json, params, "Symbol keys cannot be represented in JSON Schema"))
    return;
  json.type = "object", json.properties = {};
  for (let key in shape)
    assignProp2(json.properties, key, processSchema(shape[key], ctx, {
      ...params,
      path: [...params.path, "properties", key]
    }));
  let requiredKeys = [];
  for (let key of Object.keys(shape)) {
    let field = def.shape[key];
    if (ctx.io === "input" ? inputOptin(field) === void 0 : field._zod.optout === void 0)
      requiredKeys.push(key);
  }
  if (requiredKeys.length > 0)
    json.required = requiredKeys;
  if (def.catchall?._zod.def.type === "never")
    json.additionalProperties = !1;
  else if (!def.catchall) {
    if (ctx.io === "output")
      json.additionalProperties = !1;
  } else if (def.catchall)
    json.additionalProperties = processSchema(def.catchall, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
}, unionProcessor2 = (schema, ctx, json, params) => {
  let def = schema._zod.def, isExclusive = def.inclusive === !1, options = def.options.map((x, i) => processSchema(x, ctx, {
    ...params,
    path: [...params.path, isExclusive ? "oneOf" : "anyOf", i]
  }));
  if (isExclusive)
    json.oneOf = options;
  else
    json.anyOf = options;
}, intersectionProcessor2 = (schema, ctx, json, params) => {
  let def = schema._zod.def, a = processSchema(def.left, ctx, {
    ...params,
    path: [...params.path, "allOf", 0]
  }), b = processSchema(def.right, ctx, {
    ...params,
    path: [...params.path, "allOf", 1]
  }), isSimpleIntersection = (val) => ("allOf" in val) && Object.keys(val).length === 1, allOf = [
    ...isSimpleIntersection(a) ? a.allOf : [a],
    ...isSimpleIntersection(b) ? b.allOf : [b]
  ];
  json.allOf = allOf, ctx.intersections.push(allOf);
};
function stringifyKeyNames(bySchema, json, visited) {
  if (json.$ref) {
    if (visited.has(json))
      return json;
    visited.add(json);
    let def = bySchema.get(json)?.def;
    if (!def)
      return json;
    let inlined = stringifyKeyNames(bySchema, def, visited);
    return inlined === def ? json : inlined;
  }
  for (let keyword of ["anyOf", "oneOf"]) {
    let branches = json[keyword];
    if (!Array.isArray(branches))
      continue;
    let mapped = branches.map((branch) => stringifyKeyNames(bySchema, branch, visited));
    if (mapped.some((branch, i) => branch !== branches[i]))
      json = { ...json, [keyword]: mapped };
  }
  let types = Array.isArray(json.type) ? json.type : [json.type], numericType = !types.includes("string") && types.some((t) => t === "number" || t === "integer"), values = json.enum ?? (json.const !== void 0 ? [json.const] : void 0);
  if (!numericType && !values?.some((v) => typeof v === "number"))
    return json;
  let { minimum, maximum, exclusiveMinimum, exclusiveMaximum, multipleOf, format, id, ...rest } = json;
  if (rest.enum)
    rest.enum = rest.enum.map((v) => typeof v === "number" ? String(v) : v);
  else if (typeof rest.const === "number")
    rest.const = String(rest.const);
  if (!numericType)
    return rest;
  if (rest.type = "string", !values)
    rest.pattern = (types.includes("number") ? number3 : integer2).source;
  return rest;
}
var pendingRecords = /* @__PURE__ */ new WeakMap;
function rewriteKeyNames(ctx) {
  let bySchema = /* @__PURE__ */ new Map;
  for (let entry of ctx.seen.values())
    if (entry.def && !bySchema.has(entry.schema))
      bySchema.set(entry.schema, entry);
  let rewrites = /* @__PURE__ */ new Map;
  for (let record of pendingRecords.get(ctx) ?? []) {
    let seen = ctx.seen.get(record), names = (seen?.def ?? seen?.schema)?.propertyNames;
    if (!names || names === !0 || rewrites.has(names))
      continue;
    let rewritten = stringifyKeyNames(bySchema, names, /* @__PURE__ */ new Set);
    if (rewritten !== names)
      rewrites.set(names, rewritten);
  }
  if (!rewrites.size)
    return;
  for (let entry of ctx.seen.values())
    for (let carrier of [entry.schema, entry.def]) {
      let rewritten = carrier && rewrites.get(carrier.propertyNames);
      if (rewritten)
        carrier.propertyNames = rewritten;
    }
}
var recordProcessor2 = (schema, ctx, _json, params) => {
  let json = _json, def = schema._zod.def;
  json.type = "object";
  let keyType = def.keyType, patterns = aggregateChecks(keyType).patterns;
  if (def.mode === "loose" && patterns && patterns.size > 0) {
    let valueSchema = processSchema(def.valueType, ctx, {
      ...params,
      path: [...params.path, "patternProperties", "*"]
    });
    json.patternProperties = {};
    for (let pattern of patterns)
      assignProp2(json.patternProperties, exactPattern(pattern).source, valueSchema);
  } else {
    if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") {
      json.propertyNames = processSchema(def.keyType, ctx, {
        ...params,
        path: [...params.path, "propertyNames"]
      });
      let pending = pendingRecords.get(ctx);
      if (!pending)
        pending = [], pendingRecords.set(ctx, pending), ctx.deferred.push(() => rewriteKeyNames(ctx));
      pending.push(schema);
    }
    json.additionalProperties = processSchema(def.valueType, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
  let keyValues = keyType._zod.values, omittableOnInput = ctx.io === "input" && inputOptin(def.valueType) !== void 0;
  if (keyValues && !def.partial && !omittableOnInput) {
    let validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
    if (validKeyValues.length > 0)
      json.required = validKeyValues.map(String);
  }
}, nullableProcessor2 = (schema, ctx, json, params) => {
  let def = schema._zod.def, inner = processSchema(def.innerType, ctx, params), seen = ctx.seen.get(schema);
  if (ctx.target === "openapi-3.0")
    seen.ref = def.innerType, json.nullable = !0;
  else
    json.anyOf = [inner, { type: "null" }];
}, nonoptionalProcessor2 = (schema, ctx, _json, params) => {
  let def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
}, UNREPRESENTABLE_DEFAULT = Symbol();
function serializeDefaultValue(value, schema, ctx, json, params) {
  let unrepresentable = !1, serialized = JSON.stringify(value, (_, val) => {
    if (typeof val !== "bigint")
      return val;
    return unrepresentable = !0, null;
  });
  if (!unrepresentable)
    return JSON.parse(serialized);
  return handleUnrepresentable(schema, ctx, json, params, "BigInt defaults cannot be represented in JSON Schema"), UNREPRESENTABLE_DEFAULT;
}
var defaultProcessor2 = (schema, ctx, json, params) => {
  let def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  let value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
  if (value !== UNREPRESENTABLE_DEFAULT)
    json.default = value;
}, prefaultProcessor2 = (schema, ctx, json, params) => {
  let def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  if (seen.ref = def.innerType, ctx.io !== "input")
    return;
  let value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
  if (value !== UNREPRESENTABLE_DEFAULT)
    json._prefault = value;
}, catchProcessor2 = (schema, ctx, json, params) => {
  let def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  let catchValue;
  try {
    catchValue = def.catchValue(void 0);
  } catch {
    handleUnrepresentable(schema, ctx, json, params, "Dynamic catch values are not supported in JSON Schema");
    return;
  }
  json.default = catchValue;
}, pipeProcessor2 = (schema, ctx, _json, params) => {
  let def = schema._zod.def, inIsTransform = def.in._zod.traits.has("$ZodTransform"), innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
  processSchema(innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  seen.ref = innerType;
}, readonlyProcessor2 = (schema, ctx, json, params) => {
  let def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  seen.ref = def.innerType, json.readOnly = !0;
};
var optionalProcessor2 = (schema, ctx, _json, params) => {
  let def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
}, lazyProcessor2 = (schema, ctx, _json, params) => {
  let innerType = schema._zod.innerType;
  processSchema(innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  seen.ref = innerType;
};
// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/classic/errors.js
var _installedErrorProtos = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
function _lazyMethod(proto, key, make) {
  Object.defineProperty(proto, key, {
    configurable: !0,
    enumerable: !1,
    get() {
      let value = make(this);
      return Object.defineProperty(this, key, { value, configurable: !0, writable: !0 }), value;
    },
    set(value) {
      Object.defineProperty(this, key, { value, configurable: !0, writable: !0 });
    }
  });
}
var initializer4 = (inst, issues) => {
  $ZodError2.init(inst, issues), inst.name = "ZodError";
  let proto = Object.getPrototypeOf(inst);
  if (_installedErrorProtos.has(proto))
    return;
  _installedErrorProtos.add(proto), _lazyMethod(proto, "format", (self) => (mapper) => formatError2(self, mapper)), _lazyMethod(proto, "flatten", (self) => (mapper) => flattenError2(self, mapper)), _lazyMethod(proto, "addIssue", (self) => (issue) => {
    self.issues.push(issue), self.message = JSON.stringify(self.issues, jsonStringifyReplacer2, 2);
  }), _lazyMethod(proto, "addIssues", (self) => (issues) => {
    self.issues.push(...issues), self.message = JSON.stringify(self.issues, jsonStringifyReplacer2, 2);
  }), Object.defineProperty(proto, "isEmpty", {
    configurable: !0,
    enumerable: !1,
    get() {
      return this.issues.length === 0;
    }
  });
};
var ZodRealError2 = /* @__PURE__ */ $constructor2("ZodError", initializer4, void 0, {
  Parent: Error
});

// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/classic/parse.js
var parse5 = /* @__PURE__ */ _parse2(ZodRealError2), parseAsync3 = /* @__PURE__ */ _parseAsync2(ZodRealError2), safeParse3 = /* @__PURE__ */ _safeParse2(ZodRealError2), safeParseAsync3 = /* @__PURE__ */ _safeParseAsync2(ZodRealError2), encode2 = /* @__PURE__ */ _encode2(ZodRealError2), decode2 = /* @__PURE__ */ _decode2(ZodRealError2), encodeAsync2 = /* @__PURE__ */ _encodeAsync2(ZodRealError2), decodeAsync2 = /* @__PURE__ */ _decodeAsync2(ZodRealError2), safeEncode2 = /* @__PURE__ */ _safeEncode2(ZodRealError2), safeDecode2 = /* @__PURE__ */ _safeDecode2(ZodRealError2), safeEncodeAsync2 = /* @__PURE__ */ _safeEncodeAsync2(ZodRealError2), safeDecodeAsync2 = /* @__PURE__ */ _safeDecodeAsync2(ZodRealError2);

// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/classic/schemas.js
function _ensureDefaultLocale() {
  if (!globalConfig2.localeError)
    config2(en_default());
}
function _ensureDefaultMemoizer() {
  if (!globalConfig2.memoizer)
    config2({ memoizer: memoizer() });
}
var ZodType2 = /* @__PURE__ */ $constructor2("ZodType", (inst, def) => (_ensureDefaultLocale(), $ZodType2.init(inst, def), inst.def = def, inst.type = def.type, inst), {
  check(...chks) {
    let def = this.def;
    return this.clone(mergeDefs2(def, {
      checks: [
        ...def.checks ?? [],
        ...chks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
      ]
    }), { parent: !0 });
  },
  with(...chks) {
    return this.check(...chks);
  },
  clone(def, params) {
    return clone2(this, def, params);
  },
  brand() {
    return this;
  },
  register(reg, meta) {
    return reg.add(this, meta), this;
  },
  refine(check, params) {
    return this.check(refine2(check, params));
  },
  superRefine(refinement, params) {
    return this.check(superRefine2(refinement, params));
  },
  overwrite(fn) {
    return this.check(_overwrite2(fn));
  },
  optional() {
    return optional2(this);
  },
  exactOptional() {
    return exactOptional2(this);
  },
  nullable() {
    return nullable2(this);
  },
  nullish() {
    return optional2(nullable2(this));
  },
  nonoptional(params) {
    return nonoptional2(this, params);
  },
  array() {
    return array2(this);
  },
  or(arg) {
    return union2([this, arg]);
  },
  and(arg) {
    return intersection2(this, arg);
  },
  transform(tx) {
    return pipe2(this, transform2(tx));
  },
  default(d) {
    return _default2(this, d);
  },
  prefault(d) {
    return prefault2(this, d);
  },
  catch(params) {
    return _catch2(this, params);
  },
  pipe(target) {
    return pipe2(this, target);
  },
  readonly() {
    return readonly2(this);
  },
  describe(description) {
    let cl = this.clone();
    return globalRegistry2.add(cl, { description }), cl;
  },
  meta(...args) {
    if (args.length === 0)
      return globalRegistry2.get(this);
    let cl = this.clone();
    return globalRegistry2.add(cl, args[0]), cl;
  },
  isOptional() {
    return this.safeParse(void 0).success;
  },
  isNullable() {
    return this.safeParse(null).success;
  },
  apply(fn, ...args) {
    return args.length === 0 ? fn(this) : fn(this, ...args);
  },
  get "~standard"() {
    return hide(this, "~standard", {
      ...standardProps(this),
      jsonSchema: {
        input: createStandardJSONSchemaMethod2(this, "input"),
        output: createStandardJSONSchemaMethod2(this, "output")
      }
    });
  },
  set "~standard"(value) {
    own(this, "~standard", value);
  },
  parse: function _parse(data, params) {
    return parse5(this, data, params, { callee: _parse });
  },
  parseAsync: async function _parseAsync(data, params) {
    return await parseAsync3(this, data, params, { callee: _parseAsync });
  },
  safeParse(data, params) {
    return safeParse3(this, data, params);
  },
  async safeParseAsync(data, params) {
    return safeParseAsync3(this, data, params);
  },
  get spa() {
    return this?.safeParseAsync;
  },
  set spa(value) {
    own(this, "spa", value);
  },
  validate(data, params) {
    return validate(this, data, params);
  },
  validateAsync(data, params) {
    return validateAsync(this, data, params);
  },
  encode: function _encode(data, params) {
    return encode2(this, data, params, { callee: _encode });
  },
  decode: function _decode(data, params) {
    return decode2(this, data, params, { callee: _decode });
  },
  encodeAsync: async function _encodeAsync(data, params) {
    return await encodeAsync2(this, data, params, { callee: _encodeAsync });
  },
  decodeAsync: async function _decodeAsync(data, params) {
    return await decodeAsync2(this, data, params, { callee: _decodeAsync });
  },
  safeEncode(data, params) {
    return safeEncode2(this, data, params);
  },
  safeDecode(data, params) {
    return safeDecode2(this, data, params);
  },
  async safeEncodeAsync(data, params) {
    return safeEncodeAsync2(this, data, params);
  },
  async safeDecodeAsync(data, params) {
    return safeDecodeAsync2(this, data, params);
  },
  toJSONSchema(params) {
    return createToJSONSchemaMethod2(this, {})(params);
  },
  get description() {
    return globalRegistry2.get(this)?.description;
  },
  get _def() {
    return this._zod.def;
  }
}), _ZodString2 = /* @__PURE__ */ $constructor2("_ZodString", (inst, def) => {
  $ZodString2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor2(inst, ctx, json, params);
}, /* @__PURE__ */ derived({
  format: (inst) => aggregateChecks(inst).format ?? null,
  minLength: (inst) => aggregateChecks(inst).minimum ?? null,
  maxLength: (inst) => aggregateChecks(inst).maximum ?? null
}, {
  regex(...args) {
    return this.check(_regex2(...args));
  },
  includes(...args) {
    return this.check(_includes2(...args));
  },
  startsWith(...args) {
    return this.check(_startsWith2(...args));
  },
  endsWith(...args) {
    return this.check(_endsWith2(...args));
  },
  min(...args) {
    return this.check(_minLength2(...args));
  },
  max(...args) {
    return this.check(_maxLength2(...args));
  },
  length(...args) {
    return this.check(_length2(...args));
  },
  nonempty(...args) {
    return this.check(_minLength2(1, ...args));
  },
  lowercase(params) {
    return this.check(_lowercase2(params));
  },
  uppercase(params) {
    return this.check(_uppercase2(params));
  },
  trim() {
    return this.check(_trim2());
  },
  normalize(...args) {
    return this.check(_normalize2(...args));
  },
  toLowerCase() {
    return this.check(_toLowerCase2());
  },
  toUpperCase() {
    return this.check(_toUpperCase2());
  },
  slugify() {
    return this.check(_slugify2());
  }
})), ZodString2 = /* @__PURE__ */ $constructor2("ZodString", (inst, def) => {
  $ZodString2.init(inst, def), _ZodString2.init(inst, def);
}, {
  email(params) {
    return this.check(_email2(ZodEmail2, params));
  },
  url(params) {
    return this.check(_url2(ZodURL2, params));
  },
  jwt(params) {
    return this.check(_jwt2(ZodJWT2, params));
  },
  emoji(params) {
    return this.check(_emoji4(ZodEmoji2, params));
  },
  guid(params) {
    return this.check(_guid2(ZodGUID2, params));
  },
  uuid(params) {
    return this.check(_uuid2(ZodUUID2, params));
  },
  uuidv4(params) {
    return this.check(_uuidv42(ZodUUID2, params));
  },
  uuidv6(params) {
    return this.check(_uuidv62(ZodUUID2, params));
  },
  uuidv7(params) {
    return this.check(_uuidv72(ZodUUID2, params));
  },
  nanoid(params) {
    return this.check(_nanoid2(ZodNanoID2, params));
  },
  cuid(params) {
    return this.check(_cuid3(ZodCUID3, params));
  },
  cuid2(params) {
    return this.check(_cuid22(ZodCUID22, params));
  },
  ulid(params) {
    return this.check(_ulid2(ZodULID2, params));
  },
  base64(params) {
    return this.check(_base642(ZodBase642, params));
  },
  base64url(params) {
    return this.check(_base64url2(ZodBase64URL2, params));
  },
  xid(params) {
    return this.check(_xid2(ZodXID2, params));
  },
  ksuid(params) {
    return this.check(_ksuid2(ZodKSUID2, params));
  },
  ipv4(params) {
    return this.check(_ipv42(ZodIPv42, params));
  },
  ipv6(params) {
    return this.check(_ipv62(ZodIPv62, params));
  },
  cidrv4(params) {
    return this.check(_cidrv42(ZodCIDRv42, params));
  },
  cidrv6(params) {
    return this.check(_cidrv62(ZodCIDRv62, params));
  },
  e164(params) {
    return this.check(_e1642(ZodE1642, params));
  },
  datetime(params) {
    return this.check(_isoDateTime2(ZodISODateTime2, params));
  },
  date(params) {
    return this.check(_isoDate2(ZodISODate2, params));
  },
  time(params) {
    return this.check(_isoTime2(ZodISOTime2, params));
  },
  duration(params) {
    return this.check(_isoDuration2(ZodISODuration2, params));
  }
});
function string4(params) {
  return _string2(ZodString2, params);
}
var ZodStringFormat2 = /* @__PURE__ */ $constructor2("ZodStringFormat", (inst, def) => {
  $ZodStringFormat2.init(inst, def), _ZodString2.init(inst, def);
}), ZodISODateTime2 = /* @__PURE__ */ $constructor2("ZodISODateTime", (inst, def) => {
  $ZodISODateTime2.init(inst, def), ZodStringFormat2.init(inst, def);
}), ZodISODate2 = /* @__PURE__ */ $constructor2("ZodISODate", (inst, def) => {
  $ZodISODate2.init(inst, def), ZodStringFormat2.init(inst, def);
}), ZodISOTime2 = /* @__PURE__ */ $constructor2("ZodISOTime", (inst, def) => {
  $ZodISOTime2.init(inst, def), ZodStringFormat2.init(inst, def);
}), ZodISODuration2 = /* @__PURE__ */ $constructor2("ZodISODuration", (inst, def) => {
  $ZodISODuration2.init(inst, def), ZodStringFormat2.init(inst, def);
}), ZodEmail2 = /* @__PURE__ */ $constructor2("ZodEmail", (inst, def) => {
  $ZodEmail2.init(inst, def), ZodStringFormat2.init(inst, def);
});
var ZodGUID2 = /* @__PURE__ */ $constructor2("ZodGUID", (inst, def) => {
  $ZodGUID2.init(inst, def), ZodStringFormat2.init(inst, def);
});
var ZodUUID2 = /* @__PURE__ */ $constructor2("ZodUUID", (inst, def) => {
  $ZodUUID2.init(inst, def), ZodStringFormat2.init(inst, def);
});
var ZodURL2 = /* @__PURE__ */ $constructor2("ZodURL", (inst, def) => {
  $ZodURL2.init(inst, def), ZodStringFormat2.init(inst, def);
});
function url(params) {
  return _url2(ZodURL2, params);
}
var ZodEmoji2 = /* @__PURE__ */ $constructor2("ZodEmoji", (inst, def) => {
  $ZodEmoji2.init(inst, def), ZodStringFormat2.init(inst, def);
});
var ZodNanoID2 = /* @__PURE__ */ $constructor2("ZodNanoID", (inst, def) => {
  $ZodNanoID2.init(inst, def), ZodStringFormat2.init(inst, def);
});
var ZodCUID3 = /* @__PURE__ */ $constructor2("ZodCUID", (inst, def) => {
  $ZodCUID3.init(inst, def), ZodStringFormat2.init(inst, def);
});
var ZodCUID22 = /* @__PURE__ */ $constructor2("ZodCUID2", (inst, def) => {
  $ZodCUID22.init(inst, def), ZodStringFormat2.init(inst, def);
});
var ZodULID2 = /* @__PURE__ */ $constructor2("ZodULID", (inst, def) => {
  $ZodULID2.init(inst, def), ZodStringFormat2.init(inst, def);
});
var ZodXID2 = /* @__PURE__ */ $constructor2("ZodXID", (inst, def) => {
  $ZodXID2.init(inst, def), ZodStringFormat2.init(inst, def);
});
var ZodKSUID2 = /* @__PURE__ */ $constructor2("ZodKSUID", (inst, def) => {
  $ZodKSUID2.init(inst, def), ZodStringFormat2.init(inst, def);
});
var ZodIPv42 = /* @__PURE__ */ $constructor2("ZodIPv4", (inst, def) => {
  $ZodIPv42.init(inst, def), ZodStringFormat2.init(inst, def);
});
var ZodIPv62 = /* @__PURE__ */ $constructor2("ZodIPv6", (inst, def) => {
  $ZodIPv62.init(inst, def), ZodStringFormat2.init(inst, def);
});
var ZodCIDRv42 = /* @__PURE__ */ $constructor2("ZodCIDRv4", (inst, def) => {
  $ZodCIDRv42.init(inst, def), ZodStringFormat2.init(inst, def);
});
var ZodCIDRv62 = /* @__PURE__ */ $constructor2("ZodCIDRv6", (inst, def) => {
  $ZodCIDRv62.init(inst, def), ZodStringFormat2.init(inst, def);
});
var ZodBase642 = /* @__PURE__ */ $constructor2("ZodBase64", (inst, def) => {
  $ZodBase642.init(inst, def), ZodStringFormat2.init(inst, def);
});
var ZodBase64URL2 = /* @__PURE__ */ $constructor2("ZodBase64URL", (inst, def) => {
  $ZodBase64URL2.init(inst, def), ZodStringFormat2.init(inst, def);
});
var ZodE1642 = /* @__PURE__ */ $constructor2("ZodE164", (inst, def) => {
  $ZodE1642.init(inst, def), ZodStringFormat2.init(inst, def);
});
var ZodJWT2 = /* @__PURE__ */ $constructor2("ZodJWT", (inst, def) => {
  $ZodJWT2.init(inst, def), ZodStringFormat2.init(inst, def);
});
var ZodNumber2 = /* @__PURE__ */ $constructor2("ZodNumber", (inst, def) => {
  $ZodNumber2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor2(inst, ctx, json, params), inst.isFinite = !0;
}, /* @__PURE__ */ derived({
  minValue: (inst) => {
    let { minimum, exclusiveMinimum } = aggregateChecks(inst);
    return Math.max(minimum ?? Number.NEGATIVE_INFINITY, exclusiveMinimum ?? Number.NEGATIVE_INFINITY);
  },
  maxValue: (inst) => {
    let { maximum, exclusiveMaximum } = aggregateChecks(inst);
    return Math.min(maximum ?? Number.POSITIVE_INFINITY, exclusiveMaximum ?? Number.POSITIVE_INFINITY);
  },
  isInt: (inst) => {
    let { isInt, multipleOf } = aggregateChecks(inst);
    return !!isInt || !!multipleOf?.some(Number.isSafeInteger);
  },
  format: (inst) => aggregateChecks(inst).format ?? null
}, {
  gt(value, params) {
    return this.check(_gt2(value, params));
  },
  gte(value, params) {
    return this.check(_gte2(value, params));
  },
  min(value, params) {
    return this.check(_gte2(value, params));
  },
  lt(value, params) {
    return this.check(_lt2(value, params));
  },
  lte(value, params) {
    return this.check(_lte2(value, params));
  },
  max(value, params) {
    return this.check(_lte2(value, params));
  },
  int(params) {
    return this.check(int2(params));
  },
  safe(params) {
    return this.check(int2(params));
  },
  positive(params) {
    return this.check(_gt2(0, params));
  },
  nonnegative(params) {
    return this.check(_gte2(0, params));
  },
  negative(params) {
    return this.check(_lt2(0, params));
  },
  nonpositive(params) {
    return this.check(_lte2(0, params));
  },
  multipleOf(value, params) {
    return this.check(_multipleOf2(value, params));
  },
  step(value, params) {
    return this.check(_multipleOf2(value, params));
  },
  finite() {
    return this;
  }
}));
function number4(params) {
  return _number2(ZodNumber2, params);
}
var ZodNumberFormat2 = /* @__PURE__ */ $constructor2("ZodNumberFormat", (inst, def) => {
  $ZodNumberFormat2.init(inst, def), ZodNumber2.init(inst, def);
});
function int2(params) {
  return _int2(ZodNumberFormat2, params);
}
var ZodBoolean2 = /* @__PURE__ */ $constructor2("ZodBoolean", (inst, def) => {
  $ZodBoolean2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor2(inst, ctx, json, params);
});
function boolean4(params) {
  return _boolean2(ZodBoolean2, params);
}
var ZodUndefined = /* @__PURE__ */ $constructor2("ZodUndefined", (inst, def) => {
  $ZodUndefined2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => undefinedProcessor2(inst, ctx, json, params);
});
function _undefined5(params) {
  return _undefined4(ZodUndefined, params);
}
var ZodNull = /* @__PURE__ */ $constructor2("ZodNull", (inst, def) => {
  $ZodNull2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => nullProcessor2(inst, ctx, json, params);
});
function _null5(params) {
  return _null4(ZodNull, params);
}
var ZodUnknown2 = /* @__PURE__ */ $constructor2("ZodUnknown", (inst, def) => {
  $ZodUnknown2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => unknownProcessor2(inst, ctx, json, params);
});
function unknown2() {
  return _unknown2(ZodUnknown2);
}
var ZodNever2 = /* @__PURE__ */ $constructor2("ZodNever", (inst, def) => {
  $ZodNever2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor2(inst, ctx, json, params);
});
function never2(params) {
  return _never2(ZodNever2, params);
}
var ZodArray2 = /* @__PURE__ */ $constructor2("ZodArray", (inst, def) => {
  _ensureDefaultMemoizer(), $ZodArray2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor2(inst, ctx, json, params), inst.element = def.element;
}, {
  min(n, params) {
    return this.check(_minLength2(n, params));
  },
  nonempty(params) {
    return this.check(_minLength2(1, params));
  },
  max(n, params) {
    return this.check(_maxLength2(n, params));
  },
  length(n, params) {
    return this.check(_length2(n, params));
  },
  unwrap() {
    return this.element;
  }
});
function array2(element, params) {
  return _array2(ZodArray2, element, params);
}
var ZodObject2 = /* @__PURE__ */ $constructor2("ZodObject", (inst, def) => {
  _ensureDefaultMemoizer(), $ZodObjectJIT2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor2(inst, ctx, json, params), installLazyProp(inst, "shape", (self) => self._zod.def.shape, !1);
}, {
  keyof() {
    return _enum2(Object.keys(this._zod.def.shape));
  },
  catchall(catchall) {
    return this.clone(mergeDefs2(this._zod.def, { catchall }));
  },
  passthrough() {
    return this.clone(mergeDefs2(this._zod.def, { catchall: unknown2() }));
  },
  loose() {
    return this.clone(mergeDefs2(this._zod.def, { catchall: unknown2() }));
  },
  strict() {
    return this.clone(mergeDefs2(this._zod.def, { catchall: never2() }));
  },
  strip() {
    return this.clone(mergeDefs2(this._zod.def, { catchall: void 0 }));
  },
  extend(incoming) {
    return extend2(this, incoming);
  },
  safeExtend(incoming) {
    return safeExtend2(this, incoming);
  },
  merge(other) {
    return merge2(this, other);
  },
  pick(mask) {
    return pick2(this, mask);
  },
  omit(mask) {
    return omit2(this, mask);
  },
  partial(...args) {
    return partial2(ZodOptional2, this, args[0]);
  },
  exactPartial(...args) {
    return partial2(ZodExactOptional2, this, args[0], "exactPartial");
  },
  required(...args) {
    return required2(ZodNonOptional2, this, args[0]);
  }
});
function object2(shape, params) {
  let def = {
    type: "object",
    shape: shape ?? {},
    ...normalizeParams2(params)
  };
  return new ZodObject2(def);
}
var ZodUnion2 = /* @__PURE__ */ $constructor2("ZodUnion", (inst, def) => {
  $ZodUnion2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor2(inst, ctx, json, params), inst.options = def.options;
});
function union2(options, params) {
  return new ZodUnion2({
    type: "union",
    options,
    ...normalizeParams2(params)
  });
}
var ZodDiscriminatedUnion = /* @__PURE__ */ $constructor2("ZodDiscriminatedUnion", (inst, def) => {
  ZodUnion2.init(inst, def), $ZodDiscriminatedUnion2.init(inst, def);
});
function discriminatedUnion(discriminator, options, params) {
  return new ZodDiscriminatedUnion({
    type: "union",
    options,
    discriminator,
    ...normalizeParams2(params)
  });
}
var ZodIntersection2 = /* @__PURE__ */ $constructor2("ZodIntersection", (inst, def) => {
  $ZodIntersection2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor2(inst, ctx, json, params);
});
function intersection2(left, right) {
  return new ZodIntersection2({
    type: "intersection",
    left,
    right
  });
}
var ZodRecord = /* @__PURE__ */ $constructor2("ZodRecord", (inst, def) => {
  _ensureDefaultMemoizer(), $ZodRecord2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => recordProcessor2(inst, ctx, json, params), inst.keyType = def.keyType, inst.valueType = def.valueType;
});
function record(keyType, valueType, params) {
  if (!valueType || !valueType._zod)
    return new ZodRecord({
      type: "record",
      keyType: string4(),
      valueType: keyType,
      ...normalizeParams2(valueType)
    });
  return new ZodRecord({
    type: "record",
    keyType,
    valueType,
    ...normalizeParams2(params)
  });
}
var ZodEnum2 = /* @__PURE__ */ $constructor2("ZodEnum", (inst, def) => {
  $ZodEnum2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor2(inst, ctx, json, params), inst.enum = def.entries, inst.options = [...inst._zod.values];
  let keys = new Set(Object.keys(def.entries));
  inst.extract = (values, params) => {
    let newEntries = {};
    for (let value of values)
      if (keys.has(value))
        newEntries[value] = def.entries[value];
      else
        throw Error(`Key ${value} not found in enum`);
    return new ZodEnum2({
      ...def,
      checks: [],
      ...normalizeParams2(params),
      entries: newEntries
    });
  }, inst.exclude = (values, params) => {
    let newEntries = { ...def.entries };
    for (let value of values)
      if (keys.has(value))
        delete newEntries[value];
      else
        throw Error(`Key ${value} not found in enum`);
    return new ZodEnum2({
      ...def,
      checks: [],
      ...normalizeParams2(params),
      entries: newEntries
    });
  };
});
function _enum2(values, params) {
  let entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
  return new ZodEnum2({
    type: "enum",
    entries,
    ...normalizeParams2(params)
  });
}
var ZodLiteral = /* @__PURE__ */ $constructor2("ZodLiteral", (inst, def) => {
  $ZodLiteral2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor2(inst, ctx, json, params), inst.values = new Set(def.values), Object.defineProperty(inst, "value", {
    get() {
      if (def.values.length > 1)
        throw Error("This schema contains multiple valid literal values. Use `.values` instead.");
      return def.values[0];
    }
  });
});
function literal(value, params) {
  return new ZodLiteral({
    type: "literal",
    values: Array.isArray(value) ? value : [value],
    ...normalizeParams2(params)
  });
}
var ZodTransform2 = /* @__PURE__ */ $constructor2("ZodTransform", (inst, def) => {
  _ensureDefaultMemoizer(), $ZodTransform2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor2(inst, ctx, json, params), inst._zod.parse = (payload, _ctx) => {
    if (_ctx.direction === "backward")
      throw new $ZodEncodeError2(inst.constructor.name);
    payload.addIssue = (issue) => {
      if (typeof issue === "string")
        payload.issues.push(issue2(issue, payload.value, def));
      else {
        let _issue = issue;
        if (_issue.fatal)
          _issue.continue = !1;
        if (_issue.code ?? (_issue.code = "custom"), !("input" in _issue))
          _issue.input = payload.value;
        _issue.inst ?? (_issue.inst = inst), payload.issues.push(issue2(_issue));
      }
    };
    let output = def.transform(payload.value, payload);
    if (output instanceof Promise)
      return output.then((output) => (payload.value = output, payload));
    return payload.value = output, payload;
  };
});
function transform2(fn) {
  return new ZodTransform2({
    type: "transform",
    transform: fn
  });
}
var ZodOptional2 = /* @__PURE__ */ $constructor2("ZodOptional", (inst, def) => {
  $ZodOptional2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor2(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType;
});
function optional2(innerType) {
  return new ZodOptional2({
    type: "optional",
    innerType
  });
}
var ZodExactOptional2 = /* @__PURE__ */ $constructor2("ZodExactOptional", (inst, def) => {
  $ZodExactOptional2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor2(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional2(innerType) {
  return new ZodExactOptional2({
    type: "optional",
    innerType
  });
}
var ZodNullable2 = /* @__PURE__ */ $constructor2("ZodNullable", (inst, def) => {
  $ZodNullable2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor2(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType;
});
function nullable2(innerType) {
  return new ZodNullable2({
    type: "nullable",
    innerType
  });
}
var ZodDefault2 = /* @__PURE__ */ $constructor2("ZodDefault", (inst, def) => {
  $ZodDefault2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor2(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType, inst.removeDefault = inst.unwrap;
});
function _default2(innerType, defaultValue) {
  return new ZodDefault2({
    type: "default",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone2(defaultValue);
    }
  });
}
var ZodPrefault2 = /* @__PURE__ */ $constructor2("ZodPrefault", (inst, def) => {
  $ZodPrefault2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor2(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType;
});
function prefault2(innerType, defaultValue) {
  return new ZodPrefault2({
    type: "prefault",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone2(defaultValue);
    }
  });
}
var ZodNonOptional2 = /* @__PURE__ */ $constructor2("ZodNonOptional", (inst, def) => {
  $ZodNonOptional2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor2(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional2(innerType, params) {
  return new ZodNonOptional2({
    type: "nonoptional",
    innerType,
    ...normalizeParams2(params)
  });
}
var ZodCatch2 = /* @__PURE__ */ $constructor2("ZodCatch", (inst, def) => {
  $ZodCatch2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor2(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType, inst.removeCatch = inst.unwrap;
});
function _catch2(innerType, catchValue) {
  return new ZodCatch2({
    type: "catch",
    innerType,
    catchValue: typeof catchValue === "function" ? catchValue : constantCatch(catchValue)
  });
}
var ZodNaN = /* @__PURE__ */ $constructor2("ZodNaN", (inst, def) => {
  $ZodNaN2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => nanProcessor2(inst, ctx, json, params);
});
function nan(params) {
  return _nan2(ZodNaN, params);
}
var ZodPipe2 = /* @__PURE__ */ $constructor2("ZodPipe", (inst, def) => {
  $ZodPipe2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor2(inst, ctx, json, params), inst.in = def.in, inst.out = def.out;
});
function pipe2(in_, out) {
  return new ZodPipe2({
    type: "pipe",
    in: in_,
    out
  });
}
var ZodReadonly2 = /* @__PURE__ */ $constructor2("ZodReadonly", (inst, def) => {
  $ZodReadonly2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor2(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType;
});
function readonly2(innerType) {
  return new ZodReadonly2({
    type: "readonly",
    innerType
  });
}
var ZodLazy = /* @__PURE__ */ $constructor2("ZodLazy", (inst, def) => {
  $ZodLazy2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => lazyProcessor2(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.getter();
});
function lazy(getter) {
  return new ZodLazy({
    type: "lazy",
    getter
  });
}
var ZodCustom2 = /* @__PURE__ */ $constructor2("ZodCustom", (inst, def) => {
  $ZodCustom2.init(inst, def), ZodType2.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => customProcessor2(inst, ctx, json, params);
});
function refine2(fn, _params = {}) {
  return _refine2(ZodCustom2, fn, _params);
}
function superRefine2(fn, params) {
  return _superRefine2(fn, params);
}
// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/classic/iso.js
function datetime4(params) {
  return _isoDateTime2(ZodISODateTime2, params);
}
function date4(params) {
  return _isoDate2(ZodISODate2, params);
}
function time4(params) {
  return _isoTime2(ZodISOTime2, params);
}
function duration4(params) {
  return _isoDuration2(ZodISODuration2, params);
}
// ../models/src/catalog-cache.ts
import { createHash, randomUUID as randomUUID2 } from "node:crypto";
import { mkdir as mkdir2, readFile as readFile2, rename as rename2, rm as rm2, writeFile as writeFile2 } from "node:fs/promises";
import path2 from "node:path";

// ../../node_modules/.bun/env-paths@4.0.0/node_modules/env-paths/index.js
import path from "node:path";
import os2 from "node:os";
import process3 from "node:process";

// ../../node_modules/.bun/is-safe-filename@0.1.1/node_modules/is-safe-filename/index.js
var unsafeFilenameFixtures = Object.freeze([
  "",
  "   ",
  ".",
  "..",
  " .",
  ". ",
  " ..",
  ".. ",
  "../",
  "../foo",
  "foo/../bar",
  "foo/bar",
  "foo\\bar",
  "foo\x00bar"
]);
function isSafeFilename(filename) {
  if (typeof filename !== "string")
    return !1;
  let trimmed = filename.trim();
  return trimmed !== "" && trimmed !== "." && trimmed !== ".." && !filename.includes("/") && !filename.includes("\\") && !filename.includes("\x00");
}
function assertSafeFilename(filename) {
  if (typeof filename !== "string")
    throw TypeError("Expected a string");
  if (!isSafeFilename(filename))
    throw Error(`Unsafe filename: ${JSON.stringify(filename)}`);
}

// ../../node_modules/.bun/env-paths@4.0.0/node_modules/env-paths/index.js
var homedir2 = os2.homedir(), tmpdir = os2.tmpdir(), { env } = process3, macos = (name) => {
  let library = path.join(homedir2, "Library");
  return {
    data: path.join(library, "Application Support", name),
    config: path.join(library, "Preferences", name),
    cache: path.join(library, "Caches", name),
    log: path.join(library, "Logs", name),
    temp: path.join(tmpdir, name)
  };
}, windows = (name) => {
  let appData = env.APPDATA || path.join(homedir2, "AppData", "Roaming"), localAppData = env.LOCALAPPDATA || path.join(homedir2, "AppData", "Local");
  return {
    data: path.join(localAppData, name, "Data"),
    config: path.join(appData, name, "Config"),
    cache: path.join(localAppData, name, "Cache"),
    log: path.join(localAppData, name, "Log"),
    temp: path.join(tmpdir, name)
  };
}, linux = (name) => {
  let username = path.basename(homedir2);
  return {
    data: path.join(env.XDG_DATA_HOME || path.join(homedir2, ".local", "share"), name),
    config: path.join(env.XDG_CONFIG_HOME || path.join(homedir2, ".config"), name),
    cache: path.join(env.XDG_CACHE_HOME || path.join(homedir2, ".cache"), name),
    log: path.join(env.XDG_STATE_HOME || path.join(homedir2, ".local", "state"), name),
    temp: path.join(tmpdir, username, name)
  };
};
function envPaths(name, { suffix = "nodejs" } = {}) {
  if (assertSafeFilename(name), suffix)
    name += `-${suffix}`;
  if (assertSafeFilename(name), process3.platform === "darwin")
    return macos(name);
  if (process3.platform === "win32")
    return windows(name);
  return linux(name);
}

// ../models/src/catalog-cache.ts
var Directory = path2.join(envPaths("forge-extensions", { suffix: "" }).cache, "catalogs"), filename = (scope) => {
  let hash = createHash("sha256").update(JSON.stringify(scope)).digest("hex");
  return path2.join(Directory, `${hash}.json`);
}, readCatalog = async (scope, schema) => {
  try {
    let result = schema.safeParse(JSON.parse(await readFile2(filename(scope), "utf-8")));
    return result.success ? result.data : void 0;
  } catch {
    return;
  }
}, writeCatalog = async (scope, catalog) => {
  await mkdir2(Directory, { mode: 448, recursive: !0 });
  let destination = filename(scope), temporary = `${destination}.${randomUUID2()}.tmp`;
  try {
    await writeFile2(temporary, `${JSON.stringify(catalog)}
`, { mode: 384 }), await rename2(temporary, destination);
  } finally {
    await rm2(temporary, { force: !0 });
  }
};

// ../models/src/desktop-catalog.ts
var RateSchema = object2({
  cache_read: number4().nonnegative().optional(),
  cache_write: number4().nonnegative().optional(),
  input: number4().nonnegative(),
  output: number4().nonnegative()
}), DesktopModelSchema = object2({
  cost: RateSchema.extend({
    tiers: array2(RateSchema.extend({
      tier: object2({ size: number4().positive(), type: string4() })
    })).optional()
  }).optional(),
  id: string4().min(1),
  limit: object2({ context: number4().positive(), output: number4().positive() }),
  modalities: object2({ input: array2(string4()), output: array2(string4()) }),
  name: string4(),
  reasoning: boolean4(),
  reasoning_options: array2(discriminatedUnion("type", [
    object2({ type: literal("effort"), values: array2(string4().nullable()) }),
    object2({ type: literal("toggle") }),
    object2({
      max: number4().optional(),
      min: number4().optional(),
      type: literal("budget_tokens")
    })
  ])).optional(),
  tool_call: boolean4()
}).refine((model) => model.cost !== void 0, {
  message: "Forge model is missing token pricing."
}), DesktopCatalogSchema = object2({
  fetchedAt: exports_iso2.datetime(),
  models: record(string4(), DesktopModelSchema),
  options: object2({
    apiKey: string4().optional(),
    baseURL: url(),
    headers: record(string4(), string4()).optional()
  }),
  version: literal(1)
}), ServerFile = path3.join(homedir3(), ".forge", "server.json"), desktopScope = async () => {
  let server = await readFile3(ServerFile, "utf-8"), tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC", day = (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA", { timeZone: tz });
  return ["desktop", server, tz, day];
}, readDesktopCatalog = async () => {
  try {
    return await readCatalog(await desktopScope(), DesktopCatalogSchema);
  } catch {
    return;
  }
}, pending, refreshDesktopCatalog = async () => {
  pending ??= (async () => {
    let scope = await desktopScope().catch(() => {}), forge = await useForgeClient(), tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC", [providers, models] = await Promise.all([forge.providers(), forge.models({ tz })]), catalog = DesktopCatalogSchema.parse({
      fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
      models,
      options: providers.forge.options,
      version: 1
    });
    if (scope !== void 0) {
      if (JSON.stringify(await desktopScope()) !== JSON.stringify(scope))
        throw Error("Forge Desktop changed during model discovery. Refresh again.");
      await writeCatalog(scope, catalog);
    }
    return catalog;
  })();
  try {
    return await pending;
  } finally {
    pending = void 0;
  }
};
// ../models/src/index.ts
import { createHash as createHash2 } from "node:crypto";
import path4 from "node:path";

// ../../node_modules/.bun/unstorage@2.0.0-beta.0/node_modules/unstorage/dist/_chunks/libs/destr.mjs
var suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/, suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/, JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string")
    return value;
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1)
    return value.slice(1, -1);
  let _value = value.trim();
  if (_value.length <= 9)
    switch (_value.toLowerCase()) {
      case "true":
        return !0;
      case "false":
        return !1;
      case "undefined":
        return;
      case "null":
        return null;
      case "nan":
        return NaN;
      case "infinity":
        return Number.POSITIVE_INFINITY;
      case "-infinity":
        return Number.NEGATIVE_INFINITY;
    }
  if (!JsonSigRx.test(value)) {
    if (options.strict)
      throw SyntaxError("[destr] Invalid JSON");
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict)
        throw Error("[destr] Possible prototype pollution");
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict)
      throw error;
    return value;
  }
}

// ../../node_modules/.bun/unstorage@2.0.0-beta.0/node_modules/unstorage/dist/_chunks/utils.mjs
function createError(driver, message, opts) {
  let err = Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace)
    Error.captureStackTrace(err, createError);
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name))
    return createError(driver, `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`);
  return createError(driver, `Missing required option \`${name}\`.`);
}

// ../../node_modules/.bun/unstorage@2.0.0-beta.0/node_modules/unstorage/dist/drivers/memory.mjs
var DRIVER_NAME = "memory", driver = () => {
  let data = /* @__PURE__ */ new Map, timers = /* @__PURE__ */ new Map;
  return {
    name: DRIVER_NAME,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value, opts) {
      _clearTimer(timers, key), data.set(key, value), _scheduleExpiry(data, timers, key, opts?.ttl);
    },
    setItemRaw(key, value, opts) {
      _clearTimer(timers, key), data.set(key, value), _scheduleExpiry(data, timers, key, opts?.ttl);
    },
    removeItem(key) {
      _clearTimer(timers, key), data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      for (let timer of timers.values())
        clearTimeout(timer);
      timers.clear(), data.clear();
    },
    dispose() {
      for (let timer of timers.values())
        clearTimeout(timer);
      timers.clear(), data.clear();
    }
  };
}, MAX_TIMER_DELAY = 2147483647;
function _clearTimer(timers, key) {
  let existing = timers.get(key);
  if (existing !== void 0)
    clearTimeout(existing), timers.delete(key);
}
function _scheduleExpiry(data, timers, key, ttl) {
  if (!ttl || !Number.isFinite(ttl))
    return;
  let remaining = ttl * 1000, schedule = () => {
    let delay = Math.min(remaining, MAX_TIMER_DELAY);
    remaining -= delay;
    let timer = setTimeout(() => {
      if (remaining > 0) {
        schedule();
        return;
      }
      data.delete(key), timers.delete(key);
    }, delay);
    if (timer && typeof timer === "object" && "unref" in timer)
      timer.unref();
    timers.set(key, timer);
  };
  schedule();
}

// ../../node_modules/.bun/unstorage@2.0.0-beta.0/node_modules/unstorage/dist/_chunks/_utils.mjs
function wrapToPromise(value) {
  if (!value || typeof value.then !== "function")
    return Promise.resolve(value);
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  let type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  let proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function isPlainValue(value) {
  return isPrimitive(value) || isPureObject(value) || Array.isArray(value);
}
function stringify(value) {
  if (isPrimitive(value))
    return String(value);
  if (isPureObject(value) || Array.isArray(value))
    return JSON.stringify(value);
  if (typeof value.toJSON === "function")
    return stringify(value.toJSON());
  throw Error("[unstorage] Cannot stringify value!");
}
var BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string")
    return value;
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string")
    return value;
  if (!value.startsWith("base64:"))
    return value;
  return base64Decode(value.slice(7));
}
function base64Decode(input) {
  if (typeof Buffer < "u")
    return Buffer.from(input, "base64");
  return Uint8Array.from(globalThis.atob(input), (c) => c.codePointAt(0));
}
function base64Encode(input) {
  if (typeof Buffer < "u")
    return Buffer.from(input).toString("base64");
  return globalThis.btoa(String.fromCodePoint(...input));
}
async function toBytes(value) {
  if (typeof value === "string")
    return (/* @__PURE__ */ new TextEncoder()).encode(value);
  if (ArrayBuffer.isView(value))
    return value.constructor === Uint8Array ? value : new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  if (value instanceof ArrayBuffer)
    return new Uint8Array(value);
  if (typeof value?.arrayBuffer === "function")
    return new Uint8Array(await value.arrayBuffer());
  if (typeof value?.getReader === "function" || typeof value?.[Symbol.asyncIterator] === "function")
    return concatBytes(await readChunks(value));
  if (isPlainValue(value))
    return (/* @__PURE__ */ new TextEncoder()).encode(stringify(value));
  throw TypeError(`[unstorage] Cannot convert \`${typeName(value)}\` to bytes.`);
}
async function toBlob(value) {
  if (value instanceof Blob)
    return value;
  return new Blob([await toBytes(value)]);
}
async function toStream(value) {
  if (value instanceof ReadableStream)
    return value;
  if (value instanceof Blob)
    return value.stream();
  let bytes = await toBytes(value);
  return new ReadableStream({ start(controller) {
    controller.enqueue(bytes), controller.close();
  } });
}
async function readChunks(value) {
  let chunks = [];
  if (typeof value.getReader === "function") {
    let reader = value.getReader();
    try {
      while (!0) {
        let { done, value: chunk } = await reader.read();
        if (done)
          break;
        chunks.push(await chunkToBytes(chunk));
      }
    } finally {
      reader.releaseLock();
    }
  } else
    for await (let chunk of value)
      chunks.push(await chunkToBytes(chunk));
  return chunks;
}
function chunkToBytes(chunk) {
  if (typeof chunk !== "string" && isPlainValue(chunk))
    throw TypeError(`[unstorage] Cannot convert \`${typeName(chunk)}\` to bytes.`);
  return toBytes(chunk);
}
function concatBytes(chunks) {
  if (chunks.length === 1)
    return chunks[0];
  let bytes = new Uint8Array(chunks.reduce((size, chunk) => size + chunk.length, 0)), offset = 0;
  for (let chunk of chunks)
    bytes.set(chunk, offset), offset += chunk.length;
  return bytes;
}
function typeName(value) {
  return value?.constructor?.name || typeof value;
}

// ../../node_modules/.bun/unstorage@2.0.0-beta.0/node_modules/unstorage/dist/_chunks/utils2.mjs
function normalizeKey(key) {
  if (!key)
    return "";
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function hasDotSegment(key) {
  return key.split(":").some((segment) => segment === "." || segment === "..");
}
function joinKeys(...keys) {
  return normalizeKey(keys.join(":"));
}
function normalizeBaseKey(base) {
  return base = normalizeKey(base), base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0)
    return !0;
  let substrCount = 0, index = key.indexOf(":");
  while (index > -1)
    substrCount++, index = key.indexOf(":", index + 1);
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base)
    return key.startsWith(base) && key[key.length - 1] !== "$";
  return key[key.length - 1] !== "$";
}

// ../../node_modules/.bun/unstorage@2.0.0-beta.0/node_modules/unstorage/dist/index.mjs
function isRawType(type) {
  return type === "bytes" || type === "blob" || type === "stream";
}
function isRawValue(value) {
  return typeof value === "string" ? value.startsWith(BASE64_PREFIX) : ArrayBuffer.isView(value) || value instanceof ArrayBuffer || value instanceof Blob || value instanceof ReadableStream;
}
async function toValueType(value, type) {
  if (value === null || value === void 0)
    return null;
  if (type !== void 0 && isRawValue(value))
    value = (/* @__PURE__ */ new TextDecoder()).decode(await toBytes(deserializeRaw(value)));
  if (type === "text")
    return typeof value === "string" ? value : stringify(value);
  return destr(value);
}
async function getTypedItem(driver, relativeKey, opts = {}) {
  let type = opts.type;
  if (isRawType(type)) {
    let raw = driver.getItemRaw ? await asyncCall(driver.getItemRaw, relativeKey, opts) : deserializeRaw(await asyncCall(driver.getItem, relativeKey, opts));
    if (raw === null || raw === void 0)
      return null;
    switch (type) {
      case "bytes":
        return await toBytes(raw);
      case "blob":
        return await toBlob(raw);
      case "stream":
        return await toStream(raw);
    }
  }
  return toValueType(await asyncCall(driver.getItem, relativeKey, opts), type);
}
function createStorage(options = {}) {
  let context = {
    mounts: { "": options.driver || driver() },
    mountpoints: [""],
    watching: !1,
    watchListeners: [],
    unwatch: {}
  }, normalizeItemKey = (key) => {
    let normalizedKey = normalizeKey(key);
    if (!normalizedKey || hasDotSegment(normalizedKey))
      throw Error(`[unstorage] Invalid key: ${JSON.stringify(key)}`);
    return normalizedKey;
  }, normalizeBase = (base) => {
    let normalizedBase = normalizeBaseKey(base);
    if (hasDotSegment(normalizedBase))
      throw Error(`[unstorage] Invalid base: ${JSON.stringify(base)}`);
    return normalizedBase;
  }, getMount = (key) => {
    for (let base of context.mountpoints)
      if (key.startsWith(base))
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  }, getMounts = (base, includeParent) => context.mountpoints.filter((mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)).map((mountpoint) => ({
    relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
    mountpoint,
    driver: context.mounts[mountpoint]
  })), onChange = (event, key) => {
    if (!context.watching)
      return;
    key = normalizeKey(key);
    for (let listener of context.watchListeners)
      listener(event, key);
  }, startWatch = async () => {
    if (context.watching)
      return;
    context.watching = !0;
    for (let mountpoint in context.mounts)
      context.unwatch[mountpoint] = await watch(context.mounts[mountpoint], onChange, mountpoint);
  }, stopWatch = async () => {
    if (!context.watching)
      return;
    for (let mountpoint in context.unwatch)
      await context.unwatch[mountpoint]();
    context.unwatch = {}, context.watching = !1;
  }, runBatch = (items, commonOptions, cb) => {
    let batches = /* @__PURE__ */ new Map, getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch)
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        }, batches.set(mount.base, batch);
      return batch;
    };
    for (let item of items) {
      let isStringItem = typeof item === "string", key = normalizeItemKey(isStringItem ? item : item.key), value = isStringItem ? void 0 : item.value, options = isStringItem || !item.options ? commonOptions : {
        ...commonOptions,
        ...item.options
      }, mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then((r) => r.flat());
  }, storage = {
    async hasItem(key, opts = {}) {
      key = normalizeItemKey(key);
      let { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem: async (key, opts = {}) => {
      key = normalizeItemKey(key);
      let { relativeKey, driver } = getMount(key);
      return getTypedItem(driver, relativeKey, opts);
    },
    async getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, async (batch) => {
        if (!batch.driver.getItems)
          return Promise.all(batch.items.map(async (item) => ({
            key: item.key,
            value: await getTypedItem(batch.driver, item.relativeKey, item.options)
          })));
        let rawItems = batch.items.filter((item) => isRawType(item.options?.type)), plainItems = rawItems.length === 0 ? batch.items : batch.items.filter((item) => !isRawType(item.options?.type)), [plain, raw] = await Promise.all([plainItems.length === 0 ? [] : asyncCall(batch.driver.getItems, plainItems.map((item) => ({
          key: item.relativeKey,
          options: item.options
        })), commonOptions).then((r) => {
          let types = r.length === plainItems.length ? void 0 : new Map(plainItems.map((item) => [item.relativeKey, item.options?.type]));
          return Promise.all(r.map(async (item, index) => ({
            key: joinKeys(batch.base, item.key),
            value: await toValueType(item.value, types ? types.has(item.key) ? types.get(item.key) : commonOptions.type : plainItems[index].options?.type)
          })));
        }), Promise.all(rawItems.map(async (item) => ({
          key: item.key,
          value: await getTypedItem(batch.driver, item.relativeKey, item.options)
        })))]);
        if (rawItems.length === 0 || plain.length !== plainItems.length)
          return [...plain, ...raw];
        let plainIndex = 0, rawIndex = 0;
        return batch.items.map((item) => isRawType(item.options?.type) ? raw[rawIndex++] : plain[plainIndex++]);
      });
    },
    async getItemRaw(key, opts = {}) {
      key = normalizeItemKey(key);
      let { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw)
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      return asyncCall(driver.getItem, relativeKey, opts).then((value) => deserializeRaw(value));
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0)
        return storage.removeItem(key);
      key = normalizeItemKey(key);
      let { relativeKey, driver } = getMount(key);
      if (!driver.setItem)
        return;
      if (await asyncCall(driver.setItem, relativeKey, stringify(value), opts), !driver.watch)
        onChange("update", key);
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems)
          return asyncCall(batch.driver.setItems, batch.items.map((item) => ({
            key: item.relativeKey,
            value: stringify(item.value),
            options: item.options
          })), commonOptions);
        if (!batch.driver.setItem)
          return;
        await Promise.all(batch.items.map((item) => asyncCall(batch.driver.setItem, item.relativeKey, stringify(item.value), item.options)));
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0)
        return storage.removeItem(key, opts);
      key = normalizeItemKey(key);
      let { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw)
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      else if (driver.setItem)
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      else
        return;
      if (!driver.watch)
        onChange("update", key);
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean")
        opts = { removeMeta: opts };
      key = normalizeItemKey(key);
      let { relativeKey, driver } = getMount(key);
      if (!driver.removeItem)
        return;
      if (await asyncCall(driver.removeItem, relativeKey, opts), opts.removeMeta || opts.removeMata)
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      if (!driver.watch)
        onChange("remove", key);
    },
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean")
        opts = { nativeOnly: opts };
      key = normalizeItemKey(key);
      let { relativeKey, driver } = getMount(key), meta = Object.create(null);
      if (driver.getMeta)
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      if (!opts.nativeOnly) {
        let value = await asyncCall(driver.getItem, relativeKey + "$", opts).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string")
            value.atime = new Date(value.atime);
          if (typeof value.mtime === "string")
            value.mtime = new Date(value.mtime);
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    async setMeta(key, value, opts = {}) {
      return this.setItem(normalizeItemKey(key) + "$", value, opts);
    },
    async removeMeta(key, opts = {}) {
      return this.removeItem(normalizeItemKey(key) + "$", opts);
    },
    async getKeys(base, opts = {}) {
      base = normalizeBase(base);
      let mounts = getMounts(base, !0), maskedMounts = [], allKeys = [], allMountsSupportMaxDepth = !0;
      for (let mount of mounts) {
        if (!mount.driver.flags?.maxDepth)
          allMountsSupportMaxDepth = !1;
        let rawKeys = await asyncCall(mount.driver.getKeys, mount.relativeBase, opts);
        for (let key of rawKeys) {
          let fullKey = mount.mountpoint + normalizeKey(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p)))
            allKeys.push(fullKey);
        }
        maskedMounts = [mount.mountpoint, ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))];
      }
      let shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter((key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base));
    },
    async clear(base, opts = {}) {
      base = normalizeBase(base), await Promise.all(getMounts(base, !1).map(async (m) => {
        if (m.driver.clear)
          return asyncCall(m.driver.clear, m.relativeBase, opts);
        if (m.driver.removeItem) {
          let keys = await m.driver.getKeys(m.relativeBase || "", opts);
          return Promise.all(keys.map((key) => m.driver.removeItem(key, opts)));
        }
      }));
    },
    async dispose() {
      await Promise.all(Object.values(context.mounts).map((driver) => dispose(driver)));
    },
    async watch(callback) {
      return await startWatch(), context.watchListeners.push(callback), async () => {
        if (context.watchListeners = context.watchListeners.filter((listener) => listener !== callback), context.watchListeners.length === 0)
          await stopWatch();
      };
    },
    async unwatch() {
      context.watchListeners = [], await stopWatch();
    },
    mount(base, driver) {
      if (base = normalizeBase(base), base && context.mounts[base])
        throw Error(`already mounted at ${base}`);
      if (base)
        context.mountpoints.push(base), context.mountpoints.sort((a, b) => b.length - a.length);
      if (context.mounts[base] = driver, context.watching)
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      return storage;
    },
    async unmount(base, _dispose = !0) {
      if (base = normalizeBaseKey(base), !base || !context.mounts[base])
        return;
      if (context.watching && base in context.unwatch)
        context.unwatch[base]?.(), delete context.unwatch[base];
      if (_dispose)
        await dispose(context.mounts[base]);
      context.mountpoints = context.mountpoints.filter((key) => key !== base), delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey(key) + ":";
      let m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      return base = normalizeKey(base), getMounts(base, opts.parents).map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {};
}
async function dispose(driver) {
  if (typeof driver.dispose === "function")
    await asyncCall(driver.dispose);
}

// ../../node_modules/.bun/unstorage@2.0.0-beta.0/node_modules/unstorage/dist/_chunks/node-fs.mjs
import { existsSync, promises } from "node:fs";
import { basename, dirname, join as join2, resolve } from "node:path";
import { randomUUID as randomUUID3 } from "node:crypto";
function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
var TMP_FILE_PREFIX = ".unstorage-tmp-", TMP_FILE_RE = /^\.unstorage-tmp-[\da-z-]+$/, _tmpFileId = `${process.pid.toString(36)}-${randomUUID3().slice(0, 8)}-`, _tmpFileCounter = 0;
async function writeFile3(path, data, encoding, atomic) {
  let dir = dirname(path);
  if (await ensuredir(dir), !atomic)
    return promises.writeFile(path, data, encoding);
  let tmp = join2(dir, TMP_FILE_PREFIX + _tmpFileId + (_tmpFileCounter++).toString(36));
  try {
    let [, destMode] = await Promise.all([promises.writeFile(tmp, data, encoding), promises.stat(path).then((s) => s.mode & 4095).catch((error) => {
      if (error.code === "ENOENT")
        return;
      throw error;
    })]);
    if (destMode !== void 0)
      await promises.chmod(tmp, destMode);
    await promises.rename(tmp, path);
  } catch (error) {
    throw await promises.unlink(tmp).catch(() => {}), error;
  }
}
function readFile4(path, encoding) {
  return promises.readFile(path, encoding ?? null).catch(ignoreNotfound);
}
function unlink2(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: !0 }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir))
    return;
  await ensuredir(dirname(dir)).catch(ignoreExists), await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir))
    return [];
  let entries = await readdir(dir), files = [];
  return await Promise.all(entries.map(async (entry) => {
    let entryPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      if (maxDepth === void 0 || maxDepth > 0) {
        let dirFiles = await readdirRecursive(entryPath, ignore, maxDepth === void 0 ? void 0 : maxDepth - 1);
        files.push(...dirFiles.map((f) => entry.name + "/" + f));
      }
    } else if (!(ignore && ignore(entryPath)) && !TMP_FILE_RE.test(entry.name))
      files.push(entry.name);
  })), files;
}
async function rmRecursive(dir) {
  let entries = await readdir(dir);
  await Promise.all(entries.map((entry) => {
    let entryPath = resolve(dir, entry.name);
    if (entry.isDirectory())
      return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
    else
      return promises.unlink(entryPath);
  }));
}

// ../../node_modules/.bun/unstorage@2.0.0-beta.0/node_modules/unstorage/dist/drivers/fs-lite.mjs
import { existsSync as existsSync2, promises as promises2 } from "node:fs";
import { join as join3, resolve as resolve2 } from "node:path";
var PATH_TRAVERSE_RE = /\.\.:|\.\.$/, DRIVER_NAME2 = "fs-lite", driver2 = (opts = {}) => {
  if (!opts.base)
    throw createRequiredError(DRIVER_NAME2, "base");
  let base = resolve2(opts.base), r = (key) => {
    if (PATH_TRAVERSE_RE.test(key))
      throw createError(DRIVER_NAME2, `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`);
    return join3(base, key.replace(/:/g, "/"));
  };
  return {
    name: DRIVER_NAME2,
    options: {
      ...opts,
      base
    },
    flags: { maxDepth: !0 },
    hasItem(key) {
      return existsSync2(r(key));
    },
    getItem(key) {
      return readFile4(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile4(r(key));
    },
    async getMeta(key) {
      let { atime, mtime, size, birthtime, ctime } = await promises2.stat(r(key)).catch(() => ({}));
      return {
        atime,
        mtime,
        size,
        birthtime,
        ctime
      };
    },
    setItem(key, value) {
      if (opts.readOnly)
        return;
      return writeFile3(r(key), value, "utf8", opts.atomic);
    },
    setItemRaw(key, value) {
      if (opts.readOnly)
        return;
      return writeFile3(r(key), value, void 0, opts.atomic);
    },
    removeItem(key) {
      if (opts.readOnly)
        return;
      return unlink2(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear)
        return;
      await rmRecursive(r("."));
    }
  };
};

// ../models/src/model.ts
var CACHE_TTL_MS = 86400000, modelName = (name) => name.replace(/^[^:]+:\s+/u, ""), LimitSchema = number4().int().positive(), RateSchema2 = number4().nonnegative(), TokenCostSchema = object2({
  cacheRead: RateSchema2,
  cacheWrite: RateSchema2,
  input: RateSchema2,
  output: RateSchema2
}), ModelSchema = object2({
  contextWindow: LimitSchema.optional(),
  cost: TokenCostSchema.extend({
    tiers: array2(TokenCostSchema.extend({ inputThreshold: LimitSchema }))
  }).optional(),
  efforts: array2(string4()),
  id: string4().min(1),
  input: array2(string4()),
  maxTokens: LimitSchema.optional(),
  name: string4(),
  output: array2(string4()).min(1),
  reasoning: boolean4(),
  supportsTools: boolean4()
}).superRefine((model, ctx) => {
  if (!model.output.includes("text") && !model.output.includes("decisions"))
    return;
  for (let field of ["cost", "contextWindow", "maxTokens"])
    if (model[field] === void 0)
      ctx.addIssue({ code: "custom", message: "Required for text models", path: [field] });
  if (!model.input.includes("text"))
    ctx.addIssue({ code: "custom", message: "Text input is required", path: ["input"] });
});

// ../models/src/openrouter.ts
var MetadataSchema = lazy(() => union2([
  string4(),
  number4(),
  nan(),
  literal(1 / 0),
  literal(-1 / 0),
  boolean4(),
  _null5(),
  _undefined5(),
  array2(MetadataSchema),
  record(string4(), MetadataSchema)
])), MetadataObjectSchema = record(string4(), MetadataSchema), CatalogSchema = object2({ data: array2(MetadataSchema) }).catchall(MetadataSchema), record2 = (value) => {
  let parsed = MetadataObjectSchema.safeParse(value);
  return parsed.success ? parsed.data : void 0;
}, TextsSchema = array2(unknown2()).transform((values) => values.flatMap((value) => {
  let text = string4().safeParse(value);
  return text.success ? [text.data] : [];
})).catch([]), PriceSchema = union2([number4(), string4().trim().min(1).transform(Number)]).pipe(number4().nonnegative()).transform((amount) => amount * 1e6), LimitSchema2 = number4().int().positive(), TierSchema = MetadataObjectSchema.and(object2({ min_prompt_tokens: LimitSchema2 })), texts = (value) => TextsSchema.parse(value), price = (value, field, optional = !1) => {
  if (optional && (value === void 0 || value === null))
    return 0;
  let amount = PriceSchema.safeParse(value);
  if (!amount.success)
    throw Error(`Invalid OpenRouter price: ${field}`);
  return amount.data;
}, tokenCosts = (pricing) => {
  let input = price(pricing.prompt, "prompt"), output = price(pricing.completion, "completion");
  return {
    cacheRead: price(pricing.input_cache_read, "input_cache_read", !0),
    cacheWrite: price(pricing.input_cache_write, "input_cache_write", !0),
    input,
    output
  };
}, costs = (pricing) => {
  let base = tokenCosts(pricing), tiers = (Array.isArray(pricing.overrides) ? pricing.overrides : []).flatMap((value) => {
    let tier = TierSchema.safeParse(value);
    if (!tier.success)
      return [];
    return [
      {
        ...tokenCosts({ ...pricing, ...tier.data }),
        inputThreshold: tier.data.min_prompt_tokens
      }
    ];
  }).toSorted((a, b) => a.inputThreshold - b.inputThreshold);
  return { ...base, tiers };
}, limit = (value, field) => {
  let parsed = LimitSchema2.safeParse(value);
  if (!parsed.success)
    throw Error(`Invalid OpenRouter token limit: ${field}`);
  return parsed.data;
}, EFFORTS = ["minimal", "low", "medium", "high", "xhigh", "max"], normalizeModel = (payload) => {
  let model = record2(payload), id = string4().min(1).safeParse(model?.id);
  if (model === void 0 || !id.success)
    throw TypeError("Invalid OpenRouter model ID");
  let architecture = record2(model.architecture), output = texts(architecture?.output_modalities);
  if (output.length === 0)
    throw Error(`Missing OpenRouter output modalities: ${id.data}`);
  let input = texts(architecture?.input_modalities), parameters = texts(model.supported_parameters), efforts = texts(record2(model.reasoning)?.supported_efforts), name = string4().safeParse(model.name ?? id.data);
  if (!name.success)
    throw TypeError(`Invalid OpenRouter model name: ${id.data}`);
  let normalized = {
    efforts: EFFORTS.filter((effort) => efforts.includes(effort)),
    id: id.data,
    input,
    name: modelName(name.data),
    output,
    reasoning: parameters.includes("reasoning") || parameters.includes("reasoning_effort"),
    supportsTools: parameters.includes("tools")
  };
  if (!output.includes("text") && !output.includes("decisions"))
    return normalized;
  if (!input.includes("text"))
    throw Error(`Unsupported OpenRouter input: ${id.data}`);
  return normalized.cost = costs(record2(model.pricing) ?? {}), normalized.contextWindow = limit(model.context_length, "context_length"), normalized.maxTokens = limit(record2(model.top_provider)?.max_completion_tokens, "max_completion_tokens"), normalized;
}, MODELS_URL = "https://openrouter.ai/api/v1/models?output_modalities=all", pending2, snapshot, fetchCatalog = async () => {
  let response = await fetch(MODELS_URL, { signal: AbortSignal.timeout(8000) });
  if (!response.ok)
    throw Error(`OpenRouter returned HTTP ${response.status}.`);
  let catalog = CatalogSchema.safeParse(await response.json());
  if (!catalog.success)
    throw TypeError("Invalid OpenRouter catalog.");
  return { data: catalog.data.data, fetchedAt: Date.now() };
}, readCatalog2 = async (refresh = !1) => {
  let age = Date.now() - (snapshot?.fetchedAt ?? 0);
  if (!refresh && snapshot !== void 0 && age >= 0 && age < CACHE_TTL_MS)
    return snapshot;
  pending2 ??= fetchCatalog();
  try {
    return snapshot = await pending2, snapshot;
  } finally {
    pending2 = void 0;
  }
}, catalogModel = (catalog, id) => {
  let model = catalog.data.find((entry) => record2(entry)?.id === id);
  if (model === void 0)
    throw Error(`Router model missing from OpenRouter metadata: ${id}`);
  return { fetchedAt: catalog.fetchedAt, model: normalizeModel(model) };
};
var fetchModels = async (ids) => {
  if (ids.length === 0)
    return [];
  let catalog = await readCatalog2(!0);
  return ids.map((id) => catalogModel(catalog, id));
};

// ../models/src/index.ts
var CachedModelSchema = object2({ fetchedAt: number4(), model: ModelSchema }), Storage = createStorage({
  driver: driver2({
    atomic: !0,
    base: path4.join(envPaths("forge-extensions", { suffix: "" }).cache, "models")
  })
}), cacheKey = (id) => `${createHash2("sha256").update(id).digest("hex")}.json`;
var refreshModels = async (ids) => {
  let entries = await fetchModels(ids);
  return await Promise.all(entries.map(async (entry) => {
    await Storage.setItem(cacheKey(entry.model.id), entry);
  })), entries.map(({ model }) => model);
};

// ../models/src/router-catalog.ts
var RouterResponseSchema = object2({ data: array2(object2({ id: string4().min(1) })) }), RouterCatalogSchema = object2({
  data: array2(ModelSchema),
  discoveredAt: exports_iso2.datetime(),
  fetchedAt: exports_iso2.datetime(),
  version: literal(1)
}), scope = (baseUrl, key) => [
  "router",
  baseUrl.replace(/\/+$/u, ""),
  key
], readRouterCatalog = async (baseUrl, key) => await readCatalog(scope(baseUrl, key), RouterCatalogSchema), writeRouterCatalog = async (baseUrl, key, catalog) => {
  await writeCatalog(scope(baseUrl, key), RouterCatalogSchema.parse({ ...catalog, version: 1 }));
}, Pending = /* @__PURE__ */ new Map, refreshRouterCatalog = async (baseUrl, key) => {
  let id = JSON.stringify(scope(baseUrl, key)), pending = Pending.get(id);
  if (!pending)
    pending = (async () => {
      let response = await fetch(`${baseUrl.replace(/\/+$/u, "")}/models`, {
        headers: { Authorization: `Bearer ${key}` },
        redirect: "error",
        signal: AbortSignal.timeout(8000)
      });
      if (!response.ok)
        throw Error(`Forge Router model endpoint returned HTTP ${response.status}.`);
      let router = RouterResponseSchema.parse(await response.json()), ids = [...new Set(router.data.map(({ id: modelID }) => modelID))], data = await refreshModels(ids), timestamp = (/* @__PURE__ */ new Date()).toISOString(), catalog = {
        data,
        discoveredAt: timestamp,
        fetchedAt: timestamp,
        version: 1
      };
      return await writeRouterCatalog(baseUrl, key, catalog), catalog;
    })(), Pending.set(id, pending);
  try {
    return await pending;
  } finally {
    if (Pending.get(id) === pending)
      Pending.delete(id);
  }
};
// node_modules/zod/v4/core/util.js
function getEnumValues3(entries) {
  let numericValues = Object.values(entries).filter((v) => typeof v === "number");
  return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
}
function joinValues2(array, separator = "|") {
  return array.map((val) => stringifyPrimitive2(val)).join(separator);
}
function jsonStringifyReplacer3(_, value) {
  if (typeof value === "bigint")
    return value.toString();
  return value;
}

class Cached2 {
  constructor(getter) {
    this._getter = getter, this._value = void 0;
  }
  get value() {
    let getter = this._getter;
    if (getter !== void 0)
      this._value = getter(), this._getter = void 0;
    return this._value;
  }
}
function cached3(getter) {
  return new Cached2(getter);
}
function nullish3(input) {
  return input === null || input === void 0;
}
function cleanRegex3(source) {
  let start = source.startsWith("^") ? 1 : 0, end = source.endsWith("$") ? source.length - 1 : source.length;
  return source.slice(start, end);
}
function floatSafeRemainder3(val, step) {
  let ratio = val / step, roundedRatio = Math.round(ratio), tolerance = 4 * Number.EPSILON * Math.max(Math.abs(ratio), 1);
  if (Math.abs(ratio - roundedRatio) < tolerance)
    return 0;
  return ratio - roundedRatio;
}
function assignProp3(target, prop, value) {
  Object.defineProperty(target, prop, {
    value,
    writable: !0,
    enumerable: !0,
    configurable: !0
  });
}
function rawShape2(def) {
  let desc = Object.getOwnPropertyDescriptor(def, "shape");
  return desc?.get ? desc.get.raw : desc?.value;
}
function sourceShape2(schema) {
  return rawShape2(schema._zod.def) ?? schema._zod.def.shape;
}
function deferProp2(target, key, getter) {
  Object.defineProperty(target, key, {
    get() {
      let value = getter();
      return assignProp3(this, key, value), value;
    },
    enumerable: !0,
    configurable: !0
  });
}
function putProp2(target, key, value) {
  if (key in target)
    assignProp3(target, key, value);
  else
    target[key] = value;
}
function mirrorShape2(target, source, keys, wrap) {
  let raw = sourceShape2(source);
  for (let key of keys) {
    let desc = Object.getOwnPropertyDescriptor(raw, key);
    if (!desc.enumerable)
      continue;
    if (desc.get)
      deferProp2(target, key, () => {
        let value = source._zod.def.shape[key];
        return wrap ? wrap(value, key) : value;
      });
    else
      putProp2(target, key, wrap ? wrap(desc.value, key) : desc.value);
  }
}
function mirrorProps2(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    let desc = Object.getOwnPropertyDescriptor(source, key);
    if (!desc.enumerable)
      continue;
    if (desc.get)
      deferProp2(target, key, () => source[key]);
    else
      putProp2(target, key, desc.value);
  }
}
function mergeDefs3(...defs) {
  let mergedDescriptors = {};
  for (let def of defs) {
    let descriptors = Object.getOwnPropertyDescriptors(def);
    Object.assign(mergedDescriptors, descriptors);
  }
  return Object.defineProperties({}, mergedDescriptors);
}
function esc3(str) {
  return JSON.stringify(str);
}
function slugify3(input) {
  return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var captureStackTrace3 = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
function isObject4(data) {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}
var allowsEval3 = /* @__PURE__ */ cached3(() => {
  if (globalConfig3.jitless)
    return !1;
  if (typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare"))
    return !1;
  try {
    return new Function(""), !0;
  } catch (_) {
    return !1;
  }
});
function isPlainObject3(o) {
  if (isObject4(o) === !1)
    return !1;
  let ctor = o.constructor;
  if (ctor === void 0)
    return !0;
  if (typeof ctor !== "function")
    return !0;
  let prot = ctor.prototype;
  if (isObject4(prot) === !1)
    return !1;
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === !1)
    return !1;
  return !0;
}
function shallowClone3(o) {
  if (isPlainObject3(o))
    return { ...o };
  if (Array.isArray(o))
    return [...o];
  if (o instanceof Map)
    return new Map(o);
  if (o instanceof Set)
    return new Set(o);
  return o;
}
var propertyKeyTypes3 = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
function escapeRegex3(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone3(inst, def, params) {
  let cl = new inst._zod.constr(def ?? inst._zod.def);
  if (!def || params?.parent)
    cl._zod.parent = inst;
  return cl;
}
function normalizeParams3(_params) {
  let params = _params;
  if (!params)
    return {};
  if (typeof params === "string")
    return { error: () => params };
  if (params?.message !== void 0) {
    if (params?.error !== void 0)
      throw Error("Cannot specify both `message` and `error` params");
    params.error = params.message;
  }
  if (delete params.message, typeof params.error === "string")
    return { ...params, error: () => params.error };
  return params;
}
function stringifyPrimitive2(value) {
  if (typeof value === "bigint")
    return value.toString() + "n";
  if (typeof value === "string")
    return `"${value}"`;
  return `${value}`;
}
function optionalKeys3(shape) {
  return Object.keys(shape).filter((k) => shape[k]._zod.optin !== void 0 && shape[k]._zod.optout === "optional");
}
var NUMBER_FORMAT_RANGES3 = /* @__PURE__ */ (() => ({
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-340282346638528860000000000000000000000, 340282346638528860000000000000000000000],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
}))(), BIGINT_FORMAT_RANGES3 = {
  int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
  uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
};
function pick3(schema, mask) {
  let currDef = schema._zod.def, checks = currDef.checks;
  if (checks && checks.length > 0)
    throw Error(".pick() cannot be used on object schemas containing refinements");
  let newShape = {};
  return mirrorShape2(newShape, schema, maskedKeys2(schema, mask)), clone3(schema, mergeDefs3(currDef, { shape: newShape, checks: [] }));
}
function maskedKeys2(schema, mask) {
  let raw = sourceShape2(schema), keys = [];
  for (let key of Reflect.ownKeys(mask)) {
    if (!Object.getOwnPropertyDescriptor(raw, key)?.enumerable)
      throw Error(`Unrecognized key: "${String(key)}"`);
    if (mask[key])
      keys.push(key);
  }
  return keys;
}
function omit3(schema, mask) {
  let currDef = schema._zod.def, checks = currDef.checks;
  if (checks && checks.length > 0)
    throw Error(".omit() cannot be used on object schemas containing refinements");
  let omitted = new Set(maskedKeys2(schema, mask)), newShape = {};
  return mirrorShape2(newShape, schema, Reflect.ownKeys(sourceShape2(schema)).filter((key) => !omitted.has(key))), clone3(schema, mergeDefs3(currDef, { shape: newShape, checks: [] }));
}
function extend3(schema, shape) {
  if (!isPlainObject3(shape))
    throw Error("Invalid input to extend: expected a plain object");
  let checks = schema._zod.def.checks;
  if (checks && checks.length > 0) {
    let existingShape = sourceShape2(schema);
    for (let key of Reflect.ownKeys(shape))
      if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0)
        throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
  }
  return clone3(schema, mergeDefs3(schema._zod.def, { shape: extended2(schema, shape) }));
}
function extended2(schema, shape) {
  let newShape = {};
  return mirrorShape2(newShape, schema, Reflect.ownKeys(sourceShape2(schema))), mirrorProps2(newShape, shape), newShape;
}
function safeExtend3(schema, shape) {
  if (!isPlainObject3(shape))
    throw Error("Invalid input to safeExtend: expected a plain object");
  return clone3(schema, mergeDefs3(schema._zod.def, { shape: extended2(schema, shape) }));
}
function merge3(a, b) {
  if (!b?._zod?.def)
    throw Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
  if (a._zod.def.checks?.length)
    throw Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
  let newShape = {};
  mirrorShape2(newShape, a, Reflect.ownKeys(sourceShape2(a))), mirrorShape2(newShape, b, Reflect.ownKeys(sourceShape2(b)));
  let def = mergeDefs3(a._zod.def, {
    shape: newShape,
    get catchall() {
      return b._zod.def.catchall;
    },
    checks: b._zod.def.checks ?? []
  });
  return clone3(a, def);
}
function partial3(Class, schema, mask, name = "partial") {
  let checks = schema._zod.def.checks;
  if (checks && checks.length > 0)
    throw Error(`.${name}() cannot be used on object schemas containing refinements`);
  let selected = mask ? new Set(maskedKeys2(schema, mask)) : void 0, newShape = {};
  return mirrorShape2(newShape, schema, Reflect.ownKeys(sourceShape2(schema)), Class && ((value, key) => selected && !selected.has(key) ? value : new Class({ type: "optional", innerType: value }))), clone3(schema, mergeDefs3(schema._zod.def, { shape: newShape, checks: [] }));
}
function required3(Class, schema, mask) {
  let selected = mask ? new Set(maskedKeys2(schema, mask)) : void 0, newShape = {};
  return mirrorShape2(newShape, schema, Reflect.ownKeys(sourceShape2(schema)), (value, key) => selected && !selected.has(key) ? value : new Class({ type: "nonoptional", innerType: value })), clone3(schema, mergeDefs3(schema._zod.def, { shape: newShape }));
}
function aborted3(x, startIndex = 0) {
  if (x.aborted === !0)
    return !0;
  for (let i = startIndex;i < x.issues.length; i++)
    if (x.issues[i]?.continue !== !0)
      return !0;
  return !1;
}
function explicitlyAborted2(x, startIndex = 0) {
  if (x.aborted === !0)
    return !0;
  for (let i = startIndex;i < x.issues.length; i++)
    if (x.issues[i]?.continue === !1)
      return !0;
  return !1;
}
function prefixIssues3(path, issues) {
  return issues.map((iss) => {
    var _a;
    return (_a = iss).path ?? (_a.path = []), iss.path.unshift(path), iss;
  });
}
function unwrapMessage3(message) {
  return typeof message === "string" ? message : message?.message;
}
function attachSchema2(issues, start, inst) {
  var _a;
  for (let i = start;i < issues.length; i++)
    (_a = issues[i]).schema ?? (_a.schema = inst);
}
function finalizeIssue3(iss, ctx, config) {
  var _a;
  let traits = iss.inst?._zod?.traits;
  if (traits?.has("$ZodType"))
    if (traits.has("$ZodCheck"))
      (_a = iss).schema ?? (_a.schema = iss.inst);
    else
      iss.schema = iss.inst;
  let schemaError = iss.schema !== iss.inst ? iss.schema?._zod.def?.error : void 0, message = iss.message ? iss.message : unwrapMessage3(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage3(schemaError?.(iss)) ?? unwrapMessage3(ctx?.error?.(iss)) ?? unwrapMessage3(config.customError?.(iss)) ?? unwrapMessage3(config.localeError?.(iss)) ?? "Invalid input", full = {};
  for (let k of Object.keys(iss)) {
    if (k === "inst" || k === "schema" || k === "continue" || k === "input" || k === "__proto__")
      continue;
    full[k] = iss[k];
  }
  if (full.path ?? (full.path = []), full.message = message, ctx?.reportInput)
    full.input = iss.input;
  return full;
}
var highSurrogate2 = /[\uD800-\uDBFF]/;
function codePointLength2(str) {
  let units = str.length;
  if (!highSurrogate2.test(str))
    return units;
  let count = units;
  for (let i = 0;i < units - 1; i++)
    if ((str.charCodeAt(i) & 64512) === 55296 && (str.charCodeAt(i + 1) & 64512) === 56320)
      count--, i++;
  return count;
}
function getLengthableOrigin3(input) {
  if (Array.isArray(input))
    return "array";
  if (typeof input === "string")
    return "string";
  return "unknown";
}
function parsedType2(data) {
  let t = typeof data;
  switch (t) {
    case "number":
      return Number.isNaN(data) ? "nan" : "number";
    case "object": {
      if (data === null)
        return "null";
      if (Array.isArray(data))
        return "array";
      let obj = data;
      if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor)
        return obj.constructor.name;
    }
  }
  return t;
}
function issue3(...args) {
  let [iss, input, inst] = args;
  if (typeof iss === "string")
    return {
      message: iss,
      code: "custom",
      input,
      inst
    };
  return { ...iss };
}
function members2(proto, table) {
  for (let key in table) {
    let desc = Object.getOwnPropertyDescriptor(table, key);
    if (desc.get)
      Object.defineProperty(proto, key, { ...desc, enumerable: !1 });
    else
      defineBound2(proto, key, desc.value);
  }
}
function own2(inst, key, value, enumerable = !0) {
  return Object.defineProperty(inst, key, { configurable: !0, writable: !0, enumerable, value }), value;
}
function hide2(inst, key, value) {
  return own2(inst, key, value, !1);
}
function derived2(computes, table) {
  for (let key in computes) {
    let compute = computes[key];
    Object.defineProperty(table, key, {
      configurable: !0,
      enumerable: !0,
      get() {
        return own2(this, key, compute(this));
      },
      set(value) {
        own2(this, key, value);
      }
    });
  }
  return table;
}
function defineBound2(proto, key, fn) {
  Object.defineProperty(proto, key, {
    configurable: !0,
    get() {
      return this == null ? fn : own2(this, key, fn.bind(this));
    },
    set(value) {
      own2(this, key, value);
    }
  });
}
function claim2(inst, sentinel) {
  let proto = Object.getPrototypeOf(inst);
  return sentinel in proto ? void 0 : proto;
}
var installing2, broke2 = !1, breaker2 = {
  configurable: !0,
  get() {
    broke2 = !0;
    return;
  }
};
function defineLazyInternal2(inst, key, compute) {
  let proto = Object.getPrototypeOf(inst._zod);
  if (key in proto && installing2 !== inst._zod) {
    installing2 = void 0;
    return;
  }
  installing2 = inst._zod, Object.defineProperty(proto, key, {
    configurable: !0,
    get() {
      Object.defineProperty(this, key, breaker2);
      let outer = broke2;
      broke2 = !1;
      try {
        let value = compute(this);
        if (broke2)
          delete this[key];
        else
          Object.defineProperty(this, key, { configurable: !0, writable: !0, value });
        return broke2 = broke2 || outer, value;
      } catch (err) {
        throw delete this[key], broke2 = broke2 || outer, err;
      }
    },
    set(value) {
      Object.defineProperty(this, key, { configurable: !0, writable: !0, value });
    }
  });
}
function installLazyProp2(inst, key, make, enumerable) {
  let proto = claim2(inst, key);
  if (!proto)
    return;
  Object.defineProperty(proto, key, {
    configurable: !0,
    get() {
      let desc = { configurable: !0, writable: !0, enumerable, value: void 0 };
      return Object.defineProperty(this, key, desc), desc.value = make(this), Object.defineProperty(this, key, desc), desc.value;
    },
    set(value) {
      Object.defineProperty(this, key, { configurable: !0, writable: !0, enumerable, value });
    }
  });
}
var CONSTANT_CATCH2 = "~constantCatch";
function constantCatch2(value) {
  let fn = () => value;
  return fn[CONSTANT_CATCH2] = !0, fn;
}

// node_modules/zod/v4/core/core.js
var _a4, NEVER2 = /* @__PURE__ */ Object.freeze({
  status: "aborted"
}), _zodDesc2 = { value: void 0, enumerable: !1 }, _E2 = "captureStackTrace" in Error ? Error : null;
function newError2(Definition) {
  let E = _E2;
  if (E) {
    let saved = E.stackTraceLimit;
    if (typeof saved === "number") {
      try {
        E.stackTraceLimit = 0;
      } catch {
        return _E2 = null, new Definition;
      }
      try {
        return new Definition;
      } finally {
        E.stackTraceLimit = saved;
      }
    }
  }
  return new Definition;
}
function $constructor3(name, initializer, proto, params) {
  let zodProto = {};
  function Internals(def) {
    this.def = def, this.constr = _, this.traits = /* @__PURE__ */ new Set;
  }
  Internals.prototype = zodProto;
  let protoMembers = proto, initialized = protoMembers && /* @__PURE__ */ new WeakSet;
  function init(inst, def) {
    if (!inst._zod) {
      _zodDesc2.value = new Internals(def);
      try {
        Object.defineProperty(inst, "_zod", _zodDesc2);
      } finally {
        _zodDesc2.value = void 0;
      }
    } else if (inst._zod.traits.has(name))
      return;
    if (inst._zod.traits.add(name), initializer(inst, def), initialized) {
      let own = Object.getPrototypeOf(inst), ctorProto = inst._zod.constr.prototype, up = own;
      while (up && up !== ctorProto)
        up = Object.getPrototypeOf(up);
      let target = up ?? own;
      if (!initialized.has(target))
        initialized.add(target), members2(target, protoMembers);
    }
    let proto = _.prototype;
    for (let k in proto) {
      if (!Object.prototype.hasOwnProperty.call(proto, k))
        continue;
      if (!(k in inst))
        inst[k] = proto[k].bind(inst);
    }
  }
  let Parent = params?.Parent ?? Object;

  class Definition extends Parent {
  }
  Object.defineProperty(Definition, "name", { value: name });
  function _(def) {
    let inst = params?.Parent ? newError2(Definition) : this;
    init(inst, def);
    let deferred = inst._zod.deferred;
    if (deferred) {
      for (let fn of deferred)
        fn();
      inst._zod.deferred = void 0;
    }
    let pp = globalThis.__zod_globalConfig?.postProcessor;
    if (pp)
      pp(inst);
    return inst;
  }
  return Object.defineProperty(_, "init", { value: init }), Object.defineProperty(_, Symbol.hasInstance, {
    value: (inst) => {
      if (params?.Parent && inst instanceof params.Parent)
        return !0;
      return inst?._zod?.traits?.has(name);
    }
  }), Object.defineProperty(_, "name", { value: name }), _;
}
class $ZodAsyncError3 extends Error {
  constructor() {
    super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
  }
}

class $ZodEncodeError3 extends Error {
  constructor(name) {
    super(`Encountered unidirectional transform during encode: ${name}`);
    this.name = "ZodEncodeError";
  }
}
(_a4 = globalThis).__zod_globalConfig ?? (_a4.__zod_globalConfig = {});
var globalConfig3 = globalThis.__zod_globalConfig;
function config3(newConfig) {
  if (newConfig)
    Object.assign(globalConfig3, newConfig);
  return globalConfig3;
}
// node_modules/zod/v4/core/errors.js
function _getMessage2() {
  let internals = this._zod;
  return internals.message ?? (internals.message = JSON.stringify(internals.def, jsonStringifyReplacer3, 2)), internals.message;
}
function _setMessage2(value) {
  this._zod.message = value;
}
var _messageDesc2 = {
  get: _getMessage2,
  set: _setMessage2,
  enumerable: !0,
  configurable: !0
}, _issuesDesc2 = { value: void 0, enumerable: !1 }, _installedToString2 = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]), initializer5 = (inst, def) => {
  inst.name = "$ZodError", _issuesDesc2.value = def, Object.defineProperty(inst, "issues", _issuesDesc2), _issuesDesc2.value = void 0, Object.defineProperty(inst, "message", _messageDesc2);
  let proto = Object.getPrototypeOf(inst);
  if (!_installedToString2.has(proto))
    _installedToString2.add(proto), Object.defineProperty(proto, "toString", {
      configurable: !0,
      enumerable: !1,
      get() {
        let value = () => this.message;
        return Object.defineProperty(this, "toString", { value, configurable: !0, writable: !0 }), value;
      },
      set(value) {
        Object.defineProperty(this, "toString", { value, configurable: !0, writable: !0 });
      }
    });
}, $ZodError3 = $constructor3("$ZodError", initializer5), $ZodRealError3 = $constructor3("$ZodError", initializer5, void 0, {
  Parent: Error
});
function node2(obj, key, make) {
  if (!Object.prototype.hasOwnProperty.call(obj, key))
    if (key === "__proto__")
      Object.defineProperty(obj, key, { value: make(), writable: !0, enumerable: !0, configurable: !0 });
    else
      obj[key] = make();
  return obj[key];
}
function flattenError3(error, mapper = (issue) => issue.message) {
  let fieldErrors = {}, formErrors = [];
  for (let sub of error.issues)
    if (sub.path.length > 0)
      node2(fieldErrors, sub.path[0], () => []).push(mapper(sub));
    else
      formErrors.push(mapper(sub));
  return { formErrors, fieldErrors };
}
function formatError3(error, mapper = (issue) => issue.message) {
  let fieldErrors = { _errors: [] }, processError = (error, path = []) => {
    for (let issue of error.issues)
      if (issue.code === "invalid_union" && issue.errors.length)
        issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
      else if (issue.code === "invalid_key")
        processError({ issues: issue.issues }, [...path, ...issue.path]);
      else if (issue.code === "invalid_element")
        processError({ issues: issue.issues }, [...path, ...issue.path]);
      else {
        let fullpath = [...path, ...issue.path];
        if (fullpath.length === 0)
          fieldErrors._errors.push(mapper(issue));
        else {
          let curr = fieldErrors, i = 0;
          while (i < fullpath.length) {
            let el = fullpath[i], terminal = i === fullpath.length - 1;
            if (el === "_errors") {
              if (terminal)
                curr._errors.push(mapper(issue));
              i++;
              continue;
            }
            if (!Object.prototype.hasOwnProperty.call(curr, el))
              Object.defineProperty(curr, el, {
                value: { _errors: [] },
                enumerable: !0,
                writable: !0,
                configurable: !0
              });
            let node = curr[el];
            if (terminal)
              node._errors.push(mapper(issue));
            curr = node, i++;
          }
        }
      }
  };
  return processError(error), fieldErrors;
}

// node_modules/zod/v4/core/parse.js
function finalizeParams2(callee, params) {
  return { callee: params?.callee ?? callee, Err: params?.Err };
}
var _parse3 = (_Err) => {
  let fn = (schema, value, _ctx, _params) => {
    let ctx = _ctx ? { ..._ctx, async: !1 } : { async: !1 }, result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
      throw new $ZodAsyncError3;
    if (result.issues.length) {
      let e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue3(iss, ctx, config3())));
      throw captureStackTrace3(e, _params?.callee ?? fn), e;
    }
    return result.value;
  };
  return fn;
};
var _parseAsync3 = (_Err) => {
  let fn = async (schema, value, _ctx, params) => {
    let ctx = _ctx ? { ..._ctx, async: !0 } : { async: !0 }, result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
      result = await result;
    if (result.issues.length) {
      let e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue3(iss, ctx, config3())));
      throw captureStackTrace3(e, params?.callee ?? fn), e;
    }
    return result.value;
  };
  return fn;
};
var _safeParse3 = (_Err) => (schema, value, _ctx) => {
  let ctx = _ctx ? { ..._ctx, async: !1 } : { async: !1 }, result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    throw new $ZodAsyncError3;
  return result.issues.length ? failure2(_Err, result.issues, ctx) : { success: !0, data: result.value };
};
function failure2(Err, issues, ctx) {
  let error;
  return {
    success: !1,
    get error() {
      if (!error)
        error = new Err(issues.map((iss) => finalizeIssue3(iss, ctx, config3()))), issues = void 0, ctx = void 0;
      return error;
    },
    set error(e) {
      error = e, issues = void 0, ctx = void 0;
    }
  };
}
var _safeParseAsync3 = (_Err) => async (schema, value, _ctx) => {
  let ctx = _ctx ? { ..._ctx, async: !0 } : { async: !0 }, result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length ? failure2(_Err, result.issues, ctx) : { success: !0, data: result.value };
};
var COMPILE_INVALID2 = /* @__PURE__ */ Symbol.for("zod.compile.invalid"), COMPILE_FALLBACK2 = /* @__PURE__ */ Symbol.for("zod.compile.fallback"), validate2 = (schema, value, _ctx) => {
  let validator = schema._zod.bag.validator;
  if (validator !== void 0) {
    if (validator(value) !== COMPILE_INVALID2)
      return !0;
    if (validator.definite === !0 && _ctx === void 0)
      return !1;
  }
  return validateFallback2(schema, value, _ctx);
};
function validateFallback2(schema, value, _ctx) {
  let ctx = _ctx ? { ..._ctx, async: !1, abortEarly: !0 } : { async: !1, abortEarly: !0 }, fallbackRun = schema._zod.bag.fallbackRun, result;
  if (fallbackRun)
    ctx[COMPILE_FALLBACK2] = !0, result = fallbackRun({ value, issues: [] }, ctx);
  else
    result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    throw new $ZodAsyncError3;
  return result.issues.length === 0;
}
var validateAsync3 = async (schema, value, _ctx) => {
  let ctx = _ctx ? { ..._ctx, async: !0, abortEarly: !0 } : { async: !0, abortEarly: !0 }, result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length === 0;
}, _encode3 = (_Err) => {
  let parse = _parse3(_Err), fn = (schema, value, _ctx, _params) => {
    let ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
    return parse(schema, value, ctx, finalizeParams2(fn, _params));
  };
  return fn;
};
var _decode3 = (_Err) => {
  let parse = _parse3(_Err), fn = (schema, value, _ctx, _params) => parse(schema, value, _ctx, finalizeParams2(fn, _params));
  return fn;
};
var _encodeAsync3 = (_Err) => {
  let parseAsync = _parseAsync3(_Err), fn = async (schema, value, _ctx, _params) => {
    let ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
    return await parseAsync(schema, value, ctx, finalizeParams2(fn, _params));
  };
  return fn;
};
var _decodeAsync3 = (_Err) => {
  let parseAsync = _parseAsync3(_Err), fn = async (schema, value, _ctx, _params) => await parseAsync(schema, value, _ctx, finalizeParams2(fn, _params));
  return fn;
};
var _safeEncode3 = (_Err) => (schema, value, _ctx) => {
  let ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParse3(_Err)(schema, value, ctx);
};
var _safeDecode3 = (_Err) => (schema, value, _ctx) => _safeParse3(_Err)(schema, value, _ctx);
var _safeEncodeAsync3 = (_Err) => async (schema, value, _ctx) => {
  let ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParseAsync3(_Err)(schema, value, ctx);
};
var _safeDecodeAsync3 = (_Err) => async (schema, value, _ctx) => _safeParseAsync3(_Err)(schema, value, _ctx);
// node_modules/zod/v4/core/regexes.js
var cuid4 = /^[cC][0-9a-z]{6,}$/, cuid23 = /^[0-9a-z]+$/, ulid3 = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/, xid3 = /^[0-9a-vA-V]{20}$/, ksuid3 = /^[A-Za-z0-9]{27}$/, nanoid3 = /^[a-zA-Z0-9_-]{21}$/;
function nanoidOfLength2(length) {
  return new RegExp(`^[a-zA-Z0-9_-]{${length}}$`);
}
var duration5 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
var guid3 = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, uuid3 = (version) => {
  if (!version)
    return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
  return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
var email3 = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
var _emoji5 = "^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$";
function emoji3() {
  return new RegExp(_emoji5, "u");
}
var ipv43 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, ipv63 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
var cidrv43 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, cidrv63 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, base643 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, base64url3 = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/;
var httpProtocol2 = /^https?$/, e1643 = /^\+[1-9]\d{6,14}$/;
var dateSource3 = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))";
function anchor2(source) {
  return new RegExp(`^${source}$`);
}
var date5 = /* @__PURE__ */ anchor2(dateSource3);
function timeSource3(args) {
  return typeof args.precision === "number" ? args.precision === -1 ? "(?:[01]\\d|2[0-3]):[0-5]\\d" : args.precision === 0 ? "(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d" : `(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{${args.precision}}` : args.seconds ? "(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d+)?" : "(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?";
}
function time5(args) {
  return new RegExp(`^${timeSource3(args)}$`);
}
function datetime5(args) {
  let opts = ["Z"];
  if (args.offset)
    opts.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
  let qualified = `${timeSource3({ precision: args.precision, seconds: !0 })}(?:${opts.join("|")})`, timeRegex = args.local ? `${qualified}|${timeSource3({ precision: args.precision })}` : qualified;
  return new RegExp(`^${dateSource3}T(?:${timeRegex})$`);
}
var anyString2 = /^[\s\S]{0,}$/;
var integer3 = /^-?\d+$/, number5 = /^-?\d+(?:\.\d+)?$/;
var lowercase3 = /^[^A-Z]*$/, uppercase3 = /^[^a-z]*$/;

// node_modules/zod/v4/core/checks.js
var $ZodCheck3 = /* @__PURE__ */ $constructor3("$ZodCheck", (inst, def) => {
  var _a;
  inst._zod ?? (inst._zod = {}), inst._zod.def = def, (_a = inst._zod).onattach ?? (_a.onattach = []);
});
var _whenHasLength2 = (payload) => {
  let val = payload.value;
  return !nullish3(val) && val.length !== void 0;
}, numericOriginMap3 = {
  number: "number",
  bigint: "bigint",
  object: "date"
}, $ZodCheckLessThan3 = /* @__PURE__ */ $constructor3("$ZodCheckLessThan", (inst, def) => {
  $ZodCheck3.init(inst, def);
  let origin = numericOriginMap3[typeof def.value];
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value <= def.value : payload.value < def.value)
      return;
    payload.issues.push({
      origin: numericOriginMap3[typeof payload.value] ?? origin,
      code: "too_big",
      maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckGreaterThan3 = /* @__PURE__ */ $constructor3("$ZodCheckGreaterThan", (inst, def) => {
  $ZodCheck3.init(inst, def);
  let origin = numericOriginMap3[typeof def.value];
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value >= def.value : payload.value > def.value)
      return;
    payload.issues.push({
      origin: numericOriginMap3[typeof payload.value] ?? origin,
      code: "too_small",
      minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckMultipleOf3 = /* @__PURE__ */ $constructor3("$ZodCheckMultipleOf", (inst, def) => {
  $ZodCheck3.init(inst, def), inst._zod.check = (payload) => {
    if (typeof payload.value !== typeof def.value)
      throw Error("Cannot mix number and bigint in multiple_of check.");
    if (typeof payload.value === "bigint" ? def.value !== BigInt(0) && payload.value % def.value === BigInt(0) : floatSafeRemainder3(payload.value, def.value) === 0)
      return;
    payload.issues.push({
      origin: typeof payload.value,
      code: "not_multiple_of",
      divisor: def.value,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckNumberFormat3 = /* @__PURE__ */ $constructor3("$ZodCheckNumberFormat", (inst, def) => {
  $ZodCheck3.init(inst, def), def.format = def.format || "float64";
  let isInt = def.format?.includes("int"), origin = isInt ? "int" : "number", [minimum, maximum] = NUMBER_FORMAT_RANGES3[def.format];
  inst._zod.check = (payload) => {
    let input = payload.value;
    if (isInt) {
      if (!Number.isInteger(input)) {
        payload.issues.push({
          expected: origin,
          format: def.format,
          code: "invalid_type",
          continue: !1,
          input,
          inst
        });
        return;
      }
      if (!Number.isSafeInteger(input)) {
        if (input > 0)
          payload.issues.push({
            input,
            code: "too_big",
            maximum: Number.MAX_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: !0,
            continue: !def.abort
          });
        else
          payload.issues.push({
            input,
            code: "too_small",
            minimum: Number.MIN_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: !0,
            continue: !def.abort
          });
        return;
      }
    }
    if (input < minimum)
      payload.issues.push({
        origin: "number",
        input,
        code: "too_small",
        minimum,
        inclusive: !0,
        inst,
        continue: !def.abort
      });
    if (input > maximum)
      payload.issues.push({
        origin: "number",
        input,
        code: "too_big",
        maximum,
        inclusive: !0,
        inst,
        continue: !def.abort
      });
  };
});
var $ZodCheckMaxLength3 = /* @__PURE__ */ $constructor3("$ZodCheckMaxLength", (inst, def) => {
  var _a;
  $ZodCheck3.init(inst, def), (_a = inst._zod.def).when ?? (_a.when = _whenHasLength2), inst._zod.check = (payload) => {
    let input = payload.value, units = input.length;
    if ((typeof input === "string" && units > def.maximum ? codePointLength2(input) : units) <= def.maximum)
      return;
    let origin = getLengthableOrigin3(input);
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: def.maximum,
      inclusive: !0,
      input,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckMinLength3 = /* @__PURE__ */ $constructor3("$ZodCheckMinLength", (inst, def) => {
  var _a;
  $ZodCheck3.init(inst, def), (_a = inst._zod.def).when ?? (_a.when = _whenHasLength2), inst._zod.check = (payload) => {
    let input = payload.value, units = input.length;
    if ((typeof input === "string" && units >= def.minimum && units < def.minimum * 2 ? codePointLength2(input) : units) >= def.minimum)
      return;
    let origin = getLengthableOrigin3(input);
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: def.minimum,
      inclusive: !0,
      input,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckLengthEquals3 = /* @__PURE__ */ $constructor3("$ZodCheckLengthEquals", (inst, def) => {
  var _a;
  $ZodCheck3.init(inst, def), (_a = inst._zod.def).when ?? (_a.when = _whenHasLength2), inst._zod.check = (payload) => {
    let input = payload.value, units = input.length, length = typeof input === "string" && units >= def.length && units <= def.length * 2 ? codePointLength2(input) : units;
    if (length === def.length)
      return;
    let origin = getLengthableOrigin3(input), tooBig = length > def.length;
    payload.issues.push({
      origin,
      ...tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length },
      inclusive: !0,
      exact: !0,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckStringFormat3 = /* @__PURE__ */ $constructor3("$ZodCheckStringFormat", (inst, def) => {
  var _a, _b;
  if ($ZodCheck3.init(inst, def), def.pattern)
    (_a = inst._zod).check ?? (_a.check = (payload) => {
      if (def.pattern.lastIndex = 0, def.pattern.test(payload.value))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: def.format,
        input: payload.value,
        ...def.pattern ? { pattern: def.pattern.toString() } : {},
        inst,
        continue: !def.abort
      });
    });
  else
    (_b = inst._zod).check ?? (_b.check = () => {});
}), $ZodCheckRegex3 = /* @__PURE__ */ $constructor3("$ZodCheckRegex", (inst, def) => {
  $ZodCheckStringFormat3.init(inst, def), inst._zod.check = (payload) => {
    if (def.pattern.lastIndex = 0, def.pattern.test(payload.value))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: payload.value,
      pattern: def.pattern.toString(),
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckLowerCase3 = /* @__PURE__ */ $constructor3("$ZodCheckLowerCase", (inst, def) => {
  def.pattern ?? (def.pattern = lowercase3), $ZodCheckStringFormat3.init(inst, def);
}), $ZodCheckUpperCase3 = /* @__PURE__ */ $constructor3("$ZodCheckUpperCase", (inst, def) => {
  def.pattern ?? (def.pattern = uppercase3), $ZodCheckStringFormat3.init(inst, def);
}), $ZodCheckIncludes3 = /* @__PURE__ */ $constructor3("$ZodCheckIncludes", (inst, def) => {
  $ZodCheck3.init(inst, def);
  let escapedRegex = escapeRegex3(def.includes), pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position},}${escapedRegex}` : escapedRegex);
  def.pattern = pattern, inst._zod.check = (payload) => {
    if (payload.value.includes(def.includes, def.position))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: def.includes,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckStartsWith3 = /* @__PURE__ */ $constructor3("$ZodCheckStartsWith", (inst, def) => {
  $ZodCheck3.init(inst, def);
  let pattern = new RegExp(`^${escapeRegex3(def.prefix)}.*`);
  def.pattern ?? (def.pattern = pattern), inst._zod.check = (payload) => {
    if (payload.value.startsWith(def.prefix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: def.prefix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckEndsWith3 = /* @__PURE__ */ $constructor3("$ZodCheckEndsWith", (inst, def) => {
  $ZodCheck3.init(inst, def);
  let pattern = new RegExp(`.*${escapeRegex3(def.suffix)}$`);
  def.pattern ?? (def.pattern = pattern), inst._zod.check = (payload) => {
    if (payload.value.endsWith(def.suffix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: def.suffix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckOverwrite3 = /* @__PURE__ */ $constructor3("$ZodCheckOverwrite", (inst, def) => {
  $ZodCheck3.init(inst, def), inst._zod.check = (payload) => {
    payload.value = def.tx(payload.value);
  };
});

// node_modules/zod/v4/core/doc.js
class Doc3 {
  constructor(args = [], closed = {}) {
    this.content = [], this.indent = 0, this.args = args, this.closed = closed;
  }
  indented(fn) {
    this.indent += 1;
    try {
      fn(this);
    } finally {
      this.indent -= 1;
    }
  }
  write(arg) {
    if (typeof arg === "function") {
      arg(this, { execution: "sync" }), arg(this, { execution: "async" });
      return;
    }
    let lines = arg.split(`
`).filter((x) => x), minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length)), dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
    for (let line of dedented)
      this.content.push(line);
  }
  compile() {
    let F = Function, content = this?.content ?? [""];
    return new F(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {
${content.join(`
`)}
};`)(...Object.values(this.closed));
  }
}

// node_modules/zod/v4/core/versions.js
var version3 = {
  major: 4,
  minor: 6,
  patch: 5
};

// node_modules/zod/v4/core/schemas.js
var $ZodType3 = /* @__PURE__ */ $constructor3("$ZodType", (inst, def) => {
  var _a;
  inst ?? (inst = {}), inst._zod.def = def, inst._zod.bag = inst._zod.bag || {}, inst._zod.version = version3;
  let defChecks = inst._zod.def.checks, checks = inst._zod.traits.has("$ZodCheck") ? [inst, ...defChecks ?? []] : defChecks?.length ? [...defChecks] : [];
  for (let ch of checks)
    for (let fn of ch._zod.onattach)
      fn(inst);
  if (checks.length === 0)
    (_a = inst._zod).deferred ?? (_a.deferred = []), inst._zod.deferred?.push(() => {
      inst._zod.run = inst._zod.parse;
    });
  else {
    let runChecks = (payload, checks, ctx) => {
      if (payload.memo)
        return payload;
      let isAborted = aborted3(payload), asyncResult;
      for (let ch of checks) {
        if (ch._zod.def.when) {
          if (explicitlyAborted2(payload))
            continue;
          if (!ch._zod.def.when(payload))
            continue;
        } else if (isAborted)
          continue;
        let currLen = payload.issues.length, _ = ch._zod.check(payload);
        if (_ instanceof Promise && ctx?.async === !1)
          throw new $ZodAsyncError3;
        if (asyncResult || _ instanceof Promise)
          asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
            if (await _, payload.issues.length === currLen)
              return;
            if (attachSchema2(payload.issues, currLen, inst), !isAborted)
              isAborted = aborted3(payload, currLen);
          });
        else {
          if (payload.issues.length === currLen)
            continue;
          if (attachSchema2(payload.issues, currLen, inst), !isAborted)
            isAborted = aborted3(payload, currLen);
        }
      }
      if (asyncResult)
        return asyncResult.then(() => payload);
      return payload;
    }, handleCanaryResult = (canary, payload, ctx) => {
      if (aborted3(canary))
        return canary.aborted = !0, canary;
      let checkResult = runChecks(payload, checks, ctx);
      if (checkResult instanceof Promise) {
        if (ctx.async === !1)
          throw new $ZodAsyncError3;
        return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
      }
      return inst._zod.parse(checkResult, ctx);
    };
    inst._zod.run = (payload, ctx) => {
      if (ctx.skipChecks)
        return inst._zod.parse(payload, ctx);
      if (ctx.direction === "backward") {
        let canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: !0 });
        if (canary instanceof Promise)
          return canary.then((canary) => handleCanaryResult(canary, payload, ctx));
        return handleCanaryResult(canary, payload, ctx);
      }
      let result = inst._zod.parse(payload, ctx);
      if (result instanceof Promise) {
        if (ctx.async === !1)
          throw new $ZodAsyncError3;
        return result.then((result) => runChecks(result, checks, ctx));
      }
      return runChecks(result, checks, ctx);
    };
  }
}, {
  get "~standard"() {
    return hide2(this, "~standard", standardProps2(this));
  },
  set "~standard"(value) {
    own2(this, "~standard", value);
  }
}), toStandardResult2 = (r, ctx) => r.issues.length ? { issues: r.issues.map((iss) => finalizeIssue3(iss, ctx, config3())) } : { value: r.value };
async function validateAsync4(inst, value) {
  let ctx = { async: !0 };
  return toStandardResult2(await inst._zod.run({ value, issues: [] }, ctx), ctx);
}
function standardProps2(inst) {
  return {
    validate: (value) => {
      let ctx = { async: !1 };
      try {
        let r = inst._zod.run({ value, issues: [] }, ctx);
        if (!(r instanceof Promise))
          return toStandardResult2(r, ctx);
      } catch (_) {}
      return validateAsync4(inst, value);
    },
    vendor: "zod",
    version: 1
  };
}
var $ZodString3 = /* @__PURE__ */ $constructor3("$ZodString", (inst, def) => {
  $ZodType3.init(inst, def), inst._zod.pattern = def.pattern ?? anyString2, inst._zod.parse = (payload, _) => {
    if (def.coerce)
      try {
        payload.value = String(payload.value);
      } catch (_) {}
    if (typeof payload.value === "string")
      return payload;
    return payload.issues.push({
      expected: "string",
      code: "invalid_type",
      input: payload.value,
      inst
    }), payload;
  };
}), $ZodStringFormat3 = /* @__PURE__ */ $constructor3("$ZodStringFormat", (inst, def) => {
  $ZodCheckStringFormat3.init(inst, def), $ZodString3.init(inst, def);
}), $ZodGUID3 = /* @__PURE__ */ $constructor3("$ZodGUID", (inst, def) => {
  def.pattern ?? (def.pattern = guid3), $ZodStringFormat3.init(inst, def);
}), $ZodUUID3 = /* @__PURE__ */ $constructor3("$ZodUUID", (inst, def) => {
  if (def.version) {
    let v = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    }[def.version];
    if (v === void 0)
      throw Error(`Invalid UUID version: "${def.version}"`);
    def.pattern ?? (def.pattern = uuid3(v));
  } else
    def.pattern ?? (def.pattern = uuid3());
  $ZodStringFormat3.init(inst, def);
}), $ZodEmail3 = /* @__PURE__ */ $constructor3("$ZodEmail", (inst, def) => {
  def.pattern ?? (def.pattern = email3), $ZodStringFormat3.init(inst, def);
}), URL_BAD_FORMAT2 = 1, URL_UNPARSEABLE2 = 2;
function canParseURL2(input) {
  try {
    if (typeof URL < "u" && typeof URL.canParse === "function")
      return URL.canParse(input);
    return new URL(input), !0;
  } catch {
    return !1;
  }
}
function validateURL2(trimmed, def) {
  if (!("normalize" in def) && !("hostname" in def) && !("protocol" in def))
    return canParseURL2(trimmed) || URL_UNPARSEABLE2;
  return parseURLObject2(trimmed, def);
}
function parseURLObject2(trimmed, def) {
  if (!def.normalize && def.protocol?.source === httpProtocol2.source && !/^https?:\/\//i.test(trimmed))
    return URL_BAD_FORMAT2;
  try {
    if (typeof URL < "u") {
      let URLStatic = URL;
      if (typeof URLStatic.parse === "function")
        return URLStatic.parse(trimmed) ?? URL_UNPARSEABLE2;
    }
    return new URL(trimmed);
  } catch {
    return URL_UNPARSEABLE2;
  }
}
var asciiTabOrNewline2 = /[\t\n\r]/g;
function stripTabAndNewline2(value) {
  return value.replace(asciiTabOrNewline2, "");
}
function urlHostnameOk2(url, hostname) {
  return hostname.lastIndex = 0, hostname.test(url.hostname);
}
function urlProtocolOk2(url, protocol) {
  return protocol.lastIndex = 0, protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol);
}
var $ZodURL3 = /* @__PURE__ */ $constructor3("$ZodURL", (inst, def) => {
  $ZodStringFormat3.init(inst, def), inst._zod.check = (payload) => {
    try {
      let trimmed = payload.value.trim(), url = validateURL2(trimmed, def);
      if (url === URL_BAD_FORMAT2) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          note: "Invalid URL format",
          input: payload.value,
          inst,
          continue: !def.abort
        });
        return;
      }
      if (url === URL_UNPARSEABLE2) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          input: payload.value,
          inst,
          continue: !def.abort
        });
        return;
      }
      if (url === !0) {
        payload.value = stripTabAndNewline2(trimmed);
        return;
      }
      if (def.hostname && !urlHostnameOk2(url, def.hostname))
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          note: "Invalid hostname",
          pattern: def.hostname.source,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      if (def.protocol && !urlProtocolOk2(url, def.protocol))
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          note: "Invalid protocol",
          pattern: def.protocol.source,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      payload.value = def.normalize ? url.href : stripTabAndNewline2(trimmed);
      return;
    } catch (_) {
      payload.issues.push({
        code: "invalid_format",
        format: "url",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
}), $ZodEmoji3 = /* @__PURE__ */ $constructor3("$ZodEmoji", (inst, def) => {
  def.pattern ?? (def.pattern = emoji3()), $ZodStringFormat3.init(inst, def);
}), $ZodNanoID3 = /* @__PURE__ */ $constructor3("$ZodNanoID", (inst, def) => {
  if (def.length !== void 0 && (!Number.isInteger(def.length) || def.length < 1))
    throw Error(`Invalid nanoid length: ${def.length}`);
  def.pattern ?? (def.pattern = def.length === void 0 ? nanoid3 : nanoidOfLength2(def.length)), $ZodStringFormat3.init(inst, def);
}), $ZodCUID4 = /* @__PURE__ */ $constructor3("$ZodCUID", (inst, def) => {
  def.pattern ?? (def.pattern = cuid4), $ZodStringFormat3.init(inst, def);
}), $ZodCUID23 = /* @__PURE__ */ $constructor3("$ZodCUID2", (inst, def) => {
  def.pattern ?? (def.pattern = cuid23), $ZodStringFormat3.init(inst, def);
}), $ZodULID3 = /* @__PURE__ */ $constructor3("$ZodULID", (inst, def) => {
  def.pattern ?? (def.pattern = ulid3), $ZodStringFormat3.init(inst, def);
}), $ZodXID3 = /* @__PURE__ */ $constructor3("$ZodXID", (inst, def) => {
  def.pattern ?? (def.pattern = xid3), $ZodStringFormat3.init(inst, def);
}), $ZodKSUID3 = /* @__PURE__ */ $constructor3("$ZodKSUID", (inst, def) => {
  def.pattern ?? (def.pattern = ksuid3), $ZodStringFormat3.init(inst, def);
}), $ZodISODateTime3 = /* @__PURE__ */ $constructor3("$ZodISODateTime", (inst, def) => {
  def.pattern ?? (def.pattern = datetime5(def)), $ZodStringFormat3.init(inst, def);
}), $ZodISODate3 = /* @__PURE__ */ $constructor3("$ZodISODate", (inst, def) => {
  def.pattern ?? (def.pattern = date5), $ZodStringFormat3.init(inst, def);
}), $ZodISOTime3 = /* @__PURE__ */ $constructor3("$ZodISOTime", (inst, def) => {
  def.pattern ?? (def.pattern = time5(def)), $ZodStringFormat3.init(inst, def);
}), $ZodISODuration3 = /* @__PURE__ */ $constructor3("$ZodISODuration", (inst, def) => {
  def.pattern ?? (def.pattern = duration5), $ZodStringFormat3.init(inst, def);
}), $ZodIPv43 = /* @__PURE__ */ $constructor3("$ZodIPv4", (inst, def) => {
  def.pattern ?? (def.pattern = ipv43), $ZodStringFormat3.init(inst, def);
}), ipv6Alphabet2 = /^[0-9a-fA-F:.]+$/;
function isValidIPv62(value) {
  if (!ipv6Alphabet2.test(value))
    return !1;
  return canParseURL2(`http://[${value}]`);
}
var $ZodIPv63 = /* @__PURE__ */ $constructor3("$ZodIPv6", (inst, def) => {
  def.pattern ?? (def.pattern = ipv63), $ZodStringFormat3.init(inst, def), inst._zod.check = (payload) => {
    if (!isValidIPv62(payload.value))
      payload.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
  };
});
var $ZodCIDRv43 = /* @__PURE__ */ $constructor3("$ZodCIDRv4", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv43), $ZodStringFormat3.init(inst, def);
});
function isValidCIDRv62(value) {
  let parts = value.split("/");
  if (parts.length !== 2)
    return !1;
  let [address, prefix] = parts;
  if (!prefix)
    return !1;
  let prefixNum = Number(prefix);
  if (`${prefixNum}` !== prefix)
    return !1;
  if (prefixNum < 0 || prefixNum > 128)
    return !1;
  return isValidIPv62(address);
}
var $ZodCIDRv63 = /* @__PURE__ */ $constructor3("$ZodCIDRv6", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv63), $ZodStringFormat3.init(inst, def), inst._zod.check = (payload) => {
    if (!isValidCIDRv62(payload.value))
      payload.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
  };
});
function isValidBase643(data) {
  if (data === "")
    return !0;
  if (/\s/.test(data))
    return !1;
  if (data.length % 4 !== 0)
    return !1;
  try {
    return atob(data), !0;
  } catch {
    return !1;
  }
}
var base64Charset2 = /^[0-9a-zA-Z+/]*={0,2}$/, $ZodBase643 = /* @__PURE__ */ $constructor3("$ZodBase64", (inst, def) => {
  def.pattern ?? (def.pattern = base64Charset2), $ZodStringFormat3.init(inst, def), inst._zod.check = (payload) => {
    if (isValidBase643(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
}), base64urlCharset2 = /^[A-Za-z0-9_-]*$/;
function isValidBase64URL3(data) {
  if (!base64urlCharset2.test(data))
    return !1;
  let base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/"), padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return isValidBase643(padded);
}
var $ZodBase64URL3 = /* @__PURE__ */ $constructor3("$ZodBase64URL", (inst, def) => {
  def.pattern ?? (def.pattern = base64urlCharset2), $ZodStringFormat3.init(inst, def), inst._zod.check = (payload) => {
    if (isValidBase64URL3(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
}), $ZodE1643 = /* @__PURE__ */ $constructor3("$ZodE164", (inst, def) => {
  def.pattern ?? (def.pattern = e1643), $ZodStringFormat3.init(inst, def);
});
function isValidJWT3(token, algorithm = null) {
  try {
    let tokensParts = token.split(".");
    if (tokensParts.length !== 3)
      return !1;
    let [header] = tokensParts;
    if (!header)
      return !1;
    let parsedHeader = JSON.parse(atob(header));
    if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
      return !1;
    if (!parsedHeader.alg)
      return !1;
    if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
      return !1;
    return !0;
  } catch {
    return !1;
  }
}
var $ZodJWT3 = /* @__PURE__ */ $constructor3("$ZodJWT", (inst, def) => {
  $ZodStringFormat3.init(inst, def), inst._zod.check = (payload) => {
    if (isValidJWT3(payload.value, def.alg))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodNumber3 = /* @__PURE__ */ $constructor3("$ZodNumber", (inst, def) => {
  $ZodType3.init(inst, def), inst._zod.pattern = number5, inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Number(payload.value);
      } catch (_) {}
    let input = payload.value;
    if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input))
      return payload;
    let received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? String(input) : void 0 : void 0;
    return payload.issues.push({
      expected: "number",
      code: "invalid_type",
      input,
      inst,
      ...received ? { received } : {}
    }), payload;
  };
}), $ZodNumberFormat3 = /* @__PURE__ */ $constructor3("$ZodNumberFormat", (inst, def) => {
  $ZodCheckNumberFormat3.init(inst, def), $ZodNumber3.init(inst, def);
});
var $ZodUnknown3 = /* @__PURE__ */ $constructor3("$ZodUnknown", (inst, def) => {
  $ZodType3.init(inst, def), inst._zod.parse = (payload) => payload;
}), $ZodNever3 = /* @__PURE__ */ $constructor3("$ZodNever", (inst, def) => {
  $ZodType3.init(inst, def), inst._zod.parse = (payload, _ctx) => (payload.issues.push({
    expected: "never",
    code: "invalid_type",
    input: payload.value,
    inst
  }), payload);
});
function handleArrayResult3(result, final, index) {
  if (result.issues.length)
    final.issues.push(...prefixIssues3(index, result.issues));
  final.value[index] = result.value;
}
var $ZodArray3 = /* @__PURE__ */ $constructor3("$ZodArray", (inst, def) => {
  $ZodType3.init(inst, def);
  let memo = globalConfig3.memoizer;
  memo?.attach(inst), inst._zod.parse = (payload, ctx) => {
    let input = payload.value;
    if (!Array.isArray(input))
      return payload.issues.push({
        expected: "array",
        code: "invalid_type",
        input,
        inst
      }), payload;
    payload.value = memo ? memo.alloc(inst, payload, Array(input.length), ctx) : Array(input.length);
    let proms = [], abortEarly = ctx?.abortEarly;
    for (let i = 0;i < input.length; i++) {
      let item = input[i], result = def.element._zod.run({
        value: item,
        issues: []
      }, ctx);
      if (result instanceof Promise)
        proms.push(result.then((result) => handleArrayResult3(result, payload, i)));
      else if (handleArrayResult3(result, payload, i), abortEarly && result.issues.length !== 0 && aborted3(result))
        break;
    }
    if (proms.length)
      return Promise.all(proms).then(() => payload);
    return payload;
  };
});
function handlePropertyResult3(result, final, key, input, optin, optout) {
  let isPresent = key in input, isOptionalOut = optout === "optional";
  if (!isPresent && isOptionalOut && optin === "optional")
    return;
  if (result.issues.length) {
    if (optin !== void 0 && isOptionalOut && !isPresent)
      return;
    final.issues.push(...prefixIssues3(key, result.issues));
  }
  if (!isPresent && optin === void 0) {
    if (!result.issues.length)
      final.issues.push({
        code: "invalid_type",
        expected: "nonoptional",
        input: void 0,
        path: [key]
      });
    return;
  }
  if (result.value === void 0) {
    if (isPresent || optin === "defaulted" && !isOptionalOut)
      final.value[key] = void 0;
  } else
    final.value[key] = result.value;
}
var NO_SYMBOL_KEYS2 = [];
function normalizeDef3(def) {
  let keys = Object.keys(def.shape), ownSymbols = Object.getOwnPropertySymbols(def.shape), symbolKeys = ownSymbols.length ? ownSymbols : NO_SYMBOL_KEYS2, allKeys = symbolKeys.length ? [...keys, ...symbolKeys] : keys;
  for (let k of allKeys)
    if (!def.shape?.[k]?._zod?.traits?.has("$ZodType"))
      throw Error(`Invalid element at key "${String(k)}": expected a Zod schema`);
  let okeys = optionalKeys3(def.shape);
  return {
    ...def,
    allKeys,
    symbolKeys,
    keySet: new Set(keys),
    numKeys: keys.length,
    optionalKeys: new Set(okeys)
  };
}
function handleCatchall3(proms, input, payload, ctx, def, inst, abortEarly) {
  let unrecognized = [], keySet = def.keySet, _catchall = def.catchall._zod, t = _catchall.def.type, { optin, optout } = _catchall, seen = 0;
  for (let key in input) {
    if (abortEarly && payload.issues.length !== seen) {
      if (aborted3(payload, seen))
        break;
      seen = payload.issues.length;
    }
    if (keySet.has(key))
      continue;
    if (key === "__proto__") {
      if (t === "never")
        unrecognized.push(key);
      continue;
    }
    if (t === "never") {
      unrecognized.push(key);
      continue;
    }
    let r = _catchall.run({ value: input[key], issues: [] }, ctx);
    if (r instanceof Promise)
      proms.push(r.then((r) => handlePropertyResult3(r, payload, key, input, optin, optout)));
    else
      handlePropertyResult3(r, payload, key, input, optin, optout);
  }
  if (unrecognized.length)
    payload.issues.push({
      code: "unrecognized_keys",
      keys: unrecognized,
      input,
      inst,
      continue: !0
    });
  if (!proms.length)
    return payload;
  return Promise.all(proms).then(() => payload);
}
var $ZodObject3 = /* @__PURE__ */ $constructor3("$ZodObject", (inst, def) => {
  $ZodType3.init(inst, def);
  let desc = Object.getOwnPropertyDescriptor(def, "shape"), sh = desc?.get ? desc.get.raw : def.shape ?? {};
  if (sh) {
    let get = () => {
      let newSh = { ...sh };
      return Object.defineProperty(def, "shape", { value: newSh }), get.raw = newSh, newSh;
    };
    get.raw = sh, Object.defineProperty(def, "shape", { get });
  }
  let _normalized = cached3(() => normalizeDef3(def));
  defineLazyInternal2(inst, "propValues", (zod) => {
    let shape = zod.def.shape, propValues = {};
    for (let key in shape) {
      let field = shape[key]._zod;
      if (field.values) {
        if (!Object.prototype.hasOwnProperty.call(propValues, key))
          assignProp3(propValues, key, /* @__PURE__ */ new Set);
        for (let v of field.values)
          propValues[key].add(v);
        if (field.optin !== void 0)
          propValues[key].add(void 0);
      }
    }
    return propValues;
  });
  let isObject = isObject4, catchall = def.catchall, value, memo = globalConfig3.memoizer;
  memo?.attach(inst), inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    let input = payload.value;
    if (!isObject(input))
      return payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      }), payload;
    payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
    let proms = [], shape = value.shape, abortEarly = ctx?.abortEarly, seen = payload.issues.length;
    for (let key of value.allKeys) {
      if (abortEarly && payload.issues.length !== seen) {
        if (aborted3(payload, seen))
          break;
        seen = payload.issues.length;
      }
      if (key === "__proto__")
        continue;
      let el = shape[key], optin = el._zod.optin, optout = el._zod.optout, r = el._zod.run({ value: input[key], issues: [] }, ctx);
      if (r instanceof Promise)
        proms.push(r.then((r) => handlePropertyResult3(r, payload, key, input, optin, optout)));
      else
        handlePropertyResult3(r, payload, key, input, optin, optout);
    }
    if (!catchall)
      return proms.length ? Promise.all(proms).then(() => payload) : payload;
    return handleCatchall3(proms, input, payload, ctx, _normalized.value, inst, abortEarly === !0);
  };
}), $ZodObjectJIT3 = /* @__PURE__ */ $constructor3("$ZodObjectJIT", (inst, def) => {
  $ZodObject3.init(inst, def);
  let superParse = inst._zod.parse, _normalized = cached3(() => normalizeDef3(def)), memo = globalConfig3.memoizer, generateFastpass = (shape) => {
    let normalized = _normalized.value, syms = normalized.symbolKeys, doc = new Doc3(["payload", "ctx"], { shape, inst, memo, syms }), parseStr = (k) => `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`, prefixStr = (id, k) => `
          let ${id}_ab = false;
          for (let i = 0; i < ${id}.issues.length; i++) {
            const iss = ${id}.issues[i];
            iss.path = iss.path ? [${k}, ...iss.path] : [${k}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${id}_ab = true;
          }
          if (${id}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;
    doc.write("const input = payload.value;");
    let ids = Object.create(null), counter = 0;
    for (let key of normalized.allKeys)
      ids[key] = `key_${counter++}`;
    doc.write(memo ? "const newResult = memo.alloc(inst, payload, {}, ctx);" : "const newResult = {};");
    for (let key of normalized.allKeys) {
      if (key === "__proto__")
        continue;
      let id = ids[key], k = typeof key === "symbol" ? `syms[${syms.indexOf(key)}]` : esc3(key), isPresent = `${k} in input`, schema = shape[key], optin = schema?._zod?.optin, isOptionalIn = optin !== void 0, isOptionalOut = schema?._zod?.optout === "optional";
      if (doc.write(`const ${id} = ${parseStr(k)};`), isOptionalIn && isOptionalOut) {
        let assign = optin === "optional" ? `${id}_present` : `${id}.value !== undefined || ${id}_present`;
        doc.write(`
        const ${id}_present = ${isPresent};
        if (!${id}.issues.length || ${id}_present) {
          if (${id}.issues.length) {${prefixStr(id, k)}
          }

          if (${assign}) {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
      } else if (!isOptionalIn)
        doc.write(`
        const ${id}_present = ${isPresent};
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${id}_present) {
          newResult[${k}] = ${id}.value;
        }

      `);
      else if (doc.write(`
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
      `), optin === "defaulted")
        doc.write(`newResult[${k}] = ${id}.value;`);
      else
        doc.write(`
        if (${id}.value !== undefined || ${isPresent}) {
          newResult[${k}] = ${id}.value;
        }
      `);
    }
    return doc.write("payload.value = newResult;"), doc.write("return payload;"), doc.compile();
  }, fastpass, isObject = isObject4, jit = !globalConfig3.jitless, fastEnabled = jit && allowsEval3.value, catchall = def.catchall, value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    let input = payload.value;
    if (!isObject(input))
      return payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      }), payload;
    if (jit && fastEnabled && ctx?.async === !1 && ctx.jitless !== !0) {
      if (!fastpass)
        fastpass = generateFastpass(def.shape);
      if (payload = fastpass(payload, ctx), !catchall)
        return payload;
      return handleCatchall3([], input, payload, ctx, value, inst, ctx?.abortEarly === !0);
    }
    return superParse(payload, ctx);
  };
});
function handleUnionResults3(results, final, inst, ctx) {
  for (let result of results)
    if (result.issues.length === 0)
      return final.value = result.value, final;
  let nonaborted = results.filter((r) => !aborted3(r));
  if (nonaborted.length === 1)
    return final.value = nonaborted[0].value, nonaborted[0];
  return final.issues.push({
    code: "invalid_union",
    input: final.value,
    inst,
    errors: results.map((result) => result.issues.map((iss) => finalizeIssue3(iss, ctx, config3())))
  }), final;
}
var $ZodUnion3 = /* @__PURE__ */ $constructor3("$ZodUnion", (inst, def) => {
  $ZodType3.init(inst, def), defineLazyInternal2(inst, "optin", (zod) => zod.def.options.some((o) => o._zod.optin === "defaulted") ? "defaulted" : zod.def.options.some((o) => o._zod.optin !== void 0) ? "optional" : void 0), defineLazyInternal2(inst, "optout", (zod) => zod.def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0), defineLazyInternal2(inst, "values", (zod) => {
    if (zod.def.options.every((o) => o._zod.values))
      return new Set(zod.def.options.flatMap((option) => Array.from(option._zod.values)));
    return;
  }), defineLazyInternal2(inst, "pattern", (zod) => {
    if (zod.def.options.every((o) => o._zod.pattern)) {
      let patterns = zod.def.options.map((o) => o._zod.pattern);
      return new RegExp(`^(${patterns.map((p) => cleanRegex3(p.source)).join("|")})$`);
    }
    return;
  });
  let first = def.options.length === 1 ? def.options[0]._zod.run : null;
  inst._zod.parse = (payload, ctx) => {
    if (first)
      return first(payload, ctx);
    let async = !1, results = [];
    for (let option of def.options) {
      let result = option._zod.run({
        value: payload.value,
        issues: []
      }, ctx);
      if (result instanceof Promise)
        results.push(result), async = !0;
      else {
        if (result.issues.length === 0)
          return result;
        results.push(result);
      }
    }
    if (!async)
      return handleUnionResults3(results, payload, inst, ctx);
    return Promise.all(results).then((results) => handleUnionResults3(results, payload, inst, ctx));
  };
});
var $ZodIntersection3 = /* @__PURE__ */ $constructor3("$ZodIntersection", (inst, def) => {
  $ZodType3.init(inst, def), inst._zod.parse = (payload, ctx) => {
    let input = payload.value, left = def.left._zod.run({ value: input, issues: [] }, ctx), right = def.right._zod.run({ value: input, issues: [] }, ctx);
    if (left instanceof Promise || right instanceof Promise)
      return Promise.all([left, right]).then(([left, right]) => handleIntersectionResults3(payload, left, right));
    return handleIntersectionResults3(payload, left, right);
  };
});
function mergeValues3(a, b) {
  if (a === b)
    return { valid: !0, data: a };
  if (a instanceof Date && b instanceof Date && +a === +b)
    return { valid: !0, data: a };
  if (isPlainObject3(a) && isPlainObject3(b)) {
    let bKeys = Object.keys(b), sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1), newObj = { ...a, ...b };
    if (Object.prototype.hasOwnProperty.call(newObj, "__proto__"))
      delete newObj.__proto__;
    for (let key of sharedKeys) {
      if (key === "__proto__")
        continue;
      let sharedValue = mergeValues3(a[key], b[key]);
      if (!sharedValue.valid)
        return {
          valid: !1,
          mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
        };
      newObj[key] = sharedValue.data;
    }
    return { valid: !0, data: newObj };
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length)
      return { valid: !1, mergeErrorPath: [] };
    let newArray = [];
    for (let index = 0;index < a.length; index++) {
      let itemA = a[index], itemB = b[index], sharedValue = mergeValues3(itemA, itemB);
      if (!sharedValue.valid)
        return {
          valid: !1,
          mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
        };
      newArray.push(sharedValue.data);
    }
    return { valid: !0, data: newArray };
  }
  return { valid: !1, mergeErrorPath: [] };
}
function handleIntersectionResults3(result, left, right) {
  let unrecKeys = /* @__PURE__ */ new Map, unrecIssue, keyIssues = /* @__PURE__ */ new Map, collect = (iss, side) => {
    let keys;
    if (iss.code === "unrecognized_keys" && !iss.path?.length)
      unrecIssue ?? (unrecIssue = iss), keys = iss.keys;
    else if (iss.code === "invalid_key" && iss.origin === "record" && iss.path?.length === 1) {
      let k = String(iss.path[0]);
      if (!keyIssues.has(k))
        keyIssues.set(k, iss);
      keys = [k];
    } else
      return !1;
    for (let k of keys) {
      if (!unrecKeys.has(k))
        unrecKeys.set(k, {});
      unrecKeys.get(k)[side] = !0;
    }
    return !0;
  };
  for (let iss of left.issues)
    if (!collect(iss, "l"))
      result.issues.push(iss);
  for (let iss of right.issues)
    if (!collect(iss, "r"))
      result.issues.push(iss);
  let bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
  if (bothKeys.length) {
    let aggregated = unrecIssue ? bothKeys.filter((k) => unrecIssue.keys.includes(k)) : [];
    if (aggregated.length)
      result.issues.push({ ...unrecIssue, keys: aggregated });
    for (let k of bothKeys)
      if (!aggregated.includes(k) && keyIssues.has(k))
        result.issues.push(keyIssues.get(k));
  }
  let merged = mergeValues3(left.value, right.value);
  if (!merged.valid) {
    if (aborted3(result))
      return result;
    throw Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
  }
  return result.value = merged.data, result;
}
var $ZodRecord3 = /* @__PURE__ */ $constructor3("$ZodRecord", (inst, def) => {
  $ZodType3.init(inst, def);
  let memo = globalConfig3.memoizer;
  memo?.attach(inst), inst._zod.parse = (payload, ctx) => {
    let input = payload.value;
    if (!isPlainObject3(input))
      return payload.issues.push({
        expected: "record",
        code: "invalid_type",
        input,
        inst
      }), payload;
    let proms = [], values = def.keyType._zod.values;
    if (values && !def.partial) {
      payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
      let recordKeys = /* @__PURE__ */ new Set;
      for (let key of values)
        if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
          if (recordKeys.add(typeof key === "number" ? key.toString() : key), key === "__proto__")
            continue;
          let keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
          if (keyResult instanceof Promise)
            throw Error("Async schemas not supported in object keys currently");
          if (keyResult.issues.length) {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue3(iss, ctx, config3())),
              input: key,
              path: [key],
              inst
            });
            continue;
          }
          let outKey = keyResult.value;
          if (outKey === "__proto__")
            continue;
          let result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
          if (result instanceof Promise)
            proms.push(result.then((result) => {
              if (result.issues.length)
                payload.issues.push(...prefixIssues3(key, result.issues));
              payload.value[outKey] = result.value;
            }));
          else {
            if (result.issues.length)
              payload.issues.push(...prefixIssues3(key, result.issues));
            payload.value[outKey] = result.value;
          }
        }
      let unrecognized;
      for (let key in input)
        if (!recordKeys.has(key))
          if (def.mode === "loose") {
            if (key === "__proto__")
              continue;
            payload.value[key] = input[key];
          } else
            unrecognized = unrecognized ?? [], unrecognized.push(key);
      if (unrecognized && unrecognized.length > 0)
        payload.issues.push({
          code: "unrecognized_keys",
          input,
          inst,
          keys: unrecognized,
          continue: !0
        });
    } else {
      payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
      let unrecognized;
      for (let key of Reflect.ownKeys(input)) {
        if (key === "__proto__")
          continue;
        if (!Object.prototype.propertyIsEnumerable.call(input, key))
          continue;
        let keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
        if (keyResult instanceof Promise)
          throw Error("Async schemas not supported in object keys currently");
        if (typeof key === "string" && number5.test(key) && keyResult.issues.length) {
          let retryResult = def.keyType._zod.run({ value: Number(key), issues: [] }, ctx);
          if (retryResult instanceof Promise)
            throw Error("Async schemas not supported in object keys currently");
          if (retryResult.issues.length === 0)
            keyResult = retryResult;
        }
        if (keyResult.issues.length) {
          if (def.mode === "loose")
            payload.value[key] = input[key];
          else if (values)
            unrecognized = unrecognized ?? [], unrecognized.push(key);
          else
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue3(iss, ctx, config3())),
              input: key,
              path: [key],
              inst
            });
          continue;
        }
        let outKey = keyResult.value;
        if (outKey === "__proto__")
          continue;
        let result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
        if (result instanceof Promise)
          proms.push(result.then((result) => {
            if (result.issues.length)
              payload.issues.push(...prefixIssues3(key, result.issues));
            payload.value[outKey] = result.value;
          }));
        else {
          if (result.issues.length)
            payload.issues.push(...prefixIssues3(key, result.issues));
          payload.value[outKey] = result.value;
        }
      }
      if (unrecognized && unrecognized.length > 0)
        payload.issues.push({
          code: "unrecognized_keys",
          input,
          inst,
          keys: unrecognized,
          continue: !0
        });
    }
    if (proms.length)
      return Promise.all(proms).then(() => payload);
    return payload;
  };
});
var $ZodEnum3 = /* @__PURE__ */ $constructor3("$ZodEnum", (inst, def) => {
  $ZodType3.init(inst, def);
  let values = getEnumValues3(def.entries), valuesSet = new Set(values);
  inst._zod.values = valuesSet, defineLazyInternal2(inst, "pattern", (zod) => {
    let patternValues = getEnumValues3(zod.def.entries).filter((k) => propertyKeyTypes3.has(typeof k));
    return new RegExp(patternValues.length ? `^(${patternValues.map((o) => escapeRegex3(o.toString())).join("|")})$` : "^[^\\s\\S]$");
  }), inst._zod.parse = (payload, _ctx) => {
    let input = payload.value;
    if (valuesSet.has(input))
      return payload;
    return payload.issues.push({
      code: "invalid_value",
      values,
      input,
      inst
    }), payload;
  };
}), $ZodLiteral3 = /* @__PURE__ */ $constructor3("$ZodLiteral", (inst, def) => {
  $ZodType3.init(inst, def);
  let values = new Set(def.values);
  inst._zod.values = values, defineLazyInternal2(inst, "pattern", (zod) => {
    let vals = zod.def.values;
    return new RegExp(vals.length ? `^(${vals.map((o) => typeof o === "string" ? escapeRegex3(o) : o ? escapeRegex3(o.toString()) : String(o)).join("|")})$` : "^[^\\s\\S]$");
  }), inst._zod.parse = (payload, _ctx) => {
    let input = payload.value;
    if (values.has(input))
      return payload;
    return payload.issues.push({
      code: "invalid_value",
      values: def.values,
      input,
      inst
    }), payload;
  };
});
var $ZodTransform3 = /* @__PURE__ */ $constructor3("$ZodTransform", (inst, def) => {
  $ZodType3.init(inst, def), inst._zod.optin = "optional", globalConfig3.memoizer?.guard(inst), inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward")
      throw new $ZodEncodeError3(inst.constructor.name);
    let _out = def.transform(payload.value, payload);
    if (ctx.async)
      return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => (payload.value = output, payload));
    if (_out instanceof Promise)
      throw new $ZodAsyncError3;
    return payload.value = _out, payload;
  };
});
function handleOptionalResult3(payload, result) {
  return payload.value = result.issues.length ? void 0 : result.value, payload;
}
var $ZodOptional3 = /* @__PURE__ */ $constructor3("$ZodOptional", (inst, def) => {
  $ZodType3.init(inst, def), defineLazyInternal2(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional"), inst._zod.optout = "optional", defineLazyInternal2(inst, "values", (zod) => {
    let values = zod.def.innerType._zod.values;
    return values ? /* @__PURE__ */ new Set([...values, void 0]) : void 0;
  }), defineLazyInternal2(inst, "pattern", (zod) => {
    let pattern = zod.def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex3(pattern.source)})?$`) : void 0;
  }), inst._zod.parse = (payload, ctx) => {
    if (payload.value === void 0) {
      if (def.innerType._zod.optin !== "defaulted")
        return payload;
      let result = def.innerType._zod.run({ value: payload.value, issues: [] }, ctx);
      if (result instanceof Promise)
        return result.then((result) => handleOptionalResult3(payload, result));
      return handleOptionalResult3(payload, result);
    }
    return def.innerType._zod.run(payload, ctx);
  };
}), $ZodExactOptional3 = /* @__PURE__ */ $constructor3("$ZodExactOptional", (inst, def) => {
  $ZodOptional3.init(inst, def), defineLazyInternal2(inst, "values", (zod) => zod.def.innerType._zod.values), defineLazyInternal2(inst, "pattern", (zod) => zod.def.innerType._zod.pattern), inst._zod.parse = (payload, ctx) => def.innerType._zod.run(payload, ctx);
}), $ZodNullable3 = /* @__PURE__ */ $constructor3("$ZodNullable", (inst, def) => {
  $ZodType3.init(inst, def), defineLazyInternal2(inst, "optin", (zod) => zod.def.innerType._zod.optin), defineLazyInternal2(inst, "optout", (zod) => zod.def.innerType._zod.optout), defineLazyInternal2(inst, "pattern", (zod) => {
    let pattern = zod.def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex3(pattern.source)}|null)$`) : void 0;
  }), defineLazyInternal2(inst, "values", (zod) => zod.def.innerType._zod.values ? /* @__PURE__ */ new Set([...zod.def.innerType._zod.values, null]) : void 0), inst._zod.parse = (payload, ctx) => {
    if (payload.value === null)
      return payload;
    return def.innerType._zod.run(payload, ctx);
  };
}), $ZodDefault3 = /* @__PURE__ */ $constructor3("$ZodDefault", (inst, def) => {
  $ZodType3.init(inst, def), inst._zod.optin = "defaulted", defineLazyInternal2(inst, "values", (zod) => zod.def.innerType._zod.values), inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward")
      return def.innerType._zod.run(payload, ctx);
    if (payload.value === void 0)
      return payload.value = def.defaultValue, payload;
    let result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise)
      return result.then((result) => handleDefaultResult3(result, def));
    return handleDefaultResult3(result, def);
  };
});
function handleDefaultResult3(payload, def) {
  if (payload.value === void 0)
    payload.value = def.defaultValue;
  return payload;
}
var $ZodPrefault3 = /* @__PURE__ */ $constructor3("$ZodPrefault", (inst, def) => {
  $ZodType3.init(inst, def), inst._zod.optin = "defaulted", defineLazyInternal2(inst, "values", (zod) => zod.def.innerType._zod.values), inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward")
      return def.innerType._zod.run(payload, ctx);
    if (payload.value === void 0)
      payload.value = def.defaultValue;
    return def.innerType._zod.run(payload, ctx);
  };
}), $ZodNonOptional3 = /* @__PURE__ */ $constructor3("$ZodNonOptional", (inst, def) => {
  $ZodType3.init(inst, def), defineLazyInternal2(inst, "values", (zod) => {
    let v = zod.def.innerType._zod.values;
    return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
  }), inst._zod.parse = (payload, ctx) => {
    let result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise)
      return result.then((result) => handleNonOptionalResult3(result, inst));
    return handleNonOptionalResult3(result, inst);
  };
});
function handleNonOptionalResult3(payload, inst) {
  if (!payload.issues.length && payload.value === void 0)
    payload.issues.push({
      code: "invalid_type",
      expected: "nonoptional",
      input: payload.value,
      inst
    });
  return payload;
}
function handleCatchResult2(payload, result, def, ctx) {
  if (!result.issues.length) {
    if (payload.value = result.value, result.memo)
      payload.memo = !0;
    return payload;
  }
  return payload.value = def.catchValue({
    ...result,
    value: payload.value,
    error: {
      issues: result.issues.map((iss) => finalizeIssue3(iss, ctx, config3()))
    },
    input: payload.value
  }), payload;
}
var $ZodCatch3 = /* @__PURE__ */ $constructor3("$ZodCatch", (inst, def) => {
  $ZodType3.init(inst, def), defineLazyInternal2(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional"), defineLazyInternal2(inst, "optout", (zod) => zod.def.innerType._zod.optout), defineLazyInternal2(inst, "values", (zod) => zod.def.innerType._zod.values), inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward")
      return def.innerType._zod.run(payload, ctx);
    let result = def.innerType._zod.run({ value: payload.value, issues: [] }, ctx);
    if (result instanceof Promise)
      return result.then((result) => handleCatchResult2(payload, result, def, ctx));
    return handleCatchResult2(payload, result, def, ctx);
  };
});
var $ZodPipe3 = /* @__PURE__ */ $constructor3("$ZodPipe", (inst, def) => {
  $ZodType3.init(inst, def), defineLazyInternal2(inst, "values", (zod) => zod.def.in._zod.values), defineLazyInternal2(inst, "optin", (zod) => zod.def.in._zod.optin), defineLazyInternal2(inst, "optout", (zod) => zod.def.out._zod.optout), defineLazyInternal2(inst, "propValues", (zod) => zod.def.in._zod.propValues), inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      let right = def.out._zod.run(payload, ctx);
      if (right instanceof Promise)
        return right.then((right) => handlePipeResult3(right, def.in, ctx));
      return handlePipeResult3(right, def.in, ctx);
    }
    let left = def.in._zod.run(payload, ctx);
    if (left instanceof Promise)
      return left.then((left) => handlePipeResult3(left, def.out, ctx));
    return handlePipeResult3(left, def.out, ctx);
  };
});
function handlePipeResult3(left, next, ctx) {
  if (left.issues.some((iss) => iss.code !== "unrecognized_keys"))
    return left.aborted = !0, left;
  return next._zod.run({ value: left.value, issues: left.issues }, ctx);
}
var $ZodReadonly3 = /* @__PURE__ */ $constructor3("$ZodReadonly", (inst, def) => {
  $ZodType3.init(inst, def), defineLazyInternal2(inst, "propValues", (zod) => zod.def.innerType._zod.propValues), defineLazyInternal2(inst, "values", (zod) => zod.def.innerType._zod.values), defineLazyInternal2(inst, "optin", (zod) => zod.def.innerType?._zod?.optin), defineLazyInternal2(inst, "optout", (zod) => zod.def.innerType?._zod?.optout), inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward")
      return def.innerType._zod.run(payload, ctx);
    let result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise)
      return result.then(handleReadonlyResult3);
    return handleReadonlyResult3(result);
  };
});
function handleReadonlyResult3(payload) {
  if (!payload.memo)
    payload.value = Object.freeze(payload.value);
  return payload;
}
var $ZodCustom3 = /* @__PURE__ */ $constructor3("$ZodCustom", (inst, def) => {
  $ZodCheck3.init(inst, def), $ZodType3.init(inst, def), inst._zod.parse = (payload, _) => payload, inst._zod.check = (payload) => {
    let input = payload.value, r = def.fn(input);
    if (r instanceof Promise)
      return r.then((r) => handleRefineResult3(r, payload, input, inst));
    handleRefineResult3(r, payload, input, inst);
    return;
  };
});
function handleRefineResult3(result, payload, input, inst) {
  if (!result) {
    let _iss = {
      code: "custom",
      input,
      inst,
      path: [...inst._zod.def.path ?? []],
      continue: !inst._zod.def.abort
    };
    if (inst._zod.def.params)
      _iss.params = inst._zod.def.params;
    payload.issues.push(issue3(_iss));
  }
}
// node_modules/zod/v4/core/memoizer.js
class $ZodCyclicError2 extends Error {
  constructor() {
    super("Cannot parse a reference cycle that closes through a transform");
    this.name = "ZodCyclicError";
  }
}
var STATE2 = "~memo", NO_ISSUES2 = [];
function isRef2(value) {
  return value !== null && typeof value === "object";
}
function cloneIssues2(issues) {
  return issues.map((iss) => iss.path ? { ...iss, path: iss.path.slice() } : { ...iss });
}
var recursive2 = /* @__PURE__ */ new WeakMap, NONE2 = 0, ASSUMED2 = 1, PROVEN2 = 2;
function isRecursive2(inst, stack, resolve) {
  let cached = recursive2.get(inst);
  if (cached !== void 0)
    return cached ? PROVEN2 : NONE2;
  if (stack.has(inst))
    return PROVEN2;
  stack.add(inst);
  let result = NONE2, check = (child) => {
    if (result !== PROVEN2 && child?._zod) {
      let answer = isRecursive2(child, stack, resolve);
      if (answer > result)
        result = answer;
    }
  }, shape = (sh, spread) => {
    let answer = NONE2;
    for (let key of Reflect.ownKeys(sh)) {
      let desc = Object.getOwnPropertyDescriptor(sh, key);
      if (spread && !desc.enumerable)
        continue;
      let child = desc.get ? ASSUMED2 : desc.value?._zod ? isRecursive2(desc.value, stack, resolve) : NONE2;
      if (child > answer)
        answer = child;
    }
    return answer;
  }, merge = (answer) => {
    if (answer > result)
      result = answer;
  }, def = inst._zod.def, kind = def.type;
  switch (kind) {
    case "object": {
      let raw = rawShape2(def);
      merge(raw ? shape(raw, !0) : ASSUMED2), check(def.catchall);
      break;
    }
    case "array":
      check(def.element);
      break;
    case "tuple":
      for (let el of def.items)
        check(el);
      check(def.rest);
      break;
    case "record":
    case "map":
      check(def.keyType), check(def.valueType);
      break;
    case "set":
      check(def.valueType);
      break;
    case "union":
      for (let el of def.options)
        check(el);
      break;
    case "intersection":
      check(def.left), check(def.right);
      break;
    case "optional":
    case "nullable":
    case "default":
    case "prefault":
    case "catch":
    case "readonly":
    case "nonoptional":
    case "promise":
    case "success":
      check(def.innerType);
      break;
    case "pipe":
      check(def.in), check(def.out);
      break;
    case "function":
      check(def.input), check(def.output);
      break;
    case "lazy": {
      let inner = def._cachedInner ?? (resolve ? inst._zod.innerType : void 0);
      merge(inner ? isRecursive2(inner, stack, !1) : ASSUMED2);
      break;
    }
    case "template_literal":
    case "string":
    case "number":
    case "int":
    case "boolean":
    case "bigint":
    case "symbol":
    case "undefined":
    case "null":
    case "void":
    case "never":
    case "any":
    case "unknown":
    case "date":
    case "nan":
    case "enum":
    case "literal":
    case "file":
    case "transform":
    case "custom":
      break;
    default:
      for (let key in def) {
        let desc = Object.getOwnPropertyDescriptor(def, key);
        if (!desc || desc.get)
          continue;
        let value = desc.value;
        if (!value || typeof value !== "object")
          continue;
        if (value._zod)
          check(value);
        else if (Array.isArray(value))
          for (let el of value)
            check(el);
      }
  }
  return stack.delete(inst), settle2(inst, result);
}
function settle2(inst, answer) {
  if (answer !== ASSUMED2)
    recursive2.set(inst, answer === PROVEN2);
  return answer;
}
function bucketFor2(state, inst) {
  let bucket = state.buckets.get(inst);
  if (!bucket)
    bucket = /* @__PURE__ */ new WeakMap, state.buckets.set(inst, bucket);
  return bucket;
}
var handoff2, open2 = [], memo2 = {
  alloc(_inst, payload, empty) {
    let bucket = handoff2;
    if (!bucket)
      return empty;
    handoff2 = void 0;
    let entry = { value: empty, issues: null };
    return bucket.set(payload.value, entry), open2.push(entry), empty;
  },
  guard(inst) {
    var _a;
    (_a = inst._zod).deferred ?? (_a.deferred = []), inst._zod.deferred.push(() => {
      let base = inst._zod.parse, wrapped = (payload, ctx) => {
        if (ctx.direction !== "backward" && isBackEdge2(ctx, payload.value))
          throw new $ZodCyclicError2;
        return base(payload, ctx);
      };
      if (inst._zod.parse = wrapped, inst._zod.run === base)
        inst._zod.run = wrapped;
    });
  },
  attach(inst) {
    var _a;
    let isRecursiveInst, rechecked = !1, lastCtx, lastBucket;
    (_a = inst._zod).deferred ?? (_a.deferred = []), inst._zod.deferred.push(() => {
      let base = inst._zod.parse, wrapped = (payload, ctx) => {
        if (isRecursiveInst === void 0) {
          let walked = isRecursive2(inst, /* @__PURE__ */ new Set, !1);
          if (walked === NONE2) {
            if (inst._zod.parse = base, inst._zod.run === wrapped)
              inst._zod.run = base;
            return base(payload, ctx);
          }
          if (walked === PROVEN2 || rechecked)
            isRecursiveInst = !0;
          else
            rechecked = !0;
        }
        let input = payload.value;
        if (!isRef2(input))
          return base(payload, ctx);
        let state = ctx[STATE2];
        if (!state)
          state = { buckets: /* @__PURE__ */ new WeakMap, backEdges: void 0 }, ctx[STATE2] = state;
        let bucket;
        if (lastCtx === ctx)
          bucket = lastBucket;
        else
          bucket = bucketFor2(state, inst), lastCtx = ctx, lastBucket = bucket;
        let hit = bucket.get(input);
        if (hit) {
          if (payload.value = hit.value, hit.issues) {
            if (hit.issues.length)
              payload.issues.push(...cloneIssues2(hit.issues));
          } else
            payload.memo = !0, state.backEdges ?? (state.backEdges = /* @__PURE__ */ new WeakSet), state.backEdges.add(hit.value);
          return payload;
        }
        handoff2 = bucket;
        let depth = open2.length, result = base(payload, ctx);
        handoff2 = void 0;
        let entry = open2.length > depth ? open2.pop() : void 0;
        if (result instanceof Promise)
          return result.then((r) => {
            if (entry)
              entry.issues = r.issues.length ? cloneIssues2(r.issues) : NO_ISSUES2;
            return r;
          });
        if (entry)
          entry.issues = result.issues.length ? cloneIssues2(result.issues) : NO_ISSUES2;
        return result;
      };
      if (inst._zod.parse = wrapped, inst._zod.run === base)
        inst._zod.run = wrapped;
    });
  }
};
function memoizer3() {
  return memo2;
}
function isBackEdge2(ctx, value) {
  let backEdges = ctx[STATE2]?.backEdges;
  return backEdges !== void 0 && isRef2(value) && backEdges.has(value);
}
// node_modules/zod/v4/locales/en.js
var error2 = () => {
  let Sizable = {
    string: { unit: "characters", verb: "to have" },
    file: { unit: "bytes", verb: "to have" },
    array: { unit: "items", verb: "to have" },
    set: { unit: "items", verb: "to have" },
    map: { unit: "entries", verb: "to have" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  let FormatDictionary = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    mac: "MAC address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    currency_code: "currency code",
    credit_card: "credit card number",
    iban: "IBAN",
    jwt: "JWT",
    template_literal: "input"
  }, TypeDictionary = {
    nan: "NaN"
  };
  function getTypeName(type, input) {
    if (type === "number" && typeof input === "number" && !Number.isFinite(input))
      return String(input);
    return TypeDictionary[type] ?? type;
  }
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        let expected = getTypeName(issue.expected), receivedType = parsedType2(issue.input), received = getTypeName(receivedType, issue.input);
        return `Invalid input: expected ${expected}, received ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Invalid input: expected ${stringifyPrimitive2(issue.values[0])}`;
        return `Invalid option: expected one of ${joinValues2(issue.values, "|")}`;
      case "too_big": {
        let adj = issue.exact ? "exactly " : issue.inclusive ? "<=" : "<", sizing = getSizing(issue.origin);
        if (sizing)
          return `Too big: expected ${issue.origin ?? "value"} to have ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
        return `Too big: expected ${issue.origin ?? "value"} to be ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        let adj = issue.exact ? "exactly " : issue.inclusive ? ">=" : ">", sizing = getSizing(issue.origin);
        if (sizing)
          return `Too small: expected ${issue.origin} to have ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        return `Too small: expected ${issue.origin} to be ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        let _issue = issue;
        if (_issue.format === "starts_with")
          return `Invalid string: must start with "${_issue.prefix}"`;
        if (_issue.format === "ends_with")
          return `Invalid string: must end with "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Invalid string: must include "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Invalid string: must match pattern ${_issue.pattern}`;
        return `Invalid ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Invalid number: must be a multiple of ${issue.divisor}`;
      case "unrecognized_keys":
        return `Unrecognized key${issue.keys.length > 1 ? "s" : ""}: ${joinValues2(issue.keys, ", ")}`;
      case "invalid_key":
        return `Invalid key in ${issue.origin}`;
      case "invalid_union":
        if (issue.options && Array.isArray(issue.options) && issue.options.length > 0)
          return `Invalid discriminator value. Expected ${issue.options.map((o) => `'${o}'`).join(" | ")}`;
        if (issue.inclusive === !1)
          return "Invalid input: more than one option matched";
        return "Invalid input";
      case "invalid_element":
        return `Invalid value in ${issue.origin}`;
      default:
        return "Invalid input";
    }
  };
};
function en_default2() {
  return {
    localeError: error2()
  };
}
// node_modules/zod/v4/core/registries.js
var _a5;
class $ZodRegistry3 {
  constructor() {
    this._map = /* @__PURE__ */ new WeakMap, this._idmap = /* @__PURE__ */ new Map;
  }
  add(schema, ..._meta) {
    let meta = _meta[0];
    if (this._map.set(schema, meta), meta && typeof meta === "object" && "id" in meta)
      this._idmap.set(meta.id, schema);
    return this;
  }
  clear() {
    return this._map = /* @__PURE__ */ new WeakMap, this._idmap = /* @__PURE__ */ new Map, this;
  }
  remove(schema) {
    let meta = this._map.get(schema);
    if (meta && typeof meta === "object" && "id" in meta)
      this._idmap.delete(meta.id);
    return this._map.delete(schema), this;
  }
  get(schema) {
    let p = schema._zod.parent;
    if (p) {
      let pm = { ...this.get(p) ?? {} };
      delete pm.id;
      let f = { ...pm, ...this._map.get(schema) };
      return Object.keys(f).length ? f : void 0;
    }
    return this._map.get(schema);
  }
  has(schema) {
    return this._map.has(schema);
  }
}
function registry3() {
  return new $ZodRegistry3;
}
(_a5 = globalThis).__zod_globalRegistry ?? (_a5.__zod_globalRegistry = registry3());
var globalRegistry3 = globalThis.__zod_globalRegistry;
// node_modules/zod/v4/core/api.js
function snapshotChecks2(def) {
  if (def.checks)
    def.checks = [...def.checks];
  return def;
}
function _string3(Class, params) {
  return new Class(snapshotChecks2({ type: "string", ...normalizeParams3(params) }));
}
function _email3(Class, params) {
  return new Class({
    type: "string",
    format: "email",
    check: "string_format",
    abort: !1,
    ...normalizeParams3(params)
  });
}
function _guid3(Class, params) {
  return new Class({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: !1,
    ...normalizeParams3(params)
  });
}
function _uuid3(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    ...normalizeParams3(params)
  });
}
function _uuidv43(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v4",
    ...normalizeParams3(params)
  });
}
function _uuidv63(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v6",
    ...normalizeParams3(params)
  });
}
function _uuidv73(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v7",
    ...normalizeParams3(params)
  });
}
function _url3(Class, params) {
  return new Class({
    type: "string",
    format: "url",
    check: "string_format",
    abort: !1,
    ...normalizeParams3(params)
  });
}
function _emoji6(Class, params) {
  return new Class({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: !1,
    ...normalizeParams3(params)
  });
}
function _nanoid3(Class, params) {
  return new Class({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: !1,
    ...normalizeParams3(params)
  });
}
function _cuid4(Class, params) {
  return new Class({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: !1,
    ...normalizeParams3(params)
  });
}
function _cuid23(Class, params) {
  return new Class({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: !1,
    ...normalizeParams3(params)
  });
}
function _ulid3(Class, params) {
  return new Class({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: !1,
    ...normalizeParams3(params)
  });
}
function _xid3(Class, params) {
  return new Class({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: !1,
    ...normalizeParams3(params)
  });
}
function _ksuid3(Class, params) {
  return new Class({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: !1,
    ...normalizeParams3(params)
  });
}
function _ipv43(Class, params) {
  return new Class({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: !1,
    ...normalizeParams3(params)
  });
}
function _ipv63(Class, params) {
  return new Class({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: !1,
    ...normalizeParams3(params)
  });
}
function _cidrv43(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: !1,
    ...normalizeParams3(params)
  });
}
function _cidrv63(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: !1,
    ...normalizeParams3(params)
  });
}
function _base643(Class, params) {
  return new Class({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: !1,
    ...normalizeParams3(params)
  });
}
function _base64url3(Class, params) {
  return new Class({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: !1,
    ...normalizeParams3(params)
  });
}
function _e1643(Class, params) {
  return new Class({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: !1,
    ...normalizeParams3(params)
  });
}
function _jwt3(Class, params) {
  return new Class({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: !1,
    ...normalizeParams3(params)
  });
}
function _isoDateTime3(Class, params) {
  return new Class({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: !1,
    local: !1,
    precision: null,
    ...normalizeParams3(params)
  });
}
function _isoDate3(Class, params) {
  return new Class({
    type: "string",
    format: "date",
    check: "string_format",
    ...normalizeParams3(params)
  });
}
function _isoTime3(Class, params) {
  return new Class({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...normalizeParams3(params)
  });
}
function _isoDuration3(Class, params) {
  return new Class({
    type: "string",
    format: "duration",
    check: "string_format",
    ...normalizeParams3(params)
  });
}
function _number3(Class, params) {
  return new Class(snapshotChecks2({ type: "number", checks: [], ...normalizeParams3(params) }));
}
function _int3(Class, params) {
  return new Class({
    type: "number",
    check: "number_format",
    abort: !1,
    format: "safeint",
    ...normalizeParams3(params)
  });
}
function _unknown3(Class) {
  return new Class({
    type: "unknown"
  });
}
function _never3(Class, params) {
  return new Class({
    type: "never",
    ...normalizeParams3(params)
  });
}
function _lt3(value, params) {
  return new $ZodCheckLessThan3({
    check: "less_than",
    ...normalizeParams3(params),
    value,
    inclusive: !1
  });
}
function _lte3(value, params) {
  return new $ZodCheckLessThan3({
    check: "less_than",
    ...normalizeParams3(params),
    value,
    inclusive: !0
  });
}
function _gt3(value, params) {
  return new $ZodCheckGreaterThan3({
    check: "greater_than",
    ...normalizeParams3(params),
    value,
    inclusive: !1
  });
}
function _gte3(value, params) {
  return new $ZodCheckGreaterThan3({
    check: "greater_than",
    ...normalizeParams3(params),
    value,
    inclusive: !0
  });
}
function _multipleOf3(value, params) {
  return new $ZodCheckMultipleOf3({
    check: "multiple_of",
    ...normalizeParams3(params),
    value
  });
}
function _maxLength3(maximum, params) {
  return new $ZodCheckMaxLength3({
    check: "max_length",
    ...normalizeParams3(params),
    maximum
  });
}
function _minLength3(minimum, params) {
  return new $ZodCheckMinLength3({
    check: "min_length",
    ...normalizeParams3(params),
    minimum
  });
}
function _length3(length, params) {
  return new $ZodCheckLengthEquals3({
    check: "length_equals",
    ...normalizeParams3(params),
    length
  });
}
function _regex3(pattern, params) {
  return new $ZodCheckRegex3({
    check: "string_format",
    format: "regex",
    ...normalizeParams3(params),
    pattern
  });
}
function _lowercase3(params) {
  return new $ZodCheckLowerCase3({
    check: "string_format",
    format: "lowercase",
    ...normalizeParams3(params)
  });
}
function _uppercase3(params) {
  return new $ZodCheckUpperCase3({
    check: "string_format",
    format: "uppercase",
    ...normalizeParams3(params)
  });
}
function _includes3(includes, params) {
  return new $ZodCheckIncludes3({
    check: "string_format",
    format: "includes",
    ...normalizeParams3(params),
    includes
  });
}
function _startsWith3(prefix, params) {
  return new $ZodCheckStartsWith3({
    check: "string_format",
    format: "starts_with",
    ...normalizeParams3(params),
    prefix
  });
}
function _endsWith3(suffix, params) {
  return new $ZodCheckEndsWith3({
    check: "string_format",
    format: "ends_with",
    ...normalizeParams3(params),
    suffix
  });
}
function _overwrite3(tx) {
  return new $ZodCheckOverwrite3({
    check: "overwrite",
    tx
  });
}
function _normalize3(form) {
  return _overwrite3((input) => input.normalize(form));
}
function _trim3() {
  return _overwrite3((input) => input.trim());
}
function _toLowerCase3() {
  return _overwrite3((input) => input.toLowerCase());
}
function _toUpperCase3() {
  return _overwrite3((input) => input.toUpperCase());
}
function _slugify3() {
  return _overwrite3((input) => slugify3(input));
}
function _array3(Class, element, params) {
  return new Class({
    type: "array",
    element,
    ...normalizeParams3(params)
  });
}
function _refine3(Class, fn, _params) {
  return new Class({
    type: "custom",
    check: "custom",
    fn,
    ...normalizeParams3(_params)
  });
}
function _superRefine3(fn, params) {
  let ch = _check3((payload) => (payload.addIssue = (issue) => {
    if (typeof issue === "string")
      payload.issues.push(issue3(issue, payload.value, ch._zod.def));
    else {
      let _issue = issue;
      if (_issue.fatal)
        _issue.continue = !1;
      if (_issue.code ?? (_issue.code = "custom"), !("input" in _issue))
        _issue.input = payload.value;
      _issue.inst ?? (_issue.inst = ch), _issue.continue ?? (_issue.continue = !ch._zod.def.abort), payload.issues.push(issue3(_issue));
    }
  }, fn(payload.value, payload)), params);
  return ch;
}
function _check3(fn, params) {
  let ch = new $ZodCheck3({
    check: "custom",
    ...normalizeParams3(params)
  });
  return ch._zod.check = fn, ch;
}
// node_modules/zod/v4/core/to-json-schema.js
function assignProps2(target, ...sources) {
  for (let source of sources)
    for (let key of Reflect.ownKeys(source))
      if (Object.prototype.propertyIsEnumerable.call(source, key))
        assignProp3(target, key, source[key]);
  return target;
}
function initializeContext3(params) {
  let target = params?.target ?? "draft-2020-12";
  if (target === "draft-4")
    target = "draft-04";
  if (target === "draft-7")
    target = "draft-07";
  return {
    processors: params.processors ?? {},
    metadataRegistry: params?.metadata ?? globalRegistry3,
    target,
    unrepresentable: params?.unrepresentable ?? "throw",
    override: params?.override ?? (() => {}),
    io: params?.io ?? "output",
    counter: 0,
    seen: /* @__PURE__ */ new Map,
    sharedDefsExtractedFor: void 0,
    sharedEmitDoneFor: void 0,
    cycles: params?.cycles ?? "ref",
    reused: params?.reused ?? "inline",
    intersections: [],
    deferred: [],
    external: params?.external ?? void 0
  };
}
function handleUnrepresentable2(schema, ctx, json, params, message) {
  let result = typeof ctx.unrepresentable === "function" ? ctx.unrepresentable({ zodSchema: schema, path: params.path, message }) : ctx.unrepresentable;
  if (result === "any")
    return !1;
  if (result === void 0 || result === "throw")
    throw Error(message);
  return Object.assign(json, result), !0;
}
function processSchema2(schema, ctx, _params = { path: [], schemaPath: [] }) {
  var _a;
  let def = schema._zod.def, seen = ctx.seen.get(schema);
  if (seen) {
    if (seen.count++, _params.schemaPath.includes(schema))
      seen.cycle = _params.path;
    return seen.schema;
  }
  let result = { schema: {}, count: 1, cycle: void 0, path: _params.path };
  ctx.seen.set(schema, result), ctx.sharedDefsExtractedFor = void 0, ctx.sharedEmitDoneFor = void 0;
  let overrideSchema = schema._zod.toJSONSchema?.();
  if (overrideSchema)
    result.schema = overrideSchema;
  else {
    let params = {
      ..._params,
      schemaPath: [..._params.schemaPath, schema],
      path: _params.path
    };
    if (schema._zod.processJSONSchema)
      schema._zod.processJSONSchema(ctx, result.schema, params);
    else {
      let _json = result.schema, processor = ctx.processors[def.type];
      if (!processor)
        throw Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
      processor(schema, ctx, _json, params);
    }
    let parent = schema._zod.parent;
    if (parent) {
      if (!result.ref)
        result.ref = parent;
      processSchema2(parent, ctx, params), ctx.seen.get(parent).isParent = !0;
    }
  }
  let meta = ctx.metadataRegistry.get(schema);
  if (meta)
    assignProps2(result.schema, meta);
  if (ctx.io === "input" && isTransforming3(schema))
    delete result.schema.examples, delete result.schema.default;
  if (ctx.io === "input" && "_prefault" in result.schema)
    (_a = result.schema).default ?? (_a.default = result.schema._prefault);
  return delete result.schema._prefault, ctx.seen.get(schema).schema;
}
function encodeJSONPointerSegment2(segment) {
  return segment.replace(/~/g, "~0").replace(/\//g, "~1");
}
function extractDefs3(ctx, schema) {
  let root = ctx.seen.get(schema);
  if (!root)
    throw Error("Unprocessed schema. This is a bug in Zod.");
  if (ctx.external && ctx.sharedDefsExtractedFor === ctx.external)
    return;
  let idToSchema = /* @__PURE__ */ new Map;
  for (let entry of ctx.seen.entries()) {
    let id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      let existing = idToSchema.get(id);
      if (existing && existing !== entry[0])
        throw Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      idToSchema.set(id, entry[0]);
    }
  }
  let makeURI = (entry) => {
    let defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
    if (ctx.external) {
      let externalId = ctx.external.registry.get(entry[0])?.id, uriGenerator = ctx.external.uri ?? ((id) => id);
      if (externalId)
        return { ref: uriGenerator(externalId) };
      let id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
      return entry[1].defId = id, { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${encodeJSONPointerSegment2(id)}` };
    }
    let uriPrefix = "#", defUriPrefix = `${uriPrefix}/${defsSegment}/`;
    if (entry[1] === root && !entry[1].schema.id)
      return { ref: uriPrefix };
    let defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
    return { defId, ref: defUriPrefix + encodeJSONPointerSegment2(defId) };
  }, extractToDef = (entry) => {
    if (entry[1].schema.$ref)
      return;
    let seen = entry[1], { ref, defId } = makeURI(entry);
    if (seen.def = { ...seen.schema }, defId)
      seen.defId = defId;
    let schema = seen.schema;
    for (let key in schema)
      delete schema[key];
    schema.$ref = ref;
  };
  if (ctx.cycles === "throw")
    for (let entry of ctx.seen.entries()) {
      let seen = entry[1];
      if (seen.cycle)
        throw Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
    }
  for (let entry of ctx.seen.entries()) {
    let seen = entry[1];
    if (schema === entry[0]) {
      extractToDef(entry);
      continue;
    }
    if (ctx.external) {
      let ext = ctx.external.registry.get(entry[0])?.id;
      if (schema !== entry[0] && ext) {
        extractToDef(entry);
        continue;
      }
    }
    if (ctx.metadataRegistry.get(entry[0])?.id) {
      extractToDef(entry);
      continue;
    }
    if (seen.cycle) {
      extractToDef(entry);
      continue;
    }
    if (seen.count > 1) {
      if (ctx.reused === "ref")
        extractToDef(entry);
    }
  }
  if (ctx.external)
    ctx.sharedDefsExtractedFor = ctx.external;
}
function compactTypeUnion2(schema) {
  let options = schema.anyOf;
  if (!Array.isArray(options) || options.length === 0 || schema.type !== void 0)
    return;
  let types = [];
  for (let option of options) {
    if (!option || typeof option !== "object")
      return;
    compactTypeUnion2(option);
    let keys = Object.keys(option);
    if (keys.length !== 1 || keys[0] !== "type")
      return;
    let type = option.type;
    for (let member of Array.isArray(type) ? type : [type]) {
      if (typeof member !== "string")
        return;
      if (!types.includes(member))
        types.push(member);
    }
  }
  delete schema.anyOf, schema.type = types.length === 1 ? types[0] : types;
}
var FOLDABLE_KEYS2 = /* @__PURE__ */ new Set(["type", "properties", "required", "additionalProperties"]), UNION_KEYS2 = ["oneOf", "anyOf"];
function undeclaredConstraint2(member) {
  let extra = member.additionalProperties;
  if (extra === void 0 || extra === !1 || typeof extra !== "object" || extra === null)
    return null;
  return Object.keys(extra).length ? extra : null;
}
function foldObjects2(members) {
  let objects = [];
  for (let member of members) {
    if (typeof member !== "object" || member.type !== "object")
      return null;
    for (let key in member)
      if (!FOLDABLE_KEYS2.has(key))
        return null;
    objects.push(member);
  }
  let properties = {}, required = /* @__PURE__ */ new Set;
  for (let object of objects) {
    for (let key in object.properties) {
      if (Object.prototype.hasOwnProperty.call(properties, key))
        continue;
      let parts = [];
      for (let other of objects) {
        let part = other.properties?.[key] ?? undeclaredConstraint2(other);
        if (part === null || part === void 0)
          continue;
        if (!parts.some((seen) => JSON.stringify(seen) === JSON.stringify(part)))
          parts.push(part);
      }
      let merged = parts.length === 1 ? parts[0] : foldObjects2(parts) ?? { allOf: parts };
      assignProp3(properties, key, merged);
    }
    for (let key of object.required ?? [])
      required.add(key);
  }
  let folded = { type: "object", properties };
  if (required.size)
    folded.required = [...required];
  if (objects.every((object) => object.additionalProperties === !1))
    folded.additionalProperties = !1;
  else {
    let constraints = [];
    for (let object of objects) {
      let constraint = undeclaredConstraint2(object);
      if (constraint && !constraints.some((seen) => JSON.stringify(seen) === JSON.stringify(constraint)))
        constraints.push(constraint);
    }
    if (constraints.length === 1)
      folded.additionalProperties = constraints[0];
    else if (constraints.length > 1)
      folded.additionalProperties = { allOf: constraints };
  }
  return folded;
}
function foldIntersection2(json) {
  let allOf = json.allOf;
  if (!Array.isArray(allOf) || allOf.length < 2)
    return;
  for (let key of FOLDABLE_KEYS2)
    if (key in json)
      return;
  let unions = allOf.filter((m) => UNION_KEYS2.some((k) => Array.isArray(m[k]))), folded = null;
  if (!unions.length)
    folded = foldObjects2(allOf);
  else {
    let union = unions[0], keyword = UNION_KEYS2.find((k) => Array.isArray(union[k]));
    if (Object.keys(union).length !== 1)
      return;
    let rest = allOf.filter((m) => m !== union), branches = union[keyword].map((branch) => foldObjects2([...rest, branch]));
    if (branches.some((b) => !b))
      return;
    folded = { [keyword]: branches };
  }
  if (!folded)
    return;
  delete json.allOf, assignProps2(json, folded);
}
function finalize3(ctx, schema) {
  let root = ctx.seen.get(schema);
  if (!root)
    throw Error("Unprocessed schema. This is a bug in Zod.");
  let flattenRef = (zodSchema) => {
    let seen = ctx.seen.get(zodSchema);
    if (seen.ref === null)
      return;
    let schema = seen.def ?? seen.schema, _cached = { ...schema }, ref = seen.ref;
    if (seen.ref = null, ref) {
      flattenRef(ref);
      let refSeen = ctx.seen.get(ref), refSchema = refSeen.schema;
      if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0"))
        schema.allOf = schema.allOf ?? [], schema.allOf.push(refSchema);
      else
        assignProps2(schema, refSchema);
      if (assignProps2(schema, _cached), zodSchema._zod.parent === ref)
        for (let key in schema) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (!(key in _cached))
            delete schema[key];
        }
      if (refSchema.$ref && refSeen.def)
        for (let key in schema) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key]))
            delete schema[key];
        }
    }
    let parent = zodSchema._zod.parent;
    if (parent && parent !== ref) {
      flattenRef(parent);
      let parentSeen = ctx.seen.get(parent);
      if (parentSeen?.schema.$ref) {
        if (schema.$ref = parentSeen.schema.$ref, parentSeen.def)
          for (let key in schema) {
            if (key === "$ref" || key === "allOf")
              continue;
            if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key]))
              delete schema[key];
          }
      }
    }
    ctx.override({
      zodSchema,
      jsonSchema: schema,
      path: seen.path ?? []
    });
  };
  if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) {
    for (let entry of [...ctx.seen.entries()].reverse())
      flattenRef(entry[0]);
    if (ctx.target !== "openapi-3.0")
      for (let entry of ctx.seen.entries())
        compactTypeUnion2(entry[1].def ?? entry[1].schema);
    for (let rewrite of ctx.deferred)
      rewrite();
    if (ctx.intersections.length) {
      let carriers = /* @__PURE__ */ new Map;
      for (let seen of ctx.seen.values())
        for (let json of [seen.schema, seen.def]) {
          let allOf = json?.allOf;
          if (!Array.isArray(allOf))
            continue;
          let existing = carriers.get(allOf);
          if (existing)
            existing.push(json);
          else
            carriers.set(allOf, [json]);
        }
      for (let allOf of ctx.intersections)
        for (let json of carriers.get(allOf) ?? [])
          foldIntersection2(json);
    }
  }
  let result = {};
  if (ctx.target === "draft-2020-12")
    result.$schema = "https://json-schema.org/draft/2020-12/schema";
  else if (ctx.target === "draft-07")
    result.$schema = "http://json-schema.org/draft-07/schema#";
  else if (ctx.target === "draft-04")
    result.$schema = "http://json-schema.org/draft-04/schema#";
  else if (ctx.target === "openapi-3.0")
    ;
  if (ctx.external?.uri) {
    let id = ctx.external.registry.get(schema)?.id;
    if (!id)
      throw Error("Schema is missing an `id` property");
    result.$id = ctx.external.uri(id);
  }
  assignProps2(result, root.defId ? root.schema : root.def ?? root.schema);
  let rootMetaId = ctx.metadataRegistry.get(schema)?.id;
  if (rootMetaId !== void 0 && result.id === rootMetaId)
    delete result.id;
  let defs = ctx.external?.defs ?? {};
  if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external)
    for (let entry of ctx.seen.entries()) {
      let seen = entry[1];
      if (seen.def && seen.defId) {
        if (seen.def.id === seen.defId)
          delete seen.def.id;
        assignProp3(defs, seen.defId, seen.def);
      }
    }
  if (ctx.external)
    ctx.sharedEmitDoneFor = ctx.external;
  if (ctx.external)
    ;
  else if (Object.keys(defs).length > 0)
    if (ctx.target === "draft-2020-12")
      result.$defs = defs;
    else
      result.definitions = defs;
  try {
    let finalized = JSON.parse(JSON.stringify(result));
    return Object.defineProperty(finalized, "~standard", {
      value: {
        ...schema["~standard"],
        jsonSchema: {
          input: createStandardJSONSchemaMethod3(schema, "input", ctx.processors),
          output: createStandardJSONSchemaMethod3(schema, "output", ctx.processors)
        }
      },
      enumerable: !1,
      writable: !1
    }), finalized;
  } catch (_err) {
    throw Error("Error converting schema to JSON.");
  }
}
function isTransforming3(_schema, _ctx) {
  let ctx = _ctx ?? { seen: /* @__PURE__ */ new Set };
  if (ctx.seen.has(_schema))
    return !1;
  ctx.seen.add(_schema);
  let def = _schema._zod.def;
  if (def.type === "transform")
    return !0;
  if (def.type === "array")
    return isTransforming3(def.element, ctx);
  if (def.type === "set")
    return isTransforming3(def.valueType, ctx);
  if (def.type === "lazy")
    return isTransforming3(def.getter(), ctx);
  if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault" || def.type === "catch")
    return isTransforming3(def.innerType, ctx);
  if (def.type === "intersection")
    return isTransforming3(def.left, ctx) || isTransforming3(def.right, ctx);
  if (def.type === "record" || def.type === "map")
    return isTransforming3(def.keyType, ctx) || isTransforming3(def.valueType, ctx);
  if (def.type === "pipe") {
    if (_schema._zod.traits.has("$ZodCodec"))
      return !0;
    return isTransforming3(def.in, ctx) || isTransforming3(def.out, ctx);
  }
  if (def.type === "object") {
    for (let key in def.shape)
      if (isTransforming3(def.shape[key], ctx))
        return !0;
    return !1;
  }
  if (def.type === "union") {
    for (let option of def.options)
      if (isTransforming3(option, ctx))
        return !0;
    return !1;
  }
  if (def.type === "tuple") {
    for (let item of def.items)
      if (isTransforming3(item, ctx))
        return !0;
    if (def.rest && isTransforming3(def.rest, ctx))
      return !0;
    return !1;
  }
  return !1;
}
var createToJSONSchemaMethod3 = (schema, processors = {}) => (params) => {
  let ctx = initializeContext3({ ...params, processors });
  return processSchema2(schema, ctx), extractDefs3(ctx, schema), finalize3(ctx, schema);
}, createStandardJSONSchemaMethod3 = (schema, io, processors = {}) => (params) => {
  let { libraryOptions, target } = params ?? {}, ctx = initializeContext3({ ...libraryOptions ?? {}, target, io, processors });
  return processSchema2(schema, ctx), extractDefs3(ctx, schema), finalize3(ctx, schema);
};
// node_modules/zod/v4/core/json-schema-processors.js
var narrowMin2 = (agg, key, value) => {
  if (agg[key] === void 0 || value > agg[key])
    agg[key] = value;
}, narrowMax2 = (agg, key, value) => {
  if (agg[key] === void 0 || value < agg[key])
    agg[key] = value;
}, narrowBoth2 = (agg, value) => {
  narrowMin2(agg, "minimum", value), narrowMax2(agg, "maximum", value);
}, addDivisor2 = (agg, value) => {
  if (agg.multipleOf ?? (agg.multipleOf = []), !agg.multipleOf.includes(value))
    agg.multipleOf.push(value);
}, addPattern2 = (agg, pattern) => {
  agg.patterns ?? (agg.patterns = /* @__PURE__ */ new Set), agg.patterns.add(pattern);
}, intersectMime2 = (agg, mime) => {
  agg.mime = agg.mime ? agg.mime.filter((m) => mime.includes(m)) : [...mime];
}, setFormat2 = (agg, format) => {
  if (agg.format = format, format.includes("int"))
    agg.isInt = !0;
}, minContributor2 = (agg, def) => narrowMin2(agg, "minimum", def.minimum), maxContributor2 = (agg, def) => narrowMax2(agg, "maximum", def.maximum), formatContributor2 = (ranges) => (agg, def) => {
  setFormat2(agg, def.format);
  let [minimum, maximum] = ranges[def.format];
  narrowMin2(agg, "minimum", minimum), narrowMax2(agg, "maximum", maximum);
}, contributors2 = {
  greater_than: (agg, def) => narrowMin2(agg, def.inclusive ? "minimum" : "exclusiveMinimum", def.value),
  less_than: (agg, def) => narrowMax2(agg, def.inclusive ? "maximum" : "exclusiveMaximum", def.value),
  multiple_of: (agg, def) => addDivisor2(agg, def.value),
  number_format: formatContributor2(NUMBER_FORMAT_RANGES3),
  bigint_format: formatContributor2(BIGINT_FORMAT_RANGES3),
  min_length: minContributor2,
  max_length: maxContributor2,
  length_equals: (agg, def) => narrowBoth2(agg, def.length),
  min_size: minContributor2,
  max_size: maxContributor2,
  size_equals: (agg, def) => narrowBoth2(agg, def.size),
  string_format: (agg, def) => {
    if (setFormat2(agg, def.format), def.pattern)
      addPattern2(agg, def.pattern);
    if (def.format === "base64" || def.format === "base64url")
      agg.contentEncoding = def.format;
    if (def.local || def.precision === -1)
      agg.laxFormat = !0;
  },
  mime_type: (agg, def) => intersectMime2(agg, def.mime)
};
function aggregateChecks2(schema) {
  let agg = {}, def = schema._zod.def, list = schema._zod.traits.has("$ZodCheck") ? [schema, ...def.checks ?? []] : def.checks ?? [];
  for (let ch of list)
    contributors2[ch._zod.def.check]?.(agg, ch._zod.def);
  let bag = schema._zod.bag;
  if (bag.minimum !== void 0)
    narrowMin2(agg, "minimum", bag.minimum);
  if (bag.exclusiveMinimum !== void 0)
    narrowMin2(agg, "exclusiveMinimum", bag.exclusiveMinimum);
  if (bag.maximum !== void 0)
    narrowMax2(agg, "maximum", bag.maximum);
  if (bag.exclusiveMaximum !== void 0)
    narrowMax2(agg, "exclusiveMaximum", bag.exclusiveMaximum);
  if (bag.multipleOf !== void 0)
    addDivisor2(agg, bag.multipleOf);
  if (bag.format !== void 0) {
    if (agg.format ?? (agg.format = bag.format), bag.format.includes("int"))
      agg.isInt = !0;
  }
  if (bag.mime)
    intersectMime2(agg, bag.mime);
  for (let pattern of bag.patterns ?? [])
    addPattern2(agg, pattern);
  return agg;
}
var formatMap3 = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
}, exactPatterns2 = /* @__PURE__ */ new Map([
  [base64Charset2, base643],
  [base64urlCharset2, base64url3]
]), exactPattern2 = (p) => exactPatterns2.get(p) ?? p, stringProcessor3 = (schema, ctx, _json, _params) => {
  let json = _json;
  json.type = "string";
  let { minimum, maximum, format, patterns, contentEncoding, laxFormat } = aggregateChecks2(schema);
  if (typeof minimum === "number")
    json.minLength = minimum;
  if (typeof maximum === "number")
    json.maxLength = maximum;
  if (format) {
    if (json.format = formatMap3[format] ?? format, json.format === "")
      delete json.format;
    if (format === "time" || laxFormat)
      delete json.format;
  }
  if (contentEncoding)
    json.contentEncoding = contentEncoding;
  if (patterns && patterns.size > 0) {
    let patternList = [...patterns].map(exactPattern2);
    if (patternList.length === 1)
      json.pattern = patternList[0].source;
    else if (patternList.length > 1)
      json.allOf = [
        ...patternList.map((regex) => ({
          ...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
          pattern: regex.source
        }))
      ];
  }
}, numberProcessor3 = (schema, ctx, _json, params) => {
  let json = _json, { minimum, maximum, multipleOf, exclusiveMaximum, exclusiveMinimum, isInt } = aggregateChecks2(schema);
  json.type = isInt ? "integer" : "number";
  let exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY), exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY), legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
  if (exMin)
    if (legacy)
      json.minimum = exclusiveMinimum, json.exclusiveMinimum = !0;
    else
      json.exclusiveMinimum = exclusiveMinimum;
  else if (typeof minimum === "number")
    json.minimum = minimum;
  if (exMax)
    if (legacy)
      json.maximum = exclusiveMaximum, json.exclusiveMaximum = !0;
    else
      json.exclusiveMaximum = exclusiveMaximum;
  else if (typeof maximum === "number")
    json.maximum = maximum;
  if (multipleOf) {
    let divisors = /* @__PURE__ */ new Set;
    for (let divisor of multipleOf)
      if (Number.isFinite(divisor) && divisor !== 0)
        divisors.add(Math.abs(divisor));
      else
        handleUnrepresentable2(schema, ctx, json, params, `A multipleOf divisor of ${divisor} cannot be represented in JSON Schema`);
    let [first, ...rest] = divisors;
    if (first !== void 0)
      json.multipleOf = first;
    if (rest.length)
      json.allOf = [...json.allOf ?? [], ...rest.map((m) => ({ multipleOf: m }))];
  }
};
var neverProcessor3 = (_schema, _ctx, json, _params) => {
  json.not = {};
};
var unknownProcessor3 = (_schema, _ctx, _json, _params) => {};
var enumProcessor3 = (schema, _ctx, json, _params) => {
  let def = schema._zod.def, values = getEnumValues3(def.entries);
  if (values.length === 0) {
    json.not = {};
    return;
  }
  if (values.every((v) => typeof v === "number"))
    json.type = "number";
  if (values.every((v) => typeof v === "string"))
    json.type = "string";
  json.enum = values;
}, literalProcessor3 = (schema, ctx, json, params) => {
  let def = schema._zod.def;
  if (def.values.length === 0) {
    json.not = {};
    return;
  }
  let vals = [];
  for (let val of def.values)
    if (val === void 0) {
      if (handleUnrepresentable2(schema, ctx, json, params, "Literal `undefined` cannot be represented in JSON Schema"))
        return;
    } else if (typeof val === "bigint") {
      if (handleUnrepresentable2(schema, ctx, json, params, "BigInt literals cannot be represented in JSON Schema"))
        return;
      vals.push(Number(val));
    } else
      vals.push(val);
  if (vals.length === 0)
    ;
  else if (vals.length === 1) {
    let val = vals[0];
    if (json.type = val === null ? "null" : typeof val, ctx.target === "draft-04" || ctx.target === "openapi-3.0")
      json.enum = [val];
    else
      json.const = val;
  } else {
    if (vals.every((v) => typeof v === "number"))
      json.type = "number";
    if (vals.every((v) => typeof v === "string"))
      json.type = "string";
    if (vals.every((v) => typeof v === "boolean"))
      json.type = "boolean";
    if (vals.every((v) => v === null))
      json.type = "null";
    json.enum = vals;
  }
};
var customProcessor3 = (schema, ctx, json, params) => {
  handleUnrepresentable2(schema, ctx, json, params, "Custom types cannot be represented in JSON Schema");
};
var transformProcessor3 = (schema, ctx, json, params) => {
  handleUnrepresentable2(schema, ctx, json, params, "Transforms cannot be represented in JSON Schema");
};
var arrayProcessor3 = (schema, ctx, _json, params) => {
  let json = _json, def = schema._zod.def, { minimum, maximum } = aggregateChecks2(schema);
  if (typeof minimum === "number")
    json.minItems = minimum;
  if (typeof maximum === "number")
    json.maxItems = maximum;
  json.type = "array", json.items = processSchema2(def.element, ctx, {
    ...params,
    path: [...params.path, "items"]
  });
};
function inputOptin2(schema) {
  let def = schema._zod.def;
  if (def.type === "pipe" && def.in._zod.traits.has("$ZodTransform"))
    return inputOptin2(def.out);
  if (def.type === "catch")
    return inputOptin2(def.innerType);
  return schema._zod.optin;
}
var objectProcessor3 = (schema, ctx, _json, params) => {
  let json = _json, def = schema._zod.def, shape = def.shape;
  if (Object.getOwnPropertySymbols(shape).length && handleUnrepresentable2(schema, ctx, json, params, "Symbol keys cannot be represented in JSON Schema"))
    return;
  json.type = "object", json.properties = {};
  for (let key in shape)
    assignProp3(json.properties, key, processSchema2(shape[key], ctx, {
      ...params,
      path: [...params.path, "properties", key]
    }));
  let requiredKeys = [];
  for (let key of Object.keys(shape)) {
    let field = def.shape[key];
    if (ctx.io === "input" ? inputOptin2(field) === void 0 : field._zod.optout === void 0)
      requiredKeys.push(key);
  }
  if (requiredKeys.length > 0)
    json.required = requiredKeys;
  if (def.catchall?._zod.def.type === "never")
    json.additionalProperties = !1;
  else if (!def.catchall) {
    if (ctx.io === "output")
      json.additionalProperties = !1;
  } else if (def.catchall)
    json.additionalProperties = processSchema2(def.catchall, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
}, unionProcessor3 = (schema, ctx, json, params) => {
  let def = schema._zod.def, isExclusive = def.inclusive === !1, options = def.options.map((x, i) => processSchema2(x, ctx, {
    ...params,
    path: [...params.path, isExclusive ? "oneOf" : "anyOf", i]
  }));
  if (isExclusive)
    json.oneOf = options;
  else
    json.anyOf = options;
}, intersectionProcessor3 = (schema, ctx, json, params) => {
  let def = schema._zod.def, a = processSchema2(def.left, ctx, {
    ...params,
    path: [...params.path, "allOf", 0]
  }), b = processSchema2(def.right, ctx, {
    ...params,
    path: [...params.path, "allOf", 1]
  }), isSimpleIntersection = (val) => ("allOf" in val) && Object.keys(val).length === 1, allOf = [
    ...isSimpleIntersection(a) ? a.allOf : [a],
    ...isSimpleIntersection(b) ? b.allOf : [b]
  ];
  json.allOf = allOf, ctx.intersections.push(allOf);
};
function stringifyKeyNames2(bySchema, json, visited) {
  if (json.$ref) {
    if (visited.has(json))
      return json;
    visited.add(json);
    let def = bySchema.get(json)?.def;
    if (!def)
      return json;
    let inlined = stringifyKeyNames2(bySchema, def, visited);
    return inlined === def ? json : inlined;
  }
  for (let keyword of ["anyOf", "oneOf"]) {
    let branches = json[keyword];
    if (!Array.isArray(branches))
      continue;
    let mapped = branches.map((branch) => stringifyKeyNames2(bySchema, branch, visited));
    if (mapped.some((branch, i) => branch !== branches[i]))
      json = { ...json, [keyword]: mapped };
  }
  let types = Array.isArray(json.type) ? json.type : [json.type], numericType = !types.includes("string") && types.some((t) => t === "number" || t === "integer"), values = json.enum ?? (json.const !== void 0 ? [json.const] : void 0);
  if (!numericType && !values?.some((v) => typeof v === "number"))
    return json;
  let { minimum, maximum, exclusiveMinimum, exclusiveMaximum, multipleOf, format, id, ...rest } = json;
  if (rest.enum)
    rest.enum = rest.enum.map((v) => typeof v === "number" ? String(v) : v);
  else if (typeof rest.const === "number")
    rest.const = String(rest.const);
  if (!numericType)
    return rest;
  if (rest.type = "string", !values)
    rest.pattern = (types.includes("number") ? number5 : integer3).source;
  return rest;
}
var pendingRecords2 = /* @__PURE__ */ new WeakMap;
function rewriteKeyNames2(ctx) {
  let bySchema = /* @__PURE__ */ new Map;
  for (let entry of ctx.seen.values())
    if (entry.def && !bySchema.has(entry.schema))
      bySchema.set(entry.schema, entry);
  let rewrites = /* @__PURE__ */ new Map;
  for (let record of pendingRecords2.get(ctx) ?? []) {
    let seen = ctx.seen.get(record), names = (seen?.def ?? seen?.schema)?.propertyNames;
    if (!names || names === !0 || rewrites.has(names))
      continue;
    let rewritten = stringifyKeyNames2(bySchema, names, /* @__PURE__ */ new Set);
    if (rewritten !== names)
      rewrites.set(names, rewritten);
  }
  if (!rewrites.size)
    return;
  for (let entry of ctx.seen.values())
    for (let carrier of [entry.schema, entry.def]) {
      let rewritten = carrier && rewrites.get(carrier.propertyNames);
      if (rewritten)
        carrier.propertyNames = rewritten;
    }
}
var recordProcessor3 = (schema, ctx, _json, params) => {
  let json = _json, def = schema._zod.def;
  json.type = "object";
  let keyType = def.keyType, patterns = aggregateChecks2(keyType).patterns;
  if (def.mode === "loose" && patterns && patterns.size > 0) {
    let valueSchema = processSchema2(def.valueType, ctx, {
      ...params,
      path: [...params.path, "patternProperties", "*"]
    });
    json.patternProperties = {};
    for (let pattern of patterns)
      assignProp3(json.patternProperties, exactPattern2(pattern).source, valueSchema);
  } else {
    if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") {
      json.propertyNames = processSchema2(def.keyType, ctx, {
        ...params,
        path: [...params.path, "propertyNames"]
      });
      let pending = pendingRecords2.get(ctx);
      if (!pending)
        pending = [], pendingRecords2.set(ctx, pending), ctx.deferred.push(() => rewriteKeyNames2(ctx));
      pending.push(schema);
    }
    json.additionalProperties = processSchema2(def.valueType, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
  let keyValues = keyType._zod.values, omittableOnInput = ctx.io === "input" && inputOptin2(def.valueType) !== void 0;
  if (keyValues && !def.partial && !omittableOnInput) {
    let validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
    if (validKeyValues.length > 0)
      json.required = validKeyValues.map(String);
  }
}, nullableProcessor3 = (schema, ctx, json, params) => {
  let def = schema._zod.def, inner = processSchema2(def.innerType, ctx, params), seen = ctx.seen.get(schema);
  if (ctx.target === "openapi-3.0")
    seen.ref = def.innerType, json.nullable = !0;
  else
    json.anyOf = [inner, { type: "null" }];
}, nonoptionalProcessor3 = (schema, ctx, _json, params) => {
  let def = schema._zod.def;
  processSchema2(def.innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
}, UNREPRESENTABLE_DEFAULT2 = Symbol();
function serializeDefaultValue2(value, schema, ctx, json, params) {
  let unrepresentable = !1, serialized = JSON.stringify(value, (_, val) => {
    if (typeof val !== "bigint")
      return val;
    return unrepresentable = !0, null;
  });
  if (!unrepresentable)
    return JSON.parse(serialized);
  return handleUnrepresentable2(schema, ctx, json, params, "BigInt defaults cannot be represented in JSON Schema"), UNREPRESENTABLE_DEFAULT2;
}
var defaultProcessor3 = (schema, ctx, json, params) => {
  let def = schema._zod.def;
  processSchema2(def.innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  let value = serializeDefaultValue2(def.defaultValue, schema, ctx, json, params);
  if (value !== UNREPRESENTABLE_DEFAULT2)
    json.default = value;
}, prefaultProcessor3 = (schema, ctx, json, params) => {
  let def = schema._zod.def;
  processSchema2(def.innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  if (seen.ref = def.innerType, ctx.io !== "input")
    return;
  let value = serializeDefaultValue2(def.defaultValue, schema, ctx, json, params);
  if (value !== UNREPRESENTABLE_DEFAULT2)
    json._prefault = value;
}, catchProcessor3 = (schema, ctx, json, params) => {
  let def = schema._zod.def;
  processSchema2(def.innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  let catchValue;
  try {
    catchValue = def.catchValue(void 0);
  } catch {
    handleUnrepresentable2(schema, ctx, json, params, "Dynamic catch values are not supported in JSON Schema");
    return;
  }
  json.default = catchValue;
}, pipeProcessor3 = (schema, ctx, _json, params) => {
  let def = schema._zod.def, inIsTransform = def.in._zod.traits.has("$ZodTransform"), innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
  processSchema2(innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  seen.ref = innerType;
}, readonlyProcessor3 = (schema, ctx, json, params) => {
  let def = schema._zod.def;
  processSchema2(def.innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  seen.ref = def.innerType, json.readOnly = !0;
};
var optionalProcessor3 = (schema, ctx, _json, params) => {
  let def = schema._zod.def;
  processSchema2(def.innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
// node_modules/zod/v4/classic/errors.js
var _installedErrorProtos2 = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
function _lazyMethod2(proto, key, make) {
  Object.defineProperty(proto, key, {
    configurable: !0,
    enumerable: !1,
    get() {
      let value = make(this);
      return Object.defineProperty(this, key, { value, configurable: !0, writable: !0 }), value;
    },
    set(value) {
      Object.defineProperty(this, key, { value, configurable: !0, writable: !0 });
    }
  });
}
var initializer6 = (inst, issues) => {
  $ZodError3.init(inst, issues), inst.name = "ZodError";
  let proto = Object.getPrototypeOf(inst);
  if (_installedErrorProtos2.has(proto))
    return;
  _installedErrorProtos2.add(proto), _lazyMethod2(proto, "format", (self) => (mapper) => formatError3(self, mapper)), _lazyMethod2(proto, "flatten", (self) => (mapper) => flattenError3(self, mapper)), _lazyMethod2(proto, "addIssue", (self) => (issue) => {
    self.issues.push(issue), self.message = JSON.stringify(self.issues, jsonStringifyReplacer3, 2);
  }), _lazyMethod2(proto, "addIssues", (self) => (issues) => {
    self.issues.push(...issues), self.message = JSON.stringify(self.issues, jsonStringifyReplacer3, 2);
  }), Object.defineProperty(proto, "isEmpty", {
    configurable: !0,
    enumerable: !1,
    get() {
      return this.issues.length === 0;
    }
  });
};
var ZodRealError3 = /* @__PURE__ */ $constructor3("ZodError", initializer6, void 0, {
  Parent: Error
});

// node_modules/zod/v4/classic/parse.js
var parse8 = /* @__PURE__ */ _parse3(ZodRealError3), parseAsync4 = /* @__PURE__ */ _parseAsync3(ZodRealError3), safeParse4 = /* @__PURE__ */ _safeParse3(ZodRealError3), safeParseAsync4 = /* @__PURE__ */ _safeParseAsync3(ZodRealError3), encode3 = /* @__PURE__ */ _encode3(ZodRealError3), decode3 = /* @__PURE__ */ _decode3(ZodRealError3), encodeAsync3 = /* @__PURE__ */ _encodeAsync3(ZodRealError3), decodeAsync3 = /* @__PURE__ */ _decodeAsync3(ZodRealError3), safeEncode3 = /* @__PURE__ */ _safeEncode3(ZodRealError3), safeDecode3 = /* @__PURE__ */ _safeDecode3(ZodRealError3), safeEncodeAsync3 = /* @__PURE__ */ _safeEncodeAsync3(ZodRealError3), safeDecodeAsync3 = /* @__PURE__ */ _safeDecodeAsync3(ZodRealError3);

// node_modules/zod/v4/classic/schemas.js
function _ensureDefaultLocale2() {
  if (!globalConfig3.localeError)
    config3(en_default2());
}
function _ensureDefaultMemoizer2() {
  if (!globalConfig3.memoizer)
    config3({ memoizer: memoizer3() });
}
var ZodType3 = /* @__PURE__ */ $constructor3("ZodType", (inst, def) => (_ensureDefaultLocale2(), $ZodType3.init(inst, def), inst.def = def, inst.type = def.type, inst), {
  check(...chks) {
    let def = this.def;
    return this.clone(mergeDefs3(def, {
      checks: [
        ...def.checks ?? [],
        ...chks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
      ]
    }), { parent: !0 });
  },
  with(...chks) {
    return this.check(...chks);
  },
  clone(def, params) {
    return clone3(this, def, params);
  },
  brand() {
    return this;
  },
  register(reg, meta) {
    return reg.add(this, meta), this;
  },
  refine(check, params) {
    return this.check(refine3(check, params));
  },
  superRefine(refinement, params) {
    return this.check(superRefine3(refinement, params));
  },
  overwrite(fn) {
    return this.check(_overwrite3(fn));
  },
  optional() {
    return optional3(this);
  },
  exactOptional() {
    return exactOptional3(this);
  },
  nullable() {
    return nullable3(this);
  },
  nullish() {
    return optional3(nullable3(this));
  },
  nonoptional(params) {
    return nonoptional3(this, params);
  },
  array() {
    return array3(this);
  },
  or(arg) {
    return union3([this, arg]);
  },
  and(arg) {
    return intersection3(this, arg);
  },
  transform(tx) {
    return pipe3(this, transform3(tx));
  },
  default(d) {
    return _default3(this, d);
  },
  prefault(d) {
    return prefault3(this, d);
  },
  catch(params) {
    return _catch3(this, params);
  },
  pipe(target) {
    return pipe3(this, target);
  },
  readonly() {
    return readonly3(this);
  },
  describe(description) {
    let cl = this.clone();
    return globalRegistry3.add(cl, { description }), cl;
  },
  meta(...args) {
    if (args.length === 0)
      return globalRegistry3.get(this);
    let cl = this.clone();
    return globalRegistry3.add(cl, args[0]), cl;
  },
  isOptional() {
    return this.safeParse(void 0).success;
  },
  isNullable() {
    return this.safeParse(null).success;
  },
  apply(fn, ...args) {
    return args.length === 0 ? fn(this) : fn(this, ...args);
  },
  get "~standard"() {
    return hide2(this, "~standard", {
      ...standardProps2(this),
      jsonSchema: {
        input: createStandardJSONSchemaMethod3(this, "input"),
        output: createStandardJSONSchemaMethod3(this, "output")
      }
    });
  },
  set "~standard"(value) {
    own2(this, "~standard", value);
  },
  parse: function _parse(data, params) {
    return parse8(this, data, params, { callee: _parse });
  },
  parseAsync: async function _parseAsync(data, params) {
    return await parseAsync4(this, data, params, { callee: _parseAsync });
  },
  safeParse(data, params) {
    return safeParse4(this, data, params);
  },
  async safeParseAsync(data, params) {
    return safeParseAsync4(this, data, params);
  },
  get spa() {
    return this?.safeParseAsync;
  },
  set spa(value) {
    own2(this, "spa", value);
  },
  validate(data, params) {
    return validate2(this, data, params);
  },
  validateAsync(data, params) {
    return validateAsync3(this, data, params);
  },
  encode: function _encode(data, params) {
    return encode3(this, data, params, { callee: _encode });
  },
  decode: function _decode(data, params) {
    return decode3(this, data, params, { callee: _decode });
  },
  encodeAsync: async function _encodeAsync(data, params) {
    return await encodeAsync3(this, data, params, { callee: _encodeAsync });
  },
  decodeAsync: async function _decodeAsync(data, params) {
    return await decodeAsync3(this, data, params, { callee: _decodeAsync });
  },
  safeEncode(data, params) {
    return safeEncode3(this, data, params);
  },
  safeDecode(data, params) {
    return safeDecode3(this, data, params);
  },
  async safeEncodeAsync(data, params) {
    return safeEncodeAsync3(this, data, params);
  },
  async safeDecodeAsync(data, params) {
    return safeDecodeAsync3(this, data, params);
  },
  toJSONSchema(params) {
    return createToJSONSchemaMethod3(this, {})(params);
  },
  get description() {
    return globalRegistry3.get(this)?.description;
  },
  get _def() {
    return this._zod.def;
  }
}), _ZodString3 = /* @__PURE__ */ $constructor3("_ZodString", (inst, def) => {
  $ZodString3.init(inst, def), ZodType3.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor3(inst, ctx, json, params);
}, /* @__PURE__ */ derived2({
  format: (inst) => aggregateChecks2(inst).format ?? null,
  minLength: (inst) => aggregateChecks2(inst).minimum ?? null,
  maxLength: (inst) => aggregateChecks2(inst).maximum ?? null
}, {
  regex(...args) {
    return this.check(_regex3(...args));
  },
  includes(...args) {
    return this.check(_includes3(...args));
  },
  startsWith(...args) {
    return this.check(_startsWith3(...args));
  },
  endsWith(...args) {
    return this.check(_endsWith3(...args));
  },
  min(...args) {
    return this.check(_minLength3(...args));
  },
  max(...args) {
    return this.check(_maxLength3(...args));
  },
  length(...args) {
    return this.check(_length3(...args));
  },
  nonempty(...args) {
    return this.check(_minLength3(1, ...args));
  },
  lowercase(params) {
    return this.check(_lowercase3(params));
  },
  uppercase(params) {
    return this.check(_uppercase3(params));
  },
  trim() {
    return this.check(_trim3());
  },
  normalize(...args) {
    return this.check(_normalize3(...args));
  },
  toLowerCase() {
    return this.check(_toLowerCase3());
  },
  toUpperCase() {
    return this.check(_toUpperCase3());
  },
  slugify() {
    return this.check(_slugify3());
  }
})), ZodString3 = /* @__PURE__ */ $constructor3("ZodString", (inst, def) => {
  $ZodString3.init(inst, def), _ZodString3.init(inst, def);
}, {
  email(params) {
    return this.check(_email3(ZodEmail3, params));
  },
  url(params) {
    return this.check(_url3(ZodURL3, params));
  },
  jwt(params) {
    return this.check(_jwt3(ZodJWT3, params));
  },
  emoji(params) {
    return this.check(_emoji6(ZodEmoji3, params));
  },
  guid(params) {
    return this.check(_guid3(ZodGUID3, params));
  },
  uuid(params) {
    return this.check(_uuid3(ZodUUID3, params));
  },
  uuidv4(params) {
    return this.check(_uuidv43(ZodUUID3, params));
  },
  uuidv6(params) {
    return this.check(_uuidv63(ZodUUID3, params));
  },
  uuidv7(params) {
    return this.check(_uuidv73(ZodUUID3, params));
  },
  nanoid(params) {
    return this.check(_nanoid3(ZodNanoID3, params));
  },
  cuid(params) {
    return this.check(_cuid4(ZodCUID4, params));
  },
  cuid2(params) {
    return this.check(_cuid23(ZodCUID23, params));
  },
  ulid(params) {
    return this.check(_ulid3(ZodULID3, params));
  },
  base64(params) {
    return this.check(_base643(ZodBase643, params));
  },
  base64url(params) {
    return this.check(_base64url3(ZodBase64URL3, params));
  },
  xid(params) {
    return this.check(_xid3(ZodXID3, params));
  },
  ksuid(params) {
    return this.check(_ksuid3(ZodKSUID3, params));
  },
  ipv4(params) {
    return this.check(_ipv43(ZodIPv43, params));
  },
  ipv6(params) {
    return this.check(_ipv63(ZodIPv63, params));
  },
  cidrv4(params) {
    return this.check(_cidrv43(ZodCIDRv43, params));
  },
  cidrv6(params) {
    return this.check(_cidrv63(ZodCIDRv63, params));
  },
  e164(params) {
    return this.check(_e1643(ZodE1643, params));
  },
  datetime(params) {
    return this.check(_isoDateTime3(ZodISODateTime3, params));
  },
  date(params) {
    return this.check(_isoDate3(ZodISODate3, params));
  },
  time(params) {
    return this.check(_isoTime3(ZodISOTime3, params));
  },
  duration(params) {
    return this.check(_isoDuration3(ZodISODuration3, params));
  }
});
function string6(params) {
  return _string3(ZodString3, params);
}
var ZodStringFormat3 = /* @__PURE__ */ $constructor3("ZodStringFormat", (inst, def) => {
  $ZodStringFormat3.init(inst, def), _ZodString3.init(inst, def);
}), ZodISODateTime3 = /* @__PURE__ */ $constructor3("ZodISODateTime", (inst, def) => {
  $ZodISODateTime3.init(inst, def), ZodStringFormat3.init(inst, def);
}), ZodISODate3 = /* @__PURE__ */ $constructor3("ZodISODate", (inst, def) => {
  $ZodISODate3.init(inst, def), ZodStringFormat3.init(inst, def);
}), ZodISOTime3 = /* @__PURE__ */ $constructor3("ZodISOTime", (inst, def) => {
  $ZodISOTime3.init(inst, def), ZodStringFormat3.init(inst, def);
}), ZodISODuration3 = /* @__PURE__ */ $constructor3("ZodISODuration", (inst, def) => {
  $ZodISODuration3.init(inst, def), ZodStringFormat3.init(inst, def);
}), ZodEmail3 = /* @__PURE__ */ $constructor3("ZodEmail", (inst, def) => {
  $ZodEmail3.init(inst, def), ZodStringFormat3.init(inst, def);
});
var ZodGUID3 = /* @__PURE__ */ $constructor3("ZodGUID", (inst, def) => {
  $ZodGUID3.init(inst, def), ZodStringFormat3.init(inst, def);
});
var ZodUUID3 = /* @__PURE__ */ $constructor3("ZodUUID", (inst, def) => {
  $ZodUUID3.init(inst, def), ZodStringFormat3.init(inst, def);
});
var ZodURL3 = /* @__PURE__ */ $constructor3("ZodURL", (inst, def) => {
  $ZodURL3.init(inst, def), ZodStringFormat3.init(inst, def);
});
var ZodEmoji3 = /* @__PURE__ */ $constructor3("ZodEmoji", (inst, def) => {
  $ZodEmoji3.init(inst, def), ZodStringFormat3.init(inst, def);
});
var ZodNanoID3 = /* @__PURE__ */ $constructor3("ZodNanoID", (inst, def) => {
  $ZodNanoID3.init(inst, def), ZodStringFormat3.init(inst, def);
});
var ZodCUID4 = /* @__PURE__ */ $constructor3("ZodCUID", (inst, def) => {
  $ZodCUID4.init(inst, def), ZodStringFormat3.init(inst, def);
});
var ZodCUID23 = /* @__PURE__ */ $constructor3("ZodCUID2", (inst, def) => {
  $ZodCUID23.init(inst, def), ZodStringFormat3.init(inst, def);
});
var ZodULID3 = /* @__PURE__ */ $constructor3("ZodULID", (inst, def) => {
  $ZodULID3.init(inst, def), ZodStringFormat3.init(inst, def);
});
var ZodXID3 = /* @__PURE__ */ $constructor3("ZodXID", (inst, def) => {
  $ZodXID3.init(inst, def), ZodStringFormat3.init(inst, def);
});
var ZodKSUID3 = /* @__PURE__ */ $constructor3("ZodKSUID", (inst, def) => {
  $ZodKSUID3.init(inst, def), ZodStringFormat3.init(inst, def);
});
var ZodIPv43 = /* @__PURE__ */ $constructor3("ZodIPv4", (inst, def) => {
  $ZodIPv43.init(inst, def), ZodStringFormat3.init(inst, def);
});
var ZodIPv63 = /* @__PURE__ */ $constructor3("ZodIPv6", (inst, def) => {
  $ZodIPv63.init(inst, def), ZodStringFormat3.init(inst, def);
});
var ZodCIDRv43 = /* @__PURE__ */ $constructor3("ZodCIDRv4", (inst, def) => {
  $ZodCIDRv43.init(inst, def), ZodStringFormat3.init(inst, def);
});
var ZodCIDRv63 = /* @__PURE__ */ $constructor3("ZodCIDRv6", (inst, def) => {
  $ZodCIDRv63.init(inst, def), ZodStringFormat3.init(inst, def);
});
var ZodBase643 = /* @__PURE__ */ $constructor3("ZodBase64", (inst, def) => {
  $ZodBase643.init(inst, def), ZodStringFormat3.init(inst, def);
});
var ZodBase64URL3 = /* @__PURE__ */ $constructor3("ZodBase64URL", (inst, def) => {
  $ZodBase64URL3.init(inst, def), ZodStringFormat3.init(inst, def);
});
var ZodE1643 = /* @__PURE__ */ $constructor3("ZodE164", (inst, def) => {
  $ZodE1643.init(inst, def), ZodStringFormat3.init(inst, def);
});
var ZodJWT3 = /* @__PURE__ */ $constructor3("ZodJWT", (inst, def) => {
  $ZodJWT3.init(inst, def), ZodStringFormat3.init(inst, def);
});
var ZodNumber3 = /* @__PURE__ */ $constructor3("ZodNumber", (inst, def) => {
  $ZodNumber3.init(inst, def), ZodType3.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor3(inst, ctx, json, params), inst.isFinite = !0;
}, /* @__PURE__ */ derived2({
  minValue: (inst) => {
    let { minimum, exclusiveMinimum } = aggregateChecks2(inst);
    return Math.max(minimum ?? Number.NEGATIVE_INFINITY, exclusiveMinimum ?? Number.NEGATIVE_INFINITY);
  },
  maxValue: (inst) => {
    let { maximum, exclusiveMaximum } = aggregateChecks2(inst);
    return Math.min(maximum ?? Number.POSITIVE_INFINITY, exclusiveMaximum ?? Number.POSITIVE_INFINITY);
  },
  isInt: (inst) => {
    let { isInt, multipleOf } = aggregateChecks2(inst);
    return !!isInt || !!multipleOf?.some(Number.isSafeInteger);
  },
  format: (inst) => aggregateChecks2(inst).format ?? null
}, {
  gt(value, params) {
    return this.check(_gt3(value, params));
  },
  gte(value, params) {
    return this.check(_gte3(value, params));
  },
  min(value, params) {
    return this.check(_gte3(value, params));
  },
  lt(value, params) {
    return this.check(_lt3(value, params));
  },
  lte(value, params) {
    return this.check(_lte3(value, params));
  },
  max(value, params) {
    return this.check(_lte3(value, params));
  },
  int(params) {
    return this.check(int3(params));
  },
  safe(params) {
    return this.check(int3(params));
  },
  positive(params) {
    return this.check(_gt3(0, params));
  },
  nonnegative(params) {
    return this.check(_gte3(0, params));
  },
  negative(params) {
    return this.check(_lt3(0, params));
  },
  nonpositive(params) {
    return this.check(_lte3(0, params));
  },
  multipleOf(value, params) {
    return this.check(_multipleOf3(value, params));
  },
  step(value, params) {
    return this.check(_multipleOf3(value, params));
  },
  finite() {
    return this;
  }
}));
function number6(params) {
  return _number3(ZodNumber3, params);
}
var ZodNumberFormat3 = /* @__PURE__ */ $constructor3("ZodNumberFormat", (inst, def) => {
  $ZodNumberFormat3.init(inst, def), ZodNumber3.init(inst, def);
});
function int3(params) {
  return _int3(ZodNumberFormat3, params);
}
var ZodUnknown3 = /* @__PURE__ */ $constructor3("ZodUnknown", (inst, def) => {
  $ZodUnknown3.init(inst, def), ZodType3.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => unknownProcessor3(inst, ctx, json, params);
});
function unknown3() {
  return _unknown3(ZodUnknown3);
}
var ZodNever3 = /* @__PURE__ */ $constructor3("ZodNever", (inst, def) => {
  $ZodNever3.init(inst, def), ZodType3.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor3(inst, ctx, json, params);
});
function never3(params) {
  return _never3(ZodNever3, params);
}
var ZodArray3 = /* @__PURE__ */ $constructor3("ZodArray", (inst, def) => {
  _ensureDefaultMemoizer2(), $ZodArray3.init(inst, def), ZodType3.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor3(inst, ctx, json, params), inst.element = def.element;
}, {
  min(n, params) {
    return this.check(_minLength3(n, params));
  },
  nonempty(params) {
    return this.check(_minLength3(1, params));
  },
  max(n, params) {
    return this.check(_maxLength3(n, params));
  },
  length(n, params) {
    return this.check(_length3(n, params));
  },
  unwrap() {
    return this.element;
  }
});
function array3(element, params) {
  return _array3(ZodArray3, element, params);
}
var ZodObject3 = /* @__PURE__ */ $constructor3("ZodObject", (inst, def) => {
  _ensureDefaultMemoizer2(), $ZodObjectJIT3.init(inst, def), ZodType3.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor3(inst, ctx, json, params), installLazyProp2(inst, "shape", (self) => self._zod.def.shape, !1);
}, {
  keyof() {
    return _enum3(Object.keys(this._zod.def.shape));
  },
  catchall(catchall) {
    return this.clone(mergeDefs3(this._zod.def, { catchall }));
  },
  passthrough() {
    return this.clone(mergeDefs3(this._zod.def, { catchall: unknown3() }));
  },
  loose() {
    return this.clone(mergeDefs3(this._zod.def, { catchall: unknown3() }));
  },
  strict() {
    return this.clone(mergeDefs3(this._zod.def, { catchall: never3() }));
  },
  strip() {
    return this.clone(mergeDefs3(this._zod.def, { catchall: void 0 }));
  },
  extend(incoming) {
    return extend3(this, incoming);
  },
  safeExtend(incoming) {
    return safeExtend3(this, incoming);
  },
  merge(other) {
    return merge3(this, other);
  },
  pick(mask) {
    return pick3(this, mask);
  },
  omit(mask) {
    return omit3(this, mask);
  },
  partial(...args) {
    return partial3(ZodOptional3, this, args[0]);
  },
  exactPartial(...args) {
    return partial3(ZodExactOptional3, this, args[0], "exactPartial");
  },
  required(...args) {
    return required3(ZodNonOptional3, this, args[0]);
  }
});
function object3(shape, params) {
  let def = {
    type: "object",
    shape: shape ?? {},
    ...normalizeParams3(params)
  };
  return new ZodObject3(def);
}
var ZodUnion3 = /* @__PURE__ */ $constructor3("ZodUnion", (inst, def) => {
  $ZodUnion3.init(inst, def), ZodType3.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor3(inst, ctx, json, params), inst.options = def.options;
});
function union3(options, params) {
  return new ZodUnion3({
    type: "union",
    options,
    ...normalizeParams3(params)
  });
}
var ZodIntersection3 = /* @__PURE__ */ $constructor3("ZodIntersection", (inst, def) => {
  $ZodIntersection3.init(inst, def), ZodType3.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor3(inst, ctx, json, params);
});
function intersection3(left, right) {
  return new ZodIntersection3({
    type: "intersection",
    left,
    right
  });
}
var ZodRecord2 = /* @__PURE__ */ $constructor3("ZodRecord", (inst, def) => {
  _ensureDefaultMemoizer2(), $ZodRecord3.init(inst, def), ZodType3.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => recordProcessor3(inst, ctx, json, params), inst.keyType = def.keyType, inst.valueType = def.valueType;
});
function record3(keyType, valueType, params) {
  if (!valueType || !valueType._zod)
    return new ZodRecord2({
      type: "record",
      keyType: string6(),
      valueType: keyType,
      ...normalizeParams3(valueType)
    });
  return new ZodRecord2({
    type: "record",
    keyType,
    valueType,
    ...normalizeParams3(params)
  });
}
var ZodEnum3 = /* @__PURE__ */ $constructor3("ZodEnum", (inst, def) => {
  $ZodEnum3.init(inst, def), ZodType3.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor3(inst, ctx, json, params), inst.enum = def.entries, inst.options = [...inst._zod.values];
  let keys = new Set(Object.keys(def.entries));
  inst.extract = (values, params) => {
    let newEntries = {};
    for (let value of values)
      if (keys.has(value))
        newEntries[value] = def.entries[value];
      else
        throw Error(`Key ${value} not found in enum`);
    return new ZodEnum3({
      ...def,
      checks: [],
      ...normalizeParams3(params),
      entries: newEntries
    });
  }, inst.exclude = (values, params) => {
    let newEntries = { ...def.entries };
    for (let value of values)
      if (keys.has(value))
        delete newEntries[value];
      else
        throw Error(`Key ${value} not found in enum`);
    return new ZodEnum3({
      ...def,
      checks: [],
      ...normalizeParams3(params),
      entries: newEntries
    });
  };
});
function _enum3(values, params) {
  let entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
  return new ZodEnum3({
    type: "enum",
    entries,
    ...normalizeParams3(params)
  });
}
var ZodLiteral2 = /* @__PURE__ */ $constructor3("ZodLiteral", (inst, def) => {
  $ZodLiteral3.init(inst, def), ZodType3.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor3(inst, ctx, json, params), inst.values = new Set(def.values), Object.defineProperty(inst, "value", {
    get() {
      if (def.values.length > 1)
        throw Error("This schema contains multiple valid literal values. Use `.values` instead.");
      return def.values[0];
    }
  });
});
function literal2(value, params) {
  return new ZodLiteral2({
    type: "literal",
    values: Array.isArray(value) ? value : [value],
    ...normalizeParams3(params)
  });
}
var ZodTransform3 = /* @__PURE__ */ $constructor3("ZodTransform", (inst, def) => {
  _ensureDefaultMemoizer2(), $ZodTransform3.init(inst, def), ZodType3.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor3(inst, ctx, json, params), inst._zod.parse = (payload, _ctx) => {
    if (_ctx.direction === "backward")
      throw new $ZodEncodeError3(inst.constructor.name);
    payload.addIssue = (issue) => {
      if (typeof issue === "string")
        payload.issues.push(issue3(issue, payload.value, def));
      else {
        let _issue = issue;
        if (_issue.fatal)
          _issue.continue = !1;
        if (_issue.code ?? (_issue.code = "custom"), !("input" in _issue))
          _issue.input = payload.value;
        _issue.inst ?? (_issue.inst = inst), payload.issues.push(issue3(_issue));
      }
    };
    let output = def.transform(payload.value, payload);
    if (output instanceof Promise)
      return output.then((output) => (payload.value = output, payload));
    return payload.value = output, payload;
  };
});
function transform3(fn) {
  return new ZodTransform3({
    type: "transform",
    transform: fn
  });
}
var ZodOptional3 = /* @__PURE__ */ $constructor3("ZodOptional", (inst, def) => {
  $ZodOptional3.init(inst, def), ZodType3.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor3(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType;
});
function optional3(innerType) {
  return new ZodOptional3({
    type: "optional",
    innerType
  });
}
var ZodExactOptional3 = /* @__PURE__ */ $constructor3("ZodExactOptional", (inst, def) => {
  $ZodExactOptional3.init(inst, def), ZodType3.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor3(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional3(innerType) {
  return new ZodExactOptional3({
    type: "optional",
    innerType
  });
}
var ZodNullable3 = /* @__PURE__ */ $constructor3("ZodNullable", (inst, def) => {
  $ZodNullable3.init(inst, def), ZodType3.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor3(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType;
});
function nullable3(innerType) {
  return new ZodNullable3({
    type: "nullable",
    innerType
  });
}
var ZodDefault3 = /* @__PURE__ */ $constructor3("ZodDefault", (inst, def) => {
  $ZodDefault3.init(inst, def), ZodType3.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor3(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType, inst.removeDefault = inst.unwrap;
});
function _default3(innerType, defaultValue) {
  return new ZodDefault3({
    type: "default",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone3(defaultValue);
    }
  });
}
var ZodPrefault3 = /* @__PURE__ */ $constructor3("ZodPrefault", (inst, def) => {
  $ZodPrefault3.init(inst, def), ZodType3.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor3(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType;
});
function prefault3(innerType, defaultValue) {
  return new ZodPrefault3({
    type: "prefault",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone3(defaultValue);
    }
  });
}
var ZodNonOptional3 = /* @__PURE__ */ $constructor3("ZodNonOptional", (inst, def) => {
  $ZodNonOptional3.init(inst, def), ZodType3.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor3(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional3(innerType, params) {
  return new ZodNonOptional3({
    type: "nonoptional",
    innerType,
    ...normalizeParams3(params)
  });
}
var ZodCatch3 = /* @__PURE__ */ $constructor3("ZodCatch", (inst, def) => {
  $ZodCatch3.init(inst, def), ZodType3.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor3(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType, inst.removeCatch = inst.unwrap;
});
function _catch3(innerType, catchValue) {
  return new ZodCatch3({
    type: "catch",
    innerType,
    catchValue: typeof catchValue === "function" ? catchValue : constantCatch2(catchValue)
  });
}
var ZodPipe3 = /* @__PURE__ */ $constructor3("ZodPipe", (inst, def) => {
  $ZodPipe3.init(inst, def), ZodType3.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor3(inst, ctx, json, params), inst.in = def.in, inst.out = def.out;
});
function pipe3(in_, out) {
  return new ZodPipe3({
    type: "pipe",
    in: in_,
    out
  });
}
var ZodReadonly3 = /* @__PURE__ */ $constructor3("ZodReadonly", (inst, def) => {
  $ZodReadonly3.init(inst, def), ZodType3.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor3(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType;
});
function readonly3(innerType) {
  return new ZodReadonly3({
    type: "readonly",
    innerType
  });
}
var ZodCustom3 = /* @__PURE__ */ $constructor3("ZodCustom", (inst, def) => {
  $ZodCustom3.init(inst, def), ZodType3.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => customProcessor3(inst, ctx, json, params);
});
function refine3(fn, _params = {}) {
  return _refine3(ZodCustom3, fn, _params);
}
function superRefine3(fn, params) {
  return _superRefine3(fn, params);
}
// src/forge.ts
var BudgetSchema = object3({
  dailyBudgetCredits: number6().nonnegative(),
  remainingCredits: number6().nonnegative()
}), readForgeUsage = async () => {
  let usage = await (await useForgeClient()).usage().value, budget = BudgetSchema.safeParse(usage?.budget);
  if (!budget.success)
    throw Error("Forge returned an invalid balance.");
  let { remainingCredits: available, dailyBudgetCredits: total } = budget.data;
  return `Forge daily credits
Available: ${available.toFixed(2)} credits
Total: ${total.toFixed(2)} credits`;
};

// src/models.ts
var EFFORT_PAYLOADS = ["minimal", "low", "medium", "high", "xhigh", "max"], isEffort = (value) => typeof value === "string" && EFFORT_PAYLOADS.some((payload) => payload === value), OMP_EFFORTS = EFFORT_PAYLOADS.map((payload) => {
  if (!isEffort(payload))
    throw Error(`Unknown thinking effort: ${payload}`);
  return payload;
}), tokenCost = (cost) => ({
  cacheRead: cost.cache_read ?? 0,
  cacheWrite: cost.cache_write ?? 0,
  input: cost.input,
  output: cost.output
}), modelCost = (cost) => {
  if (!cost)
    throw Error("Forge model is missing token pricing.");
  let mapped = tokenCost(cost), tiers = (cost.tiers ?? []).filter(({ tier }) => tier?.type === "context").toSorted((a, b) => a.tier.size - b.tier.size);
  if (tiers.length)
    mapped.longContext = {
      ...tokenCost(tiers[0]),
      inputThreshold: tiers[0].tier.size
    };
  return mapped;
}, mapForgeModels = (catalog) => Object.values(catalog).map((model) => {
  let effortValues = model.reasoning_options?.filter((option) => option.type === "effort").flatMap((option) => option.values) ?? [], efforts = OMP_EFFORTS.filter((effort) => effortValues.some((value) => isEffort(value) && value === effort)), thinking = model.reasoning && efforts.length ? { efforts, mode: "effort" } : void 0, cost = modelCost(model.cost), contextWindow = Math.min(model.limit.context, cost.longContext?.inputThreshold ?? model.limit.context), reasoningCompat = {
    allowsSyntheticReasoningContentForToolCalls: !0,
    disableReasoningOnForcedToolChoice: !1,
    disableReasoningOnToolChoice: !1,
    disableReasoningWithTools: !1,
    extraBody: {},
    omitReasoningEffort: efforts.length === 0,
    qwenPreserveThinking: !1,
    qwenTemplateReasoningEffort: !1,
    reasoningContentField: "reasoning",
    reasoningDisableMode: "openrouter-enabled-false",
    reasoningEffortMap: Object.fromEntries(efforts.map((effort) => [effort, effort])),
    replayReasoningContent: !1,
    requiresReasoningContentForAllAssistantTurns: !1,
    requiresReasoningContentForToolCalls: model.reasoning,
    requiresThinkingAsText: !1,
    supportsReasoningEffort: efforts.length > 0,
    supportsReasoningParams: !0,
    thinkingFormat: "openrouter"
  };
  return {
    compat: {
      ...reasoningCompat,
      alwaysSendMaxTokens: !1,
      clampOutputToModelMax: !0,
      isOpenRouterHost: !0,
      maxTokensField: "max_tokens",
      supportsDeveloperRole: !1,
      supportsMultipleSystemMessages: !0,
      supportsStore: !1,
      supportsUsageInStreaming: !0,
      whenThinking: reasoningCompat,
      wireModelIdMode: "raw"
    },
    contextWindow,
    cost,
    id: model.id,
    input: model.modalities.input.filter((type) => type === "text" || type === "image"),
    maxContextWindow: model.limit.context,
    maxTokens: model.limit.output,
    name: model.name,
    reasoning: model.reasoning,
    supportsTools: model.tool_call,
    thinking
  };
});

// src/desktop.ts
var UNAVAILABLE = "Forge is unavailable or returned an invalid catalog. Start Forge Desktop, then restart OMP.";
async function forgeDesktopPlugin(pi) {
  let loadError, registered = !1, signature, cached = !1, show = (content) => {
    pi.sendMessage({ content, customType: "forge", display: !0 }, { triggerTurn: !1 });
  }, register = ({ options, models: catalog }) => {
    let models = mapForgeModels(catalog), updated = JSON.stringify({ catalog, options });
    if (signature === updated)
      return models.length;
    if (registered)
      pi.unregisterProvider("forge");
    return pi.registerProvider("forge", {
      api: "openai-completions",
      apiKey: options.apiKey,
      baseUrl: options.baseURL,
      fetchDynamicModels: async () => await Promise.resolve(models),
      headers: options.headers,
      models
    }), registered = !0, signature = updated, loadError = void 0, models.length;
  }, refresh = async () => register(await refreshDesktopCatalog()), update = async (ctx) => {
    await refresh(), await ctx.modelRegistry.refreshRuntimeProviders("online");
  };
  pi.registerCommand("forge", {
    description: "Forge: /forge usage",
    handler: async (args) => {
      let [command, ...rest] = args.trim().split(/\s+/u);
      if (command === "usage" && rest.length === 0) {
        try {
          show(await readForgeUsage());
        } catch {
          show("Forge balance unavailable. Start Forge Desktop and wait for its usage snapshot, then run /forge usage again.");
        }
        return;
      }
      show("Usage: /forge usage");
    }
  }), pi.on("session_start", (_event, ctx) => {
    if (loadError !== void 0)
      ctx.ui.notify(loadError, "error");
    if (cached)
      ctx.setTimeout(() => {
        update(ctx).catch(() => {
          ctx.ui.notify("Forge refresh failed; cached models retained.", "warning");
        });
      }, 0);
  });
  try {
    let catalog = await readDesktopCatalog();
    cached = catalog !== void 0, register(catalog ?? await refreshDesktopCatalog());
  } catch {
    loadError = UNAVAILABLE, console.error(`[forge] ${loadError}`);
  }
  return refresh;
}

// src/mcp.ts
import path5 from "node:path";
import { fileURLToPath } from "node:url";
import { getCapability, registerProvider } from "@oh-my-pi/pi-coding-agent/capability";
import { mcpCapability } from "@oh-my-pi/pi-coding-agent/capability/mcp";
import { findScopedSettings } from "@oh-my-pi/pi-coding-agent/config/settings";

// src/mcp-config.ts
var ServersSchema = object3({
  forge: object3({ headers: unknown3().optional(), type: literal2("remote"), url: string6() })
}), HeadersSchema = record3(string6(), string6()).optional(), McpEndpointSchema = unknown3().transform((servers, ctx) => {
  let parsed = ServersSchema.safeParse(servers);
  if (!parsed.success)
    return ctx.addIssue({ code: "custom", message: "Forge MCP is not a remote endpoint." }), NEVER2;
  let url = new URL(parsed.data.forge.url);
  if (!["http:", "https:"].includes(url.protocol) || !["127.0.0.1", "localhost", "[::1]"].includes(url.hostname) || url.username || url.password)
    return ctx.addIssue({ code: "custom", message: "Forge MCP must use a local HTTP endpoint." }), NEVER2;
  let headers = HeadersSchema.safeParse(parsed.data.forge.headers);
  if (!headers.success)
    return ctx.addIssue({ code: "custom", message: "Forge MCP headers are invalid." }), NEVER2;
  return { headers: headers.data, url };
});

// src/mcp.ts
var registerForgeMcp = (pi, entrypoint) => {
  let source = fileURLToPath(entrypoint), id = `forge-mcp:${source}`;
  if (getCapability(mcpCapability.id)?.providers.some((provider) => provider.id === id) === !0)
    return;
  registerProvider(mcpCapability.id, {
    description: "Discover Forge Desktop's HTTP MCP endpoint",
    displayName: "Forge",
    id,
    load: async (ctx) => {
      let settings = findScopedSettings(ctx.cwd, ctx.agentDir);
      if (!settings)
        return { items: [] };
      let roots = ctx.extensionRoots;
      if (!(await pi.pi.discoverSessionExtensionPaths(roots === void 0 ? {} : { extensionRoots: () => roots }, ctx.cwd, settings)).some((extension) => path5.resolve(ctx.cwd, extension) === source))
        return { items: [] };
      try {
        let forge = await useForgeClient(), { url, headers } = McpEndpointSchema.parse(await forge.mcp.servers());
        return {
          items: [
            {
              _source: { level: "user", path: source, provider: id, providerName: "Forge" },
              headerPolicy: "origin-locked",
              headers,
              name: "forge",
              transport: "http",
              url: url.href
            }
          ]
        };
      } catch {
        return {
          items: [],
          warnings: ["Forge MCP is unavailable. Start Forge Desktop, then restart OMP."]
        };
      }
    },
    priority: 50
  });
};

// src/router/index.ts
import path7 from "node:path";

// src/router/catalog.ts
import { createHash as createHash3, randomUUID as randomUUID4 } from "node:crypto";
import { readFile as readFile5, mkdir as mkdir3, writeFile as writeFile4, rename as rename3, rm as rm3 } from "node:fs/promises";
import path6 from "node:path";

// src/router/models.ts
var EFFORT_PAYLOADS2 = ["minimal", "low", "medium", "high", "xhigh", "max"], isEffort2 = (value) => typeof value === "string" && EFFORT_PAYLOADS2.some((payload) => payload === value), OMP_EFFORTS2 = EFFORT_PAYLOADS2.map((payload) => {
  if (!isEffort2(payload))
    throw Error(`Unknown thinking effort: ${payload}`);
  return payload;
}), mapOpenRouterModels = (data) => data.flatMap((model) => {
  if (!model.output.includes("text") && !model.output.includes("decisions"))
    return [];
  let { contextWindow, maxTokens, cost: pricing, reasoning } = model;
  if (contextWindow === void 0 || maxTokens === void 0 || pricing === void 0)
    throw Error(`Incomplete model metadata: ${model.id}`);
  let efforts = OMP_EFFORTS2.filter((effort) => model.efforts.includes(effort)), cost = {
    cacheRead: pricing.cacheRead,
    cacheWrite: pricing.cacheWrite,
    input: pricing.input,
    output: pricing.output
  }, [tier] = pricing.tiers;
  if (tier !== void 0)
    cost.longContext = { ...tier };
  let reasoningCompat = {
    allowsSyntheticReasoningContentForToolCalls: !0,
    disableReasoningOnForcedToolChoice: !1,
    disableReasoningOnToolChoice: !1,
    disableReasoningWithTools: !1,
    extraBody: {},
    omitReasoningEffort: efforts.length === 0,
    qwenPreserveThinking: !1,
    qwenTemplateReasoningEffort: !1,
    reasoningContentField: "reasoning",
    reasoningDisableMode: "openrouter-enabled-false",
    reasoningEffortMap: Object.fromEntries(efforts.map((effort) => [effort, effort])),
    replayReasoningContent: !1,
    requiresReasoningContentForAllAssistantTurns: !1,
    requiresReasoningContentForToolCalls: reasoning,
    requiresThinkingAsText: !1,
    supportsReasoningEffort: efforts.length > 0,
    supportsReasoningParams: !0,
    thinkingFormat: "openrouter"
  };
  return [
    {
      api: model.output.includes("decisions") ? "openrouter-decisions" : "openai-completions",
      compat: {
        ...reasoningCompat,
        alwaysSendMaxTokens: !1,
        clampOutputToModelMax: !0,
        isOpenRouterHost: !0,
        maxTokensField: "max_tokens",
        supportsDeveloperRole: !1,
        supportsMultipleSystemMessages: !0,
        supportsStore: !1,
        supportsUsageInStreaming: !0,
        whenThinking: reasoningCompat,
        wireModelIdMode: "raw"
      },
      contextWindow: Math.min(contextWindow, tier?.inputThreshold ?? contextWindow),
      cost,
      id: model.id,
      input: model.input.filter((type) => type === "text" || type === "image"),
      maxContextWindow: contextWindow,
      maxTokens,
      name: model.name,
      reasoning,
      supportsTools: model.supportsTools,
      thinking: reasoning && efforts.length ? { efforts, mode: "effort" } : void 0
    }
  ];
});

// src/router/catalog.ts
var RouterCatalogSchema2 = object3({ data: array3(object3({ id: string6().min(1) })) }), TimestampSchema = string6().refine((value) => Number.isFinite(Date.parse(value))), StartupCatalogSchema = RouterCatalogSchema2.extend({
  data: array3(ModelSchema),
  discoveredAt: TimestampSchema,
  fetchedAt: TimestampSchema,
  version: literal2(1)
}), startupCatalogPath = (cacheDirectory, baseUrl, key) => {
  let scope = createHash3("sha256").update(JSON.stringify([baseUrl, key])).digest("hex");
  return path6.join(cacheDirectory, `startup-catalog-${scope}.json`);
}, readStartupCatalog = async (cacheDirectory, baseUrl, key) => {
  try {
    let parsed = StartupCatalogSchema.safeParse(JSON.parse(await readFile5(startupCatalogPath(cacheDirectory, baseUrl, key), "utf-8")));
    if (!parsed.success)
      return;
    let cached = parsed.data, { data } = cached;
    return mapOpenRouterModels(data), { data, discoveredAt: cached.discoveredAt, fetchedAt: cached.fetchedAt };
  } catch {
    return;
  }
};
var fetchRouterCatalog = async (baseUrl, key, {
  fetcher = fetch,
  signal
} = {}) => {
  if (key === void 0 || key === "")
    throw Error("Log in to Forge Router with /login before discovering models.");
  let response;
  try {
    response = await fetcher(`${baseUrl}/models`, {
      headers: { Authorization: `Bearer ${key}` },
      redirect: "error",
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(8000)]) : AbortSignal.timeout(8000)
    });
  } catch {
    throw Error("Forge Router model endpoint is unreachable.");
  }
  if (!response.ok)
    throw Error(`Forge Router model endpoint returned HTTP ${response.status}.`);
  let catalog = RouterCatalogSchema2.safeParse(await response.json());
  if (!catalog.success)
    throw Error("Invalid Forge Router model catalog.");
  return catalog.data;
}, discoverCatalog = async (baseUrl, key) => {
  if (key === void 0 || key === "")
    throw Error("Log in to Forge Router with /login before discovering models.");
  let catalog = await refreshRouterCatalog(baseUrl, key);
  return mapOpenRouterModels(catalog.data), catalog;
};

// src/router/index.ts
var PROVIDER = "forge-router", DEFAULT_BASE_URL = "https://forge.forgeworkspace.dev/functions/v1/forge-api/v1", forgeRouterPlugin = async (pi) => {
  let configuredUrl = process.env.FORGE_ROUTER_BASE_URL, baseUrl = (configuredUrl === void 0 || configuredUrl === "" ? DEFAULT_BASE_URL : configuredUrl).replace(/\/+$/u, ""), cacheDirectory = path7.join(pi.pi.getAgentDir(), "cache", "forge-router"), auth = await pi.pi.discoverAuthStorage(pi.pi.getAgentDir()), startupKey;
  try {
    startupKey = await auth.keys.peek(PROVIDER);
  } finally {
    auth.close();
  }
  let catalog = startupKey !== void 0 && startupKey !== "" ? await readRouterCatalog(baseUrl, startupKey) ?? await readStartupCatalog(cacheDirectory, baseUrl, startupKey) : void 0, registered = !1, refresh, register = (discover) => {
    if (registered)
      pi.unregisterProvider(PROVIDER);
    pi.registerProvider(PROVIDER, {
      api: "openai-completions",
      authHeader: !0,
      baseUrl,
      fetchDynamicModels: async () => await Promise.resolve(catalog ? mapOpenRouterModels(catalog.data) : []),
      models: catalog ? mapOpenRouterModels(catalog.data) : [],
      oauth: {
        async login(callbacks) {
          let key = await callbacks.onPrompt({
            message: `Forge Router API key for ${baseUrl}`,
            secret: !0
          });
          if (key?.trim() === void 0 || key.trim() === "")
            throw Error("Forge Router login cancelled: no API key supplied.");
          return await fetchRouterCatalog(baseUrl, key, {
            fetcher: callbacks.fetch ?? fetch,
            signal: callbacks.signal
          }), await discover(key), key;
        },
        name: "Forge Router (API key)"
      }
    }), registered = !0;
  }, discover = async (key) => {
    if (key === void 0 || key === "")
      throw Error("Log in to Forge Router with /login before discovering models.");
    let updated = await discoverCatalog(baseUrl, key), changed = JSON.stringify(catalog?.data) !== JSON.stringify(updated.data);
    if (catalog = updated, changed)
      register(discover);
    return updated;
  };
  if (!catalog && startupKey !== void 0 && startupKey !== "")
    try {
      await discover(startupKey);
    } catch {}
  if (!registered)
    register(discover);
  let refreshModels = async (ctx) => {
    let key = await ctx.modelRegistry.getApiKeyForProvider(PROVIDER, void 0, { baseUrl });
    if (key === void 0 || key === "")
      return "Forge Router: not connected";
    let updated = await discover(key);
    return `Forge Router: ${mapOpenRouterModels(updated.data).length} models`;
  };
  return pi.on("session_start", (_event, ctx) => {
    ctx.setTimeout(() => {
      refresh ??= (async () => {
        try {
          await ctx.modelRegistry.refreshRuntimeProviders("online");
          let key = await ctx.modelRegistry.getApiKeyForProvider(PROVIDER, void 0, {
            baseUrl
          });
          if (key !== void 0 && key !== "")
            await discover(key), await ctx.modelRegistry.refreshRuntimeProviders("online");
        } catch (error) {
          ctx.ui.notify(`Forge Router refresh failed; cached models retained: ${error instanceof Error ? error.message : String(error)}`, "warning");
        } finally {
          refresh = void 0;
        }
      })();
    }, 0);
  }), refreshModels;
}, router_default = forgeRouterPlugin;

// src/index.ts
async function forgePlugin(pi) {
  registerForgeMcp(pi, import.meta.url);
  let [refreshDesktop, refreshRouter] = await Promise.all([
    forgeDesktopPlugin(pi),
    router_default(pi)
  ]);
  pi.registerCommand("forge-refresh", {
    description: "Refresh Forge models and the shared cache",
    handler: async (_args, ctx) => {
      let results = await Promise.allSettled([refreshDesktop(), refreshRouter(ctx)]);
      await ctx.modelRegistry.refreshRuntimeProviders("online");
      let [desktop, router] = results;
      ctx.ui.notify([
        desktop.status === "fulfilled" ? `Forge Desktop: ${desktop.value} models` : "Forge Desktop refresh failed; cached models retained.",
        router.status === "fulfilled" ? router.value : "Forge Router refresh failed; cached models retained."
      ].join(`
`), results.some((result) => result.status === "rejected") ? "warning" : "info");
    }
  });
}
export {
  forgePlugin as default
};

// Third-party licenses
// env-paths@4.0.0
// MIT License
// 
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// 
// eventsource-parser@3.0.8
// MIT License
// 
// Copyright (c) 2026 Espen Hovlandsdal <espen@hovlandsdal.com>
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// 
// hono@4.12.14
// MIT License
// 
// Copyright (c) 2021 - present, Yusuke Wada and Hono contributors
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// 
// is-safe-filename@0.1.1
// MIT License
// 
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// 
// unstorage@2.0.0-beta.0
// MIT License
// 
// Copyright (c) Pooya Parsa <pooya@pi0.io>
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// 
// zod@4.3.6
// MIT License
// 
// Copyright (c) 2025 Colin McDonnell
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// 
// zod@4.6.7
// MIT License
// 
// Copyright (c) 2025 Colin McDonnell
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// 
// zod@4.6.5
// MIT License
// 
// Copyright (c) 2025 Colin McDonnell
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
