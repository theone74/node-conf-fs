```javascript
var conf=require('conf-fs')();
//var conf=require('conf-fs')('path/to/conf');

console.log('Value or default: %s', conf.get('param1', 'default value'));
console.log('Value or null: %s', conf.get('param1'));

conf.set('param1', 'hello world');
```