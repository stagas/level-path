
/*!
 *
 * level-path
 *
 * MIT
 *
 */

/**
 * Module dependencies.
 */

var fix = require('level-fix-range');
var extend = require('xtend');

/**
 * Expose `path`.
 */

module.exports = path;

/**
 * Creates a namespace for `str`.
 *
 * Optionally pass `defs` to bind an object
 * to always be evaluated first.
 *
 * @param {String} str
 * @param {Object} [defs]
 * @return {Function}
 * @api public
 */

function path(str, defs){
  var tmpl = parse(str);

  /**
   * Generates a key for `ctx` and arguments.
   * @param {Mixed} [ctx, [...]]
   * @return {String}
   * @api public
   */

  function p(ctx){
    ctx = extend(arguments, defs, ctx, extend.apply(this, arguments));
    return format(tmpl, ctx);
  }

  /**
   * Generates a key range with `start` and `end`.
   *
   * @param {Object} range
   * @return {Object}
   * @api public
   */

  p.range = function(range){
    var r = extend(defs, range, arguments);
    r.start = p(r.start || r[0], range);
    r.end = p(r.end || r[1], range, { rangeEnd: true });
    return fix(r);
  };

  return p;
}

/**
 * Join `comb` to a path factory.
 *
 * @param {Array} comb
 * @param {Object} defs
 * @return {Function}
 */

path.join = function(comb, defs){
  return path(':'+comb.join('/:'), defs);
};

/**
 * Parses keys in `s`.
 *
 * @param {String} s
 * @return {Object}
 * @api private
 */

function parse(s){
  return {
    input: s,
    keys: s.match(/:\w+/g) || []
  };
}

/**
 * Format a template using `ctx`.
 *
 * @param {Object} tmpl
 * @param {Object} ctx
 * @return {String}
 * @api private
 */

function format(tmpl, ctx){
  var s = tmpl.input;
  var keys = tmpl.keys;
  var getValue = getValueFactory();
  var mapped = keys.map(function(el, i){
    var last = keys.length == i + 1;
    var key = el.substr(1);
    var val = getValue(ctx, key);
    return (
      (last ? '\xff' : '')
    + (val || (last && ctx.rangeEnd ? '\xff' : ''))
    );
  });
  mapped.forEach(function(el, i){
    var key = keys[i];
    s = s.replace(key, key.substr(1) + '/' + el);
  });
  return s;
}

/**
 * Generates a getValue function.
 *
 * @return {Function}
 * @api private
 */

function getValueFactory(){
  var i = 0;

  /**
   * Extract reasonable values to be used
   * for key interpolation.
   *
   * @param {Mixed} obj
   * @param {String} key
   * @return {String|Number}
   * @api private
   */

  return function getValue(obj, key){
    switch (typeof obj) {
      case 'string':
      case 'number':
        return obj;

      case 'object':
        if (null === obj) return '';
        else if (obj instanceof Date) return obj.getTime();
        else if (key in obj && 'object' != typeof obj[key]) return obj[key];
        else if (i in obj) return nextNonObjectInArray(obj);
        else return '';

      case 'boolean':
        return obj;

      default:
        return '';
    }
  };

  /**
   * Advances iterator until a non-object is
   * found and returns it.
   *
   * @param {Object} obj
   * @return {Mixed}
   * @api private
   */

  function nextNonObjectInArray(obj){
    var ret;
    while (ret = obj[i++]) {
      if ('object' != typeof ret) return ret;
    }
    return '';
  }
}
