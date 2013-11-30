
/**
 * Example.
 */

var path = require('./');

var users = path('users/:id');
var index = path('index/:model/:attr/:value/:id', { model: users() });

var user = { id: 1, username: 'john' };

console.log(users(user)); // => users/\xff1
console.log(users('foo')); // => users/\xfffoo

console.log(index({
  id: user.id,
  attr: 'username',
  value: user.username
})); // => index/users/\xff/username/john/\xff1

console.log(index({ attr: 'username' }, user.username, user.id));
// => index/users/\xff/username/john/\xff1

console.log(users.range({ start: 5 }));
// => { start: 'users/\xff5', end: 'users/\xff\xff' }

var last = { id: 15, username: 'mary' };

console.log(users.range({
  start: user,
  end: last
})); // => { start: 'users/\xff1', end: 'users/\xff15' }

console.log(index.range({
  attr: 'username',
  value: 'john'
}));
// =>
// { start: 'index/users/\xff/username/john/\xff',
//   end: 'index/users/\xff/username/john/\xff\xff' }
