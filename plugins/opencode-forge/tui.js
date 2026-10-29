// tui.ts
import { Plugin } from "@opencode/plugin/tui";
// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Pipeable.js
var pipeArguments = (self, args) => {
  switch (args.length) {
    case 0:
      return self;
    case 1:
      return args[0](self);
    case 2:
      return args[1](args[0](self));
    case 3:
      return args[2](args[1](args[0](self)));
    case 4:
      return args[3](args[2](args[1](args[0](self))));
    case 5:
      return args[4](args[3](args[2](args[1](args[0](self)))));
    case 6:
      return args[5](args[4](args[3](args[2](args[1](args[0](self))))));
    case 7:
      return args[6](args[5](args[4](args[3](args[2](args[1](args[0](self)))))));
    case 8:
      return args[7](args[6](args[5](args[4](args[3](args[2](args[1](args[0](self))))))));
    case 9:
      return args[8](args[7](args[6](args[5](args[4](args[3](args[2](args[1](args[0](self)))))))));
    default: {
      let ret = self;
      for (let i = 0, len = args.length;i < len; i++)
        ret = args[i](ret);
      return ret;
    }
  }
}, Prototype = {
  pipe() {
    return pipeArguments(this, arguments);
  }
}, Class = /* @__PURE__ */ function() {
  function PipeableBase() {}
  return PipeableBase.prototype = Prototype, PipeableBase;
}();

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Function.js
var dual = function(arity, body) {
  if (typeof arity === "function")
    return function() {
      return arity(arguments) ? body.apply(this, arguments) : (self) => body(self, ...arguments);
    };
  switch (arity) {
    case 0:
    case 1:
      throw RangeError(`Invalid arity ${arity}`);
    case 2:
      return function(a, b) {
        if (arguments.length >= 2)
          return body(a, b);
        return function(self) {
          return body(self, a);
        };
      };
    case 3:
      return function(a, b, c) {
        if (arguments.length >= 3)
          return body(a, b, c);
        return function(self) {
          return body(self, a, b);
        };
      };
    default:
      return function() {
        if (arguments.length >= arity)
          return body.apply(this, arguments);
        let args = arguments;
        return function(self) {
          return body(self, ...args);
        };
      };
  }
};
var identity = (a) => a;
var constant = (value) => () => value, constTrue = /* @__PURE__ */ constant(!0);
var constUndefined = /* @__PURE__ */ constant(void 0), constVoid = constUndefined;
function memoize(f) {
  let cache = /* @__PURE__ */ new WeakMap;
  return (a) => {
    let cached = cache.get(a);
    if (cached !== void 0)
      return cached;
    let result = f(a);
    return cache.set(a, result), result;
  };
}
function memoizeIdempotent(f) {
  let cache = /* @__PURE__ */ new WeakMap;
  return (a) => {
    let cached = cache.get(a);
    if (cached !== void 0)
      return cached;
    let result = f(a);
    if (cache.set(a, result), result !== a)
      cache.set(result, result);
    return result;
  };
}

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/internal/equal.js
var getAllObjectKeys = (obj) => {
  let keys = new Set(Reflect.ownKeys(obj));
  if (obj.constructor === Object)
    return keys;
  if (obj instanceof Error)
    keys.delete("stack");
  let proto = Object.getPrototypeOf(obj), current = proto;
  while (current !== null && current !== Object.prototype) {
    let ownKeys = Reflect.ownKeys(current);
    for (let i = 0;i < ownKeys.length; i++)
      keys.add(ownKeys[i]);
    current = Object.getPrototypeOf(current);
  }
  if (keys.has("constructor") && typeof obj.constructor === "function" && proto === obj.constructor.prototype)
    keys.delete("constructor");
  return keys;
}, byReferenceInstances = /* @__PURE__ */ new WeakSet, viewBytes = (view) => new Uint8Array(view.buffer, view.byteOffset, view.byteLength);

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/internal/hash.js
var backEdges = 0, addBackEdge = () => {
  backEdges++;
};

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Predicate.js
function isString(input) {
  return typeof input === "string";
}
function isNumber(input) {
  return typeof input === "number";
}
function isBoolean(input) {
  return typeof input === "boolean";
}
function isSymbol(input) {
  return typeof input === "symbol";
}
function isPropertyKey(u) {
  return isString(u) || isNumber(u) || isSymbol(u);
}
function isFunction(input) {
  return typeof input === "function";
}
function isNotNullish(input) {
  return input != null;
}
function isUnknown(_) {
  return !0;
}
function isObject(input) {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}
function isObjectKeyword(input) {
  return typeof input === "object" && input !== null || isFunction(input);
}
var hasProperty = /* @__PURE__ */ dual(2, (self, property) => isObjectKeyword(self) && (property in self));
function isError(input) {
  return input instanceof Error;
}

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Hash.js
var symbol = "~effect/Hash", hash = (self) => {
  switch (typeof self) {
    case "number":
      return number(self);
    case "bigint":
      return string(self.toString(10));
    case "string":
      return string(self);
    case "function":
    case "object":
      if (self === null)
        break;
      else if (self instanceof Date) {
        if (Number.isNaN(self.getTime()))
          return string("Invalid Date");
        return string(self.toISOString());
      } else if (self instanceof RegExp)
        return string(self.toString());
      else {
        if (byReferenceInstances.has(self))
          return random(self);
        let cached = hashCache.get(self);
        if (cached !== void 0)
          return cached;
        if (visitedObjects.has(self))
          return addBackEdge(), string("[Circular]");
        visitedObjects.add(self);
        let seen = backEdges, h;
        try {
          if (symbol in self)
            h = self[symbol]();
          else if (typeof self === "function")
            h = random(self);
          else if (self instanceof DataView)
            h = array(viewBytes(self));
          else if (Array.isArray(self) || ArrayBuffer.isView(self))
            h = array(self);
          else if (self instanceof Map)
            h = hashMap(self);
          else if (self instanceof Set)
            h = hashSet(self);
          else
            h = structure(self);
        } finally {
          visitedObjects.delete(self);
        }
        if (seen === backEdges)
          hashCache.set(self, h);
        return h;
      }
  }
  return optimize(mix(string(String(self))));
}, random = (self) => {
  if (!randomHashCache.has(self))
    randomHashCache.set(self, optimize(Math.random() * 4294967296 | 0));
  return randomHashCache.get(self);
}, mix = (h) => (h ^= h >>> 16, h = Math.imul(h, 2246822507), h ^= h >>> 13, h = Math.imul(h, 3266489909), h ^ h >>> 16), combine = /* @__PURE__ */ dual(2, (self, b) => mix(Math.imul(self, 2654435761) + Math.imul(b, 2246822507))), optimize = (n) => n & 3221225471 | n >>> 1 & 1073741824;
var float64 = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(8)), number = (n) => {
  let h = n | 0;
  if (h === n)
    return optimize(h);
  return float64.setFloat64(0, n !== n ? NaN : n), optimize(combine(float64.getInt32(0), float64.getInt32(4)));
}, string = (str) => {
  let h = 5381, i = str.length;
  while (i)
    h = h * 33 ^ str.charCodeAt(--i);
  return optimize(h);
}, structureKeys = (o, keys) => {
  let h = 12289;
  for (let key of keys)
    h ^= combine(hash(key), hash(o[key]));
  return optimize(h);
}, structure = (o) => structureKeys(o, getAllObjectKeys(o)), unordered = (seed, f) => (iter) => {
  let h = seed;
  for (let element of iter)
    h ^= f(element);
  return optimize(h);
}, array = (arr) => {
  let h = 6151;
  for (let element of arr)
    h = combine(h, hash(element));
  return optimize(h);
}, hashMap = /* @__PURE__ */ unordered(/* @__PURE__ */ string("Map"), ([k, v]) => combine(hash(k), hash(v))), setSeed = /* @__PURE__ */ string("Set"), hashSet = /* @__PURE__ */ unordered(setSeed, (element) => combine(setSeed, hash(element))), randomHashCache = /* @__PURE__ */ new WeakMap, hashCache = /* @__PURE__ */ new WeakMap, visitedObjects = /* @__PURE__ */ new WeakSet;

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Equal.js
var symbol2 = "~effect/Equal";
function equals() {
  if (arguments.length === 1)
    return (self) => compareBoth(self, arguments[0]);
  return compareBoth(arguments[0], arguments[1]);
}
function compareBoth(self, that) {
  if (self === that)
    return !0;
  if (self == null || that == null)
    return !1;
  let selfType = typeof self;
  if (selfType !== typeof that)
    return !1;
  if (selfType === "number" && self !== self && that !== that)
    return !0;
  if (selfType !== "object" && selfType !== "function")
    return !1;
  if (byReferenceInstances.has(self) || byReferenceInstances.has(that))
    return !1;
  return compareObjects(self, that);
}
function compareObjects(self, that) {
  let depth = pathLeft.length;
  for (let i = depth;i-- > 0; )
    if (pathLeft[i] === self && pathRight[i] === that)
      return !0;
  if (depth)
    return compareOnPath(self, that);
  let known = results.get(self);
  if (!known)
    results.set(self, known = /* @__PURE__ */ new WeakMap);
  let result = known.get(that);
  if (result === void 0)
    known.set(that, result = compareOnPath(self, that));
  return result;
}
function compareOnPath(self, that) {
  pathLeft.push(self), pathRight.push(that);
  try {
    return compareStructure(self, that);
  } finally {
    pathLeft.pop(), pathRight.pop();
  }
}
var pathLeft = [], pathRight = [], results = /* @__PURE__ */ new WeakMap;
function compareStructure(self, that) {
  if (hash(self) !== hash(that))
    return !1;
  else if (self instanceof Date) {
    if (!(that instanceof Date))
      return !1;
    let selfTime = self.getTime(), thatTime = that.getTime();
    return selfTime === thatTime || Number.isNaN(selfTime) && Number.isNaN(thatTime);
  } else if (self instanceof RegExp)
    return that instanceof RegExp && self.toString() === that.toString();
  let bothEquals = isEqual(self);
  if (bothEquals !== isEqual(that) || typeof self === "function" && !bothEquals)
    return !1;
  else if (bothEquals)
    return self[symbol2](that);
  else if (Array.isArray(self)) {
    if (!Array.isArray(that) || self.length !== that.length)
      return !1;
    return compareArrays(self, that);
  } else if (ArrayBuffer.isView(self)) {
    let selfIsDataView = self instanceof DataView;
    if (!ArrayBuffer.isView(that) || self.byteLength !== that.byteLength || selfIsDataView !== that instanceof DataView)
      return !1;
    if (selfIsDataView)
      return compareTypedArrays(viewBytes(self), viewBytes(that));
    return compareTypedArrays(self, that);
  } else if (self instanceof Map) {
    if (!(that instanceof Map) || self.size !== that.size)
      return !1;
    return compareHashed(self, that, entryHash, equalEntries);
  } else if (self instanceof Set) {
    if (!(that instanceof Set) || self.size !== that.size)
      return !1;
    return compareHashed(self, that, hash, compareBoth);
  }
  return compareRecords(self, that);
}
function compareArrays(self, that) {
  for (let i = 0;i < self.length; i++)
    if (!compareBoth(self[i], that[i]))
      return !1;
  return !0;
}
function compareTypedArrays(self, that) {
  if (self.length !== that.length)
    return !1;
  for (let i = 0;i < self.length; i++)
    if (self[i] !== that[i])
      return !1;
  return !0;
}
function compareRecords(self, that) {
  let selfKeys = getAllObjectKeys(self), thatKeys = getAllObjectKeys(that);
  if (selfKeys.size !== thatKeys.size)
    return !1;
  for (let key of selfKeys)
    if (!thatKeys.has(key) || !compareBoth(self[key], that[key]))
      return !1;
  return !0;
}
function compareHashed(self, that, hashOf, equivalent) {
  let groups = /* @__PURE__ */ new Map;
  for (let item of that) {
    let h = hashOf(item), group = groups.get(h);
    if (group)
      group.push(item);
    else
      groups.set(h, [item]);
  }
  outer:
    for (let item of self) {
      let group = groups.get(hashOf(item));
      if (group) {
        for (let i = 0;i < group.length; i++)
          if (equivalent(item, group[i])) {
            group[i] = group[group.length - 1], group.pop();
            continue outer;
          }
      }
      return !1;
    }
  return !0;
}
var entryHash = (entry) => hash(entry[0]), equalEntries = (self, that) => compareBoth(self[0], that[0]) && compareBoth(self[1], that[1]), sameGroup = () => 0;
function makeCompareMap(keyEquivalence, valueEquivalence) {
  return makeCompareSet((self, that) => keyEquivalence(self[0], that[0]) && valueEquivalence(self[1], that[1]));
}
function makeCompareSet(equivalence) {
  return function(self, that) {
    return compareHashed(self, that, sameGroup, equivalence);
  };
}
var isEqual = (u) => hasProperty(u, symbol2);

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Redactable.js
var symbolRedactable = /* @__PURE__ */ Symbol.for("~effect/Redactable"), isRedactable = (u) => hasProperty(u, symbolRedactable);
function redact(u) {
  if (isRedactable(u))
    return getRedacted(u);
  return u;
}
function getRedacted(redactable) {
  return redactable[symbolRedactable](globalThis[currentFiberTypeId]?.context ?? emptyContext);
}
var currentFiberTypeId = "~effect/Fiber/currentFiber", emptyMap = /* @__PURE__ */ new Map, emptyContext = {
  "~effect/Context": {},
  base: emptyMap,
  depth: 0,
  mapUnsafe: emptyMap,
  pipe() {
    return pipeArguments(this, arguments);
  }
};

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Formatter.js
function format(input, options) {
  let space = options?.space ?? 0, ancestors = /* @__PURE__ */ new WeakSet, gap = !space ? "" : typeof space === "number" ? " ".repeat(space) : space, ind = (d) => gap.repeat(d), wrap = (v, body) => {
    let ctor = v?.constructor;
    return ctor && ctor !== Object.prototype.constructor && ctor.name ? `${ctor.name}(${body})` : body;
  }, ownKeys = (o) => {
    try {
      return Reflect.ownKeys(o);
    } catch {
      return ["[ownKeys threw]"];
    }
  };
  function recur(v, d = 0) {
    try {
      return recurUnsafe(v, d);
    } catch {
      if (typeof v === "object" && v !== null || typeof v === "function")
        ancestors.delete(v);
      return "[inspection threw]";
    }
  }
  function recurUnsafe(v, d = 0) {
    if (typeof v === "string")
      return JSON.stringify(v);
    if (typeof v === "number" || v == null || typeof v === "boolean" || typeof v === "symbol")
      return String(v);
    if (typeof v === "bigint")
      return String(v) + "n";
    if (typeof v === "object" || typeof v === "function") {
      if (ancestors.has(v))
        return CIRCULAR;
      ancestors.add(v);
      let output;
      if (symbolRedactable in v)
        output = recur(getRedacted(v), d);
      else if (Array.isArray(v))
        output = !gap || v.length <= 1 ? `[${v.map((x) => recur(x, d)).join(",")}]` : `[
${ind(d + 1)}${v.map((x) => recur(x, d + 1)).join(`,
` + ind(d + 1))}
${ind(d)}]`;
      else if (v instanceof Date)
        output = formatDate(v);
      else if (!options?.ignoreToString && hasProperty(v, "toString") && typeof v.toString === "function" && v.toString !== Object.prototype.toString && v.toString !== Array.prototype.toString) {
        let s = safeToString(v);
        output = v instanceof Error && v.cause !== void 0 ? `${s} (cause: ${recur(v.cause, d)})` : s;
      } else if (Symbol.iterator in v)
        output = `${v.constructor.name}(${recur(Array.from(v), d)})`;
      else {
        let keys = ownKeys(v);
        if (!gap || keys.length <= 1) {
          let body = `{${keys.map((k) => `${formatPropertyKey(k)}:${recur(safeGet(v, k), d)}`).join(",")}}`;
          output = wrap(v, body);
        } else {
          let body = `{
${keys.map((k) => `${ind(d + 1)}${formatPropertyKey(k)}: ${recur(safeGet(v, k), d + 1)}`).join(`,
`)}
${ind(d)}}`;
          output = wrap(v, body);
        }
      }
      return ancestors.delete(v), output;
    }
    return String(v);
  }
  return recur(input, 0);
}
var CIRCULAR = "[Circular]";
function formatPropertyKey(name) {
  return typeof name === "string" ? JSON.stringify(name) : String(name);
}
function formatPath(path) {
  return path.map((key) => `[${formatPropertyKey(key)}]`).join("");
}
function formatDate(date) {
  try {
    return date.toISOString();
  } catch {
    return "Invalid Date";
  }
}
function safeToString(input) {
  try {
    let s = input.toString();
    return typeof s === "string" ? s : String(s);
  } catch {
    return "[toString threw]";
  }
}
function safeGet(input, key) {
  try {
    return input[key];
  } catch {
    return "[property access threw]";
  }
}
function formatJson(input, options) {
  let ancestors = [];
  return JSON.stringify(input, function(key, value) {
    let original = Object.getOwnPropertyDescriptor(this, key)?.value, redacted = hasProperty(original, symbolRedactable) ? redact(original) : redact(value);
    if (typeof redacted === "bigint")
      return format(redacted);
    if (typeof redacted !== "object" || redacted === null)
      return redacted;
    let current = redacted instanceof Error && !hasProperty(redacted, "toJSON") ? {
      ...redacted,
      name: redacted.name,
      message: redacted.message
    } : redacted;
    while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this)
      ancestors.pop();
    if (ancestors.includes(redacted))
      return;
    if (ancestors.push(redacted), current !== redacted)
      ancestors.push(current);
    return current;
  }, options?.space) ?? "null";
}

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Inspectable.js
var NodeInspectSymbol = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom"), toJson = (input) => {
  try {
    if (input = redact(input), hasProperty(input, "toJSON") && isFunction(input.toJSON) && input.toJSON.length === 0)
      return input.toJSON();
    else if (Array.isArray(input))
      return input.map(toJson);
    return input;
  } catch {
    return "[toJSON threw]";
  }
};
var BaseProto = {
  toJSON() {
    return toJson(this);
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return format(this.toJSON());
  }
};

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/internal/stackTraceLimit.js
var isStackTraceLimitWritable = () => {
  let desc = Object.getOwnPropertyDescriptor(Error, "stackTraceLimit");
  if (desc === void 0)
    return Object.isExtensible(Error);
  return Object.hasOwn(desc, "writable") ? desc.writable === !0 : desc.set !== void 0;
}, canWriteStackTraceLimit = /* @__PURE__ */ isStackTraceLimitWritable(), getStackTraceLimit = () => Error.stackTraceLimit, setStackTraceLimit = (value) => {
  if (canWriteStackTraceLimit)
    Error.stackTraceLimit = value;
};

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Utils.js
class SingleShotGen {
  constructor(self) {
    this.value = self, this.done = !1;
  }
  next(a) {
    if (this.done)
      return this.value = a, this;
    return this.done = !0, {
      value: this.value,
      done: !1
    };
  }
}
var pickInternalCall = () => {
  let standard = {
    ["~effect/Utils/internal"]: (body) => body()
  }, forced = {
    ["~effect/Utils/internal"]: (body) => {
      try {
        return body();
      } finally {}
    }
  };
  return getStackTraceLimit() !== 0 && standard["~effect/Utils/internal"](() => Error().stack)?.includes("~effect/Utils/internal") === !0 ? standard["~effect/Utils/internal"] : forced["~effect/Utils/internal"];
}, internalCall = /* @__PURE__ */ pickInternalCall();

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/internal/record.js
function assignProperty(self, key, value) {
  if (key === "__proto__")
    Object.defineProperty(self, key, {
      value,
      writable: !0,
      enumerable: !0,
      configurable: !0
    });
  else
    self[key] = value;
}
function assignProperties(self, source) {
  for (let key of Reflect.ownKeys(source))
    if (Object.prototype.propertyIsEnumerable.call(source, key))
      assignProperty(self, key, source[key]);
}

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/internal/core.js
var EffectTypeId = "~effect/Effect", ExitTypeId = "~effect/Exit", effectVariance = {
  _A: identity,
  _E: identity,
  _R: identity
}, identifier = `${EffectTypeId}/identifier`, args = `${EffectTypeId}/args`, evaluate = `${EffectTypeId}/evaluate`, contA = `${EffectTypeId}/successCont`, contE = `${EffectTypeId}/failureCont`, contAll = `${EffectTypeId}/ensureCont`, Yield = /* @__PURE__ */ Symbol.for("effect/Effect/Yield"), PipeInspectableProto = {
  pipe() {
    return pipeArguments(this, arguments);
  },
  toJSON() {
    return {
      ...this
    };
  },
  toString() {
    return format(this.toJSON(), {
      ignoreToString: !0,
      space: 2
    });
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
}, StructuralProto = {
  [symbol]() {
    return structureKeys(this, Object.keys(this));
  },
  [symbol2](that) {
    let selfKeys = Object.keys(this), thatKeys = Object.keys(that);
    if (selfKeys.length !== thatKeys.length)
      return !1;
    for (let i = 0;i < selfKeys.length; i++)
      if (selfKeys[i] !== thatKeys[i] || !equals(this[selfKeys[i]], that[selfKeys[i]]))
        return !1;
    return !0;
  }
}, EffectProto = {
  [EffectTypeId]: effectVariance,
  ...PipeInspectableProto,
  [Symbol.iterator]() {
    return new SingleShotGen(this);
  },
  toJSON() {
    return {
      _id: "Effect",
      op: this[identifier],
      ...args in this ? {
        args: this[args]
      } : void 0
    };
  }
};
var isExit = (u) => hasProperty(u, ExitTypeId), CauseTypeId = "~effect/Cause", CauseReasonTypeId = "~effect/Cause/Reason", isCause = (self) => hasProperty(self, CauseTypeId);
class CauseImpl {
  constructor(failures) {
    this[CauseTypeId] = CauseTypeId, this.reasons = failures;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return {
      _id: "Cause",
      failures: this.reasons.map((f) => f.toJSON())
    };
  }
  toString() {
    return `Cause(${format(this.reasons)})`;
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  [symbol2](that) {
    return isCause(that) && this.reasons.length === that.reasons.length && this.reasons.every((e, i) => equals(e, that.reasons[i]));
  }
  [symbol]() {
    return array(this.reasons);
  }
}
var annotationsMap = /* @__PURE__ */ new WeakMap;

class ReasonBase {
  [CauseReasonTypeId];
  annotations;
  _tag;
  constructor(_tag, annotations, originalError) {
    if (this[CauseReasonTypeId] = CauseReasonTypeId, this._tag = _tag, annotations !== constEmptyAnnotations && typeof originalError === "object" && originalError !== null && annotations.size > 0) {
      let prevAnnotations = annotationsMap.get(originalError);
      if (prevAnnotations)
        annotations = new Map([...prevAnnotations, ...annotations]);
      annotationsMap.set(originalError, annotations);
    }
    this.annotations = annotations;
  }
  annotate(annotations, options) {
    if (annotations.mapUnsafe.size === 0)
      return this;
    let newAnnotations = new Map(this.annotations);
    annotations.mapUnsafe.forEach((value, key) => {
      if (options?.overwrite !== !0 && newAnnotations.has(key))
        return;
      newAnnotations.set(key, value);
    });
    let self = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    return self.annotations = newAnnotations, self;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toString() {
    return format(this);
  }
  [NodeInspectSymbol]() {
    return this.toString();
  }
}
var constEmptyAnnotations = /* @__PURE__ */ new Map;

class Fail extends ReasonBase {
  constructor(error, annotations = constEmptyAnnotations) {
    super("Fail", annotations, error);
    this.error = error;
  }
  toString() {
    return `Fail(${format(this.error)})`;
  }
  toJSON() {
    return {
      _tag: "Fail",
      error: this.error
    };
  }
  [symbol2](that) {
    return isFailReason(that) && equals(this.error, that.error) && equals(this.annotations, that.annotations);
  }
  [symbol]() {
    return combine(string(this._tag))(combine(hash(this.error))(hash(this.annotations)));
  }
}
var causeFromReasons = (reasons) => new CauseImpl(reasons), dedupeReasons = (self, that) => {
  let buckets = /* @__PURE__ */ new Map, out = [];
  for (let reason of self.concat(that)) {
    let hash2 = hash(reason), bucket = buckets.get(hash2);
    if (bucket === void 0)
      buckets.set(hash2, [reason]);
    else if (bucket.some((previous) => equals(previous, reason)))
      continue;
    else
      bucket.push(reason);
    out.push(reason);
  }
  return out;
}, causeCombine = /* @__PURE__ */ dual(2, (self, that) => {
  if (self.reasons.length === 0)
    return that;
  else if (that.reasons.length === 0)
    return self;
  let newCause = new CauseImpl(dedupeReasons(self.reasons, that.reasons));
  return equals(self, newCause) ? self : newCause;
});
var causeFail = (error) => new CauseImpl([new Fail(error)]);

class Die extends ReasonBase {
  constructor(defect, annotations = constEmptyAnnotations) {
    super("Die", annotations, defect);
    this.defect = defect;
  }
  toString() {
    return `Die(${format(this.defect)})`;
  }
  toJSON() {
    return {
      _tag: "Die",
      defect: this.defect
    };
  }
  [symbol2](that) {
    return isDieReason(that) && equals(this.defect, that.defect) && equals(this.annotations, that.annotations);
  }
  [symbol]() {
    return combine(string(this._tag))(combine(hash(this.defect))(hash(this.annotations)));
  }
}
var causeDie = (defect) => new CauseImpl([new Die(defect)]), causeAnnotate = /* @__PURE__ */ dual((args) => isCause(args[0]), (self, annotations, options) => {
  if (annotations.mapUnsafe.size === 0)
    return self;
  return new CauseImpl(self.reasons.map((f) => f.annotate(annotations, options)));
}), isFailReason = (self) => self._tag === "Fail", isDieReason = (self) => self._tag === "Die", isInterruptReason = (self) => self._tag === "Interrupt";
function defaultEvaluate(_fiber) {
  return exitDie("Effect.evaluate: Not implemented");
}
var makePrimitiveProto = (options) => ({
  ...EffectProto,
  [identifier]: options.op,
  [evaluate]: options[evaluate] ?? defaultEvaluate,
  [contA]: options[contA],
  [contE]: options[contE],
  [contAll]: options[contAll]
}), makePrimitive = (options) => {
  let Proto = makePrimitiveProto(options), PrimitiveImpl = function(value) {
    this[args] = value;
  };
  return PrimitiveImpl.prototype = Proto, function(value) {
    return new PrimitiveImpl(value);
  };
}, makeExit = (options) => {
  let Proto = {
    [ExitTypeId]: ExitTypeId,
    _tag: options.op,
    get [options.prop]() {
      return this[args];
    },
    ...makePrimitiveProto(options),
    toString() {
      return `${options.op}(${format(this[args])})`;
    },
    toJSON() {
      return {
        _id: "Exit",
        _tag: options.op,
        [options.prop]: this[args]
      };
    },
    [symbol2](that) {
      return isExit(that) && that._tag === this._tag && equals(this[args], that[args]);
    },
    [symbol]() {
      return combine(string(options.op), hash(this[args]));
    }
  }, ExitPrimitive = function(value) {
    this[args] = value;
  };
  return ExitPrimitive.prototype = Proto, function(value) {
    return new ExitPrimitive(value);
  };
}, exitSucceed = /* @__PURE__ */ makeExit({
  op: "Success",
  prop: "value",
  [evaluate](fiber) {
    let cont = fiber.getCont(contA);
    return cont ? cont[contA](this[args], fiber, this) : fiber.yieldWith(this);
  }
}), StackTraceKey = {
  key: "effect/Cause/StackTrace"
}, InterruptorStackTrace = {
  key: "effect/Cause/InterruptorStackTrace"
}, exitFailCause = /* @__PURE__ */ makeExit({
  op: "Failure",
  prop: "cause",
  [evaluate](fiber) {
    let cause = this[args], annotated = !1;
    if (fiber.cache.stackFrame)
      cause = causeAnnotate(cause, {
        mapUnsafe: /* @__PURE__ */ new Map([[StackTraceKey.key, fiber.cache.stackFrame]])
      }), annotated = !0;
    let cont = fiber.getCont(contE), interruptedCause = fiber._interruptedCause;
    if (interruptedCause && fiber.interruptible) {
      let skippedHandler = !1;
      while (cont && fiber.interruptible)
        skippedHandler ||= identifier in cont, cont = fiber.getCont(contE);
      if (skippedHandler)
        cause = causeFromReasons(cause.reasons.filter((reason) => reason._tag !== "Fail"));
      cause = causeCombine(cause, interruptedCause), annotated = !0;
    }
    return cont ? cont[contE](cause, fiber, annotated ? void 0 : this) : fiber.yieldWith(annotated ? exitFailCause(cause) : this);
  }
}), exitFail = (e) => exitFailCause(causeFail(e)), exitDie = (defect) => exitFailCause(causeDie(defect)), withFiber = /* @__PURE__ */ makePrimitive({
  op: "WithFiber",
  [evaluate](fiber) {
    return this[args](fiber);
  }
}), withFiberSucceed = /* @__PURE__ */ makePrimitive({
  op: "WithFiberSucceed",
  [evaluate](fiber) {
    let value = this[args](fiber), cont = fiber.getCont(contA);
    return cont ? cont[contA](value, fiber) : fiber.yieldWith(exitSucceed(value));
  }
}), YieldableError = /* @__PURE__ */ function() {

  class YieldableError extends globalThis.Error {
  }
  let proto = /* @__PURE__ */ makePrimitiveProto({
    op: "YieldableError",
    [evaluate]() {
      return exitFail(this);
    }
  });
  return delete proto.toString, Object.assign(YieldableError.prototype, proto), YieldableError;
}(), Error2 = /* @__PURE__ */ function() {
  let plainArgsSymbol = /* @__PURE__ */ Symbol.for("effect/Data/Error/plainArgs");
  return class extends YieldableError {
    constructor(args) {
      super(args?.message, args?.cause ? {
        cause: args.cause
      } : void 0);
      if (args)
        assignProperties(this, args), Object.defineProperty(this, plainArgsSymbol, {
          value: args,
          enumerable: !1
        });
    }
    toJSON() {
      return {
        ...this[plainArgsSymbol],
        ...this
      };
    }
  };
}(), TaggedError = (tag) => {

  class Base extends Error2 {
    _tag = tag;
  }
  return Base.prototype.name = tag, Base;
};
var DoneTypeId = "~effect/Cause/Done";
var DoneVoid = {
  [DoneTypeId]: DoneTypeId,
  _tag: "Done",
  value: void 0
};

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Effectable.js
var Prototype2 = (options) => makePrimitiveProto({
  op: options.label,
  [evaluate]: options.evaluate
});

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Equivalence.js
var make = (isEquivalent) => (self, that) => self === that || isEquivalent(self, that), isStrictEquivalent = (x, y) => x === y, strictEqual = () => isStrictEquivalent;
function Array_(item) {
  return make((self, that) => {
    if (self.length !== that.length)
      return !1;
    for (let i = 0;i < self.length; i++)
      if (!item(self[i], that[i]))
        return !1;
    return !0;
  });
}

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/internal/option.js
var TypeId = "~effect/Option", CommonProto = {
  [TypeId]: {
    _A: (_) => _
  },
  ...PipeInspectableProto,
  [Symbol.iterator]() {
    return new SingleShotGen(this);
  }
}, SomeProto = /* @__PURE__ */ Object.defineProperty(/* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto), {
  _tag: "Some",
  _op: "Some",
  [symbol2](that) {
    return isOption(that) && isSome(that) && equals(this.value, that.value);
  },
  [symbol]() {
    return combine(hash(this._tag))(hash(this.value));
  },
  toString() {
    return `some(${format(this.value)})`;
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag,
      value: toJson(this.value)
    };
  }
}), "valueOrUndefined", {
  get() {
    return this.value;
  }
}), NoneHash = /* @__PURE__ */ hash("None"), NoneProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto), {
  _tag: "None",
  _op: "None",
  valueOrUndefined: void 0,
  [symbol2](that) {
    return isOption(that) && isNone(that);
  },
  [symbol]() {
    return NoneHash;
  },
  toString() {
    return "none()";
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag
    };
  }
}), isOption = (input) => hasProperty(input, TypeId), isNone = (fa) => fa._tag === "None", isSome = (fa) => fa._tag === "Some", none = /* @__PURE__ */ Object.create(NoneProto), SomeImpl = function(value) {
  this.value = value;
};
SomeImpl.prototype = SomeProto;
var some = (value) => new SomeImpl(value);

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/internal/result.js
var TypeId2 = "~effect/Result", CommonProto2 = {
  [TypeId2]: {
    _A: (_) => _,
    _E: (_) => _
  },
  ...PipeInspectableProto,
  [Symbol.iterator]() {
    return new SingleShotGen(this);
  }
}, SuccessProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto2), {
  _tag: "Success",
  _op: "Success",
  [symbol2](that) {
    return isResult(that) && isSuccess(that) && equals(this.success, that.success);
  },
  [symbol]() {
    return combine(hash(this._tag))(hash(this.success));
  },
  toString() {
    return `success(${format(this.success)})`;
  },
  toJSON() {
    return {
      _id: "Result",
      _tag: this._tag,
      value: toJson(this.success)
    };
  }
}), FailureProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto2), {
  _tag: "Failure",
  _op: "Failure",
  [symbol2](that) {
    return isResult(that) && isFailure(that) && equals(this.failure, that.failure);
  },
  [symbol]() {
    return combine(hash(this._tag))(hash(this.failure));
  },
  toString() {
    return `failure(${format(this.failure)})`;
  },
  toJSON() {
    return {
      _id: "Result",
      _tag: this._tag,
      failure: toJson(this.failure)
    };
  }
}), isResult = (input) => hasProperty(input, TypeId2), isFailure = (result) => result._tag === "Failure", isSuccess = (result) => result._tag === "Success", FailureImpl = function(failure) {
  this.failure = failure;
};
FailureImpl.prototype = FailureProto;
var fail = (failure) => new FailureImpl(failure), SuccessImpl = function(success) {
  this.success = success;
};
SuccessImpl.prototype = SuccessProto;
var succeed = (success) => new SuccessImpl(success);

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Order.js
function make2(compare) {
  return (self, that) => self === that ? 0 : compare(self, that);
}
var Number2 = /* @__PURE__ */ make2((self, that) => {
  if (globalThis.Number.isNaN(self) && globalThis.Number.isNaN(that))
    return 0;
  if (globalThis.Number.isNaN(self))
    return -1;
  if (globalThis.Number.isNaN(that))
    return 1;
  return self < that ? -1 : 1;
});
var isLessThan = (O) => dual(2, (self, that) => O(self, that) === -1), isGreaterThan = (O) => dual(2, (self, that) => O(self, that) === 1), isLessThanOrEqualTo = (O) => dual(2, (self, that) => O(self, that) !== 1), isGreaterThanOrEqualTo = (O) => dual(2, (self, that) => O(self, that) !== -1);

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Option.js
var none2 = () => none, some2 = some;
var isNone2 = isNone, isSome2 = isSome, match = /* @__PURE__ */ dual(2, (self, {
  onNone,
  onSome
}) => isNone2(self) ? onNone() : onSome(self.value));
var liftThrowable = (f) => (...a) => {
  try {
    return some2(f(...a));
  } catch {
    return none2();
  }
};
var filter = /* @__PURE__ */ dual(2, (self, predicate) => isNone2(self) ? none2() : predicate(self.value) ? some2(self.value) : none2());

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Context.js
var ServiceTypeId = "~effect/Context/Service", Service = function() {
  function KeyClass() {}
  let self = KeyClass;
  Object.setPrototypeOf(self, ServiceProto);
  let init = (key, options) => {
    if (self.key = key, options?.defaultValue)
      self[ReferenceTypeId] = ReferenceTypeId, self.defaultValue = options.defaultValue;
    if (options?.make)
      self.make = options.make;
    if (options?.fiberCached)
      cacheKeys.add(key);
    return self;
  };
  return arguments.length > 0 ? init(arguments[0], arguments[1]) : init;
}, ServiceProto = {
  [ServiceTypeId]: ServiceTypeId,
  .../* @__PURE__ */ Prototype2({
    label: "Service",
    evaluate(fiber) {
      return exitSucceed(get(fiber.context, this));
    }
  }),
  toJSON() {
    return {
      _id: "Service",
      key: this.key
    };
  },
  of(self) {
    return self;
  },
  context(self) {
    return make3(this, self);
  },
  use(f) {
    return withFiber((fiber) => f(get(fiber.context, this)));
  },
  useSync(f) {
    return withFiber((fiber) => exitSucceed(f(get(fiber.context, this))));
  }
}, cacheKeys = /* @__PURE__ */ new Set, ReferenceTypeId = "~effect/Context/Reference", TypeId3 = "~effect/Context", MaxDepth = 8, FlattenAfterBaseHits = 8, makeImpl = (cacheRoot, base, overlay, depth) => {
  let self = Object.create(Proto);
  return self.cacheRoot = cacheRoot ?? self, self.base = base, self.overlay = overlay, self.depth = depth, self._flat = void 0, self.baseHits = 0, self;
}, applyOverlays = (map, overlay) => {
  if (!overlay)
    return;
  applyOverlays(map, overlay.parent), map.set(overlay.key, overlay.value);
}, flatten = (self) => {
  if (self._flat)
    return self._flat;
  if (!self.overlay)
    return self._flat = self.base;
  let map = new Map(self.base);
  return applyOverlays(map, self.overlay), self._flat = map;
};
var notFound = /* @__PURE__ */ Symbol(), lookup = (self, key) => {
  let impl = self;
  for (let overlay = impl.overlay;overlay; overlay = overlay.parent)
    if (overlay.key === key)
      return overlay.value;
  let value = impl.base.get(key);
  if (value === void 0 && !impl.base.has(key))
    return notFound;
  if (impl.overlay && ++impl.baseHits >= impl.base.size && impl.baseHits >= FlattenAfterBaseHits)
    impl.base = flatten(impl), impl.overlay = void 0, impl.depth = 0;
  return value;
}, makeUnsafe = (mapUnsafe) => makeImpl(void 0, mapUnsafe, void 0, 0), Proto = {
  get mapUnsafe() {
    return flatten(this);
  },
  ...PipeInspectableProto,
  [TypeId3]: {
    _Services: (_) => _
  },
  toJSON() {
    return {
      _id: "Context",
      services: Array.from(this.mapUnsafe).map(([key, value]) => ({
        key,
        value
      }))
    };
  },
  [symbol2](that) {
    if (!isContext(that))
      return !1;
    let self = this.mapUnsafe, other = that.mapUnsafe;
    if (self.size !== other.size)
      return !1;
    for (let [key, value] of self)
      if (!other.has(key) || !equals(value, other.get(key)))
        return !1;
    return !0;
  },
  [symbol]() {
    return number(this.mapUnsafe.size);
  }
}, hasSameCache = (self, that) => self.cacheRoot === that.cacheRoot, isContext = (u) => hasProperty(u, TypeId3);
var isReference = (u) => !!u[ReferenceTypeId], empty = () => emptyContext2, emptyContext2 = /* @__PURE__ */ makeUnsafe(/* @__PURE__ */ new Map), make3 = (key, service) => makeUnsafe(/* @__PURE__ */ new Map([[key.key, service]])), add = /* @__PURE__ */ dual(3, (self, key, service) => addUnsafe(self, key.key, service)), addUnsafe = (self, key, service) => {
  let impl = self, cacheRoot = cacheKeys.has(key) ? void 0 : impl.cacheRoot;
  if (impl.depth >= MaxDepth) {
    let map = new Map(impl.mapUnsafe);
    return map.set(key, service), makeImpl(cacheRoot, map, void 0, 0);
  }
  return makeImpl(cacheRoot, impl.base, {
    key,
    value: service,
    parent: impl.overlay
  }, impl.depth + 1);
};
var getOrUndefinedUnsafe = (self, key) => {
  let value = lookup(self, key);
  return value === notFound ? void 0 : value;
}, getUnsafe = /* @__PURE__ */ dual(2, (self, service) => {
  let value = lookup(self, service.key);
  if (value === notFound) {
    if (isReference(service))
      return getDefaultValue(service);
    throw serviceNotFoundError(service);
  }
  return value;
}), get = getUnsafe, defaultValueCacheKey = "~effect/Context/defaultValue", getDefaultValue = (ref) => {
  if (defaultValueCacheKey in ref)
    return ref[defaultValueCacheKey];
  return ref[defaultValueCacheKey] = ref.defaultValue();
}, serviceNotFoundError = (service) => {
  let error = Error(`Service not found${service.key ? `: ${String(service.key)}` : ""}`);
  if (error.stack) {
    let lines = error.stack.split(`
`);
    lines.splice(1, 3), error.stack = lines.join(`
`);
  }
  return error;
};
var Reference = Service;

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/internal/array.js
var isArrayNonEmpty = (self) => self.length > 0;

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Result.js
var succeed2 = succeed, fail2 = fail;
var isFailure2 = isFailure, isSuccess2 = isSuccess;
var map = /* @__PURE__ */ dual(2, (self, f) => isSuccess2(self) ? succeed2(f(self.success)) : self), match2 = /* @__PURE__ */ dual(2, (self, {
  onFailure,
  onSuccess
}) => isFailure2(self) ? onFailure(self.failure) : onSuccess(self.success));

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Array.js
var Array2 = globalThis.Array;
var append = /* @__PURE__ */ dual(2, (self, last) => [...self, last]);
var isArray = Array2.isArray;
var isArrayNonEmpty2 = isArrayNonEmpty, isReadonlyArrayNonEmpty = isArrayNonEmpty;
var empty2 = () => [];
var map2 = /* @__PURE__ */ dual(2, (self, f) => self.map(f));

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Scheduler.js
var Scheduler = /* @__PURE__ */ Reference("effect/Scheduler", {
  fiberCached: !0,
  defaultValue: () => new MixedScheduler
}), setMicrotask = (f) => {
  let cancelled = !1;
  return Promise.resolve().then(() => {
    if (!cancelled)
      f();
  }), () => {
    cancelled = !0;
  };
}, setTimer = "setImmediate" in globalThis ? (f) => {
  let timer = globalThis.setImmediate(f);
  return () => globalThis.clearImmediate(timer);
} : (f) => {
  let timer = setTimeout(f, 0);
  return () => clearTimeout(timer);
}, setImmediate = (f) => {
  try {
    return setTimer(f);
  } catch {
    return setMicrotask(f);
  }
};

class PriorityBuckets {
  buckets = [];
  scheduleTask(task, priority) {
    let buckets = this.buckets, len = buckets.length, bucket, index = 0;
    for (;index < len; index++) {
      if (buckets[index][0] > priority)
        break;
      bucket = buckets[index];
    }
    if (bucket && bucket[0] === priority)
      bucket[1].push(task);
    else if (index === len)
      buckets.push([priority, [task]]);
    else
      buckets.splice(index, 0, [priority, [task]]);
  }
  drain() {
    let buckets = this.buckets;
    return this.buckets = [], buckets;
  }
}

class MixedScheduler {
  executionMode;
  setImmediate;
  constructor(executionMode = "async", setImmediateFn) {
    this.executionMode = executionMode, this.setImmediate = setImmediateFn ?? (executionMode === "sync" ? setMicrotask : setImmediate);
  }
  shouldYield(fiber) {
    return fiber.currentOpCount >= fiber.cache.maxOpsBeforeYield;
  }
  makeDispatcher() {
    return new MixedSchedulerDispatcher(this.setImmediate);
  }
}

class MixedSchedulerDispatcher {
  tasks = /* @__PURE__ */ new PriorityBuckets;
  running = void 0;
  setImmediate;
  constructor(setImmediateFn = setImmediate) {
    this.setImmediate = setImmediateFn;
  }
  scheduleTask(task, priority) {
    if (this.tasks.scheduleTask(task, priority), this.running === void 0)
      this.running = this.setImmediate(this.afterScheduled);
  }
  afterScheduled = () => {
    this.running = void 0, this.runTasks();
  };
  runTasks() {
    let buckets = this.tasks.drain();
    for (let i = 0;i < buckets.length; i++) {
      let toRun = buckets[i][1];
      for (let j = 0;j < toRun.length; j++)
        toRun[j]();
    }
  }
  flush() {
    while (this.tasks.buckets.length > 0) {
      if (this.running !== void 0)
        this.running(), this.running = void 0;
      this.runTasks();
    }
  }
}
var MaxOpsBeforeYield = /* @__PURE__ */ Reference("effect/Scheduler/MaxOpsBeforeYield", {
  fiberCached: !0,
  defaultValue: () => 2048
}), PreventSchedulerYield = /* @__PURE__ */ Reference("effect/Scheduler/PreventSchedulerYield", {
  fiberCached: !0,
  defaultValue: () => !1
});

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Data.js
var Class2 = class extends Class {
  constructor(props) {
    super();
    if (props)
      assignProperties(this, props);
  }
}, TaggedClass = (tag) => class extends Class2 {
  _tag = tag;
};
var TaggedError2 = TaggedError;

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/encoding/EncodingError.js
var EncodingErrorTypeId = "~effect/encoding/EncodingError";

class EncodingError extends (/* @__PURE__ */ TaggedError2("EncodingError")) {
  [EncodingErrorTypeId] = EncodingErrorTypeId;
}

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Tracer.js
var ParentSpanKey = "effect/Tracer/ParentSpan";
var TracerKey = "effect/Tracer";

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/internal/metric.js
var FiberRuntimeMetricsKey = "effect/Metric/FiberRuntimeMetrics";

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/internal/references.js
var CurrentStackFrame = /* @__PURE__ */ Reference("effect/References/CurrentStackFrame", {
  fiberCached: !0,
  defaultValue: constUndefined
}), TracerEnabled = /* @__PURE__ */ Reference("effect/References/TracerEnabled", {
  fiberCached: !0,
  defaultValue: constTrue
});
var CurrentLogLevel = /* @__PURE__ */ Reference("effect/References/CurrentLogLevel", {
  fiberCached: !0,
  defaultValue: () => "Info"
}), MinimumLogLevel = /* @__PURE__ */ Reference("effect/References/MinimumLogLevel", {
  fiberCached: !0,
  defaultValue: () => "Info"
});

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/internal/effect.js
class Interrupt extends ReasonBase {
  constructor(fiberId, annotations = constEmptyAnnotations) {
    super("Interrupt", annotations, "Interrupted");
    this.fiberId = fiberId;
  }
  toString() {
    return `Interrupt(${this.fiberId})`;
  }
  toJSON() {
    return {
      _tag: "Interrupt",
      fiberId: this.fiberId
    };
  }
  [symbol2](that) {
    return isInterruptReason(that) && this.fiberId === that.fiberId && this.annotations === that.annotations;
  }
  [symbol]() {
    return combine(string(`${this._tag}:${this.fiberId}`))(random(this.annotations));
  }
}
var causeInterrupt = (fiberId) => new CauseImpl([new Interrupt(fiberId)]);
var findError = (self) => {
  for (let i = 0;i < self.reasons.length; i++) {
    let reason = self.reasons[i];
    if (reason._tag === "Fail")
      return succeed2(reason.error);
  }
  return fail2(self);
};
var hasInterrupts = (self) => self.reasons.some(isInterruptReason);
var causeMap = /* @__PURE__ */ dual(2, (self, f) => {
  let hasFail = !1, failures = self.reasons.map((failure) => {
    if (isFailReason(failure))
      return hasFail = !0, new Fail(f(failure.error), failure.annotations);
    return failure;
  });
  return hasFail ? causeFromReasons(failures) : self;
});
var FiberTypeId = "~effect/Fiber", fiberVariance = {
  _A: identity,
  _E: identity
}, fiberIdStore = {
  id: 0
}, AsyncResource = /* @__PURE__ */ (() => {
  try {
    return globalThis.process?.getBuiltinModule?.("node:async_hooks")?.AsyncResource;
  } catch {
    return;
  }
})(), captureAsyncContext = () => AsyncResource === void 0 ? void 0 : new AsyncResource("effect/Fiber"), getCurrentFiber = () => globalThis[currentFiberTypeId];

class FiberImpl {
  constructor(context, interruptible = !0) {
    this.setContext(context), this.id = ++fiberIdStore.id, this.currentOpCount = 0, this.interruptible = interruptible, this._stack = [], this._observers = void 0, this._exit = void 0, this._children = void 0, this._interruptedCause = void 0, this._yielded = void 0, this._running = !1, this._deferredInterrupt = !1, this._parent = void 0, this._asyncContext = void 0, this.cache.runtimeMetrics?.recordFiberStart(this.context);
  }
  get [FiberTypeId]() {
    return fiberVariance;
  }
  get currentDispatcher() {
    return this._dispatcher ??= this.cache.scheduler.makeDispatcher();
  }
  getRef(ref) {
    return get(this.context, ref);
  }
  addObserver(cb) {
    if (this._exit)
      return cb(this._exit), constVoid;
    if (this._observers === void 0)
      this._observers = [cb];
    else
      this._observers.push(cb);
    return () => this.removeObserver(cb);
  }
  removeObserver(cb) {
    if (this._exit || this._observers === void 0)
      return;
    let index = this._observers.indexOf(cb);
    if (index >= 0)
      this._observers.splice(index, 1);
  }
  interruptUnsafe(fiberId, annotations) {
    if (this._exit)
      return;
    let cause = causeInterrupt(fiberId);
    if (this.cache.stackFrame)
      cause = causeAnnotate(cause, make3(StackTraceKey, this.cache.stackFrame));
    if (annotations)
      cause = causeAnnotate(cause, annotations);
    if (this._interruptedCause = this._interruptedCause ? causeCombine(this._interruptedCause, cause) : cause, this.interruptible)
      if (this._running)
        this._deferredInterrupt = !0;
      else
        this.evaluate(failCause(this._interruptedCause));
  }
  pollUnsafe() {
    return this._exit;
  }
  evaluate(effect) {
    if (this._exit)
      return;
    else if (this._asyncContext !== void 0) {
      let asyncContext = this._asyncContext;
      return this._asyncContext = void 0, asyncContext.runInAsyncScope(this.evaluate, this, effect);
    } else if (this._yielded !== void 0) {
      let yielded = this._yielded;
      this._yielded = void 0, yielded();
    }
    let exit = this.runLoop(effect);
    if (exit === Yield) {
      this._asyncContext = captureAsyncContext();
      return;
    }
    let interruptChildren = fiberMiddleware.interruptChildren && fiberMiddleware.interruptChildren(this);
    if (interruptChildren !== void 0)
      return this.evaluate(flatMap(interruptChildren, () => exit));
    if (this._exit = exit, this.cache.runtimeMetrics?.recordFiberEnd(this.context, this._exit), this._parent)
      this._parent._children?.delete(this), this._parent = void 0;
    if (this._observers !== void 0) {
      let observers = this._observers;
      this._observers = void 0;
      for (let i = 0;i < observers.length; i++)
        observers[i](exit);
    }
    this._stack.length = 0, this._children = void 0, this.context = empty();
  }
  runLoop(effect) {
    let prevFiber = globalThis[currentFiberTypeId];
    globalThis[currentFiberTypeId] = this;
    let prevRunning = this._running;
    this._running = !0;
    let yielding = !1, current = effect;
    this.currentOpCount = 0;
    try {
      while (!0) {
        if (this._deferredInterrupt)
          this._deferredInterrupt = !1, current = failCause(this._interruptedCause);
        this.currentOpCount++;
        let cache = this.cache;
        if (!yielding && !cache.preventYield && cache.scheduler.shouldYield(this)) {
          yielding = !0;
          let prev = current;
          current = flatMap(yieldNow, () => prev);
        }
        if (current = cache.tracerContext ? cache.tracerContext(current, this) : current[evaluate](this), current === Yield) {
          let yielded = this._yielded;
          if (ExitTypeId in yielded)
            return this._deferredInterrupt = !1, this._yielded = void 0, yielded;
          else if (this._deferredInterrupt) {
            this._yielded = void 0, yielded();
            continue;
          }
          return Yield;
        }
      }
    } catch (error) {
      if (!hasProperty(current, evaluate))
        return exitDie(`Fiber.runLoop: Not a valid effect: ${String(current)}`);
      return this.runLoop(exitDie(error));
    } finally {
      this._running = prevRunning, globalThis[currentFiberTypeId] = prevFiber;
    }
  }
  getCont(symbol) {
    if (this._deferredInterrupt)
      return this._deferredInterrupt = !1, deferredInterruptCont;
    while (!0) {
      let op = this._stack.pop();
      if (!op)
        return;
      let all = op[contAll];
      if (all !== void 0) {
        let cont = all.call(op, this);
        if (cont)
          return cont[symbol] = cont, cont;
      }
      if (op[symbol])
        return op;
    }
  }
  succeedWith(value) {
    if ((++this.currentOpCount & maxInlineSteps - 1) === 0)
      return exitSucceed(value);
    let cont = this.getCont(contA);
    return cont ? cont[contA](value, this) : this.yieldWith(exitSucceed(value));
  }
  yieldWith(value) {
    return this._yielded = value, Yield;
  }
  children() {
    return this._children ??= /* @__PURE__ */ new Set;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  setContext(context) {
    let previous = this.context;
    if (this.context = context, previous !== void 0 && hasSameCache(previous, context))
      return;
    let root = context.cacheRoot, cache = root._fiberCache ??= makeFiberContextCache(context);
    if (this.cache?.scheduler !== cache.scheduler)
      this._dispatcher = void 0;
    this.cache = cache;
  }
  get currentSpanLocal() {
    let span = this.cache.span;
    return span?._tag === "Span" ? span : void 0;
  }
}
var makeFiberContextCache = (context) => {
  let currentTracer = getOrUndefinedUnsafe(context, TracerKey);
  return {
    scheduler: get(context, Scheduler),
    tracer: currentTracer,
    tracerContext: currentTracer ? currentTracer.context : void 0,
    tracerEnabled: get(context, TracerEnabled),
    span: getOrUndefinedUnsafe(context, ParentSpanKey),
    logLevel: get(context, CurrentLogLevel),
    minimumLogLevel: get(context, MinimumLogLevel),
    stackFrame: get(context, CurrentStackFrame),
    runtimeMetrics: getOrUndefinedUnsafe(context, FiberRuntimeMetricsKey),
    maxOpsBeforeYield: get(context, MaxOpsBeforeYield),
    preventYield: get(context, PreventSchedulerYield)
  };
}, deferredInterruptCont = {
  [contA](_value, fiber) {
    return failCause(fiber._interruptedCause);
  },
  [contE](_cause, fiber) {
    return failCause(fiber._interruptedCause);
  }
}, maxInlineSteps = 32, fiberMiddleware = {
  interruptChildren: void 0
}, fiberStackAnnotations = (fiber) => {
  if (!fiber.cache.stackFrame)
    return;
  let annotations = /* @__PURE__ */ new Map;
  return annotations.set(InterruptorStackTrace.key, fiber.cache.stackFrame), makeUnsafe(annotations);
};
var fiberAwaitAll = (self) => callback((resume) => {
  let iter = self[Symbol.iterator](), exits = [], cancel = void 0;
  function loop() {
    let result = iter.next();
    while (!result.done) {
      if (result.value._exit) {
        exits.push(result.value._exit), result = iter.next();
        continue;
      }
      cancel = result.value.addObserver((exit) => {
        exits.push(exit), loop();
      });
      return;
    }
    resume(succeed3(exits));
  }
  return loop(), sync(() => cancel?.());
});
var fiberInterruptAll = (fibers) => withFiber((parent) => {
  let annotations = fiberStackAnnotations(parent), fiberArr = empty2();
  for (let fiber of fibers)
    fiber.interruptUnsafe(parent.id, annotations), fiberArr.push(fiber);
  return asVoid(fiberAwaitAll(fiberArr));
});
var succeed3 = exitSucceed, failCause = exitFailCause, fail3 = exitFail, sync = /* @__PURE__ */ makePrimitive({
  op: "Sync",
  [evaluate](fiber) {
    let value = this[args](), cont = fiber.getCont(contA);
    return cont ? cont[contA](value, fiber) : fiber.yieldWith(exitSucceed(value));
  }
}), suspend = /* @__PURE__ */ makePrimitive({
  op: "Suspend",
  [evaluate](_fiber) {
    return this[args]();
  }
});
var fromResult = /* @__PURE__ */ match2({
  onFailure: fail3,
  onSuccess: succeed3
});
var yieldNowWith = /* @__PURE__ */ makePrimitive({
  op: "Yield",
  [evaluate](fiber) {
    let resumed = !1;
    return fiber.currentDispatcher.scheduleTask(() => {
      if (resumed)
        return;
      fiber.evaluate(exitVoid);
    }, this[args] ?? 0), fiber.yieldWith(() => {
      resumed = !0;
    });
  }
}), yieldNow = /* @__PURE__ */ yieldNowWith(0);
var failCauseSync = (evaluate) => suspend(() => failCause(evaluate())), die = (defect) => exitDie(defect), failSync = (error) => suspend(() => fail3(error())), void_ = /* @__PURE__ */ succeed3(void 0);
var try_ = (options) => {
  let evaluate = typeof options === "function" ? options : options.try, catcher = typeof options === "function" ? (cause) => new UnknownError(cause, "An error occurred in Effect.try") : options.catch;
  return suspend(() => {
    try {
      return succeed3(evaluate());
    } catch (err) {
      return fail3(catcher(err));
    }
  });
};
var tryPromise = (options) => {
  let f = typeof options === "function" ? options : options.try, catcher = typeof options === "function" ? (cause) => new UnknownError(cause, "An error occurred in Effect.tryPromise") : options.catch;
  return callbackOptions(function(resume, signal) {
    let failWithCatch = (cause) => suspend(() => {
      try {
        return fail3(internalCall(() => catcher(cause)));
      } catch (err) {
        return die(err);
      }
    });
    try {
      f(signal).then((a) => resume(succeed3(a)), (e) => resume(failWithCatch(e)));
    } catch (err) {
      resume(failWithCatch(err));
    }
  }, f.length !== 0);
};
var callbackOptions = /* @__PURE__ */ function() {
  let Proto = /* @__PURE__ */ makePrimitiveProto({
    op: "Async",
    [evaluate](fiber) {
      let resumed = !1, yielded = !1, controller = this.withSignal ? new AbortController : void 0, onCancel = this.register.call(fiber.cache.scheduler, (effect) => {
        if (resumed)
          return;
        if (resumed = !0, yielded)
          fiber.evaluate(effect);
        else
          yielded = effect;
      }, controller?.signal);
      if (yielded !== !1)
        return yielded;
      if (yielded = !0, fiber._yielded = () => {
        resumed = !0;
      }, controller === void 0 && onCancel === void 0)
        return Yield;
      return fiber._stack.push(asyncFinalizer(() => (resumed = !0, controller?.abort(), onCancel ?? exitVoid))), Yield;
    }
  }), AsyncImpl = function(register, withSignal) {
    this.register = register, this.withSignal = withSignal;
  };
  return AsyncImpl.prototype = Proto, function(register, withSignal) {
    return new AsyncImpl(register, withSignal);
  };
}(), asyncFinalizer = /* @__PURE__ */ makePrimitive({
  op: "AsyncFinalizer",
  [contAll](fiber) {
    if (fiber.interruptible)
      fiber.interruptible = !1, fiber._stack.push(setInterruptibleTrue);
  },
  [contE](cause, _fiber) {
    return hasInterrupts(cause) ? flatMap(combineFinalizerCause(exitFailCause(cause), this[args]()), () => failCause(cause)) : failCause(cause);
  }
}), callback = (register) => callbackOptions(register, register.length >= 2);
var defineFunctionLength = (length, fn) => Object.defineProperty(fn, "length", {
  value: length,
  configurable: !0
});
var fnUntracedEager = (body, ...pipeables) => defineFunctionLength(body.length, pipeables.length === 0 ? function() {
  return fromIteratorEagerUnsafe(() => body.apply(this, arguments));
} : function() {
  let effect = fromIteratorEagerUnsafe(() => body.apply(this, arguments));
  for (let pipeable of pipeables)
    effect = pipeable(effect, ...arguments);
  return effect;
}), fromIteratorEagerUnsafe = (evaluate) => {
  try {
    let iterator = evaluate(), value = void 0;
    while (!0) {
      let state = iterator.next(value);
      if (state.done)
        return succeed3(state.value);
      let primitive = state.value;
      if (primitive && primitive._tag === "Success") {
        value = primitive.value;
        continue;
      } else if (primitive && primitive._tag === "Failure")
        return state.value;
      else {
        let isFirstExecution = !0;
        return suspend(() => {
          if (isFirstExecution)
            return isFirstExecution = !1, flatMap(state.value, (value) => fromIteratorUnsafe(iterator, value));
          else
            return suspend(() => fromIteratorUnsafe(evaluate()));
        });
      }
    }
  } catch (error) {
    return die(error);
  }
}, fromIteratorUnsafe = /* @__PURE__ */ function() {
  let Proto = /* @__PURE__ */ makePrimitiveProto({
    op: "Iterator",
    [contA](value, fiber) {
      let iter = this.iterator;
      while (!0) {
        let state = iter.next(value);
        if (state.done)
          return succeed3(state.value);
        if (!effectIsExit(state.value))
          return fiber._stack.push(this), state.value;
        else if (state.value._tag === "Failure")
          return state.value;
        value = state.value.value;
      }
    },
    [evaluate](fiber) {
      return this[contA](this.initial, fiber);
    }
  }), IteratorImpl = function(iterator, initial) {
    this.iterator = iterator, this.initial = initial;
  };
  return IteratorImpl.prototype = Proto, function(iterator, initial) {
    return new IteratorImpl(iterator, initial);
  };
}();
var evaluateCont = function(fiber) {
  return fiber._stack.push(this), this[args];
}, OnSuccessProto = /* @__PURE__ */ makePrimitiveProto({
  op: "OnSuccess",
  [evaluate]: evaluateCont
}), ContImpl = function(self, cont, payload) {
  this[args] = self, this[contA] = cont, this.payload = payload;
};
ContImpl.prototype = OnSuccessProto;
var returnPayload = function() {
  return this.payload;
};
var continuationMarksStack = /* @__PURE__ */ (() => ({
  ["~effect/Effect/stackProbe"]: function() {
    return Error().stack;
  }
})["~effect/Effect/stackProbe"]()?.includes("[as ~effect/Effect/stackProbe]") === !0)(), mapCont = function(value, fiber) {
  let f = this.payload;
  return fiber.succeedWith(continuationMarksStack ? f(value) : internalCall(() => f(value)));
}, andThenCont = function(value) {
  let f = this.payload;
  return f(value);
};
var asVoid = (self) => new ContImpl(self, returnPayload, exitVoid);
var flatMap = /* @__PURE__ */ dual(2, (self, f) => new ContImpl(self, andThenCont, f));
var effectIsExit = (effect) => effect[ExitTypeId] !== void 0, flatMapEager = /* @__PURE__ */ dual(2, (self, f) => {
  if (effectIsExit(self))
    return self._tag === "Success" ? f(self.value) : self;
  return flatMap(self, f);
});
var map3 = /* @__PURE__ */ dual(2, (self, f) => new ContImpl(self, mapCont, f)), mapEager = /* @__PURE__ */ dual(2, (self, f) => effectIsExit(self) ? exitMap(self, f) : map3(self, f)), mapErrorEager = /* @__PURE__ */ dual(2, (self, f) => effectIsExit(self) ? exitMapError(self, f) : mapError(self, f));
var exitIsSuccess = (self) => self._tag === "Success";
var exitVoid = /* @__PURE__ */ exitSucceed(void 0), exitMap = /* @__PURE__ */ dual(2, (self, f) => self._tag === "Success" ? exitSucceed(f(self.value)) : self), exitMapError = /* @__PURE__ */ dual(2, (self, f) => {
  if (self._tag === "Success")
    return self;
  let error = findError(self.cause);
  if (isFailure2(error))
    return self;
  return exitFail(f(error.success));
});
var catchCause = /* @__PURE__ */ dual(2, (self, f) => new OnFailureImpl(self, f.length !== 1 ? (cause) => f(cause) : f)), OnFailureProto = /* @__PURE__ */ makePrimitiveProto({
  op: "OnFailure",
  [evaluate]: evaluateCont
}), OnFailureImpl = function(self, f) {
  this[args] = self, this[contE] = f;
};
OnFailureImpl.prototype = OnFailureProto;
var catchCauseFilter = /* @__PURE__ */ dual(3, (self, filter, f) => catchCause(self, (cause) => {
  let eb = filter(cause);
  return isFailure2(eb) ? failCause(eb.failure) : f(eb.success, cause);
})), catch_ = /* @__PURE__ */ dual(2, (self, f) => catchCauseFilter(self, findError, (e) => f(e)));
var mapError = /* @__PURE__ */ dual(2, (self, f) => catch_(self, (error) => failSync(() => f(error))));
var OnSuccessAndFailureProto = /* @__PURE__ */ makePrimitiveProto({
  op: "OnSuccessAndFailure",
  [evaluate]: evaluateCont
}), OnSuccessAndFailureImpl = function(self, onSuccess, onFailure) {
  this[args] = self, this[contA] = onSuccess, this[contE] = onFailure;
};
OnSuccessAndFailureImpl.prototype = OnSuccessAndFailureProto;
var exit = (self) => effectIsExit(self) ? exitSucceed(self) : exitPrimitive(self), exitPrimitive = /* @__PURE__ */ makePrimitive({
  op: "Exit",
  [evaluate](fiber) {
    return fiber._stack.push(this), this[args];
  },
  [contA](value, fiber, exit) {
    return fiber.succeedWith(exit ?? exitSucceed(value));
  },
  [contE](cause, fiber, exit) {
    return fiber.succeedWith(exit ?? exitFailCause(cause));
  }
});
var combineFinalizerCause = (exit_, finalizer) => exitIsSuccess(exit_) ? finalizer : catchCause(finalizer, (cause) => failCause(causeCombine(exit_.cause, cause)));
var uninterruptible = (self) => withFiber((fiber) => {
  if (!fiber.interruptible)
    return self;
  return fiber.interruptible = !1, fiber._stack.push(setInterruptibleTrue), self;
}), setInterruptible = /* @__PURE__ */ makePrimitive({
  op: "SetInterruptible",
  [contAll](fiber) {
    if (fiber.interruptible = this[args], fiber._interruptedCause && fiber.interruptible)
      return () => failCause(fiber._interruptedCause);
  }
}), setInterruptibleTrue = /* @__PURE__ */ setInterruptible(!0);
var whileLoop = /* @__PURE__ */ makePrimitive({
  op: "While",
  [contA](value, fiber) {
    if (this[args].step(value), this[args].while())
      return fiber._stack.push(this), this[args].body();
    return exitVoid;
  },
  [evaluate](fiber) {
    if (this[args].while())
      return fiber._stack.push(this), this[args].body();
    return exitVoid;
  }
});
var resolveConcurrency = (concurrency) => concurrency === "unbounded" ? Number.POSITIVE_INFINITY : Math.max(1, concurrency ?? 1), iterateEager = () => (options) => {
  let { onItem, step } = options, resumeSequential = (state, items, index, end, effect) => flatMap(exit(effect), (itemExit) => step(state, items[index], itemExit, index) ?? runSequential(state, items, index + 1, end) ?? void_), runSequential = (state, items, index = 0, end = items.length) => {
    for (;index < end; index++) {
      let item = items[index], effect = onItem(state, item, index);
      if (!effectIsExit(effect))
        return resumeSequential(state, items, index, end, effect);
      let terminal = step(state, item, effect, index);
      if (terminal)
        return terminal._tag === "Failure" ? terminal : void 0;
    }
  };
  return runSequential;
}, iterateConcurrentImpl = (options) => {
  let { onItem, step } = options;
  return (state, items, opts) => {
    let index = 0, end = opts.end ?? items.length, concurrency = opts.concurrency, done = !1, parentFiber, fibers, resume, terminal, effect, failDefect = (error) => {
      let defect = exitDie(error);
      return terminal = defect, done = !0, fibers && fibers.size > 0 ? flatMap(uninterruptible(fiberInterruptAll(Array.from(fibers))), () => terminal ?? defect) : defect;
    }, go = () => {
      let paused = !1;
      for (;!terminal && index < end; index++) {
        let item = items[index], eff = effect ?? onItem(state, item, index);
        if (effectIsExit(eff)) {
          if (terminal = step(state, item, eff, index), terminal)
            break;
        } else if (!parentFiber)
          return callback((cb) => {
            parentFiber = getCurrentFiber(), fibers = /* @__PURE__ */ new Set, effect = eff, resume = cb;
            let result;
            try {
              result = go();
            } catch (error) {
              return cb(failDefect(error));
            }
            if (result)
              return cb(result);
            return suspend(() => (terminal ??= exitVoid, flatMap(fibers ? fiberInterruptAll(fibers) : void_, () => terminal?._tag === "Failure" ? terminal : void_)));
          });
        else {
          effect = void 0;
          let fiber = forkUnsafe(parentFiber, eff, !0, !0, "inherit");
          if (fiber._exit) {
            if (terminal = step(state, item, fiber._exit, index), terminal)
              break;
            continue;
          }
          fibers.add(fiber);
          let currentIndex = index;
          if (fiber.addObserver((exit) => {
            fibers.delete(fiber);
            try {
              if (terminal) {
                if (exit._tag === "Failure") {
                  let reasons = exit.cause.reasons.filter((reason) => reason._tag !== "Interrupt");
                  if (reasons.length > 0) {
                    let cause = causeFromReasons(reasons);
                    terminal = exitFailCause(terminal._tag === "Failure" ? causeCombine(terminal.cause, cause) : cause);
                  }
                }
              } else {
                let result = step(state, item, exit, currentIndex);
                if (result)
                  terminal = result, go();
              }
              if (paused) {
                let eff = go();
                if (eff)
                  resume(eff);
              } else if (done && fibers.size === 0)
                resume(terminal ?? void_);
            } catch (error) {
              resume(failDefect(error));
            }
          }), fibers.size < concurrency)
            continue;
          paused = !0, index++;
          return;
        }
      }
      if (done = !0, terminal) {
        if (fibers && fibers.size > 0) {
          let annotations = fiberStackAnnotations(parentFiber);
          fibers.forEach((f) => f.interruptUnsafe(parentFiber.id, annotations));
          return;
        }
        if (resume || terminal._tag === "Failure")
          return terminal;
      } else if (resume) {
        if (!fibers)
          return exitVoid;
        else if (fibers.size === 0)
          resume(void_);
      }
    };
    return go();
  };
}, iterateConcurrent = () => (options) => iterateConcurrentImpl(options);
var forkUnsafe = (parent, effect, immediate = !1, daemon = !1, uninterruptible = !1) => {
  let parentRuntime = parent, interruptible = uninterruptible === "inherit" ? parentRuntime.interruptible : !uninterruptible, child = new FiberImpl(parentRuntime.context, interruptible);
  if (immediate)
    child.evaluate(effect);
  else
    child._asyncContext = captureAsyncContext(), parentRuntime.currentDispatcher.scheduleTask(() => child.evaluate(effect), 0);
  if (!daemon && !child._exit)
    parentRuntime.children().add(child), child._parent = parentRuntime;
  return child;
};
var runForkWith = (context) => (effect, options) => {
  let fiber = new FiberImpl(options?.scheduler ? add(context, Scheduler, options.scheduler) : context, options?.uninterruptible !== !0);
  if (fiber.evaluate(effect), fiber._exit)
    return fiber;
  if (options?.signal)
    if (options.signal.aborted)
      fiber.interruptUnsafe();
    else {
      let abort = () => fiber.interruptUnsafe();
      options.signal.addEventListener("abort", abort, {
        once: !0
      }), fiber.addObserver(() => options.signal.removeEventListener("abort", abort));
    }
  if (options?.onFiberStart)
    options.onFiberStart(fiber);
  return fiber;
};
var runSyncExitWith = (context) => {
  let runFork = runForkWith(context);
  return (effect) => {
    if (effectIsExit(effect))
      return effect;
    let scheduler = new MixedScheduler("sync"), fiber = runFork(effect, {
      scheduler
    });
    return fiber._dispatcher?.flush(), fiber._exit ?? exitDie(new AsyncFiberError(fiber));
  };
}, runSyncExit = /* @__PURE__ */ runSyncExitWith(/* @__PURE__ */ empty());
var IllegalArgumentErrorTypeId = "~effect/Cause/IllegalArgumentError";
class IllegalArgumentError extends (/* @__PURE__ */ TaggedError("IllegalArgumentError")) {
  [IllegalArgumentErrorTypeId] = IllegalArgumentErrorTypeId;
  constructor(message) {
    super({
      message
    });
  }
}
var AsyncFiberErrorTypeId = "~effect/Cause/AsyncFiberError";
class AsyncFiberError extends (/* @__PURE__ */ TaggedError("AsyncFiberError")) {
  [AsyncFiberErrorTypeId] = AsyncFiberErrorTypeId;
  constructor(fiber) {
    super({
      message: "An asynchronous Effect was executed with Effect.runSync",
      fiber
    });
  }
}
var UnknownErrorTypeId = "~effect/Cause/UnknownError";
class UnknownError extends (/* @__PURE__ */ TaggedError("UnknownError")) {
  [UnknownErrorTypeId] = UnknownErrorTypeId;
  constructor(cause, message) {
    super({
      message,
      cause
    });
  }
}
var LoggerTypeId = "~effect/Logger", LoggerProto = {
  [LoggerTypeId]: {
    _Message: identity,
    _Output: identity
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var colors = {
  bold: "1",
  red: "31",
  green: "32",
  yellow: "33",
  blue: "34",
  cyan: "36",
  white: "37",
  gray: "90",
  black: "30",
  bgBrightRed: "101"
}, logLevelColors = {
  None: [],
  All: [],
  Trace: [colors.gray],
  Debug: [colors.blue],
  Info: [colors.green],
  Warn: [colors.yellow],
  Error: [colors.red],
  Fatal: [colors.bgBrightRed, colors.black]
};

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Cause.js
var isFailReason2 = isFailReason;
var die2 = causeDie;
var map4 = causeMap;
var IllegalArgumentError2 = IllegalArgumentError;

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Exit.js
var succeed4 = exitSucceed, failCause2 = exitFailCause, fail4 = exitFail;
var void_2 = exitVoid;
var isSuccess3 = exitIsSuccess;

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/internal/dateTime.js
var TypeId4 = "~effect/DateTime", TimeZoneTypeId = "~effect/DateTime/TimeZone", Proto2 = {
  [TypeId4]: TypeId4,
  pipe() {
    return pipeArguments(this, arguments);
  },
  [NodeInspectSymbol]() {
    return this.toString();
  },
  toJSON() {
    return toDateUtc(this).toJSON();
  }
}, ProtoUtc = {
  ...Proto2,
  _tag: "Utc",
  [symbol]() {
    return number(this.epochMilliseconds);
  },
  [symbol2](that) {
    return isDateTime(that) && that._tag === "Utc" && this.epochMilliseconds === that.epochMilliseconds;
  },
  toString() {
    return `DateTime.Utc(${toDateUtc(this).toJSON()})`;
  }
}, ProtoZoned = {
  ...Proto2,
  _tag: "Zoned",
  [symbol]() {
    return combine(number(this.epochMilliseconds))(hash(this.zone));
  },
  [symbol2](that) {
    return isDateTime(that) && that._tag === "Zoned" && this.epochMilliseconds === that.epochMilliseconds && equals(this.zone, that.zone);
  },
  toString() {
    return `DateTime.Zoned(${formatIsoZoned(this)})`;
  }
}, ProtoTimeZone = {
  [TimeZoneTypeId]: TimeZoneTypeId,
  [NodeInspectSymbol]() {
    return this.toString();
  }
}, ProtoTimeZoneNamed = {
  ...ProtoTimeZone,
  _tag: "Named",
  [symbol]() {
    return string(`Named:${this.id}`);
  },
  [symbol2](that) {
    return isTimeZone(that) && that._tag === "Named" && this.id === that.id;
  },
  toString() {
    return `TimeZone.Named(${this.id})`;
  },
  toJSON() {
    return {
      _id: "TimeZone",
      _tag: "Named",
      id: this.id
    };
  }
}, ProtoTimeZoneOffset = {
  ...ProtoTimeZone,
  _tag: "Offset",
  [symbol]() {
    return string(`Offset:${this.offset}`);
  },
  [symbol2](that) {
    return isTimeZone(that) && that._tag === "Offset" && this.offset === that.offset;
  },
  toString() {
    return `TimeZone.Offset(${offsetToString(this.offset)})`;
  },
  toJSON() {
    return {
      _id: "TimeZone",
      _tag: "Offset",
      offset: this.offset
    };
  }
};
var isDateTime = (u) => hasProperty(u, TypeId4);
var isTimeZone = (u) => hasProperty(u, TimeZoneTypeId);
var isUtc = (self) => self._tag === "Utc";
var makeUtc = (epochMillis) => {
  let self = Object.create(ProtoUtc);
  return self.epochMilliseconds = epochMillis, Object.defineProperty(self, "partsUtc", {
    value: void 0,
    enumerable: !1,
    writable: !0
  }), self;
}, fromDateUnsafe = (date) => {
  let epochMillis = date.getTime();
  if (Number.isNaN(epochMillis))
    throw new IllegalArgumentError2("Invalid date");
  return makeUtc(epochMillis);
}, makeUnsafe2 = (input) => {
  if (isDateTime(input))
    return input;
  else if (input instanceof Date)
    return fromDateUnsafe(input);
  else if (typeof input === "object") {
    if ("epochMilliseconds" in input)
      return fromDateUnsafe(new Date(input.epochMilliseconds));
    let date = /* @__PURE__ */ new Date(0);
    return setPartsDate(date, input), fromDateUnsafe(date);
  } else if (typeof input === "string" && !hasZone(input))
    return fromDateUnsafe(/* @__PURE__ */ new Date(input + "Z"));
  return fromDateUnsafe(new Date(input));
}, hasZone = (input) => /Z|GMT|[+-]\d{2}$|[+-]\d{2}:?\d{2}$|\]$/.test(input);
var make4 = /* @__PURE__ */ liftThrowable(makeUnsafe2);
var toUtc = (self) => makeUtc(self.epochMilliseconds);
var toDateUtc = (self) => new Date(self.epochMilliseconds), toDate = (self) => {
  if (self._tag === "Utc")
    return new Date(self.epochMilliseconds);
  else if (self.zone._tag === "Offset")
    return new Date(self.epochMilliseconds + self.zone.offset);
  else if (self.adjustedEpochMilliseconds !== void 0)
    return new Date(self.adjustedEpochMilliseconds);
  let parts = self.zone.format.formatToParts(self.epochMilliseconds).filter((_) => _.type !== "literal"), date = /* @__PURE__ */ new Date(0);
  return date.setUTCFullYear(Number(parts[2].value), Number(parts[0].value) - 1, Number(parts[1].value)), date.setUTCHours(Number(parts[3].value), Number(parts[4].value), Number(parts[5].value), parts[6]?.type === "fractionalSecond" ? Number(parts[6].value) : (self.epochMilliseconds % 1000 + 1000) % 1000), self.adjustedEpochMilliseconds = date.getTime(), date;
}, zonedOffset = (self) => toDate(self).getTime() - toEpochMillis(self), offsetToString = (offset) => {
  let abs = Math.abs(offset), hours = Math.floor(abs / 3600000), minutes = Math.round(abs % 3600000 / 60000);
  if (minutes === 60)
    hours += 1, minutes = 0;
  return `${offset < 0 ? "-" : "+"}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}, zonedOffsetIso = (self) => offsetToString(zonedOffset(self)), toEpochMillis = (self) => self.epochMilliseconds;
var setPartsDate = (date, parts) => {
  if (parts.year !== void 0 || parts.month !== void 0 || parts.day !== void 0)
    date.setUTCFullYear(parts.year ?? date.getUTCFullYear(), parts.month !== void 0 ? parts.month - 1 : date.getUTCMonth(), parts.day ?? date.getUTCDate());
  if (parts.weekDay !== void 0) {
    let diff = parts.weekDay - date.getUTCDay();
    date.setUTCDate(date.getUTCDate() + diff);
  }
  if (parts.hour !== void 0)
    date.setUTCHours(parts.hour);
  if (parts.minute !== void 0)
    date.setUTCMinutes(parts.minute);
  if (parts.second !== void 0)
    date.setUTCSeconds(parts.second);
  if (parts.millisecond !== void 0)
    date.setUTCMilliseconds(parts.millisecond);
};
var formatIso = (self) => toDateUtc(self).toISOString();
var formatIsoOffset = (self) => {
  let date = toDate(self);
  return self._tag === "Utc" ? date.toISOString() : `${date.toISOString().slice(0, -1)}${zonedOffsetIso(self)}`;
}, formatIsoZoned = (self) => self.zone._tag === "Offset" ? formatIsoOffset(self) : `${formatIsoOffset(self)}[${self.zone.id}]`;

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/String.js
var String2 = globalThis.String;
var trim = (self) => self.trim();

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Effect.js
var tryPromise2 = tryPromise, succeed5 = succeed3;
var suspend2 = suspend;
var fail5 = fail3;
var failCauseSync2 = failCauseSync, die3 = die, try_2 = try_;
var fromResult2 = fromResult;
var flatMap2 = flatMap;
var exit2 = exit;
var catchCause2 = catchCause;
var mapError2 = mapError;
var runSyncExit2 = runSyncExit;
var mapEager2 = mapEager, mapErrorEager2 = mapErrorEager;
var flatMapEager2 = flatMapEager;
var fnUntracedEager2 = fnUntracedEager;

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/DateTime.js
var isDateTime2 = isDateTime;
var isUtc2 = isUtc;
var makeUnsafe3 = makeUnsafe2;
var make5 = make4;
var toUtc2 = toUtc;
var toEpochMillis2 = toEpochMillis;
var formatIso2 = formatIso;

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/encoding/Base64.js
var encode = (input) => encodeBytes(typeof input === "string" ? encoder.encode(input) : input), decode = (str) => {
  let stripped = stripCrlf(str), length = stripped.length;
  if (length % 4 !== 0)
    return fail2(new EncodingError({
      kind: "Decode",
      module: "Base64",
      input: stripped,
      message: `Length must be a multiple of 4, but is ${length}`
    }));
  let index = stripped.indexOf("=");
  if (index !== -1 && (index < length - 2 || index === length - 2 && stripped[length - 1] !== "="))
    return fail2(new EncodingError({
      kind: "Decode",
      module: "Base64",
      input: stripped,
      message: "Found a '=' character, but it is not at the end"
    }));
  try {
    let missingOctets = stripped.endsWith("==") ? 2 : stripped.endsWith("=") ? 1 : 0, result = new Uint8Array(3 * (length / 4) - missingOctets);
    for (let i = 0, j = 0;i < length; i += 4, j += 3) {
      let buffer = getCode(stripped.charCodeAt(i)) << 18 | getCode(stripped.charCodeAt(i + 1)) << 12 | getCode(stripped.charCodeAt(i + 2)) << 6 | getCode(stripped.charCodeAt(i + 3));
      result[j] = buffer >> 16, result[j + 1] = buffer >> 8 & 255, result[j + 2] = buffer & 255;
    }
    return succeed2(result);
  } catch (cause) {
    return fail2(new EncodingError({
      kind: "Decode",
      module: "Base64",
      input: stripped,
      message: cause instanceof Error ? cause.message : "Invalid input"
    }));
  }
};
var encodeBytes = (bytes) => {
  let length = bytes.length, result = "", i;
  for (i = 2;i < length; i += 3)
    result += alphabet[bytes[i - 2] >> 2], result += alphabet[(bytes[i - 2] & 3) << 4 | bytes[i - 1] >> 4], result += alphabet[(bytes[i - 1] & 15) << 2 | bytes[i] >> 6], result += alphabet[bytes[i] & 63];
  if (i === length + 1)
    result += alphabet[bytes[i - 2] >> 2], result += alphabet[(bytes[i - 2] & 3) << 4], result += "==";
  if (i === length)
    result += alphabet[bytes[i - 2] >> 2], result += alphabet[(bytes[i - 2] & 3) << 4 | bytes[i - 1] >> 4], result += alphabet[(bytes[i - 1] & 15) << 2], result += "=";
  return result;
}, encoder = /* @__PURE__ */ new TextEncoder;
var stripCrlf = (str) => str.replace(/[\n\r]/g, ""), alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", codes = /* @__PURE__ */ new Uint8Array(123).fill(255);
for (let i = 0;i < alphabet.length; i++)
  codes[/* @__PURE__ */ alphabet.charCodeAt(i)] = i;
codes[61] = 0;
var getCode = (charCode) => {
  if (charCode >= codes.length || codes[charCode] === 255)
    throw TypeError(`Invalid character ${String.fromCharCode(charCode)}`);
  return codes[charCode];
};

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/internal/schema/annotations.js
function resolve(ast) {
  return ast.checks ? ast.checks[ast.checks.length - 1].annotations : ast.annotations;
}
var STRUCTURAL_ANNOTATION_KEY = "~structural";
var SENTINELS_ANNOTATION_KEY = "~sentinels", CONSTRUCTOR_ANNOTATION_KEY = "~constructor";
var getExpected = /* @__PURE__ */ memoize((ast) => {
  let identifier = resolve(ast)?.identifier;
  if (typeof identifier === "string")
    return identifier;
  return ast.getExpected(getExpected);
});

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/internal/schema/parser.js
var missing = /* @__PURE__ */ Symbol();
var succeed6 = succeed4, missingExit = /* @__PURE__ */ succeed6(missing), sameExit = /* @__PURE__ */ succeed6(missing), toOption = (value) => value === missing ? none2() : some2(value), fromOptionExit = (option) => option._tag === "None" ? missingExit : succeed6(option.value);

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/SchemaIssue.js
var TypeId5 = "~effect/SchemaIssue/Issue";
function isIssue(u) {
  return hasProperty(u, TypeId5) && u[TypeId5] === TypeId5;
}
function hasInput(issue) {
  return Object.hasOwn(issue, "input");
}

class IssueNodeImpl {
  [TypeId5] = TypeId5;
  constructor(input, options) {
    if (options?.reportInput === !0 && input !== missing)
      this.input = input;
  }
}
var Filter = class extends IssueNodeImpl {
  _tag = "Filter";
  filter;
  issue;
  constructor(filter, issue, input, options) {
    super(input, options);
    this.filter = filter, this.issue = issue;
  }
}, Encoding = class extends IssueNodeImpl {
  _tag = "Encoding";
  ast;
  issue;
  constructor(ast, issue, input, options) {
    super(input, options);
    this.ast = ast, this.issue = issue;
  }
}, Pointer = class extends IssueNodeImpl {
  _tag = "Pointer";
  path;
  issue;
  constructor(path, issue) {
    super();
    this.path = path, this.issue = issue;
  }
}, MissingKey = class extends IssueNodeImpl {
  _tag = "MissingKey";
  annotations;
  constructor(annotations) {
    super();
    this.annotations = annotations;
  }
}, UnexpectedKey = class extends IssueNodeImpl {
  _tag = "UnexpectedKey";
  ast;
  constructor(ast, input, options) {
    super(input, options);
    this.ast = ast;
  }
}, Composite = class extends IssueNodeImpl {
  _tag = "Composite";
  ast;
  issues;
  constructor(ast, issues, input, options) {
    super(input, options);
    this.ast = ast, this.issues = issues;
  }
}, InvalidType = class extends IssueNodeImpl {
  _tag = "InvalidType";
  ast;
  constructor(ast, input, options) {
    super(input, options);
    this.ast = ast;
  }
}, InvalidValue = class extends IssueNodeImpl {
  _tag = "InvalidValue";
  annotations;
  constructor(annotations, input, options) {
    super(input, options);
    this.annotations = annotations;
  }
};
var Forbidden = class extends IssueNodeImpl {
  _tag = "Forbidden";
  annotations;
  constructor(annotations, input, options) {
    super(input, options);
    this.annotations = annotations;
  }
}, AnyOf = class extends IssueNodeImpl {
  _tag = "AnyOf";
  ast;
  issues;
  constructor(ast, issues, input, options) {
    super(input, options);
    this.ast = ast, this.issues = issues;
  }
}, OneOf = class extends IssueNodeImpl {
  _tag = "OneOf";
  ast;
  successes;
  constructor(ast, successes, input, options) {
    super(input, options);
    this.ast = ast, this.successes = successes;
  }
};
function makeFilterIssue(entry, input, options) {
  if (isIssue(entry))
    return entry;
  if (typeof entry === "string")
    return new InvalidValue({
      message: entry
    }, input, options);
  let inner = typeof entry.issue === "string" ? new InvalidValue({
    message: entry.issue
  }, input, options) : entry.issue;
  return new Pointer(entry.path, inner);
}
function makeSingle(out, input, options) {
  if (out === void 0)
    return;
  if (typeof out === "boolean")
    return out ? void 0 : new InvalidValue(void 0, input, options);
  return makeFilterIssue(out, input, options);
}
function normalizeFilterOutput(ast, out, input, options) {
  if (Array.isArray(out)) {
    if (!isReadonlyArrayNonEmpty(out))
      return;
    return out.length === 1 ? makeFilterIssue(out[0], input, options) : new Composite(ast, map2(out, (entry) => makeFilterIssue(entry, input, options)), input, options);
  }
  return makeSingle(out, input, options);
}
var defaultLeafHook = (issue) => {
  let message = findMessage(issue);
  if (message !== void 0)
    return message;
  switch (issue._tag) {
    case "InvalidType":
      return getExpectedMessage(getExpected(issue.ast), issue);
    case "InvalidValue": {
      let expected = findExpected(issue);
      if (expected !== void 0)
        return getExpectedMessage(expected, issue);
      let input = formatInput(issue);
      return input === void 0 ? "Expected a valid value" : `Invalid data ${input}`;
    }
    case "MissingKey":
      return "Missing key";
    case "UnexpectedKey": {
      let input = formatInput(issue);
      return input === void 0 ? "Expected no excess property" : `Unexpected key with value ${input}`;
    }
    case "Forbidden":
      return "Forbidden operation";
    case "OneOf": {
      let input = formatInput(issue);
      return input === void 0 ? "Expected exactly one member to match" : `Expected exactly one member to match the input ${input}`;
    }
  }
}, defaultCheckHook = (issue) => findMessage(issue.issue) ?? findMessage(issue);
function formatInput(issue) {
  return hasInput(issue) ? format(issue.input) : void 0;
}
function findExpected(issue) {
  let expected = issue.annotations?.expected;
  return typeof expected === "string" ? expected : void 0;
}
function getExpectedMessage(expected, issue) {
  let input = formatInput(issue);
  return input === void 0 ? `Expected ${expected}` : `Expected ${expected}, got ${input}`;
}
function formatCheck(check) {
  let expected = check.annotations?.expected;
  if (typeof expected === "string")
    return expected;
  switch (check._tag) {
    case "Filter":
      return "<filter>";
    case "FilterGroup":
      return check.checks.map((check) => formatCheck(check)).join(" & ");
  }
}
function makeFormatterDefault() {
  return (issue) => formatIssue(issue, "");
}
var defaultFormatter = /* @__PURE__ */ makeFormatterDefault();
function formatIssue(issue, path) {
  let message;
  switch (issue._tag) {
    case "Filter": {
      let annotated = defaultCheckHook(issue);
      if (annotated !== void 0)
        message = annotated;
      else {
        if (issue.issue._tag !== "InvalidValue")
          return formatIssue(issue.issue, path);
        let expected = findExpected(issue.issue);
        message = expected === void 0 ? getExpectedMessage(formatCheck(issue.filter), issue) : getExpectedMessage(expected, issue.issue);
      }
      break;
    }
    case "Encoding":
      return formatIssue(issue.issue, path);
    case "Pointer":
      return formatIssue(issue.issue, path + formatPath(issue.path));
    case "Composite":
    case "AnyOf": {
      if (issue._tag === "Composite" || issue.issues.length > 0)
        return issue.issues.map((issue) => formatIssue(issue, path)).join(`
`);
      message = findMessage(issue) ?? getExpectedMessage(getExpected(issue.ast), issue);
      break;
    }
    default:
      message = defaultLeafHook(issue);
      break;
  }
  return path ? `${message}
  at ${path}` : message;
}
function findMessage(issue) {
  if (issue._tag === "Pointer")
    return;
  if (issue._tag === "Encoding")
    return findMessage(issue.issue);
  let message = (issue._tag === "Filter" ? issue.filter.annotations : ("annotations" in issue) ? issue.annotations : issue.ast.annotations)?.[issue._tag === "MissingKey" ? "messageMissingKey" : issue._tag === "UnexpectedKey" ? "messageUnexpectedKey" : "message"];
  if (typeof message === "string")
    return message;
}

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/internal/schema/cause.js
function getSchemaIssue(cause) {
  let issue;
  for (let reason of cause.reasons) {
    if (!isFailReason2(reason) || !isIssue(reason.error))
      return;
    issue ??= reason.error;
  }
  return issue;
}
function getSchemaIssueOrThrow(cause, message) {
  let issue = getSchemaIssue(cause);
  if (issue === void 0)
    throw Error(message, {
      cause
    });
  return issue;
}

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/SchemaGetter.js
var makeGetter = (fields) => Object.assign(Object.create(Prototype), fields);
function fail6(f) {
  return transformOptionalEffect((oe, options) => fail5(f(oe, options)));
}
function forbidden(message) {
  return fail6((oe, options) => {
    let annotations = {
      message: message(oe)
    };
    return isSome2(oe) ? new Forbidden(annotations, oe.value, options) : new Forbidden(annotations);
  });
}
var forbiddenEncoding = /* @__PURE__ */ forbidden(() => "Encoding is not supported"), passthrough_ = /* @__PURE__ */ makeGetter({
  _tag: "Passthrough"
});
function passthrough() {
  return passthrough_;
}
function transform(f) {
  return makeGetter({
    _tag: "Transform",
    transform: f
  });
}
function transformEffect(f) {
  return makeGetter({
    _tag: "TransformEffect",
    transform: f
  });
}
function transformOptional(f) {
  return makeGetter({
    _tag: "TransformOptional",
    transform: f
  });
}
function transformOptionalEffect(f) {
  return makeGetter({
    _tag: "TransformOptionalEffect",
    transform: f
  });
}
function String3() {
  return transform(globalThis.String);
}
function Number3() {
  return transform(globalThis.Number);
}
function trim2() {
  return transform(trim);
}
function parseJson(options) {
  return transformEffect((input, parseOptions) => try_2({
    try: () => JSON.parse(input, options?.reviver),
    catch: () => new InvalidValue({
      expected: "a valid JSON string"
    }, input, parseOptions)
  }));
}
function stringifyJson(options) {
  return transformEffect((input, parseOptions) => try_2({
    try: () => {
      let output = JSON.stringify(input, options?.replacer, options?.space);
      if (output === void 0)
        throw TypeError("Value cannot be represented as JSON");
      return output;
    },
    catch: () => new InvalidValue({
      expected: "a JSON-serializable value"
    }, input, parseOptions)
  }));
}
function encodeBase64() {
  return transform(encode);
}
function decodeBase64() {
  return transformEffect((input, options) => mapErrorEager2(fromResult2(decode(input)), () => new InvalidValue({
    expected: "a valid Base64 string"
  }, input, options)));
}

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/SchemaTransformation.js
var TypeId6 = "~effect/SchemaTransformation/Transformation", Transformation = class extends Class {
  [TypeId6] = TypeId6;
  _tag = "Transformation";
  decode;
  encode;
  constructor(decode, encode) {
    super();
    this.decode = decode, this.encode = encode;
  }
  flip() {
    return new Transformation(this.encode, this.decode);
  }
};
function isTransformation(u) {
  return hasProperty(u, TypeId6) && u[TypeId6] === TypeId6;
}
var makeTransformation = (options) => {
  if (isTransformation(options))
    return options;
  return new Transformation(options.decode, options.encode);
};
function transformEffect2(options) {
  return new Transformation(transformEffect(options.decode), transformEffect(options.encode));
}
function transform2(options) {
  return new Transformation(transform(options.decode), transform(options.encode));
}
function trim3() {
  return new Transformation(trim2(), passthrough());
}
var passthrough_2 = /* @__PURE__ */ new Transformation(/* @__PURE__ */ passthrough(), /* @__PURE__ */ passthrough());
function passthrough2() {
  return passthrough_2;
}
var numberFromString = /* @__PURE__ */ new Transformation(/* @__PURE__ */ Number3(), /* @__PURE__ */ String3());
var isJsonError = (input) => isObject(input) && typeof input.message === "string", decodeJsonError = (input) => {
  let err = Object.hasOwn(input, "cause") ? Error(input.message, {
    cause: decodeDefect(input.cause)
  }) : Error(input.message);
  if (typeof input.name === "string" && input.name !== "Error")
    err.name = input.name;
  if (typeof input.stack === "string")
    err.stack = input.stack;
  return err;
}, encodeUnknownAsJson = (input) => {
  try {
    let json = formatJson(input);
    return json === void 0 ? format(input) : JSON.parse(json);
  } catch {
    return format(input);
  }
}, encodeJsonError = (input, options, encodeDefect) => {
  let encoded = {
    name: input.name,
    message: typeof input.message === "string" ? input.message : ""
  };
  if (options?.includeStack && typeof input.stack === "string")
    encoded.stack = input.stack;
  if (!options?.excludeCause && input.cause !== void 0)
    encoded.cause = encodeDefect(input.cause);
  return encoded;
}, makeEncodeDefect = (options) => {
  let seen = /* @__PURE__ */ new WeakSet, encode = (input) => {
    if (isError(input)) {
      if (seen.has(input))
        return "[Circular]";
      seen.add(input);
      let encoded = encodeJsonError(input, options, encode);
      return seen.delete(input), encoded;
    }
    return encodeUnknownAsJson(input);
  };
  return encode;
}, decodeDefect = (input) => isJsonError(input) ? decodeJsonError(input) : input;
var defectFromJson = (options) => transform2({
  decode: decodeDefect,
  encode: makeEncodeDefect(options)
});
var urlFromString = /* @__PURE__ */ transformEffect2({
  decode: (s, options) => URL.canParse(s) ? succeed5(new URL(s)) : fail5(new InvalidValue({
    expected: "a valid URL string"
  }, s, options)),
  encode: (url) => succeed5(url.href)
});
var uint8ArrayFromBase64String = /* @__PURE__ */ new Transformation(/* @__PURE__ */ decodeBase64(), /* @__PURE__ */ encodeBase64());
function fromJsonString(options) {
  return new Transformation(parseJson(options ?? {}), stringifyJson(options));
}

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/SchemaAST.js
function makeGuard(tag) {
  return (ast) => ast._tag === tag;
}
var isDeclaration = /* @__PURE__ */ makeGuard("Declaration");
var isNever2 = /* @__PURE__ */ makeGuard("Never");
var isLiteral = /* @__PURE__ */ makeGuard("Literal"), isUniqueSymbol = /* @__PURE__ */ makeGuard("UniqueSymbol");
var isArrays = /* @__PURE__ */ makeGuard("Arrays"), isObjects = /* @__PURE__ */ makeGuard("Objects"), isUnion = /* @__PURE__ */ makeGuard("Union"), isSuspend = /* @__PURE__ */ makeGuard("Suspend"), Link = class {
  to;
  transformation;
  constructor(to, transformation) {
    this.to = to, this.transformation = transformation;
  }
}, defaultParseOptions = {}, Context = class {
  isOptional;
  isMutable;
  constructorDefault;
  annotations;
  constructor(isOptional, isMutable, constructorDefault = void 0, annotations = void 0) {
    this.isOptional = isOptional, this.isMutable = isMutable, this.constructorDefault = constructorDefault, this.annotations = annotations;
  }
}, TypeId7 = "~effect/Schema";

class ASTNodeImpl {
  [TypeId7] = TypeId7;
  annotations;
  checks;
  encoding;
  context;
  constructor(annotations = void 0, checks = void 0, encoding = void 0, context = void 0) {
    this.annotations = annotations, this.checks = checks, this.encoding = encoding, this.context = context;
  }
  toString() {
    return `<${this._tag}>`;
  }
}
var Declaration = class extends ASTNodeImpl {
  _tag = "Declaration";
  typeParameters;
  run;
  encodingChecks;
  encodingRun;
  constructor(typeParameters, run, annotations, checks, encoding, context, encodingChecks, encodingRun) {
    super(annotations, checks, encoding, context);
    this.typeParameters = typeParameters, this.run = run, this.encodingChecks = encodingChecks, this.encodingRun = encodingRun;
  }
  getParser() {
    let run;
    return (input, options) => {
      if (input === missing)
        return missingExit;
      return (run ??= this.run(this.typeParameters))(input, this, options);
    };
  }
  _rebuild(recur, checks, encodingChecks, run, encodingRun) {
    let tps = mapOrSame(this.typeParameters, recur);
    return tps === this.typeParameters && checks === this.checks && encodingChecks === this.encodingChecks && run === this.run && encodingRun === this.encodingRun ? this : new Declaration(tps, run, this.annotations, checks, void 0, this.context, encodingChecks, encodingRun);
  }
  recur(recur) {
    return this._rebuild(recur, this.checks, this.encodingChecks, this.run, this.encodingRun);
  }
  flip(recur) {
    return this._rebuild(recur, this.encodingChecks, this.checks, this.encodingRun ?? this.run, this.run);
  }
  getExpected() {
    let expected = this.annotations?.expected;
    if (typeof expected === "string")
      return expected;
    return "<Declaration>";
  }
}, Null = class extends ASTNodeImpl {
  _tag = "Null";
  getParser() {
    return fromConst(this, null);
  }
  getExpected() {
    return "null";
  }
}, null_ = /* @__PURE__ */ new Null;
var Undefined = class extends ASTNodeImpl {
  _tag = "Undefined";
  getParser() {
    return fromConst(this, void 0);
  }
  toCodecJson() {
    return replaceEncoding(this, [undefinedToNull]);
  }
  getExpected() {
    return "undefined";
  }
}, undefinedToNull = /* @__PURE__ */ new Link(null_, /* @__PURE__ */ new Transformation(/* @__PURE__ */ transform(() => {
  return;
}), /* @__PURE__ */ transform(() => null))), undefined_2 = /* @__PURE__ */ new Undefined;
var Any = class extends ASTNodeImpl {
  _tag = "Any";
  getParser() {
    return fromRefinement(this, isUnknown);
  }
  getExpected() {
    return "any";
  }
}, any = /* @__PURE__ */ new Any, Unknown = class extends ASTNodeImpl {
  _tag = "Unknown";
  getParser() {
    return fromRefinement(this, isUnknown);
  }
  getExpected() {
    return "unknown";
  }
}, unknown = /* @__PURE__ */ new Unknown;
var Literal = class extends ASTNodeImpl {
  _tag = "Literal";
  literal;
  constructor(literal, annotations, checks, encoding, context) {
    super(annotations, checks, encoding, context);
    if (typeof literal === "number" && !globalThis.Number.isFinite(literal))
      throw Error(`A numeric literal must be finite, got ${format(literal)}`);
    this.literal = literal;
  }
  getParser() {
    return fromConst(this, this.literal);
  }
  matchPart(s, _options) {
    return s === globalThis.String(this.literal) ? this.literal : void 0;
  }
  toCodecJson() {
    return typeof this.literal === "bigint" ? literalToString(this) : this;
  }
  toCodecStringTree() {
    return typeof this.literal === "string" ? this : literalToString(this);
  }
  getExpected() {
    return typeof this.literal === "string" ? JSON.stringify(this.literal) : globalThis.String(this.literal);
  }
};
function literalToString(ast) {
  let literalAsString = globalThis.String(ast.literal);
  return replaceEncoding(ast, [new Link(new Literal(literalAsString), new Transformation(transform(() => ast.literal), transform(() => literalAsString)))]);
}
var String4 = class extends ASTNodeImpl {
  _tag = "String";
  getParser() {
    return fromRefinement(this, isString);
  }
  matchPart(s, options) {
    let checks = this.checks;
    return checks && !options.disableChecks && collectIssues(checks, s, void 0, this, options) ? void 0 : s;
  }
  getExpected() {
    return "string";
  }
}, string2 = /* @__PURE__ */ new String4, Number4 = class extends ASTNodeImpl {
  _tag = "Number";
  getParser() {
    return fromRefinement(this, isNumber);
  }
  matchKey(s, options) {
    return this._match(isStringNumberRegExp, s, options);
  }
  matchPart(s, options) {
    return this._match(isStringFiniteRegExp, s, options);
  }
  _match(regexp, s, options) {
    if (!regexp.test(s))
      return;
    let value = globalThis.Number(s);
    if (options.disableChecks || !this.checks)
      return value;
    return collectIssues(this.checks, value, void 0, this, options) ? void 0 : value;
  }
  toCodecJson() {
    if (this.checks && (hasCheck(this.checks, "effect/schema/isFinite") || hasCheck(this.checks, "effect/schema/isInt")))
      return this;
    return replaceEncoding(this, [numberToJson]);
  }
  toCodecStringTree() {
    if (this.toCodecJson() === this)
      return replaceEncoding(this, [finiteToString]);
    return replaceEncoding(this, [numberToString]);
  }
  getExpected() {
    return "number";
  }
};
function hasCheck(checks, id) {
  return checks.some((check) => check.annotations?.representation?.id === id || check._tag === "FilterGroup" && hasCheck(check.checks, id));
}
var number2 = /* @__PURE__ */ new Number4, Boolean2 = class extends ASTNodeImpl {
  _tag = "Boolean";
  getParser() {
    return fromRefinement(this, isBoolean);
  }
  getExpected() {
    return "boolean";
  }
}, boolean = /* @__PURE__ */ new Boolean2;
var Arrays = class extends ASTNodeImpl {
  _tag = "Arrays";
  isMutable;
  elements;
  rest;
  encodingChecks;
  constructor(isMutable, elements, rest, annotations, checks, encoding, context, encodingChecks) {
    super(annotations, checks, encoding, context);
    this.isMutable = isMutable, this.elements = elements, this.rest = rest, this.encodingChecks = encodingChecks;
    let hasOptional = !1;
    for (let i = 0;i < elements.length; i++)
      if (isOptional(elements[i]))
        hasOptional = !0;
      else if (hasOptional)
        throw Error("A required element cannot follow an optional element. ts(1257)");
    if (hasOptional && rest.length > 1)
      throw Error("A required element cannot follow an optional element. ts(1257)");
    for (let i = 1;i < rest.length; i++)
      if (isOptional(rest[i]))
        throw Error("An optional element cannot follow a rest element. ts(1266)");
  }
  getParser(compile, compileField = compile) {
    let ast = this, elements, rest, elementLen = ast.elements.length, tailLen = Math.max(0, ast.rest.length - 1);
    function getParser(tailThreshold, index) {
      if (index < elementLen)
        return elements[index];
      else if (index >= tailThreshold)
        return rest[index - tailThreshold + 1];
      return rest[0];
    }
    let finish = (state) => {
      let {
        input,
        len,
        options
      } = state;
      if (ast.rest.length === 0 && len > elementLen)
        for (let i = elementLen;i < len; i++) {
          let unexpected = new UnexpectedKey(ast, input[i], options), issue = new Pointer([i], unexpected);
          if (options.errors === "all")
            if (state.issues)
              state.issues.push(issue);
            else
              state.issues = [issue];
          else
            return fail5(new Composite(ast, [issue], input, options));
        }
      if (state.issues)
        return fail5(new Composite(ast, state.issues, input, options));
      return succeed6(state.output);
    }, parse = (input, options) => {
      let len = input.length, state = {
        ast,
        getParser,
        input,
        len,
        tailThreshold: Math.max(elementLen, len - tailLen),
        output: new globalThis.Array(len),
        issues: void 0,
        options
      }, end = ast.rest.length === 0 ? elementLen : Math.max(len, elementLen + tailLen), concurrency = options.concurrency === void 0 ? 1 : resolveConcurrency(options.concurrency), eff = concurrency === 1 ? parseArray(state, input, 0, end) : parseArrayConcurrent(state, input, {
        concurrency,
        end
      });
      if (!eff)
        return finish(state);
      if (effectIsExit(eff))
        return flatMapEager2(eff, () => finish(state));
      let first = !0;
      return suspend2(() => {
        if (!first)
          return parse(input, options);
        return first = !1, flatMap2(eff, () => finish(state));
      });
    };
    return (input, options) => {
      if (input === missing)
        return missingExit;
      try {
        if (!Array.isArray(input))
          return fail5(new InvalidType(ast, input, options));
        if (!elements)
          elements = ast.elements.map((ast) => ({
            ast,
            parser: compileField(ast)
          })), rest = ast.rest.map((ast) => ({
            ast,
            parser: compileField(ast)
          }));
        return parse(input, options);
      } catch (error) {
        return die3(error);
      }
    };
  }
  _rebuild(recur, checks, encodingChecks) {
    let elements = mapOrSame(this.elements, recur), rest = mapOrSame(this.rest, recur);
    return elements === this.elements && rest === this.rest && checks === this.checks && encodingChecks === this.encodingChecks ? this : new Arrays(this.isMutable, elements, rest, this.annotations, checks, void 0, this.context, encodingChecks);
  }
  recur(recur) {
    return this._rebuild(recur, this.checks, this.encodingChecks);
  }
  flip(recur) {
    return this._rebuild(recur, this.encodingChecks, this.checks);
  }
  getExpected() {
    return "array";
  }
};
function stepArray(s, item, exit, i) {
  if (exit._tag === "Failure")
    return wrapPropertyKeyIssue(s, s.ast, i, exit);
  let value = exit === sameExit ? item : exit[args];
  if (value !== missing)
    s.output[i] = value;
  else {
    let p = s.getParser(s.tailThreshold, i);
    if (isOptional(p.ast))
      return;
    let issue = new Pointer([i], new MissingKey(p.ast.context?.annotations));
    if (s.options.errors === "all")
      if (s.issues)
        s.issues.push(issue);
      else
        s.issues = [issue];
    else
      return fail4(new Composite(s.ast, [issue], s.input, s.options));
  }
}
var parseArrayOptions = {
  onItem(s, item, i) {
    let value = i < s.len ? item : missing;
    return s.getParser(s.tailThreshold, i).parser(value, s.options);
  },
  step: stepArray
}, parseArray = /* @__PURE__ */ iterateEager()(parseArrayOptions), parseArrayConcurrent = /* @__PURE__ */ iterateConcurrent()(parseArrayOptions), wrapPropertyKeyIssue = (s, ast, key, exit) => {
  if (exit.cause.reasons.length === 0)
    return exit;
  let issue = getSchemaIssue(exit.cause);
  if (issue === void 0)
    return failCause2(map4(exit.cause, (issue) => new Composite(ast, [new Pointer([key], issue)], s.input, s.options)));
  let pointer = new Pointer([key], issue);
  if (s.options.errors === "all")
    if (s.issues)
      s.issues.push(pointer);
    else
      s.issues = [pointer];
  else
    return fail4(new Composite(ast, [pointer], s.input, s.options));
}, FINITE_PATTERN = "[+-]?\\d*\\.?\\d+(?:[Ee][+-]?\\d+)?";
function getIndexSignatureKeys(input, parameter, options = defaultParseOptions) {
  let stringKeys, symbolKeys;
  function go(parameter) {
    switch (parameter._tag) {
      case "String":
      case "TemplateLiteral":
        return (stringKeys ??= Object.keys(input)).filter((k) => parameter.matchPart(k, options) !== void 0);
      case "Number":
        return (stringKeys ??= Object.keys(input)).filter((k) => parameter.matchKey(k, options) !== void 0);
      case "Symbol":
        return (symbolKeys ??= Object.getOwnPropertySymbols(input)).filter((k) => Object.prototype.propertyIsEnumerable.call(input, k) && parameter.matchKey(k, options) !== void 0);
      case "Union":
        return [...new Set(parameter.types.flatMap(go))];
      default:
        return [];
    }
  }
  return go(parameterFromPropertyKey(toEncoded(parameter)));
}
var PropertySignature = class {
  name;
  type;
  constructor(name, type) {
    this.name = name, this.type = type;
  }
};
function isIndexSignatureParameterSide(ast) {
  switch (ast._tag) {
    case "String":
    case "Number":
    case "Symbol":
    case "TemplateLiteral":
      return !0;
    case "Union":
      return ast.types.every(isIndexSignatureParameterSide);
    default:
      return !1;
  }
}
function isIndexSignatureParameterEncodedSide(ast) {
  let encoded = getLastEncoding(ast);
  switch (encoded._tag) {
    case "String":
    case "Number":
    case "Symbol":
    case "TemplateLiteral":
      return !0;
    case "Union":
      return encoded.types.every(isIndexSignatureParameterEncodedSide);
    default:
      return !1;
  }
}
function isIndexSignatureParameter(ast) {
  return isIndexSignatureParameterSide(ast) && isIndexSignatureParameterEncodedSide(ast);
}
var IndexSignature = class {
  parameter;
  type;
  constructor(parameter, type) {
    if (!isIndexSignatureParameter(parameter))
      throw Error(`Invalid index signature parameter ${parameter._tag}`);
    if (this.parameter = parameter, this.type = type, isOptional(type) && !containsUndefined(type))
      throw Error("Cannot use `Schema.optionalKey` with index signatures, use `Schema.optional` instead.");
  }
}, Objects = class extends ASTNodeImpl {
  _tag = "Objects";
  propertySignatures;
  indexSignatures;
  encodingChecks;
  constructor(propertySignatures, indexSignatures, annotations, checks, encoding, context, encodingChecks) {
    super(annotations, checks, encoding, context);
    this.propertySignatures = propertySignatures, this.indexSignatures = indexSignatures, this.encodingChecks = encodingChecks;
  }
  getParser(compile, compileField = compile) {
    let ast = this, hasProperties = ast.propertySignatures.length, indexCount = ast.indexSignatures.length;
    if (!hasProperties && !indexCount)
      return fromRefinement(ast, isNotNullish);
    let properties, indexes, compileMembers = () => {
      if (!properties)
        properties = ast.propertySignatures.map((ps) => ({
          parser: compileField(ps.type),
          name: ps.name,
          type: ps.type
        })), indexes = indexCount ? ast.indexSignatures.map((is) => ({
          is,
          parserKey: compile(parameterFromPropertyKey(is.parameter)),
          parserValue: compileField(is.type)
        })) : void 0;
      return properties;
    }, makeFallback = () => {
      let expectedKeys = new Set(ast.propertySignatures.map((ps) => typeof ps.name === "number" ? globalThis.String(ps.name) : ps.name)), finishIndex = (s, key, k2, inputValue, exitValue) => {
        if (exitValue._tag === "Failure")
          return wrapPropertyKeyIssue(s, ast, key, exitValue) ?? void_2;
        let value = exitValue === sameExit ? inputValue : exitValue[args];
        if (k2 !== missing && value !== missing) {
          if (hasProperties && (expectedKeys.has(key) || expectedKeys.has(typeof k2 === "number" ? globalThis.String(k2) : k2)))
            return void_2;
          assignProperty(s.out, k2, value);
        }
        return void_2;
      }, parseIndex = (s, key, index, exitKey) => {
        if (!exitKey) {
          let eff = index.parserKey(key, s.options);
          if (!effectIsExit(eff))
            return flatMap2(exit2(eff), (exit) => parseIndex(s, key, index, exit));
          exitKey = eff;
        }
        if (exitKey._tag === "Failure")
          return wrapPropertyKeyIssue(s, ast, key, exitKey) ?? void_2;
        let k2 = exitKey === sameExit ? key : exitKey[args], inputValue = s.input[key], result = index.parserValue(inputValue, s.options);
        return effectIsExit(result) ? finishIndex(s, key, k2, inputValue, result) : flatMap2(exit2(result), (exit) => finishIndex(s, key, k2, inputValue, exit));
      }, parseStringIndex = (s, key, index) => {
        let inputValue = s.input[key], result = index.parserValue(inputValue, s.options);
        return effectIsExit(result) ? finishIndex(s, key, key, inputValue, result) : flatMap2(exit2(result), (exit) => finishIndex(s, key, key, inputValue, exit));
      }, parseIndexes = indexCount ? iterateConcurrent()({
        onItem: (s, [key, index]) => index.is.parameter === string2 ? parseStringIndex(s, key, index) : parseIndex(s, key, index),
        step: (_s, _item, exit) => exit._tag === "Failure" ? exit : void 0
      }) : void 0;
      return fnUntracedEager2(function* (input, options) {
        if (input === missing)
          return missing;
        if (!(typeof input === "object" && input !== null && !Array.isArray(input)))
          return yield* fail5(new InvalidType(ast, input, options));
        compileMembers();
        let record = input, out = {}, state = {
          ast,
          input: record,
          out,
          issues: void 0,
          options
        }, errorsAllOption = options.errors === "all", onExcessPropertyError = options.onExcessProperty === "error", concurrency = options.concurrency === void 0 ? 1 : resolveConcurrency(options.concurrency), indexKeys = indexCount && onExcessPropertyError ? ast.indexSignatures.map((index) => getIndexSignatureKeys(record, index.parameter, options)) : void 0;
        if (onExcessPropertyError) {
          let coveredKeys = indexKeys ? new Set(expectedKeys) : expectedKeys;
          if (indexKeys)
            for (let keys of indexKeys)
              for (let key of keys)
                coveredKeys.add(key);
          let inputKeys = Reflect.ownKeys(record);
          for (let i = 0;i < inputKeys.length; i++) {
            let key = inputKeys[i];
            if (!coveredKeys.has(key) && Object.prototype.propertyIsEnumerable.call(record, key)) {
              let unexpected = new UnexpectedKey(ast, record[key], options), issue = new Pointer([key], unexpected);
              if (errorsAllOption) {
                if (state.issues)
                  state.issues.push(issue);
                else
                  state.issues = [issue];
                continue;
              } else
                return yield* fail5(new Composite(ast, [issue], input, options));
            }
          }
        }
        if (hasProperties) {
          let eff = concurrency === 1 ? parseProperties(state, properties) : parsePropertiesConcurrent(state, properties, {
            concurrency
          });
          if (eff)
            yield* eff;
        }
        if (indexCount && concurrency === 1)
          for (let i = 0;i < indexCount; i++) {
            let index = indexes[i], parse = index.is.parameter === string2 ? parseStringIndex : parseIndex, keys = indexKeys?.[i] ?? (index.is.parameter === string2 ? Object.keys(record) : getIndexSignatureKeys(record, index.is.parameter, options));
            for (let j = 0;j < keys.length; j++) {
              let eff = parse(state, keys[j], index);
              if (!effectIsExit(eff))
                yield* eff;
              else if (eff._tag === "Failure")
                return yield* eff;
            }
          }
        else if (parseIndexes) {
          let keyPairs = empty2();
          for (let i = 0;i < indexCount; i++) {
            let index = indexes[i], keys = indexKeys?.[i] ?? (index.is.parameter === string2 ? Object.keys(record) : getIndexSignatureKeys(record, index.is.parameter, options));
            for (let j = 0;j < keys.length; j++)
              keyPairs.push([keys[j], index]);
          }
          let eff = parseIndexes(state, keyPairs, {
            concurrency
          });
          if (eff)
            yield* eff;
        }
        if (state.issues)
          return yield* fail5(new Composite(ast, state.issues, input, options));
        return out;
      });
    };
    if (indexCount)
      return makeFallback();
    let fallback, resume = (state, index, pending) => {
      let property = properties[index];
      return flatMap2(exit2(pending), (exit) => {
        let terminal = stepProperty(state, property, exit);
        if (terminal)
          return terminal;
        let done = () => succeed6(state.out), eff = parseProperties(state, properties.slice(index + 1));
        return eff ? flatMapEager2(eff, done) : done();
      });
    };
    return (input, options) => {
      if (input === missing)
        return missingExit;
      if (options.errors === "all" || options.onExcessProperty !== void 0 || options.concurrency !== void 0 && resolveConcurrency(options.concurrency) !== 1)
        return (fallback ??= makeFallback())(input, options);
      if (!(typeof input === "object" && input !== null && !Array.isArray(input)))
        return fail5(new InvalidType(ast, input, options));
      let props = compileMembers(), record = input, out = {}, state = {
        ast,
        input: record,
        out,
        issues: void 0,
        options
      };
      try {
        for (let index = 0;index < props.length; index++) {
          let property = props[index], name = property.name, hasKey = hasPropertySignature(record, name), value = hasKey ? record[name] : missing, exit = property.parser(value, options);
          if (!effectIsExit(exit))
            return resume(state, index, exit);
          if (exit === sameExit) {
            if (hasKey)
              assignProperty(out, name, value);
            continue;
          }
          let terminal = stepProperty(state, property, exit);
          if (terminal)
            return terminal;
        }
      } catch (error) {
        return die3(error);
      }
      return succeed6(out);
    };
  }
  _rebuild(recur, recurParameter, checks, encodingChecks) {
    let props = mapOrSame(this.propertySignatures, (ps) => {
      let t = recur(ps.type);
      return t === ps.type ? ps : new PropertySignature(ps.name, t);
    }), indexes = mapOrSame(this.indexSignatures, (is) => {
      let p = recurParameter(is.parameter), t = recur(is.type);
      return p === is.parameter && t === is.type ? is : new IndexSignature(p, t);
    });
    return props === this.propertySignatures && indexes === this.indexSignatures && checks === this.checks && encodingChecks === this.encodingChecks ? this : new Objects(props, indexes, this.annotations, checks, void 0, this.context, encodingChecks);
  }
  flip(recur) {
    return this._rebuild(recur, recur, this.encodingChecks, this.checks);
  }
  recur(recur, recurParameter = recur) {
    return this._rebuild(recur, recurParameter, this.checks, this.encodingChecks);
  }
  getExpected() {
    if (this.propertySignatures.length === 0 && this.indexSignatures.length === 0)
      return "object | array";
    return "object";
  }
};
function stepProperty(s, p, exit) {
  if (exit._tag === "Failure")
    return wrapPropertyKeyIssue(s, s.ast, p.name, exit);
  if (exit === sameExit)
    return;
  let value = exit[args];
  if (value !== missing) {
    assignProperty(s.out, p.name, value);
    return;
  }
  if (delete s.out[p.name], !isOptional(p.type)) {
    let issue = new Pointer([p.name], new MissingKey(p.type.context?.annotations));
    if (s.options.errors === "all") {
      if (s.issues)
        s.issues.push(issue);
      else
        s.issues = [issue];
      return;
    } else
      return fail4(new Composite(s.ast, [issue], s.input, s.options));
  }
}
var parsePropertiesOptions = {
  onItem(s, p) {
    if (!hasPropertySignature(s.input, p.name))
      return p.parser(missing, s.options);
    let value = s.input[p.name];
    return assignProperty(s.out, p.name, value), p.parser(value, s.options);
  },
  step: stepProperty
}, parseProperties = /* @__PURE__ */ iterateEager()(parsePropertiesOptions), parsePropertiesConcurrent = /* @__PURE__ */ iterateConcurrent()(parsePropertiesOptions);
function combineChecks(a, b) {
  if (!a)
    return b;
  if (!b)
    return a;
  return [...a, ...b];
}
function struct(fields, checks, annotations) {
  return new Objects(Reflect.ownKeys(fields).map((key) => new PropertySignature(key, fields[key].ast)), [], annotations, checks);
}
function getAST(self) {
  return self.ast;
}
function tuple(elements, checks = void 0) {
  return new Arrays(!1, elements.map((e) => e.ast), [], void 0, checks);
}
function union(members, options, checks) {
  return new Union(members.map(getAST), options, void 0, checks);
}
function structWithRest(ast, records) {
  if (ast.encoding || records.some((r) => r.encoding))
    throw Error("StructWithRest does not support encodings");
  let { propertySignatures, indexSignatures, checks } = ast;
  for (let record of records) {
    for (let propertySignature of record.propertySignatures)
      if (propertySignatures.some((ps) => ps.name === propertySignature.name))
        throw Error(`Duplicate identifier: ${JSON.stringify(propertySignature.name)}. ts(2300)`);
    propertySignatures = propertySignatures.concat(record.propertySignatures), indexSignatures = indexSignatures.concat(record.indexSignatures), checks = combineChecks(checks, record.checks);
  }
  return new Objects(propertySignatures, indexSignatures, void 0, checks);
}
var toCandidate = /* @__PURE__ */ memoizeIdempotent((ast) => {
  while (!0) {
    if (isSuspend(ast))
      return unknown;
    let encoding = ast.encoding;
    if (!encoding)
      return ast.recur?.(toCandidate, identity) ?? ast;
    if (encoding.some((link) => link.transformation._tag === "Middleware" && link.transformation.decode !== identity))
      return unknown;
    ast = encoding[encoding.length - 1].to;
  }
});
function getCandidateTypes(ast) {
  switch (ast._tag) {
    case "Null":
      return ["null"];
    case "Undefined":
      return ["undefined"];
    case "String":
    case "TemplateLiteral":
      return ["string"];
    case "Number":
      return ["number"];
    case "Boolean":
      return ["boolean"];
    case "Symbol":
    case "UniqueSymbol":
      return ["symbol"];
    case "BigInt":
      return ["bigint"];
    case "Arrays":
      return ["array"];
    case "ObjectKeyword":
      return ["object", "array", "function"];
    case "Objects":
      return ast.propertySignatures.length || ast.indexSignatures.length ? ["object"] : ["string", "number", "boolean", "symbol", "bigint", "object", "array", "function"];
    case "Enum":
      return Array.from(new Set(ast.enums.map(([, v]) => typeof v)));
    case "Literal":
      return [typeof ast.literal];
    case "Union":
      return Array.from(new Set(ast.types.flatMap(getCandidateTypes)));
    default:
      return ["null", "undefined", "string", "number", "boolean", "symbol", "bigint", "object", "array", "function"];
  }
}
function collectSentinels(ast) {
  switch (ast._tag) {
    default:
      return [];
    case "Declaration": {
      let s = ast.annotations?.[SENTINELS_ANNOTATION_KEY];
      return Array.isArray(s) ? s : [];
    }
    case "Objects":
      return ast.propertySignatures.flatMap((ps) => {
        let type = ps.type;
        if (!isOptional(type)) {
          if (isLiteral(type))
            return [{
              key: ps.name,
              literal: type.literal
            }];
          if (isUniqueSymbol(type))
            return [{
              key: ps.name,
              literal: type.symbol
            }];
        }
        return [];
      });
    case "Arrays":
      return ast.elements.flatMap((e, i) => {
        if (!isOptional(e)) {
          if (isLiteral(e))
            return [{
              key: i,
              literal: e.literal
            }];
          if (isUniqueSymbol(e))
            return [{
              key: i,
              literal: e.symbol
            }];
        }
        return [];
      });
    case "Union": {
      if (ast.types.length === 0)
        return [];
      let members = ast.types.map((type) => collectSentinels(toCandidate(type)));
      return members[0].filter((s) => members.every((sentinels) => sentinels.some((o) => o.key === s.key && o.literal === s.literal)));
    }
    case "Suspend":
      return collectSentinels(ast.thunk());
  }
}
var candidateIndexCache = /* @__PURE__ */ new WeakMap, emptyCandidates = /* @__PURE__ */ Object.freeze([]), getRuntimeType = (input) => input === null ? "null" : Array.isArray(input) ? "array" : typeof input, hasPropertySignature = (input, key) => key === "__proto__" ? Object.hasOwn(input, key) : (key in input);
function getCandidateIndex(types) {
  let index = candidateIndexCache.get(types);
  if (index)
    return index;
  let bySentinel, sentinelCandidateCount = 0, otherwise, literalCandidates, onlyLiterals = !0, literalOf = [];
  for (let i = 0;i < types.length; i++) {
    let a = types[i], encoded = toCandidate(a);
    if (isNever2(encoded))
      continue;
    if (isLiteral(encoded) || isUniqueSymbol(encoded)) {
      literalCandidates ??= /* @__PURE__ */ new Map;
      let literal = isLiteral(encoded) ? encoded.literal : encoded.symbol;
      literalOf[i] = literal;
      let arr = literalCandidates.get(literal);
      if (!arr)
        literalCandidates.set(literal, arr = []);
      arr.push(i);
    } else
      onlyLiterals = !1;
    let sentinels = collectSentinels(encoded);
    if (sentinels.length) {
      bySentinel ??= /* @__PURE__ */ new Map, sentinelCandidateCount++;
      for (let {
        key,
        literal
      } of sentinels) {
        let entry = bySentinel.get(key);
        if (!entry)
          bySentinel.set(key, entry = [/* @__PURE__ */ new Map, /* @__PURE__ */ new Set]);
        entry[1].add(i);
        let indexes = entry[0].get(literal);
        if (!indexes)
          entry[0].set(literal, indexes = /* @__PURE__ */ new Set);
        indexes.add(i);
      }
    } else {
      otherwise ??= {};
      let candidateTypes = getCandidateTypes(encoded);
      for (let t of candidateTypes)
        (otherwise[t] ??= []).push(i);
    }
  }
  let fallbacks = {}, getFallback = (type) => fallbacks[type] ??= Object.freeze(otherwise?.[type] ?? emptyCandidates);
  if (onlyLiterals && literalCandidates)
    literalCandidates.forEach(Object.freeze), index = (input) => literalCandidates.get(input) ?? emptyCandidates;
  else if (bySentinel?.size === 1 && !otherwise) {
    let [key, [byValue]] = bySentinel.entries().next().value, candidates = /* @__PURE__ */ new Map;
    for (let [literal, indexes] of byValue)
      candidates.set(literal, Object.freeze(Array.from(indexes)));
    let all = Object.freeze(types.map((_, i) => i));
    index = (input, isConstructor) => {
      if (isObjectKeyword(input)) {
        let value = hasPropertySignature(input, key) ? input[key] : void 0;
        if (value !== void 0)
          return candidates.get(value) ?? emptyCandidates;
        if (isConstructor)
          return all;
      }
      return emptyCandidates;
    };
  } else if (bySentinel) {
    let commonSentinel;
    for (let entry of bySentinel)
      if ((!commonSentinel || entry[1][0].size > commonSentinel[1][0].size) && entry[1][1].size === sentinelCandidateCount)
        commonSentinel = entry;
    index = (input, isConstructor) => {
      let runtimeType = getRuntimeType(input);
      if (!isObjectKeyword(input))
        return getFallback(runtimeType);
      let selected = new Set(otherwise?.[runtimeType]), directKey;
      if (commonSentinel) {
        let [key, [byValue]] = commonSentinel, hasKey = hasPropertySignature(input, key), value = hasKey ? input[key] : void 0;
        if (hasKey && (!isConstructor || value !== void 0)) {
          let match = byValue.get(value);
          if (!match)
            return getFallback(runtimeType);
          for (let i of match)
            selected.add(i);
          directKey = key;
        }
      }
      if (directKey === void 0)
        for (let [key, [byValue, all]] of bySentinel) {
          let hasKey = hasPropertySignature(input, key), value = hasKey ? input[key] : void 0;
          if (hasKey && (!isConstructor || value !== void 0)) {
            let match = byValue.get(value);
            if (match)
              for (let i of match)
                selected.add(i);
          } else if (isConstructor)
            for (let i of all)
              selected.add(i);
        }
      for (let [key, [byValue, all]] of bySentinel) {
        if (key === directKey)
          continue;
        let hasKey = hasPropertySignature(input, key), value = hasKey ? input[key] : void 0;
        if (hasKey && (!isConstructor || value !== void 0)) {
          let match = byValue.get(value);
          for (let i of selected)
            if (all.has(i) && !match?.has(i))
              selected.delete(i);
        }
      }
      return Array.from(selected).sort((a, b) => a - b);
    };
  } else
    index = (input) => {
      let fallback = getFallback(getRuntimeType(input));
      return literalCandidates ? fallback.filter((i) => literalOf[i] === void 0 || literalOf[i] === input) : fallback;
    };
  return candidateIndexCache.set(types, index), index;
}
var Union = class extends ASTNodeImpl {
  _tag = "Union";
  types;
  options;
  encodingChecks;
  constructor(types, options, annotations, checks, encoding, context, encodingChecks) {
    super(annotations, checks, encoding, context);
    this.types = types, this.options = options, this.encodingChecks = encodingChecks;
  }
  getParser(compile, compileField) {
    let ast = this, isConstructor = compileField !== void 0, parsers = [], parser = (i) => parsers[i] ??= compile(ast.types[i]), index;
    return (input, options) => {
      if (input === missing)
        return missingExit;
      let candidates = (index ??= getCandidateIndex(ast.types))(input, isConstructor);
      if (candidates.length === 0)
        return fail5(new AnyOf(ast, [], input, options));
      if (candidates.length === 1) {
        let result = parser(candidates[0])(input, options);
        if (result._tag === "Success")
          return result;
        return effectIsExit(result) ? failSingleUnionCandidate(ast, result.cause, input, options) : catchSingleUnionCandidate(ast, result, input, options);
      }
      return parseUnionCandidates(ast, parser, candidates, input, options);
    };
  }
  _rebuild(recur, checks, encodingChecks) {
    let types = mapOrSame(this.types, recur);
    return types === this.types && checks === this.checks && encodingChecks === this.encodingChecks ? this : new Union(types, this.options, this.annotations, checks, void 0, this.context, encodingChecks);
  }
  recur(recur) {
    return this._rebuild(recur, this.checks, this.encodingChecks);
  }
  flip(recur) {
    return this._rebuild(recur, this.encodingChecks, this.checks);
  }
  matchPart(s, options) {
    for (let type of this.types) {
      let out = type.matchPart(s, options);
      if (out !== void 0)
        return out;
    }
    return;
  }
  getExpected(getExpected) {
    let expected = this.annotations?.expected;
    if (typeof expected === "string")
      return expected;
    if (this.types.length === 0)
      return "never";
    let types = this.types.map((type) => {
      let encoded = toEncoded(type);
      switch (encoded._tag) {
        case "Arrays": {
          let literals = encoded.elements.filter(isLiteral);
          if (literals.length > 0)
            return `${formatIsMutable(encoded.isMutable)}[ ${literals.map((e) => getExpected(e) + formatIsOptional(e.context?.isOptional)).join(", ")}, ... ]`;
          break;
        }
        case "Objects": {
          let literals = encoded.propertySignatures.filter((ps) => isLiteral(ps.type));
          if (literals.length > 0)
            return `{ ${literals.map((ps) => `${formatIsMutable(ps.type.context?.isMutable)}${formatPropertyKey(ps.name)}${formatIsOptional(ps.type.context?.isOptional)}: ${getExpected(ps.type)}`).join(", ")}, ... }`;
          break;
        }
      }
      return getExpected(encoded);
    });
    return Array.from(new Set(types)).join(" | ");
  }
};
function failSingleUnionCandidate(ast, cause, input, options) {
  let issue = getSchemaIssue(cause);
  if (!issue)
    return failCause2(cause);
  return fail4(new AnyOf(ast, [issue], input, options));
}
function catchSingleUnionCandidate(ast, result, input, options) {
  return catchCause2(result, (cause) => failSingleUnionCandidate(ast, cause, input, options));
}
function parseUnionCandidates(ast, parser, candidates, input, options) {
  let state = {
    ast,
    parser,
    input,
    out: void 0,
    successes: ast.options?.mode === "oneOf" ? [] : void 0,
    issues: void 0,
    options
  }, eff = parseUnion(state, candidates);
  if (!eff) {
    if (state.out)
      return state.out;
    return fail5(new AnyOf(ast, state.issues ?? [], input, options));
  }
  return resumeUnion(eff, state);
}
function resumeUnion(eff, state) {
  return flatMapEager2(eff, (_) => {
    if (state.out === sameExit)
      return succeed5(state.input);
    if (state.out)
      return state.out;
    return fail5(new AnyOf(state.ast, state.issues ?? [], state.input, state.options));
  });
}
var parseUnion = /* @__PURE__ */ iterateEager()({
  onItem(s, i) {
    return s.parser(i)(s.input, s.options);
  },
  step(s, i, exit) {
    if (exit._tag === "Failure") {
      let issue = getSchemaIssue(exit.cause);
      if (issue === void 0)
        return exit;
      if (s.issues)
        s.issues.push(issue);
      else
        s.issues = [issue];
    } else {
      if (s.out && s.successes)
        return s.successes.push(s.ast.types[i]), fail4(new OneOf(s.ast, s.successes, s.input, s.options));
      if (s.out = exit, s.successes)
        s.successes.push(s.ast.types[i]);
      else
        return void_2;
    }
  }
}), nonFiniteLiterals = /* @__PURE__ */ new Union([/* @__PURE__ */ new Literal("Infinity"), /* @__PURE__ */ new Literal("-Infinity"), /* @__PURE__ */ new Literal("NaN")]);
function formatIsMutable(isMutable) {
  return isMutable ? "" : "readonly ";
}
function formatIsOptional(isOptional) {
  return isOptional ? "?" : "";
}
var Suspend = class extends ASTNodeImpl {
  _tag = "Suspend";
  thunk;
  constructor(thunk, annotations, checks, encoding, context) {
    if (checks)
      throw Error("Cannot add checks to Suspend");
    super(annotations, void 0, encoding, context);
    let ast;
    this.thunk = () => ast ??= thunk();
  }
  getParser(compile) {
    let parser;
    return (input, options) => (parser ??= compile(this.thunk()))(input, options);
  }
  recur(recur) {
    return new Suspend(() => recur(this.thunk()), this.annotations, void 0, void 0, this.context);
  }
  getExpected(getExpected) {
    return getExpected(this.thunk());
  }
}, Filter2 = class extends Class {
  _tag = "Filter";
  run;
  annotations;
  aborted;
  constructor(run, annotations = void 0, aborted = !1) {
    super();
    this.run = run, this.annotations = annotations, this.aborted = aborted;
  }
  annotate(annotations) {
    return new Filter2(this.run, {
      ...this.annotations,
      ...annotations
    }, this.aborted);
  }
  abort() {
    return new Filter2(this.run, this.annotations, !0);
  }
  and(other, annotations) {
    return new FilterGroup([this, other], annotations);
  }
}, FilterGroup = class extends Class {
  _tag = "FilterGroup";
  checks;
  annotations;
  constructor(checks, annotations = void 0) {
    super();
    this.checks = checks, this.annotations = annotations;
  }
  annotate(annotations) {
    return new FilterGroup(this.checks, {
      ...this.annotations,
      ...annotations
    });
  }
  and(other, annotations) {
    return new FilterGroup([this, other], annotations);
  }
};
function makeFilter(filter, annotations, aborted = !1) {
  return new Filter2((input, ast, options) => normalizeFilterOutput(ast, filter(input, ast, options), input, options), annotations, aborted);
}
function isFinite(annotations) {
  return makeFilter((n) => globalThis.Number.isFinite(n), {
    expected: "a finite number",
    representation: {
      id: "effect/schema/isFinite",
      payload: null
    },
    toJsonSchema: () => ({
      type: "number"
    }),
    toCode: () => ({
      runtime: "Schema.isFinite()"
    }),
    arbitraryConstraint: {
      number: "finite"
    },
    ...annotations
  });
}
var finite = /* @__PURE__ */ appendChecks(number2, [/* @__PURE__ */ isFinite()]), numberToJson = /* @__PURE__ */ new Link(/* @__PURE__ */ new Union([finite, nonFiniteLiterals]), /* @__PURE__ */ new Transformation(/* @__PURE__ */ Number3(), /* @__PURE__ */ transform((n) => globalThis.Number.isFinite(n) ? n : globalThis.String(n))));
function isPattern(regExp, annotations) {
  let copy = new globalThis.RegExp(regExp), payload = {
    source: copy.source,
    flags: copy.flags
  };
  return makeFilter((s) => (copy.lastIndex = 0, copy.test(s)), {
    expected: `a string matching the RegExp ${payload.source}`,
    representation: {
      id: "effect/schema/isPattern",
      payload
    },
    toJsonSchema: () => [{}, !0],
    arbitraryConstraint: {
      patterns: [payload]
    },
    ...annotations
  });
}
var bodyOwners = /* @__PURE__ */ new WeakMap;
function copy(ast, changes) {
  let out = Object.assign(Object.create(Object.getPrototypeOf(ast)), ast, changes);
  if (Reflect.ownKeys(changes).every((key) => key === "context" || key === "encoding"))
    bodyOwners.set(out, getContextOwner(ast));
  return out;
}
function getContextOwner(ast) {
  let existing = bodyOwners.get(ast);
  if (existing !== void 0)
    return existing;
  if (ast.encoding === void 0)
    return ast;
  let owner = Object.assign(Object.create(Object.getPrototypeOf(ast)), ast, {
    encoding: void 0
  });
  return bodyOwners.set(ast, owner), owner;
}
function replaceEncoding(ast, encoding) {
  return ast.encoding === encoding ? ast : copy(ast, {
    encoding
  });
}
function replaceContext(ast, context) {
  if (ast.context === context)
    return ast;
  let owner = getContextOwner(ast);
  if (owner.context === context && owner.encoding === ast.encoding)
    return owner;
  return copy(ast, {
    context
  });
}
function getLastEncoding(ast) {
  return ast.encoding ? getLastEncoding(ast.encoding[ast.encoding.length - 1].to) : ast;
}
function annotate(ast, annotations) {
  if (ast.checks) {
    let last = ast.checks[ast.checks.length - 1];
    return replaceChecks(ast, append(ast.checks.slice(0, -1), last.annotate(annotations)));
  }
  return copy(ast, {
    annotations: {
      ...ast.annotations,
      ...annotations
    }
  });
}
function replaceChecks(ast, checks) {
  if (ast._tag === "Suspend" && checks)
    throw Error("Cannot add checks to Suspend");
  if (ast.checks === checks)
    return ast;
  return copy(ast, {
    checks
  });
}
function appendChecks(ast, checks) {
  return replaceChecks(ast, combineChecks(ast.checks, checks));
}
function mapLink(link, f) {
  let to = f(link.to);
  return to === link.to ? link : new Link(to, link.transformation);
}
function updateLastLink(encoding, f) {
  let links = encoding, last = links[links.length - 1], out = mapLink(last, f);
  return out === last ? encoding : append(encoding.slice(0, encoding.length - 1), out);
}
function applyToLastLink(f) {
  return (ast) => ast.encoding ? replaceEncoding(ast, updateLastLink(ast.encoding, f)) : ast;
}
function applyToSelfOrLastLinkEncodingIdempotent(f, options) {
  function out(ast) {
    if (ast.encoding) {
      let last = ast.encoding[ast.encoding.length - 1];
      return options?.stopAt?.(last) ? ast : replaceEncoding(ast, updateLastLink(ast.encoding, out));
    }
    return f(ast);
  }
  return memoizeIdempotent(out);
}
function appendTransformation(from, transformation, to) {
  let link = new Link(from, transformation);
  return replaceEncoding(to, to.encoding ? [...to.encoding, link] : [link]);
}
function mapOrSame(as, f) {
  let out;
  for (let i = 0;i < as.length; i++) {
    let a = as[i], fa = f(a);
    if (out)
      out[i] = fa;
    else if (fa !== a) {
      out = Array(as.length);
      for (let j = 0;j < i; j++)
        out[j] = as[j];
      out[i] = fa;
    }
  }
  return out ?? as;
}
function annotateKey(ast, annotations) {
  let context = ast.context ? new Context(ast.context.isOptional, ast.context.isMutable, ast.context.constructorDefault, {
    ...ast.context.annotations,
    ...annotations
  }) : new Context(!1, !1, void 0, annotations);
  return replaceContext(ast, context);
}
var optionalKey = /* @__PURE__ */ memoizeIdempotent((ast) => {
  let context = ast.context ? ast.context.isOptional === !1 ? new Context(!0, ast.context.isMutable, ast.context.constructorDefault, ast.context.annotations) : ast.context : new Context(!0, !1);
  return optionalKeyLastLink(replaceContext(ast, context));
}), optionalKeyLastLink = /* @__PURE__ */ applyToLastLink(optionalKey), optional = /* @__PURE__ */ memoize((ast) => optionalKey(new Union([ast, undefined_2])));
function withConstructorDefault(ast, defaultValue) {
  let context = ast.context ? new Context(ast.context.isOptional, ast.context.isMutable, defaultValue, ast.context.annotations) : new Context(!1, !1, defaultValue);
  return replaceContext(ast, context);
}
function decodeTo(from, to, transformation) {
  return appendTransformation(from, transformation, to);
}
function parseParameter(ast) {
  let literals = [], parameters = [];
  function go(ast) {
    switch (ast._tag) {
      case "Literal":
        if (isPropertyKey(ast.literal) && !literals.includes(ast.literal))
          literals.push(ast.literal);
        return;
      case "UniqueSymbol":
        if (!literals.includes(ast.symbol))
          literals.push(ast.symbol);
        return;
      case "Never":
        return;
      case "Union":
        for (let i = 0;i < ast.types.length; i++)
          go(ast.types[i]);
        return;
      default:
        parameters.push(ast);
    }
  }
  return go(ast), {
    literals,
    parameters
  };
}
function record(key, value) {
  let {
    literals,
    parameters: indexSignatures
  } = parseParameter(key);
  return new Objects(literals.map((literal) => new PropertySignature(literal, value)), indexSignatures.map((parameter) => new IndexSignature(parameter, value)));
}
function isOptional(ast) {
  return ast.context?.isOptional ?? !1;
}
function isStructuralCheck(check) {
  return check.annotations?.[STRUCTURAL_ANNOTATION_KEY] === !0 || check._tag === "FilterGroup" && check.checks.every(isStructuralCheck);
}
function extractStructuralChecks(checks) {
  function extract(check) {
    if (isStructuralCheck(check))
      return [check];
    return check._tag === "FilterGroup" ? check.checks.flatMap(extract) : [];
  }
  let out = checks.flatMap(extract);
  return isArrayNonEmpty2(out) ? out : void 0;
}
function canPreserveEncodingChecks(ast) {
  let preserve = !0;
  function visit(child) {
    if (preserve = preserve && !child.encoding && !isSuspend(child), preserve && "recur" in child)
      child.recur(visit);
    return child;
  }
  if ("recur" in ast)
    ast.recur(visit);
  return preserve;
}
var toType = /* @__PURE__ */ memoizeIdempotent((ast) => {
  let owner = getContextOwner(ast);
  if (owner !== ast) {
    let type = toType(owner);
    return type === owner && ast.encoding === void 0 ? ast : replaceContext(type, ast.context);
  }
  let type = "recur" in ast ? ast.recur(toType) : ast;
  if ("encodingChecks" in type && type.encodingChecks) {
    let checks = canPreserveEncodingChecks(ast) ? type.encodingChecks : isArrays(type) || isObjects(type) || isDeclaration(type) && type.typeParameters.length > 0 ? extractStructuralChecks(type.encodingChecks) : void 0;
    return copy(type, {
      encodingChecks: void 0,
      checks: combineChecks(type.checks, checks)
    });
  }
  return type;
}), toEncoded = /* @__PURE__ */ memoizeIdempotent((ast) => toType(flip2(ast)));
function flipEncoding(ast, encoding) {
  let links = encoding, len = links.length, last = links[len - 1], ls = [new Link(flip2(replaceEncoding(ast, void 0)), links[0].transformation.flip())];
  for (let i = 1;i < len; i++)
    ls.unshift(new Link(flip2(links[i - 1].to), links[i].transformation.flip()));
  let to = flip2(last.to);
  if (to.encoding)
    return replaceEncoding(to, [...to.encoding, ...ls]);
  else
    return replaceEncoding(to, ls);
}
var flip2 = /* @__PURE__ */ memoize((ast) => {
  if (ast.encoding)
    return flipEncoding(ast, ast.encoding);
  let owner = getContextOwner(ast);
  if (owner !== ast) {
    let flipped = flip2(owner);
    return flipped === owner ? ast : replaceContext(flipped, ast.context);
  }
  return "flip" in ast ? ast.flip(flip2) : ("recur" in ast) ? ast.recur(flip2) : ast;
});
function containsUndefined(ast) {
  switch (ast._tag) {
    case "Undefined":
      return !0;
    case "Union":
      return ast.types.some(containsUndefined);
    default:
      return !1;
  }
}
function fromConst(ast, value) {
  let succeed = value === 0 ? sameExit : succeed6(value);
  return (input, options) => {
    if (input === missing)
      return missingExit;
    if (input === value)
      return succeed;
    return fail5(new InvalidType(ast, input, options));
  };
}
function fromRefinement(ast, refinement) {
  return (input, options) => {
    if (input === missing)
      return missingExit;
    if (refinement(input))
      return sameExit;
    return fail5(new InvalidType(ast, input, options));
  };
}
var parameterFromPropertyKey = /* @__PURE__ */ applyToSelfOrLastLinkEncodingIdempotent((ast) => {
  switch (ast._tag) {
    default:
      return ast;
    case "Number":
      return ast.toCodecStringTree();
    case "Union":
      return ast.recur(parameterFromPropertyKey);
  }
});
var isStringFiniteRegExp = /* @__PURE__ */ new globalThis.RegExp(`^${FINITE_PATTERN}$`), isStringNumberRegExp = /* @__PURE__ */ new globalThis.RegExp(`^(?:${FINITE_PATTERN}|Infinity|-Infinity|NaN)$`);
function isStringFinite(annotations) {
  return isPattern(isStringFiniteRegExp, {
    expected: "a string representing a finite number",
    representation: {
      id: "effect/schema/isStringFinite",
      payload: null
    },
    toJsonSchema: () => ({
      pattern: isStringFiniteRegExp.source
    }),
    ...annotations
  });
}
var finiteString = /* @__PURE__ */ appendChecks(string2, [/* @__PURE__ */ isStringFinite()]), finiteToString = /* @__PURE__ */ new Link(finiteString, numberFromString), numberToString = /* @__PURE__ */ new Link(/* @__PURE__ */ new Union([finiteString, nonFiniteLiterals]), numberFromString), BIGINT_PATTERN = "-?\\d+", isStringBigIntRegExp = /* @__PURE__ */ new globalThis.RegExp(`^${BIGINT_PATTERN}$`);
var REGEXP_PATTERN = "Symbol\\(([\\s\\S]*)\\)", isStringSymbolRegExp = /* @__PURE__ */ new globalThis.RegExp(`^${REGEXP_PATTERN}$`);
function collectIssues(checks, value, issues, ast, options) {
  for (let i = 0;i < checks.length; i++) {
    let check = checks[i];
    if (check._tag === "FilterGroup") {
      if (issues = collectIssues(check.checks, value, issues, ast, options), issues && (options.errors !== "all" || issues[issues.length - 1].filter.aborted))
        return issues;
    } else {
      let issue = check.run(value, ast, options);
      if (issue) {
        let filter = new Filter(check, issue, value, options);
        if (issues)
          issues.push(filter);
        else
          issues = [filter];
        if (options.errors !== "all" || check.aborted)
          return issues;
      }
    }
  }
  return issues;
}
function getConstructorDescriptor(ast) {
  if (!isDeclaration(ast))
    return;
  let getDescriptor = ast.annotations?.[CONSTRUCTOR_ANNOTATION_KEY];
  return isFunction(getDescriptor) ? getDescriptor(ast.typeParameters) : void 0;
}
function isJsonLeaf(u) {
  return u === null || typeof u === "string" || typeof u === "boolean" || typeof u === "number" && globalThis.Number.isFinite(u);
}
function isStringTreeLeaf(u) {
  return u === void 0 || typeof u === "string";
}
function isTree(u, isLeaf) {
  let cache = /* @__PURE__ */ new WeakMap, stack = [];
  outer:
    while (!0) {
      if (typeof u !== "object" || u === null) {
        if (!isLeaf(u))
          return !1;
      } else {
        let value = u, cached = cache.get(value);
        if (cached === !1)
          return !1;
        if (cached === void 0) {
          let isArray = Array.isArray(value);
          if (!isArray) {
            let prototype = Object.getPrototypeOf(value);
            if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null)
              return !1;
          }
          cache.set(value, !1), stack.push({
            value,
            keys: isArray ? value.length : Object.keys(value),
            index: 0
          });
        }
      }
      while (stack.length > 0) {
        let frame = stack[stack.length - 1], keys = frame.keys;
        if (typeof keys === "number") {
          if (frame.index < keys) {
            u = frame.value[frame.index++];
            continue outer;
          }
        } else if (frame.index < keys.length) {
          u = frame.value[keys[frame.index++]];
          continue outer;
        }
        cache.set(frame.value, !0), stack.pop();
      }
      return !0;
    }
}
function isJson(u) {
  return isTree(u, isJsonLeaf);
}
var Json = /* @__PURE__ */ new Declaration([], () => (input, ast, options) => isJson(input) ? sameExit : fail5(new InvalidType(ast, input, options)), {
  representation: {
    id: "effect/schema/Json",
    payload: null
  },
  expected: "JSON value",
  toCodecJson: () => {
    return;
  },
  toCodecStringTree: () => unknownToStringTree
});
function isStringTree(u) {
  return isTree(u, isStringTreeLeaf);
}
var StringTree = /* @__PURE__ */ new Declaration([], () => (input, ast, options) => isStringTree(input) ? sameExit : fail5(new InvalidType(ast, input, options)), {
  expected: "StringTree",
  toCodecStringTree: () => {
    return;
  }
}), unknownToStringTree = /* @__PURE__ */ new Link(StringTree, /* @__PURE__ */ passthrough2());

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/internal/schema/interpreter.js
var flatMapTransformation = (result, current, f) => result === sameExit ? f(current) : flatMapEager2(result, f);
function compileTransformation(transformation) {
  if (transformation._tag === "Middleware")
    return (result, current, options) => {
      let transformed = result === sameExit ? transformation.decode(succeed6(toOption(current)), options) : transformation.decode(mapEager2(result, toOption), options);
      return fromOptionalEffect(transformed);
    };
  let getter = transformation.decode;
  switch (getter._tag) {
    case "Passthrough":
      return (result, current) => result === sameExit ? succeed6(current) : result;
    case "Transform": {
      let transform = (value) => value === missing ? missingExit : succeed6(getter.transform(value));
      return (result, current) => flatMapTransformation(result, current, transform);
    }
    case "TransformOptional": {
      let transform = (value) => fromOptionExit(getter.transform(toOption(value)));
      return (result, current) => flatMapTransformation(result, current, transform);
    }
    case "TransformEffect":
      return (result, current, options) => flatMapTransformation(result, current, (value) => value === missing ? missingExit : getter.transform(value, options));
    case "TransformOptionalEffect":
      return (result, current, options) => flatMapTransformation(result, current, (value) => fromOptionalEffect(getter.transform(toOption(value), options)));
  }
}
var fromOptionalEffect = (effect) => flatMapEager2(effect, fromOptionExit), wrapEncoding = (ast, input, options, effect) => catchCause2(effect, (cause) => failCauseSync2(() => map4(cause, (issue) => new Encoding(ast, issue, input, options))));
function makeConstructorParser(descriptor, compile) {
  let transform = compileTransformation(descriptor.link.transformation), sourceParser;
  return (input, options) => {
    if (input === missing)
      return missingExit;
    if (descriptor.isConstructed(input))
      return sameExit;
    let result = (sourceParser ??= compile(descriptor.link.to))(input, options);
    return transform(result, input, options);
  };
}
function withDefault(ast, parser) {
  let defaultValue = ast.context.constructorDefault;
  return (input, options) => {
    if (input !== missing && input !== void 0)
      return parser(input, options);
    let result = defaultValue;
    if (effectIsExit(result) && result._tag === "Success") {
      let local = parser(result[args], options);
      return local === sameExit ? result : local;
    }
    return flatMapEager2(wrapEncoding(ast, input, options, result), (value) => {
      let local = parser(value, options);
      return local === sameExit ? succeed6(value) : local;
    });
  };
}
function compileField(ast, compile) {
  let parser = compile(ast);
  return ast.context?.constructorDefault === void 0 ? parser : withDefault(ast, parser);
}
function compile(ast, compile, compileField, base, specialize) {
  if (ast._tag === "Declaration")
    for (let parameter of ast.typeParameters)
      compile(parameter);
  let descriptor = compileField ? getConstructorDescriptor(ast) : void 0, parser = descriptor ? makeConstructorParser(descriptor, compile) : base ?? ast.getParser(compile, compileField), { checks, encoding: links } = ast, transformations = links?.map((link) => compileTransformation(link.transformation)), encodingChecks = ast.encodingChecks;
  if (!links && !checks && !encodingChecks)
    return parser;
  let encodingParsers, parseChecks = (input, options) => {
    let result = parser(input, options);
    if (encodingChecks && !options.disableChecks)
      if (effectIsExit(result)) {
        if (result._tag === "Success") {
          let output = result === sameExit ? input : result[args];
          if (input !== missing && output !== missing) {
            let issues = collectIssues(encodingChecks, input, void 0, ast, options);
            if (issues)
              result = fail5(new Composite(ast, issues, input, options));
          }
        }
      } else
        result = flatMap2(result, (value) => {
          if (input !== missing && value !== missing) {
            let issues = collectIssues(encodingChecks, input, void 0, ast, options);
            if (issues)
              return fail5(new Composite(ast, issues, input, options));
          }
          return succeed5(value);
        });
    if (checks && !options.disableChecks)
      if (effectIsExit(result)) {
        if (result._tag === "Success") {
          let value = result === sameExit ? input : result[args];
          if (value === missing)
            return result;
          let issues = collectIssues(checks, value, void 0, ast, options);
          if (issues)
            result = fail5(new Composite(ast, issues, value, options));
        }
      } else
        result = flatMap2(result, (value) => {
          if (value !== missing) {
            let issues = collectIssues(checks, value, void 0, ast, options);
            if (issues)
              return fail5(new Composite(ast, issues, value, options));
          }
          return succeed5(value);
        });
    return result;
  }, parseLocal = specialize === void 0 ? parseChecks : specialize(parseChecks);
  if (!links)
    return parseLocal;
  return (input, options) => {
    let parsers = encodingParsers ??= links.map((link) => compile(link.to)), current = input, result = parsers[parsers.length - 1](input, options);
    for (let i = links.length - 1;i >= 0; i--)
      if (result = transformations[i](result, current, options), i !== 0) {
        let next = parsers[i - 1];
        if (result._tag === "Success")
          current = result[args], result = next(current, options);
        else
          result = flatMapEager2(result, (value) => {
            let nextResult = next(value, options);
            return nextResult === sameExit ? succeed6(value) : nextResult;
          });
      }
    if (result._tag === "Success") {
      let value = result[args], local = parseLocal(value, options);
      return local === sameExit ? result : local;
    }
    return result = wrapEncoding(ast, input, options, result), flatMapEager2(result, (value) => {
      let local = parseLocal(value, options);
      return local === sameExit ? succeed6(value) : local;
    });
  };
}

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/internal/schema/compilerRegistry.js
var invalid = /* @__PURE__ */ Symbol(), cache = /* @__PURE__ */ new WeakMap, compiler, compilerAdaptersEnabled = !1;
var decodeChild = (ast) => compilerAdaptersEnabled ? lazyParser(resolve2, ast, "parser") : resolve2(ast).parser, makeChild = (ast) => compilerAdaptersEnabled ? lazyParser(resolve2, ast, "makeEffect") : resolve2(ast).makeEffect, makeField = (ast) => compileField(ast, makeChild);

class InterpretedEntry {
  ast;
  constructor(ast) {
    this.ast = ast;
  }
  get decodeEffect() {
    return this.cachedDecodeEffect ??= compile(this.ast, decodeChild);
  }
  get parser() {
    return this.decodeEffect;
  }
  get makeEffect() {
    return this.cachedMakeEffect ??= compile(this.ast, makeChild, makeField);
  }
}

class CompilerEntry extends InterpretedEntry {
  compiled;
  resolve;
  constructor(ast, compiled, resolve) {
    super(ast);
    this.compiled = compiled, this.resolve = resolve;
  }
  save(key, value) {
    return Object.defineProperty(this, key, {
      value
    }), value;
  }
  operation(key) {
    let compiled = this.compiled;
    return typeof compiled === "function" ? compiled(this.ast, this.resolve, key) : compiled?.[key];
  }
  get is() {
    return this.save("is", this.operation("is"));
  }
  get decode() {
    return this.save("decode", this.operation("decode"));
  }
  get make() {
    return this.save("make", this.operation("make"));
  }
  get decodeEffect() {
    return this.save("decodeEffect", this.operation("decodeEffect") ?? compile(this.ast, (ast) => lazyParser(this.resolve, ast, "parser")));
  }
  get parser() {
    let decode = this.decode;
    return decode === void 0 ? this.decodeEffect : this.save("parser", withDecode(decode, () => this.decodeEffect));
  }
  get makeEffect() {
    let makeEffect = this.operation("makeEffect");
    if (makeEffect !== void 0)
      return this.save("makeEffect", makeEffect);
    let child = (ast) => lazyParser(this.resolve, ast, "makeEffect");
    return this.save("makeEffect", compile(this.ast, child, (ast) => compileField(ast, child)));
  }
}
function withDecode(fastDecode, decodeEffect) {
  let detailed;
  return (input, options) => {
    if (input !== missing)
      try {
        let value = fastDecode(input, options);
        if (value !== invalid)
          return value === input ? sameExit : succeed6(value);
      } catch (error) {
        return die3(error);
      }
    return (detailed ??= decodeEffect())(input, options);
  };
}
function lazyParser(resolve, ast, operation) {
  let entry = resolve(ast);
  if (entry.compiled === void 0 || Object.hasOwn(entry, operation))
    return entry[operation];
  let parser;
  return (input, options) => (parser ??= entry[operation])(input, options);
}
function resolve2(ast) {
  let cached = cache.get(ast);
  if (cached !== void 0)
    return cached;
  let entry = compiler === void 0 ? new InterpretedEntry(ast) : new CompilerEntry(ast, compiler(ast, resolve2), resolve2);
  return cache.set(ast, entry), entry;
}

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/SchemaParser.js
function makeEffect(schema) {
  let ast = schema.ast, parser;
  return (input, options) => (parser ??= runWithCompiler(constructorCompiler, toType(ast)))(input, options?.disableChecks ? options?.parseOptions ? {
    ...options.parseOptions,
    disableChecks: !0
  } : {
    disableChecks: !0
  } : options?.parseOptions);
}
function makeOption(schema) {
  let parser = makeEffect(schema);
  return (input, options) => {
    let exit = runSyncExit2(parser(input, options));
    if (isSuccess3(exit))
      return some2(exit.value);
    return getSchemaIssueOrThrow(exit.cause, "Option adapter can only return none for schema issues"), none2();
  };
}
function make6(schema) {
  return makeConstructorSync(toType(schema.ast));
}
function is(schema) {
  return _is(schema.ast);
}
function makeIs(ast) {
  if (!compilerAdaptersEnabled) {
    let parser = asExit(run(ast));
    return (input) => {
      let exit = parser(input, defaultParseOptions);
      if (isSuccess3(exit))
        return !0;
      return getSchemaIssueOrThrow(exit.cause, "Type guard adapter can only return false for schema issues"), !1;
    };
  }
  let entry = resolve2(ast), guard = entry.is;
  if (guard !== void 0)
    return (input) => {
      try {
        return guard(input, defaultParseOptions);
      } catch (error) {
        return getSchemaIssueOrThrow(die2(error), "Type guard adapter can only return false for schema issues"), !1;
      }
    };
  let parser = entry.parser;
  return (input) => {
    let exit = runSyncExit2(parserResult(parser(input, defaultParseOptions), input));
    if (isSuccess3(exit))
      return !0;
    return getSchemaIssueOrThrow(exit.cause, "Type guard adapter can only return false for schema issues"), !1;
  };
}
function _is(ast) {
  let typeAST = toType(ast), guard = (input) => (guard = makeIs(typeAST), guard(input));
  return (input) => guard(input);
}
function decodeUnknownEffect(schema, options) {
  let parser = run(schema.ast);
  return options === void 0 ? parser : (input, overrideOptions) => parser(input, mergeParseOptions(options, overrideOptions));
}
function encodeUnknownEffect(schema, options) {
  let parser = run(flip2(schema.ast));
  return options === void 0 ? parser : (input, overrideOptions) => parser(input, mergeParseOptions(options, overrideOptions));
}
var mergeParseOptions = (options, overrideOptions) => overrideOptions ? {
  ...options,
  ...overrideOptions
} : options, getValue = (value) => {
  if (value === missing)
    return fail5(new InvalidValue);
  return succeed5(value);
};
function run(ast) {
  return runWithCompiler(normalCompiler, ast);
}
function parserResult(result, input) {
  if (result === sameExit)
    return succeed5(input);
  if (!effectIsExit(result))
    return flatMapEager2(result, getValue);
  return result[args] === missing ? getValue(missing) : result;
}
function runWithCompiler(compiler, ast) {
  let parser;
  return (input, options) => {
    let result = (parser ??= compiler(ast))(input, options ?? defaultParseOptions);
    if (result === sameExit)
      return succeed5(input);
    if (!effectIsExit(result))
      return flatMapEager2(result, getValue);
    return result[args] === missing ? getValue(missing) : result;
  };
}
function asExit(parser) {
  return (input, options) => runSyncExit2(parser(input, options));
}
function runSync2(effect, message) {
  let exit = runSyncExit2(effect);
  if (isSuccess3(exit))
    return exit.value;
  let issue = getSchemaIssueOrThrow(exit.cause, message);
  throw Error("Schema validation failed", {
    cause: issue
  });
}
function makeConstructorSync(ast) {
  let entry, parser;
  return (input, options) => {
    entry ??= resolve2(ast);
    let parseOptions = options?.disableChecks ? options.parseOptions ? {
      ...options.parseOptions,
      disableChecks: !0
    } : {
      disableChecks: !0
    } : options?.parseOptions ?? defaultParseOptions, make = entry.make;
    if (make !== void 0 && input !== missing) {
      let output;
      try {
        output = make(input, parseOptions);
      } catch (error) {
        throw getSchemaIssueOrThrow(die2(error), "Constructor adapter can only throw schema issues"), error;
      }
      if (output !== invalid && output !== missing)
        return output;
    }
    let result = (parser ??= entry.makeEffect)(input, parseOptions);
    return runSync2(parserResult(result, input), "Constructor adapter can only throw schema issues");
  };
}
var normalCompiler = (ast) => resolve2(ast).parser, constructorCompiler = (ast) => resolve2(ast).makeEffect;

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/internal/schema/make.js
var TypeId8 = "~effect/Schema/Schema", RebuildOptions = /* @__PURE__ */ Symbol(), SchemaProto = {
  [TypeId8]: TypeId8,
  get make() {
    let value = make6(this);
    return Object.defineProperty(this, "make", {
      value,
      enumerable: !0
    }), value;
  },
  get makeEffect() {
    let value = makeEffect(this);
    return Object.defineProperty(this, "makeEffect", {
      value,
      enumerable: !0
    }), value;
  },
  get makeOption() {
    let value = makeOption(this);
    return Object.defineProperty(this, "makeOption", {
      value,
      enumerable: !0
    }), value;
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
  annotate(annotations) {
    return this.rebuild(annotate(this.ast, annotations));
  },
  annotateKey(annotations) {
    return this.rebuild(annotateKey(this.ast, annotations));
  },
  check(...checks) {
    return this.rebuild(appendChecks(this.ast, checks));
  },
  rebuild(ast) {
    return make7(ast, this[RebuildOptions]);
  }
};
function make7(ast, options) {
  function Schema() {}
  let self = Object.setPrototypeOf(Schema, SchemaProto);
  if (options && (Object.hasOwn(options, "name") || Object.hasOwn(options, "length") || Object.hasOwn(options, "__proto__")))
    Object.defineProperties(self, Object.getOwnPropertyDescriptors({
      ...options
    }));
  else
    Object.assign(self, options);
  return self[RebuildOptions] = options, self.ast = ast, self;
}

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/RegExp.js
var RegExp2 = globalThis.RegExp;
var escape = (string) => string.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&");

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/internal/schema/toEquivalence.js
var toEquivalence = /* @__PURE__ */ memoize((ast) => recur(ast));
function recur(ast) {
  let annotation = resolve(ast)?.toEquivalence;
  if (annotation)
    return annotation(isDeclaration(ast) ? ast.typeParameters.map(recur) : []);
  switch (ast._tag) {
    case "Never":
      return strictEqual();
    case "Declaration":
      return declarationEquivalence(ast);
    case "Null":
    case "Undefined":
    case "Void":
    case "Unknown":
    case "Any":
    case "String":
    case "Number":
    case "Boolean":
    case "BigInt":
    case "Symbol":
    case "Literal":
    case "UniqueSymbol":
    case "ObjectKeyword":
    case "Enum":
    case "TemplateLiteral":
      return equals;
    case "Arrays": {
      let elements = ast.elements.map(recur), rest = ast.rest.map(recur), [head, ...tail] = rest, tailLength = tail.length;
      return make((a, b) => {
        if (!Array.isArray(a) || !Array.isArray(b))
          return !1;
        let len = a.length;
        if (len !== b.length)
          return !1;
        let i = 0;
        for (;i < Math.min(len, ast.elements.length); i++)
          if (!elements[i](a[i], b[i]))
            return !1;
        if (rest.length > 0) {
          for (;i < len - tailLength; i++)
            if (!head(a[i], b[i]))
              return !1;
          for (let j = 0;j < tailLength; j++)
            if (!tail[j](a[i + j], b[i + j]))
              return !1;
        }
        return !0;
      });
    }
    case "Objects": {
      if (ast.propertySignatures.length === 0 && ast.indexSignatures.length === 0)
        return equals;
      let propertySignatures = ast.propertySignatures.map((ps) => recur(ps.type)), indexSignatures = ast.indexSignatures.map((is) => recur(is.type));
      return make((a, b) => {
        if (!isObject(a) || !isObject(b))
          return !1;
        for (let i = 0;i < propertySignatures.length; i++) {
          let ps = ast.propertySignatures[i], name = ps.name, aHas = Object.hasOwn(a, name), bHas = Object.hasOwn(b, name);
          if (isOptional(ps.type)) {
            if (aHas !== bHas)
              return !1;
          }
          if (aHas && bHas && !propertySignatures[i](a[name], b[name]))
            return !1;
        }
        for (let i = 0;i < indexSignatures.length; i++) {
          let is = ast.indexSignatures[i], aKeys = getIndexSignatureKeys(a, is.parameter), bKeys = getIndexSignatureKeys(b, is.parameter);
          if (aKeys.length !== bKeys.length)
            return !1;
          for (let j = 0;j < aKeys.length; j++) {
            let key = aKeys[j];
            if (!Object.hasOwn(b, key) || !indexSignatures[i](a[key], b[key]))
              return !1;
          }
        }
        return !0;
      });
    }
    case "Union": {
      let types = toType(ast).types, index = getCandidateIndex(types), compiled = types.map((candidate, i) => [_is(candidate), recur(ast.types[i])]);
      return make((a, b) => {
        let candidates = index(a, !1);
        for (let i = 0;i < candidates.length; i++) {
          let [is, equivalence] = compiled[candidates[i]];
          if (is(a) && is(b))
            return equivalence(a, b);
        }
        return !1;
      });
    }
    case "Suspend": {
      let equivalence;
      return make((a, b) => (equivalence ??= toEquivalence(ast.thunk()))(a, b));
    }
  }
}
function declarationEquivalence(ast) {
  let representation = ast.annotations?.representation;
  if (representation === void 0)
    return equals;
  switch (representation.id) {
    case "effect/schema/Option": {
      let [value] = declarationTypeParameters(ast);
      return (a, b) => a._tag === b._tag && (a._tag === "None" || value(a.value, b.value));
    }
    case "effect/schema/Result": {
      let [success, failure] = declarationTypeParameters(ast);
      return (a, b) => a._tag === b._tag && (a._tag === "Success" ? success(a.success, b.success) : failure(a.failure, b.failure));
    }
    case "effect/schema/CauseReason": {
      let [error, defect] = declarationTypeParameters(ast);
      return causeReasonEquivalence(error, defect);
    }
    case "effect/schema/Cause": {
      let [error, defect] = declarationTypeParameters(ast);
      return causeEquivalence(error, defect);
    }
    case "effect/schema/Exit": {
      let [value, error, defect] = declarationTypeParameters(ast), cause = causeEquivalence(error, defect);
      return (a, b) => a._tag === b._tag && (a._tag === "Success" ? value(a.value, b.value) : cause(a.cause, b.cause));
    }
    case "effect/schema/ReadonlyMap": {
      let [key, value] = declarationTypeParameters(ast);
      return makeCompareMap(key, value);
    }
    case "effect/schema/ReadonlySet":
      return makeCompareSet(declarationTypeParameters(ast)[0]);
    case "effect/schema/RegExp":
      return (a, b) => a.source === b.source && a.flags === b.flags;
    case "effect/schema/URL":
      return (a, b) => a.toString() === b.toString();
    default:
      return equals;
  }
}
function declarationTypeParameters(ast) {
  return ast.typeParameters.map(recur);
}
function causeReasonEquivalence(error, defect) {
  return (a, b) => {
    if (a._tag !== b._tag)
      return !1;
    switch (a._tag) {
      case "Fail":
        return error(a.error, b.error);
      case "Die":
        return defect(a.defect, b.defect);
      case "Interrupt":
        return a.fiberId === b.fiberId;
    }
  };
}
function causeEquivalence(error, defect) {
  let reasons = Array_(causeReasonEquivalence(error, defect));
  return (a, b) => reasons(a.reasons, b.reasons);
}

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Struct.js
var omit = /* @__PURE__ */ dual(2, (self, keys) => buildStruct(self, (k, v) => !hasPropertyKey(keys, k) ? [k, v] : void 0));
var lambda = (f) => f;
function hasPropertyKey(keys, key) {
  return keys.some((candidate) => candidate === key || typeof candidate === "number" && String(candidate) === key);
}
function buildStruct(source, f) {
  let out = {};
  for (let k of Reflect.ownKeys(source)) {
    if (!Object.prototype.propertyIsEnumerable.call(source, k))
      continue;
    let res = f(k, source[k]);
    if (res) {
      let [nk, nv] = res;
      assignProperty(out, nk, nv);
    }
  }
  return out;
}

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/internal/schemaError.js
var SchemaErrorTypeId = "~effect/Schema/SchemaError";
function isSchemaError(u) {
  return hasProperty(u, SchemaErrorTypeId) && u[SchemaErrorTypeId] === SchemaErrorTypeId;
}

// ../../node_modules/.bun/effect@4.0.1/node_modules/effect/dist/Schema.js
var TypeId9 = TypeId8;
function declareConstructor() {
  return (typeParameters, run, annotations) => make8(new Declaration(typeParameters.map(getAST), (typeParameters) => run(typeParameters.map((ast) => make8(ast))), annotations));
}
function declare(is, annotations) {
  return declareConstructor()([], () => (input, ast, options) => is(input) ? succeed5(input) : fail5(new InvalidType(ast, input, options)), annotations);
}
function annotate2(annotations) {
  return (self) => self.annotate(annotations);
}
class SchemaError extends (/* @__PURE__ */ TaggedError2("SchemaError")) {
  [SchemaErrorTypeId] = SchemaErrorTypeId;
  constructor(issue) {
    let stackTraceLimit = getStackTraceLimit();
    setStackTraceLimit(0);
    try {
      super({
        issue
      });
    } finally {
      setStackTraceLimit(stackTraceLimit);
    }
  }
  get message() {
    return defaultFormatter(this.issue);
  }
  toString() {
    return `SchemaError(${this.message})`;
  }
}
function isSchemaError2(u) {
  return isSchemaError(u);
}
function fromIssueEffect(self) {
  if (effectIsExit(self))
    return fromIssueExit(self);
  return catchCause2(self, (cause) => failCauseSync2(() => map4(cause, (issue) => new SchemaError(issue))));
}
function fromIssueExit(exit) {
  return isSuccess3(exit) ? exit : failCause2(map4(exit.cause, (issue) => new SchemaError(issue)));
}
function getSchemaErrorOrThrow(cause, message) {
  let schemaError;
  for (let reason of cause.reasons) {
    if (!isFailReason2(reason) || !isSchemaError2(reason.error))
      throw new globalThis.Error(message, {
        cause
      });
    schemaError ??= reason.error;
  }
  if (schemaError === void 0)
    throw new globalThis.Error(message, {
      cause
    });
  return schemaError;
}
function runSchemaErrorSync(self) {
  let exit = runSyncExit2(self);
  if (isSuccess3(exit))
    return exit.value;
  throw getSchemaErrorOrThrow(exit.cause, "Sync adapter can only throw schema errors");
}
function decodeUnknownEffect2(schema, options) {
  let parser = decodeUnknownEffect(schema, options);
  return (input, options) => fromIssueEffect(parser(input, options));
}
function encodeUnknownEffect2(schema, options) {
  let parser = encodeUnknownEffect(schema, options);
  return (input, options) => fromIssueEffect(parser(input, options));
}
function encodeUnknownSync(schema, options) {
  let parser = encodeUnknownEffect2(schema, options);
  return (input, options) => runSchemaErrorSync(parser(input, options));
}
var encodeSync = encodeUnknownSync, make8 = make7;
function isSchema(u) {
  return hasProperty(u, TypeId9) && u[TypeId9] === TypeId9;
}
var optionalKey2 = /* @__PURE__ */ lambda((schema) => make8(optionalKey(schema.ast), {
  schema
}));
var optional2 = /* @__PURE__ */ lambda((self) => {
  let schema = UndefinedOr(self);
  return make8(optional(self.ast), {
    schema
  });
});
var toType2 = /* @__PURE__ */ lambda((schema) => make8(toType(schema.ast), {
  schema
})), toEncoded2 = /* @__PURE__ */ lambda((schema) => make8(toEncoded(schema.ast), {
  schema
}));
function Literal2(literal) {
  let out = make8(new Literal(literal), {
    literal,
    transform(to) {
      return out.pipe(decodeTo2(Literal2(to), {
        decode: transform(() => to),
        encode: transform(() => literal)
      }));
    }
  });
  return out;
}
var Any2 = /* @__PURE__ */ make8(any), Unknown2 = /* @__PURE__ */ make8(unknown), Null2 = /* @__PURE__ */ make8(null_), Undefined2 = /* @__PURE__ */ make8(undefined_2), String5 = /* @__PURE__ */ make8(string2);
var Number5 = /* @__PURE__ */ make8(number2), Boolean3 = /* @__PURE__ */ make8(boolean);
function makeStruct(ast, fields) {
  return make8(ast, {
    fields,
    mapFields(f, options) {
      let fields = f(this.fields);
      return makeStruct(struct(fields, options?.unsafePreserveChecks ? this.ast.checks : void 0), fields);
    }
  });
}
function Struct(fields) {
  return makeStruct(struct(fields, void 0), fields);
}
function Record(key, value) {
  return make8(record(key.ast, value.ast), {
    key,
    value
  });
}
function StructWithRest(schema, records) {
  return make8(structWithRest(schema.ast, records.map(getAST)), {
    schema,
    records
  });
}
function makeTuple(ast, elements) {
  return make8(ast, {
    elements,
    mapElements(f, options) {
      let elements = f(this.elements);
      return makeTuple(tuple(elements, options?.unsafePreserveChecks ? this.ast.checks : void 0), elements);
    }
  });
}
function Tuple(elements) {
  return makeTuple(tuple(elements), elements);
}
var ArraySchema = /* @__PURE__ */ lambda((schema) => make8(new Arrays(!1, [], [schema.ast]), {
  value: schema
}));
var NonEmptyArray = /* @__PURE__ */ lambda((schema) => make8(new Arrays(!1, [schema.ast], [schema.ast]), {
  value: schema
}));
function makeUnion(ast, members) {
  return make8(ast, {
    members,
    mapMembers(f, options) {
      let members = f(this.members);
      return makeUnion(union(members, this.ast.options, options?.unsafePreserveChecks ? this.ast.checks : void 0), members);
    }
  });
}
function Union2(members, options) {
  return makeUnion(union(members, options, void 0), members);
}
function Literals(literals) {
  let members = literals.map(Literal2);
  return make8(union(members, void 0, void 0), {
    literals,
    members,
    mapMembers(f) {
      return Union2(f(this.members));
    },
    pick(literals) {
      return Literals(literals);
    },
    transform(to) {
      return Union2(members.map((member, index) => member.transform(to[index])));
    }
  });
}
var NullOr = /* @__PURE__ */ lambda((self) => Union2([self, Null2])), UndefinedOr = /* @__PURE__ */ lambda((self) => Union2([self, Undefined2]));
function suspend3(f) {
  return make8(new Suspend(() => f().ast));
}
function check(...checks) {
  return (self) => self.check(...checks);
}
function brand(identifier) {
  return (schema) => make8(schema.ast, {
    schema,
    identifier
  });
}
function decodeTo2(to, transformation) {
  return (from) => make8(decodeTo(from.ast, to.ast, transformation ? makeTransformation(transformation) : passthrough2()), {
    from,
    to
  });
}
function linkDecoding() {
  return (to, decode) => link()(to, {
    decode,
    encode: forbiddenEncoding
  });
}
function encodeTo(to, transformation) {
  return (from) => transformation ? decodeTo2(from, transformation)(to) : decodeTo2(from)(to);
}
function withConstructorDefault2(defaultValue) {
  return (schema) => make8(withConstructorDefault(schema.ast, defaultValue), {
    schema
  });
}
function tag(literal) {
  return Literal2(literal).pipe(withConstructorDefault2(succeed5(literal)));
}
function TaggedStruct(value, fields) {
  return Struct({
    _tag: tag(value),
    ...fields
  });
}
function toTaggedUnion(tag) {
  return (self) => {
    let cases = {}, discriminants = [], discriminantKeys = /* @__PURE__ */ new Set, guards = {}, isAnyOf = (keys) => (value) => keys.includes(value[tag]);
    return walk(self), Object.assign(self, {
      cases,
      discriminants,
      isAnyOf,
      guards,
      match,
      matchOrElse
    });
    function walk(schema) {
      let ast = schema.ast;
      if (isUnion(ast) && "members" in schema && globalThis.Array.isArray(schema.members) && schema.members.every(isSchema))
        return schema.members.forEach(walk);
      let sentinels = collectSentinels(ast);
      if (sentinels.length > 0) {
        let literal = sentinels.find((s) => s.key === tag)?.literal;
        if (isPropertyKey(literal)) {
          let key = typeof literal === "number" ? globalThis.String(literal) : literal;
          if (discriminantKeys.has(key))
            throw new globalThis.Error(`Duplicate discriminant: ${globalThis.String(literal)}`);
          discriminantKeys.add(key), discriminants.push(literal), assignProperty(cases, literal, schema), assignProperty(guards, literal, is(toType2(schema)));
          return;
        }
      }
      throw new globalThis.Error("No literal or unique symbol found");
    }
    function match() {
      if (arguments.length === 1) {
        let cases = arguments[0];
        return function(value) {
          let key = value[tag];
          return (Object.hasOwn(cases, key) ? cases[key] : void 0)(value);
        };
      }
      let value = arguments[0], cases = arguments[1], key = value[tag];
      return (Object.hasOwn(cases, key) ? cases[key] : void 0)(value);
    }
    function matchOrElse() {
      if (arguments.length === 2) {
        let cases = arguments[0], orElse = arguments[1];
        return function(value) {
          let key = value[tag];
          return (Object.hasOwn(cases, key) ? cases[key] ?? orElse : orElse)(value);
        };
      }
      let value = arguments[0], cases = arguments[1], orElse = arguments[2], key = value[tag];
      return (Object.hasOwn(cases, key) ? cases[key] ?? orElse : orElse)(value);
    }
  };
}
function instanceOf(constructor, annotations) {
  return declare((u) => u instanceof constructor, annotations);
}
function link() {
  return (encodeTo, transformation) => new Link(encodeTo.ast, makeTransformation(transformation));
}
var makeFilter2 = makeFilter;
var TRIMMED_PATTERN = "^\\S[\\s\\S]*\\S$|^\\S$|^$";
function isTrimmed(annotations) {
  let regExp = new globalThis.RegExp(TRIMMED_PATTERN);
  return makeFilter2((s) => s.trim() === s, {
    expected: "a string with no leading or trailing whitespace",
    representation: {
      id: "effect/schema/isTrimmed",
      payload: null
    },
    toJsonSchema: () => ({
      pattern: regExp.source
    }),
    toCode: () => ({
      runtime: "Schema.isTrimmed()"
    }),
    arbitraryConstraint: {
      patterns: [{
        source: TRIMMED_PATTERN,
        flags: ""
      }]
    },
    ...annotations
  });
}
function isPattern2(regExp, annotations) {
  let { source, flags } = regExp, canExport = /^[dg]*uy?$/.test(flags), runtimeRegExp = flags === "" ? `new RegExp(${format(source)})` : `new RegExp(${format(source)}, ${format(flags)})`;
  return isPattern(regExp, {
    toJsonSchema: () => canExport ? {
      pattern: flags.endsWith("y") ? `^(?:${source})` : source
    } : [{}, !0],
    toCode: () => ({
      runtime: `Schema.isPattern(${runtimeRegExp})`
    }),
    ...annotations
  });
}
function isBase64(annotations) {
  let regExp = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  return isPattern2(regExp, {
    expected: "a base64 encoded string",
    representation: {
      id: "effect/schema/isBase64",
      payload: null
    },
    toJsonSchema: () => ({
      pattern: regExp.source
    }),
    toCode: () => ({
      runtime: "Schema.isBase64()"
    }),
    ...annotations
  });
}
function literalToJsonSchema(literal, original, pattern) {
  if (literal.length === 0)
    return original.length === 0 ? {} : [{}, !0];
  let constraint = {
    pattern: new globalThis.RegExp(pattern).source
  };
  return literal === original ? constraint : [constraint, !0];
}
function isStartingWith(startsWith, annotations) {
  let formatted = JSON.stringify(startsWith), regExp = new globalThis.RegExp(`^${escape(startsWith)}`), jsonSchemaLiteral = startsWith.replace(/[\uD800-\uDBFF]$/, "");
  return makeFilter2((s) => s.startsWith(startsWith), {
    expected: `a string starting with ${formatted}`,
    representation: {
      id: "effect/schema/isStartingWith",
      payload: {
        startsWith
      }
    },
    toJsonSchema: () => literalToJsonSchema(jsonSchemaLiteral, startsWith, `^${escape(jsonSchemaLiteral)}`),
    toCode: () => ({
      runtime: `Schema.isStartingWith(${format(startsWith)})`
    }),
    arbitraryConstraint: {
      patterns: [{
        source: regExp.source,
        flags: regExp.flags
      }]
    },
    ...annotations
  });
}
var Finite = /* @__PURE__ */ make8(finite);
function makeIsGreaterThan(options) {
  let gt = isGreaterThan(options.order), formatter = options.formatter ?? format;
  return (exclusiveMinimum, annotations) => makeFilter2((input) => gt(input, exclusiveMinimum), {
    expected: `a value greater than ${formatter(exclusiveMinimum)}`,
    arbitraryConstraint: {
      order: options.order,
      minimum: exclusiveMinimum,
      exclusiveMinimum: !0
    },
    ...options.annotate?.(exclusiveMinimum),
    ...annotations
  });
}
function makeIsGreaterThanOrEqualTo(options) {
  let gte = isGreaterThanOrEqualTo(options.order), formatter = options.formatter ?? format;
  return (minimum, annotations) => makeFilter2((input) => gte(input, minimum), {
    expected: `a value greater than or equal to ${formatter(minimum)}`,
    arbitraryConstraint: {
      order: options.order,
      minimum
    },
    ...options.annotate?.(minimum),
    ...annotations
  });
}
function makeIsLessThanOrEqualTo(options) {
  let lte = isLessThanOrEqualTo(options.order), formatter = options.formatter ?? format;
  return (maximum, annotations) => makeFilter2((input) => lte(input, maximum), {
    expected: `a value less than or equal to ${formatter(maximum)}`,
    arbitraryConstraint: {
      order: options.order,
      maximum
    },
    ...options.annotate?.(maximum),
    ...annotations
  });
}
function makeIsBetween(deriveOptions) {
  let greaterThanOrEqualTo = isGreaterThanOrEqualTo(deriveOptions.order), greaterThan = isGreaterThan(deriveOptions.order), lessThanOrEqualTo = isLessThanOrEqualTo(deriveOptions.order), lessThan = isLessThan(deriveOptions.order), formatter = deriveOptions.formatter ?? format;
  return (options, annotations) => {
    let gte = options.exclusiveMinimum ? greaterThan : greaterThanOrEqualTo, lte = options.exclusiveMaximum ? lessThan : lessThanOrEqualTo;
    return makeFilter2((input) => gte(input, options.minimum) && lte(input, options.maximum), {
      expected: `a value between ${formatter(options.minimum)}${options.exclusiveMinimum ? " (excluded)" : ""} and ${formatter(options.maximum)}${options.exclusiveMaximum ? " (excluded)" : ""}`,
      arbitraryConstraint: {
        order: deriveOptions.order,
        minimum: options.minimum,
        maximum: options.maximum,
        ...options.exclusiveMinimum && {
          exclusiveMinimum: !0
        },
        ...options.exclusiveMaximum && {
          exclusiveMaximum: !0
        }
      },
      ...deriveOptions.annotate?.(options),
      ...annotations
    });
  };
}
function encodeNumberPayload(number) {
  if (!globalThis.Number.isFinite(number))
    throw new globalThis.RangeError(`Expected a finite number, got ${format(number)}`);
  return number;
}
var isGreaterThan3 = /* @__PURE__ */ makeIsGreaterThan({
  order: Number2,
  annotate: (exclusiveMinimum) => ({
    representation: {
      id: "effect/schema/isGreaterThan",
      payload: {
        exclusiveMinimum: encodeNumberPayload(exclusiveMinimum)
      }
    },
    toJsonSchema: () => ({
      exclusiveMinimum
    }),
    toCode: () => ({
      runtime: `Schema.isGreaterThan(${format(exclusiveMinimum)})`
    })
  })
}), isGreaterThanOrEqualTo3 = /* @__PURE__ */ makeIsGreaterThanOrEqualTo({
  order: Number2,
  annotate: (minimum) => ({
    representation: {
      id: "effect/schema/isGreaterThanOrEqualTo",
      payload: {
        minimum: encodeNumberPayload(minimum)
      }
    },
    toJsonSchema: () => ({
      minimum
    }),
    toCode: () => ({
      runtime: `Schema.isGreaterThanOrEqualTo(${format(minimum)})`
    })
  })
});
var isLessThanOrEqualTo3 = /* @__PURE__ */ makeIsLessThanOrEqualTo({
  order: Number2,
  annotate: (maximum) => ({
    representation: {
      id: "effect/schema/isLessThanOrEqualTo",
      payload: {
        maximum: encodeNumberPayload(maximum)
      }
    },
    toJsonSchema: () => ({
      maximum
    }),
    toCode: () => ({
      runtime: `Schema.isLessThanOrEqualTo(${format(maximum)})`
    })
  })
}), isBetween = /* @__PURE__ */ makeIsBetween({
  order: Number2,
  annotate: (options) => {
    let exclusiveMinimum = options.exclusiveMinimum ? !0 : void 0, exclusiveMaximum = options.exclusiveMaximum ? !0 : void 0;
    return {
      representation: {
        id: "effect/schema/isBetween",
        payload: {
          minimum: encodeNumberPayload(options.minimum),
          maximum: encodeNumberPayload(options.maximum),
          ...exclusiveMinimum && {
            exclusiveMinimum
          },
          ...exclusiveMaximum && {
            exclusiveMaximum
          }
        }
      },
      toJsonSchema: () => ({
        [exclusiveMinimum ? "exclusiveMinimum" : "minimum"]: options.minimum,
        [exclusiveMaximum ? "exclusiveMaximum" : "maximum"]: options.maximum
      }),
      toCode: () => ({
        runtime: `Schema.isBetween({ minimum: ${format(options.minimum)}, maximum: ${format(options.maximum)}, exclusiveMinimum: ${format(exclusiveMinimum)}, exclusiveMaximum: ${format(exclusiveMaximum)} })`
      })
    };
  }
});
function isInt(annotations) {
  return makeFilter2((n) => globalThis.Number.isSafeInteger(n), {
    expected: "an integer",
    representation: {
      id: "effect/schema/isInt",
      payload: null
    },
    toJsonSchema: () => [{
      type: "integer"
    }, !0],
    toCode: () => ({
      runtime: "Schema.isInt()"
    }),
    arbitraryConstraint: {
      number: "integer"
    },
    ...annotations
  });
}
var Int = /* @__PURE__ */ Number5.check(/* @__PURE__ */ isInt());
function makeIsMinLength(minLength, minCodePoints, annotations) {
  return makeFilter2((input) => input.length >= minLength, {
    expected: `a value with a length of at least ${minLength}`,
    representation: {
      id: "effect/schema/isMinLength",
      payload: {
        minLength
      }
    },
    toJsonSchema: ({
      type
    }) => type === "string" ? minLength <= 1 ? {
      minLength: minCodePoints
    } : [{
      minLength: minCodePoints
    }, !0] : type === "array" ? {
      minItems: minLength
    } : type === void 0 ? [{
      minLength: minCodePoints,
      minItems: minLength
    }, !0] : [{}, !0],
    toCode: () => ({
      runtime: `Schema.isMinLength(${minLength})`
    }),
    [STRUCTURAL_ANNOTATION_KEY]: !0,
    arbitraryConstraint: {
      minLength
    },
    ...annotations
  });
}
function isNonEmpty(annotations) {
  return makeIsMinLength(1, 1, annotations);
}
var getErrorOptionsKey = (options) => (options?.includeStack === !0 ? 1 : 0) | (options?.excludeCause === !0 ? 2 : 0), getErrorOptions = (key) => {
  switch (key) {
    case 0:
      return;
    case 1:
      return {
        includeStack: !0
      };
    case 2:
      return {
        excludeCause: !0
      };
    case 3:
      return {
        includeStack: !0,
        excludeCause: !0
      };
  }
};
var defectSchemaCache = [];
function Defect(options) {
  let key = getErrorOptionsKey(options), cached = defectSchemaCache[key];
  if (cached !== void 0)
    return cached;
  let schema = Json2.pipe(decodeTo2(Unknown2, defectFromJson(getErrorOptions(key))));
  return defectSchemaCache[key] = schema, schema;
}
var RegExp3 = /* @__PURE__ */ instanceOf(globalThis.RegExp, {
  representation: {
    id: "effect/schema/RegExp",
    payload: null
  },
  toCode: () => ({
    runtime: "Schema.RegExp",
    Type: "globalThis.RegExp"
  }),
  expected: "RegExp",
  toCodecJson: () => link()(Struct({
    source: String5,
    flags: String5
  }), transformEffect2({
    decode: (e, options) => try_2({
      try: () => new globalThis.RegExp(e.source, e.flags),
      catch: () => new InvalidValue({
        expected: "valid RegExp source and flags"
      }, e, options)
    }),
    encode: (regExp) => succeed5({
      source: regExp.source,
      flags: regExp.flags
    })
  }))
}), URLString = /* @__PURE__ */ String5.annotate({
  expected: "a string that will be decoded as a URL"
}), URL2 = /* @__PURE__ */ instanceOf(globalThis.URL, {
  representation: {
    id: "effect/schema/URL",
    payload: null
  },
  toCode: () => ({
    runtime: "Schema.URL",
    Type: "globalThis.URL"
  }),
  expected: "URL",
  toCodecJson: () => link()(URLString, urlFromString)
});
var JsonString = /* @__PURE__ */ String5.annotate({
  expected: "a string that will be decoded as JSON",
  contentMediaType: "application/json"
});
function fromJsonString2(schema, options) {
  return JsonString.pipe(decodeTo2(schema, fromJsonString(options)));
}
var File2 = /* @__PURE__ */ instanceOf(globalThis.File, {
  representation: {
    id: "effect/schema/File",
    payload: null
  },
  toCode: () => ({
    runtime: "Schema.File",
    Type: "globalThis.File"
  }),
  expected: "File",
  toCodecJson: () => link()(Struct({
    data: String5.check(isBase64()),
    type: String5,
    name: String5,
    lastModified: Int
  }), transformEffect2({
    decode: (e, options) => match2(decode(e.data), {
      onFailure: () => fail5(new InvalidValue({
        expected: "a valid Base64 string"
      }, e.data, options)),
      onSuccess: (bytes) => {
        let buffer = new globalThis.Uint8Array(bytes);
        return succeed5(new globalThis.File([buffer], e.name, {
          type: e.type,
          lastModified: e.lastModified
        }));
      }
    }),
    encode: (file, options) => tryPromise2({
      try: async () => {
        let bytes = new globalThis.Uint8Array(await file.arrayBuffer());
        return {
          data: encode(bytes),
          type: file.type,
          name: file.name,
          lastModified: file.lastModified
        };
      },
      catch: () => new InvalidValue({
        expected: "a readable File"
      }, file, options)
    })
  }))
}), FormData2 = /* @__PURE__ */ instanceOf(globalThis.FormData, {
  representation: {
    id: "effect/schema/FormData",
    payload: null
  },
  toCode: () => ({
    runtime: "Schema.FormData",
    Type: "globalThis.FormData"
  }),
  expected: "FormData",
  toCodecJson: () => link()(ArraySchema(Tuple([String5, Union2([Struct({
    _tag: tag("String"),
    value: String5
  }), Struct({
    _tag: tag("File"),
    value: File2
  })])])), transformEffect2({
    decode: (e) => {
      let out = new globalThis.FormData;
      for (let [key, entry] of e)
        out.append(key, entry.value);
      return succeed5(out);
    },
    encode: (formData) => succeed5(globalThis.Array.from(formData.entries()).map(([key, value]) => {
      if (typeof value === "string")
        return [key, {
          _tag: "String",
          value
        }];
      else
        return [key, {
          _tag: "File",
          value
        }];
    }))
  }))
});
var URLSearchParams2 = /* @__PURE__ */ instanceOf(globalThis.URLSearchParams, {
  representation: {
    id: "effect/schema/URLSearchParams",
    payload: null
  },
  toCode: () => ({
    runtime: "Schema.URLSearchParams",
    Type: "globalThis.URLSearchParams"
  }),
  expected: "URLSearchParams",
  toCodecJson: () => link()(String5.annotate({
    expected: "a query string that will be decoded as URLSearchParams"
  }), transform2({
    decode: (e) => new globalThis.URLSearchParams(e),
    encode: (params) => params.toString()
  }))
});
var Trimmed = /* @__PURE__ */ String5.check(/* @__PURE__ */ isTrimmed()), Trim = /* @__PURE__ */ String5.annotate({
  expected: "a string that will be decoded as a trimmed string"
}).pipe(/* @__PURE__ */ decodeTo2(Trimmed, /* @__PURE__ */ trim3()));
var Base64String = /* @__PURE__ */ String5.annotate({
  expected: "a base64 encoded string that will be decoded as Uint8Array",
  format: "byte",
  contentEncoding: "base64"
}), Uint8Array2 = /* @__PURE__ */ instanceOf(globalThis.Uint8Array, {
  representation: {
    id: "effect/schema/Uint8Array",
    payload: null
  },
  toCode: () => ({
    runtime: "Schema.Uint8Array",
    Type: "globalThis.Uint8Array"
  }),
  expected: "Uint8Array",
  toCodecJson: () => link()(Base64String, uint8ArrayFromBase64String)
});
var dateTimeUtcFromString = /* @__PURE__ */ transformEffect2({
  decode: (s, options) => match(make5(s), {
    onNone: () => fail5(new InvalidValue({
      expected: "a valid UTC DateTime string"
    }, s, options)),
    onSome: (result) => succeed5(toUtc2(result))
  }),
  encode: (utc) => succeed5(formatIso2(utc))
});
var arbitraryMinimumDateTimestamp = -8640000000000000, arbitraryMaximumDateTimestamp = 8640000000000000, arbitraryMinimumZonedDateTimeTimestamp = arbitraryMinimumDateTimestamp + 50400000, arbitraryMaximumZonedDateTimeTimestamp = arbitraryMaximumDateTimestamp - 50400000;
function dateTimeArbitraryBounds(constraint, domainMinimum, domainMaximum) {
  let minimum = Math.max(domainMinimum, constraint?.minimum === void 0 ? domainMinimum : constraint.minimum.epochMilliseconds + (constraint.exclusiveMinimum === !0 ? 1 : 0)), maximum = Math.min(domainMaximum, constraint?.maximum === void 0 ? domainMaximum : constraint.maximum.epochMilliseconds - (constraint.exclusiveMaximum === !0 ? 1 : 0));
  return minimum <= maximum ? [minimum, maximum] : [domainMinimum, domainMaximum];
}
function dateTimeArbitraryInteger(minimum, maximum) {
  return Int.check(isBetween({
    minimum,
    maximum
  }));
}
var DateTimeUtc = /* @__PURE__ */ declare((u) => isDateTime2(u) && isUtc2(u), {
  representation: {
    id: "effect/schema/DateTimeUtc",
    payload: null
  },
  toCode: () => ({
    runtime: "Schema.DateTimeUtc",
    Type: "DateTime.Utc",
    importDeclarations: ['import * as DateTime from "effect/DateTime"']
  }),
  expected: "DateTime.Utc",
  toCodecArbitrary: ({
    constraint
  }) => {
    let [minimum, maximum] = dateTimeArbitraryBounds(constraint, arbitraryMinimumDateTimestamp, arbitraryMaximumDateTimestamp);
    return linkDecoding()(dateTimeArbitraryInteger(minimum, maximum), transform(makeUnsafe3));
  },
  toCodecJson: () => link()(String5, dateTimeUtcFromString),
  toFormatter: () => (utc) => utc.toString()
});
var immerable = /* @__PURE__ */ globalThis.Symbol.for("immer-draftable"), payloadToken = {};
function makeClass(Inherited, identifier, struct2, annotations, proto) {
  let getClassSchema = getClassSchemaFactory(struct2, identifier, annotations), ClassTypeId = getClassTypeId(identifier), out = class extends Inherited {
    constructor(...[input, options]) {
      let payload = options?.["~payload"], value = payload?.token === payloadToken ? payload.value : struct2.make(input ?? {}, options);
      super(value, {
        ...options,
        disableChecks: !0,
        "~payload": {
          token: payloadToken,
          value
        }
      });
    }
    static [TypeId9] = TypeId9;
    get [ClassTypeId]() {
      return ClassTypeId;
    }
    static [immerable] = !0;
    static identifier = identifier;
    static fields = struct2.fields;
    static get ast() {
      return getClassSchema(this).ast;
    }
    static pipe() {
      return pipeArguments(this, arguments);
    }
    static rebuild(ast) {
      return getClassSchema(this).rebuild(ast);
    }
    static make(input, options) {
      return make6(getClassSchema(this))(input ?? {}, options);
    }
    static makeOption(input, options) {
      return makeOption(getClassSchema(this))(input ?? {}, options);
    }
    static makeEffect(input, options) {
      return getClassSchema(this).makeEffect(input ?? {}, options);
    }
    static annotate(annotations) {
      return this.rebuild(annotate(this.ast, annotations));
    }
    static annotateKey(annotations) {
      return this.rebuild(annotateKey(this.ast, annotations));
    }
    static check(...checks) {
      return this.rebuild(appendChecks(this.ast, checks));
    }
    static extend(identifier2) {
      return (schema, annotations) => {
        let extension = isStruct(schema) ? schema : Struct(schema), fields = {
          ...struct2.fields,
          ...extension.fields
        }, ast = struct(fields, struct2.ast.checks, {
          identifier: identifier2
        });
        return makeClass(this, identifier2, makeStruct(appendChecks(ast, extension.ast.checks), fields), annotations, proto);
      };
    }
    static mapFields(f, options) {
      return struct2.mapFields(f, options);
    }
  };
  if (proto !== void 0)
    Object.assign(out.prototype, proto(identifier));
  return out;
}
function getClassTransformation(self) {
  return new Transformation(transform((input) => new self(input, {
    "~payload": {
      token: payloadToken,
      value: input
    }
  })), passthrough());
}
function getClassTypeId(identifier) {
  return `~effect/Schema/Class/${identifier}`;
}
function getClassSchemaFactory(from, identifier, annotations) {
  let memo;
  return (self) => {
    if (memo !== void 0)
      return memo;
    let ClassTypeId = getClassTypeId(identifier), isClassValue = (input) => input instanceof self || hasProperty(input, ClassTypeId), transformation = getClassTransformation(self), to = make8(new Declaration([from.ast], () => (input, ast, options) => isClassValue(input) ? succeed5(input) : fail5(new InvalidType(ast, input, options)), {
      identifier,
      [CONSTRUCTOR_ANNOTATION_KEY]: ([from]) => ({
        isConstructed: isClassValue,
        link: new Link(from, transformation)
      }),
      toCodec: ([from]) => new Link(from.ast, transformation),
      toEquivalence: ([from]) => from,
      toFormatter: ([from]) => (t) => `${self.identifier}(${from(t)})`,
      [SENTINELS_ANNOTATION_KEY]: collectSentinels(from.ast),
      ...annotations
    }));
    return memo = decodeTo2(to, transformation)(from);
  };
}
function isStruct(schema) {
  return isSchema(schema);
}
var Class3 = (identifier) => (schema, annotations) => {
  let struct = isStruct(schema) ? schema : Struct(schema);
  return makeClass(Class2, identifier, struct, annotations, (identifier) => ({
    toString() {
      return `${identifier}(${format({
        ...this
      })})`;
    }
  }));
};
var Error3 = (identifier) => (schema, annotations) => {
  let struct = isStruct(schema) ? schema : Struct(schema);
  return makeClass(Error2, identifier, struct, annotations, (identifier) => ({
    name: identifier
  }));
}, TaggedError3 = (identifier) => (tagValue, schema, annotations) => {
  let struct = isStruct(schema) ? schema.mapFields((fields) => ({
    _tag: tag(tagValue),
    ...fields
  }), {
    unsafePreserveChecks: !0
  }) : TaggedStruct(tagValue, schema);
  return Error3(identifier ?? tagValue)(struct, annotations);
};
function toEquivalence2(schema) {
  return toEquivalence(schema.ast);
}
var Json2 = /* @__PURE__ */ make8(/* @__PURE__ */ annotate(Json, {
  toCode: () => ({
    runtime: "Schema.Json",
    Type: "Schema.Json"
  })
}));
// ../../node_modules/.bun/@opencode+schema@2.1.4/node_modules/@opencode/schema/dist/schema.js
var PositiveInt = Int.check(isGreaterThan3(0)), NonNegativeInt = Int.check(isGreaterThanOrEqualTo3(0)), RelativePath = String5.pipe(brand("RelativePath"), annotate2({ identifier: "RelativePath" })), AbsolutePath = String5.pipe(brand("AbsolutePath"), annotate2({ identifier: "AbsolutePath" })), optional3 = (schema) => optionalKey2(schema).pipe(decodeTo2(optional2(toType2(schema)), {
  decode: passthrough({ strict: !1 }),
  encode: transformOptional(filter((value) => value !== void 0))
})), withStatics = (schema, methods) => Object.defineProperties(schema, Object.getOwnPropertyDescriptors(methods)), statics = (methods) => (schema) => withStatics(schema, methods(schema)), DateTimeUtcFromMillis = Finite.pipe(decodeTo2(DateTimeUtc, {
  decode: transform((value) => makeUnsafe3(value)),
  encode: transform((value) => toEpochMillis2(value))
}));

// ../../node_modules/.bun/@opencode+schema@2.1.4/node_modules/@opencode/schema/dist/identifier.js
var length = 26, chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", lastTimestamp = 0, counter = 0;
function ascending() {
  return create(!1);
}
function descending() {
  return create(!0);
}
function create(descending, timestamp = Date.now()) {
  if (timestamp !== lastTimestamp)
    lastTimestamp = timestamp, counter = 0;
  counter++;
  let current = BigInt(timestamp) * 0x1000n + BigInt(counter), value = descending ? ~current : current, time = Array.from({ length: 6 }, (_, index) => Number(value >> BigInt(40 - 8 * index) & 0xffn).toString(16).padStart(2, "0")).join(""), bytes = crypto.getRandomValues(new Uint8Array(length - 12));
  return time + Array.from(bytes, (byte) => chars[byte % 62]).join("");
}
// ../../node_modules/.bun/@opencode+schema@2.1.4/node_modules/@opencode/schema/dist/project-id.js
var ProjectID = String5.pipe(brand("Project.ID"), annotate2({ identifier: "Project.ID" }), statics((schema) => ({ global: schema.make("global") })));

// ../../node_modules/.bun/@opencode+schema@2.1.4/node_modules/@opencode/schema/dist/workspace-id.js
var WorkspaceID = String5.check(isStartingWith("wrk")).pipe(brand("Workspace.ID"), annotate2({ identifier: "Workspace.ID" }), statics((schema) => {
  let create = () => schema.make("wrk_" + ascending());
  return {
    ascending: (id) => {
      if (!id)
        return create();
      return schema.make(id);
    },
    create
  };
}));

// ../../node_modules/.bun/@opencode+schema@2.1.4/node_modules/@opencode/schema/dist/location.js
var Ref = Struct({
  directory: AbsolutePath,
  workspaceID: optional3(WorkspaceID)
}).annotate({ identifier: "Location.Ref" }), PublicRef = Struct(omit(Ref.fields, ["workspaceID"])).annotate({
  identifier: "Location.PublicRef"
});

class Info extends Class3("Location.Info")({
  directory: AbsolutePath,
  workspaceID: optional3(WorkspaceID),
  project: Struct({
    id: ProjectID,
    directory: AbsolutePath,
    canonical: AbsolutePath
  })
}) {
}
var PublicInfo = Struct(omit(Info.fields, ["workspaceID"])).annotate({
  identifier: "Location.PublicInfo"
});

// ../../node_modules/.bun/@opencode+schema@2.1.4/node_modules/@opencode/schema/dist/event.js
var ID = String5.check(isStartingWith("evt_")).pipe(brand("Event.ID"), annotate2({ identifier: "Event.ID" }), statics((schema) => ({ create: () => schema.make("evt_" + ascending()) }))), Seq = Int.check(isGreaterThanOrEqualTo3(0)).pipe(brand("Event.Seq"), annotate2({ identifier: "Event.Seq" })), Version = Int.check(isGreaterThanOrEqualTo3(1)).pipe(brand("Event.Version"), annotate2({ identifier: "Event.Version" })), DurableEnvelope = Struct({ aggregateID: String5, seq: Seq, version: Version });
function durable(input) {
  let data = Struct(input.schema), durable = Struct({
    aggregateID: DurableEnvelope.fields.aggregateID,
    seq: DurableEnvelope.fields.seq,
    version: Literal2(input.durable.version).pipe(decodeTo2(toType2(Version), transform2({
      decode: () => Version.make(input.durable.version),
      encode: () => input.durable.version
    })))
  });
  return Struct({
    id: ID,
    created: Finite,
    metadata: optional3(Record(String5, Unknown2)),
    type: Literal2(input.type),
    durable,
    location: optional3(Ref),
    data
  }).annotate({ identifier: input.identifier ?? input.type }).pipe(statics(() => ({
    type: input.type,
    durability: "durable",
    durable: input.durable,
    data
  })));
}
function ephemeral(input) {
  let data = Struct(input.schema);
  return Struct({
    id: ID,
    created: Finite,
    metadata: optional3(Record(String5, Unknown2)),
    type: Literal2(input.type),
    location: optional3(Ref),
    data
  }).annotate({ identifier: input.identifier ?? input.type }).pipe(statics(() => ({
    type: input.type,
    durability: "ephemeral",
    durable: void 0,
    data
  })));
}
function inventory(...definitions) {
  return Object.freeze(definitions);
}

// ../../node_modules/.bun/@opencode+schema@2.1.4/node_modules/@opencode/schema/dist/form.js
var IDSchema = String5.check(isStartingWith("frm_")).pipe(brand("Form.ID"), annotate2({ identifier: "Form.ID" })), ID2 = IDSchema.pipe(statics((schema) => ({ create: (id) => schema.make(id ?? "frm_" + ascending()) }))), Metadata = Record(String5, Unknown2).annotate({ identifier: "Form.Metadata" }), Option = Struct({
  value: String5,
  label: String5,
  description: String5.pipe(optional3)
}).annotate({ identifier: "Form.Option" }), When = Struct({
  key: String5,
  op: Literals(["eq", "neq"]),
  value: Union2([String5, Number5, Boolean3])
}).annotate({ identifier: "Form.When" }), FieldBase = {
  key: String5,
  title: String5.pipe(optional3),
  description: String5.pipe(optional3),
  required: Boolean3.pipe(optional3),
  hidden: Boolean3.pipe(optional3).annotate({
    description: "Skip the interactive authentication prompt and use the default unless an answer is supplied"
  }),
  when: ArraySchema(When).pipe(optional3)
}, StringField = Struct({
  ...FieldBase,
  type: Literal2("string"),
  format: Literals(["email", "uri", "date", "date-time"]).pipe(optional3),
  minLength: NonNegativeInt.pipe(optional3),
  maxLength: NonNegativeInt.pipe(optional3),
  pattern: String5.pipe(optional3),
  placeholder: String5.pipe(optional3),
  default: String5.pipe(optional3),
  options: ArraySchema(Option).pipe(optional3),
  custom: Boolean3.pipe(optional3)
}).annotate({ identifier: "Form.StringField" }), NumberField = Struct({
  ...FieldBase,
  type: Literal2("number"),
  minimum: Number5.pipe(optional3),
  maximum: Number5.pipe(optional3),
  default: Number5.pipe(optional3)
}).annotate({ identifier: "Form.NumberField" }), IntegerField = Struct({
  ...FieldBase,
  type: Literal2("integer"),
  minimum: Number5.pipe(optional3),
  maximum: Number5.pipe(optional3),
  default: Number5.pipe(optional3)
}).annotate({ identifier: "Form.IntegerField" }), BooleanField = Struct({
  ...FieldBase,
  type: Literal2("boolean"),
  default: Boolean3.pipe(optional3)
}).annotate({ identifier: "Form.BooleanField" }), MultiselectField = Struct({
  ...FieldBase,
  type: Literal2("multiselect"),
  options: ArraySchema(Option),
  minItems: NonNegativeInt.pipe(optional3),
  maxItems: NonNegativeInt.pipe(optional3),
  custom: Boolean3.pipe(optional3),
  default: ArraySchema(String5).pipe(optional3)
}).annotate({ identifier: "Form.MultiselectField" }), ExternalField = Struct({
  key: String5,
  type: Literal2("external"),
  url: String5,
  title: String5.pipe(optional3),
  description: String5.pipe(optional3)
}).annotate({ identifier: "Form.ExternalField" }), Field = Union2([
  StringField,
  NumberField,
  IntegerField,
  BooleanField,
  MultiselectField,
  ExternalField
]).pipe(toTaggedUnion("type"), annotate2({ identifier: "Form.Field" })), Fields = NonEmptyArray(Field).annotate({ identifier: "Form.Fields" }), InfoBase = {
  id: ID2,
  sessionID: String5,
  title: String5,
  metadata: Metadata.pipe(optional3)
}, Info2 = Struct({
  ...InfoBase,
  fields: Fields
}).annotate({ identifier: "Form.Info" }), Value = Union2([String5, Number5, Boolean3, ArraySchema(String5)]).annotate({
  identifier: "Form.Value"
}), Answer = Record(String5, Value).annotate({ identifier: "Form.Answer" }), State = Union2([
  Struct({ status: Literal2("pending") }),
  Struct({ status: Literal2("answered"), answer: Answer }),
  Struct({ status: Literal2("cancelled"), message: String5.pipe(optional3) })
]).pipe(toTaggedUnion("status")).annotate({ identifier: "Form.State" }), Detail = Struct({
  ...Info2.fields,
  state: State
}).annotate({ identifier: "Form.Detail" }), Reply = Struct({
  answer: Answer
}).annotate({ identifier: "Form.Reply" }), Created = ephemeral({ type: "form.created", schema: { form: Info2 } }), Replied = ephemeral({ type: "form.replied", schema: { id: ID2, sessionID: String5, answer: Answer } }), Cancelled = ephemeral({ type: "form.cancelled", schema: { id: ID2, sessionID: String5 } }), Event = { Created, Replied, Cancelled, Definitions: inventory(Created, Replied, Cancelled) };

// ../../node_modules/.bun/@opencode+schema@2.1.4/node_modules/@opencode/schema/dist/rpc.js
function define(definition) {
  let reserved = Object.values(definition.methods).flatMap((method) => Object.keys(method.errors ?? {})).find((name) => name.startsWith("rpc."));
  if (reserved)
    throw Error(`RPC error names starting with "rpc." are reserved: ${reserved}`);
  return definition;
}

// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/core/util.js
function getEnumValues(entries) {
  let numericValues = Object.values(entries).filter((v) => typeof v === "number");
  return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
}
function joinValues(array, separator = "|") {
  return array.map((val) => stringifyPrimitive(val)).join(separator);
}
function jsonStringifyReplacer(_, value) {
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
function nullish(input) {
  return input === null || input === void 0;
}
function cleanRegex(source) {
  let start = source.startsWith("^") ? 1 : 0, end = source.endsWith("$") ? source.length - 1 : source.length;
  return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
  let ratio = val / step, roundedRatio = Math.round(ratio), tolerance = 4 * Number.EPSILON * Math.max(Math.abs(ratio), 1);
  if (Math.abs(ratio - roundedRatio) < tolerance)
    return 0;
  return ratio - roundedRatio;
}
var EVALUATING = /* @__PURE__ */ Symbol("evaluating");
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
      return assignProp(this, key, value), value;
    },
    enumerable: !0,
    configurable: !0
  });
}
function putProp(target, key, value) {
  if (key in target)
    assignProp(target, key, value);
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
function isObject2(data) {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}
var allowsEval = /* @__PURE__ */ cached2(() => {
  if (globalConfig.jitless)
    return !1;
  if (typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare"))
    return !1;
  try {
    return new Function(""), !0;
  } catch (_) {
    return !1;
  }
});
function isPlainObject(o) {
  if (isObject2(o) === !1)
    return !1;
  let ctor = o.constructor;
  if (ctor === void 0)
    return !0;
  if (typeof ctor !== "function")
    return !0;
  let prot = ctor.prototype;
  if (isObject2(prot) === !1)
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
  if (o instanceof Map)
    return new Map(o);
  if (o instanceof Set)
    return new Set(o);
  return o;
}
var propertyKeyTypes = /* @__PURE__ */ new Set(["string", "number", "symbol"]), primitiveTypes = /* @__PURE__ */ new Set([
  "string",
  "number",
  "bigint",
  "boolean",
  "symbol",
  "undefined"
]);
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
function stringifyPrimitive(value) {
  if (typeof value === "bigint")
    return value.toString() + "n";
  if (typeof value === "string")
    return `"${value}"`;
  return `${value}`;
}
function optionalKeys(shape) {
  return Object.keys(shape).filter((k) => shape[k]._zod.optin !== void 0 && shape[k]._zod.optout === "optional");
}
var NUMBER_FORMAT_RANGES = /* @__PURE__ */ (() => ({
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-340282346638528860000000000000000000000, 340282346638528860000000000000000000000],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
}))(), BIGINT_FORMAT_RANGES = {
  int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
  uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
};
function pick(schema, mask) {
  let currDef = schema._zod.def, checks = currDef.checks;
  if (checks && checks.length > 0)
    throw Error(".pick() cannot be used on object schemas containing refinements");
  let newShape = {};
  return mirrorShape(newShape, schema, maskedKeys(schema, mask)), clone(schema, mergeDefs(currDef, { shape: newShape, checks: [] }));
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
function omit3(schema, mask) {
  let currDef = schema._zod.def, checks = currDef.checks;
  if (checks && checks.length > 0)
    throw Error(".omit() cannot be used on object schemas containing refinements");
  let omitted = new Set(maskedKeys(schema, mask)), newShape = {};
  return mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)).filter((key) => !omitted.has(key))), clone(schema, mergeDefs(currDef, { shape: newShape, checks: [] }));
}
function extend(schema, shape) {
  if (!isPlainObject(shape))
    throw Error("Invalid input to extend: expected a plain object");
  let checks = schema._zod.def.checks;
  if (checks && checks.length > 0) {
    let existingShape = sourceShape(schema);
    for (let key of Reflect.ownKeys(shape))
      if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0)
        throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
  }
  return clone(schema, mergeDefs(schema._zod.def, { shape: extended(schema, shape) }));
}
function extended(schema, shape) {
  let newShape = {};
  return mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema))), mirrorProps(newShape, shape), newShape;
}
function safeExtend(schema, shape) {
  if (!isPlainObject(shape))
    throw Error("Invalid input to safeExtend: expected a plain object");
  return clone(schema, mergeDefs(schema._zod.def, { shape: extended(schema, shape) }));
}
function merge2(a, b) {
  if (!b?._zod?.def)
    throw Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
  if (a._zod.def.checks?.length)
    throw Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
  let newShape = {};
  mirrorShape(newShape, a, Reflect.ownKeys(sourceShape(a))), mirrorShape(newShape, b, Reflect.ownKeys(sourceShape(b)));
  let def = mergeDefs(a._zod.def, {
    shape: newShape,
    get catchall() {
      return b._zod.def.catchall;
    },
    checks: b._zod.def.checks ?? []
  });
  return clone(a, def);
}
function partial(Class, schema, mask, name = "partial") {
  let checks = schema._zod.def.checks;
  if (checks && checks.length > 0)
    throw Error(`.${name}() cannot be used on object schemas containing refinements`);
  let selected = mask ? new Set(maskedKeys(schema, mask)) : void 0, newShape = {};
  return mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), Class && ((value, key) => selected && !selected.has(key) ? value : new Class({ type: "optional", innerType: value }))), clone(schema, mergeDefs(schema._zod.def, { shape: newShape, checks: [] }));
}
function required(Class, schema, mask) {
  let selected = mask ? new Set(maskedKeys(schema, mask)) : void 0, newShape = {};
  return mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), (value, key) => selected && !selected.has(key) ? value : new Class({ type: "nonoptional", innerType: value })), clone(schema, mergeDefs(schema._zod.def, { shape: newShape }));
}
function aborted(x, startIndex = 0) {
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
function prefixIssues(path, issues) {
  return issues.map((iss) => {
    var _a;
    return (_a = iss).path ?? (_a.path = []), iss.path.unshift(path), iss;
  });
}
function unwrapMessage(message) {
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
function finalizeIssue(iss, ctx, config) {
  var _a;
  let traits = iss.inst?._zod?.traits;
  if (traits?.has("$ZodType"))
    if (traits.has("$ZodCheck"))
      (_a = iss).schema ?? (_a.schema = iss.inst);
    else
      iss.schema = iss.inst;
  let schemaError = iss.schema !== iss.inst ? iss.schema?._zod.def?.error : void 0, message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(schemaError?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input", full = {};
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
function getLengthableOrigin(input) {
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
var _a;
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
function $constructor(name, initializer, proto, params) {
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
(_a = globalThis).__zod_globalConfig ?? (_a.__zod_globalConfig = {});
var globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
  if (newConfig)
    Object.assign(globalConfig, newConfig);
  return globalConfig;
}
// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/core/errors.js
function _getMessage() {
  let internals = this._zod;
  return internals.message ?? (internals.message = JSON.stringify(internals.def, jsonStringifyReplacer, 2)), internals.message;
}
function _setMessage(value) {
  this._zod.message = value;
}
var _messageDesc = {
  get: _getMessage,
  set: _setMessage,
  enumerable: !0,
  configurable: !0
}, _issuesDesc = { value: void 0, enumerable: !1 }, _installedToString = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]), initializer = (inst, def) => {
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
}, $ZodError = $constructor("$ZodError", initializer), $ZodRealError = $constructor("$ZodError", initializer, void 0, {
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
function flattenError(error, mapper = (issue) => issue.message) {
  let fieldErrors = {}, formErrors = [];
  for (let sub of error.issues)
    if (sub.path.length > 0)
      node(fieldErrors, sub.path[0], () => []).push(mapper(sub));
    else
      formErrors.push(mapper(sub));
  return { formErrors, fieldErrors };
}
function formatError(error, mapper = (issue) => issue.message) {
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
var _parse = (_Err) => {
  let fn = (schema, value, _ctx, _params) => {
    let ctx = _ctx ? { ..._ctx, async: !1 } : { async: !1 }, result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
      throw new $ZodAsyncError;
    if (result.issues.length) {
      let e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
      throw captureStackTrace(e, _params?.callee ?? fn), e;
    }
    return result.value;
  };
  return fn;
};
var _parseAsync = (_Err) => {
  let fn = async (schema, value, _ctx, params) => {
    let ctx = _ctx ? { ..._ctx, async: !0 } : { async: !0 }, result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
      result = await result;
    if (result.issues.length) {
      let e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
      throw captureStackTrace(e, params?.callee ?? fn), e;
    }
    return result.value;
  };
  return fn;
};
var _safeParse = (_Err) => (schema, value, _ctx) => {
  let ctx = _ctx ? { ..._ctx, async: !1 } : { async: !1 }, result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    throw new $ZodAsyncError;
  return result.issues.length ? failure(_Err, result.issues, ctx) : { success: !0, data: result.value };
};
function failure(Err, issues, ctx) {
  let error;
  return {
    success: !1,
    get error() {
      if (!error)
        error = new Err(issues.map((iss) => finalizeIssue(iss, ctx, config()))), issues = void 0, ctx = void 0;
      return error;
    },
    set error(e) {
      error = e, issues = void 0, ctx = void 0;
    }
  };
}
var _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
  let ctx = _ctx ? { ..._ctx, async: !0 } : { async: !0 }, result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length ? failure(_Err, result.issues, ctx) : { success: !0, data: result.value };
};
var COMPILE_INVALID = /* @__PURE__ */ Symbol.for("zod.compile.invalid"), COMPILE_FALLBACK = /* @__PURE__ */ Symbol.for("zod.compile.fallback"), validate2 = (schema, value, _ctx) => {
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
    throw new $ZodAsyncError;
  return result.issues.length === 0;
}
var validateAsync = async (schema, value, _ctx) => {
  let ctx = _ctx ? { ..._ctx, async: !0, abortEarly: !0 } : { async: !0, abortEarly: !0 }, result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length === 0;
}, _encode = (_Err) => {
  let parse = _parse(_Err), fn = (schema, value, _ctx, _params) => {
    let ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
    return parse(schema, value, ctx, finalizeParams(fn, _params));
  };
  return fn;
};
var _decode = (_Err) => {
  let parse = _parse(_Err), fn = (schema, value, _ctx, _params) => parse(schema, value, _ctx, finalizeParams(fn, _params));
  return fn;
};
var _encodeAsync = (_Err) => {
  let parseAsync = _parseAsync(_Err), fn = async (schema, value, _ctx, _params) => {
    let ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
    return await parseAsync(schema, value, ctx, finalizeParams(fn, _params));
  };
  return fn;
};
var _decodeAsync = (_Err) => {
  let parseAsync = _parseAsync(_Err), fn = async (schema, value, _ctx, _params) => await parseAsync(schema, value, _ctx, finalizeParams(fn, _params));
  return fn;
};
var _safeEncode = (_Err) => (schema, value, _ctx) => {
  let ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParse(_Err)(schema, value, ctx);
};
var _safeDecode = (_Err) => (schema, value, _ctx) => _safeParse(_Err)(schema, value, _ctx);
var _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
  let ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParseAsync(_Err)(schema, value, ctx);
};
var _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => _safeParseAsync(_Err)(schema, value, _ctx);
// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/core/regexes.js
var cuid = /^[cC][0-9a-z]{6,}$/, cuid2 = /^[0-9a-z]+$/, ulid = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/, xid = /^[0-9a-vA-V]{20}$/, ksuid = /^[A-Za-z0-9]{27}$/, nanoid = /^[a-zA-Z0-9_-]{21}$/;
function nanoidOfLength(length) {
  return new RegExp(`^[a-zA-Z0-9_-]{${length}}$`);
}
var duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
var guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, uuid = (version) => {
  if (!version)
    return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
  return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
var email = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
var _emoji = "^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$";
function emoji() {
  return new RegExp(_emoji, "u");
}
var ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
var cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, base64url = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/;
var httpProtocol = /^https?$/, e164 = /^\+[1-9]\d{6,14}$/;
var dateSource = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))";
function anchor(source) {
  return new RegExp(`^${source}$`);
}
var date = /* @__PURE__ */ anchor(dateSource);
function timeSource(args) {
  return typeof args.precision === "number" ? args.precision === -1 ? "(?:[01]\\d|2[0-3]):[0-5]\\d" : args.precision === 0 ? "(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d" : `(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d\\.\\d{${args.precision}}` : args.seconds ? "(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:\\.\\d+)?" : "(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?";
}
function time(args) {
  return new RegExp(`^${timeSource(args)}$`);
}
function datetime(args) {
  let opts = ["Z"];
  if (args.offset)
    opts.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
  let qualified = `${timeSource({ precision: args.precision, seconds: !0 })}(?:${opts.join("|")})`, timeRegex = args.local ? `${qualified}|${timeSource({ precision: args.precision })}` : qualified;
  return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
var anyString = /^[\s\S]{0,}$/, string3 = (params) => {
  let regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : "[\\s\\S]*";
  return new RegExp(`^${regex}$`);
};
var integer = /^-?\d+$/, number3 = /^-?\d+(?:\.\d+)?$/, boolean2 = /^(?:true|false)$/i, _null = /^null$/i;
var _undefined = /^undefined$/i;
var lowercase = /^[^A-Z]*$/, uppercase = /^[^a-z]*$/;

// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/core/checks.js
var $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
  var _a;
  inst._zod ?? (inst._zod = {}), inst._zod.def = def, (_a = inst._zod).onattach ?? (_a.onattach = []);
});
var _whenHasLength = (payload) => {
  let val = payload.value;
  return !nullish(val) && val.length !== void 0;
}, numericOriginMap = {
  number: "number",
  bigint: "bigint",
  object: "date"
}, $ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  let origin = numericOriginMap[typeof def.value];
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value <= def.value : payload.value < def.value)
      return;
    payload.issues.push({
      origin: numericOriginMap[typeof payload.value] ?? origin,
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
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value >= def.value : payload.value > def.value)
      return;
    payload.issues.push({
      origin: numericOriginMap[typeof payload.value] ?? origin,
      code: "too_small",
      minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
}), $ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def) => {
  $ZodCheck.init(inst, def), inst._zod.check = (payload) => {
    if (typeof payload.value !== typeof def.value)
      throw Error("Cannot mix number and bigint in multiple_of check.");
    if (typeof payload.value === "bigint" ? def.value !== BigInt(0) && payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0)
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
var $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def), (_a = inst._zod.def).when ?? (_a.when = _whenHasLength), inst._zod.check = (payload) => {
    let input = payload.value, units = input.length;
    if ((typeof input === "string" && units > def.maximum ? codePointLength(input) : units) <= def.maximum)
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
  $ZodCheck.init(inst, def), (_a = inst._zod.def).when ?? (_a.when = _whenHasLength), inst._zod.check = (payload) => {
    let input = payload.value, units = input.length;
    if ((typeof input === "string" && units >= def.minimum && units < def.minimum * 2 ? codePointLength(input) : units) >= def.minimum)
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
  $ZodCheck.init(inst, def), (_a = inst._zod.def).when ?? (_a.when = _whenHasLength), inst._zod.check = (payload) => {
    let input = payload.value, units = input.length, length = typeof input === "string" && units >= def.length && units <= def.length * 2 ? codePointLength(input) : units;
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
  if ($ZodCheck.init(inst, def), def.pattern)
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
  let escapedRegex = escapeRegex(def.includes), pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position},}${escapedRegex}` : escapedRegex);
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
}), $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  let pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
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
}), $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  let pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
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
function handleCheckPropertyResult(result, payload, property) {
  if (result.issues.length)
    payload.issues.push(...prefixIssues(property, result.issues));
}
var $ZodCheckProperties = /* @__PURE__ */ $constructor("$ZodCheckProperties", (inst, def) => {
  $ZodCheck.init(inst, def), hide(inst, Symbol.iterator, function* () {
    yield inst;
  });
  let entries;
  inst._zod.check = (payload) => {
    if (payload.value == null) {
      payload.issues.push({ expected: "object", code: "invalid_type", input: payload.value, inst });
      return;
    }
    entries ?? (entries = Reflect.ownKeys(def.shape).map((key) => [key, def.shape[key]]));
    let input = payload.value, proms;
    for (let [key, schema] of entries) {
      let result = schema._zod.run({ value: input[key], issues: [] }, {});
      if (result instanceof Promise)
        proms ?? (proms = []), proms.push(result.then((result) => handleCheckPropertyResult(result, payload, key)));
      else
        handleCheckPropertyResult(result, payload, key);
    }
    if (proms)
      return Promise.all(proms).then(() => {
        return;
      });
    return;
  };
});
var $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
  $ZodCheck.init(inst, def), inst._zod.check = (payload) => {
    payload.value = def.tx(payload.value);
  };
});

// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/core/doc.js
class Doc {
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
var version = {
  major: 4,
  minor: 6,
  patch: 7
};

// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/core/schemas.js
var $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
  var _a;
  inst ?? (inst = {}), inst._zod.def = def, inst._zod.bag = inst._zod.bag || {}, inst._zod.version = version;
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
      let isAborted = aborted(payload), asyncResult;
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
          throw new $ZodAsyncError;
        if (asyncResult || _ instanceof Promise)
          asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
            if (await _, payload.issues.length === currLen)
              return;
            if (attachSchema(payload.issues, currLen, inst), !isAborted)
              isAborted = aborted(payload, currLen);
          });
        else {
          if (payload.issues.length === currLen)
            continue;
          if (attachSchema(payload.issues, currLen, inst), !isAborted)
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
}, {
  get "~standard"() {
    return hide(this, "~standard", standardProps(this));
  },
  set "~standard"(value) {
    own(this, "~standard", value);
  }
}), toStandardResult = (r, ctx) => r.issues.length ? { issues: r.issues.map((iss) => finalizeIssue(iss, ctx, config())) } : { value: r.value };
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
var $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
  $ZodType.init(inst, def), inst._zod.pattern = def.pattern ?? anyString, inst._zod.parse = (payload, _) => {
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
var $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
  $ZodStringFormat.init(inst, def), inst._zod.check = (payload) => {
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
}), $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
  def.pattern ?? (def.pattern = emoji()), $ZodStringFormat.init(inst, def);
}), $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
  if (def.length !== void 0 && (!Number.isInteger(def.length) || def.length < 1))
    throw Error(`Invalid nanoid length: ${def.length}`);
  def.pattern ?? (def.pattern = def.length === void 0 ? nanoid : nanoidOfLength(def.length)), $ZodStringFormat.init(inst, def);
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
  def.pattern ?? (def.pattern = ipv4), $ZodStringFormat.init(inst, def);
}), ipv6Alphabet = /^[0-9a-fA-F:.]+$/;
function isValidIPv6(value) {
  if (!ipv6Alphabet.test(value))
    return !1;
  return canParseURL(`http://[${value}]`);
}
var $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
  def.pattern ?? (def.pattern = ipv6), $ZodStringFormat.init(inst, def), inst._zod.check = (payload) => {
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
var $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv4), $ZodStringFormat.init(inst, def);
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
var $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv6), $ZodStringFormat.init(inst, def), inst._zod.check = (payload) => {
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
function isValidBase64(data) {
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
var base64Charset = /^[0-9a-zA-Z+/]*={0,2}$/, $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
  def.pattern ?? (def.pattern = base64Charset), $ZodStringFormat.init(inst, def), inst._zod.check = (payload) => {
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
}), base64urlCharset = /^[A-Za-z0-9_-]*$/;
function isValidBase64URL(data) {
  if (!base64urlCharset.test(data))
    return !1;
  let base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/"), padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return isValidBase64(padded);
}
var $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
  def.pattern ?? (def.pattern = base64urlCharset), $ZodStringFormat.init(inst, def), inst._zod.check = (payload) => {
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
  $ZodType.init(inst, def), inst._zod.pattern = number3, inst._zod.parse = (payload, _ctx) => {
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
}), $ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumberFormat", (inst, def) => {
  $ZodCheckNumberFormat.init(inst, def), $ZodNumber.init(inst, def);
}), $ZodBoolean = /* @__PURE__ */ $constructor("$ZodBoolean", (inst, def) => {
  $ZodType.init(inst, def), inst._zod.pattern = boolean2, inst._zod.parse = (payload, _ctx) => {
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
var $ZodUndefined = /* @__PURE__ */ $constructor("$ZodUndefined", (inst, def) => {
  $ZodType.init(inst, def), inst._zod.pattern = _undefined, inst._zod.values = /* @__PURE__ */ new Set([void 0]), inst._zod.parse = (payload, _ctx) => {
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
}), $ZodNull = /* @__PURE__ */ $constructor("$ZodNull", (inst, def) => {
  $ZodType.init(inst, def), inst._zod.pattern = _null, inst._zod.values = /* @__PURE__ */ new Set([null]), inst._zod.parse = (payload, _ctx) => {
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
function handleArrayResult(result, final, index) {
  if (result.issues.length)
    final.issues.push(...prefixIssues(index, result.issues));
  final.value[index] = result.value;
}
var $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
  $ZodType.init(inst, def);
  let memo = globalConfig.memoizer;
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
        proms.push(result.then((result) => handleArrayResult(result, payload, i)));
      else if (handleArrayResult(result, payload, i), abortEarly && result.issues.length !== 0 && aborted(result))
        break;
    }
    if (proms.length)
      return Promise.all(proms).then(() => payload);
    return payload;
  }, capSize(inst, arraySize);
});
function handlePropertyResult(result, final, key, input, optin, optout) {
  let isPresent = key in input, isOptionalOut = optout === "optional";
  if (!isPresent && isOptionalOut && optin === "optional")
    return;
  if (result.issues.length) {
    if (optin !== void 0 && isOptionalOut && !isPresent)
      return;
    final.issues.push(...prefixIssues(key, result.issues));
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
function normalizeDef(def) {
  let keys = Object.keys(def.shape), ownSymbols = Object.getOwnPropertySymbols(def.shape), symbolKeys = ownSymbols.length ? ownSymbols : NO_SYMBOL_KEYS, allKeys = symbolKeys.length ? [...keys, ...symbolKeys] : keys;
  for (let k of allKeys)
    if (!def.shape?.[k]?._zod?.traits?.has("$ZodType"))
      throw Error(`Invalid element at key "${String(k)}": expected a Zod schema`);
  let okeys = optionalKeys(def.shape);
  return {
    ...def,
    allKeys,
    symbolKeys,
    keySet: new Set(keys),
    numKeys: keys.length,
    optionalKeys: new Set(okeys)
  };
}
function handleCatchall(proms, input, payload, ctx, def, inst, abortEarly) {
  let unrecognized = [], keySet = def.keySet, _catchall = def.catchall._zod, t = _catchall.def.type, { optin, optout } = _catchall, seen = 0;
  for (let key in input) {
    if (abortEarly && payload.issues.length !== seen) {
      if (aborted(payload, seen))
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
      proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
    else
      handlePropertyResult(r, payload, key, input, optin, optout);
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
var $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
  $ZodType.init(inst, def);
  let desc = Object.getOwnPropertyDescriptor(def, "shape"), sh = desc?.get ? desc.get.raw : def.shape ?? {};
  if (sh) {
    let get = () => {
      let newSh = { ...sh };
      return Object.defineProperty(def, "shape", { value: newSh }), get.raw = newSh, newSh;
    };
    get.raw = sh, Object.defineProperty(def, "shape", { get });
  }
  let _normalized = cached2(() => normalizeDef(def));
  defineLazyInternal(inst, "propValues", (zod) => {
    let shape = zod.def.shape, propValues = {};
    for (let key in shape) {
      let field = shape[key]._zod;
      if (field.values) {
        if (!Object.prototype.hasOwnProperty.call(propValues, key))
          assignProp(propValues, key, /* @__PURE__ */ new Set);
        for (let v of field.values)
          propValues[key].add(v);
        if (field.optin !== void 0)
          propValues[key].add(void 0);
      }
    }
    return propValues;
  });
  let isObject = isObject2, catchall = def.catchall, value, memo = globalConfig.memoizer;
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
        if (aborted(payload, seen))
          break;
        seen = payload.issues.length;
      }
      if (key === "__proto__")
        continue;
      let el = shape[key], optin = el._zod.optin, optout = el._zod.optout, r = el._zod.run({ value: input[key], issues: [] }, ctx);
      if (r instanceof Promise)
        proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
      else
        handlePropertyResult(r, payload, key, input, optin, optout);
    }
    if (!catchall)
      return proms.length ? Promise.all(proms).then(() => payload) : payload;
    return handleCatchall(proms, input, payload, ctx, _normalized.value, inst, abortEarly === !0);
  };
}), $ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def) => {
  $ZodObject.init(inst, def);
  let superParse = inst._zod.parse, _normalized = cached2(() => normalizeDef(def)), memo = globalConfig.memoizer, generateFastpass = (shape) => {
    let normalized = _normalized.value, syms = normalized.symbolKeys, doc = new Doc(["payload", "ctx"], { shape, inst, memo, syms }), parseStr = (k) => `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`, prefixStr = (id, k) => `
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
      let id = ids[key], k = typeof key === "symbol" ? `syms[${syms.indexOf(key)}]` : esc(key), isPresent = `${k} in input`, schema = shape[key], optin = schema?._zod?.optin, isOptionalIn = optin !== void 0, isOptionalOut = schema?._zod?.optout === "optional";
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
  }, fastpass, isObject = isObject2, jit = !globalConfig.jitless, fastEnabled = jit && allowsEval.value, catchall = def.catchall, value;
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
      return handleCatchall([], input, payload, ctx, value, inst, ctx?.abortEarly === !0);
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
  $ZodType.init(inst, def), defineLazyInternal(inst, "optin", (zod) => zod.def.options.some((o) => o._zod.optin === "defaulted") ? "defaulted" : zod.def.options.some((o) => o._zod.optin !== void 0) ? "optional" : void 0), defineLazyInternal(inst, "optout", (zod) => zod.def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0), defineLazyInternal(inst, "values", (zod) => {
    if (zod.def.options.every((o) => o._zod.values))
      return new Set(zod.def.options.flatMap((option) => Array.from(option._zod.values)));
    return;
  }), defineLazyInternal(inst, "pattern", (zod) => {
    if (zod.def.options.every((o) => o._zod.pattern)) {
      let patterns = zod.def.options.map((o) => o._zod.pattern);
      return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
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
      return handleUnionResults(results, payload, inst, ctx);
    return Promise.all(results).then((results) => handleUnionResults(results, payload, inst, ctx));
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
var $ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("$ZodDiscriminatedUnion", (inst, def) => {
  def.inclusive = !1, $ZodUnion.init(inst, def);
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
          assignProp(propValues, k, /* @__PURE__ */ new Set);
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
    if (!isObject2(input))
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
}), $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
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
    if (Object.prototype.hasOwnProperty.call(newObj, "__proto__"))
      delete newObj.__proto__;
    for (let key of sharedKeys) {
      if (key === "__proto__")
        continue;
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
  let merged = mergeValues(left.value, right.value);
  if (!merged.valid) {
    if (aborted(result))
      return result;
    throw Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
  }
  return result.value = merged.data, result;
}
var $ZodRecord = /* @__PURE__ */ $constructor("$ZodRecord", (inst, def) => {
  $ZodType.init(inst, def);
  let memo = globalConfig.memoizer;
  memo?.attach(inst), inst._zod.parse = (payload, ctx) => {
    let input = payload.value;
    if (!isPlainObject(input))
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
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
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
                payload.issues.push(...prefixIssues(key, result.issues));
              payload.value[outKey] = result.value;
            }));
          else {
            if (result.issues.length)
              payload.issues.push(...prefixIssues(key, result.issues));
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
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
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
              payload.issues.push(...prefixIssues(key, result.issues));
            payload.value[outKey] = result.value;
          }));
        else {
          if (result.issues.length)
            payload.issues.push(...prefixIssues(key, result.issues));
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
var $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
  $ZodType.init(inst, def);
  let values = getEnumValues(def.entries), valuesSet = new Set(values);
  inst._zod.values = valuesSet, defineLazyInternal(inst, "pattern", (zod) => {
    let patternValues = getEnumValues(zod.def.entries).filter((k) => propertyKeyTypes.has(typeof k));
    return new RegExp(patternValues.length ? `^(${patternValues.map((o) => escapeRegex(o.toString())).join("|")})$` : "^[^\\s\\S]$");
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
}), $ZodLiteral = /* @__PURE__ */ $constructor("$ZodLiteral", (inst, def) => {
  $ZodType.init(inst, def);
  let values = new Set(def.values);
  inst._zod.values = values, defineLazyInternal(inst, "pattern", (zod) => {
    let vals = zod.def.values;
    return new RegExp(vals.length ? `^(${vals.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$` : "^[^\\s\\S]$");
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
var $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
  $ZodType.init(inst, def), inst._zod.optin = "optional", globalConfig.memoizer?.guard(inst), inst._zod.parse = (payload, ctx) => {
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
function handleOptionalResult(payload, result) {
  return payload.value = result.issues.length ? void 0 : result.value, payload;
}
var $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
  $ZodType.init(inst, def), defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional"), inst._zod.optout = "optional", defineLazyInternal(inst, "values", (zod) => {
    let values = zod.def.innerType._zod.values;
    return values ? /* @__PURE__ */ new Set([...values, void 0]) : void 0;
  }), defineLazyInternal(inst, "pattern", (zod) => {
    let pattern = zod.def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
  }), inst._zod.parse = (payload, ctx) => {
    if (payload.value === void 0) {
      if (def.innerType._zod.optin !== "defaulted")
        return payload;
      let result = def.innerType._zod.run({ value: payload.value, issues: [] }, ctx);
      if (result instanceof Promise)
        return result.then((result) => handleOptionalResult(payload, result));
      return handleOptionalResult(payload, result);
    }
    return def.innerType._zod.run(payload, ctx);
  };
}), $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
  $ZodOptional.init(inst, def), defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values), defineLazyInternal(inst, "pattern", (zod) => zod.def.innerType._zod.pattern), inst._zod.parse = (payload, ctx) => def.innerType._zod.run(payload, ctx);
}), $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
  $ZodType.init(inst, def), defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin), defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout), defineLazyInternal(inst, "pattern", (zod) => {
    let pattern = zod.def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
  }), defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values ? /* @__PURE__ */ new Set([...zod.def.innerType._zod.values, null]) : void 0), inst._zod.parse = (payload, ctx) => {
    if (payload.value === null)
      return payload;
    return def.innerType._zod.run(payload, ctx);
  };
}), $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
  $ZodType.init(inst, def), inst._zod.optin = "defaulted", defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values), inst._zod.parse = (payload, ctx) => {
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
  $ZodType.init(inst, def), inst._zod.optin = "defaulted", defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values), inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward")
      return def.innerType._zod.run(payload, ctx);
    if (payload.value === void 0)
      payload.value = def.defaultValue;
    return def.innerType._zod.run(payload, ctx);
  };
}), $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
  $ZodType.init(inst, def), defineLazyInternal(inst, "values", (zod) => {
    let v = zod.def.innerType._zod.values;
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
      issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
    },
    input: payload.value
  }), payload;
}
var $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
  $ZodType.init(inst, def), defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional"), defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout), defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values), inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward")
      return def.innerType._zod.run(payload, ctx);
    let result = def.innerType._zod.run({ value: payload.value, issues: [] }, ctx);
    if (result instanceof Promise)
      return result.then((result) => handleCatchResult(payload, result, def, ctx));
    return handleCatchResult(payload, result, def, ctx);
  };
}), $ZodNaN = /* @__PURE__ */ $constructor("$ZodNaN", (inst, def) => {
  $ZodType.init(inst, def), inst._zod.parse = (payload, _ctx) => {
    if (typeof payload.value !== "number" || !Number.isNaN(payload.value))
      return payload.issues.push({
        input: payload.value,
        inst,
        expected: "nan",
        code: "invalid_type"
      }), payload;
    return payload;
  };
}), $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
  $ZodType.init(inst, def), defineLazyInternal(inst, "values", (zod) => zod.def.in._zod.values), defineLazyInternal(inst, "optin", (zod) => zod.def.in._zod.optin), defineLazyInternal(inst, "optout", (zod) => zod.def.out._zod.optout), defineLazyInternal(inst, "propValues", (zod) => zod.def.in._zod.propValues), inst._zod.parse = (payload, ctx) => {
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
  if (left.issues.some((iss) => iss.code !== "unrecognized_keys"))
    return left.aborted = !0, left;
  return next._zod.run({ value: left.value, issues: left.issues }, ctx);
}
var $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
  $ZodType.init(inst, def), defineLazyInternal(inst, "propValues", (zod) => zod.def.innerType._zod.propValues), defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values), defineLazyInternal(inst, "optin", (zod) => zod.def.innerType?._zod?.optin), defineLazyInternal(inst, "optout", (zod) => zod.def.innerType?._zod?.optout), inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward")
      return def.innerType._zod.run(payload, ctx);
    let result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise)
      return result.then(handleReadonlyResult);
    return handleReadonlyResult(result);
  };
});
function handleReadonlyResult(payload) {
  if (!payload.memo)
    payload.value = Object.freeze(payload.value);
  return payload;
}
function leafPattern(schema) {
  let def = schema._zod.def, pattern = def.pattern, isInt = !!def.format?.includes("int"), minimum, maximum;
  for (let ch of def.checks ?? []) {
    let d = ch._zod.def;
    if (d.pattern)
      pattern = d.pattern;
    isInt || (isInt = !!d.format?.includes("int"));
    let lo = d.minimum ?? d.length, hi = d.maximum ?? d.length;
    if (lo !== void 0 && (minimum === void 0 || lo > minimum))
      minimum = lo;
    if (hi !== void 0 && (maximum === void 0 || hi < maximum))
      maximum = hi;
  }
  if (pattern)
    return pattern.source;
  if (minimum !== void 0 && maximum !== void 0 && minimum > maximum)
    return "(?!)";
  if (minimum !== void 0 || maximum !== void 0)
    return string3({ minimum, maximum }).source;
  let own = schema._zod.pattern;
  return (isInt && own === number3 ? integer : own)?.source;
}
function partPattern(schema) {
  let def = schema._zod.def, own = schema._zod.pattern?.source, inner = def.innerType ?? schema._zod.innerType;
  if (inner) {
    let before = inner._zod.pattern?.source, after = partPattern(inner);
    if (own && before && after && after !== before)
      return own.replace(cleanRegex(before), () => cleanRegex(after));
    return own;
  }
  if (def.options) {
    let sources = def.options.map(partPattern);
    if (sources.every(Boolean))
      return `^(${sources.map((s) => cleanRegex(s)).join("|")})$`;
  }
  return leafPattern(schema);
}
var $ZodTemplateLiteral = /* @__PURE__ */ $constructor("$ZodTemplateLiteral", (inst, def) => {
  $ZodType.init(inst, def);
  let regexParts = [];
  for (let part of def.parts)
    if (typeof part === "object" && part !== null) {
      let source = partPattern(part);
      if (!source)
        throw Error(`Invalid template literal part, no pattern found: ${[...part._zod.traits].shift()}`);
      regexParts.push(cleanRegex(source));
    } else if (part === null || primitiveTypes.has(typeof part))
      regexParts.push(escapeRegex(`${part}`));
    else
      throw Error(`Invalid template literal part: ${part}`);
  inst._zod.pattern = new RegExp(`^${regexParts.join("")}$`), inst._zod.parse = (payload, _ctx) => {
    if (typeof payload.value !== "string")
      return payload.issues.push({
        input: payload.value,
        inst,
        expected: "string",
        code: "invalid_type"
      }), payload;
    if (inst._zod.pattern.lastIndex = 0, !inst._zod.pattern.test(payload.value))
      return payload.issues.push({
        input: payload.value,
        inst,
        code: "invalid_format",
        format: def.format ?? "template_literal",
        pattern: inst._zod.pattern.source
      }), payload;
    return payload;
  };
});
var $ZodLazy = /* @__PURE__ */ $constructor("$ZodLazy", (inst, def) => {
  $ZodType.init(inst, def), defineLazy(inst._zod, "innerType", () => {
    let d = def;
    if (!d._cachedInner)
      d._cachedInner = def.getter();
    return d._cachedInner;
  }), defineLazyInternal(inst, "pattern", (zod) => zod.innerType?._zod?.pattern), defineLazyInternal(inst, "propValues", (zod) => zod.innerType?._zod?.propValues), defineLazyInternal(inst, "optin", (zod) => zod.innerType?._zod?.optin ?? void 0), defineLazyInternal(inst, "optout", (zod) => zod.innerType?._zod?.optout ?? void 0), inst._zod.parse = (payload, ctx) => inst._zod.innerType._zod.run(payload, ctx);
}), $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
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
var _a2;
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
(_a2 = globalThis).__zod_globalRegistry ?? (_a2.__zod_globalRegistry = registry());
var globalRegistry = globalThis.__zod_globalRegistry;
// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/core/api.js
function snapshotChecks(def) {
  if (def.checks)
    def.checks = [...def.checks];
  return def;
}
function _string(Class, params) {
  return new Class(snapshotChecks({ type: "string", ...normalizeParams(params) }));
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
  return new Class(snapshotChecks({ type: "number", checks: [], ...normalizeParams(params) }));
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
function _undefined2(Class, params) {
  return new Class({
    type: "undefined",
    ...normalizeParams(params)
  });
}
function _null2(Class, params) {
  return new Class({
    type: "null",
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
function _nan(Class, params) {
  return new Class({
    type: "nan",
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
function _properties(shape, params) {
  return new $ZodCheckProperties({
    check: "properties",
    shape,
    ...normalizeParams(params)
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
function _superRefine(fn, params) {
  let ch = _check((payload) => (payload.addIssue = (issue2) => {
    if (typeof issue2 === "string")
      payload.issues.push(issue(issue2, payload.value, ch._zod.def));
    else {
      let _issue = issue2;
      if (_issue.fatal)
        _issue.continue = !1;
      if (_issue.code ?? (_issue.code = "custom"), !("input" in _issue))
        _issue.input = payload.value;
      _issue.inst ?? (_issue.inst = ch), _issue.continue ?? (_issue.continue = !ch._zod.def.abort), payload.issues.push(issue(_issue));
    }
  }, fn(payload.value, payload)), params);
  return ch;
}
function _check(fn, params) {
  let ch = new $ZodCheck({
    check: "custom",
    ...normalizeParams(params)
  });
  return ch._zod.check = fn, ch;
}
// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/core/to-json-schema.js
function assignProps(target, ...sources) {
  for (let source of sources)
    for (let key of Reflect.ownKeys(source))
      if (Object.prototype.propertyIsEnumerable.call(source, key))
        assignProp(target, key, source[key]);
  return target;
}
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
  if (ctx.io === "input" && isTransforming(schema))
    delete result.schema.examples, delete result.schema.default;
  if (ctx.io === "input" && "_prefault" in result.schema)
    (_a = result.schema).default ?? (_a.default = result.schema._prefault);
  return delete result.schema._prefault, ctx.seen.get(schema).schema;
}
function encodeJSONPointerSegment(segment) {
  return segment.replace(/~/g, "~0").replace(/\//g, "~1");
}
function extractDefs(ctx, schema) {
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
      assignProp(properties, key, merged);
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
        assignProp(defs, seen.defId, seen.def);
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
  if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault" || def.type === "catch")
    return isTransforming(def.innerType, ctx);
  if (def.type === "intersection")
    return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
  if (def.type === "record" || def.type === "map")
    return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
  if (def.type === "pipe") {
    if (_schema._zod.traits.has("$ZodCodec"))
      return !0;
    return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
  }
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
  return processSchema(schema, ctx), extractDefs(ctx, schema), finalize(ctx, schema);
}, createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
  let { libraryOptions, target } = params ?? {}, ctx = initializeContext({ ...libraryOptions ?? {}, target, io, processors });
  return processSchema(schema, ctx), extractDefs(ctx, schema), finalize(ctx, schema);
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
  number_format: formatContributor(NUMBER_FORMAT_RANGES),
  bigint_format: formatContributor(BIGINT_FORMAT_RANGES),
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
var formatMap = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
}, exactPatterns = /* @__PURE__ */ new Map([
  [base64Charset, base64],
  [base64urlCharset, base64url]
]), exactPattern = (p) => exactPatterns.get(p) ?? p, stringProcessor = (schema, ctx, _json, _params) => {
  let json = _json;
  json.type = "string";
  let { minimum, maximum, format, patterns, contentEncoding, laxFormat } = aggregateChecks(schema);
  if (typeof minimum === "number")
    json.minLength = minimum;
  if (typeof maximum === "number")
    json.maxLength = maximum;
  if (format) {
    if (json.format = formatMap[format] ?? format, json.format === "")
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
}, numberProcessor = (schema, ctx, _json, params) => {
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
}, booleanProcessor = (_schema, _ctx, json, _params) => {
  json.type = "boolean";
};
var nullProcessor = (_schema, ctx, json, _params) => {
  if (ctx.target === "openapi-3.0")
    json.type = "string", json.nullable = !0, json.enum = [null];
  else
    json.type = "null";
}, undefinedProcessor = (schema, ctx, json, params) => {
  handleUnrepresentable(schema, ctx, json, params, "Undefined cannot be represented in JSON Schema");
};
var neverProcessor = (_schema, _ctx, json, _params) => {
  json.not = {};
};
var unknownProcessor = (_schema, _ctx, _json, _params) => {};
var enumProcessor = (schema, _ctx, json, _params) => {
  let def = schema._zod.def, values = getEnumValues(def.entries);
  if (values.length === 0) {
    json.not = {};
    return;
  }
  if (values.every((v) => typeof v === "number"))
    json.type = "number";
  if (values.every((v) => typeof v === "string"))
    json.type = "string";
  json.enum = values;
}, literalProcessor = (schema, ctx, json, params) => {
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
}, nanProcessor = (schema, ctx, json, params) => {
  handleUnrepresentable(schema, ctx, json, params, "NaN cannot be represented in JSON Schema");
}, templateLiteralProcessor = (schema, _ctx, json, _params) => {
  let _json = json, pattern = schema._zod.pattern;
  if (!pattern)
    throw Error("Pattern not found in template literal");
  _json.type = "string", _json.pattern = pattern.source;
};
var customProcessor = (schema, ctx, json, params) => {
  handleUnrepresentable(schema, ctx, json, params, "Custom types cannot be represented in JSON Schema");
};
var transformProcessor = (schema, ctx, json, params) => {
  handleUnrepresentable(schema, ctx, json, params, "Transforms cannot be represented in JSON Schema");
};
var arrayProcessor = (schema, ctx, _json, params) => {
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
var objectProcessor = (schema, ctx, _json, params) => {
  let json = _json, def = schema._zod.def, shape = def.shape;
  if (Object.getOwnPropertySymbols(shape).length && handleUnrepresentable(schema, ctx, json, params, "Symbol keys cannot be represented in JSON Schema"))
    return;
  json.type = "object", json.properties = {};
  for (let key in shape)
    assignProp(json.properties, key, processSchema(shape[key], ctx, {
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
}, unionProcessor = (schema, ctx, json, params) => {
  let def = schema._zod.def, isExclusive = def.inclusive === !1, options = def.options.map((x, i) => processSchema(x, ctx, {
    ...params,
    path: [...params.path, isExclusive ? "oneOf" : "anyOf", i]
  }));
  if (isExclusive)
    json.oneOf = options;
  else
    json.anyOf = options;
}, intersectionProcessor = (schema, ctx, json, params) => {
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
    rest.pattern = (types.includes("number") ? number3 : integer).source;
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
var recordProcessor = (schema, ctx, _json, params) => {
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
      assignProp(json.patternProperties, exactPattern(pattern).source, valueSchema);
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
}, nullableProcessor = (schema, ctx, json, params) => {
  let def = schema._zod.def, inner = processSchema(def.innerType, ctx, params), seen = ctx.seen.get(schema);
  if (ctx.target === "openapi-3.0")
    seen.ref = def.innerType, json.nullable = !0;
  else
    json.anyOf = [inner, { type: "null" }];
}, nonoptionalProcessor = (schema, ctx, _json, params) => {
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
var defaultProcessor = (schema, ctx, json, params) => {
  let def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  let value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
  if (value !== UNREPRESENTABLE_DEFAULT)
    json.default = value;
}, prefaultProcessor = (schema, ctx, json, params) => {
  let def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  if (seen.ref = def.innerType, ctx.io !== "input")
    return;
  let value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
  if (value !== UNREPRESENTABLE_DEFAULT)
    json._prefault = value;
}, catchProcessor = (schema, ctx, json, params) => {
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
}, pipeProcessor = (schema, ctx, _json, params) => {
  let def = schema._zod.def, inIsTransform = def.in._zod.traits.has("$ZodTransform"), innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
  processSchema(innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  seen.ref = innerType;
}, readonlyProcessor = (schema, ctx, json, params) => {
  let def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  seen.ref = def.innerType, json.readOnly = !0;
};
var optionalProcessor = (schema, ctx, _json, params) => {
  let def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  let seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
}, lazyProcessor = (schema, ctx, _json, params) => {
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
var initializer2 = (inst, issues) => {
  $ZodError.init(inst, issues), inst.name = "ZodError";
  let proto = Object.getPrototypeOf(inst);
  if (_installedErrorProtos.has(proto))
    return;
  _installedErrorProtos.add(proto), _lazyMethod(proto, "format", (self) => (mapper) => formatError(self, mapper)), _lazyMethod(proto, "flatten", (self) => (mapper) => flattenError(self, mapper)), _lazyMethod(proto, "addIssue", (self) => (issue) => {
    self.issues.push(issue), self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
  }), _lazyMethod(proto, "addIssues", (self) => (issues) => {
    self.issues.push(...issues), self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
  }), Object.defineProperty(proto, "isEmpty", {
    configurable: !0,
    enumerable: !1,
    get() {
      return this.issues.length === 0;
    }
  });
};
var ZodRealError = /* @__PURE__ */ $constructor("ZodError", initializer2, void 0, {
  Parent: Error
});

// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/classic/parse.js
var parse2 = /* @__PURE__ */ _parse(ZodRealError), parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError), safeParse = /* @__PURE__ */ _safeParse(ZodRealError), safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError), encode2 = /* @__PURE__ */ _encode(ZodRealError), decode2 = /* @__PURE__ */ _decode(ZodRealError), encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError), decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError), safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError), safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError), safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError), safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);

// ../../node_modules/.bun/zod@4.6.7/node_modules/zod/v4/classic/schemas.js
function _ensureDefaultLocale() {
  if (!globalConfig.localeError)
    config(en_default());
}
function _ensureDefaultMemoizer() {
  if (!globalConfig.memoizer)
    config({ memoizer: memoizer() });
}
var ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => (_ensureDefaultLocale(), $ZodType.init(inst, def), inst.def = def, inst.type = def.type, inst), {
  check(...chks) {
    let def = this.def;
    return this.clone(mergeDefs(def, {
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
    return clone(this, def, params);
  },
  brand() {
    return this;
  },
  register(reg, meta) {
    return reg.add(this, meta), this;
  },
  refine(check, params) {
    return this.check(refine(check, params));
  },
  superRefine(refinement, params) {
    return this.check(superRefine(refinement, params));
  },
  overwrite(fn) {
    return this.check(_overwrite(fn));
  },
  optional() {
    return optional4(this);
  },
  exactOptional() {
    return exactOptional(this);
  },
  nullable() {
    return nullable(this);
  },
  nullish() {
    return optional4(nullable(this));
  },
  nonoptional(params) {
    return nonoptional(this, params);
  },
  array() {
    return array2(this);
  },
  or(arg) {
    return union2([this, arg]);
  },
  and(arg) {
    return intersection(this, arg);
  },
  transform(tx) {
    return pipe(this, transform3(tx));
  },
  default(d) {
    return _default(this, d);
  },
  prefault(d) {
    return prefault(this, d);
  },
  catch(params) {
    return _catch(this, params);
  },
  pipe(target) {
    return pipe(this, target);
  },
  readonly() {
    return readonly(this);
  },
  describe(description) {
    let cl = this.clone();
    return globalRegistry.add(cl, { description }), cl;
  },
  meta(...args) {
    if (args.length === 0)
      return globalRegistry.get(this);
    let cl = this.clone();
    return globalRegistry.add(cl, args[0]), cl;
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
        input: createStandardJSONSchemaMethod(this, "input"),
        output: createStandardJSONSchemaMethod(this, "output")
      }
    });
  },
  set "~standard"(value) {
    own(this, "~standard", value);
  },
  parse: function _parse(data, params) {
    return parse2(this, data, params, { callee: _parse });
  },
  parseAsync: async function _parseAsync(data, params) {
    return await parseAsync(this, data, params, { callee: _parseAsync });
  },
  safeParse(data, params) {
    return safeParse(this, data, params);
  },
  async safeParseAsync(data, params) {
    return safeParseAsync(this, data, params);
  },
  get spa() {
    return this?.safeParseAsync;
  },
  set spa(value) {
    own(this, "spa", value);
  },
  validate(data, params) {
    return validate2(this, data, params);
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
    return await encodeAsync(this, data, params, { callee: _encodeAsync });
  },
  decodeAsync: async function _decodeAsync(data, params) {
    return await decodeAsync(this, data, params, { callee: _decodeAsync });
  },
  safeEncode(data, params) {
    return safeEncode(this, data, params);
  },
  safeDecode(data, params) {
    return safeDecode(this, data, params);
  },
  async safeEncodeAsync(data, params) {
    return safeEncodeAsync(this, data, params);
  },
  async safeDecodeAsync(data, params) {
    return safeDecodeAsync(this, data, params);
  },
  toJSONSchema(params) {
    return createToJSONSchemaMethod(this, {})(params);
  },
  get description() {
    return globalRegistry.get(this)?.description;
  },
  get _def() {
    return this._zod.def;
  }
}), _ZodString = /* @__PURE__ */ $constructor("_ZodString", (inst, def) => {
  $ZodString.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
}, /* @__PURE__ */ derived({
  format: (inst) => aggregateChecks(inst).format ?? null,
  minLength: (inst) => aggregateChecks(inst).minimum ?? null,
  maxLength: (inst) => aggregateChecks(inst).maximum ?? null
}, {
  regex(...args) {
    return this.check(_regex(...args));
  },
  includes(...args) {
    return this.check(_includes(...args));
  },
  startsWith(...args) {
    return this.check(_startsWith(...args));
  },
  endsWith(...args) {
    return this.check(_endsWith(...args));
  },
  min(...args) {
    return this.check(_minLength(...args));
  },
  max(...args) {
    return this.check(_maxLength(...args));
  },
  length(...args) {
    return this.check(_length(...args));
  },
  nonempty(...args) {
    return this.check(_minLength(1, ...args));
  },
  lowercase(params) {
    return this.check(_lowercase(params));
  },
  uppercase(params) {
    return this.check(_uppercase(params));
  },
  trim() {
    return this.check(_trim());
  },
  normalize(...args) {
    return this.check(_normalize(...args));
  },
  toLowerCase() {
    return this.check(_toLowerCase());
  },
  toUpperCase() {
    return this.check(_toUpperCase());
  },
  slugify() {
    return this.check(_slugify());
  }
})), ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
  $ZodString.init(inst, def), _ZodString.init(inst, def);
}, {
  email(params) {
    return this.check(_email(ZodEmail, params));
  },
  url(params) {
    return this.check(_url(ZodURL, params));
  },
  jwt(params) {
    return this.check(_jwt(ZodJWT, params));
  },
  emoji(params) {
    return this.check(_emoji2(ZodEmoji, params));
  },
  guid(params) {
    return this.check(_guid(ZodGUID, params));
  },
  uuid(params) {
    return this.check(_uuid(ZodUUID, params));
  },
  uuidv4(params) {
    return this.check(_uuidv4(ZodUUID, params));
  },
  uuidv6(params) {
    return this.check(_uuidv6(ZodUUID, params));
  },
  uuidv7(params) {
    return this.check(_uuidv7(ZodUUID, params));
  },
  nanoid(params) {
    return this.check(_nanoid(ZodNanoID, params));
  },
  cuid(params) {
    return this.check(_cuid(ZodCUID, params));
  },
  cuid2(params) {
    return this.check(_cuid2(ZodCUID2, params));
  },
  ulid(params) {
    return this.check(_ulid(ZodULID, params));
  },
  base64(params) {
    return this.check(_base64(ZodBase64, params));
  },
  base64url(params) {
    return this.check(_base64url(ZodBase64URL, params));
  },
  xid(params) {
    return this.check(_xid(ZodXID, params));
  },
  ksuid(params) {
    return this.check(_ksuid(ZodKSUID, params));
  },
  ipv4(params) {
    return this.check(_ipv4(ZodIPv4, params));
  },
  ipv6(params) {
    return this.check(_ipv6(ZodIPv6, params));
  },
  cidrv4(params) {
    return this.check(_cidrv4(ZodCIDRv4, params));
  },
  cidrv6(params) {
    return this.check(_cidrv6(ZodCIDRv6, params));
  },
  e164(params) {
    return this.check(_e164(ZodE164, params));
  },
  datetime(params) {
    return this.check(_isoDateTime(ZodISODateTime, params));
  },
  date(params) {
    return this.check(_isoDate(ZodISODate, params));
  },
  time(params) {
    return this.check(_isoTime(ZodISOTime, params));
  },
  duration(params) {
    return this.check(_isoDuration(ZodISODuration, params));
  }
});
function string4(params) {
  return _string(ZodString, params);
}
var ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
  $ZodStringFormat.init(inst, def), _ZodString.init(inst, def);
}), ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
  $ZodISODateTime.init(inst, def), ZodStringFormat.init(inst, def);
}), ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
  $ZodISODate.init(inst, def), ZodStringFormat.init(inst, def);
}), ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
  $ZodISOTime.init(inst, def), ZodStringFormat.init(inst, def);
}), ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
  $ZodISODuration.init(inst, def), ZodStringFormat.init(inst, def);
}), ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
  $ZodEmail.init(inst, def), ZodStringFormat.init(inst, def);
});
var ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
  $ZodGUID.init(inst, def), ZodStringFormat.init(inst, def);
});
var ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
  $ZodUUID.init(inst, def), ZodStringFormat.init(inst, def);
});
function uuid2(params) {
  return _uuid(ZodUUID, params);
}
var ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
  $ZodURL.init(inst, def), ZodStringFormat.init(inst, def);
});
function url(params) {
  return _url(ZodURL, params);
}
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
  $ZodNumber.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params), inst.isFinite = !0;
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
    return this.check(_gt(value, params));
  },
  gte(value, params) {
    return this.check(_gte(value, params));
  },
  min(value, params) {
    return this.check(_gte(value, params));
  },
  lt(value, params) {
    return this.check(_lt(value, params));
  },
  lte(value, params) {
    return this.check(_lte(value, params));
  },
  max(value, params) {
    return this.check(_lte(value, params));
  },
  int(params) {
    return this.check(int(params));
  },
  safe(params) {
    return this.check(int(params));
  },
  positive(params) {
    return this.check(_gt(0, params));
  },
  nonnegative(params) {
    return this.check(_gte(0, params));
  },
  negative(params) {
    return this.check(_lt(0, params));
  },
  nonpositive(params) {
    return this.check(_lte(0, params));
  },
  multipleOf(value, params) {
    return this.check(_multipleOf(value, params));
  },
  step(value, params) {
    return this.check(_multipleOf(value, params));
  },
  finite() {
    return this;
  }
}));
function number4(params) {
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
function boolean3(params) {
  return _boolean(ZodBoolean, params);
}
var ZodUndefined = /* @__PURE__ */ $constructor("ZodUndefined", (inst, def) => {
  $ZodUndefined.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => undefinedProcessor(inst, ctx, json, params);
});
function _undefined3(params) {
  return _undefined2(ZodUndefined, params);
}
var ZodNull = /* @__PURE__ */ $constructor("ZodNull", (inst, def) => {
  $ZodNull.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => nullProcessor(inst, ctx, json, params);
});
function _null3(params) {
  return _null2(ZodNull, params);
}
var ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
  $ZodUnknown.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => unknownProcessor(inst, ctx, json, params);
});
function unknown2() {
  return _unknown(ZodUnknown);
}
var ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
  $ZodNever.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
});
function never3(params) {
  return _never(ZodNever, params);
}
var ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
  _ensureDefaultMemoizer(), $ZodArray.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params), inst.element = def.element;
}, {
  min(n, params) {
    return this.check(_minLength(n, params));
  },
  nonempty(params) {
    return this.check(_minLength(1, params));
  },
  max(n, params) {
    return this.check(_maxLength(n, params));
  },
  length(n, params) {
    return this.check(_length(n, params));
  },
  unwrap() {
    return this.element;
  }
});
function array2(element, params) {
  return _array(ZodArray, element, params);
}
var ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
  _ensureDefaultMemoizer(), $ZodObjectJIT.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params), installLazyProp(inst, "shape", (self) => self._zod.def.shape, !1);
}, {
  keyof() {
    return _enum(Object.keys(this._zod.def.shape));
  },
  catchall(catchall) {
    return this.clone(mergeDefs(this._zod.def, { catchall }));
  },
  passthrough() {
    return this.clone(mergeDefs(this._zod.def, { catchall: unknown2() }));
  },
  loose() {
    return this.clone(mergeDefs(this._zod.def, { catchall: unknown2() }));
  },
  strict() {
    return this.clone(mergeDefs(this._zod.def, { catchall: never3() }));
  },
  strip() {
    return this.clone(mergeDefs(this._zod.def, { catchall: void 0 }));
  },
  extend(incoming) {
    return extend(this, incoming);
  },
  safeExtend(incoming) {
    return safeExtend(this, incoming);
  },
  merge(other) {
    return merge2(this, other);
  },
  pick(mask) {
    return pick(this, mask);
  },
  omit(mask) {
    return omit3(this, mask);
  },
  partial(...args) {
    return partial(ZodOptional, this, args[0]);
  },
  exactPartial(...args) {
    return partial(ZodExactOptional, this, args[0], "exactPartial");
  },
  required(...args) {
    return required(ZodNonOptional, this, args[0]);
  }
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
function union2(options, params) {
  return new ZodUnion({
    type: "union",
    options,
    ...normalizeParams(params)
  });
}
var ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("ZodDiscriminatedUnion", (inst, def) => {
  ZodUnion.init(inst, def), $ZodDiscriminatedUnion.init(inst, def);
});
function discriminatedUnion(discriminator, options, params) {
  return new ZodDiscriminatedUnion({
    type: "union",
    options,
    discriminator,
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
var ZodRecord = /* @__PURE__ */ $constructor("ZodRecord", (inst, def) => {
  _ensureDefaultMemoizer(), $ZodRecord.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => recordProcessor(inst, ctx, json, params), inst.keyType = def.keyType, inst.valueType = def.valueType;
});
function record2(keyType, valueType, params) {
  if (!valueType || !valueType._zod)
    return new ZodRecord({
      type: "record",
      keyType: string4(),
      valueType: keyType,
      ...normalizeParams(valueType)
    });
  return new ZodRecord({
    type: "record",
    keyType,
    valueType,
    ...normalizeParams(params)
  });
}
var ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
  $ZodEnum.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params), inst.enum = def.entries, inst.options = [...inst._zod.values];
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
var ZodLiteral = /* @__PURE__ */ $constructor("ZodLiteral", (inst, def) => {
  $ZodLiteral.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params), inst.values = new Set(def.values), Object.defineProperty(inst, "value", {
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
    ...normalizeParams(params)
  });
}
var ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
  _ensureDefaultMemoizer(), $ZodTransform.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params), inst._zod.parse = (payload, _ctx) => {
    if (_ctx.direction === "backward")
      throw new $ZodEncodeError(inst.constructor.name);
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string")
        payload.issues.push(issue(issue2, payload.value, def));
      else {
        let _issue = issue2;
        if (_issue.fatal)
          _issue.continue = !1;
        if (_issue.code ?? (_issue.code = "custom"), !("input" in _issue))
          _issue.input = payload.value;
        _issue.inst ?? (_issue.inst = inst), payload.issues.push(issue(_issue));
      }
    };
    let output = def.transform(payload.value, payload);
    if (output instanceof Promise)
      return output.then((output) => (payload.value = output, payload));
    return payload.value = output, payload;
  };
});
function transform3(fn) {
  return new ZodTransform({
    type: "transform",
    transform: fn
  });
}
var ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
  $ZodOptional.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.innerType;
});
function optional4(innerType) {
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
    catchValue: typeof catchValue === "function" ? catchValue : constantCatch(catchValue)
  });
}
var ZodNaN = /* @__PURE__ */ $constructor("ZodNaN", (inst, def) => {
  $ZodNaN.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => nanProcessor(inst, ctx, json, params);
});
function nan(params) {
  return _nan(ZodNaN, params);
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
var ZodTemplateLiteral = /* @__PURE__ */ $constructor("ZodTemplateLiteral", (inst, def) => {
  $ZodTemplateLiteral.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => templateLiteralProcessor(inst, ctx, json, params);
});
function templateLiteral(parts, params) {
  return new ZodTemplateLiteral({
    type: "template_literal",
    parts,
    ...normalizeParams(params)
  });
}
var ZodLazy = /* @__PURE__ */ $constructor("ZodLazy", (inst, def) => {
  $ZodLazy.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => lazyProcessor(inst, ctx, json, params), inst.unwrap = () => inst._zod.def.getter();
});
function lazy(getter) {
  return new ZodLazy({
    type: "lazy",
    getter
  });
}
var ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
  $ZodCustom.init(inst, def), ZodType.init(inst, def), inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
});
function refine(fn, _params = {}) {
  return _refine(ZodCustom, fn, _params);
}
function superRefine(fn, params) {
  return _superRefine(fn, params);
}
var ZodInstanceOf = /* @__PURE__ */ $constructor("ZodInstanceOf", (inst, def) => {
  ZodCustom.init(inst, def);
}, {
  properties(shape, params) {
    return this.check(_properties(shape, params));
  }
});
function _instanceof(cls, params = {}) {
  let inst = new ZodInstanceOf({
    type: "custom",
    check: "custom",
    fn: (data) => data instanceof cls,
    abort: !0,
    ...normalizeParams(params)
  });
  return inst._zod.bag.Class = cls, inst._zod.check = (payload) => {
    if (!(payload.value instanceof cls))
      payload.issues.push({
        code: "invalid_type",
        expected: cls.name,
        input: payload.value,
        inst,
        path: [...inst._zod.def.path ?? []]
      });
  }, inst;
}
function json(params) {
  let jsonSchema = lazy(() => union2([string4(params), number4(), boolean3(), _null3(), array2(jsonSchema), record2(string4(), jsonSchema)]));
  return jsonSchema;
}
// src/billing-rpc.ts
var ChargeSchema = union2([
  literal("personal"),
  templateLiteral(["project:", uuid2()])
]), SessionInput = object({ sessionID: string4() }), BillingRpc = define({
  events: {},
  id: "forge.billing",
  methods: {
    choices: {
      input: SessionInput,
      output: object({
        choices: array2(object({ description: string4(), label: string4(), target: ChargeSchema })),
        current: ChargeSchema,
        sessionID: string4()
      })
    },
    switch: {
      input: SessionInput.extend({ target: ChargeSchema }),
      output: _null3()
    }
  }
});

// tui.ts
var pickBudget = async (ctx, choices, signal) => {
  signal.throwIfAborted();
  let id = ID2.create(), { promise: answer, resolve: finish } = Promise.withResolvers(), reply = ctx.data.on("form.replied", (event) => {
    if (event.data.id === id) {
      let parsed = ChargeSchema.safeParse(event.data.answer.budget);
      finish(parsed.success ? parsed.data : void 0);
    }
  }), cancel = ctx.data.on("form.cancelled", (event) => {
    if (event.data.id === id)
      finish(void 0);
  }), abort = () => {
    finish(void 0);
  };
  signal.addEventListener("abort", abort, { once: !0 });
  try {
    return await ctx.client.session.form.create({
      fields: [
        {
          custom: !1,
          default: choices.choices.some((choice) => choice.target === choices.current) ? choices.current : "personal",
          key: "budget",
          options: choices.choices.map((choice) => ({
            description: choice.description,
            label: choice.label,
            value: choice.target
          })),
          required: !0,
          title: "Which budget should pay for this session and its subagents?",
          type: "string"
        }
      ],
      id,
      sessionID: choices.sessionID,
      title: "Forge billing"
    }), await ctx.data.session.form.sync(choices.sessionID), await answer;
  } finally {
    if (reply(), cancel(), signal.removeEventListener("abort", abort), signal.aborted)
      await ctx.client.session.form.cancel({ formID: id, sessionID: choices.sessionID }).catch(() => {});
  }
}, tui_default = Plugin.define({
  id: "forge",
  setup(ctx) {
    let controller = new AbortController, pending = !1;
    return ctx.keymap.layer(() => ({
      commands: [
        {
          group: "Forge",
          id: "forge.billing",
          palette: !0,
          run: async () => {
            if (pending)
              return;
            pending = !0;
            try {
              let route = ctx.ui.router.current(), session = route.type === "session" ? await ctx.client.session.get({ sessionID: route.sessionID }) : await ctx.client.session.create({ location: ctx.location }), billing = ctx.client.rpc(BillingRpc), options = { location: session.location }, choices = await billing.choices({ sessionID: session.id }, options);
              ctx.ui.router.navigate({ sessionID: choices.sessionID, type: "session" });
              let target = await pickBudget(ctx, choices, controller.signal);
              if (target !== void 0)
                await billing.switch({ sessionID: choices.sessionID, target: ChargeSchema.parse(target) }, options);
            } catch (error) {
              ctx.ui.toast.show({
                message: error instanceof Error ? error.message : String(error),
                title: "Forge billing",
                variant: "error"
              });
            } finally {
              pending = !1;
            }
          },
          slash: { name: "forge:billing" },
          title: "Forge: choose billing budget"
        }
      ],
      mode: "global"
    })), () => {
      controller.abort();
    };
  }
});
export {
  tui_default as default
};

// Third-party licenses
// @opencode/schema@2.1.4
// License: MIT (package contains no LICENSE file)
//
// effect@4.0.1
// MIT License
//
// Copyright (c) 2023 Effectful Technologies Inc
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
