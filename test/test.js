
/**
 * Test.
 */

var assert = require('assert');

var path = require('../');

describe("path(s)", function(){
  describe("when called with something other than a string", function(){
    it("should throw an error", function(){
      assert.throws(function(){ path(); });
      assert.throws(function(){ path(null); });
      assert.throws(function(){ path(undefined); });
      assert.throws(function(){ path({}); });
      assert.throws(function(){ path([]); });
      assert.throws(function(){ path(new Date); });
      assert.throws(function(){ path(1); });
      assert.throws(function(){ path(/\w/g); });
      assert.throws(function(){ path(true); });
    })
  })

  describe("when called with a string", function(){
    it("should return a function", function(){
      var users = path('users');
      assert('function' == typeof users);
    })

    it("should have method `range()`", function(){
      var users = path('users');
      assert('range' in users);
      assert('function' == typeof users.range);
    })
  })
})

describe(".path('name')", function(){
  describe("when called with no arguments", function(){
    it("should return the name", function(){
      var users = path('users');
      assert('users' == users());
    })
  })

  describe("when called with arguments", function(){
    it("should return the name", function(){
      var users = path('users');
      assert('users' == users(1));
      assert('users' == users(1, 2));
      assert('users' == users({}));
      assert('users' == users([]));
      assert('users' == users('foo'));
    })
  })

  describe(".range(range)", function(){
    describe("when called with no arguments", function(){
      it("should return return a range for just the name", function(){
        var users = path('users');
        assert.deepEqual({
          start: 'users',
          end: 'users'
        }, users.range());
      })
    })

    describe("when called with start and end arguments", function(){
      it("should return return a range for just the name", function(){
        var users = path('users');
        var range = users.range({ start: 'a', end: 'z' });
        assert.deepEqual({
          start: 'users',
          end: 'users',
        }, {
          start: range.start,
          end: range.end
        });
      })
    })
  })
})

describe(".path('name/:id')", function(){
  describe("when called with no arguments", function(){
    it("should return the namespace start", function(){
      var users = path('users/:id');
      assert('users/id/\xff' == users());
    })
  })

  describe("when called with a number", function(){
    it("should return a key", function(){
      var users = path('users/:id');
      assert('users/id/\xff1' == users(1));
    })
  })

  describe("when called with a string", function(){
    it("should return a key", function(){
      var users = path('users/:id');
      assert('users/id/\xfffoo' == users('foo'));
    })
  })

  describe("when called with an object that contains `id`", function(){
    it("should return a key", function(){
      var users = path('users/:id');
      assert('users/id/\xfffoo' == users({ id: 'foo' }));
    })
  })

  describe("when called with an object that doesn't contain `id`", function(){
    it("should return the namespace start", function(){
      var users = path('users/:id');
      assert('users/id/\xff' == users({ other: 'foo' }));
    })
  })

  describe("when called with an empty array", function(){
    it("should return the namespace start", function(){
      var users = path('users/:id');
      assert('users/id/\xff' == users([]));
    })
  })

  describe("when called with an array with the first element being a number", function(){
    it("should return a key with the first element of the array as the `id`", function(){
      var users = path('users/:id');
      assert('users/id/\xff1' == users([1]));
    })
  })

  describe("when called with an array with the first element being a string", function(){
    it("should return a key with the first element of the array as the `id`", function(){
      var users = path('users/:id');
      assert('users/id/\xfffoo' == users(['foo']));
    })
  })

  describe("when called with an array with the first element being an object", function(){
    it("should return the namespace start", function(){
      var users = path('users/:id');
      assert('users/id/\xff' == users([{ id: 'foo' }]));
    })
  })

  describe("when passing a default object", function(){
    describe("when called with no arguments", function(){
      it("should mix the object into the result", function(){
        var users = path('users/:id', { id: 'foo' });
        assert('users/id/\xfffoo' == users());
      })
    })

    describe("when called with overriding object", function(){
      it("should override the defaults", function(){
        var users = path('users/:id', { id: 'foo' });
        assert('users/id/\xffbar' == users({ id: 'bar' }));
      })
    })
  })

  describe(".range(range)", function(){
    describe("when called with no arguments", function(){
      it("should return the full range", function(){
        var users = path('users/:id');
        var range = users.range();
        assert.deepEqual({
          start: 'users/id/\xff',
          end: 'users/id/\xff\xff',
        }, {
          start: range.start,
          end: range.end
        });
      })
    })

    describe("passing an object with numbers", function(){
      describe("when called a `start`", function(){
        it("should return the range from `start` to last", function(){
          var users = path('users/:id');
          var range = users.range({ start: 5 });
          assert.deepEqual({
            start: 'users/id/\xff5',
            end: 'users/id/\xff\xff',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })

      describe("when called an `end`", function(){
        it("should return the range from begin to `end`", function(){
          var users = path('users/:id');
          var range = users.range({ end: 5 });
          assert.deepEqual({
            start: 'users/id/\xff',
            end: 'users/id/\xff5',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })

      describe("when called with both `start` and `end`", function(){
        it("should return the range from `start` to `end`", function(){
          var users = path('users/:id');
          var range = users.range({ start: 5, end: 7 });
          assert.deepEqual({
            start: 'users/id/\xff5',
            end: 'users/id/\xff7',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })
    })

    describe("passing an object with strings", function(){

      describe("when called a `start`", function(){
        it("should return the range from `start` to last", function(){
          var users = path('users/:id');
          var range = users.range({ start: 'a' });
          assert.deepEqual({
            start: 'users/id/\xffa',
            end: 'users/id/\xff\xff',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })

      describe("when called an `end`", function(){
        it("should return the range from begin to `end`", function(){
          var users = path('users/:id');
          var range = users.range({ end: 'z' });
          assert.deepEqual({
            start: 'users/id/\xff',
            end: 'users/id/\xffz',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })

      describe("when called with both `start` and `end`", function(){
        it("should return the range from `start` to `end`", function(){
          var users = path('users/:id');
          var range = users.range({ start: 'a', end: 'z' });
          assert.deepEqual({
            start: 'users/id/\xffa',
            end: 'users/id/\xffz',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })
    })

    describe("passing an object with objects", function(){

      describe("when called a `start`", function(){
        it("should return the range from `start` to last", function(){
          var users = path('users/:id');
          var user = { id: 5 };
          var range = users.range({ start: user });
          assert.deepEqual({
            start: 'users/id/\xff5',
            end: 'users/id/\xff\xff',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })

      describe("when called an `end`", function(){
        it("should return the range from begin to `end`", function(){
          var users = path('users/:id');
          var user = { id: 5 };
          var range = users.range({ end: user });
          assert.deepEqual({
            start: 'users/id/\xff',
            end: 'users/id/\xff5',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })

      describe("when called with both `start` and `end`", function(){
        it("should return the range from `start` to `end`", function(){
          var users = path('users/:id');
          var user_start = { id: 5 };
          var user_end = { id: 7 };
          var range = users.range({ start: user_start, end: user_end });
          assert.deepEqual({
            start: 'users/id/\xff5',
            end: 'users/id/\xff7',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })
    })

    describe("passing an object with mixed types", function(){

      describe("when called with number `start` and object `end`", function(){
        it("should return the range from `start` to `end`", function(){
          var users = path('users/:id');
          var user_end = { id: 7 };
          var range = users.range({ start: 5, end: user_end });
          assert.deepEqual({
            start: 'users/id/\xff5',
            end: 'users/id/\xff7',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })

      describe("when called with object `start` and number `end`", function(){
        it("should return the range from `start` to `end`", function(){
          var users = path('users/:id');
          var user_start = { id: 5 };
          var range = users.range({ start: user_start, end: 7 });
          assert.deepEqual({
            start: 'users/id/\xff5',
            end: 'users/id/\xff7',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })

      describe("when called with string `start` and object `end`", function(){
        it("should return the range from `start` to `end`", function(){
          var users = path('users/:id');
          var user_end = { id: 7 };
          var range = users.range({ start: '5', end: user_end });
          assert.deepEqual({
            start: 'users/id/\xff5',
            end: 'users/id/\xff7',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })

      describe("when called with object `start` and string `end`", function(){
        it("should return the range from `start` to `end`", function(){
          var users = path('users/:id');
          var user_start = { id: 5 };
          var range = users.range({ start: user_start, end: '7' });
          assert.deepEqual({
            start: 'users/id/\xff5',
            end: 'users/id/\xff7',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })

    })

    describe("when passing `reverse: true`", function(){
      describe("when passing `start`", function(){
        it("should fix range", function(){
          var users = path('users/:id');
          var range = users.range({ start: 'a', reverse: true });
          assert.deepEqual({
            start: 'users/id/\xff\xff',
            end: 'users/id/\xffa',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })

      describe("when passing `end`", function(){
        it("should fix range", function(){
          var users = path('users/:id');
          var range = users.range({ end: 'z', reverse: true });
          assert.deepEqual({
            start: 'users/id/\xffz',
            end: 'users/id/\xff',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })

      describe("when passing both `start` and `end`", function(){
        it("should fix range", function(){
          var users = path('users/:id');
          var range = users.range({ start: 'a', end: 'z', reverse: true });
          assert.deepEqual({
            start: 'users/id/\xffz',
            end: 'users/id/\xffa',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })
    })
  })
})

describe(".path('name/:some/deep/:key/:id')", function(){
  describe("when called with no arguments", function(){
    it("should return the namespace start", function(){
      var users = path('users/:some/deep/:key/:id');
      assert('users/some//deep/key//id/\xff' == users());
    })
  })

  describe("when passing arguments", function(){
    it("should replace the keys in series", function(){
      var users = path('users/:some/deep/:key/:id');
      assert('users/some/foo/deep/key//id/\xff' == users('foo'));
      assert('users/some/foo/deep/key/bar/id/\xff' == users('foo', 'bar'));
      assert('users/some/foo/deep/key/bar/id/\xff5' == users('foo', 'bar', 5));
    })
  })

  describe("when passing an object", function(){
    it("should replace the matching keys", function(){
      var users = path('users/:some/deep/:key/:id');
      assert('users/some/foo/deep/key//id/\xff' == users({ some: 'foo' }));
      assert('users/some/foo/deep/key/bar/id/\xff' == users({ some: 'foo', key: 'bar' }));
      assert('users/some/foo/deep/key/bar/id/\xff5' == users({ some: 'foo', key: 'bar', id: 5 }));
    })
  })

  describe("when passing multiple objects", function(){
    it("should merge and replace the matching keys", function(){
      var users = path('users/:some/deep/:key/:id');
      assert('users/some/foo/deep/key//id/\xff' == users({ some: 'foo' }));
      assert('users/some/foo/deep/key/bar/id/\xff' == users({ some: 'foo' }, { key: 'bar' }));
      assert('users/some/foo/deep/key/bar/id/\xff5' == users({ some: 'foo' }, { key: 'bar' }, { id: 5 }));
    })
  })

  describe("when mixing objects and arguments", function(){
    it("should merge and replace the matching keys", function(){
      var users = path('users/:some/deep/:key/:id');
      assert('users/some/foo/deep/key//id/\xff' == users({ some: 'foo' }));
      assert('users/some/foo/deep/key/bar/id/\xff' == users({ some: 'foo' }, 'bar'));
      assert('users/some/foo/deep/key/bar/id/\xff' == users('bar', { some: 'foo' }));
      assert('users/some/foo/deep/key/bar/id/\xff5' == users('foo', { key: 'bar' }, 5));
    })
  })

  describe("when passing a default object", function(){
    describe("when called with no arguments", function(){
      it("should mix the object into the result", function(){
        var users = path('users/:some/deep/:key/:id', { key: 'bar' });
        assert('users/some//deep/key/bar/id/\xff' == users());
      })
    })

    describe("when called with an object", function(){
      it("should mix defaults with object", function(){
        var users = path('users/:some/deep/:key/:id', { key: 'bar' });
        assert('users/some/foo/deep/key/bar/id/\xff' == users({ some: 'foo' }));
      })
    })

    describe("when called with arguments", function(){
      it("should mix defaults with arguments", function(){
        var users = path('users/:some/deep/:key/:id', { key: 'bar' });
        assert('users/some/foo/deep/key/bar/id/\xff' == users('foo'));
        assert('users/some/foo/deep/key/bar/id/\xff5' == users('foo', 5));
      })
    })
  })

  describe(".range(range)", function(){
    describe("when called with no arguments", function(){
      it("should return the full range", function(){
        var users = path('users/:some/deep/:key/:id');
        var range = users.range();
        assert.deepEqual({
          start: 'users/some//deep/key//id/\xff',
          end: 'users/some//deep/key//id/\xff\xff',
        }, {
          start: range.start,
          end: range.end
        });
      })
    })

    describe("passing an object with numbers", function(){
      describe("when called defaults and a `start`", function(){
        it("should return the range from `start` to last", function(){
          var users = path('users/:some/deep/:key/:id', { some: 'foo', key: 'bar' });
          var range = users.range({ start: 5 });
          assert.deepEqual({
            start: 'users/some/foo/deep/key/bar/id/\xff5',
            end: 'users/some/foo/deep/key/bar/id/\xff\xff',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })

      describe("when called an `end`", function(){
        it("should return the range from begin to `end`", function(){
          var users = path('users/:some/deep/:key/:id', { some: 'foo', key: 'bar' });
          var range = users.range({ end: 7 });
          assert.deepEqual({
            start: 'users/some/foo/deep/key/bar/id/\xff',
            end: 'users/some/foo/deep/key/bar/id/\xff7',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })

      describe("when called with both `start` and `end`", function(){
        it("should return the range from `start` to `end`", function(){
          var users = path('users/:some/deep/:key/:id', { some: 'foo', key: 'bar' });
          var range = users.range({ start: 5, end: 7 });
          assert.deepEqual({
            start: 'users/some/foo/deep/key/bar/id/\xff5',
            end: 'users/some/foo/deep/key/bar/id/\xff7',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })
    })

    describe("passing an object with strings", function(){
      describe("when called a `start`", function(){
        it("should return the range from `start` to last", function(){
          var users = path('users/:some/deep/:key/:id', { some: 'foo', key: 'bar' });
          var range = users.range({ start: 'a' });
          assert.deepEqual({
            start: 'users/some/foo/deep/key/bar/id/\xffa',
            end: 'users/some/foo/deep/key/bar/id/\xff\xff',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })

      describe("when called an `end`", function(){
        it("should return the range from begin to `end`", function(){
          var users = path('users/:some/deep/:key/:id', { some: 'foo', key: 'bar' });
          var range = users.range({ end: 'z' });
          assert.deepEqual({
            start: 'users/some/foo/deep/key/bar/id/\xff',
            end: 'users/some/foo/deep/key/bar/id/\xffz',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })

      describe("when called with both `start` and `end`", function(){
        it("should return the range from `start` to `end`", function(){
          var users = path('users/:some/deep/:key/:id', { some: 'foo', key: 'bar' });
          var range = users.range({ start: 'a', end: 'z' });
          assert.deepEqual({
            start: 'users/some/foo/deep/key/bar/id/\xffa',
            end: 'users/some/foo/deep/key/bar/id/\xffz',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })
    })

    describe("passing an object with objects", function(){
      describe("when called a `start`", function(){
        it("should return the range from `start` to last", function(){
          var users = path('users/:some/deep/:key/:id', { some: 'foo', key: 'bar' });
          var user = { id: 5 };
          var range = users.range({ start: user });
          assert.deepEqual({
            start: 'users/some/foo/deep/key/bar/id/\xff5',
            end: 'users/some/foo/deep/key/bar/id/\xff\xff',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })

      describe("when called an `end`", function(){
        it("should return the range from begin to `end`", function(){
          var users = path('users/:some/deep/:key/:id', { some: 'foo', key: 'bar' });
          var user = { id: 5 };
          var range = users.range({ end: user });
          assert.deepEqual({
            start: 'users/some/foo/deep/key/bar/id/\xff',
            end: 'users/some/foo/deep/key/bar/id/\xff5',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })

      describe("when called with both `start` and `end`", function(){
        it("should return the range from `start` to `end`", function(){
          var users = path('users/:some/deep/:key/:id', { some: 'foo', key: 'bar' });
          var user_start = { id: 5 };
          var user_end = { id: 7 };
          var range = users.range({ start: user_start, end: user_end });
          assert.deepEqual({
            start: 'users/some/foo/deep/key/bar/id/\xff5',
            end: 'users/some/foo/deep/key/bar/id/\xff7',
          }, {
            start: range.start,
            end: range.end
          });
        })
      })
    })
  })
})
