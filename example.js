
/**
 * Example.
 */

var path = require('./');

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
