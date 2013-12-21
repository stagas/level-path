
# level-path

sensible key / range generator for levelup

## Installing

`npm install level-path`

## Example

```js
var path = require('level-path');

var users = path('users/:id');
var index = path('index/:model/:attr/:value/:id', { model: users() });

var user = { id: 1, username: 'john' };

console.log(users(user)); // => users/id/\xff1
console.log(users('foo')); // => users/id/\xfffoo

console.log(index({
  id: user.id,
  attr: 'username',
  value: user.username
})); // => index/model/users/id/\xff/attr/username/value/john/id/\xff1

console.log(index({ attr: 'username' }, user.username, user.id));
// => index/model/users/id/\xff/attr/username/value/john/\xff1

console.log(users.range({ start: 5 }));
// => { start: 'users/id/\xff5', end: 'users/id/\xff\xff' }

var last = { id: 15, username: 'mary' };

console.log(users.range({
  start: user,
  end: last
})); // => { start: 'users/id/\xff1', end: 'users/id/\xff15' }

console.log(index.range({
  attr: 'username',
  value: 'john'
}));
// =>
// { start: 'index/model/users/id/\xff/attr/username/value/john/id/\xff',
//   end: 'index/model/users/id/\xff/attr/username/value/john/id/\xff\xff' }
```

## API

### key = path(str[, defaults])

Creates a key / range generator function for `str`.

Keys are defined using sinatra style `some/:random/:key` paths.

The last key is considered the range key and will be prefixed
accordingly so ranges can be generated for it later with `.range()`.

Optionally pass `defaults` to bind an object
to always be evaluated first.

### key([any[, ...]])

Generates a key using attributes found in passed values.

### key.range([{ start: [any], end: [any] }])

Generates a key range using optional `start` / `end` attributes.

They can be ommitted for the full key range.

## License

MIT
